import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, authenticate, can, type AuthContext } from "./auth";
import type { PermissionKey } from "./rbac/permissions";

/** Contexte d'authentification pour les composants serveur (redirige vers la connexion si absent). */
export async function requireAuth(): Promise<AuthContext> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  const ctx = await authenticate(token, ip);
  if (!ctx) redirect("/connexion");
  return ctx;
}

export async function requirePage(perm: PermissionKey): Promise<AuthContext> {
  const ctx = await requireAuth();
  if (!ctx.organizationId || !can(ctx, perm)) redirect("/tableau-de-bord");
  return ctx;
}
