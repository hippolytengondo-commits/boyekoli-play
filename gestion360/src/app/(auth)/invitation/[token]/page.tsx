import { AcceptInvitation } from "../../forms";
import { previewInvitation } from "@/modules/auth/service";

export const metadata = { title: "Invitation" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const inv = await previewInvitation(token).catch(() => null);
  if (!inv) return (<><h1 className="mb-2 text-2xl font-bold text-ink-900">Invitation invalide</h1><p className="text-sm text-slate-600">Ce lien est expiré, déjà utilisé ou a été révoqué. Demandez une nouvelle invitation à votre administrateur.</p></>);
  return (<><h1 className="mb-1 text-2xl font-bold text-ink-900">Rejoindre {inv.organizationName}</h1><p className="mb-6 text-sm text-slate-500">Vous avez été invité(e) à rejoindre cette entreprise sur GESTION360.</p><AcceptInvitation token={token} existing={inv.existingAccount} email={inv.email} /></>);
}
