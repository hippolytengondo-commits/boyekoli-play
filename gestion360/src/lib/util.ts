import { z } from "zod";

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "entreprise";

export const emailSchema = z.string().trim().toLowerCase().email("Adresse e-mail invalide.").max(254);
export const passwordSchema = z
  .string()
  .min(10, "Le mot de passe doit contenir au moins 10 caractères.")
  .max(200)
  .regex(/[A-Za-z]/, "Le mot de passe doit contenir au moins une lettre.")
  .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.");

export const pageSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export interface Page<T> { items: T[]; total: number; page: number; pageSize: number }
export const paginate = (page: number, pageSize: number) => ({ skip: (page - 1) * pageSize, take: pageSize });
