// Musée virtuel du Congo : six salles, chacune avec des fiches et deux questions. Contenu modifiable sans toucher au programme.
export const SALLES=[
 {id:'histoire',ico:'📜',nom:'Histoire de la RDC',fiches:[
  {t:'Les grands royaumes',txt:'Avant la colonisation, de grands royaumes existaient sur le territoire actuel : le royaume Kongo, le royaume Luba, le royaume Kuba et l’empire Lunda.'},
  {t:'L’indépendance',txt:'Le 30 juin 1960, le Congo devient indépendant. Patrice Lumumba est le premier Premier ministre et Joseph Kasa-Vubu le premier président.'},
  {t:'Les noms du pays et de sa capitale',txt:'La capitale s’appelait Léopoldville ; elle devient Kinshasa en 1966. Le pays s’est appelé Zaïre de 1971 à 1997, puis République démocratique du Congo.'}],
  questions:[
  {q:'Qui a été le premier Premier ministre du Congo indépendant ?',o:['Patrice Lumumba','Simon Kimbangu','Denis Mukwege','Joseph Kasa-Vubu'],a:0,e:'Patrice Lumumba, en 1960. Joseph Kasa-Vubu était le premier président.'},
  {q:'Quel était l’ancien nom de Kinshasa ?',o:['Stanleyville','Léopoldville','Élisabethville','Coquilhatville'],a:1,e:'Kinshasa s’appelait Léopoldville avant 1966.'}]},
 {id:'personnalites',ico:'🌟',nom:'Personnalités',fiches:[
  {t:'Patrice Lumumba',txt:'Figure de l’indépendance et premier Premier ministre. Il reste un symbole de liberté dans la mémoire du pays.'},
  {t:'Simon Kimbangu',txt:'Né en 1887, il est à l’origine d’un mouvement religieux, l’Église kimbanguiste, qui existe encore aujourd’hui.'},
  {t:'Dr Denis Mukwege',txt:'Médecin à Bukavu, il soigne des femmes victimes de violences. Il a reçu le prix Nobel de la paix en 2018.'},
  {t:'Dr Jean-Jacques Muyembe',txt:'Microbiologiste congolais, il a participé aux premières recherches sur le virus Ebola, en 1976.'}],
  questions:[
  {q:'Quel prix le docteur Denis Mukwege a-t-il reçu en 2018 ?',o:['Le prix Nobel de la paix','Le prix Nobel de physique','Le prix Nobel de littérature','Le prix Nobel d’économie'],a:0,e:'Le docteur Mukwege a reçu le prix Nobel de la paix en 2018.'},
  {q:'Quel virus le docteur Muyembe a-t-il étudié dès 1976 ?',o:['Ebola','La grippe','Le rhume','La varicelle'],a:0,e:'Il a participé aux premières recherches sur le virus Ebola.'}]},
 {id:'sites',ico:'🏛',nom:'Monuments et sites',fiches:[
  {t:'Le parc national des Virunga',txt:'Créé en 1925, c’est le plus ancien parc national d’Afrique. Il protège des gorilles de montagne, des volcans et des lacs.'},
  {t:'Le fleuve Congo',txt:'Deuxième plus long fleuve d’Afrique, il passe notamment par Kisangani et Kinshasa avant de se jeter dans l’océan Atlantique.'},
  {t:'Kinshasa, la capitale',txt:'Sur les rives du fleuve, face à Brazzaville. On y trouve le Stade des Martyrs, la cathédrale Notre-Dame du Congo et le Palais de la Nation.'}],
  questions:[
  {q:'En quelle année le parc des Virunga a-t-il été créé ?',o:['1885','1925','1960','1990'],a:1,e:'Le parc des Virunga a été créé en 1925.'},
  {q:'Quelle grande ville est située en face de Kinshasa, de l’autre côté du fleuve ?',o:['Lubumbashi','Goma','Brazzaville','Kisangani'],a:2,e:'Brazzaville, la capitale du Congo voisin, est juste en face de Kinshasa.'}]},
 {id:'ressources',ico:'💎',nom:'Ressources naturelles',fiches:[
  {t:'Cuivre et cobalt',txt:'Le sud-est du pays, au Haut-Katanga et au Lualaba, est très riche en cuivre et en cobalt.'},
  {t:'Le cobalt',txt:'La RDC fournit une très grande part du cobalt du monde. On l’utilise notamment dans les batteries des téléphones.'},
  {t:'Diamants et or',txt:'Le pays possède aussi des diamants, notamment dans la région du Kasaï, et de l’or.'},
  {t:'Forêts et eau',txt:'Les forêts du bassin du Congo sont les deuxièmes plus grandes forêts tropicales du monde. Le fleuve Congo a une très grande force pour produire de l’électricité.'}],
  questions:[
  {q:'Quelle région de la RDC est très riche en cuivre et en cobalt ?',o:['Le Katanga','Le Mayombe','L’Ituri','Le Maniema'],a:0,e:'Le Katanga (Haut-Katanga, Lualaba) est une grande région minière.'},
  {q:'À quoi sert notamment le cobalt ?',o:['À fabriquer des batteries','À faire du pain','À fabriquer du papier','À nourrir les animaux'],a:0,e:'Le cobalt entre dans la fabrication des batteries.'}]},
 {id:'cultures',ico:'🎭',nom:'Cultures et traditions',fiches:[
  {t:'Les langues',txt:'Le français est la langue officielle. Le lingala, le swahili, le kikongo et le tshiluba sont les quatre langues nationales.'},
  {t:'Un pays de nombreux peuples',txt:'On compte plus de 200 groupes ethniques, avec chacun ses chants, ses danses et ses traditions.'},
  {t:'Les plats',txt:'Le pondu (feuilles de manioc), la chikwangue (pain de manioc) et le fufu sont des plats très répandus.'},
  {t:'La musique',txt:'La rumba congolaise est inscrite au patrimoine de l’humanité par l’UNESCO. En 1960, Grand Kallé chante « Indépendance Cha Cha ».'}],
  questions:[
  {q:'Combien de langues nationales la RDC a-t-elle ?',o:['Deux','Quatre','Dix','Cent'],a:1,e:'Le lingala, le swahili, le kikongo et le tshiluba : quatre langues nationales.'},
  {q:'Quel plat est préparé avec des feuilles de manioc ?',o:['Le pondu','Le gâteau','La soupe de pâtes','La glace'],a:0,e:'Le pondu est fait avec des feuilles de manioc pilées.'}]},
 {id:'nature',ico:'🦍',nom:'Nature et musique',fiches:[
  {t:'L’okapi et le bonobo',txt:'L’okapi vit dans la forêt de l’Ituri. Le bonobo, grand singe pacifique, ne vit à l’état sauvage qu’en RDC.'},
  {t:'Le gorille de montagne',txt:'Il vit sur les volcans des Virunga et se déplace en famille.'},
  {t:'Les instruments traditionnels',txt:'La likembe se joue avec les pouces, le ngoma est un tambour, et le lokole, tambour à fente, servait à envoyer des messages de village en village.'}],
  questions:[
  {q:'Quel grand singe ne vit à l’état sauvage qu’en RDC ?',o:['Le bonobo','Le gorille de plaine','Le chimpanzé de l’Ouest','L’orang-outan'],a:0,e:'Le bonobo ne vit à l’état sauvage qu’en RDC.'},
  {q:'À quoi servait le lokole ?',o:['À envoyer des messages','À cuire le manioc','À pêcher','À labourer'],a:0,e:'Les coups sur le lokole transmettaient des messages d’un village à l’autre.'}]}
];
