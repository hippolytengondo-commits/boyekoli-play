// Moteur 3D des scènes d'enquête : pièces, murs bas, objets, personnages, déplacement au joystick, caméra suiveuse,
// recherche d'objets cachés, photographie. Three.js autonome (rendu dédié dans un overlay).
import * as THREE from 'three';
import {makeHuman} from '../chars.js';

const mat=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.8:r});
export function creerMoteur(el,opt){
  const o=Object.assign({low:false,onProche:()=>{}},opt||{});
  const W0=Math.max(240,el.clientWidth),H0=Math.max(240,el.clientHeight);
  const r=new THREE.WebGLRenderer({antialias:false,preserveDrawingBuffer:true});r.setPixelRatio(o.low?1:Math.min(devicePixelRatio||1,1.6));r.setSize(W0,H0);el.appendChild(r.domElement);
  r.domElement.style.cssText='width:100%;height:100%;display:block;touch-action:none';
  r.shadowMap.enabled=!o.low;r.shadowMap.type=THREE.PCFSoftShadowMap;
  const sc=new THREE.Scene();sc.background=new THREE.Color('#1c2433');
  const cam=new THREE.PerspectiveCamera(48,W0/H0,.1,120);
  sc.add(new THREE.HemisphereLight('#fff4e0','#6a6a80',1.6));
  const sun=new THREE.DirectionalLight('#fff0d0',1.3);sun.position.set(6,14,8);sun.castShadow=!o.low;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:16,bottom:-16,far:50});sc.add(sun);
  let snap=true,monde=null,def=null,bloc=[],objs={},pnjs={},sorties=[],cherches=[];
  const joueur={x:0,z:0,ry:0,v:0,obj:null};
  const joy={x:0,y:0},keys={};
  let T=0;
  function vider(){if(monde)sc.remove(monde);monde=new THREE.Group();sc.add(monde);bloc=[];objs={};pnjs={};sorties=[];cherches=[]}
  const box=(w,h,d,c,x,y,z,par)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.castShadow=!o.low;m.receiveShadow=true;(par||monde).add(m);return m};
  function etiquette(txt,col){const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.65)';g.fillRect(0,8,256,48);g.fillStyle=col||'#fff';g.font='bold 24px system-ui';g.textAlign='center';g.fillText(txt.length>24?txt.slice(0,23)+'…':txt,128,42);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.scale.set(3,.75,1);s.renderOrder=6;return s}
  function etincelle(){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,2,32,32,30);gr.addColorStop(0,'#fff');gr.addColorStop(.3,'#ffe066');gr.addColorStop(1,'rgba(255,200,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false}));s.scale.set(.9,.9,1);s.renderOrder=7;return s}
  function charger(d){
    def=d;vider();
    // sols
    d.sols.forEach(s=>{const f=new THREE.Mesh(new THREE.PlaneGeometry(s.x1-s.x0,s.z1-s.z0),mat(s.coul,.9));f.rotation.x=-Math.PI/2;f.position.set((s.x0+s.x1)/2,.01,(s.z0+s.z1)/2);f.receiveShadow=true;monde.add(f)});
    // murs bas avec portes
    d.murs.forEach(m=>{
      const hor=Math.abs(m.z1-m.z0)<.01,len=hor?Math.abs(m.x1-m.x0):Math.abs(m.z1-m.z0),a=hor?Math.min(m.x0,m.x1):Math.min(m.z0,m.z1);
      const segs=[];let cur=a;(m.portes||[]).slice().sort((p,q)=>p[0]-q[0]).forEach(([c,l])=>{if(c-l/2>cur)segs.push([cur,c-l/2]);cur=c+l/2});if(cur<a+len)segs.push([cur,a+len]);
      segs.forEach(([s0,s1])=>{const L=s1-s0;if(L<.05)return;const cx=(s0+s1)/2;
        const bx=hor?cx:m.x0,bz=hor?m.z0:cx,w=hor?L:.3,dd=hor?.3:L;box(w,1.4,dd,'#e8e2d4',bx,.7,bz);box(w+.04,.12,dd+.04,'#5a4a3a',bx,1.46,bz);
        bloc.push({x0:bx-w/2,x1:bx+w/2,z0:bz-dd/2,z1:bz+dd/2})});
    });
    // objets
    d.objets.forEach(ob=>{
      const g=new THREE.Group();g.position.set(ob.x,0,ob.z);monde.add(g);g.userData.id=ob.id;
      if(ob.parts){ob.parts.forEach(q=>{let m;if(q.t==='cyl')m=new THREE.Mesh(new THREE.CylinderGeometry(q.r,q.r2===undefined?q.r:q.r2,q.h,q.seg||14),new THREE.MeshStandardMaterial({color:q.c,roughness:q.rough===undefined?.6:q.rough,transparent:!!q.op,opacity:q.op||1}));else if(q.t==='sph')m=new THREE.Mesh(new THREE.SphereGeometry(q.r,14,10),new THREE.MeshStandardMaterial({color:q.c,roughness:.5,transparent:!!q.op,opacity:q.op||1}));else m=new THREE.Mesh(new THREE.BoxGeometry(q.w,q.h,q.d),new THREE.MeshStandardMaterial({color:q.c,roughness:.7,transparent:!!q.op,opacity:q.op||1}));m.position.set(q.x||0,q.y||0,q.z||0);m.castShadow=!o.low;g.add(m)})}
      else if(ob.plaque){box(ob.w,ob.h,ob.d,ob.c,0,ob.h/2+.2,0,g)}
      else if(ob.id==='masque'){const m=box(.55,.7,.2,'#b5602a',0,.9,0,g);box(.15,.15,.08,'#222',-.12,.95,.12,g);box(.15,.15,.08,'#222',.12,.95,.12,g);box(.2,.08,.1,'#f1c40f',0,.7,.12,g);box(.3,.3,.3,'#7a4a26',0,.35,0,g)}
      else if(ob.id==='voiture'){box(ob.w,.5,ob.d,ob.c,0,.45,0,g);box(ob.w*.55,.45,ob.d*.9,ob.c,-ob.w*.05,.95,0,g);box(ob.w*.5,.3,ob.d*.92,'#9fd3f5',-ob.w*.05,.98,0,g);[-1,1].forEach(s=>[-1,1].forEach(t=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.2,12),mat('#222'));w.rotation.x=Math.PI/2;w.position.set(s*ob.w*.32,.28,t*ob.d*.5);g.add(w)}));box(.2,.12,.5,'#ff3b3b',0,1.25,0,g)}
      else if(ob.id==='vitrine'){box(ob.w,.5,ob.d,'#5a4a3a',0,.25,0,g);const v=new THREE.Mesh(new THREE.BoxGeometry(ob.w*.95,ob.h-.5,ob.d*.95),new THREE.MeshStandardMaterial({color:0x9fc5e8,transparent:true,opacity:.35,roughness:.1}));v.position.set(0,.5+(ob.h-.5)/2,0);g.add(v)}
      else if(ob.id==='arbre_c'){box(.3,1.4,.3,'#6b4423',0,.7,0,g);const f=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,8),mat('#2f7d3a'));f.position.y=2.1;g.add(f)}
      else if(ob.id==='ordinateur'){box(.9,.07,.5,'#333',0,.95,0,g);box(.6,.45,.05,'#111',0,1.25,-.12,g);box(.55,.4,.01,'#37d67a',0,1.25,-.09,g)}
      else if(ob.id==='microscope'){box(.35,.08,.35,'#222',0,1,0,g);box(.08,.5,.08,'#555',0,1.28,-.08,g);box(.1,.3,.1,'#999',0,1.5,.02,g)}
      else if(ob.id==='ticket'||ob.id==='gants'||ob.id==='crayon'||ob.id==='registre'||ob.id==='carnet_r'||ob.id==='liste'||ob.id==='registre_p'||ob.id==='clef_m'||ob.id==='tiroir'||ob.id==='empreinte_v'||ob.id==='poudre'||ob.id==='roues'||ob.id==='boue'||ob.id==='flaque'||ob.id==='pinceaux'||ob.id==='fournitures'||ob.id==='cones'){
        if(ob.id==='fournitures'){box(1.1,.7,.8,'#c9a06a',0,.35,0,g);box(.9,.1,.6,'#e8e8e8',0,.78,0,g);for(let i=0;i<4;i++)box(.1,.5,.1,['#d6302b','#2e9e4a','#e0b020','#2c7fb8'][i],-.3+i*.2,1.05,0,g)}
        else if(ob.h<.1){box(ob.w,.03,ob.d,ob.c,0,.04,0,g)}
        else box(ob.w,ob.h>.3?.12:ob.h,ob.d,ob.c,0,Math.max(.05,ob.h)+.0,0,g)}
      else box(ob.w,ob.h,ob.d,ob.c,0,ob.h/2,0,g);
      if(ob.cache){g.visible=false;cherches.push(ob.id)}
      objs[ob.id]={def:ob,g,etat:{revele:!ob.cache,ramasse:false,ouvert:false},bloq:null};
      if(ob.bloque&&!ob.plaque){const rc={x0:ob.x-ob.w/2,x1:ob.x+ob.w/2,z0:ob.z-ob.d/2,z1:ob.z+ob.d/2};bloc.push(rc);objs[ob.id].bloq=rc}
      if(ob.ferme){const rc={x0:ob.x-ob.w/2-.3,x1:ob.x+ob.w/2+.3,z0:ob.z-ob.d/2-.3,z1:ob.z+ob.d/2+.3};bloc.push(rc);objs[ob.id].verrou=rc;g.userData.ferme=true;box(ob.w,1.1,ob.d,ob.c,0,.55,0,g)}
    });
    // personnages
    (d.pnj||[]).forEach(p=>{
      const h=makeHuman(Object.assign({h:1},p.look));h.position.set(p.x,0,p.z);h.rotation.y=p.ry||0;h.scale.multiplyScalar(.95);monde.add(h);
      const lab=etiquette(p.nom,'#ffe082');lab.position.set(p.x,2.5,p.z);monde.add(lab);
      pnjs[p.id]={def:p,g:h,lab,talk:0,base:p.ry||0};bloc.push({x0:p.x-.35,x1:p.x+.35,z0:p.z-.35,z1:p.z+.35})});
    sorties=(d.sorties||[]).map(s=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(s.r*.7,s.r*.7,.06,20),new THREE.MeshBasicMaterial({color:0x37d67a,transparent:true,opacity:.35}));m.position.set(s.x,.05,s.z);monde.add(m);return s});
    // joueur
    if(joueur.obj)sc.remove(joueur.obj);
    joueur.obj=makeHuman(Object.assign({h:1},o.look||{s:'f',skin:3,hair:'courtes',outfit:'polo',c:'#7a5a3a'}));joueur.obj.scale.multiplyScalar(.95);sc.add(joueur.obj);
    {const [fx,fz]=libre(d.start.x,d.start.z);joueur.x=fx;joueur.z=fz}joueur.ry=0;snap=true;
    // chapeau et loupe du détective
    const chap=box(.46,.05,.46,'#3a2a1a',0,1.78,0,joueur.obj);box(.28,.14,.28,'#3a2a1a',0,1.86,0,joueur.obj);
  }
  // si un point (départ, téléportation) tombe dans un obstacle, on le déplace vers l'endroit libre le plus proche
  function libre(x,z){if(!collision(x,z))return [x,z];for(let r=.25;r<=5;r+=.25){for(let k=0;k<16;k++){const a=k/16*Math.PI*2,X=x+Math.cos(a)*r,Z=z+Math.sin(a)*r;if(!collision(X,Z))return [X,Z]}}return [x,z]}
  function collision(x,z){const R=.33;for(const b of bloc){if(x>b.x0-R&&x<b.x1+R&&z>b.z0-R&&z<b.z1+R)return true}return false}
  function majPnj(dt){Object.values(pnjs).forEach(p=>{p.g.userData.update(dt,{speed:0,talk:p.talk>0,cam:cam.position});if(p.talk>0)p.talk-=dt;else p.g.rotation.y+=((p.base)-p.g.rotation.y)*Math.min(1,dt*2)})}
  // plus proche élément interactif
  const dist=(x,z,a,b)=>Math.hypot(x-a,z-b);
  function calcProche(){
    let best=null,bd=2.6;
    Object.values(pnjs).forEach(p=>{const d=dist(joueur.x,joueur.z,p.def.x,p.def.z);if(d<bd){bd=d;best={kind:'pnj',id:p.def.id,def:p.def,d}}});
    Object.values(objs).forEach(ob=>{const e=ob.def;if(!ob.etat.revele||ob.etat.ramasse)return;if(!(e.indice||e.panneau||e.ferme||e.cible||e.ex))return;const d=dist(joueur.x,joueur.z,e.x,e.z)-Math.max(e.w,e.d)*.3;if(d<bd){bd=d;best={kind:'obj',id:e.id,def:e,d}}});
    sorties.forEach(s=>{const d=dist(joueur.x,joueur.z,s.x,s.z);if(d<s.r+.8&&d<bd){bd=d;best={kind:'sortie',id:s.id,def:s,d}}});
    return best}
  let pr=null,derniere='';
  function scanner(rad){const rev=[];cherches.slice().forEach(id=>{const ob=objs[id];if(!ob||ob.etat.revele)return;if(dist(joueur.x,joueur.z,ob.def.x,ob.def.z)<(rad||3.4)){ob.etat.revele=true;ob.g.visible=true;const e=etincelle();e.position.set(0,1,0);ob.g.add(e);setTimeout(()=>{ob.g.remove(e)},2500);rev.push(id)}});return rev}
  function retirer(id){const ob=objs[id];if(!ob)return;ob.etat.ramasse=true;ob.g.visible=false;if(ob.bloq){const i=bloc.indexOf(ob.bloq);if(i>=0)bloc.splice(i,1)}}
  function deverrouiller(id){const ob=objs[id];if(!ob||!ob.verrou)return;const i=bloc.indexOf(ob.verrou);if(i>=0)bloc.splice(i,1);ob.etat.ouvert=true;ob.g.visible=false}
  function parler(id,s){const p=pnjs[id];if(!p)return;p.talk=s||3;p.g.rotation.y=Math.atan2(joueur.x-p.def.x,joueur.z-p.def.z)}
  function revelerTout(ids){ids.forEach(id=>{const ob=objs[id];if(ob){ob.etat.revele=true;ob.g.visible=true}})}
  function setLook(l){o.look=l;if(!joueur.obj)return;sc.remove(joueur.obj);joueur.obj=makeHuman(Object.assign({h:1},l));joueur.obj.scale.multiplyScalar(.95);sc.add(joueur.obj);box(.46,.05,.46,'#3a2a1a',0,1.78,0,joueur.obj);box(.28,.14,.28,'#3a2a1a',0,1.86,0,joueur.obj)}
  function ecran(id){const p=pnjs[id];if(!p)return null;const v=new THREE.Vector3(p.def.x,2.35,p.def.z).project(cam),b=r.domElement.getBoundingClientRect();return {x:b.left+(v.x+1)/2*b.width,y:b.top+(1-v.y)/2*b.height}}
  function etat(){return {x:joueur.x,z:joueur.z,ry:joueur.ry}}
  function placer(x,z){const [fx,fz]=libre(x,z);joueur.x=fx;joueur.z=fz}
  function photo(){
    const c=document.createElement('canvas');c.width=192;c.height=108;const g=c.getContext('2d');r.render(sc,cam);
    const src=r.domElement,sw=src.width,sh=src.height,rw=sh*16/9;g.drawImage(src,(sw-Math.min(sw,rw))/2,0,Math.min(sw,rw),sh,0,0,192,108);
    g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(4,4,184,100);return c.toDataURL('image/jpeg',.6)}
  // ---------- boucle
  const kd=e=>{keys[e.key.toLowerCase()]=e.type==='keydown'};addEventListener('keydown',kd);addEventListener('keyup',kd);
  let last=performance.now(),raf=0,fige=false;
  function boucle(now){
    const dt=Math.min(.05,(now-last)/1000);last=now;T+=dt;
    if(!fige&&def){
      let ix=joy.x,iz=joy.y;
      if(keys['arrowleft']||keys['a']||keys['q'])ix-=1;if(keys['arrowright']||keys['d'])ix+=1;if(keys['arrowup']||keys['w']||keys['z'])iz-=1;if(keys['arrowdown']||keys['s'])iz+=1;
      const n=Math.hypot(ix,iz),sp=n>.12?Math.min(1,n):0;
      if(sp>0){const dx=ix/n*3.3*sp*dt,dz=iz/n*3.3*sp*dt;if(!collision(joueur.x+dx,joueur.z))joueur.x+=dx;if(!collision(joueur.x,joueur.z+dz))joueur.z+=dz;joueur.ry=Math.atan2(ix,iz)}
      joueur.v=sp*3.3;
      joueur.obj.position.set(joueur.x,0,joueur.z);joueur.obj.rotation.y+=(((joueur.ry-joueur.obj.rotation.y+Math.PI*3)%(Math.PI*2))-Math.PI)*Math.min(1,dt*10);
      joueur.obj.userData.update(dt,{speed:joueur.v,cam:cam.position});
      majPnj(dt);
      const p=calcProche();const k=p?p.kind+p.id:'';if(k!==derniere){derniere=k;pr=p;o.onProche(p)}else pr=p;
      Object.values(pnjs).forEach(q=>{q.lab.visible=dist(joueur.x,joueur.z,q.def.x,q.def.z)<6.5});
    }
    // caméra : vue 3/4 en hauteur
    const tx=joueur.x,tz=joueur.z;if(snap){cam.position.set(tx,8.6,tz+6.6);snap=false}else cam.position.lerp(new THREE.Vector3(tx,8.6,tz+6.6),Math.min(1,dt*5));cam.lookAt(tx,.9,tz-.5);
    r.render(sc,cam);raf=requestAnimationFrame(boucle)}
  raf=requestAnimationFrame(boucle);
  const rs=()=>{const w=el.clientWidth||W0,h=Math.max(200,el.clientHeight||H0);r.setSize(w,h,false);cam.aspect=w/h;cam.fov=w/h<.8?66:50;cam.updateProjectionMatrix()};addEventListener('resize',rs);setTimeout(rs,60);
  return {ecran,setLook,charger,joy,proche:()=>{pr=calcProche();return pr},scanner,retirer,deverrouiller,parler,revelerTout,etat,placer,photo,fige:v=>{fige=v},cam,
    objs:()=>objs,pnjs:()=>pnjs,def:()=>def,
    stop(){cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',rs);try{r.forceContextLoss();r.dispose()}catch(e){}el.innerHTML=''}};
}
