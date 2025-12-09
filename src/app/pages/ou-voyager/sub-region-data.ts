export interface LocalizedText {
  fr: string;
  en: string;
}

export interface Country {
  name: LocalizedText;
  flagCode: string;
}

export interface SubRegionData {
  name: LocalizedText;
  description: LocalizedText;
  countries: Country[];
}

export const allSubRegionData: { [key: string]: SubRegionData } = {
  'Afrique du Nord': {
    name: { fr: 'Afrique du Nord', en: 'North Africa' },
    description: { fr: "L'Afrique du Nord est une région où les mélanges de culture, d’histoire et de paysages époustouflants vous transporteront dans un voyage inoubliable.", en: "North Africa is a region where mixtures of culture, history and breathtaking landscapes will transport you on an unforgettable journey." },
    countries: [
      { name: { fr: 'Maroc', en: 'Morocco' }, flagCode: 'ma' },
      { name: { fr: 'Algérie', en: 'Algeria' }, flagCode: 'dz' },
      { name: { fr: 'Tunisie', en: 'Tunisia' }, flagCode: 'tn' },
      { name: { fr: 'Égypte', en: 'Egypt' }, flagCode: 'eg' },
      { name: { fr: 'Soudan', en: 'Sudan' }, flagCode: 'sd' },
    ]
  },
  'Afrique Australe': {
    name: { fr: 'Afrique Australe', en: 'Southern Africa' },
    description: { fr: "L'Afrique Australe est une région où se mêlent paysages magnifiques, cultures authentiques et merveilles de l’architecture pour offrir une expérience de voyage inoubliable.", en: "Southern Africa is a region where magnificent landscapes, authentic cultures and architectural wonders combine to offer an unforgettable travel experience." },
    countries: [
      { name: { fr: 'Afrique du Sud', en: 'South Africa' }, flagCode: 'za' },
      { name: { fr: 'Namibie', en: 'Namibia' }, flagCode: 'na' },
      { name: { fr: 'Botswana', en: 'Botswana' }, flagCode: 'bw' },
      { name: { fr: 'Zimbabwe', en: 'Zimbabwe' }, flagCode: 'zw' },
      { name: { fr: 'Zambie', en: 'Zambia' }, flagCode: 'zm' },
    ]
  },
  'Afrique de l\'Ouest': {
    name: { fr: 'Afrique de l\'Ouest', en: 'West Africa' },
    description: { fr: "L'Afrique de l'Ouest, berceau de riches empires et de traditions vibrantes, vous invite à un voyage au cœur de la diversité. Des côtes animées aux marchés colorés, en passant par une hospitalité légendaire, découvrez une mosaïque de cultures et de paysages qui ne vous laissera pas indifférent.", en: "West Africa, the cradle of rich empires and vibrant traditions, invites you on a journey to the heart of diversity. From lively coasts to colorful markets and legendary hospitality, discover a mosaic of cultures and landscapes that will not leave you indifferent." },
    countries: [
      { name: { fr: 'Sénégal', en: 'Senegal' }, flagCode: 'sn' },
      { name: { fr: 'Côte d\'Ivoire', en: 'Ivory Coast' }, flagCode: 'ci' },
      { name: { fr: 'Ghana', en: 'Ghana' }, flagCode: 'gh' },
      { name: { fr: 'Nigéria', en: 'Nigeria' }, flagCode: 'ng' },
      { name: { fr: 'Mali', en: 'Mali' }, flagCode: 'ml' },
    ]
  },
  'Afrique de l\'Est': {
    name: { fr: 'Afrique de l\'Est', en: 'East Africa' },
    description: { fr: "L'Afrique de l’Est est une région où se mêlent nature sauvage et paysages époustouflants à une culture riche et une histoire fascinante.", en: "East Africa is a region where wild nature and breathtaking landscapes mix with a rich culture and a fascinating history." },
    countries: [
      { name: { fr: 'Kenya', en: 'Kenya' }, flagCode: 'ke' },
      { name: { fr: 'Tanzanie', en: 'Tanzania' }, flagCode: 'tz' },
      { name: { fr: 'Ouganda', en: 'Uganda' }, flagCode: 'ug' },
      { name: { fr: 'Rwanda', en: 'Rwanda' }, flagCode: 'rw' },
      { name: { fr: 'Éthiopie', en: 'Ethiopia' }, flagCode: 'et' },
    ]
  },
  'Afrique Centrale': {
    name: { fr: 'Afrique Centrale', en: 'Central Africa' },
    description: { fr: "Au cœur du continent, l'Afrique Centrale est une terre de contrastes, abritant d'immenses forêts tropicales, une faune exceptionnelle et des cultures ancestrales. C'est une invitation à l'aventure et à la découverte de trésors naturels encore préservés.", en: "In the heart of the continent, Central Africa is a land of contrasts, home to immense tropical forests, exceptional fauna and ancestral cultures. It is an invitation to adventure and to the discovery of still preserved natural treasures." },
    countries: [
      { name: { fr: 'Cameroun', en: 'Cameroon' }, flagCode: 'cm' },
      { name: { fr: 'Gabon', en: 'Gabon' }, flagCode: 'ga' },
      { name: { fr: 'RD Congo', en: 'DR Congo' }, flagCode: 'cd' },
      { name: { fr: 'Congo', en: 'Congo' }, flagCode: 'cg' },
    ]
  },
  'Amérique du Nord': {
    name: { fr: 'Amérique du Nord', en: 'North America' },
    description: { fr: "Découvrez l’essence de l’Amérique du Nord, du charme historique du Mexique à la culture cosmopolite de New York en passant par la nature sauvage des parcs nationaux Canadiens.", en: "Discover the essence of North America, from the historical charm of Mexico to the cosmopolitan culture of New York and the wilderness of Canadian national parks." },
    countries: [
      { name: { fr: 'États-Unis', en: 'United States' }, flagCode: 'us' },
      { name: { fr: 'Canada', en: 'Canada' }, flagCode: 'ca' },
      { name: { fr: 'Mexique', en: 'Mexico' }, flagCode: 'mx' },
    ]
  },
  'Amérique du Sud': {
    name: { fr: 'Amérique du Sud', en: 'South America' },
    description: { fr: "L'Amérique du Sud vous offre un dépaysement total avec ses cultures vibrantes, ses patrimoines historiques et ses merveilles naturelles. Préparez-vous à vivre des expériences uniques et inoubliables.", en: "South America offers you a total change of scenery with its vibrant cultures, historical heritages and natural wonders. Get ready to live unique and unforgettable experiences." },
    countries: [
      { name: { fr: 'Brésil', en: 'Brazil' }, flagCode: 'br' },
      { name: { fr: 'Argentine', en: 'Argentina' }, flagCode: 'ar' },
      { name: { fr: 'Pérou', en: 'Peru' }, flagCode: 'pe' },
      { name: { fr: 'Colombie', en: 'Colombia' }, flagCode: 'co' },
      { name: { fr: 'Chili', en: 'Chile' }, flagCode: 'cl' },
    ]
  },
  'Amérique Centrale': {
    name: { fr: 'Amérique Centrale', en: 'Central America' },
    description: { fr: "Découvrez les merveilles cachées de l’Amérique Centrale, explorez ce joyau rempli de culture riche, de nature préservée et de moments inoubliables.", en: "Discover the hidden wonders of Central America, explore this jewel filled with rich culture, preserved nature and unforgettable moments." },
    countries: [
      { name: { fr: 'Costa Rica', en: 'Costa Rica' }, flagCode: 'cr' },
      { name: { fr: 'Panama', en: 'Panama' }, flagCode: 'pa' },
      { name: { fr: 'Guatemala', en: 'Guatemala' }, flagCode: 'gt' },
      { name: { fr: 'Belize', en: 'Belize' }, flagCode: 'bz' },
      { name: { fr: 'Nicaragua', en: 'Nicaragua' }, flagCode: 'ni' },
    ]
  },
  'Moyen-Orient': {
    name: { fr: 'Moyen-Orient', en: 'Middle East' },
    description: { fr: "Le Moyen-Orient, carrefour de civilisations anciennes et de modernité audacieuse, offre un voyage fascinant. Des déserts infinis aux villes futuristes, en passant par des sites archéologiques d'une richesse inouïe, découvrez une région de contrastes et d'hospitalité.", en: "The Middle East, a crossroads of ancient civilizations and bold modernity, offers a fascinating journey. From endless deserts to futuristic cities, through archaeological sites of incredible richness, discover a region of contrasts and hospitality." },
    countries: [
      { name: { fr: 'Émirats arabes unis', en: 'United Arab Emirates' }, flagCode: 'ae' },
      { name: { fr: 'Jordanie', en: 'Jordan' }, flagCode: 'jo' },
      { name: { fr: 'Oman', en: 'Oman' }, flagCode: 'om' },
      { name: { fr: 'Israël', en: 'Israel' }, flagCode: 'il' },
      { name: { fr: 'Qatar', en: 'Qatar' }, flagCode: 'qa' },
    ]
  },
  'Asie de l\'Est': {
    name: { fr: 'Asie de l\'Est', en: 'East Asia' },
    description: { fr: "L'Asie de l'Est est une région de contrastes fascinants, où des traditions millénaires côtoient une modernité fulgurante. Des métropoles dynamiques aux paysages naturels sereins, en passant par une gastronomie mondialement reconnue, cette région offre une expérience de voyage riche et diversifiée.", en: "East Asia is a region of fascinating contrasts, where ancient traditions meet dazzling modernity. From dynamic metropolises to serene natural landscapes, and world-renowned gastronomy, this region offers a rich and diverse travel experience." },
    countries: [
      { name: { fr: 'Chine', en: 'China' }, flagCode: 'cn' },
      { name: { fr: 'Japon', en: 'Japan' }, flagCode: 'jp' },
      { name: { fr: 'Corée du Sud', en: 'South Korea' }, flagCode: 'kr' },
      { name: { fr: 'Taïwan', en: 'Taiwan' }, flagCode: 'tw' },
      { name: { fr: 'Mongolie', en: 'Mongolia' }, flagCode: 'mn' },
    ]
  },
  'Asie du Sud': {
    name: { fr: 'Asie du Sud', en: 'South Asia' },
    description: { fr: "L'Asie du Sud est une terre de spiritualité, de couleurs et de contrastes saisissants. Des sommets de l'Himalaya aux plages tropicales, en passant par des villes bouillonnantes et des sites historiques millénaires, cette région promet un voyage intense et profondément marquant.", en: "South Asia is a land of spirituality, colors, and striking contrasts. From the peaks of the Himalayas to tropical beaches, through bustling cities and ancient historical sites, this region promises an intense and deeply memorable journey." },
    countries: [
      { name: { fr: 'Inde', en: 'India' }, flagCode: 'in' },
      // CORRECTION ICI : Structure corrigée pour le Népal
      { name: { fr: 'Népal', en: 'Nepal' }, flagCode: 'np' },
      { name: { fr: 'Sri Lanka', en: 'Sri Lanka' }, flagCode: 'lk' },
      { name: { fr: 'Pakistan', en: 'Pakistan' }, flagCode: 'pk' },
      { name: { fr: 'Bhoutan', en: 'Bhutan' }, flagCode: 'bt' },
    ]
  },
  'Asie du Sud-Est': {
    name: { fr: 'Asie du Sud-Est', en: 'Southeast Asia' },
    description: { fr: "L'Asie du Sud-Est est une mosaïque de cultures, de paysages et de saveurs. Des plages paradisiaques de Thaïlande aux rizières en terrasses du Vietnam, en passant par la jungle luxuriante de Malaisie, chaque destination est une promesse d'aventure et d'émerveillement.", en: "Southeast Asia is a mosaic of cultures, landscapes, and flavors. From the paradise beaches of Thailand to the terraced rice fields of Vietnam, through the lush jungle of Malaysia, each destination is a promise of adventure and wonder." },
    countries: [
      { name: { fr: 'Thaïlande', en: 'Thailand' }, flagCode: 'th' },
      { name: { fr: 'Vietnam', en: 'Vietnam' }, flagCode: 'vn' },
      { name: { fr: 'Indonésie', en: 'Indonesia' }, flagCode: 'id' },
      { name: { fr: 'Malaisie', en: 'Malaysia' }, flagCode: 'my' },
      { name: { fr: 'Singapour', en: 'Singapore' }, flagCode: 'sg' },
    ]
  },
  'Europe occidentale': {
    name: { fr: 'Europe occidentale', en: 'Western Europe' },
    description: { fr: "L'Europe occidentale est un concentré d'histoire, d'art et de capitales dynamiques. Des canaux d'Amsterdam aux musées de Paris, en passant par le charme de Londres, chaque ville est une page d'histoire à explorer.", en: "Western Europe is a concentrate of history, art and dynamic capitals. From the canals of Amsterdam to the museums of Paris, via the charm of London, each city is a page of history to explore." },
    countries: [
      { name: { fr: 'France', en: 'France' }, flagCode: 'fr' },
      { name: { fr: 'Allemagne', en: 'Germany' }, flagCode: 'de' },
      { name: { fr: 'Royaume-Uni', en: 'United Kingdom' }, flagCode: 'gb' },
      { name: { fr: 'Pays-Bas', en: 'Netherlands' }, flagCode: 'nl' },
      { name: { fr: 'Belgique', en: 'Belgium' }, flagCode: 'be' },
    ]
  },
  'Europe de l\'Est': {
    name: { fr: 'Europe de l\'Est', en: 'Eastern Europe' },
    description: { fr: "L'Europe de l'Est offre un voyage à travers le temps, avec ses châteaux médiévaux, ses villes impériales et ses traditions préservées. Découvrez des destinations authentiques et pleines de charme, de Prague à Budapest.", en: "Eastern Europe offers a journey through time, with its medieval castles, imperial cities and preserved traditions. Discover authentic and charming destinations, from Prague to Budapest." },
    countries: [
      { name: { fr: 'Pologne', en: 'Poland' }, flagCode: 'pl' },
      { name: { fr: 'République tchèque', en: 'Czech Republic' }, flagCode: 'cz' },
      { name: { fr: 'Hongrie', en: 'Hungary' }, flagCode: 'hu' },
      { name: { fr: 'Roumanie', en: 'Romania' }, flagCode: 'ro' },
      { name: { fr: 'Russie', en: 'Russia' }, flagCode: 'ru' },
    ]
  },
  'Europe du Nord': {
    name: { fr: 'Europe du Nord', en: 'Northern Europe' },
    description: { fr: "L'Europe du Nord est la destination des amoureux de la nature et des grands espaces. Entre les fjords majestueux de Norvège, les aurores boréales et le design scandinave, préparez-vous à un dépaysement total.", en: "Northern Europe is the destination for lovers of nature and wide open spaces. Between the majestic fjords of Norway, the northern lights and Scandinavian design, prepare for a total change of scenery." },
    countries: [
      { name: { fr: 'Suède', en: 'Sweden' }, flagCode: 'se' },
      { name: { fr: 'Norvège', en: 'Norway' }, flagCode: 'no' },
      { name: { fr: 'Danemark', en: 'Denmark' }, flagCode: 'dk' },
      { name: { fr: 'Finlande', en: 'Finland' }, flagCode: 'fi' },
      { name: { fr: 'Islande', en: 'Iceland' }, flagCode: 'is' },
    ]
  },
  'Europe du Sud': {
    name: { fr: 'Europe du Sud', en: 'Southern Europe' },
    description: { fr: "L'Europe du Sud est synonyme de soleil, de plages idylliques et de gastronomie savoureuse. De l'Italie à l'Espagne, en passant par la Grèce, profitez d'un art de vivre méditerranéen et de sites antiques exceptionnels.", en: "Southern Europe is synonymous with sun, idyllic beaches and tasty gastronomy. From Italy to Spain, via Greece, enjoy a Mediterranean art of living and exceptional ancient sites." },
    countries: [
      { name: { fr: 'Italie', en: 'Italy' }, flagCode: 'it' },
      { name: { fr: 'Espagne', en: 'Spain' }, flagCode: 'es' },
      { name: { fr: 'Grèce', en: 'Greece' }, flagCode: 'gr' },
      { name: { fr: 'Portugal', en: 'Portugal' }, flagCode: 'pt' },
      { name: { fr: 'Croatie', en: 'Croatia' }, flagCode: 'hr' },
    ]
  },
  'Australie': {
    name: { fr: 'Australie', en: 'Australia' },
    description: { fr: "L'Australie, continent à part entière, est une terre d'aventure. Explorez le vaste Outback, plongez dans la Grande Barrière de Corail et découvrez une faune unique au monde, des kangourous aux koalas.", en: "Australia, a continent in its own right, is a land of adventure. Explore the vast Outback, dive into the Great Barrier Reef and discover a fauna unique in the world, from kangaroos to koalas." },
    countries: [{ name: { fr: 'Australie', en: 'Australia' }, flagCode: 'au' }]
  },
  'Mélanésie': {
    name: { fr: 'Mélanésie', en: 'Melanesia' },
    description: { fr: "La Mélanésie est un archipel d'îles volcaniques aux cultures tribales riches et aux fonds marins spectaculaires. Une destination idéale pour la plongée et l'exploration hors des sentiers battus.", en: "Melanesia is an archipelago of volcanic islands with rich tribal cultures and spectacular seabeds. An ideal destination for diving and off-the-beaten-path exploration." },
    countries: [
      { name: { fr: 'Fidji', en: 'Fiji' }, flagCode: 'fj' },
      { name: { fr: 'Papouasie-Nouvelle-Guinée', en: 'Papua New Guinea' }, flagCode: 'pg' },
    ]
  },
  'Polynésie': {
    name: { fr: 'Polynésie', en: 'Polynesia' },
    description: { fr: "La Polynésie évoque des images de paradis terrestre : lagons turquoise, plages de sable blanc et bungalows sur pilotis. Découvrez un rythme de vie paisible et une hospitalité légendaire.", en: "Polynesia evokes images of earthly paradise: turquoise lagoons, white sand beaches and overwater bungalows. Discover a peaceful pace of life and legendary hospitality." },
    countries: [
      { name: { fr: 'Polynésie française', en: 'French Polynesia' }, flagCode: 'pf' },
      { name: { fr: 'Samoa', en: 'Samoa' }, flagCode: 'ws' },
    ]
  },
};