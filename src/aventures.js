// Aventures scénarisées (missions d'exploration) : parcours en chapitres, indices, défis et souvenir de collection.
// Reprise automatique : la progression de chaque aventure est enregistrée dans la sauvegarde du joueur.
import {AVENTURES} from './contenu/aventures.js';
import {melanger,graine} from './melange.js';
const vue=c=>melanger(c,graine(c.q));

export function creerAventures(D){
  const {G,esc,save,gain,SFX,renderDialog,openBox}=D;
  const st=id=>{const a=G.adv;if(!a.avent)a.avent={};if(!a.coll)a.coll={};if(!a.avent[id])a.avent[id]={ch:0,bonus:0,fini:false};return a.avent[id]};
  const find=id=>AVENTURES.find(x=>x.id===id);
  function vueListe(){
    let h='<h3>🧭 Aventures</h3><p style="font-size:13px">Des parcours avec un objectif, des personnages, des indices et une récompense. Tu peux les reprendre là où tu t’es arrêté.</p>';
    AVENTURES.forEach(a=>{const s=st(a.id);
      h+=`<button class="${s.fini?'':'p'}" onclick="avOuvrir('${a.id}')">${a.ico} ${esc(a.titre)}<br><small>${s.fini?'✔ Terminée':s.ch?'Chapitre '+(s.ch+1)+' sur '+a.chapitres.length:'À commencer'}</small></button>`});
    return h+'<button class="s" onclick="enMenu()">← Menu</button>';
  }
  function html(d){
    if(!d.aid)return vueListe();
    const a=find(d.aid),s=st(a.id);
    let h=`<h3>${a.ico} ${esc(a.titre)}</h3>`;
    if(d.etat==='intro')return h+`<p>${esc(a.intro)}</p><p style="font-size:13px">Guide : <b>${esc(a.guide)}</b> · ${a.chapitres.length} chapitres</p><button class="p" onclick="avGo()">${s.ch?'Reprendre l’aventure':'Commencer l’aventure'}</button><button class="s" onclick="avListe()">← Aventures</button>`;
    if(d.etat==='fin'){
      const o=a.souvenir;
      return h+`<div style="font-size:56px;text-align:center">${o.ico}</div><p style="text-align:center"><b>Aventure terminée !</b><br>${esc(o.nom)}<br><span style="font-size:13px">${esc(o.txt)}</span></p><p style="text-align:center">+${d.pieces} 🪙 · +${d.savoir} savoir</p><button class="p" onclick="enColl()">🎒 Voir mes collections</button><button class="s" onclick="avListe()">← Aventures</button>`;
    }
    const c=a.chapitres[s.ch];
    h+=`<p style="font-size:12px;opacity:.7">Chapitre ${s.ch+1} sur ${a.chapitres.length} · 📍 ${esc(c.lieu)}</p><p>${esc(c.scene)}</p><p><b>${esc(c.q)}</b></p>`;
    if(d.ok){
      h+=`<p class="ok">✔ Bonne réponse ! ${esc(c.e)}</p><p>🔎 <b>Indice :</b> ${esc(c.indice)}</p><button class="p" onclick="avSuiv()">${s.ch+1<a.chapitres.length?'Chapitre suivant ▶':'Terminer l’aventure'}</button>`;
    }else{
      if(d.msg)h+=`<p class="ko">${esc(d.msg)}</p>`;
      vue(c).o.forEach((t,i)=>{h+=`<button ${d.mauv&&d.mauv.includes(i)?'disabled style="opacity:.4"':''} onclick="avRep(${i})">${'ABCD'[i]} · ${esc(t)}</button>`});
      h+='<button class="s" onclick="avListe()">Reprendre plus tard</button>';
    }
    return h;
  }
  return {
    html:d=>d.kind==='avent'?html(d):null,
    bouton:()=>{const n=AVENTURES.filter(a=>st(a.id).fini).length;return `<button onclick="avListe()">🧭 Aventures · ${n} sur ${AVENTURES.length} terminées</button>`},
    actions:{
      avListe:()=>openBox({kind:'avent'}),
      avOuvrir:id=>openBox({kind:'avent',aid:id,etat:'intro'}),
      avGo:()=>{const d=G.dialog;d.etat='q';d.ok=false;d.mauv=[];d.msg='';renderDialog()},
      avRep:i=>{
        const d=G.dialog,a=find(d.aid),s=st(a.id),c=a.chapitres[s.ch];if(d.ok)return;
        if(i===vue(c).a){
          if(!d.mauv||!d.mauv.length){s.bonus++;gain(1,2,3)}else gain(0,1,1);
          d.ok=true;SFX.ok();save();renderDialog();return;
        }
        d.mauv=(d.mauv||[]).concat([i]);d.msg='Pas tout à fait : relis la scène et essaie une autre réponse !';SFX.ko();renderDialog();
      },
      avSuiv:()=>{
        const d=G.dialog,a=find(d.aid),s=st(a.id);
        if(s.ch+1<a.chapitres.length){s.ch++;d.ok=false;d.mauv=[];d.msg='';save();renderDialog();return}
        if(!s.fini){s.fini=true;s.ch=0;G.adv.coll[a.souvenir.id]=true;d.pieces=5;d.savoir=10;gain(5,10,10);save()}
        else{d.pieces=0;d.savoir=0}
        d.etat='fin';SFX.bravo();renderDialog();
      }
    }
  };
}
