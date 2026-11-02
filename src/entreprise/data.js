// BOYEKOLI BUSINESS SIMULATOR – données (contexte congolais, montants en francs congolais FC). Entreprises et lieux fictifs.
const P=(id,nom,ico,cout,prix,unite)=>({id,nom,ico,cout,prix,unite:unite||'unité'});
export const SECTEURS=[
 {id:'commerce',nom:'Commerce général',ico:'🛒',base:15,fond:'#e0a526',sol:'#e8dfc8',types:[['boutique','Boutique de quartier',1,60000],['super','Supermarché',1.5,300000],['gros','Grossiste',1.2,200000]],
  prod:[P('riz','Riz (sac de 5 kg)','🍚',9000,11500),P('huile','Huile de palme (1 L)','🫒',3500,4500),P('sucre','Sucre (1 kg)','🧂',2800,3600),P('savon','Savon (3 pièces)','🧼',1500,2200),P('lait','Lait en poudre','🥛',4200,5500),P('eau','Eau minérale (pack de 6)','💧',4500,6000),P('credit','Crédit téléphonique','📱',900,1000)]},
 {id:'resto',nom:'Restaurant et alimentation',ico:'🍲',base:16,fond:'#c0392b',sol:'#e6d3b0',types:[['maquis','Maquis (restaurant)',1,80000],['resto','Restaurant',1.4,250000],['fast','Fast-food',1.3,180000]],
  prod:[P('poulet','Poulet braisé','🍗',6500,12000,'portion'),P('capitaine','Poisson capitaine braisé','🐟',9000,15000,'portion'),P('fufu','Fufu et légumes','🍲',2800,5500,'plat'),P('riz_h','Riz et haricots','🍛',1800,3500,'plat'),P('brochettes','Brochettes (5)','🍢',1400,2500,'lot'),P('boisson','Boisson fraîche','🥤',700,1500)]},
 {id:'agri',nom:'Agriculture et élevage',ico:'🌾',base:12,fond:'#2e7d32',sol:'#9cc06a',types:[['champ','Exploitation familiale',1,50000],['ferme','Ferme moderne',1.4,280000],['elevage','Élevage de volailles',1.2,150000]],
  prod:[P('manioc','Manioc (sac)','🥔',6000,9000,'sac'),P('mais','Maïs (sac de 25 kg)','🌽',14000,20000,'sac'),P('tomates','Tomates (cageot)','🍅',7000,11000,'cageot'),P('poulet_v','Poulet vivant','🐔',8000,12000),P('oeufs','Œufs (plateau)','🥚',6500,9000,'plateau'),P('feuilles','Légumes feuilles (10 bottes)','🥬',2000,3500,'lot')]},
 {id:'pharma',nom:'Pharmacie',ico:'💊',base:13,fond:'#1b9aa8',sol:'#eaf3f7',types:[['pharma','Pharmacie de quartier',1,150000],['grande','Grande pharmacie',1.4,350000]],
  prod:[P('para','Paracétamol (boîte)','💊',1000,1800),P('sro','Sels de réhydratation','🧂',800,1500),P('pansements','Pansements (boîte)','🩹',600,1200),P('sirop','Sirop contre la toux','🧴',2500,4000),P('vitamines','Vitamines','🍊',3500,5500),P('antisept','Savon antiseptique','🧼',900,1600)]},
 {id:'info',nom:'Informatique et technologies',ico:'💻',base:11,fond:'#2c7fb8',sol:'#dfe9f2',types:[['cyber','Cybercafé',1,120000],['boutiqueinfo','Boutique informatique',1.2,250000],['startup','Start-up numérique',1.5,300000]],
  prod:[P('forfait','Forfait internet (1 Go)','📶',4000,6000),P('impression','Impression (10 pages)','🖨',300,1000,'lot'),P('cle','Clé USB 8 Go','💾',6000,9500),P('repar','Réparation d’ordinateur','🔧',5000,20000,'service'),P('initiation','Initiation à l’informatique (1 h)','🎓',2000,8000,'séance'),P('access','Souris et claviers','🖱',7000,12000)]},
 {id:'transport',nom:'Transport et logistique',ico:'🚚',base:12,fond:'#f4c20d',sol:'#d9d4c8',types:[['moto','Moto-taxi',1,150000],['livraison','Livraison de colis',1.2,250000],['camion','Transport de marchandises',1.5,500000]],
  prod:[P('course','Course en moto-taxi','🏍',800,2500,'course'),P('colis','Livraison de colis','📦',2000,6000,'colis'),P('taxi','Course en taxi','🚕',2000,5000,'course'),P('fret','Transport de marchandises','🚚',14000,30000,'trajet'),P('minibus','Location de minibus (jour)','🚐',40000,80000,'jour')]},
 {id:'construction',nom:'Construction et immobilier',ico:'🏗',base:9,fond:'#8a5a2b',sol:'#cfc3a5',types:[['quincaillerie','Quincaillerie',1,200000],['entreprise','Entreprise de construction',1.4,400000],['agence','Agence immobilière',1.2,250000]],
  prod:[P('ciment','Ciment (sac de 50 kg)','🧱',21000,27000,'sac'),P('toles','Tôles (lot de 5)','🏠',40000,55000,'lot'),P('briques','Briques (100)','🧱',12000,18000,'lot'),P('macon','Journée de maçon','👷',15000,28000,'jour'),P('plan','Plan de maison','📐',40000,90000,'plan'),P('sable','Sable (camionnette)','🏖',38000,60000,'voyage')]},
 {id:'industrie',nom:'Industrie et fabrication',ico:'🏭',base:10,fond:'#6d6d78',sol:'#cfd2d6',types:[['atelier','Atelier artisanal',1,180000],['usine','Petite usine',1.5,500000]],
  prod:[P('jus','Jus de fruits (pack de 12)','🧃',9000,16000,'pack'),P('savon_a','Savon artisanal (10)','🧼',5000,10000,'lot'),P('farine','Farine de manioc (sac)','🌾',12000,19000,'sac'),P('chaise','Chaise en bois','🪑',15000,28000),P('sacs','Sacs en tissu (lot)','👜',9000,18000,'lot')]},
 {id:'mode',nom:'Habillement et mode',ico:'👗',base:12,fond:'#e84393',sol:'#f3dcea',types:[['boutiquemode','Boutique de mode',1,120000],['couture','Atelier de couture',1.1,150000],['wax','Magasin de pagnes',1.3,260000]],
  prod:[P('wax','Pagne wax (6 yards)','🧣',26000,38000),P('robe','Robe sur mesure','👗',22000,42000),P('chemise','Chemise','👔',9000,16000),P('uniforme','Uniforme scolaire','🎒',7000,12500),P('access_m','Accessoires (sac, collier)','👜',3500,7000),P('retouche','Retouche','🧵',1500,4000,'service')]},
 {id:'services',nom:'Services professionnels',ico:'📊',base:8,fond:'#34495e',sol:'#e3e6ea',types:[['cabinet','Cabinet de comptabilité',1,150000],['conseil','Cabinet de conseil',1.2,250000],['bureau','Bureau de services',1,120000]],
  prod:[P('compta','Comptabilité d’une PME (mois)','📒',18000,40000,'mois'),P('conseil','Séance de conseil en gestion','🧑‍💼',25000,60000,'séance'),P('secret','Secrétariat et traduction','📝',4000,10000,'dossier'),P('formation','Formation en entreprise (jour)','🎓',20000,45000,'jour'),P('demarches','Démarches administratives','📄',6000,15000,'dossier')]}];
