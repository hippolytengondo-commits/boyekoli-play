// Données du BOYEKOLI SMART CITY : types de bâtiments, effets, missions de maire.
export const N=12;                       // grille N×N
export const TYPES={
 route:{nom:'Route',ico:'🛣',cout:20,ent:0,col:'#3b3c40',h:.05,cat:'Réseaux'},
 bus:{nom:'Arrêt de bus',ico:'🚌',cout:200,ent:2,col:'#2c7fb8',h:1.3,cat:'Réseaux',trans:1},
 maison:{nom:'Maisons',ico:'🏠',cout:150,ent:1,col:'#d9a54a',h:1.4,cat:'Habitat',loge:6,elec:-1,eau:-1},
 immeuble:{nom:'Immeuble',ico:'🏢',cout:400,ent:3,col:'#8e9aaf',h:4.5,cat:'Habitat',loge:22,elec:-3,eau:-3},
 commerce:{nom:'Marché et commerces',ico:'🏪',cout:250,ent:2,col:'#e07a5f',h:1.8,cat:'Économie',emplois:8,elec:-2,eau:-1,taxe:6},
 usine:{nom:'Usine',ico:'🏭',cout:500,ent:5,col:'#6d6d78',h:2.6,cat:'Économie',emplois:25,elec:-5,eau:-3,poll:8,taxe:10},
 centrale:{nom:'Centrale électrique',ico:'⚡',cout:600,ent:6,col:'#7a5a3a',h:3,cat:'Énergie et eau',elec:25,poll:10,emplois:4},
 solaire:{nom:'Panneaux solaires',ico:'☀️',cout:350,ent:1,col:'#1b3a6b',h:.6,cat:'Énergie et eau',elec:8},
 chateau:{nom:'Château d’eau',ico:'💧',cout:300,ent:2,col:'#3fa9d9',h:3.6,cat:'Énergie et eau',eau:20},
 ecole:{nom:'École',ico:'🏫',cout:300,ent:3,col:'#c0392b',h:2,cat:'Services',edu:1,emplois:4,elec:-1},
 hopital:{nom:'Hôpital',ico:'🏥',cout:500,ent:5,col:'#f2f2f2',h:2.8,cat:'Services',sante:1,emplois:6,elec:-2,eau:-2},
 police:{nom:'Poste de police',ico:'🚓',cout:300,ent:3,col:'#2b3f6b',h:1.8,cat:'Services',secu:1,emplois:3,elec:-1},
 parc:{nom:'Parc et arbres',ico:'🌳',cout:120,ent:1,col:'#4f9c3c',h:.4,cat:'Écologie',poll:-3,joie:1}};
export const CATS=['Réseaux','Habitat','Économie','Énergie et eau','Services','Écologie'];
export const MISSIONS=[
 {id:'v1',nom:'Les premiers habitants',txt:'Atteins 20 habitants.',ok:s=>s.pop>=20,pieces:6},
 {id:'v2',nom:'De l’eau pour tous',txt:'Construis un château d’eau et atteins 30 habitants sans manquer d’eau.',ok:s=>s.nb.chateau>=1&&s.pop>=30&&s.eauOk>=1,pieces:6},
 {id:'v3',nom:'La lumière',txt:'Produis assez d’électricité pour 40 habitants.',ok:s=>s.pop>=40&&s.elecOk>=1,pieces:6},
 {id:'v4',nom:'L’école',txt:'Ouvre une école et couvre au moins 60 % des enfants.',ok:s=>s.nb.ecole>=1&&s.eduCouv>=.6,pieces:6},
 {id:'v5',nom:'La santé',txt:'Construis un hôpital pour au moins 30 habitants.',ok:s=>s.nb.hopital>=1&&s.pop>=30,pieces:6},
 {id:'v6',nom:'La circulation',txt:'Aie 15 routes, un arrêt de bus et une circulation fluide.',ok:s=>s.nb.route>=15&&s.nb.bus>=1&&s.circOk>=.9,pieces:8},
 {id:'v7',nom:'La ville verte',txt:'4 parcs, 2 panneaux solaires et une pollution faible.',ok:s=>s.nb.parc>=4&&s.nb.solaire>=2&&s.poll<=30,pieces:8},
 {id:'v8',nom:'La sécurité',txt:'Deux postes de police et une sécurité d’au moins 60 %.',ok:s=>s.nb.police>=2&&s.secu>=.6,pieces:8},
 {id:'v9',nom:'Une ville heureuse',txt:'100 habitants et une satisfaction d’au moins 70 %.',ok:s=>s.pop>=100&&s.sat>=70,pieces:10},
 {id:'v10',nom:'Maire de la grande ville',txt:'200 habitants, satisfaction 75 %, budget de 3 000 et tous les services.',ok:s=>s.pop>=200&&s.sat>=75&&s.budget>=3000&&s.nb.ecole>=1&&s.nb.hopital>=1&&s.nb.police>=1&&s.nb.chateau>=1,pieces:15}];
export const NOTIONS=[
 ['🛣 Routes','Sans route, un bâtiment n’est pas relié à la ville. Une route large et des bus évitent les embouteillages.'],
 ['⚡ Énergie','Une centrale donne beaucoup d’électricité mais pollue. Le soleil est gratuit et propre : les panneaux solaires protègent le climat.'],
 ['💧 Eau','Chaque habitant a besoin d’eau potable. Le château d’eau stocke et distribue l’eau.'],
 ['🌳 Écologie','Les arbres filtrent l’air, donnent de l’ombre et rendent les habitants plus heureux.'],
 ['💰 Budget','Les taxes et les commerces rapportent de l’argent. Les bâtiments coûtent de l’entretien : un bon maire équilibre ses dépenses.'],
 ['🏘 Quartiers','On place les écoles, l’hôpital et la police au milieu des habitations pour que tous y accèdent facilement.']];
