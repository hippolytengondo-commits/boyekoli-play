// BOYEKOLI DESIGN STUDIO : éditeur 3D de maisons (murs, ouvertures, toit, pièces, meubles, styles), caméras, jour/nuit,
// missions évaluées, projets multiples avec sauvegarde automatique et galerie de photos. Tout est local et préprogrammé.
import * as THREE from 'three';
import {COULEURS_MUR,COULEURS_TOIT,TEXTURES_MUR,SOLS,TOITS,STYLES,CATALOGUE,CATS,NOTIONS,MISSIONS} from './design/data.js';

export function creerDesign(D){
  const {PAR,G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const DS=()=>{const a=A();if(!a.deco2)a.deco2={proj:[],cur:null,photos:[],done:{},stars:{},cert:null,badges:{}};const d=a.deco2;['done','stars','badges'].forEach(k=>{if(!d[k])d[k]={}});if(!d.proj)d.proj=[];if(!d.photos)d.photos=[];return d};
  let ov=null,pop=null,kb=null,R=null,sc=null,cam=null,raf=0,P=null,tab='maison',cur=null,sel=-1,mode='poser',opT='porte',vue='ext',tmp=0,idle=0;
  let gWorld=null,gMeu=null,gWalls=null,roof=null,selRing=null,lights=[],sun=null,hemi=null,glass=[],obst=[],ptrs=new Map(),drag=null,keys={},cs={yaw:.6,pitch:.45,dist:14,tx:0,ty:1,tz:0,hx:0,hz:6,hy:1.6,fly:false},sautSave=0,confirmDel=-1;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:7px 10px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#3a4a5e'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const on=(c,t,oc)=>btn(t,oc,c?'#ffd54f':'');
  const F=n=>Math.round(n*100)/100;
  // ---------- projets
  function nouveau(mission){
    const d=DS(),p={id:'p'+Date.now().toString(36)+Math.floor(Math.random()*99),nom:mission?MISSIONS[mission].nom:'Projet '+(d.proj.length+1),mission:mission||null,W:mission==='m2'?10:7,D:mission==='m2'?8:5,H:3,toit:'2p',cm:'#f2e3c6',ct:'#b5503c',tm:'uni',nb:1,sols:['carrelage','bois','bois','carrelage'],ops:mission?[]:[{s:'S',t:3.5,k:'porte'}],opt:{terrasse:false,jardin:true,cloture:false,garage:false},meubles:[],jour:true,maj:Date.now()};
    if(d.proj.length>=8){toast('8 projets maximum : supprime-en un.');return null}
    d.proj.push(p);d.cur=p.id;save();return p}
  const courant=()=>{const d=DS();return d.proj.find(p=>p.id===d.cur)||null};
  function sauve(){if(P){P.maj=Date.now();clearTimeout(sautSave);sautSave=setTimeout(()=>save(),400)}}
  // ---------- textures procédurales
  const TC={};
  function baseTex(kind,hex){
    const k=kind+hex;if(TC[k])return TC[k];const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.fillStyle=hex;g.fillRect(0,0,128,128);
    if(kind==='brique'){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=3;for(let y=0;y<128;y+=32){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke();for(let x=((y/32)%2)*32;x<128;x+=64){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+32);g.stroke()}}}
    else if(kind==='wax'){const cs=['#d6302b','#1b6ca8','#f4c20d','#222'];for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=cs[(x+y)%4];g.beginPath();g.arc(x*32+16,y*32+16,10,0,7);g.fill();g.fillStyle=cs[(x+y+1)%4];g.beginPath();g.arc(x*32+16,y*32+16,4,0,7);g.fill()}g.globalAlpha=.25;g.fillStyle=hex;g.fillRect(0,0,128,128)}
    else if(kind==='pierre'){for(let i=0;i<40;i++){g.fillStyle=`rgba(0,0,0,${Math.random()*.12})`;g.fillRect(Math.random()*128,Math.random()*128,30,16)}g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;for(let y=0;y<128;y+=43){g.beginPath();g.moveTo(0,y);g.lineTo(128,y);g.stroke()}}
    else if(kind==='carrelage'){g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=2;g.strokeRect(0,0,64,64);g.strokeRect(64,64,64,64);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,0,64,64);g.fillRect(64,64,64,64)}
    else if(kind==='bois'){for(let x=0;x<128;x+=21){g.fillStyle=`rgba(0,0,0,${.05+Math.random()*.1})`;g.fillRect(x,0,20,128);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x+20,0,1,128)}}
    else if(kind==='terre'){g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=2;g.strokeRect(2,2,60,60);g.strokeRect(66,2,60,60);g.strokeRect(2,66,60,60);g.strokeRect(66,66,60,60)}
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return TC[k]=t}
  function mat(kind,hex,rx,ry){
    if(!kind||kind==='uni')return new THREE.MeshStandardMaterial({color:hex,roughness:.85});
    const b=baseTex(kind,hex),t=b.clone();t.needsUpdate=true;t.repeat.set(Math.max(.5,rx||1),Math.max(.5,ry||1));return new THREE.MeshStandardMaterial({map:t,roughness:.8})}
  const SOLC={carrelage:'#e9e4d8',bois:'#b98a5a',beton:'#a9aaad',terre:'#c0693f'};
  const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.7:r});
  function box(g,w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o}
  function cyl(g,r,h,m,x,y,z,s){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s||12),m);o.position.set(x,y,z);g.add(o);return o}
  // ---------- géométrie de la maison
  const OUV={porte:{w:1,h:2.1,sill:0,c:'#6b4423'},fen:{w:1.2,h:1.1,sill:1,c:'#9fd3f5'},garage:{w:2.6,h:2.3,sill:0,c:'#8a8d91'}};
  const hw=()=>P.W/2,hd=()=>P.D/2;
  const lenSide=s=>s==='N'||s==='S'?P.W:P.D;
  function rooms(){
    const w=hw(),d=hd(),n=P.nb;
    if(n===1)return[{nom:'Séjour',x0:-w,z0:-d,x1:w,z1:d}];
    if(n===2)return[{nom:'Salon',x0:-w,z0:-d,x1:0,z1:d},{nom:'Chambre',x0:0,z0:-d,x1:w,z1:d}];
    if(n===3)return[{nom:'Salon',x0:-w,z0:-d,x1:0,z1:d},{nom:'Cuisine',x0:0,z0:-d,x1:w,z1:0},{nom:'Chambre',x0:0,z0:0,x1:w,z1:d}];
    return[{nom:'Salon',x0:-w,z0:-d,x1:0,z1:0},{nom:'Cuisine',x0:-w,z0:0,x1:0,z1:d},{nom:'Chambre',x0:0,z0:-d,x1:w,z1:0},{nom:'Salle de bain',x0:0,z0:0,x1:w,z1:d}]}
  function parts(){
    const w=hw(),d=hd(),n=P.nb;if(n===1)return[];
    if(n===2)return[{v:true,a:-d,b:d,c:0,g:[.7]}];
    if(n===3)return[{v:true,a:-d,b:d,c:0,g:[.3]},{v:false,a:0,b:w,c:0,g:[.5]}];
    return[{v:true,a:-d,b:d,c:0,g:[.25,.75]},{v:false,a:-w,b:w,c:0,g:[.25,.75]}]}
  function cloisons(g){
    obst=[];const m=mat(P.tm==='wax'?'uni':P.tm,'#efe9dc',2,1.5);
    parts().forEach(p=>{const L=p.b-p.a,gaps=p.g.map(f=>p.a+L*f).sort((x,y)=>x-y);let cur=p.a;const seg=(s,e)=>{if(e-s<.05)return;const ml=(s+e)/2,len=e-s;if(p.v){box(g,.12,P.H,len,m,p.c,P.H/2,ml);obst.push({x0:p.c-.08,x1:p.c+.08,z0:s,z1:e})}else{box(g,len,P.H,.12,m,ml,P.H/2,p.c);obst.push({x0:s,x1:e,z0:p.c-.08,z1:p.c+.08})}};
      gaps.forEach(c=>{seg(cur,c-.5);const ml=c;if(p.v)box(g,.12,P.H-2.1,1,m,p.c,2.1+(P.H-2.1)/2,ml);else box(g,1,P.H-2.1,.12,m,ml,2.1+(P.H-2.1)/2,p.c);cur=c+.5});seg(cur,p.b)})}
  function seg(g,s,a,b,y0,y1,m){
    if(b-a<.02||y1-y0<.02)return;const len=b-a,h=y1-y0,t=.2,mid=(a+b)/2,cy=(y0+y1)/2;let o;
    if(s==='N'||s==='S'){o=box(g,len,h,t,m,-hw()+mid,cy,(s==='N'?-1:1)*hd())}else{o=box(g,t,h,len,m,(s==='W'?-1:1)*hw(),cy,-hd()+mid)}
    o.userData.side=s;return o}
  function construire(){
    const wasSel=sel;if(gWorld){sc.remove(gWorld);gWorld.traverse(o=>{if(o.geometry)o.geometry.dispose()})}
    gWorld=new THREE.Group();sc.add(gWorld);glass=[];lights=[];
    const W=P.W,Dd=P.D,H=P.H,PW=W+16,PD=Dd+16;
    // terrain, route
    const sol=new THREE.Mesh(new THREE.PlaneGeometry(PW,PD),P.opt.jardin?mat('uni','#5f9e4a'):mat('uni','#c9a36b'));sol.rotation.x=-Math.PI/2;sol.position.y=-.01;sol.userData.ground=1;gWorld.add(sol);
    const rue=new THREE.Mesh(new THREE.PlaneGeometry(PW+30,6),M('#4b4d52'));rue.rotation.x=-Math.PI/2;rue.position.set(0,-.02,PD/2+3.2);gWorld.add(rue);
    const hors=new THREE.Mesh(new THREE.PlaneGeometry(PW+60,PD+60),M('#8a7a55'));hors.rotation.x=-Math.PI/2;hors.position.y=-.05;gWorld.add(hors);
    for(let i=-4;i<=4;i++)box(gWorld,1.6,.02,.2,M('#f2f2f2'),i*4,-.005,PD/2+3.2);
    // sols des pièces
    const rs=rooms();rs.forEach((r,i)=>{const k=P.sols[i]||'carrelage',rw=r.x1-r.x0,rd=r.z1-r.z0;const f=new THREE.Mesh(new THREE.PlaneGeometry(rw,rd),mat(k,SOLC[k],rw/1.2,rd/1.2));f.rotation.x=-Math.PI/2;f.position.set((r.x0+r.x1)/2,.02,(r.z0+r.z1)/2);f.userData.ground=1;gWorld.add(f);
      const c=document.createElement('canvas');c.width=256;c.height=64;const g=c.getContext('2d');g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,0,256,64);g.fillStyle='#fff';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText(r.nom,128,44);
      const lb=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.45),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true}));lb.rotation.x=-Math.PI/2;lb.position.set((r.x0+r.x1)/2,.03,r.z1-.45);gWorld.add(lb);lb.userData.label=1;
      const pl=new THREE.PointLight('#ffd9a0',0,9,1.5);pl.position.set((r.x0+r.x1)/2,H-.4,(r.z0+r.z1)/2);gWorld.add(pl);lights.push(pl)});
    // murs extérieurs avec ouvertures
    gWalls=new THREE.Group();gWorld.add(gWalls);
    ['N','S','W','E'].forEach(s=>{
      const len=lenSide(s),ops=P.ops.map((o,i)=>Object.assign({i},o)).filter(o=>o.s===s).sort((a,b)=>a.t-b.t);let cur=0;
      const wm=(a,b,y0,y1)=>mat(P.tm,P.cm,(b-a)/1.2,(y1-y0)/1.2);
      const add=(a,b,y0,y1)=>{const o=seg(gWalls,s,a,b,y0,y1,wm(a,b,y0,y1));return o};
      ops.forEach(o=>{const def=OUV[o.k],a=o.t-def.w/2,b=o.t+def.w/2;add(cur,a,0,H);if(def.sill>0)add(a,b,0,def.sill);add(a,b,def.sill+def.h,H);cur=b;
        const cx=s==='N'||s==='S'?-hw()+o.t:(s==='W'?-hw():hw()),cz=s==='N'||s==='S'?(s==='N'?-hd():hd()):-hd()+o.t,hor=s==='N'||s==='S';
        const cy=def.sill+def.h/2;
        if(o.k==='fen'){const gl=new THREE.Mesh(new THREE.BoxGeometry(hor?def.w:.06,def.h,hor?.06:def.w),new THREE.MeshStandardMaterial({color:'#9fd3f5',transparent:true,opacity:.55,emissive:'#000',roughness:.1}));gl.position.set(cx,cy,cz);gl.userData={op:o.i};gWorld.add(gl);glass.push(gl);
          const fr=M('#f4f4f4');box(gWorld,hor?def.w+.1:.12,.06,hor?.12:def.w+.1,fr,cx,def.sill,cz).userData={op:o.i};box(gWorld,hor?def.w+.1:.12,.06,hor?.12:def.w+.1,fr,cx,def.sill+def.h,cz);box(gWorld,hor?.05:.1,def.h,hor?.1:.05,fr,cx,cy,cz)}
        else{const lf=new THREE.Mesh(new THREE.BoxGeometry(hor?def.w-.08:.07,def.h-.04,hor?.07:def.w-.08),M(def.c,.6));lf.position.set(cx,cy,cz);lf.userData={op:o.i};gWorld.add(lf);
          if(o.k==='porte')box(gWorld,.08,.08,.08,M('#e8c04a'),cx+(hor?.35:(s==='W'?.06:-.06)),1,cz+(hor?(s==='N'?.06:-.06):.35))}
        if(o.k==='garage'){for(let q=0;q<5;q++)box(gWorld,hor?def.w-.1:.09,.04,hor?.09:def.w-.1,M('#6e7175'),cx,.4+q*.45,cz)}});
      add(cur,len,0,H)});
    cloisons(gWorld);
    // toit
    roof=new THREE.Group();gWorld.add(roof);const rm=M(P.ct,.75);
    if(P.toit==='plat'){box(roof,W+.7,.25,Dd+.7,rm,0,H+.12,0);box(roof,W+.7,.3,.1,M('#eeeeee'),0,H+.3,Dd/2+.3);box(roof,W+.7,.3,.1,M('#eeeeee'),0,H+.3,-Dd/2-.3)}
    else if(P.toit==='2p'){const rh=Math.min(W,Dd)*.3+.3,sh=new THREE.Shape();sh.moveTo(-Dd/2-.4,0);sh.lineTo(Dd/2+.4,0);sh.lineTo(0,rh);sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:W+.8,bevelEnabled:false});const m=new THREE.Mesh(g,rm);m.rotation.y=Math.PI/2;m.position.set(-W/2-.4,H,0);roof.add(m)}
    else{const rh=Math.min(W,Dd)*.3+.3,c=new THREE.Mesh(new THREE.ConeGeometry(1,rh,4),rm);c.rotation.y=Math.PI/4;c.scale.set((W+.9)/Math.SQRT2,1,(Dd+.9)/Math.SQRT2);c.position.y=H+rh/2;roof.add(c)}
    // options
    if(P.opt.terrasse){const tw=Math.min(W*.7,6),tz=Dd/2+1.4;box(gWorld,tw,.15,2.6,mat('terre','#c0693f',tw/1.2,2),0,.07,tz);[-1,1].forEach(s=>cyl(gWorld,.08,2.4,M('#6b4423'),s*(tw/2-.2),1.2,tz+1.1));box(gWorld,tw,.1,2.8,M('#8a5a2b'),0,2.45,tz);for(let q=0;q<7;q++)box(gWorld,.06,.1,2.8,M('#6b4423'),-tw/2+q*tw/6,2.55,tz)}
    if(P.opt.cloture){const x0=-PW/2+.3,x1=PW/2-.3,z0=-PD/2+.3,z1=PD/2-.3,fm=M(P.cm,.8);
      const rail=(ax,az,bx,bz,gap)=>{const L=Math.hypot(bx-ax,bz-az),n=Math.floor(L/1.6);for(let i=0;i<=n;i++){const t=i/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;if(gap&&Math.abs(x)<1.6)continue;box(gWorld,.2,1.5,.2,fm,x,.75,z)}const o=box(gWorld,Math.abs(bx-ax)||.08,.1,Math.abs(bz-az)||.08,fm,(ax+bx)/2,1.2,(az+bz)/2);if(gap){gWorld.remove(o);box(gWorld,(x1-x0)/2-1.6,.1,.08,fm,(x0-1.6)/2,1.2,z1);box(gWorld,(x1-x0)/2-1.6,.1,.08,fm,(x1+1.6)/2,1.2,z1)}};
      rail(x0,z0,x1,z0);rail(x0,z0,x0,z1);rail(x1,z0,x1,z1);rail(x0,z1,x1,z1,true);box(gWorld,.15,1.7,.15,M('#444'),-1.5,.85,z1);box(gWorld,.15,1.7,.15,M('#444'),1.5,.85,z1)}
    if(P.opt.garage){const gx=W/2+3.4,gz=Dd/2-2.5;box(gWorld,3.4,2.5,5,M(P.cm),gx,1.25,gz);box(gWorld,3.8,.2,5.4,rm,gx,2.6,gz);box(gWorld,2.4,2.1,.08,M('#8a8d91'),gx,1.05,gz+2.52);const car=voiture();car.position.set(gx,0,gz-.3);car.scale.setScalar(.8);gWorld.add(car)}
    if(P.opt.jardin){for(let i=0;i<5;i++){const bx=-PW/2+1+i*(PW/5),bz=-PD/2+1;const b=new THREE.Mesh(new THREE.SphereGeometry(.5,10,8),M('#3d7f35'));b.position.set(bx,.45,bz);gWorld.add(b)};box(gWorld,1.6,.03,PD/2-Dd/2,M('#d8c9a3'),0,.005,Dd/2+(PD/2-Dd/2)/2)}
    // lampadaire de rue
    cyl(gWorld,.07,4,M('#555'),PW/2-1,2,PD/2+.6);const lm=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:'#fff6c4'}));lm.position.set(PW/2-1,4.1,PD/2+.6);gWorld.add(lm);lm.userData.lampe=1;
    selRing=new THREE.Mesh(new THREE.RingGeometry(.5,.6,28),new THREE.MeshBasicMaterial({color:'#ffd54f',side:THREE.DoubleSide}));selRing.rotation.x=-Math.PI/2;selRing.position.y=.06;selRing.visible=false;gWorld.add(selRing);
    appliqueJour();majVue();meublesRebuild();sel=wasSel<P.meubles.length?wasSel:-1;majSel()}
  // ---------- meubles
  function voiture(){const g=new THREE.Group();box(g,1.8,.6,4.2,M('#c0392b'),0,.55,0);box(g,1.6,.55,2.1,M('#d9e6ee',.2),0,1.1,-.1);[[-.85,-1.3],[.85,-1.3],[-.85,1.3],[.85,1.3]].forEach(p=>{const w=cyl(g,.35,.25,M('#222'),p[0],.35,p[1],14);w.rotation.z=Math.PI/2});return g}
  function modele(id){
    const g=new THREE.Group(),b=(w,h,d,c,x,y,z)=>box(g,w,h,d,M(c),x,y,z);
    switch(id){
      case'canape':b(2,.45,.9,'#3b6ea5',0,.25,0);b(2,.55,.25,'#2f5a8a',0,.7,-.33);b(.25,.35,.9,'#2f5a8a',-.9,.55,0);b(.25,.35,.9,'#2f5a8a',.9,.55,0);break;
      case'fauteuil':b(.9,.4,.9,'#c0693f',0,.25,0);b(.9,.5,.2,'#a5532f',0,.65,-.35);break;
      case'tablebasse':b(1,.06,.6,'#6b4423',0,.4,0);[[-.4,-.22],[.4,-.22],[-.4,.22],[.4,.22]].forEach(p=>b(.06,.4,.06,'#4a2f18',p[0],.2,p[1]));break;
      case'tv':b(1.4,.45,.45,'#4a2f18',0,.23,0);b(1,.6,.05,'#111',0,.85,0);b(.9,.5,.02,'#223a55',0,.85,.03);break;
      case'etagere':b(1,1.8,.35,'#8a5a2b',0,.9,0);for(let i=0;i<4;i++)b(.9,.04,.3,'#c9a36b',0,.35+i*.4,.02);break;
      case'tapis':b(2,.03,1.4,'#c0393b',0,.02,0);b(1.6,.035,1,'#f4c20d',0,.02,0);break;
      case'table':b(1.4,.06,.9,'#8a5a2b',0,.75,0);[[-.6,-.38],[.6,-.38],[-.6,.38],[.6,.38]].forEach(p=>b(.07,.75,.07,'#6b4423',p[0],.37,p[1]));break;
      case'chaise':b(.45,.05,.45,'#8a5a2b',0,.45,0);b(.45,.5,.05,'#8a5a2b',0,.7,-.2);[[-.18,-.18],[.18,-.18],[-.18,.18],[.18,.18]].forEach(p=>b(.04,.45,.04,'#6b4423',p[0],.22,p[1]));break;
      case'lit':b(1.4,.35,2,'#8a5a2b',0,.2,0);b(1.3,.2,1.9,'#f2f2f2',0,.47,.05);b(1.4,.9,.1,'#6b4423',0,.7,-.95);b(.5,.12,.35,'#ffffff',-.32,.62,-.7);b(.5,.12,.35,'#ffffff',.32,.62,-.7);b(1.3,.05,1.1,'#e07a5f',0,.58,.4);break;
      case'litS':b(.9,.35,2,'#8a5a2b',0,.2,0);b(.8,.2,1.9,'#f2f2f2',0,.47,.05);b(.9,.8,.1,'#6b4423',0,.65,-.95);b(.5,.12,.35,'#ffffff',0,.62,-.7);b(.8,.05,1.1,'#3b6ea5',0,.58,.4);break;
      case'armoire':b(1.2,2,.55,'#6b4423',0,1,0);b(.02,1.8,.02,'#222',0,1,.28);b(.06,.2,.04,'#e8c04a',-.1,1,.29);b(.06,.2,.04,'#e8c04a',.1,1,.29);break;
      case'commode':b(.9,.8,.45,'#8a5a2b',0,.4,0);for(let i=0;i<3;i++)b(.8,.02,.02,'#222',0,.2+i*.25,.23);break;
      case'bureau':b(1.2,.05,.6,'#8a5a2b',0,.75,0);b(.05,.75,.55,'#6b4423',-.55,.37,0);b(.05,.75,.55,'#6b4423',.55,.37,0);b(.4,.3,.05,'#222',0,1.0,-.15);break;
      case'frigo':b(.7,1.8,.7,'#e8eef2',0,.9,0);b(.66,.02,.02,'#888',0,1.2,.36);b(.04,.5,.04,'#888',.28,1.45,.37);break;
      case'cuisiniere':b(.6,.9,.6,'#d9dde3',0,.45,0);[[-.15,-.15],[.15,-.15],[-.15,.15],[.15,.15]].forEach(p=>b(.18,.02,.18,'#222',p[0],.92,p[1]));b(.5,.4,.02,'#222',0,.45,.3);break;
      case'evier':b(1.2,.9,.6,'#c9a36b',0,.45,0);b(.5,.06,.4,'#cfd6dc',-.2,.92,0);b(.04,.3,.04,'#999',.2,1.05,-.2);break;
      case'wc':b(.4,.4,.5,'#ffffff',0,.2,.1);b(.4,.7,.2,'#ffffff',0,.55,-.25);break;
      case'douche':b(.9,.1,.9,'#cfd6dc',0,.05,0);b(.04,2,.04,'#999',.4,1,-.4);b(.3,.05,.3,'#999',.3,2,-.3);b(.9,2,.03,'#9fd3f5',0,1,.44).material.transparent=true;break;
      case'lavabo':b(.6,.85,.45,'#ffffff',0,.43,0);b(.5,.06,.38,'#cfd6dc',0,.88,0);b(.04,.2,.04,'#999',0,1,-.15);break;
      case'plante':cyl(g,.15,.3,M('#a5532f'),0,.15,0);for(let i=0;i<6;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.18,8,6),M('#2e9e4a'));l.position.set(Math.cos(i)*.12,.55+i*.07,Math.sin(i)*.12);g.add(l)}break;
      case'lampe':cyl(g,.04,1.6,M('#333'),0,.8,0);cyl(g,.15,.2,M('#fff1c4'),0,1.7,0);break;
      case'arbre':cyl(g,.15,1.6,M('#6b4423'),0,.8,0);for(let i=0;i<4;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.7-i*.08,10,8),M('#2f7a36'));s.position.set((i%2-.5)*.4,1.9+i*.25,(i>1?.2:-.2));g.add(s)}break;
      case'palmier':cyl(g,.12,2.6,M('#8a6a3a'),0,1.3,0);for(let i=0;i<7;i++){const f=box(g,1.2,.04,.2,M('#3d8a3a'),Math.cos(i)*.55,2.7,Math.sin(i)*.55);f.rotation.y=-i;f.rotation.z=.25}break;
      case'banc':b(1.4,.06,.45,'#8a5a2b',0,.45,0);b(1.4,.4,.05,'#8a5a2b',0,.7,-.2);[[-.6],[.6]].forEach(p=>b(.06,.45,.4,'#444',p[0],.22,0));break;
      case'voiture':{const v=voiture();g.add(v);break}
      case'barbecue':cyl(g,.3,.4,M('#333'),0,.7,0);[[-.25,-.2],[.25,-.2],[0,.25]].forEach(p=>b(.04,.5,.04,'#222',p[0],.25,p[1]));b(.5,.03,.3,'#555',0,.9,0);break;
      case'bacfleurs':b(.8,.3,.4,'#a5532f',0,.15,0);for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.09,6,6),M(['#e74c3c','#f4c20d','#e84393'][i%3]));f.position.set(-.3+i*.15,.38,0);g.add(f)}break}
    return g}
  const cat=id=>CATALOGUE.find(c=>c.id===id);
  const taille=m=>{const c=cat(m.id),s=m.s||1,r=(m.r||0)%2;return r?[c.d*s/2,c.w*s/2]:[c.w*s/2,c.d*s/2]};
  function valide(m,idx){
    const c=cat(m.id),[a,b]=taille(m),W=hw(),Dd=hd(),PW=P.W+16,PD=P.D+16;
    if(c.ext){if(m.x+a>-W-.15&&m.x-a<W+.15&&m.z+b>-Dd-.15&&m.z-b<Dd+.15)return false;if(Math.abs(m.x)+a>PW/2-.3||Math.abs(m.z)+b>PD/2-.3)return false;
      if(P.opt.garage&&m.x+a>W+1.6&&m.x-a<W+5.2&&m.z+b>Dd/2-5&&m.z-b<Dd/2)return false}
    else{if(Math.abs(m.x)+a>W-.15||Math.abs(m.z)+b>Dd-.15)return false;for(const o of obst)if(m.x+a>o.x0&&m.x-a<o.x1&&m.z+b>o.z0&&m.z-b<o.z1)return false}
    for(let j=0;j<P.meubles.length;j++){if(j===idx)continue;const q=P.meubles[j],cq=cat(q.id);if(c.plat||cq.plat)continue;const [a2,b2]=taille(q);if(m.x+a>q.x-a2+.01&&m.x-a<q.x+a2-.01&&m.z+b>q.z-b2+.01&&m.z-b<q.z+b2-.01)return false}
    return true}
  function meublesRebuild(){
    if(gMeu){gWorld.remove(gMeu)}gMeu=new THREE.Group();gWorld.add(gMeu);
    P.meubles.forEach((m,i)=>{const o=modele(m.id),w=new THREE.Group();w.add(o);w.scale.setScalar(m.s||1);w.rotation.y=-(m.r||0)*Math.PI/2;w.position.set(m.x,0,m.z);w.userData.mi=i;o.traverse(q=>{q.userData.mi=i});gMeu.add(w)});majSel()}
  function majSel(){if(!selRing)return;const m=P.meubles[sel];if(!m){selRing.visible=false;return}const [a,b]=taille(m);selRing.visible=true;selRing.position.set(m.x,.06,m.z);selRing.scale.set(Math.max(a,b)*1.7,Math.max(a,b)*1.7,1)}
  function poser(x,z){
    if(!cur)return false;const c=cat(cur),m={id:cur,x:Math.round(x*2)/2,z:Math.round(z*2)/2,r:0,s:1};
    if(!valide(m,-1)){SFX.ko&&SFX.ko();msg('❌ Impossible ici : '+(c.ext?'place-le sur le terrain, hors de la maison.':'reste dans une pièce, sans traverser un mur ni un autre meuble.'));return false}
    if(P.meubles.length>=60){msg('60 éléments maximum.');return false}
    P.meubles.push(m);sel=P.meubles.length-1;meublesRebuild();sauve();SFX.coin&&SFX.coin();return true}
  // ---------- ambiance, caméras
  function appliqueJour(){
    const j=P.jour;sc.background=new THREE.Color(j?'#a9d6f5':'#0c1530');hemi.intensity=j?1.5:.35;hemi.color.set(j?'#ffffff':'#6a7cc0');sun.intensity=j?1.4:.25;sun.color.set(j?'#fff4dd':'#7a8cff');
    lights.forEach(l=>l.intensity=j?0:1.3);glass.forEach(g=>{g.material.emissive.set(j?'#000000':'#ffcf70');g.material.emissiveIntensity=j?0:.9;g.material.opacity=j?.55:.9})}
  function majVue(){
    if(!roof)return;roof.visible=(vue==='ext'||vue==='aerien');
    if(gWalls)gWalls.visible=true;
    const T=Math.max(P.W,P.D);
    if(vue==='ext'){cs.fly=false;cs.tx=0;cs.ty=P.H/2;cs.tz=0;cs.dist=T*1.8+5;cs.pitch=.35}
    else if(vue==='aerien'){cs.fly=false;cs.tx=0;cs.ty=0;cs.tz=0;cs.dist=T*2.6+10;cs.pitch=.95}
    else if(vue==='dessus'){cs.fly=false;cs.tx=0;cs.ty=0;cs.tz=0;cs.dist=T*1.5+3;cs.pitch=1.52}
    else if(vue==='interieur'){cs.fly=false;cs.tx=0;cs.ty=1.1;cs.tz=0;cs.dist=Math.min(P.W,P.D)*.45;cs.pitch=.45}
    else if(vue==='humain'){cs.fly=false;cs.hx=0;cs.hz=P.D/2-.6;cs.hy=1.6;cs.hyaw=0;cs.hp=0}
    else if(vue==='libre'){cs.fly=true;cs.hx=0;cs.hz=P.D/2+9;cs.hy=5;cs.hyaw=0;cs.hp=-.3}}
  function majCam(dt){
    const f=(keys.f?1:0)-(keys.b?1:0),s=(keys.r?1:0)-(keys.l?1:0),u=(keys.u?1:0)-(keys.d?1:0);
    if(vue==='humain'||vue==='libre'){
      const sp=(vue==='libre'?6:2.4)*dt,sy=Math.sin(cs.hyaw),cy=Math.cos(cs.hyaw);
      let nx=cs.hx+(sy*f+cy*s)*sp*(vue==='libre'&&cs.hp?Math.cos(cs.hp):1),nz=cs.hz+(-cy*f+sy*s)*sp*(vue==='libre'&&cs.hp?Math.cos(cs.hp):1);
      if(vue==='humain'){const lim=(P.W+16)/2-.5,limz=(P.D+16)/2-.5;nx=Math.max(-lim,Math.min(lim,nx));nz=Math.max(-limz,Math.min(limz,nz));
        const blocked=(x,z)=>{const dx=Math.abs(x)<hw()+.25&&Math.abs(z)<hd()+.25;const inside=Math.abs(x)<hw()-.1&&Math.abs(z)<hd()-.1;if(dx&&!inside){return !porteProche(x,z)}if(inside)for(const o of obst)if(x>o.x0-.25&&x<o.x1+.25&&z>o.z0-.25&&z<o.z1+.25)return !gapProche(x,z);return false};
        if(!blocked(nx,nz)){cs.hx=nx;cs.hz=nz}else if(!blocked(nx,cs.hz))cs.hx=nx;else if(!blocked(cs.hx,nz))cs.hz=nz}
      else{cs.hx=nx;cs.hz=nz;cs.hy=Math.max(.8,Math.min(30,cs.hy+u*4*dt))}
      cam.position.set(cs.hx,cs.hy,cs.hz);cam.lookAt(cs.hx+Math.sin(cs.hyaw)*Math.cos(cs.hp||0),cs.hy+Math.sin(cs.hp||0),cs.hz-Math.cos(cs.hyaw)*Math.cos(cs.hp||0));return}
    const d=cs.dist,cp=Math.cos(cs.pitch);cam.position.set(cs.tx+Math.sin(cs.yaw)*cp*d,cs.ty+Math.sin(cs.pitch)*d,cs.tz+Math.cos(cs.yaw)*cp*d);cam.lookAt(cs.tx,cs.ty,cs.tz)}
  function porteProche(x,z){return P.ops.some(o=>{if(o.k==='fen')return false;const w=OUV[o.k].w/2+.1;if(o.s==='N'||o.s==='S')return Math.abs(x-(-hw()+o.t))<w&&Math.abs(Math.abs(z)-hd())<.6;return Math.abs(z-(-hd()+o.t))<w&&Math.abs(Math.abs(x)-hw())<.6})}
  function gapProche(x,z){return parts().some(p=>{const L=p.b-p.a;return p.g.some(f=>{const c=p.a+L*f;return p.v?(Math.abs(z-c)<.6&&Math.abs(x-p.c)<.4):(Math.abs(x-c)<.6&&Math.abs(z-p.c)<.4)})})}
  // ---------- entrées tactiles
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function pick(e,objs){const cv=R.domElement,b=cv.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);return ray.intersectObjects(objs,true)}
  function solPoint(e){const h=pick(e,[gWorld]).find(x=>x.object.userData.ground);return h?h.point:null}
  function initInput(){
    const cv=R.domElement;cv.style.touchAction='none';
    cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,mv:false});
      if(ptrs.size===1&&tab==='meubles'&&sel>=0){const h=pick(e,[gMeu])[0];if(h){let o=h.object;while(o&&o.userData.mi===undefined)o=o.parent;if(o&&o.userData.mi===sel)drag={i:sel}}}});
    cv.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;
      if(Math.hypot(e.clientX-p.x0,e.clientY-p.y0)>6)p.mv=true;
      if(ptrs.size===2){const a=[...ptrs.values()],d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptrs.values()],d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);cs.dist=Math.max(2,Math.min(70,cs.dist-(d1-d0)*.05));return}
      if(drag){const pt=solPoint(e);if(pt){const m=P.meubles[drag.i],n=Object.assign({},m,{x:Math.round(pt.x*2)/2,z:Math.round(pt.z*2)/2});if(valide(n,drag.i)&&(n.x!==m.x||n.z!==m.z)){m.x=n.x;m.z=n.z;meublesRebuild();majSel()}}p.x=e.clientX;p.y=e.clientY;return}
      if(p.mv){if(vue==='humain'||vue==='libre'){cs.hyaw+=dx*.006;cs.hp=Math.max(-1.2,Math.min(1.2,(cs.hp||0)-dy*.005))}else{cs.yaw-=dx*.008;cs.pitch=Math.max(.05,Math.min(1.55,cs.pitch+dy*.006))}}
      p.x=e.clientX;p.y=e.clientY});
    const fin=e=>{const p=ptrs.get(e.pointerId);ptrs.delete(e.pointerId);if(drag){drag=null;sauve();return}if(p&&!p.mv&&ptrs.size===0)clic(e)};
    cv.addEventListener('pointerup',fin);cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);drag=null});
    cv.addEventListener('wheel',e=>{e.preventDefault();cs.dist=Math.max(2,Math.min(70,cs.dist+e.deltaY*.02))},{passive:false})}
  function clic(e){
    if(tab==='ouvertures'){
      if(mode==='retirer'){const h=pick(e,[gWorld]).find(x=>x.object.userData.op!==undefined);if(h){P.ops.splice(h.object.userData.op,1);construire();sauve();SFX.coin&&SFX.coin()}return}
      const h=pick(e,[gWalls])[0];if(!h||!h.object.userData.side){msg('Touche un mur extérieur de la maison.');return}
      const s=h.object.userData.side,len=lenSide(s),t=Math.round((s==='N'||s==='S'?h.point.x+hw():h.point.z+hd())*2)/2,def=OUV[opT];
      if(t-def.w/2<.3||t+def.w/2>len-.3){msg('❌ Trop près du coin.');SFX.ko&&SFX.ko();return}
      if(P.ops.some(o=>o.s===s&&Math.abs(o.t-t)<(OUV[o.k].w+def.w)/2+.2)){msg('❌ Il y a déjà une ouverture ici.');SFX.ko&&SFX.ko();return}
      if(opT==='garage'&&P.ops.some(o=>o.k==='garage')){msg('Un seul portail de garage.');return}
      P.ops.push({s,t,k:opT});construire();sauve();SFX.coin&&SFX.coin();return}
    const hm=pick(e,[gMeu])[0];
    if(hm){let o=hm.object;while(o&&o.userData.mi===undefined)o=o.parent;if(o){sel=o.userData.mi;confirmDel=-1;if(tab!=='meubles')setTab('meubles');else{majSel();rend()}return}}
    if(tab==='meubles'&&cur){const pt=solPoint(e);if(pt)poser(pt.x,pt.z);rend();return}
    if(sel>=0){sel=-1;majSel();rend()}}
  // ---------- affichage
  function msg(t,ms){const m=$('dsmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3000)}
  function boucle(){
    raf=requestAnimationFrame(boucle);if(!R||!P)return;const now=performance.now(),dt=Math.min(.05,(now-(boucle.t||now))/1000);boucle.t=now;
    majCam(dt);R.render(sc,cam)}
  function taillerCanvas(){const c=$('ds3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}}
  function ouvrir(id){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);
    ov=document.createElement('div');ov.id='dsov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#16202c;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#7a4a1e,#c9733d);flex:0 0 auto"><b id="dstit" style="flex:1;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">🏠 BOYEKOLI DESIGN STUDIO</b>${btn('📁','dsProjets()','#3a4a5e','padding:5px 8px;margin:0')}${btn('📷','dsPhoto()','#3a4a5e','padding:5px 8px;margin:0')}${btn('📖','dsNotions()','#3a4a5e','padding:5px 8px;margin:0')}${btn('✖','dsQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div>
    <div id="ds3d" style="flex:1;position:relative;min-height:0"><div id="dsmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(10,24,30,.9);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div><div id="dspad" style="position:absolute;right:8px;bottom:8px;z-index:3"></div><div id="dsvues" style="position:absolute;left:6px;top:6px;z-index:2"></div></div>
    <div id="dstabs" style="display:flex;overflow-x:auto;background:#0f1822;flex:0 0 auto"></div><div id="dssheet" style="height:37vh;overflow:auto;padding:7px 9px;background:#1d2a3a;flex:0 0 auto"></div>
    <div id="dsover" style="position:absolute;inset:0;background:rgba(10,18,26,.97);display:none;flex-direction:column;padding:10px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'dsRetour()',coin:true,cible:'#ds3d'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('ds3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(55,1,.1,300);hemi=new THREE.HemisphereLight('#ffffff','#556677',1.5);sc.add(hemi);sun=new THREE.DirectionalLight('#fff4dd',1.4);sun.position.set(12,20,10);sc.add(sun);
    setTimeout(taillerCanvas,60);window.addEventListener('resize',taillerCanvas);initInput();
    tab='maison';cur=null;sel=-1;mode='poser';vue='ext';
    try{history.pushState({ds:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);
    kb=e=>{if(!ov)return;const k=e.key.toLowerCase();const m={arrowup:'f',w:'f',z:'f',arrowdown:'b',s:'b',arrowleft:'l',q:'l',a:'l',arrowright:'r',d:'r',e:'u',c:'d'}[k];if(e.type==='keydown'&&k==='escape'){if($('dsover').style.display==='flex')fermerOver();else quitter();return}if(m){keys[m]=e.type==='keydown'}};
    window.addEventListener('keydown',kb);window.addEventListener('keyup',kb);
    const d=DS();let p=id?d.proj.find(x=>x.id===id):courant();
    if(!p){projets(true)}else{charge(p.id)}
    raf=requestAnimationFrame(boucle)}
  function charge(id){const d=DS();d.cur=id;P=courant();sel=-1;cur=null;construire();rendTabs();setTab(tab||'maison');$('dstit').textContent='🏠 '+P.nom+(P.mission?' · mission':'');majPad();fermerOver();save()}
  function fermer(){
    if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',taillerCanvas);window.removeEventListener('keydown',kb);window.removeEventListener('keyup',kb);kb=null;
    if(P)save();try{R.dispose()}catch(e){}ov.remove();ov=null;R=null;sc=null;P=null;gWorld=gMeu=gWalls=roof=null;ptrs.clear();keys={};drag=null}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('dsover');o.style.display='flex';o.style.paddingBottom='84px';o.innerHTML=h}
  function fermerOver(){const o=$('dsover');if(o){o.style.display='none';o.innerHTML=''}}
  const TABS=[['maison','🏠 Maison'],['pieces','🚪 Pièces'],['ouvertures','🪟 Ouvertures'],['meubles','🛋 Meubles'],['couleurs','🎨 Style'],['vues','🎥 Vues'],['mission','🎯 Mission']];
  function rendTabs(){$('dstabs').innerHTML=TABS.map(t=>`<button onclick="dsTab('${t[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#cfd8e3'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  function setTab(t){tab=t;if(t!=='meubles'){cur=null}rendTabs();rend()}
  function majPad(){
    const vs=[['ext','🏡 Extérieur'],['aerien','🛩 Aérien'],['dessus','🗺 Dessus'],['interieur','🛋 Intérieur'],['humain','🚶 Humain'],['libre','🕊 Libre']];
    $('dsvues').innerHTML=`<div style="display:flex;flex-wrap:wrap;max-width:64vw">${vs.map(v=>`<button onclick="dsVue('${v[0]}')" style="margin:1px;padding:4px 7px;border-radius:8px;border:0;font-size:11px;background:${vue===v[0]?'#ffd54f':'rgba(0,0,0,.55)'};color:${vue===v[0]?'#222':'#fff'}">${v[1]}</button>`).join('')}<button onclick="dsJour()" style="margin:1px;padding:4px 7px;border-radius:8px;border:0;font-size:11px;background:rgba(0,0,0,.55);color:#fff">${P&&P.jour?'☀️ Jour':'🌙 Nuit'}</button></div>`;
    const pad=$('dspad');if(vue==='humain'||vue==='libre'){const b=(k,t)=>`<button ontouchstart="dsKey('${k}',1)" ontouchend="dsKey('${k}',0)" onmousedown="dsKey('${k}',1)" onmouseup="dsKey('${k}',0)" onmouseleave="dsKey('${k}',0)" style="width:46px;height:46px;margin:2px;border-radius:12px;border:0;background:rgba(0,0,0,.6);color:#fff;font-size:20px;touch-action:none">${t}</button>`;
      pad.innerHTML=`<div style="display:grid;grid-template-columns:repeat(3,auto);align-items:center">${b('u','⬆')}${b('f','▲')}${b('d','⬇')}${b('l','◀')}${b('b','▼')}${b('r','▶')}</div>`;if(vue==='humain')pad.querySelectorAll('button')[0].style.visibility=pad.querySelectorAll('button')[2].style.visibility='hidden'}else pad.innerHTML=''}
  const sec=(t)=>`<div style="font-size:12px;opacity:.75;margin:5px 0 1px">${t}</div>`;
  function rend(){
    const s=$('dssheet');if(!s||!P)return;let h='';
    if(tab==='maison'){
      const dim=(k,n,mn,mx,pas)=>`<div style="display:flex;align-items:center;margin:2px 0"><span style="flex:1;font-size:13px">${n} : <b>${F(P[k])} m</b></span>${btn('−',`dsDo('dim','${k}',${-pas},${mn},${mx})`)}${btn('+',`dsDo('dim','${k}',${pas},${mn},${mx})`)}</div>`;
      h+=dim('W','Largeur',4,12,1)+dim('D','Profondeur',4,10,1)+dim('H','Hauteur des murs',2.5,4,.5)+`<div style="font-size:12px;opacity:.8">Surface : <b>${F(P.W*P.D)} m²</b></div>`;
      h+=sec('Toit')+TOITS.map(t=>on(P.toit===t[0],t[1],`dsDo('toit','${t[0]}')`)).join('');
      h+=sec('Extérieur')+on(P.opt.terrasse,'🌿 Terrasse',"dsDo('opt','terrasse')")+on(P.opt.jardin,'🌱 Jardin',"dsDo('opt','jardin')")+on(P.opt.cloture,'🧱 Clôture',"dsDo('opt','cloture')")+on(P.opt.garage,'🚗 Garage',"dsDo('opt','garage')")}
    else if(tab==='pieces'){
      h+=sec('Nombre de pièces')+[1,2,3,4].map(n=>on(P.nb===n,n+(n>1?' pièces':' pièce'),`dsDo('nb',${n})`)).join('');
      h+=sec('Revêtement de sol par pièce')+rooms().map((r,i)=>`<div style="margin:3px 0;font-size:13px"><b>${esc(r.nom)}</b> ${SOLS.map(x=>on((P.sols[i]||'carrelage')===x[0],x[1],`dsDo('sol',${i},'${x[0]}')`)).join('')}</div>`).join('');
      h+='<p style="font-size:12px;opacity:.8">Les cloisons ont des passages de porte. Le jeu empêche de placer un meuble dans un mur.</p>'}
    else if(tab==='ouvertures'){
      h+=sec('Ajouter ou retirer, puis touche un mur extérieur de la maison')+on(mode==='poser'&&opT==='porte','🚪 Porte',"dsDo('op','porte')")+on(mode==='poser'&&opT==='fen','🪟 Fenêtre',"dsDo('op','fen')")+on(mode==='poser'&&opT==='garage','🚗 Portail garage',"dsDo('op','garage')")+on(mode==='retirer','🗑 Retirer',"dsDo('op','retirer')");
      h+=`<p style="font-size:12px">Ouvertures : ${P.ops.filter(o=>o.k==='porte').length} porte(s), ${P.ops.filter(o=>o.k==='fen').length} fenêtre(s), ${P.ops.filter(o=>o.k==='garage').length} garage.</p><p style="font-size:12px;opacity:.8">Astuce : des fenêtres sur deux murs opposés aèrent mieux la maison.</p>`}
    else if(tab==='meubles'){
      const ct=window.__dsCat||'Salon';
      h+=`<div>${CATS.map(c=>on(ct===c,c,`dsDo('cat','${c}')`)).join('')}</div><div>${CATALOGUE.filter(c=>c.cat===ct).map(c=>on(cur===c.id,c.ico+' '+c.nom,`dsDo('cur','${c.id}')`)).join('')}</div>`;
      h+=cur?`<p style="font-size:12px;color:#ffd54f">Touche le sol pour placer : ${esc(cat(cur).nom)}</p>`:'<p style="font-size:12px;opacity:.8">Choisis un élément puis touche le sol, ou touche un meuble pour le modifier.</p>';
      const m=P.meubles[sel];if(m){const c=cat(m.id);h+=`<div style="background:#16202c;border-radius:10px;padding:5px;margin-top:4px"><b style="font-size:13px">${c.ico} ${esc(c.nom)} sélectionné</b><br>${btn('◀','dsDo(\'mv\',-1,0)')}${btn('▶','dsDo(\'mv\',1,0)')}${btn('▲','dsDo(\'mv\',0,-1)')}${btn('▼','dsDo(\'mv\',0,1)')}${btn('⟳ Pivoter','dsDo(\'rot\')')}${btn('➖','dsDo(\'sz\',-1)')}${btn('➕','dsDo(\'sz\',1)')}${btn('⧉ Dupliquer','dsDo(\'dup\')')}${btn(confirmDel===sel?'Confirmer ?':'🗑 Supprimer','dsDo(\'del\')','#7b2d26')}<div style="font-size:11px;opacity:.7">Tu peux aussi glisser le meuble sélectionné.</div></div>`}
      h+=`<p style="font-size:11px;opacity:.7">${P.meubles.length} élément(s) · ${btn('Tout vider','dsDo(\'vider\')','#555','padding:3px 7px')}</p>`}
    else if(tab==='couleurs'){
      h+=sec('Style d’architecture')+STYLES.map(s=>btn(esc(s.nom),`dsDo('style','${s.id}')`)).join('');
      h+=sec('Couleur des murs')+COULEURS_MUR.map(c=>`<button onclick="dsDo('cm','${c}')" style="width:32px;height:32px;margin:2px;border-radius:50%;border:3px solid ${P.cm===c?'#fff':'#0006'};background:${c}"></button>`).join('');
      h+=sec('Texture des murs')+TEXTURES_MUR.map(t=>on(P.tm===t[0],t[1],`dsDo('tm','${t[0]}')`)).join('');
      h+=sec('Couleur du toit')+COULEURS_TOIT.map(c=>`<button onclick="dsDo('ct','${c}')" style="width:32px;height:32px;margin:2px;border-radius:50%;border:3px solid ${P.ct===c?'#fff':'#0006'};background:${c}"></button>`).join('');
      h+=`<p style="font-size:12px;opacity:.85">${esc((STYLES.find(s=>s.id===window.__dsStyle)||{txt:''}).txt)}</p>`}
    else if(tab==='vues'){
      h+=sec('Ambiance')+on(P.jour,'☀️ Jour',"dsDo('jour',1)")+on(!P.jour,'🌙 Nuit',"dsDo('jour',0)");
      h+=sec('Caméras')+[['ext','🏡 Extérieure'],['aerien','🛩 Aérienne'],['dessus','🗺 Vue de dessus'],['interieur','🛋 Intérieure'],['humain','🚶 Hauteur humaine'],['libre','🕊 Visite libre']].map(v=>on(vue===v[0],v[1],`dsVue('${v[0]}')`)).join('');
      h+='<p style="font-size:12px;opacity:.85">Glisse le doigt pour tourner, pince pour zoomer. En vue humaine, les flèches te font marcher ; les murs te bloquent sauf aux portes.</p>'+btn('📷 Prendre une photo','dsPhoto()','#2e7d32')}
    else{
      const ms=P.mission&&MISSIONS[P.mission];
      if(!ms){h+='<p style="font-size:13px">Ce projet est en <b>mode libre</b> : crée sans contrainte.</p><p style="font-size:13px">Pour une mission évaluée, ouvre 📁 et lance une mission.</p>'+btn('🎯 Mission 1 : Ma première maison','dsNouvMission(\'m1\')','#2e7d32')+btn('🏡 Mission 2 : La villa familiale','dsNouvMission(\'m2\')','#2e7d32')}
      else{const ev=evalue(ms);h+=`<b style="font-size:14px">🎯 ${esc(ms.nom)}</b><p style="font-size:12px;margin:2px 0">${esc(ms.intro)}</p>`+ev.req.map(c=>`<div style="font-size:13px">${c[1]?'✅':'⬜'} ${esc(c[0])}</div>`).join('')+sec('Bonus (étoile en plus)')+ev.opt.map(c=>`<div style="font-size:13px">${c[1]?'⭐':'▫️'} ${esc(c[0])}</div>`).join('')+'<div style="margin-top:5px">'+btn('✅ Valider ma mission','dsValider()',ev.req.every(c=>c[1])?'#2e7d32':'#555')+'</div>'+(DS().done[ms.id]?'<p style="font-size:12px">✅ Déjà réussie ('+'⭐'.repeat(DS().stars[ms.id]||1)+')</p>':'')}
      const d=DS();if(d.cert)h+=btn('🎓 Mon certificat','dsCert()','#6a1b9a')}
    s.innerHTML=h}
  // ---------- missions
  function evalue(ms){
    const nb=k=>P.ops.filter(o=>o.k===k).length,hasM=(id,r)=>P.meubles.some(m=>m.id===id&&(!r||(m.x>=r.x0&&m.x<=r.x1&&m.z>=r.z0&&m.z<=r.z1))),rs=rooms(),rm=n=>rs.find(r=>r.nom===n),surf=P.W*P.D;
    const incl=(n,ids)=>{const r=rm(n);return !!r&&ids.every(i=>hasM(i,r))};
    if(ms.id==='m1'){
      const req=[surf>=30,nb('porte')>=1,nb('fen')>=2,P.toit!=='plat',P.nb>=2,hasM('lit')||hasM('litS'),hasM('table')],opt=[P.opt.jardin||P.opt.cloture,P.meubles.length>=8];
      return{req:ms.req.map((t,i)=>[t,req[i]]),opt:ms.opt.map((t,i)=>[t,opt[i]])}}
    const req=[surf>=60,P.nb===4,nb('porte')>=2,nb('fen')>=4,incl('Cuisine',['frigo','cuisiniere']),incl('Salle de bain',['wc','douche']),incl('Salon',['canape','table']),(()=>{const r=rm('Chambre');return !!r&&(hasM('lit',r)||hasM('litS',r))})(),P.opt.cloture,hasM('arbre')||hasM('palmier')],
      opt=[P.opt.terrasse,P.opt.garage,P.tm==='wax'||P.cm==='#c9733d'||P.cm==='#b5835a',P.toit!=='plat'];
    return{req:ms.req.map((t,i)=>[t,req[i]]),opt:ms.opt.map((t,i)=>[t,opt[i]])}}
  function valider(){
    const ms=P.mission&&MISSIONS[P.mission];if(!ms)return;const ev=evalue(ms),d=DS();
    if(!ev.req.every(c=>c[1])){const n=ev.req.filter(c=>!c[1]).length;msg('Il reste '+n+' objectif(s) à remplir (⬜).',3500);SFX.ko&&SFX.ko();return}
    const stars=Math.min(3,2+(ev.opt.filter(c=>c[1]).length>=2?1:0)),prem=!d.done[ms.id];
    d.done[ms.id]=true;d.stars[ms.id]=Math.max(d.stars[ms.id]||0,stars);
    const a=A();a.done['met:'+ms.dossier]=true;a.stars['met:'+ms.dossier]=Math.max(a.stars['met:'+ms.dossier]||0,stars);
    let ex='';if(prem){a.pieces+=ms.pieces;a.xp+=ms.pieces;refreshHud();d.badges[ms.id]=true;const t=a.tal||(a.tal={});t.deco=(t.deco||0)+20}
    if(d.done.m1&&d.done.m2&&!d.cert){d.cert={date:new Date().toLocaleDateString('fr-FR')};ex=btn('🎓 Voir mon certificat','dsCert()','#6a1b9a')}
    save();SFX.win&&SFX.win();parler('Mission réussie. Bravo, architecte !');
    over(`<div style="text-align:center"><div style="font-size:44px">🏠🎉</div><h3>Mission réussie !</h3><div style="font-size:30px">${'⭐'.repeat(stars)}</div><p>${esc(ms.nom)}${prem?' · +'+ms.pieces+' 🪙 · badge '+(ms.id==='m1'?'Jeune architecte':'Maître décorateur'):''}</p>${ex}</div>`+btn('↩ Continuer','dsFermerOver()')+btn('📷 Photo souvenir','dsPhoto()'))}
  function cert(){const d=DS();if(!d.cert){over('<h3>🎓 Certificat</h3><p>Réussis les 2 missions pour obtenir ton certificat d’architecte décorateur.</p>'+btn('✖ Fermer','dsFermerOver()'));return}
    over(`<div style="background:linear-gradient(#fff8ee,#f2dfc2);color:#5a3412;border:6px double #c9733d;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI DESIGN STUDIO</div><div style="font-size:44px">🏠</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT D’ARCHITECTE DÉCORATEUR</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune architecte')}</div><p style="font-size:13px">pour avoir conçu et aménagé des maisons dans un atelier de création éducatif.</p><p style="font-size:12px">Fait le ${esc(d.cert.date)}</p></div>`+btn('✖ Fermer','dsFermerOver()'))}
  // ---------- projets, photos, notions
  function projets(premier){
    const d=DS();over(`<h3 style="margin:2px 0">📁 Mes projets</h3>`+d.proj.map(p=>`<div style="background:#1d2a3a;border-radius:10px;padding:7px;margin:4px 0;display:flex;align-items:center"><div style="flex:1;font-size:13px"><b>${esc(p.nom)}</b><br><small>${p.mission?'Mission · ':'Libre · '}${F(p.W*p.D)} m² · ${p.meubles.length} meubles</small></div>${btn('Ouvrir',`dsOuvrirP('${p.id}')`,'#2e7d32')}${btn(confirmDel===p.id?'Sûr ?':'🗑',`dsSuppP('${p.id}')`,'#7b2d26')}</div>`).join('')+`<p style="font-size:12px;opacity:.8">Sauvegarde automatique à chaque modification.</p>`+btn('➕ Projet libre','dsNouvLibre()','#2c7fb8')+btn('🎯 Mission 1','dsNouvMission(\'m1\')','#2e7d32')+btn('🏡 Mission 2','dsNouvMission(\'m2\')','#2e7d32')+(premier&&!d.proj.length?'':btn('✖ Fermer','dsFermerOver()','#7b2d26')))}
  function photo(){
    if(!R||!P)return;R.render(sc,cam);const src=R.domElement,c=document.createElement('canvas');c.width=360;c.height=Math.round(360*src.height/src.width);c.getContext('2d').drawImage(src,0,0,c.width,c.height);
    const d=DS();d.photos.unshift({img:c.toDataURL('image/jpeg',.6),nom:P.nom,date:new Date().toLocaleDateString('fr-FR')});d.photos=d.photos.slice(0,10);save();SFX.coin&&SFX.coin();galerie()}
  function galerie(){const d=DS();over(`<h3 style="margin:2px 0">📷 Galerie</h3>`+(d.photos.length?d.photos.map((p,i)=>`<div style="margin:6px 0"><img src="${p.img}" style="width:100%;border-radius:10px"><div style="font-size:12px">${esc(p.nom)} · ${esc(p.date)} ${btn('🗑',`dsSuppPh(${i})`,'#7b2d26','padding:2px 7px')}</div></div>`).join(''):'<p>Aucune photo. Prends-en avec 📷.</p>')+btn('✖ Fermer','dsFermerOver()','#7b2d26'))}
  function notions(){over('<h3 style="margin:2px 0">📖 Notions d’architecture</h3>'+NOTIONS.map(n=>`<div style="background:#1d2a3a;border-radius:10px;padding:8px;margin:5px 0;font-size:13px"><b>${esc(n[0])}</b><br>${esc(n[1])}</div>`).join('')+STYLES.map(s=>`<div style="background:#2a2118;border-radius:10px;padding:8px;margin:5px 0;font-size:13px"><b>🎨 ${esc(s.nom)}</b><br>${esc(s.txt)}</div>`).join('')+btn('✖ Fermer','dsFermerOver()','#7b2d26'))}
  // ---------- actions
  const H={
    dim:(k,v,mn,mx)=>{P[k]=Math.max(mn,Math.min(mx,P[k]+v));P.ops=P.ops.filter(o=>{const L=lenSide(o.s),w=OUV[o.k].w;return o.t-w/2>=.3&&o.t+w/2<=L-.3});P.meubles.forEach(m=>{const [a,b]=taille(m),c=cat(m.id);if(!c.ext){m.x=Math.max(-hw()+a+.15,Math.min(hw()-a-.15,m.x));m.z=Math.max(-hd()+b+.15,Math.min(hd()-b-.15,m.z))}});P.meubles=P.meubles.filter((m,i)=>valide(m,i));construire();sauve();rend()},
    toit:t=>{P.toit=t;construire();sauve();rend()},opt:k=>{P.opt[k]=!P.opt[k];construire();sauve();rend()},
    nb:n=>{P.nb=n;P.meubles=P.meubles.filter((m,i)=>{return true});construire();P.meubles=P.meubles.filter((m,i)=>valide(m,i));meublesRebuild();sauve();rend()},
    sol:(i,k)=>{P.sols[i]=k;construire();sauve();rend()},
    op:k=>{if(k==='retirer')mode='retirer';else{mode='poser';opT=k}rend();msg(mode==='retirer'?'Touche une porte/fenêtre pour la retirer.':'Touche un mur extérieur.')},
    cat:c=>{window.__dsCat=c;rend()},cur:id=>{cur=cur===id?null:id;sel=-1;majSel();rend()},
    mv:(dx,dz)=>{const m=P.meubles[sel];if(!m)return;const n=Object.assign({},m,{x:m.x+dx*.5,z:m.z+dz*.5});if(valide(n,sel)){m.x=n.x;m.z=n.z;meublesRebuild();sauve()}else{SFX.ko&&SFX.ko();msg('❌ Obstacle.')}},
    rot:()=>{const m=P.meubles[sel];if(!m)return;const n=Object.assign({},m,{r:((m.r||0)+1)%4});if(valide(n,sel)){m.r=n.r;meublesRebuild();sauve()}else{SFX.ko&&SFX.ko();msg('❌ Pas la place pour pivoter.')}},
    sz:d=>{const m=P.meubles[sel];if(!m)return;const n=Object.assign({},m,{s:Math.max(.8,Math.min(1.4,F((m.s||1)+d*.1)))});if(valide(n,sel)){m.s=n.s;meublesRebuild();sauve()}else{SFX.ko&&SFX.ko();msg('❌ Pas la place.')}},
    dup:()=>{const m=P.meubles[sel];if(!m)return;for(const [dx,dz] of [[1,0],[0,1],[-1,0],[0,-1],[1.5,0],[0,1.5]]){const n=Object.assign({},m,{x:m.x+dx,z:m.z+dz});if(valide(n,-1)){P.meubles.push(n);sel=P.meubles.length-1;meublesRebuild();sauve();rend();return}}msg('❌ Pas de place pour une copie.')},
    del:()=>{if(sel<0)return;if(confirmDel!==sel){confirmDel=sel;rend();return}P.meubles.splice(sel,1);sel=-1;confirmDel=-1;meublesRebuild();sauve();rend()},
    vider:()=>{if(H.vider.c){P.meubles=[];sel=-1;H.vider.c=0;meublesRebuild();sauve();rend()}else{H.vider.c=1;msg('Touche encore « Tout vider » pour confirmer.');setTimeout(()=>H.vider.c=0,4000)}},
    style:id=>{const s=STYLES.find(x=>x.id===id);P.cm=s.cm;P.ct=s.ct;P.tm=s.tm;P.toit=s.toit;if(id==='kin')P.opt.cloture=true;window.__dsStyle=id;construire();sauve();rend()},
    cm:c=>{P.cm=c;construire();sauve();rend()},ct:c=>{P.ct=c;construire();sauve();rend()},tm:t=>{P.tm=t;construire();sauve();rend()},
    jour:v=>{P.jour=!!v;appliqueJour();sauve();rend();majPad()}};
  const actions={
    dsRetour:()=>{const o=$('dsover');if(o&&o.style.display==='flex')fermerOver();else quitter()},dsOuvrir:id=>ouvrir(id),dsQuitter:()=>quitter(),dsTab:t=>setTab(t),dsDo:(n,a,b,c,d)=>{if(P&&H[n])H[n](a,b,c,d)},
    dsVue:v=>{vue=v;majVue();majPad();rend()},dsJour:()=>H.jour(P.jour?0:1),dsKey:(k,v)=>{keys[k]=!!v},
    dsProjets:()=>projets(),dsOuvrirP:id=>charge(id),dsFermerOver:()=>fermerOver(),
    dsSuppP:id=>{if(confirmDel!==id){confirmDel=id;projets();return}const d=DS();d.proj=d.proj.filter(p=>p.id!==id);confirmDel=-1;save();if(d.cur===id){d.cur=null;P=null;if(d.proj.length)charge(d.proj[0].id);else projets(true)}else projets()},
    dsNouvLibre:()=>{const p=nouveau(null);if(p)charge(p.id)},dsNouvMission:m=>{const p=nouveau(m);if(p){charge(p.id);setTab('mission')}},
    dsScreen:(x,y,z)=>{const v=new THREE.Vector3(x,y,z).project(cam),b=R.domElement.getBoundingClientRect();return[b.left+(v.x+1)/2*b.width,b.top+(1-v.y)/2*b.height]},dsPhoto:()=>photo(),dsSuppPh:i=>{DS().photos.splice(i,1);save();galerie()},dsNotions:()=>notions(),dsValider:()=>valider(),dsCert:()=>cert()};
  return {actions,ouvrir,fermer,DS,estOuvert:()=>!!ov};
}
