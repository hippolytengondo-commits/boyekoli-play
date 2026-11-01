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

## Simulateurs de métiers (01/11/2026)
- Aéroport dans le village (extrémité est) : terminal, tour, avions garés ; simulateur de vol (`src/avion.js`) ; studio de musique avec séquenceur ; salon de mode ; atelier de décoration ; profil de talents (`src/simulateurs.js`).
- À tester sur téléphone : boutons du simulateur de vol, son du studio, lisibilité du salon de mode et du plan de décoration. Les avions garés sont des modèles simples.
- Pistes d'évolution : plus d'instruments et de rythmes, plus de pièces de mode, meubles en 3D dans la maison.

## Mini-jeu de mode, animaux 3D, centre commercial (01/11/2026)
- Salon de mode refondu en jeu de carrière : 12 commandes de clients, 4 grades, calcul et quiz de coupe/couture avant chaque création, budget, pièces à débloquer, défilé noté (étoiles), entraînement quotidien (+2 pièces/jour max) et atelier libre. Données dans `src/contenu/modejeu.js`, logique dans `src/modejeu.js`.
- Animalerie : modèles 3D (chien, chat, lapin, perroquet) à la place des cubes ; ces modèles sont aussi ceux de l'animal qui suit le joueur.
- Centre commercial décalé vers le nord et auvent réduit, pour dégager la route. À vérifier sur téléphone.
- Pistes : davantage de pièces de mode, quiz de couture supplémentaires, relecture par un enseignant de coupe et couture.

## Aéroport et pilotage réalistes (01/11/2026)
- Aéroport déplacé à l'est du village (x≈130), relié par une route bitumée (à partir du bout de la rue), avec parking, panneaux, terminal, tour et deux avions garés. Les limites de la carte ont été étendues vers l'est (véhicules utilisables).
- Licence de pilote comme à l'auto-école : inscription (20 pièces) → théorie (2 quiz) → vol d'examen chronométré → brevet. Puis missions chronométrées (courrier, ville, province) et vol libre.
- Cockpit (`src/avion.js`) : procédure de départ (porte, ceinture, batterie, frein, démarreur maintenu), manche tactile, manette des gaz, palonniers, volets, freins, instruments (vitesse, altitude, cap, vario, horizon artificiel), vues cockpit/extérieure, son du moteur. Échec (temps écoulé, accident, sortie de piste) → retour à l'aéroport. On peut couper le moteur et quitter l'avion au parking.
- À tester sur téléphone : prise en main du manche, difficulté de l'atterrissage, durée des chronos (à ajuster dans `MISSIONS`), vue cockpit.
- Limites : le vol se joue dans une scène dédiée (piste et campagne) et non dans la grande carte de la ville ; modèle d'avion simple ; pas de météo.

## BOYEKOLI FLIGHT SIMULATOR (01/11/2026)
- Cockpit refondu (`src/avion.js`) : 9 leçons éducatives (cockpit, moteur, accélération, décollage, altitude, virages, Kinshasa, fleuve Congo, atterrissage), vol complet chronométré (examen du brevet), puis missions de carrière. Textes pédagogiques (ailes, moteur, portance, altitude, aéroport, contrôleurs) au début des leçons et en vol.
- Paysage RDC : Kinshasa (tours, stade, avenues), fleuve Congo, Brazzaville, collines et montagnes avec collisions ; 4 caméras ; pause ; carburant fictif ; mode tactile (joystick) et mode ordinateur (clavier, souris, molette) ; graphismes économiques.
- Choix techniques : le projet n'utilise ni React ni Rapier ; la physique simplifiée et les modèles 3D sont écrits en Three.js pur (pas de fichiers GLB).
- À tester sur téléphone : fluidité (activer « Graphismes économiques » en pause), prise en main, difficulté des leçons 5 à 9.

