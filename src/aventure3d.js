// Monde 3D d'une aventure : un sentier à parcourir à pied, des étapes marquées par un faisceau lumineux, un décor selon l'aventure.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl,rng} from './world.js';
import {leafyTree,palm,bush} from './nature.js';
import {ground,sign} from './stages.js';

const PAS=17;                                           // distance entre deux étapes
export const pointsEtapes=n=>Array.from({length:n},(_,i)=>({x:Math.sin((i+1)*1.25)*11,z:-PAS*(i+1)-6}));
const px=z=>z>-6?0:Math.sin(((-z-6)/PAS)*1.25)*11;     // axe du sentier à la profondeur z

export function buildAventure(av,etat){
  const g=new THREE.Group(),colliders=[],boxes=[],r=rng(av.id.length*13+5);
  ground(g,1400,1400,T.grassTexture,1,0,0);
  const N=av.chapitres.length,pts=[{x:0,z:3}].concat(pointsEtapes(N)),zFin=pts[N].z;
  // sentier de terre
  const terre=new THREE.MeshStandardMaterial({map:T.dirtTexture(),roughness:1,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
  for(let i=0;i<N;i++){
    const a=pts[i],b=pts[i+1],dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)+3;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(3.6,len),terre);m.rotation.order='YXZ';m.rotation.x=-Math.PI/2;m.rotation.y=Math.atan2(-dx,-dz);
    m.position.set((a.x+b.x)/2,.02,(a.z+b.z)/2);m.receiveShadow=true;g.add(m);
  }
  // végétation de chaque côté du sentier
  const dense=av.decor==='foret',savane=av.decor==='savane';
  for(let z=18,k=0;z>zFin-34;z-=dense?3.2:6,k++){
    [-1,1].forEach(side=>{
      const d=6+r()*(dense?22:30),x=px(z)+side*d;
      let t;
      if(savane&&k%3)t=palm(k+side*7);else t=leafyTree({kind:k%2?'mango':'leafy',seed:k*2+(side>0?1:0)+4,fruits:false,trunk:3+r()*2.2});
      t.position.set(x,0,z+(r()-.5)*2);t.scale.setScalar(dense?1.1+r()*.5:.9+r()*.4);g.add(t);colliders.push({x:x,z:t.position.z,r:.7});
      if(r()<.45){const b=bush(k+11,.8+r()*.6);b.position.set(px(z)+side*(4+r()*8),0,z+r()*3);g.add(b)}
    });
  }
  // décors lointains
  if(av.decor==='volcans'){
    const v=new THREE.Mesh(new THREE.ConeGeometry(34,46,28),new THREE.MeshStandardMaterial({color:'#4a4a4f',roughness:1}));v.position.set(-64,23,zFin-30);g.add(v);
    const feu=new THREE.Mesh(new THREE.ConeGeometry(7,5,18),new THREE.MeshStandardMaterial({color:'#ff6a1a',emissive:'#ff4a00',emissiveIntensity:1.2}));feu.position.set(-64,47,zFin-30);g.add(feu);
    [[60,-40],[75,-90],[-90,-20]].forEach(([x,z],i)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(22+i*4,30,20),new THREE.MeshStandardMaterial({color:'#5d6a52',roughness:1}));m.position.set(x,15,z+zFin*.4);g.add(m)});
    const lac=new THREE.Mesh(new THREE.PlaneGeometry(90,70),new THREE.MeshStandardMaterial({color:'#2e7fb8',roughness:.2,metalness:.2,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3}));lac.rotation.x=-Math.PI/2;lac.position.set(58,.03,zFin*.5);g.add(lac);
  }
  if(av.decor==='savane'){
    const fl=new THREE.Mesh(new THREE.PlaneGeometry(14,300),new THREE.MeshStandardMaterial({color:'#3a86c8',roughness:.2,metalness:.2,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3}));fl.rotation.x=-Math.PI/2;fl.position.set(-36,.03,zFin/2);g.add(fl);
    for(let i=0;i<14;i++){const ro=new THREE.Mesh(new THREE.DodecahedronGeometry(.8+r()*1.2,0),std('#8a8274',1));ro.position.set(px(-i*10)+(r()<.5?-1:1)*(8+r()*10),.5,-i*10-r()*4);g.add(ro);colliders.push({x:ro.position.x,z:ro.position.z,r:1})}
  }
  // étapes : stèle, panneau, faisceau lumineux et boule ; coffre à la dernière
  const marques=[];
  for(let i=0;i<N;i++){
    const p=pts[i+1],gr=new THREE.Group();gr.position.set(p.x,0,p.z);g.add(gr);
    cyl(gr,.5,.6,1.1,std('#9a9384',.9),0,.55,0,12);colliders.push({x:p.x,z:p.z,r:.8});
    const pan=sign(av.chapitres[i].lieu.split(' · ')[0],'Étape '+(i+1),3.2,1.1,'#1d4f91','#fff');pan.position.set(0,2.6,0);gr.add(pan);cyl(gr,.06,.07,2.1,std('#5a3a22'),0,1.05,-.1,6);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,16,12,1,true),new THREE.MeshBasicMaterial({color:0xffe27a,transparent:true,opacity:.35,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));beam.position.y=8;gr.add(beam);
    const orb=new THREE.Mesh(new THREE.SphereGeometry(.45,16,12),new THREE.MeshBasicMaterial({color:0xffe27a}));orb.position.y=4.2;gr.add(orb);
    if(i===N-1){const c1=box(gr,1.3,.7,.9,std('#7a4a26',.8),2.2,.35,0);box(gr,1.3,.3,.9,std('#e0a526',.4),2.2,.85,0);colliders.push({x:p.x+2.2,z:p.z,r:1})}
    marques.push({beam,orb,i});
  }
  return {group:g,colliders,boxes,dyn:{},exit:{x:0,z:6},bounds:{x0:-48,x1:48,z0:zFin-30,z1:12},sky:{elev:av.decor==='volcans'?24:38},fog:.0042,
    update(dt,t){marques.forEach(m=>{const actif=m.i===etat.ch()&&!etat.fini();m.beam.visible=actif;m.orb.visible=actif||m.i<etat.ch();m.orb.material.color.set(m.i<etat.ch()||etat.fini()?0x6fe08a:0xffe27a);m.orb.position.y=4.2+Math.sin(t*2+m.i)*.25;m.orb.scale.setScalar(actif?1+.15*Math.sin(t*4):.7)})}};
}
