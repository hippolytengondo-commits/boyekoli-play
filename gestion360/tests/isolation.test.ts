import { beforeAll, describe, expect, it } from "vitest";
import { prisma, withContext, withTenant } from "@/lib/db";
import { createDepartment, listDepartments, updateDepartment, deleteDepartment } from "@/modules/departments/service";
import { createEmployee, getEmployee, listEmployees, updateEmployee } from "@/modules/employees/service";
import { listRoles, updateRole } from "@/modules/rbac/service";
import { listMembers, changeMemberRoles, setMemberStatus } from "@/modules/members/service";
import { listAuditLogs } from "@/modules/audit/service";
import { getDashboard } from "@/modules/dashboard/service";
import { authenticate } from "@/lib/auth";
import { newOrg } from "./helpers";

type Org = Awaited<ReturnType<typeof newOrg>>;
let A: Org, B: Org;
let deptA: string, empA: string;

beforeAll(async () => {
  A = await newOrg("Alpha SARL");
  B = await newOrg("Bravo SA");
  deptA = (await createDepartment(A.ctx, { name: "Finance A", code: "FIN" })).id;
  await createDepartment(B.ctx, { name: "Finance B", code: "FIN" }); // même code autorisé dans une autre entreprise
  empA = (await createEmployee(A.ctx, { firstName: "Alice", lastName: "Alpha", departmentId: deptA })).id;
});

describe("Isolation entre entreprises (scénario 20, articles 34 et 39)", () => {
  it("les listes ne contiennent que les données de sa propre entreprise", async () => {
    expect((await listDepartments(B.ctx)).map((d) => d.name)).toEqual(["Finance B"]);
    const emps = (await listEmployees(B.ctx, { page: 1, pageSize: 50 })).items as { lastName: string }[];
    expect(emps.some((e) => e.lastName === "Alpha")).toBe(false);
    expect((await listMembers(B.ctx)).length).toBe(1);
    expect((await listRoles(B.ctx)).length).toBe(15);
  });

  it("modifier un identifiant pour viser une ressource d'une autre entreprise donne 404", async () => {
    await expect(getEmployee(B.ctx, empA)).rejects.toMatchObject({ status: 404 });
    await expect(updateEmployee(B.ctx, empA, { firstName: "Pirate" })).rejects.toMatchObject({ status: 404 });
    await expect(updateDepartment(B.ctx, deptA, { name: "Pirate" })).rejects.toMatchObject({ status: 404 });
    await expect(deleteDepartment(B.ctx, deptA)).rejects.toMatchObject({ status: 404 });
    const roleA = (await listRoles(A.ctx))[1];
    await expect(updateRole(B.ctx, roleA.id, { name: "Pirate" })).rejects.toMatchObject({ status: 404 });
    const mA = (await listMembers(A.ctx))[0];
    await expect(changeMemberRoles(B.ctx, mA.id, { roleIds: [roleA.id] })).rejects.toMatchObject({ status: 404 });
    await expect(setMemberStatus(B.ctx, mA.id, { status: "SUSPENDED" })).rejects.toMatchObject({ status: 404 });
  });

  it("refuse de rattacher un employé à un département d'une autre entreprise", async () => {
    await expect(createEmployee(B.ctx, { firstName: "X", lastName: "Y", departmentId: deptA })).rejects.toMatchObject({ status: 400 });
  });

  it("la base refuse même du SQL brut visant une autre entreprise (RLS)", async () => {
    const rows = await withTenant(B.organizationId, B.userId, (tx) => tx.$queryRaw<{ id: string }[]>`SELECT id FROM employees WHERE id = ${empA}`);
    expect(rows).toHaveLength(0);
    const all = await withTenant(B.organizationId, B.userId, (tx) => tx.$queryRaw<{ o: string }[]>`SELECT DISTINCT "organizationId" o FROM employees`);
    expect(all.map((r) => r.o)).toEqual([B.organizationId]);
    await expect(withTenant(B.organizationId, B.userId, (tx) =>
      tx.$executeRaw`INSERT INTO departments (id, "organizationId", name, code, "updatedAt") VALUES ('x1', ${A.organizationId}, 'Intrus', 'ZZZ', now())`)).rejects.toThrow();
    const upd = await withTenant(B.organizationId, B.userId, (tx) => tx.$executeRaw`UPDATE employees SET "firstName"='Pirate' WHERE id = ${empA}`);
    expect(upd).toBe(0);
    const del = await withTenant(B.organizationId, B.userId, (tx) => tx.$executeRaw`DELETE FROM departments WHERE id = ${deptA}`);
    expect(del).toBe(0);
  });

  it("la clé étrangère composite interdit un lien inter-entreprises même avec le contexte A", async () => {
    // Un employé de A ne peut pas pointer vers le département d'une entreprise B.
    const deptB = await withTenant(B.organizationId, B.userId, (tx) => tx.department.findFirstOrThrow());
    await expect(withTenant(A.organizationId, A.userId, (tx) =>
      tx.$executeRaw`INSERT INTO employees (id, "organizationId", matricule, "firstName", "lastName", "departmentId", "updatedAt") VALUES ('e-x', ${A.organizationId}, 'EMP-X', 'a', 'b', ${deptB.id}, now())`)).rejects.toThrow();
  });

  it("sans contexte, aucune table métier n'est lisible", async () => {
    for (const t of ["employees", "departments", "roles", "memberships", "audit_logs", "invitations", "organizations", "users"]) {
      const r = await prisma.$queryRawUnsafe<{ n: bigint }[]>(`SELECT count(*) n FROM ${t}`);
      expect(Number(r[0].n), t).toBe(0);
    }
  });

  it("le journal d'audit est en ajout seul (UPDATE/DELETE refusés)", async () => {
    await expect(withTenant(A.organizationId, A.userId, (tx) => tx.$executeRaw`UPDATE audit_logs SET action='x'`)).rejects.toThrow();
    await expect(withTenant(A.organizationId, A.userId, (tx) => tx.$executeRaw`DELETE FROM audit_logs`)).rejects.toThrow();
  });

  it("le journal d'audit et le tableau de bord ne montrent que sa propre entreprise", async () => {
    const logsB = await listAuditLogs(B.ctx, { page: 1, pageSize: 100 });
    expect(logsB.items.every((l) => l.organizationId === B.organizationId)).toBe(true);
    const dash = await getDashboard(B.ctx);
    expect(dash.employees.total).toBe(1);
    expect(dash.departments.total).toBe(1);
  });

  it("une session ne donne jamais accès à une entreprise dont l'utilisateur n'est pas membre", async () => {
    // Forge : on force l'entreprise active de la session de B vers A.
    await prisma.session.updateMany({ where: { userId: B.userId }, data: { activeOrganizationId: A.organizationId } });
    const ctx = await authenticate(B.token);
    expect(ctx?.organizationId).toBe(B.organizationId);
  });

  it("un compte d'une entreprise ne peut pas lire les utilisateurs d'une autre", async () => {
    const seen = await withContext({ organizationId: B.organizationId, userId: B.userId }, (tx) => tx.user.findMany({ select: { id: true } }));
    expect(seen.map((u) => u.id)).toEqual([B.userId]);
  });
});
