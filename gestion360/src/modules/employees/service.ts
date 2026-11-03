import { z } from "zod";
import { withTenant, type Tx } from "@/lib/db";
import { audit, actor } from "@/lib/audit";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";
import { badRequest, notFound } from "@/lib/errors";
import { pageSchema, paginate, type Page } from "@/lib/util";

export const employeeInput = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal("").transform(() => undefined)),
  phone: z.string().trim().max(40).optional(),
  departmentId: z.string().min(1).nullable().optional(),
  positionId: z.string().min(1).nullable().optional(),
  hireDate: z.coerce.date().nullable().optional(),
});
export const employeeUpdate = employeeInput.partial().extend({ status: z.enum(["ACTIVE", "ON_LEAVE", "TERMINATED"]).optional() });
export const employeeQuery = pageSchema.extend({
  q: z.string().trim().max(80).optional(),
  departmentId: z.string().optional(),
  status: z.enum(["ACTIVE", "ON_LEAVE", "TERMINATED"]).optional(),
});

type NewEmployee = Partial<z.infer<typeof employeeInput>> & { firstName: string; lastName: string; userId?: string | null };

/** Création atomique avec matricule séquentiel par entreprise. Les FK composites interdisent tout rattachement inter-entreprises. */
export async function createEmployeeTx(tx: Tx, organizationId: string, d: NewEmployee) {
  const s = await tx.organizationSettings.update({ where: { organizationId }, data: { employeeSeq: { increment: 1 } } });
  return tx.employee.create({
    data: {
      organizationId, matricule: `EMP-${String(s.employeeSeq).padStart(6, "0")}`,
      firstName: d.firstName, lastName: d.lastName, email: d.email ?? null, phone: d.phone ?? null,
      departmentId: d.departmentId ?? null, positionId: d.positionId ?? null, hireDate: d.hireDate ?? null, userId: d.userId ?? null,
    },
  });
}

async function assertRefs(tx: Tx, d: { departmentId?: string | null; positionId?: string | null }) {
  if (d.departmentId && !(await tx.department.findFirst({ where: { id: d.departmentId } }))) throw badRequest("Département invalide.");
  if (d.positionId && !(await tx.position.findFirst({ where: { id: d.positionId } }))) throw badRequest("Poste invalide.");
}

export async function listEmployees(ctx: AuthContext, q: z.infer<typeof employeeQuery>): Promise<Page<unknown>> {
  requirePermission(ctx, "employees.read");
  const org = requireOrg(ctx);
  const where = {
    ...(q.departmentId ? { departmentId: q.departmentId } : {}),
    ...(q.status ? { status: q.status } : {}),
    ...(q.q ? { OR: [{ firstName: { contains: q.q, mode: "insensitive" as const } }, { lastName: { contains: q.q, mode: "insensitive" as const } }, { matricule: { contains: q.q, mode: "insensitive" as const } }, { email: { contains: q.q, mode: "insensitive" as const } }] } : {}),
  };
  return withTenant(org, ctx.userId, async (tx) => {
    const [items, total] = await Promise.all([
      tx.employee.findMany({ where, include: { department: { select: { id: true, name: true } }, position: { select: { id: true, title: true } } }, orderBy: [{ lastName: "asc" }, { firstName: "asc" }], ...paginate(q.page, q.pageSize) }),
      tx.employee.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  });
}

export async function getEmployee(ctx: AuthContext, id: string) {
  requirePermission(ctx, "employees.read");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const e = await tx.employee.findFirst({ where: { id }, include: { department: true, position: true } });
    if (!e) throw notFound("Employé introuvable.");
    return e;
  });
}

export async function createEmployee(ctx: AuthContext, input: z.infer<typeof employeeInput>) {
  requirePermission(ctx, "employees.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    await assertRefs(tx, input);
    const e = await createEmployeeTx(tx, org, input);
    await audit(tx, actor(ctx), { action: "employee.create", entityType: "Employee", entityId: e.id, metadata: { matricule: e.matricule } });
    return e;
  });
}

export async function updateEmployee(ctx: AuthContext, id: string, input: z.infer<typeof employeeUpdate>) {
  requirePermission(ctx, "employees.manage");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    if (!(await tx.employee.findFirst({ where: { id } }))) throw notFound("Employé introuvable.");
    await assertRefs(tx, input);
    const e = await tx.employee.update({ where: { id }, data: input });
    await audit(tx, actor(ctx), { action: "employee.update", entityType: "Employee", entityId: id, metadata: { fields: Object.keys(input) } });
    return e;
  });
}
