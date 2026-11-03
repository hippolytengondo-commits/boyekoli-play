import { api } from "@/lib/http";
import { listMyOrganizations } from "@/modules/auth/service";

export const GET = api({}, async ({ ctx }) => ({
  user: { id: ctx.userId, name: ctx.userName, email: ctx.userEmail, isPlatformAdmin: ctx.isPlatformAdmin },
  organizationId: ctx.organizationId,
  permissions: [...ctx.permissions],
  organizations: await listMyOrganizations(ctx.userId),
}));
