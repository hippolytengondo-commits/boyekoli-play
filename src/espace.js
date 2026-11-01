import * as C from './cloud.js';
import {makeEvalViews} from './evalviews.js';

// Comptes, classes et missions de classe. Vocabulaire : côté élève « mission de classe » ;
// le mot « devoir » n'apparaît que dans l'espace enseignant (cahier des charges, 27.4).
const ROLES={eleve:'Élève',enseignant:'Enseignant',parent:'Parent',etablissement:'Établissement',admin:'Administrateur'};
export function makeEspace(x){
  const {esc,PROGRAMME,CONTENU,missionCle}=x;
  const D=()=>x.G.dialog;
  const maj=p=>{Object.assign(D(),p);x.renderDialog()};
  const val=id=>{const e=document.getElementById(id);return e?e.value.trim():''};
  const pct=(p,t)=>t?Math.round(100*p/t):0;
  const sc=(p,t)=>p===null||p===undefined?'—':p+' sur '+t+' ('+pct(p,t)+' %)';
  const cleInfo=k=>{const[n,m,i]=k.split('|');const N=PROGRAMME.find(a=>a.id===n),M=N&&N.matieres.find(a=>a.id===m);return {n:N,m:M,i:+i,titre:M?M.missions[+i]:k,nom:N?N.nom:'',mat:M?M.nom:''}};
  const jouables=()=>{const o=[];PROGRAMME.forEach(n=>n.matieres.forEach(m=>m.missions.forEach((t,i)=>{const k=missionCle(n.id,m.id,i);if(CONTENU[k])o.push({n,m,i,k,t})})));return o};
  const entete=(t)=>`<div class="hd"><h3>${esc(t)}</h3></div>`;
  const retour=(vue,lib)=>`<button class="s" onclick="espGo('${vue}')">${lib||'← Retour'}</button>`;
  const msg=d=>d.msg?`<p class="${d.erreur?'ko':'ok'}">${esc(d.msg)}</p>`:'';

  const EV=makeEvalViews({esc,D,maj,val,entete,retour,msg,lire:t=>x.lire&&x.lire(t),apres:()=>afaire(false)});
  // ce qui attend l'élève : communiqués non lus et évaluations ouvertes (notification de rattrapage à la connexion)
  async function afaire(notifier){
    const s=C.session();if(!s||s.role!=='eleve')return;
    const r=await EV.rattrapage();if(!r)return;
    const d=D();if(d&&d.kind==='esp')maj({afaire:r});
    if(notifier&&(r.communiques||r.evaluations)){
      const t=[];if(r.communiques)t.push('📢 '+r.communiques+' communiqué'+(r.communiques>1?'s':'')+' non lu'+(r.communiques>1?'s':''));
      if(r.evaluations)t.push('📝 '+r.evaluations+' évaluation'+(r.evaluations>1?'s':'')+' à passer'+(r.prochaine_fermeture?' (avant le '+new Date(r.prochaine_fermeture).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})+')':''));
      x.toast&&x.toast(t.join(' · '));
    }
  }
  function html(d){
    const s=C.session();
    if(d.vue==='nouveaumdp')return vueNouveauMdp(d);
    if(d.vue==='form')return vueForm(d);
    if(d.vue==='oubli')return vueOubli(d);
    if(d.vue==='attente')return vueAttente(d);
    if(!s)return vueAccueil(d);
    {const ev=EV.html(d);if(ev!==null)return ev}
    if(d.vue==='choix')return vueChoix(d);
    if(d.vue==='rejoindre')return vueRejoindre(d);
    if(d.vue==='choixclasse')return vueChoixClasse(d);
    if(d.vue==='mm')return vueMesMissions(d);
    if(d.vue==='classes')return vueClasses(d);
    if(d.vue==='classe')return vueClasse(d);
    if(d.vue==='erreurs')return vueErreurs(d);
    if(d.vue==='nouvclasse')return vueNouvClasse(d);
    if(d.vue==='nouvdevoir')return vueNouvDevoir(d);
    if(d.vue==='devoir')return vueDevoir(d);
    if(d.vue==='bilan')return vueBilan(d);
    if(d.vue==='ecole')return vueEcole(d);
    if(d.vue==='admin')return vueAdmin(d);
    if(d.vue==='ecoledet')return vueEcoleDet(d);
    if(d.vue==='codeparent')return vueCodeParent(d);
    if(d.vue==='enfants')return vueEnfants(d);
    if(d.vue==='enfant')return vueEnfant(d);
    return vueCompte(d,s);
  }

  // ---------- accueil / formulaires ----------
  function vueAccueil(d){
    return entete('👤 Mon compte')+msg(d)+`<p style="font-size:13px">Tu peux jouer sans compte. Un compte gratuit sert à garder ta progression sur plusieurs appareils et à rejoindre une classe.</p>`
      +`<button onclick="espForm('creer','eleve')">🎒 Je suis un élève : créer mon compte</button>`
      +`<button onclick="espForm('creer','enseignant')">👩‍🏫 Je suis enseignant : créer mon compte</button>`
      +`<button onclick="espForm('creer','parent')">👨‍👩‍👧 Je suis parent : créer mon compte</button>`
      +`<button onclick="espForm('creer','etablissement')">🏛 Je représente un établissement (école) : créer son compte</button>`
      +`<button class="p" onclick="espForm('connecter','eleve')">🔑 J’ai déjà un compte : me connecter</button>`
      +`<button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  const PSEUDO_OK=/^[A-Za-z0-9_.-]{3,20}$/;
  const adulte=r=>r==='enseignant'||r==='parent'||r==='etablissement'||r==='admin';
  function vueForm(d){
    const creer=d.mode==='creer',ad=adulte(d.role);
    let h=entete(creer?'Créer mon compte '+({enseignant:'enseignant',parent:'parent',etablissement:'établissement'}[d.role]||'élève'):'Me connecter')+msg(d);
    if(!creer){
      h+=`<div class="row"><button class="${ad?'':'p'}" onclick="espForm('connecter','eleve')">🎒 Élève</button><button class="${ad?'p':''}" onclick="espForm('connecter','enseignant')">👤 Adulte</button></div>`;
    }
    if(creer&&!ad){
      h+=`<p style="font-size:13px">Choisis un pseudonyme (3 à 20 caractères : lettres, chiffres, point, tiret). Ton <b>mot de passe, c’est ta date de naissance</b> : tu ne l’oublieras jamais !</p>`
       +`<input id="espPseudo" maxlength="20" placeholder="Pseudonyme" autocomplete="username" value="${esc(d.pseudo||'')}">`
       +`<input id="espNaiss" inputmode="numeric" maxlength="10" placeholder="Date de naissance : JJ/MM/AAAA" autocomplete="off" value="${esc(d.naiss||'')}">`;
    }else if(creer&&d.role!=='etablissement'&&d.canal==='tel'){
      h+=`<div class="row"><button onclick="espCanal('mail')">📧 Adresse Gmail</button><button class="p" onclick="espCanal('tel')">📱 Numéro de téléphone</button></div>`
       +`<p style="font-size:13px">Pas d’adresse e-mail ? Crée ton compte avec ton <b>numéro de téléphone</b>. Le pseudonyme est le nom affiché dans le jeu.</p>`
       +`<input id="espPseudo" maxlength="20" placeholder="Pseudonyme du compte (nom affiché)" autocomplete="nickname" value="${esc(d.pseudo||'')}">`
       +`<input id="espTel" type="tel" inputmode="tel" maxlength="20" placeholder="Numéro de téléphone (ex. 0812345678 ou +243812345678)" autocomplete="tel" value="${esc(d.tel||'')}">`
       +`<input id="espMdp" type="password" maxlength="72" placeholder="Mot de passe (8 caractères au moins)" autocomplete="new-password">`
       +`<input id="espMdp2" type="password" maxlength="72" placeholder="Retape le mot de passe" autocomplete="new-password">`;
    }else if(creer){
      h+=(d.role!=='etablissement'?`<div class="row"><button class="p" onclick="espCanal('mail')">📧 Adresse Gmail</button><button onclick="espCanal('tel')">📱 Numéro de téléphone</button></div>`:'')
       +`<p style="font-size:13px">Utilise ton adresse <b>Gmail</b> : elle sert à confirmer ton compte et à retrouver ton mot de passe si tu l’oublies. Le pseudonyme est le nom affiché dans le jeu.</p>`
       +(d.role==='etablissement'?`<input id="espEcoleNom" maxlength="80" placeholder="Nom de l’établissement (école)" autocomplete="organization" value="${esc(d.ecoleNom||'')}"><p style="font-size:12px;opacity:.8">Ton établissement est créé avec un essai gratuit de 30 jours (60 élèves). Le code à donner à tes enseignants apparaît dans « Mon établissement ».</p>`:'')
       +`<input id="espPseudo" maxlength="20" placeholder="Pseudonyme du compte (nom affiché)" autocomplete="nickname" value="${esc(d.pseudo||'')}">`
       +`<input id="espEmail" type="email" maxlength="80" placeholder="Adresse Gmail" autocomplete="email" value="${esc(d.email||'')}">`
       +`<input id="espMdp" type="password" maxlength="72" placeholder="Mot de passe (8 caractères au moins)" autocomplete="new-password">`
       +`<input id="espMdp2" type="password" maxlength="72" placeholder="Retape le mot de passe" autocomplete="new-password">`;
    }else if(!ad){
      h+=`<p style="font-size:13px">Entre ton pseudonyme et ta date de naissance.</p>`
       +`<input id="espPseudo" maxlength="20" placeholder="Pseudonyme" autocomplete="username" value="${esc(d.pseudo||'')}">`
       +`<input id="espNaiss" inputmode="numeric" maxlength="10" placeholder="Date de naissance : JJ/MM/AAAA" autocomplete="off">`;
    }else{
      h+=`<p style="font-size:13px">Entre ton adresse Gmail ou ton numéro de téléphone, et ton mot de passe.</p>`
       +`<input id="espPseudo" maxlength="80" placeholder="Adresse Gmail, numéro de téléphone ou pseudonyme" autocomplete="username" value="${esc(d.pseudo||'')}">`
       +`<input id="espMdp" type="password" maxlength="72" placeholder="Mot de passe" autocomplete="current-password">`;
    }
    h+=`<button class="p" ${d.occupe?'disabled':''} onclick="espValider()">${d.occupe?'Un instant…':(creer?'Créer mon compte':'Me connecter')}</button>`;
    if(creer&&ad&&d.role!=='etablissement'&&d.canal==='tel')h+=`<p style="font-size:12px;padding:8px 10px;border-radius:10px;background:#fff3cd;color:#664d03">⚠ <b>Important :</b> avec un numéro de téléphone, il n’y a pas d’e-mail de récupération. Si tu perds ton mot de passe ou ton téléphone, il sera <b>difficile de retrouver ton compte</b>. Note ton mot de passe dans un endroit sûr.</p>`;
    if(!creer&&ad)h+=`<button onclick="espGo('oubli')">Mot de passe oublié ?</button>`;
    if(!creer&&!ad)h+=`<p style="font-size:12px;opacity:.8">Mot de passe oublié ? C’est ta date de naissance. Tu es enseignant ou parent ? Choisis « Adulte ».</p>`;
    return h+`<button class="s" onclick="espGo('')">← Retour</button>`;
  }
  // « 12/03/2012 », « 12-03-2012 » ou « 12032012 » → 12032012 ; null si ce n'est pas une vraie date
  // saisie de la date de naissance : les « / » s'ajoutent tout seuls (JJ/MM/AAAA)
  document.addEventListener('input',e=>{
    const t=e.target;if(!t||t.id!=='espNaiss')return;
    const c=t.value.replace(/\D/g,'').slice(0,8);
    t.value=c.length>4?c.slice(0,2)+'/'+c.slice(2,4)+'/'+c.slice(4):c.length>2?c.slice(0,2)+'/'+c.slice(2):c;
  });
  function dateNaissance(t){
    const c=String(t||'').replace(/\D/g,'');
    if(c.length!==8)return null;
    const j=+c.slice(0,2),m=+c.slice(2,4),a=+c.slice(4),an=new Date().getFullYear();
    if(m<1||m>12||j<1||a<1950||a>an-3)return null;
    const fin=new Date(a,m,0).getDate();if(j>fin)return null;
    return c;
  }
  async function valider(){
    const d=D(),creer=d.mode==='creer',ad=adulte(d.role),pseudo=val('espPseudo');
    if(creer&&!ad){
      const dn=dateNaissance(val('espNaiss'));
      if(!pseudo){maj({msg:'Écris ton pseudonyme.',erreur:true});return}
      if(!PSEUDO_OK.test(pseudo)){maj({msg:'Le pseudonyme doit avoir 3 à 20 caractères : lettres, chiffres, point, tiret ou _ (pas d’espace ni d’accent).',erreur:true,pseudo:pseudo,naiss:val('espNaiss')});return}
      if(!dn){maj({msg:'Écris ta date de naissance sous la forme JJ/MM/AAAA (par exemple 14/03/2012).',erreur:true,pseudo:pseudo,naiss:val('espNaiss')});return}
      maj({occupe:true,msg:'',pseudo:pseudo,naiss:val('espNaiss')});
      const r=await C.inscrire(pseudo,dn,'eleve',null);
      if(!r.ok){maj({occupe:false,msg:r.err,erreur:true});return}
      maj({occupe:false,vue:'',msg:'',erreur:false,naiss:''});await synchroniser();return;
    }
    if(creer&&d.canal==='tel'&&d.role!=='etablissement'){
      const tel=val('espTel'),m1=document.getElementById('espMdp').value,m2=document.getElementById('espMdp2').value;
      if(!pseudo){maj({msg:'Écris ton pseudonyme.',erreur:true,tel:tel});return}
      if(!PSEUDO_OK.test(pseudo)){maj({msg:'Le pseudonyme doit avoir 3 à 20 caractères : lettres, chiffres, point, tiret ou _ (pas d’espace ni d’accent).',erreur:true,tel:tel,pseudo:pseudo});return}
      if(!C.estTel(tel)){maj({msg:'Écris un numéro de téléphone valide (par exemple 0812345678 ou +243812345678).',erreur:true,pseudo:pseudo,tel:tel});return}
      if(m1.length<8){maj({msg:'Le mot de passe doit avoir au moins 8 caractères.',erreur:true,pseudo:pseudo,tel:tel});return}
      if(m1!==m2){maj({msg:'Les deux mots de passe ne sont pas identiques.',erreur:true,pseudo:pseudo,tel:tel});return}
      maj({occupe:true,msg:'',pseudo:pseudo,tel:tel});
      const r=await C.inscrireTel(pseudo,tel,m1,d.role);
      if(!r.ok){maj({occupe:false,msg:r.err,erreur:true});return}
      maj({occupe:false,vue:'',msg:'',erreur:false});await synchroniser();return;
    }
    if(creer){
      const email=val('espEmail'),m1=document.getElementById('espMdp').value,m2=document.getElementById('espMdp2').value;
      const ecole=d.role==='etablissement'?val('espEcoleNom'):'';
      const er=t=>maj({msg:t,erreur:true,occupe:false,pseudo:pseudo,email:email,ecoleNom:ecole});
      if(d.role==='etablissement'&&ecole.length<2)return er('Écris le nom de l’établissement (dans le premier champ).');
      if(!pseudo)return er('Écris ton pseudonyme.');
      if(!PSEUDO_OK.test(pseudo))return er('Le pseudonyme doit avoir 3 à 20 caractères : lettres, chiffres, point, tiret ou _ (pas d’espace ni d’accent).');
      if(!C.estGmail(email))return er('Écris une adresse Gmail valide (par exemple nom@gmail.com).');
      if(m1.length<8)return er('Le mot de passe doit avoir au moins 8 caractères.');
      if(m1!==m2)return er('Les deux mots de passe ne sont pas identiques.');
      maj({occupe:true,msg:'',pseudo:pseudo,email:email,ecoleNom:ecole});
      const r=await C.inscrireAdulte(pseudo,email,m1,d.role,ecole);
      if(!r.ok){maj({occupe:false,msg:r.err,erreur:true,pseudo:pseudo,email:email,ecoleNom:ecole});return}
      if(r.attente){maj({occupe:false,vue:'attente',email:email,msg:'',erreur:false});return}
      maj({occupe:false,vue:'',msg:'',erreur:false});await synchroniser();return;
    }
    // connexion
    let mdp;
    if(ad){mdp=document.getElementById('espMdp').value}
    else{const dn=dateNaissance(val('espNaiss'));mdp=dn||val('espNaiss')}
    if(!pseudo||!mdp){maj({msg:ad?'Écris ton adresse Gmail (ou ton numéro) et ton mot de passe.':'Écris ton pseudonyme et ta date de naissance.',erreur:true,pseudo:pseudo});return}
    maj({occupe:true,msg:'',pseudo:pseudo});
    const r=await C.connecter(pseudo,mdp);
    if(!r.ok){maj({occupe:false,msg:r.err,erreur:true,pseudo:pseudo});return}
    maj({occupe:false,vue:'',msg:'',erreur:false});
    await synchroniser();
  }
  // ---------- compte adulte : attente de confirmation, mot de passe oublié ----------
  function vueAttente(d){
    return entete('📧 Confirme ton adresse Gmail')+`<p style="font-size:14px">Un e-mail a été envoyé à <b>${esc(d.email||'')}</b>. Ouvre ta boîte Gmail (regarde aussi dans « Spam »), clique sur le lien de confirmation, puis reviens ici te connecter.</p>`
      +`<button class="p" onclick="espForm('connecter','enseignant')">J’ai confirmé : me connecter</button><button class="s" onclick="closeDialog()">Fermer</button>`;
  }
  function vueOubli(d){
    return entete('🔐 Mot de passe oublié')+msg(d)+`<p style="font-size:13px">Écris l’adresse Gmail de ton compte : tu recevras un e-mail avec un lien pour choisir un nouveau mot de passe.</p>`
      +`<input id="espEmail" type="email" maxlength="80" placeholder="Adresse Gmail" autocomplete="email" value="${esc(d.email||'')}">`
      +`<button class="p" ${d.occupe?'disabled':''} onclick="espOubli()">${d.occupe?'Un instant…':'Envoyer le lien'}</button>`+`<button class="s" onclick="espForm('connecter','enseignant')">← Retour</button>`;
  }
  async function oubli(){
    const email=val('espEmail');
    if(C.estTel(email)){maj({msg:'Un compte créé avec un numéro de téléphone n’a pas de récupération automatique : contacte l’administrateur de la plateforme.',erreur:true,email:email});return}
    if(!C.estGmail(email)){maj({msg:'Écris une adresse Gmail valide.',erreur:true,email:email});return}
    maj({occupe:true,msg:'',email:email});
    const r=await C.demanderReset(email);
    if(!r.ok){maj({occupe:false,msg:r.err,erreur:true});return}
    maj({occupe:false,msg:'Si un compte existe avec cette adresse, un e-mail vient d’être envoyé. Ouvre-le et clique sur le lien (regarde aussi dans « Spam »).',erreur:false});
  }
  function vueNouveauMdp(d){
    return entete('🔐 Nouveau mot de passe')+msg(d)+`<p style="font-size:13px">Choisis un nouveau mot de passe (8 caractères au moins).</p>`
      +`<input id="espMdp" type="password" maxlength="72" placeholder="Nouveau mot de passe" autocomplete="new-password">`
      +`<input id="espMdp2" type="password" maxlength="72" placeholder="Retape le mot de passe" autocomplete="new-password">`
      +`<button class="p" ${d.occupe?'disabled':''} onclick="espNouveauMdp()">${d.occupe?'Un instant…':'Enregistrer'}</button>`;
  }
  async function nouveauMdp(){
    const d=D(),m1=document.getElementById('espMdp').value,m2=document.getElementById('espMdp2').value;
    if(m1.length<8){maj({msg:'Le mot de passe doit avoir au moins 8 caractères.',erreur:true});return}
    if(m1!==m2){maj({msg:'Les deux mots de passe ne sont pas identiques.',erreur:true});return}
    maj({occupe:true,msg:''});
    const r=await C.nouveauMotDePasse(d.jeton,m1);
    if(!r.ok){maj({occupe:false,msg:r.err,erreur:true});return}
    maj({occupe:false,vue:'',jeton:null,msg:'Mot de passe changé. Tu es connecté.',erreur:false});await synchroniser();
  }
  // après connexion : récupérer ou envoyer la progression
  async function synchroniser(){
    const r=await C.lireSauvegarde();
    if(!r.ok){maj({vue:'',msg:'Connecté. La progression sera envoyée plus tard.',erreur:false});return}
    if(r.data&&r.data.data&&r.data.data.nom){
      C.fixerPlancher(Object.keys((r.data.data.adv&&r.data.data.adv.done)||{}).length);
      if(!x.aProgression()){x.applySave(r.data.data);maj({vue:'',msg:'Bienvenue ! Ta progression a été récupérée.',erreur:false});return}
      maj({vue:'choix',distant:r.data.data});return;
    }
    if(x.aProgression())C.envoyerSauvegarde(x.getSave());
    maj({vue:'',msg:'Compte connecté. Ta progression est sauvegardée.',erreur:false});
    afaire(true);
  }
  function vueChoix(d){
    const a=d.distant&&d.distant.adv||{},nb=Object.keys(a.done||{}).length;
    return entete('Quelle progression garder ?')+`<p style="font-size:13px">Ton compte contient déjà une partie : <b>${esc(d.distant.nom||'')}</b>, ${nb} mission(s) accomplies, ${a.pieces||0} 🪙.</p>`
      +`<button class="p" onclick="espChoisir('compte')">Récupérer la partie de mon compte</button>`
      +`<button onclick="espChoisir('ici')">Garder la partie de cet appareil (elle remplacera celle du compte)</button>`;
  }
  function choisir(w){
    const d=D();
    if(w==='compte'){x.applySave(d.distant);maj({vue:'',distant:null,msg:'Ta progression a été récupérée.',erreur:false})}
    else{C.fixerPlancher(0);C.envoyerSauvegarde(x.getSave());maj({vue:'',distant:null,msg:'Ta progression de cet appareil est sauvegardée.',erreur:false})}
  }

  // ---------- compte connecté ----------
  function vueCompte(d,s){
    let h=entete('👤 '+s.pseudo+' · '+(ROLES[s.role]||s.role))+msg(d);
    const att=C.enAttente();
    if(att)h+=`<p style="font-size:12px;opacity:.75">${att} résultat(s) seront envoyés dès que la connexion revient.</p>`;
    if(s.role==='enseignant'){
      h+=`<button class="p" onclick="espGo('classes')">🏫 Espace enseignant : mes classes et missions de classe</button>`
        +`<button onclick="openProg()">🎓 Essayer les missions moi-même</button>`
        +`<button onclick="espGo('ecole')">🏛 Mon établissement : licence, enseignants, classes</button>`
        +`<p style="font-size:12px;opacity:.75">Ton activité de jeu n’influence jamais les résultats de tes élèves.</p>`;
    }else if(s.role==='etablissement'){
      h+=`<button class="p" onclick="espGo('ecole')">🏛 Mon établissement : créer mes classes, enseignants, licence</button>`
        +`<button onclick="espGo('classes')">🏫 Mes classes : élèves et questions ratées</button>`
        +`<button onclick="openProg()">🎓 Voir les missions scolaires</button>`
        +`<p style="font-size:12px;opacity:.75">Donne le code de ton établissement à tes enseignants : ils le saisissent dans leur compte pour rejoindre l’école.</p>`;
    }else if(s.role==='admin'){
      h+=`<button class="p" onclick="espGo('admin')">🛠 Tableau de bord de la plateforme</button>`
        +`<button onclick="espGo('ecole')">🏛 Mes établissements</button>`;
    }else if(s.role==='parent'){
      h+=`<button class="p" onclick="espGo('enfants')">👨‍👩‍👧 Mes enfants : suivre leurs progrès</button>`
        +`<p style="font-size:12px;opacity:.75">Demande à ton enfant son « code parent » (dans son compte élève) pour le relier à ton compte.</p>`;
    }else{
      if(!d.afaire){afaire(false)}
      const af=d.afaire||{};
      h+=`<button class="p" onclick="espGo('mm')">📘 Mes missions de classe</button>`
        +`<button onclick="espEv('evmes')">📝 Mes évaluations${af.evaluations?' · 🔔 '+af.evaluations+' à passer':''}</button>`
        +`<button onclick="espEv('commes')">📢 Communiqués${af.communiques?' · 🔵 '+af.communiques+' non lu'+(af.communiques>1?'s':''):''}</button>`
        +`<button onclick="espGo('rejoindre')">Rejoindre une classe avec un code</button>`
        +`<button onclick="espGo('codeparent')">👨‍👩‍👧 Mon code parent</button>`;
    }
    h+=`<button onclick="espSauver()">☁ Sauvegarder ma progression maintenant</button>`
      +`<button onclick="espDeco()">Me déconnecter</button>`
      +`<button class="s" onclick="closeDialog()">Fermer</button>`;
    return h;
  }
  async function sauver(){
    maj({msg:'Envoi en cours…',erreur:false});
    const r=await C.envoyerSauvegarde(x.getSave());
    maj({msg:r.ok?'Progression sauvegardée dans ton compte.':(r.err||'Envoi impossible pour le moment.'),erreur:!r.ok});
  }
  function deco(){C.deconnecter();maj({vue:'',msg:'Tu es déconnecté. Ta partie reste sur cet appareil.',erreur:false})}

  // ---------- élève ----------
  function vueRejoindre(d){
    return entete('Rejoindre une classe')+msg(d)+`<p style="font-size:13px">Saisis le code de ta classe (6 lettres ou chiffres), donné par ton enseignant, ou le code de ton établissement (8 caractères) pour choisir ta classe dans la liste.</p>`
      +`<input id="espCode" maxlength="8" placeholder="CODE" style="text-transform:uppercase" autocomplete="off">`
      +`<button class="p" onclick="espRejoindre()">Rejoindre</button>`+retour('');
  }
  async function rejoindre(){
    const code=val('espCode');if(!code){maj({msg:'Écris le code de la classe.',erreur:true});return}
    if(code.length>6){
      const l=await C.rpc('classes_par_code_ecole',{p_code:code});
      if(!l.ok){maj({msg:l.err,erreur:true});return}
      if(!l.data||!l.data.length){maj({msg:'Code d’établissement inconnu, ou aucune classe créée pour le moment.',erreur:true});return}
      maj({vue:'choixclasse',choix:l.data,msg:'',erreur:false});return;
    }
    return rejoindreCode(code);
  }
  function vueChoixClasse(d){
    return entete('Choisis ta classe')+msg(d)+d.choix.map(c=>`<button class="p" onclick="espRejoindreCode('${esc(c.code)}')">${esc(c.nom)}</button>`).join('')+retour('')
  }
  async function rejoindreCode(code){
    const r=await C.rpc('join_class',{p_code:code});
    if(!r.ok){maj({vue:'rejoindre',msg:r.err,erreur:true});return}
    maj({vue:'mm',msg:'Tu as rejoint la classe !',erreur:false,liste:null});
    chargerMM();
  }
  function vueMesMissions(d){
    let h=entete('📘 Mes missions de classe')+msg(d);
    if(!d.liste){chargerMM();return h+'<p>Chargement…</p>'+retour('')}
    if(!d.liste.length)h+=`<p style="font-size:13px">Pas encore de mission de classe. Si ton enseignant ou ton établissement t’a donné un code de classe, rejoins-la.</p>`;
    d.liste.forEach(a=>{
      let p=0,t=0,faites=0;
      a.missions.forEach(k=>{const r=d.res&&d.res[a.id+'|'+k];if(r&&r.total){p+=r.pts;t+=r.total;faites++}});
      h+=`<h4>${esc(a.titre)}</h4>`+(a.consigne?`<p style="font-size:13px">${esc(a.consigne)}</p>`:'');
      if(faites)h+=`<p style="font-size:13px;margin:0 0 4px">Ton score : <b>${p} sur ${t}</b> (${pct(p,t)} %) · ${faites}/${a.missions.length} mission(s) faite(s)</p>`;
      a.missions.forEach(k=>{
        const c=cleInfo(k),ok=!!CONTENU[k],r=d.res&&d.res[a.id+'|'+k];
        const score=r&&r.total?`<b>${r.pts} sur ${r.total}</b> · ${pct(r.pts,r.total)} %${r.n>1?' · '+r.n+' essais':''}`:'▶';
        h+=ok?`<button onclick="espJouer('${a.id}','${k}')">${score} · ${esc(c.mat)} · ${esc(c.titre)}</button>`
             :`<button disabled>🔒 ${esc(c.titre)} (bientôt)</button>`;
      });
    });
    return h+retour('');
  }
  async function chargerMM(){
    const a=await C.lireTable('assignments?select=id,titre,consigne,missions,echeance,created_at&order=created_at.desc');
    if(!a.ok){maj({liste:[],msg:a.err,erreur:true});return}
    const r=await C.lireTable('mission_results?select=assignment_id,mission_key,pts,total,attempts&assignment_id=not.is.null');
    const res={};(r.ok?r.data:[]).forEach(z=>{res[z.assignment_id+'|'+z.mission_key]={pts:z.pts,total:z.total,n:z.attempts}});
    if(D()&&D().kind==='esp')maj({liste:a.data,res:res});
  }
  function jouer(aid,k){
    const c=cleInfo(k);
    x.startMission(c.n.id,c.m.id,c.i,{assignment:aid,retourEsp:true});
  }


  // ---------- questions mal répondues (enseignant, établissement, parent) ----------
  const libMission=k=>{
    if(String(k).startsWith('cur:')){const c=cleInfo(String(k).slice(4));return (c.nom?c.nom+' · ':'')+(c.mat?c.mat+' · ':'')+(c.titre||'')}
    return 'Mission d’exploration';
  };
  function vueErreurs(d){
    let h=entete('🔎 '+(d.errTitre||'Questions à revoir'))+msg(d);
    if(!d.erreurs){chargerErreurs();return h+'<p>Chargement…</p>'+retour(d.errRetour||'','← Retour')}
    if(!d.erreurs.length)h+='<p style="font-size:13px">Aucune question ratée enregistrée pour le moment. 🎉</p>';
    d.erreurs.forEach(e=>{
      h+=`<div class="row" style="display:block;margin:8px 0;padding:8px;border:1px solid #e4d8b5;border-radius:10px"><b style="font-size:13px">${esc(e.question)}</b><br>`
        +(e.reponse?`<span style="font-size:12px;color:#c0392b">✖ Réponse donnée : ${esc(e.reponse)}</span><br>`:'')
        +(e.bonne?`<span style="font-size:12px;color:#1f7a4d">✔ Bonne réponse : ${esc(e.bonne)}</span><br>`:'')
        +`<span style="font-size:11px;opacity:.7">${e.mission?esc(libMission(e.mission))+' · ':''}${e.eleves?e.eleves+' élève(s) · ':''}${e.total||e.nb||1} erreur(s)</span></div>`;
    });
    return h+retour(d.errRetour||'','← Retour');
  }
  async function chargerErreurs(){
    const d=D();
    const r=d.errClasse?await C.rpc('erreurs_classe',{p_class:d.errClasse}):await C.rpc('erreurs_eleve',{p_student:d.errEleve,p_limite:100});
    if(D()&&D().vue==='erreurs')maj({erreurs:r.ok?(r.data||[]):[],msg:r.ok?'':r.err,erreur:!r.ok});
  }
  const ouvrirErreurs=(eleve,pseudo,retourVue)=>maj({vue:'erreurs',errEleve:eleve,errClasse:null,errTitre:'Questions ratées · '+pseudo,errRetour:retourVue,erreurs:null,msg:'',erreur:false});
  const ouvrirErreursClasse=()=>{const c=D().classe;maj({vue:'erreurs',errEleve:null,errClasse:c.id,errTitre:'Questions les plus ratées · '+c.nom,errRetour:'classe',erreurs:null,msg:'',erreur:false})};

  // ---------- enseignant ----------
  function vueClasses(d){
    let h=entete('🏫 Espace enseignant')+msg(d);
    if(!d.liste){chargerClasses();return h+'<p>Chargement…</p>'+retour('')}
    if(!d.liste.length)h+=`<p style="font-size:13px">Crée ta première classe : tes élèves la rejoindront avec un code.</p>`;
    h+=d.liste.map(c=>`<button onclick="espClasse('${c.id}')">${esc(c.nom)} · code <b>${esc(c.code)}</b></button>`).join('');
    const role=C.session().role;
    if(role==='etablissement')return h+`<p style="font-size:12px;opacity:.8">Les classes se créent dans « Mon établissement ».</p><button class="p" onclick="espGo('ecole')">🏛 Créer et gérer les classes de mon établissement</button>`+retour('');
    return h+`<button class="p" onclick="espGo('ecole')">🏛 Rejoindre une classe de mon établissement</button><button onclick="espGo('nouvclasse')">+ Créer une classe (enseignant sans établissement)</button>`+retour('');
  }
  async function chargerClasses(){
    const r=await C.lireTable('classes?select=id,nom,niveau,code&order=created_at.desc');
    if(!r.ok){maj({liste:[],msg:r.err,erreur:true});return}
    if(D()&&D().kind==='esp')maj({liste:r.data});
  }
  function vueNouvClasse(d){
    return entete('Nouvelle classe')+msg(d)
      +`<input id="espNom" maxlength="60" placeholder="Nom de la classe (ex. 1re A)">`
      +`<select id="espNiv">${PROGRAMME.map(n=>`<option value="${n.id}">${esc(n.nom)}</option>`).join('')}</select>`
      +`<button class="p" onclick="espCreerClasse()">Créer la classe</button>`+retour('classes');
  }
  async function creerClasse(){
    const nom=val('espNom');if(!nom){maj({msg:'Donne un nom à la classe.',erreur:true});return}
    const r=await C.rpc('create_class',{p_nom:nom,p_niveau:val('espNiv')});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({vue:'classes',liste:null,msg:'Classe créée. Donne le code '+r.data.code+' à tes élèves.',erreur:false});
  }
  function vueClasse(d){
    const c=d.classe;
    let h=entete(c.nom)+msg(d)+`<p>Code à donner aux élèves : <b style="font-size:22px;letter-spacing:3px">${esc(c.code)}</b></p>`;
    if(!d.eleves||!d.devoirs){chargerClasse(c.id);return h+'<p>Chargement…</p>'+retour('classes')}
    h+=`<h4>Élèves (${d.eleves.length})</h4>`+(d.eleves.length?d.eleves.map(e=>`<button onclick="espErreurs('${e.student_id}','${esc(e.profiles&&e.profiles.pseudo||'?').replace(/'/g,'’')}','classe')">🔎 ${esc(e.profiles&&e.profiles.pseudo||'?')} · questions à revoir</button>`).join('')+`<button onclick="espErreursClasse()">📊 Questions les plus ratées de la classe</button>`:'<p style="font-size:13px">Personne n’a encore rejoint la classe.</p>');
    h+=`<h4>Devoirs</h4>`+d.devoirs.map(v=>`<button onclick="espDevoir('${v.id}')">${esc(v.titre)} · ${v.missions.length} mission(s)</button>`).join('');
    h+=`<button class="p" onclick="espNouvDevoir('${c.id}')">+ Nouveau devoir</button><button onclick="espBilan()">📊 Bilan de la classe (pourcentages)</button>`
      +`<button onclick="espEv('evprof')">📝 Évaluations : créer, corriger, publier</button><button onclick="espEv('comprof')">📢 Communiqués : avec accusé de lecture</button>`+retour('classes');
    return h;
  }
  async function ouvrirClasse(id){
    const c=D().liste.find(z=>z.id===id);
    maj({vue:'classe',classe:c,eleves:null,devoirs:null,msg:''});
  }
  async function chargerClasse(id){
    const [m,a]=await Promise.all([C.lireTable('class_members?select=student_id,profiles(pseudo)&class_id=eq.'+id),C.lireTable('assignments?select=id,titre,consigne,missions,created_at&class_id=eq.'+id+'&order=created_at.desc')]);
    if(!m.ok||!a.ok){maj({eleves:[],devoirs:[],msg:(m.err||a.err),erreur:true});return}
    if(D()&&D().vue==='classe')maj({eleves:m.data,devoirs:a.data});
  }
  function vueNouvDevoir(d){
    const f=d.form||{};
    const nivs=PROGRAMME.filter(n=>n.matieres.some(m=>m.missions.some((t,i)=>CONTENU[missionCle(n.id,m.id,i)])));
    const nv=f.niv||(nivs[0]&&nivs[0].id),N=PROGRAMME.find(n=>n.id===nv);
    const mats=N?N.matieres.filter(m=>m.missions.some((t,i)=>CONTENU[missionCle(N.id,m.id,i)])):[];
    const mt=f.mat&&mats.find(m=>m.id===f.mat)?f.mat:(mats[0]&&mats[0].id),M=mats.find(m=>m.id===mt);
    const sel=f.sel||[];
    let h=entete('Nouveau devoir')+msg(d)
      +`<input id="espTitre" maxlength="80" placeholder="Titre du devoir" value="${esc(f.titre||'')}">`
      +`<input id="espConsigne" maxlength="300" placeholder="Consigne pour les élèves (facultatif)" value="${esc(f.consigne||'')}">`
      +`<select id="espNivSel" onchange="espForme()">${nivs.map(n=>`<option value="${n.id}" ${n.id===nv?'selected':''}>${esc(n.nom)}</option>`).join('')}</select>`
      +`<select id="espMatSel" onchange="espForme()">${mats.map(m=>`<option value="${m.id}" ${m.id===mt?'selected':''}>${esc(m.nom)}</option>`).join('')}</select>`
      +`<h4>Missions à attribuer (${sel.length} choisie(s))</h4>`;
    if(M)M.missions.forEach((t,i)=>{const k=missionCle(N.id,M.id,i);if(!CONTENU[k])return;
      h+=`<button onclick="espBasc('${k}')">${sel.includes(k)?'☑':'☐'} ${esc(t)}</button>`});
    h+=`<button class="p" onclick="espPublier()">Attribuer à la classe</button>`
      +`<button onclick="espPrevisu()" ${sel.length?'':'disabled'}>👁 Prévisualiser la 1re mission choisie (sans enregistrer)</button>`
      +retour('classe');
    return h;
  }
  function lireForme(){const d=D(),f=Object.assign({},d.form);f.titre=val('espTitre')||f.titre||'';f.consigne=val('espConsigne')||f.consigne||'';const n=val('espNivSel'),m=val('espMatSel');if(n)f.niv=n;if(m)f.mat=m;return f}
  function forme(){const f=lireForme();maj({form:f})}
  function basc(k){const f=lireForme();f.sel=(f.sel||[]).slice();const i=f.sel.indexOf(k);if(i>=0)f.sel.splice(i,1);else f.sel.push(k);maj({form:f})}
  async function publier(){
    const f=lireForme(),d=D();
    if(!f.titre){maj({form:f,msg:'Donne un titre au devoir.',erreur:true});return}
    if(!(f.sel||[]).length){maj({form:f,msg:'Choisis au moins une mission.',erreur:true});return}
    const r=await C.inserer('assignments',{class_id:d.classe.id,teacher_id:C.session().uid,titre:f.titre,consigne:f.consigne||null,missions:f.sel});
    if(!r.ok){maj({form:f,msg:r.err,erreur:true});return}
    maj({vue:'classe',form:null,eleves:null,devoirs:null,msg:'Devoir attribué à la classe.',erreur:false});
  }
  function previsu(){
    const f=lireForme();maj({form:f});
    const k=(f.sel||[])[0];if(!k)return;
    const c=cleInfo(k);x.startMission(c.n.id,c.m.id,c.i,{apercu:true});
  }
  async function ouvrirDevoir(id){
    maj({vue:'devoir',devoir:D().devoirs.find(v=>v.id===id),res:null,msg:''});
  }
  function lignesDevoir(v,res){
    // res : lignes {student_id,pseudo,mission_key,pts,total,last_pts,last_total,attempts}
    const par={};res.forEach(r=>{const e=par[r.pseudo]=par[r.pseudo]||{};if(r.mission_key)e[r.mission_key]=r});
    const noms=Object.keys(par).sort();
    const eleves=noms.map(n=>{let p=0,t=0,faites=0;v.missions.forEach(k=>{const r=par[n][k];if(r&&r.total){p+=r.pts;t+=r.total;faites++}});return {nom:n,p,t,faites,rows:par[n]}});
    const parMission=v.missions.map(k=>{let p=0,t=0,n=0;eleves.forEach(e=>{const r=e.rows[k];if(r&&r.total){p+=r.pts;t+=r.total;n++}});return {k,p,t,n}});
    let P=0,T=0;eleves.forEach(e=>{P+=e.p;T+=e.t});
    return {eleves,parMission,P,T};
  }
  function vueDevoir(d){
    const v=d.devoir;
    let h=entete(v.titre)+msg(d)+(v.consigne?`<p style="font-size:13px">${esc(v.consigne)}</p>`:'');
    if(!d.res){chargerDevoir(v.id);return h+'<p>Chargement des résultats…</p>'+retour('classe')}
    const L=lignesDevoir(v,d.res);
    if(!L.eleves.length)h+='<p style="font-size:13px">Aucun élève dans la classe pour le moment.</p>';
    else{
      h+=`<h4>Résultats (${v.missions.length} mission(s))</h4>`;
      L.eleves.forEach(e=>{
        h+=`<div class="row" style="display:block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(e.nom)}</b><span>${e.faites?`<b>${e.p} sur ${e.t}</b> · ${pct(e.p,e.t)} %`:'pas commencé'}</span></div>`
          +`<div style="font-size:11px;opacity:.75">${v.missions.map((k,i)=>{const r=e.rows[k];return 'M'+(i+1)+' : '+(r&&r.total?r.pts+'/'+r.total+(r.attempts>1?' ('+r.attempts+' essais, dernier '+r.last_pts+'/'+r.last_total+')':''):'—')}).join(' · ')}</div></div>`;
      });
      h+=`<h4>Bilan de la classe</h4><p style="font-size:14px;margin:2px 0">Total : <b>${L.P} sur ${L.T}</b> · moyenne <b>${pct(L.P,L.T)} %</b></p>`;
      h+=`<div style="font-size:12px">${L.parMission.map((m,i)=>'Mission '+(i+1)+' ('+esc(cleInfo(m.k).titre)+') : '+(m.t?pct(m.p,m.t)+' % · '+m.n+' élève(s)':'—')).join('<br>')}</div>`;
      h+=`<button onclick="espExport()">⬇ Exporter en tableau (CSV)</button>`;
    }
    return h+retour('classe','← Retour à la classe');
  }
  async function chargerDevoir(id){
    const r=await C.rpc('assignment_scores',{p_assignment:id});
    if(!r.ok){maj({res:[],msg:r.err,erreur:true});return}
    if(D()&&D().vue==='devoir')maj({res:r.data});
  }
  function exporterDevoir(){
    const d=D(),v=d.devoir;if(!d.res)return;
    const L=lignesDevoir(v,d.res);
    const q=x=>'"'+String(x).replace(/"/g,'""')+'"';
    const lignes=[['Élève',...v.missions.map((k,i)=>'M'+(i+1)+' '+cleInfo(k).titre),'Total','Sur','Pourcentage'].map(q).join(';')];
    L.eleves.forEach(e=>lignes.push([e.nom,...v.missions.map(k=>{const r=e.rows[k];return r&&r.total?r.pts+'/'+r.total:''}),e.p,e.t,pct(e.p,e.t)+' %'].map(q).join(';')));
    lignes.push(['Classe',...L.parMission.map(m=>m.t?pct(m.p,m.t)+' %':''),L.P,L.T,pct(L.P,L.T)+' %'].map(q).join(';'));
    const blob=new Blob(['\ufeff'+lignes.join('\r\n')],{type:'text/csv;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=('devoir-'+v.titre).replace(/[^\w.-]+/g,'_')+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);
  }

  // ---------- bilan de la classe (tous les devoirs) : pourcentages par élève et par matière ----------
  async function ouvrirBilan(){maj({vue:'bilan',bilan:null,msg:''})}
  async function chargerBilan(id){
    const r=await C.rpc('class_scores',{p_class:id});
    if(!r.ok){maj({bilan:[],msg:r.err,erreur:true});return}
    if(D()&&D().vue==='bilan')maj({bilan:r.data});
  }
  function vueBilan(d){
    let h=entete('📊 Bilan de la classe')+msg(d);
    if(!d.bilan){chargerBilan(d.classe.id);return h+'<p>Chargement…</p>'+retour('classe')}
    if(!d.bilan.length)return h+'<p style="font-size:13px">Aucun résultat pour le moment : attribue un devoir et attends que les élèves jouent.</p>'+retour('classe');
    const eleves={},matCl={};let P=0,T=0;
    d.bilan.forEach(r=>{
      const i=cleInfo(r.mission_key),mat=i.nom+' · '+i.mat;
      const e=eleves[r.pseudo]=eleves[r.pseudo]||{p:0,t:0,mats:{}};
      e.p+=r.pts;e.t+=r.total;(e.mats[mat]=e.mats[mat]||{p:0,t:0});e.mats[mat].p+=r.pts;e.mats[mat].t+=r.total;
      (matCl[mat]=matCl[mat]||{p:0,t:0});matCl[mat].p+=r.pts;matCl[mat].t+=r.total;P+=r.pts;T+=r.total;
    });
    h+=`<p style="font-size:15px">Classe : <b>${P} sur ${T}</b> · moyenne <b>${pct(P,T)} %</b></p>`;
    h+='<h4>Par matière (toute la classe)</h4>'+Object.keys(matCl).sort().map(m=>`<div class="row"><span>${esc(m)}</span><b>${matCl[m].p} sur ${matCl[m].t} · ${pct(matCl[m].p,matCl[m].t)} %</b></div>`).join('');
    h+='<h4>Par élève</h4>';
    Object.keys(eleves).sort().forEach(n=>{
      const e=eleves[n],ms=Object.keys(e.mats).map(m=>({m,p:e.mats[m].p,t:e.mats[m].t})).filter(x=>x.t>0).sort((a,b)=>pct(b.p,b.t)-pct(a.p,a.t));
      const fort=ms.length>1?ms[0]:null,faible=ms.length>1?ms[ms.length-1]:null;
      h+=`<div class="row" style="display:block"><div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(n)}</b><span><b>${e.p} sur ${e.t}</b> · ${pct(e.p,e.t)} %</span></div>`
        +(fort?`<div style="font-size:11px;opacity:.8">👍 ${esc(fort.m)} : ${pct(fort.p,fort.t)} % · 🎯 à renforcer : ${esc(faible.m)} : ${pct(faible.p,faible.t)} %</div>`:'')+'</div>';
    });
    return h+retour('classe','← Retour à la classe');
  }

  // ---------- établissements (enseignants) ----------
  const dateFr=t=>t?new Date(t).toLocaleDateString('fr-FR'):'—';
  function vueEcole(d){
    let h=entete('🏛 Mon établissement')+msg(d);
    if(!d.ecoles){chargerEcoles();return h+'<p>Chargement…</p>'+retour('')}
    h+=d.ecoles.length?d.ecoles.map(e=>`<button onclick="espEcole('${e.school_id}')">${esc(e.schools&&e.schools.nom||'?')} · ${e.role==='admin'?'administrateur':'enseignant'}</button>`).join('')
      :`<p style="font-size:13px">Tu n’es rattaché à aucun établissement. Crée celui de ton école (essai gratuit de 30 jours, 60 élèves) ou rejoins-le avec le code donné par son administrateur.</p>`;
    h+=`<input id="espEcNom" maxlength="80" placeholder="Nom de l’établissement"><button class="p" onclick="espCreerEcole()">+ Créer mon établissement</button>`
      +(C.session()&&C.session().role==='enseignant'?`<input id="espEcCode" maxlength="8" placeholder="Code de l’établissement" style="text-transform:uppercase" autocomplete="off"><button onclick="espRejoindreEcole()">Rejoindre un établissement</button>`:'');
    return h+retour('');
  }
  async function chargerEcoles(){
    const r=await C.lireTable('school_members?select=school_id,role,schools(nom)&user_id=eq.'+C.session().uid);
    if(!r.ok){maj({ecoles:[],msg:r.err,erreur:true});return}
    if(D()&&D().vue==='ecole'){
      if(r.data.length===1&&!D().retourListe){maj({vue:'ecoledet',ecoleId:r.data[0].school_id,ecole:null,mesClasses:null,ecoles:r.data,msg:''});return}
      maj({ecoles:r.data});
    }
  }
  async function creerEcole(){
    const nom=val('espEcNom');if(nom.length<2){maj({msg:'Écris le nom de l’établissement.',erreur:true});return}
    const r=await C.rpc('create_school',{p_nom:nom});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecoles:null,msg:'Établissement créé. Code à donner à tes collègues : '+r.data.code+'. Essai gratuit de 30 jours.',erreur:false});
  }
  async function rejoindreEcole(){
    const c=val('espEcCode');if(!c){maj({msg:'Écris le code de l’établissement.',erreur:true});return}
    const r=await C.rpc('join_school',{p_code:c});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecoles:null,msg:'Tu as rejoint l’établissement.',erreur:false});
  }
  function ouvrirEcole(id){maj({vue:'ecoledet',ecoleId:id,ecole:null,mesClasses:null,msg:''})}
  async function chargerEcoleDet(id){
    const [o,c]=await Promise.all([C.rpc('school_overview',{p_school:id}),C.lireTable('classes?select=id,nom,school_id&order=created_at.desc')]);
    if(!o.ok){maj({ecole:{erreur:true},msg:o.err,erreur:true});return}
    if(D()&&D().vue==='ecoledet')maj({ecole:Array.isArray(o.data)?o.data[0]:o.data,mesClasses:c.ok?c.data.filter(z=>z.school_id!==id):[]});
  }
  function vueEcoleDet(d){
    let h=entete('🏛 Établissement')+msg(d);
    if(!d.ecole){chargerEcoleDet(d.ecoleId);return h+'<p>Chargement…</p>'+retour('')}
    const e=d.ecole;if(e.erreur)return h+retour('');
    const admin=e.mon_role==='admin';
    h+=`<h4>${esc(e.nom)}</h4>`;
    if(admin&&e.code)h+=`<p>Code à donner aux enseignants : <b style="font-size:20px;letter-spacing:3px">${esc(e.code)}</b></p>`;
    if(admin)h+=`<h4>➕ Créer une classe</h4><p style="font-size:13px">C’est à l’établissement de créer les classes : tes enseignants les rejoignent ensuite avec le code de l’établissement.</p>`
      +`<input id="espClNom" maxlength="60" placeholder="Nom de la nouvelle classe (ex. 1re A)"><select id="espClNiv">${PROGRAMME.map(n=>`<option value="${n.id}">${esc(n.nom)}</option>`).join('')}</select><button class="p" onclick="espCreerClasseEcole('${e.school_id}')">+ Créer la classe</button>`;
    const actif=e.statut==='active';
    h+=`<div class="row" style="display:block"><b>Licence : ${e.plan==='essai'?'essai gratuit':e.plan==='ecole'?'établissement':'aucune'}</b> · <span style="color:${actif?'#1f7a4d':'#c0392b'}">${actif?'active':e.statut==='suspendue'?'suspendue':'expirée'}</span><br><span style="font-size:12px">${e.places||0} places · fin le ${dateFr(e.fin)} · ${e.eleves} élève(s) inscrit(s)</span></div>`;
    if(!actif||e.plan==='essai')h+=`<p style="font-size:12px;opacity:.8">Pour une licence d’établissement, contactez l’équipe BOYEKOLI PLAY : le paiement en ligne n’est pas encore disponible, la licence est activée par l’administrateur de la plateforme après accord.</p>`;
    if(admin&&e.enseignants&&e.enseignants.length)h+=`<h4>Enseignants</h4><p style="font-size:13px">${e.enseignants.map(t=>esc(t.pseudo)+(t.role==='admin'?' (admin)':'')).join(', ')}</p>`;
    const profs=(e.enseignants||[]).filter(t=>t.role==='enseignant');
    h+=`<h4>Classes de l’établissement (${(e.classes||[]).length})</h4>`;
    (e.classes||[]).forEach(c=>{
      h+=`<div class="row" style="display:block;margin:8px 0;padding:8px;border:1px solid #e4d8b5;border-radius:10px"><b>${esc(c.nom)}</b> · ${c.eleves} élève(s)${c.code?` · code <b>${esc(c.code)}</b>`:''}<br><span style="font-size:12px">Enseignant(s) : ${c.enseignants&&c.enseignants.length?esc(c.enseignants.join(', ')):'<i>aucun pour l’instant</i>'}</span>`;
      if(admin){
        h+=`<div class="row"><button onclick="espClasseOuvrir('${c.id}')">Ouvrir : élèves, évaluations, questions ratées</button></div>`;
        if(profs.length)h+=`<div style="display:flex;gap:6px"><select id="espAff${c.id}" style="flex:1">${profs.map(t=>`<option value="${t.id}">${esc(t.pseudo)}</option>`).join('')}</select><button onclick="espAffecter('${c.id}')">Affecter</button></div>`;
      }else if(c.mien)h+=`<div class="row"><button class="p" onclick="espClasseOuvrir('${c.id}')">Ouvrir ma classe</button><button onclick="espQuitterClasse('${c.id}')">Quitter</button></div>`;
      else h+=`<button class="p" onclick="espRejoindreClasse('${c.id}')">Rejoindre cette classe</button>`;
      h+='</div>';
    });
    if(!(e.classes||[]).length)h+=admin?'':'<p style="font-size:13px">Aucune classe pour l’instant : l’établissement doit d’abord en créer.</p>';
    if(d.mesClasses&&d.mesClasses.length){h+=`<h4>Rattacher une de mes anciennes classes</h4>`+d.mesClasses.map(c=>`<button onclick="espAttacher('${c.id}','${e.school_id}')">+ ${esc(c.nom)}</button>`).join('')}
    return h+retour('ecole');
  }

  async function creerClasseEcole(ec){
    const nom=val('espClNom');if(nom.length<2){maj({msg:'Donne un nom à la classe.',erreur:true});return}
    const r=await C.rpc('create_school_class',{p_school:ec,p_nom:nom,p_niveau:val('espClNiv')});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecole:null,mesClasses:null,msg:'Classe « '+nom+' » créée. Tes enseignants peuvent la rejoindre ; les élèves la rejoignent avec son code.',erreur:false});
  }
  async function affecter(cl){
    const t=val('espAff'+cl);if(!t){maj({msg:'Choisis un enseignant.',erreur:true});return}
    const r=await C.rpc('assign_class_teacher',{p_class:cl,p_teacher:t});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecole:null,mesClasses:null,msg:'Enseignant affecté à la classe.',erreur:false});
  }
  async function rejoindreClasseEns(cl){
    const r=await C.rpc('join_class_teacher',{p_class:cl});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecole:null,mesClasses:null,msg:'Tu as rejoint la classe. Elle apparaît dans « Espace enseignant ».',erreur:false});
  }
  async function quitterClasseEns(cl){
    const r=await C.rpc('retire_class_teacher',{p_class:cl,p_teacher:C.session().uid});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecole:null,mesClasses:null,msg:'Tu as quitté la classe.',erreur:false});
  }
  async function ouvrirClasseId(id){
    const r=await C.lireTable('classes?select=id,nom,niveau,code&id=eq.'+id);
    if(!r.ok||!r.data[0]){maj({msg:r.err||'Classe introuvable.',erreur:true});return}
    maj({vue:'classe',classe:r.data[0],eleves:null,devoirs:null,msg:''});
  }
  async function attacher(cl,ec){
    const r=await C.rpc('attach_class',{p_class:cl,p_school:ec});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({ecole:null,mesClasses:null,msg:'Classe rattachée à l’établissement.',erreur:false});
  }

  // ---------- administrateur de la plateforme (rôle attribué uniquement dans la base) ----------
  async function chargerAdmin(){
    const r=await C.rpc('admin_overview',{});
    if(!r.ok){maj({admin:{erreur:true},msg:r.err,erreur:true});return}
    if(D()&&D().vue==='admin')maj({admin:r.data});
  }
  function vueAdmin(d){
    let h=entete('🛠 Plateforme BOYEKOLI PLAY')+msg(d);
    if(!d.admin){chargerAdmin();return h+'<p>Chargement…</p>'+retour('')}
    if(d.admin.erreur)return h+retour('');
    const u=d.admin.utilisateurs||{};
    h+=`<h4>Comptes</h4><div class="row" style="display:block">`+Object.keys(ROLES).map(k=>`${ROLES[k]} : <b>${u[k]||0}</b>`).join(' · ')+`</div>`;
    h+=`<h4>Établissements (${(d.admin.ecoles||[]).length})</h4>`
      +`<p style="font-size:12px;opacity:.8">Activation d’une licence après accord avec l’établissement (aucun paiement n’est simulé). Places et durée :</p>`
      +`<div class="row"><input id="espAdPlaces" inputmode="numeric" value="100" style="width:90px"><input id="espAdMois" inputmode="numeric" value="12" style="width:90px"><span style="font-size:12px">places · mois</span></div>`;
    h+=(d.admin.ecoles||[]).map(e=>`<div class="row" style="display:block"><b>${esc(e.nom)}</b> · code <b>${esc(e.code)}</b><br><span style="font-size:12px">${e.eleves} élève(s) · ${e.enseignants} membre(s) · licence : ${e.plan==='ecole'?'établissement':e.plan==='essai'?'essai':'aucune'} (${e.statut}${e.fin?' jusqu’au '+dateFr(e.fin):''}) · créé le ${dateFr(e.cree)}</span>`
      +`<div class="row"><button onclick="espAdLicence('${e.id}')">Activer licence</button><button onclick="espAdSuspendre('${e.id}')">Suspendre</button></div></div>`).join('')||'<p style="font-size:13px">Aucun établissement pour le moment.</p>';
    return h+retour('');
  }
  async function adLicence(id){
    const places=Math.max(1,Math.min(100000,parseInt(val('espAdPlaces'),10)||0)),mois=Math.max(1,Math.min(60,parseInt(val('espAdMois'),10)||0));
    if(!places||!mois){maj({msg:'Écris un nombre de places et une durée en mois.',erreur:true});return}
    const fin=new Date();fin.setMonth(fin.getMonth()+mois);
    const r=await C.rpc('admin_set_licence',{p_school:id,p_plan:'ecole',p_places:places,p_fin:fin.toISOString()});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({admin:null,msg:'Licence activée : '+places+' places pendant '+mois+' mois.',erreur:false});
  }
  async function adSuspendre(id){
    const r=await C.rpc('admin_suspend_licence',{p_school:id});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({admin:null,msg:'Licence suspendue.',erreur:false});
  }

  // ---------- parents ----------
  function vueCodeParent(d){
    let h=entete('👨‍👩‍👧 Mon code parent')+msg(d);
    if(!d.pcode){chargerCodeParent();return h+'<p>Chargement…</p>'+retour('')}
    return h+`<p style="font-size:13px">Donne ce code à ton parent : il pourra suivre tes progrès (missions faites et scores) depuis son compte parent. Il ne voit rien d’autre.</p><p style="text-align:center"><b style="font-size:28px;letter-spacing:4px">${esc(d.pcode)}</b></p>`+retour('');
  }
  async function chargerCodeParent(){
    const r=await C.rpc('my_parent_code');
    if(!r.ok){maj({pcode:'—',msg:r.err,erreur:true});return}
    if(D()&&D().vue==='codeparent')maj({pcode:r.data});
  }
  function vueEnfants(d){
    let h=entete('👨‍👩‍👧 Mes enfants')+msg(d);
    if(!d.enfants){chargerEnfants();return h+'<p>Chargement…</p>'+retour('')}
    h+=d.enfants.length?d.enfants.map(c=>`<button onclick="espEnfant('${c.child_id}','${esc(c.pseudo)}')"><b>${esc(c.pseudo)}</b> · ${c.missions} mission(s)${c.total?' · '+sc(c.pts,c.total):''}${c.derniere?' · dernière activité le '+dateFr(c.derniere):''}</button>`).join('')
      :`<p style="font-size:13px">Aucun enfant relié. Demande à ton enfant son code parent (dans son compte élève, « Mon code parent »).</p>`;
    h+=`<input id="espPCode" maxlength="6" placeholder="Code parent de ton enfant" style="text-transform:uppercase" autocomplete="off"><button class="p" onclick="espLier()">Relier mon enfant</button>`;
    return h+retour('');
  }
  async function chargerEnfants(){
    const r=await C.rpc('children_summary');
    if(!r.ok){maj({enfants:[],msg:r.err,erreur:true});return}
    if(D()&&D().vue==='enfants')maj({enfants:r.data});
  }
  async function lier(){
    const c=val('espPCode');if(!c){maj({msg:'Écris le code parent.',erreur:true});return}
    const r=await C.rpc('link_child',{p_code:c});
    if(!r.ok){maj({msg:r.err,erreur:true});return}
    maj({enfants:null,msg:'Enfant relié : '+r.data+'.',erreur:false});
  }
  function ouvrirEnfant(id,pseudo){maj({vue:'enfant',enfantId:id,enfantNom:pseudo,detail:null,msg:''})}
  async function chargerEnfant(id){
    const r=await C.rpc('child_detail',{p_child:id});
    if(!r.ok){maj({detail:[],msg:r.err,erreur:true});return}
    if(D()&&D().vue==='enfant')maj({detail:r.data});
  }
  function vueEnfant(d){
    let h=entete('👦 '+d.enfantNom)+msg(d);
    if(!d.detail){chargerEnfant(d.enfantId);return h+'<p>Chargement…</p>'+retour('enfants')}
    h+=d.detail.length?d.detail.map(r=>{const c=cleInfo(r.mission_key);return `<div class="row" style="display:block"><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(c.nom?c.nom+' · '+c.mat+' · ':'')}${esc(c.titre)}</span><b>${sc(r.pts,r.total)}</b></div><div style="font-size:11px;opacity:.7">${r.attempts} essai(s) · ${dateFr(r.updated_at)}</div></div>`}).join(''):'<p style="font-size:13px">Pas encore de mission terminée.</p>';
    h+=`<button class="p" onclick="espErreurs('${d.enfantId}','${esc(d.enfantNom).replace(/'/g,'’')}','enfant')">🔎 Questions où mon enfant s’est trompé</button>`
      +`<button onclick="espDelier('${d.enfantId}')">Retirer cet enfant de mon compte</button>`;
    return h+retour('enfants');
  }
  async function delier(id){await C.rpc('unlink_child',{p_child:id});maj({vue:'enfants',enfants:null,msg:'Enfant retiré.',erreur:false})}

  return {
    html:html,rattrapage:()=>afaire(true),
    nonLus:async()=>{const s=C.session();if(!s||s.role!=='eleve')return 0;const r=await EV.rattrapage();return r?(r.communiques||0):0},
    actions:{
      espErreurs:ouvrirErreurs,espErreursClasse:ouvrirErreursClasse,espCreerClasseEcole:creerClasseEcole,espAffecter:affecter,espRejoindreClasse:rejoindreClasseEns,espQuitterClasse:quitterClasseEns,espClasseOuvrir:ouvrirClasseId,
      espEv:(v)=>maj({vue:v,evals:null,coms:null,evsProf:null,comsProf:null,evData:null,msg:'',erreur:false}),
      espGo:(v)=>{const d=D();maj({vue:v,msg:'',erreur:false,liste:(v==='classes'||v==='mm')?null:d.liste,ecoles:v==='ecole'?null:d.ecoles,admin:v==='admin'?null:d.admin,enfants:v==='enfants'?null:d.enfants,pcode:v==='codeparent'?null:d.pcode})},
      espEcole:ouvrirEcole,espAdLicence:adLicence,espAdSuspendre:adSuspendre,espCreerEcole:creerEcole,espRejoindreEcole:rejoindreEcole,espAttacher:attacher,espLier:lier,espEnfant:ouvrirEnfant,espDelier:delier,
      espForm:(mode,role)=>maj({vue:'form',mode:mode,role:role||'eleve',msg:'',erreur:false,occupe:false,canal:'mail',tel:''}),
      espCanal:(c)=>maj({canal:c,pseudo:val('espPseudo'),msg:'',erreur:false}),
      espRecuperation:(jeton)=>maj({vue:'nouveaumdp',jeton:jeton,msg:'',erreur:false}),
      espValider:valider,espOubli:oubli,espNouveauMdp:nouveauMdp,espChoisir:choisir,espSauver:sauver,espDeco:deco,
      espRejoindre:rejoindre,espRejoindreCode:rejoindreCode,espJouer:jouer,
      espClasse:ouvrirClasse,espCreerClasse:creerClasse,espNouvDevoir:()=>maj({vue:'nouvdevoir',form:{sel:[]},msg:''}),
      espForme:forme,espBasc:basc,espPublier:publier,espPrevisu:previsu,espDevoir:ouvrirDevoir,espExport:exporterDevoir,espBilan:ouvrirBilan,
      ...EV.actions
    }
  };
}
