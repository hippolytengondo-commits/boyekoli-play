// BOYEKOLI SPACE EXPLORER : système solaire, construction de fusée, 12 missions (vol simulé, rovers, station, quiz),
// astronaute personnalisable, observation du Congo, expérience de gravité. Simulation simplifiée, tout en local.
import * as THREE from 'three';
import {CORPS,vc,fusee,masse,nouvelEtat,pas,FE,VE} from './espace/sim.js';
import {PLANETES,MISSIONS,NIVEAUX,MODULES,SATURNE,CORPS_G} from './espace/data.js';

export function creerEspace(D){
  const {PAR,G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const SP=()=>{const a=A();if(!a.spat)a.spat={plan:[{m:3,r:3},{m:1,r:2}],col:'#e8e8e8',charge:'satellite',done:{},stars:{},badges:{},cert:null,astro:{col:'#ffffff',visor:'#2c7fb8',skin:3,robot:false,acc:'#d6302b'},vis:{},grav:{},congo:false};const s=a.spat;['done','stars','badges','vis','grav'].forEach(k=>{if(!s[k])s[k]={}});if(!s.astro)s.astro={col:'#ffffff',visor:'#2c7fb8',skin:3,robot:false,acc:'#d6302b'};return s};
  let ov=null,R=null,sc=null,cam=null,raf=0,pop=null,tab='base',mode='base',W=null,cs={yaw:.6,pitch:.25,dist:12,ty:0},ptr=new Map(),mis=null,keys={},tmr=0,sautSave=0,spin=null,planetes=[],modulesM=[],vis={};
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:8px 11px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#3b3f66'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const hold=(k,t)=>`<button onpointerdown="spKey('${k}',1)" onpointerup="spKey('${k}',0)" onpointerleave="spKey('${k}',0)" onpointercancel="spKey('${k}',0)" style="width:52px;height:52px;margin:3px;border-radius:14px;border:2px solid #fff4;background:#3b3f66;color:#fff;font-size:20px;touch-action:none">${t}</button>`;
  const sec=t=>`<div style="font-size:12px;opacity:.75;margin:5px 0 1px">${t}</div>`;
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>save(),400)};
  const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.7:r});
  const box=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
  const nbDone=()=>Object.keys(SP().done).length;
  const niveau=()=>{const n=nbDone();let r=NIVEAUX[0];NIVEAUX.forEach(x=>{if(n>=x[0])r=x});return r};
  // ---------- textures
  function texPlan(id){
    const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d');
    if(id==='terre'){g.fillStyle='#1f5fa8';g.fillRect(0,0,512,256);const X=l=>(l+180)/360*512,Y=l=>(90-l)/180*256;
      const poly=(pts,col)=>{g.fillStyle=col;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1])));g.closePath();g.fill()};
      poly([[-17,15],[-6,35],[10,37],[32,31],[43,12],[51,12],[41,-4],[40,-15],[33,-26],[20,-35],[14,-23],[12,-12],[9,-1],[8,4],[-8,4]],'#7a9a4a');
      poly([[12,-5],[15,3],[27,5],[31,-3],[29,-12],[22,-13],[13,-7]],'#2e7d32');      // RDC
      g.strokeStyle='#3fa9d9';g.lineWidth=2;g.beginPath();g.moveTo(X(26),Y(-11));g.quadraticCurveTo(X(30),Y(3),X(22),Y(1));g.quadraticCurveTo(X(20),Y(-2),X(16),Y(-3));g.lineTo(X(13),Y(-6));g.stroke();
      g.fillStyle='#ffd54f';g.beginPath();g.arc(X(15.3),Y(-4.3),4,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();
      poly([[-10,36],[30,36],[40,60],[0,70],[-10,50]],'#6b8f4a');poly([[-80,10],[-60,-5],[-40,-20],[-60,-50],[-75,-30]],'#6b8f4a');poly([[-120,30],[-80,25],[-90,50],[-125,55]],'#6b8f4a');
      g.fillStyle='#f4f8fb';g.fillRect(0,0,512,14);g.fillRect(0,242,512,14)}
    else if(id==='mars'||id==='lune'||id==='aster'){const b={mars:'#b5572f',lune:'#a9a9a9',aster:'#8a7a66'}[id];g.fillStyle=b;g.fillRect(0,0,512,256);for(let i=0;i<120;i++){g.fillStyle=`rgba(0,0,0,${.05+Math.random()*.15})`;g.beginPath();g.arc(Math.random()*512,Math.random()*256,3+Math.random()*16,0,7);g.fill()}}
    else{const pl=PLANETES.find(p=>p.id===id)||{col:'#999'};g.fillStyle=pl.col;g.fillRect(0,0,512,256);for(let y=0;y<256;y+=14){g.fillStyle=`rgba(255,255,255,${Math.random()*.18})`;g.fillRect(0,y,512,7+Math.random()*7)}}
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
  const sphere=(id,r)=>new THREE.Mesh(new THREE.SphereGeometry(r,48,32),new THREE.MeshStandardMaterial({map:texPlan(id),roughness:.9}));
  function etoiles(g,r){const p=new Float32Array(900*3);for(let i=0;i<900;i++){const u=Math.random()*Math.PI*2,v=Math.acos(2*Math.random()-1);p.set([r*Math.sin(v)*Math.cos(u),r*Math.sin(v)*Math.sin(u),r*Math.cos(v)],i*3)}
    const o=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(p,3)),new THREE.PointsMaterial({color:'#ffffff',size:r>1000?5:.25}));g.add(o)}
  // ---------- modèles
  function fuseeMesh(plan,col,charge,cur){
    const g=new THREE.Group();let y=0;const mc=M(col||'#e8e8e8',.4);
    plan.forEach((e,i)=>{if(i<(cur||0))return;const h=1.4+.55*e.r;const c=new THREE.Mesh(new THREE.CylinderGeometry(.9-.08*i,.9-.08*(i-1<0?0:i-1)+.0,h,18),mc);c.position.y=y+h/2;g.add(c);box(g,1.9,.12,1.9,M('#d6302b'),0,y+.06,0).visible=i<plan.length-1;
      for(let k=0;k<e.m;k++){const a=k/e.m*Math.PI*2,rr=e.m===1?0:.45,n=new THREE.Mesh(new THREE.ConeGeometry(.28,.6,10),M('#444'));n.position.set(Math.cos(a)*rr,y-.2,Math.sin(a)*rr);n.rotation.x=Math.PI;g.add(n)}
      y+=h});
    if(charge==='satellite'){box(g,.6,.6,.6,M('#d9c7a0'),0,y+.3,0);[-1,1].forEach(s=>box(g,1.1,.06,.5,M('#1b3a6b'),s*.85,y+.3,0));y+=.6}
    else if(charge==='rover'){box(g,.8,.4,.6,M('#b9b9b9'),0,y+.2,0);y+=.45}
    const nose=new THREE.Mesh(new THREE.ConeGeometry(.85,1.6,18),M('#d6302b',.4));nose.position.y=y+.8;g.add(nose);y+=1.6;g.userData.h=y;
    const fl=new THREE.Mesh(new THREE.ConeGeometry(.5,3,12),new THREE.MeshBasicMaterial({color:'#ffb030',transparent:true,opacity:.85}));fl.rotation.x=Math.PI;fl.position.y=-1.4;fl.visible=false;g.add(fl);g.userData.flame=fl;return g}
  function astro(a){
    const g=new THREE.Group(),suit=M(a.col,.5);
    if(a.robot){box(g,.9,1.1,.7,M('#c0c4cc',.3),0,1.1,0);box(g,.7,.5,.6,M('#c0c4cc',.3),0,1.95,0);[-1,1].forEach(s=>{box(g,.18,.18,.05,M('#7CFC00'),s*.18,2,.31);box(g,.2,.9,.2,M('#aab',.4),s*.6,1.1,0);box(g,.28,.8,.3,M('#8a8f99',.4),s*.25,.4,0)});box(g,.05,.4,.05,M('#888'),0,2.4,0);const b=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),M(a.acc));b.position.set(0,2.65,0);g.add(b);box(g,.3,.3,.05,M(a.acc),0,1.2,.36)}
    else{box(g,.9,1.1,.55,suit,0,1.15,0);[-1,1].forEach(s=>{const arm=box(g,.28,.9,.28,suit,s*.62,1.2,0);arm.rotation.z=s*.15;box(g,.3,.9,.3,suit,s*.22,.4,0);box(g,.34,.2,.42,M('#555'),s*.22,-.05,.06);box(g,.3,.2,.3,M('#bbb'),s*.66,.7,0)});
      box(g,.62,.8,.3,M('#cfd3d8'),0,1.2,-.42);box(g,.5,.25,.05,M(a.acc),0,1.4,.29);
      const h=new THREE.Mesh(new THREE.SphereGeometry(.5,20,16),M('#f4f4f4',.3));h.position.y=2.1;g.add(h);const v=new THREE.Mesh(new THREE.SphereGeometry(.4,16,12),new THREE.MeshStandardMaterial({color:a.visor,roughness:.1,metalness:.5}));v.position.set(0,2.1,.18);v.scale.z=.7;g.add(v);
      const f=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),M(['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'][a.skin]||'#7a4a2e'));f.position.set(0,2.08,.28);f.scale.z=.5;g.add(f)}
    return g}
  function station(){
    const g=new THREE.Group();box(g,16,.3,.3,M('#9aa0a6'),0,0,0);
    const pos=[[-5,0,0],[-2,0,0],[1.5,0,0],[5,0,0],[0,0,0]];
    MODULES.forEach((m,i)=>{let o;
      if(m.id==='solaire'){o=new THREE.Group();[-1,1].forEach(s=>{const p=box(o,.1,5,2.2,M('#1b3a6b',.2),0,s*3.4,0);const q=box(o,.12,5,.05,M('#aab8d8'),0,s*3.4,0)});o.position.set(-6.5,0,0);o.rotation.z=0}
      else if(m.id==='coupole'){o=new THREE.Mesh(new THREE.SphereGeometry(1.1,16,12),M(m.col,.2));o.position.set(5.5,.6,0)}
      else if(m.id==='sas'){o=new THREE.Group();box(o,1.2,1.2,1.2,M(m.col),0,0,0);box(o,.15,.15,3,M('#ddd'),0,.8,1.4);o.position.set(1.8,0,1.6)}
      else{o=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,3.2,16),M(m.col,.4));o.rotation.z=Math.PI/2;o.position.set(m.id==='labo'?-2.5:1.8,0,m.id==='labo'?0:-1.6)}
      o.traverse(q=>{q.userData.part=m.id});o.userData.part=m.id;g.add(o)});
    return g}
  // ---------- scènes
  function vider(){if(W)sc.remove(W);W=new THREE.Group();sc.add(W);planetes=[];modulesM=[];spin=null;sc.fog=null}
  function monter(m){
    mode=m;vider();cs={yaw:.6,pitch:.25,dist:12,ty:0};sc.background=new THREE.Color('#05070f');
    if(m==='base'){const s=SP();spin=fuseeMesh(s.plan,s.col,s.charge);spin.position.y=-spin.userData.h/2;const gr=new THREE.Group();gr.add(spin);W.add(gr);spin=gr;cs.dist=14;etoiles(W,60);const sol=new THREE.Mesh(new THREE.CylinderGeometry(4,4,.3,28),M('#44485a'));sol.position.y=-spin.children[0].userData.h/2-.2;W.add(sol)}
    else if(m==='systeme'){cs.dist=78;cs.pitch=.7;etoiles(W,300);PLANETES.forEach((p,i)=>{const mm=sphere(p.id==='soleil'?'x':p.id,p.r);if(p.id==='soleil'){mm.material=new THREE.MeshBasicMaterial({color:'#ffcf3a'})}mm.userData.part=p.id;const grp=new THREE.Group();grp.userData={p,ang:i*1.3};mm.position.x=p.d;grp.add(mm);if(p.anneau){const rg=new THREE.Mesh(new THREE.RingGeometry(p.r*1.3,p.r*2.1,40),new THREE.MeshBasicMaterial({color:'#cdbb8a',side:THREE.DoubleSide,transparent:true,opacity:.7}));rg.rotation.x=Math.PI/2.4;rg.position.x=p.d;grp.add(rg)}
        if(p.d){const ring=new THREE.Mesh(new THREE.RingGeometry(p.d-.05,p.d+.05,90),new THREE.MeshBasicMaterial({color:'#334',side:THREE.DoubleSide}));ring.rotation.x=Math.PI/2;W.add(ring)}W.add(grp);planetes.push(grp)});W.add(new THREE.PointLight('#ffffff',2.5,0,0));sc.add(W)}
    else if(m==='terre'){const t=sphere('terre',3);t.rotation.y=-Math.PI*(15.3+90)/180+Math.PI/2*0;W.add(t);spin=null;etoiles(W,80);cs.dist=9;cs.yaw=.1;cs.pitch=.1;t.rotation.y=-1.0;cs.terre=t}
    else if(m==='station'){W.add(station());etoiles(W,80);const e=sphere('terre',20);e.position.set(0,-28,-15);W.add(e);cs.dist=18;cs.pitch=.3}
    else if(m==='saturne'){const p=sphere('saturne',3.2);W.add(p);const rg=new THREE.Mesh(new THREE.RingGeometry(4.2,7,60),new THREE.MeshBasicMaterial({color:'#cdbb8a',side:THREE.DoubleSide,transparent:true,opacity:.8}));rg.rotation.x=Math.PI/2.3;W.add(rg);etoiles(W,80);cs.dist=16}
    else if(m==='astro'){const g=astro(SP().astro);g.position.y=-1.5;W.add(g);spin=g;cs.dist=7;cs.ty=.2;etoiles(W,60)}
    else if(m==='vol'){}
    else if(m==='rover'){}
    sc.add(W)}
  // ---------- vol
  function lancerMission(id){
    const mi=MISSIONS.find(x=>x.id===id),sp=SP();stopTout();
    mis={mi,t:0,win:false,lose:null,auto:true,phase:'terre',x2:1,vit:1};
    if(mi.type==='vol')initVol(mi,sp);else if(mi.type==='rover')initRover(mi);else if(mi.type==='station'){mis.vis={};monter('station');tab='mis';rendMis()}else if(mi.type==='quiz'){mis.q=0;mis.ok=0;monter('saturne');rendMis()}
    PAR.dire('Mission : '+mi.nom+'. '+mi.txt,'mavungu')}
  function plan0(mi,sp){
    if(mi.id==='s5')return {corps:'terre',plan:[{m:1,r:2}],dep:{h:150,vx:vc('terre',150),vy:0},charge:1};
    if(mi.id==='s6')return {corps:'lune',plan:[{m:1,r:1}],dep:{h:40,vx:vc('lune',40),vy:0},charge:2};
    if(mi.id==='s9')return {corps:'aster',plan:[{m:1,r:1}],dep:{h:30,vx:vc('aster',30),vy:0},charge:2};
    return {corps:'terre',plan:sp.plan.map(e=>Object.assign({},e)),dep:{},charge:sp.charge==='rover'?4:sp.charge==='capsule'?3:2}}
  function initVol(mi,sp){
    const c=plan0(mi,sp);const f=fusee(c.plan,c.charge),s=nouvelEtat(c.corps,f,c.dep);mis.s=s;mis.c=c;mis.corps=c.corps;mis.auto=c.corps==='terre'&&mi.id!=='s5'?true:true;mis.cible=150;mis.orb=0;mis.dock=false;mis.dep=false;
    mode='vol';tab='mis';vider();const C=CORPS[c.corps];sc.background=new THREE.Color(C.atm?'#7fb4e8':'#000000');
    const pl=sphere(c.corps,C.R);W.add(pl);etoiles(W,3500);
    const ring=new THREE.Mesh(new THREE.RingGeometry(C.R+mis.cible-.4,C.R+mis.cible+.4,200),new THREE.MeshBasicMaterial({color:'#7CFC00',side:THREE.DoubleSide,transparent:true,opacity:.5}));if(mi.id==='s2'||mi.id==='s3'||mi.id==='s4'||mi.id==='s12')W.add(ring);
    mis.rk=null;mis.cur=-1;mis.camAng=0;majFusee();rendMis()}
  function majFusee(){
    const s=mis.s;if(mis.rk&&mis.cur===s.f.cur)return;if(mis.rk)W.remove(mis.rk);mis.cur=s.f.cur;mis.rk=fuseeMesh(s.f.et,SP().col,mis.c.charge===1?'':'satellite',s.f.cur);mis.rk.userData.base=new THREE.Group();W.add(mis.rk)}
  function stepVol(dt){
    const s=mis.s;if(!s||mis.win||mis.lose)return;let n=Math.round(dt/.033*mis.x2);
    const s5=mis.mi.id==='s5',cmd={mode:s.corps==='terre'&&!s5?'montee':'atterri',auto:!s5&&mis.auto&&(s.corps!=='terre'||s.lance),cibleH:mis.cible};
    for(let i=0;i<n;i++){
      if(!cmd.auto){if(keys.l)s.th-=1.3*.033;if(keys.r)s.th+=1.3*.033;s.th=Math.max(-1.6,Math.min(1.6,s.th))}
      if(s5&&mis.auto){s.th=Math.PI/2;s.pouss=true}
      pas(s,.033,cmd);mis.t+=.033;if(s.sep){s.sep=false;majFusee();toast('🚀 Séparation de l’étage !')}
      verifier();if(mis.win||mis.lose)break}}
  function orbiteStable(s){const v=vc(s.corps,s.h);return s.h>=120&&s.h<=260&&Math.abs(s.vy)<4&&s.vx>=.96*v}
  function verifier(){
    const s=mis.s,id=mis.mi.id,fuel=s.f.et.reduce((t,e)=>t+e.f,0);
    if(s.fini==='crash'){mis.lose='crash';return finVol()}
    if(s.fini==='pose'){if(id==='s6'||id==='s9'||(id==='s12'&&mis.phase==='lune')){mis.win=true;return finVol()}}
    if(id==='s1'&&s.h>=40){mis.win=true;return finVol()}
    if(id==='s2'||id==='s3'||id==='s4'||(id==='s12'&&mis.phase==='terre')){mis.orb=orbiteStable(s)?mis.orb+.033:0;
      if(id==='s2'&&mis.orb>=3){mis.win=true;return finVol()}
      if(id==='s12'&&mis.phase==='terre'&&mis.orb>=3){phaseLune();return}}
    if(id==='s5'&&s.h>100&&s.vx>=1.38*vc('terre',s.h)){mis.win=true;return finVol()}
    if(s.h>5000||(fuel<=.01&&s.h>0&&s.vy>0&&s.corps==='terre'&&s.t>10&&!orbiteStable(s)&&!(id==='s5'))){if(s.h<=5000&&(id!=='s1'))mis.lose='fuel';else if(s.h>5000)mis.lose='trop';else return;finVol()}
    if(fuel<=.01&&id!=='s6'&&id!=='s9'&&id!=='s12'&&Math.abs(s.vy)<.5&&s.h>0&&!orbiteStable(s)&&id!=='s3'&&id!=='s4'&&s.t>12){mis.lose=mis.lose||'fuel';finVol()}}
  function phaseLune(){
    mis.phase='lune';const f=fusee([{m:1,r:1}],2),s=nouvelEtat('lune',f,{h:40,vx:vc('lune',40),vy:0});mis.s=s;mis.orb=0;mis.cible=40;toast('🌙 Transfert réussi : module lunaire prêt !');
    vider();sc.background=new THREE.Color('#000');W.add(sphere('lune',CORPS.lune.R));etoiles(W,3500);mis.rk=null;mis.cur=-1;majFusee();rendMis();PAR.dire('Orbite atteinte. Maintenant, pose le module sur la Lune.','mavungu')}
  function finVol(){
    const s=mis.s,assist=mis.auto;
    if(mis.win){recompense(mis.mi,assist?2:3)}else{SFX.ko&&SFX.ko()}
    rendMis()}
  // ---------- rover
  const hg=(x,z)=>Math.sin(x*.13)*1.3+Math.cos(z*.11)*1.1+Math.sin((x+z)*.06)*2.2;
  function initRover(mi){
    mode='rover';tab='mis';vider();sc.background=new THREE.Color(mi.corps==='mars'?'#d9a37a':'#000000');if(mi.corps==='mars')sc.fog=new THREE.Fog('#d9a37a',25,110);else etoiles(W,300);
    const geo=new THREE.PlaneGeometry(220,220,90,90);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,hg(p.getX(i),p.getZ(i)));geo.computeVertexNormals();
    W.add(new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:texPlan(mi.corps==='mars'?'mars':'lune'),roughness:1})));W.add(new THREE.HemisphereLight('#ffffff','#554433',1.3));
    const rv=new THREE.Group();box(rv,1.6,.4,2.2,M('#e8e8e8'),0,.7,0);box(rv,.2,.9,.2,M('#888'),0,1.3,.6);box(rv,.8,.1,.5,M('#1b3a6b'),0,1.8,.6);[[-.9,-.8],[.9,-.8],[-.9,.8],[.9,.8]].forEach(([a,b])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.3,12),M('#222'));w.rotation.z=Math.PI/2;w.position.set(a,.42,b);rv.add(w)});W.add(rv);
    const ech=[];for(let i=0;i<5;i++){const a=i*1.26+.3,d=14+i*5,x=Math.cos(a)*d,z=Math.sin(a)*d,m=new THREE.Mesh(new THREE.DodecahedronGeometry(.6),new THREE.MeshStandardMaterial({color:'#ffd54f',emissive:'#ffa000',emissiveIntensity:.8}));m.position.set(x,hg(x,z)+.9,z);W.add(m);ech.push(m)}
    mis.rv=rv;mis.ech=ech;mis.px=0;mis.pz=0;mis.ang=0;mis.vy=0;mis.y=0;mis.got=0;rendMis()}
  function stepRover(dt){
    if(!mis||!mis.rv||mis.win)return;const sp=(keys.f?1:0)-(keys.b?1:0),tu=(keys.r?1:0)-(keys.l?1:0);mis.t+=dt;
    mis.ang-=tu*1.6*dt;mis.px+=Math.sin(mis.ang)*sp*7*dt;mis.pz+=Math.cos(mis.ang)*sp*7*dt;const lim=100;mis.px=Math.max(-lim,Math.min(lim,mis.px));mis.pz=Math.max(-lim,Math.min(lim,mis.pz));
    const g=mis.mi.corps==='mars'?3.7:1.6;if(keys.u&&mis.y<=.01)mis.vy=6;mis.vy-=g*dt*2;mis.y=Math.max(0,mis.y+mis.vy*dt);if(mis.y===0&&mis.vy<0)mis.vy=0;
    const y=hg(mis.px,mis.pz);mis.rv.position.set(mis.px,y+mis.y,mis.pz);mis.rv.rotation.y=mis.ang;
    mis.ech.forEach(e=>{if(e.visible&&Math.hypot(e.position.x-mis.px,e.position.z-mis.pz)<2.6){e.visible=false;mis.got++;SFX.coin&&SFX.coin();rendMis();if(mis.got>=5){mis.win=true;recompense(mis.mi,mis.t<110?3:2);rendMis()}}else e.rotation.y+=dt*2});
    cam.position.set(mis.px-Math.sin(mis.ang)*9,y+5,mis.pz-Math.cos(mis.ang)*9);cam.lookAt(mis.px,y+1,mis.pz)}
  // ---------- récompenses
  function recompense(mi,stars){
    const s=SP(),a=A(),prem=!s.done[mi.id];s.done[mi.id]=true;s.stars[mi.id]=Math.max(s.stars[mi.id]||0,stars);mis.prem=prem;mis.stars=stars;
    if(prem){a.pieces+=mi.pieces;a.xp+=mi.pieces;refreshHud();const t=a.tal||(a.tal={});t.espace=(t.espace||0)+10}
    const n=nbDone();let ex='';
    if(n>=6&&!a.done['met:s1']){a.done['met:s1']=true;a.stars['met:s1']=2;s.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();mis.badge=true}
    if(n>=12)a.stars['met:s1']=3;
    save();SFX.win&&SFX.win();PAR.dire('Mission réussie ! Bravo, astronaute.','mavungu')}
  // ---------- boucle
  function boucle(){
    raf=requestAnimationFrame(boucle);if(!R)return;const t=performance.now(),dt=Math.min(.05,(t-(boucle.t||t))/1000);boucle.t=t;
    if(mode==='vol'&&mis&&mis.s){stepVol(dt);vue_vol();majHud()}
    else if(mode==='rover'&&mis)stepRover(dt);
    else{
      if(spin)spin.rotation.y+=dt*.5;
      if(mode==='systeme')planetes.forEach(g=>{g.rotation.y+=dt*g.userData.p.per*.25;const m=g.children[0];m.rotation.y+=dt*.3});
      if(mode==='terre'&&cs.terre&&cs.auto!==false)cs.terre.rotation.y+=dt*.12;
      const d=cs.dist,cp=Math.cos(cs.pitch);cam.position.set(Math.sin(cs.yaw)*cp*d,cs.ty+Math.sin(cs.pitch)*d,Math.cos(cs.yaw)*cp*d);cam.lookAt(0,cs.ty,0)}
    R.render(sc,cam)}
  function vue_vol(){
    const s=mis.s,C=CORPS[s.corps],r=C.R+s.h,phi=s.pos;const rk=mis.rk;if(!rk)return;
    rk.position.set(Math.sin(phi)*r,Math.cos(phi)*r,0);rk.rotation.z=-(phi+s.th);
    const fl=rk.userData.flame;if(fl){fl.visible=!!s.brule;fl.scale.set(1,.7+Math.random()*.5,1)}
    const up=new THREE.Vector3(Math.sin(phi),Math.cos(phi),0);cam.up.copy(up);
    const ex=Math.max(0,Math.min(1,s.h/260));cam.position.copy(rk.position).add(new THREE.Vector3(0,0,34+ex*20)).add(up.clone().multiplyScalar(2));cam.lookAt(rk.position.clone().add(up.clone().multiplyScalar(1.5)));
    if(C.atm){const k=Math.max(0,1-s.h/180);sc.background.set(new THREE.Color('#000000').lerp(new THREE.Color('#7fb4e8'),k))}}
  function majHud(){
    const e=$('sphud');if(!e||!mis||!mis.s)return;const s=mis.s,v=vc(s.corps,s.h);
    e.innerHTML=`⛰ Altitude <b>${Math.round(s.h)}</b> · ➡ Vitesse horizontale <b>${Math.round(s.vx)}</b> (orbitale ${Math.round(v)}) · ⬆ Vitesse verticale <b>${Math.round(s.vy)}</b> · ⏱ ${Math.round(mis.t)} s<br>⛽ ${s.f.et.map((q,i)=>(i<s.f.cur?'—':Math.round(q.f)+'/'+q.fuel)).join(' | ')} ${mis.orb>0?' · 🛰 Orbite stable '+Math.min(3,Math.round(mis.orb*10)/10)+' s':''}`;
    const b=$('spact');if(b&&!mis.win&&!mis.lose){const id=mis.mi.id;b.disabled=!((id==='s3'&&orbiteStable(s)&&mis.orb>=1)||(id==='s4'&&orbiteStable(s)&&mis.orb>=1&&s.f.et.reduce((t,q)=>t+q.f,0)>=1))}}
  // ---------- ouverture
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);SP();
    ov=document.createElement('div');ov.id='spov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#0a0c1a;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#1a1f5e,#6a2fa0);flex:0 0 auto"><b style="flex:1;font-size:13px">🚀 BOYEKOLI SPACE EXPLORER</b>${btn('✖','spQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div>
    <div id="sp3d" style="flex:1;position:relative;min-height:0"><div id="spmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(10,12,30,.92);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div></div>
    <div id="sptabs" style="display:flex;overflow-x:auto;background:#070916;flex:0 0 auto"></div><div id="spsheet" style="height:38vh;overflow:auto;padding:7px 9px;background:#151a3a;flex:0 0 auto"></div><div id="spover" style="position:absolute;inset:0;background:rgba(8,10,26,.97);display:none;flex-direction:column;padding:10px 10px 84px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'spRetour()',coin:true,cible:'#sp3d'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('sp3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(50,1,.3,9000);sc.add(new THREE.HemisphereLight('#ffffff','#445566',1.4));const dl=new THREE.DirectionalLight('#ffffff',1.6);dl.position.set(5,8,6);sc.add(dl);
    const rs=()=>{const c=$('sp3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}};setTimeout(rs,60);window.addEventListener('resize',rs);ov._rs=rs;
    entrees();tab='base';mis=null;monter('base');rendTabs();rend();
    try{history.pushState({sp:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);kbs();raf=requestAnimationFrame(boucle);
    PAR.dire('Bienvenue au centre spatial Boyekoli. Prépare ta fusée, astronaute !','mavungu')}
  const kdn=e=>{if(!ov)return;const m={arrowup:'f',w:'f',z:'f',arrowdown:'b',s:'b',arrowleft:'l',q:'l',a:'l',arrowright:'r',d:'r',' ':'u'}[e.key.toLowerCase()];if(m)keys[m]=e.type==='keydown'};
  function kbs(){window.addEventListener('keydown',kdn);window.addEventListener('keyup',kdn)}
  function stopTout(){keys={};mis=null}
  function fermer(){if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',ov._rs);window.removeEventListener('keydown',kdn);window.removeEventListener('keyup',kdn);try{R.dispose()}catch(e){}ov.remove();ov=null;R=sc=W=null;mis=null;ptr.clear();save()}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('spover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('spover');if(o){o.style.display='none';o.innerHTML=''}}
  function msg(t,ms){const m=$('spmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3000)}
  // ---------- entrées 3D
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function entrees(){
    const cv=R.domElement;cv.style.touchAction='none';
    cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,mv:false})});
    cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p||mode==='vol'||mode==='rover')return;if(Math.hypot(e.clientX-p.x0,e.clientY-p.y0)>6)p.mv=true;
      if(ptr.size===2){const a=[...ptr.values()],d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptr.values()],d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);cs.dist=Math.max(3,Math.min(160,cs.dist-(d1-d0)*.05*cs.dist/12));return}
      cs.yaw-=(e.clientX-p.x)*.008;cs.pitch=Math.max(-1.2,Math.min(1.5,cs.pitch+(e.clientY-p.y)*.006));p.x=e.clientX;p.y=e.clientY});
    cv.addEventListener('pointerup',e=>{const p=ptr.get(e.pointerId);ptr.delete(e.pointerId);if(p&&!p.mv&&ptr.size===0)toucher(e)});
    cv.addEventListener('wheel',e=>{e.preventDefault();cs.dist=Math.max(3,Math.min(160,cs.dist*(1+e.deltaY*.0015)))},{passive:false})}
  function toucher(e){
    if(mode!=='systeme'&&mode!=='station')return;const b=R.domElement.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);
    const h=ray.intersectObjects(W.children,true);for(const x of h){let o=x.object;while(o&&!o.userData.part)o=o.parent;if(o){if(mode==='systeme')planeteInfo(o.userData.part);else moduleInfo(o.userData.part);return}}}
  function planeteInfo(id){
    const p=PLANETES.find(x=>x.id===id),s=SP();if(!p)return;const prem=!s.vis[id];s.vis[id]=true;let ex='';
    if(prem&&Object.keys(s.vis).length>=9&&!s.badges.ciel){s.badges.ciel=true;A().pieces+=5;refreshHud();ex=' 🏅 Badge « Observateur du ciel » (+5 🪙)'}sauve();
    const e=$('spsheet');e.innerHTML=`<b style="font-size:15px">🪐 ${esc(p.nom)}</b><p style="font-size:13px">${esc(p.txt)}</p><p style="font-size:12px">Gravité à la surface : ${p.g} m/s² · poids d’un enfant de 30 kg : ${Math.round(30*p.g/9.8)} kg-équivalent</p><p style="font-size:12px">Planètes découvertes : ${Object.keys(s.vis).length}/9${ex}</p>`+(id==='terre'?btn('🌍 Observer le Congo','spTerre()','#2e7d32'):'')+btn('↩ Menu Univers','spTab(\'univ\')');PAR.dire(p.txt,'bea')}
  function moduleInfo(id){
    const m=MODULES.find(x=>x.id===id);if(!m)return;const e=$('spsheet');let ex='';
    if(mis&&mis.mi&&mis.mi.type==='station'&&!mis.win){mis.vis[id]=true;if(Object.keys(mis.vis).length>=5){mis.win=true;recompense(mis.mi,3);rendMis();return}ex=`<p style="font-size:12px">Modules visités : ${Object.keys(mis.vis).length}/5</p>`}
    e.innerHTML=`<b style="font-size:15px">🛰 ${esc(m.nom)}</b><p style="font-size:13px">${esc(m.txt)}</p>${ex}`;PAR.dire(m.txt,'bea')}
  // ---------- onglets
  const TABS=[['base','🏠 Base'],['fus','🚀 Fusée'],['mis','🛰 Missions'],['univ','🔭 Univers'],['astro','🧑‍🚀 Astronaute'],['grav','⚖ Gravité']];
  function rendTabs(){$('sptabs').innerHTML=TABS.map(t=>`<button onclick="spTab('${t[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#cfd8e3'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  function setTab(t){mis=null;keys={};tab=t;const m={base:'base',fus:'base',mis:'base',univ:'systeme',astro:'astro',grav:'base'}[t];if(mode!==m||m==='base')monter(m);rendTabs();rend()}
  const evalFusee=plan=>{const f=fusee(plan,2),s=nouvelEtat('terre',f);s.lance=true;const cmd={mode:'montee',auto:true,cibleH:150};let o=0,t=0;while(t<120&&!s.fini){pas(s,.05,cmd);t+=.05;if(orbiteStable(s))o+=.05;else o=0;if(o>3)return {ok:true,fuel:Math.round(f.et.reduce((q,e)=>q+e.f,0))}}return {ok:false}};
  function rend(){
    const sh=$('spsheet');if(!sh)return;const s=SP();let h='';
    if(mis){return rendMis()}
    if(tab==='base'){const n=niveau();h=`<b style="font-size:15px">${n[2]} ${esc(n[1])}</b><p style="font-size:13px">Missions réussies : <b>${nbDone()}/12</b> (6 suffisent pour valider l’exploration spatiale).</p><div style="background:#0a0c1a;border-radius:6px;height:10px"><div style="height:10px;width:${nbDone()/12*100}%;background:#ffd54f;border-radius:6px"></div></div><p style="font-size:12px;opacity:.85">Niveaux : ${NIVEAUX.map(x=>(nbDone()>=x[0]?x[2]:'▫️')+' '+x[1]+' ('+x[0]+')').join(' · ')}</p>`+btn('🚀 Construire ma fusée','spTab(\'fus\')','#6a2fa0')+btn('🛰 Missions','spTab(\'mis\')','#2e7d32')+btn('🔭 Univers','spTab(\'univ\')','#2c7fb8')+(s.cert?btn('🎓 Mon certificat','spCert()','#6a1b9a'):'')}
    else if(tab==='fus'){
      const r=evalFusee(s.plan),m0=masse(fusee(s.plan,s.charge==='rover'?4:s.charge==='capsule'?3:2)),twr=FE*s.plan[0].m/m0/10;
      h=`<b>🚀 Atelier de construction</b><p style="font-size:12px;margin:2px 0">Poussée/poids au décollage : <b>${twr.toFixed(1)}</b> (il faut > 1,3) · Masse : ${Math.round(m0)}</p><p style="font-size:13px;margin:2px 0">${r.ok?'✅ <b>Test : cette fusée atteint l’orbite</b>':'❌ <b>Test : cette fusée n’atteint pas l’orbite</b> (plus de moteurs ou de réservoirs ?)'}</p>`+s.plan.map((e,i)=>`<div style="background:#0a0c1a;border-radius:10px;padding:5px 8px;margin:3px 0;font-size:13px"><b>Étage ${i+1}</b> · Moteurs <b>${e.m}</b> ${btn('−',`spFus(${i},'m',-1)`,'','padding:2px 8px')}${btn('+',`spFus(${i},'m',1)`,'','padding:2px 8px')} · Réservoirs <b>${e.r}</b> ${btn('−',`spFus(${i},'r',-1)`,'','padding:2px 8px')}${btn('+',`spFus(${i},'r',1)`,'','padding:2px 8px')}</div>`).join('')+btn('➕ Ajouter un étage','spFus(0,\'add\',1)')+btn('➖ Retirer un étage','spFus(0,\'add\',-1)')+sec('Charge utile')+[['satellite','🛰 Satellite'],['capsule','👩‍🚀 Capsule'],['rover','🤖 Rover']].map(c=>btn(c[1],`spCharge('${c[0]}')`,s.charge===c[0]?'#ffd54f':'')).join('')+sec('Couleur')+['#e8e8e8','#d6302b','#2c7fb8','#f4c20d','#2e7d32'].map(c=>`<button onclick="spCoul('${c}')" style="width:30px;height:30px;margin:2px;border-radius:50%;border:3px solid ${s.col===c?'#fff':'#0006'};background:${c}"></button>`).join('')}
    else if(tab==='mis'){
      h='<b style="font-size:14px">🛰 Missions spatiales</b>'+MISSIONS.map(m=>{const ok=s.done[m.id];return `<div style="background:#0a0c1a;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${ok?'✅':'▫️'} ${m.id.slice(1)}. ${esc(m.nom)}</b> ${ok?'⭐'.repeat(s.stars[m.id]||1):''}<br><span style="opacity:.85">${esc(m.txt)}</span><br>${btn('▶ '+(ok?'Rejouer':'Lancer'),`spLancer('${m.id}')`,'#2e7d32')}</div>`}).join('')}
    else if(tab==='univ'){
      h=sec('Touche une planète pour la découvrir ('+Object.keys(s.vis).length+'/9)')+btn('☀️ Système solaire','spMonter(\'systeme\')','#2c7fb8')+btn('🌍 Terre et Congo','spTerre()','#2e7d32')+btn('🛰 Station spatiale','spStationLibre()','#6a2fa0')+btn('🪐 Saturne','spMonter(\'saturne\')','#8a6a2a')+'<p style="font-size:12px;opacity:.85">Glisse pour tourner, pince pour zoomer.</p>'}
    else if(tab==='astro'){
      const a=s.astro;h=sec('Combinaison')+['#ffffff','#d6302b','#2c7fb8','#f4c20d','#2e7d32','#e84393'].map(c=>`<button onclick="spAstro('col','${c}')" style="width:30px;height:30px;margin:2px;border-radius:50%;border:3px solid ${a.col===c?'#fff':'#0006'};background:${c}"></button>`).join('')+sec('Visière')+['#2c7fb8','#f4c20d','#2e7d32','#7b3fa0'].map(c=>`<button onclick="spAstro('visor','${c}')" style="width:30px;height:30px;margin:2px;border-radius:50%;border:3px solid ${a.visor===c?'#fff':'#0006'};background:${c}"></button>`).join('')+sec('Visage')+[0,1,2,3,4,5].map(i=>`<button onclick="spAstro('skin',${i})" style="width:30px;height:30px;margin:2px;border-radius:50%;border:3px solid ${a.skin===i?'#fff':'#0006'};background:${['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'][i]}"></button>`).join('')+sec('Insigne')+['#d6302b','#2c7fb8','#f4c20d','#2e7d32'].map(c=>`<button onclick="spAstro('acc','${c}')" style="width:30px;height:30px;margin:2px;border-radius:6px;border:3px solid ${a.acc===c?'#fff':'#0006'};background:${c}"></button>`).join('')+sec('Équipier')+btn('🧑‍🚀 Astronaute',"spAstro('robot',false)",!a.robot?'#ffd54f':'')+btn('🤖 Robot',"spAstro('robot',true)",a.robot?'#ffd54f':'')}
    else{
      h=`<b>⚖ Expérience de gravité</b><p style="font-size:13px;margin:2px 0">Lâche une balle de 10 m de hauteur sur chaque astre. Où tombe-t-elle le plus lentement ?</p>`+CORPS_G.map(c=>btn(c[0]+' ('+c[1]+')',`spChute('${c[0]}',${c[1]})`,s.grav[c[0]]?'#2e7d32':'')).join('')+`<div id="gvbox" style="position:relative;height:120px;background:#0a0c1a;border-radius:10px;margin-top:6px;overflow:hidden"><div id="gvb" style="position:absolute;left:50%;top:4px;width:22px;height:22px;margin-left:-11px;border-radius:50%;background:#ffd54f"></div></div><p id="gvt" style="font-size:13px"></p>`}
    sh.innerHTML=h}
  function rendMis(){
    const sh=$('spsheet');if(!sh||!mis)return;const mi=mis.mi;let h='';
    const fin=mis.win?`<div style="text-align:center"><div style="font-size:34px">🚀🎉</div><b>Mission réussie !</b> ${'⭐'.repeat(mis.stars||2)}<p style="font-size:13px">${mis.prem?'+'+mi.pieces+' 🪙':'Déjà réussie'}${mis.badge?' · 🏅 Exploration spatiale validée (+15 🪙)':''}</p>${btn('↩ Missions','spTab(\'mis\')','#2e7d32')}${mis.badge||SP().cert?btn('🎓 Certificat','spCert()','#6a1b9a'):''}</div>`:mis.lose?`<div style="text-align:center"><div style="font-size:34px">💥</div><b>${mis.lose==='crash'?'Crash !':mis.lose==='fuel'?'Plus de carburant !':'Tu t’es trop éloigné !'}</b><p style="font-size:13px">${mis.lose==='crash'?'Il faut arriver doucement : vitesse verticale inférieure à 6.':'Ajuste ta fusée dans l’onglet 🚀 ou pilote plus économiquement.'}</p>${btn('🔁 Réessayer',`spLancer('${mi.id}')`,'#2e7d32')}${btn('🚀 Fusée','spTab(\'fus\')')}</div>`:'';
    if(fin){sh.innerHTML=fin;return}
    if(mi.type==='vol'){
      const s=mis.s,hp=s.corps==='terre'&&mis.mi.id!=='s5'&&!s.lance;
      h=`<div id="sphud" style="font-size:12px;background:#0a0c1a;border-radius:8px;padding:5px 7px;margin-bottom:4px"></div><b style="font-size:13px">${esc(mi.nom)}</b> ${mis.phase==='lune'?'(phase lunaire)':''}<br>`+
        (hp?btn('🚀 DÉCOLLAGE !','spLance()','#d6302b','font-size:16px;padding:10px 16px'):'')+
        btn(mis.auto?'🤖 Pilote auto : OUI':'🤖 Pilote auto : NON','spAuto()',mis.auto?'#2e7d32':'')+
        (!mis.auto?btn(s.pouss?'🔥 Poussée : ON':'🔥 Poussée : OFF','spPouss()',s.pouss?'#d6302b':'')+hold('l','◀')+hold('r','▶'):'')+
        btn('⏩ ×'+(mis.x2===1?2:1),'spX2()')+
        (mi.id==='s3'?btn('🛰 Déployer le satellite','spAct()','#6a2fa0').replace('<button','<button id="spact" disabled'):mi.id==='s4'?btn('🔗 Amarrer à la station','spAct()','#6a2fa0').replace('<button','<button id="spact" disabled'):'')+
        `<p style="font-size:11px;opacity:.8;margin:3px 0">${mi.id==='s6'||mi.id==='s9'||mis.phase==='lune'?'Pilote auto = atterrissage assisté (2 étoiles). Sans auto : 3 étoiles ! Vise une vitesse verticale < 6.':'Pilote auto = montée assistée (2 étoiles). Sans auto : incline avec ◀ ▶ (3 étoiles).'}</p>`}
    else if(mi.type==='rover'){h=`<b style="font-size:13px">${esc(mi.nom)}</b> · Échantillons : <b>${mis.got}/5</b> · ⏱ ${Math.round(mis.t)} s<br><div style="display:inline-block">${hold('f','▲')}</div><div style="display:inline-block">${hold('l','◀')}${hold('b','▼')}${hold('r','▶')}</div> ${hold('u','🦘')}<p style="font-size:11px;opacity:.85">Les roches jaunes brillantes sont les échantillons. Saute avec 🦘 : la gravité est faible !</p>`}
    else if(mi.type==='station'){h=`<b>🛰 ${esc(mi.nom)}</b><p style="font-size:13px">Touche chacun des 5 modules de la station pour le visiter : ${Object.keys(mis.vis).length}/5</p>`}
    else{const q=SATURNE[mis.q];if(!q){mis.win=mis.ok>=3;if(mis.win){recompense(mi,mis.ok>=4?3:2)}else mis.lose='quiz';return rendMis()}
      h=`<b>🪐 Question ${mis.q+1}/4</b><p style="font-size:14px;margin:3px 0">${esc(q[0])}</p>`+q[1].map((x,i)=>btn(esc(x),`spQ(${i})`)).join('')+(mis.fb?`<p style="font-size:13px">${mis.fb}</p>`+btn('Suivant ▶','spQs()','#2e7d32'):'')}
    sh.innerHTML=h}
  function cert(){const s=SP();if(!s.cert){over('<h3>🎓 Certificat</h3><p>Réussis 6 missions pour obtenir ton certificat de jeune astronaute.</p>'+btn('✖ Fermer','spFermerOver()'));return}
    over(`<div style="background:linear-gradient(#f3f0ff,#d8d0f2);color:#2a1f5e;border:6px double #6a2fa0;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI SPACE EXPLORER</div><div style="font-size:44px">🚀</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE ASTRONAUTE</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune astronaute')}</div><p style="font-size:13px">grade : ${esc(niveau()[1])}<br>pour avoir exploré l’espace dans un simulateur éducatif.</p><p style="font-size:12px">Fait le ${esc(s.cert.date)}</p></div>`+btn('✖ Fermer','spFermerOver()'))}
  const actions={
    spOuvrir:()=>ouvrir(),spQuitter:()=>quitter(),spTab:t=>setTab(t),spFermerOver:()=>fermerOver(),spCert:()=>cert(),spKey:(k,v)=>{keys[k]=!!v},
    spRetour:()=>{const o=$('spover');if(o&&o.style.display==='flex')fermerOver();else if(mis||tab!=='base'||mode!=='base'){mis=null;setTab(tab==='base'?'base':(tab==='mis'?'mis':'base'))}else quitter()},
    spMonter:m=>{mis=null;monter(m);if(m==='saturne'){$('spsheet').innerHTML='<b>🪐 Saturne</b><p style="font-size:13px">'+esc(PLANETES.find(p=>p.id==='saturne').txt)+'</p>'+btn('↩ Menu Univers','spTab(\'univ\')');PAR.dire(PLANETES.find(p=>p.id==='saturne').txt,'bea')}else if(m==='systeme'){$('spsheet').innerHTML='<p style="font-size:13px">☀️ Touche une planète pour la découvrir.</p>'+btn('↩ Menu Univers','spTab(\'univ\')')}},
    spTerre:()=>{mis=null;monter('terre');SP().congo=true;sauve();$('spsheet').innerHTML=`<b>🌍 Le Congo vu de l’espace</b><p style="font-size:13px">Le point jaune est <b>Kinshasa</b>. La République démocratique du Congo (en vert foncé) abrite la deuxième plus grande forêt tropicale du monde et le fleuve Congo (en bleu), le plus profond du monde. Depuis la station spatiale, on voit la forêt, les nuages d’orage et les lumières des villes la nuit.</p>`+btn('↩ Menu Univers','spTab(\'univ\')');PAR.dire('Le Congo vu de l’espace : une immense forêt tropicale traversée par le fleuve Congo. Le point jaune est Kinshasa.','bea')},
    spStationLibre:()=>{mis=null;monter('station');$('spsheet').innerHTML='<p style="font-size:13px">🛰 Touche un module de la station pour découvrir son rôle.</p>'+btn('↩ Menu Univers','spTab(\'univ\')')},
    spFus:(i,k,d)=>{const s=SP();if(k==='add'){if(d>0&&s.plan.length<3)s.plan.push({m:1,r:1});else if(d<0&&s.plan.length>1)s.plan.pop()}else{const e=s.plan[i];e[k]=Math.max(1,Math.min(k==='m'?4:3,e[k]+d))}sauve();monter('base');rend()},
    spCharge:c=>{SP().charge=c;sauve();monter('base');rend()},spCoul:c=>{SP().col=c;sauve();monter('base');rend()},
    spAstro:(k,v)=>{SP().astro[k]=v;sauve();monter('astro');rend()},
    spLancer:id=>lancerMission(id),spLance:()=>{if(mis&&mis.s){mis.s.lance=true;mis.s.pouss=true;rendMis()}},spAuto:()=>{if(mis){mis.auto=!mis.auto;rendMis()}},spPouss:()=>{if(mis&&mis.s){mis.s.pouss=!mis.s.pouss;rendMis()}},spX2:()=>{if(mis){mis.x2=mis.x2===1?2:1;rendMis()}},
    spAct:()=>{if(mis&&!mis.win&&mis.s&&orbiteStable(mis.s)&&mis.orb>=1&&(mis.mi.id!=='s4'||mis.s.f.et.reduce((t,q)=>t+q.f,0)>=1)){mis.win=true;recompense(mis.mi,mis.auto?2:3);rendMis()}},
    spQ:i=>{const q=SATURNE[mis.q];if(i===q[2]){mis.ok++;mis.fb='✅ '+esc(q[3]);SFX.ok&&SFX.ok()}else{mis.fb='❌ '+esc(q[3]);SFX.ko&&SFX.ko()}PAR.dire(q[3],'bea');rendMis()},
    spQs:()=>{mis.q++;mis.fb='';rendMis()},
    spChute:(n,g)=>{const s=SP();s.grav[n]=true;const t=Math.sqrt(2*10/g),b=$('gvb'),bx=$('gvbox');if(!b)return;b.style.transition='none';b.style.top='4px';void b.offsetWidth;b.style.transition='top '+t+'s cubic-bezier(.55,0,1,.45)';b.style.top=(bx.clientHeight-26)+'px';$('gvt').textContent=n+' : la balle met '+t.toFixed(1)+' s pour tomber de 10 m.';
      if(Object.keys(s.grav).length>=4&&!s.badges.grav){s.badges.grav=true;A().pieces+=3;refreshHud();toast('🏅 Expérience de gravité terminée (+3 🪙)')}sauve();rend2()},
    spTest:()=>{}};
  function rend2(){}
  return {actions,ouvrir,fermer,SP,estOuvert:()=>!!ov,test:{mis:()=>mis,lancer:lancerMission,step:(n)=>{for(let i=0;i<n;i++)stepVol(.033)}}};
}
