"use client";
import { useState } from "react";
import { ErrorBox, Field, call, useAction } from "@/components/ui";

type Org = Record<string, string | null | undefined>;

export function SettingsForm({ org, canManage }: { org: Org; canManage: boolean }) {
  const a = useAction();
  const [saved, setSaved] = useState(false);
  const v = (k: string) => org[k] ?? "";
  const text = (k: string, label: string, type = "text") => <Field label={label}><input name={k} type={type} defaultValue={v(k)} disabled={!canManage} className="input" /></Field>;
  return (
    <form className="card max-w-3xl space-y-5 p-6" onSubmit={(e) => {
      e.preventDefault(); setSaved(false);
      const d = Object.fromEntries(new FormData(e.currentTarget).entries());
      const body: Record<string, unknown> = {};
      for (const [k, val] of Object.entries(d)) body[k] = String(val) === "" && !["name", "defaultCurrency", "timezone", "regulatoryProfile"].includes(k) ? null : val;
      a.run(() => call("PATCH", "/api/v1/organization", body), () => setSaved(true));
    }}>
      <div className="grid gap-4 sm:grid-cols-2">
        {text("name", "Nom commercial")}{text("legalName", "Raison sociale")}
        {text("rccm", "RCCM")}{text("idNat", "Id. Nat.")}{text("nif", "NIF")}{text("phone", "Téléphone")}
        {text("email", "E-mail de contact", "email")}{text("address", "Adresse")}
        <Field label="Devise par défaut"><select name="defaultCurrency" defaultValue={v("defaultCurrency")} disabled={!canManage} className="input"><option>CDF</option><option>USD</option><option>EUR</option></select></Field>
        {text("timezone", "Fuseau horaire")}
        <Field label="Profil réglementaire" hint="Ex. CD-OHADA. Détermine les règles paramétrables par pays."><input name="regulatoryProfile" defaultValue={v("regulatoryProfile")} disabled={!canManage} className="input" /></Field>
      </div>
      <ErrorBox message={a.error} />
      {saved && <p className="rounded-md bg-brand-50 p-2 text-sm text-brand-700">Paramètres enregistrés.</p>}
      {canManage && <button className="btn-primary" disabled={a.pending}>Enregistrer</button>}
    </form>
  );
}
