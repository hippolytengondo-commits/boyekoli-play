import type { Metadata } from "next";
import { LoginForm } from "../forms";
export const metadata: Metadata = { title: "Connexion" };
export default function Page() {
  return (<><h1 className="mb-1 text-2xl font-bold text-ink-900">Connexion</h1><p className="mb-6 text-sm text-slate-500">Accédez à l'espace de votre entreprise.</p><LoginForm /></>);
}
