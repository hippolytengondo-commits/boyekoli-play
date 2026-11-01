// 50 missions croisées : chaque mission se joue À L'INTÉRIEUR d'un des jeux Boyekoli et mêle un territoire de la RDC (145),
// sa province, le programme scolaire (question de cours) et l'objectif de jeu. Génération déterministe à partir des données.
import {TERRITOIRES_LISTE as TERR} from '../territoires_gen.js';
import {CONTENU} from '../programme.js';

export const JEUX={sci:{nom:'Science Lab',ico:'🔬',open:'sciOuvrir',ov:'sciov',lieu:'le Science Lab'},med:{nom:'Medical Center',ico:'🏥',open:'medOuvrir',ov:'medov',lieu:'l’hôpital'},det:{nom:'Agence de détectives',ico:'🕵️',open:'detOuvrir',ov:'detov',lieu:'l’agence de détectives'},
 ds:{nom:'Design Studio',ico:'🏠',open:'dsOuvrir',ov:'dsov',lieu:'le Design Studio'},fs:{nom:'Fashion Studio',ico:'👗',open:'fsOuvrir',ov:'fsov',lieu:'le Fashion Studio'},vil:{nom:'Smart City',ico:'🌆',open:'vilOuvrir',ov:'vilov',lieu:'l’hôtel de ville'},
 sp:{nom:'Space Explorer',ico:'🚀',open:'spOuvrir',ov:'spov',lieu:'la Cité de l’espace'},mus:{nom:'Music Studio',ico:'🎶',open:'musOuvrir',ov:'musov',lieu:'le studio de musique'},vol:{nom:'Simulateur de vol',ico:'✈️',open:'simAeroport',ov:'',lieu:'l’aéroport'}};
export const CHAPITRES=[
 {nom:'Chapitre 1 · Du fleuve à la forêt',provs:['Kongo-Central','Kwango','Kwilu','Mai-Ndombe'],intro:'Mama Lola t’envoie vers l’Ouest : le Kongo-Central, le Kwango, le Kwilu et le Mai-Ndombe. Dans chaque territoire, un problème attend un jeune talent comme toi.'},
 {nom:'Chapitre 2 · Les terres du Kasaï',provs:['Kasaï','Kasaï-Central','Kasaï-Oriental','Lomami','Sankuru'],intro:'Cap sur le Centre ! Les Kasaï, le Lomami et le Sankuru ont besoin de tes talents : science, santé, enquêtes et construction.'},
 {nom:'Chapitre 3 · Les montagnes de l’Est',provs:['Maniema','Sud-Kivu','Nord-Kivu','Ituri'],intro:'Les montagnes, les lacs et les volcans de l’Est t’attendent. Les habitants comptent sur toi pour des missions variées.'},
 {nom:'Chapitre 4 · La forêt du Nord',provs:['Haut-Uele','Bas-Uele','Tshopo','Mongala','Nord-Ubangi','Sud-Ubangi','Équateur','Tshuapa'],intro:'Le grand Nord : fleuve, forêt équatoriale et villages. Chaque mission te fait mieux connaître ton pays.'},
 {nom:'Chapitre 5 · Les richesses du Katanga',provs:['Haut-Lomami','Lualaba','Haut-Katanga','Tanganyika'],intro:'Dernière étape : le Sud-Est, ses mines, ses lacs et ses villes. Réussis ces missions pour devenir un vrai héros du pays !'}];
const dePro=p=>/^(Tshopo|Tshuapa|Lomami|Mongala)$/.test(p)?'de la '+p:/^(Équateur|Ituri)$/.test(p)?'de l’'+p:'du '+p;
const arr=n=>Math.round(n/10)*10;
const fmt=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
// ----- objectifs : chaque fonction reçoit le territoire t et renvoie un objectif de jeu
const SCI=[['c1','Mélanger des couleurs','Les artisans de {T} veulent préparer des teintures pour leurs pagnes : apprends à mélanger les couleurs primaires.'],
 ['c2','Acide ou base ?','L’eau des puits de {T} doit être testée. Au laboratoire, reconnais les acides et les bases avec le chou rouge.'],
 ['c3','La réaction effervescente','Un élève de {T} a vu du bicarbonate faire mousser du vinaigre. Reproduis et explique la réaction.'],
 ['b1','Cellules végétale et animale','Le lycée de {T} prépare une journée d’observation au microscope : découvre les deux types de cellules.'],
 ['b2','La germination','Les cultivateurs de {T} veulent savoir pourquoi leurs graines germent : fais l’expérience.'],
 ['p1','Circuit électrique','Le centre de {T} vient d’être raccordé au courant : comprends le circuit et les conducteurs.'],
 ['p4','Miroirs et lumière','Un photographe de {T} utilise des miroirs pour éclairer ses portraits : étudie la lumière.']];
