import type { Tx } from "@/lib/db";
import { PERMISSIONS } from "@/lib/rbac/permissions";

/** Synchronise le catalogue de permissions du code vers la base. */
export async function syncPermissionCatalog(tx: Tx) {
  for (const [key, v] of Object.entries(PERMISSIONS)) {
    await tx.permission.upsert({ where: { key }, create: { key, ...v }, update: { module: v.module, description: v.description } });
  }
}
