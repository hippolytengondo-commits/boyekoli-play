import { api, setSessionCookie } from "@/lib/http";
import { NextResponse } from "next/server";
import { login, loginInput } from "@/modules/auth/service";

export const POST = api({ auth: false, body: loginInput }, async ({ body, req, ip }) => {
  const r = await login(body, { ip, userAgent: req.headers.get("user-agent") });
  const res = NextResponse.json({ userId: r.userId, organizationId: r.organizationId });
  setSessionCookie(res, r.token, r.expiresAt);
  return res;
});
