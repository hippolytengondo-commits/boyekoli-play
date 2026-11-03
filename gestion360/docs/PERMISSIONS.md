# Permissions et rôles (Phase 1)

| Permission | Effet |
|---|---|
| `dashboard.read` | Tableau de bord |
| `org.settings.read` / `.manage` | Paramètres de l'entreprise |
| `departments.read` / `.manage` | Départements et postes |
| `employees.read` / `.manage` | Employés |
| `members.read` / `.invite` / `.manage` | Utilisateurs, invitations, rôles et suspension |
| `roles.read` / `.manage` | Rôles et permissions |
| `audit.read` | Journal d'audit |

Rôles types (modifiables, sauf le premier) : Directeur général (verrouillé, tout), DAF, Chef de département, Responsable RH, Comptable, Juriste,
Responsable commercial, Gestionnaire de stock, Responsable informatique, Auditeur, Agent administratif, Employé, Consultant externe, Prestataire, Observateur.
Les permissions des modules métier (RH, finance, juridique…) seront ajoutées à chaque phase. Voir `src/lib/rbac/templates.ts` pour le détail par rôle.
