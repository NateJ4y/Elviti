/* Elviti Works interactions: no frameworks or animation dependencies */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preloader = document.querySelector('[data-preloader]');

  if (preloader) {
    preloader.hidden = false;
    requestAnimationFrame(() => preloader.classList.add('is-visible'));
    const startedAt = performance.now();
    let dismissed = false;
    const dismissLoader = () => {
      if (dismissed) return;
      dismissed = true;
      const wait = Math.max(0, 220 - (performance.now() - startedAt));
      window.setTimeout(() => {
        preloader.classList.add('is-done');
        document.documentElement.classList.add('page-ready');
        window.setTimeout(() => preloader.remove(), 320);
      }, wait);
    };
    if (document.readyState === 'complete') {
      dismissLoader();
    } else {
      window.addEventListener('load', dismissLoader, { once: true });
      window.setTimeout(dismissLoader, 1400);
    }
  }

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    }, { passive: true });
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* Compact scroll reveals using IntersectionObserver; show content if unsupported. */
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  revealItems.forEach((el, index) => {
    if (el.classList.contains('service-card')) {
      const cardIndex = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--reveal-delay', (cardIndex * 75) + 'ms');
    } else if (el.matches('.steps-grid article,.audience-grid article,.credential')) {
      const itemIndex = [...el.parentElement.children].indexOf(el);
      el.style.setProperty('--reveal-delay', (itemIndex * 75) + 'ms');
    }
  });
  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-revealed'));
  }

  /* Hero slider: manual controls, gentle autoplay, pause on focus/hover. */
  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = [...slider.querySelectorAll('[data-slide]')];
    const dots = [...slider.querySelectorAll('[data-slide-to]')];
    const current = slider.querySelector('[data-slide-current]');
    const progress = slider.querySelector('[data-slide-progress]');
    const previous = slider.querySelector('[data-slide-prev]');
    const next = slider.querySelector('[data-slide-next]');
    const pauseButton = slider.querySelector('[data-slide-pause]');
    let activeIndex = 0;
    let timer = 0;
    let userPaused = false;
    let pointerPaused = false;
    let focusPaused = false;
    const interval = 7500;

    const preloadSlideImage = index => {
      const bg = slides[index]?.querySelector('[data-bg]');
      if (!bg || bg.dataset.loaded) return;
      bg.dataset.loaded = 'loading';
      const url = bg.dataset.bg;
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        bg.style.backgroundImage = 'url("' + url + '")';
        bg.dataset.loaded = 'true';
      };
      image.onerror = () => { bg.dataset.loaded = 'error'; };
      image.src = url;
    };

    const stopTimer = () => {
      window.clearTimeout(timer);
      timer = 0;
      if (progress) progress.classList.remove('is-running');
    };
    const shouldAutoplay = () => !reducedMotion && !userPaused && !pointerPaused && !focusPaused && document.visibilityState === 'visible';
    const startTimer = () => {
      stopTimer();
      if (!shouldAutoplay()) return;
      if (progress) {
        void progress.offsetWidth;
        progress.classList.add('is-running');
      }
      timer = window.setTimeout(() => showSlide(activeIndex + 1), interval);
    };

    function showSlide(nextIndex) {
      activeIndex = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const active = i === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, i) => {
        const active = i === activeIndex;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
      preloadSlideImage((activeIndex + 1) % slides.length);
      startTimer();
    }

    previous?.addEventListener('click', () => showSlide(activeIndex - 1));
    next?.addEventListener('click', () => showSlide(activeIndex + 1));
    dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo))));
    pauseButton?.addEventListener('click', () => {
      userPaused = !userPaused;
      pauseButton.textContent = userPaused ? '▶' : 'Ⅱ';
      pauseButton.setAttribute('aria-label', userPaused ? 'Play automatic slides' : 'Pause automatic slides');
      startTimer();
    });
    slider.addEventListener('mouseenter', () => { pointerPaused = true; stopTimer(); });
    slider.addEventListener('mouseleave', () => { pointerPaused = false; startTimer(); });
    slider.addEventListener('focusin', () => { focusPaused = true; stopTimer(); });
    slider.addEventListener('focusout', event => {
      if (!slider.contains(event.relatedTarget)) { focusPaused = false; startTimer(); }
    });
    slider.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(activeIndex - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(activeIndex + 1); }
    });
    document.addEventListener('visibilitychange', startTimer);
    preloadSlideImage(1);
    startTimer();
  }

  /* One lightweight scroll handler updates the sticky header and two decorative parallax layers. */
  const parallaxItems = [...document.querySelectorAll('[data-parallax]')];
  let scrollFrame = 0;
  const updateScrollEffects = () => {
    scrollFrame = 0;
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
    if (reducedMotion || window.innerWidth < 761) return;
    parallaxItems.forEach(el => {
      const slide = el.closest('.hero-slide');
      if (slide && !slide.classList.contains('is-active')) return;
      const section = el.closest('.hero,.portfolio-tease') || el.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -80 || rect.top > window.innerHeight + 80) return;
      const offset = Math.max(-32, Math.min(32, (rect.top / window.innerHeight) * -28));
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.10)';
    });
  };
  const onScroll = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollEffects);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollEffects();

  /* Short overlay handoff between local HTML pages; does not intercept external links or in-page anchors. */
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || !preloader || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target === '_blank' || link.hasAttribute('download')) return;
    let destination;
    try { destination = new URL(link.href, window.location.href); } catch { return; }
    if (destination.origin !== window.location.origin ||
        !destination.pathname.endsWith('.html') ||
        destination.pathname === window.location.pathname) return;
    event.preventDefault();
    preloader.hidden = false;
    preloader.classList.remove('is-done');
    requestAnimationFrame(() => preloader.classList.add('is-visible'));
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = destination.href; }, reducedMotion ? 0 : 160);
  });

  /* Quote form prepares a WhatsApp message; visitor reviews and sends it. */
  const form = document.querySelector('[data-whatsapp-form]');
  const status = document.querySelector('[data-form-status]');
  if (form && status) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const value = (key, fallback = 'Not provided') => {
        const raw = data.get(key);
        return raw && String(raw).trim() ? String(raw).trim() : fallback;
      };
      const message = [
        'Hello Elviti Works, I would like to request a quote.',
        '',
        'Name: ' + value('name', ''),
        'Company / organisation: ' + value('company'),
        'Phone: ' + value('phone', ''),
        'Email: ' + value('email'),
        'Service: ' + value('service', ''),
        'Project location: ' + value('location'),
        'Timing: ' + value('timing'),
        '',
        'Work required:',
        value('details', '')
      ].join('\n');
      const whatsappUrl = 'https://wa.me/27726267179?text=' + encodeURIComponent(message);
      const fallback = document.createElement('a');
      fallback.href = whatsappUrl;
      fallback.target = '_blank';
      fallback.rel = 'noopener noreferrer';
      fallback.textContent = 'Open the prepared WhatsApp message';
      status.replaceChildren(
        document.createTextNode('Your message is ready. If WhatsApp did not open automatically, '),
        fallback,
        document.createTextNode('. Review the details and press Send in WhatsApp.')
      );
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();