// GESTION DE LA CITÉ (BOYEKOLI SMART CITY, fusionné au quartier résidentiel existant) : le joueur achète des terrains et y construit ;
// ce tableau de bord calcule, à partir des vrais bâtiments, la population, l'énergie, l'eau, les emplois, l'éducation, la santé,
// la sécurité, la circulation, la pollution et la satisfaction, donne des conseils et propose 10 missions de maire.
import {CATALOGUE,LOYER} from './quartier_res.js';

// effets par bâtiment : [niveau1, niveau2, niveau3]
const EFF={
 case:[{loge:4}],maison:[{loge:8},{loge:14},{loge:30}],villa:[{loge:10},{loge:16}],
 ecole:[{edu:1,emp:6,elec:-2},{edu:2,emp:12,elec:-4}],sante:[{san:1,emp:6,elec:-2,eau:-1},{san:2,emp:10,elec:-3,eau:-2},{san:3,emp:16,elec:-5,eau:-3}],
 sport:[{joie:2,emp:2},{joie:4,emp:4,elec:-3}],culture:[{joie:2,emp:3,elec:-1},{joie:3,emp:5,elec:-2}],police:[{sec:1,emp:3,elec:-1},{sec:2,emp:6,elec:-2}],pompiers:[{sec:1,emp:3},{sec:2,emp:6}],
 autoecole:[{emp:4,elec:-1},{emp:8,elec:-2}],energie:[{elec:20},{elec:60,poll:12,emp:6}],eau:[{eau:25,emp:1},{eau:80,emp:3,elec:-2}],
 commerce:[{emp:12,elec:-2,eau:-1},{emp:30,elec:-6,eau:-3}],transport:[{trans:1,emp:2},{trans:3,emp:6,elec:-2}],parc:[{poll:-4,joie:2},{poll:-10,joie:4}]};
const MISSIONS=[
 {id:'c1',nom:'Les premiers habitants',txt:'Atteins 20 habitants dans ta cité.',ok:s=>s.pop>=20,pieces:6},
 {id:'c2',nom:'De l’eau pour tous',txt:'Construis une source d’eau (puits ou château d’eau) et couvre les besoins de 30 habitants.',ok:s=>s.nb.chateau>=1&&s.pop>=30&&s.eauOk>=1,pieces:6},
 {id:'c3',nom:'La lumière',txt:'Produis assez d’électricité pour 40 habitants.',ok:s=>s.pop>=40&&s.elecOk>=1,pieces:6},
 {id:'c4',nom:'L’école',txt:'Aie au moins 2 écoles (celle du village compte) pour couvrir 60 % des enfants.',ok:s=>s.eduCouv>=.6&&s.nb.ecole>=2,pieces:6},
 {id:'c5',nom:'La santé',txt:'Construis un centre de santé et atteins 30 habitants.',ok:s=>s.nb.hopital>=1&&s.pop>=30,pieces:6},
 {id:'c6',nom:'La circulation',txt:'Bitume au moins 3 tronçons de route, ajoute un arrêt de bus et garde la circulation fluide.',ok:s=>s.nb.route>=3&&s.nb.bus>=1&&s.circOk>=.9,pieces:8},
 {id:'c7',nom:'La cité verte',txt:'4 parcs ou jardins, 2 sources solaires et une pollution faible.',ok:s=>s.nb.parc>=4&&s.nb.solaire>=2&&s.poll<=30,pieces:8},
 {id:'c8',nom:'La sécurité',txt:'Deux postes de police ou de pompiers pour une sécurité d’au moins 60 %.',ok:s=>s.nb.police>=2&&s.secu>=.6,pieces:8},
 {id:'c9',nom:'Une cité heureuse',txt:'100 habitants et 70 % de satisfaction.',ok:s=>s.pop>=100&&s.sat>=70,pieces:10},
 {id:'c10',nom:'Maire de la grande cité',txt:'200 habitants, 75 % de satisfaction et tous les services (eau, école, santé, police).',ok:s=>s.pop>=200&&s.sat>=75&&s.nb.ecole>=1&&s.nb.hopital>=1&&s.nb.police>=1&&s.nb.chateau>=1,pieces:15}];
