// Enrichissement de l'univers, étape 1 : collections et badges, surprise du jour, événement du jour.
// Tout est préprogrammé (src/contenu/*.js) : aucun service externe, aucun hasard, aucune dépense obligatoire.
import {COLLECTIONS} from './contenu/collections.js';
import {EVENEMENTS} from './contenu/evenements.js';
import {SURPRISES} from './contenu/surprises.js';

// ordre dans lequel les missions réussies débloquent les objets (un objet toutes les 3 missions) : on alterne les collections
const SEQ=[];
{const max=Math.max(...COLLECTIONS.map(c=>c.objets.length));for(let i=0;i<max;i++)COLLECTIONS.forEach(c=>{if(c.objets[i]&&!c.objets[i].special)SEQ.push(c.objets[i].id)})}
const TOUS={};COLLECTIONS.forEach(c=>c.objets.forEach(o=>{TOUS[o.id]=o}));
const p2=n=>String(n).padStart(2,'0');

export function creerEnrichissement(D){
  const {G,esc,toast,save,gain,SFX,renderDialog,openBox,openMenu,PROVS,slugTr}=D;
  const adv=()=>{const a=G.adv;if(!a.coll)a.coll={};return a};
  const aujourdhui=()=>{const d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
  const jourIndex=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000)};
  const nbMissions=()=>Object.keys(adv().done||{}).filter(k=>adv().done[k]&&!/^(pv|tr)_/.test(k)).length;
  const parMissions=()=>new Set(SEQ.slice(0,Math.floor(nbMissions()/3)));
  const possede=id=>!!(adv().coll[id]||parMissions().has(id));
  // la collection « provinces » se remplit en explorant les provinces
  const provinces=()=>({id:'provinces',nom:'Provinces congolaises',ico:'🗺',objets:[{id:'pv_kinshasa',ico:'🏙',nom:'Kinshasa',txt:'La capitale, ville-province : on l’obtient dès ta première mission réussie.'}].concat(PROVS.map(p=>({id:'pv_'+slugTr(p),ico:'🗺',nom:p,txt:'Province explorée : tu as terminé sa mission d’exploration.'}))),auto:true});
  const colls=()=>COLLECTIONS.concat([provinces()]);
  const ok=(c,o)=>c.auto?(!!adv().done[o.id]||(o.id==='pv_kinshasa'&&nbMissions()>=1)):possede(o.id);
  const stat=c=>{const n=c.objets.filter(o=>ok(c,o)).length;return {n:n,t:c.objets.length,fini:n===c.objets.length&&c.objets.length>0}};
  const nbBadges=()=>colls().filter(c=>stat(c).fini).length;
  // prochain objet que l'enfant n'a pas encore, à partir d'une position qui dépend du jour
  function prochainObjet(){
    const off=jourIndex()%SEQ.length;
    for(let i=0;i<SEQ.length;i++){const id=SEQ[(off+i)%SEQ.length];if(!possede(id))return TOUS[id]}
    return null;
  }
  function donner(o){if(!o)return;adv().coll[o.id]=true;save()}
  const retourMenu='<button class="s" onclick="enMenu()">← Menu</button>';

  // ---------- collections ----------
  function vueColl(d){
    let h='<h3>🎒 Mes collections</h3><p style="font-size:13px">Chaque objet trouvé s’ajoute à ta collection. Une collection complète donne un badge. Tu en trouves en réussissant des missions, en explorant les provinces, avec la surprise du jour et les événements de la semaine.</p>';
    h+=`<p class="row"><span>Badges obtenus</span><b>${nbBadges()} 🏅</b></p>`;
    colls().forEach(c=>{
      const s=stat(c),pc=Math.round(100*s.n/Math.max(1,s.t));
      h+=`<button onclick="enCollDet('${c.id}')">${c.ico} ${esc(c.nom)} ${s.fini?'🏅':''}<br><small>${s.n} sur ${s.t}</small><div style="height:6px;border-radius:4px;background:#ddd;margin-top:4px;overflow:hidden"><div style="height:100%;width:${pc}%;background:${s.fini?'#e0a526':'#2a9d5c'}"></div></div></button>`;
    });
    return h+retourMenu;
  }
  function vueCollDet(d){
    const c=colls().find(x=>x.id===d.cid),s=stat(c);
    let h=`<h3>${c.ico} ${esc(c.nom)}</h3><p class="row"><span>Progression</span><b>${s.n} sur ${s.t}${s.fini?' · 🏅 Badge !':''}</b></p>`;
    c.objets.forEach(o=>{
      const a=ok(c,o);
      h+=a?`<div class="row" style="display:block;margin:6px 0;padding:8px;border:1px solid #e4d8b5;border-radius:10px"><b>${o.ico} ${esc(o.nom)}</b><br><span style="font-size:13px">${esc(o.txt)}</span></div>`
         :`<div class="row" style="display:block;margin:6px 0;padding:8px;border:1px dashed #cfc6b2;border-radius:10px;opacity:.65"><b>❓ ${c.auto?esc(o.nom):'À découvrir'}</b>${c.auto?'<br><span style="font-size:12px">Termine sa mission d’exploration pour l’obtenir.</span>':''}</div>`;
    });
    return h+'<button onclick="enColl()">← Collections</button>'+retourMenu;
  }

  // ---------- surprise du jour ----------
  const surpriseDuJour=()=>SURPRISES[jourIndex()%SURPRISES.length];
  const surpriseOuverte=()=>!!(adv().surp&&adv().surp.jour===aujourdhui()&&adv().surp.fini);
  function vueSurp(d){
    const s=surpriseDuJour();
    if(!d.etat)d.etat=surpriseOuverte()?'fait':'intro';
    let h='<h3>🎁 Surprise du jour</h3>';
    if(d.etat==='fait')return h+`<p>✔ Tu as déjà ouvert la surprise d’aujourd’hui.</p><p style="font-size:13px">Reviens demain : une nouvelle surprise t’attendra !</p><button onclick="enColl()">🎒 Voir mes collections</button>`+retourMenu;
    if(d.etat==='intro')return h+`<div style="font-size:64px;text-align:center">✉️</div><p style="text-align:center"><b>Bonjour explorateur !</b><br>Une surprise t’attend dans ton univers. Sauras-tu la découvrir ?</p><button class="p" onclick="enSurpOuvrir()">Ouvrir l’enveloppe</button><button class="s" onclick="closeDialog()">Plus tard</button>`;
    if(d.etat==='question'){
      h+=`<p><b>${esc(s.titre)}</b></p><p>${esc(s.q)}</p>`;
      if(d.msg)h+=`<p class="ko">${esc(d.msg)}</p>`;
      s.o.forEach((t,i)=>{h+=`<button ${d.mauv&&d.mauv.includes(i)?'disabled style="opacity:.4"':''} onclick="enSurpRep(${i})">${'ABCD'[i]} · ${esc(t)}</button>`});
      return h+`<button class="s" onclick="closeDialog()">Plus tard</button>`;
    }
    // résultat : on révèle l'objet
    const o=d.objet;
    h+=`<p><b>${esc(s.titre)}</b></p>`;
    if(s.t==='enigme')h+=`<p class="ok">✔ Bravo ! ${esc(s.e)}</p>`;else h+=`<p>${esc(s.txt)}</p>`;
    h+=o?`<div style="text-align:center;font-size:56px">${o.ico}</div><p style="text-align:center"><b>Nouvel objet : ${esc(o.nom)}</b><br><span style="font-size:13px">${esc(o.txt)}</span></p>`:'<p style="text-align:center">🏅 Tu as déjà tous les objets de collection. Bravo, grand explorateur !</p>';
    return h+`<button class="p" onclick="enColl()">🎒 Voir mes collections</button><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  function surpOuvrir(){
    const d=G.dialog,s=surpriseDuJour();
    if(s.t==='enigme'){d.etat='question';d.msg='';d.mauv=[];renderDialog();return}
    terminerSurprise(d);
  }
  function terminerSurprise(d){
    const o=prochainObjet();donner(o);adv().surp={jour:aujourdhui(),fini:true};save();
    d.etat='resultat';d.objet=o;SFX.bravo();renderDialog();
  }
  function surpRep(i){
    const d=G.dialog,s=surpriseDuJour();if(d.etat!=='question')return;
    if(i===s.a){terminerSurprise(d);return}
    d.mauv=(d.mauv||[]).concat([i]);d.msg='Pas tout à fait : essaie une autre réponse !';SFX.ko();renderDialog();
  }

  // ---------- événement du jour ----------
  const evenementDuJour=()=>EVENEMENTS.find(e=>e.jour===new Date().getDay());
  const evenementFait=()=>!!(adv().evt&&adv().evt.jour===aujourdhui()&&adv().evt.fini);
  function vueEvt(d){
    const e=evenementDuJour();
    let h=`<h3>${e.ico} ${esc(e.titre)}</h3>`;
    if(evenementFait()&&!d.etat)return h+`<p>✔ Tu as relevé le défi d’aujourd’hui.</p><p style="font-size:13px">Reviens demain pour un nouvel événement !</p>`+retourMenu;
    if(!d.etat)d.etat='intro';
    if(d.etat==='intro')return h+`<p>${esc(e.accueil)}</p><p style="font-size:13px">${e.questions.length} questions. Chaque bonne réponse te rapporte 1 pièce, et tu en gagnes 1 de plus pour avoir terminé.${e.objet?' Tu reçois aussi un objet de collection.':''} Pas de pression : tu peux te tromper, on t’explique la réponse.</p><button class="p" onclick="enEvtGo()">Relever le défi</button>`+retourMenu;
    if(d.etat==='q'){
      const q=e.questions[d.i];
      h+=`<p style="font-size:12px;opacity:.7">Question ${d.i+1} sur ${e.questions.length}</p><p><b>${esc(q.q)}</b></p>`;
      if(d.rep===undefined)q.o.forEach((t,i)=>{h+=`<button onclick="enEvtRep(${i})">${'ABCD'[i]} · ${esc(t)}</button>`});
      else{
        h+=d.rep===q.a?`<p class="ok">✔ Bonne réponse ! ${esc(q.e)}</p>`:`<p class="ko">✖ Ce n’est pas ça. La bonne réponse : <b>${esc(q.o[q.a])}</b>. ${esc(q.e)}</p>`;
        h+=`<button class="p" onclick="enEvtSuiv()">${d.i+1<e.questions.length?'Question suivante ▶':'Terminer'}</button>`;
      }
      return h;
    }
    // fin
    h+=`<div style="font-size:48px;text-align:center">🎉</div><p style="text-align:center"><b>${d.bon} bonne${d.bon>1?'s':''} réponse${d.bon>1?'s':''} sur ${e.questions.length}</b><br>+${d.pieces} 🪙 · +${d.savoir} savoir</p>`;
    if(d.objet)h+=`<div style="text-align:center;font-size:48px">${d.objet.ico}</div><p style="text-align:center"><b>Nouvel objet : ${esc(d.objet.nom)}</b></p>`;
    return h+`<button class="p" onclick="closeDialog()">Super !</button>`+retourMenu;
  }
  function evtGo(){const d=G.dialog;d.etat='q';d.i=0;d.bon=0;d.rep=undefined;renderDialog()}
  function evtRep(i){
    const d=G.dialog,q=evenementDuJour().questions[d.i];if(d.rep!==undefined)return;
    d.rep=i;if(i===q.a){d.bon++;SFX.ok()}else SFX.ko();renderDialog();
  }
  function evtSuiv(){
    const d=G.dialog,e=evenementDuJour();
    if(d.i+1<e.questions.length){d.i++;d.rep=undefined;renderDialog();return}
    d.pieces=d.bon+1;d.savoir=d.bon*3;
    if(!evenementFait()){
      gain(d.pieces,d.bon*2,d.savoir);
      adv().evt={jour:aujourdhui(),fini:true};
      if(e.objet){const o=prochainObjet();donner(o);d.objet=o}
      save();
    }
    d.etat='fin';SFX.bravo();renderDialog();
  }

  // ---------- accès depuis le menu ----------
  const aOuvrir=()=>({surprise:!surpriseOuverte(),evenement:!evenementFait()});
  return {
    html(d){
      if(d.kind==='coll')return d.cid?vueCollDet(d):vueColl(d);
      if(d.kind==='surp')return vueSurp(d);
      if(d.kind==='evt')return vueEvt(d);
      return null;
    },
    aOuvrir,evenementDuJour,nbBadges,
    boutons(){
      const a=aOuvrir(),e=evenementDuJour(),sb=nbBadges();
      return `<button onclick="enColl()">🎒 Mes collections${sb?' · '+sb+' 🏅':''}</button>`
        +`<button onclick="enSurp()">🎁 Surprise du jour${a.surprise?' · nouvelle !':' · ouverte ✔'}</button>`
        +`<button onclick="enEvt()">${e.ico} ${esc(e.titre)}${a.evenement?'':' · fait ✔'}</button>`;
    },
    actions:{
      enColl:()=>{openBox({kind:'coll'})},
      enCollDet:id=>{G.dialog.cid=id;renderDialog()},
      enSurp:()=>openBox({kind:'surp'}),
      enSurpOuvrir:surpOuvrir,enSurpRep:surpRep,
      enEvt:()=>openBox({kind:'evt'}),enEvtGo:evtGo,enEvtRep:evtRep,enEvtSuiv:evtSuiv,
      enMenu:()=>openBox({kind:'menu'})
    }
  };
}
