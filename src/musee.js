// Musée virtuel du Congo : salles à visiter (fiches illustrées) et deux questions par salle.
// Première visite d'une salle : 1 pièce par bonne réponse + 1 pièce. Les six salles visitées donnent le « Passeport du musée » (collection).
import {SALLES} from './contenu/musee.js';
import {melanger,graine} from './melange.js';
const vue=q=>melanger(q,graine(q.q));

export function creerMusee(D){
  const {G,esc,save,gain,SFX,renderDialog,openBox}=D;
  const adv=()=>{const a=G.adv;if(!a.musee)a.musee={};if(!a.coll)a.coll={};return a};
  const nbVues=()=>SALLES.filter(s=>adv().musee[s.id]).length;
  function html(d){
    const s=SALLES.find(x=>x.id===d.sid);
    let h=`<h3>${s.ico} Salle : ${esc(s.nom)}</h3>`;
    if(d.etat==='fiches'){
      s.fiches.forEach(f=>{h+=`<div class="row" style="display:block;margin:6px 0;padding:8px;border:1px solid #e4d8b5;border-radius:10px"><b>${esc(f.t)}</b><br><span style="font-size:13px">${esc(f.txt)}</span></div>`});
      return h+`<button class="p" onclick="museeGo()">Tester mes connaissances (2 questions)</button><button class="s" onclick="closeDialog()">Fermer</button>`;
    }
    if(d.etat==='q'){
      const q=s.questions[d.k];
      h+=`<p style="font-size:12px;opacity:.7">Question ${d.k+1} sur ${s.questions.length}</p><p><b>${esc(q.q)}</b></p>`;
      if(d.rep===undefined)vue(q).o.forEach((t,i)=>{h+=`<button onclick="museeRep(${i})">${'ABCD'[i]} · ${esc(t)}</button>`});
      else{h+=d.rep===vue(q).a?`<p class="ok">✔ Bonne réponse ! ${esc(q.e)}</p>`:`<p class="ko">✖ Pas tout à fait. ${esc(q.e)}</p>`;h+=`<button class="p" onclick="museeSuiv()">${d.k+1<s.questions.length?'Question suivante ▶':'Terminer'}</button>`}
      return h;
    }
    h+=`<div style="font-size:48px;text-align:center">${d.nouveau?'🎉':'👍'}</div><p style="text-align:center"><b>${d.bon} bonne${d.bon>1?'s':''} réponse${d.bon>1?'s':''} sur ${s.questions.length}</b>`;
    h+=d.nouveau?`<br>+${d.pieces} 🪙</p>`:'<br>Salle déjà visitée : c’est pour t’entraîner.</p>';
    if(d.passeport)h+='<p style="text-align:center">🏅 <b>Passeport du musée obtenu !</b> Tu as visité les six salles. Il est dans tes collections.</p>';
    else h+=`<p style="text-align:center;font-size:13px">Salles visitées : ${nbVues()} sur ${SALLES.length}</p>`;
    return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
  }
  return {
    html:d=>d.kind==='salle'?html(d):null,
    nbVues,
    actions:{
      museeSalle:id=>openBox({kind:'salle',sid:id,etat:'fiches'}),
      museeGo:()=>{const d=G.dialog;d.etat='q';d.k=0;d.bon=0;d.rep=undefined;renderDialog()},
      museeRep:i=>{const d=G.dialog,q=SALLES.find(x=>x.id===d.sid).questions[d.k];if(d.rep!==undefined)return;d.rep=i;if(i===vue(q).a){d.bon++;SFX.ok()}else SFX.ko();renderDialog()},
      museeSuiv:()=>{
        const d=G.dialog,s=SALLES.find(x=>x.id===d.sid);
        if(d.k+1<s.questions.length){d.k++;d.rep=undefined;renderDialog();return}
        d.nouveau=!adv().musee[s.id];
        if(d.nouveau){d.pieces=d.bon+1;gain(d.pieces,d.bon*2,d.bon*3);adv().musee[s.id]=true;
          if(nbVues()===SALLES.length){adv().coll.hi_passeport=true;d.passeport=true}
          save()}
        d.etat='fin';SFX.bravo();renderDialog();
      }
    }
  };
}
