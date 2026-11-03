"use client";
import { Badge, Empty, ErrorBox, call, useAction } from "@/components/ui";
import { SECTOR_LABEL } from "@/lib/labels";

interface Org { id: string; name: string; sector: string; country: string; status: string; createdAt: string; memberCount: number }

export function PlatformClient({ orgs }: { orgs: Org[] }) {
  const a = useAction();
  return (
    <section className="card overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Entreprise</th><th className="th">Secteur</th><th className="th">Pays</th><th className="th text-right">Utilisateurs</th><th className="th">Créée le</th><th className="th">Statut</th><th className="th" /></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {orgs.map((o) => (
            <tr key={o.id}><td className="td font-medium text-slate-900">{o.name}</td><td className="td">{SECTOR_LABEL[o.sector]}</td><td className="td">{o.country}</td><td className="td text-right">{o.memberCount}</td><td className="td">{new Date(o.createdAt).toLocaleDateString("fr-FR")}</td>
              <td className="td"><Badge tone={o.status === "ACTIVE" ? "green" : "red"}>{o.status === "ACTIVE" ? "Active" : "Suspendue"}</Badge></td>
              <td className="td text-right"><button className="text-xs text-brand-700 hover:underline" onClick={() => { const reason = prompt(o.status === "ACTIVE" ? "Motif de la suspension :" : "Motif de la réactivation :"); if (reason) a.run(() => call("PUT", `/api/v1/platform/organizations/${o.id}/status`, { status: o.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE", reason })); }}>{o.status === "ACTIVE" ? "Suspendre" : "Réactiver"}</button></td></tr>
          ))}
        </tbody>
      </table>
      {orgs.length === 0 && <Empty title="Aucune entreprise" />}
      <div className="p-3"><ErrorBox message={a.error} /></div>
    </section>
  );
}
