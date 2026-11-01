// BOYEKOLI DETECTIVE – contenu préprogrammé (sans IA) : agence, deux enquêtes, laboratoire, cours de détective.
// Toutes les enquêtes sont sans violence : ce sont des mystères de la vie quotidienne (oubli, malentendu, objet déplacé).
export const COULEURS_MANTEAU=['#7a5a3a','#1f4e79','#6a1b9a','#2e7d32','#b23a3a','#3a3a3a'];
export const COIFFURES=[['Courtes','courtes'],['Tresses','tresses'],['Afro','afro'],['Chignon','chignon'],['Locks','locks']];

// ---------- helpers de décor ----------
// une pièce : sol coloré
const S=(x0,z0,x1,z1,coul,nom)=>({x0,z0,x1,z1,coul,nom});
// un mur droit avec portes : portes = [centre,largeur] le long de l'axe
const MU=(x0,z0,x1,z1,portes)=>({x0,z0,x1,z1,portes:portes||[]});
const B=(id,nom,x,z,w,d,h,c,o)=>Object.assign({id,nom,x,z,w,d,h,c,bloque:true},o||{});
const PNJ=(id,nom,role,x,z,ry,look,o)=>Object.assign({id,nom,role,x,z,ry,look},o||{});

// ---------- L'AGENCE ----------
export const AGENCE={
  nom:'Agence de détectives BOYEKOLI',
  start:{x:-9.5,z:-3},
  sols:[S(-12,-8,0,2,'#c9a77c','Bureau'),S(0,-8,12,-1,'#8a97a8','Salle d’interrogatoire'),S(0,-1,12,8,'#dfe9ee','Laboratoire'),S(-12,2,0,8,'#8d8d94','Garage')],
  murs:[MU(-12,-8,12,-8),MU(-12,8,12,8),MU(-12,-8,-12,8,[[-3,2.4]]),MU(12,-8,12,8),MU(0,-8,0,8,[[-4,2.2],[5,2.2]]),MU(-12,2,0,2,[[-6,3]]),MU(0,-1,12,-1,[[6,3]])],
  objets:[
    B('bureau_l','Bureau du détective',-6,-5.2,3.4,1.4,.9,'#7a4a26'),
    B('ordinateur','Ordinateur d’enquêtes',-6,-5.4,.9,.5,1.35,'#222',{panneau:'dossiers',label:'💻 Ordinateur : dossiers d’enquêtes',ex:'L’ordinateur de l’agence : il contient les dossiers des affaires à résoudre.',bloque:false}),
    B('tableau','Tableau d’investigation',-10.6,-7.5,5,.2,2.2,'#e9e2cf',{panneau:'tableau',label:'📌 Tableau d’investigation',ex:'Le grand tableau où l’on relie les preuves, avec des photos et des fils rouges.',bloque:false,plaque:true}),
    B('carte','Carte de la ville',-2.2,-7.5,3,.2,1.9,'#cfe0f0',{panneau:'carte',label:'🗺 Carte interactive',ex:'La carte de la ville : on y choisit le lieu de l’enquête.',bloque:false,plaque:true}),
    B('biblio','Bibliothèque documentaire',-11.2,-1,.8,4.4,2.2,'#6b4423',{panneau:'biblio',label:'📚 Bibliothèque documentaire',ex:'Des livres et des fiches pour apprendre le métier de détective.',bloque:true}),
    B('canape','Canapé',-3,-3.5,2,.9,.5,'#2c7fb8'),
    B('plante1','Plante',-0.8,0.9,.5,.5,1,'#2e7d32'),
    B('table_i','Table d’interrogatoire',6,-4.5,2.6,1.2,.8,'#a0a0a8'),
    B('chaise_i1','Chaise',4.4,-4.5,.6,.6,.5,'#555'),B('chaise_i2','Chaise',7.6,-4.5,.6,.6,.5,'#555'),
    B('miroir','Miroir sans tain',6,-7.5,3,.2,1.9,'#8ab0c8',{ex:'Un miroir sans tain : d’un côté on se regarde, de l’autre on observe sans être vu.',bloque:false,plaque:true}),
    B('labo','Paillasse du laboratoire',6,5.2,6,1.4,.95,'#f3f3f3',{panneau:'labo',label:'🔬 Laboratoire : analyser les indices',ex:'La paillasse du laboratoire avec microscope, loupe et poudre à empreintes.',bloque:true}),
    B('microscope','Microscope',4.5,5.1,.4,.4,1.3,'#333',{bloque:false}),
    B('armoire_l','Armoire à produits',11.4,3,.8,3,2,'#cfd8dc'),
    B('voiture','Véhicule d’enquête',-6,5.4,3.6,1.8,1.1,'#d6302b',{panneau:'vehicule',label:'🚓 Véhicule d’enquête : partir en mission',ex:'Le véhicule de l’agence, prêt à partir sur le lieu de l’enquête.'}),
    B('velo','Vélo d’enquête',-9.8,6.6,1.6,.5,.9,'#2e7d32',{ex:'Un vélo pour les petites enquêtes près de l’agence.'}),
    B('cones','Cônes de sécurité',-2.8,6.8,.5,.5,.5,'#ff7a1a',{bloque:false})
  ],
  pnj:[PNJ('leo','Inspecteur Léo','Assistant d’enquête',-4.4,-2.6,Math.PI*.5,{s:'h',skin:2,hair:'courtes',outfit:'polo',c:'#1f4e79'},{dial:'leo'}),
       PNJ('mado','Inspectrice Mado','Chef de l’agence',2.6,-5.4,-Math.PI*.5,{s:'f',skin:4,hair:'chignon',outfit:'robe',c:'#6a1b9a',acc:['lunettes']},{dial:'mado'})],
  sorties:[{id:'sortie',x:-11.3,z:-3,r:1.6,label:'🚪 Sortir de l’agence'}]
};

