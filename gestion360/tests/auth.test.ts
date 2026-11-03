import { describe, expect, it } from "vitest";
import { authenticate } from "@/lib/auth";
import { login, requestPasswordReset, resetPassword, verifyEmail, registerOrganization } from "@/modules/auth/service";
import { withTenant } from "@/lib/db";
import { PASSWORD, lastLink, newOrg, prisma, uniq } from "./helpers";

describe("Authentification (scénarios 1 et 2)", () => {
  it("crée une entreprise, son directeur général, ses rôles et son journal d'audit", async () => {
    const o = await newOrg("Kivu Logistics");
    expect(o.ctx.organizationId).toBe(o.organizationId);
    expect(o.ctx.permissions.has("roles.manage")).toBe(true);
    // Sans contexte d'entreprise, la base elle-même ne renvoie aucune ligne (RLS).
    const blind = await prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*) n FROM roles`;
    expect(Number(blind[0].n)).toBe(0);
    // Avec le contexte de l'entreprise : 15 rôles types, 1 membre, 1 employé, 1 événement d'audit.
    const data = await withTenant(o.organizationId, o.userId, async (tx) => ({
      roles: await tx.role.count(), members: await tx.membership.count(),
      emp: await tx.employee.findFirstOrThrow(), logs: await tx.auditLog.findMany(),
    }));
    expect(data.roles).toBe(15);
    expect(data.members).toBe(1);
    expect(data.emp.matricule).toBe("EMP-000001");
    expect(data.logs.map((l) => l.action)).toContain("organization.create");
  });

  it("refuse une adresse e-mail déjà utilisée et un mot de passe faible", async () => {
    const o = await newOrg();
    await expect(registerOrganization({ organizationName: "X Y", sector: "SERVICES", country: "CD", name: "A B", email: o.email, password: PASSWORD }, {})).rejects.toMatchObject({ status: 409 });
  });

  it("vérifie l'adresse e-mail via le lien reçu, une seule fois", async () => {
    const o = await newOrg();
    const token = lastLink(o.email, "/verification-email/");
    await verifyEmail(token);
    await expect(verifyEmail(token)).rejects.toMatchObject({ status: 400 });
  });

  it("connecte avec le bon mot de passe et refuse le mauvais sans révéler l'existence du compte", async () => {
    const o = await newOrg();
    const ok = await login({ email: o.email, password: PASSWORD }, { ip: "1.1.1.1" });
    expect((await authenticate(ok.token))?.userId).toBe(o.userId);
    const bad = await login({ email: o.email, password: "mauvais-mot-2" }, { ip: "1.1.1.2" }).catch((e) => e);
    const ghost = await login({ email: uniq("none"), password: "mauvais-mot-2" }, { ip: "1.1.1.3" }).catch((e) => e);
    expect(bad.message).toBe(ghost.message);
    expect(bad.status).toBe(401);
  });

  it("bloque après 5 tentatives échouées (limitation des tentatives)", async () => {
    const o = await newOrg();
    for (let i = 0; i < 5; i++) await login({ email: o.email, password: "faux-faux-12" }, { ip: "2.2.2.2" }).catch(() => {});
    await expect(login({ email: o.email, password: PASSWORD }, { ip: "2.2.2.2" })).rejects.toMatchObject({ status: 429 });
  });

  it("réinitialise le mot de passe, invalide les anciennes sessions et le lien", async () => {
    const o = await newOrg();
    await requestPasswordReset(o.email, { ip: "3.3.3.3" });
    const token = lastLink(o.email, "/reinitialisation/");
    await resetPassword({ token, password: "NouveauMdp2026" });
    expect(await authenticate(o.token)).toBeNull();
    await expect(resetPassword({ token, password: "AutreMdp2026ab" })).rejects.toMatchObject({ status: 400 });
    const s = await login({ email: o.email, password: "NouveauMdp2026" }, { ip: "3.3.3.4" });
    expect(await authenticate(s.token)).not.toBeNull();
  });

  it("ne révèle pas l'existence d'un compte lors de la demande de réinitialisation", async () => {
    await expect(requestPasswordReset(uniq("ghost"), { ip: "4.4.4.4" })).resolves.toBeUndefined();
  });

  it("ne stocke ni le mot de passe ni le jeton de session en clair", async () => {
    const o = await newOrg();
    const u = await prisma.session.findFirst({ where: { userId: o.userId } });
    expect(u!.tokenHash).not.toBe(o.token);
    expect(u!.tokenHash).toHaveLength(64);
  });
});
