// Moteur économique du BOYEKOLI BUSINESS SIMULATOR (logique pure, testable hors navigateur).
import {SECTEURS,LIEUX,FOURNISSEURS,EMPLOIS,NOMS,NOMS_F,EQUIP,CAMPAGNES,EVENEMENTS,NIVEAUX,COMPETENCES} from './data.js';
export const secteur=id=>SECTEURS.find(s=>s.id===id);
export const lieu=id=>LIEUX.find(l=>l.id===id)||LIEUX[0];
export const four=id=>FOURNISSEURS.find(f=>f.id===id);
export const emploi=id=>EMPLOIS.find(e=>e.id===id);
const R=E=>{E.seed=(Math.imul(E.seed,1664525)+1013904223)>>>0;return E.seed/4294967296};
export const rnd=R;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
export const fmt=n=>(n<0?'−':'')+String(Math.round(Math.abs(n))).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' FC';
// ---------- création
export function creer(cfg){
  const S=secteur(cfg.sect),T=S.types.find(t=>t[0]===cfg.type)||S.types[0],L=lieu(cfg.lieu);
  const E={v:2,nom:cfg.nom||'Mon entreprise',logo:cfg.logo||{sym:'⭐',col:'#c0392b',forme:'cercle'},sect:cfg.sect,type:T[0],lieu:L.id,loc:cfg.loc||'loue',cap0:cfg.capital,cash:cfg.capital,dette:0,jour:1,rep:50,fid:0,seed:(cfg.seed||Date.now())>>>0,
    prods:[],cmd:[],emp:[],equip:{},camp:[],promo:null,ev:null,effets:[],local:1,agences:[],marque:0,jr:null,
    fin:{hist:[],cumBenef:0,cumCA:0,cumDep:0,cash:[cfg.capital]},comp:{},journal:[],err:{rupture:0,perte:0,retard:0,tresorerie:0,depart:0},stats:{commandes:0,campagnes:0,evenements:0,embauches:0,agences:0,joursRentables:0},scen:{n:1,debut:1,duree:15,cash0:cfg.capital,ren0:0},bilan:null,fidelite:0,vu:{}};
  COMPETENCES.forEach(c=>E.comp[c[0]]=0);
  const ids=cfg.prods&&cfg.prods.length?cfg.prods:S.prod.slice(0,4).map(p=>p.id);
  ids.forEach(id=>{const p=S.prod.find(x=>x.id===id);if(p)E.prods.push({id,prix:Math.round(p.prix/100)*100,stock:0,cu:p.cout,vendus:0})});
  if(E.loc==='achete'){const prix=L.special?600000:Math.round(L.loyer*400);E.cash-=prix;E.achatLocal=prix}
  const mise=T[3]*(L.special?2:1)*(cfg.type?1:1)*.5;E.cash-=Math.round(mise);E.miseEnPlace=Math.round(mise);
  // le stock de départ est acheté chez le fournisseur B avec 30 % du capital
  const budget=Math.round(cfg.capital*.45);if(E.cash>=budget*0){const per=Math.round(budget/Math.max(1,E.prods.length));E.prods.forEach(pr=>{const p=S.prod.find(x=>x.id===pr.id),n=Math.max(0,Math.floor(per/p.cout));if(E.cash>=n*p.cout){pr.stock=n;E.cash-=n*p.cout}})}
  E.jr=jourVide();noter(E,'Création de « '+E.nom+' » ('+S.nom+') à '+L.nom,'initiative',4);E.fin.cash[0]=E.cash;
  return E}