// ---------- ENQUÊTE 1 : LE MYSTÈRE DU MUSÉE ----------
export const MUSEE={
  id:'musee',titre:'Le mystère du musée',ico:'🏛',lieu:'Musée du Congo',
  intro:'Le Masque Kuba, un objet historique du musée, n’est plus dans sa vitrine ! Personne n’a vu de voleur. Examine les salles, interroge les témoins, compare les indices et trouve ce qui s’est réellement passé. Personne n’a été blessé : c’est un mystère à résoudre avec ta tête.',
  start:{x:-11,z:6},
  sols:[S(-13,-8,-4,8,'#e6d9c0','Hall d’entrée'),S(-4,-1,5,8,'#d9c7a0','Salle d’histoire'),S(5,-1,13,8,'#cfd8e6','Salle des arts'),S(-4,-8,13,-1,'#c8c0b0','Atelier de restauration')],
  murs:[MU(-13,-8,13,-8),MU(-13,8,13,8),MU(-13,-8,-13,8),MU(13,-8,13,8),MU(-4,-8,-4,8,[[3,2.4],[-4.5,0.01]].slice(0,1)),MU(5,-1,5,8,[[3.5,2.4]]),MU(-4,-1,13,-1,[[1,1.6]])],
  objets:[
    B('accueil','Comptoir d’accueil',-10,-4,3.4,1.2,1,'#7a4a26'),
    B('registre','Registre de sécurité',-10,-4.3,.6,.4,1.05,'#c0392b',{bloque:false,indice:'registre',label:'📒 Registre de sécurité',ex:'Le registre où le gardien note ses rondes. Une ligne : « Ronde de la salle d’histoire : 16h50 → 17h00 ».',cacheNom:false}),
    B('tiroir','Tiroir du comptoir',-11.2,-3.4,.5,.5,.5,'#5a3a22',{bloque:false,indice:'cle',cache:true,label:'🗝 Tiroir du comptoir',ex:'Dans le tiroir, une petite clé étiquetée « Atelier de restauration ».'}),
    B('banc_h','Banc du hall',-7,3,2.4,.8,.5,'#8a5a2b'),
    B('ticket','Ticket de visite',-7.4,3.6,.4,.3,.05,'#f5f0e0',{bloque:false,indice:'ticket',label:'🎟 Ticket de visite',ex:'Un ticket d’entrée oublié sur le banc : « Entrée 17h45 ». Il ne date donc pas de l’heure de la disparition.'}),
    B('vitrine','Vitrine du Masque Kuba',0.5,2,2,1.2,1.7,'#9fc5e8',{bloque:true,indice:'vitrine',label:'🔍 Vitrine vide',ex:'La vitrine est vide mais la serrure est intacte et le verre n’est pas cassé : le masque a été retiré avec soin, sans violence.'}),
    B('empreinte_v','Empreinte sur la vitre',0.5,2.7,.5,.1,1.2,'#dfe9f2',{bloque:false,indice:'empreinte',cache:true,label:'🖐 Empreinte sur la vitre',ex:'Une empreinte de pouce est restée sur le verre. On peut la comparer au laboratoire.'}),
    B('poudre','Traces de poudre blanche',1.2,4.5,2.4,1,.03,'#f2f2f2',{bloque:false,indice:'poudre',cache:true,label:'⚪ Poudre blanche',ex:'De la poudre blanche forme une traînée qui part de la vitrine vers la porte de l’atelier.'}),
    B('banc_hist','Banc des visiteurs',-2,4,2.4,.8,.5,'#8a5a2b'),
    B('gants','Gants blancs',-2.3,4.2,.4,.3,.06,'#f8f8f8',{bloque:false,indice:'gants',cache:true,label:'🧤 Gants blancs',ex:'Des gants de coton blancs, poudrés de la même poudre blanche, cachés sous le banc.'}),
    B('tableau_h','Grande fresque',-2.5,7.5,4,.2,2,'#d9a54a',{plaque:true,ex:'Une fresque qui raconte l’histoire du royaume Kuba.',bloque:false}),
    B('toile1','Tableau « Le fleuve »',7,7.5,2.4,.2,1.6,'#3a8fcf',{plaque:true,ex:'Un tableau du fleuve Congo au coucher du soleil.',bloque:false}),
    B('socle','Statue sur socle',11,5,1,1,1.6,'#9a8f80',{ex:'Une statue de bronze, bien en place.'}),
    B('bureau_arts','Bureau de restauration (salle des arts)',11.4,0.4,2.2,.9,.9,'#7a4a26'),
    B('carnet_r','Carnet de restauration',11.4,0.2,.5,.4,.95,'#2e7d32',{bloque:false,indice:'carnet',cache:true,label:'📗 Carnet de restauration',ex:'Le carnet de la restauratrice : « Masque Kuba : nettoyage au pinceau avant l’exposition de samedi. » Aucune autorisation écrite n’y figure.'}),
    B('table_at','Table de restauration',8,-5,3.4,1.4,.9,'#a0794a'),
    B('masque','Le Masque Kuba',8,-5.2,.6,.5,1.25,'#b5602a',{bloque:false,cible:true,label:'🎭 Le Masque Kuba !',ex:'Le Masque Kuba est ici, sur la table de restauration, propre et en parfait état.'}),
    B('pinceaux','Pinceaux et chiffons',6.2,-5.4,.5,.4,.95,'#e0c05a',{bloque:false,ex:'Des pinceaux souples et des chiffons : le matériel d’une restauratrice.'}),
    B('porte_at','Porte de l’atelier',1,-1,1.6,.25,2.2,'#6b4423',{ferme:'cle',label:'🔒 Porte de l’atelier',bloque:false})
  ],
  pnj:[
    PNJ('kabeya','M. Kabeya','Gardien',-11.5,-1.2,Math.PI*.9,{s:'h',skin:1,hair:'courtes',outfit:'uniforme',c:'#1f4e79'},{dial:'kabeya'}),
    PNJ('nzuzi','Mme Nzuzi','Guide du musée',-1,6,Math.PI,{s:'f',skin:3,hair:'tresses',outfit:'robe',c:'#2e9e4a'},{dial:'nzuzi'}),
    PNJ('tshimanga','M. Tshimanga','Visiteur',-6.4,6.2,Math.PI*.3,{s:'h',skin:5,hair:'afro',outfit:'polo',c:'#c0392b'},{dial:'tshimanga'}),
    PNJ('lunda','Mme Lunda','Restauratrice',9.5,5.6,Math.PI,{s:'f',skin:2,hair:'chignon',outfit:'pagne',c:'#e67e22',acc:['lunettes']},{dial:'lunda'})
  ],
  sorties:[{id:'sortie',x:-12.2,z:7,r:1.6,label:'🚪 Quitter le musée'}],
  indices:{
    vitrine:{nom:'Vitrine ouverte sans effraction',ico:'🔍',txt:'Serrure intacte, verre intact : le masque a été retiré par quelqu’un qui avait accès à la vitrine.'},
    empreinte:{nom:'Empreinte sur la vitre',ico:'🖐',txt:'Une empreinte de pouce, à comparer au laboratoire.',analyse:'empreinte'},
    poudre:{nom:'Traces de poudre blanche',ico:'⚪',txt:'Une traînée de poudre blanche va de la vitrine à la porte de l’atelier.',analyse:'poudre'},
    gants:{nom:'Gants de coton blancs',ico:'🧤',txt:'Des gants poudrés de la même poudre : ils servent à ne pas abîmer les objets anciens.'},
    registre:{nom:'Registre de sécurité',ico:'📒',txt:'Le gardien a quitté l’entrée pour sa ronde de 16h50 à 17h00.'},
    ticket:{nom:'Ticket de visite 17h45',ico:'🎟',txt:'Entrée à 17h45 : le visiteur est arrivé après 17h00.'},
    cle:{nom:'Clé de l’atelier',ico:'🗝',txt:'Permet d’ouvrir la porte de l’atelier de restauration.'},
    carnet:{nom:'Carnet de restauration',ico:'📗',txt:'« Masque Kuba : nettoyage prévu avant samedi. » Aucune autorisation écrite.'}
  },
  dialogues:{
    kabeya:{nom:'M. Kabeya, gardien',n0:{t:'Bonjour petit détective. Le Masque a disparu et je n’y comprends rien ! Ce soir je suis resté à mon poste d’entrée, je n’ai pas bougé.',c:[['Où étiez-vous à 17h ?','n1'],['Avez-vous vu quelqu’un avec des gants blancs ?','n2'],['Merci, c’est tout pour le moment.',null]]},
      n1:{t:'À mon comptoir, comme toujours. Je n’ai quitté l’entrée à aucun moment, je le jure.',temo:{id:'t_kab',txt:'M. Kabeya affirme n’avoir jamais quitté l’entrée ce soir.'},c:[['D’accord, merci.','n0'],['Montrez-moi votre registre.','n3']]},
      n2:{t:'Des gants blancs ? Non… ce sont les restauratrices qui en portent, je crois.',temo:{id:'t_kab2',txt:'Selon le gardien, les gants blancs sont portés par les restauratrices.'},c:[['Merci.','n0']]},
      n3:{t:'Euh… le registre est sur le comptoir. Regardez-le vous-même.',c:[['Merci.','n0']]}},
    nzuzi:{nom:'Mme Nzuzi, guide',n0:{t:'Quelle histoire ! Ce soir, j’ai guidé un groupe dans la salle d’histoire jusqu’à 16h45, puis je suis allée aux archives.',c:[['Avez-vous vu quelque chose d’étrange ?','n1'],['Qui était dans le musée ?','n2'],['Merci.',null]]},
      n1:{t:'Vers 16h55, j’ai vu quelqu’un avec des gants blancs sortir de la salle d’histoire et aller vers l’atelier. Je n’ai pas vu son visage.',temo:{id:'t_nz',txt:'Mme Nzuzi a vu, vers 16h55, quelqu’un porter des gants blancs vers l’atelier.'},c:[['Merci, très utile.','n0']]},
      n2:{t:'Le gardien à l’entrée, un visiteur dans le hall, Mme Lunda la restauratrice et moi.',c:[['Merci.','n0']]}},
    tshimanga:{nom:'M. Tshimanga, visiteur',n0:{t:'Je suis un simple visiteur ! Je suis parti du musée à 17h, je n’ai rien à voir avec cette histoire.',c:[['À quelle heure êtes-vous parti ?','n1'],['Qu’avez-vous vu ?','n2'],['Merci.',null]]},
      n1:{t:'À 17h pile. Ensuite j’ai attendu un taxi devant. Puis je suis revenu chercher mon parapluie… mais je n’ai rien touché.',temo:{id:'t_tsh',txt:'M. Tshimanga dit être parti à 17h.'},c:[['Merci.','n0']]},
      n2:{t:'J’ai vu le gardien près de la salle d’histoire, un peu avant 17h. Il courait presque !',temo:{id:'t_tsh2',txt:'M. Tshimanga a vu le gardien près de la salle d’histoire peu avant 17h.'},c:[['Intéressant.','n0']]}},
    lunda:{nom:'Mme Lunda, restauratrice',n0:{t:'Oh, bonjour ! Cette affaire m’inquiète beaucoup. Moi, je n’ai pas quitté la salle des arts de toute la journée.',temo:{id:'t_lun',txt:'Mme Lunda affirme ne pas avoir quitté la salle des arts de la journée.'},c:[['Que faites-vous dans ce musée ?','n1'],['Connaissez-vous cette empreinte et ces gants ?','n2'],['Merci.',null]]},
      n1:{t:'Je restaure les objets anciens : je les nettoie avec des pinceaux et une poudre spéciale, en portant des gants de coton.',temo:{id:'t_lun2',txt:'Mme Lunda nettoie les objets avec une poudre spéciale, en portant des gants blancs.'},c:[['Merci.','n0']]},
      n2:{t:'Je… je préfère ne pas répondre tout de suite. Cherchez encore !',c:[['D’accord.','n0']]}}
  },
  liens:[
    {a:'registre',b:'t_kab',txt:'Le registre prouve que le gardien a quitté l’entrée de 16h50 à 17h00 : son témoignage est faux.'},
    {a:'ticket',b:'t_tsh',txt:'Le ticket indique 17h45 : cela ne contredit pas vraiment le visiteur qui dit être revenu plus tard. Ce n’est pas la bonne piste.',faux:true},
    {a:'gants',b:'t_nz',txt:'Les gants blancs correspondent à la personne vue vers l’atelier par Mme Nzuzi.'},
    {a:'poudre',b:'t_lun2',txt:'La poudre blanche est la poudre spéciale utilisée par Mme Lunda pour nettoyer les objets.'},
    {a:'carnet',b:'t_lun',txt:'Le carnet prévoit un nettoyage du masque, alors que Mme Lunda affirme ne pas avoir quitté la salle des arts : elle s’est contredite.'},
    {a:'vitrine',b:'gants',txt:'Une vitrine ouverte sans effraction et des gants de restauration : la personne avait le droit d’ouvrir la vitrine.'}
  ],
  liensRequis:3,
  analyses:{
    empreinte:{type:'empreinte',q:'Compare l’empreinte trouvée sur la vitre avec les empreintes des quatre personnes du musée.',suspects:[['M. Kabeya',1],['Mme Nzuzi',2],['M. Tshimanga',3],['Mme Lunda',4]],bon:3,sujet:7,exp:'L’empreinte de la vitre correspond à celle de Mme Lunda : elle a touché la vitrine. Cela prouve qu’elle l’a ouverte, pas qu’elle a volé : il faut comprendre pourquoi !'},
    poudre:{type:'qcm',q:'Quel test permet de reconnaître cette poudre blanche ?',choix:['La mettre dans l’eau : elle se dissout sans former de pâte, c’est une poudre de nettoyage','La goûter','La jeter','La respirer de près'],bonne:0,exp:'Les scientifiques testent une poudre avec de l’eau : cette poudre est une poudre de nettoyage pour objets de bois, comme celle des restaurateurs. On ne goûte jamais une substance inconnue !'}
  },
  questions:[
    {q:'Où se trouve le Masque Kuba ?',c:['Dans l’atelier de restauration','Dans la salle des arts','Il a quitté le musée','Dans la réserve du gardien'],a:0,exp:'Le masque est sur la table de l’atelier de restauration.',aide:'Suis la poudre blanche : où mène-t-elle ?'},
    {q:'Qui a déplacé le masque ?',c:['M. Kabeya, le gardien','Mme Nzuzi, la guide','M. Tshimanga, le visiteur','Mme Lunda, la restauratrice'],a:3,exp:'Son empreinte, ses gants et la poudre le prouvent.',aide:'Regarde le résultat de l’analyse de l’empreinte.'},
    {q:'Pourquoi l’a-t-elle fait ?',c:['Pour le voler','Pour le nettoyer avant l’exposition, sans prévenir','Pour le cacher au gardien','Pour le vendre'],a:1,exp:'C’était un nettoyage prévu dans son carnet, mais elle a oublié d’en informer le gardien : c’est un malentendu, pas un vol.',aide:'Que dit le carnet de restauration ?'},
    {q:'Quel témoin a donné une information fausse ?',c:['M. Kabeya : il dit ne pas avoir quitté l’entrée','Mme Nzuzi','M. Tshimanga','Aucun'],a:0,exp:'Le registre montre que le gardien a quitté l’entrée entre 16h50 et 17h00.',aide:'Compare le registre avec ce que dit chaque témoin.'}
  ],
  conclusion:'Mme Lunda a emporté le masque pour le nettoyer avant l’exposition, sans prévenir le gardien. Celui-ci a fait une ronde mais a menti sur ce point. Il n’y a pas eu de vol : une mauvaise communication a créé le mystère. Bravo, détective !'
};

