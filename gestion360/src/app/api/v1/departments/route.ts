import { api } from "@/lib/http";
import { createDepartment, departmentInput, listDepartments } from "@/modules/departments/service";

export const GET = api({}, ({ ctx }) => listDepartments(ctx));
export const POST = api({ body: departmentInput, status: 201 }, ({ ctx, body }) => createDepartment(ctx, body));
