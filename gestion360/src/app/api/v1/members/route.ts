import { api } from "@/lib/http";
import { listMembers } from "@/modules/members/service";

export const GET = api({}, ({ ctx }) => listMembers(ctx));
