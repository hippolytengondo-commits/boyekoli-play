// BOYEKOLI SMART CITY : simulation urbaine 3D. La grille de départ reprend le village (école, hôpital, marché, routes) ;
// gestion du budget, de l'énergie, de l'eau, de la pollution, de la circulation et de la satisfaction ; 10 missions de maire.
import * as THREE from 'three';
import {N,TYPES,CATS,MISSIONS,NOTIONS} from './ville/data.js';

export function creerVille(D){
  const {PAR,G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const CELL=4,HALF=N*CELL/2;
  const VS=()=>{const a=A();if(!a.ville2)a.ville2=depart();const v=a.ville2;['done','stars','badges'].forEach(k=>{if(!v[k])v[k]={}});return v};
  function depart(){
    const g=Array(N*N).fill('');const a=A(),fixes=[];
    for(let x=1;x<N-1;x++)g[5*N+x]='route';for(let z=1;z<N-1;z++)g[z*N+5]='route';          // croisée de routes : le village au centre
    const fix=(i,t)=>{g[i]=t;fixes.push(i)};
    fix(4*N+4,'ecole');fix(4*N+6,'commerce');fix(6*N+4,'maison');fix(6*N+6,'maison');
    if(a.med||a.done&&(a.done['met:h1']||a.done['met:h2']))fix(3*N+5,'hopital');
    const tr=Object.keys(a.done||{}).filter(k=>k.startsWith('met:')).length,arb=(a.amenage&&a.amenage.arbres)?Object.keys(a.amenage.arbres).length:0;
    for(let i=0;i<Math.min(3,arb);i++)g[(2+i)*N+2]='parc';
    return {grid:g,fixes,budget:3000+100*Math.min(tr,10),mois:0,pop:12,done:{},stars:{},badges:{},cert:null,jour:true,meteo:'soleil'}}
  let ov=null,R=null,sc=null,cam=null,raf=0,pop=null,V=null,tab='build',cur='maison',vue='aerien',cs={yaw:.7,pitch:.9,dist:52,tx:0,tz:0},grp=null,cells=[],vehs=[],gens=[],lights=[],ptr=new Map(),tm=0,vit=1,pause=false,S={},sel=-1,rain=null,sun=null,hemi=null,ground=null,sautSave=0,nbCars=0;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:7px 10px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#3a4a5e'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>save(),500)};
  const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.8:r});
  const box=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
  const pos=i=>[(i%N-N/2+.5)*CELL,(Math.floor(i/N)-N/2+.5)*CELL];
  // ---------- statistiques
  function stats(){
    const g=V.grid,nb={};Object.keys(TYPES).forEach(k=>nb[k]=0);const act={};
    g.forEach((t,i)=>{if(!t)return;nb[t]++;const x=i%N,z=Math.floor(i/N),ro=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const X=x+a,Z=z+b;return X>=0&&X<N&&Z>=0&&Z<N&&g[Z*N+X]==='route'});act[i]=t==='route'||t==='parc'||t==='solaire'||ro});
    let loge=0,emp=0,elS=0,elD=0,eaS=0,eaD=0,poll=0,edu=0,san=0,sec=0,ent=0,taxe=0,joie=0,trans=0;
    g.forEach((t,i)=>{if(!t)return;const T=TYPES[t];ent+=T.ent||0;if(!act[i])return;loge+=T.loge||0;emp+=T.emplois||0;if(T.elec>0)elS+=T.elec;else elD-=T.elec||0;if(T.eau>0)eaS+=T.eau;else eaD-=T.eau||0;poll+=T.poll||0;edu+=T.edu||0;san+=T.sante||0;sec+=T.secu||0;taxe+=T.taxe||0;joie+=T.joie||0;trans+=T.trans||0});
    const pop=Math.round(V.pop),cl=(a,b)=>Math.min(1,a/Math.max(1,b));
    const rE=cl(elS,elD),rW=cl(eaS,eaD),rJ=cl(emp,pop*.45),rEdu=cl(edu*60,pop*.3),rSan=cl(san*90,pop),rSec=cl(sec*80,pop),roads=nb.route,rC=cl(roads*9+trans*25,pop*.7),pl=Math.max(0,poll),rP=1-Math.min(1,pl/50);
    const sat=pop===0?60:Math.round(100*(.2*rE+.15*rW+.12*rJ+.12*rEdu+.12*rSan+.1*rSec+.1*rC+.09*rP)+Math.min(8,joie*2));
    const tgt=Math.floor(loge*(.35+.65*Math.min(1,sat/100)));
    const rev=Math.round(pop*2+taxe*2+emp*.8),dep=Math.round(ent*1.2);
    return {nb,pop,loge,tgt,emp,elS,elD,eaS,eaD,poll:pl,elecOk:rE,eauOk:rW,eduCouv:rEdu,sante:rSan,secu:rSec,circOk:rC,sat:Math.min(100,sat),budget:Math.round(V.budget),rev,dep,rJ,mois:V.mois}}
  // ---------- 3D : bâtiments
  function batiment(t,i){
    const T=TYPES[t],g=new THREE.Group(),[x,z]=pos(i);g.position.set(x,0,z);const w=CELL*.8;
    if(t==='route'){box(g,CELL,.06,CELL,M('#3b3c40',.95),0,.03,0);box(g,.15,.07,1.2,M('#f2f2f2'),0,.04,0)}
    else if(t==='parc'){box(g,CELL,.1,CELL,M('#4f9c3c'),0,.05,0);[[-1,-1],[1,1],[1,-1.1]].forEach(([a,b])=>{box(g,.2,1,.2,M('#6b4423'),a,.5,b);const c=new THREE.Mesh(new THREE.SphereGeometry(.8,8,6),M('#2f7a36'));c.position.set(a,1.5,b);g.add(c)})}
    else if(t==='solaire'){box(g,CELL,.1,CELL,M('#9aa0a6'),0,.05,0);for(let a=-1;a<=1;a+=2)box(g,1.5,.1,1.5,M('#1b3a6b',.2),a,.5,0).rotation.x=.4}
    else if(t==='chateau'){box(g,CELL,.1,CELL,M('#9aa0a6'),0,.05,0);[[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].forEach(([a,b])=>box(g,.15,2.6,.15,M('#777'),a,1.3,b));const c=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,1.2,14),M('#3fa9d9'));c.position.y=3.2;g.add(c)}
    else if(t==='maison'){box(g,CELL,.08,CELL,M('#b9c79a'),0,.04,0);[[-.9,-.8],[.9,.8]].forEach(([a,b])=>{box(g,1.4,1.1,1.3,M('#d9b48a'),a,.65,b);const r=new THREE.Mesh(new THREE.ConeGeometry(1.2,.7,4),M('#b5503c'));r.rotation.y=Math.PI/4;r.position.set(a,1.5,b);g.add(r)})}
    else if(t==='bus'){box(g,CELL,.08,CELL,M('#9aa0a6'),0,.04,0);box(g,1.8,.1,.9,M('#2c7fb8'),0,1.8,-1);[-.8,.8].forEach(a=>box(g,.1,1.8,.1,M('#444'),a,.9,-1));box(g,1.5,.6,.8,M('#f4c20d'),0,.4,1)}
    else{box(g,CELL,.08,CELL,M('#9aa0a6'),0,.04,0);box(g,w*(t==='immeuble'?.7:.85),T.h,w*(t==='immeuble'?.7:.85),M(T.col,.75),0,T.h/2,0);
      if(t==='usine'){box(g,.5,2.4,.5,M('#555'),1,T.h+.8,.8);box(g,.5,1.8,.5,M('#555'),-.3,T.h+.5,.8)}
      if(t==='centrale'){const c=new THREE.Mesh(new THREE.CylinderGeometry(.7,1,3,10),M('#aaa'));c.position.set(.9,3.4,.5);g.add(c)}
      if(t==='hopital'){box(g,.9,.2,.1,M('#d6302b'),0,T.h+.4,w*.43+.02);box(g,.2,.9,.1,M('#d6302b'),0,T.h+.4,w*.43+.02)}
      if(t==='ecole'){box(g,w*.9,.15,w*.9,M('#7a2a2a'),0,T.h+.08,0)}
      if(t==='immeuble')for(let r=0;r<4;r++)for(let c=-1;c<=1;c++){const f=box(g,.4,.5,.05,M('#ffe9a8',.3),c*.7,.8+r*1,w*.35+.03);f.userData.fen=1}
      if(t==='police')box(g,1,.3,.05,M('#fff'),0,T.h-.4,w*.43+.02)}
    return g}
  function pose(i){if(cells[i]){grp.remove(cells[i]);cells[i]=null}const t=V.grid[i];if(t){cells[i]=batiment(t,i);if(V.fixes.includes(i)){const m=new THREE.Mesh(new THREE.TorusGeometry(1.6,.07,6,24),new THREE.MeshBasicMaterial({color:'#ffd54f'}));m.rotation.x=Math.PI/2;m.position.set(0,.12,0);cells[i].add(m)}grp.add(cells[i])}}
  function monde(){
    if(grp)sc.remove(grp);grp=new THREE.Group();sc.add(grp);cells=Array(N*N).fill(null);
    ground=new THREE.Mesh(new THREE.PlaneGeometry(N*CELL,N*CELL),M('#77a85a',1));ground.rotation.x=-Math.PI/2;ground.userData.sol=1;grp.add(ground);
    const gr=new THREE.GridHelper(N*CELL,N,0x000000,0x000000);gr.material.opacity=.18;gr.material.transparent=true;gr.position.y=.02;grp.add(gr);
    const herbe=new THREE.Mesh(new THREE.PlaneGeometry(400,400),M('#6a9a4e',1));herbe.rotation.x=-Math.PI/2;herbe.position.y=-.05;grp.add(herbe);
    for(let i=0;i<N*N;i++)pose(i);
    // véhicules et habitants
    vehs=[];ajusterTrafic();
    // pluie
    const pts=new Float32Array(600*6);for(let i=0;i<600;i++){const x=(Math.random()-.5)*70,y=Math.random()*30,z=(Math.random()-.5)*70;pts.set([x,y,z,x,y-.9,z],i*6)}
    rain=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(pts,3)),new THREE.LineBasicMaterial({color:0x9fc3e8,transparent:true,opacity:.6}));rain.visible=false;grp.add(rain);
    ambiance()}
  function routesVoisines(i){const x=i%N,z=Math.floor(i/N);return [[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,z+b]).filter(([X,Z])=>X>=0&&X<N&&Z>=0&&Z<N&&V.grid[Z*N+X]==='route').map(([X,Z])=>Z*N+X)}
  function ajusterTrafic(){
    const rs=V.grid.map((t,i)=>t==='route'?i:-1).filter(i=>i>=0);vehs.forEach(v=>grp.remove(v.o));vehs=[];if(!rs.length)return;
    const nc=Math.min(14,Math.floor(rs.length/2+V.pop/25)),np=Math.min(26,Math.floor(V.pop/6));
    for(let k=0;k<nc+np;k++){const ped=k>=nc,i=rs[(k*7)%rs.length],o=new THREE.Group();
      if(ped){box(o,.25,.6,.25,M(['#c0392b','#2c7fb8','#e8c04a','#7b3fa0'][k%4]),0,.5,0);const h=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),M('#7a4a2e'));h.position.y=.95;o.add(h)}
      else{box(o,.9,.35,.5,M(['#c0392b','#2c7fb8','#f4c20d','#ffffff','#2e7d32'][k%5]),0,.3,0);box(o,.5,.25,.42,M('#cfe6f5',.2),-.05,.58,0)}
      grp.add(o);const [x,z]=pos(i);o.position.set(x,0,z);vehs.push({o,ped,from:i,to:i,t:1,sp:ped?.9+Math.random()*.4:2.2+Math.random()*1.2,off:ped?(k%2?1:-1)*1.55:(k%2?.5:-.5)})}}
  function bougerTrafic(dt){
    vehs.forEach(v=>{v.t+=dt*v.sp/CELL;if(v.t>=1){v.from=v.to;const nx=routesVoisines(v.from).filter(c=>c!==v.prev);const ch=nx.length?nx:routesVoisines(v.from);if(!ch.length){v.t=0;return}v.prev=v.from;v.to=ch[Math.floor(Math.random()*ch.length)];v.t=0}
      const [x0,z0]=pos(v.from),[x1,z1]=pos(v.to),dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz)||1;let x=x0+dx*v.t,z=z0+dz*v.t;x+=-dz/L*v.off;z+=dx/L*v.off;v.o.position.set(x,0,z);if(dx||dz)v.o.rotation.y=Math.atan2(-dz,dx)+(v.ped?Math.PI/2:0)})}
  function ambiance(){
    if(!sc)return;const j=V.jour,m=V.meteo,pluie=m==='pluie';rain.visible=pluie;
    sc.background=new THREE.Color(j?(pluie?'#8b97a3':'#a9d6f5'):'#0b1226');sc.fog=new THREE.Fog(j?(pluie?'#8b97a3':'#a9d6f5'):'#0b1226',60,j?220:140);
    hemi.intensity=j?(pluie?.9:1.5):.35;sun.intensity=j?(pluie?.5:1.3):.2;sun.color.set(j?'#fff4dd':'#6a7cff');
    grp.traverse(o=>{if(o.userData.fen)o.material.emissive.set(j?'#000000':'#ffcf70')})}
  // ---------- caméras
  function majCam(){
    if(vue==='rue'&&vehs.length){const v=vehs.find(q=>!q.ped)||vehs[0],p=v.o.position,a=v.o.rotation.y,fx=Math.cos(a),fz=-Math.sin(a);cam.position.set(p.x-fx*2.6,1.6,p.z-fz*2.6);cam.lookAt(p.x+fx*3,.7,p.z+fz*3);return}
    const d=cs.dist,cp=Math.cos(cs.pitch);cam.position.set(cs.tx+Math.sin(cs.yaw)*cp*d,Math.sin(cs.pitch)*d,cs.tz+Math.cos(cs.yaw)*cp*d);cam.lookAt(cs.tx,0,cs.tz)}
  function setVue(v){vue=v;if(v==='aerien'){cs.pitch=.9;cs.dist=52}else if(v==='dessus'){cs.pitch=1.55;cs.dist=62}else if(v==='libre'){cs.pitch=.45;cs.dist=34}rend()}
  // ---------- boucle
  function boucle(){
    raf=requestAnimationFrame(boucle);if(!R||!V)return;const t=performance.now(),dt=Math.min(.05,(t-(boucle.t||t))/1000);boucle.t=t;
    if(!pause){tm+=dt*vit;if(tm>=2.5){tm=0;mois()}bougerTrafic(dt*vit)}
    if(rain&&rain.visible){const a=rain.geometry.attributes.position;for(let i=0;i<a.count;i+=2){let y=a.getY(i)-dt*28;if(y<0)y+=30;a.setY(i,y);a.setY(i+1,y-.9)}a.needsUpdate=true}
    majCam();R.render(sc,cam)}
  function mois(){
    S=stats();V.mois++;V.budget+=S.rev-S.dep;if(V.budget<-500)V.budget=-500;
    V.pop+=(S.tgt-V.pop)*.18;if(Math.abs(S.tgt-V.pop)<.5)V.pop=S.tgt;if(V.pop<0)V.pop=0;
    if(V.mois%4===0)ajusterTrafic();S=stats();sauve();majStats()}
  function majStats(){const e=$('vstat');if(!e)return;e.innerHTML=`💰 <b>${S.budget}</b> (${S.rev-S.dep>=0?'+':''}${S.rev-S.dep}/mois) · 👥 <b>${Math.round(V.pop)}</b> · 😊 <b>${S.sat}%</b> · 📅 mois ${V.mois}`}
  // ---------- entrées
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function sol(e){const b=R.domElement.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);const h=ray.intersectObject(ground)[0];if(!h)return -1;const x=Math.floor((h.point.x+HALF)/CELL),z=Math.floor((h.point.z+HALF)/CELL);return x>=0&&x<N&&z>=0&&z<N?z*N+x:-1}
  function entrees(){
    const cv=R.domElement;cv.style.touchAction='none';
    cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,mv:false})});
    cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;if(Math.hypot(e.clientX-p.x0,e.clientY-p.y0)>7)p.mv=true;
      if(ptr.size===2){const a=[...ptr.values()],d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptr.values()],d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);cs.dist=Math.max(12,Math.min(90,cs.dist-(d1-d0)*.12));return}
      if(p.mv&&vue!=='rue'){cs.yaw-=(e.clientX-p.x)*.008;cs.pitch=Math.max(.25,Math.min(1.55,cs.pitch+(e.clientY-p.y)*.006))}p.x=e.clientX;p.y=e.clientY});
    cv.addEventListener('pointerup',e=>{const p=ptr.get(e.pointerId);ptr.delete(e.pointerId);if(p&&!p.mv&&ptr.size===0)clic(e)});
    cv.addEventListener('pointercancel',e=>ptr.delete(e.pointerId));cv.addEventListener('wheel',e=>{e.preventDefault();cs.dist=Math.max(12,Math.min(90,cs.dist+e.deltaY*.05))},{passive:false})}
  function clic(e){
    const i=sol(e);if(i<0)return;sel=i;
    if(cur==='info'){const t=V.grid[i];msg(t?TYPES[t].ico+' '+TYPES[t].nom+(V.fixes.includes(i)?' (repère du village)':''):'Terrain libre');return}
    if(cur==='demolir'){if(!V.grid[i])return;if(V.fixes.includes(i)){msg('❌ Ce bâtiment du village ne peut pas être démoli.');SFX.ko&&SFX.ko();return}const T=TYPES[V.grid[i]];V.budget+=Math.floor(T.cout/2);V.grid[i]='';pose(i);ajusterTrafic();S=stats();majStats();sauve();SFX.coin&&SFX.coin();return}
    const T=TYPES[cur];if(!T)return;
    if(V.grid[i]){msg('❌ Il y a déjà un bâtiment ici.');SFX.ko&&SFX.ko();return}
    if(V.budget<T.cout){msg('💰 Budget insuffisant : il manque '+Math.ceil(T.cout-V.budget)+'.');SFX.ko&&SFX.ko();return}
    V.budget-=T.cout;V.grid[i]=cur;pose(i);if(cur==='route')ajusterTrafic();S=stats();majStats();sauve();SFX.coin&&SFX.coin();
    if(cur!=='route'&&!S.elecOk&&S.elD>S.elS)msg('⚡ Attention : manque d’électricité !',2500);else if(cur!=='route'&&S.eaD>S.eaS)msg('💧 Attention : manque d’eau !',2500);else if(cur!=='route'&&cur!=='parc'&&cur!=='solaire'&&cur!=='chateau'&&cur!=='bus'&&!routesVoisines(i).length)msg('🛣 Ce bâtiment n’est relié à aucune route : il ne fonctionnera pas.',3500)}
  function msg(t,ms){const m=$('vmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||2500)}
  // ---------- ouverture / fermeture
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);V=VS();
    ov=document.createElement('div');ov.id='vilov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#142030;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#1b5e7a,#2e9e6a);flex:0 0 auto"><b style="flex:1;font-size:13px">🌆 BOYEKOLI SMART CITY</b>${btn('⏸','vilPause()','#3a4a5e','padding:5px 9px;margin:0')}${btn('⏩','vilVit()','#3a4a5e','padding:5px 9px;margin:0')}${btn('✖','vilQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div>
    <div id="vstat" style="padding:3px 8px;font-size:12px;background:#0d1622;flex:0 0 auto"></div><div id="v3d" style="flex:1;position:relative;min-height:0"><div id="vmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(10,24,30,.92);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div></div>
    <div id="vtabs" style="display:flex;overflow-x:auto;background:#0d1622;flex:0 0 auto"></div><div id="vsheet" style="height:34vh;overflow:auto;padding:6px 8px;background:#1d2a3a;flex:0 0 auto"></div><div id="vover" style="position:absolute;inset:0;background:rgba(10,18,26,.97);display:none;flex-direction:column;padding:10px 10px 84px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'vilRetour()',coin:true,cible:'#v3d'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('v3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(50,1,.5,600);hemi=new THREE.HemisphereLight('#ffffff','#5a6a4a',1.5);sc.add(hemi);sun=new THREE.DirectionalLight('#fff4dd',1.3);sun.position.set(30,50,20);sc.add(sun);
    const rs=()=>{const c=$('v3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}};setTimeout(rs,60);window.addEventListener('resize',rs);ov._rs=rs;
    entrees();tab='build';cur='maison';vue='aerien';cs={yaw:.7,pitch:.9,dist:52,tx:0,tz:0};pause=false;vit=1;monde();S=stats();majStats();rendTabs();rend();
    try{history.pushState({vil:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);raf=requestAnimationFrame(boucle);
    parler('Bienvenue, maire ! Construis une ville où tout le monde vit bien.')}
  function fermer(){if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',ov._rs);try{R.dispose()}catch(e){}ov.remove();ov=null;R=sc=grp=null;ptr.clear();if(V)save();V=null}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('vover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('vover');if(o){o.style.display='none';o.innerHTML=''}}
  const TABS=[['build','🏗 Construire'],['stats','📊 Indicateurs'],['miss','🎯 Missions'],['vues','🎥 Vues'],['aide','📖 Notions']];
  function rendTabs(){$('vtabs').innerHTML=TABS.map(t=>`<button onclick="vilTab('${t[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#cfd8e3'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  const bar=(l,v,c)=>`<div style="margin:5px 0;font-size:13px">${l} <b>${Math.round(v*100)}%</b><div style="height:9px;background:#0d1622;border-radius:5px"><div style="height:9px;width:${Math.round(Math.min(1,v)*100)}%;background:${c||(v>=.8?'#2e9e4a':v>=.5?'#e8c04a':'#d6302b')};border-radius:5px"></div></div></div>`;
  function rend(){
    const s=$('vsheet');if(!s||!V)return;S=stats();let h='';
    if(tab==='build'){
      h=`<div>${btn('🔍 Info','vilCur(\'info\')',cur==='info'?'#ffd54f':'')}${btn('🧹 Démolir','vilCur(\'demolir\')',cur==='demolir'?'#ffd54f':'')}</div>`+CATS.map(c=>`<div style="font-size:11px;opacity:.7;margin-top:3px">${c}</div>`+Object.keys(TYPES).filter(k=>TYPES[k].cat===c).map(k=>btn(TYPES[k].ico+' '+TYPES[k].nom+' · '+TYPES[k].cout,`vilCur('${k}')`,cur===k?'#ffd54f':'')).join('')).join('')+'<p style="font-size:11px;opacity:.8">Touche une case du terrain pour construire. Les bâtiments doivent toucher une route.</p>'}
    else if(tab==='stats'){
      h=bar('⚡ Électricité',S.elecOk)+bar('💧 Eau',S.eauOk)+bar('💼 Emplois',S.rJ)+bar('🏫 Éducation',S.eduCouv)+bar('🏥 Santé',S.sante)+bar('🚓 Sécurité',S.secu)+bar('🚦 Circulation',S.circOk)+bar('🌫 Air pur',1-Math.min(1,S.poll/50))+bar('😊 Satisfaction',S.sat/100)+`<p style="font-size:12px">Habitants : ${Math.round(V.pop)} / ${S.loge} logements · Pollution : ${S.poll} · Revenus ${S.rev} − dépenses ${S.dep}</p>`}
    else if(tab==='miss'){
      h='<b style="font-size:14px">🎯 Missions de maire</b>'+MISSIONS.map(m=>{const ok=V.done[m.id],pret=m.ok(S);return `<div style="background:#142030;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${ok?'✅':pret?'🟢':'▫️'} ${esc(m.nom)}</b> ${ok?'⭐'.repeat(V.stars[m.id]||1):''}<br><span style="opacity:.85">${esc(m.txt)}</span>${ok?'':'<br>'+btn('✅ Valider','vilValider(\''+m.id+'\')',pret?'#2e7d32':'#555')}</div>`}).join('')+`<p style="font-size:12px">${Object.keys(V.done).length}/10 réussies (5 suffisent pour valider l’atelier).</p>`+(V.cert?btn('🎓 Mon certificat','vilCert()','#6a1b9a'):'')}
    else if(tab==='vues'){
      h='<div style="font-size:12px;opacity:.75">Caméra</div>'+[['aerien','🛩 Aérienne'],['dessus','🗺 De dessus'],['libre','🔄 Libre'],['rue','🚗 Dans la rue']].map(v=>btn(v[1],`vilVue('${v[0]}')`,vue===v[0]?'#ffd54f':'')).join('')+'<div style="font-size:12px;opacity:.75;margin-top:6px">Moment et météo</div>'+btn('☀️ Jour',"vilJour(1)",V.jour?'#ffd54f':'')+btn('🌙 Nuit',"vilJour(0)",!V.jour?'#ffd54f':'')+btn('🌤 Soleil',"vilMeteo('soleil')",V.meteo==='soleil'?'#ffd54f':'')+btn('🌧 Pluie',"vilMeteo('pluie')",V.meteo==='pluie'?'#ffd54f':'')+'<p style="font-size:12px;opacity:.85">Glisse pour tourner, pince pour zoomer.</p>'}
    else{h=NOTIONS.map(n=>`<div style="background:#142030;border-radius:10px;padding:7px;margin:4px 0;font-size:13px"><b>${esc(n[0])}</b><br>${esc(n[1])}</div>`).join('')}
    s.innerHTML=h}
  function valider(id){
    const m=MISSIONS.find(x=>x.id===id);S=stats();if(!m.ok(S)){msg('Objectif pas encore atteint : relis la mission et regarde 📊.',3500);SFX.ko&&SFX.ko();return}
    const prem=!V.done[id];V.done[id]=true;V.stars[id]=Math.max(V.stars[id]||0,S.sat>=80?3:2);let ex='';const a=A();
    if(prem){a.pieces+=m.pieces;a.xp+=m.pieces;refreshHud();const t=a.tal||(a.tal={});t.ville=(t.ville||0)+8;V.budget+=300}
    const n=Object.keys(V.done).length;
    if(n>=5&&!a.done['met:v1']){a.done['met:v1']=true;a.stars['met:v1']=2;V.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();ex='<p>🏅 <b>Badge de jeune maire !</b> Atelier validé (+15 🪙)</p>'+btn('🎓 Mon certificat','vilCert()','#6a1b9a')}
    if(n>=10)a.stars['met:v1']=3;
    save();SFX.win&&SFX.win();parler('Mission réussie, monsieur le maire !');rend();
    over(`<div style="text-align:center"><div style="font-size:44px">🌆🎉</div><h3>Mission réussie !</h3><p>${esc(m.nom)}${prem?' · +'+m.pieces+' 🪙 · +300 de budget':''}</p>${ex}</div>`+btn('↩ Continuer','vilFermerOver()'))}
  function cert(){if(!V.cert){over('<h3>🎓 Certificat</h3><p>Réussis 5 missions pour devenir jeune maire.</p>'+btn('✖ Fermer','vilFermerOver()'));return}
    over(`<div style="background:linear-gradient(#f2fbf5,#cfeadb);color:#0f4a33;border:6px double #2e9e6a;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI SMART CITY</div><div style="font-size:44px">🌆</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE MAIRE</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune maire')}</div><p style="font-size:13px">pour avoir géré une ville : budget, énergie, eau, services et environnement.</p><p style="font-size:12px">Fait le ${esc(V.cert.date)}</p></div>`+btn('✖ Fermer','vilFermerOver()'))}
  const actions={
    vilOuvrir:()=>ouvrir(),vilQuitter:()=>quitter(),vilTab:t=>{tab=t;rendTabs();rend()},vilCur:k=>{cur=k;rend()},vilFermerOver:()=>fermerOver(),
    vilRetour:()=>{const o=$('vover');if(o&&o.style.display==='flex')fermerOver();else quitter()},
    vilPause:()=>{pause=!pause;msg(pause?'⏸ Temps arrêté':'▶ Temps en marche',1200)},vilVit:()=>{vit=vit===1?3:1;msg('⏩ Vitesse ×'+vit,1200)},
    vilVue:v=>setVue(v),vilJour:j=>{V.jour=!!j;ambiance();sauve();rend()},vilMeteo:m=>{V.meteo=m;ambiance();sauve();rend()},
    vilValider:id=>valider(id),vilCert:()=>cert(),vilTest:()=>{for(let i=0;i<40;i++)mois()}};
  return {actions,ouvrir,fermer,VS,estOuvert:()=>!!ov,stats:()=>{V=V||VS();return stats()}};
}