const jourVide=()=>({ca:0,cogs:0,achats:0,sal:0,loyer:0,pub:0,autres:0,frais:0,clients:0,perdus:0,ventes:0,agences:0});
export function noter(E,t,comp,pts){E.journal.push({j:E.jour,t});if(E.journal.length>80)E.journal.shift();if(comp)gagner(E,comp,pts||1)}
export function gagner(E,k,p){E.comp[k]=cl((E.comp[k]||0)+p,0,100)}
// ---------- paramètres dérivés
export const capaciteStock=E=>Math.round(60*(1+.5*(E.local-1))+(E.equip.etagere?30:0));
export const effetMult=(E,type)=>E.effets.filter(x=>x.type===type&&x.fin>=E.jour).reduce((m,x)=>m*x.v,1);
export const empParRole=(E,role)=>E.emp.filter(e=>e.role===role);
const skill=(E,role)=>{const l=empParRole(E,role);return l.length?Math.max(...l.map(e=>e.comp*(.5+e.sat/200))):0};
export const prixRef=(E,pid)=>{const S=secteur(E.sect),p=S.prod.find(x=>x.id===pid),L=lieu(E.lieu);return p.prix*(.97+.06*(L.conc-.5))};
export const coutAchat=(E,pid,fid)=>{const S=secteur(E.sect),p=S.prod.find(x=>x.id===pid),F=four(fid);return Math.round(p.cout*F.pf*effetMult(E,'achat'))};
export function demandeJour(E){
  const S=secteur(E.sect),T=S.types.find(t=>t[0]===E.type)||S.types[0],L=lieu(E.lieu);
  let m=S.base*.55*T[2]*L.traffic*(.45+E.rep/100*.9)*(1+.05*(E.local-1)*2);
  if(E.equip.enseigne)m*=1.08;if(E.equip.moto)m*=1.1;if(E.equip.mobile)m*=1.05;
  E.camp.forEach(c=>{if(c.fin>=E.jour)m*=1+c.eff});if(E.promo&&E.promo.fin>=E.jour)m*=1+E.promo.eff;
  m*=effetMult(E,'demande')*(1+Math.min(.2,E.fid*.01));
  m/=Math.pow(L.conc,.6);
  return m}
// ---------- clients
const TYPES_CLIENT=['rapide','comparateur','negociateur','exigeant','fidele'];
export function nouveauClient(E){
  const S=secteur(E.sect);let t;const r=R(E);
  if(E.fid>0&&r<Math.min(.3,E.fid*.03))t='fidele';else{const q=R(E);t=q<.4?'rapide':q<.65?'comparateur':q<.85?'negociateur':'exigeant'}
  const dispo=E.prods.filter(p=>true);if(!dispo.length)return null;
  // les produits les moins chers par rapport au marché attirent davantage
  const poids=dispo.map(p=>{const ref=prixRef(E,p.id);return Math.max(.2,1.6-p.prix/ref)});const tot=poids.reduce((a,b)=>a+b,0);let x=R(E)*tot,pr=dispo[0];for(let i=0;i<dispo.length;i++){x-=poids[i];if(x<=0){pr=dispo[i];break}}
  const ref=prixRef(E,pr.id),qte=1+Math.floor(R(E)*(ref<5000?3:2)),budget=Math.round(ref*qte*(.9+R(E)*.7));
  return {id:'c'+E.jour+'_'+Math.floor(R(E)*1e6),type:t,prod:pr.id,qte,budget,patience:30,paie:R(E)<.3?'mobile':'cash',nom:NOMS[Math.floor(R(E)*NOMS.length)]+' '+NOMS_F[Math.floor(R(E)*NOMS_F.length)]}}
export const typeLabel={rapide:'Pressé·e',comparateur:'Compare les prix',negociateur:'Négocie',exigeant:'Exigeant·e',fidele:'Client fidèle'};
// remise = fraction (0 à 0.3). Retourne {ok,msg,prix,qte,gain}
export function proposer(E,cli,remise){
  remise=remise||0;const p=E.prods.find(x=>x.id===cli.prod),S=secteur(E.sect),pdef=S.prod.find(x=>x.id===cli.prod);
  const perdu=(motif,rep,err)=>{E.jr.perdus++;E.rep=cl(E.rep+rep,0,100);if(err)E.err[err]++;return {ok:false,msg:motif}};
  if(!p||p.stock<=0){noter(E,'Rupture de stock : '+pdef.nom,null,0);gagner(E,'gestionFin',-.5);return perdu('Rupture de stock : le client repart.',-1.5,'rupture')}
  let qte=Math.min(cli.qte,p.stock);const promo=E.promo&&E.promo.fin>=E.jour?E.promo.pct:0,prixU=Math.round(p.prix*(1-remise)*(1-promo)),ref=prixRef(E,cli.prod),ratio=prixU/ref;
  qte=Math.min(qte,Math.max(0,Math.floor(cli.budget/Math.max(1,prixU))));
  if(qte<1)return perdu('Trop cher pour son budget.',-.3);
  if(cli.paie==='mobile'&&!E.equip.mobile&&R(E)<.5)return perdu('Il voulait payer par Mobile Money : pas de terminal.',-.4);
  const vend=skill(E,'vendeur'),sc=(E.emp.length?.02:0)+vend*.01;
  const seuil={rapide:1.3,comparateur:1.06,negociateur:remise>=.08?1.3:1.0,exigeant:1.15,fidele:1.35}[cli.type]+sc;
  if(cli.type==='exigeant'&&E.rep<45)return perdu('Il trouve la qualité de service insuffisante.',-.8);
  if(ratio>seuil)return perdu(cli.type==='comparateur'?'Il a comparé : c’est moins cher ailleurs.':'Prix trop élevé : il repart.',-.4);
  if(R(E)>.93+sc)return perdu('Il change d’avis et repart.',-.2);
  // vente
  const frais=cli.paie==='mobile'&&E.equip.mobile?Math.round(prixU*qte*.01):0,rec=prixU*qte;
  p.stock-=qte;p.vendus+=qte;E.cash+=rec-frais;E.jr.ca+=rec;E.jr.cogs+=p.cu*qte;E.jr.frais+=frais;E.jr.clients++;E.jr.ventes+=qte;
  E.rep=cl(E.rep+.25+(remise>0?0:.05),0,100);if(R(E)<.05+E.rep/1000)E.fid++;
  if(prixU>p.cu*1.1)gagner(E,'compta',.15);if(remise>0&&prixU>p.cu*1.1)gagner(E,'negociation',.4);if(remise>0&&prixU<=p.cu)gagner(E,'negociation',-.6);
  return {ok:true,msg:'Vente : '+qte+' × '+pdef.nom+' = '+fmt(rec),prix:prixU,qte,gain:rec-p.cu*qte}}
