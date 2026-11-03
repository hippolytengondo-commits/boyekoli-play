"use client";
import { useRouter } from "next/navigation";
import { Badge, Empty, ErrorBox, Field, Pager, call, useAction } from "@/components/ui";
import { STATUS_LABEL } from "@/lib/labels";

interface Emp { id: string; matricule: string; firstName: string; lastName: string; email: string | null; phone: string | null; status: string; department: { name: string } | null; position: { title: string } | null }
interface Props {
  data: { items: Emp[]; total: number; page: number; pageSize: number };
  query: { q: string; departmentId: string; status: string };
  departments: { id: string; name: string }[]; positions: { id: string; title: string }[]; canManage: boolean;
}

export function EmployeesClient({ data, query, departments, positions, canManage }: Props) {
  const router = useRouter();
  const a = useAction();
  const go = (p: Record<string, string | number>) => { const u = new URLSearchParams(); Object.entries({ ...query, page: data.page, ...p }).forEach(([k, v]) => v !== "" && v !== 1 && u.set(k, String(v))); router.push(`/employes?${u}`); };
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <section className="card overflow-hidden">
        <form className="flex flex-wrap gap-2 border-b border-slate-200 p-3" onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget); go({ q: String(d.get("q") ?? ""), departmentId: String(d.get("departmentId") ?? ""), status: String(d.get("status") ?? ""), page: 1 }); }}>
          <input name="q" defaultValue={query.q} placeholder="Rechercher (nom, matricule, e-mail)" className="input max-w-xs" />
          <select name="departmentId" defaultValue={query.departmentId} className="input w-auto"><option value="">Tous les départements</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <select name="status" defaultValue={query.status} className="input w-auto"><option value="">Tous les statuts</option>{Object.entries(STATUS_LABEL).filter(([k]) => k !== "SUSPENDED").map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <button className="btn-secondary">Filtrer</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Matricule</th><th className="th">Nom</th><th className="th">Département</th><th className="th">Poste</th><th className="th">Statut</th>{canManage && <th className="th" />}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {data.items.map((e) => (
                <tr key={e.id}>
                  <td className="td font-mono text-xs">{e.matricule}</td>
                  <td className="td font-medium text-slate-900">{e.lastName.toUpperCase()} {e.firstName}{e.email && <p className="text-xs font-normal text-slate-500">{e.email}</p>}</td>
                  <td className="td">{e.department?.name ?? "—"}</td><td className="td">{e.position?.title ?? "—"}</td>
                  <td className="td"><Badge tone={e.status === "ACTIVE" ? "green" : e.status === "ON_LEAVE" ? "amber" : "slate"}>{STATUS_LABEL[e.status]}</Badge></td>
                  {canManage && (
                    <td className="td text-right">
                      <select aria-label={`Statut de ${e.firstName}`} className="input w-auto py-1 text-xs" value={e.status} onChange={(ev) => a.run(() => call("PATCH", `/api/v1/employees/${e.id}`, { status: ev.target.value }))}>
                        <option value="ACTIVE">Actif</option><option value="ON_LEAVE">En congé</option><option value="TERMINATED">Sorti</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.items.length === 0 && <Empty title="Aucun employé trouvé" />}
        <div className="px-3"><ErrorBox message={a.error} /></div>
        <Pager page={data.page} pageSize={data.pageSize} total={data.total} onPage={(p) => go({ page: p })} />
      </section>
      {canManage && (
        <form className="card h-fit space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); a.run(() => call("POST", "/api/v1/employees", { firstName: d.get("firstName"), lastName: d.get("lastName"), email: d.get("email") || undefined, phone: d.get("phone") || undefined, departmentId: d.get("departmentId") || null, positionId: d.get("positionId") || null, hireDate: d.get("hireDate") || null }), () => f.reset()); }}>
          <h2 className="font-semibold text-ink-900">Nouvel employé</h2>
          <div className="grid grid-cols-2 gap-3"><Field label="Prénom"><input name="firstName" required className="input" /></Field><Field label="Nom"><input name="lastName" required className="input" /></Field></div>
          <Field label="E-mail"><input name="email" type="email" className="input" /></Field>
          <Field label="Téléphone"><input name="phone" className="input" /></Field>
          <Field label="Département"><select name="departmentId" className="input"><option value="">—</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
          <Field label="Poste"><select name="positionId" className="input"><option value="">—</option>{positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
          <Field label="Date d'embauche"><input name="hireDate" type="date" className="input" /></Field>
          <button className="btn-primary w-full" disabled={a.pending}>Enregistrer</button>
        </form>
      )}
    </div>
  );
}
