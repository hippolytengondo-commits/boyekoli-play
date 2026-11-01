// Musée virtuel du Congo : cinq niveaux reliés par un escalator. Chaque niveau expose des tableaux (photos libres de droits ou illustrations),
// lus à voix haute, et propose un quiz dans la salle de réponses. Les cinq quiz réussis donnent le « Passeport du musée ».
import {NIVEAUX} from './contenu/musee.js';
import {emplacementTableau} from './interieurs.js';

export function creerMusee(D){
  const {G,esc,toast,openBox,parler,quiz3D,changerEtage}=D;
  const adv=()=>{const a=G.adv;if(!a.coll)a.coll={};return a};
  const faitQuiz=n=>!!adv().done['mus:'+n.id];
  const nbQuiz=()=>NIVEAUX.filter(faitQuiz).length;
  function passeport(){
    if(nbQuiz()===NIVEAUX.length&&!adv().coll.hi_passeport){adv().coll.hi_passeport=true;D.save();toast('🎫 Passeport du musée obtenu ! Il est dans tes collections.')}
  }
  function spots(dim){
    const W=dim.W,D2=dim.D,k=Math.max(1,Math.min(NIVEAUX.length,G.int.n||1)),niv=NIVEAUX[k-1],L=[];
    niv.expos.forEach((e,i)=>{
      const p=emplacementTableau(i,W,D2),sx=p.ry?1.6:0,sz=p.ry?0:1.6;
      L.push({x:p.x+sx,z:p.z+sz,r:1.5,label:(e.ico||'🏛')+' Voir : '+e.titre,run:()=>{openBox({kind:'expo',nid:niv.id,eid:e.id});parler(e.titre+'. '+e.txt)}});
    });
    L.push({x:0,z:.6,r:1.9,label:'🎯 Quiz du niveau : '+niv.nom+(faitQuiz(niv)?' (réussi ✔)':''),run:()=>lancerQuiz(niv)});
    const ex=W/2-1.7;
    if(k<NIVEAUX.length)L.push({x:ex,z:D2/2-1.4,r:1.5,label:'🔼 Escalator : monter au niveau '+(k+1)+' · '+NIVEAUX[k].nom,run:()=>changerEtage(+1)});
    if(k>1)L.push({x:ex,z:D2/2-3.6,r:1.5,label:'🔽 Escalator : descendre au niveau '+(k-1),run:()=>changerEtage(-1)});
    if(k===1)L.push({x:-W/2+1.8,z:D2/2-2,r:1.8,label:'📷 Crédits des photos',run:()=>openBox({kind:'credits'})});
    passeport();
    return L;
  }
  function lancerQuiz(niv){
    quiz3D({cle:'mus:'+niv.id,titre:'Musée · '+niv.nom,intro:'Quiz du musée : '+niv.nom+'. Tu as visité les tableaux de ce niveau, montre ce que tu as retenu !',qs:niv.quiz});
  }
  function html(d){
    if(d.kind==='credits'){
      let h='<h3>📷 Crédits des photos</h3><p style="font-size:13px">Les photos du musée proviennent de Wikimedia Commons et sont libres de droits (domaine public ou licences libres). Nous remercions leurs auteurs.</p>';
      NIVEAUX.forEach(n=>n.expos.filter(e=>e.img&&e.credit).forEach(e=>{h+=`<p style="font-size:12px;margin:6px 0"><b>${esc(e.titre)}</b> · ${esc(e.credit.auteur)} · ${esc(e.credit.licence)}<br><span style="opacity:.7">${esc(e.credit.source)}</span></p>`}));
      return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
    }
    const niv=NIVEAUX.find(n=>n.id===d.nid),e=niv.expos.find(x=>x.id===d.eid);
    let h=`<h3>${e.ico||'🏛'} ${esc(e.titre)}</h3><p style="font-size:12px;opacity:.7">${esc(niv.nom)}</p>`;
    if(e.img)h+=`<img src="${esc(e.img)}" alt="${esc(e.titre)}" style="max-width:100%;max-height:260px;border-radius:12px;display:block;margin:8px auto" onerror="this.style.display='none'">`;
    else h+=`<div style="font-size:84px;text-align:center">${e.ico||'🏛'}</div>`;
    h+=`<p>${esc(e.txt)}</p>`;
    if(e.credit)h+=`<p style="font-size:11px;opacity:.65">Photo : ${esc(e.credit.auteur)} · ${esc(e.credit.licence)}</p>`;
    return h+`<button onclick="museeLire()">🔊 Réécouter</button><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  return {
    html:d=>(d.kind==='expo'||d.kind==='credits')?html(d):null,
    spots,
    onOpen:d=>{if(d.kind==='expo'){const niv=NIVEAUX.find(n=>n.id===d.nid),e=niv.expos.find(x=>x.id===d.eid);parler(e.titre+'. '+e.txt)}},
    actions:{museeLire:()=>{const d=G.dialog;if(d&&d.kind==='expo'){const niv=NIVEAUX.find(n=>n.id===d.nid),e=niv.expos.find(x=>x.id===d.eid);parler(e.titre+'. '+e.txt,true)}}}
  };
}
