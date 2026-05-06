/* ===================================================================
   ScrapKart Main Page — Interaction Layer
   - Splash dismiss
   - Lenis smooth scroll
   - Top scroll progress bar
   - Scroll-triggered reveals via IntersectionObserver
   - Stat counter animation
   - World-card cursor spotlight
   - Watermark scroll drift
   - Live-time updater + slow live-bid ticker
   - Sticky-nav hairline on scroll, scroll cue fade
   ================================================================ */

(function () {
  'use strict';

  // Mark JS-ready immediately so CSS can switch reveal targets to the hidden state.
  document.documentElement.classList.add('js-ready');

  // Hand-off splash early — even before DOMContentLoaded, schedule dismissal.
  scheduleSplashDismiss();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupLenis();
    setupRevealObserver();
    setupStatCounters();
    setupScrollProgress();
    setupNavScroll();
    setupScrollCueFade();
    setupLiveTime();
    setupLiveBidTicker();
    setupAnchorScroll();
    setupCardSpotlight();
    setupWatermarkDrift();
  }

  // ------------------------------------------------------------------
  // Splash — first visit per session, dismiss after a beat
  // ------------------------------------------------------------------
  function scheduleSplashDismiss() {
    // splash-skip is set by the inline script in <head> on repeat visits
    if (document.documentElement.classList.contains('splash-skip')) return;

    // Total splash duration ≈ bar-fill (1.05s) + a touch of dwell time
    const totalMs = 1500;
    setTimeout(function () {
      document.documentElement.classList.add('splash-done');
      // After the lift animation finishes, remove the splash node
      setTimeout(function () {
        const el = document.getElementById('splash');
        if (el && el.parentNode) el.parentNode.removeChild(el);
      }, 800);
    }, totalMs);
  }

  // ------------------------------------------------------------------
  // Lenis smooth scroll
  // ------------------------------------------------------------------
  let lenisInstance = null;

  function setupLenis() {
    if (typeof window.Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    lenisInstance = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return 1 - Math.pow(1 - t, 3); },
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      if (lenisInstance) lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ------------------------------------------------------------------
  // In-page anchor links — route through Lenis when available
  // ------------------------------------------------------------------
  function setupAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const isTop = href === '#top';
        const target = isTop ? null : document.querySelector(href);
        if (!isTop && !target) return;

        e.preventDefault();

        if (lenisInstance) {
          lenisInstance.scrollTo(isTop ? 0 : target, { offset: -80 });
        } else if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // ------------------------------------------------------------------
  // Top scroll progress bar
  // ------------------------------------------------------------------
  function setupScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        bar.style.width = progress.toFixed(2) + '%';
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ------------------------------------------------------------------
  // Reveal observer — adds .is-visible to .reveal elements as they enter
  // ------------------------------------------------------------------
  function setupRevealObserver() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
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
      if (target >= 10000000) {
        const cr = value / 10000000;
        return cr >= 1
          ? cr.toFixed(cr >= 10 ? 0 : 1) + ' Cr'
          : formatINR.format(Math.round(value));
      }
      if (target >= 100000) {
        const l = value / 100000;
        return l.toFixed(l >= 10 ? 0 : 1) + ' L';
      }
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
  // Scroll cue — fade out as user scrolls past the hero
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

  // ------------------------------------------------------------------
  // Live-time updater — hero aside card "11:32 IST" timestamp
  // ------------------------------------------------------------------
  function setupLiveTime() {
    const el = document.getElementById('live-time');
    if (!el) return;

    function update() {
      const now = new Date();
      const ist = new Date(
        now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
      );
      const hh = String(ist.getHours()).padStart(2, '0');
      const mm = String(ist.getMinutes()).padStart(2, '0');
      el.textContent = hh + ':' + mm + ' IST';
    }

    update();
    setInterval(update, 30000);
  }

  // ------------------------------------------------------------------
  // Live-bid ticker — slowly increment to feel "active"
  // ------------------------------------------------------------------
  function setupLiveBidTicker() {
    const el = document.querySelector('[data-live-bid]');
    if (!el) return;

    let value = parseFloat(el.dataset.liveBid) || 47.2;

    function bump() {
      // Tiny realistic increments — 0.05 to 0.35 lakh per tick
      value += 0.05 + Math.random() * 0.30;
      el.textContent = '₹' + value.toFixed(1) + ' L';
    }

    // Random interval between 6-14 seconds, feels organic not metronomic
    function schedule() {
      const wait = 6000 + Math.random() * 8000;
      setTimeout(function () { bump(); schedule(); }, wait);
    }

    schedule();
  }

  // ------------------------------------------------------------------
  // World card spotlight — radial gradient that follows the cursor
  // ------------------------------------------------------------------
  function setupCardSpotlight() {
    if (window.matchMedia('(hover: none)').matches) return; // skip on touch

    const cards = document.querySelectorAll('.world-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  // ------------------------------------------------------------------
  // Watermark drift — subtle vertical translate based on scroll position
  // ------------------------------------------------------------------
  function setupWatermarkDrift() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const watermarks = document.querySelectorAll(
      '.world-decoration, .hero-aside-watermark'
    );
    if (!watermarks.length) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        watermarks.forEach(function (el) {
          const rect = el.getBoundingClientRect();
          // Distance from center of viewport to center of element, normalized
          const elCenter = rect.top + rect.height / 2;
          const vpCenter = vh / 2;
          const offset = (elCenter - vpCenter) / vh;     // -1 .. 1 ish
          const drift = -offset * 28;                    // up to ~28px shift
          el.style.setProperty('--drift', drift.toFixed(2) + 'px');
        });
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
