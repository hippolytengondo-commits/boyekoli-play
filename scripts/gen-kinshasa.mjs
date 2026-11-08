// Convertit les exports OpenStreetMap (GeoJSON, © contributeurs OpenStreetMap, licence ODbL) en carte de jeu compacte.
// Utilisation : node scripts/gen-kinshasa.mjs dossier_des_geojson
import fs from 'fs';import path from 'path';
const dir=process.argv[2]||'.';const LON0=15.33,LAT0=-4.385,S=10;           // 1 unité de jeu = 10 m
const X=lon=>(lon-LON0)*111320*Math.cos(LAT0*Math.PI/180)/S, Z=lat=>-(lat-LAT0)*110574/S;
const feats=new Map();for(const f of fs.readdirSync(dir).filter(f=>/export.*\.geojson$/.test(f)))for(const ft of JSON.parse(fs.readFileSync(path.join(dir,f))).features)feats.set(ft.id,ft);
function dp(p,t){if(p.length<3)return p;const keep=new Array(p.length).fill(false);keep[0]=keep[p.length-1]=true;const st=[[0,p.length-1]];
 while(st.length){const[a,b]=st.pop();let md=0,mi=-1;for(let i=a+1;i<b;i++){const[x1,z1]=p[a],[x2,z2]=p[b],[x,z]=p[i];const dx=x2-x1,dz=z2-z1,l=dx*dx+dz*dz||1e-9;let u=((x-x1)*dx+(z-z1)*dz)/l;u=Math.max(0,Math.min(1,u));const d=Math.hypot(x-(x1+u*dx),z-(z1+u*dz));if(d>md){md=d;mi=i}}
  if(md>t&&mi>0){keep[mi]=true;st.push([a,mi],[mi,b])}}return p.filter((_,i)=>keep[i])}
const CL={trunk:'a',trunk_link:'a',primary:'b',secondary:'c',tertiary:'d'};
const roads=[],pass=[],lieux=[];
for(const ft of feats.values()){const p=ft.properties,h=p.highway,g=ft.geometry.coordinates;if(ft.geometry.type!=='LineString')continue;
 const pts=dp(g.map(c=>[X(c[0]),Z(c[1])]),.35).map(q=>[+q[0].toFixed(1),+q[1].toFixed(1)]);
 if(h==='footway'&&p.bridge){const m=pts[Math.floor(pts.length/2)];pass.push([m[0],m[1]]);continue}
 if(!CL[h])continue;
 roads.push({c:CL[h],n:p.name||'',b:p.bridge?1:0,o:p.oneway==='yes'?1:0,ln:parseInt(p.lanes)||0,p:pts.flat()})}
// BOULEVARD LUMUMBA : 2 chaussées de 4 voies séparées par un terre-plein ; contre-allées (petits boulevards) au niveau de Limete.
// Les 2 chaussées d'OpenStreetMap sont très proches : on les écarte l'une de l'autre pour qu'il reste la place d'un terre-plein.
{const L=roads.filter(r=>r.c==='a'&&(r.n==='Boulevard Lumumba'||/^Pont (Matete|N.djili|Kinkole)/i.test(r.n))),ECART=17;       // distance entre les axes des 2 chaussées
 const segs=[];L.forEach((r,ri)=>{for(let i=0;i<r.p.length/2-1;i++){const a=[r.p[i*2],r.p[i*2+1]],b=[r.p[i*2+2],r.p[i*2+3]],l=Math.hypot(b[0]-a[0],b[1]-a[1])||1;segs.push({a,b,dx:(b[0]-a[0])/l,dz:(b[1]-a[1])/l,ri})}});
 const shiftOf=(x,z,dx,dz)=>{let best=null;for(const s of segs){if(s.dx*dx+s.dz*dz>-.3)continue;const vx=s.b[0]-s.a[0],vz=s.b[1]-s.a[1],l2=vx*vx+vz*vz||1;let u=((x-s.a[0])*vx+(z-s.a[1])*vz)/l2;u=Math.max(0,Math.min(1,u));const px=s.a[0]+u*vx,pz=s.a[1]+u*vz,d=Math.hypot(x-px,z-pz);if(d<ECART&&(!best||d<best.d))best={d,px,pz}}
  if(!best||best.d<.01)return null;const f=(ECART-best.d)/2/best.d;return[(x-best.px)*f,(z-best.pz)*f]};
 const cache=new Map();L.forEach(r=>{for(let i=0;i<r.p.length;i+=2){const k=r.p[i]+','+r.p[i+1];if(!cache.has(k)){const j=Math.min(i,r.p.length-4),dx=r.p[j+2]-r.p[j],dz=r.p[j+3]-r.p[j+1],l=Math.hypot(dx,dz)||1;cache.set(k,shiftOf(r.p[i],r.p[i+1],dx/l,dz/l))}}});
 L.forEach(r=>{for(let i=0;i<r.p.length;i+=2){const sh=cache.get(r.p[i]+','+r.p[i+1]);if(sh){r.p[i]=+(r.p[i]+sh[0]).toFixed(1);r.p[i+1]=+(r.p[i+1]+sh[1]).toFixed(1)}}r.l4=1});
}
// repères nommés : ponts, sauts-de-mouton, ronds-points, places
const reg=new Map();for(const r of roads){if(!r.n)continue;const k=/^(Pont |Saut-de-Mouton|Rond|Place )/i.test(r.n)?r.n:null;if(!k)continue;const a=reg.get(k)||[];a.push(...r.p);reg.set(k,a)}
for(const[n,a]of reg){const xs=a.filter((_,i)=>i%2===0),zs=a.filter((_,i)=>i%2===1);lieux.push({n,t:/^Pont/i.test(n)?'pont':/^Saut/i.test(n)?'saut':'rond',x:+(xs.reduce((s,v)=>s+v,0)/xs.length).toFixed(1),z:+(zs.reduce((s,v)=>s+v,0)/zs.length).toFixed(1)})}
// les sauts-de-mouton portent le même nom à plusieurs endroits : on les sépare par groupes de proximité
const sauts=[];for(const r of roads.filter(r=>r.n==='Saut-de-Mouton')){const x=r.p[0],z=r.p[1];let g=sauts.find(s=>Math.hypot(s.x-x,s.z-z)<30);if(!g){g={n:'Saut-de-mouton',t:'saut',x,z};sauts.push(g)}}
const out={o:[LON0,LAT0],s:S,roads,pass,lieux:[...lieux.filter(l=>l.t!=='saut'),...sauts]};

