// Bâtiments repères de la cité : grands immeubles identifiables, répartis dans le village, où l'on entre
// pour faire la mission (comme l'école). Chacun a son architecture, une grande enseigne sur le toit et son véhicule ou son emblème.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl} from './world.js';
import {voiture,voitureJoueur,motoJoueur} from './trafic.js';
import {routeVoies,asphalte} from './routes.js';

const W=10,D=7;
const M=(c,r)=>std(c,r===undefined?.85:r);
const verre=()=>new THREE.MeshStandardMaterial({color:0x9fd6ff,transparent:true,opacity:.35,roughness:.1,metalness:.2});

function enseigneToit(g,H,titre,sous,bg,ico){
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(8.4,1.9),new THREE.MeshStandardMaterial({map:T.textBoard([{t:ico+' '+titre,s:92,y:.38},{t:sous,s:44,y:.8,b:false,c:'#ffe9a8'}],1024,232,bg,'#ffffff'),roughness:.6}));
  pl.position.set(0,H+1.7,D/2-.4);g.add(pl);
  [-3.6,3.6].forEach(x=>box(g,.18,1.5,.18,M('#333'),x,H+.75,D/2-.45));
  const dos=pl.clone();dos.rotation.y=Math.PI;dos.position.z=D/2-.5;g.add(dos);
}
function fenetres(g,H,niv,porte){
  for(let r=0;r<niv;r++)for(let i=-3;i<=3;i++){
    if(r===0&&Math.abs(i)<=1)continue;
    box(g,.9,1.1,.1,M('#cfeaff',.2),i*1.3,1.4+r*2.5,D/2+.02);
  }
}
function porte(g,col){
  box(g,2,2.6,.2,M('#4a2f1b',.8),0,1.3,D/2+.05);
  box(g,3.2,.25,1.6,M(col||'#c9c9c9'),0,2.9,D/2+.8);
  [-1.5,1.5].forEach(x=>box(g,.2,2.9,.2,M('#e8e8e8'),x,1.45,D/2+1.5));
  box(g,3,.18,1.6,M('#bdbdbd'),0,.09,D/2+.9);
}
function mat3(mur,H){return box}

