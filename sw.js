// Mode hors connexion de BOYEKOLI PLAY (fichier généré par scripts/gen-sw.mjs : ne pas modifier à la main).
// Au premier lancement, TOUT le jeu (page, scripts, styles, images, icônes) est copié dans la mémoire de l'appareil :
// ensuite le jeu démarre et fonctionne sans Internet. Quand Internet est disponible, la dernière version est récupérée.
// Les appels au serveur des comptes (autre domaine) ne sont jamais mis en mémoire : ils échouent sans bloquer le jeu.
const NOM='boyekoli-a337d54021';
const FICHIERS=["./","dist/game.js","icons/apple-touch-icon.png","icons/favicon-32.png","icons/favicon-64.png","icons/icon-192.png","icons/icon-512.png","icons/logo-embleme.png","icons/logo.png","icons/maskable-512.png","img/avatars/f1.jpg","img/avatars/f2.jpg","img/avatars/f3.jpg","img/avatars/f4.jpg","img/avatars/h1.jpg","img/avatars/h2.jpg","img/avatars/h3.jpg","img/avatars/h4.jpg","img/chars/bea.webp","img/chars/ilunga.webp","img/chars/jer.webp","img/chars/junior.webp","img/chars/kasa.webp","img/chars/lola.webp","img/chars/mama.webp","img/chars/mavungu.webp","img/chars/pf1.webp","img/chars/pf1w.webp","img/chars/pf2.webp","img/chars/ph1.webp","img/chars/ph2.webp","img/faces.json","img/lexotheque-lx.jpg","img/lexotheque.jpg","img/manifest.json","img/mcezemo.jpg","img/musee/cuivre.jpg","img/musee/danse.jpg","img/musee/diamant.jpg","img/musee/fleuve.jpg","img/musee/gorille.jpg","img/musee/likembe.jpg","img/musee/lumumba.jpg","img/musee/masque.jpg","img/musee/mine.jpg","img/musee/muyembe.jpg","img/musee/nyiragongo.jpg","img/musee/okapi.jpg","img/musee/or.jpg","img/musee/poterie.jpg","img/musee/rumba.jpg","img/musee/statue.jpg","img/musee/tambour.jpg","img/musee/tissus.jpg","img/musee/vannerie.jpg","img/musee/virunga.jpg","img/musee/wissa.jpg","img/musee/zongo.jpg","img/portraits/bea.jpg","img/portraits/ilunga.jpg","img/portraits/junior.jpg","img/portraits/lola.jpg","img/portraits/mama.jpg","img/portraits/mavungu.jpg","img/rulems.jpg","img/scenes/classe.jpg","img/scenes/fleuve.jpg","img/scenes/kinshasa.jpg","img/scenes/maison.jpg","img/scenes/marche.jpg","img/scenes/portail.jpg","img/scenes/village.jpg","img/tex/brick.jpg","img/tex/dirt.jpg","img/tex/grass.jpg","index.html","manifest.webmanifest","style.css"];
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
  const code=r.mode==='navigate'||/\.(js|css|html|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
  if(code){
    // réseau d'abord (version la plus récente, 3 s maximum), mémoire en secours : démarrage rapide même avec un mauvais réseau
    e.respondWith(attendre(fetch(r),3000).then(rep=>{if(rep.ok){const c=rep.clone();caches.open(NOM).then(m=>m.put(r,c))}return rep}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')||caches.match('./'))));
  }else{
    // images et autres fichiers : mémoire d'abord
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(rep=>{if(rep.ok){const c=rep.clone();caches.open(NOM).then(m2=>m2.put(r,c))}return rep}).catch(()=>new Response('',{status:504}))));
  }
});
