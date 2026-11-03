import { api } from "@/lib/http";
import { getOrganization, settingsInput, updateOrganization } from "@/modules/organization/service";

export const GET = api({}, ({ ctx }) => getOrganization(ctx));
export const PATCH = api({ body: settingsInput }, async ({ ctx, body }) => { await updateOrganization(ctx, body); });