export const MODELES={
  police(g,o={}){
    const H=7;box(g,W,H,D,M('#6f8fb5'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#2b3f5c'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#2b3f5c');box(g,W,.4,.2,M('#2e4a7a'),0,3.9,D/2+.06);
    [-1,1].forEach(s=>{box(g,.7,.4,.5,new THREE.MeshBasicMaterial({color:s<0?0x2e7bff:0xe74c3c}),s*.8,H+.7,0)});
    cyl(g,.1,.12,6,M('#999'),-W/2+.8,3,D/2+1.2,8);box(g,1.6,1,.05,M('#1f5f9e'),-W/2+1.7,5.4,D/2+1.2);
    if(!o.compact){const v1=voiture('police');v1.position.set(-3.8,0,D/2+3.2);v1.rotation.y=Math.PI/2;g.add(v1);
    const v2=voiture('police');v2.position.set(3.8,0,D/2+3.2);v2.rotation.y=-Math.PI/2+.1;g.add(v2)}
    enseigneToit(g,H,'POLICE','Commissariat · Sécurité','#1c2e4a','🚓');
  },
  univ(g,o={}){
    const H=9;box(g,W,H,D,M('#b5532f'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#7a3a22'),0,H+.25,0);
    fenetres(g,H,3);porte(g,'#e8e8e8');
    if(!o.compact){[-3,-1,1,3].forEach(x=>cyl(g,.35,.4,H-1,M('#f1ede2'),x,(H-1)/2+.3,D/2+2.3,12));   // portique
    box(g,8,.5,3,M('#f1ede2'),0,H-.4,D/2+1.8);
    const fr=new THREE.Mesh(new THREE.ConeGeometry(4.6,1.6,3),M('#f1ede2'));fr.rotation.y=Math.PI/2;fr.scale.set(1,1,.35);fr.position.set(0,H+.4,D/2+2.1);fr.rotation.z=0;g.add(fr)}
    box(g,3,3.5,3,M('#8c3f22'),0,H+2,-.5);
    const cl=new THREE.Mesh(new THREE.CircleGeometry(.9,24),new THREE.MeshBasicMaterial({color:0xf8f4e6}));cl.position.set(0,H+2.3,1.02);g.add(cl);
    const d=new THREE.Mesh(new THREE.SphereGeometry(1.7,18,10,0,Math.PI*2,0,Math.PI/2),M('#2b6aa3',.5));d.position.set(0,H+3.7,-.5);g.add(d);
    enseigneToit(g,H+4.6,'UNIVERSITÉ','Savoir et recherche','#7d3c98','🎓');
  },
  sante(g,o={}){
    const H=7;box(g,W,H,D,M('#f2f5f5'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#c9cfd1'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#d93025');
    box(g,2.8,.8,.1,M('#c0392b'),0,5.2,D/2+.08);box(g,.8,2.8,.1,M('#c0392b'),0,5.2,D/2+.08);
    if(!o.compact){const am=voiture('ambulance');am.position.set(-3.6,0,D/2+3.2);am.rotation.y=Math.PI/2;g.add(am)}
    const h=new THREE.Mesh(new THREE.CircleGeometry(1.8,24),new THREE.MeshStandardMaterial({color:0x444444}));h.rotation.x=-Math.PI/2;h.position.set(2,H+.52,-.5);g.add(h);
    box(g,.25,.02,1.6,M('#fff'),1.6,H+.54,-.5);box(g,.25,.02,1.6,M('#fff'),2.4,H+.54,-.5);box(g,.8,.02,.25,M('#fff'),2,H+.54,-.5);
    enseigneToit(g,H,'CENTRE DE SANTÉ','Soins pour tous','#1f7a4d','🏥');
  },
  biblio(g,o={}){
    const H=7;box(g,W,H,D,M('#efe3c8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#8c5a2b'),0,H+.25,0);
    fenetres(g,H,2);porte(g,'#8c5a2b');
    if(!o.compact){[-3.6,-1.2,1.2,3.6].forEach(x=>cyl(g,.3,.34,H-1.2,M('#f7f1e1'),x,(H-1.2)/2+.3,D/2+1.9,12));
    box(g,8.6,.4,2.6,M('#f7f1e1'),0,H-.7,D/2+1.6);
    for(let i=0;i<3;i++)box(g,9,.18,1.2-i*.25,M('#cfc6b2'),0,.09+i*.18,D/2+1.2+ (2-i)*.3);
    [[-4.2,'#c0392b'],[-3.7,'#2e86de'],[-3.2,'#e0a526'],[3.2,'#1f7a4d'],[3.7,'#8e44ad'],[4.2,'#d35400']].forEach(([x,c],i)=>box(g,.35,1.3+(i%3)*.2,.9,M(c),x,.9,D/2+4.2))}
    enseigneToit(g,H,'BIBLIOTHÈQUE','Lire · Apprendre · Rêver','#8c5a2b','📚');
  },
  autoecole(g){
    const H=6;box(g,W,H,D,M('#f4d03f'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1f5f9e'),0,H+.25,0);
    box(g,W,.7,.2,M('#1f5f9e'),0,H*.55,D/2+.06);fenetres(g,H,2);porte(g,'#1f5f9e');
    const v=voiture('auto','#ffffff');v.position.set(-3.6,0,D/2+3.4);v.rotation.y=Math.PI/2;g.add(v);box(g,.6,.3,.25,M('#e0a526'),-3.6,1.8,D/2+3.4);
    [2,3,4,5].forEach(x=>cyl(g,.2,.32,.6,M('#e67e22'),x,.3,D/2+3.2,10));
    box(g,.12,2.4,.12,M('#555'),4.2,1.2,D/2+4.4);box(g,1.1,1.1,.08,M('#c0392b'),4.2,2.7,D/2+4.4);
    enseigneToit(g,H,'AUTO-ÉCOLE','Permis · Conduite · Sécurité','#1f5f9e','🚦');
  },
  hopital(g){
    // hôpital : grand bâtiment blanc, bandeau bleu, croix rouge, fenêtres, ambulance devant
    const BW=14,BD=9,H=7;
    box(g,BW,H,BD,M('#f4f7f9'),0,H/2,0);box(g,BW+.5,.5,BD+.5,M('#1b6ca8'),0,H+.25,0);box(g,BW,.8,.2,M('#1b9aa8'),0,5.4,BD/2+.02);
    for(let r=0;r<2;r++)for(let c=-2;c<=2;c++)box(g,1.4,1.2,.12,new THREE.MeshStandardMaterial({color:0x9fd3f5,transparent:true,opacity:.7}),c*2.4,2.3+r*2.4,BD/2+.02);
    box(g,3.2,2.8,.15,M('#2b6e8f'),0,1.4,BD/2+.03);box(g,2.6,2.4,.1,new THREE.MeshStandardMaterial({color:0x9fd3f5,transparent:true,opacity:.6}),0,1.3,BD/2+.06);box(g,5,.3,1.6,M('#ffffff'),0,3,BD/2+.9);
    box(g,1.6,.5,.2,M('#d6302b'),0,H+1.4,BD/2-.5);box(g,.5,1.6,.2,M('#d6302b'),0,H+1.4,BD/2-.5);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(9,1.3),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🏥 BOYEKOLI MEDICAL CENTER',s:80,y:.5}],1024,150,'#1b6ca8','#ffffff')}));pl.position.set(0,H+2.8,BD/2-.6);g.add(pl);
    // ambulance garée devant
    box(g,4,1.3,1.8,M('#ffffff'),-5.8,1,BD/2+3);box(g,1.2,1,1.7,M('#ffffff'),-3.4,.9,BD/2+3);box(g,4.1,.2,1.85,M('#d6302b'),-5.8,.7,BD/2+3);box(g,.2,.9,.4,M('#d6302b'),-6,1.4,BD/2+3.92);box(g,.5,.2,.5,M('#2c7fb8'),-4.2,1.75,BD/2+3);
    [[-7,1],[-4.4,1]].forEach(([x,z])=>cyl(g,.35,.35,.3,M('#222'),x,.35,BD/2+3+z*.8,12));
  },
  agence(g){
    // agence de détectives : façade bleu nuit, store beige, grande loupe et chapeau sur le toit
    const BW=9,BD=7,H=4.2;
    box(g,BW,H,BD,M('#2b3f6b'),0,H/2,0);box(g,BW+.5,.4,BD+.5,M('#1b2744'),0,H+.2,0);
    box(g,BW*.9,.15,BD*.9,M('#d9d2c2'),0,H+.5,0);
    box(g,1.4,2.4,.15,M('#4a2f1b'),-1.6,1.2,BD/2+.02);box(g,1.6,1.4,.12,new THREE.MeshStandardMaterial({color:0x9fd3f5,transparent:true,opacity:.6}),2,1.8,BD/2+.02);
    box(g,5.2,.35,1.3,M('#e0c07a'),0,2.9,BD/2+.7);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(7.6,1.5),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🕵️ AGENCE DE DÉTECTIVES',s:70,y:.42},{t:'BOYEKOLI · Enquêtes pour jeunes détectives',s:34,y:.78,b:false,c:'#ffe9a8'}],1024,200,'#1b2744','#ffffff'),roughness:.6}));
    pl.position.set(0,H+1.4,BD/2-.2);g.add(pl);
    // loupe géante
    const lp=new THREE.Mesh(new THREE.TorusGeometry(.7,.1,10,24),M('#caa24a',.3,.6));lp.position.set(3.2,H+1.6,BD/2-.3);g.add(lp);
    const lv=new THREE.Mesh(new THREE.CircleGeometry(.62,20),new THREE.MeshStandardMaterial({color:0x9fd3f5,transparent:true,opacity:.45}));lv.position.set(3.2,H+1.6,BD/2-.28);g.add(lv);
    const mn=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,1.1,8),M('#6b4423'));mn.position.set(3.75,H+.95,BD/2-.3);mn.rotation.z=.7;g.add(mn);
    // chapeau de détective
    box(g,1.1,.12,1.1,M('#3a2a1a'),-3,H+.6,BD/2-.5);box(g,.7,.35,.7,M('#3a2a1a'),-3,H+.8,BD/2-.5);
    // véhicule d'enquête garé
    box(g,1.8,.7,3.4,M('#d6302b'),-5.8,.55,2.2);box(g,1.5,.6,1.7,M('#b02820'),-5.8,1.2,2.4);box(g,.5,.2,.8,M('#2c7fb8'),-5.8,1.6,2.4);
  },
  centre(g){
    // grand centre commercial moderne : façade vitrée, ossature blanche, enseigne lumineuse, trois niveaux
    const BW=16,BD=7.5,H=12.5;
    box(g,BW,H,BD,M('#e9eef2'),0,H/2,0);
    const vitre=new THREE.MeshStandardMaterial({color:0x6fb7e6,transparent:true,opacity:.55,roughness:.08,metalness:.35});
    [1.6,5.1,8.6].forEach(y=>{const v=new THREE.Mesh(new THREE.PlaneGeometry(BW-1.2,2.6),vitre);v.position.set(0,y+1.3,BD/2+.06);g.add(v);
      for(let i=-6;i<=6;i++)box(g,.1,2.6,.1,M('#ffffff'),i*1.2,y+1.3,BD/2+.09)});
    [3.4,6.9,10.4].forEach(y=>box(g,BW+.4,.3,BD+.4,M('#ffffff'),0,y,0));
    box(g,BW+.6,.6,BD+.6,M('#1f5f9e'),0,H+.3,0);
    box(g,5.2,3.4,.3,M('#1f5f9e'),0,1.7,BD/2+.9);box(g,4.6,2.8,.12,vitre,0,1.5,BD/2+.9);                  // entrée vitrée
    box(g,6.4,.25,1.5,M('#ffffff'),0,3.4,BD/2+.75);                                                        // auvent
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(13,2.2),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🛒 CENTRE COMMERCIAL',s:92,y:.36},{t:'Matériaux · Bourse d’échange · Boutiques',s:46,y:.78,b:false,c:'#ffe9a8'}],1536,260,'#1f5f9e','#ffffff'),emissive:0x112244,emissiveIntensity:.35,roughness:.5}));
    pl.position.set(0,H+1.9,BD/2-.4);g.add(pl);
    [-5.5,5.5].forEach(x=>box(g,.25,1.6,.25,M('#333'),x,H+.85,BD/2-.45));
    [-7,-3.5,3.5,7].forEach(x=>{box(g,2.4,.12,1.4,M('#9aa3ad',.5),x,.06,BD/2+3.6);box(g,.1,1.5,.1,M('#555'),x,.8,BD/2+3.6)});   // bancs et lampes
  },
  musee(g){
    const H=24;box(g,W,H,D,M('#e9dcc0'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#8c5a2b'),0,H+.25,0);
    [3,6,9,12,15,18,21].forEach(y=>box(g,W+.2,.18,D+.2,M('#b8956a'),0,y,0));          // plateaux des étages
    fenetres(g,H,8);porte(g,'#8c5a2b');
    [-3.6,-1.2,1.2,3.6].forEach(x=>cyl(g,.3,.34,H-1.2,M('#f7f1e1'),x,(H-1.2)/2+.3,D/2+1.9,12));
    box(g,9,.4,2.6,M('#f7f1e1'),0,4.6,D/2+1.6);
    [[-6,'#c0392b'],[6,'#2e86de']].forEach(([x,c])=>{cyl(g,.06,.06,5,M('#777'),x,2.5,D/2+4.2,6);box(g,1.1,.7,.04,M(c),x+(x<0?.6:-.6),4.7,D/2+4.2)});
    enseigneToit(g,H,'MUSÉE DU CONGO','Histoire · Cultures · Nature','#8c5a2b','🏺');
  },
  supermarche(g){
    const H=6;box(g,W,H,D,M('#f4f1e8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1f7a4d'),0,H+.25,0);
    box(g,W,1,.2,M('#1f7a4d'),0,H*.55,D/2+.06);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.1,D/2+.06);g.add(vi);
    porte(g,'#1f7a4d');
    [-3.8,-3.1,-2.4].forEach(x=>{box(g,.6,.5,.9,M('#9aa3ad'),x,.55,D/2+2.9);box(g,.6,.04,.9,M('#c8ced4'),x,.9,D/2+2.9)});   // chariots
    [3.2,4.4].forEach((x,i)=>box(g,.9,.8,.9,M(i?'#e0a526':'#c0392b'),x,.4,D/2+2.8));                                         // cageots de fruits
    enseigneToit(g,H,'SUPERMARCHÉ','Tout pour la maison · Bons prix','#1f7a4d','🛒');
  },
  labo(g){
    const H=6;box(g,W,H,D,M('#e8f1f2'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1b9aa8'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.3,D/2+.06);g.add(vi);porte(g,'#1b9aa8');
    // flacon d'Erlenmeyer géant sur le toit et cheminée
    const fl=new THREE.Mesh(new THREE.ConeGeometry(1.1,1.8,20),new THREE.MeshStandardMaterial({color:0x7fe0a8,transparent:true,opacity:.75}));fl.position.set(-3.2,H+1.4,-1);g.add(fl);cyl(g,.3,.3,1,M('#cfeaff',.2),-3.2,H+2.7,-1,12);
    box(g,.6,1.8,.6,M('#8a8d91'),3.4,H+1.2,-1.5);
    [-1,1].forEach(x=>{const c=cyl(g,.5,.5,.2,M('#ffffff'),x*3.3,.1,D/2+3.4,16)});
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,'SCIENCE LAB','Chimie · Biologie · Physique','#1b9aa8','🔬');
  },
  design(g){
    const H=6;box(g,W,H,D,M('#d9b48a'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#7a4a1e'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.3,D/2+.06);g.add(vi);porte(g,'#c9733d');
    // maquette de maison sur le toit : murs et toit en pyramide
    box(g,2.2,1.3,1.8,M('#f2e3c6'),-3,H+1.15,-1);const py=new THREE.Mesh(new THREE.ConeGeometry(1.9,1,4),M('#b5503c'));py.rotation.y=Math.PI/4;py.position.set(-3,H+1.8+.35,-1);g.add(py);
    box(g,.12,1.8,.12,M('#444'),3,H+1,-1);box(g,1.6,.9,.08,M('#f4d35e'),3.7,H+1.5,-1);
    [-3.3,3.3].forEach(x=>box(g,.9,.5,.9,M('#a5532f'),x,.25,D/2+2.2));
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,'DESIGN STUDIO','Architecture · Décoration','#c9733d','🏠');
  },
  modestudio(g){
    const H=6;box(g,W,H,D,M('#f3d9e8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#6a1b9a'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.3,D/2+.06);g.add(vi);porte(g,'#e84393');
    // deux mannequins de vitrine
    [[-2.4,'#e84393'],[2.4,'#1b9aa8']].forEach(([x,c])=>{const k=new THREE.Mesh(new THREE.ConeGeometry(.55,1.4,14),M(c));k.position.set(x,.8,D/2-.8);g.add(k);const h=new THREE.Mesh(new THREE.SphereGeometry(.2,12,10),M('#7a4a2e'));h.position.set(x,1.7,D/2-.8);g.add(h)});
    // ruban de couturière géant au-dessus de la porte
    box(g,4.5,.25,.08,M('#f4c20d'),0,3.4,D/2+.1);for(let i=-4;i<=4;i++)box(g,.05,.25,.1,M('#222'),i*.5,3.4,D/2+.12);
    [-3.3,3.3].forEach(x=>box(g,.7,2.2,.7,M(x<0?'#e84393':'#6a1b9a'),x,1.1,D/2+2.2));
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,'FASHION STUDIO','Mode · Couture · Coiffure','#6a1b9a','👗');
  },
  espace(g){
    const H=6;box(g,W,H,D,M('#e6e8f2'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#1a1f5e'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3),verre());vi.position.set(0,2.3,D/2+.06);g.add(vi);porte(g,'#6a2fa0');
    // fusée sur le toit, coupole de télescope
    cyl(g,.5,.5,3,M('#ffffff'),-3,H+1.6,-1,14);const nz=new THREE.Mesh(new THREE.ConeGeometry(.5,1.2,14),M('#d6302b'));nz.position.set(-3,H+3.7,-1);g.add(nz);[-1,1].forEach(s=>box(g,.1,1.2,.7,M('#d6302b'),-3+s*.6,H+.9,-1));
    const dm=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,10,0,Math.PI*2,0,Math.PI/2),M('#cfd3e0'));dm.position.set(3,H,-1);g.add(dm);
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,'SPACE EXPLORER','Fusées · Planètes · Astronautes','#1a1f5e','🚀');
  },
  ferme(g){
    const H=5;box(g,W,H,D,M('#b5603a'),0,H/2,0);const rf=new THREE.Mesh(new THREE.ConeGeometry(7.4,2.6,4),M('#7a4a2e'));rf.rotation.y=Math.PI/4;rf.scale.set(1,1,.72);rf.position.y=H+1.3;g.add(rf);
    box(g,3,3.6,.2,M('#6b4423'),0,1.8,D/2+.05);box(g,3.4,.3,1.6,M('#c9c9c9'),0,3.8,D/2+.8);
    [-2.8,2.8].forEach(x=>{box(g,.9,.9,.9,M('#e8c04a'),x,.45,D/2+2.2);box(g,.9,.9,.9,M('#8a5a2b'),x+1,.45,D/2+2.2)});
    for(let i=-3;i<=3;i++){const t=new THREE.Mesh(new THREE.ConeGeometry(.25,.8,6),M('#4f9c3c'));t.position.set(i*1.1,.4,-D/2-1.2);g.add(t)}
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,'BOYEKOLI FARM','Agriculture · Élevage','#2e6a2a','🌾');
  },
  taxi(g){
    const H=4.6;box(g,W,H,D,M('#f2e6b8'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#d4a017'),0,H+.25,0);porte(g,'#d4a017');
    [-3,3].forEach(x=>{box(g,2.2,.9,4,M('#e8c020'),x,.6,D/2+3);box(g,1.9,.6,2,M('#e8c020'),x,1.3,D/2+3)});
    box(g,8.5,.05,4.6,M('#4b4d52'),0,.03,D/2+3);enseigneToit(g,H,'BOYEKOLI TAXI','Moto · Taxi · Minibus','#d4a017','🚕');
  },
  magasin(g,r){
    const H=5,col=(r&&r.coul)||'#1f7a4d';box(g,W,H,D,M('#f0ead8'),0,H/2,0);box(g,W+.6,.5,D+.6,M(col),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,2.6),verre());vi.position.set(0,2.1,D/2+.06);g.add(vi);porte(g,col);
    [-3.4,3.4].forEach(x=>{box(g,.9,1.1,.9,M('#e8c04a'),x,.55,D/2+2.2)});
    box(g,8.5,.05,4.4,M('#4b4d52'),0,.03,D/2+3.6);for(let i=-3;i<=3;i++)box(g,.1,.06,3.4,M('#f2f2f2'),i*1.15,.05,D/2+3.6);
    enseigneToit(g,H,((r&&r.nom)||'COMMERCE').toUpperCase().slice(0,22),'Propriété du joueur',col,(r&&r.ico)||'🏪');
  },
  concession(g){
    const H=6;box(g,W,H,D,M('#2b2b2b'),0,H/2,0);box(g,W+.6,.5,D+.6,M('#b8860b'),0,H+.25,0);
    const vi=new THREE.Mesh(new THREE.PlaneGeometry(8,3.6),verre());vi.position.set(0,2.2,D/2+.06);g.add(vi);
    box(g,8.2,.2,.2,M('#b8860b'),0,4.1,D/2+.1);porte(g,'#b8860b');
    const sa=voitureJoueur('#c0392b');sa.position.set(-3,.3,D/2+2.2);sa.rotation.y=Math.PI/2+.4;sa.scale.setScalar(.95);g.add(sa);box(g,4.6,.3,3,M('#e0d6b8'),-3,.15,D/2+2.2);
    const sm=motoJoueur('#2e86de');sm.position.set(3.2,.3,D/2+2.2);sm.rotation.y=Math.PI/2-.4;g.add(sm);box(g,3,.3,2,M('#e0d6b8'),3.2,.15,D/2+2.2);
    [-4.6,4.6].forEach(x=>{cyl(g,.06,.06,5,M('#777'),x,2.5,D/2+4.2,6);box(g,1.1,.7,.04,M(x<0?'#e74c3c':'#f1c40f'),x+(x<0?.6:-.6),4.7,D/2+4.2)});
    enseigneToit(g,H,'CONCESSION','Motos · Voitures','#b8860b','🏍');
  }
};


// BOULEVARD DES MÉTIERS : une vraie route bitumée (2 voies, trottoirs, lampadaires) qui longe tous les bâtiments de missions
// (hôpital, agence, ferme, laboratoire, design, mode, espace…) et rejoint la route du village. La station de taxis est
// de l'autre côté, avec son parking : on y entre en véhicule par le boulevard.
function boulevardMetiers(g){
  const asph=asphalte(),trot=new THREE.MeshStandardMaterial({color:0xb9b4a6,roughness:.95,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const blanc=new THREE.MeshBasicMaterial({color:0xf2f2f2,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-5}),jaune=new THREE.MeshBasicMaterial({color:0xe8c547,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-5});
  const flat=(w,d,x,z,m,y,ry)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(w,d),m);p.rotation.x=-Math.PI/2;if(ry)p.rotation.z=ry;p.position.set(x,y||.034,z);p.receiveShadow=true;g.add(p);return p};
  const X=-37,Z0=-92,Z1=84,L=Z1-Z0,ZC=(Z0+Z1)/2;
  flat(8,L,X,ZC,asph);flat(1.8,L,X-4.9,ZC,trot,.04);flat(1.8,L,X+4.9,ZC,trot,.04);
  for(let z=Z0+2;z<Z1-1;z+=4.2)flat(.18,1.9,X,z+.9,blanc,.04);
  flat(.12,L,X-3.7,ZC,blanc,.04);flat(.12,L,X+3.7,ZC,blanc,.04);
  // passages piétons devant chaque porte de mission
  [-70,-58,-46,-34,-22,-10,6,28,40,52].forEach(z=>{for(let i=-3;i<=3;i++)flat(.7,2.6,X+i*1.05,z,blanc,.041)});
  // lampadaires
  const gris=std('#8a8f96',.6);for(let z=Z0+6;z<Z1;z+=16){[-1,1].forEach(s=>{const x=X+s*5.9;cyl(g,.09,.12,5.2,gris,x,2.6,z+(s>0?8:0),6);box(g,1.2,.12,.12,gris,x-s*.6,5.2,z+(s>0?8:0));box(g,.4,.14,.3,new THREE.MeshBasicMaterial({color:0xfff2b8}),x-s*1.2,5.1,z+(s>0?8:0))})}
  // panneaux d'entrée du boulevard
  [[Z0+4,'#1b6ca8'],[Z1-4,'#1b6ca8']].forEach(([z])=>{const b=new THREE.Mesh(new THREE.PlaneGeometry(5.2,1.2),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'BOULEVARD DES MÉTIERS',s:56}],1024,240,'#1b6ca8','#ffffff'),roughness:.6,side:THREE.DoubleSide}));b.position.set(X,5.6,z);b.rotation.y=Math.PI/2;g.add(b);[-1,1].forEach(s=>cyl(g,.1,.1,5.6,gris,X,2.8,z+s*2.7,6))});
  // PARKING des taxis, face au boulevard
  flat(10,19,-28.4,-50,asph,.05);
  for(let z=-59;z<=-41;z+=3)flat(8.6,.12,-28.4,z,blanc,.052);flat(.14,19,-23.7,-50,blanc,.052);
  [[-57,'#e8b800'],[-54,'#2e86de'],[-48,'#e8b800'],[-45,'#e8b800'],[-51,'#c0392b']].forEach(([z,c],i)=>{if(i===4)return;const v=voiture('auto',c);v.position.set(-27.4,0,z);v.rotation.y=Math.PI/2;g.add(v)});
  const pk=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.6),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'P',s:120,y:.45},{t:'TAXIS',s:46,y:.85}],512,320,'#1b6ca8','#ffffff'),roughness:.6,side:THREE.DoubleSide}));pk.position.set(-32.3,2.8,-60.2);pk.rotation.y=Math.PI/2;g.add(pk);cyl(g,.08,.08,2.8,gris,-32.3,1.4,-60.2,6);
}

