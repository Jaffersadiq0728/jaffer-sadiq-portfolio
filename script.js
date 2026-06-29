/* ===================================================================
   JAFFER SADIQ N — PORTFOLIO SCRIPT
   Vanilla JS — no dependencies
=================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  /* ---------------- Footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Scroll progress bar ---------------- */
  var progressBar = document.getElementById('scrollProgressBar');
  var navWrap = document.getElementById('navWrap');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    if (navWrap) navWrap.classList.toggle('is-scrolled', scrollTop > 12);
    if (backToTop) backToTop.classList.toggle('is-visible', scrollTop > 480);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Cursor glow ---------------- */
  var cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && !isCoarsePointer) {
    var rafId = null;
    var targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      cursorGlow.classList.add('is-active');
      if (rafId === null) {
        rafId = requestAnimationFrame(moveGlow);
      }
    });

    document.addEventListener('mouseleave', function () {
      cursorGlow.classList.remove('is-active');
    });

    function moveGlow() {
      cursorGlow.style.transform = 'translate(' + targetX + 'px,' + targetY + 'px) translate(-50%,-50%)';
      rafId = null;
    }
  }

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navMobile.querySelectorAll('.nav-link, .nav-mobile-cta').forEach(function (link) {
      link.addEventListener('click', function () {
        navMobile.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Smooth scroll w/ navbar offset ---------------- */
  var NAV_OFFSET = 96;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - NAV_OFFSET;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- Typing effect (hero role) ---------------- */
  var typedEl = document.getElementById('typedText');
  var roles = [
    'Cybersecurity Analyst',
    'Penetration Tester',
    'AI Security Enthusiast'
  ];

  if (typedEl) {
    if (reduceMotion) {
      typedEl.textContent = roles[0];
    } else {
      var roleIndex = 0, charIndex = 0, deleting = false;
      var TYPE_SPEED = 65, DELETE_SPEED = 35, HOLD_TIME = 1600, GAP_TIME = 400;

      function typeLoop() {
        var current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(typeLoop, HOLD_TIME);
            return;
          }
          setTimeout(typeLoop, TYPE_SPEED);
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeLoop, GAP_TIME);
            return;
          }
          setTimeout(typeLoop, DELETE_SPEED);
        }
      }
      typeLoop();
    }
  }

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  var revealEls = document.querySelectorAll('.reveal, .skill-card');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Stagger reveal delay within groups */
  document.querySelectorAll('.skills-grid, .stat-grid, .certs-grid, .achv-grid, .projects-grid').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
    });
  });

  /* ---------------- Animated counters ---------------- */
  var counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var duration = 1400;
    var start = null;

    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
      return;
    }

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); /* ease-out cubic */
      var value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------------- Contact form (front-end only) ---------------- */
  var form = document.getElementById('contactForm');
  var formHint = document.getElementById('formHint');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('.form-submit');
      var label = submitBtn.querySelector('.btn-label');

      if (!form.checkValidity()) {
        formHint.style.color = '#ff3d81';
        formHint.textContent = 'Please fill in every field before sending.';
        return;
      }

      submitBtn.classList.add('is-loading');
      label.textContent = 'Sending…';

      /*
        NOTE: This form is front-end only — there is no backend wired up.
        To actually deliver messages, connect this form to a service such
        as Formspree, Getform, EmailJS, or a small serverless function,
        then replace this setTimeout block with the real network request.
      */
      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        submitBtn.classList.add('is-success');
        label.textContent = 'Message Sent';
        formHint.style.color = '';
        formHint.textContent = 'Thanks for reaching out — I\'ll get back to you soon.';
        form.reset();

        setTimeout(function () {
          submitBtn.classList.remove('is-success');
          label.textContent = 'Send Message';
        }, 2600);
      }, 900);
    });
  }

})();
