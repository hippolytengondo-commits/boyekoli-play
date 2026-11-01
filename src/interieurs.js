// Intérieurs des constructions du quartier résidentiel : construits seulement quand le joueur entre
// (rien n'est gardé en mémoire dans le quartier). Chaque type a son décor, plus riche aux niveaux supérieurs.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl,room} from './world.js';
import {voiture,voitureJoueur,motoJoueur} from './trafic.js';
import {CATALOGUE} from './quartier_res.js';
import {NIVEAUX} from './contenu/musee.js';
import {NIVEAUX_SUPER} from './contenu/supermarche.js';
import {produit} from './produits.js';

const wood=c=>new THREE.MeshStandardMaterial({map:T.woodTexture(c||'#7a4a26')});
const paint=c=>new THREE.MeshStandardMaterial({map:T.plasterTexture(c),roughness:.95});
const sol=c=>new THREE.MeshStandardMaterial({map:T.woodTexture(c||'#a8744a'),roughness:.85});
const dalle=c=>std(c||'#d9dcd9',.6);

// dimensions (largeur, profondeur, hauteur) selon le type et le niveau
export const TAILLE=(t,n)=>{
  const base={case:[5,4.5,2.8],maison:[7,5.5,3.2],villa:[9,6.5,3.6],ecole:[11,7,3.6],sante:[9,6.5,3.4],culture:[10,7,4.2],police:[8,6,3.2],autoecole:[10,7,3.4],concession:[10,7,3.6],supermarche:[20,12,4],musee:[18,11,4.4],pompiers:[10,7,4.2],sport:[10,8,4]}[t];
  const f=(t==='musee'||t==='supermarche')?1:1+.12*(n-1);return [base[0]*f,base[1]*f,base[2]];
};

