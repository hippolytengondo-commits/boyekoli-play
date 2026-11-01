// Circulation dans la ville : piétons sur les trottoirs et véhicules sur la route principale.
// Plus le joueur construit, plus il y a de monde ; les services publics envoient leurs véhicules (police, ambulance, pompiers).
import * as THREE from 'three';

const std=(c,r,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:r===undefined?.6:r},o||{}));
const mats={};const M=(c,r,o)=>mats[c+(r||'')]||(mats[c+(r||'')]=std(c,r,o));

export function moto(col){
  const g=new THREE.Group();
  const add=(w,h,d,m,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;g.add(b);return b};
  add(.35,.4,1.5,M(col||'#c0392b'),0,.65,0);add(.3,.3,.6,M('#2b2b2b'),0,.95,-.1);add(.6,.06,.06,M('#333'),0,1.15,.7);add(.1,.5,.1,M('#999'),0,.8,.75);
  const ro=M('#1b1b1b',.9);[.8,-.8].forEach(z=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.14,14),ro);w.rotation.z=Math.PI/2;w.position.set(0,.34,z);g.add(w)});
  return g;
}
export function voiture(kind,col){
  const g=new THREE.Group();
  const add=(w,h,d,m,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);b.position.set(x,y,z);b.castShadow=true;g.add(b);return b};
  const verre=M('#27384a',.2,{metalness:.3});
  if(kind==='camion'){
    add(2.2,1.7,1.7,M(col),0,1.15,2.6);add(2.0,.7,.1,verre,0,1.75,3.45);add(2.3,.5,7,M('#555'),0,.65,-.3);add(2.3,2.4,5.2,M('#ecebe4'),0,2.0,-1.1);add(2.34,.25,5.24,M(col),0,3.3,-1.1);
    [[-1,2.4],[1,2.4],[-1,.2],[1,.2],[-1,-2.6],[1,-2.6]].forEach(([sx,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.32,14),M('#1b1b1b',.9));w.rotation.z=Math.PI/2;w.position.set(sx*1.1,.45,z);g.add(w)});
    g.userData.dim={l:3.9,w:1.3};return g;
  }
  if(kind==='bus'){
    add(2,1.5,5,M(col),0,1.05,0);add(2.02,.6,4.4,verre,0,1.55,0);add(2.04,.2,5.02,M('#f2f2f2'),0,.45,0);
  }else if(kind==='pompiers'){
    add(2,1.6,5.2,M('#d93025'),0,1.1,0);add(1.9,.7,1.5,verre,0,1.6,1.8);add(.2,.2,4.2,M('#cccccc'),0,2.1,-.4);add(.5,.25,.25,new THREE.MeshBasicMaterial({color:0x2e7bff}),0,2.0,1.2);
  }else if(kind==='ambulance'){
    add(1.9,1.5,4.2,M('#ffffff'),0,1.05,0);add(1.8,.6,1.2,verre,0,1.5,1.4);add(.2,.8,.05,M('#c0392b'),0,1.3,-2.12);add(.8,.2,.05,M('#c0392b'),0,1.3,-2.12);add(.5,.2,.25,new THREE.MeshBasicMaterial({color:0xe74c3c}),0,1.9,1.0);
  }else if(kind==='police'){
    add(1.8,.7,4,M('#f2f2f2'),0,.7,0);add(1.6,.6,2,M('#2e4a7a'),0,1.3,-.1);add(1.62,.35,1.7,verre,0,1.4,-.1);add(.35,.2,.25,new THREE.MeshBasicMaterial({color:0x2e7bff}),-.2,1.72,-.1);add(.35,.2,.25,new THREE.MeshBasicMaterial({color:0xe74c3c}),.2,1.72,-.1);
  }else{
    add(1.7,.7,3.8,M(col),0,.7,0);add(1.5,.6,1.9,M(col),0,1.3,-.1);add(1.52,.35,1.6,verre,0,1.38,-.1);
  }
  g.userData.dim=g.userData.dim||(kind==='bus'?{l:2.7,w:1.2}:{l:2.2,w:1.0});
  const ro=M('#1b1b1b',.9);
  [[-1,1.3],[1,1.3],[-1,-1.3],[1,-1.3]].forEach(([sx,z])=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.3,12),ro);w.rotation.z=Math.PI/2;w.position.set(sx*(kind==='bus'||kind==='pompiers'?1:.88),.38,z*(kind==='bus'||kind==='pompiers'?1.5:1));g.add(w)});
  return g;
}

