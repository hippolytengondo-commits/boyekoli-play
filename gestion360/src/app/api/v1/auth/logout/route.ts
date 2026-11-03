import { api, clearSessionCookie } from "@/lib/http";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, parseCookie, revokeSession } from "@/lib/auth";

export const POST = api({ auth: false }, async ({ req }) => {
  const t = parseCookie(req.headers.get("cookie"), SESSION_COOKIE);
  if (t) await revokeSession(t);
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);
  return res;
});
