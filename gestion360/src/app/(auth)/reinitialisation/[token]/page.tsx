import { ResetForm } from "../../forms";
export const metadata = { title: "Nouveau mot de passe" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (<><h1 className="mb-6 text-2xl font-bold text-ink-900">Nouveau mot de passe</h1><ResetForm token={token} /></>);
}