// emplacements dans le village (portes tournées vers la grand-place) ; ry 0 : porte au sud (+z), ry π : porte au nord (-z)
export const REPERES=[
  {id:'centre',x:3,z:-11.8,ry:0,w:16,d:7.5,interieur:'centre',nom:'le Centre commercial',coul:'#1f5f9e'},
  {id:'taxi',x:-19,z:-50,ry:-Math.PI/2,w:10,d:7,nom:'la Station de taxis',coul:'#d4a017',norot:true},
  {id:'ferme',x:-47,z:-72,ry:Math.PI/2,w:10,d:7,nom:'la Ferme école',coul:'#2e6a2a',norot:true},
  {id:'espace',x:-47,z:-48,ry:Math.PI/2,w:10,d:7,nom:'la Cité de l’espace',coul:'#1a1f5e',norot:true},
  {id:'labo',x:-47,z:-60,ry:Math.PI/2,w:10,d:7,nom:'le Science Lab',coul:'#1b9aa8',norot:true},
  {id:'design',x:-47,z:40,ry:Math.PI/2,w:10,d:7,nom:'le Design Studio',coul:'#c9733d',norot:true},
  {id:'modestudio',x:-47,z:-24,ry:Math.PI/2,w:10,d:7,nom:'le Fashion Studio',coul:'#6a1b9a',norot:true},
  {id:'hopital',x:-47,z:26,ry:Math.PI/2,w:14,d:9,nom:'l’Hôpital',coul:'#1b6ca8',norot:true},
  {id:'agence',x:-47,z:52,ry:Math.PI/2,w:9,d:7,nom:'l’Agence de détectives',coul:'#2b3f6b',norot:true},
  {id:'concession',x:-22.2,z:9.6,ry:Math.PI,interieur:'concession',nom:'la Concession',coul:'#b8860b'},
  {id:'supermarche',x:-24,z:30,ry:0,interieur:'supermarche',nom:'le Supermarché',coul:'#1f7a4d'},
  {id:'musee',x:28,z:31,ry:0,interieur:'musee',nom:'le Musée du Congo',coul:'#8c5a2b'},
  {id:'autoecole',x:8.2,z:9.6,ry:Math.PI,interieur:'autoecole',nom:'l’Auto-école',coul:'#1f5f9e'}
];

