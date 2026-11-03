import { api } from "@/lib/http";
import { orgStatusInput, setOrganizationStatus } from "@/modules/platform/service";

export const PUT = api({ body: orgStatusInput }, async ({ ctx, body, params }) => { await setOrganizationStatus(ctx, params.id, body); });
