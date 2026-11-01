// BOYEKOLI MEDICAL CENTER – hôpital éducatif 3D : « Ma première journée à l'hôpital » (cas cliniques fictifs) et
// « À la découverte des métiers de l'hôpital » (services, ambulance, corps humain). Simulation sans diagnostic réel.
import * as THREE from 'three';
import {creerMoteur} from './detective/moteur.js';
import {creerViewer,M3,corps3d} from './science/vue3d.js';
import {HOPITAL,COUR,DIAL,CAS,SERVICES,INSTRUMENTS,AMBULANCE_EQUIP,PREMIERS_SECOURS,TRANSPORT,FICHES,LOOKS_PRO} from './hopital/data.js';

export function creerHopital(D){
  const {G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const MED=()=>{const a=A();if(!a.med)a.med={cas:{},svc:{},pts:0,look:{s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#ffffff',acc:[]},pro:'medecin',cert:null,badges:{}};const m=a.med;['cas','svc','badges'].forEach(k=>{if(!m[k])m[k]={}});if(!m.look)m.look={s:'f',skin:3,hair:'tresses',outfit:'uniforme',c:'#ffffff',acc:[]};return m};
  let ov=null,mot=null,pr=null,panneau=false,tOuv=0,viewer=null,kb=null,popH=null,lieu='hopital',C=null,timers=[],audio=null;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:9px 12px;margin:3px;border-radius:12px;border:2px solid #fff3;background:${bg||'#2f5a6b'};color:#fff;font-size:14px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const nbCas=()=>CAS.filter(c=>MED().cas[c.id]).length,nbSvc=()=>Object.keys(SERVICES).filter(k=>MED().svc[k]).length;
  function msg(t,ms){const m=$('medmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3500)}
  const lookPro=()=>{const m=MED(),p=LOOKS_PRO.find(x=>x.id===m.pro)||LOOKS_PRO[0];return Object.assign({},m.look,p.look)};
  // ---------- ouverture
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);tOuv=Date.now();
    ov=document.createElement('div');ov.id='medov';
    ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#102028;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:linear-gradient(90deg,#0b6e6e,#1b9aa8);flex:0 0 auto"><b id="medtit" style="flex:1;font-size:14px">🏥 BOYEKOLI MEDICAL CENTER</b>${btn('🥼','medPerso()','#2f5a6b','padding:5px 9px;margin:0')}${btn('✖','medQuitter()','#7b2d26','padding:5px 10px;margin:0')}</div>
    <div id="med3d" style="flex:1;position:relative;min-height:0"></div><div id="medhud" style="position:absolute;left:0;right:0;bottom:0;height:170px;pointer-events:none"></div>
    <div id="medmsg" style="position:absolute;left:8px;right:8px;top:50px;background:rgba(10,24,30,.9);padding:6px 9px;border-radius:10px;font-size:13px;display:none"></div>
    <div id="medpan" style="position:absolute;inset:0;background:rgba(8,20,26,.97);display:none;flex-direction:column;padding:10px;overflow:auto;z-index:5"></div>`;
    document.body.appendChild(ov);
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    mot=creerMoteur($('med3d'),{low,look:lookPro(),onProche:p=>{pr=p;majBouton()}});
    charger('hopital');hud();try{history.pushState({med:1},'')}catch(e){}popH=()=>{if(ov)quitter()};window.addEventListener('popstate',popH);
    panel(`<h3 style="margin:2px 0">🏥 Bienvenue au BOYEKOLI MEDICAL CENTER</h3><p style="font-size:14px">Tu es en visite dans un hôpital <b>virtuel</b>. Ici, tout est <b>simulé</b> : les patients, les dossiers et les soins sont fictifs. Cela ne remplace jamais un vrai médecin : en cas de problème de santé, parle à un adulte et consulte un professionnel de santé.</p><p style="font-size:13px">🎯 Mission 1 : <b>Ma première journée à l’hôpital</b> (reçois des patients fictifs).<br>🎯 Mission 2 : <b>À la découverte des métiers de l’hôpital</b> (visite les services).</p><p style="font-size:12px;opacity:.85">Règles d’hygiène : on se lave les mains, on porte masque et gants quand il faut, on ne partage jamais ses médicaments.</p>${btn('▶ Entrer','medFermerP()','#2e7d32','font-size:16px;padding:12px')}`,true);
    parler('Bienvenue au Boyekoli Medical Center. Tout est simulé pour apprendre.')}
  function charger(l){lieu=l;mot.charger(l==='hopital'?HOPITAL:COUR);mot.setLook(lookPro());$('medtit').textContent=l==='hopital'?'🏥 BOYEKOLI MEDICAL CENTER':'🏥 Cour de l’hôpital'}
  function quitter(){if(popH){window.removeEventListener('popstate',popH);popH=null}if(kb){window.removeEventListener('keydown',kb);kb=null}const a=!!ov;fermer();if(a)closeDialog()}
  function fermer(sil){
    if(!ov)return;stopTout();const s=Math.round((Date.now()-tOuv)/1000);if(s>8&&!sil){const t=A().tal||(A().tal={});t.sante=(t.sante||0)+Math.min(120,Math.floor(s/6));save()}
    if(mot){mot.stop();mot=null}if(audio){try{audio.close()}catch(e){}audio=null}ov.remove();ov=null;panneau=false;C=null}
  function stopTout(){timers.forEach(t=>{clearInterval(t);clearTimeout(t)});timers=[];if(viewer){viewer.dispose();viewer=null}}
  function hud(){
    const h=$('medhud');
    h.innerHTML=`<div id="joy" style="position:absolute;left:12px;bottom:14px;width:128px;height:128px;border-radius:50%;background:rgba(255,255,255,.12);border:3px solid #fff5;pointer-events:auto;touch-action:none"><div id="jk" style="position:absolute;left:44px;top:44px;width:40px;height:40px;border-radius:50%;background:#fff;opacity:.85"></div></div>
    <div style="position:absolute;right:10px;bottom:12px;display:flex;flex-direction:column;align-items:flex-end;pointer-events:auto"><div>${btn('🛗 Services','medAscenseur()','#2f5a6b','padding:8px 10px')}${btn('📋 Dossiers','medDossiers()','#2f5a6b','padding:8px 10px')}</div><div>${btn('🔍 Examiner','medExaminer()','#2c7fb8','padding:12px 12px')}</div><div>${btn('✋ Interagir','medInteragir()','#2e7d32','padding:14px 18px;font-size:15px').replace('<button','<button id="bint"')}</div></div>`;
    const jb=$('joy'),jk=$('jk');let id=null;
    const mv=e=>{const b=jb.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}mot.joy.x=dx;mot.joy.y=dy;jk.style.left=(44+dx*40)+'px';jk.style.top=(44+dy*40)+'px'};
    jb.addEventListener('pointerdown',e=>{e.preventDefault();jb.setPointerCapture(e.pointerId);id=e.pointerId;mv(e)});jb.addEventListener('pointermove',e=>{if(e.pointerId===id)mv(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(n=>jb.addEventListener(n,e=>{if(e.pointerId===id){id=null;mot.joy.x=mot.joy.y=0;jk.style.left='44px';jk.style.top='44px'}}));
    kb=e=>{if(!ov||panneau)return;const k=e.key.toLowerCase();if(k==='e')interagir();else if(k==='f')examiner();else if(k==='escape')quitter()};window.addEventListener('keydown',kb)}
  function majBouton(){const b=$('bint');if(!b)return;if(!pr){b.innerHTML='✋ Interagir';return}let t=pr.kind==='pnj'?'💬 Parler à '+pr.def.nom.split(',')[0]:pr.kind==='sortie'?pr.def.label:(pr.def.label||'✋ '+pr.def.nom);b.innerHTML=t.length>34?t.slice(0,33)+'…':t}
  function panel(h,sans){panneau=true;mot&&mot.fige(true);const p=$('medpan');p.style.display='flex';p.innerHTML=h+(sans?'':'<div style="margin-top:8px">'+btn('✖ Fermer','medFermerP()','#7b2d26')+'</div>')}
  function fermerP(){stopTout();C=null;panneau=false;const p=$('medpan');if(p){p.style.display='none';p.innerHTML=''}mot&&mot.fige(false)}
  const carte=(t)=>`<div style="background:#1b3440;border-radius:12px;padding:9px;margin:6px 0;font-size:13px">${t}</div>`;
  const feedback=(ok,t)=>`<p style="font-size:13px;margin:6px 0">${ok?'✅ <b>Bien !</b> ':'❌ <b>Pas tout à fait.</b> '}${esc(t||'')}</p>`;
  // ---------- interactions
  let dialG=null;
  function interagir(){
    if(!mot||panneau)return;const p=mot.proche();if(!p){msg('Rien à utiliser ici. Approche-toi d’un équipement ou d’une personne.',2200);return}
    if(p.kind==='sortie'){if(lieu==='hopital')charger('cour');else charger('hopital');return}
    if(p.kind==='pnj'){dialoguer(p.def);return}
    const e=p.def;if(e.panneau){ouvrirPanneau(e.panneau);return}msg(e.ex||e.nom,4500)}
  function examiner(){if(!mot||panneau)return;const p=mot.proche();if(!p){msg('🔍 Rien de particulier ici.',2200);return}if(p.kind==='pnj'){msg(p.def.nom+' : '+p.def.role+'.',2500);return}msg('🔍 '+(p.def.ex||p.def.nom),5000)}
  function dialoguer(p){const d=DIAL[p.dial];if(!d)return;mot.parler(p.id,6);noeud(d,'n0')}
  function noeud(d,nid){const n=d[nid];if(!n){fermerP();return}dialG=d;panel(`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:30px">🗣</span><b>${esc(d.nom)}</b></div><div style="background:#1b3440;border-radius:12px;padding:10px;margin:8px 0;font-size:15px;line-height:1.4">${esc(n.t)}</div>`+n.c.map(([l,nx])=>btn('➤ '+esc(l),`medRep('${nx||''}')`)).join(''),true)}
  function ouvrirPanneau(n){
    if(n==='entree'){charger('hopital');return}
    if(n==='instruments')return instruments();if(n==='ascenseur')return ascenseur();if(n==='dossiers')return dossiers();if(n==='anatomie')return anatomie();if(n==='masques')return hygiene();if(n==='ambulance')return ambulance();
    if(n.startsWith('svc_'))return service(n.slice(4))}
  // ---------- ascenseur
  const ROOMS=[['Cabinet de consultation',-15,-5],['Pédiatrie',-9,-5],['Urgences',-3,-5],['Laboratoire',3,-5],['Radiologie',9,-5],['Échographie',15,-5],['Accueil et attente',-14,6],['Pharmacie',-5,6],['Salle de soins',1,6],['Hospitalisation',7,6],['Bloc opératoire (simulé)',12,6],['Médecin-chef',16,6]];
  function ascenseur(){panel('<h3 style="margin:2px 0">🛗 Ascenseur : changer de service</h3>'+ROOMS.map((r,i)=>btn(esc(r[0]),`medAller(${i})`,'#2f5a6b')).join('')+'<p style="font-size:12px;opacity:.85">Tu peux aussi marcher dans les couloirs avec le joystick.</p>')}
  // ---------- instruments (trousse) et hygiène
  function bip(freq,dur,vol){try{if(!audio)audio=new (window.AudioContext||window.webkitAudioContext)();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(vol||.4,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+dur+.05)}catch(e){}}
  function battements(bpm,n){const pas=60/bpm;for(let i=0;i<(n||6);i++){setTimeout(()=>bip(70,.14,.7),i*pas*1000);setTimeout(()=>bip(55,.1,.5),i*pas*1000+170)}}
  function instruments(){
    panel('<h3 style="margin:2px 0">🩺 Les instruments du médecin</h3><p style="font-size:13px">Touche un instrument pour comprendre à quoi il sert et l’utiliser sur un patient <b>fictif</b>.</p>'+INSTRUMENTS.map(i=>btn(i[1]+' '+i[2],`medInstr('${i[0]}')`)).join('')+'<div id="instrinfo"></div>')}
  const INFO={stetho:'Le stéthoscope sert à écouter le cœur et les poumons. Les bruits normaux sont réguliers : « poum-ta, poum-ta ».',thermo:'Le thermomètre mesure la température du corps. Normale : environ 36,5 à 37,5 °C. Au-dessus de 38 °C, on parle de fièvre.',tension:'Le tensiomètre mesure la pression du sang dans les artères (ex. 100/60 chez l’enfant).',oxy:'L’oxymètre se met au bout du doigt et indique le taux d’oxygène dans le sang : normal au-dessus de 95 %.'};
  function hygiene(){
    const m=MED();C={t:'hyg',etapes:['Se laver les mains avec du savon (20 secondes)','Mettre le masque','Enfiler les gants','Soigner puis jeter les gants','Se laver de nouveau les mains'],i:0};
    hygRender()}
  function hygRender(){
    const e=C.etapes,sh=C.mel||(C.mel=e.map((x,i)=>i).sort(()=>Math.random()-.5));
    panel(`<h3 style="margin:2px 0">🧤 Hygiène et protection</h3><p style="font-size:13px">Remets les étapes dans le bon ordre (touche-les l’une après l’autre) : étape ${C.i+1}/${e.length}</p>`+sh.map(k=>`<button ${k<C.i?'disabled':''} onclick="medHyg(${k})" style="display:block;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:10px;border:2px solid #fff3;background:${k<C.i?'#2e7d32':'#1b3440'};color:#fff;font-size:14px">${k<C.i?'✅ ':''}${esc(e[k])}</button>`).join('')+(C.i>=e.length?carte('✅ <b>Bravo !</b> Se laver les mains et se protéger évite de transmettre les microbes. (Simulation éducative.)'):'')+'<div>'+btn('✖ Fermer','medFermerP()','#7b2d26')+'</div>')}
  // ---------- anatomie
  function anatomie(){
    stopTout();panel(`<h3 style="margin:2px 0">🫀 Le corps humain en 3D</h3><div id="v3d"></div><div>${btn('➕ Zoom','medZoom(-1)','#2c7fb8','padding:6px 9px')}${btn('➖','medZoom(1)','#2c7fb8','padding:6px 9px')}</div><p id="anaInfo" style="font-size:13px;min-height:36px">Touche un organe pour découvrir sa fonction.</p><div style="max-height:34vh;overflow:auto">${FICHES.map(f=>carte('<b>'+esc(f[0])+'</b><br>'+esc(f[1]))).join('')}</div>`);
    const INF={coeur:'🫀 Le cœur pompe le sang dans tout le corps.',poumons:'🫁 Les poumons apportent l’oxygène au sang.',estomac:'🍽 L’estomac mélange et digère les aliments.',cerveau:'🧠 Le cerveau commande le corps et pense.'};
    viewer=creerViewer($('v3d'),corps3d,part=>{const e=$('anaInfo');if(e)e.textContent=INF[part]||part},5.2)}
  // ---------- ambulance
  function ambulance(tab){
    tab=tab||'int';stopTout();
    let h=`<h3 style="margin:2px 0">🚑 L’ambulance</h3><div>${btn('🔍 Intérieur',"medAmb('int')",tab==='int'?'#ffd54f':'','color:'+(tab==='int'?'#222':'#fff'))}${btn('🩹 Premiers secours',"medAmb('ps')",tab==='ps'?'#ffd54f':'','color:'+(tab==='ps'?'#222':'#fff'))}${btn('🗺 Transport',"medAmb('tr')",tab==='tr'?'#ffd54f':'','color:'+(tab==='tr'?'#222':'#fff'))}</div>`;
    if(tab==='int'){h+=carte('Les ambulanciers conduisent et soignent pendant le trajet. Touche chaque équipement :')+'<div id="v3d"></div><p id="ambInfo" style="font-size:13px;min-height:36px">Touche un équipement.</p>';panel(h);
      viewer=creerViewer($('v3d'),g=>{const caisse=new THREE.Mesh(new THREE.BoxGeometry(2.6,1.4,1.4),M3('#ffffff',.18));g.add(caisse);const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6,1.4,1.4)),new THREE.LineBasicMaterial({color:'#d6302b'}));g.add(e);
        AMBULANCE_EQUIP.forEach(q=>{const m=new THREE.Mesh(q.id==='civiere'?new THREE.BoxGeometry(1.6,.15,.6):q.id==='oxygene'?new THREE.CylinderGeometry(.12,.12,.6,10):new THREE.BoxGeometry(.4,.35,.3),M3({civiere:'#d9dde3',oxygene:'#2e86de',dae:'#e74c3c',trousse:'#2e9e4a',radio:'#555'}[q.id]));m.position.set(q.x,q.y*.8-.1,0);m.userData.part=q.id;g.add(m)})},
        part=>{const q=AMBULANCE_EQUIP.find(x=>x.id===part);const e=$('ambInfo');if(q&&e)e.innerHTML='<b>'+q.ico+' '+esc(q.nom)+'</b> : '+esc(q.txt)},4.4)}
    else if(tab==='ps'){h+=PREMIERS_SECOURS.map(p=>carte('<b>'+esc(p.t)+'</b><br>'+esc(p.txt))).join('')+carte('⚠ Ce jeu est une introduction. Les vrais gestes de premiers secours s’apprennent avec une formation (Croix-Rouge, école).');panel(h)}
    else{h+=carte('Suis l’ambulance dans la ville (animation) :')+'<svg viewBox="0 0 300 120" style="width:100%;background:#243a47;border-radius:10px"><path d="M30 90 L110 40 L190 80 L270 30" stroke="#778" stroke-width="6" fill="none"/>'+[['École',30,90],['Marché',110,40],['Hôpital',190,80],['Maison',270,30]].map(p=>`<circle cx="${p[1]}" cy="${p[2]}" r="8" fill="#ffd54f"/><text x="${p[1]}" y="${p[2]+20}" font-size="10" fill="#fff" text-anchor="middle">${p[0]}</text>`).join('')+'<g id="ambsvg"><rect x="-12" y="-8" width="24" height="14" rx="3" fill="#fff"/><rect x="-12" y="-2" width="24" height="4" fill="#d6302b"/><circle cx="-6" cy="8" r="3" fill="#222"/><circle cx="6" cy="8" r="3" fill="#222"/><circle id="gyro" cx="0" cy="-10" r="3" fill="#2c7fb8"/></g></svg><p id="trTxt" style="font-size:13px"></p>'+btn('▶ Lancer le trajet','medTrajet()','#2e7d32');panel(h)}}
  function trajet(){
    const pts=[[30,90],[110,40],[190,80],[270,30]],g=document.getElementById('ambsvg'),tx=$('trTxt');let k=0,t=0;
    const labs=['De l’école vers le marché : '+TRANSPORT[0].txt,'Du marché vers l’hôpital : '+TRANSPORT[1].txt,'De l’hôpital vers la maison : '+TRANSPORT[2].txt];if(tx)tx.textContent=labs[0];bip(660,.2,.3);
    const tm=setInterval(()=>{t+=.02;if(t>=1){t=0;k++;if(k>=3){clearInterval(tm);if(tx)tx.textContent='✅ Trajet terminé : l’ambulance a transporté un patient fictif en sécurité.';return}if(tx)tx.textContent=labs[k];bip(660,.2,.3)}const a=pts[k],b=pts[k+1];if(g)g.setAttribute('transform',`translate(${a[0]+(b[0]-a[0])*t} ${a[1]+(b[1]-a[1])*t})`);const gy=document.getElementById('gyro');if(gy)gy.setAttribute('fill',Math.floor(t*20)%2?'#2c7fb8':'#d6302b')},40);timers.push(tm)}
  // ---------- progression, tenue, certificat
  function dossiers(){
    const m=MED();let h=`<h3 style="margin:2px 0">📋 Dossiers et progression</h3><p style="font-size:13px">Points d’expérience médicaux : <b>${m.pts}</b></p>`;
    h+=carte(`<b>🩺 Mission 1 : Ma première journée à l’hôpital</b> ${m.badges.medecin?'✅':''} (${nbCas()}/2 patients)<br>`+CAS.map(c=>`<small>${m.cas[c.id]?'✅':'▫️'} ${esc(c.nom)} : ${esc(c.motif)} ${m.cas[c.id]?'⭐'.repeat(m.cas[c.id].stars):''}</small>`).join('<br>')+'<br>'+btn('👥 Accueillir un patient','medCas()','#2e7d32'));
    h+=carte(`<b>🏥 Mission 2 : À la découverte des métiers</b> ${m.badges.metiers?'✅':''} (${nbSvc()}/4 services)<br>`+Object.keys(SERVICES).map(k=>`<small>${m.svc[k]?'✅':'▫️'} ${SERVICES[k].ico} ${esc(SERVICES[k].nom)}</small>`).join('<br>'));
    h+=`<p style="font-size:12px">🏅 Badges : ${m.badges.medecin?'🩺 Jeune médecin ':''}${m.badges.metiers?'🎓 Découverte des métiers médicaux':''}${!m.badges.medecin&&!m.badges.metiers?'à gagner':''}</p>`;
    if(m.cert)h+=btn('🎓 Mon certificat','medCert()','#6a1b9a');panel(h)}
  function certificat(){const m=MED();if(!m.cert){panel('<h3>🎓 Certificat</h3><p>Réussis la mission 2 (4 services) pour obtenir ton certificat de découverte des métiers médicaux.</p>');return}
    panel(`<div style="background:linear-gradient(#f2fbfb,#d2eeef);color:#0b4a4a;border:6px double #1b9aa8;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI MEDICAL CENTER</div><div style="font-size:44px">🏥</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE DÉCOUVERTE DES MÉTIERS MÉDICAUX</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune soignant')}</div><p style="font-size:13px">pour avoir découvert les services de l’hôpital et le travail des professionnels de santé, dans un jeu éducatif simulé.</p><p style="font-size:12px">Fait le ${esc(m.cert.date)} · Pr Kabongo</p><div style="font-size:26px">⚕️</div></div><p style="font-size:11px;opacity:.75">Simulation éducative : elle ne remplace pas une consultation médicale.</p>`)}
  function perso(){
    const m=MED(),L=m.look;
    panel(`<h3 style="margin:2px 0">🥼 Mon personnage</h3><b>Profession (tenue)</b><br>${LOOKS_PRO.map(p=>btn(esc(p.nom),`medPro('${p.id}')`,m.pro===p.id?'#ffd54f':'','color:'+(m.pro===p.id?'#222':'#fff'))).join('')}<br><b>Personnage</b><br>${btn('👩 Femme',"medLook('s','f')",L.s==='f'?'#ffd54f':'','color:'+(L.s==='f'?'#222':'#fff'))}${btn('👨 Homme',"medLook('s','h')",L.s==='h'?'#ffd54f':'','color:'+(L.s==='h'?'#222':'#fff'))}<br><b>Peau</b><br>${[0,1,2,3,4,5].map(i=>`<button onclick="medLook('skin',${i})" style="width:34px;height:34px;border-radius:50%;margin:3px;border:3px solid ${L.skin===i?'#fff':'#0004'};background:${['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'][i]}"></button>`).join('')}<br><b>Coiffure</b><br>${[['Courtes','courtes'],['Tresses','tresses'],['Afro','afro'],['Chignon','chignon'],['Locks','locks']].map(([n,v])=>btn(n,`medLook('hair','${v}')`,L.hair===v?'#ffd54f':'','color:'+(L.hair===v?'#222':'#fff'))).join('')}`)}
  // ---------- MISSION 1 : cas cliniques
  function choisirCas(){
    const m=MED();panel('<h3 style="margin:2px 0">👥 Ma première journée à l’hôpital</h3><p style="font-size:13px">Accueille un patient fictif et mène la consultation. Réussis 2 patients pour valider la mission.</p>'+CAS.map(c=>carte(`<b>${esc(c.nom)}</b> · ${esc(c.motif)} ${m.cas[c.id]?'<span style="color:#7CFC00">✅ '+'⭐'.repeat(m.cas[c.id].stars)+'</span>':''}<br>${btn(m.cas[c.id]?'🔁 Revoir':'▶ Accueillir','medCasGo(\''+c.id+'\')','#2e7d32')}`)).join(''))}
  function casEtape(){
    const c=CAS.find(x=>x.id===C.id),e=C.et;let h=`<div style="display:flex;align-items:center"><b style="flex:1">🩺 ${esc(c.nom)} · ${esc(c.motif)}</b>${btn('✖','medFermerP()','#7b2d26','padding:5px 9px;margin:0')}</div><p style="font-size:11px;opacity:.8;margin:2px 0">Patient fictif · simulation éducative</p>`;
    if(e==='dossier'){h+=carte('<b>📋 Dossier médical (fictif)</b><br>'+esc(c.dossier))+carte('🧼 D’abord, on se lave les mains avant de recevoir un patient.')+btn('Commencer la consultation ▶','medCasNext()','#2e7d32')}
    else if(e==='questions'){h+=`<p style="font-size:13px"><b>Pose des questions simples</b> (${C.nq}/4 questions maximum). Il faut en poser au moins 3 utiles.</p>`+c.questions.map((q,i)=>`<button ${C.q[i]!==undefined||C.nq>=4?'disabled':''} onclick="medCasQ(${i})" style="display:block;width:100%;text-align:left;padding:9px;margin:3px 0;border-radius:10px;border:2px solid #fff3;background:${C.q[i]!==undefined?'#2a4a58':'#1b3440'};color:#fff;font-size:13px">${esc(q[0])}</button>${C.q[i]!==undefined?'<div style="background:#16303a;border-radius:8px;padding:6px;margin:0 0 4px 12px;font-size:13px">💬 '+esc(q[1])+'</div>':''}`).join('')+(C.utiles>=3?btn('Identifier les symptômes ▶','medCasNext()','#2e7d32'):'')}
    else if(e==='symptomes'){h+='<p style="font-size:13px"><b>Quels symptômes présente le patient ?</b> Coche ceux que tu as relevés :</p>'+c.symptomes.map((s,i)=>`<label style="display:block;padding:8px;margin:3px 0;background:#1b3440;border-radius:10px;font-size:14px"><input type="checkbox" ${C.sym[s]?'checked':''} onchange="medCasSym('${s.replace(/'/g,"\\'")}')"> ${esc(s)}</label>`).join('')+btn('Valider ▶','medCasSymOk()','#2e7d32')+(C.msg?carte(C.msg):'')}
    else if(e==='mesures'){const done=Object.keys(C.mes).length;h+=`<p style="font-size:13px"><b>Mesure et examine.</b> Utilise les 4 instruments puis le stéthoscope (${done}/5).</p>`+btn('🌡 Température','medCasMes(\'temp\')')+btn('🩸 Tension (simulée)','medCasMes(\'tension\')')+btn('🫁 Oxymètre / pouls','medCasMes(\'pouls\')')+btn('🩺 Stéthoscope','medCasMes(\'stetho\')')+btn('👄 Regarder la gorge','medCasMes(\'gorge\')')+Object.keys(C.mes).map(k=>carte(C.mes[k])).join('')+(done>=5?btn('Choisir un examen ▶','medCasNext()','#2e7d32'):'')}
    else if(e==='exam'){h+='<p style="font-size:13px"><b>Quel examen complémentaire est approprié ?</b> (Parfois, aucun n’est nécessaire.)</p>'+c.exam.choix.map(([l,v])=>btn(esc(l),`medCasEx('${v}')`)).join('')+(C.msg?carte(C.msg):'')}
    else if(e==='rapport'){h+=carte('<b>📄 Compte rendu (fictif)</b><br>'+esc(c.exam.rapport))+btn('Proposer une conduite ▶','medCasNext()','#2e7d32')}
    else if(e==='conduite'){h+='<p style="font-size:13px"><b>Que conseilles-tu ?</b> (Rappel : on ne prescrit jamais de médicament dans ce jeu.)</p>'+c.conduite.map(([l,v],i)=>btn(esc(l),`medCasCo(${i})`)).join('')+(C.msg?carte(C.msg):'')}
    else{const stars=C.err<=1?3:C.err<=3?2:1;h+=`<div style="text-align:center"><div style="font-size:36px">🎉</div><h3>Patient pris en charge !</h3><div style="font-size:28px">${'⭐'.repeat(stars)}</div></div>${carte('<b>Le rôle du médecin :</b> '+esc(c.role))}${carte('⚕️ <b>Important :</b> dans la vraie vie, on consulte toujours un professionnel de santé quand on est malade. Ce jeu est une simulation.')}`+btn('👥 Autre patient','medCas()','#2e7d32')+btn('📋 Dossiers','medDossiers()')}
    panel(h,true)}
  function casFin(){
    const c=CAS.find(x=>x.id===C.id),m=MED(),stars=C.err<=1?3:C.err<=3?2:1,prem=!m.cas[c.id];
    m.cas[c.id]={fait:true,stars:Math.max(stars,(m.cas[c.id]||{}).stars||0),err:C.err};
    if(prem){m.pts+=10;A().pieces+=4;A().xp+=6;refreshHud()}
    let extra='';
    if(!m.badges.medecin&&nbCas()>=2){m.badges.medecin=true;const avg=Math.round(CAS.filter(x=>m.cas[x.id]).reduce((t,x)=>t+m.cas[x.id].stars,0)/nbCas());A().done['met:h1']=true;A().stars['met:h1']=Math.max(A().stars['met:h1']||0,avg);A().pieces+=12;A().xp+=15;refreshHud();extra=true}
    const t=A().tal||(A().tal={});t.sante=(t.sante||0)+8;save();C.et='fin';casEtape();SFX.win&&SFX.win();
    if(extra)setTimeout(()=>{toast('🏅 Badge de jeune médecin ! Mission 1 réussie (+12 🪙)')},400)}
  // ---------- MISSION 2 : services
  function service(id){
    const s=SERVICES[id],m=MED();C={t:'svc',id,i:0,err:0,sel:{}};
    let h=`<h3 style="margin:2px 0">${s.ico} ${esc(s.nom)}</h3>${carte('<b>Le métier :</b> '+esc(s.role))}<p style="font-size:12px;opacity:.85">Activité pédagogique (simulée)${m.svc[id]?' · ✅ déjà réussie':''}</p>`;
    h+=btn('▶ Faire l’activité','medSvcGo()','#2e7d32','font-size:15px');panel(h)}
  function svcRender(){
    const s=SERVICES[C.id];let h=`<div style="display:flex;align-items:center"><b style="flex:1">${s.ico} ${esc(s.nom)}</b>${btn('✖','medFermerP()','#7b2d26','padding:5px 9px;margin:0')}</div>`;
    if(C.id==='labo'||C.id==='pediatrie'){const q=s.items[C.i];if(!q){return svcFin()}h+=`<p style="font-size:14px"><b>${esc(q.q)}</b></p>`+q.c.map((x,i)=>`<button ${C.rep!==undefined&&C.rep===q.a?'disabled':''} onclick="medSvcQ(${i})" style="display:block;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:10px;border:2px solid #fff3;background:${C.rep===undefined?'#1b3440':(i===q.a?'#2e7d32':i===C.rep?'#b23a3a':'#1b3440')};color:#fff;font-size:14px">${esc(x)}</button>`).join('')+(C.rep!==undefined?(C.rep===q.a?feedback(true,q.exp)+btn('Suivant ▶','medSvcSuite()','#2e7d32'):feedback(false,'Réfléchis encore.')+btn('Réessayer','medSvcRetry()','#2c7fb8')):'')}
    else if(C.id==='radio'){const it=s.items[C.i];if(!it)return svcFin();h+=`<p style="font-size:13px">${esc(it.txt)} (image ${C.i+1}/2)</p><svg viewBox="0 0 200 180" style="width:100%;max-width:300px;background:#0a0f14;border-radius:10px" onclick="medRadio(event,this)"><rect x="92" y="10" width="16" height="70" rx="6" fill="#dfe9ee"/><rect x="92" y="95" width="16" height="70" rx="6" fill="#dfe9ee"/><circle cx="100" cy="88" r="10" fill="#dfe9ee"/>${it.os==='bras'?'<path d="M90 70 L110 76" stroke="#0a0f14" stroke-width="3"/>':'<path d="M88 120 L112 126" stroke="#0a0f14" stroke-width="3"/>'}${C.vu?'<circle cx="'+C.vu[0]+'" cy="'+C.vu[1]+'" r="12" fill="none" stroke="#7CFC00" stroke-width="3"/>':''}</svg>`+(C.msg?carte(C.msg):'')}
    else if(C.id==='pharma'){const it=s.items[C.i];if(!it)return svcFin();h+=`<p style="font-size:13px">Range ce médicament (fictif) au bon endroit : <b>${esc(it[0])}</b> (${C.i+1}/${s.items.length})</p>`+s.cats.map(c=>btn(c[1],`medPh('${c[0]}')`)).join('')+(C.msg?carte(C.msg):'')+carte('📅 On vérifie toujours la date limite, et on ne partage jamais ses médicaments.')}
    else if(C.id==='urgences'){const it=s.items[C.i];if(!it)return svcFin();h+=`<p style="font-size:13px"><b>Triage</b> (${C.i+1}/${s.items.length}) : ${esc(it[0])}</p><p style="font-size:12px">Quelle priorité ?</p>`+btn('🔴 Immédiate','medUr(\'rouge\')','#c0392b')+btn('🟠 Rapide','medUr(\'orange\')','#d35400')+btn('🟢 Peut attendre','medUr(\'vert\')','#2e7d32')+(C.msg?carte(C.msg):'')}
    else if(C.id==='bloc'){if(C.i<s.items.length){const it=s.items[C.i],opts=s.items.map(x=>x[1]).sort((a,b)=>((a.length*7+C.i)%5)-((b.length*7+C.i)%5));h+=`<p style="font-size:13px"><b>Matériel ${C.i+1}/${s.items.length} :</b> ${esc(it[0])} — à quoi sert-il ?</p>`+opts.slice(0,3).concat(it[1]).filter((x,i,a)=>a.indexOf(x)===i).slice(0,3).sort().map(x=>btn(esc(x),`medBl('${x.replace(/'/g,"\\'")}')`)).join('')+(C.msg?carte(C.msg):'')}
      else{const hy=s.hygiene,ord=C.ord||(C.ord=hy.map((x,i)=>i).sort(()=>Math.random()-.5));h+=`<p style="font-size:13px"><b>Hygiène avant l’opération :</b> remets les étapes dans l’ordre (${C.k||0}/${hy.length})</p>`+ord.map(k=>`<button ${k<(C.k||0)?'disabled':''} onclick="medBlH(${k})" style="display:block;width:100%;text-align:left;padding:9px;margin:3px 0;border-radius:10px;border:2px solid #fff3;background:${k<(C.k||0)?'#2e7d32':'#1b3440'};color:#fff;font-size:14px">${esc(hy[k])}</button>`).join('')}}
    panel(h,true)}
  function svcFin(){
    const m=MED(),id=C.id,s=SERVICES[id],prem=!m.svc[id];m.svc[id]={fait:true,err:C.err};let extra='';
    if(prem){m.pts+=8;A().pieces+=3;A().xp+=5;refreshHud()}
    if(!m.badges.metiers&&nbSvc()>=4){m.badges.metiers=true;m.cert={date:new Date().toLocaleDateString('fr-FR')};A().done['met:h2']=true;A().stars['met:h2']=Math.max(A().stars['met:h2']||0,3);A().pieces+=15;A().xp+=15;refreshHud();extra='<p>🎓 <b>Mission 2 réussie !</b> Certificat de découverte des métiers médicaux obtenu (+15 🪙)</p>'+btn('🎓 Voir mon certificat','medCert()','#6a1b9a')}
    const t=A().tal||(A().tal={});t.sante=(t.sante||0)+6;save();SFX.win&&SFX.win();
    panel(`<div style="text-align:center"><div style="font-size:40px">${s.ico}🎉</div><h3>Activité réussie !</h3><p style="font-size:13px">${prem?'+8 points · +3 🪙':'Déjà validée'}</p>${extra}</div>`+btn('↩ Retour','medFermerP()')+btn('📋 Dossiers','medDossiers()'),true)}
  // ---------- actions
  const actions={
    medOuvrir:()=>ouvrir(),medQuitter:()=>quitter(),medFermerP:()=>fermerP(),medInteragir:()=>interagir(),medExaminer:()=>examiner(),medDossiers:()=>dossiers(),medAscenseur:()=>ascenseur(),
    medRep:nx=>{if(nx==='__cas'){choisirCas();return}if(!nx){fermerP();return}noeud(dialG,nx)},
    medAller:i=>{fermerP();if(lieu!=='hopital')charger('hopital');mot.placer(ROOMS[i][1],ROOMS[i][2]);msg('📍 '+ROOMS[i][0],2500)},
    medInstr:k=>{const e=$('instrinfo');if(!e)return;if(k==='stetho')battements(72,6);e.innerHTML=carte('<b>'+esc(INSTRUMENTS.find(i=>i[0]===k)[2])+' :</b> '+esc(INFO[k]))},
    medHyg:k=>{if(k===C.i){C.i++;SFX.ok&&SFX.ok()}else{SFX.ko&&SFX.ko()}hygRender()},
    medZoom:d=>{if(viewer)viewer.zoom(d*.8)},medAmb:t=>ambulance(t),medTrajet:()=>trajet(),
    medCas:()=>choisirCas(),medCasGo:id=>{C={t:'cas',id,et:'dossier',q:{},nq:0,utiles:0,sym:{},mes:{},err:0,msg:''};casEtape();parler('Un patient fictif arrive.')},
    medCasNext:()=>{const o=['dossier','questions','symptomes','mesures','exam','rapport','conduite'],i=o.indexOf(C.et);C.msg='';C.et=o[i+1];casEtape()},
    medCasQ:i=>{const c=CAS.find(x=>x.id===C.id);C.q[i]=1;C.nq++;if(c.questions[i][2])C.utiles++;casEtape()},
    medCasSym:s=>{C.sym[s]=!C.sym[s]},
    medCasSymOk:()=>{const c=CAS.find(x=>x.id===C.id),sel=Object.keys(C.sym).filter(k=>C.sym[k]),ok=sel.length===c.bons.length&&c.bons.every(b=>sel.includes(b));if(ok){SFX.ok&&SFX.ok();C.et='mesures';C.msg='';casEtape()}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ Relis ce que dit le patient et ce que tu as demandé : ne garde que les signes réellement présents.';casEtape()}},
    medCasMes:k=>{const c=CAS.find(x=>x.id===C.id);let t='';if(k==='temp')t='🌡 Température : '+c.mesures.temp;else if(k==='tension')t='🩸 Tension (simulée) : '+c.mesures.tension;else if(k==='pouls')t='🫁 Oxymètre : '+c.mesures.oxy+' · pouls : '+c.mesures.pouls;else if(k==='stetho'){t='🩺 Stéthoscope : '+c.coeur+' '+c.poumons;battements(parseInt(c.mesures.pouls)||80,6)}else t='👄 Gorge : '+c.gorge;C.mes[k]=t;SFX.coin&&SFX.coin();casEtape()},
    medCasEx:v=>{const c=CAS.find(x=>x.id===C.id);if(v===c.exam.bon){SFX.ok&&SFX.ok();C.et='rapport';casEtape()}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ '+(v==='aucun'?'Dans ce cas, un examen est utile pour mieux comprendre.':'Cet examen n’est pas le plus adapté à ce patient : il ne faut pas faire d’examens inutiles.');casEtape()}},
    medCasCo:i=>{const c=CAS.find(x=>x.id===C.id),q=c.conduite[i];if(q[1]==='ok'){SFX.ok&&SFX.ok();C.msg='';C.fin=true;casFin()}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ '+q[2];casEtape()}},
    medSvc:id=>service(id),medSvcGo:()=>{svcRender()},
    medSvcQ:i=>{const q=SERVICES[C.id].items[C.i];if(C.rep!==undefined&&C.rep===q.a)return;C.rep=i;if(i!==q.a)C.err++;SFX[i===q.a?'ok':'ko']&&SFX[i===q.a?'ok':'ko']();svcRender()},
    medSvcRetry:()=>{C.rep=undefined;svcRender()},medSvcSuite:()=>{C.i++;C.rep=undefined;svcRender()},
    medRadio:(e,el)=>{const it=SERVICES.radio.items[C.i],b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width*200,y=(e.clientY-b.top)/b.height*180;C.vu=[x,y];if(Math.hypot(x-it.fracture.x,y-it.fracture.y)<it.fracture.r+8){SFX.ok&&SFX.ok();C.i++;C.vu=null;C.msg='✅ Bien vu : la ligne sombre est la fracture (image fictive).'}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ Cherche une fine ligne sombre qui coupe l’os.'}svcRender()},
    medPh:c=>{const it=SERVICES.pharma.items[C.i];if(it[1]===c){SFX.ok&&SFX.ok();C.i++;C.msg=''}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ Ce n’est pas le bon rayon : pense à la forme du médicament.'}svcRender()},
    medUr:p=>{const it=SERVICES.urgences.items[C.i];if(it[1]===p){SFX.ok&&SFX.ok();C.i++;C.msg=''}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ Pense au risque : ce qui met la vie en danger passe en premier.'}svcRender()},
    medBl:x=>{const it=SERVICES.bloc.items[C.i];if(it[1]===x){SFX.ok&&SFX.ok();C.i++;C.msg=''}else{C.err++;SFX.ko&&SFX.ko();C.msg='❌ Ce n’est pas son rôle.'}svcRender()},
    medBlH:k=>{if(k===(C.k||0)){C.k=(C.k||0)+1;SFX.ok&&SFX.ok();if(C.k>=SERVICES.bloc.hygiene.length){svcFin();return}}else{C.err++;SFX.ko&&SFX.ko()}svcRender()},
    medPerso:()=>perso(),medCert:()=>certificat(),
    medPro:id=>{MED().pro=id;save();mot.setLook(lookPro());perso()},
    medLook:(k,v)=>{MED().look[k]=v;save();mot.setLook(lookPro());perso()}
  };
  return {actions,ouvrir,fermer,MED,estOuvert:()=>!!ov,mot:()=>mot};
}
