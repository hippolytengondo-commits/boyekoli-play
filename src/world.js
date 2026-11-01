import * as THREE from 'three';
import * as T from './textures.js';
import {leafyTree,palm,grassField,bush} from './nature.js';

export const std=(c,r,o)=>{const m=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r===undefined?.85:r},o||{}));if(!(o&&o.map))m.color.offsetHSL(0,.07,.015);return m};   // couleurs un peu plus vives (style dessin animé)
export function box(g,w,h,d,m,x,y,z,ry){
  const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  b.position.set(x,y,z);if(ry)b.rotation.y=ry;b.castShadow=true;b.receiveShadow=true;g.add(b);return b;
}
export function cyl(g,rt,rb,h,m,x,y,z,seg){
  const c=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||12),m);
  c.position.set(x,y,z);c.castShadow=true;c.receiveShadow=true;g.add(c);return c;
}
export function rng(seed){let s=seed>>>0||1;return()=>((s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296))}

// Toit à deux pans : deux dalles inclinées + pignons.
export function gableRoof(g,cx,cy,cz,w,d,rise,mat,gableMat,overhang){
  const oh=overhang||.5;
  const half=d/2+oh, len=w+oh*2;
  const slope=Math.atan2(rise,d/2);
  const sl=Math.hypot(rise,d/2)+oh*.6;
  [-1,1].forEach(s=>{
    const p=box(g,len,.12,sl,mat,cx,cy+rise/2,cz+s*(d/4),0);
    p.rotation.x=-s*slope;
  });
  const sh=new THREE.Shape();sh.moveTo(-d/2,0);sh.lineTo(d/2,0);sh.lineTo(0,rise);sh.closePath();
  const gm=new THREE.Mesh(new THREE.ShapeGeometry(sh),gableMat);
  [-1,1].forEach(s=>{const m=gm.clone();m.position.set(cx+s*w/2,cy,cz);m.rotation.y=s*Math.PI/2;g.add(m)});
}

function sky(scene){
  const m=new THREE.Mesh(new THREE.SphereGeometry(420,24,16),new THREE.MeshBasicMaterial({map:T.skyTexture(),side:THREE.BackSide,fog:false,depthWrite:false}));
  m.name='sky';scene.add(m);return m;
}
function clouds(g){
  const out=[];const r=rng(4);
  const cm=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,emissive:0xffffff,emissiveIntensity:.35,transparent:true,opacity:.92,fog:false});
  for(let i=0;i<14;i++){
    const c=new THREE.Group();
    for(let j=0;j<5;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(5+r()*5,10,8),cm);s.position.set((j-2)*7+r()*3,r()*3,r()*5);s.scale.y=.55;c.add(s)}
    c.position.set(-150+r()*320,55+r()*25,-120+r()*240);g.add(c);out.push(c);
  }
  return out;
}

export function tree(g,x,z,s,mango,cols,colliders,pal){
  const t=pal?palm(Math.floor(Math.abs(x*7+z*3))+2):leafyTree({kind:mango?'mango':'leafy',seed:Math.floor(Math.abs(x*13+z*7))+3,fruits:!!mango,trunk:3.0+((s*7)%1)*1.4});
  t.position.set(x,0,z);t.scale.setScalar(pal?1:s);t.userData.vegetal=true;g.add(t);
  if(colliders)colliders.push({x:x,z:z,r:(pal?.35:.6)*(pal?1:s)});
  return t;
}

