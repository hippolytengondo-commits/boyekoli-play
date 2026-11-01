// BOYEKOLI SCIENCE LAB – laboratoire scientifique 3D : bâtiment explorable, 11 expériences simulées (chimie, biologie, physique),
// progression, déblocages, personnalisation, décoration, certificat. Tout est une SIMULATION éducative.
import * as THREE from 'three';
import {creerMoteur} from './detective/moteur.js';
import {LAB,DIAL,GROUPES,EXPS,ORGANES,CELLULES,LIQUIDES,ASTRES,MATERIAUX,COULEURS_BLOUSE,DECOS} from './science/data.js';

export function creerScience(D){
  const {G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const SCI=()=>{const a=A();if(!a.sci)a.sci={exp:{},pts:0,look:{s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#ffffff',acc:['lunettes']},grp:{},cert:null};const s=a.sci;if(!s.exp)s.exp={};if(!s.grp)s.grp={};if(!s.look)s.look={s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#ffffff',acc:['lunettes']};return s};
  let ov=null,mot=null,pr=null,panneau=false,tOuv=0,E=null,viewer=null,kb=null,popH=null,timers=[];
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:9px 12px;margin:3px;border-radius:12px;border:2px solid #fff3;background:${bg||'#2f4a6b'};color:#fff;font-size:14px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const fait=id=>!!SCI().exp[id];
  const REQ={c2:'c1',c3:'c1',c4:'c2',b2:'b1',b3:'b1',p2:'p1',p3:'p1',p4:'p2'};
  const debloque=id=>!REQ[id]||fait(REQ[id]);
  const grpDe=id=>GROUPES.find(g=>g.exps.includes(id));
  const nbFaits=g=>g.exps.filter(fait).length;
  function msg(t,ms){const m=$('scimsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3500)}
  // ---------- ouverture
  function lookBlouse(){const l=Object.assign({},SCI().look);return l}
  function defLab(){
    const d=JSON.parse(JSON.stringify(LAB));
    DECOS.forEach(x=>{if(fait(x.exp))d.objets.push({id:'deco_'+x.id,nom:x.nom,x:x.x,z:x.z,w:x.w,d:x.d,h:x.h,c:x.c,plaque:!!x.plaque,bloque:!x.plaque,ex:x.ico+' '+x.nom+' : un souvenir de tes expériences réussies !'})});
    return d}
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);tOuv=Date.now();
    ov=document.createElement('div');ov.id='sciov';
    ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#101a24;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:linear-gradient(90deg,#0f4c75,#1b6ca8);flex:0 0 auto"><b id="scitit" style="flex:1;font-size:14px">🔬 BOYEKOLI SCIENCE LAB</b>${btn('🥼','sciPerso()','#2f4a6b','padding:5px 9px;margin:0')}${btn('✖','sciQuitter()','#7b2d26','padding:5px 10px;margin:0')}</div>
    <div id="sci3d" style="flex:1;position:relative;min-height:0"></div><div id="scihud" style="position:absolute;left:0;right:0;bottom:0;height:170px;pointer-events:none"></div>
    <div id="scimsg" style="position:absolute;left:8px;right:8px;top:50px;background:rgba(10,20,30,.88);padding:6px 9px;border-radius:10px;font-size:13px;display:none"></div>
    <div id="scipan" style="position:absolute;inset:0;background:rgba(8,14,22,.96);display:none;flex-direction:column;padding:10px;overflow:auto;z-index:5"></div>`;
    document.body.appendChild(ov);
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    mot=creerMoteur($('sci3d'),{low,look:lookBlouse(),onProche:p=>{pr=p;majBouton()}});
    mot.charger(defLab());
    hud();try{history.pushState({sci:1},'')}catch(e){}popH=()=>{if(ov)quitter()};window.addEventListener('popstate',popH);
    parler('Bienvenue au laboratoire Boyekoli Science Lab. Mets ta blouse et tes lunettes : la sécurité d’abord !')}
  function quitter(){if(popH){window.removeEventListener('popstate',popH);popH=null}if(kb){window.removeEventListener('keydown',kb);kb=null}const a=!!ov;fermer();if(a)closeDialog()}
  function fermer(sil){
    if(!ov)return;stopTout();const s=Math.round((Date.now()-tOuv)/1000);if(s>8&&!sil){const t=A().tal||(A().tal={});t.science=(t.science||0)+Math.min(120,Math.floor(s/6));save()}
    if(mot){mot.stop();mot=null}ov.remove();ov=null;panneau=false;E=null}
  function stopTout(){timers.forEach(clearInterval);timers=[];if(viewer){viewer.dispose();viewer=null}}
  function hud(){
    const h=$('scihud');
    h.innerHTML=`<div id="joy" style="position:absolute;left:12px;bottom:14px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid #fff5;pointer-events:auto;touch-action:none"><div id="jk" style="position:absolute;left:44px;top:44px;width:40px;height:40px;border-radius:50%;background:#fff;opacity:.85"></div></div>
    <div style="position:absolute;right:10px;bottom:12px;display:flex;flex-direction:column;align-items:flex-end;pointer-events:auto"><div>${btn('🎒 Progression','sciDossiers()','#2f4a6b','padding:8px 10px')}</div><div>${btn('🔍 Examiner','sciExaminer()','#2c7fb8','padding:12px 12px')}</div><div>${btn('✋ Interagir','sciInteragir()','#2e7d32','padding:14px 18px;font-size:15px').replace('<button','<button id="bint"')}</div></div>`;
    const jb=$('joy'),jk=$('jk');let id=null;
    const mv=e=>{const b=jb.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}mot.joy.x=dx;mot.joy.y=dy;jk.style.left=(44+dx*40)+'px';jk.style.top=(44+dy*40)+'px'};
    jb.addEventListener('pointerdown',e=>{e.preventDefault();jb.setPointerCapture(e.pointerId);id=e.pointerId;mv(e)});jb.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>jb.addEventListener(n,e=>{if(e.pointerId===id){id=null;mot.joy.x=mot.joy.y=0;jk.style.left='44px';jk.style.top='44px'}}));
    kb=e=>{if(!ov||panneau)return;const k=e.key.toLowerCase();if(k==='e')interagir();else if(k==='f')examiner();else if(k==='escape')quitter()};window.addEventListener('keydown',kb)}
  function majBouton(){const b=$('bint');if(!b)return;if(!pr){b.innerHTML='✋ Interagir';return}let t=pr.kind==='pnj'?'💬 Parler à '+pr.def.nom.split(',')[0]:pr.kind==='sortie'?pr.def.label:(pr.def.label||'✋ '+pr.def.nom);b.innerHTML=t.length>34?t.slice(0,33)+'…':t}
  function panel(h,sans){panneau=true;mot&&mot.fige(true);const p=$('scipan');p.style.display='flex';p.innerHTML=h+(sans?'':'<div style="margin-top:8px">'+btn('✖ Fermer','sciFermerP()','#7b2d26')+'</div>')}
  function fermerP(){stopTout();E=null;panneau=false;const p=$('scipan');if(p){p.style.display='none';p.innerHTML=''}mot&&mot.fige(false)}
  // ---------- interactions dans le bâtiment
  function interagir(){
    if(!mot||panneau)return;const p=mot.proche();if(!p){msg('Rien à utiliser ici. Approche-toi d’un équipement ou d’une personne.',2200);return}
    if(p.kind==='sortie'){quitter();return}
    if(p.kind==='pnj'){dialoguer(p.def);return}
    const e=p.def;if(e.panneau){ouvrirPanneau(e.panneau);return}msg(e.ex||e.nom,4500)}
  function examiner(){if(!mot||panneau)return;const p=mot.proche();if(!p){msg('🔍 Rien de particulier ici.',2200);return}if(p.kind==='pnj'){msg(p.def.nom+' : '+p.def.role+'.',2500);return}msg('🔍 '+(p.def.ex||p.def.nom),4500)}
  let dialG=null;
  function dialoguer(p){const d=DIAL[p.dial];if(!d)return;mot.parler(p.id,6);noeud(d,'n0')}
  function noeud(d,nid){const n=d[nid];if(!n){fermerP();return}dialG=d;panel(`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:30px">🗣</span><b>${esc(d.nom)}</b></div><div style="background:#1f3347;border-radius:12px;padding:10px;margin:8px 0;font-size:15px;line-height:1.4">${esc(n.t)}</div>`+n.c.map(([l,nx])=>btn('➤ '+esc(l),`sciRep('${nx||''}')`)).join(''),true)}
  function ouvrirPanneau(n){
    if(n==='chimie'||n==='biologie'||n==='physique')return groupe(n);
    if(n==='dossiers')return dossiers();if(n==='perso')return perso();if(n==='certif')return certificat()}
  // ---------- dossiers / progression
  function dossiers(){
    const s=SCI();let h=`<h3 style="margin:2px 0">🎒 Mes découvertes</h3><p style="font-size:13px">Points scientifiques : <b>${s.pts}</b> · Expériences réussies : <b>${Object.keys(s.exp).length}/${Object.keys(EXPS).length}</b></p>`;
    GROUPES.forEach(g=>{h+=`<div style="background:#1f3347;border-radius:12px;padding:9px;margin:6px 0"><b>${g.ico} ${esc(g.nom)}</b> <small>(${nbFaits(g)}/${g.exps.length}, ${g.requis} nécessaires)</small>${s.grp[g.id]?' <span style="color:#7CFC00">✅ '+'⭐'.repeat(s.grp[g.id].stars)+'</span>':''}<br>`+g.exps.map(id=>`<small>${fait(id)?'✅':debloque(id)?'▫️':'🔒'} ${EXPS[id].ico} ${esc(EXPS[id].nom)}</small>`).join('<br>')+'</div>'});
    h+=`<p style="font-size:12px;opacity:.85">🏅 Badges : ${GROUPES.filter(g=>s.grp[g.id]).map(g=>g.ico+' Jeune '+({chimie:'chimiste',biologie:'biologiste',physique:'physicien'})[g.id]).join(' · ')||'à gagner'}</p>`;
    if(s.cert)h+=btn('🎓 Voir mon certificat','sciCert()','#6a1b9a');
    panel(h)}
  function groupe(id){
    const g=GROUPES.find(x=>x.id===id);let h=`<h3 style="margin:2px 0">${g.ico} ${esc(g.nom)}</h3><p style="font-size:12px;opacity:.85">⚠ Ce sont des <b>simulations</b> : elles ressemblent à de vraies expériences mais aucun produit réel n’est utilisé. À la maison, on ne manipule jamais de produits sans un adulte.</p>`;
    g.exps.forEach(eid=>{const x=EXPS[eid],ok=fait(eid),dis=debloque(eid);h+=`<div style="background:#1f3347;border-radius:12px;padding:9px;margin:6px 0"><b>${x.ico} ${esc(x.nom)}</b> ${ok?'<span style="color:#7CFC00">✅</span>':''}<br><small>${esc(x.objectif)}</small><br>${dis?btn(ok?'🔁 Refaire':'▶ Commencer',`sciExp('${eid}')`,'#2e7d32'):'<small>🔒 Réussis d’abord « '+esc(EXPS[REQ[eid]].nom)+' »</small>'}</div>`});
    panel(h)}
  // ---------- échafaudage d'une expérience
  function lancer(id){
    stopTout();const x=EXPS[id];E={id,ph:'intro',err:0};
    panel(`<h3 style="margin:2px 0">${x.ico} ${esc(x.nom)}</h3><div style="background:#1f3347;border-radius:12px;padding:10px;font-size:13px"><b>🎯 Objectif :</b> ${esc(x.objectif)}<br><b>🧰 Matériel :</b> ${x.materiel.map(esc).join(', ')}<br><b>📋 Étapes :</b><ol style="margin:4px 0 0 18px;padding:0">${x.etapes.map(e=>'<li>'+esc(e)+'</li>').join('')}</ol></div><p style="font-size:12px;opacity:.85">Simulation éducative : ce n’est pas une expérience réelle.</p>${btn('▶ Commencer','sciExpPre()','#2e7d32','font-size:16px;padding:12px')}${btn('↩ Retour','sciGroupe(\''+grpDe(id).id+'\')')}`,true)}
  function qcm(q,suite,titre){
    E.q={q,rep:undefined,suite,titre};qcmRendu()}
  function qcmRendu(){
    const {q,rep,titre}=E.q;let h=`<h3 style="margin:2px 0">${esc(titre)}</h3><p style="font-size:15px"><b>${esc(q.q)}</b></p>`;
    q.c.forEach((x,i)=>{const bg=rep===undefined?'#1f3347':(i===q.a?'#2e7d32':i===rep?'#b23a3a':'#1f3347');h+=`<button ${rep!==undefined&&rep===q.a?'disabled':''} onclick="sciQ(${i})" style="display:block;width:100%;text-align:left;padding:11px;margin:4px 0;border-radius:10px;border:2px solid #fff3;background:${bg};color:#fff;font-size:14px">${'ABCD'[i]}. ${esc(x)}</button>`});
    if(rep!==undefined)h+=rep===q.a?`<p style="font-size:13px">✅ <b>Exact !</b> ${esc(q.exp)}</p>${btn('Continuer ▶','sciQSuite()','#2e7d32')}`:`<p style="font-size:13px">❌ Ce n’est pas ça. Réfléchis encore (se tromper aide à apprendre !).</p>${btn('Réessayer','sciQRetry()','#2c7fb8')}`;
    panel(h,true)}
  function jeu(){
    E.ph='jeu';const x=EXPS[E.id];
    panel(`<div style="display:flex;align-items:center;gap:6px"><b style="flex:1;font-size:15px">${x.ico} ${esc(x.nom)}</b>${btn('🔄 Recommencer','sciRecom()','#8a5a2b','padding:6px 9px;margin:0')}${btn('✖','sciFermerP()','#7b2d26','padding:6px 9px;margin:0')}</div><div id="scijeu" style="margin-top:6px"></div><div id="scijeumsg" style="font-size:13px;min-height:20px;margin:6px 0"></div><div id="scijeufin"></div>`,true);
    JEUX[E.id](E.etat={})}
  function msgJeu(t,ok){const e=$('scijeumsg');if(e){e.innerHTML=t;e.style.color=ok===false?'#ff8a80':ok?'#a5d6a7':'#fff'}}
  function termine(){
    const f=$('scijeufin');if(f)f.innerHTML=btn('✅ Terminer l’expérience','sciPost()','#2e7d32','font-size:16px;padding:12px');SFX.bravo&&SFX.bravo();msgJeu('✅ Observation terminée ! '+esc(EXPS[E.id].res),true)}
  function finExp(){
    const id=E.id,x=EXPS[id],s=SCI(),prem=!s.exp[id];
    if(prem){s.exp[id]={fait:true,err:E.err};s.pts+=10;A().pieces+=4;A().xp+=6;refreshHud()}else s.exp[id].err=Math.min(s.exp[id].err,E.err);
    const g=grpDe(id);let bonus='';
    if(!s.grp[g.id]&&nbFaits(g)>=g.requis){const err=g.exps.filter(fait).reduce((t,k)=>t+(s.exp[k].err||0),0),stars=err<=1?3:err<=4?2:1;s.grp[g.id]={stars,date:new Date().toLocaleDateString('fr-FR')};A().done['met:'+g.d]=true;A().stars['met:'+g.d]=Math.max(A().stars['met:'+g.d]||0,stars);A().pieces+=10+3*stars;A().xp+=15;bonus=`<p style="font-size:14px">🏅 <b>Badge de jeune ${({chimie:'chimiste',biologie:'biologiste',physique:'physicien'})[g.id]} obtenu !</b> ${'⭐'.repeat(stars)} · +${10+3*stars} 🪙</p>`;refreshHud()}
    let cert='';if(!s.cert&&GROUPES.every(q=>s.grp[q.id])){s.cert={date:new Date().toLocaleDateString('fr-FR')};A().pieces+=15;cert=`<p>${btn('🎓 Recevoir mon certificat de jeune scientifique','sciCert()','#6a1b9a')}</p>`;refreshHud()}
    const dec=DECOS.filter(d=>d.exp===id).map(d=>d.ico+' '+d.nom).join(', ');
    const t=A().tal||(A().tal={});t.science=(t.science||0)+8;save();SFX.win&&SFX.win();
    panel(`<div style="text-align:center"><div style="font-size:40px">${x.ico}🎉</div><h3>Expérience réussie !</h3><p style="font-size:14px;text-align:left"><b>🔬 Résultat :</b> ${esc(x.res)}<br><b>🧠 Explication scientifique :</b> ${esc(x.expl)}</p><p style="font-size:13px">${prem?'+10 points scientifiques · +4 🪙':'Expérience déjà validée (aucun point supplémentaire)'}${dec&&prem?'<br>🎁 Décoration débloquée pour ton laboratoire : '+esc(dec):''}${E.err?'<br>Erreurs : '+E.err:''}</p>${bonus}${cert}${btn('🔁 Refaire','sciExp(\''+id+'\')','#8a5a2b')}${btn('↩ Laboratoire','sciGroupe(\''+g.id+'\')')}</div>`,true);
    if(mot&&prem&&dec)mot.charger(defLab())}
  // ---------- personnalisation
  function perso(){
    const L=SCI().look,acc=(L.acc||[]).includes('lunettes');
    panel(`<h3 style="margin:2px 0">🥼 Vestiaire</h3><b>Personnage</b><br>${btn('👩‍🔬 Scientifique',"sciLook('s','f')",L.s==='f'?'#ffd54f':'','color:'+(L.s==='f'?'#222':'#fff'))}${btn('👨‍🔬 Scientifique',"sciLook('s','h')",L.s==='h'?'#ffd54f':'','color:'+(L.s==='h'?'#222':'#fff'))}<br><b>Blouse</b><br>${COULEURS_BLOUSE.map(c=>`<button onclick="sciLook('c','${c}')" style="width:38px;height:38px;border-radius:50%;margin:3px;border:3px solid ${L.c===c?'#fff':'#0004'};background:${c}"></button>`).join('')}<br><b>Lunettes de protection</b><br>${btn(acc?'🥽 Portées ✔':'🥽 Les mettre',"sciLunettes()",acc?'#2e7d32':'')}<br><b>Peau</b><br>${[0,1,2,3,4,5].map(i=>`<button onclick="sciLook('skin',${i})" style="width:34px;height:34px;border-radius:50%;margin:3px;border:3px solid ${L.skin===i?'#fff':'#0004'};background:${['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'][i]}"></button>`).join('')}`)}
  function certificat(){
    const s=SCI();if(!s.cert){panel('<h3>🎓 Certificat de jeune scientifique</h3><p style="font-size:14px">Réussis les trois laboratoires (chimie, biologie, physique) pour recevoir ton certificat.</p>');return}
    panel(`<div style="background:linear-gradient(#f4fbff,#d7ecf7);color:#123a52;border:6px double #1b6ca8;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI SCIENCE LAB</div><div style="font-size:44px">🔬</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE SCIENTIFIQUE</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune chercheur')}</div><p style="font-size:13px">pour avoir observé, expérimenté et compris des phénomènes de chimie, de biologie et de physique, en toute sécurité.</p><p style="font-size:12px">Fait le ${esc(s.cert.date)} · Professeur Kasongo</p><div style="font-size:26px">🏅</div></div><p style="font-size:11px;opacity:.75">Ces expériences étaient des simulations éducatives.</p>`)}
  // ---------- visionneuse 3D (cellules, corps)
  function creerViewer(cont,construire,onPick,distInit){
    const W=Math.max(240,cont.clientWidth||300),H=260;
    const r=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:false});r.setSize(W,H);r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));cont.appendChild(r.domElement);r.domElement.style.cssText='width:100%;border-radius:12px;touch-action:none;background:#0b1622';
    const sc=new THREE.Scene();sc.background=new THREE.Color('#0b1622');sc.add(new THREE.HemisphereLight('#ffffff','#445566',1.5));const dl=new THREE.DirectionalLight('#ffffff',1.2);dl.position.set(3,5,4);sc.add(dl);
    const cam=new THREE.PerspectiveCamera(45,W/H,.1,50);const grp=new THREE.Group();sc.add(grp);construire(grp);
    let yaw=.4,pitch=.2,dist=distInit||4,auto=true,raf=0,ptrs=new Map(),pd=0,moved=false;
    const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
    const cvs=r.domElement;
    cvs.addEventListener('pointerdown',e=>{cvs.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;auto=false;pd=0});
    cvs.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;if(ptrs.size===2){const a=[...ptrs.values()];const d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptrs.values()];const d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);dist=Math.max(1.8,Math.min(9,dist-(d1-d0)*.02));moved=true;return}
      const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;yaw+=dx*.01;pitch=Math.max(-1.2,Math.min(1.2,pitch+dy*.01));p.x=e.clientX;p.y=e.clientY});
    cvs.addEventListener('pointerup',e=>{ptrs.delete(e.pointerId);if(!moved&&onPick){const b=cvs.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);const h=ray.intersectObjects(grp.children,true);for(const x of h){let o=x.object;while(o&&!o.userData.part)o=o.parent;if(o){onPick(o.userData.part,o);return}}}});
    cvs.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(1.8,Math.min(9,dist+e.deltaY*.004))},{passive:false});
    const boucle=()=>{if(auto)yaw+=.006;grp.rotation.y=yaw;grp.rotation.x=pitch;cam.position.set(0,0,dist);cam.lookAt(0,0,0);r.render(sc,cam);raf=requestAnimationFrame(boucle)};raf=requestAnimationFrame(boucle);
    return {zoom:d=>{dist=Math.max(1.8,Math.min(9,dist+d))},auto:v=>{auto=v},grp,dispose(){cancelAnimationFrame(raf);try{r.dispose()}catch(e){}cont.innerHTML=''}}}
  const M3=(c,op,rough)=>new THREE.MeshStandardMaterial({color:c,transparent:op<1,opacity:op===undefined?1:op,roughness:rough===undefined?.5:rough});
  function cellule3d(type,g){
    const vg=type==='vegetale';
    const corps=new THREE.Mesh(vg?new THREE.BoxGeometry(2.4,1.8,1.6):new THREE.SphereGeometry(1.2,24,18),M(vg?'#d7efc9':'#f6e0b5',.35));corps.userData.part=vg?'paroi':'cytoplasme';g.add(corps);
    if(vg){const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4,1.8,1.6)),new THREE.LineBasicMaterial({color:'#2e7d32'}));g.add(e)}
    else{const mb=new THREE.Mesh(new THREE.SphereGeometry(1.25,24,18),M('#f1a7b5',.25));mb.userData.part='membrane';g.add(mb)}
    const noy=new THREE.Mesh(new THREE.SphereGeometry(.36,18,14),M('#8e44ad',1));noy.position.set(.2,.1,0);noy.userData.part='noyau';g.add(noy);
    if(vg){const va=new THREE.Mesh(new THREE.SphereGeometry(.55,16,12),M('#8ec9e8',.7));va.position.set(-.7,-.1,.1);va.userData.part='vacuole';g.add(va);
      [[.7,.5,.3],[.6,-.5,-.2],[-.2,.6,.4],[.1,-.5,.4],[-.6,.5,-.3]].forEach(p=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10),M('#2e9e4a'));c.scale.set(1.4,.8,.8);c.position.set(...p);c.userData.part='chloroplaste';g.add(c)})}
    else{[[.7,.4,.3],[-.5,.5,-.3],[-.4,-.5,.4],[.6,-.4,-.3]].forEach(p=>{const c=new THREE.Mesh(new THREE.CapsuleGeometry(.1,.25,4,8),M('#e67e22'));c.position.set(...p);c.rotation.z=1;c.userData.part='mitochondrie';g.add(c)})}}
  function corps3d(g){
    const peau=M('#f1c9a5',.28);const add=(geo,m,x,y,z,part)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);if(part)me.userData.part=part;g.add(me);return me};
    add(new THREE.CapsuleGeometry(.5,1.0,6,14),peau,0,.2,0);add(new THREE.SphereGeometry(.38,16,12),peau,0,1.35,0);
    [-1,1].forEach(s=>{add(new THREE.CapsuleGeometry(.13,.9,4,8),peau,s*.7,.2,0).rotation.z=s*.1;add(new THREE.CapsuleGeometry(.16,1.0,4,8),peau,s*.25,-1.1,0)});
    ORGANES.forEach(o=>{const m=add(new THREE.SphereGeometry(o.r*.6,16,12),M(o.c,1,.4),o.x*1.2,o.y*1.1-.1+(o.id==='cerveau'?.4:0),o.id==='cerveau'?.02:.2,o.id);if(o.id==='poumons'){m.scale.set(1.5,1.1,.7);const m2=m.clone();m2.position.x=-m.position.x;m2.userData.part='poumons';g.add(m2);m.position.x=Math.abs(m.position.x)+.25;m2.position.x=-(Math.abs(m.position.x))}})}
  // ---------- expériences interactives
  const JEUX={
    // ===== CHIMIE
    c1(st){
      const COL={rouge:'#e74c3c',jaune:'#f1c40f',bleu:'#2e86de'};st.b={rouge:0,jaune:0,bleu:0,eau:0};st.vus={};
      const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
      function couleur(){const n=st.b.rouge+st.b.jaune+st.b.bleu;if(!n)return '#dff0ff';let r=0,g=0,b=0;Object.keys(COL).forEach(k=>{const c=hex(COL[k]);r+=c[0]*st.b[k];g+=c[1]*st.b[k];b+=c[2]*st.b[k]});r/=n;g/=n;b/=n;const l=Math.min(.6,st.b.eau/(n+st.b.eau)*.9);r=r+(255-r)*l;g=g+(255-g)*l;b=b+(255-b)*l;return `rgb(${r|0},${g|0},${b|0})`}
      function nom(){const {rouge:r,jaune:j,bleu:b}=st.b;if(r&&j&&b)return 'brun';if(r&&j)return 'orange';if(j&&b)return 'vert';if(r&&b)return 'violet';return r?'rouge':j?'jaune':b?'bleu':''}
      function dessine(){const niv=Math.min(1,(st.b.rouge+st.b.jaune+st.b.bleu+st.b.eau)/8),y=150-niv*110;
        $('scijeu').innerHTML=`<svg viewBox="0 0 200 180" style="width:170px;float:right"><defs><clipPath id="bk"><path d="M60 30 L140 30 L150 160 Q100 172 50 160 Z"/></clipPath></defs><g clip-path="url(#bk)"><rect x="40" y="${y}" width="120" height="${170-y}" fill="${couleur()}"/>${st.mel?'<circle cx="80" cy="'+(y+10)+'" r="4" fill="#fff" opacity=".6"><animate attributeName="cy" values="'+(y+30)+';'+y+'" dur="1s" repeatCount="3"/></circle>':''}</g><path d="M60 30 L140 30 L150 160 Q100 172 50 160 Z" fill="none" stroke="#cfe8ff" stroke-width="4"/><text x="100" y="22" fill="#fff" font-size="11" text-anchor="middle">${nom()?'Couleur : '+nom():'Bécher vide'}</text></svg>
        <div>${Object.keys(COL).map(k=>btn(`<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${COL[k]};vertical-align:middle"></span> Verser ${k}`,`sciC1('${k}')`)).join('')}${btn('💧 Verser de l’eau','sciC1(\'eau\')')}${btn('🥄 Mélanger','sciC1Mel()','#8a5a2b')}</div><p style="font-size:12px">Couleurs obtenues : ${['orange','vert','violet'].map(c=>(st.vus[c]?'✅ ':'⬜ ')+c).join(' · ')}</p>`}
      st.verse=k=>{st.b[k]++;st.mel=false;SFX.coin&&SFX.coin();dessine()};
      st.melanger=()=>{const n=nom();st.mel=true;dessine();if(!n){msgJeu('Verse d’abord au moins un colorant.',false);return}msgJeu('Tu as obtenu : <b>'+n+'</b>.'+(['orange','vert','violet'].includes(n)?' ✅':''),true);if(['orange','vert','violet'].includes(n)){st.vus[n]=true;dessine()}if(st.vus.orange&&st.vus.vert&&st.vus.violet)termine()};
      st.vider=()=>{st.b={rouge:0,jaune:0,bleu:0,eau:0};st.mel=false;dessine()};dessine()},
    c2(st){
      st.res={};st.sel=null;st.ind=false;
      const couleurInd=ph=>ph<=3?'#e8345f':ph<=5?'#c8508f':ph<=7?'#8e44ad':ph<=9?'#3a8fbf':'#2ea88a';
      function dessine(){const L=st.sel&&LIQUIDES.find(x=>x.id===st.sel);const c=L?(st.ind?couleurInd(L.ph):L.c):'#dff0ff';
        $('scijeu').innerHTML=`<svg viewBox="0 0 200 160" style="width:150px;float:right"><path d="M60 20 L140 20 L150 140 Q100 150 50 140 Z" fill="${L?c:'#ffffff10'}" stroke="#cfe8ff" stroke-width="4"/><text x="100" y="12" fill="#fff" font-size="11" text-anchor="middle">${L?(st.ind?'avec indicateur':L.nom):'Bécher vide'}</text></svg>
        <div><b style="font-size:13px">1) Choisis un liquide :</b><br>${LIQUIDES.map(l=>btn(l.ico+' '+l.nom,`sciC2Sel('${l.id}')`,st.sel===l.id?'#ffd54f':'','color:'+(st.sel===l.id?'#222':'#fff')+';padding:6px 8px')).join('')}<br><b style="font-size:13px">2) </b>${btn('🟣 Ajouter l’indicateur de chou rouge','sciC2Ind()','#6a1b9a')}<br><b style="font-size:13px">3) Classe-le :</b><br>${btn('Acide','sciC2Cl(\'acide\')','#c0392b')}${btn('Neutre','sciC2Cl(\'neutre\')','#555')}${btn('Base','sciC2Cl(\'base\')','#2c7fb8')}</div><p style="font-size:12px">Liquides classés : ${LIQUIDES.map(l=>(st.res[l.id]?'✅ ':'⬜ ')+l.nom).join(' · ')}</p><p style="font-size:11px;opacity:.8">Rose/rouge = acide · violet = neutre · bleu/vert = base.</p>`}
      st.sel_=id=>{st.sel=id;st.ind=false;dessine()};st.ajInd=()=>{if(!st.sel){msgJeu('Choisis d’abord un liquide.',false);return}st.ind=true;SFX.ok&&SFX.ok();dessine();msgJeu('Observe la couleur de l’indicateur…',null)};
      st.cl=c=>{if(!st.sel||!st.ind){msgJeu('Choisis un liquide puis ajoute l’indicateur avant de classer.',false);return}const L=LIQUIDES.find(x=>x.id===st.sel);if(L.cls===c){st.res[L.id]=true;msgJeu('✅ Bravo : '+esc(L.nom)+' est <b>'+L.cls+'</b>.',true);SFX.ok&&SFX.ok()}else{E.err++;msgJeu('❌ Regarde bien la couleur : rose/rouge = acide, violet = neutre, bleu/vert = base.',false);SFX.ko&&SFX.ko()}dessine();if(LIQUIDES.every(l=>st.res[l.id]))termine()};
      st.vider=()=>{st.sel=null;st.ind=false;dessine()};dessine()},
    c3(st){
      st.v=false;st.b=false;
      function dessine(){const bulles=st.b?Array.from({length:14},(_,i)=>`<circle cx="${70+(i*37)%60}" cy="130" r="${3+(i%3)*2}" fill="#fff" opacity=".8"><animate attributeName="cy" values="140;60" dur="${1+(i%4)*.4}s" repeatCount="indefinite"/></circle>`).join(''):'';
        $('scijeu').innerHTML=`<svg viewBox="0 0 200 200" style="width:180px;float:right"><ellipse cx="100" cy="${st.b?36:50}" rx="${st.b?42:16}" ry="${st.b?46:20}" fill="#e84393" opacity=".9"${st.b?'':''}><animate attributeName="rx" values="16;42" dur="3s" fill="freeze" begin="${st.b?0:'indefinite'}"/><animate attributeName="ry" values="20;46" dur="3s" fill="freeze" begin="${st.b?0:'indefinite'}"/></ellipse><rect x="90" y="${st.b?80:68}" width="20" height="14" fill="#c9a06a"/><path d="M85 90 L115 90 L130 175 Q100 185 70 175 Z" fill="${st.v?'#f3ead0':'#ffffff10'}" stroke="#cfe8ff" stroke-width="4"/>${st.v?'<rect x="76" y="130" width="48" height="40" fill="'+(st.b?'#eef3f6':'#f3ead0')+'" opacity=".8"/>':''}${bulles}</svg>
        <div>${btn('🍶 Verser le vinaigre','sciC3V()',st.v?'#555':'#c0392b')}${btn('🥄 Ajouter le bicarbonate','sciC3B()',st.b?'#555':'#2c7fb8')}</div><p style="font-size:12px">Étape ${st.b?3:st.v?2:1}/3 : ${st.b?'observe les bulles et le ballon !':st.v?'ajoute le bicarbonate.':'verse le vinaigre dans la fiole.'}</p>`}
      st.v_=()=>{st.v=true;SFX.coin&&SFX.coin();dessine()};st.b_=()=>{if(!st.v){msgJeu('Verse d’abord le vinaigre dans la fiole.',false);return}st.b=true;dessine();SFX.bravo&&SFX.bravo();msgJeu('🫧 Des bulles de gaz se forment : le ballon se gonfle !',true);setTimeout(()=>{if(E&&E.id==='c3')termine()},3200)};
      st.vider=()=>{st.v=false;st.b=false;dessine()};dessine()},
    c4(st){
      st.T=20;st.vu={};
      function etat(T){return T<=0?'glace':T>=100?'vapeur':'liquide'}
      function dessine(){const e=etat(st.T),c={glace:'#dff4ff',liquide:'#7fb8e8',vapeur:'#e8eef2'}[e];st.vu[e]=true;
        const part=e==='vapeur'?Array.from({length:10},(_,i)=>`<circle cx="${70+(i*23)%60}" cy="90" r="${5+(i%3)*3}" fill="#ffffff" opacity=".7"><animate attributeName="cy" values="110;20" dur="${1.2+(i%3)*.5}s" repeatCount="indefinite"/></circle>`).join(''):e==='glace'?'<rect x="72" y="86" width="22" height="22" fill="#eaf8ff" stroke="#9fd3f5"/><rect x="100" y="94" width="22" height="22" fill="#eaf8ff" stroke="#9fd3f5"/><rect x="86" y="108" width="22" height="22" fill="#eaf8ff" stroke="#9fd3f5"/>':'';
        const hT=140-(Math.max(-20,Math.min(120,st.T))+20)/140*110;
        $('scijeu').innerHTML=`<svg viewBox="0 0 220 180" style="width:200px;float:right"><path d="M60 40 L130 40 L136 150 Q95 160 54 150 Z" fill="${e==='glace'?'#bfe9ff55':e==='vapeur'?'#ffffff15':c+'aa'}" stroke="#cfe8ff" stroke-width="4"/>${e==='vapeur'?'':'<rect x="57" y="'+(e==='glace'?84:78)+'" width="76" height="'+(e==='glace'?66:72)+'" fill="'+c+'" opacity=".75"/>'}${part}<rect x="175" y="30" width="14" height="112" rx="7" fill="#fff"/><rect x="178" y="${hT}" width="8" height="${142-hT}" rx="4" fill="#e74c3c"/><circle cx="182" cy="146" r="12" fill="#e74c3c"/><text x="182" y="22" fill="#fff" font-size="12" text-anchor="middle">${st.T}°C</text></svg>
        <div style="font-size:14px"><b>État : ${e==='glace'?'🧊 solide (glace)':e==='liquide'?'💧 liquide':'♨️ gaz (vapeur)'}</b></div><input type="range" min="-20" max="120" value="${st.T}" oninput="sciC4(this.value)" style="width:100%;margin:8px 0"><p style="font-size:12px">Observé : ${['glace','liquide','vapeur'].map(x=>(st.vu[x]?'✅ ':'⬜ ')+x).join(' · ')}</p>`}
      st.set=v=>{st.T=+v;dessine();if(st.vu.glace&&st.vu.liquide&&st.vu.vapeur&&!st.fini){st.fini=true;termine()}};st.vider=()=>{st.T=20;st.vu={};st.fini=false;dessine()};dessine()},
    // ===== BIOLOGIE
    b1(st){
      st.type='vegetale';st.demande=['noyau','chloroplaste','mitochondrie'];st.i=0;st.trouve={};
      function monte(){if(viewer)viewer.dispose();$('scijeu').innerHTML=`<div id="v3d"></div><div>${btn('🌿 Cellule végétale','sciB1T(\'vegetale\')',st.type==='vegetale'?'#2e7d32':'')}${btn('🐾 Cellule animale','sciB1T(\'animale\')',st.type==='animale'?'#2e7d32':'')}${btn('➕ Zoom','sciZoom(-1)','#2c7fb8','padding:6px 9px')}${btn('➖','sciZoom(1)','#2c7fb8','padding:6px 9px')}</div><p id="b1q" style="font-size:14px"></p>`;
        viewer=creerViewer($('v3d'),g=>cellule3d(st.type,g),part=>pick(part),4.2);q()}
      function q(){const e=$('b1q');if(!e)return;const d=st.demande[st.i];e.innerHTML=d?`🎯 Touche (clique sur) : <b>${d==='noyau'?'le noyau (violet)':d==='chloroplaste'?'un chloroplaste (cellule végétale, vert)':'une mitochondrie (cellule animale, orange)'}</b>`:'✅ Tu as tout trouvé !'}
      function pick(part){const P=(CELLULES[st.type].parties.find(x=>x.id===part))||{nom:part,txt:''};msgJeu(`<b>${esc(P.nom)}</b> : ${esc(P.txt)}`,null);const d=st.demande[st.i];if(d&&part===d){st.i++;SFX.ok&&SFX.ok();q();if(st.i>=st.demande.length)termine()}else if(d){E.err+=0}}
      st.pick=pick;st.type_=t=>{st.type=t;monte()};st.vider=()=>{st.i=0;monte()};monte()},
    b2(st){
      st.jour=0;st.vuJ10=false;st.parties=['racine','tige','feuille','fleur'];st.pi=0;st.pdone=false;
      const POTS=[['A','Eau + chaleur + lumière',true,true,true],['B','Sans eau',false,true,true],['C','Eau + chaleur, dans le noir',true,true,false],['D','Eau + lumière, au froid',true,false,true]];
      function plante(germ,lum,j,x){if(!germ||j<2)return `<text x="${x}" y="150" font-size="10" fill="#bbb" text-anchor="middle">${germ?'graine':'rien'}</text>`;const h=Math.min(70,(j-1)*8),col=lum?'#2e9e4a':'#d9d27a';return `<line x1="${x}" y1="140" x2="${x}" y2="${140-h}" stroke="${col}" stroke-width="3"/>${j>3?`<ellipse cx="${x-9}" cy="${140-h*.6}" rx="9" ry="4" fill="${col}"/><ellipse cx="${x+9}" cy="${140-h*.8}" rx="9" ry="4" fill="${col}"/>`:''}${j>=8&&lum?`<circle cx="${x}" cy="${140-h-4}" r="5" fill="#e84393"/>`:''}`}
      function dessine(){
        $('scijeu').innerHTML=`<svg viewBox="0 0 320 180" style="width:100%">${POTS.map((p,i)=>{const x=40+i*80,germ=p[2]&&p[3];return `<rect x="${x-24}" y="140" width="48" height="30" rx="4" fill="#b5603a"/><rect x="${x-24}" y="140" width="48" height="6" fill="#6b4423"/>${plante(germ,p[4],st.jour,x)}<text x="${x}" y="12" font-size="9" fill="#fff" text-anchor="middle">${p[0]}</text><text x="${x}" y="24" font-size="7" fill="#cfd8dc" text-anchor="middle">${p[1].slice(0,18)}</text>`}).join('')}</svg>
        <p style="font-size:13px">Jour <b>${st.jour}</b> / 10 <input type="range" min="0" max="10" value="${st.jour}" oninput="sciB2J(this.value)" style="width:60%;vertical-align:middle"></p>
        <p style="font-size:12px">A : eau + chaleur + lumière · B : sans eau · C : dans le noir · D : au froid. Que remarques-tu ?</p>
        ${st.vuJ10?`<div style="background:#1f3347;border-radius:10px;padding:8px"><b>Parties d’une plante</b><svg viewBox="0 0 200 150" style="width:160px;float:right"><g onclick="sciB2P('racine')" style="cursor:pointer"><path d="M100 110 L80 145 M100 110 L100 148 M100 110 L120 145" stroke="#b5763a" stroke-width="4" fill="none"/></g><g onclick="sciB2P('tige')" style="cursor:pointer"><line x1="100" y1="110" x2="100" y2="40" stroke="#2e9e4a" stroke-width="6"/></g><g onclick="sciB2P('feuille')" style="cursor:pointer"><ellipse cx="78" cy="75" rx="18" ry="8" fill="#3fbf5a"/><ellipse cx="122" cy="62" rx="18" ry="8" fill="#3fbf5a"/></g><g onclick="sciB2P('fleur')" style="cursor:pointer"><circle cx="100" cy="30" r="12" fill="#e84393"/><circle cx="100" cy="30" r="5" fill="#f1c40f"/></g></svg><p style="font-size:13px">${st.pi<4?'🎯 Touche : <b>'+st.parties[st.pi]+'</b>':'✅ Toutes les parties trouvées'}</p></div>`:''}`}
      st.jr=v=>{st.jour=+v;if(st.jour>=10)st.vuJ10=true;dessine();if(st.vuJ10)msgJeu('A pousse bien ; B ne germe pas sans eau ; C germe mais reste pâle sans lumière ; D ne germe pas au froid.',null)};
      st.part=p=>{if(st.pi>=4)return;if(p===st.parties[st.pi]){st.pi++;SFX.ok&&SFX.ok();dessine();if(st.pi>=4)termine()}else{E.err++;SFX.ko&&SFX.ko();msgJeu('❌ Ce n’est pas la '+st.parties[st.pi]+'. Regarde bien le dessin.',false)}};
      st.vider=()=>{st.jour=0;st.vuJ10=false;st.pi=0;dessine()};dessine()},
    b3(st){
      st.demande=['coeur','poumons','estomac','cerveau'];st.i=0;
      function monte(){if(viewer)viewer.dispose();$('scijeu').innerHTML=`<div id="v3d"></div><div>${btn('➕ Zoom','sciZoom(-1)','#2c7fb8','padding:6px 9px')}${btn('➖','sciZoom(1)','#2c7fb8','padding:6px 9px')}</div><p id="b3q" style="font-size:14px"></p>`;viewer=creerViewer($('v3d'),corps3d,pick,5.2);q()}
      function q(){const e=$('b3q');if(!e)return;const d=st.demande[st.i];e.innerHTML=d?`🎯 Touche : <b>${esc(ORGANES.find(o=>o.id===d).nom)}</b>`:'✅ Tous les organes trouvés !'}
      function pick(part){const O=ORGANES.find(x=>x.id===part);if(!O)return;msgJeu(`<b>${O.ico} ${esc(O.nom)}</b> : ${esc(O.txt)}`,null);const d=st.demande[st.i];if(d&&part===d){st.i++;SFX.ok&&SFX.ok();q();if(st.i>=st.demande.length)termine()}else if(d){E.err++;SFX.ko&&SFX.ko()}}
      st.pick=pick;st.vider=()=>{st.i=0;monte()};monte()},
    // ===== PHYSIQUE
    p1(st){
      st.slots=[null,null,null,null];st.sel=null;st.ferme=true;st.test={};st.mat=null;
      const IT={pile:'🔋 Pile',ampoule:'💡 Ampoule',inter:'🎚 Interrupteur',fil:'➖ Fil'};
      function allume(){const s=st.slots;return s.every(Boolean)&&s.includes('pile')&&s.includes('ampoule')&&(!s.includes('inter')||st.ferme)}
      function dessine(){
        const al=allume(),pos=[[100,20],[190,70],[100,120],[10,70]];
        $('scijeu').innerHTML=`<svg viewBox="0 0 220 150" style="width:100%"><rect x="20" y="30" width="170" height="90" fill="none" stroke="${al?'#ffd54f':'#778'}" stroke-width="3" stroke-dasharray="${al?'8 6':'0'}">${al?'<animate attributeName="stroke-dashoffset" values="0;28" dur=".8s" repeatCount="indefinite"/>':''}</rect>${pos.map((p,i)=>`<g onclick="sciP1S(${i})" style="cursor:pointer"><circle cx="${p[0]+5}" cy="${p[1]+10}" r="18" fill="${st.slots[i]?'#2f4a6b':'#1b2735'}" stroke="#fff6" stroke-dasharray="${st.slots[i]?'0':'3 3'}"/><text x="${p[0]+5}" y="${p[1]+15}" font-size="16" text-anchor="middle">${st.slots[i]==='pile'?'🔋':st.slots[i]==='ampoule'?(al?'💡':'🔅'):st.slots[i]==='inter'?(st.ferme?'🟢':'⚪'):st.slots[i]==='fil'?'➖':'＋'}</text></g>`).join('')}${al?'<circle cx="105" cy="75" r="26" fill="#ffe066" opacity=".35"/>':''}</svg>
        <div><b style="font-size:13px">Choisis un composant puis une case :</b><br>${Object.keys(IT).map(k=>btn(IT[k],`sciP1I('${k}')`,st.sel===k?'#ffd54f':'','color:'+(st.sel===k?'#222':'#fff')+';padding:6px 8px')).join('')}${btn(st.ferme?'🟢 Interrupteur fermé':'⚪ Interrupteur ouvert','sciP1F()','#555','padding:6px 8px')}</div><p style="font-size:13px">${al?'💡 <b>L’ampoule est allumée !</b> Le circuit est fermé.':'Le circuit n’est pas complet : remplis les 4 cases (pile, ampoule…).'}</p>
        ${st.circuit?`<div style="background:#1f3347;border-radius:10px;padding:8px"><b style="font-size:13px">Teste un matériau dans le circuit :</b><br>${MATERIAUX.map(m=>btn(m[1]+' '+m[0]+(st.test[m[0]]!==undefined?(st.test[m[0]]?' ✅':' ⛔'):''),`sciP1M('${m[0]}')`,st.mat===m[0]?'#ffd54f':'','color:'+(st.mat===m[0]?'#222':'#fff')+';padding:5px 7px;font-size:12px')).join('')}<p style="font-size:13px">${st.mat?(MATERIAUX.find(m=>m[0]===st.mat)[2]?'💡 L’ampoule s’allume : <b>conducteur</b>.':'🔅 L’ampoule reste éteinte : <b>isolant</b>.'):''}</p></div>`:''}`}
      st.item=k=>{st.sel=k;dessine()};st.slot=i=>{if(!st.sel){msgJeu('Choisis d’abord un composant.',false);return}st.slots[i]=st.sel;SFX.coin&&SFX.coin();dessine();if(allume()&&!st.circuit){st.circuit=true;SFX.bravo&&SFX.bravo();msgJeu('💡 Bravo, l’ampoule s’allume ! Teste maintenant les matériaux.',true);dessine()}};
      st.fer=()=>{st.ferme=!st.ferme;dessine()};st.matr=m=>{st.mat=m;st.test[m]=MATERIAUX.find(x=>x[0]===m)[2];SFX.ok&&SFX.ok();dessine();if(MATERIAUX.every(x=>st.test[x[0]]!==undefined))termine()};
      st.vider=()=>{st.slots=[null,null,null,null];st.circuit=false;st.test={};st.mat=null;dessine()};dessine()},
    p2(st){
      st.pz=[[3,4,6],[2,6,4],[5,2,2]];st.k=0;st.d=1;st.ok=0;
      function dessine(){const [m1,d1,m2]=st.pz[st.k],ang=Math.max(-18,Math.min(18,(m1*d1-m2*st.d)*3)),eq=m1*d1===m2*st.d;
        $('scijeu').innerHTML=`<svg viewBox="0 0 240 150" style="width:100%"><polygon points="120,100 105,135 135,135" fill="#8a8f99"/><g transform="rotate(${-ang} 120 100)"><rect x="20" y="96" width="200" height="8" rx="3" fill="#c9a06a"/>${[1,2,3,4,5,6].map(i=>`<line x1="${120-i*16}" y1="92" x2="${120-i*16}" y2="104" stroke="#555"/><line x1="${120+i*16}" y1="92" x2="${120+i*16}" y2="104" stroke="#555"/>`).join('')}<rect x="${120-d1*16-12}" y="${96-m1*5-4}" width="24" height="${m1*5+4}" fill="#e67e22"/><text x="${120-d1*16}" y="${90-m1*5}" font-size="9" fill="#fff" text-anchor="middle">${m1} kg</text><rect x="${120+st.d*16-12}" y="${96-m2*5-4}" width="24" height="${m2*5+4}" fill="#2c7fb8"/><text x="${120+st.d*16}" y="${90-m2*5}" font-size="9" fill="#fff" text-anchor="middle">${m2} kg</text></g></svg>
        <p style="font-size:13px">Situation ${st.k+1}/3 : à gauche ${m1} kg à ${d1} cases du centre ; à droite ${m2} kg à ${st.d} case(s).</p><div>${btn('◀ Rapprocher','sciP2(-1)','#2f4a6b')}${btn('Éloigner ▶','sciP2(1)','#2f4a6b')}${btn('✔ Valider l’équilibre','sciP2V()','#2e7d32')}</div><p style="font-size:12px">${eq?'⚖️ La balance est équilibrée !':ang>0?'Le côté gauche est trop lourd.':'Le côté droit est trop lourd.'}</p>`}
      st.mv=d=>{st.d=Math.max(1,Math.min(6,st.d+d));dessine()};st.val=()=>{const [m1,d1,m2]=st.pz[st.k];if(m1*d1===m2*st.d){SFX.bravo&&SFX.bravo();st.k++;st.d=1;if(st.k>=3){msgJeu('✅ Les 3 leviers sont équilibrés !',true);st.k=2;st.d=st.pz[2][0]*st.pz[2][1]/st.pz[2][2];dessine();termine();return}msgJeu('✅ Équilibré ! Situation suivante.',true);dessine()}else{E.err++;SFX.ko&&SFX.ko();msgJeu('❌ Pas équilibré : poids × distance doivent être égaux de chaque côté.',false)}};
      st.vider=()=>{st.k=0;st.d=1;dessine()};dessine()},
    p3(st){
      st.astre=0;st.t={};st.chute=null;
      function dessine(){$('scijeu').innerHTML=`<div>${ASTRES.map((a,i)=>btn(a[1]+' '+a[0],`sciP3A(${i})`,st.astre===i?'#ffd54f':'','color:'+(st.astre===i?'#222':'#fff')+';padding:6px 8px')).join('')}</div><svg viewBox="0 0 240 190" style="width:100%"><rect x="0" y="170" width="240" height="20" fill="#556"/><text x="8" y="14" fill="#fff" font-size="11">g = ${ASTRES[st.astre][2]} m/s² · hauteur 20 m</text><circle id="balle" cx="120" cy="${st.chute?st.chute.y:20}" r="9" fill="#e74c3c"/><line x1="200" y1="20" x2="200" y2="170" stroke="#778" stroke-dasharray="3 3"/></svg>${btn('⬇ Lâcher la balle','sciP3L()','#2e7d32')}<p style="font-size:13px">Temps de chute mesurés : ${ASTRES.map(a=>a[1]+(st.t[a[0]]?' '+st.t[a[0]]+' s':' —')).join(' · ')}</p>`}
      st.as=i=>{st.astre=i;st.chute=null;dessine()};
      st.lache=()=>{const g=ASTRES[st.astre][2],T=Math.sqrt(2*20/g),t0=performance.now();const tm=setInterval(()=>{const t=(performance.now()-t0)/1000*Math.max(1,T/3);const y=Math.min(170-9,20+0.5*g*t*t*(150/20)/1);const b=document.getElementById('balle');if(b)b.setAttribute('cy',Math.min(161,20+((0.5*g*t*t)/20)*141));if(0.5*g*t*t>=20){clearInterval(tm);st.t[ASTRES[st.astre][0]]=Math.round(T*100)/100;SFX.coin&&SFX.coin();dessine();msgJeu('⏱ Temps de chute sur '+ASTRES[st.astre][0]+' : <b>'+st.t[ASTRES[st.astre][0]]+' s</b> (animation accélérée).',true);if(ASTRES.every(a=>st.t[a[0]]))termine()}},30);timers.push(tm)};
      st.vider=()=>{st.t={};st.astre=0;st.chute=null;dessine()};dessine()},
    p4(st){
      st.ang=45;st.cibles=[[190,40],[160,10]];st.k=0;
      function ray(){const m=[100,80],a=st.ang*Math.PI/180;const inc=[m[0]-20,m[1]-0];const d=[1,0];const n=[-Math.sin(a),-Math.cos(a)];const dot=d[0]*n[0]+d[1]*n[1];const r=[d[0]-2*dot*n[0],d[1]-2*dot*n[1]];return {m,r,inc}}
      function dessine(){const {m,r}=ray(),t=st.cibles[st.k]||st.cibles[1],len=170,e=[m[0]+r[0]*len,m[1]+r[1]*len];const a=st.ang*Math.PI/180;
        const dx=Math.cos(a)*24,dy=-Math.sin(a)*24;
        $('scijeu').innerHTML=`<svg viewBox="0 0 220 160" style="width:100%"><rect x="0" y="0" width="220" height="160" fill="#0b1622"/><rect x="6" y="70" width="14" height="20" fill="#ffd54f"/><line x1="20" y1="80" x2="${m[0]}" y2="${m[1]}" stroke="#ffe066" stroke-width="2"/><line x1="${m[0]-dx}" y1="${m[1]-dy}" x2="${m[0]+dx}" y2="${m[1]+dy}" stroke="#cfe8ff" stroke-width="5"/><line x1="${m[0]}" y1="${m[1]}" x2="${e[0]}" y2="${e[1]}" stroke="#ffe066" stroke-width="2" stroke-dasharray="4 2"/><circle cx="${t[0]}" cy="${t[1]}" r="9" fill="none" stroke="#7CFC00" stroke-width="3"/><circle cx="${t[0]}" cy="${t[1]}" r="3" fill="#7CFC00"/></svg>
        <p style="font-size:13px">Cible ${st.k+1}/2 · inclinaison du miroir : <b>${st.ang}°</b> <input type="range" min="10" max="80" value="${st.ang}" oninput="sciP4(this.value)" style="width:55%;vertical-align:middle"></p>${btn('🎯 Tester le tir','sciP4T()','#2e7d32')}`}
      st.set=v=>{st.ang=+v;dessine()};st.test=()=>{const {m,r}=ray(),t=st.cibles[st.k];const tx=t[0]-m[0],ty=t[1]-m[1],proj=tx*r[0]+ty*r[1],px=m[0]+r[0]*proj-t[0],py=m[1]+r[1]*proj-t[1],dist=Math.hypot(px,py);
        if(proj>0&&dist<12){SFX.bravo&&SFX.bravo();st.k++;if(st.k>=2){st.k=1;msgJeu('✅ Les deux cibles sont atteintes !',true);dessine();termine();return}msgJeu('✅ Cible atteinte ! Passe à la suivante.',true);dessine()}else{E.err++;SFX.ko&&SFX.ko();msgJeu('❌ Raté. Le rayon réfléchi part avec le même angle que le rayon arrivant : incline le miroir autrement.',false)}};
      st.vider=()=>{st.k=0;st.ang=45;dessine()};dessine()}
  };
  // ---------- actions
  const actions={
    sciOuvrir:()=>ouvrir(),sciQuitter:()=>quitter(),sciFermerP:()=>fermerP(),sciInteragir:()=>interagir(),sciExaminer:()=>examiner(),sciDossiers:()=>dossiers(),
    sciRep:nx=>{if(!nx){fermerP();return}noeud(dialG,nx)},sciGroupe:id=>groupe(id),sciExp:id=>lancer(id),
    sciExpPre:()=>{qcm(EXPS[E.id].pre,()=>jeu(),'🧠 Avant l’expérience : ton hypothèse')},
    sciQ:i=>{if(E.q.rep!==undefined&&E.q.rep===E.q.q.a)return;E.q.rep=i;if(i!==E.q.q.a&&E.q.titre.indexOf('Après')>=0)E.err++;SFX[i===E.q.q.a?'ok':'ko']&&SFX[i===E.q.q.a?'ok':'ko']();qcmRendu()},
    sciQRetry:()=>{E.q.rep=undefined;qcmRendu()},sciQSuite:()=>{const s=E.q.suite;s()},
    sciPost:()=>{stopTout();qcm(EXPS[E.id].post,()=>finExp(),'🧠 Après l’expérience : ce que tu as compris')},
    sciRecom:()=>{if(E&&E.etat&&E.etat.vider)E.etat.vider();msgJeu('🔄 Expérience recommencée.',null);const f=$('scijeufin');if(f)f.innerHTML=''},
    sciZoom:d=>{if(viewer)viewer.zoom(d*.8)},
    sciC1:k=>E.etat.verse(k),sciC1Mel:()=>E.etat.melanger(),
    sciC2Sel:id=>E.etat.sel_(id),sciC2Ind:()=>E.etat.ajInd(),sciC2Cl:c=>E.etat.cl(c),
    sciC3V:()=>E.etat.v_(),sciC3B:()=>E.etat.b_(),sciC4:v=>E.etat.set(v),
    sciB1T:t=>E.etat.type_(t),sciB2J:v=>E.etat.jr(v),sciB2P:p=>E.etat.part(p),
    sciP1I:k=>E.etat.item(k),sciP1S:i=>E.etat.slot(i),sciP1F:()=>E.etat.fer(),sciP1M:m=>E.etat.matr(m),
    sciP2:d=>E.etat.mv(d),sciP2V:()=>E.etat.val(),sciP3A:i=>E.etat.as(i),sciP3L:()=>E.etat.lache(),sciP4:v=>E.etat.set(v),sciP4T:()=>E.etat.test(),
    sciPerso:()=>perso(),sciCert:()=>certificat(),
    sciLook:(k,v)=>{const l=SCI().look;l[k]=v;save();mot.setLook(l);perso()},
    sciLunettes:()=>{const l=SCI().look,a=l.acc||[];l.acc=a.includes('lunettes')?a.filter(x=>x!=='lunettes'):a.concat('lunettes');save();mot.setLook(l);perso()}
  };
  return {actions,ouvrir,fermer,SCI,estOuvert:()=>!!ov,mot:()=>mot,etat:()=>E};
}