// ---------- ENQUÊTE 2 : LE MYSTÈRE DE L'ÉCOLE ----------
export const ECOLE={
  id:'ecole',titre:'Le mystère de l’école',ico:'🏫',lieu:'École primaire',
  intro:'Lundi matin, des cahiers, des crayons et des ardoises ont disparu de deux classes ! L’école est inquiète. Visite les salles, examine les endroits suspects, interroge élèves et adultes, compare leurs récits et reconstitue ce qui s’est passé. Aucun danger : c’est un mystère de logique.',
  start:{x:-11,z:6},
  sols:[S(-13,-1,-4,8,'#e8d9a8','Cour'),S(-4,-1,3,8,'#f2e6c9','Classe de CE1'),S(3,-1,13,8,'#e6efd9','Classe de CM1'),S(-13,-8,-4,-1,'#d8c6a6','Bureau de la directrice'),S(-4,-8,13,-1,'#c8c0b0','Couloir et magasin')],
  murs:[MU(-13,-8,13,-8),MU(-13,8,13,8),MU(-13,-8,-13,8),MU(13,-8,13,8),MU(-4,-8,-4,8,[[2.5,2.4],[-4.5,.01]].slice(0,1)),MU(3,-1,3,8,[[3.5,2.4]]),MU(-13,-1,13,-1,[[-8,2.4],[-1,2.4],[5,2.4]]),MU(7,-8,7,-1,[[-4.5,1.8]])],
  objets:[
    B('banc_c','Banc de la cour',-9,6,2.4,.8,.5,'#8a5a2b'),
    B('arbre_c','Manguier',-6,3.5,1,1,2.4,'#2f7d3a',{ex:'Un grand manguier dans la cour.'}),
    B('tableau_n','Tableau noir du CE1',-0.5,-0.7,3,.2,1.4,'#1f3a2a',{plaque:true,ex:'Au tableau : « Lundi — inventaire du matériel ». Il manque la liste.',bloque:false}),
    B('table_e1','Tables du CE1',-1,3.5,4,1.4,.7,'#a0794a'),
    B('etagere_e','Étagère du CE1 (vide)',-3,6.8,.6,2.6,1.4,'#6b4423',{indice:'etagere',label:'📚 Étagère vide',ex:'L’étagère où l’on range les ardoises est vide. Le sol est propre devant : on n’a rien arraché.',bloque:true}),
    B('flaque','Tache d’humidité',-0.5,5,1.6,1.6,.02,'#6a8fa8',{bloque:false,indice:'fuite',label:'💧 Tache d’humidité au plafond',ex:'Une grosse tache d’humidité au plafond et une flaque au sol : le toit fuit au-dessus de l’étagère !',}),
    B('roues','Traces de roues',1.5,1.2,2.6,.5,.02,'#7a7a7a',{bloque:false,indice:'roues',cache:true,label:'🛒 Traces de roues',ex:'Deux traces de roues parallèles : un petit chariot est passé de la classe vers le couloir.'}),
    B('table_e2','Tables du CM1',8,3.5,4,1.4,.7,'#a0794a'),
    B('crayon','Crayon cassé',6,5.8,.3,.1,.05,'#e0c05a',{bloque:false,indice:'crayon',label:'✏️ Crayon cassé',ex:'Un crayon cassé et un taille-crayon appartenant à Junior : ce n’est pas la preuve d’un vol, juste un élève distrait.'}),
    B('liste','Liste d’inventaire',8,6.6,.5,.4,.75,'#f5f0e0',{bloque:false,indice:'liste',cache:true,label:'📋 Liste d’inventaire',ex:'« Lundi : déplacer le matériel au magasin sec à cause de la fuite — M. Mutombo ». Le papier a été oublié sous un cahier.'}),
    B('bureau_d','Bureau de la directrice',-8,-5.5,3,1.2,.9,'#7a4a26'),
    B('registre_p','Cahier de présence du personnel',-8,-5.8,.6,.4,.95,'#c0392b',{bloque:false,indice:'presence',label:'📕 Cahier de présence',ex:'Le cahier de présence : lundi, M. Mutombo est noté « présent de 6h à 14h ».'}),
    B('porte_mag','Porte du magasin',7,-4.5,.25,1.8,2.2,'#6b4423',{ferme:'clef_m',label:'🔒 Porte du magasin',bloque:false}),
    B('clef_m','Clé du magasin',-9.6,-6.5,.3,.2,.5,'#e0c05a',{bloque:false,indice:'clef_m',cache:true,label:'🗝 Clé du magasin',ex:'Une clé étiquetée « Magasin » accrochée derrière la porte du bureau.'}),
    B('boue','Traces de pas boueux',0,-2.7,3,.8,.02,'#6b4423',{bloque:false,indice:'pas',cache:true,label:'👣 Traces de pas boueux',ex:'Des traces de pas dans le couloir : une grande chaussure (taille 44) menant au magasin.',}),
    B('rayon','Rayons du magasin',11,-5,2.4,3.4,1.6,'#6b4423'),
    B('fournitures','Les fournitures disparues',10.6,-5,.6,.5,1.7,'#e8a23a',{bloque:false,cible:true,label:'📦 Les fournitures !',ex:'Cahiers, crayons et ardoises sont rangés au sec dans le magasin, bien en ordre.'})
  ],
  pnj:[
    PNJ('mbuyi','Mme Mbuyi','Directrice',-9.5,-3.2,Math.PI,{s:'f',skin:2,hair:'chignon',outfit:'robe',c:'#7d3fd1',acc:['lunettes']},{dial:'mbuyi'}),
    PNJ('kasongo','Mme Kasongo','Enseignante CE1',-2,1.8,Math.PI,{s:'f',skin:4,hair:'tresses',outfit:'pagne',c:'#d35400'},{dial:'kasongo'}),
    PNJ('banza','M. Banza','Enseignant CM1',9,1.6,Math.PI,{s:'h',skin:3,hair:'courtes',outfit:'polo',c:'#1f4e79'},{dial:'banza'}),
    PNJ('junior','Junior','Élève',-7,5,Math.PI*.2,{s:'h',skin:3,hair:'courtes',outfit:'uniforme',c:'#2c7fb8',h:.8},{dial:'junior'}),
    PNJ('grace','Grâce','Élève',-6,7,Math.PI*.7,{s:'f',skin:5,hair:'tresses',outfit:'uniforme',c:'#2e9e4a',h:.8},{dial:'grace'}),
    PNJ('mutombo','M. Mutombo','Concierge',4,-3.2,Math.PI*.5,{s:'h',skin:1,hair:'courtes',outfit:'sport',c:'#555'},{dial:'mutombo'})
  ],
  sorties:[{id:'sortie',x:-12.2,z:7,r:1.6,label:'🚪 Quitter l’école'}],
  indices:{
    etagere:{nom:'Étagère vide et propre',ico:'📚',txt:'Rien n’a été arraché : le matériel a été retiré calmement.'},
    fuite:{nom:'Fuite du toit',ico:'💧',txt:'Le toit fuit au-dessus de l’étagère du CE1 : le matériel risquait d’être mouillé.'},
    roues:{nom:'Traces de roues',ico:'🛒',txt:'Un chariot a transporté quelque chose de la classe vers le couloir.'},
    crayon:{nom:'Crayon cassé (Junior)',ico:'✏️',txt:'Un crayon cassé appartenant à Junior : c’est une fausse piste.'},
    liste:{nom:'Liste d’inventaire',ico:'📋',txt:'« Lundi : déplacer le matériel au magasin sec à cause de la fuite — M. Mutombo ».'},
    presence:{nom:'Cahier de présence',ico:'📕',txt:'Lundi, M. Mutombo est noté présent de 6h à 14h.'},
    clef_m:{nom:'Clé du magasin',ico:'🗝',txt:'Permet d’ouvrir la porte du magasin.'},
    pas:{nom:'Traces de pas boueux',ico:'👣',txt:'Pas de grande chaussure (taille 44) du couloir vers le magasin.',analyse:'pas'}
  },
  dialogues:{
    mbuyi:{nom:'Mme Mbuyi, directrice',n0:{t:'Quelle matinée ! Les cahiers, crayons et ardoises ont disparu de deux classes. Aidez-nous, petit détective.',c:[['Quand avez-vous remarqué la disparition ?','n1'],['Qui a les clés du magasin ?','n2'],['Merci.',null]]},
      n1:{t:'Lundi matin à 8h. La veille, tout était rangé. Je n’ai rien vu de brutal : pas de cadenas forcé.',temo:{id:'t_mb',txt:'La directrice a découvert la disparition lundi à 8h : rien n’a été forcé.'},c:[['Merci.','n0']]},
      n2:{t:'La clé du magasin est accrochée derrière la porte de mon bureau, et le concierge en a un double.',c:[['Merci.','n0']]}},
    kasongo:{nom:'Mme Kasongo, enseignante',n0:{t:'Mon étagère est vide ! Heureusement mes élèves n’y sont pour rien… je crois.',c:[['Que s’est-il passé dans votre classe ?','n1'],['Avez-vous remarqué la fuite du toit ?','n2'],['Merci.',null]]},
      n1:{t:'Vendredi soir tout était à sa place. Lundi matin, l’étagère était vide, sans désordre.',temo:{id:'t_ka',txt:'Mme Kasongo : vendredi tout était en place, lundi l’étagère était vide sans désordre.'},c:[['Merci.','n0']]},
      n2:{t:'Oui ! Il a plu fort ce week-end et ça goutte au-dessus de l’étagère. J’avais prévenu la direction.',temo:{id:'t_ka2',txt:'Mme Kasongo avait signalé la fuite du toit au-dessus de l’étagère.'},c:[['Merci, c’est important.','n0']]}},
    banza:{nom:'M. Banza, enseignant',n0:{t:'Chez moi aussi des crayons ont disparu ! Mais je suis sûr que c’est Junior, il perd toujours ses affaires.',c:[['Pourquoi dites-vous cela ?','n1'],['Merci.',null]]},
      n1:{t:'Il a toujours un crayon cassé en main ! Mais bon… je n’ai aucune preuve.',temo:{id:'t_ba',txt:'M. Banza soupçonne Junior sans aucune preuve.'},c:[['Merci.','n0']]}},
    junior:{nom:'Junior, élève',n0:{t:'Ce n’est pas moi ! J’ai juste cassé mon crayon. Mais lundi à 7h j’ai vu M. Mutombo pousser un chariot dans le couloir.',temo:{id:'t_ju',txt:'Junior a vu M. Mutombo pousser un chariot dans le couloir lundi à 7h.'},c:[['Merci, Junior.','n1'],['Tu es sûr ?','n2']]},
      n1:{t:'Je peux rester ici si vous voulez me poser d’autres questions !',c:[['Merci.',null]]},n2:{t:'Oui, il avait des cartons dessus. Il m’a dit bonjour !',c:[['Merci.',null]]}},
    grace:{nom:'Grâce, élève',n0:{t:'Vendredi, la maîtresse a dit que le toit fuyait et qu’il fallait protéger les cahiers de l’eau.',temo:{id:'t_gr',txt:'Grâce : vendredi, on a dit qu’il fallait protéger les cahiers de l’eau.'},c:[['Merci Grâce.',null]]}},
    mutombo:{nom:'M. Mutombo, concierge',n0:{t:'Bonjour. Moi je ne sais rien de cette histoire : lundi je ne travaillais pas, j’étais en congé toute la journée.',temo:{id:'t_mu',txt:'M. Mutombo affirme avoir été en congé lundi toute la journée.'},c:[['Vous êtes sûr de votre emploi du temps ?','n1'],['Avez-vous un double des clés ?','n2'],['Merci.',null]]},
      n1:{t:'Bien sûr ! Enfin… je crois. Regardez le cahier de présence si vous voulez.',c:[['Merci.','n0']]},
      n2:{t:'Oui, comme tous les concierges. Mais je ne l’ai pas utilisé.',temo:{id:'t_mu2',txt:'M. Mutombo possède un double des clés mais dit ne pas l’avoir utilisé.'},c:[['Merci.','n0']]}}
  },
  liens:[
    {a:'presence',b:'t_mu',txt:'Le cahier de présence montre que M. Mutombo travaillait lundi de 6h à 14h : il s’est trompé ou ment.'},
    {a:'roues',b:'t_ju',txt:'Les traces de roues confirment ce que Junior a vu : le chariot de M. Mutombo.'},
    {a:'fuite',b:'t_ka2',txt:'La fuite du toit confirme l’inquiétude de Mme Kasongo : le matériel risquait d’être mouillé.'},
    {a:'liste',b:'fuite',txt:'La liste explique pourquoi : on devait déplacer le matériel au magasin sec à cause de la fuite.'},
    {a:'crayon',b:'t_ba',txt:'Un crayon cassé ne prouve rien : M. Banza accuse sans preuve. Ce n’est pas la bonne piste.',faux:true}
  ],
  liensRequis:3,
  analyses:{
    pas:{type:'qcm',q:'Les traces de pas mesurent environ 29 cm de long (pointure 44). Que peux-tu en déduire ?',choix:['Elles sont d’un adulte aux grands pieds, pas d’un élève','Elles sont d’un enfant de 8 ans','Elles sont d’un animal','On ne peut rien déduire'],bonne:0,exp:'Une longueur de 29 cm correspond à un adulte : un élève de CE1 a des pieds d’environ 20 cm. C’est un indice, pas encore une preuve : il faut le comparer avec d’autres éléments.'}
  },
  questions:[
    {q:'Où sont les fournitures ?',c:['Au magasin sec','Volées et sorties de l’école','Dans la classe de CM1','Dans la cour'],a:0,exp:'Elles sont au magasin, au sec, protégées de la fuite.',aide:'Suivez les traces de roues et de pas.'},
    {q:'Qui les a déplacées ?',c:['Junior, l’élève','M. Banza, l’enseignant','M. Mutombo, le concierge','Mme Mbuyi, la directrice'],a:2,exp:'La liste, les traces de roues et le témoignage de Junior le désignent.',aide:'Qui a vu un chariot ? Qui avait la liste signée ?'},
    {q:'Pourquoi ?',c:['Pour les voler','Pour punir les élèves','Pour les protéger de la fuite du toit, mais sans prévenir','Pour les vendre'],a:2,exp:'Il a voulu protéger le matériel de l’eau et a oublié de prévenir.',aide:'Que dit la liste d’inventaire ?'},
    {q:'Qui a donné une information inexacte ?',c:['M. Mutombo : il dit avoir été en congé lundi','Junior','Mme Kasongo','Grâce'],a:0,exp:'Le cahier de présence prouve qu’il travaillait lundi de 6h à 14h.',aide:'Compare le cahier de présence avec le témoignage du concierge.'}
  ],
  conclusion:'M. Mutombo a déplacé le matériel au magasin sec pour le protéger de la fuite du toit, mais il a oublié de prévenir tout le monde. En racontant avoir été en congé, il s’est trompé. Junior n’y est pour rien : un crayon cassé n’est pas une preuve. Beau travail, détective !'
};

