// Si le visiteur a demandé moins d'animations dans son système,
// on ne lance pas les animations décoratives (accessibilité).
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  if (reduceMotion) return;

  // 1. Apparition de l'en-tête de l'article au chargement
  gsap.from('.article-header > *', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out'
  });

  // 2. Les barres du graphique d'ouverture se remplissent
  // (scaleX : on étire la barre de 0 à sa taille normale, depuis la gauche)
  gsap.from('.lead-bars .bar-fill', {
    scaleX: 0,
    duration: 1.2,
    stagger: 0.1,
    delay: 0.6,
    ease: 'power2.out'
  });

  // 3. Le compteur £41.28 part de 0
  document.querySelectorAll('.counter').forEach(function (counter) {
    const target = parseFloat(counter.dataset.count);
    const value = { current: 0 };
    gsap.to(value, {
      current: target,
      duration: 1.5,
      delay: 0.6,
      ease: 'power1.out',
      onUpdate: function () {
        counter.textContent = value.current.toFixed(2);
      }
    });
  });

  // 4. Les titres de section apparaissent au défilement
  gsap.utils.toArray('.section-title').forEach(function (title) {
    gsap.from(title, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      scrollTrigger: { trigger: title, start: 'top 85%' }
    });
  });

  // 5. Les barres du panier se remplissent en cascade
  gsap.from('.basket-bar-fill', {
    scaleX: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '#basket-grid', start: 'top 80%' }
  });
}

// Barre de progression de lecture (sous la navigation)
// Le JS calcule le pourcentage lu et le donne au CSS (variable --progress).
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--progress', (scrolled / total * 100).toFixed(1));
  });
}
