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
function modele(type){
  const g=new THREE.Group(),b=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);g.add(m);return m};
  if(type==='chien'){b(.3,.28,.62,'#b5763a',0,.4,0);b(.26,.24,.26,'#b5763a',0,.62,.36);b(.1,.14,.08,'#6b4423',-.1,.74,.36);b(.1,.14,.08,'#6b4423',.1,.74,.36);b(.1,.28,.1,'#b5763a',-.1,.14,.22);b(.1,.28,.1,'#b5763a',.1,.14,.22);b(.1,.28,.1,'#b5763a',-.1,.14,-.22);b(.1,.28,.1,'#b5763a',.1,.14,-.22);const t=b(.06,.06,.3,'#b5763a',0,.55,-.42);t.rotation.x=-.7}
  else if(type==='chat'){b(.24,.22,.5,'#8d9aa6',0,.32,0);b(.2,.2,.2,'#8d9aa6',0,.5,.3);b(.07,.1,.05,'#6b7682',-.07,.64,.3);b(.07,.1,.05,'#6b7682',.07,.64,.3);[[-.08,.2],[.08,.2],[-.08,-.2],[.08,-.2]].forEach(([x,z])=>b(.07,.2,.07,'#8d9aa6',x,.1,z));const t=b(.05,.05,.4,'#8d9aa6',0,.48,-.4);t.rotation.x=-.9}
  else if(type==='lapin'){b(.24,.22,.34,'#f1f1f1',0,.26,0);b(.18,.18,.18,'#f1f1f1',0,.4,.2);b(.05,.22,.05,'#f1f1f1',-.05,.62,.2);b(.05,.22,.05,'#f1f1f1',.05,.62,.2);b(.1,.1,.1,'#f1f1f1',0,.3,-.2)}
  else {b(.16,.28,.14,'#2e9e4a',0,.34,0);b(.14,.14,.14,'#2e9e4a',0,.55,.04);b(.06,.06,.1,'#f0b429',0,.54,.14);b(.1,.08,.08,'#c0392b',0,.2,-.1);b(.08,.3,.05,'#c0392b',0,.1,-.12)}
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