export const CAS={musee:MUSEE,ecole:ECOLE};

// ---------- cours du détective (bibliothèque documentaire) ----------
export const COURS=[
  {t:'Qu’est-ce qu’un indice ?',txt:'Un indice est un petit élément qui met sur la piste : une trace de pas, une poudre, un objet oublié. Un indice seul ne prouve rien, mais plusieurs indices qui concordent deviennent une preuve.',ico:'🔍'},
  {t:'Qu’est-ce qu’une preuve ?',txt:'Une preuve est un élément solide qui montre que quelque chose est vrai : une empreinte comparée au laboratoire, un registre écrit, une photo. Une preuve se vérifie.',ico:'📌'},
  {t:'Qu’est-ce qu’un témoignage ?',txt:'Un témoignage est ce qu’une personne dit avoir vu ou fait. Il peut être juste, incomplet ou faux. Un bon détective compare les témoignages entre eux et avec les preuves.',ico:'🗣'},
  {t:'Qu’est-ce qu’une hypothèse ?',txt:'Une hypothèse est une explication possible qu’on propose avant d’être sûr. On la teste avec les indices : si un indice la contredit, on la change. Exemple : « Peut-être que le masque a été déplacé pour être nettoyé. »',ico:'💡'},
  {t:'Qu’est-ce qu’une conclusion ?',txt:'La conclusion est la réponse finale de l’enquête, appuyée sur des preuves : qui, quoi, où, pourquoi. Un détective explique toujours comment il est arrivé à sa conclusion.',ico:'✅'},
  {t:'Les empreintes digitales',txt:'Chaque personne a des empreintes différentes, avec des dessins en boucles, en spirales ou en arcs. On les compare à la loupe en cherchant des détails communs.',ico:'🖐'},
  {t:'Observer, déduire, vérifier',txt:'Observer : regarder avec attention. Déduire : en tirer une conséquence logique. Vérifier : s’assurer avec une preuve. Ces trois gestes résolvent presque toutes les enquêtes.',ico:'🧠'}
];
// ---------- dialogues de l'agence ----------
export const DIAL_AGENCE={
  leo:{nom:'Inspecteur Léo',n0:{t:'Salut, détective ! Je suis l’inspecteur Léo, ton assistant. Utilise l’ordinateur ou la carte pour choisir une affaire, la bibliothèque pour apprendre, et le laboratoire pour analyser tes indices.',c:[['Comment mener une enquête ?','n1'],['À quoi sert le tableau ?','n2'],['Merci Léo.',null]]},
    n1:{t:'Trois gestes : OBSERVER (examine les lieux), INTERROGER (écoute les témoins) et COMPARER (relie les indices et les témoignages). À la fin, tu proposeras ta solution.',c:[['Merci.','n0']]},
    n2:{t:'Le tableau d’investigation te permet de relier une preuve à un témoignage : si les deux se contredisent ou se confirment, tu le découvres !',c:[['Merci.','n0']]}},
  mado:{nom:'Inspectrice Mado',n0:{t:'Bienvenue à l’agence, petit détective. Deux affaires t’attendent : le musée et l’école. Résous-les et tu obtiendras ton certificat de détective débutant.',c:[['Que dois-je savoir ?','n1'],['Merci, cheffe.',null]]},
    n1:{t:'Ne devine jamais : cherche des preuves. Et si tu te trompes, c’est normal : on apprend, on recommence.',c:[['Merci.','n0']]}}
};
