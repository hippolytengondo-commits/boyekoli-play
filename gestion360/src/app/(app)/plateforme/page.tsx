import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server-auth";
import { listOrganizations } from "@/modules/platform/service";
import { PageHeader } from "@/components/ui";
import { PlatformClient } from "./client";

export const metadata = { title: "Administration de la plateforme" };

export default async function Page() {
  const ctx = await requireAuth();
  if (!ctx.isPlatformAdmin) redirect("/tableau-de-bord");
  const orgs = await listOrganizations(ctx);
  return (
    <>
      <PageHeader title="Entreprises inscrites" subtitle="Vue technique. Aucun accès au contenu métier des entreprises ; chaque suspension est journalisée." />
      <PlatformClient orgs={JSON.parse(JSON.stringify(orgs))} />
    </>
  );
}
