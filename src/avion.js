// Simulateur d'avion léger : procédure de départ (porte, ceinture, batterie, frein, démarreur), instruments, manche, manette des gaz,
// palonniers, volets, freins ; missions chronométrées avec balises ; atterrissage ; retour au parking. Rendu Three.js autonome.
import * as THREE from 'three';

export const MISSIONS=[
  {id:'exam',nom:'Vol d’examen (brevet)',txt:'Décolle, passe 3 balises et atterris sur la piste.',tmax:210,rec:25,bal:[[0,90,-520],[420,120,-560],[420,100,-140]],brevet:true},
  {id:'courrier',nom:'Courrier express',txt:'Livre le courrier : 4 balises avant la fin du temps.',tmax:240,rec:18,bal:[[-300,90,-380],[-520,130,-900],[0,140,-1000],[450,100,-600]]},
  {id:'ville',nom:'Survol de la ville',txt:'Survole les quartiers à basse altitude, puis reviens.',tmax:260,rec:24,bal:[[260,70,-260],[520,80,-380],[620,100,-700],[320,90,-800],[-120,80,-500]]},
  {id:'province',nom:'Vol vers la province',txt:'Un long vol de 6 balises : surveille ton temps.',tmax:330,rec:40,bal:[[0,160,-1300],[900,210,-2200],[1800,190,-2700],[2200,150,-1800],[1500,120,-700],[500,100,-250]]}
];
const STAND={x:-48,z:100,psi:Math.PI/2};   // parking de l'avion
const KT=1.944;

