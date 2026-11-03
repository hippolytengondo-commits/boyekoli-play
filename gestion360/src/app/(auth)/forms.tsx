"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ErrorBox, Field, call } from "@/components/ui";

function useSubmit<T>(fn: (data: FormData) => Promise<T>, onDone: (r: T) => void) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setPending(true);
    try { onDone(await fn(new FormData(e.currentTarget))); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setPending(false); }
  }
  return { error, pending, onSubmit };
}
const s = (d: FormData, k: string) => String(d.get(k) ?? "");

export function LoginForm() {
  const router = useRouter();
  const f = useSubmit((d) => call("POST", "/api/v1/auth/login", { email: s(d, "email"), password: s(d, "password") }), () => { router.push("/tableau-de-bord"); router.refresh(); });
  return (
    <form onSubmit={f.onSubmit} className="space-y-4">
      <Field label="Adresse e-mail"><input name="email" type="email" required autoComplete="username" className="input" /></Field>
      <Field label="Mot de passe"><input name="password" type="password" required autoComplete="current-password" className="input" /></Field>
      <ErrorBox message={f.error} />
      <button className="btn-primary w-full" disabled={f.pending}>{f.pending ? "Connexion…" : "Se connecter"}</button>
      <p className="flex justify-between text-sm"><Link href="/mot-de-passe-oublie" className="text-brand-700 hover:underline">Mot de passe oublié ?</Link><Link href="/inscription" className="text-brand-700 hover:underline">Créer une entreprise</Link></p>
    </form>
  );
}

export const SECTORS: [string, string][] = [["COMMERCE", "Commerce"], ["INDUSTRIE", "Industrie"], ["BTP", "Construction et BTP"], ["SANTE", "Santé"], ["EDUCATION", "Éducation"], ["TRANSPORT", "Transport"], ["AGRICULTURE", "Agriculture"], ["TECHNOLOGIE", "Technologie"], ["SERVICES", "Services"], ["ONG", "ONG"], ["HOTELLERIE", "Hôtellerie"], ["INSTITUTION", "Institutions"]];

export function RegisterForm() {
  const router = useRouter();
  const f = useSubmit((d) => call("POST", "/api/v1/auth/register", { organizationName: s(d, "organizationName"), sector: s(d, "sector"), country: s(d, "country") || "CD", name: s(d, "name"), email: s(d, "email"), password: s(d, "password") }), () => { router.push("/tableau-de-bord"); router.refresh(); });
  return (
    <form onSubmit={f.onSubmit} className="space-y-4">
      <Field label="Nom de l'entreprise"><input name="organizationName" required minLength={2} className="input" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Secteur d'activité"><select name="sector" className="input" defaultValue="SERVICES">{SECTORS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field>
        <Field label="Pays (code ISO)"><input name="country" defaultValue="CD" maxLength={2} className="input uppercase" /></Field>
      </div>
      <Field label="Votre nom complet (Directeur général)"><input name="name" required autoComplete="name" className="input" /></Field>
      <Field label="Adresse e-mail"><input name="email" type="email" required autoComplete="username" className="input" /></Field>
      <Field label="Mot de passe" hint="10 caractères minimum, avec au moins une lettre et un chiffre."><input name="password" type="password" required minLength={10} autoComplete="new-password" className="input" /></Field>
      <ErrorBox message={f.error} />
      <button className="btn-primary w-full" disabled={f.pending}>{f.pending ? "Création…" : "Créer mon entreprise"}</button>
      <p className="text-center text-sm"><Link href="/connexion" className="text-brand-700 hover:underline">J'ai déjà un compte</Link></p>
    </form>
  );
}

export function ForgotForm() {
  const [done, setDone] = useState(false);
  const f = useSubmit((d) => call("POST", "/api/v1/auth/forgot", { email: s(d, "email") }), () => setDone(true));
  if (done) return <p className="rounded-md bg-brand-50 p-4 text-sm text-brand-700">Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé (valable 1 heure).</p>;
  return (
    <form onSubmit={f.onSubmit} className="space-y-4">
      <Field label="Adresse e-mail"><input name="email" type="email" required className="input" /></Field>
      <ErrorBox message={f.error} />
      <button className="btn-primary w-full" disabled={f.pending}>Envoyer le lien</button>
      <p className="text-center text-sm"><Link href="/connexion" className="text-brand-700 hover:underline">Retour à la connexion</Link></p>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const f = useSubmit((d) => call("POST", "/api/v1/auth/reset", { token, password: s(d, "password") }), () => router.push("/connexion"));
  return (
    <form onSubmit={f.onSubmit} className="space-y-4">
      <Field label="Nouveau mot de passe" hint="10 caractères minimum, avec une lettre et un chiffre."><input name="password" type="password" required minLength={10} autoComplete="new-password" className="input" /></Field>
      <ErrorBox message={f.error} />
      <button className="btn-primary w-full" disabled={f.pending}>Enregistrer</button>
    </form>
  );
}

export function VerifyEmail({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  async function go() { try { await call("POST", "/api/v1/auth/verify-email", { token }); setState("ok"); } catch (e) { setMsg(e instanceof Error ? e.message : ""); setState("err"); } }
  if (state === "ok") return <p className="rounded-md bg-brand-50 p-4 text-sm text-brand-700">Adresse e-mail confirmée. <Link href="/connexion" className="font-semibold underline">Se connecter</Link></p>;
  return (<div className="space-y-4">{state === "err" && <ErrorBox message={msg} />}<button className="btn-primary w-full" onClick={go}>Confirmer mon adresse e-mail</button></div>);
}

export function AcceptInvitation({ token, existing, email }: { token: string; existing: boolean; email: string }) {
  const router = useRouter();
  const f = useSubmit((d) => call("POST", `/api/v1/invitations/${token}/accept`, { name: s(d, "name") || undefined, password: s(d, "password") }), () => { router.push("/tableau-de-bord"); router.refresh(); });
  return (
    <form onSubmit={f.onSubmit} className="space-y-4">
      <Field label="Adresse e-mail"><input value={email} readOnly className="input" /></Field>
      {!existing && <Field label="Votre nom complet"><input name="name" required className="input" /></Field>}
      <Field label={existing ? "Mot de passe de votre compte" : "Choisissez un mot de passe"} hint={existing ? undefined : "10 caractères minimum, avec une lettre et un chiffre."}><input name="password" type="password" required minLength={existing ? 1 : 10} autoComplete={existing ? "current-password" : "new-password"} className="input" /></Field>
      <ErrorBox message={f.error} />
      <button className="btn-primary w-full" disabled={f.pending}>Accepter l'invitation</button>
    </form>
  );
}
