// Données du BOYEKOLI DESIGN STUDIO : catalogue, styles, notions d'architecture, missions.
export const COULEURS_MUR=['#f2e3c6','#ffffff','#e8c9a0','#c9733d','#b5835a','#8fb8a8','#f4d35e','#e07a5f','#9db4c0','#c8b6e2'];
export const COULEURS_TOIT=['#b5503c','#8a8d91','#3b6ea5','#2f6b3a','#5a3b2a','#b08d57'];
export const TEXTURES_MUR=[['uni','Peinture unie'],['brique','Briques'],['wax','Motif wax'],['pierre','Pierre']];
export const SOLS=[['carrelage','Carrelage'],['bois','Parquet'],['beton','Béton ciré'],['terre','Terre cuite']];
export const TOITS=[['plat','Toit plat'],['2p','Deux pentes'],['4p','Quatre pentes']];
export const STYLES=[
 {id:'afr',nom:'Africain contemporain',cm:'#c9733d',ct:'#5a3b2a',tm:'wax',toit:'4p',txt:'Couleurs chaudes de la terre et motifs wax inspirés des pagnes.'},
 {id:'cgo',nom:'Congolais traditionnel',cm:'#b5835a',ct:'#b08d57',tm:'uni',toit:'4p',txt:'Murs en terre et toit de chaume, bien ventilés contre la chaleur.'},
 {id:'kin',nom:'Kinshasa moderne',cm:'#ffffff',ct:'#3b6ea5',tm:'uni',toit:'2p',txt:'Murs clairs, toit en tôle colorée et parcelle fermée par une clôture.'},
 {id:'ctp',nom:'Contemporain',cm:'#e8e8ea',ct:'#8a8d91',tm:'pierre',toit:'plat',txt:'Lignes simples, toit plat et grandes surfaces claires.'}];
// catalogue : w,d en mètres ; cat : pièce ; ext = placé à l'extérieur ; plat = posé au sol sans volume (tapis)
export const CATALOGUE=[
 ['canape','Canapé','Salon','🛋',2.0,.9],['fauteuil','Fauteuil','Salon','💺',.9,.9],['tablebasse','Table basse','Salon','🪵',1.0,.6],['tv','Meuble TV','Salon','📺',1.4,.45],['etagere','Étagère','Salon','📚',1.0,.35],['tapis','Tapis','Salon','🟫',2.0,1.4,'plat'],['table','Table à manger','Salon','🍽',1.4,.9],['chaise','Chaise','Salon','🪑',.45,.45],
 ['lit','Grand lit','Chambre','🛏',1.4,2.0],['litS','Lit simple','Chambre','🛏',.9,2.0],['armoire','Armoire','Chambre','🚪',1.2,.55],['commode','Commode','Chambre','🗄',.9,.45],['bureau','Bureau','Chambre','🖥',1.2,.6],
 ['frigo','Réfrigérateur','Cuisine','🧊',.7,.7],['cuisiniere','Cuisinière','Cuisine','🍳',.6,.6],['evier','Évier','Cuisine','🚰',1.2,.6],
 ['wc','Toilettes','Bain','🚽',.4,.7],['douche','Douche','Bain','🚿',.9,.9],['lavabo','Lavabo','Bain','🪥',.6,.45],
 ['plante','Plante','Déco','🪴',.4,.4],['lampe','Lampadaire','Déco','💡',.3,.3],
 ['arbre','Arbre','Extérieur','🌳',1.4,1.4,'ext'],['palmier','Palmier','Extérieur','🌴',1.0,1.0,'ext'],['banc','Banc','Extérieur','🪑',1.4,.5,'ext'],['voiture','Voiture','Extérieur','🚗',2.0,4.2,'ext'],['barbecue','Barbecue','Extérieur','🔥',.8,.6,'ext'],['bacfleurs','Bac à fleurs','Extérieur','🌺',.8,.4,'ext']
].map(a=>({id:a[0],nom:a[1],cat:a[2],ico:a[3],w:a[4],d:a[5],plat:a[6]==='plat',ext:a[2]==='Extérieur'}));
export const CATS=['Salon','Chambre','Cuisine','Bain','Déco','Extérieur'];
export const NOTIONS=[
 ['📐 Le plan','Avant de construire, l’architecte dessine un plan : une vue de dessus qui montre les murs, les portes et les pièces à l’échelle.'],
 ['🧱 Les fondations','Ce sont la base cachée de la maison. Elles répartissent le poids sur le sol pour que la maison ne s’enfonce pas.'],
 ['🏗 Murs porteurs et cloisons','Les murs porteurs soutiennent le toit. Les cloisons séparent seulement les pièces et peuvent être déplacées plus facilement.'],
 ['🏠 Le toit','Un toit en pente évacue l’eau de la saison des pluies. Un toit plat est plus simple mais demande une bonne étanchéité.'],
 ['🌬 La ventilation','Des fenêtres sur deux côtés opposés créent un courant d’air qui rafraîchit la maison sans électricité.'],
 ['☀️ La lumière','Les grandes fenêtres éclairent la journée. Une terrasse couverte protège du soleil fort et de la pluie.'],
 ['🚪 La circulation','Les portes et couloirs doivent permettre de passer sans obstacle : on garde un passage libre d’au moins 80 cm.'],
 ['🧭 L’orientation','Au Congo, on protège les chambres du soleil de l’après-midi et on ouvre la maison côté vent pour rester au frais.'],
 ['🌍 Matériaux locaux','Briques de terre, bois, tôle, pierre : choisir des matériaux de la région réduit les coûts et s’adapte au climat.']];
// Missions : critères évalués sur le projet (voir design.js)
export const MISSIONS={
 m1:{id:'m1',nom:'Ma première maison',dossier:'a1',intro:'Dessine une maison simple : dimensions, murs, portes, fenêtres, toit, puis ajoute les meubles principaux.',
  req:['Surface d’au moins 30 m²','Au moins 1 porte','Au moins 2 fenêtres','Un toit à pentes','Au moins 2 pièces','Un lit','Une table'],opt:['Un jardin ou une clôture','Au moins 8 meubles'],pieces:10},
 m2:{id:'m2',nom:'La villa familiale',dossier:'a2',intro:'Conçois une villa de 4 pièces pour une famille : cuisine, salle de bain, chambre, salon et extérieur.',
  req:['Surface d’au moins 60 m²','4 pièces','Au moins 2 portes','Au moins 4 fenêtres','Cuisine : réfrigérateur et cuisinière','Salle de bain : toilettes et douche','Salon : canapé et table','Chambre : un lit','Une clôture','Un arbre ou un palmier'],opt:['Une terrasse','Un garage','Un style africain (wax ou terre cuite)','Un toit incliné'],pieces:15}};
