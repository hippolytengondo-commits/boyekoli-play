// Monde 3D d'une aventure : espace libre (forêt, savane, volcans), sans route tracée ni pancarte.
// On y trouve des personnages, des pièces dorées flottantes et des cachettes (buisson, arbre, tronc creux, pierre).
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl,rng} from './world.js';
import {leafyTree,palm,bush} from './nature.js';
import {ground} from './stages.js';

const or=new THREE.MeshStandardMaterial({color:'#f3c21c',emissive:'#c98f00',emissiveIntensity:.7,roughness:.3,metalness:.6});
const brun=c=>std(c||'#6b4a2a',.95);

export function pointsPieces(av){
  const r=rng(av.id.length*29+3),B=av.rayon-6,pts=[];
  const evite=(x,z)=>{
    if(Math.hypot(x-av.depart.x,z-av.depart.z)<4)return true;
    if(av.riviere&&z<av.riviere.z1+1&&z>av.riviere.z0-1&&!(x>av.riviere.gue[0]&&x<av.riviere.gue[1]))return true;
    if(av.decor==='volcans'&&x>34)return true;
    return false;
  };
  let n=0;
  while(pts.length<av.pieces&&n++<500){const x=(r()*2-1)*B,z=(r()*2-1)*B*.95-8;if(!evite(x,z))pts.push([x,z])}
  return pts;
}

