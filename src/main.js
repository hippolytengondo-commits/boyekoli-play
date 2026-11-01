import * as THREE from 'three';
import {buildMarche,buildFleuve,buildSante,buildUniv} from './stages.js';
import {buildBiblio,buildGare,buildFerme,buildForet,buildMusee} from './stages2.js';
import {PROGRAMME,CONTENU,missionCle} from './programme.js';
import * as CLOUD from './cloud.js';
import {buildArene} from './arene.js';
import {createMission3D} from './mission3d.js';
import {makeEspace} from './espace.js';
import {buildAeroport,buildInga,buildVirunga,buildZongo,buildAtelier} from './stages4.js';
import {buildWagenia,buildGaramba,buildTanganyika,buildSciences,buildRumba,buildPompiers,buildPoste,buildRecyclage,buildNumerique,buildPlace} from './stages5.js';
import {buildStade,buildMine,buildObservatoire,buildPort,buildParlement} from './stages3.js';
import {buildVillageTrad,buildArts,buildRadio,buildPlantation,buildKivu,buildBonobos} from './stages6.js';
import {STAGES,BANK,NPC,AUTOP,AUTO,ITEMS,CHANTIERS,SUJETS,SKIN_TONES,HAIR_COLORS,EYE_COLORS,LIP_COLORS,OUTFIT_COLORS,HAIRS,ACCS,OUTFITS,DEFAULT_LOOK,LEVEL_UNLOCKS} from './data.js';
import {makeHuman,setFaces} from './chars.js';
import {makePhotoChar} from './sprites.js';
import {createRig} from './render.js';
import {initPhoto} from './photo.js';
import {setManifest} from './textures.js';
import {buildVille,buildClasse,buildMaison,std,cyl} from './world.js';
import * as TX from './textures.js';
import {RESS,MJ,mjPos,marqueur,lancer,varier} from './minijeux.js';
import {extendVille,CX,CZ as CZ_Q} from './quartiers.js';
import {createAudio} from './audio.js';
import {buildLieu} from './stages7.js';
import {LIEUX} from './lieux70.js';
import {construireRes,posTerrain,prixTerrain,CATALOGUE,TYPES,batiment,nomBatiment,LOYER,LOYER_MAX_H,NB_TERRAINS} from './quartier_res.js';
import {coutRoute,COUT_ROND} from './routes.js';
import {buildInterieur} from './interieurs.js';
import {creerTrafic,voiture,moto,voitureJoueur,motoJoueur} from './trafic.js';
import {creerEnrichissement} from './enrichissement.js';
import {creerSupermarche} from './supermarche.js';
import {creerMusee} from './musee.js';
import {NIVEAUX as NIVEAUX_MUSEE} from './contenu/musee.js';
const NB_NIVEAUX_MUSEE=NIVEAUX_MUSEE.length;
import {creerAventures} from './aventures.js';
import {creerCentre} from './centre.js';
import {creerMetiers} from './metiers.js';
import {creerSimulateurs} from './simulateurs.js';
import {creerMusique} from './musique.js';
import {creerReseau} from './reseau.js';
import {creerAmenager} from './amenager.js';
import {creerDetective} from './detective.js';
import {creerParole} from './parole.js';
import {creerScience} from './science.js';
import {creerHopital} from './hopital.js';
import {creerDesign} from './design.js';
import {creerMode} from './fashion.js';
import {creerVille} from './ville.js';
import {creerEspace} from './spatial.js';
import {creerJeux as creerJeuxMusique} from './musique_jeux.js';
import {creerAnimaux} from './animaux.js';
import {AE,zArret,buildConduite,melanger,creerReponses,marquerReponse,disposerReponses} from './conduite.js';
import {construireReperes,construireStation,construireGare,construireAeroport,construireStudioMusique} from './reperes.js';
import {TERRITOIRES_LISTE,PROVS,slug as slugTr} from './territoires_gen.js';
import {buildChambre,buildCuisine,buildEtage} from './maisonplus.js';

const KEY='kelas_game_v12';
const $=id=>document.getElementById(id);
const clamp=(a,b,v)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);
const dist=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);

// ---------- État ----------
const newAdv=()=>({done:{},stars:{},good:0,total:0,pieces:0,tissu:0,mangues:0,stock:{},maison:{},rev:{},xp:0,items:{},bought:{},fin:false});
const G={ui:'photo',nom:'',photo:null,real:'pf1',voice:true,sexe:'f',look:Object.assign({},DEFAULT_LOOK,{acc:[]}),sound:true,music:true,mjBonus:null,sc:'ville',x:-22,z:-3.6,ry:Math.PI,phi:-Math.PI/2,pitch:.3,mode:'start',dialog:null,
  joy:{x:0,y:0},key:{x:0,y:0},speed:0,near:null,greeted:{},adv:newAdv(),mini:null,cine:null};
// ---------- Sauvegarde locale protégée : copies de secours, jamais de recul silencieux ----------
const KB='kelas_game_v12_bak';
const lireBrut=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
const nbFaites=x=>Object.keys((x&&x.adv&&x.adv.done)||{}).length;
// copies de secours : 3 tournantes (une toutes les 90 s au plus), plus des copies protégées (avant un recul de progression, avant « nouvelle partie »)
function copies(){
  return [KB+'1',KB+'2',KB+'3',KB+'X',KB+'R'].map(k=>lireBrut(k)).filter(c=>c&&c.s&&c.s.nom)
    .sort((a,b)=>nbFaites(b.s)-nbFaites(a.s)||b.t-a.t);
}
function ecrireCopie(k,s){try{localStorage.setItem(k,JSON.stringify({t:Date.now(),s:Object.assign({},s,{photo:null})}))}catch(e){}}
let derniereCopie=0;
function sauverLocal(){
  try{
    const nouv=getSave(),ancien=lireBrut(KEY);
    if(ancien&&ancien.nom&&nbFaites(ancien)>nbFaites(nouv))ecrireCopie(KB+'X',ancien);   // la progression recule : on garde l'ancienne
    localStorage.setItem(KEY,JSON.stringify(nouv));
    if(Date.now()-derniereCopie>90000&&nouv.nom){
      derniereCopie=Date.now();
      const b2=localStorage.getItem(KB+'2'),b1=localStorage.getItem(KB+'1');
      try{if(b2)localStorage.setItem(KB+'3',b2);if(b1)localStorage.setItem(KB+'2',b1)}catch(e){}
      ecrireCopie(KB+'1',nouv);
    }
  }catch(e){}
}
// si la sauvegarde principale a disparu ou est illisible, on reprend la meilleure copie de secours
function readSave(){
  const s=lireBrut(KEY);if(s&&s.nom)return s;
  const c=copies()[0];return c?c.s:s;
}
// à la fermeture ou quand l'application passe en arrière-plan : tout enregistrer tout de suite
let sansFlush=false;   // vrai juste avant un rechargement voulu (restauration, nouvelle partie) : on n'écrase rien
function flush(){if(G.nom&&!sansFlush){sauverLocal();CLOUD.envoyerVite&&CLOUD.envoyerVite(getSave)}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)flush()});
addEventListener('pagehide',flush);
const getSave=()=>({ui:G.ui,nom:G.nom,photo:G.photo,real:G.real,voice:G.voice,look:G.look,sound:G.sound,music:G.music,adv:G.adv});
function save(){sauverLocal();CLOUD.planifierSauvegarde(getSave)}
const doneNpc=id=>!!G.adv.done[id];
const locked=id=>{const n=NPC[id];return !!(n.needs&&!doneNpc(n.needs))};
// provinces et territoires : dans le cursus mais toujours accessibles ; missions scolaires du cursus : une ou deux à réussir avant certaines missions
const accesLibre=st=>/^(tr|pv)_/.test(st.id);
const SCH={};   // id de mission d'exploration -> [{n,m,i,k}] missions scolaires à réussir d'abord
function assignerScolaire(){
  const file=[];
  PROGRAMME.forEach(n=>{const q=n.matieres.map(m=>m.missions.map((t,i)=>({n:n,m:m,i:i,t:t,k:missionCle(n.id,m.id,i)})).filter(e=>CONTENU[e.k]));
    for(let r=0;q.some(a=>a[r]);r++)q.forEach(a=>{if(a[r])file.push(a[r])})});
  const ids=[];STAGES.forEach((st,i)=>{if(i<1||st.libre||st.id==='place')return;st.npcs.forEach(id=>{if(NPC[id]&&NPC[id].needs)ids.push(id)})});
  const N=ids.length;let a=0;
  ids.forEach((id,j)=>{const b=Math.floor((j+1)*file.length/N);if(b>a)SCH[id]=file.slice(a,b);a=b});
}
const schoolReq=id=>(SCH[id]||[]).find(e=>!G.adv.done['cur:'+e.k]);
const doorOpen=()=>doneNpc('lola');
const lvl=()=>1+Math.floor(G.adv.xp/50);
const starsTotal=()=>Object.values(G.adv.stars).reduce((a,b)=>a+b,0);
const nbItems=()=>Object.keys(ITEMS).filter(k=>G.adv.items[k]).length;
const storyDone=()=>['lola','ilunga','junior','mavungu'].every(doneNpc);
const parler=n=>'Parler '+(/^le /.test(n.short)?n.short.replace(/^le /,'au '):'à '+n.short);

// ---------- Sons et musique ----------
const AUD=createAudio({sound:()=>G.sound,music:()=>G.sound&&G.music!==false});
const SFX=AUD.SFX,MUS=AUD.Music;
function humeurMusique(){
  if(G.mode==='start')return 'accueil';
  if(G.sc==='arene')return 'mission';
  const S=SCENES[G.sc];return S&&S.interior?'maison':'village';
}
function majMusique(){MUS.humeur(humeurMusique());MUS.maj()}
// les navigateurs exigent un geste de l'utilisateur avant de jouer du son : on démarre au premier toucher
['pointerdown','keydown','touchend'].forEach(ev=>document.addEventListener(ev,()=>{AUD.unlock();majMusique()},{passive:true}));