// service automatique par un caissier (applique une remise raisonnable aux négociateurs)
export function autoServir(E,cli){
  const caiss=skill(E,'caissier');if(!caiss)return null;let rem=0;const p=E.prods.find(x=>x.id===cli.prod);
  if(cli.type==='negociateur'&&p&&p.prix*.92>p.cu*1.15)rem=.08;
  return proposer(E,cli,rem)}
// ---------- achats et livraisons
export function commander(E,pid,qte,fid){
  const F=four(fid),bloque=E.effets.find(x=>x.type==='fournisseur'&&x.id===fid&&x.fin>=E.jour);if(bloque)return {ok:false,msg:F.nom+' est indisponible pour le moment.'};
  const cu=coutAchat(E,pid,fid),tot=cu*qte;if(qte<1)return {ok:false,msg:'Quantité invalide.'};if(tot>E.cash)return {ok:false,msg:'Trésorerie insuffisante : il te manque '+fmt(tot-E.cash)+'.'};
  const p=E.prods.find(x=>x.id===pid);if(!p)return {ok:false,msg:'Produit inconnu.'};
  const enCours=E.cmd.filter(c=>c.pid===pid).reduce((t,c)=>t+c.qte,0);if(p.stock+enCours+qte>capaciteStock(E))return {ok:false,msg:'Ton magasin ne peut pas stocker autant (capacité '+capaciteStock(E)+' par produit).'};
  E.cash-=tot;E.jr.achats+=tot;E.cmd.push({pid,qte,fid,cu,liv:E.jour+F.delai});E.stats.commandes++;noter(E,'Commande de '+qte+' × '+secteur(E.sect).prod.find(x=>x.id===pid).nom+' chez '+F.nom+' ('+fmt(tot)+')','gestionFin',.8);
  if(fid==='A')gagner(E,'negociation',.4);return {ok:true,msg:'Commande passée : livraison prévue le jour '+(E.jour+F.delai)+'.'}}
export function livrer(E){
  const msgs=[];E.cmd=E.cmd.filter(c=>{if(c.liv>E.jour)return true;const F=four(c.fid);
    if(!c.retard&&R(E)>F.fiab){c.retard=true;c.liv=E.jour+1;E.err.retard++;msgs.push('⏳ '+F.nom+' est en retard : livraison demain.');return true}
    const p=E.prods.find(x=>x.id===c.pid);const n=Math.min(c.qte,capaciteStock(E)-p.stock);if(n>0){p.cu=Math.round((p.cu*p.stock+c.cu*n)/Math.max(1,p.stock+n));p.stock+=n}
    msgs.push('📦 Livraison reçue : '+n+' × '+secteur(E.sect).prod.find(x=>x.id===c.pid).nom);return false});return msgs}
