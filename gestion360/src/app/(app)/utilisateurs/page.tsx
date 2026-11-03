import { can } from "@/lib/auth";
import { requirePage } from "@/lib/server-auth";
import { listDepartments, listPositions } from "@/modules/departments/service";
import { listInvitations, listMembers } from "@/modules/members/service";
import { listRoles } from "@/modules/rbac/service";
import { PageHeader } from "@/components/ui";
import { MembersClient } from "./client";

export const metadata = { title: "Utilisateurs" };

export default async function Page() {
  const ctx = await requirePage("members.read");
  const [members, invitations, roles, departments, positions] = await Promise.all([
    listMembers(ctx), listInvitations(ctx),
    can(ctx, "roles.read") ? listRoles(ctx) : [],
    can(ctx, "departments.read") ? listDepartments(ctx) : [],
    can(ctx, "departments.read") ? listPositions(ctx) : [],
  ]);
  return (
    <>
      <PageHeader title="Utilisateurs" subtitle="Accès à l'entreprise, rôles et invitations." />
      <MembersClient
        me={ctx.userId} canInvite={can(ctx, "members.invite")} canManage={can(ctx, "members.manage")}
        members={JSON.parse(JSON.stringify(members))} invitations={JSON.parse(JSON.stringify(invitations))}
        roles={roles.map((r) => ({ id: r.id, name: r.name }))} departments={departments.map((d) => ({ id: d.id, name: d.name }))} positions={positions.map((p) => ({ id: p.id, title: p.title }))}
      />
    </>
  );
}
