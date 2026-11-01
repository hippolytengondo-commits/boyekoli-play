// BOYEKOLI FASHION STUDIO : stylisme, couture, coiffure, maquillage fictif, essayage, studio photo, défilé et portfolio.
// Mannequin 3D procédural, tissus peints par programme, missions évaluées. Aucun contenu en ligne, aucune donnée personnelle.
import * as THREE from 'three';
import {MODELES,COULEURS,TISSUS,MOTIFS,ACCESS,COIFFURES,PEAUX,COULEURS_CHEVEUX,LEVRES,YEUX,OUTILS,ETAPES,CULTURE,MISSIONS} from './fashion/data.js';

export function creerMode(D){
  const {G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const FS=()=>{const a=A();if(!a.mode2)a.mode2={look:{sexe:'f',skin:3,corp:'moyen',coiff:'tresses',long:2,ch:'#111111',lev:'#b5314a',yeux:'#3b2a1a',maq:false},crea:{modele:'robe',couleur:'#c0392b',tissu:'wax',motif:'aucun',boutons:false,poches:false,ceinture:false,acc:'aucun'},port:[],photos:[],done:{},stars:{},coiffOk:false,defile:{n:0,best:0},cert:null,culture:false};const m=a.mode2;['done','stars'].forEach(k=>{if(!m[k])m[k]={}});if(!m.port)m.port=[];if(!m.photos)m.photos=[];if(!m.defile)m.defile={n:0,best:0};return m};
  let ov=null,R=null,sc=null,cam=null,raf=0,pop=null,tab='accueil',body=null,stage=null,backdrop=null,runway=null,sel=null,ptr=new Map(),cs={yaw:.3,dist:3.6,auto:true,y:.95},pose='face',bg='blanc',C=null,DF=null,confirm=-1,couture=null,sautSave=0;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg2,st)=>`<button onclick="${oc}" style="padding:7px 10px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg2||'#4a3558'};color:${bg2==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const on=(c,t,oc)=>btn(t,oc,c?'#ffd54f':'');
  const sec=t=>`<div style="font-size:12px;opacity:.75;margin:5px 0 1px">${t}</div>`;
  const sw=(list,cur,fn,r)=>list.map(c=>`<button onclick="${fn}('${c}')" style="width:30px;height:30px;margin:2px;border-radius:${r||'50%'};border:3px solid ${cur===c?'#fff':'#0006'};background:${c}"></button>`).join('');
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>save(),400)};
  // ---------- tissus
  const TC={};
  function tissu(tis,col,motif){
    const k=tis+col+motif;if(TC[k])return TC[k];const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=col;g.fillRect(0,0,128,128);
    if(tis==='wax'){const p=['#f4c20d','#d6302b','#1b6ca8','#ffffff'];for(let y=0;y<4;y++)for(let x=0;x<4;x++){const cx=x*32+16+(y%2)*8,cy=y*32+16;g.fillStyle=p[(x+y)%4];g.beginPath();g.arc(cx,cy,12,0,7);g.fill();g.fillStyle=col;g.beginPath();g.arc(cx,cy,7,0,7);g.fill();g.fillStyle=p[(x+y+2)%4];g.beginPath();g.arc(cx,cy,3,0,7);g.fill()}}
    else if(tis==='jean'){g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;for(let i=-128;i<128;i+=4){g.beginPath();g.moveTo(i,0);g.lineTo(i+128,128);g.stroke()}}
    else if(tis==='bazin'){g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=2;for(let i=0;i<128;i+=8){g.beginPath();g.moveTo(i,0);g.lineTo(i,128);g.stroke()}g.fillStyle='rgba(255,255,255,.12)';for(let y=8;y<128;y+=32)for(let x=8;x<128;x+=32){g.beginPath();g.arc(x,y,3,0,7);g.fill()}}
    else if(tis==='soie'){const gr=g.createLinearGradient(0,0,128,128);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(.5,'rgba(0,0,0,.08)');gr.addColorStop(1,'rgba(255,255,255,.3)');g.fillStyle=gr;g.fillRect(0,0,128,128)}
    g.fillStyle='rgba(255,255,255,.55)';g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=5;
    if(motif==='rayures')for(let x=0;x<128;x+=24)g.fillRect(x,0,8,128);
    else if(motif==='pois')for(let y=12;y<128;y+=32)for(let x=12+(y%64?16:0);x<128;x+=32){g.beginPath();g.arc(x,y,7,0,7);g.fill()}
    else if(motif==='losanges')for(let y=0;y<128;y+=32)for(let x=0;x<128;x+=32){g.beginPath();g.moveTo(x+16,y+4);g.lineTo(x+28,y+16);g.lineTo(x+16,y+28);g.lineTo(x+4,y+16);g.closePath();g.stroke()}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);t.colorSpace=THREE.SRGBColorSpace;return TC[k]=t}
  function fab(cr,solid){const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:cr.tissu==='soie'||cr.tissu==='bazin'?.3:.85,metalness:cr.tissu==='bazin'?.12:0,side:THREE.DoubleSide});if(solid){m.color.set(solid);return m}m.map=tissu(cr.tissu,cr.couleur,cr.motif);return m}
  const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.7:r});
  function mesh(g,geo,m,x,y,z){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o}
  const cyl=(a,b,h,s)=>new THREE.CylinderGeometry(a,b,h,s||16);
  // ---------- mannequin
  function construireMannequin(L,cr){
    const g=new THREE.Group(),k={fin:1,moyen:1.1,rond:1.28}[L.corp]||1.1,fem=L.sexe==='f',kt=fem?k:k*.98,skin=M(PEAUX[L.skin]||PEAUX[2],.55),mdl=MODELES.find(m=>m.id===cr.modele)||MODELES[0];
    const bas=mdl.bas==='auto'?(fem?'jupe':'pantalon'):mdl.bas,haut=cr.tissu&&mdl.hautBlanc?fab(cr,mdl.id==='pagne'?'#f4e9d8':'#f6f6f6'):fab(cr),mbas=mdl.id==='sport'?M('#222222'):mdl.id==='scolaire'?fab({tissu:'coton',couleur:cr.couleur,motif:'aucun'}):fab(cr);
    mesh(g,cyl(.17*kt,.15*kt,.5),skin,0,1.2,0);mesh(g,cyl(.04,.045,.1),skin,0,1.5,0);
    const hd=mesh(g,new THREE.SphereGeometry(.13,20,16),skin,0,1.63,0);hd.scale.set(1,1.1,1);
    [-1,1].forEach(s=>{mesh(g,new THREE.SphereGeometry(.015,8,6),M('#fff'),s*.045,1.65,.118);mesh(g,new THREE.SphereGeometry(.011,8,6),M(L.yeux||'#3b2a1a'),s*.045,1.65,.128);mesh(g,new THREE.BoxGeometry(.03,.004,.004),M('#2a1a10'),s*.045,1.682,.125)});
    mesh(g,new THREE.SphereGeometry(.016,8,6),skin,0,1.62,.13);
    const lv=mesh(g,new THREE.SphereGeometry(1,10,6),M(L.maq?L.lev:'#8a4a4a'),0,1.585,.123);lv.scale.set(.028,.009,.012);
    if(L.maq){[-1,1].forEach(s=>{const e=mesh(g,new THREE.SphereGeometry(1,10,6),M(L.yeux||'#8a3a8a'),s*.045,1.672,.12);e.scale.set(.03,.008,.012)});[-1,1].forEach(s=>{const f=mesh(g,new THREE.SphereGeometry(1,10,6),M('#d9606f'),s*.075,1.6,.1);f.scale.set(.025,.02,.01)})}
    // jambes (pivots) et vêtements du bas
    const legs=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*.09*kt,.95,0);g.add(p);mesh(p,cyl(.07*kt,.045,.9),skin,0,-.45,0);mesh(p,new THREE.BoxGeometry(.08,.05,.16),M('#2a2a2a'),0,-.92,.03);
      if(bas==='pantalon')mesh(p,cyl(.082*kt,.068*kt,.92),mbas,0,-.46,0);else if(bas==='short')mesh(p,cyl(.084*kt,.075*kt,.34),mbas,0,-.17,0);return p});
    const arms=[-1,1].map(s=>{const p=new THREE.Group();p.position.set(s*(.17*kt+.05),1.43,0);p.rotation.z=s*.12;g.add(p);mesh(p,cyl(.04,.035,.6),skin,0,-.3,0);mesh(p,new THREE.SphereGeometry(.04,8,6),skin,0,-.63,0);
      const man=mdl.manches,sl=(mdl.veste&&!0)?mbas:haut;
      if(man==='courtes')mesh(p,cyl(.058,.052,.25),sl,0,-.115,0);else if(man==='longues')mesh(p,cyl(.058,.048,.6),sl,0,-.3,0);else if(man==='larges')mesh(p,cyl(.07,.15,.5),sl,0,-.25,0);return p});
    // haut
    if(mdl.bas==='boubou')mesh(g,cyl(.19*kt,.42*kt,1.4),haut,0,.77,0);
    else{const sh=mesh(g,cyl(.178*kt,.158*kt,.5),mdl.veste?mbas:haut,0,1.2,0);
      if(mdl.veste){mesh(g,new THREE.BoxGeometry(.09,.32,.01),M('#f6f6f6'),0,1.28,.17*kt+.002);arms.forEach(a=>{a.children.forEach(c=>{if(c.material===mbas)c.material=mbas})})}
      if(mdl.id==='scolaire')mesh(g,cyl(.06,.06,.03),M('#f6f6f6'),0,1.47,0)}
    if(bas==='jupe')mesh(g,cyl(.17*kt,.3*kt,.4),mbas,0,.76,0);
    else if(bas==='robe')mesh(g,cyl(.17*kt,.34*kt,.6),haut,0,.65,0);
    else if(bas==='robeL')mesh(g,cyl(.17*kt,.46*kt,.9),haut,0,.5,0);
    else if(bas==='pagne')mesh(g,cyl(.18*kt,.36*kt,.78),mbas,0,.57,0);
    if(cr.ceinture)mesh(g,cyl(.175*kt+.02,.175*kt+.02,.05),M('#3b2a1a'),0,1.0,0);
    if(cr.boutons)for(let i=0;i<4;i++)mesh(g,new THREE.SphereGeometry(.012,6,6),M('#f2f2f2'),0,1.42-i*.1,.17*kt+.012);
    if(cr.poches)[-1,1].forEach(s=>mesh(g,new THREE.BoxGeometry(.07,.08,.012),M('#333'),s*.12*kt,.88,.2*kt+.012));
    // accessoires
    if(cr.acc==='collier'){const t=mesh(g,new THREE.TorusGeometry(.085,.012,8,20),M('#e8c04a',.3),0,1.46,0);t.rotation.x=Math.PI/2}
    if(cr.acc==='sac')mesh(arms[0],new THREE.BoxGeometry(.14,.18,.06),M('#8a5a2b'),0,-.72,0);
    if(cr.acc==='chapeau'&&L.coiff!=='gele'){mesh(g,cyl(.22,.22,.02),M(cr.couleur),0,1.74,0);mesh(g,cyl(.12,.12,.12),M(cr.couleur),0,1.8,0)}
    if(cr.acc==='lunettes'){[-1,1].forEach(s=>{const t=mesh(g,new THREE.TorusGeometry(.03,.005,6,14),M('#111'),s*.045,1.65,.135)});mesh(g,new THREE.BoxGeometry(.03,.005,.005),M('#111'),0,1.65,.138)}
    // cheveux
    const hm=M(L.ch||'#111111',.8),H=new THREE.Group();H.position.set(0,1.63,0);g.add(H);
    const cap=(r)=>{const c=new THREE.Mesh(new THREE.SphereGeometry(r||.14,16,12,0,Math.PI*2,0,Math.PI*.58),hm);c.position.y=.01;c.scale.y=1.08;H.add(c)};
    const brins=(n,len,r,a0,a1)=>{for(let i=0;i<n;i++){const t=a0+(a1-a0)*(n>1?i/(n-1):0),l=len*(.8+.3*((i*37)%7)/7),s=new THREE.Mesh(cyl(r,r*.8,l,6),hm);s.position.set(Math.sin(t)*.13,-.03-l/2+.04,Math.cos(t)*.13);H.add(s)}};
    const cf=L.coiff,lg=[.25,.5,.8][(L.long||2)-1];
    if(cf==='courtes')cap(.14);
    else if(cf==='afro'){cap(.14);mesh(H,new THREE.SphereGeometry(.15+.03*(L.long||2),16,12),hm,0,.09,-.09)}
    else if(cf==='tresses'){cap(.14);brins(18,lg,.012,Math.PI*.55,Math.PI*1.45);brins(4,lg*.7,.012,-Math.PI*.3,Math.PI*.3)}
    else if(cf==='locks'){cap(.14);brins(12,lg*1.1,.022,Math.PI*.5,Math.PI*1.5)}
    else if(cf==='chignon'){cap(.14);mesh(H,new THREE.SphereGeometry(.07+.01*(L.long||2),12,10),hm,0,.15,-.06)}
    else if(cf==='noeuds'){cap(.14);for(let i=0;i<9;i++){const t=i/9*Math.PI*2,ph=.5+.25*(i%2);mesh(H,new THREE.SphereGeometry(.04,8,6),hm,Math.sin(t)*.12*Math.sin(ph+.5),.12*Math.cos(ph),Math.cos(t)*.12*Math.sin(ph+.5))}}
    else if(cf==='gele'){const w=M(cr.couleur||'#e84393',.6),p=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),w);p.scale.set(.2,.12,.22);p.position.set(0,.1,-.02);H.add(p);const q=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),w);q.scale.set(.1,.09,.1);q.position.set(.1,.2,.0);H.add(q)}
    g.userData={legs,arms};return g}
  function poser(g,p){const a=g.userData.arms;if(!a)return;a[0].rotation.z=-.12;a[1].rotation.z=.12;a[0].rotation.x=a[1].rotation.x=0;g.rotation.y=0;
    if(p==='hanche'){a[1].rotation.z=.9;a[1].rotation.x=0;a[0].rotation.z=-.15}else if(p==='trois'){g.rotation.y=.6;a[0].rotation.z=-.3}else if(p==='saluer'){a[1].rotation.z=2.4}}
  function bgTex(kind){
    const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');
    if(kind==='wax'){g.fillStyle='#b5314a';g.fillRect(0,0,256,256);const p=['#f4c20d','#1b3a6b','#ffffff'];for(let y=0;y<8;y++)for(let x=0;x<8;x++){g.fillStyle=p[(x+y)%3];g.beginPath();g.arc(x*32+16,y*32+16,11,0,7);g.fill();g.fillStyle='#b5314a';g.beginPath();g.arc(x*32+16,y*32+16,6,0,7);g.fill()}}
    else if(kind==='ville'){const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#27365a');gr.addColorStop(1,'#d58a5a');g.fillStyle=gr;g.fillRect(0,0,256,256);g.fillStyle='#14182b';for(let i=0;i<9;i++){const h=60+(i*53)%110;g.fillRect(i*30,256-h,26,h);g.fillStyle='#ffd77a';for(let j=0;j<h/18;j++)g.fillRect(i*30+4,256-h+6+j*16,6,6);g.fillStyle='#14182b'}}
    else if(kind==='nature'){const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#9fd3f5');gr.addColorStop(.6,'#cfeed2');gr.addColorStop(1,'#4f9a4a');g.fillStyle=gr;g.fillRect(0,0,256,256);g.fillStyle='#2f7a36';for(let i=0;i<6;i++){g.beginPath();g.arc(i*50+20,190,40,0,7);g.fill()}}
    else{g.fillStyle='#f2f2f2';g.fillRect(0,0,256,256)}
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
  function reconstruire(){
    const m=FS();if(!sc)return;if(body)sc.remove(body);const keep=body?body.position.clone():null;body=construireMannequin(m.look,m.crea);if(keep)body.position.copy(keep);if(!DF)poser(body,pose);sc.add(body)}
  function decor(){
    if(backdrop)sc.remove(backdrop);if(stage)sc.remove(stage);if(runway)sc.remove(runway);backdrop=stage=runway=null;
    if(DF){runway=new THREE.Group();const f=new THREE.Mesh(new THREE.BoxGeometry(2,.1,16),M('#222a38'));f.position.set(0,-.05,-3);runway.add(f);const e=new THREE.Mesh(new THREE.BoxGeometry(2.1,.02,16.1),M('#ffd54f'));e.position.set(0,-.09,-3);runway.add(e);
      for(let i=0;i<10;i++)[-1,1].forEach(s=>{const sp=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),M(['#c0392b','#2c7fb8','#7b3fa0','#2e7d32'][(i+(s>0?1:0))%4]));sp.position.set(s*(1.7+(i%2)*.7),.25,-8+i*1.3);runway.add(sp)});
      const wall=new THREE.Mesh(new THREE.PlaneGeometry(14,5),new THREE.MeshBasicMaterial({map:bgTex('ville')}));wall.position.set(0,2.5,-11);runway.add(wall);sc.add(runway);sc.background=new THREE.Color('#0d1020');return}
    stage=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.25,.1,32),M('#3a3f55'));stage.position.y=-.05;sc.add(stage);
    backdrop=new THREE.Mesh(new THREE.PlaneGeometry(10,6),new THREE.MeshBasicMaterial({map:bgTex(bg)}));backdrop.position.set(0,2.5,-3);sc.add(backdrop);sc.background=new THREE.Color('#161226')}
  // ---------- boucle et entrées
  function boucle(){
    raf=requestAnimationFrame(boucle);if(!R||!body)return;const t=performance.now(),dt=Math.min(.05,(t-(boucle.t||t))/1000);boucle.t=t;
    if(DF)tickDefile(dt);
    else{if(cs.auto)cs.yaw+=dt*.35;cam.position.set(Math.sin(cs.yaw)*cs.dist,cs.y+.4,Math.cos(cs.yaw)*cs.dist);cam.lookAt(0,cs.y,0)}
    R.render(sc,cam)}
  function taille(){const c=$('fs3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}}
  function entrees(){
    const cv=R.domElement;cv.style.touchAction='none';
    cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});cs.auto=false});
    cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p||DF)return;if(ptr.size===2){const a=[...ptr.values()],d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptr.values()],d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);cs.dist=Math.max(1.8,Math.min(7,cs.dist-(d1-d0)*.02));return}cs.yaw-=(e.clientX-p.x)*.012;p.x=e.clientX;p.y=e.clientY});
    ['pointerup','pointercancel'].forEach(n=>cv.addEventListener(n,e=>ptr.delete(e.pointerId)));
    cv.addEventListener('wheel',e=>{e.preventDefault();cs.dist=Math.max(1.8,Math.min(7,cs.dist+e.deltaY*.004))},{passive:false})}
  // ---------- ouverture
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);FS();
    ov=document.createElement('div');ov.id='fsov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#161226;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#6a1b9a,#e84393);flex:0 0 auto"><b style="flex:1;font-size:13px">👗 BOYEKOLI FASHION STUDIO</b>${btn('✖','fsQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div><div id="fs3d" style="flex:1;position:relative;min-height:0"><div id="fsmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(10,10,20,.9);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div></div>
    <div id="fstabs" style="display:flex;overflow-x:auto;background:#100c1c;flex:0 0 auto"></div><div id="fssheet" style="height:40vh;overflow:auto;padding:7px 9px;background:#241a38;flex:0 0 auto"></div><div id="fsover" style="position:absolute;inset:0;background:rgba(14,10,26,.97);display:none;flex-direction:column;padding:10px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low,preserveDrawingBuffer:true});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('fs3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(42,1,.1,60);sc.add(new THREE.HemisphereLight('#ffffff','#6a5a8a',1.4));const dl=new THREE.DirectionalLight('#fff4e0',1.5);dl.position.set(2,4,4);sc.add(dl);const dl2=new THREE.DirectionalLight('#ffd0f0',.5);dl2.position.set(-3,2,2);sc.add(dl2);
    setTimeout(taille,60);window.addEventListener('resize',taille);entrees();DF=null;tab='accueil';bg='blanc';pose='face';cs.auto=true;cs.dist=3.6;cs.y=.95;decor();reconstruire();rendTabs();rend();
    try{history.pushState({fs:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);raf=requestAnimationFrame(boucle);
    parler('Bienvenue au Fashion Studio.')}
  function fermer(){if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',taille);try{R.dispose()}catch(e){}ov.remove();ov=null;R=sc=body=null;ptr.clear();DF=null;C=null;couture=null;save()}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('fsover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('fsover');if(o){o.style.display='none';o.innerHTML=''}}
  function msg(t,ms){const m=$('fsmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3000)}
  const TABS=[['accueil','🏠 Accueil'],['style','🧵 Stylisme'],['couture','✂️ Couture'],['coiff','💇 Coiffure'],['maq','💄 Maquillage'],['mann','👤 Mannequin'],['photo','📸 Photo'],['defile','👗 Défilé'],['port','🗂 Portfolio'],['miss','🎯 Missions']];
  function rendTabs(){$('fstabs').innerHTML=TABS.map(t=>`<button onclick="fsTab('${t[0]}')" style="flex:0 0 auto;padding:9px 10px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#d6cbe8'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  function setTab(t){if(DF&&t!=='defile')finDefile(true);tab=t;couture=t==='couture'?couture:null;rendTabs();rend()}
  function rend(){
    const s=$('fssheet');if(!s)return;const m=FS(),cr=m.crea,L=m.look;let h='';
    if(tab==='accueil'){h=`<b style="font-size:15px">👗 Bienvenue au Fashion Studio</b><p style="font-size:13px">Conçois des tenues, couds-les, coiffe ton mannequin, prends des photos et présente ta collection sur le podium !</p><p style="font-size:12px;opacity:.85">Parcours : <b>Stylisme</b> → <b>Couture</b> (pour fabriquer la tenue) → <b>Portfolio</b> → <b>Défilé</b>. Les missions sont dans 🎯.</p>`+btn('📚 Culture de la mode (quiz)','fsCulture()','#2c7fb8')+btn('🎯 Mes missions','fsTab(\'miss\')','#2e7d32')+(m.cert?btn('🎓 Mon certificat','fsCert()','#6a1b9a'):'')+`<p style="font-size:12px;opacity:.8">Missions réussies : <b>${Object.keys(m.done).length}/7</b> (4 suffisent pour valider l’atelier).</p>`}
    else if(tab==='style'){
      h=sec('Modèle')+MODELES.map(x=>on(cr.modele===x.id,x.ico+' '+x.nom,`fsSet('modele','${x.id}')`)).join('')+sec('Couleur')+sw(COULEURS,cr.couleur,'fsCoul')+sec('Tissu')+TISSUS.map(t=>on(cr.tissu===t[0],t[1],`fsSet('tissu','${t[0]}')`)).join('')+sec('Motif')+MOTIFS.map(t=>on(cr.motif===t[0],t[1],`fsSet('motif','${t[0]}')`)).join('')+sec('Détails')+on(cr.boutons,'⚪ Boutons',"fsTog('boutons')")+on(cr.poches,'👖 Poches',"fsTog('poches')")+on(cr.ceinture,'➖ Ceinture',"fsTog('ceinture')")+sec('Accessoire')+ACCESS.map(t=>on(cr.acc===t[0],t[1],`fsSet('acc','${t[0]}')`)).join('')+'<p style="font-size:12px;opacity:.85">Quand ta tenue te plaît, va dans ✂️ Couture pour la fabriquer.</p>'}
    else if(tab==='couture'){h=coutureHtml()}
    else if(tab==='coiff'){
      h=sec('Coiffure')+COIFFURES.map(t=>on(L.coiff===t[0],t[1],`fsLook('coiff','${t[0]}')`)).join('')+sec('Longueur')+[[1,'Courte'],[2,'Moyenne'],[3,'Longue']].map(t=>on(L.long===t[0],t[1],`fsLook('long',${t[0]})`)).join('')+sec('Couleur')+sw(COULEURS_CHEVEUX,L.ch,'fsChev')+'<div style="margin-top:6px">'+btn('✅ Valider cette coiffure','fsCoiffOk()','#2e7d32')+'</div><p style="font-size:12px;opacity:.85">Les coiffures africaines (afro, tresses, locks, chignon, nœuds, gélé) demandent du soin : lavage, démêlage et hydratation.</p>'}
    else if(tab==='maq'){
      h=`<p style="font-size:12px;opacity:.85">Maquillage <b>fictif</b> pour mannequin virtuel (jeu de couleurs seulement).</p>`+on(L.maq,'💄 Activer',"fsLook('maq',true)")+on(!L.maq,'Sans maquillage',"fsLook('maq',false)")+sec('Lèvres')+sw(LEVRES,L.lev,'fsLev')+sec('Paupières')+sw(YEUX,L.yeux,'fsYeux')}
    else if(tab==='mann'){
      h=sec('Personnage')+on(L.sexe==='f','👩 Femme',"fsLook('sexe','f')")+on(L.sexe==='h','👨 Homme',"fsLook('sexe','h')")+sec('Carnation')+sw(PEAUX,PEAUX[L.skin],'fsPeau')+sec('Morphologie')+[['fin','Fine'],['moyen','Moyenne'],['rond','Pleine']].map(t=>on(L.corp===t[0],t[1],`fsLook('corp','${t[0]}')`)).join('')+'<p style="font-size:12px;opacity:.85">Essayage : ta tenue s’adapte à chaque morphologie. Toutes les silhouettes sont belles.</p>'}
    else if(tab==='photo'){
      h=sec('Fond')+[['blanc','Studio blanc'],['wax','Fond wax'],['ville','Ville'],['nature','Nature']].map(t=>on(bg===t[0],t[1],`fsBg('${t[0]}')`)).join('')+sec('Pose')+[['face','De face'],['trois','Trois-quarts'],['hanche','Main sur la hanche'],['saluer','Salut']].map(t=>on(pose===t[0],t[1],`fsPose('${t[0]}')`)).join('')+'<div>'+btn('📸 Prendre la photo','fsPhoto()','#2e7d32')+'</div>'+(m.photos.length?sec('Mes photos ('+m.photos.length+')')+'<div style="display:flex;overflow-x:auto">'+m.photos.map((p,i)=>`<div style="flex:0 0 auto;margin-right:6px"><img src="${p.img}" style="height:90px;border-radius:8px"><br><button onclick="fsSuppPh(${i})" style="font-size:11px">🗑</button></div>`).join('')+'</div>':'')}
    else if(tab==='defile'){h=defileHtml()}
    else if(tab==='port'){
      h=`<p style="font-size:12px">${m.port.length}/8 créations cousues</p>`+m.port.map((p,i)=>`<div style="display:flex;align-items:center;background:#16102a;border-radius:10px;padding:5px;margin:4px 0"><img src="${p.img}" style="height:60px;border-radius:8px"><div style="flex:1;margin-left:8px;font-size:13px"><b>${esc(p.nom)}</b><br><small>${esc(TISSUS.find(t=>t[0]===p.tissu)[1])}</small></div>${btn('👗 Essayer',`fsEssai(${i})`)}${btn(confirm===i?'Sûr ?':'🗑',`fsSuppC(${i})`,'#7b2d26')}</div>`).join('')||'<p style="font-size:13px">Aucune création. Couds-en une dans ✂️ Couture.</p>'}
    else{h='<b style="font-size:14px">🎯 Missions du styliste</b>'+Object.keys(MISSIONS).map(id=>{const q=MISSIONS[id],ok=m.done[id];return `<div style="background:#16102a;border-radius:10px;padding:7px;margin:5px 0;font-size:13px"><b>${ok?'✅':'▫️'} ${esc(q.nom)}</b> ${ok?'⭐'.repeat(m.stars[id]||1):''}<br>${esc(q.txt)}<br>${btn(ok?'Revalider':'✅ Valider','fsValider(\''+id+'\')',ok?'':'#2e7d32')}</div>`}).join('')+(m.cert?btn('🎓 Mon certificat','fsCert()','#6a1b9a'):'')}
    s.innerHTML=h}
  // ---------- couture
  function coutureHtml(){
    const m=FS(),cr=m.crea,md=MODELES.find(x=>x.id===cr.modele);
    if(!couture)return `<b>✂️ Atelier de couture</b><p style="font-size:13px">Tu vas fabriquer : <b>${md.ico} ${esc(md.nom)}</b> en ${esc(TISSUS.find(t=>t[0]===cr.tissu)[1])}.</p><p style="font-size:12px;opacity:.85">5 étapes : choisis le bon outil à chaque fois.</p>`+btn('▶ Commencer la couture','fsCoudre()','#2e7d32')+(m.port.length>=8?'<p style="font-size:12px;color:#ffb74d">Portfolio plein : supprime une création.</p>':'');
    if(couture.i>=ETAPES.length)return `<div style="text-align:center"><div style="font-size:34px">🧵✨</div><b>Tenue terminée !</b><p style="font-size:13px">${couture.err?couture.err+' erreur(s). ':'Sans erreur ! '}Ta création est prête.</p></div>`+btn('💾 Enregistrer dans le portfolio','fsEnreg()','#2e7d32')+btn('🔁 Refaire','fsCoudre()');
    const e=ETAPES[couture.i],ch=couture.ch;
    return `<div style="font-size:12px;opacity:.8">Étape ${couture.i+1}/${ETAPES.length}</div><b style="font-size:14px">${esc(e.q)}</b><div style="margin-top:6px">${ch.map(k=>btn(OUTILS[k][0]+' '+OUTILS[k][1],`fsOutil('${k}')`)).join('')}</div>${couture.msg?`<p style="font-size:13px">${couture.msg}</p>`:''}`}
  function etapeCouture(){const e=ETAPES[couture.i];if(!e)return;const pool=Object.keys(OUTILS).filter(k=>k!==e.o).sort(()=>Math.random()-.5).slice(0,3);couture.ch=pool.concat(e.o).sort(()=>Math.random()-.5)}
  function snapshot(){R.render(sc,cam);const c=document.createElement('canvas'),src=R.domElement;c.width=120;c.height=Math.round(120*src.height/src.width);c.getContext('2d').drawImage(src,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.6)}
  // ---------- défilé
  function defileHtml(){
    const m=FS();if(!DF){return `<b>👗 Grand défilé</b><p style="font-size:13px">Choisis au moins 3 créations de ton portfolio (${m.port.length} disponibles). Sur le podium, touche <b>📸 Pose</b> au bon moment !</p>`+(m.port.length<3?'<p style="font-size:13px;color:#ffb74d">Il te faut 3 tenues cousues pour défiler.</p>':btn('▶ Lancer le défilé','fsDefile()','#2e7d32'))+`<p style="font-size:12px">Meilleur score : ${m.defile.best} pose(s)</p>`}
    return `<b>Défilé en cours</b> · Tenue ${Math.min(DF.i+1,DF.list.length)}/${DF.list.length}<div style="height:14px;background:#111;border-radius:7px;margin:8px 0;position:relative"><div style="position:absolute;left:35%;width:30%;top:0;bottom:0;background:#2e7d3280"></div><div id="dfg" style="position:absolute;left:0;top:-2px;width:10px;height:18px;background:#ffd54f;border-radius:4px"></div></div>${btn('📸 Pose !','fsPose2()','#e84393','font-size:16px;padding:10px 18px')}<span id="dfs" style="font-size:13px;margin-left:8px">Poses réussies : ${DF.poses}</span>`}
  function lancerDefile(){
    const m=FS();if(m.port.length<3)return;DF={i:0,list:m.port.slice(0,5),phase:'marche',t:0,poses:0,done:false,g:0,fait:false,poseOk:null};cs.auto=false;decor();charge(DF.list[0]);body.position.set(0,0,-5);body.rotation.y=0;cam.position.set(0,1.5,5.2);cam.lookAt(0,1,-1);rend();SFX.coin&&SFX.coin()}
  function charge(c){const m=FS();const cr=Object.assign({},m.crea,c);if(body)sc.remove(body);body=construireMannequin(m.look,cr);sc.add(body)}
  function tickDefile(dt){
    if(!DF||DF.done)return;const lg=body.userData.legs,ar=body.userData.arms;DF.t+=dt;
    const sw=(v)=>{lg[0].rotation.x=Math.sin(DF.t*7)*.45*v;lg[1].rotation.x=-Math.sin(DF.t*7)*.45*v;ar[0].rotation.x=-Math.sin(DF.t*7)*.3*v;ar[1].rotation.x=Math.sin(DF.t*7)*.3*v};
    if(DF.phase==='marche'){body.position.z+=dt*1.5;body.rotation.y=0;sw(1);if(body.position.z>=1.3){DF.phase='pause';DF.t=0;DF.fait=false;sw(0);lg[0].rotation.x=lg[1].rotation.x=0}}
    else if(DF.phase==='pause'){const g=.5+.5*Math.sin(DF.t*4);const e=document.getElementById('dfg');if(e)e.style.left=(g*(e.parentElement.clientWidth-10))+'px';DF.g=g;body.rotation.y=Math.sin(DF.t*2)*.3;if(DF.t>2.4){DF.phase='retour';DF.t=0;body.rotation.y=Math.PI}}
    else{body.position.z-=dt*2;sw(.8);if(body.position.z<=-5){DF.i++;if(DF.i>=DF.list.length){finDefile(false);return}charge(DF.list[DF.i]);body.position.set(0,0,-5);DF.phase='marche';DF.t=0;rend()}}
    cam.position.set(0,1.5,5.2);cam.lookAt(0,1,-1)}
  function pose2(){
    if(!DF||DF.phase!=='pause'||DF.fait)return;DF.fait=true;const ok=Math.abs(DF.g-.5)<.15;if(ok){DF.poses++;SFX.ok&&SFX.ok();msg('✨ Pose parfaite !',1200);body.userData.arms[1].rotation.z=2.2}else{SFX.ko&&SFX.ko();msg('Pas tout à fait, concentre-toi sur la zone verte.',1500)}const e=$('dfs');if(e)e.textContent='Poses réussies : '+DF.poses}
  function finDefile(abandon){
    if(!DF)return;const d=DF;DF=null;decor();reconstruire();cs.auto=true;
    if(abandon){return}
    const m=FS();m.defile.n++;m.defile.best=Math.max(m.defile.best,d.poses);save();rend();
    over(`<div style="text-align:center"><div style="font-size:44px">👏✨</div><h3>Défilé terminé !</h3><p style="font-size:14px">${d.poses} pose(s) réussie(s) sur ${d.list.length} tenues.</p><p style="font-size:13px">${d.poses>=2?'Bravo ! Tu peux valider la mission « Le grand défilé ».':'Il faut 2 poses réussies pour valider la mission. Réessaie !'}</p></div>`+btn('↩ Continuer','fsFermerOver()')+btn('🎯 Missions','fsFermerOver();fsTab(\'miss\')','#2e7d32'));
    D.__lastDefile=d.poses}
  // ---------- missions
  function critere(id){
    const m=FS(),pt=m.port,has=f=>pt.some(f);
    if(id==='f1')return has(p=>p.modele==='scolaire'&&p.tissu==='coton'&&['#1b3a6b','#2e7d32','#2c3e50','#222222','#ffffff'].includes(p.couleur));
    if(id==='f2')return has(p=>['robeC','boubou','costume'].includes(p.modele)&&['bazin','soie','wax'].includes(p.tissu)&&(p.boutons||p.acc!=='aucun'));
    if(id==='f3')return has(p=>['pagne','boubou'].includes(p.modele)&&['wax','bazin'].includes(p.tissu));
    if(id==='f4')return m.coiffOk&&m.look.coiff!=='courtes';
    if(id==='f5')return pt.length>=3&&new Set(pt.map(p=>p.modele)).size>=3;
    if(id==='f6')return m.defile.best>=2;
    if(id==='f7')return has(p=>p.modele==='sport'&&p.tissu==='coton');
    return false}
  function valider(id){
    const m=FS(),q=MISSIONS[id];if(!critere(id)){const raisons={f4:'Compose une coiffure africaine puis touche « Valider cette coiffure ».',f5:'Il faut 3 tenues cousues de modèles différents dans ton portfolio.',f6:'Réussis au moins 2 poses lors d’un défilé.'};msg('❌ Pas encore : '+(raisons[id]||'couds d’abord une tenue qui respecte la consigne (voir ✂️ Couture et 🗂 Portfolio).'),4500);SFX.ko&&SFX.ko();return}
    const prem=!m.done[id];m.done[id]=true;m.stars[id]=Math.max(m.stars[id]||0,id==='f6'&&m.defile.best>=3?3:2);
    const a=A();if(prem){a.pieces+=q.pieces;a.xp+=q.pieces;refreshHud();const t=a.tal||(a.tal={});t.mode=(t.mode||0)+10}
    let ex='';if(Object.keys(m.done).length>=4&&!a.done['met:m1']){a.done['met:m1']=true;a.stars['met:m1']=Object.keys(m.done).length>=7?3:2;m.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();ex='<p>🎓 <b>Atelier validé !</b> Tu obtiens le certificat de jeune styliste (+15 🪙)</p>'+btn('🎓 Voir mon certificat','fsCert()','#6a1b9a')}
    else if(a.done['met:m1']&&Object.keys(m.done).length>=7)a.stars['met:m1']=3;
    save();SFX.win&&SFX.win();parler('Mission réussie. Bravo, styliste !');rend();
    over(`<div style="text-align:center"><div style="font-size:44px">👗🎉</div><h3>Mission réussie !</h3><p>${esc(q.nom)}${prem?' · +'+q.pieces+' 🪙':''}</p>${ex}</div>`+btn('↩ Continuer','fsFermerOver()'))}
  function cert(){const m=FS();if(!m.cert){over('<h3>🎓 Certificat</h3><p>Réussis 4 missions pour obtenir ton certificat de jeune styliste.</p>'+btn('✖ Fermer','fsFermerOver()'));return}
    over(`<div style="background:linear-gradient(#fff4fb,#f4d7ea);color:#5a1a46;border:6px double #e84393;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI FASHION STUDIO</div><div style="font-size:44px">👗</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE STYLISTE</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune styliste')}</div><p style="font-size:13px">pour avoir créé, cousu et présenté des tenues dans un atelier de mode éducatif.</p><p style="font-size:12px">Fait le ${esc(m.cert.date)}</p></div>`+btn('✖ Fermer','fsFermerOver()'))}
  function culture(){
    C={i:0,ok:0};cq()}
  function cq(){
    const q=CULTURE[C.i];if(!q){const m=FS();let ex='';if(!m.culture&&C.ok>=3){m.culture=true;A().pieces+=5;refreshHud();save();ex=' · +5 🪙'}over(`<h3>📚 Résultat : ${C.ok}/${CULTURE.length}${ex}</h3>`+btn('↩ Fermer','fsFermerOver()'));return}
    over(`<div style="font-size:12px">Question ${C.i+1}/${CULTURE.length}</div><h3 style="margin:4px 0">${esc(q[0])}</h3>`+q[1].map((x,i)=>btn(esc(x),`fsRep(${i})`)).join('')+(C.fb?`<p style="font-size:13px">${C.fb}</p>`+btn('Suivant ▶','fsSuiv()','#2e7d32'):''))}
  // ---------- actions
  const actions={
    fsOuvrir:()=>ouvrir(),fsQuitter:()=>quitter(),fsTab:t=>setTab(t),fsFermerOver:()=>fermerOver(),
    fsSet:(k,v)=>{FS().crea[k]=v;sauve();reconstruire();rend()},fsCoul:c=>{FS().crea.couleur=c;sauve();reconstruire();rend()},fsTog:k=>{const c=FS().crea;c[k]=!c[k];sauve();reconstruire();rend()},
    fsLook:(k,v)=>{FS().look[k]=v;sauve();reconstruire();rend()},fsChev:c=>actions.fsLook('ch',c),fsLev:c=>actions.fsLook('lev',c),fsYeux:c=>actions.fsLook('yeux',c),fsPeau:c=>actions.fsLook('skin',PEAUX.indexOf(c)),
    fsCoiffOk:()=>{const m=FS();m.coiffOk=true;save();msg(m.look.coiff==='courtes'?'Coiffure validée (courte). La mission demande une coiffure africaine.':'✅ Coiffure validée dans le salon !',3500);SFX.ok&&SFX.ok()},
    fsBg:b=>{bg=b;decor();rend()},fsPose:p=>{pose=p;if(body)poser(body,p);cs.auto=false;rend()},
    fsPhoto:()=>{const m=FS();const img=snapshot();m.photos.unshift({img,date:new Date().toLocaleDateString('fr-FR')});m.photos=m.photos.slice(0,8);save();SFX.coin&&SFX.coin();msg('📸 Photo enregistrée !');rend()},
    fsSuppPh:i=>{FS().photos.splice(i,1);save();rend()},
    fsCoudre:()=>{couture={i:0,err:0,msg:''};etapeCouture();rend()},
    fsOutil:k=>{const e=ETAPES[couture.i];if(k===e.o){SFX.ok&&SFX.ok();couture.msg='';couture.i++;if(couture.i<ETAPES.length)etapeCouture();else SFX.win&&SFX.win()}else{couture.err++;SFX.ko&&SFX.ko();couture.msg='❌ Ce n’est pas le bon outil : '+esc(e.txt)}rend()},
    fsEnreg:()=>{const m=FS();if(m.port.length>=8){msg('Portfolio plein (8 max).');return}const cr=m.crea,md=MODELES.find(x=>x.id===cr.modele);m.port.push(Object.assign({},cr,{nom:md.nom+' '+(m.port.length+1),img:snapshot()}));couture=null;save();SFX.coin&&SFX.coin();msg('✅ Création ajoutée au portfolio');setTab('port')},
    fsEssai:i=>{const m=FS();Object.assign(m.crea,m.port[i]);delete m.crea.nom;delete m.crea.img;sauve();reconstruire();msg('Tenue chargée sur le mannequin.')},
    fsSuppC:i=>{if(confirm!==i){confirm=i;rend();return}FS().port.splice(i,1);confirm=-1;save();rend()},
    fsDefile:()=>lancerDefile(),fsPose2:()=>pose2(),fsValider:id=>valider(id),fsCert:()=>cert(),
    fsTestDefile:()=>{let n=0;while(DF&&n++<20000){tickDefile(.05);if(DF&&DF.phase==='pause'&&!DF.fait&&Math.abs(DF.g-.5)<.1)pose2()}},fsCulture:()=>culture(),fsRep:i=>{const q=CULTURE[C.i];if(i===q[2]){C.ok++;C.fb='✅ '+esc(q[3])}else C.fb='❌ '+esc(q[3]);cq()},fsSuiv:()=>{C.i++;C.fb='';cq()}};
  return {actions,ouvrir,fermer,FS,estOuvert:()=>!!ov};
}
