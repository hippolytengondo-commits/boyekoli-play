// Contenu pédagogique de BOYEKOLI MUSIC STUDIO (préprogrammé, sans IA) : instruments, cours, badges.
const Q=(q,c,a,exp)=>({q,c,a,exp});
export const NOTES6=[[60,'Do'],[62,'Ré'],[64,'Mi'],[67,'Sol'],[69,'La'],[72,'Do aigu']];
export const CLAVIER8=[[60,'Do'],[62,'Ré'],[64,'Mi'],[65,'Fa'],[67,'Sol'],[69,'La'],[71,'Si'],[72,'Do']];
export const FAMILLES={cordes:'🎸 Cordes',claviers:'🎹 Claviers',vents:'🎺 Instruments à vent',percussions:'🥁 Percussions',trad:'🌍 Traditionnels africains'};
const I=(nom,ico,fam,mel,txt,orig,coul,pads,extra)=>Object.assign({nom,ico,fam,mel,txt,orig,coul,pads:pads||null,afr:false},extra||{});
export const INSTR={
  guitare_ac:I('Guitare acoustique','🎸','cordes',true,'Six cordes tendues sur une caisse creuse en bois. En pinçant une corde, elle vibre et la caisse amplifie le son.','Née en Espagne, aujourd’hui jouée dans le monde entier, de la rumba congolaise au folk.','#c9853b'),
  guitare_el:I('Guitare électrique','⚡','cordes',true,'Le corps est plein : des micros captent la vibration des cordes et l’envoient à un amplificateur.','Inventée au XXᵉ siècle. Au Congo, la guitare électrique est l’âme du soukous.','#d6302b'),
  piano_cordes:I('Piano à cordes (le secret du piano)','🎼','cordes',true,'Quand on appuie sur une touche, un marteau frappe une corde. Plus la corde est longue, plus le son est grave.','Inventé en Italie vers 1700. Ici, le piano ouvert te montre ses cordes et ses marteaux.','#2b2b33'),
  violon:I('Violon','🎻','cordes',true,'Quatre cordes frottées par un archet. Le violoniste change les notes en posant ses doigts sur les cordes.','Apparu en Italie au XVIᵉ siècle. Il est le chef de l’orchestre.','#a6542a'),
  harpe:I('Harpe','🪕','cordes',true,'De nombreuses cordes de longueurs différentes. On les pince avec les doigts : les courtes sont aiguës, les longues graves.','L’un des plus anciens instruments du monde : on en trouve en Égypte et en Afrique.','#d4a93c'),
  ukulele:I('Ukulélé','🎶','cordes',true,'Une petite guitare à quatre cordes, au son joyeux et pétillant.','Venu d’Hawaï, il est facile à tenir pour les enfants.','#e0a84a'),
  piano:I('Piano','🎹','claviers',true,'Quand on appuie sur une touche, un marteau frappe une corde. Les touches blanches et noires donnent les notes.','Inventé en Italie. Il peut jouer très doucement (piano) ou très fort (forte).','#222831'),
  orgue:I('Orgue','⛪','claviers',true,'Le souffle d’air passe dans des tuyaux de longueurs différentes. Les grands tuyaux donnent les sons graves.','Instrument très ancien, souvent dans les églises. Il peut jouer très longtemps la même note.','#7a4a26'),
  synthe:I('Synthétiseur','🎛','claviers',true,'Il fabrique des sons avec l’électricité : on peut changer la couleur du son avec des boutons.','Inventé au XXᵉ siècle, il est partout dans la musique moderne.','#7d3fd1'),
  clavier_elec:I('Clavier électronique','🎹','claviers',true,'Un petit piano électronique qui imite plusieurs sons : piano, piano électrique, orgue…','Pratique et léger, il est très utilisé dans les groupes de musique.','#2c7fb8'),
  flute:I('Flûte','🪈','vents',true,'On souffle dans un tuyau percé de trous. En bouchant les trous avec les doigts, on change la note.','Des flûtes existent partout dans le monde depuis la préhistoire.','#c8c8d0'),
  trompette:I('Trompette','🎺','vents',true,'Un tuyau enroulé en métal. Les lèvres vibrent dans l’embouchure et les pistons changent la note.','Très présente dans le jazz et dans les fanfares.','#e0b020'),
  saxophone:I('Saxophone','🎷','vents',true,'Un tuyau en métal courbé avec une anche en roseau. Son timbre est chaud et chantant.','Inventé par Adolphe Sax. Il est la voix du jazz et de la rumba.','#d9a82a'),
  clarinette:I('Clarinette','🎶','vents',true,'Un tuyau droit en bois noir avec une anche. Elle joue des notes graves rondes et des notes aiguës claires.','Très utilisée dans les orchestres et la musique populaire.','#222222'),
  trombone:I('Trombone','🎺','vents',true,'Une coulisse que l’on pousse et que l’on tire change la longueur du tuyau : le son devient plus grave ou plus aigu.','Il est le grand frère de la trompette, au son puissant.','#d9b02a'),
  harmonica:I('Harmonica','🎵','vents',true,'Une petite boîte percée de trous. On souffle ou on aspire pour faire vibrer de petites lames.','Facile à emporter partout, il est très aimé dans le blues.','#b9bcc4'),
  batterie:I('Batterie','🥁','percussions',false,'Plusieurs tambours et cymbales : la grosse caisse (grave), la caisse claire, les toms et les cymbales (aigu).','La batterie donne le rythme à un groupe.','#c0392b',['Grosse caisse','Caisse claire','Charleston fermé','Charleston ouvert','Tom aigu','Tom grave','Cymbale crash']),
  tamtam:I('Tam-tam','🥁','percussions',false,'Un grand tambour frappé à la main. La peau tendue vibre et le fût résonne.','Les tam-tams servent à communiquer et à animer les fêtes en Afrique.','#8e5a2b',['Son grave','Son moyen','Son aigu'],{afr:true}),
  djembe:I('Djembé','🪘','percussions',false,'Un tambour en forme de calice, joué à mains nues : basse au centre, ton près du bord, claque au bord.','Originaire d’Afrique de l’Ouest (empire du Mali), adopté dans toute l’Afrique.','#b5763a',['Basse','Ton','Claque'],{afr:true}),
  bongos:I('Bongos','🪘','percussions',false,'Deux petits tambours attachés ensemble : le plus petit est aigu, le plus grand est plus grave.','Venus de Cuba, issus des rythmes africains.','#d58a3a',['Petit (aigu)','Grand (grave)']),
  congas:I('Congas','🪘','percussions',false,'De grands tambours hauts et étroits joués à la main, typiques de la rumba et de la salsa.','Leur nom vient du Congo : ils sont les cousins des tambours congolais.','#a2552a',['Aigu','Grave','Claque']),
  tambour_congolais:I('Tambour traditionnel congolais','🪵','percussions',false,'Un tambour à fente creusé dans un tronc : on le frappe avec des baguettes et chaque côté donne une note.','Utilisé dans plusieurs peuples du Congo pour envoyer des messages à distance.','#7a4a22',['Fente grave','Fente moyenne','Fente aiguë'],{afr:true}),
  ngoma:I('Ngoma','🥁','trad',false,'Un grand tambour sur pied, la peau tendue par des cordes ou des chevilles. « Ngoma » veut dire tambour ou danse en bantou.','Présent chez de nombreux peuples d’Afrique centrale, il rythme les cérémonies.','#8a3b12',['Son grave','Son aigu'],{afr:true}),
  xylophone:I('Xylophone','🎼','percussions',true,'Des lames de bois de longueurs différentes, frappées avec des baguettes : les courtes sont aiguës.','Instrument présent en Afrique, en Asie et dans les orchestres.','#e6a62b'),
  maracas:I('Maracas','🪇','percussions',false,'Des calebasses remplies de graines : on les secoue pour faire un bruit de pluie.','Venues d’Amérique latine, elles ajoutent de la vie au rythme.','#2e9e4a',['Secouer','Double secousse']),
  triangle:I('Triangle','🔺','percussions',false,'Une tige de métal pliée en triangle, frappée avec une baguette : un son clair qui dure longtemps.','Très ancien, on l’utilise dans les orchestres et la musique traditionnelle.','#c0c4cc',['Ouvert (résonne)','Étouffé (court)']),
  tambourin:I('Tambourin','🔔','percussions',false,'Un cadre en bois avec une peau et des cymbalettes : on le secoue ou on le frappe.','Instrument très ancien, joyeux, joué sur tous les continents.','#e0c05a',['Secouer','Frapper']),
  likembe:I('Likembe (sanza)','🎼','trad',true,'Une planchette de bois avec des lames de métal. On les fait vibrer avec les pouces : chaque lame est une note.','Très répandu au Congo et en Afrique centrale. On l’appelle aussi sanza ou kalimba.','#a06a2e',null,{afr:true}),
  balafon:I('Balafon','🪘','trad',true,'Des lames de bois posées sur des calebasses qui amplifient le son, jouées avec des baguettes. Un petit bourdonnement donne son timbre unique.','Instrument d’Afrique de l’Ouest et centrale, ancêtre du xylophone.','#b5602a',null,{afr:true}),
};
// listes par zone du studio
export const ZONES=[
  {id:'salle',nom:'Salle de musique',ico:'🎸',x:0,coul:'#e8a23a',inst:['guitare_ac','guitare_el','violon','harpe','ukulele','piano_cordes']},
  {id:'repet',nom:'Répétition',ico:'🎹',x:26,coul:'#4aa0d8',inst:['piano','orgue','synthe','clavier_elec','flute','trompette','saxophone','clarinette','trombone','harmonica']},
  {id:'scene',nom:'Scène',ico:'🥁',x:52,coul:'#d6302b',inst:['batterie','congas','bongos','xylophone','maracas','triangle','tambourin']},
  {id:'afrique',nom:'Afrique',ico:'🌍',x:78,coul:'#2e9e4a',inst:['likembe','balafon','ngoma','djembe','tamtam','tambour_congolais']},
  {id:'studio',nom:'Studio',ico:'🎙',x:104,coul:'#7d3fd1',inst:[]}
];
export const AFRICAINS=['likembe','balafon','ngoma','djembe','tamtam','tambour_congolais'];
export const PERCUSSIONS=['batterie','tamtam','djembe','bongos','congas','tambour_congolais','ngoma','maracas','triangle','tambourin'];
export const PISTES=[
  {nom:'Batterie et percussions',ico:'🥁',coul:'#d6302b',choix:['batterie','djembe','congas','bongos','tamtam','maracas']},
  {nom:'Guitare',ico:'🎸',coul:'#e8a23a',choix:['guitare_ac','guitare_el','ukulele']},
  {nom:'Piano',ico:'🎹',coul:'#4aa0d8',choix:['piano','orgue','synthe','clavier_elec']},
  {nom:'Instruments traditionnels',ico:'🌍',coul:'#2e9e4a',choix:['likembe','balafon','ngoma','tambour_congolais']},
  {nom:'Mélodie et autres',ico:'🎻',coul:'#7d3fd1',choix:['violon','flute','trompette','saxophone','clarinette','trombone','harmonica','harpe','xylophone']}
];
export const demo=id=>{const i=INSTR[id];return i.mel?[[60,0],[64,.28],[67,.56],[72,.84],[67,1.2],[64,1.5],[60,1.8]]:(i.pads.length>=3?[[0,0],[1,.3],[2,.6],[1,.9],[0,1.2],[1,1.5],[2,1.8]]:[[0,0],[1,.3],[0,.6],[1,.9],[0,1.2],[1,1.5]])};

