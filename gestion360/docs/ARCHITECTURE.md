# Architecture générale (Phase 1)

Monolithe modulaire Next.js 15 / TypeScript / PostgreSQL 16 / Prisma 6.

```
Navigateur ──► Next.js (pages serveur + /api/v1)
                 │  api() : CSRF → session → validation Zod → service
                 ▼
          src/modules/<m>/service.ts   règles métier + permissions (requirePermission)
                 │  withTenant(orgId, userId, tx => …)
                 ▼
   PostgreSQL : rôle g360_app (non propriétaire, sans BYPASSRLS)
                Row-Level Security FORCÉE + clés étrangères composites (id, organizationId)
```

## Isolation multi-entreprises (priorité n°1)

1. **Identifiant d'entreprise = session serveur uniquement.** Aucune route ni service ne lit `organizationId` dans le corps, l'URL
   ou un en-tête. `AuthContext.organizationId` est dérivé de la session puis revérifié contre `memberships` (actif) et `organizations` (non suspendue) à chaque requête.
2. **`withContext` / `withTenant`** : seul point d'accès aux données. Ouvre une transaction et pose `app.current_org`, `app.current_user`, etc. (`set_config(..., true)`).
3. **RLS PostgreSQL** (`prisma/migrations/*_rls_isolation`) : chaque table métier filtre sur `"organizationId" = app_org()` en lecture **et** en écriture. `FORCE ROW LEVEL SECURITY`.
   Sans contexte, aucune ligne n'est visible (testé).
4. **FK composites** `(departmentId, organizationId) → departments(id, organizationId)` : un employé ne peut pas pointer vers le département d'une autre entreprise, même en SQL brut (testé).
5. **Exceptions maîtrisées** : table `users` (accès à soi-même / membres de l'entreprise du contexte / identifiant de connexion en cours), `organizations` (membres, administrateur de plateforme en métadonnées, invitation par jeton exact), `audit_logs` (ajout seul).
6. **Administrateur de plateforme** : ne voit que les métadonnées d'`organizations` et le nombre de `memberships` ; aucune politique ne lui donne accès aux employés, départements, rôles… (testé). Le drapeau `isPlatformAdmin` n'est modifiable que par une connexion d'exploitation (trigger, testé).

## Authentification

- Mot de passe : Argon2id (`@node-rs/argon2`), politique ≥ 10 caractères, lettre + chiffre.
- Session : jeton aléatoire 256 bits, **seul son SHA-256 est stocké**; cookie `g360_session` HttpOnly, SameSite=Lax, Secure en production; expiration 7 jours (configurable); révocation à la déconnexion et au changement de mot de passe.
- Limitation : connexion 5/15 min par compte, 60/15 min par IP; inscription, réinitialisation, invitation également limitées (table `rate_limits`, atomique).
- Réponses indifférenciées (compte inexistant / mauvais mot de passe; demande de réinitialisation).
- CSRF : en-tête `Origin` obligatoire sur les méthodes modifiantes + `Content-Type: application/json`.
- En-têtes de sécurité : HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy.
- **Non fait en Phase 1** : authentification multifacteur (TOTP) — voir `TASKS.md`.

## Autorisations (RBAC)

Catalogue de permissions en code (`src/lib/rbac/permissions.ts`) synchronisé en base; 15 rôles types créés par entreprise (`templates.ts`), modifiables sauf « Directeur général » (verrouillé, toutes permissions). Les permissions se cumulent entre rôles.
Règles anti-abus : on ne peut attribuer/retirer que des permissions que l'on possède; impossible de suspendre ou de retirer le dernier Directeur général; impossible de modifier son propre accès.

## Dépendances externes (Règle 7)

| Fonction | État |
|---|---|
| E-mail | Transport `console` uniquement (journal serveur). SMTP à brancher et tester avant production. |
| Stockage S3, signature qualifiée, IA, paiements | Non implémentés (phases ultérieures). |