export const LIEUX=[
 {id:'village',nom:'Rue du village Boyekoli',ville:'Village',traffic:.7,loyer:1500,conc:.6},
 {id:'zando',nom:'Marché Zando (Kintambo, Kinshasa)',ville:'Kinshasa',traffic:1.1,loyer:4000,conc:1.0},
 {id:'liberte',nom:'Marché de la Liberté (Masina, Kinshasa)',ville:'Kinshasa',traffic:1.2,loyer:4500,conc:1.1},
 {id:'gambela',nom:'Marché de Gambela (Kinshasa)',ville:'Kinshasa',traffic:1.3,loyer:6000,conc:1.2},
 {id:'central',nom:'Marché Central (Gombe, Kinshasa)',ville:'Kinshasa',traffic:1.4,loyer:9000,conc:1.3},
 {id:'limete',nom:'Avenue du Commerce (Limete, Kinshasa)',ville:'Kinshasa',traffic:1.0,loyer:5000,conc:1.0},
 {id:'lubumbashi',nom:'Centre-ville de Lubumbashi',ville:'Lubumbashi',traffic:1.1,loyer:6000,conc:1.1},
 {id:'goma',nom:'Centre de Goma',ville:'Goma',traffic:1.0,loyer:4500,conc:.9},
 {id:'kisangani',nom:'Marché de Kisangani',ville:'Kisangani',traffic:.9,loyer:3000,conc:.8},
 {id:'supvillage',nom:'Supermarché du village (à racheter)',ville:'Village',traffic:1.5,loyer:12000,conc:1.0,special:'super'}];