// ---------- personnel
export function candidats(E,n){
  const out=[];for(let i=0;i<(n||3);i++){const role=EMPLOIS[Math.floor(R(E)*EMPLOIS.length)],c=1+Math.floor(R(E)*5);out.push({id:'e'+Math.floor(R(E)*1e8),nom:NOMS[Math.floor(R(E)*NOMS.length)]+' '+NOMS_F[Math.floor(R(E)*NOMS_F.length)],role:role.id,comp:c,sal:Math.round(role.sal*(.8+.15*c)/100)*100,sat:70,mois:0})}
  return out}
export function embaucher(E,c){if(E.emp.length>=8)return {ok:false,msg:'8 employés maximum.'};if(E.cash<c.sal*3)return {ok:false,msg:'Prudence : garde au moins 3 jours de salaire en réserve ('+fmt(c.sal*3)+').'};E.emp.push(Object.assign({},c));E.stats.embauches++;noter(E,'Embauche de '+c.nom+' ('+emploi(c.role).nom+', '+fmt(c.sal)+'/jour)','leadership',1.5);return {ok:true,msg:c.nom+' rejoint l’équipe.'}}
export function licencier(E,id){const e=E.emp.find(x=>x.id===id);if(!e)return {ok:false,msg:''};E.emp=E.emp.filter(x=>x.id!==id);noter(E,'Licenciement de '+e.nom,'responsabilite',-1);return {ok:true,msg:e.nom+' a quitté l’entreprise.'}}
export function augmenter(E,id,pct){const e=E.emp.find(x=>x.id===id);if(!e)return {ok:false,msg:''};e.sal=Math.round(e.sal*(1+pct)/100)*100;e.sat=cl(e.sat+12,0,100);noter(E,'Augmentation de '+e.nom,'leadership',1);return {ok:true,msg:'Salaire de '+e.nom+' : '+fmt(e.sal)}}
// ---------- équipements, marketing, emprunts
export function equiper(E,id){const q=EQUIP.find(x=>x.id===id);if(E.equip[id])return {ok:false,msg:'Déjà acheté.'};if(E.cash<q.cout)return {ok:false,msg:'Trésorerie insuffisante.'};E.cash-=q.cout;E.jr.autres+=q.cout;E.equip[id]=true;noter(E,'Achat : '+q.nom+' ('+fmt(q.cout)+')','gestionFin',1);gagner(E,'initiative',1);return {ok:true,msg:q.nom+' installé.'}}
export function campagne(E,id,affiche){const c=CAMPAGNES.find(x=>x.id===id);if(E.cash<c.cout)return {ok:false,msg:'Trésorerie insuffisante.'};if(E.camp.some(x=>x.id===id&&x.fin>=E.jour))return {ok:false,msg:'Cette campagne est déjà en cours.'};
  const com=skill(E,'commercial'),eff=c.eff*(.6+R(E)*.8)*(1+com*.06)*(affiche?1.1:1);E.cash-=c.cout;E.jr.pub+=c.cout;E.camp.push({id,fin:E.jour+c.jours,eff,debut:E.jour,cout:c.cout,avant:moyClients(E)});E.stats.campagnes++;E.marque=Math.min(100,E.marque+2);
  noter(E,'Campagne « '+c.nom+' » ('+fmt(c.cout)+')','creativite',2);if(affiche)gagner(E,'creativite',1.5);return {ok:true,msg:'Campagne lancée : effet estimé +'+Math.round(eff*100)+' % de clients pendant '+c.jours+' jours.'}}
