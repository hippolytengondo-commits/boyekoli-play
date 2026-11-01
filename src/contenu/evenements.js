// Calendrier hebdomadaire : une entrée par jour (0 = dimanche … 6 = samedi). Modifiable sans toucher au programme.
// Récompense : 1 pièce par bonne réponse + 1 pièce pour avoir terminé le défi ; le dimanche donne en plus un objet de collection.
export const EVENEMENTS=[
 {jour:0,ico:'🧭',titre:'Grande aventure de la semaine',accueil:'Dimanche, c’est la grande aventure : un peu de tout pour terminer la semaine en explorateur !',objet:true,questions:[
  {q:'Quel animal rayé, cousin de la girafe, vit dans la forêt de l’Ituri ?',o:['L’okapi','Le zèbre','Le lion','L’antilope'],a:0,e:'L’okapi ressemble à un petit zèbre mais il est cousin de la girafe.'},
  {q:'Que faut-il faire avant de traverser une route ?',o:['Courir très vite','Regarder des deux côtés','Fermer les yeux','Suivre un véhicule'],a:1,e:'On s’arrête, on regarde à gauche et à droite, puis on traverse sur le passage piétons.'},
  {q:'Combien font 12 × 5 ?',o:['50','60','62','70'],a:1,e:'12 × 5 = 60 : dix fois 5 font 50, et deux fois 5 font 10.'},
  {q:'Quel grand fleuve passe à Kisangani ?',o:['Le Nil','Le Zambèze','Le Congo','Le Niger'],a:2,e:'Le fleuve Congo traverse Kisangani, ville du nord-est du pays.'},
  {q:'Quelle est la capitale de la province du Nord-Kivu ?',o:['Bukavu','Goma','Kisangani','Matadi'],a:1,e:'Goma est le chef-lieu du Nord-Kivu, au bord du lac Kivu.'}]},
 {jour:1,ico:'➗',titre:'Défi mathématique',accueil:'Lundi, on réveille son cerveau avec quatre calculs !',questions:[
  {q:'Combien font 7 × 8 ?',o:['54','56','63','48'],a:1,e:'7 × 8 = 56.'},
  {q:'Tu achètes 5 mangues à 3 pièces chacune. Combien paies-tu ?',o:['8 pièces','12 pièces','15 pièces','18 pièces'],a:2,e:'5 × 3 = 15 pièces.'},
  {q:'Quel est le double de 35 ?',o:['60','65','70','75'],a:2,e:'Le double de 35 est 35 + 35 = 70.'},
  {q:'Quel est le périmètre d’un carré de 6 m de côté ?',o:['12 m','18 m','24 m','36 m'],a:2,e:'Le périmètre est la somme des 4 côtés : 4 × 6 = 24 m.'}]},
 {jour:2,ico:'🔬',titre:'Journée de la découverte scientifique',accueil:'Mardi, place à la science : planètes, plantes, corps et matière !',questions:[
  {q:'Quelle planète est la plus proche du Soleil ?',o:['Vénus','Mercure','La Terre','Mars'],a:1,e:'Mercure est la planète la plus proche du Soleil.'},
  {q:'Quel gaz les plantes absorbent-elles par leurs feuilles pour fabriquer leur nourriture ?',o:['Le dioxyde de carbone','L’hélium','Le gaz de cuisine','La fumée'],a:0,e:'Grâce à la lumière, les plantes transforment le dioxyde de carbone en nourriture : c’est la photosynthèse.'},
  {q:'Quel organe pompe le sang dans tout le corps ?',o:['Le foie','Les poumons','Le cœur','L’estomac'],a:2,e:'Le cœur pompe le sang, qui transporte l’oxygène partout dans le corps.'},
  {q:'Que devient l’eau quand elle bout ?',o:['De la glace','De la vapeur','Du sable','Du sucre'],a:1,e:'L’eau chauffée à 100 °C se transforme en vapeur.'}]},
 {jour:3,ico:'🗺',titre:'Aventure et exploration',accueil:'Mercredi, cap sur le Congo ! Que connais-tu de ton pays ?',questions:[
  {q:'Quel grand fleuve traverse la RDC ?',o:['Le Nil','Le Congo','Le Niger','Le Zambèze'],a:1,e:'Le fleuve Congo est le deuxième plus long d’Afrique.'},
  {q:'Quelle est la capitale de la RDC ?',o:['Lubumbashi','Goma','Kinshasa','Kisangani'],a:2,e:'Kinshasa est la capitale de la RDC.'},
  {q:'Dans quel parc vit le gorille de montagne ?',o:['Salonga','Virunga','Garamba','Upemba'],a:1,e:'Le parc national des Virunga abrite des gorilles de montagne.'},
  {q:'Combien de provinces compte la RDC ?',o:['11','15','26','145'],a:2,e:'La RDC compte 26 provinces (145 est le nombre de territoires).'}]},
 {jour:4,ico:'🌍',titre:'Défi de culture générale',accueil:'Jeudi, un défi pour tester ta culture générale !',questions:[
  {q:'Quelle est la langue officielle de la RDC ?',o:['L’anglais','Le portugais','Le français','L’arabe'],a:2,e:'La langue officielle est le français ; il y a aussi quatre langues nationales : lingala, swahili, kikongo et tshiluba.'},
  {q:'Quel symbole jaune figure dans le coin du drapeau congolais ?',o:['Un soleil','Une étoile','Une lune','Un arbre'],a:1,e:'Le drapeau porte une étoile jaune dans le coin supérieur, près de la hampe.'},
  {q:'En quelle année la RDC est-elle devenue indépendante ?',o:['1945','1960','1975','1990'],a:1,e:'L’indépendance a été proclamée le 30 juin 1960.'},
  {q:'Quel est le plus grand océan du monde ?',o:['L’océan Atlantique','L’océan Indien','L’océan Pacifique','L’océan Arctique'],a:2,e:'L’océan Pacifique est le plus grand.'}]},
 {jour:5,ico:'📐',titre:'Défi de construction',accueil:'Vendredi, on construit ! Mesures et surfaces t’attendent.',questions:[
  {q:'Quelle est l’aire d’un rectangle de 5 m sur 4 m ?',o:['9 m²','18 m²','20 m²','40 m²'],a:2,e:'Aire = longueur × largeur = 5 × 4 = 20 m².'},
  {q:'Combien de côtés a un hexagone ?',o:['4','5','6','8'],a:2,e:'Un hexagone a 6 côtés.'},
  {q:'Tu veux peindre un mur de 3 m sur 2 m. Quelle surface dois-tu peindre ?',o:['5 m²','6 m²','10 m²','12 m²'],a:1,e:'3 × 2 = 6 m².'},
  {q:'Quel outil sert à mesurer une longueur ?',o:['Un marteau','Une scie','Un mètre ruban','Une pelle'],a:2,e:'Le mètre ruban sert à mesurer des longueurs.'}]},
 {jour:6,ico:'🎶',titre:'Journée artistique',accueil:'Samedi, c’est la fête des arts : musique, danse et couleurs !',questions:[
  {q:'Quel instrument congolais a des lamelles de métal que l’on joue avec les pouces ?',o:['La likembe','Le violon','La flûte de Pan','La trompette'],a:0,e:'La likembe se joue avec les pouces.'},
  {q:'Quelle organisation a inscrit la rumba congolaise au patrimoine de l’humanité ?',o:['L’UNESCO','La FIFA','L’OMS','La Banque mondiale'],a:0,e:'L’UNESCO a inscrit la rumba congolaise en 2021.'},
  {q:'Combien y a-t-il de couleurs primaires en peinture ?',o:['Deux','Trois','Cinq','Sept'],a:1,e:'Le rouge, le jaune et le bleu : avec elles on fabrique presque toutes les autres couleurs.'},
  {q:'Quel instrument se joue avec les mains sur une peau tendue ?',o:['Le ngoma','La guitare','Le xylophone','La flûte'],a:0,e:'Le ngoma est un tambour traditionnel.'}]}
];
