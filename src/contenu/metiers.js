// Pôle des métiers : dossiers pédagogiques (contenu préprogrammé, sans IA). Chaque question : q, c (4 choix), a (index), exp.
const Q=(q,c,a,exp)=>({q,c,a,exp});
export const GUIDES={
  detective:{ico:'🕵️',nom:'Inspectrice Mado',role:'Détective'},
  scientifique:{ico:'🔬',nom:'Professeur Kasongo',role:'Scientifique'},
  docteur:{ico:'🩺',nom:'Docteure Nzuzi',role:'Médecin'},
  architecte:{ico:'📐',nom:'Architecte Lukusa',role:'Architecte'},
  artiste:{ico:'🎨',nom:'Mama Kalanda',role:'Artiste'},
  entrepreneure:{ico:'💼',nom:'Madame Béa',role:'Entrepreneure'},
  nature:{ico:'🌿',nom:'Papa Mutombo',role:'Protecteur de la nature'},
  pilote:{ico:'✈️',nom:'Commandant Ilunga',role:'Pilote'},
  exploratrice:{ico:'🧭',nom:'Exploratrice Aimée',role:'Exploratrice'}
};
export const MODULES=[
 {id:'detective',ico:'🕵️',nom:'Agence de détectives',guide:'detective',txt:'Deviens détective : visite l’agence, mène deux grandes enquêtes en 3D (le musée et l’école), analyse les indices au laboratoire.',dossiers:[
  {id:'d1',titre:'Le mystère du musée',jeu:'musee',intro:'',qs:[]},
  {id:'d2',titre:'Le mystère de l’école',jeu:'ecole',intro:'',qs:[]}]},
 {id:'laboratoire',ico:'🔬',nom:'Laboratoire scientifique',guide:'scientifique',txt:'BOYEKOLI SCIENCE LAB : visite le laboratoire en 3D et réalise des expériences simulées de chimie, de biologie et de physique.',dossiers:[
  {id:'l1',titre:'Laboratoire de chimie',sci:true,intro:'',qs:[]},
  {id:'l2',titre:'Laboratoire de biologie',sci:true,intro:'',qs:[]},
  {id:'l3',titre:'Laboratoire de physique',sci:true,intro:'',qs:[]}]},
 {id:'hopital',ico:'🏥',nom:'Centre hospitalier',guide:'docteur',txt:'BOYEKOLI MEDICAL CENTER : accueille des patients fictifs et découvre les métiers de l’hôpital. Simulation éducative, sans vrai diagnostic.',dossiers:[
  {id:'h1',titre:'Ma première journée à l’hôpital',med:true,intro:'',qs:[]},
  {id:'h2',titre:'À la découverte des métiers de l’hôpital',med:true,intro:'',qs:[]}]},
 {id:'decoration',ico:'🏠',nom:'Atelier de décoration',guide:'architecte',txt:'BOYEKOLI DESIGN STUDIO : dessine une maison en 3D, aménage-la et décore-la.',dossiers:[
  {id:'a1',titre:'Ma première maison',deco:true,intro:'',qs:[]},
  {id:'a2',titre:'La villa familiale',deco:true,intro:'',qs:[]}]},
 {id:'mode',ico:'👗',nom:'Atelier mode et coiffure',guide:'artiste',txt:'Tissus africains, wax, pagnes, coiffures congolaises et défilés.',dossiers:[
  {id:'m1',titre:'Tissus et coiffures',intro:'La mode congolaise est riche de couleurs et de savoir-faire.',qs:[
   Q('Comment appelle-t-on le tissu de coton coloré très répandu en Afrique ?',['Le wax','Le jean','La soie sauvage','Le cuir'],0,'Le wax (pagne) est un tissu imprimé coloré.'),
   Q('Au Congo, le grand mouvement d’élégance des « sapeurs » signifie…',['Société des Ambianceurs et des Personnes Élégantes','Société des Artisans Peintres','Service de Pompiers','Sport et Plein air'],0,'La SAPE : Société des Ambianceurs et des Personnes Élégantes.'),
   Q('Pour un pagne de 2 m à 3 000 FC le mètre, le prix est…',['5 000 FC','6 000 FC','3 000 FC','9 000 FC'],1,'2 × 3 000 = 6 000 FC.'),
   Q('Pourquoi se laver et peigner ses cheveux régulièrement ?',['Pour l’hygiène et la santé','Pour rien','Pour perdre du temps','Pour faire peur'],0,'L’hygiène évite poux et infections.'),
   Q('Un défilé de mode sert à…',['présenter des créations','vendre du riz','réparer des vélos','compter des chèvres'],0,'Les mannequins présentent les créations.')]}]},
 {id:'ville',ico:'🌆',nom:'Ville intelligente',guide:'architecte',txt:'Aménage la ville : écoles, routes, énergie, eau et espaces verts.',dossiers:[
  {id:'v1',titre:'Aménager la ville',intro:'Une ville bien pensée est agréable pour tous. À toi de choisir !',qs:[
   Q('Où construire un nouvel hôpital ?',['Près des habitants, accessible par la route','Au milieu d’une décharge','Sur une rivière','Loin de tout'],0,'Un hôpital doit être accessible à tous.'),
   Q('Quelle énergie renouvelable utilise le soleil ?',['Le panneau solaire','Le charbon','Le pétrole','Le gaz'],0,'Les panneaux solaires transforment la lumière en électricité.'),
   Q('Le fleuve Congo permet la production d’électricité grâce au barrage…',['d’Inga','de Suez','d’Assouan','des Trois-Gorges'],0,'Le barrage d’Inga se situe sur le fleuve Congo.'),
   Q('Pourquoi planter des arbres en ville ?',['Pour l’ombre et l’air pur','Pour gêner','Pour rien','Pour cacher les routes'],0,'Les arbres rafraîchissent et purifient l’air.'),
   Q('Une école accueille 300 élèves, 30 par classe. Combien de classes ?',['5','10','30','100'],1,'300 ÷ 30 = 10 classes.')]}]},
 {id:'musique',ico:'🎶',nom:'Studio de musique et danse',guide:'artiste',txt:'Rumba, soukous, instruments et rythmes congolais.',dossiers:[
  {id:'mu1',titre:'Rumba et rythmes',intro:'Au studio, la musique congolaise fait danser le monde.',qs:[
   Q('La rumba congolaise est inscrite au patrimoine de…',['l’UNESCO','la FIFA','l’ONU Sport','la NASA'],0,'Elle a été inscrite au patrimoine culturel immatériel de l’UNESCO en 2021.'),
   Q('Quel instrument se frappe avec les mains ?',['Le tam-tam','Le piano','La flûte','La guitare'],0,'Le tam-tam est un tambour.'),
   Q('Un morceau dure 3 minutes. Combien de secondes ?',['30','120','180','300'],2,'3 × 60 = 180 secondes.'),
   Q('Combien de temps dans une mesure à quatre temps ?',['2','3','4','8'],2,'Quatre temps.'),
   Q('Quel genre de danse populaire du Congo se danse en couple ?',['La rumba','Le ballet russe','Le tango argentin','La valse viennoise'],0,'La rumba se danse à deux, hanches en mouvement.')]}]},
 {id:'pilotage',ico:'✈️',nom:'École de pilotage',guide:'pilote',txt:'Cartes, boussole, vitesse et sécurité pour devenir pilote.',dossiers:[
  {id:'p1',titre:'Les bases du pilotage',intro:'Avant de décoller, un pilote vérifie tout.',qs:[
   Q('Quel instrument indique le nord ?',['La boussole','La montre','La règle','Le thermomètre'],0,'La boussole pointe vers le nord magnétique.'),
   Q('Un avion vole à 600 km/h pendant 2 heures. Quelle distance ?',['300 km','600 km','1 200 km','1 800 km'],2,'600 × 2 = 1 200 km.'),
   Q('Quelle est la capitale de la RDC, destination de nombreux vols ?',['Kinshasa','Lubumbashi','Goma','Kisangani'],0,'Kinshasa est la capitale.'),
   Q('Avant le décollage, le pilote…',['fait la liste de contrôle','dort','ferme les yeux','mange'],0,'La check-list garantit la sécurité.'),
   Q('Quelle couleur de feu signifie « arrêt » ?',['Rouge','Vert','Bleu','Blanc'],0,'Le rouge signifie arrêt.')]},
  {id:'p2',titre:'Règles de l’air et instruments',intro:'Deuxième partie de la théorie : les instruments, la météo et les règles de l’air.',qs:[
   Q('Que mesure l’altimètre ?',['L’altitude','La vitesse','Le cap','Le carburant'],0,'L’altimètre indique la hauteur de l’avion.'),
   Q('Que fait-on si la vitesse devient trop faible en l’air ?',['On risque le décrochage : on baisse le nez et on donne des gaz','On monte encore plus','On coupe le moteur','On baisse les volets au maximum'],0,'Sous la vitesse de décrochage, l’aile ne porte plus.'),
   Q('Pendant le décollage, quel instrument surveille-t-on en priorité ?',['L’anémomètre (vitesse)','La radio musicale','La montre','La boussole seulement'],0,'On atteint la vitesse de rotation avant de tirer sur le manche.'),
   Q('Pour atterrir, on doit…',['réduire la vitesse et garder le nez presque à plat','foncer à pleine vitesse','couper les ailes','éteindre les feux'],0,'Un atterrissage doux demande une vitesse réduite et une bonne assiette.'),
   Q('À quoi servent les volets ?',['Augmenter la portance à basse vitesse','Refroidir le moteur','Décorer l’aile','Faire du bruit'],0,'Les volets permettent de voler et d’atterrir plus lentement.'),
   Q('Qui guide les avions au sol et dans le ciel depuis la tour ?',['Le contrôleur aérien','Le mécanicien','Le douanier','Le passager'],0,'Le contrôleur aérien organise la circulation des avions.'),
   Q('Avant de démarrer, que fait-on avec la check-list ?',['On vérifie chaque point un par un','On l’ignore','On la range','On la déchire'],0,'La check-list évite les oublis dangereux.')]}]}
];
export const CULTURES={
  mais:{ico:'🌽',nom:'Maïs',cout:4,min:3,rendement:3,prix:3,txt:'Le maïs sert à la bouillie et à la farine.'},
  manioc:{ico:'🥔',nom:'Manioc',cout:6,min:5,rendement:4,prix:3,txt:'Le manioc donne la chikwangue et le fufu, base de l’alimentation congolaise.'},
  legumes:{ico:'🥬',nom:'Légumes',cout:3,min:2,rendement:2,prix:3,txt:'Épinards, amarante et aubergines : légumes riches en vitamines.'}
};
export const ELEVAGE={
  poule:{ico:'🐔',nom:'Poule',prix:10,produit:'🥚 œuf',min:4,valeur:1},
  chevre:{ico:'🐐',nom:'Chèvre',prix:30,produit:'🥛 lait',min:6,valeur:3}
};