export function promotion(E,pct,jours){if(E.promo&&E.promo.fin>=E.jour)return {ok:false,msg:'Une promotion est déjà en cours.'};E.promo={pct,fin:E.jour+jours-1,eff:pct*2.2*(.8+R(E)*.4)};noter(E,'Promotion de −'+Math.round(pct*100)+' % pendant '+jours+' jours','creativite',1.5);return {ok:true,msg:'Promotion lancée.'}}
const moyClients=E=>{const h=E.fin.hist.slice(-3);return h.length?Math.round(h.reduce((t,x)=>t+x.clients,0)/h.length):0};
export function emprunter(E,m){if(E.dette>0)return {ok:false,msg:'Rembourse d’abord ta dette actuelle.'};if(m>E.cap0*.6)return {ok:false,msg:'La banque prête au maximum 60 % de ton capital de départ ('+fmt(E.cap0*.6)+').'};E.dette=Math.round(m*1.0);E.cash+=m;noter(E,'Emprunt de '+fmt(m)+' (intérêt 0,8 % par jour)','risques',1);return {ok:true,msg:'Prêt accordé.'}}
export function rembourser(E,m){m=Math.min(m,E.dette,E.cash);if(m<=0)return {ok:false,msg:'Impossible de rembourser.'};E.dette-=m;E.cash-=m;E.jr.autres+=m;if(E.dette<=0)noter(E,'Dette entièrement remboursée','responsabilite',3);else noter(E,'Remboursement de '+fmt(m),'gestionFin',.8);return {ok:true,msg:'Remboursé : '+fmt(m)}}
// ---------- expansion
export const coutAgrandir=E=>Math.round(E.cap0*.3*E.local);
export function agrandir(E){if(E.local>=3)return {ok:false,msg:'Niveau maximum.'};const c=coutAgrandir(E);if(E.cash<c)return {ok:false,msg:'Il faut '+fmt(c)+'.'};E.cash-=c;E.jr.autres+=c;E.local++;noter(E,'Agrandissement des locaux (niveau '+E.local+')','initiative',2);return {ok:true,msg:'Locaux agrandis : plus de clients et de stock.'}}
export const coutAgence=E=>Math.round(E.cap0*.4);
export function ouvrirAgence(E,lid){const c=coutAgence(E);if(E.agences.length>=5)return {ok:false,msg:'5 agences maximum.'};if(E.cash<c)return {ok:false,msg:'Il faut '+fmt(c)+'.'};E.cash-=c;E.jr.autres+=c;const L=lieu(lid);E.agences.push({id:'a'+(E.agences.length+1),lieu:lid,niv:1,jour:E.jour});E.stats.agences++;E.marque=Math.min(100,E.marque+10);noter(E,'Ouverture d’une agence à '+L.nom,'initiative',4);return {ok:true,msg:'Nouvelle agence ouverte à '+L.nom+'.'}}
export function diversifier(E,pid){const S=secteur(E.sect),p=S.prod.find(x=>x.id===pid);if(!p||E.prods.some(x=>x.id===pid))return {ok:false,msg:''};if(E.prods.length>=S.prod.length+0&&false)return {ok:false,msg:''};E.prods.push({id:pid,prix:Math.round(p.prix/100)*100,stock:0,cu:p.cout,vendus:0});noter(E,'Nouveau produit : '+p.nom,'creativite',1.5);return {ok:true,msg:p.nom+' ajouté.'}}
export function valeurStock(E){return E.prods.reduce((t,p)=>t+p.stock*p.cu,0)}
export function valeurNette(E){return Math.round(E.cash+valeurStock(E)+Object.keys(E.equip).reduce((t,k)=>t+EQUIP.find(q=>q.id===k).cout*.7,0)+E.agences.length*coutAgence(E)*.8+(E.loc==='achete'?(E.achatLocal||0)*.9:0)-E.dette)}
export function niveau(E){let n=0;NIVEAUX.forEach((x,i)=>{if(E.fin.cumBenef>=x[0]&&(i<3||E.agences.length>=1&&(i<4||E.agences.length>=3)))n=i});return n}
// ---------- agences : simulation simplifiée
function agenceJour(E,a){
  const S=secteur(E.sect),L=lieu(a.lieu),T=S.types.find(t=>t[0]===E.type)||S.types[0];
  const ca=S.base*T[2]*L.traffic*(.4+E.rep/100*.8)*avgPrix(E)*.75*(1+.15*(a.niv-1))*(.85+R(E)*.3),marge=.22+skill(E,'gestionnaire')*.01,charges=L.loyer+5000+(E.emp.length?2000:0);
  return {ca:Math.round(ca),benef:Math.round(ca*marge-charges)}}