function lit(g,boxes,x,z,col,ry){
  box(g,2,.35,1.1,wood('#7a4a26'),x,.3,z);box(g,1.9,.2,1,std('#f5efe3',.95),x,.55,z);box(g,.6,.12,.8,std('#fff',.9),x-.7,.7,z);box(g,1.2,.08,1.05,std(col,.9),x+.3,.66,z);
  boxes.push({x0:x-1.05,x1:x+1.05,z0:z-.6,z1:z+.6});
}
function table(g,boxes,x,z,w,d){
  box(g,w,.08,d,wood('#a87445'),x,.8,z);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(p=>box(g,.07,.8,.07,std('#4a2f1b'),x+p[0]*(w/2-.1),.4,z+p[1]*(d/2-.1)));
  boxes.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2});
}
function canape(g,boxes,x,z,w,col){
  box(g,w,.45,.9,std(col||'#2e6da4',.9),x,.25,z);box(g,w,.6,.2,std(col||'#2e6da4',.9),x,.65,z-.38);
  boxes.push({x0:x-w/2,x1:x+w/2,z0:z-.5,z1:z+.5});
}
function banc(g,boxes,x,z){box(g,1.3,.06,.5,wood('#b07a45'),x,.7,z);box(g,1.3,.06,.35,wood('#b07a45'),x,.42,z+.55);[-.55,.55].forEach(dx=>box(g,.05,.7,.05,std('#4a2f1b'),x+dx,.35,z));boxes.push({x0:x-.7,x1:x+.7,z0:z-.3,z1:z+.8})}
function etagere(g,boxes,x,z,w,h,cols){
  box(g,w,h,.4,wood('#6b4226'),x,h/2,z);
  for(let r=0;r<3;r++)for(let i=0;i<Math.floor(w/.35);i++)box(g,.22,.4,.25,std(cols[(i+r)%cols.length],.8),x-w/2+.3+i*.35,.6+r*.6,z+.05);
  boxes.push({x0:x-w/2,x1:x+w/2,z0:z-.25,z1:z+.25});
}
// ---- rayons garnis de produits en 3D ----
const NOMS_SAC={'Farine de maïs (5 kg)':['FARINE','#f5efe3'],'Riz (2 kg)':['RIZ','#fff8e0'],'Sucre (1 kg)':['SUCRE','#ffffff'],'Haricots (1 kg)':['HARICOTS','#e6d2b0']};
function rayonGarni(g,B,x,z,w,r){
  const planche=wood('#7a4a26');
  box(g,w,2.5,.12,planche,x,1.25,z-.3);
  [-w/2,w/2].forEach(dx=>box(g,.1,2.4,.6,planche,x+dx,1.2,z));
  [.08,.85,1.62].forEach((y,lv)=>{
    box(g,w,.06,.6,planche,x,y,z);
    const n=Math.floor((w-.4)/.52);
    for(let i=0;i<n;i++){
      const pr=r.produits[(i+lv*2)%r.produits.length],sac=NOMS_SAC[pr.n];
      const p=produit(pr.m,sac?{a:sac[0],b:sac[1]}:null);
      p.position.set(x-w/2+.45+i*.52,y+.03,z+.04);p.rotation.y=((i*37+lv*11)%7-3)*.05;g.add(p);
    }
  });
  B.push({x0:x-w/2,x1:x+w/2,z0:z-.4,z1:z+.35});
}
function ilot(g,B,x,z,kinds){
  box(g,3.2,.6,1.2,wood('#9a6a3a'),x,.3,z);box(g,3.3,.06,1.3,wood('#7a4a26'),x,.62,z);
  for(let i=0;i<7;i++)for(let j=0;j<2;j++){const p=produit(kinds[(i+j)%kinds.length]);p.position.set(x-1.35+i*.45,.65,z-.3+j*.6);p.scale.setScalar(1.05);g.add(p)}
  B.push({x0:x-1.7,x1:x+1.7,z0:z-.7,z1:z+.7});
}
// ---- tableaux du musée : cadre, photo (ou grande illustration), plaque ----
export function emplacementTableau(i,W,D){
  const back=[-6.6,-4,-1.4,1.4,4,6.6];
  if(i<6)return {x:back[i],z:-D/2+.08,ry:0};
  return {x:-W/2+.08,z:-1.5+(i-6)*2.8,ry:Math.PI/2};
}
const cacheTex={};
function tableauPhoto(g,x,z,ry,e,couleur){
  const gr=new THREE.Group();gr.position.set(x,0,z);gr.rotation.y=ry;g.add(gr);
  const W=1.7,H=2.1;
  box(gr,W+.2,H+.2,.08,wood('#5a3a22'),0,1.95,0);
  const mat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.7});
  const plan=new THREE.Mesh(new THREE.PlaneGeometry(W,H),mat);plan.position.set(0,1.95,.05);gr.add(plan);
  // illustration de secours (emoji) tant que la photo n'est pas disponible
  const secours=()=>{if(e.pasdephoto){const c0=document.createElement('canvas');c0.width=256;c0.height=320;const k0=c0.getContext('2d');k0.fillStyle=couleur;k0.fillRect(0,0,256,320);k0.fillStyle='rgba(255,255,255,.18)';k0.fillRect(14,14,228,292);k0.font='120px serif';k0.textAlign='center';k0.textBaseline='middle';k0.fillStyle='#fff';k0.fillText(e.ico||'🏛',128,150);k0.font='bold 22px system-ui,sans-serif';k0.fillText(String(e.titre).slice(0,20),128,270);const t0=new THREE.CanvasTexture(c0);t0.colorSpace=THREE.SRGBColorSpace;mat.map=t0;mat.needsUpdate=true;return}const c=document.createElement('canvas');c.width=256;c.height=320;const k=c.getContext('2d');k.fillStyle='#d9d4c7';k.fillRect(0,0,256,320);k.strokeStyle='#9a9384';k.lineWidth=6;k.strokeRect(10,10,236,300);k.font='96px serif';k.textAlign='center';k.textBaseline='middle';k.fillStyle='#8a8374';k.fillText('📷',128,140);k.font='bold 21px system-ui,sans-serif';k.fillStyle='#5a5448';k.fillText('Photo à venir',128,240);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;mat.map=t;mat.needsUpdate=true};
  if(e.img){
    if(cacheTex[e.img]&&cacheTex[e.img].image){mat.map=cacheTex[e.img];mat.needsUpdate=true}
    else new THREE.TextureLoader().load(e.img,t=>{t.colorSpace=THREE.SRGBColorSpace;cacheTex[e.img]=t;mat.map=t;mat.needsUpdate=true;
      const a=t.image.width/t.image.height;plan.scale.set(Math.min(1,a*H/W),Math.min(1,W/(a*H)),1)},undefined,secours);
  }else secours();
  tableau(gr,0,.72,.05,1.9,.42,[{t:String(e.titre).slice(0,26),s:34,y:.5}],couleur);
}
function tableau(g,x,y,z,w,h,lignes,bg){
  const b=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:T.textBoard(lignes,768,Math.round(768*h/w),bg||'#2e3b33','#fff','#8d5a3b'),roughness:.9}));
  b.position.set(x,y,z);g.add(b);return b;
}
function fenetres(g,W,H,D,n){
  for(let i=0;i<n;i++){const z=-D/2+(i+.8)*(D/(n+.6));
    const w=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.3),new THREE.MeshBasicMaterial({color:0xcfeaff}));w.rotation.y=-Math.PI/2;w.position.set(W/2-.03,H*.62,z);g.add(w)}
}
function lumiere(g,W,H){const l=new THREE.PointLight(0xfff0c8,12,W*2.2,1.4);l.position.set(0,H-.4,0);g.add(l)}
function croix(g,x,y,z){box(g,.9,.25,.05,std('#c0392b'),x,y,z);box(g,.25,.9,.05,std('#c0392b'),x,y,z)}
function rideau(g,x,z,col){box(g,1.4,2,.08,std(col||'#7fb8d9',.9),x,1.1,z)}

