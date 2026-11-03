import { api } from "@/lib/http";
import { auditQuery, listAuditLogs } from "@/modules/audit/service";

export const GET = api({ query: auditQuery }, ({ ctx, query }) => listAuditLogs(ctx, query));