// ------------------------------------------------------------------ VILLE
export function buildVille(opts){
  const g=new THREE.Group();const colliders=[],boxes=[],dyn={};
  // sol
  const gt=T.grassTexture();
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(1400,1400),new THREE.MeshStandardMaterial({map:gt,roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.position.set(12,0,0);ground.receiveShadow=true;g.add(ground);
  const dt=T.dirtTexture();
  const dirtM=new THREE.MeshStandardMaterial({map:dt,roughness:1,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
  const patch=(x,z,w,d,ry)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),dirtM);p.rotation.x=-Math.PI/2;p.rotation.z=ry||0;p.position.set(x,.02,z);p.receiveShadow=true;g.add(p)};
  patch(-4,1,64,3.2,0);patch(3,-2,11,9,0);patch(-20,-4,5,6,0);patch(34,0,14,3.2,0);patch(41,-3.5,4,6.5,0);

  // maison du joueur
  const hx=-22,hz=-9,mf=(opts&&opts.maison)||{};
  const tinM=new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35});
  const wallM=mf.murs?new THREE.MeshStandardMaterial({map:T.brickTexture([198,108,62]),roughness:.9}):new THREE.MeshStandardMaterial({map:T.earthWallTexture(),roughness:1});
  const roofM=mf.toit?tinM:new THREE.MeshStandardMaterial({map:T.thatchTexture(),roughness:1});
  const gabM=std(mf.toit?'#cfc6b2':'#b99a55');
  const ey=mf.etage?2.6:0;
  const glass=()=>std('#e8f3fa',.2,{emissive:0x4da6d9,emissiveIntensity:.35});
  box(g,8,2.7,5.4,wallM,hx,1.35,hz);
  if(mf.etage){
    box(g,8,2.6,5.4,mf.murs?wallM:std('#d9c7a0',.9),hx,2.7+1.3,hz);
    box(g,8.4,.2,5.8,std('#cfc6b2'),hx,2.7,hz);
    [-2.7,0,2.7].forEach(dx=>{box(g,1.1,1.0,.1,glass(),hx+dx,3.9,hz+2.72);box(g,1.25,.1,.14,std('#4a2f1b'),hx+dx,3.35,hz+2.74)});
  }
  gableRoof(g,hx,2.7+ey,hz,8,5.4,1.8,roofM,gabM,.7);
  box(g,1.3,2.1,.12,std('#4a2f1b',.8),hx,1.05,hz+2.72);
  box(g,1.5,.1,.3,std('#6e5a45'),hx,.05,hz+2.9);
  [-2.7,2.7].forEach(dx=>{
    box(g,1.2,1.0,.1,glass(),hx+dx,1.6,hz+2.72);
    box(g,1.35,.12,.14,std('#4a2f1b'),hx+dx,1.08,hz+2.74);box(g,1.35,.12,.14,std('#4a2f1b'),hx+dx,2.12,hz+2.74);
  });
  boxes.push({x0:hx-4,x1:hx+4,z0:hz-2.7,z1:hz+2.7});
  // chambre en plus (côté est) et cuisine (côté ouest)
  if(mf.chambre){
    box(g,4.4,2.5,4.6,wallM,hx+6.2,1.25,hz);gableRoof(g,hx+6.2,2.5,hz,4.4,4.6,1.2,roofM,gabM,.5);
    box(g,1.0,.9,.1,glass(),hx+6.2,1.5,hz+2.32);box(g,1.1,.1,.14,std('#4a2f1b'),hx+6.2,1.0,hz+2.34);
    boxes.push({x0:hx+4,x1:hx+8.4,z0:hz-2.3,z1:hz+2.3});
  }
  if(mf.cuisine){
    box(g,4.4,2.5,4.6,wallM,hx-6.2,1.25,hz);gableRoof(g,hx-6.2,2.5,hz,4.4,4.6,1.2,roofM,gabM,.5);
    box(g,1.0,.9,.1,glass(),hx-6.2,1.5,hz+2.32);
    cyl(g,.22,.26,1.6,std('#5a5a5a',.5,{metalness:.4}),hx-7.4,3.3,hz-1,8);
    boxes.push({x0:hx-8.4,x1:hx-4,z0:hz-2.3,z1:hz+2.3});
  }
  if(mf.solaire){
    const pm=std('#1d3a63',.25,{metalness:.5});const sl=Math.atan2(1.8,2.7);
    [-2.4,-.8,.8,2.4].forEach(dx=>{const p=box(g,1.4,.06,1.2,pm,hx+dx,2.7+ey+.98,hz+1.3);p.rotation.x=-sl});
  }
  if(mf.jardin){
    const fm=['#e84a5f','#f9c74f','#ffffff','#ff8c42','#c77dff'];
    [-4.2,-3.2,-1.9,1.9,3.2,4.2].forEach((dx,i)=>{
      cyl(g,.45,.5,.25,std('#6b4226'),hx+dx,.12,hz+4.0,10);
      for(let k=0;k<6;k++){const a=k/6*6.28,f=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),std(fm[(i+k)%fm.length],.6));f.position.set(hx+dx+Math.cos(a)*.22,.38+(k%2)*.12,hz+4.0+Math.sin(a)*.22);g.add(f)}
      const lf=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),std('#2e8b57',.8));lf.scale.y=.5;lf.position.set(hx+dx,.3,hz+4.0);g.add(lf);
    });
  }
  // petit abri, bancs, jarres
  box(g,2.2,.12,.8,std('#7a4a26'),-26,.5,-4.2);box(g,.12,.5,.7,std('#6b4226'),-26.9,.25,-4.2);box(g,.12,.5,.7,std('#6b4226'),-25.1,.25,-4.2);
  colliders.push({x:-26,z:-4.2,r:1.1});

  // manguier
  const mg=tree(g,-9,4,1.55,true,['#2f7d44','#3f9a53','#276b3a'],colliders);
  dyn.mangoTree={x:-9,z:4,obj:mg};

  // (l'ancien étal de Maman Béa a laissé la place au grand centre commercial, voir reperes.js)

  // panneau publicitaire
  const bx=14,bz=-7;
  [-1.7,1.7].forEach(dx=>cyl(g,.07,.07,4,std('#6b6b6b',.5,{metalness:.4}),bx+dx,2,bz,8));
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.9),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'LEXARIS ACADÉMIE',s:46,y:.42},{t:'Formation en IA · juristes et jeunes',s:22,y:.72,b:false,c:'#f1c40f'}],512,230,'#1f7a4d','#ffffff'),roughness:.6}));
  bd.position.set(bx,3.1,bz+.05);bd.castShadow=true;g.add(bd);
  colliders.push({x:bx-1.7,z:bz,r:.3},{x:bx+1.7,z:bz,r:.3});

  // panneau des directions, à côté du rond-point : chaque flèche indique où se trouve un lieu important
  {
    const mkBoard=(txt,coul,dir)=>{
      const c=document.createElement('canvas');c.width=560;c.height=120;const g2=c.getContext('2d');
      g2.fillStyle=coul;g2.beginPath();
      if(dir==='D'){g2.moveTo(4,8);g2.lineTo(480,8);g2.lineTo(556,60);g2.lineTo(480,112);g2.lineTo(4,112)}
      else if(dir==='G'){g2.moveTo(556,8);g2.lineTo(80,8);g2.lineTo(4,60);g2.lineTo(80,112);g2.lineTo(556,112)}
      else{g2.moveTo(4,8);g2.lineTo(556,8);g2.lineTo(556,80);g2.lineTo(280,116);g2.lineTo(4,80)}
      g2.closePath();g2.fill();g2.lineWidth=5;g2.strokeStyle='#ffffff';g2.stroke();
      let f=44;g2.font='bold '+f+'px system-ui';while(g2.measureText(txt).width>(dir==='B'?500:400)&&f>20){f-=2;g2.font='bold '+f+'px system-ui'}
      g2.fillStyle='#ffffff';g2.textAlign=dir==='G'?'right':'left';g2.textBaseline='middle';g2.fillText(txt,dir==='G'?520:dir==='B'?30:34,dir==='B'?48:62);
      if(dir==='D'){g2.textAlign='right';g2.font='bold 56px system-ui';g2.fillText('→',536,60)}
      if(dir==='G'){g2.textAlign='left';g2.font='bold 56px system-ui';g2.fillText('←',24,60)}
      if(dir==='B'){g2.textAlign='right';g2.font='bold 52px system-ui';g2.fillText('↓',540,50)}
      const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t};
    const BD=[['✈ AÉROPORT','#1f5f9e','D'],['🎵 STUDIO MUSIQUE','#7d3fd1','D'],['🏫 ÉCOLE','#2e7d32','D'],['🛒 CENTRE COMMERCIAL','#c0392b','D'],['📐 AMÉNAGEMENT DES ROUTES','#4a4a52','D'],['🚂 GARE','#8e5a2b','G'],['🧭 MISSIONS D’EXPLORATION','#2e9e4a','B'],['🏘 NOUVELLE CITÉ À RACHETER','#e67e22','B']];
    cyl(g,.09,.11,6,std('#4a3320',.9),-9,3,-3.9,8);
    BD.forEach((b,i)=>{
      const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.4,.73),new THREE.MeshStandardMaterial({map:mkBoard(b[0],b[1],b[2]),transparent:true,alphaTest:.3,roughness:.6}));
      pl.position.set(-9+(b[2]==='D'?1.2:b[2]==='G'?-1.2:0),5.5-i*.68,-3.78);pl.castShadow=true;g.add(pl)});
    const dl=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),std('#e0a526',.4,{metalness:.5}));dl.position.set(-9,6.15,-3.9);g.add(dl);
    colliders.push({x:-9,z:-3.9,r:.4});
  }
  // banc
  box(g,2,.1,.5,std('#7a4a26'),9,.5,-5.2);box(g,.1,.5,.45,std('#4a2f1b'),8.1,.25,-5.2);box(g,.1,.5,.45,std('#4a2f1b'),9.9,.25,-5.2);
  colliders.push({x:9,z:-5.2,r:1.0});

  // clôture de l'école + portail
  const fenceM=std('#8a5a32',.9);
  const GX=27;
  const post=(x,z)=>cyl(g,.09,.09,1.7,fenceM,x,.85,z,6);
  [[-15,-2.4],[2.4,15]].forEach(rg=>{
    for(let z=rg[0];z<=rg[1];z+=1.6)post(GX,z);
    const len=rg[1]-rg[0];
    box(g,.07,.08,len,fenceM,GX,1.35,(rg[0]+rg[1])/2);box(g,.07,.08,len,fenceM,GX,.7,(rg[0]+rg[1])/2);
    boxes.push({x0:GX-.3,x1:GX+.3,z0:rg[0],z1:rg[1]});
  });
  // pilier du portail
  [-2.2,2.2].forEach(z=>{const p=box(g,.5,2.2,.5,new THREE.MeshStandardMaterial({map:T.brickTexture([196,106,60]),roughness:.9}),GX,1.1,z);colliders.push({x:GX,z:z,r:.4})});
  // battants du portail
  const leaves=[];
  [-1,1].forEach(s=>{
    const piv=new THREE.Group();piv.position.set(GX,0,s*2.0);
    const lf=new THREE.Group();lf.position.set(0,0,-s*1.0);
    box(lf,.08,1.5,2.0,std('#5a3a22'),0,.95,0);
    for(let i=-4;i<=4;i+=2)box(lf,.1,1.5,.08,std('#7a4a26'),0,.95,i*.22);
    piv.add(lf);g.add(piv);leaves.push({piv,s});
  });
  dyn.leaves=leaves;
  // barrière invisible tant que le portail est fermé
  dyn.gateBox={x0:GX-.4,x1:GX+.4,z0:-2.4,z1:2.4};
  // bornes du monde
  // école
  const sbx=42,sbz=-11;
  const brick=new THREE.MeshStandardMaterial({map:T.brickTexture([198,108,62]),roughness:.9});
  box(g,26,3.8,9,brick,sbx,1.9,sbz);
  gableRoof(g,sbx,3.8,sbz,26,9,2.2,new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35}),std('#e9dfca'),.9);
  box(g,26,.3,.4,std('#efe6d2'),sbx,.15,sbz+4.6);
  // véranda
  for(let i=0;i<10;i++)cyl(g,.14,.14,3.2,std('#f3ecd9'),sbx-11.5+i*2.55,1.6,sbz+5.4,10);
  box(g,26.5,.25,1.4,std('#cfc6b2'),sbx,3.25,sbz+5.2);
  box(g,26.5,.12,1.6,new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35}),sbx,3.45,sbz+5.2);
  box(g,26.5,.2,1.6,std('#d9d0bc'),sbx,.1,sbz+5.2);
  // fenêtres
  [-9,-5.4,5.4,9].forEach(dx=>{
    box(g,1.7,1.3,.1,std('#cfe9f7',.15,{emissive:0x5ba7d6,emissiveIntensity:.3}),sbx+dx,2.05,sbz+4.55);
    box(g,1.9,.12,.15,std('#f2f2f2'),sbx+dx,1.37,sbz+4.58);
  });
  // porte (double battant, s'ouvre)
  const dg=new THREE.Group();dg.position.set(sbx,0,sbz+4.55);g.add(dg);
  box(dg,3.2,2.9,.2,std('#2b1d12'),0,1.45,-.05);
  const lv=[];
  [-1,1].forEach(s=>{const piv=new THREE.Group();piv.position.set(s*1.5,0,.05);const lf=box(piv,1.5,2.7,.1,std('#6b3f20'),-s*.75,1.35,0);box(piv,1.2,.08,.12,std('#4a2f1b'),-s*.75,2.1,.02);dg.add(piv);lv.push({piv,s})});
  dyn.doorLeaves=lv;
  // enseigne
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(8,1.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'LEXARIS ACADÉMIE',s:78}],1024,140,'#1f7a4d','#ffffff'),roughness:.6}));
  sg.position.set(sbx,3.15,sbz+4.58);g.add(sg);
  boxes.push({x0:sbx-13,x1:sbx+13,z0:sbz-4.5,z1:sbz+4.6});
  // drapeau
  const fx=33,fz=-3;
  cyl(g,.05,.07,7,std('#999',.4,{metalness:.5}),fx,3.5,fz,8);
  const flag=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.05,10,1),new THREE.MeshStandardMaterial({map:flagTexture(),side:THREE.DoubleSide,roughness:.8}));
  flag.position.set(fx+.85,6.2,fz);flag.castShadow=true;g.add(flag);dyn.flag=flag;
  colliders.push({x:fx,z:fz,r:.3});

  // arbres et buissons
  const spots=[[-30,-3],[-28,9],[-18,8],[-14,-12],[-6,-10],[-4,10],[6,10],[12,9],[18,-11],[22,-9],[-32,-12],[20,11],[24,5],[34,9],[48,6],[52,-2],[31,-13],[55,10],[-24,13],[0,-13]];
  spots.forEach((p,i)=>tree(g,p[0],p[1],.9+(i%4)*.18,false,null,colliders,i%3===1));
  const r0=rng(31);
  for(let i=0;i<30;i++){
    const x=-33+r0()*90,z=-14+r0()*28;
    if(Math.abs(z)<2.3&&x<27)continue;
    const b=bush(i+3,.7+r0()*.7);b.position.set(x,0,z);b.rotation.y=r0()*6;b.userData.vegetal=true;g.add(b);
  }
  // herbe animée par le vent
  const grass=grassField({area:[-34,58,-15,15],count:34000,seed:5,exclude:(x,z)=>{
    if(Math.abs(z)<2.0&&x<27)return true;
    if(x>-27-(mf.cuisine?4.4:0)&&x<-17+(mf.chambre?4.4:0)&&z>-11.7&&z<-6.3)return true;            // maison
    if(x>26&&x<44&&z>-8&&z<5)return true;                     // cour de l'école
    if(x>-5.5&&x<11.5&&z>-16&&z<-6.5)return true;           // centre commercial
    if(x>0&&x<8&&z>-5.5&&z<1.5)return true;
    return false;
  }});
  grass.userData.vegetal=true;g.add(grass);
  // fleurs (instances)
  const r=rng(31);const m4=new THREE.Matrix4(),col=new THREE.Color();
  const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(.08,6,5),std('#ffffff',.6),160);
  for(let i=0;i<160;i++){const x=-33+r()*60,z=-14+r()*28;if(Math.abs(z)<2.2)continue;m4.compose(new THREE.Vector3(x,.28,z),new THREE.Quaternion(),new THREE.Vector3(1,1,1));fl.setMatrixAt(i,m4);col.set(['#ffd23f','#ff6b9a','#ffffff','#ff8a3d'][i%4]);fl.setColorAt(i,col)}
  fl.userData.vegetal=true;g.add(fl);

  const cl=[];
  const bounds={x0:-33.5,x1:58,z0:-14.5,z1:14.5};
  function update(dt,t,state){
    cl.forEach((c,i)=>{c.position.x+=dt*(.6+i%3*.2);if(c.position.x>190)c.position.x=-190});
    grass.userData.update(t);
    // drapeau
    const p=dyn.flag.geometry.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i)+.8;p.setZ(i,Math.sin(t*4+x*3)*.07*x)}
    p.needsUpdate=true;
    // portail et porte
    const o=state.open?1:0;
    dyn.leaves.forEach(l=>{const tgt=o*l.s*1.45;l.piv.rotation.y+=(-tgt-l.piv.rotation.y)*Math.min(1,dt*4)});
    dyn.doorLeaves.forEach(l=>{const tgt=o*l.s*1.6;l.piv.rotation.y+=(tgt-l.piv.rotation.y)*Math.min(1,dt*4)});
  }
  return {group:g,colliders,boxes,dyn,bounds,update,mangoTree:dyn.mangoTree};
}

