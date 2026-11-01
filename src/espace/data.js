// Données du BOYEKOLI SPACE EXPLORER : planètes, missions, niveaux, expériences de gravité, quiz Saturne.
export const PLANETES=[
 {id:'soleil',nom:'Le Soleil',r:5,d:0,col:'#ffcf3a',per:0,g:274,txt:'Une étoile : une boule de gaz brûlant. Sa lumière met environ 8 minutes à nous parvenir. Il contient 99 % de la masse du système solaire.'},
 {id:'mercure',nom:'Mercure',r:.6,d:9,col:'#9a8f86',per:.9,g:3.7,txt:'La plus petite planète et la plus proche du Soleil. Une année y dure seulement 88 jours terrestres.'},
 {id:'venus',nom:'Vénus',r:.95,d:13,col:'#e0b870',per:.7,g:8.9,txt:'La planète la plus chaude (environ 460 °C) à cause de son épaisse atmosphère de gaz à effet de serre.'},
 {id:'terre',nom:'La Terre',r:1,d:18,col:'#2f6fb5',per:.55,g:9.8,txt:'Notre planète, la seule connue où vit la vie. 71 % de sa surface est recouverte d’eau. Touche « Observer le Congo » dans Univers !'},
 {id:'mars',nom:'Mars',r:.8,d:23,col:'#b5572f',per:.45,g:3.7,txt:'La planète rouge, à cause de la rouille (oxyde de fer) de son sol. Elle possède le plus grand volcan du système solaire : Olympus Mons.'},
 {id:'jupiter',nom:'Jupiter',r:2.6,d:31,col:'#d8b48a',per:.25,g:24.8,txt:'La plus grosse planète : plus de 1 300 Terres tiendraient dedans. Sa Grande Tache Rouge est une tempête géante.'},
 {id:'saturne',nom:'Saturne',r:2.2,d:40,col:'#e6d29a',per:.18,g:10.4,txt:'Célèbre pour ses anneaux faits de glace et de roches. Elle est si légère qu’elle flotterait sur l’eau.',anneau:1},
 {id:'uranus',nom:'Uranus',r:1.5,d:47,col:'#8fd3d9',per:.12,g:8.7,txt:'Une planète de glace qui tourne couchée sur le côté. Elle est bleu-vert à cause du méthane.'},
 {id:'neptune',nom:'Neptune',r:1.45,d:53,col:'#3b5fc9',per:.09,g:11.2,txt:'La planète la plus éloignée du Soleil, battue par des vents supersoniques. Une année y dure 165 ans.'}];
export const MISSIONS=[
 {id:'s1',nom:'Décollage',type:'vol',corps:'terre',txt:'Lance ta fusée et dépasse 40 d’altitude.',pieces:6},
 {id:'s2',nom:'Mise en orbite',type:'vol',corps:'terre',txt:'Atteins l’orbite : altitude 120 à 260 et vitesse horizontale égale à la vitesse orbitale pendant 3 secondes.',pieces:8},
 {id:'s3',nom:'Mise en orbite d’un satellite',type:'vol',corps:'terre',txt:'Mets-toi en orbite puis déploie le satellite.',pieces:8},
 {id:'s4',nom:'Station spatiale et amarrage',type:'vol',corps:'terre',txt:'Atteins l’orbite avec du carburant restant, puis amarre-toi à la station.',pieces:8},
 {id:'s5',nom:'Cap sur la Lune',type:'vol',corps:'terre',txt:'Depuis l’orbite, accélère jusqu’à la vitesse de transfert vers la Lune (1,38 fois la vitesse orbitale).',pieces:8},
 {id:'s6',nom:'Alunissage',type:'vol',corps:'lune',txt:'Pose le module lunaire en douceur sur la Lune (vitesse de chute inférieure à 6).',pieces:10},
 {id:'s7',nom:'Rover lunaire',type:'rover',corps:'lune',txt:'Conduis le rover et récolte 5 échantillons de roche lunaire.',pieces:8},
 {id:'s8',nom:'Rover martien',type:'rover',corps:'mars',txt:'Explore Mars avec le rover et récolte 5 échantillons.',pieces:8},
 {id:'s9',nom:'Atterrissage sur un astéroïde',type:'vol',corps:'aster',txt:'Pose-toi sur l’astéroïde : la gravité y est minuscule.',pieces:10},
 {id:'s10',nom:'La station spatiale',type:'station',txt:'Visite les 5 modules de la station et découvre leur rôle.',pieces:8},
 {id:'s11',nom:'Voyage vers Saturne',type:'quiz',txt:'Prépare le voyage : réponds correctement à au moins 3 questions sur Saturne.',pieces:8},
 {id:'s12',nom:'La mission complète',type:'vol',corps:'terre',txt:'Décolle, mets-toi en orbite puis pose le module lunaire sur la Lune.',pieces:15}];
export const NIVEAUX=[[0,'Apprenti astronaute','🧑‍🚀'],[3,'Cadet de l’espace','🛰'],[6,'Pilote spatial','🚀'],[9,'Explorateur','🌙'],[12,'Commandant','🏅']];
export const MODULES=[
 {id:'labo',nom:'Laboratoire Columbus',col:'#e8e8e8',txt:'On y fait des expériences impossibles sur Terre : cristaux, plantes, médecine, en apesanteur.'},
 {id:'habit',nom:'Module d’habitation',col:'#d9c7a0',txt:'Les astronautes y dorment (accrochés à un sac de couchage mural) et y mangent des repas réhydratés.'},
 {id:'solaire',nom:'Panneaux solaires',col:'#1b3a6b',txt:'Ils transforment la lumière du Soleil en électricité. La station voit 16 levers de soleil par jour !'},
 {id:'sas',nom:'Sas et bras robotisé',col:'#b5572f',txt:'Le sas permet de sortir dans l’espace en combinaison. Le bras robotisé attrape les vaisseaux de ravitaillement.'},
 {id:'coupole',nom:'Coupole d’observation',col:'#2c7fb8',txt:'Sept grandes fenêtres pour admirer la Terre. On peut y repérer le fleuve Congo et ses forêts.'}];
export const SATURNE=[
 ['Saturne est surtout connue pour…',['ses anneaux','ses volcans de glace','sa couleur verte','ses océans'],0,'Ses anneaux de glace et de roches sont visibles avec un petit télescope.'],
 ['Saturne est une planète…',['rocheuse','gazeuse','de métal','de verre'],1,'Saturne est une géante gazeuse faite surtout d’hydrogène et d’hélium.'],
 ['Pourquoi Saturne est-elle très éloignée de la Terre ?',['Elle est la 6e planète à partir du Soleil','Elle est collée à la Lune','Elle est derrière Mars','Elle voyage sur Terre'],0,'Elle est environ 9 fois plus loin du Soleil que la Terre : le voyage prend des années.'],
 ['Les anneaux de Saturne sont faits de…',['glace et de roches','feu','sable du Congo','bois'],0,'Des milliards de morceaux de glace et de roches tournent autour de la planète.']];
export const CORPS_G=[['Terre',9.8],['Lune',1.6],['Mars',3.7],['Jupiter',24.8]];
