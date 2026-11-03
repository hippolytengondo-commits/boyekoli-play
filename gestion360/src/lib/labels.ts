const ACTIONS: Record<string, string> = {
  "organization.create": "Entreprise créée", "organization.update": "Paramètres de l'entreprise modifiés",
  "auth.login": "Connexion", "auth.login_failed": "Échec de connexion", "auth.password_reset": "Mot de passe réinitialisé",
  "department.create": "Département créé", "department.update": "Département modifié", "department.delete": "Département supprimé", "position.create": "Poste créé",
  "employee.create": "Employé créé", "employee.update": "Employé modifié",
  "role.create": "Rôle créé", "role.update": "Rôle modifié", "role.delete": "Rôle supprimé",
  "member.roles_change": "Rôles d'un utilisateur modifiés", "member.suspend": "Utilisateur suspendu", "member.reactivate": "Utilisateur réactivé",
  "invitation.create": "Invitation envoyée", "invitation.accept": "Invitation acceptée", "invitation.revoke": "Invitation révoquée",
  "platform.org_suspend": "Entreprise suspendue par la plateforme", "platform.org_reactivate": "Entreprise réactivée par la plateforme",
};
export const actionLabel = (a: string) => ACTIONS[a] ?? a;
export const STATUS_LABEL: Record<string, string> = { ACTIVE: "Actif", ON_LEAVE: "En congé", TERMINATED: "Sorti", SUSPENDED: "Suspendu" };
export const SECTOR_LABEL: Record<string, string> = { COMMERCE: "Commerce", INDUSTRIE: "Industrie", BTP: "Construction et BTP", SANTE: "Santé", EDUCATION: "Éducation", TRANSPORT: "Transport", AGRICULTURE: "Agriculture", TECHNOLOGIE: "Technologie", SERVICES: "Services", ONG: "ONG", HOTELLERIE: "Hôtellerie", INSTITUTION: "Institutions" };
