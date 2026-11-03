import Link from "next/link";
import { requirePage } from "@/lib/server-auth";
import { auditQuery, listAuditLogs } from "@/modules/audit/service";
import { actionLabel } from "@/lib/labels";
import { Empty, PageHeader } from "@/components/ui";

export const metadata = { title: "Journal d'audit" };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const ctx = await requirePage("audit.read");
  const q = auditQuery.parse(Object.fromEntries(Object.entries(await searchParams).filter(([, v]) => v !== "")));
  const logs = await listAuditLogs(ctx, q);
  const pages = Math.max(1, Math.ceil(logs.total / logs.pageSize));
  return (
    <>
      <PageHeader title="Journal d'audit" subtitle="Historique infalsifiable des opérations (ajout seul)." />
      <section className="card overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Date</th><th className="th">Opération</th><th className="th">Auteur</th><th className="th">Objet</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {logs.items.map((l) => (
              <tr key={l.id}><td className="td whitespace-nowrap text-slate-500">{l.createdAt.toLocaleString("fr-FR")}</td><td className="td font-medium text-slate-900">{actionLabel(l.action)}</td><td className="td">{l.actorName ?? "—"}</td><td className="td font-mono text-xs text-slate-500">{l.entityType}{l.entityId ? ` · ${l.entityId.slice(0, 8)}` : ""}</td></tr>
            ))}
          </tbody>
        </table>
        {logs.items.length === 0 && <Empty title="Aucune entrée" />}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
          <span>{logs.total} entrée(s) · page {logs.page}/{pages}</span>
          <div className="flex gap-2">
            {logs.page > 1 && <Link className="btn-secondary" href={`/audit?page=${logs.page - 1}`}>Précédent</Link>}
            {logs.page < pages && <Link className="btn-secondary" href={`/audit?page=${logs.page + 1}`}>Suivant</Link>}
          </div>
        </div>
      </section>
    </>
  );
}
