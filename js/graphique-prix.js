// Deux courbes pour l'Irlande du Nord : le prix moyen payé et la quantité achetée. La zone entre les deux est colorée (effet ciseaux).
// Le graphique n'est créé que lorsqu'il arrive à l'écran (ScrollTrigger), pour que le visiteur voie l'animation de tracé de Chart.js.

let priceChart = null;
let currentProduct = 'milk';

function createPriceChart() {
  const canvas = document.getElementById('price-chart');
  const product = PRICES[currentProduct];

  priceChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: [
        {
          label: 'Average price paid',
          data: product.price,
          borderColor: '#B4541A',
          backgroundColor: '#B4541A',
          borderWidth: 3,
          tension: 0.25
        },
        {
          label: 'Amount bought',
          data: product.amount,
          borderColor: '#0B6E4F',
          backgroundColor: 'rgba(246, 201, 154, 0.45)', // couleur de la zone entre les courbes
          borderWidth: 3,
          tension: 0.25,
          fill: '-1'   // remplit l'espace jusqu'à la courbe précédente (le prix)
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: { duration: 1800, easing: 'easeOutQuart' },
      scales: {
        y: { title: { display: true, text: 'Index (2019-20 = 100)' }, grid: { color: '#E3E3E0' } },
        x: { grid: { display: false } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
        tooltip: {
          callbacks: {
            label: function (item) {
              return item.dataset.label + ': ' + item.parsed.y;
            }
          }
        }
      }
    }
  });
}

// Changer de produit (lait, pain, fruits)
function changeProduct(productKey) {
  currentProduct = productKey;
  const product = PRICES[productKey];

  // Met à jour les chiffres à côté du graphique
  document.getElementById('price-text').textContent = product.priceText;
  document.getElementById('price-change').textContent = product.priceChange;
  document.getElementById('amount-text').textContent = product.amountText;
  document.getElementById('amount-change').textContent = product.amountChange;

  document.querySelectorAll('.product-btn').forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.product === productKey);
  });

  // Si le graphique existe déjà, on change ses données
  if (priceChart) {
    priceChart.data.datasets[0].data = product.price;
    priceChart.data.datasets[1].data = product.amount;
    priceChart.update();
  }
}

// Mise en route : appelée par main.js
function initPriceChart() {
  document.querySelectorAll('.product-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      changeProduct(button.dataset.product);
    });
  });

  // ScrollTrigger (GSAP) : on crée le graphique quand il entre dans l'écran
  ScrollTrigger.create({
    trigger: '#price-chart',
    start: 'top 85%',
    once: true,
    onEnter: createPriceChart
  });
}
