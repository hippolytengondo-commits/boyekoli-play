import { VerifyEmail } from "../../forms";
export const metadata = { title: "Vérification de l'adresse e-mail" };
export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (<><h1 className="mb-6 text-2xl font-bold text-ink-900">Vérification de l'adresse e-mail</h1><VerifyEmail token={token} /></>);
}
