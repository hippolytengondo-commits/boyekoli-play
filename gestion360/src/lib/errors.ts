export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}
export const unauthorized = (m = "Authentification requise.") => new AppError("UNAUTHENTICATED", 401, m);
export const forbidden = (m = "Vous n'avez pas l'autorisation d'effectuer cette action.") => new AppError("FORBIDDEN", 403, m);
export const notFound = (m = "Ressource introuvable.") => new AppError("NOT_FOUND", 404, m);
export const conflict = (m: string) => new AppError("CONFLICT", 409, m);
export const badRequest = (m: string, details?: unknown) => new AppError("BAD_REQUEST", 400, m, details);
