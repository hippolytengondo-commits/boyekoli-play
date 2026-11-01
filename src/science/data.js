// BOYEKOLI SCIENCE LAB – contenu préprogrammé. Toutes les expériences sont des SIMULATIONS sans danger : elles ne remplacent pas
// une vraie manipulation encadrée par un adulte, et aucun produit réel n'est à toucher ou à goûter.
const Q=(q,c,a,exp)=>({q,c,a,exp});
const S=(x0,z0,x1,z1,coul,nom)=>({x0,z0,x1,z1,coul,nom});
const MU=(x0,z0,x1,z1,portes)=>({x0,z0,x1,z1,portes:portes||[]});
const B=(id,nom,x,z,w,d,h,c,o)=>Object.assign({id,nom,x,z,w,d,h,c,bloque:true},o||{});
const PNJ=(id,nom,role,x,z,ry,look,o)=>Object.assign({id,nom,role,x,z,ry,look},o||{});
const FLASK=(x,y,c)=>[{t:'cyl',r:.11,r2:.11,h:.3,x,y:y+.15,c:'#cfe8ff',op:.4},{t:'cyl',r:.09,r2:.09,h:.18,x,y:y+.09,c,op:.85}];

export const COULEURS_BLOUSE=['#ffffff','#bfe3ff','#ffd9e6','#d8f3dc','#ffe9a8','#e6d9ff'];
export const DECOS=[
  {id:'affiche',ico:'🖼',nom:'Affiche du tableau périodique',exp:'c1',x:-4.2,z:8.6,w:2.2,d:.15,h:1.6,c:'#cfe0f0',plaque:true},
  {id:'plante',ico:'🪴',nom:'Plante de laboratoire',exp:'c2',x:-6.4,z:2.8,w:.6,d:.6,h:1.1,c:'#2e7d32'},
  {id:'globe',ico:'🌍',nom:'Globe terrestre',exp:'c3',x:3.2,z:3,w:.7,d:.7,h:1.2,c:'#2c7fb8'},
  {id:'micro_deco',ico:'🔬',nom:'Microscope de collection',exp:'b1',x:-2,z:3,w:.5,d:.5,h:1.2,c:'#333'},
  {id:'trophee',ico:'🏆',nom:'Trophée du jeune chercheur',exp:'b3',x:3.4,z:8.2,w:.5,d:.5,h:1.1,c:'#e0b020'},
  {id:'squelette',ico:'💀',nom:'Modèle du squelette',exp:'b2',x:-6.4,z:7.6,w:.6,d:.5,h:1.9,c:'#f2ead6'},
  {id:'ampoule',ico:'💡',nom:'Lampe d’inventeur',exp:'p1',x:-1,z:2.6,w:.4,d:.4,h:1.0,c:'#ffe066'},
  {id:'balance_d',ico:'⚖️',nom:'Balance décorative',exp:'p2',x:1.4,z:2.8,w:.7,d:.4,h:.9,c:'#c0c4cc'},
  {id:'fusee',ico:'🚀',nom:'Maquette de fusée',exp:'p3',x:3.4,z:5.4,w:.4,d:.4,h:1.6,c:'#d6302b'}
];
// ---------- le bâtiment ----------
export const LAB={
  nom:'BOYEKOLI SCIENCE LAB',
  start:{x:-14,z:6},
  sols:[S(-16,-9,-8,0,'#e3f1f8','Laboratoire de chimie'),S(-8,-9,0,0,'#e5f3e3','Laboratoire de biologie'),S(0,-9,8,0,'#f6f0dc','Laboratoire de physique'),S(8,-9,16,0,'#e8e3f2','Microscopie et observation'),
        S(-16,0,-8,9,'#f0ece4','Réception'),S(-8,0,0,9,'#eef0f2','Salle de recherche'),S(0,0,8,9,'#d9d2c3','Stockage du matériel'),S(8,0,16,9,'#e9dcc9','Bureau du chercheur')],
  murs:[MU(-16,-9,16,-9),MU(-16,9,16,9),MU(-16,-9,-16,9,[[6,2.6]]),MU(16,-9,16,9),
    MU(-16,0,16,0,[[-12,2.6],[-4,2.6],[4,2.6],[12,2.6]]),
    MU(-8,-9,-8,9,[[-4.5,2.4],[4.5,2.4]]),MU(0,-9,0,9,[[-4.5,2.4],[4.5,2.4]]),MU(8,-9,8,9,[[-4.5,2.4],[4.5,2.4]])],
  objets:[
    // chimie
    B('paillasse_c','Paillasse de chimie',-12,-6.4,6,1.6,.95,'#f5f5f5',{panneau:'chimie',label:'⚗️ Expériences de chimie',ex:'La grande paillasse du laboratoire de chimie : béchers, éprouvettes, pipettes, balance et thermomètre.',parts:[{t:'box',w:6,h:.95,d:1.6,y:.475,c:'#f2f2f2'},{t:'box',w:6.1,h:.06,d:1.7,y:.98,c:'#2a2f3a'},...FLASK(-2,1.0,'#e74c3c'),...FLASK(-1.2,1.0,'#f1c40f'),...FLASK(-.4,1.0,'#2e86de'),...FLASK(.5,1.0,'#8e44ad'),{t:'box',w:.5,h:.08,d:.4,x:1.8,y:1.04,c:'#222'},{t:'cyl',r:.03,r2:.03,h:.8,x:2.6,y:1.4,c:'#777'}]}),
    B('etagere_c','Armoire à produits (fictifs)',-15.2,-4,.5,3.4,2,'#d6e0e6',{ex:'Des flacons de produits fictifs pour enfants : eau colorée, jus de chou rouge, vinaigre et bicarbonate simulés.'}),
    // biologie
    B('paillasse_b','Paillasse de biologie',-4,-6.4,6,1.6,.95,'#f5f5f5',{panneau:'biologie',label:'🌱 Expériences de biologie',ex:'La paillasse de biologie : microscope, plantes en pot, graines qui germent et modèles du corps humain.',parts:[{t:'box',w:6,h:.95,d:1.6,y:.475,c:'#f2f2f2'},{t:'box',w:6.1,h:.06,d:1.7,y:.98,c:'#3a4a3a'},{t:'cyl',r:.14,r2:.1,h:.2,x:-2,y:1.08,c:'#b5603a'},{t:'sph',r:.18,x:-2,y:1.3,c:'#2e9e4a'},{t:'cyl',r:.14,r2:.1,h:.2,x:-1.2,y:1.08,c:'#b5603a'},{t:'sph',r:.14,x:-1.2,y:1.28,c:'#3fbf5a'},{t:'box',w:.4,h:.5,d:.3,x:1,y:1.25,c:'#222'},{t:'cyl',r:.08,r2:.08,h:.4,x:1,y:1.6,c:'#777'},{t:'sph',r:.2,x:2.2,y:1.2,c:'#e74c3c'}]}),
    // physique
    B('paillasse_p','Paillasse de physique',4,-6.4,6,1.6,.95,'#f5f5f5',{panneau:'physique',label:'⚡ Expériences de physique',ex:'La paillasse de physique : piles, ampoules, aimants, leviers, miroirs et lentilles.',parts:[{t:'box',w:6,h:.95,d:1.6,y:.475,c:'#f2f2f2'},{t:'box',w:6.1,h:.06,d:1.7,y:.98,c:'#3a3a4a'},{t:'cyl',r:.14,r2:.14,h:.5,x:-2,y:1.25,c:'#2e9e4a'},{t:'sph',r:.16,x:-.6,y:1.2,c:'#ffe066',op:.9},{t:'box',w:2.6,h:.05,d:.3,x:1.2,y:1.15,c:'#c0c4cc'},{t:'box',w:.2,h:.4,d:.3,x:1.2,y:1.0,c:'#555'},{t:'box',w:.6,h:.04,d:.4,x:2.4,y:1.05,c:'#9fd3f5',op:.6}]}),
    // microscopie / observation
    B('microscope_g','Salle de microscopie',12,-6.5,4,1.4,.95,'#f5f5f5',{panneau:'biologie',label:'🔬 Microscope : observer les cellules',ex:'Un microscope avec lequel on observe des cellules agrandies.',parts:[{t:'box',w:4,h:.95,d:1.4,y:.475,c:'#f2f2f2'},{t:'box',w:.5,h:.08,d:.4,x:-.5,y:1.0,c:'#222'},{t:'cyl',r:.06,r2:.06,h:.6,x:-.5,y:1.35,c:'#555'},{t:'cyl',r:.1,r2:.1,h:.3,x:-.4,y:1.6,c:'#888'},{t:'box',w:.5,h:.08,d:.4,x:1,y:1.0,c:'#222'},{t:'cyl',r:.06,r2:.06,h:.6,x:1,y:1.35,c:'#555'}]}),
    B('telescope_o','Hublot d’observation',14.5,-3,.4,3,2.2,'#2b3f6b',{ex:'La salle d’observation : par le hublot on observe le ciel. (Un vrai télescope est utilisé à l’extérieur, avec un adulte.)',parts:[{t:'box',w:.3,h:2.2,d:3,y:1.1,c:'#2b3f6b'},{t:'cyl',r:.8,r2:.8,h:.2,x:-.1,y:1.4,c:'#0b1020',seg:20}]}),
    // réception
    B('accueil','Comptoir de réception',-12,5.6,3.6,1.1,1,'#c9a06a'),
    B('vestiaire','Porte-blouses',-15.3,1.8,.6,2.6,1.8,'#7a5a3a',{panneau:'perso',label:'🥼 Vestiaire : blouse et lunettes',ex:'Le vestiaire : on choisit sa blouse de laboratoire et ses lunettes de protection.',parts:[{t:'box',w:.2,h:1.8,d:2.6,y:.9,c:'#7a5a3a'},{t:'box',w:.5,h:.9,d:.5,x:.1,y:1.2,z:-.8,c:'#ffffff'},{t:'box',w:.5,h:.9,d:.5,x:.1,y:1.2,z:0,c:'#bfe3ff'},{t:'box',w:.5,h:.9,d:.5,x:.1,y:1.2,z:.8,c:'#ffd9e6'}]}),
    B('regles','Règles de sécurité',-9,8.7,3.2,.15,1.4,'#fff3c4',{plaque:true,ex:'Règles du laboratoire : 1) On ne goûte jamais un produit. 2) On porte une blouse et des lunettes. 3) On demande l’aide d’un adulte. 4) On range le matériel. (Ici, tout est simulé.)',bloque:false}),
    // recherche
    B('ordinateur_r','Ordinateur du laboratoire',-4,7.8,1,.6,1.3,'#222',{panneau:'dossiers',label:'💻 Dossiers et progression',ex:'L’ordinateur qui garde tes résultats et ton carnet de découvertes.',bloque:false}),
    B('table_r','Grande table de recherche',-4,5,4.4,1.6,.9,'#a0794a'),
    B('tableau_r','Tableau des découvertes',-6,0.7,.2,.2,.2,'#333',{plaque:true,bloque:false}),
    // stockage
    B('rayon1','Rayon de matériel',2,7.8,3,.8,1.8,'#6b4423',{ex:'Éprouvettes, béchers, pipettes, entonnoirs et supports : du matériel rangé par type.'}),
    B('rayon2','Rayon des instruments',6.8,5,.8,3,1.8,'#6b4423',{ex:'Thermomètres, loupes, miroirs, lentilles, aimants et piles.'}),
    B('caisses','Caisses de matériel',2,3,1.4,1.4,.8,'#b5763a'),
    // bureau
    B('bureau_ch','Bureau du chercheur',12,7.6,3.6,1.3,.9,'#7a4a26'),
    B('diplome','Diplômes',11,8.7,2.4,.15,1.2,'#f0e6c8',{plaque:true,bloque:false,ex:'Les diplômes du professeur : sciences, recherche et enseignement.'}),
    B('certif_b','Certificat de jeune scientifique',14.5,5,.2,.2,.2,'#f0e6c8',{panneau:'certif',label:'🎓 Certificat de jeune scientifique',bloque:false,plaque:true,ex:'Le certificat que le professeur remet aux jeunes chercheurs.'})
  ],
  pnj:[
    PNJ('kabila','Mme Kabila','Réceptionniste',-12.5,7.2,Math.PI,{s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#ffffff'},{dial:'kabila'}),
    PNJ('kasongo','Pr Kasongo','Chercheur en chef',12,5.6,Math.PI,{s:'h',skin:1,hair:'courtes',outfit:'uniforme',c:'#ffffff',acc:['lunettes']},{dial:'kasongo'}),
    PNJ('lea','Léa','Assistante de laboratoire',-9.4,-4,Math.PI*.7,{s:'f',skin:4,hair:'chignon',outfit:'uniforme',c:'#bfe3ff',acc:['lunettes']},{dial:'lea'}),
    PNJ('junior','Junior','Élève chercheur',-5,-3,Math.PI*.3,{s:'h',skin:2,hair:'courtes',outfit:'uniforme',c:'#d8f3dc',h:.8},{dial:'junior'})
  ],
  sorties:[{id:'sortie',x:-15.2,z:6,r:1.6,label:'🚪 Sortir du laboratoire'}]
};
export const DIAL={
  kabila:{nom:'Mme Kabila, réceptionniste',n0:{t:'Bienvenue au BOYEKOLI SCIENCE LAB ! Ici, tu vas devenir un jeune scientifique. Prends une blouse au vestiaire : la sécurité d’abord !',c:[['Quelles sont les règles ?','n1'],['Où faire des expériences ?','n2'],['Merci.',null]]},
    n1:{t:'On ne goûte JAMAIS un produit, on se lave les mains, on porte ses lunettes, et on demande l’aide d’un adulte. Dans ce laboratoire, tout est simulé : c’est un jeu pour apprendre.',c:[['Merci.','n0']]},
    n2:{t:'Trois laboratoires t’attendent : la chimie (au nord-ouest), la biologie et la physique. Les paillasses sont au fond de chaque salle.',c:[['Merci.','n0']]}},
  kasongo:{nom:'Professeur Kasongo',n0:{t:'Je suis le professeur Kasongo. Un scientifique observe, pose une question, fait une expérience, note ses résultats et tire une conclusion. Prêt ?',c:[['Pourquoi expérimenter ?','n1'],['Je veux mon certificat.','n2'],['À bientôt.',null]]},
    n1:{t:'Parce qu’on apprend mieux en essayant ! Et parce qu’un résultat doit toujours pouvoir être vérifié en recommençant.',c:[['Merci.','n0']]},
    n2:{t:'Réussis les trois laboratoires (chimie, biologie, physique) puis viens voir le certificat accroché dans mon bureau.',c:[['D’accord.','n0']]}},
  lea:{nom:'Léa, assistante',n0:{t:'Je prépare les expériences de biologie. Regarde au microscope : une feuille est faite de milliers de petites cellules !',c:[['C’est quoi une cellule ?','n1'],['Merci.',null]]},
    n1:{t:'C’est la plus petite brique du vivant. Les plantes, les animaux et nous, nous sommes tous faits de cellules.',c:[['Merci.','n0']]}},
  junior:{nom:'Junior, élève chercheur',n0:{t:'Moi je préfère la chimie : on mélange des couleurs et ça fait des bulles ! Mais attention : à la maison, on ne mélange jamais des produits sans un adulte.',c:[['Bonne idée, merci !',null]]}}
};
// ---------- expériences ----------
export const GROUPES=[
  {id:'chimie',ico:'⚗️',nom:'Laboratoire de chimie',d:'l1',exps:['c1','c2','c3','c4'],requis:3},
  {id:'biologie',ico:'🌱',nom:'Laboratoire de biologie',d:'l2',exps:['b1','b2','b3'],requis:3},
  {id:'physique',ico:'⚡',nom:'Laboratoire de physique',d:'l3',exps:['p1','p2','p3','p4'],requis:3}
];
export const EXPS={
  c1:{nom:'Mélanger des couleurs',ico:'🎨',objectif:'Découvrir que l’on obtient de nouvelles couleurs en mélangeant des colorants.',materiel:['3 béchers','colorants alimentaires rouge, jaune, bleu (simulés)','eau'],etapes:['Verse deux colorants dans le bécher','Mélange avec la baguette','Observe la couleur obtenue','Réalise l’orange, le vert et le violet'],
    pre:Q('Que va-t-on obtenir en mélangeant du jaune et du bleu ?',['Du vert','Du rouge','Du noir','Du blanc'],0,'On va le vérifier !'),post:Q('Pourquoi le mélange de colorants change-t-il de couleur ?',['Les colorants se mélangent et forment une nouvelle couleur','Le bécher devient chaud','L’eau disparaît','Les colorants s’éteignent'],0,'Chaque colorant absorbe certaines couleurs de lumière ; ensemble, ils en absorbent d’autres.'),
    expl:'Rouge + jaune donne orange, jaune + bleu donne vert et rouge + bleu donne violet. Ce sont des mélanges : on peut les voir mais pas les séparer à l’œil.',res:'Tu as obtenu les trois couleurs secondaires.'},
  c2:{nom:'Acide ou base ? L’indicateur de chou rouge',ico:'🧪',objectif:'Reconnaître un acide, un neutre et une base grâce à un indicateur coloré virtuel.',materiel:['jus de chou rouge (simulé)','vinaigre, jus de citron, eau, bicarbonate et savon (simulés)'],etapes:['Choisis un liquide à tester','Ajoute l’indicateur de chou rouge','Observe la couleur','Classe le liquide : acide, neutre ou base'],
    pre:Q('Un indicateur coloré sert à…',['montrer si un liquide est acide ou basique','rendre l’eau potable','faire des bulles','refroidir un liquide'],0,'Le jus de chou rouge change de couleur selon l’acidité.'),post:Q('Le jus de chou rouge devient rose avec un acide. Quel liquide est acide ?',['Le vinaigre','Le bicarbonate','L’eau pure','Le savon'],0,'Le vinaigre et le citron sont acides.'),
    expl:'Le chou rouge contient un pigment qui change de couleur : rose/rouge avec un acide, violet avec un liquide neutre, bleu-vert avec une base. Dans la vraie vie, on ne goûte jamais ces liquides.',res:'Tu as classé les liquides.'},
  c3:{nom:'La réaction effervescente',ico:'🫧',objectif:'Observer une réaction chimique : un gaz se forme quand on mélange un acide et du bicarbonate.',materiel:['vinaigre (simulé)','bicarbonate (simulé)','ballon'],etapes:['Verse le vinaigre dans la fiole','Ajoute le bicarbonate','Observe les bulles','Regarde le ballon se gonfler'],
    pre:Q('Que va-t-il se passer si on mélange vinaigre et bicarbonate ?',['Des bulles vont apparaître','Le liquide va geler','Le liquide va disparaître','Rien du tout'],0,'Testons-le dans la simulation.'),post:Q('Quel gaz gonfle le ballon ?',['Le dioxyde de carbone','L’oxygène pur','L’hélium','Le gaz de la lumière'],0,'La réaction fabrique du dioxyde de carbone (CO₂).'),
    expl:'L’acide du vinaigre réagit avec le bicarbonate : c’est une réaction chimique. Elle fabrique du dioxyde de carbone, un gaz qui forme des bulles et gonfle le ballon.',res:'La réaction a produit un gaz.'},
  c4:{nom:'Les changements d’état de l’eau',ico:'🌡',objectif:'Comprendre que l’eau peut être solide, liquide ou gazeuse selon la température.',materiel:['thermomètre','bécher d’eau','source de chaleur (simulée)'],etapes:['Règle la température','Observe l’état de l’eau','Atteins 0 °C puis 100 °C'],
    pre:Q('À quelle température l’eau gèle-t-elle ?',['0 °C','50 °C','100 °C','200 °C'],0,'On va le voir sur le thermomètre.'),post:Q('Que devient l’eau à 100 °C ?',['De la vapeur (gaz)','De la glace','Du sable','Elle reste liquide'],0,'À 100 °C l’eau bout et devient vapeur.'),
    expl:'À 0 °C l’eau gèle (fusion/solidification), à 100 °C elle bout (vaporisation). Ce sont des changements d’état : l’eau reste de l’eau.',res:'Tu as observé les trois états.'},
  b1:{nom:'Cellules végétale et animale',ico:'🔬',objectif:'Observer au microscope une cellule végétale et une cellule animale et reconnaître leurs parties.',materiel:['microscope (simulé)','modèles de cellules en 3D'],etapes:['Choisis une cellule','Tourne et zoome','Touche les parties pour les découvrir','Retrouve le noyau et le chloroplaste'],
    pre:Q('Les êtres vivants sont faits de…',['cellules','pierres','bulles d’air','briques'],0,'Les cellules sont les briques du vivant.'),post:Q('Quelle partie existe dans la cellule végétale mais pas dans l’animale ?',['Le chloroplaste','Le noyau','La membrane','Le cytoplasme'],0,'Le chloroplaste capte la lumière pour fabriquer des aliments.'),
    expl:'Toutes les cellules ont une membrane, un cytoplasme et un noyau. La cellule végétale a en plus une paroi rigide, une grande vacuole et des chloroplastes verts.',res:'Tu as observé et identifié les parties des cellules.'},
  b2:{nom:'La germination et les parties d’une plante',ico:'🌱',objectif:'Découvrir ce dont une graine a besoin pour germer et les parties d’une plante.',materiel:['4 pots (simulés)','graines','eau','lumière'],etapes:['Observe les 4 pots','Fais défiler les jours','Compare les résultats','Nomme les parties de la plante'],
    pre:Q('De quoi une graine a-t-elle besoin pour germer ?',['D’eau et de chaleur','De musique','De sel','De sable seulement'],0,'On va tester différentes conditions.'),post:Q('Quelle partie de la plante absorbe l’eau du sol ?',['La racine','La fleur','La feuille','Le fruit'],0,'Les racines puisent l’eau et les sels minéraux.'),
    expl:'Une graine germe avec de l’eau et une température convenable. Ensuite la plante a besoin de lumière pour grandir. La racine absorbe l’eau, la tige soutient, les feuilles captent la lumière et la fleur fabrique les graines.',res:'Tu as comparé les conditions de germination.'},
  b3:{nom:'Les organes du corps humain',ico:'🫀',objectif:'Découvrir où se trouvent et à quoi servent quelques organes.',materiel:['modèle 3D du corps','fiches des organes'],etapes:['Touche un organe','Lis sa fonction','Trouve les 4 organes demandés'],
    pre:Q('Quel organe pompe le sang ?',['Le cœur','L’estomac','Le foie','Les poumons'],0,'Découvrons-le sur le modèle.'),post:Q('À quoi servent les poumons ?',['À respirer','À digérer','À pomper le sang','À penser'],0,'Les poumons apportent l’oxygène au sang.'),
    expl:'Le cœur pompe le sang, les poumons apportent l’oxygène, l’estomac commence la digestion et le cerveau commande le corps. Pour rester en bonne santé : bien manger, bouger, dormir et se laver les mains.',res:'Tu as trouvé les organes principaux.'},
  p1:{nom:'Circuit électrique et conducteurs',ico:'💡',objectif:'Allumer une ampoule avec un circuit fermé et découvrir quels matériaux conduisent l’électricité.',materiel:['pile','ampoule','interrupteur','fils','objets à tester'],etapes:['Place la pile, l’interrupteur et l’ampoule dans le circuit','Ferme l’interrupteur','Teste les matériaux : conducteur ou isolant ?'],
    pre:Q('Pour qu’une ampoule s’allume, le circuit doit être…',['fermé (sans coupure)','ouvert','très long','sans pile'],0,'Le courant doit pouvoir faire le tour du circuit.'),post:Q('Quel matériau est un bon conducteur ?',['Le cuivre (métal)','Le plastique','Le bois','Le caoutchouc'],0,'Les métaux conduisent l’électricité.'),
    expl:'Le courant électrique circule dans une boucle fermée. La pile fournit la tension, l’ampoule transforme l’énergie en lumière. Les métaux sont conducteurs ; le bois et le plastique sont isolants. (Ne touche jamais aux prises : c’est dangereux dans la vraie vie.)',res:'L’ampoule s’est allumée et tu as classé les matériaux.'},
  p2:{nom:'Leviers et équilibre',ico:'⚖️',objectif:'Comprendre qu’un levier est équilibré quand poids × distance sont égaux de chaque côté.',materiel:['balance à bras','masses'],etapes:['Déplace la masse sur le bras','Observe la balance','Équilibre 3 situations'],
    pre:Q('Un enfant léger sur une balançoire peut-il équilibrer un adulte ?',['Oui, en s’éloignant du centre','Non, jamais','Seulement en sautant','Seulement le dimanche'],0,'Cela dépend de la distance au centre.'),post:Q('Si la masse double, comment équilibrer ?',['La rapprocher du centre','L’éloigner','La retirer','Rien à faire'],0,'Poids × distance doivent être égaux.'),
    expl:'Un levier tourne autour d’un point d’appui. Il est en équilibre quand poids × distance (au centre) de chaque côté sont égaux. Les ouvre-boîtes, les brouettes et les balançoires sont des leviers.',res:'Tu as équilibré les leviers.'},
  p3:{nom:'Gravité et chute des objets',ico:'🍎',objectif:'Comparer la chute d’un objet sur la Terre, la Lune, Mars et Jupiter.',materiel:['balle','règle de hauteur','chronomètre'],etapes:['Choisis un astre','Lâche la balle','Observe le temps de chute','Compare'],
    pre:Q('Sur la Lune, une balle tombe…',['plus lentement que sur la Terre','plus vite','pareil','elle monte'],0,'La gravité de la Lune est plus faible.'),post:Q('Sur quel astre la balle tombe-t-elle le plus vite ?',['Jupiter','La Lune','Mars','Le Soleil n’est pas testé'],0,'Jupiter a la plus forte gravité.'),
    expl:'La gravité attire les objets vers le centre d’un astre. Elle est plus forte sur Jupiter (24,8 m/s²) que sur la Terre (9,8), Mars (3,7) et la Lune (1,6). Sans l’air, une plume et une pierre tombent au même rythme.',res:'Tu as comparé la chute sur quatre astres.'},
  p4:{nom:'Miroirs et lumière',ico:'🪞',objectif:'Découvrir la loi de la réflexion : l’angle d’arrivée est égal à l’angle de départ.',materiel:['miroir plan','lampe','cible'],etapes:['Incline le miroir','Observe le rayon réfléchi','Atteins la cible deux fois'],
    pre:Q('Un miroir…',['renvoie la lumière','absorbe toute la lumière','crée de la lumière','éteint la lumière'],0,'Il réfléchit la lumière.'),post:Q('Quand on incline le miroir, le rayon réfléchi…',['change de direction','reste identique','disparaît','devient bleu'],0,'L’angle du miroir change la direction du rayon.'),
    expl:'La lumière se déplace en ligne droite et un miroir la renvoie : l’angle d’incidence est égal à l’angle de réflexion. Les périscopes et les rétroviseurs utilisent des miroirs.',res:'Tu as atteint la cible avec un miroir.'}
};
// organes et cellules
export const ORGANES=[
  {id:'coeur',nom:'Le cœur',ico:'🫀',txt:'Il pompe le sang dans tout le corps, environ 70 fois par minute au repos.',x:.12,y:.25,c:'#c0392b',r:.2},
  {id:'poumons',nom:'Les poumons',ico:'🫁',txt:'Ils apportent l’oxygène de l’air au sang et rejettent le dioxyde de carbone.',x:-.1,y:.4,c:'#f1a7b5',r:.28},
  {id:'estomac',nom:'L’estomac',ico:'🍽',txt:'Il mélange et commence à digérer les aliments.',x:-.12,y:.02,c:'#e8a37a',r:.18},
  {id:'cerveau',nom:'Le cerveau',ico:'🧠',txt:'Il commande le corps, pense et mémorise. Il a besoin de sommeil.',x:0,y:.95,c:'#f4b6c2',r:.24}
];
export const CELLULES={
  vegetale:{nom:'Cellule végétale',parties:[{id:'paroi',nom:'Paroi',txt:'Une enveloppe rigide qui donne sa forme à la cellule.',c:'#7fbf6a'},{id:'noyau',nom:'Noyau',txt:'Le « chef » de la cellule : il contient les informations pour vivre.',c:'#8e44ad'},{id:'chloroplaste',nom:'Chloroplaste',txt:'Il capte la lumière pour fabriquer les aliments de la plante.',c:'#2e9e4a'},{id:'vacuole',nom:'Vacuole',txt:'Une grande poche d’eau qui maintient la cellule ferme.',c:'#8ec9e8'}]},
  animale:{nom:'Cellule animale',parties:[{id:'membrane',nom:'Membrane',txt:'Une fine enveloppe souple qui laisse passer ce qui est utile.',c:'#f1a7b5'},{id:'noyau',nom:'Noyau',txt:'Il contient les informations de la cellule.',c:'#8e44ad'},{id:'mitochondrie',nom:'Mitochondrie',txt:'Elle fournit l’énergie à la cellule.',c:'#e67e22'},{id:'cytoplasme',nom:'Cytoplasme',txt:'La gelée dans laquelle baignent les parties de la cellule.',c:'#f6e0b5'}]}
};
export const LIQUIDES=[
  {id:'vinaigre',nom:'Vinaigre',ico:'🍶',cls:'acide',c:'#f3ead0',ph:3},{id:'citron',nom:'Jus de citron',ico:'🍋',cls:'acide',c:'#f6e27a',ph:2},
  {id:'eau',nom:'Eau pure',ico:'💧',cls:'neutre',c:'#cfe8ff',ph:7},{id:'bicarb',nom:'Eau + bicarbonate',ico:'🥄',cls:'base',c:'#eef0f2',ph:9},{id:'savon',nom:'Eau savonneuse',ico:'🧼',cls:'base',c:'#dfeeff',ph:10}
];
export const ASTRES=[['Terre','🌍',9.8],['Lune','🌙',1.6],['Mars','🔴',3.7],['Jupiter','🪐',24.8]];
export const MATERIAUX=[['Cuivre','🟠',true],['Fer','⚙️',true],['Bois','🪵',false],['Plastique','🧴',false],['Aluminium','🥫',true],['Caoutchouc','🛞',false]];
