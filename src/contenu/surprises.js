// Surprises du jour : la surprise est choisie d'après la date (même surprise pour tous les enfants un même jour). Aucun hasard, aucun achat.
// type : « enigme » (une question), « fait » (une découverte à lire), « cadeau » (une enveloppe mystérieuse).
// Chaque surprise offre le prochain objet de collection que l'enfant n'a pas encore.
export const SURPRISES=[
 {t:'enigme',titre:'Une énigme t’attend',q:'Je n’ai pas de jambes, mais je voyage sans arrêt vers la mer. Qui suis-je ?',o:['Un fleuve','Un serpent','Un train','Un nuage'],a:0,e:'C’est un fleuve : il coule sans cesse vers la mer.'},
 {t:'fait',titre:'Découverte géographique',txt:'Le fleuve Congo est le deuxième plus long fleuve d’Afrique, après le Nil. C’est aussi l’un des fleuves les plus profonds du monde.'},
 {t:'cadeau',titre:'Une enveloppe mystérieuse',txt:'Une enveloppe était cachée sous un arbre du village. À l’intérieur, un objet de collection t’attendait !'},
 {t:'enigme',titre:'Une énigme t’attend',q:'Qu’est-ce qui monte et descend sans bouger ?',o:['Un oiseau','L’escalier','Un ballon','La rivière'],a:1,e:'C’est l’escalier : on monte et on descend dessus, mais lui reste en place.'},
 {t:'fait',titre:'Découverte géographique',txt:'Le lac Tanganyika, à l’est de la RDC, est l’un des lacs les plus profonds du monde. Il abrite des centaines d’espèces de poissons.'},
 {t:'enigme',titre:'Une énigme t’attend',q:'J’ai 3 fois plus de pièces que toi. Tu en as 8. Combien en ai-je ?',o:['11','16','24','32'],a:2,e:'3 × 8 = 24 pièces.'},
 {t:'cadeau',titre:'Un cadeau pour l’explorateur',txt:'Bonjour explorateur ! Une nouvelle découverte vient d’être faite dans ton univers. La voici dans ta collection.'},
 {t:'fait',titre:'Découverte de la nature',txt:'Les forêts du bassin du Congo forment la deuxième plus grande forêt tropicale du monde, après l’Amazonie. Elles abritent des animaux uniques comme l’okapi et le bonobo.'},
 {t:'enigme',titre:'Une énigme t’attend',q:'Quel est le contraire de « courageux » ?',o:['Peureux','Fort','Rapide','Grand'],a:0,e:'Le contraire de courageux est peureux.'},
 {t:'fait',titre:'Découverte géographique',txt:'Le Nyiragongo est un volcan des Virunga, près de Goma. Son cratère contient un lac de lave.'},
 {t:'cadeau',titre:'Une enveloppe mystérieuse',txt:'Un facteur a déposé une enveloppe à ton nom. Elle contient un objet rare à ajouter à ta collection.'},
 {t:'enigme',titre:'Une énigme t’attend',q:'Quel nombre complète la suite : 2, 4, 8, 16, … ?',o:['20','24','30','32'],a:3,e:'On double à chaque fois : 16 × 2 = 32.'}
];
