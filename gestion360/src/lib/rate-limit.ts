import { prisma } from "./db";
import { AppError } from "./errors";

/** Compteur à fenêtre fixe, atomique (une seule requête SQL). Lève 429 au-delà du maximum. */
export async function rateLimit(key: string, max: number, windowSec: number) {
  const rows = await prisma.$queryRaw<{ count: number }[]>`
    INSERT INTO rate_limits ("key", "count", "windowStart") VALUES (${key}, 1, now())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN rate_limits."windowStart" < now() - make_interval(secs => ${windowSec}) THEN 1 ELSE rate_limits."count" + 1 END,
      "windowStart" = CASE WHEN rate_limits."windowStart" < now() - make_interval(secs => ${windowSec}) THEN now() ELSE rate_limits."windowStart" END
    RETURNING "count"`;
  if (rows[0].count > max) throw new AppError("RATE_LIMITED", 429, "Trop de tentatives. Réessayez plus tard.");
}
export const resetRateLimit = (key: string) => prisma.rateLimit.deleteMany({ where: { key } });
