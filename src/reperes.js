// Bâtiments repères de la cité : grands immeubles identifiables, répartis dans le village, où l'on entre
// pour faire la mission (comme l'école). Chacun a son architecture, une grande enseigne sur le toit et son véhicule ou son emblème.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl} from './world.js';
import {voiture,voitureJoueur,motoJoueur} from './trafic.js';

const W=10,D=7;
const M=(c,r)=>std(c,r===undefined?.85:r);
const verre=()=>new THREE.MeshStandardMaterial({color:0x9fd6ff,transparent:true,opacity:.35,roughness:.1,metalness:.2});

function enseigneToit(g,H,titre,sous,bg,ico){
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(8.4,1.9),new THREE.MeshStandardMaterial({map:T.textBoard([{t:ico+' '+titre,s:92,y:.38},{t:sous,s:44,y:.8,b:false,c:'#ffe9a8'}],1024,232,bg,'#ffffff'),roughness:.6}));
  pl.position.set(0,H+1.7,D/2-.4);g.add(pl);
  [-3.6,3.6].forEach(x=>box(g,.18,1.5,.18,M('#333'),x,H+.75,D/2-.45));
  const dos=pl.clone();dos.rotation.y=Math.PI;dos.position.z=D/2-.5;g.add(dos);
}
function fenetres(g,H,niv,porte){
  for(let r=0;r<niv;r++)for(let i=-3;i<=3;i++){
    if(r===0&&Math.abs(i)<=1)continue;
    box(g,.9,1.1,.1,M('#cfeaff',.2),i*1.3,1.4+r*2.5,D/2+.02);
  }
}
function porte(g,col){
  box(g,2,2.6,.2,M('#4a2f1b',.8),0,1.3,D/2+.05);
  box(g,3.2,.25,1.6,M(col||'#c9c9c9'),0,2.9,D/2+.8);
  [-1.5,1.5].forEach(x=>box(g,.2,2.9,.2,M('#e8e8e8'),x,1.45,D/2+1.5));
  box(g,3,.18,1.6,M('#bdbdbd'),0,.09,D/2+.9);
}
function mat3(mur,H){return box}

