import { can } from "@/lib/auth";
import { requirePage } from "@/lib/server-auth";
import { getOrganization } from "@/modules/organization/service";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "./client";

export const metadata = { title: "Paramètres" };

export default async function Page() {
  const ctx = await requirePage("org.settings.read");
  const org = await getOrganization(ctx);
  return (
    <>
      <PageHeader title="Paramètres de l'entreprise" subtitle="Identité juridique et préférences. Les taux fiscaux et sociaux seront paramétrables, datés et documentés (phases 3 et 4)." />
      <SettingsForm canManage={can(ctx, "org.settings.manage")} org={JSON.parse(JSON.stringify({ name: org.name, legalName: org.legalName, rccm: org.rccm, idNat: org.idNat, nif: org.nif, address: org.address, phone: org.phone, email: org.email, defaultCurrency: org.settings?.defaultCurrency, timezone: org.settings?.timezone, regulatoryProfile: org.settings?.regulatoryProfile }))} />
    </>
  );
}
