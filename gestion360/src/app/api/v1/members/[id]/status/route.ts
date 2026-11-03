import { api } from "@/lib/http";
import { memberStatusInput, setMemberStatus } from "@/modules/members/service";

export const PUT = api({ body: memberStatusInput }, async ({ ctx, body, params }) => { await setMemberStatus(ctx, params.id, body); });
