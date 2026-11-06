// Le Boulevard Triomphal et ses grands bâtiments (Stade des Martyrs, Kinshasa Arena, Palais du Peuple, Hôtel du Gouvernement,
// Musée National, Cathédrale du Centenaire, Centre culturel…) + les « robots » (feux de signalisation) et passages piétons.
// Placement d'après la description d'un Kinois ; les positions exactes restent à vérifier.
import * as THREE from 'three';
const M=(c,r,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
const add=(g,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);g.add(o);return o};
const bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);

const A={x:-172,z:-588},B={x:-378,z:-530};               // Sendwe  →  Kasa-Vubu (axe du boulevard Triomphal)
export const AXE={A,B};
const hx=B.x-A.x,hz=B.z-A.z,L=Math.hypot(hx,hz),ux=hx/L,uz=hz/L,rx=-uz,rz=ux;   // cap, et côté droit (vers le nord)
const pt=(t,cote,off)=>({x:A.x+hx*t+rx*cote*off,z:A.z+hz*t+rz*cote*off});
export const ang=Math.atan2(ux,uz);                         // rotation y pour aligner un bâtiment sur le boulevard

// ---- bâtiments (face avant vers +Z local ; on tourne ensuite vers le boulevard)
const bat={
  stade(g){ // Stade des Martyrs : grand anneau avec toit
    add(g,new THREE.CylinderGeometry(40,36,15,28,1,true),M(0xd8d6d0),0,7.5,0).material.side=THREE.DoubleSide;
    add(g,new THREE.TorusGeometry(40,2.2,8,32),M(0x4a5a78),0,15,0).rotation.x=Math.PI/2;
    add(g,new THREE.CylinderGeometry(30,30,.4,24),M(0x4f9c3c),0,.3,0);
    for(let i=0;i<24;i++){const a=i/24*6.283;add(g,bx(1.4,15,1.4),M(0xb9b6ae),Math.cos(a)*40,7.5,Math.sin(a)*40)}
    for(let i=0;i<6;i++){const a=i/6*6.283;add(g,bx(8,3,.5),M(i%2?0xd22c2c:0x2c5fd2),Math.cos(a)*40.6,12,Math.sin(a)*40.6).rotation.y=-a+Math.PI/2}},
  arena(g){ // Kinshasa Arena : salle couverte à dôme
    add(g,new THREE.CylinderGeometry(26,28,10,28),M(0xdedad2),0,5,0);
    const d=add(g,new THREE.SphereGeometry(26,24,12,0,6.283,0,1.2),M(0x5a6f8c),0,10,0);d.scale.y=.6;
    add(g,new THREE.TorusGeometry(26,1.2,6,28),M(0xd9a521),0,10,0).rotation.x=Math.PI/2},
  palais(g){ // Palais du Peuple : long bâtiment à colonnes, esplanade et fontaine
    add(g,bx(100,18,26),M(0xe6dcc3),0,9,0);add(g,bx(102,2,28),M(0x9a9588),0,19,0);add(g,bx(60,6,10),M(0xd7ccb0),0,21,0);
    for(let i=-9;i<=9;i++)add(g,bx(1.2,16,1.2),M(0xf5efe0),i*5,8,14);
    add(g,bx(96,.2,34),M(0xcdbf9a),0,.1,32);
    add(g,new THREE.CylinderGeometry(9,9,1.2,20),M(0x2e8b9b),0,.8,38);add(g,new THREE.ConeGeometry(2.2,7,10),M(0xbfe6f0),0,4.5,38)},
  gouvernement(g){ // Hôtel du Gouvernement : bâtiment jaune pâle à colonnes
    add(g,bx(56,13,16),M(0xe7e0a8),0,6.5,0);add(g,bx(58,1.2,17.5),M(0x3d6b4a),0,13.6,0);
    for(let i=-9;i<=9;i++)add(g,bx(.9,9,.9),M(0xf3efd2),i*3,4.5,8.6);
    [-1,1].forEach(s=>add(g,bx(12,15,16),M(0xd9d196),s*30,7.5,0));
    for(let i=0;i<4;i++)add(g,bx(.2,16,.2),M(0xdddddd),-6+i*4,22,0)},
  musee(g){ // Musée National
    add(g,bx(46,11,22),M(0xefe9dc),0,5.5,0);add(g,bx(24,5,2),M(0xd9b46b),0,12,10.5);
    for(let i=0;i<6;i++)add(g,bx(1.6,11,1.6),M(0xc9a35a),-10+i*4,5.5,11.5);add(g,new THREE.ConeGeometry(14,8,4),M(0xb4814a),0,14,0).rotation.y=Math.PI/4},
  cathedrale(g){ // Cathédrale du Centenaire : tour élancée moderne
    add(g,bx(34,12,22),M(0xf1f1ee),0,6,0);add(g,new THREE.CylinderGeometry(2.6,4,44,6),M(0xe9e9e4),-10,22,8);add(g,bx(.6,5,.6),M(0xd9a521),-10,47,8);add(g,bx(3,.6,.6),M(0xd9a521),-10,46,8);
    add(g,new THREE.ConeGeometry(14,10,4),M(0xcfd3d6),6,17,0).rotation.y=Math.PI/4},
  cck(g){ // Centre culturel de Kinshasa
    add(g,bx(40,10,20),M(0xcf7a3b),0,5,0);add(g,bx(42,1.2,22),M(0x6a2a1a),0,10.6,0);add(g,bx(14,14,6),M(0xe8c040),0,7,11)},
  institut(g){ add(g,bx(34,13,16),M(0xf0efe9),0,6.5,0);add(g,bx(35,1,17),M(0x2c7fb8),0,13.4,0);for(let i=0;i<7;i++)add(g,bx(2.2,2,.2),M(0x1d2a36),-12+i*4,8,8.1)},
  immeuble(g){ add(g,bx(22,28,16),M(0xcfd3d6),0,14,0);for(let i=0;i<7;i++)add(g,bx(18,.5,.1),M(0x3a4a5c),0,3+i*3.6,8.1)}};
