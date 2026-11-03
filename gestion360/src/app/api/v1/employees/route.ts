import { api } from "@/lib/http";
import { createEmployee, employeeInput, employeeQuery, listEmployees } from "@/modules/employees/service";

export const GET = api({ query: employeeQuery }, ({ ctx, query }) => listEmployees(ctx, query));
export const POST = api({ body: employeeInput, status: 201 }, ({ ctx, body }) => createEmployee(ctx, body));
