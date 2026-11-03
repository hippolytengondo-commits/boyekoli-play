import { randomUUID } from "node:crypto";
import { z } from "zod";
import { prisma, withContext, withTenant } from "@/lib/db";
import { audit, auditGlobal } from "@/lib/audit";
import { createSession, revokeAllSessions, type AuthContext } from "@/lib/auth";
import { dummyHash, hashPassword, newToken, sha256, verifyPassword } from "@/lib/crypto";
import { env } from "@/lib/env";
import { AppError, badRequest, conflict, notFound } from "@/lib/errors";
import { sendMail } from "@/lib/mailer";
import { rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { ROLE_TEMPLATES, OWNER_ROLE_KEY } from "@/lib/rbac/templates";
import { emailSchema, passwordSchema, slugify } from "@/lib/util";
import { syncPermissionCatalog } from "@/modules/rbac/sync";
import { createEmployeeTx } from "@/modules/employees/service";

export interface Meta { ip?: string | null; userAgent?: string | null }
const SECTORS = ["COMMERCE","INDUSTRIE","BTP","SANTE","EDUCATION","TRANSPORT","AGRICULTURE","TECHNOLOGIE","SERVICES","ONG","HOTELLERIE","INSTITUTION"] as const;

export const registerInput = z.object({
  organizationName: z.string().trim().min(2).max(120),
  sector: z.enum(SECTORS),
  country: z.string().trim().length(2).toUpperCase().default("CD"),
  name: z.string().trim().min(2).max(120),
  email: emailSchema,
  password: passwordSchema,
});
export const loginInput = z.object({ email: emailSchema, password: z.string().min(1).max(200) });
export const resetRequestInput = z.object({ email: emailSchema });
export const resetInput = z.object({ token: z.string().min(10).max(200), password: passwordSchema });
export const acceptInput = z.object({ name: z.string().trim().min(2).max(120).optional(), password: z.string().min(1).max(200) });

const hours = (h: number) => new Date(Date.now() + h * 3600_000);

async function issueAuthToken(userId: string, type: "PASSWORD_RESET" | "EMAIL_VERIFICATION", ttlHours: number) {
  const token = newToken();
  await prisma.authToken.create({ data: { userId, type, tokenHash: sha256(token), expiresAt: hours(ttlHours) } });
  return token;
}

/** Scénarios 1 & 2 : création d'une entreprise et de son administrateur (Directeur général). */
export async function registerOrganization(input: z.infer<typeof registerInput>, meta: Meta) {
  await rateLimit(`register:ip:${meta.ip ?? "?"}`, 10, 3600);
  const exists = await withContext({ loginEmail: input.email }, (tx) => tx.user.findUnique({ where: { email: input.email }, select: { id: true } }));
  if (exists) throw conflict("Cette adresse e-mail est déjà utilisée.");

  const userId = randomUUID();
  const orgId = randomUUID();
  const passwordHash = await hashPassword(input.password);

  await withContext({ organizationId: orgId, userId }, async (tx) => {
    await tx.user.create({ data: { id: userId, email: input.email, name: input.name, passwordHash } });
    await tx.organization.create({
      data: { id: orgId, name: input.organizationName, slug: `${slugify(input.organizationName)}-${newToken().slice(0, 5).toLowerCase().replace(/[^a-z0-9]/g, "x")}`, sector: input.sector, country: input.country },
    });
    await tx.organizationSettings.create({ data: { organizationId: orgId, defaultCurrency: input.country === "CD" ? "CDF" : "USD", regulatoryProfile: input.country === "CD" ? "CD-OHADA" : `${input.country}-GENERIC` } });
    await syncPermissionCatalog(tx);
    let ownerRoleId = "";
    for (const t of ROLE_TEMPLATES) {
      const role = await tx.role.create({ data: { organizationId: orgId, key: t.key, name: t.name, description: t.description, isSystem: true, isLocked: !!t.locked } });
      if (t.key === OWNER_ROLE_KEY) ownerRoleId = role.id;
      if (!t.locked) await tx.rolePermission.createMany({ data: t.permissions.map((permissionKey) => ({ roleId: role.id, organizationId: orgId, permissionKey })) });
    }
    const membership = await tx.membership.create({ data: { userId, organizationId: orgId } });
    await tx.membershipRole.create({ data: { membershipId: membership.id, roleId: ownerRoleId, organizationId: orgId } });
    await createEmployeeTx(tx, orgId, { firstName: input.name.split(" ")[0], lastName: input.name.split(" ").slice(1).join(" ") || input.name, email: input.email, userId });
    await audit(tx, { organizationId: orgId, userId, ip: meta.ip }, { action: "organization.create", entityType: "Organization", entityId: orgId, metadata: { name: input.organizationName, sector: input.sector } });
  });

  const verify = await issueAuthToken(userId, "EMAIL_VERIFICATION", 48);
  await sendMail({ to: input.email, subject: "Confirmez votre adresse e-mail — GESTION360", text: `Bienvenue sur GESTION360.\nConfirmez votre adresse : ${env.appUrl}/verification-email/${verify}` });
  const session = await createSession(userId, meta, orgId);
  return { userId, organizationId: orgId, ...session };
}

export async function login(input: z.infer<typeof loginInput>, meta: Meta) {
  await rateLimit(`login:ip:${meta.ip ?? "?"}`, 60, 900);
  const key = `login:acct:${input.email}`;
  await rateLimit(key, 5, 900);
  const user = await withContext({ loginEmail: input.email }, (tx) => tx.user.findUnique({ where: { email: input.email } }));
  const ok = await verifyPassword(user?.passwordHash ?? (await dummyHash), input.password);
  if (!user || !ok || user.status !== "ACTIVE") {
    await auditGlobal({ action: "auth.login_failed", entityType: "User", entityId: user?.id ?? null, ip: meta.ip });
    throw new AppError("INVALID_CREDENTIALS", 401, "Adresse e-mail ou mot de passe incorrect.");
  }
  await resetRateLimit(key);
  const first = await withContext({ userId: user.id }, async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return tx.membership.findFirst({ where: { userId: user.id, status: "ACTIVE", organization: { status: "ACTIVE" } }, orderBy: { createdAt: "asc" } });
  });
  if (first) await withTenant(first.organizationId, user.id, (tx) => audit(tx, { organizationId: first.organizationId, userId: user.id, ip: meta.ip }, { action: "auth.login", entityType: "User", entityId: user.id }));
  const session = await createSession(user.id, meta, first?.organizationId);
  return { userId: user.id, organizationId: first?.organizationId ?? null, ...session };
}

