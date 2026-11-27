
// Réglages communs à tous les graphiques Chart.js
// (Chart.js dessine dans un <canvas> : ses couleurs et polices se règlent
// en JavaScript, le CSS n'a pas d'effet à l'intérieur du canvas.)
Chart.defaults.font.family = 'Inter, sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#3C3C3C';


//crée un élément HTML avec une classe et un texte
function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

// Crée une barre (fond gris + remplissage) dont la longueur vaut "percent"
function createBar(barClass, fillClass, percent) {
  const bar = createElement('div', barClass);
  const fill = createElement('div', fillClass);
  fill.style.setProperty('--value', percent.toFixed(1)); // on donne juste la valeur au CSS
  bar.appendChild(fill);
  return bar;
}


// Graphique d'ouverture : les 4 barres « £ par semaine »
function createLeadBars() {
  const list = document.getElementById('lead-bars');
  const maxValue = WEEKLY_BILL[0].value; // la plus grande valeur = barre pleine

  WEEKLY_BILL.forEach(function (item) {
    const row = createElement('li', item.isNI ? 'is-ni' : '');
    row.appendChild(createElement('span', '', item.nation));
    row.appendChild(createBar('bar', 'bar-fill', item.value / maxValue * 100));
    row.appendChild(createElement('strong', '', '£' + item.value.toFixed(2)));
    list.appendChild(row);
  });
}


// Le panier : une carte par aliment
function createBasket() {
  const grid = document.getElementById('basket-grid');
  const maxGrams = 1100; // valeur qui correspond à une barre pleine

  BASKET.forEach(function (item) {
    const difference = Math.round((item.northernIreland / item.england - 1) * 100);
    const sign = difference > 0 ? '+' : '−';

    const card = createElement('div', 'basket-card');

    // Titre de la carte : aliment + écart en %
    const head = createElement('p', 'basket-head');
    head.appendChild(createElement('strong', '', item.food));
    head.appendChild(createElement('span', difference > 0 ? 'gap-up' : 'gap-down',
      sign + Math.abs(difference) + '% in NI'));
    card.appendChild(head);

    // Ligne Irlande du Nord
    const lineNI = createElement('p', 'basket-line');
    lineNI.appendChild(createElement('span', '', 'Northern Ireland'));
    lineNI.appendChild(createElement('strong', '', item.northernIreland + ' g'));
    card.appendChild(lineNI);
    card.appendChild(createBar('basket-bar', 'basket-bar-fill is-ni', item.northernIreland / maxGrams * 100));

    // Ligne Angleterre
    const lineEN = createElement('p', 'basket-line');
    lineEN.appendChild(createElement('span', '', 'England'));
    lineEN.appendChild(createElement('strong', '', item.england + ' g'));
    card.appendChild(lineEN);
    card.appendChild(createBar('basket-bar', 'basket-bar-fill', item.england / maxGrams * 100));

    grid.appendChild(card);
  });
}


document.addEventListener('DOMContentLoaded', function () {
  createLeadBars();
  createBasket();
  initCrisisChart();   // graphique-crises.js
  initAnimations();    // animations.js (enregistre ScrollTrigger)
  initPriceChart();    // graphique-prix.js (utilise ScrollTrigger)
  initProgressBar();   // animations.js
});
