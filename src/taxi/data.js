// BOYEKOLI TAXI : contenu du jeu (missions, dialogues d'éthique professionnelle). Les repères sont de vrais lieux de Kinshasa
// (carte © contributeurs OpenStreetMap, licence ODbL). Les montants sont des FC de simulation.
export const VEHICULES={
  moto:{nom:'Taxi-moto',ico:'🏍',vmax:34,acc:24,frein:40,larg:.9,degats:2.2,places:1,
    desc:'Rapide et agile dans les embouteillages, mais fragile : un choc fait très mal. Un seul passager, casque obligatoire.'},
  taxi:{nom:'Taxi-voiture',ico:'🚕',vmax:28,acc:15,frein:34,larg:1.6,degats:1,places:3,
    desc:'Le taxi classique : tu prends un client, tu conviens du prix, tu le déposes à destination.'},
  bus:{nom:'Minibus « esprit de mort »',ico:'🚌',vmax:22,acc:9,frein:26,larg:2,degats:.8,places:12,
    desc:'Une ligne avec plusieurs arrêts, des passagers qui montent et descendent, la monnaie à rendre. Lourd à conduire.'}};

// missions : mode, départ/arrivée (noms de lieux réels de la carte), prix convenu AVANT de partir, événements
export const MISSIONS=[
  {id:'m1',mode:'moto',titre:'Course express en moto-taxi',client:'Papa Jean',voix:'mavungu',de:'Place du Marché Central',a:'Place de la République',prix:3000,ev:['tentation','supplement','police'],
   intro:'Papa Jean est pressé : il doit déposer un document à la Place de la République. Vous avez convenu ensemble de 3 000 FC, course directe.'},
  {id:'m2',mode:'moto',titre:'La course sous la pluie',client:'Maman Rose',voix:'bea',de:'Rond-Point Ngaba',a:'Rond-point Moulaert',prix:3500,ev:['pluie','tentation','supplement'],
   intro:'Maman Rose doit aller au Rond-point Moulaert. Il pleut : les routes sont glissantes et les nids-de-poule se cachent sous l’eau. Prix convenu : 3 500 FC.'},
  {id:'t1',mode:'taxi',titre:'De l’aéroport vers la ville',client:'Monsieur Kabongo',voix:'mavungu',de:'Aéroport de N’djili',a:'Place de la Gare',prix:15000,ev:['police','tentation','monnaie'],
   intro:'M. Kabongo arrive d’un long voyage. Il veut rejoindre la Place de la Gare par le boulevard Lumumba, avec ses valises. Prix convenu : 15 000 FC. Attention aux embouteillages et aux passerelles !'},
  {id:'t2',mode:'taxi',titre:'Le client pressé du pont N’djili',client:'Mademoiselle Aimée',voix:'ilunga',de:'Pont N’djili',a:'Rond-Point Ngaba',prix:8000,ev:['tentation','police','supplement'],
   intro:'Mlle Aimée va au Rond-Point Ngaba pour un examen. Elle a payé la course d’avance : 8 000 FC. Respecte ton engagement et arrive à l’heure.'},
  {id:'b1',mode:'bus',titre:'La ligne du minibus',client:'Les passagers',voix:'junior',de:'Place Commerciale',a:'Place du Marché Central',arrets:['Rond-point Moulaert'],prix:1500,ev:['surcharge','monnaie','police'],
   intro:'Tu conduis un minibus sur une ligne : Place Commerciale → Rond-point Moulaert → Place du Marché Central. Chaque passager paie 1 500 FC. Ne dépasse jamais le nombre de places !'},
  {id:'b2',mode:'bus',titre:'Du Rond-Point Ngaba à l’aéroport',client:'Les passagers',voix:'bea',de:'Rond-Point Ngaba',a:'Aéroport de N’djili',arrets:['Pont Matete'],prix:2000,ev:['surcharge','monnaie','tentation'],
   intro:'Longue ligne le long du boulevard Lumumba, avec arrêt au Pont Matete. Chaque passager paie 2 000 FC. Respecte les arrêts et les horaires annoncés.'}];

// lieux ajoutés à la main (non présents sous forme de rond-point nommé dans la carte) ; à vérifier avec les Kinois
export const LIEUX_EXTRA=[{n:'Aéroport de N’djili',t:'aero',lon:15.4446,lat:-4.3858}];

