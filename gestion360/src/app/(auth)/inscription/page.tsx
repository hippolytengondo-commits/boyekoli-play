import type { Metadata } from "next";
import { RegisterForm } from "../forms";
export const metadata: Metadata = { title: "Créer une entreprise" };
export default function Page() {
  return (<><h1 className="mb-1 text-2xl font-bold text-ink-900">Créer votre entreprise</h1><p className="mb-6 text-sm text-slate-500">Votre espace sécurisé est prêt en quelques secondes.</p><RegisterForm /></>);
}