export function construireReperes(w,ov,extra){
  const g=new THREE.Group();w.group.add(g);
  const portes=[];
  REPERES.concat(extra||[]).map(r0=>Object.assign({},r0,(ov&&ov[r0.id])||{})).forEach(r=>{
    const b=new THREE.Group();b.position.set(r.x,0,r.z);b.rotation.y=r.ry;g.add(b);const rot90=Math.abs(Math.sin(r.ry))>.5;b.userData.edit={type:'rep',id:r.id,nom:r.nom,w:rot90?(r.d||D):(r.w||W),d:rot90?(r.w||W):(r.d||D),norot:!!r.norot};
    MODELES[r.modele||(r.id==='police'?'police':r.id==='univ'?'univ':r.id==='sante'?'sante':r.id==='biblio'?'biblio':r.id)](b,r);
    const cs=Math.cos(r.ry),sn=Math.sin(r.ry);
    // emprise (le véhicule garé devant reste traversable)
    const bw=r.w||W,bd=r.d||D,ex=rot90?bd:bw,ez=rot90?bw:bd;w.boxes.push({x0:r.x-ex/2,x1:r.x+ex/2,z0:r.z-ez/2,z1:r.z+ez/2});
    const dz=bd/2+1.4;
    portes.push(Object.assign({},r,{px:r.x+dz*sn,pz:r.z+dz*cs}));
  });
  boulevardMetiers(g);
  return {portes};
}