export const BAT=bat;
const PLAN=[ // t le long du boulevard, cote : +1 droite (nord), -1 gauche (sud), off : distance à l'axe
  ['palais',.34,1,78,'Palais du Peuple',0],['gouvernement',.55,1,60,'Hôtel du Gouvernement',0],['musee',.72,1,56,'Musée National',0],['cathedrale',.88,1,54,'Cathédrale du Centenaire',0],
  ['stade',.12,-1,86,'Stade des Martyrs',0],['arena',.34,-1,64,'Kinshasa Arena',0],['institut',.55,-1,44,'BNMRS',0],['institut',.64,-1,44,'Inst. sup. des sciences infirmières',0],
  ['cck',.76,-1,46,'Centre culturel de Kinshasa',0],['immeuble',.86,-1,42,'',0],['immeuble',.93,-1,42,'',0]];
export const EXCL=[];
const RAYON={stade:44,palais:54,gouvernement:34,musee:28,cathedrale:24,arena:30,institut:22,cck:26,immeuble:15};
// Les bâtiments cherchent, près de leur emplacement théorique, un terrain sans route (le quartier est dense) ; s'il n'y en a pas, ils sont réduits.
export function quartier(scene,etiquette,rayonLibre){
  EXCL.length=0;const posees=[];
  PLAN.forEach(([k,t0,cote,off0,nom])=>{const R0=RAYON[k]||24;let best=null;
    for(const dt of [0,.03,-.03,.06,-.06,.09,-.09,.12,-.12,.16,-.16])for(let d=0;d<=110;d+=12){const t=Math.max(.02,Math.min(.98,t0+dt)),o=off0+d,q=pt(t,cote,o),f=rayonLibre(q.x,q.z),lib=posees.every(p=>Math.hypot(p.x-q.x,p.z-q.z)>p.r+Math.min(R0,f)+2);
      if(!lib)continue;const sc=f>=R0?1:Math.max(.4,f/R0),score=sc*100-Math.abs(dt)*60-d*.15;if(!best||score>best.score)best={score,t,o,sc,q};if(sc===1&&d<30)break}
    if(!best)return;const {q,sc,t,o}=best,g=new THREE.Group();bat[k](g);g.scale.setScalar(sc);g.position.set(q.x,0,q.z);g.rotation.y=Math.atan2(rx*-cote,rz*-cote);scene.add(g);
    posees.push({x:q.x,z:q.z,r:R0*sc});EXCL.push([q.x,q.z,R0*sc+4]);
    if(nom){const e=etiquette(nom,'#7a3b1f');e.position.set(q.x,(k==='stade'||k==='palais'?30:k==='cathedrale'?52:26)*Math.max(.7,sc),q.z);scene.add(e)}});
  const av=etiquette('Avenue du 24 Novembre','#555'),q=pt(.45,-1,24);av.position.set(q.x,9,q.z);scene.add(av)}