const MED=[['cas','fievre','Un enfant fiévreux','Au dispensaire de {T}, un enfant arrive avec de la fièvre et de la fatigue. Accueille ce patient fictif et mène la consultation.'],
 ['cas','rhume','Un rhume','La saison des pluies a commencé à {T} : un patient fictif vient pour un rhume. Prends-le en charge.'],
 ['cas','blessure','Une petite blessure','Un jeune footballeur de {T} s’est écorché le genou. Soigne-le correctement.'],
 ['cas','fatigue','Une grande fatigue','Une voyageuse arrivée à {T} se sent très fatiguée. Questionne-la et conseille-la.'],
 ['svc','labo','Le laboratoire','L’hôpital de {T} a besoin d’un laborantin : lis correctement les résultats d’analyses.'],
 ['svc','pharma','La pharmacie','La pharmacie de {T} a reçu de nouveaux médicaments : range-les au bon endroit.'],
 ['svc','urgences','Les urgences','Un camion s’est renversé près de {T} : trie les blessés par priorité aux urgences.']];
const DET=[['fini','d1','Le mystère du musée','Un objet précieux a disparu du musée de {T}. Mène l’enquête à l’agence de détectives.'],
 ['fini','d2','Le mystère de l’école','Des fournitures disparaissent de l’école de {T}. Retrouve le coupable.'],
 ['indice',null,'Chercher des indices','La police de {T} manque de preuves : trouve 3 indices pendant une enquête.',3],
 ['analyse',null,'Analyser un indice','Le laboratoire de {T} attend une analyse : examine et analyse un indice.',1],
 ['temoin',null,'Interroger les témoins','Les habitants de {T} ont vu quelque chose : interroge 2 témoins.',2]];
const FS=[['coudre',p=>p.modele==='scolaire'&&p.tissu==='coton','Une tenue scolaire','Les élèves de {T} ont besoin d’uniformes : couds une tenue scolaire en coton.'],
 ['coudre',p=>p.modele==='pagne'&&(p.tissu==='wax'||p.tissu==='bazin'),'Le pagne de {T}','Pour la fête de {T}, couds un pagne et sa blouse en wax ou en bazin.'],
 ['coudre',p=>['robeC','boubou','costume'].includes(p.modele)&&['bazin','soie','wax'].includes(p.tissu),'Une tenue de cérémonie','Un mariage a lieu à {T} : crée une robe de cérémonie, un boubou ou un costume.'],
 ['coudre',p=>p.modele==='sport'&&p.tissu==='coton','L’équipe de football','L’équipe de {T} joue la finale : couds une tenue sportive en coton.'],
 ['coiff',l=>l.coiff!=='courtes','La coiffure africaine','Le salon de {T} prépare un concours : valide une coiffure africaine (afro, tresses, locks, chignon…).'],
 ['defile',n=>n>=2,'Le défilé de {T}','Le grand défilé de {T} commence : présente 3 tenues et réussis au moins 2 poses.']];
const SP=[['mission','s1','Décollage','Le centre spatial de {T} veut lancer sa première fusée : réussis le décollage.'],
 ['mission','s2','Mise en orbite','Un satellite doit observer {T} : place ta fusée en orbite.'],
 ['mission','s5','Cap sur la Lune','Les élèves de {T} rêvent de la Lune : atteins la vitesse de transfert lunaire.'],
 ['mission','s6','Alunissage','Pose en douceur le module lunaire : toute la région de {T} regarde !'],
 ['mission','s7','Rover lunaire','Les écoles de {T} attendent des roches lunaires : conduis le rover.'],
 ['mission','s9','Un astéroïde','Un astéroïde passe au-dessus de {T} : pose-toi dessus avec ta sonde.'],
 ['mission','s10','La station spatiale','Depuis la station, on voit {T} : visite ses 5 modules.'],
 ['mission','s11','Voyage vers Saturne','L’observatoire de {T} prépare un voyage vers Saturne : réponds aux questions.']];
