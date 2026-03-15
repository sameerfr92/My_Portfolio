/* ═══════════════════════════════════════════════════
   SAMEER MANUBANSH v3 — PORTFOLIO SCRIPT
   Particles · Typing · Scroll IO · Counters
   Skill bars · Confetti · File drop · Form
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── EmailJS config ─── replace before deploying ── */
  const EJS_KEY = 'YOUR_PUBLIC_KEY';
  const EJS_SVC = 'YOUR_SERVICE_ID';
  const EJS_TPL = 'YOUR_TEMPLATE_ID';

  /* ─────────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof emailjs !== 'undefined') emailjs.init(EJS_KEY);

    initNav();
    initParticles();
    initTyping();
    initReveal();
    initSkillBars();
    initCounters();
    initBTT();
    initForm();
    initFileDrop();
  });

  /* page fade-in */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity .35s ease';
      document.body.style.opacity = '1';
    });
  });

  /* ─────────────────────────────────────────────────
     NAV
  ───────────────────────────────────────────────── */
  function initNav() {
    const nav    = document.getElementById('navbar');
    const burger = document.getElementById('burger');
    const list   = document.getElementById('navLinks');
    const btt    = document.getElementById('btt');

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle('solid', y > 10);
      btt && btt.classList.toggle('show', y > 500);
      highlightNav();
    }

    function highlightNav() {
      const sections = document.querySelectorAll('section[id]');
      const navH = nav.offsetHeight;
      let cur = '';
      sections.forEach(s => { if (window.scrollY + navH + 40 >= s.offsetTop) cur = s.id; });
      document.querySelectorAll('.nl').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
      });
    }

    burger.addEventListener('click', () => {
      const open = list.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    list.querySelectorAll('.nl').forEach(l => l.addEventListener('click', () => {
      list.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }));

    /* Smooth scroll with nav offset */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - nav.offsetHeight, behavior: 'smooth' });
      });
    });
  }

  /* Back to top */
  function initBTT() {
    const btn = document.getElementById('btt');
    if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ─────────────────────────────────────────────────
     PARTICLE CANVAS — nodes + edges
  ───────────────────────────────────────────────── */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const COLORS  = ['rgba(0,212,255,', 'rgba(57,255,20,', 'rgba(0,160,210,'];
    const MAXD    = 125;
    let W, H, pts, raf;

    const count = () => window.innerWidth < 600 ? 35 : 75;

    class Pt {
      constructor() { this.init(); }
      init() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - .5) * .42;
        this.vy = (Math.random() - .5) * .42;
        this.r  = Math.random() * 1.5 + .5;
        this.c  = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.a  = Math.random() * .5 + .18;
      }
    }

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function connect(a, b) {
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d >= MAXD) return;
      ctx.strokeStyle = `rgba(0,212,255,${(1 - d / MAXD) * .2})`;
      ctx.lineWidth = .5;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c + p.a + ')'; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) connect(p, pts[j]);
      });
      raf = requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? cancelAnimationFrame(raf) : frame();
    });

    new ResizeObserver(() => resize()).observe(canvas.parentElement);
    resize();
    pts = Array.from({ length: count() }, () => new Pt());
    frame();

    /* Subtle mouse parallax on hero */
    const hero = document.getElementById('hero');
    const inner = hero?.querySelector('.hero-inner');
    if (hero && inner && window.innerWidth > 768) {
      hero.addEventListener('mousemove', e => {
        const rx = ((e.clientX / window.innerWidth)  - .5) * 8;
        const ry = ((e.clientY / window.innerHeight) - .5) * 8;
        inner.style.transform = `translate(${rx * .33}px, ${ry * .33}px)`;
      });
      hero.addEventListener('mouseleave', () => { inner.style.transform = ''; });
    }
  }

  /* ─────────────────────────────────────────────────
     TYPING EFFECT
  ───────────────────────────────────────────────── */
  function initTyping() {
    const el = document.getElementById('typedText');
    if (!el) return;
    const lines = [
      'Scalable Data Pipelines | Azure Synapse | Databricks | ETL/ELT | Power BI',
      '9+ Years Data Engineering Excellence across 5 Companies',
      'Azure Synapse · SSIS · ADF · ADLS Gen2 · Delta Lake',
      'Turning raw enterprise data into executive-ready intelligence',
      'French speaker · DELF B1 · MSc Data Science (LJMU)',
    ];
    let li = 0, ci = 0, del = false;
    const T = 55, D = 28, P = 2500, G = 380;
    function tick() {
      const s = lines[li];
      el.textContent = s.slice(0, ci);
      if (!del) {
        if (ci < s.length) { ci++; return setTimeout(tick, T); }
        del = true; return setTimeout(tick, P);
      }
      if (ci > 0) { ci--; return setTimeout(tick, D); }
      del = false; li = (li + 1) % lines.length; setTimeout(tick, G);
    }
    setTimeout(tick, 1500);
  }

  /* ─────────────────────────────────────────────────
     SCROLL REVEAL — Intersection Observer
  ───────────────────────────────────────────────── */
  function initReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: .11, rootMargin: '0px 0px -38px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ─────────────────────────────────────────────────
     SKILL BARS
  ───────────────────────────────────────────────── */
  function initSkillBars() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const bar   = e.target;
        const fill  = bar.querySelector('.bar-fill');
        const pct   = bar.dataset.w || '80';
        const card  = bar.closest('.sk');
        const delay = card ? parseInt(card.dataset.d || 0) * 90 : 0;
        setTimeout(() => fill && (fill.style.width = pct + '%'), delay);
        io.unobserve(bar);
      });
    }, { threshold: .45 });
    document.querySelectorAll('.bar').forEach(b => io.observe(b));
  }

  /* ─────────────────────────────────────────────────
     HERO COUNTERS — easeOutExpo
  ───────────────────────────────────────────────── */
  function initCounters() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        roll(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: .6 });
    document.querySelectorAll('.hn[data-target]').forEach(el => io.observe(el));
  }

  function roll(el) {
    const target = parseInt(el.dataset.target);
    const dur = 1300;
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(2, -10 * p);
      el.textContent = Math.round(e * target);
      p < 1 ? requestAnimationFrame(step) : (el.textContent = target);
    };
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────────────
     FILE DRAG & DROP
  ───────────────────────────────────────────────── */
  function initFileDrop() {
    const zone  = document.getElementById('fileZone');
    const input = document.getElementById('fu');
    const lbl   = document.getElementById('fileLabel');
    if (!zone || !input) return;

    ['dragenter','dragover'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('drag-on'); }));
    ['dragleave','drop'].forEach(ev =>
      zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('drag-on'); }));
    zone.addEventListener('drop', e => {
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; showName(e.dataTransfer.files[0].name); }
    });
    input.addEventListener('change', () => {
      if (input.files.length) showName(input.files[0].name);
    });
    function showName(n) { lbl.textContent = '📎 ' + n; }
  }

  /* ─────────────────────────────────────────────────
     CONTACT FORM + EmailJS + Confetti
  ───────────────────────────────────────────────── */
  function initForm() {
    const form   = document.getElementById('contactForm');
    const msgEl  = document.getElementById('formMsg');
    const btn    = document.getElementById('submitBtn');
    const btnTxt = document.getElementById('btnTxt');
    const spin   = document.getElementById('btnSpin');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name  = form.user_name.value.trim();
      const email = form.user_email.value.trim();
      const msg   = form.message.value.trim();

      if (!name || !email || !msg)
        return setMsg('Please fill in all required fields.', 'err');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return setMsg('Please enter a valid email address.', 'err');

      setLoad(true); setMsg('', '');

      try {
        if (typeof emailjs !== 'undefined' && EJS_SVC !== 'YOUR_SERVICE_ID') {
          await emailjs.sendForm(EJS_SVC, EJS_TPL, form);
        } else {
          await wait(1100); /* demo mode */
        }
        setMsg('✓ Message sent! I\'ll respond within 24 hours.', 'ok');
        form.reset();
        const fl = document.getElementById('fileLabel');
        if (fl) fl.textContent = '';
        fireConfetti();
      } catch (err) {
        console.error(err);
        setMsg('Something went wrong. Email me directly at sameerfr@hotmail.com', 'err');
      } finally {
        setLoad(false);
      }
    });

    function setLoad(on) {
      btn.disabled = on;
      btnTxt.classList.toggle('hidden', on);
      spin.classList.toggle('hidden', !on);
    }
    function setMsg(t, c) { msgEl.textContent = t; msgEl.className = 'form-msg ' + c; }
    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  }

  /* ─────────────────────────────────────────────────
     CONFETTI BURST
  ───────────────────────────────────────────────── */
  function fireConfetti() {
    if (typeof confetti === 'undefined') return;
    const colors = ['#00D4FF', '#39FF14', '#ffffff', '#FF6D00'];
    const end = Date.now() + 2000;
    (function burst() {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(burst);
    })();
  }

})();
