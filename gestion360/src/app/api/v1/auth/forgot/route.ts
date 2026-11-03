import { api } from "@/lib/http";
import { requestPasswordReset, resetRequestInput } from "@/modules/auth/service";

export const POST = api({ auth: false, body: resetRequestInput }, async ({ body, ip, req }) => {
  await requestPasswordReset(body.email, { ip, userAgent: req.headers.get("user-agent") });
  return { ok: true }; // réponse identique que le compte existe ou non
});