## BOYEKOLI MUSIC STUDIO (01/11/2026)
- Entrées : bouton du menu « 🎵 MUSIQUE – Découvre, joue et compose ! », pôle des métiers, et bâtiment coloré au bord de la route de l'aéroport (côté nord, vers x=80).
- Code : `src/musique/synth.js` (29 instruments synthétisés en Web Audio, sans fichier audio), `src/musique/scene3d.js` (studio 3D en 5 espaces + grande scène), `src/musique/data.js` (instruments, 10 cours, badges), `src/musique.js` (interface, cours, badges, cérémonie), `src/musique_jeux.js` (7 mini-jeux, composition à 5 pistes, concert).
- Données de l'enfant dans `adv.mus` : cours, jeux, défis d'instruments, créations (12 max, jamais exportées), badges (attribués uniquement quand les exercices correspondants sont validés).
- À tester sur téléphone : son (volume, latence), fluidité de la 3D (mode économique via `kelas_quality`), lisibilité de la grille de composition.
- À relire par un enseignant de musique : textes des cours et des instruments. Les sons sont synthétiques, non des enregistrements d'instruments réels.

## Panneau des directions et réseau routier (01/11/2026)
- Le panneau « CARTE » est remplacé par un panneau de directions au rond-point (aéroport, studio, école, centre commercial, aménagement des routes, gare, missions d'exploration, nouvelle cité). Le point d'action « Carte des lieux » reste à côté.
- Route de l'aéroport à 1+1, 2+2, 3+3 puis 4+4 voies (`routeVoies` dans `src/routes.js`). Le studio de musique a été déplacé à x=64.
- Bureau d'aménagement des routes (x=60, z=17) : `src/reseau.js`. 3 emplacements de routes (2 avenues nord-sud et une rocade) : construire, déplacer (3 positions), élargir (1 à 4 voies par sens). Coût en pièces + bitume ; démolir rembourse 60 %.
- Limites : la route d'entrée de la nouvelle cité et les anneaux gardent leur largeur actuelle (des bâtiments les bordent) ; des arbres décoratifs peuvent apparaître sur les routes construites dans la zone Est ; les véhicules ne sont pas contraints de suivre les routes.

## Mode aménagement général (01/11/2026)
- Menu « 🏗 Mode aménagement » : en touchant un objet du village on le choisit puis on le déplace (flèches, pas de 2 m ; 1 m pour les arbres), on le fait pivoter (bâtiments), on valide (coût en pièces). Objets modulables : les 5 bâtiments repères (centre commercial, concession, supermarché, musée, auto-école), la gare, les 2 stations-service, tous les arbres, les arbres plantés et les routes libres (créer, déplacer, allonger, 1 à 4 voies par sens, supprimer). Code : `src/amenager.js`.
- Fixes (repères) : maison familiale, école, rue principale et liaison, rond-point, site de l'aéroport, anneaux de la nouvelle cité. Les arbres sous un nouveau bâtiment ou une nouvelle route sont supprimés (on peut en replanter).
- À faire plus tard : déplacer la maison familiale (porte, intérieur), l'école et l'aéroport ; panneau des directions déplaçable ; mémoriser la position de la caméra en mode aménagement ; annuler/rétablir.
- Studio de musique : bouton « 🚪 Sortir » dans chaque onglet, « Retour à la salle de musique », Échap et retour du téléphone.

## BOYEKOLI DETECTIVE (01/11/2026)
- Agence de détectives : bâtiment en face de la gare (ouest du village, x≈-40) ; entrée = overlay 3D (`src/detective.js`, `src/detective/moteur.js`, `src/detective/data.js`). Pièces : bureau (ordinateur/dossiers, tableau d'investigation, carte, bibliothèque documentaire), salle d'interrogatoire, laboratoire, garage (véhicule d'enquête). Détective personnalisable (bouton 👤).
- Deux enquêtes sans violence : « Le mystère du musée » (masque Kuba déplacé pour nettoyage) et « Le mystère de l'école » (matériel mis au sec après une fuite). Examiner / chercher les objets cachés / ramasser / photographier / interroger (dialogues à choix) / carnet / inventaire / tableau de rapprochement / laboratoire (empreintes à la loupe, tests) / solution en 4 questions avec aides.
- Progression : compte dans « Agence de détectives (0/2) » du pôle des métiers (`done['met:d1'|'met:d2']`), étoiles, pièces (15 + 5 par étoile à la première réussite), certificat de détective débutant (conservé dans `adv.det`).
- À faire / limites : modèles 3D procéduraux (pas de GLB) ; photos stockées en miniatures dans la sauvegarde ; pas encore de chargement progressif ni d'effets sonores dédiés ; tests manuels sur smartphone à faire ; relecture des textes par un enseignant.
- Mode aménagement : on peut maintenant faire glisser l'objet choisi avec le doigt. La maison familiale n'est pas encore déplaçable (porte et intérieur liés au code du village).

## File d'attente des grands jeux demandés (01/11/2026, à réaliser dans cet ordre)
1. 🔬 BOYEKOLI SCIENCE LAB (laboratoire scientifique 3D : chimie, biologie, physique) → rubrique « Laboratoire scientifique (0/3) ».
2. 🏥 BOYEKOLI MEDICAL CENTER (hôpital virtuel : « Ma première journée à l'hôpital », « À la découverte des métiers de l'hôpital », ambulance, corps humain) → « Centre hospitalier (0/2) ». Sécurité pédagogique : simulation, pas de diagnostic réel.
3. 🏠 BOYEKOLI DESIGN STUDIO (éditeur 3D de maisons et décoration, mode libre et missions) → « Atelier de décoration (0/2) ».
4. 👗 BOYEKOLI FASHION STUDIO (création de vêtements, coiffures, couture, photo, défilé) → « Atelier mode et coiffure (0/1) » (à fusionner avec le jeu de mode existant).
5. 🌆 BOYEKOLI SMART CITY (simulation urbaine, à mélanger avec la ville et le mode aménagement existants) → « Ville intelligente (0/1) ».
6. 🚀 BOYEKOLI SPACE EXPLORER (fusées, pilotage, missions, planètes, station, observatoire) → « Exploration spatiale (0/1) ».
Contraintes communes : Three.js (pas de React), sans API payante, sauvegarde `adv`, pièces/étoiles/badges existants, tests mobile, ne pas modifier les autres activités. Les modèles GLB ne sont pas disponibles : modèles procéduraux.

## BOYEKOLI SCIENCE LAB (livré le 01/11/2026)
- Bâtiment explorable (réception, chimie, biologie, physique, microscopie/observation, recherche, stockage, bureau du chercheur) via `src/science.js` (moteur partagé `src/detective/moteur.js`) ; contenu dans `src/science/data.js`.
- 11 expériences simulées avec objectif, matériel, étapes, question avant/après, observation, explication : chimie (couleurs, indicateur de chou rouge, effervescence, changements d'état), biologie (cellules 3D manipulables, germination et plantes, organes 3D), physique (circuit et conducteurs, leviers, gravité, miroirs).
- Progression : compte dans « Laboratoire scientifique (0/3) » (`done['met:l1'|'l2'|'l3']`), points scientifiques, pièces, étoiles, badges de jeune chimiste/biologiste/physicien, certificat, déblocage progressif, décorations du laboratoire, vestiaire (blouse, lunettes, personnage).
- Limites : modèles procéduraux (pas de GLB), liquides animés en SVG, pas de manipulation « saisir/déposer » physique des objets en 3D (les actions se font par boutons dans des panneaux) ; sons à ajouter ; test smartphone à faire.

## Medical Center (fait)
- `src/hopital.js` + `src/hopital/data.js` : hôpital 3D (moteur d'enquête), mission 1 (4 cas, 2 requis), mission 2 (6 services, 4 requis), ambulance, anatomie, certificat. `adv.med`. Bâtiment au village (REPERES `hopital`, x -47, z 26) + bouton menu. Limites : modèles procéduraux, textes à faire relire par des professionnels de santé.
- Reste à faire dans la file : Design Studio, Fashion Studio, Smart City, Space Explorer.

## Design Studio (fait)
- `src/design.js` + `src/design/data.js` : éditeur 3D de maisons (dimensions, toit, pièces 1–4, ouvertures par clic, meubles 26 modèles avec placement sans collision, styles africain/congolais/Kinshasa/contemporain, textures wax/brique, 6 caméras, jour/nuit, photos, projets multiples, sauvegarde auto `adv.deco2`), missions m1/m2 évaluées (`done['met:a1']`, `['met:a2']`), certificat. Bouton menu « Design Studio ».
- Limites : pas de bâtiment d'entrée dans le village, murs intérieurs fixes (4 plans de pièces), pas de test smartphone réel.
