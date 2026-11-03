import { z } from "zod";
import { withTenant } from "@/lib/db";
import { audit, actor } from "@/lib/audit";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";

export const settingsInput = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  legalName: z.string().trim().max(160).nullable().optional(),
  rccm: z.string().trim().max(60).nullable().optional(),
  idNat: z.string().trim().max(60).nullable().optional(),
  nif: z.string().trim().max(60).nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  phone: z.string().trim().max(40).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  defaultCurrency: z.enum(["CDF", "USD", "EUR"]).optional(),
  timezone: z.string().trim().max(60).optional(),
  regulatoryProfile: z.string().trim().max(40).optional(),
});

export async function getOrganization(ctx: AuthContext) {
  requirePermission(ctx, "org.settings.read");
  return withTenant(requireOrg(ctx), ctx.userId, (tx) => tx.organization.findUniqueOrThrow({ where: { id: ctx.organizationId! }, include: { settings: true } }));
}

export async function updateOrganization(ctx: AuthContext, input: z.infer<typeof settingsInput>) {
  requirePermission(ctx, "org.settings.manage");
  const org = requireOrg(ctx);
  const { defaultCurrency, timezone, regulatoryProfile, ...identity } = input;
  return withTenant(org, ctx.userId, async (tx) => {
    await tx.organization.update({ where: { id: org }, data: identity });
    if (defaultCurrency || timezone || regulatoryProfile) await tx.organizationSettings.update({ where: { organizationId: org }, data: { defaultCurrency, timezone, regulatoryProfile } });
    await audit(tx, actor(ctx), { action: "organization.update", entityType: "Organization", entityId: org, metadata: { fields: Object.keys(input) } });
  });
}
