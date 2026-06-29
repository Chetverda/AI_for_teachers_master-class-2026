(function () {
  const DECK_META = {
    mk1: { label: 'МК №1 · 6 миссий', slides: 19 },
    mk2: { label: 'МК №2 · Команды', slides: 16 },
  };

  const screenHome = document.getElementById('screen-home');
  const screenDeck = document.getElementById('screen-deck');
  const logoMark = document.getElementById('logo-mark');
  const progress = document.getElementById('progress');
  const counter = document.getElementById('counter');

  let currentDeck = null;
  let currentSlide = 0;
  let slides = [];

  function fillPrompts() {
    if (!window.MK1_PROMPTS) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('p1', MK1_PROMPTS.mission1);
    set('p2', MK1_PROMPTS.mission2_nanobanana);
    set('p3', MK1_PROMPTS.mission3);
    set('p4', MK1_PROMPTS.mission4);
    set('p5a', MK1_PROMPTS.mission5a);
    set('p5b', MK1_PROMPTS.mission5b);
    set('p6', MK1_PROMPTS.mission6);
    if (window.MK2_PROMPTS) {
      set('p-gen', MK2_PROMPTS.generate_system_prompt);
      set('p-test', MK2_PROMPTS.test_queries_template);
      set('p-pitch', MK2_PROMPTS.pitch_structure);
    }
  }

  function showHome() {
    screenHome.hidden = false;
    screenHome.classList.add('active');
    screenDeck.hidden = true;
    screenDeck.classList.remove('active');
    document.querySelectorAll('.deck').forEach(d => { d.hidden = true; });
    currentDeck = null;
    history.replaceState(null, '', '#home');
  }

  function openDeck(deckId) {
    currentDeck = deckId;
    currentSlide = 0;

    screenHome.classList.remove('active');
    screenHome.hidden = true;
    screenDeck.hidden = false;
    screenDeck.classList.add('active');

    document.querySelectorAll('.deck').forEach(d => {
      d.hidden = d.dataset.deck !== deckId;
    });

    const deckEl = document.getElementById('deck-' + deckId);
    slides = deckEl ? Array.from(deckEl.querySelectorAll('.slide')) : [];
    logoMark.textContent = DECK_META[deckId].label;
    history.replaceState(null, '', '#' + deckId);
    showSlide(0);
  }

  function showSlide(n) {
    if (!slides.length) return;
    slides[currentSlide]?.classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    progress.style.width = ((currentSlide + 1) / slides.length * 100) + '%';
    const prefix = currentDeck === 'mk1' ? 'МК №1' : 'МК №2';
    counter.textContent = prefix + ' · ' + (currentSlide + 1) + ' / ' + slides.length;
  }

  function next() {
    if (!currentDeck) return;
    showSlide(currentSlide + 1);
  }

  function prev() {
    if (!currentDeck) return;
    showSlide(currentSlide - 1);
  }

  document.querySelectorAll('.home-card').forEach(btn => {
    btn.addEventListener('click', () => openDeck(btn.dataset.deck));
  });

  document.getElementById('btn-home').addEventListener('click', showHome);
  document.getElementById('btn-next').addEventListener('click', next);
  document.getElementById('btn-prev').addEventListener('click', prev);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { showHome(); return; }
    if (!currentDeck) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') prev();
  });

  function initFromHash() {
    const hash = location.hash.slice(1);
    if (hash === 'mk1' || hash === 'mk2') openDeck(hash);
    else showHome();
  }

  fillPrompts();
  initFromHash();
  window.addEventListener('hashchange', initFromHash);
})();