const avgPrix=E=>E.prods.length?E.prods.reduce((t,p)=>t+p.prix,0)/E.prods.length:5000;
// ---------- fin de journée
export function finJour(E){
  const L=lieu(E.lieu),S=secteur(E.sect),jr=E.jr,msgs=[];
  // salaires
  const sal=E.emp.reduce((t,e)=>t+e.sal,0);let paye=Math.min(E.cash,sal);E.cash-=paye;jr.sal=paye;
  if(paye<sal){const manque=sal-paye;E.dette+=manque;E.err.tresorerie++;E.emp.forEach(e=>e.sat=cl(e.sat-15,0,100));msgs.push('⚠️ Salaires impayés : '+fmt(manque)+' ajoutés à ta dette. Le personnel est mécontent.');gagner(E,'leadership',-3);gagner(E,'responsabilite',-2)}else if(sal>0){gagner(E,'leadership',.5);gagner(E,'responsabilite',.5)}
  // loyer et charges
  const loyer=E.loc==='loue'?Math.round(L.loyer*(1+.25*(E.local-1))):0,elec=Math.round(1200*(1+.4*(E.local-1))+Object.keys(E.equip).length*150);const ch=loyer+elec;const pc=Math.min(E.cash,ch);E.cash-=pc;jr.loyer=loyer;jr.autres+=elec;if(pc<ch){E.dette+=ch-pc;E.err.tresorerie++}
  // intérêts
  if(E.dette>0){const i=Math.round(E.dette*.008);E.dette+=i;jr.frais+=i}
  // agences
  let ag=0;E.agences.forEach(a=>{const r=agenceJour(E,a);ag+=r.benef;jr.agences+=r.ca});if(ag){E.cash+=ag;msgs.push('🏪 Agences : '+(ag>=0?'+':'')+fmt(ag))}
  // déchets (denrées périssables) réduits par frigo et gestionnaire
  if(['resto','agri','pharma'].includes(E.sect)){const pert=(.06-(E.equip.frigo?.03:0)-skill(E,'gestionnaire')*.005);let v=0;E.prods.forEach(p=>{const n=Math.floor(p.stock*Math.max(0,pert));if(n>0){p.stock-=n;v+=n*p.cu}});if(v>0){jr.autres+=v;E.err.perte++;msgs.push('🗑 Gaspillage : '+fmt(v)+' de marchandises perdues.')}}
  const benef=jr.ca-jr.cogs-jr.sal-jr.loyer-jr.autres-jr.pub-jr.frais+ag;
  const dep=jr.achats+jr.sal+jr.loyer+jr.autres+jr.pub+jr.frais;
  E.fin.cumBenef+=benef;E.fin.cumCA+=jr.ca+jr.agences;E.fin.cumDep+=dep;
  E.fin.hist.push({j:E.jour,ca:jr.ca+jr.agences,cogs:Math.round(jr.cogs),dep,benef:Math.round(benef),cash:Math.round(E.cash),clients:jr.clients,perdus:jr.perdus,stock:Math.round(valeurStock(E))});if(E.fin.hist.length>60)E.fin.hist.shift();
  E.fin.cash.push(Math.round(E.cash));if(E.fin.cash.length>61)E.fin.cash.shift();
  if(benef>0){E.stats.joursRentables++;gagner(E,'gestionFin',1)}else{E.err.perte++;gagner(E,'gestionFin',-1)}
  if(E.cash>sal*3+L.loyer*3)gagner(E,'risques',.5);
  // personnel : satisfaction et départs
  const rh=skill(E,'rh');E.emp.forEach(e=>{const marche=emploi(e.role).sal*(.8+.15*e.comp),rapport=e.sal/marche;e.sat=cl(e.sat+(rapport>=1?2:-2)+(rh*.3)+(jr.clients>25?-2:1),0,100);if(e.sat<25&&R(E)<.35){E.emp=E.emp.filter(x=>x!==e);E.err.depart++;msgs.push('👋 '+e.nom+' démissionne (trop peu motivé·e).');gagner(E,'leadership',-2)}});
  // réputation vers sa base
  E.rep=cl(E.rep+(jr.perdus>jr.clients?-1:.5),0,100);
  E.camp.filter(c=>c.fin===E.jour&&!c.res).forEach(c=>{c.res=true;const av=c.avant||1,ap=moyClients(E);msgs.push('📣 Bilan de campagne : '+(ap>av?'+':'')+(ap-av)+' clients par jour par rapport à avant.')});
  E.camp=E.camp.filter(c=>c.fin>=E.jour-1);
  E.effets=E.effets.filter(x=>x.fin>E.jour);
  // niveau
  const n=niveau(E);if(n>(E.niveau||0)){E.niveau=n;msgs.push('🎉 Nouveau niveau : '+NIVEAUX[n][1]+' !');E.nvNouveau=n}
  E.jour++;E.jr=jourVide();msgs.push.apply(msgs,livrer(E));
  // événement
  if(E.jour>=3&&!E.ev&&R(E)<.35)evenement(E);
  // bilan de scénario
  if(E.jour-E.scen.debut>=E.scen.duree)E.bilan=bilan(E);
  return {benef:Math.round(benef),msgs,rec:E.fin.hist[E.fin.hist.length-1]}}
