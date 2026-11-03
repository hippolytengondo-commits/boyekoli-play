import { z } from "zod";
import { withContext } from "@/lib/db";
import { requirePlatformAdmin, type AuthContext } from "@/lib/auth";
import { notFound } from "@/lib/errors";

export const orgStatusInput = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]), reason: z.string().trim().min(3).max(300) });

/** Administration générale : métadonnées uniquement (aucun accès au contenu métier des entreprises). */
export async function listOrganizations(ctx: AuthContext) {
  requirePlatformAdmin(ctx);
  return withContext({ platform: true, userId: ctx.userId }, async (tx) => {
    const orgs = await tx.organization.findMany({ select: { id: true, name: true, slug: true, sector: true, country: true, status: true, createdAt: true, _count: { select: { memberships: true } } }, orderBy: { createdAt: "desc" } });
    return orgs.map(({ _count, ...o }) => ({ ...o, memberCount: _count.memberships }));
  });
}

export async function setOrganizationStatus(ctx: AuthContext, id: string, input: z.infer<typeof orgStatusInput>) {
  requirePlatformAdmin(ctx);
  return withContext({ platform: true, userId: ctx.userId, organizationId: id }, async (tx) => {
    const o = await tx.organization.findUnique({ where: { id } });
    if (!o) throw notFound("Entreprise introuvable.");
    await tx.organization.update({ where: { id }, data: { status: input.status } });
    await tx.auditLog.create({ data: { organizationId: id, actorUserId: ctx.userId, action: input.status === "SUSPENDED" ? "platform.org_suspend" : "platform.org_reactivate", entityType: "Organization", entityId: id, metadata: { reason: input.reason }, ip: ctx.ip } });
  });
}
