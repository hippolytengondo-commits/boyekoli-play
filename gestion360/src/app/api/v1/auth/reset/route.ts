import { api } from "@/lib/http";
import { resetInput, resetPassword } from "@/modules/auth/service";

export const POST = api({ auth: false, body: resetInput }, async ({ body }) => { await resetPassword(body); });
