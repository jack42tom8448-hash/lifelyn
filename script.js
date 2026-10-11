/* =========================================================
   Birthday site — shared interactions
   Edit CONFIG below, then everything else just works.
   ========================================================= */
(() => {
  'use strict';

  /* ✏️ PERSONALIZE HERE ------------------------------------ */
  const CONFIG = {
    herName: 'Mrs.Mwangi',     // e.g. 'Sophia'
    yourName: 'Mwangi',   // e.g. 'Daniel'
    musicFile: 'assets/audio/music.mp3' // optional: drop a song here (see README)
  };
  /* -------------------------------------------------------- */

  const root = document.documentElement;
  root.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- Names ---------- */
  document.querySelectorAll('.her-name').forEach((el) => { el.textContent = CONFIG.herName; });
  document.querySelectorAll('.your-name').forEach((el) => { el.textContent = CONFIG.yourName; });
  document.title = document.title.replace('[Her Name]', CONFIG.herName);

  /* ---------- Floating petals & hearts ---------- */
  function initPetals() {
    const wrap = document.getElementById('petals');
    if (!wrap || reduceMotion) return;
    const tones = ['#D89A9E', '#F4D7D7', '#B04A5A', '#E7B3B6', '#C9737F'];
    const count = window.innerWidth < 600 ? 16 : 28;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const isHeart = Math.random() < 0.28;
      p.className = 'petal' + (isHeart ? ' heart' : '');
      if (isHeart) p.textContent = '♥';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.setProperty('--size', (isHeart ? 10 + Math.random() * 12 : 10 + Math.random() * 14) + 'px');
      p.style.setProperty('--tone', tones[Math.floor(Math.random() * tones.length)]);
      p.style.setProperty('--alpha', (0.45 + Math.random() * 0.45).toFixed(2));
      p.style.setProperty('--dur', (12 + Math.random() * 12).toFixed(1) + 's');
      p.style.setProperty('--delay', (-Math.random() * 24).toFixed(1) + 's');
      p.style.setProperty('--drift', (Math.random() * 120 - 60).toFixed(0) + 'px');
      wrap.appendChild(p);
    }
  }

  /* ---------- Confetti ---------- */
  const palette = ['#D89A9E', '#F4D7D7', '#B04A5A', '#FFF6F4', '#E7B3B6', '#C9737F'];
  let heartShape = null;
  try {
    if (window.confetti && confetti.shapeFromPath) {
      heartShape = confetti.shapeFromPath({
        path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'
      });
    }
  } catch (e) { heartShape = null; }

  function burst() {
    if (!window.confetti || reduceMotion) return;
    const shapes = heartShape ? [heartShape, 'circle'] : ['circle', 'square'];
    const base = { colors: palette, shapes, scalar: 1.5, ticks: 260, gravity: 0.8, disableForReducedMotion: true };
    confetti({ ...base, particleCount: 70, spread: 80, origin: { x: 0.5, y: 0.65 }, startVelocity: 42 });
    setTimeout(() => confetti({ ...base, particleCount: 40, angle: 60, spread: 60, origin: { x: 0, y: 0.8 } }), 220);
    setTimeout(() => confetti({ ...base, particleCount: 40, angle: 120, spread: 60, origin: { x: 1, y: 0.8 } }), 220);
  }

  /* ---------- Page transitions ---------- */
  function initTransitions() {
    document.querySelectorAll('a[data-transition]').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        const href = a.getAttribute('href');
        document.body.classList.add('is-leaving');
        setTimeout(() => { window.location.href = href; }, reduceMotion ? 0 : 700);
      });
    });
    // Coming back with the browser's Back button
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) document.body.classList.remove('is-leaving');
    });
  }

  /* ---------- Fade in on scroll ---------- */
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

    items.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 90 + 'ms'; // gentle stagger within a row
      io.observe(el);
    });
  }

  /* ---------- Flip cards ---------- */
  function initFlipCards() {
    document.querySelectorAll('.flip-card').forEach((card) => {
      card.addEventListener('click', () => {
        const flipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', String(flipped));
      });
    });
  }

  /* ---------- Typing love note ---------- */
  function initTyping() {
    const target = document.getElementById('typedNote');
    const tpl = document.getElementById('loveNote');
    const card = document.getElementById('letterCard');
    if (!target || !tpl) return;

    const text = tpl.content.textContent.replace(/^\n/, '').replace(/\s+$/, '');
    target.setAttribute('aria-label', text);
    let i = 0, timer = null, started = false, finished = false;

    function finish() {
      clearTimeout(timer);
      target.textContent = text;
      target.classList.remove('is-typing');
      finished = true;
    }
    function step() {
      if (finished) return;
      i++;
      target.textContent = text.slice(0, i);
      if (i >= text.length) { finish(); return; }
      const ch = text[i - 1];
      const pause = /[.!?]/.test(ch) ? 260 : ch === ',' ? 120 : ch === '\n' ? 180 : 0;
      timer = setTimeout(step, 24 + pause);
    }
    function start() {
      if (started) return;
      started = true;
      if (reduceMotion) { finish(); return; }
      target.classList.add('is-typing');
      step();
    }

    if ('IntersectionObserver' in window && !reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { start(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(card || target);
    } else {
      finish();
    }
    // Tap the letter to read it all at once
    if (card) card.addEventListener('click', () => { started = true; finish(); });
  }

  /* ---------- Birthday cake ---------- */
  function initCake() {
    const cake = document.getElementById('cake');
    const btn = document.getElementById('blowBtn');
    const hint = document.getElementById('cakeHint');
    if (!cake || !btn) return;

    let lit = true;
    function toggle() {
      lit = !lit;
      cake.classList.toggle('is-out', !lit);
      if (!lit) {
        btn.innerHTML = 'Light them again 🕯️';
        if (hint) hint.textContent = 'Wish made. I hope every bit of it comes true.';
        burst();
      } else {
        btn.innerHTML = 'Blow out the candles 🕯️';
        if (hint) hint.textContent = 'Close your eyes, then blow out the candles.';
      }
    }
    btn.addEventListener('click', toggle);
    const svg = cake.querySelector('.cake-svg');
    if (svg) svg.addEventListener('click', toggle);
  }

  /* ---------- Music (muted by default) ----------
     Plays assets/audio/music.mp3 if you add one. If there is no file,
     a soft built-in music-box melody plays instead. */
  function initMusic() {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'none';
    audio.src = CONFIG.musicFile;
    audio.addEventListener('loadedmetadata', () => {
      const t = parseFloat(store.get('musicTime'));
      if (t && isFinite(t) && audio.duration) audio.currentTime = t % audio.duration;
    }, { once: true });

    let useSynth = false, ctx = null, master = null, timer = null, step = 0, on = false;
    const melody = [0, 4, 7, 12, 9, 7, 4, 7, 5, 9, 12, 16, 14, 12, 9, 12];
    const bass = [-12, -7, -5, -7];

    function setUI(playing) {
      on = playing;
      btn.classList.toggle('is-playing', playing);
      btn.classList.toggle('is-muted', !playing);
      btn.setAttribute('aria-pressed', String(playing));
      btn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
      store.set('music', playing ? 'on' : 'off');
    }

    function note(semi, when, vol, dur) {
      const f = 261.63 * Math.pow(2, semi / 12);
      [[f, 'triangle', 1], [f * 2, 'sine', 0.35]].forEach(([fr, type, m]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = fr;
        g.gain.setValueAtTime(0.0001, when);
        g.gain.exponentialRampToValueAtTime(vol * m, when + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
        o.connect(g); g.connect(master);
        o.start(when); o.stop(when + dur + 0.05);
      });
    }

    function startSynth() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain(); master.gain.value = 0.8;
      const delay = ctx.createDelay(); delay.delayTime.value = 0.38;
      const fb = ctx.createGain(); fb.gain.value = 0.38;
      const wet = ctx.createGain(); wet.gain.value = 0.4;
      master.connect(ctx.destination);
      master.connect(delay); delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(ctx.destination);
      ctx.resume();

      const stepDur = 0.42;
      let next = ctx.currentTime + 0.05;
      const tick = () => {
        while (next < ctx.currentTime + 1.5) {
          const i = step % melody.length;
          note(melody[i], next, 0.09, 1.8);
          if (i % 8 === 0) note(bass[Math.floor(step / 8) % bass.length], next, 0.07, 3);
          step++; next += stepDur;
        }
      };
      tick();
      timer = setInterval(tick, 250);
      return true;
    }
    function stopSynth() {
      clearInterval(timer); timer = null;
      if (ctx) { ctx.close(); ctx = null; }
    }

    async function play() {
      if (!useSynth) {
        try { await audio.play(); setUI(true); return true; }
        catch (err) {
          if (err && err.name === 'NotAllowedError') { setUI(false); return false; }
          useSynth = true; // no audio file found, use the built-in melody
        }
      }
      const ok = startSynth();
      setUI(ok);
      return ok;
    }
    function pause() {
      if (useSynth) stopSynth(); else audio.pause();
      setUI(false);
    }

    btn.addEventListener('click', () => { on ? pause() : play(); });

    // Keep the song going from page 1 to page 2 if she turned it on
    window.addEventListener('pagehide', () => {
      if (!useSynth && on) store.set('musicTime', String(audio.currentTime));
    });
    if (store.get('music') === 'on') {
      play().then((ok) => {
        if (!ok) { // browser blocked autoplay: resume on her first tap
          document.addEventListener('pointerdown', (e) => {
            if (btn.contains(e.target)) return;
            if (store.get('music') !== 'off') play();
          }, { once: true });
          store.set('music', 'on');
        }
      });
    }
  }

  /* ---------- Birthday page extras ---------- */
  function initBirthdayPage() {
    if (!document.body.classList.contains('page-birthday')) return;
    initFlipCards();
    initTyping();
    initCake();
    const celebrate = document.getElementById('celebrateBtn');
    if (celebrate) celebrate.addEventListener('click', burst);
    // A welcome burst once the page has faded in
    setTimeout(burst, 1400);
  }

  /* ---------- Go ---------- */
  initPetals();
  initTransitions();
  initReveal();
  initMusic();
  initBirthdayPage();
})();
