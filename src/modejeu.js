// Mini-jeu de mode éducatif : 12 commandes de clients (grades), mesures et calculs, quiz de coupe et couture,
// création sur mannequin avec budget et pièces à débloquer, défilé noté, entraînement libre.
import {NIVEAUX,GRADES,PRIX,MOTIF_PRIX,DEBLOC,ENTRAINEMENT} from './contenu/modejeu.js';

export function creerModeJeu(S){
  const {A,save,refreshHud,toast,parler,pts,SFX,esc,mannequin,PIECES,COUL,MOTIFS,rendre,libre}=S;
  const mjs=()=>{const a=A();if(!a.mj)a.mj={};return a.mj};
  const courant=()=>{let n=0;while(n<NIVEAUX.length&&(mjs()[n]||0)>0)n++;return n};     // premier niveau non réussi (0-based)
  const grade=n=>GRADES[Math.min(3,Math.floor(Math.min(n,NIVEAUX.length-1)/3))];
  const debloque=v=>!DEBLOC[v]||courant()+1>=DEBLOC[v];
  const fresh=()=>({haut:'shirt',bas:'pant',robe:'',chaus:'',coif:'',acc:'',cH:'#2980b9',cB:'#2d3436',cR:'#c0392b',mH:'',mB:'',mR:'',peau:'#7a4a2e',cheveux:'#1a1a1a',cat:'haut'});
  let st={vue:'hub'},L=fresh();
  const bt=(t,cls,oc,x)=>`<button style="padding:7px 9px;margin:2px;border-radius:8px;border:1px solid #9a8;background:${cls==='on'?'#ffd54f':cls==='p'?'#2e7d32':'#fff'};color:${cls==='p'?'#fff':'#222'};font-size:13px;${x||''}" onclick="${oc}">${t}</button>`;
  const cout=l=>{let c=0;const cp=(k,mk)=>{c+=PRIX[l[k]]||0;if(l[k])c+=MOTIF_PRIX[l[mk]]||0};if(l.robe)cp('robe','mR');else{cp('haut','mH');cp('bas','mB')}return c+(PRIX[l.chaus]||0)+(PRIX[l.coif]||0)+(PRIX[l.acc]||0)};
  const rot=(q,k)=>{const n=q.c.length,r=k%n,c=q.c.map((_,i)=>q.c[(i+r)%n]);return {q:q.q,c,a:c.indexOf(q.c[q.a]),exp:q.exp}};
  const ETOILES=s=>'⭐'.repeat(s)+'☆'.repeat(3-s);
  const css='<style>@keyframes mjdef{0%{transform:translateX(-90%) rotate(-2deg)}50%{transform:translateX(0) rotate(2deg)}100%{transform:translateX(90%) rotate(-2deg)}}@keyframes mjflash{0%,100%{opacity:0}50%{opacity:.7}}</style>';

  // ---------- accueil
  function hub(){
    const c=courant(),a=A();
    let h=css+`<div style="background:#1f5f9e;color:#fff;border-radius:10px;padding:8px;margin-bottom:6px"><b>👗 Atelier de mode et de couture</b><br><span style="font-size:12px">Grade : <b>${grade(c)}</b> · Niveau ${Math.min(c+1,NIVEAUX.length)} / ${NIVEAUX.length}</span></div>`;
    h+='<p style="font-size:12px;margin:2px 0">Des clients te passent des commandes. Réponds aux questions de coupe et couture, compose la tenue dans le budget, puis présente-la au défilé.</p>';
    NIVEAUX.forEach((nv,i)=>{const s=mjs()[i]||0,ok=i<=c;
      h+=`<button ${ok?'':'disabled'} style="display:block;width:100%;text-align:left;padding:8px;margin:3px 0;border-radius:8px;border:1px solid #9a8;background:${s?'#e6f4d8':ok?'#fff':'#eee'};font-size:13px" onclick="mjNiveau(${i})">${ok?nv.ico:'🔒'} <b>${i+1}. ${esc(nv.nom)}</b> · ${esc(nv.client)} <span style="float:right">${ETOILES(s)}</span></button>`});
    h+='<hr>'+bt('🧵 Entraînement coupe et couture (quiz)','p','mjEntr()')+bt('🎨 Atelier libre (sans note)','','simMdLibre()');
    const lk=a.looks||[];if(lk.length)h+=`<p style="font-size:12px">👗 Tenues enregistrées : ${lk.length}</p>`;
    return h;
  }
  // ---------- questions (calcul + quiz)
  function questions(){
    const q=st.list[st.i],r=st.rep;
    let h=`<div style="font-size:12px;opacity:.8">${st.titre} · Question ${st.i+1} / ${st.list.length}</div><div style="background:#fff;border-radius:10px;padding:10px;margin:6px 0"><b>${esc(q.q)}</b></div>`;
    q.c.forEach((x,i)=>{
      let bg='#fff';if(r!==undefined){if(i===q.a)bg='#c8e6c9';else if(i===r)bg='#ffcdd2'}
      h+=`<button ${r!==undefined?'disabled':''} style="display:block;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:8px;border:1px solid #9a8;background:${bg};font-size:14px" onclick="mjRep(${i})">${'ABCD'[i]}. ${esc(x)}</button>`});
    if(r!==undefined)h+=`<p style="font-size:13px"><b>${r===q.a?'✅ Bravo !':'❌ Pas tout à fait.'}</b> ${esc(q.exp)}</p>`+bt(st.i+1<st.list.length?'Suivant ▶':'Terminer ▶','p','mjSuite()');
    return h;
  }
  // ---------- création
  function creation(){
    const nv=NIVEAUX[st.n],tot=cout(L),reste=nv.budget-tot;
    let h=`<div style="background:#fff8e1;border:1px solid #e0c060;border-radius:10px;padding:6px;font-size:12px;margin-bottom:4px"><b>${nv.ico} ${esc(nv.client)}</b> : ${esc(nv.txt)}<br><b>À prévoir :</b> ${nv.besoins.map(b=>({tenue:'une tenue complète (haut + bas ou robe)',robe:'une robe',chaus:'des chaussures',coif:'une coiffure',acc:'un accessoire'}[b])).join(', ')}${nv.motif?' · motif demandé : <b>'+MOTIFS.find(m=>m[1]===nv.motif)[0]+'</b>':''}</div>`;
    h+=`<div style="display:flex;gap:6px"><div style="flex:0 0 42%;height:300px">${mannequin(L)}</div><div style="flex:1;font-size:12px">`;
    const slots=L.robe?['robe','chaus','coif','acc']:['haut','bas','robe','chaus','coif','acc'];
    h+='<div>'+slots.map(k=>bt(PIECES[k].nom,L.cat===k?'on':'',`mjCat('${k}')`)).join('')+bt('🎨','','mjCat(\'coul\')')+bt('👤','','mjCat(\'corps\')')+'</div>';
    if(PIECES[L.cat]){h+='<div>'+PIECES[L.cat].o.map(o=>{const v=o[1],lock=!debloque(v);const p=(PRIX[v]||0);return lock?`<span style="display:inline-block;padding:7px 9px;margin:2px;border-radius:8px;background:#eee;color:#999;font-size:12px">🔒 ${o[0]} (niv. ${DEBLOC[v]})</span>`:bt(o[0]+(p?' · '+p:''),L[L.cat]===v?'on':'',`mjSet('${L.cat}','${v}')`)}).join('')+'</div>'}
    else if(L.cat==='coul'){
      [['cH','mH','Haut'],['cB','mB','Bas'],['cR','mR','Robe']].forEach(([ck,mk,nm])=>{if(nm==='Robe'&&!L.robe)return;if(L.robe&&nm!=='Robe')return;
        h+=`<div><b>${nm}</b><br>`+COUL.map(x=>`<button style="width:24px;height:24px;border-radius:50%;border:${L[ck]===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="mjSet('${ck}','${x}')"></button>`).join('')+'<br>'+MOTIFS.map(m=>bt(m[0]+(MOTIF_PRIX[m[1]]?' +'+MOTIF_PRIX[m[1]]:''),L[mk]===m[1]?'on':'',`mjSet('${mk}','${m[1]}')`)).join('')+'</div>'});
    }else{
      h+='<b>Peau</b><br>'+['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'].map(x=>`<button style="width:26px;height:26px;border-radius:50%;border:${L.peau===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="mjSet('peau','${x}')"></button>`).join('')+'<br><b>Cheveux</b><br>'+['#1a1a1a','#3b2418','#7a4a1e','#c0392b','#e6c35a','#6a1b9a'].map(x=>`<button style="width:26px;height:26px;border-radius:50%;border:${L.cheveux===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="mjSet('cheveux','${x}')"></button>`).join('');
    }
    h+='</div></div>';
    h+=`<div style="margin:6px 0"><div style="background:#ddd;border-radius:8px;height:12px"><div style="width:${Math.min(100,Math.round(tot*100/nv.budget))}%;height:12px;border-radius:8px;background:${reste<0?'#c0392b':'#2e7d32'}"></div></div><b style="font-size:13px;color:${reste<0?'#c0392b':'#222'}">Coût : ${tot} / ${nv.budget} FC ${reste<0?'· budget dépassé !':'· reste '+reste+' FC'}</b></div>`;
    h+=bt('🎤 Présenter au défilé','p','mjDefile()')+bt('↩ Quitter la commande','','mjHub()');
    return h;
  }
  function evalue(){
    const nv=NIVEAUX[st.n];
    const has={tenue:!!L.robe||(!!L.haut&&!!L.bas),robe:!!L.robe,chaus:!!L.chaus,coif:!!L.coif,acc:!!L.acc};
    const bes=nv.besoins.filter(b=>has[b]).length/nv.besoins.length;
    const keys=Object.keys(nv.ok).filter(k=>L.robe?k!=='haut'&&k!=='bas':k!=='robe');
    const th=keys.length?keys.filter(k=>nv.ok[k].includes(L[k])).length/keys.length:1;
    const mot=!nv.motif?1:((L.robe?L.mR:L.mH)===nv.motif||(!L.robe&&L.mB===nv.motif)?1:0);
    const con=L.robe?1:(L.cH!==L.cB?1:0);
    const crea=Math.round(bes*25+th*25+mot*10+con*10);
    const manque=[];keys.forEach(k=>{if(!nv.ok[k].includes(L[k]))manque.push(PIECES[k].nom)});
    return {crea,bes,th,mot,con,manque};
  }
  function resultat(){
    const nv=NIVEAUX[st.n],e=st.ev,score=st.score;
    let h=css+`<div style="text-align:center"><div style="height:300px;width:60%;margin:0 auto">${mannequin(L)}</div><h3 style="margin:4px 0">${score>=85?'Défilé triomphal !':score>=60?'Joli défilé !':score>=35?'Tenue à améliorer':'Il faut retravailler'}</h3><div style="font-size:26px">${ETOILES(st.stars)}</div><b>Score : ${score} / 100</b></div>`;
    h+=`<p style="font-size:12px">Questions : ${st.bonnes} / 3 bonnes (${st.bonnes*10} pts) · Création : ${e.crea} / 70<br>${e.bes<1?'• Il manquait une pièce demandée.<br>':''}${e.th<1?'• Pièces à mieux choisir : '+e.manque.join(', ')+'.<br>':''}${e.mot<1?'• Le motif demandé n’est pas respecté.<br>':''}${e.con<1?'• Haut et bas ont la même couleur : change l’un des deux.<br>':''}${st.recomp?'<b>+'+st.recomp+' 🪙 gagnés !</b>':''}</p>`;
    h+=(st.stars>0&&st.n+1<NIVEAUX.length?bt('Niveau suivant ▶','p','mjNiveau('+(st.n+1)+')'):'')+bt('🔁 Refaire','','mjNiveau('+st.n+')')+bt('Accueil','','mjHub()');
    return h;
  }
  function rend(){
    const el=libre();if(!el)return;
    el.innerHTML=st.vue==='hub'?hub():st.vue==='qz'?questions():st.vue==='crea'?creation():st.vue==='def'?`${css}<div style="text-align:center;padding-top:20px"><h3>🎤 Défilé en cours…</h3><div style="position:relative;height:320px;overflow:hidden;background:linear-gradient(#2a1a3a,#5a2a6a);border-radius:12px"><div style="height:310px;width:40%;margin:5px auto;animation:mjdef 2.2s ease-in-out"> ${mannequin(L)}</div><div style="position:absolute;inset:0;background:#fff;animation:mjflash 1.1s infinite;pointer-events:none"></div></div></div>`:resultat();
  }
  const actions={
    simMdJeu:()=>{st={vue:'hub'};rend()},
    mjHub:()=>{st={vue:'hub'};rend()},
    mjNiveau:n=>{const nv=NIVEAUX[n];st={vue:'qz',n,titre:nv.ico+' '+nv.nom,list:[rot(nv.calc,n),...nv.quiz.map((q,i)=>rot(q,n+i+1))],i:0,bonnes:0,cmd:true};L=fresh();rend();parler(nv.client+' : '+nv.txt.replace(/[«»]/g,''))},
    mjRep:i=>{if(st.rep!==undefined)return;st.rep=i;const q=st.list[st.i];if(i===q.a){st.bonnes++;SFX.ok&&SFX.ok()}else SFX.ko&&SFX.ko();rend()},
    mjSuite:()=>{
      if(st.i+1<st.list.length){st.i++;st.rep=undefined;rend();return}
      if(st.cmd){st.vue='crea';st.rep=undefined;rend();parler('À toi de créer : respecte le budget et la demande du client.');return}
      // entraînement
      const a=A();const jour=new Date().toISOString().slice(0,10);let m='';
      if(st.bonnes>=5&&a.mjEntr!==jour){a.mjEntr=jour;a.pieces+=2;a.xp+=3;refreshHud();m=' +2 🪙 (une fois par jour)'}
      pts('mode',st.bonnes*2);save();toast('Entraînement : '+st.bonnes+' / '+st.list.length+m);st={vue:'hub'};rend()},
    mjEntr:()=>{
      const tout=[];NIVEAUX.forEach(n=>{tout.push(n.calc,...n.quiz)});tout.push(...ENTRAINEMENT);
      const a=A();a.mjEntrN=((a.mjEntrN||0)+1);const off=(a.mjEntrN*7)%tout.length;
      const list=[];for(let i=0;i<6;i++)list.push(rot(tout[(off+i*5)%tout.length],a.mjEntrN+i));
      st={vue:'qz',titre:'🧵 Entraînement',list,i:0,bonnes:0,cmd:false};rend()},
    mjCat:k=>{L.cat=k;rend()},
    mjSet:(k,v)=>{L[k]=v;
      if(k==='robe'&&v&&L.cat==='robe')L.cat='robe';rend()},
    mjDefile:()=>{const nv=NIVEAUX[st.n],tot=cout(L);
      if(tot>nv.budget){toast('Budget dépassé de '+(tot-nv.budget)+' FC : choisis des pièces moins chères.');SFX.ko&&SFX.ko();return}
      const e=evalue(),score=Math.min(100,st.bonnes*10+e.crea),stars=score>=85?3:score>=60?2:score>=35?1:0;
      st.ev=e;st.score=score;st.stars=stars;st.vue='def';rend();parler('Mesdames et messieurs, voici la création !');
      setTimeout(()=>{if(st.vue!=='def')return;
        const m=mjs(),prev=m[st.n]||0;let rec=0;
        if(stars>prev){rec=prev===0?3*stars+2:3*(stars-prev);const a=A();a.pieces+=rec;a.xp+=rec*2;m[st.n]=stars;refreshHud();pts('mode',10*stars)}
        st.recomp=rec;save();st.vue='res';rend();SFX.bravo&&stars>0?SFX.bravo():0;
        parler(stars===3?'Bravo, c’est un triomphe !':stars>0?'Joli travail !':'Réessaie en lisant bien la commande.')},2300)}
  };
  return {actions,rend,hub:()=>{st={vue:'hub'};rend()}};
}
