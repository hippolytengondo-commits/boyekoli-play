import { randomUUID } from "node:crypto";
import { authenticate, type AuthContext } from "@/lib/auth";
import { outbox } from "@/lib/mailer";
import { registerOrganization } from "@/modules/auth/service";
import { prisma } from "@/lib/db";

export const PASSWORD = "MotDePasse2026!";
export const uniq = (p = "u") => `${p}-${randomUUID().slice(0, 8)}@test.cd`;

export async function newOrg(name = "Société " + randomUUID().slice(0, 4)) {
  const email = uniq("dg");
  const r = await registerOrganization({ organizationName: name, sector: "SERVICES", country: "CD", name: "Jean Mukendi", email, password: PASSWORD }, { ip: "10.0.0." + Math.floor(Math.random() * 200) });
  const ctx = (await authenticate(r.token))!;
  return { ...r, email, ctx, token: r.token };
}

export function lastLink(to: string, marker: string): string {
  const mail = [...outbox].reverse().find((m) => m.to === to && m.text.includes(marker));
  if (!mail) throw new Error(`Aucun e-mail pour ${to}`);
  return mail.text.split(marker)[1].split(/\s/)[0];
}

export { prisma };
export type { AuthContext };
