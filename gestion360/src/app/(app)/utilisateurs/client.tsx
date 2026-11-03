"use client";
import { useState } from "react";
import { Badge, Empty, ErrorBox, Field, call, useAction } from "@/components/ui";

interface Member { id: string; userId: string; name: string; email: string; status: string; emailVerified: boolean; roles: { id: string; name: string }[] }
interface Props {
  me: string; canInvite: boolean; canManage: boolean; members: Member[];
  invitations: { id: string; email: string; expiresAt: string }[];
  roles: { id: string; name: string }[]; departments: { id: string; name: string }[]; positions: { id: string; title: string }[];
}

export function MembersClient({ me, canInvite, canManage, members, invitations, roles, departments, positions }: Props) {
  const a = useAction();
  const inv = useAction();
  const [editing, setEditing] = useState<string | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [sent, setSent] = useState<string | null>(null);
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="card overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead className="border-b border-slate-200 bg-slate-50"><tr><th className="th">Utilisateur</th><th className="th">Rôles</th><th className="th">Statut</th>{canManage && <th className="th" />}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="align-top">
                  <td className="td font-medium text-slate-900">{m.name}{m.userId === me && <span className="ml-2 text-xs text-slate-500">(vous)</span>}<p className="text-xs font-normal text-slate-500">{m.email}{!m.emailVerified && " · e-mail non vérifié"}</p></td>
                  <td className="td">
                    {editing === m.id ? (
                      <div className="space-y-1">
                        {roles.map((r) => <label key={r.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={sel.includes(r.id)} onChange={() => setSel(toggle(sel, r.id))} />{r.name}</label>)}
                        <div className="flex gap-2 pt-1"><button className="btn-primary px-2 py-1 text-xs" disabled={!sel.length} onClick={() => a.run(() => call("PUT", `/api/v1/members/${m.id}/roles`, { roleIds: sel }), () => setEditing(null))}>Enregistrer</button><button className="btn-secondary px-2 py-1 text-xs" onClick={() => setEditing(null)}>Annuler</button></div>
                      </div>
                    ) : (<div className="flex flex-wrap gap-1">{m.roles.map((r) => <Badge key={r.id} tone="blue">{r.name}</Badge>)}{m.roles.length === 0 && <span className="text-slate-400">Aucun</span>}</div>)}
                  </td>
                  <td className="td"><Badge tone={m.status === "ACTIVE" ? "green" : "red"}>{m.status === "ACTIVE" ? "Actif" : "Suspendu"}</Badge></td>
                  {canManage && (
                    <td className="td space-x-3 text-right text-xs">
                      <button className="text-brand-700 hover:underline" onClick={() => { setEditing(m.id); setSel(m.roles.map((r) => r.id)); }}>Rôles</button>
                      {m.userId !== me && <button className="text-slate-600 hover:underline" onClick={() => a.run(() => call("PUT", `/api/v1/members/${m.id}/status`, { status: m.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }))}>{m.status === "ACTIVE" ? "Suspendre" : "Réactiver"}</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3"><ErrorBox message={a.error} /></div>
        </section>
        <section className="card overflow-x-auto">
          <h2 className="border-b border-slate-200 px-4 py-3 font-semibold text-ink-900">Invitations en attente</h2>
          {invitations.length === 0 ? <Empty title="Aucune invitation en attente" /> : (
            <table className="w-full"><tbody className="divide-y divide-slate-100">{invitations.map((i) => <tr key={i.id}><td className="td">{i.email}</td><td className="td text-slate-500">expire le {new Date(i.expiresAt).toLocaleDateString("fr-FR")}</td>{canInvite && <td className="td text-right"><button className="text-xs text-red-600 hover:underline" onClick={() => inv.run(() => call("DELETE", `/api/v1/invitations/manage/${i.id}`))}>Révoquer</button></td>}</tr>)}</tbody></table>
          )}
        </section>
      </div>
      {canInvite && (
        <form className="card h-fit space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); setSent(null); inv.run(() => call("POST", "/api/v1/invitations", { email: d.get("email"), roleIds, departmentId: d.get("departmentId") || null, positionId: d.get("positionId") || null }), () => { setSent(String(d.get("email"))); setRoleIds([]); f.reset(); }); }}>
          <h2 className="font-semibold text-ink-900">Inviter un collaborateur</h2>
          <Field label="Adresse e-mail"><input name="email" type="email" required className="input" /></Field>
          <fieldset><legend className="label">Rôles</legend><div className="max-h-44 space-y-1 overflow-auto rounded-md border border-slate-200 p-2">{roles.map((r) => <label key={r.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={roleIds.includes(r.id)} onChange={() => setRoleIds(toggle(roleIds, r.id))} />{r.name}</label>)}</div></fieldset>
          <Field label="Département"><select name="departmentId" className="input"><option value="">—</option>{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></Field>
          <Field label="Poste"><select name="positionId" className="input"><option value="">—</option>{positions.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
          <ErrorBox message={inv.error} />
          {sent && <p className="rounded-md bg-brand-50 p-2 text-sm text-brand-700">Invitation envoyée à {sent}.</p>}
          <button className="btn-primary w-full" disabled={inv.pending || roleIds.length === 0}>Envoyer l'invitation</button>
        </form>
      )}
    </div>
  );
}
