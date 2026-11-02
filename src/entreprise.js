// BOYEKOLI BUSINESS SIMULATOR : école virtuelle d'entrepreneuriat. Création de l'entreprise (nom, logo, secteur, lieu, produits, capital),
// établissement 3D explorable avec clients et employés animés, gestion financière, fournisseurs, personnel, marketing, événements,
// expansion et bilans de compétences. Tout fonctionne hors ligne ; la progression est sauvegardée automatiquement.
import {creerMoteur} from './detective/moteur.js';
import {SECTEURS,LIEUX,FOURNISSEURS,EMPLOIS,EQUIP,CAMPAGNES,SLOGANS,LOGO_SYMBOLES,LOGO_COULEURS,CAPITAUX,NIVEAUX,COMPETENCES,EVENEMENTS} from './entreprise/data.js';
import * as SIM from './entreprise/sim.js';
import {layoutDe,ZONES_RAYON,FILE,POSTE_CAISSE,LOOKS_CLIENTS} from './entreprise/layout.js';
const {fmt,secteur,lieu,four,emploi}=SIM;

export function creerEntreprise(D){
  const {PAR,G,esc,SFX,save,refreshHud,openBox,closeDialog,toast,rebuild}=D;
  const A=()=>G.adv;
  const META=()=>{const a=A();if(!a.entMeta)a.entMeta={done:{},cert:null,niv:0};return a.entMeta};
  const E0=()=>A().ent||null;
  let ov=null,mot=null,E=null,W=null,phase='prep',tJ=0,DUR=80,vit=1,pause=false,sched=[],clients=[],timer=0,cand=null,panneau=null,kb=null,popH=null,nClients=0,srv=null,sautSave=0,lastMsg='',kidx=0;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:9px 12px;margin:3px;border-radius:12px;border:2px solid #fff3;background:${bg||'#3b4a5e'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:14px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const sec=t=>`<div style="font-size:12px;opacity:.75;margin:6px 0 2px">${t}</div>`;
  const carte=t=>`<div style="background:#1b2535;border-radius:12px;padding:9px;margin:6px 0;font-size:13px">${t}</div>`;
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>{A().ent=E;save()},350)};
  const reg=()=>{A().ent=E;objectifs();save()};
  function msg(t,ms){const m=$('entmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3000)}
  // ---------- logo
  function logoHtml(L,taille){const s=taille||56,r=L.forme==='cercle'?'50%':L.forme==='carre'?'10px':'50% 50% 14px 14px';return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${s}px;height:${s}px;border-radius:${r};background:${L.col};font-size:${s*.55}px;border:3px solid #fff;vertical-align:middle">${L.sym}</span>`}
  // ---------- ouverture
  function ouvrir(lieuPref){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);E=E0();
    ov=document.createElement('div');ov.id='entov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#141c2b;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#7a5a10,#c9902a);flex:0 0 auto"><b id="enttit" style="flex:1;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">💼 BOYEKOLI BUSINESS</b>${btn('✖','entQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div><div id="entbody" style="flex:1;display:flex;flex-direction:column;min-height:0;position:relative"></div><div id="entpan" style="position:absolute;inset:0;background:rgba(14,20,32,.98);display:none;flex-direction:column;padding:10px 10px 90px;overflow:auto;z-index:20"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'entRetour()'});
    try{history.pushState({ent:1},'')}catch(e){}popH=()=>{if(ov)quitter()};window.addEventListener('popstate',popH);
    if(!E){W={step:0,nom:'',logo:{sym:'⭐',col:'#c0392b',forme:'cercle'},sect:null,type:null,lieu:lieuPref||'zando',loc:'loue',prods:[],capital:250000};if(lieuPref==='supvillage'){W.sect='commerce';W.type='super';W.loc='achete';W.step=0}wizard()}else jeu()}
  function fermer(sil){stopJeu();if(popH){window.removeEventListener('popstate',popH);popH=null}if(ov){ov.remove();ov=null}if(!sil&&E)save()}
  function quitter(){const a=!!ov;fermer();if(a)closeDialog()}
  function stopJeu(){clearInterval(timer);timer=0;if(kb){window.removeEventListener('keydown',kb);kb=null}if(mot){mot.stop();mot=null}clients=[];sched=[];panneau=null;phase='prep'}
  // ---------- ASSISTANT DE CRÉATION
  function wizard(){
    const body=$('entbody');const S=W.sect&&secteur(W.sect);const pas=['Identité','Secteur','Type','Emplacement','Produits','Capital'];
    let h=`<div style="padding:8px 10px;overflow:auto;flex:1;padding-bottom:110px"><div style="font-size:12px;opacity:.8">Création de l’entreprise · étape ${W.step+1}/6 : <b>${pas[W.step]}</b></div>`;
    if(W.step===0){
      h+=`<h3 style="margin:6px 0">🏷 Nom et logo</h3><input id="entnom" maxlength="24" value="${esc(W.nom)}" placeholder="Nom de ton entreprise" oninput="entNom(this.value)" style="width:100%;padding:11px;border-radius:10px;border:2px solid #fff4;background:#1b2535;color:#fff;font-size:16px;box-sizing:border-box">`+
        `<div style="margin:10px 0;text-align:center" id="entlogo">${logoHtml(W.logo,84)}</div>${sec('Symbole')}${LOGO_SYMBOLES.map(s=>`<button onclick="entLogo('sym','${s}')" style="font-size:22px;width:44px;height:44px;margin:2px;border-radius:10px;border:3px solid ${W.logo.sym===s?'#fff':'#0004'};background:#1b2535">${s}</button>`).join('')}${sec('Couleur')}${LOGO_COULEURS.map(c=>`<button onclick="entLogo('col','${c}')" style="width:38px;height:38px;margin:2px;border-radius:50%;border:3px solid ${W.logo.col===c?'#fff':'#0004'};background:${c}"></button>`).join('')}${sec('Forme')}${[['cercle','⚪ Rond'],['carre','⬜ Carré'],['ecusson','🛡 Écusson']].map(f=>btn(f[1],`entLogo('forme','${f[0]}')`,W.logo.forme===f[0]?'#ffd54f':'')).join('')}`}
    else if(W.step===1){h+='<h3 style="margin:6px 0">🏭 Choisis ton secteur d’activité</h3>'+SECTEURS.map(s=>`<div onclick="entSect('${s.id}')" style="background:${W.sect===s.id?'#4a3e18':'#1b2535'};border:2px solid ${W.sect===s.id?'#ffd54f':'transparent'};border-radius:12px;padding:9px;margin:5px 0;font-size:14px"><b>${s.ico} ${esc(s.nom)}</b><br><span style="font-size:12px;opacity:.8">${s.prod.slice(0,3).map(p=>esc(p.nom)).join(' · ')}…</span></div>`).join('')}
    else if(W.step===2){h+=`<h3 style="margin:6px 0">${S.ico} Quel type d’${S.nom.toLowerCase()} ?</h3>`+S.types.map(t=>`<div onclick="entType('${t[0]}')" style="background:${W.type===t[0]?'#4a3e18':'#1b2535'};border:2px solid ${W.type===t[0]?'#ffd54f':'transparent'};border-radius:12px;padding:9px;margin:5px 0"><b>${esc(t[1])}</b><br><span style="font-size:12px;opacity:.85">Clientèle ×${t[2]} · coût de mise en place : <b>${fmt(t[3]*.5)}</b></span></div>`).join('')}
    else if(W.step===3){h+='<h3 style="margin:6px 0">📍 Où installer ton établissement ?</h3><p style="font-size:12px;opacity:.85;margin:2px 0">Plus il y a de passage, plus il y a de clients… mais le loyer et la concurrence augmentent.</p>'+LIEUX.map(l=>`<div onclick="entLieu('${l.id}')" style="background:${W.lieu===l.id?'#4a3e18':'#1b2535'};border:2px solid ${W.lieu===l.id?'#ffd54f':'transparent'};border-radius:12px;padding:8px;margin:4px 0;font-size:13px"><b>${esc(l.nom)}</b><br>👥 passage ×${l.traffic} · 🏠 loyer ${fmt(l.loyer)}/jour · ⚔ concurrence ×${l.conc}${l.special?' · <b>rachat 600 000 FC</b>':''}</div>`).join('')+sec('Local')+(lieu(W.lieu).special?'<p style="font-size:13px">Tu rachètes le supermarché du village (propriété).</p>':btn('🏠 Louer',"entLoc('loue')",W.loc==='loue'?'#ffd54f':'')+btn('🏦 Acheter ('+fmt(lieu(W.lieu).loyer*400)+')',"entLoc('achete')",W.loc==='achete'?'#ffd54f':''))}
    else if(W.step===4){const sel=W.prods;h+=`<h3 style="margin:6px 0">🛍 Produits et services proposés</h3><p style="font-size:12px;opacity:.85;margin:2px 0">Choisis 3 à 6 produits. La marge, c’est le prix de vente moins le prix d’achat.</p>`+S.prod.map(p=>`<div onclick="entProd('${p.id}')" style="background:${sel.includes(p.id)?'#1f3d22':'#1b2535'};border:2px solid ${sel.includes(p.id)?'#7CFC00':'transparent'};border-radius:12px;padding:8px;margin:4px 0;font-size:13px">${sel.includes(p.id)?'✅':'⬜'} ${p.ico} <b>${esc(p.nom)}</b><br>achat ${fmt(p.cout)} → vente ${fmt(p.prix)} · marge ${Math.round((p.prix-p.cout)/p.prix*100)} %</div>`).join('')}
    else{const L=lieu(W.lieu),T=S.types.find(t=>t[0]===W.type),mise=Math.round(T[3]*.5*(L.special?2:1)*1),local=W.loc==='achete'?(L.special?600000:L.loyer*400):0,mini=mise+local;
      h+=`<h3 style="margin:6px 0">💰 Capital de départ</h3><p style="font-size:12px;opacity:.85;margin:2px 0">C’est l’argent dont tu disposes. Un petit capital est risqué ; un grand capital te laisse plus de marge d’erreur.</p>`+CAPITAUX.map(c=>btn(fmt(c),`entCap(${c})`,W.capital===c?'#ffd54f':c<mini+30000?'#555':'')).join('')+carte(`<b>Récapitulatif</b><br>${logoHtml(W.logo,34)} <b>${esc(W.nom||'Mon entreprise')}</b> · ${esc(S.nom)} · ${esc(T[1])}<br>📍 ${esc(L.nom)} (${W.loc==='achete'?'achat':'location'})<br>🛍 ${W.prods.length} produit(s)<br>Mise en place : ${fmt(mise)}${local?' · achat du local : '+fmt(local):''}<br>Stock de départ : ~${fmt(W.capital*.45)} (45 % du capital)<br>Trésorerie restante : ~<b>${fmt(Math.max(0,W.capital-mise-local-W.capital*.45))}</b>${W.capital<mini+30000?'<br><span style="color:#ffb74d">Capital insuffisant : choisis un capital plus grand, un local en location ou un type moins cher.</span>':''}`)}
    h+='</div>';
    const peut=W.step===0?W.nom.trim().length>=2:W.step===1?!!W.sect:W.step===2?!!W.type:W.step===4?W.prods.length>=3&&W.prods.length<=6:true;
    h+=`<div style="position:absolute;left:0;right:0;bottom:70px;padding:6px 10px;background:linear-gradient(transparent,#141c2b 30%);display:flex;gap:8px">${W.step>0?btn('◀ Précédent','entPas(-1)','#3b4a5e','flex:1'):''}${W.step<5?btn('Suivant ▶','entPas(1)',peut?'#2e7d32':'#555','flex:1'):btn('🚀 Créer mon entreprise','entCreer()','#2e7d32','flex:1')}</div>`;
    body.innerHTML=h}
  function creerE(){
    const S=secteur(W.sect),T=S.types.find(t=>t[0]===W.type),L=lieu(W.lieu),mise=Math.round(T[3]*.5*(L.special?2:1)),local=W.loc==='achete'?(L.special?600000:L.loyer*400):0;
    if(W.capital<mise+local+30000){toast('Capital insuffisant pour cette configuration.');SFX.ko&&SFX.ko();return}
    E=SIM.creer({nom:W.nom.trim(),logo:W.logo,sect:W.sect,type:W.type,lieu:W.lieu,loc:L.special?'achete':W.loc,capital:W.capital,prods:W.prods});A().ent=E;reg();rebuild&&rebuild();SFX.win&&SFX.win();
    PAR.dire('Félicitations ! Ton entreprise '+E.nom+' est créée. Commence par vérifier ton stock, puis ouvre ta première journée.','bea');jeu()}
  // ---------- JEU 3D
  function jeu(){
    stopJeu();E=E0();const S=secteur(E.sect);$('enttit').innerHTML=logoHtml(E.logo,24)+' '+esc(E.nom);
    const body=$('entbody');body.innerHTML=`<div id="entstat" style="padding:3px 8px;font-size:12px;background:#0b111c;flex:0 0 auto"></div><div id="ent3d" style="flex:1;position:relative;min-height:0"><div id="entmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(8,14,24,.92);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:4"></div><div id="entsrv" style="position:absolute;left:6px;right:6px;top:34px;z-index:5"></div><div id="enthud" style="position:absolute;left:0;right:0;bottom:0;height:150px;pointer-events:none"></div></div><div id="entbar" style="display:flex;overflow-x:auto;background:#0b111c;flex:0 0 auto;padding-bottom:62px"></div>`;
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    mot=creerMoteur($('ent3d'),{low,look:{s:G.sexe==='h'?'h':'f',skin:3,hair:'courtes',outfit:'polo',c:E.logo.col},onProche:p=>{pr=p;majBouton()}});
    chargerScene();hud();barre();majStat();kb=e=>{if(!ov||panneau)return;const k=e.key.toLowerCase();if(k==='e')interagir();else if(k==='escape')quitter()};window.addEventListener('keydown',kb);
    timer=setInterval(()=>tick(.1*vit),100);
    if(E.ev)setTimeout(evenementUI,600);else if(E.bilan)setTimeout(bilanScenario,600);
    PAR.dire(E.jour===1?'Voici ton établissement. Approche-toi du comptoir de stock pour commander, fixe tes prix, puis ouvre la journée.':'Bon retour dans ton entreprise, patron.','bea')}
  let pr=null;
  function chargerScene(depart){const e=mot.etat?mot.etat():null;mot.charger(layoutDe(E,depart||{x:0,z:5.5}))}
  function majBouton(){const b=$('bint');if(!b)return;if(!pr){b.innerHTML='✋ Interagir';return}const t=pr.kind==='pnj'?'💬 '+pr.def.nom:pr.kind==='sortie'?pr.def.label:(pr.def.label||'✋ '+pr.def.nom);b.innerHTML=t.length>32?t.slice(0,31)+'…':t}
  function hud(){
    const h=$('enthud');h.innerHTML=`<div id="joy" style="position:absolute;left:12px;bottom:12px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid #fff5;pointer-events:auto;touch-action:none"><div id="jk" style="position:absolute;left:40px;top:40px;width:38px;height:38px;border-radius:50%;background:#fff;opacity:.85"></div></div><div style="position:absolute;right:10px;bottom:12px;pointer-events:auto">${btn('✋ Interagir','entInteragir()','#2e7d32','padding:14px 16px;font-size:15px').replace('<button','<button id="bint"')}</div>`;
    const jb=$('joy'),jk=$('jk');let id=null;
    const mv=e=>{const b=jb.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}mot.joy.x=dx;mot.joy.y=dy;jk.style.left=(40+dx*38)+'px';jk.style.top=(40+dy*38)+'px'};
    jb.addEventListener('pointerdown',e=>{e.preventDefault();jb.setPointerCapture(e.pointerId);id=e.pointerId;mv(e)});jb.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>jb.addEventListener(n,e=>{if(e.pointerId===id){id=null;mot.joy.x=mot.joy.y=0;jk.style.left='40px';jk.style.top='40px'}}))}
  function barre(){
    const b=$('entbar');if(!b)return;const ouvert=phase==='ouvert';
    b.innerHTML=(ouvert?btn(pause?'▶ Reprendre':'⏸ Pause','entPause()','#3b4a5e')+btn('⏩ ×'+(vit===1?2:vit===2?3:1),'entVit()','#3b4a5e')+btn('🛑 Fermer maintenant','entFermerJour()','#7b4a2d'):btn('▶ Ouvrir la journée '+E.jour,'entOuvrirJour()','#2e7d32'))+btn('📊 Bureau','entPan(\'bureau\')')+btn('📦 Stock','entPan(\'stock\')')+btn('👥 Personnel','entPan(\'rh\')')+btn('📣 Marketing','entPan(\'mkt\')')+btn('🚀 Expansion','entPan(\'exp\')')+btn('🏅 Progression','entPan(\'prog\')')}
  function majStat(){
    const e=$('entstat');if(!e||!E)return;const j=E.jr,prog=phase==='ouvert'?Math.round(tJ/DUR*100):0;
    e.innerHTML=`💰 <b>${fmt(E.cash)}</b> · 📅 Jour <b>${E.jour}</b> · ⭐ réputation <b>${Math.round(E.rep)}</b> · 👥 ${j.clients} servi(s) / ${j.perdus} perdu(s)${E.dette?' · 🏦 dette '+fmt(E.dette):''}<div style="height:5px;background:#222;border-radius:3px;margin-top:2px"><div style="height:5px;width:${prog}%;background:#ffd54f;border-radius:3px"></div></div>`}
  // ---------- journée
  function ouvrirJour(){
    if(phase==='ouvert')return;if(E.ev){evenementUI();return}if(E.bilan){bilanScenario();return}
    phase='ouvert';tJ=0;pause=false;E.vu={};
    const n=Math.max(2,Math.min(26,Math.round(SIM.demandeJour(E)*(.85+.3*SIM.rnd(E)))));sched=[];for(let i=0;i<n;i++){const c=SIM.nouveauClient(E);if(c)sched.push({t:2+i*(DUR-14)/n+SIM.rnd(E)*3,c})}
    sched.sort((a,b)=>a.t-b.t);nClients=n;srv=null;barre();msg('🟢 La journée '+E.jour+' commence : '+n+' client(s) attendus.',3000);SFX.coin&&SFX.coin()}
  function tick(dt){
    if(!ov||!mot||pause)return;const hauteur=phase==='ouvert';
    if(hauteur){tJ+=dt;while(sched.length&&sched[0].t<=tJ)entrerClient(sched.shift().c);maj_clients(dt);
      if(tJ>=DUR&&!sched.length&&!clients.some(c=>c.etat!=='sort'))finirJour();else if(tJ>DUR+25)finirJour();
      if(tJ%1<dt)majStat()}
    majServir()}
  function entrerClient(c){
    const look=LOOKS_CLIENTS[Math.floor(SIM.rnd(E)*LOOKS_CLIENTS.length)],o={c,etat:'entre',t:0,look,id:'cl_'+c.id+'_'+(kidx++),zone:ZONES_RAYON[Math.floor(SIM.rnd(E)*ZONES_RAYON.length)],fileIdx:-1};
    clients.push(o);mot.ajouterPnj({id:o.id,nom:'',x:0,z:10,ry:Math.PI,look});mot.allerA(o.id,0,7.4,1.6*vit,()=>{if(!ov||!mot)return;o.etat='rayon';o.t=2+SIM.rnd(E)*2;mot.allerA(o.id,o.zone[0],o.zone[1],1.5*vit)})}
  function maj_clients(dt){
    clients.forEach(o=>{
      if(o.etat==='rayon'){o.t-=dt;const p=mot.pnjPos(o.id);if(o.t<=0&&p&&!p.marche){o.etat='vers_file';placerFile(o)}}
      else if(o.etat==='attente'){o.c.patience-=dt*(E.emp.some(e=>e.role==='vendeur')?.7:1);if(o.c.patience<=0&&o!==srv)partir(o,false,'a perdu patience')}
    });
    // service automatique par un caissier
    const tete=clients.filter(o=>o.etat==='attente')[0];
    if(tete&&SIM.empParRole(E,'caissier').length){tete.auto=(tete.auto||0)+dt*(E.equip.caisse?1.2:1);if(tete.auto>=3){const r=SIM.autoServir(E,tete.c);finServi(tete,r)}}
    clients=clients.filter(o=>o.etat!=='fini')}
  function placerFile(o){const att=clients.filter(c=>c.etat==='attente'||c.etat==='vers_file').length;o.fileIdx=Math.min(FILE.length-1,att-1);const f=FILE[Math.max(0,o.fileIdx)];mot.allerA(o.id,f[0],f[1],1.5*vit,()=>{if(o.etat==='vers_file')o.etat='attente'})}
  function recaler(){clients.filter(c=>c.etat==='attente'||c.etat==='vers_file').forEach((c,i)=>{const f=FILE[Math.min(FILE.length-1,i)];mot.allerA(c.id,f[0],f[1],1.5*vit)})}
  function partir(o,content,motif){
    if(o.etat==='sort'||o.etat==='fini')return;o.etat='sort';if(!content&&motif){E.jr.perdus++;E.rep=Math.max(0,E.rep-.6);if(motif)msg('😞 '+o.c.nom+' '+motif)}
    if(srv===o){srv=null;majServir(true)}mot.allerA(o.id,0,11,1.8*vit,()=>{mot.retirerPnj(o.id);o.etat='fini'});recaler()}
  function finServi(o,r){
    if(!r)return;if(srv===o)srv=null;majStat();
    msg((r.ok?'✅ ':'❌ ')+o.c.nom+' : '+r.msg,3200);SFX[r.ok?'coin':'ko']&&SFX[r.ok?'coin':'ko']();partir(o,r.ok,null);majServir(true);sauve()}
  function finirJour(){
    if(phase!=='ouvert')return;phase='ferme';clearInterval(timer);timer=setInterval(()=>tick(.1),100);
    clients.forEach(o=>{if(['entre','rayon','vers_file','attente'].includes(o.etat)){E.jr.perdus++;E.rep=Math.max(0,E.rep-.3)}if(o.etat!=='fini'){try{mot.retirerPnj(o.id)}catch(e){}}});clients=[];srv=null;majServir(true);
    const r=SIM.finJour(E);reg();phase='prep';barre();majStat();if(E.nvNouveau!==undefined){PAR.dire('Nouveau niveau atteint : '+NIVEAUX[E.nvNouveau][1],'bea');E.nvNouveau=undefined}
    chargerScene({x:0,z:5.5});bilanJour(r)}
  // ---------- file d'attente et caisse
  function majServir(force){
    const z=$('entsrv');if(!z)return;const att=clients.filter(o=>o.etat==='attente');
    const auto=SIM.empParRole(E,'caissier').length>0;
    if(!att.length||auto||panneau){if(z.innerHTML&&(force||!att.length||auto||panneau))z.innerHTML='';return}
    const o=att[0];srv=o;const c=o.c,S=secteur(E.sect),pd=S.prod.find(p=>p.id===c.prod),p=E.prods.find(x=>x.id===c.prod),ref=Math.round(SIM.prixRef(E,c.prod));
    const phrase={rapide:'Je suis pressé·e, servez-moi vite !',comparateur:'Je compare les prix avant d’acheter…',negociateur:'Vous pouvez faire un petit prix ?',exigeant:'J’espère que le service est de qualité.',fidele:'Bonjour patron, comme d’habitude !'}[c.type];
    const clé=o.id+(p?p.prix:0);if(z.dataset.k===clé&&!force)return;z.dataset.k=clé;
    z.innerHTML=`<div style="background:rgba(10,16,28,.95);border:2px solid #ffd54f;border-radius:14px;padding:8px 10px"><div style="font-size:13px"><b>${esc(c.nom)}</b> · <span style="color:#ffd54f">${SIM.typeLabel[c.type]}</span> · ${c.paie==='mobile'?'📲 Mobile Money':'💵 Espèces'}</div><div style="background:#fff;color:#111;border-radius:14px;padding:5px 10px;margin:4px 0;font-size:13px;font-weight:600">${esc(phrase)} — ${c.qte} × ${pd.ico} ${esc(pd.nom)}</div><div style="font-size:12px;opacity:.85">Ton prix : <b>${p?fmt(p.prix):'—'}</b> · marché ≈ ${fmt(ref)} · stock : ${p?p.stock:0} · budget du client ≈ ${fmt(c.budget)}</div><div>${btn('💰 Vendre','entServir(0)','#2e7d32','padding:7px 10px')}${btn('−5 %','entServir(.05)','#2c7fb8','padding:7px 10px')}${btn('−10 %','entServir(.1)','#2c7fb8','padding:7px 10px')}${btn('✖ Refuser','entRefuser()','#7b2d26','padding:7px 10px')}</div></div>`}
  // ---------- interaction
  function interagir(){
    if(!mot||panneau)return;const p=mot.proche();if(!p){msg('Rien à utiliser ici. Approche-toi d’un meuble ou d’un employé.',2200);return}
    if(p.kind==='sortie'){quitter();return}
    if(p.kind==='pnj'){const e=E.emp.find(x=>'emp_'+x.id===p.def.id);if(e){mot.parler(p.def.id,5);PAR.afficher(ov,{nom:e.nom+' · '+emploi(e.role).nom,texte:'Je travaille ici depuis quelques jours. Mon salaire est de '+fmt(e.sal)+' par jour et ma motivation est de '+Math.round(e.sat)+' %.'+(e.sat<45?' J’aimerais être mieux considéré·e…':' Tout se passe bien, patron !'),voice:PAR.voixDe(p.def),ancre:mot.ecran(p.def.id),choix:[['Merci pour ton travail','entFermerBulle()']],retour:'entFermerBulle()'});panneau='bulle';mot.fige(true)}return}
    const o=p.def;if(o.panneau){entPan(o.panneau==='caisse'?'caisse':o.panneau);return}msg(o.ex||o.nom,4000)}
  function panel(h){PAR.cacher();panneau=true;mot&&mot.fige(true);const p=$('entpan');p.style.display='flex';p.innerHTML=h}
  function fermerP(){PAR.cacher();panneau=null;const p=$('entpan');if(p){p.style.display='none';p.innerHTML=''}mot&&mot.fige(false);if(ov&&mot){barre();majStat();const z=$('entsrv');if(z)z.dataset.k=''}}
  // ---------- BUREAU : finances
  function courbe(vals,w,h,col){if(vals.length<2)return '<div style="font-size:12px;opacity:.7">Pas encore assez de données.</div>';const mn=Math.min(...vals),mx=Math.max(...vals),sp=Math.max(1,mx-mn);const pts=vals.map((v,i)=>[i/(vals.length-1)*(w-10)+5,h-8-(v-mn)/sp*(h-16)]);return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;background:#0b111c;border-radius:10px"><polyline fill="none" stroke="${col}" stroke-width="3" points="${pts.map(p=>p.join(',')).join(' ')}"/><text x="6" y="14" fill="#9ab" font-size="10">${fmt(mx)}</text><text x="6" y="${h-4}" fill="#9ab" font-size="10">${fmt(mn)}</text></svg>`}
  function barres(hist){const h=hist.slice(-12);if(!h.length)return '';const mx=Math.max(1,...h.map(x=>Math.max(x.ca,x.dep))),w=300,H=110,bw=w/h.length;return `<svg viewBox="0 0 ${w} ${H}" style="width:100%;background:#0b111c;border-radius:10px">${h.map((x,i)=>`<rect x="${i*bw+3}" y="${H-6-x.ca/mx*(H-16)}" width="${bw/2-3}" height="${x.ca/mx*(H-16)}" fill="#2e9e4a"/><rect x="${i*bw+bw/2}" y="${H-6-x.dep/mx*(H-16)}" width="${bw/2-3}" height="${x.dep/mx*(H-16)}" fill="#d6302b"/>`).join('')}</svg><div style="font-size:11px;opacity:.8">🟩 recettes · 🟥 dépenses (derniers jours)</div>`}
  function bureau(){
    E.vu.bureau=true;SIM.gagner(E,'compta',.3);const h=E.fin.hist,der=h[h.length-1],S=secteur(E.sect),n=SIM.niveau(E);
    let t=`<h3 style="margin:2px 0">📊 Bureau : tableau de bord</h3><div style="font-size:12px;opacity:.85">${logoHtml(E.logo,28)} <b>${esc(E.nom)}</b> · ${esc(S.nom)} · ${esc(lieu(E.lieu).nom)}<br>${NIVEAUX[n][2]} ${NIVEAUX[n][1]}</div>`;
    t+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0">${[['💰 Capital disponible',fmt(E.cash)],['🧾 Chiffre d’affaires cumulé',fmt(E.fin.cumCA)],['💸 Dépenses cumulées',fmt(E.fin.cumDep)],['📈 Bénéfice net cumulé',fmt(E.fin.cumBenef)],['🏦 Dettes',fmt(E.dette)],['📦 Valeur du stock',fmt(SIM.valeurStock(E))],['🏢 Valeur nette',fmt(SIM.valeurNette(E))],['⭐ Réputation',Math.round(E.rep)+' / 100']].map(c=>`<div style="background:#1b2535;border-radius:10px;padding:7px;font-size:12px">${c[0]}<br><b style="font-size:14px;color:${/Bénéfice/.test(c[0])&&E.fin.cumBenef<0?'#ff8a80':'#fff'}">${c[1]}</b></div>`).join('')}</div>`;
    if(der)t+=carte(`<b>Dernière journée (jour ${der.j})</b><br>Recettes ${fmt(der.ca)} · Coût des marchandises vendues ${fmt(der.cogs)} · Dépenses de la journée ${fmt(der.dep)}<br>Bénéfice net : <b style="color:${der.benef>=0?'#7CFC00':'#ff8a80'}">${fmt(der.benef)}</b> (${der.benef>=0?'bénéfice':'perte'}) · ${der.clients} clients servis, ${der.perdus} perdus`);
    t+=sec('Évolution de la trésorerie')+courbe(E.fin.cash,300,100,'#ffd54f')+sec('Recettes et dépenses')+barres(h);
    t+=sec('Comptabilité élémentaire')+carte('<b>Bénéfice net = recettes − coût des marchandises vendues − salaires − loyer − charges − publicité.</b><br>Les achats de marchandises diminuent ta trésorerie tout de suite, mais ne sont une charge qu’au moment où tu vends.');
    t+=sec('Compétences développées')+COMPETENCES.map(c=>`<div style="font-size:12px;margin:2px 0">${c[1]} <b>${Math.round(E.comp[c[0]]||0)}</b><div style="height:6px;background:#0b111c;border-radius:3px"><div style="height:6px;width:${Math.min(100,E.comp[c[0]]||0)}%;background:#2c7fb8;border-radius:3px"></div></div></div>`).join('');
    t+=sec('Banque')+(E.dette?carte('Dette : <b>'+fmt(E.dette)+'</b> (intérêt 0,8 % par jour)<br>'+[10000,50000,E.dette].map(m=>btn('Rembourser '+fmt(Math.min(m,E.dette)),`entRemb(${Math.min(m,E.dette)})`,'#2e7d32','padding:6px 9px')).join('')):carte('Aucune dette. Tu peux emprunter jusqu’à 60 % de ton capital initial : '+[.2,.4,.6].map(f=>btn(fmt(Math.round(E.cap0*f)),`entEmprunt(${Math.round(E.cap0*f)})`,'','padding:6px 9px')).join('')));
    t+=sec('Journal des décisions')+E.journal.slice(-8).reverse().map(x=>`<div style="font-size:12px;opacity:.9">Jour ${x.j} · ${esc(x.t)}</div>`).join('')||'';
    panel(t);PAR.dire('Voici le tableau de bord de ton entreprise. Le bénéfice net, c’est ce qu’il reste quand on a payé tous les coûts.','bea')}
  // ---------- STOCK : prix, fournisseurs, commandes
  function stock(){
    const S=secteur(E.sect),cap=SIM.capaciteStock(E);
    let t=`<h3 style="margin:2px 0">📦 Stock, prix et fournisseurs</h3><p style="font-size:12px;opacity:.85;margin:2px 0">Capacité : ${cap} unités par produit. Prix du marché ≈ prix de référence.</p>`;
    t+=E.prods.map(p=>{const d=S.prod.find(x=>x.id===p.id),ref=Math.round(SIM.prixRef(E,p.id)),marge=Math.round((p.prix-p.cu)/p.prix*100),enc=E.cmd.filter(c=>c.pid===p.id).reduce((a,c)=>a+c.qte,0);
      return `<div style="background:#1b2535;border-radius:12px;padding:8px;margin:6px 0;font-size:13px"><b>${d.ico} ${esc(d.nom)}</b><br>Stock : <b style="color:${p.stock<4?'#ff8a80':'#fff'}">${p.stock}</b>${enc?' (+'+enc+' en commande)':''} · coût moyen ${fmt(p.cu)} · marge <b style="color:${marge<10?'#ff8a80':'#7CFC00'}">${marge} %</b><br>Prix de vente : <b>${fmt(p.prix)}</b> (marché ≈ ${fmt(ref)}) ${btn('−',`entPrix('${p.id}',-1)`,'','padding:2px 10px')}${btn('+',`entPrix('${p.id}',1)`,'','padding:2px 10px')}<br><span style="font-size:12px;opacity:.8">Commander chez :</span><br>${FOURNISSEURS.map(f=>{const c=SIM.coutAchat(E,p.id,f.id),b=E.effets.some(x=>x.type==='fournisseur'&&x.id===f.id&&x.fin>=E.jour);return `<div style="display:inline-block;margin:2px;font-size:11px;opacity:${b?.4:1}">${esc(f.nom.split(' ')[0]+' '+(f.nom.split(' ')[1]||''))} ${fmt(c)} · ${f.delai} j · fiab. ${Math.round(f.fiab*100)} %<br>${[5,10,20].map(q=>btn('+'+q,`entCmd('${p.id}',${q},'${f.id}')`,'#4a3e18','padding:3px 7px;margin:1px')).join('')}</div>`}).join('')}</div>`}).join('');
    t+=sec('Commandes en cours')+(E.cmd.length?E.cmd.map(c=>{const d=S.prod.find(x=>x.id===c.pid);return `<div style="font-size:12px">📦 ${c.qte} × ${esc(d.nom)} · ${esc(four(c.fid).nom)} · livraison jour ${c.liv}${c.retard?' ⏳ retard':''}</div>`}).join(''):'<div style="font-size:12px;opacity:.8">Aucune commande en cours.</div>');
    t+=sec('Ajouter un produit')+S.prod.filter(p=>!E.prods.some(x=>x.id===p.id)).map(p=>btn(p.ico+' '+esc(p.nom),`entDiv('${p.id}')`,'','padding:5px 8px;font-size:12px')).join('')||'';
    panel(t);PAR.dire('Ici, tu commandes tes marchandises et tu fixes tes prix. Compare les fournisseurs : le moins cher n’est pas toujours le plus fiable.','bea')}
  // ---------- PERSONNEL
  function rh(){
    let t=`<h3 style="margin:2px 0">👥 Personnel</h3><p style="font-size:12px;opacity:.85;margin:2px 0">Masse salariale : <b>${fmt(E.emp.reduce((a,e)=>a+e.sal,0))}</b> par jour. Payer en retard démotive l’équipe.</p>`;
    t+=E.emp.length?E.emp.map(e=>{const r=emploi(e.role);return `<div style="background:#1b2535;border-radius:12px;padding:8px;margin:5px 0;font-size:13px">${r.ico} <b>${esc(e.nom)}</b> · ${esc(r.nom)} · compétence ${'★'.repeat(e.comp)}${'☆'.repeat(5-e.comp)}<br>Salaire ${fmt(e.sal)}/jour · motivation <b style="color:${e.sat<40?'#ff8a80':'#7CFC00'}">${Math.round(e.sat)} %</b> · ${esc(r.txt)}<br>${btn('💰 +10 %',`entAug('${e.id}')`,'#2e7d32','padding:4px 8px')}${btn('Licencier',`entLic('${e.id}')`,'#7b2d26','padding:4px 8px')}</div>`}).join(''):carte('Tu n’as pas encore d’employé. Seul·e, tu dois servir tous les clients toi-même.');
    if(!cand||cand.jour!==E.jour)cand={jour:E.jour,l:SIM.candidats(E,3)};
    t+=sec('Candidats (nouveaux chaque jour)')+cand.l.map((c,i)=>{const r=emploi(c.role);return `<div style="background:#16263a;border-radius:12px;padding:8px;margin:5px 0;font-size:13px">${r.ico} <b>${esc(c.nom)}</b> · ${esc(r.nom)} · ${'★'.repeat(c.comp)}${'☆'.repeat(5-c.comp)}<br>Salaire demandé : <b>${fmt(c.sal)}</b>/jour · ${esc(r.txt)}<br>${btn('✅ Recruter',`entRec(${i})`,'#2e7d32','padding:4px 9px')}</div>`}).join('');
    panel(t)}
  // ---------- MARKETING
  let aff=null;
  function mkt(){
    aff=aff||{slogan:SLOGANS[0],sym:E.logo.sym,col:E.logo.col,promo:0};
    let t=`<h3 style="margin:2px 0">📣 Marketing et publicité</h3>${sec('Concevoir mon affiche')}<div id="entaff" style="text-align:center;background:${aff.col};border-radius:14px;padding:12px;border:4px solid #fff">${'<div style="font-size:46px">'+aff.sym+'</div>'}<div style="font-size:20px;font-weight:800;font-family:serif">${esc(E.nom)}</div><div style="font-size:14px">${esc(aff.slogan)}</div></div>`+
      sec('Slogan')+SLOGANS.map(s=>btn(esc(s),`entAff('slogan','${s.replace(/'/g,"\\'")}')`,aff.slogan===s?'#ffd54f':'','padding:5px 8px;font-size:12px')).join('')+sec('Image')+LOGO_SYMBOLES.map(s=>`<button onclick="entAff('sym','${s}')" style="font-size:20px;width:38px;height:38px;margin:2px;border-radius:8px;border:3px solid ${aff.sym===s?'#fff':'#0004'};background:#1b2535">${s}</button>`).join('')+sec('Couleur')+LOGO_COULEURS.map(c=>`<button onclick="entAff('col','${c}')" style="width:32px;height:32px;margin:2px;border-radius:50%;border:3px solid ${aff.col===c?'#fff':'#0004'};background:${c}"></button>`).join('');
    t+=sec('Campagnes (coût fixe, résultat variable)')+CAMPAGNES.map(c=>{const en=E.camp.find(x=>x.id===c.id&&x.fin>=E.jour);return carte(`${c.ico} <b>${esc(c.nom)}</b> · ${fmt(c.cout)} · ${c.jours} jours · effet moyen +${Math.round(c.eff*100)} %<br><span style="opacity:.8">${esc(c.txt)}</span><br>${en?'🟢 En cours jusqu’au jour '+en.fin:btn('Lancer',`entCamp('${c.id}')`,'#2e7d32','padding:5px 10px')}`)}).join('');
    t+=sec('Promotions (réductions)')+(E.promo&&E.promo.fin>=E.jour?carte('🟢 Promotion −'+Math.round(E.promo.pct*100)+' % jusqu’au jour '+E.promo.fin):carte('Une réduction attire des clients mais diminue ta marge.<br>'+btn('−10 % (3 jours)',"entPromo(.1,3)",'','padding:5px 9px')+btn('−20 % (3 jours)',"entPromo(.2,3)",'','padding:5px 9px')));
    t+=carte(`Marque : <b>${E.marque}/100</b> · Clients fidèles : <b>${E.fid}</b>`);
    panel(t)}
  // ---------- EXPANSION
  function exp(){
    const S=secteur(E.sect);let t=`<h3 style="margin:2px 0">🚀 Développement et expansion</h3>`;
    t+=carte(`<b>Locaux</b> : niveau ${E.local}/3 · plus de clients et de stock, mais un loyer plus élevé.<br>${E.local<3?btn('Agrandir · '+fmt(SIM.coutAgrandir(E)),'entAgr()','#6a1b9a','padding:6px 10px'):'Niveau maximum.'}`);
    t+=sec('Équipements')+EQUIP.map(q=>carte(`${q.ico} <b>${esc(q.nom)}</b> · ${fmt(q.cout)}<br><span style="opacity:.8">${esc(q.txt)}</span><br>${E.equip[q.id]?'✅ Installé':btn('Acheter',`entEquip('${q.id}')`,'#2e7d32','padding:5px 10px')}`)).join('');
    t+=sec('Agences')+carte(`Agences : <b>${E.agences.length}</b>/5 · coût d’une agence : ${fmt(SIM.coutAgence(E))}. Elles rapportent un bénéfice chaque jour si elles sont bien situées.<br>${E.agences.map(a=>'🏪 '+esc(lieu(a.lieu).nom)).join('<br>')}<br>`+LIEUX.filter(l=>!l.special&&l.id!==E.lieu&&!E.agences.some(a=>a.lieu===l.id)).slice(0,5).map(l=>btn('Ouvrir à '+esc(l.nom.split(' (')[0]),`entAgence('${l.id}')`,'','padding:4px 7px;font-size:12px')).join(''));
    t+=carte(`<b>Portée de l’entreprise</b> : ${E.agences.length>=5?'🌍 internationale':E.agences.length>=3?'🇨🇩 nationale':E.agences.length>=1?'🏙 régionale':'🏘 locale'}`);
    panel(t)}
  // ---------- progression et objectifs
  const OBJ=[
   ['o1','Créer mon entreprise',()=>true,5],['o2','Premier jour de bénéfice',()=>E.stats.joursRentables>=1,5],['o3','Passer une commande',()=>E.stats.commandes>=1,5],['o4','Embaucher un employé',()=>E.stats.embauches>=1,5],['o5','Lancer une campagne',()=>E.stats.campagnes>=1,5],
   ['o6','Gérer un événement',()=>E.stats.evenements>=1&&!E.ev,6],['o7','7 jours de gestion',()=>E.jour>=8,8],['o8','100 000 FC de bénéfices (Petit entrepreneur)',()=>E.fin.cumBenef>=100000,10],['o9','Ouvrir une deuxième agence',()=>E.agences.length>=1,12],['o10','Devenir Chef d’entreprise',()=>SIM.niveau(E)>=3,20]];
  function objectifs(){
    if(!E)return;const m=META(),a=A();OBJ.forEach(o=>{if(!m.done[o[0]]&&o[2]()){m.done[o[0]]=true;a.pieces+=o[3];a.xp+=o[3];refreshHud();toast('🏅 Objectif réussi : '+o[1]+' (+'+o[3]+' 🪙)');SFX.win&&SFX.win()}});
    const n=Object.keys(m.done).length;if(n>=5&&!a.done['met:e1']){a.done['met:e1']=true;a.stars['met:e1']=2;m.cert={date:new Date().toLocaleDateString('fr-FR'),nom:E.nom};a.pieces+=15;refreshHud();toast('🎓 Atelier entrepreneuriat validé : certificat obtenu (+15 🪙)')}
    if(n>=10)a.stars['met:e1']=3;m.niv=Math.max(m.niv||0,SIM.niveau(E))}
  function prog(){
    const m=META(),n=SIM.niveau(E);let t=`<h3 style="margin:2px 0">🏅 Progression de l’entrepreneur</h3>`+NIVEAUX.map((x,i)=>`<div style="padding:5px 8px;margin:3px 0;border-radius:10px;background:${i===n?'#4a3e18':'#1b2535'};font-size:13px">${i<=n?'✅':'⬜'} ${x[2]} <b>${x[1]}</b> · bénéfices cumulés ≥ ${fmt(x[0])}${i>=2?' · agences : '+(i===2?'1':i===3?'1':'3'):''}</div>`).join('');
    t+=sec('Objectifs (5 réussis = atelier validé, certificat)')+OBJ.map(o=>`<div style="font-size:13px;margin:3px 0">${m.done[o[0]]?'✅':'⬜'} ${esc(o[1])} <span style="opacity:.7">(+${o[3]} 🪙)</span></div>`).join('')+`<p style="font-size:12px">${Object.keys(m.done).length}/10 objectifs.</p>`;
    if(m.cert)t+=btn('🎓 Mon certificat','entCert()','#6a1b9a');t+=sec('Scénario en cours')+carte(`Scénario ${E.scen.n} · jours ${E.scen.debut} à ${E.scen.debut+E.scen.duree-1}. Objectif : faire croître ta richesse d’au moins 10 % avec une réputation d’au moins 45.`);
    panel(t)}
  function cert(){const m=META();panel(`<div style="background:linear-gradient(#fff9e8,#efe0b0);color:#4a3508;border:6px double #c9902a;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI BUSINESS SIMULATOR</div><div style="font-size:44px">💼</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE ENTREPRENEUR</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune entrepreneur')}</div><p style="font-size:13px">dirigeant·e de « ${esc((m.cert&&m.cert.nom)||E.nom)} » : création, gestion, recrutement et développement d’une entreprise.</p><p style="font-size:12px">Fait le ${esc(m.cert.date)}</p></div>`)}
  // ---------- bilans
  function bilanJour(r){
    const rec=r.rec;let t=`<div style="text-align:center"><div style="font-size:38px">${rec.benef>=0?'📈':'📉'}</div><h3 style="margin:2px 0">Bilan du jour ${rec.j}</h3></div>`+carte(`🧾 Recettes : <b>${fmt(rec.ca)}</b><br>📦 Coût des marchandises vendues : ${fmt(rec.cogs)}<br>💸 Dépenses de la journée (achats, salaires, loyer, charges) : ${fmt(rec.dep)}<br><b>Bénéfice net : <span style="color:${rec.benef>=0?'#7CFC00':'#ff8a80'}">${fmt(rec.benef)}</span></b><br>💰 Trésorerie : ${fmt(rec.cash)}<br>👥 ${rec.clients} client(s) servi(s) · ${rec.perdus} perdu(s)`)+r.msgs.map(x=>`<div style="font-size:13px;margin:3px 0">${esc(x)}</div>`).join('');
    const stocks=E.prods.filter(p=>p.stock<3).map(p=>secteur(E.sect).prod.find(d=>d.id===p.id).nom);if(stocks.length)t+=carte('⚠️ Stock faible : '+esc(stocks.join(', '))+'. Pense à commander pour demain.');
    if(rec.benef<0)t+=carte('💡 Conseil : une perte peut venir de prix trop bas, d’un stock mal géré, de salaires trop lourds ou d’un manque de clients.');
    t+=E.ev?btn('⚠ Un événement demande ta décision','entEvenement()','#c0392b'):E.bilan?btn('📋 Bilan du scénario','entBilanScen()','#6a1b9a'):btn('▶ Continuer','entFermerP()','#2e7d32');
    panel(t);PAR.dire(rec.benef>=0?'Bonne journée, patron ! Tu as fait un bénéfice.':'Journée difficile. Regarde où tu peux économiser.','bea')}
  function evenementUI(){
    if(!E||!E.ev)return fermerP();const ev=EVENEMENTS.find(x=>x.id===E.ev.id);
    panel(`<h3 style="margin:2px 0">${esc(ev.titre)}</h3>`+carte(esc(ev.txt))+ev.choix.map((c,i)=>btn(esc(c.t),`entEvChoix(${i})`,'#3b4a5e','display:block;width:100%;text-align:left')).join('')+'<p style="font-size:12px;opacity:.8">Chaque décision a des conséquences sur ta trésorerie, ta réputation et tes clients.</p>');PAR.dire(ev.titre.replace(/^[^\wÀ-ÿ]+/,'')+'. '+ev.txt,'bea')}
  function bilanScenario(){
    if(!E||!E.bilan)return;const b=E.bilan;
    panel(`<div style="text-align:center"><div style="font-size:40px">${b.reussi?'🏆':'📋'}</div><h3 style="margin:2px 0">Bilan du scénario ${b.n}</h3><div style="font-size:14px"><b>${b.reussi?'Objectif atteint !':'Objectif non atteint'}</b></div></div>`+carte(`Période : ${b.jours} jours · Recettes : ${fmt(b.ca)} · Bénéfice net : <b>${fmt(b.benef)}</b> · jours rentables : ${b.jRent}/${b.jours}<br>Trésorerie : ${fmt(b.cash)} · Réputation : ${b.rep}/100 · Valeur nette : ${fmt(b.nette)}`)+(b.erreurs.length?carte('<b>Erreurs commises</b><br>'+b.erreurs.map(esc).join('<br>')):carte('✅ Aucune erreur importante, bravo !'))+carte('<b>Compétences les plus développées</b><br>'+b.forts.map(f=>esc(f[0])+' : '+f[1]).join('<br>')+'<br><b>À améliorer</b><br>'+b.faibles.map(f=>esc(f[0])+' : '+f[1]).join('<br>'))+carte('<b>Tes dernières décisions</b><br>'+b.decisions.map(esc).join('<br>'))+btn('▶ Nouveau scénario (15 jours)','entNouveauScen()','#2e7d32'));
    PAR.dire(b.reussi?'Bravo, ton entreprise a progressé !':'Ce scénario est terminé. Regarde tes erreurs pour faire mieux.','bea')}
  // ---------- actions exposées
  const actions={
    entOuvrir:l=>ouvrir(l),entQuitter:()=>quitter(),entFermerP:()=>fermerP(),entInteragir:()=>interagir(),entFermerBulle:()=>{PAR.cacher();panneau=null;mot&&mot.fige(false)},
    entRetour:()=>{if(!ov)return;if(panneau)fermerP();else if(W&&!E0()){if(W.step>0){W.step--;wizard()}else quitter()}else quitter()},
    entNom:v=>{W.nom=v},entLogo:(k,v)=>{W.logo[k]=v;wizard()},entSect:id=>{W.sect=id;W.type=null;W.prods=[];wizard()},entType:id=>{W.type=id;wizard()},entLieu:id=>{W.lieu=id;if(lieu(id).special)W.loc='achete';wizard()},entLoc:l=>{W.loc=l;wizard()},
    entProd:id=>{const i=W.prods.indexOf(id);if(i>=0)W.prods.splice(i,1);else if(W.prods.length<6)W.prods.push(id);wizard()},entCap:c=>{W.capital=c;wizard()},
    entPas:d=>{if(d>0){const ok=W.step===0?W.nom.trim().length>=2:W.step===1?!!W.sect:W.step===2?!!W.type:W.step===4?W.prods.length>=3:true;if(!ok){toast(W.step===0?'Donne un nom à ton entreprise.':W.step===4?'Choisis au moins 3 produits.':'Fais un choix pour continuer.');return}if(W.step===1&&!W.type){const S=secteur(W.sect);if(!W.prods.length)W.prods=S.prod.slice(0,4).map(p=>p.id)}if(W.step===2&&!W.prods.length)W.prods=secteur(W.sect).prod.slice(0,4).map(p=>p.id)}W.step=Math.max(0,Math.min(5,W.step+d));wizard()},
    entCreer:()=>creerE(),
    entOuvrirJour:()=>ouvrirJour(),entPause:()=>{pause=!pause;barre()},entVit:()=>{vit=vit===1?2:vit===2?3:1;barre()},entFermerJour:()=>{if(phase==='ouvert')finirJour()},
    entPan:n=>{({bureau,stock,rh,mkt,exp,prog,caisse:()=>{fermerP();msg('Les clients en attente apparaissent en haut de l’écran : sers-les depuis là.',3500)}}[n]||(()=>{}))()},
    entServir:rem=>{if(!srv)return;const r=SIM.proposer(E,srv.c,rem);finServi(srv,r)},entRefuser:()=>{if(!srv)return;E.rep=Math.max(0,E.rep-.2);partir(srv,false,'est reparti·e : tu as refusé la vente');SIM.gagner(E,'decision',.2)},
    entPrix:(pid,d)=>{const p=E.prods.find(x=>x.id===pid),pas=p.prix>=10000?500:p.prix>=3000?200:100;p.prix=Math.max(100,p.prix+d*pas);sauve();stock()},
    entCmd:(pid,q,fid)=>{const r=SIM.commander(E,pid,q,fid);msg(r.msg,3500);SFX[r.ok?'coin':'ko']&&SFX[r.ok?'coin':'ko']();if(r.ok){reg();majStat()}stock()},
    entDiv:pid=>{const r=SIM.diversifier(E,pid);msg(r.msg);reg();stock()},
    entRec:i=>{const r=SIM.embaucher(E,cand.l[i]);if(r.ok)cand.l.splice(i,1);msg(r.msg,3500);reg();chargerScene({x:0,z:5.5});rh()},
    entLic:id=>{const r=SIM.licencier(E,id);msg(r.msg);reg();chargerScene({x:0,z:5.5});rh()},entAug:id=>{const r=SIM.augmenter(E,id,.1);msg(r.msg);sauve();rh()},
    entAff:(k,v)=>{aff[k]=v;SIM.gagner(E,'creativite',.2);mkt()},entCamp:id=>{const r=SIM.campagne(E,id,!!aff);msg(r.msg,3500);reg();majStat();mkt()},entPromo:(p,j)=>{const r=SIM.promotion(E,p,j);msg(r.msg);reg();mkt()},
    entAgr:()=>{const r=SIM.agrandir(E);msg(r.msg,3500);reg();majStat();exp()},entEquip:id=>{const r=SIM.equiper(E,id);msg(r.msg,3500);reg();majStat();chargerScene({x:0,z:5.5});exp()},
    entAgence:l=>{const r=SIM.ouvrirAgence(E,l);msg(r.msg,3500);reg();majStat();rebuild&&rebuild();exp()},
    entEmprunt:m=>{const r=SIM.emprunter(E,m);msg(r.msg);reg();majStat();bureau()},entRemb:m=>{const r=SIM.rembourser(E,m);msg(r.msg);reg();majStat();bureau()},
    entEvenement:()=>evenementUI(),entEvChoix:i=>{const r=SIM.choisirEvenement(E,i);reg();majStat();SFX[r.bon?'win':'coin']&&SFX[r.bon?'win':'coin']();panel(carte(esc(r.msg))+btn('▶ Continuer','entFermerP()','#2e7d32')+(E.bilan?btn('📋 Bilan du scénario','entBilanScen()','#6a1b9a'):''))},
    entBilanScen:()=>bilanScenario(),entNouveauScen:()=>{SIM.nouveauScenario(E);reg();fermerP()},entCert:()=>cert(),
    entTest:{E:()=>E,tick:(n,dt)=>{for(let i=0;i<n;i++)tick(dt)},phase:()=>phase,srv:()=>srv,clients:()=>clients.length,wiz:()=>W,sched:()=>sched.length}};
  const reperes=()=>{const e=E0();if(!e)return [];const out=[],S=secteur(e.sect);out.push({id:'ent_0',modele:'magasin',x:-47,z:-86,ry:Math.PI/2,w:10,d:7,nom:e.nom,coul:e.logo.col,norot:true,biz:true,bizId:'main',ico:S.ico});(e.agences||[]).forEach((a,i)=>out.push({id:'ent_'+(i+1),modele:'magasin',x:-47,z:-86-12*(i+1),ry:Math.PI/2,w:10,d:7,nom:e.nom+' (agence '+(i+1)+')',coul:e.logo.col,norot:true,biz:true,bizId:'ag'+(i+1),ico:S.ico}));return out};
  return {actions,ouvrir,fermer,reperes,E:E0};
}
