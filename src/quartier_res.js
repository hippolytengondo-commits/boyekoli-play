import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl,gableRoof} from './world.js';
import {CX} from './quartiers.js';
import {bitumeDroit,coutRoute,rondPoint,trottoirsDroit} from './routes.js';
import {voiture} from './trafic.js';

// Quartier résidentiel du joueur, au nord du village (du côté opposé à la ville des missions).
// Le joueur y achète des terrains avec ses points de savoir (gagnés en réussissant des missions) puis y construit
// des maisons avec des pièces et des matériaux. Les terrains s'achètent dans l'ordre et deviennent de plus en plus chers.
export const NB_TERRAINS=20;
const PAS=14,Z0=-27,DEMI=5.5;          // pas entre rangées, centre de la 1re rangée, demi-côté d'un terrain
export const prixTerrain=k=>500+100*k*(k+1);
// Catalogue des constructions : chaque type a des niveaux successifs (améliorations).
// cout : pieces, savoir (points de savoir) et matériaux ; double : le niveau exige aussi un terrain voisin libre (annexe).
export const CATALOGUE={
  case:{n:'Case traditionnelle',ico:'🛖',cat:'Résidences',niv:[
    {n:'Case',cout:{pieces:10,savoir:80,bois:6,sable:2},d:'Une case simple, la plus économique.'}]},
  maison:{n:'Maison',ico:'🏠',cat:'Résidences',niv:[
    {n:'Maison',cout:{pieces:30,savoir:200,brique:14,sable:4,bois:4},d:'Une maison en briques avec un toit en tôle.'},
    {n:'Maison à étage',cout:{pieces:50,savoir:300,brique:20,ciment:6,bois:6},d:'Un étage de plus : deux niveaux d’habitation.'},
    {n:'Immeuble',cout:{pieces:90,savoir:500,brique:40,ciment:16,fer:10},d:'Un petit immeuble de trois étages avec réservoir d’eau sur le toit.'}]},
  villa:{n:'Villa',ico:'🏡',cat:'Résidences',niv:[
    {n:'Villa',cout:{pieces:80,savoir:400,brique:30,ciment:10,bois:8},d:'Une belle villa avec terrasse et colonnes.'},
    {n:'Villa de luxe',cout:{pieces:160,savoir:800,brique:40,ciment:20,fer:10},double:true,d:'Deux étages, piscine et grand jardin : demande un second terrain.'}]},
  ecole:{n:'École',ico:'🏫',cat:'Services publics',niv:[
    {n:'École primaire',cout:{pieces:60,savoir:300,brique:24,ciment:6,bois:8},d:'Des classes pour les enfants du quartier.'},
    {n:'Collège-lycée',cout:{pieces:140,savoir:700,brique:40,ciment:14,fer:8},double:true,d:'Un grand établissement à étage : demande un second terrain.'}]},
  sante:{n:'Santé',ico:'🏥',cat:'Services publics',niv:[
    {n:'Centre de santé',cout:{pieces:50,savoir:250,brique:18,ciment:4,bois:4},d:'Des soins de base pour tous.'},
    {n:'Clinique',cout:{pieces:120,savoir:500,brique:30,ciment:10,fer:6},d:'Plus de lits et une ambulance.'},
    {n:'Hôpital',cout:{pieces:260,savoir:1000,brique:50,ciment:24,fer:16},double:true,d:'Un hôpital complet avec hélisurface : demande un second terrain.'}]},
  sport:{n:'Sport',ico:'⚽',cat:'Services publics',niv:[
    {n:'Terrain de sport',cout:{pieces:40,savoir:200,sable:10,bois:6},d:'Un terrain de football pour la jeunesse.'},
    {n:'Stade',cout:{pieces:180,savoir:500,brique:30,ciment:12,fer:10},double:true,d:'Gradins et projecteurs : demande un second terrain.'}]},
  culture:{n:'Culture',ico:'🎭',cat:'Services publics',niv:[
    {n:'Espace culturel',cout:{pieces:50,savoir:250,brique:16,bois:8,tissu:4},d:'Une scène pour la danse, la musique et les contes.'},
    {n:'Centre culturel',cout:{pieces:140,savoir:500,brique:28,ciment:10,fer:6},d:'Une grande salle sous coupole.'}]},
  police:{n:'Police',ico:'🚓',cat:'Services publics',niv:[
    {n:'Poste de police',cout:{pieces:50,savoir:300,brique:18,ciment:5,fer:3},d:'Pour la sécurité du quartier.'},
    {n:'Commissariat',cout:{pieces:130,savoir:600,brique:30,ciment:10,fer:8},d:'Un grand commissariat avec antenne radio.'}]},
  autoecole:{n:'Auto-école',ico:'🚦',cat:'Services publics',cache:true,niv:[
    {n:'Auto-école',cout:{pieces:120,savoir:350,brique:22,ciment:6,bois:6},d:'Forme les conducteurs : inscription, cours et leçons de conduite.'},
    {n:'Grande auto-école',cout:{pieces:260,savoir:700,brique:36,ciment:12,fer:6},double:true,d:'Plus de salles et de moniteurs : demande un second terrain.'}]},
  energie:{n:'Énergie',ico:'⚡',cat:'Énergie et eau',niv:[
    {n:'Panneaux solaires',cout:{pieces:70,savoir:300,fer:6,sable:2},d:'Des panneaux solaires : électricité propre et gratuite pour le quartier.'},
    {n:'Centrale électrique',cout:{pieces:150,savoir:600,brique:24,ciment:12,fer:10},d:'Beaucoup d’électricité, mais elle pollue un peu.'}]},
  eau:{n:'Eau potable',ico:'💧',cat:'Énergie et eau',niv:[
    {n:'Puits et pompe',cout:{pieces:40,savoir:200,brique:10,ciment:3,fer:2},d:'Un puits avec pompe manuelle : de l’eau propre pour les voisins.'},
    {n:'Château d’eau',cout:{pieces:110,savoir:500,brique:24,ciment:12,fer:10},d:'Un grand réservoir qui distribue l’eau à tout le quartier.'}]},
  commerce:{n:'Commerce',ico:'🛒',cat:'Économie et transport',niv:[
    {n:'Marché de quartier',cout:{pieces:50,savoir:250,bois:10,tissu:4},d:'Des étals : emplois et produits frais près des habitations.'},
    {n:'Centre commercial',cout:{pieces:150,savoir:600,brique:30,ciment:12,fer:8},d:'Boutiques et supermarché : beaucoup d’emplois.'}]},
  transport:{n:'Transport',ico:'🚌',cat:'Économie et transport',niv:[
    {n:'Arrêt de bus',cout:{pieces:40,savoir:200,bois:6,fer:2},d:'Un arrêt de bus : moins d’embouteillages dans le quartier.'},
    {n:'Gare routière',cout:{pieces:130,savoir:500,brique:24,ciment:10,fer:8},d:'Plusieurs lignes de bus : la circulation devient fluide.'}]},
  parc:{n:'Parc',ico:'🌳',cat:'Environnement',niv:[
    {n:'Jardin public',cout:{pieces:30,savoir:150,bois:4,sable:4},d:'Arbres, bancs et fleurs : l’air est plus pur et les habitants plus heureux.'},
    {n:'Grand parc',cout:{pieces:90,savoir:350,bois:10,sable:10,fer:2},d:'Un grand parc avec étang et aire de jeux.'}]},
  pompiers:{n:'Pompiers',ico:'🚒',cat:'Services publics',niv:[
    {n:'Poste de pompiers',cout:{pieces:60,savoir:300,brique:20,ciment:6,fer:4},d:'Un camion et une équipe prêts à intervenir.'},
    {n:'Caserne',cout:{pieces:150,savoir:600,brique:34,ciment:12,fer:10},double:true,d:'Une caserne avec tour d’entraînement : demande un second terrain.'}]}
};
export const TYPES=Object.keys(CATALOGUE).filter(t=>!CATALOGUE[t].cache);
// ancien format (niveau numérique d'une maison) -> nouveau (objet {t,n})
export const batiment=(a,k)=>{
  const b=(a.batRes||[])[k];if(b)return b;
  const m=(a.maisRes||[])[k];return m?{t:'maison',n:m}:null;
};
export const nomBatiment=b=>b.annexe!==undefined?'Annexe':CATALOGUE[b.t].niv[b.n-1].n;
const MURS=['#e8c48a','#d98a6a','#9ac5a4','#d9c24a','#8fb4d9','#e0a0b0','#c9a27a','#a8c98f','#e6b25c','#b5a0d0'];
export const posTerrain=k=>{const side=k%2,row=Math.floor(k/2);return {x:CX+(side?12:-12),z:Z0-row*PAS,side:side,ry:side?-Math.PI/2:Math.PI/2}};
export const limiteNord=-(-Z0+Math.ceil(NB_TERRAINS/2)*PAS+10);

