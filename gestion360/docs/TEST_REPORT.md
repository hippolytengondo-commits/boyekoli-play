# Rapport de tests — Phase 1

Exécution : `npm run check` (typage + Vitest sur PostgreSQL réel `gestion360_test`) et `npm run e2e` (Chromium, application compilée).

| Suite | Tests | Couvre |
|---|---|---|
| `auth.test.ts` | 8 | Création d'entreprise et d'administrateur (sc. 1, 2), vérification e-mail, connexion, indistinction des erreurs, limitation (5 essais), réinitialisation + révocation des sessions, jetons hachés |
| `rbac.test.ts` | 8 | Invitation d'employé (sc. 4), permissions (sc. 5), anti-escalade, dernier DG, suspension, rôles personnalisés |
| `modules.test.ts` | 6 | Départements/postes/employés (sc. 3), cycles hiérarchiques, matricules, pagination, tableau de bord réel, paramètres, plateforme, changement d'entreprise |
| `isolation.test.ts` | 11 | Isolation (sc. 20) : listes, identifiants modifiés → 404, rattachements croisés, SQL brut sous RLS, FK composites, absence de contexte, audit en ajout seul, session forgée, drapeau plateforme |
| `api.test.ts` | 6 | 401, cookie HttpOnly, CSRF/415, validation 422, identifiant d'entreprise client ignoré, 403 plateforme, déconnexion |
| E2E Chromium | 1 parcours | Inscription → département → employé → invitation → acceptation → contrôle d'accès → isolation → mobile, sans erreur console |

Scénarios de l'article 38 : **1, 2, 3, 4, 5 et 20 couverts**. Les n° 6 à 19 (congés, facture, paiement, écriture comptable, achats, stock, contrat, alerte, projet, tâche, rapport, document) relèvent des phases 2 à 7 et **ne sont pas implémentés**.

## Limites connues
- Pas d'authentification multifacteur, pas d'envoi d'e-mail réel, pas de tests de charge (phase 9).
- Le test E2E nécessite Playwright (installé globalement dans l'environnement de développement, non listé en dépendance).
- Les politiques RLS sont testées avec le rôle applicatif ; un déploiement avec un superutilisateur désactiverait cette protection (voir `INSTALL.md`).
- Conformité légale (protection des données RDC, OHADA, droit du travail, signature électronique) : non évaluée ; revue juridique requise avant commercialisation.
