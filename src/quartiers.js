// La ville qui grandit : au sud du quartier de départ, une grande place ronde entourée de parcelles,
// puis d'autres anneaux de parcelles quand les lieux sont nombreux. Chaque mission d'exploration terminée
// ouvre le bâtiment suivant ; des maisons s'ajoutent autour des bâtiments finis, la route s'éclaire
// vers la prochaine mission.
import * as THREE from 'three';
import {panneauPub} from './pub.js';
import {sponsorN} from './sponsors.js';
import * as T from './textures.js';
import {std,box,cyl,rng,gableRoof,tree} from './world.js';
import {bitumeDroit,bitumeAnneau,trottoirsDroit,trottoirsAnneau} from './routes.js';
import {grandBatiment} from './institutions.js';
import {panneauNumerique} from './panneauNumerique.js';

export const CX=-7;
export let CZ=70;                    // centre de la place (calculé selon le nombre d'anneaux)
const R0=31.5,PAS=26;                // rayon des bâtiments du 1er anneau, écart entre anneaux
const ARC0=-78,ARC=336;              // secteur occupé par les parcelles (degrés), on laisse libre l'entrée au nord
const ECART=6.6;                     // largeur d'une parcelle (m)
const MURS=['#e8c48a','#d98a6a','#9ac5a4','#d9c24a','#8fb4d9','#e0a0b0','#c9a27a','#a8c98f','#e6b25c','#b5a0d0'];
const rad=d=>d*Math.PI/180;
const pt=(th,r)=>({x:CX+r*Math.cos(th),z:CZ+r*Math.sin(th)});
const capacite=k=>Math.floor(2*Math.PI*(R0+PAS*k)*(ARC/360)/ECART);

// répartit les n lieux sur les anneaux : [{k,R,route,n}]
function anneaux(n){
  const out=[];let reste=n,k=0;
  while(reste>0){const cap=capacite(k),m=Math.min(reste,cap);out.push({k:k,R:R0+PAS*k,route:R0+PAS*k-5.5,n:m});reste-=m;k++}
  return out;
}

