import { api } from "@/lib/http";
import { getDashboard } from "@/modules/dashboard/service";

export const GET = api({}, ({ ctx }) => getDashboard(ctx));
