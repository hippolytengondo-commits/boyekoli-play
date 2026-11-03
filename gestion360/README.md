# GESTION360

Plateforme SaaS multi-entreprises de gestion intégrale (ERP) — promoteur : NGONDO SHAKO HIPPOLITE. Marché initial : RDC. Langue : français.

**État : Phase 1 — socle technique** (voir `TASKS.md`). Seuls les modules réellement implémentés apparaissent dans l'interface :
authentification, entreprises multi-tenant, rôles et permissions, départements/postes/employés, invitations, journal d'audit, tableau de bord, administration de la plateforme.

- Plan et architecture : `PROJECT_PLAN.md`, `docs/ARCHITECTURE.md`
- Installation / déploiement / sauvegarde : `docs/INSTALL.md`
- API : `docs/API.md` · Base de données : `docs/DATABASE.md` · Permissions : `docs/PERMISSIONS.md`
- Tests : `docs/TEST_REPORT.md`

```bash
npm install && cp .env.example .env   # voir docs/INSTALL.md
npm run db:setup && npm run db:migrate && npm run build && npm start
npm run check                          # typage + tests (base gestion360_test)
```

> Ce dossier est autonome : il vit dans le dépôt `Kelasi-game-` mais n'a aucun lien avec le jeu qui s'y trouve.
> Pour l'extraire vers un dépôt dédié : `git subtree split --prefix=gestion360 -b gestion360-only`.
