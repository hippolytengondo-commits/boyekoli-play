# GESTION360 — Plan de projet

Plateforme SaaS multi-entreprises de gestion intégrée (ERP). Promoteur : NGONDO SHAKO HIPPOLITE.
Ce document applique le cahier des charges (Règles 1 et 2) : architecture, dossiers, modèle de données, dépendances, étapes, risques.

## 1. Inspection préalable (Règle 1)

Le dépôt hôte (`Kelasi-game-`) contient un jeu éducatif indépendant (BOYEKOLI, JavaScript/esbuild/Three.js) à la racine.
Aucun fichier de ce jeu n'est modifié. GESTION360 vit dans le dossier autonome `gestion360/` (son propre `package.json`,
sa propre base de données, ses propres tests) afin de pouvoir être extrait tel quel vers un dépôt dédié
(`git subtree split --prefix=gestion360`). Aucun code GESTION360 préexistant n'a été trouvé.

## 2. Architecture retenue

Monolithe modulaire (Article 32), pas de microservices.

| Couche | Choix | Justification |
|---|---|---|
| Frontend + serveur | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 3 | Imposé par l'article 31 ; composants serveur pour les lectures, PWA ensuite |
| API | Route handlers `/api/v1/*`, validation Zod, gestionnaire d'erreurs centralisé | API structurée et documentée ; services métier indépendants du transport |
| Base de données | PostgreSQL 16, Prisma 6, migrations versionnées | Article 31 |
| Isolation multi-entreprises | 3 verrous : (1) l'identifiant d'entreprise vient uniquement de la session serveur ; (2) tout accès métier passe par `withTenant()` ; (3) **Row-Level Security PostgreSQL** (`FORCE ROW LEVEL SECURITY`) + clés étrangères composites `(id, organization_id)` | Règle 4 : jamais de confiance envers le frontend |
| Authentification | Sessions opaques en base (jeton haché SHA-256), cookie HttpOnly/SameSite=Lax, Argon2id, limitation des tentatives, jetons de réinitialisation et de vérification | Article 34 |
| Autorisations | RBAC : permissions du catalogue (code) → rôles propres à chaque entreprise → membres (rôles cumulables), contrôle côté serveur | Article 5 |
| Audit | Table `audit_logs` en ajout seul (UPDATE/DELETE révoqués au rôle applicatif) | Articles 5.1, 34 |
| Tests | Vitest sur une vraie base PostgreSQL (`gestion360_test`) | Articles 38, 39 |

## 3. Organisation des dossiers

```
gestion360/
  prisma/            schema.prisma, migrations/, seed.ts
  src/lib/           env, db (withTenant), http, errors, auth, session, rbac, audit, mailer, rate-limit
  src/modules/<m>/   service.ts (règles métier + autorisations), schemas.ts (Zod)  — un dossier par module
  src/app/api/v1/    routes HTTP
  src/app/(auth)/    connexion, inscription, mot de passe, invitation
  src/app/(app)/     espace entreprise (tableau de bord, organisation, utilisateurs, rôles, audit, paramètres)
  src/app/(platform) administration générale de la plateforme
  src/components/    design system (Button, Card, Table, Field…)
  tests/             isolation, RBAC, authentification, services
  docs/              architecture, API, permissions, installation, sécurité, sauvegardes, rapport de tests
```

## 4. Modèle de données

Détaillé dans `prisma/schema.prisma` et `docs/DATABASE.md`. Phase 1 : Organization, OrganizationSettings, User, Session,
Membership, Role, Permission, RolePermission, MembershipRole, Department, Position, Employee, Invitation, AuthToken,
RateLimit, AuditLog. Les entités des phases suivantes (Contracts, Payroll, Invoices, Workflows…) seront ajoutées par migrations.

## 5. Dépendances

next, react, @prisma/client, zod, @node-rs/argon2, lucide-react, tailwindcss ; dev : typescript, prisma, vitest, tsx.
Dépendances externes futures (aucune n'est simulée comme opérationnelle — Règle 7) :

| Besoin | Phase | Intégration prévue |
|---|---|---|
| Envoi d'e-mails | 1 (transport `console` en test) → 9 | SMTP / prestataire, variable `MAIL_TRANSPORT` |
| Stockage objet S3 | 2 | Interface `FileStorage`, adaptateur disque en dev |
| Signature électronique qualifiée | 2/5 | Prestataire à choisir ; la validation interne n'est pas une signature qualifiée |
| Fournisseur IA | 8 | Interface `AiProvider`, fournisseur interchangeable, fonctionnement sans IA |
| Paiements d'abonnement | 9 | Prestataires à configurer et tester avant activation |

## 6. Phases et étapes

Une phase à la fois : implémenter → tester → corriger → documenter → vérifier → mettre à jour `TASKS.md`.
Phases 1 à 9 telles que définies à la Partie XII du cahier des charges ; état d'avancement dans `TASKS.md`.

## 7. Risques techniques

| Risque | Mesure |
|---|---|
| Fuite de données entre entreprises | RLS PostgreSQL + FK composites + tests d'isolation automatisés (identifiants modifiés dans les requêtes) |
| Élévation de privilèges | Permissions vérifiées dans chaque service ; protection du dernier propriétaire ; rôle verrouillé |
| Conformité légale (RGPD-like, droit du travail RDC, OHADA, signature) | Taux et règles paramétrables et datés ; aucune affirmation de conformité automatique ; revue juridique avant commercialisation |
| Périmètre très large | Développement par phases ; modules non implémentés non affichés |
| Ampleur de la paie / comptabilité | Calculs en décimaux (jamais de flottants), taux datés, écritures immuables après clôture (phases 3–4) |
| Dépendance à un fournisseur IA | Interface abstraite, repli sans IA |
