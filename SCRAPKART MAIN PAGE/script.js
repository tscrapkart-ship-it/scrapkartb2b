/* ===================================================================
   ScrapKart Main Page — Interaction Layer
   - Scroll-triggered reveals via IntersectionObserver
   - Stat counter animation
   - Subtle hero parallax
   - Sticky-nav underline on scroll
   ================================================================ */

(function () {
  'use strict';

  // Mark JS-ready immediately so CSS can switch reveal targets to hidden state.
  // (No-JS users see content immediately — the CSS default is visible.)
  document.documentElement.classList.add('js-ready');

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupRevealObserver();
    setupStatCounters();
    setupNavScroll();
    setupHeroParallax();
    setupScrollCueFade();
  }

  // ------------------------------------------------------------------
  // Reveal observer — adds .is-visible to .reveal elements as they enter
  // ------------------------------------------------------------------
  function setupRevealObserver() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) {
      // No IO support — show everything immediately
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // Tiny stagger when multiple reveals enter at once (gives the section a rhythm)
          const delay = Math.min(i * 60, 240);
          setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ------------------------------------------------------------------
  // Stat counters — animate from 0 to target on scroll-in
  // ------------------------------------------------------------------
  function setupStatCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const formatINR = new Intl.NumberFormat('en-IN');

    function formatValue(value, target) {
      // Money values (>= 1 crore): show as ₹X.X Cr+
      if (target >= 10000000) {
        const cr = (value / 10000000);
        return cr >= 1
          ? cr.toFixed(cr >= 10 ? 0 : 1) + ' Cr'
          : formatINR.format(Math.round(value));
      }
      // Lakh range
      if (target >= 100000) {
        const l = (value / 100000);
        return l.toFixed(l >= 10 ? 0 : 1) + ' L';
      }
      // Plain integer
      return formatINR.format(Math.round(value));
    }

    function animate(el) {
      const target = parseFloat(el.dataset.target) || 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const value = target * eased;
        el.textContent = prefix + formatValue(value, target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = prefix + formatValue(target, target) + suffix;
        }
      }

      requestAnimationFrame(tick);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  // ------------------------------------------------------------------
  // Sticky nav — fade in the bottom hairline once scrolled
  // ------------------------------------------------------------------
  function setupNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        if (window.scrollY > 40) nav.classList.add('is-scrolled');
        else nav.classList.remove('is-scrolled');
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ------------------------------------------------------------------
  // Hero parallax — translate hero-aside image as user scrolls past
  // ------------------------------------------------------------------
  function setupHeroParallax() {
    const aside = document.getElementById('hero-aside');
    if (!aside) return;

    // Skip on touch devices / when reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(max-width: 1023px)').matches) return;

    const img = aside.querySelector('img');
    if (!img) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const rect = aside.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // Compute progress (0 to 1) as the aside passes through the viewport
        const progress = Math.max(0, Math.min(1, 1 - rect.bottom / (vh + rect.height)));
        const translateY = progress * -24; // pixels
        img.style.transform = 'translateY(' + translateY.toFixed(2) + 'px) scale(1.04)';
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ------------------------------------------------------------------
  // Scroll-cue — fade out as user scrolls
  // ------------------------------------------------------------------
  function setupScrollCueFade() {
    const cue = document.getElementById('scroll-cue');
    if (!cue) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const opacity = Math.max(0, 1 - window.scrollY / 240);
        cue.style.opacity = opacity.toFixed(2);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