export async function requestPasswordReset(email: string, meta: Meta) {
  await rateLimit(`reset:ip:${meta.ip ?? "?"}`, 10, 3600);
  await rateLimit(`reset:acct:${email}`, 3, 3600);
  const user = await withContext({ loginEmail: email }, (tx) => tx.user.findUnique({ where: { email } }));
  if (!user || user.status !== "ACTIVE") return; // réponse identique : pas d'énumération de comptes
  const token = await issueAuthToken(user.id, "PASSWORD_RESET", 1);
  await sendMail({ to: email, subject: "Réinitialisation du mot de passe — GESTION360", text: `Réinitialisez votre mot de passe (valable 1 heure) : ${env.appUrl}/reinitialisation/${token}` });
}

export async function resetPassword(input: z.infer<typeof resetInput>) {
  const t = await prisma.authToken.findUnique({ where: { tokenHash: sha256(input.token) } });
  if (!t || t.type !== "PASSWORD_RESET" || t.usedAt || t.expiresAt < new Date()) throw badRequest("Lien invalide ou expiré.");
  const passwordHash = await hashPassword(input.password);
  await withContext({ userId: t.userId }, (tx) => tx.user.update({ where: { id: t.userId }, data: { passwordHash } }));
  await prisma.authToken.update({ where: { id: t.id }, data: { usedAt: new Date() } });
  await revokeAllSessions(t.userId);
  await auditGlobal({ action: "auth.password_reset", entityType: "User", entityId: t.userId, userId: t.userId });
}

export async function verifyEmail(token: string) {
  const t = await prisma.authToken.findUnique({ where: { tokenHash: sha256(token) } });
  if (!t || t.type !== "EMAIL_VERIFICATION" || t.usedAt || t.expiresAt < new Date()) throw badRequest("Lien invalide ou expiré.");
  await withContext({ userId: t.userId }, (tx) => tx.user.update({ where: { id: t.userId }, data: { emailVerifiedAt: new Date() } }));
  await prisma.authToken.update({ where: { id: t.id }, data: { usedAt: new Date() } });
}

