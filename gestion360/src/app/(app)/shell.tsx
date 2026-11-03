"use client";
import clsx from "clsx";
import { Building2, Globe, KeyRound, LayoutDashboard, LogOut, Menu, ScrollText, Settings, ShieldCheck, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { call } from "@/components/ui";

const ICONS = { dashboard: LayoutDashboard, building: Building2, users: Users, key: KeyRound, shield: ShieldCheck, scroll: ScrollText, settings: Settings, globe: Globe } as const;
interface Nav { href: string; label: string; icon: string }

export function Shell({ nav, user, orgs, activeOrgId, children }: { nav: Nav[]; user: { name: string; email: string }; orgs: { id: string; name: string }[]; activeOrgId: string | null; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() { await call("POST", "/api/v1/auth/logout"); router.push("/connexion"); router.refresh(); }
  async function switchOrg(id: string) { await call("POST", "/api/v1/auth/switch-organization", { organizationId: id }); router.push("/tableau-de-bord"); router.refresh(); }
  const sidebar = (
    <nav className="flex h-full flex-col bg-ink-900 text-slate-200">
      <div className="px-5 py-5 text-xl font-bold tracking-tight text-white">GESTION<span className="text-brand-500">360</span></div>
      <ul className="flex-1 space-y-0.5 px-3">
        {nav.map((n) => {
          const Icon = ICONS[n.icon as keyof typeof ICONS];
          const active = path === n.href || path.startsWith(n.href + "/");
          return (
            <li key={n.href}>
              <Link href={n.href} onClick={() => setOpen(false)} className={clsx("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors", active ? "bg-ink-700 text-white" : "hover:bg-ink-800")}>
                <Icon className="h-4 w-4" />{n.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-ink-800 p-4 text-xs text-slate-400">Phase 1 · Socle<br />Les modules s'activent au fil des déploiements.</div>
    </nav>
  );
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
          <button className="btn-secondary lg:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
          <div className="min-w-0">
            {orgs.length > 1 ? (
              <select aria-label="Entreprise active" className="input max-w-xs py-1.5 font-semibold" value={activeOrgId ?? ""} onChange={(e) => switchOrg(e.target.value)}>{orgs.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}</select>
            ) : (<p className="truncate text-sm font-semibold text-ink-900">{orgs[0]?.name ?? "Aucune entreprise"}</p>)}
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
            <button onClick={logout} className="btn-secondary" title="Se déconnecter"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Déconnexion</span></button>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
