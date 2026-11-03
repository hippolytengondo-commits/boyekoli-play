import { can } from "@/lib/auth";
import { requirePage } from "@/lib/server-auth";
import { listDepartments, listPositions } from "@/modules/departments/service";
import { employeeQuery, listEmployees } from "@/modules/employees/service";
import { PageHeader } from "@/components/ui";
import { EmployeesClient } from "./client";

export const metadata = { title: "Employés" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const ctx = await requirePage("employees.read");
  const q = employeeQuery.parse(Object.fromEntries(Object.entries(await searchParams).filter(([, v]) => v !== "")));
  const [list, departments, positions] = await Promise.all([listEmployees(ctx, q), can(ctx, "departments.read") ? listDepartments(ctx) : [], can(ctx, "departments.read") ? listPositions(ctx) : []]);
  return (
    <>
      <PageHeader title="Employés" subtitle="Dossiers du personnel (le dossier RH complet arrive en phase 3)." />
      <EmployeesClient data={JSON.parse(JSON.stringify(list))} query={{ q: q.q ?? "", departmentId: q.departmentId ?? "", status: q.status ?? "" }} departments={departments.map((d) => ({ id: d.id, name: d.name }))} positions={positions.map((p) => ({ id: p.id, title: p.title }))} canManage={can(ctx, "employees.manage")} />
    </>
  );
}
