// Test de bout en bout (Chromium) contre une instance en marche. Prérequis : `npm run build && npm start`,
// et le journal serveur dans $SERVER_LOG (les e-mails du transport "console" y sont écrits).
// Usage : SERVER_LOG=/tmp/server.log SHOTS=/tmp/shots node scripts/e2e-smoke.mjs
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const LOG = process.env.SERVER_LOG;
const SHOTS = process.env.SHOTS ?? "e2e-shots";
mkdirSync(SHOTS, { recursive: true });
const stamp = Date.now();
const ok = (c, m) => { if (!c) throw new Error("ÉCHEC : " + m); console.log("  ✓", m); };
const link = (re) => { const m = readFileSync(LOG, "utf8").match(re); return m?.[m.length - 1]; };

const browser = await chromium.launch();
const ctxA = await browser.newContext({ viewport: { width: 1360, height: 860 }, deviceScaleFactor: 1 });
const a = await ctxA.newPage();
const errors = [];
a.on("pageerror", (e) => errors.push(e.message));
a.on("console", (m) => m.type() === "error" && !m.text().includes("Failed to load resource") && errors.push(m.text()));

console.log("Inscription d'une entreprise");
await a.goto(BASE + "/inscription");
await a.fill('[name=organizationName]', `Kasai Construction ${stamp}`);
await a.selectOption('[name=sector]', "BTP");
await a.fill('[name=name]', "Jean Mukendi");
await a.fill('[name=email]', `dg${stamp}@kasai.cd`);
await a.fill('[name=password]', "MotDePasse2026!");
await a.screenshot({ path: `${SHOTS}/1-inscription.png` });
await a.click("button:has-text('Créer mon entreprise')");
await a.waitForURL("**/tableau-de-bord");
ok(await a.locator("text=Tableau de bord").first().isVisible(), "redirigé vers le tableau de bord");
ok(await a.locator("text=Pour démarrer").isVisible(), "assistant de démarrage affiché (données réelles, entreprise vide)");

console.log("Départements");
await a.click("a:has-text('Départements')");
await a.fill('[name=name]', "Chantiers");
await a.fill('[name=code]', "chn");
await a.click("button:has-text('Créer'):not(:has-text('compte'))");
await a.waitForSelector("td:has-text('CHN')");
ok(true, "département CHN créé et listé");
await a.fill('input[name=name]', "Chantiers"); await a.fill('input[name=code]', "CHN");
await a.click("form:has(h2:has-text('Nouveau département')) button");
await a.waitForSelector("text=existe déjà");
ok(true, "doublon de code refusé avec message clair");

console.log("Employés");
await a.click("a:has-text('Employés')");
await a.fill("form:has(h2:has-text('Nouvel employé')) [name=firstName]", "Paul");
await a.fill("form:has(h2:has-text('Nouvel employé')) [name=lastName]", "Ilunga");
await a.selectOption("form:has(h2:has-text('Nouvel employé')) [name=departmentId]", { label: "Chantiers" });
await a.click("button:has-text('Enregistrer')");
await a.waitForSelector("td:has-text('ILUNGA Paul')");
ok(true, "employé créé avec matricule " + (await a.locator("tr:has-text('ILUNGA') td").first().innerText()));

console.log("Invitation");
await a.click("a:has-text('Utilisateurs')");
const invEmail = `chef${stamp}@kasai.cd`;
await a.fill("form:has(h2:has-text('Inviter')) [name=email]", invEmail);
await a.check("label:has-text('Chef de département') input");
await a.click("button:has-text(\"Envoyer l'invitation\")");
await a.waitForSelector("text=Invitation envoyée");
ok(true, "invitation envoyée");
await a.waitForTimeout(500);
const url = link(/(http[^\s]*\/invitation\/[A-Za-z0-9_-]+)/g);
ok(!!url, "lien d'invitation présent dans l'e-mail console");

console.log("Acceptation (second navigateur isolé)");
const ctxB = await browser.newContext({ viewport: { width: 1360, height: 860 } });
const b = await ctxB.newPage();
await b.goto(url);
await b.fill('[name=name]', "Marie Kabila");
await b.fill('[name=password]', "MotDePasse2026!");
await b.click("button:has-text(\"Accepter l'invitation\")");
await b.waitForURL("**/tableau-de-bord");
ok(await b.locator("a:has-text('Départements')").isVisible(), "le chef de département voit Départements");
ok(!(await b.locator("a:has-text('Utilisateurs')").isVisible()), "…mais pas Utilisateurs (permission members.read absente)");
ok(!(await b.locator("a:has-text('Rôles')").isVisible()), "…ni Rôles ni Paramètres");
await b.goto(BASE + "/utilisateurs");
await b.waitForURL("**/tableau-de-bord");
ok(true, "accès direct à /utilisateurs redirigé (contrôle côté serveur)");
const r = await b.evaluate(async () => (await fetch("/api/v1/members")).status);
ok(r === 403, "API /members → 403 pour ce compte");
await b.screenshot({ path: `${SHOTS}/5-chef-departement.png` });

console.log("Tableau de bord du DG");
await a.click("a:has-text('Tableau de bord')");
await a.waitForSelector("text=Effectifs par département");
await a.screenshot({ path: `${SHOTS}/2-dashboard.png`, fullPage: true });
for (const [name, file] of [["Départements", "3-departements"], ["Utilisateurs", "4-utilisateurs"], ["Rôles et permissions", "6-roles"], ["Journal d'audit", "7-audit"], ["Paramètres", "8-parametres"]]) {
  await a.click(`nav a:has-text("${name}")`);
  await a.waitForTimeout(600);
  await a.screenshot({ path: `${SHOTS}/${file}.png`, fullPage: true });
}

console.log("Isolation entre entreprises (navigateur)");
const ctxC = await browser.newContext();
const c = await ctxC.newPage();
await c.goto(BASE + "/inscription");
await c.fill('[name=organizationName]', `Autre Société ${stamp}`);
await c.fill('[name=name]', "Autre Directeur");
await c.fill('[name=email]', `autre${stamp}@autre.cd`);
await c.fill('[name=password]', "MotDePasse2026!");
await c.click("button:has-text('Créer mon entreprise')");
await c.waitForURL("**/tableau-de-bord");
await c.click("a:has-text('Employés')");
await c.waitForSelector("text=Nouvel employé");
ok((await c.locator("td:has-text('ILUNGA')").count()) === 0, "l'autre entreprise ne voit pas les employés de Kasai");
await c.click("a:has-text('Départements')");
await c.waitForSelector("text=Nouveau département");
ok((await c.locator("td:has-text('CHN')").count()) === 0, "…ni ses départements");

console.log("Mobile");
const m = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
const mp = await m.newPage();
await mp.goto(BASE + "/connexion");
await mp.fill('[name=email]', `dg${stamp}@kasai.cd`); await mp.fill('[name=password]', "MotDePasse2026!");
await mp.click("button:has-text('Se connecter')");
await mp.waitForURL("**/tableau-de-bord");
ok(await mp.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), "pas de défilement horizontal sur mobile");
await mp.screenshot({ path: `${SHOTS}/9-mobile.png` });

ok(errors.length === 0, "aucune erreur JavaScript en console" + (errors.length ? " : " + errors.join(" | ") : ""));
await browser.close();
console.log("\nE2E : tout est réussi.");
