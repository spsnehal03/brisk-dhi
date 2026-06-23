/* ============================================================
   main.js — Vanilla JS Entry Point
   No dependencies | Production-ready
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   DOMContentLoaded — safe init
   ------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initMobileNav();
  initScrollSpy();
  initSmoothScroll();
  initServicesToggle();
  initScrollAnimations();
});


/* ------------------------------------------------------------
   Dynamic copyright year
   ------------------------------------------------------------ */
function initYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ------------------------------------------------------------
   Mobile nav toggle
   ------------------------------------------------------------ */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close nav when a link is clicked
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}


/* ------------------------------------------------------------
   Scroll spy — highlight active nav link
   ------------------------------------------------------------ */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('#nav-menu a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}


/* ------------------------------------------------------------
   Smooth scroll (fallback for older browsers)
   ------------------------------------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}


/* ------------------------------------------------------------
   Utility: debounce
   ------------------------------------------------------------ */
function debounce(fn, delay = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


/* ------------------------------------------------------------
   Utility: throttle
   ------------------------------------------------------------ */
function throttle(fn, limit = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      fn(...args);
    }
  };
}


/* ------------------------------------------------------------
   Services toggle
   ------------------------------------------------------------ */
function initServicesToggle() {
  const buttons = document.querySelectorAll('.service-more');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent row click from triggering double toggle
      const parentRight = button.closest('.service-right');
      if (!parentRight) return;
      const isActive = parentRight.classList.contains('active');
      if (isActive) {
        parentRight.classList.remove('active');
        button.textContent = 'Show More';
        button.setAttribute('aria-expanded', 'false');
      } else {
        parentRight.classList.add('active');
        button.textContent = 'Show Less';
        button.setAttribute('aria-expanded', 'true');
        // Trigger animation
        parentRight.style.animation = 'none';
        parentRight.offsetHeight; // trigger reflow
        parentRight.style.animation = 'slideInFromLeft 0.5s ease-out forwards';
      }
    });
  });

  const rows = document.querySelectorAll('.service-row');
  rows.forEach(row => {
    row.addEventListener('click', () => {
      const parentRight = row.querySelector('.service-right');
      const button = row.querySelector('.service-more');
      if (!parentRight || !button) return;
      const isActive = parentRight.classList.contains('active');
      if (!isActive) {
        parentRight.classList.add('active');
        button.textContent = 'Show Less';
        button.setAttribute('aria-expanded', 'true');
        // Trigger animation
        parentRight.style.animation = 'none';
        parentRight.offsetHeight; // trigger reflow
        parentRight.style.animation = 'slideInFromLeft 0.5s ease-out forwards';
      }
    });
  });
}

function initScrollAnimations() {
  // Services scroll animation
  const sHeader = document.querySelector('.services-header');
  if (sHeader) {
    sHeader.style.opacity = '0';
    const sObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sHeader.style.opacity = '0';
          sHeader.offsetHeight; // trigger reflow
          sHeader.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
          sObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    const sSection = document.querySelector('#services');
    if (sSection) sObserver.observe(sSection);
  }

  // About scroll animation
  const aColLeft = document.querySelector('.about-col-left');
  if (aColLeft) {
    aColLeft.style.opacity = '0';
    const aObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aColLeft.style.opacity = '0';
          aColLeft.offsetHeight; // trigger reflow
          aColLeft.style.animation = 'slideInFromLeft 0.8s ease-out forwards';
          aObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    const aSection = document.querySelector('#about');
    if (aSection) aObserver.observe(aSection);
  }
}
