// BOYEKOLI TAXI : conduire un taxi-moto, un taxi-voiture ou un minibus sur le vrai réseau routier de Kinshasa
// (boulevard Lumumba, passerelles, sauts-de-mouton, ponts, ronds-points). Leçon centrale : respecter ses contrats.
import * as THREE from 'three';
import KIN from './taxi/kinshasa.json';
import {creerVehicule} from './taxi/vehicules.js';
import {BAT,EXCL,robots,majRobots,etatRobot} from './taxi/quartier.js';
import {asphalte} from './routes.js';
import {VEHICULES,MISSIONS,LIEUX_EXTRA,EVENEMENTS,CONSEILS} from './taxi/data.js';

const GRANDS=new Set(['rond','pont','aero','poi_stade','poi_edifice','poi_gare','poi_echangeur']),RAMPE=70,LARG={a:9,b:7,c:5.6,d:4.6},COUL={a:0x52565d,b:0x5a5e65,c:0x64686e,d:0x70737a},HP=5.6,CELL=40;
const rnd=(a,b)=>a+Math.random()*(b-a),cl=(v,a,b)=>Math.max(a,Math.min(b,v));

export function creerTaxi(D){
  const {PAR,G,esc,SFX,save,refreshHud,toast,mis}=D;
  const A=()=>G.adv;
  const T=()=>{const a=A();if(!a.taxi)a.taxi={rep:50,done:{},cert:null};return a.taxi};
  let ov=null,R=null,S=null,raf=0,keys={},kd=null,ku=null;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:10px 13px;margin:4px 0;border-radius:12px;border:2px solid #fff3;background:${bg||'#2f5a6b'};color:#fff;font-size:15px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;

  // ---------- données de la carte : segments, grille, hauteurs (sauts-de-mouton)
  let NET=null;
  function reseau(){
    if(NET)return NET;
    const segs=[],grid=new Map(),roads=KIN.roads;
    const key=(x,z)=>Math.round(x*10)+','+Math.round(z*10);
    // Altitudes : les ponts nommés du boulevard (Lumumba, Triomphal, ponts, sauts-de-mouton, échangeurs) sont surélevés ; la route y monte
    // et en redescend en rampe douce. Les routes qui passent dessous (non reliées au pont) restent au sol : le boulevard « reste au-dessus ».
    const nodes=new Map(),nd=(x,z)=>{const k=key(x,z);let n=nodes.get(k);if(!n){n={adj:[],d:1e9};nodes.set(k,n)}return n};
    const SURE=r=>r.b===1&&(r.c==='a'||r.c==='b');
    let fr=[];roads.forEach(r=>{let pv=null;for(let i=0;i<r.p.length;i+=2){const n=nd(r.p[i],r.p[i+1]);if(SURE(r)&&n.d>0){n.d=0;fr.push(n)}if(pv){const l=Math.hypot(r.p[i]-pv.x,r.p[i+1]-pv.z);pv.n.adj.push([n,l]);n.adj.push([pv.n,l])}pv={n,x:r.p[i],z:r.p[i+1]}}});
    while(fr.length){fr.sort((p,q)=>p.d-q.d);const n=fr.shift();for(const [m,l] of n.adj){if(n.d+l<m.d&&n.d+l<RAMPE){m.d=n.d+l;fr.push(m)}}}
    const alt=(x,z)=>{const n=nodes.get(key(x,z));return n&&n.d<RAMPE?HP*(.5-.5*Math.cos(Math.PI*(1-n.d/RAMPE))):0};
    roads.forEach((r,ri)=>{r.h=[];for(let i=0;i<r.p.length;i+=2)r.h.push(alt(r.p[i],r.p[i+1]));
      for(let i=0;i<r.p.length/2-1;i++){const s={x0:r.p[i*2],z0:r.p[i*2+1],x1:r.p[i*2+2],z1:r.p[i*2+3],y0:r.h[i],y1:r.h[i+1],w:r.l4?13:(r.ln>0?cl(Math.max(r.ln,r.o?1:2)*3.1,5,14):LARG[r.c]),r:ri,i,c:r.c,l4:r.l4?1:0};
        s.l=Math.hypot(s.x1-s.x0,s.z1-s.z0);if(s.l<.01)continue;const id=segs.length;segs.push(s);
        const cx0=Math.floor(Math.min(s.x0,s.x1)/CELL),cx1=Math.floor(Math.max(s.x0,s.x1)/CELL),cz0=Math.floor(Math.min(s.z0,s.z1)/CELL),cz1=Math.floor(Math.max(s.z0,s.z1)/CELL);
        for(let cx=cx0;cx<=cx1;cx++)for(let cz=cz0;cz<=cz1;cz++){const k=cx+','+cz;if(!grid.has(k))grid.set(k,[]);grid.get(k).push(id)}}});
    // lieux : repères de la carte + ajouts ; doublons proches fusionnés
    const lx=km=>km,lieux=[];
    KIN.lieux.forEach(l=>{if(l.t==='saut')return;if(lieux.some(o=>Math.hypot(o.x-l.x,o.z-l.z)<12))return;lieux.push({...l})});
    (KIN.poi||[]).forEach(p=>{if(lieux.some(o=>o.n===p.n&&Math.hypot(o.x-p.x,o.z-p.z)<40))return;lieux.push({n:p.n,t:'poi_'+p.t,x:p.x,z:p.z})});
    LIEUX_EXTRA.forEach(l=>{const x=(l.lon-KIN.o[0])*111320*Math.cos(KIN.o[1]*Math.PI/180)/KIN.s,z=-(l.lat-KIN.o[1])*110574/KIN.s;lieux.push({n:l.n,t:l.t,x,z})});
    NET={segs,grid,lieux,roads};return NET}
  function proche(x,z,rayon,yRef){
    const N=reseau(),cx=Math.floor(x/CELL),cz=Math.floor(z/CELL),c=Math.ceil(rayon/CELL);let best=null;
    for(let i=-c;i<=c;i++)for(let j=-c;j<=c;j++){const L=N.grid.get((cx+i)+','+(cz+j));if(!L)continue;
      for(const id of L){const s=N.segs[id],dx=s.x1-s.x0,dz=s.z1-s.z0;let u=((x-s.x0)*dx+(z-s.z0)*dz)/(s.l*s.l);u=cl(u,0,1);const px=s.x0+u*dx,pz=s.z0+u*dz,d=Math.hypot(x-px,z-pz);
        if(d>rayon)continue;const y=s.y0+(s.y1-s.y0)*u,sc=d+(yRef===undefined?0:Math.abs(y-yRef)*3);
        if(!best||sc<best.sc)best={sc,d,y,s,u,px,pz,id}}}
    return best}
  const surRoute=(x,z,yRef)=>{const p=proche(x,z,6,yRef);return p&&p.d<=p.s.w/2+.4?p:null};

  // ---------- construction de la scène
  function bandes(N,scene){
    const groupes=new Map();
    N.segs.forEach(s=>{const k=s.c+':'+Math.floor((s.x0+s.x1)/2/420)+','+Math.floor((s.z0+s.z1)/2/420);if(!groupes.has(k))groupes.set(k,[]);groupes.get(k).push(s)});
    const line=[],blanc=[];
    // même bitume que les routes du village (texture de gravier), avec trottoirs pour les grandes routes
    const am=asphalte().clone();if(am.map){am.map=am.map.clone();am.map.wrapS=am.map.wrapT=THREE.RepeatWrapping;am.map.needsUpdate=true}am.side=THREE.DoubleSide;
    const tm2=new THREE.MeshStandardMaterial({color:0xbdb8aa,roughness:.95,side:THREE.DoubleSide});
    groupes.forEach((L,k)=>{const c=k[0],pos=[],idx=[],uv=[],tp=[],ti=[];let v=0,tv=0;
      L.forEach(s=>{const dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l,nx=-dz*s.w/2,nz=dx*s.w/2,off=c==='a'?.2:c==='b'?.14:c==='c'?.08:.03;
        pos.push(s.x0+nx,s.y0+off,s.z0+nz, s.x0-nx,s.y0+off,s.z0-nz, s.x1+nx,s.y1+off,s.z1+nz, s.x1-nx,s.y1+off,s.z1-nz);idx.push(v,v+1,v+2,v+1,v+3,v+2,v,v+2,v+1,v+1,v+2,v+3);v+=4;uv.push(0,0,1,0,0,s.l/9,1,s.l/9);
        if((c==='a'||c==='b')&&s.y0<1.5&&s.y1<1.5){const tw=2.4,sx=-dz,sz=dx;[-1,1].forEach(k2=>{const ix=sx*(s.w/2)*k2,iz=sz*(s.w/2)*k2,ox=sx*(s.w/2+tw)*k2,oz=sz*(s.w/2+tw)*k2,h=off+.12;tp.push(s.x0+ix,s.y0+h,s.z0+iz,s.x0+ox,s.y0+h,s.z0+oz,s.x1+ix,s.y1+h,s.z1+iz,s.x1+ox,s.y1+h,s.z1+oz);ti.push(tv,tv+1,tv+2,tv+1,tv+3,tv+2,tv,tv+2,tv+1,tv+1,tv+2,tv+3);tv+=4})}
        if(s.c==='a'&&s.l>2&&!s.l4){const e=.2;line.push([s,dx,dz,e])}if(s.l4)blanc.push([s,dx,dz])});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      const m=new THREE.Mesh(g,am);m.matrixAutoUpdate=false;scene.add(m);
      if(tp.length){const gt=new THREE.BufferGeometry();gt.setAttribute('position',new THREE.Float32BufferAttribute(tp,3));gt.setIndex(ti);gt.computeVertexNormals();scene.add(new THREE.Mesh(gt,tm2))}});
    // ligne centrale jaune du boulevard + piles sous les ponts
    const pos=[],idx=[];let v=0;line.forEach(([s,dx,dz,e])=>{const nx=-dz*e,nz=dx*e;pos.push(s.x0+nx,s.y0+.32,s.z0+nz,s.x0-nx,s.y0+.32,s.z0-nz,s.x1+nx,s.y1+.32,s.z1+nz,s.x1-nx,s.y1+.32,s.z1-nz);idx.push(v,v+1,v+2,v+1,v+3,v+2,v,v+2,v+1,v+1,v+2,v+3);v+=4});
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);scene.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xe8c547,side:THREE.DoubleSide})));
    {const pw=[],iw=[];let w2=0;blanc.forEach(([s,dx,dz])=>{[-3.25,0,3.25].forEach(of=>{for(let t=1;t<s.l-2.6;t+=6){const ax=s.x0+dx*t-dz*of,az=s.z0+dz*t+dx*of,bx=ax+dx*2.6,bz=az+dz*2.6,e=.11,nx=-dz*e,nz=dx*e,ya=s.y0+(s.y1-s.y0)*t/s.l+.12,yb=s.y0+(s.y1-s.y0)*(t+2.6)/s.l+.12;pw.push(ax+nx,ya+.2,az+nz,ax-nx,ya+.2,az-nz,bx+nx,yb+.2,bz+nz,bx-nx,yb+.2,bz-nz);iw.push(w2,w2+1,w2+2,w2+1,w2+3,w2+2,w2,w2+2,w2+1,w2+1,w2+2,w2+3);w2+=4}})});
      const gw=new THREE.BufferGeometry();gw.setAttribute('position',new THREE.Float32BufferAttribute(pw,3));gw.setIndex(iw);scene.add(new THREE.Mesh(gw,new THREE.MeshBasicMaterial({color:0xf2f2f2,side:THREE.DoubleSide})))}
    const pil=[];N.segs.forEach(s=>{if(s.y0>1&&s.y1>1&&s.l>6){const mx=(s.x0+s.x1)/2,mz=(s.z0+s.z1)/2;pil.push([mx,(s.y0+s.y1)/2,mz,s.w])}});
    const pm=new THREE.InstancedMesh(new THREE.BoxGeometry(1.2,1,1.2),new THREE.MeshLambertMaterial({color:0x9a9a96}),Math.max(1,pil.length));const M4=new THREE.Matrix4();
    pil.forEach((p,i)=>{M4.compose(new THREE.Vector3(p[0],p[1]/2,p[2]),new THREE.Quaternion(),new THREE.Vector3(1,p[1],1));pm.setMatrixAt(i,M4)});scene.add(pm)}
  // passerelle à arche d'acier (comme sur le boulevard Lumumba) : arche, tablier, haubans, escaliers aux deux bouts
  function passerelles(N,scene){
    const acier=new THREE.MeshLambertMaterial({color:0x7d8ea3}),sol=new THREE.MeshLambertMaterial({color:0x9a9a96}),rail=new THREE.MeshLambertMaterial({color:0x4a5663}),list=[];
    KIN.pass.forEach(([x,z],i)=>{const p=proche(x,z,60,0);if(!p||p.s.y0>1)return;const s=p.s,dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l,half=s.w/2+(s.c==='a'?9:3),g=new THREE.Group();
      const pts=[];for(let k=0;k<=16;k++){const a=Math.PI*k/16;pts.push(new THREE.Vector3(-Math.cos(a)*half,6+Math.sin(a)*8.5,0))}
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.35,6),acier));
      const toile=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(v=>new THREE.Vector3(v.x*.97,v.y+.45,0))),24,1,8),new THREE.MeshLambertMaterial({color:0xf4f1ea}));toile.scale.z=.9;g.add(toile);
      const deck=new THREE.Mesh(new THREE.BoxGeometry(half*2,.4,2.4),sol);deck.position.y=5.8;g.add(deck);
      [-1,1].forEach(k=>{const r=new THREE.Mesh(new THREE.BoxGeometry(half*2,.9,.1),rail);r.position.set(0,6.5,k*1.15);g.add(r)});
      for(let k=-6;k<=6;k++){const xx=k*half/6.6,h=Math.sqrt(Math.max(0,1-(xx/half)**2))*8.5;if(h<1)continue;const c=new THREE.Mesh(new THREE.BoxGeometry(.08,h,.08),acier);c.position.set(xx,6+h/2,0);g.add(c)}
      [-1,1].forEach(k=>{for(let n=0;n<9;n++){const st=new THREE.Mesh(new THREE.BoxGeometry(1.2,.3,2.4),sol);st.position.set(k*(half+1+n*.7),5.5-n*.62,0);g.add(st)}});
      const pub=pubTex(i);[-1,1].forEach(k=>{const pl=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(half*1.6,24),2.7),new THREE.MeshBasicMaterial({map:pub,side:THREE.DoubleSide}));pl.position.set(0,7.5,k*1.25);pl.rotation.y=k>0?0:Math.PI;g.add(pl)});
      let nom='',dm=45;(KIN.arrets||[]).forEach(a=>{const d=Math.hypot(a[1]-p.px,a[2]-p.pz);if(d<dm){dm=d;nom=a[0]}});if(nom){const e=mini('Passerelle · '+nom,'#3a4a5e');e.position.set(0,12.5,0);g.add(e)}
      g.position.set(p.px,0,p.pz);g.rotation.y=Math.atan2(-dx,-dz);scene.add(g);list.push({x:p.px,z:p.pz,n:i+1,nom})});return list}
  const PUBS=[['BOYEKOLI PLAY','Apprendre en jouant','#1f4e9e','#ffd23a'],['VOTRE PUBLICITÉ ICI','Contactez-nous','#2e7d32','#ffffff'],['PHARMACIE DE GARDE','Ouvert 24h/24','#0e7a3e','#ffffff'],['ÉCOLE · INSCRIPTIONS','Rentrée scolaire','#c0392b','#ffffff'],['TRANSFERT D’ARGENT','Rapide et sûr','#e67e22','#ffffff'],['BONNE ROUTE !','Respectons le code de la route','#6a1b9a','#ffffff']],pubC={};
  function pubTex(i){const k=i%PUBS.length;if(pubC[k])return pubC[k];const [t,u,bg,fg]=PUBS[k],c=document.createElement('canvas');c.width=1024;c.height=216;const g=c.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,1024,216);g.fillStyle=fg;g.textAlign='center';g.font='bold 78px system-ui';g.fillText(t,512,100);g.font='44px system-ui';g.fillText(u,512,168);g.strokeStyle=fg;g.lineWidth=8;g.strokeRect(6,6,1012,204);return pubC[k]=new THREE.CanvasTexture(c)}
  // pancartes vertes au bord des routes : nom de la route et vraies destinations devant soi, avec la distance
  function panneauxRoute(N,scene){
    const cache={},lieux=N.lieux.filter(l=>GRANDS.has(l.t)),acc={};let n=0;
    const tex=(nom,d1,d2)=>{const k=nom+'|'+d1+'|'+d2;if(cache[k])return cache[k];const c=document.createElement('canvas');c.width=384;c.height=160;const g=c.getContext('2d');g.fillStyle='#0e6b3a';g.fillRect(0,0,384,160);g.strokeStyle='#fff';g.lineWidth=5;g.strokeRect(5,5,374,150);g.fillStyle='#fff';g.font='bold 29px system-ui';g.fillText(nom.slice(0,23),16,42);g.font='23px system-ui';g.fillText('➜ '+d1,16,88);if(d2)g.fillText('➜ '+d2,16,128);return cache[k]=new THREE.CanvasTexture(c)};
    const dest=(x,z,hx,hz)=>{const L=[];lieux.forEach(l=>{const dx=l.x-x,dz=l.z-z,d=Math.hypot(dx,dz);if(d<80||d>1600)return;const a=Math.abs(Math.atan2(dx*hz-dz*hx,dx*hx+dz*hz));if(a<.55)L.push({n:l.n,d})});L.sort((p,q)=>p.d-q.d);const o=[];L.forEach(l=>{if(o.length<2&&!o.some(q=>q.n===l.n))o.push(l)});return o.map(l=>l.n+' · '+(l.d/100).toFixed(1)+' km')};
    const matC=new THREE.MeshLambertMaterial({color:0x7a7f86});
    N.segs.forEach(s=>{const r=N.roads[s.r];if(n>150||!r.n||s.c==='d'||s.y0>1||s.y1>1||/^(Pont|Saut|Contre)/i.test(r.n))return;
      acc[s.r]=(acc[s.r]||0)+s.l;if(acc[s.r]<170)return;acc[s.r]=0;const dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l,mx=(s.x0+s.x1)/2,mz=(s.z0+s.z1)/2;
      (r.o?[1]:[1,-1]).forEach(dir=>{const hx=dx*dir,hz=dz*dir,ds=dest(mx,mz,hx,hz);if(!ds.length)return;const rx=-hz,rz=hx,o=s.w/2+3.2;
        const g=new THREE.Group(),pl=new THREE.Mesh(new THREE.PlaneGeometry(9,3.75),new THREE.MeshBasicMaterial({map:tex(r.n,ds[0],ds[1]||''),side:THREE.DoubleSide}));pl.position.y=5.6;g.add(pl);
        [-3.6,3.6].forEach(x=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,5.6,6),matC);p.position.set(x,2.8,0);g.add(p)});
        g.position.set(mx+rx*o,0,mz+rz*o);g.rotation.y=Math.atan2(-hx,-hz);scene.add(g);n++})});
    return n}
  // lampadaires à deux bras le long du boulevard, panneaux publicitaires, tour de télécommunication de l'échangeur de Limete
  function decor(N,scene){
    const mat=new THREE.MeshLambertMaterial({color:0xb8bec6}),pos=[],pan=[];
    N.segs.forEach(s=>{if(s.c!=='a'||s.y0>1||s.l<8)return;const dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l;for(let t=6;t<s.l;t+=55){const o=s.w/2+1.2;pos.push([s.x0+dx*t+dz*o,s.z0+dz*t-dx*o,Math.atan2(dz,-dx)]);if(Math.random()<.18)pan.push([s.x0+dx*t-dz*(o+3),s.z0+dz*t+dx*(o+3),Math.atan2(dx,dz)])}});
    const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.25,9,.25),mat,Math.max(1,pos.length)),im2=new THREE.InstancedMesh(new THREE.BoxGeometry(5.5,.2,.2),mat,Math.max(1,pos.length)),M4=new THREE.Matrix4(),q=new THREE.Quaternion();
    pos.forEach((p,i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),0);M4.compose(new THREE.Vector3(p[0],4.5,p[1]),q,new THREE.Vector3(1,1,1));im.setMatrixAt(i,M4);q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[2]);M4.compose(new THREE.Vector3(p[0],8.9,p[1]),q,new THREE.Vector3(1,1,1));im2.setMatrixAt(i,M4)});scene.add(im,im2);
    const cols=[0xc0392b,0x2c7fb8,0xe8a23a,0x8e44ad,0x2e9e4a];pan.forEach(p=>{const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(9,5,.3),new THREE.MeshLambertMaterial({color:cols[Math.floor(Math.random()*cols.length)]}));b.position.y=9;g.add(b);const f=new THREE.Mesh(new THREE.BoxGeometry(8,4,.34),new THREE.MeshLambertMaterial({color:0xf2eadb}));f.position.y=9;g.add(f);const m=new THREE.Mesh(new THREE.BoxGeometry(.7,6.5,.7),mat);m.position.y=3.2;g.add(m);g.position.set(p[0],0,p[1]);g.rotation.y=p[2];scene.add(g)});
    const bord=[];N.segs.forEach(sg=>{if(!sg.l4||sg.y0>1||sg.l<6)return;const dx=(sg.x1-sg.x0)/sg.l,dz=(sg.z1-sg.z0)/sg.l;for(let t=2;t<sg.l-2;t+=3.6)[-1,1].forEach(k=>bord.push([sg.x0+dx*t-dz*(sg.w/2+.25)*k,sg.z0+dz*t+dx*(sg.w/2+.25)*k,Math.atan2(dx,dz),bord.length%2]))});
    const bm=new THREE.InstancedMesh(new THREE.BoxGeometry(.5,.25,3.4),new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,bord.length)),cc=new THREE.Color();
    bord.forEach((p,i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),p[2]);M4.compose(new THREE.Vector3(p[0],.15,p[1]),q,new THREE.Vector3(1,1,1));bm.setMatrixAt(i,M4);bm.setColorAt(i,cc.setHex(p[3]?0xd9372b:0xf2f2f2))});scene.add(bm);
    const pa=[];N.segs.forEach(sg=>{if(sg.c==='d'||sg.y0>1||sg.l<10)return;const dx=(sg.x1-sg.x0)/sg.l,dz=(sg.z1-sg.z0)/sg.l;for(let t=5;t<sg.l;t+=70){const o=(sg.w/2+rnd(3,6))*(Math.random()<.5?-1:1);pa.push([sg.x0+dx*t-dz*o,sg.z0+dz*t+dx*o])}});
    const um=new THREE.InstancedMesh(new THREE.ConeGeometry(1.5,.8,8),new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,pa.length)),pc=[0xe74c3c,0xf1c40f,0x3498db,0x2ecc71,0xe67e22,0xffffff];
    pa.forEach((p,i)=>{M4.compose(new THREE.Vector3(p[0],2.3,p[1]),new THREE.Quaternion(),new THREE.Vector3(1,1,1));um.setMatrixAt(i,M4);um.setColorAt(i,cc.setHex(pc[i%pc.length]))});scene.add(um);
    // tour de l'échangeur de Limete (repère à vérifier avec les Kinois) : près du saut-de-mouton de Limete
    const s0=KIN.lieux.find(l=>l.t==='saut'&&Math.abs(l.x-322)<40);if(s0){const t=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(5,70,5),new THREE.MeshLambertMaterial({color:0xb4a58a}));b.position.y=35;t.add(b);[48,56,64].forEach(y=>{const c=new THREE.Mesh(new THREE.BoxGeometry(9,4,9),new THREE.MeshLambertMaterial({color:0xc2b69b}));c.position.y=y;t.add(c)});const an=new THREE.Mesh(new THREE.CylinderGeometry(.3,.5,30,6),new THREE.MeshLambertMaterial({color:0xd8d8d8}));an.position.y=85;t.add(an);t.position.set(s0.x+40,0,s0.z-36);scene.add(t);
      const st=new THREE.Group(),bz=new THREE.MeshLambertMaterial({color:0x8b6b3e});const soc=new THREE.Mesh(new THREE.BoxGeometry(8,2.4,8),new THREE.MeshLambertMaterial({color:0xd9b46b}));soc.position.y=1.2;st.add(soc);const co=new THREE.Mesh(new THREE.CylinderGeometry(.7,.9,5,8),bz);co.position.y=5;st.add(co);const te=new THREE.Mesh(new THREE.SphereGeometry(.7,8,6),bz);te.position.y=8.1;st.add(te);const br=new THREE.Mesh(new THREE.BoxGeometry(.4,2.4,.4),bz);br.position.set(.9,8.8,0);br.rotation.z=-.4;st.add(br);st.position.set(s0.x+20,0,s0.z-36);scene.add(st);const e=etiquette('Tour de l’échangeur','#555');e.position.set(s0.x+40,96,s0.z-36);scene.add(e)}}
  function etiquette(txt,col){
    const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.font='bold 40px system-ui';const w=Math.min(500,g.measureText(txt).width+34);
    g.fillStyle=col||'#1f4e9e';g.fillRect(256-w/2,10,w,70);g.strokeStyle='#fff';g.lineWidth=4;g.strokeRect(256-w/2,10,w,70);g.fillStyle='#fff';g.textAlign='center';g.fillText(txt,256,62);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false}));sp.scale.set(26,4.9,1);return sp}
  // Immeubles : Kinshasa est dense, il y a très peu d'espaces verts. Les immeubles bordent les routes sur 2 rangs et sont SOLIDES (accident).
  const BG=new Map();let NBAT=0;
  // plus grand rayon libre de route autour d'un point (jusqu'à 90 m de jeu)
  function rayonLibre(x,z){const N=reseau(),cx=Math.floor(x/CELL),cz=Math.floor(z/CELL);let m=90;for(let i=-3;i<=3;i++)for(let j=-3;j<=3;j++){const L=N.grid.get((cx+i)+','+(cz+j));if(!L)continue;for(const id of L){const s=N.segs[id],dx=s.x1-s.x0,dz=s.z1-s.z0;let u=((x-s.x0)*dx+(z-s.z0)*dz)/(s.l*s.l);u=cl(u,0,1);const d=Math.hypot(x-s.x0-u*dx,z-s.z0-u*dz)-s.w/2;if(d<m)m=d}}return Math.max(0,m)}
  function surChaussee(x,z,R){const N=reseau(),cx=Math.floor(x/CELL),cz=Math.floor(z/CELL),c=Math.ceil((R+8)/CELL);for(let i=-c;i<=c;i++)for(let j=-c;j<=c;j++){const L=N.grid.get((cx+i)+','+(cz+j));if(!L)continue;for(const id of L){const s=N.segs[id],dx=s.x1-s.x0,dz=s.z1-s.z0;let u=((x-s.x0)*dx+(z-s.z0)*dz)/(s.l*s.l);u=cl(u,0,1);if(Math.hypot(x-s.x0-u*dx,z-s.z0-u*dz)<s.w/2+R)return true}}return false}
  function batiments(N,scene){
    const cols=[0xd9b99b,0xc97b63,0xe8d9a0,0x9bb7a7,0xa7a7c9,0xe3c3a0,0xb9c2c9,0xcfc7b8,0xb88a6a,0xd6a58a],pts=[],cel=new Map(),C=26;
    const libre=(x,z,r)=>{const cx=Math.floor(x/C),cz=Math.floor(z/C);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const L=cel.get((cx+i)+','+(cz+j));if(L)for(const b of L)if(Math.hypot(b.x-x,b.z-z)<b.r+r)return false}return true};
    N.segs.forEach(s=>{if(s.l<8||s.y0>1||s.y1>1||(s.c==='d'&&Math.random()<.4))return;const dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l,rot=Math.atan2(dx,dz);
      for(let t=6;t<s.l-3;t+=rnd(11,17))[-1,1].forEach(k=>[0,1].forEach(row=>{if(pts.length>9000)return;const dep=rnd(8,15),fr=rnd(9,15),o=s.w/2+(s.c==='a'?5:3.6)+dep/2+row*(dep+3)+rnd(0,1.2),x=s.x0+dx*t-dz*o*k,z=s.z0+dz*t+dx*o*k,r=Math.hypot(dep,fr)/2*.78;
        if(surChaussee(x,z,Math.max(dep,fr)*.5+2.2))return;if(EXCL.some(e=>Math.hypot(e[0]-x,e[1]-z)<e[2]))return;if(!libre(x,z,r))return;
        const b={x,z,rot,dep,fr,h:rnd(7,row?18:24),r,col:cols[Math.floor(Math.random()*cols.length)]};pts.push(b);const k2=Math.floor(x/C)+','+Math.floor(z/C);if(!cel.has(k2))cel.set(k2,[]);cel.get(k2).push(b)}))});
    const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,pts.length)),M4=new THREE.Matrix4(),q=new THREE.Quaternion(),c=new THREE.Color();
    const toit=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshLambertMaterial({color:0x6a6a70}),Math.max(1,pts.length));
    pts.forEach((p,i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),p.rot);M4.compose(new THREE.Vector3(p.x,p.h/2,p.z),q,new THREE.Vector3(p.dep,p.h,p.fr));im.setMatrixAt(i,M4);im.setColorAt(i,c.setHex(p.col));
      M4.compose(new THREE.Vector3(p.x,p.h+.25,p.z),q,new THREE.Vector3(p.dep+.4,.5,p.fr+.4));toit.setMatrixAt(i,M4);
      const k2=Math.floor(p.x/30)+','+Math.floor(p.z/30);if(!BG.has(k2))BG.set(k2,[]);BG.get(k2).push(p)});
    BG.clear();pts.forEach(p=>{const k2=Math.floor(p.x/30)+','+Math.floor(p.z/30);if(!BG.has(k2))BG.set(k2,[]);BG.get(k2).push(p)});
    scene.add(im,toit);NBAT=pts.length;return pts.length}
  // collision avec les immeubles : renvoie la position corrigée, ou null s'il n'y a pas de choc
  function heurteImmeuble(x,z,rv){
    const cx=Math.floor(x/30),cz=Math.floor(z/30);
    for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const L=BG.get((cx+i)+','+(cz+j));if(!L)continue;
      for(const b of L){const dx=x-b.x,dz=z-b.z;if(dx*dx+dz*dz>(b.r+rv+8)*(b.r+rv+8))continue;const c=Math.cos(b.rot),s=Math.sin(b.rot),lx=dx*c-dz*s,lz=dx*s+dz*c,hx=b.dep/2+rv,hz=b.fr/2+rv;
        if(Math.abs(lx)<hx&&Math.abs(lz)<hz){const px=hx-Math.abs(lx),pz=hz-Math.abs(lz);let nx=lx,nz=lz;if(px<pz)nx=Math.sign(lx||1)*hx;else nz=Math.sign(lz||1)*hz;return [b.x+nx*c+nz*s,b.z-nx*s+nz*c]}}}
    return null}
  function nidsDePoule(N,scene){
    const list=[],ss=N.segs.filter(s=>s.c!=='a'&&s.y0<1&&s.l>8);
    for(let i=0;i<150;i++){const s=ss[Math.floor(Math.random()*ss.length)],t=Math.random(),o=rnd(-.3,.3)*s.w;const dx=(s.x1-s.x0)/s.l,dz=(s.z1-s.z0)/s.l;list.push({x:s.x0+(s.x1-s.x0)*t-dz*o,z:s.z0+(s.z1-s.z0)*t+dx*o})}
    const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(1.2,1.2,.05,10),new THREE.MeshBasicMaterial({color:0x151a22}),list.length),M4=new THREE.Matrix4();
    list.forEach((p,i)=>{M4.setPosition(p.x,.12,p.z);im.setMatrixAt(i,M4)});scene.add(im);return list}
  function postes(N){ // contrôles routiers : répartis sur le boulevard Lumumba
    const L=N.segs.filter(s=>N.roads[s.r].n==='Boulevard Lumumba'&&s.y0<1&&s.l>10),out=[];if(!L.length)return out;
    L.sort((a,b)=>a.x0-b.x0);for(let k=0;k<7;k++){const s=L[Math.floor((k+.5)/7*L.length)];out.push({x:(s.x0+s.x1)/2,z:(s.z0+s.z1)/2,fait:false})}return out}

  // ---------- véhicules : modèles soignés dans src/taxi/vehicules.js
  const protos={};   // un seul modèle par type et par couleur : les copies partagent les formes 3D (démarrage plus rapide)
  const modele=(type,col)=>{const t=type==='car'?'berline':type==='taxi'?'berline':type,k=t+'|'+col;if(!protos[k])protos[k]=creerVehicule(t,col,{taxi:true});return protos[k].clone(true)};


  // ---------- lieux réels (OpenStreetMap) : stades, édifices, marchés, arrêts, étiquettes
  const miniC={};
  function mini(txt,col){const k=txt+col;if(miniC[k])return miniC[k];const c=document.createElement('canvas');c.width=256;c.height=52;const g=c.getContext('2d');g.font='bold 24px system-ui';const w=Math.min(250,g.measureText(txt).width+22);g.fillStyle=col;g.fillRect(128-w/2,4,w,44);g.strokeStyle='#fff';g.lineWidth=3;g.strokeRect(128-w/2,4,w,44);g.fillStyle='#fff';g.textAlign='center';g.fillText(txt.slice(0,22),128,36);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false,transparent:true}));sp.scale.set(20,4.1,1);return miniC[k]=sp}
  function modeleDe(p){const n=p.n;if(p.t==='poi_stade')return ['stade',.5];if(/Palais du Peuple/i.test(n))return ['palais',.5];if(/Mus[ée]e/i.test(n))return ['musee',.7];if(/Cath[ée]drale/i.test(n))return ['cathedrale',.8];
    if(/RTNC/i.test(n))return ['tour',1];if(p.t==='poi_edifice')return ['gouvernement',.5];if(p.t==='poi_camp')return ['institut',.7];if(p.t==='poi_gare')return ['institut',.6];return null}
  function lieux3d(N,scene){
    const arb=[],etiq=[];
    N.lieux.forEach(p=>{if(!p.t.startsWith('poi_'))return;const m=modeleDe(p);
      if(m){const f=rayonLibre(p.x,p.z);if(f>9){const g=m[0]==='tour'?tourRTNC():BAT[m[0]]&&(()=>{const o=new THREE.Group();BAT[m[0]](o);return o})();if(g){const sc=Math.min(m[1],Math.max(.25,f/(m[0]==='stade'?40:m[0]==='palais'?50:28)));g.scale.setScalar(sc);g.position.set(p.x,0,p.z);scene.add(g);EXCL.push([p.x,p.z,(m[0]==='stade'?40:30)*sc+3]);
        // façade tournée vers la route la plus proche
        const q=proche(p.x,p.z,60,0);if(q)g.rotation.y=Math.atan2(q.px-p.x,q.pz-p.z)}}}
      if(p.t==='poi_marche'){for(let i=0;i<7;i++)arb.push([p.x+rnd(-9,9),p.z+rnd(-9,9)]);EXCL.push([p.x,p.z,12])}
      const e=mini(p.n,p.t==='poi_marche'?'#b8581c':p.t==='poi_stade'?'#2e7d32':p.t==='poi_gare'?'#555':p.t==='poi_camp'?'#4a5a2a':'#7a3b1f');e.position.set(p.x,p.t==='poi_marche'?8:16,p.z);e.visible=false;scene.add(e);etiq.push(e)});
    // marchés : parasols colorés
    const pc=[0xe74c3c,0xf1c40f,0x3498db,0x2ecc71,0xe67e22,0xffffff],um=new THREE.InstancedMesh(new THREE.ConeGeometry(1.6,.9,8),new THREE.MeshLambertMaterial({color:0xffffff}),Math.max(1,arb.length)),M4=new THREE.Matrix4(),cc=new THREE.Color();
    arb.forEach((p,i)=>{M4.setPosition(p[0],2.4,p[1]);um.setMatrixAt(i,M4);um.setColorAt(i,cc.setHex(pc[i%pc.length]))});scene.add(um);
    // arrêts de bus : abribus au bord de la route, avec leur nom
    const ar=KIN.arrets||[],ab=new THREE.InstancedMesh(new THREE.BoxGeometry(3.4,.2,1.6),new THREE.MeshLambertMaterial({color:0x2a6fd0}),Math.max(1,ar.length)),ap=new THREE.InstancedMesh(new THREE.BoxGeometry(.2,2.4,.2),new THREE.MeshLambertMaterial({color:0x666a70}),Math.max(1,ar.length*2));
    const arrets=[];ar.forEach((a,i)=>{const q=proche(a[1],a[2],40,0);let x=a[1],z=a[2],rot=0;if(q){const dx=(q.s.x1-q.s.x0)/q.s.l,dz=(q.s.z1-q.s.z0)/q.s.l,side=((x-q.px)*-dz+(z-q.pz)*dx)>=0?1:-1,o=q.s.w/2+2.4;x=q.px-dz*o*side;z=q.pz+dx*o*side;rot=Math.atan2(dx,dz)}
      const Q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),rot);M4.compose(new THREE.Vector3(x,2.5,z),Q,new THREE.Vector3(1,1,1));ab.setMatrixAt(i,M4);
      [-1.5,1.5].forEach((d,k)=>{M4.compose(new THREE.Vector3(x+Math.cos(rot)*d,1.2,z-Math.sin(rot)*d),Q,new THREE.Vector3(1,1,1));ap.setMatrixAt(i*2+k,M4)});arrets.push({n:a[0],x,z,k:a[3]})});
    scene.add(ab,ap);return {etiq,arrets}}
  function tourRTNC(){const t=new THREE.Group(),m=new THREE.MeshLambertMaterial({color:0xcfd3d6});const b=new THREE.Mesh(new THREE.CylinderGeometry(2.6,3.4,64,10),m);b.position.y=32;t.add(b);const c=new THREE.Mesh(new THREE.CylinderGeometry(5.4,3.6,6,10),new THREE.MeshLambertMaterial({color:0xb4a58a}));c.position.y=50;t.add(c);const an=new THREE.Mesh(new THREE.CylinderGeometry(.2,.4,28,6),m);an.position.y=78;t.add(an);return t}
  // robots : feux réels de la carte + grands carrefours calculés + grands ronds-points
  function pointsRobots(N){
    const L=[],ajoute=(x,z,w)=>{if(L.length>=48||L.some(p=>Math.hypot(p.x-x,p.z-z)<35))return;const q=proche(x,z,40,0);if(!q||q.s.y0>1)return;L.push({x:q.px,z:q.pz,ax:(q.s.x1-q.s.x0)/q.s.l,az:(q.s.z1-q.s.z0)/q.s.l,w:Math.min(14,q.s.w+2)})};
    (KIN.feux||[]).forEach(f=>ajoute(f[0],f[1]));(KIN.carrefours||[]).forEach(c=>ajoute(c.x,c.z));
    ['Rond-Point Ngaba','Place de la Gare','Place du Marché Central','Rond-point Moulaert','Place de la République','Pont N’djili','Rond-Point Ezo','Place de l’Échangeur'].forEach(n=>{const l=N.lieux.find(q=>q.n===n);if(l)ajoute(l.x,l.z)});
    return L}

  // ---------- ouverture / fermeture
  function ouvrir(){
    fermer(true);
    ov=document.createElement('div');ov.id='taxiov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#0e1a22;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:6px;padding:6px 8px;background:linear-gradient(90deg,#b8860b,#e8a23a);flex:0 0 auto"><b style="flex:1;font-size:14px;color:#222">🚕 BOYEKOLI TAXI · Kinshasa</b></div>
    <div id="tx3d" style="flex:1;position:relative;min-height:0"></div>
    <div id="txpan" style="position:absolute;inset:0;background:rgba(8,16,22,.97);display:flex;flex-direction:column;padding:12px;overflow:auto;z-index:5"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'taxiRetour()'});const rb=$('sortieRapide');if(rb)rb.style.cssText+=';top:150px;left:8px;bottom:auto;right:auto;transform:none;padding:8px 12px;font-size:14px';menu()}
  function fermer(silence){
    cancelAnimationFrame(raf);raf=0;if(kd){window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);kd=ku=null}keys={};
    if(R){try{R.rend.dispose();R.rend.forceContextLoss&&R.rend.forceContextLoss();R.scene.traverse(o=>{if(o.geometry)o.geometry.dispose()})}catch(e){}R=null}
    S=null;try{PAR.cacher()}catch(e){}if(ov){ov.remove();ov=null}if(!silence)refreshHud&&refreshHud()}
  const panel=h=>{const p=$('txpan');if(p){p.innerHTML=h;p.style.display='flex'}};
  const cacherPanel=()=>{const p=$('txpan');if(p)p.style.display='none'};

  // ---------- menu
  function menu(){
    S=null;cancelAnimationFrame(raf);const t=T();let h=`<h3 style="margin:2px 0">Choisis ta mission</h3><p style="font-size:13px;opacity:.9;margin:2px 0 6px">Conduis sur les vraies routes de Kinshasa : le <b>boulevard Lumumba</b>, ses passerelles, ses sauts-de-mouton, ses embouteillages et ses contrôles. Mais surtout : <b>respecte tes contrats</b> !</p>
    <div style="background:#16303d;border-radius:12px;padding:8px;font-size:13px">⭐ Ta réputation de chauffeur : <b>${Math.round(t.rep)}</b> / 100 ${t.cert?' · 🏅 Chauffeur exemplaire':''}</div>`;
    ['moto','taxi','bus'].forEach(m=>{const V=VEHICULES[m];h+=`<div style="margin-top:8px;font-weight:700">${V.ico} ${V.nom}</div><div style="font-size:12px;opacity:.85">${V.desc}</div>`;
      MISSIONS.filter(x=>x.mode===m).forEach(x=>{const st=t.done[x.id]||0;h+=btn(`${'⭐'.repeat(st)||'▶'} ${esc(x.titre)} <span style="font-weight:400;font-size:12px">· ${esc(x.de)} → ${esc(x.a)} · ${x.prix} FC</span>`,`taxiMission('${x.id}')`,st?'#2e7d32':'#2f5a6b','display:block;width:100%;text-align:left')})});
    h+=btn('🚗 Conduite libre dans Kinshasa','taxiLibre()','#2c7fb8','display:block;width:100%')+`<p style="font-size:12px;opacity:.8;margin-top:8px">💡 ${esc(CONSEILS[Math.floor(Math.random()*CONSEILS.length)])}</p><p style="font-size:11px;opacity:.6">Carte : © contributeurs OpenStreetMap (licence ODbL). Montants en FC de simulation.</p>`;panel(h)}

  // ---------- démarrage d'une partie
  function lieuDe(n){return reseau().lieux.find(l=>l.n===n)}
  function demarrer(mid){
    const TM=[performance.now()];
    const N=reseau(),M=mid?MISSIONS.find(m=>m.id===mid):null,V=VEHICULES[M?M.mode:'taxi'];
    if(!R){const W=$('tx3d'),rend=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
      rend.setPixelRatio(Math.min(window.devicePixelRatio||1,low?1:1.5));rend.setSize(W.clientWidth,W.clientHeight);W.appendChild(rend.domElement);rend.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
      const scene=new THREE.Scene();scene.background=new THREE.Color(0xa9cfe8);scene.fog=new THREE.Fog(0xa9cfe8,170,520);
      scene.add(new THREE.HemisphereLight(0xffffff,0x8a8a6a,1.7));const sun=new THREE.DirectionalLight(0xfff4d6,1.3);sun.position.set(80,140,60);scene.add(sun);
      const sol=new THREE.Mesh(new THREE.PlaneGeometry(9000,6000),new THREE.MeshLambertMaterial({color:0xa9a08c}));sol.rotation.x=-Math.PI/2;sol.position.y=-.02;scene.add(sol);
      const tm=[performance.now()];bandes(N,scene);tm.push(performance.now());const pass=passerelles(N,scene);tm.push(performance.now());const KL=lieux3d(N,scene);tm.push(performance.now());batiments(N,scene);tm.push(performance.now());decor(N,scene);panneauxRoute(N,scene);tm.push(performance.now());window.__TXTM=tm.map((v,i)=>i?Math.round(v-tm[i-1]):0);
      const rp=pointsRobots(N);
      const rob=robots(scene,rp);const nids=nidsDePoule(N,scene);
      N.lieux.forEach(l=>{const s=etiquette(l.n,l.t==='pont'?'#7a4b2a':l.t==='aero'?'#1b6ca8':'#1f4e9e');s.position.set(l.x,l.t==='pont'?9:12,l.z);scene.add(s);
        if(l.t==='rond'){const c=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.5,14),new THREE.MeshLambertMaterial({color:0x4f9c3c}));c.position.set(l.x,.3,l.z);scene.add(c)}});
      const cam=new THREE.PerspectiveCamera(62,W.clientWidth/W.clientHeight,1.4,900);
      R={rend,scene,cam,pass,nids,postes:postes(N),W,robots:rob,etiq:KL.etiq,arrets:KL.arrets};
      const mm=document.createElement('canvas');mm.width=170;mm.height=104;mm.id='txmm';mm.style.cssText='position:absolute;right:6px;top:84px;border:2px solid #fff6;border-radius:8px;background:#1a2a1acc;z-index:6';ov.appendChild(mm);R.mm=mm;
      // fond de la mini-carte
      const bg=document.createElement('canvas');bg.width=170;bg.height=104;const g=bg.getContext('2d');R.mx=x=>(x+2200)/4500*170;R.mz=z=>(z+1350)/2700*104;
      g.strokeStyle='#cfd6dd';N.roads.forEach(r=>{g.lineWidth=r.c==='a'?2:r.c==='b'?1.3:.6;g.beginPath();for(let i=0;i<r.p.length;i+=2){const x=R.mx(r.p[i]),y=R.mz(r.p[i+1]);i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()});R.bg=bg}
    TM.push(performance.now());
    // éléments dynamiques
    R.dyn&&R.dyn.forEach(o=>R.scene.remove(o));R.dyn=[];
    const coul=M?(M.mode==='moto'?'#d13b3b':M.mode==='bus'?'#f0c000':'#f0c000'):'#2c7fb8',car=modele(M?M.mode:'taxi',coul);R.scene.add(car);R.dyn.push(car);
    // position de départ : sur la route proche du lieu de prise en charge, un peu avant
    const l0=M?lieuDe(M.de):{x:0,z:0},p0=proche(l0.x,l0.z,300,0)||proche(0,0,3000,0),dx=(p0.s.x1-p0.s.x0)/p0.s.l,dz=(p0.s.z1-p0.s.z0)/p0.s.l;
    S={mode:M?M.mode:'taxi',V,M,x:p0.px-dx*(M?50:0),z:p0.pz-dz*(M?50:0),h:Math.atan2(dx,dz),v:0,y:p0.y,steer:0,deg:0,rep:T().rep,t0:performance.now(),car,ai:[],pi:[],bon:0,mau:0,evt:{},phase:0,pts:[],pass:0,gain:0,paus:false,stop:0,fait:false,msg:'',vit:0,pdone:{},texte:''};
    S.h=Math.atan2(dx,dz);
    if(M){const ids=[M.de,...(M.arrets||[]),M.a];S.pts=ids.map((n,i)=>({l:lieuDe(n),n,k:i===ids.length-1?'depose':'prise',pax:M.mode==='bus'?(i===0?4:3):1}));
      R.postes.forEach(p=>p.fait=false);S.evt=Object.fromEntries((M.ev||[]).map(e=>[e,false]))}
    // marqueur d'objectif
    const mk=new THREE.Group(),ring=new THREE.Mesh(new THREE.TorusGeometry(7,.5,8,28),new THREE.MeshBasicMaterial({color:0xffd23a}));ring.rotation.x=Math.PI/2;ring.position.y=.6;mk.add(ring);
    const beam=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,40,8),new THREE.MeshBasicMaterial({color:0xffd23a,transparent:true,opacity:.45}));beam.position.y=20;mk.add(beam);R.scene.add(mk);R.dyn.push(mk);S.mk=mk;
    // circulation : voitures, taxis-bus (qui s'arrêtent n'importe où), motos, piétons
    const segs=N.segs.filter(s=>s.c!=='d'&&s.l>20&&s.y0<1);
    const place=(o)=>{for(let k=0;k<30;k++){const s=segs[Math.floor(Math.random()*segs.length)],t=Math.random(),x=s.x0+(s.x1-s.x0)*t,z=s.z0+(s.z1-s.z0)*t;const d=Math.hypot(x-S.x,z-S.z);if(d>110&&d<380){o.s=s;o.t=t;o.dir=N.roads[s.r].o===1?1:(Math.random()<.5?1:-1);o.lane=Math.floor(Math.random()*4);o.stop=0;return}}o.s=segs[0];o.t=.5;o.dir=1;o.lane=1};
    ['car','car','car','car','car','car','jeep','jeep','bus','bus','bus','bus','moto','moto','moto','moto','moto','tvs','tvs','tvs','tvs','camion','camion','car','bus','moto'].forEach((ty,i)=>{const cols=[0xe8c020,0xc0392b,0x2c7fb8,0xdddddd,0x2e9e4a,0x8e44ad],m=modele(ty,cols[i%cols.length]);R.scene.add(m);R.dyn.push(m);const o={ty,m,v:ty==='moto'?rnd(14,22):ty==='tvs'?rnd(11,16):ty==='bus'?rnd(8,13):ty==='camion'?rnd(7,10):rnd(10,17),pause:0,fou:ty==='moto'||ty==='tvs'||ty==='bus'?rnd(.5,1):ty==='jeep'?.3:0,ph:Math.random()*6};place(o);S.ai.push(o)});
    for(let i=0;i<10;i++){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,1.6,6),new THREE.MeshLambertMaterial({color:[0xe74c3c,0x3498db,0xf1c40f,0x2ecc71][i%4]}));b.position.y=.9;g.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),new THREE.MeshLambertMaterial({color:0x6b4a32}));h.position.y=1.9;g.add(h);R.scene.add(g);R.dyn.push(g);
      const o={m:g,ph:Math.random()*6,s:null};place(o);S.pi.push(o)}
    TM.push(performance.now());
    // commandes
    commandes();cacherPanel();window.__TXTM2=TM.concat([performance.now()]).map((v,i,a)=>i?Math.round(v-a[i-1]):0);
    if(!kd){kd=e=>{keys[e.key.toLowerCase()]=1};ku=e=>{keys[e.key.toLowerCase()]=0};window.addEventListener('keydown',kd);window.addEventListener('keyup',ku)}
    if(M){PAR.dire(M.intro,M.voix);msg('🚕 '+M.titre+' : rends-toi à '+S.pts[0].n,6000)}else msg('Conduite libre : explore Kinshasa !',4000);
    cancelAnimationFrame(raf);let last=performance.now();const boucle=now=>{if(!S||!ov)return;const dt=Math.min(.05,(now-last)/1000);last=now;try{tick(dt)}catch(e){console.error(e)}raf=requestAnimationFrame(boucle)};raf=requestAnimationFrame(boucle)}
  function msg(t,ms){const m=$('txmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3500)}

  // ---------- commandes : volant à la place du joystick, pédales à droite
  function commandes(){
    ['txhud','txvol','txped'].forEach(i=>{const e=$(i);if(e)e.remove()});
    const hud=document.createElement('div');hud.id='txhud';hud.style.cssText='position:absolute;left:0;right:0;top:46px;padding:4px 8px;z-index:6;pointer-events:none;font-size:13px;text-shadow:0 1px 3px #000';ov.appendChild(hud);
    const m=document.createElement('div');m.id='txmsg';m.style.cssText='position:absolute;left:8px;right:8px;top:170px;background:rgba(10,24,30,.92);padding:7px 10px;border-radius:10px;font-size:13px;display:none;z-index:7';ov.appendChild(m);
    const vol=document.createElement('div');vol.id='txvol';vol.style.cssText='position:absolute;left:14px;bottom:max(18px,env(safe-area-inset-bottom));width:132px;height:132px;border-radius:50%;border:10px solid #2b2b2b;background:radial-gradient(circle,#555 0 18%,#222 19% 100%);z-index:6;touch-action:none;box-shadow:0 0 0 3px #fff5';
    vol.innerHTML='<div style="position:absolute;left:50%;top:6px;width:10px;height:26px;margin-left:-5px;background:#e8a23a;border-radius:5px"></div><div style="position:absolute;left:4px;right:4px;top:50%;height:10px;margin-top:-5px;background:#333"></div>';
    let sx=null,id=null;const pos=e=>{if(!S)return;const r=vol.getBoundingClientRect();S.steerIn=cl((e.clientX-(r.left+r.width/2))/(r.width*.3),-1,1);vol.style.transform=`rotate(${S.steerIn*90}deg)`};
    vol.addEventListener('pointerdown',e=>{e.preventDefault();sx=e.clientX;id=e.pointerId;try{vol.setPointerCapture(id)}catch(x){}pos(e)});vol.addEventListener('pointermove',e=>{if(e.pointerId===id&&sx!==null){e.preventDefault();pos(e)}});
    const fin=()=>{sx=null;if(S)S.steerIn=0;vol.style.transform=''};vol.addEventListener('pointerup',fin);vol.addEventListener('pointercancel',fin);vol.addEventListener('lostpointercapture',fin);vol.addEventListener('contextmenu',e=>e.preventDefault());ov.appendChild(vol);
    const lacher=()=>{fin();if(S){S.gas=0;S.brk=0}};['touchend','touchcancel'].forEach(ev=>ov.addEventListener(ev,e=>{if(!e.touches||e.touches.length===0)lacher()}));ov.addEventListener('pointercancel',lacher);window.addEventListener('blur',lacher);
    const ped=document.createElement('div');ped.id='txped';ped.style.cssText='position:absolute;right:12px;bottom:max(18px,env(safe-area-inset-bottom));display:flex;gap:10px;align-items:flex-end;z-index:6';
    const b=(t,bg,w,h,k)=>`<div data-k="${k}" style="width:${w}px;height:${h}px;border-radius:18px;background:${bg};border:3px solid #fff7;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;touch-action:none;user-select:none">${t}</div>`;
    ped.innerHTML=b('📯','#7a5a1e',58,58,'h')+b('■','#a33',70,86,'f')+b('▲','#2e8a3e',86,120,'g');ov.appendChild(ped);
    ped.querySelectorAll('[data-k]').forEach(e=>{const k=e.dataset.k;const on=ev=>{ev.preventDefault();if(!S)return;if(k==='g')S.gas=1;if(k==='f')S.brk=1;if(k==='h')klaxon()},off=()=>{if(!S)return;if(k==='g')S.gas=0;if(k==='f')S.brk=0};
      e.addEventListener('pointerdown',on);e.addEventListener('pointerup',off);e.addEventListener('pointercancel',off);e.addEventListener('pointerleave',off)});
    const fl=document.createElement('div');fl.id='txfl';fl.style.cssText='position:absolute;left:50%;top:128px;margin-left:-22px;width:44px;height:44px;z-index:6;pointer-events:none;font-size:34px;text-align:center;line-height:44px';fl.textContent='⬆';ov.appendChild(fl)}
  function klaxon(){try{SFX.horn?SFX.horn():SFX.ok&&SFX.ok()}catch(e){}if(S)S.klax=1}

  // ---------- boucle de jeu
  function tick(dt){
    const V=S.V,N=reseau();const now2=performance.now()/1000;
    if(S.paus){rendre();return}
    // commandes
    const gas=S.gas||keys['arrowup']||keys['w']||keys['z'],brk=S.brk||keys['arrowdown']||keys['s']||keys[' '],kl=(keys['arrowleft']||keys['a']||keys['q'])?-1:(keys['arrowright']||keys['d'])?1:0;
    const target=cl((S.steerIn||0)+kl,-1,1);S.steer+=(target-S.steer)*Math.min(1,dt*14);
    const pr=surRoute(S.x,S.z,S.y),sol=pr?1:(S.mode==='moto'?.6:.4);
    const vmax=V.vmax*sol*(S.pluie?.8:1);
    if(gas)S.v+=V.acc*dt;else S.v-=Math.sign(S.v)*Math.min(Math.abs(S.v),5*dt);
    if(brk)S.v-=V.frein*dt*(S.v>0?1:.4);if(S.v>vmax)S.v-=(S.v-vmax)*Math.min(1,dt*3);S.v=cl(S.v,-6,V.vmax);
    S.h-=S.steer*Math.min(1,Math.abs(S.v)/4)*Math.sign(S.v||1)*dt*(S.mode==='moto'?2.5:S.mode==='bus'?1.7:2.1)*(S.pluie&&Math.abs(S.v)>18?1.25:1);
    S.x+=Math.sin(S.h)*S.v*dt;S.z+=Math.cos(S.h)*S.v*dt;
    const p2=surRoute(S.x,S.z,S.y),yt=p2?p2.y:0;S.y+=(yt-S.y)*Math.min(1,dt*6);
    if(S.y<2){const hb=heurteImmeuble(S.x,S.z,S.mode==='moto'?.7:S.mode==='bus'?1.7:1.2);if(hb){S.x=hb[0];S.z=hb[1];if(Math.abs(S.v)>3&&(!S.hbT||now2-S.hbT>1.2)){S.hbT=now2;S.mau++;S.rep=cl(S.rep-2,0,100);choc(Math.abs(S.v)*.8+8,'💥 Accident ! Tu as heurté un immeuble. Reste sur la route.')}S.v*=.15}}
    // sécurité : ne pas sortir de la carte
    S.x=cl(S.x,-2400,2400);S.z=cl(S.z,-1500,1500);
    // circulation
    const dirOf=s=>[(s.x1-s.x0)/s.l,(s.z1-s.z0)/s.l];
    // Circulation : on roule À DROITE, chacun dans sa voie et dans le bon sens (les chaussées à sens unique sont respectées).
    // Le désordre n'apparaît que dans les embouteillages : motos, TVS et minibus se faufilent entre les voies.
    const ROADS=N.roads;if(!N.rs)N.rs=N.segs.filter(c=>c.c!=='d'&&c.l>20&&c.y0<1);
    const lat=(o,s,jam)=>{const ow=ROADS[s.r].o===1,base=s.l4?(o.lane-1.5)*3.1:ow?((o.lane%2)?1:-1)*s.w*.17:s.w*.22;return base+(jam&&o.fou?Math.sin(now2*1.3+o.ph)*o.fou*2.2:0)};
    const respawn=o=>{for(let k=0;k<40;k++){const c=N.rs[Math.floor(Math.random()*N.rs.length)],t=Math.random(),x=c.x0+(c.x1-c.x0)*t,z=c.z0+(c.z1-c.z0)*t,d=Math.hypot(x-S.x,z-S.z);if(d>150&&d<420){o.s=c;o.t=t;o.dir=ROADS[c.r].o===1?1:(Math.random()<.5?1:-1);o.lane=Math.floor(Math.random()*4);return}}};
    S.ai.forEach(o=>{
      if(o.pause>0){o.pause-=dt}else{
        const s=o.s,[dx,dz]=dirOf(s),sp=o.v;let bloque=false,jam=false;const L=lat(o,s,o.jam),lx=-dz*L*o.dir,lz=dx*L*o.dir;
        const ax=s.x0+(s.x1-s.x0)*o.t+lx,az=s.z0+(s.z1-s.z0)*o.t+lz,fx=dx*o.dir,fz=dz*o.dir;
        const rx=S.x-ax,rz=S.z-az,dd=rx*fx+rz*fz,lt=Math.abs(rx*-fz+rz*fx);if(dd>0&&dd<9&&lt<2.4){bloque=true;jam=true}
        S.ai.forEach(q=>{if(q!==o&&!bloque){const qx=q.m.position.x-ax,qz=q.m.position.z-az,d2=qx*fx+qz*fz,l2=Math.abs(qx*-fz+qz*fx);if(d2>0&&d2<8&&l2<2.2){bloque=true;jam=true}}});
        o.jam=jam;      // embouteillage : le désordre commence
        R.robots.forEach(rb=>{if(bloque)return;const vx=rb.x-ax,vz=rb.z-az,d3=vx*fx+vz*fz;if(d3>2&&d3<17&&Math.abs(vx*-fz+vz*fx)<13){const al=Math.abs(fx*rb.ax+fz*rb.az)>.7?0:1,e=etatRobot(rb,now2)[al];if(e!=='v')bloque=true}});
        if((o.ty==='bus'||o.ty==='tvs')&&!bloque&&Math.random()<dt*(o.ty==='bus'?.08:.04)){o.pause=rnd(2,4.5)}   // le taxi-bus s'arrête pour charger, n'importe où
        if(!bloque){o.t+=o.dir*sp*dt/s.l;if(o.t>1||o.t<0){
            const fin=o.t>1;o.t=cl(o.t,0,1);const nx=fin?s.x1:s.x0,nz=fin?s.z1:s.z0,g=N.grid.get(Math.floor(nx/CELL)+','+Math.floor(nz/CELL))||[],cand=[];
            for(const id of g){const c=N.segs[id];if(c===s||c.c==='d')continue;if(Math.abs(c.y0-(fin?s.y1:s.y0))>1.5&&Math.abs(c.y1-(fin?s.y1:s.y0))>1.5)continue;const cow=ROADS[c.r].o===1;
              if(Math.hypot(c.x0-nx,c.z0-nz)<.3)cand.push({c,t:0,dir:1});else if(!cow&&Math.hypot(c.x1-nx,c.z1-nz)<.3)cand.push({c,t:1,dir:-1})}
            const mm=cand.filter(q=>q.c.r===s.r),ch=(mm.length?mm:cand);
            if(ch.length){const q=ch[Math.floor(Math.random()*ch.length)];o.s=q.c;o.t=q.t;o.dir=q.dir}
            else if(ROADS[s.r].o===1)respawn(o);                  // sens unique sans suite : on repart ailleurs, jamais à contresens
            else{o.dir*=-1}}}
      }
      const s=o.s,[dx,dz]=dirOf(s),L=lat(o,s,o.jam),lx=-dz*L*o.dir,lz=dx*L*o.dir;o.m.position.set(s.x0+(s.x1-s.x0)*o.t+lx,s.y0+(s.y1-s.y0)*o.t,s.z0+(s.z1-s.z0)*o.t+lz);o.m.rotation.y=Math.atan2(dx*o.dir,dz*o.dir);
      const dp=Math.hypot(o.m.position.x-S.x,o.m.position.z-S.z);
      if(dp>520)respawn(o);
      if(o.fou>.6&&dp<9&&dp>3&&Math.abs(S.v)>8&&!o.cut){o.cut=1;if(!S.cutMsg||now2-S.cutMsg>18){S.cutMsg=now2;msg(o.ty==='tvs'?'🛺 Un TVS te coupe la route ! Garde tes distances et reste calme.':o.ty==='moto'?'🏍 Une moto te double dans l’embouteillage !':'🚌 Le minibus s’arrête sans prévenir ! Anticipe.',3200)}setTimeout(()=>o.cut=0,4000)}
      // choc
      if(dp<(S.mode==='bus'?3.6:2.8)&&Math.abs(S.y-o.m.position.y)<2.5&&!o.choc){o.choc=1;choc(Math.abs(S.v)*.5+4,'🚗 Accrochage !');S.v*=.25;setTimeout(()=>o.choc=0,1500)}});
    S.pi.forEach(o=>{ // piétons qui traversent
      if(!o.s||Math.random()<.0005){const segs=N.segs.filter(c=>c.c!=='d'&&c.l>20&&c.y0<1);for(let k=0;k<30;k++){const c=segs[Math.floor(Math.random()*segs.length)],t=Math.random(),x=c.x0+(c.x1-c.x0)*t,z=c.z0+(c.z1-c.z0)*t,d=Math.hypot(x-S.x,z-S.z);if(d>40&&d<300){o.s=c;o.t=t;break}}}
      const s=o.s,[dx,dz]=dirOf(s);o.ph+=dt*.4;const u=(Math.sin(o.ph)*.5+.5),w=s.w/2+2.5,nx=-dz,nz=dx;
      o.m.position.set(s.x0+(s.x1-s.x0)*o.t+nx*(-w+2*w*u),s.y0,s.z0+(s.z1-s.z0)*o.t+nz*(-w+2*w*u));
      if(Math.hypot(o.m.position.x-S.x,o.m.position.z-S.z)<1.8&&Math.abs(S.v)>3&&!o.choc){o.choc=1;choc(30,'🚶 Piéton touché ! Ralentis toujours aux abords des piétons.');S.v=0;S.rep=cl(S.rep-8,0,100);setTimeout(()=>o.choc=0,3000)}});
    // nids-de-poule
    R.nids.forEach(n=>{if(!n.on&&Math.hypot(n.x-S.x,n.z-S.z)<2.3&&S.y<1.5&&Math.abs(S.v)>4){n.on=1;choc(6,'🕳 Nid-de-poule !');S.v*=.45;setTimeout(()=>n.on=0,2500)}});
    // robots (feux rouges)
    majRobots(R.robots,now2);R.robots.forEach(rb=>{const d=Math.hypot(rb.x-S.x,rb.z-S.z);if(d<30&&Math.abs(S.v)>1){const fx=Math.sin(S.h),fz=Math.cos(S.h),al=Math.abs(fx*rb.ax+fz*rb.az)>.7?0:1,e=etatRobot(rb,now2)[al];if(e==='r'&&d<26&&d>12&&(!S.rmsg||now2-S.rmsg>9)){S.rmsg=now2;msg('🚦 Le robot est rouge : arrête-toi !',2500)}
      if(e==='r'&&d<7&&Math.abs(S.v)>6&&(!rb.pen||now2-rb.pen>8)){rb.pen=now2;S.mau++;S.rep=cl(S.rep-6,0,100);choc(4,'🚦 Feu rouge brûlé ! Au robot rouge, on s’arrête : c’est la loi et la sécurité de tous.')}}});
    // passerelles : conseil
    R.pass.forEach(p=>{if(!p.vu&&Math.hypot(p.x-S.x,p.z-S.z)<14&&S.y<1.5){p.vu=1;if(!S.cons){S.cons=1;msg('🌉 Passerelle : elle protège les piétons. Ne t’arrête jamais dessous pour charger un client !',5000)}}});
    // objectifs
    if(S.M)objectifs(dt);
    // contrôles routiers
    if(S.M&&S.evt.police===false)R.postes.forEach(p=>{if(p.fait)return;const d=Math.hypot(p.x-S.x,p.z-S.z);if(d<40&&!p.vu){p.vu=1;msg('🚓 Contrôle routier devant : arrête-toi à la demande de l’agent.',3500)}
      if(d<10){if(Math.abs(S.v)<3){p.fait=true;S.evt.police=true;evenement('police')}else if(d<6&&S.v>8){p.fait=true;S.mau++;S.rep=cl(S.rep-6,0,100);msg('🚓 Tu n’as pas obéi à l’agent : refus d’obtempérer !',3500);S.evt.police=true}}});
    // événement « tentation » à mi-parcours de la course (après la prise en charge)
    if(S.M&&S.evt.tentation===false&&S.pdone[0]&&S.phase>=1){const t=S.pts[S.phase];if(t){const d=Math.hypot(t.l.x-S.x,t.l.z-S.z),d0=S.dLeg||d;if(!S.dLeg)S.dLeg=d;if(d<d0*.55&&d>40){S.evt.tentation=true;evenement('tentation')}}}
    if(S.M&&S.evt.pluie===false&&S.pdone[0]){S.evt.pluie=true;S.pluie=true;scene2(true);evenement('pluie')}
    if(S.M&&S.evt.surcharge===false&&S.phase>=1&&S.pdone[1]===undefined&&S.pts.length>2&&S.phase===1&&S.pdone[0]){}
    rendre()}
  function scene2(pl){R.scene.background=new THREE.Color(pl?0x7b8a96:0xa9cfe8);R.scene.fog.color.set(pl?0x7b8a96:0xa9cfe8);R.scene.fog.far=pl?300:520}
  function choc(d,t){S.deg=cl(S.deg+d*S.V.degats,0,100);SFX.ko&&SFX.ko();msg(t+'  ('+Math.round(S.deg)+' % de dégâts)',2200);if(S.deg>=100){S.paus=true;fin(false,'Ton véhicule est hors d’usage. Conduis plus prudemment !')}}

  function objectifs(dt){
    const M=S.M,pt=S.pts[S.phase];if(!pt)return;const d=Math.hypot(pt.l.x-S.x,pt.l.z-S.z);S.mk.position.set(pt.l.x,0,pt.l.z);S.dist=d;
    const py=proche(pt.l.x,pt.l.z,40,0);if(py)S.mk.position.set(py.px,py.y,py.pz);
    if(d<14&&Math.abs(S.v)<3){S.stop+=dt;if(S.stop>.8){S.stop=0;arret(pt)}}else S.stop=0}
  function arret(pt){
    const M=S.M;S.paus=true;S.v=0;
    const suite=()=>{S.paus=false;S.phase++;S.dLeg=0;const nx=S.pts[S.phase];if(nx)msg('➡ Direction : '+nx.n,4000)};
    if(pt.k==='prise'){S.pdone[S.phase]=true;SFX.coin&&SFX.coin();S.pass+=pt.pax;
      const plein=S.mode==='bus'&&S.phase===1&&M.ev.includes('surcharge')&&!S.evt.surchargeFait;
      const parler=S.mode==='bus'?`${pt.pax} passagers montent à ${esc(pt.n)}. Chacun paie ${M.prix} FC. Tu as maintenant ${S.pass} passagers.`:`${esc(M.client)} monte à bord. Prix convenu : ${M.prix} FC, course directe vers ${esc(M.a)}.`;
      PAR.dire(S.mode==='bus'?`${pt.pax} passagers sont montés.`:`${M.client} est monté. Prix convenu : ${M.prix} francs congolais.`,M.voix);
      if(plein){S.evt.surchargeFait=true;panel(`<h3>🚌 ${esc(pt.n)}</h3><p style="font-size:14px">${parler}</p>`+btn('Continuer','taxiSuite()','#2e7d32'));S._suite=()=>{evenement('surcharge',suite)};return}
      panel(`<h3>✅ ${esc(pt.n)}</h3><p style="font-size:14px">${parler}</p>`+btn('▶ Démarrer','taxiSuite()','#2e7d32'));S._suite=suite}
    else{ // arrivée
      const brut=S.mode==='bus'?M.prix*S.pass:M.prix;S.gain+=brut;
      const fin2=()=>{S.paus=true;fin(true)};
      const apres=()=>{ // suppléments puis monnaie
        const queue=[];if(M.ev.includes('supplement')&&!S.evt.supplementFait)queue.push('supplement');if(M.ev.includes('monnaie'))queue.push('monnaie');
        const go=()=>{const n=queue.shift();if(!n)return fin2();evenement(n,go)};go()};
      PAR.dire('Tu es arrivé à destination !',M.voix);SFX.win&&SFX.win();
      panel(`<h3>🏁 Arrivée : ${esc(pt.n)}</h3><p style="font-size:14px">${S.mode==='bus'?S.pass+' passagers descendent.':esc(M.client)+' descend du véhicule.'}</p>`+btn('Continuer','taxiSuite()','#2e7d32'));S._suite=apres}}

  // ---------- événements d'éthique professionnelle et calcul de la monnaie
  function evenement(id,apres){
    const E=EVENEMENTS[id],M=S.M;S.paus=true;S.v=0;S._apres=apres;SFX.ok&&SFX.ok();
    if(E.calc){ // calcul de la monnaie : mathématiques appliquées
      const prix=S.mode==='bus'?M.prix*Math.max(1,Math.min(S.pass,4)):M.prix,donne=Math.ceil((prix+1)/5000)*5000+(Math.random()<.5?5000:0),bon=donne-prix,mal=[bon+500,bon-1000<0?bon+1000:bon-1000].map(v=>Math.max(100,v));
      const opts=[[bon,true],[mal[0],false],[mal[1],false]].sort(()=>Math.random()-.5);S.monnaie={bon};
      PAR.dire(`Le client paie ${donne} francs. Le prix est ${prix}. Combien dois-tu rendre ?`,M.voix);
      panel(`<h3>🪙 La monnaie à rendre</h3><p style="font-size:14px">Prix de la course : <b>${prix} FC</b><br>Le client te donne : <b>${donne} FC</b></p><p style="font-size:14px">Combien dois-tu lui rendre ?</p>`+opts.map((o,i)=>btn(o[0]+' FC',`taxiChoixMonnaie(${i})`,'#2f5a6b','display:block;width:100%')).join(''));S._opts=opts;return}
    PAR.dire(E.q,M?M.voix:'bea');
    panel(`<div style="text-align:center;font-size:40px">${E.ico}</div><h3 style="text-align:center;margin:4px 0">${esc(E.titre)}</h3><p style="font-size:14px">${esc(E.q)}</p>`+E.choix.map((c,i)=>btn(esc(c[0]),`taxiChoix('${id}',${i})`,'#2f5a6b','display:block;width:100%;text-align:left')).join(''));
    if(id==='supplement')S.evt.supplementFait=true}
  function repondre(ok,texte){
    if(ok){S.bon++;S.rep=cl(S.rep+6,0,100)}else{S.mau++;S.rep=cl(S.rep-12,0,100)}SFX[ok?'win':'ko']&&SFX[ok?'win':'ko']();
    PAR.dire(texte,S.M?S.M.voix:'bea');panel(`<div style="text-align:center;font-size:46px">${ok?'🌟':'⚠️'}</div><h3 style="text-align:center">${ok?'Bon choix !':'Attention…'}</h3><p style="font-size:14px">${esc(texte)}</p>`+btn('Continuer','taxiApres()',ok?'#2e7d32':'#a35a1a','display:block;width:100%'))}
  function apres(){const f=S._apres;S._apres=null;cacherPanel();if(f)f();else S.paus=false}

  function fin(ok,raison){
    const M=S.M,t=T();cancelAnimationFrame(raf);
    if(!M){panel(`<h3>${ok?'Fin':'Fin de la conduite'}</h3><p>${esc(raison||'')}</p>`+btn('↩ Menu','taxiMenu()'));return}
    const tot=S.bon+S.mau,ratio=tot?S.bon/tot:1,etoiles=!ok?0:(ratio>=.99&&S.deg<35&&S.mau===0)?3:(ratio>=.5&&S.deg<70)?2:1;
    let gain=0,txt='';
    if(ok){const prev=t.done[M.id]||0;if(etoiles>prev){t.done[M.id]=etoiles;if(!prev){A().pieces=(A().pieces||0)+8*etoiles;if(etoiles>=2)A().savoir=(A().savoir||0)+3;gain=1}}
      t.rep=cl(S.rep,0,100);if(!t.cert&&Object.values(t.done).filter(v=>v>=2).length>=4&&t.rep>=70)t.cert=new Date().toISOString().slice(0,10);
      try{mis&&mis.evt&&mis.evt('taxi',{id:M.id,etoiles})}catch(e){}save();refreshHud&&refreshHud()}
    PAR.dire(ok?(etoiles===3?'Excellent ! Tu es un chauffeur exemplaire.':'Course terminée.'):raison,M.voix);
    panel(`<div style="text-align:center;font-size:46px">${ok?'🏁':'💥'}</div><h3 style="text-align:center">${ok?'Course terminée !':'Course interrompue'}</h3>
    ${ok?`<div style="font-size:30px;text-align:center">${'⭐'.repeat(etoiles)||'—'}</div>`:`<p>${esc(raison||'')}</p>`}
    <div style="background:#16303d;border-radius:12px;padding:10px;font-size:14px;margin:8px 0">💵 Recette de la course : <b>${S.gain} FC</b> (simulation)<br>🤝 Contrats respectés : <b>${S.bon}</b> · fautes : <b>${S.mau}</b><br>🔧 Dégâts du véhicule : <b>${Math.round(S.deg)} %</b><br>⭐ Réputation : <b>${Math.round(S.rep)}</b> / 100${gain?`<br>🎁 Récompense : ${8*etoiles} 🪙${etoiles>=2?' et +3 FC':''}`:''}</div>
    <p style="font-size:13px;opacity:.9">💡 ${ratio>=1?'Tu as respecté chaque engagement : voilà ce qui fait un bon chauffeur.':'Souviens-toi : un contrat respecté vaut plus que quelques francs gagnés en trichant.'}</p>`+
    (ok?btn('🔁 Rejouer','taxiMission(\''+M.id+'\')','#2f5a6b','display:block;width:100%'):btn('🔁 Réessayer','taxiMission(\''+M.id+'\')','#2e7d32','display:block;width:100%'))+btn('↩ Menu des missions','taxiMenu()','#2c7fb8','display:block;width:100%'))}

  // ---------- affichage
  function rendre(){
    const V=S.V,car=S.car;car.position.set(S.x,S.y,S.z);car.rotation.y=S.h;car.rotation.z=-S.steer*.06*(S.mode==='moto'?3:1);
    const back=S.mode==='moto'?10:S.mode==='bus'?16:13,haut=S.mode==='moto'?5.5:S.mode==='bus'?9:7.5,cam=R.cam;
    const tx=S.x-Math.sin(S.h)*back,tz=S.z-Math.cos(S.h)*back;cam.position.x+=(tx-cam.position.x)*.2;cam.position.z+=(tz-cam.position.z)*.2;cam.position.y+=(S.y+haut-cam.position.y)*.15;
    cam.lookAt(S.x+Math.sin(S.h)*9,S.y+1.5,S.z+Math.cos(S.h)*9);
    if(S.mk){S.mk.children[0].rotation.z+=.03;S.mk.visible=!!S.M}
    R.rend.render(R.scene,cam);
    // HUD
    const hud=$('txhud');S.fr=(S.fr||0)+1;if(S.fr%8===1)infoRoute();
    if(hud){const pt=S.M&&S.pts[S.phase];
      const plaque=`<div style="display:inline-block;background:#0e6b3a;border:2px solid #fff;border-radius:8px;padding:3px 9px;margin-bottom:3px;font-weight:700;max-width:92vw">📍 ${esc(S.nomRoute||'')}${S.cap?` <span style="font-weight:400">· ➜ ${esc(S.cap.n)} · ${(S.cap.d/100).toFixed(1)} km</span>`:''}</div><br>${S.pres?`<div style="display:inline-block;background:#3a4a5ecc;border-radius:8px;padding:2px 8px;margin-bottom:3px;font-size:12px">📌 ${esc(S.pres)}</div><br>`:''}${S.arret?`<div style="display:inline-block;background:#2a6fd0cc;border-radius:8px;padding:2px 8px;margin-bottom:3px;font-size:12px">🚏 Arrêt ${esc(S.arret)}</div><br>`:''}`;
      hud.innerHTML=plaque+(S.M?`<div style="background:#0009;border-radius:10px;padding:5px 9px;display:inline-block">${S.mode==='bus'?`🚌 ${S.pass} passagers · `:''}${pt?`${pt.k==='prise'?'🧍 Prise en charge':'🏁 Destination'} : <b>${esc(pt.n)}</b> · ${Math.round((S.dist||0)*10)} m`:''}<br>🚗 ${Math.round(Math.abs(S.v)*3.6)} km/h · 🔧 ${Math.round(S.deg)} % · ⭐ ${Math.round(S.rep)} · 💵 ${S.gain} FC</div>`:`<div style="background:#0009;border-radius:10px;padding:5px 9px;display:inline-block">🚗 ${Math.round(Math.abs(S.v)*3.6)} km/h · 🔧 ${Math.round(S.deg)} %</div>`)}
    const pt=S.M&&S.pts[S.phase],fl=$('txfl');if(fl){if(pt){const ang=Math.atan2(pt.l.x-S.x,pt.l.z-S.z)-S.h;fl.style.transform=`rotate(${-ang}rad)`;fl.style.display='block'}else fl.style.display='none'}
    // mini-carte
    const mm=R.mm,g=mm.getContext('2d');g.clearRect(0,0,170,104);g.drawImage(R.bg,0,0);if(pt){g.fillStyle='#ffd23a';g.beginPath();g.arc(R.mx(pt.l.x),R.mz(pt.l.z),4,0,6.3);g.fill()}g.fillStyle='#ff4d4d';g.beginPath();g.arc(R.mx(S.x),R.mz(S.z),3.5,0,6.3);g.fill()}

  function infoRoute(){
    const N=reseau(),q=proche(S.x,S.z,24,S.y);
    if(q){const r=N.roads[q.s.r];S.nomRoute=r.n||({a:'Route principale',b:'Grande avenue',c:'Avenue',d:'Rue'}[r.c]||'Route');S.surRoute=q.d<=q.s.w/2+1}else{S.nomRoute='Hors chaussée';S.surRoute=false}
    S.pres=null;let dm=40;N.lieux.forEach(l=>{if(!l.t.startsWith('poi_')&&l.t!=='rond'&&l.t!=='pont')return;const d=Math.hypot(l.x-S.x,l.z-S.z);if(d<dm){dm=d;S.pres=l.n}});
    S.arret=null;dm=22;R.arrets.forEach(a=>{const d=Math.hypot(a.x-S.x,a.z-S.z);if(d<dm){dm=d;S.arret=a.n}});R.pass.forEach(p=>{if(p.nom&&Math.hypot(p.x-S.x,p.z-S.z)<20)S.pres='Passerelle · '+p.nom});
    for(const e of R.etiq){e.visible=Math.hypot(e.position.x-S.x,e.position.z-S.z)<420}
    let best=null;N.lieux.forEach(l=>{if(!GRANDS.has(l.t))return;const dx=l.x-S.x,dz=l.z-S.z,d=Math.hypot(dx,dz);if(d<40)return;let a=Math.atan2(dx,dz)-S.h;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(a)<.7&&(!best||d<best.d))best={n:l.n,d}});S.cap=best}
  const actions={taxiOuvrir:()=>ouvrir(),taxiRetour:()=>{if(S&&ov&&$('txpan')&&$('txpan').style.display==='none'){S=null;cancelAnimationFrame(raf);menu();return}fermer()},taxiMenu:()=>menu(),
    taxiMission:id=>demarrer(id),taxiLibre:()=>demarrer(null),taxiSuite:()=>{cacherPanel();const f=S&&S._suite;S._suite=null;if(f)f()},taxiApres:()=>apres(),
    taxiChoix:(id,i)=>{const c=EVENEMENTS[id].choix[i];repondre(c[1],c[2])},
    taxiChoixMonnaie:i=>{const o=S._opts[i];repondre(o[1],o[1]?'Exact ! Rendre la bonne monnaie, c’est respecter le client : '+S.monnaie.bon+' FC.':'Ce n’est pas le bon compte. Prix payé − prix de la course = monnaie à rendre : il fallait rendre '+S.monnaie.bon+' FC. Une erreur de monnaie fait perdre la confiance du client.')}};
  return {actions,fermer,__modele:modele,__bat:()=>BG,__S:()=>S,__R:()=>R,__reseau:reseau,__proche:proche};
}
