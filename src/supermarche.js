// Supermarché : visite des rayons et défis de courses (budget, comparaison de prix, calcul de la monnaie).
// Les questions sont fabriquées à partir des données : les bonnes réponses sont calculées, jamais écrites à la main.
import {RAYONS,COURSES,NIVEAUX_SUPER} from './contenu/supermarche.js';

const fr=n=>String(Math.round(n*100)/100).replace('.',',');
function melangerSeed(a,seed){const r=a.slice();let s=seed*2654435761%4294967296||1;for(let i=r.length-1;i>0;i--){s=(s*1664525+1013904223)%4294967296;const j=s%(i+1);[r[i],r[j]]=[r[j],r[i]]}return r}
function options(bonne,seed,fmt){
  const c=new Set([bonne]);[1,-1,5,10,-5,2].forEach(d=>{if(c.size<4&&bonne+d>=0)c.add(bonne+d)});
  const l=melangerSeed([...c],seed);return {o:l.map(fmt),a:l.indexOf(bonne)};
}
export function questionsDe(sc,idx){
  const total=sc.a.reduce((s,x)=>s+x[1]*x[2],0),monnaie=sc.b-total;
  const [A,B]=sc.comp,ua=A[1]/A[2],ub=B[1]/B[2];
  const q1=options(total,idx*3+1,v=>v+(v>1?' pièces':' pièce')),q2=options(monnaie,idx*3+2,v=>v+(v>1?' pièces':' pièce'));
  const noms=[A[0],B[0]];
  const bien=ua<ub?0:1;
  const rest=melangerSeed([0,1,2,3],idx*3+3);
  const optsC=['Les deux offres reviennent au même prix','Impossible à savoir',noms[0],noms[1]];
  const ordre=melangerSeed(optsC.map((_,i)=>i),idx*5+7);
  return [
    {q:'Voici ta liste : '+sc.a.map(x=>x[2]+' × '+x[0]+' à '+x[1]+' pièce'+(x[1]>1?'s':'')).join(', ')+'. Combien coûtent tous ces articles ?',o:q1.o,a:q1.a,e:'On additionne chaque article : '+sc.a.map(x=>x[2]+' × '+x[1]).join(' + ')+' = '+total+' pièces.'},
    {q:'Tu as '+sc.b+' pièces pour payer '+total+' pièces d’articles. Combien la caissière te rend-elle ?',o:q2.o,a:q2.a,e:sc.b+' − '+total+' = '+monnaie+' pièces de monnaie.'},
    {q:'Quelle offre est la moins chère pour 1 '+A[3]+' : « '+A[0]+' » à '+A[1]+' pièces, ou « '+B[0]+' » à '+B[1]+' pièces ?',o:ordre.map(i=>optsC[i]),a:ordre.indexOf(2+bien),e:A[0]+' : '+fr(A[1])+' ÷ '+fr(A[2])+' = '+fr(ua)+' pièce par '+A[3]+'. '+B[0]+' : '+fr(B[1])+' ÷ '+fr(B[2])+' = '+fr(ub)+' pièce par '+A[3]+'. La moins chère est « '+noms[bien]+' ».'}
  ];
}

