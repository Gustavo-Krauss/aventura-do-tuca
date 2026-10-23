/* ==========================================================
   Aventura do Tuca — Telas e fluxo do jogo
   Início → Escolha do amigo → Mapa (nível Fácil/Médio/Difícil)
   → Ilha (5 perguntas) → Ilha completa (estrelas) → ...
   → Tesouro do nível (certificado)

   Cada pergunta respondida vira 1 linha no registro do educador
   (ver js/registro.js).
   ========================================================== */
(function () {
  'use strict';
  var U = Engine.util, h = U.h, pick = U.pick;
  var app = document.getElementById('app');
  var PHASES = Content.phases;
  var LEVELS = Content.levels;
  var AVATARS = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐯', '🐸', '🐵', '🦄'];
  var OK_MSG = ['Muito bem!', 'Isso aí!', 'Arrasou!', 'Parabéns!', 'Que demais!', 'Você é fera!', 'Excelente!', 'Show!'];
  var WRONG_MSG = ['Quase! Tente de novo.', 'Ops! Tente outra vez.', 'Vamos tentar de novo?', 'Você consegue!'];
  var STORE_KEY = 'aventura-do-tuca-v1';
  var CHEST = { facil: undefined, medio: 'silver', dificil: 'gold' };

  /* ---------------- Progresso da criança (salvo no navegador) ---------------- */
  function emptyResults() { return { facil: {}, medio: {}, dificil: {} }; }
  function emptyState() { return { v: 2, name: '', avatar: AVATARS[0], level: 'facil', results: emptyResults() }; }
  var state = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && typeof s === 'object' && s.results) {
        if (!s.results.facil) s.results = { facil: s.results, medio: {}, dificil: {} }; // versão antiga
        LEVELS.forEach(function (l) { if (!s.results[l.id]) s.results[l.id] = {}; });
        if (!levelById(s.level)) s.level = 'facil';
        return s;
      }
    } catch (e) { /* sem armazenamento: segue sem salvar */ }
    return emptyState();
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignora */ } }
  function levelById(id) { return LEVELS.filter(function (l) { return l.id === id; })[0]; }
  function lv() { return levelById(state.level); }
  function starsOf(id, level) { return state.results[level || state.level][id] || 0; }
  function doneCount(level) { return PHASES.filter(function (p) { return starsOf(p.id, level) > 0; }).length; }
  function totalStars(level) { return PHASES.reduce(function (s, p) { return s + starsOf(p.id, level); }, 0); }
  function hasProgress() { return LEVELS.some(function (l) { return doneCount(l.id) > 0; }) || !!state.name; }

  /* ---------------- Ajudantes de interface ---------------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function starsHtml(n, total) {
    var s = '';
    for (var i = 0; i < (total || 3); i++) s += '<span class="st' + (i < n ? ' on' : '') + '">' + Art.icon.star + '</span>';
    return s;
  }
  function levelBadge(l) { return '<span class="lv-badge" style="--lv:' + l.color + '"><span class="emo">' + l.icon + '</span>' + l.name + '</span>'; }
  function btn(cls, inner, label, onClick) {
    var b = h('button', 'btn ' + cls, inner);
    b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    b.addEventListener('click', onClick);
    return b;
  }
  function roundBtn(icon, label, onClick, extra) {
    var b = h('button', 'btn-round' + (extra ? ' ' + extra : ''), icon);
    b.type = 'button';
    b.setAttribute('aria-label', label);
    b.title = label;
    b.addEventListener('click', onClick);
    return b;
  }
  var fsSupported = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  function toggleFullscreen() {
    var d = document, el = d.documentElement;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
      else (el.requestFullscreen || el.webkitRequestFullscreen).call(el);
    } catch (e) { /* ignora */ }
  }
  function fsBtn() { return fsSupported ? roundBtn(Art.icon.full, 'Tela cheia', toggleFullscreen, 'btn-fs') : h('span'); }
  function mascot(cls) { return h('div', 'tuca ' + (cls || ''), Art.tuca()); }

  var currentCleanup = null;
  function show(screen) {
    if (currentCleanup) { var c = currentCleanup; currentCleanup = null; c(); }
    closeModal();
    app.innerHTML = '';
    screen.classList.add('screen-enter');
    app.appendChild(screen);
    window.scrollTo(0, 0);
  }

  /* ---------------- Janela (modal) ---------------- */
  var modalEl = null;
  function openModal(title, bodyHtml, buttons, cls) {
    closeModal();
    modalEl = h('div', 'modal-back');
    var box = h('div', 'modal ' + (cls || ''));
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML = '<h2>' + title + '</h2><div class="modal-body">' + bodyHtml + '</div>';
    var acts = h('div', 'actions');
    buttons.forEach(function (b) {
      acts.appendChild(btn(b.cls, b.html, b.label, function () { if (!b.keepOpen) closeModal(); if (b.onClick) b.onClick(); }));
    });
    box.appendChild(acts);
    modalEl.appendChild(box);
    modalEl.addEventListener('click', function (e) { if (e.target === modalEl) closeModal(); });
    document.body.appendChild(modalEl);
    var f = acts.querySelector('button');
    if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    box.scrollTop = 0;
    return box;
  }
  function closeModal() { if (modalEl) { modalEl.remove(); modalEl = null; } }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  function confirmReset(after) {
    openModal('Começar com outra criança?',
      '<p>As estrelas deste jogo serão apagadas.</p><p><b>Os registros do educador continuam guardados.</b></p>', [
        { cls: 'btn-green', html: Art.icon.check + '<span>Sim</span>', label: 'Sim', onClick: function () { state = emptyState(); save(); after(); } },
        { cls: 'btn-red', html: Art.icon.close + '<span>Não</span>', label: 'Não' }
      ]);
  }

  /* =========================================================
     TELA 1 — Início
     ========================================================= */
  function titleLetters(text) {
    var cols = ['#EF476F', '#FF8C1A', '#FFD60A', '#06D6A0', '#118AB2', '#9B5DE5'], i = 0;
    return text.split('').map(function (c) {
      if (c === ' ') return ' ';
      i++;
      return '<span style="--c:' + cols[i % cols.length] + ';--d:' + (i * 0.08).toFixed(2) + 's">' + c + '</span>';
    }).join('');
  }
  function screenStart() {
    var s = h('section', 'screen start');
    s.innerHTML =
      '<div class="corner-tools"></div>' +
      '<div class="title-wrap">' +
        '<h1 class="game-title"><span class="t1">' + titleLetters('Aventura') + '</span><span class="t2">' + titleLetters('do Tuca') + '</span></h1>' +
        '<p class="subtitle">Tamanhos • Números • Cores • Letras</p>' +
      '</div>' +
      '<div class="start-hero">' +
        '<span class="float-ico f1">' + PHASES[0].icon + '</span>' +
        '<span class="float-ico f2">' + PHASES[1].icon + '</span>' +
        '<span class="float-ico f3">' + PHASES[2].icon + '</span>' +
        '<span class="float-ico f4">' + PHASES[3].icon + '</span>' +
      '</div>' +
      '<div class="start-actions"></div>';
    s.querySelector('.start-hero').appendChild(mascot('hero waving'));
    var acts = s.querySelector('.start-actions');
    if (hasProgress()) {
      var who = state.name ? ' (' + esc(state.name) + ')' : '';
      acts.appendChild(btn('btn-green btn-xl btn-play', Art.icon.play + '<span>Continuar</span>', 'Continuar', screenMapGo));
      acts.appendChild(btn('btn-blue', Art.icon.replay + '<span>Outra criança</span>', 'Começar com outra criança' + who, function () {
        confirmReset(function () { show(screenAvatar()); });
      }));
    } else {
      acts.appendChild(btn('btn-green btn-xl btn-play', Art.icon.play + '<span>Jogar</span>', 'Jogar', function () { show(screenAvatar()); }));
    }
    var tools = s.querySelector('.corner-tools');
    tools.appendChild(roundBtn(Art.icon.info, 'Painel do educador', showInfo, 'btn-info'));
    tools.appendChild(fsBtn());
    return s;
  }
  function screenMapGo() { show(screenMap()); }

  /* ---------------- Painel do educador ---------------- */
  function questionsTable() {
    var rows = '';
    LEVELS.forEach(function (l) {
      PHASES.forEach(function (p) {
        p.levels[l.id].forEach(function (q) {
          rows += '<tr><td>' + q.code + '</td><td>' + l.name + '</td><td>' + p.assunto + '</td><td>' + q.habilidade + '</td><td>' + q.bncc + '</td></tr>';
        });
      });
    });
    return '<details class="qtable"><summary>Ver as 60 perguntas e habilidades</summary>' +
      '<div class="qtable-wrap"><table><thead><tr><th>Código</th><th>Nível</th><th>Assunto</th><th>Habilidade</th><th>BNCC</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></details>';
  }
  function showInfo() {
    var n = Registro.count();
    var list = PHASES.map(function (p) {
      return '<li><span class="info-ico">' + p.icon + '</span><div><b>' + p.name + '</b> — <i>' + p.assunto + '</i></div></li>';
    }).join('');
    openModal('Painel do educador',
      '<p><b>Público:</b> Educação Infantil — Pré-escola II (5 e 6 anos).</p>' +
      '<p><b>Como funciona:</b> 3 níveis (🌱 Fácil, 🌿 Médio e 🌳 Difícil), todos liberados, escolhidos no topo do mapa. ' +
      'Cada nível tem <b>20 perguntas: 5 em cada ilha</b>. Ao completar as 4 ilhas de um nível, a criança abre o tesouro e recebe o certificado.</p>' +
      '<ul class="info-list">' + list + '</ul>' +
      questionsTable() +
      '<div class="report-box">' +
        '<p><b>Registros de aprendizagem:</b> cada pergunta respondida gera uma linha com ID (auto incremento), data, hora, nome da criança, nível, ilha, área (campo de experiência da BNCC), assunto, habilidade, tentativas, acertos, erros, resultado e tempo.</p>' +
        '<p class="report-count">Registros guardados neste navegador: <b>' + n + '</b></p>' +
      '</div>' +
      '<p><b>Dicas:</b> o jogo não tem áudio, então vale um adulto ler a instrução no início. Os registros ficam neste navegador: baixe o arquivo antes de limpar os dados do Chromebook. Para a próxima criança, use “Outra criança” na tela inicial.</p>',
      [
        { cls: 'btn-blue', html: '<span class="emo">📄</span><span>Baixar registros (.txt)</span>', label: 'Baixar registros em arquivo txt', keepOpen: true, onClick: function () { Registro.download(); } },
        { cls: 'btn-red', html: '<span class="emo">🗑️</span><span>Apagar registros</span>', label: 'Apagar registros', onClick: confirmClear },
        { cls: 'btn-green', html: Art.icon.check + '<span>Fechar</span>', label: 'Fechar' }
      ], 'modal-info');
  }
  function confirmClear() {
    openModal('Apagar todos os registros?',
      '<p>Isso apaga os ' + Registro.count() + ' registros guardados neste navegador. Baixe o arquivo .txt antes, se precisar.</p>', [
        { cls: 'btn-red', html: '<span class="emo">🗑️</span><span>Apagar</span>', label: 'Apagar registros', onClick: function () { Registro.clear(); showInfo(); } },
        { cls: 'btn-green', html: Art.icon.close + '<span>Cancelar</span>', label: 'Cancelar', onClick: showInfo }
      ]);
  }

  /* =========================================================
     TELA 2 — Escolha do amigo (avatar) e nome
     ========================================================= */
  function screenAvatar() {
    var s = h('section', 'screen avatar');
    s.innerHTML =
      '<div class="corner-tools left"></div>' +
      '<h2 class="screen-title">Escolha seu amigo!</h2>' +
      '<div class="avatar-grid" role="radiogroup" aria-label="Escolha seu amigo"></div>' +
      '<label class="name-field"><span>Nome da criança <small>(para os registros do professor)</small></span>' +
      '<input type="text" maxlength="30" autocomplete="off" spellcheck="false" placeholder="Digite aqui"></label>' +
      '<div class="start-actions"></div>';
    var grid = s.querySelector('.avatar-grid');
    AVATARS.forEach(function (a) {
      var b = h('button', 'avatar-btn' + (state.avatar === a ? ' on' : ''), '<span class="emo">' + a + '</span>');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', state.avatar === a ? 'true' : 'false');
      b.setAttribute('aria-label', 'amigo ' + a);
      b.addEventListener('click', function () {
        state.avatar = a;
        Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove('on'); c.setAttribute('aria-checked', 'false'); });
        b.classList.add('on'); b.setAttribute('aria-checked', 'true');
        U.restartAnim(b, 'pop');
      });
      grid.appendChild(b);
    });
    var input = s.querySelector('input');
    input.value = state.name || '';
    s.querySelector('.start-actions').appendChild(btn('btn-green btn-xl', Art.icon.play + '<span>Vamos lá!</span>', 'Vamos lá', function () {
      state.name = input.value.replace(/\s+/g, ' ').trim().slice(0, 30);
      save();
      show(screenMap());
    }));
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') s.querySelector('.btn-xl').click(); });
    s.querySelector('.corner-tools').appendChild(roundBtn(Art.icon.home, 'Voltar ao início', function () { show(screenStart()); }));
    return s;
  }

  /* =========================================================
     TELA 3 — Mapa das ilhas (com escolha de nível)
     ========================================================= */
  var LEVEL_MSG = {
    facil: 'Nível Fácil! Escolha uma ilha!',
    medio: 'Nível Médio: desafios novos!',
    dificil: 'Nível Difícil: você consegue!'
  };
  function screenMap(msg) {
    var level = lv();
    var s = h('section', 'screen map lv-' + level.id);
    var allDone = doneCount() === PHASES.length;
    s.innerHTML =
      '<header class="topbar">' +
        '<div class="tb-left"><div class="player"><span class="emo">' + state.avatar + '</span><span class="pname">' + esc(state.name || 'Explorador') + '</span></div></div>' +
        '<div class="level-switch" role="radiogroup" aria-label="Nível"></div>' +
        '<div class="tb-right"><span class="total-stars" aria-label="estrelas">' + Art.icon.star + '<b>' + totalStars() + '/' + (PHASES.length * 3) + '</b></span></div>' +
      '</header>' +
      '<div class="sea">' +
        '<svg class="routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
          '<path d="M50 52 Q30 40 20 22"/><path d="M50 52 Q70 40 80 22"/><path d="M50 52 Q30 66 20 80"/><path d="M50 52 Q70 66 80 80"/>' +
        '</svg>' +
        '<span class="deco boat" aria-hidden="true">⛵</span>' +
        '<span class="deco fish1" aria-hidden="true">🐠</span>' +
        '<span class="deco fish2" aria-hidden="true">🐬</span>' +
        '<div class="islands"></div>' +
      '</div>' +
      '<div class="mascot-corner"><div class="bubble"></div></div>';
    s.querySelector('.tb-left').insertBefore(roundBtn(Art.icon.home, 'Voltar ao início', function () { show(screenStart()); }), s.querySelector('.player'));
    s.querySelector('.tb-right').appendChild(fsBtn());

    // escolha de nível (todos liberados)
    var sw = s.querySelector('.level-switch');
    LEVELS.forEach(function (l) {
      var on = l.id === level.id;
      var b = h('button', 'lv-btn' + (on ? ' on' : ''), '<span class="emo">' + l.icon + '</span><span class="lv-name">' + l.name + '</span>');
      b.type = 'button';
      b.style.setProperty('--lv', l.color);
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.setAttribute('aria-label', 'Nível ' + l.name);
      b.addEventListener('click', function () {
        if (l.id === state.level) return;
        state.level = l.id; save();
        show(screenMap(LEVEL_MSG[l.id]));
      });
      sw.appendChild(b);
    });

    var wrap = s.querySelector('.islands');
    var pos = ['tl', 'tr', 'bl', 'br'];
    PHASES.forEach(function (p, i) {
      var st = starsOf(p.id);
      var b = h('button', 'island-btn pos-' + pos[i] + (st ? ' done' : ''));
      b.type = 'button';
      b.style.setProperty('--c', p.color);
      b.setAttribute('aria-label', p.name + ', nível ' + level.name + (st ? ', ' + st + ' estrelas' : ''));
      var marks = LEVELS.map(function (l) {
        return '<span class="lv-mark' + (starsOf(p.id, l.id) ? ' on' : '') + '" title="' + l.name + '">' + l.icon + '</span>';
      }).join('');
      b.innerHTML =
        '<span class="island-art">' + Art.island(p.grass) + '<span class="island-icon">' + p.icon + '</span>' +
        (st ? '<span class="done-badge">' + Art.icon.check + '</span>' : '') + '</span>' +
        '<span class="island-label">' + p.short + '</span>' +
        '<span class="island-stars">' + starsHtml(st) + '</span>' +
        '<span class="island-levels" aria-hidden="true">' + marks + '</span>';
      b.addEventListener('click', function () { startPhase(p); });
      wrap.appendChild(b);
    });
    var t = h('button', 'treasure ' + (allDone ? 'open' : 'locked'));
    t.type = 'button';
    t.setAttribute('aria-label', allDone ? 'Abrir o tesouro' : 'Tesouro trancado');
    t.innerHTML = '<span class="treasure-art">' + Art.chest(allDone, CHEST[level.id]) + '</span>' +
      '<span class="island-label">' + (allDone ? 'Tesouro!' : 'Tesouro ' + doneCount() + '/4') + '</span>';
    t.addEventListener('click', function () {
      if (allDone) { show(screenFinal()); return; }
      U.restartAnim(t, 'shake');
      say('Complete as 4 ilhas para abrir o tesouro!');
    });
    wrap.appendChild(t);

    var corner = s.querySelector('.mascot-corner');
    corner.appendChild(mascot());
    var bubble = corner.querySelector('.bubble');
    function say(text) { bubble.textContent = text; U.restartAnim(bubble, 'pop'); }
    say(msg || (allDone ? 'Você conseguiu! Abra o tesouro!' : (doneCount() ? 'Escolha outra ilha!' : LEVEL_MSG[level.id])));
    return s;
  }

  /* =========================================================
     TELA 4 — Jogando uma ilha (5 perguntas)
     ========================================================= */
  var hinted = {}; // mostra a mãozinha de dica só na 1ª vez de cada mecânica
  function startPhase(phase) {
    var level = lv();
    var rounds = phase.rounds(level.id);
    var idx = 0, errors = 0, roundCleanup = null, timers = [];
    var cur = null; // registro da pergunta atual

    var s = h('section', 'screen game ' + phase.theme + ' lv-' + level.id);
    s.innerHTML =
      '<header class="topbar">' +
        '<div class="tb-left"></div>' +
        '<div class="phase-title"><span class="pt-ico">' + phase.icon + '</span><span>' + phase.short + '</span>' + levelBadge(level) + '</div>' +
        '<div class="tb-right"><div class="progress" aria-label="progresso"></div></div>' +
      '</header>' +
      '<div class="round-mount"></div>' +
      '<div class="mascot-corner small"><div class="bubble"></div></div>';
    var mount = s.querySelector('.round-mount');
    var prog = s.querySelector('.progress');
    rounds.forEach(function () { prog.appendChild(h('span', 'pdot')); });
    var corner = s.querySelector('.mascot-corner');
    var tucaEl = mascot();
    corner.appendChild(tucaEl);
    var bubble = corner.querySelector('.bubble');

    s.querySelector('.tb-left').appendChild(roundBtn(Art.icon.home, 'Voltar ao mapa', function () {
      openModal('Voltar ao mapa?', '<p>Os desafios desta ilha vão recomeçar depois.</p>', [
        { cls: 'btn-green', html: Art.icon.check + '<span>Sim</span>', label: 'Sim, voltar ao mapa', onClick: screenMapGo },
        { cls: 'btn-red', html: Art.icon.close + '<span>Não</span>', label: 'Não, continuar jogando' }
      ]);
    }));

    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function say(text, mood) {
      bubble.textContent = text;
      bubble.classList.add('show');
      U.restartAnim(bubble, 'pop');
      tucaEl.classList.remove('happy', 'sad');
      if (mood) { void tucaEl.offsetWidth; tucaEl.classList.add(mood); }
    }
    function quiet() { bubble.classList.remove('show'); tucaEl.classList.remove('happy', 'sad'); }

    function updateProgress() {
      Array.prototype.forEach.call(prog.children, function (d, i) {
        d.classList.toggle('done', i < idx);
        d.classList.toggle('now', i === idx);
      });
    }

    // grava 1 linha no registro do educador
    function logRound(concluida) {
      if (!cur || cur.logged) return;
      cur.logged = true;
      if (!concluida && cur.acertos + cur.erros === 0) return; // nem tentou: não registra
      Registro.add({
        crianca: state.name, nivel: level.name, meta: cur.meta,
        acertos: cur.acertos, erros: cur.erros, concluida: concluida, inicio: cur.inicio
      });
    }

    var hooks = {
      onWrong: function (el, o) {
        if (cur) cur.erros++;
        if (o.count) errors++;
        if (!o.quiet) say(o.msg || pick(WRONG_MSG), 'sad');
      },
      onHit: function () { if (cur) cur.acertos++; },
      onSolved: function (el) {
        logRound(true);
        var c = el ? U.center(el) : { x: innerWidth / 2, y: innerHeight / 2 };
        Engine.confetti.burst(c.x, c.y, 45);
        var msg = pick(OK_MSG);
        say(msg, 'happy');
        var cheer = h('div', 'cheer', '<span class="cheer-star">' + Art.icon.star + '</span><span>' + msg + '</span>');
        s.appendChild(cheer);
        later(function () { cheer.remove(); }, 1500);
        idx++;
        updateProgress();
        later(next, 1650);
      },
      wantHint: function (kind) { if (hinted[kind]) return false; hinted[kind] = true; return true; }
    };

    function showRound() {
      if (roundCleanup) roundCleanup();
      quiet();
      updateProgress();
      cur = { meta: rounds[idx].meta, acertos: 0, erros: 0, inicio: Date.now(), logged: false };
      roundCleanup = Engine.runRound(rounds[idx], mount, hooks);
      U.restartAnim(mount, 'round-enter');
    }
    function next() {
      if (idx < rounds.length) {
        mount.classList.add('round-leave');
        later(function () { mount.classList.remove('round-leave'); showRound(); }, 220);
      } else finishPhase();
    }

    function finishPhase() {
      if (roundCleanup) { roundCleanup(); roundCleanup = null; }
      cur = null;
      var stars = errors <= 1 ? 3 : errors <= 4 ? 2 : 1;
      var wasAllDone = doneCount() === PHASES.length;
      state.results[level.id][phase.id] = Math.max(starsOf(phase.id), stars);
      save();
      var nowAllDone = doneCount() === PHASES.length;
      Engine.confetti.rain(2200);
      var ov = h('div', 'overlay');
      var msgs = { 3: 'Incrível! Você é demais!', 2: 'Muito bom! Continue assim!', 1: 'Você conseguiu! Que tal jogar de novo?' };
      ov.innerHTML = '<div class="panel" role="dialog" aria-label="Ilha completa">' +
        '<div class="panel-tuca"></div>' +
        '<h2>' + phase.name + '<br><span>completa!</span></h2>' +
        '<div class="panel-level">' + levelBadge(level) + '</div>' +
        '<div class="stars-big">' + starsHtml(stars) + '</div>' +
        '<p class="panel-msg">' + msgs[stars] + '</p>' +
        '<div class="actions"></div></div>';
      ov.querySelector('.panel-tuca').appendChild(mascot('happy jumping'));
      var acts = ov.querySelector('.actions');
      if (nowAllDone && !wasAllDone) {
        acts.appendChild(btn('btn-yellow btn-xl', '<span class="emo">🏆</span><span>Abrir o tesouro!</span>', 'Abrir o tesouro', function () { show(screenFinal()); }));
      } else {
        acts.appendChild(btn('btn-green btn-lg', Art.icon.map + '<span>Mapa</span>', 'Voltar ao mapa', function () { show(screenMap()); }));
      }
      acts.appendChild(btn('btn-blue btn-lg', Art.icon.replay + '<span>Jogar de novo</span>', 'Jogar esta ilha de novo', function () { startPhase(phase); }));
      s.appendChild(ov);
      var stEls = ov.querySelectorAll('.stars-big .st');
      Array.prototype.forEach.call(stEls, function (e, i) { e.style.animationDelay = (0.3 + i * 0.35) + 's'; });
      later(function () { var b = acts.querySelector('button'); if (b) b.focus(); }, 300);
    }

    show(s);
    currentCleanup = function () {
      timers.forEach(clearTimeout);
      logRound(false); // saiu no meio de uma pergunta já tentada
      if (roundCleanup) roundCleanup();
    };
    showRound();
  }

  /* =========================================================
     TELA 5 — Final do nível: tesouro e certificado
     ========================================================= */
  function screenFinal() {
    var level = lv();
    var s = h('section', 'screen final lv-' + level.id);
    var name = state.name ? esc(state.name) : '';
    var d = new Date();
    var date = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    var isl = PHASES.map(function (p) {
      return '<div class="cert-isl"><span class="ci-ico">' + p.icon + '</span><span class="ci-name">' + p.short + '</span><span class="ci-stars">' + starsHtml(starsOf(p.id)) + '</span></div>';
    }).join('');
    var nextLv = LEVELS[LEVELS.indexOf(level) + 1];
    s.innerHTML =
      '<div class="final-top">' +
        '<div class="trophy"><span class="emo">🏆</span></div>' +
        '<h1 class="final-title">Parabéns' + (name ? ', ' + name : '') + '!</h1>' +
        '<p class="final-sub">Você completou o nível ' + level.name + ' e encontrou o tesouro!</p>' +
      '</div>' +
      '<div class="certificate" id="certificado">' +
        '<div class="cert-inner">' +
          '<div class="cert-head">Certificado de Aventura</div>' +
          '<div class="cert-level">' + levelBadge(level) + '</div>' +
          '<div class="cert-who"><span class="emo cert-avatar">' + state.avatar + '</span>' +
            '<span class="cert-name">' + (name || 'Explorador(a)') + '</span></div>' +
          '<p class="cert-text">completou as 4 ilhas do nível <b>' + level.name + '</b> da <b>Aventura do Tuca</b> e ganhou <b>' + totalStars() + ' estrelas</b>!</p>' +
          '<div class="cert-islands">' + isl + '</div>' +
          '<div class="cert-foot"><span>' + date + '</span><span class="cert-tuca"></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="actions final-actions"></div>';
    s.querySelector('.cert-tuca').innerHTML = Art.tuca();
    var acts = s.querySelector('.final-actions');
    acts.appendChild(btn('btn-yellow btn-lg', Art.icon.print + '<span>Imprimir</span>', 'Imprimir certificado', function () { window.print(); }));
    if (nextLv) {
      acts.appendChild(btn('btn-green btn-lg btn-next', '<span class="emo">' + nextLv.icon + '</span><span>Jogar o ' + nextLv.name + '</span>', 'Jogar o nível ' + nextLv.name, function () {
        state.level = nextLv.id; save();
        show(screenMap(LEVEL_MSG[nextLv.id]));
      }));
    }
    acts.appendChild(btn('btn-blue btn-lg', Art.icon.map + '<span>Mapa</span>', 'Voltar ao mapa', function () { show(screenMap('Quer ganhar mais estrelas? Jogue de novo!')); }));
    setTimeout(function () { Engine.confetti.rain(3500); }, 300);
    return s;
  }

  /* ---------------- Começa! ---------------- */
  show(screenStart());

  // Atalhos só para testes automáticos (não afetam o jogo)
  window.__tuca = {
    startPhase: function (i) { startPhase(PHASES[i]); },
    setLevel: function (id) { state.level = id; save(); },
    state: function () { return state; },
    final: function () { show(screenFinal()); },
    map: screenMapGo
  };
})();
