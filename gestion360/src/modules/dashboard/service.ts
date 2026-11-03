import { withTenant } from "@/lib/db";
import { can, requireOrg, requirePermission, type AuthContext } from "@/lib/auth";

/** Indicateurs réels calculés en base. Aucun chiffre fictif : les modules non implémentés n'apparaissent pas. */
export async function getDashboard(ctx: AuthContext) {
  requirePermission(ctx, "dashboard.read");
  const org = requireOrg(ctx);
  return withTenant(org, ctx.userId, async (tx) => {
    const [employeesByStatus, departments, members, pendingInvitations, perDept, unassigned] = await Promise.all([
      tx.employee.groupBy({ by: ["status"], _count: { _all: true } }),
      tx.department.count(),
      tx.membership.count({ where: { status: "ACTIVE" } }),
      tx.invitation.count({ where: { status: "PENDING", expiresAt: { gt: new Date() } } }),
      tx.department.findMany({ select: { id: true, name: true, code: true, _count: { select: { employees: { where: { status: { not: "TERMINATED" } } } } } }, orderBy: { name: "asc" } }),
      tx.employee.count({ where: { departmentId: null, status: { not: "TERMINATED" } } }),
    ]);
    const byStatus = Object.fromEntries(employeesByStatus.map((e) => [e.status, e._count._all]));
    const recent = can(ctx, "audit.read")
      ? await tx.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, select: { id: true, action: true, entityType: true, createdAt: true } })
      : null;
    return {
      employees: { total: Object.values(byStatus).reduce((a, b) => a + b, 0), active: byStatus.ACTIVE ?? 0, onLeave: byStatus.ON_LEAVE ?? 0, terminated: byStatus.TERMINATED ?? 0, unassigned },
      departments: { total: departments, headcount: perDept.map((d) => ({ id: d.id, name: d.name, code: d.code, count: d._count.employees })) },
      members: { active: members, pendingInvitations },
      recentActivity: recent,
    };
  });
}
