// BOYEKOLI MUSIC STUDIO – Mon premier studio musical : studio 3D, instruments, cours, mini-jeux, composition, concert, badges.
// Tout est local à l'application : aucune exportation audio, les créations restent dans le profil de l'enfant.
import {creerSynth} from './musique/synth.js';
import {creerStudio3D} from './musique/scene3d.js';
import {INSTR,ZONES,FAMILLES,NOTES6,CLAVIER8,PISTES,COURS,BADGES,demo,AFRICAINS,PERCUSSIONS} from './musique/data.js';

export function creerMusique(D){
  const {G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const MUS=()=>{const a=A();if(!a.mus)a.mus={};const m=a.mus;['cours','jeux','instr','st','badges','vu'].forEach(k=>{if(!m[k])m[k]={}});if(!m.compos)m.compos=[];return m};
  let ov=null,ctx=null,syn=null,studio=null,V={ong:'instr'},hook=null,lecteur=null,rafV=0,visu=[],cer=[],cerOn=false,tOuv=0;
  let popH=null,escH=null;
  function quitter(depuisRetour){if(popH){window.removeEventListener('popstate',popH);popH=null}if(escH){window.removeEventListener('keydown',escH);escH=null}const aEnt=!!ov;fermerCadre();if(aEnt)closeDialog()}
  let draft=null,ecoute=false;const vues={};
  const $=id=>ov&&ov.querySelector('#'+id);
  const rot=(q,k)=>{const n=q.c.length,r=k%n,c=q.c.map((_,i)=>q.c[(i+r)%n]);return {q:q.q,c,a:c.indexOf(q.c[q.a]),exp:q.exp}};
  const btn=(t,oc,cls,st)=>`<button onclick="${oc}" style="padding:9px 11px;margin:3px;border-radius:12px;border:2px solid ${cls==='p'?'#2e7d32':cls==='on'?'#f1c40f':'#6a5a9a'};background:${cls==='p'?'#2e9e4a':cls==='on'?'#ffd54f':'#3a2d5c'};color:${cls==='on'?'#222':'#fff'};font-size:14px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const noteNom=m=>(CLAVIER8.find(k=>k[0]===m)||NOTES6.find(k=>k[0]===m)||[0,'♪'])[1];
  // ---------- son
  function audio(){if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();syn=creerSynth(ctx)}if(ctx.state==='suspended')ctx.resume();return syn}
  function son(inst,n,opt,piste){audio();syn.jouer(inst,n,undefined,Object.assign({bus:6,dur:.55},opt||{}));if(studio)studio.pulse(inst,piste)}
  function jouerSuite(inst,suite,dec){audio();const t0=ctx.currentTime+.05;suite.forEach(([n,dt])=>{syn.jouer(inst,n,t0+dt*(dec||1),{bus:6,dur:.5});visu.push({t:t0+dt*(dec||1),fn:()=>{if(studio)studio.pulse(inst);allumer(inst,n)}})});lanceVisu();return Math.max(...suite.map(s=>s[1]))*(dec||1)}
  function lanceVisu(){if(rafV)return;const b=()=>{if(!ctx){rafV=0;return}const t=ctx.currentTime;for(let i=visu.length-1;i>=0;i--)if(visu[i].t<=t){const e=visu.splice(i,1)[0];try{e.fn()}catch(x){}}rafV=visu.length||lecteur?requestAnimationFrame(b):0};rafV=requestAnimationFrame(b)}
  function allumer(inst,n){const id=INSTR[inst]&&INSTR[inst].mel?'key_'+n:'pad_'+n;const e=$(id);if(!e)return;e.style.filter='brightness(1.9)';e.style.transform='scale(1.06)';setTimeout(()=>{if(e){e.style.filter='';e.style.transform=''}},220)}
  // ---------- cadre
  function ouvrir(ong){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermerCadre(true);tOuv=Date.now();
    ov=document.createElement('div');ov.id='musov';
    ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#1a1230;color:#fff;display:flex;flex-direction:column;font-family:system-ui,sans-serif;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:linear-gradient(90deg,#7d3fd1,#d6302b,#e8a23a);color:#fff"><b style="flex:1;font-size:15px">🎵 BOYEKOLI MUSIC STUDIO <small style="font-weight:400;opacity:.9">Mon premier studio musical</small></b><button id="musx" style="padding:6px 12px;border-radius:8px;border:0;font-size:14px">✖ Quitter</button></div>
    <div id="mus3d" style="flex:0 0 38%;position:relative;min-height:150px"></div>
    <div id="muszones" style="display:flex;gap:4px;padding:4px 6px;background:#2a1f45;overflow-x:auto"></div>
    <div id="mustabs" style="display:flex;gap:3px;padding:3px 6px;background:#241a3c;overflow-x:auto"></div>
    <div id="muspan" style="flex:1;overflow:auto;padding:8px 10px;background:#1a1230"></div>`;
    document.body.appendChild(ov);
    ov.querySelector('#musx').onclick=()=>quitter();
    try{history.pushState({mus:1},'')}catch(e){}
    popH=()=>{if(ov)quitter(true)};window.addEventListener('popstate',popH);
    escH=e=>{if(e.key==='Escape'&&ov&&!document.getElementById('cerem'))quitter()};window.addEventListener('keydown',escH);
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    studio=creerStudio3D($('mus3d'),{low,onPick:id=>fiche(id)});
    $('muszones').innerHTML=ZONES.map(z=>`<button data-z="${z.id}" onclick="musZone('${z.id}')" style="flex:0 0 auto;padding:6px 10px;border-radius:14px;border:2px solid ${z.coul};background:#1a1230;color:#fff;font-size:12px;font-weight:600">${z.ico} ${z.nom}</button>`).join('');
    V={ong:ong||'instr'};dessineOnglets();rendre();
    parler('Bienvenue au studio de musique !');
  }
  function fermerCadre(silence){
    if(!ov)return;stopLecture();visu=[];hook=null;
    const s=Math.round((Date.now()-tOuv)/1000);if(s>8&&!silence){const t=A().tal||(A().tal={});t.musique=(t.musique||0)+Math.min(120,Math.floor(s/6));save()}
    if(studio){studio.stop();studio=null}
    if(ctx){try{ctx.close()}catch(e){}ctx=null;syn=null}
    ov.remove();ov=null;cerOn=false}
  function dessineOnglets(){
    const T=[['instr','🎸 Instruments'],['cours','📚 Cours'],['jeux','🎮 Jeux'],['compo','🎛 Composer'],['concert','🎭 Concert'],['profil','🏅 Mon espace']];
    $('mustabs').innerHTML='<button onclick="musQuitter()" style="flex:0 0 auto;padding:7px 10px;border-radius:10px;border:0;background:#b23a3a;color:#fff;font-size:13px;font-weight:700">🚪 Sortir</button>'+T.map(t=>`<button onclick="musOng('${t[0]}')" style="flex:0 0 auto;padding:7px 10px;border-radius:10px;border:0;background:${V.ong===t[0]?'#ffd54f':'#3a2d5c'};color:${V.ong===t[0]?'#222':'#fff'};font-size:13px;font-weight:700">${t[1]}</button>`).join('')}
  function rendre(){
    const p=$('muspan');if(!p)return;
    const f=Object.assign({instr:vueInstr,cours:vueCours,profil:vueProfil},vues)[V.ong];
    p.innerHTML=f();if(V.apres){const a=V.apres;V.apres=null;a()}
  }
  const maj=()=>{rendre()};
  // ---------- fiches instruments
  const SEQ_DEFI={guitare_ac:[64,67,69],piano:[60,64,67],flute:[67,69,72],violon:[60,62,64],harpe:[60,64,67,72],ukulele:[67,64,60],trompette:[60,64,67],saxophone:[64,62,60],clarinette:[60,64,67],trombone:[67,64,60],harmonica:[60,62,64],orgue:[60,64,67],synthe:[60,67,72],clavier_elec:[64,67,72],piano_cordes:[60,64,67],guitare_el:[64,67,72],xylophone:[60,62,64,67],balafon:[60,64,67],likembe:[60,64,67,72]};
  function seqDefi(id){const i=INSTR[id];if(i.mel)return SEQ_DEFI[id]||[60,64,67];const n=i.pads.length;return id==='batterie'?[0,1,0,1]:n>=3?[0,1,2]:[0,1,0]}
  function clavierHTML(id){const c=INSTR[id].coul;return `<div style="display:flex;gap:3px;margin:6px 0">`+CLAVIER8.map((k,i)=>`<button id="key_${k[0]}" onclick="musTouche('${id}',${k[0]})" style="flex:1;height:84px;border-radius:0 0 10px 10px;border:2px solid #222;background:${[1,3,6].includes(i)?'#f4efe0':'#fff'};color:#222;font-size:12px;font-weight:700;border-bottom:8px solid ${c};touch-action:manipulation;transition:filter .1s,transform .1s">${k[1]}</button>`).join('')+`</div>`}
  function padsHTML(id){const i=INSTR[id],cols=['#d6302b','#e8a23a','#2e9e4a','#4aa0d8','#7d3fd1','#e84393','#16a085'];return `<div style="display:flex;flex-wrap:wrap;gap:5px;margin:6px 0">`+i.pads.map((n,k)=>`<button id="pad_${k}" onclick="musTouche('${id}',${k})" style="flex:1 1 ${i.pads.length>4?'22%':'30%'};min-height:64px;border-radius:14px;border:3px solid #fff3;background:${cols[k%7]};color:#fff;font-size:13px;font-weight:800;touch-action:manipulation;transition:filter .1s,transform .1s">${esc(n)}</button>`).join('')+`</div>`}
  function jouable(id){return INSTR[id].mel?clavierHTML(id):padsHTML(id)}
  function fiche(id){V={ong:'instr',id};const m=MUS();m.vu[id]=1;save();dessineOnglets();
    const z=ZONES.find(zz=>zz.inst.includes(id));if(z&&studio)studio.zone(z.id);
    rendre();audio();const d=defiInit(id);hook=(inst,n)=>defiTouche(inst,n);parler(INSTR[id].nom)}
  function defiInit(id){V.defi={seq:seqDefi(id),pos:0};return V.defi}
  function defiTouche(inst,n){
    const d=V.defi;if(!d||V.id!==inst)return;const exp=d.seq[d.pos];
    if(n===exp)d.pos++;else d.pos=(n===d.seq[0])?1:0;
    const e=$('defimsg');
    if(d.pos>=d.seq.length){const m=MUS();const prem=!(m.instr[inst]&&m.instr[inst].defi);m.instr[inst]=Object.assign(m.instr[inst]||{},{defi:true});if(prem){A().xp+=3}
      save();SFX.bravo&&SFX.bravo();if(e)e.innerHTML='✅ <b>Défi réussi !</b> Tu sais jouer cet instrument.';d.pos=0;verifBadges()}
    else if(e)e.innerHTML=progSeq(inst,d)}
  const nomSeq=(inst,n)=>INSTR[inst].mel?noteNom(n):INSTR[inst].pads[n];
  const progSeq=(inst,d)=>'🎯 Défi : '+d.seq.map((n,i)=>`<b style="color:${i<d.pos?'#7CFC00':i===d.pos?'#ffd54f':'#fff'}">${esc(nomSeq(inst,n))}</b>`).join(' → ');
  function vueInstr(){
    if(!V.id){
      let h='<p style="font-size:13px">👆 Touche un instrument dans le studio 3D (ou ici) pour l’écouter, le comprendre et le jouer. Change d’espace avec les boutons du haut.</p>';
      Object.keys(FAMILLES).forEach(f=>{const L=Object.keys(INSTR).filter(k=>INSTR[k].fam===f||(f==='trad'&&INSTR[k].afr&&INSTR[k].fam!=='trad'&&false));if(!L.length)return;
        h+=`<h4 style="margin:8px 0 2px">${FAMILLES[f]}</h4>`+L.map(k=>`<button onclick="musFiche('${k}')" style="padding:6px 9px;margin:2px;border-radius:10px;border:1px solid #6a5a9a;background:${(MUS().instr[k]||{}).defi?'#2e7d32':'#3a2d5c'};color:#fff;font-size:12px">${INSTR[k].ico} ${esc(INSTR[k].nom.replace(/ \(.*\)/,''))}${(MUS().instr[k]||{}).defi?' ✓':''}</button>`).join('')});
      return h}
    const id=V.id,i=INSTR[id],d=V.defi||defiInit(id);
    return `<div style="display:flex;align-items:center;gap:8px"><span style="font-size:34px">${i.ico}</span><div><b style="font-size:16px">${esc(i.nom)}</b><br><small style="opacity:.8">${FAMILLES[i.fam]}${i.afr?' · 🌍 Patrimoine africain':''}</small></div></div>
    <p style="font-size:13px;margin:6px 0"><b>Comment ça marche ?</b> ${esc(i.txt)}</p><p style="font-size:12px;margin:4px 0;opacity:.9">🌍 <b>Origine :</b> ${esc(i.orig)}</p>
    <div>${btn('🔊 Écouter la démonstration',`musDemo('${id}')`,'p')}${btn('← Tous les instruments','musFiche(null)')}</div>
    <p id="defimsg" style="font-size:13px;margin:4px 0">${progSeq(id,d)}</p>${jouable(id)}
    ${(MUS().instr[id]||{}).defi?'<p style="font-size:12px;color:#7CFC00">✅ Défi déjà réussi.</p>':''}`}
  // ---------- cours
  function vueCours(){
    const m=MUS();
    if(V.cours){const c=COURS.find(x=>x.id===V.cours),st=V.cst;return coursEtape(c,st)}
    let h='<p style="font-size:13px">10 modules pour apprendre pas à pas. Chaque cours se termine par un exercice et une petite évaluation (2 bonnes réponses sur 3 pour valider).</p>';
    COURS.forEach((c,i)=>{const ok=m.cours[c.id],pre=i===0||m.cours[COURS[i-1].id];
      h+=`<button ${pre?'':'disabled'} onclick="musCours('${c.id}')" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:14px;border:2px solid ${ok?'#2e9e4a':pre?'#7d3fd1':'#444'};background:${ok?'#1f4a2c':pre?'#32245a':'#222'};color:${pre?'#fff':'#777'};font-size:14px"><span style="font-size:26px">${pre?c.ico:'🔒'}</span><span style="flex:1"><b>Module ${i+1}</b> · ${esc(c.titre)}</span><span>${ok?'⭐'.repeat(ok.stars):''}</span></button>`});
    return h}
  function coursEtape(c,st){
    let h=`<h3 style="margin:2px 0">${c.ico} ${esc(c.titre)}</h3>`;
    if(st.ph==='page'){const p=c.pages[st.i];
      h+=`<div style="background:#2a1f45;border-radius:14px;padding:10px"><b>${esc(p.t)}</b><p style="font-size:14px;margin:6px 0">${esc(p.txt)}</p>${p.son?btn('🔊 Écouter','musCoursSon('+st.i+')','p'):''}</div>
      <div style="margin-top:6px">${st.i>0?btn('◀ Précédent','musCoursNav(-1)'):''}${btn(st.i+1<c.pages.length?'Suivant ▶':'Passer à l’exercice ▶','musCoursNav(1)','p')}${btn('Quitter','musCours(null)')}</div><small>Page ${st.i+1} / ${c.pages.length}</small>`}
    else if(st.ph==='prat'){const pr=c.pratique;
      h+=`<div style="background:#2a1f45;border-radius:14px;padding:10px"><b>🎯 Exercice pratique</b><p style="font-size:14px;margin:4px 0">${esc(pr.txt)}</p><div id="pratmsg" style="font-size:13px"></div>`;
      if(pr.t==='libre'||pr.t==='sequence')h+=jouable(pr.i);
      else if(pr.t==='devine')h+=`<div id="pdev"></div>`;
      else if(pr.t==='visiter')h+=`<p style="font-size:13px">Instruments visités : <b>${Object.keys(MUS().vu).length}</b> / ${pr.n}</p>${btn('🎸 Aller visiter les instruments','musOng(\'instr\')','p')}${btn('Vérifier ✔','musPratVerif()','on')}`;
      else if(pr.t==='compo')h+=`${btn('🎛 Ouvrir la table de composition','musOngRetour(\'compo\')','p')}${btn('Vérifier ✔','musPratVerif()','on')}`;
      h+=`</div><div style="margin-top:6px">${btn('Passer à l’évaluation ▶',"musPratPasser()",st.ok?'p':'')}${btn('◀ Retour au cours','musCoursNav(-1)')}</div>`}
    else if(st.ph==='quiz'){const q=st.qs[st.qi];
      h+=`<div style="background:#2a1f45;border-radius:14px;padding:10px"><small>Évaluation · question ${st.qi+1} / ${st.qs.length}</small><p style="font-size:15px;margin:4px 0"><b>${esc(q.q)}</b></p>`+q.c.map((x,i)=>`<button ${st.rep!==undefined?'disabled':''} onclick="musQuizRep(${i})" style="display:block;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:10px;border:2px solid #6a5a9a;background:${st.rep!==undefined?(i===q.a?'#2e9e4a':i===st.rep?'#b23a3a':'#3a2d5c'):'#3a2d5c'};color:#fff;font-size:14px">${'ABCD'[i]}. ${esc(x)}</button>`).join('');
      if(st.rep!==undefined)h+=`<p style="font-size:13px">${st.rep===q.a?'✅ Bravo !':'❌ Pas tout à fait.'} ${esc(q.exp)}</p>${btn(st.qi+1<st.qs.length?'Suivant ▶':'Résultat ▶','musQuizSuite()','p')}`;h+='</div>'}
    else{const stars=st.bon===3?3:st.bon===2?2:0;
      h+=`<div style="text-align:center;background:#2a1f45;border-radius:14px;padding:14px"><div style="font-size:30px">${stars?'⭐'.repeat(stars):'💪'}</div><b>${stars?'Module validé !':'Presque ! Il faut 2 bonnes réponses.'}</b><p style="font-size:13px">${st.bon} / 3 bonnes réponses${st.gain?' · +'+st.gain+' 🪙':''}</p>${stars?btn('Retour aux cours','musCours(null)','p'):btn('🔁 Revoir le cours','musCours(\''+c.id+'\')','p')+btn('Retour','musCours(null)')}</div>`}
    return h}
  function pratDevine(){
    const el=$('pdev');if(!el)return;const st=V.cst;if(!st.dv)st.dv={n:0,ok:0,q:null};
    if(st.dv.ok>=st.c.pratique.n){el.innerHTML='<p>✅ Exercice réussi !</p>';return}
    const L=['guitare_ac','piano','flute','trompette','violon','djembe','xylophone','saxophone'];const id=L[Math.floor(Math.random()*L.length)],ch=[id];while(ch.length<3){const x=L[Math.floor(Math.random()*L.length)];if(!ch.includes(x))ch.push(x)}
    ch.sort(()=>Math.random()-.5);st.dv.q=id;
    el.innerHTML=`<p style="font-size:13px">Écoute puis choisis (${st.dv.ok}/${st.c.pratique.n}) :</p>${btn('🔊 Écouter le son','musPratSon()','p')}<div>`+ch.map(x=>btn(INSTR[x].ico+' '+INSTR[x].nom.replace(/ \(.*\)/,''),`musPratDev('${x}')`)).join('')+'</div>';
    jouerSon(id)}
  function jouerSon(id){const i=INSTR[id];if(i.mel)jouerSuite(id,[[60,0],[64,.3],[67,.6]]);else jouerSuite(id,[[0,0],[1,.3],[0,.6]].map(([n,t])=>[Math.min(n,i.pads.length-1),t]))}
  // ---------- badges et cérémonie
  function verifBadges(){
    const m=MUS();let nouv=false;
    BADGES.forEach(b=>{if(m.badges[b.id])return;const r=b.req(m);if(r.every(x=>x[1])){m.badges[b.id]={date:new Date().toISOString().slice(0,10)};A().pieces+=20;A().xp+=25;nouv=true;cer.push(b)}});
    if(nouv){save();refreshHud();if(ov&&!cerOn)cerSuite()}}
  function cerSuite(){const b=cer.shift();if(!b){cerOn=false;return}cerOn=true;ceremonie(b)}
  function medaille(b,taille){return `<svg viewBox="0 0 200 240" width="${taille}" height="${taille*1.2}"><defs><radialGradient id="mg${b.id}" cx="40%" cy="35%"><stop offset="0" stop-color="#fffbe0"/><stop offset=".6" stop-color="${b.coul}"/><stop offset="1" stop-color="#7a5a10"/></radialGradient></defs>
    <path d="M60 0 L100 90 L140 0 L170 0 L120 120 L80 120 L30 0Z" fill="#d6302b"/><path d="M60 0 L100 90 L100 120 L80 120 L30 0Z" fill="#a01f1a"/>
    <circle cx="100" cy="150" r="78" fill="url(#mg${b.id})" stroke="#7a5a10" stroke-width="5"/><circle cx="100" cy="150" r="64" fill="none" stroke="#fff8" stroke-width="3" stroke-dasharray="4 5"/>
    <text x="100" y="172" font-size="66" text-anchor="middle">${b.ico}</text><text x="100" y="215" font-size="14" text-anchor="middle" font-weight="800" fill="#4a3400">BOYEKOLI</text></svg>`}
  function ceremonie(b){
    audio();const w=document.createElement('div');w.id='cerem';w.style.cssText='position:fixed;inset:0;z-index:9500;background:radial-gradient(circle at 50% 30%,#4a2a8a,#120a26);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:14px;overflow:hidden';
    w.innerHTML=`<canvas id="cvc" style="position:absolute;inset:0;pointer-events:none"></canvas><div style="font-size:15px;letter-spacing:2px;opacity:.9">CÉRÉMONIE OFFICIELLE</div><div id="cbadge" style="transform:scale(0) rotate(-30deg);transition:transform 1s cubic-bezier(.2,1.4,.4,1);margin:8px">${medaille(b,170)}</div>
    <h2 style="margin:4px 0;font-size:20px">🎉 Félicitations ${esc(G.nom||'')} !</h2><div style="font-size:19px;font-weight:800;color:#ffd54f;margin:4px 0">${b.ico} ${esc(b.nom)}</div><p style="max-width:340px;font-size:14px;margin:6px 0">${esc(b.txt)}</p><p style="font-size:13px;opacity:.9">Remis le ${new Date().toLocaleDateString('fr-FR')} par le studio BOYEKOLI · +20 🪙</p>
    <div style="position:relative">${btn('🏅 Voir dans mon espace','musCerFin(1)','p')}${btn('Continuer','musCerFin(0)')}</div>`;
    document.body.appendChild(w);setTimeout(()=>{const e=w.querySelector('#cbadge');if(e)e.style.transform='scale(1) rotate(0)'},60);
    // fanfare synthétique
    [[60,0],[64,.18],[67,.36],[72,.6],[67,.95],[72,1.1],[76,1.3]].forEach(([n,t])=>syn.jouer('trompette',n,ctx.currentTime+.1+t,{bus:6,dur:.35,vol:1.1}));[0,.6,1.3].forEach(t=>syn.jouer('batterie',6,ctx.currentTime+.1+t,{bus:6}));[0,.3,.6,.9].forEach(t=>syn.jouer('batterie',0,ctx.currentTime+.1+t,{bus:6}));
    [0.8,1.6].forEach(t=>syn.jouer('xylophone',84,ctx.currentTime+t,{bus:6}));applaudir();
    if(studio)studio.pulseGlobal();SFX.win&&SFX.win();parler('Félicitations ! Tu as obtenu le badge '+b.nom);
    // confettis
    const cv=w.querySelector('#cvc');cv.width=innerWidth;cv.height=innerHeight;const g=cv.getContext('2d');const P=[];for(let i=0;i<150;i++)P.push({x:Math.random()*cv.width,y:-Math.random()*cv.height,vy:2+Math.random()*4,vx:(Math.random()-.5)*3,r:3+Math.random()*5,c:['#ffd54f','#ff6fa8','#6fd0ff','#7CFC00','#fff','#ff9a3c'][i%6],a:Math.random()*6,va:(Math.random()-.5)*.3});
    let raf2,t0=performance.now();const f=now=>{if(!w.isConnected)return;g.clearRect(0,0,cv.width,cv.height);P.forEach(p=>{p.y+=p.vy;p.x+=p.vx+Math.sin(p.a)*.8;p.a+=p.va;if(p.y>cv.height+10&&now-t0<7000){p.y=-10}g.save();g.translate(p.x,p.y);g.rotate(p.a);g.fillStyle=p.c;g.fillRect(-p.r,-p.r/2,p.r*2,p.r);g.restore()});raf2=requestAnimationFrame(f)};raf2=requestAnimationFrame(f);
    const emo=['🎵','🎶','🎉','⭐','🥁','🎺'];for(let i=0;i<14;i++){const s=document.createElement('div');s.textContent=emo[i%6];s.style.cssText=`position:absolute;left:${5+Math.random()*90}%;bottom:-40px;font-size:${24+Math.random()*24}px;animation:musfloat ${3+Math.random()*3}s ease-out ${Math.random()*2}s forwards`;w.appendChild(s)}
    if(!document.getElementById('musstyle')){const st=document.createElement('style');st.id='musstyle';st.textContent='@keyframes musfloat{to{transform:translateY(-110vh) rotate(30deg);opacity:.2}}';document.head.appendChild(st)}}
  function applaudir(){audio();for(let i=0;i<40;i++)syn.jouer('maracas',0,ctx.currentTime+1.5+i*.07+Math.random()*.05,{bus:6,vol:.5+Math.random()*.4})}
  // ---------- profil
  function vueProfil(){
    const m=MUS();let h=`<h3 style="margin:2px 0">🏅 Mon espace musical</h3><p style="font-size:12px;opacity:.85">Tes badges ne s’obtiennent qu’après avoir réussi les exercices correspondants. Tes créations restent dans l’application.</p>`;
    h+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
    BADGES.forEach(b=>{const e=m.badges[b.id],r=b.req(m);
      h+=`<div style="flex:1 1 44%;min-width:150px;background:${e?'#3a2d5c':'#241a3c'};border:2px solid ${e?b.coul:'#444'};border-radius:14px;padding:8px;text-align:center;${e?'':'opacity:.85'}"><div style="filter:${e?'none':'grayscale(1) brightness(.6)'}">${medaille(b,86)}</div><b style="font-size:12px">${esc(b.nom)}</b><br>${e?'<small style="color:#7CFC00">Obtenu le '+e.date+'</small>':'<small>'+r.map(x=>(x[1]?'✅ ':'⬜ ')+esc(x[0])).join('<br>')+'</small>'}</div>`});
    h+='</div>';
    h+=`<h4 style="margin:10px 0 2px">📚 Cours : ${Object.keys(m.cours).length} / 10 · 🎮 Jeux</h4><div style="font-size:12px">${JEUX.map(j=>`${j.ico} ${j.nom} ${'⭐'.repeat((m.jeux[j.id]||{}).stars||0)||'—'}`).join(' · ')}</div>`;
    h+=`<h4 style="margin:10px 0 2px">🎼 Mes créations (${m.compos.length})</h4>`;
    if(!m.compos.length)h+='<p style="font-size:12px">Aucune création enregistrée. Va dans « Composer » !</p>';
    m.compos.forEach((c,i)=>{h+=`<div style="background:#2a1f45;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${esc(c.nom)}</b> · ${c.tempo} bpm · ${c.tracks.filter(t=>t.grid.some(r=>r.some(x=>x))).length} pistes<br>${btn('▶ Écouter','musCompoEcoute('+i+')','p')}${btn('🎭 Concert','musCompoConcert('+i+')')}${btn('✏️ Renommer','musCompoNom('+i+')')}${btn('🗑','musCompoSupp('+i+')')}</div>`});
    return h}
  // ---------- éléments partagés par les activités
  function stopLecture(){if(lecteur){lecteur.stop();lecteur=null}}
  const JEUX=[
    {id:'devine',ico:'🔍',nom:'Devine l’instrument',txt:'Écoute un son et trouve l’instrument.'},
    {id:'rythme',ico:'🥁',nom:'Reproduis le rythme',txt:'Écoute la séquence et reproduis-la en rythme.'},
    {id:'piano',ico:'🎹',nom:'Le piano magique',txt:'Reproduis la mélodie sur le clavier.'},
    {id:'chef',ico:'🎼',nom:'Le chef d’orchestre',txt:'Place chaque instrument dans sa famille.'},
    {id:'detective',ico:'🕵️',nom:'Le détective des sons',txt:'Distingue les sons graves et aigus.'},
    {id:'concertjeu',ico:'🎤',nom:'Mon premier concert',txt:'Compose une petite musique et joue-la sur scène.'},
    {id:'memoire',ico:'🧠',nom:'Mémoire musicale',txt:'Mémorise et reproduis une suite de notes.'}
  ];

  // ---------- actions (appelées depuis l'interface)
  const stCours=()=>V.cst;
  function pratiqueHook(){
    const st=V.cst,pr=st.c.pratique;hook=null;
    const ok=()=>{st.ok=true;const e=$('pratmsg');if(e)e.innerHTML='✅ <b>Exercice réussi !</b>';SFX.bravo&&SFX.bravo()};
    if(pr.t==='libre'){st.cnt=0;hook=()=>{st.cnt++;const e=$('pratmsg');if(st.cnt>=pr.n)ok();else if(e)e.textContent='Sons joués : '+st.cnt+' / '+pr.n}}
    else if(pr.t==='sequence'){st.pos=0;const e0=()=>{const e=$('pratmsg');if(e)e.innerHTML=pr.seq.map((n,i)=>`<b style="color:${i<st.pos?'#7CFC00':i===st.pos?'#ffd54f':'#fff'}">${esc(nomSeq(pr.i,n))}</b>`).join(' → ')};hook=(inst,n)=>{if(n===pr.seq[st.pos])st.pos++;else st.pos=n===pr.seq[0]?1:0;if(st.pos>=pr.seq.length)ok();else e0()};V.apres=e0}
    else if(pr.t==='devine'){V.apres=pratDevine}}
  const actions={
    musZone:id=>{if(studio)studio.zone(id)},
    musOng:o=>{stopLecture();hook=null;V={ong:o};dessineOnglets();rendre()},
    musOngRetour:o=>{V={ong:o,retourCours:V.cours?{cours:V.cours,cst:V.cst}:null};dessineOnglets();rendre()},
    musFiche:id=>{if(!id){hook=null;V={ong:'instr'};rendre();return}fiche(id)},
    musDemo:id=>{const i=INSTR[id];audio();jouerSuite(id,demo(id));parler(i.nom)},
    musTouche:(inst,n)=>{son(inst,n);if(hook)hook(inst,n)},
    musCours:id=>{stopLecture();hook=null;if(!id){V={ong:'cours'};rendre();return}const c=COURS.find(x=>x.id===id);V={ong:'cours',cours:id,cst:{c,ph:'page',i:0}};rendre();parler(c.titre)},
    musCoursNav:d=>{const st=V.cst,c=st.c;hook=null;if(st.ph==='page'){const n=st.i+d;if(n<0){V={ong:'cours'}}else if(n>=c.pages.length){st.ph='prat';pratiqueHook()}else st.i=n}else if(st.ph==='prat'){st.ph='page';st.i=c.pages.length-1}rendre()},
    musCoursSon:i=>{const p=V.cst.c.pages[i],lire=(x)=>{if(!x)return 0;if(x.s)return jouerSuite(x.i,x.s.map((n,k)=>[n,k*.32]));return jouerSuite(x.i,x.p.map((n,k)=>[n,k*.3]))};const d=lire(p.son);if(p.son2)setTimeout(()=>lire(p.son2),(d+.8)*1000)},
    musPratSon:()=>{const st=V.cst;if(st.dv&&st.dv.q)jouerSon(st.dv.q)},
    musPratDev:x=>{const st=V.cst;if(!st.dv)return;if(x===st.dv.q){st.dv.ok++;MUS().st.devineOk=(MUS().st.devineOk||0)+1;SFX.ok&&SFX.ok();save();verifBadges()}else SFX.ko&&SFX.ko();if(st.dv.ok>=st.c.pratique.n)st.ok=true;pratDevine()},
    musPratVerif:()=>{const st=V.cst,pr=st.c.pratique;let ok=false,msg='';
      if(pr.t==='visiter'){ok=Object.keys(MUS().vu).length>=pr.n;msg='Visite encore des instruments.'}
      else if(pr.t==='compo'){const r=vues.verifCompo?vues.verifCompo(pr):{ok:false,msg:''};ok=r.ok;msg=r.msg}
      if(ok){st.ok=true;const e=$('pratmsg');if(e)e.innerHTML='✅ <b>Exercice réussi !</b>';SFX.bravo&&SFX.bravo()}else toast(msg||'Exercice pas encore terminé.')},
    musPratPasser:()=>{const st=V.cst;if(!st.ok){toast('Termine d’abord l’exercice pratique.');return}hook=null;st.ph='quiz';st.qs=st.c.quiz.map((q,i)=>rot(q,i+st.c.id.length));st.qi=0;st.bon=0;st.rep=undefined;rendre()},
    musQuizRep:i=>{const st=V.cst;if(st.rep!==undefined)return;st.rep=i;if(i===st.qs[st.qi].a){st.bon++;SFX.ok&&SFX.ok()}else SFX.ko&&SFX.ko();rendre()},
    musQuizSuite:()=>{const st=V.cst;if(st.qi+1<st.qs.length){st.qi++;st.rep=undefined;rendre();return}
      st.ph='res';const m=MUS();if(st.bon>=2){const stars=st.bon===3?3:2,prev=m.cours[st.c.id];if(!prev){A().pieces+=5;A().xp+=8;st.gain=5;refreshHud()}m.cours[st.c.id]={stars:Math.max(stars,prev?prev.stars:0)};save();D.mis&&D.mis.evt('mus','cours',st.c.id);SFX.win&&SFX.win();verifBadges()}rendre()},
    musCerFin:go=>{const w=document.getElementById('cerem');if(w)w.remove();if(go){V={ong:'profil'};dessineOnglets();rendre()}if(cer.length)setTimeout(cerSuite,300);else cerOn=false},
    musQuitter:()=>quitter(),
    musRetourSalle:()=>{stopLecture();hook=null;V={ong:'instr'};dessineOnglets();rendre();if(studio)studio.zone('salle')},
    musOuvrir:o=>ouvrir(o||'instr')
  };
  window.__mus=()=>({V,MUS:MUS(),draft,verif:verifBadges});
  return {actions,vues,JEUX,ouvrir,fermerCadre,verifBadges,son,audio,jouerSuite,jouerSon,fiche,rendre,maj,dessineOnglets,
    get V(){return V},set V(v){V=v},get hook(){return hook},set hook(h){hook=h},get studio(){return studio},get ctx(){return ctx},get syn(){return syn},get lecteur(){return lecteur},set lecteur(l){lecteur=l},
    get visu(){return visu},lanceVisu,stopLecture,btn,rot,$,MUS,A,jouable,noteNom,allumer,pratDevine,applaudir,ceremonie,cerSuite,get cer(){return cer},
    get draft(){return draft},set draft(d){draft=d},get ecoute(){return ecoute},set ecoute(v){ecoute=v},coursEtape,estOuvert:()=>!!ov,
    _ex:{vueCours,vueInstr,vueProfil}};
}
