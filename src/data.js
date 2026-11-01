import {LIEUX} from './lieux70.js';
// Données du jeu : banques de questions, personnages, objets.
export const Q=(q,c,a,exp)=>({q,c,a,exp});
export const BANK={
 maths:[
  Q('Une cagette contient 8 mangues. Combien de mangues dans 5 cagettes ?',['30','35','40','45'],'40','5 × 8 = 40.'),
  Q('Quel est le double de 17 ?',['27','34','37','32'],'34','17 × 2 = 34.'),
  Q('Un sac de 25 mangues est partagé entre 5 enfants. Combien chacun reçoit-il ?',['4','5','6','7'],'5','25 ÷ 5 = 5.'),
  Q('Combien font 7 × 6 ?',['36','42','48','40'],'42','7 × 6 = 42.'),
  Q('Combien font 100 − 37 ?',['73','67','63','53'],'63','100 − 37 = 63.'),
  Q('Quelle est la moitié de 90 ?',['40','45','50','55'],'45','90 ÷ 2 = 45.'),
  Q('Combien font 12 + 29 ?',['39','41','43','51'],'41','12 + 29 = 41.'),
  Q('Combien font 9 × 9 ?',['72','81','90','99'],'81','9 × 9 = 81.'),
  Q('Combien font 144 ÷ 12 ?',['10','11','12','14'],'12','12 × 12 = 144.'),
  Q('Quel est le périmètre d’un carré de 6 m de côté ?',['12 m','24 m','36 m','30 m'],'24 m','4 × 6 = 24 m.'),
  Q('Trois cahiers à 500 FC chacun coûtent combien en tout ?',['1 000 FC','1 200 FC','1 500 FC','2 000 FC'],'1 500 FC','3 × 500 = 1 500.')
 ],
 francais:[
  Q('Hier, nous ___ au marché. (verbe aller)',['allons','sommes allés','irons','allerons'],'sommes allés','Au passé composé : nous sommes allés.'),
  Q('Quel est l’antonyme de « ancien » ?',['vieux','nouveau','vieil','long'],'nouveau','Le contraire d’« ancien » est « nouveau ».'),
  Q('Quel mot est un nom propre ?',['chien','Kinshasa','livre','maison'],'Kinshasa','Un nom propre désigne un lieu précis.'),
  Q('Quel est le pluriel de « cheval » ?',['chevals','chevaux','chevaus','chevales'],'chevaux','Les noms en -al font leur pluriel en -aux.'),
  Q('Quel est un synonyme de « content » ?',['triste','heureux','fâché','pressé'],'heureux','« Content » et « heureux » ont le même sens.'),
  Q('Les enfants ___ dans la cour. (jouer, présent)',['jouent','joue','jouons','jouez'],'jouent','Avec « ils / elles », le verbe se termine par -ent.'),
  Q('Quel mot est un verbe ?',['table','courir','joli','rapidement'],'courir','« Courir » exprime une action : c’est un verbe.'),
  Q('Quel est le féminin de « acteur » ?',['acteuse','actrice','acteure','actresse'],'actrice','Acteur → actrice.'),
  Q('Ils ___ faim. (verbe avoir)',['ont','sont','avons','a'],'ont','Ils ont : verbe avoir à la 3e personne du pluriel.')
 ],
 geo:[
  Q('Quelle est la capitale de la RDC ?',['Lubumbashi','Goma','Kinshasa','Kisangani'],'Kinshasa','Kinshasa est la capitale de la RDC.'),
  Q('Combien de provinces compte la RDC aujourd’hui ?',['11','15','26','30'],'26','Depuis 2015, la RDC compte 26 provinces.'),
  Q('Quel grand fleuve traverse Kinshasa ?',['le Nil','le Niger','le Congo','le Zambèze'],'le Congo','Le fleuve Congo borde Kinshasa.'),
  Q('Quel océan touche la côte de la RDC ?',['Indien','Atlantique','Pacifique','Arctique'],'Atlantique','La petite côte de la RDC donne sur l’océan Atlantique.'),
  Q('Quelle est la grande ville du Haut-Katanga ?',['Goma','Lubumbashi','Matadi','Bukavu'],'Lubumbashi','Lubumbashi est le chef-lieu du Haut-Katanga.'),
  Q('Quel lac borde la RDC à l’est ?',['Tchad','Tanganyika','Titicaca','Léman'],'Tanganyika','Le lac Tanganyika longe l’est de la RDC.'),
  Q('Quel est le principal port maritime de la RDC ?',['Matadi','Kindu','Kikwit','Bunia'],'Matadi','Matadi est le grand port sur le fleuve Congo.'),
  Q('Quelle est la capitale du Congo-Brazzaville, pays voisin ?',['Brazzaville','Luanda','Kampala','Kigali'],'Brazzaville','Brazzaville est face à Kinshasa, de l’autre côté du fleuve.')
 ],
 histoire:[
  Q('En quelle année le Congo belge est-il devenu indépendant ?',['1948','1960','1965','1975'],'1960','L’indépendance date de 1960.'),
  Q('Quel jour célèbre-t-on l’indépendance ?',['1er mai','30 juin','17 mai','4 décembre'],'30 juin','La fête de l’indépendance a lieu le 30 juin.'),
  Q('Qui fut le premier Premier ministre du Congo indépendant ?',['Patrice Lumumba','Mobutu','Laurent-Désiré Kabila','Félix Tshisekedi'],'Patrice Lumumba','Patrice Lumumba dirigea le premier gouvernement.'),
  Q('Qui fut le premier président du Congo indépendant ?',['Joseph Kasa-Vubu','Mobutu','Patrice Lumumba','Moïse Tshombe'],'Joseph Kasa-Vubu','Joseph Kasa-Vubu fut le premier chef de l’État.'),
  Q('Quel symbole figure en haut à gauche du drapeau de la RDC ?',['un soleil','une étoile jaune','une croix','un lion'],'une étoile jaune','Une étoile jaune brille sur fond bleu ciel.'),
  Q('Quelle est la devise de la RDC ?',['Justice – Paix – Travail','Unité – Force – Progrès','Liberté – Égalité – Fraternité','Travail – Famille – Patrie'],'Justice – Paix – Travail','La devise nationale est « Justice – Paix – Travail ».'),
  Q('Quelle est la monnaie de la RDC ?',['le franc congolais','le dollar','le cedi','le naira'],'le franc congolais','La monnaie nationale est le franc congolais (FC).')
 ]
 ,marche:[
  Q('Un kilo de manioc coûte 1 500 FC. Combien coûtent 3 kilos ?',['3 000 FC','4 500 FC','4 000 FC','5 500 FC'],'4 500 FC','3 × 1 500 = 4 500 FC.'),
  Q('Tu achètes pour 2 300 FC et tu donnes 5 000 FC. Combien te rend-on ?',['2 300 FC','2 500 FC','2 700 FC','3 700 FC'],'2 700 FC','5 000 − 2 300 = 2 700 FC.'),
  Q('Une caisse de 12 tomates coûte 6 000 FC. Combien coûte une tomate ?',['300 FC','400 FC','500 FC','600 FC'],'500 FC','6 000 ÷ 12 = 500 FC.'),
  Q('Quelle est la moitié de 3 600 FC ?',['1 600 FC','1 800 FC','2 000 FC','1 200 FC'],'1 800 FC','3 600 ÷ 2 = 1 800 FC.'),
  Q('Trois pains à 800 FC et un jus à 1 200 FC. Quel est le total ?',['3 200 FC','3 600 FC','4 000 FC','2 400 FC'],'3 600 FC','3 × 800 = 2 400, puis 2 400 + 1 200 = 3 600 FC.'),
  Q('Un sac de riz de 25 kg est partagé en sacs de 5 kg. Combien de sacs obtient-on ?',['4','5','6','10'],'5','25 ÷ 5 = 5 sacs.'),
  Q('Le prix passe de 4 000 FC à 5 000 FC. De combien a-t-il augmenté ?',['500 FC','1 000 FC','1 500 FC','2 000 FC'],'1 000 FC','5 000 − 4 000 = 1 000 FC.')
 ],
 nutrition:[
  Q('Quel aliment est riche en vitamine C ?',['le sel','l’orange','l’huile','le sucre'],'l’orange','Les agrumes comme l’orange contiennent beaucoup de vitamine C.'),
  Q('Quels aliments nous donnent surtout de l’énergie ?',['les féculents (manioc, riz)','les bonbons seulement','l’eau','le sel'],'les féculents (manioc, riz)','Les féculents comme le manioc et le riz donnent de l’énergie.'),
  Q('Que faut-il faire avant de manger ?',['courir','se laver les mains','dormir','jouer au ballon'],'se laver les mains','Se laver les mains évite de manger des microbes.'),
  Q('Dans quel aliment trouve-t-on des protéines ?',['le poisson','le sucre','le sel','l’eau'],'le poisson','Le poisson, la viande, les œufs et les haricots contiennent des protéines.'),
  Q('Pourquoi faut-il manger des fruits et des légumes ?',['pour être en bonne santé','pour avoir plus chaud','pour dormir','pour grandir en taille d’un coup'],'pour être en bonne santé','Ils apportent des vitamines qui protègent le corps.')
 ],
 fleuve:[
  Q('Le fleuve Congo se jette dans quel océan ?',['l’océan Indien','l’océan Atlantique','l’océan Pacifique','l’océan Arctique'],'l’océan Atlantique','Le fleuve Congo se jette dans l’océan Atlantique.'),
  Q('Quel est le deuxième plus long fleuve d’Afrique ?',['le Niger','le Congo','le Zambèze','le Nil'],'le Congo','Après le Nil, le Congo est le deuxième plus long fleuve d’Afrique.'),
  Q('Quelle ville se trouve en face de Kinshasa, de l’autre côté du fleuve ?',['Luanda','Brazzaville','Kampala','Nairobi'],'Brazzaville','Brazzaville, capitale de la République du Congo, est face à Kinshasa.'),
  Q('Quel grand animal vit dans les eaux du fleuve Congo ?',['le zèbre','l’hippopotame','le chameau','le renne'],'l’hippopotame','L’hippopotame vit dans les rivières et les fleuves d’Afrique centrale.'),
  Q('Un pêcheur attrape 12 poissons le matin et 9 l’après-midi. Combien en tout ?',['19','20','21','22'],'21','12 + 9 = 21 poissons.')
 ],
 environnement:[
  Q('Pourquoi ne faut-il pas jeter de déchets dans le fleuve ?',['ça pollue l’eau et fait mourir les poissons','ça fait grandir les poissons','ça purifie l’eau','ça n’a aucun effet'],'ça pollue l’eau et fait mourir les poissons','Les déchets polluent l’eau et menacent les animaux qui y vivent.'),
  Q('Que faut-il faire des déchets ?',['les jeter dans une poubelle','les enterrer dans le fleuve','les brûler près des maisons','les laisser dans la rue'],'les jeter dans une poubelle','On jette les déchets à la poubelle pour garder le quartier propre.'),
  Q('Que donnent les arbres à notre planète ?',['de l’oxygène','du plastique','de la fumée','du sable'],'de l’oxygène','Les arbres produisent l’oxygène que nous respirons.'),
  Q('Pourquoi faut-il économiser l’eau potable ?',['parce qu’elle est précieuse','parce qu’elle est dangereuse','parce qu’elle est gratuite et infinie','parce qu’elle est lourde'],'parce qu’elle est précieuse','L’eau potable est précieuse : tout le monde en a besoin.')
 ],
 sante:[
  Q('Combien de fois par jour faut-il au moins se brosser les dents ?',['une fois par semaine','au moins deux fois','jamais','dix fois'],'au moins deux fois','On se brosse les dents au moins deux fois par jour, matin et soir.'),
  Q('Comment attrape-t-on le paludisme ?',['par la piqûre d’un moustique','en mangeant du manioc','en jouant dehors','en buvant du lait'],'par la piqûre d’un moustique','Le paludisme est transmis par la piqûre de certains moustiques.'),
  Q('Comment se protéger du paludisme la nuit ?',['en dormant sous une moustiquaire','en dormant dehors','en laissant les fenêtres ouvertes','en mangeant beaucoup'],'en dormant sous une moustiquaire','La moustiquaire empêche les moustiques de nous piquer.'),
  Q('Pourquoi se faire vacciner ?',['pour se protéger de certaines maladies','pour grandir plus vite','pour mieux courir','pour avoir de la fièvre'],'pour se protéger de certaines maladies','Les vaccins protègent contre des maladies graves.'),
  Q('Pendant combien de temps faut-il se laver les mains avec du savon ?',['2 secondes','environ 20 secondes','10 minutes','jamais avec du savon'],'environ 20 secondes','Il faut frotter les mains environ 20 secondes avec du savon.'),
  Q('Que faut-il boire pour rester en bonne santé ?',['de l’eau propre','de l’eau sale','seulement des sodas','rien'],'de l’eau propre','L’eau propre est la meilleure boisson pour le corps.')
 ],
 corps:[
  Q('Quel organe pompe le sang dans le corps ?',['le cœur','le foie','l’estomac','le cerveau'],'le cœur','Le cœur pompe le sang dans tout le corps.'),
  Q('Avec quels organes respire-t-on ?',['les poumons','les reins','le cœur','les os'],'les poumons','On respire grâce aux poumons.'),
  Q('Que faire si quelqu’un a une petite coupure ?',['nettoyer la plaie avec de l’eau propre et du savon','mettre de la terre dessus','ne rien faire','la frotter fort'],'nettoyer la plaie avec de l’eau propre et du savon','On nettoie la plaie pour éviter une infection.'),
  Q('Combien d’heures un enfant doit-il dormir environ chaque nuit ?',['3 heures','5 heures','9 à 11 heures','15 heures'],'9 à 11 heures','Un enfant a besoin d’environ 9 à 11 heures de sommeil.')
 ],
 droit:[
  Q('Comment s’appelle la loi la plus importante d’un pays ?',['le règlement de l’école','la Constitution','le menu du marché','le calendrier'],'la Constitution','La Constitution est la loi fondamentale d’un pays.'),
  Q('À quel âge devient-on majeur en RDC ?',['14 ans','16 ans','18 ans','21 ans'],'18 ans','En RDC, on est majeur à 18 ans.'),
  Q('Qui vote les lois en RDC ?',['le Parlement','le marché','l’école','la police seule'],'le Parlement','Le Parlement (Assemblée nationale et Sénat) vote les lois.'),
  Q('Quel objet est le symbole de la justice ?',['la balance','le ballon','le marteau de menuisier','la houe'],'la balance','La balance symbolise une justice équitable.'),
  Q('À quoi sert le droit de vote ?',['à choisir ses dirigeants','à choisir son repas','à passer en classe supérieure','à voyager gratuitement'],'à choisir ses dirigeants','Voter permet de choisir les personnes qui dirigent le pays.')
 ],
 droits_enfant:[
  Q('Quel droit permet à tous les enfants d’apprendre à lire et à écrire ?',['le droit à l’éducation','le droit de conduire','le droit de voter','le droit de voyager seul'],'le droit à l’éducation','Tout enfant a le droit d’aller à l’école.'),
  Q('Un enfant peut-il être obligé de travailler à la place d’aller à l’école ?',['non, c’est interdit','oui, toujours','oui, si l’adulte le veut','oui, après 8 ans'],'non, c’est interdit','Le travail forcé des enfants est interdit.'),
  Q('Que faire si un enfant est maltraité ?',['en parler à un adulte de confiance','se taire','le cacher','se battre'],'en parler à un adulte de confiance','Il faut en parler à un adulte de confiance, qui pourra l’aider et le protéger.'),
  Q('Tout enfant a le droit à…',['la santé et la protection','aucun droit','un téléphone','un permis de conduire'],'la santé et la protection','Tous les enfants ont droit à la santé, à la protection et à l’éducation.')
 ]

};
export const SUJETS={maths:'Calcul',francais:'Français',geo:'Géographie',histoire:'Histoire',marche:'Calcul du marché',nutrition:'Alimentation',fleuve:'Le fleuve Congo',environnement:'Environnement',sante:'Santé',corps:'Le corps humain',droit:'Droit et citoyenneté',droits_enfant:'Droits de l’enfant'};


// Personnages : position (x,z en mètres) dans leur scène, orientation ry, apparence.
// k : tenue (uniforme, pagne, boubou) ; co : coiffure ; h : taille relative ; skin : teint.
export const NPC={
 lola:{sc:'ville',x:22.5,z:1.5,ry:-1.9,name:'Mama Lola',short:'Mama Lola',role:'Gardienne du portail',kind:'quiz',sujet:'maths',nb:3,
  look:{s:'f',h:.93,skin:'#6b4028',c:'#e67e22',c2:'#1f7a4d',k:'pagne',co:'gris',age:'aine'},
  intro:['Bonjour, mon enfant ! Le portail ne s’ouvre que pour ceux qui savent compter.','Réponds à mes trois questions et je te laisse entrer.'],
  outro:'Bravo ! Le portail est ouvert. Entre dans l’école et va voir la maîtresse.'},
 ilunga:{sc:'classe',x:-3,z:-3.6,ry:0,name:'Professeure Ilunga',short:'la maîtresse',role:'Maîtresse',kind:'quiz',sujet:'francais',nb:3,needs:'lola',
  look:{s:'f',h:.98,skin:'#5a3623',c:'#8e44ad',k:'boubou',co:'tresses'},
  intro:['Bienvenue à LEXARIS ACADÉMIE !','Aujourd’hui, la mission porte sur la langue. Trois questions pour commencer.'],
  outro:'Très bien ! Va t’asseoir près de Junior, il t’attend pour la géographie.'},
 junior:{sc:'classe',x:2.6,z:-0.1,ry:Math.PI,name:'Junior',short:'Junior',role:'Élève',kind:'quiz',sujet:'geo',nb:2,needs:'ilunga',sit:true,
  look:{s:'h',h:.74,skin:'#7a4a2e',c:'#16a085',k:'uniforme',co:'courtes'},
  intro:['Salut ! La géographie, c’est mon sujet préféré.'],
  outro:'Bien joué ! Va voir le directeur, il veut te poser les dernières questions.'},
 mavungu:{sc:'classe',x:5.6,z:-3.4,ry:0,name:'Directeur Mavungu',short:'le directeur',role:'Directeur',kind:'quiz',sujet:'histoire',nb:2,needs:'junior',
  look:{s:'h',h:1.04,skin:'#4f3020',c:'#2c3e50',k:'uniforme',co:'courtes',cravate:true},
  intro:['Tu as bien travaillé.','Deux dernières questions pour finir la mission.'],
  outro:'Mission accomplie ! Tu gagnes 20 pièces et du tissu wax pour ta maison.'},
 bea:{sc:'galerie',x:3,z:-6.6,ry:0,name:'Maman Béa',short:'Maman Béa',role:'Marchande',kind:'shop',
  look:{s:'f',h:.97,skin:'#744630',c:'#c0392b',k:'pagne',co:'nattes'}},
 mama:{sc:'maison',x:1.0,z:-2.2,ry:0,name:'Maman',short:'Maman',role:'À la maison',kind:'talk',
  look:{s:'f',h:.97,skin:'#6b4028',c:'#d35400',k:'pagne',co:'tresses'}}
};
export const AUTOP={
 jer:{sc:'ville',x:11,z:3.2,ry:-1.2,name:'Jérémie',look:{s:'h',h:.9,skin:'#6b4028',c:'#27ae60',k:'uniforme',co:'courtes'}},
 kasa:{sc:'ville',x:12.6,z:4.6,ry:-1.9,name:'Petit Kasa',look:{s:'f',h:.72,skin:'#8a5634',c:'#e0a526',k:'pagne',co:'nattes'}}
};
export const AUTO=[['Jérémie','La mission commence bientôt, tu viens ?'],['Petit Kasa','Mama Lola garde le portail, elle pose des questions !'],['Jérémie','Réponds bien et tu entreras dans la classe.'],['Petit Kasa','Moi, je connais déjà toutes les mangues !'],['Jérémie','Le manguier du village donne les meilleures mangues.']];
export const ITEMS={
 natte:{n:'Natte tressée',p:10},table:{n:'Table en bois',p:25},lampe:{n:'Lampe',p:20},
 rideau:{n:'Rideau en wax',p:10,t:1},tableau:{n:'Tableau du village',p:30},plante:{n:'Plante verte',p:15}
};

