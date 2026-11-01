// Aménagement du territoire de l'Est : le joueur construit, élargit et déplace des routes (1 à 4 voies par sens),
// et déplace des arbres et des bâtiments qui gênent. Coût : pièces + bitume ; démolir rembourse 60 %.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl} from './world.js';
import {routeVoies,largeurRoute} from './routes.js';

// tronçons de la route de l'aéroport (axe z = 0) : existants, modifiables
export const SLOTS=[
  {id:'ap1',nom:'Route de l’aéroport, tronçon ouest',sens:'h',pos:[0],a:52,b:80,def:2},
  {id:'ap2',nom:'Route de l’aéroport, tronçon central',sens:'h',pos:[0],a:80,b:100,def:2},
  {id:'ap3',nom:'Route de l’aéroport, approche du terminal',sens:'h',pos:[0],a:100,b:114,def:4},
  {id:'v1',nom:'Avenue du Fleuve',sens:'v',pos:[68,72,76],a:14,b:60},
  {id:'v2',nom:'Avenue des Arts',sens:'v',pos:[100,104,108],a:14,b:60},
  {id:'h1',nom:'Rocade de l’Est',sens:'h',pos:[26,38,50],a:64,b:112}
];
export const BUREAU={x:60,z:17};
// objets déplaçables
const TREES=[['t1',72,22],['t2',72,44],['t3',104,22],['t4',104,50],['t5',88,32],['t6',96,38],['t7',66,56],['t8',110,28]];
const SPOTS_ARBRES=[[64,61.5],[70,61.5],[76,61.5],[82,61.5],[88,61.5],[94,61.5],[100,61.5],[106,61.5],[112,61.5],[62.5,40],[113.5,40],[113.5,20]];
const BATS=[
  {id:'i1',nom:'Garage',x:88,z:12.5,hw:3,hd:2.5,coul:'#4a7bb5',cout:25},
  {id:'i2',nom:'Entrepôt',x:72,z:30,hw:3.2,hd:2.5,coul:'#b5763a',cout:25},
  {id:'i3',nom:'Atelier',x:104,z:40,hw:3,hd:2.5,coul:'#8e5a9b',cout:25},
  {id:'i4',nom:'Maisons',x:84,z:38,hw:3.2,hd:2.5,coul:'#d9a54a',cout:25}
];
const SPOTS_BAT=[[68,68],[84,68],[100,68],[114,68],[88,12.5],[72,30],[104,40],[84,38]];
const STUDIO={id:'studio',nom:'Studio de musique',x:64,z:-12.5,hw:9.2,hd:4.4,cout:60,spots:[[64,-12.5],[90,-12.5]]};
export const longueur=s=>s.b-s.a;
export const cout=(s,voies)=>({pieces:Math.round(longueur(s)*voies*.25),bitume:Math.ceil(longueur(s)*voies/20)});

