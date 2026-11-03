"use client";
import { Lock } from "lucide-react";
import { useState } from "react";
import { Badge, ErrorBox, Field, call, useAction } from "@/components/ui";

interface Role { id: string; name: string; description: string | null; isSystem: boolean; isLocked: boolean; memberCount: number; permissions: string[] }
interface Perm { key: string; module: string; description: string }

export function RolesClient({ roles, catalog, mine, canManage }: { roles: Role[]; catalog: Perm[]; mine: string[]; canManage: boolean }) {
  const a = useAction();
  const c = useAction();
  const [openId, setOpenId] = useState<string | null>(null);
  const [perms, setPerms] = useState<string[]>([]);
  const [newPerms, setNewPerms] = useState<string[]>([]);
  const modules = [...new Set(catalog.map((p) => p.module))];
  const toggle = (l: string[], k: string) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]);
  const PermGrid = ({ value, onChange, disabled }: { value: string[]; onChange: (v: string[]) => void; disabled?: boolean }) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {modules.map((m) => (
        <fieldset key={m}><legend className="label capitalize">{m}</legend>
          {catalog.filter((p) => p.module === m).map((p) => {
            const owned = mine.includes(p.key);
            return <label key={p.key} className={`flex items-start gap-2 py-0.5 text-sm ${owned ? "" : "opacity-50"}`}><input type="checkbox" disabled={disabled || (!owned && !value.includes(p.key))} checked={value.includes(p.key)} onChange={() => onChange(toggle(value, p.key))} className="mt-1" /><span>{p.description}<span className="block font-mono text-[11px] text-slate-400">{p.key}</span></span></label>;
          })}
        </fieldset>
      ))}
    </div>
  );
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-3">
        {roles.map((r) => (
          <section key={r.id} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><h2 className="flex items-center gap-2 font-semibold text-ink-900">{r.name}{r.isLocked && <Lock className="h-3.5 w-3.5 text-slate-400" aria-label="Verrouillé" />}</h2><p className="text-sm text-slate-500">{r.description}</p></div>
              <div className="flex items-center gap-2"><Badge tone="slate">{r.memberCount} utilisateur{r.memberCount > 1 ? "s" : ""}</Badge><Badge tone="blue">{r.permissions.length} permission{r.permissions.length > 1 ? "s" : ""}</Badge>
                <button className="text-sm text-brand-700 hover:underline" onClick={() => { setOpenId(openId === r.id ? null : r.id); setPerms(r.permissions); }}>{openId === r.id ? "Fermer" : canManage && !r.isLocked ? "Modifier" : "Voir"}</button></div>
            </div>
            {openId === r.id && (
              <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                <PermGrid value={perms} onChange={setPerms} disabled={!canManage || r.isLocked} />
                {canManage && !r.isLocked && (
                  <div className="flex gap-2">
                    <button className="btn-primary" disabled={a.pending} onClick={() => a.run(() => call("PATCH", `/api/v1/roles/${r.id}`, { permissions: perms }), () => setOpenId(null))}>Enregistrer</button>
                    {!r.isSystem && <button className="btn-danger" onClick={() => confirm(`Supprimer le rôle « ${r.name} » ?`) && a.run(() => call("DELETE", `/api/v1/roles/${r.id}`))}>Supprimer</button>}
                  </div>
                )}
              </div>
            )}
          </section>
        ))}
        <ErrorBox message={a.error} />
      </div>
      {canManage && (
        <form className="card h-fit space-y-3 p-5" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; const d = new FormData(f); c.run(() => call("POST", "/api/v1/roles", { name: d.get("name"), description: d.get("description") || undefined, permissions: newPerms }), () => { setNewPerms([]); f.reset(); }); }}>
          <h2 className="font-semibold text-ink-900">Nouveau rôle personnalisé</h2>
          <Field label="Nom"><input name="name" required className="input" /></Field>
          <Field label="Description"><input name="description" className="input" /></Field>
          <PermGrid value={newPerms} onChange={setNewPerms} />
          <ErrorBox message={c.error} />
          <button className="btn-primary w-full" disabled={c.pending}>Créer le rôle</button>
        </form>
      )}
    </div>
  );
}
