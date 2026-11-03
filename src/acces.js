// ACCÈS PROGRESSIF : les jeux et les lieux s'ouvrent au fur et à mesure de la progression (missions réussies) et s'achètent
// avec les francs congolais (FC) gagnés en répondant juste aux questions. Les missions scolaires sont ouvertes dès le départ.
export const REGLES={
 ferme:{nom:'Boyekoli Farm',ico:'🌾',m:5,fc:50},sci:{nom:'Science Lab',ico:'🔬',m:8,fc:80},med:{nom:'Medical Center',ico:'🏥',m:12,fc:120},concession:{nom:'la Concession (motos et voitures)',ico:'🏍',m:12,fc:120},
 ds:{nom:'Design Studio',ico:'🏠',m:15,fc:150},vol:{nom:'l’Aéroport et le simulateur de vol',ico:'✈️',m:20,fc:200},det:{nom:'l’Agence de détectives',ico:'🕵️',m:22,fc:220},
 mus:{nom:'le Studio de musique',ico:'🎶',m:25,fc:250},fs:{nom:'Fashion Studio',ico:'👗',m:28,fc:280},sp:{nom:'Space Explorer',ico:'🚀',m:30,fc:300},ent:{nom:'Business Simulator',ico:'💼',m:35,fc:350}};
