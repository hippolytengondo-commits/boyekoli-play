// Pôle des métiers : enquêtes, laboratoire, hôpital, décoration, mode, ville, musique, pilotage (dossiers de quiz)
// + ferme (agriculture et élevage) + boutique du joueur (vente avec rendu de monnaie). Tout est préprogrammé, sans IA.
import {MODULES,GUIDES,CULTURES,ELEVAGE} from './contenu/metiers.js';

export function creerMetiers(D){
  const {G,esc,openBox,renderDialog,SFX,save,refreshHud,parler,quiz3D}=D;
  const A=()=>G.adv;
  const ferme=()=>{const a=A();if(!a.ferme)a.ferme={parc:[null,null,null,null],poule:0,chevre:0,tp:Date.now(),tc:Date.now(),stock:{}};
    const f=a.ferme;if(!f.stock)f.stock={};return f};
  const msg=d=>d.msg?`<p class="ok">${esc(d.msg)}</p>`:'';
  const pieces=()=>`<p class="row"><span>Mes pièces</span><b>${A().pieces} 🪙</b></p>`;
  const mod=id=>MODULES.find(m=>m.id===id);
  const nbFaits=m=>m.dossiers.filter(x=>A().done['met:'+x.id]).length;
  const CAP=6;
  // temps restant (secondes) d'une parcelle
  const restant=p=>p?Math.max(0,CULTURES[p.c].min*60-(Date.now()-p.t)/1000-p.arr*30):0;
  const fmt=s=>s<=0?'prêt':(s>=60?Math.floor(s/60)+' min ':'')+Math.ceil(s%60)+' s';
  // produits d'élevage accumulés (plafonnés)
  function majElevage(){const f=ferme(),now=Date.now();
    const calc=(n,min,k,tk)=>{if(n<=0){f[tk]=now;return}const dt=(now-(f[tk]||now))/60000;const q=Math.floor(dt/min*n);if(q>0){f.stock[k]=Math.min(CAP*n,(f.stock[k]||0)+q);f[tk]=now}};
    calc(f.poule,ELEVAGE.poule.min,'oeuf','tp');calc(f.chevre,ELEVAGE.chevre.min,'lait','tc')}
  const valeurStock=f=>(f.stock.oeuf||0)*ELEVAGE.poule.valeur+(f.stock.lait||0)*ELEVAGE.chevre.valeur+(f.stock.mais||0)*CULTURES.mais.prix+(f.stock.manioc||0)*CULTURES.manioc.prix+(f.stock.legumes||0)*CULTURES.legumes.prix;
  const libStock={oeuf:'🥚 Œufs',lait:'🥛 Lait',mais:'🌽 Maïs',manioc:'🥔 Manioc',legumes:'🥬 Légumes'};
  const prixUnit=k=>k==='oeuf'?ELEVAGE.poule.valeur:k==='lait'?ELEVAGE.chevre.valeur:CULTURES[k].prix;

  function vueHub(d){
    let h='<h3>🏙 Pôle des métiers</h3><p style="font-size:13px">Découvre les métiers, apprends en t’amusant et gagne des pièces. Chaque guide t’accompagne.</p>'+msg(d);
    MODULES.forEach(m=>{h+=`<button onclick="metOuvrir('${m.id}')">${m.ico} ${esc(m.nom)} <small>(${nbFaits(m)}/${m.dossiers.length})</small></button>`});
    h+='<button class="p" onclick="simAeroport()">✈️ Aéroport et simulateur de vol</button><button class="p" onclick="simMusique()">🎵 MUSIQUE – Découvre, joue et compose !</button><button class="p" onclick="simMode()">👗 Salon de mode (créer des tenues)</button><button class="p" onclick="simDeco()">🏠 Atelier de décoration (plans de pièces)</button><button onclick="simProfil()">🌟 Mon profil de talents</button><button onclick="metFerme()">🌾 Agriculture et élevage</button><button onclick="metBoutique()">🏪 Ma boutique</button>';
    return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
  }
  function vueModule(d){
    const m=mod(d.m),g=GUIDES[m.guide];
    let h=`<h3>${m.ico} ${esc(m.nom)}</h3><p style="font-size:13px"><b>${g.ico} ${esc(g.nom)}</b>, ${esc(g.role.toLowerCase())} : « ${esc(m.txt)} »</p>`;
    m.dossiers.forEach(x=>{const ok=A().done['met:'+x.id],s=A().stars['met:'+x.id]||0;
      h+=`<button class="${ok?'':'p'}" onclick="metLancer('${m.id}','${x.id}')">${ok?'✅':'▶'} ${esc(x.titre)} ${'⭐'.repeat(s)}</button>`});
    return h+'<button onclick="metHub()">← Pôle des métiers</button>';
  }
  function vueFerme(d){
    majElevage();const f=ferme();
    let h='<h3>🌾 Agriculture et élevage</h3><p style="font-size:12px">🌿 <b>Papa Mutombo</b> : « La terre nourrit ceux qui en prennent soin. Sème, arrose, patiente, récolte. »</p>'+pieces()+msg(d);
    f.parc.forEach((p,i)=>{
      if(!p){h+=`<div class="row"><b>Parcelle ${i+1}</b> : vide<br>`+Object.keys(CULTURES).map(k=>`<button style="padding:6px 8px" class="${A().pieces>=CULTURES[k].cout?'p':''}" onclick="metSemer(${i},'${k}')">${CULTURES[k].ico} ${CULTURES[k].nom} (${CULTURES[k].cout} 🪙)</button>`).join('')+'</div>'}
      else{const r=restant(p),c=CULTURES[p.c];
        h+=`<div class="row"><b>Parcelle ${i+1}</b> : ${c.ico} ${c.nom} · ${r<=0?'<b>prêt à récolter !</b>':'pousse… '+fmt(r)}<br>`+(r<=0?`<button class="p" onclick="metRecolter(${i})">🧺 Récolter</button>`:`<button onclick="metArroser(${i})" ${p.arr>=3?'disabled':''}>💧 Arroser (${3-p.arr} restants)</button>`)+'</div>'}
    });
    h+=`<div class="row"><b>Élevage</b><br>🐔 Poules : ${f.poule} <button style="padding:6px 8px" onclick="metAcheter('poule')">+ (10 🪙)</button> · 🐐 Chèvres : ${f.chevre} <button style="padding:6px 8px" onclick="metAcheter('chevre')">+ (30 🪙)</button><br><small>Elles produisent des œufs et du lait avec le temps. Plafond : ${CAP} par animal.</small></div>`;
    h+='<p class="row"><span>En réserve</span><b style="font-size:12px">'+(Object.keys(libStock).filter(k=>f.stock[k]>0).map(k=>f.stock[k]+' '+libStock[k]).join(' · ')||'rien')+'</b></p>';
    return h+'<button onclick="metBoutique()">🏪 Vendre dans ma boutique</button><button onclick="metFerme()">🔄 Actualiser</button><button onclick="metHub()">← Pôle des métiers</button>';
  }
  function vueBoutique(d){
    majElevage();const f=ferme();
    let h='<h3>🏪 Ma boutique</h3><p style="font-size:12px">💼 <b>Madame Béa</b> : « Un bon commerçant sait rendre la monnaie sans se tromper. »</p>'+pieces()+msg(d);
    if(d.vente){const v=d.vente;
      h+=`<p><b>Un client achète ${v.q} ${libStock[v.k]}</b> à ${v.u} 🪙 pièce : total ${v.total} 🪙. Il paie avec ${v.billet} 🪙. Combien rends-tu ?</p>`;
      v.opts.forEach(o=>{h+=`<button onclick="metRendre(${o})">${o} 🪙</button>`});
      return h;
    }
    const K=Object.keys(libStock).filter(k=>f.stock[k]>0);
    h+=K.length?'<h4>Mon stock</h4>':'<p>Ton stock est vide : cultive ou élève des animaux à la ferme.</p>';
    K.forEach(k=>{h+=`<button class="p" onclick="metVendre('${k}')">${libStock[k]} × ${f.stock[k]} · vendre (${prixUnit(k)} 🪙 pièce)</button>`});
    return h+'<button onclick="metFerme()">🌾 Ferme</button><button onclick="metHub()">← Pôle des métiers</button>';
  }
  const actions={
    metHub:()=>{const d=G.dialog;if(d&&d.kind==='metiers'){d.vue='hub';d.msg='';renderDialog()}else{openBox({kind:'metiers',vue:'hub',msg:''});parler('Pôle des métiers. Choisis un métier à découvrir.')}},
    metOuvrir:id=>{const d=G.dialog;d.vue='module';d.m=id;d.msg='';renderDialog();const m=mod(id);parler(GUIDES[m.guide].nom+' : '+m.txt)},
    metLancer:(mid,did)=>{const m=mod(mid),x=m.dossiers.find(z=>z.id===did),g=GUIDES[m.guide];
      if(x.jeu){if(window.detOuvrir)window.detOuvrir(x.jeu);return}
      
      quiz3D({cle:'met:'+x.id,titre:m.nom+' · '+x.titre,intro:g.nom+' : '+x.intro,qs:x.qs,mat:'geo'})},
    metFerme:()=>{const d=G.dialog;if(d&&d.kind==='metiers'){d.vue='ferme';d.msg='';renderDialog()}else openBox({kind:'metiers',vue:'ferme',msg:''})},
    metBoutique:()=>{const d=G.dialog;if(d&&d.kind==='metiers'){d.vue='boutique';d.msg='';d.vente=null;renderDialog()}else openBox({kind:'metiers',vue:'boutique',msg:''})},
    metSemer:(i,k)=>{const d=G.dialog,f=ferme(),c=CULTURES[k];
      if(A().pieces<c.cout){d.msg='Il te manque '+(c.cout-A().pieces)+' pièces pour semer.';SFX.ko();renderDialog();return}
      A().pieces-=c.cout;f.parc[i]={c:k,t:Date.now(),arr:0};save();refreshHud();SFX.coin();d.msg='Tu as semé : '+c.ico+' '+c.nom+'. '+c.txt;parler(c.txt);renderDialog()},
    metArroser:i=>{const d=G.dialog,p=ferme().parc[i];if(!p||p.arr>=3)return;p.arr++;save();SFX.ok&&SFX.ok();d.msg='💧 Tu arroses : la plante pousse plus vite !';renderDialog()},
    metRecolter:i=>{const d=G.dialog,f=ferme(),p=f.parc[i];if(!p||restant(p)>0)return;const c=CULTURES[p.c];
      f.stock[p.c]=Math.min(CAP*4,(f.stock[p.c]||0)+c.rendement);f.parc[i]=null;f.nbR=(f.nbR||0)+1;A().xp+=3;save();refreshHud();SFX.bravo();d.msg='Récolte : '+c.rendement+' '+c.ico+' '+c.nom+' ajoutés à ta réserve !';renderDialog()},
    metAcheter:k=>{const d=G.dialog,f=ferme(),e=ELEVAGE[k];
      if(f[k]>=CAP){d.msg='Ton enclos est plein pour cet animal.';SFX.ko();renderDialog();return}
      if(A().pieces<e.prix){d.msg='Il te manque '+(e.prix-A().pieces)+' pièces.';SFX.ko();renderDialog();return}
      majElevage();A().pieces-=e.prix;f[k]++;if(f[k]===1){f[k==='poule'?'tp':'tc']=Date.now()}save();refreshHud();SFX.coin();d.msg=e.ico+' '+e.nom+' achetée(e). Prends-en soin !';renderDialog()},
    metVendre:k=>{const d=G.dialog,f=ferme(),n=f.stock[k]||0;if(n<=0)return;const q=n,u=prixUnit(k),total=q*u;
      const billet=[5,10,20,50,100].find(b=>b>=total)||Math.ceil(total/10)*10,juste=billet-total;
      const o=new Set([juste]);let s=1;while(o.size<4){const v=juste+(s%2?s:-s);if(v>=0&&v!==juste)o.add(v);s++}
      const opts=[...o].sort((a,b)=>a-b);
      d.vente={k,q,u,total,billet,juste,opts};d.msg='';parler('Un client veut acheter '+q+' '+libStock[k].slice(2)+'. Il paie '+billet+' pièces. Combien dois-tu rendre ?');renderDialog()},
    metRendre:v=>{const d=G.dialog,f=ferme(),s=d.vente;if(!s)return;
      f.stock[s.k]=0;
      if(v===s.juste){A().pieces+=s.total+1;A().xp+=2;SFX.bravo();d.msg='Bien rendu ! Tu gagnes '+s.total+' 🪙 + 1 🪙 de pourboire.'}
      else{A().pieces+=s.total;SFX.ko();d.msg='Attention : il fallait rendre '+s.juste+' 🪙 ('+s.billet+' − '+s.total+'). Tu gagnes '+s.total+' 🪙.'}
      d.vente=null;save();refreshHud();renderDialog()}
  };
  return {
    modules:()=>MODULES,
    html:d=>d.vue==='module'?vueModule(d):d.vue==='ferme'?vueFerme(d):d.vue==='boutique'?vueBoutique(d):vueHub(d),
    bouton:()=>'<button onclick="metHub()">🏙 Pôle des métiers</button>',
    spots(dim){
      return [{x:0,z:dim.D/2-3,r:2.6,label:'🏙 Pôle des métiers : détective, laboratoire, hôpital, ferme…',run:()=>actions.metHub()}];
    },
    actions
  };
}
