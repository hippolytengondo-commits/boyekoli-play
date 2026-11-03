import { api } from "@/lib/http";
import { changeMemberRoles, memberRolesInput } from "@/modules/members/service";

export const PUT = api({ body: memberRolesInput }, async ({ ctx, body, params }) => { await changeMemberRoles(ctx, params.id, body); });
