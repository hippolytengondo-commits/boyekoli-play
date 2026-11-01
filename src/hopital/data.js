// BOYEKOLI MEDICAL CENTER – contenu préprogrammé. SIMULATION ÉDUCATIVE : aucun diagnostic réel, aucune prescription,
// aucune donnée personnelle demandée. Les patients et les dossiers sont fictifs. En cas de vrai problème de santé : un professionnel de santé.
const Q=(q,c,a,exp)=>({q,c,a,exp});
const S=(x0,z0,x1,z1,coul,nom)=>({x0,z0,x1,z1,coul,nom});
const MU=(x0,z0,x1,z1,portes)=>({x0,z0,x1,z1,portes:portes||[]});
const B=(id,nom,x,z,w,d,h,c,o)=>Object.assign({id,nom,x,z,w,d,h,c,bloque:true},o||{});
const PNJ=(id,nom,role,x,z,ry,look,o)=>Object.assign({id,nom,role,x,z,ry,look},o||{});
const LIT=(id,x,z,coul)=>B(id,'Lit hospitalier',x,z,2,1,.6,'#e8eef2',{ex:'Un lit hospitalier réglable : on peut relever le dossier et baisser le matelas.',parts:[{t:'box',w:2,h:.15,d:1,y:.35,c:'#cfd8dc'},{t:'box',w:1.9,h:.2,d:.9,y:.5,c:'#ffffff'},{t:'box',w:.12,h:.6,d:1,x:-.95,y:.65,c:'#9fb4c4'},{t:'box',w:.5,h:.14,d:.5,x:-.65,y:.66,c:coul||'#bfe3ff'}]});
export const LOOKS_PRO=[
  {id:'medecin',nom:'Médecin (blouse blanche)',look:{outfit:'uniforme',c:'#ffffff'}},
  {id:'infirmier',nom:'Infirmier·ère (tenue bleue)',look:{outfit:'uniforme',c:'#5aa9e6'}},
  {id:'chirurgien',nom:'Chirurgien·ne (tenue verte)',look:{outfit:'uniforme',c:'#3aa17e'}},
  {id:'pediatre',nom:'Pédiatre (blouse colorée)',look:{outfit:'uniforme',c:'#ffb3c7'}}
];
export const HOPITAL={
  nom:'BOYEKOLI MEDICAL CENTER',
  start:{x:-14,z:6},
  sols:[S(-18,-10,-12,0,'#eaf3f7','Cabinet de consultation'),S(-12,-10,-6,0,'#ffe9c9','Pédiatrie'),S(-6,-10,0,0,'#ffd9d6','Urgences'),S(0,-10,6,0,'#e3f3e5','Laboratoire d’analyses'),S(6,-10,12,0,'#e6e3f5','Radiologie'),S(12,-10,18,0,'#e3eef7','Échographie'),
        S(-18,0,-8,10,'#f7f3ea','Accueil, admission et attente'),S(-8,0,-2,10,'#e8f0e0','Pharmacie'),S(-2,0,4,10,'#f0f4f6','Salle de soins'),S(4,0,10,10,'#eaf2f8','Hospitalisation'),S(10,0,14,10,'#d5ecdf','Bloc opératoire (simulé)'),S(14,0,18,10,'#efe5d3','Bureau du médecin-chef')],
  murs:[MU(-18,-10,18,-10),MU(-18,10,18,10),MU(-18,-10,-18,10,[[6,2.6]]),MU(18,-10,18,10),
    MU(-18,0,18,0,[[-15,2.4],[-9,2.4],[-3,2.4],[3,2.4],[9,2.4],[15,2.4],[-5,2.4],[1,2.4],[7,2.4],[12,2.4],[16,2.4]]),
    MU(-12,-10,-12,0),MU(-6,-10,-6,0),MU(0,-10,0,0),MU(6,-10,6,0),MU(12,-10,12,0),
    MU(-8,0,-8,10,[[5,2.4]]),MU(-2,0,-2,10,[[5,2.4]]),MU(4,0,4,10,[[5,2.4]]),MU(10,0,10,10,[[5,2.4]]),MU(14,0,14,10,[[5,2.4]])],
  objets:[
    B('bureau_c','Bureau du médecin',-15,-6,3,1.2,.9,'#a0794a'),
    B('table_ex','Table d’examen',-13.5,-3,1.8,.9,.7,'#dfe6ea',{ex:'La table d’examen : l’enfant s’y allonge pour être examiné.',parts:[{t:'box',w:1.8,h:.12,d:.9,y:.62,c:'#e8eef2'},{t:'box',w:.2,h:.6,d:.7,x:-.6,y:.3,c:'#9fb4c4'},{t:'box',w:.2,h:.6,d:.7,x:.6,y:.3,c:'#9fb4c4'}]}),
    B('trousse','Trousse de consultation',-16.6,-8.6,.7,.5,.9,'#2c7fb8',{panneau:'instruments',label:'🩺 Instruments : stéthoscope, thermomètre, tensiomètre',ex:'La trousse du médecin : stéthoscope, thermomètre, tensiomètre, oxymètre.',bloque:false}),
    B('jeux_p','Coin jeux de la pédiatrie',-9.5,-7,3,2,.5,'#ff9ecb',{ex:'Un coin jeux pour rassurer les enfants : tapis, cubes et livres.',parts:[{t:'box',w:3,h:.06,d:2,y:.03,c:'#ff9ecb'},{t:'box',w:.4,h:.4,d:.4,x:-.6,y:.25,c:'#f1c40f'},{t:'box',w:.4,h:.4,d:.4,x:.3,y:.25,c:'#2e86de'},{t:'sph',r:.25,x:.9,y:.28,c:'#e74c3c'}]}),
    LIT('lit_p',-9,-3,'#ffd9e6'),
    B('pediatrie','Fiche de la pédiatrie',-6.6,-1.2,.2,.2,.2,'#333',{panneau:'svc_pediatrie',label:'🧸 Pédiatrie : accueillir de jeunes patients',bloque:false,plaque:true,ex:'Le service de pédiatrie accueille les enfants.'}),
    B('triage','Poste de triage des urgences',-3,-6,2.4,1,.9,'#d6302b',{panneau:'svc_urgences',label:'🚨 Urgences : organiser la prise en charge',ex:'Le poste de triage : on décide qui doit être soigné en premier.'}),
    B('brancard','Brancard',-1.5,-3,2,.9,.9,'#cfd8dc',{ex:'Un brancard à roulettes pour transporter un patient couché.',parts:[{t:'box',w:2,h:.1,d:.8,y:.75,c:'#f5f5f5'},{t:'box',w:.1,h:.7,d:.1,x:-.9,y:.35,c:'#777'},{t:'box',w:.1,h:.7,d:.1,x:.9,y:.35,c:'#777'},{t:'cyl',r:.12,h:.06,y:.08,x:-.9,c:'#222'},{t:'cyl',r:.12,h:.06,y:.08,x:.9,c:'#222'}]}),
    B('labo_m','Paillasse d’analyses',3,-6,4.4,1.3,.95,'#f5f5f5',{panneau:'svc_labo',label:'🧪 Laboratoire : analyser des échantillons',ex:'Le laboratoire d’analyses médicales : microscope, tubes et automates.',parts:[{t:'box',w:4.4,h:.95,d:1.3,y:.475,c:'#f2f2f2'},{t:'cyl',r:.08,h:.3,x:-1.4,y:1.1,c:'#e74c3c'},{t:'cyl',r:.08,h:.3,x:-1,y:1.1,c:'#f1c40f'},{t:'cyl',r:.08,h:.3,x:-.6,y:1.1,c:'#2e86de'},{t:'box',w:.5,h:.5,d:.4,x:1,y:1.2,c:'#222'},{t:'cyl',r:.06,h:.4,x:1,y:1.6,c:'#777'}]}),
    B('radio','Appareil de radiographie',9,-6.5,2.2,2,2,'#cfd8dc',{panneau:'svc_radio',label:'☢ Radiologie : examiner des images fictives',ex:'L’appareil de radiographie : il prend des images des os. Ici, les images sont fictives.',parts:[{t:'box',w:.4,h:2.2,d:.4,x:-.8,y:1.1,c:'#cfd8dc'},{t:'box',w:1.8,h:.3,d:.4,y:2.1,c:'#cfd8dc'},{t:'box',w:.9,h:.15,d:.5,y:1.9,c:'#555'},{t:'box',w:1.8,h:.2,d:.9,y:.5,c:'#e8eef2'}]}),
    B('echo','Échographe',15,-6,1.4,1,1.4,'#e8eef2',{ex:'L’échographe utilise des ondes sonores pour voir l’intérieur du corps, sans danger. On l’utilise pour regarder le cœur ou un bébé avant sa naissance.',parts:[{t:'box',w:.9,h:.9,d:.7,y:.45,c:'#e8eef2'},{t:'box',w:.8,h:.5,d:.05,y:1.2,z:-.2,c:'#222'},{t:'cyl',r:.08,h:.3,x:.5,y:.9,c:'#2c7fb8'}]}),
    B('comptoir_a','Comptoir d’accueil et d’admission',-12,6,3.6,1.1,1,'#c9a06a'),
    B('chaises_a','Salle d’attente',-15,2.2,3.6,.9,.5,'#2c7fb8',{ex:'La salle d’attente : on patiente en lisant ou en jouant calmement.',parts:[{t:'box',w:.7,h:.5,d:.7,x:-1.3,y:.25,c:'#2c7fb8'},{t:'box',w:.7,h:.5,d:.7,x:-.4,y:.25,c:'#2c7fb8'},{t:'box',w:.7,h:.5,d:.7,x:.5,y:.25,c:'#2c7fb8'},{t:'box',w:.7,h:.5,d:.7,x:1.4,y:.25,c:'#2c7fb8'}]}),
    B('fauteuil','Fauteuil roulant',-9.6,2,.8,.8,.9,'#555',{ex:'Un fauteuil roulant : il aide à se déplacer quand on ne peut pas marcher.',parts:[{t:'box',w:.6,h:.1,d:.6,y:.5,c:'#555'},{t:'box',w:.6,h:.6,d:.1,y:.8,z:-.3,c:'#555'},{t:'cyl',r:.3,h:.06,x:-.35,y:.3,c:'#222'},{t:'cyl',r:.3,h:.06,x:.35,y:.3,c:'#222'}]}),
    B('ascenseur','Ascenseur (changer de service)',-17.2,3.2,.5,1.4,2.2,'#9fb4c4',{panneau:'ascenseur',label:'🛗 Ascenseur : changer de service',ex:'L’ascenseur relie tous les services.',bloque:false}),
    B('pharma','Comptoir de la pharmacie',-5,5,3.2,1.2,1,'#7fbf9a',{panneau:'svc_pharma',label:'💊 Pharmacie : classer les médicaments',ex:'La pharmacie de l’hôpital : on y range et on distribue les médicaments sur ordonnance.',parts:[{t:'box',w:3.2,h:1,d:1.2,y:.5,c:'#7fbf9a'},{t:'box',w:.3,h:.3,d:.3,x:-1,y:1.15,c:'#fff'},{t:'box',w:.3,h:.3,d:.3,x:-.4,y:1.15,c:'#fff'}]}),
    B('rayons_ph','Rayons de médicaments',-7.6,2.6,.5,3,1.9,'#d9e8df',{ex:'Des rayons où les médicaments sont rangés par catégories et surveillés (date limite, température).'}),
    B('soins','Chariot de soins',1,5,1.6,.8,.9,'#e8eef2',{panneau:'masques',label:'🧤 Matériel de soins : masques, gants, hygiène',ex:'Le chariot de soins : gants, masques, compresses, désinfectant.',parts:[{t:'box',w:1.6,h:.06,d:.8,y:.9,c:'#cfd8dc'},{t:'box',w:.3,h:.2,d:.3,x:-.4,y:1.05,c:'#bfe3ff'},{t:'box',w:.3,h:.2,d:.3,x:.1,y:1.05,c:'#fff'},{t:'cyl',r:.1,h:.3,x:.5,y:1.1,c:'#8e44ad'}]}),
    LIT('lit_h1',6,2.4),LIT('lit_h2',6,7.4,'#d8f3dc'),LIT('lit_h3',8.5,5,'#ffe9a8'),
    B('bloc','Table d’opération (simulée)',12,5,2.2,1.1,.95,'#bfe3d0',{panneau:'svc_bloc',label:'🔪 Chirurgie : découvrir le matériel opératoire',ex:'La table d’opération et sa lampe : l’équipe chirurgicale prépare tout avec un grand soin d’hygiène.',parts:[{t:'box',w:2.2,h:.2,d:1.1,y:.8,c:'#cfe8dc'},{t:'box',w:.3,h:.8,d:.3,y:.4,c:'#777'},{t:'cyl',r:.5,h:.08,y:2.2,c:'#f5f5f5'},{t:'cyl',r:.03,h:1.2,y:1.6,c:'#999'}]}),
    B('bureau_mc','Bureau du médecin-chef',16,7.6,3,1.2,.9,'#7a4a26'),
    B('anatomie','Maquette du corps humain',17.3,3,.8,.8,1.9,'#f1c9a5',{panneau:'anatomie',label:'🫀 Corps humain 3D : découvrir les organes',ex:'Une maquette du corps humain pour apprendre où sont les organes.',parts:[{t:'cyl',r:.25,h:1.3,y:.95,c:'#f1c9a5'},{t:'sph',r:.22,y:1.8,c:'#f1c9a5'},{t:'sph',r:.12,x:.1,y:1.3,z:.2,c:'#c0392b'}]}),
    B('dossiers_h','Dossiers des patients (fictifs)',14.4,9.1,2,.5,1.2,'#6b4423',{panneau:'dossiers',label:'📋 Dossiers et progression',ex:'Les dossiers fictifs des patients : ils sont fabriqués pour le jeu.',bloque:true})
  ],
  pnj:[
    PNJ('acc','Mme Ilunga','Agente d’accueil',-12,7.4,Math.PI,{s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#5aa9e6'},{dial:'acc'}),
    PNJ('dr','Dr Mbala','Médecin généraliste',-15.8,-4.2,Math.PI*.5,{s:'h',skin:1,hair:'courtes',outfit:'uniforme',c:'#ffffff',acc:['lunettes']},{dial:'dr'}),
    PNJ('pedia','Dre Kalala','Pédiatre',-9.6,-4.6,Math.PI,{s:'f',skin:4,hair:'chignon',outfit:'uniforme',c:'#ffb3c7'},{dial:'pedia'}),
    PNJ('inf','Infirmier Mado','Infirmier',-1.2,5.6,Math.PI,{s:'h',skin:2,hair:'courtes',outfit:'uniforme',c:'#5aa9e6'},{dial:'inf'}),
    PNJ('pharm','M. Tshiala','Pharmacien',-5,7.2,Math.PI,{s:'h',skin:5,hair:'afro',outfit:'uniforme',c:'#3aa17e'},{dial:'pharm'}),
    PNJ('chir','Dr Nsimba','Chirurgien',12,7.6,Math.PI,{s:'h',skin:1,hair:'rase',outfit:'uniforme',c:'#3aa17e'},{dial:'chir'}),
    PNJ('chef','Pr Kabongo','Médecin-chef',16,6.4,Math.PI,{s:'h',skin:3,hair:'gris',outfit:'uniforme',c:'#ffffff',acc:['lunettes']},{dial:'chef'}),
    PNJ('patient','Un patient (fictif)','Patient à accueillir',-14,3.6,Math.PI*.2,{s:'h',skin:3,hair:'courtes',outfit:'polo',c:'#c0392b',h:.8},{dial:'patient'}),
    PNJ('enfant','Un enfant patient (fictif)','Petit patient',-10.4,-2.2,Math.PI*.8,{s:'f',skin:4,hair:'tresses',outfit:'uniforme',c:'#2e9e4a',h:.7},{dial:'enfant'})
  ],
  sorties:[{id:'sortie',x:-17.2,z:6,r:1.6,label:'🚪 Sortir vers la cour (ambulance)'}]
};
export const COUR={
  nom:'Cour de l’hôpital',start:{x:-6,z:4},
  sols:[S(-14,-8,14,8,'#8d9098','Cour'),S(-14,-8,14,-3,'#78b36a','Pelouse')],
  murs:[MU(-14,-8,14,-8),MU(-14,8,14,8),MU(-14,-8,-14,8),MU(14,-8,14,8)],
  objets:[
    B('ambulance','Ambulance',3,0,5.2,2.2,2.4,'#ffffff',{panneau:'ambulance',label:'🚑 Ambulance : découvrir et voyager',ex:'Une ambulance : un véhicule équipé pour transporter un patient en sécurité.',parts:[{t:'box',w:5.2,h:1.5,d:2.2,y:1.2,c:'#ffffff'},{t:'box',w:1.5,h:1,d:2.1,x:2.2,y:1.2,c:'#ffffff'},{t:'box',w:5.3,h:.25,d:2.25,y:.9,c:'#d6302b'},{t:'box',w:.15,h:1.1,d:.5,y:1.5,z:0,x:-.6,c:'#d6302b'},{t:'box',w:.5,h:.15,d:.15,y:1.5,x:-.6,z:0,c:'#d6302b'},{t:'box',w:.3,h:.2,d:.6,x:1.8,y:2.05,c:'#2c7fb8'},{t:'cyl',r:.4,h:.3,x:1.8,y:.4,z:1,c:'#222'},{t:'cyl',r:.4,h:.3,x:-1.5,y:.4,z:1,c:'#222'}]}),
    B('entree_h','Entrée de l’hôpital',-12,0,1.2,3,2.4,'#2b6e8f',{panneau:'entree',label:'🏥 Entrer dans l’hôpital',ex:'L’entrée principale de l’hôpital.',bloque:false}),
    B('arbre1','Arbre',-8,-5,1.2,1.2,3,'#2f7d3a'),B('arbre2','Arbre',9,-5,1.2,1.2,3,'#2f7d3a'),
    B('banc_c','Banc',-6,-1,2,.6,.5,'#8a5a2b'),B('panneau_h','Panneau « Hôpital »',-8,3,.2,2,2.4,'#2b6e8f',{plaque:true,ex:'🏥 Hôpital : urgences, pédiatrie, consultations. En cas de vraie urgence, on appelle les secours.',bloque:false})
  ],
  pnj:[PNJ('ambu','Ambulancier Kasa','Ambulancier',6.6,1.4,Math.PI*.6,{s:'h',skin:2,hair:'courtes',outfit:'uniforme',c:'#e8a23a'},{dial:'ambu'})],
  sorties:[{id:'sortie',x:-13,z:0,r:1.6,label:'🏥 Retour dans l’hôpital'}]
};
export const DIAL={
  acc:{nom:'Mme Ilunga, agente d’accueil',n0:{t:'Bienvenue au BOYEKOLI MEDICAL CENTER ! Ici tout est simulé pour apprendre. Prends ta blouse de professionnel et commence ta première journée.',c:[['Comment ça marche ?','n1'],['Merci.',null]]},
    n1:{t:'Mission 1 : reçois des patients fictifs, pose des questions, mesure, examine et propose une conduite. Mission 2 : découvre les métiers de chaque service. Le jeu ne remplace jamais un vrai médecin.',c:[['Merci.','n0']]}},
  dr:{nom:'Dr Mbala, médecin',n0:{t:'Le médecin écoute, examine, comprend, puis explique. Il ne devine pas : il observe les signes, mesure et choisit un examen utile.',c:[['Pourquoi consulter un médecin ?','n1'],['Merci.',null]]},n1:{t:'Parce qu’un professionnel sait distinguer un petit rhume d’un vrai problème. En cas de doute, on demande toujours l’avis d’un adulte et d’un professionnel de santé.',c:[['Merci.','n0']]}},
  pedia:{nom:'Dre Kalala, pédiatre',n0:{t:'Je soigne les enfants. Pour les rassurer, on sourit, on explique avec des mots simples, et on leur laisse la parole.',c:[['Merci.',null]]}},
  inf:{nom:'Infirmier Mado',n0:{t:'Je prépare les soins : je me lave les mains, je mets des gants et je surveille la température et le pouls.',c:[['Pourquoi se laver les mains ?','n1'],['Merci.',null]]},n1:{t:'Les mains transportent des microbes. Se laver les mains avec du savon pendant 20 secondes protège les patients et nous-mêmes.',c:[['Merci.','n0']]}},
  pharm:{nom:'M. Tshiala, pharmacien',n0:{t:'À la pharmacie, on range les médicaments, on vérifie la date limite et on explique comment les utiliser. On ne partage jamais ses médicaments.',c:[['Merci.',null]]}},
  chir:{nom:'Dr Nsimba, chirurgien',n0:{t:'Le chirurgien opère avec une équipe, dans une salle très propre. Ici, c’est une salle simulée : on découvre seulement le matériel.',c:[['Merci.',null]]}},
  chef:{nom:'Pr Kabongo, médecin-chef',n0:{t:'Je dirige l’hôpital. Réussis tes deux missions pour obtenir tes badges et le certificat de découverte des métiers médicaux.',c:[['Merci.',null]]}},
  patient:{nom:'Patient (fictif)',n0:{t:'Bonjour… je ne me sens pas très bien. Pouvez-vous m’aider ?',c:[['Je m’occupe de vous : consulter le dossier.','__cas'],['Je reviens dans un instant.',null]]}},
  enfant:{nom:'Enfant patient (fictif)',n0:{t:'J’ai un peu peur… tu peux me dire ce qui va se passer ?',c:[['Je vais t’expliquer doucement, ne t’inquiète pas.',null]]}},
  ambu:{nom:'Ambulancier Kasa',n0:{t:'Je conduis l’ambulance. Nous protégeons, alertons et secourons. Viens voir l’intérieur de l’ambulance !',c:[['Merci.',null]]}}
};
// ---------- cas cliniques fictifs (mission 1) ----------
export const CAS=[
  {id:'fievre',nom:'Léo, 8 ans',motif:'Fièvre et fatigue depuis hier',dossier:'Âge : 8 ans · Poids : 27 kg · Antécédents : aucun · Allergies connues : aucune (dossier fictif)',
   questions:[['Depuis quand as-tu de la fièvre ?','Depuis hier soir. J’ai chaud et j’ai mal à la tête.',true],['As-tu mal au ventre ?','Non, pas vraiment.',false],['Bois-tu bien ?','Pas beaucoup, je n’ai pas soif.',true],['Quel est ton jeu préféré ?','Le football !',false],['As-tu toussé ?','Un tout petit peu.',false],['As-tu des boutons sur la peau ?','Non.',true]],
   symptomes:['Fièvre','Mal de tête','Fatigue','Douleur au genou','Boutons rouges'],bons:['Fièvre','Mal de tête','Fatigue'],
   mesures:{temp:'38,6 °C (un peu élevée)',pouls:'96 battements/min (un peu rapide)',tension:'102/64 (normale pour un enfant)',oxy:'98 % (normal)'},
   coeur:'Les battements sont réguliers, un peu rapides.',poumons:'La respiration est claire.',gorge:'La gorge est un peu rouge.',
   exam:{bon:'sang',choix:[['Une prise de sang (simulée)','sang'],['Une radiographie','radio'],['Une échographie','echo'],['Aucun examen','aucun']],rapport:'Compte rendu fictif : signes d’une petite infection virale. Rien d’inquiétant dans ce scénario.'},
   conduite:[['Se reposer, boire de l’eau et être suivi par un professionnel de santé','ok','Le repos et l’eau aident le corps à se défendre, et le médecin surveille.'],['Prendre n’importe quel médicament trouvé à la maison','non','Ne prends jamais un médicament sans l’avis d’un adulte et d’un professionnel.'],['Aller jouer dehors toute la journée','non','Avec de la fièvre, le corps a besoin de repos.']],
   role:'Le médecin observe les signes, mesure et choisit des examens utiles pour comprendre la cause de la fièvre.'},
  {id:'rhume',nom:'Mina, 6 ans',motif:'Nez qui coule et petite toux',dossier:'Âge : 6 ans · Poids : 21 kg · Antécédents : rhumes fréquents en saison des pluies · Allergies : aucune (dossier fictif)',
   questions:[['Depuis quand coule ton nez ?','Depuis deux jours.',true],['As-tu de la fièvre ?','Je ne crois pas, je n’ai pas chaud.',true],['Tu manges bien ?','Oui, j’ai faim.',false],['Où habites-tu ?','Près de l’école.',false],['As-tu mal à la gorge ?','Un peu quand j’avale.',true],['Aimes-tu dessiner ?','Oui beaucoup !',false]],
   symptomes:['Nez qui coule','Toux légère','Mal de gorge','Fracture','Forte fièvre'],bons:['Nez qui coule','Toux légère','Mal de gorge'],
   mesures:{temp:'36,9 °C (normale)',pouls:'88 battements/min (normal)',tension:'98/60 (normale)',oxy:'99 % (normal)'},
   coeur:'Les battements sont réguliers.',poumons:'La respiration est claire, avec une toux légère.',gorge:'La gorge est un peu irritée.',
   exam:{bon:'aucun',choix:[['Une radiographie','radio'],['Une prise de sang (simulée)','sang'],['Aucun examen supplémentaire','aucun'],['Une échographie','echo']],rapport:'Pas d’examen nécessaire : c’est un rhume banal dans ce scénario.'},
   conduite:[['Se reposer, boire, se laver les mains et se moucher avec un mouchoir jetable','ok','Ces gestes aident à guérir et évitent de contaminer les autres.'],['Partager sa tasse avec ses camarades','non','Partager sa tasse transmet les microbes.'],['Éternuer dans ses mains sans les laver','non','On éternue dans son coude et on se lave les mains.']],
   role:'Le médecin rassure, explique les bons gestes et sait quand un examen n’est pas nécessaire.'},
  {id:'blessure',nom:'Paul, 9 ans',motif:'Petite égratignure au genou après une chute',dossier:'Âge : 9 ans · Poids : 30 kg · Vaccins : à jour (dossier fictif) · Allergies : aucune',
   questions:[['Comment est-ce arrivé ?','Je suis tombé en jouant au ballon.',true],['As-tu mal ailleurs ?','Non, seulement au genou.',true],['Peux-tu plier la jambe ?','Oui, sans problème.',true],['Quelle est ta matière préférée ?','Les sciences !',false],['Combien de frères as-tu ?','Deux.',false],['As-tu saigné beaucoup ?','Non, très peu.',true]],
   symptomes:['Égratignure au genou','Saignement léger','Douleur modérée','Forte fièvre','Mal au ventre'],bons:['Égratignure au genou','Saignement léger','Douleur modérée'],
   mesures:{temp:'36,8 °C (normale)',pouls:'92 battements/min (normal)',tension:'100/62 (normale)',oxy:'99 % (normal)'},
   coeur:'Les battements sont réguliers.',poumons:'La respiration est normale.',gorge:'Rien à signaler.',
   exam:{bon:'aucun',choix:[['Une radiographie','radio'],['Aucun examen : un nettoyage et un pansement suffisent','aucun'],['Une prise de sang (simulée)','sang'],['Une échographie','echo']],rapport:'La plaie est superficielle : pas d’examen nécessaire dans ce scénario.'},
   conduite:[['Laver la plaie à l’eau propre et au savon, puis mettre un pansement propre','ok','Un lavage soigneux évite l’infection.'],['Mettre de la terre sur la plaie','non','Jamais de terre : elle contient des microbes.'],['Ne rien faire du tout','non','Il faut toujours nettoyer une plaie, même petite.']],
   role:'Le soignant sait nettoyer une petite plaie et reconnaît quand il faut un avis médical.'},
  {id:'fatigue',nom:'Aïcha, 10 ans',motif:'Fatigue depuis plusieurs jours',dossier:'Âge : 10 ans · Poids : 32 kg · Antécédents : aucun · Allergies : aucune (dossier fictif)',
   questions:[['Dors-tu bien la nuit ?','Je me couche tard pour regarder la télévision.',true],['Que manges-tu le matin ?','Souvent rien.',true],['As-tu de la fièvre ?','Non.',true],['Quel est ton animal préféré ?','Le chat.',false],['Fais-tu du sport ?','Pas beaucoup.',true],['As-tu un grand frère ?','Oui, il s’appelle David.',false]],
   symptomes:['Fatigue','Sommeil insuffisant','Petit-déjeuner sauté','Toux grasse','Éruption cutanée'],bons:['Fatigue','Sommeil insuffisant','Petit-déjeuner sauté'],
   mesures:{temp:'36,7 °C (normale)',pouls:'84 battements/min (normal)',tension:'100/60 (normale)',oxy:'99 % (normal)'},
   coeur:'Les battements sont réguliers.',poumons:'La respiration est normale.',gorge:'Rien à signaler.',
   exam:{bon:'sang',choix:[['Une prise de sang (simulée) pour vérifier qu’il n’y a pas de carence','sang'],['Une radiographie','radio'],['Une échographie','echo'],['Aucun examen','aucun']],rapport:'Compte rendu fictif : tout est normal. La fatigue vient surtout du manque de sommeil et d’un petit-déjeuner sauté.'},
   conduite:[['Dormir assez, prendre un petit-déjeuner équilibré, bouger et revoir un professionnel si cela continue','ok','Un bon sommeil, une alimentation équilibrée et du sport donnent de l’énergie.'],['Boire des boissons énergisantes','non','Les boissons énergisantes ne sont pas faites pour les enfants.'],['Se coucher encore plus tard','non','Le sommeil est essentiel pour grandir.']],
   role:'Le médecin cherche toutes les causes possibles (sommeil, alimentation, santé) avant de conseiller.'}
];
// ---------- services (mission 2) ----------
export const SERVICES={
  labo:{nom:'Laboratoire d’analyses',ico:'🧪',role:'Le laborantin analyse des échantillons (sang, urine) pour aider le médecin. Il ne pose pas le diagnostic, il fournit des mesures.',
    items:[{q:'Échantillon A : hémoglobine 8 g/dL. La valeur normale d’un enfant est de 11 à 14. Que dire ?',c:['Elle est plus basse que la normale','Elle est normale','Elle est plus haute que la normale'],a:0,exp:'8 est inférieur à 11 : c’est bas, le médecin cherchera pourquoi.'},{q:'Échantillon B : globules blancs 7 (normal : 5 à 10). Que dire ?',c:['Normal','Trop bas','Trop haut'],a:0,exp:'7 est dans l’intervalle normal.'},{q:'Échantillon C : sucre dans le sang 0,9 g/L (normal : 0,7 à 1,1). Que dire ?',c:['Normal','Trop bas','Trop haut'],a:0,exp:'0,9 est dans l’intervalle normal.'}]},
  radio:{nom:'Radiologie',ico:'☢',role:'Le radiologue prend des images des os et des organes avec des rayons ou des ultrasons, pour aider le médecin à voir sans ouvrir.',
    items:[{os:'bras',fracture:{x:100,y:70,r:14},txt:'Radiographie fictive d’un bras : touche l’endroit où l’os est cassé.'},{os:'jambe',fracture:{x:60,y:120,r:14},txt:'Radiographie fictive d’une jambe : touche l’endroit où l’os est cassé.'}]},
  pharma:{nom:'Pharmacie',ico:'💊',role:'Le pharmacien range les médicaments, vérifie les dates limites et explique leur bon usage. On ne partage jamais ses médicaments.',
    items:[['Sirop (liquide)','sirops'],['Comprimé','comprimes'],['Crème pour la peau','pommades'],['Vaccin (flacon)','vaccins'],['Gouttes pour le nez','sirops'],['Gélule','comprimes']],cats:[['sirops','🧴 Liquides'],['comprimes','💊 À avaler'],['pommades','🧴 Pour la peau'],['vaccins','💉 Vaccins (au froid)']]},
  pediatrie:{nom:'Pédiatrie',ico:'🧸',role:'Le pédiatre soigne les enfants et sait les rassurer avec des mots simples et de la douceur.',
    items:[{q:'Un enfant de 4 ans pleure en entrant. Que fais-tu ?',c:['Je m’agenouille, je souris et j’explique doucement','Je lui dis de se taire','Je ne lui parle pas'],a:0,exp:'On se met à sa hauteur et on explique avec des mots simples.'},{q:'Un enfant a peur de la piqûre (simulée). Que dis-tu ?',c:['« Ça va aller, je t’explique ce que je fais »','« Arrête de bouger ! »','« Ce n’est rien du tout, tais-toi »'],a:0,exp:'On rassure sans mentir et on explique chaque geste.'}]},
  urgences:{nom:'Urgences',ico:'🚨',role:'Aux urgences, une infirmière de tri décide qui doit être soigné en premier : le plus urgent d’abord, pas le premier arrivé.',
    items:[['Un enfant avec une égratignure légère','vert'],['Une personne qui respire très difficilement','rouge'],['Quelqu’un avec une cheville qui gonfle mais qui marche','vert'],['Une personne très pâle qui perd connaissance','rouge'],['Un enfant avec une fièvre depuis hier, qui boit bien','orange']],ordre:['rouge','orange','vert']},
  bloc:{nom:'Chirurgie',ico:'🔪',role:'L’équipe chirurgicale opère dans une salle très propre, avec du matériel stérile. Ici, la salle est simulée : on découvre seulement le matériel et l’hygiène.',
    items:[['Scalpel','Un petit couteau très fin pour inciser'],['Pince','Pour saisir et tenir les tissus'],['Compresses','Pour absorber le sang et nettoyer'],['Masque et gants','Pour protéger le patient et l’équipe'],['Lampe scialytique','Pour éclairer sans ombre']],hygiene:['Se laver les mains','Mettre le masque','Enfiler les gants stériles','Commencer les soins']}
};
export const INSTRUMENTS=[['stetho','🩺','Stéthoscope'],['thermo','🌡','Thermomètre'],['tension','🩸','Tensiomètre'],['oxy','🫁','Oxymètre']];
export const AMBULANCE_EQUIP=[
  {id:'civiere',nom:'Civière',ico:'🛏',txt:'Pour transporter un patient couché, sans secousses.',x:0,y:-.1},
  {id:'oxygene',nom:'Bouteille d’oxygène',ico:'🧪',txt:'Pour aider à respirer quand c’est nécessaire.',x:-.8,y:.4},
  {id:'dae',nom:'Défibrillateur (DAE)',ico:'⚡',txt:'Un appareil qui guide, par la voix, les gestes pour aider un cœur à repartir. Il ne se manipule qu’avec une formation.',x:.8,y:.4},
  {id:'trousse',nom:'Trousse de secours',ico:'🩹',txt:'Compresses, pansements, désinfectant, couverture de survie.',x:.8,y:-.3},
  {id:'radio',nom:'Radio',ico:'📻',txt:'Pour prévenir l’hôpital de l’arrivée du patient.',x:-.8,y:-.3}
];
export const PREMIERS_SECOURS=[
  {t:'Protéger',txt:'Je regarde autour de moi : y a-t-il un danger (route, feu, eau) ? Je ne me mets pas en danger.'},
  {t:'Alerter',txt:'J’appelle les secours (le numéro d’urgence de mon pays) ou je demande à un adulte de le faire, et je donne le lieu, ce qui s’est passé et le nombre de personnes.'},
  {t:'Secourir',txt:'En attendant les secours, je rassure la personne, je ne la déplace pas sans raison et je fais les gestes simples que je connais (par exemple laver une petite plaie).'},
  {t:'Les gestes à retenir',txt:'Petite plaie : eau propre et savon. Brûlure légère : eau fraîche. Saignement de nez : tête penchée en avant. Ne jamais donner de médicament sans l’avis d’un professionnel.'}
];
export const TRANSPORT=[
  {de:'École',a:'Hôpital',txt:'Un enfant s’est blessé à l’école : le directeur appelle les secours.'},
  {de:'Marché',a:'Hôpital',txt:'Une personne se sent mal au marché : les gens font de la place pour laisser passer l’ambulance.'},
  {de:'Hôpital',a:'Maison',txt:'Un patient guéri est raccompagné chez lui par l’ambulance de transport.'}
];
export const FICHES=[
  ['🫀 Le cœur','Il pompe le sang, environ 70 fois par minute au repos. Faire du sport le rend plus fort.'],['🫁 Les poumons','Ils apportent l’oxygène de l’air au sang. On les protège en évitant la fumée.'],
  ['🍽 Le système digestif','De la bouche à l’intestin : il transforme les aliments en énergie. Manger varié et boire de l’eau aide.'],['💀 Le squelette','206 os chez l’adulte : ils soutiennent le corps et protègent les organes.'],
  ['🩸 La circulation du sang','Le cœur envoie le sang dans les artères ; il revient par les veines. Le sang transporte l’oxygène.'],['🧼 L’hygiène','Se laver les mains, les dents, prendre une douche : cela évite beaucoup de maladies.'],
  ['🛡 La prévention','Moustiquaire, eau propre, mains lavées, vaccins à jour : mieux vaut prévenir que guérir.'],['🥗 Alimentation équilibrée','Fruits, légumes, féculents (manioc, riz), protéines (poisson, haricots), eau : un peu de tout chaque jour.'],['💉 La vaccination','Les vaccins entraînent le corps à se défendre contre des maladies graves. Ils sont sûrs et protègent aussi les autres.']
];
