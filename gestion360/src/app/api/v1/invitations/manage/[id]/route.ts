import { api } from "@/lib/http";
import { revokeInvitation } from "@/modules/members/service";

export const DELETE = api({}, async ({ ctx, params }) => { await revokeInvitation(ctx, params.id); });
