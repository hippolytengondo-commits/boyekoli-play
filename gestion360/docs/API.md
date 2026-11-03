# API REST `/api/v1`

Authentification par cookie de session. Les requêtes modifiantes exigent `Origin` = `APP_URL` et `Content-Type: application/json`.
Erreurs : `{ "error": { "code", "message", "details?" } }` — 401 non authentifié, 403 interdit/CSRF, 404, 409 conflit, 415, 422 validation, 429 limitation, 500.
Listes paginées : `?page=1&pageSize=20` (max 100) → `{ items, total, page, pageSize }`.

| Méthode & chemin | Permission | Description |
|---|---|---|
| POST `/auth/register` | public | Crée entreprise + Directeur général + rôles types, ouvre la session |
| POST `/auth/login` · `/auth/logout` | public / session | |
| POST `/auth/forgot` · `/auth/reset` · `/auth/verify-email` | public | Réinitialisation et vérification par jeton |
| POST `/auth/switch-organization` | session | Change d'entreprise active (adhésion vérifiée) |
| GET `/me` | session | Utilisateur, entreprise active, permissions, entreprises accessibles |
| GET/PATCH `/organization` | `org.settings.read` / `.manage` | Identité et paramètres |
| GET/POST `/departments` · PATCH/DELETE `/departments/{id}` | `departments.read` / `.manage` | |
| GET/POST `/positions` | `departments.read` / `.manage` | |
| GET/POST `/employees` (`q`, `departmentId`, `status`) · GET/PATCH `/employees/{id}` | `employees.read` / `.manage` | |
| GET `/members` · PUT `/members/{id}/roles` · PUT `/members/{id}/status` | `members.read` / `members.manage` | |
| GET/POST `/invitations` · DELETE `/invitations/manage/{id}` | `members.read` / `members.invite` | |
| GET/POST `/invitations/{token}/accept` | public (jeton) | Aperçu et acceptation |
| GET/POST `/roles` · PATCH/DELETE `/roles/{id}` · GET `/permissions` | `roles.read` / `roles.manage` | |
| GET `/audit-logs` (`action`, `entityType`) | `audit.read` | |
| GET `/dashboard` | `dashboard.read` | Indicateurs réels |
| GET `/platform/organizations` · PUT `/platform/organizations/{id}/status` | administrateur de plateforme | Métadonnées et suspension (motif obligatoire, journalisé) |
