import Link from "next/link";
import { Building2, Mail, UserCheck, Users } from "lucide-react";
import { can } from "@/lib/auth";
import { requireAuth } from "@/lib/server-auth";
import { getDashboard } from "@/modules/dashboard/service";
import { PageHeader } from "@/components/ui";
import { actionLabel } from "@/lib/labels";

export const metadata = { title: "Tableau de bord" };

function Stat({ label, value, icon: Icon, hint }: { label: string; value: number; icon: typeof Users; hint?: string }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between"><p className="text-sm font-medium text-slate-500">{label}</p><Icon className="h-5 w-5 text-brand-600" /></div>
      <p className="mt-2 text-3xl font-bold text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default async function Page() {
  const ctx = await requireAuth();
  if (!ctx.organizationId) return <PageHeader title="Aucune entreprise active" subtitle="Votre accès est suspendu ou aucune entreprise ne vous est rattachée. Contactez votre administrateur." />;
  if (!can(ctx, "dashboard.read"))
    return <PageHeader title={`Bonjour ${ctx.userName.split(" ")[0]}`} subtitle="Votre espace personnel (demandes, congés, bulletins) sera disponible avec le module Ressources humaines (phase 3)." />;
  const d = await getDashboard(ctx);
  const max = Math.max(1, ...d.departments.headcount.map((h) => h.count));
  const steps = [
    { done: d.departments.total > 0, label: "Créer votre premier département", href: "/departements", show: can(ctx, "departments.manage") },
    { done: d.employees.total > 1, label: "Enregistrer vos employés", href: "/employes", show: can(ctx, "employees.manage") },
    { done: d.members.active > 1 || d.members.pendingInvitations > 0, label: "Inviter vos collaborateurs", href: "/utilisateurs", show: can(ctx, "members.invite") },
  ].filter((s) => s.show && !s.done);
  return (
    <>
      <PageHeader title="Tableau de bord" subtitle="Indicateurs en temps réel de votre entreprise." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Employés actifs" value={d.employees.active} icon={Users} hint={`${d.employees.onLeave} en congé · ${d.employees.terminated} sortis`} />
        <Stat label="Départements" value={d.departments.total} icon={Building2} hint={d.employees.unassigned ? `${d.employees.unassigned} employé(s) sans département` : undefined} />
        <Stat label="Utilisateurs actifs" value={d.members.active} icon={UserCheck} />
        <Stat label="Invitations en attente" value={d.members.pendingInvitations} icon={Mail} />
      </div>
      {steps.length > 0 && (
        <div className="card mt-6 border-brand-100 bg-brand-50/50 p-5">
          <h2 className="font-semibold text-ink-900">Pour démarrer</h2>
          <ul className="mt-2 space-y-1 text-sm">{steps.map((s) => <li key={s.href}><Link className="text-brand-700 hover:underline" href={s.href}>→ {s.label}</Link></li>)}</ul>
        </div>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-semibold text-ink-900">Effectifs par département</h2>
          {d.departments.headcount.length === 0 ? <p className="mt-4 text-sm text-slate-500">Aucun département pour le moment.</p> : (
            <ul className="mt-4 space-y-3">
              {d.departments.headcount.map((h) => (
                <li key={h.id}>
                  <div className="flex justify-between text-sm"><span className="font-medium text-slate-700">{h.name}</span><span className="text-slate-500">{h.count}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-600" style={{ width: `${(h.count / max) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
        {d.recentActivity && (
          <section className="card p-5">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-ink-900">Activité récente</h2><Link className="text-sm text-brand-700 hover:underline" href="/audit">Tout voir</Link></div>
            <ul className="mt-4 divide-y divide-slate-100">
              {d.recentActivity.map((a) => <li key={a.id} className="flex justify-between py-2 text-sm"><span className="text-slate-700">{actionLabel(a.action)}</span><time className="text-slate-500">{a.createdAt.toLocaleString("fr-FR")}</time></li>)}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