const DECOR={
  concession(g,B,W,D,n){
    // salle d'exposition : estrade avec une voiture et une moto, comptoir du vendeur
    box(g,4.6,.3,3.2,wood('#d9cfae'),-W/2+3.2,.15,.2);const v=voitureJoueur('#c0392b');v.position.set(-W/2+3.2,.3,.2);v.rotation.y=Math.PI/2-.35;g.add(v);B.push({x0:-W/2+.8,x1:-W/2+5.6,z0:-1.4,z1:1.8});
    box(g,3,.3,2.2,wood('#d9cfae'),0.6,.15,-D/2+2.2);const m=motoJoueur('#2e86de');m.position.set(.6,.3,-D/2+2.2);m.rotation.y=Math.PI/2+.4;g.add(m);B.push({x0:-.9,x1:2.1,z0:-D/2+1.1,z1:-D/2+3.3});
    box(g,2.6,1.05,.8,wood('#3d4a5a'),W/2-2.6,.52,-D/2+2.3);B.push({x0:W/2-3.9,x1:W/2-1.3,z0:-D/2+1.9,z1:-D/2+2.7});
    tableau(g,W/2-2.6,2.4,-D/2+.05,3.2,.8,[{t:'NOS VÉHICULES',s:60,y:.5}],'#b8860b');
    tableau(g,0,2.6,-D/2+.05,4.4,1,[{t:'🏍 MOTOS  ·  🚗 VOITURES',s:58,y:.5}],'#2b2b2b');
  },
  musee(g,B,W,D,n){
    // un étage du musée : les tableaux (photos) sont accrochés aux murs ; un escalator relie les niveaux
    const niv=NIVEAUX[Math.max(0,Math.min(NIVEAUX.length-1,n-1))];
    niv.expos.forEach((e,i)=>{const p=emplacementTableau(i,W,D);tableauPhoto(g,p.x,p.z,p.ry,e,niv.couleur)});
    // pupitre central du quiz
    box(g,1.2,.9,1.2,wood('#6b4226'),0,.45,-.6);box(g,.7,.18,.7,std(niv.couleur,.5),0,1.0,-.6);B.push({x0:-.8,x1:.8,z0:-1.2,z1:0});
    tableau(g,0,2.2,-D/2+.05,5,.9,[{t:niv.ico+' '+niv.nom.toUpperCase(),s:46,y:.5}],niv.couleur);
    // escalator
    const ex=W/2-1.7;box(g,1.5,.1,6,std('#444',.6),ex,.05,D/2-3.6);
    for(let i=0;i<10;i++)box(g,1.3,.12,.4,std(i%2?'#9aa3ad':'#c8ced4',.5),ex,.2+i*.1,D/2-1.0-i*.42);
    [-.72,.72].forEach(dx=>{box(g,.06,.9,5.2,std('#222',.5),ex+dx,.8,D/2-3.4)});
    B.push({x0:ex-.9,x1:ex+.9,z0:D/2-6.4,z1:D/2-.6});
    banc(g,B,-3.2,1.6);banc(g,B,3.2,1.6);
  },
  supermarche(g,B,W,D,n){
    // un niveau du grand magasin : trois rayons garnis contre le mur du fond, un escalator à droite, les caisses au rez-de-chaussée
    const k=Math.max(1,Math.min(NIVEAUX_SUPER.length,n||1)),niv=NIVEAUX_SUPER[k-1];
    niv.rayons.forEach((r,i)=>{const x=-6.8+i*6.8;
      rayonGarni(g,B,x,-D/2+.8,5.6,r);
      tableau(g,x,3.1,-D/2+.05,5.2,.8,[{t:r.ico+' '+r.nom.toUpperCase(),s:38,y:.5}],niv.couleur)});
    tableau(g,0,3.7,-D/2+.05,8,.7,[{t:'NIVEAU '+k+' · '+niv.nom.toUpperCase(),s:34,y:.5}],'#222');
    if(k===1){
      ilot(g,B,-4.5,-.6,['mangue','banane','ananas','orange']);
      [[-2.4,3.4],[1.2,3.4]].forEach(([x,z])=>{box(g,2.4,1.0,.9,wood('#3d4a5a'),x,.5,z);box(g,.5,.38,.04,std('#1b1b1b'),x-.5,1.2,z);B.push({x0:x-1.2,x1:x+1.2,z0:z-.5,z1:z+.5});
        tableau(g,x,2.5,D/2-.05,2.2,.6,[{t:'CAISSE',s:56,y:.5}],'#1f7a4d')});
    }else ilot(g,B,-4.5,-.6,k===2?['bouteille','jus','brique','boite']:['ballon','cartable','seau','casserole']);
    // escalator
    const ex=W/2-1.7;box(g,1.5,.1,6,std('#444',.6),ex,.05,D/2-3.6);
    for(let i=0;i<10;i++)box(g,1.3,.12,.4,std(i%2?'#9aa3ad':'#c8ced4',.5),ex,.2+i*.1,D/2-1.0-i*.42);
    [-.72,.72].forEach(dx=>box(g,.06,.9,5.2,std('#222',.5),ex+dx,.8,D/2-3.4));
    B.push({x0:ex-.9,x1:ex+.9,z0:D/2-6.4,z1:D/2-.6});
    [[-8.6,3.4],[-7.9,3.4],[-7.2,3.4]].forEach(([x,z])=>{box(g,.6,.5,.9,std('#9aa3ad'),x,.55,z);box(g,.6,.04,.9,std('#c8ced4'),x,.9,z)});
  },
  autoecole(g,B,W,D,n){
    // accueil : comptoir d'inscription à gauche, salle de cours à droite
    box(g,2.6,1.05,.8,wood('#3d4a5a'),-W/2+2.7,.52,-D/2+2.2);B.push({x0:-W/2+1.4,x1:-W/2+4,z0:-D/2+1.8,z1:-D/2+2.6});
    tableau(g,-W/2+2.7,2.4,-D/2+.05,3,.8,[{t:'INSCRIPTIONS',s:64,y:.5}],'#1f5f9e');
    box(g,.5,.4,.04,std('#1b1b1b'),-W/2+2.2,1.2,-D/2+2.25);
    tableau(g,W/2-2.6,2.2,-D/2+.05,4,1.6,[{t:'LE CODE DE LA ROUTE',s:46,y:.22,c:'#fff'},{t:'🛑  ▽  ⛔  🚸',s:78,y:.66}],'#2e3b33');
    for(let r=0;r<(n>=2?3:2);r++)for(let c=0;c<3;c++)banc(g,B,W/2-4+c*1.5,.5+r*1.3);
    const vo=voiture('auto','#ffffff');vo.position.set(-W/2+2.4,0,.9);vo.rotation.y=Math.PI/2;g.add(vo);B.push({x0:-W/2+.4,x1:-W/2+4.4,z0:-.1,z1:1.9});
    tableau(g,W/2-.04,2.3,1.5,2.4,.9,[{t:'PERMIS · CONDUITE',s:50,y:.5}],'#1f5f9e').rotation.y=-Math.PI/2;
  },
  case(g,B,W,D,n){
    box(g,1.3,.04,2.2,new THREE.MeshStandardMaterial({map:T.thatchTexture(),roughness:1}),-1.2,.04,-.6);B.push({x0:-1.9,x1:-.5,z0:-1.8,z1:.5});
    cyl(g,.3,.25,.5,std('#2b2b2b',.5),1.4,.25,-1.4,12);cyl(g,.35,.3,.7,std('#a8603a',.9),1.7,.35,-.2,14);
    box(g,.8,.04,.8,std('#c0392b',.9),0,.03,.6);
  },
  maison(g,B,W,D,n){
    canape(g,B,-W/2+1.8,-D/2+.8,2.2,'#2e6da4');table(g,B,-W/2+1.8,-D/2+2.2,1.2,.8);
    box(g,1.4,.9,.1,std('#1b1b1b',.4),W/2-1.5,1.4,-D/2+.1);box(g,2,.6,.5,wood('#5a3a22'),W/2-1.5,.3,-D/2+.35);B.push({x0:W/2-2.5,x1:W/2-.5,z0:-D/2,z1:-D/2+.6});
    lit(g,B,W/2-1.2,D/2-1.7,'#1f7a4d');
    if(n>=2){lit(g,B,-W/2+1.3,D/2-1.4,'#c0392b');box(g,.9,2,.6,wood('#5a3a22'),0,1,-D/2+.4);B.push({x0:-.5,x1:.5,z0:-D/2,z1:-D/2+.7})}
    if(n>=3){for(let i=0;i<6;i++)box(g,.4,.3,.08,std('#8d8d8d',.5,{metalness:.6}),-1.2+i*.5,1.5,D/2-.2);box(g,1.6,2.3,.1,std('#bdc3c7',.4,{metalness:.7}),W/2-1.2,1.15,D/2-.2);tableau(g,-W/2+.05,2.2,0,2.4,.7,[{t:'IMMEUBLE · 3 ÉTAGES',s:60,y:.5}],'#1f5f9e')}
  },
  villa(g,B,W,D,n){
    canape(g,B,-2.2,-D/2+.9,2.8,'#8c5a2b');canape(g,B,2.2,-D/2+.9,2.8,'#8c5a2b');table(g,B,0,-D/2+2.3,1.8,1);
    box(g,1.6,1,.8,std('#1b1b1b',.3),W/2-1.3,.5,0);B.push({x0:W/2-2.1,x1:W/2-.5,z0:-.5,z1:.5});box(g,1.8,.06,.4,std('#fff'),W/2-1.3,1.02,0);
    const l=new THREE.Mesh(new THREE.SphereGeometry(.35,12,10),std('#fff6cf',.4,{emissive:0xfff0b0,emissiveIntensity:1.4}));l.position.set(0,H3(n)-.7,0);g.add(l);
    lit(g,B,-W/2+1.3,D/2-1.4,'#7d3c98');
    [-1,1].forEach(s=>{cyl(g,.25,.2,.5,std('#a8603a',.9),s*(W/2-.6),.25,-D/2+.5,10);cyl(g,.05,.05,.8,std('#2e8b57',.9),s*(W/2-.6),.9,-D/2+.5,6)});
    if(n>=2){const eau=new THREE.Mesh(new THREE.PlaneGeometry(3,1.8),new THREE.MeshStandardMaterial({color:0x3fa9d9,roughness:.2}));eau.rotation.x=-Math.PI/2;eau.position.set(-W/2+2.2,.05,D/2-1.4);g.add(eau);tableau(g,0,2.5,-D/2+.05,3,.7,[{t:'VILLA DE LUXE',s:60,y:.5}],'#5a3a22')}
  },
  ecole(g,B,W,D,n){
    tableau(g,0,2.1,-D/2+.04,5.5,1.9,[{t:'Aujourd’hui : le Congo',s:54,y:.32,c:'#fff'},{t:'2 + 3 = 5',s:46,y:.7,c:'#f1c40f'}]);
    for(let r=0;r<(n>=2?3:2);r++)for(let c=-2;c<=2;c++)banc(g,B,c*1.6,-.6+r*1.5);
    box(g,1.5,.08,.8,wood('#8d5a3b'),-W/2+1.5,.8,-D/2+1.2);B.push({x0:-W/2+.7,x1:-W/2+2.3,z0:-D/2+.8,z1:-D/2+1.6});
    if(n>=2)etagere(g,B,W/2-.6,-D/2+.5,2.6,2,['#c0392b','#2e86de','#e0a526','#1f7a4d']);
    const dr=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.95),new THREE.MeshBasicMaterial({color:0x2ecc71,side:THREE.DoubleSide}));dr.position.set(-W/2+.05,2.6,1);dr.rotation.y=Math.PI/2;g.add(dr);
  },
  sante(g,B,W,D,n){
    croix(g,0,2.4,-D/2+.05);
    box(g,2.6,1,.7,std('#e8eef0',.6),-W/2+2,.5,D/2-2.2);B.push({x0:-W/2+.7,x1:-W/2+3.3,z0:D/2-2.55,z1:D/2-1.85});
    const nb=n+1;
    for(let i=0;i<nb;i++){const x=-W/2+1.6+i*((W-3.2)/Math.max(1,nb-1)||0);const xx=nb===1?0:x;
      box(g,1.9,.45,.9,std('#f4f6f6',.7),xx,.55,-D/2+1.4);box(g,.7,.1,.5,std('#fff'),xx-.6,.82,-D/2+1.4);box(g,1,.05,.8,std('#7fb8d9',.9),xx+.3,.8,-D/2+1.4);B.push({x0:xx-1,x1:xx+1,z0:-D/2+.9,z1:-D/2+1.9});
      rideau(g,xx+1.1,-D/2+2.2,'#9ac5a4')}
    if(n>=3){box(g,1.2,.9,2,std('#d5dde0',.5,{metalness:.4}),W/2-1.5,.7,D/2-2);B.push({x0:W/2-2.1,x1:W/2-.9,z0:D/2-3,z1:D/2-1});cyl(g,.05,.05,2.4,std('#999'),W/2-1.5,1.8,D/2-2,6);const lamp=new THREE.Mesh(new THREE.SphereGeometry(.4,12,10),std('#fff',.3,{emissive:0xffffff,emissiveIntensity:1}));lamp.position.set(W/2-1.5,2.8,D/2-2);g.add(lamp)}
  },
  culture(g,B,W,D,n){
    box(g,W-1,.6,2.2,wood('#8c5a2b'),0,.3,-D/2+1.3);B.push({x0:-W/2+.5,x1:W/2-.5,z0:-D/2+.2,z1:-D/2+2.4});
    [-1,1].forEach(s=>{box(g,1.5,3.2,.1,std('#b03a2e',.9),s*(W/2-1.3),1.9,-D/2+.3)});
    for(let r=0;r<3;r++)for(let c=-3;c<=3;c++){box(g,.55,.5,.5,std('#e0a526',.8),c*1.1,.3,.5+r*1.2);B.push({x0:c*1.1-.3,x1:c*1.1+.3,z0:.2+r*1.2,z1:.8+r*1.2})}
    tableau(g,0,3.2,-D/2+.06,4.5,.8,[{t:n>=2?'CENTRE CULTUREL':'ESPACE CULTUREL',s:60,y:.5}],'#7d3c98');
    cyl(g,.2,.25,1.2,std('#8d5a3b',.9),-W/2+1,.6,0,10);box(g,.6,.5,.04,std('#f1c40f'),-W/2+1,1.3,0);
  },
  police(g,B,W,D,n){
    box(g,3.4,1.05,.7,wood('#3d4a5a'),0,.52,-.2);B.push({x0:-1.7,x1:1.7,z0:-.6,z1:.2});
    table(g,B,-W/2+1.5,-D/2+1.2,1.6,.8);box(g,.5,.4,.04,std('#1b1b1b'),-W/2+1.5,1.1,-D/2+1.1);
    for(let i=0;i<=6;i++)cyl(g,.03,.03,2.6,std('#555',.4,{metalness:.7}),W/2-2.6+i*.4,1.3,-D/2+1.9,6);box(g,2.4,.06,.06,std('#555'),W/2-1.4,2.6,-D/2+1.9);box(g,.8,.3,1.4,std('#7a8794'),W/2-1.2,.3,-D/2+.9);B.push({x0:W/2-2.7,x1:W/2-.1,z0:-D/2,z1:-D/2+2.1});
    tableau(g,0,2.5,-D/2+.04,3,.8,[{t:n>=2?'COMMISSARIAT':'POSTE DE POLICE',s:56,y:.5}],'#1c2e4a');
    if(n>=2){table(g,B,-W/2+1.5,0.8,1.6,.8);table(g,B,-W/2+3.4,1,1.6,.8)}
  },
  pompiers(g,B,W,D,n){
    box(g,5,1.9,2.4,std('#d93025',.5),-1.2,1,-.2);box(g,1.4,1.5,2.2,std('#d93025',.5),1.9,.9,-.2);box(g,4.4,.14,.28,std('#ccc'),-1.2,2.1,-.2);
    [-2.8,-.2,2.2].forEach(x=>[-1.2,1].forEach(z=>cyl(g,.4,.4,.35,std('#222'),x,.4,z,10)));B.push({x0:-3.8,x1:2.7,z0:-1.4,z1:1});
    [-1,0,1].forEach(i=>{cyl(g,.35,.35,.1,std('#b8860b',.6,{metalness:.5}),W/2-1+0,.1+.12*i,-D/2+1,12)});cyl(g,.05,.05,3.4,std('#bbb',.4,{metalness:.7}),W/2-1.6,1.7,D/2-1.6,6);
    tableau(g,0,3.2,-D/2+.04,3.5,.8,[{t:n>=2?'CASERNE':'POSTE DE POMPIERS',s:56,y:.5}],'#7b241c');
  },
  sport(g,B,W,D,n){
    box(g,W-1,.04,D-1.4,std('#3c9d4a',1),0,.04,0);box(g,.12,.05,D-1.4,std('#fff'),0,.07,0);
    cyl(g,.9,.9,.05,std('#fff'),0,.08,0,24);
  }
};
const H3=n=>3.6;

