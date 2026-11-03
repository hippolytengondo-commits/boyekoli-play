import { api } from "@/lib/http";
import { inviteInput, inviteMember, listInvitations } from "@/modules/members/service";

export const GET = api({}, ({ ctx }) => listInvitations(ctx));
export const POST = api({ body: inviteInput, status: 201 }, ({ ctx, body }) => inviteMember(ctx, body));