export function flagTexture(){
  const c=document.createElement('canvas');c.width=256;c.height=170;const x=c.getContext('2d');
  x.fillStyle='#007fff';x.fillRect(0,0,256,170);
  x.strokeStyle='#f7d618';x.lineWidth=40;x.beginPath();x.moveTo(-10,190);x.lineTo(270,-20);x.stroke();
  x.strokeStyle='#ce1021';x.lineWidth=24;x.beginPath();x.moveTo(-10,190);x.lineTo(270,-20);x.stroke();
  x.fillStyle='#f7d618';x.beginPath();
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?9:22;x.lineTo(40+Math.cos(a)*r,40+Math.sin(a)*r)}x.fill();
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}

// ------------------------------------------------------------------ INTÉRIEURS
export function room(g,w,d,h,wallMat,floorMat,openFront){
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(w,d),floorMat);fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;g.add(fl);
  const back=new THREE.Mesh(new THREE.PlaneGeometry(w,h),wallMat);back.position.set(0,h/2,-d/2);back.receiveShadow=true;g.add(back);
  const left=new THREE.Mesh(new THREE.PlaneGeometry(d,h),wallMat);left.rotation.y=Math.PI/2;left.position.set(-w/2,h/2,0);left.receiveShadow=true;g.add(left);
  const right=new THREE.Mesh(new THREE.PlaneGeometry(d,h),wallMat);right.rotation.y=-Math.PI/2;right.position.set(w/2,h/2,0);right.receiveShadow=true;g.add(right);
  box(g,w,.12,.1,std('#e7dcc5'),0,.06,-d/2+.05);
  // l'avant est ouvert : un paillasson marque la sortie
  box(g,2.2,.04,1.1,std('#7a4a26',1),0,.02,d/2-.7);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.75,32),new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.55}));
  ring.rotation.x=-Math.PI/2;ring.position.set(0,.05,d/2-.7);g.add(ring);
}
function chairDesk(g,x,z,tall){
  const th=tall||.7;
  const wd=new THREE.MeshStandardMaterial({map:T.woodTexture('#b07a45'),roughness:.8});
  box(g,1.1,.06,.55,wd,x,th,z-.7);
  [[-.5,-.2],[.5,-.2],[-.5,.2],[.5,.2]].forEach(p=>box(g,.05,th,.05,std('#4a2f1b'),x+p[0],th/2,z-.7+p[1]));
  box(g,.42,.05,.4,wd,x,.4,z);
  [[-.17,-.15],[.17,-.15],[-.17,.15],[.17,.15]].forEach(p=>box(g,.04,.4,.04,std('#4a2f1b'),x+p[0],.2,z+p[1]));
  box(g,.42,.4,.05,wd,x,.62,z+.2);
}