// etat : [{id,scene,name,icon,ouvert,fini,precedent}] pour les stages 1..N (sans le quartier de départ)
export function extendVille(w,etat,pave){
  const g=new THREE.Group();w.group.add(g);
  const n=etat.length,r0=rng(77);
  const AN=anneaux(n),ext=AN[AN.length-1],int0=AN[0];
  CZ=ext.route+44;
  const cols=w.colliders,bxs=w.boxes;
  const dirtM=new THREE.MeshStandardMaterial({map:T.dirtTexture(),roughness:1,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-2});
  const flat=(geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;g.add(m);return m};

  // routes : entrée depuis le quartier de départ, routes circulaires, place centrale
  flat(new THREE.PlaneGeometry(7,CZ-int0.route-12),dirtM,CX,.02,(14+CZ-int0.route)/2);
  AN.forEach(a=>flat(new THREE.RingGeometry(a.route-3.5,a.route+3.5,Math.min(160,72+a.k*40)),dirtM,CX,.02,CZ));
  // routes à bitumer : l'entrée, puis chaque anneau (le joueur les paie en bitume, pièces et points de savoir)
  trottoirsDroit(g,CX,13,CZ-int0.route+1,7,1.6);
  AN.forEach(a=>trottoirsAnneau(g,CX,CZ,a.route,7,1.0,Math.min(160,72+a.k*40)));
  const routes=[],pv=id=>pave&&pave.has(id);
  if(pv('entree'))bitumeDroit(g,CX,13,CZ-int0.route+1,7);else routes.push({id:'entree',type:'entree',i:0,x:CX+4.4,z:20,label:'Bitumer la route d’entrée'});
  AN.forEach(a=>{
    if(pv('anneau'+a.k))bitumeAnneau(g,CX,CZ,a.route,7,Math.min(160,72+a.k*40));
    else routes.push({id:'anneau'+a.k,type:'anneau',i:a.k,x:CX+4.4,z:CZ-a.route,label:'Bitumer la route de l’anneau '+(a.k+1)});
  });
  const plazaM=std('#cdc4ae',.95,{polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-3});
  flat(new THREE.CircleGeometry(int0.route-3.4,56),plazaM,CX,.03,CZ);

  // grand panneau publicitaire numérique en portique au-dessus de la route : toutes les affiches des sponsors défilent
  {const pn=panneauNumerique(g,cols,CX,31);const u0=w.update;w.update=function(dt,t,o){if(u0)u0.call(w,dt,t,o);pn.update(t)}}
  // panneau d'accueil à l'entrée
  cyl(g,.07,.09,2.6,std('#5a3a22',.9),CX+4,1.3,26,8);
  const ac=new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.5),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'NOUVEAUX',s:62,y:.22},{t:'QUARTIERS ↓',s:56,y:.5},{t:'Réussis les missions',s:24,y:.78,b:false,c:'#f1c40f'}],384,208,'#1f7a4d','#ffffff','#ffffff')}));
  ac.position.set(CX+4,2.55,25.9);g.add(ac);cols.push({x:CX+4,z:26,r:.4});

  // fontaine centrale, qui s'enrichit avec la progression
  const finis=etat.filter(e=>e.fini).length;
  cyl(g,3.2,3.4,.5,std('#b9b2a2'),CX,.25,CZ,24);
  cyl(g,2.8,2.8,.1,std('#4da6d9',.2,{emissive:0x2a6fa0,emissiveIntensity:.3}),CX,.52,CZ,24);
  cyl(g,.35,.5,2.2,std('#c9c2b0'),CX,1.4,CZ,12);
  cyl(g,1.3,.4,.25,std('#b9b2a2'),CX,2.45,CZ,16);
  cols.push({x:CX,z:CZ,r:3.5});
  if(finis>=5)[0,1,2,3].forEach(k=>{const a=k*Math.PI/2+.4,p=pt(a,7.5);box(g,2,.1,.6,std('#7a4a26'),p.x,.5,p.z,-a+Math.PI/2);cols.push({x:p.x,z:p.z,r:1})});
  if(finis>=12)[0,1,2,3,4,5].forEach(k=>{const a=k*Math.PI/3,p=pt(a,11);cyl(g,.06,.06,3.2,std('#555',.5,{metalness:.4}),p.x,1.6,p.z,6);const l=new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:0xffe9a0}));l.position.set(p.x,3.3,p.z);g.add(l);cols.push({x:p.x,z:p.z,r:.3})});
  if(finis>=20)[0,1,2,3,4,5,6,7].forEach(k=>{const a=k*Math.PI/4+.2,p=pt(a,14);tree(g,p.x,p.z,1.1,false,null,cols,k%2===0)});

  // lampadaires (instances : un seul appel de dessin pour tous les poteaux et toutes les ampoules)
  const lamps=[];
  AN.forEach(a=>{for(let k=0;k<Math.max(8,a.n);k++){lamps.push(pt(rad(ARC0+ARC*(k+.5)/a.n),a.route-3.6))}});
  for(let z=18;z<CZ-int0.route-3;z+=9)[-3.6,3.6].forEach(dx=>lamps.push({x:CX+dx,z:z}));
  const poteaux=new THREE.InstancedMesh(new THREE.CylinderGeometry(.05,.07,3,6),std('#444',.5,{metalness:.5}),lamps.length);
  const ampoules=new THREE.InstancedMesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:0xfff0b0}),lamps.length);
  const mm=new THREE.Matrix4();
  lamps.forEach((p,i)=>{mm.makeTranslation(p.x,1.5,p.z);poteaux.setMatrixAt(i,mm);mm.makeTranslation(p.x,3.1,p.z);ampoules.setMatrixAt(i,mm);cols.push({x:p.x,z:p.z,r:.25})});
  g.add(poteaux);g.add(ampoules);
  // panneaux publicitaires LEXOTHÈQUE RDC : trois par anneau, entre les lampadaires, et deux sur la route d'entrée
  AN.forEach((a,ri)=>{if(a.n<3)return;for(let j=0;j<3;j++){
    const k=Math.floor(a.n*(j+.5)/3),th=rad(ARC0+ARC*(k+.8)/a.n),p=pt(th,a.route-5.4);
    const pb=panneauPub(sponsorN(ri*3+j));pb.position.set(p.x,0,p.z);pb.rotation.y=Math.PI/2-th;g.add(pb);cols.push({x:p.x,z:p.z,r:1.6})}});
  [[CX-4.8,36,Math.PI/2],[CX+4.8,52,-Math.PI/2],[CX-4.8,68,Math.PI/2],[CX+4.8,84,-Math.PI/2]].forEach(([x,z,ry],qi)=>{if(z>=CZ-int0.route-8)return;const pb=panneauPub(sponsorN(qi));pb.position.set(x,0,z);pb.rotation.y=ry;g.add(pb);cols.push({x:x,z:z,r:1.6})});

  const lots=[],doors=[];
  const tin=new THREE.MeshStandardMaterial({map:T.tinTexture(),roughness:.55,metalness:.35});
  const brique=new THREE.MeshStandardMaterial({map:T.brickTexture([198,108,62]),roughness:.9});
  const suivant=etat.findIndex(e=>!e.ouvert);    // premier chantier
  const pos=[];let idx=0;                         // position de chaque lieu : anneau + rang dans l'anneau
  AN.forEach(a=>{for(let j=0;j<a.n;j++)pos.push({a:a,j:j,th:rad(ARC0+ARC*(j+.5)/a.n)})});
  etat.forEach((e,i)=>{
    const P=pos[i],th=P.th,R=P.a.R,Rr=P.a.route,SET=3.2,c=pt(th,R+SET);   // bâtiment reculé : une cour de 3 m le sépare de la route
    const ry=Math.atan2(-Math.cos(th),-Math.sin(th));
    const tx=-Math.sin(th),tz=Math.cos(th);
    const devant=pt(th,R-.4),retour=pt(th,Rr-.9);
    lots.push({scene:e.scene,retour:{x:retour.x,z:retour.z,phi:th+Math.PI},th:th,anneau:P.a.k});
    const lg=new THREE.Group();lg.position.set(c.x,0,c.z);lg.rotation.y=ry;g.add(lg);
    if(e.ouvert){
      if(!grandBatiment(lg,e)){
      const wall=new THREE.MeshStandardMaterial({color:MURS[i%MURS.length],roughness:.9});
        box(lg,5.8,3.2,4.6,wall,0,1.6,0);
        gableRoof(lg,0,3.2,0,5.8,4.6,1.4,tin,std('#e9dfca'),.5);
        box(lg,1.3,2.1,.12,std('#4a2f1b',.8),0,1.05,2.32);
        [-2.0,2.0].forEach(dx=>box(lg,.9,.9,.1,std('#e8f3fa',.2,{emissive:0x4da6d9,emissiveIntensity:.35}),dx,1.7,2.32));
        const nm=e.name.length>24?28:e.name.length>20?32:e.name.length>17?34:e.name.length>13?40:46;
        const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.6,1.0),new THREE.MeshStandardMaterial({map:T.textBoard([{t:e.icon+' '+e.name,s:nm}],768,164,e.fini?'#1f7a4d':'#8a3b12','#ffffff'),roughness:.6}));
        sg.position.set(0,2.75,2.36);lg.add(sg);
      }
      // cour devant le bâtiment : allée et massifs de fleurs
      box(lg,1.6,.03,3.4,std('#cfc6b2'),0,.03,3.9);
      [-2.2,2.2].forEach((x,j)=>{box(lg,1.5,.25,.8,std('#4f8f3a'),x,.12,3.9);box(lg,1.3,.06,.6,std('#'+['e74c3c','f1c40f','ff7eb6','9b59b6'][(i+j)%4]),x,.27,3.9)});
      [-2.1,0,2.1].forEach(o=>cols.push({x:c.x+tx*o,z:c.z+tz*o,r:1.5}));
      doors.push({x:devant.x,z:devant.z,r:2.3,to:e.scene,label:'Entrer : '+e.name,lot:i});
      if(e.fini){ // drapeau vert : mission terminée
        cyl(lg,.04,.04,2.4,std('#999'),-2.6,4.3,1.9,6);
        const f=new THREE.Mesh(new THREE.PlaneGeometry(.9,.55),new THREE.MeshBasicMaterial({color:0x2ecc71,side:THREE.DoubleSide}));f.position.set(-2.15,5.1,1.9);lg.add(f);
      }
    }else if(i===suivant){ // chantier en cours
      flat(new THREE.PlaneGeometry(7,6),dirtM,c.x,.025,c.z).rotation.z=-ry;
      box(lg,5.8,.9,4.4,std(MURS[i%MURS.length],.9),0,.45,-.1);
      [-3,3].forEach(dx=>[-2.4,2.4].forEach(dz=>cyl(lg,.07,.07,2.4,std('#7a4a26'),dx,1.2,dz,6)));
      [[-3,0],[3,0]].forEach(p=>box(lg,.06,.12,4.8,std('#7a4a26'),p[0],1.6,p[1]));
      box(lg,6,.12,.06,std('#7a4a26'),0,1.6,2.4);box(lg,6,.12,.06,std('#7a4a26'),0,1.6,-2.4);
      for(let k=0;k<6;k++)box(lg,.5,.2,.25,brique,-2.2+(k%3)*.55,.1+Math.floor(k/3)*.2,3.2);
      const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.2,1.3),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'🚧 CHANTIER',s:50,y:.28},{t:e.icon+' '+e.name,s:e.name.length>22?22:30,y:.6,b:false,c:'#f1c40f'},{t:'Termine : '+e.precedent,s:e.precedent.length>26?16:22,y:.86,b:false,c:'#ffffff'}],640,200,'#8a3b12','#ffffff','#ffffff'),roughness:.6}));
      sg.position.set(0,2.4,2.55);lg.add(sg);
      cyl(lg,.05,.05,1.6,std('#5a3a22'),-1.4,.8,2.52,6);cyl(lg,.05,.05,1.6,std('#5a3a22'),1.4,.8,2.52,6);
      [-2.1,0,2.1].forEach(o=>cols.push({x:c.x+tx*o,z:c.z+tz*o,r:1.5}));
      doors.push({x:devant.x,z:devant.z,r:2.3,to:e.scene,label:'',ok:()=>false,closed:'Chantier : termine « '+e.precedent+' » pour ouvrir '+e.name,lot:i});
    }else{ // parcelle réservée
      cyl(lg,.04,.05,1.2,std('#7a4a26'),-2,.6,1.5,6);cyl(lg,.04,.05,1.2,std('#7a4a26'),2,.6,1.5,6);
      const f=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),new THREE.MeshBasicMaterial({color:0xf4c430,side:THREE.DoubleSide}));f.position.set(-1.75,1.05,1.5);lg.add(f);
    }
    lg.traverse(o=>{o.castShadow=false});    // beaucoup de bâtiments : pas d'ombres portées, pour rester fluide sur téléphone
  });

  // maisons : trois par mission terminée, réparties derrière les bâtiments
  const spots=[];
  etat.forEach((e,i)=>{if(!e.fini)return;const P=pos[i],step=rad(ARC/P.a.n);spots.push([P.th-step*.28,P.a.R+9],[P.th+step*.28,P.a.R+9],[P.th,P.a.R+15.5])});
  if(spots.length){
    const body=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({roughness:.9}),spots.length);
    const roofG=new THREE.ConeGeometry(.78,1,4);roofG.rotateY(Math.PI/4);
    const roof=new THREE.InstancedMesh(roofG,new THREE.MeshStandardMaterial({roughness:.7}),spots.length);
    const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),col=new THREE.Color();
    const toits=['#8a3b2a','#6b4a2a','#4a5a6a','#7a2f2f','#3f5a3a'];
    spots.forEach((s,k)=>{
      const p=pt(s[0],s[1]),w=3.4+r0()*1.2,h=2.2+r0()*1.2,d=3.2+r0();
      q.setFromEuler(new THREE.Euler(0,-s[0]+Math.PI/2+(r0()-.5)*.2,0));
      m4.compose(new THREE.Vector3(p.x,h/2,p.z),q,new THREE.Vector3(w,h,d));body.setMatrixAt(k,m4);
      body.setColorAt(k,col.set(MURS[(k*3+1)%MURS.length]));
      m4.compose(new THREE.Vector3(p.x,h+.7,p.z),q,new THREE.Vector3(w*1.35,1.4,d*1.35));roof.setMatrixAt(k,m4);
      roof.setColorAt(k,col.set(toits[k%toits.length]));
      cols.push({x:p.x,z:p.z,r:Math.max(w,d)*.55});
    });
    g.add(body);g.add(roof);
  }

  // flèches jaunes : la route vers la prochaine mission à faire
  const cible=etat.findIndex(e=>e.ouvert&&!e.fini);
  if(cible>=0){
    const am=new THREE.MeshBasicMaterial({color:0xffd23f,transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false});
    const ag=new THREE.CircleGeometry(.5,3);
    const fl=(x,z,dir)=>{const m=new THREE.Mesh(ag,am);m.rotation.x=-Math.PI/2;m.rotation.z=dir;m.position.set(x,.06,z);g.add(m)};
    const P=pos[cible],Rr=P.a.route;
    for(let z=18;z<CZ-Rr;z+=3)fl(CX,z,-Math.PI/2);          // vers le sud, jusqu'à la route de l'anneau voulu
    const th=P.th,start=-Math.PI/2;
    let dth=th-start;if(dth>Math.PI)dth-=2*Math.PI;
    const sgn=Math.sign(dth)||1,len=Math.abs(dth)*(Rr-.2),nb=Math.floor(len/3);
    for(let k=0;k<=nb;k++){const a=start+sgn*(k*3/(Rr-.2)),p=pt(a,Rr-.2);fl(p.x,p.z,-(a+sgn*Math.PI/2))}
  }

  // arbres décoratifs autour de l'anneau extérieur
  const rt=rng(5);
  for(let k=0;k<26+ext.k*14;k++){const a=rad(ARC0+ARC*rt()),r=ext.R+22+rt()*8,p=pt(a,r);tree(g,p.x,p.z,.9+rt()*.5,false,null,cols,k%3===0)}

  // limites : le monde s'agrandit, des barrières invisibles gardent le couloir d'entrée
  const X0=Math.min(-62,CX-ext.R-23);
  bxs.push({x0:X0,x1:CX-3.4,z0:14.5,z1:24},{x0:CX+3.4,x1:58,z0:14.5,z1:24});
  bxs.push({x0:X0,x1:-33.5,z0:-14.5,z1:14.5});
  bxs.push({x0:CX+ext.R+20,x1:CX+ext.R+60,z0:14.5,z1:CZ+ext.R+24});
  w.bounds={x0:X0,x1:Math.max(58,CX+ext.R+20),z0:-14.5,z1:CZ+ext.R+22};
  return {doors,lots,suivant,cible,routes};
}
