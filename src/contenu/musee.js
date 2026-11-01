// Musée virtuel du Congo : cinq niveaux, chacun avec ses tableaux (photos et textes) et un quiz.
// Photos : fichiers libres de droits (domaine public ou licences libres) ; auteur et licence sont indiqués ci-dessous et dans la salle « Crédits ».
// Une exposition sans photo (img absent) s'affiche avec une grande illustration emoji ; ajouter la photo plus tard suffit à la faire apparaître.
const C=(auteur,licence,source)=>({auteur,licence,source});
export const NIVEAUX=[
 {id:'histoire',ico:'📜',nom:'Histoire de la RDC',couleur:'#8c5a2b',expos:[
  {id:'royaumes',ico:'👑',titre:'Les grands royaumes',txt:'Avant la colonisation, de grands royaumes existaient sur le territoire actuel : le royaume Kongo, le royaume Luba, le royaume Kuba et l’empire Lunda.'},
  {id:'lumumba',ico:'🕊',titre:'Patrice Lumumba',img:'img/musee/lumumba.jpg',credit:C('Photographe inconnu / Anefo (Nationaal Archief)','CC0','commons.wikimedia.org — File:Patrice Lumumba, 1960 (cropped).jpg'),txt:'Figure de l’indépendance, il devient le premier Premier ministre du Congo en juin 1960. Il meurt en janvier 1961 et reste un symbole de liberté.'},
  {id:'kasavubu',ico:'🏛',titre:'Joseph Kasa-Vubu',img:'img/musee/kasavubu.jpg',credit:C('Le Courrier d’Afrique','Domaine public','commons.wikimedia.org — File:Kasa-Vubu in Bandalungwa cropped.jpg'),txt:'Premier président du Congo indépendant, en 1960. Il reste au pouvoir jusqu’au coup d’État de 1965.'},
  {id:'mobutu',ico:'🐆',titre:'Mobutu Sese Seko',img:'img/musee/mobutu.jpg',credit:C('White House Photographic Office (Gerald Ford Library)','Domaine public','commons.wikimedia.org — File:Mobutu portraits (1976-04-28) (cropped).jpg'),txt:'Il prend le pouvoir en 1965 et dirige le pays jusqu’en 1997. En 1971, le pays est rebaptisé Zaïre ; le fleuve et la monnaie portent aussi ce nom.'},
  {id:'kabila',ico:'🇨🇩',titre:'Laurent-Désiré Kabila',img:'img/musee/kabila.jpg',credit:C('Etienne Scholasse, Communautés européennes','CC BY 4.0','commons.wikimedia.org — File:Visit of Laurent Désiré Kabila … to the EC (cropped).jpg'),txt:'Il arrive au pouvoir en mai 1997 et le pays reprend le nom de République démocratique du Congo. Il est assassiné en janvier 2001. Son mausolée se trouve à Kinshasa.'},
  {id:'noms',ico:'🗺',titre:'Les noms du pays et de sa capitale',txt:'La capitale s’appelait Léopoldville ; elle devient Kinshasa en 1966. Le pays s’est appelé Zaïre de 1971 à 1997, puis République démocratique du Congo.'}],
  quiz:[
  {q:'Qui a été le premier Premier ministre du Congo indépendant ?',c:['Patrice Lumumba','Mobutu Sese Seko','Joseph Kasa-Vubu','Laurent-Désiré Kabila'],a:0,exp:'Patrice Lumumba, en 1960. Joseph Kasa-Vubu était le premier président.'},
  {q:'Quel était l’ancien nom de Kinshasa ?',c:['Léopoldville','Stanleyville','Élisabethville','Coquilhatville'],a:0,exp:'Kinshasa s’appelait Léopoldville avant 1966.'},
  {q:'Comment le pays s’appelait-il de 1971 à 1997 ?',c:['Le Zaïre','Le Katanga','Le Kongo','Le Rwanda'],a:0,exp:'De 1971 à 1997, le pays s’appelait le Zaïre.'}]},
 {id:'personnalites',ico:'🌟',nom:'Personnalités',couleur:'#6a3d9a',expos:[
  {id:'wemba',ico:'🎤',titre:'Papa Wemba',img:'img/musee/papawemba.jpg',credit:C('Radio Okapi','CC BY 2.0','commons.wikimedia.org — File:Papa Wemba.jpg'),txt:'Grand chanteur de la rumba congolaise (1949-2016). Il est aussi une figure de l’élégance et de la mode, la « Sape ».'},
  {id:'fally',ico:'🎶',titre:'Fally Ipupa',img:'img/musee/fally.jpg',credit:C('ByaduniaEspoir','CC BY-SA 4.0','commons.wikimedia.org — File:Fally Ipupa a Paris, en France.jpg'),txt:'Chanteur congolais très populaire. En mai 2026, il donne deux concerts au Stade de France, à Paris, et il se produit aussi à l’O2 Arena de Londres.'},
  {id:'wissa',ico:'⚽',titre:'Yoane Wissa',img:'img/musee/wissa.jpg',credit:C('feguifoot','CC0','commons.wikimedia.org — File:Yoane Wissa - DR Congo.jpg'),txt:'Attaquant des Léopards. Le 17 juin 2026, de la tête contre le Portugal, il marque le premier but de l’histoire de la RDC en Coupe du monde.'},
  {id:'mukwege',ico:'🩺',titre:'Docteur Denis Mukwege',img:'img/musee/mukwege.jpg',credit:C('Claude Truong-Ngoc','CC BY-SA 3.0','commons.wikimedia.org — File:Denis Mukwege par Claude Truong-Ngoc novembre 2014.jpg'),txt:'Médecin à Bukavu, il soigne des femmes victimes de violences. Il reçoit le prix Nobel de la paix en 2018.'},
  {id:'muyembe',ico:'🔬',titre:'Docteur Jean-Jacques Muyembe',img:'img/musee/muyembe.jpg',credit:C('MONUSCO Photos','CC BY-SA 2.0','commons.wikimedia.org — File:Jean-Jacques Muyembe-Tamfum - 2018 (cropped).jpg'),txt:'Microbiologiste congolais. En 1976, il est à Yambuku lors de la première épidémie d’Ebola et envoie des échantillons de sang qui permettent d’identifier le virus.'}],
  quiz:[
  {q:'Quel prix le docteur Denis Mukwege a-t-il reçu en 2018 ?',c:['Le prix Nobel de la paix','Le prix Nobel de physique','Le prix Nobel de littérature','Le prix Nobel d’économie'],a:0,exp:'Le docteur Mukwege a reçu le prix Nobel de la paix en 2018.'},
  {q:'Contre quelle équipe Yoane Wissa a-t-il marqué le premier but de la RDC en Coupe du monde ?',c:['Le Portugal','Le Brésil','La France','L’Argentine'],a:0,exp:'Il a marqué de la tête contre le Portugal, le 17 juin 2026.'},
  {q:'Quel virus le docteur Muyembe a-t-il aidé à identifier en 1976 ?',c:['Ebola','La grippe','Le rhume','La varicelle'],a:0,exp:'Il a participé aux premières recherches sur le virus Ebola, à Yambuku.'}]},
 {id:'sites',ico:'🏛',nom:'Monuments et sites',couleur:'#1f5f9e',expos:[
  {id:'virunga',ico:'🌋',titre:'Le parc national des Virunga',img:'img/musee/virunga.jpg',txt:'Créé en 1925, c’est le plus ancien parc national d’Afrique. Il protège des gorilles de montagne, des volcans et des lacs.'},
  {id:'fleuve',ico:'🌊',titre:'Le fleuve Congo',img:'img/musee/fleuve.jpg',txt:'Deuxième plus long fleuve d’Afrique, il passe notamment par Kisangani et Kinshasa avant de se jeter dans l’océan Atlantique.'},
  {id:'echangeur',ico:'🛣',titre:'L’échangeur de Limete',img:'img/musee/echangeur.jpg',txt:'Grand échangeur routier de Kinshasa, qui relie plusieurs grandes routes de la capitale.'},
  {id:'mausolee',ico:'🏛',titre:'Le mausolée Laurent-Désiré Kabila',img:'img/musee/mausolee.jpg',txt:'Monument de Kinshasa construit en hommage à l’ancien président.'},
  {id:'palais',ico:'🏛',titre:'Le Palais de la Nation',img:'img/musee/palais.jpg',txt:'Bâtiment de la présidence, dans la commune de la Gombe, à Kinshasa.'},
  {id:'stade',ico:'🏟',titre:'Le Stade des Martyrs',img:'img/musee/stade.jpg',txt:'Grand stade de Kinshasa, où se jouent les grands matchs et les concerts.'}],
  quiz:[
  {q:'En quelle année le parc des Virunga a-t-il été créé ?',c:['1925','1885','1960','1990'],a:0,exp:'Le parc des Virunga a été créé en 1925.'},
  {q:'Dans quel océan le fleuve Congo se jette-t-il ?',c:['L’océan Atlantique','L’océan Indien','L’océan Pacifique','L’océan Arctique'],a:0,exp:'Le fleuve Congo se jette dans l’océan Atlantique.'},
  {q:'Dans quelle ville se trouve le Stade des Martyrs ?',c:['Kinshasa','Goma','Lubumbashi','Kisangani'],a:0,exp:'Le Stade des Martyrs est à Kinshasa.'}]},
 {id:'ressources',ico:'💎',nom:'Ressources naturelles et nature',couleur:'#b8860b',expos:[
  {id:'diamant',ico:'💎',titre:'Le diamant',img:'img/musee/diamant.jpg',txt:'Le diamant est une pierre très dure et transparente. En RDC, on en trouve notamment dans la région du Kasaï. On l’utilise en bijouterie et pour couper des matériaux durs.'},
  {id:'or',ico:'🥇',titre:'L’or',img:'img/musee/or.jpg',txt:'L’or est un métal jaune et brillant qui ne rouille pas. On en extrait dans l’est du pays, notamment en Ituri et au Kivu.'},
  {id:'cuivre',ico:'🟠',titre:'Le cuivre',img:'img/musee/cuivre.jpg',txt:'Le cuivre est un métal rouge-orangé qui conduit très bien l’électricité. Il est extrait au Katanga et sert à fabriquer des fils électriques.'},
  {id:'cobalt',ico:'🔋',titre:'Le cobalt',img:'img/musee/cobalt.jpg',txt:'Le cobalt est un métal gris-bleu. La RDC en fournit une très grande part dans le monde. On l’utilise dans les batteries, par exemple celles des téléphones.'},
  {id:'gorille',ico:'🦍',titre:'Le gorille de montagne',img:'img/musee/gorille.jpg',txt:'Il vit sur les volcans des Virunga, en famille, guidé par un grand mâle au dos argenté.'},
  {id:'okapi',ico:'🦓',titre:'L’okapi',img:'img/musee/okapi.jpg',txt:'Cousin de la girafe, il vit dans la forêt de l’Ituri. Ses pattes rayées le cachent dans les feuillages.'},
  {id:'bonobo',ico:'🐒',titre:'Le bonobo',img:'img/musee/bonobo.jpg',txt:'On ne le trouve à l’état sauvage qu’en RDC, au sud du fleuve Congo. Il est très pacifique.'}],
  quiz:[
  {q:'Quel métal rouge-orangé est extrait au Katanga et sert à fabriquer des fils électriques ?',c:['Le cuivre','Le plomb','L’or','Le fer'],a:0,exp:'Le cuivre conduit très bien l’électricité.'},
  {q:'À quoi sert notamment le cobalt ?',c:['À fabriquer des batteries','À faire du pain','À fabriquer du papier','À nourrir les animaux'],a:0,exp:'Le cobalt entre dans la fabrication des batteries.'},
  {q:'Quel grand singe ne vit à l’état sauvage qu’en RDC ?',c:['Le bonobo','Le gorille de plaine','Le chimpanzé de l’Ouest','L’orang-outan'],a:0,exp:'Le bonobo ne vit à l’état sauvage qu’en RDC.'}]},
 {id:'arts',ico:'🎭',nom:'Arts, musique et traditions',couleur:'#c0392b',expos:[
  {id:'masque',ico:'🎭',titre:'Le masque kuba',img:'img/musee/masque.jpg',txt:'Les Kuba, au Kasaï, portent des masques lors des cérémonies importantes.'},
  {id:'nkisi',ico:'🗿',titre:'La statue nkisi',img:'img/musee/nkisi.jpg',txt:'Statue du peuple kongo à laquelle on associait des pouvoirs de protection.'},
  {id:'lukasa',ico:'🧭',titre:'Le lukasa',img:'img/musee/lukasa.jpg',txt:'Planchette ornée du peuple luba qui aidait à se rappeler l’histoire du royaume.'},
  {id:'likembe',ico:'🎹',titre:'La likembe',img:'img/musee/likembe.jpg',txt:'Petit instrument à lamelles de métal que l’on joue avec les pouces.'},
  {id:'langues',ico:'🗣',titre:'Les langues et les plats',txt:'Le français est la langue officielle. Le lingala, le swahili, le kikongo et le tshiluba sont les quatre langues nationales. Le pondu (feuilles de manioc) et la chikwangue sont des plats très répandus.'},
  {id:'rumba',ico:'🎸',titre:'La rumba congolaise',txt:'La rumba congolaise est inscrite au patrimoine culturel immatériel de l’humanité par l’UNESCO depuis 2021. En 1960, Grand Kallé chante « Indépendance Cha Cha ».'}],
  quiz:[
  {q:'Combien de langues nationales la RDC a-t-elle ?',c:['Quatre','Deux','Dix','Cent'],a:0,exp:'Le lingala, le swahili, le kikongo et le tshiluba : quatre langues nationales.'},
  {q:'Quelle organisation a inscrit la rumba congolaise au patrimoine de l’humanité ?',c:['L’UNESCO','La FIFA','L’OMS','La Banque mondiale'],a:0,exp:'L’UNESCO a inscrit la rumba congolaise en 2021.'},
  {q:'Quel plat est préparé avec des feuilles de manioc ?',c:['Le pondu','Le gâteau','La soupe de pâtes','La glace'],a:0,exp:'Le pondu est fait avec des feuilles de manioc pilées.'}]}
];
