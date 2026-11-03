import { z } from "zod";
import { withTenant } from "@/lib/db";
import { audit, actor } from "@/lib/audit";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";
import { badRequest, conflict, notFound } from "@/lib/errors";

export const departmentInput = z.object({
  name: z.string().trim().min(2).max(120),
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{2,12}$/, "Code : 2 à 12 caractères (lettres, chiffres, - _)."),
  description: z.string().trim().max(500).optional(),
  parentId: z.string().min(1).nullable().optional(),
});
export const departmentUpdate = departmentInput.partial();
export const positionInput = z.object({ title: z.string().trim().min(2).max(120), departmentId: z.string().min(1).nullable().optional() });

export async function listDepartments(ctx: AuthContext) {
  requirePermission(ctx, "departments.read");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const rows = await tx.department.findMany({ include: { _count: { select: { employees: true, children: true } }, parent: { select: { name: true } } }, orderBy: { name: "asc" } });
    return rows.map((d) => ({ id: d.id, name: d.name, code: d.code, description: d.description, parentId: d.parentId, parentName: d.parent?.name ?? null, employeeCount: d._count.employees, childCount: d._count.children }));
  });
}

export async function createDepartment(ctx: AuthContext, input: z.infer<typeof departmentInput>) {
  requirePermission(ctx, "departments.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    if (await tx.department.findFirst({ where: { code: input.code } })) throw conflict("Ce code de département existe déjà.");
    if (input.parentId && !(await tx.department.findFirst({ where: { id: input.parentId } }))) throw badRequest("Département parent invalide.");
    const d = await tx.department.create({ data: { organizationId: org, name: input.name, code: input.code, description: input.description, parentId: input.parentId ?? null } });
    await audit(tx, actor(ctx), { action: "department.create", entityType: "Department", entityId: d.id, metadata: { code: d.code } });
    return d;
  });
}

export async function updateDepartment(ctx: AuthContext, id: string, input: z.infer<typeof departmentUpdate>) {
  requirePermission(ctx, "departments.manage");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    if (!(await tx.department.findFirst({ where: { id } }))) throw notFound("Département introuvable.");
    if (input.code && (await tx.department.findFirst({ where: { code: input.code, NOT: { id } } }))) throw conflict("Ce code de département existe déjà.");
    if (input.parentId) {
      // Interdit les cycles : le parent ne doit pas être le département lui-même ni l'un de ses descendants.
      let cur: string | null = input.parentId;
      for (let i = 0; cur && i < 50; i++) {
        if (cur === id) throw badRequest("Hiérarchie circulaire interdite.");
        const p: { parentId: string | null } | null = await tx.department.findFirst({ where: { id: cur }, select: { parentId: true } });
        if (!p && cur === input.parentId) throw badRequest("Département parent invalide.");
        cur = p?.parentId ?? null;
      }
    }
    const d = await tx.department.update({ where: { id }, data: input });
    await audit(tx, actor(ctx), { action: "department.update", entityType: "Department", entityId: id, metadata: { fields: Object.keys(input) } });
    return d;
  });
}

export async function deleteDepartment(ctx: AuthContext, id: string) {
  requirePermission(ctx, "departments.manage");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const d = await tx.department.findFirst({ where: { id }, include: { _count: { select: { employees: true, children: true, positions: true } } } });
    if (!d) throw notFound("Département introuvable.");
    if (d._count.employees || d._count.children || d._count.positions) throw conflict("Ce département contient des employés, postes ou sous-départements.");
    await tx.department.delete({ where: { id } });
    await audit(tx, actor(ctx), { action: "department.delete", entityType: "Department", entityId: id, metadata: { code: d.code } });
  });
}

export async function listPositions(ctx: AuthContext) {
  requirePermission(ctx, "departments.read");
  return withTenant(requireOrg(ctx), ctx.userId, (tx) => tx.position.findMany({ include: { department: { select: { name: true } } }, orderBy: { title: "asc" } }));
}
export async function createPosition(ctx: AuthContext, input: z.infer<typeof positionInput>) {
  requirePermission(ctx, "departments.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    if (await tx.position.findFirst({ where: { title: input.title } })) throw conflict("Ce poste existe déjà.");
    if (input.departmentId && !(await tx.department.findFirst({ where: { id: input.departmentId } }))) throw badRequest("Département invalide.");
    const p = await tx.position.create({ data: { organizationId: org, title: input.title, departmentId: input.departmentId ?? null } });
    await audit(tx, actor(ctx), { action: "position.create", entityType: "Position", entityId: p.id });
    return p;
  });
}