export const MODELES={
  police(g,o={}){
    const H=7;box(g,W,H,D,M('#6f8fb5'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#2b3f5c'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#2b3f5c');box(g,W,.4,.2,M('#2e4a7a'),0,3.9,D/2+.06);
    [-1,1].forEach(s=>{box(g,.7,.4,.5,new THREE.MeshBasicMaterial({color:s<0?0x2e7bff:0xe74c3c}),s*.8,H+.7,0)});
    cyl(g,.1,.12,6,M('#999'),-W/2+.8,3,D/2+1.2,8);box(g,1.6,1,.05,M('#1f5f9e'),-W/2+1.7,5.4,D/2+1.2);
    if(!o.compact){const v1=voiture('police');v1.position.set(-3.8,0,D/2+3.2);v1.rotation.y=Math.PI/2;g.add(v1);
    const v2=voiture('police');v2.position.set(3.8,0,D/2+3.2);v2.rotation.y=-Math.PI/2+.1;g.add(v2)}
    enseigneToit(g,H,'POLICE','Commissariat · Sécurité','#1c2e4a','🚓');
  },
  univ(g,o={}){
    const H=9;box(g,W,H,D,M('#b5532f'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#7a3a22'),0,H+.25,0);
    fenetres(g,H,3);porte(g,'#e8e8e8');
    if(!o.compact){[-3,-1,1,3].forEach(x=>cyl(g,.35,.4,H-1,M('#f1ede2'),x,(H-1)/2+.3,D/2+2.3,12));   // portique
    box(g,8,.5,3,M('#f1ede2'),0,H-.4,D/2+1.8);
    const fr=new THREE.Mesh(new THREE.ConeGeometry(4.6,1.6,3),M('#f1ede2'));fr.rotation.y=Math.PI/2;fr.scale.set(1,1,.35);fr.position.set(0,H+.4,D/2+2.1);fr.rotation.z=0;g.add(fr)}
    box(g,3,3.5,3,M('#8c3f22'),0,H+2,-.5);
    const cl=new THREE.Mesh(new THREE.CircleGeometry(.9,24),new THREE.MeshBasicMaterial({color:0xf8f4e6}));cl.position.set(0,H+2.3,1.02);g.add(cl);
    const d=new THREE.Mesh(new THREE.SphereGeometry(1.7,18,10,0,Math.PI*2,0,Math.PI/2),M('#2b6aa3',.5));d.position.set(0,H+3.7,-.5);g.add(d);
    enseigneToit(g,H+4.6,'UNIVERSITÉ','Savoir et recherche','#7d3c98','🎓');
  },
  sante(g,o={}){
    const H=7;box(g,W,H,D,M('#f2f5f5'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#c9cfd1'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#d93025');
    box(g,2.8,.8,.1,M('#c0392b'),0,5.2,D/2+.08);box(g,.8,2.8,.1,M('#c0392b'),0,5.2,D/2+.08);
    if(!o.compact){const am=voiture('ambulance');am.position.set(-3.6,0,D/2+3.2);am.rotation.y=Math.PI/2;g.add(am)}
    const h=new THREE.Mesh(new THREE.CircleGeometry(1.8,24),new THREE.MeshStandardMaterial({color:0x444444}));h.rotation.x=-Math.PI/2;h.position.set(2,H+.52,-.5);g.add(h);
    box(g,.25,.02,1.6,M('#fff'),1.6,H+.54,-.5);box(g,.25,.02,1.6,M('#fff'),2.4,H+.54,-.5);box(g,.8,.02,.25,M('#fff'),2,H+.54,-.5);
    enseigneToit(g,H,'CENTRE DE SANTÉ','Soins pour tous','#1f7a4d','🏥');
  },
  biblio(g,o={}){
    const H=7;box(g,W,H,D,M('#efe3c8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#8c5a2b'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#8c5a2b');
    if(!o.compact){[-3.6,-1.2,1.2,3.6].forEach(x=>cyl(g,.3,.34,H-1.2,M('#f7f1e1'),x,(H-1.2)/2+.3,D/2+1.9,12));
    box(g,8.6,.4,2.6,M('#f7f1e1'),0,H-.7,D/2+1.6);
    for(let i=0;i<3;i++)box(g,9,.18,1.2-i*.25,M('#cfc6b2'),0,.09+i*.18,D/2+1.2+ (2-i)*.3);
    [[-4.2,'#c0392b'],[-3.7,'#2e86de'],[-3.2,'#e0a526'],[3.2,'#1f7a4d'],[3.7,'#8e44ad'],[4.2,'#d35400']].forEach(([x,c],i)=>box(g,.35,1.3+(i%3)*.2,.9,M(c),x,.9,D/2+4.2))}
    enseigneToit(g,H,'BIBLIOTHÈQUE','Lire · Apprendre · Rêver','#8c5a2b','📚');
  },
  autoecole(g){
    const H=6;box(g,W,H,D,M('#f4d03f'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1f5f9e'),0,H+.25,0);
    box(g,W,.7,.2,M('#1f5f9e'),0,H*.55,D/2+.06);fenetres(g,H,2);porte(g,'#1f5f9e');
    const v=voiture('auto','#ffffff');v.position.set(-3.6,0,D/2+3.4);v.rotation.y=Math.PI/2;g.add(v);box(g,.6,.3,.25,M('#e0a526'),-3.6,1.8,D/2+3.4);
    [2,3,4,5].forEach(x=>cyl(g,.2,.32,.6,M('#e67e22'),x,.3,D/2+3.2,10));
    box(g,.12,2.4,.12,M('#555'),4.2,1.2,D/2+4.4);box(g,1.1,1.1,.08,M('#c0392b'),4.2,2.7,D/2+4.4);
    enseigneToit(g,H,'AUTO-ÉCOLE','Permis · Conduite · Sécurité','#1f5f9e','🚦');
  },
  musee(g){
    const H=15;box(g,W,H,D,M('#e9dcc0'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#8c5a2b'),0,H+.25,0);
    [3,6,9,12].forEach(y=>box(g,W+.2,.18,D+.2,M('#b8956a'),0,y,0));          // plateaux des étages
    fenetres(g,H,5);porte(g,'#8c5a2b');
    [-3.6,-1.2,1.2,3.6].forEach(x=>cyl(g,.3,.34,H-1.2,M('#f7f1e1'),x,(H-1.2)/2+.3,D/2+1.9,12));
    box(g,9,.4,2.6,M('#f7f1e1'),0,4.6,D/2+1.6);
    [[-6,'#c0392b'],[6,'#2e86de']].forEach(([x,c])=>{cyl(g,.06,.06,5,M('#777'),x,2.5,D/2+4.2,6);box(g,1.1,.7,.04,M(c),x+(x<0?.6:-.6),4.7,D/2+4.2)});
    enseigneToit(g,H,'MUSÉE DU CONGO','Histoire · Cultures · Nature','#8c5a2b','🏺');
  },
  supermarche(g){
    const H=6;box(g,W,H,D,M('#f4f1e8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1f7a4d'),0,H+.25,0);
    box(g,W,1,.2,M('#1f7a4d'),0,H*.55,D/2+.06);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.1,D/2+.06);g.add(vi);
    porte(g,'#1f7a4d');
    [-3.8,-3.1,-2.4].forEach(x=>{box(g,.6,.5,.9,M('#9aa3ad'),x,.55,D/2+2.9);box(g,.6,.04,.9,M('#c8ced4'),x,.9,D/2+2.9)});   // chariots
    [3.2,4.4].forEach((x,i)=>box(g,.9,.8,.9,M(i?'#e0a526':'#c0392b'),x,.4,D/2+2.8));                                         // cageots de fruits
    enseigneToit(g,H,'SUPERMARCHÉ','Tout pour la maison · Bons prix','#1f7a4d','🛒');
  },
  concession(g){
    const H=6;box(g,W,H,D,M('#2b2b2b'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#b8860b'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3.6),verre());vi.position.set(0,2.2,D/2+.06);g.add(vi);
    box(g,8.2,.2,.2,M('#b8860b'),0,4.1,D/2+.1);porte(g,'#b8860b');
    const sa=voitureJoueur('#c0392b');sa.position.set(-3,.3,D/2+2.2);sa.rotation.y=Math.PI/2+.4;sa.scale.setScalar(.95);g.add(sa);box(g,4.6,.3,3,M('#e0d6b8'),-3,.15,D/2+2.2);
    const sm=motoJoueur('#2e86de');sm.position.set(3.2,.3,D/2+2.2);sm.rotation.y=Math.PI/2-.4;g.add(sm);box(g,3,.3,2,M('#e0d6b8'),3.2,.15,D/2+2.2);
    [-4.6,4.6].forEach(x=>{cyl(g,.06,.06,5,M('#777'),x,2.5,D/2+4.2,6);box(g,1.1,.7,.04,M(x<0?'#e74c3c':'#f1c40f'),x+(x<0?.6:-.6),4.7,D/2+4.2)});
    enseigneToit(g,H,'CONCESSION','Motos · Voitures','#b8860b','🏍');
  }
};

// emplacements dans le village (portes tournées vers la grand-place) ; ry 0 : porte au sud (+z), ry π : porte au nord (-z)
export const REPERES=[
  {id:'concession',x:-22.2,z:9.6,ry:Math.PI,interieur:'concession',nom:'la Concession',coul:'#b8860b'},
  {id:'supermarche',x:-24,z:30,ry:0,interieur:'supermarche',nom:'le Supermarché',coul:'#1f7a4d'},
  {id:'musee',x:28,z:31,ry:0,interieur:'musee',nom:'le Musée du Congo',coul:'#8c5a2b'},
  {id:'autoecole',x:8.2,z:9.6,ry:Math.PI,interieur:'autoecole',nom:'l’Auto-école',coul:'#1f5f9e'}
];

export function construireReperes(w){
  const g=new THREE.Group();w.group.add(g);
  const portes=[];
  REPERES.forEach(r=>{
    const b=new THREE.Group();b.position.set(r.x,0,r.z);b.rotation.y=r.ry;g.add(b);
    MODELES[r.id==='police'?'police':r.id==='univ'?'univ':r.id==='sante'?'sante':r.id==='biblio'?'biblio':r.id](b);
    const cs=Math.cos(r.ry),sn=Math.sin(r.ry);
    // emprise (le véhicule garé devant reste traversable)
    w.boxes.push({x0:r.x-W/2,x1:r.x+W/2,z0:r.z-D/2,z1:r.z+D/2});
    const dz=D/2+1.4;
    portes.push(Object.assign({},r,{px:r.x+dz*sn,pz:r.z+dz*cs}));
  });
  return {portes};
}

// ---------- Station-service : auvent, deux pompes et une boutique. On y arrive en véhicule, on descend, on fait le plein.
// (x, z) : centre des pompes ; la boutique est derrière (côté +z local). Retourne les positions des pompes.
export function construireStation(parent,cols,bxs,x,z,nom){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  box(g,13,.12,10,M('#8d8d8d',.95),0,.06,1.2);                                   // dalle
  box(g,13,.05,.35,M('#f1c40f'),0,.14,-3.7);                                       // ligne d'entrée
  // auvent
  box(g,11.4,.5,6.2,M('#d6232c'),0,4.5,0);box(g,11.6,.18,6.4,M('#ffffff'),0,4.2,0);
  [[-5,-2.4],[5,-2.4],[-5,2.4],[5,2.4]].forEach(([px,pz])=>{cyl(g,.22,.22,4.3,M('#e8e8e8'),px,2.15,pz,10);cols.push({x:x+px,z:z+pz,r:.45})});
  // pompes
  const pompes=[];
  [-1.8,1.8].forEach((px,i)=>{
    const c=i?'#1f5f9e':'#d6232c';
    box(g,.95,1.7,.7,M(c),px,.95,0);box(g,.8,.45,.04,M('#111'),px,1.45,.37);box(g,.5,.2,.05,M('#7CFC9a',.3),px,1.45,.4);
    box(g,.14,.5,.14,M('#222'),px-.55,.85,.2);box(g,.5,.12,.55,M('#333'),px,.06,0);
    cols.push({x:x+px,z:z,r:.7});pompes.push({x:x+px,z:z});
  });
  // boutique
  box(g,8,3.4,3.2,M('#f2e6c9'),0,1.7,5.4);box(g,8.4,.35,3.6,M('#d6232c'),0,3.55,5.4);
  box(g,5.2,1.6,.08,verre(),0,1.7,3.76);box(g,1.1,2.2,.1,M('#4a2f1b'),2.8,1.1,3.78);
  bxs.push({x0:x-4,x1:x+4,z0:z+3.8,z1:z+7});
  // grande enseigne haute, visible de loin
  cyl(g,.13,.16,7.4,M('#444'),-6.4,3.7,-3.2,8);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'⛽ STATION',s:104,y:.3},{t:nom||'SERVICE',s:70,y:.62},{t:'Carburant · 🪙',s:48,y:.86,b:false,c:'#ffe9a8'}],1024,598,'#c0392b','#ffffff'),roughness:.6}));
  pl.position.set(-6.4,7.6,-3.2);g.add(pl);const dos=pl.clone();dos.rotation.y=Math.PI;dos.position.z=-3.25;g.add(dos);
  // bidons et pneus
  [[5.2,3.2],[5.8,3.2]].forEach(([px,pz],i)=>cyl(g,.28,.28,.8,M(i?'#d6232c':'#1f5f9e'),px,.4,pz,10));
  return {pompes:pompes,x:x,z:z};
}