const mats={};
const mat=(k,f)=>mats[k]||(mats[k]=f());

function maison(g,niv,k){
  const wall=mat('mur'+k%10,()=>new THREE.MeshStandardMaterial({map:T.plasterTexture(MURS[k%10]),roughness:.9}));
  const tin=mat('tin',()=>new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35}));
  const brique=mat('brique',()=>new THREE.MeshStandardMaterial({map:T.brickTexture([198,108,62]),roughness:.9}));
  const glass=mat('verre',()=>std('#e8f3fa',.2,{emissive:0x4da6d9,emissiveIntensity:.3}));
  const porte=mat('porte',()=>std('#4a2f1b',.8));
  if(niv<=2){
    const H=niv===1?2.8:5.6;
    box(g,7,H,5,wall,0,H/2,-.5);box(g,7.3,.25,5.3,brique,0,.12,-.5);
    gableRoof(g,0,H,-.5,7,5,1.7,tin,std('#cfc6b2'),.6);
    box(g,1.2,2.0,.12,porte,0,1,2.06);
    [-2.3,2.3].forEach(dx=>box(g,1.1,1.0,.1,glass,dx,1.6,2.06));
    if(niv===2)[-2.3,0,2.3].forEach(dx=>box(g,1.1,1.0,.1,glass,dx,4.2,2.06));
  }else{
    box(g,8,9,6,wall,0,4.5,-.5);box(g,8.4,.3,6.4,brique,0,.15,-.5);box(g,8.4,.3,6.4,std('#9a9a92'),0,9.1,-.5);
    box(g,1.4,2.2,.12,porte,0,1.1,2.56);
    for(let r=0;r<3;r++)[-2.8,-.9,.9,2.8].forEach(dx=>box(g,1.1,1.1,.1,glass,dx,2.6+r*2.7,2.56));
    cyl(g,1,1,1.6,std('#2e6da4',.5,{metalness:.3}),2,10,-1,14);
    [-.7,.7].forEach(dx=>cyl(g,.08,.08,.8,std('#555'),2+dx,9.4,-1,6));
  }
}

