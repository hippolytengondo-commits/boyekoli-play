# Installation, administration, déploiement, sauvegarde

## Prérequis
Node.js ≥ 22, PostgreSQL ≥ 15 (testé en 16).

## Installation (développement)
```bash
cd gestion360
npm install
cp .env.example .env          # puis adapter les mots de passe
```
Créer la base et le rôle propriétaire (une fois, en superutilisateur PostgreSQL) :
```bash
psql -c "CREATE ROLE g360 LOGIN PASSWORD '…'" -c "CREATE DATABASE gestion360 OWNER g360"
```
Puis :
```bash
npm run db:setup              # crée le rôle applicatif g360_app (non propriétaire, sans BYPASSRLS)
npm run db:migrate            # applique les migrations (connexion DIRECT_URL)
npm run build && npm start
```
Administrateur de plateforme (connexion propriétaire) :
```bash
PLATFORM_ADMIN_EMAIL=admin@exemple.cd PLATFORM_ADMIN_PASSWORD='…12+ caractères…' npm run admin:create
```
Ordre important : `db:setup` **avant** `db:migrate` (la migration accorde les droits à `g360_app` s'il existe).

## Variables d'environnement
Voir `.env.example`. `DATABASE_URL` doit pointer le rôle **non propriétaire** : avec un superutilisateur, la RLS serait contournée.
Les secrets ne sont jamais exposés au frontend (aucune variable `NEXT_PUBLIC_*`).

## Déploiement (production)
- HTTPS obligatoire (cookie `Secure`, HSTS). `APP_URL` = URL publique exacte (contrôle d'origine CSRF).
- Derrière un proxy : transmettre `X-Forwarded-For` (limitation par IP) et ne pas l'accepter directement depuis Internet.
- Remplacer `MAIL_TRANSPORT=console` par un transport SMTP **testé** avant d'ouvrir les inscriptions (non fourni en phase 1).
- Environnements dev/test/prod : un fichier `.env` par environnement, bases séparées. Intégration continue : `npm run check` (après `npm run test:db:prepare`).

## Sauvegarde et restauration
```bash
pg_dump -Fc -h HOST -U g360 gestion360 > gestion360-$(date +%F).dump
pg_restore -h HOST -U g360 -d gestion360_restore --clean --if-exists gestion360-AAAA-MM-JJ.dump
```
Tester régulièrement la restauration sur une base vide ; chiffrer et externaliser les sauvegardes. Les sauvegardes planifiées et la politique de conservation seront outillées en phase 9 ; aucune n'est configurée par ce dépôt.

## Guide d'administration (Phase 1)
- Créer l'entreprise : page d'inscription (le créateur devient Directeur général).
- Inviter : *Utilisateurs → Inviter* (rôles + département/poste); lien valable 7 jours, usage unique.
- Rôles : *Rôles et permissions*; le dernier Directeur général est protégé.
- Suspendre une entreprise : administrateur plateforme, *Administration plateforme* (motif obligatoire, audité).
