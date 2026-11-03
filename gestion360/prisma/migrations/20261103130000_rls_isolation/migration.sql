-- Isolation multi-entreprises au niveau PostgreSQL (Article 33/34, Règle 4).
-- Le contexte est posé par l'application dans chaque transaction via set_config('app.*', ..., true).

CREATE FUNCTION app_org() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.current_org', true), '') $$;
CREATE FUNCTION app_user() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.current_user', true), '') $$;
CREATE FUNCTION app_platform() RETURNS boolean LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('app.platform', true), ''), 'off') = 'on' $$;
CREATE FUNCTION app_invite() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.invite_token', true), '') $$;
CREATE FUNCTION app_login_email() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('app.login_email', true), '') $$;

-- Tables simples : toute ligne appartient à l'entreprise du contexte.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['organization_settings','roles','role_permissions','membership_roles','departments','positions','employees']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY tenant_isolation ON %I USING ("organizationId" = app_org()) WITH CHECK ("organizationId" = app_org())', t);
  END LOOP;
END $$;

-- Organisations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations FORCE ROW LEVEL SECURITY;
CREATE POLICY org_select ON organizations FOR SELECT USING (
  id = app_org()
  OR app_platform()
  OR id IN (SELECT "organizationId" FROM memberships WHERE "userId" = app_user())
  OR id IN (SELECT "organizationId" FROM invitations WHERE "tokenHash" = app_invite())
);
CREATE POLICY org_insert ON organizations FOR INSERT WITH CHECK (id = app_org());
CREATE POLICY org_update ON organizations FOR UPDATE USING (id = app_org() OR app_platform()) WITH CHECK (id = app_org() OR app_platform());

-- Adhésions : visibles par l'entreprise, par l'utilisateur concerné, ou comptées par la plateforme.
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships FORCE ROW LEVEL SECURITY;
CREATE POLICY mb_select ON memberships FOR SELECT USING ("organizationId" = app_org() OR "userId" = app_user() OR app_platform());
CREATE POLICY mb_insert ON memberships FOR INSERT WITH CHECK ("organizationId" = app_org());
CREATE POLICY mb_update ON memberships FOR UPDATE USING ("organizationId" = app_org()) WITH CHECK ("organizationId" = app_org());
CREATE POLICY mb_delete ON memberships FOR DELETE USING ("organizationId" = app_org());

-- Invitations : par entreprise, ou par jeton exact (acceptation avant connexion).
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations FORCE ROW LEVEL SECURITY;
CREATE POLICY inv_select ON invitations FOR SELECT USING ("organizationId" = app_org() OR "tokenHash" = app_invite());
CREATE POLICY inv_write ON invitations FOR INSERT WITH CHECK ("organizationId" = app_org());
CREATE POLICY inv_update ON invitations FOR UPDATE USING ("organizationId" = app_org() OR "tokenHash" = app_invite()) WITH CHECK ("organizationId" = app_org());
CREATE POLICY inv_delete ON invitations FOR DELETE USING ("organizationId" = app_org());

-- Utilisateurs : soi-même, l'identifiant de connexion en cours, ou les membres de l'entreprise du contexte.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;
CREATE POLICY usr_select ON users FOR SELECT USING (
  id = app_user()
  OR email = app_login_email()
  OR id IN (SELECT "userId" FROM memberships WHERE "organizationId" = app_org())
);
CREATE POLICY usr_insert ON users FOR INSERT WITH CHECK (true);
CREATE POLICY usr_update ON users FOR UPDATE USING (id = app_user()) WITH CHECK (id = app_user());

-- Journal d'audit : lecture limitée à l'entreprise ; écriture seule (jamais de UPDATE/DELETE).
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY audit_select ON audit_logs FOR SELECT USING ("organizationId" = app_org());
CREATE POLICY audit_insert ON audit_logs FOR INSERT WITH CHECK ("organizationId" IS NULL OR "organizationId" = app_org());

-- Droits du rôle applicatif (non propriétaire, sans BYPASSRLS), s'il existe.
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'g360_app') THEN
    GRANT USAGE ON SCHEMA public TO g360_app;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO g360_app;
    REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM g360_app;
    IF to_regclass('public._prisma_migrations') IS NOT NULL THEN REVOKE ALL ON _prisma_migrations FROM g360_app; END IF;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO g360_app;
  END IF;
END $$;
