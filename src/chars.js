import * as THREE from 'three';
import {waxTexture, noiseTexture} from './textures.js';
import {SKIN_TONES,HAIR_COLORS,EYE_COLORS,LIP_COLORS,OUTFIT_COLORS,OUTFITS} from './data.js';

// Personnage 3D articulé et personnalisable. Pieds à y = 0, le visage regarde +z.
const M=(color,r,m,o)=>new THREE.MeshStandardMaterial(Object.assign({color:color,roughness:r===undefined?.85:r,metalness:m||0},o||{}));
const caps=(r,len,m)=>{const g=new THREE.Mesh(new THREE.CapsuleGeometry(r,len,6,14),m);g.castShadow=true;return g};
const ball=(r,m,sx,sy,sz,seg)=>{const g=new THREE.Mesh(new THREE.SphereGeometry(r,seg||20,seg?Math.round(seg*.8):16),m);g.scale.set(sx||1,sy||1,sz||1);g.castShadow=true;return g};
const jnt=(x,y,z)=>{const g=new THREE.Group();g.position.set(x,y,z);return g};
const lerp=(a,b,t)=>a+(b-a)*t;
// cône effilé dont le sommet est à y = 0 et qui descend sur `len`
const taper=(rt,rb,len,m,seg)=>{const g=new THREE.CylinderGeometry(rt,rb,len,seg||14,3);g.translate(0,-len/2,0);const o=new THREE.Mesh(g,m);o.castShadow=true;return o};
// torse sculpté par révolution d'un profil (rayon, hauteur)
function torsoGeo(female){
  const pr=female?[[.16,0],[.195,.07],[.185,.15],[.135,.27],[.15,.38],[.172,.46],[.15,.54],[.09,.6],[.05,.64]]:[[.14,0],[.156,.07],[.15,.15],[.13,.27],[.15,.38],[.168,.47],[.16,.55],[.1,.61],[.055,.65]];
  const g=new THREE.LatheGeometry(pr.map(a=>new THREE.Vector2(a[0],a[1])),28);
  g.scale(female?1.2:1.24,1,female?.86:.76);
  if(female){const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),z=p.getZ(i);if(z>0&&y>.32&&y<.5){const k=Math.exp(-Math.pow((y-.41)/.06,2));p.setZ(i,z*(1+.17*k));p.setY(i,y+.004*k)}}}
  g.computeVertexNormals();return g;
}
// plis de tissu : normal map générée
let foldN=null;
function foldNormal(){
  if(foldN)return foldN;
  const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');
  g.fillStyle='rgb(128,128,255)';g.fillRect(0,0,128,128);
  for(let i=0;i<60;i++){const x=Math.random()*128,y=Math.random()*128,l=20+Math.random()*50,a=(Math.random()-.5)*.8;
    const gr=g.createLinearGradient(x,y,x+8,y);gr.addColorStop(0,'rgba(90,128,255,.7)');gr.addColorStop(.5,'rgba(160,128,255,.7)');gr.addColorStop(1,'rgba(128,128,255,0)');
    g.save();g.translate(x,y);g.rotate(Math.PI/2+a);g.fillStyle=gr;g.fillRect(0,0,l,6);g.restore()}
  foldN=new THREE.CanvasTexture(c);foldN.wrapS=foldN.wrapT=THREE.RepeatWrapping;foldN.repeat.set(3,3);return foldN;
}
// vrai tissu : un morceau de la photo du personnage devient la texture du vêtement
function fabricInto(mat,id,box){
  const img=new Image();
  img.onload=()=>{
    const c=document.createElement('canvas');c.width=c.height=128;
    const sx=box[0]*img.width,sy=box[1]*img.height,sw=(box[2]-box[0])*img.width,sh=(box[3]-box[1])*img.height;
    c.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,128,128);
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.MirroredRepeatWrapping;t.repeat.set(2,2);t.anisotropy=4;
    mat.map=t;mat.color.set(0xffffff);mat.needsUpdate=true;
  };
  img.src='img/chars/'+id+'.webp';
}

