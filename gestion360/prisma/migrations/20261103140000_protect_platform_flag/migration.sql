-- Le drapeau « administrateur de plateforme » ne peut être posé que par une connexion d'exploitation
-- (propriétaire du schéma), jamais par le rôle applicatif g360_app, même en cas de faille applicative.
CREATE FUNCTION protect_platform_flag() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF session_user = 'g360_app' AND (
       (TG_OP = 'INSERT' AND NEW."isPlatformAdmin")
    OR (TG_OP = 'UPDATE' AND NEW."isPlatformAdmin" IS DISTINCT FROM OLD."isPlatformAdmin")
  ) THEN
    RAISE EXCEPTION 'isPlatformAdmin ne peut pas être modifié par le rôle applicatif' USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER users_protect_platform_flag BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION protect_platform_flag();
