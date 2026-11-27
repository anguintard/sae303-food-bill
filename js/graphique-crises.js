
let crisisChart = null;        // le graphique Chart.js
let currentMeasure = 'bill';   // la mesure affichée
let selectedCrisis = 'covid';  // la crise mise en avant
let isPlaying = false;         // vrai pendant la lecture animée



//dessine les bandes de crise derrière les courbes (avant que les courbes soient dessinées).
const crisisBandsPlugin = {
  id: 'crisisBands',
  beforeDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const area = chart.chartArea;     // la zone où sont tracées les courbes
    const xAxis = chart.scales.x;

    ctx.save();
    CRISES.forEach(function (crisis) {
      // On convertit la position (ex : 4.5) en pixels
      const left = xAxis.getPixelForValue(crisis.start);
      const right = xAxis.getPixelForValue(crisis.end);

      // La crise sélectionnée est plus foncée
      ctx.fillStyle = (crisis.id === selectedCrisis) ? '#F6C99A' : '#EEE7DA';
      ctx.fillRect(left, area.top, right - left, area.bottom - area.top);

      // Le nom de la crise en haut de la bande
      ctx.fillStyle = (crisis.id === selectedCrisis) ? '#8A3B0C' : '#5F6368';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(crisis.shortLabel, (left + right) / 2, area.top + 14);
    });
    ctx.restore();
  }
};


// Crée une liste de « datasets » (une courbe par nation) pour Chart.js
function buildDatasets(measureKey) {
  return NATIONS.map(function (nation) {
    const isNI = nation.key === 'northernIreland';
    return {
      label: nation.name,
      data: MEASURES[measureKey].values[nation.key].slice(), // copie du tableau
      borderColor: nation.color,
      backgroundColor: nation.color,
      borderWidth: isNI ? 4 : 2,
      pointRadius: isNI ? 4 : 3,
      pointHoverRadius: 7,
      tension: 0.25,
      hidden: !nation.visible
    };
  });
}


// Création du graphique
function createCrisisChart() {
  const canvas = document.getElementById('crisis-chart');

  crisisChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: YEARS,
      datasets: buildDatasets(currentMeasure)
    },
    plugins: [crisisBandsPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // "index" : on survole une année entière, pas un point précis
      interaction: { mode: 'index', intersect: false },
      animation: { duration: 900 },
      scales: {
        y: {
          title: { display: true, text: 'Index (2019-20 = 100)' },
          grid: { color: '#E3E3E0' }
        },
        x: {
          grid: { display: false }
        }
      },
      plugins: {
        // Interaction 2 : clic sur la légende
        legend: {
          position: 'bottom',
          labels: { usePointStyle: true, boxWidth: 8 },
          onClick: function (event, legendItem) {
            toggleNation(legendItem.datasetIndex);
          }
        },
        // Interaction 1 : infobulle
        tooltip: {
          callbacks: {
            title: function (items) {
              const yearIndex = items[0].dataIndex;
              const crisis = CRISES.find(function (c) { return c.yearIndex === yearIndex; });
              return crisis ? YEARS[yearIndex] + ' · ' + crisis.title : YEARS[yearIndex];
            },
            label: function (item) {
              return item.dataset.label + ': ' + item.parsed.y;
            }
          }
        }
      },
      // Interaction 3 : clic sur une année de crise
      onClick: function (event, elements) {
        if (elements.length === 0) return;
        const yearIndex = elements[0].index;
        const crisis = CRISES.find(function (c) { return c.yearIndex === yearIndex; });
        if (crisis) {
          selectCrisis(crisis.id);
        }
      },
      // Au-dessus d'une année de crise, on ajoute la classe CSS "is-clickable"
      // (qui transforme le curseur en main, voir style.css)
      onHover: function (event, elements) {
        const isCrisisYear = elements.length > 0 &&
          CRISES.some(function (c) { return c.yearIndex === elements[0].index; });
        canvas.classList.toggle('is-clickable', isCrisisYear);
      }
    }
  });
}


//interaction extérieure 1 : changer de mesure
function changeMeasure(measureKey) {
  currentMeasure = measureKey;

  // On remplace les données de chaque courbe
  crisisChart.data.datasets.forEach(function (dataset, i) {
    dataset.data = MEASURES[measureKey].values[NATIONS[i].key].slice();
  });
  crisisChart.update();

  // On met à jour le titre et le sous-titre du graphique
  document.getElementById('chart-title').textContent = MEASURES[measureKey].title;
  document.getElementById('chart-subtitle').textContent = MEASURES[measureKey].subtitle;

  // On indique quel bouton est actif
  document.querySelectorAll('.measure-btn').forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.measure === measureKey);
  });

  fillDataTable();
}


