import { NextResponse } from "next/server";
import { api, setSessionCookie } from "@/lib/http";
import { acceptInput, acceptInvitation, previewInvitation } from "@/modules/auth/service";

export const GET = api({ auth: false }, ({ params }) => previewInvitation(params.token));
export const POST = api({ auth: false, body: acceptInput }, async ({ body, params, req, ip }) => {
  const r = await acceptInvitation(params.token, body, { ip, userAgent: req.headers.get("user-agent") });
  const res = NextResponse.json({ userId: r.userId, organizationId: r.organizationId });
  setSessionCookie(res, r.token, r.expiresAt);
  return res;
});
