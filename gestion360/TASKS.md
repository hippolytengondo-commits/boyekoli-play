# GESTION360 — Suivi des tâches

Légende : [x] terminé **et testé** · [~] partiel · [ ] à faire. Aucune case n'est cochée sans test.

## Phase 1 — Socle technique (terminée, sauf MFA)
- [x] Inspection de l'environnement, PROJECT_PLAN.md, TASKS.md
- [x] Initialisation Next.js 15 / TypeScript / Tailwind / Prisma 6 / PostgreSQL 16
- [x] Schéma de base de données + migrations + RLS forcée + FK composites (tests d'isolation)
- [x] Authentification : inscription entreprise, connexion, déconnexion, limitation, réinitialisation, vérification e-mail (transport console)
- [x] Gestion des entreprises : création, paramètres, suspension/réactivation par la plateforme (journalisée)
- [x] Rôles et permissions (RBAC) : 15 rôles types, rôles personnalisés, anti-escalade, protection du dernier DG
- [x] Départements, postes, employés (socle : matricule, recherche, pagination)
- [x] Invitations d'utilisateurs (jeton à usage unique, 7 jours)
- [x] Journal d'audit en ajout seul
- [x] Tableau de bord (indicateurs réels uniquement)
- [x] Design system et interface responsive (vérifiée sur bureau et mobile)
- [x] Tests : 39 tests Vitest sur PostgreSQL réel + 1 parcours E2E Chromium (voir docs/TEST_REPORT.md)
- [x] Documentation Phase 1 (architecture, base, API, permissions, installation, tests)
- [ ] Authentification multifacteur (TOTP) pour comptes sensibles — **reportée**
- [ ] Envoi d'e-mails réel (SMTP) — **reporté**, dépend d'un prestataire à configurer
- [ ] PWA installable, internationalisation EN/Lingala — phase 9 / ultérieur
- [ ] Intégration continue (workflow CI) — à ajouter

## Phases 2 à 9
Non démarrées (voir PROJECT_PLAN.md et cahier des charges Partie XII).