export function creerReseau(D){
  const {G,esc,openBox,renderDialog,SFX,save,refreshHud,parler,toast}=D;
  const A=()=>G.adv;
  const R=()=>{const a=A();if(!a.reseau)a.reseau={};return a.reseau};
  const O=()=>{const a=A();if(!a.reseauObj)a.reseauObj={};return a.reseauObj};
  const stock=()=>{const a=A();if(!a.stock)a.stock={};return a.stock};
  const fmtC=c=>c.pieces+' 🪙 + '+c.bitume+' 🛣️';
  // ----- état des routes et des objets
  const cfgDe=s=>R()[s.id]||(s.def?{pos:0,voies:s.def}:null);
  const corridor=(s,pos,voies)=>{const w=largeurRoute(voies)/2+.7,p=s.pos[pos];return s.sens==='v'?{x0:p-w,x1:p+w,z0:s.a,z1:s.b}:(s.id.startsWith('ap')?{x0:s.a,x1:s.b,z0:-w,z1:w}:{x0:s.a,x1:s.b,z0:p-w,z1:p+w})};
  const touche=(r,o)=>o.x+o.hw>r.x0&&o.x-o.hw<r.x1&&o.z+o.hd>r.z0&&o.z-o.hd<r.z1;
  function objets(){
    const st=O(),L=[];
    TREES.forEach(([id,x,z],i)=>{const p=st[id]||{x,z};L.push({id,nom:'Arbre '+(i+1),type:'arbre',x:p.x,z:p.z,hw:1.4,hd:1.4,cout:4})});
    BATS.forEach(b=>{const p=st[b.id]||b;L.push(Object.assign({},b,{type:'bat',x:p.x,z:p.z}))});
    const sp=st.studio||STUDIO;L.push(Object.assign({},STUDIO,{type:'studio',x:sp.x,z:sp.z}));
    return L}
  const routesActives=()=>SLOTS.map(s=>({s,c:cfgDe(s)})).filter(x=>x.c);
  const conflitsRoute=(s,pos,voies)=>{const r=corridor(s,pos,voies);return objets().filter(o=>touche(r,o))};
  function spotLibre(o,x,z){
    const t={x,z,hw:o.hw,hd:o.hd};
    for(const q of objets()){if(q.id===o.id)continue;if(Math.abs(q.x-x)<q.hw+o.hw+.6&&Math.abs(q.z-z)<q.hd+o.hd+.6)return false}
    for(const {s,c} of routesActives())if(touche(corridor(s,c.pos,c.voies),t))return false;
    return true}
  const spotsDe=o=>o.type==='arbre'?SPOTS_ARBRES:o.type==='studio'?STUDIO.spots:SPOTS_BAT;
  // ---------- 3D
  function construire(parent,cols,bxs,studioFn){
    const spots=[];
    SLOTS.forEach(s=>{
      const c=cfgDe(s);
      if(c){const p=s.pos[c.pos];if(s.id.startsWith('ap'))routeVoies(parent,s.a,0,s.b,0,c.voies);else if(s.sens==='v')routeVoies(parent,p,s.a,p,s.b,c.voies);else routeVoies(parent,s.a,p,s.b,p,c.voies)}
      else{const p=s.pos[1];const cm=new THREE.MeshStandardMaterial({color:'#ff7a1a',roughness:.6});
        for(let t=s.a;t<=s.b;t+=9){const cn=new THREE.Mesh(new THREE.ConeGeometry(.28,.7,8),cm);cn.position.set(s.sens==='v'?p:t,.35,s.sens==='v'?t:p);parent.add(cn)}}
    });
    objets().forEach(o=>{
      if(o.type==='arbre'){const g=new THREE.Group();g.position.set(o.x,0,o.z);cyl(g,.18,.26,2.2,std('#6b4423'),0,1.1,0,6);const f=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8),std('#2f8f46'));f.position.y=3;f.scale.y=.95;f.castShadow=true;g.add(f);parent.add(g);cols.push({x:o.x,z:o.z,r:.5})}
      else if(o.type==='bat'){const g=new THREE.Group();g.position.set(o.x,0,o.z);box(g,o.hw*2,3.4,o.hd*2,std(o.coul),0,1.7,0);box(g,o.hw*2+.5,.35,o.hd*2+.5,std('#7a2f1d'),0,3.55,0);box(g,1.3,2,.12,std('#4a2f1b'),0,1,o.hd+.02);box(g,1.5,.9,.1,std('#9fd3f5',.2),o.hw*.5,1.9,o.hd+.02);
        const pl=new THREE.Mesh(new THREE.PlaneGeometry(o.hw*1.9,.7),new THREE.MeshStandardMaterial({map:T.textBoard([{t:o.nom.toUpperCase(),s:56,y:.5}],512,100,'#333','#fff')}));pl.position.set(0,2.9,o.hd+.06);g.add(pl);parent.add(g);bxs.push({x0:o.x-o.hw,x1:o.x+o.hw,z0:o.z-o.hd,z1:o.z+o.hd})}
      else if(studioFn){const sm=studioFn(parent,cols,bxs,o.x,o.z);spots.push({x:sm.x,z:sm.z-1.2,r:4.2,label:'🎵 BOYEKOLI MUSIC STUDIO : entrer',kind:'studio'})}
    });
    // bureau d'aménagement : cabane de chantier et grand panneau
    const g=new THREE.Group();g.position.set(BUREAU.x,0,BUREAU.z);parent.add(g);
    box(g,4,2.6,3,std('#e8d9a8'),0,1.3,0);box(g,4.4,.3,3.4,std('#b0502d'),0,2.75,0);box(g,1,1.8,.1,std('#4a2f1b'),-.8,.9,1.52);box(g,1.2,.9,.1,std('#9fd3f5',.2),1,1.5,1.52);
    cyl(g,.06,.08,3.4,std('#4a3320'),3.2,1.7,1.5,8);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.4),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'📐 AMÉNAGEMENT',s:60,y:.3},{t:'DU TERRITOIRE',s:56,y:.55},{t:'Routes · Arbres · Bâtiments',s:30,y:.8,b:false,c:'#ffe9a8'}],512,200,'#d35400','#ffffff')}));
    pl.position.set(3.2,3.2,1.6);g.add(pl);
    bxs.push({x0:BUREAU.x-2.2,x1:BUREAU.x+2.2,z0:BUREAU.z-1.7,z1:BUREAU.z+1.7});
    spots.push({x:BUREAU.x+1,z:BUREAU.z+3.2,r:4,label:'📐 Bureau d’aménagement du territoire',kind:'bureau'});
    return {spots};
  }
  // ---------- dialogue
  const dispo=()=>({pieces:A().pieces,bitume:stock().bitume||0});
  function selDe(d,s){if(!d.sel)d.sel={};const c=cfgDe(s);return d.sel[s.id]||(d.sel[s.id]={pos:c?c.pos:Math.min(1,s.pos.length-1),voies:c?c.voies:2})}
  function net(s,sel){const nv=cout(s,sel.voies),r=R()[s.id]||(s.def?{voies:s.def}:null);if(!r)return {nv,rem:{pieces:0,bitume:0},tot:nv};const ov=cout(s,r.voies);const rem={pieces:Math.floor(ov.pieces*.6),bitume:Math.floor(ov.bitume*.6)};
    return {nv,rem,tot:{pieces:nv.pieces-rem.pieces,bitume:nv.bitume-rem.bitume}}}
  function html(d){
    const dp=dispo();
    let h='<h3>📐 Aménagement du territoire</h3><p style="font-size:12px">🧑‍💼 <b>Architecte Lukusa</b> : « Pour élargir une route, il faut parfois déplacer un arbre ou un bâtiment. Choisis bien : chaque déménagement coûte des pièces. »</p>';
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    h+='<button class="p" onclick="closeDialog();amDebut()">🏗 Mode aménagement : tout déplacer dans le village (bâtiments, gare, stations, arbres, routes)</button>';
    h+=`<p class="row"><span>Mes pièces</span><b>${dp.pieces} 🪙</b></p><p class="row"><span>Mon bitume</span><b>${dp.bitume} 🛣️</b></p>`;
    let svg='<svg viewBox="48 -20 72 94" style="width:100%;background:#7aa857;border-radius:8px"><rect x="48" y="-20" width="72" height="94" fill="#7aa857"/>';
    routesActives().forEach(({s,c})=>{const r=corridor(s,c.pos,c.voies),w=largeurRoute(c.voies);svg+=`<rect x="${r.x0+.7}" y="${r.z0+.7}" width="${r.x1-r.x0-1.4}" height="${r.z1-r.z0-1.4}" fill="#3b3c40"/>`});
    SLOTS.forEach(s=>{if(s.id.startsWith('ap'))return;const sel=selDe(d,s),r=corridor(s,sel.pos,sel.voies);svg+=`<rect x="${r.x0}" y="${r.z0}" width="${r.x1-r.x0}" height="${r.z1-r.z0}" fill="#ffd54f" opacity=".3" stroke="#fff" stroke-dasharray="1.5 1" stroke-width=".4"/>`});
    objets().forEach(o=>{svg+=o.type==='arbre'?`<circle cx="${o.x}" cy="${o.z}" r="1.6" fill="#1f7a3a"/>`:`<rect x="${o.x-o.hw}" y="${o.z-o.hd}" width="${o.hw*2}" height="${o.hd*2}" fill="${o.coul||'#9a6ad6'}" stroke="#fff" stroke-width=".4"/><text x="${o.x}" y="${o.z+1}" font-size="2.6" text-anchor="middle" fill="#fff">${o.type==='studio'?'🎵':o.nom.slice(0,3)}</text>`});
    svg+='</svg>';
    h+=svg+'<p style="font-size:11px;opacity:.85">Gris : routes · jaune pointillé : aperçu · cercles verts : arbres · rectangles : bâtiments.</p>';
    h+='<h4>🛣 Routes</h4>';
    SLOTS.forEach(s=>{
      const c=cfgDe(s),sel=selDe(d,s),n=net(s,sel),ok=dp.pieces>=Math.max(0,n.tot.pieces)&&dp.bitume>=Math.max(0,n.tot.bitume);
      const cf=conflitsRoute(s,sel.pos,sel.voies),same=c&&c.pos===sel.pos&&c.voies===sel.voies;
      h+=`<div class="row" style="display:block;margin:6px 0;padding:6px;border:1px solid #aaa;border-radius:8px"><b>${esc(s.nom)}</b> <small>${s.sens==='v'?'nord-sud':'est-ouest'} · ${longueur(s)} m</small><br><small>${c?'✅ '+(R()[s.id]?'Construite':'Existante')+' : '+c.voies+' + '+c.voies+' voies':'Terrain à aménager'}</small><br>`;
      if(s.pos.length>1)h+='<div style="margin:3px 0">Position : '+s.pos.map((p,i)=>`<button style="padding:5px 9px;${sel.pos===i?'background:#ffd54f':''}" onclick="resSel('${s.id}','pos',${i})">${i+1}</button>`).join('')+'</div>';
      h+='<div style="margin:3px 0">Voies : '+[1,2,3,4].map(v=>`<button style="padding:5px 8px;${sel.voies===v?'background:#ffd54f':''}" onclick="resSel('${s.id}','voies',${v})">${v}+${v}</button>`).join('')+'</div>';
      h+=`<small>Largeur : ${largeurRoute(sel.voies).toFixed(1)} m · surface : ${Math.round(longueur(s)*largeurRoute(sel.voies))} m²<br>Coût : ${fmtC(n.nv)}${c?' — remboursement : '+fmtC(n.rem):''}</small><br>`;
      if(cf.length&&!same)h+=`<small style="color:#c0392b">⚠ Gêné par : ${cf.map(o=>esc(o.nom)).join(', ')} — déplace-les d’abord (section ci-dessous).</small><br>`;
      h+=`<button class="${ok&&!same&&!cf.length?'p':''}" ${same?'disabled':''} onclick="resAppliquer('${s.id}')">${c?'🔧 Modifier / élargir':'🏗 Construire'}${!ok&&!same?' (ressources manquantes)':''}</button>`;
      if(R()[s.id]&&!s.def)h+=`<button onclick="resDemolir('${s.id}')">🧱 Démolir (rembourse 60 %)</button>`;
      h+='</div>'});
    h+='<h4>🚚 Déplacer arbres et bâtiments</h4><p style="font-size:12px">Choisis un objet, puis un nouvel emplacement libre.</p><div style="display:flex;flex-wrap:wrap;gap:4px">';
    objets().forEach(o=>{h+=`<button style="padding:6px 8px;${d.obj===o.id?'background:#ffd54f':''}" onclick="resObj('${o.id}')">${o.type==='arbre'?'🌳':o.type==='studio'?'🎵':'🏠'} ${esc(o.nom)}</button>`});
    h+='</div>';
    if(d.obj){const o=objets().find(x=>x.id===d.obj);
      if(o){h+=`<div class="row" style="display:block;margin:6px 0;padding:6px;border:1px solid #aaa;border-radius:8px"><b>${esc(o.nom)}</b> · position actuelle (${Math.round(o.x)} ; ${Math.round(o.z)}) · déménagement : ${o.cout} 🪙<br>`;
        let n=0;spotsDe(o).forEach(([x,z],i)=>{const lib=spotLibre(o,x,z)&&!(Math.abs(o.x-x)<.5&&Math.abs(o.z-z)<.5);if(lib){n++;h+=`<button class="${dp.pieces>=o.cout?'p':''}" onclick="resDeplacer('${o.id}',${i})">→ (${Math.round(x)} ; ${Math.round(z)})</button>`}});
        if(!n)h+='<small>Aucun emplacement libre pour le moment.</small>';h+='</div>'}}
    h+='<p style="font-size:12px">💡 Le bitume s’achète à la quincaillerie du centre commercial (niveau 0). Les arbres déplacés ne sont pas abattus : ils sont replantés.</p><button class="s" onclick="closeDialog()">Fermer</button>';
    return h}
  const actions={
    resOuvrir:()=>{openBox({kind:'reseau',msg:'',sel:null,obj:null});parler('Bureau d’aménagement du territoire. Tu peux construire et élargir des routes, et déplacer arbres et bâtiments.')},
    resSel:(id,champ,v)=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id);selDe(d,s)[champ]=v;renderDialog()},
    resObj:id=>{const d=G.dialog;d.obj=d.obj===id?null:id;renderDialog()},
    resAppliquer:id=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id),sel=selDe(d,s),n=net(s,sel),dp=dispo(),c=cfgDe(s);
      if(c&&c.pos===sel.pos&&c.voies===sel.voies)return;
      const cf=conflitsRoute(s,sel.pos,sel.voies);
      if(cf.length){d.msg='Impossible : '+cf.map(o=>o.nom).join(', ')+' gêne(nt) cette route. Déplace-les d’abord.';SFX.ko();renderDialog();return}
      if(dp.pieces<n.tot.pieces||dp.bitume<n.tot.bitume){d.msg='Il te manque '+Math.max(0,n.tot.pieces-dp.pieces)+' 🪙 et '+Math.max(0,n.tot.bitume-dp.bitume)+' 🛣️.';SFX.ko();renderDialog();return}
      A().pieces-=n.tot.pieces;stock().bitume=(stock().bitume||0)-n.tot.bitume;R()[id]={pos:sel.pos,voies:sel.voies};
      G.refaireVille=true;save();refreshHud();SFX.win();d.msg=(c?'Route modifiée : ':'Route construite : ')+s.nom+' ('+sel.voies+'+'+sel.voies+' voies). Ferme ce menu pour la voir.';renderDialog()},
    resDemolir:id=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id),r=R()[id];if(!r||s.def)return;const ov=cout(s,r.voies);
      A().pieces+=Math.floor(ov.pieces*.6);stock().bitume=(stock().bitume||0)+Math.floor(ov.bitume*.6);delete R()[id];d.sel=null;
      G.refaireVille=true;save();refreshHud();SFX.coin();d.msg='Route démolie : 60 % des matériaux récupérés.';renderDialog()},
    resDeplacer:(id,i)=>{const d=G.dialog,o=objets().find(x=>x.id===id);if(!o)return;const sp=spotsDe(o)[i];
      if(!sp||!spotLibre(o,sp[0],sp[1])){d.msg='Cet emplacement n’est plus libre.';SFX.ko();renderDialog();return}
      if(A().pieces<o.cout){d.msg='Il te manque '+(o.cout-A().pieces)+' 🪙 pour ce déménagement.';SFX.ko();renderDialog();return}
      A().pieces-=o.cout;O()[id]={x:sp[0],z:sp[1]};G.refaireVille=true;save();refreshHud();SFX.coin();d.msg=o.nom+' déplacé. Ferme ce menu pour le voir.';renderDialog()}
  };
  return {construire,html,actions};
}