// événements : question de comportement professionnel ; ok=true : bon choix
export const EVENEMENTS={
  tentation:{titre:'Une offre alléchante',ico:'💰',
    q:'En route, un autre client te fait signe et te propose le DOUBLE du prix si tu le prends tout de suite. Mais ton client a déjà payé et vous avez convenu d’une course directe.',
    choix:[['Je continue ma course : j’ai donné ma parole',true,'Bravo ! Respecter un contrat, c’est respecter la personne. Ton client te fera confiance et parlera de toi en bien. 🌟'],
           ['Je dépose mon client au bord de la route et je prends l’autre',false,'Mauvais choix : tu abandonnes un client qui t’avait fait confiance. Sa course est perdue et ta réputation baisse.'],
           ['Je prends les deux et je fais des détours',false,'Mauvais choix : tu fais perdre du temps à ton client et tu mets tout le monde en danger. Un contrat se respecte en entier.']]},
  supplement:{titre:'Le prix a-t-il changé ?',ico:'🧾',
    q:'Tu arrives à destination. La route était bloquée et la course a pris plus de temps que prévu. Ton client attend de payer le prix convenu au départ.',
    choix:[['Je réclame un supplément « parce que c’était long »',false,'Un prix convenu avant le départ ne change pas à l’arrivée. Si un imprévu arrive, on en parle AVANT, pas après. Réputation en baisse.'],
           ['J’encaisse le prix convenu, comme promis',true,'Très bien ! Le prix annoncé est le prix payé. Les clients reviennent chez les chauffeurs fiables.'],
           ['Je prétexte une panne pour être payé deux fois',false,'C’est de la tromperie. Un chauffeur honnête ne ment jamais à son client.']]},
  police:{titre:'Contrôle routier',ico:'🚓',
    q:'Un policier te fait signe de t’arrêter pour un contrôle de documents. Tes papiers sont en règle. Il faut garder son calme : la loi s’applique à tous.',
    choix:[['Je m’arrête, je salue poliment et je présente mes papiers',true,'Excellent ! Un contrôle se passe dans le calme, avec les papiers en règle. En cas d’amende, elle se paie officiellement et on reçoit un reçu.'],
           ['Je tends un billet pour passer plus vite',false,'Interdit ! Donner de l’argent à un agent est de la corruption : c’est puni par la loi et cela abîme la confiance dans le pays. Réputation en baisse.'],
           ['Je fais semblant de ne pas voir et j’accélère',false,'Refuser de s’arrêter est une faute grave et dangereuse. Il faut toujours obéir aux agents de la circulation.']]},
  surcharge:{titre:'Le minibus est plein',ico:'🚌',
    q:'Ton minibus a déjà toutes ses places occupées. D’autres personnes veulent monter et te proposent de payer un peu plus pour entrer debout, sur le marchepied.',
    choix:[['Je refuse : je ne dépasse pas le nombre de places',true,'Bien joué ! La surcharge est dangereuse : au moindre freinage, des passagers peuvent tomber. La sécurité d’abord.'],
           ['J’accepte : plus de passagers, plus d’argent',false,'Mauvais choix : la surcharge met des vies en danger et le contrat avec les passagers, c’est de les transporter en sécurité.'],
           ['J’accepte seulement les enfants',false,'Les enfants ont droit, eux aussi, à une place sûre. Ne dépasse jamais la capacité du véhicule.']]},
  pluie:{titre:'Il pleut !',ico:'🌧',
    q:'La pluie rend la chaussée glissante et cache les nids-de-poule. Ta cliente a peur. Que fais-tu ?',
    choix:[['Je ralentis, j’allume mes feux et je garde mes distances',true,'Parfait ! La prudence protège ton client et ton véhicule : sous la pluie, on réduit la vitesse.'],
           ['Je roule vite pour arriver avant l’orage',false,'Dangereux : sur route mouillée, la distance de freinage double.'],
           ['Je m’arrête au milieu de la route en attendant',false,'S’arrêter au milieu de la chaussée gêne et met en danger les autres.']]},
  monnaie:{titre:'La monnaie à rendre',ico:'🪙',
    calc:true}};

export const CONSEILS=['Les passerelles sont faites pour protéger les piétons : ne t’arrête jamais dessous pour charger un client.',
  'Un prix convenu AVANT le départ est un contrat : on ne le change pas en route.',
  'Respecter les feux, les agents et les priorités, c’est protéger tout le monde, toi compris.',
  'Un bon chauffeur est ponctuel, poli et honnête : les clients reviennent et parlent de lui.'];