// ---------- Lecture à voix haute ----------
const TTS=typeof window!=='undefined'&&'speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined';
let voices=[];
function loadVoices(){if(TTS)voices=speechSynthesis.getVoices()||[]}
if(TTS){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
const VOICE={lola:{g:'f',pitch:.85,rate:.88},ilunga:{g:'f',pitch:1,rate:.95},junior:{g:'h',pitch:1.7,rate:1.05},mavungu:{g:'h',pitch:.75,rate:.9},bea:{g:'f',pitch:1.1,rate:1},mama:{g:'f',pitch:.95,rate:.95},_:{g:'f',pitch:1,rate:.95}};
function pickVoice(g){
  const fr=voices.filter(v=>/^fr/i.test(v.lang));
  if(!fr.length)return null;
  const fem=/(julie|hortense|denise|eloise|élodie|amelie|amélie|audrey|marie|brigitte|female|femme|google fran)/i,mal=/(paul|henri|claude|thomas|mathieu|male|homme|antoine|lucas)/i;
  const hit=fr.filter(v=>(g==='f'?fem:mal).test(v.name));
  return hit[0]||fr.find(v=>/google|microsoft/i.test(v.name))||fr[0];
}
let lastSpoken=null;
function cleanText(t){return String(t).replace(/×/g,' fois ').replace(/÷/g,' divisé par ').replace(/−/g,' moins ').replace(/\+/g,' plus ').replace(/=/g,' égale ').replace(/[·★☆🪙🥭⭐✔🔒👗🔊]/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()}
function speak(text,id,fin){
  lastSpoken={text:text,id:id};
  if(!TTS||!G.voice){if(fin)setTimeout(fin,50);return}
  try{
    speechSynthesis.cancel();
    const v=VOICE[id]||VOICE._,u=new SpeechSynthesisUtterance(cleanText(text));
    u.lang='fr-FR';u.pitch=v.pitch;u.rate=v.rate;const vo=pickVoice(v.g);if(vo)u.voice=vo;
    u.onstart=()=>MUS.baisser(true);u.onend=u.onerror=()=>{MUS.baisser(false);if(fin)fin()};
    speechSynthesis.speak(u);
  }catch(e){}
}
function stopSpeech(){if(TTS)try{speechSynthesis.cancel()}catch(e){}}
function replay(){if(lastSpoken){const w=G.voice;G.voice=true;speak(lastSpoken.text,lastSpoken.id);G.voice=w}}
let spokeKey='';
function autoSpeak(d){
  let key='',text='',id=d.id;
  if(d.kind==='quiz'){
    const n=d.n||NPC[d.id];id=d.voice||d.id;key=`q|${d.id}|${d.stage}|${d.i}|${d.qi}`;
    if(d.stage==='lines')text=n.intro[d.i];
    else if(d.stage==='q'){const q=d.qs[d.qi];text='Question '+(d.qi+1)+'. '+q.q+' Réponses : '+(d.opts||[]).join(', ')}
    else if(d.stage==='jeu'){const j=d.jeux[d.ji];key+='|'+(d.j&&d.j.etape||'');text=(d.j&&d.j.etape==='total'?j.total.q:j.consigne)}
    else if(d.stage==='fb')text=(d.fbFirst?'Bravo ! ':'C’est ça. ')+d.qs[d.qi].exp;
    else text=d.rev?'Révision terminée : '+d.firsts+' sur '+d.qs.length+' du premier coup.':n.outro;
  }else if(d.kind==='info'){key='i|'+d.title+'|'+d.i;text=d.lines[d.i]}
  else if(d.kind==='shop'){key='s|'+d.msg;text=d.msg;id='bea'}
  else return;
  if(key===spokeKey)return;
  spokeKey=key;speak(text,id);
}
const replayBtn=()=>TTS?`<button class="s" onclick="replay()">🔊 Réécouter</button>`:'';

// ---------- Moteur 3D ----------
const cv=$('cv');
const renderer=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,(window.matchMedia&&matchMedia('(pointer:coarse)').matches)?1.5:2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0xbcd0e0,.0052);
const camera=new THREE.PerspectiveCamera(58,1,.1,900);
const hemi=new THREE.HemisphereLight(0xd8ecff,0x8a7a5a,.7);scene.add(hemi);
const rig=createRig(renderer,scene,camera);
const sun=new THREE.DirectionalLight(0xfff0d4,3.4);
sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
const SC_=34;Object.assign(sun.shadow.camera,{left:-SC_,right:SC_,top:SC_,bottom:-SC_,near:1,far:160});
sun.shadow.bias=-.0003;sun.shadow.normalBias=.05;sun.shadow.radius=3;
scene.add(sun);scene.add(sun.target);
const skyDome=rig.sky;
const QKEY='kelas_quality';
let QUALITY=(()=>{try{const q=localStorage.getItem(QKEY);if(q)return q}catch(e){}return (window.matchMedia&&matchMedia('(pointer:coarse)').matches||window.innerWidth<760)?'medium':'high'})();
function applyQuality(){rig.setQuality(QUALITY,$('world').clientWidth,$('world').clientHeight)}
function cycleQuality(){QUALITY=QUALITY==='high'?'medium':QUALITY==='medium'?'low':'high';try{localStorage.setItem(QKEY,QUALITY)}catch(e){}applyQuality();renderDialog()}
const QNAME={high:'élevée',medium:'moyenne',low:'basse'};
function resize(){
  const w=$('world').clientWidth,h=$('world').clientHeight;
  renderer.setSize(w,h,false);rig.resize(w,h);camera.aspect=w/h;
  camera.fov=w/h<.8?66:(w/h<1.2?58:50);camera.updateProjectionMatrix();
}
window.addEventListener('resize',resize);

// ---------- Scènes ----------
window.__W=()=>W;let W=null;            // scène courante {group,colliders,boxes,bounds,update,...}
let playerObj=null;
let npcObjs={};let vehObjs={},vehT=0;
let mangoGroup=null;
const FABRIC_BOX={mavungu:{top:[.27,.36,.42,.52],bottom:[.30,.62,.44,.78]},ilunga:{top:[.30,.40,.42,.58],skirt:[.30,.62,.70,.82]},lola:{top:[.30,.34,.70,.46],skirt:[.30,.62,.70,.82]},bea:{top:[.30,.34,.70,.46],skirt:[.30,.62,.70,.82]},mama:{top:[.30,.34,.70,.46],skirt:[.30,.62,.70,.82]}};
function npcLook(id,l){
  const o=Object.assign({},l);
  if(window.__FACES&&window.__FACES['portraits/'+id])o.faceKey='portraits/'+id;
  if(hasChar(id)){const b=FABRIC_BOX[id]||{top:[.30,.34,.70,.46],bottom:[.30,.62,.70,.76]};o.fabric={id:id,top:b.top,bottom:b.bottom||[.30,.62,.70,.76],skirt:b.skirt};}
  return o;
}
function playerFace(){
  const o={};
  if(G.photo&&window.__FACES&&window.__FACES['avatars/'+G.photo])o.faceKey='avatars/'+G.photo;
  else if(G.photo==='u'&&userPhoto()){o.faceUrl=userPhoto();}
  return o;
}
function playerLook(){return Object.assign({},G.look,{h:.95},playerFace())}
const hasChar=id=>!!(window.__MAN&&(window.__MAN.chars||[]).includes(id));
function makePlayer(){
  if(G.real&&hasChar(G.real))return makePhotoChar(G.real,{walk:hasChar(G.real+'w')?G.real+'w':null});
  return makeHuman(playerLook());
}
function makeNpc(id,n){
  if(hasChar(id))return makePhotoChar(id);
  return makeHuman(npcLook(id,n.look));
}
const SCENES={
 ville:{build:()=>construireVille(),interior:false,spots:[{x:-9,z:-2.2,r:2.6,label:'Carte des lieux',run:()=>openMap()}],doors:[
   {x:-22,z:-5.4,r:1.9,to:'maison',label:'Entrer dans la maison',tx:0,tz:1.0,phi:-Math.PI/2},
   {x:42,z:-5.3,r:2.6,to:'classe',label:'Entrer dans l’école',ok:()=>doorOpen(),closed:'Porte fermée',tx:0,tz:2.6,phi:-Math.PI/2}]},
 maison:{build:()=>construireMaison(),interior:true,doors:[{x:0,z:2.5,r:1.9,to:'ville',label:'Sortir',tx:-22,tz:-3.9,phi:Math.PI/2}],
   spots:[{x:-1.6,z:-2.2,r:1.9,label:'Miroir : changer mon look',run:()=>openCreator('play')},{x:-1.0,z:-.6,r:1.9,label:'Plans : construire ma maison',run:()=>openMaison()}]},
 interieur:{build:()=>{const w=buildInterieur(G.int.t,G.int.n),r=G.int.ret;SCENES.interieur.doors=((G.int.t==='musee'||G.int.t==='supermarche'||G.int.t==='centre')&&G.int.n>1)?[]:[{x:0,z:w.dim.D/2-.9,r:1.6,to:'ville',label:'Sortir',tx:r.x,tz:r.z,phi:r.phi}];
   SCENES.interieur.spots=G.int.k>=0?[{x:w.dim.W/2-1.4,z:w.dim.D/2-1.3,r:1.6,label:'Gérer ou améliorer cette construction',run:()=>openBox({kind:'terrain',k:G.int.k,msg:'',retInt:true})}]:[];
   if(G.int.t==='concession')SCENES.interieur.spots.push({x:w.dim.W/2-2.6,z:-w.dim.D/2+3.2,r:2,label:'Vendeur : acheter une moto ou une voiture',run:()=>openBox({kind:'conc',msg:''})});
   if(G.int.t==='supermarche')SUP.spots(w.dim).forEach(sp=>SCENES.interieur.spots.push(sp));
   if(G.int.t==='centre')CC.spots(w.dim,G.int.n||1).forEach(sp=>SCENES.interieur.spots.push(sp));
   if(G.int.t==='musee')MUSEE.spots(w.dim).forEach(sp=>SCENES.interieur.spots.push(sp));
   if(G.int.t==='autoecole'){const W2=w.dim.W,D2=w.dim.D;
     SCENES.interieur.spots.push({x:-W2/2+2.7,z:-D2/2+3.5,r:1.9,label:'Accueil : s’inscrire à l’auto-école',run:()=>openBox({kind:'insc',msg:'',etape:'accueil',prix:FRAIS_AE})},
       {x:W2/2-2.6,z:-D2/2+3.3,r:1.9,label:'Moniteur : leçons de conduite',run:()=>{if(G.adv.inscrit)openBox({kind:'ae'});else{toast('Inscris-toi d’abord à l’accueil.');SFX.ko()}}})}
   G.x=0;G.z=w.dim.D/2-2.2;return w},interior:true,doors:[],spots:[]},
 aventure:{build:()=>AV.monde(),interior:false,get doors(){return AV.portes()},get spots(){return AV.spots()}},
 conduite:{build:()=>{const w=buildConduite(AE[G.cond.m],G.cond.veh,makeHuman);G.cond.car=w.car;return w},interior:false,doors:[],spots:[]},
 chambre:{build:()=>buildChambre(G.adv.maison),interior:true,doors:[{x:0,z:2.0,r:1.5,to:'maison',label:'Retourner au salon',tx:3.2,tz:1.2,phi:Math.PI}]},
 cuisine:{build:()=>buildCuisine(G.adv.maison),interior:true,doors:[{x:0,z:2.0,r:1.5,to:'maison',label:'Retourner au salon',tx:-3.2,tz:1.2,phi:0}]},
 etage:{build:()=>buildEtage(G.adv.maison),interior:true,doors:[{x:3.6,z:.8,r:1.7,to:'maison',label:'Descendre l’escalier',tx:3.1,tz:.6,phi:Math.PI}]},
marche:{build:()=>buildMarche(),interior:false,spawn:{x:0,z:6.2,phi:-Math.PI/2},doors:[{x:-3.8,z:9.6,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 fleuve:{build:()=>buildFleuve(),interior:false,spawn:{x:0,z:6.5,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 sante:{build:()=>buildSante(),interior:false,spawn:{x:0,z:6.4,phi:-Math.PI/2},doors:[{x:-3.8,z:10,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 univ:{build:()=>buildUniv(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 biblio:{build:()=>buildBiblio(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 gare:{build:()=>buildGare(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 ferme:{build:()=>buildFerme(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 foret:{build:()=>buildForet(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 musee:{build:()=>buildMusee(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 stade:{build:()=>buildStade(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 mine:{build:()=>buildMine(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 observatoire:{build:()=>buildObservatoire(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 port:{build:()=>buildPort(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 parlement:{build:()=>buildParlement(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 aeroport:{build:()=>buildAeroport(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 inga:{build:()=>buildInga(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 virunga:{build:()=>buildVirunga(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 zongo:{build:()=>buildZongo(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 atelier:{build:()=>buildAtelier(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 wagenia:{build:()=>buildWagenia(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 garamba:{build:()=>buildGaramba(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 tanganyika:{build:()=>buildTanganyika(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 sciences:{build:()=>buildSciences(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 rumba:{build:()=>buildRumba(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 pompiers:{build:()=>buildPompiers(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 poste:{build:()=>buildPoste(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 recyclage:{build:()=>buildRecyclage(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 numerique:{build:()=>buildNumerique(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 place:{build:()=>buildPlace(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 village:{build:()=>buildVillageTrad(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 art:{build:()=>buildArts(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 radio:{build:()=>buildRadio(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 plantation:{build:()=>buildPlantation(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 kivu:{build:()=>buildKivu(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 bonobos:{build:()=>buildBonobos(),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]},
 arene:{build:()=>buildArene(G.areneMat),interior:false,spawn:{x:0,z:5,phi:-Math.PI/2},doors:[]},
 classe:{build:()=>buildClasse(),interior:true,doors:[{x:0,z:4.1,r:1.9,to:'ville',label:'Sortir de l’école',tx:42,tz:-3.4,phi:Math.PI/2}]}
};
// lieux d'exploration générés (voir lieux70.js) : une scène et un mini-jeu pour chacun
const DESC_MJ={memoire:'Retrouve les paires de cartes identiques.',empile:'Empile les blocs bien droit pour monter la tour.',tap:'Touche les objets avant qu’ils ne disparaissent. Évite les pièges !',fall:'Déplace-toi pour rattraper les objets qui tombent. Un piège met fin au jeu !',peche:'Touche l’eau, à la profondeur du poisson, quand il passe sous la canne.'};
LIEUX.forEach((l,li)=>{
  SCENES[l.id]={build:()=>buildLieu({titre:l.nom,sous:l.npc[0].lib,arch:l.arch,wall:l.wall,accent:l.accent,seed:l.seed,pub:li%5===2}),interior:false,spawn:{x:0,z:6.8,phi:-Math.PI/2},
    doors:[{x:-3.8,z:10.4,r:2.2,to:'ville',label:'Retour au quartier',tx:-7,tz:-1.2,phi:0}]};
  {const st=varier(l.mj[0],l.mj[1],li);MJ[l.id]={r:l.mj[0],s:st,t:'Mini-jeu : '+l.nom,d:DESC_MJ[st]}}
});
const PROV_DE={};TERRITOIRES_LISTE.forEach(t=>{PROV_DE['tr_'+slugTr(t.nom)]=t.prov;PROV_DE['pv_'+slugTr(t.prov)]=t.prov});
const DOORS_VILLE=SCENES.ville.doors.slice();
const DOORS_MAISON=SCENES.maison.doors.slice();
function construireMaison(){
  const mf=G.adv.maison||{};
  const d=DOORS_MAISON.slice();
  if(mf.chambre)d.push({x:4.0,z:1.2,r:1.5,to:'chambre',label:'Aller dans la chambre',tx:0,tz:.2,phi:-Math.PI/2});
  if(mf.cuisine)d.push({x:-4.0,z:1.2,r:1.5,to:'cuisine',label:'Aller dans la cuisine',tx:0,tz:.2,phi:-Math.PI/2});
  if(mf.etage)d.push({x:3.7,z:-.3,r:1.5,to:'etage',label:'Monter à l’étage',tx:3.1,tz:1.4,phi:Math.PI});
  SCENES.maison.doors=d;
  return buildMaison(G.adv.items,mf);
}
// la ville s'agrandit : les quartiers s'ouvrent au fil des missions d'exploration réussies
function etatQuartiers(){
  return STAGES.slice(1).filter(st=>!st.libre).map((st,k)=>({id:st.id,scene:st.scene,name:st.name,icon:st.icon,ouvert:stageUnlocked(k+1),fini:stageDone(st),precedent:STAGES[k].name}));
}
function construireVille(){
  AMEN.appliquerArbres();
  const w=buildVille({maison:G.adv.maison});
  const pave=new Set(G.adv.pave||[]);
  const ext=extendVille(w,etatQuartiers(),pave);
  ext.doors.forEach(d=>{const sp=SCENES[d.to].spawn;d.tx=sp.x;d.tz=sp.z;d.phi=sp.phi});
  SCENES.ville.doors=DOORS_VILLE.concat(ext.doors);
  ext.lots.forEach(l=>{const dd=SCENES[l.scene].doors[0];dd.tx=l.retour.x;dd.tz=l.retour.z;dd.phi=l.retour.phi});
  // quartier résidentiel du joueur (terrains à acheter et maisons à construire)
  const qr=construireRes(w,{n:G.adv.terrains||0,bat:batsRes(),pave:pave,rond:!!G.adv.rond},{
    rond:()=>openBox({kind:'rond',msg:''}),
    libelle:(k,b)=>{if(b.loc&&LOYER(b.t,b.n)){const du=loyerDu(b);if(du)return '💰 '+du+' 🪙 de loyers à encaisser · '+nomBatiment(b)+' (n°'+(k+1)+')'}return '⚙ Gérer, améliorer ou louer : '+nomBatiment(b)+' (n°'+(k+1)+')'},
    entrer:(k,b,ret)=>{G.int={t:b.t,n:b.n,k:k,ret:ret};goTo({to:'interieur',tx:0,tz:0,phi:-Math.PI/2})},
    acheter:k=>openBox({kind:'terrain',k:k,msg:''}),ouvrir:k=>openBox({kind:'terrain',k:k,msg:''}),
    route:bitumerRoute,
    verrou:k=>{toast('Achète d’abord le terrain n°'+((G.adv.terrains||0)+1)+'.');SFX.ko()}});
  ext.routes.forEach(r=>qr.spots.push({x:r.x,z:r.z,r:2.6,label:r.label,run:()=>bitumerRoute(r.id,r.type,r.i)}));
  // une route construite remplace tout ce qui s'y trouvait : arbres, buissons, herbes et fleurs disparaissent
  {
    const surRoute=(x,z)=>(Math.abs(x-CX)<4.6&&z>-14.8&&z<14.8)||(G.adv.rond&&Math.hypot(x-CX,z)<9.4)||(Math.abs(z)<2.7&&x<27&&x>-33.5);
    const zero=new THREE.Matrix4().makeScale(0,0,0);
    [...w.group.children].forEach(o=>{
      if(!o.userData.vegetal)return;
      if(o.isInstancedMesh){
        const m=new THREE.Matrix4();let ch=false;
        for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);const e=m.elements;if(e[0]===0&&e[5]===0)continue;if(surRoute(e[12],e[14])){o.setMatrixAt(i,zero);ch=true}}
        if(ch)o.instanceMatrix.needsUpdate=true;
      }else if(surRoute(o.position.x,o.position.z)){
        w.group.remove(o);liberer(o);
        for(let k=w.colliders.length-1;k>=0;k--){const c=w.colliders[k];if(Math.abs(c.x-o.position.x)<.01&&Math.abs(c.z-o.position.z)<.01)w.colliders.splice(k,1)}
      }
    });
  }
  G.parkings=qr.parkings||[];
  // bâtiments repères : universités, police, santé, bibliothèque, auto-école, concession
  let spotAgence=null;const spotsExtra=[];
  {
    const rp=construireReperes(w,AMEN.AM().rep);
    rp.portes.forEach(r=>{
      {const ACCES={hopital:['🏥 BOYEKOLI MEDICAL CENTER : entrer',()=>HOPI.actions.medOuvrir()],agence:['🕵️ Agence de détectives : entrer',()=>DETEC.actions.detOuvrir()],labo:['🔬 BOYEKOLI SCIENCE LAB : entrer',()=>SCIE.actions.sciOuvrir()],design:['🏠 BOYEKOLI DESIGN STUDIO : entrer',()=>DESI.actions.dsOuvrir()],modestudio:['👗 BOYEKOLI FASHION STUDIO : entrer',()=>FASH.actions.fsOuvrir()],mairie:['🌆 BOYEKOLI SMART CITY : entrer',()=>VILL.actions.vilOuvrir()],espace:['🚀 BOYEKOLI SPACE EXPLORER : entrer',()=>ESPA.actions.spOuvrir()]};
       if(ACCES[r.id]){spotsExtra.push({x:r.px,z:r.pz,r:4.4,label:ACCES[r.id][0],run:ACCES[r.id][1]});return}}
      const retour={x:r.px+(r.ry?0:0),z:r.pz+(r.ry?-1.6:1.6),phi:r.ry?-Math.PI/2:Math.PI/2};
      if(r.stage){
        const i=STAGES.findIndex(s=>s.id===r.stage),st=STAGES[i];
        SCENES.ville.doors.push({x:r.px,z:r.pz,r:2.3,to:st.scene,label:'Entrer : '+st.name,ok:()=>stageUnlocked(i),closed:'Porte fermée : termine d’abord « '+(STAGES[i-1]?STAGES[i-1].name:'la mission précédente')+' »',
          tx:SCENES[st.scene].spawn?SCENES[st.scene].spawn.x:-12,tz:SCENES[st.scene].spawn?SCENES[st.scene].spawn.z:0,phi:SCENES[st.scene].spawn?SCENES[st.scene].spawn.phi:0,retour:retour});
      }else{
        SCENES.ville.doors.push({x:r.px,z:r.pz,r:2.3,to:'interieur',label:'Entrer : '+r.nom.replace(/^l’|^la |^le /,'').replace(/^./,c=>c.toUpperCase()),tx:0,tz:0,phi:-Math.PI/2,
          pre:()=>{G.int={t:r.interieur,n:1,k:-1,ret:retour}}});
      }
    });
  }
  SCENES.ville.spots=qr.spots;
  if(spotAgence)SCENES.ville.spots.push(spotAgence);
  spotsExtra.forEach(sp=>SCENES.ville.spots.push(sp));
  // gare, contre le mur ouest, juste à côté de la maison du joueur (celle de la maman) : le train mène aux aventures
  {const og=AMEN.AM().gare||{x:-30.8,z:0};const gp=construireGare(w.group,w.colliders,w.boxes,og.x,og.z);
   SCENES.ville.spots.push({x:gp.x,z:gp.z+.4,r:3.2,label:'🚂 Gare : partir à l’aventure',run:()=>AV.actions.avGare()})}
  {const ap=construireAeroport(w.group,w.colliders,w.boxes,130,0);
   w.bounds.x1=Math.max(w.bounds.x1,150);
   SCENES.ville.spots.push({x:ap.hall.x,z:ap.hall.z,r:4,label:'✈️ Aéroport : inscription, licence de pilote',run:()=>SIM.actions.simAeroport()});
   SCENES.ville.spots.push({x:ap.avion.x,z:ap.avion.z,r:5.5,label:'🛩 Avion : monter à bord (licence requise)',run:()=>{const p=G.adv.pilote||{};if(!p.inscrit){toast('Il faut d’abord t’inscrire à l’école de pilotage, au terminal.');SFX.ko();return}SIM.actions.simAvion()}})}
  // (le studio de musique est construit par RES.construire : il peut être déplacé)
  w.bounds.x0=Math.min(w.bounds.x0,-52);
  AMEN.construireExtras(w.group,w.colliders,w.boxes);
  {const br=RES.construire(w.group,w.colliders,w.boxes,construireStudioMusique);
   br.spots.forEach(sp=>SCENES.ville.spots.push({x:sp.x,z:sp.z,r:sp.r,label:sp.label,run:sp.kind==='studio'?()=>MUSIC.actions.musOuvrir():()=>RES.actions.resOuvrir()}))}
  // stations-service : une au village, une à l'entrée de la cité
  STATIONS.map(s0=>Object.assign({},s0,AMEN.AM().st['st_'+s0.nom]||{})).forEach(st=>{
    const r=construireStation(w.group,w.colliders,w.boxes,st.x,st.z,st.nom);
    SCENES.ville.spots.push({x:st.x,z:st.z+.6,r:4.6,label:'⛽ Pompe : acheter du carburant',run:()=>ouvrirPompe()});
  });
  // circulation : piétons et véhicules, d'autant plus nombreux que le quartier se construit
  {
    const B=batsRes(),bat=B.map((b,k)=>b&&b.annexe===undefined?k:-1).filter(k=>k>=0);
    const zN=bat.length?Math.min(...bat.map(k=>posTerrain(k).z))-9:-16;
    const tr=creerTrafic(w.group,{cx:CX,rond:!!G.adv.rond,zN:zN,zS:34,nbBat:bat.length,nbLoc:bat.filter(k=>B[k].loc).length,
      routeOk:pave.has('liaison')||pave.has('res0')||pave.has('entree'),services:bat.map(k=>B[k].t),makeHuman:makeHuman});
    G.trafic=tr;
    const u0=w.update;w.update=function(dt,t,o){if(u0)u0.call(w,dt,t,o);tr.update(dt,camera.position,{x:G.x,z:G.z,ok:!G.monte&&!G.chute&&G.mode==='play'&&G.sc==='ville'},heurteJoueur)};
  }
  return w;
}
// libère la mémoire graphique des scènes quittées (important sur téléphone)
function liberer(o){o.traverse(c=>{if(c.geometry)c.geometry.dispose();const m=c.material;if(m)(Array.isArray(m)?m:[m]).forEach(x=>x.dispose())})}
function clearScene(){
  ANI.retirer();
  Object.values(vehObjs).forEach(o=>{scene.remove(o);liberer(o)});vehObjs={};G.monte=null;G.vv=0;G.steer=0;
  if(W){scene.remove(W.group);liberer(W.group)}
  if(playerObj){scene.remove(playerObj);liberer(playerObj)}
  Object.values(npcObjs).forEach(o=>{scene.remove(o.obj);liberer(o.obj)});
  npcObjs={};
}
let curSky='';
function buildScene(){
  clearScene();
  const S=SCENES[G.sc];
  W=S.build();scene.add(W.group);
  skyDome.visible=true;
  const sk=(!S.interior&&W.sky)||null,skKey=sk?JSON.stringify(sk):'';
  if(!S.interior&&skKey!==curSky){rig.setSky(sk||undefined);curSky=skKey}
  scene.environment=S.interior?null:rig.envTex;
  const el=sk&&sk.elev!==undefined?sk.elev:34;
  hemi.intensity=S.interior?1.9:(el<=0?1.1:.45);
  scene.fog.density=S.interior?.0006:(W.fog||.0052);
  scene.fog.color.set(el<=0?0x0b1330:el<14?0xe0b894:0xbcd0e0);
  sun.color.set(el<=0?0x9db4ff:el<14?0xffb070:0xfff0d4);
  sun.intensity=S.interior?2.4:(el<=0?.35:el<14?2.2:3.4);
  W.mjMark=(MJ[G.sc]&&G.mjBonus===G.sc)?marqueur(G.sc):null;if(W.mjMark)W.group.add(W.mjMark);
  playerObj=makePlayer();scene.add(playerObj);ANI.monter();
  Object.keys(NPC).filter(k=>NPC[k].sc===G.sc).forEach(id=>addNpc(id,NPC[id]));
  Object.keys(AUTOP).filter(k=>AUTOP[k].sc===G.sc).forEach(id=>addNpc(id,AUTOP[id]));
  if(G.sc==='interieur')occupants().forEach(o=>addNpc(o.id,o));
  if(G.sc==='aventure')AV.pnj().forEach(o=>addNpc(o.id,o));
  if(G.sc==='arene'){
    const gid=NPC[G.areneGuide]?G.areneGuide:'ilunga',gl=Object.assign({},NPC[gid].look);
    if(window.__FACES&&window.__FACES['portraits/'+gid])gl.faceKey='portraits/'+gid;
    addNpc('guide',{sc:'arene',x:-9.5,z:3.5,ry:1.0,name:NPC[gid].name,short:NPC[gid].short,look:gl});
  }
  if(G.sc==='ville')garerVehicules();
  snapCamera();
  majMusique();
}
// habitants et personnel d'une construction : visuels seulement, pour donner de la vie
function occupants(){
  const I=G.int,b=I.k>=0?batsRes()[I.k]:null;if(!W||!W.dim||(!b&&I.k>=0))return [];
  if(I.t==='concession'){
    const {W:Wd,D:Dd}=W.dim;
    return [{id:'vendeur',x:Wd/2-2.6,z:-Dd/2+1.6,ry:0,look:{s:'h',h:1,skin:'#5a3319',c:'#2c3e50',k:'uniforme',co:'courtes'}},
      {id:'client0',x:-1,z:.6,ry:Math.PI/2,look:{s:'f',h:.97,skin:'#7a4a2e',c:'#e0a526',k:'pagne',co:'tresses'}}].map(o=>Object.assign({sc:'interieur',name:'',short:''},o));
  }
  if(I.t==='musee'){
    const {W:Wd,D:Dd}=W.dim;
    return (G.int.n>1?[]:[{id:'guide',x:2.5,z:Dd/2-3,ry:Math.PI,look:{s:'f',h:.97,skin:'#6b4028',c:'#8c5a2b',k:'pagne',co:'tresses'}},
      ]).concat([{id:'visiteur0',x:-1.5,z:2.4,ry:Math.PI,look:{s:'h',h:.95,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'courtes'}}]).map(o=>Object.assign({sc:'interieur',name:'',short:''},o));
  }
  if(I.t==='centre'){
    const mk=(id,x,z,ry,l)=>Object.assign({id,x,z,ry,sc:'interieur',name:'',short:'',look:l});
    if((I.n||1)>1)return [mk('bea',0,-W.dim.D/2+.5,0,Object.assign({},NPC.bea.look))].concat([mk('cl1',-3,0,Math.PI,{s:'h',h:1,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'courtes'})]);
    return [mk('v1',-9.9+3.3,-W.dim.D/2+.2,0,{s:'h',h:1,skin:'#5a3319',c:'#1f5f9e',k:'uniforme',co:'courtes'}),mk('v2',-6,4.3,Math.PI,{s:'f',h:.97,skin:'#6b4028',c:'#1f7a4d',k:'uniforme',co:'tresses'}),mk('cl1',2,1,Math.PI/2,{s:'f',h:.95,skin:'#5a3319',c:'#e0a526',k:'pagne',co:'tresses'}),mk('cl2',-1,-1,0,{s:'h',h:1,skin:'#7a4a2e',c:'#c0392b',k:'uniforme',co:'courtes'})];
  }
  if(I.t==='supermarche'){
    const {W:Wd,D:Dd}=W.dim;
    if(I.n>1)return [{id:'client0',x:-2,z:1.4,ry:Math.PI,look:{s:'h',h:1,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'courtes'}}].map(o=>Object.assign({sc:'interieur',name:'',short:''},o));
    return [{id:'caissiere',x:-2.4,z:2.4,ry:0,look:{s:'f',h:.97,skin:'#6b4028',c:'#1f7a4d',k:'uniforme',co:'tresses'}},
      {id:'client0',x:-2,z:1.4,ry:Math.PI,look:{s:'h',h:1,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'courtes'}},
      {id:'client1',x:1,z:-2.6,ry:Math.PI/2,look:{s:'f',h:.95,skin:'#5a3319',c:'#e0a526',k:'pagne',co:'tresses'}}].map(o=>Object.assign({sc:'interieur',name:'',short:''},o));
  }
  if(I.t==='autoecole'){
    const {W:Wd,D:Dd}=W.dim;
    const L=[{id:'agent',x:-Wd/2+2.7,z:-Dd/2+1.3,ry:0,look:{s:'f',h:.97,skin:'#6b4028',c:'#1f5f9e',k:'uniforme',co:'tresses'}},
      {id:'moniteur',x:Wd/2-2.6,z:-Dd/2+1.6,ry:0,look:{s:'h',h:1,skin:'#5a3319',c:'#c0392b',k:'uniforme',co:'courtes'}}];
    for(let i=0;i<(I.n>=2?3:1);i++)L.push({id:'eleve'+i,x:Wd/2-4+i*1.5,z:.3+i*.4,ry:Math.PI,look:{s:i%2?'f':'h',h:.95,skin:'#7a4a2e',c:'#2e86de',k:'uniforme',co:'courtes'}});
    return L.map(o=>Object.assign({sc:'interieur',name:'',short:''},o));
  }
  const res=LOYER(I.t,I.n)>0;
  const nb=res?(b.loc?Math.min(5,1+I.n*(I.t==='maison'&&I.n===3?2:1)):0):Math.min(8,2+I.n*2);
  const {W:Wd,D}=W.dim,out=[];
  const PEAUX=['#7a4a2e','#6b4028','#8a5634','#63391f','#916f64','#5a3319'],COL=['#c0392b','#2e86de','#27ae60','#8e44ad','#d35400','#16a085','#e0a526'];
  const blanc=I.t==='sante',unif={sante:'#ffffff',police:'#2e4a7a',pompiers:'#c0392b',ecole:'#2e86de'}[I.t];
  const slots=[[-1,.2],[1,.2],[-.5,-.9],[.55,-.9],[-1.6,.9],[1.6,.9],[0,-.2],[0,.9]];
  for(let i=0;i<nb;i++){
    const sx=i%2?'f':'h',sl=slots[i%slots.length];
    out.push({id:'occ'+i,sc:'interieur',x:sl[0]*(Wd/2-1.6),z:(D/2-3.1)+sl[1]*1.2,ry:Math.PI*(i%2?.8:-.8),name:'',short:'',
      look:{s:sx,h:sx==='h'?1:.96,skin:PEAUX[(i*5+I.n)%PEAUX.length],c:unif&&!res?unif:COL[(i*3+I.n)%COL.length],k:(!res&&unif)?'uniforme':(i%2?'pagne':'boubou'),co:sx==='h'?'courtes':'tresses'}});
  }
  return out;
}
function addNpc(id,n){
  const obj=makeNpc(id,n);
  obj.position.set(n.x,0,n.z);obj.rotation.y=n.ry||0;
  scene.add(obj);npcObjs[id]={obj,n,wave:0,ry:n.ry||0};
}

// ---------- Collisions ----------
const PR=.36;
function collide(nx,nz,sansPnj){
  let x=nx,z=nz;
  const cs=W.colliders;
  for(let i=0;i<cs.length;i++){
    const c=cs[i],dx=x-c.x,dz=z-c.z,d=Math.hypot(dx,dz),m=c.r+PR;
    if(d<m&&d>1e-4){x=c.x+dx/d*m;z=c.z+dz/d*m}
  }
  const bs=W.boxes.slice();
  if(G.sc==='ville'&&!doorOpen())bs.push(W.dyn.gateBox);
  bs.forEach(b=>{
    const cx=clamp(b.x0,b.x1,x),cz=clamp(b.z0,b.z1,z);
    const dx=x-cx,dz=z-cz,d=Math.hypot(dx,dz);
    if(d<PR){
      if(d>1e-4){x=cx+dx/d*PR;z=cz+dz/d*PR}
      else{ // centre dans la boîte : sortie par le bord le plus proche
        const l=x-b.x0,r=b.x1-x,t=z-b.z0,bt=b.z1-z,m=Math.min(l,r,t,bt);
        if(m===l)x=b.x0-PR;else if(m===r)x=b.x1+PR;else if(m===t)z=b.z0-PR;else z=b.z1+PR;
      }
    }
  });
  if(!sansPnj)Object.keys(npcObjs).forEach(id=>{
    const o=npcObjs[id].n;if(o.sit)return;
    const dx=x-o.x,dz=z-o.z,d=Math.hypot(dx,dz),m=.5+PR;
    if(d<m&&d>1e-4){x=o.x+dx/d*m;z=o.z+dz/d*m}
  });
  const b=W.bounds;
  return [clamp(b.x0,b.x1,x),clamp(b.z0,b.z1,z)];
}

// ---------- Caméra ----------
function camTarget(){return new THREE.Vector3(G.x,1.35,G.z)}
function camDesired(dist){
  const pt=G.mode==='mini'?Math.max(G.pitch,.85):G.pitch;
  if(G.mode==='mini')dist=Math.max(dist,7.5);
  const dx=Math.cos(G.phi)*Math.cos(pt),dz=Math.sin(G.phi)*Math.cos(pt),dy=Math.sin(pt);
  const t=camTarget();
  return new THREE.Vector3(t.x-dx*dist,t.y+dy*dist+.4,t.z-dz*dist);
}
const camDist=()=>G.camOverride||(SCENES[G.sc].interior?3.5:3.9+(G.monte?3.2:0));
function snapCamera(){
  const p=camDesired(camDist());camera.position.copy(p);camera.lookAt(camTarget());
}
function updateCamera(dt){
  const p=camDesired(camDist());
  camera.position.lerp(p,1-Math.exp(-dt*9));
  if(camera.position.y<.6)camera.position.y=.6;
  camera.lookAt(camTarget());
}

// ---------- HUD ----------
function objective(){
  if(G.sc==='aventure'&&AV)return AV.journal();
  const a=G.adv.done;
  if(!a.lola)return 'Objectif : va à l’école et parle à Mama Lola, la gardienne du portail.';
  if(!a.ilunga)return 'Objectif : entre dans l’école et va voir la Professeure Ilunga.';
  if(!a.junior)return 'Objectif : rejoins Junior, assis dans la classe.';
  if(!a.mavungu)return 'Objectif : le Directeur Mavungu t’attend dans la classe.';
  for(let i=1;i<STAGES.length;i++){const st=STAGES[i];if(st.libre)continue;if(!stageDone(st)&&G.ui!=='photo')return 'Objectif : suis la route jaune vers les nouveaux quartiers (sud du village) et entre ici : '+st.icon+' '+st.name+'.'}
  const n=nbItems(),t=Object.keys(ITEMS).length;
  if(n<t)return 'Objectif : cueille des mangues, révise et meuble ta maison ('+n+'/'+t+').';
  return 'Tu as tout accompli ! Continue à réviser pour gagner des étoiles.';
}
// bandeau d'objectif : lisible quelques secondes quand il change, puis réduit à une pastille pour dégager la vue (touche pour le rouvrir)
let objTxt='',objT=null;
function majObjectif(t){
  const e=$('info');
  if(t!==objTxt){
    objTxt=t;e.textContent=t;e.classList.remove('mini');
    clearTimeout(objT);objT=setTimeout(()=>{e.classList.add('mini');e.textContent='🎯'},7000);
  }
}
$('info').addEventListener('click',()=>{
  const e=$('info');
  if(e.classList.contains('mini')){e.classList.remove('mini');e.textContent=objTxt;clearTimeout(objT);objT=setTimeout(()=>{e.classList.add('mini');e.textContent='🎯'},7000)}
  else{clearTimeout(objT);e.classList.add('mini');e.textContent='🎯'}
});
function refreshHud(){
  const pu=photoUrl();
  $('stats').innerHTML=(pu?`<img class="av" src="${pu}" alt="">`:'')+'🪙 '+G.adv.pieces+' · 🎓 '+(G.adv.savoir||0)+' · ⭐ '+starsTotal()+' · Niv '+lvl();
  if(G.mode!=='mini')majObjectif(objective());
}
function gain(p,xp,sv){
  const l0=lvl();
  G.adv.pieces+=p;G.adv.xp+=xp;if(sv)G.adv.savoir=(G.adv.savoir||0)+sv;
  if(lvl()>l0){toast('Niveau '+lvl()+' atteint !'+(LEVEL_UNLOCKS[lvl()]?' Nouvelle tenue débloquée !':''));SFX.win()}
  refreshHud();save();
}
let toastT=null;
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toastT);toastT=setTimeout(()=>{e.style.display='none'},2400)}
// bulle ancrée à un point du monde
let bub=null;
function bubble(html,x,z,y,ms){
  bub={pos:new THREE.Vector3(x,y||2.2,z),until:ms?performance.now()+ms:0};
  const b=$('bubble');b.innerHTML=html;b.style.display='block';
}
function hideBubble(){bub=null;$('bubble').style.display='none'}
function placeBubble(){
  if(!bub)return;
  if(bub.until&&performance.now()>bub.until){hideBubble();return}
  const v=bub.pos.clone().project(camera);
  const w=$('world').clientWidth,h=$('world').clientHeight;
  if(v.z>1){$('bubble').style.display='none';return}
  const b=$('bubble');b.style.display='block';
  b.style.left=clamp(70,w-70,(v.x*.5+.5)*w)+'px';
  b.style.top=clamp(60,h-20,(-v.y*.5+.5)*h)+'px';
}

// ---------- Interactions ----------
function nearby(){
  const out=[];
  Object.keys(NPC).forEach(id=>{const n=NPC[id];if(n.sc===G.sc){const d=dist(G.x,G.z,n.x,n.z);if(d<(n.kind==='shop'?3.9:2.7))out.push({t:'npc',id:id,d:d})}});
  SCENES[G.sc].doors.forEach((d,i)=>{const dd=dist(G.x,G.z,d.x,d.z);if(dd<d.r)out.push({t:'door',i:i,d:dd})});
  (SCENES[G.sc].spots||[]).forEach((sp,i)=>{const dd=dist(G.x,G.z,sp.x,sp.z);if(dd<sp.r)out.push({t:'spot',i:i,d:dd})});
  if(MJ[G.sc]&&G.mjBonus===G.sc){const q=mjPos(G.sc),dd=dist(G.x,G.z,q.x,q.z);if(dd<q.r)out.push({t:'mj',d:dd})}
  if(G.sc==='ville'&&W.mangoTree){const dd=dist(G.x,G.z,W.mangoTree.x,W.mangoTree.z);if(dd<4)out.push({t:'tree',d:dd})}
  return out.sort((a,b)=>(a.t==='npc'?0:1)-(b.t==='npc'?0:1)||a.d-b.d);
}
function actionFor(t){
  if(!t)return {label:'',enabled:false,run:null};
  if(t.t==='npc'){
    const n=NPC[t.id];
    if(n.kind==='shop')return {label:'Aller au marché',enabled:true,run:openShop};
    if(n.kind==='talk')return {label:parler(n),enabled:true,run:()=>openTalk(t.id)};
    if(locked(t.id))return {label:n.short+' est occupé(e), reviens plus tard',enabled:false,run:null};
    {const r=schoolReq(t.id);if(r&&!doneNpc(t.id))return {label:'🎓 D’abord : '+r.m.nom+' · '+r.n.nom+' (mission '+(r.i+1)+')',enabled:true,run:()=>startMission(r.n.id,r.m.id,r.i)}}
    if(doneNpc(t.id))return {label:'Réviser avec '+n.short,enabled:true,run:()=>startQuiz(t.id,true)};
    return {label:parler(n),enabled:true,run:()=>startQuiz(t.id,false)};
  }
  if(t.t==='tree')return {label:'Cueillir des mangues',enabled:true,run:startMini};
  if(t.t==='mj')return {label:'🎁 Bonus : '+MJ[G.sc].t,enabled:true,run:startMJ};
  if(t.t==='spot'){const sp=SCENES[G.sc].spots[t.i];return {label:sp.label,enabled:true,run:sp.run}}
  const d=SCENES[G.sc].doors[t.i];
  if(d.ok&&!d.ok())return {label:d.closed,enabled:false,run:null};
  return {label:d.label,enabled:true,run:()=>goTo(d)};
}
function goTo(d){
  if(d.pre)d.pre();
  // retour d'un repère du village : on ressort devant son bâtiment, pas au quartier d'origine
  if(d.to==='ville'&&G.retourRepere){const r=G.retourRepere;G.retourRepere=null;d=Object.assign({},d,{tx:r.x,tz:r.z,phi:r.phi})}
  else if(d.to!=='ville')G.retourRepere=d.retour||null;
  G.sc=d.to;G.x=d.tx;G.z=d.tz;G.phi=d.phi;G.near=null;hideBubble();buildScene();
}

// ---------- Dialogues ----------
function openBox(d){
  G.dialog=d;G.mode='dialog';G.joy.x=G.joy.y=0;G.key.x=G.key.y=0;resetKnob();
  hideBubble();renderDialog();
  $('actwrap').classList.add('hide');
}
function closeDialog(){
  resetArmed=false;stopSpeech();spokeKey='';
  $('dlg').style.display='none';G.dialog=null;
  if(G.depart){G.depart=false;$('dlg').style.zIndex='';majAccueil();return}
  if(G.sc==='arene')quitterArene();
  if(G.ui==='photo'){G.mode='pview';PM.refresh();refreshHud();return}
  G.mode='play';
  $('actwrap').classList.remove('hide');
  if(G.sc==='maison')buildScene();
  if(G.sc==='interieur'&&G.int.k>=0){const b=batsRes()[G.int.k];if(!b||b.annexe!==undefined){const r=G.int.ret;goTo({to:'ville',tx:r.x,tz:r.z,phi:r.phi})}else{G.int.n=b.n;buildScene()}}
  if(G.refaireVille){G.refaireVille=false;if(G.sc==='ville')buildScene()}
  refreshHud();
}
const MAT_FR=new Set(['francais','lecture','contes']);
const MAT_MA=new Set(['maths','marche','transport','footmaths','argent','poissons','metiers','epargne']);
const MAT_SC=new Set(['nutrition','sante','corps','environnement','foret','animaux','agriculture','saisons','sciences','sciences2','meteo','energie','eau','espace','arbres','recyclage','savane','chaine','lacvie','virunga','volcans','incendie','secours','internet','numerique','mines','minesec']);
const matiereDe=su=>MAT_FR.has(su)?'fr':MAT_MA.has(su)?'ma':MAT_SC.has(su)?'sc':'hg';
function startQuiz(id,rev){
    const n=NPC[id],bank=BANK[n.sujet];
  const qs=rev?shuffle(bank).slice(0,3):bank.slice(0,n.nb);
  const m3d=G.ui==='3d';
  if(m3d)entrerArene(matiereDe(n.sujet),id);
  openBox({kind:'quiz',id:id,rev:rev,m3d:m3d,stage:rev?'q':'lines',i:0,qi:0,qs:qs,opts:null,bad:[],qerr:false,errs:0,firsts:0,gain:0,res:null});
  if(m3d&&rev)lancerMission3D(G.dialog);
}
function renderDialog(){
  const d=G.dialog,box=$('dlg');
  box.style.display='block';box.scrollTop=0;
  let h='';
  if(d.kind==='quiz')h=htmlQuiz(d);
  else if(d.kind==='info')h=htmlInfo(d);
  else if(d.kind==='shop')h=htmlShop(d);
  else if(d.kind==='maison')h=htmlMaison(d);
  else if(d.kind==='terrain')h=htmlTerrain(d);
  else if(d.kind==='route')h=htmlRoute(d);
  else if(d.kind==='conc')h=htmlConc(d);
  else if(d.kind==='ae')h=htmlAE(d);
  else if(d.kind==='insc')h=htmlInsc(d);
  else if(d.kind==='cond')h=htmlCond(d);
  else if(d.kind==='rond')h=htmlRond(d);
  else if(d.kind==='menu')h=htmlMenu(d);
  else if(d.kind==='pompe')h=htmlPompe(d);
  else if(d.kind==='coll'||d.kind==='surp'||d.kind==='evt')h=EN.html(d);
  else if(d.kind==='rayon'||d.kind==='caisse'||d.kind==='prov')h=SUP.html(d);
  else if(d.kind==='matos'||d.kind==='troc')h=CC.html(d);
  else if(d.kind==='animal')h=ANI.html(d);
  else if(d.kind==='metiers')h=SIM.html(d)||MET.html(d);
  else if(d.kind==='reseau')h=RES.html(d);
  else if(d.kind==='expo'||d.kind==='credits')h=MUSEE.html(d);
  else if(d.kind==='avent'||d.kind==='conv'||d.kind==='trouv'||d.kind==='avfin'||d.kind==='effort')h=AV.html(d);
  else if(d.kind==='profile')h=htmlProfile(d);
  else if(d.kind==='map')h=htmlMap(d);
  else if(d.kind==='congo')h=htmlCongo(d);
  else if(d.kind==='objs')h=htmlObjs(d);
  else if(d.kind==='prog')h=htmlProg(d);
  else if(d.kind==='esp')h=Esp.html(d);
  else if(d.kind==='suite')h=htmlSuite(d);
  else if(d.kind==='carnet')h=htmlCarnet(d);
  else if(d.kind==='comp')h=htmlComp(d);
  box.innerHTML='<div class="box">'+h+(d.kind==='quiz'||d.kind==='info'||d.kind==='shop'?replayBtn():'')+'</div>';
  autoSpeak(d);
}
const hasPortrait=id=>!!(window.__MAN&&(window.__MAN.portraits||[]).includes(id));
const head=(id,title)=>`<div class="hd">${id&&hasPortrait(id)?`<img class="pt" src="img/portraits/${id}.jpg" alt="">`:''}<h3>${esc(title)}</h3></div>`;
function htmlQuiz(d){
  const n=d.n||NPC[d.id];
  let h=head(d.portrait||d.id,n.name+' · '+n.role);
  if(d.stage==='lines'){
    h+=`<p>${esc(n.intro[d.i])}</p><button class="p" onclick="nextLine()">Suite</button>`;
  }else if(d.stage==='q'){
    const q=d.qs[d.qi];
    if(!d.opts)d.opts=shuffle(q.c);
    h+=`<p><b>${esc(d.rev?'Révision · ':'')}Question ${d.qi+1} sur ${d.qs.length}</b> : ${esc(q.q)}</p>`;
    if(d.bad.length)h+=`<p class="ko">Pas tout à fait. Réfléchis encore !</p>`;
    h+=d.opts.map((c,i)=>`<button ${d.bad.indexOf(c)>=0?'disabled':''} onclick="answerQ(${i})">${esc(c)}</button>`).join('');
    h+=`<button class="s" onclick="closeDialog()">Quitter</button>`;
  }else if(d.stage==='jeu'){
    h+=htmlJeu(d);
  }else if(d.stage==='fb'){
    const q=d.qs[d.qi];
    h+=`<p class="ok"><b>${d.fbFirst?'Bravo !':'C’est ça.'}</b> ${esc(q.exp)}</p><button class="p" onclick="nextQ()">Suite</button>`;
  }else{
    const r=d.res;
    const sc=d.score||{p:0,t:1,best:{p:0,t:1},n:1},pc=Math.round(100*sc.p/sc.t);
    const compare=(d.avant?`<p style="font-size:13px;margin:2px 0">${sc.p/sc.t>d.avant.p/d.avant.t?'📈 Nouveau meilleur score ! ':''}Meilleur score avant : ${d.avant.p} sur ${d.avant.t}${d.derniere?' · dernier : '+d.derniere.p+' sur '+d.derniere.t:''}</p>`:'');
    if(d.rev)h+=`<div class="mfin">🎉 RÉVISION TERMINÉE !</div><div class="mscore">${sc.p} sur ${sc.t}</div><p style="text-align:center;margin:0">${pc} % · <b>+${d.gain} 🪙</b></p>${compare}`;
    else h+=`<div class="mfin">🎉 MISSION TERMINÉE !</div><div class="mscore">${sc.p} sur ${sc.t}</div><p style="text-align:center;margin:0">${pc} %</p>${compare}<p>${esc(n.outro)}</p><p><b>+${d.gain} 🪙</b>${r.tissu?' · +'+r.tissu+' tissu wax':''}</p>`;
    const sv=suivanteScolaire(d);
    h+=`<p style="font-size:14px;margin:6px 0">Bravo, tu as fini la mission ! Continue avec la suivante ou explore d’autres missions.</p>`;
    if(sv)h+=`<button class="p" onclick="startMission('${sv[0]}','${sv[1]}',${sv[2]})">▶ Suivant : ${esc(sv[3])}</button>`;
    else if(G.ui==='3d'&&!d.rev)h+=`<button class="p" onclick="suivantAventure()">▶ Suivant</button>`;
    h+=`<button class="j" onclick="openSuite()">🧭 Explorer d’autres missions</button>`;
    d.menuFait=true;
    if(d.classe)h+=`<p style="font-size:13px">📘 <b>Tu retrouveras ça en classe :</b> ${esc(d.classe)}.</p>`;
    h+=`<button class="p" onclick="closeDialog()">Continuer l’exploration</button>`;
    if(d.backEsp==='mm')h+=`<button onclick="openEsp('mm')">Mes missions de classe</button>`;
    else if(d.backEsp==='ens')h+=`<button onclick="openEsp()">Retour à l’espace enseignant</button>`;
    else if(d.back)h+=`<button onclick="progBack()">Autres missions</button>`;
  }
  return h;
}
// ---------- Énigmes : activités dans le récit (ordre des mots, commande du marchand, tri) ----------
function jeuInit(d){
  const j=d.jeux[d.ji];
  if(j.t==='ordre')d.j={mots:shuffle(j.mots.map((m,i)=>({m,i}))),choix:[],err:0};
  else if(j.t==='panier')d.j={q:{},etape:'prep',err:0};
  else if(j.t==='tri')d.j={fait:{},sel:null,err:0};
}
function htmlJeu(d){
  const j=d.jeux[d.ji],e=d.j;
  let h=`<p><b>Énigme ${d.ji+1} sur ${d.jeux.length}</b> : ${esc(j.consigne)}</p>`;
  if(e.msg)h+=`<p class="ko">${esc(e.msg)}</p>`;
  if(j.t==='ordre'){
    h+=`<p style="min-height:34px;background:#f3ecdc;border-radius:10px;padding:8px 10px">${e.choix.length?e.choix.map(i=>esc(j.mots[i])).join(' '):'…'}</p>`;
    h+='<div style="display:flex;flex-wrap:wrap;gap:6px">'+e.mots.map(o=>e.choix.includes(o.i)?'':`<button style="width:auto;padding:9px 14px" onclick="jeuOrdre(${o.i})">${esc(o.m)}</button>`).join('')+'</div>';
    h+=`<button class="p" onclick="jeuOrdreOk()" ${e.choix.length===j.mots.length?'':'disabled'}>Valider ma phrase</button><button class="s" onclick="jeuOrdreRaz()">Recommencer</button>`;
  }else if(j.t==='panier'){
    if(e.etape==='prep'){
      h+=j.articles.map(a=>`<div class="row" style="align-items:center;padding:4px 0"><span style="font-size:15px">${a.e} ${esc(a.n)} · ${a.p} FC</span><span><button style="display:inline-block;width:44px;text-align:center;padding:6px" onclick="jeuPan('${esc(a.n)}',-1)">−</button> <b style="display:inline-block;min-width:22px;text-align:center">${e.q[a.n]||0}</b> <button style="display:inline-block;width:44px;text-align:center;padding:6px" onclick="jeuPan('${esc(a.n)}',1)">+</button></span></div>`).join('');
      h+=`<button class="p" onclick="jeuPanOk()">Commande prête</button>`;
    }else{
      h+=`<p>${esc(j.total.q)}</p>`+j.total.c.map((c,i)=>`<button onclick="jeuPanTotal(${i})">${esc(c)}</button>`).join('');
    }
  }else if(j.t==='tri'){
    const rest=j.objets.map((o,i)=>[o,i]).filter(x=>e.fait[x[1]]===undefined);
    h+='<div style="display:flex;flex-wrap:wrap;gap:6px">'+rest.map(x=>`<button style="width:auto;padding:9px 14px;${e.sel===x[1]?'background:#fff6dc;border-color:#e0a526':''}" onclick="jeuTriPick(${x[1]})">${esc(x[0][0])}</button>`).join('')+'</div>';
    h+='<p style="font-size:13px;margin-top:8px">Touche un objet, puis son panier :</p>'+j.paniers.map((b,i)=>`<button onclick="jeuTriPose(${i})">📦 ${esc(b)}</button>`).join('');
  }
  return h+`<button class="s" onclick="closeDialog()">Quitter</button>`;
}
function jeuErreur(d,indice){d.errs++;d.j.err++;d.j.msg=indice||'Pas tout à fait. Réfléchis encore !';SFX.ko();renderDialog()}
function jeuFini(d){
  const first=d.j.err===0,coin=first?5:1;
  if(first)d.pts=(d.pts||0)+1;
  d.gain+=coin;gain(coin,first?10:3,first?10:3);SFX.bravo();
  d.ji++;
  if(d.ji>=d.jeux.length){
    if(d.qs.length){d.stage='q';d.qi=0;d.opts=null;d.bad=[];d.qerr=false}
    else{completeQuiz(d);d.stage='out'}
  }else jeuInit(d);
  renderDialog();
}
function jeuOrdre(i){const d=G.dialog;d.j.choix.push(i);d.j.msg='';renderDialog()}
function jeuOrdreRaz(){const d=G.dialog;d.j.choix=[];d.j.msg='';renderDialog()}
function jeuOrdreOk(){
  const d=G.dialog,j=d.jeux[d.ji],mots=d.j.choix.map(i=>j.mots[i]);
  if(mots.join(' ')===j.rep.join(' '))jeuFini(d);
  else{d.j.choix=[];jeuErreur(d,j.indice||'Ce n’est pas encore une phrase correcte. Essaie un autre ordre.')}
}
function jeuPan(n,delta){const d=G.dialog;d.j.q[n]=Math.max(0,Math.min(9,(d.j.q[n]||0)+delta));d.j.msg='';renderDialog()}
function jeuPanOk(){
  const d=G.dialog,j=d.jeux[d.ji];
  const ok=j.articles.every(a=>(d.j.q[a.n]||0)===(j.cible[a.n]||0));
  if(ok){d.j.etape='total';d.j.msg='';renderDialog()}
  else jeuErreur(d,'Relis la commande du marchand : il manque ou il y a trop d’articles.');
}
function jeuPanTotal(i){
  const d=G.dialog,j=d.jeux[d.ji];
  if(j.total.c[i]===j.total.a)jeuFini(d);else jeuErreur(d,j.total.indice||'Calcule chaque article, puis additionne.');
}
function jeuTriPick(i){const d=G.dialog;d.j.sel=i;d.j.msg='';renderDialog()}
function jeuTriPose(b){
  const d=G.dialog,j=d.jeux[d.ji];
  if(d.j.sel===null||d.j.sel===undefined){d.j.msg='Touche d’abord un objet.';renderDialog();return}
  const o=j.objets[d.j.sel];
  if(j.paniers[b]===o[1]){d.j.fait[d.j.sel]=b;d.j.sel=null;d.j.msg='';
    if(Object.keys(d.j.fait).length===j.objets.length){jeuFini(d);return}
    renderDialog()}
  else jeuErreur(d,j.indice||('« '+o[0]+' » ne va pas dans ce panier.'));
}

function nextLine(){
  const d=G.dialog,n=d.n||NPC[d.id];
  d.i++;
  if(d.i>=n.intro.length&&d.m3d){lancerMission3D(d);return}
  if(d.i>=n.intro.length){d.qi=0;d.opts=null;if(d.jeux&&d.jeux.length){d.ji=0;d.stage='jeu';jeuInit(d)}else d.stage='q'}
  renderDialog();
}
function answerQ(i){
  const d=G.dialog,q=d.qs[d.qi],c=d.opts[i];
  if(c!==q.a){if(!d.qerr&&!d.preview)CLOUD.enregistrerErreur(d.id,d.assign||null,q.q,c,q.a);d.bad.push(c);d.qerr=true;d.errs++;SFX.ko();renderDialog();return}
  const first=!d.qerr;
  G.adv.total++;
  if(first){G.adv.good++;d.firsts++;d.pts=(d.pts||0)+1}
  const coin=d.rev?(first?2:0):(first?5:1);
  d.gain+=coin;d.fbFirst=first;
  gain(coin,first?(d.rev?3:10):3,first?(d.rev?3:10):3);
  SFX.bravo();d.stage='fb';renderDialog();
}
function nextQ(){
  const d=G.dialog;
  d.qi++;d.opts=null;d.bad=[];d.qerr=false;
  if(d.qi>=d.qs.length){completeQuiz(d);d.stage='out'}else d.stage='q';
  renderDialog();
}
// score exact : 1 point par étape réussie du premier coup ; mémorisé avec l'historique des tentatives
function totalEtapes(d){return d.total||((d.collecte||[]).length+(d.jeux||[]).length+d.qs.length)}
function memoriserScore(d){
  const key=String(d.id).startsWith('cur:')?String(d.id).slice(4):String(d.id);
  const pts=Math.min(d.pts||0,totalEtapes(d)),tot=totalEtapes(d);
  G.adv.scores=G.adv.scores||{};
  const sc=G.adv.scores[key]||{n:0};
  d.avant=sc.best?{p:sc.best.p,t:sc.best.t}:null;d.derniere=sc.last?{p:sc.last.p,t:sc.last.t}:null;
  sc.n++;sc.last={p:pts,t:tot};
  if(!sc.best||pts/tot>sc.best.p/sc.best.t)sc.best={p:pts,t:tot};
  G.adv.scores[key]=sc;
  G.adv.hist=(G.adv.hist||[]).concat([{k:key,p:pts,t:tot,d:Date.now()}]).slice(-400);
  d.score={p:pts,t:tot,best:sc.best,n:sc.n};
  if(String(d.id).startsWith('cur:')&&!d.preview)CLOUD.enregistrerScore(key,d.assign,pts,tot);
  planifier(key,pts,tot);
}
function completeQuiz(d){
  memoriserScore(d);
  if(d.rev){save();return}
  const id=d.id,st=d.errs===0?3:(d.errs<=2?2:1);
  G.adv.done[id]=true;
  G.adv.stars[id]=Math.max(G.adv.stars[id]||0,st);
  {const lieu=NPC[id]&&NPC[id].sc;if(lieu&&MJ[lieu])G.mjBonus=lieu}   // le mini-jeu du lieu devient un bonus à jouer une fois
  d.gain+=10;gain(10,10);
  let tissu=0;
  if(id==='mavungu'){G.adv.pieces+=20;G.adv.tissu+=2;tissu=2;d.gain+=20}
  d.res={stars:st,tissu:tissu};
  const nw=G.ui==='photo'?[]:newUnlocks(id);if(nw.length)setTimeout(()=>toast('Débloqué : '+nw.join(', ')),900);
  SFX.win();save();refreshHud();
  setTimeout(checkFin,0);setTimeout(()=>stageCheck(id),400);
}
function openTalk(id){
  const n=NPC[id];

  openBox({kind:'info',id:id,title:n.name+' · '+n.role,i:0,lines:[
    'Bonjour '+G.nom+' !',
    objective().replace('Objectif : ','Ton objectif : '),
    aReviser().length?'Tu as '+aReviser().length+' mission(s) à réviser aujourd’hui : ouvre la carte des compétences dans le menu.':'Ta partie est sauvegardée automatiquement. Repose-toi quand tu veux.']});
}
function htmlInfo(d){
  const last=d.i>=d.lines.length-1;
  return head(d.id,d.title)+`<p>${esc(d.lines[d.i])}</p><button class="p" onclick="${last?'closeDialog()':'infoNext()'}">${last?'Fermer':'Suite'}</button>`;
}
function infoNext(){G.dialog.i++;renderDialog()}

// ---------- Boutique ----------
function openShop(){openBox({kind:'shop',msg:'Bienvenue au marché, '+G.nom+' !'})}
function htmlShop(d){
  const a=G.adv;
  let h=head('bea','Maman Béa · Marchande')+`<p>${esc(d.msg)}</p><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p><p class="row"><span>Mes mangues · tissu wax</span><b>${a.mangues} 🥭 · ${a.tissu}</b></p>`;
  if(a.mangues>0)h+=`<button onclick="sellMangoes()">Vendre mes ${a.mangues} mangues (+${a.mangues*2} 🪙)</button>`;
  if(valeurSac()>0)h+=`<p class="row"><span>Mon sac</span><b>${esc(texteSac())}</b></p><button onclick="sellSac()">Vendre tout mon sac (+${valeurSac()} 🪙)</button>`;
  h+=Object.keys(ITEMS).map(k=>{
    const it=ITEMS[k];
    if(a.items[k])return `<button disabled>✔ ${esc(it.n)} (dans ta maison)</button>`;
    return `<button onclick="buy('${k}')">${esc(it.n)} — ${it.p} 🪙${it.t?' + '+it.t+' tissu wax':''}</button>`;
  }).join('');
  h+=`<h4>Acheter des matériaux (pour ma maison)</h4>`+PRIX_ACHAT.map(k=>`<button onclick="buyRes('${k}')">${RESS[k].e} 5 ${esc(RESS[k].n)} — ${RESS[k].p*10} 🪙</button>`).join('');
  if(G.ui!=='photo')h+=`<button onclick="shopMode()">👗 Mode : essayer tenues et coiffures</button>`;
  return h+`<button class="s" onclick="closeDialog()">Quitter le marché</button>`;
}
// ---------- Mini-jeux de ressources ----------
const stock=()=>{const a=G.adv;if(!a.stock)a.stock={};return a.stock};
const valeurSac=()=>Object.keys(stock()).reduce((t,k)=>t+(RESS[k]?stock()[k]*RESS[k].p:0),0);
const texteSac=()=>Object.keys(stock()).filter(k=>RESS[k]&&stock()[k]>0).map(k=>stock()[k]+' '+RESS[k].e).join(' · ')||'vide';
function sellSac(){
  const v=valeurSac();if(!v)return;
  G.adv.stock={};gain(v,0);SFX.coin();
  G.dialog.msg='Merci ! Tout ton sac est vendu : +'+v+' pièces.';renderDialog();
}
const PRIX_ACHAT=['brique','bois','sable','ciment','fer','bitume'];
function buyRes(k){
  const r=RESS[k],cout=r.p*10,a=G.adv;
  if(a.pieces<cout){G.dialog.msg='Il te manque '+(cout-a.pieces)+' pièces pour acheter des '+r.n+'.';SFX.ko();renderDialog();return}
  a.pieces-=cout;stock()[k]=(stock()[k]||0)+5;save();refreshHud();SFX.coin();
  G.dialog.msg='Tu as acheté 5 '+r.n+'. Ils sont dans ton sac.';renderDialog();
}
// ---------- Chantiers de la maison ----------
function openMaison(){openBox({kind:'maison',msg:''})}
const icoCout=k=>k==='pieces'?'🪙':k==='savoir'?'🎓':RESS[k].e;
const manque=(c)=>{const a=G.adv,m=[];Object.keys(c.cout).forEach(k=>{const n=c.cout[k],h=k==='pieces'?a.pieces:k==='savoir'?(a.savoir||0):(stock()[k]||0);if(h<n)m.push((n-h)+' '+icoCout(k))});return m};
const payer=c=>Object.keys(c).forEach(x=>{const a=G.adv;if(x==='pieces')a.pieces-=c[x];else if(x==='savoir')a.savoir=(a.savoir||0)-c[x];else stock()[x]-=c[x]});
function htmlMaison(d){
  const mf=G.adv.maison||(G.adv.maison={});
  let h=`<h3>🏗 Plans de ma maison</h3><p class="row"><span>Mes pièces</span><b>${G.adv.pieces} 🪙</b></p><p class="row"><span>Mon sac</span><b>${esc(texteSac())}</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  CHANTIERS.forEach(c=>{
    const cout=Object.keys(c.cout).map(k=>c.cout[k]+' '+(k==='pieces'?'🪙':RESS[k].e)).join(' · ');
    if(mf[c.k]){h+=`<button disabled>✔ ${c.ico} ${esc(c.n)} (construit)</button>`;return}
    const req=c.req.filter(r=>!mf[r]);
    if(req.length){const nom=req.map(r=>CHANTIERS.find(x=>x.k===r).n).join(', ');h+=`<button disabled>🔒 ${c.ico} ${esc(c.n)} — d’abord : ${esc(nom)}</button>`;return}
    const m=manque(c);
    h+=`<button class="${m.length?'':'p'}" onclick="construire('${c.k}')">${c.ico} ${esc(c.n)}<br><small>${esc(c.d)}</small><br><small>Coût : ${cout}${m.length?' — il te manque : '+m.join(' · '):''}</small></button>`;
  });
  h+=`<p style="font-size:12px">Récolte des matériaux dans les mini-jeux de chaque lieu, ou achète-les chez Maman Béa.</p>`;
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function construire(k){
  const c=CHANTIERS.find(x=>x.k===k),a=G.adv,mf=a.maison||(a.maison={}),d=G.dialog;
  if(!c||mf[k])return;
  if(c.req.some(r=>!mf[r]))return;
  const m=manque(c);
  if(m.length){d.msg='Il te manque : '+m.join(' · ');SFX.ko();renderDialog();return}
  Object.keys(c.cout).forEach(x=>{if(x==='pieces')a.pieces-=c.cout[x];else stock()[x]-=c.cout[x]});
  mf[k]=true;save();refreshHud();SFX.win();
  d.msg='Chantier terminé : '+c.n+' ! Ferme ce menu pour voir le résultat.';renderDialog();
}
// ---------- Quartier résidentiel : terrains, constructions, routes ----------
const coutTexte=c=>Object.keys(c).map(k=>c[k]+' '+icoCout(k)).join(' · ');
const batsRes=()=>{const a=G.adv;if(!a.batRes)a.batRes=[];(a.maisRes||[]).forEach((n,k)=>{if(n&&!a.batRes[k])a.batRes[k]={t:'maison',n:n}});return a.batRes};
// terrain voisin (même côté de la route) libre et déjà acheté, pour les constructions à deux terrains
function annexeLibre(k){
  const a=G.adv,B=batsRes();
  return [k+2,k-2].find(j=>j>=0&&j<(a.terrains||0)&&!B[j])||-1;
}
function boutonConstruction(k,t,niv){
  const c=CATALOGUE[t],lv=c.niv[niv],m=manque({cout:lv.cout});
  const dbl=lv.double&&annexeLibre(k)<0;
  return `<button class="${m.length||dbl?'':'p'}" onclick="construireTerrain(${k},'${t}')">${c.ico} ${esc(niv?'Améliorer : ':'')}${esc(lv.n)}<br><small>${esc(lv.d)}</small><br><small>Coût : ${coutTexte(lv.cout)}${m.length?' — il te manque : '+m.join(' · '):''}${dbl?' — il faut aussi un terrain voisin (n°'+(k+3)+' ou n°'+(k-1)+') acheté et libre':''}</small></button>`;
}
function htmlTerrain(d){
  const a=G.adv,k=d.k,n=a.terrains||0,b=batsRes()[k]||null;
  let h=`<h3>🏘 Terrain n°${k+1}</h3><p class="row"><span>Mes points de savoir</span><b>${a.savoir||0} 🎓</b></p><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p><p class="row"><span>Mon sac</span><b>${esc(texteSac())}</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  if(k===n){
    const prix=prixTerrain(k),ok=(a.savoir||0)>=prix;
    h+=`<p style="font-size:13px">Un terrain dans ton quartier résidentiel. Les points de savoir se gagnent en réussissant des missions : plus tu apprends, plus ta ville grandit. Chaque terrain coûte plus cher que le précédent.</p>`
      +`<button class="${ok?'p':''}" onclick="acheterTerrain(${k})">Acheter ce terrain : ${prix} 🎓${ok?'':' — il te manque '+(prix-(a.savoir||0))+' 🎓'}</button>`;
  }else if(k<n){
    if(b&&b.annexe!==undefined){
      h+=`<p>Ce terrain sert d’annexe au terrain n°${b.annexe+1} : ${esc(nomBatiment(batsRes()[b.annexe]))}.</p>`;
    }else if(b){
      const c=CATALOGUE[b.t];
      h+=`<p>Actuellement : ${c.ico} <b>${esc(nomBatiment(b))}</b></p>`;
      if(b.n>=c.niv.length)h+=`<p>✔ Cette construction est au niveau maximal.</p>`;
      else h+=boutonConstruction(k,b.t,b.n);
      const lo=LOYER(b.t,b.n);
      if(lo){
        if(b.loc){const du=loyerDu(b);h+=`<p>🏘 <b>Des locataires occupent ce logement</b> (${lo} 🪙 par heure). Loyers à encaisser : <b>${du} 🪙</b></p><button class="${du?'p':''}" onclick="encaisserLoyer(${k})">💰 Encaisser les loyers</button><button class="s" onclick="louerTerrain(${k},false)">Reprendre le logement (fin de la location)</button>`}
        else h+=`<button onclick="louerTerrain(${k},true)">🏘 Mettre en location<br><small>Des familles s’installent et paient ${lo} 🪙 par heure (jusqu’à ${LOYER_MAX_H} h cumulées).</small></button>`;
      }else h+=`<p style="font-size:13px">🏥 Ce service accueille du personnel et des visiteurs : entre pour voir l’activité.</p>`;
      h+=d.conf?`<p style="font-size:13px">Démolir « ${esc(nomBatiment(b))} » ? Tu récupères la moitié des pièces et des points de savoir investis, pas les matériaux.</p><button onclick="demolirTerrain(${k})">Oui, démolir</button><button class="s" onclick="demolirAnnuler()">Non, garder</button>`:`<button class="s" onclick="demolirAnnuler(true)">🔨 Démolir ou changer de construction</button>`;
    }else{
      h+=`<p style="font-size:13px">Choisis ce que tu construis sur ce terrain. Chaque construction coûte des pièces, des matériaux et des points de savoir, et peut être améliorée ensuite.</p>`;
      ['Résidences','Services publics'].forEach(cat=>{
        h+=`<h4>${cat}</h4>`+TYPES.filter(t=>CATALOGUE[t].cat===cat).map(t=>boutonConstruction(k,t,0)).join('');
      });
    }
    h+=`<p style="font-size:12px">Récolte des matériaux dans les mini-jeux, ou achète-les chez Maman Béa.</p>`;
  }
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function acheterTerrain(k){
  const a=G.adv,d=G.dialog,prix=prixTerrain(k);
  if(k!==(a.terrains||0))return;
  if((a.savoir||0)<prix){d.msg='Il te manque '+(prix-(a.savoir||0))+' points de savoir : réussis encore des missions !';SFX.ko();renderDialog();return}
  a.savoir-=prix;a.terrains=k+1;if(!a.maisRes)a.maisRes=[];
  G.refaireVille=true;save();refreshHud();SFX.win();
  d.msg='Félicitations ! Le terrain n°'+(k+1)+' est à toi. Ferme ce menu pour le voir, puis choisis ce que tu y construis.';renderDialog();
}
function construireTerrain(k,t){
  const a=G.adv,d=G.dialog;if(k>=(a.terrains||0)||!CATALOGUE[t])return;
  const B=batsRes(),b=B[k];
  if(b&&(b.annexe!==undefined||b.t!==t))return;
  const niv=b?b.n:0,c=CATALOGUE[t];if(niv>=c.niv.length)return;
  const lv=c.niv[niv],m=manque({cout:lv.cout});
  if(m.length){d.msg='Il te manque : '+m.join(' · ');SFX.ko();renderDialog();return}
  let j=-1;
  if(lv.double){j=annexeLibre(k);if(j<0){d.msg='Il te faut un second terrain voisin, acheté et libre, pour cette construction.';SFX.ko();renderDialog();return}}
  payer(lv.cout);
  B[k]={t:t,n:niv+1};if(j>=0)B[j]={annexe:k};
  if((a.maisRes||[])[k]!==undefined)a.maisRes[k]=0;
  G.refaireVille=true;save();refreshHud();SFX.win();
  d.msg='Chantier terminé : '+lv.n+' ! Ferme ce menu pour voir le résultat.';renderDialog();
}
const loyerDu=b=>Math.floor(LOYER(b.t,b.n)*Math.min(LOYER_MAX_H,Math.max(0,(Date.now()-(b.t0||Date.now()))/3.6e6)));
function louerTerrain(k,oui){
  const b=batsRes()[k],d=G.dialog;if(!b||!LOYER(b.t,b.n))return;
  if(oui){b.loc=true;b.t0=Date.now();d.msg='Des familles s’installent. Reviens encaisser les loyers.'}
  else{const du=loyerDu(b);if(du){G.adv.pieces+=du}b.loc=false;b.t0=0;d.msg='Logement repris'+(du?' : +'+du+' 🪙 de loyers encaissés.':'.')}
  save();refreshHud();SFX.coin();renderDialog();
}
function encaisserLoyer(k){
  const b=batsRes()[k],d=G.dialog;if(!b||!b.loc)return;
  const du=loyerDu(b);
  if(!du){d.msg='Pas encore de loyer à encaisser : reviens un peu plus tard.';renderDialog();return}
  G.adv.pieces+=du;b.t0=Date.now();save();refreshHud();SFX.coin();d.msg='+'+du+' 🪙 de loyers encaissés.';renderDialog();
}
function demolirAnnuler(oui){const d=G.dialog;d.conf=!!oui;renderDialog()}
function demolirTerrain(k){
  const a=G.adv,d=G.dialog,B=batsRes(),b=B[k];if(!b||b.annexe!==undefined)return;
  let p=0,sv=0;
  for(let i=0;i<b.n;i++){const c=CATALOGUE[b.t].niv[i].cout;p+=c.pieces||0;sv+=c.savoir||0}
  p=Math.floor(p/2);sv=Math.floor(sv/2);
  if(b.loc)p+=loyerDu(b);
  B.forEach((x,j)=>{if(x&&x.annexe===k)B[j]=null});
  B[k]=null;if((a.maisRes||[])[k])a.maisRes[k]=0;
  a.pieces+=p;a.savoir=(a.savoir||0)+sv;d.conf=false;
  G.refaireVille=true;save();refreshHud();SFX.coin();
  d.msg='Construction démolie : +'+p+' 🪙 et +'+sv+' 🎓 récupérés. Le terrain est libre.';renderDialog();
}
function bitumerRoute(id,type,i){
  const c=coutRoute(type,i);
  openBox({kind:'route',id:id,type:type,i:i,msg:''});
}
function htmlRoute(d){
  const a=G.adv,c={cout:coutRoute(d.type,d.i)},m=manque(c);
  let h=`<h3>🛣 Route à bitumer</h3><p class="row"><span>Mes points de savoir</span><b>${a.savoir||0} 🎓</b></p><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p><p class="row"><span>Mon sac</span><b>${esc(texteSac())}</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  h+=`<p style="font-size:13px">Cette piste en terre devient une route goudronnée, plus belle et plus sûre pour toute la ville.</p>`
    +`<button class="${m.length?'':'p'}" onclick="payerRoute()">🛣 Bitumer ce tronçon<br><small>Coût : ${coutTexte(c.cout)}${m.length?' — il te manque : '+m.join(' · '):''}</small></button>`
    +`<p style="font-size:12px">Le bitume s’achète chez Maman Béa ou se récolte dans les mini-jeux.</p>`;
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function htmlRond(d){
  const a=G.adv,m=manque({cout:COUT_ROND});
  let h=`<h3>⛲ Rond-point du village</h3><p class="row"><span>Mes points de savoir</span><b>${a.savoir||0} 🎓</b></p><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p><p class="row"><span>Mon sac</span><b>${esc(texteSac())}</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  h+=`<p style="font-size:13px">Un rond-point avec fontaine au carrefour central relie le quartier résidentiel et les quartiers de missions.</p>`
    +`<button class="${m.length?'':'p'}" onclick="payerRond()">⛲ Construire le rond-point<br><small>Coût : ${coutTexte(COUT_ROND)}${m.length?' — il te manque : '+m.join(' · '):''}</small></button>`;
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function payerRond(){
  const a=G.adv,d=G.dialog;if(!d||d.kind!=='rond'||a.rond)return;
  const m=manque({cout:COUT_ROND});
  if(m.length){d.msg='Il te manque : '+m.join(' · ');SFX.ko();renderDialog();return}
  payer(COUT_ROND);a.rond=true;G.refaireVille=true;save();refreshHud();SFX.win();
  d.msg='Rond-point construit ! Ferme ce menu pour le voir.';renderDialog();
}
function payerRoute(){
  const a=G.adv,d=G.dialog;if(!d||d.kind!=='route')return;
  const c=coutRoute(d.type,d.i),m=manque({cout:c});
  if(m.length){d.msg='Il te manque : '+m.join(' · ');SFX.ko();renderDialog();return}
  payer(c);if(!a.pave)a.pave=[];if(!a.pave.includes(d.id))a.pave.push(d.id);
  G.refaireVille=true;save();refreshHud();SFX.win();
  d.msg='Route bitumée ! Ferme ce menu pour la voir.';renderDialog();
}
function bonusMJ(){closeDialog();setTimeout(startMJ,350)}
let mjJeu=null;
function startMJ(){
  if(G.mjBonus!==G.sc)return;
  if(G.mode!=='play'||!MJ[G.sc])return;
  G.mode='mj';G.joy.x=G.joy.y=0;G.key.x=G.key.y=0;resetKnob();hideBubble();
  mjJeu=lancer(G.sc,{host:$('world'),sfx:SFX,duree:window.__MJD||60,sexe:G.sexe,fin:(r)=>{
    if(r&&r!=='fermer'){
      G.mjBonus=null;if(W&&W.mjMark){W.group.remove(W.mjMark);W.mjMark=null}
      if(r.res&&r.n){stock()[r.res]=(stock()[r.res]||0)+r.n}
      if(r.pieces||r.n)gain(r.pieces,r.n);else save();
      refreshHud();
    }
    if(!r||r==='fermer'){mjJeu=null;G.mode='play'}
  }});
}
function sellMangoes(){
  const a=G.adv,n=a.mangues;
  if(!n)return;
  a.mangues=0;gain(n*2,0);SFX.coin();
  G.dialog.msg='Merci ! Tes '+n+' mangues sont vendues : +'+(n*2)+' pièces.';renderDialog();
}
function buy(k){
  const it=ITEMS[k],a=G.adv,d=G.dialog;
  if(a.items[k])return;
  if(a.pieces<it.p){d.msg='Il te manque '+(it.p-a.pieces)+' pièces pour : '+it.n+'.';SFX.ko();renderDialog();return}
  if(it.t&&a.tissu<it.t){d.msg='Il te faut du tissu wax. Le Directeur Mavungu en offre à la fin de la mission.';SFX.ko();renderDialog();return}
  a.pieces-=it.p;if(it.t)a.tissu-=it.t;
  a.items[k]=true;save();refreshHud();SFX.coin();
  d.msg='Achat réussi : '+it.n+' ! Elle est installée dans ta maison.';renderDialog();
  setTimeout(checkFin,0);
}
function checkFin(){
  if(G.adv.fin||!storyDone()||nbItems()<Object.keys(ITEMS).length)return;
  G.adv.fin=true;save();SFX.win();
  if(G.mode==='play'||G.mode==='dialog')openBox({kind:'info',title:'Félicitations !',i:0,lines:[
    G.nom+', tu as accompli la mission et meublé toute ta maison !',
    'Tu es un vrai champion de LEXARIS ACADÉMIE. Continue à réviser pour gagner trois étoiles partout.']});
}

// ---------- Menu ----------
function openMenu(){if(G.mode==='play'||G.mode==='pview')openBox({kind:'menu'})}
function htmlMenu(){
  const a=G.adv;
  const pu=photoUrl();
  return `<div class="hd">${pu?`<img class="pt" src="${pu}" alt="">`:''}<h3>${esc(G.nom)} · Niveau ${lvl()}</h3></div><p class="row"><span>Pièces</span><b>${a.pieces} 🪙</b></p><p class="row"><span>Tissu wax · mangues</span><b>${a.tissu} · ${a.mangues} 🥭</b></p>`
   +`<p class="row"><span>Mon sac de matériaux</span><b>${esc(texteSac())}</b></p>`
   +`<p class="row"><span>Réponses justes du premier coup</span><b>${a.good}/${a.total}</b></p>`
   +`<h4>Missions</h4>`+['lola','ilunga','junior','mavungu'].map(id=>{
      const s=a.stars[id]||0;
      const sb=a.scores&&a.scores[id]&&a.scores[id].best;
      return `<div class="row"><span>${esc(SUJETS[NPC[id].sujet])} · ${esc(NPC[id].name)}</span><b>${sb?sb.p+' sur '+sb.t:(a.done[id]?'fait':'—')}</b></div>`;
    }).join('')
   +`<h4>Ma maison</h4>`+Object.keys(ITEMS).map(k=>`<div class="row"><span>${esc(ITEMS[k].n)}</span><b>${a.items[k]?'✔':'—'}</b></div>`).join('')
   +`<p style="font-size:12px;margin-top:8px">${esc(objective())}</p>`
   +`<button class="p" onclick="closeDialog()">Fermer</button>`
   +`<button onclick="openCongo()">🇨🇩 Explorer le Congo : provinces et territoires</button>`
   +`<button onclick="openProg()">🎓 Missions scolaires</button>`
   +`<button onclick="openComp()">🗺 Carte des compétences${aReviser().length?' · 🔁 '+aReviser().length+' à réviser':''}</button>`
   +`<button onclick="openCarnet()">📒 Mon carnet de progression</button>`+AV.bouton()+ANI.bouton()+'<button onclick="musOuvrir()" style="background:linear-gradient(90deg,#7d3fd1,#e8a23a);color:#fff">🎵 MUSIQUE – Découvre, joue et compose !</button>'+'<button onclick="amDebut()" style="background:#d35400;color:#fff">🏗 Mode aménagement : tout déplacer</button>'+'<button onclick="spOuvrir()" style="background:#6a2fa0;color:#fff">🚀 Space Explorer (exploration spatiale)</button>'+'<button onclick="vilOuvrir()" style="background:#1b5e7a;color:#fff">🌆 Smart City (ville intelligente)</button>'+'<button onclick="fsOuvrir()" style="background:#e84393;color:#fff">👗 Fashion Studio (mode et coiffure)</button>'+'<button onclick="dsOuvrir()" style="background:#c9733d;color:#fff">🏠 Design Studio (maisons 3D)</button>'+'<button onclick="medOuvrir()" style="background:#0b6e6e;color:#fff">🏥 Medical Center (hôpital 3D)</button>'+'<button onclick="sciOuvrir()" style="background:#0f4c75;color:#fff">🔬 Science Lab (laboratoire 3D)</button>'+'<button onclick="detOuvrir()" style="background:#2b3f6b;color:#fff">🕵️ Agence de détectives (enquêtes en 3D)</button>'+MET.bouton()+SIM.bouton()+EN.boutons()
   +`<button onclick="openEsp()">👤 Mon compte : classe et sauvegarde</button>`
   +(autonome()?'':`<button onclick="installer()">📲 Installer l’application</button>`)
   +(G.ui==='photo'?'':`<button onclick="closeDialog();openMap()">🗺 Carte des lieux</button>`)
   +(G.ui==='photo'?`<button onclick="openCreatorFromPhoto()">🧍 Mon personnage (visage, tenue)</button>`:'')
   +`<button onclick="openProfile()">📷 Ma photo de profil</button>`
   +`<button onclick="cycleQuality()">Qualité graphique : ${QNAME[QUALITY]}</button>`
   +`<button onclick="toggleSound()">Son : ${G.sound?'activé':'coupé'}</button>`
   +`<button onclick="toggleMusic()">Musique : ${G.sound&&G.music!==false?'activée':'coupée'}</button>`
   +`<button onclick="toggleVoice()">Lecture à voix haute : ${G.voice?'activée':'coupée'}</button>`
   +`<button class="s" onclick="quitterJeu()">🚪 ${G.dialog&&G.dialog.confirmQuit?'Appuie encore pour quitter le jeu':'Quitter le jeu'}</button>`
   +`<button class="s" onclick="resetGame()">${G.dialog&&G.dialog.confirmReset?'Appuie encore pour tout effacer':'Recommencer une nouvelle partie'}</button>`;
}
function toggleMusic(){G.music=G.music===false;if(G.music&&!G.sound)G.sound=true;save();majMusique();renderDialog()}
function toggleSound(){G.sound=!G.sound;save();majMusique();if(G.ui==='photo'){if(G.sound)PM.ambientOn();else PM.ambientOff()}renderDialog()}
function toggleVoice(){G.voice=!G.voice;if(!G.voice)stopSpeech();save();renderDialog()}
function quitterJeu(){
  if(!G.dialog.confirmQuit){G.dialog.confirmQuit=true;renderDialog();return}
  try{save()}catch(e){}
  try{window.close()}catch(e){}
  setTimeout(()=>location.reload(),150);   // si la fenêtre ne peut pas se fermer : retour à la page d'accueil, partie sauvegardée
}
window.quitterJeu=quitterJeu;
let resetArmed=false;
function resetGame(){
  if(!resetArmed){resetArmed=true;G.dialog.confirmReset=true;renderDialog();return}
  sansFlush=true;
  try{const a=lireBrut(KEY);if(a&&a.nom)ecrireCopie(KB+'R',a);localStorage.removeItem(KEY)}catch(e){}
  location.reload();
}

// ---------- Mini-jeu : cueillette de mangues ----------
function startMini(){
  G.mode='mini';G.mini={t:20,caught:0,list:[],sp:0};hideBubble();
  mangoGroup=new THREE.Group();scene.add(mangoGroup);
  canopy(false);
  toast('Touche les mangues qui tombent !');
}
const mangoMat=new THREE.MeshStandardMaterial({color:0xf0a51c,roughness:.5});
const mangoGeo=new THREE.SphereGeometry(.17,12,10);
function tickMini(dt){
  const m=G.mini,tr=W.mangoTree;
  m.t-=dt;m.sp-=dt;
  if(m.sp<=0){
    m.sp=.5+Math.random()*.4;
    const a=Math.random()*6.28,r=Math.random()*3.4;
    const mesh=new THREE.Mesh(mangoGeo,mangoMat);mesh.scale.set(1.5,1.9,1.5);mesh.castShadow=true;
    mesh.position.set(tr.x+Math.cos(a)*r,6.2,tr.z+Math.sin(a)*r);
    mangoGroup.add(mesh);m.list.push({mesh:mesh,v:0});
  }
  m.list=m.list.filter(o=>{
    o.v+=7*dt;o.mesh.position.y-=o.v*dt;o.mesh.rotation.x+=dt*4;
    const p=o.mesh.position;
    if(p.y<1.9&&p.y>.2&&dist(p.x,p.z,G.x,G.z)<.95){m.caught++;SFX.coin();mangoGroup.remove(o.mesh);return false}
    if(p.y<=.17){p.y=.17;o.v=0;o.gone=(o.gone||0)+dt;if(o.gone>.5){mangoGroup.remove(o.mesh);return false}}
    return true;
  });
  $('info').textContent='Touche les mangues ! Attrapées : '+m.caught+' · temps : '+Math.max(0,Math.ceil(m.t))+' s';
  if(m.t<=0)endMini();
}
// toucher une mangue à l'écran : la plus proche du doigt (dans un rayon généreux) est cueillie
function toucherMangue(px,py){
  const m=G.mini;if(!m)return;
  const r=cv.getBoundingClientRect();let meilleur=null,dm=64;
  m.list.forEach(o=>{
    const v=o.mesh.position.clone().project(camera);if(v.z>1)return;
    const sx=r.left+(v.x+1)/2*r.width,sy=r.top+(1-v.y)/2*r.height,d=Math.hypot(sx-px,sy-py);
    if(d<dm){dm=d;meilleur=o}
  });
  if(meilleur){m.caught++;SFX.coin();mangoGroup.remove(meilleur.mesh);m.list=m.list.filter(o=>o!==meilleur);
    $('info').textContent='Mangues attrapées : '+m.caught+' · temps : '+Math.max(0,Math.ceil(m.t))+' s'}
}
function canopy(v){W.mangoTree.obj.children.forEach(c=>{if(c.userData.canopy)c.visible=v})}
function endMini(){
  const c=G.mini.caught;canopy(true);
  scene.remove(mangoGroup);mangoGroup=null;G.mini=null;G.mode='play';
  G.adv.mangues+=c;save();
  toast(c?'+'+c+' mangues dans ton panier ! Vends-les à Maman Béa.':'Aucune mangue cette fois…');
  if(c)SFX.win();
  gain(0,c);refreshHud();
}

// ---------- Commandes : joystick, clavier, caméra ----------
const joy=$('joy'),knob=$('knob');let joyId=null;
function resetKnob(){joyId=null;knob.style.transform='translate(0,0)';G.joy.x=G.joy.y=0}
function joyMove(e){
  const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,R=r.width/2-4;
  let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy);
  if(d>R){dx=dx/d*R;dy=dy/d*R}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  G.joy.x=dx/R;G.joy.y=-dy/R;
}
joy.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId){e.preventDefault();joyMove(e)}});
['pointerup','pointercancel','lostpointercapture'].forEach(ev=>joy.addEventListener(ev,e=>{if(e.pointerId===joyId)resetKnob()}));
// glisser sur la scène : orienter la caméra ; pincer ou molette : zoom ; toucher une réponse en mission
const ptrs=new Map();let camPtr=null,lastX=0,lastY=0,pinchD=0,tapX=0,tapY=0,tapT=0,tapMove=0;
const camOk=()=>G.mode==='play'||G.mode==='mini'||G.mode==='creator'||G.mode==='m3d'||(G.mode==='cond'&&G.cond&&G.cond.etat==='question');
cv.addEventListener('pointerdown',e=>{
  if(!camOk())return;
  ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});cv.setPointerCapture(e.pointerId);
  if(ptrs.size===1){camPtr=e.pointerId;lastX=e.clientX;lastY=e.clientY;tapX=e.clientX;tapY=e.clientY;tapT=performance.now();tapMove=0}
  else if(ptrs.size===2){const a=[...ptrs.values()];pinchD=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);tapMove=99}
});
cv.addEventListener('pointermove',e=>{
  if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===2&&G.mode==='m3d'){
    const a=[...ptrs.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);
    if(pinchD>0)G.camOverride=clamp(4,16,(G.camOverride||7.4)*pinchD/Math.max(1,d));
    pinchD=d;return;
  }
  if(e.pointerId!==camPtr)return;
  tapMove+=Math.abs(e.clientX-lastX)+Math.abs(e.clientY-lastY);
  if(G.mode==='creator'){CR.ang-=(e.clientX-lastX)*.012}
  else{G.phi+=(e.clientX-lastX)*.006;G.pitch=clamp(.12,1.2,G.pitch+(e.clientY-lastY)*.004)}
  lastX=e.clientX;lastY=e.clientY;
});
['pointerup','pointercancel'].forEach(ev=>cv.addEventListener(ev,e=>{
  const etait=ptrs.has(e.pointerId);ptrs.delete(e.pointerId);
  if(ptrs.size<2)pinchD=0;
  if(e.pointerId===camPtr){
    camPtr=null;
    if(ev==='pointerup'&&etait&&tapMove<14&&performance.now()-tapT<450){
      if(G.mode==='m3d')toucherReponse(e.clientX,e.clientY);
      else if(G.mode==='cond')toucherCond(e.clientX,e.clientY);
      else if(G.mode==='mini')toucherMangue(e.clientX,e.clientY);
    }
  }
}));
cv.addEventListener('wheel',e=>{if(G.mode==='m3d'){e.preventDefault();G.camOverride=clamp(4,16,(G.camOverride||7.4)*(1+Math.sign(e.deltaY)*.08))}},{passive:false});
const held={};
const kmap={ArrowUp:'u',w:'u',z:'u',ArrowDown:'d',s:'d',ArrowLeft:'l',a:'l',q:'l',ArrowRight:'r',d:'r'};
function keyVec(){G.key.y=(held.u?1:0)-(held.d?1:0);G.key.x=(held.r?1:0)-(held.l?1:0)}
document.addEventListener('keydown',e=>{
  if(e.target&&e.target.tagName==='INPUT')return;
  if(kmap[e.key]){held[kmap[e.key]]=true;keyVec();e.preventDefault()}
  if(G.mode==='cond'&&G.cond&&G.cond.etat==='question'&&/^[1-4]$/.test(e.key)){answerCond(G.cond.ordre[+e.key-1]);return}
  if(G.mode!=='play'&&G.mode!=='mini')return;
  if(e.key==='e'||e.key==='Enter'||e.key===' '){e.preventDefault();act()}
  if(e.key==='m')openMenu();
  if(e.key==='ArrowLeft'&&e.shiftKey)G.phi-=.1;
});
document.addEventListener('keyup',e=>{if(kmap[e.key]){held[kmap[e.key]]=false;keyVec()}});
let runAct=null;
function act(){if(G.mode==='mini')return endMini();if(G.mode==='play'&&runAct)runAct()}
$('ba').addEventListener('click',act);
$('menu').addEventListener('click',openMenu);

// ---------- Boucle ----------
let last=performance.now(),tt=0,stepT=0,autoT=3,autoIdx=0;
function angDiff(a,b){let d=b-a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d}
// ---------- Mini-carte (GPS) ----------
let mmBig=false,mmLast=0;
function missionTarget(){
  const a=G.adv.done;let ts=null,tn=null;
  if(!a.lola){ts='ville';tn='lola'}
  else if(!a.ilunga){ts='classe';tn='ilunga'}
  else if(!a.junior){ts='classe';tn='junior'}
  else if(!a.mavungu){ts='classe';tn='mavungu'}
  else{
    for(let i=1;i<STAGES.length;i++){const st=STAGES[i];if(st.libre)continue;if(!stageDone(st)){ts=st.scene;tn=st.npcs.find(k=>!a[k])||st.npcs[0];break}}
  }
  if(!ts)return null;
  if(G.sc===ts&&NPC[tn])return {x:NPC[tn].x,z:NPC[tn].z,label:NPC[tn].short||NPC[tn].name,kind:'npc'};
  const S=SCENES[G.sc];
  if(G.sc==='ville'){
    const d=S.doors.find(d=>d.to===ts);
    if(d)return {x:d.x,z:d.z,label:d.label,kind:'door'};
    const sp=(S.spots||[]).find(s=>s.label==='Carte des lieux');
    if(sp)return {x:sp.x,z:sp.z,label:'Panneau « Carte des lieux »',kind:'sign'};
  }
  const d=(S.doors||[])[0];
  return d?{x:d.x,z:d.z,label:d.label||'Sortie',kind:'door'}:null;
}
function drawMini(now){
  const cvm=$('mm'),w=$('mmw');
  if(!w||w.classList.contains('hide'))return;
  if(G.mode==='mini'||(G.mode==='cond'&&G.cond&&G.cond.etat==='question')||G.mode==='m3d'||G.sc==='arene'||G.ui==='photo'){w.style.display='none';return}
  w.style.display='';
  if(now-mmLast<90)return;mmLast=now;
  const B=W.bounds,bw=B.x1-B.x0,bh=B.z1-B.z0,cw=cvm.clientWidth||150;
  const ch=Math.round(Math.max(.45*cw,Math.min(1.05*cw,cw*bh/bw)));
  const px=cw*2,py=ch*2;if(cvm.width!==px||cvm.height!==py){cvm.width=px;cvm.height=py}
  const c=cvm.getContext('2d'),pad=10,sc=Math.min((px-pad*2)/bw,(py-pad*2)/bh);
  const ox=(px-bw*sc)/2-B.x0*sc,oz=(py-bh*sc)/2-B.z0*sc;
  const X=x=>ox+x*sc,Z=z=>oz+z*sc;
  c.clearRect(0,0,px,py);
  c.fillStyle='rgba(30,60,40,.55)';c.fillRect(X(B.x0),Z(B.z0),bw*sc,bh*sc);
  c.fillStyle='rgba(205,190,160,.75)';
  (W.boxes||[]).forEach(b=>c.fillRect(X(b.x0),Z(b.z0),Math.max(2,(b.x1-b.x0)*sc),Math.max(2,(b.z1-b.z0)*sc)));
  c.fillStyle='rgba(120,180,110,.8)';
  (W.colliders||[]).forEach(o=>{const r=Math.max(1.5,Math.min(4,o.r*sc*.6));c.beginPath();c.arc(X(o.x),Z(o.z),r,0,6.3);c.fill()});
  const S=SCENES[G.sc];
  (S.doors||[]).forEach(d=>{c.fillStyle='#4fd18b';c.fillRect(X(d.x)-5,Z(d.z)-5,10,10)});
  (S.spots||[]).forEach(s=>{c.fillStyle='#8ec9ff';c.save();c.translate(X(s.x),Z(s.z));c.rotate(.785);c.fillRect(-4,-4,8,8);c.restore()});
  const tg=missionTarget(),pulse=(Math.sin(now/260)+1)/2;
  Object.keys(NPC).concat(Object.keys(AUTOP)).forEach(id=>{const n=NPC[id]||AUTOP[id];if(n.sc!==G.sc)return;
    c.fillStyle=G.adv.done[id]?'#9aa5b1':'#ffd34a';c.beginPath();c.arc(X(n.x),Z(n.z),4,0,6.3);c.fill()});
  const pxp=X(G.x),pzp=Z(G.z);
  if(tg){
    const tx=X(tg.x),tz=Z(tg.z);
    c.strokeStyle='rgba(255,90,80,.85)';c.lineWidth=2;c.setLineDash([6,6]);c.beginPath();c.moveTo(pxp,pzp);c.lineTo(tx,tz);c.stroke();c.setLineDash([]);
    c.fillStyle='#ff4d4d';c.beginPath();c.arc(tx,tz,6,0,6.3);c.fill();
    c.strokeStyle='rgba(255,90,80,'+(.9-pulse*.6)+')';c.lineWidth=3;c.beginPath();c.arc(tx,tz,8+pulse*10,0,6.3);c.stroke();
  }
  c.save();c.translate(pxp,pzp);c.rotate(G.phi);
  c.fillStyle='#fff';c.strokeStyle='#0b5fa5';c.lineWidth=2.5;c.beginPath();c.moveTo(11,0);c.lineTo(-7,7);c.lineTo(-3,0);c.lineTo(-7,-7);c.closePath();c.fill();c.stroke();c.restore();
  $('mml').textContent=tg?'🎯 '+tg.label+' · '+Math.round(dist(G.x,G.z,tg.x,tg.z))+' m':'Explore librement';
}
$('mm').addEventListener('click',()=>{mmBig=!mmBig;$('mmw').classList.toggle('big',mmBig);mmLast=0});
$('mmb').addEventListener('click',()=>{if(G.mode==='play')openMap()});
function loop(now){
  requestAnimationFrame(loop);
  const dt=Math.min(.05,(now-last)/1000);last=now;tt+=dt;
  if(!W||(G.ui==='photo'&&G.mode!=='creator'))return;
  drawMini(now*1);
  if(G.chute)chuteStep(dt);
  const playing=!G.chute&&(G.mode==='play'||G.mode==='mini'||G.mode==='m3d');
  if(G.mode==='cond')condTick(dt);
  if(((tt*4)|0)!==vehT){vehT=(tt*4)|0;majVeh()}
  // déplacement
  let sp=0;
  if(playing){
    const ix=G.joy.x+G.key.x,iy=G.joy.y+G.key.y;
    const mag=Math.min(1,Math.hypot(ix,iy));
    let auto=null;
    if(G.auto){
      if(mag>.1||G.mode!=='m3d')G.auto=null;
      else{const ax=G.auto.x-G.x,az=G.auto.z-G.z,ad=Math.hypot(ax,az);if(ad<.3)G.auto=null;else auto={mx:ax/ad,mz:az/ad}}
    }
    if(G.monte&&G.sc==='ville'){
      // conduite : accélérateur et frein (avant/arrière), direction (gauche/droite)
      const vmax=G.monte==='moto'?15:14;
      let v=G.vv||0;
      const vol=commandeVolant(),cb=niveauCarb(G.monte);
      if(vol&&!G.wheelHeld)G.wheel=(G.wheel||0)*(1-Math.min(1,dt*7));
      const sIn=Math.max(-1,Math.min(1,ix+(vol?(G.wheel||0):0)));
      let th=Math.max(-1,Math.min(1,iy+(vol?(G.ped||0):0)));
      if(cb<=0&&!(th<0&&v>.1))th=0;   // réservoir vide : plus d'accélération
      if(vol){const vl=$('vol');if(vl)vl.style.transform='rotate('+((G.wheel||0)*120).toFixed(1)+'deg)'}
      if(th>.05)v+=(v<0?14:6)*th*dt;
      else if(th<-.05)v-=(v>0?14:4)*(-th)*dt;
      else v-=Math.sign(v)*Math.min(Math.abs(v),4*dt);
      v=Math.max(-4,Math.min(vmax,v));
      G.steer=(G.steer||0)+(sIn-(G.steer||0))*Math.min(1,dt*8);
      G.ry-=G.steer*1.7*Math.min(1,Math.abs(v)/4)*dt*(v<0?-1:1);
      const nx=G.x+Math.sin(G.ry)*v*dt,nz=G.z+Math.cos(G.ry)*v*dt;
      const [cx,cz]=collide(nx,nz);
      if(Math.abs(cx-nx)>1e-4||Math.abs(cz-nz)>1e-4)v*=-.25;
      G.x=cx;G.z=cz;G.vv=v;sp=Math.abs(v);
      if(cb>0){
        const nc=cb-sp*dt*100/CARB[G.monte].m;fixerCarb(G.monte,nc);
        if(nc<=0){G.alerteCarb=true;toast('⛽ Panne sèche ! Descends du véhicule et rends-toi à une station-service.');SFX.ko()}
        else if(nc<=15&&!G.alerteCarb){G.alerteCarb=true;toast('⛽ Il reste peu de carburant : va à la station-service !')}
        else if(nc>15)G.alerteCarb=false;
      }
      G.phi+=angDiff(G.phi,Math.PI/2-G.ry)*Math.min(1,dt*2.5);
      stepT+=dt*sp;if(stepT>.5&&sp>2){stepT=0}
    }else if(mag>.1||auto){
      let mx,mz;
      if(auto){mx=auto.mx;mz=auto.mz;sp=3.6}
      else{
        const fx=Math.cos(G.phi),fz=Math.sin(G.phi),rx=-fz,rz=fx;
        mx=fx*iy+rx*ix;mz=fz*iy+rz*ix;const ml=Math.hypot(mx,mz);mx/=ml;mz/=ml;
        sp=mag<.7?mag/.7*2.5:2.5+(mag-.7)/.3*2.1;
      }
      const [nx,nz]=collide(G.x+mx*sp*dt,G.z+mz*sp*dt);
      G.x=nx;G.z=nz;
      const tr=Math.atan2(mx,mz);G.ry+=angDiff(G.ry,tr)*Math.min(1,dt*12);
      G.lean=auto?0:ix*Math.min(1,mag);
      stepT+=dt*sp;if(stepT>1.2){stepT=0;SFX.step()}
    }
  }
  if(sp===0)G.lean=0;
  G.speed=sp;
  playerObj.position.set(G.x,0,G.z);playerObj.rotation.y=G.ry;
  let assis=false;
  if(G.chute){
    const c=G.chute,a=c.t<.35?c.t/.35:c.t>c.dur-.7?Math.max(0,(c.dur-c.t)/.7):1;
    playerObj.rotation.order='YXZ';playerObj.rotation.x=-Math.PI/2*a*.97;playerObj.position.y=.18*a;
  }
  if(G.sc==='conduite')playerObj.visible=false;
  else if(G.monte&&vehObjs[G.monte]){
    const vo=vehObjs[G.monte],ud=vo.userData,st=G.steer||0,co=Math.cos(G.ry),si=Math.sin(G.ry);
    vo.position.set(G.x,0,G.z);vo.rotation.y=G.ry;
    if(ud.volant)ud.volant.rotation.z=-st*1.5;
    if(ud.avant)ud.avant.forEach(w=>w.rotation.y=-st*.45);
    if(ud.guidon)ud.guidon.rotation.y=-st*.5;
    const sd=ud.siege;playerObj.position.set(G.x+sd.x*co+sd.z*si,sd.y,G.z-sd.x*si+sd.z*co);playerObj.visible=true;assis=true;
  }
  ANI.maj(dt,tt);
  playerObj.userData.update(dt,{speed:G.monte?0:sp,sit:assis,pose:G.mode==='creator'?'creator':'',cam:camera.position,lean:G.lean||0});
  // PNJ
  Object.keys(npcObjs).forEach(id=>{
    const o=npcObjs[id],n=o.n;
    const d=dist(G.x,G.z,n.x,n.z);
    const talking=G.dialog&&G.dialog.id===id&&G.mode==='dialog';
    let tr=n.ry||0;
    if(!n.sit&&(talking||d<5))tr=Math.atan2(G.x-n.x,G.z-n.z);
    if(n.sit&&talking)tr=Math.atan2(G.x-n.x,G.z-n.z)*.3+(n.ry||0)*.7;
    o.ry+=angDiff(o.ry,tr)*Math.min(1,dt*5);
    o.obj.rotation.y=o.ry;
    if(o.wave>0)o.wave-=dt;
    o.obj.userData.update(dt,{cam:camera.position,talk:talking||(!!AUTOP[id]&&bub&&bub.who===id),wave:o.wave>0,sit:!!n.sit});
  });
  W.update(dt,tt,{open:doorOpen()});if(W.mjMark)W.mjMark.userData.update(tt);
  // soleil qui suit le joueur
  sun.position.set(G.x+rig.sunDir.x*70,rig.sunDir.y*70,G.z+rig.sunDir.z*70);sun.target.position.set(G.x,0,G.z);
  if(G.mode==='cine')cineStep(dt);
  else if(G.mode==='creator'){
    const P=playerObj.position,ww=$('world').clientWidth,hh=$('world').clientHeight,land=ww>hh*1.25;
    if(camera.fov!==30){camera.fov=30;camera.updateProjectionMatrix()}
    const a=CR.ang,d=2.35,tp=new THREE.Vector3(P.x+Math.sin(a)*d,1.45,P.z+Math.cos(a)*d);
    camera.position.lerp(tp,1-Math.exp(-dt*8));camera.lookAt(P.x,1.08,P.z);
    if(land)camera.setViewOffset(ww,hh,ww*.2,0,ww,hh);else camera.clearViewOffset();
  }
  else if(G.mode==='start'){const a=tt*.08;camera.position.set(8+Math.cos(a)*34,9,2+Math.sin(a)*22);camera.lookAt(10,2,-2)}
  else updateCamera(dt);
  rig.follow();
  if(G.mode==='m3d'&&M3.actif())M3.mettreAJour(dt,tt,{x:G.x,z:G.z});
  // porte de sortie de l'arène : proposer de rentrer au quartier
  if(G.sc==='arene'&&G.mode==='m3d'){
    const dp=Math.hypot(G.x,G.z-14.3);
    if(dp<1.9&&!G.sortieDemandee){G.sortieDemandee=true;G.auto=null;G.joy.x=G.joy.y=0;$('sortie').classList.remove('hide')}
    else if(dp>3.4)G.sortieDemandee=false;
  }
  // interactions
  if(G.mode==='play'){
    const tg=nearby();
    const npcT=tg.find(t=>t.t==='npc');
    if(npcT&&G.near!==npcT.id){
      G.near=npcT.id;
      if(!G.greeted[npcT.id]){G.greeted[npcT.id]=true;npcObjs[npcT.id].wave=2.4;bubble('Bonjour '+esc(G.nom)+' !',NPC[npcT.id].x,NPC[npcT.id].z,NPC[npcT.id].look.h*1.95,3000)}
    }
    if(!npcT&&G.near){G.near=null}
    const a=actionFor(tg[0]);
    runAct=a.run;
    const b=$('ba');b.disabled=!a.enabled;
    const label=$('alabel');if(label.textContent!==a.label)label.textContent=a.label;
    // bavardage des enfants
    autoT-=dt;
    if(autoT<=0){
      autoT=5;
      if(G.sc==='ville'&&!G.near&&!bub){
        const e=AUTO[autoIdx%AUTO.length];autoIdx++;
        const p=e[0]==='Jérémie'?AUTOP.jer:AUTOP.kasa;
        if(dist(G.x,G.z,p.x,p.z)<16){bubble('<b>'+esc(e[0])+'</b> : '+esc(e[1]),p.x,p.z,p.look.h*1.95,4200)}
      }
    }
  }else if(G.mode==='mini'){
    tickMini(dt);
    $('alabel').textContent='Arrêter la cueillette';$('ba').disabled=false;
  }
  placeBubble();
  rig.render();
}

// ---------- Cinématique d'introduction ----------
function startCine(){
  G.mode='cine';G.cine={t:0,dur:9};
  ['joy','actwrap','top','info','mmw'].forEach(i=>$(i).classList.add('hide'));
  $('cine').classList.remove('hide');$('skip').classList.remove('hide');
  G.sc='ville';G.x=-13;G.z=0.5;G.phi=0;buildScene();
}
function cineStep(dt){
  const c=G.cine;c.t+=dt;
  const k=Math.min(1,c.t/c.dur),e=k*k*(3-2*k);
  // survol : de l'école vers le joueur
  const a=new THREE.Vector3(60,16,22),b=new THREE.Vector3(10,10,26),f=camDesired(camDist());
  let p;
  if(k<.6){const u=k/.6,s=u*u*(3-2*u);p=a.clone().lerp(b,s)}
  else{const u=(k-.6)/.4,s=u*u*(3-2*u);p=b.clone().lerp(f,s)}
  camera.position.copy(p);
  const look=new THREE.Vector3(30,3,-4).lerp(camTarget(),clamp(0,1,(k-.45)/.55));
  camera.lookAt(look);
  if(c.t>=c.dur)endCine();
}
function endCine(){
  G.cine=null;G.mode='play';
  ['joy','actwrap','top','info','mmw'].forEach(i=>$(i).classList.remove('hide'));
  $('cine').classList.add('hide');$('skip').classList.add('hide');
  G.x=-22;G.z=-3.6;G.phi=-Math.PI/2;G.ry=Math.PI;buildScene();
  snapCamera();refreshHud();
  openBox({kind:'info',title:'Bienvenue, '+G.nom+' !',i:0,lines:[
    'Tu es devant ta maison, dans ton village. Déplace-toi avec le joystick à gauche, et fais glisser ton doigt sur l’écran pour tourner la caméra.',
    'L’école LEXARIS ACADÉMIE est tout à droite. Mama Lola garde le portail : réponds à ses questions pour entrer.',
    'En chemin, cueille des mangues au manguier, vends-les à Maman Béa et meuble ta maison.']});
}
$('skip').addEventListener('click',()=>{if(G.mode==='cine')endCine()});

// ---------- Niveaux et carte ----------
const stageDone=st=>st.npcs.every(doneNpc);
const stageUnlocked=i=>i===0||!!STAGES[i].libre||accesLibre(STAGES[i])||stageDone(STAGES[i-1]);
function stageStars(st){return st.npcs.reduce((a,id)=>a+(G.adv.stars[id]||0),0)}
// ---------- Missions scolaires (programme) ----------
function openProg(){openBox({kind:'prog',niv:null,mat:null})}
function progScore(k){const s=G.adv.scores&&G.adv.scores[k];return s&&s.best?s.best:null}
function progCount(niv,mat){
  let f=0,t=0;
  niv.matieres.forEach(m=>{if(mat&&m!==mat)return;m.missions.forEach((x,i)=>{t++;if(G.adv.done['cur:'+missionCle(niv.id,m.id,i)])f++})});
  return f+'/'+t;
}
function htmlProg(d){
  const niv=PROGRAMME.find(n=>n.id===d.niv),mat=niv&&niv.matieres.find(m=>m.id===d.mat);
  let h=`<div class="hd"><h3>🎓 Missions scolaires</h3></div>`;
  if(!niv){
    h+='<p style="font-size:13px">Choisis ta classe. Chaque mission t’explique une notion puis te pose quelques questions.</p>';
    h+=PROGRAMME.map(n=>`<button onclick="progGo('${n.id}')">${esc(n.nom)} · ${progCount(n)}</button>`).join('');
  }else if(!mat){
    h+=`<p><b>${esc(niv.nom)}</b></p>`+niv.matieres.map(m=>`<button onclick="progGo('${niv.id}','${m.id}')">${esc(m.nom)} · ${progCount(niv,m)}</button>`).join('');
    h+=`<button class="s" onclick="progGo()">← Changer de classe</button>`;
  }else{
    h+=`<p><b>${esc(niv.nom)} · ${esc(mat.nom)}</b></p>`;
    h+=mat.missions.map((t,i)=>{
      const k=missionCle(niv.id,mat.id,i),has=!!CONTENU[k],st=progScore(k);
      return has?`<button onclick="startMission('${niv.id}','${mat.id}',${i})">${st?'<b>'+st.p+' sur '+st.t+'</b>':'▶'} · Mission ${i+1} · ${esc(t)}</button>`
               :`<button disabled>🔒 Mission ${i+1} · ${esc(t)} (bientôt)</button>`}).join('');
    h+=`<button class="s" onclick="progGo('${niv.id}')">← Matières</button>`;
  }
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function progGo(n,m){const d=G.dialog;d.niv=n||null;d.mat=m||null;renderDialog()}
function progBack(){quitterArene();const d=G.dialog;openBox({kind:'prog',niv:d.backNiv,mat:d.backMat})}
function startMission(nid,mid,i,opt){
  opt=opt||{};
  const niv=PROGRAMME.find(n=>n.id===nid),mat=niv.matieres.find(m=>m.id===mid),k=missionCle(nid,mid,i),c=CONTENU[k];
  if(!c)return;
  const n={name:'Mission '+(i+1)+' · '+mat.missions[i],role:niv.nom+' · '+mat.nom,intro:c.intro,outro:'Mission accomplie ! Bravo, tu as bien travaillé.'};
  const m3d=G.ui==='3d';
  if(m3d)entrerArene(mat.id);
  openBox({kind:'quiz',id:'cur:'+k,m3d:m3d,collecte:c.collecte||null,assign:opt.assignment||null,preview:!!opt.apercu,backEsp:opt.retourEsp?'mm':(opt.apercu?'ens':''),n:n,classe:mat.nom+' · '+niv.nom+' · mission '+(i+1)+' : '+mat.missions[i],portrait:'ilunga',voice:'ilunga',back:true,backNiv:nid,backMat:mid,jeux:c.jeux||null,ji:0,j:null,rev:false,stage:'lines',i:0,qi:0,qs:c.qs.slice(),opts:null,bad:[],qerr:false,errs:0,firsts:0,gain:0,res:null});
}

// ---------- Comptes, classes et missions de classe ----------
const aProgression=()=>Object.keys(G.adv.done).length>0||G.adv.pieces>0;
function appliquerSave(s){
  G.nom=s.nom;G.ui='3d';G.photo=s.photo||null;G.real=s.real===undefined?null:s.real;G.voice=s.voice!==false;G.sound=s.sound!==false;G.music=s.music!==false;
  G.look=Object.assign({},DEFAULT_LOOK,{acc:[]},s.look||{});G.sexe=G.look.s;G.adv=Object.assign(newAdv(),s.adv||{});
  try{localStorage.setItem(KEY,JSON.stringify(getSave()))}catch(e){}
  $('nom').value=G.nom;$('cont').textContent='Continuer · '+G.nom+' (niveau '+lvl()+')';$('cont').classList.remove('hide');
  $('go').textContent='Nouvelle partie';$('go').className='p';
  if(G.mode!=='start'){buildScene();refreshHud()}
}
const Esp=makeEspace({G,esc,renderDialog,toast:t=>toast(t),lire:t=>{const w=G.voice;G.voice=true;speak(t,'ilunga');G.voice=w},PROGRAMME,CONTENU,missionCle,startMission:(a,b,c,o)=>startMission(a,b,c,o),getSave,applySave:appliquerSave,aProgression});
// collections, surprise du jour et événement du jour
const EN=creerEnrichissement({G,esc,toast:t=>toast(t),save,gain,SFX,renderDialog:()=>renderDialog(),openBox:d=>openBox(d),openMenu:()=>openMenu(),PROVS,slugTr});
const parlerFr=(t,force)=>{if(force){const w=G.voice;G.voice=true;speak(t,'ilunga');G.voice=w}else speak(t,'ilunga')};
const AV=creerAventures({G,esc,save,gain,SFX,renderDialog:()=>renderDialog(),openBox:d=>openBox(d),closeDialog:()=>closeDialog(),goTo:d=>goTo(d),parler:parlerFr,toast:t=>toast(t),monde:()=>W});
// quiz dans la salle de réponses (les réponses flottent, comme dans les missions scolaires) ; q : {q,c:[choix],a:index,exp}
function lancerQuiz3D(o){
  // la réponse attendue est le TEXTE de la bonne réponse (comme dans les missions scolaires) ; intro : tableau de phrases
  const qs=o.qs.map(q=>({q:q.q,c:q.c.slice(),a:typeof q.a==='number'?q.c[q.a]:q.a,exp:q.exp}));
  CONTENU[o.cle]={intro:[o.intro],qs:qs};
  const n={name:o.titre,role:o.titre,intro:[o.intro],outro:'Bravo, tu as terminé !'};
  const m3d=G.ui==='3d';
  if(m3d)entrerArene(o.mat||'geo');
  openBox({kind:'quiz',id:o.cle,m3d:m3d,collecte:null,assign:null,preview:false,backEsp:'',n:n,classe:o.titre,portrait:'ilunga',voice:'ilunga',back:false,backNiv:'',backMat:'',jeux:null,ji:0,j:null,rev:false,stage:'lines',i:0,qi:0,qs:qs,opts:null,bad:[],qerr:false,errs:0,firsts:0,gain:0,res:null});
  // pas de texte lettre par lettre : on lit l'introduction à voix haute et on entre directement dans la salle de réponses
  if(m3d){parlerFr(o.intro);G.dialog.i=1;lancerMission3D(G.dialog)}
}
function changerEtageMusee(delta){const k=(G.int.n||1)+delta;G.int.n=Math.max(1,Math.min(G.int.t==='supermarche'?3:G.int.t==='centre'?3:NB_NIVEAUX_MUSEE,k));goTo({to:'interieur',tx:0,tz:0,phi:-Math.PI/2});}
const MUSEE=creerMusee({G,esc,save,gain,SFX,toast:t=>toast(t),openBox:d=>openBox(d),parler:parlerFr,quiz3D:lancerQuiz3D,changerEtage:changerEtageMusee});
const ANI=creerAnimaux({G,esc,openBox:d=>openBox(d),renderDialog:()=>renderDialog(),SFX,save,gain,parler:parlerFr,scene,refreshHud});
const CC=creerCentre({G,esc,metiers:dim=>MET.spots(dim),animalerie:()=>ANI.actions.aniAnimalerie(),openBox:d=>openBox(d),renderDialog:()=>renderDialog(),SFX,save,refreshHud,parler:parlerFr,openShop:()=>openShop(),boutiqueMode:()=>{closeDialog();openCreator('play')},changerEtage:changerEtageMusee});
const MET=creerMetiers({G,esc,openBox:d=>openBox(d),renderDialog:()=>renderDialog(),SFX,save,refreshHud,parler:parlerFr,quiz3D:lancerQuiz3D});
const SIM=creerSimulateurs({G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),renderDialog:()=>renderDialog(),quiz3D:lancerQuiz3D,toast:t=>toast(t),modules:()=>MET.modules()});
const MUSIC=creerMusique({G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});
const MUSACT=creerJeuxMusique(MUSIC,{G,esc,SFX,save,refreshHud,parler:parlerFr,toast:t=>toast(t)});
const RES=creerReseau({G,esc,openBox:d=>openBox(d),renderDialog:()=>renderDialog(),SFX,save,refreshHud,parler:parlerFr,toast:t=>toast(t)});
const AMEN=creerAmenager({G,esc,SFX,save,refreshHud,parler:parlerFr,toast:t=>toast(t),getW:()=>W,getCamera:()=>camera,getCanvas:()=>cv,rebuild:()=>{if(G.sc==='ville')buildScene()},fermerMenu:()=>closeDialog()});AMEN.bindCanvas();window.__AMEN=AMEN;
const PAR=creerParole({G,esc,save,stop:()=>stopSpeech(),voix:(t,id,force,fin)=>{if(force){const w=G.voice;G.voice=true;speak(t,id||'ilunga',fin);G.voice=w}else speak(t,id||'ilunga',fin)}});
// barres du haut des écrans plein format : on les descend sous la zone de l'heure et de la batterie des téléphones
try{new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1&&n.style&&n.style.zIndex==='9000'&&n.firstElementChild&&!n.querySelector('#sortieRapide'))n.firstElementChild.style.paddingTop='max(env(safe-area-inset-top),22px)'}))).observe(document.body,{childList:true})}catch(e){}
const DETEC=creerDetective({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});
window.__DET=DETEC;
const SCIE=creerScience({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__SCI=SCIE;
const HOPI=creerHopital({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__HOPI=HOPI;
const DESI=creerDesign({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__DESI=DESI;
const FASH=creerMode({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__FASH=FASH;
const VILL=creerVille({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__VILL=VILL;
const ESPA=creerEspace({PAR,G,esc,SFX,save,refreshHud,parler:parlerFr,openBox:d=>openBox(d),closeDialog:()=>closeDialog(),toast:t=>toast(t)});window.__ESPA=ESPA;
const SUP=creerSupermarche({G,esc,openBox:d=>openBox(d),parler:parlerFr,quiz3D:lancerQuiz3D,depenser:n=>{G.adv.pieces-=n;save();refreshHud()},toast:t=>toast(t),SFX,renderDialog:()=>renderDialog(),changerEtage:changerEtageMusee});
let surpriseProposee=false;
setInterval(()=>{
  if(surpriseProposee||G.mode!=='play'||G.dialog||G.monte||G.sc==='arene')return;
  surpriseProposee=true;
  if(EN.aOuvrir().surprise)openBox({kind:'surp'});
},6000);
function openEsp(vue){
  quitterArene();
  if(G.mode==='start'){G.depart=true;G.dialog={kind:'esp',vue:vue||'',msg:''};$('dlg').style.zIndex='9';renderDialog();return}
  openBox({kind:'esp',vue:vue||'',msg:'',liste:null});
}

// ---------- Missions en 3D : on joue dans l'arène ----------
function entrerArene(mat,guide){
  if(G.sc!=='arene')G.retour={sc:G.sc,x:G.x,z:G.z,phi:G.phi,pitch:G.pitch};
  G.areneMat=mat;G.areneGuide=guide||'ilunga';G.auto=null;G.sc='arene';G.x=0;G.z=5;G.phi=-Math.PI/2;G.pitch=.44;G.camOverride=7.4;G.near=null;hideBubble();buildScene();
}
function quitterArene(){
  if(G.sc!=='arene'||!G.retour)return;
  const r=G.retour;G.retour=null;
  M3.arreter();$('m3').classList.add('hide');
  G.sc=r.sc;G.x=r.x;G.z=r.z;G.phi=r.phi;G.pitch=r.pitch;G.camOverride=null;G.near=null;buildScene();
}
function etapesMission(d){
  const a=[];
  (d.collecte||[]).forEach(c=>a.push(Object.assign({type:'collecte'},c)));
  (d.jeux||[]).forEach(j=>{
    if(j.t==='ordre')a.push({type:'ordre',consigne:j.consigne,mots:j.mots,rep:j.rep,indice:j.indice});
    else if(j.t==='tri')a.push({type:'tri',consigne:j.consigne,paniers:j.paniers,objets:j.objets,indice:j.indice});
    else if(j.t==='panier')a.push({type:'panier',consigne:j.consigne,articles:j.articles,cible:j.cible,total:j.total});
  });
  d.qs.forEach(q=>a.push({type:'choix',q:q.q,choices:q.c,answer:q.a,exp:q.exp}));
  return a;
}
const M3=createMission3D({
  scene,
  hud:p=>{$('m3t').textContent=p.prog?'Étape '+p.prog:'';$('m3q').textContent=p.q||'';$('m3s').textContent=p.sous||'';$('m3f').textContent=p.msg||''},
  voix:(t,force)=>{const v=(G.dialog&&(G.dialog.voice||G.dialog.id))||'ilunga';if(force){const w=G.voice;G.voice=true;speak(t,v);G.voice=w}else speak(t,v)},
  sfx:n=>{if(n==='ok')SFX.bravo();else SFX.ko()},
  pos:()=>({x:G.x,z:G.z}),
  recentrer:()=>{G.auto={x:0,z:5}},
  etape:(first,type)=>{
    const d=G.dialog;if(!d)return;
    if(type==='choix'){G.adv.total++;if(first){G.adv.good++;d.firsts++}}
    if(first)d.pts=(d.pts||0)+1;
    const coin=d.rev?(first?2:0):(first?5:1);d.gain+=coin;gain(coin,first?(d.rev?3:10):3,first?(d.rev?3:10):3);
  },
  erreur:(i)=>{const d=G.dialog;if(d){d.errs++;if(i&&i.q&&!d.preview)CLOUD.enregistrerErreur(d.id,d.assign||null,i.q,i.rep,i.bonne)}},
  fin:()=>finMission3D()
});
function toucherReponse(px,py){
  if(!M3.actif())return;
  const r=cv.getBoundingClientRect(),v={x:((px-r.left)/r.width)*2-1,y:-((py-r.top)/r.height)*2+1};
  const j=M3.toucher(v,camera);
  if(j){G.auto={x:j.position.x,z:j.position.z};SFX.step()}
}
let vueGlobale=false,vueSauve=null;
function basculerVue(){
  vueGlobale=!vueGlobale;
  if(vueGlobale){vueSauve={p:G.pitch,c:G.camOverride};G.pitch=.95;G.camOverride=12.5}
  else if(vueSauve){G.pitch=vueSauve.p;G.camOverride=vueSauve.c}
  $('m3w').textContent=vueGlobale?'👁 Vue normale':'🔭 Vue d’ensemble';
}
function lancerMission3D(d){
  stopSpeech();G.auto=null;vueGlobale=false;$('m3w').textContent='🔭 Vue d’ensemble';
  $('dlg').style.display='none';
  G.mode='m3d';G.joy.x=G.joy.y=0;
  $('actwrap').classList.add('hide');$('info').classList.add('hide');
  $('m3').classList.remove('hide');
  M3.demarrer(etapesMission(d));
}
function finMission3D(){
  const d=G.dialog;if(!d)return;
  G.auto=null;
  M3.arreter();$('m3').classList.add('hide');$('info').classList.remove('hide');
  G.camOverride=7.2;
  completeQuiz(d);d.stage='out';
  G.mode='dialog';G.joy.x=G.joy.y=0;resetKnob();
  renderDialog();
}
function quitterMission3D(){
  M3.arreter();$('m3').classList.add('hide');$('info').classList.remove('hide');
  closeDialog();
}
$('m3v').onclick=()=>M3.reecouter();
$('m3w').onclick=basculerVue;
$('m3x').onclick=quitterMission3D;
$('sx').onclick=()=>{$('sortie').classList.add('hide');G.sortieDemandee=false;quitterMission3D()};
$('sn').onclick=()=>{$('sortie').classList.add('hide');G.auto={x:0,z:5}};

// ---------- Fin de mission : menu pour choisir la suite ----------
function suivanteScolaire(d){
  if(!d||!String(d.id).startsWith('cur:'))return null;
  const [n,m,i]=String(d.id).slice(4).split('|'),niv=PROGRAMME.find(x=>x.id===n),mat=niv&&niv.matieres.find(x=>x.id===m);
  if(!mat)return null;
  for(let k=+i+1;k<mat.missions.length;k++)if(CONTENU[missionCle(n,m,k)])return [n,m,k,mat.missions[k]];
  return null;
}
function prochaineAventure(){
  const a=G.adv.done;
  if(!a.lola)return {txt:'Va à l’école et parle à Mama Lola, la gardienne du portail.'};
  if(!a.ilunga)return {txt:'Entre dans l’école et va voir la Professeure Ilunga.'};
  if(!a.junior)return {txt:'Rejoins Junior, assis dans la classe.'};
  if(!a.mavungu)return {txt:'Le Directeur Mavungu t’attend dans la classe.'};
  for(let i=1;i<STAGES.length;i++){const st=STAGES[i];if(st.libre)continue;if(!stageDone(st))return {txt:'Rends-toi ici : '+st.icon+' '+st.name+'.',stage:st}}
  return {txt:'Tu as accompli toute l’aventure ! Continue avec les missions scolaires.'};
}
function suivantAventure(){
  const nx=prochaineAventure();
  if(nx.stage)travel(nx.stage.id);else closeDialog();
}
function openSuite(){
  quitterArene();
  openBox({kind:'suite'});
}
function htmlSuite(){
  const nx=prochaineAventure();
  let h=`<div class="hd"><h3>🎯 Choisis ta prochaine mission</h3></div>`;
  h+=`<p style="font-size:14px"><b>Aventure :</b> ${esc(nx.txt)}</p>`;
  if(nx.stage&&G.ui==='3d')h+=`<button class="p" onclick="travel('${nx.stage.id}')">🗺 Y aller : ${nx.stage.icon} ${esc(nx.stage.name)}</button>`;
  else if(G.ui==='3d')h+=`<button class="p" onclick="closeDialog()">▶ C’est parti ! (la mini-carte te guide)</button>`;
  h+=`<button class="j" onclick="openProg()">🎓 Missions scolaires (français, maths, sciences…)</button>`;
  if(G.ui==='3d')h+=`<button class="j" onclick="closeDialog();openMap()">🗺 Carte des lieux</button>`;
  return h+`<button class="p" onclick="closeDialog()">Continuer l’exploration</button>`;
}

// ---------- Carnet de progression : scores exacts et évolution ----------
const pct=(p,t)=>t?Math.round(100*p/t):0;
function infoCle(k){
  if(k.indexOf('|')>0){
    const [n,m,i]=k.split('|'),N=PROGRAMME.find(x=>x.id===n),M=N&&N.matieres.find(x=>x.id===m);
    return {groupe:N?N.nom:n,matiere:M?M.nom:m,titre:M?M.missions[+i]:k,ordre:(PROGRAMME.indexOf(N)+1)*1000+(N?N.matieres.indexOf(M):0)*100+(+i)};
  }
  const nn=NPC[k];
  return {groupe:'Aventure',matiere:nn?(SUJETS[nn.sujet]||nn.sujet):k,titre:nn?nn.name+' · '+(SUJETS[nn.sujet]||''):k,ordre:0};
}
// ---------- Révision espacée (méthode des boîtes de Leitner) et carte des compétences ----------
const JOUR=86400000,PAS=[1,3,7,14,30];
function planifier(key,pts,tot){
  if(!String(key).includes('|')||!tot)return;
  const r=G.adv.rev||(G.adv.rev={}),x=r[key]||{b:-1},ok=pts/tot>=.8;
  x.b=ok?Math.min(x.b<0?0:x.b+1,PAS.length-1):0;
  x.due=pts/tot<.5?Date.now():Date.now()+PAS[x.b]*JOUR;
  r[key]=x;
}
function aReviser(){
  const r=G.adv.rev||{},sc=G.adv.scores||{},now=Date.now();
  return Object.keys(sc).filter(k=>k.includes('|')&&sc[k].best&&CONTENU[k]).filter(k=>r[k]?r[k].due<=now:pct(sc[k].best.p,sc[k].best.t)<60)
    .sort((a,b)=>pct(sc[a].best.p,sc[a].best.t)-pct(sc[b].best.p,sc[b].best.t));
}
function reviserCle(k){const [n,m,i]=k.split('|');startMission(n,m,+i)}
function openComp(){quitterArene();openBox({kind:'comp',niv:null})}
function compNiv(n){G.dialog.niv=n||null;renderDialog()}
const classeNoeud=(b)=>!b?'nd0':pct(b.p,b.t)>=100?'nd4':pct(b.p,b.t)>=80?'nd3':pct(b.p,b.t)>=50?'nd2':'nd1';
function htmlComp(d){
  const sc=G.adv.scores||{};
  const nivs=PROGRAMME.filter(n=>n.matieres.some(m=>m.missions.some((t,i)=>CONTENU[missionCle(n.id,m.id,i)])));
  let h=`<div class="hd"><h3>🗺 Ma carte des compétences</h3></div>`;
  if(!d.niv){
    const rev=aReviser();
    h+=`<p style="font-size:13px">Chaque case est une compétence (une mission). ⬜ pas encore faite · 🟥 à retravailler · 🟧 en progrès · 🟩 acquise · ⭐ maîtrisée. Touche une case pour jouer la mission.</p>`;
    if(rev.length)h+=`<button class="j" onclick="reviserCle('${rev[0]}')">🔁 ${rev.length} mission(s) à réviser aujourd’hui — commencer</button>`;
    else h+=`<p class="ok" style="font-size:13px">🔁 Rien à réviser aujourd’hui. Bravo !</p>`;
    nivs.forEach(n=>{
      let f=0,t=0,sp=0,st=0;
      n.matieres.forEach(m=>m.missions.forEach((x,i)=>{const k=missionCle(n.id,m.id,i);if(!CONTENU[k])return;t++;const b=sc[k]&&sc[k].best;if(b){f++;sp+=b.p;st+=b.t}}));
      h+=`<button onclick="compNiv('${n.id}')">${esc(n.nom)} · ${f}/${t} compétences${st?' · maîtrise '+pct(sp,st)+' %':''}</button>`;
    });
    return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  const n=PROGRAMME.find(x=>x.id===d.niv),due=new Set(aReviser());
  h+=`<p><b>${esc(n.nom)}</b></p>`;
  n.matieres.forEach(m=>{
    const cases=m.missions.map((t,i)=>{
      const k=missionCle(n.id,m.id,i);
      if(!CONTENU[k])return `<button class="nd nd-" disabled title="${esc(t)}">·</button>`;
      const b=sc[k]&&sc[k].best;
      return `<button class="nd ${classeNoeud(b)}${due.has(k)?' nrev':''}" title="${esc(t)}" onclick="startMission('${n.id}','${m.id}',${i})">${b&&pct(b.p,b.t)>=100?'⭐':i+1}</button>`;
    }).join('');
    if(!m.missions.some((t,i)=>CONTENU[missionCle(n.id,m.id,i)]))return;
    let sp=0,st=0;m.missions.forEach((t,i)=>{const b=sc[missionCle(n.id,m.id,i)]&&sc[missionCle(n.id,m.id,i)].best;if(b){sp+=b.p;st+=b.t}});
    h+=`<h4>${esc(m.nom)}${st?' · '+pct(sp,st)+' %':''}</h4><div class="cases">${cases}</div>`;
  });
  h+=`<p style="font-size:12px">Un contour clignotant ⏰ signale une mission à réviser aujourd’hui.</p>`;
  return h+`<button class="s" onclick="compNiv(null)">← Tous les niveaux</button>`;
}
function openCarnet(){quitterArene();openBox({kind:'carnet',ouvert:{}})}
function carnetSommes(rows){let p=0,t=0;rows.forEach(r=>{p+=r.best.p;t+=r.best.t});return {p,t}}
function htmlCarnet(d){
  const sc=G.adv.scores||{},hist=G.adv.hist||[];
  const rows=Object.keys(sc).filter(k=>sc[k].best).map(k=>Object.assign({k:k,best:sc[k].best,n:sc[k].n,last:sc[k].last},infoCle(k)));
  let h=`<div class="hd"><h3>📒 Mon carnet de progression</h3></div>`;
  if(!rows.length)return h+`<p style="font-size:14px">Tu n’as pas encore fini de mission. Tes scores exacts et ton évolution s’afficheront ici.</p><button class="s" onclick="closeDialog()">Fermer</button>`;
  const tot=carnetSommes(rows);
  h+=`<p style="font-size:15px">Score total : <b>${tot.p} sur ${tot.t}</b> (${pct(tot.p,tot.t)} %) · ${rows.length} mission(s)</p>`;
  const parMat={};rows.forEach(r=>{const g=r.groupe+' · '+r.matiere;(parMat[g]=parMat[g]||[]).push(r)});
  const bil=Object.keys(parMat).map(g=>Object.assign({g},carnetSommes(parMat[g]))).filter(x=>x.t>=4);
  if(bil.length>=2){
    bil.sort((a,b)=>pct(b.p,b.t)-pct(a.p,a.t));
    const a=bil[0],z=bil[bil.length-1];
    h+=`<p style="font-size:13px">👍 Tu es le plus à l’aise en : <b>${esc(a.g)}</b> (${a.p} sur ${a.t}, ${pct(a.p,a.t)} %)<br>🎯 À renforcer : <b>${esc(z.g)}</b> (${z.p} sur ${z.t}, ${pct(z.p,z.t)} %)</p>`;
  }
  const groupes={};rows.forEach(r=>{(groupes[r.groupe]=groupes[r.groupe]||[]).push(r)});
  Object.keys(groupes).sort((a,b)=>(a==='Aventure'?-1:0)-(b==='Aventure'?-1:0)||a.localeCompare(b)).forEach(g=>{
    const rs=groupes[g],gs=carnetSommes(rs),ouvert=d.ouvert[g];
    h+=`<button onclick="carnetBasc('${esc(g).replace(/'/g,'’')}')">${ouvert?'▾':'▸'} ${esc(g)} : ${gs.p} sur ${gs.t} (${pct(gs.p,gs.t)} %)</button>`;
    if(ouvert){
      const mats={};rs.forEach(r=>{(mats[r.matiere]=mats[r.matiere]||[]).push(r)});
      Object.keys(mats).forEach(m=>{
        const ms=carnetSommes(mats[m]);
        h+=`<h4>${esc(m)} · ${ms.p} sur ${ms.t} (${pct(ms.p,ms.t)} %)</h4>`;
        mats[m].sort((a,b)=>a.ordre-b.ordre).forEach(r=>{
          const evo=hist.filter(x=>x.k===r.k).slice(-5).map(x=>x.p+'/'+x.t).join(' → ');
          h+=`<div class="row" style="display:block"><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(r.titre)}</span><b>${r.best.p} sur ${r.best.t} · ${pct(r.best.p,r.best.t)} %</b></div>${r.n>1?`<div style="font-size:11px;opacity:.7">${r.n} tentatives · évolution : ${esc(evo)}</div>`:''}</div>`;
        });
      });
    }
  });
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function carnetBasc(g){const d=G.dialog;d.ouvert=d.ouvert||{};d.ouvert[g]=!d.ouvert[g];renderDialog()}

function openMap(){openBox({kind:'map'})}
function htmlMap(){
  const d=G.dialog;
  let h='<h3>Carte des lieux</h3><p style="font-size:13px">Choisis un lieu. Chaque niveau se débloque quand tu as fini le précédent.</p>'
    +`<button class="j" onclick="openCongo()">🇨🇩 Explorer le Congo : provinces et territoires</button><button class="j" onclick="closeDialog();openProg()">🎓 Missions scolaires : toutes les classes</button>`;
  STAGES.forEach((st,i)=>{
    if(st.libre||accesLibre(st))return;
    const ok=stageUnlocked(i),n=st.npcs.filter(doneNpc).length,done=stageDone(st);
    h+=`<button ${ok?'':'disabled'} onclick="travel('${st.id}')"><b>${st.icon} ${esc(st.name)}</b><br><small>${ok?(done?'✔ Terminé · ':'')+n+'/'+st.npcs.length+' personnes rencontrées · ★ '+stageStars(st):'🔒 Termine « '+esc(STAGES[i-1].name)+' » pour débloquer'}</small></button>`;
  });
  h+=htmlLibre(d);
  // par province (accès direct aux lieux)
  const libres=STAGES.filter(st=>st.libre||accesLibre(st));
  if(libres.length){
    const prov={};libres.forEach(st=>{const p=PROV_DE[st.id]||'Autres';(prov[p]=prov[p]||[]).push(st)});
    const tot=libres.reduce((a,st)=>a+st.npcs.length,0),fait=libres.reduce((a,st)=>a+st.npcs.filter(doneNpc).length,0);
    h+=`<h4 style="margin-top:14px">🗺️ Par province : accès direct aux lieux</h4><p style="font-size:13px">${libres.length} lieux (provinces et territoires). ${fait}/${tot} missions réussies.</p>`;
    Object.keys(prov).forEach(p=>{
      const L=prov[p],f=L.reduce((a,st)=>a+st.npcs.filter(doneNpc).length,0),t=L.reduce((a,st)=>a+st.npcs.length,0),ouvert=d.prov===p;
      h+=`<button class="j" onclick="mapProv('${p.replace(/'/g,'’')}')"><b>${ouvert?'▾':'▸'} ${esc(p)}</b> · ${L.length} territoires · ${f}/${t}</button>`;
      if(ouvert)h+=L.map(st=>{const n=st.npcs.filter(doneNpc).length;return `<button onclick="travel('${st.id}')"><b>${st.icon} ${esc(st.name)}</b><br><small>${stageDone(st)?'✔ Terminé · ':''}${n}/${st.npcs.length} missions · ★ ${stageStars(st)}</small></button>`}).join('');
    });
  }
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
// accident : un véhicule renverse le joueur qui se trouve sur la route
function heurteJoueur(h){
  if(G.chute||G.monte)return;
  const sx=Math.sign(G.x-h.x)||1,perte=Math.min(G.adv.pieces,10);
  G.chute={t:0,dur:3.4,vx:sx*4.2,vz:h.dir*3};G.joy.x=G.joy.y=0;G.key.x=G.key.y=0;G.auto=null;
  G.adv.pieces-=perte;SFX.ko();
  toast('💥 Un '+h.kind+' t’a renversé !'+(perte?' −'+perte+' 🪙 de soins':''));
  bubble('🚑 <b>Aïe !</b> Ne joue jamais au milieu de la route.<br>Traverse sur les passages piétons et regarde à gauche et à droite.',G.x,G.z,2.6,6500);
  {const w=G.voice;G.voice=true;speak('Aïe ! Un véhicule t’a renversé. Ne joue jamais au milieu de la route. Traverse sur les passages piétons, et regarde à gauche et à droite.','ilunga');G.voice=w}
  save();refreshHud();
}
function chuteStep(dt){
  const c=G.chute;c.t+=dt;
  if(c.t<.6){const k=1-c.t/.6,[nx,nz]=collide(G.x+c.vx*k*dt,G.z+c.vz*k*dt);G.x=nx;G.z=nz}
  if(c.t>=c.dur){G.chute=null;if(playerObj){playerObj.rotation.order='XYZ';playerObj.rotation.x=0;playerObj.position.y=0}}
}
// ---------- Véhicules et auto-école ----------
const PRIX_VEH={moto:{n:'Moto',ico:'🏍',prix:250,d:'Rapide et économique, parfaite pour rejoindre les missions.'},auto:{n:'Voiture',ico:'🚗',prix:700,d:'Plus rapide encore, et confortable.'}};
const STATIONS=[{x:41,z:7.5,nom:'BOYEKOLI'},{x:11,z:30.5,nom:'LA ROUTE'}];
// carburant : le réservoir se vide avec la distance parcourue ; il se remplit à la station avec des pièces (gagnées en répondant juste)
const CARB={moto:{m:1800,prix:.1},auto:{m:1300,prix:.15}};     // m : mètres pour un plein ; prix : pièces par % de réservoir
const LIVRAISON=3;                                              // frais pour faire livrer le carburant à un véhicule resté en route
const niveauCarb=k=>{const v=vehs();v.carb=v.carb||{};return v.carb[k]===undefined?100:v.carb[k]};
const fixerCarb=(k,n)=>{const v=vehs();v.carb=v.carb||{};v.carb[k]=Math.max(0,Math.min(100,n))};
const vehs=()=>{const a=G.adv;if(!a.veh)a.veh={};return a.veh};
const permis=()=>!!(G.adv.done.ae1&&G.adv.done.ae2);   // le permis suppose l'inscription à l'auto-école
const PARK={moto:{x:-15,z:2.6,ry:Math.PI/2},auto:{x:-15,z:5.4,ry:Math.PI/2}};
// véhicules garés dans le village : ils restent là où le joueur les a laissés
function garerVehicules(){
  const v=vehs();v.pos=v.pos||{};
  ['moto','auto'].forEach(k=>{
    if(!v[k]||vehObjs[k])return;
    const o=k==='moto'?motoJoueur('#c0392b'):voitureJoueur('#2e86de'),p=v.pos[k]||PARK[k];
    o.position.set(p.x,0,p.z);o.rotation.y=p.ry;scene.add(o);vehObjs[k]=o;
    o.userData.col={x:p.x,z:p.z,r:k==='moto'?.9:1.6};if(W)W.colliders.push(o.userData.col);
  });
}
const distVeh=k=>{const o=vehObjs[k];return o?Math.hypot(o.position.x-G.x,o.position.z-G.z):99};
function majVeh(){
  const bar=$('vehbar'),v=vehs();
  const visible=G.mode==='play'&&G.sc==='ville'&&(v.moto||v.auto);
  let any=false;
  ['moto','auto'].forEach(k=>{
    const b=$(k==='moto'?'vm':'va');
    const ici=G.monte===k||(!G.monte&&v[k]&&distVeh(k)<4.5);
    b.classList.toggle('hide',!ici);b.classList.toggle('on',G.monte===k);
    b.textContent=(G.monte===k?'⬇ Descendre':'➡ Monter · '+PRIX_VEH[k].n);
    if(ici)any=true;
  });
  bar.classList.toggle('hide',!(visible&&any));
  const m=!!G.monte&&G.mode==='play'&&G.sc==='ville';
  $('vh').classList.toggle('hide',!m);$('vc').classList.toggle('hide',!m);
  $('vc').textContent=cmdV?'🛞 Commande : volant':'🕹 Commande : flèches';
  $('volant').classList.toggle('hide',!(m&&cmdV));
  if(m&&cmdV){$('joy').classList.add('hide');$('actwrap').classList.add('hide');G.joyCache=true}else if(G.joyCache){G.joyCache=false;$('joy').classList.remove('hide');$('actwrap').classList.remove('hide')}
  const cj=$('carb');cj.classList.toggle('hide',!m);
  if(m){const n=niveauCarb(G.monte);$('carbn').textContent=Math.round(n)+' %';$('carbj').style.width=n+'%';cj.classList.toggle('bas',n<=15&&n>0);cj.classList.toggle('vide',n<=0)}
}
// ---------- Commandes de conduite : vrai volant (glisser pour tourner) + pédales, ou touches de direction ----------
const CMD_KEY='boyekoli_cmd';
let cmdV=true;try{cmdV=localStorage.getItem(CMD_KEY)!=='fleches'}catch(e){}
const commandeVolant=()=>cmdV&&!!G.monte;
function basculerCommande(){cmdV=!cmdV;try{localStorage.setItem(CMD_KEY,cmdV?'volant':'fleches')}catch(e){}G.wheel=0;G.ped=0;majVeh()}
function klaxonner(){
  if(!G.monte)return;SFX.klaxon();
  if(G.trafic&&G.trafic.klaxon)G.trafic.klaxon(G.x,G.z);
  const b=$('vh');b.classList.add('on');setTimeout(()=>b.classList.remove('on'),300);
}
{
  const vl=$('vol');let cx=0,cy=0,prev=0,id=null,ang=0;
  const a=e=>Math.atan2(e.clientY-cy,e.clientX-cx);
  vl.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;vl.setPointerCapture(id);const r=vl.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2;prev=a(e);ang=(G.wheel||0)*120*Math.PI/180;G.wheelHeld=true});
  vl.addEventListener('pointermove',e=>{
    if(e.pointerId!==id)return;e.preventDefault();
    let d=a(e)-prev;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;prev=a(e);
    ang=Math.max(-120,Math.min(120,ang*180/Math.PI+d*180/Math.PI))*Math.PI/180;G.wheel=ang/(120*Math.PI/180);
  });
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>vl.addEventListener(ev,e=>{if(e.pointerId===id){id=null;G.wheelHeld=false}}));
  const ped=(bid,val)=>{
    const b=$(bid);
    b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);G.ped=val;b.classList.add('on')});
    ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>{if(G.ped===val)G.ped=0;b.classList.remove('on')}));
  };
  ped('pacc',1);ped('pfrein',-1);
}
$('vh').addEventListener('click',klaxonner);
$('vc').addEventListener('click',basculerCommande);
document.addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;if((e.key==='h'||e.key==='H')&&G.monte&&G.mode==='play')klaxonner()});

function monter(k){
  if(G.sc!=='ville'||G.mode!=='play')return;
  if(G.monte===k){descendre();return}
  if(G.monte||!vehObjs[k]||distVeh(k)>4.5)return;
  if(!permis()){toast('Il te faut le permis : inscris-toi dans une auto-école et réussis les missions 1 et 2.');SFX.ko();return}
  const o=vehObjs[k];
  if(W&&o.userData.col){const i=W.colliders.indexOf(o.userData.col);if(i>=0)W.colliders.splice(i,1)}
  G.wheel=0;G.ped=0;G.monte=k;G.vv=0;G.steer=0;G.x=o.position.x;G.z=o.position.z;G.ry=o.rotation.y;
  SFX.coin();toast(cmdV?'Tourne le volant et appuie sur ▲ pour avancer · 📯 pour klaxonner · ⛽ surveille le carburant':'Flèches : avancer, freiner, tourner · 📯 pour klaxonner · ⛽ surveille le carburant');majVeh();
}
function descendre(){
  const k=G.monte;if(!k)return;
  if(Math.abs(G.vv||0)>1.5){toast('Arrête-toi d’abord pour descendre.');SFX.ko();return}
  const o=vehObjs[k],v=vehs();v.pos=v.pos||{};
  // garé dans le parking d'une de mes maisons s'il y en a un à proximité
  let pk=null,dm=4.5;(G.parkings||[]).forEach(q=>{const dd=Math.hypot(q.x-G.x,q.z-G.z);if(dd<dm){dm=dd;pk=q}});
  if(pk){G.x=pk.x;G.z=pk.z;G.ry=Math.round(G.ry/Math.PI)*Math.PI;toast('🅿 Véhicule garé dans le parking de ta maison');}
  if(o){o.position.set(G.x,0,G.z);o.rotation.y=G.ry}
  if(o&&o.userData.col){o.userData.col.x=G.x;o.userData.col.z=G.z;if(W)W.colliders.push(o.userData.col)}
  v.pos[k]={x:G.x,z:G.z,ry:G.ry};save();
  // le conducteur descend du côté gauche du véhicule
  const gx=G.x+Math.cos(G.ry)*1.7,gz=G.z-Math.sin(G.ry)*1.7;
  G.monte=null;G.vv=0;G.steer=0;G.wheel=0;G.ped=0;
  const [nx,nz]=collide(gx,gz);G.x=nx;G.z=nz;
  if(o){if(o.userData.volant)o.userData.volant.rotation.z=0;if(o.userData.avant)o.userData.avant.forEach(w=>w.rotation.y=0);if(o.userData.guidon)o.userData.guidon.rotation.y=0}
  if(playerObj)playerObj.visible=true;majVeh();
}
$('vm').addEventListener('click',()=>monter('moto'));
$('va').addEventListener('click',()=>monter('auto'));

// ---------- Station-service : on descend, on achète du carburant avec les pièces gagnées par les bonnes réponses ----------
function ouvrirPompe(){
  if(G.monte){toast('Arrête-toi puis descends de ton véhicule pour faire le plein.');SFX.ko();return}
  if(!vehs().moto&&!vehs().auto){bubble('⛽ <b>Station-service</b><br>Quand tu auras une moto ou une voiture, tu viendras ici faire le plein avec tes pièces.',G.x,G.z,2.6,5000);return}
  openBox({kind:'pompe',msg:''});
}
function htmlPompe(d){
  const a=G.adv;let h=`<h3>⛽ Station-service</h3><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  h+=`<p style="font-size:13px">Le carburant s’achète avec les pièces que tu gagnes en répondant juste. Le véhicule sert à rejoindre les missions, ta maison ou récolter tes loyers : quand le réservoir est vide, retourne apprendre !</p>`;
  Object.keys(PRIX_VEH).forEach(k=>{
    if(!vehs()[k])return;
    const n=niveauCarb(k),loin=!(vehObjs[k]&&distVeh(k)<10),frais=loin&&n<100?LIVRAISON:0,x=CARB[k];
    h+=`<h4>${PRIX_VEH[k].ico} ${esc(PRIX_VEH[k].n)} · réservoir ${Math.round(n)} %</h4><div style="height:8px;border-radius:5px;background:#ddd;overflow:hidden;margin-bottom:6px"><div style="height:100%;width:${n}%;background:${n<=15?'#c0392b':'#2a9d5c'}"></div></div>`;
    if(n>=100){h+=`<button disabled>Réservoir plein ✔</button>`;return}
    if(loin)h+=`<p style="font-size:12px;opacity:.8">Ton véhicule est loin de la station : le carburant est livré sur place (+${LIVRAISON} 🪙).</p>`;
    [25,50,100].forEach(p=>{
      const pct=Math.min(p,100-Math.round(n));if(pct<=0)return;
      const c=Math.ceil(pct*x.prix)+frais,ok=a.pieces>=c;
      h+=`<button class="${ok?'p':''}" onclick="acheterCarb('${k}',${pct})">${p===100?'Faire le plein':'+'+pct+' %'}${p===100?' (+'+pct+' %)':''} : ${c} 🪙${ok?'':' — il te manque '+(c-a.pieces)+' 🪙'}</button>`;
    });
  });
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function acheterCarb(k,pct){
  const a=G.adv,d=G.dialog,x=CARB[k];if(!x||!vehs()[k])return;
  const n=niveauCarb(k),loin=!(vehObjs[k]&&distVeh(k)<10),p=Math.min(pct,100-Math.round(n)),c=Math.ceil(p*x.prix)+(loin?LIVRAISON:0);
  if(p<=0)return;
  if(a.pieces<c){d.msg='Il te manque '+(c-a.pieces)+' pièces : réponds juste aux questions pour en gagner.';SFX.ko();renderDialog();return}
  a.pieces-=c;fixerCarb(k,n+p);G.alerteCarb=false;save();refreshHud();SFX.coin();
  d.msg='Plein effectué : +'+p+' % de carburant ('+c+' 🪙).';renderDialog();
}
function htmlConc(d){
  const a=G.adv,v=vehs();
  let h=`<h3>🏍 Concession : motos et voitures</h3><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  h+=`<p style="font-size:13px">Pour conduire, il faut le permis : construis une auto-école dans ton quartier résidentiel, inscris-toi, puis réussis les missions 1 et 2. ${permis()?'✔ Tu as ton permis.':'Tu ne l’as pas encore.'}</p>`;
  Object.keys(PRIX_VEH).forEach(k=>{
    const x=PRIX_VEH[k];
    h+=v[k]?`<button disabled>✔ ${x.ico} ${esc(x.n)} (à toi)</button>`
      :`<button class="${a.pieces>=x.prix?'p':''}" onclick="acheterVeh('${k}')">${x.ico} ${esc(x.n)} : ${x.prix} 🪙<br><small>${esc(x.d)}${a.pieces>=x.prix?'':' — il te manque '+(x.prix-a.pieces)+' 🪙'}</small></button>`;
  });
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function acheterVeh(k){
  const a=G.adv,x=PRIX_VEH[k],d=G.dialog;if(!x||vehs()[k])return;
  if(a.pieces<x.prix){d.msg='Il te manque '+(x.prix-a.pieces)+' pièces.';SFX.ko();renderDialog();return}
  a.pieces-=x.prix;vehs()[k]=true;save();refreshHud();SFX.win();garerVehicules();
  d.msg='Félicitations ! Ta '+x.n.toLowerCase()+' est à toi. '+(permis()?'Ton véhicule est garé à côté de la concession : approche-toi et touche « Monter ».':'Passe d’abord ton permis à l’auto-école.');renderDialog();
}

// ---------- Inscription à l'auto-école : on entre, on discute avec l'agent et on paie ----------
const FRAIS_AE=150;
function htmlInsc(d){
  const a=G.adv;
  let h=`<h3>🚦 Accueil de l’auto-école</h3><p class="row"><span>Mes pièces</span><b>${a.pieces} 🪙</b></p>`;
  if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
  if(a.inscrit)return h+`<p>« Vous êtes déjà inscrit(e) ! Rendez-vous auprès du moniteur pour vos leçons de conduite. »</p><button class="s" onclick="closeDialog()">Merci</button>`;
  if(d.etape==='question'){
    const s=d.q,ordre=melanger(s.o.map((t,i)=>i),d.seed);
    h+=`<p>« Pour obtenir une remise, répondez à cette question : »</p><p style="font-size:13px"><b>${esc(s.txt)}</b></p><p>${esc(s.q)}</p>`;
    h+=ordre.map(i=>`<button onclick="inscReponse(${i})">${esc(s.o[i])}</button>`).join('');
    return h;
  }
  h+=`<p>« Bonjour ! L’inscription à l’auto-école coûte <b>${d.prix} 🪙</b>${d.remise?' (remise accordée)':''}. Elle vous donne accès aux cours et aux leçons de conduite. »</p>`;
  h+=`<button class="${a.pieces>=d.prix?'p':''}" onclick="inscPayer()">💰 Payer ${d.prix} 🪙 et m’inscrire</button>`;
  if(!d.tente&&!d.remise)h+=`<button onclick="inscNegocier()">🤝 Négocier le prix</button>`;
  return h+`<button class="s" onclick="closeDialog()">Partir</button>`;
}
function inscNegocier(){
  const d=G.dialog;d.tente=true;
  const m=AE[Math.floor(Math.random()*AE.length)],s=m.sit[Math.floor(Math.random()*m.sit.length)];
  d.q=s;d.seed=Math.floor(Math.random()*1000);d.etape='question';d.msg='';renderDialog();
}
function inscReponse(i){
  const d=G.dialog;d.etape='accueil';
  if(i===0){d.remise=true;d.prix=Math.round(FRAIS_AE*.7);d.msg='Bravo ! « Vous connaissez votre code : je vous fais 30 % de remise. »';SFX.bravo()}
  else{d.msg='« Hmm, ce n’est pas ça. Je ne peux pas faire de remise, mais vous pouvez vous inscrire au tarif normal. »';SFX.ko()}
  renderDialog();
}
function inscPayer(){
  const a=G.adv,d=G.dialog;
  if(a.pieces<d.prix){d.msg='Il vous manque '+(d.prix-a.pieces)+' 🪙 : revenez quand vous aurez la somme.';SFX.ko();renderDialog();return}
  a.pieces-=d.prix;a.inscrit=true;save();refreshHud();SFX.win();
  d.msg='Inscription validée ! Rendez-vous auprès du moniteur, dans la salle de cours, pour vos leçons.';renderDialog();
}
function htmlAE(d){
  let h=`<h3>🚦 Auto-école</h3><p style="font-size:13px">Au volant d’un véhicule, tu affrontes de vraies situations de la route. ${permis()?'✔ Tu as le permis.':'Réussis les missions 1 et 2 pour obtenir ton permis.'}</p>`;
  AE.forEach((m,i)=>{
    const f=!!G.adv.done[m.id],st=G.adv.stars[m.id]||0;
    h+=`<button onclick="startConduite(${i})"><b>${f?'✔ ':''}Mission ${i+1} · ${esc(m.titre)}</b><br><small>${m.sit.length} situations${f?' · ★ '+st:''}${i===4?' · à moto':''}</small></button>`;
  });
  return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
}
function startConduite(i){
  $('dlg').style.display='none';G.dialog=null;
  const m=AE[i],veh=m.id==='ae5'?'moto':'auto';
  G.cond={m:i,k:0,v:0,etat:'intro',veh:veh,gain:0,errs:0,firsts:0,bad:[],ordre:[],ok:false,msg:'',ret:G.int&&G.int.ret?Object.assign({},G.int.ret):null,sauv:{pitch:G.pitch,co:G.camOverride}};
  G.sc='conduite';G.x=2.2;G.z=4;G.ry=Math.PI;G.phi=-Math.PI/2;G.pitch=.38;G.camOverride=8;G.near=null;hideBubble();
  buildScene();G.mode='cond';G.joy.x=G.joy.y=0;$('actwrap').classList.add('hide');
  snapCamera();
  openBox({kind:'cond',intro:true,m:i});
  speak(m.intro,'ilunga');
}
const sCond=()=>{const c=G.cond;return AE[c.m].sit[c.k]};
function condTick(dt){
  const c=G.cond;if(!c||c.etat!=='roule')return;
  const n=AE[c.m].sit.length;
  const stopZ=(c.k<n?zArret(c.k)+6:zArret(n-1)-42+6);
  const dist=Math.max(0,G.z-stopZ);
  let v=Math.min(9.5,Math.sqrt(2*4.5*dist)+.6);
  if(c.v<v)c.v=Math.min(v,c.v+6*dt);else c.v=v;
  G.z-=c.v*dt;
  if(G.z<=stopZ+.12){
    G.z=stopZ;c.v=0;
    if(c.k<n)condQuestion();
    else{c.etat='fin';finConduite()}
  }
  if(W&&W.car){W.car.position.set(G.x,0,G.z);W.car.rotation.y=Math.PI}
}
// situation : la question s'affiche en haut, les quatre réponses flottent au-dessus du véhicule
function condQuestion(){
  const c=G.cond,s=sCond();
  c.etat='question';c.bad=[];c.ok=false;c.msg='';
  c.ordre=melanger(s.o.map((t,i)=>i),c.m*31+c.k*7+3);
  W.boards=creerReponses(c.ordre.map(i=>s.o[i]));
  W.boards.position.set(G.x,0,G.z-3.2);W.group.add(W.boards);
  G.camOverride=11;G.pitch=.36;
  ajusterReponses();
  majCq();condEcouter(false);
}
function ajusterReponses(){if(W&&W.boards)disposerReponses(W.boards,innerWidth/innerHeight,camera.fov,(G.camOverride||11)+3.2)}
addEventListener('resize',ajusterReponses);
function majCq(){
  const c=G.cond,m=AE[c.m],s=sCond(),box=$('cq');
  $('info').style.display=$('mmw').style.display=(c.etat==='question')?'none':'';   // la bande d'objectif ne cache pas les réponses
  if(!c||c.etat==='intro'||c.etat==='roule'||c.etat==='fin'){box.classList.add('hide');return}
  let h=`<b>🚦 Situation ${c.k+1} sur ${m.sit.length}</b><br>${esc(s.txt)}<br><b>${esc(s.q)}</b>`;
  if(c.ok)h+=`<div class="cqm cqo">✔ Bonne réponse ! ${esc(s.e)}</div><div class="cqb"><button class="p" onclick="condSuite()">Continuer ▶</button><button onclick="condEcouter(true)">🔊 Réécouter</button></div>`;
  else h+=(c.msg?`<div class="cqm cqk">${esc(c.msg)}</div>`:`<div class="cqm">👆 Touche la bonne réponse sur le panneau, ou la lettre ci-dessous</div>`)+`<div class="cqb">${c.ordre.map((i,j)=>`<button class="cqr${c.bad.includes(i)?' cqx':''}" onclick="answerCond(${i})">${'ABCD'[j]}</button>`).join('')}<button onclick="condEcouter(true)">🔊</button></div>`;
  box.innerHTML=h;box.classList.remove('hide');
}
function condEcouter(force){
  const c=G.cond;if(!c||c.etat==='intro')return;
  const s=sCond(),rep=c.ordre.map((i,j)=>'Réponse '+'ABCD'[j]+' : '+s.o[i]).join('. ');
  const t=s.txt+' '+s.q+' '+rep+'.';
  if(force){const w=G.voice;G.voice=true;speak(t,'ilunga');G.voice=w}else speak(t,'ilunga');
}
function answerCond(i){
  const c=G.cond;if(!c||c.etat!=='question'||c.ok||c.bad.includes(i))return;
  const j=c.ordre.indexOf(i);
  if(i!==0){
    c.bad.push(i);c.errs++;SFX.ko();c.msg='Pas tout à fait : relis la situation. Essaie une autre réponse !';
    marquerReponse(W.boards,j,'ko');majCq();speak('Pas tout à fait. Essaie encore.','ilunga');return;
  }
  const first=!c.bad.length;
  G.adv.total++;if(first){G.adv.good++;c.firsts++}
  const coin=first?5:1;c.gain+=coin;gain(coin,first?10:3,first?10:3);SFX.bravo();
  c.ok=true;c.msg='';marquerReponse(W.boards,j,'ok');majCq();
  speak('Bonne réponse. '+sCond().e,'ilunga');
}
function condDemarrer(){
  $('dlg').style.display='none';G.dialog=null;stopSpeech();
  G.mode='cond';G.cond.etat='roule';
}
function condSuite(){
  const c=G.cond;if(!c||!c.ok)return;
  stopSpeech();
  if(W.boards){W.group.remove(W.boards);liberer(W.boards);W.boards=null}
  $('cq').classList.add('hide');
  G.camOverride=8;G.pitch=.38;
  c.k++;c.etat='roule';
}
function toucherCond(px,py){
  const c=G.cond;if(!c||c.etat!=='question'||!W.boards)return;
  const r=cv.getBoundingClientRect(),rc=new THREE.Raycaster();
  rc.setFromCamera(new THREE.Vector2(((px-r.left)/r.width)*2-1,-((py-r.top)/r.height)*2+1),camera);
  const h=rc.intersectObjects(W.boards.children,false)[0];
  if(h)answerCond(c.ordre[h.object.userData.idx]);
}
function htmlCond(d){
  const c=G.cond,m=AE[c.m];
  if(d.fin){
    const n=m.sit.length;
    return `<h3>🏁 Mission terminée !</h3><div class="mscore">${c.firsts} sur ${n}</div><p style="text-align:center">${esc(m.titre)}<br><b>+${c.gain} 🪙</b> · ${'★'.repeat(d.stars)}</p>`
      +(d.permis?`<p class="ok">🎉 Tu as obtenu ton permis ! Tu peux conduire une moto ou une voiture dans le quartier.</p>`:'')
      +`<button class="p" onclick="condSortir()">Retour au quartier</button><button onclick="startConduite(${c.m})">Refaire cette mission</button>`;
  }
  return `<h3>🚦 Mission ${c.m+1} · ${esc(m.titre)}</h3><p>${esc(m.intro)}</p><p style="font-size:13px">Tu es ${c.veh==='moto'?'sur la moto':'au volant'}. Le véhicule avance seul ; à chaque situation, les réponses flottent au-dessus du véhicule : touche la bonne. La question est lue à voix haute.</p><button class="p" onclick="condDemarrer()">▶ Démarrer</button><button onclick="speak(AE[G.cond.m].intro,'ilunga')">🔊 Réécouter</button><button class="s" onclick="condSortir()">Quitter</button>`;
}
function finConduite(){
  const c=G.cond,m=AE[c.m],n=m.sit.length;
  const st=c.errs===0?3:(c.errs<=2?2:1);
  const avant=permis();
  G.adv.done[m.id]=true;G.adv.stars[m.id]=Math.max(G.adv.stars[m.id]||0,st);
  c.gain+=10;gain(10,10);save();
  openBox({kind:'cond',fin:true,stars:st,permis:!avant&&permis()});
  $('actwrap').classList.add('hide');
}
function condSortir(){
  $('info').style.display=$('mmw').style.display='';
  const c=G.cond;$('cq').classList.add('hide');stopSpeech();$('dlg').style.display='none';G.dialog=null;
  G.pitch=c.sauv.pitch;G.camOverride=c.sauv.co||null;G.cond=null;
  const r=c.ret||{x:-14,z:0,phi:0};goTo({to:'ville',tx:r.x,tz:r.z,phi:r.phi});
  G.mode='play';$('actwrap').classList.remove('hide');majVeh();refreshHud();
}
// ---------- Explorer le Congo : fiches des provinces et des territoires ----------
function openCongo(){closeDialog();openBox({kind:'congo',pi:null})}
const nf=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
function htmlCongo(d){
  let h=`<div class="hd"><h3>🇨🇩 Explorer le Congo</h3></div>`;
  const stat=ids=>{const L=ids.map(id=>STAGES.find(s=>s.id===id)).filter(Boolean);return {t:L.reduce((a,st)=>a+st.npcs.length,0),f:L.reduce((a,st)=>a+st.npcs.filter(doneNpc).length,0)}};
  if(d.pi===null||d.pi===undefined){
    const tot=stat(Object.keys(PROV_DE).concat(PROVS.map(p=>'pv_'+slugTr(p))));
    h+=`<p style="font-size:13px">Toute la connaissance du pays au même endroit : les ${PROVS.length} provinces et les ${TERRITOIRES_LISTE.length} territoires, avec leurs fiches. ${tot.f}/${tot.t} missions réussies. Les missions restent aussi dans l’exploration normale.</p>`;
    PROVS.forEach((p,i)=>{
      const ts=TERRITOIRES_LISTE.filter(t=>t.prov===p),st=stat(ts.map(t=>'tr_'+slugTr(t.nom)).concat(['pv_'+slugTr(p)]));
      h+=`<button onclick="congoProv(${i})"><b>${esc(p)}</b><br><small>${ts.length} territoires · ${st.f}/${st.t} missions</small></button>`;
    });
    h+=`<button class="j" onclick="openProg()">🎓 Missions scolaires (toutes les classes)</button>`;
    return h+`<button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  const p=PROVS[d.pi],ts=TERRITOIRES_LISTE.filter(t=>t.prov===p);
  const pop=ts.reduce((a,t)=>a+t.pop,0),km=ts.reduce((a,t)=>a+t.km2,0);
  h+=`<h4>${esc(p)}</h4><p style="font-size:13px">${ts.length} territoires${km?' · environ '+nf(km)+' km² recensés':''}${pop?' · environ '+nf(pop)+' habitants recensés':''} (données à vérifier).</p>`;
  const pv=STAGES.find(s=>s.id==='pv_'+slugTr(p));
  if(pv){const i=STAGES.indexOf(pv),ok=stageUnlocked(i);h+=`<button ${ok?'':'disabled'} onclick="travel('${pv.id}')"><b>${pv.icon} ${esc(pv.name)}</b><br><small>${ok?pv.npcs.filter(doneNpc).length+'/'+pv.npcs.length+' missions':'🔒 à débloquer dans l’exploration'}</small></button>`}
  ts.forEach(t=>{
    const st=STAGES.find(s=>s.id==='tr_'+slugTr(t.nom)),i=st?STAGES.indexOf(st):-1,ok=i>=0&&stageUnlocked(i);
    const l=[];
    l.push('Chef-lieu : '+t.cl);
    if(t.lang)l.push('Langue : '+(t.lang.charAt(0).toUpperCase()+t.lang.slice(1)));
    if(t.pop)l.push('Population : environ '+nf(t.pop)+(t.an?' ('+t.an+')':''));
    if(t.km2)l.push('Superficie : '+nf(t.km2)+' km²');
    if(t.sect)l.push(t.sect+' secteurs');if(t.chef)l.push(t.chef+' chefferies');if(t.comm)l.push(t.comm+' communes');
    h+=`<div class="row" style="display:block;margin:8px 0;padding:8px;border:1px solid #d9d2bd;border-radius:10px"><b>${esc(t.nom)}</b><br><small>${esc(l.join(' · '))}</small>${t.fait?`<br><small><i>${esc(t.fait)}</i></small>`:''}`
      +(st?`<br><button ${ok?'':'disabled'} style="margin-top:6px" onclick="travel('${st.id}')">${ok?'Visiter · '+st.npcs.filter(doneNpc).length+'/'+st.npcs.length+' missions':'🔒 à débloquer dans l’exploration'}</button>`:'')+`</div>`;
  });
  return h+`<button class="s" onclick="congoProv(null)">← Toutes les provinces</button>`;
}
function congoProv(i){const d=G.dialog;d.pi=i;renderDialog()}
// ---------- Exploration libre : missions des territoires et missions scolaires mélangées en séries ----------
const SERIE=10;
let _libre=null;
function missionsLibres(){
  if(_libre)return _libre;
  const libres=STAGES.filter(st=>st.libre||accesLibre(st));
  // missions des territoires : les 3 missions d'un même lieu sont séparées (une passe par rang de mission)
  const tr=[];for(let k=0;k<3;k++)libres.forEach(st=>{if(st.npcs[k])tr.push({kind:'tr',st:st,id:st.npcs[k]})});
  // missions scolaires : on tourne entre les classes et les matières pour ne pas enchaîner les mêmes
  const files=[];PROGRAMME.forEach(n=>n.matieres.forEach(m=>files.push(m.missions.map((t,i)=>({kind:'sc',n:n,m:m,i:i,t:t})).filter(e=>CONTENU[missionCle(e.n.id,e.m.id,e.i)]))));
  const sc=[];for(let r=0;sc.length<files.reduce((a,f)=>a+f.length,0);r++)files.forEach(f=>{if(f[r])sc.push(f[r])});
  // fusion : territoire, scolaire, territoire, scolaire… (jamais plus de deux du même genre de suite)
  const out=[];let a=0,b=0;
  while(a<tr.length||b<sc.length){
    if(a<tr.length)out.push(tr[a++]);
    if(b<sc.length)out.push(sc[b++]);
  }
  _libre=out;return out;
}
const fait=e=>e.kind==='tr'?doneNpc(e.id):!!G.adv.done['cur:'+missionCle(e.n.id,e.m.id,e.i)];
function visiterMission(stId,npcId){
  travel(stId);const n=NPC[npcId];if(n){G.x=n.x+1.2;G.z=n.z+1.6;snapCamera()}
}
function libreSerie(i){const d=G.dialog;d.serie=d.serie===i?null:i;renderDialog()}
function htmlLibre(d){
  const L=missionsLibres(),nb=Math.ceil(L.length/SERIE),f=L.filter(fait).length;
  let h=`<h3 style="margin-top:14px">🌍 Exploration libre</h3><p style="font-size:13px">${L.length} missions mélangées : territoires et provinces du Congo, et missions scolaires de toutes les classes. Tu choisis librement ; chaque série varie les sujets. ${f}/${L.length} réussies.</p>`;
  for(let i=0;i<nb;i++){
    const part=L.slice(i*SERIE,(i+1)*SERIE),ff=part.filter(fait).length,ouvert=d.serie===i;
    h+=`<button class="j" onclick="libreSerie(${i})"><b>${ouvert?'▾':'▸'} Série ${i+1}</b> · ${ff}/${part.length}</button>`;
    if(ouvert)h+=part.map(e=>e.kind==='tr'
      ?`<button onclick="visiterMission('${e.st.id}','${e.id}')">${fait(e)?'✔ ':''}🗺 <b>${esc(e.st.name)}</b><br><small>${esc(NPC[e.id].role)}</small></button>`
      :`<button onclick="startMission('${e.n.id}','${e.m.id}',${e.i})">${fait(e)?'✔ ':''}🎓 <b>${esc(e.m.nom)} · ${esc(e.n.nom)}</b><br><small>Mission ${e.i+1} · ${esc(e.t)}</small></button>`).join('');
  }
  return h;
}
function mapProv(p){const d=G.dialog;d.prov=d.prov===p?null:p;renderDialog()}
function travel(id){
  const st=STAGES.find(s=>s.id===id);if(!st)return;
  const sc=SCENES[st.scene];
  closeDialog();
  G.sc=st.scene;G.retourRepere=null;
  if(sc.spawn){G.x=sc.spawn.x;G.z=sc.spawn.z;G.phi=sc.spawn.phi}else{G.x=-12;G.z=0;G.phi=0}
  G.near=null;hideBubble();buildScene();toast(st.icon+' '+st.name);
  refreshHud();
}
function stageCheck(id){
  // bonus à la fin d'un niveau, puis diplôme quand tout est terminé
  const st=STAGES.find(s=>s.npcs.includes(id));
  if(!st||!stageDone(st))return;
  G.adv.stageBonus=G.adv.stageBonus||{};
  if(!G.adv.stageBonus[st.id]){
    const bo=st.libre?10:30;G.adv.stageBonus[st.id]=true;gain(bo,bo);
    toast(st.icon+' '+(st.libre?'Territoire terminé : ':'Niveau terminé : ')+st.name+' ! +'+bo+' pièces');SFX.win();
    const nx=st.libre?null:STAGES[STAGES.indexOf(st)+1];
    if(nx)setTimeout(()=>toast('🏗 Un nouveau quartier s’ouvre : '+nx.icon+' '+nx.name+'. Suis la route jaune dans la ville !'),2800);
  }
  if(STAGES.filter(x=>!x.libre).every(stageDone)&&!G.adv.diplome){
    G.adv.diplome=true;save();
    setTimeout(()=>openBox({kind:'info',title:'Diplôme de LEXARIS ACADÉMIE',i:0,lines:[
      'Félicitations '+G.nom+' ! Tu as terminé les '+STAGES.filter(x=>!x.libre).length+' épisodes, de l’école à la place de l’Indépendance.',
      'Tu sais compter, lire, protéger la nature, prendre soin de ta santé, connaître ton pays et tes droits. Tu es un vrai citoyen et un champion !']}),1500);
  }
}

// ---------- Profil et objets (mode photo) ----------
function openProfile(){openBox({kind:'profile'})}
function openCreatorFromPhoto(){
  closeDialog();PM.hide();$('cv').style.display='block';
  G.sc='ville';G.x=-22;G.z=-3.6;G.phi=-Math.PI/2;G.ry=Math.PI;buildScene();
  openCreator('photo');
}
function htmlProfile(){
  const av=((window.__MAN&&window.__MAN.avatars)||[]).filter(a=>a[0]===(G.look.s||'f'));
  const pcs=['pf1','pf2','ph1','ph2'].map(c=>`<button class="avb${playerChar()===c?' on':''}" onclick="setChar('${c}')"><img src="img/chars/${c}.webp" alt="" style="object-fit:contain;object-position:top"></button>`).join('');
  return `<h3>Mon personnage</h3><div class="chips" style="margin-bottom:8px"><button class="chip${G.real?'':' on'}" onclick="setChar(null)">3D, tous les mouvements (360°)</button><button class="chip" onclick="openCreatorFromPhoto()">Personnaliser visage et tenue</button></div><div class="lb" style="font-size:12px;font-weight:700;margin:4px 0">Ou un personnage photo (de face uniquement)</div><div class="avs" style="margin-bottom:10px">${pcs}</div><h3>Ma photo de profil</h3><div class="row" style="border:0;gap:8px;margin-bottom:6px"><button class="chip${G.photo==='c'?' on':''}" onclick="crPhoto('c')" style="width:auto">Mon visage de personnage</button></div>`+`<div class="row" style="border:0;gap:8px;margin-bottom:6px"><button class="chip${G.look.s==='f'?' on':''}" onclick="setGenre('f')" style="width:auto">Fille</button><button class="chip${G.look.s==='h'?' on':''}" onclick="setGenre('h')" style="width:auto">Garçon</button></div>`
   +`<div class="avs">`+av.map(a=>`<button class="avb${G.photo===a?' on':''}" onclick="crPhoto('${a}')"><img src="img/avatars/${a}.jpg" alt=""></button>`).join('')+(userPhoto()?`<button class="avb${G.photo==='u'?' on':''}" onclick="crPhoto('u')"><img src="${userPhoto()}" alt=""></button>`:'')+`</div>`
   +`<label class="chip" style="cursor:pointer;display:block;margin-top:8px">📷 Ajouter ma propre photo<small>Reste sur cet appareil</small><input type="file" accept="image/*" style="display:none" onchange="crUpload(this)"></label>`
   +`<button class="p" onclick="closeDialog()">Fermer</button>`;
}
function setChar(c){G.real=c;if(c){G.look.s=c[1]==='f'?'f':'h';G.sexe=G.look.s}save();if(c)charAvatar(c);refreshHud();PM.resume();renderDialog()}
function setGenre(g){G.look.s=g;G.sexe=g;save();renderDialog()}
function openObjs(){openBox({kind:'objs'})}
function htmlObjs(){
  const n=nbItems(),t=Object.keys(ITEMS).length;
  return `<h3>Mes objets (${n}/${t})</h3>`+Object.keys(ITEMS).map(k=>`<div class="row"><span>${esc(ITEMS[k].n)}</span><b>${G.adv.items[k]?'✔':'—'}</b></div>`).join('')
   +`<p style="font-size:13px;margin-top:8px">Achète-les chez Maman Béa, au marché, avec les pièces gagnées en répondant aux questions et en cueillant des mangues.</p><button class="p" onclick="closeDialog()">Fermer</button>`;
}

// ---------- Photo de profil ----------
const PHOTO_KEY='kelas_photo_v1';
function userPhoto(){try{return localStorage.getItem(PHOTO_KEY)}catch(e){return null}}
let charAv={};
function charAvatar(id){
  if(charAv[id])return charAv[id];
  charAv[id]=null;
  const im=new Image();im.onload=()=>{
    const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d'),sw=im.width,sh=im.height*.2;
    const k=Math.max(96/sw,96/sh),w=sw*k,h=im.height*k;x.drawImage(im,(96-w)/2,0,w,h);
    charAv[id]=c.toDataURL('image/png');refreshHud();
  };im.src='img/chars/'+id+'.webp';return null;
}
function photoUrl(){
  if(G.photo==='c')return charAvatar(playerChar());
  if(G.photo==='u')return userPhoto();
  if(G.photo&&window.__MAN&&(window.__MAN.avatars||[]).includes(G.photo))return 'img/avatars/'+G.photo+'.jpg';
  return null;
}
function crPhoto(id){G.photo=id;save();refreshHud();if(G.dialog&&G.dialog.kind==='profile')renderDialog();else renderCreator()}
function crUpload(inp){
  const f=inp.files&&inp.files[0];if(!f)return;
  const img=new Image(),url=URL.createObjectURL(f);
  img.onload=()=>{
    const c=document.createElement('canvas');c.width=160;c.height=213;
    const x=c.getContext('2d'),k=Math.max(160/img.width,213/img.height),w=img.width*k,h=img.height*k;
    x.drawImage(img,(160-w)/2,(213-h)/2,w,h);URL.revokeObjectURL(url);
    try{const d=x.getImageData(68,95,24,30).data;let r=0,g=0,b=0,n=d.length/4;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2]}
      window.__FACES=Object.assign(window.__FACES||{},{_user:{x:.2,y:.1,w:.6,h:.45,skin:'#'+[r,g,b].map(v=>Math.round(v/n).toString(16).padStart(2,'0')).join('')}});setFaces(window.__FACES)}catch(e){}
    try{localStorage.setItem(PHOTO_KEY,c.toDataURL('image/jpeg',.82));G.photo='u';save();refreshHud();if(G.dialog&&G.dialog.kind==='profile')renderDialog();else renderCreator();toast('Ta photo est enregistrée sur cet appareil.')}
    catch(e){toast('Impossible d’enregistrer la photo.')}
  };
  img.onerror=()=>toast('Cette image ne peut pas être lue.');
  img.src=url;
}

// ---------- Créateur de personnage ----------
const CATS={hair:HAIRS,acc:ACCS,outfit:OUTFITS};
const CR={tab:'perso',prev:null,from:'play',ang:0};
function isOwned(kind,id){
  const d=CATS[kind][id];if(!d)return false;
  if(d.own)return true;
  if(d.unlock&&doneNpc(d.unlock))return true;
  if(G.adv.bought[kind+':'+id])return true;
  if(kind==='outfit')for(const lv in LEVEL_UNLOCKS){if(lvl()>=+lv&&LEVEL_UNLOCKS[lv].outfits.indexOf(id)>=0)return true}
  return false;
}
function lockText(kind,id){
  const d=CATS[kind][id];
  if(d.price)return d.price+' 🪙';
  if(d.unlock)return 'Quête : '+NPC[d.unlock].name;
  for(const lv in LEVEL_UNLOCKS)if(LEVEL_UNLOCKS[lv].outfits&&LEVEL_UNLOCKS[lv].outfits.indexOf(id)>=0)return 'Niveau '+lv;
  return '';
}
function newUnlocks(questId){
  const out=[];
  [['hair',HAIRS],['acc',ACCS],['outfit',OUTFITS]].forEach(c=>Object.keys(c[1]).forEach(k=>{if(c[1][k].unlock===questId)out.push(c[1][k].n)}));
  return out;
}
function pendingItems(){
  const L=G.look,list=[];
  if(!isOwned('hair',L.hair))list.push({kind:'hair',id:L.hair});
  if(!isOwned('outfit',L.outfit))list.push({kind:'outfit',id:L.outfit});
  L.acc.forEach(a=>{if(!isOwned('acc',a))list.push({kind:'acc',id:a})});
  return list;
}
function rebuildPlayer(){
  const old=playerObj;
  playerObj=makePlayer();
  playerObj.position.set(G.x,0,G.z);playerObj.rotation.y=G.ry;
  scene.add(playerObj);
  if(old){scene.remove(old);old.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
}
let rbPend=false;
function rebuildSoon(){if(rbPend)return;rbPend=true;requestAnimationFrame(()=>{rbPend=false;rebuildPlayer()})}
function hudVisible(v){['joy','actwrap','top','info','mmw'].forEach(i=>$(i).classList.toggle('hide',!v))}
function openCreator(from){
  CR.from=from;CR.tab='perso';CR.prev=JSON.parse(JSON.stringify(G.look));
  G.mode='creator';G.joy.x=G.joy.y=0;G.key.x=G.key.y=0;resetKnob();hideBubble();
  CR.ang=0;G.ry=0;rebuildPlayer();
  hudVisible(false);$('creator').classList.remove('hide');
  {const re=!!G.real,P=playerObj.position;camera.fov=30;camera.updateProjectionMatrix();camera.position.set(P.x,re?1.25:1.45,P.z+(re?3.9:2.35))}
  renderCreator();
}
function creatorDone(){
  const L=G.look,P=CR.prev;
  if(!isOwned('hair',L.hair))L.hair=P.hair;
  if(!isOwned('outfit',L.outfit))L.outfit=P.outfit;
  L.acc=L.acc.filter(a=>isOwned('acc',a));
  save();rebuildPlayer();
  $('creator').classList.add('hide');camera.clearViewOffset();resize();
  if(CR.from==='photo'){
    $('cv').style.display='none';G.mode='pview';hudVisible(true);['joy','actwrap'].forEach(i=>$(i).classList.add('hide'));
    PM.resume();refreshHud();return;
  }
  if(CR.from==='start'){startCine()}
  else{G.mode='play';hudVisible(true);snapCamera();refreshHud()}
}
const chip=(label,active,onclick,sub)=>`<button class="chip${active?' on':''}" onclick="${onclick}">${label}${sub?`<small>${sub}</small>`:''}</button>`;
const sw=(color,active,onclick)=>`<button class="swt${active?' on':''}" style="background:${color}" onclick="${onclick}" aria-label="couleur"></button>`;
const slider=(label,key)=>`<label class="sl"><span>${label}</span><input type="range" min="0" max="100" value="${Math.round(G.look[key]*100)}" oninput="crSlide('${key}',this.value)"></label>`;
function renderCreator(){
  const L=G.look,tabs=G.real?[['perso','Personnage'],['photo','Photo']]:[['perso','Personnage'],['visage','Visage'],['cheveux','Cheveux'],['teint','Teint'],['acc','Accessoires'],['tenue','Tenue'],['photo','Photo']];
  if(!tabs.some(t=>t[0]===CR.tab))CR.tab='perso';
  let h=`<div class="crh"><b>Mon personnage</b><span>🪙 ${G.adv.pieces}</span><button class="p" onclick="creatorDone()">Terminer</button></div>`;
  h+=`<div class="tabs">`+tabs.map(t=>`<button class="${CR.tab===t[0]?'on':''}" onclick="crTab('${t[0]}')">${t[1]}</button>`).join('')+`</div><div class="crb">`;
  if(CR.tab==='perso'){
    h+=`<div class="lb">Style de personnage</div><div class="chips">`+chip('Réaliste (photo)',!!G.real,`crStyle('real')`)+chip('3D personnalisable',!G.real,`crStyle('3d')`)+`</div>`;
    if(G.real){
      h+=`<div class="lb">Choisis ton personnage</div><div class="avs">`+['pf1','pf2','ph1','ph2'].map(c=>`<button class="avb${G.real===c?' on':''}" onclick="crChar('${c}')"><img src="img/chars/${c}.webp" alt="" style="object-fit:contain;object-position:top"></button>`).join('')+`</div>`;
    }else h+=`<p style="font-size:13px;margin:8px 0">Règle le visage, les cheveux, le teint, les accessoires et la tenue avec les onglets.</p>`;
  }else if(CR.tab==='visage'){
    h+=slider('Largeur du visage','faceW')+slider('Mâchoire','jaw')+slider('Taille des yeux','eyeS')+slider('Nez','nose')+slider('Lèvres','lips')+slider('Joues roses','blush');
    h+=`<div class="lb">Sourcils</div><div class="chips">`+['Fins','Épais','Arqués'].map((n,i)=>chip(n,L.brow===i,`crSet('brow',${i})`)).join('')+`</div>`;
    h+=`<div class="lb">Couleur des yeux</div><div class="sws">`+EYE_COLORS.map((c,i)=>sw(c,L.eyeC===i,`crSet('eyeC',${i})`)).join('')+`</div>`;
    h+=`<div class="lb">Couleur des lèvres</div><div class="sws">`+LIP_COLORS.map((c,i)=>sw(c,L.lipC===i,`crSet('lipC',${i})`)).join('')+`</div>`;
    if(L.s==='h')h+=`<div class="lb">Barbe</div><div class="chips">`+['Aucune','Légère','Complète'].map((n,i)=>chip(n,L.beard===i,`crSet('beard',${i})`)).join('')+`</div>`;
  }else if(CR.tab==='cheveux'){
    h+=`<div class="lb">Coiffure</div><div class="chips">`+Object.keys(HAIRS).map(k=>chip(HAIRS[k].n,L.hair===k,`crHair('${k}')`,isOwned('hair',k)?'':'🔒 '+lockText('hair',k))).join('')+`</div>`;
    h+=`<div class="lb">Couleur des cheveux</div><div class="sws">`+HAIR_COLORS.map((c,i)=>sw(c,L.hairC===i,`crSet('hairC',${i})`)).join('')+`</div>`;
  }else if(CR.tab==='teint'){
    h+=`<div class="lb">Je suis</div><div class="chips">`+chip('Une fille',L.s==='f',`crSet('s','f')`)+chip('Un garçon',L.s==='h',`crSet('s','h')`)+`</div>`;
    h+=`<div class="lb">Teint de la peau</div><div class="sws">`+SKIN_TONES.map((c,i)=>sw(c,L.skin===i,`crSet('skin',${i})`)).join('')+`</div>`;
  }else if(CR.tab==='acc'){
    h+=`<div class="lb">Accessoires</div><div class="chips">`+Object.keys(ACCS).map(k=>chip(ACCS[k].n,L.acc.indexOf(k)>=0,`crAcc('${k}')`,isOwned('acc',k)?'':'🔒 '+lockText('acc',k))).join('')+`</div>`;
  }else if(CR.tab==='photo'){
    const av=((window.__MAN&&window.__MAN.avatars)||[]).filter(a=>a[0]===L.s);
    h+=`<div class="lb">Ma photo de profil</div><div class="avs">`+av.map(a=>`<button class="avb${G.photo===a?' on':''}" onclick="crPhoto('${a}')"><img src="img/avatars/${a}.jpg" alt=""></button>`).join('')
      +(userPhoto()?`<button class="avb${G.photo==='u'?' on':''}" onclick="crPhoto('u')"><img src="${userPhoto()}" alt=""></button>`:'')+`</div>`;
    h+=`<div class="chips" style="margin-top:8px"><label class="chip" style="cursor:pointer">📷 Ajouter ma propre photo<small>Reste sur cet appareil</small><input type="file" accept="image/*" style="display:none" onchange="crUpload(this)"></label>`
      +chip('Aucune photo',!G.photo,`crPhoto(null)`)+`</div>`;
  }else{
    h+=`<div class="lb">Tenue</div><div class="chips">`+Object.keys(OUTFITS).map(k=>chip(OUTFITS[k].n,L.outfit===k,`crOutfit('${k}')`,isOwned('outfit',k)?'':'🔒 '+lockText('outfit',k))).join('')+`</div>`;
    h+=`<div class="lb">Couleur de la tenue</div><div class="sws">`+OUTFIT_COLORS.map((c,i)=>sw(c,L.outfitC===i,`crSet('outfitC',${i})`)).join('')+`</div>`;
  }
  h+=`</div>`;
  const pend=pendingItems();
  if(pend.length){
    const tot=pend.reduce((a,p)=>a+(CATS[p.kind][p.id].price||0),0);
    h+=`<div class="buy"><span>Essayage : ${pend.map(p=>esc(CATS[p.kind][p.id].n)).join(', ')} — ${tot} 🪙</span><button class="p" onclick="crBuy()">Acheter</button></div>`;
  }
  $('creator').innerHTML=h;
}
function crStyle(m){
  if(m==='real'){const ok=['pf1','pf2','ph1','ph2'].some(hasChar);G.real=ok?(G.look.s==='f'?'pf1':'ph1'):null}
  else G.real=null;
  rebuildPlayer();renderCreator();
}
function crChar(id){G.real=id;G.look.s=id[1]==='f'?'f':'h';G.sexe=G.look.s;rebuildPlayer();renderCreator()}
function crTab(t){CR.tab=t;renderCreator()}
function crSlide(k,v){G.look[k]=v/100;rebuildSoon()}
function crSet(k,v){
  G.look[k]=v;
  if(k==='s'){G.sexe=v;if(v==='f'&&G.look.beard)G.look.beard=0}
  rebuildSoon();renderCreator();
}
function crTryable(kind,id){
  const d=CATS[kind][id];
  if(isOwned(kind,id)||d.price)return true;
  toast(lockText(kind,id)+' pour débloquer : '+d.n);SFX.ko();return false;
}
function crHair(id){if(!crTryable('hair',id))return;G.look.hair=id;rebuildSoon();renderCreator()}
function crOutfit(id){if(!crTryable('outfit',id))return;G.look.outfit=id;rebuildSoon();renderCreator()}
function crAcc(id){
  const a=G.look.acc,i=a.indexOf(id);
  if(i>=0)a.splice(i,1);else{if(!crTryable('acc',id))return;a.push(id)}
  rebuildSoon();renderCreator();
}
function crBuy(){
  const pend=pendingItems();
  const tot=pend.reduce((a,p)=>a+(CATS[p.kind][p.id].price||0),0);
  if(G.adv.pieces<tot){toast('Il te manque '+(tot-G.adv.pieces)+' pièces.');SFX.ko();return}
  G.adv.pieces-=tot;pend.forEach(p=>{G.adv.bought[p.kind+':'+p.id]=true});
  save();refreshHud();SFX.coin();toast('Achat réussi !');renderCreator();
}
function shopMode(){closeDialog();openCreator('play')}

// ---------- Écran de départ ----------
function setSexe(s){G.sexe=s;G.look.s=s;if(s==='f'&&G.look.beard)G.look.beard=0;$('fille').className=s==='f'?'p':'';$('garcon').className=s==='h'?'p':''}
$('fille').onclick=()=>setSexe('f');
$('garcon').onclick=()=>setSexe('h');
function enterPhoto(intro){
  $('start').classList.add('hide');$('cv').style.display='none';
  hudVisible(true);['joy','actwrap'].forEach(i=>$(i).classList.add('hide'));$('cine').classList.add('hide');
  G.ui='photo';G.mode='pview';
  PM.show('village');refreshHud();
  if(intro)openBox({kind:'info',title:'Bienvenue, '+G.nom+' !',i:0,lines:[
    'Tu es devant ta maison, dans ton quartier de Kinshasa. Touche les flèches pour te déplacer, touche les personnes pour leur parler, et fais glisser ton doigt pour regarder autour de toi.',
    'Ton but : aller à l’école LEXARIS ACADÉMIE. Mama Lola garde le portail : réponds à ses questions pour entrer.',
    'En chemin, cueille des mangues, vends-les à Maman Béa au marché, et gagne des pièces.']});
}
function enterGame(newGame){
  $('start').classList.add('hide');
  G.sc='ville';G.x=-22;G.z=-3.6;G.phi=-Math.PI/2;G.ry=Math.PI;
  if(newGame){buildScene();G.mode='creator';openCreator('start')}
  else{
    G.mode='play';
    ['joy','actwrap'].forEach(i=>$(i).classList.remove('hide'));
    buildScene();refreshHud();
  }
}
$('go').onclick=()=>{
  const n=$('nom').value.trim()||'Kito';
  G.ui='3d';G.photo=G.sexe==='f'?'f1':'h1';$('cv').style.display='block';
  G.nom=n;G.adv=newAdv();G.real=null;
  G.look=Object.assign({},DEFAULT_LOOK,{acc:[],s:G.sexe,hair:G.sexe==='f'?'tresses':'courtes'});
  save();
  enterGame(true);
};
$('cpt').onclick=()=>openEsp();
// ---------- rappel des communiqués non lus : 5 secondes à l'écran, puis de nouveau après 2 minutes ----------
let ncT=null;
const NC_AFFICHE=5000,NC_PAUSE=120000,NC_RETRY=15000;
function ncBoucle(delai){
  clearTimeout(ncT);
  ncT=setTimeout(async()=>{
    const s=CLOUD.session();
    if(!s||s.role!=='eleve'){ncBoucle(s?NC_PAUSE:NC_RETRY);return}
    const ok=['play','mini','mj','cond'].includes(G.mode)&&!document.hidden;
    if(!ok){ncBoucle(NC_RETRY);return}
    let n=0;try{n=await Esp.nonLus()}catch(e){}
    if(!n){ncBoucle(NC_PAUSE);return}
    $('nctxt').textContent=n>1?'('+n+')':'';
    $('notifcom').classList.remove('hide');
    setTimeout(()=>$('notifcom').classList.add('hide'),NC_AFFICHE);
    ncBoucle(NC_AFFICHE+NC_PAUSE);
  },delai);
}
$('notifcom').onclick=()=>{
  $('notifcom').classList.add('hide');
  if(G.mode==='play'){openEsp('');setTimeout(()=>{if(Esp.actions.espEv)Esp.actions.espEv('commes')},60)}
  else toast('Tu pourras lire ton communiqué après cette activité : ☰ puis Mon compte.');
};
// ---------- page d'accueil : présentation puis vraie page d'accueil ----------
function majRestauration(){
  let b=document.getElementById('hrestore');
  const sv=lireBrut(KEY),c=copies()[0];
  const utile=c&&nbFaites(c.s)>nbFaites(sv);
  if(!utile){if(b)b.remove();return}
  if(!b){b=document.createElement('button');b.id='hrestore';b.style.cssText='margin:8px 0;padding:10px;border-radius:12px;border:2px solid #e0a526;background:#fff8e1;font-weight:700;width:100%';$('cont').insertAdjacentElement('afterend',b)}
  b.textContent='🛟 Récupérer ma progression sauvegardée ('+nbFaites(c.s)+' missions)';
  b.onclick=()=>{if(confirm('Restaurer la copie de secours de '+(c.s.nom||'ta partie')+' avec '+nbFaites(c.s)+' missions accomplies ?')){sansFlush=true;try{localStorage.setItem(KEY,JSON.stringify(c.s))}catch(e){}location.reload()}};
}
function majAccueil(){
  majRestauration();
  const s=CLOUD.session(),sv=readSave(),a=!!(sv&&sv.nom);
  $('hreprise').classList.toggle('hide',!a);
  $('cont').classList.toggle('hide',!a);
  $('hcompte').classList.toggle('hide',!s);
  $('hvisiteur').classList.toggle('hide',!!s);
  $('hstat').textContent=s?(s.pseudo+' · '+({eleve:'élève',enseignant:'enseignant',parent:'parent',etablissement:'établissement',admin:'administrateur'}[s.role]||s.role)):'';
}
// feuille « Ton aventure commence » : prénom et choix du personnage (parcours existant de l'Exploration)
function ouvrirNouvelle(msg){$('hnewmsg').textContent=msg||'';$('hnew').classList.remove('hide')}
function entrerPuis(f){
  $('cv').style.display='block';
  if(G.ui==='photo')enterPhoto(false);else enterGame(false);
  setTimeout(f,600);
}
function openEspForm(mode,role){
  G.depart=true;G.dialog={kind:'esp',vue:'form',mode:mode,role:role||'eleve',msg:''};$('dlg').style.zIndex='9';renderDialog();
}
const confirmee=CLOUD.confirmationRecue();   // lien de confirmation d'adresse reçu par e-mail
const jetonRec=CLOUD.jetonRecuperation();   // lien « mot de passe oublié » reçu par e-mail
$('wcont').onclick=()=>{
  AUD.unlock();$('welcome').classList.add('hide');$('start').classList.remove('hide');majAccueil();majMusique();
  if(CLOUD.session())setTimeout(()=>Esp.rattrapage(),2500);
  ncBoucle(9000);
  if(jetonRec){openEsp('');setTimeout(()=>Esp.actions.espRecuperation(jetonRec),30)}
  else if(confirmee){openEspForm('connecter','enseignant');setTimeout(()=>{if(G.dialog)G.dialog.msg='Ton adresse est confirmée ! Connecte-toi avec ton adresse Gmail et ton mot de passe.';renderDialog()},30)}
};
$('hlog').onclick=()=>openEspForm('connecter');
$('hins').onclick=()=>openEsp('');
$('cpt2').onclick=()=>openEsp();
$('hexp').onclick=()=>{const sv=readSave();if(sv&&sv.nom)$('cont').click();else ouvrirNouvelle('')};
$('hnouv').onclick=()=>ouvrirNouvelle('Une nouvelle partie remplacera la partie enregistrée sur cet appareil.');
$('hnewx').onclick=()=>$('hnew').classList.add('hide');
$('hacc').onclick=()=>{if(CLOUD.session())openEsp();else openEspForm('connecter')};
// Missions scolaires : un compte est nécessaire (connexion si on n'est pas connecté)
$('hmis').onclick=()=>{
  if(!CLOUD.session()){openEspForm('connecter');return}
  const sv=readSave();
  if(sv&&sv.nom)entrerPuis(openProg);else ouvrirNouvelle('Crée d’abord ton personnage : tes missions scolaires s’ouvriront ensuite.');
};
$('hhis').onclick=()=>entrerPuis(openCarnet);
$('hcom').onclick=()=>entrerPuis(openComp);
$('hcla').onclick=()=>{const s=CLOUD.session();openEsp(s&&s.role==='enseignant'?'classes':'mm')};
$('cont').onclick=()=>{if(G.ui==='photo')enterPhoto(false);else{$('cv').style.display='block';enterGame(false)}};

Object.assign(window,Esp.actions,EN.actions,SUP.actions,MUSEE.actions,AV.actions,CC.actions,ANI.actions,MET.actions,SIM.actions,MUSIC.actions,MUSACT,RES.actions,AMEN.actions,DETEC.actions,SCIE.actions,HOPI.actions,DESI.actions,FASH.actions,VILL.actions,ESPA.actions,{acheterCarb,monter,descendre,klaxonner,ouvrirPompe,basculerCommande,__CARB:niveauCarb,bonusMJ,condDemarrer,condSuite,condEcouter,speak,inscNegocier,inscReponse,inscPayer,__condTick:condTick,acheterVeh,startConduite,answerCond,condSortir,__ae:()=>AE,visiterMission,libreSerie,louerTerrain,encaisserLoyer,demolirTerrain,demolirAnnuler,payerRond,openCongo,congoProv,acheterTerrain,construireTerrain,payerRoute,__ROUTE:bitumerRoute,mapProv,toggleMusic,startMini,openComp,compNiv,reviserCle,__REV:aReviser,construire,buyRes,openMaison,startMJ,sellSac,openShop,__CZ:()=>CZ_Q,__AUD:AUD,__MUS:MUS,__GO:(sc,x,z,phi)=>goTo({to:sc,tx:x,tz:z,phi}),__SC:()=>SCENES,__STG:()=>STAGES,__MJ_IDS:()=>MJ,__MJPOS:mjPos,suivantAventure,openCarnet,carnetBasc,installer,openSuite,__M3:M3,__CAM:camera,__CLES:()=>Object.keys(CONTENU),nextLine,jeuOrdre,jeuOrdreRaz,jeuOrdreOk,jeuPan,jeuPanOk,jeuPanTotal,jeuTriPick,jeuTriPose,openEsp,openProg,progGo,progBack,startMission,__NPCDATA:NPC,travel,openMap,cycleQuality,openCreatorFromPhoto,setChar,openProfile,setGenre,replay,toggleVoice,crStyle,crChar,crPhoto,crUpload,crTab,crSlide,crSet,crHair,crOutfit,crAcc,crBuy,creatorDone,shopMode,nextLine,answerQ,nextQ,closeDialog,infoNext,sellMangoes,buy,toggleSound,resetGame,__G:G,__W:()=>W,__snap:()=>snapCamera(),__dbg:()=>({cam:camera.position.toArray().map(v=>+v.toFixed(1)),bea:npcObjs.bea&&npcObjs.bea.obj.position.toArray(),beaVis:npcObjs.bea&&npcObjs.bea.obj.visible,n:Object.keys(npcObjs)})});

// ---------- Installation comme application (Android, iPhone, ordinateur) ----------
let invite=null;
const autonome=()=>(window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
const estIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function majInstall(){$('inst').classList.toggle('hide',autonome())}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();invite=e;majInstall()});
window.addEventListener('appinstalled',()=>{invite=null;majInstall();try{toast('Application installée !')}catch(x){}});
function installer(){
  if(invite){const i=invite;invite=null;i.prompt();i.userChoice.finally(majInstall);return}
  let l;
  if(estIOS())l=['Pour installer BOYEKOLI PLAY sur iPhone ou iPad, ouvre ce site avec Safari.','Touche le bouton Partager (le carré avec une flèche vers le haut, en bas de l’écran).','Fais défiler et touche « Sur l’écran d’accueil », puis « Ajouter ». L’icône BOYEKOLI apparaît avec tes autres applications.'];
  else l=['Sur Android avec Chrome : touche le menu ⋮ (en haut à droite), puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».','Sur ordinateur avec Chrome ou Edge : clique sur l’icône d’installation dans la barre d’adresse.','Une fois installée, l’application s’ouvre en plein écran et fonctionne même avec une mauvaise connexion.'];
  if(G.mode==='start'){G.depart=true;$('dlg').style.zIndex='9'}
  openBoxInstall(l);
}
function openBoxInstall(l){
  const d={kind:'info',title:'Installer BOYEKOLI PLAY',i:0,lines:l};
  if(G.mode==='start'){G.dialog=d;renderDialog()}else openBox(d);
}
$('inst').onclick=installer;
majInstall();
if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)){
  window.addEventListener('load',()=>{try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}});
}

// ---------- Démarrage ----------
const playerChar=()=>['pf1','pf2','ph1','ph2'].includes(G.real)?G.real:(G.look.s==='f'?'pf1':'ph1');
const makePlayer3D=()=>makeHuman(Object.assign({},G.look,{h:1},playerFace()));
const PA={makePlayer3D,playerChar,G,NPC,AUTOP,AUTO,actionFor,locked,doneNpc,doorOpen,toast,speak,SFX,gain,save,refreshHud,openBox,esc,hasChar,openObjs};
assignerScolaire();
initPhoto(PA);const PM=PA.photo;
function init(){
  const s=readSave();
  CLOUD.vider();
  resize();applyQuality();
  if(s&&s.nom){
    G.nom=s.nom;G.ui='3d';G.photo=s.photo||null;G.real=s.real===undefined?null:s.real;G.voice=s.voice!==false;G.sound=s.sound!==false;G.music=s.music!==false;
    G.look=Object.assign({},DEFAULT_LOOK,{acc:[]},s.look||{s:s.sexe||'f',skin:s.skin||3});G.sexe=G.look.s;
    G.adv=Object.assign(newAdv(),s.adv||{});
    $('nom').value=s.nom;
    $('cont').textContent='Continuer · '+s.nom+' (niveau '+lvl()+')';
    $('cont').classList.remove('hide');
    $('go').textContent='Nouvelle partie';$('go').className='p';
  }
  setSexe(G.sexe);refreshHud();
  G.sc='ville';G.x=-22;G.z=-3.6;G.phi=-Math.PI/2;G.ry=Math.PI;
  if(G.ui!=='photo'||!s||!s.nom){/* fond 3D inutile : la photo sert de décor */}
  $('cv').style.display='none';
  $('lb').style.width='100%';
  majAccueil();
  setTimeout(()=>{$('load').classList.add('hide');$('welcome').classList.remove('hide')},150);
  G.mode='start';
  requestAnimationFrame(loop);
}
fetch('img/manifest.json').then(r=>r.ok?r.json():{}).catch(()=>({})).then(async m=>{
  window.__MAN=m||{};setManifest(m);
  try{const f=await (await fetch('img/faces.json')).json();window.__FACES=f;setFaces(f)}catch(e){window.__FACES={}}
  init();
});

