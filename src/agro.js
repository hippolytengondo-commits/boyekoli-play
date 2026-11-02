// BOYEKOLI FARM : jeu d'agriculture et d'élevage en 3D. Parcelles, cultures congolaises (manioc, maïs, arachide, riz, plantain, café…),
// météo et saisons, arrosage, mauvaises herbes, parasites, engrais et rotation, élevage (poules, chèvres, tilapia), marché, 10 missions.
import * as THREE from 'three';

const CULT={
 manioc:{nom:'Manioc',ico:'🥔',col:'#9c7a4a',jours:8,prix:12,sem:5,eau:1,txt:'Le manioc pousse en terrain pauvre et fournit les feuilles (saka-saka) et les racines (chikwangue).'},
 mais:{nom:'Maïs',ico:'🌽',col:'#e8c04a',jours:5,prix:8,sem:3,eau:2,txt:'Le maïs pousse vite mais demande de l’eau régulière.'},
 arachide:{nom:'Arachide',ico:'🥜',col:'#c9a06a',jours:5,prix:10,sem:4,eau:1,txt:'Les arachides enrichissent le sol en azote : bonne culture après le maïs.'},
 haricot:{nom:'Haricot',ico:'🫘',col:'#8a3a2a',jours:4,prix:7,sem:2,eau:1,txt:'Le haricot est rapide et riche en protéines ; comme l’arachide, il nourrit le sol.'},
 riz:{nom:'Riz',ico:'🍚',col:'#d9d27a',jours:6,prix:11,sem:4,eau:3,txt:'Le riz demande beaucoup d’eau : il pousse bien en saison des pluies.'},
 plantain:{nom:'Banane plantain',ico:'🍌',col:'#d4c13a',jours:9,prix:15,sem:6,eau:2,txt:'La banane plantain est un aliment de base dans beaucoup de provinces.'},
 cafe:{nom:'Café',ico:'☕',col:'#6b3a1f',jours:10,prix:22,sem:8,eau:1,txt:'Le café d’Ituri, du Kivu et de l’Équateur est exporté : une culture de rapport.'}};
const FIX=['','🌱','🌿'];
const GR=8,GH=5,CELL=2.6;
const MISSIONS=[
 {id:'g1',nom:'Mon premier semis',txt:'Sème, arrose et récolte une culture.',ok:s=>s.rec>=1,pieces:5},
 {id:'g2',nom:'La récolte de maïs',txt:'Récolte 6 unités de maïs.',ok:s=>(s.cul.mais||0)>=6,pieces:6},
 {id:'g3',nom:'Une ferme bien soignée',txt:'Récolte 4 fois sans perdre de culture à cause des parasites.',ok:s=>s.rec>=4&&s.perdu===0,pieces:6},
 {id:'g4',nom:'Le poulailler',txt:'Aie 5 poules et récolte 10 œufs.',ok:s=>s.poule>=5&&s.oeufs>=10,pieces:7},
 {id:'g5',nom:'L’étang à poissons',txt:'Pêche 4 tilapias.',ok:s=>s.pech>=4,pieces:7},
 {id:'g6',nom:'Le compost',txt:'Utilise l’engrais naturel 3 fois.',ok:s=>s.eng>=3,pieces:6},
 {id:'g7',nom:'La rotation des cultures',txt:'Récolte 3 cultures différentes pour garder un sol fertile.',ok:s=>Object.keys(s.cul).length>=3,pieces:8},
 {id:'g8',nom:'Au marché',txt:'Vends 20 produits et gagne 300 pf au total.',ok:s=>s.vendu>=20&&s.gain>=300,pieces:8},
 {id:'g9',nom:'Une ferme prospère',txt:'Atteins 1 000 pf dans ta caisse.',ok:s=>s.fc>=1000,pieces:10},
 {id:'g10',nom:'La grande ferme',txt:'Aie 4 cultures récoltées, 3 sortes d’animaux et 500 pf.',ok:s=>Object.keys(s.cul).length>=4&&s.poule>=1&&s.chevre>=1&&s.poisson>=1&&s.fc>=500,pieces:15}];