// Chantiers de la maison : se paient en pièces et en matériaux récoltés dans les mini-jeux (clés de RESS)
export const CHANTIERS=[
 {k:'murs',n:'Murs en briques',ico:'🧱',cout:{pieces:20,brique:12,sable:4},req:[],d:'Remplace les murs en terre par de solides murs en briques, dehors comme dedans.'},
 {k:'toit',n:'Toit en tôle',ico:'🏠',cout:{pieces:20,fer:8,bois:4},req:['murs'],d:'Un toit en tôle qui ne fuit pas à la saison des pluies.'},
 {k:'chambre',n:'Une chambre en plus',ico:'🛏️',cout:{pieces:30,brique:15,bois:6,ciment:3},req:['murs'],d:'Une nouvelle pièce avec deux lits et une armoire, côté est de la maison.'},
 {k:'cuisine',n:'Une vraie cuisine',ico:'🍲',cout:{pieces:30,brique:15,fer:4,sable:5},req:['murs'],d:'Un foyer, une table et des marmites, côté ouest de la maison.'},
 {k:'jardin',n:'Jardin fleuri',ico:'🌺',cout:{pieces:15,plante:8,bois:6},req:[],d:'Des pots de fleurs devant la maison.'},
 {k:'solaire',n:'Panneaux solaires',ico:'☀️',cout:{pieces:50,cuivre:6,fer:6},req:['toit'],d:'De la lumière électrique dans toutes les pièces.'},
 {k:'etage',n:'Un étage',ico:'🏢',cout:{pieces:60,brique:30,ciment:10,bois:10,fer:6},req:['chambre','toit'],d:'Un étage complet avec escalier, deux lits, bureau et bibliothèque.'}
];

// ---------- Créateur de personnage ----------
export const SKIN_TONES=['#c58b62','#b07a50','#9a6641','#7a4a2e','#63391f','#4f3020','#3d2416','#d9a67c'];
export const HAIR_COLORS=['#140d09','#2e1a10','#5a3319','#8a3a1c','#c79a3b','#7a7a7a','#d9d9d9','#7b2a6e'];
export const EYE_COLORS=['#120a06','#3b2212','#2f4a3a','#2a4a6e'];
export const LIP_COLORS=['#7a3a30','#a8483c','#c0566a','#4a2a24'];
export const OUTFIT_COLORS=['#1f7a4d','#2e86de','#c0392b','#e67e22','#8e44ad','#16a085','#e0a526','#2c3e50','#d6336c','#f1f1f1'];

// own : disponible dès le départ ; unlock : cadeau d'une quête ; price : à acheter chez Maman Béa
export const HAIRS={
 courtes:{n:'Courts',own:true},rase:{n:'Rasé',own:true},tresses:{n:'Tresses',own:true},nattes:{n:'Nattes',own:true},afro:{n:'Afro',own:true},
 chignon:{n:'Chignon',unlock:'lola'},noeuds:{n:'Nœuds bantous',price:25},locks:{n:'Locks',price:30}
};
export const ACCS={
 boucles:{n:'Boucles d’oreilles',own:true},
 lunettes:{n:'Lunettes',unlock:'ilunga'},casquette:{n:'Casquette',unlock:'junior'},
 foulard:{n:'Foulard',price:20},collier:{n:'Collier de perles',price:15},sac:{n:'Sac à dos',price:25}
};
export const OUTFITS={
 uniforme:{n:'Uniforme de l’école',own:true,top:'plain',bottom:'auto',trouser:'#262a3a',collar:true},
 polo:{n:'Polo et jean',price:35,top:'plain',bottom:'trousers',trouser:'#2f4a7a',collar:true},
 sport:{n:'Tenue de sport',price:40,top:'plain',bottom:'trousers',trouser:'#233044',collar:false,matchTrouser:true},
 robe:{n:'Robe de fête',price:70,top:'plain',bottom:'skirt',belt:true},
 pagne:{n:'Tenue wax',unlock:'mavungu',top:'wax',bottom:'auto',trouser:'#262a3a'},
 boubou:{n:'Boubou brodé',price:60,top:'plain',bottom:'long',trim:true}
};
export const DEFAULT_LOOK={s:'f',skin:3,faceW:.5,jaw:.4,eyeS:.5,eyeC:1,brow:0,nose:.5,lips:.5,lipC:0,hair:'tresses',hairC:0,beard:0,acc:[],outfit:'uniforme',outfitC:0,blush:.3};
// récompenses automatiques selon les quêtes / le niveau
export const LEVEL_UNLOCKS={4:{outfits:['sport']}};

// ---------- Niveaux supplémentaires (3D) ----------
Object.assign(NPC,{
 esther:{sc:'marche',x:-6,z:-6.2,ry:0,name:'Maman Esther',short:'Maman Esther',role:'Vendeuse de légumes',kind:'quiz',sujet:'marche',nb:3,needs:'mavungu',
  look:{s:'f',h:.97,skin:'#b17869',c:'#e0a526',k:'pagne',co:'tresses',faceKey:'avatars/f2'},
  intro:['Bienvenue au Grand Marché de Kinshasa !','Ici, il faut savoir compter vite pour bien vendre et bien acheter. Trois petits calculs pour commencer.'],
  outro:'Bravo ! Tu sais compter comme une vraie commerçante. Va voir Papa Tshala, il vend des fruits.'},
 tshala:{sc:'marche',x:8,z:-5.4,ry:0,name:'Papa Tshala',short:'Papa Tshala',role:'Marchand de fruits',kind:'quiz',sujet:'nutrition',nb:3,needs:'esther',
  look:{s:'h',h:1,skin:'#955342',c:'#2e86de',k:'uniforme',co:'courtes',faceKey:'avatars/h2'},
  intro:['Mes mangues, mes oranges, mes bananes… tout est frais !','Dis-moi ce que tu sais sur l’alimentation et la santé.'],
  outro:'Excellent ! Tu manges intelligemment. Va maintenant au bord du fleuve voir Tonton Mbo.'},
 mbo:{sc:'fleuve',x:2.5,z:-1.4,ry:-1.5,name:'Tonton Mbo',short:'Tonton Mbo',role:'Pêcheur',kind:'quiz',sujet:'fleuve',nb:3,needs:'tshala',
  look:{s:'h',h:1,skin:'#a7766b',c:'#c0392b',k:'uniforme',co:'courtes',faceKey:'avatars/h4'},
  intro:['Bonjour ! Je pêche ici depuis que je suis petit.','Le fleuve Congo est immense et plein de secrets. Que sais-tu de lui ?'],
  outro:'Bravo ! Tu connais bien notre fleuve. Parle aussi à Madame Kitoko, elle protège la nature.'},
 kitoko:{sc:'fleuve',x:-8,z:1.8,ry:.6,name:'Madame Kitoko',short:'Madame Kitoko',role:'Protectrice de la nature',kind:'quiz',sujet:'environnement',nb:3,needs:'mbo',
  look:{s:'f',h:.97,skin:'#6b4028',c:'#16a085',k:'pagne',co:'nattes',faceKey:'portraits/mama'},
  intro:['La nature est notre trésor : l’eau, les arbres, les animaux.','Voyons si tu sais comment la protéger.'],
  outro:'Merci de protéger la nature ! Direction le centre de santé, on a besoin de toi là-bas.'},
 mukendi:{sc:'sante',x:-4,z:-3.4,ry:.2,name:'Infirmière Mukendi',short:'l’infirmière',role:'Infirmière',kind:'quiz',sujet:'sante',nb:3,needs:'kitoko',
  look:{s:'f',h:.97,skin:'#bb7253',c:'#f2f2f2',k:'uniforme',co:'chignon',faceKey:'avatars/f3'},
  intro:['Bonjour ! Bienvenue au centre de santé.','Bien se soigner, c’est d’abord bien se protéger. Trois questions de santé.'],
  outro:'Très bien ! Tu as de bons réflexes de santé. Le Docteur Kabongo veut te parler.'},
 kabongo:{sc:'sante',x:5,z:-2.4,ry:-.3,name:'Docteur Kabongo',short:'le docteur',role:'Médecin',kind:'quiz',sujet:'corps',nb:3,needs:'mukendi',
  look:{s:'h',h:1.02,skin:'#c38a7e',c:'#f2f2f2',k:'uniforme',co:'courtes',faceKey:'avatars/h1'},
  intro:['Bonjour ! Je suis médecin.','Ton corps est une machine extraordinaire. Voyons ce que tu en sais.'],
  outro:'Bravo ! Tu connais bien ton corps. Il te reste un dernier lieu : l’université.'},
 ngoy:{sc:'univ',x:-5,z:-6.4,ry:.3,name:'Professeur Ngoy',short:'le professeur',role:'Professeur de droit',kind:'quiz',sujet:'droit',nb:3,needs:'kabongo',
  look:{s:'h',h:1.03,skin:'#79493b',c:'#2c3e50',k:'uniforme',co:'rase',cravate:true,faceKey:'avatars/h3'},
  intro:['Bienvenue à l’université !','Le droit, c’est l’ensemble des règles qui permettent de vivre ensemble. Voyons ce que tu en sais.'],
  outro:'Excellent ! Maître Lukusa t’attend pour la dernière épreuve : les droits de l’enfant.'},
 lukusa:{sc:'univ',x:6,z:-6.2,ry:-.3,name:'Maître Lukusa',short:'Maître Lukusa',role:'Avocate',kind:'quiz',sujet:'droits_enfant',nb:3,needs:'ngoy',
  look:{s:'f',h:.98,skin:'#cd8e71',c:'#2c3e50',k:'uniforme',co:'tresses',faceKey:'avatars/f4'},
  intro:['Bonjour ! Je défends les droits des personnes devant la justice.','Les enfants aussi ont des droits. Les connais-tu ?'],
  outro:'Félicitations ! Tu as réussi tous les niveaux. Tu es un vrai citoyen !'}
});
export const STAGES=[
 {id:'ville',scene:'ville',name:'Quartier et école',icon:'🏫',npcs:['lola','ilunga','junior','mavungu']},
 {id:'marche',scene:'marche',name:'Le Grand Marché',icon:'🛒',npcs:['esther','tshala']},
 {id:'fleuve',scene:'fleuve',name:'Le fleuve Congo',icon:'🌊',npcs:['mbo','kitoko']},
 {id:'sante',scene:'sante',name:'Le centre de santé',icon:'🏥',npcs:['mukendi','kabongo']},
 {id:'univ',scene:'univ',name:'L’université',icon:'🎓',npcs:['ngoy','lukusa']}
];