export const FOURNISSEURS=[
 {id:'A',nom:'Grossiste Kimbanseke',pf:.92,delai:2,fiab:.72,qual:.9,txt:'Le moins cher, mais livre parfois en retard.'},
 {id:'B',nom:'Ets Mbuyi et Fils',pf:1,delai:1,fiab:.92,qual:1,txt:'Prix normal, livraison sérieuse.'},
 {id:'C',nom:'Import-Export Matadi',pf:1.12,delai:1,fiab:.99,qual:1.12,txt:'Plus cher, mais fiable et de belle qualité.'}];
export const EMPLOIS=[
 {id:'caissier',nom:'Caissier·ère',ico:'💵',sal:5000,txt:'Encaisse automatiquement les clients.'},
 {id:'vendeur',nom:'Vendeur·se',ico:'🛍',sal:6000,txt:'Conseille les clients : plus de ventes, moins de départs.'},
 {id:'comptable',nom:'Comptable',ico:'🧮',sal:11000,txt:'Suit les comptes : détecte les pertes et réduit les erreurs.'},
 {id:'commercial',nom:'Responsable commercial',ico:'📈',sal:13000,txt:'Rend les campagnes plus efficaces.'},
 {id:'gestionnaire',nom:'Gestionnaire',ico:'🗂',sal:12000,txt:'Réduit le gaspillage et les ruptures.'},
 {id:'technicien',nom:'Technicien',ico:'🔧',sal:9000,txt:'Répare vite et réduit les pannes.'},
 {id:'rh',nom:'Responsable RH',ico:'🤝',sal:11000,txt:'Garde le personnel motivé.'}];
export const NOMS=['Mireille','Patrick','Christelle','Jonathan','Espérance','Dieudonné','Nadège','Fiston','Béatrice','Jean-Claude','Bijou','Trésor','Grâce','Merveille','Cédric','Solange','Prince','Rachel','Héritier','Ornella'];
export const NOMS_F=['Kabasele','Mbuyi','Ilunga','Nzuzi','Kalala','Lukusa','Mutombo','Tshibola','Mavungu','Kasongo'];
export const EQUIP=[
 {id:'caisse',nom:'Caisse enregistreuse',ico:'🧾',cout:45000,txt:'Service 20 % plus rapide.'},
 {id:'etagere',nom:'Étagères et vitrines',ico:'🗄',cout:60000,txt:'Plus de stock et plus de clients à la fois.'},
 {id:'groupe',nom:'Groupe électrogène',ico:'⚡',cout:150000,txt:'Protège des coupures de courant.'},
 {id:'frigo',nom:'Réfrigérateurs',ico:'❄️',cout:120000,txt:'Meilleure qualité et moins de gaspillage.'},
 {id:'ordi',nom:'Ordinateur de gestion',ico:'🖥',cout:90000,txt:'Meilleur suivi des stocks et des comptes.'},
 {id:'enseigne',nom:'Grande enseigne lumineuse',ico:'💡',cout:35000,txt:'+8 % de clients.'},
 {id:'moto',nom:'Moto de livraison',ico:'🏍',cout:200000,txt:'Livraisons à domicile : +10 % de clients.'},
 {id:'mobile',nom:'Terminal Mobile Money',ico:'📲',cout:20000,txt:'Accepte M-Pesa, Airtel Money et Orange Money (1 % de frais).'}];
