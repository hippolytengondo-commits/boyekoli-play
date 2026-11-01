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
- **Étape 3 réalisée (01/11/2026)** : trois aventures scénarisées (trésor congolais, sauvons la forêt, expédition au Virunga), menu « Aventures ». Prochaine : atelier de décoration, animaux de compagnie, mode et coiffure.
- **Protection de la progression (01/11/2026)** : copies de secours locales, bouton de restauration, envoi à la fermeture, plus de bouton « Effacer la sauvegarde ». À vérifier sur téléphone : coupure brutale (batterie), reprise de partie.
- **Étape 1 de l'enrichissement réalisée (01/11/2026)** : collections et badges, surprise du jour, événement du jour (contenus dans `src/contenu/`). 
- **Étape 2 réalisée (01/11/2026)** : supermarché (rayons, défi des courses avec budget) et musée virtuel du Congo (6 salles, passeport du musée), placés à l'entrée sud de la cité. Textes du musée et des collections à faire relire par un enseignant. Prochaine étape : missions scénarisées (trésor congolais, expédition au Virunga, sauvons la forêt) (`docs/FEUILLE_DE_ROUTE_ENRICHISSEMENT.md`).
- Hébergement : l'utilisateur n'a pas pu faire la connexion Cloudflare Pages le 01/11 (le projet est prêt : `npm run site`, branche de production `claude/new-session-h3plsh`). À reprendre quand il est disponible.
- Test de bout en bout avec de vrais comptes : évaluations, classes, erreurs, communiqués avec fichier, rappel de communiqué non lu.
- Vérifier sur téléphone : conduite avec volant, pédales, klaxon, carburant, stations-service, réponses d'auto-école.
- Test d'envoi d'e-mails (Brevo).
- Plus tard : 500 missions d'exploration, page « Nos partenaires », application Android native, extension de la cité (étapes 2 à 4).

## 6. Musée : photos libres encore à intégrer (01/11/2026)
Déjà en place : Lumumba, Yoane Wissa, Muyembe. Les autres tableaux affichent une illustration de secours tant que la photo manque.
Méthode : Wikimedia limite les téléchargements groupés (erreur 429). Envoyer chaque fichier un par un vers Cloudinary (`boyekoli/musee/<id>`, `w_480,c_limit,q_auto:good,f_jpg`), le télécharger dans `img/musee/<id>.jpg`, vérifier l'image, puis publier. Fichiers retenus (Wikimedia Commons, `https://upload.wikimedia.org/wikipedia/commons/…`) :
- kasavubu : 5/5d/Kasa-Vubu_in_Bandalungwa_cropped.jpg (domaine public)
- mobutu : f/f2/Mobutu_portraits_%281976-04-28%29%28Gerald_Ford_Library%29_%28cropped%29.jpg (domaine public)
- kabila : 5/59/Visit_of_Laurent_D%C3%A9sir%C3%A9_Kabila%2C_President_of_the_Democratic_Republic_of_Congo%2C_to_the_EC_%28cropped%29.jpg (CC BY 4.0)
- papawemba : 6/63/Papa_Wemba.jpg (CC BY 2.0, Radio Okapi)
- fally : 8/81/Fally_Ipupa_a_Paris%2C_en_France.jpg (CC BY-SA 4.0)
- mukwege : e/e1/Denis_Mukwege_par_Claude_Truong-Ngoc_novembre_2014.jpg (CC BY-SA 3.0)
- mausolee : 9/99/Kinshasa_-_Mausol%C3%A9e_de_Laurent_D%C3%A9sir%C3%A9_Kabila.jpg (CC BY-SA 4.0, Henri van der Noot)
- echangeur : 7/7d/%C3%89CHANGEUR_DE_LIMETE_%2856%29.jpg (CC BY-SA 4.0, Alphonse Masandi)
- palais : b/b8/Kinshasa_-_Palais_de_la_Nation_%28cropped%29.jpg (domaine public)
- gorille : b/be/Virunga_Mountain_Gorilla.jpg (CC BY-SA 3.0, Cai Tjeenk Willink)
- okapi : e/ee/Okapi_Ituri_in_Diergaarde_Blijdorp_geboren%2C_Bestanddeelnr_911-0336.jpg (CC0)
- bonobo : 2/27/Pan_paniscus_%28female%29.jpg (CC BY-SA 4.0, Hans Hillewaert)
- fleuve : 5/54/Congo_River_from_Kinshasa_in_Democratic_Republic_of_the_Congo_%28DRC%29.jpg (CC BY-SA 4.0, EdwinAlden.1995)
À rechercher : diamant, or, cuivre, cobalt, volcan des Virunga, Stade des Martyrs (une vraie vue du stade), masque kuba, statue nkisi, lukasa, likembe.
Pour chaque photo ajoutée : renseigner `credit` (auteur, licence, source) dans `src/contenu/musee.js` (la salle « Crédits des photos » les affiche).

