import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import * as registerM from "@/app/api/v1/auth/register/route";
import * as loginRouteM from "@/app/api/v1/auth/login/route";
import * as logoutM from "@/app/api/v1/auth/logout/route";
import * as departmentsM from "@/app/api/v1/departments/route";
import * as employeesM from "@/app/api/v1/employees/route";
import * as employeeByIdM from "@/app/api/v1/employees/[id]/route";
import * as meM from "@/app/api/v1/me/route";
import * as platformM from "@/app/api/v1/platform/organizations/route";
import { PASSWORD, uniq } from "./helpers";

type Handler = (r: NextRequest, c?: { params: Promise<Record<string, string>> }) => Promise<Response>;
const W = (m: object) => Object.fromEntries(Object.entries(m).map(([k, f]) => [k, (r: NextRequest, c = { params: Promise.resolve({}) }) => (f as (r: NextRequest, c: unknown) => Promise<Response>)(r, c)])) as Record<"GET" | "POST" | "PUT" | "PATCH" | "DELETE", Handler>;
const register = W(registerM);
const loginRoute = W(loginRouteM);
const logout = W(logoutM);
const departments = W(departmentsM);
const employees = W(employeesM);
const employeeById = W(employeeByIdM);
const me = W(meM);
const platform = W(platformM);


const ORIGIN = "http://localhost:3000";
function req(path: string, method = "GET", body?: unknown, cookie?: string, headers: Record<string, string> = {}) {
  return new NextRequest(`${ORIGIN}${path}`, {
    method,
    headers: { origin: ORIGIN, "content-type": "application/json", host: "localhost:3000", ...(cookie ? { cookie } : {}), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
const cookieOf = (res: Response) => res.headers.get("set-cookie")!.split(";")[0];
async function signup(name = "Entreprise API") {
  const res = await register.POST(req("/api/v1/auth/register", "POST", { organizationName: name, sector: "COMMERCE", name: "Pierre Tshisekedi", email: uniq("api"), password: PASSWORD }, undefined, { "x-forwarded-for": "5.5." + Math.floor(Math.random() * 250) + ".1" }));
  expect(res.status).toBe(201);
  return { cookie: cookieOf(res), body: await res.json() };
}

describe("API HTTP (/api/v1)", () => {
  it("refuse les requêtes non authentifiées (401) et pose un cookie HttpOnly à l'inscription", async () => {
    expect((await departments.GET(req("/api/v1/departments"))).status).toBe(401);
    const res = await register.POST(req("/api/v1/auth/register", "POST", { organizationName: "Cookie SARL", sector: "SERVICES", name: "A Bc", email: uniq("ck"), password: PASSWORD }, undefined, { "x-forwarded-for": "6.6.6.6" }));
    const sc = res.headers.get("set-cookie")!;
    expect(sc).toMatch(/g360_session=/);
    expect(sc.toLowerCase()).toContain("httponly");
    expect(sc.toLowerCase()).toContain("samesite=lax");
  });

  it("protection CSRF : origine étrangère ou absente refusée", async () => {
    const { cookie } = await signup();
    expect((await departments.POST(req("/api/v1/departments", "POST", { name: "Ops", code: "OPS" }, cookie, { origin: "https://evil.example" }))).status).toBe(403);
    const noOrigin = new NextRequest(`${ORIGIN}/api/v1/departments`, { method: "POST", headers: { cookie, "content-type": "application/json" }, body: JSON.stringify({ name: "Ops", code: "OPS" }) });
    expect((await departments.POST(noOrigin)).status).toBe(403);
    expect((await departments.POST(req("/api/v1/departments", "POST", { name: "Ops", code: "OPS" }, cookie, { "content-type": "text/plain" }))).status).toBe(415);
  });

  it("valide les entrées (422) et traite les erreurs de façon centralisée", async () => {
    const { cookie } = await signup();
    const bad = await departments.POST(req("/api/v1/departments", "POST", { name: "x", code: "!!" }, cookie));
    expect(bad.status).toBe(422);
    expect((await bad.json()).error.code).toBe("VALIDATION");
    const ok = await departments.POST(req("/api/v1/departments", "POST", { name: "Opérations", code: "ops" }, cookie));
    expect(ok.status).toBe(201);
    expect((await departments.POST(req("/api/v1/departments", "POST", { name: "Opérations bis", code: "OPS" }, cookie))).status).toBe(409);
  });

  it("n'accorde aucune confiance à un identifiant d'entreprise envoyé par le client", async () => {
    const a = await signup("Entreprise A");
    const b = await signup("Entreprise B");
    const empA = await (await employees.POST(req("/api/v1/employees", "POST", { firstName: "Secret", lastName: "DeA" }, a.cookie))).json();
    // En-tête, paramètre de requête et corps portant l'identifiant de A : ignorés.
    const list = await employees.GET(req(`/api/v1/employees?organizationId=${a.body.organizationId}`, "GET", undefined, b.cookie, { "x-organization-id": a.body.organizationId }));
    const names = (await list.json()).items.map((e: { lastName: string }) => e.lastName);
    expect(names).not.toContain("DeA");
    const forged = await employees.POST(req("/api/v1/employees", "POST", { firstName: "I", lastName: "Intrus", organizationId: a.body.organizationId }, b.cookie));
    expect(forged.status).toBe(201);
    const mine = await (await employees.GET(req("/api/v1/employees", "GET", undefined, a.cookie))).json();
    expect(mine.items.map((e: { lastName: string }) => e.lastName)).not.toContain("Intrus");
    const direct = await employeeById.GET(req(`/api/v1/employees/${empA.id}`, "GET", undefined, b.cookie), { params: Promise.resolve({ id: empA.id }) });
    expect(direct.status).toBe(404);
  });

  it("les routes de plateforme sont interdites aux comptes ordinaires", async () => {
    const { cookie } = await signup();
    expect((await platform.GET(req("/api/v1/platform/organizations", "GET", undefined, cookie))).status).toBe(403);
  });

  it("connexion puis déconnexion : la session est révoquée côté serveur", async () => {
    const email = uniq("lo");
    await register.POST(req("/api/v1/auth/register", "POST", { organizationName: "Logout SA", sector: "SERVICES", name: "L O", email, password: PASSWORD }, undefined, { "x-forwarded-for": "7.7.1.1" }));
    const res = await loginRoute.POST(req("/api/v1/auth/login", "POST", { email, password: PASSWORD }, undefined, { "x-forwarded-for": "7.7.1.2" }));
    const cookie = cookieOf(res);
    const whoami = await (await me.GET(req("/api/v1/me", "GET", undefined, cookie))).json();
    expect(whoami.user.email).toBe(email);
    expect(whoami.permissions).toContain("roles.manage");
    await logout.POST(req("/api/v1/auth/logout", "POST", undefined, cookie, { "content-length": "0" }));
    expect((await me.GET(req("/api/v1/me", "GET", undefined, cookie))).status).toBe(401);
  });
});
