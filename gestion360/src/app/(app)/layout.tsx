import { requireAuth } from "@/lib/server-auth";
import { can } from "@/lib/auth";
import { listMyOrganizations } from "@/modules/auth/service";
import { Shell } from "./shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAuth();
  const orgs = await listMyOrganizations(ctx.userId);
  const nav = [
    { href: "/tableau-de-bord", label: "Tableau de bord", icon: "dashboard", show: true },
    { href: "/departements", label: "Départements", icon: "building", show: can(ctx, "departments.read") },
    { href: "/employes", label: "Employés", icon: "users", show: can(ctx, "employees.read") },
    { href: "/utilisateurs", label: "Utilisateurs", icon: "key", show: can(ctx, "members.read") },
    { href: "/roles", label: "Rôles et permissions", icon: "shield", show: can(ctx, "roles.read") },
    { href: "/audit", label: "Journal d'audit", icon: "scroll", show: can(ctx, "audit.read") },
    { href: "/parametres", label: "Paramètres", icon: "settings", show: can(ctx, "org.settings.read") },
    { href: "/plateforme", label: "Administration plateforme", icon: "globe", show: ctx.isPlatformAdmin },
  ].filter((n) => n.show);
  return (
    <Shell nav={nav} user={{ name: ctx.userName, email: ctx.userEmail }} orgs={orgs} activeOrgId={ctx.organizationId}>
      {children}
    </Shell>
  );
}
