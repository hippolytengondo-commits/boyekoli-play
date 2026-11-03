import { can } from "@/lib/auth";
import { requirePage } from "@/lib/server-auth";
import { listRoles, permissionCatalog } from "@/modules/rbac/service";
import { PageHeader } from "@/components/ui";
import { RolesClient } from "./client";

export const metadata = { title: "Rôles et permissions" };

export default async function Page() {
  const ctx = await requirePage("roles.read");
  const roles = await listRoles(ctx);
  return (
    <>
      <PageHeader title="Rôles et permissions" subtitle="Les permissions sont cumulables. Vous ne pouvez attribuer que celles que vous possédez." />
      <RolesClient roles={roles} catalog={permissionCatalog()} mine={[...ctx.permissions]} canManage={can(ctx, "roles.manage")} />
    </>
  );
}
