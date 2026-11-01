// Aménagement des routes : dans la zone de l'Est, le joueur construit, déplace et élargit des routes (1 à 4 voies par sens).
// Coût : pièces + bitume (vendu à la quincaillerie du centre commercial). Démolir rembourse 60 %.
import * as THREE from 'three';
import * as T from './textures.js';
import {std,box,cyl} from './world.js';
import {routeVoies,largeurRoute} from './routes.js';

export const SLOTS=[
  {id:'v1',nom:'Avenue du Fleuve',sens:'v',pos:[68,72,76],a:14,b:60},
  {id:'v2',nom:'Avenue des Arts',sens:'v',pos:[100,104,108],a:14,b:60},
  {id:'h1',nom:'Rocade de l’Est',sens:'h',pos:[26,38,50],a:64,b:112}
];
export const BUREAU={x:60,z:17};
export const longueur=s=>s.b-s.a;
export const cout=(s,voies)=>({pieces:Math.round(longueur(s)*voies*.25),bitume:Math.ceil(longueur(s)*voies/20)});

export function creerReseau(D){
  const {G,esc,openBox,renderDialog,SFX,save,refreshHud,parler,toast}=D;
  const A=()=>G.adv;
  const R=()=>{const a=A();if(!a.reseau)a.reseau={};return a.reseau};
  const stock=()=>{const a=A();if(!a.stock)a.stock={};return a.stock};
  const fmtC=c=>c.pieces+' 🪙 + '+c.bitume+' 🛣️ bitume';
  // ---------- 3D : routes construites, piquets des routes à venir, bureau d'aménagement
  function construire(parent,cols,bxs){
    const res=R();
    SLOTS.forEach(s=>{
      const r=res[s.id];
      if(r){const p=s.pos[r.pos];if(s.sens==='v')routeVoies(parent,p,s.a,p,s.b,r.voies);else routeVoies(parent,s.a,p,s.b,p,r.voies)}
      else{const p=s.pos[1];const cm=new THREE.MeshStandardMaterial({color:'#ff7a1a',roughness:.6});
        for(let t=s.a;t<=s.b;t+=9){const c=new THREE.Mesh(new THREE.ConeGeometry(.28,.7,8),cm);c.position.set(s.sens==='v'?p:t,.35,s.sens==='v'?t:p);parent.add(c)}}
    });
    // bureau d'aménagement : cabane de chantier et grand panneau
    const g=new THREE.Group();g.position.set(BUREAU.x,0,BUREAU.z);parent.add(g);
    box(g,4,2.6,3,std('#e8d9a8'),0,1.3,0);box(g,4.4,.3,3.4,std('#b0502d'),0,2.75,0);box(g,1,1.8,.1,std('#4a2f1b'),-.8,.9,1.52);box(g,1.2,.9,.1,std('#9fd3f5',.2),1,1.5,1.52);
    cyl(g,.06,.08,3.4,std('#4a3320'),3.2,1.7,1.5,8);
    const pl=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.4),new THREE.MeshStandardMaterial({map:T.textBoard([{t:'📐 AMÉNAGEMENT',s:60,y:.3},{t:'DES ROUTES',s:60,y:.55},{t:'Construis · Déplace · Élargis',s:30,y:.8,b:false,c:'#ffe9a8'}],512,200,'#d35400','#ffffff')}));
    pl.position.set(3.2,3.2,1.6);g.add(pl);
    bxs.push({x0:BUREAU.x-2.2,x1:BUREAU.x+2.2,z0:BUREAU.z-1.7,z1:BUREAU.z+1.7});
    return {x:BUREAU.x+1,z:BUREAU.z+3.2};
  }
  // ---------- dialogue
  const dispo=()=>{const st=stock(),a=A();return {pieces:a.pieces,bitume:st.bitume||0}};
  function selDe(d,s){if(!d.sel)d.sel={};const r=R()[s.id];return d.sel[s.id]||(d.sel[s.id]={pos:r?r.pos:1,voies:r?r.voies:2})}
  function net(s,sel){const nv=cout(s,sel.voies),r=R()[s.id];if(!r)return {nv,rem:{pieces:0,bitume:0},tot:nv};const ov=cout(s,r.voies);const rem={pieces:Math.floor(ov.pieces*.6),bitume:Math.floor(ov.bitume*.6)};
    return {nv,rem,tot:{pieces:nv.pieces-rem.pieces,bitume:nv.bitume-rem.bitume}}}
  function html(d){
    const dp=dispo();
    let h='<h3>📐 Aménagement des routes</h3><p style="font-size:12px">🧑‍💼 <b>Architecte Lukusa</b> : « Une grande route a plusieurs voies dans chaque sens, séparées par un terre-plein central. Plus il y a de voies, plus il passe de véhicules, mais plus il faut de bitume. »</p>';
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    h+=`<p class="row"><span>Mes pièces</span><b>${dp.pieces} 🪙</b></p><p class="row"><span>Mon bitume</span><b>${dp.bitume} 🛣️</b></p>`;
    // plan de la zone (vue de dessus, 1 unité = 1 mètre)
    let svg='<svg viewBox="56 0 64 66" style="width:100%;background:#7aa857;border-radius:8px"><rect x="56" y="0" width="64" height="13" fill="#4a4a52"/><text x="60" y="8" font-size="3.5" fill="#fff">Route de l’aéroport</text>';
    SLOTS.forEach(s=>{const r=R()[s.id],sel=selDe(d,s),p=s.pos[sel.pos],w=largeurRoute(sel.voies);
      const rect=(pp,ww,fill,op,dash)=>s.sens==='v'?`<rect x="${pp-ww/2}" y="${s.a}" width="${ww}" height="${s.b-s.a}" fill="${fill}" opacity="${op}" ${dash?'stroke="#fff" stroke-dasharray="1.5 1" stroke-width=".4"':''}/>`:`<rect x="${s.a}" y="${pp-ww/2}" width="${s.b-s.a}" height="${ww}" fill="${fill}" opacity="${op}" ${dash?'stroke="#fff" stroke-dasharray="1.5 1" stroke-width=".4"':''}/>`;
      if(r)svg+=rect(s.pos[r.pos],largeurRoute(r.voies),'#3b3c40',1);
      svg+=rect(p,w,'#ffd54f',.35,true);
      svg+=s.sens==='v'?`<text x="${p}" y="${s.b+4}" font-size="3" text-anchor="middle" fill="#fff">${s.id.toUpperCase()}</text>`:`<text x="${s.a+2}" y="${p-w/2-1}" font-size="3" fill="#fff">${s.id.toUpperCase()}</text>`});
    svg+='<rect x="57" y="14.5" width="4" height="3.5" fill="#d35400"/></svg>';
    h+=svg+'<p style="font-size:11px;opacity:.8">Gris foncé : route construite · jaune pointillé : aperçu de ton choix.</p>';
    SLOTS.forEach(s=>{
      const r=R()[s.id],sel=selDe(d,s),n=net(s,sel),ok=dp.pieces>=Math.max(0,n.tot.pieces)&&dp.bitume>=Math.max(0,n.tot.bitume);
      h+=`<div class="row" style="display:block;margin:6px 0;padding:6px;border:1px solid #aaa;border-radius:8px"><b>${esc(s.id.toUpperCase())} · ${esc(s.nom)}</b> <small>${s.sens==='v'?'nord-sud':'est-ouest'} · ${longueur(s)} m</small><br><small>${r?'✅ Construite : '+r.voies+' + '+r.voies+' voies':'Terrain à aménager'}</small><br>`;
      h+='<div style="margin:3px 0">Position : '+s.pos.map((p,i)=>`<button style="padding:5px 9px;${sel.pos===i?'background:#ffd54f':''}" onclick="resSel('${s.id}','pos',${i})">${i+1}</button>`).join('')+'</div>';
      h+='<div style="margin:3px 0">Voies : '+[1,2,3,4].map(v=>`<button style="padding:5px 8px;${sel.voies===v?'background:#ffd54f':''}" onclick="resSel('${s.id}','voies',${v})">${v}+${v}</button>`).join('')+'</div>';
      const aire=Math.round(longueur(s)*largeurRoute(sel.voies));
      h+=`<small>Largeur : ${largeurRoute(sel.voies).toFixed(1)} m · surface de bitume : ${aire} m²<br>Coût : ${fmtC(n.nv)}${r?' — remboursement de l’ancienne : '+fmtC(n.rem):''}</small><br>`;
      const same=r&&r.pos===sel.pos&&r.voies===sel.voies;
      h+=`<button class="${ok&&!same?'p':''}" ${same?'disabled':''} onclick="resAppliquer('${s.id}')">${r?'🔧 Modifier / déplacer':'🏗 Construire'}${!ok&&!same?' (ressources manquantes)':''}</button>`;
      if(r)h+=`<button onclick="resDemolir('${s.id}')">🧱 Démolir (rembourse 60 %)</button>`;
      h+='</div>'});
    h+='<p style="font-size:12px">💡 Le bitume s’achète à la quincaillerie du centre commercial (niveau 0).</p><button class="s" onclick="closeDialog()">Fermer</button>';
    return h}
  const actions={
    resOuvrir:()=>{openBox({kind:'reseau',msg:'',sel:null});parler('Bureau d’aménagement des routes. Tu peux construire, déplacer ou élargir des routes.')},
    resSel:(id,champ,v)=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id);selDe(d,s)[champ]=v;renderDialog()},
    resAppliquer:id=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id),sel=selDe(d,s),n=net(s,sel),dp=dispo(),r=R()[id];
      if(r&&r.pos===sel.pos&&r.voies===sel.voies)return;
      if(dp.pieces<n.tot.pieces||dp.bitume<n.tot.bitume){d.msg='Il te manque '+Math.max(0,n.tot.pieces-dp.pieces)+' 🪙 et '+Math.max(0,n.tot.bitume-dp.bitume)+' 🛣️.';SFX.ko();renderDialog();return}
      A().pieces-=n.tot.pieces;stock().bitume=(stock().bitume||0)-n.tot.bitume;R()[id]={pos:sel.pos,voies:sel.voies};
      G.refaireVille=true;save();refreshHud();SFX.win();d.msg=(r?'Route modifiée : ':'Route construite : ')+s.nom+' ('+sel.voies+'+'+sel.voies+' voies). Ferme ce menu pour la voir.';renderDialog()},
    resDemolir:id=>{const d=G.dialog,s=SLOTS.find(x=>x.id===id),r=R()[id];if(!r)return;const ov=cout(s,r.voies);
      A().pieces+=Math.floor(ov.pieces*.6);stock().bitume=(stock().bitume||0)+Math.floor(ov.bitume*.6);delete R()[id];d.sel=null;
      G.refaireVille=true;save();refreshHud();SFX.coin();d.msg='Route démolie : 60 % des matériaux récupérés.';renderDialog()}
  };
  return {construire,html,actions};
}
