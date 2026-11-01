// Simulateurs de métiers : studio de musique, salon de mode, atelier de décoration, aéroport (avion), profil de talents.
// Chaque simulateur est un plein écran autonome ; le temps passé nourrit le profil de talents (aide à découvrir sa voie).
import {lancerAvion,MISSIONS} from './avion.js';
import {creerModeJeu} from './modejeu.js';

export const TALENTS={
  musique:{ico:'🎶',nom:'Musique',metiers:['Musicien·ne','Compositeur·trice','Ingénieur·e du son','Chanteur·se','Producteur·trice']},
  pilotage:{ico:'✈️',nom:'Aviation',metiers:['Pilote','Contrôleur aérien','Mécanicien d’avion','Ingénieur aéronautique','Hôtesse / steward']},
  mode:{ico:'👗',nom:'Mode',metiers:['Styliste','Couturier·ère','Coiffeur·se','Designer textile','Mannequin']},
  deco:{ico:'🏠',nom:'Architecture et décoration',metiers:['Architecte','Décorateur·trice d’intérieur','Ingénieur·e en génie civil','Urbaniste','Menuisier·ère']},
  science:{ico:'🔬',nom:'Sciences',metiers:['Chercheur·se','Ingénieur·e','Biologiste','Chimiste','Astronome']},
  sante:{ico:'🩺',nom:'Santé',metiers:['Médecin','Infirmier·ère','Pharmacien·ne','Sage-femme','Biologiste médical']},
  enquete:{ico:'🕵️',nom:'Enquête et justice',metiers:['Détective','Policier·ère','Magistrat·e','Avocat·e','Juriste']},
  ville:{ico:'🌆',nom:'Ville et environnement',metiers:['Urbaniste','Ingénieur·e environnement','Élu·e local·e','Technicien·ne en énergie','Géomètre']},
  terre:{ico:'🌾',nom:'Agriculture et commerce',metiers:['Agronome','Éleveur·se','Entrepreneur·e','Commerçant·e','Comptable']}
};
const NOTES=[['Do',261.63],['Ré',293.66],['Mi',329.63],['Fa',349.23],['Sol',392],['La',440],['Si',493.88],['Do²',523.25]];

