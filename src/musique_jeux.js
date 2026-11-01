// BOYEKOLI MUSIC STUDIO – mini-jeux, table de composition à 5 pistes et scène de concert.
import {INSTR,FAMILLES,NOTES6,CLAVIER8,PISTES} from './musique/data.js';

export function creerJeux(C,D){
  const {G,esc,SFX,save,refreshHud,parler,toast}=D;
  const M=()=>C.MUS();const A=()=>C.A();const btn=C.btn;const $=C.$;
  const rr=()=>C.rendre();
  const ETO=s=>'⭐'.repeat(s)+'☆'.repeat(3-s);
  const wait=(ms,f)=>{const t=setTimeout(()=>{if(C.estOuvert())f()},ms);return t};
  // ---------- table de composition
  const nbRows=inst=>INSTR[inst].mel?6:INSTR[inst].pads.length;
  const grille=inst=>Array.from({length:nbRows(inst)},()=>Array(16).fill(0));
  const noteRow=(inst,r)=>INSTR[inst].mel?NOTES6[5-r][0]:r;
  const nomRow=(inst,r)=>INSTR[inst].mel?NOTES6[5-r][1]:INSTR[inst].pads[r];
  const vide=()=>({tempo:100,tracks:PISTES.map(p=>({inst:p.choix[0],vol:.9,mute:false,grid:grille(p.choix[0])}))});
  const initDraft=()=>{if(!C.draft){const m=M();C.draft=m.draft&&m.draft.tracks?m.draft:vide();m.draft=C.draft}return C.draft};
  const aNotes=t=>t.grid.some(r=>r.some(x=>x));
  const nbNotes=c=>c.tracks.reduce((s,t)=>s+t.grid.reduce((a,r)=>a+r.filter(Boolean).length,0),0);
  const pistesActives=c=>c.tracks.filter(aNotes).length;
  let pisteSel=0;
  function vueCompo(){
    const d=initDraft(),t=d.tracks[pisteSel],P=PISTES[pisteSel];
    let h=`${C.V.retourCours?'<div>'+btn('◀ Retour au cours','musRetourCours()')+'</div>':''}<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">${btn('▶ ÉCOUTER MA CRÉATION','musCompoPlay()','p','font-size:15px;padding:11px 14px').replace('<button','<button id="bplay"')}${btn('⏹','musCompoStop()')}${btn('🗑 Recommencer','musCompoReset()')}${btn('💾 Enregistrer','musCompoSave()','on')}</div>
    <div style="font-size:12px;margin:4px 0">🎚 Vitesse : <input type="range" min="60" max="160" value="${d.tempo}" oninput="musTempo(this.value)" style="vertical-align:middle;width:55%"> <b id="tempov">${d.tempo}</b> bpm</div>
    <div style="display:flex;gap:3px;margin:4px 0">`+PISTES.map((p,i)=>`<button onclick="musPiste(${i})" style="flex:1;padding:6px 2px;border-radius:10px;border:2px solid ${p.coul};background:${i===pisteSel?p.coul:'#241a3c'};color:#fff;font-size:11px;font-weight:700">${p.ico}<br>Piste ${i+1}${aNotes(d.tracks[i])?' ●':''}</button>`).join('')+`</div>
    <div style="font-size:12px"><b>${esc(P.nom)}</b> · instrument : `+P.choix.map(k=>`<button onclick="musInst('${k}')" style="padding:4px 7px;margin:2px;border-radius:9px;border:2px solid ${t.inst===k?'#ffd54f':'#6a5a9a'};background:${t.inst===k?'#ffd54f':'#3a2d5c'};color:${t.inst===k?'#222':'#fff'};font-size:12px">${INSTR[k].ico} ${esc(INSTR[k].nom.replace(/ \(.*\)/,''))}</button>`).join('')+`</div>
    <div style="font-size:12px;margin:3px 0">🔊 Volume : <input type="range" min="0" max="100" value="${Math.round(t.vol*100)}" oninput="musVol(this.value)" style="vertical-align:middle;width:42%"> ${btn(t.mute?'🔇 Muet':'🔈 Actif','musMute()',t.mute?'':'p','padding:4px 8px')}${btn('🧽 Effacer la piste','musEffPiste()','', 'padding:4px 8px')}</div>`;
    const rows=nbRows(t.inst);
    for(let r=0;r<rows;r++){
      h+=`<div style="display:flex;gap:1px;align-items:center;margin:1px 0"><button onclick="musRowSon(${r})" style="width:64px;flex:0 0 64px;height:25px;font-size:9px;border-radius:6px;border:0;background:${P.coul};color:#fff;font-weight:700;overflow:hidden;padding:0 2px">${esc(nomRow(t.inst,r))}</button>`;
      for(let s=0;s<16;s++)h+=`<button data-s="${s}" id="c_${r}_${s}" onclick="musCase(${r},${s})" style="flex:1;height:25px;min-width:0;border-radius:4px;border:1px solid ${s%4===0?'#8a7ac0':'#4a3d70'};background:${t.grid[r][s]?P.coul:(s%4===0?'#35294f':'#241a3c')};padding:0"></button>`;
      h+='</div>'}
    h+=`<p style="font-size:11px;opacity:.8;margin:4px 0">Touche les cases pour poser des sons sur 16 temps. Superpose jusqu’à 5 pistes. Tes créations restent dans l’application.</p>`;
    return h}
  function surligne(col){const p=$('muspan');if(!p)return;p.querySelectorAll('[data-s]').forEach(e=>{e.style.outline=(+e.dataset.s===col)?'2px solid #fff':'none'})}
  // lecture
  function lire(c,o){
    o=Object.assign({boucles:1,concert:false,onFin:null,vis:true},o);
    C.audio();C.stopLecture();const ctx=C.ctx,syn=C.syn;
    const sec=60/c.tempo/4,t0=ctx.currentTime+.2,total=16*o.boucles;let step=0,fini=false;
    c.tracks.forEach((t,i)=>syn.volPiste(i,t.mute?0:t.vol));
    const actifs=c.tracks.map((t,i)=>({t,i})).filter(x=>aNotes(x.t));
    const idxActif=i=>actifs.findIndex(a=>a.i===i);
    const timer=setInterval(()=>{
      while(step<total&&t0+step*sec<ctx.currentTime+.18){
        const s=step%16,t=t0+step*sec;
        c.tracks.forEach((tr,i)=>{tr.grid.forEach((row,r)=>{if(row[s]){syn.jouer(tr.inst,noteRow(tr.inst,r),t,{bus:i,dur:sec*1.8});C.visu.push({t,fn:()=>{if(C.studio)C.studio.pulse(tr.inst,o.concert?idxActif(i):undefined)}})}})});
        if(o.vis)C.visu.push({t,fn:()=>surligne(s)});
        if(step===15&&!o.concert)C.visu.push({t:t+sec,fn:()=>{const m=M();m.st.ecoutee=true;C.ecoute=true;save();C.verifBadges()}});
        step++}
      if(step>=total&&!fini&&ctx.currentTime>t0+total*sec+.3){fini=true;clearInterval(timer);C.lecteur=null;surligne(-1);const b=$('bplay');if(b)b.innerHTML='▶ ÉCOUTER MA CRÉATION';if(o.onFin)o.onFin()}},25);
    C.lecteur={stop(){clearInterval(timer);fini=true;try{for(let i=0;i<7;i++)syn.bus[i].gain.cancelScheduledValues(0)}catch(e){}surligne(-1);C.visu.length=0;const b=$('bplay');if(b)b.innerHTML='▶ ÉCOUTER MA CRÉATION'}};
    C.lanceVisu();const b=$('bplay');if(b)b.innerHTML='⏸ Écoute en cours…';
    return actifs}
  const actions={};
  // ---------- jeux
  const jeuxV=()=>{
    const m=M();if(C.V.jeu)return jeuVue();
    let h='<p style="font-size:13px">7 mini-jeux pour s’entraîner. Gagne des étoiles : elles servent à décrocher des badges !</p>';
    C.JEUX.forEach(j=>{const s=(m.jeux[j.id]||{}).stars||0;h+=`<button onclick="musJeu('${j.id}')" style="display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:10px;margin:4px 0;border-radius:14px;border:2px solid #7d3fd1;background:#32245a;color:#fff"><span style="font-size:28px">${j.ico}</span><span style="flex:1"><b>${j.nom}</b><br><small style="opacity:.85">${j.txt}</small></span><span style="font-size:13px">${ETO(s)}</span></button>`});
    return h}
  const G_={};   // état du jeu courant
  function jeuVue(){const j=C.JEUX.find(x=>x.id===C.V.jeu);const f=VUES[j.id];return `<div style="display:flex;align-items:center;gap:6px"><b style="flex:1;font-size:15px">${j.ico} ${j.nom}</b>${btn('← Jeux','musJeu(null)')}</div>`+(G_.fini?finVue():f())}
  const finVue=()=>`<div style="text-align:center;background:#2a1f45;border-radius:14px;padding:14px;margin-top:8px"><div style="font-size:34px">${ETO(G_.stars)}</div><b>${G_.titre}</b><p style="font-size:13px">${G_.detail}${G_.gain?' · +'+G_.gain+' 🪙':''}</p>${btn('🔁 Rejouer','musJeu(\''+C.V.jeu+'\')','p')}${btn('Autres jeux','musJeu(null)')}</div>`;
  function finJeu(id,stars,titre,detail){
    const m=M(),old=(m.jeux[id]||{}).stars||0;let gain=0;if(stars>old){gain=2*(stars-old);A().pieces+=gain;A().xp+=stars*2;m.jeux[id]={stars}}
    const t=A().tal||(A().tal={});t.musique=(t.musique||0)+stars*3;
    Object.assign(G_,{fini:true,stars,titre,detail,gain});save();refreshHud();SFX[stars?'win':'ko']&&SFX[stars?'win':'ko']();C.verifBadges();rr()}
  const feedback=(ok,exp)=>`<p style="font-size:13px;margin:6px 0">${ok?'✅ <b>Bravo !</b>':'❌ <b>Pas tout à fait.</b>'} ${esc(exp||'')}</p>`;
  const lance=(id)=>{C.hook=null;C.stopLecture();Object.keys(G_).forEach(k=>delete G_[k]);G_.id=id;INIT[id]&&INIT[id]()};
  // --- Devine l'instrument
  const POOL=['guitare_ac','piano','flute','trompette','violon','batterie','djembe','xylophone','saxophone','harmonica','likembe','balafon','tamtam','orgue','harpe','clarinette'];
  const INIT={
    devine(){G_.i=0;G_.ok=0;G_.n=8;prepDevine()},
    rythme(){G_.i=0;G_.pts=0;G_.ph='intro';G_.pat=[[0,1,0,1],[0,2,1,2,0,1],[0,0,1,2,0,1,1,2]];G_.beat=[.55,.5,.45]},
    piano(){G_.i=0;G_.err=0;G_.mel=[[60,62,64,60],[64,65,67,64,65,67],[60,60,60,62,64,62,60,64,62,62,60]];G_.pos=0;G_.ph='intro'},
    chef(){G_.i=0;G_.ok=0;G_.n=8;prepChef()},
    detective(){G_.i=0;G_.ok=0;G_.n=8;G_.L=[[48,84,'aigu'],[84,48,'grave'],[55,79,'aigu'],[79,55,'grave'],[60,67,'aigu'],[72,65,'grave'],[64,66,'aigu'],[70,67,'grave']];G_.rep=undefined;wait(100,()=>sonDetective())},
    concertjeu(){},
    memoire(){G_.seq=[];G_.ph='intro';G_.best=0}
  };
  function prepDevine(){const ids=POOL.slice().sort(()=>Math.random()-.5),id=ids[0],ch=ids.slice(0,4).sort(()=>Math.random()-.5);G_.q=id;G_.ch=ch;G_.rep=undefined;wait(250,()=>C.jouerSon(id))}
  function prepChef(){const id=POOL[(G_.i*5+3)%POOL.length];G_.q=id;G_.rep=undefined;wait(250,()=>C.jouerSon(id))}
  const nomCourt=k=>INSTR[k].nom.replace(/ \(.*\)/,'');
  const VUES={
    devine(){const rep=G_.rep;let h=`<small>Question ${G_.i+1} / ${G_.n} · bonnes réponses : ${G_.ok}</small><p style="font-size:14px"><b>Quel instrument entends-tu ?</b></p>${btn('🔊 Réécouter','musDevRe()','p')}<div>`;
      G_.ch.forEach(k=>{const bg=rep===undefined?'#3a2d5c':k===G_.q?'#2e9e4a':k===rep?'#b23a3a':'#3a2d5c';h+=`<button ${rep!==undefined?'disabled':''} onclick="musDevRep('${k}')" style="display:block;width:100%;text-align:left;padding:11px;margin:4px 0;border-radius:12px;border:2px solid #6a5a9a;background:${bg};color:#fff;font-size:15px">${INSTR[k].ico} ${esc(nomCourt(k))}</button>`});
      if(rep!==undefined)h+=feedback(rep===G_.q,'C’était : '+nomCourt(G_.q)+'. '+INSTR[G_.q].txt.split('.')[0]+'.')+btn(G_.i+1<G_.n?'Suivant ▶':'Résultat ▶','musDevSuite()','p');return h+'</div>'},
    chef(){const rep=G_.rep,q=G_.q,fam=INSTR[q].fam;let h=`<small>Question ${G_.i+1} / ${G_.n} · bonnes réponses : ${G_.ok}</small><p style="font-size:14px"><b>Dans quelle famille range-t-on cet instrument ?</b></p><div style="font-size:30px;text-align:center">${INSTR[q].ico} ${esc(nomCourt(q))}</div>${btn('🔊 Écouter','musChefRe()','p')}<div>`;
      Object.keys(FAMILLES).forEach(f=>{const bg=rep===undefined?'#3a2d5c':f===fam?'#2e9e4a':f===rep?'#b23a3a':'#3a2d5c';h+=`<button ${rep!==undefined?'disabled':''} onclick="musChefRep('${f}')" style="display:block;width:100%;text-align:left;padding:10px;margin:3px 0;border-radius:12px;border:2px solid #6a5a9a;background:${bg};color:#fff;font-size:14px">${FAMILLES[f]}</button>`});
      if(rep!==undefined)h+=feedback(rep===fam,'Le '+nomCourt(q).toLowerCase()+' est dans la famille : '+FAMILLES[fam]+'.')+btn(G_.i+1<G_.n?'Suivant ▶':'Résultat ▶','musChefSuite()','p');return h+'</div>'},
    detective(){const L=G_.L[G_.i],rep=G_.rep,correct=(L[2]==='aigu')===(L[1]>L[0])?1:0;let h=`<small>Question ${G_.i+1} / ${G_.n} · bonnes réponses : ${G_.ok}</small><p style="font-size:15px"><b>Quel son est le plus ${L[2]} ?</b></p>${btn('🔊 Réécouter les 2 sons','musDetRe()','p')}<div style="display:flex;gap:8px">`;
      [0,1].forEach(i=>{const bg=rep===undefined?'#3a2d5c':i===correct?'#2e9e4a':i===rep?'#b23a3a':'#3a2d5c';h+=`<button ${rep!==undefined?'disabled':''} onclick="musDetRep(${i})" style="flex:1;padding:18px 6px;border-radius:14px;border:2px solid #6a5a9a;background:${bg};color:#fff;font-size:17px;font-weight:700">${i?'2ᵉ son':'1er son'}</button>`});
      h+='</div>';if(rep!==undefined)h+=feedback(rep===correct,'Un son aigu est haut et fin, un son grave est bas et profond.')+btn(G_.i+1<G_.n?'Suivant ▶':'Résultat ▶','musDetSuite()','p');return h},
    rythme(){const k=G_.i,pat=G_.pat[k];let h=`<small>Manche ${k+1} / 3 · points : ${G_.pts}</small><p style="font-size:13px">Écoute le rythme, puis reproduis-le avec les 3 pads, en gardant la cadence.</p>`;
      h+=`<div style="display:flex;gap:6px;margin:6px 0">`+['BOUM','TCHAC','TCHI'].map((n,i)=>`<button id="gp_${i}" onclick="musRyTap(${i})" style="flex:1;height:84px;border-radius:16px;border:3px solid #fff3;background:${['#d6302b','#e8a23a','#4aa0d8'][i]};color:#fff;font-size:17px;font-weight:800;touch-action:manipulation;transition:filter .1s,transform .1s">${n}</button>`).join('')+'</div>';
      h+=`<p id="gmsg" style="font-size:13px;min-height:20px">${G_.msg||''}</p>`;
      h+=G_.ph==='intro'?btn('🔊 Écouter le rythme','musRyEcoute()','p'):G_.ph==='tap'?'<small>À toi ! Tape '+pat.length+' fois.</small>':G_.ph==='res'?btn(k+1<3?'Manche suivante ▶':'Résultat ▶','musRySuite()','p'):'';return h},
    piano(){const k=G_.i,mel=G_.mel[k];let h=`<small>Mélodie ${k+1} / 3 · erreurs : ${G_.err}</small><p style="font-size:13px">Écoute la mélodie puis rejoue-la sur le clavier (${mel.length} notes).</p><div style="display:flex;gap:3px">`+CLAVIER8.map((n,i)=>`<button id="gk_${n[0]}" onclick="musPiTap(${n[0]})" style="flex:1;height:96px;border-radius:0 0 10px 10px;border:2px solid #222;background:${[1,3,6].includes(i)?'#f4efe0':'#fff'};color:#222;font-size:12px;font-weight:700;border-bottom:8px solid #4aa0d8;touch-action:manipulation;transition:filter .1s,transform .1s">${n[1]}</button>`).join('')+'</div>';
      h+=`<p id="gmsg" style="font-size:13px;min-height:20px">${G_.msg||''}</p>`;h+=G_.ph==='intro'?btn('🔊 Écouter la mélodie','musPiEcoute()','p'):G_.ph==='res'?btn(k+1<3?'Mélodie suivante ▶':'Résultat ▶','musPiSuite()','p'):'';return h},
    memoire(){let h=`<p style="font-size:13px">Observe la suite de notes puis reproduis-la. Elle s’allonge à chaque réussite ! Record : <b>${G_.best}</b></p><div style="display:flex;flex-wrap:wrap;gap:8px">`+[0,1,2,3].map(i=>`<button id="gm_${i}" onclick="musMeTap(${i})" style="flex:1 1 45%;height:90px;border-radius:18px;border:3px solid #fff3;background:${['#d6302b','#e8a23a','#2e9e4a','#4aa0d8'][i]};color:#fff;font-size:20px;font-weight:800;touch-action:manipulation;transition:filter .1s,transform .1s">${['Do','Mi','Sol','Do aigu'][i]}</button>`).join('')+'</div>';
      h+=`<p id="gmsg" style="font-size:13px;min-height:20px">${G_.msg||''}</p>`;h+=G_.ph==='intro'?btn('▶ Commencer','musMeStart()','p'):'';return h},
    concertjeu(){const d=initDraft();return `<p style="font-size:13px">Compose une petite musique avec <b>au moins 3 pistes</b> et <b>8 notes</b>, écoute-la, puis donne ton concert sur scène !</p><p style="font-size:13px">Pistes utilisées : <b>${pistesActives(d)}</b> · notes : <b>${nbNotes(d)}</b></p>${btn('🎛 Ouvrir la table de composition','musOng(\'compo\')','p')}${btn('🎭 Donner le concert','musConcertJeu()','on')}<p style="font-size:12px;opacity:.85">⭐ 3 pistes · ⭐⭐ 4 pistes · ⭐⭐⭐ 5 pistes</p>`}
  };
  const FAM_MAP={};
  // actions jeux
  Object.assign(actions,{
    musJeu:id=>{C.V=id?{ong:'jeux',jeu:id}:{ong:'jeux'};if(id)lance(id);rr()},
    musDevRe:()=>C.jouerSon(G_.q),
    musDevRep:k=>{if(G_.rep!==undefined)return;G_.rep=k;if(k===G_.q){G_.ok++;M().st.devineOk=(M().st.devineOk||0)+1;SFX.ok&&SFX.ok()}else SFX.ko&&SFX.ko();rr()},
    musDevSuite:()=>{if(G_.i+1<G_.n){G_.i++;prepDevine();rr()}else{const s=G_.ok>=7?3:G_.ok>=5?2:G_.ok>=3?1:0;finJeu('devine',s,s?'Bien joué, bonne oreille !':'Entraîne-toi encore !',G_.ok+' / '+G_.n+' instruments reconnus')}},
    musChefRe:()=>C.jouerSon(G_.q),
    musChefRep:f=>{if(G_.rep!==undefined)return;G_.rep=f;if(f===INSTR[G_.q].fam){G_.ok++;SFX.ok&&SFX.ok()}else SFX.ko&&SFX.ko();rr()},
    musChefSuite:()=>{if(G_.i+1<G_.n){G_.i++;prepChef();rr()}else{const s=G_.ok>=7?3:G_.ok>=5?2:G_.ok>=3?1:0;finJeu('chef',s,s?'Bravo, chef d’orchestre !':'Révise les familles d’instruments.',G_.ok+' / '+G_.n+' bien rangés')}},
    musDetRe:()=>sonDetective(),
    musDetRep:i=>{if(G_.rep!==undefined)return;G_.rep=i;const L=G_.L[G_.i],c=(L[2]==='aigu')===(L[1]>L[0])?1:0;if(i===c){G_.ok++;SFX.ok&&SFX.ok()}else SFX.ko&&SFX.ko();rr()},
    musDetSuite:()=>{if(G_.i+1<G_.n){G_.i++;G_.rep=undefined;rr();sonDetective()}else{const s=G_.ok>=7?3:G_.ok>=5?2:G_.ok>=3?1:0;finJeu('detective',s,s?'Détective des sons !':'Encore un peu d’entraînement.',G_.ok+' / '+G_.n+' bonnes réponses')}},
    // rythme
    musRyEcoute:()=>{const pat=G_.pat[G_.i],b=G_.beat[G_.i];G_.ph='demo';C.audio();const t0=C.ctx.currentTime+.1;pat.forEach((n,i)=>{C.syn.jouer('batterie',n===0?0:n===1?1:2,t0+i*b,{bus:6,vol:1.1});C.visu.push({t:t0+i*b,fn:()=>{lum('gp_'+n)}})});C.lanceVisu();G_.msg='🔊 Écoute…';rr();wait((pat.length*b+.3)*1000,()=>{G_.ph='cnt';G_.msg='Prépare-toi… 1 – 2 – 3 – 4';rr();const t1=C.ctx.currentTime+.1;[0,1,2,3].forEach(k=>C.syn.jouer('triangle',1,t1+k*b,{bus:6,vol:.7}));wait(4*b*1000+100,()=>{G_.ph='tap';G_.taps=[];G_.msg='À toi !';rr()})})},
    musRyTap:n=>{C.son('batterie',n===0?0:n===1?1:2);lum('gp_'+n);if(G_.ph!=='tap')return;G_.taps.push({n,t:performance.now()});const pat=G_.pat[G_.i],b=G_.beat[G_.i]*1000;
      if(G_.taps.length>=pat.length){G_.ph='res';const ord=G_.taps.every((x,i)=>x.n===pat[i]);let err=0;G_.taps.forEach((x,i)=>{err+=Math.abs((x.t-G_.taps[0].t)-i*b)});err/=G_.taps.length;const pts=ord?(err<b*.35?2:1):0;G_.pts+=pts;
        G_.msg=ord?(pts===2?'🎉 Parfait ! Ordre et cadence justes (+2).':'👍 Bon ordre, mais la cadence peut s’améliorer (+1).'):'❌ L’ordre n’est pas le bon. Écoute encore.';rr()}},
    musRySuite:()=>{if(G_.i+1<3){G_.i++;G_.ph='intro';G_.msg='';rr()}else{const s=G_.pts>=5?3:G_.pts>=3?2:G_.pts>=1?1:0;finJeu('rythme',s,s?'Bien joué, batteur !':'Réessaie en écoutant bien.',G_.pts+' / 6 points')}},
    // piano
    musPiEcoute:()=>{const mel=G_.mel[G_.i];G_.ph='demo';G_.msg='🔊 Écoute…';rr();const t=C.jouerSuite('piano',mel.map((n,i)=>[n,i*.45]),1);mel.forEach((n,i)=>0);wait((mel.length*.45+.3)*1000,()=>{G_.ph='tap';G_.pos=0;G_.msg='À toi de jouer !';rr()})},
    musPiTap:n=>{C.son('piano',n);const e=document.getElementById('gk_'+n);if(e){e.style.filter='brightness(1.8)';setTimeout(()=>e&&(e.style.filter=''),180)}if(G_.ph!=='tap')return;const mel=G_.mel[G_.i];
      if(n===mel[G_.pos]){G_.pos++;if(G_.pos>=mel.length){G_.ph='res';G_.msg='🎉 Mélodie réussie !';SFX.ok&&SFX.ok();rr()}}else{G_.err++;G_.pos=0;G_.msg='❌ Raté, on recommence cette mélodie depuis le début.';SFX.ko&&SFX.ko();const m=document.getElementById('gmsg');if(m)m.textContent=G_.msg;const k=document.querySelector('#muspan b');}},
    musPiSuite:()=>{if(G_.i+1<3){G_.i++;G_.ph='intro';G_.msg='';rr()}else{const s=G_.err<=2?3:G_.err<=5?2:1;finJeu('piano',s,'Pianiste en herbe !',G_.err+' erreur(s)')}},
    // mémoire
    musMeStart:()=>{G_.seq=[];G_.ph='demo';memNext()},
    musMeTap:i=>{C.son('piano',[60,64,67,72][i]);lum('gm_'+i);if(G_.ph!=='tap')return;if(i===G_.seq[G_.pos]){G_.pos++;if(G_.pos>=G_.seq.length){G_.best=Math.max(G_.best,G_.seq.length);G_.ph='demo';G_.msg='✅ Bien ! On allonge…';const m=document.getElementById('gmsg');if(m)m.textContent=G_.msg;wait(900,memNext)}}else{SFX.ko&&SFX.ko();const L=G_.seq.length-1;const s=L>=9?3:L>=7?2:L>=5?1:0;finJeu('memoire',s,s?'Belle mémoire musicale !':'Continue à t’entraîner.','Suite la plus longue : '+Math.max(0,L)+' notes')}},
    musConcertJeu:()=>{const d=initDraft(),p=pistesActives(d);if(p<3||nbNotes(d)<8){toast('Il faut au moins 3 pistes et 8 notes.');return}if(!C.ecoute){toast('Écoute d’abord ta création dans « Composer ».');return}G_.concertJeu=true;C.V={ong:'concert'};C.dessineOnglets();rr();wait(200,()=>lancerConcert(d,true))},
    // composition
    musPiste:i=>{pisteSel=i;rr()},
    musInst:k=>{const t=initDraft().tracks[pisteSel];if(t.inst!==k){t.inst=k;t.grid=grille(k);save()}C.son(k,INSTR[k].mel?64:0);rr()},
    musVol:v=>{const t=initDraft().tracks[pisteSel];t.vol=v/100;if(C.syn)C.syn.volPiste(pisteSel,t.mute?0:t.vol)},
    musMute:()=>{const t=initDraft().tracks[pisteSel];t.mute=!t.mute;if(C.syn)C.syn.volPiste(pisteSel,t.mute?0:t.vol);rr()},
    musEffPiste:()=>{const t=initDraft().tracks[pisteSel];t.grid=grille(t.inst);save();rr()},
    musTempo:v=>{initDraft().tempo=+v;const e=$('tempov');if(e)e.textContent=v},
    musCase:(r,s)=>{const d=initDraft(),t=d.tracks[pisteSel],P=PISTES[pisteSel];t.grid[r][s]=t.grid[r][s]?0:1;const e=$('c_'+r+'_'+s);if(e)e.style.background=t.grid[r][s]?P.coul:(s%4===0?'#35294f':'#241a3c');if(t.grid[r][s])C.son(t.inst,noteRow(t.inst,r),{vol:.8},pisteSel);save()},
    musRowSon:r=>{const t=initDraft().tracks[pisteSel];C.son(t.inst,noteRow(t.inst,r),{},pisteSel)},
    musCompoPlay:()=>{if(C.lecteur){C.stopLecture();return}const d=initDraft();if(!d.tracks.some(aNotes)){toast('Pose d’abord quelques notes !');return}lire(d,{boucles:2})},
    musCompoStop:()=>{C.stopLecture()},
    musCompoReset:()=>{if(!confirm('Tout effacer et recommencer ?'))return;C.stopLecture();C.draft=vide();M().draft=C.draft;save();rr()},
    musCompoSave:()=>{const d=initDraft();if(!d.tracks.some(aNotes)){toast('Ta création est vide.');return}const m=M(),nom=(prompt('Nom de ta création :','Ma musique '+(m.compos.length+1))||'').trim();if(!nom)return;
      if(m.compos.length>=12){toast('12 créations maximum : supprime-en une dans ton espace.');return}m.compos.push({id:Date.now(),nom:nom.slice(0,30),tempo:d.tempo,date:new Date().toISOString().slice(0,10),tracks:JSON.parse(JSON.stringify(d.tracks))});A().xp+=5;C.ecouteSave=true;save();SFX.bravo&&SFX.bravo();toast('Création enregistrée dans ton espace musical !');C.verifBadges()},
    musRetourCours:()=>{const r=C.V.retourCours;if(r){C.V={ong:'cours',cours:r.cours,cst:r.cst};C.dessineOnglets();rr()}},
    musCompoEcoute:i=>{const c=M().compos[i];C.V={ong:'profil'};lire(c,{boucles:1,vis:false});toast('▶ '+c.nom)},
    musCompoConcert:i=>{C.V={ong:'concert'};C.dessineOnglets();rr();wait(200,()=>lancerConcert(M().compos[i]))},
    musCompoNom:i=>{const c=M().compos[i],n=(prompt('Nouveau nom :',c.nom)||'').trim();if(n){c.nom=n.slice(0,30);save();rr()}},
    musCompoSupp:i=>{if(confirm('Supprimer cette création ?')){M().compos.splice(i,1);save();rr()}},
    musConcert:i=>{const c=i<0?initDraft():M().compos[i];lancerConcert(c)},
    musConcertStop:()=>{C.stopLecture();const b=$('bconc');if(b)b.innerHTML='🎭 Lancer la représentation'}
  });
  function lum(id){const e=document.getElementById(id);if(!e)return;e.style.filter='brightness(1.9)';e.style.transform='scale(1.06)';setTimeout(()=>{if(e){e.style.filter='';e.style.transform=''}},200)}
  function sonDetective(){const L=G_.L[G_.i];C.audio();const t0=C.ctx.currentTime+.1;C.syn.jouer('flute',L[0],t0,{bus:6,dur:.6});C.syn.jouer('flute',L[1],t0+.9,{bus:6,dur:.6})}
  function memNext(){G_.seq.push(Math.floor(Math.random()*4));G_.ph='demo';G_.pos=0;G_.msg='👀 Observe… ('+G_.seq.length+' notes)';const m=document.getElementById('gmsg');if(m)m.textContent=G_.msg;
    G_.seq.forEach((n,i)=>wait(500+i*650,()=>{C.son('piano',[60,64,67,72][n]);lum('gm_'+n)}));wait(500+G_.seq.length*650+300,()=>{G_.ph='tap';G_.pos=0;G_.msg='À toi !';const m2=document.getElementById('gmsg');if(m2)m2.textContent=G_.msg})}
  // ---------- concert
  function vueConcert(){
    const m=M();let h='<p style="font-size:13px">Choisis une composition : tes instruments jouent ensemble sur la grande scène, avec les musiciens et le public !</p>';
    h+=`<div style="background:#2a1f45;border-radius:12px;padding:8px;margin:4px 0"><b>🎛 Ma création en cours</b><br><small>${pistesActives(initDraft())} piste(s) · ${nbNotes(initDraft())} notes</small><br>${btn('🎭 Lancer la représentation','musConcert(-1)','p').replace('<button','<button id="bconc"')}${btn('⏹ Arrêter','musConcertStop()')}</div>`;
    m.compos.forEach((c,i)=>{h+=`<div style="background:#2a1f45;border-radius:12px;padding:8px;margin:4px 0"><b>🎼 ${esc(c.nom)}</b> <small>· ${c.tempo} bpm</small><br>${btn('🎭 Jouer sur scène','musConcert('+i+')','p')}</div>`});
    if(!m.compos.length)h+='<p style="font-size:12px;opacity:.8">Enregistre une création dans « Composer » pour la retrouver ici.</p>';
    return h}
  function lancerConcert(c,fromJeu){
    const act=c.tracks.map((t,i)=>({t,i})).filter(x=>aNotes(x.t));
    if(!act.length){toast('Cette composition est vide : ajoute des notes dans « Composer ».');return}
    C.stopLecture();C.audio();if(C.studio){C.studio.concertInstaller(act.map(a=>({inst:a.t.inst})));C.studio.zone('concert')}
    parler('Mesdames et messieurs, le concert commence !');const b=$('bconc');if(b)b.innerHTML='🎶 Concert en cours…';
    lire(c,{boucles:2,concert:true,vis:false,onFin:()=>{C.applaudir();if(C.studio)C.studio.pulseGlobal();const m=M(),prem=!m.st.concert;m.st.concert=true;if(prem){A().pieces+=5;A().xp+=10;refreshHud()}
      if(fromJeu){const p=pistesActives(c),s=p>=5?3:p>=4?2:1;finJeu('concertjeu',s,'Quel beau concert !',p+' pistes jouées');C.V={ong:'jeux',jeu:'concertjeu'};C.dessineOnglets()}
      save();toast('👏 Bravo l’artiste !'+(prem?' +5 🪙':''));C.verifBadges();if(C.studio)wait(2500,()=>C.studio.zone('studio'));const bb=$('bconc');if(bb)bb.innerHTML='🎭 Lancer la représentation'}})
  }
  // vérification de l'exercice de composition d'un cours
  C.vues.verifCompo=pr=>{const d=initDraft(),p=pistesActives(d);
    if(p<pr.pistes)return {ok:false,msg:'Il te faut notes sur '+pr.pistes+' pistes (tu en as '+p+').'};
    if(!C.ecoute)return {ok:false,msg:'Écoute ta création (bouton ÉCOUTER MA CRÉATION) avant de valider.'};
    if(pr.enregistrer&&!M().compos.length)return {ok:false,msg:'Enregistre ta création avec le bouton 💾.'};
    return {ok:true}};
  C.vues.jeux=jeuxV;C.vues.compo=vueCompo;C.vues.concert=vueConcert;
  return actions;
}