// ---------- Station-service : auvent, deux pompes et une boutique. On y arrive en véhicule, on descend, on fait le plein.
// (x, z) : centre des pompes ; la boutique est derrière (côté +z local). Retourne les positions des pompes.
export function construireStation(parent,cols,bxs,x,z,nom){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);g.userData.edit={type:'station',id:'st_'+nom,nom:'la station '+nom,w:13,d:16,dz:2};
  box(g,13,.12,10,M('#8d8d8d',.95),0,.06,1.2);                                   // dalle
  box(g,13,.05,.35,M('#f1c40f'),0,.14,-3.7);                                       // ligne d'entrée
  // auvent
  box(g,11.4,.5,6.2,M('#d6232c'),0,4.5,0);box(g,11.6,.18,6.4,M('#ffffff'),0,4.2,0);
  [[-5,-2.4],[5,-2.4],[-5,2.4],[5,2.4]].forEach(([px,pz])=>{cyl(g,.22,.22,4.3,M('#e8e8e8'),px,2.15,pz,10);cols.push({x:x+px,z:z+pz,r:.45})});
  // pompes
  const pompes=[];
  [-1.8,1.8].forEach((px,i)=>{
    const c=i?'#1f5f9e':'#d6232c';
    box(g,.95,1.7,.7,M(c),px,.95,0);box(g,.8,.45,.04,M('#111'),px,1.45,.37);box(g,.5,.2,.05,M('#7CFC9a',.3),px,1.45,.4);
    box(g,.14,.5,.14,M('#222'),px-.55,.85,.2);box(g,.5,.12,.55,M('#333'),px,.06,0);
    cols.push({x:x+px,z:z,r:.7});pompes.push({x:x+px,z:z});
  });
  // boutique
  box(g,8,3.4,3.2,M('#f2e6c9'),0,1.7,5.4);box(g,8.4,.35,3.6,M('#d6232c'),0,3.55,5.4);
  box(g,5.2,1.6,.08,verre(),0,1.7,3.76);box(g,1.1,2.2,.1,M('#4a2f1b'),2.8,1.1,3.78);
  bxs.push({x0:x-4,x1:x+4,z0:z+3.8,z1:z+7});
  // grande enseigne haute, visible de loin
  cyl(g,.13,.16,7.4,M('#444'),-6.4,3.7,-3.2,8);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'⛽ STATION',s:104,y:.3},{t:nom||'SERVICE',s:70,y:.62},{t:'Carburant · 🪙',s:48,y:.86,b:false,c:'#ffe9a8'}],1024,598,'#c0392b','#ffffff'),roughness:.6}));
  pl.position.set(-6.4,7.6,-3.2);g.add(pl);const dos=pl.clone();dos.rotation.y=Math.PI;dos.position.z=-3.25;g.add(dos);
  // bidons et pneus
  [[5.2,3.2],[5.8,3.2]].forEach(([px,pz],i)=>cyl(g,.28,.28,.8,M(i?'#d6232c':'#1f5f9e'),px,.4,pz,10));
  return {pompes:pompes,x:x,z:z};
}

