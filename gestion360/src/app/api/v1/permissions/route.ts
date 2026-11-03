import { api } from "@/lib/http";
import { permissionCatalog } from "@/modules/rbac/service";

export const GET = api({}, async () => permissionCatalog());