export const CAMPAGNES=[
 {id:'affiche',nom:'Affiches dans le quartier',ico:'🪧',cout:5000,jours:3,eff:.10,txt:'Peu chère, visible dans la rue.'},
 {id:'whatsapp',nom:'Messages WhatsApp et réseaux sociaux',ico:'📲',cout:8000,jours:4,eff:.15,txt:'Touche les jeunes clients.'},
 {id:'radio',nom:'Annonce à la radio locale',ico:'📻',cout:25000,jours:5,eff:.25,txt:'Beaucoup d’auditeurs, mais chère.'},
 {id:'flyers',nom:'Distribution de dépliants',ico:'📄',cout:6000,jours:2,eff:.08,txt:'Rapide et bon marché.'}];
export const SLOGANS=['Qualité et petits prix','Le choix des familles','Ici, le client est roi','Fraîcheur garantie tous les jours','Votre partenaire de confiance','Toujours à votre service'];
export const LOGO_SYMBOLES=['⭐','🌿','🦁','🔥','💎','🌍','☀️','🏆','🐘','🌴','⚙️','❤️'];
export const LOGO_COULEURS=['#c0392b','#2c7fb8','#2e7d32','#f4c20d','#7b3fa0','#e84393','#e67e22','#222222'];
export const CAPITAUX=[50000,100000,250000,500000,1000000];
export const NIVEAUX=[[0,'Entrepreneur débutant','🌱',0],[100000,'Petit entrepreneur','🛒',5],[400000,'Entrepreneur confirmé','💼',10],[1200000,'Chef d’entreprise','🏢',15],[4000000,'Grand entrepreneur','🏆',25]];
export const COMPETENCES=[['initiative','💡 Esprit d’initiative'],['gestionFin','💰 Gestion financière'],['compta','📒 Comptabilité élémentaire'],['negociation','🤝 Négociation'],['leadership','👥 Leadership'],['decision','🧭 Prise de décision'],['creativite','🎨 Créativité'],['risques','🛡 Gestion des risques'],['responsabilite','⚖️ Responsabilité']];
// événements : effets {cash,rep,sat,demande:[mult,jours],achat:[mult,jours],vit:[mult,jours],fournisseur:[id,jours],dette,agence:true}, comp:{clé:pts}, bon : choix pédagogiquement judicieux
export const EVENEMENTS=[
 {id:'hausse',titre:'📈 Hausse du prix des marchandises',txt:'Un problème au port de Matadi fait monter les prix de gros de 20 % pendant 4 jours.',choix:[
  {t:'Répercuter une partie sur tes prix (+8 %)',eff:{achat:[1.2,4],prix:1.08,demande:[.93,4]},comp:{decision:3,gestionFin:2},bon:true,note:'Bonne décision : on protège sa marge, mais certains clients partent.'},
  {t:'Absorber la hausse (marge réduite)',eff:{achat:[1.2,4],rep:1},comp:{responsabilite:2},note:'Tu gardes tes clients mais gagnes moins pendant 4 jours.'},
  {t:'Chercher un fournisseur moins cher et lent',eff:{achat:[1.08,4],demande:[.97,2]},comp:{negociation:3},bon:true,note:'Comparer les fournisseurs permet de limiter la hausse.'}]},
 {id:'concurrence',titre:'🏪 Un concurrent s’installe en face',txt:'Un nouveau commerce ouvre à côté du tien avec des prix agressifs.',choix:[
  {t:'Baisser tes prix de 5 %',eff:{prix:.95,demande:[.92,6]},comp:{decision:2},note:'Tu gardes une partie des clients, au prix d’une marge réduite.'},
  {t:'Lancer une campagne (8 000 FC)',eff:{cash:-8000,demande:[.97,6],rep:1},comp:{creativite:3,initiative:2},bon:true,note:'Se différencier par la communication est souvent plus durable qu’une guerre des prix.'},
  {t:'Ne rien faire',eff:{demande:[.8,6]},comp:{},note:'Tu perds environ 20 % de tes clients pendant 6 jours.'}]},
 {id:'fournisseur',titre:'🚚 Perte d’un fournisseur',txt:'Ton fournisseur habituel est en rupture pendant 5 jours.',choix:[
  {t:'Commander chez « Import-Export Matadi » (plus cher)',eff:{fournisseur:['A',5],achat:[1.1,5]},comp:{risques:3},bon:true,note:'Avoir plusieurs fournisseurs réduit les risques.'},
  {t:'Attendre le retour du fournisseur',eff:{fournisseur:['A',5],demande:[.9,5]},comp:{},note:'Les ruptures coûtent des clients.'}]},
 {id:'panne',titre:'🔧 Panne d’équipement',txt:'Ton équipement principal tombe en panne.',choix:[
  {t:'Le réparer tout de suite (15 000 FC)',eff:{cash:-15000},comp:{responsabilite:2,gestionFin:1},bon:true,note:'Une réparation rapide évite de perdre des clients.'},
  {t:'Travailler sans (service plus lent)',eff:{vit:[.7,4],demande:[.88,4]},comp:{},note:'Le service ralenti fait fuir des clients.'}]},
 {id:'reclamation',titre:'😠 Réclamation d’un client',txt:'Une cliente affirme que son produit est abîmé et réclame un remboursement.',choix:[
  {t:'La rembourser et présenter des excuses (5 000 FC)',eff:{cash:-5000,rep:3,fid:1},comp:{responsabilite:3,leadership:1},bon:true,note:'Un client bien traité peut devenir fidèle.'},
  {t:'Proposer un échange du produit (2 000 FC)',eff:{cash:-2000,rep:1},comp:{negociation:2},note:'Solution équilibrée.'},
  {t:'Refuser',eff:{rep:-4},comp:{},note:'La mauvaise nouvelle se répand vite au marché.'}]},
 {id:'tresorerie',titre:'🧾 Facture inattendue',txt:'La commune réclame une taxe de 40 000 FC avant la fin de la semaine.',choix:[
  {t:'La payer avec ta trésorerie',eff:{cash:-40000},comp:{gestionFin:2,risques:2},bon:true,note:'Garder une réserve permet d’absorber les imprévus.'},
  {t:'Demander un délai (5 000 FC de pénalité)',eff:{cash:-5000,rep:-1,dette:35000},comp:{negociation:1},note:'Tu gagnes du temps mais tu t’endettes.'}]},
 {id:'demande',titre:'🎉 Hausse de la demande',txt:'La rentrée scolaire (ou une fête) amène beaucoup de clients pendant 4 jours.',choix:[
  {t:'Préparer plus de stock (30 000 FC de marchandises en plus)',eff:{cash:-30000,demande:[1.35,4],stockPlus:30000},comp:{decision:2,initiative:2},bon:true,note:'Anticiper la demande permet de vendre plus.'},
  {t:'Rester comme d’habitude',eff:{demande:[1.1,4]},comp:{},note:'Tu profites un peu de l’occasion.'}]},
 {id:'agence',titre:'🏪 Opportunité : ouvrir une agence',txt:'Un local se libère dans un autre quartier. Ouvrir une deuxième agence coûte 40 % de ton capital de départ.',cond:'agence',choix:[
  {t:'Ouvrir la deuxième agence',eff:{agence:true},comp:{initiative:4,risques:1},note:'Tu développes ton entreprise.'},
  {t:'Attendre un meilleur moment',eff:{},comp:{risques:2},bon:true,note:'La prudence est aussi une qualité d’entrepreneur.'}]}];
