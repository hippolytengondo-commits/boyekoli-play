# Schéma de base de données (Phase 1)

Source : `prisma/schema.prisma` + migrations SQL (`prisma/migrations`). Colonnes en camelCase, tables en snake_case pluriel.

| Table | Portée | Rôle |
|---|---|---|
| `users` | plateforme | Comptes (e-mail unique, hash Argon2id, `isPlatformAdmin` protégé) |
| `sessions` | plateforme | Sessions (hash du jeton, entreprise active, expiration, révocation) |
| `auth_tokens` | plateforme | Réinitialisation de mot de passe / vérification d'e-mail (hash, usage unique) |
| `rate_limits` | plateforme | Compteurs de limitation |
| `permissions` | plateforme | Catalogue des permissions |
| `organizations` / `organization_settings` | tenant | Identité juridique, secteur, pays, devise, profil réglementaire, modules activés, compteur de matricules |
| `memberships` / `membership_roles` | tenant | Accès d'un utilisateur à une entreprise; rôles cumulables |
| `roles` / `role_permissions` | tenant | Rôles propres à chaque entreprise |
| `departments` / `positions` / `employees` | tenant | Organisation (hiérarchie de départements, matricule `EMP-000001`) |
| `invitations` | tenant | Invitations (hash du jeton, rôles, affectation, expiration 7 j) |
| `audit_logs` | tenant | Journal d'audit, **ajout seul** (UPDATE/DELETE/TRUNCATE révoqués) |

Toutes les tables « tenant » portent `organizationId`, sont sous RLS forcée, et les relations internes utilisent des FK composites `(id, organizationId)`.
Contraintes d'unicité par entreprise : code de département, intitulé de poste, matricule, clé de rôle.
Entités des phases suivantes (Contracts, Payroll, Invoices, Workflows, AIConversations…) : à ajouter par migrations.
