// Supermarché : rayons (catégories de produits et prix) et défis de courses. Les prix sont ceux du jeu, en pièces.
// Ajouter un produit ou un défi = ajouter une ligne ici ; les réponses sont calculées par le programme.
const P=(n,p,m)=>({n,p,m});
// trois niveaux, neuf rayons, une cinquantaine de produits. m : modèle 3D (voir produits.js). Les prix sont ceux du jeu, en pièces.
export const NIVEAUX_SUPER=[
 {nom:'Produits frais',ico:'🥬',couleur:'#2e7d32',rayons:[
  {id:'fruits',nom:'Fruits',ico:'🍌',txt:'Des fruits frais, souvent cultivés près de chez nous.',produits:[P('Mangues (3)',6,'mangue'),P('Bananes (le régime)',8,'banane'),P('Ananas',3,'ananas'),P('Oranges (le sachet)',4,'orange'),P('Avocats (3)',5,'avocat')]},
  {id:'legumes',nom:'Légumes',ico:'🥬',txt:'Des légumes pour la cuisine de tous les jours.',produits:[P('Tomates (1 kg)',5,'tomate'),P('Oignons (1 kg)',4,'oignon'),P('Feuilles de manioc (la botte)',2,'feuilles'),P('Aubergines (1 kg)',4,'aubergine'),P('Carottes (1 kg)',3,'carotte')]},
  {id:'viandes',nom:'Viandes, poissons et œufs',ico:'🍗',txt:'Des aliments riches en protéines, qui aident à grandir.',produits:[P('Poulet',18,'poulet'),P('Poisson fumé',15,'poisson'),P('Œufs (la douzaine)',9,'oeuf'),P('Viande de bœuf (1 kg)',22,'viande')]}]},
 {nom:'Épicerie et boissons',ico:'🌾',couleur:'#8d5a3b',rayons:[
  {id:'epicerie',nom:'Épicerie',ico:'🌾',txt:'Les aliments qui se conservent longtemps : farine, riz, huile, sel, sucre.',produits:[P('Farine de maïs (5 kg)',20,'sac'),P('Riz (2 kg)',9,'sac'),P('Haricots (1 kg)',6,'sac'),P('Sucre (1 kg)',5,'sac'),P('Sel (1 kg)',1,'boite'),P('Huile de palme (1 L)',7,'huile')]},
  {id:'boissons',nom:'Boissons',ico:'🥤',txt:'Eau, jus et lait. Regarde bien le prix au litre avant de choisir !',produits:[P('Eau (1,5 L)',2,'bouteille'),P('Jus d’ananas (1 L)',4,'jus'),P('Lait (1 L)',5,'brique'),P('Thé (la boîte)',3,'boite'),P('Café (250 g)',6,'boite')]},
  {id:'boulangerie',nom:'Boulangerie',ico:'🍞',txt:'Du pain et des gâteaux.',produits:[P('Pain',1,'pain'),P('Gâteau',12,'gateau'),P('Biscuits',3,'boite'),P('Beignets (le sachet)',2,'pain')]}]},
 {nom:'Maison, école et loisirs',ico:'🏠',couleur:'#6a3d9a',rayons:[
  {id:'ecole',nom:'École',ico:'✏️',txt:'Tout pour bien travailler en classe.',produits:[P('Cahier (96 pages)',2,'cahier'),P('Stylo bleu',1,'stylo'),P('Cartable',12,'cartable'),P('Règle',2,'regle'),P('Craie (la boîte)',3,'boite')]},
  {id:'maison',nom:'Maison',ico:'🏠',txt:'Des objets utiles pour la maison.',produits:[P('Savon',2,'savon'),P('Torche',6,'torche'),P('Seau',5,'seau'),P('Casserole',10,'casserole'),P('Eau de Javel (1 L)',4,'bouteille')]},
  {id:'loisirs',nom:'Jeux et loisirs',ico:'⚽',txt:'Pour jouer pendant les moments de repos.',produits:[P('Ballon',8,'ballon'),P('Corde à sauter',3,'corde'),P('Jeu de dames',7,'boite')]}]}
];
export const RAYONS=NIVEAUX_SUPER.flatMap(n=>n.rayons);
// budget : pièces dont tu disposes ; articles : [nom, prix à l'unité, quantité] ; comp : [nom, prix, quantité, unité] pour les deux offres à comparer
export const COURSES=[
 {t:'Le petit-déjeuner',b:20,a:[['Pain',1,4],['Lait (1 L)',5,2],['Sucre (1 kg)',5,1]],comp:[['Sucre 1 kg',5,1,'kg'],['Sucre 5 kg',22,5,'kg']]},
 {t:'Le marché de la semaine',b:60,a:[['Tomates (1 kg)',5,3],['Oignons (1 kg)',4,2],['Riz (2 kg)',9,2],['Huile (1 L)',7,1]],comp:[['Riz 2 kg',9,2,'kg'],['Riz 5 kg',20,5,'kg']]},
 {t:'Les fournitures scolaires',b:30,a:[['Cahier',2,6],['Stylo',1,4],['Crayon',1,3]],comp:[['Stylo (1)',1,1,'stylo'],['Stylo (lot de 10)',9,10,'stylo']]},
 {t:'La fête d’anniversaire',b:45,a:[['Jus d’ananas (1 L)',4,4],['Gâteau',12,1],['Mangues (3)',6,2]],comp:[['Jus 1 L',4,1,'litre'],['Jus 3 L',11,3,'litre']]},
 {t:'Le repas du dimanche',b:70,a:[['Farine de maïs (5 kg)',20,1],['Haricots (1 kg)',6,2],['Huile (1 L)',7,1],['Poisson fumé',15,2]],comp:[['Huile 1 L',7,1,'litre'],['Huile 5 L',30,5,'litre']]},
 {t:'Ma trousse et mon cartable',b:25,a:[['Cartable',12,1],['Cahier',2,4],['Stylo',1,3]],comp:[['Lait 1 L',5,1,'litre'],['Lait 2 L',11,2,'litre']]},
 {t:'Les produits d’entretien',b:30,a:[['Savon',2,5],['Eau de Javel (1 L)',4,2],['Éponge',1,3]],comp:[['Savon (1 pièce)',2,1,'savon'],['Savon (lot de 4)',7,4,'savon']]},
 {t:'Le goûter de l’école',b:35,a:[['Bananes (régime)',8,2],['Biscuits',3,4],['Eau (1,5 L)',2,3]],comp:[['Eau 1,5 L',2,1.5,'litre'],['Eau 5 L',8,5,'litre']]},
 {t:'Cuisiner pour la famille',b:80,a:[['Riz (2 kg)',9,3],['Tomates (1 kg)',5,4],['Oignons (1 kg)',4,2],['Poulet',18,1]],comp:[['Tomates 1 kg',5,1,'kg'],['Tomates 3 kg',12,3,'kg']]},
 {t:'Équiper la classe',b:50,a:[['Craie (boîte)',3,5],['Cahier',2,10],['Règle',2,4]],comp:[['Cahier (1)',2,1,'cahier'],['Cahier (lot de 10)',18,10,'cahier']]},
 {t:'Les fruits de la semaine',b:40,a:[['Mangues (3)',6,3],['Ananas',3,4],['Bananes (régime)',8,1]],comp:[['Mangues (3)',6,3,'mangue'],['Mangues (lot de 10)',18,10,'mangue']]},
 {t:'Le grand marché de fin de mois',b:100,a:[['Farine de maïs (5 kg)',20,2],['Riz (2 kg)',9,2],['Huile (1 L)',7,2],['Savon',2,4],['Sel (1 kg)',1,2]],comp:[['Farine 5 kg',20,5,'kg'],['Farine 10 kg',38,10,'kg']]}
];
