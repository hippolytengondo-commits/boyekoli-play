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
 {id:'detective',ico:'🕵️',nom:'Agence de détectives',guide:'detective',txt:'Résous des enquêtes avec des indices de français, de logique et de calcul.',dossiers:[
  {id:'d1',titre:'Le cahier disparu',intro:'Le cahier de la classe a disparu ! Lis les indices et trouve la logique de l’enquête.',qs:[
   Q('Indice 1 : « Le voleur a laissé des traces de boue. » Quel est le mot au pluriel ?',['traces','boue','voleur','laissé'],0,'« traces » est au pluriel (une trace, des traces).'),
   Q('Trois élèves sont suspects. Paul était à la bibliothèque, Léa au marché, Jo dans la cour. Le cahier est tombé dans la cour. Qui peut l’avoir pris ?',['Paul','Léa','Jo','Personne'],2,'Seul Jo était dans la cour, là où le cahier est tombé.'),
   Q('Il y avait 24 cahiers. Il en reste 19. Combien en manque-t-il ?',['4','5','6','43'],1,'24 − 19 = 5 cahiers.'),
   Q('Le témoin dit : « Il est parti hier. » Quel temps est utilisé ?',['Le présent','Le passé','Le futur','L’impératif'],1,'« est parti » indique une action passée.'),
   Q('Quel mot est le contraire de « coupable » ?',['Faux','Innocent','Voleur','Juge'],1,'Le contraire de coupable est innocent.')]},
  {id:'d2',titre:'Le trésor du marché',intro:'Une caisse du marché a été vidée. Observe, déduis, conclus.',qs:[
   Q('La caisse contenait 500 FC. On a retrouvé 3 billets de 100 FC. Combien manque-t-il ?',['100 FC','200 FC','300 FC','500 FC'],1,'500 − 300 = 200 FC.'),
   Q('Quel est le féminin de « voleur » ?',['Voleuse','Voleure','Volère','Volante'],0,'Voleur → voleuse.'),
   Q('Les empreintes sont celles d’un pied de 30 cm. Le suspect A mesure 1 m, la suspecte B porte du 30. Qui est le plus probable ?',['A','B','Aucun','Les deux'],1,'La pointure correspond à B : c’est un indice, pas une preuve.'),
   Q('Complète la suite logique : 2, 4, 8, 16, ...',['18','24','32','20'],2,'On double à chaque fois : 16 × 2 = 32.'),
   Q('Pourquoi un enquêteur doit-il écouter plusieurs témoins ?',['Pour perdre du temps','Pour comparer les récits','Pour accuser vite','Pour avoir peur'],1,'Comparer les récits permet de trouver la vérité.')]}]},
 {id:'laboratoire',ico:'🔬',nom:'Laboratoire scientifique',guide:'scientifique',txt:'Corps humain, cellules, plantes, animaux, système solaire et expériences.',dossiers:[
  {id:'l1',titre:'Le corps humain',intro:'Bienvenue au laboratoire ! Explorons le corps humain.',qs:[
   Q('Quel organe pompe le sang dans tout le corps ?',['Le cœur','Le foie','Le poumon','L’estomac'],0,'Le cœur est une pompe qui envoie le sang partout.'),
   Q('Quel organe permet de respirer ?',['Les reins','Les poumons','Le cerveau','La peau'],1,'Les poumons apportent l’oxygène au sang.'),
   Q('Combien de sens avons-nous classiquement ?',['3','4','5','8'],2,'La vue, l’ouïe, l’odorat, le goût et le toucher.'),
   Q('Quel est l’os qui protège le cerveau ?',['Le crâne','Le fémur','La côte','Le tibia'],0,'Le crâne protège le cerveau.'),
   Q('Que faut-il faire avant de manger ?',['Se laver les mains','Courir','Dormir','Crier'],0,'Se laver les mains évite beaucoup de maladies.')]},
  {id:'l2',titre:'Plantes, animaux et cellules',intro:'Observons le vivant au microscope : plantes, animaux et cellules.',qs:[
   Q('Comment s’appelle la plus petite unité du vivant ?',['L’atome','La cellule','L’organe','La feuille'],1,'Tous les êtres vivants sont faits de cellules.'),
   Q('Quel gaz les plantes absorbent-elles pour la photosynthèse ?',['Le dioxygène','Le dioxyde de carbone','L’azote','L’hélium'],1,'Elles absorbent le CO₂ et rejettent du dioxygène.'),
   Q('Quel animal congolais est un primate de la forêt ?',['Le gorille','Le requin','Le chameau','Le pingouin'],0,'Le gorille vit dans les forêts du Congo.'),
   Q('Quelle partie de la plante absorbe l’eau du sol ?',['La racine','La fleur','La feuille','Le fruit'],0,'Les racines puisent l’eau et les sels minéraux.'),
   Q('Les animaux qui mangent de la viande sont…',['herbivores','carnivores','végétariens','insectes'],1,'Un carnivore mange de la viande.')]},
  {id:'l3',titre:'Le système solaire',intro:'Direction l’espace : le Soleil et ses planètes.',qs:[
   Q('Quelle est l’étoile au centre de notre système solaire ?',['La Lune','Le Soleil','Mars','Vénus'],1,'Le Soleil est une étoile.'),
   Q('Combien de planètes compte le système solaire ?',['6','8','10','12'],1,'Huit planètes, de Mercure à Neptune.'),
   Q('Quelle planète est surnommée la planète rouge ?',['Mars','Jupiter','Saturne','Mercure'],0,'Mars est rouge à cause de l’oxyde de fer.'),
   Q('La Terre fait un tour sur elle-même en…',['1 heure','1 jour','1 mois','1 an'],1,'Un tour sur elle-même = un jour (24 h).'),
   Q('Pourquoi y a-t-il des saisons ?',['Car la Terre tourne autour du Soleil, inclinée','Car la Lune bouge','Car le Soleil s’éteint','Car il y a du vent'],0,'L’inclinaison de la Terre et son tour autour du Soleil créent les saisons.')]}]},
 {id:'hopital',ico:'🏥',nom:'Centre hospitalier',guide:'docteur',txt:'Urgences, pédiatrie, laboratoire, pharmacie, maternité : des scénarios pour apprendre la santé. (Éducatif : en cas de problème réel, consulte un vrai médecin.)',dossiers:[
  {id:'h1',titre:'Aux urgences',intro:'Aux urgences, il faut garder son calme et agir vite. Voici des situations de la vie.',qs:[
   Q('Un enfant se coupe légèrement. Que faire en premier ?',['Laver la plaie à l’eau propre et au savon','Mettre de la boue','Ne rien faire','Frotter fort'],0,'On nettoie d’abord la plaie avec de l’eau propre et du savon.'),
   Q('Quelqu’un s’évanouit. Qui faut-il appeler ?',['Un adulte et les secours','Personne','Un ami seulement','On attend la nuit'],0,'Toujours alerter un adulte et les secours.'),
   Q('Quelle est la température normale du corps ?',['Environ 37 °C','Environ 10 °C','Environ 50 °C','Environ 90 °C'],0,'La température normale est d’environ 37 °C.'),
   Q('Que faire en cas de brûlure légère ?',['Passer sous l’eau fraîche','Mettre du beurre','Percer les cloques','Frotter'],0,'On refroidit à l’eau fraîche.')]},
  {id:'h2',titre:'Pédiatrie, pharmacie et maternité',intro:'Prendre soin des enfants, des médicaments et des mamans.',qs:[
   Q('Pourquoi les vaccins sont-ils importants ?',['Ils protègent contre des maladies','Ils donnent faim','Ils font grandir d’un coup','Ils ne servent à rien'],0,'Les vaccins préparent le corps à se défendre.'),
   Q('Qui peut donner un médicament à un enfant ?',['Un adulte, selon l’ordonnance','L’enfant seul','N’importe qui','Un voisin'],0,'Un adulte, en suivant l’ordonnance du médecin.'),
   Q('Que contient une moustiquaire imprégnée ?',['Un produit qui éloigne les moustiques','Du sable','De l’eau','Rien'],0,'Elle protège contre le paludisme.'),
   Q('Quelle maladie est transmise par le moustique anophèle ?',['Le paludisme','La grippe','La carie','La rougeole'],0,'Le paludisme (malaria) est transmis par l’anophèle.'),
   Q('Un médicament périmé, on…',['ne l’utilise pas','le boit quand même','le partage','le garde pour plus tard'],0,'On ne prend jamais un médicament périmé.')]}]},
 {id:'decoration',ico:'🏠',nom:'Atelier de décoration',guide:'architecte',txt:'Mesures, surfaces, couleurs et formes pour aménager tes pièces.',dossiers:[
  {id:'a1',titre:'Peindre et mesurer',intro:'Un bon décorateur calcule avant de peindre.',qs:[
   Q('Un mur mesure 4 m de long et 3 m de haut. Quelle est sa surface ?',['7 m²','12 m²','14 m²','1 m²'],1,'4 × 3 = 12 m².'),
   Q('Le bleu et le jaune mélangés donnent…',['du vert','du rouge','du noir','du violet'],0,'Bleu + jaune = vert.'),
   Q('Une pièce carrée a 5 m de côté. Quel est son périmètre ?',['10 m','15 m','20 m','25 m'],2,'4 × 5 = 20 m.'),
   Q('Un pot de peinture couvre 6 m². Pour 12 m², il faut…',['1 pot','2 pots','3 pots','12 pots'],1,'12 ÷ 6 = 2 pots.'),
   Q('Quelle forme a une porte classique ?',['Un rectangle','Un cercle','Un triangle','Un losange'],0,'Une porte est un rectangle.')]},
  {id:'a2',titre:'Meubles, jardin et bibliothèque',intro:'Disposer les meubles, fleurir le jardin et ranger la bibliothèque.',qs:[
   Q('Une table coûte 40 pièces et 4 chaises 10 pièces chacune. Quel est le total ?',['50','60','80','100'],2,'40 + 4 × 10 = 80.'),
   Q('Quel est le rôle d’une fenêtre ?',['Laisser entrer lumière et air','Cacher le mur','Faire du bruit','Rien'],0,'Elle apporte lumière et aération.'),
   Q('Pour un jardin de 10 m sur 6 m, quelle est la surface ?',['16 m²','32 m²','60 m²','100 m²'],2,'10 × 6 = 60 m².'),
   Q('Dans une bibliothèque, on range les livres par…',['catégories ou ordre alphabétique','taille de la couverture seulement','hasard','couleur uniquement'],0,'Un classement clair aide à retrouver un livre.'),
   Q('Quelle plante embellit un jardin et attire les abeilles ?',['Les fleurs','Les cailloux','Le ciment','Le plastique'],0,'Les fleurs attirent les abeilles qui pollinisent.')]}]},
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
   Q('Quelle couleur de feu signifie « arrêt » ?',['Rouge','Vert','Bleu','Blanc'],0,'Le rouge signifie arrêt.')]}]}
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
