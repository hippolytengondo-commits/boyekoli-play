// Paroles et sorties communes aux jeux : bulles de dialogue « dessin animé » avec voix, bouton Retour toujours accessible,
// bouton son. Une seule instance, partagée par tous les jeux (voir main.js).
export function creerParole(D){
  const {G,esc,voix,stop,save}=D;
  let box=null,last=null;
  const voixDe=def=>{const l=(def&&def.look)||{};return l.s==='h'?((l.h&&l.h<.9)?'junior':'mavungu'):(l.h&&l.h<.9?'ilunga':'bea')};
  const btn=(t,oc,bg)=>`<button onclick="${oc}" style="display:block;width:100%;text-align:left;padding:11px 12px;margin:4px 0;border-radius:12px;border:2px solid #fff4;background:${bg||'#2f4a63'};color:#fff;font:600 15px system-ui;touch-action:manipulation">${t}</button>`;
  // bulle au-dessus du personnage (ancre = position écran) + choix et sorties en bas
  function afficher(ov,o){
    cacher();last=o;
    box=document.createElement('div');box.id='parole';box.style.cssText='position:absolute;inset:0;z-index:40;pointer-events:none';
    const choix=(o.choix||[]).map(([l,js])=>btn('➤ '+esc(l),js)).join('');
    box.innerHTML=`<div id="parB" style="position:absolute;left:8px;top:90px;max-width:min(80vw,340px);background:#fff;color:#111;border:3px solid #111;border-radius:20px;padding:7px 13px 10px;font:600 15px/1.35 system-ui;box-shadow:0 5px 16px #0009"><div style="font-size:11px;color:#c0392b;font-weight:800;margin-bottom:2px">${esc(o.nom||'')}</div>${esc(o.texte)}<div id="parT1" style="position:absolute;bottom:-17px;left:30px;width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;border-top:17px solid #111"></div><div id="parT2" style="position:absolute;bottom:-11px;left:33px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:13px solid #fff"></div></div>
    <div style="position:absolute;left:0;right:0;bottom:0;pointer-events:auto;background:linear-gradient(transparent,#000c 25%);padding:20px 10px max(12px,env(safe-area-inset-bottom));max-height:50vh;overflow:auto">${choix}<div style="display:flex;gap:8px;margin-top:4px"><button onclick="parRepete()" style="flex:1;padding:12px;border-radius:12px;border:2px solid #fff4;background:#2c7fb8;color:#fff;font:700 14px system-ui">🔊 Réécouter</button><button onclick="${o.retour}" style="flex:1;padding:12px;border-radius:12px;border:2px solid #fff;background:#b23a3a;color:#fff;font:700 14px system-ui">⬅ Quitter</button></div></div>`;
    ov.appendChild(box);const sr=ov.querySelector('#sortieRapide');if(sr)sr.style.display='none';
    const b=box.querySelector('#parB'),w=ov.clientWidth,bw=b.offsetWidth,bh=b.offsetHeight,a=o.ancre;
    let ax=a?a.x:w/2,ay=a?a.y:140;const left=Math.max(8,Math.min(w-bw-8,ax-bw/2)),top=Math.max(54,Math.min(ay-bh-22,ov.clientHeight*.45));
    b.style.left=left+'px';b.style.top=top+'px';const tl=Math.max(18,Math.min(bw-40,ax-left-11));box.querySelector('#parT1').style.left=tl+'px';box.querySelector('#parT2').style.left=(tl+3)+'px';
    dire(o.texte,o.voice)}
  function cacher(){if(box){const ov=box.parentNode,sr=ov&&ov.querySelector('#sortieRapide');if(sr)sr.style.display='';box.remove();box=null}last=null}
  function dire(t,id,fin){voix(t,id,false,fin)}
  function repeter(){if(last)voix(last.texte,last.voice,true)}
  // bouton son dans la barre du haut, et bouton Retour accessible en bas (au pouce)
  function equiper(ov,o){
    if(!document.getElementById('parCss')){const st=document.createElement('style');st.id='parCss';st.textContent='#detpan,#scipan,#medpan,#dsover,#fsover,#vover,#spover{padding-top:max(env(safe-area-inset-top),56px)!important}';document.head.appendChild(st)}
    const top=ov.firstElementChild;if(top){top.style.paddingTop='max(env(safe-area-inset-top),22px)';
      const sn=document.createElement('button');sn.className='parVoixBtn';sn.style.cssText='padding:5px 9px;margin:0 2px;border-radius:10px;border:2px solid #fff3;background:#3a4a5e;color:#fff;font-size:14px;touch-action:manipulation';sn.onclick=()=>window.parVoix();sn.textContent=G.voice?'🔊':'🔇';top.insertBefore(sn,top.lastElementChild)}
    const b=document.createElement('button');b.id='sortieRapide';b.textContent='⬅ Retour';
    b.style.cssText='position:absolute;z-index:60;padding:12px 18px;border-radius:26px;border:3px solid #fff;background:#b23a3a;color:#fff;font:700 16px system-ui;box-shadow:0 4px 12px #0009;touch-action:manipulation;'+(o&&o.coin?'left:8px;bottom:8px':'left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom))');
    b.setAttribute('onclick',o.retour);(o.cible?ov.querySelector(o.cible):ov).appendChild(b)}
  function basculer(){G.voice=!G.voice;if(!G.voice)stop();save();document.querySelectorAll('.parVoixBtn').forEach(e=>e.textContent=G.voice?'🔊':'🔇');return G.voice}
  window.parVoix=basculer;window.parRepete=repeter;
  return {afficher,cacher,dire,repeter,equiper,voixDe,basculer,actif:()=>!!box};
}
