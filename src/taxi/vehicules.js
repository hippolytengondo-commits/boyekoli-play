// Véhicules de BOYEKOLI TAXI : modèles 3D soignés (carrosseries arrondies, vitres, roues à jantes, phares) qui ressemblent aux
// véhicules de Kinshasa : taxi-voiture, taxi-moto, tricycle TVS, minibus « esprit de mort », camion à 6 roues, 4x4.
// Tous les modèles ont l'avant vers +Z, l'origine au sol, au centre.
import * as THREE from 'three';
import {motoJoueur,voitureJoueur} from '../trafic.js';
const std=(c,r,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r===undefined?.55:r},o||{}));
const cache={};const M=(c,r,o)=>cache[c+'|'+r+'|'+(o?JSON.stringify(o):'')]||(cache[c+'|'+r+'|'+(o?JSON.stringify(o):'')]=std(c,r,o));
const VERRE=()=>M('#1d2a36',.15,{metalness:.5}),NOIR=()=>M('#1a1a1a',.85),CHROME=()=>M('#d2d6da',.3,{metalness:.8}),PHARE=()=>new THREE.MeshBasicMaterial({color:0xfff2b8}),FEU=()=>new THREE.MeshBasicMaterial({color:0xd8261a}),CLIGN=()=>new THREE.MeshBasicMaterial({color:0xff9a1a});
const add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o};
const bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
// extrusion d'un profil latéral (x = longueur vers l'avant, y = hauteur) sur une largeur donnée, avec arrondis
function profil(pts,larg,bev){const sh=new THREE.Shape();pts.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();
  const b=bev===undefined?.1:bev,g=new THREE.ExtrudeGeometry(sh,{depth:Math.max(.01,larg-2*b),bevelEnabled:b>0,bevelThickness:b,bevelSize:b,bevelSegments:3,curveSegments:6});
  g.translate(0,0,-(larg-2*b)/2);g.rotateY(-Math.PI/2);return g}
function roue(g,x,y,z,r,l){const w=new THREE.Group();w.position.set(x,y,z);g.add(w);
  const p=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,20),M('#141414',.95));p.rotation.z=Math.PI/2;w.add(p);
  const j=new THREE.Mesh(new THREE.CylinderGeometry(r*.62,r*.62,l+.02,14),CHROME());j.rotation.z=Math.PI/2;w.add(j);
  const h=new THREE.Mesh(new THREE.CylinderGeometry(r*.2,r*.2,l+.05,8),M('#555',.5,{metalness:.8}));h.rotation.z=Math.PI/2;w.add(h);
  g.userData.roues=(g.userData.roues||[]);g.userData.roues.push(w);return w}
function plaque(g,z,y,face){const o=add(g,bx(.55,.17,.03),M('#f2f2ee',.6),0,y,z+(face>0?.02:-.02));return o}
function homme(g,x,y,z,coul,casque,tourne){const c=new THREE.Group();c.position.set(x,y,z);g.add(c);
  add(c,new THREE.CylinderGeometry(.2,.22,.6,8),M(coul||'#2a6fb8',.9),0,.35,0);add(c,new THREE.SphereGeometry(.17,10,8),M('#6b4a32',.8),0,.8,0);
  if(casque)add(c,new THREE.SphereGeometry(.2,10,8,0,6.3,0,1.6),M(casque,.4),0,.84,0);return c}

