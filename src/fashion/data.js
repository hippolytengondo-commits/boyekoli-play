// Données du BOYEKOLI FASHION STUDIO (contenu préprogrammé).
export const MODELES=[
 {id:'scolaire',nom:'Tenue scolaire',ico:'🎒',haut:1,manches:'courtes',bas:'auto',hautBlanc:1},
 {id:'robe',nom:'Robe d’été',ico:'👗',haut:1,manches:'aucune',bas:'robe'},
 {id:'robeC',nom:'Robe de cérémonie',ico:'👰',haut:1,manches:'courtes',bas:'robeL'},
 {id:'pagne',nom:'Pagne et blouse',ico:'🧣',haut:1,manches:'courtes',bas:'pagne',hautBlanc:1},
 {id:'boubou',nom:'Boubou',ico:'🥻',haut:1,manches:'larges',bas:'boubou'},
 {id:'costume',nom:'Costume',ico:'🤵',haut:1,manches:'longues',bas:'pantalon',veste:1},
 {id:'sport',nom:'Tenue sportive',ico:'🏃',haut:1,manches:'courtes',bas:'short'},
 {id:'chemise',nom:'Chemise et pantalon',ico:'👔',haut:1,manches:'longues',bas:'pantalon'},
 {id:'jupe',nom:'Haut et jupe',ico:'👚',haut:1,manches:'courtes',bas:'jupe'}];
export const COULEURS=['#ffffff','#1b3a6b','#2e7d32','#c0392b','#f4c20d','#e07a5f','#7b3fa0','#e84393','#2c3e50','#8a5a2b','#1b9aa8','#222222'];
export const TISSUS=[['coton','Coton'],['wax','Wax'],['bazin','Bazin riche'],['jean','Jean'],['soie','Soie']];
export const MOTIFS=[['aucun','Sans motif'],['rayures','Rayures'],['pois','Pois'],['losanges','Losanges']];
export const ACCESS=[['aucun','Aucun'],['collier','📿 Collier'],['sac','👜 Sac'],['chapeau','🎩 Chapeau'],['lunettes','🕶 Lunettes']];
export const COIFFURES=[['courtes','Courtes'],['afro','Afro'],['tresses','Tresses'],['locks','Locks'],['chignon','Chignon'],['noeuds','Nœuds bantous'],['gele','Foulard (gélé)']];
export const PEAUX=['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'];
export const COULEURS_CHEVEUX=['#111111','#3b2417','#7a4a2e','#c0392b','#e8c04a','#5a3b8a'];
export const LEVRES=['#b5314a','#d9606f','#7a1f2b','#e08a5c','#8a3a8a'];
export const YEUX=['#3b2a1a','#2a4d8a','#2e7d32','#8a3a8a','#c9a227'];
export const OUTILS={ruban:['📏','Ruban à mesurer'],craie:['🖍','Craie de tailleur'],ciseaux:['✂️','Ciseaux de couture'],machine:['🧵','Machine à coudre'],fer:['♨️','Fer à repasser'],marteau:['🔨','Marteau'],cuillere:['🥄','Cuillère'],pelle:['⛏','Pelle']};
export const ETAPES=[
 {q:'Prendre les mesures du client (tour de poitrine, de taille)',o:'ruban',txt:'Le tailleur mesure d’abord le corps : tout le patron dépend de ces mesures.'},
 {q:'Tracer le patron sur le tissu',o:'craie',txt:'On dessine les contours à la craie avant de couper.'},
 {q:'Couper le tissu en suivant les traits',o:'ciseaux',txt:'Des ciseaux de couture bien aiguisés coupent droit sans abîmer le tissu.'},
 {q:'Assembler les morceaux',o:'machine',txt:'La machine à coudre relie les pièces avec des points solides.'},
 {q:'Faire les finitions : lisser les plis',o:'fer',txt:'Le fer à repasser donne un beau rendu final.'}];
export const CULTURE=[
 ['Comment appelle-t-on le tissu de coton coloré très répandu en Afrique ?',['Le wax','Le jean','La soie sauvage','Le cuir'],0,'Le wax (pagne) est un tissu imprimé coloré.'],
 ['Au Congo, le grand mouvement d’élégance des « sapeurs » signifie…',['Société des Ambianceurs et des Personnes Élégantes','Société des Artisans Peintres','Service de Pompiers','Sport et Plein air'],0,'La SAPE : Société des Ambianceurs et des Personnes Élégantes.'],
 ['Pour un pagne de 2 m à 3 000 FC le mètre, le prix est…',['5 000 FC','6 000 FC','3 000 FC','9 000 FC'],1,'2 × 3 000 = 6 000 FC.'],
 ['Pourquoi se laver et peigner ses cheveux régulièrement ?',['Pour l’hygiène et la santé','Pour rien','Pour perdre du temps','Pour faire peur'],0,'L’hygiène évite poux et infections.'],
 ['Un défilé de mode sert à…',['présenter des créations','vendre du riz','réparer des vélos','compter des chèvres'],0,'Les mannequins présentent les créations.']];
export const MISSIONS={
 f1:{nom:'La tenue scolaire',txt:'Couds une tenue scolaire en coton, dans une couleur sobre (bleu, vert, gris, noir ou blanc).',pieces:8},
 f2:{nom:'La robe de cérémonie',txt:'Crée une robe de cérémonie, un boubou ou un costume en bazin, soie ou wax, avec boutons ou accessoire.',pieces:8},
 f3:{nom:'La tenue congolaise',txt:'Couds un pagne et blouse ou un boubou en wax ou en bazin.',pieces:8},
 f4:{nom:'La coiffure africaine',txt:'Compose une coiffure africaine (afro, tresses, locks, chignon, nœuds ou gélé) et valide-la dans le salon.',pieces:8},
 f5:{nom:'Ma collection',txt:'Range 3 tenues cousues de modèles différents dans ton portfolio.',pieces:10},
 f6:{nom:'Le grand défilé',txt:'Présente 3 tenues sur le podium et réussis au moins 2 poses.',pieces:12},
 f7:{nom:'La tenue sportive',txt:'Couds une tenue sportive en coton.',pieces:8}};
