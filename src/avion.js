// Simulateur d'avion : décollage, anneaux à traverser, atterrissage sur la piste. Three.js autonome (petit rendu dédié).
import * as THREE from 'three';
export function lancerAvion(el,fin){
  const W=el.clientWidth||360,H=el.clientHeight||520;
  const r=new THREE.WebGLRenderer({antialias:false});r.setSize(W,H);r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));el.appendChild(r.domElement);r.domElement.style.cssText='width:100%;height:100%;display:block';
  const sc=new THREE.Scene();sc.background=new THREE.Color('#9fd3f5');sc.fog=new THREE.Fog('#9fd3f5',200,1100);
  const cam=new THREE.PerspectiveCamera(60,W/H,1,2500);
  sc.add(new THREE.HemisphereLight('#ffffff','#5a7d4a',1.1));const sun=new THREE.DirectionalLight('#fff4d6',.9);sun.position.set(200,400,100);sc.add(sun);
  const M=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.9});
  const sol=new THREE.Mesh(new THREE.PlaneGeometry(6000,6000),M('#6d9a54'));sol.rotation.x=-Math.PI/2;sc.add(sol);
  const piste=new THREE.Mesh(new THREE.PlaneGeometry(22,420),M('#3a3a3e'));piste.rotation.x=-Math.PI/2;piste.position.set(0,.1,-120);sc.add(piste);
  for(let i=0;i<18;i++){const l=new THREE.Mesh(new THREE.PlaneGeometry(1,12),M('#f4f4f4'));l.rotation.x=-Math.PI/2;l.position.set(0,.2,70-i*22);sc.add(l)}
  // aérogare, tour de contrôle
  const ter=new THREE.Mesh(new THREE.BoxGeometry(40,10,14),M('#e8e8ee'));ter.position.set(-45,5,40);sc.add(ter);
  const tour=new THREE.Mesh(new THREE.CylinderGeometry(2.5,3,24,10),M('#d0d4da'));tour.position.set(-30,12,70);sc.add(tour);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(4.5,3,4,10),M('#4a90c8'));cab.position.set(-30,26,70);sc.add(cab);
  // arbres et collines décoratifs (déterministes)
  for(let i=0;i<120;i++){const a=i*2.399,d=120+((i*53)%900);const x=Math.cos(a)*d,z=-200+Math.sin(a)*d;if(Math.abs(x)<40&&z>-340&&z<120)continue;
    const t=new THREE.Mesh(new THREE.ConeGeometry(5+(i%4),16+(i%5)*3,6),M(i%3?'#2f6f3a':'#3d8a45'));t.position.set(x,9,z);sc.add(t)}
  const avion=new THREE.Group();
  const bx=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);avion.add(m)};
  bx(1.6,1.6,9,'#f2f2f2',0,0,0);bx(14,.25,2.4,'#e7332f',0,0,.4);bx(5,.2,1.6,'#e7332f',0,.2,4);bx(.2,2.2,1.6,'#e7332f',0,1.2,4);bx(1.2,1,2,'#2b6cb0',0,.8,-2.5);
  avion.position.set(0,1.2,60);sc.add(avion);
  // anneaux
  const PTS=[[0,45,-250],[150,60,-480],[380,70,-520],[400,55,-260],[200,45,-40]];
  const anneaux=PTS.map(p=>{const m=new THREE.Mesh(new THREE.TorusGeometry(16,1.6,8,24),new THREE.MeshBasicMaterial({color:'#ffc107'}));m.position.set(...p);sc.add(m);return {m,ok:false,p:new THREE.Vector3(...p)}});
  const S={x:0,y:1.2,z:60,psi:0,th:0,ph:0,v:0,t:0,vy:0,fin:false,msg:'Pousse la manette des gaz (+) pour accélérer !',tm:0,vol:false};
  const K={up:0,dn:0,l:0,r:0,pw:0,pm:0};
  const kd=e=>{const m={ArrowUp:'dn',ArrowDown:'up',ArrowLeft:'l',ArrowRight:'r',w:'pw',s:'pm'}[e.key];if(m)K[m]=e.type==='keydown'?1:0};
  addEventListener('keydown',kd);addEventListener('keyup',kd);
  const hud=document.createElement('div');hud.style.cssText='position:absolute;left:8px;top:8px;right:8px;color:#fff;font:700 13px system-ui;text-shadow:0 1px 3px #000;pointer-events:none';el.appendChild(hud);
  const pad=document.createElement('div');pad.style.cssText='position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:space-between;padding:0 10px;touch-action:none';
  const btn=(t,k)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='width:58px;height:58px;font-size:22px;border-radius:50%;border:2px solid #fff;background:rgba(0,0,0,.45);color:#fff;touch-action:none;margin:2px';
    const on=e=>{e.preventDefault();K[k]=1},off=e=>{e.preventDefault();K[k]=0};b.addEventListener('pointerdown',on);['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,off));return b};
  const g1=document.createElement('div'),g2=document.createElement('div');
  g1.append(btn('＋','pw'),btn('－','pm'));g2.append(btn('◀','l'),btn('▲','up'),btn('▼','dn'),btn('▶','r'));pad.append(g1,g2);el.appendChild(pad);
  let last=performance.now(),raf=0,done=false;
  function reset(msg){S.x=0;S.y=1.2;S.z=60;S.psi=0;S.th=0;S.ph=0;S.v=0;S.t=0;S.vy=0;S.vol=false;S.msg=msg;S.tm=3;anneaux.forEach(a=>{a.ok=false;a.m.material.color.set('#ffc107')})}
  function step(dt){
    S.t=Math.max(0,Math.min(1,S.t+(K.pw-K.pm)*.5*dt));
    S.v+=(S.t*70-S.v)*.35*dt;
    const sol_=S.y<=1.25;
    S.th+=((K.dn-K.up)*.9*dt);S.th=Math.max(-.6,Math.min(.6,S.th));if(!K.up&&!K.dn)S.th*=1-Math.min(1,dt*1.2);
    S.ph+=((K.r-K.l)*1.6*dt);S.ph=Math.max(-.8,Math.min(.8,S.ph));if(!K.l&&!K.r)S.ph*=1-Math.min(1,dt*1.5);
    if(sol_&&S.v<28){S.th=Math.min(S.th,0);S.ph=0}
    S.psi+=S.ph*.5*dt*(S.v>10?1:0);
    // portance : au-dessus de 28 m/s l'avion peut monter
    let vy=0;
    if(S.v>=28)vy=Math.sin(S.th)*S.v*.8-(S.th<.02?1.5:0);else if(!sol_)vy=-12*(1-S.v/28)-4;
    if(S.v>=28&&sol_&&S.th>.06)S.vol=true;
    S.y+=vy*dt;
    const fx=Math.sin(S.psi),fz=-Math.cos(S.psi);S.x+=fx*S.v*dt*.9;S.z+=fz*S.v*dt*.9;
    if(S.y<=1.2){
      if(S.vol&&vy<-1){ // contact avec le sol après un vol
        const surPiste=Math.abs(S.x)<14&&S.z<80&&S.z>-330;
        const done_=anneaux.every(a=>a.ok);
        if(S.v<42&&Math.abs(S.th)<.22&&vy>-9&&surPiste){S.fin=true;S.msg=done_?'🎉 Atterrissage réussi ! Mission accomplie.':'Atterrissage réussi, mais il restait des anneaux.';S.vol=false}
        else{reset('💥 Atterrissage manqué : ralentis, garde le nez presque à plat et vise la piste.');return}
      }
      S.y=1.2;S.vy=0;
    }
    if(S.y>1.5)S.vol=true;
    if(S.y>700)S.y=700;
    anneaux.forEach(a=>{if(!a.ok&&a.p.distanceTo(new THREE.Vector3(S.x,S.y,S.z))<18){a.ok=true;a.m.material.color.set('#2ecc71');S.msg='✅ Anneau '+anneaux.filter(z=>z.ok).length+'/'+anneaux.length;S.tm=2}});
    if(S.fin&&!done){done=true;setTimeout(()=>fin(anneaux.filter(a=>a.ok).length===anneaux.length,anneaux.filter(a=>a.ok).length),1500)}
    if(S.tm>0){S.tm-=dt;if(S.tm<=0&&!S.fin)S.msg=''}
  }
  function draw(){
    avion.position.set(S.x,S.y,S.z);avion.rotation.set(S.th,-S.psi+Math.PI*0,0,'YXZ');avion.rotation.y=-S.psi;avion.rotation.x=S.th;avion.rotation.z=-S.ph;
    avion.rotation.order='YXZ';
    const bx_=-Math.sin(S.psi)*18,bz_=Math.cos(S.psi)*18;
    cam.position.set(S.x+bx_,S.y+6,S.z+bz_);cam.lookAt(S.x,S.y+1,S.z);
    const na=anneaux.filter(a=>a.ok).length,tgt=anneaux.find(a=>!a.ok);
    let cap='';if(tgt){const dx=tgt.p.x-S.x,dz=tgt.p.z-S.z;const rel=Math.atan2(dx,-dz)-S.psi;const n=Math.atan2(Math.sin(rel),Math.cos(rel));cap=Math.abs(n)<.2?'⬆ tout droit':n>0?'➡ tourne à droite':'⬅ tourne à gauche'}else cap='🛬 Reviens vers la piste et atterris doucement';
    hud.innerHTML=`Vitesse ${Math.round(S.v*3.6)} km/h · Altitude ${Math.max(0,Math.round(S.y-1.2))} m · Gaz ${Math.round(S.t*100)}% · Anneaux ${na}/${anneaux.length}<br>${cap}<br><span style="color:#ffe082">${S.msg}</span>`;
    r.render(sc,cam);
  }
  function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;step(dt);draw();raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop);
  return {stop(){cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);r.dispose();el.innerHTML=''},etat:S,K,tour:step};
}