// monde intérieur (même forme que les pièces de la maison)
export function buildInterieur(t,n){
  const [W,D,H]=TAILLE(t,n);
  const g=new THREE.Group(),colliders=[],boxes=[];
  const murs={case:'#d8b78a',maison:'#efe3c8',villa:'#f4efe4',ecole:'#f1e7cf',sante:'#eef3f3',culture:'#f0d9a8',autoecole:'#f6efc9',concession:'#ece7da',supermarche:'#f2f2ea',musee:'#efe6d2',police:'#d6dde8',pompiers:'#e8d4cf',sport:'#e6e6e6'}[t];
  room(g,W,D,H,paint(murs),(t==='sante'||t==='pompiers'||t==='police'||t==='autoecole'||t==='supermarche')?dalle(t==='pompiers'?'#b9b9b9':'#d9e3e3'):sol(t==='case'?'#a8855a':'#a8744a'));
  g.children.forEach(c=>{if(c.geometry&&c.geometry.type==='PlaneGeometry'&&c.rotation.x===-Math.PI/2&&c.material.map){c.material=c.material.clone();c.material.map=c.material.map.clone();c.material.map.repeat.set(W/2,D/2);c.material.map.needsUpdate=true}});
  fenetres(g,W,H,D,Math.max(1,Math.round(D/2.4)));
  DECOR[t](g,boxes,W,D,n);
  lumiere(g,W,H);
  return {group:g,colliders,boxes,bounds:{x0:-W/2+.5,x1:W/2-.5,z0:-D/2+.6,z1:D/2-.2},update(){},exit:{x:0,z:D/2-.9},dim:{W,D}};
}