// ---------------- taxi / berline : caisse arrondie, habitacle vitré (chauffeur et clients visibles), lanterne « TAXI » ----------------
const VITRE=()=>new THREE.MeshStandardMaterial({color:0x9cc4de,transparent:true,opacity:.34,roughness:.06,metalness:.35,side:THREE.DoubleSide,depthWrite:false});
let _taxiTex=null;
function lanterne(g){if(!_taxiTex){const c=document.createElement('canvas');c.width=128;c.height=48;const x=c.getContext('2d');x.fillStyle='#f2c400';x.fillRect(0,0,128,48);x.fillStyle='#111';x.font='bold 34px system-ui';x.textAlign='center';x.fillText('TAXI',64,37);_taxiTex=new THREE.CanvasTexture(c)}
  const m=new THREE.MeshBasicMaterial({map:_taxiTex}),b=add(g,bx(.62,.22,.3),M('#f2c400',.4),0,1.7,-.1);[-1,1].forEach(s=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(.6,.21),m);p.position.set(s*.32,1.7,-.1);p.rotation.y=s*Math.PI/2;g.add(p)})}
export function berline(col,taxi){
  const g=new THREE.Group(),c=M(col,.28,{metalness:.5});
  add(g,profil([[-2.2,.34],[-2.22,.92],[-1.3,1.0],[-.95,1.02],[.95,1.02],[2.0,.92],[2.22,.62],[2.2,.34]],1.8,.1),c,0,0,0);                       // caisse
  add(g,profil([[-.92,1.0],[-.56,1.5],[.5,1.5],[.96,1.02]],1.64,.03),VITRE(),0,0,0);                                                               // habitacle vitré
  [[-.8,-.72],[.8,-.72],[-.8,.64],[.8,.64]].forEach(([x,z])=>add(g,bx(.07,.5,.07),c,x,1.27,z));                                                    // montants
  add(g,profil([[-.6,1.5],[.52,1.5],[.52,1.58],[-.6,1.58]],1.58,.04),c,0,0,0);                                                                      // toit
  [[-.42,.95,.3],[.42,.95,.3],[-.4,.95,-.62],[.4,.95,-.62]].forEach(([x,y,z])=>{add(g,bx(.5,.12,.5),M('#33302c',.9),x,y,z);add(g,bx(.5,.55,.1),M('#33302c',.9),x,1.22,z-.28)});   // sièges
  [-1,1].forEach(s=>{add(g,new THREE.SphereGeometry(.17,12,8),PHARE(),s*.62,.78,2.2);add(g,bx(.36,.14,.06),FEU(),s*.7,.84,-2.24);add(g,bx(.12,.1,.1),CLIGN(),s*.84,.6,2.2);add(g,bx(.2,.1,.08),M('#222'),s*1.0,1.12,.95);   // phares, feux, clignotants, rétroviseurs
    const ar=new THREE.Mesh(new THREE.TorusGeometry(.4,.06,6,14,Math.PI),M('#161616'));ar.position.set(s*.93,.5,1.38);ar.rotation.y=Math.PI/2;g.add(ar);const ar2=ar.clone();ar2.position.z=-1.35;g.add(ar2)});          // passages de roue
  add(g,bx(1.7,.14,.18),CHROME(),0,.42,2.22);add(g,bx(1.7,.14,.18),CHROME(),0,.42,-2.24);add(g,bx(.9,.22,.04),M('#2a2a2a'),0,.66,2.24);plaque(g,-2.26,.55,-1);plaque(g,2.27,.45,1);
  [[-.92,1.38],[.92,1.38],[-.92,-1.35],[.92,-1.35]].forEach(([x,z])=>roue(g,x,.38,z,.38,.26));
  if(taxi){lanterne(g);add(g,bx(1.84,.07,.9),M('#111'),0,.74,.05);for(let i=0;i<6;i++)add(g,bx(.3,.075,.3),M('#f4f4f4'),-.75+i*.3,.745,.05)}       // bande à damier
  const w=new THREE.Group();w.add(g);w.userData.dim={l:2.3,w:1.0};w.userData.type='berline';return w}
export function quatre(col){const g=voitureJoueur(col);g.scale.setScalar(1.2);const w=new THREE.Group();w.add(g);w.userData.dim={l:2.4,w:1.05};return w}

