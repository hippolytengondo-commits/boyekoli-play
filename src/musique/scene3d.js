// Studio 3D de BOYEKOLI MUSIC STUDIO : un grand hall en 5 espaces (salle de musique, répétition, scène, Afrique, studio)
// + une grande scène de concert. Les instruments sont des modèles 3D procéduraux, cliquables, animés quand on joue.
import * as THREE from 'three';
import {INSTR,ZONES} from './data.js';

const M=(c,r,m)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.7:r,metalness:m||0});
const SPACING=26,CONCERT_X=130;

// ---------- modèles d'instruments (origine au sol, avant vers +z, hauteur ≈ 1 à 1.6 m)
export function modele(id){
  const g=new THREE.Group(),c=INSTR[id].coul;
  const add=(geo,col,x,y,z,rx,ry,rz,sx,sy,sz,r,m)=>{const me=new THREE.Mesh(geo,M(col,r,m));me.position.set(x,y,z);if(rx||ry||rz)me.rotation.set(rx||0,ry||0,rz||0);if(sx!==undefined)me.scale.set(sx,sy,sz);g.add(me);return me};
  const box=(w,h,d,col,x,y,z,rx,ry,rz,r,m)=>add(new THREE.BoxGeometry(w,h,d),col,x,y,z,rx,ry,rz,1,1,1,r,m);
  const cyl=(r1,r2,h,col,x,y,z,rx,ry,rz,seg,r,m)=>add(new THREE.CylinderGeometry(r1,r2,h,seg||14),col,x,y,z,rx,ry,rz,1,1,1,r,m);
  const sph=(r,col,x,y,z,sx,sy,sz,rr,m)=>add(new THREE.SphereGeometry(r,16,12),col,x,y,z,0,0,0,sx||1,sy||1,sz||1,rr,m);
  const tor=(R,r,col,x,y,z,rx,ry,rz)=>add(new THREE.TorusGeometry(R,r,8,20),col,x,y,z,rx,ry,rz,1,1,1,.5,.3);
  const stand=(h,col)=>{cyl(.03,.03,h,col||'#444',0,h/2,0,0,0,0,6);[0,2.1,4.2].forEach(a=>box(.5,.03,.05,col||'#444',Math.cos(a)*.22,.03,Math.sin(a)*.22,0,-a,0))};
  const keys=(w,y,z,n,prof)=>{box(w,.1,prof||.45,'#f8f8f8',0,y,z);for(let i=0;i<n;i++){const x=-w/2+(i+.5)*w/n;if(i%7!==2&&i%7!==6&&i<n-1)box(w/n*.55,.07,prof*.6||.27,'#111',x+w/n/2,y+.08,z-.08)}};
  const cordes=(n,x0,x1,y0,y1,z0,z1,col)=>{for(let i=0;i<n;i++){const t=i/(n-1||1);const a=new THREE.Vector3(x0+(x1-x0)*t,y0,z0),b=new THREE.Vector3(x0+(x1-x0)*t,y1,z1);const d=a.distanceTo(b);const m=cyl(.004,.004,d,col||'#e8e0c0',(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,0,0,0,4);m.lookAt(b);m.rotateX(Math.PI/2)}};
  switch(id){
    case 'guitare_ac':case 'ukulele':case 'guitare_el':{
      const s=id==='ukulele'?.65:1,el=id==='guitare_el';
      stand(.7);const gg=new THREE.Group();gg.position.set(0,.75,0);gg.rotation.x=-.12;g.add(gg);
      const a2=(geo,col,x,y,z,sx,sy,sz)=>{const me=new THREE.Mesh(geo,M(col,.5,el?.4:0));me.position.set(x,y,z);me.scale.set(sx||1,sy||1,sz||1);gg.add(me);return me};
      if(el){a2(new THREE.BoxGeometry(.55*s,.7*s,.09),c,0,.35*s,0);a2(new THREE.BoxGeometry(.2,.24,.1),'#111',0,.5*s,.06).rotation.z=.2}
      else{a2(new THREE.SphereGeometry(.3*s,16,12),c,0,.25*s,0,1,1.1,.32);a2(new THREE.SphereGeometry(.22*s,16,12),c,0,.65*s,0,1,1,.32);a2(new THREE.CylinderGeometry(.08*s,.08*s,.05,16),'#111',0,.5*s,.12*s).rotation.x=Math.PI/2}
      a2(new THREE.BoxGeometry(.07,.9*s,.05),'#3a2412',0,(.65+.45)*s,0);a2(new THREE.BoxGeometry(.12,.2*s,.05),'#2a1a0c',0,(1.2)*s+.05,0);
      for(let i=0;i<(id==='ukulele'?4:6);i++)a2(new THREE.CylinderGeometry(.004,.004,1.25*s,4),'#ddd',-.025+i*(.05/(id==='ukulele'?3:5)),.8*s,.04);break}
    case 'violon':{
      stand(.6);const gg=new THREE.Group();gg.position.set(0,.65,0);gg.rotation.z=-.15;g.add(gg);
      const a2=(geo,col,x,y,z,sx,sy,sz)=>{const me=new THREE.Mesh(geo,M(col,.4));me.position.set(x,y,z);me.scale.set(sx||1,sy||1,sz||1);gg.add(me);return me};
      a2(new THREE.SphereGeometry(.2,16,12),c,0,.2,0,1,1.4,.3);a2(new THREE.SphereGeometry(.15,16,12),c,0,.55,0,1,1.2,.3);a2(new THREE.BoxGeometry(.04,.5,.03),'#1a0f08',0,.85,0);a2(new THREE.TorusGeometry(.04,.015,6,10),'#1a0f08',0,1.12,0);
      a2(new THREE.BoxGeometry(.01,.9,.01),'#ddd',0,.65,.08);
      const bow=cyl(.008,.008,1,'#8a5a2b',.45,.55,.1,0,0,.1,5);cyl(.003,.003,.95,'#f5f0e0',.45,.55,.11,0,0,.1,4);break}
    case 'harpe':{
      cyl(.05,.05,1.5,c,-.35,.85,0,0,0,0,10,.5,.2);box(.8,.05,.3,c,0,.05,0);
      const neck=box(1.1,.06,.12,c,0,1.55,0,0,0,-.35);box(.05,1.5,.25,c,.35,.85,0,0,0,.2);
      for(let i=0;i<10;i++){const x=-.3+i*.065,top=1.5-i*.08,bot=.2+i*.02;cyl(.004,.004,top-bot,'#f3ead0',x,(top+bot)/2,0,0,0,0,4)}break}
    case 'piano_cordes':{
      box(1.8,.12,1.3,'#15151b',0,.9,0,0,0,0,.3,.3);box(1.8,.1,.55,'#f8f8f8',0,.78,.8);for(let i=0;i<10;i++)box(.06,.06,.3,'#111',-.8+i*.18,.85,.65);
      const lid=box(1.8,.04,1.2,'#0b0b10',0,1.45,-.45,0,0,0,.2,.4);lid.rotation.x=.9;
      box(1.7,.04,1.1,'#2a2a30',0,.92,-.05);for(let i=0;i<14;i++)box(.012,.012,.9-i*.03,'#e8d08a',-.75+i*.11,.96,-.1);for(let i=0;i<8;i++)box(.05,.07,.07,'#c8b89a',-.8+i*.22,.97,.35);
      [[-.8,.5],[.8,.5],[0,-.5]].forEach(([x,z])=>cyl(.05,.05,.85,'#111',x,.43,z,0,0,0,8));
      box(.7,.1,.35,'#4a2f1b',0,.45,1.3);break}
    case 'piano':{
      box(1.6,1.3,.6,c,0,.75,-.15,0,0,0,.4,.2);box(1.7,.07,.7,'#2a2f3a',0,1.42,-.15);box(1.5,.1,.35,'#f8f8f8',0,.78,.28);
      for(let i=0;i<14;i++)if(i%7!==2&&i%7!==6)box(.05,.07,.22,'#111',-.65+i*.1,.84,.2);
      [[-.7,-.3],[.7,-.3]].forEach(([x,z])=>box(.1,.15,.1,'#111',x,.08,z));box(.6,.08,.3,'#4a2f1b',0,.3,.7);box(.4,.04,.04,'#d4a93c',0,.2,.3);break}
    case 'orgue':{
      box(1.5,.8,.7,c,0,.4,0);box(1.4,.07,.4,'#f8f8f8',0,.85,.2);[.2,.25,.3,.4,.5,.6,.7,.8,.9,1].forEach((h,i)=>cyl(.07,.07,h*1.4,'#d9c48a',-.65+i*.14,.8+h*.7,-.2,0,0,0,10,.3,.6));
      for(let i=0;i<6;i++)cyl(.03,.03,.1,'#8a5a2b',-.5+i*.2,.95,.1,Math.PI/2,0,0,6);break}
    case 'synthe':{
      stand(.7,'#222');box(1.4,.08,.5,c,0,.85,0,.15,0,0,.3,.4);box(1.3,.05,.28,'#f8f8f8',0,.9,.1,.15);for(let i=0;i<5;i++)cyl(.03,.03,.04,'#f1c40f',-.5+i*.2,.93,-.15,0,0,0,8);box(.4,.12,.01,'#37d67a',.5,.97,-.2,.15,0,0,.2).material.emissive=new THREE.Color('#37d67a');break}
    case 'clavier_elec':{
      cyl(.03,.03,.7,'#333',-.5,.35,0,0,0,0,6);cyl(.03,.03,.7,'#333',.5,.35,0,0,0,0,6);box(1.4,.07,.4,c,0,.75,0,0,0,0,.3,.4);box(1.3,.05,.22,'#f8f8f8',0,.8,.08);box(.3,.12,.01,'#6fb7e6',.5,.84,-.1);break}
    case 'flute':{
      stand(.8);cyl(.025,.025,1.1,c,0,.95,0,0,0,Math.PI/2*.15,10,.2,.8);for(let i=0;i<6;i++)cyl(.02,.02,.02,'#888',-.3+i*.12,.97,.02,Math.PI/2,0,0,8);break}
    case 'trompette':{
      stand(.7);tor(.18,.02,c,0,.9,0,0,0,0);cyl(.02,.02,.9,c,.1,.95,0,0,0,Math.PI/2,8,.2,.8);add(new THREE.ConeGeometry(.2,.35,16),c,.65,.95,0,0,0,-Math.PI/2,1,1,1,.2,.8);for(let i=0;i<3;i++)cyl(.02,.02,.14,'#ddd',-.1+i*.1,1.08,0,0,0,0,8);break}
    case 'saxophone':{
      stand(.4);cyl(.05,.07,1.1,c,0,.95,0,0,0,0,12,.2,.8);add(new THREE.TorusGeometry(.22,.06,10,14,Math.PI),c,.22,.42,0,0,0,Math.PI,1,1,1,.2,.8);add(new THREE.ConeGeometry(.17,.2,14),c,.44,.5,0,0,0,Math.PI,1,1,1,.2,.8);cyl(.02,.02,.3,c,-.1,1.55,0,0,0,Math.PI/2*.8,8);for(let i=0;i<5;i++)sph(.03,'#f5f0d0',.07,.7+i*.14,.05);break}
    case 'clarinette':{stand(.8);cyl(.035,.035,1.1,'#161616',0,1.0,0,0,0,0,10);add(new THREE.ConeGeometry(.08,.14,12),'#161616',0,.4,0,Math.PI,0,0);for(let i=0;i<6;i++)cyl(.04,.04,.02,'#bbb',0,.7+i*.14,0,0,0,0,10,.2,.8);break}
    case 'trombone':{stand(.7);cyl(.015,.015,1.2,c,0,.9,0,0,0,Math.PI/2,6,.2,.8);cyl(.015,.015,1.2,c,0,1.02,0,0,0,Math.PI/2,6,.2,.8);add(new THREE.TorusGeometry(.06,.015,6,10,Math.PI),c,-.6,.96,0,0,0,Math.PI/2,1,1,1,.2,.8);add(new THREE.ConeGeometry(.2,.3,16),c,.7,.96,0,0,0,-Math.PI/2,1,1,1,.2,.8);tor(.12,.015,c,.1,.96,0,0,Math.PI/2,0);break}
    case 'harmonica':{stand(.9);box(.4,.1,.1,'#b9bcc4',0,.95,0,0,0,0,.3,.7);for(let i=0;i<10;i++)box(.03,.05,.02,'#111',-.17+i*.038,.95,.06);break}
    case 'batterie':{
      cyl(.35,.35,.4,c,0,.4,0,Math.PI/2,0,0,18,.4,.2);cyl(.36,.36,.02,'#f8f8f8',0,.4,.2,Math.PI/2,0,0,18);
      cyl(.22,.22,.22,'#ddd',-.65,.9,.3,0,0,0,16,.3,.4);cyl(.16,.16,.2,c,-.2,.95,.1,0,0,0,16,.4);cyl(.17,.17,.2,c,.2,.95,.1,0,0,0,16,.4);
      cyl(.26,.26,.4,c,.75,.45,.2,0,0,0,16,.4);[[-.65,.9],[.75,.9]].forEach(([x,y],i)=>{cyl(.012,.012,.7,'#666',x,y-.35+(i?.55:0),.3,0,0,0,4);cyl(.25,.25,.015,'#d9b02a',x,y+(i?.7:.05)+.2,.3,0,0,.1,18,.3,.8)});
      cyl(.18,.18,.012,'#d9b02a',-.9,1.1,-.1,0,0,0,18,.3,.8);cyl(.2,.2,.012,'#d9b02a',-.9,1.05,-.1,0,0,0,18,.3,.8);cyl(.015,.015,1,'#666',-.9,.55,-.1,0,0,0,4);cyl(.17,.17,.28,'#555',0,.2,.8,0,0,0,10);break}
    case 'tamtam':{cyl(.3,.27,.7,c,0,.8,0,0,0,0,16,.8);cyl(.31,.31,.03,'#f2e6c9',0,1.16,0,0,0,0,16);[-.25,.25].forEach(x=>cyl(.03,.03,.5,'#5a3a22',x,.25,0,0,0,x>0?.2:-.2,6));tor(.3,.015,'#5a3a22',0,1.1,0,Math.PI/2,0,0);break}
    case 'djembe':{
      cyl(.16,.11,.45,c,0,.25,0,0,0,0,14,.8);cyl(.28,.16,.5,c,0,.72,0,0,0,0,14,.8);cyl(.28,.28,.03,'#f2e6c9',0,.98,0,0,0,0,16);tor(.28,.015,'#5a3a22',0,.95,0,Math.PI/2,0,0);for(let i=0;i<8;i++)cyl(.008,.008,.5,'#d9c48a',Math.cos(i*.785)*.2,.65,Math.sin(i*.785)*.2,0,0,0,4);break}
    case 'bongos':{stand(.7,'#555');[[-.18,.8,.2],[.18,.8,.28]].forEach(([x,y,r],i)=>{cyl(.15+i*.03,.12+i*.03,.35,c,x,y,0,0,0,0,14,.7);cyl(.15+i*.03,.15+i*.03,.02,'#f2e6c9',x,y+.18,0,0,0,0,14)});break}
    case 'congas':{[[-.25,1.05],[.25,1.15]].forEach(([x,h],i)=>{cyl(.17+i*.03,.1,h,c,x,h/2+.1,0,0,0,0,14,.7);cyl(.17+i*.03,.17+i*.03,.03,'#f2e6c9',x,h+.1,0,0,0,0,14);[0,1,2].forEach(k=>tor(.12+k*.008,.012,'#333',x,.25+k*.3,0,Math.PI/2,0,0))});break}
    case 'tambour_congolais':{cyl(.3,.3,1.1,c,0,.55,0,0,0,Math.PI/2,16,.9);box(.9,.05,.12,'#2a1a0c',0,.86,0);box(.3,.05,.1,'#2a1a0c',-.6,.86,0).visible=false;[-.5,-.2,.1,.4].forEach((x,i)=>box(.04,.4,.52,['#d6302b','#f1c40f','#2e9e4a','#222'][i%4],x,.55,0));box(.25,.35,.3,c,0,.25,.35).visible=false;
      cyl(.025,.025,.5,'#d9c48a',.75,1,0,0,0,.4,6);cyl(.025,.025,.5,'#d9c48a',.9,1,0,0,0,-.3,6);break}
    case 'ngoma':{cyl(.2,.13,1.1,c,0,.65,0,0,0,0,14,.8);cyl(.23,.23,.04,'#f2e6c9',0,1.2,0,0,0,0,16);for(let i=0;i<8;i++){const a=i*.785;cyl(.01,.01,.9,'#e8d6a0',Math.cos(a)*.18,.7,Math.sin(a)*.18,0,0,0,4)}[0,1,2].forEach(k=>tor(.18-k*.01,.015,['#f1c40f','#d6302b','#222'][k],0,.4+k*.3,0,Math.PI/2,0,0));break}
    case 'xylophone':{box(1.3,.05,.06,'#3a2412',0,.78,-.2);box(1.3,.05,.06,'#3a2412',0,.78,.2);[-.6,.6].forEach(x=>cyl(.03,.03,.78,'#555',x,.39,0,0,0,0,6));
      for(let i=0;i<12;i++)box(.08,.04,.5-i*.025,['#d6302b','#e67e22','#f1c40f','#2e9e4a','#2c7fb8','#7d3fd1'][i%6],-.55+i*.1,.83,0);cyl(.01,.01,.4,'#8a5a2b',.7,.95,.3,0,0,.5,4);sph(.04,'#d6302b',.78,1.12,.3);break}
    case 'balafon':{box(1.4,.05,.07,'#4a2f1b',0,.65,-.2);box(1.4,.05,.07,'#4a2f1b',0,.65,.2);for(let i=0;i<12;i++){const w=.9-i*.04;box(.09,.04,.5-i*.02,'#c97b3a',-.6+i*.11,.7,0);sph(.07+(11-i)*.006,'#d4a93c',-.6+i*.11,.4,0,1,1.7,1)};[-.65,.65].forEach(x=>cyl(.03,.03,.65,'#4a2f1b',x,.33,0,0,0,0,6));break}
    case 'likembe':{box(.55,.12,.4,c,0,.7,0,-.3,0,0,.8);for(let i=0;i<9;i++)box(.025,.015,.28-Math.abs(i-4)*.015,'#c8c8d0',-.2+i*.05,.77,-.02,-.3,0,0,.2,.8);cyl(.07,.07,.03,'#111',0,.7,.18,Math.PI/2+.3,0,0,12);box(.55,.04,.04,'#8a5a2b',0,.75,.1,-.3);stand(.6,'#5a3a22');break}
    case 'maracas':{stand(.7,'#555');[[-.18,'#d6302b'],[.18,'#2e9e4a']].forEach(([x,col])=>{cyl(.02,.02,.4,'#a06a2e',x,.9,0,0,0,x<0?.2:-.2,6);sph(.14,col,x*1.5,1.15,0,1,1.2,1)});break}
    case 'triangle':{stand(.9,'#555');cyl(.005,.005,.3,'#999',0,1.35,0,0,0,0,4);[[0,1.1,0],[.17,1.25,.07],[-.17,1.25,-.07]].forEach(()=>0);const t=new THREE.Group();t.position.set(0,1.1,0);g.add(t);[[0,0,.46,0],[.2,.2,.36,Math.PI/3],[-.2,.2,.36,-Math.PI/3]].forEach(([x,y,L,a])=>{const me=cyl(.012,.012,L,'#d9dde3',x,y,0,0,0,a===0?Math.PI/2:a,6,.2,.9);t.add(me)});break}
    case 'tambourin':{stand(.8,'#555');tor(.22,.03,c,0,1.1,0,0,0,0);cyl(.21,.21,.01,'#f2e6c9',0,1.1,0,Math.PI/2,0,0,18);for(let i=0;i<8;i++)cyl(.04,.04,.01,'#d9dde3',Math.cos(i*.785)*.22,1.1+Math.sin(i*.785)*.22,0,Math.PI/2,0,0,10,.2,.9);break}
  }
  return g;
}

export function creerStudio3D(el,opt){
  const o=Object.assign({onPick:()=>{},low:false},opt||{});
  const W0=Math.max(200,el.clientWidth),H0=Math.max(150,el.clientHeight);
  const r=new THREE.WebGLRenderer({antialias:false});r.setPixelRatio(o.low?1:Math.min(devicePixelRatio||1,1.5));r.setSize(W0,H0);el.appendChild(r.domElement);r.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';
  const sc=new THREE.Scene();sc.background=new THREE.Color('#2a1f45');sc.fog=new THREE.Fog('#2a1f45',30,110);
  const cam=new THREE.PerspectiveCamera(58,W0/H0,.1,200);
  sc.add(new THREE.HemisphereLight('#fff1dc','#6a5a8a',1.9));const dl=new THREE.DirectionalLight('#ffffff',1.1);dl.position.set(10,14,14);sc.add(dl);
  // ---------- hall
  const total=ZONES.length;
  const sols=['#a8744a','#7a8fa6','#4a3a2a','#6f9a4f','#3a3a4a'];
  const murs=['#f0d9a8','#cfe3f2','#ffd2d0','#d9ecd0','#e3d5f2'];
  const lights=[];
  ZONES.forEach((z,zi)=>{
    const f=new THREE.Mesh(new THREE.PlaneGeometry(SPACING,18),M(sols[zi],.6));f.rotation.x=-Math.PI/2;f.position.set(z.x,0,0);sc.add(f);
    const w=new THREE.Mesh(new THREE.PlaneGeometry(SPACING,6),M(murs[zi],.9));w.position.set(z.x,3,-9);sc.add(w);
    const band=new THREE.Mesh(new THREE.PlaneGeometry(SPACING,.6),new THREE.MeshBasicMaterial({color:z.coul}));band.position.set(z.x,4.5,-8.95);sc.add(band);
    const tp=new THREE.Mesh(new THREE.BoxGeometry(SPACING,.2,18),M('#4a3a70',.9));tp.position.set(z.x,6.3,0);sc.add(tp);
    // panneau d'espace
    const cv=document.createElement('canvas');cv.width=512;cv.height=128;const g=cv.getContext('2d');g.fillStyle=z.coul;g.fillRect(0,0,512,128);g.fillStyle='#fff';g.font='bold 54px system-ui';g.textAlign='center';g.fillText(z.ico+' '+z.nom.toUpperCase(),256,82);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(7,1.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));pl.position.set(z.x,5.1,-8.9);sc.add(pl);
    // faisceaux lumineux (projecteurs) colorés
    [-6,0,6].forEach((dx,k)=>{const cone=new THREE.Mesh(new THREE.ConeGeometry(2.3,6,16,1,true),new THREE.MeshBasicMaterial({color:z.coul,transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false}));cone.position.set(z.x+dx,3,-2);sc.add(cone);lights.push({m:cone,z:zi,base:.1,t:0});
      const sp=new THREE.Mesh(new THREE.CylinderGeometry(.25,.4,.5,10),M('#111'));sp.position.set(z.x+dx,5.8,-2);sc.add(sp)});
    // notes décoratives au mur
    for(let k=0;k<5;k++){const c2=document.createElement('canvas');c2.width=c2.height=64;const g2=c2.getContext('2d');g2.fillStyle=z.coul;g2.font='bold 56px system-ui';g2.fillText(['♪','♫','♩','♬','♭'][k],10,52);const s=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c2),transparent:true}));s.position.set(z.x-9+k*4.6,2.2+(k%2)*.8,-8.9);sc.add(s)}
  });
  // estrade de la scène + enceintes
  const sc0=ZONES[2];const est=new THREE.Mesh(new THREE.BoxGeometry(18,.4,6),M('#5a3a22'));est.position.set(sc0.x,.2,-5.5);sc.add(est);
  [-1,1].forEach(d=>{const e=new THREE.Mesh(new THREE.BoxGeometry(1,2,.9),M('#161616'));e.position.set(sc0.x+d*10.2,1,-6);sc.add(e);[.5,1.4].forEach(y=>{const cc=new THREE.Mesh(new THREE.CircleGeometry(.3,14),M('#333'));cc.position.set(sc0.x+d*10.2,y,-5.54);sc.add(cc)})});
  // studio d'enregistrement : cabine vitrée, micro, table de mixage, grand écran
  const st=ZONES[4];
  const vit=new THREE.Mesh(new THREE.BoxGeometry(6,3,.1),new THREE.MeshStandardMaterial({color:0x8fd0ff,transparent:true,opacity:.28}));vit.position.set(st.x-6,1.6,-3);sc.add(vit);
  const mic=new THREE.Group();mic.position.set(st.x-6,0,-5);const mst=new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1.6,6),M('#222'));mst.position.y=.8;mic.add(mst);const mh=new THREE.Mesh(new THREE.SphereGeometry(.12,12,10),M('#444',.3,.6));mh.position.y=1.65;mic.add(mh);sc.add(mic);
  const table=new THREE.Group();table.position.set(st.x+1,0,-3.5);sc.add(table);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(5,.9,1.4),M('#2a2a34'));tb.position.y=.45;table.add(tb);
  for(let i=0;i<14;i++){const s=new THREE.Mesh(new THREE.BoxGeometry(.08,.1,.5),M('#eee'));s.position.set(-2.1+i*.32,.95,.1);table.add(s);const k=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.06,8),M(['#d6302b','#f1c40f','#2e9e4a','#2c7fb8'][i%4]));k.position.set(-2.1+i*.32,.95,-.4);table.add(k)}
  const ecr=new THREE.Mesh(new THREE.PlaneGeometry(6,2.6),new THREE.MeshBasicMaterial({color:'#1b2b4a'}));ecr.position.set(st.x+1,3.2,-8.85);sc.add(ecr);
  const barres=[];for(let i=0;i<16;i++){const b=new THREE.Mesh(new THREE.PlaneGeometry(.26,1),new THREE.MeshBasicMaterial({color:i<10?'#37d67a':i<14?'#f1c40f':'#d6302b'}));b.position.set(st.x-1.8+i*.34,2.2,-8.8);sc.add(b);barres.push(b)}
  // ---------- instruments
  const objs={},cibles=[];
  ZONES.forEach(z=>{
    const L=z.inst,n=L.length;if(!n)return;
    const deux=false,front=n;
    L.forEach((id,k)=>{
      const rang=deux&&k>=front?1:0,idx=rang?k-front:k,cnt=rang?n-front:front;
      const x=z.x+(idx-(cnt-1)/2)*(Math.min(2.9,24/cnt)),zz=rang?-6:-3.2;
      const m=modele(id);m.position.set(x,rang?.3:0,zz);m.userData.inst=id;m.userData.base=1;const sd=id==='batterie'||id==='piano_cordes'||id==='orgue'?1.35:1.65;m.scale.setScalar(sd);m.userData.base=sd;
      sc.add(m);objs[id]=m;m.traverse(c=>{if(c.isMesh)cibles.push(c)});
      // étiquette
      const cv=document.createElement('canvas');cv.width=256;cv.height=64;const g=cv.getContext('2d');g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,256,64);g.fillStyle='#fff';g.font='bold 26px system-ui';g.textAlign='center';const nm=INSTR[id].nom.length>20?INSTR[id].nom.slice(0,19)+'…':INSTR[id].nom;g.fillText(nm,128,40);
      const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false,transparent:true}));sp.position.set(x,rang?3.1:2.9,zz+.2);sp.scale.set(n>8?2.2:2.5,n>8?.55:.62,1);sp.renderOrder=3;sc.add(sp);
    });
  });
  // ---------- personnages musiciens
  function musicien(col,peau){
    const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CylinderGeometry(.22,.28,.8,10),M(col));b.position.y=.95;g.add(b);
    const h=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),M(peau||'#7a4a2e'));h.position.y=1.55;g.add(h);
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.21,12,8,0,6.28,0,1.3),M('#222'));cap.position.y=1.6;g.add(cap);
    [-1,1].forEach(d=>{const bras=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.6,6),M(col));bras.position.set(d*.3,1.0,.1);bras.rotation.z=d*.35;bras.rotation.x=-.6;g.add(bras);g.userData['b'+d]=bras});
    [-1,1].forEach(d=>{const j=new THREE.Mesh(new THREE.CylinderGeometry(.08,.08,.7,6),M('#222'));j.position.set(d*.12,.35,0);g.add(j)});
    return g}
  const musiciens=[];
  [[ZONES[0].x+7,-1.8,'#e8a23a'],[ZONES[1].x-8,-1.5,'#4aa0d8'],[ZONES[2].x+7.5,-1,'#d6302b'],[ZONES[3].x-8,-1.6,'#2e9e4a'],[ZONES[4].x-8.2,-4,'#7d3fd1']].forEach(([x,z,col],i)=>{const m=musicien(col,['#7a4a2e','#5a3319','#8d5524'][i%3]);m.position.set(x,0,z);m.rotation.y=-.5+i*.1;sc.add(m);musiciens.push(m)});
  // ---------- grande scène de concert (zone à part)
  const cx=CONCERT_X;const concert=new THREE.Group();sc.add(concert);
  {const f=new THREE.Mesh(new THREE.PlaneGeometry(SPACING,22),M('#2a1a3a',.7));f.rotation.x=-Math.PI/2;f.position.set(cx,0,0);concert.add(f);
   const es=new THREE.Mesh(new THREE.BoxGeometry(22,.6,8),M('#6a3a22'));es.position.set(cx,.3,-6);concert.add(es);
   const fond=new THREE.Mesh(new THREE.PlaneGeometry(SPACING,9),M('#2b1a4a'));fond.position.set(cx,4.5,-11);concert.add(fond);
   [-1,1].forEach(d=>{const rid=new THREE.Mesh(new THREE.BoxGeometry(3.5,9,.6),M('#b0243a',.9));rid.position.set(cx+d*10.5,4.5,-9);concert.add(rid)});
   const bann=document.createElement('canvas');bann.width=1024;bann.height=200;const gb=bann.getContext('2d');gb.fillStyle='#1f5f9e';gb.fillRect(0,0,1024,200);gb.fillStyle='#fff';gb.font='bold 80px system-ui';gb.textAlign='center';gb.fillText('🎵 BOYEKOLI MUSIC STUDIO',512,130);
   const ba=new THREE.Mesh(new THREE.PlaneGeometry(10,1.95),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(bann)}));ba.position.set(cx,7,-10.6);concert.add(ba);
   for(let i=0;i<24;i++){const sp=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),M(['#222','#442','#334','#3a2a2a'][i%4]));const bod=new THREE.Mesh(new THREE.CylinderGeometry(.2,.28,.7,8),M(['#2c7fb8','#d6302b','#2e9e4a','#e8a23a','#7d3fd1'][i%5]));const gp=new THREE.Group();gp.add(bod);sp.position.y=.65;gp.add(sp);bod.position.y=.3;gp.position.set(cx-9+(i%12)*1.65,0,5+Math.floor(i/12)*2);concert.add(gp);musiciens.push(gp);gp.userData.public=true}
  }
  concert.visible=false;
  const ctrav=[];   // musiciens et instruments du concert courant
  let concertActif=false;
  function concertInstaller(pistes){
    ctrav.forEach(g=>concert.remove(g));ctrav.length=0;
    const n=pistes.length;
    pistes.forEach((p,i)=>{const x=cx+(i-(n-1)/2)*3.8,m=modele(p.inst);m.position.set(x,.6,-5);m.scale.setScalar(1.3);m.userData.piste=i;concert.add(m);ctrav.push(m);
      const mu=musicien(['#e8a23a','#d6302b','#4aa0d8','#2e9e4a','#7d3fd1'][i%5]);mu.position.set(x,.6,-3.6);mu.rotation.y=Math.PI;concert.add(mu);mu.userData.piste=i;ctrav.push(mu)})}
  // ---------- notes flottantes et confettis
  const notes=[];const noteTex=['♪','♫','♩','♬'].map((s,k)=>{const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');g.fillStyle=['#ffd54f','#7CFC00','#ff6fa8','#6fd0ff'][k];g.font='bold 56px system-ui';g.fillText(s,12,52);return new THREE.CanvasTexture(c)});
  function emettre(pos,n){for(let i=0;i<n;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:noteTex[(Math.random()*4)|0],transparent:true,depthTest:false}));s.position.copy(pos).add(new THREE.Vector3((Math.random()-.5)*.6,1.6+Math.random()*.4,(Math.random()-.5)*.4));s.scale.setScalar(.5);s.userData={vy:1+Math.random(),vx:(Math.random()-.5)*.8,vie:1.3};s.renderOrder=4;sc.add(s);notes.push(s)}}
  // ---------- caméra : vol entre les espaces
  const zoneParId={};ZONES.forEach(z=>zoneParId[z.id]=z);zoneParId.concert={x:CONCERT_X,id:'concert'};
  let cible=new THREE.Vector3(0,2.9,7.4),regard=new THREE.Vector3(0,1.3,-3.2);
  const pos=new THREE.Vector3().copy(cible),look=new THREE.Vector3().copy(regard);let lacet=0,lacetC=0,zoneId='salle';
  function zone(id,instant){
    const z=zoneParId[id];if(!z)return;zoneId=id;
    if(id==='concert'){cible.set(z.x,4.5,10);regard.set(z.x,1.6,-5)}else{cible.set(z.x,2.9,7.4);regard.set(z.x,1.3,-3.2)}
    if(instant){pos.copy(cible);look.copy(regard)}
    concert.visible=id==='concert'||Math.abs(pos.x-CONCERT_X)<40;concertActif=id==='concert'}
  // pointage
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null;
  r.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,l:lacet};r.domElement.setPointerCapture(e.pointerId)});
  r.domElement.addEventListener('pointermove',e=>{if(down&&Math.abs(e.clientX-down.x)>6)lacet=Math.max(-.5,Math.min(.5,down.l+(e.clientX-down.x)*.002))});
  r.domElement.addEventListener('pointerup',e=>{
    if(!down)return;const d=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(d>8)return;
    const b=r.domElement.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);
    const hit=ray.intersectObjects(cibles,false)[0];if(hit){let p=hit.object;while(p&&!p.userData.inst)p=p.parent;if(p)o.onPick(p.userData.inst)}});
  // animation
  const act={};let T=0;
  function pulse(inst,piste){
    const m=objs[inst];if(m){m.userData.t=1;emettre(m.position.clone().setY(m.position.y+.6),2)}
    const z=ZONES.find(zz=>zz.inst.includes(inst));if(z)lights.forEach(l=>{if(ZONES[l.z]===z)l.t=1});
    if(piste!==undefined&&concertActif){ctrav.forEach(g=>{if(g.userData.piste===piste){g.userData.t=1;emettre(g.position.clone(),1)}})}
    barres.forEach((b,i)=>b.scale.y=.3+Math.random()*(i<10?1.6:i<14?1.2:.8))}
  function pulseGlobal(){lights.forEach(l=>l.t=1)}
  let last=performance.now(),raf=0;
  function boucle(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
    pos.lerp(cible,Math.min(1,dt*2.5));look.lerp(regard,Math.min(1,dt*2.5));lacetC+=(lacet-lacetC)*Math.min(1,dt*6);
    const dx=look.x-pos.x,dz=look.z-pos.z;const c=Math.cos(lacetC),s=Math.sin(lacetC);
    cam.position.copy(pos);cam.lookAt(new THREE.Vector3(pos.x+dx*c-dz*s,look.y,pos.z+dx*s+dz*c));
    if(Math.abs(pos.x-CONCERT_X)<40)concert.visible=true;else if(!concertActif)concert.visible=false;
    Object.keys(objs).forEach(k=>{const m=objs[k],t=m.userData.t||0;if(t>0){m.userData.t=Math.max(0,t-dt*3);const e=1+.14*t*t;m.scale.setScalar(m.userData.base*e);m.rotation.z=Math.sin(T*40)*.03*t}else{m.rotation.z=0}});
    ctrav.forEach(g=>{const t=g.userData.t||0;if(t>0)g.userData.t=Math.max(0,t-dt*3);g.position.y=.6+.12*Math.abs(Math.sin(T*(t>0?14:2)))*(t>0?1:.2)});
    musiciens.forEach((m,i)=>{m.position.y=Math.abs(Math.sin(T*(concertActif&&m.userData.public?6:2)+i))*.05;const b1=m.userData.b1,b2=m.userData['b-1'];if(b1)b1.rotation.x=-.6+Math.sin(T*3+i)*.4;if(b2)b2.rotation.x=-.6-Math.sin(T*3+i)*.4});
    lights.forEach(l=>{if(l.t>0)l.t=Math.max(0,l.t-dt*2);l.m.material.opacity=l.base+.28*l.t;l.m.rotation.z=Math.sin(T*.6+l.z)*.06});
    barres.forEach(b=>{b.scale.y+=(.4-b.scale.y)*Math.min(1,dt*5);b.position.y=1.7+b.scale.y*.5});
    for(let i=notes.length-1;i>=0;i--){const s=notes[i],u=s.userData;u.vie-=dt;s.position.y+=u.vy*dt;s.position.x+=u.vx*dt;s.material.opacity=Math.max(0,u.vie/1.3);if(u.vie<=0){sc.remove(s);s.material.dispose();notes.splice(i,1)}}
    r.render(sc,cam);raf=requestAnimationFrame(boucle)}
  zone('salle',true);raf=requestAnimationFrame(boucle);
  const rs=()=>{const w=el.clientWidth||W0,h=Math.max(100,el.clientHeight||H0);r.setSize(w,h,false);cam.aspect=w/h;cam.fov=Math.max(50,Math.min(98,2*Math.atan(Math.tan(.73)/cam.aspect)*180/Math.PI));cam.updateProjectionMatrix()};addEventListener('resize',rs);setTimeout(rs,60);rs();
  return {zone,pulse,pulseGlobal,concertInstaller,resize:rs,zoneCourante:()=>zoneId,
    setLow(v){r.setPixelRatio(v?1:Math.min(devicePixelRatio||1,1.5))},
    stop(){cancelAnimationFrame(raf);removeEventListener('resize',rs);try{r.forceContextLoss();r.dispose()}catch(e){}el.innerHTML=''},scene:sc,objs,camera:cam};
}