// ---------- Gare : un train, un quai et un petit bâtiment. On y prend le train pour partir à l'aventure.
export function construireGare(parent,cols,bxs,x,z,ry){
  const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry===undefined?Math.PI/2:ry;parent.add(g);g.userData.edit={type:'gare',id:'gare',nom:'la Gare',w:12,d:8};   // la voie longe le mur ouest du village
  box(g,12,.08,1.8,M('#5a5a5a',.95),0,.04,-1.8);                                  // ballast
  [-.7,.7].forEach(dz=>box(g,12,.06,.08,M('#8a8a8a',.4),0,.1,-1.8+dz));           // rails
  for(let i=-5;i<=5;i++)box(g,.18,.05,1.7,M('#5a3a22'),i*1.05,.07,-1.8);            // traverses
  box(g,11,.3,2.4,M('#b9b9b9',.9),0,.15,1.5);                                       // quai
  box(g,11,.06,.2,M('#f1c40f'),0,.31,.4);                                           // ligne jaune
  // train : locomotive verte et deux wagons
  const corps=[['#1f7a4d',3.2,2.0],['#e0a526',3.0,1.7],['#1d4f91',3.0,1.7]];
  let cx=-4.9;
  corps.forEach(([c,l,h],i)=>{
    box(g,l,h,1.6,M(c,.5),cx+l/2,h/2+.45,-1.8);
    box(g,l-.2,.12,1.7,M('#3a3a3a'),cx+l/2,.5,-1.8);
    [-l/2+.5,l/2-.5].forEach(dx=>[-.8,.8].forEach(dz=>{const r=cyl(g,.34,.34,.16,M('#222'),cx+l/2+dx,.38,-1.8+dz,14);r.rotation.x=Math.PI/2}));
    for(let k=0;k<(i?3:2);k++)box(g,.55,.5,.04,M('#cfeaff',.2),cx+.7+k*.85,h*.65+.45,-.99);
    cx+=l+.15;
  });
  box(g,1.1,.6,1.2,M('#222'),-4.9+.5,2.65,-1.8);cyl(g,.18,.22,.6,M('#222'),-4.9+2.4,2.75,-1.8,10);   // cabine et cheminée
  bxs.push({x0:x-2.7,x1:x-.9,z0:z-5.4,z1:z+5.5});                              // train (repère tourné de 90°)
  // bâtiment de la gare
  box(g,4.2,3.2,2.2,M('#f4d9a0'),-3.2,1.6,3.6);box(g,4.6,.35,2.6,M('#8c2f2f'),-3.2,3.35,3.6);
  box(g,.9,1.9,.1,M('#4a2f1b'),-3.2,.95,2.48);[-4.4,-2.0].forEach(dx=>box(g,.7,.8,.1,M('#cfeaff',.2),dx,1.6,2.48));
  bxs.push({x0:x+2.5,x1:x+4.7,z0:z+1.1,z1:z+5.3});                             // bâtiment
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🚂 GARE',s:96,y:.38},{t:'Départ pour l’aventure',s:44,y:.8,b:false,c:'#ffe9a8'}],1024,268,'#1d4f91','#ffffff'),roughness:.6}));
  pl.position.set(-3.2,4.4,2.45);g.add(pl);cyl(g,.06,.06,1.2,M('#333'),-4.9,3.8,2.45,6);cyl(g,.06,.06,1.2,M('#333'),-1.5,3.8,2.45,6);
  // abri du quai
  [-.5,4.5].forEach(dx=>cyl(g,.1,.1,2.6,M('#555'),dx,1.5,.6,8));box(g,6,.15,2.2,M('#c0392b'),2,2.85,1.3);
  return {x:x+1.2,z:z-2};
}

