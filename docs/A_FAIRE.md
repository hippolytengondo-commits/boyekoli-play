# À faire : liste de reprise (mise à jour du 31/10/2026)

Au début de la prochaine session : relire ce fichier et rappeler la liste à l'utilisateur, en français, avec un ton très professionnel.

## 1. Sécuriser le code et héberger ailleurs (décision attendue)
- Choix attendu : **Cloudflare Pages** ou **Netlify** (hébergement gratuit compatible avec un dépôt privé).
- Préparer le dossier de publication du jeu (script `npm run site` : index.html, style.css, manifest, sw.js, dist, img, icons).
- Étapes à guider : créer le compte d'hébergement, le relier au dépôt, vérifier le jeu, **rendre le dépôt privé** (GitHub, Settings, Danger Zone), puis changer l'adresse dans Supabase (Authentication, URL Configuration : Site URL et Redirect URLs).
- Prévenir les 4 ou 5 testeurs de la nouvelle adresse. Acheter un nom de domaine plus tard.
- Note : l'adresse GitHub Pages actuelle s'arrêtera dès que le dépôt sera privé (voulu).

## 2. Données et comptes
- Double authentification (GitHub, Supabase, Brevo, messagerie, registrar du domaine).
- Sauvegardes de la base avant le lancement public ; copie complète du code hors GitHub.
- Avant le lancement public : réactiver la confirmation des e-mails, ajouter un captcha, refaire un contrôle de sécurité de la base.

## 3. Création de la société (SARLU, apports en nature)
- Obtenir l'accès au code de la seconde application (Exotech RDC) pour l'évaluer comme BOYEKOLI PLAY (aucun dépôt visible dans cette session pour l'instant).
- Réunir les justificatifs des dépenses réelles de création des applications.
- Notes d'évaluation déjà produites (fichiers Word fournis à l'utilisateur, non enregistrés dans le dépôt par confidentialité) : valeur centrale de BOYEKOLI PLAY proposée autour de 20 500 $ (fourchette 15 400 à 24 600 $), selon les salaires locaux.
- À faire valider par le notaire : forme, contrôle des apports (commissaire aux apports), capital minimum, fiscalité, responsabilité en cas de surévaluation.
- Documents de cession de droits, dépôt daté du code, marque, transfert des accès à la société.
- Réflexion : SARLU pour les investisseurs, association ou fondation pour les subventions.

## 4. Financement
- Budget estimé (phase 1 pilote d'environ 200 000 $, phase 2 d'environ 437 000 $), à confirmer par devis locaux ; lettre type pour l'UNICEF produite.
- Prendre contact avec le bureau de l'UNICEF à Kinshasa (section Éducation) ; s'enregistrer sur le portail des partenaires si la structure le permet.

## 5. Développement de BOYEKOLI PLAY
- **Étape 1 de l'enrichissement réalisée (01/11/2026)** : collections et badges, surprise du jour, événement du jour (contenus dans `src/contenu/`). Prochaine étape : supermarché puis musée du Congo (`docs/FEUILLE_DE_ROUTE_ENRICHISSEMENT.md`).
- Hébergement : l'utilisateur n'a pas pu faire la connexion Cloudflare Pages le 01/11 (le projet est prêt : `npm run site`, branche de production `claude/new-session-h3plsh`). À reprendre quand il est disponible.
- Test de bout en bout avec de vrais comptes : évaluations, classes, erreurs, communiqués avec fichier, rappel de communiqué non lu.
- Vérifier sur téléphone : conduite avec volant, pédales, klaxon, carburant, stations-service, réponses d'auto-école.
- Test d'envoi d'e-mails (Brevo).
- Plus tard : 500 missions d'exploration, page « Nos partenaires », application Android native, extension de la cité (étapes 2 à 4).