// ----- liste ordonnée : 10 missions par chapitre, jeux entrelacés
const ORDRE=[
 ['sci',0],['med',0],['ds',0],['vil',0],['sp',0],['fs',0],['det',0],['sci',1],['med',1],['mus',0],
 ['vil',1],['sci',2],['ds',1],['fs',1],['sp',1],['med',2],['det',1],['vil',2],['vol',0],['fs',2],
 ['sp',2],['sci',3],['med',3],['ds',2],['vil',3],['det',2],['fs',3],['sp',3],['sci',4],['mus',1],
 ['med',4],['vil',4],['ds',3],['sp',4],['fs',4],['det',3],['sci',5],['med',5],['vol',1],['sp',5],
 ['ds',4],['vil',5],['sci',6],['med',6],['fs',5],['det',4],['sp',6],['ds',5],['vil',6],['sp',7]];
const MATS={sci:['sc','sc'],med:['sc','ev'],det:['hg','fr'],ds:['ma','hg'],fs:['hg','ma'],vil:['ma','hg'],sp:['sc','hg'],mus:['hg','fr'],vol:['ma','hg']};
// territoires : on répartit par chapitre, en alternant les provinces
function territoires(){
  const par={};TERR.forEach(t=>{(par[t.prov]=par[t.prov]||[]).push(t)});const out=[];
  CHAPITRES.forEach((c,ci)=>{const used=[];for(let k=0;k<10;k++){const pv=c.provs[k%c.provs.length],L=par[pv]||[];if(!L.length)continue;let j=(Math.floor(k/c.provs.length)*3+ci*2+k)%L.length,g=0;while(used.includes(L[j])&&g++<L.length)j=(j+1)%L.length;used.push(L[j]);out.push(L[j])}});
  return out}
const cle=(mat)=>Object.keys(CONTENU).filter(k=>k.split('|')[1]===mat&&CONTENU[k]&&CONTENU[k].qs&&CONTENU[k].qs.length);
function coursQ(i,jeu){
  const m=MATS[jeu][i%2],ks=cle(m).length?cle(m):cle('sc'),k=ks[(i*7+3)%ks.length],e=CONTENU[k],q=e.qs[i%e.qs.length];
  const opts=(q.c||[]).slice();return {cle:k,q:q.q,c:opts,a:q.a,exp:q.exp||''}}
function terrQ(t,i){
  const o=TERR,pick=(f,n)=>{const r=[];let j=(i*13+5)%o.length,g=0;while(r.length<n&&g++<400){const v=f(o[j]);if(v&&v!==f(t)&&!r.includes(v))r.push(v);j=(j+11)%o.length}return r};
  const type=i%3;
  if(type===0){const c=pick(x=>x.prov,3).concat(t.prov).sort((a,b)=>(a.length*3+i)%7-(b.length*3+i)%7);return {q:'Dans quelle province se trouve le territoire de '+t.nom+' ?',c,a:t.prov,exp:t.nom+' est dans la province '+dePro(t.prov).replace(/^d(e la|e l’|u) /,'')+'.'}}
  if(type===1){const c=pick(x=>x.cl,3).concat(t.cl).sort((a,b)=>(a.length*3+i)%7-(b.length*3+i)%7);return {q:'Quel est le chef-lieu du territoire de '+t.nom+' ?',c,a:t.cl,exp:'Le chef-lieu du territoire de '+t.nom+' est '+t.cl+'.'}}
  const c=['Lingala','Kiswahili','Kikongo','Tshiluba'],nm={lingala:'Lingala',swahili:'Kiswahili',kikongo:'Kikongo',tshiluba:'Tshiluba'};const a=nm[t.lang]||null;
  if(a&&c.includes(a))return {q:'Quelle langue nationale parle-t-on surtout à '+t.nom+' ?',c,a,exp:'À '+t.nom+', on parle surtout le '+a+'.'};
  const c2=pick(x=>x.prov,3).concat(t.prov);return {q:'Dans quelle province se trouve '+t.nom+' ?',c:c2,a:t.prov,exp:t.nom+' est dans cette province.'}}
