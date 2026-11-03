import { describe, expect, it } from "vitest";
import { authenticate } from "@/lib/auth";
import { acceptInvitation, previewInvitation, login } from "@/modules/auth/service";
import { createDepartment } from "@/modules/departments/service";
import { createEmployee, listEmployees } from "@/modules/employees/service";
import { changeMemberRoles, inviteMember, listInvitations, listMembers, revokeInvitation, setMemberStatus } from "@/modules/members/service";
import { createRole, deleteRole, listRoles, updateRole } from "@/modules/rbac/service";
import { PASSWORD, lastLink, newOrg, uniq } from "./helpers";

async function invite(owner: Awaited<ReturnType<typeof newOrg>>, roleKey: string, extra: Record<string, unknown> = {}) {
  const roles = await listRoles(owner.ctx);
  const email = uniq("emp");
  await inviteMember(owner.ctx, { email, roleIds: [roles.find((r) => r.key === roleKey)!.id], ...extra });
  const token = lastLink(email, "/invitation/");
  const s = await acceptInvitation(token, { name: "Marie Kabila", password: PASSWORD }, { ip: "9.9.9.9" });
  return { email, token, ctx: (await authenticate(s.token))!, userId: s.userId };
}

describe("Invitations, rôles et permissions (scénarios 3 à 5)", () => {
  it("invite un employé, crée son compte, son dossier employé et ses rôles", async () => {
    const o = await newOrg();
    const dept = await createDepartment(o.ctx, { name: "Ressources humaines", code: "RH" });
    const m = await invite(o, "chef_departement", { departmentId: dept.id });
    expect(m.ctx.organizationId).toBe(o.organizationId);
    expect(m.ctx.permissions.has("employees.read")).toBe(true);
    expect(m.ctx.permissions.has("employees.manage")).toBe(false);
    const emps = (await listEmployees(o.ctx, { page: 1, pageSize: 20 })).items as { firstName: string; department: { name: string } | null }[];
    expect(emps.find((e) => e.firstName === "Marie")?.department?.name).toBe("Ressources humaines");
    expect(await listInvitations(o.ctx)).toHaveLength(0);
  });

  it("le jeton d'invitation est à usage unique et révocable", async () => {
    const o = await newOrg();
    const m = await invite(o, "observateur");
    await expect(acceptInvitation(m.token, { password: PASSWORD }, {})).rejects.toMatchObject({ status: 404 });
    const roles = await listRoles(o.ctx);
    const email = uniq("rev");
    const { id } = await inviteMember(o.ctx, { email, roleIds: [roles[0].id] });
    await revokeInvitation(o.ctx, id);
    await expect(previewInvitation(lastLink(email, "/invitation/"))).rejects.toMatchObject({ status: 404 });
  });

  it("un utilisateur sans permission est refusé côté serveur (403)", async () => {
    const o = await newOrg();
    const e = await invite(o, "employe");
    await expect(createDepartment(e.ctx, { name: "Pirate", code: "PIR" })).rejects.toMatchObject({ status: 403 });
    await expect(createEmployee(e.ctx, { firstName: "A", lastName: "B" })).rejects.toMatchObject({ status: 403 });
    await expect(listMembers(e.ctx)).rejects.toMatchObject({ status: 403 });
  });

  it("anti-escalade : on ne peut pas attribuer plus de permissions que l'on en possède", async () => {
    const o = await newOrg();
    const rh = await invite(o, "responsable_rh");
    const roles = await listRoles(o.ctx);
    const dg = roles.find((r) => r.key === "directeur_general")!;
    const daf = roles.find((r) => r.key === "daf")!;
    // RH peut inviter (members.invite) mais pas donner un rôle plus puissant.
    await expect(inviteMember(rh.ctx, { email: uniq("x"), roleIds: [dg.id] })).rejects.toMatchObject({ status: 403 });
    await expect(inviteMember(rh.ctx, { email: uniq("x"), roleIds: [daf.id] })).rejects.toMatchObject({ status: 403 });
    // RH n'a pas members.manage ni roles.manage.
    const mems = await listMembers(rh.ctx);
    await expect(changeMemberRoles(rh.ctx, mems[0].id, { roleIds: [dg.id] })).rejects.toMatchObject({ status: 403 });
    await expect(createRole(rh.ctx, { name: "Admin bis", permissions: ["roles.manage"] })).rejects.toMatchObject({ status: 403 });
  });

  it("un gestionnaire de rôles ne peut pas s'octroyer des permissions qu'il n'a pas", async () => {
    const o = await newOrg();
    const roles = await listRoles(o.ctx);
    const custom = await createRole(o.ctx, { name: "Gestion des rôles", permissions: ["roles.read", "roles.manage", "members.read", "members.manage"] });
    const user = await invite(o, "observateur");
    const mem = (await listMembers(o.ctx)).find((m) => m.userId === user.userId)!;
    await changeMemberRoles(o.ctx, mem.id, { roleIds: [custom.id] });
    const mgr = (await authenticate((await login({ email: user.email, password: PASSWORD }, { ip: "8.8.8.8" })).token))!;
    await expect(updateRole(mgr, custom.id, { permissions: ["roles.manage", "audit.read"] })).rejects.toMatchObject({ status: 403 });
    await expect(createRole(mgr, { name: "Super", permissions: ["org.settings.manage"] })).rejects.toMatchObject({ status: 403 });
    const dg = roles.find((r) => r.key === "directeur_general")!;
    await expect(changeMemberRoles(mgr, mem.id, { roleIds: [dg.id] })).rejects.toMatchObject({ status: 403 });
  });

  it("protège le dernier Directeur général et le rôle verrouillé", async () => {
    const o = await newOrg();
    const roles = await listRoles(o.ctx);
    const dg = roles.find((r) => r.key === "directeur_general")!;
    const emp = roles.find((r) => r.key === "employe")!;
    const me = (await listMembers(o.ctx))[0];
    await expect(changeMemberRoles(o.ctx, me.id, { roleIds: [emp.id] })).rejects.toMatchObject({ status: 409 });
    await expect(setMemberStatus(o.ctx, me.id, { status: "SUSPENDED" })).rejects.toMatchObject({ status: 403 }); // pas soi-même
    await expect(updateRole(o.ctx, dg.id, { permissions: [] })).rejects.toMatchObject({ status: 403 });
    await expect(deleteRole(o.ctx, dg.id)).rejects.toMatchObject({ status: 403 });
  });

  it("un utilisateur suspendu perd immédiatement l'accès", async () => {
    const o = await newOrg();
    const e = await invite(o, "observateur");
    const mem = (await listMembers(o.ctx)).find((m) => m.userId === e.userId)!;
    await setMemberStatus(o.ctx, mem.id, { status: "SUSPENDED" });
    expect((await authenticate(e.token ? (await login({ email: e.email, password: PASSWORD }, { ip: "7.7.7.7" })).token : ""))?.organizationId).toBeNull();
    await setMemberStatus(o.ctx, mem.id, { status: "ACTIVE" });
  });

  it("rôles personnalisés : création, modification, suppression, permissions inconnues refusées", async () => {
    const o = await newOrg();
    await expect(createRole(o.ctx, { name: "Faux", permissions: ["inexistante.perm"] })).rejects.toMatchObject({ status: 400 });
    const r = await createRole(o.ctx, { name: "Lecteur dépts", permissions: ["departments.read"] });
    await updateRole(o.ctx, r.id, { permissions: ["departments.read", "employees.read"] });
    expect((await listRoles(o.ctx)).find((x) => x.id === r.id)!.permissions.sort()).toEqual(["departments.read", "employees.read"]);
    await deleteRole(o.ctx, r.id);
    const user = await invite(o, "observateur");
    const obs = (await listRoles(o.ctx)).find((x) => x.key === "observateur")!;
    await expect(deleteRole(o.ctx, obs.id)).rejects.toMatchObject({ status: 403 });
    void user;
  });
});