const SAVOIRS=[
 ['💧 L’eau','Les plantes ont soif : arrose le matin ou le soir. La saison des pluies arrose gratuitement mais fait aussi pousser les mauvaises herbes.'],
 ['🌿 Les mauvaises herbes','Elles volent l’eau et la lumière des cultures. On les arrache à la main ou à la houe avant qu’elles ne grandissent.'],
 ['🐛 Les parasites','Les insectes et les maladies abîment les plantes. Un traitement naturel (feuilles de neem) protège sans polluer.'],
 ['♻️ L’engrais naturel','Le compost (déchets de cuisine, feuilles, fumier) redonne de la force au sol, sans produits chimiques.'],
 ['🔄 La rotation','Changer de culture à chaque saison évite d’épuiser la terre. Après le maïs, plante des arachides ou des haricots.'],
 ['🐔 L’élevage','Les poules donnent des œufs, les chèvres du lait, les tilapias de la chair. Les animaux nourris et bien soignés produisent plus.'],
 ['🛒 Le marché','Les prix changent chaque jour : vendre au bon moment rapporte plus. Les produits transformés valent plus cher que les produits bruts.'],
 ['🌍 Les provinces','Le café pousse à l’Est et au Nord, le riz et le manioc un peu partout, le palmier à huile dans la cuvette centrale, le cacao à l’Équateur.']];

