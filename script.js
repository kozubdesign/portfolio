(function () {
  'use strict';

  var stick = document.getElementById('stick');
  var navLinks = document.querySelectorAll('.stick nav a, header.top nav a');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var ticking = false;

  /* Подсветка пункта меню по текущей секции */
  function updateNav() {
    var current = '';
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 120) current = s.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = 'contact';
    }
    Array.prototype.forEach.call(navLinks, function (a) {
      a.setAttribute('aria-current', a.getAttribute('href') === '#' + current ? 'true' : 'false');
    });
  }

  /* Закреплённая панель появляется после прокрутки */
  function onScroll() {
    if (stick) stick.classList.toggle('on', window.scrollY > 360);
    updateNav();
    ticking = false;
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(onScroll);
    } else {
      onScroll();
    }
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* Перед печатью: загрузить все картинки и показать все блоки */
  window.addEventListener('beforeprint', function () {
    Array.prototype.forEach.call(document.querySelectorAll('img[loading="lazy"]'), function (img) {
      img.loading = 'eager';
    });
    Array.prototype.forEach.call(document.querySelectorAll('.rv'), function (el) {
      el.classList.add('in');
    });
  });

  /* Плавное появление блоков при прокрутке */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduceMotion) return;

  var items = document.querySelectorAll(
    'main section>h2, .band>h2, .about>div, .jobs li, .skills>div, .case, .gallery img, .contact>*'
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  Array.prototype.forEach.call(items, function (el) {
    /* блоки с классом no-anim показываются сразу */
    if (el.classList.contains('no-anim')) return;
    /* картинки галереи появляются с небольшой задержкой по колонкам */
    if (el.parentNode.classList.contains('gallery')) {
      var index = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', (index % 3) * 0.12 + 's');
    }
    el.classList.add('rv');
    observer.observe(el);
  });
})();
