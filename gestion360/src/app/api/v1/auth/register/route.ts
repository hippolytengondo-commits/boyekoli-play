import { api, setSessionCookie } from "@/lib/http";
import { NextResponse } from "next/server";
import { registerInput, registerOrganization } from "@/modules/auth/service";

export const POST = api({ auth: false, body: registerInput }, async ({ body, req, ip }) => {
  const r = await registerOrganization(body, { ip, userAgent: req.headers.get("user-agent") });
  const res = NextResponse.json({ userId: r.userId, organizationId: r.organizationId }, { status: 201 });
  setSessionCookie(res, r.token, r.expiresAt);
  return res;
});
