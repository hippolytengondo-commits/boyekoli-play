// Animaux de compagnie : on adopte un animal à l'animalerie du centre commercial, on le nourrit avec ses provisions, il suit le joueur.
// Sensibilise à la responsabilité : un animal a besoin de nourriture, d'eau, de soins et d'affection.
import * as THREE from 'three';

export const ANIMAUX={
  chien:{ico:'🐶',nom:'Chien',prix:25,noms:['Kali','Rex','Simba'],txt:'Le chien est fidèle et protège la maison. Il aime courir et jouer.'},
  chat:{ico:'🐱',nom:'Chat',prix:25,noms:['Minou','Tigre','Luna'],txt:'Le chat est indépendant et attrape les souris. Il aime dormir au chaud.'},
  lapin:{ico:'🐰',nom:'Lapin',prix:18,noms:['Pompon','Neige','Bouba'],txt:'Le lapin mange des légumes et des feuilles. Il a besoin d’un petit enclos propre.'},
  perroquet:{ico:'🦜',nom:'Perroquet',prix:35,noms:['Coco','Jaco','Zazou'],txt:'Le perroquet gris du Gabon et du Congo sait imiter des sons. Il vit longtemps !'}
};
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
export function modele(type){
  const g=new THREE.Group();
  const mesh=(geo,c,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,M(c));m.position.set(x,y,z);if(sx!==undefined)m.scale.set(sx,sy,sz);if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0);g.add(m);return m};
  const sph=(r,c,x,y,z,sx=1,sy=1,sz=1)=>mesh(new THREE.SphereGeometry(r,16,12),c,x,y,z,sx,sy,sz);
  const cyl=(r1,r2,h,c,x,y,z,rx,ry,rz)=>mesh(new THREE.CylinderGeometry(r1,r2,h,10),c,x,y,z,1,1,1,rx,ry,rz);
  const cone=(r,h,c,x,y,z,rx,ry,rz)=>mesh(new THREE.ConeGeometry(r,h,10),c,x,y,z,1,1,1,rx,ry,rz);
  const yeux=(y,z,dx,r=.035)=>{[-dx,dx].forEach(x=>{sph(r*1.6,'#ffffff',x,y,z);sph(r,'#111',x,y,z+r*1.1)})};
  if(type==='chien'){
    const c='#b5763a',c2='#7a4a22';
    sph(.2,c,0,.42,0,.9,.85,1.7);                                             // corps
    sph(.19,c,0,.6,.34,1,1,1);                                                 // tête
    sph(.11,'#e8c79a',0,.55,.5,1,.8,1);sph(.04,'#111',0,.58,.6);               // museau, truffe
    [-.15,.15].forEach(x=>mesh(new THREE.BoxGeometry(.07,.2,.12),c2,x,.62,.3,1,1,1,.2,0,x>0?-.25:.25));   // oreilles tombantes
    yeux(.65,.46,.07);
    [[-.1,.3],[.1,.3],[-.1,-.3],[.1,-.3]].forEach(([x,z])=>cyl(.05,.045,.3,c,x,.15,z));                  // pattes
    cyl(.03,.05,.3,c2,0,.5,-.4,-1,0,0);                                        // queue
    mesh(new THREE.TorusGeometry(.13,.02,6,16),'#c0392b',0,.5,.28,1,1,1,0,Math.PI/2,0);                 // collier
  }else if(type==='chat'){
    const c='#8d9aa6',c2='#5f6b76';
    sph(.16,c,0,.34,0,.85,.85,1.7);
    sph(.15,c,0,.5,.3,1,1,1);
    [-.09,.09].forEach(x=>cone(.05,.12,c2,x,.65,.3));                          // oreilles pointues
    yeux(.52,.42,.06,.03);sph(.025,'#ff9aa8',0,.49,.46);
    [[-.07,.22],[.07,.22],[-.07,-.22],[.07,-.22]].forEach(([x,z])=>cyl(.035,.03,.25,c,x,.12,z));
    mesh(new THREE.TorusGeometry(.2,.03,6,16,Math.PI),c2,0,.35,-.42,1,1,1,0,Math.PI/2,Math.PI/2);       // queue courbe
    [-1,1].forEach(d=>[0,1,2].forEach(i=>cyl(.002,.002,.12,'#ffffff',d*.1,.48,.44,0,0,Math.PI/2+(i-1)*.25)));
  }else if(type==='lapin'){
    const c='#f2f2f2';
    sph(.17,c,0,.25,0,1,.95,1.3);
    sph(.12,c,0,.36,.2,1,1,1);
    [-.04,.04].forEach(x=>sph(.04,c,x,.58,.17,.8,3.6,.8));                     // grandes oreilles
    [-.04,.04].forEach(x=>sph(.02,'#ffb6c1',x,.58,.2,.6,3.2,.4));
    yeux(.4,.3,.05,.025);sph(.022,'#ff9aa8',0,.36,.32);
    sph(.06,c,0,.25,-.22);                                                      // queue pompon
    [[-.08,.12],[.08,.12]].forEach(([x,z])=>sph(.05,c,x,.06,z,.8,.7,1.6));
    [-.1,.1].forEach(x=>sph(.07,c,x,.12,-.1,.8,1.2,1.5));
  }else{
    const v='#2e9e4a',r='#c0392b';
    cyl(.01,.01,.5,'#7a4a22',0,.25,0);cyl(.12,.12,.04,'#7a4a22',0,.02,0);        // perchoir
    cyl(.01,.01,.22,'#7a4a22',0,.52,0,0,0,Math.PI/2);
    sph(.12,v,0,.66,0,1,1.5,1);                                              // corps
    sph(.095,v,0,.86,.05,1,1,1);                                                // tête
    cone(.035,.09,'#f0b429',0,.85,.15,Math.PI/2+.5,0,0);                        // bec crochu
    yeux(.89,.11,.06,.022);
    [-1,1].forEach(d=>sph(.07,'#237a38',d*.11,.64,-.03,.45,2.1,1.3));   // ailes
    mesh(new THREE.BoxGeometry(.08,.36,.025),r,0,.42,-.15,1,1,1,-.3,0,0);mesh(new THREE.BoxGeometry(.05,.3,.02),'#f0b429',0,.4,-.17,1,1,1,-.3,0,0);       // queue rouge
    sph(.04,'#f1c40f',0,.74,.09,1,1,.5);
  }
  return g;
}

