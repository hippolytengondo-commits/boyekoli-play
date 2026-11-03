---
title: "BOYEKOLI PLAY — Présentation complète de l'application"
subtitle: "Guide détaillé : contenu, jeux, progression, fonctionnement technique et déploiement"
lang: fr
---

# 1. En bref

**BOYEKOLI PLAY** est un jeu éducatif d'aventure en 3D pour les enfants et adolescents de la République démocratique du Congo, de la 1re primaire aux humanités. Le joueur explore un village, une école, une cité et des lieux de métiers ; il y réussit des missions scolaires (français, mathématiques, sciences, histoire-géographie, langues nationales…), gagne de l'argent « de la connaissance » (les **francs congolais, FC**), débloque progressivement des jeux de découverte des métiers et construit sa propre cité.

Principes de conception, appliqués partout :

- **Apprendre en jouant** : chaque bonne réponse a une conséquence visible (étoiles, pièces, FC, déblocages).
- **Aucune IA ni service payant** : tous les contenus sont préprogrammés ; aucune API payante n'est utilisée.
- **Pas de publicité**.
- **Fonctionne hors connexion** : après une première ouverture avec Internet, le jeu se met en mémoire sur l'appareil et fonctionne sans réseau (seuls les comptes, classes et envois en ligne demandent Internet).
- **Pensé pour le téléphone** (Android modeste d'abord) : commandes tactiles, rendu 3D allégé, sauvegarde automatique sur l'appareil.
- **Contexte congolais** : noms, lieux, monnaie (franc congolais), marchés de Kinshasa, provinces et territoires, langues nationales (lingala, kiswahili, kikongo, tshiluba).
- **Sécurité pédagogique** : les simulations (santé, sciences) sont clairement présentées comme fictives et ne remplacent jamais un professionnel.

Adresse du jeu en ligne (hébergement Cloudflare Pages) : `https://boyekoli-play-prive.pages.dev`

# 2. Comment jouer

## 2.1 Premier lancement
1. Écran d'accueil, puis création du joueur : prénom, personnage (visage, coiffure, teint, accessoires, tenue). Le créateur de personnage est aussi accessible au miroir de la maison et chez Maman Béa.
2. Courte séquence d'introduction du village, puis le joueur **démarre devant sa maison**.
3. Mama Lola, personnage guide, propose la première mission.

## 2.2 Commandes
| Action | Téléphone / tablette | Ordinateur |
|---|---|---|
| Se déplacer | joystick virtuel (bas gauche) | flèches ou Z Q S D |
| Tourner la caméra | glisser le doigt sur l'écran | souris |
| Agir (parler, entrer, utiliser) | bouton vert « Action » (bas droite) | touche E ou Entrée |
| Menu | bouton ☰ (haut droite) | touche M |
| Conduire un véhicule | **volant à la place du joystick** (bas gauche), pédales accélérer/freiner à droite, klaxon, carburant | touches de direction |
| Retour / sortie | gros bouton rouge « ⬅ Retour » en bas des écrans de jeu, bouton ✖ | Échap |

Dans les jeux en 3D (laboratoire, hôpital, agence…), le même joystick déplace le personnage ; le bouton « Interagir » utilise l'objet ou la personne la plus proche.

## 2.3 Voix, bulles de dialogue et sons
- Les dialogues s'affichent en **bulles de bande dessinée au-dessus du personnage** et sont **lus à voix haute** (voix différentes selon le personnage : femme, homme, enfant).
- Boutons « 🔊 Réécouter » et « 🔊/🔇 » (couper la voix) dans les jeux.
- Ambiance sonore et sons de jeu générés par programme (aucun fichier audio lourd) ; le studio de musique synthétise 29 instruments.

## 2.4 Sauvegarde
- La progression est enregistrée **automatiquement sur l'appareil** (stockage local), avec copies de secours et bouton de restauration.
- Un compte en ligne (facultatif) permet la synchronisation et l'espace classe/enseignant.
- Le jeu affiche « Mode hors connexion » quand le réseau est coupé, puis « Connexion rétablie ».

## 2.5 Installer comme application
- **Android (Chrome)** : bouton « 📲 Installer l'application » ou menu ⋮ › Installer.
- **iPhone/iPad (Safari)** : Partager › Sur l'écran d'accueil (la mémoire hors ligne y est plus durable).

# 3. Les monnaies et la progression

## 3.1 Les récompenses
| Élément | Rôle |
|---|---|
| **🪙 Pièces** (or et consorts) | Acheter objets, meubles, carburant, matériaux, tenues ; récompense des missions et des jeux. |
| **💵 Francs congolais (FC)** | **La vraie monnaie de la connaissance**, gagnée en répondant juste aux questions. Sert à acheter les **terrains**, financer les **constructions** et **débloquer l'accès** aux jeux et aux lieux. |
| **XP et niveaux** | Niveau du joueur, tenues débloquées par niveau. |
| **⭐ Étoiles** | 1 à 3 selon le nombre d'erreurs ; comptées dans la progression. |
| **Badges et certificats** | Récompenses de fin d'atelier (voir chaque jeu). |

Les gains les plus importants ne sont accordés qu'à la **première réussite** d'une mission (les répétitions donnent de petits gains), pour garder une économie équilibrée.

## 3.2 Un jeu évolutif : l'accès progressif
Au départ, **seules les missions scolaires et l'exploration du Congo sont ouvertes**. Les autres jeux sont visibles dans le village (bâtiment avec « 🔒 … bloqué ») mais fermés : il faut **réussir un nombre de missions** et **acheter l'accès en FC**. La fenêtre de déblocage affiche « Missions réussies x/N » et « FC y/z », et propose l'achat quand les deux conditions sont remplies.

| Lieu / jeu | Missions à réussir | Prix en FC |
|---|---|---|
| Boyekoli Farm (agriculture) | 5 | 50 |
| Science Lab | 8 | 80 |
| Medical Center (hôpital) | 12 | 120 |
| Concession (motos et voitures) | 12 | 120 |
| Design Studio | 15 | 150 |
| Aéroport et simulateur de vol | 20 | 200 |
| Agence de détectives | 22 | 220 |
| Studio de musique | 25 | 250 |
| Fashion Studio | 28 | 280 |
| Space Explorer | 30 | 300 |
| Business Simulator | 35 | 350 |

- Les joueurs qui ont déjà vraiment joué à un jeu en gardent l'accès.
- **L'administrateur** (compte connecté de rôle « admin », valable aussi hors connexion) accède à **tout** sans condition.
- Les seuils et prix sont des réglages faciles à ajuster (`src/acces.js`).

# 4. Le monde du jeu

## 4.1 Le village de départ
Place centrale avec rond-point et panneau de directions, maison familiale du joueur (entrée, salon, miroir, plans de construction), **école LEXARIS ACADÉMIE**, marché de Maman Béa, manguier (mini-jeu de cueillette), gare, mur et portail. Les personnages (Mama Lola, Professeure Ilunga, Junior, Directeur Mavungu, Maman Béa…) proposent des quêtes.

## 4.2 Quartiers et lieux
- **Quartier résidentiel du joueur** (vers le nord) : 20 terrains à acheter en FC, constructions améliorables, parking, routes à bitumer (voir §6.10).
- **Centre commercial, supermarché (rayons, défi des courses avec budget), musée virtuel du Congo** (6 salles, passeport du musée).
- **Concession** (motos et voitures), **auto-école** (permis, leçons de conduite, questions de code), stations-service (carburant).
- **Gare** : le train mène aux aventures et aux territoires.
- **Aéroport** (à l'est) : école de pilotage, licence, simulateur de vol.
- **Quartier des métiers** (à l'ouest) : bâtiments d'accès aux jeux (laboratoire, hôpital, agence, studios, Cité de l'espace, ferme école, entreprise du joueur…), chacun avec **aire de stationnement** ; accessibles **à pied ou en véhicule**.
- **Mode aménagement** : le joueur peut déplacer arbres, bâtiments repères et élargir des routes ; la plupart des éléments sont modulables.

## 4.3 Véhicules
Moto et voiture (achat à la concession, permis obligatoire), carburant à acheter, conduite au **volant tactile**, klaxon, stationnement dans le parking de la maison, stations-service, circulation de véhicules et de piétons dans le village.

# 5. Le contenu éducatif

## 5.1 Programme scolaire
Missions par niveau et par matière, de la **1re primaire aux 4e humanités**, plus une section **langues nationales** :

| Niveau | Missions au programme |
|---|---|
| 1re et 2e primaire | 32 chacune |
| 3e et 4e primaire | 38 chacune |
| 5e et 6e primaire | 42 chacune |
| 7e année | 40 |
| 8e année | 38 |
| 1re à 4e humanités | 30 chacune |
| Langues nationales | 32 |

Au total environ **450 titres de missions**, dont **438 avec contenu jouable** (questions, jeux d'ordre, calculs, collectes). Les matières comprennent le français, les mathématiques, l'éveil et civisme, les sciences, l'histoire-géographie, l'orientation, des sections techniques, commerciales, pédagogiques et littéraires, et le lingala, le kiswahili, le kikongo et le tshiluba.

Chaque mission : introduction par un personnage, questions à choix avec explication de la bonne réponse, parfois un mini-jeu ; étoiles selon les erreurs ; gains en pièces, XP et FC ; mode « révision ».

## 5.2 Exploration du Congo
Un lieu d'exploration **pour chacun des 145 territoires** de la RDC, avec trois missions (situer le territoire, chiffres clés, organisation et vie) construites à partir de données réelles : province, chef-lieu, population, superficie, densité, langue, nombre de secteurs, chefferies et communes, fait marquant. Cette base de données alimente aussi les missions croisées (§5.4).

## 5.3 Aventures scénarisées
Aventures racontées avec lieux et énigmes : le trésor congolais, sauvons la forêt, l'expédition au Virunga.

## 5.4 Les « Missions Boyekoli » : 50 missions dans les jeux
Cinq chapitres de dix missions, qui mêlent **un territoire de la RDC** (50 territoires différents, répartis sur 25 provinces), **un point du programme scolaire** (question de cours) et **un objectif à accomplir à l'intérieur d'un jeu**. Parcours :

1. Tableau des missions (menu), chapitre débloqué quand 5 missions du précédent sont réussies.
2. Briefing par un guide (bulle vocale) : histoire, fiche du territoire, objectif, lien avec le programme.
3. Le bouton « Accepter » ouvre le jeu ; un **bandeau jaune** rappelle l'objectif.
4. L'objectif est détecté automatiquement quand le joueur l'accomplit dans le jeu.
5. Bilan : une question sur le territoire et une question de cours ; 1 à 3 étoiles ; pièces et XP à la première réussite.

Répartition : Science Lab 7, Medical Center 7, Cité 7, Space Explorer 8, Design Studio 6, Fashion Studio 6, agence 5, musique 2, vol 2. Si le jeu requis est encore bloqué, la mission l'indique.

## 5.5 Bonus et événements
Collections et badges, surprise du jour, événement du jour, bonus de lieu, mini-jeu de cueillette, boutique de Maman Béa, animalerie (adopter et soigner un animal qui suit le joueur).

# 6. Les jeux de découverte des métiers

Chaque jeu est un **atelier** qui compte pour la progression des métiers : il contient des missions, un badge et un certificat de fin d'atelier. Tous respectent les mêmes règles : bulles vocales, bouton Retour toujours accessible, sauvegarde automatique, accès progressif.

## 6.1 🔬 BOYEKOLI SCIENCE LAB (laboratoire)
Laboratoire 3D explorable avec trois laboratoires (chimie, biologie, physique), vestiaire (blouse, lunettes) et **11 expériences interactives** : mélange des couleurs, acide/base au chou rouge, réaction effervescente, changements d'état de l'eau, cellules (viewer 3D), germination, organes du corps, circuit électrique, leviers, gravité, miroirs et lumière. Chaque expérience : objectif, matériel, quiz avant, manipulation, quiz après, explication scientifique. Badges de jeune chimiste, biologiste, physicien, et certificat de jeune scientifique. Toutes les expériences sont des **simulations** (aucun produit réel).

## 6.2 🏥 BOYEKOLI MEDICAL CENTER
Hôpital 3D de 12 salles (accueil, consultation, pédiatrie, urgences, laboratoire, radiologie, échographie, pharmacie, hospitalisation, soins, bloc simulé), personnages variés, instruments interactifs (stéthoscope avec son, thermomètre, tensiomètre, oxymètre), corps humain 3D.
- **Mission 1 « Ma première journée à l'hôpital »** : accueillir un patient fictif (4 cas : fièvre, rhume, petite blessure, fatigue), poser des questions (réponses dites à voix haute), relever les symptômes, mesurer, choisir l'examen adapté, **conduire le patient (qui te suit) jusqu'au service d'examen**, lire le compte rendu et proposer une conduite.
- **Mission 2 « À la découverte des métiers de l'hôpital »** : activités dans les services (laboratoire, radiologie, pharmacie, pédiatrie, urgences avec **transport du patient par l'ambulance** en jeu de conduite, chirurgie et hygiène).
- Ambulance 3D (équipements, premiers secours, trajet), hygiène (ordre des gestes).
- **Sécurité** : simulation uniquement, aucun diagnostic réel, aucune prescription, aucune donnée personnelle demandée.

## 6.3 🕵️ AGENCE DE DÉTECTIVES
Agence 3D (tableau d'enquête, carnet, laboratoire, bibliothèque, véhicule d'enquête), **deux enquêtes** (musée, école) avec indices cachés à scanner, témoins à interroger (dialogues), photos, analyses au laboratoire, liens entre indices, solution finale ; étoiles selon les erreurs et la qualité de l'enquête ; certificat de jeune détective.

## 6.4 🏠 BOYEKOLI DESIGN STUDIO
Éditeur 3D de maisons : dimensions, toit (plat, deux pentes, quatre pentes), 1 à 4 pièces, murs et revêtements, **portes, fenêtres et garage posés en touchant un mur**, terrasse, jardin, clôture, garage ; **26 meubles** (salon, chambre, cuisine, salle de bain, déco, extérieur) placés sur une grille **sans traverser un mur ni un autre meuble**, déplacés, pivotés, agrandis, dupliqués ; styles africain, congolais traditionnel, Kinshasa moderne, contemporain ; textures wax, briques, pierre ; **6 caméras** (extérieure, aérienne, dessus, intérieure, hauteur humaine, visite libre) ; jour/nuit ; photos ; jusqu'à 8 projets sauvegardés automatiquement ; notions d'architecture. **Missions évaluées** : « Ma première maison » et « La villa familiale » ; certificat d'architecte décorateur.

## 6.5 👗 BOYEKOLI FASHION STUDIO
Mannequin 3D (6 carnations, 3 morphologies, hommes et femmes), 9 modèles de tenues, 5 tissus (coton, wax, bazin, jean, soie), motifs, boutons, poches, ceinture, accessoires ; **couture en 5 étapes** (choisir le bon outil) ; coiffures africaines (afro, tresses, locks, chignon, nœuds bantous, gélé), longueur et couleur ; maquillage fictif ; essayage ; **studio photo** (4 fonds, 4 poses) ; **défilé jouable** (jauge de pose) ; portfolio de 8 créations ; 7 missions (4 suffisent pour valider l'atelier) ; quiz de culture de la mode ; certificat de jeune styliste.

## 6.6 🚀 BOYEKOLI SPACE EXPLORER
Constructeur de fusée (étages, moteurs, réservoirs, charge) avec **test d'orbite**, **simulation de vol** (poussée, séparation d'étages, gravité décroissante, orbite, atterrissage ; pilote automatique ou pilotage manuel pour plus d'étoiles), **12 missions** : décollage, orbite, satellite, amarrage, cap sur la Lune, alunissage, rover lunaire, rover martien, astéroïde, station spatiale, voyage vers Saturne (quiz), mission complète. Système solaire 3D, Terre et Congo vus de l'espace, station explorable (5 modules), astronaute ou robot personnalisable, expérience de gravité, 5 niveaux (apprenti astronaute à commandant). Les unités de vol sont réduites (jeu, pas simulation scientifique exacte).

## 6.7 🌾 BOYEKOLI FARM (agriculture et élevage)
Ferme 3D de 40 parcelles, 7 cultures (manioc, maïs, arachide, haricot, riz, banane plantain, café), saisons sèche et des pluies, météo, arrosage, mauvaises herbes, parasites (soin au neem), compost, rotation des cultures ; **élevage** (poules, chèvres, tilapias) avec **nourrissage automatique chaque jour** à partir d'une réserve de rations ; marché à prix variables ; 10 missions (5 suffisent) ; certificat de jeune agriculteur. La monnaie de la ferme est la « pièce de ferme (pf) », distincte des FC.

## 6.8 💼 BOYEKOLI BUSINESS SIMULATOR (entrepreneuriat)
École virtuelle d'entrepreneuriat qui **remplace l'ancienne activité de boutique** :
- **Création de l'entreprise** en 6 étapes : nom, **logo** (symbole, couleur, forme), **10 secteurs** (commerce, restauration, agriculture, pharmacie, informatique, transport, construction, industrie, mode, services), type, **emplacement** (marchés de Kinshasa — Zando, Liberté, Gambela, Central, Limete —, Lubumbashi, Goma, Kisangani, village, ou rachat du supermarché du village), location ou achat, produits, **capital de départ en FC de simulation**.
- **Établissement 3D explorable** adapté au secteur (rayons, cuisine, champs, machines, bureaux…), avec caisse, réserve, bureau de direction, panneau du personnel, panneau marketing et maquette d'expansion.
- **Clients animés** qui entrent, regardent les rayons, font la queue et ont des comportements différents (pressé, comparateur, négociateur, exigeant, fidèle) ; service à la caisse (vendre, remise de 5 ou 10 %, refuser) ou **automatique avec un caissier**.
- **Gestion financière réelle** : achats qui diminuent la trésorerie, ventes, salaires, loyer, charges, frais Mobile Money, intérêts d'emprunt ; tableau de bord (capital, chiffre d'affaires, dépenses, bénéfice net, dettes, valeur du stock, valeur nette, courbes, journal des décisions).
- **Fournisseurs** à comparer (prix, délai, fiabilité), commandes, livraisons, ruptures.
- **Personnel** : caissier, vendeur, comptable, responsable commercial, gestionnaire, technicien, RH ; compétences, salaires, motivation, départs.
- **Marketing** : conception d'une affiche, campagnes (affiches, WhatsApp, radio, dépliants), promotions.
- **8 événements** : hausse des prix, concurrent, perte de fournisseur, panne, réclamation, difficulté de trésorerie, hausse de la demande, opportunité d'agence.
- **Expansion** : agrandir, équipements, agences (jusqu'à 5), portée locale, régionale, nationale ou internationale.
- **Progression** : 5 niveaux (entrepreneur débutant, petit entrepreneur, entrepreneur confirmé, chef d'entreprise, grand entrepreneur) ; **bilan de scénario de 15 jours** (résultats, erreurs, compétences : initiative, gestion financière, comptabilité, négociation, leadership, décision, créativité, gestion des risques, responsabilité) ; 10 objectifs, certificat.
- Le bâtiment de l'entreprise (et ses agences) apparaît dans le quartier des métiers.

## 6.9 🎶 BOYEKOLI MUSIC STUDIO
Studio de musique 3D : cours, jeux musicaux, composition et enregistrement avec **29 instruments synthétisés** (africains et occidentaux), badges (jeune compositeur, petit percussionniste, jeune pianiste, explorateur des instruments africains, maître du rythme, jeune musicien).

## 6.10 🌆 Gestion de la cité (Smart City, intégrée au quartier résidentiel)
Au lieu d'un jeu séparé, la ville intelligente est **fusionnée avec le système existant** : le joueur **achète des terrains avec ses FC** et y construit des bâtiments (résidences, écoles, santé, sport, culture, police, pompiers, et les nouveaux : **énergie** (panneaux solaires, centrale), **eau** (puits, château d'eau), **commerce** (marché, centre commercial), **transport** (arrêt de bus, gare routière), **parc**). Le **tableau de bord de la cité** calcule à partir des vrais bâtiments : population, électricité, eau, emplois, éducation, santé, sécurité, circulation, pollution, satisfaction, avec **conseils du maire**, liste des terrains, **10 missions de maire** et notions ; la satisfaction modifie les loyers (de ×0,8 à ×1,25). Accès : bouton « Tableau de bord de ma cité » dans la fenêtre d'un terrain ou rubrique « Ville intelligente ».

## 6.11 ✈️ Aéroport et simulateur de vol (BOYEKOLI FLIGHT SIMULATOR)
École de pilotage (inscription, théorie, licence), avion contrôlable (poussée, gouverne, trains, 4 caméras, pause, carburant), missions chronométrées de leçons, examen, courrier, villes et provinces (Kinshasa, fleuve Congo…), retour à l'aéroport en cas d'échec ; commandes tactiles, clavier et souris.

## 6.12 Autres activités
Auto-école (inscription, cours, leçons de conduite, permis), supermarché et musée, animalerie, ferme historique et vente de récoltes au marché (vente avec rendu de monnaie), **mode aménagement** (déplacer arbres et bâtiments, élargir les routes), maison évolutive (chambre, cuisine, étage).

# 7. Comptes, classes et espace enseignant

- **Rôles** : élève, enseignant, parent, établissement, administrateur de la plateforme.
- Comptes avec pseudo, mot de passe, e-mail ou téléphone (récupération d'accès par e-mail), niveau scolaire.
- **Établissements et classes** : un établissement crée ses classes ; les enseignants les rejoignent avec un code ; missions de classe, évaluations, scores, erreurs, communiqués avec fichier.
- **Administrateur** : tableau de bord de la plateforme (rôle attribué uniquement dans la base de données) ; accès à tous les jeux dans l'application.
- Tout ce qui dépend du réseau (comptes, classes, envois) fonctionne en ligne ; le jeu lui-même et sa sauvegarde fonctionnent sans Internet.

# 8. Fonctionnement technique (pour les développeurs)

## 8.1 Technologies
- **Three.js 0.160** pour la 3D, **JavaScript** pur (modules), **aucun framework** (ni React, ni moteur de physique, ni fichiers de modèles 3D : tous les modèles — personnages, bâtiments, véhicules, meubles, machines — sont **construits par programme**).
- **esbuild** pour assembler le code en un seul fichier `dist/game.js` (environ 2,5 Mo).
- **Web Audio** pour les sons et la musique (synthèse), **synthèse vocale du navigateur** pour les voix.
- **Service worker** pour le hors connexion ; **localStorage** pour la sauvegarde.
- **Supabase** (base de données et authentification) pour les comptes et les classes ; aucune API payante.

## 8.2 Organisation du code (dossier `src/`, environ 90 fichiers, plus de 21 000 lignes)
| Fichier / dossier | Rôle |
|---|---|
| `main.js` | cœur du jeu : scènes, déplacement, quêtes, dialogues, véhicules, quartier résidentiel, menus |
| `world.js`, `reperes.js`, `routes.js`, `reseau.js`, `amenager.js`, `quartier_res.js` | village, bâtiments repères, routes, mode aménagement, terrains et constructions |
| `programme*.js`, `contenu/` | missions scolaires et contenus (collections, métiers, musée, supermarché…) |
| `territoires_data.js`, `territoires_gen.js`, `lieux_*.js` | 145 territoires, provinces, missions d'exploration |
| `detective/moteur.js` | **moteur 3D partagé** (pièces, objets, personnages, joystick, personnages qui marchent) réutilisé par le laboratoire, l'hôpital, l'agence et l'entreprise |
| `science.js`, `hopital.js`, `detective.js`, `design.js`, `fashion.js`, `spatial.js`, `agro.js`, `entreprise.js`, `cite.js`, `musique.js`, `avion.js` | les jeux (chaque dossier associé contient ses données) |
| `entreprise/sim.js` | moteur économique du Business Simulator (logique pure, testée par simulation) |
| `espace/sim.js` | simulation de vol du Space Explorer |
| `acces.js` | accès progressif (missions + FC) et administrateur |
| `missions50.js`, `missions50/data.js` | générateur et suivi des 50 missions croisées |
| `parole.js` | bulles vocales, boutons Retour et son communs |
| `cloud.js`, `espace.js` | comptes, classes, sauvegarde en ligne |

## 8.3 Principes
- Chaque jeu est un **module** `creerX(D)` qui renvoie ses actions ; elles sont fusionnées dans `window` et appelées par des boutons HTML.
- Les jeux plein écran sont des **calques** au-dessus du jeu principal ; le rendu principal est suspendu pendant ce temps (économie de batterie) et les contextes graphiques sont libérés à la fermeture (stabilité sur téléphone).
- Les jeux envoient des **événements** (`mis.evt`) que le système de missions écoute.
- L'état du joueur est un objet unique sauvegardé en bloc ; chaque jeu y ajoute son propre champ.

## 8.4 Construire et publier
```
npm install
npm run build     # assemble le code et génère le service worker (hors connexion)
npm run site      # prépare le dossier « site » à publier
```
Publication actuelle : **Cloudflare Pages**, dépôt GitHub **privé** `boyekoli-play-prive` (branche `main`), commande de build `npm install && npm run site`, dossier `site`, variable `NODE_VERSION=20`. Le fichier `_headers` empêche la mise en cache de la page et du service worker.

## 8.5 Hors connexion
`scripts/gen-sw.mjs` génère `sw.js` : tous les fichiers (page, script, styles, images, icônes) sont copiés en mémoire à la première visite ; réseau d'abord pour le code (délai de 3 s), mémoire d'abord pour les images ; le serveur des comptes n'est jamais mis en mémoire. Testé : coupure d'Internet puis rechargement, création du joueur, village et Science Lab fonctionnent.

## 8.6 Sécurité et données
- Aucun secret dans le code ; la clé Supabase « publique » est faite pour être visible : la protection est dans les **règles d'accès de la base**.
- Pas de collecte de données personnelles dans les jeux de simulation (santé notamment).
- À faire avant le lancement public : confirmation des e-mails, captcha, contrôle de sécurité de la base, sauvegardes, double authentification (GitHub, Cloudflare, Supabase).

# 9. Qualité et tests

- Chaque jeu a été testé automatiquement dans un navigateur simulant un téléphone : parcours complets (laboratoire : 11 expériences, hôpital : cas et services, Business Simulator : création et journées, Design Studio, Fashion Studio, Space Explorer, ferme, cité, missions croisées).
- Test de fumée : 25 clics aléatoires par jeu sans erreur.
- Moteurs économiques réglés par simulation (entreprise, vol spatial).
- **Limites reconnues** : pas encore de test sur de vrais téléphones ; les textes pédagogiques (médecine, sciences, droit, agriculture) doivent être relus par des enseignants et des professionnels ; les modèles 3D sont volontairement simples (performance) ; l'équilibrage (seuils de déblocage, prix, gains) est à affiner avec de vrais joueurs ; une seule entreprise est sauvegardée dans le Business Simulator ; la maison familiale n'est pas encore déplaçable.

# 10. Documents du projet (dossier `docs/`)
`A_FAIRE.md` (liste de reprise et notes de chaque étape), `DEPLOIEMENT.md` (dépôt privé et Cloudflare), `SERVEUR.md`, `DONNEES_TERRITOIRES.md`, `FEUILLE_DE_ROUTE_ENRICHISSEMENT.md`, `AUDIT-CAHIER-DES-CHARGES.md`, `EXTENSION_VILLE.md`, `SPONSORS.md`. Les documents Word confidentiels (budget et lettre UNICEF, évaluation de l'apport en nature, présentation investisseurs) ne sont **pas** dans Git.

# 11. Prochaines étapes recommandées

1. Tester le jeu sur plusieurs téléphones Android et corriger ce qui bloque.
2. Faire relire les textes par des enseignants et des professionnels de santé.
3. Régler l'équilibrage (seuils, prix, gains) après les premiers essais d'enfants.
4. Avant le lancement public : sécurité de la base, e-mails de confirmation, captcha, sauvegardes.
5. Démarches de la société (SARLU), recherche de financement (UNICEF et autres).
6. Évolutions possibles : financer le capital du Business Simulator avec de vrais FC, plusieurs entreprises, application Android native, 500 missions d'exploration, page « Nos partenaires ».

# 12. Glossaire
- **FC** : franc congolais ; monnaie de la connaissance dans le jeu (et unité de simulation dans le Business Simulator).
- **pf** : pièce de ferme, monnaie interne de Boyekoli Farm.
- **Service worker** : petit programme qui garde le jeu en mémoire pour qu'il fonctionne sans Internet.
- **Dépôt** : l'endroit (GitHub) où est stocké le code.
- **Hébergement** : le service (Cloudflare Pages) qui met le jeu en ligne.
- **Supabase** : service qui gère les comptes et la base de données.
