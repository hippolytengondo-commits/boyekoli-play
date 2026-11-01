// Moteur sonore de BOYEKOLI MUSIC STUDIO : tous les sons sont générés par synthèse (Web Audio API), sans fichier audio.
// Chaque instrument a son propre timbre : cordes pincées (Karplus-Strong), claviers, vents, percussions, instruments africains.
export const hz=m=>440*Math.pow(2,(m-69)/12);
export const MELODIQUES=['guitare_ac','guitare_el','piano_cordes','violon','harpe','ukulele','piano','orgue','synthe','clavier_elec','flute','trompette','saxophone','clarinette','trombone','harmonica','xylophone','balafon','likembe'];
export const PADS_N={batterie:7,djembe:3,tamtam:3,bongos:2,congas:3,tambour_congolais:3,ngoma:2,maracas:2,triangle:2,tambourin:2};

export function creerSynth(ctx,dest){
  const master=ctx.createGain();master.gain.value=.85;
  const comp=ctx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=6;
  master.connect(comp);comp.connect(dest||ctx.destination);
  const bus=[];for(let i=0;i<7;i++){const g=ctx.createGain();g.gain.value=1;g.connect(master);bus.push(g)}
  const sr=ctx.sampleRate;
  // bruit blanc partagé
  const nb=ctx.createBuffer(1,sr,sr),nd=nb.getChannelData(0);for(let i=0;i<sr;i++)nd[i]=Math.random()*2-1;
  const ksCache={};
  function ks(f,decay,dur,bright){
    const key=Math.round(f*10)+'_'+decay+'_'+dur+'_'+bright;if(ksCache[key])return ksCache[key];
    const N=Math.max(2,Math.round(sr/f)),buf=new Float32Array(N);for(let i=0;i<N;i++)buf[i]=(Math.random()*2-1)*(bright?1:.7);
    if(!bright)for(let k=0;k<2;k++)for(let i=0;i<N;i++)buf[i]=(buf[i]+buf[(i+1)%N])*.5;
    const len=Math.floor(sr*dur),b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0);let p=0;
    for(let i=0;i<len;i++){const a=buf[p],c=buf[(p+1)%N];d[i]=a;buf[p]=(a+c)*.5*decay;p=(p+1)%N}
    return ksCache[key]=b}
  const dist=(k)=>{const c=new Float32Array(256);for(let i=0;i<256;i++){const x=i/128-1;c[i]=Math.tanh(x*k)}return c};
  function env(g,t,a,peak,hold,r){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+hold);g.gain.exponentialRampToValueAtTime(.0005,t+a+hold+r)}
  function dec(g,t,peak,d,a){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+(a||.003));g.gain.exponentialRampToValueAtTime(.0005,t+(a||.003)+d)}
  function osc(type,f,t,dur,out,det){const o=ctx.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(det)o.detune.value=det;o.connect(out);o.start(t);o.stop(t+dur);return o}
  function noise(t,dur,type,f,q,peak,d,out){const s=ctx.createBufferSource();s.buffer=nb;s.loop=true;const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q||1;const g=ctx.createGain();dec(g,t,peak,d,.002);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+dur)}
  function tom(t,f0,f1,d,peak,out,nz,nf){const g=ctx.createGain();dec(g,t,peak,d,.002);const o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d*.5);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.05);
    if(nz)noise(t,d,'bandpass',nf||1500,1,nz,Math.min(.25,d),out)}
  function vib(o,t,rate,depth,delay){const l=ctx.createOscillator(),g=ctx.createGain();l.frequency.value=rate;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(depth,t+(delay||.2));l.connect(g);g.connect(o.frequency);l.start(t);l.stop(t+3)}
  const MEL={
    guitare_ac:(f,t,d,o)=>{const s=ctx.createBufferSource();s.buffer=ks(f,.9965,1.8,true);const g=ctx.createGain();g.gain.value=.7;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=4200;s.connect(lp);lp.connect(g);g.connect(o);s.start(t)},
    guitare_el:(f,t,d,o)=>{const s=ctx.createBufferSource();s.buffer=ks(f,.9985,2.2,true);const ws=ctx.createWaveShaper();ws.curve=dist(4);const g=ctx.createGain();g.gain.value=.38;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;s.connect(ws);ws.connect(lp);lp.connect(g);g.connect(o);s.start(t)},
    ukulele:(f,t,d,o)=>{const s=ctx.createBufferSource();s.buffer=ks(f,.994,1.1,true);const g=ctx.createGain();g.gain.value=.8;s.connect(g);g.connect(o);s.start(t)},
    harpe:(f,t,d,o)=>{const s=ctx.createBufferSource();s.buffer=ks(f,.9994,2.6,false);const g=ctx.createGain();g.gain.value=1.1;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3800;s.connect(lp);lp.connect(g);g.connect(o);s.start(t);
      const g2=ctx.createGain();dec(g2,t,.12,1.6,.004);osc('sine',f,t,1.8,g2);g2.connect(o)},
    piano:(f,t,d,o)=>{const amps=[1,.5,.3,.16,.08,.04],D=f<200?2.6:f<500?1.8:1.0;amps.forEach((a,i)=>{const g=ctx.createGain();dec(g,t,.26*a,D/(1+i*.5),.004);osc('sine',f*(i+1)*(1+i*i*.0004),t,D+.1,g);g.connect(o)});noise(t,.05,'bandpass',2800,1,.05,.04,o)},
    piano_cordes:(f,t,d,o)=>{[1,2,3,4,5,6,7].forEach((m,i)=>{const g=ctx.createGain();dec(g,t,.22/(i+1)*1.4,(f<300?3.2:2)/(1+i*.4),.006);osc('sine',f*m*(1+i*i*.0006),t,3.4,g);g.connect(o)});noise(t,.06,'bandpass',3500,1.2,.07,.05,o)},
    orgue:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.03,.16,d,.12);[1,2,3,4,6,8].forEach((m,i)=>{const gg=ctx.createGain();gg.gain.value=[1,.8,.55,.4,.25,.15][i];osc('sine',f*m,t,d+.3,gg);gg.connect(g)});g.connect(o)},
    synthe:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.02,.22,d,.25);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(3200,t);lp.frequency.exponentialRampToValueAtTime(700,t+d+.25);lp.Q.value=4;lp.connect(g);g.connect(o);osc('sawtooth',f,t,d+.4,lp,-8);osc('sawtooth',f,t,d+.4,lp,8);osc('square',f/2,t,d+.4,lp)},
    clavier_elec:(f,t,d,o)=>{const g=ctx.createGain();dec(g,t,.3,1.3,.004);const c=ctx.createOscillator();c.frequency.value=f;const m=ctx.createOscillator();m.frequency.value=f*1;const mg=ctx.createGain();mg.gain.setValueAtTime(f*2.2,t);mg.gain.exponentialRampToValueAtTime(f*.05,t+.9);m.connect(mg);mg.connect(c.frequency);c.connect(g);g.connect(o);c.start(t);m.start(t);c.stop(t+1.5);m.stop(t+1.5);
      const g2=ctx.createGain();dec(g2,t,.06,.18,.002);osc('sine',f*7,t,.3,g2);g2.connect(o)},
    violon:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.13,.17,d,.2);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2600;lp.connect(g);g.connect(o);const a=osc('sawtooth',f,t,d+.5,lp,-5),b=osc('sawtooth',f,t,d+.5,lp,5);vib(a,t,5.6,f*.008,.25);vib(b,t,5.6,f*.008,.25)},
    flute:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.07,.3,d,.15);osc('sine',f,t,d+.4,g);const g2=ctx.createGain();g2.gain.value=.12;osc('triangle',f*2,t,d+.4,g2);g2.connect(g);g.connect(o);noise(t,d+.3,'bandpass',f*2,2,.05,Math.max(.2,d),o)},
    trompette:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.03,.24,d,.12);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(900,t);lp.frequency.linearRampToValueAtTime(3600,t+.08);lp.Q.value=3;lp.connect(g);g.connect(o);osc('sawtooth',f,t,d+.3,lp);osc('square',f,t,d+.3,lp,4)},
    saxophone:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.045,.26,d,.15);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1900;lp.Q.value=2;lp.connect(g);g.connect(o);const a=osc('sawtooth',f,t,d+.4,lp);osc('square',f,t,d+.4,lp,-6);vib(a,t,5,f*.006,.3);noise(t,d+.3,'bandpass',f*3,1,.04,d,o)},
    clarinette:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.04,.28,d,.12);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1500;lp.connect(g);g.connect(o);osc('square',f,t,d+.3,lp);osc('sine',f,t,d+.3,lp)},
    trombone:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.09,.28,d,.18);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(500,t);lp.frequency.linearRampToValueAtTime(1500,t+.2);lp.connect(g);g.connect(o);osc('sawtooth',f/2,t,d+.4,lp);osc('sawtooth',f/2,t,d+.4,lp,6)},
    harmonica:(f,t,d,o)=>{const g=ctx.createGain();env(g,t,.03,.18,d,.12);const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3200;lp.connect(g);g.connect(o);osc('square',f,t,d+.3,lp,-7);osc('square',f,t,d+.3,lp,7);const tr=ctx.createOscillator(),tg=ctx.createGain();tr.frequency.value=6;tg.gain.value=.05;tr.connect(tg);tg.connect(g.gain);tr.start(t);tr.stop(t+d+.5)},
    xylophone:(f,t,d,o)=>{const g=ctx.createGain();dec(g,t,.5,.35,.002);osc('sine',f,t,.5,g);g.connect(o);const g2=ctx.createGain();dec(g2,t,.12,.12,.002);osc('sine',f*3.9,t,.2,g2);g2.connect(o);noise(t,.03,'bandpass',4000,2,.08,.02,o)},
    balafon:(f,t,d,o)=>{const g=ctx.createGain();dec(g,t,.34,.9,.003);osc('sine',f,t,1.1,g);g.connect(o);const g2=ctx.createGain();dec(g2,t,.1,.4,.003);osc('sine',f*2,t,.6,g2);g2.connect(o);noise(t,.5,'bandpass',2600,3,.045,.35,o);noise(t,.03,'bandpass',3500,2,.07,.02,o)},
    likembe:(f,t,d,o)=>{const g=ctx.createGain();dec(g,t,.3,1.1,.002);osc('sine',f,t,1.3,g);g.connect(o);const g2=ctx.createGain();dec(g2,t,.1,.35,.002);osc('sine',f*2.76,t,.5,g2);g2.connect(o);const g3=ctx.createGain();dec(g3,t,.05,.12,.002);osc('sine',f*5.4,t,.2,g3);g3.connect(o);noise(t,.03,'lowpass',900,1,.08,.02,o)}
  };
  const PAD={
    batterie:[(t,o)=>tom(t,160,48,.38,.9,o,.12,900),(t,o)=>{noise(t,.2,'bandpass',1900,.7,.45,.17,o);tom(t,210,150,.12,.5,o)},(t,o)=>noise(t,.1,'highpass',7500,.7,.7,.06,o),(t,o)=>noise(t,.5,'highpass',6800,.7,.5,.35,o),(t,o)=>tom(t,240,140,.3,.7,o,.05,2000),(t,o)=>tom(t,140,75,.42,.8,o,.05,1500),(t,o)=>noise(t,1.4,'highpass',4200,.6,.32,1.2,o)],
    djembe:[(t,o)=>tom(t,115,68,.55,.9,o,.08,500),(t,o)=>tom(t,270,205,.26,.75,o,.18,1800),(t,o)=>{noise(t,.14,'bandpass',3200,1,.5,.1,o);tom(t,420,380,.1,.3,o)}],
    tamtam:[(t,o)=>{tom(t,88,56,.9,.95,o,.06,400);tom(t,132,90,.5,.35,o)},(t,o)=>tom(t,125,84,.65,.85,o,.06,500),(t,o)=>tom(t,175,120,.5,.8,o,.08,700)],
    bongos:[(t,o)=>tom(t,430,340,.2,.75,o,.2,2500),(t,o)=>tom(t,320,250,.25,.75,o,.18,2000)],
    congas:[(t,o)=>tom(t,340,285,.34,.8,o,.1,1500),(t,o)=>tom(t,235,190,.4,.85,o,.1,1200),(t,o)=>{noise(t,.12,'bandpass',2600,1.2,.55,.09,o);tom(t,410,360,.08,.3,o)}],
    tambour_congolais:[(t,o)=>{tom(t,180,160,.28,.8,o);noise(t,.03,'bandpass',1400,3,.25,.02,o)},(t,o)=>{tom(t,235,210,.25,.8,o);noise(t,.03,'bandpass',1800,3,.25,.02,o)},(t,o)=>{tom(t,310,280,.22,.8,o);noise(t,.03,'bandpass',2200,3,.25,.02,o)}],
    ngoma:[(t,o)=>tom(t,72,48,1,1,o,.08,300),(t,o)=>tom(t,150,102,.62,.85,o,.1,700)],
    maracas:[(t,o)=>noise(t,.14,'bandpass',6200,1.4,.9,.1,o),(t,o)=>{noise(t,.08,'bandpass',6200,1.4,.8,.06,o);noise(t+.07,.12,'bandpass',6500,1.4,.9,.08,o)}],
    triangle:[(t,o)=>[4200,6300,8800].forEach((f,i)=>{const g=ctx.createGain();dec(g,t,.3/(i+1),1.5,.002);osc('sine',f,t,1.6,g);g.connect(o)}),(t,o)=>[4200,6300].forEach((f,i)=>{const g=ctx.createGain();dec(g,t,.3/(i+1),.2,.002);osc('sine',f,t,.3,g);g.connect(o)})],
    tambourin:[(t,o)=>{noise(t,.3,'highpass',6000,.7,.6,.22,o);[5200,7300].forEach(f=>{const g=ctx.createGain();dec(g,t,.05,.2,.002);osc('sine',f,t,.3,g);g.connect(o)})},(t,o)=>{noise(t,.1,'bandpass',3000,.8,.7,.07,o);tom(t,300,220,.1,.3,o)}]
  };
  // jouer(instrument, note midi ou numéro de pad, instant, options)
  function jouer(inst,n,t,opt){
    const o=Object.assign({vol:1,dur:.6,bus:6},opt||{});t=t||ctx.currentTime;
    const out=ctx.createGain();out.gain.value=o.vol;out.connect(bus[o.bus]||master);
    if(MEL[inst])MEL[inst](hz(n),t,o.dur,out);else if(PAD[inst]){const p=PAD[inst];p[Math.max(0,Math.min(p.length-1,n|0))](t,out)}
    return out}
  function volPiste(i,v){if(bus[i])bus[i].gain.value=v}
  return {jouer,volPiste,master,bus,ctx,comp};
}
