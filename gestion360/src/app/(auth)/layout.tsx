import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
      <aside className="relative hidden flex-col justify-between bg-ink-900 p-12 text-white lg:flex">
        <div>
          <p className="text-2xl font-bold tracking-tight">GESTION<span className="text-brand-500">360</span></p>
          <p className="mt-1 text-sm text-slate-300">Gestion intégrale des entreprises</p>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-tight">Une seule plateforme pour administrer, organiser et piloter votre entreprise.</h2>
          <ul className="mt-8 space-y-3 text-sm text-slate-300">
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />Données strictement isolées entre entreprises, jusqu'au niveau de la base de données.</li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />Rôles et permissions configurables, séparation des responsabilités.</li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />Journal d'audit de chaque opération sensible.</li>
          </ul>
        </div>
        <p className="text-xs text-slate-400">© GESTION360</p>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