export function buildAventure(av,etat){
  const g=new THREE.Group(),colliders=[],boxes=[],r=rng(av.id.length*13+5),B=av.rayon;
  ground(g,1400,1400,T.grassTexture,1,0,0);
  const clair=[{x:av.depart.x,z:av.depart.z,r:9}].concat(av.pnj.map(p=>({x:p.x,z:p.z,r:5.5})),av.cachettes.map(c=>({x:c.x,z:c.z,r:4})));
  const libre=(x,z)=>!clair.some(c=>Math.hypot(x-c.x,z-c.z)<c.r);
  // rivière avec gué
  if(av.riviere){
    const {z0,z1,gue}=av.riviere,eau=new THREE.MeshStandardMaterial({color:'#2e7fb8',roughness:.15,metalness:.25,transparent:true,opacity:.9,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3});
    const seg=(xa,xb)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(xb-xa,z1-z0),eau);m.rotation.x=-Math.PI/2;m.position.set((xa+xb)/2,.04,(z0+z1)/2);g.add(m);boxes.push({x0:xa,x1:xb,z0:z0,z1:z1})};
    seg(-B,gue[0]);seg(gue[1],B);
    const sable=new THREE.Mesh(new THREE.PlaneGeometry(gue[1]-gue[0],z1-z0),new THREE.MeshStandardMaterial({color:'#b7a37a',roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3}));
    sable.rotation.x=-Math.PI/2;sable.position.set((gue[0]+gue[1])/2,.04,(z0+z1)/2);g.add(sable);
    for(let i=0;i<9;i++){const p=new THREE.Mesh(new THREE.DodecahedronGeometry(.35+r()*.2,0),std('#8a8274',1));p.position.set(gue[0]+r()*(gue[1]-gue[0]),.12,z0+r()*(z1-z0));g.add(p)}
  }
  // lac, volcans, montagnes
  if(av.decor==='volcans'){
    const v=new THREE.Mesh(new THREE.ConeGeometry(34,46,28),new THREE.MeshStandardMaterial({color:'#4a4a4f',roughness:1}));v.position.set(-50,23,-B-26);g.add(v);
    const feu=new THREE.Mesh(new THREE.ConeGeometry(7,5,18),new THREE.MeshStandardMaterial({color:'#ff6a1a',emissive:'#ff4a00',emissiveIntensity:1.2}));feu.position.set(-50,47,-B-26);g.add(feu);
    [[70,-70],[-90,-20],[10,-110]].forEach(([x,z],i)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(22+i*4,30,20),new THREE.MeshStandardMaterial({color:'#5d6a52',roughness:1}));m.position.set(x,15,z);g.add(m)});
    const lac=new THREE.Mesh(new THREE.PlaneGeometry(70,140),new THREE.MeshStandardMaterial({color:'#2e7fb8',roughness:.2,metalness:.2,transparent:true,opacity:.92,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3}));lac.rotation.x=-Math.PI/2;lac.position.set(34+35,.04,-10);g.add(lac);boxes.push({x0:36,x1:B+8,z0:-80,z1:60});
  }
  // forêt : arbres partout sauf dans les clairières
  const dense=av.decor==='foret',savane=av.decor==='savane',N=dense?95:62;
  for(let i=0;i<N;i++){
    const x=(r()*2-1)*(B-3),z=(r()*2-1)*(B-3)-5;
    if(!libre(x,z))continue;
    if(av.riviere&&z<av.riviere.z1+1.5&&z>av.riviere.z0-1.5)continue;
    if(av.decor==='volcans'&&x>33)continue;
    const t=(savane&&i%3)?palm(i):leafyTree({kind:i%2?'mango':'leafy',seed:i+4,fruits:false,trunk:3+r()*2.4});
    t.position.set(x,0,z);t.scale.setScalar(dense?1.1+r()*.5:.9+r()*.45);g.add(t);colliders.push({x:x,z:z,r:.7});
    if(r()<.4){const b=bush(i+9,.8+r()*.6);b.position.set(x+(r()-.5)*5,0,z+(r()-.5)*5);g.add(b)}
  }
  // départ : petit cairn
  const dx=av.depart.x,dz=av.depart.z+3;
  [[0,0,.55],[.5,.1,.4],[-.4,.15,.35]].forEach(([x,z,s])=>{const p=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),std('#9a9384',1));p.position.set(dx+x,s*.7,dz+z);g.add(p)});
  // cachettes
  const lueurs=[];
  av.cachettes.forEach(c=>{
    const gr=new THREE.Group();gr.position.set(c.x,0,c.z);g.add(gr);
    const coffre=()=>{const k=new THREE.Group();box(k,.9,.5,.6,brun('#7a4a26'),0,.25,0);box(k,.95,.18,.65,std('#e0a526',.4),0,.58,0);return k};
    if(c.type==='buisson'){const k=coffre();k.position.set(0,0,-.4);gr.add(k);[[0,1.1,1.5],[-1.1,.9,.6],[1.1,.9,.7]].forEach(([x,s,z])=>{const b=bush(c.x*3+x*7,s*1.4);b.position.set(x,0,z);gr.add(b)});colliders.push({x:c.x,z:c.z+1,r:1.2})}
    else if(c.type==='arbre'){const t=leafyTree({kind:'leafy',seed:c.x+9,fruits:false,trunk:4.2});t.scale.setScalar(1.7);gr.add(t);const m=new THREE.Mesh(new THREE.SphereGeometry(.9,12,8),std('#6b4a2a',1));m.scale.set(1.3,.25,1);m.position.set(1.3,.1,1.2);gr.add(m);colliders.push({x:c.x,z:c.z,r:1.4})}
    else if(c.type==='tronc'){const t=new THREE.Mesh(new THREE.CylinderGeometry(.65,.7,3.4,14),brun('#5a3a22'));t.rotation.z=Math.PI/2;t.position.set(0,.65,0);gr.add(t);const tr=new THREE.Mesh(new THREE.CircleGeometry(.5,14),std('#1b120a',1));tr.rotation.y=Math.PI/2;tr.position.set(1.72,.65,0);gr.add(tr);colliders.push({x:c.x,z:c.z,r:1.7})}
    else {[[0,0,.9],[.9,.5,.6],[-.8,.4,.65],[.2,-.8,.55]].forEach(([x,z,s])=>{const p=new THREE.Mesh(new THREE.DodecahedronGeometry(s,0),std('#8a8274',1));p.position.set(x,s*.7,z);gr.add(p)});colliders.push({x:c.x,z:c.z,r:1.4})}
    const e=new THREE.Group();for(let i=0;i<3;i++){const s=new THREE.Mesh(new THREE.OctahedronGeometry(.1,0),new THREE.MeshBasicMaterial({color:0xffe27a}));s.userData.p=i*2.1;e.add(s)}
    e.position.set(c.x,1.4,c.z);g.add(e);lueurs.push({e,c});
  });
  // pièces dorées flottantes
  const pieces=pointsPieces(av).map(([x,z],i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.09,18),or);m.rotation.x=Math.PI/2;
    const gp=new THREE.Group();gp.add(m);gp.position.set(x,1.3,z);g.add(gp);return {gp,x,z,i}});
  return {group:g,colliders,boxes,dyn:{},exit:{x:av.depart.x,z:av.depart.z+3},bounds:{x0:-B,x1:B,z0:-B-6,z1:B-4},sky:{elev:av.decor==='volcans'?24:38},fog:.0042,
    update(dt,t){
      const p=etat.pos();
      pieces.forEach(c=>{
        if(etat.prise(c.i)){c.gp.visible=false;return}
        c.gp.rotation.y=t*2.4+c.i;c.gp.position.y=1.3+Math.sin(t*2+c.i)*.18;
        if(Math.hypot(p.x-c.x,p.z-c.z)<1.5){c.gp.visible=false;etat.ramasser(c.i)}
      });
      lueurs.forEach(({e,c})=>{
        const proche=!etat.trouve(c.id)&&Math.hypot(p.x-c.x,p.z-c.z)<15;e.visible=proche;
        if(proche)e.children.forEach((s,i)=>{const a=t*1.6+s.userData.p;s.position.set(Math.cos(a)*.7,Math.sin(t*2+i)*.35,Math.sin(a)*.7);s.scale.setScalar(.8+.5*Math.sin(t*5+i))});
      });
    }};
}
