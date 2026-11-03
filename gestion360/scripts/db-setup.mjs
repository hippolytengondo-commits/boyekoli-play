// Crée le rôle applicatif NON propriétaire (sans BYPASSRLS) utilisé par l'application.
// Usage : node --env-file=.env scripts/db-setup.mjs
import pg from "pg";
const { DIRECT_URL, APP_DB_PASSWORD } = process.env;
if (!DIRECT_URL || !APP_DB_PASSWORD) throw new Error("DIRECT_URL et APP_DB_PASSWORD requis");
const c = new pg.Client({ connectionString: DIRECT_URL });
await c.connect();
const pw = APP_DB_PASSWORD.replace(/'/g, "''");
await c.query(`DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='g360_app') THEN
    CREATE ROLE g360_app LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEDB NOCREATEROLE PASSWORD '${pw}';
  ELSE
    ALTER ROLE g360_app LOGIN NOSUPERUSER NOBYPASSRLS PASSWORD '${pw}';
  END IF; END $$;`);
console.log("Rôle g360_app prêt.");
await c.end();
