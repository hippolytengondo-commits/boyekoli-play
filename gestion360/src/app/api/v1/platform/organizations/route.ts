import { api } from "@/lib/http";
import { listOrganizations } from "@/modules/platform/service";

export const GET = api({}, ({ ctx }) => listOrganizations(ctx));