Mise à jour (01/11/2026, soir) : les 13 photos ci-dessus sont maintenant référencées directement depuis Wikimedia Commons (vignettes de 500 px) dans `src/contenu/musee.js`, avec leurs crédits. Elles s'affichent dans le jeu si le téléphone peut joindre Wikimedia ; sinon un cadre « Photo à venir » apparaît. À vérifier sur un vrai téléphone. Pour une version autonome (sans dépendance), les copier dans `img/musee/` quand la limite de téléchargement (erreur 429) sera levée.
Rappel : ne pas contourner les restrictions réseau de la session (un essai via un service tiers a été refusé et n'a pas été poursuivi).
Reste à trouver : diamant, or, cuivre, cobalt, volcan des Virunga, Stade des Martyrs, masque kuba, statue nkisi, lukasa, likembe. L'utilisateur peut aussi envoyer lui-même des photos libres de droits.

Mise à jour (01/11/2026, nuit) : l'utilisateur a fourni quatre planches d'images (nature, arts, faune, minéraux). 19 vignettes ont été découpées et intégrées dans `img/musee/` (virunga, nyiragongo, zongo, fleuve, masque, statue, tambour, likembe, poterie, vannerie, tissus, danse, rumba, gorille, okapi, diamant, cuivre, or, mine). Le musée compte maintenant 8 niveaux (nouveau niveau « Faune et biodiversité »).
Écartés volontairement (à signaler à l'utilisateur) : paon (image d'un paon bleu indien, pas du paon congolais), cobalt (pierre bleue, qui ressemble à de l'azurite, pas au minerai de cobalt), bonobo et éléphant (identification incertaine). Ces images ont un aspect généré par IA : à confirmer avec l'utilisateur et, si c'est le cas, les présenter comme illustrations.

Mise à jour (02/11/2026) : réalisés — centre commercial (quincaillerie, bourse d'échange, boutiques, animalerie) à la place de l'ancien étal ; aventures libres avec effort de creusage, coffres qui s'ouvrent, célébration ; animaux de compagnie (adoption, nourriture avec les provisions du supermarché, l'animal suit le joueur).
Reste de la feuille de route : agence de détectives, laboratoire scientifique, hôpital fonctionnel, atelier de décoration, mode et coiffure, agriculture et élevage, boutique du joueur, ville intelligente, école de pilotage.
À vérifier sur téléphone : visibilité de l'animal qui suit le joueur, animation d'ouverture des coffres, prix du centre commercial.

## Pôle des métiers (livré le 01/11/2026)
- Accès : étage 3 du centre commercial (escalator depuis l'étage 2) ou bouton « Pôle des métiers » du menu.
- Dossiers de quiz (6 modules, 13 dossiers) : agence de détectives, laboratoire scientifique, centre hospitalier (éducatif), atelier de décoration, atelier mode et coiffure, ville intelligente, studio de musique et danse, école de pilotage (bases). Contenu dans `src/contenu/metiers.js`, 9 personnages-guides.
- Ferme : 4 parcelles (maïs, manioc, légumes ; arrosage qui accélère), poules et chèvres (œufs, lait), boutique avec rendu de monnaie.
- Limites connues : la décoration, la mode et la musique sont des quiz et non des éditeurs 3D ; à enrichir plus tard. Relecture des textes par un enseignant et, pour l'hôpital, par un professionnel de santé. Test sur téléphone du niveau 3 à faire.
