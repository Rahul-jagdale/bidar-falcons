/* ═══════════════════════════════════════════════════════
   Bidar Falcon's — main.js
   Scroll animations, nav, testimonials, counter, form
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     1. SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });


  /* ─────────────────────────────────────────────
     2. STICKY NAVBAR — add shadow on scroll
  ───────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });


  /* ─────────────────────────────────────────────
     3. MOBILE MENU TOGGLE
  ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });


  /* ─────────────────────────────────────────────
     4. SCROLL REVEAL ANIMATIONS
     Uses IntersectionObserver on .scroll-reveal
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.scroll-reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.08,
      rootMargin: '0px 0px -48px 0px'
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────
     5. HERO METRICS COUNT-UP (page load)
  ───────────────────────────────────────────── */
  function countUp(el, target, suffix, duration = 1400) {
    const start     = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = Math.round(start + (target - start) * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  // Hero metrics (runs after short delay so page feels loaded)
  setTimeout(() => {
    document.querySelectorAll('.metric-num[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      countUp(el, target, '', 1400);
    });
  }, 700);


  /* ─────────────────────────────────────────────
     6. STATS SECTION COUNT-UP (on scroll into view)
  ───────────────────────────────────────────── */
  const statEls = document.querySelectorAll('.stat-num[data-target]');

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          countUp(el, target, suffix, 1200);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach(el => statObserver.observe(el));


  /* ─────────────────────────────────────────────
     7. TESTIMONIALS SLIDER
  ───────────────────────────────────────────── */
  const track    = document.getElementById('testiTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dots     = document.querySelectorAll('.tdot');
  let   current  = 0;
  let   autoPlay;

  function getVisible() {
    if (window.innerWidth <= 768)  return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMax() {
    return track.children.length - getVisible();
  }

  function goTo(idx) {
    const max  = getMax();
    current    = Math.max(0, Math.min(idx, max));
    const card = track.children[0];
    if (!card) return;
    const gap  = 20;
    const w    = card.offsetWidth + gap;
    track.style.transform = `translateX(-${current * w}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(parseInt(dot.dataset.idx, 10)));
  });

  function startAuto() {
    autoPlay = setInterval(() => {
      goTo(current >= getMax() ? 0 : current + 1);
    }, 4500);
  }

  function stopAuto() { clearInterval(autoPlay); }

  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Recalculate on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goTo(0), 200);
  });

  // Touch swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });


  /* ─────────────────────────────────────────────
     8. ACTIVE NAV LINK on scroll (highlight)
  ───────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.style.color = '';
            if (a.getAttribute('href') === `#${id}` && !a.classList.contains('nav-cta')) {
              a.style.color = 'var(--primary)';
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  /* ─────────────────────────────────────────────
     9. CONTACT FORM SUBMIT
  ───────────────────────────────────────────── */
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const btn = document.getElementById('formBtn');
    if (!btn) return;

    // Button loading state
    btn.textContent = 'Sending…';
    btn.disabled    = true;
    btn.style.opacity = '0.75';

    setTimeout(() => {
      btn.textContent     = '✓ Message Sent!';
      btn.style.opacity   = '1';
      btn.style.background = '#16A34A';

      // Reset form
      document.getElementById('contactForm').reset();

      setTimeout(() => {
        btn.textContent     = 'Send Message';
        btn.style.background = '';
        btn.disabled        = false;
      }, 3200);
    }, 1500);
  };


  /* ─────────────────────────────────────────────
     10. SMOOTH ACTIVE STATE on nav links (click)
  ───────────────────────────────────────────── */
  navAnchors.forEach(a => {
    a.addEventListener('click', function() {
      if (this.classList.contains('nav-cta')) return;
      navAnchors.forEach(x => { if (!x.classList.contains('nav-cta')) x.style.color = ''; });
      this.style.color = 'var(--primary)';
    });
  });


  /* ─────────────────────────────────────────────
     11. PROJECT CARDS — animated entry with
         staggered delays
  ───────────────────────────────────────────── */
  // Already handled by .scroll-reveal in CSS/observer above.
  // Extra: add a subtle tilt on mouse move for project cards.

  const projCards = document.querySelectorAll('.project-card');

  projCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width  - 0.5;
      const y      = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        translateY(-6px)
        rotateX(${-y * 4}deg)
        rotateY(${x * 4}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s';
    });
  });


  /* ─────────────────────────────────────────────
     12. SCROLL-TRIGGERED COUNTER for hero metrics
         (re-trigger if already in view on load)
  ───────────────────────────────────────────── */
  const heroMetricsSection = document.querySelector('.hero-metrics');
  if (heroMetricsSection) {
    const metricsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.metric-num[data-count]').forEach(el => {
              const target = parseInt(el.dataset.count, 10);
              countUp(el, target, '', 1200);
            });
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    metricsObserver.observe(heroMetricsSection);
  }


  /* ─────────────────────────────────────────────
     13. SERVICE CARDS hover — ripple accent bar
         Already handled in CSS with ::after
         Just ensure pointer style
  ───────────────────────────────────────────── */
  document.querySelectorAll('.service-card').forEach(card => {
    card.style.cursor = 'default';
  });

}); // end DOMContentLoaded
