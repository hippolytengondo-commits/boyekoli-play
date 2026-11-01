// Aventures en exploration libre (voir contenu/aventures.js) : le joueur se promène dans un monde 3D, discute avec des personnages,
// ramasse des pièces dorées flottantes et trouve des cachettes. Un carnet d'aventure (bandeau d'objectif) résume ce qu'il reste à faire.
import {AVENTURES} from './contenu/aventures.js';
import {buildAventure} from './aventure3d.js';

export function creerAventures(D){
  const {G,esc,save,gain,SFX,renderDialog,openBox,closeDialog,goTo,parler,toast}=D;
  const st=id=>{const a=G.adv;if(!a.avent)a.avent={};if(!a.coll)a.coll={};if(!a.avent[id])a.avent[id]={fini:false};const s=a.avent[id];if(!s.parle)s.parle={};if(!s.trouves)s.trouves={};if(!s.pris)s.pris={};return s};
  const find=id=>AVENTURES.find(x=>x.id===id);
  const courant=()=>find(G.av&&G.av.id);
  const nbTrouves=a=>a.cachettes.filter(c=>st(a.id).trouves[c.id]).length;
  const nbPieces=a=>Object.keys(st(a.id).pris).length;
  const tout=a=>nbTrouves(a)>=a.cachettes.length;
  const guide=a=>a.pnj.find(p=>p.id===a.guide);
  const etat={
    pos:()=>({x:G.x,z:G.z}),
    prise:i=>{const a=courant();return a?!!st(a.id).pris[i]:true},
    ramasser:i=>{const a=courant();if(!a)return;st(a.id).pris[i]=true;gain(1,1,0);SFX.coin();toast('🪙 +1 pièce · '+nbPieces(a)+'/'+a.pieces)},
    trouve:id=>{const a=courant();return a?!!st(a.id).trouves[id]:true}
  };
  function journal(){
    const a=courant();if(!a)return '';
    const s=st(a.id),g=guide(a);
    if(s.fini)return '🎉 « '+a.titre+' » terminée ! Explore librement et ramasse les pièces qui restent ('+nbPieces(a)+'/'+a.pieces+').';
    if(!s.parle[g.id])return '🧭 '+a.titre+' : va parler à '+g.nom+', près du départ.';
    if(!tout(a))return '🧭 Trouve les '+a.cachettes.length+' '+a.objet+' ('+nbTrouves(a)+'/'+a.cachettes.length+'). Parle aux habitants, fouille sous les arbres et derrière les buissons. Pièces : '+nbPieces(a)+'/'+a.pieces;
    return '✅ Tu as tout trouvé ! Retourne voir '+g.nom+'.';
  }
  function vueListe(d){
    let h=(d&&d.gare?'<h3>🚂 Gare · Destinations d’aventure</h3><p style="font-size:13px">Le train t’emmène vers des lieux à explorer à pied. Choisis ta destination !</p>':'<h3>🧭 Aventures</h3>')+'<p style="font-size:13px">Tu explores en liberté : tu rencontres des personnages, tu discutes avec eux, tu ramasses des pièces dorées et tu cherches des cachettes. Il n’y a pas de route tracée !</p>';
    AVENTURES.forEach(a=>{const s=st(a.id);
      h+=`<button class="${s.fini?'':'p'}" onclick="avOuvrir('${a.id}')">${a.ico} ${esc(a.titre)}<br><small>${s.fini?'✔ Terminée':nbTrouves(a)?nbTrouves(a)+' sur '+a.cachettes.length+' trouvés':'À commencer'}</small></button>`});
    return h+'<button class="s" onclick="enMenu()">← Menu</button>';
  }
  // ---------- conversation : les répliques s'affichent l'une après l'autre, puis le joueur peut poser des questions ----------
  function vueConv(d){
    const a=find(d.aid),p=a.pnj.find(x=>x.id===d.pid);
    let h=`<h3>💬 ${esc(p.nom)}</h3><div style="max-height:46vh;overflow:auto">`;
    d.vu.forEach(l=>{h+=l.q==='pnj'?`<p style="background:#eef5ff;border-radius:12px;padding:8px 10px;margin:6px 0"><b>${esc(p.nom)} :</b> ${esc(l.t)}</p>`:`<p style="background:#fff4d6;border-radius:12px;padding:8px 10px;margin:6px 0 6px 24px"><b>Moi :</b> ${esc(l.t)}</p>`});
    h+='</div>';
    if(d.file.length){h+=`<button class="p" onclick="avSuite()">Suite ▶</button>`}
    else{
      if(d.choix&&d.choix.length)d.choix.forEach((c,j)=>{h+=`<button onclick="avChoix(${j})">❓ ${esc(c.t)}</button>`});
      h+=`<button class="${d.fin?'p':'s'}" onclick="avFinConv()">${d.fin?'Continuer ▶':'Au revoir'}</button>`;
    }
    return h;
  }
  function html(d){
    if(d.kind==='conv')return vueConv(d);
    if(d.kind==='trouv'){
      const a=find(d.aid),c=a.cachettes.find(x=>x.id===d.cid);
      return `<h3>🔎 ${esc(c.titre)}</h3><p>${esc(c.txt)}</p><p style="text-align:center"><b>${nbTrouves(a)} sur ${a.cachettes.length} ${esc(a.objet)}</b> · +2 🪙</p><button class="p" onclick="avOk()">${tout(a)?'Retourner voir '+esc(guide(a).nom)+' ▶':'Continuer l’exploration ▶'}</button>`;
    }
    if(d.kind==='avfin'){
      const a=find(d.aid),o=a.souvenir;
      return `<h3>${a.ico} ${esc(a.titre)}</h3>`+(a.media?`<img src="${esc(a.media)}" alt="" style="max-width:100%;max-height:200px;border-radius:12px;display:block;margin:6px auto" onerror="this.style.display='none'">`:'')
        +`<div style="font-size:56px;text-align:center">${o.ico}</div><p style="text-align:center"><b>Aventure terminée !</b><br>${esc(o.nom)}<br><span style="font-size:13px">${esc(o.txt)}</span></p><p style="text-align:center">+${d.pieces} 🪙 · +${d.savoir} savoir</p><button class="p" onclick="enColl()">🎒 Voir mes collections</button><button onclick="avOk()">🌿 Continuer à explorer</button><button class="s" onclick="avQuitter()">🏡 Retourner au village</button>`;
    }
    if(d.aid){
      const a=find(d.aid),s=st(a.id);
      return `<h3>${a.ico} ${esc(a.titre)}</h3><p>${esc(a.intro)}</p><button class="p" onclick="avGo()">${nbTrouves(a)&&!s.fini?'Reprendre l’aventure':'Partir à l’aventure'}</button><button class="s" onclick="avListe()">← Aventures</button>`;
    }
    return vueListe(d);
  }
  function portes(){
    const r=G.avRet,a=courant();if(G.sc!=='aventure'||!r||!a)return [];
    return [{x:a.depart.x,z:a.depart.z+3.4,r:2.6,label:'🏡 Rentrer au village (train)',to:r.sc,tx:r.x,tz:r.z,phi:r.phi}];
  }
  function spots(){
    const a=courant();if(!a||G.sc!=='aventure')return [];
    const L=a.pnj.map(p=>({x:p.x,z:p.z,r:2.7,label:'💬 Parler à '+p.nom,run:()=>conv(a,p)}));
    // les cachettes n'apparaissent qu'à proximité (elles ne sont pas sur la mini-carte)
    a.cachettes.forEach(c=>{if(!st(a.id).trouves[c.id]&&Math.hypot(G.x-c.x,G.z-c.z)<3.4)L.push({x:c.x,z:c.z,r:3.4,label:'🔎 '+c.label,run:()=>fouiller(a,c)})});
    return L;
  }
  function conv(a,p){
    const s=st(a.id),finale=p.id===a.guide&&tout(a)&&!s.fini;
    let file,fin=false,choix=p.choix||null;
    if(finale){file=p.bilan.slice();fin=true;choix=null}
    else if(!s.parle[p.id]){file=p.lignes.slice();s.parle[p.id]=true;save()}
    else file=[{q:'pnj',t:s.fini&&p.id===a.guide?'Merci encore, explorateur ! Continue à découvrir le Congo.':(p.apres||'À bientôt !')}];
    const d={kind:'conv',aid:a.id,pid:p.id,file:file,vu:[],choix:choix,fin:fin};
    d.vu.push(d.file.shift());openBox(d);parler(d.vu[0].t);
  }
  function fouiller(a,c){
    st(a.id).trouves[c.id]=true;gain(2,3,3);save();SFX.bravo();
    openBox({kind:'trouv',aid:a.id,cid:c.id});parler(c.txt);
  }
  function entrer(id){
    closeDialog();
    const a=find(id);
    if(G.sc!=='aventure')G.avRet={sc:G.sc,x:G.x,z:G.z,phi:G.phi};
    G.av={id:id};
    goTo({to:'aventure',tx:a.depart.x,tz:a.depart.z,phi:-Math.PI/2});
    toast('Explore librement ! Parle aux habitants et regarde les lueurs dorées.');
  }
  return {
    html:d=>(d.kind==='avent'||d.kind==='conv'||d.kind==='trouv'||d.kind==='avfin')?html(d):null,
    monde:()=>buildAventure(courant()||AVENTURES[0],etat),
    spots,portes,journal,
    pnj:()=>{const a=courant();return a?a.pnj.map(p=>({id:'av_'+p.id,sc:'aventure',x:p.x,z:p.z,ry:p.ry||0,name:p.nom,short:p.nom,look:p.look})):[]},
    bouton:()=>{const n=AVENTURES.filter(a=>st(a.id).fini).length;return `<button onclick="avListe()">🧭 Aventures · ${n} sur ${AVENTURES.length} terminées</button>`},
    actions:{
      avListe:()=>openBox({kind:'avent'}),
      avGare:()=>{openBox({kind:'avent',gare:true});parler('Bienvenue à la gare ! Choisis ta destination : le trésor congolais, la forêt à sauver ou le parc des Virunga.')},
      avOuvrir:id=>openBox({kind:'avent',aid:id}),
      avGo:()=>entrer(G.dialog.aid),
      avSuite:()=>{const d=G.dialog;if(!d.file.length)return;const l=d.file.shift();d.vu.push(l);parler(l.t);renderDialog()},
      avChoix:j=>{const d=G.dialog,c=d.choix[j];d.vu.push({q:'toi',t:c.t});d.file=c.rep.slice();const l=d.file.shift();d.vu.push(l);parler(l.t);renderDialog()},
      avFinConv:()=>{
        const d=G.dialog,a=find(d.aid),s=st(a.id);
        if(d.fin&&!s.fini){
          s.fini=true;G.adv.coll[a.souvenir.id]=true;gain(5,10,10);save();
          d.kind='avfin';d.pieces=5;d.savoir=10;SFX.bravo();renderDialog();return;
        }
        closeDialog();
      },
      avOk:()=>closeDialog(),
      avQuitter:()=>{closeDialog();const p=portes()[0];if(p)goTo(p)}
    }
  };
}
