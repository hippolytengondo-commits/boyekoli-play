// MISSIONS BOYEKOLI : 50 missions qui se jouent À L'INTÉRIEUR des jeux (Science Lab, Medical Center, Design Studio, Fashion Studio,
// Smart City, Space Explorer, détectives, musique, vol). Chaque mission mêle un territoire de la RDC, sa province, un point du programme
// scolaire (question de cours) et un objectif de jeu détecté par événements envoyés par les jeux (D.mis.evt).
import {MISSIONS50,JEUX,CHAPITRES} from './missions50/data.js';
import {PROGRAMME} from './programme.js';
const GATE={sci:'sci',med:'med',det:'det',ds:'ds',fs:'fs',sp:'sp',mus:'mus',vol:'vol'};

export function creerMissions50(D){
  const {PAR,G,esc,SFX,save,refreshHud,toast}=D;
  const bloque=m=>GATE[m.jeu]&&window.__ACC&&!window.__ACC.ouvert(GATE[m.jeu]);
  const A=()=>G.adv;
  const S=()=>{const a=A();if(!a.m50)a.m50={actif:null,prog:0,done:{},stars:{}};const s=a.m50;if(!s.done)s.done={};if(!s.stars)s.stars={};return s};
  const find=id=>MISSIONS50.find(m=>m.id===id);
  const actif=()=>{const s=S();return s.actif?find(s.actif):null};
  const nbChap=c=>MISSIONS50.filter(m=>m.chap===c&&S().done[m.id]).length;
  const ouvert=c=>c===0||nbChap(c-1)>=5;
  let modal=null,Q=null;
  const btn=(t,oc,bg)=>`<button onclick="${oc}" style="display:block;width:100%;text-align:left;padding:11px 12px;margin:5px 0;border-radius:12px;border:2px solid #fff4;background:${bg||'#2f4a63'};color:#fff;font:600 15px system-ui;touch-action:manipulation">${t}</button>`;
  // ---------- événements envoyés par les jeux
  function evt(jeu,type,p){
    const m=actif();if(!m||m.ev!==jeu+'.'+type)return;
    try{if(m.pr&&!m.pr(p))return}catch(e){return}
    const s=S();s.prog=(s.prog||0)+1;save();banniere();
    if(s.prog>=m.n)terminer(m)}
  // ---------- bandeau d'objectif à l'intérieur du jeu
  function banniere(){
    const m=actif();document.querySelectorAll('#m50ban').forEach(e=>e.remove());if(!m)return;const J=JEUX[m.jeu];if(!J||!J.ov)return;const ov=document.getElementById(J.ov);if(!ov)return;
    const b=document.createElement('div');b.id='m50ban';b.setAttribute('onclick','m50Brief(\''+m.id+'\')');
    b.style.cssText='position:absolute;top:calc(max(env(safe-area-inset-top),22px) + 44px);left:8px;right:8px;z-index:35;background:rgba(255,213,79,.96);color:#222;border-radius:12px;padding:5px 9px;font:600 12px system-ui;box-shadow:0 2px 8px #0007';
    b.innerHTML='🎯 <b>'+esc(m.titre)+'</b> · '+esc(m.but)+(m.n>1?' ('+S().prog+'/'+m.n+')':'')+' <span style="opacity:.6">▸ détails</span>';ov.appendChild(b)}
  try{new MutationObserver(ms=>ms.forEach(r=>r.addedNodes.forEach(n=>{const m=actif();if(m&&n.nodeType===1&&n.id&&JEUX[m.jeu]&&n.id===JEUX[m.jeu].ov)setTimeout(banniere,80)}))).observe(document.body,{childList:true})}catch(e){}
  // ---------- fenêtres
  function fenetre(h,z){
    fermer();modal=document.createElement('div');modal.id='m50fen';
    modal.style.cssText='position:fixed;inset:0;z-index:'+(z||9100)+';background:#0f1a2b;color:#fff;font-family:system-ui,sans-serif;overflow:auto;padding:max(env(safe-area-inset-top),52px) 12px 96px';
    modal.innerHTML=h+'<button onclick="m50Close()" style="position:fixed;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));z-index:2;padding:12px 22px;border-radius:26px;border:3px solid #fff;background:#b23a3a;color:#fff;font:700 16px system-ui">⬅ Retour</button>';
    document.body.appendChild(modal);modal.scrollTop=0}
  function fermer(){if(modal){modal.remove();modal=null}}
  const bulle=(nom,t)=>`<div style="background:#fff;color:#111;border:3px solid #111;border-radius:20px;padding:8px 13px 10px;font:600 15px/1.4 system-ui;margin:8px 0 14px;position:relative"><div style="font-size:11px;color:#c0392b;font-weight:800">${esc(nom)}</div>${esc(t)}<div style="position:absolute;bottom:-14px;left:30px;border-left:10px solid transparent;border-right:10px solid transparent;border-top:14px solid #111"></div></div>`;
  const GUIDES={lola:'Mama Lola',junior:'Junior',ilunga:'Ilunga',mavungu:'Mavungu',bea:'Maman Béa'};
  function coursLien(m){
    const [n,mt,i]=m.cours.cle.split('|'),niv=PROGRAMME.find(x=>x.id===n),mat=niv&&niv.matieres.find(x=>x.id===mt),titre=mat&&mat.missions[+i];
    return (niv?niv.nom:'')+' · '+(mat?mat.nom:'')+(titre?' : « '+titre+' »':'')}
  function tableau(){
    const s=S(),fait=Object.keys(s.done).length;let h=`<h2 style="margin:4px 0">📜 Missions Boyekoli</h2><p style="font-size:13px;opacity:.9">50 missions à jouer <b>dans les jeux</b> : chaque mission te mène dans un territoire de la RDC, dans un jeu (Science Lab, hôpital, Design Studio, Smart City, espace…) et dans ton programme scolaire. Réussies : <b>${fait}/50</b>.</p><div style="background:#0a1220;border-radius:6px;height:10px"><div style="height:10px;width:${fait*2}%;background:#ffd54f;border-radius:6px"></div></div>`;
    CHAPITRES.forEach((c,ci)=>{
      const ok=ouvert(ci);h+=`<h3 style="margin:14px 0 2px;font-size:15px">${esc(c.nom)} ${ok?'':'🔒'}</h3><p style="font-size:12px;opacity:.8;margin:0 0 4px">${ok?esc(c.intro):'Réussis 5 missions du chapitre précédent pour débloquer ce chapitre.'}</p>`;
      if(ok)MISSIONS50.filter(m=>m.chap===ci).forEach(m=>{const d=s.done[m.id],J=JEUX[m.jeu],act=s.actif===m.id;
        h+=btn(`${d?'✅':bloque(m)?'🔒':act?'🎯':'▫️'} ${J.ico} <b>${esc(m.titre)}</b><br><span style="font-size:12px;opacity:.85;font-weight:400">${esc(m.t)} (${esc(m.prov)}) · ${esc(J.nom)}${bloque(m)?' · jeu bloqué':''} ${d?'· '+'⭐'.repeat(s.stars[m.id]||1):''}</span>`,`m50Brief('${m.id}')`,act?'#7a5a10':d?'#1f5a3a':'')})});
    fenetre(h)}
  function briefing(id){
    const m=find(id),J=JEUX[m.jeu],s=S(),act=s.actif===id;
    let h=`<div style="font-size:12px;opacity:.8">${esc(CHAPITRES[m.chap].nom)} · mission ${m.id.slice(1)}/50</div><h2 style="margin:2px 0">${J.ico} ${esc(m.titre)}</h2>`;
    h+=bulle(GUIDES[m.guide]||'Guide',m.hist);
    h+=`<div style="background:#16304a;border-radius:12px;padding:9px;font-size:13px;margin:6px 0">📍 <b>${esc(m.t)}</b> · province ${esc(m.prov)}<br>Chef-lieu : ${esc(m.cl)} · ${m.pop.toLocaleString('fr-FR')} habitants · ${m.km2.toLocaleString('fr-FR')} km²${m.fait?'<br>💡 '+esc(m.fait):''}</div>`;
    h+=`<div style="background:#2a2a16;border-radius:12px;padding:9px;font-size:13px;margin:6px 0">🎯 <b>Objectif dans le jeu</b><br>${esc(m.but)}<br><span style="opacity:.8">Lieu : ${esc(J.lieu)} (dans le village, à pied ou en véhicule), ou bouton ci-dessous.</span></div>`;
    h+=`<div style="background:#1a2a1a;border-radius:12px;padding:9px;font-size:13px;margin:6px 0">🎓 <b>Lien avec le programme</b><br>${esc(coursLien(m))}<br><span style="opacity:.8">À la fin, tu répondras à une question sur ce territoire et à une question de cours.</span></div>`;
    if(s.done[id])h+=`<p style="font-size:13px">✅ Déjà réussie ${'⭐'.repeat(s.stars[id]||1)} (tu peux la rejouer sans récompense).</p>`;
    h+=btn(act?'▶ Continuer dans '+esc(J.nom):'🚀 Accepter et entrer dans '+esc(J.nom),`m50Go('${id}')`,'#2e7d32')+btn('📜 Toutes les missions','m50Tableau()');
    fenetre(h);PAR.dire(m.hist,m.guide)}
  function aller(id){
    const m=find(id),s=S();if(!ouvert(m.chap)){toast('Ce chapitre est verrouillé.');return}
    if(s.actif!==id){s.actif=id;s.prog=0;save()}fermer();const J=JEUX[m.jeu];
    if(typeof window[J.open]==='function')window[J.open]();else toast('Va à '+J.lieu+' pour jouer cette mission.')}
  // ---------- fin de mission : bilan, questions, récompenses
  function terminer(m){
    const s=S();s.actif=null;s.prog=0;save();document.querySelectorAll('#m50ban').forEach(e=>e.remove());SFX.win&&SFX.win();
    Q={m,i:0,ok:0,fb:'',liste:[m.terr,m.cours]};bilan()}
  function bilan(){
    const m=Q.m,q=Q.liste[Q.i];
    if(!q){const s=S(),prem=!s.done[m.id],stars=1+Q.ok;s.done[m.id]=true;s.stars[m.id]=Math.max(s.stars[m.id]||0,stars);
      const a=A();let g=0;if(prem){g=m.pieces+(stars-1);a.pieces+=g;a.xp+=Math.round(g*1.5);refreshHud()}save();
      const n=Object.keys(s.done).length,ch=m.chap,debl=nbChap(ch)===5&&ch<4&&prem;
      fenetre(`<div style="text-align:center"><div style="font-size:46px">🎉</div><h2>Mission réussie !</h2><div style="font-size:32px">${'⭐'.repeat(stars)}</div><p style="font-size:14px">${esc(m.titre)} · ${esc(m.t)} (${esc(m.prov)})</p><p style="font-size:14px">${prem?'+'+g+' 🪙 · +'+Math.round(g*1.5)+' XP':'Mission déjà réussie : pas de nouvelle récompense.'}</p><p style="font-size:13px">Missions réussies : <b>${n}/50</b></p>${debl?'<p style="font-size:14px">🔓 <b>Nouveau chapitre débloqué : '+esc(CHAPITRES[ch+1].nom)+'</b></p>':''}${n>=50?'<p style="font-size:15px">🏆 <b>Bravo ! Tu as terminé les 50 missions : héros de tous les territoires !</b></p>':''}</div>`+btn('📜 Voir les missions','m50Tableau()','#2e7d32'),9600);
      PAR.dire('Mission réussie ! Bravo. Tu as '+stars+' étoile'+(stars>1?'s':'')+'.',m.guide);return}
    const titre=Q.i===0?'🗺 Question sur le territoire de '+m.t:'🎓 Question de cours';
    fenetre(`<div style="font-size:12px;opacity:.8">Rapport de mission · ${esc(m.titre)}</div><h3 style="margin:4px 0">${titre}</h3>`+bulle(GUIDES[m.guide]||'Guide',q.q)+q.c.map((x,i)=>btn(esc(x),`m50Rep(${i})`)).join('')+(Q.fb?`<p style="font-size:14px">${Q.fb}</p>`+btn('Suivant ▶','m50Suite()','#2e7d32'):''),9600);
    if(!Q.fb)PAR.dire(q.q,m.guide)}
  const actions={
    m50Tableau:()=>tableau(),m50Brief:id=>briefing(id),m50Go:id=>aller(id),m50Close:()=>{if(Q&&Q.liste[Q.i]){Q.i=Q.liste.length;Q.fb='';bilan();return}Q=null;fermer()},
    m50Rep:i=>{if(!Q||Q.fb)return;const q=Q.liste[Q.i],ok=q.c[i]===q.a;if(ok){Q.ok++;Q.fb='✅ Bravo ! '+esc(q.exp||'');SFX.ok&&SFX.ok()}else{Q.fb='❌ La bonne réponse : <b>'+esc(q.a)+'</b>. '+esc(q.exp||'');SFX.ko&&SFX.ko()}bilan();PAR.dire((ok?'Bravo. ':'Ce n’est pas ça. ')+(q.exp||''),Q.m.guide)},
    m50Suite:()=>{if(!Q)return;Q.i++;Q.fb='';bilan()}};
  return {actions,evt,tableau,actif,banniere,stats:()=>({faites:Object.keys(S().done).length,actif:S().actif,prog:S().prog}),test:{terminer:id=>terminer(find(id)),find}};
}
