import { api } from "@/lib/http";
import { deleteDepartment, departmentUpdate, updateDepartment } from "@/modules/departments/service";

export const PATCH = api({ body: departmentUpdate }, ({ ctx, body, params }) => updateDepartment(ctx, params.id, body));
export const DELETE = api({}, async ({ ctx, params }) => { await deleteDepartment(ctx, params.id); });
