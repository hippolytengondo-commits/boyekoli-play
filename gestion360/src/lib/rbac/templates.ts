import { ALL_PERMISSIONS, type PermissionKey } from "./permissions";

export interface RoleTemplate {
  key: string;
  name: string;
  description: string;
  permissions: PermissionKey[];
  locked?: boolean;
}

const READ: PermissionKey[] = ["dashboard.read", "departments.read", "employees.read"];

/** Rôles types créés pour chaque nouvelle entreprise. Les permissions restent modifiables (sauf rôle verrouillé). */
export const ROLE_TEMPLATES: RoleTemplate[] = [
  { key: "directeur_general", name: "Directeur général", description: "Vue globale et toutes les permissions. Rôle verrouillé.", permissions: ALL_PERMISSIONS, locked: true },
  { key: "daf", name: "Directeur administratif et financier", description: "Administration et finances.", permissions: [...READ, "org.settings.read", "audit.read", "members.read", "roles.read"] },
  { key: "chef_departement", name: "Chef de département", description: "Supervise son service.", permissions: [...READ] },
  { key: "responsable_rh", name: "Responsable RH", description: "Personnel et organisation.", permissions: [...READ, "departments.manage", "employees.manage", "members.read", "members.invite"] },
  { key: "comptable", name: "Comptable", description: "Comptabilité.", permissions: ["dashboard.read"] },
  { key: "juriste", name: "Juriste", description: "Juridique.", permissions: ["dashboard.read"] },
  { key: "responsable_commercial", name: "Responsable commercial", description: "Ventes.", permissions: ["dashboard.read"] },
  { key: "gestionnaire_stock", name: "Gestionnaire de stock", description: "Stocks.", permissions: ["dashboard.read"] },
  { key: "responsable_informatique", name: "Responsable informatique", description: "Systèmes d'information.", permissions: ["dashboard.read", "members.read", "roles.read"] },
  { key: "auditeur", name: "Auditeur", description: "Lecture seule et audit.", permissions: [...READ, "audit.read", "members.read", "roles.read", "org.settings.read"] },
  { key: "agent_administratif", name: "Agent administratif", description: "Tâches administratives.", permissions: ["departments.read", "employees.read"] },
  { key: "employe", name: "Employé", description: "Espace personnel (modules RH en phase 3).", permissions: [] },
  { key: "consultant_externe", name: "Consultant externe", description: "Accès restreint.", permissions: [] },
  { key: "prestataire", name: "Prestataire", description: "Accès restreint.", permissions: [] },
  { key: "observateur", name: "Observateur", description: "Lecture seule du tableau de bord.", permissions: ["dashboard.read"] },
];
export const OWNER_ROLE_KEY = "directeur_general";
