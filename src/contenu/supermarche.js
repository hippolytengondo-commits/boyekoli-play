// Supermarché : rayons (catégories de produits et prix) et défis de courses. Les prix sont ceux du jeu, en pièces.
// Ajouter un produit ou un défi = ajouter une ligne ici ; les réponses sont calculées par le programme.
export const RAYONS=[
 {id:'fruits',nom:'Fruits et légumes',ico:'🍅',modeles:['mangue','banane','tomate','oignon','feuilles','ananas'],txt:'Des produits frais, souvent cultivés près de chez nous.',produits:[
  {n:'Mangues (3)',p:6},{n:'Bananes (le régime)',p:8},{n:'Tomates (1 kg)',p:5},{n:'Oignons (1 kg)',p:4},{n:'Feuilles de manioc (la botte)',p:2},{n:'Ananas',p:3}]},
 {id:'epicerie',nom:'Épicerie',ico:'🌾',modeles:['sac','sac','huile','boite','sac','sac'],txt:'Les aliments qui se conservent longtemps : farine, riz, huile, sel, sucre.',produits:[
  {n:'Farine de maïs (5 kg)',p:20},{n:'Riz (2 kg)',p:9},{n:'Huile de palme (1 L)',p:7},{n:'Sel (1 kg)',p:1},{n:'Sucre (1 kg)',p:5},{n:'Haricots (1 kg)',p:6}]},
 {id:'boissons',nom:'Boissons',ico:'🥤',modeles:['bouteille','jus','brique','boite'],txt:'Eau, jus et lait. Regarde bien le prix au litre avant de choisir !',produits:[
  {n:'Eau (1,5 L)',p:2},{n:'Jus d’ananas (1 L)',p:4},{n:'Lait (1 L)',p:5},{n:'Thé (la boîte)',p:3}]},
 {id:'ecole',nom:'École et maison',ico:'✏️',modeles:['cahier','stylo','savon','torche'],txt:'Cahiers, stylos et produits pour la maison.',produits:[
  {n:'Cahier (96 pages)',p:2},{n:'Stylo bleu',p:1},{n:'Savon',p:2},{n:'Torche',p:6}]}
];
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
