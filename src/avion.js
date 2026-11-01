// BOYEKOLI FLIGHT SIMULATOR : simulateur de vol éducatif en 3D (Three.js, procédural, sans modèle externe).
// Procédure de départ, instruments, manche/gaz/palonniers/volets/freins, physique simplifiée (poussée, traînée, portance,
// décrochage, gravité, inertie), carburant fictif, 4 caméras, pause, collisions (montagnes, tours, sol), 10 leçons
// éducatives puis missions chronométrées. Paysage inspiré de la RDC : Kinshasa, fleuve Congo, Brazzaville, collines.
import * as THREE from 'three';

const KT=1.944;
export const KIN={x:1450,z:-900};                  // centre de Kinshasa
export const RIVIERE={x:1793,z:-900};              // le fleuve Congo, vu depuis Kinshasa
const STAND={x:-48,z:100,psi:Math.PI/2};          // parking de l'avion devant le terminal

const FAITS=[
  '🪽 À quoi servent les ailes ? Leur forme dévie l’air : l’air pousse l’aile vers le haut, c’est la portance.',
  '⚙️ Le moteur fait tourner l’hélice, qui pousse l’air vers l’arrière : l’avion avance, c’est la poussée.',
  '🌬 Pourquoi un avion vole-t-il ? Parce que la portance des ailes est plus forte que son poids, tant qu’il va assez vite.',
  '📏 L’altitude est la hauteur de l’avion au-dessus du sol. On la mesure avec l’altimètre, en pieds (ft).',
  '🛬 Un aéroport a une piste, des voies de circulation, un terminal pour les passagers et une tour de contrôle.',
  '🗼 Les pilotes parlent par radio aux contrôleurs aériens : ils disent qui décolle, qui atterrit, pour éviter les accidents.',
  '⛽ Le carburant est limité : un bon pilote surveille toujours la jauge avant et pendant le vol.',
  '📐 Les volets sont des parties mobiles des ailes : ils permettent de voler et d’atterrir plus lentement.'
];

export const MISSIONS=[
  {id:'l1',type:'lecon',nom:'1. Découverte du cockpit',txt:'Fais connaissance avec les commandes.',rec:5,
   intro:'Bienvenue pilote ! Le cockpit est le poste de pilotage. Le manche fait pencher et monter l’avion, la manette des gaz règle la puissance, les volets aident à voler lentement, le frein arrête l’avion au sol.',
   consigne:'Ouvre la porte, monte à bord, puis essaie chaque commande : manche, gaz, volets, frein et caméra 📷.',
   fin:'Bravo ! Tu connais maintenant le tableau de bord : vitesse, altitude, cap et horizon artificiel.'},
  {id:'l2',type:'lecon',nom:'2. Démarrage du moteur',txt:'Suis la procédure et démarre le moteur.',rec:5,
   intro:'Avant de voler, un pilote suit une check-list : porte, ceinture, batterie, frein de parc, démarreur. Le moteur à pistons brûle un mélange d’essence et d’air pour faire tourner l’hélice.',
   consigne:'Termine la procédure de départ et démarre le moteur (maintiens le bouton rouge 2 secondes).',
   fin:'Le moteur tourne ! L’hélice pousse l’air vers l’arrière et fera avancer l’avion.'},
  {id:'l3',type:'lecon',nom:'3. Apprendre à accélérer',txt:'Roule et atteins 40 nœuds sur la piste.',rec:6,rapide:true,
   intro:'La poussée de l’hélice est plus forte que la traînée : l’avion accélère. Plus il va vite, plus l’air porte les ailes.',
   consigne:'Relâche le frein de parc 🛑, avance jusqu’à la piste en suivant les lignes jaunes puis pousse la manette des gaz jusqu’à 40 kt.',
   fin:'Tu as atteint 40 nœuds ! À cette vitesse, les ailes commencent à porter.'},
  {id:'l4',type:'lecon',nom:'4. Effectuer un décollage',txt:'Décolle et monte à 150 ft.',rec:8,rapide:true,
   intro:'Au décollage, on accélère à pleine puissance. Vers 55 kt, on tire doucement sur le manche : le nez se lève et la portance soulève l’avion.',
   consigne:'Aligne-toi sur la piste, gaz à fond, puis tire le manche (glisse le doigt vers le bas) à 55 kt.',
   fin:'Tu voles ! La portance est plus forte que le poids de l’avion.'},
  {id:'l5',type:'lecon',nom:'5. Maintenir une altitude',txt:'Reste à la même hauteur pendant 15 secondes.',rec:8,rapide:true,
   intro:'L’altitude est la hauteur au-dessus du sol. Pour la garder, on maintient le nez à plat et on règle la puissance. Le vario indique si on monte ou descend.',
   consigne:'Décolle, monte au-dessus de 200 ft, puis garde la même altitude (±80 ft) pendant 15 secondes.',
   fin:'Bravo ! Tu sais garder une altitude constante.'},
  {id:'l6',type:'lecon',nom:'6. Effectuer des virages',txt:'Tourne à gauche, puis à droite.',rec:8,rapide:true,
   intro:'Pour tourner, on incline l’avion : l’aile du côté du virage descend. L’horizon artificiel montre l’inclinaison.',
   consigne:'Décolle puis fais un virage à gauche d’au moins 80°, puis un virage à droite d’au moins 80°.',
   fin:'Tes virages sont réussis ! L’inclinaison fait tourner l’avion en douceur.'},
  {id:'l7',type:'lecon',nom:'7. Survoler Kinshasa',txt:'Survole la capitale de la RDC.',rec:10,rapide:true,bal:[[KIN.x-350,230,KIN.z+250],[KIN.x,200,KIN.z]],
   intro:'Kinshasa est la capitale de la République démocratique du Congo, une mégapole de plus de 15 millions d’habitants, au bord du fleuve Congo.',
   consigne:'Décolle et passe dans les 2 anneaux jaunes au-dessus de Kinshasa (à l’est de l’aéroport, vers l’horizon).',
   fin:'Tu as survolé Kinshasa : tu peux voir ses tours, ses grandes avenues et le stade des Martyrs.'},
  {id:'l8',type:'lecon',nom:'8. Reconnaître le fleuve Congo',txt:'Survole le fleuve et réponds à la question.',rec:10,rapide:true,bal:[[RIVIERE.x,220,RIVIERE.z]],quiz:true,
   intro:'Le fleuve Congo est le deuxième fleuve d’Afrique par son débit et le plus profond du monde. Il sépare Kinshasa de Brazzaville, la capitale du Congo voisin.',
   consigne:'Décolle, vole vers l’est, survole le grand fleuve bleu (anneau jaune) puis réponds à la question.',
   fin:'Le fleuve Congo est une grande route naturelle pour les bateaux et une source d’énergie avec le barrage d’Inga.'},
  {id:'l9',type:'lecon',nom:'9. Réussir un atterrissage',txt:'Pose l’avion sur la piste et arrête-toi.',rec:12,rapide:true,
   intro:'Pour atterrir : on réduit les gaz, on baisse un peu les volets, on garde le nez presque à plat et on se pose en douceur sur la piste, puis on freine.',
   consigne:'Décolle, fais un tour, puis atterris sur la piste (vitesse sous 80 kt, nez à plat) et arrête-toi avec le frein.',
   fin:'Beau toucher ! Un atterrissage doux est le signe d’un bon pilote.'},
  {id:'exam',type:'chrono',nom:'10. Vol complet (examen du brevet)',txt:'Décolle, survole Kinshasa et le fleuve, atterris : chronométré.',tmax:420,rec:30,brevet:true,bal:[[KIN.x-350,230,KIN.z+250],[RIVIERE.x,220,RIVIERE.z],[500,120,-300]],
   intro:'Dernier test : un vol complet ! Procédure de départ, décollage, survol de Kinshasa et du fleuve, retour à l’aéroport, atterrissage. Le chrono démarre quand tu roules. Garde un œil sur le carburant.',
   consigne:'Passe les 3 anneaux puis atterris sur la piste avant la fin du temps.',
   fin:'Brevet de pilote BOYEKOLI obtenu ! Félicitations, commandant.'},
  {id:'courrier',type:'chrono',nom:'Courrier express',txt:'Livre le courrier : 4 balises avant la fin du temps.',tmax:240,rec:18,bal:[[-300,90,-380],[-520,130,-900],[0,140,-1000],[450,100,-600]]},
  {id:'ville',type:'chrono',nom:'Survol de la ville',txt:'Survole les quartiers à basse altitude.',tmax:260,rec:24,bal:[[KIN.x-200,110,KIN.z+300],[KIN.x+50,120,KIN.z],[KIN.x+100,110,KIN.z-350],[900,100,-500]]},
  {id:'province',type:'chrono',nom:'Vol vers la province',txt:'Un long vol de 6 balises : surveille ton temps et ton carburant.',tmax:330,rec:40,bal:[[0,160,-1300],[900,210,-2200],[1800,190,-2700],[2200,150,-1800],[1500,120,-700],[500,100,-250]]}
];

