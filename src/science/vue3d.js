// Visionneuses 3D partagées (cellules, corps humain, ambulance…) : rotation au doigt/souris, zoom à deux doigts/molette, sélection des parties.
import * as THREE from 'three';
import {ORGANES} from './data.js';
export function creerViewer(cont,construire,onPick,distInit){
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
  return {zoom:d=>{dist=Math.max(1.8,Math.min(9,dist+d))},auto:v=>{auto=v},grp,dispose(){cancelAnimationFrame(raf);try{r.forceContextLoss();r.dispose()}catch(e){}cont.innerHTML=''}}}

export const M3=(c,op,rough)=>new THREE.MeshStandardMaterial({color:c,transparent:op<1,opacity:op===undefined?1:op,roughness:rough===undefined?.5:rough});

export function cellule3d(type,g){
  const vg=type==='vegetale';
  const corps=new THREE.Mesh(vg?new THREE.BoxGeometry(2.4,1.8,1.6):new THREE.SphereGeometry(1.2,24,18),M3(vg?'#d7efc9':'#f6e0b5',.35));corps.userData.part=vg?'paroi':'cytoplasme';g.add(corps);
  if(vg){const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4,1.8,1.6)),new THREE.LineBasicMaterial({color:'#2e7d32'}));g.add(e)}
  else{const mb=new THREE.Mesh(new THREE.SphereGeometry(1.25,24,18),M3('#f1a7b5',.25));mb.userData.part='membrane';g.add(mb)}
  const noy=new THREE.Mesh(new THREE.SphereGeometry(.36,18,14),M3('#8e44ad',1));noy.position.set(.2,.1,0);noy.userData.part='noyau';g.add(noy);
  if(vg){const va=new THREE.Mesh(new THREE.SphereGeometry(.55,16,12),M3('#8ec9e8',.7));va.position.set(-.7,-.1,.1);va.userData.part='vacuole';g.add(va);
    [[.7,.5,.3],[.6,-.5,-.2],[-.2,.6,.4],[.1,-.5,.4],[-.6,.5,-.3]].forEach(p=>{const c=new THREE.Mesh(new THREE.SphereGeometry(.17,12,10),M3('#2e9e4a'));c.scale.set(1.4,.8,.8);c.position.set(...p);c.userData.part='chloroplaste';g.add(c)})}
  else{[[.7,.4,.3],[-.5,.5,-.3],[-.4,-.5,.4],[.6,-.4,-.3]].forEach(p=>{const c=new THREE.Mesh(new THREE.CapsuleGeometry(.1,.25,4,8),M3('#e67e22'));c.position.set(...p);c.rotation.z=1;c.userData.part='mitochondrie';g.add(c)})}}

export function corps3d(g){
  const peau=M3('#f1c9a5',.28);const add=(geo,m,x,y,z,part)=>{const me=new THREE.Mesh(geo,m);me.position.set(x,y,z);if(part)me.userData.part=part;g.add(me);return me};
  add(new THREE.CapsuleGeometry(.5,1.0,6,14),peau,0,.2,0);add(new THREE.SphereGeometry(.38,16,12),peau,0,1.35,0);
  [-1,1].forEach(s=>{add(new THREE.CapsuleGeometry(.13,.9,4,8),peau,s*.7,.2,0).rotation.z=s*.1;add(new THREE.CapsuleGeometry(.16,1.0,4,8),peau,s*.25,-1.1,0)});
  ORGANES.forEach(o=>{const m=add(new THREE.SphereGeometry(o.r*.6,16,12),M3(o.c,1,.4),o.x*1.2,o.y*1.1-.1+(o.id==='cerveau'?.4:0),o.id==='cerveau'?.02:.2,o.id);if(o.id==='poumons'){m.scale.set(1.5,1.1,.7);const m2=m.clone();m2.position.x=-m.position.x;m2.userData.part='poumons';g.add(m2);m.position.x=Math.abs(m.position.x)+.25;m2.position.x=-(Math.abs(m.position.x))}})}