import {bouts} from './interieurs.js';
export function creerSupermarche(D){
  const {G,esc,openBox,parler,quiz3D,depenser,toast,SFX,renderDialog,changerEtage}=D;
  const A=()=>{const a=G.adv;if(!a.panier)a.panier={};if(!a.provisions)a.provisions={};return a};
  const faits=()=>COURSES.map((c,i)=>!!G.adv.done['sup:'+i]);
  const prods=()=>{const m={};RAYONS.forEach(r=>r.produits.forEach(p=>{m[p.n]=p}));return m};
  const lignes=()=>Object.keys(A().panier).filter(k=>A().panier[k]>0).map(k=>({n:k,q:A().panier[k],p:prods()[k]?prods()[k].p:0}));
  const total=()=>lignes().reduce((t,l)=>t+l.q*l.p,0);
  const nbArt=()=>lignes().reduce((t,l)=>t+l.q,0);
  const plur=n=>n>1?' pièces':' pièce';
  const texteRayon=r=>'Rayon '+r.nom+'. '+r.txt+' '+r.produits.map(p=>p.n+' : '+p.p+plur(p.p)).join('. ')+'.';
  function barre(){return `<p class="row"><span>🧺 Mon panier</span><b>${nbArt()} article${nbArt()>1?'s':''} · ${total()} 🪙</b></p><p class="row"><span>Mes pièces</span><b>${G.adv.pieces} 🪙</b></p>`}
  function vueRayon(d){
    const r=RAYONS.find(x=>x.id===d.rid);
    let h=`<h3>${r.ico} Rayon : ${esc(r.nom)}</h3><p style="font-size:13px">${esc(r.txt)} Ajoute tes articles au panier, puis paie à la caisse.</p>`+barre();
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    r.produits.forEach((p,i)=>{const q=A().panier[p.n]||0;
      h+=`<div class="row" style="display:flex;align-items:center;gap:6px;margin:5px 0"><span style="flex:1">${esc(p.n)}<br><small>${p.p} 🪙</small></span><button style="width:42px" onclick="supMoins(${i})">−</button><b style="min-width:24px;text-align:center">${q}</b><button class="p" style="width:42px" onclick="supPlus(${i})">+</button></div>`});
    return h+`<button onclick="supLire()">🔊 Réécouter</button><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  function vueCaisse(d){
    let h='<h3>🛒 Caisse</h3>'+barre();
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    const L=lignes();
    if(d.ticket){
      h+=`<div style="border:1px dashed #999;border-radius:10px;padding:8px;margin:6px 0;font-size:13px"><b>Ticket de caisse</b><br>`+d.ticket.lignes.map(l=>`${l.q} × ${esc(l.n)} = ${l.q*l.p} 🪙`).join('<br>')+`<br><b>Total : ${d.ticket.total} 🪙</b> · Il te reste ${d.ticket.reste} 🪙</div>`;
    }
    if(L.length){
      L.forEach(l=>{h+=`<p class="row"><span>${l.q} × ${esc(l.n)}</span><b>${l.q*l.p} 🪙</b></p>`});
      const ok=G.adv.pieces>=total();
      h+=`<button class="${ok?'p':''}" onclick="supPayer()">💳 Payer ${total()} 🪙${ok?'':' — il te manque '+(total()-G.adv.pieces)+' 🪙'}</button><button onclick="supVider()">Vider mon panier</button>`;
    }else h+='<p style="font-size:13px">Ton panier est vide. Parcours les rayons (escalator pour changer de niveau) et ajoute tes articles avec le bouton +.</p>';
    h+='<button onclick="supDefi()">🎯 Défi des courses (budget)</button><button onclick="supProv()">🧺 Mes provisions</button><button class="s" onclick="closeDialog()">Fermer</button>';
    return h;
  }
  function vueProv(){
    const P=A().provisions,K=Object.keys(P).filter(k=>P[k]>0);
    let h='<h3>🧺 Mes provisions</h3>';
    h+=K.length?K.map(k=>`<p class="row"><span>${esc(k)}</span><b>× ${P[k]}</b></p>`).join('')+'<p style="font-size:12px;opacity:.75">Ces provisions sont à toi. Elles serviront dans les prochaines activités du jeu (cuisine, ferme, cantine de l’école).</p>':'<p>Tu n’as pas encore fait d’achats au supermarché.</p>';
    return h+'<button onclick="supCaisse()">← Caisse</button><button class="s" onclick="closeDialog()">Fermer</button>';
  }
  function defi(){
    const f=faits();let i=f.findIndex(x=>!x);
    if(i<0)i=Math.floor(Date.now()/86400000)%COURSES.length;
    const sc=COURSES[i];
    quiz3D({cle:'sup:'+i,titre:'Supermarché · '+sc.t,intro:'Défi des courses : '+sc.t+'. Tu as un budget de '+sc.b+' pièces. Calcule le total, la monnaie, puis compare deux offres. Aucune pièce n’est dépensée : c’est pour apprendre à gérer un budget.',
      qs:questionsDe(sc,i).map(q=>({q:q.q,c:q.o,a:q.a,exp:q.e}))});
  }
  const maj=()=>renderDialog();
  const api={
    html:d=>d.kind==='rayon'?vueRayon(d):d.kind==='caisse'?vueCaisse(d):d.kind==='prov'?vueProv(d):null,
    spots(dim){
      const k=Math.max(1,Math.min(NIVEAUX_SUPER.length,G.int.n||1)),niv=NIVEAUX_SUPER[k-1],W=dim.W,D2=dim.D,L=[];
      niv.rayons.forEach((r,i)=>L.push({x:-6.8+i*6.8,z:-D2/2+2.9,r:2.3,label:'Rayon '+r.nom+' : voir et acheter',run:()=>actions.supRayon(r.id)}));
      if(k===1)L.push({x:-.6,z:1.9,r:2.6,label:'Caisse : payer mes achats',run:()=>{openBox({kind:'caisse'})}});
      const bt=bouts(W,D2);
      if(k<NIVEAUX_SUPER.length)L.push({x:bt.monter.x,z:bt.monter.z,r:1.6,label:'🔼 Escalator : monter au niveau '+(k+1)+' · '+NIVEAUX_SUPER[k].nom,run:()=>changerEtage(+1)});
      if(k>1)L.push({x:bt.descendre.x,z:bt.descendre.z,r:1.6,label:'🔽 Escalator : descendre au niveau '+(k-1),run:()=>changerEtage(-1)});
      return L;
    }
  };
  const actions={
      supRayon:id=>{openBox({kind:'rayon',rid:id,msg:''});parler(texteRayon(RAYONS.find(x=>x.id===id)))},
      supLire:()=>{const d=G.dialog;if(d&&d.kind==='rayon')parler(texteRayon(RAYONS.find(x=>x.id===d.rid)),true)},
      supPlus:i=>{const d=G.dialog,r=RAYONS.find(x=>x.id===d.rid),p=r.produits[i];A().panier[p.n]=(A().panier[p.n]||0)+1;d.msg='';SFX.coin();maj()},
      supMoins:i=>{const d=G.dialog,r=RAYONS.find(x=>x.id===d.rid),p=r.produits[i];if(A().panier[p.n]>0)A().panier[p.n]--;maj()},
      supCaisse:()=>openBox({kind:'caisse'}),
      supVider:()=>{G.adv.panier={};G.dialog.msg='Panier vidé.';maj()},
      supProv:()=>openBox({kind:'prov'}),
      supDefi:()=>defi(),
      supPayer:()=>{
        const L=lignes(),t=total(),d=G.dialog;if(!L.length)return;
        if(G.adv.pieces<t){d.msg='Il te manque '+(t-G.adv.pieces)+' pièces : retire des articles ou gagne des pièces en répondant juste.';SFX.ko();maj();return}
        depenser(t);L.forEach(l=>{A().provisions[l.n]=(A().provisions[l.n]||0)+l.q});
        d.ticket={lignes:L,total:t,reste:G.adv.pieces};G.adv.panier={};d.msg='Merci pour tes achats !';SFX.bravo();
        parler('Merci pour tes achats. Tu as dépensé '+t+(t>1?' pièces':' pièce')+'. Il te reste '+G.adv.pieces+(G.adv.pieces>1?' pièces.':' pièce.'));maj();
      }
  };
  return Object.assign(api,{actions});
}