//interaction extérieure 2 : afficher / masquer une nation (utilisée aussi par la légende du graphique)
function toggleNation(index) {
  const isVisible = crisisChart.isDatasetVisible(index);
  crisisChart.setDatasetVisibility(index, !isVisible);
  crisisChart.update();

  const button = document.querySelector('.nation-btn[data-index="' + index + '"]');
  button.setAttribute('aria-pressed', !isVisible);
}

// Crée les 4 boutons des nations à partir de NATIONS (data.js)
function createNationButtons() {
  const container = document.getElementById('nation-buttons');
  NATIONS.forEach(function (nation, index) {
    const button = document.createElement('button');
    button.type = 'button';
    // ex : class="nation-btn nation-northernIreland" (la couleur est dans le CSS)
    button.className = 'nation-btn nation-' + nation.key;
    button.dataset.index = index;
    button.setAttribute('aria-pressed', nation.visible);
    button.textContent = nation.name;
    button.addEventListener('click', function () {
      toggleNation(index);
    });
    container.appendChild(button);
  });
}


// Sélection d'une crise : fiche + bande en surbrillance
function showCrisisText(crisisId) {
  const crisis = CRISES.find(function (c) { return c.id === crisisId; });
  document.getElementById('crisis-date').textContent = crisis.date;
  document.getElementById('crisis-title').textContent = crisis.title;
  document.getElementById('crisis-text').textContent = crisis.text;

  document.querySelectorAll('.crisis-btn').forEach(function (button) {
    button.setAttribute('aria-pressed', button.dataset.crisis === crisisId);
  });
}

function selectCrisis(crisisId) {
  if (isPlaying) return;   // on ne change rien pendant la lecture
  selectedCrisis = crisisId;
  showCrisisText(crisisId);
  crisisChart.update();    // redessine les bandes (plugin)

  // Petite animation GSAP de la fiche
  gsap.fromTo('#crisis-panel', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 });
}



// Un objet { year: 0 } est animé par GSAP jusqu'à 9. À chaque étape (onUpdate), on n'affiche que les années déjà « atteintes » et on met en avant la dernière crise passée.
function playTimeline() {
  if (isPlaying) return;
  isPlaying = true;
  document.getElementById('play-btn').disabled = true;

  const progress = { year: 0 };

  gsap.to(progress, {
    year: YEARS.length - 1,
    duration: 6,
    ease: 'none',
    onUpdate: function () {
      const lastYear = Math.floor(progress.year);

      // On cache les points des années pas encore atteintes (null)
      crisisChart.data.datasets.forEach(function (dataset, i) {
        const fullValues = MEASURES[currentMeasure].values[NATIONS[i].key];
        dataset.data = fullValues.map(function (value, j) {
          return j <= lastYear ? value : null;
        });
      });

      // Dernière crise passée
      const pastCrises = CRISES.filter(function (c) { return c.yearIndex <= lastYear; });
      if (pastCrises.length > 0) {
        const last = pastCrises[pastCrises.length - 1];
        if (last.id !== selectedCrisis) {
          selectedCrisis = last.id;
          showCrisisText(last.id);
        }
      }

      crisisChart.update('none'); // 'none' = pas d'animation Chart.js, GSAP s'en charge
    },
    onComplete: function () {
      isPlaying = false;
      document.getElementById('play-btn').disabled = false;
    }
  });
}


// Tableau de données (accessibilité : alternative au graphique)
function fillDataTable() {
  const table = document.getElementById('data-table');
  const values = MEASURES[currentMeasure].values;

  let html = '<caption>' + MEASURES[currentMeasure].title + ' (index, 2019-20 = 100)</caption>';
  html += '<thead><tr><th scope="col">Year</th>';
  NATIONS.forEach(function (nation) {
    html += '<th scope="col">' + nation.name + '</th>';
  });
  html += '</tr></thead><tbody>';

  YEARS.forEach(function (year, i) {
    html += '<tr><th scope="row">' + year + '</th>';
    NATIONS.forEach(function (nation) {
      html += '<td>' + values[nation.key][i] + '</td>';
    });
    html += '</tr>';
  });

  html += '</tbody>';
  table.innerHTML = html;
}

// Mise en route : appelée par main.js
function initCrisisChart() {
  createNationButtons();
  createCrisisChart();
  showCrisisText(selectedCrisis);
  fillDataTable();

  document.querySelectorAll('.measure-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      changeMeasure(button.dataset.measure);
    });
  });

  document.querySelectorAll('.crisis-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      selectCrisis(button.dataset.crisis);
    });
  });

  document.getElementById('play-btn').addEventListener('click', playTimeline);
}
