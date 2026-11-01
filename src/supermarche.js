// Supermarché : visite des rayons et défis de courses (budget, comparaison de prix, calcul de la monnaie).
// Les questions sont fabriquées à partir des données : les bonnes réponses sont calculées, jamais écrites à la main.
import {RAYONS,COURSES} from './contenu/supermarche.js';

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

export function creerSupermarche(D){
  const {G,esc,save,gain,SFX,renderDialog,openBox}=D;
  const adv=()=>{const a=G.adv;if(!a.courses)a.courses={};return a};
  const prochain=()=>COURSES.findIndex((c,i)=>!adv().courses[i]);
  function vueRayon(d){
    const r=RAYONS.find(x=>x.id===d.rid);
    let h=`<h3>${r.ico} Rayon : ${esc(r.nom)}</h3><p style="font-size:13px">${esc(r.txt)} Les prix sont ceux du jeu, en pièces.</p>`;
    r.produits.forEach(p=>{h+=`<p class="row"><span>${esc(p.n)}</span><b>${p.p} 🪙</b></p>`});
    return h+`<p style="font-size:12px;opacity:.75">Astuce : un grand paquet n’est pas toujours le moins cher au kilo. Va à la caisse pour t’entraîner à comparer !</p><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  function vueCaisse(d){
    let h='<h3>🛒 Caisse : le défi des courses</h3>';
    const i=d.idx===undefined?prochain():d.idx;
    if(d.etat==='fin'){
      const nb=d.bon;
      h+=`<div style="font-size:48px;text-align:center">${d.nouveau?'🎉':'👍'}</div><p style="text-align:center"><b>${nb} bonne${nb>1?'s':''} réponse${nb>1?'s':''} sur 3</b>`;
      h+=d.nouveau?`<br>+${d.pieces} 🪙 · +${d.savoir} savoir</p>`:'<br>Défi déjà réussi : cette fois, c’est pour t’entraîner.</p>';
      h+=prochain()>=0?'<button class="p" onclick="supCaisse()">Défi suivant ▶</button>':'<p>🏅 Tu as réussi tous les défis du supermarché. Bravo, grand gestionnaire !</p>';
      return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
    }
    if(i<0&&d.etat===undefined)return h+'<p>🏅 Tu as réussi tous les défis du supermarché.</p><button class="p" onclick="supCaisse(0)">S’entraîner encore</button><button class="s" onclick="closeDialog()">Fermer</button>';
    const sc=COURSES[i],qs=questionsDe(sc,i);
    if(d.etat===undefined)return h+`<p><b>${esc(sc.t)}</b></p><p>Tu as un budget de <b>${sc.b} pièces</b>. Il y a 3 questions : calculer le total, la monnaie, puis comparer deux offres. Aucune pièce n’est dépensée : c’est un jeu pour apprendre à bien gérer un budget.</p><button class="p" onclick="supGo(${i})">Commencer</button><button class="s" onclick="closeDialog()">Plus tard</button>`;
    const q=qs[d.k];
    h+=`<p style="font-size:12px;opacity:.7">${esc(sc.t)} · question ${d.k+1} sur 3</p><p><b>${esc(q.q)}</b></p>`;
    if(d.rep===undefined)q.o.forEach((t,j)=>{h+=`<button onclick="supRep(${j})">${'ABCD'[j]} · ${esc(t)}</button>`});
    else{
      h+=d.rep===q.a?`<p class="ok">✔ Bonne réponse ! ${esc(q.e)}</p>`:`<p class="ko">✖ Pas tout à fait. ${esc(q.e)}</p>`;
      h+=`<button class="p" onclick="supSuiv()">${d.k<2?'Question suivante ▶':'Terminer'}</button>`;
    }
    return h;
  }
  function html(d){if(d.kind==='rayon')return vueRayon(d);if(d.kind==='caisse')return vueCaisse(d);return null}
  return {
    html,
    actions:{
      supRayon:id=>openBox({kind:'rayon',rid:id}),
      supCaisse:i=>{openBox({kind:'caisse',idx:i})},
      supGo:i=>{const d=G.dialog;d.idx=i;d.etat='q';d.k=0;d.bon=0;d.rep=undefined;renderDialog()},
      supRep:j=>{const d=G.dialog,q=questionsDe(COURSES[d.idx],d.idx)[d.k];if(d.rep!==undefined)return;d.rep=j;if(j===q.a){d.bon++;SFX.ok()}else SFX.ko();renderDialog()},
      supSuiv:()=>{
        const d=G.dialog;
        if(d.k<2){d.k++;d.rep=undefined;renderDialog();return}
        d.nouveau=!adv().courses[d.idx];
        if(d.nouveau){d.pieces=d.bon+1;d.savoir=d.bon*3;gain(d.pieces,d.bon*2,d.savoir);adv().courses[d.idx]=true;save()}
        d.etat='fin';d.idx=undefined;SFX.bravo();renderDialog();
      }
    }
  };
}
