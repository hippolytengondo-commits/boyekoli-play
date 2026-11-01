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
  const {G,esc,openBox,parler,quiz3D}=D;
  const faits=()=>COURSES.map((c,i)=>!!G.adv.done['sup:'+i]);
  function vueRayon(d){
    const r=RAYONS.find(x=>x.id===d.rid);
    let h=`<h3>${r.ico} Rayon : ${esc(r.nom)}</h3><p style="font-size:13px">${esc(r.txt)} Les prix sont ceux du jeu, en pièces.</p>`;
    r.produits.forEach((p,i)=>{h+=`<p class="row"><span>${esc(p.n)}</span><b>${p.p} 🪙</b></p>`});
    return h+`<p style="font-size:12px;opacity:.75">Astuce : un grand paquet n’est pas toujours le moins cher au kilo. Va à la caisse pour t’entraîner à comparer !</p><button onclick="supLire()">🔊 Réécouter</button><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  const texteRayon=r=>'Rayon '+r.nom+'. '+r.txt+' '+r.produits.map(p=>p.n+' : '+p.p+(p.p>1?' pièces':' pièce')).join('. ')+'.';
  function caisse(){
    const f=faits();let i=f.findIndex(x=>!x);
    if(i<0)i=Math.floor(Date.now()/86400000)%COURSES.length;       // tout est réussi : on s'entraîne avec le défi du jour
    const sc=COURSES[i];
    quiz3D({cle:'sup:'+i,titre:'Supermarché · '+sc.t,intro:'Défi des courses : '+sc.t+'. Tu as un budget de '+sc.b+' pièces. Calcule le total, la monnaie, puis compare deux offres. Aucune pièce n’est dépensée : c’est pour apprendre à gérer un budget.',
      qs:questionsDe(sc,i).map(q=>({q:q.q,c:q.o,a:q.a,exp:q.e}))});
  }
  return {
    html:d=>d.kind==='rayon'?vueRayon(d):null,
    caisse,
    actions:{
      supRayon:id=>{openBox({kind:'rayon',rid:id});parler(texteRayon(RAYONS.find(x=>x.id===id)))},
      supLire:()=>{const d=G.dialog;if(d&&d.kind==='rayon')parler(texteRayon(RAYONS.find(x=>x.id===d.rid)),true)}
    }
  };
}