import {session} from './cloud.js';
export function creerAcces(D){
  const {PAR,G,esc,SFX,save,refreshHud,toast}=D;
  const A=()=>G.adv;
  const nbMissions=()=>Object.keys(A().done||{}).filter(k=>!/^(met|sup|jeu|bonus|stage):/.test(k)).length;
  // les joueurs qui ont déjà vraiment joué à un jeu gardent son accès
  const GP={sci:a=>a.sci&&Object.keys(a.sci.exp||{}).length,med:a=>a.med&&(Object.keys(a.med.cas||{}).length+Object.keys(a.med.svc||{}).length),det:a=>a.det&&Object.keys(a.det.cas||{}).length,ds:a=>a.deco2&&(a.deco2.proj||[]).length,fs:a=>a.mode2&&(a.mode2.port||[]).length,sp:a=>a.spat&&Object.keys(a.spat.done||{}).length,ferme:a=>a.agro&&a.agro.st&&a.agro.st.rec>0,ent:a=>a.ent,mus:a=>a.mus&&Object.keys(a.mus.cours||{}).length,vol:a=>a.pilote&&a.pilote.inscrit};
  // l'administrateur (compte connecté de rôle « admin », conservé sur l'appareil) accède à tout, sans missions ni FC
  const admin=()=>{try{const s=session();return !!s&&s.role==='admin'}catch(e){return false}};
  const ouvert=id=>{if(!REGLES[id]||admin())return true;const a=A();if(a.acces&&a.acces[id])return true;if(GP[id]&&GP[id](a)){if(!a.acces)a.acces={};a.acces[id]=true;return true}return false};
  const ico=id=>REGLES[id]?REGLES[id].ico:'';
  const msgBloque=id=>{const r=REGLES[id];return '🔒 '+r.nom+' : réussis '+r.m+' missions ('+Math.min(nbMissions(),r.m)+'/'+r.m+') et achète l’accès ('+r.fc+' FC)'};
  const lbl=(id,txt)=>ouvert(id)?txt:'🔒 '+txt+' (bloqué)';
  let modal=null;
  function fermer(){if(modal){modal.remove();modal=null}}
  function bloquer(id,apres){
    const r=REGLES[id],n=nbMissions(),fc=A().savoir||0,okM=n>=r.m,okF=fc>=r.fc;fermer();
    modal=document.createElement('div');modal.id='accesfen';modal.style.cssText='position:fixed;inset:0;z-index:9700;background:rgba(10,16,28,.96);color:#fff;font-family:system-ui,sans-serif;overflow:auto;padding:max(env(safe-area-inset-top),56px) 14px 96px';
    const barre=(v,m)=>`<div style="height:10px;background:#0a1220;border-radius:5px"><div style="height:10px;width:${Math.min(100,Math.round(v/m*100))}%;background:${v>=m?'#2e9e4a':'#ffd54f'};border-radius:5px"></div></div>`;
    modal.innerHTML=`<div style="text-align:center"><div style="font-size:52px">🔒</div><h2 style="margin:4px 0">${r.ico} ${esc(r.nom)}</h2><p style="font-size:14px;opacity:.9">Ce lieu est <b>fermé</b> pour l’instant. Il s’ouvre quand tu avances dans ton aventure : plus tu apprends, plus ton monde s’agrandit.</p></div>
    <div style="background:#16263a;border-radius:12px;padding:10px;margin:8px 0;font-size:14px">${okM?'✅':'⬜'} <b>Missions réussies</b> : ${n} / ${r.m}${barre(n,r.m)}<span style="font-size:12px;opacity:.85">Les missions scolaires (français, mathématiques, sciences…) et l’exploration du Congo comptent.</span></div>
    <div style="background:#16263a;border-radius:12px;padding:10px;margin:8px 0;font-size:14px">${okF?'✅':'⬜'} <b>Francs congolais (FC)</b> : ${fc} / ${r.fc}${barre(fc,r.fc)}<span style="font-size:12px;opacity:.85">Les FC se gagnent en répondant juste aux questions des missions.</span></div>
    ${okM&&okF?`<button onclick="accesAcheter('${id}')" style="display:block;width:100%;padding:14px;margin:8px 0;border-radius:14px;border:2px solid #fff;background:#2e7d32;color:#fff;font:700 17px system-ui">🔓 Acheter l’accès · ${r.fc} FC</button>`:`<p style="font-size:14px;text-align:center;margin:10px 0">${!okM?'Continue tes missions pour débloquer ce lieu.':'Il te manque <b>'+(r.fc-fc)+' FC</b> : réussis encore des questions !'}</p><button onclick="accesVoirMissions()" style="display:block;width:100%;padding:12px;margin:8px 0;border-radius:14px;border:2px solid #fff4;background:#2c7fb8;color:#fff;font:700 15px system-ui">🎓 Voir les missions scolaires</button>`}
    <button onclick="accesFermer()" style="position:fixed;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));padding:12px 22px;border-radius:26px;border:3px solid #fff;background:#b23a3a;color:#fff;font:700 16px system-ui">⬅ Retour</button>`;
    document.body.appendChild(modal);modal._apres=apres;PAR&&PAR.dire&&PAR.dire('Ce lieu est bloqué. Réussis '+r.m+' missions et rassemble '+r.fc+' francs congolais pour l’ouvrir.','bea')}
  function acheter(id){
    const r=REGLES[id];if(nbMissions()<r.m||(A().savoir||0)<r.fc){SFX.ko&&SFX.ko();return}
    A().savoir-=r.fc;if(!A().acces)A().acces={};A().acces[id]=true;refreshHud();save();SFX.win&&SFX.win();const ap=modal&&modal._apres;fermer();toast('🔓 Accès débloqué : '+r.nom+' !');if(ap)setTimeout(ap,200)}
  // enveloppe les fonctions d'ouverture : bloqué tant que l'accès n'est pas acheté
  function garder(actions,map){Object.keys(map).forEach(nom=>{const id=map[nom],f=actions[nom];if(typeof f!=='function')return;actions[nom]=(...a)=>{if(ouvert(id)){return f(...a)}bloquer(id,()=>f(...a))}})}
  const actions={accesAcheter:id=>acheter(id),accesFermer:()=>fermer(),accesVoirMissions:()=>{fermer();if(window.openProg){try{window.closeDialog&&window.closeDialog()}catch(e){}setTimeout(()=>window.openProg(),100)}}};
  return {actions,ouvert,admin,bloquer,garder,nbMissions,lbl,msgBloque,REGLES};
}
