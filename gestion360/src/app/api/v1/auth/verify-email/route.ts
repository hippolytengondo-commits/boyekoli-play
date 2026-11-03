import { z } from "zod";
import { api } from "@/lib/http";
import { verifyEmail } from "@/modules/auth/service";

export const POST = api({ auth: false, body: z.object({ token: z.string().min(10).max(200) }) }, async ({ body }) => { await verifyEmail(body.token); });
