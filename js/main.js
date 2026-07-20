/* ═══════════════════════════════════════════════
   BSPL — MAIN JAVASCRIPT
   js/main.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   0. Scroll Progress Bar & Floating Back to Top
──────────────────────────────────────────────── */
const progressBar = document.getElementById('scroll-progress-bar');
const backToTopBtn = document.getElementById('scroll-to-top-btn');

function updateScrollUI() {
  const scroll = window.scrollY;
  const limit = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar && limit > 0) {
    progressBar.style.width = `${(scroll / limit) * 100}%`;
  }
  if (backToTopBtn) {
    if (scroll > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ────────────────────────────────────────────────
   1. Sticky nav scroll state
──────────────────────────────────────────────── */
const nav = document.getElementById('site-nav');
const SCROLL_THRESHOLD = 20;

function onNavScroll() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', onNavScroll, { passive: true });
onNavScroll();

/* ────────────────────────────────────────────────
   2. Mobile menu toggle
──────────────────────────────────────────────── */
const hamburger  = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const overlay    = document.getElementById('mobile-overlay');
const closeBtn   = document.getElementById('mobile-close');

function openMenu() {
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

hamburger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Close on mobile nav link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Escape key closes menu
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

/* ────────────────────────────────────────────────
   3. Scroll reveal — IntersectionObserver
──────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ────────────────────────────────────────────────
   4. Counter animation
──────────────────────────────────────────────── */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isFloat
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target);

    el.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
    }
  }
  requestAnimationFrame(tick);
}

// Hero data strip counters
const heroCounters = document.querySelectorAll('.data-number[data-target]');
// Why section counters
const whyCounters  = document.querySelectorAll('.counter[data-target]');
const allCounters  = [...heroCounters, ...whyCounters];

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

allCounters.forEach(el => counterObserver.observe(el));

/* ────────────────────────────────────────────────
   5. Smooth scroll for anchor links
──────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // nav height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ────────────────────────────────────────────────
   6. Active nav link on scroll
──────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('nav-link-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-link-active');
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ────────────────────────────────────────────────
   7. Vertical card — subtle parallax tilt on hover
──────────────────────────────────────────────── */
const tiltCards = document.querySelectorAll('.why-card, .tech-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${y * -4}deg) rotateY(${x * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ────────────────────────────────────────────────
   8. Reduce motion check
──────────────────────────────────────────────── */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.matches) {
  // Immediately show all reveal elements
  revealEls.forEach(el => el.classList.add('is-visible'));
}

console.log('%cBharat Biosense Pvt. Ltd.', 'color:#0D9488;font-family:Syne,sans-serif;font-size:1.2rem;font-weight:800;');
console.log('%cBio-Intelligence for Sustainability & Precision Medicine', 'color:#475569;font-size:0.8rem;');
