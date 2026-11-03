import { ForgotForm } from "../forms";
export const metadata = { title: "Mot de passe oublié" };
export default function Page() {
  return (<><h1 className="mb-1 text-2xl font-bold text-ink-900">Mot de passe oublié</h1><p className="mb-6 text-sm text-slate-500">Nous vous enverrons un lien de réinitialisation.</p><ForgotForm /></>);
}