// opt : {cx, rond, zN (extrémité nord), zS (extrémité sud), nbBat, nbLoc, routeOk, services:[types], makeHuman}
export function creerTrafic(parent,opt){
  const g=new THREE.Group();parent.add(g);
  const agents=[];
  let seed=17;const r=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const {cx,zN,zS}=opt;
  // véhicules : une voie dans chaque sens
  if(opt.routeOk){
    const n=Math.min(8,1+opt.nbBat);
    const spe={police:'police',sante:'ambulance',pompiers:'pompiers'};
    const kinds=[];opt.services.forEach(t=>{if(spe[t])kinds.push(spe[t])});
    const COL=['#e0a526','#2e86de','#c0392b','#27ae60','#8e44ad','#f1f1f1','#d35400'];
    for(let i=0;i<n;i++){
      const kind=kinds[i]||(i%4===3?'camion':i%3===2?'bus':'auto');
      const dir=i%2?1:-1;                    // -1 : vers le nord
      const v=voiture(kind,COL[i%COL.length]);
      Object.assign(v.userData,{dir:dir,v:(kind==='bus'||kind==='camion'?3.2:4.2)+r()*1.8,z:zS+(zN-zS)*r(),pause:0});
      v.rotation.y=dir<0?Math.PI:0;v.position.set(cx+(dir<0?-1.8:1.8),0,v.userData.z);
      g.add(v);agents.push({o:v,veh:true});
    }
  }
  // piétons sur les trottoirs
  const np=opt.nbBat>0?Math.min(12,2+opt.nbBat*2+opt.nbLoc*2):0;
  const PEAUX=['#7a4a2e','#6b4028','#8a5634','#63391f','#916f64','#5a3319'],TEINTES=['#c0392b','#2e86de','#27ae60','#8e44ad','#d35400','#16a085','#e0a526','#2c3e50'];
  for(let i=0;i<np;i++){
    const sx=i%2?'f':'h';
    const h=opt.makeHuman({s:sx,h:sx==='h'?1:.96,skin:PEAUX[i%PEAUX.length],c:TEINTES[(i*3)%TEINTES.length],k:i%3===0?'boubou':'pagne',co:sx==='h'?'courtes':'tresses'});
    const dir=i%2?1:-1,x=cx+(i%4<2?-4.4:4.4);
    h.userData.m={dir:dir,v:1.0+r()*.7,x:x};
    h.position.set(x,0,zS+(zN-zS)*r());h.rotation.y=dir<0?Math.PI:0;
    g.add(h);agents.push({o:h,veh:false});
  }
  return {
    group:g,agents:agents,
    update(dt,cam,joueur,onHit){
      agents.forEach(a=>{
        if(a.veh){
          const d=a.o.userData;
          if(d.pause>0){d.pause-=dt;if(!joueur||!joueur.ok||d.pause>0)return}
          d.z+=d.dir*d.v*dt;
          if(d.z<zN){d.z=zN;d.dir=1;a.o.rotation.y=0;a.o.position.x=cx+1.8}
          else if(d.z>zS){d.z=zS;d.dir=-1;a.o.rotation.y=Math.PI;a.o.position.x=cx-1.8}
          a.o.position.z=d.z;
          // le véhicule heurte le joueur s'il est sur sa trajectoire
          if(joueur&&joueur.ok&&onHit){
            const dm=d.dim||{l:2.2,w:1};
            if(Math.abs(joueur.x-a.o.position.x)<dm.w+.2&&Math.abs(joueur.z-d.z)<dm.l+.3){d.pause=2.4;onHit({dir:d.dir,kind:dm.l>3?'camion':'véhicule',x:a.o.position.x,z:d.z})}
          }
          if(opt.rond&&Math.abs(d.z)<6.65)a.o.position.x=cx+(d.dir<0?-1:1)*Math.max(1.8,Math.sqrt(6.65*6.65-d.z*d.z));
        }else{
          const m=a.o.userData.m;let z=a.o.position.z+m.dir*m.v*dt;
          if(z<zN){z=zN;m.dir=1}else if(z>zS){z=zS;m.dir=-1}
          a.o.position.z=z;a.o.rotation.y=m.dir<0?Math.PI:0;
          if(a.o.userData.update)a.o.userData.update(dt,{speed:m.v*1.6,cam:cam});
        }
      });
    }
  };
}

// ---------- véhicules du joueur : vraie conduite (volant, roues directrices, conducteur assis) ----------
const mk=(parent,geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o};
const bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const roue=(parent,x,y,z,r,larg)=>{
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  const pneu=new THREE.Mesh(new THREE.CylinderGeometry(r,r,larg,18),M('#1b1b1b',.9));pneu.rotation.z=Math.PI/2;pneu.castShadow=true;g.add(pneu);
  const jante=new THREE.Mesh(new THREE.CylinderGeometry(r*.6,r*.6,larg+.02,12),M('#cfd3d6',.4,{metalness:.7}));jante.rotation.z=Math.PI/2;g.add(jante);
  const moy=new THREE.Mesh(new THREE.CylinderGeometry(r*.18,r*.18,larg+.04,8),M('#666',.5,{metalness:.8}));moy.rotation.z=Math.PI/2;g.add(moy);
  return g;
};
const phare=()=>new THREE.MeshBasicMaterial({color:0xfff2b0}),feuAr=()=>new THREE.MeshBasicMaterial({color:0xd62a1a});