export function lancerAvion(el,opt){
  const o=Object.assign({mission:null,low:false,onFin:()=>{},onQuit:()=>{},toast:()=>{},onLow:()=>{}},opt||{});
  let LOW=!!o.low;
  el.style.cssText+=';display:flex;flex-direction:column;background:#000;touch-action:none';
  const view=document.createElement('div');view.style.cssText='flex:1;position:relative;min-height:0';el.appendChild(view);
  const W0=Math.max(300,el.clientWidth),H0=Math.max(200,Math.round((el.clientHeight||700)*.52));
  const r=new THREE.WebGLRenderer({antialias:false,powerPreference:'high-performance'});r.setPixelRatio(LOW?1:Math.min(devicePixelRatio||1,1.5));r.setSize(W0,H0);view.appendChild(r.domElement);r.domElement.style.cssText='width:100%;height:100%;display:block';
  const sc=new THREE.Scene();sc.background=new THREE.Color('#8fcdf2');sc.fog=new THREE.Fog('#bfe0f2',LOW?500:900,LOW?3200:5500);
  const cam=new THREE.PerspectiveCamera(66,W0/H0,.15,9000);
  sc.add(new THREE.HemisphereLight('#ffffff','#6b8f4e',1.15));const sun=new THREE.DirectionalLight('#fff3d2',1.1);sun.position.set(600,900,300);sc.add(sun);
  const M=(c,rough,metal)=>new THREE.MeshStandardMaterial({color:c,roughness:rough===undefined?.85:rough,metalness:metal||0});
  const B=(w,h,d,c,x,y,z,par)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),typeof c==='string'?M(c):c);m.position.set(x,y,z);(par||sc).add(m);return m};
  function tex(fn,w=256,h=256){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t}
  const etiquette=(txt,x,y,z,sz,col)=>{const c=document.createElement('canvas');c.width=512;c.height=128;const g=c.getContext('2d');g.font='bold 64px system-ui';g.textAlign='center';g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,20,512,88);g.fillStyle=col||'#fff';g.fillText(txt,256,86);
    const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,transparent:true}));s.position.set(x,y,z);s.scale.set(sz,sz/4,1);s.renderOrder=5;sc.add(s);return s};
  const mx=new THREE.Matrix4();let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  // ---------- terrain
  const herbe=tex((g,w,h)=>{g.fillStyle='#6f9a4f';g.fillRect(0,0,w,h);for(let i=0;i<2200;i++){g.fillStyle=['#7aa857','#628b45','#85b05e','#5c8240'][i%4];g.fillRect(Math.random()*w,Math.random()*h,2+Math.random()*3,2+Math.random()*3)}});herbe.repeat.set(4000,4000);
  const sol=new THREE.Mesh(new THREE.PlaneGeometry(40000,40000),new THREE.MeshStandardMaterial({map:herbe,roughness:1}));sol.rotation.x=-Math.PI/2;sc.add(sol);
  const asph=tex((g,w,h)=>{g.fillStyle='#46464b';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=i%2?'#505056':'#3c3c41';g.fillRect(Math.random()*w,Math.random()*h,2,2)}});
  const aMat=()=>new THREE.MeshStandardMaterial({map:asph,roughness:.9});
  const fl=(w,d,c,x,z,y)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),M(c));m.rotation.x=-Math.PI/2;m.position.set(x,y||.1,z);sc.add(m);return m};
  const route=(x1,z1,x2,z2,w,col)=>{const L=Math.hypot(x2-x1,z2-z1),g=new THREE.PlaneGeometry(w,L);g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,M(col||'#3d3d42',.95));m.position.set((x1+x2)/2,.08,(z1+z2)/2);m.rotation.y=Math.atan2(x2-x1,z2-z1);sc.add(m)};
  const piste=new THREE.Mesh(new THREE.PlaneGeometry(24,440),aMat());piste.rotation.x=-Math.PI/2;piste.position.set(0,.06,-92);sc.add(piste);
  for(let i=0;i<20;i++)fl(.9,12,'#f4f4f4',0,120-i*22);[-11,11].forEach(x=>fl(.5,420,'#f4f4f4',x,-92));
  [-9,-6,-3,3,6,9].forEach(x=>{fl(1.1,9,'#f4f4f4',x,-296);fl(1.1,9,'#f4f4f4',x,112)});
  const taxi=new THREE.Mesh(new THREE.PlaneGeometry(62,10),aMat());taxi.rotation.x=-Math.PI/2;taxi.position.set(-31,.07,100);sc.add(taxi);
  const aire=new THREE.Mesh(new THREE.PlaneGeometry(34,40),aMat());aire.rotation.x=-Math.PI/2;aire.position.set(-52,.07,100);sc.add(aire);
  fl(.4,10,'#f1c40f',-31,100,.12);for(let i=0;i<6;i++)fl(5,.35,'#f1c40f',-56+i*5,100,.12);
  const feux=new THREE.InstancedMesh(new THREE.SphereGeometry(.35,6,4),new THREE.MeshBasicMaterial({color:'#fff3a8'}),42);
  for(let i=0;i<21;i++){[-12.5,12.5].forEach((x,k)=>{mx.makeTranslation(x,.4,-300+i*21);feux.setMatrixAt(i*2+k,mx)})}sc.add(feux);
  const bat=new THREE.Group();bat.position.set(-82,0,100);sc.add(bat);
  B(26,6,10,'#e9edf2',0,3,0,bat);B(27,.6,11,'#1f5f9e',0,6.3,0,bat);B(20,3,.2,new THREE.MeshStandardMaterial({color:0x6fb7e6,transparent:true,opacity:.6}),0,2.6,5.1,bat);
  const tor=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.1,16,12),M('#d9dde3'));tor.position.set(-14,8,-6);bat.add(tor);
  const cab=new THREE.Mesh(new THREE.CylinderGeometry(3.6,2.4,3.4,12),new THREE.MeshStandardMaterial({color:0x4aa0d8,transparent:true,opacity:.75}));cab.position.set(-14,17.5,-6);bat.add(cab);B(8,.4,8,'#c0392b',-14,19.4,-6,bat);
  B(30,9,22,'#9aa5b1',-82,4.5,150);B(31,.6,23,'#6b7480',-82,9.3,150);
  const sm=new THREE.Mesh(new THREE.ConeGeometry(.5,3,6),M('#ff7a1a'));sm.position.set(-20,1.6,80);sm.rotation.z=Math.PI/2;sc.add(sm);B(.1,3,.1,'#999',-20,1.5,80);
  etiquette('AÉROPORT BOYEKOLI',-70,40,100,120,'#ffe082');
  // collisions : cônes (montagnes) et boîtes (tours)
  const cones=[],boites=[];
  const alt=(x,z)=>{let h=0;cones.forEach(c=>{const d=Math.hypot(x-c.x,z-c.z);if(d<c.r)h=Math.max(h,c.h*(1-d/c.r))});return h};
  const nT=LOW?260:700;
  const troncs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.5,.7,4,5),M('#6b4423'),nT),cimes=new THREE.InstancedMesh(new THREE.SphereGeometry(3.4,6,5),M('#2f7d3a'),nT);
  for(let i=0;i<nT;i++){let x=(rnd()-.5)*5600,z=(rnd()-.5)*5600-900;if(Math.abs(x)<60&&z>-340&&z<170)x+=140;const s=.8+rnd()*1.2;
    if(Math.hypot(x-KIN.x,z-KIN.z)<520||Math.abs(((x-1700)*.955)+((z+1200)*.296))<260){mx.makeScale(0,0,0)}else mx.compose(new THREE.Vector3(x,2*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s,s));
    troncs.setMatrixAt(i,mx);if(Math.hypot(x-KIN.x,z-KIN.z)<520||Math.abs(((x-1700)*.955)+((z+1200)*.296))<260)mx.makeScale(0,0,0);else mx.compose(new THREE.Vector3(x,5.5*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s*.9,s));cimes.setMatrixAt(i,mx)}
  sc.add(troncs);sc.add(cimes);
  [[-1700,-3600,520,320],[300,-4200,700,380],[2300,-4000,600,300],[-2600,-2300,460,240],[3600,-3200,620,330],[-900,-5200,800,420]].forEach(([x,z,rr,h],i)=>{
    const m=new THREE.Mesh(new THREE.ConeGeometry(rr,h,10),M(i%2?'#5f8a47':'#7d9a5a'));m.position.set(x,h/2-2,z);sc.add(m);cones.push({x,z,r:rr,h});
    const neige=new THREE.Mesh(new THREE.ConeGeometry(rr*.18,h*.16,10),M('#f2f2f2'));neige.position.set(x,h*.92,z);sc.add(neige)});
  for(let i=0;i<10;i++){const h=40+rnd()*60,rr=120+rnd()*120,x=(rnd()-.5)*6000,z=-1800-rnd()*1500;if(Math.hypot(x-1700,z+1200)<700||Math.hypot(x-500,z+300)<400)continue;const m=new THREE.Mesh(new THREE.ConeGeometry(rr,h,9),M('#6f9a4f'));m.position.set(x,h/2-3,z);sc.add(m);cones.push({x,z,r:rr,h})}
  for(let i=0;i<40;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(80+rnd()*160,60+rnd()*140),M(['#c9b458','#8cbf5a','#a9794a','#7aa857'][i%4]));m.rotation.x=-Math.PI/2;m.rotation.z=rnd()*3;m.position.set((rnd()-.5)*3000-600,.05,-300-rnd()*2800);sc.add(m)}
  // fleuve Congo, très large ; Kinshasa sur sa rive, Brazzaville en face
  const fleuve=new THREE.Mesh(new THREE.PlaneGeometry(450,9000),M('#2f86c4',.15,.1));fleuve.rotation.x=-Math.PI/2;fleuve.rotation.z=.3;fleuve.position.set(1700,.05,-1200);sc.add(fleuve);
  const ile=new THREE.Mesh(new THREE.CircleGeometry(60,16),M('#6f9a4f'));ile.rotation.x=-Math.PI/2;ile.scale.set(1,2.6,1);ile.position.set(1760,.1,-1500);sc.add(ile);
  etiquette('FLEUVE CONGO',RIVIERE.x,95,RIVIERE.z-120,320,'#9fe3ff');
  const nM=LOW?220:520;
  const mai=new THREE.InstancedMesh(new THREE.BoxGeometry(10,6,10),M('#d9c9a8'),nM),toi=new THREE.InstancedMesh(new THREE.BoxGeometry(11,1,11),M('#b0502d'),nM);
  for(let i=0;i<nM;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*430,x=KIN.x+Math.cos(a)*d*1.2,z=KIN.z+Math.sin(a)*d;const s=.8+rnd()*1.2;
    mx.compose(new THREE.Vector3(x,3*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s,s));mai.setMatrixAt(i,mx);mx.compose(new THREE.Vector3(x,6.5*s,z),new THREE.Quaternion(),new THREE.Vector3(s,s,s));toi.setMatrixAt(i,mx)}
  sc.add(mai);sc.add(toi);
  const TOURS=[[0,0,24,110],[60,-30,20,85],[-50,30,18,70],[30,50,22,95],[-30,-60,16,60],[100,20,18,55],[-90,-10,16,50],[10,-100,20,75]];
  TOURS.forEach(([dx,dz,w,h],i)=>{const x=KIN.x+dx,z=KIN.z+dz;B(w,h,w,i%2?'#cfd8e3':'#9db4c9',x,h/2,z);B(w+1,3,w+1,'#37474f',x,h+1.5,z);B(w*.8,h*.9,.5,new THREE.MeshStandardMaterial({color:0x4aa0d8,roughness:.1,metalness:.6}),x,h/2,z+w/2+.1);boites.push({x,z,hw:w/2+1,h:h+3})});
  const stade=new THREE.Mesh(new THREE.TorusGeometry(46,9,6,28),M('#c9c2b0'));stade.rotation.x=-Math.PI/2;stade.scale.set(1.3,1,1);stade.position.set(KIN.x-200,10,KIN.z+180);sc.add(stade);
  const pelouse=new THREE.Mesh(new THREE.CircleGeometry(40,24),M('#3f9a49'));pelouse.rotation.x=-Math.PI/2;pelouse.scale.set(1.3,1,1);pelouse.position.set(KIN.x-200,.3,KIN.z+180);sc.add(pelouse);
  route(KIN.x-480,KIN.z+40,KIN.x+420,KIN.z+40,18);route(KIN.x,KIN.z-420,KIN.x,KIN.z+420,16);route(KIN.x-480,KIN.z-160,KIN.x+420,KIN.z-160,10);
  route(0,150,KIN.x-480,KIN.z+40,14);
  etiquette('KINSHASA',KIN.x,170,KIN.z,300,'#ffffff');
  const nB=LOW?60:150;const mb=new THREE.InstancedMesh(new THREE.BoxGeometry(10,6,10),M('#cdd3c4'),nB);
  for(let i=0;i<nB;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*300,x=2300+Math.cos(a)*d,z=-1050+Math.sin(a)*d;mx.makeTranslation(x,3,z);mb.setMatrixAt(i,mx)}sc.add(mb);
  [[0,0,16,45],[40,20,14,35]].forEach(([dx,dz,w,h])=>{B(w,h,w,'#d9dde3',2300+dx,h/2,-1050+dz);boites.push({x:2300+dx,z:-1050+dz,hw:w/2+1,h:h+2})});
  etiquette('BRAZZAVILLE',2300,120,-1050,280,'#ffe9a8');
  const nuages=[];for(let i=0;i<34;i++){const g=new THREE.Group();for(let k=0;k<4;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(60+rnd()*60,8,6),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.9}));s.scale.y=.45;s.position.set(k*70,rnd()*20,rnd()*40);g.add(s)}
    g.position.set((rnd()-.5)*6000,420+rnd()*260,-rnd()*5000);g.visible=!LOW||i<14;sc.add(g);nuages.push(g)}
  // ---------- avion (nez vers -z)
  const av=new THREE.Group();sc.add(av);
  const corps=new THREE.Group();av.add(corps);const coque=new THREE.Group();corps.add(coque);
  const blanc=M('#f4f4f4',.5,.15),rouge=M('#d6302b',.5,.1),vitre=new THREE.MeshStandardMaterial({color:0x2b4a6b,roughness:.1,metalness:.5,transparent:true,opacity:.75});
  const fus=new THREE.Mesh(new THREE.CapsuleGeometry(.62,3.4,6,14),blanc);fus.rotation.x=Math.PI/2;fus.position.set(0,1.25,.4);fus.scale.set(1,1,1.05);coque.add(fus);
  const nez=new THREE.Mesh(new THREE.SphereGeometry(.62,14,10),blanc);nez.position.set(0,1.15,-1.45);nez.scale.set(1,.9,1.2);coque.add(nez);
  const queue=new THREE.Mesh(new THREE.ConeGeometry(.55,3.6,12),blanc);queue.rotation.x=-Math.PI/2;queue.position.set(0,1.45,4.4);coque.add(queue);
  [-1,1].forEach(d=>{B(.04,.55,1.6,vitre,d*.6,1.62,-.2,coque);B(.04,.4,.9,vitre,d*.6,1.5,1.3,coque)});
  const pare=B(1.05,.5,1.2,vitre,0,1.85,-.7,coque);pare.rotation.x=.55;
  B(11,.14,1.7,blanc,0,2.05,-.2,coque);B(11,.15,.35,rouge,0,2.05,.5,coque);
  [-1,1].forEach(d=>{const s=B(.08,1.1,.1,'#cfcfcf',d*1.6,1.45,-.1,coque);s.rotation.z=d*.55});
  B(3.8,.1,1.05,blanc,0,1.6,5.6,corps);const deriv=B(.12,1.5,1.3,rouge,0,2.25,5.5,corps);deriv.rotation.x=-.12;
  const gouv=B(.1,1.2,.5,'#bd2a26',0,2.2,6.2,corps);
  const roue=(x,z,rr)=>{const w=new THREE.Mesh(new THREE.CylinderGeometry(rr,rr,.22,14),M('#222'));w.rotation.z=Math.PI/2;w.position.set(x,rr,z);corps.add(w);B(.07,.8,.07,'#555',x,.7,z,corps)};
  roue(-1,0,.34);roue(1,0,.34);roue(0,-1.7,.26);
  const helice=new THREE.Group();helice.position.set(0,1.15,-2.1);corps.add(helice);
  B(.22,.22,.18,'#333',0,0,.05,helice);const pales=new THREE.Group();helice.add(pales);B(.14,2.3,.05,'#2a2a2a',0,0,0,pales);
  const disque=new THREE.Mesh(new THREE.CircleGeometry(1.15,20),new THREE.MeshBasicMaterial({color:'#dddddd',transparent:true,opacity:0,side:THREE.DoubleSide}));disque.position.z=-.05;helice.add(disque);
  const porte=new THREE.Group();porte.position.set(.62,1.3,-.1);corps.add(porte);B(.05,.85,1.0,'#e9e9e9',0,.1,.5,porte);
  const cock=new THREE.Group();av.add(cock);cock.visible=false;
  B(1.2,.45,1.3,'#e6e6e6',0,1.0,-1.55,cock);B(1.5,.5,.6,'#2b2b30',0,.95,-.95,cock);B(1.6,.12,.5,'#1b1b1f',0,1.2,-1.12,cock).rotation.x=-.25;
  const mancheG=new THREE.Group();mancheG.position.set(-.3,.9,-.55);cock.add(mancheG);B(.05,.45,.05,'#222',0,.2,0,mancheG);B(.38,.05,.05,'#222',0,.45,0,mancheG);[-1,1].forEach(d=>B(.08,.12,.08,'#111',d*.19,.45,0,mancheG));
  B(.05,1.1,.06,'#d9d9d9',-.62,1.5,-.2,cock);B(.05,1.1,.06,'#d9d9d9',.62,1.5,-.2,cock);
  [-.3,.3].forEach(x=>{const s=new THREE.Mesh(new THREE.BoxGeometry(.4,.1,.4),M('#4a4a55'));s.position.set(x,.5,.45);cock.add(s)});
  // ---------- balises
  const balises=[];const gBal=new THREE.Group();sc.add(gBal);
  function posBalises(ms){gBal.clear();balises.length=0;
    (ms&&ms.bal?ms.bal:[]).forEach(p=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);
      const t=new THREE.Mesh(new THREE.TorusGeometry(22,2.4,8,26),new THREE.MeshBasicMaterial({color:'#ffc107'}));g.add(t);
      const f=new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,Math.max(80,p[1]*2),6),new THREE.MeshBasicMaterial({color:'#ffc107',transparent:true,opacity:.35}));f.position.y=-p[1]/2-10;g.add(f);
      gBal.add(g);balises.push({g,t,ok:false,p:new THREE.Vector3(p[0],p[1],p[2])})});
    balises.forEach((b,i)=>{const n=balises[i+1]||{p:new THREE.Vector3(0,0,-90)};b.t.lookAt(n.p)})}
  // ---------- état
  const S={x:STAND.x,y:0,z:STAND.z,psi:STAND.psi,pitch:0,roll:0,v:0,vy:0,gaz:0,volets:0,frein:true,rudder:0,moteur:false,rpm:0,sol:true,carb:100,
    etape:0,porte:false,cabine:false,batt:false,cam:'lateral',mis:null,t0:null,reste:0,fin:false,msg:'',tmsg:0,posee:0,yok:{x:0,y:0},stall:false,pause:false,
    used:{yoke:false,gaz:false,volets:false,frein:false,cam:false},u:{},consigne:'',prog:'',fait:false,quizOk:false,lecture:false};
  const CAMS=['cockpit','arriere','lateral','pano'];const CAMN={cockpit:'Intérieure',arriere:'Arrière',lateral:'Latérale',pano:'Panoramique'};
  function demarrerMission(m){
    S.mis=m;S.t0=null;S.reste=m&&m.tmax?m.tmax:0;S.fait=false;S.u={};S.quizOk=false;S.consigne=m?m.consigne||m.txt||'':'';S.prog='';posBalises(m);
    S.used={yoke:false,gaz:false,volets:false,frein:false,cam:false};S.lecture=!!(m&&m.intro);
    if(m&&m.rapide){S.porte=S.cabine=S.batt=true;S.moteur=true;S.rpm=.25;S.etape=5;S.cam='cockpit';S.frein=true}
  }
  const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
  function verifLecon(dt){
    const m=S.mis;if(!m||m.type!=='lecon'||S.fait||S.lecture)return;const u=S.u,kt=S.v*KT;
    let ok=false,pr='';
    switch(m.id){
      case 'l1':{const k=S.used;const n=Object.values(k).filter(Boolean).length;pr=`Commandes essayées : ${n}/5 (manche ${k.yoke?'✓':'·'} gaz ${k.gaz?'✓':'·'} volets ${k.volets?'✓':'·'} frein ${k.frein?'✓':'·'} caméra ${k.cam?'✓':'·'})`;ok=n>=5;break}
      case 'l2':ok=S.moteur;pr=S.moteur?'Moteur en marche':'Étape '+Math.min(S.etape+1,5)+' / 5 de la procédure';break;
      case 'l3':ok=S.sol&&kt>=40;pr='Vitesse : '+Math.round(kt)+' / 40 kt';break;
      case 'l4':ok=!S.sol&&S.y>=46;pr=S.sol?'Roule et décolle (tire le manche vers 55 kt)':'Altitude : '+Math.round(S.y*3.28)+' / 150 ft';break;
      case 'l5':if(S.sol){u.ref=null;u.t=0;pr='Décolle d’abord';break}
        if(S.y<60){u.ref=null;u.t=0;pr='Monte au-dessus de 200 ft ('+Math.round(S.y*3.28)+' ft)';break}
        if(u.ref==null){u.ref=S.y;u.t=0}if(Math.abs(S.y-u.ref)<=25)u.t+=dt;else{u.ref=S.y;u.t=0}
        pr='Altitude tenue : '+Math.floor(u.t)+' / 15 s';ok=u.t>=15;break;
      case 'l6':{if(u.last==null)u.last=S.psi;const d=wrap(S.psi-u.last);u.last=S.psi;u.g=u.g||0;u.d=u.d||0;if(!S.sol){if(d<0)u.g+=-d;else u.d+=d}
        pr='Virage gauche : '+Math.min(80,Math.round(u.g*57.3))+'/80° · droite : '+Math.min(80,Math.round(u.d*57.3))+'/80°';ok=u.g>=1.4&&u.d>=1.4;break}
      case 'l7':ok=balises.length>0&&balises.every(b=>b.ok);pr='Anneaux : '+balises.filter(b=>b.ok).length+' / '+balises.length;break;
      case 'l8':ok=S.quizOk;pr=balises.every(b=>b.ok)?'Réponds à la question':'Survole le fleuve';break;
      case 'l9':ok=S.posee>0&&S.sol&&S.v<3&&!S.fin;pr=S.posee?'Arrête-toi sur la piste avec le frein':'Atterris en douceur sur la piste';break;
    }
    S.prog=pr;if(ok)finLecon();
  }
  // ---------- audio moteur
  let ac=null,osc=null,gn=null,lp=null;
  function sonMoteur(on){
    try{
      if(!ac)ac=new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
      if(on&&!osc){osc=ac.createOscillator();gn=ac.createGain();lp=ac.createBiquadFilter();osc.type='sawtooth';lp.type='lowpass';lp.frequency.value=700;gn.gain.value=.0001;osc.connect(lp);lp.connect(gn);gn.connect(ac.destination);osc.start()}
      if(!on&&osc){gn.gain.setTargetAtTime(0,ac.currentTime,.2);const o2=osc;setTimeout(()=>{try{o2.stop()}catch(e){}},600);osc=null}
    }catch(e){}
  }
  // ---------- interface
  const pan=document.createElement('div');pan.style.cssText='flex:0 0 auto;background:#20242b;color:#eee;padding:6px;font:12px system-ui;border-top:3px solid #888;user-select:none;-webkit-user-select:none';el.appendChild(pan);
  const hud=document.createElement('div');hud.style.cssText='position:absolute;left:6px;right:98px;top:6px;color:#fff;font:700 13px system-ui;text-shadow:0 1px 3px #000;pointer-events:none';view.appendChild(hud);
  const haut=document.createElement('div');haut.style.cssText='position:absolute;right:6px;top:6px;display:flex;flex-direction:column;gap:4px';
  haut.innerHTML='<button id="bpause" style="padding:6px 9px;border-radius:8px;border:1px solid #777;background:rgba(0,0,0,.55);color:#fff;font-size:13px">⏸ Pause</button><button id="bcam" style="padding:6px 9px;border-radius:8px;border:1px solid #777;background:rgba(0,0,0,.55);color:#fff;font-size:13px">📷 Caméra</button>';view.appendChild(haut);
  const check=document.createElement('div');check.style.cssText='position:absolute;left:8px;right:8px;bottom:8px;background:rgba(15,20,30,.9);color:#fff;border-radius:12px;padding:10px;font:13px system-ui;max-height:80%;overflow:auto';view.appendChild(check);
  const bandeau=document.createElement('div');bandeau.style.cssText='position:absolute;left:8px;right:8px;bottom:6px;background:rgba(15,20,30,.72);color:#fff;border-radius:10px;padding:5px 8px;font:12px system-ui;pointer-events:none;display:none';view.appendChild(bandeau);
  const btn=(t,css,id)=>`<button id="${id||''}" style="padding:8px 9px;margin:2px;border-radius:9px;border:1px solid #777;background:#3a4150;color:#fff;font-size:13px;touch-action:none;${css||''}">${t}</button>`;
  pan.innerHTML=`<div style="display:flex;gap:6px;align-items:stretch">
    <div style="flex:0 0 138px"><div id="yoke" style="position:relative;width:132px;height:132px;border-radius:50%;background:radial-gradient(#4b5260,#2a2f38);border:3px solid #999;touch-action:none"><div id="yk" style="position:absolute;left:46px;top:46px;width:40px;height:40px;border-radius:50%;background:#e7e7e7;border:3px solid #333"></div><div style="position:absolute;inset:0;font-size:9px;text-align:center;pointer-events:none;padding-top:3px;opacity:.7">JOYSTICK<br>↓ tirer = monter</div></div></div>
    <div style="flex:1;min-width:0"><canvas id="ai" width="120" height="120" style="width:84px;height:84px;float:right;border-radius:50%;border:2px solid #999"></canvas><div id="ins" style="font:700 12px monospace;line-height:1.5"></div>
      <div>${btn('🛑 FREIN','','bfr')}${btn('Volets −','','bvm')}${btn('Volets +','','bvp')}</div>
      <div>${btn('◀ Pédale','','bpg')}${btn('Pédale ▶','','bpd')}</div></div>
    <div style="flex:0 0 46px;text-align:center"><div style="font-size:9px">GAZ</div><div id="gaz" style="position:relative;width:34px;height:116px;margin:2px auto;background:#14171c;border:2px solid #999;border-radius:8px;touch-action:none"><div id="gz" style="position:absolute;left:-4px;width:38px;height:22px;border-radius:6px;background:#d6302b;border:2px solid #fff;bottom:0"></div></div><div id="gv" style="font-size:11px">0 %</div></div></div>
    <div id="act" style="margin-top:3px"></div><div id="aide" style="font-size:10px;opacity:.65;margin-top:2px"></div>`;
  const $=id=>pan.querySelector('#'+id);
  const Y={x:0,y:0};let yid=null;const yk=$('yk'),yoke=$('yoke');
  const ymove=e=>{const b=yoke.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;let dx=(e.clientX-cx)/(b.width/2),dy=(e.clientY-cy)/(b.height/2);const n=Math.hypot(dx,dy);if(n>1){dx/=n;dy/=n}Y.x=dx;Y.y=dy;yk.style.left=(46+dx*40)+'px';yk.style.top=(46+dy*40)+'px';S.used.yoke=true};
  yoke.addEventListener('pointerdown',e=>{e.preventDefault();yoke.setPointerCapture(e.pointerId);yid=e.pointerId;ymove(e)});
  yoke.addEventListener('pointermove',e=>{if(e.pointerId===yid)ymove(e)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>yoke.addEventListener(n,e=>{if(e.pointerId===yid){yid=null;Y.x=Y.y=0;yk.style.left='46px';yk.style.top='46px'}}));
  const gaz=$('gaz'),gz=$('gz');let gid=null;
  const gset=e=>{const b=gaz.getBoundingClientRect();S.gaz=1-Math.max(0,Math.min(1,(e.clientY-b.top)/b.height));S.used.gaz=true};
  gaz.addEventListener('pointerdown',e=>{e.preventDefault();gaz.setPointerCapture(e.pointerId);gid=e.pointerId;gset(e)});
  gaz.addEventListener('pointermove',e=>{if(e.pointerId===gid)gset(e)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(n=>gaz.addEventListener(n,e=>{if(e.pointerId===gid)gid=null}));
  const K={pg:0,pd:0,u:0,d:0,l:0,r:0};
  const hold=(id,k)=>{const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();K[k]=1});['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,()=>K[k]=0))};
  hold('bpg','pg');hold('bpd','pd');
  const basculeFrein=()=>{S.frein=!S.frein;S.used.frein=true;$('bfr').style.background=S.frein?'#c0392b':'#3a4150'};
  const volets=d=>{S.volets=Math.max(0,Math.min(3,S.volets+d));S.used.volets=true};
  const camSuiv=()=>{const i=CAMS.indexOf(S.cam);if(!S.cabine&&S.etape<2){o.toast('Monte à bord pour changer de caméra.');return}S.cam=CAMS[(i+1)%CAMS.length];S.used.cam=true;msg('Caméra : '+CAMN[S.cam],2)};
  const basculePause=()=>{S.pause=!S.pause;if(S.pause){if(osc)gn.gain.setTargetAtTime(0,ac.currentTime,.05);pauseMenu()}else{dessineCheck()}};
  $('bfr').addEventListener('click',basculeFrein);$('bvp').addEventListener('click',()=>volets(1));$('bvm').addEventListener('click',()=>volets(-1));
  haut.querySelector('#bpause').onclick=basculePause;haut.querySelector('#bcam').onclick=camSuiv;
  const kd=e=>{if(e.target&&e.target.tagName==='INPUT')return;const v=e.type==='keydown'?1:0;
    const mp={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',q:'pg',e:'pd',Q:'pg',E:'pd'};if(mp[e.key]!==undefined){K[mp[e.key]]=v;if(v&&(e.key==='ArrowUp'||e.key==='ArrowDown'))S.used.yoke=true}
    if(!v)return;
    if(e.key==='w'||e.key==='W'){S.gaz=Math.min(1,S.gaz+.08);S.used.gaz=true}if(e.key==='s'||e.key==='S'){S.gaz=Math.max(0,S.gaz-.08);S.used.gaz=true}
    if(e.key==='b'||e.key==='B')basculeFrein();if(e.key==='f'||e.key==='F')volets(1);if(e.key==='v'||e.key==='V')volets(-1);
    if(e.key==='c'||e.key==='C')camSuiv();if(e.key==='p'||e.key==='P')basculePause();if(e.key===' ')e.preventDefault()};
  addEventListener('keydown',kd);addEventListener('keyup',kd);
  let mid=null;
  const mm=e=>{const b=view.getBoundingClientRect();Y.x=Math.max(-1,Math.min(1,(e.clientX-b.left-b.width/2)/(b.width/2)));Y.y=Math.max(-1,Math.min(1,(e.clientY-b.top-b.height/2)/(b.height/2)));yk.style.left=(46+Y.x*40)+'px';yk.style.top=(46+Y.y*40)+'px';S.used.yoke=true};
  view.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.target===r.domElement){mid=e.pointerId;mm(e)}});
  view.addEventListener('pointermove',e=>{if(mid===e.pointerId)mm(e)});
  ['pointerup','pointercancel'].forEach(n=>view.addEventListener(n,e=>{if(mid===e.pointerId){mid=null;Y.x=Y.y=0;yk.style.left='46px';yk.style.top='46px'}}));
  view.addEventListener('wheel',e=>{e.preventDefault();S.gaz=Math.max(0,Math.min(1,S.gaz-e.deltaY*.001));S.used.gaz=true},{passive:false});
  $('aide').textContent=matchMedia('(pointer:fine)').matches?'Clavier : ←→↑↓ manche · W/S gaz · Q/E pédales · B frein · F/V volets · C caméra · P pause · Souris : cliquer-glisser = manche, molette = gaz':'Tactile : joystick à gauche, manette des gaz à droite.';
  const ETAPES=[
    ['Ouvrir la porte de l’avion',()=>{S.porte=true}],
    ['Monter à bord et boucler la ceinture',()=>{S.cabine=true;S.cam='cockpit'}],
    ['Allumer la batterie (master)',()=>{S.batt=true}],
    ['Vérifier : frein de parc serré, gaz au ralenti',()=>{if(S.gaz>.05){o.toast('Mets d’abord la manette des gaz au minimum.');return false}if(!S.frein){S.frein=true;$('bfr').style.background='#c0392b'}}],
    ['Démarrer le moteur (maintenir 2 secondes)','hold']
  ];
  let dem=0,demId=null;
  const btnCheck=(id,t,bg)=>`<button id="${id}" style="width:100%;padding:12px;margin-top:6px;border-radius:9px;background:${bg||'#2e7d32'};color:#fff;border:0;font-size:15px">${t}</button>`;
  function pauseMenu(){
    check.style.display='block';bandeau.style.display='none';
    check.innerHTML=`<b>⏸ Pause</b><br><span style="font-size:12px">Caméra : ${CAMN[S.cam]}</span>${btnCheck('cresume','▶ Reprendre')}${btnCheck('cgfx','🖥 Graphismes : '+(LOW?'économique (appuie pour normal)':'normaux (appuie pour économique)'),'#3a4150')}${btnCheck('cexit','🚪 Abandonner et sortir','#7b2d26')}`;
    check.querySelector('#cresume').onclick=()=>{S.pause=false;dessineCheck()};
    check.querySelector('#cgfx').onclick=()=>{LOW=!LOW;o.onLow(LOW);r.setPixelRatio(LOW?1:Math.min(devicePixelRatio||1,1.5));sc.fog.near=LOW?500:900;sc.fog.far=LOW?3200:5500;nuages.forEach((n,i)=>n.visible=!LOW||i<14);pauseMenu()};
    check.querySelector('#cexit').onclick=()=>{sonMoteur(false);o.onQuit()}}
  function dessineCheck(){
    const m=S.mis;
    if(S.pause){pauseMenu();return}
    if(m&&S.lecture){check.style.display='block';bandeau.style.display='none';
      check.innerHTML=`<b>🎓 ${m.nom}</b><br><span style="font-size:13px">${m.intro}</span><br><b style="color:#ffe082;font-size:12px">Objectif :</b> <span style="font-size:12px">${m.consigne||''}</span>${btnCheck('cok','Compris, c’est parti !')}`;
      check.querySelector('#cok').onclick=()=>{S.lecture=false;dessineCheck()};return}
    if(S.fin)return;
    if(S.etape>=ETAPES.length){check.style.display='none';bandeau.style.display='block';return}
    bandeau.style.display='none';check.style.display='block';
    let h=`<b>✈️ Procédure de départ</b>${m?'<br><span style="font-size:12px;color:#ffe082">Mission : '+m.nom+(m.tmax?' · temps : '+Math.floor(m.tmax/60)+' min '+(m.tmax%60)+' s':'')+'</span>':'<br><span style="font-size:12px;color:#ffe082">Vol libre, sans chrono</span>'}`;
    ETAPES.forEach((e,i)=>{h+=`<div style="margin:3px 0;opacity:${i>S.etape?.45:1}">${i<S.etape?'✅':i===S.etape?'▶':'⬜'} ${e[0]}</div>`});
    const cur=ETAPES[S.etape];
    h+=cur[1]==='hold'?`<button id="cstart" style="width:100%;padding:12px;border-radius:9px;background:#d6302b;color:#fff;border:0;font-size:15px;touch-action:none">🔑 Maintenir pour démarrer</button><div style="height:6px;background:#444;border-radius:3px;margin-top:4px"><div id="cb" style="height:6px;width:${Math.round(dem*50)}%;background:#7CFC00;border-radius:3px"></div></div>`:btnCheck('cnext',S.etape===0?'🚪 Ouvrir la porte':S.etape===1?'🪑 Monter à bord':S.etape===2?'🔋 Batterie ON':'✔ Vérifié');
    check.innerHTML=h;
    const nx=check.querySelector('#cnext');if(nx)nx.onclick=()=>{const rr=ETAPES[S.etape][1]();if(rr===false)return;S.etape++;dessineCheck()};
    const st=check.querySelector('#cstart');if(st){st.addEventListener('pointerdown',e=>{e.preventDefault();demId=1;sonMoteur(true)});['pointerup','pointerleave','pointercancel'].forEach(n=>st.addEventListener(n,()=>{demId=null}))}
  }
  function actionsBas(){
    const a=$('act');let h='';
    const pres=S.sol&&S.v<1.5&&Math.hypot(S.x-STAND.x,S.z-STAND.z)<30;
    if(S.moteur&&S.sol&&S.v<1.5)h+=btn('⏻ Couper le moteur','','bcut');
    if(pres&&!S.moteur&&S.carb<99)h+=btn('⛽ Faire le plein','','bplein');
    if(!S.moteur&&S.etape>=ETAPES.length&&S.sol&&pres)h+=btn('🚪 Quitter l’avion','background:#2e7d32','bquit');
    if(!S.moteur&&S.etape>=ETAPES.length&&S.sol&&!pres)h+=btn('🔑 Redémarrer','','bres')+btn('↩ Retour au parking','','bpark');
    a.innerHTML=h;
    const g=id=>a.querySelector('#'+id);
    if(g('bcut'))g('bcut').onclick=()=>{S.moteur=false;sonMoteur(false);S.frein=true;$('bfr').style.background='#c0392b';actionsBas()};
    if(g('bplein'))g('bplein').onclick=()=>{S.carb=100;msg('Plein fait : 100 % de carburant.',3);actionsBas()};
    if(g('bquit'))g('bquit').onclick=()=>o.onQuit();
    if(g('bres'))g('bres').onclick=()=>{S.etape=ETAPES.length-1;dessineCheck()};
    if(g('bpark'))g('bpark').onclick=()=>retourParking('Retour au parking.');
  }
  let lastAct='';
  function msg(t,s){S.msg=t;S.tmsg=s||3}
  function retourParking(txt){
    S.x=STAND.x;S.z=STAND.z;S.y=0;S.psi=STAND.psi;S.pitch=0;S.roll=0;S.v=0;S.vy=0;S.gaz=0;S.moteur=false;S.rpm=0;S.sol=true;S.frein=true;S.volets=0;S.fin=false;S.t0=null;S.reste=S.mis&&S.mis.tmax?S.mis.tmax:0;S.posee=0;S.u={};
    sonMoteur(false);balises.forEach(b=>{b.ok=false;b.t.material.color.set('#ffc107');b.g.children[1].material.color.set('#ffc107')});S.etape=ETAPES.length-1;S.porte=true;S.cabine=true;S.batt=true;S.cam='cockpit';
    msg(txt||'Retour à l’aéroport.',5);dessineCheck();actionsBas();$('bfr').style.background='#c0392b';lastAct=''}
  function echec(raison){
    if(S.fin)return;S.fin=true;sonMoteur(false);o.onFin({id:S.mis&&S.mis.id,ok:false,raison});
    check.style.display='block';bandeau.style.display='none';check.innerHTML=`<b style="color:#ff8a80">❌ ${S.mis&&S.mis.type==='chrono'?'Mission échouée':'Incident'}</b><br>${raison}<br>Tu rentres à l’aéroport.${btnCheck('cre','🛬 Retourner à l’aéroport','#1f5f9e')}`;
    check.querySelector('#cre').onclick=()=>{retourParking('Retour à l’aéroport. Tu peux réessayer.')}}
  function finLecon(){
    if(S.fait)return;S.fait=true;const m=S.mis;o.onFin({id:m.id,ok:true,lecon:true});
    check.style.display='block';bandeau.style.display='none';check.innerHTML=`<b style="color:#a5d6a7">✅ ${m.nom} : réussi !</b><br><span style="font-size:13px">${m.fin||''}</span>${btnCheck('cok','Continuer')}`;
    check.querySelector('#cok').onclick=()=>{S.mis=null;S.consigne='';S.prog='';balises.length=0;gBal.clear();dessineCheck();actionsBas()}}
  function succes(){
    if(S.fin)return;S.fin=true;const m=S.mis,temps=Math.round(m.tmax-S.reste);o.onFin({id:m.id,ok:true,temps,reste:Math.round(S.reste)});
    check.style.display='block';bandeau.style.display='none';check.innerHTML=`<b style="color:#a5d6a7">✅ Mission accomplie !</b><br>Temps : ${Math.floor(temps/60)} min ${temps%60} s (il te restait ${Math.round(S.reste)} s)<br>${m.fin||''}<br>Ramène l’avion au parking, coupe le moteur et quitte l’appareil.${btnCheck('cok','Continuer')}`;
    check.querySelector('#cok').onclick=()=>{S.fin=false;S.mis=null;S.t0=null;balises.length=0;gBal.clear();dessineCheck();actionsBas()}}
  function quizFleuve(){
    if(S.u.q)return;S.u.q=1;S.pause=true;check.style.display='block';bandeau.style.display='none';
    const ch=['Le fleuve Congo','Le fleuve Nil','Le fleuve Niger','Le fleuve Zambèze'];
    check.innerHTML='<b>🌊 Question</b><br>Comment s’appelle ce grand fleuve qui sépare Kinshasa et Brazzaville ?'+ch.map((c,i)=>btnCheck('q'+i,c,'#3a4150')).join('');
    ch.forEach((c,i)=>check.querySelector('#q'+i).onclick=()=>{if(i===0){S.quizOk=true;S.pause=false;S.u.q=2;dessineCheck()}else{msg('Ce n’est pas ça… regarde l’étiquette sur le fleuve.',4);S.u.q=0;S.pause=false;dessineCheck()}})}
  const surface=()=>{const x=S.x,z=S.z;if(Math.abs(x)<14&&z<125&&z>-312)return 'piste';if(z>94&&z<106&&x>-64&&x<5)return 'taxi';if(x>-70&&x<-34&&z>80&&z<120)return 'aire';return 'herbe'};
  let tFait=0;
  function pas(dt){
    if(S.pause)return;
    if(demId&&S.etape===ETAPES.length-1){dem+=dt/2;if(dem>=1){S.moteur=true;S.etape++;dem=0;demId=null;dessineCheck();actionsBas();msg('Moteur démarré ! Relâche le frein de parc, puis pousse les gaz.',5)}}
    else if(!demId)dem=Math.max(0,dem-dt*2);
    const cb=check.querySelector('#cb');if(cb)cb.style.width=Math.round(dem*100)+'%';
    const kx=K.r-K.l,ky=K.d-K.u;const ix=Math.abs(Y.x)>.02?Y.x:kx,iy=Math.abs(Y.y)>.02?Y.y:ky;S.yok.x=ix;S.yok.y=iy;
    S.rudder=K.pd-K.pg;
    if(S.moteur){S.carb=Math.max(0,S.carb-(.03+S.rpm*.1)*dt);if(S.carb<=0){S.moteur=false;sonMoteur(false);msg('⛽ Panne sèche ! Plane vers la piste.',6);actionsBas()}else if(S.carb<15&&S.tmsg<=0)msg('⚠ Carburant faible : '+Math.round(S.carb)+' %',2)}
    S.rpm+=((S.moteur?(.25+S.gaz*.75):0)-S.rpm)*Math.min(1,dt*1.5);
    gz.style.bottom=Math.round(S.gaz*94)+'px';$('gv').textContent=Math.round(S.gaz*100)+' %';
    const vs=26-S.volets*2.6;
    const poussee=S.moteur?S.rpm*5.6:0;
    const sf=surface();
    const roul=S.sol?(sf==='herbe'?.9:.18):0,fr=S.sol&&S.frein?(S.moteur&&S.gaz>.6?3:4.5):0;
    S.v=Math.max(0,S.v+(poussee-.0017*S.v*S.v-roul-fr-(S.volets*.0004*S.v*S.v))*dt);
    if(S.sol&&S.frein&&S.v<.3)S.v=0;
    const vr=vs*1.15;
    if(S.sol){
      S.pitch+=((S.v>=vr*.9?iy*.3:0)-S.pitch)*Math.min(1,dt*3);S.pitch=Math.max(0,S.pitch);S.roll+=(0-S.roll)*Math.min(1,dt*6);
      const gv=Math.min(1,S.v/5);S.psi+=S.rudder*.5*dt*gv*(S.v>.5?1:0)+(S.v>1?ix*.12*dt*Math.min(1,S.v/10):0);
      if(S.v>=vr&&S.pitch>.06){S.sol=false;S.posee=0;msg('Décollage ! La portance soulève l’avion.',3)}
    }else{
      S.pitch+=((iy)*.4-S.pitch)*Math.min(1,dt*2.2);S.roll+=((ix)*.75-S.roll)*Math.min(1,dt*2.4);
      const vg=Math.max(18,S.v);S.psi+=(Math.tan(S.roll)*9.81/vg)*dt+S.rudder*.12*dt;
      const decroche=S.v<vs*1.02;S.stall=decroche;
      const montee=S.v*Math.sin(S.pitch)*(S.v>vs?1:.4);
      const chute=decroche?Math.min(22,(vs-S.v)*2.4+6):0;
      S.vy+=((montee-chute-(S.moteur?0:2.2))-S.vy)*Math.min(1,dt*1.6);
      S.y+=S.vy*dt;
      if(S.pitch>.35&&S.v<vs*1.2)S.v=Math.max(0,S.v-dt*3);
      if(S.y<=0){
        const dur=S.vy;S.y=0;const ok=(sf==='piste'||sf==='taxi'||sf==='aire');
        if(dur<-9||Math.abs(S.roll)>.45||S.pitch>.4||S.pitch<-.2||!ok){S.vy=0;S.v=0;echec(!ok?'Atterrissage en dehors de la piste.':dur<-9?'Atterrissage trop brutal.':'Mauvaise assiette à l’atterrissage.');return}
        S.sol=true;S.vy=0;S.posee++;msg(dur<-4?'Atterrissage un peu dur… on freine !':'Beau toucher ! Freine pour t’arrêter.',3);S.roll=0}
    }
    const f=S.v*dt;S.x+=Math.sin(S.psi)*f*Math.cos(S.pitch);S.z-=Math.cos(S.psi)*f*Math.cos(S.pitch);
    if(S.sol)S.y=0;
    if(!S.fin){
      {const hm=alt(S.x,S.z);if(hm>2&&S.y<hm+1){S.v=0;echec('Collision avec une montagne.');return}}
      for(const b of boites){if(Math.abs(S.x-b.x)<b.hw+3&&Math.abs(S.z-b.z)<b.hw+3&&S.y<b.h){S.v=0;echec('Collision avec un bâtiment de la ville.');return}}
      if(Math.hypot(S.x,S.z)>7000){echec('Tu t’es trop éloigné de l’aéroport.');return}
    }
    if(S.mis&&!S.fin){
      if(S.mis.type==='chrono'){
        if(S.t0===null&&S.moteur&&S.v>2&&!S.lecture){S.t0=1;msg('Chrono lancé ! '+Math.floor(S.mis.tmax/60)+' min '+S.mis.tmax%60+' s',3)}
        if(S.t0!==null){S.reste-=dt;if(S.reste<=0){S.reste=0;echec('Temps écoulé.');return}}
      }
      balises.forEach(b=>{if(!b.ok&&b.p.distanceTo(new THREE.Vector3(S.x,S.y+2,S.z))<34){b.ok=true;b.t.material.color.set('#2ecc71');b.g.children[1].material.color.set('#2ecc71');msg('✅ Anneau '+balises.filter(q=>q.ok).length+' / '+balises.length,2)}});
      if(S.mis.quiz&&balises.length&&balises.every(b=>b.ok)&&!S.quizOk)quizFleuve();
      if(S.mis.type==='chrono'&&balises.length&&balises.every(b=>b.ok)&&S.sol&&S.posee>0&&S.v<3&&(sf==='piste'||sf==='taxi'||sf==='aire'))succes();
      verifLecon(dt);
    }
    if(S.tmsg>0){S.tmsg-=dt;if(S.tmsg<=0)S.msg=''}
    tFait+=dt;if(tFait>50&&S.moteur&&!S.fin&&!S.lecture){tFait=0;msg(FAITS[Math.floor(Math.random()*FAITS.length)],9)}
    if(osc){osc.frequency.setTargetAtTime(38+S.rpm*95,ac.currentTime,.1);gn.gain.setTargetAtTime(S.moteur?.05+S.rpm*.06:0,ac.currentTime,.1)}
  }
  const aiC=$('ai').getContext('2d');
  function instruments(){
    const kt=Math.round(S.v*KT),alt_=Math.round(S.y*3.28),vsi=Math.round(S.vy*196.85/10)*10,cap=((Math.round(S.psi*180/Math.PI)%360)+360)%360;
    const cf=S.carb<15?'#ff5252':S.carb<35?'#ffb74d':'#a5d6a7';
    $('ins').innerHTML=`VIT <b style="color:${S.stall&&!S.sol?'#ff5252':'#a5d6a7'}">${kt}</b> kt · ALT <b>${alt_}</b> ft<br>CAP <b>${String(cap).padStart(3,'0')}°</b> · VZ <b>${vsi}</b><br>⛽ <b style="color:${cf}">${Math.round(S.carb)} %</b> · VOLETS <b>${S.volets*10}°</b> · ${S.frein?'<span style="color:#ff8a80">FREIN</span>':'frein ok'}${S.stall&&!S.sol?'<br><span style="color:#ff5252">⚠ DÉCROCHAGE : mets des gaz !</span>':''}`;
    const g=aiC,W=120;g.save();g.clearRect(0,0,W,W);g.beginPath();g.arc(60,60,58,0,7);g.clip();g.translate(60,60);g.rotate(S.roll);
    const dy=S.pitch*180;g.fillStyle='#4aa0d8';g.fillRect(-100,-200+dy,200,200);g.fillStyle='#8a5a2b';g.fillRect(-100,dy,200,200);g.fillStyle='#fff';g.fillRect(-100,dy-1,200,2);
    g.restore();g.strokeStyle='#ffeb3b';g.lineWidth=3;g.beginPath();g.moveTo(25,60);g.lineTo(50,60);g.moveTo(70,60);g.lineTo(95,60);g.moveTo(60,56);g.lineTo(60,64);g.stroke();
    let t='';
    if(S.mis){
      if(S.mis.type==='chrono'){const m=Math.floor(S.reste/60),s=Math.floor(S.reste%60);t+=`⏱ <span style="color:${S.reste<30&&S.t0!==null?'#ff5252':'#fff'}">${m}:${String(s).padStart(2,'0')}</span> · `}
      t+=`${S.mis.nom}<br>🎯 ${S.consigne}${S.prog?'<br>📊 '+S.prog:''}<br>`}
    const tg=balises.find(b=>!b.ok);
    if(S.mis&&S.moteur&&!S.fin&&tg){const dx=tg.p.x-S.x,dz=tg.p.z-S.z,rel=Math.atan2(dx,-dz)-S.psi,n=Math.atan2(Math.sin(rel),Math.cos(rel));t+=(Math.abs(n)<.15?'⬆ anneau droit devant':n>0?'➡ anneau à droite':'⬅ anneau à gauche')+' · '+Math.round(Math.hypot(dx,dz))+' m · '+(tg.p.y>S.y+15?'monte':tg.p.y<S.y-15?'descends':'altitude OK')+'<br>'}
    t+=`<span style="color:#ffe082">${S.msg}</span>`;hud.innerHTML=t;
    bandeau.innerHTML='🧭 Caméra : '+CAMN[S.cam]+' · '+(S.mis?'Mission : '+S.mis.nom:'Vol libre');
    const sig=(S.etape)+'|'+S.moteur+'|'+(S.sol&&S.v<1.5)+'|'+S.fin+'|'+(S.carb<99);if(sig!==lastAct){lastAct=sig;actionsBas();if(!S.pause&&!S.lecture)dessineCheck()}
  }
  let tPano=0;
  function dessine(dt){
    av.position.set(S.x,S.y,S.z);av.rotation.order='YXZ';av.rotation.y=-S.psi;av.rotation.x=S.pitch;av.rotation.z=-S.roll;
    if(!S.pause){pales.rotation.z+=S.rpm*40*dt;nuages.forEach(n=>n.position.x+=dt*3)}
    disque.material.opacity=Math.min(.35,S.rpm*.5);pales.visible=S.rpm<.5;
    porte.rotation.y=THREE.MathUtils.lerp(porte.rotation.y,S.porte&&!S.cabine?1.2:S.porte?.1:0,Math.min(1,dt*4));
    gouv.rotation.y=-S.rudder*.5;mancheG.rotation.x=-S.yok.y*.4;mancheG.rotation.z=-S.yok.x*.5;
    const mode=(!S.cabine&&S.etape<2)?'lateral':S.cam;
    const cp=mode==='cockpit'&&S.cabine;cock.visible=cp;coque.visible=!cp;
    const fx=Math.sin(S.psi),fz=-Math.cos(S.psi),rx=Math.cos(S.psi),rz=Math.sin(S.psi);
    if(cp){const lp_=new THREE.Vector3(-.28,1.65,-.15).applyEuler(av.rotation).add(av.position);cam.position.copy(lp_);const dir=new THREE.Vector3(0,.02,-10).applyEuler(av.rotation);cam.lookAt(lp_.clone().add(dir));cam.rotateZ(-S.roll*.6)}
    else if(mode==='arriere'){cam.position.set(S.x-fx*17,S.y+5.5,S.z-fz*17);cam.lookAt(S.x,S.y+1.4,S.z)}
    else if(mode==='lateral'){cam.position.set(S.x+rx*14-fx*4,S.y+4,S.z+rz*14-fz*4);cam.lookAt(S.x,S.y+1.4,S.z)}
    else{tPano+=S.pause?0:dt*.25;cam.position.set(S.x+Math.cos(tPano)*70,S.y+38,S.z+Math.sin(tPano)*70);cam.lookAt(S.x,S.y,S.z)}
    r.render(sc,cam);
  }
  let last=performance.now(),raf=0;
  function boucle(now){const dt=Math.min(.05,(now-last)/1000);last=now;pas(dt);instruments();dessine(dt);raf=requestAnimationFrame(boucle)}
  demarrerMission(o.mission);dessineCheck();actionsBas();raf=requestAnimationFrame(boucle);
  const rs=()=>{const w=el.clientWidth||W0,h=Math.max(200,view.clientHeight||H0);r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()};
  addEventListener('resize',rs);setTimeout(rs,50);
  return {
    stop(){cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',rs);sonMoteur(false);try{r.dispose()}catch(e){}el.innerHTML=''},
    etat:S,K,Y,tour:pas,choisir:demarrerMission,etapes:ETAPES,dessineCheck,balises,boites,cones,verif:verifLecon
  };
}
