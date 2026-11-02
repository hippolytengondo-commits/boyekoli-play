// BOYEKOLI BUSINESS : jeu d'entrepreneuriat. Plan d'affaires, rachat du supermarché du village, construction de nouveaux commerces
// (boutique, boulangerie, maquis, atelier de couture, cybercafé, supermarché) dans le village, gestion (prix, stock, employés, publicité),
// crédit, comptabilité simple, 10 missions. Les gains sont encaissés en pièces (12 h maximum cumulées).
import * as THREE from 'three';

export const TYPES={
 super:{nom:'Supermarché',ico:'🛒',achat:700,base:25,reappro:30,col:'#1f7a4d',txt:'Grande surface : beaucoup de clients, beaucoup de stock à renouveler.'},
 boutique:{nom:'Boutique',ico:'🏪',achat:150,base:6,reappro:10,col:'#e0a526',txt:'Petit commerce de quartier : peu cher à ouvrir, gains modestes.'},
 boulangerie:{nom:'Boulangerie',ico:'🥖',achat:250,base:10,reappro:15,col:'#c9733d',txt:'Pain et gâteaux frais chaque matin.'},
 maquis:{nom:'Maquis (restaurant)',ico:'🍲',achat:350,base:13,reappro:18,col:'#2e7d4a',txt:'On y mange du poisson, du poulet et du fufu.'},
 couture:{nom:'Atelier de couture',ico:'🧵',achat:300,base:11,reappro:15,col:'#e84393',txt:'Pagnes, uniformes et robes sur mesure.'},
 cyber:{nom:'Cybercafé',ico:'💻',achat:400,base:15,reappro:20,col:'#2c7fb8',txt:'Internet, impression et formation à l’informatique.'}};
export const VILLES={kinshasa:['Kinshasa',1.3,1.25],lubumbashi:['Lubumbashi',1.2,1.15],goma:['Goma',1.1,1.05],kisangani:['Kisangani',1,1],matadi:['Matadi',1.05,1.0],mbujimayi:['Mbuji-Mayi',.95,.9],kikwit:['Kikwit',.9,.85]};  // [nom, multiplicateur de gains, multiplicateur de coût]
export const LOTS=[0,1,2,3,4,5].map(i=>({x:-47,z:-86-12*i}));
const MAXH=12,PRIX={bas:[1.3,.7],normal:[1,1],haut:[.7,1.3]};
const NIV=[1,1.7,2.5];
const MISSIONS=[
 {id:'b1',nom:'Mon plan d’affaires',txt:'Fais ton plan d’affaires et ouvre ton premier commerce.',ok:s=>s.nb>=1,pieces:6},
 {id:'b2',nom:'Premier bénéfice',txt:'Encaisse au moins 50 pièces de bénéfices.',ok:s=>s.gain>=50,pieces:6},
 {id:'b3',nom:'Gérer le stock',txt:'Réapprovisionne tes commerces 3 fois.',ok:s=>s.reappro>=3,pieces:6},
 {id:'b4',nom:'La publicité',txt:'Lance une campagne de publicité.',ok:s=>s.pub>=1,pieces:6},
 {id:'b5',nom:'Les employés',txt:'Embauche 2 employés.',ok:s=>s.emp>=2,pieces:6},
 {id:'b6',nom:'Racheter le supermarché',txt:'Rachète le supermarché du village.',ok:s=>s.super,pieces:12},
 {id:'b7',nom:'Le crédit',txt:'Emprunte à la banque puis rembourse ta dette.',ok:s=>s.credit>=1&&s.dette===0,pieces:8},
 {id:'b8',nom:'Améliorer un commerce',txt:'Fais passer un commerce au niveau 2.',ok:s=>s.maxniv>=2,pieces:8},
 {id:'b9',nom:'Deux commerces',txt:'Possède 2 commerces et encaisse 200 pièces au total.',ok:s=>s.nb>=2&&s.gain>=200,pieces:10},
 {id:'b10',nom:'La chaîne de supermarchés',txt:'Possède 3 supermarchés (celui du village + 2 nouveaux).',ok:s=>s.nbSuper>=3,pieces:20}];
