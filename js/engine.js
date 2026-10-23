/* ==========================================================
   Aventura do Tuca — Motor do jogo
   - utilidades
   - efeitos visuais (confete, estrelinhas, mãozinha de dica)
   - as 4 mecânicas: múltipla escolha, arrastar e soltar,
     ligar pares e jogo da memória
   ========================================================== */
(function () {
  'use strict';

  /* ---------------- Utilidades ---------------- */
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }
  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function center(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function restartAnim(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth; // força reflow para reiniciar a animação
    el.classList.add(cls);
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Confete ---------------- */
  var Confetti = (function () {
    var canvas, ctx, parts = [], running = false, W = 0, H = 0, dpr = 1;
    var COLORS = ['#EF476F', '#FFD60A', '#06D6A0', '#118AB2', '#9B5DE5', '#FF8C1A', '#4CC9F0'];
    function setup() {
      if (canvas) return;
      canvas = document.getElementById('confetti');
      if (!canvas) return;
      ctx = canvas.getContext('2d');
      resize();
      window.addEventListener('resize', resize);
    }
    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function add(x, y, vx, vy) {
      parts.push({
        x: x, y: y, vx: vx, vy: vy, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
        w: 7 + Math.random() * 7, h: 4 + Math.random() * 6, c: pick(COLORS), life: 0,
        round: Math.random() < .3
      });
    }
    function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var i = parts.length - 1; i >= 0; i--) {
        var p = parts[i];
        p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
        if (p.y > H + 30 || p.life > 400) { parts.splice(i, 1); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    function start() { if (!running) { running = true; requestAnimationFrame(loop); } }
    return {
      burst: function (x, y, n) {
        if (reduceMotion) return;
        setup(); if (!ctx) return;
        n = n || 40;
        for (var i = 0; i < n; i++) {
          var a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 7;
          add(x, y, Math.cos(a) * s, Math.sin(a) * s - 5);
        }
        start();
      },
      rain: function (ms) {
        if (reduceMotion) return;
        setup(); if (!ctx) return;
        var end = Date.now() + (ms || 2500);
        (function drop() {
          for (var i = 0; i < 6; i++) add(Math.random() * W, -20, (Math.random() - .5) * 3, 2 + Math.random() * 3);
          start();
          if (Date.now() < end) setTimeout(drop, 60);
        })();
      }
    };
  })();

  /* ---------------- Estrelinhas saindo de um elemento ---------------- */
  function sparkle(el) {
    if (!el || reduceMotion) return;
    var c = center(el);
    var glyphs = ['⭐', '✨', '🌟'];
    for (var i = 0; i < 6; i++) {
      var s = h('span', 'sparkle', pick(glyphs));
      s.style.left = c.x + 'px'; s.style.top = c.y + 'px';
      var a = (Math.PI * 2 * i) / 6, d = 70 + Math.random() * 40;
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      document.body.appendChild(s);
      (function (node) { setTimeout(function () { node.remove(); }, 900); })(s);
    }
  }

  /* ---------------- Mãozinha de dica (mostra o gesto) ---------------- */
  function handHint(fromEl, toEl, container) {
    if (!fromEl || !toEl || !container) return function () {};
    var hand = h('div', 'hand-hint', '👆');
    container.appendChild(hand);
    var anim = null, stopped = false;
    function stop() {
      if (stopped) return; stopped = true;
      if (anim) anim.cancel();
      hand.remove();
      container.removeEventListener('pointerdown', stop, true);
    }
    container.addEventListener('pointerdown', stop, true);
    // espera o layout estabilizar
    setTimeout(function () {
      if (stopped || !hand.isConnected) return;
      var cr = container.getBoundingClientRect();
      var a = center(fromEl), b = center(toEl);
      var x1 = a.x - cr.left, y1 = a.y - cr.top, x2 = b.x - cr.left, y2 = b.y - cr.top;
      if (!hand.animate) { stop(); return; }
      anim = hand.animate([
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(1)', opacity: 0 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(1)', opacity: 1, offset: .15 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.85)', opacity: 1, offset: .3 },
        { transform: 'translate(' + x2 + 'px,' + y2 + 'px) scale(.85)', opacity: 1, offset: .8 },
        { transform: 'translate(' + x2 + 'px,' + y2 + 'px) scale(1)', opacity: 0 }
      ], { duration: 2200, iterations: 2, easing: 'ease-in-out' });
      anim.onfinish = stop;
    }, 650);
    return stop;
  }

  /* ---------------- Arrastar com mouse, toque ou caneta ----------------
     Também aceita clique/toque simples (sem arrastar) e teclado,
     porque arrastar no touchpad é difícil para crianças pequenas. */
  function makeDraggable(el, opts) {
    var start = null, ghost = null, dragging = false, suppressClick = false, overZone = null, offX = 0, offY = 0;

    function zoneAt(x, y) {
      var t = document.elementFromPoint(x, y);
      return t ? t.closest(opts.zoneSelector) : null;
    }
    function onDown(e) {
      if (e.button != null && e.button !== 0) return;
      if (el.classList.contains('locked')) return;
      start = { x: e.clientX, y: e.clientY, id: e.pointerId };
      dragging = false;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
    }
    function onMove(e) {
      if (!start || e.pointerId !== start.id) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dx) + Math.abs(dy) < 10) return;
        dragging = true;
        var r = el.getBoundingClientRect();
        offX = start.x - r.left; offY = start.y - r.top;
        ghost = el.cloneNode(true);
        ghost.classList.add('ghost');
        ghost.classList.remove('selected');
        ghost.style.width = r.width + 'px';
        ghost.style.height = r.height + 'px';
        document.body.appendChild(ghost);
        el.classList.add('drag-src');
        if (opts.onStart) opts.onStart(el);
      }
      ghost.style.transform = 'translate(' + (e.clientX - offX) + 'px,' + (e.clientY - offY) + 'px) rotate(-4deg) scale(1.08)';
      var z = zoneAt(e.clientX, e.clientY);
      if (z !== overZone) {
        if (overZone) overZone.classList.remove('over');
        overZone = z;
        if (overZone) overZone.classList.add('over');
      }
    }
    function finish(e, cancelled) {
      if (!start) return;
      var wasDragging = dragging;
      start = null; dragging = false;
      if (overZone) overZone.classList.remove('over');
      if (!wasDragging) return;
      suppressClick = true;
      setTimeout(function () { suppressClick = false; }, 50);
      var z = cancelled ? null : zoneAt(e.clientX, e.clientY);
      overZone = null;
      var accepted = z ? opts.onDrop(el, z) : false;
      var g = ghost; ghost = null;
      if (accepted) {
        g.remove();
        el.classList.remove('drag-src');
      } else {
        // volta para o lugar
        var r = el.getBoundingClientRect();
        g.style.transition = 'transform .28s ease';
        g.style.transform = 'translate(' + r.left + 'px,' + r.top + 'px)';
        setTimeout(function () { g.remove(); el.classList.remove('drag-src'); }, 290);
      }
    }
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', function (e) { finish(e, false); });
    el.addEventListener('pointercancel', function (e) { finish(e, true); });
    el.addEventListener('click', function () {
      if (suppressClick || el.classList.contains('locked')) return;
      if (opts.onTap) opts.onTap(el);
    });
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ---------------- Prompt (instrução no topo) ---------------- */
  var TYPE_ICON = { choice: '👆', drag: '✋', match: '✏️', memory: '🃏' };
  function renderPrompt(spec) {
    var p = h('div', 'prompt');
    p.innerHTML =
      '<span class="prompt-icon" aria-hidden="true">' + (TYPE_ICON[spec.type] || '⭐') + '</span>' +
      '<h2 class="prompt-text">' + spec.prompt + '</h2>' +
      (spec.hint ? '<span class="prompt-hint" aria-hidden="true">' + spec.hint + '</span>' : '');
    return p;
  }

  /* =========================================================
     MECÂNICA 1 — Múltipla escolha
     spec: { options:[{html, correct, label, reveal}], layout, optClass, stage, stageReveal }
     ========================================================= */
  function renderChoice(spec, play, api) {
    var wrap = h('div', 'options layout-' + (spec.layout || 'row') + (spec.optClass ? ' ' + spec.optClass : ''));
    var solved = false;
    spec.options.forEach(function (o) {
      var b = h('button', 'opt' + (o.cls ? ' ' + o.cls : ''), '<span class="opt-in">' + o.html + '</span>');
      b.type = 'button';
      b.setAttribute('aria-label', o.label || 'opção');
      b.addEventListener('click', function () {
        if (solved || b.disabled) return;
        if (o.correct) {
          solved = true;
          b.classList.add('ok');
          wrap.classList.add('solved');
          spec.options.forEach(function (oo, i) {
            if (oo.reveal) wrap.children[i].appendChild(h('span', 'opt-reveal', oo.reveal));
          });
          if (spec.stageReveal) {
            var st = play.querySelector('.stage');
            if (st) { st.innerHTML = spec.stageReveal; restartAnim(st, 'pop'); }
          }
          api.hit();
          api.solved(b);
        } else {
          b.disabled = true;
          b.classList.add('no');
          restartAnim(b, 'shake');
          api.wrong(b, { count: true });
        }
      });
      wrap.appendChild(b);
    });
    play.appendChild(wrap);
  }

  /* =========================================================
     MECÂNICA 2 — Arrastar e soltar
     spec: {
       mode: 'sort'  (cada item vai para o cesto da sua categoria)
           | 'order' (cada espaço aceita um item específico, em ordem)
           | 'count' (colocar N itens no cesto e apertar "Pronto"),
       items:[{html, key, label}], zones:[{html, key, cls, label}], target (count)
     }
     ========================================================= */
  function renderDrag(spec, play, api, hooks) {
    var mode = spec.mode;
    var area = h('div', 'drag-area mode-' + mode + (spec.areaClass ? ' ' + spec.areaClass : ''));
    var pile = h('div', 'pile');
    var zonesWrap = h('div', 'zones');
    var selected = null;
    var solved = false;
    var zones = [];

    if (spec.zonesBefore) zonesWrap.insertAdjacentHTML('afterbegin', spec.zonesBefore);
    spec.zones.forEach(function (z, i) {
      var ze = h('div', 'zone' + (z.cls ? ' ' + z.cls : ''));
      ze.setAttribute('role', 'button');
      ze.setAttribute('tabindex', '0');
      ze.setAttribute('aria-label', z.label || ('espaço ' + (i + 1)));
      ze.dataset.key = z.key == null ? '' : z.key;
      ze.innerHTML = '<div class="zone-items"></div><div class="zone-label">' + (z.html || '') + '</div>';
      ze.addEventListener('click', function () { if (selected) tryDrop(selected, ze); });
      ze.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && selected) { e.preventDefault(); tryDrop(selected, ze); }
      });
      zones.push(ze);
      zonesWrap.appendChild(ze);
      if (mode === 'order' && spec.arrows && i < spec.zones.length - 1) {
        zonesWrap.appendChild(h('span', 'order-arrow', Art.icon.arrow));
      }
    });

    var items = spec.items.map(function (it) {
      var b = h('button', 'item' + (it.cls ? ' ' + it.cls : ''), it.html);
      b.type = 'button';
      b.dataset.key = it.key;
      b.setAttribute('aria-label', it.label || 'item');
      makeDraggable(b, {
        zoneSelector: mode === 'count' ? '.zone, .pile' : '.zone',
        onDrop: function (el, z) { return tryDrop(el, z); },
        onTap: function (el) { onTap(el); },
        onStart: function () { setSelected(null); }
      });
      pile.appendChild(b);
      return b;
    });

    function setSelected(el) {
      if (selected) selected.classList.remove('selected');
      selected = el;
      if (el) el.classList.add('selected');
    }

    function onTap(el) {
      if (solved) return;
      if (mode === 'count') {
        // toque simples: vai para o cesto ou volta para a pilha
        if (el.parentNode === pile) tryDrop(el, zones[0]);
        else { pile.appendChild(el); restartAnim(el, 'pop'); }
        return;
      }
      if (mode === 'order') {
        // toque simples: vai para o próximo espaço vazio
        var next = zones.filter(function (z) { return !z.querySelector('.item'); })[0];
        if (next) tryDrop(el, next);
        return;
      }
      setSelected(selected === el ? null : el);
    }

    function tryDrop(el, z) {
      if (solved) return false;
      if (z === pile) {
        if (el.parentNode === pile) return false;
        pile.appendChild(el);
        restartAnim(el, 'pop');
        return true;
      }
      var box = z.querySelector('.zone-items');
      if (mode === 'count') {
        if (el.parentNode === box) return false;
        box.appendChild(el);
        restartAnim(el, 'pop');
        setSelected(null);
        return true;
      }
      if (mode === 'order' && z.querySelector('.item')) return false; // espaço já ocupado
      if (String(el.dataset.key) === String(z.dataset.key)) {
        box.appendChild(el);
        el.classList.add('locked');
        el.setAttribute('aria-disabled', 'true');
        setSelected(null);
        restartAnim(el, 'pop');
        restartAnim(z, 'glow');
        sparkle(el);
        api.hit();
        checkDone();
        return true;
      }
      setSelected(null);
      restartAnim(z, 'shake');
      restartAnim(el, 'shake');
      api.wrong(z, { count: true });
      return false;
    }

    function checkDone() {
      var done;
      if (mode === 'order') done = zones.every(function (z) { return !!z.querySelector('.item'); });
      else done = items.every(function (it) { return it.classList.contains('locked'); });
      if (done) { solved = true; area.classList.add('solved'); api.solved(zonesWrap); }
    }

    area.appendChild(pile);
    area.appendChild(zonesWrap);

    if (mode === 'count') {
      var ok = h('button', 'btn btn-green btn-confirm', Art.icon.check + '<span>Pronto!</span>');
      ok.type = 'button';
      ok.addEventListener('click', function () {
        if (solved) return;
        var n = zones[0].querySelectorAll('.item').length;
        if (n === spec.target) {
          solved = true;
          area.classList.add('solved');
          zones[0].querySelectorAll('.item').forEach(function (i) { i.classList.add('locked'); });
          api.hit();
          api.solved(zones[0]);
        } else {
          restartAnim(zones[0], 'shake');
          restartAnim(ok, 'shake');
          api.wrong(zones[0], { count: true, msg: n < spec.target ? 'Falta! Coloque mais.' : 'Opa! Tem demais.' });
        }
      });
      area.appendChild(ok);
    }
    play.appendChild(area);

    var stopHint = function () {};
    if (hooks.wantHint('drag')) {
      var first = items[0];
      var target = mode === 'count' ? zones[0] : zones.filter(function (z) { return String(z.dataset.key) === String(first.dataset.key); })[0];
      stopHint = handHint(first, target || zones[0], area);
    }
    return function () { stopHint(); };
  }

  /* =========================================================
     MECÂNICA 3 — Ligar pares
     spec: { left:[{html, pair, label}], right:[{html, pair, label}] }
     ========================================================= */
  var LINE_COLORS = ['#EF476F', '#118AB2', '#06D6A0', '#9B5DE5', '#FF8C1A'];
  function renderMatch(spec, play, api, hooks) {
    var area = h('div', 'match-area rows-' + spec.left.length);
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'match-lines');
    var colL = h('div', 'match-col left');
    var colR = h('div', 'match-col right');
    var links = []; // {a, b, color}
    var selected = null, temp = null, solved = false;
    var total = spec.left.length;

    function mk(it, side) {
      var b = h('button', 'mitem ' + side + (it.cls ? ' ' + it.cls : ''), '<span class="mitem-in">' + it.html + '</span><span class="knob"></span>');
      b.type = 'button';
      b.dataset.pair = it.pair;
      b.dataset.side = side;
      b.setAttribute('aria-label', it.label || 'item');
      return b;
    }
    spec.left.forEach(function (it) { colL.appendChild(mk(it, 'left')); });
    spec.right.forEach(function (it) { colR.appendChild(mk(it, 'right')); });
    area.appendChild(colL);
    area.appendChild(svg);
    area.appendChild(colR);
    play.appendChild(area);

    function knobPos(btn) {
      var k = btn.querySelector('.knob');
      var ar = area.getBoundingClientRect();
      var c = center(k);
      return { x: c.x - ar.left, y: c.y - ar.top };
    }
    function line(p1, p2, color, cls) {
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', p1.x); l.setAttribute('y1', p1.y);
      l.setAttribute('x2', p2.x); l.setAttribute('y2', p2.y);
      l.setAttribute('stroke', color);
      l.setAttribute('class', cls || 'mline');
      svg.appendChild(l);
      return l;
    }
    function redraw() {
      var ar = area.getBoundingClientRect();
      svg.setAttribute('width', ar.width); svg.setAttribute('height', ar.height);
      svg.setAttribute('viewBox', '0 0 ' + ar.width + ' ' + ar.height);
      Array.prototype.slice.call(svg.querySelectorAll('.mline')).forEach(function (l) { l.remove(); });
      links.forEach(function (lk) { line(knobPos(lk.a), knobPos(lk.b), lk.color); });
    }
    function setSel(b) {
      if (selected) selected.classList.remove('selected');
      selected = b;
      if (b) b.classList.add('selected');
    }
    function attempt(a, b) {
      if (!a || !b || a.dataset.side === b.dataset.side) return;
      if (a.classList.contains('done') || b.classList.contains('done')) return;
      var L = a.dataset.side === 'left' ? a : b, R = L === a ? b : a;
      if (L.dataset.pair === R.dataset.pair) {
        var color = LINE_COLORS[links.length % LINE_COLORS.length];
        links.push({ a: L, b: R, color: color });
        L.classList.add('done'); R.classList.add('done');
        L.style.setProperty('--pair-color', color); R.style.setProperty('--pair-color', color);
        redraw();
        restartAnim(L, 'pop'); restartAnim(R, 'pop');
        sparkle(R);
        api.hit();
        if (links.length === total) { solved = true; area.classList.add('solved'); api.solved(area); }
      } else {
        var bad = line(knobPos(L), knobPos(R), '#e11d48', 'mline-bad');
        setTimeout(function () { bad.remove(); }, 600);
        restartAnim(L, 'shake'); restartAnim(R, 'shake');
        api.wrong(R, { count: true });
      }
    }

    // clique/toque: seleciona um, depois o outro
    area.addEventListener('click', function (e) {
      if (solved) return;
      var b = e.target.closest('.mitem');
      if (!b || b.classList.contains('done') || dragJustEnded) return;
      if (!selected) { setSel(b); return; }
      if (selected === b) { setSel(null); return; }
      if (selected.dataset.side === b.dataset.side) { setSel(b); return; }
      var a = selected; setSel(null); attempt(a, b);
    });

    // arrastar a linha com o dedo/mouse
    var dragFrom = null, dragJustEnded = false, startPt = null, pid = null;
    area.addEventListener('pointerdown', function (e) {
      if (solved) return;
      var b = e.target.closest('.mitem');
      if (!b || b.classList.contains('done')) return;
      dragFrom = b; startPt = { x: e.clientX, y: e.clientY }; pid = e.pointerId;
    });
    area.addEventListener('pointermove', function (e) {
      if (!dragFrom || e.pointerId !== pid) return;
      if (!temp && Math.abs(e.clientX - startPt.x) + Math.abs(e.clientY - startPt.y) < 10) return;
      var ar = area.getBoundingClientRect();
      var p2 = { x: e.clientX - ar.left, y: e.clientY - ar.top };
      if (!temp) {
        setSel(dragFrom);
        temp = line(knobPos(dragFrom), p2, '#64748b', 'mline-temp');
        try { area.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
      }
      temp.setAttribute('x2', p2.x); temp.setAttribute('y2', p2.y);
    });
    function endDrag(e) {
      if (!dragFrom) return;
      var from = dragFrom; dragFrom = null;
      if (!temp) return; // foi só um clique
      temp.remove(); temp = null;
      dragJustEnded = true; setTimeout(function () { dragJustEnded = false; }, 60);
      setSel(null);
      var t = document.elementFromPoint(e.clientX, e.clientY);
      var to = t ? t.closest('.mitem') : null;
      if (to && to !== from) attempt(from, to);
    }
    area.addEventListener('pointerup', endDrag);
    area.addEventListener('pointercancel', function () {
      dragFrom = null; if (temp) { temp.remove(); temp = null; } setSel(null);
    });

    window.addEventListener('resize', redraw);
    requestAnimationFrame(redraw);

    var stopHint = function () {};
    if (hooks.wantHint('match')) {
      var l0 = colL.children[0];
      var r0 = Array.prototype.filter.call(colR.children, function (r) { return r.dataset.pair === l0.dataset.pair; })[0];
      stopHint = handHint(l0, r0, area);
    }
    return function () { window.removeEventListener('resize', redraw); stopHint(); };
  }

  /* =========================================================
     MECÂNICA 4 — Jogo da memória
     spec: { cards:[{html, pair, label}], cols }
     ========================================================= */
  function renderMemory(spec, play, api) {
    var grid = h('div', 'memory-grid cols-' + (spec.cols || 4));
    var open = [], lock = false, matched = 0, misses = 0;
    var pairs = spec.cards.length / 2;
    var free = pairs + 3; // erros "de graça" — faz parte do jogo errar na memória

    spec.cards.forEach(function (c, i) {
      var b = h('button', 'mcard');
      b.type = 'button';
      b.dataset.pair = c.pair;
      b.setAttribute('aria-label', 'carta ' + (i + 1));
      b.innerHTML = '<span class="mcard-inner"><span class="face back"><span>?</span></span>' +
        '<span class="face front ' + (c.cls || '') + '">' + c.html + '</span></span>';
      b.addEventListener('click', function () {
        if (lock || b.classList.contains('flipped') || b.classList.contains('matched')) return;
        b.classList.add('flipped');
        b.setAttribute('aria-label', c.label || 'carta virada');
        open.push(b);
        if (open.length < 2) return;
        var x = open[0], y = open[1];
        open = [];
        if (x.dataset.pair === y.dataset.pair) {
          setTimeout(function () {
            x.classList.add('matched'); y.classList.add('matched');
            sparkle(y);
            api.hit();
            matched++;
            if (matched === pairs) { grid.classList.add('solved'); api.solved(grid); }
          }, 350);
        } else {
          lock = true;
          misses++;
          setTimeout(function () {
            restartAnim(x, 'shake'); restartAnim(y, 'shake');
          }, 650);
          setTimeout(function () {
            x.classList.remove('flipped'); y.classList.remove('flipped');
            x.setAttribute('aria-label', 'carta'); y.setAttribute('aria-label', 'carta');
            lock = false;
          }, 1150);
          api.wrong(y, { count: misses > free, quiet: misses <= free });
        }
      });
      grid.appendChild(b);
    });
    play.appendChild(grid);
  }

  var RENDER = { choice: renderChoice, drag: renderDrag, match: renderMatch, memory: renderMemory };

  /* ---------------- Executa uma rodada ---------------- */
  function runRound(spec, mount, hooks) {
    mount.innerHTML = '';
    var root = h('div', 'round round-' + spec.type + (spec.roundClass ? ' ' + spec.roundClass : ''));
    root.appendChild(renderPrompt(spec));
    var play = h('div', 'play');
    if (spec.stage) play.appendChild(h('div', 'stage', spec.stage));
    root.appendChild(play);
    mount.appendChild(root);
    var finished = false;
    var api = {
      wrong: function (el, o) { if (!finished) hooks.onWrong(el, o || {}); },
      hit: function () { if (!finished && hooks.onHit) hooks.onHit(); },
      solved: function (el) { if (finished) return; finished = true; hooks.onSolved(el); }
    };
    var cleanup = RENDER[spec.type](spec, play, api, hooks);
    return function () { if (typeof cleanup === 'function') cleanup(); };
  }

  window.Engine = {
    util: { rand: rand, pick: pick, shuffle: shuffle, sample: sample, h: h, center: center, restartAnim: restartAnim },
    confetti: Confetti,
    sparkle: sparkle,
    runRound: runRound
  };
})();
