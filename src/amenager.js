// Mode aménagement : tout ce qui est dans le village peut être déplacé (bâtiments, gare, stations-service, arbres),
// on peut planter des arbres et créer, déplacer, allonger et élargir des routes. Le joueur touche un objet pour le choisir.
// Seules la maison familiale, l'école et les routes principales d'origine restent fixes (elles servent de repères).
import * as THREE from 'three';
import {routeVoies,largeurRoute} from './routes.js';
import {tree,setArbresOverrides} from './world.js';

const COUT={rep:40,gare:40,station:30,arbre:4,plante:6};
const coutRoute=(len,v)=>({pieces:Math.round(len*v*.25),bitume:Math.ceil(len*v/20)});
const PAS=2;

export function creerAmenager(D){
  const {G,esc,SFX,save,refreshHud,parler,toast}=D;
  const A=()=>G.adv;
  const AM=()=>{const a=A();if(!a.amenage)a.amenage={rep:{},gare:null,st:{},arbres:{},plantes:[],routes:[]};const m=a.amenage;['rep','st','arbres'].forEach(k=>{if(!m[k])m[k]={}});['plantes','routes'].forEach(k=>{if(!m[k])m[k]=[]});return m};
  const stock=()=>{const a=A();if(!a.stock)a.stock={};return a.stock};
  let actif=false,sel=null,cadre=null,ui=null,suivant=1;
  // ---------- application au monde (appelé à la construction du village)
  const appliquerArbres=()=>setArbresOverrides(AM().arbres);
  function construireExtras(parent,cols,bxs){
    const m=AM();
    m.plantes.forEach((p,i)=>{const t=tree(parent,p.x,p.z,1.1,false,null,cols);t.userData.edit={type:'plante',idx:i,key:'p'+i}});
    m.routes.forEach(r=>{r.sens==='v'?routeVoies(parent,r.x,r.z-r.len/2,r.x,r.z+r.len/2,r.voies,{edit:{type:'route',id:r.id}}):routeVoies(parent,r.x-r.len/2,r.z,r.x+r.len/2,r.z,r.voies,{edit:{type:'route',id:r.id}})});
  }
  // ---------- empreintes
  const rectDe=(o)=>{const ud=o.userData.edit,x=o.position.x,z=o.position.z;
    if(ud.type==='arbre'||ud.type==='plante')return {x0:x-1,x1:x+1,z0:z-1,z1:z+1};
    if(ud.type==='rep')return {x0:x-ud.w/2,x1:x+ud.w/2,z0:z-ud.d/2,z1:z+ud.d/2};
    if(ud.type==='gare')return {x0:x-3,x1:x+5,z0:z-5.5,z1:z+5.5};
    if(ud.type==='station')return {x0:x-6.5,x1:x+6.5,z0:z-4,z1:z+8};
    if(ud.type==='route'){const r=AM().routes.find(q=>q.id===ud.id);if(!r)return null;const w=largeurRoute(r.voies)/2+.7;return r.sens==='v'?{x0:r.x-w,x1:r.x+w,z0:r.z-r.len/2,z1:r.z+r.len/2}:{x0:r.x-r.len/2,x1:r.x+r.len/2,z0:r.z-w,z1:r.z+w}}
    return null};
  const inter=(a,b,m)=>a.x0<b.x1+(m||0)&&a.x1>b.x0-(m||0)&&a.z0<b.z1+(m||0)&&a.z1>b.z0-(m||0);
  function statiques(){
    const mf=A().maison||{},S=[
      {x0:-27-(mf.cuisine?4.4:0)-1,x1:-17+(mf.chambre?4.4:0)+1,z0:-12.5,z1:-5.5},   // maison familiale
      {x0:28,x1:56,z0:-16,z1:-6},{x0:26,x1:44,z0:-8,z1:5},                          // école et sa cour
      {x0:-24,x1:27,z0:-2.9,z1:2.9},{x0:-11.8,x1:-2.2,z0:-14.8,z1:14.8},         // rue principale et liaison
      {x0:36,x1:114,z0:-14,z1:14},{x0:114,x1:146,z0:-10,z1:12},{x0:58,x1:116,z0:12,z1:64}   // route, site de l'aéroport et zone d'aménagement de l'Est (gérée par le bureau)
    ];
    if(A().rond)S.push({x0:-16.4,x1:2.4,z0:-9.4,z1:9.4});
    // objets fixes de la zone Est (aménagement du territoire) : ignorés ici
    return S}
  function autres(excl){const L=[];D.getW().group.traverse(o=>{const u=o.userData&&o.userData.edit;if(u&&o!==excl){const r=rectDe(o);if(r)L.push({r,u,o})}});return L}
  function valide(o){
    const r=rectDe(o),W=D.getW(),b=W.bounds,ud=o.userData.edit;if(!r)return {ok:false,raison:'objet introuvable'};
    if(r.x0<b.x0||r.x1>b.x1||r.z0<b.z0||r.z1>b.z1)return {ok:false,raison:'hors du terrain'};
    if(ud.type!=='route')for(const s of statiques())if(inter(r,s))return {ok:false,raison:'trop près d’un élément fixe (maison, école, rue principale, aéroport)'};
    if(ud.type==='route'){for(const s of statiques().slice(0,3))if(inter(r,s))return {ok:false,raison:'ne peut pas traverser la maison ou l’école'}}
    for(const q of autres(o)){
      if(ud.type==='route'){if(['rep','gare','station'].includes(q.u.type)&&inter(r,q.r))return {ok:false,raison:'un bâtiment gêne : '+(q.u.nom||'bâtiment')}}
      else if(q.u.type==='route'){if(['rep','gare','station'].includes(ud.type)&&inter(r,q.r))return {ok:false,raison:'une route passe ici'}}
      else if((q.u.type==='arbre'||q.u.type==='plante')&&['rep','gare','station'].includes(ud.type)){/* les arbres sous le nouveau bâtiment seront replantés ailleurs ou supprimés à la validation */}
      else if(inter(r,q.r,ud.type==='arbre'||ud.type==='plante'?.5:0))return {ok:false,raison:'emplacement occupé : '+(q.u.nom||'un autre objet')}}
    return {ok:true}}
  // ---------- interface
  function creerUI(){
    ui=document.createElement('div');ui.id='amui';
    ui.style.cssText='position:fixed;top:52px;left:6px;width:min(300px,64vw);z-index:25;background:rgba(20,28,40,.92);color:#fff;border-radius:12px;padding:8px;font:12px system-ui;box-shadow:0 4px 14px #0007';
    document.body.appendChild(ui);majUI()}
  const bt=(t,oc,bg,st)=>`<button onclick="${oc}" style="min-width:34px;height:34px;margin:2px;border-radius:9px;border:1px solid #888;background:${bg||'#3a4150'};color:#fff;font-size:15px;${st||''}">${t}</button>`;
  const nomObj=o=>{const u=o.userData.edit;return u.type==='arbre'||u.type==='plante'?'🌳 Arbre':u.type==='route'?'🛣 Route':'🏠 '+(u.nom||'Bâtiment')};
  function majUI(){
    if(!ui)return;
    let h='<b>🏗 Mode aménagement</b> <span style="float:right">'+bt('✖','amFin()','#7b2d26','min-width:28px;height:26px;font-size:12px')+'</span><br>';
    if(!sel){h+='<small>Touche un bâtiment, un arbre ou une route pour le choisir, puis déplace-le.</small><br>'+bt('🌳+','amPlanter()','#2e7d32','font-size:13px')+'<small>planter (6 🪙)</small> '+bt('🛣+','amRoute()','#4a4a52','font-size:13px')+'<small>route</small>';ui.innerHTML=h;return}
    const o=sel.o,u=o.userData.edit,v=valide(o),c=coutSel();
    h+=`<b>${esc(nomObj(o))}</b>${u.type==='route'?' · '+routeCfg().len+' m · '+routeCfg().voies+'+'+routeCfg().voies+' voies':''}<br>`;
    h+='<div style="display:flex;align-items:center;flex-wrap:wrap">'+bt('◀','amDep(-1,0)')+bt('▲','amDep(0,-1)')+bt('▼','amDep(0,1)')+bt('▶','amDep(1,0)');
    if(u.type==='rep'&&!u.norot)h+=bt('⟳','amTourner()');
    if(u.type==='route')h+=bt('↔↕','amSens()')+bt('−','amLong(-4)')+bt('+','amLong(4)')+bt('1-4','amVoies()');
    h+='</div>';
    h+=`<small style="color:${v.ok?'#a5d6a7':'#ff8a80'}">${v.ok?'✔ Emplacement valide':'✖ '+esc(v.raison)}</small><br><small>Coût : ${c.pieces} 🪙${c.bitume?' + '+c.bitume+' 🛣️':''}</small><br>`;
    h+=bt('✔ Valider','amValider()',v.ok?'#2e7d32':'#555','font-size:12px;width:auto;padding:0 8px')+bt('↩ Annuler','amAnnuler()','#3a4150','font-size:12px;width:auto;padding:0 8px');
    if(u.type==='arbre'||u.type==='plante'||u.type==='route')h+=bt('🗑','amSupprimer()','#7b2d26','font-size:13px');
    ui.innerHTML=h}
  // configuration d'une route (copie de travail)
  const routeCfg=()=>sel.cfg;
  function coutSel(){
    const u=sel.o.userData.edit;
    if(u.type==='route'){const nv=coutRoute(sel.cfg.len,sel.cfg.voies),ov=sel.base?coutRoute(sel.base.len,sel.base.voies):{pieces:0,bitume:0};
      const bouge=sel.base&&(sel.base.x!==sel.cfg.x||sel.base.z!==sel.cfg.z||sel.base.sens!==sel.cfg.sens);
      if(!sel.base)return nv;const changeTaille=sel.base.len!==sel.cfg.len||sel.base.voies!==sel.cfg.voies;
      const rem={pieces:Math.floor(ov.pieces*.6),bitume:Math.floor(ov.bitume*.6)};
      const t=changeTaille?{pieces:Math.max(0,nv.pieces-rem.pieces),bitume:Math.max(0,nv.bitume-rem.bitume)}:{pieces:0,bitume:0};
      if(bouge){t.pieces+=Math.round(nv.pieces*.3)}return t}
    const dep=sel.o.position.x!==sel.x0||sel.o.position.z!==sel.z0||sel.o.rotation.y!==sel.ry0;
    if(!dep)return {pieces:0,bitume:0};
    return {pieces:COUT[u.type]||4,bitume:0}}
  const peutPayer=c=>A().pieces>=c.pieces&&(stock().bitume||0)>=c.bitume;
  // ---------- sélection par touche sur l'écran
  const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let dn=null;
  function bindCanvas(){
    const cv=D.getCanvas();
    cv.addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY}});
    cv.addEventListener('pointerup',e=>{if(!actif||!dn||G.sc!=='ville')return;const d=Math.hypot(e.clientX-dn.x,e.clientY-dn.y);dn=null;if(d>8)return;
      const b=cv.getBoundingClientRect();mv.set(((e.clientX-b.left)/b.width)*2-1,-((e.clientY-b.top)/b.height)*2+1);ray.setFromCamera(mv,D.getCamera());
      const hits=ray.intersectObjects(D.getW().group.children,true);
      for(const h of hits){let o=h.object;while(o&&!(o.userData&&o.userData.edit))o=o.parent;if(o){choisir(o);return}}
      if(sel&&!sel.modifie)deselect()})}
  function choisir(o){
    if(sel&&sel.modifie)annulerSel(true);deselect(true);const u=o.userData.edit;
    sel={o,x0:o.position.x,z0:o.position.z,ry0:o.rotation.y,modifie:false};
    if(u.type==='route'){const r=AM().routes.find(q=>q.id===u.id);sel.cfg=Object.assign({},r);sel.base=Object.assign({},r);sel.o0=o.position.clone()}
    cadreMaj();majUI();SFX.coin&&SFX.coin()}
  function deselect(sans){sel=null;if(cadre){cadre.parent&&cadre.parent.remove(cadre);cadre=null}if(!sans)majUI()}
  function cadreMaj(){
    if(!sel)return;if(cadre){cadre.parent&&cadre.parent.remove(cadre);cadre=null}
    const r=rectDe(sel.o);if(!r)return;const v=valide(sel.o);
    const geo=new THREE.EdgesGeometry(new THREE.BoxGeometry(r.x1-r.x0,3,r.z1-r.z0));
    cadre=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:v.ok?0x55ff88:0xff5555}));cadre.position.set((r.x0+r.x1)/2,1.5,(r.z0+r.z1)/2);D.getW().group.add(cadre)}
  // ---------- déplacements
  function deplacer(dx,dz){
    if(!sel)return;const o=sel.o,u=o.userData.edit,p=(u.type==='arbre'||u.type==='plante')?1:PAS;
    if(u.type==='route'){sel.cfg.x+=dx*PAS;sel.cfg.z+=dz*PAS;o.position.x+=dx*PAS;o.position.z+=dz*PAS}
    else{o.position.x+=dx*p;o.position.z+=dz*p}
    sel.modifie=true;cadreMaj();majUI()}
  function reconstruireRoute(){   // aperçu : reconstruit la route avec la copie de travail
    const o=sel.o,par=o.parent,c=sel.cfg;par.remove(o);const n0=par.children.length;
    c.sens==='v'?routeVoies(par,c.x,c.z-c.len/2,c.x,c.z+c.len/2,c.voies,{edit:{type:'route',id:c.id}}):routeVoies(par,c.x-c.len/2,c.z,c.x+c.len/2,c.z,c.voies,{edit:{type:'route',id:c.id}});
    sel.o=par.children[par.children.length-1];sel.modifie=true;cadreMaj();majUI()}
  function annulerSel(sans){
    if(!sel)return;const o=sel.o,u=o.userData.edit;
    if(u.type==='route'){const par=o.parent;par.remove(o);const c=sel.base;c.sens==='v'?routeVoies(par,c.x,c.z-c.len/2,c.x,c.z+c.len/2,c.voies,{edit:{type:'route',id:c.id}}):routeVoies(par,c.x-c.len/2,c.z,c.x+c.len/2,c.z,c.voies,{edit:{type:'route',id:c.id}})}
    else{o.position.set(sel.x0,0,sel.z0);o.rotation.y=sel.ry0}
    if(!sans){deselect()}}
  function valider(){
    if(!sel)return;const o=sel.o,u=o.userData.edit,v=valide(o);
    if(!v.ok){toast('Impossible : '+v.raison);SFX.ko&&SFX.ko();return}
    const c=coutSel();if(!peutPayer(c)){toast('Il te manque des ressources ('+c.pieces+' 🪙'+(c.bitume?' + '+c.bitume+' 🛣️':'')+').');SFX.ko&&SFX.ko();return}
    const m=AM(),x=o.position.x,z=o.position.z;
    if(u.type==='rep')m.rep[u.id]={x,z,ry:o.rotation.y};
    else if(u.type==='gare')m.gare={x,z};
    else if(u.type==='station')m.st[u.id]={x,z};
    else if(u.type==='arbre'){if(Math.abs(x-u.ox)<.01&&Math.abs(z-u.oz)<.01)delete m.arbres[u.key];else m.arbres[u.key]={x,z}}
    else if(u.type==='plante'){m.plantes[u.idx]={x,z}}
    else if(u.type==='route'){const i=m.routes.findIndex(q=>q.id===u.id);if(i>=0)m.routes[i]=Object.assign({},sel.cfg);
      // les arbres qui se trouvent sur la route sont déplacés : ils sont supprimés (replantables)
      const r=rectDe(o);autres(o).forEach(q=>{if((q.u.type==='arbre')&&inter(r,q.r)){m.arbres[q.u.key]=null}if(q.u.type==='plante'&&inter(r,q.r))m.plantes[q.u.idx]=null})}
    if(['rep','gare','station'].includes(u.type)){const r=rectDe(o);autres(o).forEach(q=>{if(q.u.type==='arbre'&&inter(r,q.r))m.arbres[q.u.key]=null;if(q.u.type==='plante'&&inter(r,q.r))m.plantes[q.u.idx]=null})}
    A().pieces-=c.pieces;stock().bitume=(stock().bitume||0)-c.bitume;
    m.plantes=m.plantes.filter(Boolean);
    save();refreshHud();SFX.win&&SFX.win();toast('Aménagement enregistré'+(c.pieces?' (−'+c.pieces+' 🪙)':'')+'.');
    sel=null;if(cadre){cadre.parent&&cadre.parent.remove(cadre);cadre=null}D.rebuild();majUI()}
  const actions={
    amDebut:()=>{if(actif)return;actif=true;sel=null;if(!ui)creerUI();else{ui.style.display='block';majUI()}parler('Mode aménagement activé. Touche un objet pour le choisir.');if(D.fermerMenu)D.fermerMenu()},
    amFin:()=>{if(sel&&sel.modifie)annulerSel(true);deselect(true);actif=false;if(ui){ui.remove();ui=null}},
    amDep:(dx,dz)=>deplacer(dx,dz),
    amTourner:()=>{if(!sel)return;const o=sel.o;o.rotation.y=(Math.abs(o.rotation.y%(Math.PI*2))<.01?Math.PI:0);sel.modifie=true;cadreMaj();majUI()},
    amSens:()=>{if(!sel)return;sel.cfg.sens=sel.cfg.sens==='v'?'h':'v';reconstruireRoute()},
    amLong:d=>{if(!sel)return;sel.cfg.len=Math.max(8,Math.min(60,sel.cfg.len+d));reconstruireRoute()},
    amVoies:()=>{if(!sel)return;sel.cfg.voies=sel.cfg.voies%4+1;reconstruireRoute()},
    amValider:()=>valider(),
    amAnnuler:()=>{annulerSel();},
    amSupprimer:()=>{if(!sel)return;const u=sel.o.userData.edit,m=AM();
      if(u.type==='arbre')m.arbres[u.key]=null;else if(u.type==='plante')m.plantes.splice(u.idx,1);
      else if(u.type==='route'){const r=m.routes.find(q=>q.id===u.id),ov=coutRoute(r.len,r.voies);A().pieces+=Math.floor(ov.pieces*.6);stock().bitume=(stock().bitume||0)+Math.floor(ov.bitume*.6);m.routes=m.routes.filter(q=>q.id!==u.id)}
      save();refreshHud();SFX.coin&&SFX.coin();sel=null;if(cadre){cadre.parent&&cadre.parent.remove(cadre);cadre=null}D.rebuild();majUI()},
    amPlanter:()=>{if(A().pieces<COUT.plante){toast('Il te manque '+(COUT.plante-A().pieces)+' 🪙.');SFX.ko&&SFX.ko();return}
      const m=AM(),px=Math.round(G.x/PAS)*PAS+4,pz=Math.round(G.z/PAS)*PAS;A().pieces-=COUT.plante;m.plantes.push({x:px,z:pz});save();refreshHud();D.rebuild();toast('Arbre planté près de toi. Touche-le pour le déplacer.')},
    amRoute:()=>{const m=AM(),c=coutRoute(20,2);if(!peutPayer(c)){toast('Une route de 20 m (2+2 voies) coûte '+c.pieces+' 🪙 + '+c.bitume+' 🛣️.');SFX.ko&&SFX.ko();return}
      A().pieces-=c.pieces;stock().bitume=(stock().bitume||0)-c.bitume;const id='r'+Date.now();m.routes.push({id,x:Math.round(G.x/PAS)*PAS,z:Math.round(G.z/PAS)*PAS+8,sens:'h',len:20,voies:2});save();refreshHud();D.rebuild();toast('Route créée près de toi. Touche-la pour la placer et l’élargir.')}
  };
    function choisirId(type,id){let f=null;D.getW().group.traverse(o=>{const u=o.userData&&o.userData.edit;if(!f&&u&&u.type===type&&(id===undefined||u.id===id||u.key===id))f=o});if(f)choisir(f);return !!f}
  return {choisirId,actions,appliquerArbres,construireExtras,bindCanvas,actif:()=>actif,ouvert:()=>!!ui,AM};
}
