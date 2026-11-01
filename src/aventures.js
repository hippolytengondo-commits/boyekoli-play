// Aventures scénarisées en immersion : le joueur marche dans un monde 3D (forêt, savane, volcans), suit le faisceau lumineux d'étape en étape,
// écoute l'histoire de chaque lieu et retrouve un souvenir à la fin. Aucune question : on découvre en se promenant.
import {AVENTURES} from './contenu/aventures.js';
import {buildAventure,pointsEtapes} from './aventure3d.js';

export function creerAventures(D){
  const {G,esc,save,gain,SFX,renderDialog,openBox,closeDialog,goTo,parler,toast}=D;
  const st=id=>{const a=G.adv;if(!a.avent)a.avent={};if(!a.coll)a.coll={};if(!a.avent[id])a.avent[id]={ch:0,bonus:0,fini:false};return a.avent[id]};
  const find=id=>AVENTURES.find(x=>x.id===id);
  const courant=()=>find(G.av&&G.av.id);
  const texte=(c)=>c.scene+' '+c.e;
  const etat={ch:()=>{const a=courant();return a?st(a.id).ch:0},fini:()=>{const a=courant();return a?st(a.id).fini:false}};
  function vueListe(){
    let h='<h3>🧭 Aventures</h3><p style="font-size:13px">De vraies explorations : tu te promènes en 3D, tu suis le faisceau lumineux de lieu en lieu et tu écoutes l’histoire de chaque endroit. Tu peux reprendre là où tu t’es arrêté.</p>';
    AVENTURES.forEach(a=>{const s=st(a.id);
      h+=`<button class="${s.fini?'':'p'}" onclick="avOuvrir('${a.id}')">${a.ico} ${esc(a.titre)}<br><small>${s.fini?'✔ Terminée':s.ch?'Étape '+(s.ch+1)+' sur '+a.chapitres.length:'À commencer'}</small></button>`});
    return h+'<button class="s" onclick="enMenu()">← Menu</button>';
  }
  function html(d){
    if(d.kind==='recit'){
      const a=find(d.aid),c=a.chapitres[d.i];
      return `<h3>${a.ico} ${esc(c.lieu)}</h3><p style="font-size:12px;opacity:.7">Étape ${d.i+1} sur ${a.chapitres.length}</p><p>${esc(c.scene)}</p><p style="background:#eef7ee;border-radius:10px;padding:8px"><b>Le savais-tu ?</b> ${esc(c.e)}</p><p>🔎 <b>Indice :</b> ${esc(c.indice)}</p>`
        +`<button class="p" onclick="avSuite()">${d.i+1<a.chapitres.length?'Continuer l’aventure ▶':'Terminer l’aventure'}</button><button onclick="avLire()">🔊 Réécouter</button>`;
    }
    if(d.kind==='avfin'){
      const a=find(d.aid),o=a.souvenir;
      return `<h3>${a.ico} ${esc(a.titre)}</h3><div style="font-size:56px;text-align:center">${o.ico}</div><p style="text-align:center"><b>Aventure terminée !</b><br>${esc(o.nom)}<br><span style="font-size:13px">${esc(o.txt)}</span></p><p style="text-align:center">+${d.pieces} 🪙 · +${d.savoir} savoir</p><button class="p" onclick="enColl()">🎒 Voir mes collections</button><button onclick="avQuitter()">🏡 Retourner au village</button>`;
    }
    if(d.aid){
      const a=find(d.aid),s=st(a.id);
      return `<h3>${a.ico} ${esc(a.titre)}</h3><p>${esc(a.intro)}</p><p style="font-size:13px">Guide : <b>${esc(a.guide)}</b> · ${a.chapitres.length} étapes · marche jusqu’à la lumière dorée</p><button class="p" onclick="avGo()">${s.ch&&!s.fini?'Reprendre l’aventure':'Partir à l’aventure'}</button><button class="s" onclick="avListe()">← Aventures</button>`;
    }
    return vueListe();
  }
  function portes(){
    const r=G.avRet;if(G.sc!=='aventure'||!r)return [];
    return [{x:0,z:6.2,r:2.6,label:'🏡 Quitter l’aventure (retour)',to:r.sc,tx:r.x,tz:r.z,phi:r.phi}];
  }
  function spots(){
    const a=courant();if(!a||G.sc!=='aventure')return [];
    const s=st(a.id);if(s.fini)return [];
    const p=pointsEtapes(a.chapitres.length)[s.ch],c=a.chapitres[s.ch];
    return [{x:p.x,z:p.z,r:3.6,label:'📖 Écouter l’histoire : '+c.lieu,run:()=>{openBox({kind:'recit',aid:a.id,i:s.ch});parler(texte(c))}}];
  }
  function entrer(id){
    closeDialog();
    if(G.sc!=='aventure')G.avRet={sc:G.sc,x:G.x,z:G.z,phi:G.phi};
    G.av={id:id};
    goTo({to:'aventure',tx:0,tz:4,phi:-Math.PI/2});
    toast('Suis le faisceau de lumière dorée pour trouver la prochaine étape !');
  }
  return {
    html:d=>(d.kind==='avent'||d.kind==='recit'||d.kind==='avfin')?html(d):null,
    monde:()=>buildAventure(courant()||AVENTURES[0],etat),
    spots,portes,
    bouton:()=>{const n=AVENTURES.filter(a=>st(a.id).fini).length;return `<button onclick="avListe()">🧭 Aventures · ${n} sur ${AVENTURES.length} terminées</button>`},
    actions:{
      avListe:()=>openBox({kind:'avent'}),
      avOuvrir:id=>openBox({kind:'avent',aid:id}),
      avGo:()=>entrer(G.dialog.aid),
      avLire:()=>{const d=G.dialog;if(d&&d.kind==='recit'){const c=find(d.aid).chapitres[d.i];parler(texte(c),true)}},
      avSuite:()=>{
        const d=G.dialog,a=find(d.aid),s=st(a.id);
        if(d.i===s.ch&&!s.fini){s.ch++;gain(1,2,3)}
        if(s.ch>=a.chapitres.length){
          if(!s.fini){s.fini=true;G.adv.coll[a.souvenir.id]=true;gain(5,10,10);save();d.pieces=5;d.savoir=10}else{d.pieces=0;d.savoir=0}
          d.kind='avfin';SFX.bravo();renderDialog();return;
        }
        save();closeDialog();SFX.ok();
        toast('🔎 '+a.chapitres[d.i].indice+' — cap sur l’étape suivante !');
      },
      avQuitter:()=>{closeDialog();const p=portes()[0];if(p)goTo(p)}
    }
  };
}