// ---------------- moto (taxi-moto) : même modèle que la moto achetée, avec conducteur (casque, gilet) ----------------
export function moto(col,passager){
  const g=new THREE.Group(),m=motoJoueur(col);m.scale.setScalar(1.1);g.add(m);
  homme(g,0,.98,-.35,'#d8d02a','#c0392b');if(passager)homme(g,0,.98,-.85,'#3a7a44','#2b2b2b');
  g.userData.dim={l:1.0,w:.5};return g}

// ---------------- tricycle TVS (moto à 3 roues) ----------------
export function tricycle(col){
  const g=new THREE.Group(),c=M(col||'#e8b800',.4,{metalness:.3}),n=NOIR();
  add(g,profil([[-1.3,.45],[-1.3,1.5],[.3,1.55],[.55,1.0],[1.2,.9],[1.35,.55],[1.3,.45]],1.45,.1),c,0,.12,0);                // cabine arrondie
  add(g,profil([[.2,1.0],[.3,1.5],[-.1,1.5],[-.1,1.0]],1.3,.04),VERRE(),0,.12,0);add(g,bx(1.3,.05,1.4),M('#222',.9),0,1.74,-.55);  // pare-brise + toile
  [-.7,.7].forEach(x=>add(g,bx(.06,1.0,.06),n,x,1.2,-1.2));add(g,bx(1.5,.07,1.9),M('#1d1d1d',.9),0,1.72,-.5);           // toit noir
  add(g,bx(1.2,.1,.5),M('#3a2a1a',.9),0,.7,-.8);                                                                          // banquette arrière
  add(g,new THREE.SphereGeometry(.14,10,8),PHARE(),0,.9,1.38);add(g,bx(.3,.1,.05),FEU(),0,.8,-1.32);
  roue(g,0,.34,1.0,.34,.18);[-.78,.78].forEach(x=>roue(g,x,.34,-.85,.34,.2));
  homme(g,0,.62,.2,'#2a6fb8',null);homme(g,-.35,.65,-.8,'#c0392b',null);
  g.userData.dim={l:1.5,w:.85};return g}

// ---------------- minibus « esprit de mort » (Toyota Hiace jaune, convoyeur sur le marchepied) ----------------
export function minibus(col){
  const g=new THREE.Group(),c=M(col||'#f0c000',.4,{metalness:.3});
  add(g,profil([[-3.0,.45],[-3.02,2.05],[1.7,2.1],[2.5,1.35],[3.0,1.0],[3.0,.45]],2.0,.12),c,0,.15,0);
  add(g,bx(2.06,.34,6.0),M('#1b1b1b',.7),0,.62,-.1);add(g,bx(2.08,.1,5.9),M('#2a6fd0',.5),0,.95,-.1);                      // bandes noire et bleue
  for(let i=0;i<5;i++)[-1,1].forEach(s=>add(g,bx(.04,.62,.85),VITRE(),s*1.03,1.78,-2.2+i*1.05));                              // vitres latérales
  add(g,profil([[1.75,1.3],[2.45,1.45],[2.45,1.9],[1.75,2.02]],1.8,.04),VERRE(),0,.15,0);                                    // pare-brise
  [-1,1].forEach(s=>{add(g,new THREE.SphereGeometry(.18,10,8),PHARE(),s*.75,.95,3.04);add(g,bx(.3,.2,.06),FEU(),s*.8,1.3,-3.08)});
  add(g,bx(2.0,.2,.22),CHROME(),0,.55,3.04);add(g,bx(2.0,.22,.4),M('#222',.8),0,.52,-3.12);add(g,bx(1.7,.06,3.2),M('#2a2a2a',.9),0,2.32,-.8);   // pare-chocs, galerie de toit
  add(g,bx(1.5,.3,.9),M('#8a5a2b',.9),0,2.5,-.8);                                                                           // bagages sur le toit
  add(g,bx(.9,.22,.04),M('#fff',.6),0,2.12,2.2);                                                                               // destination
  [[-1.0,1.9],[1.0,1.9],[-1.0,-1.9],[1.0,-1.9]].forEach(([x,z])=>roue(g,x,.45,z,.45,.28));
  homme(g,.3,.55,-3.12,'#c0392b',null);                                                                                       // convoyeur accroché à l'arrière
  g.userData.dim={l:3.2,w:1.15};return g}