export function buildClasse(){
  const g=new THREE.Group();const colliders=[],boxes=[];
  const W=17,D=10,Hh=3.8;
  room(g,W,D,Hh,new THREE.MeshStandardMaterial({map:T.plasterTexture('#f1e7cf'),roughness:1}),new THREE.MeshStandardMaterial({map:T.woodTexture('#a8744a'),roughness:.85}));
  g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='PlaneGeometry'&&c.rotation.x===-Math.PI/2){c.material.map.repeat.set(5,3)}});
  // tableau
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(7.5,2.3),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'LEXARIS ACADÉMIE',s:60,y:.38,c:'#ffffff'},{t:'Kelas Game · Apprendre en jouant',s:28,y:.7,b:false,c:'#f1c40f'}],768,230,'#2e3b33','#fff','#8d5a3b'),roughness:.9}));
  bd.position.set(0,2.2,-D/2+.04);g.add(bd);
  box(g,7.8,.12,.14,std('#8d5a3b'),0,.98,-D/2+.06);
  // drapeau mural et carte
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1),new THREE.MeshStandardMaterial({map:flagTexture(),roughness:.9}));fl.position.set(5.8,2.4,-D/2+.04);g.add(fl);
  // fenêtres lumineuses (mur droit)
  [-2.6,2.2].forEach(z=>{
    const w=new THREE.Mesh(new THREE.PlaneGeometry(2,1.5),new THREE.MeshBasicMaterial({color:0xcfeaff}));w.rotation.y=-Math.PI/2;w.position.set(W/2-.03,2.1,z);g.add(w);
    box(g,.08,1.6,.08,std('#fff'),W/2-.05,2.1,z);
  });
  // affiches photo sur le mur gauche
  [['kinshasa',-2.8],['fleuve',0],['marche',2.8]].forEach(a=>{
    const t=T.photoTexture(a[0]);if(!t)return;
    box(g,.08,1.5,2.5,std('#5a3a22',.7),-W/2+.06,2.3,a[1]);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.3,1.3),new THREE.MeshStandardMaterial({map:t,roughness:.6}));
    pl.rotation.y=Math.PI/2;pl.position.set(-W/2+.11,2.3,a[1]);g.add(pl);
  });
  // pupitres
  [[-5.5,1.2],[-2.8,1.2],[5.7,1.0],[-5.5,3.4],[-2.8,3.4],[0,3.4],[2.6,3.4],[5.7,3.4],[0,1.2]].forEach(p=>chairDesk(g,p[0],p[1]));
  chairDesk(g,2.6,.55,.62);
  // bureau de la maîtresse
  box(g,2,.08,.9,new THREE.MeshStandardMaterial({map:T.woodTexture('#8a5a32')}),-6.2,.95,-3.6);
  [[-1,-.35],[1,-.35],[-1,.35],[1,.35]].forEach(p=>box(g,.07,.95,.07,std('#4a2f1b'),-6.2+p[0]*.9,.47,-3.6+p[1]));
  colliders.push({x:-6.2,z:-3.6,r:1.2});
  boxes.push({x0:-3.5,x1:-2.1,z0:.2,z1:1.4});
  // collisions des pupitres
  [[-5.5,.5],[-2.8,.5],[5.7,.3],[-5.5,2.7],[-2.8,2.7],[0,2.7],[2.6,2.7],[5.7,2.7],[0,.5],[2.6,-.15]].forEach(p=>boxes.push({x0:p[0]-.6,x1:p[0]+.6,z0:p[1]-.3,z1:p[1]+.3}));
  const bounds={x0:-W/2+.5,x1:W/2-.5,z0:-D/2+.6,z1:D/2-.2};
  return {group:g,colliders,boxes,bounds,update(){},exit:{x:0,z:D/2-.9}};
}