function spec(jeu,k,t,i){
  const P=(s)=>s.replace(/\{T\}/g,t.nom);
  if(jeu==='sci'){const e=SCI[k];return {ev:'sci.exp',pr:p=>p===e[0],titre:e[1],but:'Réalise l’expérience « '+e[1]+' » dans le Science Lab.',hist:P(e[2]),dur:'5 min'}}
  if(jeu==='med'){const e=MED[k];return {ev:'med.'+e[0],pr:p=>p===e[1],titre:e[2],but:e[0]==='cas'?'Termine la consultation du patient « '+e[2]+' » à l’hôpital.':'Réussis l’activité « '+e[2]+' » dans l’hôpital.',hist:P(e[3])}}
  if(jeu==='det'){const e=DET[k];return {ev:'det.'+e[0],pr:e[1]?p=>p===e[1]:null,n:e[4]||1,titre:e[2],but:e[1]?'Résous l’affaire dans l’agence de détectives.':e[0]==='indice'?'Trouve 3 indices pendant une enquête.':e[0]==='analyse'?'Analyse un indice dans le laboratoire de l’agence.':'Interroge 2 témoins pendant une enquête.',hist:P(e[3])}}
  if(jeu==='fs'){const e=FS[k];return {ev:'fs.'+e[0],pr:e[1],titre:e[2],but:k<4?'Couds la tenue demandée dans l’atelier de couture puis range-la dans ton portfolio.':k===4?'Compose et valide la coiffure dans le salon.':'Réussis le défilé : 2 poses parfaites.',hist:P(e[3])}}
  if(jeu==='sp'){const e=SP[k];return {ev:'sp.mission',pr:p=>p===e[1],titre:e[2],but:'Réussis la mission « '+e[2]+' » dans le Space Explorer.',hist:P(e[3])}}
  if(jeu==='mus'){return k===0?{ev:'mus.cours',titre:'Un cours de musique',but:'Réussis un cours du Music Studio.',hist:P('La fête de {T} approche : apprends un nouveau rythme avec le studio de musique.')}:{ev:'mus.jeu',titre:'Un jeu musical',but:'Termine un jeu musical dans le Music Studio.',hist:P('Les enfants de {T} organisent un concours de rythme : entraîne-toi au studio.')}}
  if(jeu==='vol'){return k===0?{ev:'vol.mission',titre:'Un vol d’entraînement',but:'Termine une mission de vol dans le simulateur de l’aéroport (après ton inscription).',hist:P('L’aéroport de {T} attend un courrier urgent : prends les commandes.')}:{ev:'vol.mission',n:2,titre:'Deux vols réussis',but:'Termine 2 missions de vol dans le simulateur.',hist:P('Une livraison médicale doit rejoindre {T} par avion : enchaîne deux vols réussis.')}}
  if(jeu==='ds'){
    const N=3+(t.chef%4),sc=Math.max(30,Math.min(60,arr(18+Math.sqrt(t.pop)/40)));
    const L=[
     {ev:'ds.etat',pr:s=>s.surf>=30&&s.portes>=1&&s.fen>=2&&s.toit!=='plat',titre:'Un abri sûr',but:'Dessine une maison de 30 m² ou plus avec une porte, 2 fenêtres et un toit à pentes.',hist:P('Après les pluies, {T} a besoin d’abris solides : dessine une maison simple.')},
     {ev:'ds.etat',pr:s=>s.nb>=2&&(s.m.lit||0)+(s.m.litS||0)>=Math.ceil(N/2),titre:'Une maison pour '+N+' personnes',but:'Conçois une maison de 2 pièces ou plus avec au moins '+Math.ceil(N/2)+' lit(s) pour une famille de '+N+' personnes.',hist:P('Une famille de '+N+' personnes arrive à {T} : aménage-lui une maison avec assez de couchages.')},
     {ev:'ds.etat',pr:s=>s.tm==='wax'||s.cm==='#c9733d'||s.cm==='#b5835a',titre:'Le style local',but:'Décore les murs avec le motif wax ou une couleur de terre (ocre ou terre cuite).',hist:P('Les habitants de {T} veulent une maison qui ressemble à leur région : choisis un style local.')},
     {ev:'ds.etat',pr:s=>s.fen>=4&&s.jardin&&((s.m.arbre||0)+(s.m.palmier||0))>=2,titre:'La maison verte',but:'Dessine une maison avec au moins 4 fenêtres, un jardin et 2 arbres ou palmiers.',hist:P('La commune de {T} lance un concours de maisons écologiques : fais entrer l’air, la lumière et la verdure.')},
     {ev:'ds.etat',pr:s=>s.nb>=3&&(s.m.table||0)>=2&&(s.m.chaise||0)>=6,titre:'L’école du village',but:'Aménage une construction de 3 pièces avec au moins 2 tables et 6 chaises.',hist:P('{T} manque de salles de classe : transforme une maison en petite école.')},
     {ev:'ds.etat',pr:s=>s.nb>=3&&(s.m.wc||0)>=1&&(s.m.lavabo||0)>=1&&((s.m.lit||0)+(s.m.litS||0))>=2,titre:'Le dispensaire',but:'Aménage 3 pièces avec toilettes, lavabo et 2 lits.',hist:P('Le chef de {T} veut un dispensaire : dessine-le avec toilettes, lavabo et lits.')}];
    return L[k]}
  if(jeu==='vil'){
    const pop=Math.max(40,Math.min(200,arr(Math.sqrt(t.pop)/6)));
    const L=[
     {ev:'vil.etat',pr:s=>s.pop>=pop,titre:'Une ville de '+pop+' habitants',but:'Fais grandir ta ville jusqu’à '+pop+' habitants.',hist:P('{T} compte '+fmt(t.pop)+' habitants. Dans le jeu, construis une ville de '+pop+' habitants pour t’en inspirer.')},
     {ev:'vil.etat',pr:s=>s.nb.chateau>=1&&s.pop>=30&&s.eauOk>=1,titre:'L’eau potable',but:'Construis un château d’eau et assure l’eau à 30 habitants.',hist:P('À {T}, l’eau est rare : assure l’eau potable de ta ville.')},
     {ev:'vil.etat',pr:s=>s.pop>=40&&s.elecOk>=1,titre:'L’électricité',but:'Produis assez d’électricité pour 40 habitants (centrale ou solaire).',hist:P('{T} attend le courant : équilibre l’électricité de ta ville.')},
     {ev:'vil.etat',pr:s=>s.nb.ecole>=1&&s.eduCouv>=.6,titre:'L’école',but:'Aie une école qui couvre au moins 60 % des enfants.',hist:P('Les enfants de {T} doivent aller à l’école : construis ce qu’il faut.')},
     {ev:'vil.etat',pr:s=>s.nb.parc>=4&&s.nb.solaire>=2&&s.poll<=30,titre:'La ville verte',but:'Aie 4 parcs, 2 panneaux solaires et une pollution faible.',hist:P('{T} veut rester propre : protège l’air et la nature.')},
     {ev:'vil.etat',pr:s=>s.nb.route>=15&&s.nb.bus>=1&&s.circOk>=.9,titre:'La circulation',but:'Aie 15 routes, un arrêt de bus et une circulation fluide.',hist:P('Les motos et les camions encombrent {T} : fluidifie la circulation.')},
     {ev:'vil.etat',pr:s=>s.pop>=100&&s.sat>=70,titre:'Une ville heureuse',but:'Atteins 100 habitants avec 70 % de satisfaction.',hist:P('Le maire de {T} te demande une ville où l’on vit bien : vise 70 % de satisfaction.')}];
    return L[k]}
}
const COUNT={sci:SCI.length,med:MED.length,det:DET.length,fs:FS.length,sp:SP.length};
export function genererMissions(){
  const T=territoires(),out=[];
  ORDRE.forEach(([jeu,k],i)=>{
    const t=T[i]||TERR[i],ch=Math.floor(i/10),s=spec(jeu,k,t,i);if(!s)return;const J=JEUX[jeu];
    out.push(Object.assign({id:'m'+String(i+1).padStart(2,'0'),n:1,jeu,chap:ch,t:t.nom,prov:t.prov,cl:t.cl,pop:t.pop,km2:t.km2,fait:t.fait,
      terr:terrQ(t,i),cours:coursQ(i,jeu),pieces:6+Math.floor(i/8)+(jeu==='sp'||jeu==='vil'?2:0),guide:['lola','junior','ilunga','mavungu','bea'][i%5]},s))});
  return out}
export const MISSIONS50=genererMissions();
