/* Bidar Falcon's — main.js */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. SCROLL PROGRESS */
  const sp = document.getElementById('sp');
  const updateSP = () => {
    if (sp) sp.style.width = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100, 100) + '%';
  };
  window.addEventListener('scroll', updateSP, { passive: true });

  /* 2. STICKY NAV */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav && nav.classList.toggle('on', window.scrollY > 30), { passive: true });

  /* 3. MOBILE MENU */
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobNav');
  if (ham && mob) {
    ham.addEventListener('click', e => { e.stopPropagation(); ham.classList.toggle('on'); mob.classList.toggle('on'); });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { ham.classList.remove('on'); mob.classList.remove('on'); }));
    document.addEventListener('click', e => { if (!nav.contains(e.target)) { ham.classList.remove('on'); mob.classList.remove('on'); } });
  }

  /* 4. SCROLL REVEAL */
  const ro = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('r'); ro.unobserve(e.target); } }), { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.sr,.sr-rx,.sr-left,.sr-scale').forEach(el => ro.observe(el));

  /* 5. COUNT-UP */
  function cu(el, to, sfx, dur) {
    dur = dur || 1300; const s = performance.now();
    const step = now => { const t = Math.min((now - s) / dur, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3))) + sfx; if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  /* Hero metrics on load */
  setTimeout(() => { document.querySelectorAll('.mnum[data-n]').forEach(el => cu(el, +el.dataset.n, '', 1400)); }, 700);

  /* 6. TESTIMONIALS */
  const track = document.getElementById('tt'); const dots = document.querySelectorAll('.tdot');
  const prev = document.getElementById('tprev'); const next = document.getElementById('tnext');
  let idx = 0; let auto;
  const vis = () => window.innerWidth < 700 ? 1 : window.innerWidth < 960 ? 2 : 3;
  const maxI = () => Math.max(0, track.children.length - vis());
  const go = i => {
    if (!track) return; idx = Math.max(0, Math.min(i, maxI()));
    const w = track.children[0].offsetWidth + 18;
    track.style.transform = `translateX(-${idx * w}px)`;
    dots.forEach((d, j) => d.classList.toggle('on', j === idx));
  };
  if (prev) prev.addEventListener('click', () => go(idx - 1));
  if (next) next.addEventListener('click', () => go(idx + 1));
  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
  const sa = () => { auto = setInterval(() => go(idx >= maxI() ? 0 : idx + 1), 4500); };
  const sl = () => clearInterval(auto); sa();
  if (track) {
    track.addEventListener('mouseenter', sl); track.addEventListener('mouseleave', sa);
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => { const d = tx - e.changedTouches[0].clientX; if (Math.abs(d) > 44) go(d > 0 ? idx + 1 : idx - 1); });
  }
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => go(0), 220); });

  /* 7. PROJECT CARDS 3D TILT (desktop only) */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.pcard').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.transition = 'transform .08s,box-shadow .3s,border-color .3s';
        c.style.transform = `translateY(-5px) rotateX(${-(e.clientY - r.top) / r.height * 6 - 3}deg) rotateY(${(e.clientX - r.left) / r.width * 6 - 3}deg)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transition = 'transform .4s,box-shadow .3s,border-color .3s'; c.style.transform = ''; });
    });
  }

  /* 8. ACTIVE NAV */
  const navAs = document.querySelectorAll('.nlinks a:not(.ncta)');
  const secs = document.querySelectorAll('section[id]');
  const nao = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const id = e.target.id; navAs.forEach(a => { const on = a.getAttribute('href') === '#' + id; a.style.color = on ? 'var(--blue)' : ''; a.style.background = on ? 'var(--blue-pale)' : ''; }); } }), { threshold: 0.4 });
  secs.forEach(s => nao.observe(s));

  /* 9. CONTACT FORM */
  window.handleForm = e => {
    e.preventDefault();
    const b = document.getElementById('fbtn'); if (!b) return;
    b.textContent = 'Sending…'; b.disabled = true; b.style.opacity = '.7';
    setTimeout(() => {
      b.textContent = '✓ Message Sent!'; b.style.opacity = '1'; b.style.background = '#16A34A';
      document.getElementById('cform').reset();
      setTimeout(() => { b.textContent = 'Send Message'; b.style.background = ''; b.disabled = false; }, 3200);
    }, 1500);
  };

});