export function buildMaison(items,mf){
  mf=mf||{};
  const g=new THREE.Group();const colliders=[],boxes=[];
  const W=9.5,D=6.8,Hh=3.2;
  room(g,W,D,Hh,mf.murs?new THREE.MeshStandardMaterial({map:T.plasterTexture('#efe3c8'),roughness:.95}):new THREE.MeshStandardMaterial({map:T.earthWallTexture(),roughness:1}),new THREE.MeshStandardMaterial({map:T.woodTexture('#8d6238'),roughness:.9}));
  // lit
  const bx=-3.2,bz=-2.2;
  box(g,2.2,.35,1.3,new THREE.MeshStandardMaterial({map:T.woodTexture('#7a4a26')}),bx,.3,bz);
  box(g,2.1,.2,1.2,std('#f5efe3',.95),bx,.55,bz);
  box(g,.6,.12,.9,std('#ffffff',.9),bx-.7,.7,bz);
  box(g,1.4,.08,1.25,new THREE.MeshStandardMaterial({map:T.waxTexture('#c0392b','#f1c40f'),roughness:.9}),bx+.3,.66,bz);
  boxes.push({x0:bx-1.2,x1:bx+1.2,z0:bz-.75,z1:bz+.75});
  // miroir sur pied
  box(g,1.0,1.8,.08,std('#5a3a22',.7),-1.6,.95,-D/2+.12);
  const mr=new THREE.Mesh(new THREE.PlaneGeometry(.82,1.62),new THREE.MeshStandardMaterial({color:0xcfe6f2,roughness:.05,metalness:.85,emissive:0x6f9fb8,emissiveIntensity:.25}));mr.position.set(-1.6,.95,-D/2+.17);g.add(mr);
  // fenêtre
  const wn=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.3),new THREE.MeshBasicMaterial({color:0xcfeaff}));wn.position.set(2.4,1.9,-D/2+.03);g.add(wn);
  box(g,1.7,.1,.1,std('#5a3a22'),2.4,2.6,-D/2+.06);
  if(items.rideau){[-.75,.75].forEach(dx=>box(g,.55,1.7,.06,new THREE.MeshStandardMaterial({map:T.waxTexture('#c0392b','#f1c40f'),roughness:.9}),2.4+dx*1.1,1.8,-D/2+.12))}
  if(items.tableau){
    const fr=box(g,1.4,1.05,.07,std('#5a3a22'),-.4,2.1,-D/2+.06);
    const p=new THREE.Mesh(new THREE.PlaneGeometry(1.25,.9),new THREE.MeshStandardMaterial({map:T.paintingTexture()}));p.position.set(-.4,2.1,-D/2+.11);g.add(p);
  }
  if(items.natte){
    const m=box(g,2.6,.03,1.7,new THREE.MeshStandardMaterial({map:T.thatchTexture(),roughness:1}),.2,.02,.9);
    box(g,2.7,.02,1.8,std('#7a4a26'),.2,.012,.9);
  }
  if(items.table){
    const wd=new THREE.MeshStandardMaterial({map:T.woodTexture('#a87445'),roughness:.8});
    box(g,1.5,.08,.9,wd,3.1,.85,-2.5);
    [[-.65,-.35],[.65,-.35],[-.65,.35],[.65,.35]].forEach(p=>box(g,.08,.85,.08,std('#4a2f1b'),3.1+p[0],.42,-2.5+p[1]));
    boxes.push({x0:2.3,x1:3.9,z0:-2.95,z1:-2.05});
    if(items.lampe){
      cyl(g,.05,.07,.25,std('#6b4226'),3.1,1.02,-2.5,8);
      const sh=new THREE.Mesh(new THREE.SphereGeometry(.17,14,10),std('#ffe9a8',.4,{emissive:0xffc75a,emissiveIntensity:1.2}));sh.position.set(3.1,1.28,-2.5);g.add(sh);
      const pl=new THREE.PointLight(0xffc064,9,7,1.6);pl.position.set(3.1,1.35,-2.4);g.add(pl);
    }
  }
  if(items.plante){
    cyl(g,.2,.15,.38,std('#a8301e'),4.0,.19,-2.7,12);
    for(let i=0;i<9;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),std(i%2?'#2e8b57':'#3a9a63',.8));l.scale.set(.6,1.6,.6);const a=i/9*6.28;l.position.set(4+Math.cos(a)*.15,.7+(i%3)*.15,-2.7+Math.sin(a)*.15);l.rotation.z=Math.cos(a)*.5;l.rotation.x=Math.sin(a)*.5;l.castShadow=true;g.add(l)}
    colliders.push({x:4,z:-2.7,r:.3});
  }
  // table à plans : ouvre le chantier de la maison
  const dk=new THREE.MeshStandardMaterial({map:T.woodTexture('#a87445'),roughness:.8});
  box(g,1.2,.07,.75,dk,-1.0,.82,-.6);[[-.5,-.3],[.5,-.3],[-.5,.3],[.5,.3]].forEach(p=>box(g,.07,.82,.07,std('#4a2f1b'),-1.0+p[0],.41,-.6+p[1]));
  box(g,.95,.02,.55,std('#bcd9f2',.6,{emissive:0x4da6d9,emissiveIntensity:.25}),-1.0,.875,-.6);
  box(g,.4,.12,.12,std('#d9534f'),-.8,.93,-.5);
  boxes.push({x0:-1.6,x1:-.4,z0:-.97,z1:-.23});
  // portes des pièces construites
  const dm=std('#4a2f1b',.8);
  if(mf.chambre){box(g,.12,2.1,1.1,dm,W/2-.06,1.05,1.2)}
  if(mf.cuisine){box(g,.12,2.1,1.1,dm,-W/2+.06,1.05,1.2)}
  if(mf.etage){
    for(let k=0;k<6;k++)box(g,.9,.18,.32,std('#a87445'),W/2-.6,.18+k*.34,-1.9+k*.28);
    colliders.push({x:W/2-.7,z:-1.9,r:.4});
  }
  if(mf.solaire){const lp=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),std('#fff6cf',.4,{emissive:0xfff0b0,emissiveIntensity:1.4}));lp.position.set(0,Hh-.3,.5);g.add(lp);const pl=new THREE.PointLight(0xfff0c0,10,12,1.5);pl.position.set(0,Hh-.4,.5);g.add(pl)}
  const bounds={x0:-W/2+.5,x1:W/2-.5,z0:-D/2+.6,z1:D/2-.2};
  return {group:g,colliders,boxes,bounds,update(){},exit:{x:0,z:D/2-.9}};
}