// Accepte l'ancien format (k, co, c...) et le nouveau (outfit, hair, hairC...).
// Visages réels : rectangle du visage dans chaque portrait (img/faces.json) + couleur de peau mesurée.
let FACES={};
export function setFaces(f){FACES=f||{}}
const tl=new THREE.TextureLoader(),ftex={};
function faceTexture(key,url){
  const k=url||key;if(ftex[k])return ftex[k];
  const t=tl.load(url||('img/'+key+'.jpg'));t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return ftex[k]=t;
}
const sstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};

export function normLook(l){
  const hair=l.hair||l.co||'courtes';
  const o={
    s:l.s||'f',h:l.h||1,
    skin:typeof l.skin==='number'?SKIN_TONES[l.skin]||SKIN_TONES[3]:(l.skin||SKIN_TONES[3]),
    faceW:l.faceW===undefined?.5:l.faceW,jaw:l.jaw===undefined?.4:l.jaw,
    eyeS:l.eyeS===undefined?.5:l.eyeS,eyeC:EYE_COLORS[l.eyeC||1]||EYE_COLORS[1],
    brow:l.brow||0,nose:l.nose===undefined?.5:l.nose,lips:l.lips===undefined?.5:l.lips,
    lipC:LIP_COLORS[l.lipC||0]||LIP_COLORS[0],blush:l.blush===undefined?.3:l.blush,
    hair:hair,
    hairHex:l.hairHex||(typeof l.hairC==='number'?HAIR_COLORS[l.hairC]:(hair==='gris'?'#d9d9d9':'#140d09')),
    beard:l.beard||0,acc:l.acc||[],
    outfit:l.outfit||(l.k==='pagne'?'pagne':l.k==='boubou'?'boubou':'uniforme'),
    c:l.cHex||(typeof l.outfitC==='number'?OUTFIT_COLORS[l.outfitC]:(l.c||'#1f7a4d')),c2:l.c2,
    cravate:!!l.cravate,
    faceKey:l.faceKey||null,faceUrl:l.faceUrl||null
  };
  if(l.s!=='f'&&o.hair==='tresses'&&false)o.hair='courtes';
  return o;
}

// Tête : sphère déformée (menton, mâchoire, largeur du visage).
function headGeo(L,thetaStart,thetaLen,grow,face){
  const g=new THREE.SphereGeometry(1,40,32,0,Math.PI*2,thetaStart||0,thetaLen||Math.PI);
  const p=g.attributes.position;
  const W=.092+.022*L.faceW, Hh=.122, D=.108;
  const taper=lerp(.46,.14,L.jaw);
  const uvA=g.attributes.uv,mask=face?new Float32Array(p.count):null;
  for(let i=0;i<p.count;i++){
    let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    if(face){ // projection plane de la photo sur l'avant de la tête
      const R=face.rect,cx=R.x+R.w/2,cy=R.y+R.h*face.cy;
      const u=cx+x*R.w*.5*face.kx,vi=cy-(y-face.y0)*R.h*.5*face.ky;
      uvA.setXY(i,u,1-vi);
      const ell=Math.hypot(x/.98,(y-face.y0)/1.05);
      mask[i]=sstep(.12,.5,z)*(1-sstep(.62,.95,ell));
    }
    if(y<-.05){
      const t=Math.min(1,(-y-.05)/.95);
      const f=1-taper*Math.pow(t,1.35);
      x*=f;z*=1-taper*.55*Math.pow(t,1.35);
      if(z>0)z*=1-.10*t;
    }
    // front légèrement bombé, joues pleines
    if(z>0&&y>-.45&&y<.2)x*=1+.03*L.faceW;
    p.setXYZ(i,x*W*(grow||1),y*Hh*(grow||1),z*D*(grow||1));
  }
  if(face)g.setAttribute('faceMask',new THREE.BufferAttribute(mask,1));
  g.computeVertexNormals();
  return g;
}

