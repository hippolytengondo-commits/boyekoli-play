import { prisma, type Tx } from "./db";
import type { AuthContext } from "./auth";

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

/** Écrit dans le journal d'audit (ajout seul) dans la transaction en cours. */
export function audit(tx: Tx, who: { organizationId: string | null; userId: string | null; ip?: string | null }, e: AuditEntry) {
  return tx.auditLog.create({
    data: {
      organizationId: who.organizationId,
      actorUserId: who.userId,
      action: e.action,
      entityType: e.entityType,
      entityId: e.entityId ?? null,
      metadata: (e.metadata ?? undefined) as never,
      ip: who.ip ?? null,
    },
  });
}
export const actor = (ctx: AuthContext) => ({ organizationId: ctx.organizationId, userId: ctx.userId, ip: ctx.ip });

/** Événement hors entreprise (connexion échouée, réinitialisation…). createMany : pas de RETURNING, donc pas de relecture soumise à la RLS. */
export const auditGlobal = (e: AuditEntry & { userId?: string | null; ip?: string | null }) =>
  prisma.auditLog.createMany({ data: [{ organizationId: null, actorUserId: e.userId ?? null, action: e.action, entityType: e.entityType, entityId: e.entityId ?? null, ip: e.ip ?? null }] });