Object.assign(BANK,{
 lecture:[
  Q('Quel est le verbe dans la phrase : « Les enfants lisent un livre » ?',['enfants','lisent','livre','les'],'lisent','« lisent » exprime l’action : c’est le verbe.'),
  Q('Quel est le pluriel de « journal » ?',['journals','journaux','journales','journalx'],'journaux','Les noms en -al font leur pluriel en -aux.'),
  Q('Comment écrit-on correctement ?',['ecole','école','éecole','écolle'],'école','On écrit « école » avec un accent aigu sur le premier é.'),
  Q('Quel signe termine une question ?',['le point','le point d’interrogation','la virgule','les guillemets'],'le point d’interrogation','Une question se termine par un point d’interrogation.'),
  Q('Un livre qui raconte la vie d’une personne s’appelle une…',['biographie','géographie','chanson','recette'],'biographie','Une biographie raconte la vie de quelqu’un.'),
  Q('Quel est le contraire de « grand » ?',['petit','long','large','haut'],'petit','Le contraire de « grand » est « petit ».')
 ],
 contes:[
  Q('Complète le proverbe : « Petit à petit, l’oiseau fait son… »',['nid','pain','chemin','bruit'],'nid','Petit à petit, l’oiseau fait son nid : avec de la patience, on réussit.'),
  Q('Que veut dire « Qui sème le vent récolte la tempête » ?',['nos mauvaises actions ont des conséquences','il faut planter des arbres','il faut aimer le vent','il pleut toujours'],'nos mauvaises actions ont des conséquences','Ce proverbe dit que les mauvaises actions reviennent contre leur auteur.'),
  Q('Comment commence souvent un conte ?',['Il était une fois…','Voici la météo…','Achetez vite…','Attention, danger !'],'Il était une fois…','Beaucoup de contes commencent par « Il était une fois… ».'),
  Q('Complète le proverbe africain : « Seul on va plus vite, ensemble on va… »',['moins loin','plus loin','nulle part','en arrière'],'plus loin','Ensemble, on va plus loin : l’union fait la force.'),
  Q('Quel mot est un synonyme de « courageux » ?',['brave','lent','triste','petit'],'brave','« Brave » a le même sens que « courageux ».')
 ],
 route:[
  Q('Que signifie un feu rouge ?',['s’arrêter','accélérer','klaxonner','reculer'],'s’arrêter','Au feu rouge, tout le monde s’arrête.'),
  Q('Où traverse-t-on la rue en sécurité ?',['n’importe où','sur le passage pour piétons','entre deux voitures','en courant au milieu'],'sur le passage pour piétons','On traverse sur le passage pour piétons, après avoir regardé.'),
  Q('Que faut-il faire avant de traverser ?',['regarder à gauche et à droite','fermer les yeux','courir très vite','téléphoner'],'regarder à gauche et à droite','On regarde des deux côtés pour vérifier qu’aucun véhicule n’arrive.'),
  Q('Que faut-il attacher en voiture ?',['la ceinture de sécurité','ses lacets','le coffre','la radio'],'la ceinture de sécurité','La ceinture de sécurité sauve des vies.'),
  Q('Que doit porter le conducteur d’une moto ?',['un casque','un chapeau de paille','un foulard','rien du tout'],'un casque','Le casque protège la tête en cas de chute.')
 ],
 transport:[
  Q('Un bus roule 60 km en 1 heure. Combien de kilomètres fait-il en 2 heures ?',['90 km','100 km','120 km','180 km'],'120 km','60 × 2 = 120 km.'),
  Q('Le trajet dure 45 minutes. On part à 8 h. À quelle heure arrive-t-on ?',['8 h 15','8 h 45','9 h 15','9 h 45'],'8 h 45','8 h + 45 minutes = 8 h 45.'),
  Q('Un billet coûte 500 FC. Combien coûtent 4 billets ?',['1 500 FC','2 000 FC','2 500 FC','4 000 FC'],'2 000 FC','4 × 500 = 2 000 FC.'),
  Q('Un bus transporte 40 passagers. 12 descendent. Combien en reste-t-il ?',['26','28','30','52'],'28','40 − 12 = 28 passagers.'),
  Q('Il y a 5 bus de 30 places chacun. Combien de places en tout ?',['120','150','180','35'],'150','5 × 30 = 150 places.')
 ],
 agriculture:[
  Q('De quelle plante tire-t-on les racines dont on fait le foufou ?',['le manioc','le café','le cacao','le palmier'],'le manioc','Le foufou se fait avec la farine de manioc.'),
  Q('Les feuilles de quelle plante prépare-t-on le « pondu » ?',['le manioc','le bananier','le manguier','l’avocatier'],'le manioc','Le pondu se prépare avec des feuilles de manioc pilées.'),
  Q('Pourquoi arrose-t-on les plantes ?',['elles ont besoin d’eau pour vivre','pour les rendre bleues','pour les faire taire','pour les déplacer'],'elles ont besoin d’eau pour vivre','Comme nous, les plantes ont besoin d’eau.'),
  Q('Quel animal de la ferme nous donne du lait ?',['la vache','la poule','le canard','le cheval de course'],'la vache','La vache donne du lait.'),
  Q('Que nous donne la poule ?',['des œufs','du lait','de la laine','du miel'],'des œufs','La poule pond des œufs.')
 ],
 saisons:[
  Q('Quelle plante donne le café ?',['le caféier','le manguier','le bananier','le palmier'],'le caféier','Le grain de café vient du caféier.'),
  Q('La RDC est traversée par quelle ligne imaginaire ?',['l’équateur','le méridien de Paris','le pôle Nord','l’écliptique'],'l’équateur','L’équateur traverse la RDC.'),
  Q('Quelles sont les deux grandes saisons dans une grande partie de la RDC ?',['la saison des pluies et la saison sèche','l’hiver et l’été','le printemps et l’automne','la neige et le verglas'],'la saison des pluies et la saison sèche','Le climat tropical alterne saison des pluies et saison sèche.'),
  Q('Pourquoi ajoute-t-on du compost dans un champ ?',['pour enrichir le sol','pour faire fuir la pluie','pour éclairer','pour faire du bruit'],'pour enrichir le sol','Le compost nourrit la terre.'),
  Q('Un champ rectangulaire mesure 20 m sur 10 m. Quelle est sa surface ?',['30 m²','60 m²','200 m²','2 000 m²'],'200 m²','20 × 10 = 200 m².')
 ],
 foret:[
  Q('Quelle forêt est la deuxième plus grande forêt tropicale du monde ?',['la forêt du bassin du Congo','la forêt de Fontainebleau','la forêt noire','la forêt boréale'],'la forêt du bassin du Congo','Après l’Amazonie, c’est la plus grande forêt tropicale du monde.'),
  Q('Pourquoi la forêt est-elle importante ?',['elle produit de l’oxygène et abrite des animaux','elle fait du bruit','elle rend le ciel noir','elle ne sert à rien'],'elle produit de l’oxygène et abrite des animaux','Les forêts nous donnent de l’oxygène et abritent de nombreux animaux.'),
  Q('Comment appelle-t-on la forêt chaude, très humide et toujours verte près de l’équateur ?',['la forêt équatoriale','la forêt de pins','la savane','le désert'],'la forêt équatoriale','C’est la forêt équatoriale.'),
  Q('Quel parc national de RDC est célèbre pour ses gorilles de montagne ?',['le parc des Virunga','le parc Kruger','le Serengeti','le parc de Yellowstone'],'le parc des Virunga','Le parc national des Virunga abrite des gorilles de montagne.'),
  Q('Que ne faut-il jamais faire dans une forêt ?',['allumer un feu sans surveillance','marcher doucement','observer les oiseaux','ramasser ses déchets'],'allumer un feu sans surveillance','Un feu mal surveillé peut détruire toute la forêt.')
 ],
 animaux:[
  Q('Quel animal rayé, cousin de la girafe, ne vit qu’en RDC ?',['l’okapi','le zèbre','le tigre','le tapir'],'l’okapi','L’okapi vit uniquement dans les forêts de RDC.'),
  Q('Quel singe proche de l’homme ne vit à l’état sauvage qu’en RDC ?',['le bonobo','le babouin','le macaque','le ouistiti'],'le bonobo','Le bonobo vit seulement en RDC, au sud du fleuve Congo.'),
  Q('Un animal qui ne mange que des plantes est…',['herbivore','carnivore','insectivore','piscivore'],'herbivore','Un herbivore se nourrit de plantes.'),
  Q('Un animal qui mange de la viande est…',['carnivore','herbivore','végétarien','végétal'],'carnivore','Un carnivore mange de la viande.'),
  Q('Quel est le plus grand animal terrestre ?',['l’éléphant','la girafe','le lion','le rhinocéros blanc'],'l’éléphant','L’éléphant d’Afrique est le plus grand animal terrestre.')
 ],
 culture:[
  Q('Quelle musique née au Congo fait danser toute l’Afrique ?',['la rumba congolaise','le tango','la valse','le flamenco'],'la rumba congolaise','La rumba congolaise est célèbre dans toute l’Afrique.'),
  Q('Quelle langue nationale est très parlée à Kinshasa ?',['le lingala','le japonais','le russe','le hindi'],'le lingala','Le lingala est très parlé à Kinshasa.'),
  Q('Quelle est la langue officielle de la RDC ?',['le français','l’anglais','le portugais','l’arabe'],'le français','Le français est la langue officielle de la RDC.'),
  Q('Combien de langues nationales la RDC compte-t-elle ?',['quatre','une','dix','cent'],'quatre','Le kikongo, le lingala, le swahili et le tshiluba sont les quatre langues nationales.'),
  Q('À quoi servaient souvent les masques traditionnels africains ?',['aux cérémonies, pour représenter des esprits ou des ancêtres','à jouer au football','à cuisiner','à voyager'],'aux cérémonies, pour représenter des esprits ou des ancêtres','Ils servaient surtout lors de cérémonies traditionnelles.')
 ],
 histoire2:[
  Q('Quel artiste a chanté « Indépendance Cha Cha » en 1960 ?',['Grand Kallé','Michael Jackson','Bob Marley','Elvis Presley'],'Grand Kallé','Grand Kallé et l’African Jazz ont chanté « Indépendance Cha Cha ».'),
  Q('Comment s’appelle l’hymne national de la RDC ?',['Debout Congolais','La Marseillaise','Brabançonne','God Save the King'],'Debout Congolais','L’hymne national de la RDC est « Debout Congolais ».'),
  Q('Quel pays a colonisé le Congo avant 1960 ?',['la Belgique','la Chine','le Japon','le Brésil'],'la Belgique','Le Congo était une colonie belge avant son indépendance en 1960.'),
  Q('Comment s’appelait le pays entre 1971 et 1997 ?',['le Zaïre','le Gabon','le Rwanda','le Mali'],'le Zaïre','De 1971 à 1997, le pays s’appelait le Zaïre.'),
  Q('Quelle est la couleur de fond du drapeau de la RDC ?',['bleu ciel','vert','noir','blanc'],'bleu ciel','Le drapeau est bleu ciel avec une bande rouge et une étoile jaune.')
 ],
 sport:[
  Q('Combien de joueurs une équipe de football aligne-t-elle sur le terrain ?',['9','11','13','15'],'11','Une équipe de football compte 11 joueurs sur le terrain.'),
  Q('Quel est le surnom de l’équipe nationale de football de la RDC ?',['les Léopards','les Lions','les Aigles','les Éléphants'],'les Léopards','L’équipe de RDC s’appelle « les Léopards ».'),
  Q('Que signifie le fair-play ?',['respecter les règles et l’adversaire','gagner à tout prix','tricher discrètement','insulter l’arbitre'],'respecter les règles et l’adversaire','Le fair-play, c’est jouer honnêtement et respecter les autres.'),
  Q('Combien de temps dure un match de football (sans arrêts de jeu) ?',['45 minutes','60 minutes','90 minutes','120 minutes'],'90 minutes','Deux mi-temps de 45 minutes : 90 minutes.'),
  Q('Pourquoi faut-il s’échauffer avant de faire du sport ?',['pour préparer son corps et éviter les blessures','pour se fatiguer','pour dormir','pour manger'],'pour préparer son corps et éviter les blessures','L’échauffement prépare les muscles.')
 ],
 footmaths:[
  Q('Une équipe marque 3 buts en première mi-temps et 2 en seconde. Combien en tout ?',['4','5','6','7'],'5','3 + 2 = 5 buts.'),
  Q('Le match commence à 15 h et dure 1 h 30. À quelle heure finit-il ?',['16 h','16 h 30','17 h','17 h 30'],'16 h 30','15 h + 1 h 30 = 16 h 30.'),
  Q('Chaque équipe a 11 joueurs. Combien de joueurs sur le terrain pour les deux équipes ?',['11','20','22','24'],'22','2 × 11 = 22 joueurs.'),
  Q('Un billet coûte 2 000 FC. Combien coûtent 5 billets ?',['8 000 FC','10 000 FC','12 000 FC','7 000 FC'],'10 000 FC','5 × 2 000 = 10 000 FC.'),
  Q('Une victoire rapporte 3 points. Combien de points pour 4 victoires ?',['7','9','12','16'],'12','4 × 3 = 12 points.')
 ],
 mines:[
  Q('Quel métal la RDC produit-elle en grande quantité, surtout au Katanga ?',['le cuivre','l’argent','le fer-blanc','le zinc seulement'],'le cuivre','La RDC est un grand producteur de cuivre, surtout au Katanga.'),
  Q('Quel minerai, utilisé dans les batteries, la RDC possède-t-elle en grande quantité ?',['le cobalt','le sel','le charbon de bois','le sable'],'le cobalt','La RDC possède une grande partie du cobalt du monde.'),
  Q('Dans quelle province se trouve la ville de Lubumbashi ?',['le Haut-Katanga','le Kongo-Central','le Nord-Kivu','l’Ituri'],'le Haut-Katanga','Lubumbashi est la capitale du Haut-Katanga.'),
  Q('Comment s’appelle la science qui étudie les roches ?',['la géologie','la géographie','la biologie','l’astronomie'],'la géologie','La géologie étudie la Terre et les roches.'),
  Q('Dans quelle région de RDC se trouvent les célèbres mines de cuivre ?',['le Katanga','le Maniema','le Kasaï central','l’Équateur'],'le Katanga','Le Katanga est riche en cuivre et en cobalt.')
 ],
 minesec:[
  Q('Quel équipement protège la tête dans une mine ?',['le casque','la casquette','le bonnet','le chapeau'],'le casque','Le casque protège contre les chutes de pierres.'),
  Q('Pourquoi les enfants ne doivent-ils pas travailler dans les mines ?',['c’est dangereux et ils doivent aller à l’école','c’est trop propre','c’est trop silencieux','c’est interdit aux adultes'],'c’est dangereux et ils doivent aller à l’école','Le travail dans les mines est dangereux : les enfants ont le droit d’aller à l’école.'),
  Q('Comment protéger l’environnement autour d’une mine ?',['éviter de polluer l’eau et replanter des arbres','jeter les déchets dans la rivière','abattre toute la forêt','laisser les produits couler'],'éviter de polluer l’eau et replanter des arbres','Il faut protéger l’eau et replanter après les travaux.'),
  Q('Un camion transporte 20 tonnes de minerai. Combien de tonnes en 3 voyages ?',['40','50','60','80'],'60','3 × 20 = 60 tonnes.')
 ],
 espace:[
  Q('Quelle étoile éclaire la Terre le jour ?',['le Soleil','la Lune','Mars','Vénus'],'le Soleil','Le Soleil est l’étoile qui nous éclaire.'),
  Q('Combien y a-t-il de planètes dans le système solaire ?',['6','8','10','12'],'8','Le système solaire compte huit planètes.'),
  Q('Quelle planète est la plus proche du Soleil ?',['Mercure','Mars','Jupiter','Neptune'],'Mercure','Mercure est la planète la plus proche du Soleil.'),
  Q('Autour de quoi la Terre tourne-t-elle ?',['le Soleil','la Lune','Mars','Saturne'],'le Soleil','La Terre tourne autour du Soleil en un an.'),
  Q('Quel astre tourne autour de la Terre ?',['la Lune','le Soleil','Jupiter','Pluton'],'la Lune','La Lune est le satellite naturel de la Terre.')
 ],
 sciences:[
  Q('À quelle température l’eau bout-elle (au niveau de la mer) ?',['50 °C','80 °C','100 °C','200 °C'],'100 °C','L’eau bout à 100 °C.'),
  Q('Quel gaz respirons-nous pour vivre ?',['l’oxygène','le gaz carbonique seulement','l’hélium','l’azote pur'],'l’oxygène','Nous avons besoin d’oxygène pour vivre.'),
  Q('Que devient l’eau quand elle gèle ?',['de la glace','de la vapeur','du sable','de l’huile'],'de la glace','L’eau qui gèle devient de la glace.'),
  Q('Quelle force nous attire vers le sol ?',['la gravité','le vent','le magnétisme seulement','le bruit'],'la gravité','La gravité attire les objets vers le sol.'),
  Q('Qu’est-ce qui produit la lumière du jour ?',['le Soleil','la Lune','les nuages','les étoiles filantes'],'le Soleil','La lumière du jour vient du Soleil.')
 ],
 port:[
  Q('Quel est le principal port maritime de la RDC ?',['Matadi','Kisangani','Goma','Mbuji-Mayi'],'Matadi','Matadi est le principal port maritime de la RDC.'),
  Q('Sur quel fleuve se trouve Matadi ?',['le fleuve Congo','le Nil','le Niger','le Zambèze'],'le fleuve Congo','Matadi est située sur le fleuve Congo.'),
  Q('Qu’est-ce qu’un conteneur ?',['une grande caisse métallique pour transporter des marchandises','un petit bateau','une grue','un sac de riz'],'une grande caisse métallique pour transporter des marchandises','Les conteneurs transportent des marchandises par bateau, train ou camion.'),
  Q('Comment appelle-t-on les produits vendus à l’étranger ?',['les exportations','les importations','les cadeaux','les déchets'],'les exportations','Exporter, c’est vendre à l’étranger.'),
  Q('Comment appelle-t-on les produits achetés à l’étranger ?',['les importations','les exportations','les récoltes','les souvenirs'],'les importations','Importer, c’est acheter à l’étranger.')
 ],
 argent:[
  Q('Quelle est la monnaie de la RDC ?',['le franc congolais','le dinar','la roupie','le yen'],'le franc congolais','La monnaie de la RDC est le franc congolais.'),
  Q('Un article coûte 8 000 FC avec une réduction de 1 000 FC. Quel est le prix final ?',['6 000 FC','7 000 FC','8 000 FC','9 000 FC'],'7 000 FC','8 000 − 1 000 = 7 000 FC.'),
  Q('Tu as 10 000 FC et tu dépenses 3 500 FC. Combien te reste-t-il ?',['5 500 FC','6 500 FC','7 500 FC','13 500 FC'],'6 500 FC','10 000 − 3 500 = 6 500 FC.'),
  Q('À quoi sert une banque ?',['à garder l’argent en sécurité','à vendre des légumes','à soigner les malades','à construire des routes'],'à garder l’argent en sécurité','Une banque garde l’argent en sécurité.'),
  Q('Qu’est-ce qu’économiser ?',['mettre de l’argent de côté','tout dépenser tout de suite','perdre son argent','prêter sans réfléchir'],'mettre de l’argent de côté','Économiser, c’est garder de l’argent pour plus tard.')
 ],
 institutions:[
  Q('Quelles sont les deux chambres du Parlement de la RDC ?',['l’Assemblée nationale et le Sénat','le Sénat et la Cour d’appel','le Tribunal et la Mairie','l’École et l’Hôpital'],'l’Assemblée nationale et le Sénat','Le Parlement est formé de l’Assemblée nationale et du Sénat.'),
  Q('Combien de provinces compte la RDC ?',['11','15','26','30'],'26','La RDC compte 26 provinces.'),
  Q('Qui dirige une province ?',['le gouverneur','le professeur','le pêcheur','le chef de gare'],'le gouverneur','Une province est dirigée par un gouverneur.'),
  Q('Quelle est la durée d’un mandat du Président de la République en RDC ?',['5 ans','2 ans','10 ans','1 an'],'5 ans','Le mandat présidentiel dure 5 ans, renouvelable une fois.'),
  Q('Quelle est la capitale de la RDC ?',['Kinshasa','Goma','Kisangani','Matadi'],'Kinshasa','Kinshasa est la capitale de la RDC.')
 ],
 civisme:[
  Q('Quel est un devoir du citoyen ?',['respecter les lois','ignorer les règles','jeter ses déchets partout','désobéir toujours'],'respecter les lois','Respecter les lois est un devoir de chaque citoyen.'),
  Q('Comment garder son quartier propre ?',['en jetant ses déchets à la poubelle','en les laissant dans la rue','en les jetant au caniveau','en les brûlant devant les maisons'],'en jetant ses déchets à la poubelle','On jette les déchets à la poubelle.'),
  Q('Pourquoi faut-il respecter les autres ?',['pour vivre ensemble en paix','pour avoir des cadeaux','par obligation de la télévision','pour devenir roi'],'pour vivre ensemble en paix','Le respect permet de vivre ensemble en paix.'),
  Q('Que veut dire « vivre en paix » ?',['vivre ensemble sans violence','faire du bruit','se disputer','se cacher'],'vivre ensemble sans violence','La paix, c’est vivre ensemble sans violence.'),
  Q('Quelle est la date de la fête nationale de l’indépendance ?',['30 juin','1er janvier','25 décembre','14 juillet'],'30 juin','La RDC fête son indépendance le 30 juin.')
 ]
});
Object.assign(SUJETS,{lecture:'Lecture',contes:'Contes et proverbes',route:'Sécurité routière',transport:'Calcul : les transports',agriculture:'Agriculture',saisons:'Cultures et saisons',foret:'La forêt équatoriale',animaux:'Les animaux',culture:'Culture congolaise',histoire2:'Histoire et musique',sport:'Le sport',footmaths:'Calcul : le football',mines:'Les richesses du sous-sol',minesec:'Sécurité et environnement',espace:'L’espace',sciences:'Sciences',port:'Le port',argent:'L’argent',institutions:'Les institutions',civisme:'Civisme'});