// ---- robots (feux) et passages piétons. Période 18 s : axe A vert 8 s, orange 1,5 s, puis axe B vert 8 s, orange 0,5 s.
export const PERIODE=18;
export function etatRobot(r,t){const k=(t+r.dec)%PERIODE;const a=k<8?'v':k<9.5?'o':'r',b=k<9.5?'r':k<17.5?'v':'o';return [a,b]}
export const DIR={x:ux,z:uz};
// Les « robots » de Kinshasa : feux humanoïdes solaires, bras tendus, sur un socle rayé rouge et blanc, avec un agent de la circulation.
function texRayure(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle='#f4f4f4';g.fillRect(0,0,64,64);g.fillStyle='#d62a1a';for(let i=-2;i<6;i++){g.beginPath();g.moveTo(i*16,64);g.lineTo(i*16+16,64);g.lineTo(i*16+48,0);g.lineTo(i*16+32,0);g.fill()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
export function robots(scene,pts){
  const list=[],zb=M(0xf2f2f2),rayure=new THREE.MeshLambertMaterial({map:texRayure()}),argent=M(0xc7ccd1),bleu=M(0x2f6fb5);
  pts.forEach((p,i)=>{const r={x:p.x,z:p.z,ax:p.ax,az:p.az,dec:(i*5)%PERIODE,lampA:[],lampB:[],w:p.w||11},d=r.w/2+2.5,g=new THREE.Group();
    add(g,bx(2.6,1.6,2.6),rayure,0,.8,0);                                   // socle rayé rouge et blanc
    add(g,bx(1.1,4,.9),i%2?bleu:argent,0,3.6,0);                            // corps
    add(g,bx(1.3,1.2,1.1),argent,0,6.2,0);                                  // tête
    const bras=add(g,bx(6.4,.35,.35),argent,0,5.4,0);bras.rotation.z=.12;    // bras tendus
    [-1,1].forEach(sg=>add(g,bx(.5,.5,.5),argent,sg*3.2,5.6,0));
    add(g,bx(2.6,.15,1.8),M(0x1a2a4a),0,7.2,0);                             // panneau solaire
    const lamp=(x,y,z,tab)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),new THREE.MeshBasicMaterial({color:0xff3b30}));m.position.set(x,y,z);g.add(m);tab.push(m)};
    lamp(0,6.3,.62,r.lampA);lamp(0,6.3,-.62,r.lampA);lamp(0,4.6,.5,r.lampA);lamp(.72,6.3,0,r.lampB);lamp(-.72,6.3,0,r.lampB);
    g.position.set(p.x,0,p.z);g.rotation.y=Math.atan2(p.ax,p.az);scene.add(g);
    // agent de la circulation (gilet orange)
    const ag=new THREE.Group();add(ag,new THREE.CylinderGeometry(.28,.3,1.2,8),M(0xf08a1c),0,1.5,0);add(ag,new THREE.CylinderGeometry(.27,.3,.9,8),M(0x2b4d8a),0,.45,0);add(ag,new THREE.SphereGeometry(.26,8,6),M(0x6b4a32),0,2.3,0);add(ag,new THREE.CylinderGeometry(.3,.3,.14,8),M(0xf4f4f4),0,2.55,0);
    ag.position.set(p.x-p.az*(d+.5),0,p.z+p.ax*(d+.5));scene.add(ag);
    // passages piétons (zébras)
    [-1,1].forEach(sg=>{for(let j=-4;j<=4;j++){const bar=add(scene,bx(.9,.06,3.2),zb,p.x+p.ax*sg*(d+2)-p.az*j*1.5,.16,p.z+p.az*sg*(d+2)+p.ax*j*1.5);bar.rotation.y=Math.atan2(p.ax,p.az)}});
    list.push(r)});
  return list}
export function majRobots(list,t){ // yeux du robot : rouge, orange ou vert selon l'état de chaque axe
  const C={r:0xff3b30,o:0xffb000,v:0x2ecc40};list.forEach(r=>{const e=etatRobot(r,t);r.lampA.forEach(m=>m.material.color.setHex(C[e[0]]));r.lampB.forEach(m=>m.material.color.setHex(C[e[1]]))})}
