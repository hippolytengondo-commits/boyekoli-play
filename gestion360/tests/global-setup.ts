import pg from "pg";

/** Remet la base de test à zéro (connexion propriétaire) avant la série de tests. */
export default async function setup() {
  process.loadEnvFile(".env.test");
  const c = new pg.Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();
  await c.query(`DO $$ DECLARE r record; BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename <> '_prisma_migrations' LOOP
      EXECUTE format('TRUNCATE TABLE %I CASCADE', r.tablename);
    END LOOP; END $$;`);
  await c.end();
}
