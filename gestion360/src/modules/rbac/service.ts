import { z } from "zod";
import { withTenant } from "@/lib/db";
import { audit, actor } from "@/lib/audit";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";
import { badRequest, conflict, forbidden, notFound } from "@/lib/errors";
import { ALL_PERMISSIONS, PERMISSIONS, isPermissionKey, type PermissionKey } from "@/lib/rbac/permissions";
import { slugify } from "@/lib/util";

export const roleInput = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(300).optional(),
  permissions: z.array(z.string()).max(100).default([]),
});
export const roleUpdate = roleInput.partial();

/** Anti-escalade : on ne peut attribuer que des permissions que l'on possède soi-même. */
export function assertCanGrant(ctx: AuthContext, perms: Iterable<string>) {
  for (const p of perms) if (!ctx.permissions.has(p as PermissionKey)) throw forbidden("Vous ne pouvez pas attribuer des permissions que vous ne possédez pas.");
}
function cleanPerms(perms: string[]): PermissionKey[] {
  const bad = perms.filter((p) => !isPermissionKey(p));
  if (bad.length) throw badRequest(`Permissions inconnues : ${bad.join(", ")}`);
  return [...new Set(perms)] as PermissionKey[];
}

export const permissionCatalog = () => Object.entries(PERMISSIONS).map(([key, v]) => ({ key, ...v }));

export async function listRoles(ctx: AuthContext) {
  requirePermission(ctx, "roles.read");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    const roles = await tx.role.findMany({ include: { permissions: true, _count: { select: { members: true } } }, orderBy: [{ isSystem: "desc" }, { name: "asc" }] });
    return roles.map((r) => ({
      id: r.id, key: r.key, name: r.name, description: r.description, isSystem: r.isSystem, isLocked: r.isLocked,
      memberCount: r._count.members,
      permissions: r.isLocked ? [...ALL_PERMISSIONS] : r.permissions.map((p) => p.permissionKey),
    }));
  });
}

export async function createRole(ctx: AuthContext, input: z.infer<typeof roleInput>) {
  requirePermission(ctx, "roles.manage");
  const org = requireOrg(ctx);
  const perms = cleanPerms(input.permissions);
  assertCanGrant(ctx, perms);
  return withTenant(org, ctx.userId, async (tx) => {
    let key = slugify(input.name);
    if (await tx.role.findFirst({ where: { key } })) key = `${key}-${Date.now().toString(36)}`;
    const role = await tx.role.create({ data: { organizationId: org, key, name: input.name, description: input.description } });
    await tx.rolePermission.createMany({ data: perms.map((permissionKey) => ({ roleId: role.id, organizationId: org, permissionKey })) });
    await audit(tx, actor(ctx), { action: "role.create", entityType: "Role", entityId: role.id, metadata: { name: role.name, permissions: perms } });
    return { id: role.id };
  });
}

export async function updateRole(ctx: AuthContext, id: string, input: z.infer<typeof roleUpdate>) {
  requirePermission(ctx, "roles.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    const role = await tx.role.findFirst({ where: { id }, include: { permissions: true } });
    if (!role) throw notFound("Rôle introuvable.");
    if (role.isLocked) throw forbidden("Ce rôle est verrouillé.");
    if (input.permissions) {
      const perms = cleanPerms(input.permissions);
      const before = new Set(role.permissions.map((p) => p.permissionKey));
      assertCanGrant(ctx, perms.filter((p) => !before.has(p)));
      await tx.rolePermission.deleteMany({ where: { roleId: id } });
      await tx.rolePermission.createMany({ data: perms.map((permissionKey) => ({ roleId: id, organizationId: org, permissionKey })) });
    }
    if (input.name !== undefined || input.description !== undefined)
      await tx.role.update({ where: { id }, data: { name: input.name, description: input.description } });
    await audit(tx, actor(ctx), { action: "role.update", entityType: "Role", entityId: id, metadata: { ...input } });
    return { id };
  });
}

export async function deleteRole(ctx: AuthContext, id: string) {
  requirePermission(ctx, "roles.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    const role = await tx.role.findFirst({ where: { id }, include: { _count: { select: { members: true } } } });
    if (!role) throw notFound("Rôle introuvable.");
    if (role.isSystem) throw forbidden("Un rôle système ne peut pas être supprimé.");
    if (role._count.members > 0) throw conflict("Ce rôle est attribué à des utilisateurs.");
    await tx.role.delete({ where: { id } });
    await audit(tx, actor(ctx), { action: "role.delete", entityType: "Role", entityId: id, metadata: { name: role.name } });
  });
}
