import { z } from "zod";
import { api } from "@/lib/http";
import { switchOrganization } from "@/modules/auth/service";

export const POST = api({ body: z.object({ organizationId: z.string().min(1) }) }, async ({ ctx, body }) => { await switchOrganization(ctx, body.organizationId); });
