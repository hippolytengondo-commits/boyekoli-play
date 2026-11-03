import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { SESSION_COOKIE, authenticate, parseCookie, type AuthContext } from "./auth";
import { env } from "./env";
import { AppError, unauthorized } from "./errors";

type Params = Record<string, string>;
interface Args<B, Q> { ctx: AuthContext; body: B; query: Q; params: Params; req: NextRequest; ip: string | null }
interface Opts<B, Q> { auth?: boolean; body?: ZodType<B>; query?: ZodType<Q>; status?: number }

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || null;

/** Protection CSRF : les requêtes qui modifient l'état doivent venir de notre origine et être en JSON. */
function checkOrigin(req: Request) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
  const origin = req.headers.get("origin");
  const allowed = new URL(env.appUrl).origin;
  const host = req.headers.get("host");
  if (!origin || (origin !== allowed && (!host || new URL(origin).host !== host || env.isProd)))
    throw new AppError("CSRF", 403, "Origine de la requête refusée.");
  const ct = req.headers.get("content-type") ?? "";
  if (req.headers.get("content-length") !== "0" && req.method !== "DELETE" && !ct.includes("application/json"))
    throw new AppError("UNSUPPORTED_MEDIA_TYPE", 415, "Content-Type application/json requis.");
}

export function errorResponse(e: unknown) {
  if (e instanceof AppError) return NextResponse.json({ error: { code: e.code, message: e.message, details: e.details } }, { status: e.status });
  if (e instanceof ZodError)
    return NextResponse.json({ error: { code: "VALIDATION", message: e.issues[0]?.message ?? "Données invalides.", details: e.issues.map((i) => ({ path: i.path.join("."), message: i.message })) } }, { status: 422 });
  console.error("[api] erreur interne", e);
  return NextResponse.json({ error: { code: "INTERNAL", message: "Erreur interne du serveur." } }, { status: 500 });
}

export const setSessionCookie = (res: NextResponse, token: string, expires: Date) =>
  res.cookies.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: env.isProd, path: "/", expires });
export const clearSessionCookie = (res: NextResponse) => res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: env.isProd, path: "/", maxAge: 0 });

/** Enveloppe de route : CSRF, authentification, validation Zod, gestion centralisée des erreurs. */
export function api<B = undefined, Q = undefined, R = unknown>(opts: Opts<B, Q>, fn: (a: Args<B, Q>) => Promise<R | NextResponse>) {
  // Signature exigée par Next.js pour les route handlers (le 2e argument est toujours fourni à l'exécution).
  return async (req: NextRequest, route: { params: Promise<Params> }): Promise<NextResponse> => {
    try {
      checkOrigin(req);
      const ip = clientIp(req);
      let ctx = null as AuthContext | null;
      if (opts.auth !== false) {
        ctx = await authenticate(parseCookie(req.headers.get("cookie")), ip);
        if (!ctx) throw unauthorized();
      }
      const query = opts.query ? opts.query.parse(Object.fromEntries(new URL(req.url).searchParams)) : (undefined as Q);
      let body = undefined as B;
      if (opts.body) {
        const raw = await req.json().catch(() => { throw new AppError("BAD_JSON", 400, "Corps JSON invalide."); });
        body = opts.body.parse(raw);
      }
      const params = route?.params ? await route.params : {};
      const out = await fn({ ctx: ctx as AuthContext, body, query, params, req, ip });
      if (out instanceof NextResponse) return out;
      return NextResponse.json(out ?? { ok: true }, { status: opts.status ?? 200 });
    } catch (e) {
      return errorResponse(e);
    }
  };
}
