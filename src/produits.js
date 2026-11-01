// Produits du supermarché : petits modèles 3D simples (bouteilles, fruits, sacs, boîtes…) pour garnir les rayons.
import * as THREE from 'three';

const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.6:r});
function etiquette(txt,fond,couleur){
  const c=document.createElement('canvas');c.width=128;c.height=128;const x=c.getContext('2d');
  x.fillStyle=fond;x.fillRect(0,0,128,128);x.fillStyle=couleur||'#fff';x.font='bold 30px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
  String(txt).split(' ').forEach((m,i,a)=>x.fillText(m,64,64+(i-(a.length-1)/2)*34));
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
const lab=(txt,fond,col)=>new THREE.MeshStandardMaterial({map:etiquette(txt,fond,col),roughness:.7});
const add=(g,geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);g.add(m);return m};

export const MODELES={
  bouteille(c){const g=new THREE.Group();const col=c||'#2e86de';
    add(g,new THREE.CylinderGeometry(.09,.1,.34,14),new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.75,roughness:.2}),0,.19,0);
    add(g,new THREE.CylinderGeometry(.045,.07,.1,12),new THREE.MeshStandardMaterial({color:col,transparent:true,opacity:.75,roughness:.2}),0,.41,0);
    add(g,new THREE.CylinderGeometry(.05,.05,.04,10),M('#fff'),0,.48,0);
    add(g,new THREE.CylinderGeometry(.102,.102,.14,14,1,true),lab('EAU','#ffffff','#2e86de'),0,.2,0);return g},
  jus(c){const g=MODELES.bouteille(c||'#e0a526');return g},
  brique(c){const g=new THREE.Group();add(g,new THREE.BoxGeometry(.2,.32,.12),lab('LAIT',c||'#ffffff','#1f5f9e'),0,.16,0);add(g,new THREE.BoxGeometry(.2,.05,.12),M('#2e86de'),0,.345,0);return g},
  huile(){const g=new THREE.Group();const m=new THREE.MeshStandardMaterial({color:'#c77d16',transparent:true,opacity:.8,roughness:.2});
    add(g,new THREE.CylinderGeometry(.085,.095,.3,14),m,0,.17,0);add(g,new THREE.CylinderGeometry(.04,.075,.08,12),m,0,.36,0);add(g,new THREE.CylinderGeometry(.04,.04,.04,10),M('#c0392b'),0,.42,0);add(g,new THREE.CylinderGeometry(.097,.097,.12,14,1,true),lab('HUILE','#fff3c4','#8c5a2b'),0,.17,0);return g},
  sac(txt,c){const g=new THREE.Group();add(g,new THREE.BoxGeometry(.3,.42,.14),lab(txt||'RIZ',c||'#f5efe3','#5a3a22'),0,.21,0);add(g,new THREE.BoxGeometry(.3,.06,.14),M('#e8dcc0'),0,.44,0);return g},
  boite(txt,c){const g=new THREE.Group();add(g,new THREE.BoxGeometry(.18,.24,.1),lab(txt||'THÉ',c||'#1f7a4d','#fff'),0,.12,0);return g},
  mangue(){const g=new THREE.Group();const m=add(g,new THREE.SphereGeometry(.1,14,12),new THREE.MeshStandardMaterial({color:'#f0a020',roughness:.5}),0,.1,0);m.scale.set(1,.85,.9);
    const m2=add(g,new THREE.SphereGeometry(.07,10,8),new THREE.MeshStandardMaterial({color:'#d8481c',roughness:.5}),.04,.13,.03);m2.scale.set(1,.8,.8);add(g,new THREE.ConeGeometry(.03,.07,6),M('#3b7a2a'),0,.22,0);return g},
  banane(){const g=new THREE.Group();for(let i=0;i<5;i++){const b=add(g,new THREE.CylinderGeometry(.025,.02,.26,8),M('#f1d02a',.5),(i-2)*.045,.14,0);b.rotation.z=(i-2)*.12;b.rotation.x=.25}add(g,new THREE.CylinderGeometry(.02,.02,.06,6),M('#6b7a2a'),0,.29,-.03);return g},
  tomate(){const g=new THREE.Group();[[0,0],[.13,.02],[-.1,.05],[.04,.12]].forEach(([x,z],i)=>{add(g,new THREE.SphereGeometry(.06,12,10),M(i%2?'#d63a2a':'#c0392b',.45),x,.06,z);add(g,new THREE.ConeGeometry(.02,.03,5),M('#3b7a2a'),x,.125,z)});return g},
  oignon(){const g=new THREE.Group();[[0,0],[.12,.03],[-.1,.04]].forEach(([x,z])=>add(g,new THREE.SphereGeometry(.065,12,10),M('#a0508a',.55),x,.065,z));return g},
  ananas(){const g=new THREE.Group();const b=add(g,new THREE.SphereGeometry(.11,14,12),M('#d8a418',.5),0,.14,0);b.scale.set(.9,1.3,.9);for(let i=0;i<6;i++){const l=add(g,new THREE.ConeGeometry(.03,.14,5),M('#2e7d32'),Math.cos(i)*.03,.34,Math.sin(i)*.03);l.rotation.z=Math.cos(i)*.3;l.rotation.x=Math.sin(i)*.3}return g},
  feuilles(){const g=new THREE.Group();for(let i=0;i<6;i++){const l=add(g,new THREE.PlaneGeometry(.12,.3),new THREE.MeshStandardMaterial({color:'#3b8a2e',side:THREE.DoubleSide}),(i-2.5)*.035,.17,0);l.rotation.z=(i-2.5)*.18;l.rotation.y=.4}return g},
  pain(){const g=new THREE.Group();const p=add(g,new THREE.CapsuleGeometry(.06,.2,6,10),M('#b9772f',.8),0,.07,0);p.rotation.z=Math.PI/2;return g},
  cahier(c){const g=new THREE.Group();['#2e86de','#c0392b','#1f7a4d','#e0a526'].forEach((k,i)=>add(g,new THREE.BoxGeometry(.2,.025,.28),lab(i===0?'CAHIER':'',k,'#fff'),0,.015+i*.03,0));return g},
  stylo(){const g=new THREE.Group();for(let i=0;i<4;i++){const s=add(g,new THREE.CylinderGeometry(.01,.01,.15,6),M(['#2e86de','#c0392b','#1f7a4d','#222'][i]),(i-1.5)*.03,.02,0);s.rotation.z=Math.PI/2}return g},
  savon(){const g=new THREE.Group();[0,.06].forEach((y,i)=>add(g,new THREE.BoxGeometry(.14,.05,.09),lab('SAVON',i?'#f4a6c0':'#ffd6e4','#a0245a'),0,.03+y,0));return g},
  torche(){const g=new THREE.Group();const t=add(g,new THREE.CylinderGeometry(.03,.035,.2,10),M('#c0392b'),0,.1,0);add(g,new THREE.CylinderGeometry(.055,.035,.06,10),M('#444'),0,.23,0);add(g,new THREE.CylinderGeometry(.045,.045,.01,10),new THREE.MeshStandardMaterial({color:'#fff6b0',emissive:'#fff6b0',emissiveIntensity:.5}),0,.261,0);return g},
  poulet(){const g=new THREE.Group();const c=add(g,new THREE.SphereGeometry(.11,12,10),M('#e3b27a',.6),0,.1,0);c.scale.set(1.2,.8,.9);add(g,new THREE.CylinderGeometry(.02,.02,.1,6),M('#e3b27a'),.12,.12,.04);add(g,new THREE.CylinderGeometry(.02,.02,.1,6),M('#e3b27a'),.12,.12,-.04);return g},
  poisson(){const g=new THREE.Group();const c=add(g,new THREE.SphereGeometry(.1,12,10),M('#8d9aa6',.4),0,.07,0);c.scale.set(1.6,.6,.7);add(g,new THREE.ConeGeometry(.05,.1,4),M('#8d9aa6'),.17,.07,0).rotation.z=-Math.PI/2;return g},
  gateau(){const g=new THREE.Group();add(g,new THREE.CylinderGeometry(.11,.11,.08,16),M('#f0d9a8'),0,.04,0);add(g,new THREE.CylinderGeometry(.1,.1,.05,16),M('#d65f8d'),0,.1,0);add(g,new THREE.SphereGeometry(.02,8,6),M('#c0392b'),0,.15,0);return g}
};
export function produit(kind,opt){const f=MODELES[kind]||MODELES.boite;const g=f(opt&&opt.a,opt&&opt.b);g.userData.kind=kind;return g}