const rouge=()=>mat('rouge',()=>std('#b03a2e',.7));
const M=c=>mat('c'+c,()=>std(c,.85));
function fenetres(g,n,larg,y,z,esp){for(let i=0;i<n;i++)box(g,larg,1.0,.1,mat('verre',()=>std('#e8f3fa',.2,{emissive:0x4da6d9,emissiveIntensity:.3})),(i-(n-1)/2)*esp,y,z)}
function enseigne(g,titre,bg,y,z,l){
  const b=new THREE.Mesh(new THREE.PlaneGeometry(l||4,.8),new THREE.MeshStandardMaterial({map:T.textBoard([{t:titre,s:titre.length>14?60:78,y:.5}],1024,208,bg,'#ffffff'),roughness:.6}));
  b.position.set(0,y,z);g.add(b);
}
// chaque dessin renvoie l'emprise {w,d} (largeur locale, profondeur locale)
const DESSIN={
  maison(g,niv,k){maison(g,niv,k);return niv>=3?{w:8.4,d:6.6}:{w:7.4,d:5.4}},
  case(g,niv,k){
    const mur=mat('terre',()=>new THREE.MeshStandardMaterial({map:T.earthWallTexture(),roughness:1}));
    const chaume=mat('chaume',()=>new THREE.MeshStandardMaterial({map:T.thatchTexture(),roughness:1}));
    cyl(g,2.3,2.4,2.3,mur,0,1.15,-.3,18);cyl(g,.05,3.1,2.2,chaume,0,3.4,-.3,18);
    box(g,.9,1.7,.12,mat('porte',()=>std('#4a2f1b',.8)),0,.85,1.95);
    return {w:5,d:5};
  },
  villa(g,niv,k){
    const mur=M('#f4efe4'),toit=M('#b5532f');
    const H=niv>=2?6.4:3.4;
    box(g,9,H,5.5,mur,0,H/2,-.3);box(g,9.6,.3,6.1,toit,0,H+.15,-.3);
    [-4,-1.4,1.4,4].forEach(x=>cyl(g,.18,.18,3.2,M('#ffffff'),x,1.6,2.8,10));box(g,9.4,.25,1.2,M('#ffffff'),0,3.3,2.8);
    box(g,1.3,2.2,.12,mat('porte',()=>std('#4a2f1b',.8)),0,1.1,2.5);
    fenetres(g,3,1.4,H>5?5.0:2.2,2.5,3);
    if(niv>=2){fenetres(g,3,1.4,2.2,2.5,3.2);}
    return niv>=2?{w:9.4,d:8}:{w:9.2,d:6.4};
  },
  ecole(g,niv,k){
    const mur=M('#f2e3b5'),H=niv>=2?6.2:3.2,tin=mat('tin',()=>new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35}));
    box(g,10,H,5,mur,0,H/2,-.5);gableRoof(g,0,H,-.5,10,5,1.4,tin,M('#cfc6b2'),.6);
    box(g,1.6,2.2,.12,mat('porte',()=>std('#4a2f1b',.8)),0,1.1,2.06);
    fenetres(g,4,1.1,1.8,2.06,2.2);if(niv>=2)fenetres(g,4,1.1,4.8,2.06,2.2);
    enseigne(g,niv>=2?'COLLÈGE-LYCÉE':'ÉCOLE','#1f5f9e',H+.7,2.12,5);
    cyl(g,.05,.05,4.5,M('#999'),4.3,2.25,3.6,6);
    const dr=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.8),new THREE.MeshBasicMaterial({color:0x2ecc71,side:THREE.DoubleSide}));dr.position.set(4.9,4.2,3.6);g.add(dr);
    return {w:10.4,d:5.4};
  },
  sante(g,niv,k){
    const mur=M('#f4f6f6'),H=niv===1?3:niv===2?4.8:8.6,W=niv===1?8:niv===2?9:10,D=niv===3?6:5;
    box(g,W,H,D,mur,0,H/2,-.5);box(g,W+.4,.3,D+.4,M('#c9cfd1'),0,H+.15,-.5);
    box(g,1.8,2.2,.12,mat('porte',()=>std('#4a2f1b',.8)),0,1.1,D/2-.4);
    const rz=D/2-.38;box(g,1.6,.45,.1,rouge(),0,H-.9,rz);box(g,.45,1.6,.1,rouge(),0,H-.9,rz);
    fenetres(g,niv===1?2:3,1.2,1.8,D/2-.4,niv===1?3.4:3);
    if(niv>=3){[2,3].forEach(r=>fenetres(g,4,1.1,r*2.2+1.6,D/2-.4,2.2));const h=new THREE.Mesh(new THREE.CircleGeometry(1.6,20),new THREE.MeshStandardMaterial({color:0x444444}));h.rotation.x=-Math.PI/2;h.position.set(0,H+.34,-.5);g.add(h);box(g,.2,.02,1,M('#fff'),-.3,H+.36,-.5);box(g,.2,.02,1,M('#fff'),.3,H+.36,-.5);box(g,.8,.02,.2,M('#fff'),0,H+.36,-.5)}
    if(niv>=2){box(g,2.2,1.6,1.2,M('#ffffff'),-3.2,.8,4.2);box(g,2.0,.1,.9,rouge(),-3.2,1.65,4.2)}
    return {w:W+.4,d:D+.4};
  },
  sport(g,niv,k){
    const h=new THREE.Mesh(new THREE.PlaneGeometry(10,9),new THREE.MeshStandardMaterial({color:0x3c9d4a,roughness:1}));h.rotation.x=-Math.PI/2;h.position.set(0,.05,0);g.add(h);
    box(g,.12,.02,9,M('#fff'),0,.06,0);box(g,10,.02,.12,M('#fff'),0,.06,-4.4);box(g,10,.02,.12,M('#fff'),0,.06,4.4);
    [-1,1].forEach(sx=>{[-1,1].forEach(sz=>box(g,.1,1.8,.1,M('#fff'),sx*4.8,.9,sz*1.1));box(g,.1,.1,2.3,M('#fff'),sx*4.8,1.8,0)});
    if(niv>=2){
      for(let r=0;r<4;r++)box(g,10,.5,1.1,M(r%2?'#c0392b':'#e0a526'),0,.25+r*.5,-5.0-r*.0).position.z=-4.6-r*.35;
      [-4.6,4.6].forEach(x=>{cyl(g,.1,.12,6,M('#555'),x,3,-4.8,6);box(g,1,.5,.4,new THREE.MeshBasicMaterial({color:0xfff0b0}),x,6.1,-4.6)});
    }
    return null;
  },
  culture(g,niv,k){
    const H=niv>=2?5:3.6;
    box(g,niv>=2?9:8,H,niv>=2?6:5,M('#e8b24a'),0,H/2,-.5);
    for(let i=0;i<4;i++)cyl(g,.2,.2,H,M('#fff3dc'),-3.3+i*2.2,H/2,2.2,10);
    box(g,niv>=2?9.4:8.4,.3,.8,M('#8c5a2b'),0,H+.1,2.3);
    if(niv>=2){const d=new THREE.Mesh(new THREE.SphereGeometry(3,18,10,0,Math.PI*2,0,Math.PI/2),M('#b5532f'));d.position.set(0,H+.2,-.5);g.add(d)}
    else gableRoof(g,0,H,-.5,8,5,1.2,M('#8c5a2b'),M('#cfc6b2'),.5);
    box(g,1.6,2.2,.12,mat('porte',()=>std('#4a2f1b',.8)),0,1.1,2.0);
    enseigne(g,niv>=2?'CENTRE CULTUREL':'ESPACE CULTUREL','#7d3c98',H+(niv>=2?3.7:1.0),2.15,4.4);
    return {w:niv>=2?9.4:8.4,d:niv>=2?6.4:5.4};
  },
  police(g,niv,k){
    const H=niv>=2?5.4:3.2,W=niv>=2?9:7.4;
    box(g,W,H,5,M('#4a6a9a'),0,H/2,-.5);box(g,W+.4,.3,5.4,M('#2b3f5c'),0,H+.15,-.5);
    box(g,1.4,2.2,.12,mat('porte',()=>std('#2b2b2b',.8)),0,1.1,2.06);fenetres(g,niv>=2?4:2,1.1,niv>=2?4.4:1.9,2.06,niv>=2?2.2:3.4);if(niv>=2)fenetres(g,2,1.1,1.8,2.06,5);
    enseigne(g,niv>=2?'COMMISSARIAT':'POLICE','#1c2e4a',H+.7,2.12,4.2);
    box(g,.5,.3,.3,new THREE.MeshBasicMaterial({color:0x2e7bff}),-.4,H+.5,-.5);box(g,.5,.3,.3,new THREE.MeshBasicMaterial({color:0xe74c3c}),.4,H+.5,-.5);
    if(niv>=2)cyl(g,.05,.07,3.6,M('#999'),3.4,H+1.8,-1.5,6);
    box(g,2,.7,1,M('#ffffff'),-2.8,.5,4.3);box(g,1.2,.5,.9,M('#2e4a7a'),-2.8,1.0,4.3);
    return {w:W+.4,d:5.4};
  },
  autoecole(g,niv,k){
    const H=niv>=2?4:3.4,W=niv>=2?10.4:9;
    box(g,W,H,5,M('#f4d03f'),0,H/2,-.5);box(g,W+.4,.3,5.4,M('#1f5f9e'),0,H+.15,-.5);box(g,W,.35,.1,M('#1f5f9e'),0,H*.55,2.02);
    box(g,1.5,2.2,.12,mat('porte',()=>std('#4a2f1b',.8)),0,1.1,2.06);fenetres(g,niv>=2?4:3,1.1,1.8,2.06,niv>=2?2.4:2.6);
    enseigne(g,niv>=2?'GRANDE AUTO-ÉCOLE':'AUTO-ÉCOLE','#1f5f9e',H+.7,2.12,5);
    const vo=voiture('auto','#ffffff');vo.position.set(-2.6,0,4.2);vo.rotation.y=Math.PI/2;g.add(vo);
    box(g,.5,.25,.2,M('#e0a526'),-2.6,1.75,4.2);
    [[1.8,4.8],[2.6,4.8],[3.4,4.8]].forEach(([x,z])=>cyl(g,.18,.28,.5,M('#e67e22'),x,.25,z,10));
    return {w:W+.4,d:5.4};
  },
  energie(g,niv,k){
    box(g,8,.12,5.4,M('#9aa0a6'),0,.06,-.5);
    if(niv<2){for(let r=0;r<2;r++)for(let c=-1;c<=1;c++){const p=box(g,2.2,.1,1.5,M('#1b3a6b',.25),c*2.5,.9+r*.0,-1.7+r*2.2);p.rotation.x=-.5;box(g,.1,.9,.1,M('#777'),c*2.5,.45,-1.7+r*2.2)}
      box(g,1.4,1.6,1.1,M('#e8e8e8'),3.1,.8,2.2);enseigne(g,'SOLAIRE','#1b3a6b',2.6,2.05,3);}
    else{box(g,5,3.4,3.6,M('#7a7a80'),-1,1.7,-1);box(g,5.4,.3,4,M('#444'),-1,3.55,-1);cyl(g,.5,.8,6,M('#aaa'),2.6,3,-1.6,12);cyl(g,.45,.7,5,M('#aaa'),3.9,2.5,-.4,12);box(g,1.4,2,.12,M('#2b2b2b'),-1,1,.86);enseigne(g,'CENTRALE','#7a5a3a',4.1,.9,4);}
    return {w:8.4,d:5.6};
  },
  eau(g,niv,k){
    box(g,7,.12,5.4,M('#9aa0a6'),0,.06,-.5);
    if(niv<2){box(g,2.2,.8,2.2,M('#8a8d91'),0,.4,-.5);cyl(g,.9,.9,.5,M('#3fa9d9'),0,.9,-.5,16);box(g,.1,2.4,.1,M('#555'),-1.4,1.2,-.5);box(g,1.6,.1,.1,M('#555'),-.7,2.4,-.5);box(g,.3,.3,.3,M('#2c7fb8'),-.1,2.2,-.5);enseigne(g,'EAU POTABLE','#2c7fb8',2.8,2.05,3)}
    else{[[-1.4,-1.4],[1.4,-1.4],[-1.4,.4],[1.4,.4]].forEach(([a,b])=>box(g,.35,6,.35,M('#8a8d91'),a,3,b));cyl(g,2.2,2.2,2.4,M('#3fa9d9',.3),0,7,-.5,20);cyl(g,2.3,1.9,.6,M('#2c7fb8'),0,5.6,-.5,20);enseigne(g,'CHÂTEAU D’EAU','#1f5f9e',9,2.2,4.5)}
    return {w:7.4,d:5.6};
  },
  commerce(g,niv,k){
    const H=niv>=2?4.2:2.4;
    if(niv<2){for(let i=-2;i<=2;i++){box(g,1.4,.9,1,M(['#c0392b','#e0a526','#2e7d4a','#e67e22','#7b3fa0'][i+2]),i*1.5,.45,1.2);box(g,1.5,.12,1.3,M(['#e74c3c','#f1c40f','#27ae60','#e67e22','#9b59b6'][i+2]),i*1.5,1.9,1.2);[-.65,.65].forEach(a=>box(g,.08,1.9,.08,M('#6b4423'),i*1.5+a,.95,1.7))}
      box(g,8,2.2,.2,M('#d9c27a'),0,1.1,-2.6);enseigne(g,'MARCHÉ','#c0392b',2.5,-2.45,3);return {w:8.2,d:6}}
    box(g,9.4,H,5,M('#f0ead8'),0,H/2,-.5);box(g,9.8,.4,5.4,M('#1f7a4d'),0,H+.2,-.5);box(g,6,2.4,.1,M('#9fd3f5',.2),0,1.4,2.02);box(g,1.6,2.2,.12,M('#4a2f1b'),0,1.1,2.06);enseigne(g,'CENTRE COMMERCIAL','#1f7a4d',H+.9,2.12,5);
    [-3.4,3.4].forEach(x=>box(g,.9,1,.9,M('#e8c04a'),x,.5,3.6));return {w:9.8,d:5.6};
  },
  transport(g,niv,k){
    if(niv<2){box(g,5,.12,3,M('#9aa0a6'),0,.06,2.6);box(g,3.4,.15,1.4,M('#2c7fb8'),0,2.2,2.6);[-1.5,1.5].forEach(a=>box(g,.1,2.2,.1,M('#555'),a,1.1,2.6));box(g,2.6,.4,.7,M('#e8e8e8'),0,.5,2.8);enseigne(g,'ARRÊT DE BUS','#2c7fb8',2.9,2.6,3);
      const b=box(g,4,1.4,1.7,M('#f4c20d'),-.5,.9,5.2);box(g,3.6,.5,1.75,M('#9fd3f5',.2),-.5,1.2,5.2);[-1.6,.6].forEach(x=>[-.9,.9].forEach(z=>cyl(g,.35,.3,.3,M('#222'),x,.35,5.2+z,10)));return {w:5.4,d:8}}
    box(g,9,3.6,4.6,M('#dfe3e8'),0,1.8,-.5);box(g,9.4,.35,5,M('#1f5f9e'),0,3.8,-.5);for(let i=0;i<3;i++){box(g,3,1.4,1.7,M(['#f4c20d','#2c7fb8','#d6302b'][i]),-3+i*3,.9,3.4);box(g,2.8,.5,1.75,M('#9fd3f5',.2),-3+i*3,1.2,3.4)}box(g,1.5,2.2,.12,M('#4a2f1b'),0,1.1,1.84);enseigne(g,'GARE ROUTIÈRE','#1f5f9e',4.6,1.85,4.5);return {w:9.4,d:6.4};
  },
  parc(g,niv,k){
    box(g,9,.1,6.4,M('#4f9c3c'),0,.05,-.2);
    const arbre=(x,z,s)=>{box(g,.25,1.6*s,.25,M('#6b4423'),x,.8*s,z);const c=new THREE.Mesh(new THREE.SphereGeometry(1.1*s,10,8),M('#2f7a36'));c.position.set(x,2.2*s,z);g.add(c)};
    [[-3.2,-2],[3.2,-2],[-3.2,1.6],[3.2,1.6]].forEach(([x,z])=>arbre(x,z,1));
    for(let i=-1;i<=1;i++){box(g,1.4,.1,.5,M('#d8c9a3'),i*2.4,.12,2.6);box(g,1.3,.5,.4,M('#8a5a2b'),i*2.4,.4,3)}
    box(g,1.3,.1,5.4,M('#d8c9a3'),0,.12,-.2);
    if(niv>=2){const et=new THREE.Mesh(new THREE.CylinderGeometry(2,2,.1,22),new THREE.MeshStandardMaterial({color:0x3fa9d9,roughness:.2}));et.position.set(0,.14,-1.2);g.add(et);box(g,.9,1.2,.9,M('#e0a526'),3.6,.6,-.6);box(g,.7,.08,1.8,M('#e74c3c'),3.6,.6,.5).rotation.x=.55;arbre(0,-3,1.3)}
    enseigne(g,niv>=2?'GRAND PARC':'JARDIN PUBLIC','#2e7d4a',2.9,3.1,3.6);
    return {w:9.4,d:6.6};
  },
  pompiers(g,niv,k){
    const H=niv>=2?4.6:3.6,W=niv>=2?9.4:8.4;
    box(g,W,H,5.2,M('#c0392b'),0,H/2,-.5);box(g,W+.4,.3,5.6,M('#7b241c'),0,H+.15,-.5);
    [-1,1].forEach(sx=>box(g,2.6,2.6,.12,M('#e8e8e8'),sx*2.2,1.3,2.12));
    enseigne(g,niv>=2?'CASERNE':'POMPIERS','#7b241c',H+.7,2.18,4.2);
    box(g,3,1.4,1.3,M('#d93025'),-3.2,.9,4.2);box(g,.7,.9,1.2,M('#e8e8e8'),-4.2,1.5,4.2);box(g,2,.12,.2,M('#ccc'),-2.9,1.8,4.2);
    [-3.9,-2.5].forEach(x=>cyl(g,.4,.4,.4,M('#222'),x,.4,4.9,10));
    if(niv>=2){box(g,1.8,8,1.8,M('#a93226'),3.4,4,-2.4);box(g,2.2,.4,2.2,M('#7b241c'),3.4,8.2,-2.4)}
    return {w:W+.4,d:5.6};
  }
};

