
// Les 10 années financières affichées sur l'axe horizontal
const YEARS = [
  '2015-16', '2016-17', '2017-18', '2018-19', '2019-20',
  '2020-21', '2021-22', '2022-23', '2023-24', '2024-25'
];

// Les 4 nations : nom affiché, couleur, et si la courbe est visible au départ
const NATIONS = [
  { key: 'northernIreland', name: 'Northern Ireland', color: '#0B6E4F', visible: true },
  { key: 'england',         name: 'England',          color: '#4A5568', visible: true },
  { key: 'scotland',        name: 'Scotland',         color: '#2B6CB0', visible: false },
  { key: 'wales',           name: 'Wales',            color: '#B7791F', visible: false }
];

// Les 4 mesures que l'on peut afficher avec les boutons
const MEASURES = {
  bill: {
    title: 'Household spending on food and drink',
    subtitle: 'Spending per person per week · index, 2019-20 = 100 · cash terms',
    values: {
      northernIreland: [99.4, 90.5, 96.3, 94.6, 100, 115.4, 106.4, 110.2, 121.7, 119.6],
      england:         [88.8, 92.0, 95.8, 97.9, 100, 111.5, 97.1, 99.9, 108.8, 113.7],
      scotland:        [98.6, 101.7, 99.0, 105.4, 100, 110.7, 109.4, 117.1, 118.5, 122.4],
      wales:           [78.2, 74.7, 90.9, 92.7, 100, 101.7, 96.3, 100.6, 96.0, 97.3]
    }
  },
  fruit: {
    title: 'Fresh fruit bought',
    subtitle: 'Grams per person per week · index, 2019-20 = 100',
    values: {
      northernIreland: [101.8, 118.2, 101.4, 108.4, 100, 115.7, 108.3, 95.9, 96.9, 91.2],
      england:         [102.9, 107.1, 104.2, 102.7, 100, 105.7, 93.0, 83.9, 89.1, 93.2],
      scotland:        [97.9, 110.1, 92.1, 102.6, 100, 107.4, 97.3, 92.6, 93.3, 92.8],
      wales:           [86.6, 78.0, 84.3, 97.2, 100, 94.9, 82.4, 55.2, 76.9, 74.3]
    }
  },
  bread: {
    title: 'Bread bought',
    subtitle: 'Grams per person per week · index, 2019-20 = 100',
    values: {
      northernIreland: [100.3, 96.1, 101.2, 99.7, 100, 92.7, 95.7, 91.8, 93.7, 80.3],
      england:         [103.2, 101.9, 101.0, 97.4, 100, 96.6, 88.2, 87.8, 84.2, 83.6],
      scotland:        [105.2, 97.5, 91.4, 121.0, 100, 89.3, 92.0, 94.5, 88.5, 85.8],
      wales:           [103.8, 105.3, 109.0, 94.9, 100, 92.8, 86.5, 92.3, 76.8, 81.3]
    }
  },
  milk: {
    title: 'Milk and milk products bought',
    subtitle: 'Millilitres per person per week · index, 2019-20 = 100',
    values: {
      northernIreland: [102.7, 105.6, 110.7, 106.3, 100, 103.7, 96.1, 93.4, 89.9, 82.6],
      england:         [104.7, 105.3, 104.5, 104.7, 100, 104.8, 94.7, 87.0, 83.9, 84.1],
      scotland:        [102.9, 102.8, 88.8, 114.5, 100, 102.5, 95.6, 97.0, 98.1, 81.4],
      wales:           [87.3, 88.7, 85.4, 101.7, 100, 74.9, 75.5, 84.1, 69.1, 77.0]
    }
  }
};

// Les 4 crises. "start" et "end" placent la bande sur le graphique
// (0 = première année, 9 = dernière). "yearIndex" = l'année de la crise.
const CRISES = [
  {
    id: 'brexit', start: 0.5, end: 1.5, yearIndex: 1, shortLabel: 'Brexit',
    date: 'June 2016', title: 'The Brexit vote',
    text: '56% of voters in Northern Ireland back Remain, but the UK votes to leave. Sterling falls, and imported food gets dearer.'
  },
  {
    id: 'covid', start: 4.5, end: 5.5, yearIndex: 5, shortLabel: 'Covid',
    date: '2020-21', title: 'Lockdowns and the Protocol',
    text: 'Cafés and restaurants close and meals move home: spending on food at home here jumps by 15% in a year. From January 2021, the Protocol brings new checks on goods arriving from Great Britain.'
  },
  {
    id: 'ukraine', start: 6.5, end: 7.5, yearIndex: 7, shortLabel: 'Ukraine',
    date: '2022-23', title: 'War in Ukraine',
    text: 'Russia invades Ukraine in February 2022. Energy, grain and fertiliser prices surge, and UK food inflation reaches its highest level in more than 40 years.'
  },
  {
    id: 'prices', start: 7.5, end: 8.5, yearIndex: 8, shortLabel: 'High prices',
    date: '2023-24', title: 'Prices stay high',
    text: 'Inflation slows, but prices do not come back down. The bill in Northern Ireland reaches its highest point of the decade.'
  }
];

// Graphique « Paying more, buying less » (Irlande du Nord uniquement)
const PRICES = {
  milk: {
    label: 'Milk',
    price:  [86.7, 94.4, 90.6, 95.0, 100, 98.2, 102.7, 120.9, 132.0, 141.8],
    amount: [102.7, 105.6, 110.7, 106.3, 100, 103.7, 96.1, 93.4, 89.9, 82.6],
    priceText: '£1.03 → £1.46 a litre', priceChange: '+42% since 2019-20',
    amountText: '1,884 → 1,556 ml', amountChange: '−17% since 2019-20'
  },
  bread: {
    label: 'Bread',
    price:  [83.5, 88.8, 89.9, 93.6, 100, 107.4, 109.7, 122.4, 128.9, 131.8],
    amount: [100.3, 96.1, 101.2, 99.7, 100, 92.7, 95.7, 91.8, 93.7, 80.3],
    priceText: '£2.39 → £3.16 a kilo', priceChange: '+32% since 2019-20',
    amountText: '643 → 517 g', amountChange: '−20% since 2019-20'
  },
  fruit: {
    label: 'Fresh fruit',
    price:  [92.3, 97.8, 102.4, 98.0, 100, 103.7, 97.1, 102.2, 120.3, 124.3],
    amount: [101.8, 118.2, 101.4, 108.4, 100, 115.7, 108.3, 95.9, 96.9, 91.2],
    priceText: '£2.53 → £3.14 a kilo', priceChange: '+24% since 2019-20',
    amountText: '659 → 601 g', amountChange: '−9% since 2019-20'
  }
};

// Graphique d'ouverture : dépense alimentaire à domicile par personne
// et par semaine en 2024-25, en livres sterling
const WEEKLY_BILL = [
  { nation: 'Northern Ireland', value: 41.28, isNI: true },
  { nation: 'Scotland',         value: 38.20 },
  { nation: 'England',          value: 37.23 },
  { nation: 'Wales',            value: 33.52 }
];

// Le panier 2024-25 : grammes achetés par personne et par semaine
const BASKET = [
  { food: 'Vegetables',     northernIreland: 803, england: 1051 },
  { food: 'Fresh fruit',    northernIreland: 601, england: 720 },
  { food: 'Bread',          northernIreland: 517, england: 430 },
  { food: 'Processed meat', northernIreland: 835, england: 711 }
];