export function lancerAvion(el,opt){
  const o=Object.assign({mission:null,onFin:()=>{},onQuit:()=>{},onSon:()=>{},toast:()=>{}},opt||{});
  el.style.cssText+=';display:flex;flex-direction:column;background:#000;touch-action:none';
  const view=document.createElement('div');view.style.cssText='flex:1;position:relative;min-height:0';el.appendChild(view);
  const W0=Math.max(300,el.clientWidth),H0=Math.max(200,Math.round((el.clientHeight||700)*.52));
  const r=new THREE.WebGLRenderer({antialias:false});r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));r.setSize(W0,H0);view.appendChild(r.domElement);r.domElement.style.cssText='width:100%;height:100%;display:block';
  const sc=new THREE.Scene();const ciel=new THREE.Color('#8fcdf2');sc.background=ciel;sc.fog=new THREE.Fog('#bfe0f2',900,5500);
  const cam=new THREE.PerspectiveCamera(66,W0/H0,.15,9000);
  sc.add(new THREE.HemisphereLight('#ffffff','#6b8f4e',1.15));const sun=new THREE.DirectionalLight('#fff3d2',1.1);sun.position.set(600,900,300);sc.add(sun);
  const M=(c,rough,metal)=>new THREE.MeshStandardMaterial({color:c,roughness:rough===undefined?.85:rough,metalness:metal||0});
  const B=(w,h,d,c,x,y,z,par)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='string'?M(c):c);m.position.set(x,y,z);(par||sc).add(m);return m};
  // ---------- terrain
  function tex(fn,w=256,h=256){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
  const herbe=tex((g,w,h)=>{g.fillStyle='#6f9a4f';g.fillRect(0,0,w,h);for(let i=0;i<2200;i++){g.fillStyle=['#7aa857','#628b45','#85b05e','#5c8240'][i%4];g.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*3,2+Math.random()*3)}});
  herbe.repeat.set(4000,4000);
  const sol=new THREE.Mesh(new THREE.PlaneGeometry(40000,40000),new THREE.MeshStandardMaterial({map:herbe,roughness:1}));sol.rotation.x=-Math.PI/2;sc.add(sol);
  const asph=tex((g,w,h)=>{g.fillStyle='#46464b';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=i%2?'#505056':'#3c3c41';g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
  asph.repeat.set(4,60);
  const piste=new THREE.Mesh(new THREE.PlaneGeometry(24,440),new THREE.MeshStandardMaterial({map:asph,roughness:.9}));piste.rotation.x=-Math.PI/2;piste.position.set(0,.06,-92);sc.add(piste);
  const fl=(w,d,c,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),M(c));m.rotation.x=-Math.PI/2;m.position.set(x,y||.1,z);sc.add(m);return m};
  for(let i=0;i<20;i++)fl(.9,12,'#f4f4f4',0,120-i*22);                       // axe
  [-11,11].forEach(x=>fl(.5,420,'#f4f4f4',x,-92));                           // bords
  [-9,-6,-3,3,6,9].forEach(x=>{fl(1.1,9,'#f4f4f4',x,-296);fl(1.1,9,'#f4f4f4',x,112)});
  const taxi=new THREE.Mesh(new THREE.PlaneGeometry(62,10),new THREE.MeshStandardMaterial({map:asph,roughness:.9}));taxi.rotation.x=-Math.PI/2;taxi.position.set(-31,.07,100);sc.add(taxi);
  const aire=new THREE.Mesh(new THREE.PlaneGeometry(34,40),new THREE.MeshStandardMaterial({map:asph,roughness:.9}));aire.rotation.x=-Math.PI/2;aire.position.set(-52,.07,100);sc.add(aire);
  fl(.4,10,'#f1c40f',-31,100,.12);for(let i=0;i<6;i++)fl(5,.35,'#f1c40f',-56+i*5,100,.12);
  // feux de piste
  const feux=new THREE.InstancedMesh(new THREE.SphereGeometry(.35,6,4),new THREE.MeshBasicMaterial({color:'#fff3a8'}),42);
  const mx=new THREE.Matrix4();for(let i=0;i<21;i++){[-12.5,12.5].forEach((x,k)=>{mx.makeTranslation(x,.4,-300+i*21);feux.setMatrixAt(i*2+k,mx)})}sc.add(feux);
  // bâtiments : terminal, tour, hangar
  const bat=new THREE.Group();bat.position.set(-82,0,100);sc.add(bat);
  B(26,6,10,'#e9edf2',0,3,0,bat);B(27,.6,11,'#1f5f9e',0,6.3,0,bat);B(20,3,.2,new THREE.MeshStandardMaterial({color:0x6fb7e6,transparent:true,opacity:.6}),0,2.6,5.1,bat);
  const tor=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.1,16,12),M('#d9dde3'));tor.position.set(-14,8,-6);bat.add(tor);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(3.6,2.4,3.4,12),new THREE.MeshStandardMaterial({color:0x4aa0d8,transparent:true,opacity:.75}));cab.position.set(-14,17.5,-6);bat.add(cab);
  B(8,.4,8,'#c0392b',-14,19.4,-6,bat);
  const han=B(30,9,22,'#9aa5b1',-82,4.5,150);B(31,.6,23,'#6b7480',-82,9.3,150);
  const sm=new THREE.Mesh(new THREE.ConeGeometry(.5,3,6),M('#ff7a1a'));sm.position.set(-20,1.6,80);sm.rotation.z=Math.PI/2;sc.add(sm);B(.1,3,.1,'#999',-20,1.5,80);
  // arbres, collines, champs, rivière, ville, nuages (placements déterministes)
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const troncs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.5,.7,4,5),M('#6b4423'),700),cimes=new THREE.InstancedMesh(new THREE.SphereGeometry(3.4,6,5),M('#2f7d3a'),700);
  for(let i=0;i<700;i++){let x=(rnd()-.5)*5200,z=(rnd()-.5)*5200-900;if(Math.abs(x)<60&&z>-340&&z<170){x+=140}const s=.8+rnd()*1.2;
    mx.compose(new THREE.Vector3(x,2*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s,s));troncs.setMatrixAt(i,mx);mx.compose(new THREE.Vector3(x,5.5*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s*.9,s));cimes.setMatrixAt(i,mx)}
  sc.add(troncs);sc.add(cimes);
  for(let i=0;i<16;i++){const h=60+rnd()*140,m=new THREE.Mesh(new THREE.ConeGeometry(120+rnd()*180,h,9),M(i%2?'#5f8a47':'#7d9a5a'));m.position.set((rnd()-.5)*6000,h/2-4,-900-rnd()*3000);sc.add(m)}
  for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(80+rnd()*160,60+rnd()*140),M(['#c9b458','#8cbf5a','#a9794a','#7aa857'][i%4]));m.rotation.x=-Math.PI/2;m.rotation.z=rnd()*3;m.position.set((rnd()-.5)*3600,.05,-300-rnd()*2800);sc.add(m)}
  const riv=new THREE.Mesh(new THREE.PlaneGeometry(60,5000),M('#3a8fcf',.2));riv.rotation.x=-Math.PI/2;riv.rotation.z=.5;riv.position.set(700,.04,-1200);sc.add(riv);
  const maisons=new THREE.InstancedMesh(new THREE.BoxGeometry(10,6,10),M('#d9c9a8'),160),toits=new THREE.InstancedMesh(new THREE.BoxGeometry(11,1,11),M('#b0502d'),160);
  for(let i=0;i<160;i++){const gx=(i%16)*20,gz=Math.floor(i/16)*20,x=300+gx+(rnd()-.5)*4,z=-300-gz+(rnd()-.5)*4;mx.makeTranslation(x,3,z);maisons.setMatrixAt(i,mx);mx.makeTranslation(x,6.5,z);toits.setMatrixAt(i,mx)}
  sc.add(maisons);sc.add(toits);
  const nuages=[];for(let i=0;i<34;i++){const g=new THREE.Group();for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(60+rnd()*60,8,6),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.9}));s.scale.y=.45;s.position.set(k*70,rnd()*20,rnd()*40);g.add(s)}
    g.position.set((rnd()-.5)*6000,420+rnd()*260,-rnd()*5000);sc.add(g);nuages.push(g)}
  // ---------- avion (nez vers -z)
  const av=new THREE.Group();sc.add(av);
  const corps=new THREE.Group();av.add(corps);const coque=new THREE.Group();corps.add(coque);
  const blanc=M('#f4f4f4',.5,.15),rouge=M('#d6302b',.5,.1),vitre=new THREE.MeshStandardMaterial({color:0x2b4a6b,roughness:.1,metalness:.5,transparent:true,opacity:.75});
  const fus=new THREE.Mesh(new THREE.CapsuleGeometry(.62,3.4,6,14),blanc);fus.rotation.x=Math.PI/2;fus.position.set(0,1.25,.4);fus.scale.set(1,1,1.05);coque.add(fus);
  const nez=new THREE.Mesh(new THREE.SphereGeometry(.62,14,10),blanc);nez.position.set(0,1.15,-1.45);nez.scale.set(1,.9,1.2);coque.add(nez);
  const queue=new THREE.Mesh(new THREE.ConeGeometry(.55,3.6,12),blanc);queue.rotation.x=-Math.PI/2;queue.position.set(0,1.45,4.4);coque.add(queue);
  [-1,1].forEach(d=>{B(.04,.55,1.6,vitre,d*.6,1.62,-.2,coque);B(.04,.4,.9,vitre,d*.6,1.5,1.3,coque)});
  const pare=B(1.05,.5,1.2,vitre,0,1.85,-.7,coque);pare.rotation.x=.55;
  const aile=B(11,.14,1.7,blanc,0,2.05,-.2,coque);B(11,.15,.35,rouge,0,2.05,.5,coque);                               // aile haute
  [-1,1].forEach(d=>{const s=B(.08,1.1,.1,'#cfcfcf',d*1.6,1.45,-.1,coque);s.rotation.z=d*.55});
  B(3.8,.1,1.05,blanc,0,1.6,5.6,corps);const deriv=B(.12,1.5,1.3,rouge,0,2.25,5.5,corps);deriv.rotation.x=-.12;
  const gouv=B(.1,1.2,.5,'#bd2a26',0,2.2,6.2,corps);
  B(1.3,.2,.5,rouge,0,.62,-.7,corps).visible=false;
  const roue=(x,z,rr)=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr,.22,14),M('#222'));w.rotation.z=Math.PI/2;w.position.set(x,rr,z);corps.add(w);B(.07,.8,.07,'#555',x,.7,z,corps)};
  roue(-1,0,.34);roue(1,0,.34);roue(0,-1.7,.26);
  const helice=new THREE.Group();helice.position.set(0,1.15,-2.1);corps.add(helice);
  B(.22,.22,.18,'#333',0,0,.05,helice);const pales=new THREE.Group();helice.add(pales);B(.14,2.3,.05,'#2a2a2a',0,0,0,pales);B(.14,2.3,.05,'#2a2a2a',0,0,0,pales).rotation.z=Math.PI/2*0;
  const disque=new THREE.Mesh(new THREE.CircleGeometry(1.15,20),new THREE.MeshBasicMaterial({color:'#dddddd',transparent:true,opacity:0,side:THREE.DoubleSide}));disque.position.z=-.05;helice.add(disque);
  const porte=new THREE.Group();porte.position.set(.62,1.3,-.1);corps.add(porte);B(.05,.85,1.0,'#e9e9e9',0,.1,.5,porte);
  // intérieur du poste de pilotage (visible en vue cockpit)
  const cock=new THREE.Group();av.add(cock);cock.visible=false;
  B(1.2,.45,1.3,'#e6e6e6',0,1.0,-1.55,cock);B(1.5,.5,.6,'#2b2b30',0,.95,-.95,cock);B(1.6,.12,.5,'#1b1b1f',0,1.2,-1.12,cock).rotation.x=-.25;
  const mancheG=new THREE.Group();mancheG.position.set(-.3,.9,-.55);cock.add(mancheG);B(.05,.45,.05,'#222',0,.2,0,mancheG);B(.38,.05,.05,'#222',0,.45,0,mancheG);[-1,1].forEach(d=>B(.08,.12,.08,'#111',d*.19,.45,0,mancheG));
  B(.05,1.1,.06,'#d9d9d9',-.62,1.5,-.2,cock);B(.05,1.1,.06,'#d9d9d9',.62,1.5,-.2,cock);
  [-.3,.3].forEach(x=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.4,.1,.4),M('#4a4a55'));s.position.set(x,.5,.45);cock.add(s)});
  // ---------- balises
  const balises=[];const gBal=new THREE.Group();sc.add(gBal);
  function posBalises(ms){gBal.clear();balises.length=0;
    (ms?ms.bal:[]).forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);
      const t=new THREE.Mesh(new THREE.TorusGeometry(20,2.2,8,26),new THREE.MeshBasicMaterial({color:'#ffc107'}));g.add(t);
      const f=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,Math.max(60,p[1]*2),6),new THREE.MeshBasicMaterial({color:'#ffc107',transparent:true,opacity:.35}));f.position.y=-p[1]/2-10;g.add(f);
      gBal.add(g);balises.push({g,t,ok:false,p:new THREE.Vector3(p[0],p[1],p[2])})});
    balises.forEach((b,i)=>{const n=balises[i+1]||{p:new THREE.Vector3(0,0,-90)};b.t.lookAt(n.p)})}
  // ---------- état
  const S={x:STAND.x,y:0,z:STAND.z,psi:STAND.psi,pitch:0,roll:0,v:0,vy:0,gaz:0,volets:0,frein:true,rudder:0,moteur:false,rpm:0,sol:true,
    etape:0,porte:false,cabine:false,batt:false,vue:'ext',mis:null,t0:null,reste:0,fin:false,phase:'depart',msg:'',tmsg:0,att:false,posee:0,yok:{x:0,y:0},stall:false,distance:0};
  const D=(k,v)=>{S[k]=v};
  function choisir(m){S.mis=m;S.t0=null;S.reste=m?m.tmax:0;posBalises(m)}
  choisir(o.mission);
  // ---------- audio moteur
  let ac=null,osc=null,gn=null,lp=null;
  function sonMoteur(on){
    try{
      if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
      if(on&&!osc){osc=ac.createOscillator();gn=ac.createGain();lp=ac.createBiquadFilter();osc.type='sawtooth';lp.type='lowpass';lp.frequency.value=700;gn.gain.value=.0001;osc.connect(lp);lp.connect(gn);gn.connect(ac.destination);osc.start()}
      if(!on&&osc){gn.gain.setTargetAtTime(0,ac.currentTime,.2);const o2=osc;setTimeout(()=>{try{o2.stop()}catch(e){}},600);osc=null}
    }catch(e){}
  }
  // ---------- interface
  const pan=document.createElement('div');pan.style.cssText='flex:0 0 auto;background:#20242b;color:#eee;padding:6px;font:12px system-ui;border-top:3px solid #888;user-select:none;-webkit-user-select:none';el.appendChild(pan);
  const hud=document.createElement('div');hud.style.cssText='position:absolute;left:6px;right:6px;top:6px;color:#fff;font:700 13px system-ui;text-shadow:0 1px 3px #000;pointer-events:none';view.appendChild(hud);
  const check=document.createElement('div');check.style.cssText='position:absolute;left:8px;right:8px;bottom:8px;background:rgba(15,20,30,.88);color:#fff;border-radius:12px;padding:10px;font:13px system-ui';view.appendChild(check);
  const btn=(t,css,id)=>`<button id="${id||''}" style="padding:9px 10px;margin:2px;border-radius:9px;border:1px solid #777;background:#3a4150;color:#fff;font-size:13px;touch-action:none;${css||''}">${t}</button>`;
  pan.innerHTML=`<div style="display:flex;gap:6px;align-items:stretch">
    <div style="flex:0 0 138px"><div id="yoke" style="position:relative;width:132px;height:132px;border-radius:50%;background:radial-gradient(#4b5260,#2a2f38);border:3px solid #999;touch-action:none"><div id="yk" style="position:absolute;left:46px;top:46px;width:40px;height:40px;border-radius:50%;background:#e7e7e7;border:3px solid #333"></div><div style="position:absolute;inset:0;font-size:9px;text-align:center;pointer-events:none;padding-top:3px;opacity:.7">MANCHE<br>↓ monter</div></div></div>
    <div style="flex:1;min-width:0"><canvas id="ai" width="120" height="120" style="width:84px;height:84px;float:right;border-radius:50%;border:2px solid #999"></canvas><div id="ins" style="font:700 12px monospace;line-height:1.5"></div>
      <div>${btn('🛑 FREIN','','bfr')}${btn('Volets −','','bvm')}${btn('Volets +','','bvp')}</div>
      <div>${btn('◀ Pédale','','bpg')}${btn('Pédale ▶','','bpd')}</div></div>
    <div style="flex:0 0 46px;text-align:center"><div style="font-size:9px">GAZ</div><div id="gaz" style="position:relative;width:34px;height:116px;margin:2px auto;background:#14171c;border:2px solid #999;border-radius:8px;touch-action:none"><div id="gz" style="position:absolute;left:-4px;width:38px;height:22px;border-radius:6px;background:#d6302b;border:2px solid #fff;bottom:0"></div></div><div id="gv" style="font-size:11px">0 %</div></div></div>
    <div id="act" style="margin-top:3px"></div>`;
  const $=id=>pan.querySelector('#'+id);
  // manche tactile
  const Y={x:0,y:0};let yid=null;const yk=$('yk'),yoke=$('yoke');
  const ymove=e=>{const b=yoke.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}Y.x=dx;Y.y=dy;yk.style.left=(46+dx*40)+'px';yk.style.top=(46+dy*40)+'px'};
  yoke.addEventListener('pointerdown',e=>{e.preventDefault();yoke.setPointerCapture(e.pointerId);yid=e.pointerId;ymove(e)});
  yoke.addEventListener('pointermove',e=>{if(e.pointerId===yid)ymove(e)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>yoke.addEventListener(n,e=>{if(e.pointerId===yid){yid=null;Y.x=Y.y=0;yk.style.left='46px';yk.style.top='46px'}}));
  // manette des gaz tactile
  const gaz=$('gaz'),gz=$('gz');let gid=null;
  const gset=e=>{const b=gaz.getBoundingClientRect();const f=1-Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));S.gaz=f};
  gaz.addEventListener('pointerdown',e=>{e.preventDefault();gaz.setPointerCapture(e.pointerId);gid=e.pointerId;gset(e)});
  gaz.addEventListener('pointermove',e=>{if(e.pointerId===gid)gset(e)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>gaz.addEventListener(n,e=>{if(e.pointerId===gid)gid=null}));
  const K={pg:0,pd:0,u:0,d:0,l:0,r:0};
  const hold=(id,k)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();K[k]=1});['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,()=>K[k]=0))};
  hold('bpg','pg');hold('bpd','pd');
  $('bfr').addEventListener('click',()=>{S.frein=!S.frein;$('bfr').style.background=S.frein?'#c0392b':'#3a4150'});
  $('bvp').addEventListener('click',()=>{S.volets=Math.min(3,S.volets+1)});$('bvm').addEventListener('click',()=>{S.volets=Math.max(0,S.volets-1)});
  const kd=e=>{const v=e.type==='keydown'?1:0;({ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',q:'pg',e:'pd'})[e.key]!==undefined&&(K[({ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',q:'pg',e:'pd'})[e.key]]=v);
    if(v&&e.key==='w')S.gaz=Math.min(1,S.gaz+.1);if(v&&e.key==='s')S.gaz=Math.max(0,S.gaz-.1);if(v&&e.key==='b')$('bfr').click()};
  addEventListener('keydown',kd);addEventListener('keyup',kd);
  // procédure de départ
  const ETAPES=[
    ['Ouvrir la porte de l’avion',()=>{S.porte=true}],
    ['Monter à bord et boucler la ceinture',()=>{S.cabine=true;S.vue='cockpit'}],
    ['Allumer la batterie (master)',()=>{S.batt=true}],
    ['Vérifier : frein de parc serré, gaz au ralenti',()=>{if(S.gaz>.05){o.toast('Mets d’abord la manette des gaz au minimum.');return false}if(!S.frein){S.frein=true;$('bfr').style.background='#c0392b'}}],
    ['Démarrer le moteur (maintenir 2 secondes)','hold']
  ];
  let dem=0,demId=null;
  function dessineCheck(){
    if(S.etape>=ETAPES.length||S.fin){check.style.display='none';return}
    check.style.display='block';
    let h=`<b>✈️ Procédure de départ</b>${S.mis?'<br><span style="font-size:12px;color:#ffe082">Mission : '+S.mis.nom+' · temps : '+Math.floor(S.mis.tmax/60)+' min '+(S.mis.tmax%60)+' s</span>':'<br><span style="font-size:12px;color:#ffe082">Vol libre, sans chrono</span>'}`;
    ETAPES.forEach((e,i)=>{h+=`<div style="margin:3px 0;opacity:${i>S.etape?.45:1}">${i<S.etape?'✅':i===S.etape?'▶':'⬜'} ${e[0]}</div>`});
    const cur=ETAPES[S.etape];
    h+=cur[1]==='hold'?`<button id="cstart" style="width:100%;padding:12px;border-radius:9px;background:#d6302b;color:#fff;border:0;font-size:15px;touch-action:none">🔑 Maintenir pour démarrer</button><div style="height:6px;background:#444;border-radius:3px;margin-top:4px"><div id="cb" style="height:6px;width:${Math.round(dem*50)}%;background:#7CFC00;border-radius:3px"></div></div>`:`<button id="cnext" style="width:100%;padding:12px;border-radius:9px;background:#2e7d32;color:#fff;border:0;font-size:15px">${S.etape===0?'🚪 Ouvrir la porte':S.etape===1?'🪑 Monter à bord':S.etape===2?'🔋 Batterie ON':'✔ Vérifié'}</button>`;
    check.innerHTML=h;
    const nx=check.querySelector('#cnext');if(nx)nx.onclick=()=>{const rr=ETAPES[S.etape][1]();if(rr===false)return;S.etape++;dessineCheck()};
    const st=check.querySelector('#cstart');if(st){st.addEventListener('pointerdown',e=>{e.preventDefault();demId=1;sonMoteur(true)});['pointerup','pointerleave','pointercancel'].forEach(n=>st.addEventListener(n,()=>{demId=null}))}
  }
  function actionsBas(){
    const a=$('act');let h='';
    const pres=S.sol&&S.v<1.5&&Math.hypot(S.x-STAND.x,S.z-STAND.z)<30;
    if(S.moteur&&S.sol&&S.v<1.5)h+=btn('⏻ Couper le moteur','','bcut');
    if(!S.moteur&&S.etape>=ETAPES.length&&S.sol&&pres)h+=btn('🚪 Quitter l’avion','background:#2e7d32','bquit');
    if(!S.moteur&&S.etape>=ETAPES.length&&S.sol&&!pres)h+=btn('🔑 Redémarrer','','bres')+btn('↩ Retour au parking','','bpark');
    h+=btn(S.vue==='cockpit'?'👁 Vue extérieure':'👁 Vue cockpit','','bvue')+btn('✖ Quitter l’avion (sortir)','','bx');
    a.innerHTML=h;
    const g=id=>a.querySelector('#'+id);
    if(g('bcut'))g('bcut').onclick=()=>{S.moteur=false;sonMoteur(false);S.frein=true;$('bfr').style.background='#c0392b';actionsBas()};
    if(g('bquit'))g('bquit').onclick=()=>{o.onQuit()};
    if(g('bres'))g('bres').onclick=()=>{S.etape=ETAPES.length-1;dessineCheck()};
    if(g('bpark'))g('bpark').onclick=()=>retourParking('Retour au parking.');
    if(g('bvue'))g('bvue').onclick=()=>{S.vue=S.vue==='cockpit'?'ext':'cockpit';actionsBas()};
    if(g('bx'))g('bx').onclick=()=>{if(S.sol&&S.v<1.5){if(S.moteur){S.moteur=false;sonMoteur(false)}o.onQuit()}else o.toast('Pose l’avion et arrête-toi avant de sortir.')};
  }
  let lastAct='';
  // ---------- jeu
  function msg(t,s){S.msg=t;S.tmsg=s||3}
  function retourParking(txt){
    S.x=STAND.x;S.z=STAND.z;S.y=0;S.psi=STAND.psi;S.pitch=0;S.roll=0;S.v=0;S.vy=0;S.gaz=0;S.moteur=false;S.rpm=0;S.sol=true;S.frein=true;S.volets=0;S.fin=false;S.t0=null;S.reste=S.mis?S.mis.tmax:0;
    sonMoteur(false);balises.forEach(b=>{b.ok=false;b.t.material.color.set('#ffc107')});S.etape=ETAPES.length-1;S.porte=true;S.cabine=true;S.batt=true;S.vue='cockpit';
    msg(txt||'Retour à l’aéroport.',5);dessineCheck();actionsBas();$('bfr').style.background='#c0392b'}
  function echec(raison){
    if(S.fin)return;S.fin=true;sonMoteur(false);o.onFin({id:S.mis&&S.mis.id,ok:false,raison});
    check.style.display='block';check.innerHTML=`<b style="color:#ff8a80">❌ Mission échouée</b><br>${raison}<br>Tu rentres à l’aéroport.<br><button id="cre" style="width:100%;padding:12px;margin-top:6px;border-radius:9px;background:#1f5f9e;color:#fff;border:0;font-size:15px">🛬 Retourner à l’aéroport</button>`;
    check.querySelector('#cre').onclick=()=>{retourParking('Retour à l’aéroport après l’échec. Tu peux retenter.')}}
  function succes(){
    if(S.fin)return;S.fin=true;const temps=Math.round((S.mis?S.mis.tmax-S.reste:0));o.onFin({id:S.mis&&S.mis.id,ok:true,temps,reste:Math.round(S.reste)});
    check.style.display='block';check.innerHTML=`<b style="color:#a5d6a7">✅ Mission accomplie !</b><br>Temps : ${Math.floor(temps/60)} min ${temps%60} s${S.mis?' (il te restait '+Math.round(S.reste)+' s)':''}<br>Ramène l’avion au parking, coupe le moteur et quitte l’appareil.<br><button id="cok" style="width:100%;padding:12px;margin-top:6px;border-radius:9px;background:#2e7d32;color:#fff;border:0;font-size:15px">Continuer</button>`;
    check.querySelector('#cok').onclick=()=>{S.fin=false;S.mis=null;S.t0=null;balises.length=0;gBal.clear();check.style.display='none';actionsBas()}}
  const surface=()=>{const x=S.x,z=S.z;if(Math.abs(x)<14&&z<125&&z>-312)return 'piste';if(z>94&&z<106&&x>-64&&x<5)return 'taxi';if(x>-70&&x<-34&&z>80&&z<120)return 'aire';return 'herbe'};
  function pas(dt){
    // démarrage
    if(demId&&S.etape===ETAPES.length-1){dem+=dt/2;if(dem>=1){S.moteur=true;S.etape++;dem=0;demId=null;dessineCheck();actionsBas();msg('Moteur démarré ! Relâche le frein de parc, puis pousse les gaz.',5)}}
    else if(!demId)dem=Math.max(0,dem-dt*2);
    const cb=check.querySelector('#cb');if(cb)cb.style.width=Math.round(dem*100)+'%';
    // commandes
    const kx=K.r-K.l,ky=K.d-K.u;const ix=Math.abs(Y.x)>.02?Y.x:kx,iy=Math.abs(Y.y)>.02?Y.y:ky;S.yok.x=ix;S.yok.y=iy;
    S.rudder=K.pd-K.pg;
    S.rpm+=((S.moteur?(.25+S.gaz*.75):0)-S.rpm)*Math.min(1,dt*1.5);
    gz.style.bottom=Math.round(S.gaz*94)+'px';$('gv').textContent=Math.round(S.gaz*100)+' %';
    const vs=26-S.volets*2.6;                       // vitesse de décrochage (m/s)
    const poussee=S.moteur?S.rpm*5.6:0;
    const sf=surface();
    const roul=S.sol?(sf==='herbe'?.9:.18):0,fr=S.sol&&S.frein?(S.moteur&&S.gaz>.6?3:4.5):0;
    S.v=Math.max(0,S.v+(poussee-.0017*S.v*S.v-roul-fr-(S.volets*.0004*S.v*S.v))*dt);
    if(S.sol&&S.frein&&S.v<.3)S.v=0;
    const vr=vs*1.15;
    // assiette et gîte
    if(S.sol){
      S.pitch+=((S.v>=vr*.9?iy*.3:0)-S.pitch)*Math.min(1,dt*3);S.pitch=Math.max(0,S.pitch);S.roll+=(0-S.roll)*Math.min(1,dt*6);
      // direction au sol : palonniers
      const gv=Math.min(1,S.v/5);S.psi+=S.rudder*.5*dt*gv*(S.v>.5?1:0)+(S.v>1?ix*.12*dt*Math.min(1,S.v/10):0);
      if(S.v>=vr&&S.pitch>.06){S.sol=false;S.posee=0;msg('Décollage !',2)}
    }else{
      S.pitch+=((iy)*.4-S.pitch)*Math.min(1,dt*2.2);S.roll+=((ix)*.75-S.roll)*Math.min(1,dt*2.4);
      const vg=Math.max(18,S.v);S.psi+=(Math.tan(S.roll)*9.81/vg)*dt+S.rudder*.12*dt;
      const decroche=S.v<vs*1.02;S.stall=decroche;
      const montee=S.v*Math.sin(S.pitch)*(S.v>vs?1:.4);
      const chute=decroche?Math.min(22,(vs-S.v)*2.4+6):0;
      S.vy+=((montee-chute-(S.moteur?0:2.2))-S.vy)*Math.min(1,dt*1.6);
      S.y+=S.vy*dt;
      if(S.pitch>.35&&S.v<vs*1.2)S.v=Math.max(0,S.v-dt*3);
      if(S.y<=0){ // toucher
        const dur=S.vy;S.y=0;
        const ok=(sf==='piste'||sf==='taxi'||sf==='aire');
        if(dur<-9||Math.abs(S.roll)>.45||S.pitch>.4||S.pitch<-.2||!ok){S.vy=0;S.v=0;echec(!ok?'Atterrissage en dehors de la piste.':dur<-9?'Atterrissage trop brutal.':'Mauvaise assiette à l’atterrissage.');return}
        S.sol=true;S.vy=0;S.posee++;msg(dur<-4?'Atterrissage un peu dur…':'Beau toucher !',3);S.roll=0}
    }
    // déplacement
    const f=S.v*dt;S.x+=Math.sin(S.psi)*f*Math.cos(S.pitch);S.z-=Math.cos(S.psi)*f*Math.cos(S.pitch);
    if(S.sol){S.y=0}
    if(Math.hypot(S.x,S.z)>7000){echec('Tu t’es trop éloigné de l’aéroport.');return}
    // chrono et balises
    if(S.mis&&!S.fin){
      if(S.t0===null&&S.moteur&&S.v>2){S.t0=1;msg('Chrono lancé ! '+Math.floor(S.mis.tmax/60)+' min '+S.mis.tmax%60+' s',3)}
      if(S.t0!==null){S.reste-=dt;if(S.reste<=0){S.reste=0;echec('Temps écoulé.');return}}
      balises.forEach(b=>{if(!b.ok&&b.p.distanceTo(new THREE.Vector3(S.x,S.y+2,S.z))<30){b.ok=true;b.t.material.color.set('#2ecc71');b.g.children[1].material.color.set('#2ecc71');msg('✅ Balise '+balises.filter(q=>q.ok).length+' / '+balises.length,2)}});
      if(balises.length&&balises.every(b=>b.ok)&&S.sol&&S.posee>0&&S.v<3&&(sf==='piste'||sf==='taxi'||sf==='aire'))succes();
    }
    if(S.tmsg>0){S.tmsg-=dt;if(S.tmsg<=0)S.msg=''}
    // son
    if(osc){osc.frequency.setTargetAtTime(38+S.rpm*95,ac.currentTime,.1);gn.gain.setTargetAtTime(S.moteur?.05+S.rpm*.06:0,ac.currentTime,.1)}
  }
  const aiC=$('ai').getContext('2d');
  function instruments(){
    const kt=Math.round(S.v*KT),alt=Math.round(S.y*3.28),vsi=Math.round(S.vy*196.85/10)*10,cap=((Math.round(S.psi*180/Math.PI)%360)+360)%360;
    $('ins').innerHTML=`VIT <b style="color:${S.stall&&!S.sol?'#ff5252':'#a5d6a7'}">${kt}</b> kt · ALT <b>${alt}</b> ft<br>CAP <b>${String(cap).padStart(3,'0')}°</b> · VZ <b>${vsi}</b> ft/min<br>VOLETS <b>${S.volets*10}°</b> · ${S.frein?'<span style="color:#ff8a80">FREIN</span>':'frein relâché'}${S.stall&&!S.sol?'<br><span style="color:#ff5252">⚠ DÉCROCHAGE : mets des gaz !</span>':''}`;
    // horizon artificiel
    const g=aiC,W=120;g.save();g.clearRect(0,0,W,W);g.beginPath();g.arc(60,60,58,0,7);g.clip();g.translate(60,60);g.rotate(S.roll);
    const dy=S.pitch*180;g.fillStyle='#4aa0d8';g.fillRect(-100,-200+dy,200,200);g.fillStyle='#8a5a2b';g.fillRect(-100,dy,200,200);g.fillStyle='#fff';g.fillRect(-100,dy-1,200,2);
    g.restore();g.strokeStyle='#ffeb3b';g.lineWidth=3;g.beginPath();g.moveTo(25,60);g.lineTo(50,60);g.moveTo(70,60);g.lineTo(95,60);g.moveTo(60,56);g.lineTo(60,64);g.stroke();
    // texte HUD
    let t='';
    if(S.mis){const m=Math.floor(S.reste/60),s=Math.floor(S.reste%60);t+=`⏱ <span style="color:${S.reste<30&&S.t0!==null?'#ff5252':'#fff'}">${m}:${String(s).padStart(2,'0')}</span> · ${S.mis.nom} · balises ${balises.filter(b=>b.ok).length}/${balises.length}<br>`}
    const tg=balises.find(b=>!b.ok);
    if(S.mis&&S.moteur&&!S.fin){let cap_='';if(tg){const dx=tg.p.x-S.x,dz=tg.p.z-S.z,rel=Math.atan2(dx,-dz)-S.psi,n=Math.atan2(Math.sin(rel),Math.cos(rel));cap_=Math.abs(n)<.15?'⬆ balise droit devant':n>0?'➡ balise à droite':'⬅ balise à gauche';cap_+=' · '+Math.round(Math.hypot(dx,dz))+' m · '+(tg.p.y>S.y+15?'monte':tg.p.y<S.y-15?'descends':'altitude OK')}else cap_='🛬 Reviens sur la piste, atterris et arrête-toi';t+=cap_+'<br>'}
    t+=`<span style="color:#ffe082">${S.msg}</span>`;hud.innerHTML=t;
    const sig=(S.etape)+'|'+S.moteur+'|'+(S.sol&&S.v<1.5)+'|'+S.vue+'|'+S.fin;if(sig!==lastAct){lastAct=sig;actionsBas()}
  }
  function dessine(dt,tt){
    av.position.set(S.x,S.y,S.z);av.rotation.order='YXZ';av.rotation.y=-S.psi;av.rotation.x=S.pitch;av.rotation.z=-S.roll;
    pales.rotation.z+=S.rpm*40*dt;disque.material.opacity=Math.min(.35,S.rpm*.5);pales.visible=S.rpm<.5;
    porte.rotation.y=THREE.MathUtils.lerp(porte.rotation.y,S.porte&&!S.cabine?1.2:S.porte?.1:0,Math.min(1,dt*4));
    gouv.rotation.y=-S.rudder*.5;mancheG.rotation.x=-S.yok.y*.4;mancheG.rotation.z=-S.yok.x*.5;
    const cp=S.vue==='cockpit'&&S.cabine;cock.visible=cp;coque.visible=!cp;
    if(cp){const lp=new THREE.Vector3(-.28,1.65,-.15).applyEuler(av.rotation).add(av.position);cam.position.copy(lp);const dir=new THREE.Vector3(0,.02,-10).applyEuler(av.rotation);cam.lookAt(lp.clone().add(dir));cam.rotateZ(-S.roll*.6)}
    else{
      if(S.etape<2){const rx=Math.cos(S.psi),rz=Math.sin(S.psi),fx=Math.sin(S.psi),fz=-Math.cos(S.psi);cam.position.set(S.x+rx*13-fx*5,S.y+4,S.z+rz*13+fz*5)}
      else cam.position.set(S.x-Math.sin(S.psi)*17,S.y+5.5,S.z+Math.cos(S.psi)*17);
      cam.lookAt(S.x,S.y+1.4,S.z)}
    nuages.forEach((n,i)=>n.position.x+=dt*(2+i%3));
    r.render(sc,cam);
  }
  let last=performance.now(),raf=0;
  function boucle(now){const dt=Math.min(.05,(now-last)/1000);last=now;pas(dt);instruments();dessine(dt,now/1000);raf=requestAnimationFrame(boucle)}
  dessineCheck();actionsBas();raf=requestAnimationFrame(boucle);
  const rs=()=>{const w=el.clientWidth||W0,h=Math.max(200,view.clientHeight||H0);r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};
  addEventListener('resize',rs);setTimeout(rs,50);
  return {
    stop(){cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',rs);sonMoteur(false);try{r.dispose()}catch(e){}el.innerHTML=''},
    etat:S,K,Y,tour:pas,choisir,etapes:ETAPES,dessineCheck,balises
  };
}