// cour et jardin derrière la maison : massifs de fleurs, aire de jeux pour les enfants, piscine pour la villa
function jardin(t,type,niv,k){
  const FLE=['#e74c3c','#f1c40f','#ff7eb6','#ffffff','#9b59b6'];
  for(let i=0;i<4;i++){const x=-3.2+i*2.2;box(t,1.5,.28,.6,M('#4f8f3a'),x,.14,-4.9);box(t,1.4,.06,.5,M(FLE[(i+k)%FLE.length]),x,.31,-4.9)}
  cyl(t,.09,.12,1.5,M('#6b4226'),-4.7,.75,-4.3,6);const cm=new THREE.Mesh(new THREE.SphereGeometry(.85,10,8),M('#3f9a53'));cm.position.set(-4.7,1.9,-4.3);t.add(cm);
  if(type==='maison'&&niv>=2){            // aire de jeux : toboggan et balançoire
    box(t,.9,1.2,.9,M('#e0a526'),4.6,.6,-3.6);box(t,.7,.08,1.8,M('#e74c3c'),4.6,.6,-2.4).rotation.x=.55;
    [-.8,.8].forEach(dz=>box(t,.08,1.5,.08,M('#555'),4.7,.75,.2+dz));box(t,.08,.08,1.8,M('#555'),4.7,1.5,.2);box(t,.5,.06,.3,M('#2e86de'),4.7,.55,.2);
  }
  if(type==='villa'&&niv>=2){             // piscine
    const eau=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.7),new THREE.MeshStandardMaterial({color:0x3fa9d9,roughness:.2}));eau.rotation.x=-Math.PI/2;eau.position.set(.4,.07,-4.2);t.add(eau);
    box(t,4.6,.06,2.1,M('#d9d9d2'),.4,.04,-4.2);
  }
}