const SAVOIRS=[
 ['💼 Le capital','C’est l’argent qu’on met au départ pour acheter, construire et acheter les premières marchandises.'],
 ['🧮 Coût, recette, bénéfice','Bénéfice = recettes (ce qu’on gagne) − charges (ce qu’on dépense : stock, salaires, publicité).'],
 ['📦 Le stock','Sans marchandise, pas de vente : une rupture de stock fait perdre des clients. Trop de stock coûte aussi de l’argent.'],
 ['🏷 Le prix','Un prix trop bas attire beaucoup de clients mais rapporte peu par vente ; trop haut, les clients partent. Le juste prix est un équilibre.'],
 ['👥 Les employés','Un employé aide à servir plus de clients mais il faut le payer. Dans un petit commerce, le salaire peut dépasser le gain.'],
 ['📣 La publicité','Elle attire des clients pendant quelques heures. Elle est rentable surtout dans un grand commerce.'],
 ['🏦 Le crédit','On emprunte pour démarrer plus vite, mais on rembourse plus que ce qu’on a reçu : c’est le prix de l’emprunt (l’intérêt).'],
 ['📍 L’emplacement','Une grande ville a plus de clients mais le terrain et les loyers y coûtent plus cher.']];
export function creerBusiness(D){
  const {PAR,G,esc,SFX,save,refreshHud,openBox,closeDialog,toast,rebuild}=D;
  const A=()=>G.adv;
  const B=()=>{const a=A();if(!a.biz)a.biz={cs:[],dette:0,credit:0,tot:{gain:0,reappro:0,pub:0,emp:0},done:{},stars:{},cert:null,plan:null,n:0};const b=a.biz;['done','stars'].forEach(k=>{if(!b[k])b[k]={}});if(!b.tot)b.tot={gain:0,reappro:0,pub:0,emp:0};return b};
  let ov=null,R=null,sc=null,cam=null,raf=0,pop=null,tab='com',sel=null,plan=null,mod3=null,sautSave=0,yaw=.6;
  const $=id=>ov&&ov.querySelector('#'+id);
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:7px 10px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#4a4a2a'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  const sauve=()=>{clearTimeout(sautSave);sautSave=setTimeout(()=>save(),400)};
  const find=id=>B().cs.find(c=>c.id===id);
  const nomVille=k=>(VILLES[k]||VILLES.kisangani)[0];
  // ---------- calcul des gains (par pas d'une demi-heure, au plus 12 h)
  function calc(c,now){
    const T=TYPES[c.type],v=VILLES[c.ville]||VILLES.kisangani,pr=PRIX[c.prix||'normal'];let h=Math.min(MAXH,Math.max(0,((now||Date.now())-c.t0)/3.6e6)),stock=c.stock,gain=0,rupt=0;const pasn=Math.floor(h*2);
    for(let i=0;i<pasn;i++){
      const t=c.t0+i*18e5,sf=Math.min(1,stock/35);if(sf<.2)rupt++;
      const pub=c.pubJ&&t<c.pubJ?1.3:1,rev=T.base*NIV[c.niv-1]*v[1]*pr[0]*pr[1]*(1+.15*c.emp)*pub*sf;
      gain+=(rev-2*c.emp)/2;stock=Math.max(0,stock-4)}
    return {gain:Math.round(gain),h,stock:Math.round(stock),rupt}}
  const stats=()=>{const b=B(),cs=b.cs;return {nb:cs.length,gain:b.tot.gain,reappro:b.tot.reappro,pub:b.tot.pub,emp:b.tot.emp,super:cs.some(c=>c.type==='super'),nbSuper:cs.filter(c=>c.type==='super').length,credit:b.credit,dette:b.dette,maxniv:Math.max(0,...cs.map(c=>c.niv))}};
  // encaisse automatiquement les gains accumulés (avant tout changement de réglage) ; 40 % servent à rembourser une dette
  function regler(c){const b=B(),r=calc(c);let net=r.gain,rem=0;if(net>0&&b.dette>0){rem=Math.min(b.dette,Math.ceil(net*.4));b.dette-=rem;net-=rem}if(r.gain>0){A().pieces+=net;b.tot.gain+=r.gain;D.mis&&D.mis.evt('biz','gain',r.gain)}c.stock=r.stock;c.t0=Date.now();refreshHud();return {net,rem,gain:r.gain}}
  // ---------- bâtiments du village
  function reperes(){return B().cs.filter(c=>c.lot!==null&&c.lot!==undefined).map(c=>({id:'biz_'+c.id,modele:'magasin',x:LOTS[c.lot].x,z:LOTS[c.lot].z,ry:Math.PI/2,w:10,d:7,nom:c.nom,coul:TYPES[c.type].col,norot:true,biz:true,bizId:c.id,type:c.type,ico:TYPES[c.type].ico}))}
  // ---------- aperçu 3D du commerce sélectionné
  function aperçu(c){
    if(!sc)return;if(mod3)sc.remove(mod3);const g=new THREE.Group(),T=TYPES[(c&&c.type)||'super'],M=(col,r)=>new THREE.MeshStandardMaterial({color:col,roughness:r||.8});
    const box=(w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
    box(8,.2,6,M('#6aa04a'),0,-.1,0);box(5,2.4,3.4,M('#f0ead8'),0,1.2,0);box(5.4,.3,3.8,M(T.col),0,2.55,0);box(1.1,1.7,.1,M('#4a2f1b'),0,.85,1.72);box(1.9,1,.08,M('#9fd3f5',.2),-1.5,1.2,1.72);box(1.9,1,.08,M('#9fd3f5',.2),1.5,1.2,1.72);
    const cv=document.createElement('canvas');cv.width=512;cv.height=96;const x=cv.getContext('2d');x.fillStyle=T.col;x.fillRect(0,0,512,96);x.fillStyle='#fff';x.font='bold 42px sans-serif';x.textAlign='center';x.fillText(T.ico+' '+((c&&c.nom)||T.nom).slice(0,18),256,64);
    const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.4,.8),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));sg.position.set(0,3.35,1.2);g.add(sg);
    [-3,3].forEach(a=>{box(.2,1,.2,M('#6b4423'),a,.5,2.4);const s=new THREE.Mesh(new THREE.SphereGeometry(.7,8,6),M('#2f7a36'));s.position.set(a,1.5,2.4);g.add(s)});
    box(3.2,.05,1.6,M('#4b4d52'),0,.03,2.8);mod3=g;sc.add(g)}
  function boucle(){raf=requestAnimationFrame(boucle);if(!R)return;yaw+=.006;const d=13;cam.position.set(Math.sin(yaw)*d,5.5,Math.cos(yaw)*d);cam.lookAt(0,1.4,0);R.render(sc,cam)}
  // ---------- ouverture
  function ouvrir(onglet,id){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});
    fermer(true);B();
    ov=document.createElement('div');ov.id='bizov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#2a2410;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#7a5a10,#c9902a);flex:0 0 auto"><b style="flex:1;font-size:13px">💼 BOYEKOLI BUSINESS</b>${btn('✖','bizQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div>
    <div id="bizstat" style="padding:3px 8px;font-size:12px;background:#1a1608;flex:0 0 auto"></div><div id="biz3d" style="flex:0 0 28%;position:relative;min-height:0"><div id="bizmsg" style="position:absolute;left:8px;right:8px;top:6px;background:rgba(20,16,4,.92);padding:6px 9px;border-radius:10px;font-size:13px;display:none;z-index:3"></div></div>
    <div id="biztabs" style="display:flex;overflow-x:auto;background:#1a1608;flex:0 0 auto"></div><div id="bizsheet" style="flex:1;overflow:auto;padding:7px 9px;background:#3a3216"></div><div id="bizover" style="position:absolute;inset:0;background:rgba(20,16,4,.97);display:none;flex-direction:column;padding:10px 10px 84px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'bizRetour()',coin:true,cible:'#biz3d'});
    let low=false;try{low=localStorage.getItem('kelas_quality')==='low'}catch(e){}
    R=new THREE.WebGLRenderer({antialias:!low});R.setPixelRatio(Math.min(devicePixelRatio||1,low?1:1.5));$('biz3d').appendChild(R.domElement);R.domElement.style.cssText='position:absolute;inset:0;width:100%;height:100%';
    sc=new THREE.Scene();sc.background=new THREE.Color('#a9d6f5');cam=new THREE.PerspectiveCamera(45,1,.3,100);sc.add(new THREE.HemisphereLight('#ffffff','#556644',1.5));const dl=new THREE.DirectionalLight('#fff4dd',1.3);dl.position.set(5,10,6);sc.add(dl);
    const rs=()=>{const c=$('biz3d');if(!c||!R)return;const w=c.clientWidth,h=c.clientHeight;if(w&&h){R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}};setTimeout(rs,60);window.addEventListener('resize',rs);ov._rs=rs;
    const b=B();sel=id&&find(id)?id:(b.cs[0]&&b.cs[0].id)||null;tab=onglet||(b.cs.length?'com':'creer');aperçu(sel&&find(sel));maj();rendTabs();rend();
    try{history.pushState({biz:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);raf=requestAnimationFrame(boucle);
    PAR.dire(b.cs.length?'Bienvenue dans ton bureau, chef d’entreprise !':'Bienvenue ! Je suis Maman Béa. Pour réussir en affaires, il faut un bon plan. Commence par ouvrir ton premier commerce.','bea')}
  function fermer(){if(!ov)return;cancelAnimationFrame(raf);window.removeEventListener('resize',ov._rs);try{R.dispose()}catch(e){}ov.remove();ov=null;R=sc=mod3=null;save()}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('bizover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('bizover');if(o){o.style.display='none';o.innerHTML=''}}
  function msg(t,ms){const m=$('bizmsg');if(!m)return;m.textContent=t;m.style.display='block';clearTimeout(msg.t);msg.t=setTimeout(()=>{if(m)m.style.display='none'},ms||3000)}
  function maj(){const e=$('bizstat');if(!e)return;const b=B();e.innerHTML=`💰 <b>${A().pieces}</b> pièces · 🏪 ${b.cs.length} commerce(s)${b.dette?' · 🏦 dette <b>'+b.dette+'</b>':''}`}
  const TABS=[['com','🏪 Mes commerces'],['creer','➕ Ouvrir / racheter'],['fin','🏦 Finances'],['miss','🎯 Missions'],['savoir','📖 Savoirs']];
  function rendTabs(){$('biztabs').innerHTML=TABS.map(t=>`<button onclick="bizTab('${t[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===t[0]?'#ffd54f':'transparent'};background:none;color:${tab===t[0]?'#ffd54f':'#e6dcb8'};font-size:13px;font-weight:600">${t[1]}</button>`).join('')}
  const bar=(v,col)=>`<div style="height:8px;background:#1a1608;border-radius:5px"><div style="height:8px;width:${Math.round(Math.max(0,Math.min(1,v))*100)}%;background:${col};border-radius:5px"></div></div>`;
  function rend(){
    const sh=$('bizsheet');if(!sh)return;const b=B();let h='';
    if(tab==='com'){
      if(!b.cs.length)h='<p style="font-size:14px">Tu n’as pas encore de commerce. Va dans ➕ pour faire ton plan d’affaires.</p>'+btn('➕ Ouvrir mon premier commerce','bizTab(\'creer\')','#2e7d32');
      else{h=b.cs.map(c=>{const T=TYPES[c.type],r=calc(c);return `<div style="background:#1a1608;border-radius:12px;padding:8px;margin:5px 0;border:2px solid ${sel===c.id?'#ffd54f':'transparent'}" onclick="bizSel('${c.id}')"><b style="font-size:14px">${T.ico} ${esc(c.nom)}</b> <span style="font-size:12px;opacity:.8">· ${esc(nomVille(c.ville))} · niveau ${c.niv}</span><br><span style="font-size:12px">📦 Stock ${r.stock}%${r.stock<35?' ⚠️':''}</span>${bar(r.stock/100,r.stock<35?'#d6302b':'#7CFC00')}<span style="font-size:13px">💰 Caisse à encaisser : <b>${r.gain}</b> pièces (${r.h.toFixed(1)} h${r.h>=MAXH?', plein':''})</span></div>`}).join('');
        const c=find(sel);if(c){const T=TYPES[c.type],r=calc(c),pi=c.pubJ&&Date.now()<c.pubJ;
          h+=`<div style="background:#4a3e18;border-radius:12px;padding:8px;margin-top:6px"><b>⚙ Gérer : ${esc(c.nom)}</b><br>`+btn('💰 Encaisser '+r.gain,'bizEncaisser(\''+c.id+'\')',r.gain>0?'#2e7d32':'#555')+btn('📦 Réapprovisionner · '+T.reappro,'bizReappro(\''+c.id+'\')')+btn(pi?'📣 Publicité en cours':'📣 Publicité · 20','bizPub(\''+c.id+'\')',pi?'#555':'')+
          '<div style="font-size:12px;margin-top:4px">Prix de vente</div>'+['bas','normal','haut'].map(k=>btn({bas:'💸 Bas',normal:'⚖️ Normal',haut:'💎 Élevé'}[k],`bizPrix('${c.id}','${k}')`,c.prix===k?'#ffd54f':'')).join('')+
          `<div style="font-size:12px;margin-top:4px">Employés : <b>${c.emp}</b> (salaire 2 pièces/heure chacun) ${btn('−',`bizEmp('${c.id}',-1)`,'','padding:2px 9px')}${btn('+',`bizEmp('${c.id}',1)`,'','padding:2px 9px')}</div>`+
          (c.niv<3?btn('⬆ Améliorer niveau '+(c.niv+1)+' · '+Math.round(T.achat*(c.niv===1?.5:1)),`bizNiveau('${c.id}')`,'#6a1b9a'):'<div style="font-size:12px">Niveau maximum atteint.</div>')+
          (c.lot!==null&&c.lot!==undefined?'<div style="font-size:12px;opacity:.85;margin-top:4px">📍 Ton bâtiment est dans le village : quartier des métiers.</div>':'<div style="font-size:12px;opacity:.85;margin-top:4px">📍 Le supermarché du village est à toi !</div>')+'</div>'}}}
    else if(tab==='creer'){h=creerHtml()}
    else if(tab==='fin'){
      const t=b.tot,s=stats();h=`<b>📒 Comptabilité simple</b><p style="font-size:13px;margin:3px 0">Bénéfices encaissés : <b>${t.gain}</b> pièces<br>Réapprovisionnements : ${t.reappro} · Publicités : ${t.pub} · Embauches : ${t.emp}<br>Valeur de tes commerces : ${b.cs.reduce((x,c)=>x+Math.round(TYPES[c.type].achat*(c.niv===1?1:c.niv===2?1.5:2)),0)} pièces</p>`+
        `<b>🏦 Banque</b><p style="font-size:13px;margin:3px 0">${b.dette?'Tu dois <b>'+b.dette+'</b> pièces (intérêt de 10 %). 40 % de chaque encaissement servent à rembourser.':'Tu n’as aucune dette. Tu peux emprunter pour grandir plus vite.'}</p>`+(b.dette?btn('Rembourser maintenant','bizRembourser()','#2e7d32'):[100,200,300].map(m=>btn('Emprunter '+m+' (rend '+Math.round(m*1.1)+')',`bizEmprunter(${m})`)).join(''))}
    else if(tab==='miss'){
      const s=stats();h='<b style="font-size:14px">🎯 Missions de l’entrepreneur</b>'+MISSIONS.map(m=>{const ok=b.done[m.id],pret=m.ok(s);return `<div style="background:#1a1608;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${ok?'✅':pret?'🟢':'▫️'} ${esc(m.nom)}</b> ${ok?'⭐'.repeat(b.stars[m.id]||1):''}<br><span style="opacity:.85">${esc(m.txt)}</span>${ok?'':'<br>'+btn('✅ Valider','bizValider(\''+m.id+'\')',pret?'#2e7d32':'#555')}</div>`}).join('')+`<p style="font-size:12px">${Object.keys(b.done).length}/10 (5 suffisent pour valider l’atelier).</p>`+(b.cert?btn('🎓 Mon certificat','bizCert()','#6a1b9a'):'')}
    else h=SAVOIRS.map(n=>`<div style="background:#1a1608;border-radius:10px;padding:7px;margin:4px 0;font-size:13px"><b>${esc(n[0])}</b><br>${esc(n[1])}</div>`).join('');
    sh.innerHTML=h}
  // ---------- plan d'affaires : type + ville + financement
  function creerHtml(){
    const b=B(),p=plan||(plan={type:'boutique',ville:'kisangani',fin:'cash'}),T=TYPES[p.type],V=VILLES[p.ville];
    let h='';
    if(!b.cs.some(c=>c.type==='super'&&c.f)){h+=`<div style="background:#4a3e18;border-radius:12px;padding:8px;margin-bottom:6px"><b>🛒 Racheter le supermarché du village</b><p style="font-size:12px;margin:3px 0">Le propriétaire vend son supermarché (celui où tu fais tes courses). Prix : <b>600</b> pièces. Gains jusqu’à 25 pièces par heure.</p>${btn('Racheter · 600 🪙','bizRacheter()',A().pieces>=600?'#2e7d32':'#555')}${b.dette?'':btn('🏦 Emprunter pour acheter','bizTab(\'fin\')')}</div>`}
    h+='<b>📋 Plan d’affaires : ouvrir un nouveau commerce</b><div style="font-size:12px;opacity:.8;margin-top:3px">1. Quel commerce ?</div>'+Object.keys(TYPES).map(k=>btn(TYPES[k].ico+' '+TYPES[k].nom,`bizPlan('type','${k}')`,p.type===k?'#ffd54f':'')).join('')+`<p style="font-size:12px;margin:3px 0">${esc(T.txt)}</p><div style="font-size:12px;opacity:.8">2. Dans quelle ville ? (plus de clients mais terrain plus cher)</div>`+Object.keys(VILLES).map(k=>btn(VILLES[k][0],`bizPlan('ville','${k}')`,p.ville===k?'#ffd54f':'')).join('');
    const prix=Math.round(T.achat*V[2]),gainH=Math.round(T.base*V[1]*10)/10,ret=Math.ceil(prix/Math.max(1,gainH));
    h+=`<div style="background:#1a1608;border-radius:10px;padding:8px;margin:6px 0;font-size:13px"><b>3. Ton plan</b><br>Coût de construction : <b>${prix}</b> pièces · Gain estimé : ~<b>${gainH}</b>/h<br>Retour sur investissement : environ <b>${ret} h</b> de fonctionnement.${A().pieces<prix?'<br><span style="color:#ffb74d">Il te manque '+(prix-A().pieces)+' pièces : économise ou emprunte à la banque.</span>':''}</div>`;
    h+=(b.cs.filter(c=>c.lot!==null&&c.lot!==undefined).length>=LOTS.length?'<p style="font-size:13px">Tous les terrains du quartier sont occupés.</p>':btn('🏗 Construire · '+prix+' 🪙','bizConstruire()',A().pieces>=prix?'#2e7d32':'#555'));
    return h}
  const nomUnique=(t,v)=>TYPES[t].nom+' '+VILLES[v][0].split('-')[0];
  function construire(){
    const b=B(),p=plan,T=TYPES[p.type],V=VILLES[p.ville],prix=Math.round(T.achat*V[2]),lots=b.cs.map(c=>c.lot).filter(x=>x!==null&&x!==undefined),lot=[0,1,2,3,4,5].find(i=>!lots.includes(i));
    if(lot===undefined){msg('Plus de terrain libre dans le quartier.');return}
    if(A().pieces<prix){msg('💰 Il te manque '+(prix-A().pieces)+' pièces.');SFX.ko&&SFX.ko();return}
    A().pieces-=prix;b.n++;const c={id:'s'+b.n,type:p.type,nom:nomUnique(p.type,p.ville),ville:p.ville,niv:1,stock:60,prix:'normal',emp:0,pubJ:0,t0:Date.now(),lot,f:false};b.cs.push(c);sel=c.id;refreshHud();save();SFX.win&&SFX.win();
    PAR.dire('Félicitations ! Ton '+T.nom+' ouvre ses portes dans le village. Gère-le bien !','bea');if(rebuild)rebuild();
    D.mis&&D.mis.evt('biz','ouvert',p.type);tab='com';aperçu(c);maj();rendTabs();rend()}
  function racheter(){
    const b=B();if(b.cs.some(c=>c.type==='super'&&c.f))return;if(A().pieces<600){msg('💰 Il te manque '+(600-A().pieces)+' pièces. Gagne-en ou emprunte.');SFX.ko&&SFX.ko();return}
    A().pieces-=600;b.n++;const c={id:'s'+b.n,type:'super',nom:'Supermarché du village',ville:'kinshasa',niv:1,stock:70,prix:'normal',emp:0,pubJ:0,t0:Date.now(),lot:null,f:true};b.cs.push(c);sel=c.id;refreshHud();save();SFX.win&&SFX.win();
    PAR.dire('Le supermarché du village est maintenant à toi ! Tu es propriétaire.','bea');D.mis&&D.mis.evt('biz','rachat');tab='com';aperçu(c);maj();rendTabs();rend()}
  function valider(id){
    const m=MISSIONS.find(x=>x.id===id),b=B(),s=stats();if(!m.ok(s)){msg('Objectif pas encore atteint : relis la mission.',3000);SFX.ko&&SFX.ko();return}
    const prem=!b.done[id];b.done[id]=true;b.stars[id]=Math.max(b.stars[id]||0,3);let ex='';const a=A();
    if(prem){a.pieces+=m.pieces;a.xp+=m.pieces;refreshHud();const t=a.tal||(a.tal={});t.commerce=(t.commerce||0)+8}
    const n=Object.keys(b.done).length;
    if(n>=5&&!a.done['met:e1']){a.done['met:e1']=true;a.stars['met:e1']=2;b.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();ex='<p>🏅 <b>Jeune entrepreneur !</b> Atelier validé (+15 🪙)</p>'}
    if(n>=10)a.stars['met:e1']=3;save();SFX.win&&SFX.win();D.mis&&D.mis.evt('biz','mission',id);PAR.dire('Mission réussie ! Bravo, entrepreneur.','bea');maj();rend();
    over(`<div style="text-align:center"><div style="font-size:44px">💼🎉</div><h3>Mission réussie !</h3><p>${esc(m.nom)}${prem?' · +'+m.pieces+' 🪙':''}</p>${ex}</div>`)}
  function cert(){const b=B();if(!b.cert){over('<h3>🎓 Certificat</h3><p>Réussis 5 missions pour devenir jeune entrepreneur.</p>');return}
    over(`<div style="background:linear-gradient(#fff9e8,#efe0b0);color:#4a3508;border:6px double #c9902a;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI BUSINESS</div><div style="font-size:44px">💼</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE ENTREPRENEUR</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune entrepreneur')}</div><p style="font-size:13px">pour avoir créé et géré des commerces dans un jeu d’entrepreneuriat.</p><p style="font-size:12px">Fait le ${esc(b.cert.date)}</p></div>`)}
  const actions={
    bizOuvrir:(id)=>ouvrir(null,id),bizQuitter:()=>quitter(),bizTab:t=>{tab=t;rendTabs();rend()},bizFermerOver:()=>fermerOver(),bizCert:()=>cert(),
    bizRetour:()=>{const o=$('bizover');if(o&&o.style.display==='flex')fermerOver();else quitter()},
    bizSel:id=>{sel=id;aperçu(find(id));rend()},bizPlan:(k,v)=>{plan=plan||{type:'boutique',ville:'kisangani'};plan[k]=v;rend()},bizConstruire:()=>construire(),bizRacheter:()=>racheter(),bizValider:id=>valider(id),
    bizEncaisser:id=>{const c=find(id),r=calc(c);if(r.gain<=0){msg('Rien à encaisser pour le moment.');return}const g=regler(c);msg('💰 +'+g.net+' pièces'+(g.rem?' (dont '+g.rem+' remboursés à la banque)':''));SFX.coin&&SFX.coin();maj();rend()},
    bizReappro:id=>{const c=find(id),T=TYPES[c.type],b=B();if(A().pieces<T.reappro){msg('💰 Il faut '+T.reappro+' pièces.');SFX.ko&&SFX.ko();return}regler(c);A().pieces-=T.reappro;c.stock=100;b.tot.reappro++;refreshHud();save();SFX.coin&&SFX.coin();D.mis&&D.mis.evt('biz','reappro');maj();rend()},
    bizPub:id=>{const c=find(id),b=B();if(c.pubJ&&Date.now()<c.pubJ)return;if(A().pieces<20){msg('💰 Il faut 20 pièces.');return}regler(c);A().pieces-=20;c.pubJ=Date.now()+6*3.6e6;b.tot.pub++;refreshHud();save();SFX.coin&&SFX.coin();maj();rend()},
    bizPrix:(id,k)=>{const c=find(id);regler(c);c.prix=k;save();maj();rend()},
    bizEmp:(id,d)=>{const c=find(id),b=B();regler(c);if(d>0){if(c.emp>=4){msg('4 employés maximum.');return}c.emp++;b.tot.emp++}else if(c.emp>0)c.emp--;save();maj();rend()},
    bizNiveau:id=>{const c=find(id),T=TYPES[c.type],p=Math.round(T.achat*(c.niv===1?.5:1));if(A().pieces<p){msg('💰 Il faut '+p+' pièces.');SFX.ko&&SFX.ko();return}regler(c);A().pieces-=p;c.niv++;refreshHud();save();SFX.win&&SFX.win();maj();rend()},
    bizEmprunter:m=>{const b=B();if(b.dette)return;b.dette=Math.round(m*1.1);b.credit++;A().pieces+=m;refreshHud();save();SFX.coin&&SFX.coin();maj();rend()},
    bizRembourser:()=>{const b=B();if(!b.dette)return;const p=Math.min(b.dette,A().pieces);if(p<=0){msg('Tu n’as plus de pièces.');return}b.dette-=p;A().pieces-=p;refreshHud();save();SFX.coin&&SFX.coin();maj();rend()},
    bizTest:{avancer:(h)=>{B().cs.forEach(c=>{c.t0-=h*3.6e6;if(c.pubJ)c.pubJ-=h*3.6e6})},b:B,calc:id=>calc(find(id))}};
  return {actions,ouvrir,fermer,B,reperes,estOuvert:()=>!!ov,TYPES};
}
