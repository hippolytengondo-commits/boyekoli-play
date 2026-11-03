// Crée (ou promeut) l'administrateur général de la plateforme. Connexion PROPRIÉTAIRE requise (DIRECT_URL).
// Usage : PLATFORM_ADMIN_EMAIL=... PLATFORM_ADMIN_PASSWORD=... node --env-file=.env scripts/create-platform-admin.mjs
import pg from "pg";
import { randomUUID } from "node:crypto";
import { hash } from "@node-rs/argon2";

const { DIRECT_URL, PLATFORM_ADMIN_EMAIL: email, PLATFORM_ADMIN_PASSWORD: password } = process.env;
if (!DIRECT_URL || !email || !password) throw new Error("DIRECT_URL, PLATFORM_ADMIN_EMAIL et PLATFORM_ADMIN_PASSWORD sont requis.");
if (password.length < 12) throw new Error("Mot de passe : 12 caractères minimum pour un administrateur de plateforme.");
const c = new pg.Client({ connectionString: DIRECT_URL });
await c.connect();
const passwordHash = await hash(password, { memoryCost: 19456, timeCost: 2, parallelism: 1 });
const e = email.trim().toLowerCase();
const r = await c.query(`UPDATE users SET "isPlatformAdmin" = true WHERE email = $1 RETURNING id`, [e]);
if (r.rowCount === 0)
  await c.query(`INSERT INTO users (id, email, name, "passwordHash", "isPlatformAdmin", "emailVerifiedAt", "updatedAt") VALUES ($1,$2,'Administrateur plateforme',$3,true,now(),now())`, [randomUUID(), e, passwordHash]);
console.log(r.rowCount ? `Compte existant promu : ${e}` : `Administrateur créé : ${e}`);
await c.end();