// voiture ouverte (type 4x4) : chaque pièce est modélisée ; userData : volant, roues avant (pivots), siège du conducteur
export function voitureJoueur(col){
  const g=new THREE.Group(),c=M(col||'#2e86de',.45,{metalness:.35}),noir=M('#222',.8);
  mk(g,bx(1.8,.5,3.9),c,0,.62,0);                    // caisse
  mk(g,bx(1.7,.28,1.25),c,0,.98,1.2);                 // capot
  mk(g,bx(1.8,.12,.3),M('#cfd3d6',.4,{metalness:.7}),0,.5,2.05);   // pare-chocs avant
  mk(g,bx(1.8,.12,.3),M('#cfd3d6',.4,{metalness:.7}),0,.5,-2.0);   // pare-chocs arrière
  [-1,1].forEach(s=>{
    mk(g,new THREE.SphereGeometry(.17,12,8),phare(),s*.6,.98,2.0);       // phares
    mk(g,bx(.3,.16,.08),feuAr(),s*.75,.78,-1.97);                        // feux arrière
    mk(g,bx(.08,.7,.08),noir,s*.88,1.2,.62);                             // montants du pare-brise
    mk(g,bx(.2,.14,.06),noir,s*1.0,1.15,.7);                             // rétroviseurs
    mk(g,bx(.12,.12,.9),M('#cfd3d6',.4,{metalness:.7}),s*.98,.9,.0);      // marchepied/barre latérale
  });
  mk(g,bx(1.7,.06,.06),noir,0,1.58,.6);                                    // haut du pare-brise
  const verre=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.62),new THREE.MeshStandardMaterial({color:0x9fd6ff,transparent:true,opacity:.28,roughness:.1,side:THREE.DoubleSide}));
  verre.position.set(0,1.27,.62);verre.rotation.x=-.28;g.add(verre);
  // arceau de sécurité
  [-1,1].forEach(s=>mk(g,bx(.07,.95,.07),noir,s*.85,1.45,-.95));mk(g,bx(1.75,.07,.07),noir,0,1.92,-.95);
  // sièges
  [-.45,.45].forEach(x=>{mk(g,bx(.55,.14,.55),M('#3a3a3a',.9),x,.92,-.25);mk(g,bx(.55,.62,.12),M('#3a3a3a',.9),x,1.25,-.55)});
  // volant et colonne
  mk(g,bx(.07,.07,.6),noir,-.45,1.17,.5);
  const piv=new THREE.Group();piv.position.set(-.45,1.3,.27);piv.rotation.x=-.95;g.add(piv);
  const vol=new THREE.Mesh(new THREE.TorusGeometry(.2,.032,8,20),M('#111',.8));piv.add(vol);
  const br=new THREE.Mesh(bx(.4,.03,.03),M('#111',.8));vol.add(br);
  // roues : les roues avant pivotent
  const av=[roue(g,-.95,.45,1.3,.45,.3),roue(g,.95,.45,1.3,.45,.3)];
  roue(g,-.95,.45,-1.3,.45,.3);roue(g,.95,.45,-1.3,.45,.3);
  g.userData={volant:vol,avant:av,siege:{x:-.45,y:.7,z:-.2},hauteurSiege:.7};
  return g;
}

// moto : guidon et roue avant pivotent ensemble
export function motoJoueur(col){
  const g=new THREE.Group(),c=M(col||'#c0392b',.4,{metalness:.35}),noir=M('#222',.8),chrome=M('#cfd3d6',.4,{metalness:.7});
  roue(g,0,.38,-.85,.38,.14);
  mk(g,bx(.3,.3,1.0),noir,0,.65,-.1);                         // bloc moteur / cadre
  mk(g,bx(.34,.3,.6),c,0,.95,.28);                            // réservoir
  mk(g,bx(.32,.12,.85),M('#222',.9),0,.82,-.45);              // selle
  mk(g,bx(.3,.06,.5),c,0,.68,-1.05);                          // garde-boue arrière
  mk(g,new THREE.CylinderGeometry(.06,.05,.9,8),chrome,.2,.42,-.35).rotation.x=Math.PI/2; // pot d'échappement
  mk(g,bx(.12,.1,.06),feuAr(),0,.8,-1.32);                    // feu arrière
  // partie avant (pivote autour de l'axe de direction)
  const avant=new THREE.Group();avant.position.set(0,1.0,.7);g.add(avant);
  const fourche=mk(avant,bx(.07,.8,.07),chrome,0,-.45,.08);fourche.rotation.x=.25;
  roue(avant,0,-.62,.2,.38,.14);
  mk(avant,bx(.8,.05,.05),noir,0,.05,0);                      // guidon
  [-.4,.4].forEach(x=>mk(avant,new THREE.CylinderGeometry(.03,.03,.14,8),M('#111',.9),x,.05,0).rotation.z=Math.PI/2);
  mk(avant,new THREE.SphereGeometry(.15,12,8),phare(),0,-.1,.3);   // phare
  mk(avant,bx(.3,.05,.2),c,0,-.28,.18);                            // garde-boue avant
  g.userData={guidon:avant,siege:{x:0,y:.78,z:-.4},hauteurSiege:.78};
  return g;
}
