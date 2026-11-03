import { can } from "@/lib/auth";
import { requirePage } from "@/lib/server-auth";
import { listDepartments, listPositions } from "@/modules/departments/service";
import { PageHeader } from "@/components/ui";
import { DepartmentsClient } from "./client";

export const metadata = { title: "Départements" };

export default async function Page() {
  const ctx = await requirePage("departments.read");
  const [departments, positions] = await Promise.all([listDepartments(ctx), listPositions(ctx)]);
  return (
    <>
      <PageHeader title="Départements et postes" subtitle="Organisation de l'entreprise." />
      <DepartmentsClient departments={departments} positions={positions.map((p) => ({ id: p.id, title: p.title, departmentName: p.department?.name ?? null }))} canManage={can(ctx, "departments.manage")} />
    </>
  );
}