// ---- POINTS D'INTÉRÊT (export Overpass « lieux nommés » : arrêts, marchés, feux, stades, édifices, camps, gares…)
const poi=[],arrets=[],feux=[],vu=new Set();
const clean=n=>n.replace(/^arr[êe]t\s+(de\s+bus\s+)?/i,'').replace(/\s+/g,' ').trim();
for(const ft of feats.values()){if(ft.geometry.type!=='Point')continue;const p=ft.properties,n=(p.name||'').trim(),[lo,la]=ft.geometry.coordinates,x=+X(lo).toFixed(1),z=+Z(la).toFixed(1);
  if(p.highway==='traffic_signals'){feux.push([x,z]);continue}
  if(!n)continue;
  if(p.highway==='bus_stop'||p.public_transport==='stop_position'||p.public_transport==='platform'||p.amenity==='bus_station'||p.amenity==='taxi'){const k=p.amenity==='bus_station'?'g':p.amenity==='taxi'?'t':'b';if(!arrets.some(a=>a[0]===clean(n)&&Math.hypot(a[1]-x,a[2]-z)<6))arrets.push([clean(n),x,z,k]);continue}
  let t=null;
  if(p.leisure==='stadium'||/^stade /i.test(n)&&!/ossen|Marchand/i.test(n))t='stade';
  else if(p.amenity==='marketplace'||/^march[ée] |grand march/i.test(n))t='marche';
  else if(/RTNC|Palais d|Palais du|Mus[ée]e national|Cath[ée]drale du Centenaire|Banque Centrale|Fonction Publique|Banque mondiale|Maison communale|Palais de Justice/i.test(n))t='edifice';
  else if(/^Camps? (Kabila|Pinzi|Militaire|Loano|Colonel|Tshatshi|Bumba|Luka|matete)/i.test(n)||/Camps? Militaire/i.test(n))t='camp';
  else if(/A[ée]roport de Ndolo|^Gare (de|Centrale|Routi)|Gare de Matete|Kisenso.?Gare/i.test(n)||p.railway==='station')t='gare';
  else if(/^Place (de l')?[ÉE]changeur$|^[ÉE]changeur de Limete|^Echangeur$|^[ÉE]changeur$/i.test(n)){t='echangeur'}
  if(!t)continue;const nom=t==='echangeur'?'Échangeur de Limete':n.replace(/Stade de marthyrs/i,'Stade des Martyrs');
  const k=nom.toLowerCase();if(vu.has(k)&&t!=='marche')continue;vu.add(k);poi.push({n:nom,t,x,z})}
// carrefours : nœuds où se croisent au moins deux grandes routes de noms différents
{const noeud=new Map(),kk=(x,z)=>Math.round(x*5)+','+Math.round(z*5);
 roads.forEach(r=>{if(r.c==='d'||r.n==='Contre-allée Lumumba')return;for(let i=0;i<r.p.length;i+=2){const k=kk(r.p[i],r.p[i+1]);let o=noeud.get(k);if(!o){o={x:r.p[i],z:r.p[i+1],n:new Set(),s:0,c:0};noeud.set(k,o)}if(r.n)o.n.add(r.n);o.s+=r.c==='a'?3:r.c==='b'?2:1;o.c++}});
 const C=[...noeud.values()].filter(o=>o.n.size>=2&&o.c>=3&&o.s>=5).sort((a,b)=>b.s-a.s);const car=[];
 for(const o of C){if(car.some(q=>Math.hypot(q.x-o.x,q.z-o.z)<14))continue;car.push({x:+o.x.toFixed(1),z:+o.z.toFixed(1),n:[...o.n].slice(0,2).join(' × '),s:o.s});if(car.length>=60)break}
 out.carrefours=car}
out.poi=poi;out.arrets=arrets;out.feux=feux;
fs.writeFileSync('src/taxi/kinshasa.json',JSON.stringify(out));
console.log('POI',poi.length,'arrêts',arrets.length,'feux',feux.length,'carrefours',out.carrefours.length,'taille',(fs.statSync('src/taxi/kinshasa.json').size/1024).toFixed(0)+' Ko');