// ---------- événements
export function evenement(E){
  const ok=EVENEMENTS.filter(e=>!e.cond||(e.cond==='agence'&&E.fin.cumBenef>0&&E.rep>=55&&E.cash>=coutAgence(E)&&E.agences.length<5));
  const e=ok[Math.floor(R(E)*ok.length)];E.ev={id:e.id,jour:E.jour};E.stats.evenements++;return e}
export function choisirEvenement(E,idx){
  const ev=EVENEMENTS.find(x=>x.id===E.ev.id),c=ev.choix[idx],f=c.eff||{};let msg=c.note;
  if(f.cash){E.cash+=f.cash;if(f.cash<0)E.jr.autres-=f.cash}if(f.rep)E.rep=cl(E.rep+f.rep,0,100);if(f.fid)E.fid+=f.fid;if(f.dette){E.dette+=f.dette}
  if(f.prix)E.prods.forEach(p=>{p.prix=Math.round(p.prix*f.prix/100)*100});
  ['demande','achat','vit'].forEach(k=>{if(f[k])E.effets.push({type:k,v:f[k][0],fin:E.jour+f[k][1]})});
  if(f.fournisseur)E.effets.push({type:'fournisseur',id:f.fournisseur[0],fin:E.jour+f.fournisseur[1]});
  if(f.stockPlus){const per=Math.round(f.stockPlus/Math.max(1,E.prods.length));E.prods.forEach(p=>{const q=secteur(E.sect).prod.find(x=>x.id===p.id),n=Math.floor(per/q.cout);p.stock=Math.min(capaciteStock(E),p.stock+n)})}
  if(f.agence){if(E.cash>=coutAgence(E)){const r=ouvrirAgence(E,E.lieu==='zando'?'liberte':'zando');msg=r.msg}else msg='Pas assez de trésorerie pour ouvrir l’agence.'}
  if(c.comp)Object.keys(c.comp).forEach(k=>gagner(E,k,c.comp[k]));if(c.bon)gagner(E,'decision',2);else gagner(E,'decision',.5);
  noter(E,'Événement « '+ev.titre.replace(/^[^\wÀ-ÿ]+/,'')+' » : '+c.t,null,0);E.ev=null;return {msg,bon:!!c.bon}}
// ---------- bilan d'un scénario
export function bilan(E){
  const h=E.fin.hist.slice(-E.scen.duree),ca=h.reduce((t,x)=>t+x.ca,0),benef=h.reduce((t,x)=>t+x.benef,0),jRent=h.filter(x=>x.benef>0).length,cles=[];
  const erreurs=[];if(E.err.rupture)erreurs.push('Ruptures de stock : '+E.err.rupture+' client(s) perdu(s).');if(E.err.retard)erreurs.push('Retards de livraison subis : '+E.err.retard+' (pense à comparer les fournisseurs).');if(E.err.tresorerie)erreurs.push('Difficultés de trésorerie : '+E.err.tresorerie+' fois (salaires ou charges non payés à temps).');if(E.err.depart)erreurs.push('Départs d’employés : '+E.err.depart+' (motivation insuffisante).');if(E.err.perte>3)erreurs.push('Jours déficitaires ou pertes de marchandises : '+E.err.perte+'.');
  const forts=COMPETENCES.map(c=>[c[1],Math.round(E.comp[c[0]]||0)]).sort((a,b)=>b[1]-a[1]);
  const objectif=E.cash+valeurStock(E)-E.dette>=E.scen.cash0*1.1;
  return {n:E.scen.n,jours:h.length,ca,benef,jRent,cash:E.cash,rep:Math.round(E.rep),nette:valeurNette(E),reussi:objectif&&E.rep>=45,erreurs,forts:forts.slice(0,3),faibles:forts.slice(-2),decisions:E.journal.slice(-8).map(x=>'J'+x.j+' : '+x.t),niveau:niveau(E)}}
export function nouveauScenario(E){E.scen={n:E.scen.n+1,debut:E.jour,duree:15,cash0:E.cash+valeurStock(E)-E.dette};E.bilan=null;E.err={rupture:0,perte:0,retard:0,tresorerie:0,depart:0}}