// ---------- Aéroport : route depuis le village, parking, terminal, tour de contrôle, aire de stationnement avec avions garés.
// Le groupe est tourné de -90° : la façade du terminal regarde vers l'ouest, vers la route (x plus petit).
export function construireAeroport(parent,cols,bxs,X0,Z0){
  const asph=M('#4a4a50',.95);asph.polygonOffset=true;asph.polygonOffsetFactor=-3;asph.polygonOffsetUnits=-4;
  const plat=(x,z,w,d,mat,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat||asph);m.rotation.x=-Math.PI/2;m.position.set(x,y||.05,z);parent.add(m);return m};
  // route bitumée depuis l'est du village jusqu'à l'aéroport : 1+1 voies, puis 2+2, 3+3 et 4+4 à l'approche du terminal
  const xr1=X0-16;
  [[36,52,1]].forEach(([xa,xb,v])=>routeVoies(parent,xa,Z0,xb,Z0,v));   // les tronçons suivants (2+2, 2+2, 4+4) sont gérés par reseau.js (modifiables)
  plat(X0-14,Z0,8,8);
  // panneaux de direction : au bout de la rue du village et à l'entrée du parking
  const pan=(x,z,txt)=>{cyl(parent,.07,.09,3,M('#555'),x,1.5,z,8);const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:txt,s:60,y:.5}],512,176,'#1f5f9e','#ffffff'),side:THREE.DoubleSide}));pl.position.set(x,3.1,z);parent.add(pl);cols.push({x,z,r:.4})};
  pan(46,Z0-5,'✈ AÉROPORT →');pan(X0-30,Z0-15.5,'✈ AÉROPORT');
  const g=new THREE.Group();g.position.set(X0,0,Z0);g.rotation.y=-Math.PI/2;parent.add(g);
  const W2=(xl,zl)=>({x:X0-zl,z:Z0+xl});
  box(g,11,.1,17,M('#5b5b60',.95),0,.05,0);
  for(let i=0;i<8;i++)box(g,.25,.02,1.4,M('#f4f4f4'),0,.11,-7+i*2);
  // terminal
  box(g,10,4.6,4.4,M('#eef1f5'),0,2.3,-6);box(g,10.4,.4,4.8,M('#1f5f9e'),0,4.8,-6);
  box(g,8.6,2.2,.1,new THREE.MeshStandardMaterial({color:0x6fb7e6,transparent:true,opacity:.55,roughness:.1}),0,2.1,-3.75);
  box(g,3,.2,1.6,M('#ffffff'),0,3.6,-3.2);box(g,1.4,2.2,.12,M('#2a2a2a'),0,1.1,-3.7);
  // tour de contrôle
  cyl(g,.7,.9,9,M('#d9dde3'),-4.2,4.5,-8.2,10);cyl(g,1.5,1,1.6,new THREE.MeshStandardMaterial({color:0x4aa0d8,transparent:true,opacity:.7}),-4.2,9.7,-8.2,10);cyl(g,1.7,1.7,.25,M('#c0392b'),-4.2,10.6,-8.2,10);
  // avions garés (modèles à ailes hautes, hélice, train d'atterrissage)
  const avion=(px,pz,ry,c,ech)=>{const a=new THREE.Group();a.position.set(px,0,pz);a.rotation.y=ry;a.scale.setScalar(ech);g.add(a);
    const bl=M('#f6f6f6',.5),ro=M(c,.5);
    const f=new THREE.Mesh(new THREE.CapsuleGeometry(.55,3.6,6,12),bl);f.rotation.x=Math.PI/2;f.position.y=1.25;a.add(f);
    const q=new THREE.Mesh(new THREE.ConeGeometry(.5,3.4,12),bl);q.rotation.x=-Math.PI/2;q.position.set(0,1.4,-4.3);a.add(q);
    const nz=new THREE.Mesh(new THREE.SphereGeometry(.56,12,8),bl);nz.position.set(0,1.2,2.2);nz.scale.set(1,.9,1.1);a.add(nz);
    box(a,10.4,.14,1.6,bl,0,2.0,.4);box(a,10.4,.15,.35,ro,0,2.0,-.3);box(a,3.6,.1,1,bl,0,1.6,-5.4);box(a,.12,1.4,1.2,ro,0,2.2,-5.3);
    [-1,1].forEach(d=>{const st=box(a,.07,1.0,.09,M('#cfcfcf'),d*1.5,1.45,.3);st.rotation.z=d*.55});
    box(a,1,.45,.05,M('#2b4a6b'),0,1.55,1.5);[-1,1].forEach(d=>box(a,.04,.4,1.3,M('#2b4a6b'),d*.56,1.6,.7));
    [[-.9,.3],[.9,.3],[0,1.8]].forEach(([wx,wz])=>{cyl(a,.06,.06,.7,M('#555'),wx,.5,wz,6);const w=cyl(a,.3,.3,.2,M('#222'),wx,.3,wz,12);w.rotation.z=Math.PI/2});
    const h=new THREE.Group();h.position.set(0,1.2,2.55);a.add(h);box(h,.2,.2,.2,M('#333'),0,0,0);box(h,.12,2.2,.04,M('#2a2a2a'),0,0,.05);
    return a};
  avion(-1,3,0.1,'#c0392b',1.1);avion(1.5,10,-0.1,'#1f5f9e',1);
  cyl(g,.06,.06,3.4,M('#888'),4.6,1.7,6,6);const mg=new THREE.Mesh(new THREE.ConeGeometry(.3,1.5,8,1,true),new THREE.MeshStandardMaterial({color:'#ff7a1a',side:THREE.DoubleSide}));mg.rotation.z=Math.PI/2;mg.position.set(5.3,3.3,6);g.add(mg);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(6,1.2),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'✈ AÉROPORT BOYEKOLI',s:80,y:.5}],1024,200,'#1f5f9e','#ffffff'),side:THREE.DoubleSide}));
  pl.position.set(0,6.2,-3.5);g.add(pl);
  // collisions (transformées en repère du village)
  const rect=(x0,x1,z0,z1)=>{const a=W2(x0,z0),b=W2(x1,z1);bxs.push({x0:Math.min(a.x,b.x),x1:Math.max(a.x,b.x),z0:Math.min(a.z,b.z),z1:Math.max(a.z,b.z)})};
  rect(-5,5,-8.2,-3.8);rect(-5,-3.5,-9.5,-6.9);rect(-4.4,2.6,1,5);rect(-2,4.2,8,12);
  const entree=W2(0,-2.2),av1=W2(0,6);
  return {hall:{x:entree.x+1.4,z:entree.z},avion:{x:W2(-1,3).x+4.2,z:W2(-1,3).z,r:5},xr1};
}

