import { api } from "@/lib/http";
import { createRole, listRoles, roleInput } from "@/modules/rbac/service";

export const GET = api({}, ({ ctx }) => listRoles(ctx));
export const POST = api({ body: roleInput, status: 201 }, ({ ctx, body }) => createRole(ctx, body));
