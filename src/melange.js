// Mélange reproductible des réponses : la bonne réponse n'est pas toujours la première. Même ordre à chaque affichage d'une même question.
export function melanger(q,seed){
  const idx=q.o.map((_,i)=>i);let s=(seed*2654435761+97)%4294967296||1;
  for(let i=idx.length-1;i>0;i--){s=(s*1664525+1013904223)%4294967296;const j=s%(i+1);[idx[i],idx[j]]=[idx[j],idx[i]]}
  return {o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a)};
}
export const graine=(txt)=>{let h=7;for(const c of String(txt))h=(h*31+c.charCodeAt(0))%1000003;return h};