export function makeHuman(look){
  const L=normLook(look);
  const out=OUTFITS[L.outfit]||OUTFITS.uniforme;
  const female=L.s==='f';
  const fk=null,fi=null;   // plus de photo plaquée : visages modélisés en 3D
  const face=fi?{rect:fi,cy:.5,kx:1.12,ky:1.08,y0:-.2}:null;
  if(face&&fi.skin)L.skin=fi.skin;
  const sk=new THREE.Color(L.skin);
  const skinM=new THREE.MeshPhysicalMaterial({color:sk,roughness:.55,emissive:sk.clone().multiplyScalar(.16),sheen:.6,sheenRoughness:.5,sheenColor:sk.clone().multiplyScalar(1.5)});
  const skinDark=M(sk.clone().multiplyScalar(.7),.6);
  const hairM=M(L.hairHex,.5,.08);
  const cloth=M(L.c,.85,0,{normalMap:foldNormal(),normalScale:new THREE.Vector2(.5,.5)});
  if(look.fabric)fabricInto(cloth,look.fabric.id,look.fabric.top);
  const shoe=M('#1c1410',.7);
  const wax=out.top==='wax'?M('#ffffff',.85,0,{map:waxTexture(L.c,L.c2||'#e0a526')}):null;
  const topM=wax||cloth;
  let bottom=out.bottom;if(bottom==='auto')bottom=female?'skirt':'trousers';
  const trouserColor=out.matchTrouser?new THREE.Color(L.c).multiplyScalar(.6):new THREE.Color(out.trouser||'#262a3a');
  const trouserM=M(trouserColor,.9,0,{normalMap:foldNormal(),normalScale:new THREE.Vector2(.55,.55)});
  if(look.fabric&&look.fabric.bottom)fabricInto(trouserM,look.fabric.id,look.fabric.bottom);
  const longD=bottom==='long',skirt=bottom==='skirt',trousers=bottom==='trousers';

  const root=new THREE.Group();
  const body=new THREE.Group();body.scale.set(female?1.16:1.08,.92,female?1.16:1.08);root.add(body);

  const hips=jnt(0,.95,0);body.add(hips);
  const pelvis=ball(.16,trousers?trouserM:(longD?topM:(skirt?topM:trouserM)),female?1.6:1.22,female?.74:.62,female?1.08:.86);pelvis.position.y=.02;hips.add(pelvis);
  const spine=jnt(0,.06,0);hips.add(spine);
  const torso=new THREE.Mesh(torsoGeo(female),topM);torso.castShadow=true;spine.add(torso);
  if(out.collar){const col=new THREE.Mesh(new THREE.TorusGeometry(.072,.016,8,20),M('#f2f2f2',.8));col.rotation.x=Math.PI/2;col.position.set(0,.605,.005);col.scale.set(1.25,1,.9);spine.add(col)}
  if(out.belt){const bl=new THREE.Mesh(new THREE.TorusGeometry(.17,.012,8,24),M('#e0a526',.4,.7));bl.rotation.x=Math.PI/2;bl.position.set(0,.06,0);bl.scale.set(1.1,.8,1);spine.add(bl)}
  if(L.cravate){const t=new THREE.Mesh(new THREE.BoxGeometry(.05,.3,.015),M('#a8301e',.7));t.position.set(0,.36,.125);spine.add(t)}
  if(out.trim){const tr=new THREE.Mesh(new THREE.TorusGeometry(.085,.012,8,20),M('#e0a526',.4,.7));tr.rotation.x=Math.PI/2;tr.position.set(0,.55,.03);tr.scale.set(1.4,1,1.1);spine.add(tr)}

  // cou et tête
  const neckJ=jnt(0,.6,0);spine.add(neckJ);
  const neck=caps(.045,.06,skinM);neck.position.y=.04;neckJ.add(neck);
  const headJ=jnt(0,.1,0);headJ.scale.setScalar(1.4);neckJ.add(headJ);
  let headM=skinM;
  if(face){
    headM=new THREE.MeshStandardMaterial({color:sk,map:faceTexture(L.faceKey,L.faceUrl),roughness:.62,emissive:sk.clone().multiplyScalar(.05)});
    headM.onBeforeCompile=sh=>{
      sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float faceMask;\nvarying float vFM;').replace('#include <begin_vertex>','#include <begin_vertex>\nvFM=faceMask;');
      sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying float vFM;').replace('#include <map_fragment>','vec4 txc=texture2D(map,vMapUv);diffuseColor.rgb=mix(diffuseColor.rgb,txc.rgb,vFM);');
    };
  }
  const head=new THREE.Mesh(headGeo(L,0,Math.PI,1,face),headM);head.position.y=.12;head.castShadow=true;headJ.add(head);
  const W=.092+.022*L.faceW;
  // oreilles
  [-1,1].forEach(s=>{const e=ball(.026,skinM,.5,1,.8);e.position.set(s*(W+.004),.125,-.005);headJ.add(e)});
  const facial0=headJ.children.length;
  // joues (fard léger)
  if(L.blush>.05){[-1,1].forEach(s=>{const c=ball(.03,M('#d4607a',.9,0,{transparent:true,opacity:.3*L.blush*2}),1,.8,.3);c.position.set(s*.05,.095,.088);headJ.add(c)})}
  // yeux
  const eyeR=.0175*(.85+L.eyeS*.5)*1.6;
  const eyeWhite=M('#f7f3ec',.35),iris=M(L.eyeC,.25),pupil=M('#050302',.2),glint=new THREE.MeshBasicMaterial({color:0xffffff});
  const eyes=[];
  [-1,1].forEach(s=>{
    const ex=s*.040,ey=.146;
    const w=ball(eyeR,eyeWhite,1.25,.9,.65);w.position.set(ex,ey,.087);headJ.add(w);
    const ir=ball(eyeR*.72,iris,1,1,.5);ir.position.set(ex,ey,.087+eyeR*.5);headJ.add(ir);
    const pu=ball(eyeR*.32,pupil,1,1,.4);pu.position.set(ex,ey,.087+eyeR*.62);headJ.add(pu);
    const gl=ball(eyeR*.24,glint,1,1,1,8);gl.position.set(ex+s*.0035,ey+.004,.087+eyeR*.8);headJ.add(gl);
    eyes.push(w,ir,pu);
    // paupières
    const lid=new THREE.Mesh(new THREE.SphereGeometry(eyeR*1.28,16,8,0,Math.PI*2,0,Math.PI*.3),skinDark);
    lid.scale.set(1.2,.9,.8);lid.position.set(ex,ey+.001,.088);lid.rotation.x=-.15;headJ.add(lid);
    if(female){const lash=new THREE.Mesh(new THREE.BoxGeometry(eyeR*2.5,.003,.006),hairM);lash.position.set(ex,ey+eyeR*1.0,.097);lash.rotation.z=-s*.1;headJ.add(lash)}
    // sourcils
    const bw=.03,bh=L.brow===1?.008:.0034;
    const br=new THREE.Mesh(new THREE.BoxGeometry(bw,bh,.008),hairM);
    br.position.set(ex,.192+(L.brow===2?.004:0),.092);br.rotation.z=s*(L.brow===2?.12:.1);headJ.add(br);
    if(L.brow===2){const b2=br.clone();b2.position.x=ex+s*.014;b2.position.y=.172;b2.rotation.z=s*.12;headJ.add(b2)}
  });
  // nez
  const nz=(.8+L.nose*.7)*.55;
  const nb=new THREE.Mesh(new THREE.BoxGeometry(.016*nz,.04,.012),skinM);nb.position.set(0,.128,.1);headJ.add(nb);
  const tip=ball(.0165*nz,skinM,1,.9,1);tip.position.set(0,.103,.107);headJ.add(tip);
  [-1,1].forEach(s=>{const wg=ball(.011*nz,skinM,1,.9,.9);wg.position.set(s*.015*nz,.1,.1);headJ.add(wg);
    const ns=ball(.004,M('#1a0f0a',.5),1,1,1,8);ns.position.set(s*.008*nz,.094,.113);headJ.add(ns)});
  // lèvres
  const lw=.02+.008*L.lips,lt=.0035+.003*L.lips;
  const lipM=M(L.lipC,.3);
  const up=ball(1,lipM,lw,lt,.009,14);up.position.set(0,.0745,.1);headJ.add(up);
  const lo=ball(1,lipM,lw*.92,lt*1.35,.01,14);lo.position.set(0,.0635,.099);headJ.add(lo);
  const mouth=new THREE.Group();mouth.position.set(0,.069,.099);headJ.add(mouth); // pour l'animation de parole
  const mline=new THREE.Mesh(new THREE.TorusGeometry(lw*1.25,.0032,6,16,Math.PI),M('#8a2f33',.5));mline.rotation.z=Math.PI;mline.position.y=.016;mline.scale.set(1,.7,1);mouth.add(mline);

  if(face){const rm=headJ.children.slice(facial0);rm.forEach(c=>headJ.remove(c))}
  // barbe
  if(L.beard>0&&!female){
    const bg=headGeo(L,Math.PI*.54,Math.PI*.46,1.035);
    const bm=M(L.hairHex,.9,0,L.beard===1?{transparent:true,opacity:.42}:{});
    const beard=new THREE.Mesh(bg,bm);beard.position.y=.12;headJ.add(beard);
    if(L.beard===2){const mu=ball(1,hairM,.026,.007,.01);mu.position.set(0,.087,.104);headJ.add(mu)}
  }

  // coiffures
  const hs=L.hair;
  const strand=(()=>{
    const c=document.createElement('canvas');c.width=64;c.height=128;const g=c.getContext('2d');g.fillStyle='rgb(128,128,255)';g.fillRect(0,0,64,128);
    for(let i=0;i<90;i++){const x=Math.random()*64;const gr=g.createLinearGradient(x-2,0,x+2,0);gr.addColorStop(0,'rgba(80,128,255,.8)');gr.addColorStop(.5,'rgba(180,128,255,.8)');gr.addColorStop(1,'rgba(80,128,255,.0)');g.fillStyle=gr;g.fillRect(x-2,0,4,128)}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,1);return t})();
  hairM.normalMap=strand;hairM.normalScale=new THREE.Vector2(.8,.8);hairM.roughness=.4;
  const scalp=(scale,tilt)=>{
    const sx=(.098+.02*L.faceW)*scale,sy=.128*scale,sz=.113*scale;
    const tg=new THREE.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI*.40);
    const tp=tg.attributes.position;
    for(let i=0;i<tp.count;i++){const x=tp.getX(i),y=tp.getY(i),z=tp.getZ(i);
      if(z>.15&&y<.82){const k=sstep(.15,.9,z)*(.82-y)/.4;tp.setY(i,y+.2*k*(1-.5*Math.abs(x)))}}   // ligne de cheveux arrondie sur le front
    tg.computeVertexNormals();
    const top=new THREE.Mesh(tg,hairM);
    top.scale.set(sx,sy,sz);top.position.y=.125;top.rotation.x=tilt===undefined?-.08:tilt;top.castShadow=true;headJ.add(top);
    const back=new THREE.Mesh(new THREE.SphereGeometry(1,32,18,Math.PI*.1,Math.PI*.8,0,Math.PI*.66),hairM);
    back.scale.set(sx*1.01,sy*1.01,sz*1.01);back.position.y=.125;back.rotation.y=Math.PI;back.castShadow=true;headJ.add(back);
    return top;
  };
  if(hs==='courtes'||hs==='gris'){scalp(1.12)}
  else if(hs==='rase'){scalp(1.0)}
  else if(hs==='tresses'){
    scalp(1.07);
    for(let i=0;i<11;i++){const a=-1.35+i*.27;const t=caps(.013,.22,hairM);t.position.set(Math.sin(a)*(W+.014),.03,-.015-Math.cos(a)*.035);t.rotation.z=Math.sin(a)*.22;headJ.add(t)}
  }else if(hs==='nattes'){
    scalp(1.07);
    [-1,1].forEach(s=>{for(let i=0;i<4;i++){const b=ball(.026,hairM,1,1.35,1);b.position.set(s*(W+.012),.1-i*.05,-.01+(i%2)*.006);headJ.add(b)}});
  }else if(hs==='afro'){
    const af=new THREE.Mesh(new THREE.IcosahedronGeometry(.16,4),hairM);
    const p=af.geometry.attributes.position;for(let i=0;i<p.count;i++){const n=1+(Math.sin(p.getX(i)*90)+Math.cos(p.getY(i)*80)*Math.sin(p.getZ(i)*70))*.035;p.setXYZ(i,p.getX(i)*n,p.getY(i)*n,p.getZ(i)*n)}
    af.geometry.computeVertexNormals();af.scale.set(1.0,.96,.95);af.position.set(0,.225,-.05);af.castShadow=true;headJ.add(af);
  }else if(hs==='chignon'){
    scalp(1.06);const bun=ball(.055,hairM,1,.95,1);bun.position.set(0,.255,-.045);headJ.add(bun);
  }else if(hs==='noeuds'){
    scalp(1.04);
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2,r=i<9?.075:.04;const b=ball(.026,hairM,1,1,1,10);b.position.set(Math.sin(a)*r,.225+(i<9?0:.03),Math.cos(a)*r*.9-.02);headJ.add(b)}
  }else if(hs==='locks'){
    scalp(1.08);
    for(let i=0;i<20;i++){const a=-2.5+i*.26;if(Math.abs(a)<.9)continue;const t=caps(.011,.32,hairM);t.position.set(Math.sin(a)*(W+.018),.0,-.02-Math.cos(a)*.05);t.rotation.z=Math.sin(a)*.12;headJ.add(t)}
    for(let i=0;i<5;i++){const t=caps(.011,.28,hairM);t.position.set((i-2)*.03,.0,-.1);headJ.add(t)}
  }
  if(hs==='gris'){ // foulard et chignon de Mama Lola
    const bun=ball(.05,hairM,1,.9,1);bun.position.set(0,.24,-.06);headJ.add(bun);
    const wrap=new THREE.Mesh(new THREE.TorusGeometry(.105,.03,10,24),M('#1f7a4d',.8));wrap.rotation.x=Math.PI/2;wrap.position.y=.2;wrap.scale.set(1,1.05,1);headJ.add(wrap);
  }
  // accessoires
  const acc=L.acc||[];
  if(acc.indexOf('boucles')>=0||(female&&look.s==='f'&&look.h&&!look.acc)){[-1,1].forEach(s=>{const r=ball(.009,M('#e0a526',.3,.8),1,1,1,8);r.position.set(s*(W+.008),.075,.0);headJ.add(r);const d=ball(.007,M('#e0a526',.3,.8),1,1.6,1,8);d.position.set(s*(W+.008),.055,.0);headJ.add(d)})}
  if(acc.indexOf('lunettes')>=0){
    const gm=M('#1a1a22',.3,.5);
    [-1,1].forEach(s=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.027,.0035,8,20),gm);t.position.set(s*.04,.146,.1);headJ.add(t)});
    const br=new THREE.Mesh(new THREE.BoxGeometry(.02,.003,.003),gm);br.position.set(0,.148,.103);headJ.add(br);
    [-1,1].forEach(s=>{const a=new THREE.Mesh(new THREE.BoxGeometry(.003,.003,.1),gm);a.position.set(s*.068,.148,.05);headJ.add(a)});
  }
  if(acc.indexOf('casquette')>=0){
    const cm=M('#c0392b',.7);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(.12,22,12,0,Math.PI*2,0,Math.PI*.5),cm);dome.position.set(0,.21,0);dome.scale.set(1,.95,1.05);dome.castShadow=true;headJ.add(dome);
    const vis=new THREE.Mesh(new THREE.CylinderGeometry(.1,.1,.008,18,1,false,-Math.PI/2,Math.PI),cm);vis.position.set(0,.215,.1);vis.scale.set(1,1,.9);vis.rotation.x=0;headJ.add(vis);
  }
  if(acc.indexOf('foulard')>=0){
    const fm=M('#e0a526',.8);
    const wrap=new THREE.Mesh(new THREE.TorusGeometry(.108,.032,10,24),fm);wrap.rotation.x=Math.PI/2;wrap.position.y=.215;wrap.scale.set(1,1.05,1);headJ.add(wrap);
    const kn=ball(.04,fm,1.3,.7,.7);kn.position.set(0,.26,-.07);headJ.add(kn);
  }
  if(acc.indexOf('collier')>=0){
    const pm=M('#f4efe6',.3,.2);
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const b=ball(.011,pm,1,1,1,8);b.position.set(Math.sin(a)*.095,.585,Math.cos(a)*.075+.03);spine.add(b)}
  }
  if(acc.indexOf('sac')>=0){
    const sm=M('#2e86de',.7);
    const bag=new THREE.Mesh(new THREE.BoxGeometry(.28,.34,.12),sm);bag.position.set(0,.3,-.17);bag.castShadow=true;spine.add(bag);
    const pk=new THREE.Mesh(new THREE.BoxGeometry(.2,.14,.03),M('#1f5fa8',.7));pk.position.set(0,.22,-.24);spine.add(pk);
    [-1,1].forEach(s=>{const st=new THREE.Mesh(new THREE.BoxGeometry(.03,.3,.02),M('#1f5fa8',.7));st.position.set(s*.09,.38,.1);spine.add(st)});
  }

  // bras : épaule ronde, bras et avant-bras effilés, main avec pouce
  const arms=[];
  [-1,1].forEach(side=>{
    const sh=jnt(side*(female?.215:.24),.5,0);spine.add(sh);
    const longSleeve=longD||out.sleeves==='long';
    const sb=ball(.058,topM,1,1,1,14);sh.add(sb);
    const up=taper(female?.058:.052,female?.046:.042,.29,skinM);sh.add(up);
    const sl=taper(.058,longSleeve?.047:.05,longSleeve?.29:.15,topM);sh.add(sl);
    const el=jnt(0,-.29,0);sh.add(el);
    const eb=ball(.043,longSleeve?topM:skinM,1,1,1,12);el.add(eb);
    const fa=taper(.042,.031,.26,longSleeve?topM:skinM);el.add(fa);
    const hand=new THREE.Group();hand.position.y=-.27;el.add(hand);
    const palm=ball(1,skinM,.046,.06,.03,12);palm.position.y=-.05;hand.add(palm);
    const fing=ball(1,skinM,.04,.042,.024,10);fing.position.y=-.1;hand.add(fing);
    const th=ball(1,skinM,.015,.035,.015,8);th.position.set(side*-.03,-.045,.012);th.rotation.z=side*.5;hand.add(th);
    sh.rotation.z=side*.07;
    arms.push({sh,el});
  });

  // jambes : cuisse, genou, mollet, cheville, chaussure
  const legs=[];
  [-1,1].forEach(side=>{
    const hj=jnt(side*(female?.105:.09),0,0);hips.add(hj);
    const lm=trousers?trouserM:skinM,add=trousers?.012:0;
    const fw=female?1.22:1;const th=taper((.088+add)*fw,(.062+add)*fw,.43,lm);hj.add(th);
    const kn=jnt(0,-.43,0);hj.add(kn);
    const kb=ball(.063+add,lm,1,1,1,12);kn.add(kb);
    const sh=taper(.058+add,.036+add,.41,lm);kn.add(sh);
    const calf=ball(1,lm,(.056+add)*(female?1.15:1),.12,(.062+add)*(female?1.15:1),12);calf.position.set(0,-.12,-.012);kn.add(calf);
    const foot=new THREE.Group();foot.position.y=-.43;kn.add(foot);
    const toe=ball(1,shoe,.05,.036,.115,12);toe.position.set(0,-.012,.05);foot.add(toe);
    const heel=ball(1,shoe,.043,.04,.05,10);heel.position.set(0,0,-.03);foot.add(heel);
    legs.push({hj,kn});
  });

  // jupe / robe / boubou
  let fixedFeet=null;
  if(skirt){
    const tex=wax?waxTexture(L.c,L.c2||'#e0a526'):null;
    const sm=tex?new THREE.MeshStandardMaterial({map:tex,roughness:.85,side:THREE.DoubleSide,normalMap:foldNormal(),normalScale:new THREE.Vector2(.5,.5)}):M(L.c,.85,0,{side:THREE.DoubleSide,normalMap:foldNormal(),normalScale:new THREE.Vector2(.5,.5)});
    if(look.fabric&&!tex)fabricInto(sm,look.fabric.id,look.fabric.skirt||look.fabric.top);
    const sk2=new THREE.Mesh(new THREE.CylinderGeometry(female?.23:.19,out.belt?.36:.32,out.belt?.7:.62,24,1,true),sm);
    sk2.position.y=out.belt?-.37:-.34;sk2.castShadow=true;hips.add(sk2);
  }
  if(longD){
    const m=new THREE.MeshStandardMaterial({map:noiseTexture(L.c,.16),roughness:.8,side:THREE.DoubleSide,normalMap:foldNormal(),normalScale:new THREE.Vector2(.6,.6)});
    if(look.fabric)fabricInto(m,look.fabric.id,look.fabric.skirt||look.fabric.top);
    const robe=new THREE.Mesh(new THREE.CylinderGeometry(female?.235:.2,.39,.98,28,1,true),m);robe.position.y=-.45;robe.castShadow=true;hips.add(robe);
    if(out.trim){const hem=new THREE.Mesh(new THREE.TorusGeometry(.37,.012,6,28),M('#e0a526',.4,.7));hem.rotation.x=Math.PI/2;hem.position.y=-.93;hips.add(hem)}
    legs.forEach(l=>{l.kn.visible=false});
    fixedFeet=[-1,1].map(s=>{const t=new THREE.Mesh(new THREE.BoxGeometry(.09,.06,.2),shoe);t.position.set(s*.09,-.94,.06);hips.add(t);return t});
  }

  const state={t:Math.random()*10};
  function update(dt,o){
    state.t+=dt;o=o||{};
    const sp=o.speed||0,t=state.t;
    const walk=Math.min(1,sp/2.2),run=sp>3.2;
    const ph=t*(run?11:7.5);
    const sit=!!o.sit;
    if(sit){
      body.position.y=-.46;
      legs.forEach(l=>{l.hj.rotation.x=-Math.PI/2+.05;l.kn.rotation.x=Math.PI/2-.05});
      if(fixedFeet)fixedFeet.forEach(f=>{f.visible=false});
    }else{
      body.position.y=Math.abs(Math.sin(ph))*.035*walk*(run?1.6:1);
      const amp=(run?.95:.6)*walk;
      legs[0].hj.rotation.x=Math.sin(ph)*amp;legs[1].hj.rotation.x=-Math.sin(ph)*amp;
      legs[0].kn.rotation.x=Math.max(0,-Math.sin(ph))*amp*1.3+.04;legs[1].kn.rotation.x=Math.max(0,Math.sin(ph))*amp*1.3+.04;
      if(fixedFeet)fixedFeet.forEach(f=>{f.visible=true});
    }
    torso.scale.y=1+Math.sin(t*1.8)*.012;
    spine.rotation.y=Math.sin(ph)*.12*walk;spine.rotation.x=.05*walk+(run?.12:0);hips.rotation.y=-Math.sin(ph)*.08*walk;
    const lA=arms[0],rA=arms[1],swing=(run?.9:.55)*walk;
    lA.sh.rotation.x=sit?-.5:Math.sin(ph)*swing;rA.sh.rotation.x=sit?-.5:-Math.sin(ph)*swing;
    lA.el.rotation.x=-.12-(sit?.6:0)-Math.max(0,Math.sin(ph))*.5*walk;
    rA.el.rotation.x=-.12-(sit?.6:0)-Math.max(0,-Math.sin(ph))*.5*walk;
    lA.sh.rotation.z=-.08;rA.sh.rotation.z=.08;
    if(!sp&&!sit){lA.sh.rotation.x=Math.sin(t*1.3)*.03;rA.sh.rotation.x=-Math.sin(t*1.3)*.03}
    if(o.talk){
      rA.sh.rotation.x=-.9+Math.sin(t*5)*.25;rA.sh.rotation.z=.35;rA.el.rotation.x=-1.0+Math.sin(t*6.2)*.35;
      headJ.rotation.x=Math.sin(t*4)*.05;headJ.rotation.y=Math.sin(t*1.7)*.12;
      mouth.scale.y=1+Math.abs(Math.sin(t*12))*3;lo.position.y=.0635-Math.abs(Math.sin(t*12))*.006;
    }else{
      headJ.rotation.x=0;headJ.rotation.y=sp?0:Math.sin(t*.7)*.18;mouth.scale.y=1;lo.position.y=.0635;
    }
    if(o.wave){rA.sh.rotation.x=0;rA.sh.rotation.z=2.5+Math.sin(t*9)*.18;rA.el.rotation.x=-.5+Math.sin(t*9)*.4}
    if(o.pose==='creator'){headJ.rotation.y=Math.sin(t*.5)*.15;rA.sh.rotation.x=0;lA.sh.rotation.x=0}
    const bl=(Math.sin(t*.9)>.985)?.1:1;
    eyes.forEach(e=>{e.scale.y=(e.userData.sy||(e.userData.sy=e.scale.y))*bl});
  }

  root.scale.setScalar(L.h||1);
  Object.assign(root.userData,{update,state,height:1.78*(L.h||1),headY:1.78});
  return root;
}
