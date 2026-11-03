import { z } from "zod";
import { withTenant, type Tx } from "@/lib/db";
import { audit, actor } from "@/lib/audit";
import { ALL_PERMISSIONS, type PermissionKey } from "@/lib/rbac/permissions";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";
import { newToken, sha256 } from "@/lib/crypto";
import { env } from "@/lib/env";
import { badRequest, conflict, forbidden, notFound } from "@/lib/errors";
import { sendMail } from "@/lib/mailer";
import { emailSchema } from "@/lib/util";
import { assertCanGrant } from "@/modules/rbac/service";

export const inviteInput = z.object({
  email: emailSchema,
  roleIds: z.array(z.string().min(1)).min(1).max(20),
  departmentId: z.string().min(1).nullable().optional(),
  positionId: z.string().min(1).nullable().optional(),
});
export const memberRolesInput = z.object({ roleIds: z.array(z.string().min(1)).min(1).max(20) });
export const memberStatusInput = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) });

type RoleWithPerms = { id: string; isLocked: boolean; permissions: { permissionKey: string }[] };
const permsOf = (roles: RoleWithPerms[]): PermissionKey[] =>
  roles.flatMap((r) => (r.isLocked ? ALL_PERMISSIONS : (r.permissions.map((p) => p.permissionKey) as PermissionKey[])));

async function activeOwnerCount(tx: Tx, excludeMembershipId?: string) {
  return tx.membership.count({
    where: { status: "ACTIVE", ...(excludeMembershipId ? { NOT: { id: excludeMembershipId } } : {}), roles: { some: { role: { isLocked: true } } } },
  });
}

export async function listMembers(ctx: AuthContext) {
  requirePermission(ctx, "members.read");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const ms = await tx.membership.findMany({ include: { user: { select: { id: true, name: true, email: true, emailVerifiedAt: true, lastLoginAt: true } }, roles: { include: { role: { select: { id: true, name: true } } } } }, orderBy: { createdAt: "asc" } });
    return ms.map((m) => ({ id: m.id, status: m.status, userId: m.user.id, name: m.user.name, email: m.user.email, emailVerified: !!m.user.emailVerifiedAt, lastLoginAt: m.user.lastLoginAt, roles: m.roles.map((r) => r.role) }));
  });
}

export async function changeMemberRoles(ctx: AuthContext, membershipId: string, input: z.infer<typeof memberRolesInput>) {
  requirePermission(ctx, "members.manage");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    const m = await tx.membership.findFirst({ where: { id: membershipId }, include: { roles: { include: { role: { include: { permissions: true } } } } } });
    if (!m) throw notFound("Utilisateur introuvable.");
    const newRoles = await tx.role.findMany({ where: { id: { in: input.roleIds } }, include: { permissions: true } });
    if (newRoles.length !== new Set(input.roleIds).size) throw badRequest("Rôle invalide.");
    // On ne peut ni retirer à, ni donner à autrui plus de pouvoirs qu'on en possède.
    assertCanGrant(ctx, permsOf(m.roles.map((r) => r.role)));
    assertCanGrant(ctx, permsOf(newRoles));
    const hadOwner = m.roles.some((r) => r.role.isLocked);
    if (hadOwner && !newRoles.some((r) => r.isLocked) && (await activeOwnerCount(tx, m.id)) === 0)
      throw conflict("Impossible de retirer le dernier Directeur général de l'entreprise.");
    await tx.membershipRole.deleteMany({ where: { membershipId } });
    await tx.membershipRole.createMany({ data: newRoles.map((r) => ({ membershipId, roleId: r.id, organizationId: org })) });
    await audit(tx, actor(ctx), { action: "member.roles_change", entityType: "Membership", entityId: membershipId, metadata: { roleIds: input.roleIds } });
  });
}

export async function setMemberStatus(ctx: AuthContext, membershipId: string, input: z.infer<typeof memberStatusInput>) {
  requirePermission(ctx, "members.manage");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const m = await tx.membership.findFirst({ where: { id: membershipId }, include: { roles: { include: { role: { include: { permissions: true } } } } } });
    if (!m) throw notFound("Utilisateur introuvable.");
    if (m.userId === ctx.userId) throw forbidden("Vous ne pouvez pas modifier votre propre accès.");
    assertCanGrant(ctx, permsOf(m.roles.map((r) => r.role)));
    if (input.status === "SUSPENDED" && m.roles.some((r) => r.role.isLocked) && (await activeOwnerCount(tx, m.id)) === 0)
      throw conflict("Impossible de suspendre le dernier Directeur général de l'entreprise.");
    await tx.membership.update({ where: { id: membershipId }, data: { status: input.status } });
    await audit(tx, actor(ctx), { action: input.status === "SUSPENDED" ? "member.suspend" : "member.reactivate", entityType: "Membership", entityId: membershipId });
  });
}

export async function inviteMember(ctx: AuthContext, input: z.infer<typeof inviteInput>) {
  requirePermission(ctx, "members.invite");
  const org = requireOrg(ctx);
  const token = newToken();
  const result = await withTenant(org, ctx.userId, async (tx) => {
    const roles = await tx.role.findMany({ where: { id: { in: input.roleIds } }, include: { permissions: true } });
    if (roles.length !== new Set(input.roleIds).size) throw badRequest("Rôle invalide.");
    assertCanGrant(ctx, permsOf(roles));
    if (input.departmentId && !(await tx.department.findFirst({ where: { id: input.departmentId } }))) throw badRequest("Département invalide.");
    if (input.positionId && !(await tx.position.findFirst({ where: { id: input.positionId } }))) throw badRequest("Poste invalide.");
    const existing = await tx.membership.findFirst({ where: { user: { email: input.email } } });
    if (existing) throw conflict("Cette personne est déjà membre de l'entreprise.");
    await tx.invitation.updateMany({ where: { email: input.email, status: "PENDING" }, data: { status: "REVOKED" } });
    const inv = await tx.invitation.create({
      data: { organizationId: org, email: input.email, tokenHash: sha256(token), roleIds: input.roleIds, departmentId: input.departmentId ?? null, positionId: input.positionId ?? null, invitedById: ctx.userId, expiresAt: new Date(Date.now() + 7 * 86400_000) },
    });
    const o = await tx.organization.findUnique({ where: { id: org }, select: { name: true } });
    await audit(tx, actor(ctx), { action: "invitation.create", entityType: "Invitation", entityId: inv.id, metadata: { email: input.email } });
    return { id: inv.id, orgName: o?.name ?? "" };
  });
  await sendMail({ to: input.email, subject: `Invitation à rejoindre ${result.orgName} sur GESTION360`, text: `${ctx.userName} vous invite à rejoindre ${result.orgName}.\nAcceptez l'invitation (valable 7 jours) : ${env.appUrl}/invitation/${token}` });
  return { id: result.id };
}

export async function listInvitations(ctx: AuthContext) {
  requirePermission(ctx, "members.read");
  return withTenant(requireOrg(ctx), ctx.userId, (tx) =>
    tx.invitation.findMany({ where: { status: "PENDING", expiresAt: { gt: new Date() } }, select: { id: true, email: true, roleIds: true, expiresAt: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
  );
}

export async function revokeInvitation(ctx: AuthContext, id: string) {
  requirePermission(ctx, "members.invite");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const r = await tx.invitation.updateMany({ where: { id, status: "PENDING" }, data: { status: "REVOKED" } });
    if (!r.count) throw notFound("Invitation introuvable.");
    await audit(tx, actor(ctx), { action: "invitation.revoke", entityType: "Invitation", entityId: id });
  });
}
