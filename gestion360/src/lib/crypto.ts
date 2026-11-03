import { createHash, randomBytes } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";

export const newToken = () => randomBytes(32).toString("base64url");
export const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
export const hashPassword = (pw: string) => hash(pw, { memoryCost: 19456, timeCost: 2, parallelism: 1 }); // argon2id
export async function verifyPassword(h: string, pw: string) {
  try { return await verify(h, pw); } catch { return false; }
}
// Hash factice réel, pour égaliser le temps de réponse quand le compte n'existe pas.
export const dummyHash: Promise<string> = hashPassword("gestion360-dummy-password");
