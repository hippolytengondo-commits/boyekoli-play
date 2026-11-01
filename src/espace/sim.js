// Simulation de vol simplifiée (2D, unités réduites) : poussée, étages, gravité décroissante, force centrifuge, traînée de l'air.
export const CORPS={
 terre:{nom:'la Terre',R:1000,g:10,atm:1,col:'#2f6fb5'},
 lune:{nom:'la Lune',R:270,g:1.6,atm:0,col:'#b9b9b9'},
 mars:{nom:'Mars',R:530,g:3.7,atm:0.2,col:'#b5572f'},
 aster:{nom:'l’astéroïde',R:60,g:.25,atm:0,col:'#8a7a66'}};
export const vc=(c,h)=>{const C=CORPS[c];const r=C.R+h,g=C.g*(C.R/r)**2;return Math.sqrt(g*r)};
export const FE=200,VE=110;                 // poussée par moteur, vitesse d'éjection
export function fusee(plan,charge){       // plan : [{m:moteurs,r:réservoirs}, …] du bas vers le haut
  const et=plan.map(e=>({m:e.m,r:e.r,dry:1.5+.6*e.m+.4*e.r,fuel:10*e.r,f:10*e.r}));return {et,charge:charge||2,cur:0}}
export const masse=f=>f.charge+f.et.slice(f.cur).reduce((t,e)=>t+e.dry+e.f,0);
export function nouvelEtat(corps,f,dep){
  const C=CORPS[corps];dep=dep||{};return {corps,h:dep.h||0,x:0,vx:dep.vx||0,vy:dep.vy||0,th:dep.th||0,pouss:false,f,t:0,fini:null,orb:0,maxH:0,pos:0}}
// pas de simulation ; cmd : {pouss:bool, th:angle(rad), auto:bool, mode:'montee'|'atterri', cibleH}
export function pas(s,dt,cmd){
  if(s.fini)return;const C=CORPS[s.corps],f=s.f,e=f.et[f.cur];s.t+=dt;
  const r=C.R+s.h,g=C.g*(C.R/r)**2,m=masse(f);let ax=0,ay=0,Tx=0;
  const Tmax=e?FE*e.m:0;let thr=0;
  if(cmd.mode==='atterri'&&cmd.auto&&e&&e.f>0){
    // atterrissage assisté : annule la vitesse horizontale et ralentit la chute
    const vyT=-Math.min(8,.12*s.h+1.2),ayN=Math.max(0,g-s.vx*s.vx/r+3*(vyT-s.vy)),axN=-s.vx*.9;
    const Fn=Math.hypot(ayN,axN)*m;thr=Math.min(1,Math.max(0,Fn/Tmax));if(s.h<1&&Math.abs(s.vy)<2)thr=0;s.th=Math.max(-1.5,Math.min(1.5,Math.atan2(axN,Math.max(.1,ayN))));s.pouss=thr>0.02;
  }else if(cmd.mode==='montee'&&cmd.auto){
    const tgt=cmd.cibleH||150,aT=Tmax/m;
    if(s.h<tgt*.55){s.th=Math.PI/2*Math.pow(Math.max(0,s.h)/(tgt*.8),.6);if(s.th>1.5)s.th=1.5;thr=e?1:0}
    else{const vcT=vc(s.corps,s.h),vyT=(tgt-s.h)*.12,ayN=(vyT-s.vy)*1.5+g-s.vx*s.vx/r,axN=(vcT-s.vx)*1.5,F=Math.hypot(axN,ayN);s.th=Math.atan2(axN,ayN);thr=e&&F>.15?Math.min(1,F/Math.max(1,aT)):0}
    s.pouss=thr>0;
  }else thr=s.pouss?1:0;
  if(e&&e.f>0&&thr>0){
    const fl=Math.min(e.f,FE*e.m/VE*thr*dt),F=fl/dt*VE;e.f-=fl;
    ax+=F/m*Math.sin(s.th);ay+=F/m*Math.cos(s.th);s.brule=true}
  else{s.brule=false;if(e&&e.f<=0.001&&f.cur<f.et.length-1){f.cur++;s.sep=true}}
  // traînée
  if(C.atm){const rho=Math.exp(-s.h/32)*C.atm,v=Math.hypot(s.vx,s.vy);const k=.0016*rho*v;ax-=k*s.vx/Math.max(1,m)*10;ay-=k*s.vy/Math.max(1,m)*10}
  ay+=-g+s.vx*s.vx/r;
  s.vx+=ax*dt;s.vy+=ay*dt;s.h+=s.vy*dt;s.x+=s.vx*dt;s.pos=s.x/r;if(s.h>s.maxH)s.maxH=s.h;
  s.g=g;
  if(s.h>3)s.air=true;
  if(s.h<=0){if(!s.air){s.h=0;if(s.vy<0)s.vy=0;s.vx=0;s.x=0}else{s.h=0;const v=Math.hypot(s.vx,s.vy);s.impact={vy:s.vy,vx:s.vx,v};s.fini=Math.abs(s.vy)<6&&Math.abs(s.vx)<4?'pose':'crash'}}
}
