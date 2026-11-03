"use client";
import { Trash2 } from "lucide-react";
import { Empty, ErrorBox, Field, call, useAction } from "@/components/ui";

interface Dept { id: string; name: string; code: string; description: string | null; parentName: string | null; employeeCount: number; childCount: number; parentId: string | null }
interface Pos { id: string; title: string; departmentName: string | null }

export function DepartmentsClient({ departments, positions, canManage }: { departments: Dept[]; positions: Pos[]; canManage: boolean }) {
  const a = useAction();
  const b = useAction();
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="card overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Code</th><th className="th">Département</th><th className="th">Rattaché à</th><th className="th text-right">Employés</th>{canManage && <th className="th" />}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {departments.map((d) => (
                <tr key={d.id}><td className="td font-mono text-xs">{d.code}</td><td className="td font-medium text-slate-900">{d.name}{d.description && <p className="text-xs font-normal text-slate-500">{d.description}</p>}</td><td className="td">{d.parentName ?? "—"}</td><td className="td text-right">{d.employeeCount}</td>
                  {canManage && <td className="td text-right"><button className="text-slate-400 hover:text-red-600" aria-label={`Supprimer ${d.name}`} onClick={() => confirm(`Supprimer « ${d.name} » ?`) && a.run(() => call("DELETE", `/api/v1/departments/${d.id}`))}><Trash2 className="h-4 w-4" /></button></td>}</tr>
              ))}
            </tbody>
          </table>
          {departments.length === 0 && <Empty title="Aucun département" hint={canManage ? "Créez le premier avec le formulaire." : undefined} />}
          <div className="p-3"><ErrorBox message={a.error} /></div>
        </section>
        <section className="card overflow-x-auto">
          <h2 className="border-b border-slate-200 px-4 py-3 font-semibold text-ink-900">Postes</h2>
          <table className="w-full"><tbody className="divide-y divide-slate-100">{positions.map((p) => <tr key={p.id}><td className="td font-medium">{p.title}</td><td className="td text-slate-500">{p.departmentName ?? "Transversal"}</td></tr>)}</tbody></table>
          {positions.length === 0 && <Empty title="Aucun poste" />}
        </section>
      </div>
      {canManage && (
        <div className="space-y-6">
          <form className="card space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); a.run(() => call("POST", "/api/v1/departments", { name: d.get("name"), code: d.get("code"), description: d.get("description") || undefined, parentId: d.get("parentId") || null }), () => f.reset()); }}>
            <h2 className="font-semibold text-ink-900">Nouveau département</h2>
            <Field label="Nom"><input name="name" required className="input" /></Field>
            <Field label="Code" hint="2 à 12 caractères, ex. FIN, RH."><input name="code" required className="input uppercase" /></Field>
            <Field label="Rattaché à"><select name="parentId" className="input"><option value="">Aucun (niveau supérieur)</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <Field label="Description"><input name="description" className="input" /></Field>
            <button className="btn-primary w-full" disabled={a.pending}>Créer</button>
          </form>
          <form className="card space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); b.run(() => call("POST", "/api/v1/positions", { title: d.get("title"), departmentId: d.get("departmentId") || null }), () => f.reset()); }}>
            <h2 className="font-semibold text-ink-900">Nouveau poste</h2>
            <Field label="Intitulé"><input name="title" required className="input" /></Field>
            <Field label="Département"><select name="departmentId" className="input"><option value="">Transversal</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
            <ErrorBox message={b.error} />
            <button className="btn-primary w-full" disabled={b.pending}>Ajouter</button>
          </form>
        </div>
      )}
    </div>
  );
}
