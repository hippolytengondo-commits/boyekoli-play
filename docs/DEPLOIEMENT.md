# Déplacer le projet vers un dépôt privé et l'héberger sur Cloudflare Pages

Tout se fait depuis l'ordinateur, en une vingtaine de minutes. Aucune clé secrète n'est dans le code (l'adresse Supabase et la clé « publique » sont faites pour être visibles ; la sécurité est dans les règles de la base).

## 1. Récupérer tout le code (avec l'historique)
1. Installer Git (https://git-scm.com) et Node.js 20 (https://nodejs.org).
2. Ouvrir un terminal (PowerShell sur Windows) et taper :
   ```
   git clone --mirror https://github.com/hippolytengondo-commits/kelasi-game-.git boyekoli.git
   ```
   (le dossier `boyekoli.git` contient tout : fichiers, historique, branches). Pour travailler dessus ensuite : `git clone boyekoli.git boyekoli-play` puis `cd boyekoli-play` et `git checkout claude/new-session-h3plsh`.

## 2. Créer le dépôt PRIVÉ
1. Sur github.com : « New repository » → nom `boyekoli-play-prive` → coche **Private** → ne rien ajouter (ni README, ni licence) → Create.
2. Dans le terminal, depuis le dossier `boyekoli.git` :
   ```
   git push --mirror https://github.com/TON-COMPTE/boyekoli-play-prive.git
   ```
3. Vérifier sur GitHub que les fichiers sont là. L'ancien dépôt peut alors être passé en privé (Settings → Danger zone → Change visibility) ou supprimé.

## 3. Héberger sur Cloudflare Pages (gratuit)
1. https://dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → choisir `boyekoli-play-prive` (autoriser l'accès au dépôt privé).
2. Réglages de build :
   - Branche de production : `claude/new-session-h3plsh` (ou `main` après fusion)
   - Build command : `npm install && npm run site`
   - Build output directory : `site`
   - Variable d'environnement : `NODE_VERSION` = `20`
3. Save and Deploy. L'adresse ressemble à `https://boyekoli-play.pages.dev`. Ouvrir une fois avec Internet : le jeu se met en mémoire et fonctionne ensuite hors connexion.
4. Domaine personnalisé (facultatif) : Pages → Custom domains.
5. Le fichier `_headers` (déjà dans le projet) force la mise à jour de la page et du service worker.

## 4. Après le déplacement
- Supabase (comptes) : dans Authentication → URL Configuration, ajouter la nouvelle adresse `https://….pages.dev` comme « Site URL » et « Redirect URL », sinon les liens de confirmation d'e-mail pointeront vers l'ancienne adresse.
- Activer l'authentification à deux facteurs sur GitHub, Cloudflare et Supabase.
- Garder une copie de sauvegarde du dossier `boyekoli.git` (clé USB / disque externe).
- Les documents Word confidentiels (`docs/*.docx`) ne sont PAS dans Git : les copier à part.
