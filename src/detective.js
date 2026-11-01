// BOYEKOLI DETECTIVE – Agence de détectives : jeu d'investigation 3D (agence, deux enquêtes, laboratoire, carnet, tableau, certificat).
import {creerMoteur} from './detective/moteur.js';
import {AGENCE,CAS,COURS,DIAL_AGENCE,COULEURS_MANTEAU,COIFFURES} from './detective/data.js';

export function creerDetective(D){
  const {PAR,G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const DET=()=>{const a=A();if(!a.det)a.det={look:{s:'f',skin:3,hair:'courtes',outfit:'polo',c:'#7a5a3a'},cas:{},cert:null};const d=a.det;if(!d.cas)d.cas={};if(!d.look)d.look={s:'f',skin:3,hair:'courtes',outfit:'polo',c:'#7a5a3a'};return d};
  const CAS_ST=id=>{const d=DET();if(!d.cas[id])d.cas[id]={indices:{},temos:{},liens:{},analyses:{},photos:[],fini:false,stars:0,essais:0,trouve:false,ouvertes:{}};const c=d.cas[id];['indices','temos','liens','analyses','ouvertes'].forEach(k=>{if(!c[k])c[k]={}});if(!c.photos)c.photos=[];return c};
  let ov=null,mot=null,lieu='agence',cas=null,pr=null,panneau=null,tOuv=0,avancer=false;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:9px 12px;margin:3px;border-radius:12px;border:2px solid #fff3;background:${bg||'#34425a'};color:#fff;font-size:14px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const casDef=()=>cas?CAS[cas]:null;
  const nbIndices=c=>Object.keys(CAS_ST(c).indices).length;
  // ---------- ouverture / fermeture
  function ouvrir(casId){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);tOuv=Date.now();
    ov=document.createElement('div');ov.id='detov';
    ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#141b27;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:linear-gradient(90deg,#1f2d4a,#3a2a5a);flex:0 0 auto"><b id="dettit" style="flex:1;font-size:14px">🕵️ BOYEKOLI DETECTIVE</b>${btn('👤','detPerso()','#34425a','padding:5px 9px;margin:0')}${btn('✖','detQuitter()','#7b2d26','padding:5px 10px;margin:0')}</div>
    <div id="det3d" style="flex:1;position:relative;min-height:0"></div>
    <div id="dethud" style="position:absolute;left:0;right:0;bottom:0;height:170px;pointer-events:none"></div>
    <div id="detmsg" style="position:absolute;left:8px;right:8px;top:50px;background:rgba(15,20,30,.85);padding:6px 9px;border-radius:10px;font-size:13px;display:none"></div>
    <div id="detpan" style="position:absolute;inset:0;background:rgba(10,14,22,.93);display:none;flex-direction:column;padding:10px;overflow:auto;z-index:5"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'detRetour()'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    mot=creerMoteur($('det3d'),{low,look:DET().look,onProche:p=>{pr=p;majBoutons()}});
    construireHud();
    try{history.pushState({det:1},'')}catch(e){}
    popH=()=>{if(ov)quitter()};window.addEventListener('popstate',popH);
    if(casId&&CAS[casId]){lieu='agence';chargerAgence();partir(casId)}else chargerAgence();
    parler('Bienvenue à l’agence de détectives Boyekoli.')}
  let popH=null;
  function quitter(){if(popH){window.removeEventListener('popstate',popH);popH=null}const a=!!ov;fermer();if(a)closeDialog()}
  function fermer(sil){
    if(!ov)return;const s=Math.round((Date.now()-tOuv)/1000);if(s>8&&!sil){const t=A().tal||(A().tal={});t.enquete=(t.enquete||0)+Math.min(120,Math.floor(s/6));save()}
    if(mot){mot.stop();mot=null}ov.remove();ov=null;cas=null;panneau=null}
  // ---------- HUD (joystick et boutons)
  function construireHud(){
    const h=$('dethud');h.style.pointerEvents='none';
    h.innerHTML=`<div id="joy" style="position:absolute;left:12px;bottom:14px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid #fff5;pointer-events:auto;touch-action:none"><div id="jk" style="position:absolute;left:44px;top:44px;width:40px;height:40px;border-radius:50%;background:#fff;opacity:.85"></div></div>
    <div style="position:absolute;right:10px;bottom:12px;display:flex;flex-direction:column;align-items:flex-end;pointer-events:auto">
      <div>${btn('🎒','detInv()','#34425a','width:46px;padding:8px 0')}${btn('📓','detCarnet()','#34425a','width:46px;padding:8px 0')}${btn('📸','detPhoto()','#6a1b9a','width:52px;padding:8px 0')}</div>
      <div>${btn('⬆ Avancer','','#34425a','padding:12px 12px').replace('onclick=""','id="bav"')}${btn('🔍 Examiner','detExaminer()','#2c7fb8','padding:12px 12px')}</div>
      <div>${btn('✋ Interagir','detInteragir()','#2e7d32','padding:14px 18px;font-size:15px').replace('<button','<button id="bint"')}</div></div>`;
    const jb=$('joy'),jk=$('jk');let id=null;
    const mv=e=>{const b=jb.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}mot.joy.x=dx;mot.joy.y=dy;jk.style.left=(44+dx*40)+'px';jk.style.top=(44+dy*40)+'px'};
    jb.addEventListener('pointerdown',e=>{e.preventDefault();jb.setPointerCapture(e.pointerId);id=e.pointerId;mv(e)});
    jb.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>jb.addEventListener(n,e=>{if(e.pointerId===id){id=null;mot.joy.x=mot.joy.y=0;jk.style.left='44px';jk.style.top='44px'}}));
    const av=$('bav');const go=()=>{avancer=true;const s=mot.etat();mot.joy.x=Math.sin(s.ry);mot.joy.y=Math.cos(s.ry)};const stop=()=>{avancer=false;mot.joy.x=mot.joy.y=0};
    av.addEventListener('pointerdown',e=>{e.preventDefault();go()});['pointerup','pointerleave','pointercancel'].forEach(n=>av.addEventListener(n,stop));
    // clavier : E interagir, F examiner, C photo, I inventaire, N carnet
    kb=e=>{if(!ov||panneau)return;const k=e.key.toLowerCase();if(k==='e')interagir();else if(k==='f')examiner();else if(k==='c')photographier();else if(k==='i')inventaire();else if(k==='n')carnet();else if(k==='escape')quitter()};
    window.addEventListener('keydown',kb)}
  let kb=null;
  function majBoutons(){const b=$('bint');if(!b)return;
    if(!pr){b.innerHTML='✋ Interagir';return}
    let t='✋ Interagir';
    if(pr.kind==='pnj')t='💬 Parler à '+pr.def.nom.split(',')[0];
    else if(pr.kind==='sortie')t=pr.def.label;
    else{const e=pr.def;t=e.label||('✋ '+e.nom)}
    b.innerHTML=t.length>34?t.slice(0,33)+'…':t}
  function msg(t,ms){const m=$('detmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3500)}
  function panel(h,sans){PAR.cacher();panneau=true;mot&&mot.fige(true);const p=$('detpan');p.style.display='flex';p.style.paddingBottom='84px';p.innerHTML=h+(sans?'':'<div style="margin-top:8px">'+btn('✖ Fermer','detFermerP()','#7b2d26')+'</div>')}
  function fermerP(){PAR.cacher();panneau=null;const p=$('detpan');if(p){p.style.display='none';p.innerHTML=''}mot&&mot.fige(false)}
  // ---------- scènes
  function chargerAgence(){lieu='agence';cas=null;mot.charger(AGENCE);$('dettit').textContent='🕵️ Agence de détectives';pr=null;majBoutons()}
  function partir(id){
    cas=id;lieu='cas';const d=CAS[id],c=CAS_ST(id);mot.charger(d);mot.setLook(DET().look);$('dettit').textContent=d.ico+' '+d.titre;pr=null;majBoutons();
    // restaure l'état de la scène : indices ramassés, portes ouvertes, objets cachés déjà trouvés
    Object.keys(c.indices).forEach(i=>{const ob=mot.objs()[i2o(d,i)];if(ob){mot.revelerTout([ob.def.id])}});
    Object.keys(c.indices).forEach(i=>{const oid=i2o(d,i);const ob=mot.objs()[oid];if(ob&&ramassable(ob.def))mot.retirer(oid)});
    Object.keys(c.ouvertes).forEach(oid=>mot.deverrouiller(oid));
    panel(`<h3 style="margin:2px 0">${d.ico} ${esc(d.titre)}</h3><p style="font-size:14px">${esc(d.intro)}</p><p style="font-size:13px;opacity:.9">🎯 <b>Mission :</b> trouver <b>où</b> est l’objet, <b>qui</b> l’a déplacé et <b>pourquoi</b>. Examine, interroge, compare les indices (tableau ou carnet) puis formule ta solution.</p><p style="font-size:12px;opacity:.85">Commandes : joystick pour marcher, 🔍 Examiner (cherche les objets cachés), ✋ Interagir (parler, ramasser, ouvrir), 📸 Photographier, 🎒 Inventaire, 📓 Carnet. Clavier : E, F, C, I, N.</p>${btn('▶ Commencer l’enquête','detFermerP()','#2e7d32','font-size:16px;padding:12px')}`,true);
    parler(d.titre)}
  // l'identifiant d'objet associé à un indice
  const i2o=(d,ind)=>{const o=d.objets.find(x=>x.indice===ind);return o?o.id:null};
  const ramassable=ob=>['ticket','gants','cle','carnet','liste','crayon','clef_m','registre','presence'].includes(ob.indice);
  // ---------- interactions
  function collecter(ob){
    const d=casDef(),c=CAS_ST(cas),ind=ob.indice;if(!ind)return false;
    if(!c.indices[ind]){D.mis&&D.mis.evt('det','indice',ind);c.indices[ind]={t:Date.now()};save();SFX.coin&&SFX.coin();msg('🔎 Indice trouvé : '+d.indices[ind].nom,3500);
      if(ob.id==='ticket')0}
    if(ramassable(ob)){mot.retirer(ob.id);msg('✋ Ramassé : '+d.indices[ind].nom+' (dans ton inventaire)',3500)}
    return true}
  function interagir(){
    if(!mot||panneau)return;const p=mot.proche();if(!p){msg('Rien à utiliser ici. Approche-toi d’un objet ou d’une personne.',2200);return}
    if(p.kind==='sortie'){if(lieu==='cas'){if(confirm('Retourner à l’agence ?'))chargerAgence()}else quitter();return}
    if(p.kind==='pnj'){dialoguer(p.def);return}
    const e=p.def;
    if(e.panneau){panneauAgence(e.panneau);return}
    if(e.ferme){const c=CAS_ST(cas);if(c.indices[e.ferme]||c.ouvertes[e.id]){mot.deverrouiller(e.id);c.ouvertes[e.id]=true;save();msg('🔓 Tu as ouvert la porte avec la clé !',3000);SFX.ok&&SFX.ok()}else{msg('🔒 La porte est fermée à clé. Il faut trouver la clé…',3500);SFX.ko&&SFX.ko()}return}
    if(e.cible){const c=CAS_ST(cas);if(!c.trouve){c.trouve=true;save();SFX.bravo&&SFX.bravo()}msg('🎉 '+e.ex+' Tu sais maintenant OÙ ! Il faut comprendre QUI et POURQUOI.',5000);return}
    if(e.indice){collecter(e);return}
    msg(e.ex||e.nom,3500)}
  function examiner(){
    if(!mot||panneau)return;const rev=mot.scanner(3.6);const p=mot.proche();
    if(rev.length&&cas){const d=casDef();rev.forEach(id=>{const o=d.objets.find(x=>x.id===id);if(o&&o.indice)CAS_ST(cas).indices[o.indice]||msg('✨ Tu as repéré quelque chose de caché : '+(o.label||o.nom),3500)});SFX.coin&&SFX.coin();
      return}
    if(!p){msg('🔍 Rien de particulier ici. Rapproche-toi d’un objet ou fouille un autre endroit.',2500);return}
    if(p.kind==='pnj'){msg(p.def.nom+' : '+p.def.role+'.',2500);return}
    const e=p.def;if(e.indice&&cas){collecter(e);msg('🔍 '+e.ex,5500);return}
    msg('🔍 '+(e.ex||e.nom),4500)}
  function photographier(){
    if(!mot||panneau)return;const p=mot.proche(),url=mot.photo();let lib=p?(p.kind==='pnj'?p.def.nom:p.def.nom||p.def.label):'la pièce';
    SFX.coin&&SFX.coin();if(cas){const c=CAS_ST(cas);if(c.photos.length>=14)c.photos.shift();c.photos.push({url,lib,t:Date.now()});if(p&&p.def&&p.def.indice&&c.indices[p.def.indice])c.indices[p.def.indice].photo=true;save()}
    else{const d=DET();if(!d.photosAg)d.photosAg=[];d.photosAg.push({url,lib});if(d.photosAg.length>6)d.photosAg.shift()}
    msg('📸 Photo prise : '+lib,2500)}
  // ---------- dialogues
  function dialoguer(p){
    const dial=cas?casDef().dialogues[p.dial]:DIAL_AGENCE[p.dial];if(!dial){msg(p.nom+' vous salue.',2500);return}
    mot.parler(p.id,6);ouvrirNoeud(dial,'n0',p)}
  function ouvrirNoeud(dial,nid,p){
    const n=dial[nid];if(!n){fermerP();return}
    if(n.temo&&cas){const c=CAS_ST(cas);if(!c.temos[n.temo.id]){D.mis&&D.mis.evt('det','temoin',n.temo.id);c.temos[n.temo.id]={txt:n.temo.txt,qui:dial.nom};save();msg('📝 Témoignage noté dans ton carnet',2500)}}
    dial.__p=p;dialG=dial;
    PAR.afficher(ov,{nom:dial.nom,texte:n.t,voice:PAR.voixDe(p),ancre:p&&mot.ecran(p.id),choix:n.c.map(([l,nx])=>[l,`detRep('${nid}','${nx||''}')`]),retour:'detRetour()'});panneau=true;mot&&mot.fige(true);const pp=$('detpan');if(pp){pp.style.display='none';pp.innerHTML=''}}
  let dialG=null;
  // ---------- panneaux de l'agence
  function panneauAgence(nom){
    if(nom==='dossiers'||nom==='carte')return dossiers();
    if(nom==='tableau')return tableau();
    if(nom==='biblio')return biblio();
    if(nom==='labo')return labo();
    if(nom==='vehicule')return vehicule()}
  function dossiers(){
    const d=DET();let h='<h3 style="margin:2px 0">📂 Dossiers d’enquêtes <small>('+Object.keys(CAS).filter(k=>CAS_ST(k).fini).length+'/2)</small></h3><p style="font-size:13px">Choisis une affaire. Tu peux y retourner autant de fois que tu veux.</p>';
    Object.values(CAS).forEach(c=>{const st=CAS_ST(c.id);h+=`<div style="background:#243049;border-radius:12px;padding:10px;margin:6px 0"><b style="font-size:16px">${c.ico} ${esc(c.titre)}</b> ${st.fini?'<span style="color:#7CFC00">✅ résolue '+'⭐'.repeat(st.stars)+'</span>':''}<br><small>${esc(c.lieu)} · indices : ${nbIndices(c.id)}/${Object.keys(c.indices).length} · témoignages : ${Object.keys(st.temos).length}</small><br>${btn('🚓 Partir en enquête',`detPartir('${c.id}')`,'#2e7d32')}</div>`});
    if(d.cert)h+=`<p>${btn('🎓 Voir mon certificat','detCert()','#6a1b9a')}</p>`;
    panel(h)}
  function vehicule(){
    panel(`<h3 style="margin:2px 0">🚓 Véhicules d’enquête</h3><p style="font-size:13px">Le véhicule de l’agence te conduit sur le lieu de l’enquête. Choisis ta destination :</p>`+Object.values(CAS).map(c=>btn(c.ico+' '+esc(c.lieu),`detPartir('${c.id}')`,'#2e7d32')).join('')+`<p style="font-size:12px;opacity:.85">Un vélo est aussi garé à l’agence pour les petites enquêtes de quartier.</p>`)}
  function biblio(){
    panel('<h3 style="margin:2px 0">📚 Bibliothèque documentaire</h3><p style="font-size:13px">Les notions du détective, expliquées simplement.</p>'+COURS.map(c=>`<div style="background:#243049;border-radius:12px;padding:9px;margin:6px 0"><b>${c.ico} ${esc(c.t)}</b><p style="font-size:13px;margin:4px 0">${esc(c.txt)}</p></div>`).join(''))}
  // ---------- inventaire, carnet, tableau
  function inventaire(){
    const casIds=Object.keys(CAS);let h='<h3 style="margin:2px 0">🎒 Inventaire des indices</h3>';let n=0;
    casIds.forEach(id=>{const c=CAS_ST(id),d=CAS[id];const L=Object.keys(c.indices);if(!L.length)return;h+=`<h4 style="margin:6px 0 2px">${d.ico} ${esc(d.titre)}</h4>`;
      L.forEach(i=>{n++;const x=d.indices[i];h+=`<div style="background:#243049;border-radius:10px;padding:8px;margin:4px 0"><b>${x.ico} ${esc(x.nom)}</b>${c.indices[i].photo?' 📸':''}${x.analyse?(c.analyses[i]?' <span style="color:#7CFC00">🔬 analysé</span>':' <span style="color:#ffd54f">🔬 à analyser au laboratoire</span>'):''}<br><small>${esc(x.txt)}</small></div>`});
      if(c.photos.length)h+='<div style="display:flex;gap:4px;overflow-x:auto;margin:4px 0">'+c.photos.map(p=>`<div style="flex:0 0 auto;text-align:center"><img src="${p.url}" style="width:96px;border-radius:6px;border:2px solid #fff3"><br><small>${esc(p.lib)}</small></div>`).join('')+'</div>'});
    if(!n)h+='<p>Aucun indice pour le moment. Examine les lieux avec 🔍 et ✋.</p>';
    panel(h)}
  function carnet(){
    let h='<h3 style="margin:2px 0">📓 Carnet d’enquête</h3>';
    if(!cas){h+='<p style="font-size:13px">Lance une enquête pour remplir ton carnet.</p>'+btn('📂 Mes dossiers','detDossiers()');panel(h);return}
    const d=casDef(),c=CAS_ST(cas);
    h+=`<b>${d.ico} ${esc(d.titre)}</b><h4 style="margin:6px 0 2px">🗣 Témoignages (${Object.keys(c.temos).length})</h4>`;
    Object.keys(c.temos).forEach(k=>{const t=c.temos[k];h+=`<div style="background:#243049;border-radius:10px;padding:7px;margin:3px 0;font-size:13px"><b>${esc(t.qui)}</b> : ${esc(t.txt)}</div>`});
    if(!Object.keys(c.temos).length)h+='<p style="font-size:13px;opacity:.8">Parle aux personnes (✋) : leurs témoignages s’écrivent ici.</p>';
    h+=`<h4 style="margin:6px 0 2px">🔗 Rapprochements validés (${Object.keys(c.liens).length}/${d.liensRequis} nécessaires)</h4>`;
    Object.keys(c.liens).forEach(k=>{h+=`<div style="background:#1f4a2c;border-radius:10px;padding:7px;margin:3px 0;font-size:13px">✅ ${esc(c.liens[k])}</div>`});
    h+=`<p style="margin-top:8px">${btn('📌 Tableau de rapprochement','detTableauCas()','#2c7fb8')}${btn('🎒 Inventaire','detInv()')}${btn('🧠 Formuler ma solution','detSolution()','#6a1b9a')}</p>`;
    panel(h)}
  function elementsTableau(c,d){
    const L=[];Object.keys(c.indices).forEach(i=>L.push({k:i,t:'💡 '+d.indices[i].nom}));Object.keys(c.temos).forEach(k=>L.push({k,t:'🗣 '+c.temos[k].qui.split(',')[0]+' : '+c.temos[k].txt}));return L}
  let selT=[];
  function tableau(){
    if(!cas){panel('<h3>📌 Tableau d’investigation</h3><p style="font-size:13px">Le tableau sert à relier les preuves aux témoignages. Pars en enquête, récolte des indices, puis relie-les ici ou depuis ton carnet.</p>'+btn('📂 Mes dossiers','detDossiers()'));return}
    tableauCas()}
  function tableauCas(msgT){
    const d=casDef(),c=CAS_ST(cas),L=elementsTableau(c,d);
    let h=`<h3 style="margin:2px 0">📌 Tableau de rapprochement</h3><p style="font-size:13px">Touche deux éléments qui se rapportent l’un à l’autre (une preuve et un témoignage, ou deux indices), puis « Relier ». Rapprochements validés : <b>${Object.keys(c.liens).length}/${d.liensRequis}</b></p>`;
    if(msgT)h+=`<div style="background:#243049;border-radius:10px;padding:8px;margin:6px 0;font-size:13px">${esc(msgT)}</div>`;
    h+=L.map(e=>`<button onclick="detSelT('${e.k}')" style="display:block;width:100%;text-align:left;padding:8px;margin:3px 0;border-radius:10px;border:2px solid ${selT.includes(e.k)?'#ffd54f':'#fff3'};background:${selT.includes(e.k)?'#4a3f1a':'#243049'};color:#fff;font-size:13px">${esc(e.t)}</button>`).join('');
    h+=`<p>${btn('🔗 Relier les deux éléments','detRelier()','#2e7d32')}${btn('↩ Carnet','detCarnet()')}</p>`;
    panel(h)}
  function relier(){
    if(selT.length!==2){tableauCas('Choisis exactement deux éléments à relier.');return}
    const d=casDef(),c=CAS_ST(cas),[a,b]=selT;
    const l=d.liens.find(x=>(x.a===a&&x.b===b)||(x.a===b&&x.b===a));selT=[];
    if(!l){SFX.ko&&SFX.ko();tableauCas('❌ Ces deux éléments n’ont pas de rapport évident. Relis les indices et recommence : se tromper aide à apprendre !');return}
    if(l.faux){SFX.ko&&SFX.ko();tableauCas('⚠ '+l.txt);return}
    const k=l.a+'|'+l.b;if(!c.liens[k]){c.liens[k]=l.txt;A().xp+=2;save();SFX.bravo&&SFX.bravo()}tableauCas('✅ '+l.txt)}
  // ---------- laboratoire
  function empreinteSvg(seed,type,taille,zoom){
    const cx=60,cy=70,rs=[];let s=seed*9301+49297;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};
    let h=`<svg viewBox="0 0 120 140" style="width:${taille}px;background:#f4efe0;border-radius:10px;border:2px solid #fff3"><g transform="translate(${60-60*zoom} ${70-70*zoom}) scale(${zoom})">`;
    const tp=['boucle','spirale','arc','boucle','spirale'][seed%5];
    for(let i=1;i<=11;i++){const w=6+i*4.2,hh=8+i*5.2;h+=`<ellipse cx="${cx}" cy="${cy+(tp==='arc'?i*1.2:0)}" rx="${w}" ry="${tp==='spirale'?hh*.9:hh}" fill="none" stroke="#3a2a1a" stroke-width="1.6" stroke-dasharray="${tp==='boucle'&&i<4?'0':'0'}" transform="rotate(${tp==='boucle'?(seed*7%20)-10:tp==='arc'?0:i*3.5} ${cx} ${cy})" opacity="${.55+((i%2)*.3)}"/>`}
    // détails (points caractéristiques)
    for(let i=0;i<5;i++){const a=rnd()*6.28,r2=10+rnd()*30;h+=`<circle cx="${cx+Math.cos(a)*r2}" cy="${cy+Math.sin(a)*r2*1.15}" r="2.2" fill="#c0392b"/>`}
    return h+'</g></svg>'}
  function labo(){
    const mis=Object.keys(CAS).flatMap(id=>{const c=CAS_ST(id),d=CAS[id];return Object.keys(c.indices).filter(i=>d.indices[i].analyse).map(i=>({cas:id,i,nom:d.indices[i].nom,ico:d.indices[i].ico,fait:!!c.analyses[i]}))});
    let h='<h3 style="margin:2px 0">🔬 Laboratoire scientifique</h3><p style="font-size:13px">Ici on analyse les indices avec la loupe et des tests simples. Rapporte des indices de tes enquêtes pour les étudier.</p>';
    if(!mis.length)h+='<p style="font-size:13px;opacity:.85">Aucun indice à analyser pour le moment. Les empreintes, poudres et traces trouvées en enquête apparaîtront ici.</p>';
    mis.forEach(m=>{h+=`<div style="background:#243049;border-radius:12px;padding:9px;margin:5px 0"><b>${m.ico} ${esc(m.nom)}</b> ${m.fait?'<span style="color:#7CFC00">✅ analysé</span>':''}<br>${btn(m.fait?'🔁 Revoir l’analyse':'🔬 Analyser',`detAnalyse('${m.cas}','${m.i}')`,'#2c7fb8')}</div>`});
    h+='<p style="font-size:12px;opacity:.85">💡 Un scientifique compare, mesure et vérifie avant de conclure.</p>';
    panel(h)}
  function analyse(casId,ind,etat){
    const d=CAS[casId],an=d.analyses[d.indices[ind].analyse],x=d.indices[ind];etat=etat||{zoom:1,msg:''};
    let h=`<h3 style="margin:2px 0">🔬 Analyse : ${esc(x.nom)}</h3><p style="font-size:13px">${esc(an.q)}</p>`;
    if(an.type==='empreinte'){
      h+=`<div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap"><div><small>Empreinte trouvée</small><br>${empreinteSvg(an.sujet,'x',150,etat.zoom)}</div></div><p style="font-size:12px">🔎 Loupe : <input type="range" min="1" max="2.2" step=".1" value="${etat.zoom}" oninput="detLoupe('${casId}','${ind}',this.value)" style="width:55%;vertical-align:middle"> ×${etat.zoom}</p><small>Regarde la forme (boucle, spirale, arc) et les points rouges.</small><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">`;
      an.suspects.forEach(([nom,seed],i)=>{h+=`<div style="text-align:center">${empreinteSvg(i===an.bon?an.sujet:seed,'s',96,etat.zoom)}<br><button onclick="detChoixAn('${casId}','${ind}',${i})" style="padding:6px;margin:2px;border-radius:8px;border:0;background:#2e7d32;color:#fff;font-size:12px">${esc(nom)}</button></div>`})}
    else{h+=an.choix.map((c,i)=>btn(esc(c),`detChoixAn('${casId}','${ind}',${i})`)).join('<br>')}
    if(etat.msg)h+=`<div style="background:#243049;border-radius:10px;padding:8px;margin:8px 0;font-size:13px">${etat.msg}</div>`;
    h+='<p>'+btn('↩ Laboratoire','detLabo()')+'</p>';panel(h,true)}
  function choixAnalyse(casId,ind,i){
    const d=CAS[casId],x=d.indices[ind],an=d.analyses[x.analyse],c=CAS_ST(casId);
    const ok=an.type==='empreinte'?i===an.bon:i===an.bonne;
    if(ok){D.mis&&D.mis.evt('det','analyse',ind);if(!c.analyses[ind]){c.analyses[ind]=true;A().xp+=4;save()}SFX.bravo&&SFX.bravo();analyse(casId,ind,{zoom:1,msg:'✅ <b>Analyse réussie !</b> '+esc(an.exp)})}
    else{SFX.ko&&SFX.ko();analyse(casId,ind,{zoom:an.type==='empreinte'?1.8:1,msg:'❌ Pas tout à fait. '+(an.type==='empreinte'?'Utilise la loupe : compare la forme du dessin et la position des points rouges.':'Relis la question et réfléchis : un scientifique teste avant de conclure.')})}}
  // ---------- solution
  let sol=null;
  function solution(){
    const d=casDef(),c=CAS_ST(cas);const manque=[];
    if(!c.trouve)manque.push('trouver l’objet disparu');
    if(Object.keys(c.liens).length<d.liensRequis)manque.push('valider '+d.liensRequis+' rapprochements dans le tableau ('+Object.keys(c.liens).length+' actuellement)');
    if(manque.length){panel(`<h3>🧠 Ma solution</h3><p style="font-size:14px">Un bon détective ne devine pas : il a des preuves. Il te reste à : <b>${manque.join(' · ')}</b>.</p>${btn('↩ Carnet','detCarnet()')}`);return}
    sol={i:0,err:0,rep:undefined};questionSol()}
  function questionSol(){
    const d=casDef(),q=d.questions[sol.i];
    let h=`<h3 style="margin:2px 0">🧠 Ma solution · question ${sol.i+1}/${d.questions.length}</h3><p style="font-size:15px"><b>${esc(q.q)}</b></p>`;
    q.c.forEach((x,i)=>{const bg=sol.rep===undefined?'#243049':(i===q.a?'#2e7d32':i===sol.rep?'#b23a3a':'#243049');h+=`<button ${sol.rep!==undefined&&sol.rep===q.a?'disabled':''} onclick="detSolRep(${i})" style="display:block;width:100%;text-align:left;padding:11px;margin:4px 0;border-radius:10px;border:2px solid #fff3;background:${bg};color:#fff;font-size:14px">${'ABCD'[i]}. ${esc(x)}</button>`});
    if(sol.rep!==undefined){h+=sol.rep===q.a?`<p style="font-size:13px">✅ <b>Exact !</b> ${esc(q.exp)}</p>${btn(sol.i+1<d.questions.length?'Suivant ▶':'Terminer l’enquête ▶','detSolSuite()','#2e7d32')}`:`<p style="font-size:13px">❌ <b>Ce n’est pas ça.</b> 💡 Indice : ${esc(q.aide)}</p>${btn('Réessayer','detSolRetry()','#2c7fb8')}`}
    panel(h,true)}
  function finEnquete(){
    const d=casDef(),c=CAS_ST(cas),pho=c.photos.length,ind=nbIndices(cas)/Object.keys(d.indices).length;
    let stars=1+(sol.err<=1?1:0)+((pho>=3&&ind>=.75)?1:0);const prem=!c.fini;c.fini=true;c.stars=Math.max(c.stars||0,stars);c.essais=(c.essais||0)+1;
    const idm={musee:'d1',ecole:'d2'}[cas],a=A();D.mis&&D.mis.evt('det','fini',idm==='d1'?'d1':'d2');a.done['met:'+idm]=true;a.stars['met:'+idm]=Math.max(a.stars['met:'+idm]||0,stars);
    let gain=0;if(prem){gain=15+5*stars;a.pieces+=gain;a.xp+=20+5*stars;refreshHud()}
    const t=a.tal||(a.tal={});t.enquete=(t.enquete||0)+15;
    const nvCert=!DET().cert;if(nvCert)DET().cert={date:new Date().toLocaleDateString('fr-FR'),cas:cas};
    save();SFX.win&&SFX.win();
    panel(`<div style="text-align:center"><div style="font-size:40px">🕵️🎉</div><h3>Affaire résolue !</h3><div style="font-size:30px">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div><p style="font-size:14px;text-align:left">${esc(d.conclusion)}</p><p style="font-size:13px">Erreurs : ${sol.err} · Indices : ${nbIndices(cas)}/${Object.keys(d.indices).length} · Photos : ${pho}${gain?' · <b>+'+gain+' 🪙</b>':''}</p>${nvCert?btn('🎓 Recevoir mon certificat','detCert()','#6a1b9a','font-size:16px'):''}${btn('📂 Mes dossiers','detDossiers()','#2c7fb8')}${btn('🏢 Retour à l’agence','detAgence()')}</div>`,true);
    parler('Affaire résolue, bravo détective !')}
  function certificat(){
    const d=DET(),cert=d.cert||{date:new Date().toLocaleDateString('fr-FR')};
    panel(`<div style="background:linear-gradient(#fdf6e3,#f3e3b5);color:#3a2a10;border:6px double #b8860b;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">AGENCE DE DÉTECTIVES BOYEKOLI</div><div style="font-size:44px">🕵️</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE DÉTECTIVE DÉBUTANT</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Petit détective')}</div><p style="font-size:13px">pour avoir observé, interrogé, comparé les indices et résolu sa première enquête avec logique et honnêteté.</p><p style="font-size:12px">Fait le ${esc(cert.date)} · Inspectrice Mado</p><div style="font-size:28px">🎖</div></div><p style="font-size:11px;opacity:.7">Ce certificat est conservé dans ton espace personnel.</p>`)}
  // ---------- personnalisation du détective
  function perso(){
    const L=DET().look;
    panel(`<h3 style="margin:2px 0">👤 Mon détective</h3><p style="font-size:13px">Personnalise ton personnage :</p><b>Genre</b><br>${btn('👧 Fille',"detLook('s','f')",L.s==='f'?'#ffd54f':'','color:'+(L.s==='f'?'#222':'#fff'))}${btn('👦 Garçon',"detLook('s','h')",L.s==='h'?'#ffd54f':'','color:'+(L.s==='h'?'#222':'#fff'))}<br><b>Manteau</b><br>${COULEURS_MANTEAU.map(c=>`<button onclick="detLook('c','${c}')" style="width:36px;height:36px;border-radius:50%;margin:3px;border:3px solid ${L.c===c?'#fff':'#0004'};background:${c}"></button>`).join('')}<br><b>Coiffure</b><br>${COIFFURES.map(([n,v])=>btn(n,`detLook('hair','${v}')`,L.hair===v?'#ffd54f':'','color:'+(L.hair===v?'#222':'#fff'))).join('')}<br><b>Peau</b><br>${[0,1,2,3,4,5].map(i=>`<button onclick="detLook('skin',${i})" style="width:34px;height:34px;border-radius:50%;margin:3px;border:3px solid ${L.skin===i?'#fff':'#0004'};background:${['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'][i]}"></button>`).join('')}`)}
  // ---------- actions exposées
  const actions={
    detOuvrir:c=>ouvrir(c),
    detQuitter:()=>quitter(),
    detFermerP:()=>fermerP(),
    detInteragir:()=>interagir(),detExaminer:()=>examiner(),detPhoto:()=>photographier(),detInv:()=>inventaire(),detCarnet:()=>carnet(),
    detRetour:()=>{if(panneau)fermerP();else quitter()},detRep:(nid,nx)=>{if(!nx){fermerP();return}ouvrirNoeud(dialG,nx,dialG.__p)},
    detDossiers:()=>dossiers(),detPartir:id=>{fermerP();partir(id)},detAgence:()=>{fermerP();chargerAgence()},
    detSelT:k=>{const i=selT.indexOf(k);if(i>=0)selT.splice(i,1);else{if(selT.length>=2)selT.shift();selT.push(k)}tableauCas()},detRelier:()=>relier(),detTableauCas:()=>{selT=[];tableauCas()},
    detLabo:()=>labo(),detAnalyse:(c,i)=>analyse(c,i),detLoupe:(c,i,v)=>analyse(c,i,{zoom:+v,msg:''}),detChoixAn:(c,i,k)=>choixAnalyse(c,i,k),
    detSolution:()=>solution(),
    detSolRep:i=>{const q=casDef().questions[sol.i];if(sol.rep!==undefined&&sol.rep===q.a)return;sol.rep=i;if(i!==q.a)sol.err++;else SFX.ok&&SFX.ok();questionSol()},
    detSolRetry:()=>{sol.rep=undefined;questionSol()},
    detSolSuite:()=>{const d=casDef();if(sol.i+1<d.questions.length){sol.i++;sol.rep=undefined;questionSol()}else finEnquete()},
    detCert:()=>certificat(),detPerso:()=>perso(),
    detLook:(k,v)=>{const l=DET().look;l[k]=v;save();mot.setLook(l);perso()}
  };
  return {actions,ouvrir,fermer,DET,CAS_ST,estOuvert:()=>!!ov,bouton:()=>'',mot:()=>mot};
}