export function creerSimulateurs(D){
  const {G,esc,SFX,save,refreshHud,parler,openBox,closeDialog,quiz3D}=D;
  const A=()=>G.adv;
  let ov=null,ctx=null,stopFn=null,tdeb=0,domaine='';
  const talents=()=>{const a=A();if(!a.tal)a.tal={};return a.tal};
  const pts=(k,n)=>{const t=talents();t[k]=(t[k]||0)+n};
  // ---------- cadre plein écran
  function cadre(titre,dom,corps,onClose){
    fermer(true);tdeb=Date.now();domaine=dom;
    ov=document.createElement('div');ov.id='simov';
    ov.style.cssText='position:fixed;inset:0;z-index:9000;background:#f7f3e8;color:#1c2b24;display:flex;flex-direction:column;font-family:system-ui,sans-serif;overflow:hidden';
    ov.innerHTML=`<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:#1f5f9e;color:#fff"><b style="flex:1;font-size:15px">${titre}</b><button id="simx" style="padding:6px 12px;border-radius:8px;border:0;font-size:14px">✖ Quitter</button></div><div id="simc" style="flex:1;position:relative;overflow:auto;padding:8px"></div>`;
    document.body.appendChild(ov);
    ov.querySelector('#simx').onclick=()=>{fermer();closeDialog()};
    stopFn=onClose||null;corps(ov.querySelector('#simc'));
  }
  function fermer(silencieux){
    if(!ov)return;
    if(stopFn){try{stopFn()}catch(e){}stopFn=null}
    const s=Math.round((Date.now()-tdeb)/1000);if(domaine&&s>5){pts(domaine,Math.min(120,Math.floor(s/6)));save()}
    ov.remove();ov=null;domaine='';
  }
  const bt=(t,cls,oc)=>`<button class="${cls||''}" style="padding:7px 9px;margin:2px;border-radius:8px;border:1px solid #9a8;background:${cls==='on'?'#ffd54f':'#fff'};font-size:13px" onclick="${oc}">${t}</button>`;

  // ---------- MUSIQUE
  const audio=()=>{if(!ctx)ctx=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();return ctx};
  const INSTR={piano:'🎹 Piano',balafon:'🪘 Balafon',likembe:'🎼 Likembé',guitare:'🎸 Guitare',trompette:'🎺 Trompette',flute:'🪈 Flûte',tamtam:'🥁 Tam-tam',maracas:'🪇 Maracas'};
  function son(inst,f,t0,dur){
    const c=audio(),t=t0||c.currentTime,o=c.createOscillator(),g=c.createGain(),fl=c.createBiquadFilter();
    const env=(a,d,v)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0008,t+a+d)};
    if(inst==='tamtam'||inst==='maracas'){
      if(inst==='maracas'){const b=c.createBuffer(1,c.sampleRate*.12,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);const s=c.createBufferSource();s.buffer=b;fl.type='highpass';fl.frequency.value=4000;g.gain.value=.4;s.connect(fl);fl.connect(g);g.connect(c.destination);s.start(t);return}
      o.type='sine';o.frequency.setValueAtTime(f||110,t);o.frequency.exponentialRampToValueAtTime((f||110)*.5,t+.25);env(.005,.35,.9);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.5);return}
    const ty={piano:'triangle',balafon:'sine',likembe:'triangle',guitare:'sawtooth',trompette:'square',flute:'sine'}[inst];
    o.type=ty;o.frequency.value=f;
    const d=inst==='balafon'?.5:inst==='likembe'?.7:inst==='guitare'?.9:inst==='piano'?1.1:inst==='flute'?.6:.5;
    fl.type='lowpass';fl.frequency.value=inst==='guitare'?1800:inst==='trompette'?2200:6000;
    env(inst==='flute'||inst==='trompette'?.05:.008,d,.35);o.connect(fl);fl.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.2);
    if(inst==='balafon'||inst==='likembe'){const o2=c.createOscillator(),g2=c.createGain();o2.frequency.value=f*(inst==='balafon'?3:2);g2.gain.setValueAtTime(.12,t);g2.gain.exponentialRampToValueAtTime(.001,t+.2);o2.connect(g2);g2.connect(c.destination);o2.start(t);o2.stop(t+.3)}
  }
  const PISTES=[['tamtam',90,'🥁 Tam-tam grave'],['tamtam',160,'🥁 Tam-tam aigu'],['maracas',0,'🪇 Maracas'],['balafon',NOTES[0][1],'🪘 Balafon Do'],['balafon',NOTES[2][1],'🪘 Balafon Mi'],['balafon',NOTES[4][1],'🪘 Balafon Sol'],['likembe',NOTES[5][1],'🎼 Likembé La'],['trompette',NOTES[7][1],'🎺 Trompette Do']];
  let grille=null,tempo=100,joue=false,timer=0,pas=0,inst='piano';
  const DEMO=()=>{const g=PISTES.map(()=>Array(16).fill(0));[0,4,8,12].forEach(i=>g[0][i]=1);[2,6,10,14].forEach(i=>g[2][i]=1);[3,11].forEach(i=>g[1][i]=1);[0,6,10].forEach(i=>g[3][i]=1);[4,12].forEach(i=>g[4][i]=1);[8,14].forEach(i=>g[5][i]=1);return g};
  function musique(){
    grille=grille||DEMO();
    cadre('🎶 Studio de musique','musique',c=>{
      c.innerHTML='<div id="mu"></div>';dessineMu();
    },()=>{joue=false;clearInterval(timer)});
    parler('Bienvenue au studio. Joue du piano ou crée ton propre rythme congolais.');
  }
  function dessineMu(){
    const c=ov&&ov.querySelector('#mu');if(!c)return;
    let h='<p style="font-size:12px;margin:2px 0">🎹 <b>Instruments</b> : choisis puis joue les notes.</p><div>'+Object.keys(INSTR).map(k=>bt(INSTR[k],inst===k?'on':'',`simMuInst('${k}')`)).join('')+'</div>';
    h+='<div style="display:flex;gap:2px;margin:6px 0">'+NOTES.map((n,i)=>`<button style="flex:1;height:84px;border-radius:0 0 8px 8px;border:1px solid #444;background:${i%2?'#e9e2cf':'#fff'};font-size:11px;touch-action:manipulation" onpointerdown="simNote(${i})">${n[0]}</button>`).join('')+'</div>';
    h+='<hr><p style="font-size:12px;margin:2px 0">🥁 <b>Créer un morceau</b> : touche les cases pour poser les sons sur 16 temps, puis écoute.</p>';
    PISTES.forEach((p,r)=>{h+=`<div style="display:flex;align-items:center;gap:1px;margin:1px 0"><span style="width:72px;font-size:9px">${p[2]}</span>`+grille[r].map((v,i)=>`<button id="g${r}_${i}" style="flex:1;height:22px;border:1px solid #aaa;border-radius:3px;padding:0;background:${v?'#2e7d32':(i%4===0?'#dfe8d8':'#fff')}" onclick="simCase(${r},${i})"></button>`).join('')+'</div>'});
    h+=`<div style="margin:6px 0">${bt(joue?'⏹ Stop':'▶ Écouter','on','simMuPlay()')}${bt('🗑 Vider','','simMuVider()')}${bt('🎵 Rythme exemple','','simMuDemo()')}<label style="font-size:12px"> Tempo <input type="range" min="60" max="160" value="${tempo}" oninput="simMuTempo(this.value)"></label></div>`;
    const cp=A().compos||[];
    h+=`<div>${bt('💾 Enregistrer ma création','','simMuSave()')}</div>`+cp.map((z,i)=>`<div style="font-size:12px">🎼 ${esc(z.nom)} · ${z.tempo} bpm ${bt('▶','','simMuCharge('+i+')')}</div>`).join('');
    h+='<hr><p style="font-size:12px"><b>📚 Cours de musique</b> : '+bt('Faire le quiz de musique','p',"simCours('musique')")+'</p>';
    c.innerHTML=h;
  }
  function tick(){
    const c=audio(),t=c.currentTime+.05;PISTES.forEach((p,r)=>{if(grille[r][pas])son(p[0],p[1],t)});
    const prev=ov&&ov.querySelector('#g0_'+((pas+15)%16));pas=(pas+1)%16;
  }
  // ---------- MODE
  const PIECES={
    haut:{nom:'Haut',o:[['Chemise','shirt'],['Blouse','blouse'],['Débardeur','tank'],['Boubou haut','boubou'],['Veste','veste']]},
    bas:{nom:'Bas',o:[['Pantalon','pant'],['Jupe','skirt'],['Pagne','pagne'],['Short','short']]},
    robe:{nom:'Robe',o:[['Aucune',''],['Robe wax','robe'],['Robe longue','long'],['Robe cérémonie','cere']]},
    chaus:{nom:'Chaussures',o:[['Sandales','sand'],['Baskets','bask'],['Souliers','soul'],['Pieds nus','']]},
    coif:{nom:'Coiffure',o:[['Courts','court'],['Tresses','tresse'],['Afro','afro'],['Chignon','chignon'],['Foulard','foulard'],['Rasé','']]},
    acc:{nom:'Accessoire',o:[['Aucun',''],['Lunettes','lun'],['Collier','coll'],['Chapeau','chap'],['Sac','sac'],['Boucles','boucles']]}
  };
  const COUL=['#c0392b','#e67e22','#f1c40f','#27ae60','#2980b9','#8e44ad','#e84393','#2d3436','#f5f5f5','#16a085'];
  const MOTIFS=[['Uni',''],['Rayures','r'],['Pois','p'],['Zigzag','z'],['Wax','w']];
  const THEMES=[
   {id:'mariage',nom:'Mariage',txt:'Un mariage : élégant et festif.',ok:{robe:['cere','long','robe'],chaus:['soul','sand'],acc:['coll','sac'],coif:['chignon','tresse','foulard']}},
   {id:'ecole',nom:'Rentrée des classes',txt:'Sérieux et confortable pour étudier.',ok:{haut:['shirt','blouse'],bas:['pant','skirt','short'],chaus:['bask','sand'],coif:['court','tresse','chignon']}},
   {id:'sport',nom:'Journée sportive',txt:'Pratique, léger, qui permet de courir.',ok:{haut:['tank','shirt'],bas:['short','pant'],chaus:['bask'],coif:['court','tresse','foulard','']}},
   {id:'fete',nom:'Fête de quartier',txt:'Colorée, avec du wax !',ok:{robe:['robe','long','cere'],acc:['coll','chap','lun'],chaus:['sand','soul']}}
  ];
  let look={haut:'shirt',bas:'pant',robe:'',chaus:'sand',coif:'court',acc:'',cH:'#2980b9',cB:'#2d3436',cR:'#c0392b',mH:'',mB:'',mR:'w',peau:'#7a4a2e',cheveux:'#1a1a1a',cat:'haut'};
  const ptn=(id,m,col)=>m==='r'?`<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${col}"/><rect width="3" height="8" fill="#ffffff55"/></pattern>`:m==='p'?`<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${col}"/><circle cx="5" cy="5" r="2.5" fill="#fff"/></pattern>`:m==='z'?`<pattern id="${id}" width="12" height="10" patternUnits="userSpaceOnUse"><rect width="12" height="10" fill="${col}"/><path d="M0 8 L3 2 L6 8 L9 2 L12 8" stroke="#fff" fill="none" stroke-width="1.6"/></pattern>`:m==='w'?`<pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${col}"/><circle cx="8" cy="8" r="5" fill="#f1c40f"/><circle cx="8" cy="8" r="2.4" fill="#c0392b"/><path d="M0 0 L4 4 M16 0 L12 4 M0 16 L4 12 M16 16 L12 12" stroke="#fff" stroke-width="1.5"/></pattern>`:'';
  const fill=(id,m,col)=>m?`url(#${id})`:col;
  function mannequin(L){
    const hH=fill('fH',L.mH,L.cH),hB=fill('fB',L.mB,L.cB),hR=fill('fR',L.mR,L.cR);
    let s=`<svg viewBox="0 0 200 330" style="width:100%;max-height:100%;background:linear-gradient(#fde9c9,#f3d9a8);border-radius:10px"><defs>${ptn('fH',L.mH,L.cH)}${ptn('fB',L.mB,L.cB)}${ptn('fR',L.mR,L.cR)}</defs>`;
    s+=`<rect x="0" y="300" width="200" height="30" fill="#b08a5a"/>`;
    // jambes, bras, cou, tête
    s+=`<rect x="78" y="200" width="16" height="95" rx="6" fill="${L.peau}"/><rect x="106" y="200" width="16" height="95" rx="6" fill="${L.peau}"/>`;
    s+=`<rect x="50" y="112" width="14" height="80" rx="7" fill="${L.peau}"/><rect x="136" y="112" width="14" height="80" rx="7" fill="${L.peau}"/>`;
    s+=`<rect x="92" y="88" width="16" height="22" fill="${L.peau}"/><ellipse cx="100" cy="64" rx="26" ry="30" fill="${L.peau}"/><circle cx="90" cy="64" r="2.6" fill="#222"/><circle cx="110" cy="64" r="2.6" fill="#222"/><path d="M92 78 Q100 85 108 78" stroke="#5b1f1f" stroke-width="2.4" fill="none"/>`;
    // chaussures
    const ch=L.chaus;if(ch)s+=`<ellipse cx="86" cy="298" rx="${ch==='bask'?15:12}" ry="6" fill="${ch==='soul'?'#3b2a20':ch==='bask'?'#f5f5f5':'#c98b3a'}"/><ellipse cx="114" cy="298" rx="${ch==='bask'?15:12}" ry="6" fill="${ch==='soul'?'#3b2a20':ch==='bask'?'#f5f5f5':'#c98b3a'}"/>`;
    // vêtements
    if(L.robe){const long=L.robe==='long'||L.robe==='cere';s+=`<path d="M68 112 L132 112 L${long?160:150} ${long?292:230} L${long?40:50} ${long?292:230} Z" fill="${hR}" stroke="#0003"/>`+(L.robe==='cere'?`<rect x="68" y="150" width="64" height="8" fill="#f1c40f"/>`:'');
    }else{
      if(L.bas==='pant')s+=`<rect x="72" y="188" width="56" height="12" fill="${hB}"/><rect x="74" y="196" width="21" height="96" fill="${hB}"/><rect x="105" y="196" width="21" height="96" fill="${hB}"/>`;
      else if(L.bas==='short')s+=`<rect x="72" y="188" width="56" height="12" fill="${hB}"/><rect x="74" y="196" width="21" height="40" fill="${hB}"/><rect x="105" y="196" width="21" height="40" fill="${hB}"/>`;
      else if(L.bas==='skirt')s+=`<path d="M72 188 L128 188 L142 250 L58 250 Z" fill="${hB}"/>`;
      else s+=`<path d="M70 188 L130 188 L134 280 L66 280 Z" fill="${hB}"/><path d="M70 188 L130 188 L134 280 L66 280" stroke="#0003" fill="none"/>`;
      const T=L.haut;
      if(T==='tank')s+=`<path d="M72 112 L128 112 L124 192 L76 192 Z" fill="${hH}"/><rect x="84" y="106" width="8" height="14" fill="${hH}"/><rect x="108" y="106" width="8" height="14" fill="${hH}"/>`;
      else if(T==='boubou')s+=`<path d="M64 110 L136 110 L150 205 L50 205 Z" fill="${hH}"/><rect x="38" y="112" width="26" height="40" fill="${hH}"/><rect x="136" y="112" width="26" height="40" fill="${hH}"/>`;
      else if(T==='veste')s+=`<path d="M68 110 L132 110 L130 196 L70 196 Z" fill="${hH}"/><rect x="46" y="110" width="22" height="68" rx="7" fill="${hH}"/><rect x="132" y="110" width="22" height="68" rx="7" fill="${hH}"/><path d="M100 112 L88 150 L100 196 L112 150 Z" fill="#f5f5f5"/><path d="M100 112 L92 112 L100 135 L108 112Z" fill="#0003"/><circle cx="100" cy="165" r="2" fill="#222"/><circle cx="100" cy="180" r="2" fill="#222"/>`;
      else s+=`<path d="M70 110 L130 110 L128 194 L72 194 Z" fill="${hH}"/><rect x="48" y="110" width="20" height="${T==='blouse'?44:34}" rx="6" fill="${hH}"/><rect x="132" y="110" width="20" height="${T==='blouse'?44:34}" rx="6" fill="${hH}"/>`+(T==='shirt'?`<line x1="100" y1="112" x2="100" y2="192" stroke="#0004"/>`:'');
    }
    // coiffure
    const c=L.coif,hc=L.cheveux;
    if(c==='court')s+=`<path d="M74 60 Q76 32 100 32 Q124 32 126 60 Q112 46 74 60Z" fill="${hc}"/>`;
    if(c==='tresse')s+=`<path d="M72 62 Q74 30 100 30 Q126 30 128 62 Z" fill="${hc}"/>`+[74,82,90,110,118,126].map(x=>`<rect x="${x-2}" y="50" width="5" height="52" rx="2.5" fill="${hc}"/>`).join('');
    if(c==='afro')s+=`<circle cx="100" cy="46" r="38" fill="${hc}"/><ellipse cx="100" cy="68" rx="24" ry="28" fill="${L.peau}"/><circle cx="90" cy="64" r="2.6" fill="#222"/><circle cx="110" cy="64" r="2.6" fill="#222"/><path d="M92 78 Q100 85 108 78" stroke="#5b1f1f" stroke-width="2.4" fill="none"/>`;
    if(c==='chignon')s+=`<path d="M74 60 Q76 32 100 32 Q124 32 126 60 Q112 46 74 60Z" fill="${hc}"/><circle cx="100" cy="24" r="12" fill="${hc}"/>`;
    if(c==='foulard')s+=`<path d="M72 60 Q76 28 100 28 Q124 28 128 60 Q100 46 72 60Z" fill="${hR}"/><circle cx="130" cy="52" r="8" fill="${hR}"/>`;
    // accessoires
    if(L.acc==='lun')s+=`<circle cx="90" cy="64" r="8" fill="#9bd" stroke="#222" stroke-width="2" fill-opacity=".4"/><circle cx="110" cy="64" r="8" fill="#9bd" stroke="#222" stroke-width="2" fill-opacity=".4"/><line x1="98" y1="64" x2="102" y2="64" stroke="#222" stroke-width="2"/>`;
    if(L.acc==='coll')s+=`<path d="M84 100 Q100 124 116 100" stroke="#f1c40f" stroke-width="4" fill="none"/><circle cx="100" cy="116" r="4" fill="#c0392b"/>`;
    if(L.acc==='chap')s+=`<ellipse cx="100" cy="38" rx="44" ry="8" fill="#c9a24a"/><path d="M78 38 Q100 8 122 38Z" fill="#c9a24a"/>`;
    if(L.acc==='boucles')s+=`<circle cx="74" cy="72" r="4" fill="#f1c40f"/><circle cx="126" cy="72" r="4" fill="#f1c40f"/><circle cx="74" cy="80" r="3" fill="#c0392b"/><circle cx="126" cy="80" r="3" fill="#c0392b"/>`;
    if(L.acc==='sac')s+=`<rect x="140" y="180" width="30" height="26" rx="4" fill="#8e5a2b"/><path d="M146 180 Q155 164 164 180" stroke="#5a3a1b" stroke-width="3" fill="none"/>`;
    return s+'</svg>';
  }
  function noteLook(L){
    const th=THEMES.find(t=>t.id===L.theme);if(!th)return null;
    let ok=0,tot=0;const det=[];
    Object.keys(th.ok).forEach(k=>{tot++;const v=k==='robe'?L.robe:L[k];if(th.ok[k].includes(v)){ok++}else det.push(PIECES[k].nom)});
    if(th.id==='mariage'&&!L.robe){ok=Math.max(0,ok-1)}
    return {ok,tot,det,th};
  }
  function mode(){
    cadre('👗 Salon de mode','mode',c=>{c.innerHTML='<div id="md"></div>';MJ.hub()});
    parler('Bienvenue au salon de mode. Compose une tenue, choisis les tissus, puis présente-la au défilé.');
  }
  function dessineMode(){
    const c=ov&&ov.querySelector('#md');if(!c)return;const L=look;
    let h=bt('← Jeu de mode (niveaux)','p','simMdJeu()')+`<div style="display:flex;gap:8px"><div style="flex:0 0 44%;height:310px">${mannequin(L)}</div><div style="flex:1;font-size:12px">`;
    h+='<div>'+Object.keys(PIECES).map(k=>bt(PIECES[k].nom,L.cat===k?'on':'',`simMdCat('${k}')`)).join('')+bt('🎨 Couleurs','','simMdCat(\'coul\')')+bt('👤 Peau/cheveux','','simMdCat(\'corps\')')+'</div>';
    if(PIECES[L.cat]){h+='<div>'+PIECES[L.cat].o.map(o=>bt(o[0],(L[L.cat]===o[1])?'on':'',`simMdSet('${L.cat}','${o[1]}')`)).join('')+'</div>'}
    else if(L.cat==='coul'){
      [['cH','mH','Haut'],['cB','mB','Bas'],['cR','mR','Robe / foulard']].forEach(([ck,mk,nm])=>{h+=`<div><b>${nm}</b><br>`+COUL.map(x=>`<button style="width:24px;height:24px;border-radius:50%;border:${L[ck]===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="simMdSet('${ck}','${x}')"></button>`).join('')+'<br>'+MOTIFS.map(m=>bt(m[0],L[mk]===m[1]?'on':'',`simMdSet('${mk}','${m[1]}')`)).join('')+'</div>'});
    }else{
      h+='<b>Peau</b><br>'+['#f1c9a5','#c68642','#8d5524','#7a4a2e','#5a3319','#3b2219'].map(x=>`<button style="width:26px;height:26px;border-radius:50%;border:${L.peau===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="simMdSet('peau','${x}')"></button>`).join('')+'<br><b>Cheveux</b><br>'+['#1a1a1a','#3b2418','#7a4a1e','#c0392b','#e6c35a','#6a1b9a'].map(x=>`<button style="width:26px;height:26px;border-radius:50%;border:${L.cheveux===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="simMdSet('cheveux','${x}')"></button>`).join('');
    }
    h+='</div></div><hr><b style="font-size:13px">🎤 Défilé : choisis un thème</b><div>'+THEMES.map(t=>bt(t.nom,L.theme===t.id?'on':'',`simMdTheme('${t.id}')`)).join('')+'</div>';
    const n=noteLook(L);
    if(n){const ex=A().defiles&&A().defiles[n.th.id];h+=`<p style="font-size:12px">${esc(n.th.txt)}<br>${bt('👠 Présenter au défilé','p',"simMdDefile()")}${ex?' ✅ réussi':''}</p>`}
    const lk=A().looks||[];
    h+=`<div>${bt('💾 Enregistrer ma tenue','','simMdSave()')}${bt('🎲 Tenue surprise','','simMdAlea()')}</div>`+lk.map((z,i)=>`<div style="font-size:12px">👗 Tenue ${i+1} ${bt('Reprendre','',`simMdCharge(${i})`)}</div>`).join('');
    c.innerHTML=h;
  }
  // ---------- DÉCORATION
  const CAT=[
   {id:'lit',ico:'🛏',nom:'Lit',w:2,h:1,prix:90,c:'#8e44ad'},{id:'table',ico:'🪑',nom:'Table',w:1,h:1,prix:40,c:'#a0702f'},
   {id:'chaise',ico:'💺',nom:'Chaise',w:1,h:1,prix:10,c:'#c9a24a'},{id:'canape',ico:'🛋',nom:'Canapé',w:2,h:1,prix:120,c:'#2980b9'},
   {id:'armoire',ico:'🚪',nom:'Armoire',w:1,h:1,prix:70,c:'#6b4423'},{id:'tele',ico:'📺',nom:'Télévision',w:1,h:1,prix:60,c:'#222'},
   {id:'biblio',ico:'📚',nom:'Bibliothèque',w:2,h:1,prix:80,c:'#7a4a26'},{id:'tapis',ico:'🟫',nom:'Tapis',w:2,h:2,prix:35,c:'#c0392b'},
   {id:'plante',ico:'🪴',nom:'Plante',w:1,h:1,prix:8,c:'#2e7d32'},{id:'lampe',ico:'💡',nom:'Lampe',w:1,h:1,prix:15,c:'#f1c40f'},
   {id:'bureau',ico:'🖥',nom:'Bureau',w:2,h:1,prix:60,c:'#8d6e63'}
  ];
  const SOLS=['#d9b98a','#b5835a','#cfcfcf','#e8e0c8','#8d6e63'],MURS=['#f4efe4','#9fd3f5','#ffe0a0','#cdeac0','#f3b6c8','#d8b78a'];
  const SALLES=[{id:'chambre',nom:'Chambre d’enfant',w:6,h:5,budget:250,besoin:['lit','bureau','lampe'],txt:'Une chambre pour étudier et dormir : il faut un lit, un bureau et une lampe.'},
    {id:'salon',nom:'Salon',w:8,h:6,budget:400,besoin:['canape','table','tele','plante'],txt:'Un salon accueillant : canapé, table, télévision et une plante.'},
    {id:'biblio',nom:'Coin lecture',w:6,h:5,budget:300,besoin:['biblio','chaise','lampe','tapis'],txt:'Un coin pour lire : bibliothèque, chaise, lampe et tapis.'}];
  let dec=null;
  function nouvDec(s){return {salle:s,items:[],sol:SOLS[0],mur:MURS[0],cur:'lit'}}
  function deco(){
    if(!dec)dec=nouvDec(SALLES[0]);
    cadre('🏠 Atelier de décoration','deco',c=>{c.innerHTML='<div id="dc"></div>';dessineDeco()});
    parler('Atelier de décoration. Choisis une pièce, place les meubles et respecte le budget.');
  }
  const coutDec=()=>dec.items.reduce((s,i)=>s+CAT.find(c=>c.id===i.id).prix,0);
  const libre=(x,y,w,h,sauf)=>{if(x<0||y<0||x+w>dec.salle.w||y+h>dec.salle.h)return false;return !dec.items.some((i,k)=>{if(k===sauf)return false;const c=CAT.find(z=>z.id===i.id);if(c.id==='tapis'||CAT.find(z=>z.id===dec.cur).id==='tapis')return false;return x<i.x+c.w&&x+w>i.x&&y<i.y+c.h&&y+h>i.y})};
  function dessineDeco(){
    const c=ov&&ov.querySelector('#dc');if(!c)return;const S=dec.salle,u=Math.min(46,Math.floor(340/S.w));
    let h='<div>'+SALLES.map(s=>bt(s.nom,S.id===s.id?'on':'',`simDcSalle('${s.id}')`)).join('')+'</div>';
    h+=`<p style="font-size:12px;margin:3px 0">${esc(S.txt)}<br>📏 Pièce : ${S.w} m × ${S.h} m · surface <b>${S.w*S.h} m²</b> · murs ≈ <b>${2*(S.w+S.h)*2.5} m²</b> (hauteur 2,5 m) · peinture : <b>${Math.ceil(2*(S.w+S.h)*2.5/6)}</b> pots de 6 m²</p>`;
    h+=`<svg viewBox="0 0 ${S.w*u+8} ${S.h*u+8}" style="width:100%;max-width:${S.w*u+8}px;background:${dec.mur};border-radius:6px"><rect x="4" y="4" width="${S.w*u}" height="${S.h*u}" fill="${dec.sol}" stroke="#555" stroke-width="3"/>`;
    for(let i=1;i<S.w;i++)h+=`<line x1="${4+i*u}" y1="4" x2="${4+i*u}" y2="${4+S.h*u}" stroke="#0001"/>`;for(let j=1;j<S.h;j++)h+=`<line x1="4" y1="${4+j*u}" x2="${4+S.w*u}" y2="${4+j*u}" stroke="#0001"/>`;
    for(let j=0;j<S.h;j++)for(let i=0;i<S.w;i++)h+=`<rect x="${4+i*u}" y="${4+j*u}" width="${u}" height="${u}" fill="transparent" onclick="simDcPose(${i},${j})"/>`;
    dec.items.forEach((it,k)=>{const cc=CAT.find(z=>z.id===it.id);h+=`<g onclick="simDcRetire(${k})"><rect x="${4+it.x*u+2}" y="${4+it.y*u+2}" width="${cc.w*u-4}" height="${cc.h*u-4}" rx="5" fill="${cc.c}" opacity="${cc.id==='tapis'?.7:1}"/><text x="${4+it.x*u+cc.w*u/2}" y="${4+it.y*u+cc.h*u/2+6}" font-size="${u*.5}" text-anchor="middle">${cc.ico}</text></g>`});
    h+='</svg>';
    h+='<div style="margin-top:4px">'+CAT.map(z=>bt(z.ico+' '+z.nom+' '+z.prix,dec.cur===z.id?'on':'',`simDcCur('${z.id}')`)).join('')+'</div>';
    h+='<div style="font-size:12px">Sol : '+SOLS.map(x=>`<button style="width:24px;height:24px;border:${dec.sol===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="simDcCoul('sol','${x}')"></button>`).join('')+' Murs : '+MURS.map(x=>`<button style="width:24px;height:24px;border:${dec.mur===x?'3px solid #000':'1px solid #888'};background:${x}" onclick="simDcCoul('mur','${x}')"></button>`).join('')+'</div>';
    const cout=coutDec(),manque=S.besoin.filter(b=>!dec.items.some(i=>i.id===b)).map(b=>CAT.find(z=>z.id===b).nom);
    const occ=dec.items.filter(i=>i.id!=='tapis').reduce((s,i)=>{const z=CAT.find(q=>q.id===i.id);return s+z.w*z.h},0);
    h+=`<p style="font-size:13px">Budget : <b style="color:${cout>S.budget?'#c0392b':'#2e7d32'}">${cout} / ${S.budget} FC</b> · Meubles au sol : ${occ} m² sur ${S.w*S.h} m² (${Math.round(occ*100/(S.w*S.h))} %)<br>${manque.length?'À placer : '+manque.join(', '):'✅ Tous les meubles demandés sont placés'}</p>`;
    h+=bt('✔ Valider mon projet','p','simDcValide()')+bt('🗑 Tout vider','','simDcVide()');
    h+=A().deco&&A().deco[S.id]?' ✅ projet réussi':'';
    c.innerHTML=h;
  }
  // ---------- AÉROPORT : licence de pilote (inscription, théorie, vol d'examen), puis missions chronométrées
  const pil=()=>{const a=A();if(!a.pilote)a.pilote={inscrit:false,brevet:false,m:{}};return a.pilote};
  const theorie=()=>!!(A().done['met:p1']&&A().done['met:p2']);
  function aeroport(){
    openBox({kind:'metiers',vue:'aeroport',msg:''});
    parler('Bienvenue à l’aéroport Boyekoli. Pour piloter, il faut une licence : inscription, théorie, puis vol d’examen.');
  }
  function vueAeroport(d){
    const p=pil();
    let h='<h3>✈️ Aéroport Boyekoli</h3><p style="font-size:12px">✈️ <b>Commandant Ilunga</b> : « Un pilote vérifie, anticipe et garde son calme. Sans licence, pas de vol. »</p>';
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    h+=`<p class="row"><span>Mes pièces</span><b>${A().pieces} 🪙</b></p><h4>🪪 Licence de pilote ${p.brevet?'✅ obtenue':''}</h4>`;
    if(!p.inscrit)h+=`<button class="p" onclick="simInscriptionPilote()">📝 S’inscrire à l’école de pilotage (20 🪙)</button>`;
    else{
      h+=`<p style="font-size:13px">${A().done['met:p1']?'✅':'⬜'} Théorie 1 : bases du pilotage<br>${A().done['met:p2']?'✅':'⬜'} Théorie 2 : règles de l’air et instruments<br>${p.brevet?'✅':'⬜'} Pratique : vol d’examen chronométré</p>`;
      h+=`<button onclick="metOuvrir('pilotage')">📚 Cours et quiz de théorie</button>`;
    }
    if(p.inscrit&&theorie()&&!p.brevet)h+=`<p style="font-size:12px">Ta théorie est validée : va à l’avion garé devant le terminal pour passer le vol d’examen.</p>`;
    if(p.brevet)h+=`<p style="font-size:12px">Tu es pilote ! Monte dans l’avion garé devant le terminal pour tes missions chronométrées.</p>`;
    h+=`<button onclick="simInfoAero()">🌍 Les aéroports de la RDC</button><button class="s" onclick="closeDialog()">Fermer</button>`;
    return h;
  }
  function vueMissions(d){
    const p=pil();let h='<h3>🛩 L’avion</h3>';
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    h+='<p style="font-size:12px">Choisis ton vol. Le chrono démarre quand tu commences à rouler. En cas d’échec (temps écoulé, accident), tu rentres à l’aéroport.</p>';
    MISSIONS.forEach(m=>{const ok=m.brevet?(p.inscrit&&theorie()):p.brevet;const r=p.m[m.id];
      h+=ok?`<button class="${r?'':'p'}" onclick="simAvionMission('${m.id}')">${r?'✅':'▶'} ${esc(m.nom)} <small>(${Math.floor(m.tmax/60)} min ${m.tmax%60} s${r?' · record '+r.best+' s':''})</small><br><small>${esc(m.txt)} · +${m.rec} 🪙</small></button>`:`<div style="padding:8px;margin:3px 0;background:#eee;border-radius:8px;font-size:12px;color:#888">🔒 ${esc(m.nom)} : ${m.brevet?'il faut l’inscription et la théorie validée':'il faut le brevet de pilote'}</div>`});
    if(p.brevet)h+='<button onclick="simAvionMission(\'libre\')">🕊 Vol libre (sans chrono)</button>';
    return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
  }
  function avion(missionId){
    const p=pil();
    const m=MISSIONS.find(x=>x.id===missionId)||null;
    cadre('🛫 Cockpit','pilotage',c=>{
      c.style.padding='0';c.style.overflow='hidden';
      const sim=lancerAvion(c,{mission:m,toast:t=>toast(t),
        onQuit:()=>{fermer();closeDialog()},
        onFin:r=>{
          if(!r.id)return;
          const mm=MISSIONS.find(x=>x.id===r.id),pp=pil();
          if(r.ok){
            const prem=!pp.m[r.id];if(!pp.m[r.id])pp.m[r.id]={best:r.temps,fois:0};pp.m[r.id].fois++;pp.m[r.id].best=Math.min(pp.m[r.id].best,r.temps);
            const g=prem?mm.rec:Math.floor(mm.rec/4);A().pieces+=g;A().xp+=prem?20:4;pts('pilotage',prem?30:8);
            if(mm.brevet&&!pp.brevet){pp.brevet=true;toast('🪪 Brevet de pilote obtenu ! Les missions sont ouvertes.')}
            save();refreshHud();SFX.bravo&&SFX.bravo();toast('Mission réussie : +'+g+' 🪙');parler('Mission accomplie, bravo !')}
          else{pts('pilotage',2);save();SFX.ko&&SFX.ko();parler('Mission échouée. Retour à l’aéroport.')}
        }});
      stopFn=()=>sim.stop();window.__AV=sim;
    });
    parler('Procédure de départ : ouvre la porte, monte à bord, allume la batterie, vérifie le frein, puis démarre le moteur.');
  }
  const toast=t=>D.toast(t);
  // ---------- PROFIL DE TALENTS
  function profil(){
    const t=talents(),a=A();
    // points des quiz de métiers
    const dm={detective:'enquete',laboratoire:'science',hopital:'sante',decoration:'deco',mode:'mode',ville:'ville',musique:'musique',pilotage:'pilotage'};
    const total={};Object.keys(TALENTS).forEach(k=>total[k]=(t[k]||0));
    D.modules().forEach(m=>m.dossiers.forEach(x=>{const s=a.stars['met:'+x.id]||0;if(s&&dm[m.id])total[dm[m.id]]+=s*6}));
    total.terre+=(a.ferme?(a.ferme.nbR||0)*3:0);
    const max=Math.max(1,...Object.values(total));
    const tri=Object.keys(total).sort((x,y)=>total[y]-total[x]);
    let h='<h3>🌟 Mon profil de talents</h3><p style="font-size:13px">Plus tu essaies de métiers, plus ce profil devient précis. Ce n’est pas une règle : c’est une piste pour te connaître.</p>';
    tri.forEach(k=>{h+=`<div style="margin:5px 0;font-size:13px">${TALENTS[k].ico} ${TALENTS[k].nom} <b>${total[k]}</b><div style="background:#ddd;border-radius:6px;height:10px"><div style="width:${Math.round(total[k]*100/max)}%;background:#2e7d32;height:10px;border-radius:6px"></div></div></div>`});
    if(total[tri[0]]>0){h+=`<h4>Pistes de métiers</h4>`;tri.slice(0,3).filter(k=>total[k]>0).forEach(k=>{h+=`<p style="font-size:13px"><b>${TALENTS[k].ico} ${TALENTS[k].nom}</b> : ${TALENTS[k].metiers.join(', ')}.</p>`})}
    else h+='<p>Essaie le studio, le salon de mode, l’atelier de décoration ou le simulateur de vol pour commencer.</p>';
    h+='<p style="font-size:12px;opacity:.8">À partir de ces pistes, parle avec tes parents et tes enseignants : un conseil d’orientation complète toujours ce profil.</p><button class="s" onclick="closeDialog()">Fermer</button>';
    return h;
  }
  const tenir=f=>{if(!G.dialog)openBox({kind:'metiers',vue:'sim',msg:''});f()};
  const MJ=creerModeJeu({A,save,refreshHud,toast:t=>D.toast(t),parler,pts,SFX,esc,mannequin:L=>mannequin(L),PIECES,COUL,MOTIFS,libre:()=>ov&&ov.querySelector('#md')});
  const actions=Object.assign({},MJ.actions,{
    simMusique:()=>tenir(musique),simMode:()=>tenir(mode),simDeco:()=>tenir(deco),simAeroport:aeroport,simAvion:()=>openBox({kind:'metiers',vue:'missions',msg:''}),simAvionMission:id=>tenir(()=>avion(id)),simInscriptionPilote:()=>{const d=G.dialog;if(A().pieces<20){d.msg='Il te manque '+(20-A().pieces)+' pièces.';SFX.ko&&SFX.ko();rr();return}A().pieces-=20;pil().inscrit=true;save();refreshHud();SFX.coin&&SFX.coin();d.msg='Inscription validée ! Prépare maintenant la théorie.';rr()},simCours:id=>{fermer();openBox({kind:'metiers',vue:'module',m:id,msg:''})},simProfil:()=>openBox({kind:'metiers',vue:'profil'}),
    simInfoAero:()=>{const d=G.dialog;d.vue='infoaero';require_render()},
    simMuInst:k=>{inst=k;dessineMu()},
    simNote:i=>{son(inst,NOTES[i][1]);pts('musique',0)},
    simCase:(r,i)=>{grille[r][i]=grille[r][i]?0:1;const b=ov.querySelector('#g'+r+'_'+i);if(b)b.style.background=grille[r][i]?'#2e7d32':(i%4===0?'#dfe8d8':'#fff');if(grille[r][i]){const p=PISTES[r];son(p[0],p[1])}},
    simMuPlay:()=>{if(joue){joue=false;clearInterval(timer);dessineMu();return}joue=true;pas=0;audio();timer=setInterval(tick,60000/tempo/4);dessineMu()},
    simMuTempo:v=>{tempo=+v;if(joue){clearInterval(timer);timer=setInterval(tick,60000/tempo/4)}},
    simMuVider:()=>{grille=PISTES.map(()=>Array(16).fill(0));dessineMu()},
    simMuDemo:()=>{grille=DEMO();dessineMu()},
    simMuSave:()=>{const a=A();if(!a.compos)a.compos=[];if(a.compos.length>=5)a.compos.shift();a.compos.push({nom:'Ma création '+(a.compos.length+1),tempo,g:grille.map(r=>r.slice())});pts('musique',8);save();SFX.bravo&&SFX.bravo();toast('Création enregistrée !');dessineMu()},
    simMuCharge:i=>{const z=A().compos[i];grille=z.g.map(r=>r.slice());tempo=z.tempo;dessineMu()},
    simMdCat:k=>{look.cat=k;dessineMode()},
    simMdSet:(k,v)=>{look[k]=v;dessineMode()},
    simMdTheme:id=>{look.theme=id;dessineMode()},
    simMdAlea:()=>{const pick=a=>a[Math.floor(Math.random()*a.length)];Object.keys(PIECES).forEach(k=>look[k]=pick(PIECES[k].o)[1]);look.cH=pick(COUL);look.cB=pick(COUL);look.cR=pick(COUL);look.mR=pick(MOTIFS)[1];dessineMode()},
    simMdSave:()=>{const a=A();if(!a.looks)a.looks=[];if(a.looks.length>=6)a.looks.shift();a.looks.push(JSON.parse(JSON.stringify(look)));pts('mode',6);save();toast('Tenue enregistrée !');dessineMode()},
    simMdCharge:i=>{look=Object.assign({},A().looks[i]);dessineMode()},
    simMdDefile:()=>{const n=noteLook(look);if(!n)return;const a=A();if(!a.defiles)a.defiles={};
      const st=n.ok>=n.tot?3:n.ok>=n.tot-1?2:1;
      const premier=!a.defiles[n.th.id];a.defiles[n.th.id]=Math.max(a.defiles[n.th.id]||0,st);
      if(premier){a.pieces+=3*st;a.xp+=4;refreshHud()}pts('mode',10*st);save();
      toast((st===3?'Défilé triomphal ! ':st===2?'Joli défilé. ':'Tenue à améliorer. ')+'⭐'.repeat(st)+(n.det.length?' · À revoir : '+n.det.join(', '):'')+(premier?' · +'+3*st+' 🪙':''));
      parler(st===3?'Bravo, ta tenue convient parfaitement à ce thème !':'Ta tenue peut encore mieux correspondre à ce thème.');dessineMode()},
    simDcSalle:id=>{dec=nouvDec(SALLES.find(s=>s.id===id));dessineDeco()},
    simDcCur:id=>{dec.cur=id;dessineDeco()},
    simDcCoul:(k,v)=>{dec[k]=v;dessineDeco()},
    simDcPose:(x,y)=>{const c=CAT.find(z=>z.id===dec.cur);if(!libre(x,y,c.w,c.h)){SFX.ko&&SFX.ko();return}dec.items.push({id:c.id,x,y});SFX.coin&&SFX.coin();dessineDeco()},
    simDcRetire:k=>{dec.items.splice(k,1);dessineDeco()},
    simDcVide:()=>{dec.items=[];dessineDeco()},
    simMdLibre:()=>dessineMode(),
    simDcValide:()=>{const S=dec.salle,cout=coutDec(),manque=S.besoin.filter(b=>!dec.items.some(i=>i.id===b));
      if(manque.length){toast('Il manque : '+manque.map(b=>CAT.find(z=>z.id===b).nom).join(', '));SFX.ko&&SFX.ko();return}
      if(cout>S.budget){toast('Budget dépassé de '+(cout-S.budget)+' FC : retire un meuble.');SFX.ko&&SFX.ko();return}
      const a=A();if(!a.deco)a.deco={};const premier=!a.deco[S.id];a.deco[S.id]=true;if(premier){a.pieces+=10;a.xp+=8;refreshHud()}pts('deco',12);save();SFX.bravo&&SFX.bravo();toast('Projet validé ! '+(premier?'+10 🪙':''));parler('Bravo, ton projet respecte le budget et la liste demandée.');dessineDeco()}
  });
  const rr=()=>D.renderDialog();
  function require_render(){rr()}
  return {
    actions,
    html:d=>d.vue==='aeroport'?vueAeroport(d):d.vue==='missions'?vueMissions(d):d.vue==='profil'?profil():d.vue==='infoaero'?`<h3>🌍 Aéroports de la RDC</h3><p style="font-size:13px">N’djili (Kinshasa), Luano (Lubumbashi), Goma, Kisangani Bangoboka, Mbuji-Mayi, Kananga, Bukavu Kavumu. Le pays est très vaste et les routes sont souvent difficiles : l’avion relie les provinces. Les pilotes, les contrôleurs et les mécaniciens y sont indispensables.</p><button onclick="simAeroport()">← Aéroport</button>`:null,
    bouton:()=>'<button onclick="simProfil()">🌟 Mon profil de talents</button>',
    spots(){return []},
    fermer
  };
}