// ---------------- camion à 6 roues ----------------
export function camion(col){
  const g=new THREE.Group(),c=M(col||'#2e7d4f',.5,{metalness:.25});
  add(g,profil([[1.2,.7],[1.2,2.3],[2.7,2.3],[3.2,1.7],[3.4,1.1],[3.4,.7]],2.3,.1),c,0,.25,0);                                // cabine
  add(g,bx(2.2,.7,.06),VERRE(),0,1.95,3.1).rotation.x=-.25;[-1,1].forEach(s=>add(g,bx(.04,.7,.9),VERRE(),s*1.16,1.9,2.2));
  add(g,bx(2.35,.35,7.2),M('#444',.8),0,.8,-1.2);                                                                              // châssis
  add(g,bx(2.45,.12,5.6),M('#7a5b34',.9),0,1.0,-1.8);[-1,1].forEach(s=>add(g,bx(.1,1.1,5.6),M('#8a6a3c',.9),s*1.2,1.6,-1.8));add(g,bx(2.45,1.1,.1),M('#8a6a3c',.9),0,1.6,-4.6);add(g,bx(2.45,1.1,.1),M('#8a6a3c',.9),0,1.6,.98);
  for(let i=0;i<6;i++)add(g,bx(.8,.5,.7),M(i%2?'#d9c9a0':'#c9b88a',.95),-.55+(i%2)*1.1,1.4,-4.0+Math.floor(i/2)*1.5);           // sacs
  [-1,1].forEach(s=>{add(g,new THREE.SphereGeometry(.2,10,8),PHARE(),s*.8,.95,3.4);add(g,bx(.3,.2,.06),FEU(),s*.9,.95,-4.62)});
  add(g,bx(2.4,.22,.3),CHROME(),0,.55,3.42);
  [[1.1,2.4],[-1.1,2.4]].forEach(([x,z])=>roue(g,x,.55,z,.55,.34));[[-1.1,-1.8],[1.1,-1.8],[-1.1,-3.3],[1.1,-3.3]].forEach(([x,z])=>roue(g,x,.55,z,.55,.34));
  g.userData.dim={l:4.2,w:1.3};return g}

export function creerVehicule(type,col,opt){
  if(type==='moto')return moto(col,opt&&opt.passager);if(type==='tvs')return tricycle(col);if(type==='bus')return minibus(col);
  if(type==='camion')return camion(col);if(type==='jeep')return quatre(col);return berline(col,opt&&opt.taxi)}

// personnage (client, chauffeur) : tête, buste, bras, jambes qui bougent quand il marche
export function personne(coul,peau){
  const g=new THREE.Group(),hab=M(coul||'#2a6fb8',.9),pe=M(peau||'#6b4a32',.8);
  const jg=new THREE.Group(),jd=new THREE.Group();jg.position.set(-.13,.85,0);jd.position.set(.13,.85,0);
  [jg,jd].forEach(j=>{const l=new THREE.Mesh(new THREE.CylinderGeometry(.09,.08,.85,8),M('#2b2b33',.9));l.position.y=-.42;j.add(l);g.add(j)});
  const t=new THREE.Mesh(new THREE.CylinderGeometry(.22,.2,.62,10),hab);t.position.y=1.15;g.add(t);
  [-1,1].forEach(s=>{const b=new THREE.Mesh(new THREE.CylinderGeometry(.065,.06,.6,6),hab);b.position.set(s*.29,1.12,0);g.add(b)});
  const h=new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),pe);h.position.y=1.6;g.add(h);
  g.userData.jg=jg;g.userData.jd=jd;return g}
