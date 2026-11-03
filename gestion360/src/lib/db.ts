import { PrismaClient, Prisma } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

export type Tx = Prisma.TransactionClient;

/** Contexte de sécurité transmis à PostgreSQL (lu par les politiques RLS). */
export interface DbContext {
  organizationId?: string | null;
  userId?: string | null;
  platform?: boolean;
  inviteTokenHash?: string | null;
  loginEmail?: string | null;
}

/**
 * Point d'entrée UNIQUE pour tout accès aux données métier.
 * Pose le contexte (entreprise, utilisateur…) dans la transaction ; les politiques RLS filtrent ensuite
 * au niveau de la base, même si le code applicatif oubliait un filtre.
 */
export async function withContext<T>(ctx: DbContext, fn: (tx: Tx) => Promise<T>): Promise<T> {
  return prisma.$transaction(
    async (tx) => {
      await tx.$executeRaw`SELECT
        set_config('app.current_org', ${ctx.organizationId ?? ""}, true),
        set_config('app.current_user', ${ctx.userId ?? ""}, true),
        set_config('app.platform', ${ctx.platform ? "on" : "off"}, true),
        set_config('app.invite_token', ${ctx.inviteTokenHash ?? ""}, true),
        set_config('app.login_email', ${ctx.loginEmail ?? ""}, true)`;
      return fn(tx);
    },
    { timeout: 15000 },
  );
}

export const withTenant = <T>(organizationId: string, userId: string | null, fn: (tx: Tx) => Promise<T>) =>
  withContext({ organizationId, userId }, fn);
