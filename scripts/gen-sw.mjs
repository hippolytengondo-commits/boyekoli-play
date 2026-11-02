// Génère sw.js (mode hors connexion) : liste complète des fichiers du jeu à mettre en mémoire dès la première visite.
import fs from 'fs';import path from 'path';import crypto from 'crypto';
const racine=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const lister=d=>{const o=[];const p=path.join(racine,d);if(!fs.existsSync(p))return o;(function r(x){fs.readdirSync(x,{withFileTypes:true}).forEach(e=>{const f=path.join(x,e.name);if(e.isDirectory())r(f);else if(!/\.(md|txt)$/i.test(e.name))o.push(path.relative(racine,f).split(path.sep).join('/'))})})(p);return o};
const coeur=['./','index.html','style.css','manifest.webmanifest','dist/game.js'];
const fichiers=[...new Set(coeur.concat(lister('img'),lister('icons')))].sort();
const h=crypto.createHash('sha1');['dist/game.js','index.html','style.css'].forEach(f=>{try{h.update(fs.readFileSync(path.join(racine,f)))}catch(e){}});
const version=h.digest('hex').slice(0,10);
const sw=`// Mode hors connexion de BOYEKOLI PLAY (fichier généré par scripts/gen-sw.mjs : ne pas modifier à la main).
// Au premier lancement, TOUT le jeu (page, scripts, styles, images, icônes) est copié dans la mémoire de l'appareil :
// ensuite le jeu démarre et fonctionne sans Internet. Quand Internet est disponible, la dernière version est récupérée.
// Les appels au serveur des comptes (autre domaine) ne sont jamais mis en mémoire : ils échouent sans bloquer le jeu.
const NOM='boyekoli-${version}';
const FICHIERS=${JSON.stringify(fichiers)};
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(NOM).then(c=>Promise.all(FICHIERS.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==NOM&&k.startsWith('boyekoli')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll().then(l=>l.forEach(c=>c.postMessage({type:'hors-ligne-pret',n:FICHIERS.length})))));
});
const attendre=(p,ms)=>new Promise((ok,ko)=>{const t=setTimeout(()=>ko(new Error('délai')),ms);p.then(v=>{clearTimeout(t);ok(v)},e=>{clearTimeout(t);ko(e)})});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin)return;
  const code=r.mode==='navigate'||/\\.(js|css|html|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
  if(code){
    // réseau d'abord (version la plus récente, 3 s maximum), mémoire en secours : démarrage rapide même avec un mauvais réseau
    e.respondWith(attendre(fetch(r),3000).then(rep=>{if(rep.ok){const c=rep.clone();caches.open(NOM).then(m=>m.put(r,c))}return rep}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')||caches.match('./'))));
  }else{
    // images et autres fichiers : mémoire d'abord
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(rep=>{if(rep.ok){const c=rep.clone();caches.open(NOM).then(m2=>m2.put(r,c))}return rep}).catch(()=>new Response('',{status:504}))));
  }
});
`;
fs.writeFileSync(path.join(racine,'sw.js'),sw);
console.log('sw.js généré :',fichiers.length,'fichiers, version',version);
