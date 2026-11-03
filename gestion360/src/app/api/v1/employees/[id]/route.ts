import { api } from "@/lib/http";
import { employeeUpdate, getEmployee, updateEmployee } from "@/modules/employees/service";

export const GET = api({}, ({ ctx, params }) => getEmployee(ctx, params.id));
export const PATCH = api({ body: employeeUpdate }, ({ ctx, body, params }) => updateEmployee(ctx, params.id, body));
