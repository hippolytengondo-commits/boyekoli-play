// Centre commercial : achat des matériaux de construction, bourse d'échange (vendre, troc) et boutiques (maison, mode).
// Prix d'achat : 2 × la valeur du bien ; prix de vente : la valeur du bien ; troc : valeur contre valeur, avec 10 % de frais.
import {RESS} from './minijeux.js';
import {bouts} from './interieurs.js';

export const MATERIAUX=['brique','bois','sable','ciment','fer','bitume','cuivre'];
export function creerCentre(D){
  const {G,esc,openBox,renderDialog,SFX,save,refreshHud,parler,openShop,boutiqueMode,changerEtage,animalerie}=D;
  const stock=()=>{const a=G.adv;if(!a.stock)a.stock={};return a.stock};
  const n=k=>stock()[k]||0;
  const prixAchat=k=>RESS[k].p*2;
  const lib=(k,q)=>(q>1&&RESS[k].n?RESS[k].n:RESS[k].n);
  const fr=x=>String(Math.round(x*10)/10).replace('.',',');
  const ligneStock=()=>Object.keys(RESS).filter(k=>n(k)>0).map(k=>n(k)+' '+RESS[k].e).join(' · ')||'vide';
  const sacRes=()=>`<p class="row"><span>Mes pièces</span><b>${G.adv.pieces} 🪙</b></p><p class="row"><span>Mon sac</span><b style="font-size:12px">${esc(ligneStock())}</b></p>`;
  const msg=d=>d.msg?`<p class="ok">${esc(d.msg)}</p>`:'';
  function vueMatos(d){
    let h='<h3>🧱 Quincaillerie : matériaux de construction</h3><p style="font-size:13px">Achète ici ce qu’il te faut pour construire. Prix : deux fois la valeur du bien.</p>'+sacRes()+msg(d);
    MATERIAUX.forEach(k=>{
      h+=`<div class="row" style="display:flex;align-items:center;gap:5px;margin:5px 0"><span style="flex:1">${RESS[k].e} ${esc(RESS[k].n)}<br><small>${prixAchat(k)} 🪙 pièce · en stock : ${n(k)}</small></span>`
        +[1,5,10].map(q=>`<button style="padding:6px 8px" class="${G.adv.pieces>=q*prixAchat(k)?'p':''}" onclick="ccAchat('${k}',${q})">×${q}</button>`).join('')+'</div>';
    });
    return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
  }
  function vueTroc(d){
    let h='<h3>🔁 Bourse d’échange</h3>'+sacRes()+msg(d);
    if(!d.mode||d.mode==='menu'){
      return h+'<p style="font-size:13px">Vends ce que tu as en abondance pour acheter ce dont tu as besoin, ou échange directement un bien contre un autre.</p><button class="p" onclick="ccMode(\'vendre\')">💰 Vendre mes biens</button><button class="p" onclick="ccMode(\'donner\')">🔁 Échanger un bien contre un autre</button><button class="s" onclick="closeDialog()">Fermer</button>';
    }
    if(d.mode==='vendre'){
      const K=Object.keys(RESS).filter(k=>n(k)>0);
      h+=K.length?'<h4>Vendre</h4>':'<p>Ton sac est vide : récolte des matériaux dans les lieux du jeu !</p>';
      K.forEach(k=>{h+=`<div class="row" style="display:flex;align-items:center;gap:5px;margin:5px 0"><span style="flex:1">${RESS[k].e} ${esc(RESS[k].n)} × ${n(k)}<br><small>${RESS[k].p} 🪙 pièce</small></span><button onclick="ccVendre('${k}',1)">1</button><button onclick="ccVendre('${k}',5)">5</button><button class="p" onclick="ccVendre('${k}',${n(k)})">Tout (+${n(k)*RESS[k].p} 🪙)</button></div>`});
      return h+'<button onclick="ccMode(\'menu\')">← Bourse</button>';
    }
    if(d.mode==='donner'){
      const K=Object.keys(RESS).filter(k=>n(k)>0);
      h+='<h4>Je donne…</h4>';
      h+=K.length?K.map(k=>`<button onclick="ccDonne('${k}')">${RESS[k].e} ${esc(RESS[k].n)} (${n(k)})</button>`).join(''):'<p>Ton sac est vide.</p>';
      return h+'<button onclick="ccMode(\'menu\')">← Bourse</button>';
    }
    if(d.mode==='recevoir'){
      h+=`<h4>Je donne ${RESS[d.give].e} ${esc(RESS[d.give].n)}… et je veux :</h4>`;
      Object.keys(RESS).filter(k=>k!==d.give).forEach(k=>{const r=RESS[d.give].p*.9/RESS[k].p;h+=`<button onclick="ccVeut('${k}')">${RESS[k].e} ${esc(RESS[k].n)} <small>(1 ${RESS[d.give].e} → ${fr(r)} ${RESS[k].e})</small></button>`});
      return h+'<button onclick="ccMode(\'donner\')">← Retour</button>';
    }
    // quantité
    const G1=d.give,G2=d.veut,rate=RESS[G1].p*.9/RESS[G2].p;
    h+=`<h4>${RESS[G1].e} ${esc(RESS[G1].n)} → ${RESS[G2].e} ${esc(RESS[G2].n)}</h4><p style="font-size:12px;opacity:.8">Taux : 1 ${RESS[G1].e} = ${fr(rate)} ${RESS[G2].e} (frais d’échange de 10 % inclus)</p>`;
    [1,5,10,n(G1)].filter((q,i,a)=>q>0&&q<=n(G1)&&a.indexOf(q)===i).forEach(q=>{const out=Math.floor(q*rate);h+=`<button class="${out>0?'p':''}" onclick="ccEchange(${q})">Donner ${q} ${RESS[G1].e} → recevoir ${out} ${RESS[G2].e}</button>`});
    return h+'<button onclick="ccMode(\'recevoir\')">← Retour</button>';
  }
  const actions={
    ccMatos:()=>{openBox({kind:'matos',msg:''});parler('Quincaillerie. Achète ici les briques, le bois, le sable, le ciment, le fer, le bitume et le cuivre pour tes chantiers.')},
    ccTroc:()=>{openBox({kind:'troc',mode:'menu',msg:''});parler('Bourse d’échange. Tu peux vendre ce que tu as en abondance, ou échanger un bien contre un autre.')},
    ccAchat:(k,q)=>{const d=G.dialog,c=q*prixAchat(k);
      if(G.adv.pieces<c){d.msg='Il te manque '+(c-G.adv.pieces)+' pièces pour acheter '+q+' '+RESS[k].n+'.';SFX.ko();renderDialog();return}
      G.adv.pieces-=c;stock()[k]=n(k)+q;save();refreshHud();SFX.coin();d.msg='Achat : '+q+' '+RESS[k].e+' '+RESS[k].n+' pour '+c+' 🪙.';renderDialog()},
    ccMode:m=>{const d=G.dialog;d.mode=m;d.msg='';renderDialog()},
    ccVendre:(k,q)=>{const d=G.dialog;q=Math.min(q,n(k));if(q<=0)return;stock()[k]=n(k)-q;const g=q*RESS[k].p;G.adv.pieces+=g;save();refreshHud();SFX.coin();d.msg='Vendu : '+q+' '+RESS[k].e+' pour '+g+' 🪙.';renderDialog()},
    ccDonne:k=>{const d=G.dialog;d.give=k;d.mode='recevoir';d.msg='';renderDialog()},
    ccVeut:k=>{const d=G.dialog;d.veut=k;d.mode='quantite';d.msg='';renderDialog()},
    ccEchange:q=>{const d=G.dialog,rate=RESS[d.give].p*.9/RESS[d.veut].p,out=Math.floor(q*rate);
      if(q>n(d.give)||out<=0){d.msg='Échange impossible : donne une quantité plus grande.';SFX.ko();renderDialog();return}
      stock()[d.give]=n(d.give)-q;stock()[d.veut]=n(d.veut)+out;save();SFX.bravo();
      d.msg='Échange réussi : '+q+' '+RESS[d.give].e+' contre '+out+' '+RESS[d.veut].e+'.';d.mode='menu';renderDialog()}
  };
  return {
    html:d=>d.kind==='matos'?vueMatos(d):d.kind==='troc'?vueTroc(d):null,
    spots(dim,niv){
      const W=dim.W,D2=dim.D,L=[],bt=bouts(W,D2);
      if(niv===1){
        MATERIAUX.forEach((k,i)=>L.push({x:-9.9+i*3.3,z:-D2/2+2.9,r:1.9,label:RESS[k].e+' Quincaillerie : acheter '+RESS[k].n,run:()=>actions.ccMatos()}));
        L.push({x:-6,z:1.7,r:2.6,label:'🔁 Bourse d’échange : vendre ou échanger',run:()=>actions.ccTroc()});
        L.push({x:bt.monter.x,z:bt.monter.z,r:1.6,label:'🔼 Escalator : monter à l’étage · boutiques',run:()=>changerEtage(+1)});
      }else{
        L.push({x:0,z:-D2/2+3,r:2.6,label:'🛍 Boutique de Maman Béa : meubles, mangues, vente',run:()=>{openShop();}});
        L.push({x:-8.5,z:-D2/2+3,r:2.4,label:'👗 Atelier mode : tenues et coiffures',run:()=>boutiqueMode()});
        L.push({x:8.5,z:-D2/2+3,r:2.4,label:'🐾 Animalerie : adopter un animal',run:()=>animalerie()});
        L.push({x:bt.descendre.x,z:bt.descendre.z,r:1.6,label:'🔽 Escalator : descendre au rez-de-chaussée',run:()=>changerEtage(-1)});
      }
      return L;
    },
    actions
  };
}
