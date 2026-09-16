/* AA Quiromasaje Zaragoza — interacciones de la web */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* --- Menú móvil --- */
  function closeNav() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  }

  toggle.addEventListener('click', function () {
    var open = document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeNav();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      closeNav();
      toggle.focus();
    }
  });

  /* --- Cabecera compacta al hacer scroll --- */
  var onScroll = function () {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Aparición progresiva de bloques --- */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      revealer.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* --- Enlace activo según la sección visible --- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('ul a[href^="#"]'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* --- Aviso de cookies (preferencia guardada en el navegador) --- */
  var cookie = document.getElementById('cookie');
  var STORAGE_KEY = 'aaq-cookies';

  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (err) { return 'skip'; }
  }

  function saveChoice(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (err) { /* modo privado */ }
  }

  if (!readChoice()) {
    window.setTimeout(function () { cookie.hidden = false; }, 1200);
  }

  cookie.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cookie]');
    if (!btn) return;
    saveChoice(btn.getAttribute('data-cookie'));
    cookie.hidden = true;
  });

  /* --- Año del pie --- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