// etat : {n: terrains achetés, bat: [{t,n}|{annexe}|null par terrain], pave: Set des tronçons bitumés}
// cb : {acheter(k), ouvrir(k), verrou(k)} ; renvoie les points d'action et étend les limites de la scène
export function construireRes(w,etat,cb){
  const g=new THREE.Group();w.group.add(g);
  const cols=w.colliders,bxs=w.boxes;
  const dirt=mat('dirt',()=>new THREE.MeshStandardMaterial({map:T.dirtTexture(),roughness:1,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2}));
  const flat=(geo,m,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.rotation.x=-Math.PI/2;o.position.set(x,y,z);o.receiveShadow=true;g.add(o);return o};
  const yMin=Z0-(Math.ceil(NB_TERRAINS/2)-1)*PAS-9;
  // route centrale vers le nord
  flat(new THREE.PlaneGeometry(7,-14-yMin),dirt,CX,.02,(-14+yMin)/2);
  trottoirsDroit(g,CX,-14,yMin,7,1.6);
  if(etat.rond){trottoirsDroit(g,CX,-14,-8.6,7,1.6);trottoirsDroit(g,CX,8.6,13,7,1.6)}else trottoirsDroit(g,CX,-14,13,7,1.6);
  // tronçons bitumés (un par rangée de terrains) et points d'action pour bitumer les autres
  const NSEG=Math.ceil((-14-yMin)/PAS),spots=[],parkings=[];
  for(let i=0;i<NSEG;i++){
    const z1=-14-i*PAS,z2=Math.max(yMin,z1-PAS),id='res'+i;
    if(etat.pave&&etat.pave.has(id))bitumeDroit(g,CX,z1,z2,7);
    else spots.push({x:CX,z:z1-PAS/2,r:2.6,label:'Bitumer la route (tronçon '+(i+1)+')',run:()=>cb.route(id,'res',i)});
  }
  // liaison à travers le village : relie le quartier résidentiel aux quartiers de missions ; rond-point possible au centre
  flat(new THREE.PlaneGeometry(7,27),dirt,CX,.02,-.5);
  if(etat.pave&&etat.pave.has('liaison'))bitumeDroit(g,CX,-14,13,7);
  else spots.push({x:CX+4.4,z:-8,r:2.6,label:'Bitumer la route du village (liaison)',run:()=>cb.route('liaison','liaison',0)});
  if(etat.rond){rondPoint(g,CX,0);cols.push({x:CX,z:0,r:1.9})}
  else if(etat.pave&&etat.pave.has('liaison'))spots.push({x:CX,z:0,r:3,label:'Construire un rond-point au centre du village',run:()=>cb.rond()});
  // panneau d'entrée, côté village
  cyl(g,.07,.09,2.6,std('#5a3a22',.9),CX+4,1.3,-12,8);
  const en=new THREE.Mesh(new THREE.PlaneGeometry(3,1.6),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'QUARTIER',s:60,y:.25},{t:'RÉSIDENTIEL ↑',s:50,y:.52},{t:'Terrains à acheter',s:26,y:.78}],1024,546,'#0f2f6b','#ffffff'),roughness:.6}));
  en.position.set(CX+4,2.55,-11.9);g.add(en);cols.push({x:CX+4,z:-12,r:.4});
  // lampadaires le long de la route
  for(let z=-20;z>yMin;z-=12)[-4.8,4.8].forEach(dx=>{cyl(g,.05,.07,3,std('#444',.5,{metalness:.5}),CX+dx,1.5,z,6);const a=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:0xfff0b0}));a.position.set(CX+dx,3.1,z);g.add(a);cols.push({x:CX+dx,z:z,r:.25})});

  for(let k=0;k<NB_TERRAINS;k++){
    const p=posTerrain(k),t=new THREE.Group();t.position.set(p.x,0,p.z);t.rotation.y=p.ry;g.add(t);
    const possede=k<etat.n,vente=k===etat.n;
    const bat=possede?etat.bat[k]:null;
    const annexe=bat&&bat.annexe!==undefined;
    // sol du terrain
    const sol=new THREE.Mesh(new THREE.PlaneGeometry(DEMI*2,DEMI*2),std(possede?'#cdbb8a':vente?'#d9d29a':'#7e9a62',1));sol.rotation.x=-Math.PI/2;sol.position.y=.03;sol.receiveShadow=true;t.add(sol);
    // bornes aux quatre coins
    [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>cyl(t,.1,.12,1.1,std(possede?'#7a4a26':'#c9c9c9',.8),a*DEMI,.55,b*DEMI,6));
    // panneau devant le terrain
    let l1,l2,bg;
    if(annexe){l1='ANNEXE';l2='du terrain n°'+(bat.annexe+1);bg='#1f7a4d'}
    else if(possede){l1='MON TERRAIN';l2=bat?nomBatiment(bat):'à construire';bg='#1f7a4d'}
    else if(vente){l1='À VENDRE';l2=prixTerrain(k)+' FC';bg='#b8860b'}
    else{l1='TERRAIN N°'+(k+1);l2='bientôt disponible';bg='#5a6275'}
    cyl(t,.06,.08,2.2,std('#5a3a22',.9),-3.4,1.1,DEMI-.3,6);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.2),new THREE.MeshStandardMaterial({map:T.textBoard([{t:l1,s:70,y:.35},{t:l2,s:l2.length>14?34:44,y:.72}],1024,512,bg,'#ffffff'),roughness:.6}));
    sg.position.set(-3.4,2.3,DEMI-.2);t.add(sg);
    if(bat&&!annexe&&['case','maison','villa'].includes(bat.t)){
      // parking du propriétaire, dans la cour devant la maison
      const PX=1.2,PZ=4.0;
      const pad=new THREE.Mesh(new THREE.PlaneGeometry(4.8,2.4),mat('asph',()=>new THREE.MeshStandardMaterial({color:0x4a4b50,roughness:.95,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3})));
      pad.rotation.x=-Math.PI/2;pad.position.set(PX,.045,PZ);t.add(pad);
      [[0,-1.2,4.8,.1],[0,1.2,4.8,.1],[-2.4,0,.1,2.4],[2.4,0,.1,2.4]].forEach(([x,z,w,d])=>box(t,w,.01,d,M('#f2f2f2'),PX+x,.06,PZ+z));
      const sp=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'P',s:380,y:.52}],256,256,'#1f5f9e','#ffffff'),roughness:.6}));
      sp.position.set(PX-2.5,1.6,PZ+1.3);t.add(sp);cyl(t,.04,.04,1.6,std('#666'),PX-2.5,.8,PZ+1.3,6);
      parkings.push({x:p.x+PX*Math.cos(p.ry)+PZ*Math.sin(p.ry),z:p.z-PX*Math.sin(p.ry)+PZ*Math.cos(p.ry),k:k});
    }
    if(bat&&!annexe&&['case','maison','villa'].includes(bat.t))jardin(t,bat.t,bat.n,k);
    if(bat&&!annexe){
      const fp=DESSIN[bat.t](t,bat.n,k);
      if(fp){
        // emprise dans le repère du monde (les terrains sont tournés d'un quart de tour)
        const cxw=p.x+(p.side?.5:-.5);
        bxs.push({x0:cxw-fp.d/2,x1:cxw+fp.d/2,z0:p.z-fp.w/2,z1:p.z+fp.w/2});
      }
    }
    // point d'action, au bord de la route
    const fx=p.x+(p.side?-DEMI-1.2:DEMI+1.2);
    const lab=annexe?'Annexe du terrain n°'+(bat.annexe+1):possede?(bat?nomBatiment(bat)+' (terrain n°'+(k+1)+')':'Construire sur mon terrain n°'+(k+1)):vente?'Acheter le terrain n°'+(k+1)+' · '+prixTerrain(k)+' FC':'Terrain n°'+(k+1)+' : achète d’abord le précédent';
    const sp={x:fx,z:p.z,r:3.6,label:lab,run:()=>possede?cb.ouvrir(k):vente?cb.acheter(k):cb.verrou(k)};
    if(bat&&!annexe&&cb.libelle)Object.defineProperty(sp,'label',{get:()=>cb.libelle(k,bat)});
    spots.push(sp);
    if(bat&&!annexe&&bat.t!=='sport')spots.push({x:p.x+(p.side?-3.9:3.9),z:p.z,r:1.5,label:'Entrer : '+nomBatiment(bat),run:()=>cb.entrer(k,bat,{x:fx,z:p.z,phi:p.side?Math.PI/2:-Math.PI/2})});
  }
  w.bounds.z0=Math.min(w.bounds.z0,limiteNord);
  return {spots,parkings};
}

// loyer par heure d'une résidence louée (selon le niveau) ; 0 pour les services publics
export const LOYER=(t,n)=>(({case:[6],maison:[20,35,80],villa:[60,120]})[t]||[])[n-1]||0;
export const LOYER_MAX_H=4;   // les loyers s'accumulent au plus 4 heures