// ---------- cours
export const COURS=[
 {id:'m1',titre:'Découverte de la musique',ico:'🎵',pages:[
   {t:'Qu’est-ce que la musique ?',txt:'La musique est un art fait de sons et de silences. Elle raconte des histoires, exprime la joie, la tristesse, et rassemble les gens. Dans le monde entier, on chante et on joue de la musique pour danser, prier, fêter et se souvenir.',son:{i:'piano',s:[60,64,67,72]}},
   {t:'Les trois ingrédients',txt:'La musique est faite de trois ingrédients : la hauteur (son grave ou aigu), la durée (son court ou long) et l’intensité (son doux ou fort). Écoute une note grave puis une note aiguë.',son:{i:'piano',s:[48,84]}}],
   pratique:{t:'libre',n:3,i:'piano',txt:'Joue 3 sons de ton choix sur le piano.'},
   quiz:[Q('La musique est faite de…',['sons et de silences','images','odeurs','couleurs seulement'],0,'Un morceau alterne sons et silences.'),Q('Un son aigu est…',['un son haut et fin','un son très gros','un silence','un bruit de moteur'],0,'Aigu veut dire haut et fin.'),Q('On peut faire de la musique pour…',['danser, raconter, fêter','seulement dormir','seulement travailler','jamais'],0,'La musique accompagne toutes les occasions.')]},
 {id:'m2',titre:'Reconnaître les sons',ico:'👂',pages:[
   {t:'Écouter attentivement',txt:'Un bon musicien a une bonne oreille. Chaque instrument a son timbre : sa « couleur » sonore. Même si deux instruments jouent la même note, on les reconnaît. Écoute la même note jouée par une flûte puis un violon.',son:{i:'flute',s:[67]},son2:{i:'violon',s:[67]}},
   {t:'Grave et aigu',txt:'Un son grave est bas et profond comme un gros tambour. Un son aigu est haut et clair comme un oiseau. Écoute un tam-tam (grave) puis un triangle (aigu).',son:{i:'tamtam',p:[0]},son2:{i:'triangle',p:[0]}}],
   pratique:{t:'devine',n:3,txt:'Devine 3 instruments à l’oreille.'},
   quiz:[Q('Le timbre, c’est…',['la couleur du son d’un instrument','la vitesse','le volume','le silence'],0,'Le timbre permet de reconnaître un instrument.'),Q('Un tam-tam donne un son…',['grave','aigu','muet','électrique'],0,'Les grands tambours sont graves.'),Q('Pour reconnaître un instrument, il faut…',['bien écouter','fermer les oreilles','le regarder seulement','le toucher'],0,'Écouter attentivement est la clé.')]},
 {id:'m3',titre:'Découvrir les instruments',ico:'🎷',pages:[
   {t:'Les grandes familles',txt:'On classe les instruments en familles : les cordes (guitare, violon), les claviers (piano, orgue), les vents (flûte, trompette), les percussions (tambours, xylophone) et les instruments traditionnels africains (likembe, balafon, ngoma).',son:{i:'guitare_ac',s:[64,67,71]}},
   {t:'Comment le son est produit',txt:'On produit un son en faisant vibrer quelque chose : une corde qu’on pince ou frotte, une peau qu’on frappe, l’air qu’on souffle dans un tuyau.',son:{i:'djembe',p:[0,1,2]}}],
   pratique:{t:'visiter',n:4,txt:'Visite 4 instruments dans le studio (touche-les et lis leur fiche).'},
   quiz:[Q('La guitare est un instrument…',['à cordes','à vent','de percussion','électronique seulement'],0,'On pince ses cordes.'),Q('La flûte est un instrument…',['à vent','à cordes','de percussion','de clavier'],0,'On souffle dedans.'),Q('Le djembé est…',['une percussion africaine','un instrument à vent','un clavier','une guitare'],0,'C’est un tambour d’Afrique de l’Ouest.')]},
 {id:'m4',titre:'Apprendre les notes musicales',ico:'🎼',pages:[
   {t:'Do Ré Mi Fa Sol La Si',txt:'Il y a sept notes : Do, Ré, Mi, Fa, Sol, La, Si. Ensuite on recommence plus aigu : Do. Cette suite s’appelle la gamme. Écoute la gamme de Do.',son:{i:'piano',s:[60,62,64,65,67,69,71,72]}},
   {t:'Monter et descendre',txt:'Quand les notes montent de Do vers Si, le son devient plus aigu. Quand elles descendent, il devient plus grave.',son:{i:'xylophone',s:[72,71,69,67,65,64,62,60]}}],
   pratique:{t:'sequence',i:'piano',seq:[60,62,64],txt:'Joue Do, Ré, Mi sur le piano.'},
   quiz:[Q('Combien y a-t-il de notes dans la gamme ?',['7','3','12 seulement','100'],0,'Do Ré Mi Fa Sol La Si.'),Q('Quelle note vient après Do ?',['Ré','Si','Sol','La'],0,'Do Ré Mi…'),Q('Plus les notes montent, plus le son est…',['aigu','grave','faible','muet'],0,'Les notes montantes sont plus aiguës.')]},
 {id:'m5',titre:'Comprendre le rythme',ico:'🥁',pages:[
   {t:'Le battement',txt:'Le rythme est l’organisation des sons dans le temps. Comme le cœur qui bat, la musique a un pulsation régulière : on tape du pied en rythme. Écoute une grosse caisse régulière.',son:{i:'batterie',p:[0,0,0,0]}},
   {t:'Sons longs et courts',txt:'Un rythme mélange des sons courts et longs et des silences. Un exemple : boum, tchac, boum, tchac. Écoute-le.',son:{i:'batterie',p:[0,1,0,1]}}],
   pratique:{t:'sequence',i:'batterie',seq:[0,1,0,1],txt:'Reproduis : grosse caisse, caisse claire, grosse caisse, caisse claire.',pad:true},
   quiz:[Q('Le rythme, c’est…',['l’organisation des sons dans le temps','la hauteur d’un son','la couleur d’un son','un instrument'],0,'Le rythme organise la durée des sons.'),Q('La pulsation est…',['le battement régulier de la musique','un silence total','une note aiguë','un chanteur'],0,'Comme le battement du cœur.'),Q('La grosse caisse donne un son…',['grave','très aigu','muet','de flûte'],0,'La grosse caisse est grave.')]},
 {id:'m6',titre:'Apprendre à jouer du piano',ico:'🎹',pages:[
   {t:'Le clavier',txt:'Le piano a des touches blanches (les notes Do Ré Mi Fa Sol La Si) et des touches noires. Le Do se trouve à gauche d’un groupe de deux touches noires.',son:{i:'piano',s:[60,64,67]}},
   {t:'Jouer une mélodie',txt:'Pour jouer une mélodie, on joue les notes l’une après l’autre, en gardant une pulsation régulière. Voici le début d’une chanson simple.',son:{i:'piano',s:[60,60,60,62,64,64,62,64,65,67]}}],
   pratique:{t:'sequence',i:'piano',seq:[60,64,67,72],txt:'Joue l’accord montant : Do, Mi, Sol, Do aigu.'},
   quiz:[Q('Les touches du piano sont…',['blanches et noires','vertes','rouges','toutes noires'],0,'Les blanches sont les 7 notes.'),Q('Pour jouer une mélodie, on joue les notes…',['les unes après les autres','toutes ensemble sans arrêt','jamais','seulement les noires'],0,'Une mélodie est une suite de notes.'),Q('Le piano est un instrument à…',['clavier','vent','cordes frottées','percussion de fête'],0,'Il a un clavier.')]},
 {id:'m7',titre:'Découvrir la guitare',ico:'🎸',pages:[
   {t:'Les six cordes',txt:'La guitare a six cordes : Mi, La, Ré, Sol, Si, Mi. Les cordes du haut sont graves, celles du bas sont aiguës. On pince les cordes d’une main et on appuie sur le manche de l’autre.',son:{i:'guitare_ac',s:[40,45,50,55,59,64]}},
   {t:'Acoustique et électrique',txt:'La guitare acoustique a une caisse creuse qui amplifie le son. La guitare électrique utilise des micros et un amplificateur. Au Congo, les guitaristes ont inventé un style très chantant : la rumba et le soukous.',son:{i:'guitare_el',s:[64,67,71,76]}}],
   pratique:{t:'sequence',i:'guitare_ac',seq:[64,67,69],txt:'Joue Mi, Sol, La sur la guitare.'},
   quiz:[Q('Combien de cordes a une guitare classique ?',['6','2','12','1'],0,'Six cordes.'),Q('Une guitare électrique a besoin…',['d’un amplificateur','de rien','d’eau','de papier'],0,'Les micros envoient le signal à un ampli.'),Q('La rumba congolaise utilise beaucoup…',['la guitare','le violoncelle','l’orgue seulement','la harpe uniquement'],0,'La guitare chantante est la star de la rumba.')]},
 {id:'m8',titre:'Découvrir les percussions africaines',ico:'🌍',pages:[
   {t:'Le tam-tam et le ngoma',txt:'En Afrique, les tambours accompagnent les fêtes, les cérémonies et même les messages : certains tambours « parlent » et envoient des nouvelles à des kilomètres. Au Congo, le ngoma et le tam-tam sont des tambours sacrés.',son:{i:'ngoma',p:[0,1,0,1]}},
   {t:'Le likembe et le balafon',txt:'Le likembe (sanza) se joue avec les pouces. Le balafon est un xylophone de bois avec des calebasses. Ces instruments font partie du patrimoine culturel africain : ils transmettent des histoires et des traditions.',son:{i:'likembe',s:[60,64,67,72]},son2:{i:'balafon',s:[60,62,64,67]}}],
   pratique:{t:'sequence',i:'djembe',seq:[0,1,2,1],txt:'Joue sur le djembé : basse, ton, claque, ton.',pad:true},
   quiz:[Q('Le djembé vient surtout…',['d’Afrique de l’Ouest','d’Antarctique','du Pôle Nord','d’Europe du Nord'],0,'Il est originaire du Mali et de ses voisins.'),Q('Le likembe se joue…',['avec les pouces','avec un archet','avec la bouche','avec les pieds'],0,'On fait vibrer les lames avec les pouces.'),Q('Pourquoi la musique traditionnelle est-elle un patrimoine ?',['Elle transmet l’histoire et la culture','Elle est interdite','Elle est récente','Elle ne sert à rien'],0,'Elle se transmet de génération en génération.')]},
 {id:'m9',titre:'Comprendre la composition musicale',ico:'🧩',pages:[
   {t:'Mélodie, rythme, harmonie',txt:'Composer, c’est assembler : une mélodie (la suite de notes qu’on chante), un rythme (le battement) et une harmonie (plusieurs notes en même temps). Chaque instrument est une piste qui s’ajoute aux autres.',son:{i:'piano',s:[60,64,67]}},
   {t:'Superposer les instruments',txt:'Un groupe de musique superpose plusieurs instruments : la batterie donne le rythme, la guitare et le piano accompagnent, une flûte ou un violon chante la mélodie. Dans le studio, tu vas faire pareil !',son:{i:'batterie',p:[0,2,1,2]}}],
   pratique:{t:'compo',pistes:2,txt:'Dans la table de composition, mets des notes sur 2 pistes et écoute ta création.'},
   quiz:[Q('Une mélodie est…',['une suite de notes','un silence','un tambour','un casque'],0,'La mélodie est ce qu’on peut chanter.'),Q('Le rythme est donné surtout par…',['les percussions','la couleur','les murs','l’ombre'],0,'Batterie et percussions marquent le rythme.'),Q('Superposer des instruments, c’est…',['les faire jouer ensemble','les ranger','les casser','les cacher'],0,'C’est la base de l’orchestre.')]},
 {id:'m10',titre:'Créer sa première musique',ico:'🌟',pages:[
   {t:'À toi de composer',txt:'Tu connais maintenant les sons, les notes, les rythmes et les instruments. Tu peux composer ta première musique : choisis un rythme, ajoute une mélodie, puis un instrument africain. Écoute, change, recommence : un compositeur teste et améliore !',son:{i:'likembe',s:[60,64,67,72,67,64]}}],
   pratique:{t:'compo',pistes:3,txt:'Crée une musique avec 3 pistes au moins, écoute-la puis enregistre-la.',enregistrer:true},
   quiz:[Q('Pour améliorer une composition, on…',['écoute, change et recommence','la jette','arrête','efface tout sans écouter'],0,'La création demande d’essayer.'),Q('Une composition complète mélange…',['rythme, mélodie et harmonie','seulement des silences','un seul son répété','du bruit au hasard'],0,'Rythme, mélodie et harmonie.'),Q('Une musique qui t’appartient s’appelle…',['une création','une copie','une erreur','un silence'],0,'Tu es l’auteur de ta création !')]}
];
// ---------- badges
export const BADGES=[
 {id:'jeune_compositeur',ico:'🎵',nom:'JEUNE COMPOSITEUR BOYEKOLI',txt:'Premiers cours terminés, instruments reconnus, rythme reproduit et première création écoutée.',coul:'#f1c40f',
  req:m=>[['Cours 1 et 2 terminés',!!(m.cours.m1&&m.cours.m2)],['5 instruments reconnus à l’oreille',(m.st.devineOk||0)>=5],['Exercice « Reproduis le rythme » réussi',(m.jeux.rythme||{}).stars>=1],['Première création composée et écoutée',m.compos.length>=1&&!!m.st.ecoutee]]},
 {id:'petit_percussionniste',ico:'🥁',nom:'PETIT PERCUSSIONNISTE',txt:'Tu as joué au moins 5 percussions et réussi des rythmes.',coul:'#d6302b',
  req:m=>[['Cours 5 « Comprendre le rythme » réussi',!!m.cours.m5],['Défi réussi sur 5 percussions différentes',PERCUSSIONS.filter(k=>m.instr[k]&&m.instr[k].defi).length>=5],['Reproduis le rythme : 2 étoiles',(m.jeux.rythme||{}).stars>=2]]},
 {id:'jeune_pianiste',ico:'🎹',nom:'JEUNE PIANISTE',txt:'Tu sais jouer des mélodies au piano.',coul:'#4aa0d8',
  req:m=>[['Cours 6 « Apprendre à jouer du piano » réussi',!!m.cours.m6],['Défi du piano réussi',!!(m.instr.piano&&m.instr.piano.defi)],['Le piano magique : 2 étoiles',(m.jeux.piano||{}).stars>=2]]},
 {id:'explorateur_africain',ico:'🌍',nom:'EXPLORATEUR DES INSTRUMENTS AFRICAINS',txt:'Tu as exploré les instruments traditionnels congolais et africains.',coul:'#2e9e4a',
  req:m=>[['Cours 8 « Percussions africaines » réussi',!!m.cours.m8],['Défi réussi sur les 6 instruments africains',AFRICAINS.filter(k=>m.instr[k]&&m.instr[k].defi).length>=6]]},
 {id:'maitre_rythme',ico:'🔥',nom:'MAÎTRE DU RYTHME',txt:'Tu reproduis les rythmes avec précision.',coul:'#e67e22',
  req:m=>[['Cours 5 réussi avec 3 étoiles',(m.cours.m5||{}).stars>=3],['Reproduis le rythme : 3 étoiles',(m.jeux.rythme||{}).stars>=3],['Mémoire musicale : 2 étoiles',(m.jeux.memoire||{}).stars>=2]]},
 {id:'jeune_musicien',ico:'🎤',nom:'JEUNE MUSICIEN',txt:'Tu as parcouru l’univers musical et créé ta musique.',coul:'#7d3fd1',
  req:m=>[['Cours 9 et 10 terminés',!!(m.cours.m9&&m.cours.m10)],['Création de 3 pistes enregistrée',m.compos.some(c=>c.tracks.filter(t=>t.grid.some(r=>r.some(x=>x))).length>=3)],['Le détective des sons : 2 étoiles',(m.jeux.detective||{}).stars>=2],['Mon premier concert donné',!!m.st.concert]]}
];