export function creerAnimaux(D){
  const {G,esc,openBox,renderDialog,SFX,save,gain,parler,scene}=D;
  const A=()=>G.adv;
  const pet=()=>A().pet||null;
  let obj=null,px=0,pz=0,t0=0;
  const faimMaintenant=()=>{const p=pet();if(!p)return 0;const mins=(Date.now()-(p.t||Date.now()))/60000;return Math.max(0,Math.round(p.faim-mins/6))};
  const etat=()=>{const f=faimMaintenant();return f>66?'content 😊':f>33?'a un peu faim 😐':f>0?'a très faim 😟':'affamé 😢'};
  function retirer(){if(obj){scene.remove(obj);obj=null}}
  function monter(){
    retirer();const p=pet();if(!p)return;
    obj=modele(p.type);obj.position.set(G.x-1,0,G.z+1);px=G.x-1;pz=G.z+1;scene.add(obj);
  }
  function maj(dt,t){
    const p=pet();if(!obj||!p)return;
    if(G.sc==='interieur'||G.sc==='arene'||G.sc==='conduite'||G.monte){obj.visible=false;return}
    obj.visible=true;
    const cible=p.type==='perroquet'?{x:G.x+Math.cos(G.ry)*.3,z:G.z-Math.sin(G.ry)*.3}:{x:G.x-Math.sin(G.ry)*1.5+Math.cos(G.ry)*.7,z:G.z-Math.cos(G.ry)*1.5-Math.sin(G.ry)*.7};
    const dx=cible.x-px,dz=cible.z-pz,d=Math.hypot(dx,dz),v=Math.min(d,Math.max(0,d-.2)*Math.min(1,dt*3.5)+0);
    if(d>.05){px+=dx/d*v;pz+=dz/d*v;obj.rotation.y=Math.atan2(dx,dz)}
    if(d>18){px=cible.x;pz=cible.z}
    const bouge=d>.4;
    obj.position.set(px,p.type==='perroquet'?1.35+Math.sin(t*5)*.03:(bouge?Math.abs(Math.sin(t*10))*.08:0),pz);
    if(p.type==='perroquet'){obj.rotation.y=G.ry}
  }
  function html(d){
    const p=pet();
    if(d.mode==='adopter'||!p){
      let h='<h3>🐾 Animalerie</h3><p style="font-size:13px">Adopter un animal, c’est une grande responsabilité : il faut le nourrir, lui donner de l’eau, le soigner et lui donner de l’affection, chaque jour.</p>';
      h+=`<p class="row"><span>Mes pièces</span><b>${A().pieces} 🪙</b></p>`;
      if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
      if(p)h+=`<p>Tu as déjà un animal : ${ANIMAUX[p.type].ico} <b>${esc(p.nom)}</b>.</p>`;
      else Object.keys(ANIMAUX).forEach(k=>{const a=ANIMAUX[k];h+=`<button class="${A().pieces>=a.prix?'p':''}" onclick="aniAdopter('${k}')">${a.ico} ${a.nom} · ${a.prix} 🪙<br><small>${esc(a.txt)}</small></button>`});
      return h+'<button class="s" onclick="closeDialog()">Fermer</button>';
    }
    const a=ANIMAUX[p.type],f=faimMaintenant(),pr=A().provisions||{},K=Object.keys(pr).filter(k=>pr[k]>0);
    let h=`<h3>${a.ico} ${esc(p.nom)}</h3><p>${esc(p.nom)} ${etat()}</p><div style="height:12px;border-radius:7px;background:#ddd;overflow:hidden;margin:6px 0"><div style="height:100%;width:${f}%;background:${f>33?'#2a9d5c':'#c0392b'}"></div></div><p style="font-size:12px;opacity:.75">${esc(a.txt)}</p>`;
    if(d.msg)h+=`<p class="ok">${esc(d.msg)}</p>`;
    h+='<h4>Donner à manger</h4>';
    h+=K.length?K.map(k=>`<button onclick="aniNourrir('${k.replace(/'/g,'’')}')">${esc(k)} × ${pr[k]}</button>`).join(''):'<p style="font-size:13px">Tu n’as pas de provisions. Achète de la nourriture au supermarché !</p>';
    return h+'<button onclick="aniJouer()">🎾 Jouer avec '+esc(p.nom)+'</button><button class="s" onclick="closeDialog()">Fermer</button>';
  }
  return {
    html:d=>d.kind==='animal'?html(d):null,monter,retirer,maj,
    possede:()=>!!pet(),
    bouton:()=>{const p=pet();return p?`<button onclick="aniOuvrir()">${ANIMAUX[p.type].ico} Mon animal : ${esc(p.nom)} · ${etat()}</button>`:''},
    actions:{
      aniAnimalerie:()=>{openBox({kind:'animal',mode:'adopter',msg:''});parler('Animalerie. Adopter un animal est une grande responsabilité : il faut le nourrir, le soigner et lui donner de l’affection.')},
      aniOuvrir:()=>openBox({kind:'animal',mode:'soin',msg:''}),
      aniAdopter:k=>{const d=G.dialog,a=ANIMAUX[k];
        if(A().pieces<a.prix){d.msg='Il te manque '+(a.prix-A().pieces)+' pièces.';SFX.ko();renderDialog();return}
        A().pieces-=a.prix;A().pet={type:k,nom:a.noms[Math.floor(Math.random()*a.noms.length)],faim:70,t:Date.now()};save();SFX.bravo();
        d.msg='Bravo ! Tu as adopté '+a.ico+' '+A().pet.nom+'. Il te suivra dans le village. N’oublie pas de le nourrir !';D.refreshHud();monter();renderDialog()},
      aniNourrir:k=>{const d=G.dialog,p=pet(),pr=A().provisions||{},kk=Object.keys(pr).find(x=>x.replace(/'/g,'’')===k);
        if(!p||!kk||!(pr[kk]>0))return;
        pr[kk]--;p.faim=Math.min(100,faimMaintenant()+30);p.t=Date.now();save();SFX.coin();d.msg=p.nom+' a bien mangé ! Merci.';
        gain(0,2,2);renderDialog()},
      aniJouer:()=>{const d=G.dialog,p=pet();if(!p)return;SFX.ok();d.msg=p.nom+' est très content de jouer avec toi !';renderDialog()}
    }
  };
}