Object.assign(NPC,{
 nzuzi:{sc:'biblio',x:-5,z:-3.8,ry:0.3,name:'Madame Nzuzi',short:'Madame Nzuzi',role:'Bibliothécaire',kind:'quiz',sujet:'lecture',nb:3,needs:'lukusa',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#8e44ad',k:'boubou',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['Bienvenue à la LEXOTHÈQUE RDC !','Ici, chaque livre est une porte ouverte sur le monde. Quelques questions de français pour commencer.'],
  outro:'Bravo ! Tu lis déjà comme un vrai champion. Va écouter les histoires de Papa Kabasele.'},
 kabasele:{sc:'biblio',x:8.5,z:-6.2,ry:-0.4,name:'Papa Kabasele',short:'Papa Kabasele',role:'Conteur',kind:'quiz',sujet:'contes',nb:3,needs:'nzuzi',
  look:{s:'h',h:1.02,skin:'#916f64',c:'#c0392b',k:'uniforme',co:'rase',faceKey:'portraits/mavungu'},
  intro:['Viens, assieds-toi sous le grand arbre.','Les anciens disent que les proverbes sont la sagesse des peuples. Voyons ce que tu en as retenu.'],
  outro:'Quelle sagesse ! Tu es prêt pour la route : direction la gare.'},
 mayala:{sc:'gare',x:-3.6,z:-1.4,ry:0.5,name:'Agent Mayala',short:'l’agent Mayala',role:'Agent de la circulation',kind:'quiz',sujet:'route',nb:3,needs:'kabasele',
  look:{s:'h',h:1,skin:'#a7766b',c:'#2e5f9e',k:'uniforme',co:'courtes',faceKey:'avatars/h2'},
  intro:['Attention, on traverse avec prudence !','La route peut être dangereuse si on ne connaît pas les règles. Trois questions de sécurité.'],
  outro:'Parfait ! Tu connais les règles. Va voir Chauffeur Bokasa, près du bus.'},
 bokasa:{sc:'gare',x:2.5,z:-5.4,ry:-0.5,name:'Chauffeur Bokasa',short:'Chauffeur Bokasa',role:'Chauffeur de bus',kind:'quiz',sujet:'transport',nb:3,needs:'mayala',
  look:{s:'h',h:1.04,skin:'#a7766b',c:'#e0a526',k:'uniforme',co:'courtes',faceKey:'avatars/h4'},
  intro:['Bonjour ! Mon bus fait Kinshasa – Matadi tous les jours.','Un bon chauffeur sait bien calculer le temps, la distance et les prix.'],
  outro:'Excellent ! En route pour la campagne : la ferme de Mama Mwamba.'},
 mwamba:{sc:'ferme',x:-6,z:.2,ry:0.3,name:'Mama Mwamba',short:'Mama Mwamba',role:'Agricultrice',kind:'quiz',sujet:'agriculture',nb:3,needs:'bokasa',
  look:{s:'f',h:0.97,skin:'#895430',c:'#e67e22',k:'pagne',co:'nattes',faceKey:'portraits/bea'},
  intro:['Bonjour ! Bienvenue dans mes champs de manioc.','La terre nous nourrit. Voyons si tu sais d’où vient ce que tu manges.'],
  outro:'Bravo ! Maintenant, l’agronome Lutumba va te parler des cultures et des saisons.'},
 lutumba:{sc:'ferme',x:9.5,z:.5,ry:-0.4,name:'Agronome Lutumba',short:'l’agronome',role:'Agronome',kind:'quiz',sujet:'saisons',nb:3,needs:'mwamba',
  look:{s:'h',h:1.02,skin:'#79493b',c:'#27ae60',k:'uniforme',co:'courtes',faceKey:'avatars/h3'},
  intro:['Je suis agronome : j’aide les paysans à mieux cultiver.','Le climat, les saisons, la terre : tout compte pour une bonne récolte.'],
  outro:'Très bien ! Tu as l’esprit d’un agronome. Direction la grande forêt !'},
 mutombo:{sc:'foret',x:-4,z:-3,ry:0.3,name:'Garde Mutombo',short:'le garde',role:'Garde-forestier',kind:'quiz',sujet:'foret',nb:3,needs:'lutumba',
  look:{s:'h',h:1.03,skin:'#c38a7e',c:'#4a6b3a',k:'uniforme',co:'courtes',faceKey:'avatars/h1'},
  intro:['Chut… écoute : la forêt est vivante.','Je protège ces arbres et les animaux qui y vivent. Que sais-tu de la forêt du Congo ?'],
  outro:'Bravo ! Tu peux devenir un protecteur de la forêt. Madame Bisimwa t’attend pour parler des animaux.'},
 bisimwa:{sc:'foret',x:6,z:-3.8,ry:-0.4,name:'Madame Bisimwa',short:'Madame Bisimwa',role:'Biologiste',kind:'quiz',sujet:'animaux',nb:3,needs:'mutombo',
  look:{s:'f',h:0.97,skin:'#b17869',c:'#f2f2f2',k:'uniforme',co:'chignon',faceKey:'avatars/f2'},
  intro:['Bonjour ! Je suis biologiste, j’étudie les animaux.','La RDC abrite des animaux qu’on ne trouve nulle part ailleurs. Teste tes connaissances !'],
  outro:'Magnifique ! Tu connais bien nos animaux. Le musée t’attend maintenant.'},
 tshibola:{sc:'musee',x:-5,z:-4.8,ry:0.3,name:'Madame Tshibola',short:'Madame Tshibola',role:'Conservatrice du musée',kind:'quiz',sujet:'culture',nb:3,needs:'bisimwa',
  look:{s:'f',h:0.96,skin:'#6b4028',c:'#d35400',k:'boubou',co:'gris',faceKey:'portraits/lola'},
  intro:['Bienvenue au musée ! Ici, on garde la mémoire de notre peuple.','Masques, musique, langues : la culture congolaise est riche. Trois questions.'],
  outro:'Bravo ! Maintenant Monsieur Kitenge va te raconter l’histoire.'},
 kitenge:{sc:'musee',x:6,z:-4.6,ry:-0.3,name:'Monsieur Kitenge',short:'Monsieur Kitenge',role:'Guide du musée',kind:'quiz',sujet:'histoire2',nb:3,needs:'tshibola',
  look:{s:'h',h:1.02,skin:'#a7766b',c:'#2c3e50',k:'uniforme',co:'courtes',faceKey:'avatars/h4',cravate:true},
  intro:['Je suis le guide : je raconte l’histoire de notre pays.','Des chansons de l’indépendance à l’hymne national, que sais-tu ?'],
  outro:'Excellent ! Tu connais bien l’histoire. Allons au stade, il y a un match !'},
 mbemba:{sc:'stade',x:-4,z:-2,ry:0.4,name:'Entraîneur Mbemba',short:'l’entraîneur',role:'Entraîneur de football',kind:'quiz',sujet:'sport',nb:3,needs:'kitenge',
  look:{s:'h',h:1.04,skin:'#79493b',c:'#c0392b',k:'uniforme',co:'courtes',faceKey:'avatars/h3'},
  intro:['Bienvenue au stade ! Aujourd’hui, grand match de quartier.','Le sport, c’est la santé et l’amitié. Voyons ce que tu sais.'],
  outro:'Bravo ! Tu as l’esprit d’équipe. L’arbitre Kalala a des calculs pour toi.'},
 kalala:{sc:'stade',x:6,z:-2.8,ry:-0.4,name:'Arbitre Kalala',short:'l’arbitre',role:'Arbitre',kind:'quiz',sujet:'footmaths',nb:3,needs:'mbemba',
  look:{s:'h',h:1,skin:'#955342',c:'#222222',k:'uniforme',co:'rase',faceKey:'avatars/h2'},
  intro:['Je suis l’arbitre : je compte les buts et le temps.','Un bon arbitre sait calculer vite. À toi de jouer !'],
  outro:'Parfait ! Tu comptes comme un champion. Prochain lieu : la mine de cuivre.'},
 kasongo:{sc:'mine',x:-5,z:-3,ry:0.3,name:'Géologue Kasongo',short:'la géologue',role:'Géologue',kind:'quiz',sujet:'mines',nb:3,needs:'kalala',
  look:{s:'f',h:0.97,skin:'#cd8e71',c:'#e67e22',k:'uniforme',co:'tresses',faceKey:'avatars/f4'},
  intro:['Bienvenue à la mine ! Casque sur la tête, ici on fait attention.','Le sous-sol de la RDC cache de grandes richesses. Que sais-tu d’elles ?'],
  outro:'Très bien ! L’ingénieur Mwenze va te parler de sécurité.'},
 mwenze:{sc:'mine',x:4.5,z:-5,ry:-0.4,name:'Ingénieur Mwenze',short:'l’ingénieur',role:'Ingénieur des mines',kind:'quiz',sujet:'minesec',nb:3,needs:'kasongo',
  look:{s:'h',h:1.03,skin:'#c38a7e',c:'#e0a526',k:'uniforme',co:'courtes',faceKey:'avatars/h1'},
  intro:['Je suis ingénieur : je veille à la sécurité de tous.','Protéger les personnes et la nature, c’est le plus important.'],
  outro:'Bravo ! La sécurité d’abord. Prochaine étape : l’observatoire, regarder les étoiles.'},
 mulumba:{sc:'observatoire',x:-4,z:-4.2,ry:0.3,name:'Docteur Mulumba',short:'le docteur Mulumba',role:'Astronome',kind:'quiz',sujet:'espace',nb:3,needs:'mwenze',
  look:{s:'h',h:1.02,skin:'#916f64',c:'#2c3e50',k:'uniforme',co:'gris',faceKey:'portraits/mavungu'},
  intro:['Bonsoir ! Le ciel de ce soir est magnifique.','L’espace est immense. Voyons ce que tu sais du Soleil, de la Lune et des planètes.'],
  outro:'Bravo ! Tu as l’âme d’un astronome. Mademoiselle Mbuyi t’attend pour les sciences.'},
 mbuyi:{sc:'observatoire',x:6,z:-3.4,ry:-0.4,name:'Assistante Mbuyi',short:'Mademoiselle Mbuyi',role:'Assistante scientifique',kind:'quiz',sujet:'sciences',nb:3,needs:'mulumba',
  look:{s:'f',h:0.97,skin:'#bb7253',c:'#f2f2f2',k:'uniforme',co:'tresses',faceKey:'avatars/f3'},
  intro:['Je suis scientifique : j’aime comprendre comment marche le monde.','Eau, air, lumière, gravité : testons tes connaissances.'],
  outro:'Excellent ! Tu es un petit scientifique. Direction le port de Matadi.'},
 lunda:{sc:'port',x:-5,z:-3,ry:0.3,name:'Capitaine Lunda',short:'le capitaine',role:'Capitaine de port',kind:'quiz',sujet:'port',nb:3,needs:'mbuyi',
  look:{s:'h',h:1.03,skin:'#a7766b',c:'#f2f2f2',k:'uniforme',co:'courtes',faceKey:'avatars/h4',cravate:true},
  intro:['Bienvenue au port de Matadi ! Les bateaux arrivent du monde entier.','Ici, on charge et on décharge des tonnes de marchandises.'],
  outro:'Très bien ! Madame Ndala va te parler d’argent.'},
 ndala:{sc:'port',x:6,z:-4,ry:-0.4,name:'Madame Ndala',short:'Madame Ndala',role:'Comptable',kind:'quiz',sujet:'argent',nb:3,needs:'lunda',
  look:{s:'f',h:0.97,skin:'#b17869',c:'#2c3e50',k:'uniforme',co:'nattes',faceKey:'avatars/f2'},
  intro:['Je suis comptable : je m’occupe de l’argent du port.','Bien gérer son argent, c’est apprendre à compter et à économiser.'],
  outro:'Bravo ! Il te reste une dernière étape : le Parlement, à Kinshasa.'},
 mbala:{sc:'parlement',x:-5,z:-6.2,ry:0.3,name:'Honorable Mbala',short:'l’Honorable Mbala',role:'Député',kind:'quiz',sujet:'institutions',nb:3,needs:'ndala',
  look:{s:'h',h:1.02,skin:'#79493b',c:'#1c2a44',k:'uniforme',co:'courtes',faceKey:'avatars/h3',cravate:true},
  intro:['Bienvenue au Parlement ! Ici se votent les lois du pays.','Un bon citoyen connaît le fonctionnement de ses institutions.'],
  outro:'Excellent ! Va saluer la sénatrice Nkulu.'},
 nkulu:{sc:'parlement',x:6,z:-6,ry:-0.4,name:'Sénatrice Nkulu',short:'la sénatrice',role:'Sénatrice',kind:'quiz',sujet:'civisme',nb:3,needs:'mbala',
  look:{s:'f',h:0.98,skin:'#7a4a2e',c:'#8e44ad',k:'boubou',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['Bienvenue au Parlement !','Être citoyen, c’est respecter les autres et participer à la vie du pays.'],
  outro:'Bravo ! Le voyage continue : prends l’avion à l’aéroport de N’Djili.'},
});
STAGES.push(
 {id:'biblio',scene:'biblio',name:'LEXOTHÈQUE RDC',icon:'📚',npcs:['nzuzi','kabasele']},
 {id:'gare',scene:'gare',name:'La gare routière',icon:'🚌',npcs:['mayala','bokasa']},
 {id:'ferme',scene:'ferme',name:'La ferme',icon:'🌽',npcs:['mwamba','lutumba']},
 {id:'foret',scene:'foret',name:'La forêt équatoriale',icon:'🌳',npcs:['mutombo','bisimwa']},
 {id:'musee',scene:'musee',name:'Le musée',icon:'🏛',npcs:['tshibola','kitenge']},
 {id:'stade',scene:'stade',name:'Le stade',icon:'⚽',npcs:['mbemba','kalala']},
 {id:'mine',scene:'mine',name:'La mine de cuivre',icon:'⛏',npcs:['kasongo','mwenze']},
 {id:'observatoire',scene:'observatoire',name:'L’observatoire',icon:'🔭',npcs:['mulumba','mbuyi']},
 {id:'port',scene:'port',name:'Le port de Matadi',icon:'🚢',npcs:['lunda','ndala']},
 {id:'parlement',scene:'parlement',name:'Le Parlement',icon:'🏛',npcs:['mbala','nkulu']}
);

// ---------- Épisodes 16 à 20 ----------
Object.assign(SUJETS,{aeroport:'L’aéroport',voyage:'Voyager et se repérer',energie:'L’énergie et l’électricité',eau:'L’eau et le fleuve',virunga:'Le parc des Virunga',volcans:'Volcans et gorilles',cascade:'Chutes et orientation',securite_eau:'Sécurité près de l’eau',artisanat:'L’artisanat congolais',metiers:'Les métiers et le calcul'});
Object.assign(BANK,{
 aeroport:[
  Q('Comment s’appelle le grand aéroport international de Kinshasa ?',['N’Djili','Luano','Bangboka','Kavumu'],'N’Djili','L’aéroport international de N’Djili est celui de Kinshasa.'),
  Q('Quel document faut-il pour voyager dans un autre pays ?',['un passeport','un cahier','un ballon','une assiette'],'un passeport','Le passeport prouve qui tu es quand tu voyages à l’étranger.'),
  Q('Qui guide les avions depuis la tour de l’aéroport ?',['le contrôleur aérien','le boulanger','le pêcheur','le coiffeur'],'le contrôleur aérien','Le contrôleur aérien dit aux pilotes quand décoller et atterrir.'),
  Q('Que faut-il faire à bord pendant le décollage ?',['attacher sa ceinture','courir dans l’avion','ouvrir la porte','dormir par terre'],'attacher sa ceinture','La ceinture te protège pendant le décollage et l’atterrissage.'),
  Q('Un avion parcourt 600 km en 1 heure. Combien de kilomètres en 3 heures ?',['1 800 km','900 km','1 200 km','2 400 km'],'1 800 km','600 × 3 = 1 800 km.')
 ],
 voyage:[
  Q('Un vol part à 14 h et dure 2 heures. À quelle heure arrive-t-il ?',['16 h','15 h','17 h','12 h'],'16 h','14 h + 2 h = 16 h.'),
  Q('Sur quel continent se trouve la RDC ?',['l’Afrique','l’Europe','l’Asie','l’Amérique'],'l’Afrique','La RDC est au cœur de l’Afrique.'),
  Q('Quel océan borde l’ouest de la RDC et de l’Afrique centrale ?',['l’océan Atlantique','l’océan Indien','l’océan Arctique','l’océan Pacifique'],'l’océan Atlantique','La RDC touche l’océan Atlantique par une petite côte.'),
  Q('Combien de pays voisins la RDC a-t-elle ?',['9','3','5','12'],'9','La RDC est entourée de 9 pays voisins.'),
  Q('Quelle est la capitale de la France ?',['Paris','Londres','Rome','Madrid'],'Paris','La capitale de la France est Paris.')
 ],
 energie:[
  Q('Que produit un barrage hydroélectrique ?',['de l’électricité','du pain','du sel','des livres'],'de l’électricité','L’eau fait tourner des turbines qui produisent de l’électricité.'),
  Q('Sur quel fleuve se trouve le barrage d’Inga ?',['le fleuve Congo','le Nil','le Niger','la Seine'],'le fleuve Congo','Inga est construit sur le fleuve Congo, dans le Kongo Central.'),
  Q('Quelle énergie vient du soleil ?',['l’énergie solaire','l’énergie du charbon','l’énergie du pétrole','l’énergie du bois mort'],'l’énergie solaire','Les panneaux solaires transforment la lumière en électricité.'),
  Q('Comment économiser l’électricité ?',['éteindre les lampes inutiles','laisser tout allumé','ouvrir le frigo longtemps','brancher dix appareils'],'éteindre les lampes inutiles','Éteindre ce qu’on n’utilise pas économise de l’énergie.'),
  Q('Que faut-il éviter de toucher ?',['les fils électriques dénudés','un cahier','un ballon','une chaise'],'les fils électriques dénudés','Un fil électrique abîmé est dangereux : préviens un adulte.')
 ],
 eau:[
  Q('Comment s’appelle le passage de l’eau de la mer vers le ciel sous forme de vapeur ?',['l’évaporation','la fabrication','le labour','la récolte'],'l’évaporation','Le soleil chauffe l’eau, qui monte en vapeur : c’est l’évaporation.'),
  Q('Que devient la vapeur d’eau dans les nuages ?',['des gouttes qui forment la pluie','du sable','du fer','du feu'],'des gouttes qui forment la pluie','La vapeur refroidit et forme des gouttes : la pluie.'),
  Q('Comment rendre une eau plus sûre à boire ?',['la faire bouillir ou la filtrer','la boire telle quelle','y mettre du sable','la salir'],'la faire bouillir ou la filtrer','Bouillir ou filtrer l’eau élimine beaucoup de microbes.'),
  Q('Le fleuve Congo est connu comme…',['le fleuve le plus profond du monde','un petit ruisseau','un désert','une montagne'],'le fleuve le plus profond du monde','Le Congo est le fleuve le plus profond connu, et l’un des plus puissants.'),
  Q('Pourquoi ne faut-il pas gaspiller l’eau ?',['parce qu’elle est précieuse','parce qu’elle est rare partout','par plaisir','par habitude'],'parce qu’elle est précieuse','L’eau propre est indispensable à la vie : on la protège.')
 ],
 virunga:[
  Q('Quel animal rare vit dans le parc des Virunga ?',['le gorille de montagne','le pingouin','l’ours polaire','le kangourou'],'le gorille de montagne','Les gorilles de montagne vivent dans les Virunga.'),
  Q('Qui protège les animaux dans les parcs nationaux ?',['les rangers (gardes)','les cuisiniers','les chauffeurs','les coiffeurs'],'les rangers (gardes)','Les rangers surveillent la nature et protègent les animaux.'),
  Q('Pourquoi protéger la nature ?',['pour les générations futures','pour la détruire plus vite','pour rien','pour faire du bruit'],'pour les générations futures','Protéger la nature, c’est préserver la vie pour demain.'),
  Q('Que ne faut-il pas faire dans un parc ?',['jeter des déchets','observer en silence','suivre le guide','rester sur le sentier'],'jeter des déchets','On garde le parc propre et on respecte les animaux.'),
  Q('Les Virunga sont un parc…',['national','privé','de jeux','de voitures'],'national','Les Virunga sont le plus ancien parc national d’Afrique.')
 ],
 volcans:[
  Q('Comment s’appelle la roche en fusion qui sort d’un volcan ?',['la lave','la glace','le sable','la boue'],'la lave','La lave est de la roche fondue très chaude.'),
  Q('Nyiragongo est…',['un volcan','un fleuve','un village','un animal'],'un volcan','Nyiragongo est un volcan actif près de Goma.'),
  Q('Quel grand lac se trouve près de Goma ?',['le lac Kivu','le lac Victoria','le lac Tchad','le lac Léman'],'le lac Kivu','Goma est au bord du lac Kivu.'),
  Q('Que mange surtout le gorille ?',['des plantes et des feuilles','de la viande crue','du poisson','des cailloux'],'des plantes et des feuilles','Le gorille est surtout herbivore.'),
  Q('Que faire si un volcan se réveille ?',['suivre les consignes d’évacuation','s’approcher pour regarder','se baigner','dormir'],'suivre les consignes d’évacuation','En cas d’alerte, on s’éloigne et on écoute les autorités.')
 ],
 cascade:[
  Q('Où se lève le soleil ?',['à l’est','à l’ouest','au nord','au sud'],'à l’est','Le soleil se lève à l’est et se couche à l’ouest.'),
  Q('Avec quel objet s’oriente-t-on dans la nature ?',['une boussole','une cuillère','un cahier','un ballon'],'une boussole','L’aiguille de la boussole indique le nord.'),
  Q('Comment appelle-t-on l’eau qui tombe d’une falaise ?',['une chute','un désert','une dune','un puits'],'une chute','Une chute (ou cascade) est de l’eau qui tombe de haut.'),
  Q('Où se couche le soleil ?',['à l’ouest','à l’est','au nord','au sud'],'à l’ouest','Le soleil se couche à l’ouest.'),
  Q('Quelle direction est opposée au nord ?',['le sud','l’est','l’ouest','le haut'],'le sud','Le sud est le contraire du nord.')
 ],
 securite_eau:[
  Q('Peut-on se baigner juste au pied d’une chute ?',['non, c’est dangereux','oui, toujours','oui, la nuit','oui, avec des chaussures'],'non, c’est dangereux','Le courant et les rochers rendent le pied d’une chute dangereux.'),
  Q('Si quelqu’un tombe à l’eau, que fais-tu ?',['j’appelle à l’aide et je lance une bouée','je pars en courant sans rien dire','je saute sans réfléchir','je ris'],'j’appelle à l’aide et je lance une bouée','Il faut alerter les adultes et lancer un objet qui flotte.'),
  Q('Que faut-il savoir faire avant de nager au fleuve ?',['nager avec un adulte','plonger seul','nager de nuit','porter des bottes'],'nager avec un adulte','On ne se baigne jamais seul.'),
  Q('Sur des rochers mouillés, on doit…',['marcher lentement','courir','sauter','danser'],'marcher lentement','Les rochers mouillés glissent : on avance doucement.'),
  Q('Que veut dire un panneau « Danger » près de l’eau ?',['il ne faut pas s’approcher','c’est une décoration','c’est un jeu','c’est pour les poissons'],'il ne faut pas s’approcher','Un panneau « Danger » doit toujours être respecté.')
 ],
 artisanat:[
  Q('Les Kuba sont célèbres pour leurs tissus en…',['raphia','plastique','fer','verre'],'raphia','Les Kuba tissent de beaux tissus de raphia.'),
  Q('Quel outil sert à sculpter le bois ?',['un ciseau à bois','une cuillère','un stylo','une éponge'],'un ciseau à bois','Le sculpteur utilise un ciseau et un maillet.'),
  Q('Le wax est…',['un tissu coloré','un métal','une pierre','un fruit'],'un tissu coloré','Le pagne en wax est très apprécié en Afrique centrale.'),
  Q('Avec quoi fait-on une poterie ?',['de l’argile','du vent','de l’eau seule','du sel'],'de l’argile','Le potier modèle l’argile puis la cuit.'),
  Q('Pourquoi garder l’art de nos ancêtres ?',['c’est notre culture et notre mémoire','c’est inutile','c’est obligatoire','c’est ennuyeux'],'c’est notre culture et notre mémoire','L’artisanat transmet l’histoire et l’identité d’un peuple.')
 ],
 metiers:[
  Q('Quel artisan coud les vêtements ?',['le tailleur','le forgeron','le pêcheur','le menuisier'],'le tailleur','Le tailleur ou la couturière coud les habits.'),
  Q('Quel artisan travaille le bois pour faire des meubles ?',['le menuisier','le potier','le tisserand','le boulanger'],'le menuisier','Le menuisier fabrique tables et chaises.'),
  Q('Trois pagnes coûtent 4 000 FC chacun. Quel est le total ?',['12 000 FC','7 000 FC','8 000 FC','10 000 FC'],'12 000 FC','3 × 4 000 = 12 000 FC.'),
  Q('Je vends 5 paniers à 2 500 FC. Combien je reçois ?',['12 500 FC','10 000 FC','7 500 FC','15 000 FC'],'12 500 FC','5 × 2 500 = 12 500 FC.'),
  Q('Quel artisan travaille le fer ?',['le forgeron','le tailleur','le potier','le coiffeur'],'le forgeron','Le forgeron chauffe et forge le fer.')
 ]
});
Object.assign(NPC,{
 ndombe:{sc:'aeroport',x:-5,z:-5.5,ry:0.3,name:'Capitaine Ndombe',short:'le capitaine',role:'Pilote',kind:'quiz',sujet:'aeroport',nb:3,needs:'nkulu',
  look:{s:'h',h:1.03,skin:'#6e4a36',c:'#1f3a6b',k:'uniforme',co:'rase',faceKey:'avatars/h3'},
  intro:['Bienvenue à l’aéroport de N’Djili !','Je suis pilote : voler, c’est ma passion. Es-tu prêt pour le décollage ?'],
  outro:'Bien joué ! Va voir Madame Nsimba, au comptoir des voyages.'},
 nsimba:{sc:'aeroport',x:5.5,z:-5.5,ry:-0.4,name:'Madame Nsimba',short:'Madame Nsimba',role:'Agente d’escale',kind:'quiz',sujet:'voyage',nb:3,needs:'ndombe',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#c0392b',k:'uniforme',co:'chignon',faceKey:'avatars/f3'},
  intro:['Bonjour ! Je m’occupe des départs et des arrivées.','Pour voyager, il faut savoir lire l’heure et se repérer sur la carte.'],
  outro:'Parfait ! Direction le barrage d’Inga, l’ingénieur Kimbembe t’attend.'},
 kimbembe:{sc:'inga',x:-5,z:-5.5,ry:0.3,name:'Ingénieur Kimbembe',short:'l’ingénieur',role:'Ingénieur électricien',kind:'quiz',sujet:'energie',nb:3,needs:'nsimba',
  look:{s:'h',h:1.02,skin:'#7d5a44',c:'#e0a526',k:'uniforme',co:'courtes',faceKey:'avatars/h4'},
  intro:['Voici le barrage d’Inga, l’une des grandes fiertés du Congo.','Ici, la force de l’eau devient de la lumière. Tu veux comprendre comment ?'],
  outro:'Très bien ! Ma collègue Madame Zola te parlera de l’eau.'},
 zola:{sc:'inga',x:5.5,z:-5.5,ry:-0.4,name:'Madame Zola',short:'Madame Zola',role:'Hydrologue',kind:'quiz',sujet:'eau',nb:3,needs:'kimbembe',
  look:{s:'f',h:0.97,skin:'#8a5a3e',c:'#2e86de',k:'uniforme',co:'tresses',faceKey:'avatars/f2'},
  intro:['Moi, j’étudie l’eau et les fleuves.','Le fleuve Congo est l’un des plus puissants du monde. Voyons ce que tu sais !'],
  outro:'Bravo ! Le garde Bahati t’attend dans le parc des Virunga.'},
 bahati:{sc:'virunga',x:-5,z:-5.5,ry:0.3,name:'Garde Bahati',short:'le garde',role:'Ranger',kind:'quiz',sujet:'virunga',nb:3,needs:'zola',
  look:{s:'h',h:1.02,skin:'#6e4a36',c:'#3f5a2a',k:'uniforme',co:'rase',faceKey:'avatars/h1'},
  intro:['Chut… bienvenue dans le parc des Virunga.','Je protège les gorilles de montagne. Veux-tu apprendre à les respecter ?'],
  outro:'Très bien ! La volcanologue Neema va t’expliquer les volcans.'},
 neema:{sc:'virunga',x:5.5,z:-5.5,ry:-0.4,name:'Docteure Neema',short:'la volcanologue',role:'Volcanologue',kind:'quiz',sujet:'volcans',nb:3,needs:'bahati',
  look:{s:'f',h:0.98,skin:'#7a4a2e',c:'#c0392b',k:'uniforme',co:'nattes',faceKey:'avatars/f4'},
  intro:['Regarde ces volcans, ils sont puissants et dangereux.','Mon métier : les surveiller pour protéger les habitants.'],
  outro:'Excellent ! Direction les chutes de Zongo.'},
 tuyindi:{sc:'zongo',x:-5,z:-5.5,ry:0.3,name:'Guide Tuyindi',short:'le guide',role:'Guide touristique',kind:'quiz',sujet:'cascade',nb:3,needs:'neema',
  look:{s:'h',h:1.0,skin:'#916f64',c:'#e67e22',k:'pagne',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Bienvenue aux chutes de Zongo !','Écoute le grondement de l’eau. Pour bien guider, il faut savoir s’orienter.'],
  outro:'Bravo ! La sauveteuse Mfumu va te parler de sécurité.'},
 mfumu:{sc:'zongo',x:5.5,z:-5.5,ry:-0.4,name:'Sauveteuse Mfumu',short:'la sauveteuse',role:'Sauveteuse',kind:'quiz',sujet:'securite_eau',nb:3,needs:'tuyindi',
  look:{s:'f',h:0.98,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['L’eau est belle mais elle peut être dangereuse.','Ma mission : éviter les accidents. Et toi, connais-tu les bons réflexes ?'],
  outro:'Parfait ! Va découvrir l’atelier des artisans.'},
 kuba:{sc:'atelier',x:-5,z:-5.5,ry:0.3,name:'Maître Kuba',short:'Maître Kuba',role:'Sculpteur',kind:'quiz',sujet:'artisanat',nb:3,needs:'mfumu',
  look:{s:'h',h:1.0,skin:'#7d5a44',c:'#8e5a2a',k:'pagne',co:'gris',faceKey:'avatars/h2'},
  intro:['Entre dans mon atelier, jeune ami.','Le bois, le raphia, l’argile… nos mains racontent l’histoire du Congo.'],
  outro:'Très bien ! Ma voisine Mama Tisse va te parler des métiers.'},
 tisse:{sc:'atelier',x:5.5,z:-5.5,ry:-0.4,name:'Mama Tisse',short:'Mama Tisse',role:'Tisserande',kind:'quiz',sujet:'metiers',nb:3,needs:'kuba',
  look:{s:'f',h:0.96,skin:'#8a5a3e',c:'#8e44ad',k:'pagne',co:'chignon',faceKey:'portraits/mama'},
  intro:['Bienvenue ! Ici on tisse, on coud, on forge, on vend.','Un bon artisan sait aussi compter. Montre-moi !'],
  outro:'Parfait ! Le voyage continue : direction la pêche de Kisangani.'}
});
STAGES.push(
 {id:'aeroport',scene:'aeroport',name:'L’aéroport',icon:'✈️',npcs:['ndombe','nsimba']},
 {id:'inga',scene:'inga',name:'Le barrage d’Inga',icon:'💡',npcs:['kimbembe','zola']},
 {id:'virunga',scene:'virunga',name:'Parc des Virunga',icon:'🦍',npcs:['bahati','neema']},
 {id:'zongo',scene:'zongo',name:'Les chutes de Zongo',icon:'🌊',npcs:['tuyindi','mfumu']},
 {id:'atelier',scene:'atelier',name:'L’atelier des artisans',icon:'🎨',npcs:['kuba','tisse']}
);

// ---------- Épisodes 21 à 30 ----------
Object.assign(SUJETS,{wagenia:'Les pêcheurs Wagenia',poissons:'Pêche et calcul',savane:'La savane',chaine:'Qui mange quoi ?',tanganyika:'Le lac Tanganyika',lacvie:'La vie dans l’eau',sciences2:'Sciences : expériences',meteo:'Météo et énergie',rumba:'La rumba congolaise',musique:'Les instruments',incendie:'Prévenir l’incendie',secours:'Les secours',poste:'La poste',epargne:'Épargner son argent',recyclage:'Trier et recycler',arbres:'Les arbres et le climat',numerique:'L’informatique',internet:'Internet en sécurité',independance:'L’indépendance',symboles:'Les symboles du pays'});
Object.assign(BANK,{
 wagenia:[
  Q('Comment s’appellent les pêcheurs célèbres de Kisangani ?',['les Wagenia','les Kuba','les Luba','les Tetela'],'les Wagenia','Les Wagenia pêchent depuis des siècles près des chutes de Kisangani.'),
  Q('Dans quelle ville se trouvent les chutes Wagenia (Boyoma) ?',['Kisangani','Matadi','Lubumbashi','Goma'],'Kisangani','Les chutes Boyoma sont à Kisangani, sur le fleuve Congo.'),
  Q('Avec quoi les Wagenia pêchent-ils surtout ?',['des nasses en bois installées dans les rapides','des avions','des moteurs','des bombes'],'des nasses en bois installées dans les rapides','Leurs grandes nasses coniques attrapent les poissons dans le courant.'),
  Q('Pourquoi cette pêche est-elle un savoir précieux ?',['il se transmet de père en fils','il vient d’Internet','il est récent','il est interdit'],'il se transmet de père en fils','Ce savoir-faire traditionnel passe d’une génération à l’autre.'),
  Q('Que faut-il faire pour ne pas épuiser les poissons ?',['pêcher raisonnablement','tout prendre d’un coup','pêcher avec du poison','jeter les filets'],'pêcher raisonnablement','On laisse le temps aux poissons de se reproduire.')
 ],
 poissons:[
  Q('Un pêcheur prend 12 poissons le matin et 15 l’après-midi. Combien en tout ?',['27','25','30','17'],'27','12 + 15 = 27.'),
  Q('Il vend 4 poissons à 1 500 FC pièce. Combien reçoit-il ?',['6 000 FC','4 500 FC','5 000 FC','7 500 FC'],'6 000 FC','4 × 1 500 = 6 000 FC.'),
  Q('Comment les poissons respirent-ils ?',['avec des branchies','avec des poumons','avec le nez','avec la queue'],'avec des branchies','Les branchies prennent l’oxygène dans l’eau.'),
  Q('On partage 20 poissons entre 4 familles. Combien chacune ?',['5','4','6','10'],'5','20 ÷ 4 = 5.'),
  Q('Comment conserver du poisson sans frigo ?',['le fumer ou le sécher','le laisser au soleil sans rien','le poser par terre','le mouiller'],'le fumer ou le sécher','Fumer ou sécher le poisson permet de le garder plus longtemps.')
 ],
 savane:[
  Q('Quel est le plus grand animal terrestre ?',['l’éléphant','la girafe','le lion','le buffle'],'l’éléphant','L’éléphant d’Afrique est le plus grand animal terrestre.'),
  Q('Quel animal a un très long cou ?',['la girafe','le zèbre','le singe','le crocodile'],'la girafe','La girafe mange les feuilles des hauts arbres.'),
  Q('Comment appelle-t-on un grand espace d’herbes hautes avec peu d’arbres ?',['une savane','un désert de glace','un océan','une montagne'],'une savane','La savane est couverte d’herbe et de quelques arbres.'),
  Q('Quel arbre en forme de parasol pousse dans la savane ?',['l’acacia','le sapin','le palmier à huile','le cerisier'],'l’acacia','L’acacia a une cime plate qui fait de l’ombre.'),
  Q('Pourquoi faut-il rester à distance des animaux sauvages ?',['ils peuvent être dangereux','ils s’ennuient','ils aiment les cris','ils vendent des billets'],'ils peuvent être dangereux','On observe les animaux de loin, avec un guide.')
 ],
 chaine:[
  Q('Que mange un herbivore ?',['des plantes','de la viande','des cailloux','du sable'],'des plantes','Les herbivores se nourrissent de plantes.'),
  Q('Quel animal est un carnivore ?',['le lion','la girafe','l’éléphant','le zèbre'],'le lion','Le lion mange de la viande.'),
  Q('Comment appelle-t-on un animal qui mange de tout ?',['un omnivore','un herbivore','un carnivore','un végétarien'],'un omnivore','L’homme est un omnivore : il mange plantes et viande.'),
  Q('Qu’est-ce qu’une chaîne alimentaire ?',['qui mange qui dans la nature','une chaîne de vélo','une chaîne de télé','un collier'],'qui mange qui dans la nature','Herbe → zèbre → lion : c’est une chaîne alimentaire.'),
  Q('Que se passe-t-il si on chasse trop d’animaux ?',['l’équilibre de la nature est rompu','rien du tout','il y a plus de pluie','la savane grandit'],'l’équilibre de la nature est rompu','Chaque animal a un rôle : il faut les protéger.')
 ],
 tanganyika:[
  Q('Le lac Tanganyika est le plus long lac d’eau douce…',['du monde','de France','d’Europe','d’Asie'],'du monde','Le Tanganyika mesure environ 670 km de long.'),
  Q('Quel pays n’est PAS au bord du lac Tanganyika ?',['le Kenya','la RDC','la Tanzanie','la Zambie'],'le Kenya','Le lac borde la RDC, la Tanzanie, le Burundi et la Zambie.'),
  Q('Quelle ville congolaise est au bord du lac Tanganyika ?',['Kalemie','Kinshasa','Kisangani','Matadi'],'Kalemie','Kalemie est un port important sur le lac.'),
  Q('Un lac d’eau douce contient de l’eau…',['non salée','très salée','sucrée','gelée'],'non salée','L’eau douce n’est pas salée, contrairement à la mer.'),
  Q('Que transportent les bateaux du lac ?',['des personnes et des marchandises','des avions','des trains','des montagnes'],'des personnes et des marchandises','Le lac est une route de transport pour toute la région.')
 ],
 lacvie:[
  Q('Quel animal vit dans l’eau et respire avec des branchies ?',['le poisson','le chien','la poule','le chat'],'le poisson','Le poisson respire sous l’eau grâce à ses branchies.'),
  Q('Pourquoi ne faut-il pas jeter de plastique dans le lac ?',['il pollue et tue les animaux','il fait du bien','il nourrit les poissons','il décore'],'il pollue et tue les animaux','Les déchets polluent l’eau et blessent la faune.'),
  Q('Comment appelle-t-on un petit bateau en bois creusé dans un tronc ?',['une pirogue','un avion','une voiture','un train'],'une pirogue','La pirogue est le bateau traditionnel des fleuves et lacs.'),
  Q('Un pêcheur navigue 3 heures à 6 km/h. Quelle distance ?',['18 km','9 km','12 km','24 km'],'18 km','6 × 3 = 18 km.'),
  Q('Avant d’embarquer, que doit-on porter ?',['un gilet de sauvetage','un manteau lourd','des bottes en fer','un sac de sable'],'un gilet de sauvetage','Le gilet de sauvetage sauve des vies sur l’eau.')
 ],
 sciences2:[
  Q('À quelle température l’eau bout-elle ?',['100 °C','50 °C','0 °C','10 °C'],'100 °C','L’eau bout à 100 °C.'),
  Q('Que devient l’eau quand elle gèle ?',['de la glace','de la vapeur','du sable','du feu'],'de la glace','L’eau gèle à 0 °C et devient de la glace.'),
  Q('Qu’attire un aimant ?',['le fer','le bois','le verre','le papier'],'le fer','Un aimant attire les objets en fer.'),
  Q('De quoi une plante a-t-elle besoin pour pousser ?',['d’eau, de lumière et d’air','de bruit','de plastique','de sucre'],'d’eau, de lumière et d’air','Une plante fabrique sa nourriture grâce à la lumière.'),
  Q('Autour de quoi la Terre tourne-t-elle ?',['le Soleil','la Lune','Mars','une étoile filante'],'le Soleil','La Terre fait le tour du Soleil en un an.')
 ],
 meteo:[
  Q('Quel instrument mesure la quantité de pluie ?',['un pluviomètre','une boussole','une règle','une balance'],'un pluviomètre','Le pluviomètre recueille la pluie pour la mesurer.'),
  Q('Que produit une éolienne ?',['de l’électricité grâce au vent','de la pluie','de la neige','du pain'],'de l’électricité grâce au vent','Le vent fait tourner les pales et produit du courant.'),
  Q('Que produit un panneau solaire ?',['de l’électricité grâce au soleil','du vent','de l’eau','de la glace'],'de l’électricité grâce au soleil','Le panneau solaire transforme la lumière en électricité.'),
  Q('Quand voit-on un arc-en-ciel ?',['quand il pleut et que le soleil brille','en pleine nuit','quand il neige','sous la terre'],'quand il pleut et que le soleil brille','La lumière du soleil se décompose dans les gouttes de pluie.'),
  Q('Quelle saison est pluvieuse dans une grande partie de la RDC ?',['la saison des pluies','la saison de la neige','la saison du gel','la saison des glaciers'],'la saison des pluies','La RDC connaît une saison des pluies et une saison sèche.')
 ],
 rumba:[
  Q('La rumba congolaise est inscrite au patrimoine de…',['l’UNESCO','la Lune','la FIFA','Internet'],'l’UNESCO','La rumba congolaise a été reconnue par l’UNESCO en 2021.'),
  Q('Quelles deux villes sont liées à la rumba congolaise ?',['Kinshasa et Brazzaville','Paris et Londres','Tokyo et Pékin','Lima et Quito'],'Kinshasa et Brazzaville','La rumba est née de part et d’autre du fleuve Congo.'),
  Q('Quel instrument à cordes est central dans la rumba ?',['la guitare','le piano à queue','le violoncelle','la harpe'],'la guitare','La guitare électrique et acoustique est au cœur de la rumba.'),
  Q('La musique est un moyen de…',['partager la culture et la joie','faire peur','se disputer','fuir'],'partager la culture et la joie','La musique rassemble et transmet la culture.'),
  Q('Comment appelle-t-on un groupe qui joue ensemble ?',['un orchestre','un marché','un hôpital','un atelier'],'un orchestre','Un orchestre ou un groupe réunit plusieurs musiciens.')
 ],
 musique:[
  Q('Combien de cordes a une guitare classique ?',['6','2','10','20'],'6','Une guitare classique a 6 cordes.'),
  Q('Le tambour est un instrument…',['à percussion','à cordes','à vent','électronique'],'à percussion','On frappe un tambour pour le faire sonner.'),
  Q('Quel instrument africain a des lamelles que l’on pince avec les pouces ?',['le likembé','le violon','la trompette','la flûte'],'le likembé','Le likembé est un petit instrument à lamelles métalliques.'),
  Q('Une chanson dure 4 minutes. Combien de secondes ?',['240','120','400','60'],'240','4 × 60 = 240 secondes.'),
  Q('Pour bien jouer ensemble, il faut…',['écouter les autres musiciens','jouer plus fort que tous','arriver en retard','ne pas répéter'],'écouter les autres musiciens','Un bon groupe s’écoute et suit le même rythme.')
 ],
 incendie:[
  Q('Qui éteint les grands incendies ?',['les pompiers','les cuisiniers','les facteurs','les chauffeurs'],'les pompiers','Les pompiers sont formés pour éteindre le feu et secourir.'),
  Q('Avec quel objet éteint-on un petit feu ?',['un extincteur','un ballon','un livre','une chaise'],'un extincteur','L’extincteur sert à éteindre un début d’incendie.'),
  Q('Les enfants doivent-ils jouer avec des allumettes ?',['non, jamais','oui, souvent','oui, la nuit','oui, dehors'],'non, jamais','Les allumettes et les briquets sont dangereux.'),
  Q('S’il y a de la fumée dans une pièce, on…',['se baisse près du sol et sort','se tient debout au milieu','se cache sous le lit','ouvre toutes les portes en courant'],'se baisse près du sol et sort','La fumée monte : l’air est plus sain près du sol.'),
  Q('Que faire en premier si tu vois un feu qui grandit ?',['sortir et prévenir un adulte','le regarder','jeter de l’huile dessus','prendre des photos'],'sortir et prévenir un adulte','Ta sécurité d’abord : on sort et on appelle les secours.')
 ],
 secours:[
  Q('Que fait-on en cas d’accident grave ?',['on appelle les secours','on s’enfuit','on crie sans rien faire','on déplace la victime brusquement'],'on appelle les secours','Appeler vite les secours peut sauver une vie.'),
  Q('Qu’est-ce qu’une trousse de premiers secours ?',['une boîte avec des pansements et du matériel','une boîte à jouets','une valise de vêtements','un sac de riz'],'une boîte avec des pansements et du matériel','On y trouve de quoi soigner une petite blessure.'),
  Q('Comment s’appelle le véhicule qui transporte les blessés ?',['l’ambulance','le taxi-moto','le camion à bétail','le bus scolaire'],'l’ambulance','L’ambulance emmène les blessés à l’hôpital.'),
  Q('Il y a 8 pompiers par camion. Combien de pompiers pour 3 camions ?',['24','11','16','32'],'24','8 × 3 = 24.'),
  Q('Que veut dire « garder son calme » ?',['rester tranquille pour bien agir','paniquer','crier','se cacher'],'rester tranquille pour bien agir','Garder son calme aide à prendre les bonnes décisions.')
 ],
 poste:[
  Q('À quoi sert la poste ?',['envoyer des lettres et des colis','soigner les malades','vendre des légumes','réparer les routes'],'envoyer des lettres et des colis','La poste achemine le courrier.'),
  Q('Que colle-t-on sur une lettre pour l’envoyer ?',['un timbre','un bonbon','un ticket de bus','une photo'],'un timbre','Le timbre paie l’envoi de la lettre.'),
  Q('Que doit-on écrire sur l’enveloppe ?',['l’adresse du destinataire','une recette','une chanson','rien du tout'],'l’adresse du destinataire','Sans adresse, la lettre ne peut pas arriver.'),
  Q('Qui apporte le courrier à la maison ?',['le facteur','le médecin','le pêcheur','le pilote'],'le facteur','Le facteur distribue lettres et colis.'),
  Q('Un colis pèse 3 kg et coûte 2 000 FC par kg. Quel prix ?',['6 000 FC','5 000 FC','3 000 FC','9 000 FC'],'6 000 FC','3 × 2 000 = 6 000 FC.')
 ],
 epargne:[
  Q('Que veut dire « épargner » ?',['mettre de l’argent de côté','dépenser tout de suite','perdre son argent','prêter à n’importe qui'],'mettre de l’argent de côté','Épargner, c’est garder une partie de son argent pour plus tard.'),
  Q('Où garde-t-on son argent en sécurité ?',['dans une banque','dans la rue','sous un arbre','dans un sac ouvert'],'dans une banque','La banque protège et gère l’argent des clients.'),
  Q('Tu mets 500 FC de côté chaque semaine. Combien après 4 semaines ?',['2 000 FC','1 500 FC','2 500 FC','4 000 FC'],'2 000 FC','500 × 4 = 2 000 FC.'),
  Q('Pourquoi épargner ?',['pour réaliser un projet ou faire face à un imprévu','pour perdre son argent','pour impressionner','pour rien'],'pour réaliser un projet ou faire face à un imprévu','L’épargne aide à acheter plus tard ou à traverser une difficulté.'),
  Q('Faut-il donner son code secret à un inconnu ?',['non, jamais','oui, s’il sourit','oui, au marché','oui, par téléphone'],'non, jamais','Le code secret ne se partage avec personne.')
 ],
 recyclage:[
  Q('Que veut dire « recycler » ?',['donner une nouvelle vie aux déchets','brûler les déchets','enterrer le plastique','jeter dans le fleuve'],'donner une nouvelle vie aux déchets','Le recyclage transforme les déchets en nouveaux objets.'),
  Q('Quelles sont les trois règles : réduire, réutiliser et…',['recycler','gaspiller','casser','oublier'],'recycler','Réduire, réutiliser, recycler : les trois gestes verts.'),
  Q('Dans quelle poubelle jette-t-on une bouteille en plastique ?',['celle du plastique','celle des légumes','celle du verre cassé','nulle part'],'celle du plastique','On trie pour que le plastique soit recyclé.'),
  Q('Que devient un épluchage de légumes dans un compost ?',['de l’engrais pour les plantes','du plastique','du métal','du verre'],'de l’engrais pour les plantes','Le compost nourrit la terre.'),
  Q('Pourquoi le plastique est-il dangereux dans la nature ?',['il met très longtemps à disparaître','il est très léger','il est brillant','il sent bon'],'il met très longtemps à disparaître','Le plastique reste des centaines d’années.')
 ],
 arbres:[
  Q('Que produisent les arbres que l’on respire ?',['de l’oxygène','du plastique','de la fumée','du sable'],'de l’oxygène','Les arbres produisent de l’oxygène et absorbent du gaz carbonique.'),
  Q('Que veut dire « reboiser » ?',['replanter des arbres','couper les arbres','brûler la forêt','vendre le bois'],'replanter des arbres','Reboiser aide la nature à se reconstituer.'),
  Q('Pourquoi les arbres protègent-ils le sol ?',['leurs racines le retiennent','ils le mangent','ils le lavent','ils le chauffent'],'leurs racines le retiennent','Les racines évitent que la terre soit emportée par la pluie.'),
  Q('Qu’est-ce que le réchauffement climatique ?',['la hausse des températures sur Terre','une fête','une maladie','un fleuve'],'la hausse des températures sur Terre','Il perturbe les saisons et la nature.'),
  Q('Tu plantes 3 arbres par mois pendant 6 mois. Combien d’arbres ?',['18','9','12','24'],'18','3 × 6 = 18.')
 ],
 numerique:[
  Q('Comment s’appelle l’écran sur lequel on regarde ?',['le moniteur','la souris','le clavier','le câble'],'le moniteur','Le moniteur affiche ce que fait l’ordinateur.'),
  Q('Avec quoi tape-t-on du texte sur un ordinateur ?',['un clavier','une souris','un haut-parleur','une imprimante'],'un clavier','Le clavier sert à écrire.'),
  Q('Quel appareil déplace le curseur à l’écran ?',['la souris','le clavier','l’écran','la prise'],'la souris','La souris pointe et clique.'),
  Q('À quoi sert Internet ?',['chercher des informations et communiquer','laver les vêtements','cuire le riz','construire des routes'],'chercher des informations et communiquer','Internet relie le monde entier.'),
  Q('Que veut dire « sauvegarder » un fichier ?',['en garder une copie en sécurité','le supprimer','le déchirer','le cacher'],'en garder une copie en sécurité','Sauvegarder évite de perdre son travail.')
 ],
 internet:[
  Q('Faut-il partager son mot de passe ?',['non, jamais','oui, avec tous','oui, avec un inconnu','oui, en ligne'],'non, jamais','Un mot de passe est secret.'),
  Q('Un inconnu t’écrit en ligne et veut ton adresse. Que fais-tu ?',['je ne réponds pas et j’en parle à un adulte','je donne mon adresse','je lui envoie des photos','je donne mon code'],'je ne réponds pas et j’en parle à un adulte','On ne donne jamais d’informations privées à un inconnu.'),
  Q('Un lien étrange promet un cadeau gratuit. Que faire ?',['ne pas cliquer','cliquer vite','le partager','l’ouvrir sur tous les appareils'],'ne pas cliquer','Les liens suspects peuvent voler des informations.'),
  Q('Comment doit-on se comporter en ligne ?',['avec respect','avec méchanceté','avec moquerie','en insultant'],'avec respect','On est aussi poli en ligne que dans la vraie vie.'),
  Q('Combien de temps passer devant un écran chaque jour ?',['un temps raisonnable, avec des pauses','toute la nuit','sans arrêt','sans dormir'],'un temps raisonnable, avec des pauses','Les yeux et le corps ont besoin de repos.')
 ],
 independance:[
  Q('En quelle année la RDC est-elle devenue indépendante ?',['1960','1900','1990','2000'],'1960','L’indépendance a été proclamée le 30 juin 1960.'),
  Q('Qui fut le premier Premier ministre du Congo indépendant ?',['Patrice Lumumba','Mobutu Sese Seko','Laurent-Désiré Kabila','Joseph Kabila'],'Patrice Lumumba','Patrice Lumumba a été le premier Premier ministre.'),
  Q('Quel jour fête-t-on l’indépendance ?',['le 30 juin','le 1er mai','le 25 décembre','le 14 juillet'],'le 30 juin','La fête nationale est le 30 juin.'),
  Q('De quel pays le Congo est-il devenu indépendant en 1960 ?',['de la Belgique','de la France','du Portugal','de l’Italie'],'de la Belgique','Le Congo était une colonie belge.'),
  Q('Que veut dire « être indépendant » pour un pays ?',['se gouverner soi-même','être gouverné par d’autres','ne plus avoir de frontières','ne plus avoir de villes'],'se gouverner soi-même','Un pays indépendant décide lui-même de son avenir.')
 ],
 symboles:[
  Q('Comment s’appelle l’hymne national de la RDC ?',['Debout Congolais','La Marseillaise','Vive le roi','Hymne à la joie'],'Debout Congolais','L’hymne national est « Debout Congolais ».'),
  Q('Quelle est la devise de la RDC ?',['Justice – Paix – Travail','Liberté – Égalité – Fraternité','Force – Honneur – Patrie','Dieu et mon droit'],'Justice – Paix – Travail','Justice, Paix, Travail est la devise nationale.'),
  Q('Quelle forme a l’étoile du drapeau ?',['jaune à cinq branches','bleue à six branches','verte à quatre branches','rouge à trois branches'],'jaune à cinq branches','Le drapeau porte une étoile jaune sur fond bleu ciel.'),
  Q('Que fait-on quand on entend l’hymne national ?',['on se tient debout avec respect','on court','on ricane','on s’en va'],'on se tient debout avec respect','On respecte les symboles de son pays.'),
  Q('Quel est le premier devoir d’un bon citoyen envers son pays ?',['le respecter et le servir','le critiquer sans agir','l’oublier','le quitter'],'le respecter et le servir','Servir son pays, c’est participer à son développement.')
 ]
});

Object.assign(NPC,{
 ndombi:{sc:'wagenia',x:-5,z:-5.5,ry:0.3,name:'Pêcheur Ndombi',short:'le pêcheur',role:'Pêcheur',kind:'quiz',sujet:'wagenia',nb:3,needs:'tisse',
  look:{s:'h',h:1.02,skin:'#6e4a36',c:'#2e86de',k:'pagne',co:'rase',faceKey:'avatars/h2'},
  intro:['Bienvenue à Kisangani, au bord des chutes !','Mes ancêtres pêchent ici depuis très longtemps. Veux-tu connaître nos secrets ?'],
  outro:'Bravo ! Ma sœur Mama Kaseya va te parler de calcul et de pêche.'},
 kaseya:{sc:'wagenia',x:5.5,z:-5.5,ry:-0.4,name:'Mama Kaseya',short:'Mama Kaseya',role:'Marchande de poisson',kind:'quiz',sujet:'poissons',nb:3,needs:'ndombi',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#c0392b',k:'pagne',co:'nattes',faceKey:'avatars/f3'},
  intro:['Viens, je vends le poisson du matin.','Un bon commerçant sait compter. Montre-moi !'],
  outro:'Très bien ! Direction la savane de Garamba.'},
 kalonji:{sc:'garamba',x:-5,z:-5.5,ry:0.3,name:'Guide Kalonji',short:'le guide',role:'Guide de savane',kind:'quiz',sujet:'savane',nb:3,needs:'kaseya',
  look:{s:'h',h:1.02,skin:'#7d5a44',c:'#8a6a2a',k:'uniforme',co:'courtes',faceKey:'avatars/h4'},
  intro:['Bienvenue dans la savane de Garamba !','Regarde : girafes et éléphants vivent ici en liberté. Reste près de moi.'],
  outro:'Parfait ! La biologiste Mpoyi t’expliquera qui mange quoi.'},
 mpoyi:{sc:'garamba',x:5.5,z:-5.5,ry:-0.4,name:'Biologiste Mpoyi',short:'la biologiste',role:'Biologiste',kind:'quiz',sujet:'chaine',nb:3,needs:'kalonji',
  look:{s:'f',h:0.98,skin:'#7a4a2e',c:'#27ae60',k:'uniforme',co:'tresses',faceKey:'avatars/f2'},
  intro:['Chaque animal a sa place dans la nature.','Voyons si tu comprends la chaîne alimentaire !'],
  outro:'Excellent ! En route pour le lac Tanganyika.'},
 mulenga:{sc:'tanganyika',x:-5,z:-5.5,ry:0.3,name:'Capitaine Mulenga',short:'le capitaine',role:'Capitaine de bateau',kind:'quiz',sujet:'tanganyika',nb:3,needs:'mpoyi',
  look:{s:'h',h:1.03,skin:'#6e4a36',c:'#1f5fa8',k:'uniforme',co:'rase',faceKey:'avatars/h3'},
  intro:['Bienvenue sur les rives du lac Tanganyika !','C’est le plus long lac d’eau douce du monde. Je le traverse chaque semaine.'],
  outro:'Très bien ! Mama Kabeya t’attend près des pirogues.'},
 kabeya:{sc:'tanganyika',x:5.5,z:-5.5,ry:-0.4,name:'Mama Kabeya',short:'Mama Kabeya',role:'Pêcheuse',kind:'quiz',sujet:'lacvie',nb:3,needs:'mulenga',
  look:{s:'f',h:0.96,skin:'#8a5a3e',c:'#e67e22',k:'pagne',co:'chignon',faceKey:'portraits/mama'},
  intro:['Chaque matin, je pars pêcher en pirogue.','La vie dans l’eau est riche, mais elle est fragile.'],
  outro:'Bravo ! Direction la cité des sciences.'},
 kasereka:{sc:'sciences',x:-5,z:-5.5,ry:0.3,name:'Professeur Kasereka',short:'le professeur',role:'Professeur de sciences',kind:'quiz',sujet:'sciences2',nb:3,needs:'kabeya',
  look:{s:'h',h:1.0,skin:'#916f64',c:'#7a8590',k:'uniforme',co:'gris',faceKey:'portraits/mavungu'},
  intro:['Bienvenue à la cité des sciences !','Ici, on observe, on expérimente et on comprend le monde. Prêt ?'],
  outro:'Bravo ! Madame Lwamba va te parler du temps et de l’énergie.'},
 lwamba:{sc:'sciences',x:5.5,z:-5.5,ry:-0.4,name:'Madame Lwamba',short:'Madame Lwamba',role:'Météorologue',kind:'quiz',sujet:'meteo',nb:3,needs:'kasereka',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#8e44ad',k:'uniforme',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['Je prédis le temps qu’il fera demain.','Vent, soleil, pluie : tout est lié à l’énergie. Voyons ce que tu sais !'],
  outro:'Excellent ! Direction la scène de la rumba.'},
 wendo:{sc:'rumba',x:-5,z:-5.5,ry:0.3,name:'Maestro Wendo',short:'le maestro',role:'Chef d’orchestre',kind:'quiz',sujet:'rumba',nb:3,needs:'lwamba',
  look:{s:'h',h:1.02,skin:'#6e4a36',c:'#c0392b',k:'boubou',co:'gris',faceKey:'avatars/h1'},
  intro:['Bienvenue ! Ici bat le cœur de la rumba congolaise.','Notre musique a conquis le monde. Écoute et réponds !'],
  outro:'Bravo ! Le guitariste Tabu t’attend.'},
 tabu:{sc:'rumba',x:5.5,z:-5.5,ry:-0.4,name:'Guitariste Tabu',short:'le guitariste',role:'Guitariste',kind:'quiz',sujet:'musique',nb:3,needs:'wendo',
  look:{s:'h',h:1.0,skin:'#7d5a44',c:'#f1c40f',k:'uniforme',co:'courtes',faceKey:'avatars/h3'},
  intro:['Une guitare, un rythme, et tout le monde danse.','Montre-moi que tu connais les instruments !'],
  outro:'Très bien ! Va voir les pompiers de la caserne.'},
 mutamba:{sc:'pompiers',x:-5,z:-5.5,ry:0.3,name:'Capitaine Mutamba',short:'le capitaine',role:'Capitaine des pompiers',kind:'quiz',sujet:'incendie',nb:3,needs:'tabu',
  look:{s:'h',h:1.03,skin:'#6e4a36',c:'#b22222',k:'uniforme',co:'rase',faceKey:'avatars/h2'},
  intro:['Bienvenue à la caserne des pompiers !','Notre mission : protéger les vies. Et toi, sais-tu prévenir un incendie ?'],
  outro:'Bien ! Le secouriste Kiala va te parler des secours.'},
 kiala:{sc:'pompiers',x:5.5,z:-5.5,ry:-0.4,name:'Secouriste Kiala',short:'le secouriste',role:'Secouriste',kind:'quiz',sujet:'secours',nb:3,needs:'mutamba',
  look:{s:'h',h:1.0,skin:'#916f64',c:'#f2f2f2',k:'uniforme',co:'courtes',faceKey:'avatars/h4'},
  intro:['Savoir réagir, c’est sauver des vies.','Voyons ensemble les bons réflexes.'],
  outro:'Bravo ! Direction la poste et la banque.'},
 makanda:{sc:'poste',x:-5,z:-5.5,ry:0.3,name:'Facteur Makanda',short:'le facteur',role:'Facteur',kind:'quiz',sujet:'poste',nb:3,needs:'kiala',
  look:{s:'h',h:1.0,skin:'#7d5a44',c:'#f1c40f',k:'uniforme',co:'courtes',faceKey:'avatars/h1'},
  intro:['Bonjour ! Je livre lettres et colis dans toute la ville.','Savoir écrire une adresse, c’est aussi important que savoir lire !'],
  outro:'Très bien ! Madame Nlandu va te parler d’argent.'},
 nlandu:{sc:'poste',x:5.5,z:-5.5,ry:-0.4,name:'Banquière Nlandu',short:'la banquière',role:'Banquière',kind:'quiz',sujet:'epargne',nb:3,needs:'makanda',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#1f3a6b',k:'uniforme',co:'chignon',faceKey:'avatars/f4'},
  intro:['Bienvenue à la banque.','L’argent bien gardé et bien géré fait grandir les projets.'],
  outro:'Parfait ! Va au centre de recyclage.'},
 tumba:{sc:'recyclage',x:-5,z:-5.5,ry:0.3,name:'Madame Tumba',short:'Madame Tumba',role:'Responsable du recyclage',kind:'quiz',sujet:'recyclage',nb:3,needs:'nlandu',
  look:{s:'f',h:0.98,skin:'#8a5a3e',c:'#27ae60',k:'uniforme',co:'nattes',faceKey:'avatars/f2'},
  intro:['Ici, rien ne se perd, tout se transforme !','Apprendre à trier, c’est protéger notre planète.'],
  outro:'Bravo ! Le jardinier Kapinga t’attend à la pépinière.'},
 kapinga:{sc:'recyclage',x:5.5,z:-5.5,ry:-0.4,name:'Jardinier Kapinga',short:'le jardinier',role:'Jardinier',kind:'quiz',sujet:'arbres',nb:3,needs:'tumba',
  look:{s:'h',h:1.0,skin:'#6e4a36',c:'#3f7d34',k:'uniforme',co:'rase',faceKey:'avatars/h2'},
  intro:['Chaque arbre planté est un cadeau pour demain.','Dis-moi ce que tu sais sur les arbres.'],
  outro:'Très bien ! Direction le centre numérique.'},
 mpiana:{sc:'numerique',x:-5,z:-5.5,ry:0.3,name:'Ingénieure Mpiana',short:'l’ingénieure',role:'Ingénieure informaticienne',kind:'quiz',sujet:'numerique',nb:3,needs:'kapinga',
  look:{s:'f',h:0.98,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'tresses',faceKey:'avatars/f3'},
  intro:['Bienvenue au centre numérique !','Les ordinateurs nous aident à apprendre, créer et communiquer.'],
  outro:'Bravo ! Le technicien Sefu te parlera de sécurité en ligne.'},
 sefu:{sc:'numerique',x:5.5,z:-5.5,ry:-0.4,name:'Technicien Sefu',short:'le technicien',role:'Technicien réseau',kind:'quiz',sujet:'internet',nb:3,needs:'mpiana',
  look:{s:'h',h:1.0,skin:'#7d5a44',c:'#7a8590',k:'uniforme',co:'courtes',faceKey:'avatars/h3'},
  intro:['Internet est utile, mais il faut rester prudent.','Voyons ensemble les bons réflexes en ligne !'],
  outro:'Parfait ! Le dernier lieu t’attend : la place de l’Indépendance.'},
 lubaki:{sc:'place',x:-5,z:-5.5,ry:0.3,name:'Historien Lubaki',short:'l’historien',role:'Historien',kind:'quiz',sujet:'independance',nb:3,needs:'kabuya',
  look:{s:'h',h:1.02,skin:'#916f64',c:'#8a6a2a',k:'boubou',co:'gris',faceKey:'portraits/mavungu'},
  intro:['Bienvenue sur la place de l’Indépendance.','Ici, le Congo a retrouvé sa liberté. Connais-tu cette histoire ?'],
  outro:'Bien ! Mama Bakala te parlera des symboles du pays.'},
 bakala:{sc:'place',x:5.5,z:-5.5,ry:-0.4,name:'Mama Bakala',short:'Mama Bakala',role:'Cheffe du protocole',kind:'quiz',sujet:'symboles',nb:3,needs:'lubaki',
  look:{s:'f',h:0.97,skin:'#7a4a2e',c:'#c0392b',k:'boubou',co:'chignon',faceKey:'portraits/ilunga'},
  intro:['Drapeau, hymne, devise : ce sont les symboles de notre nation.','Un bon citoyen les connaît et les respecte.'],
  outro:'Félicitations ! Tu as terminé tous les épisodes. Tu es un vrai champion du Congo !'}
});
STAGES.push(
 {id:'wagenia',scene:'wagenia',name:'Les pêcheurs Wagenia',icon:'🎣',npcs:['ndombi','kaseya']},
 {id:'garamba',scene:'garamba',name:'La savane de Garamba',icon:'🦒',npcs:['kalonji','mpoyi']},
 {id:'tanganyika',scene:'tanganyika',name:'Le lac Tanganyika',icon:'⛵',npcs:['mulenga','kabeya']},
 {id:'sciences',scene:'sciences',name:'La cité des sciences',icon:'🔬',npcs:['kasereka','lwamba']},
 {id:'rumba',scene:'rumba',name:'La scène de la rumba',icon:'🎸',npcs:['wendo','tabu']},
 {id:'pompiers',scene:'pompiers',name:'La caserne des pompiers',icon:'🚒',npcs:['mutamba','kiala']},
 {id:'poste',scene:'poste',name:'La poste et la banque',icon:'✉️',npcs:['makanda','nlandu']},
 {id:'recyclage',scene:'recyclage',name:'Le centre de recyclage',icon:'♻️',npcs:['tumba','kapinga']},
 {id:'numerique',scene:'numerique',name:'Le centre numérique',icon:'💻',npcs:['mpiana','sefu']}
);
Object.assign(BANK,{
 contes_proverbes:[
  Q('Complète le proverbe : « Petit à petit, … »',['l’oiseau fait son nid','la pluie tombe','le feu s’éteint','le vent souffle'],'l’oiseau fait son nid','Avec de la patience, on réussit de grandes choses.'),
  Q('Qu’est-ce qu’un conte ?',['une histoire imaginaire que l’on raconte','un tableau de calcul','une carte géographique','une facture'],'une histoire imaginaire que l’on raconte','Les contes transmettent des leçons.'),
  Q('Qui transmet souvent les contes au village ?',['les anciens et les conteurs','les machines','les voitures','les affiches'],'les anciens et les conteurs','Ils racontent le soir, autour du feu.'),
  Q('« Seul on va plus vite, ensemble on va plus loin » veut dire que…',['l’union fait la force','il vaut mieux rester seul','il ne faut jamais voyager','la vitesse est le plus important'],'l’union fait la force','Travailler ensemble permet d’aller plus loin.'),
  Q('Pourquoi raconte-t-on des contes aux enfants ?',['pour transmettre des leçons et la culture','pour les effrayer','pour passer le temps sans but','pour éviter l’école'],'pour transmettre des leçons et la culture','Les contes éduquent et font rêver.'),
  Q('Un proverbe est…',['une courte phrase pleine de sagesse','un long roman','une opération de calcul','un nom de village'],'une courte phrase pleine de sagesse','Il donne un conseil en peu de mots.')
 ],
 traditions:[
  Q('Le ngoma est…',['un tambour','une flûte','un violon','une guitare'],'un tambour','Le ngoma rythme les danses.'),
  Q('Le likembé est…',['un instrument à lamelles joué avec les pouces','un grand tambour','un vêtement','un plat'],'un instrument à lamelles joué avec les pouces','On l’appelle aussi piano à pouces.'),
  Q('Quel vêtement traditionnel est un tissu enroulé ?',['le pagne','le casque','le manteau','la cravate'],'le pagne','Le pagne, souvent en wax, est porté par les femmes et les hommes.'),
  Q('Les masques sont souvent utilisés lors…',['de cérémonies','d’examens de calcul','de courses à pied','de ventes de pain'],'de cérémonies','Ils ont un rôle symbolique.'),
  Q('Depuis quelle année la rumba congolaise est-elle au patrimoine immatériel de l’UNESCO ?',['2021','1960','1990','2010'],'2021','Elle y a été inscrite en 2021.'),
  Q('Pourquoi garder nos traditions ?',['elles font partie de notre identité','elles ne servent à rien','elles sont interdites','elles sont dangereuses'],'elles font partie de notre identité','Elles relient les générations.')
 ],
 masques:[
  Q('Le masque est souvent sculpté dans…',['le bois','le verre','le papier','le sable'],'le bois','Le bois est le matériau le plus courant.'),
  Q('Quel peuple du Kasaï est célèbre pour ses tissus de raphia et ses masques ?',['les Kuba','les Vikings','les Mayas','les Incas'],'les Kuba','Le royaume kuba est réputé pour son art.'),
  Q('Le tissu kuba est tissé avec des fibres de…',['raphia','laine','soie','lin'],'raphia','Le raphia est un palmier.'),
  Q('Un sculpteur utilise surtout…',['un ciseau et un maillet','un microscope','une calculatrice','un thermomètre'],'un ciseau et un maillet','Ce sont ses outils de base.'),
  Q('Quel grand peintre a été inspiré par l’art africain ?',['Picasso','Mozart','Newton','Pasteur'],'Picasso','L’art africain a influencé l’art moderne.'),
  Q('Pourquoi protéger les œuvres d’art ?',['elles gardent notre histoire','elles encombrent','elles sont inutiles','elles se périment'],'elles gardent notre histoire','Elles sont un patrimoine.')
 ],
 couleurs:[
  Q('Quelles sont les trois couleurs primaires ?',['rouge, jaune, bleu','vert, orange, violet','noir, blanc, gris','rose, marron, beige'],'rouge, jaune, bleu','On ne peut pas les fabriquer en mélangeant d’autres couleurs.'),
  Q('Jaune + bleu = ?',['vert','orange','violet','rouge'],'vert','Le mélange jaune et bleu donne le vert.'),
  Q('Rouge + jaune = ?',['orange','vert','violet','marron clair seulement'],'orange','Rouge + jaune = orange.'),
  Q('Rouge + bleu = ?',['violet','vert','orange','jaune'],'violet','Rouge + bleu = violet.'),
  Q('Quelles sont les couleurs du drapeau de la RDC ?',['bleu ciel, jaune et rouge','vert, blanc et orange','noir, rouge et or','bleu, blanc et rouge'],'bleu ciel, jaune et rouge','Le drapeau a un fond bleu ciel avec une étoile jaune et une bande rouge.'),
  Q('Avec quoi peint-on un tableau ?',['un pinceau','un marteau','une scie','une pelle'],'un pinceau','Le pinceau étale la peinture.')
 ],
 medias:[
  Q('Quelle institution diffuse la radio et la télévision nationales de la RDC ?',['la RTNC','la SNCC','la REGIDESO','la FIFA'],'la RTNC','Radio-Télévision nationale congolaise.'),
  Q('Que fait un journaliste ?',['il recherche et vérifie l’information','il invente des histoires','il construit des routes','il vend des journaux seulement'],'il recherche et vérifie l’information','Informer demande de la vérification.'),
  Q('Quel média utilise des images et du son ?',['la télévision','le journal papier','l’affiche seule','le livre seul'],'la télévision','La télé combine image et son.'),
  Q('Que faire avant de partager une information ?',['la vérifier','la partager vite','l’inventer','la cacher'],'la vérifier','Une rumeur partagée peut faire du mal.'),
  Q('Quelle source est la plus fiable ?',['plusieurs médias sérieux qui disent la même chose','une rumeur','un inconnu en ligne','un message anonyme'],'plusieurs médias sérieux qui disent la même chose','On croise les sources.'),
  Q('Une fausse information s’appelle…',['une rumeur ou fake news','un reportage vérifié','un communiqué officiel','un bulletin météo'],'une rumeur ou fake news','Elle trompe le public.')
 ],
 ondes:[
  Q('Le son se propage grâce à…',['des vibrations de l’air','le vide','la lumière seule','la gravité'],'des vibrations de l’air','Sans air, pas de son.'),
  Q('Qui va le plus vite : la lumière ou le son ?',['la lumière','le son','ils vont pareil','cela dépend du vent'],'la lumière','On voit l’éclair avant d’entendre le tonnerre.'),
  Q('Une antenne sert à…',['émettre ou capter des ondes','faire pousser des fleurs','cuire des aliments','laver le linge'],'émettre ou capter des ondes','Radio, télé et téléphones en ont besoin.'),
  Q('Un micro transforme…',['le son en signal électrique','la lumière en chaleur','l’eau en vapeur','le vent en son'],'le son en signal électrique','Il capte la voix.'),
  Q('Un haut-parleur transforme…',['un signal électrique en son','le son en lumière','la chaleur en eau','le froid en vent'],'un signal électrique en son','Il fait vibrer l’air.'),
  Q('Les ondes radio voyagent…',['dans l’air à la vitesse de la lumière','plus lentement que le son','seulement sous l’eau','pas du tout'],'dans l’air à la vitesse de la lumière','Ce sont des ondes électromagnétiques.')
 ],
 cafe_cacao:[
  Q('Le cacao sert à fabriquer…',['le chocolat','le sel','le ciment','le savon'],'le chocolat','Les fèves de cacao donnent le chocolat.'),
  Q('Quelle boisson vient du caféier ?',['le café','le thé','le lait','le jus d’orange'],'le café','Les grains de café sont torréfiés.'),
  Q('Une culture de rente est cultivée…',['pour être vendue','pour jouer','pour ne jamais être récoltée','pour être interdite'],'pour être vendue','Café et cacao rapportent de l’argent.'),
  Q('Quelle culture est vivrière (pour se nourrir) ?',['le manioc','le café','le cacao','le caoutchouc'],'le manioc','Le manioc nourrit les familles.'),
  Q('Après la récolte, on fait sécher les grains…',['au soleil','dans un congélateur','dans l’eau','dans le noir sans air'],'au soleil','Le séchage conserve les grains.'),
  Q('Pourquoi planter des arbres d’ombrage près des cacaoyers ?',['pour protéger les jeunes plants du soleil fort','pour faire du bruit','pour boucher le passage','pour décorer'],'pour protéger les jeunes plants du soleil fort','Le cacaoyer aime l’ombre.')
 ],
 cultures:[
  Q('Une semence est…',['une graine à planter','une feuille morte','une roche','un outil'],'une graine à planter','On sème pour récolter.'),
  Q('Le compost est…',['un engrais naturel fait de déchets végétaux','un poison','un insecte','un plastique'],'un engrais naturel fait de déchets végétaux','Il enrichit le sol.'),
  Q('La rotation des cultures permet de…',['garder le sol fertile','épuiser le sol','semer sans fin','éviter l’eau'],'garder le sol fertile','On change de culture à chaque saison.'),
  Q('Que faut-il pour qu’une graine germe ?',['de l’eau, de la chaleur et de l’air','seulement du sable','seulement du froid','du plastique'],'de l’eau, de la chaleur et de l’air','Ce sont les conditions de la germination.'),
  Q('Quand plante-t-on généralement ?',['au début de la saison des pluies','en pleine sécheresse','jamais','pendant une tempête de sable'],'au début de la saison des pluies','L’eau aide les jeunes plants.'),
  Q('Le désherbage sert à…',['enlever les plantes qui gênent les cultures','arroser','récolter','cuire'],'enlever les plantes qui gênent les cultures','Les mauvaises herbes prennent la place et l’eau.')
 ],
 kivu:[
  Q('Le lac Kivu est situé à la frontière entre la RDC et…',['le Rwanda','le Maroc','l’Égypte','le Sénégal'],'le Rwanda','Le lac sépare le Kivu congolais du Rwanda.'),
  Q('Quelle ville congolaise est au nord du lac Kivu ?',['Goma','Kinshasa','Matadi','Lubumbashi'],'Goma','Goma est au bord du lac.'),
  Q('Quelle ville congolaise est au sud du lac Kivu ?',['Bukavu','Boma','Kisangani','Mbandaka'],'Bukavu','Bukavu est à l’extrémité sud.'),
  Q('Quel volcan domine la ville de Goma ?',['le Nyiragongo','le Kilimandjaro','le Mont Blanc','l’Etna'],'le Nyiragongo','Un volcan actif près de Goma.'),
  Q('Quel gaz est dissous dans les eaux profondes du lac Kivu ?',['le méthane','le chlore','l’hélium','l’oxygène pur'],'le méthane','On cherche à l’exploiter avec prudence.'),
  Q('Le lac Kivu est un lac…',['de montagne','de plaine côtière','salé comme la mer','asséché'],'de montagne','Il se trouve à environ 1 460 mètres d’altitude.')
 ],
 lacs:[
  Q('Quel est le lac le plus profond d’Afrique ?',['le Tanganyika','le Kivu','le Tchad','le Victoria'],'le Tanganyika','Plus de 1 400 mètres de profondeur.'),
  Q('Le lac Victoria est le plus grand lac…',['d’Afrique','d’Asie','d’Europe','d’Amérique du Sud'],'d’Afrique','Il est partagé entre trois pays.'),
  Q('Quel lac forme une frontière entre la RDC et l’Ouganda ?',['le lac Albert','le lac Léman','le lac Titicaca','le lac Michigan'],'le lac Albert','Il est à l’est du pays.'),
  Q('Quel grand fleuve traverse la RDC ?',['le fleuve Congo','le Nil','la Seine','le Danube'],'le fleuve Congo','Il traverse tout le pays.'),
  Q('Les lacs apportent aux populations…',['du poisson et de l’eau','de la neige en permanence','du pétrole','du sable seulement'],'du poisson et de l’eau','Pêche, eau, transport.'),
  Q('Pourquoi protéger les lacs ?',['pour garder l’eau propre et les poissons','pour y jeter des déchets','pour les vendre','pour les boucher'],'pour garder l’eau propre et les poissons','Un lac pollué ne nourrit plus.')
 ],
 bonobos:[
  Q('Le bonobo vit à l’état sauvage uniquement…',['en RDC','en Asie','en Australie','en Amérique'],'en RDC','C’est une espèce propre à la RDC.'),
  Q('Le bonobo est…',['un grand singe','un poisson','un oiseau','un insecte'],'un grand singe','Il est un proche cousin de l’être humain.'),
  Q('Que mange surtout le bonobo ?',['des fruits et des feuilles','du sable','du métal','du papier'],'des fruits et des feuilles','Il est surtout végétarien.'),
  Q('Où vivent les bonobos ?',['dans la forêt tropicale','dans le désert','sur la banquise','sur les toits'],'dans la forêt tropicale','Au sud du fleuve Congo.'),
  Q('Le braconnage, c’est…',['chasser illégalement des animaux protégés','pêcher en famille','cultiver un champ','planter un arbre'],'chasser illégalement des animaux protégés','Il menace les bonobos.'),
  Q('Comment protéger les bonobos ?',['en protégeant leur forêt','en coupant la forêt','en les chassant','en les vendant'],'en protégeant leur forêt','Sans forêt, pas de bonobos.')
 ],
 soins:[
  Q('Que fait un vétérinaire ?',['il soigne les animaux','il construit des maisons','il enseigne le calcul','il pilote des avions'],'il soigne les animaux','Il veille à leur santé.'),
  Q('Un vaccin protège…',['contre certaines maladies','contre la pluie','contre le soleil','contre le bruit'],'contre certaines maladies','Les animaux aussi se vaccinent.'),
  Q('Que faire si on trouve un animal sauvage blessé ?',['prévenir des adultes responsables ou un vétérinaire','le frapper','le laisser seul sans rien dire','le vendre'],'prévenir des adultes responsables ou un vétérinaire','Il faut des spécialistes.'),
  Q('Pourquoi ne pas nourrir les animaux sauvages ?',['ils perdent l’habitude de chercher seuls leur nourriture','ils adorent les bonbons','ils deviennent invisibles','ils grandissent trop vite'],'ils perdent l’habitude de chercher seuls leur nourriture','Ils doivent rester sauvages.'),
  Q('Un sanctuaire est…',['un lieu protégé où l’on soigne et protège les animaux','un marché','une école de danse','une mine'],'un lieu protégé où l’on soigne et protège les animaux','Les bonobos orphelins y sont soignés.'),
  Q('Pourquoi garde-t-on les distances avec les animaux sauvages ?',['pour éviter les blessures et les maladies','pour les cacher','pour les ignorer','pour les enfermer'],'pour éviter les blessures et les maladies','Les maladies passent entre l’homme et l’animal.')
 ]
});
Object.assign(SUJETS,{contes_proverbes:'Contes et proverbes',traditions:'Traditions congolaises',masques:'Masques et sculpture',couleurs:'Couleurs et peinture',medias:'Radio, télé et journaux',ondes:'Le son et les ondes',cafe_cacao:'Café et cacao',cultures:'Cultiver la terre',kivu:'Le lac Kivu',lacs:'Les grands lacs',bonobos:'Les bonobos',soins:'Soigner les animaux'});
Object.assign(NPC,{
 ntumba:{sc:'village',x:-5,z:-5.5,ry:0.3,name:'Conteur Ntumba',short:'le conteur',role:'Conteur du village',kind:'quiz',sujet:'contes_proverbes',nb:3,needs:'sefu',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#7a5a3a',k:'boubou',co:'gris',faceKey:'portraits/mavungu'},
  intro:['Viens t’asseoir, mon enfant, près du feu.','Les anciens racontent, les enfants écoutent : ainsi vivent nos histoires.'],
  outro:'Bien écouté ! Mama Nkenge t’apprendra nos danses et nos instruments.'},
 nkenge:{sc:'village',x:5.5,z:-5.5,ry:-0.4,name:'Mama Nkenge',short:'Mama Nkenge',role:'Gardienne des danses',kind:'quiz',sujet:'traditions',nb:3,needs:'ntumba',
  look:{s:'f',h:0.97,skin:'#6b4028',c:'#c0392b',k:'pagne',co:'nattes',faceKey:'portraits/mama'},
  intro:['Entends-tu le ngoma ? Il appelle tout le village.','Voyons ce que tu sais de nos traditions !'],
  outro:'Magnifique ! Va maintenant à l’académie des arts.'},
 kasoma:{sc:'art',x:-5,z:-5.5,ry:0.3,name:'Sculpteur Kasoma',short:'le sculpteur',role:'Maître sculpteur',kind:'quiz',sujet:'masques',nb:3,needs:'nkenge',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#5a3a22',k:'boubou',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Du bois, un ciseau, un maillet : et naît un masque.','L’art garde la mémoire de notre peuple.'],
  outro:'Beau travail ! Madame Lutete t’attend avec ses couleurs.'},
 lutete:{sc:'art',x:5.5,z:-5.5,ry:-0.4,name:'Madame Lutete',short:'Madame Lutete',role:'Peintre',kind:'quiz',sujet:'couleurs',nb:3,needs:'kasoma',
  look:{s:'f',h:0.97,skin:'#6b4028',c:'#8e44ad',k:'pagne',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['Rouge, jaune, bleu : avec trois couleurs, on peint le monde.','Prends un pinceau et réponds à mes questions !'],
  outro:'Bravo, tu as l’œil d’un artiste ! Direction la radio et la télé.'},
 ntambwe:{sc:'radio',x:-5,z:-5.5,ry:0.3,name:'Journaliste Ntambwe',short:'la journaliste',role:'Journaliste',kind:'quiz',sujet:'medias',nb:3,needs:'lutete',
  look:{s:'f',h:0.97,skin:'#6b4028',c:'#b3261e',k:'uniforme',co:'chignon',faceKey:'portraits/ilunga'},
  intro:['Nous sommes en direct ! Informer, c’est une grande responsabilité.','Un bon journaliste vérifie toujours avant de parler.'],
  outro:'Excellent ! Le technicien Mwanza t’expliquera comment voyagent les ondes.'},
 mwanza:{sc:'radio',x:5.5,z:-5.5,ry:-0.4,name:'Technicien Mwanza',short:'le technicien',role:'Technicien radio',kind:'quiz',sujet:'ondes',nb:3,needs:'ntambwe',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#1f5f8b',k:'uniforme',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Ma voix voyage jusqu’à des milliers de maisons, sans fil !','Tu veux savoir comment ? Réponds d’abord à mes questions.'],
  outro:'Parfait ! Va voir la plantation de café et de cacao.'},
 ngandu:{sc:'plantation',x:-5,z:-5.5,ry:0.3,name:'Papa Ngandu',short:'Papa Ngandu',role:'Planteur de café',kind:'quiz',sujet:'cafe_cacao',nb:3,needs:'mwanza',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#2e7d4a',k:'boubou',co:'gris',faceKey:'portraits/mavungu'},
  intro:['Le café et le cacao, voilà la richesse de notre terre.','Il faut de la patience pour faire pousser un caféier.'],
  outro:'Bien ! Mama Zawadi te parlera de la terre et des semences.'},
 zawadi:{sc:'plantation',x:5.5,z:-5.5,ry:-0.4,name:'Mama Zawadi',short:'Mama Zawadi',role:'Agronome',kind:'quiz',sujet:'cultures',nb:3,needs:'ngandu',
  look:{s:'f',h:0.97,skin:'#6b4028',c:'#d4a017',k:'pagne',co:'nattes',faceKey:'portraits/mama'},
  intro:['Une bonne récolte commence par une bonne terre.','Compost, semences, saisons : tu connais ?'],
  outro:'Bravo ! Cap vers le lac Kivu.'},
 safari:{sc:'kivu',x:-5,z:-5.5,ry:0.3,name:'Guide Safari',short:'le guide',role:'Guide du lac Kivu',kind:'quiz',sujet:'kivu',nb:3,needs:'zawadi',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#0b5fa5',k:'uniforme',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Regarde ce lac, entouré de collines, et au loin le volcan !','Le Kivu est un trésor de notre région.'],
  outro:'Super ! Le pêcheur Baraka te parlera des grands lacs.'},
 baraka:{sc:'kivu',x:5.5,z:-5.5,ry:-0.4,name:'Pêcheur Baraka',short:'le pêcheur',role:'Pêcheur',kind:'quiz',sujet:'lacs',nb:3,needs:'safari',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#2a7a9a',k:'boubou',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Chaque matin, le lac nous nourrit.','Prendre soin de l’eau, c’est prendre soin de nos familles.'],
  outro:'Bien joué ! Va voir les bonobos, nos cousins de la forêt.'},
 matondo:{sc:'bonobos',x:-5,z:-5.5,ry:0.3,name:'Soigneuse Matondo',short:'la soigneuse',role:'Soigneuse de bonobos',kind:'quiz',sujet:'bonobos',nb:3,needs:'baraka',
  look:{s:'f',h:0.97,skin:'#6b4028',c:'#2e7d4a',k:'uniforme',co:'tresses',faceKey:'portraits/ilunga'},
  intro:['Chut… les bonobos dorment. Ce sont nos plus proches cousins.','Ils n’existent à l’état sauvage qu’en RDC : c’est notre trésor.'],
  outro:'Bravo ! Le vétérinaire Kabuya a besoin de toi.'},
 kabuya:{sc:'bonobos',x:5.5,z:-5.5,ry:-0.4,name:'Vétérinaire Kabuya',short:'le vétérinaire',role:'Vétérinaire',kind:'quiz',sujet:'soins',nb:3,needs:'matondo',
  look:{s:'h',h:1.0,skin:'#7a4a2e',c:'#ffffff',k:'uniforme',co:'courtes',faceKey:'portraits/mavungu'},
  intro:['Ici, on soigne les bonobos orphelins avant de les rendre à la forêt.','Un sanctuaire sauve des vies. Veux-tu en savoir plus ?'],
  outro:'Félicitations ! Il ne te reste plus que la place de l’Indépendance.'}
});
STAGES.push(
 {id:'village',scene:'village',name:'Le village des traditions',icon:'🛖',npcs:['ntumba','nkenge']},
 {id:'art',scene:'art',name:'L’académie des arts',icon:'🎨',npcs:['kasoma','lutete']},
 {id:'radio',scene:'radio',name:'La radio et la télévision',icon:'📻',npcs:['ntambwe','mwanza']},
 {id:'plantation',scene:'plantation',name:'La plantation de café et de cacao',icon:'☕',npcs:['ngandu','zawadi']},
 {id:'kivu',scene:'kivu',name:'Le lac Kivu',icon:'🏞️',npcs:['safari','baraka']},
 {id:'bonobos',scene:'bonobos',name:'Le sanctuaire des bonobos',icon:'🦍',npcs:['matondo','kabuya']}
);
STAGES.push(
 {id:'place',scene:'place',name:'La place de l’Indépendance',icon:'🇨🇩',npcs:['lubaki','bakala']}
);

// ---------- 70 lieux d'exploration supplémentaires (voir lieux70.js), insérés avant la place de l'Indépendance ----------
(function(){
  const place=STAGES.pop();
  let prev='kabuya';
  const PEAUX=['#7a4a2e','#6b4028','#8a5634','#63391f','#916f64','#5a3319'];
  const TENUES=['boubou','pagne','uniforme'];
  const CHEV={h:['courtes','gris','courtes'],f:['tresses','nattes','chignon']};
  const VISAGES={h:['portraits/mavungu'],f:['portraits/mama','portraits/ilunga']};
  const TEINTES=['#c0392b','#2e86de','#27ae60','#8e44ad','#d35400','#16a085','#e0a526','#2c3e50'];
  let n0=0;
  const libres=[];
  const PX=[-5,5.5,0.2],PZ=[-5.5,-5.5,-7.8],PRY=[0.3,-0.4,0];
  LIEUX.forEach(l0=>{
    // provinces et territoires de la RDC : dans le cursus, mais toujours accessibles (missions sans prérequis)
    const l=l0,acces=/^(tr|pv)_/.test(l0.id);
    const st={id:l.id,scene:l.id,name:l.nom,icon:l.ico,npcs:l.npc.map(n=>n.id)};
    if(l.libre){st.libre=true;libres.push(st)}else STAGES.push(st);
    l.npc.forEach((n,k)=>{
      BANK[n.suj]=n.qs.map(q=>Q(q[0],[q[1],q[2],q[3],q[4]],q[1],q[5]));
      SUJETS[n.suj]=n.lib;
      const sx=n.s,i=n0++;
      const suivant=l.npc[k+1];
      NPC[n.id]={sc:l.id,x:PX[k],z:PZ[k],ry:PRY[k],name:n.nom,short:n.court,role:n.role,kind:'quiz',sujet:n.suj,nb:3,needs:(l.libre||acces)?null:prev,
        look:{s:sx,h:sx==='h'?1.0:0.97,skin:PEAUX[i%PEAUX.length],c:TEINTES[i%TEINTES.length],k:TENUES[i%TENUES.length],co:CHEV[sx][i%3],faceKey:VISAGES[sx][i%VISAGES[sx].length]},
        intro:n.intro||[n.salut,'Voyons ce que tu sais !'],
        outro:l.libre?(suivant?'Bien joué ! '+suivant.nom+' te parlera de '+suivant.lib.toLowerCase()+'.':'Bravo ! Tu connais bien ce territoire. Reviens à la carte des lieux pour en explorer un autre.'):
          (suivant?'Bien joué ! '+suivant.nom+' te parlera de '+suivant.lib.toLowerCase()+'.':'Bravo ! Un nouveau lieu t’attend en ville : suis la route jaune.')};
      if(!l.libre&&!acces)prev=n.id;
    });
  });
  NPC.lubaki.needs=prev;
  STAGES.push(place);
  libres.forEach(st=>STAGES.push(st));
})();
