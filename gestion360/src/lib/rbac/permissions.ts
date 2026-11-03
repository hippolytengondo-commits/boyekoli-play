/** Catalogue des permissions (source de vérité). Synchronisé en base par syncPermissionCatalog(). */
export const PERMISSIONS = {
  "dashboard.read": { module: "dashboard", description: "Consulter le tableau de bord de l'entreprise" },
  "org.settings.read": { module: "organisation", description: "Consulter les paramètres de l'entreprise" },
  "org.settings.manage": { module: "organisation", description: "Modifier les paramètres de l'entreprise" },
  "departments.read": { module: "organisation", description: "Consulter les départements et postes" },
  "departments.manage": { module: "organisation", description: "Créer, modifier, supprimer départements et postes" },
  "employees.read": { module: "organisation", description: "Consulter les employés" },
  "employees.manage": { module: "organisation", description: "Créer et modifier les employés" },
  "members.read": { module: "utilisateurs", description: "Consulter les utilisateurs et invitations" },
  "members.invite": { module: "utilisateurs", description: "Inviter des utilisateurs" },
  "members.manage": { module: "utilisateurs", description: "Modifier les rôles, suspendre ou réactiver des utilisateurs" },
  "roles.read": { module: "utilisateurs", description: "Consulter les rôles et permissions" },
  "roles.manage": { module: "utilisateurs", description: "Créer et modifier les rôles" },
  "audit.read": { module: "audit", description: "Consulter le journal d'audit" },
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export const ALL_PERMISSIONS = Object.keys(PERMISSIONS) as PermissionKey[];
export const isPermissionKey = (k: string): k is PermissionKey => k in PERMISSIONS;