/** Un utilisateur peut disposer de plusieurs accès professionnels : changement d'entreprise active. */
export async function listMyOrganizations(userId: string) {
  return withContext({ userId }, async (tx) => {
    const ms = await tx.membership.findMany({ where: { userId, status: "ACTIVE" }, include: { organization: { select: { id: true, name: true, status: true } } } });
    return ms.map((m) => m.organization);
  });
}
export async function switchOrganization(ctx: AuthContext, organizationId: string) {
  const ok = await withContext({ userId: ctx.userId }, (tx) => tx.membership.findFirst({ where: { userId: ctx.userId, organizationId, status: "ACTIVE", organization: { status: "ACTIVE" } } }));
  if (!ok) throw notFound("Entreprise introuvable.");
  await prisma.session.update({ where: { id: ctx.sessionId }, data: { activeOrganizationId: organizationId } });
}

export async function previewInvitation(token: string) {
  const h = sha256(token);
  const inv = await withContext({ inviteTokenHash: h }, (tx) => tx.invitation.findUnique({ where: { tokenHash: h } }));
  if (!inv || inv.status !== "PENDING" || inv.expiresAt < new Date()) throw notFound("Invitation invalide ou expirée.");
  const org = await withContext({ inviteTokenHash: h }, (tx) => tx.organization.findUnique({ where: { id: inv.organizationId }, select: { name: true } }));
  const existing = await withContext({ loginEmail: inv.email }, (tx) => tx.user.findUnique({ where: { email: inv.email }, select: { id: true } }));
  return { email: inv.email, organizationName: org?.name ?? "", existingAccount: !!existing };
}

/** Scénario 4 : acceptation d'une invitation d'employé. */
export async function acceptInvitation(token: string, input: z.infer<typeof acceptInput>, meta: Meta) {
  await rateLimit(`invite:ip:${meta.ip ?? "?"}`, 20, 3600);
  const h = sha256(token);
  const inv = await withContext({ inviteTokenHash: h }, (tx) => tx.invitation.findUnique({ where: { tokenHash: h } }));
  if (!inv || inv.status !== "PENDING" || inv.expiresAt < new Date()) throw notFound("Invitation invalide ou expirée.");

  let user = await withContext({ loginEmail: inv.email }, (tx) => tx.user.findUnique({ where: { email: inv.email } }));
  if (user) {
    await rateLimit(`login:acct:${inv.email}`, 5, 900);
    if (!(await verifyPassword(user.passwordHash, input.password)) || user.status !== "ACTIVE") throw new AppError("INVALID_CREDENTIALS", 401, "Mot de passe incorrect.");
  } else {
    if (!input.name) throw badRequest("Le nom est requis pour créer le compte.");
    const parsed = passwordSchema.safeParse(input.password);
    if (!parsed.success) throw badRequest(parsed.error.issues[0].message);
    const id = randomUUID();
    const passwordHash = await hashPassword(input.password);
    user = await withContext({ userId: id }, (tx) => tx.user.create({ data: { id, email: inv.email, name: input.name!, passwordHash, emailVerifiedAt: new Date() } }));
  }
  const u = user;
  await withTenant(inv.organizationId, u.id, async (tx) => {
    const already = await tx.membership.findFirst({ where: { userId: u.id } });
    if (already) throw conflict("Vous êtes déjà membre de cette entreprise.");
    const roles = await tx.role.findMany({ where: { id: { in: inv.roleIds } }, select: { id: true } });
    const m = await tx.membership.create({ data: { userId: u.id, organizationId: inv.organizationId } });
    await tx.membershipRole.createMany({ data: roles.map((r) => ({ membershipId: m.id, roleId: r.id, organizationId: inv.organizationId })) });
    const [first, ...rest] = u.name.split(" ");
    await createEmployeeTx(tx, inv.organizationId, { firstName: first, lastName: rest.join(" ") || first, email: u.email, userId: u.id, departmentId: inv.departmentId, positionId: inv.positionId });
    await tx.invitation.update({ where: { id: inv.id }, data: { status: "ACCEPTED", acceptedAt: new Date() } });
    await audit(tx, { organizationId: inv.organizationId, userId: u.id, ip: meta.ip }, { action: "invitation.accept", entityType: "Invitation", entityId: inv.id });
  });
  const session = await createSession(u.id, meta, inv.organizationId);
  return { userId: u.id, organizationId: inv.organizationId, ...session };
}