export function creerAgro(D){
  const {PAR,G,esc,SFX,save,refreshHud,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const AG=()=>{const a=A();if(!a.agro)a.agro=neuf();const g=a.agro;['stock','done','stars','badges'].forEach(k=>{if(!g[k])g[k]={}});if(g.ration===undefined)g.ration=6;if(!g.st)g.st={rec:0,perdu:0,cul:{},oeufs:0,pech:0,eng:0,vendu:0,gain:0};return g};
  function neuf(){return {fc:250,jour:1,pluie:false,sais:'pluies',parc:Array(GR*GH).fill(null).map(()=>({c:null,p:0,eau:1,her:false,par:0,sol:2,prev:null})),stock:{},ani:{poule:0,chevre:0,poisson:0},ration:6,alerteAli:false,pt:{},done:{},stars:{},badges:{},cert:null,st:{rec:0,perdu:0,cul:{},oeufs:0,pech:0,eng:0,vendu:0,gain:0}}}
  let ov=null,R=null,sc=null,cam=null,raf=0,pop=null,tab='ferme',outil='arroser',graine='mais',cs={yaw:.5,pitch:.9,dist:30},ptr=new Map(),cells=[],grp=null,anim=[],tm=0,vit=1,sautSave=0,rain=null,hemi=null,sun=null,pause=false;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:7px 10px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#3b5a3a'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>save(),500)};
  const M=(c,r)=>new THREE.MeshStandardMaterial({color:c,roughness:r===undefined?.85:r});
  const box=(g,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
  const pos=i=>[(i%GR-GR/2+.5)*CELL,(Math.floor(i/GR)-GH/2+.5)*CELL];
  const prixJour=(k)=>{const j=AG().jour,base={manioc:12,mais:8,arachide:10,haricot:7,riz:11,plantain:15,cafe:22,oeuf:2,lait:6,poisson:14}[k]||5;return Math.max(1,Math.round(base*(0.8+0.5*Math.abs(Math.sin(j*1.7+k.length)))))};
  const statsM=()=>{const g=AG();return Object.assign({},g.st,{fc:Math.round(g.fc),poule:g.ani.poule,chevre:g.ani.chevre,poisson:g.ani.poisson})};
  // ---------- 3D
  function parcelle(i){
    if(cells[i])grp.remove(cells[i]);const g=AG(),p=g.parc[i],[x,z]=pos(i),o=new THREE.Group();o.position.set(x,0,z);
    box(o,CELL-.2,.2,CELL-.2,M(p.eau>0?'#5a3d26':'#8a6a46'),0,.1,0);
    if(p.c){const C=CULT[p.c],r=Math.min(1,p.p/C.jours),h=.15+r*(p.c==='mais'||p.c==='plantain'||p.c==='cafe'?1.4:.8);
      for(let k=0;k<4;k++)for(let l=0;l<3;l++){const a=-.7+k*.47,b=-.7+l*.7;const s=new THREE.Mesh(new THREE.ConeGeometry(.12+r*.1,h,6),M(r>=1?'#e8c04a':p.c==='cafe'?'#2f6a2f':'#4f9c3c'));s.position.set(a,.2+h/2,b);o.add(s)}
      if(r>=1){const ico=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),new THREE.MeshBasicMaterial({color:'#ffd54f'}));ico.position.set(0,2,0);o.add(ico)}}
    if(p.her)for(let k=0;k<5;k++){const w=new THREE.Mesh(new THREE.ConeGeometry(.12,.5,5),M('#7cbf3a'));w.position.set(-.8+k*.4,.45,(k%2)*.8-.4);o.add(w)}
    if(p.par>0)for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.SphereGeometry(.09,6,5),new THREE.MeshBasicMaterial({color:'#d6302b'}));b.position.set(-.5+k*.35,1.1,(k%2)*.7-.3);o.add(b)}
    o.userData.i=i;cells[i]=o;grp.add(o)}
  function monde(){
    if(grp)sc.remove(grp);grp=new THREE.Group();sc.add(grp);cells=[];anim=[];const g=AG();
    const sol=new THREE.Mesh(new THREE.PlaneGeometry(90,70),M('#6aa04a',1));sol.rotation.x=-Math.PI/2;sol.userData.sol=1;grp.add(sol);
    for(let i=0;i<GR*GH;i++)parcelle(i);
    // grange, puits, marché
    const bx=-GR*CELL/2-6,bz=-4;box(grp,5,3,4,M('#a5532f'),bx,1.5,bz);const toit=new THREE.Mesh(new THREE.ConeGeometry(3.6,1.6,4),M('#7a4a2e'));toit.rotation.y=Math.PI/4;toit.position.set(bx,3.8,bz);grp.add(toit);
    box(grp,1.2,.8,1.2,M('#8a8d91'),bx+3,.4,bz+5);box(grp,.1,1.4,.1,M('#555'),bx+2.5,1.4,bz+5);
    box(grp,3,.2,2,M('#c9733d'),GR*CELL/2+6,2.2,-4);[-1.3,1.3].forEach(a=>box(grp,.12,2.2,.12,M('#6b4423'),GR*CELL/2+6+a,1.1,-4+.8));box(grp,2.6,.5,1.6,M('#e8c04a'),GR*CELL/2+6,.8,-4);
    // poulailler (enclos), chèvrerie, étang
    const ex=-GR*CELL/2-6,ez=8;for(let k=0;k<12;k++){const a=k/12*Math.PI*2;box(grp,.1,.8,.1,M('#6b4423'),ex+Math.cos(a)*3.2,.4,ez+Math.sin(a)*3.2)}
    const et=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,.12,24),new THREE.MeshStandardMaterial({color:'#3fa9d9',roughness:.2}));et.position.set(GR*CELL/2+6,.06,9);grp.add(et);
    grp.userData.ex=[ex,ez];grp.userData.etang=[GR*CELL/2+6,9];grp.userData.ch=[ex+9,ez+1];
    animaux();
    const pts=new Float32Array(500*6);for(let i=0;i<500;i++){const x=(Math.random()-.5)*60,y=Math.random()*25,z=(Math.random()-.5)*50;pts.set([x,y,z,x,y-.8,z],i*6)}
    rain=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(pts,3)),new THREE.LineBasicMaterial({color:'#9fc3e8',transparent:true,opacity:.6}));rain.visible=false;grp.add(rain);meteo()}
  function animaux(){
    anim.forEach(a=>grp.remove(a.o));anim=[];const g=AG(),[ex,ez]=grp.userData.ex,[tx,tz]=grp.userData.etang,[cx,cz]=grp.userData.ch;
    for(let i=0;i<g.ani.poule;i++){const o=new THREE.Group();box(o,.3,.25,.4,M(i%2?'#f2f2f2':'#a5532f'),0,.3,0);box(o,.12,.2,.12,M('#d6302b'),0,.5,.2);grp.add(o);anim.push({o,t:'p',cx:ex,cz:ez,r:2.4,a:i*1.3})}
    for(let i=0;i<g.ani.chevre;i++){const o=new THREE.Group();box(o,.5,.45,.9,M('#d9d0bd'),0,.55,0);box(o,.25,.3,.3,M('#d9d0bd'),0,.9,.5);[-.2,.2].forEach(a=>[-.3,.3].forEach(b=>box(o,.08,.35,.08,M('#8a8d91'),a,.18,b)));grp.add(o);anim.push({o,t:'c',cx,cz,r:3,a:i*2.1})}
    for(let i=0;i<g.ani.poisson;i++){const o=new THREE.Mesh(new THREE.SphereGeometry(.18,6,5),new THREE.MeshBasicMaterial({color:'#e8c04a'}));o.scale.set(1.6,.7,.7);grp.add(o);anim.push({o,t:'f',cx:tx,cz:tz,r:2.4,a:i*.9})}}
  function meteo(){if(!sc)return;const g=AG();rain.visible=g.pluie;sc.background=new THREE.Color(g.pluie?'#8b97a3':'#a9d6f5');hemi.intensity=g.pluie?.9:1.5;sun.intensity=g.pluie?.5:1.3}
  // ---------- jour suivant
  function jour(){
    const g=AG();g.jour++;if(g.jour%20===1){g.sais=g.sais==='pluies'?'sèche':'pluies';toast(g.sais==='pluies'?'🌧 Début de la saison des pluies !':'☀️ Début de la saison sèche.')}
    g.pluie=Math.random()<(g.sais==='pluies'?.45:.1);let alerte='';
    g.parc.forEach((p,i)=>{
      if(g.pluie&&p.c)p.eau=3;else if(p.c)p.eau=Math.max(0,p.eau-1);
      if(p.c){const C=CULT[p.c];
        if(p.eau>=1&&!(p.c==='riz'&&p.eau<2)){p.p+=1}else p.stress=(p.stress||0)+1;
        if(Math.random()<(g.pluie?.2:.1))p.her=true;
        if(!p.par&&Math.random()<.06)p.par=1;else if(p.par>0)p.par++;
        if(p.par>=3){g.st.perdu++;p.c=null;p.p=0;p.par=0;alerte='🐛 Des parasites ont détruit une parcelle ! Traite vite avec le neem.'}
        if((p.stress||0)>=3){g.st.perdu++;p.c=null;p.p=0;p.stress=0;alerte='🥀 Une culture a séché faute d’eau. Arrose chaque jour !'}}
      parcelle(i)});
    // animaux
    const nbAni=g.ani.poule+g.ani.chevre+g.ani.poisson,besoin=Math.ceil(nbAni/3),nu=nbAni>0&&(g.ration||0)>=besoin;
    if(nbAni>0&&nu){g.ration-=besoin;g.alerteAli=false;g.stock.oeuf=(g.stock.oeuf||0)+g.ani.poule;g.st.oeufs+=g.ani.poule;if(g.jour%2===0)g.stock.lait=(g.stock.lait||0)+g.ani.chevre}
    if(g.ani.poisson&&g.jour%7===0){g.stock.poisson=(g.stock.poisson||0)+g.ani.poisson;toast('🐟 Les tilapias ont grandi : à pêcher !')}
    if(nbAni>0&&!nu&&!g.alerteAli){g.alerteAli=true;alerte=alerte||'🌾 Plus d’aliments pour les animaux : achète des rations dans l’onglet Élevage. Ils ne produisent plus tant qu’ils ne sont pas nourris.'}
    meteo();if(alerte){msg(alerte,4000);PAR.dire(alerte,'bea')}
    maj();verifMissions();sauve()}
  // ---------- actions sur parcelle
  function agir(i){
    const g=AG(),p=g.parc[i];if(!p)return;
    if(outil==='semer'){const C=CULT[graine];if(p.c){msg('Cette parcelle est déjà cultivée.');return}if(g.fc<C.sem){msg('💰 Pas assez de pf pour les semences ('+C.sem+').');SFX.ko&&SFX.ko();return}g.fc-=C.sem;const rot=p.prev&&p.prev!==graine;p.c=graine;p.p=0;p.eau=Math.max(p.eau,1);p.stress=0;p.rot=!!rot;SFX.coin&&SFX.coin()}
    else if(outil==='arroser'){if(!p.c){msg('Rien à arroser ici.');return}p.eau=3;SFX.coin&&SFX.coin()}
    else if(outil==='desherber'){if(!p.her){msg('Pas de mauvaises herbes ici.');return}p.her=false;SFX.coin&&SFX.coin()}
    else if(outil==='soigner'){if(!p.par){msg('Aucun parasite ici.');return}if(g.fc<5){msg('💰 Il faut 5 pf de neem.');return}g.fc-=5;p.par=0;SFX.coin&&SFX.coin()}
    else if(outil==='engrais'){if(g.fc<4){msg('💰 Il faut 4 pf de compost.');return}if(p.sol>=3){msg('Ce sol est déjà très fertile.');return}g.fc-=4;p.sol=Math.min(3,p.sol+1);g.st.eng++;SFX.coin&&SFX.coin()}
    else if(outil==='recolter'){const C=p.c&&CULT[p.c];if(!C){msg('Rien à récolter.');return}if(p.p<C.jours){msg('Pas encore mûr : encore '+(C.jours-p.p)+' jour(s).');return}
      let q=4+(p.sol>=3?2:p.sol>=2?1:0)+(p.rot?1:0)-(p.her?1:0)-((p.stress||0)>0?1:0);q=Math.max(1,q);
      g.stock[p.c]=(g.stock[p.c]||0)+q;g.st.rec++;g.st.cul[p.c]=(g.st.cul[p.c]||0)+q;p.prev=p.c;p.c=null;p.p=0;p.sol=Math.max(0,p.sol-1);p.her=false;p.par=0;SFX.win&&SFX.win();msg('✅ Récolte : +'+q+' '+C.nom);D.mis&&D.mis.evt('agr','recolte',p.prev)}
    parcelle(i);maj();verifMissions();sauve()}
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();
  function entrees(){
    const cv=R.domElement;cv.style.touchAction='none';
    cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,mv:false})});
    cv.addEventListener('pointermove',e=>{const p=ptr.get(e.pointerId);if(!p)return;if(Math.hypot(e.clientX-p.x0,e.clientY-p.y0)>7)p.mv=true;
      if(ptr.size===2){const a=[...ptr.values()],d0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);p.x=e.clientX;p.y=e.clientY;const b=[...ptr.values()],d1=Math.hypot(b[0].x-b[1].x,b[0].y-b[1].y);cs.dist=Math.max(10,Math.min(60,cs.dist-(d1-d0)*.08));return}
      if(p.mv){cs.yaw-=(e.clientX-p.x)*.008;cs.pitch=Math.max(.3,Math.min(1.5,cs.pitch+(e.clientY-p.y)*.006))}p.x=e.clientX;p.y=e.clientY});
    cv.addEventListener('pointerup',e=>{const p=ptr.get(e.pointerId);ptr.delete(e.pointerId);if(p&&!p.mv&&ptr.size===0)toucher(e)});
    cv.addEventListener('pointercancel',e=>ptr.delete(e.pointerId));cv.addEventListener('wheel',e=>{e.preventDefault();cs.dist=Math.max(10,Math.min(60,cs.dist+e.deltaY*.04))},{passive:false})}
  function toucher(e){
    const b=R.domElement.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,cam);
    const h=ray.intersectObjects(grp.children,true);for(const x of h){let o=x.object;while(o&&o.userData.i===undefined&&o.parent)o=o.parent;if(o&&o.userData.i!==undefined){agir(o.userData.i);return}}}
  // ---------- boucle
  function boucle(){
    raf=requestAnimationFrame(boucle);if(!R)return;const t=performance.now(),dt=Math.min(.05,(t-(boucle.t||t))/1000);boucle.t=t;
    if(!pause){tm+=dt*vit;if(tm>=20){tm=0;jour()}}
    const now=t/1000;anim.forEach(a=>{const x=a.cx+Math.cos(now*.4+a.a)*a.r*(a.t==='f'?1:.7+.3*Math.sin(now+a.a)),z=a.cz+Math.sin(now*.4+a.a)*a.r*(a.t==='f'?1:.7+.3*Math.cos(now+a.a));a.o.position.x=x;a.o.position.z=z;if(a.t!=='f')a.o.rotation.y=-now*.4-a.a;a.o.position.y=a.t==='f'?.2:0});
    if(rain&&rain.visible){const a=rain.geometry.attributes.position;for(let i=0;i<a.count;i+=2){let y=a.getY(i)-dt*24;if(y<0)y+=25;a.setY(i,y);a.setY(i+1,y-.8)}a.needsUpdate=true}
    const d=cs.dist,cp=Math.cos(cs.pitch);cam.position.set(Math.sin(cs.yaw)*cp*d,Math.sin(cs.pitch)*d,Math.cos(cs.yaw)*cp*d);cam.lookAt(0,0,0);R.render(sc,cam)}
  // ---------- ouverture
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);AG();
    ov=document.createElement('div');ov.id='agrov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#16301a;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#2e6a2a,#7a9a2a);flex:0 0 auto"><b style="flex:1;font-size:13px">🌾 BOYEKOLI FARM</b>${btn('⏸','agPause()','#3a5a3a','padding:5px 9px;margin:0')}${btn('⏩','agVit()','#3a5a3a','padding:5px 9px;margin:0')}${btn('✖','agQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div>
    <div id="agstat" style="padding:3px 8px;font-size:12px;background:#0e200f;flex:0 0 auto"></div><div id="ag3d" style="flex:1;position:relative;min-height:0"><div id="agmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(8,20,10,.92);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div></div>
    <div id="agtabs" style="display:flex;overflow-x:auto;background:#0e200f;flex:0 0 auto"></div><div id="agsheet" style="height:36vh;overflow:auto;padding:6px 8px;background:#1f3d22;flex:0 0 auto"></div><div id="agover" style="position:absolute;inset:0;background:rgba(8,18,10,.97);display:none;flex-direction:column;padding:10px 10px 84px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'agRetour()',coin:true,cible:'#ag3d'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('ag3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();cam=new THREE.PerspectiveCamera(50,1,.3,400);hemi=new THREE.HemisphereLight('#ffffff','#556644',1.5);sc.add(hemi);sun=new THREE.DirectionalLight('#fff4dd',1.3);sun.position.set(15,30,10);sc.add(sun);
    const rs=()=>{const c=$('ag3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}};setTimeout(rs,60);window.addEventListener('resize',rs);ov._rs=rs;
    entrees();tab='ferme';outil='arroser';cs={yaw:.5,pitch:.9,dist:30};pause=false;vit=1;monde();maj();rendTabs();rend();
    try{history.pushState({ag:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);raf=requestAnimationFrame(boucle);
    PAR.dire('Bienvenue à la ferme Boyekoli. Choisis un outil, puis touche une parcelle !','bea')}
  function fermer(){if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',ov._rs);try{R.forceContextLoss();R.dispose()}catch(e){}ov.remove();ov=null;R=sc=grp=null;ptr.clear();save()}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('agover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('agover');if(o){o.style.display='none';o.innerHTML=''}}
  function msg(t,ms){const m=$('agmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||2500)}
  function maj(){const e=$('agstat');if(!e)return;const g=AG(),st=Object.keys(g.stock).filter(k=>g.stock[k]>0).map(k=>(CULT[k]?CULT[k].ico:k==='oeuf'?'🥚':k==='lait'?'🥛':'🐟')+g.stock[k]).join(' ');
    e.innerHTML=`💰 <b>${Math.round(g.fc)}</b> pf · 📅 jour <b>${g.jour}</b> (${g.sais==='pluies'?'🌧 pluies':'☀️ sèche'}) ${g.pluie?'· ☔ il pleut':''}<br>📦 ${st||'stock vide'}`}
  const TABS=[['ferme','🌾 Ferme'],['elev','🐔 Élevage'],['marche','🛒 Marché'],['miss','🎯 Missions'],['savoir','📖 Savoirs']];
  function rendTabs(){$('agtabs').innerHTML=TABS.map(t=>`<button onclick="agTab('${t[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#cfe3cf'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  function rend(){
    const sh=$('agsheet');if(!sh)return;const g=AG();let h='';
    if(tab==='ferme'){
      h='<div style="font-size:12px;opacity:.75">Outil (puis touche une parcelle)</div>'+[['semer','🌱 Semer'],['arroser','💧 Arroser'],['desherber','🌿 Désherber'],['soigner','🐛 Soigner (5 pf)'],['engrais','♻️ Compost (4 pf)'],['recolter','🧺 Récolter']].map(o=>btn(o[1],`agOutil('${o[0]}')`,outil===o[0]?'#ffd54f':'')).join('');
      if(outil==='semer')h+='<div style="font-size:12px;opacity:.75;margin-top:4px">Graines (coût)</div>'+Object.keys(CULT).map(k=>btn(CULT[k].ico+' '+CULT[k].nom+' · '+CULT[k].sem+' pf · '+CULT[k].jours+' j',`agGraine('${k}')`,graine===k?'#ffd54f':'')).join('')+`<p style="font-size:12px;opacity:.85">${esc(CULT[graine].txt)}</p>`;
      h+='<div>'+btn('💧 Arroser toute la ferme (½ pf par parcelle)','agToutArroser()','#2c7fb8')+'</div><p style="font-size:11px;opacity:.8">Parcelle sombre = humide. Herbes vertes = désherber. Points rouges = parasites. Une bulle dorée = prêt à récolter.</p>'}
    else if(tab==='elev'){
      const a=g.ani,c=(k,p,max)=>`${btn('Acheter · '+p+' pf',`agAcheter('${k}',${p},${max})`)}`;
      h=`<b>🐔 Élevage</b><p style="font-size:12px;margin:2px 0">Les animaux sont nourris <b>automatiquement une fois par jour</b> avec ta réserve d’aliments. Il faut 1 ration pour 3 animaux par jour.</p><div style="background:#0e200f;border-radius:10px;padding:6px;margin:4px 0;font-size:13px">🌾 Réserve : <b>${g.ration||0}</b> ration(s) · besoin par jour : <b>${Math.ceil((a.poule+a.chevre+a.poisson)/3)}</b> · ${btn('Acheter 10 rations · 15 pf','agAliments()','#2e7d32','padding:5px 9px')}</div>`+
        `<div style="background:#0e200f;border-radius:10px;padding:6px;margin:4px 0;font-size:13px">🐔 Poules : <b>${a.poule}</b>/8 · 1 œuf par jour chacune ${c('poule',30,8)}</div><div style="background:#0e200f;border-radius:10px;padding:6px;margin:4px 0;font-size:13px">🐐 Chèvres : <b>${a.chevre}</b>/4 · du lait tous les 2 jours ${c('chevre',80,4)}</div><div style="background:#0e200f;border-radius:10px;padding:6px;margin:4px 0;font-size:13px">🐟 Tilapias : <b>${a.poisson}</b>/10 · pêche chaque semaine ${c('poisson',15,10)}</div>`+(g.stock.poisson?btn('🎣 Pêcher ('+g.stock.poisson+' poissons prêts)','agPecher()','#2c7fb8'):'')}
    else if(tab==='marche'){
      const ks=Object.keys(g.stock).filter(k=>g.stock[k]>0);
      h='<b>🛒 Marché du jour</b><p style="font-size:12px;margin:2px 0">Les prix changent chaque jour : vends quand c’est cher !</p>'+(ks.length?ks.map(k=>`<div style="background:#0e200f;border-radius:10px;padding:6px;margin:4px 0;font-size:13px">${CULT[k]?CULT[k].ico+' '+CULT[k].nom:k==='oeuf'?'🥚 Œufs':k==='lait'?'🥛 Lait':'🐟 Poisson'} × ${g.stock[k]} · prix <b>${prixJour(k)} pf</b> ${btn('Vendre tout','agVendre(\''+k+'\')','#2e7d32')}</div>`).join(''):'<p style="font-size:13px">Ton stock est vide. Récolte d’abord !</p>')}
    else if(tab==='miss'){
      const s=statsM();h='<b>🎯 Missions de la ferme</b>'+MISSIONS.map(m=>{const ok=g.done[m.id],pret=m.ok(s);return `<div style="background:#0e200f;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${ok?'✅':pret?'🟢':'▫️'} ${esc(m.nom)}</b> ${ok?'⭐'.repeat(g.stars[m.id]||1):''}<br><span style="opacity:.85">${esc(m.txt)}</span>${ok?'':'<br>'+btn('✅ Valider','agValider(\''+m.id+'\')',pret?'#2e7d32':'#555')}</div>`}).join('')+`<p style="font-size:12px">${Object.keys(g.done).length}/10 (5 suffisent pour valider l’atelier agricole).</p>`+(g.cert?btn('🎓 Mon certificat','agCert()','#6a1b9a'):'')}
    else h=SAVOIRS.map(n=>`<div style="background:#0e200f;border-radius:10px;padding:7px;margin:4px 0;font-size:13px"><b>${esc(n[0])}</b><br>${esc(n[1])}</div>`).join('');
    sh.innerHTML=h}
  function verifMissions(){/* validation manuelle par bouton */}
  function valider(id){
    const m=MISSIONS.find(x=>x.id===id),g=AG(),s=statsM();if(!m.ok(s)){msg('Objectif pas encore atteint : regarde 🎯 et continue !',3000);SFX.ko&&SFX.ko();return}
    const prem=!g.done[id];g.done[id]=true;g.stars[id]=Math.max(g.stars[id]||0,g.st.perdu<=2?3:2);let ex='';const a=A();
    if(prem){a.pieces+=m.pieces;a.xp+=m.pieces;refreshHud();const t=a.tal||(a.tal={});t.agri=(t.agri||0)+8;g.fc+=100}
    const n=Object.keys(g.done).length;
    if(n>=5&&!a.done['met:g1']){a.done['met:g1']=true;a.stars['met:g1']=2;g.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();ex='<p>🏅 <b>Jeune agriculteur !</b> Atelier validé (+15 🪙)</p><button onclick="agCert()" style="padding:9px 12px;border-radius:10px;background:#6a1b9a;color:#fff;border:0">🎓 Mon certificat</button>'}
    if(n>=10)a.stars['met:g1']=3;
    save();SFX.win&&SFX.win();D.mis&&D.mis.evt('agr','mission',id);PAR.dire('Mission réussie ! Bravo, jeune agriculteur.','bea');maj();rend();
    over(`<div style="text-align:center"><div style="font-size:44px">🌾🎉</div><h3>Mission réussie !</h3><p>${esc(m.nom)}${prem?' · +'+m.pieces+' 🪙 · +100 pf pour la ferme':''}</p>${ex}</div>`)}
  function cert(){const g=AG();if(!g.cert){over('<h3>🎓 Certificat</h3><p>Réussis 5 missions de la ferme.</p>');return}
    over(`<div style="background:linear-gradient(#f4fbe8,#d6eab8);color:#2a4a12;border:6px double #6a9a2a;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI FARM</div><div style="font-size:44px">🌾</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE AGRICULTEUR</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune agriculteur')}</div><p style="font-size:13px">pour avoir cultivé, élevé et vendu dans une ferme éducative.</p><p style="font-size:12px">Fait le ${esc(g.cert.date)}</p></div>`)}
  const actions={
    agOuvrir:()=>ouvrir(),agQuitter:()=>quitter(),agTab:t=>{tab=t;rendTabs();rend()},agOutil:o=>{outil=o;rend()},agGraine:k=>{graine=k;rend()},
    agRetour:()=>{const o=$('agover');if(o&&o.style.display==='flex')fermerOver();else quitter()},
    agPause:()=>{pause=!pause;msg(pause?'⏸ Temps arrêté':'▶ Le temps passe',1200)},agVit:()=>{vit=vit===1?3:1;msg('⏩ Vitesse ×'+vit,1200)},
    agToutArroser:()=>{const g=AG();let n=0;g.parc.forEach((p,i)=>{if(p.c&&p.eau<3){p.eau=3;n++;parcelle(i)}});const c=Math.ceil(n/2);if(!n){msg('Tout est déjà arrosé.');return}if(g.fc<c){msg('💰 Il faut '+c+' pf.');SFX.ko&&SFX.ko();return}g.fc-=c;maj();sauve();msg('💧 '+n+' parcelles arrosées ('+c+' pf)')},
    agAcheter:(k,p,max)=>{const g=AG();if(g.ani[k]>=max){msg('Maximum atteint.');return}if(g.fc<p){msg('💰 Pas assez de pf.');SFX.ko&&SFX.ko();return}g.fc-=p;g.ani[k]++;animaux();maj();rend();sauve();SFX.coin&&SFX.coin()},
    agAliments:()=>{const g=AG();if(g.fc<15){msg('💰 Il faut 15 pf.');SFX.ko&&SFX.ko();return}g.fc-=15;g.ration=(g.ration||0)+10;g.alerteAli=false;maj();rend();sauve();SFX.coin&&SFX.coin()},agNourrirOld:()=>{const g=AG();if(g.nourri)return;const n=g.ani.poule+g.ani.chevre+g.ani.poisson;if(!n){msg('Achète d’abord des animaux.');return}if(g.fc<2){msg('💰 Il faut 2 pf.');return}g.fc-=2;g.nourri=true;maj();rend();sauve();SFX.coin&&SFX.coin()},
    agPecher:()=>{const g=AG(),n=g.stock.poisson||0;if(!n)return;g.st.pech+=n;msg('🎣 '+n+' tilapias pêchés ! Va les vendre.');rend();sauve();maj();SFX.win&&SFX.win()},
    agVendre:k=>{const g=AG(),n=g.stock[k]||0;if(!n)return;const v=n*prixJour(k);g.fc+=v;g.st.vendu+=n;g.st.gain+=v;g.stock[k]=0;maj();rend();sauve();SFX.coin&&SFX.coin();msg('💰 Vendu pour '+v+' pf')},
    agValider:id=>valider(id),agCert:()=>cert(),agFermerOver:()=>fermerOver(),
    agTest:{jours:n=>{for(let i=0;i<n;i++)jour()},agir:(i,o,gr)=>{outil=o;if(gr)graine=gr;agir(i)},g:AG}};
  return {actions,ouvrir,fermer,AG,estOuvert:()=>!!ov};
}