const NOTIONS=[
 ['🛣 Routes et transport','Plus il y a d’habitants, plus il faut de routes goudronnées et de bus pour éviter les embouteillages.'],
 ['⚡ Énergie','Les panneaux solaires sont propres ; une centrale produit beaucoup mais pollue. Équilibre les deux.'],
 ['💧 Eau','Chaque habitant a besoin d’eau potable : puits au début, château d’eau pour une grande cité.'],
 ['🌳 Écologie','Les parcs filtrent l’air et rendent la cité agréable.'],
 ['🏫 Services publics','Écoles, centres de santé, police et pompiers rendent la vie meilleure et donnent des emplois.'],
 ['💰 Économie','Les logements loués rapportent des loyers ; une cité satisfaite attire des locataires et augmente les loyers.']];
export function creerCite(D){
  const {PAR,G,esc,SFX,save,refreshHud,openBox,closeDialog,toast}=D;
  const A=()=>G.adv;
  const CS=()=>{const a=A();if(!a.cite)a.cite={done:{},stars:{},cert:null};const c=a.cite;if(!c.done)c.done={};if(!c.stars)c.stars={};return c};
  let ov=null,tab='ind',pop=null;
  const btn=(t,oc,bg,st)=>`<button onclick="${oc}" style="padding:8px 11px;margin:2px;border-radius:10px;border:2px solid #fff3;background:${bg||'#2f5a6b'};color:${bg==='#ffd54f'?'#222':'#fff'};font-size:13px;font-weight:600;touch-action:manipulation;${st||''}">${t}</button>`;
  function stats(){
    const a=A(),bats=D.bats(),nbTer=a.terrains||0,nb={chateau:0,ecole:0,hopital:0,police:0,parc:0,solaire:0,route:0,bus:0,commerce:0,sante:0};
    let loge=0,emp=0,elS=0,elD=0,eaS=0,eaD=0,poll=0,edu=0,san=0,sec=0,joie=0,trans=0,loy=0;
    // éléments du village de départ : école, marché, puits et réseau électrique du village
    edu+=1;nb.ecole++;emp+=10;eaS+=20;elS+=15;nb.commerce++;
    if(a.med){san+=1;nb.hopital++}
    bats.forEach((b,k)=>{if(!b||b.annexe!==undefined||k>=nbTer)return;const E=(EFF[b.t]||[])[b.n-1]||{};loge+=E.loge||0;emp+=E.emp||0;if(E.elec>0)elS+=E.elec;else elD-=E.elec||0;if(E.eau>0)eaS+=E.eau;else eaD-=E.eau||0;poll+=E.poll||0;edu+=E.edu||0;san+=E.san||0;sec+=E.sec||0;joie+=E.joie||0;trans+=E.trans||0;
      if(b.t==='eau')nb.chateau++;if(b.t==='ecole')nb.ecole++;if(b.t==='sante'){nb.hopital++}if(b.t==='police'||b.t==='pompiers')nb.police++;if(b.t==='parc')nb.parc++;if(b.t==='energie'&&b.n===1)nb.solaire++;if(b.t==='transport')nb.bus++;if(b.t==='commerce')nb.commerce++;
      if(b.loc)loy+=LOYER(b.t,b.n)});
    nb.route=((a.pave||[]).length)+(a.rond?1:0);
    const cl=(x,y)=>Math.min(1,x/Math.max(1,y));
    const popRef=Math.max(1,loge);
    const rE=cl(elS,elD+loge/4),rW=cl(eaS,eaD+loge/3),rJ=cl(emp,loge*.45),rEdu=cl(edu*60,loge*.3),rSan=cl(san*90,loge),rSec=cl(sec*80,loge),rC=cl(nb.route*9+trans*25+20,loge*.6),pl=Math.max(0,poll),rP=1-Math.min(1,pl/50);
    const sat=loge===0?60:Math.round(100*(.2*rE+.15*rW+.12*rJ+.12*rEdu+.12*rSan+.1*rSec+.1*rC+.09*rP)+Math.min(8,joie*2));
    const sat2=Math.min(100,sat),pop=Math.round(loge*(.35+.65*sat2/100));
    return {pop,loge,emp,elS,elD:elD+Math.round(loge/4),eaS,eaD:eaD+Math.round(loge/3),elecOk:rE,eauOk:rW,rJ,eduCouv:rEdu,sante:rSan,secu:rSec,circOk:rC,poll:pl,sat:sat2,nb,joie,loyers:loy,
      terrains:nbTer,construits:bats.filter((b,k)=>b&&b.annexe===undefined&&k<nbTer).length}}
  // facteur appliqué aux loyers : une cité satisfaisante attire de meilleurs locataires
  const facteur=()=>{const s=stats();return Math.max(.8,Math.min(1.25,.8+s.sat/200))};
  function signal(){try{D.mis&&D.mis.evt('vil','etat',stats())}catch(e){}}
  const bar=(l,v,c)=>`<div style="margin:5px 0;font-size:13px">${l} <b>${Math.round(Math.max(0,Math.min(1,v))*100)}%</b><div style="height:9px;background:#0d1622;border-radius:5px"><div style="height:9px;width:${Math.round(Math.max(0,Math.min(1,v))*100)}%;background:${c||(v>=.8?'#2e9e4a':v>=.5?'#e8c04a':'#d6302b')};border-radius:5px"></div></div></div>`;
  function conseils(s){
    const L=[];
    if(s.terrains===0)L.push('Achète ton premier terrain pour commencer ta cité (touche un panneau « À VENDRE » dans le quartier résidentiel).');
    if(s.construits===0&&s.terrains>0)L.push('Construis sur ton terrain : une maison pour loger des habitants.');
    if(s.elecOk<.9&&s.loge>0)L.push('⚡ Il manque d’électricité : construis des panneaux solaires ou une centrale (Énergie et eau).');
    if(s.eauOk<.9&&s.loge>0)L.push('💧 Il manque d’eau : construis un puits ou un château d’eau.');
    if(s.eduCouv<.6&&s.loge>0)L.push('🏫 Les enfants manquent d’écoles : construis une école.');
    if(s.sante<.5&&s.loge>0)L.push('🏥 Peu de soins : construis un centre de santé.');
    if(s.secu<.5&&s.loge>0)L.push('🚓 La sécurité est faible : police ou pompiers.');
    if(s.circOk<.7&&s.loge>0)L.push('🚦 Circulation difficile : bitume des routes et construis un arrêt de bus.');
    if(s.poll>30)L.push('🌫 L’air est pollué : ajoute des parcs et des panneaux solaires.');
    if(s.rJ<.6&&s.loge>0)L.push('💼 Pas assez d’emplois : construis un marché, un centre commercial ou des services.');
    return L.length?L:['✅ Ta cité est équilibrée. Continue à l’agrandir !']}
  function rend(){
    const c=$('citeb');if(!c)return;const s=stats(),cs=CS();let h='';
    if(tab==='ind'){
      h=`<div style="font-size:13px;margin-bottom:4px">👥 <b>${s.pop}</b> habitants (logements : ${s.loge}) · 💼 ${s.emp} emplois · 🏘 ${s.construits}/${s.terrains} terrains construits<br>💰 Loyers : ${s.loyers} 🪙/h · facteur de loyer ×${facteur().toFixed(2)} (selon la satisfaction)</div>`+bar('⚡ Électricité ('+s.elS+'/'+s.elD+')',s.elecOk)+bar('💧 Eau ('+s.eaS+'/'+s.eaD+')',s.eauOk)+bar('💼 Emplois',s.rJ)+bar('🏫 Éducation',s.eduCouv)+bar('🏥 Santé',s.sante)+bar('🚓 Sécurité',s.secu)+bar('🚦 Circulation',s.circOk)+bar('🌫 Air pur',1-Math.min(1,s.poll/50))+bar('😊 Satisfaction',s.sat/100)+
        '<h4 style="margin:10px 0 3px">🧭 Conseils du maire</h4>'+conseils(s).map(t=>`<div style="background:#16304a;border-radius:10px;padding:7px;margin:4px 0;font-size:13px">${esc(t)}</div>`).join('')}
    else if(tab==='bat'){
      const bats=D.bats();h='<b>🏘 Mes terrains et bâtiments</b>'+(s.terrains?'':'<p>Aucun terrain pour l’instant.</p>');
      for(let k=0;k<s.terrains;k++){const b=bats[k];h+=`<div style="background:#16304a;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>Terrain n°${k+1}</b> : ${b?(b.annexe!==undefined?'annexe du n°'+(b.annexe+1):CATALOGUE[b.t].ico+' '+esc(CATALOGUE[b.t].niv[b.n-1].n)):'<i>vide</i> (construis dessus !)'}</div>`}
      h+='<p style="font-size:12px;opacity:.85">Pour construire ou améliorer : va au quartier résidentiel du village et touche le panneau de ton terrain.</p>'}
    else if(tab==='miss'){
      h='<b>🎯 Missions de maire</b>'+MISSIONS.map(m=>{const ok=cs.done[m.id],pret=m.ok(s);return `<div style="background:#16304a;border-radius:10px;padding:6px 8px;margin:4px 0;font-size:13px"><b>${ok?'✅':pret?'🟢':'▫️'} ${esc(m.nom)}</b> ${ok?'⭐'.repeat(cs.stars[m.id]||1):''}<br><span style="opacity:.85">${esc(m.txt)}</span>${ok?'':'<br>'+btn('✅ Valider','citeValider(\''+m.id+'\')',pret?'#2e7d32':'#555')}</div>`}).join('')+`<p style="font-size:12px">${Object.keys(cs.done).length}/10 réussies (5 suffisent pour valider l’atelier).</p>`+(cs.cert?btn('🎓 Mon certificat','citeCert()','#6a1b9a'):'')}
    else h=NOTIONS.map(n=>`<div style="background:#16304a;border-radius:10px;padding:7px;margin:4px 0;font-size:13px"><b>${esc(n[0])}</b><br>${esc(n[1])}</div>`).join('');
    c.innerHTML=h;const t=$('citetabs');if(t)t.innerHTML=[['ind','📊 Indicateurs'],['bat','🏘 Mes terrains'],['miss','🎯 Missions'],['aide','📖 Notions']].map(x=>`<button onclick="citeTab('${x[0]}')" style="flex:0 0 auto;padding:9px 11px;border:0;border-bottom:3px solid ${tab===x[0]?'#ffd54f':'transparent'};background:none;color:${tab===x[0]?'#ffd54f':'#cfd8e3'};font-size:13px;font-weight:600">${x[1]}</button>`).join('')}
  const $=id=>ov&&ov.querySelector('#'+id);
  function ouvrir(){
    if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});fermer();
    ov=document.createElement('div');ov.id='citeov';ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#0f2433;color:#fff;font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:4px;padding:5px 7px;background:linear-gradient(90deg,#1b5e7a,#2e9e6a);flex:0 0 auto"><b style="flex:1;font-size:13px">🌆 GESTION DE MA CITÉ</b>${btn('✖','citeQuitter()','#7b2d26','padding:5px 9px;margin:0')}</div><div id="citetabs" style="display:flex;overflow-x:auto;background:#0a1824;flex:0 0 auto"></div><div id="citeb" style="flex:1;overflow:auto;padding:8px 10px 96px"></div><div id="citeover" style="position:absolute;inset:0;background:rgba(10,24,36,.97);display:none;flex-direction:column;padding:10px 10px 84px;overflow:auto;z-index:6"></div>`;
    document.body.appendChild(ov);PAR.equiper(ov,{retour:'citeRetour()'});tab='ind';rend();signal();
    try{history.pushState({cite:1},'')}catch(e){}pop=()=>{if(ov)quitter()};window.addEventListener('popstate',pop);
    PAR.dire('Voici le tableau de bord de ta cité, monsieur le maire. Construis, améliore et regarde les indicateurs évoluer.','ilunga')}
  function fermer(){if(ov){ov.remove();ov=null}}
  function quitter(){if(pop){window.removeEventListener('popstate',pop);pop=null}const a=!!ov;fermer();if(a)closeDialog()}
  function over(h){const o=$('citeover');o.style.display='flex';o.innerHTML=h}
  function fermerOver(){const o=$('citeover');if(o){o.style.display='none';o.innerHTML=''}}
  function valider(id){
    const m=MISSIONS.find(x=>x.id===id),cs=CS(),s=stats();if(!m.ok(s)){toast('Objectif pas encore atteint : regarde les conseils du maire.');SFX.ko&&SFX.ko();return}
    const prem=!cs.done[id];cs.done[id]=true;cs.stars[id]=Math.max(cs.stars[id]||0,s.sat>=80?3:2);let ex='';const a=A();
    if(prem){a.pieces+=m.pieces;a.xp+=m.pieces;refreshHud();const t=a.tal||(a.tal={});t.ville=(t.ville||0)+8}
    const n=Object.keys(cs.done).length;
    if(n>=5&&!a.done['met:v1']){a.done['met:v1']=true;a.stars['met:v1']=2;cs.cert={date:new Date().toLocaleDateString('fr-FR')};a.pieces+=15;refreshHud();ex='<p>🏅 <b>Badge de jeune maire !</b> Atelier validé (+15 🪙)</p>'}
    if(n>=10)a.stars['met:v1']=3;save();SFX.win&&SFX.win();PAR.dire('Mission réussie, monsieur le maire !','ilunga');rend();
    over(`<div style="text-align:center"><div style="font-size:44px">🌆🎉</div><h3>Mission réussie !</h3><p>${esc(m.nom)}${prem?' · +'+m.pieces+' 🪙':''}</p>${ex}</div>`)}
  function cert(){const cs=CS();if(!cs.cert){over('<h3>🎓 Certificat</h3><p>Réussis 5 missions pour devenir jeune maire.</p>');return}
    over(`<div style="background:linear-gradient(#f2fbf5,#cfeadb);color:#0f4a33;border:6px double #2e9e6a;border-radius:14px;padding:16px;text-align:center"><div style="font-size:12px;letter-spacing:3px">BOYEKOLI SMART CITY</div><div style="font-size:44px">🌆</div><h2 style="margin:4px 0;font-family:serif">CERTIFICAT DE JEUNE MAIRE</h2><p style="font-size:14px">décerné à</p><div style="font-size:24px;font-weight:800;font-family:serif;color:#7a1f1f">${esc(G.nom||'Jeune maire')}</div><p style="font-size:13px">pour avoir bâti et géré une cité : terrains, services, énergie, eau et environnement.</p><p style="font-size:12px">Fait le ${esc(cs.cert.date)}</p></div>`)}
  const actions={citeOuvrir:()=>ouvrir(),citeQuitter:()=>quitter(),citeTab:t=>{tab=t;rend()},citeValider:id=>valider(id),citeCert:()=>cert(),citeRetour:()=>{const o=$('citeover');if(o&&o.style.display==='flex')fermerOver();else quitter()}};
  return {actions,stats,facteur,signal,ouvrir};
}
