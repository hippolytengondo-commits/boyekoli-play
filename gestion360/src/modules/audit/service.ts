import { z } from "zod";
import { withTenant } from "@/lib/db";
import { requireOrg, requirePermission, type AuthContext } from "@/lib/auth";
import { pageSchema, paginate } from "@/lib/util";

export const auditQuery = pageSchema.extend({ action: z.string().max(80).optional(), entityType: z.string().max(60).optional() });

export async function listAuditLogs(ctx: AuthContext, q: z.infer<typeof auditQuery>) {
  requirePermission(ctx, "audit.read");
  return withTenant(requireOrg(ctx), ctx.userId, async (tx) => {
    const where = { ...(q.action ? { action: { startsWith: q.action } } : {}), ...(q.entityType ? { entityType: q.entityType } : {}) };
    const [rows, total] = await Promise.all([tx.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, ...paginate(q.page, q.pageSize) }), tx.auditLog.count({ where })]);
    const ids = [...new Set(rows.map((r) => r.actorUserId).filter((x): x is string => !!x))];
    const users = ids.length ? await tx.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } }) : [];
    const names = new Map(users.map((u) => [u.id, u.name]));
    return { items: rows.map((r) => ({ ...r, actorName: r.actorUserId ? names.get(r.actorUserId) ?? null : null })), total, page: q.page, pageSize: q.pageSize };
  });
}