// ---------- BOYEKOLI MUSIC STUDIO : bâtiment coloré au bord de la route de l'aéroport (côté nord)
export function construireStudioMusique(parent,cols,bxs,x,z){
  const g=new THREE.Group();g.position.set(x,0,z);parent.add(g);
  box(g,18,7,8,M('#f3e6ff'),0,3.5,0);
  [-7,-3.5,0,3.5,7].forEach((dx,i)=>box(g,3,6,.15,M(['#7d3fd1','#e8a23a','#d6302b','#2e9e4a','#4aa0d8'][i]),dx,3.2,4.1));
  box(g,18.6,.6,8.6,M('#2a1a4a'),0,7.3,0);
  box(g,5,3.4,.2,new THREE.MeshStandardMaterial({color:0x6fb7e6,transparent:true,opacity:.6,roughness:.1}),0,1.7,4.15);
  box(g,6.4,.25,2.2,M('#ffffff'),0,3.6,5.1);
  // tambours géants sur le toit et haut-parleurs
  [[-7.5,'#d6302b'],[7.5,'#2e9e4a']].forEach(([dx,c])=>{cyl(g,1.6,1.6,1.4,M(c),dx,8.2,0,0,0,0,16);cyl(g,1.65,1.65,.12,M('#f2e6c9'),dx,8.95,0,0,0,0,16)});
  [[-9.6],[9.6]].forEach(([dx])=>{box(g,1.2,2.6,1,M('#161616'),dx,1.3,3.4);[.6,1.7].forEach(y=>cyl(g,.4,.4,.1,M('#444'),dx,y,3.95,Math.PI/2,0,0,12))});
  const cv=new THREE.Mesh(new THREE.PlaneGeometry(15,2.4),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🎵 BOYEKOLI MUSIC STUDIO',s:86,y:.42},{t:'Découvre, joue et compose !',s:46,y:.82,b:false,c:'#ffe9a8'}],1536,240,'#4a1f8a','#ffffff'),emissive:0x331166,emissiveIntensity:.5}));
  cv.position.set(0,9.9,3.6);g.add(cv);
  // notes décoratives
  ['♪','♫','♬'].forEach((n,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(1.8,1.8),new THREE.MeshBasicMaterial({map:T.textBoard([{t:n,s:150,y:.5}],128,128,'#7d3fd1','#ffd54f')}));p.position.set(-6+i*6,5.6,4.25);g.add(p)});
  bxs.push({x0:x-9.2,x1:x+9.2,z0:z-4.4,z1:z+4.4});
  const pan=(px,pz)=>{cyl(parent,.07,.09,3,M('#555'),px,1.5,pz,8);const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.4,1.1),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🎵 STUDIO MUSIQUE',s:56,y:.5}],512,176,'#7d3fd1','#ffffff'),side:THREE.DoubleSide}));pl.position.set(px,3.1,pz);parent.add(pl);cols.push({x:px,z:pz,r:.4})};
  pan(x-14,z+4.2);
  return {x:x,z:z+5.6};
}
