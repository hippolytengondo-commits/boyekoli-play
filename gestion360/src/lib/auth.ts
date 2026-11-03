import { prisma, withContext } from "./db";
import { newToken, sha256 } from "./crypto";
import { env } from "./env";
import { forbidden, unauthorized, AppError } from "./errors";
import { ALL_PERMISSIONS, type PermissionKey } from "./rbac/permissions";

export const SESSION_COOKIE = "g360_session";

/** Contexte d'authentification : l'identifiant d'entreprise provient UNIQUEMENT d'ici (session serveur). */
export interface AuthContext {
  userId: string;
  userName: string;
  userEmail: string;
  isPlatformAdmin: boolean;
  sessionId: string;
  organizationId: string | null;
  membershipId: string | null;
  permissions: Set<PermissionKey>;
  ip: string | null;
}

export async function createSession(userId: string, meta: { ip?: string | null; userAgent?: string | null }, activeOrganizationId?: string | null) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 3600_000);
  await prisma.session.create({
    data: { userId, tokenHash: sha256(token), activeOrganizationId: activeOrganizationId ?? null, ip: meta.ip ?? null, userAgent: meta.userAgent?.slice(0, 300) ?? null, expiresAt },
  });
  return { token, expiresAt };
}

export async function revokeSession(token: string) {
  await prisma.session.updateMany({ where: { tokenHash: sha256(token), revokedAt: null }, data: { revokedAt: new Date() } });
}
export const revokeAllSessions = (userId: string) =>
  prisma.session.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });

/** Résout une session en contexte. Retourne null si absente, expirée ou révoquée. */
export async function authenticate(token: string | null | undefined, ip: string | null = null): Promise<AuthContext | null> {
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: sha256(token) } });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;

  const user = await withContext({ userId: session.userId }, (tx) => tx.user.findUnique({ where: { id: session.userId } }));
  if (!user || user.status !== "ACTIVE") return null;

  const memberships = await withContext({ userId: user.id }, (tx) =>
    tx.membership.findMany({ where: { userId: user.id, status: "ACTIVE", organization: { status: "ACTIVE" } }, orderBy: { createdAt: "asc" } }),
  );
  const active = memberships.find((m) => m.organizationId === session.activeOrganizationId) ?? memberships[0] ?? null;

  let permissions = new Set<PermissionKey>();
  if (active) {
    const roles = await withContext({ organizationId: active.organizationId, userId: user.id }, (tx) =>
      tx.membershipRole.findMany({ where: { membershipId: active.id }, include: { role: { include: { permissions: true } } } }),
    );
    for (const mr of roles) {
      if (mr.role.isLocked) ALL_PERMISSIONS.forEach((p) => permissions.add(p));
      for (const rp of mr.role.permissions) permissions.add(rp.permissionKey as PermissionKey);
    }
  }
  // Mise à jour de lastSeen sans bloquer la requête.
  void prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => {});

  return {
    userId: user.id, userName: user.name, userEmail: user.email, isPlatformAdmin: user.isPlatformAdmin,
    sessionId: session.id, organizationId: active?.organizationId ?? null, membershipId: active?.id ?? null, permissions, ip,
  };
}

export function can(ctx: AuthContext, perm: PermissionKey) { return ctx.permissions.has(perm); }

export function requirePermission(ctx: AuthContext, ...perms: PermissionKey[]) {
  for (const p of perms) if (!ctx.permissions.has(p)) throw forbidden();
}

/** Retourne l'identifiant d'entreprise de la session ou lève une erreur. */
export function requireOrg(ctx: AuthContext): string {
  if (!ctx.organizationId) throw new AppError("NO_ORGANIZATION", 403, "Aucune entreprise active pour ce compte.");
  return ctx.organizationId;
}

export function requirePlatformAdmin(ctx: AuthContext) {
  if (!ctx.isPlatformAdmin) throw forbidden();
}

export function parseCookie(header: string | null, name = SESSION_COOKIE): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}
export { unauthorized };
