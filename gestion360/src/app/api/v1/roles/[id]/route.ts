import { api } from "@/lib/http";
import { deleteRole, roleUpdate, updateRole } from "@/modules/rbac/service";

export const PATCH = api({ body: roleUpdate }, ({ ctx, body, params }) => updateRole(ctx, params.id, body));
export const DELETE = api({}, async ({ ctx, params }) => { await deleteRole(ctx, params.id); });
