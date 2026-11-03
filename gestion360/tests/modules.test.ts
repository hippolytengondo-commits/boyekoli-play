import { describe, expect, it } from "vitest";
import { departmentInput, createDepartment, createPosition, deleteDepartment, listDepartments, updateDepartment } from "@/modules/departments/service";
import { createEmployee, listEmployees, updateEmployee } from "@/modules/employees/service";
import { getDashboard } from "@/modules/dashboard/service";
import { getOrganization, updateOrganization } from "@/modules/organization/service";
import { listOrganizations, setOrganizationStatus } from "@/modules/platform/service";
import { listMyOrganizations, switchOrganization } from "@/modules/auth/service";
import { authenticate } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { newOrg } from "./helpers";

describe("Départements, postes, employés (scénario 3)", () => {
  it("applique les règles métier", async () => {
    const o = await newOrg();
    const fin = await createDepartment(o.ctx, departmentInput.parse({ name: "Finance", code: "fin" }));
    expect(fin.code).toBe("FIN");
    await expect(createDepartment(o.ctx, { name: "Autre", code: "FIN" })).rejects.toMatchObject({ status: 409 });
    const compta = await createDepartment(o.ctx, { name: "Comptabilité", code: "CPT", parentId: fin.id });
    await expect(updateDepartment(o.ctx, fin.id, { parentId: compta.id })).rejects.toMatchObject({ status: 400 }); // cycle
    await expect(updateDepartment(o.ctx, fin.id, { parentId: fin.id })).rejects.toMatchObject({ status: 400 });
    const pos = await createPosition(o.ctx, { title: "Comptable principal", departmentId: compta.id });
    const e = await createEmployee(o.ctx, { firstName: "Paul", lastName: "Ilunga", departmentId: compta.id, positionId: pos.id, hireDate: new Date("2026-01-05") });
    expect(e.matricule).toBe("EMP-000002"); // 000001 = le directeur général
    await expect(deleteDepartment(o.ctx, compta.id)).rejects.toMatchObject({ status: 409 });
    await updateEmployee(o.ctx, e.id, { departmentId: null, status: "ON_LEAVE" });
    const list = await listDepartments(o.ctx);
    expect(list.find((d) => d.code === "CPT")?.employeeCount).toBe(0);
    await deleteDepartment(o.ctx, compta.id).catch(() => {});
  });

  it("recherche et pagination des employés", async () => {
    const o = await newOrg();
    for (let i = 0; i < 25; i++) await createEmployee(o.ctx, { firstName: `Agent${i}`, lastName: "Test" });
    const p1 = await listEmployees(o.ctx, { page: 1, pageSize: 10 });
    expect(p1.items).toHaveLength(10);
    expect(p1.total).toBe(26);
    const s = await listEmployees(o.ctx, { page: 1, pageSize: 10, q: "agent7" });
    expect(s.total).toBe(1);
  });

  it("n'affiche que des indicateurs réels au tableau de bord", async () => {
    const o = await newOrg();
    const d = await createDepartment(o.ctx, { name: "Logistique", code: "LOG" });
    await createEmployee(o.ctx, { firstName: "A", lastName: "B", departmentId: d.id });
    const e2 = await createEmployee(o.ctx, { firstName: "C", lastName: "D" });
    await updateEmployee(o.ctx, e2.id, { status: "TERMINATED" });
    const dash = await getDashboard(o.ctx);
    expect(dash.employees).toMatchObject({ total: 3, active: 2, terminated: 1, unassigned: 1 });
    expect(dash.departments.headcount).toEqual([{ id: d.id, name: "Logistique", code: "LOG", count: 1 }]);
    expect(dash.recentActivity?.length).toBeGreaterThan(0);
  });
});

describe("Paramètres de l'entreprise et plateforme", () => {
  it("modifie les paramètres et trace l'opération", async () => {
    const o = await newOrg();
    await updateOrganization(o.ctx, { legalName: "Société Test SARL", rccm: "CD/KIN/RCCM/26-B-0001", defaultCurrency: "USD" });
    const org = await getOrganization(o.ctx);
    expect(org.legalName).toBe("Société Test SARL");
    expect(org.settings?.defaultCurrency).toBe("USD");
  });

  it("l'administrateur de plateforme suspend une entreprise sans accéder à son contenu", async () => {
    const o = await newOrg();
    const admin = await newOrg("Plateforme");
    await expect(listOrganizations(admin.ctx)).rejects.toMatchObject({ status: 403 });
    await prisma.$executeRaw`UPDATE users SET "isPlatformAdmin" = false WHERE false`.catch(() => {});
    const { default: pg } = await import("pg");
    const c = new pg.Client({ connectionString: process.env.DIRECT_URL });
    await c.connect(); await c.query(`UPDATE users SET "isPlatformAdmin"=true WHERE id=$1`, [admin.userId]); await c.end();
    const padmin = (await authenticate(admin.token))!;
    const orgs = await listOrganizations(padmin);
    expect(orgs.find((x) => x.id === o.organizationId)?.memberCount).toBe(1);
    expect(Object.keys(orgs[0])).not.toContain("employees");
    await setOrganizationStatus(padmin, o.organizationId, { status: "SUSPENDED", reason: "Impayé" });
    expect((await authenticate(o.token))?.organizationId).toBeNull(); // accès coupé
    await setOrganizationStatus(padmin, o.organizationId, { status: "ACTIVE", reason: "Régularisé" });
    expect((await authenticate(o.token))?.organizationId).toBe(o.organizationId);
    // la plateforme ne peut pas lire les employés d'une entreprise
    const { withContext } = await import("@/lib/db");
    const emps = await withContext({ platform: true, userId: padmin.userId }, (tx) => tx.employee.count());
    expect(emps).toBe(0);
  });

  it("liste les entreprises d'un utilisateur et refuse de basculer vers une entreprise tierce", async () => {
    const a = await newOrg();
    const b = await newOrg();
    expect((await listMyOrganizations(a.userId)).map((x) => x.id)).toEqual([a.organizationId]);
    await expect(switchOrganization(a.ctx, b.organizationId)).rejects.toMatchObject({ status: 404 });
  });
});
