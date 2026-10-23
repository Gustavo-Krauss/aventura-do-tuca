/* ==========================================================
   Aventura do Tuca — Conteúdo pedagógico

   3 níveis (Fácil, Médio, Difícil) × 4 ilhas × 5 perguntas
   = 20 perguntas por nível, 60 no total.

   Cada pergunta tem:
   - código (ex.: TAM-F1 = Tamanhos, Fácil, pergunta 1)
   - área (campo de experiência da BNCC)
   - assunto (conteúdo da ilha)
   - habilidade pedagógica específica
   - objetivo da BNCC relacionado

   O que aparece na tela (bichos, cores, números) é sorteado na
   hora, mas a habilidade de cada pergunta é sempre a mesma.
   ========================================================== */
(function () {
  'use strict';
  var U = Engine.util, pick = U.pick, shuffle = U.shuffle, sample = U.sample, rand = U.rand;

  var AREA = {
    ET: 'Espaços, tempos, quantidades, relações e transformações',
    EF: 'Escuta, fala, pensamento e imaginação',
    TS: 'Traços, sons, cores e formas'
  };

  /* =========================================================
     Ajudantes de HTML
     ========================================================= */
  function E(emoji, cls) { return '<span class="emo' + (cls ? ' ' + cls : '') + '">' + emoji + '</span>'; }
  function Es(emoji, vmin) { return '<span class="emo" style="font-size:' + vmin + 'vmin">' + emoji + '</span>'; }
  function kw(text, bg, fg) {
    return '<span class="kw" style="--kw:' + (bg || '#7B2FF7') + ';--kwt:' + (fg || '#fff') + '">' + text + '</span>';
  }
  function swatch(hex) { return '<span class="swatch" style="background:' + hex + '"></span>'; }
  function numeral(n) { return '<span class="numeral">' + n + '</span>'; }
  function letter(l, cls) { return '<span class="letter' + (cls ? ' ' + cls : '') + '">' + l + '</span>'; }
  function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }
  function rep(x, n) { var r = []; for (var i = 0; i < n; i++) r.push(x); return r; }

  // figuras espalhadas numa grade cols x rows (células sorteadas)
  function groupList(list, cols, rows, cls) {
    var total = cols * rows, cells = shuffle(range(0, total - 1)).slice(0, list.length), at = {};
    cells.forEach(function (c, i) { at[c] = list[i]; });
    var s = '<span class="count-box cols-' + cols + (cls ? ' ' + cls : '') + '">';
    for (var i = 0; i < total; i++) {
      s += at[i] ? '<span class="cell"><span class="emo" style="--rot:' + rand(-14, 14) + 'deg">' + at[i] + '</span></span>' : '<span class="cell"></span>';
    }
    return s + '</span>';
  }
  function group(emoji, n, cls) { return groupList(rep(emoji, n), 5, 3, cls); }
  function miniGroup(emoji, n) { return '<span class="mini-group">' + rep('<span class="emo">' + emoji + '</span>', n).join('') + '</span>'; }

  var BLOCK_COLORS = ['#EF476F', '#FFD60A', '#06D6A0', '#118AB2', '#9B5DE5', '#FF8C1A', '#4CC9F0'];
  function tower(n, cls) {
    var s = '<span class="tower' + (cls ? ' ' + cls : '') + '">', off = rand(0, 6);
    for (var i = 0; i < n; i++) s += '<i style="--c:' + BLOCK_COLORS[(i + off) % BLOCK_COLORS.length] + '"></i>';
    return s + '</span>';
  }
  function numOpts(n, k, lo, hi) {
    var pool = [];
    for (var d = 1; d <= 3; d++) pool.push(n - d, n + d);
    pool = pool.filter(function (x) { return x >= lo && x <= hi; });
    return shuffle([n].concat(sample(pool, k - 1)));
  }
  function numChoice(n, k, lo, hi) {
    return numOpts(n, k, lo, hi).map(function (x) { return { html: numeral(x), correct: x === n, label: 'número ' + x }; });
  }
  function trackHtml(seq, miss, fill) {
    return '<span class="track">' + seq.map(function (x, i) {
      if (i !== miss) return '<span class="tcell">' + x + '</span>';
      return fill ? '<span class="tcell filled">' + x + '</span>' : '<span class="tcell missing">?</span>';
    }).join('') + '</span>';
  }
  var SIZE_LABEL = { s: 'pequeno', m: 'médio', l: 'grande' };
  var ORANGE = '#FF8C1A', PURPLE = '#7B2FF7', PINK = '#EF476F', GREEN = '#06A77D';

  /* #########################################################
     ILHA 1 — TAMANHOS (Grandezas e Comparações)
     ######################################################### */
  var SIZE_EMOJIS = ['🐘', '🐢', '🐶', '🐱', '🐰', '🦁', '🐟', '🍎', '🚗', '⚽', '🐸', '🐻', '🐥', '🦒'];
  var PETS = ['🐶', '🐱', '🐰', '🐻', '🐥', '🐸', '🐢'];

  /* ---------- Fácil ---------- */
  function tMaiorMenor() {
    var big = Math.random() < .5, e = pick(SIZE_EMOJIS);
    return {
      type: 'choice',
      prompt: 'Toque no ' + kw(big ? 'MAIOR' : 'MENOR', ORANGE),
      hint: '<span class="hint-cmp"><span class="emo hs ' + (big ? '' : 'on') + '">' + e + '</span><span class="emo hl ' + (big ? 'on' : '') + '">' + e + '</span></span>',
      optClass: 'opts-size',
      options: shuffle(['s', 'm', 'l']).map(function (s) {
        return { html: E(e, 'sz-' + s), correct: big ? s === 'l' : s === 's', label: SIZE_LABEL[s] };
      })
    };
  }
  function tAltoBaixo() {
    var tall = Math.random() < .5, hs = sample([2, 3, 4, 5, 6, 7], 3);
    var max = Math.max.apply(null, hs), min = Math.min.apply(null, hs);
    return {
      type: 'choice',
      prompt: 'Toque na torre ' + kw(tall ? 'MAIS ALTA' : 'MAIS BAIXA', ORANGE),
      optClass: 'opts-tower',
      options: hs.map(function (n) { return { html: tower(n), correct: tall ? n === max : n === min, label: 'torre com ' + n + ' blocos' }; })
    };
  }
  function tOrdenar3() {
    var e = pick(SIZE_EMOJIS);
    return {
      type: 'drag', mode: 'order', arrows: true,
      prompt: 'Arraste do ' + kw('MENOR', ORANGE) + ' para o ' + kw('MAIOR', ORANGE),
      areaClass: 'order-size',
      items: shuffle(['s', 'm', 'l']).map(function (s) { return { html: E(e, 'sz-' + s), key: s, label: SIZE_LABEL[s] }; }),
      zones: ['s', 'm', 'l'].map(function (s) { return { html: E(e, 'shadow sz-' + s), key: s, cls: 'slot slot-' + s, label: 'lugar do ' + SIZE_LABEL[s] }; })
    };
  }
  function tLigarTamanho3() {
    var e = pick(PETS);
    return {
      type: 'match',
      prompt: 'Ligue cada bichinho à casinha do ' + kw('SEU TAMANHO', ORANGE),
      left: shuffle(['s', 'm', 'l']).map(function (s) { return { html: E(e, 'msz-' + s), pair: s, label: 'bichinho ' + SIZE_LABEL[s] }; }),
      right: shuffle(['s', 'm', 'l']).map(function (s) { return { html: E('🏠', 'msz-' + s), pair: s, label: 'casinha ' + SIZE_LABEL[s] }; })
    };
  }
  function tMemoriaTamanho2() {
    var es = sample(['🐢', '🍎', '🐟', '⭐', '🐰', '🚗'], 2), cards = [];
    es.forEach(function (e) {
      ['s', 'l'].forEach(function (s) {
        var c = { html: E(e, 'mem-' + s), pair: e + s, label: e + ' ' + SIZE_LABEL[s] };
        cards.push(c, c);
      });
    });
    return { type: 'memory', prompt: 'Ache os pares ' + kw('IGUAIS', ORANGE) + ' (do mesmo tamanho!)', cards: shuffle(cards) };
  }

  /* ---------- Médio ---------- */
  function tCompridoCurto() {
    var long = Math.random() < .5, ls = sample([80, 140, 200, 260], 3);
    var max = Math.max.apply(null, ls), min = Math.min.apply(null, ls);
    var cols = sample(['#FFD60A', '#EF476F', '#06D6A0', '#4CC9F0', '#9B5DE5'], 3);
    return {
      type: 'choice',
      prompt: 'Toque no lápis ' + kw(long ? 'MAIS COMPRIDO' : 'MAIS CURTO', ORANGE),
      layout: 'stack', optClass: 'opts-pencil',
      options: ls.map(function (l, i) { return { html: Art.pencil(l, cols[i]), correct: long ? l === max : l === min, label: 'lápis' }; })
    };
  }
  var WEIGHTS = [['🐘', '🐶', '🐭'], ['🚚', '🚲', '🎈'], ['🦛', '🐱', '🐦'], ['🐻', '🐰', '🐝'], ['🐄', '🐔', '🦋'], ['🦏', '🐑', '🐤']];
  function tPesadoLeve() {
    var heavy = Math.random() < .5, t = pick(WEIGHTS);
    return {
      type: 'choice',
      prompt: 'Quem é ' + kw(heavy ? 'MAIS PESADO' : 'MAIS LEVE', ORANGE) + '?',
      hint: E('⚖️'), optClass: 'opts-emoji',
      options: shuffle([0, 1, 2]).map(function (i) { return { html: E(t[i]), correct: heavy ? i === 0 : i === 2, label: t[i] }; })
    };
  }
  function tOrdenar4() {
    var e = pick(SIZE_EMOJIS), up = Math.random() < .5;
    var S = { 1: 6, 2: 9.5, 3: 13.5, 4: 18 }, keys = ['1', '2', '3', '4'];
    var order = up ? keys : keys.slice().reverse();
    return {
      type: 'drag', mode: 'order', arrows: true,
      prompt: 'Arraste do ' + kw(up ? 'MENOR' : 'MAIOR', ORANGE) + ' para o ' + kw(up ? 'MAIOR' : 'MENOR', ORANGE),
      areaClass: 'order-size order-size4',
      items: shuffle(keys).map(function (k) { return { html: Es(e, S[k]), key: k, label: 'tamanho ' + k }; }),
      zones: order.map(function (k, i) { return { html: '', key: k, cls: 'slot slot4-' + k, label: 'espaço ' + (i + 1) }; })
    };
  }
  function tLigarTamanho4() {
    var e = pick(PETS), S = { 1: 3.8, 2: 6.2, 3: 8.6, 4: 11 }, ks = ['1', '2', '3', '4'];
    return {
      type: 'match',
      prompt: 'Ligue cada bichinho à casinha do ' + kw('SEU TAMANHO', ORANGE),
      left: shuffle(ks).map(function (k) { return { html: Es(e, S[k]), pair: k, label: 'bichinho tamanho ' + k }; }),
      right: shuffle(ks).map(function (k) { return { html: Es('🏠', S[k]), pair: k, label: 'casinha tamanho ' + k }; })
    };
  }
  function tMemoriaTamanho3() {
    var es = sample(['🐢', '🍎', '🐟', '⭐', '🐰', '🚗'], 2), S = { s: 4.5, m: 8, l: 12 }, cards = [];
    es.forEach(function (e) {
      ['s', 'm', 'l'].forEach(function (s) {
        var c = { html: Es(e, S[s]), pair: e + s, label: e + ' ' + SIZE_LABEL[s] };
        cards.push(c, c);
      });
    });
    return { type: 'memory', cols: 6, prompt: 'Ache os pares ' + kw('IGUAIS', ORANGE) + ': pequeno, médio e grande!', cards: shuffle(cards) };
  }

  /* ---------- Difícil ---------- */
  function tCheioVazio() {
    var full = Math.random() < .5, lv = shuffle([0.12, 0.38, 0.64, 0.92]);
    return {
      type: 'choice',
      prompt: 'Toque no copo ' + kw(full ? 'MAIS CHEIO' : 'MAIS VAZIO', ORANGE),
      optClass: 'opts-glass',
      options: lv.map(function (l) { return { html: Art.glass(l), correct: full ? l === 0.92 : l === 0.12, label: 'copo' }; })
    };
  }
  var BOX_COLORS = [['#EF476F', 'vermelha'], ['#118AB2', 'azul'], ['#06D6A0', 'verde'], ['#FFC93C', 'amarela'], ['#9B5DE5', 'roxa']];
  function tBalanca() {
    var cs = sample(BOX_COLORS, 2), heavyLeft = Math.random() < .5, askHeavy = Math.random() < .5, heavyIdx = heavyLeft ? 0 : 1;
    return {
      type: 'choice',
      prompt: 'Na balança, qual caixa é ' + kw(askHeavy ? 'MAIS PESADA' : 'MAIS LEVE', ORANGE) + '?',
      hint: E('⚖️'),
      stage: '<span class="balance" style="--tilt:' + (heavyLeft ? -13 : 13) + 'deg">' +
        '<span class="bal-beam">' +
          '<span class="bal-pan left"><span class="bal-obj">' + Art.box(cs[0][0]) + '</span><i class="bal-plate"></i></span>' +
          '<span class="bal-pan right"><span class="bal-obj">' + Art.box(cs[1][0]) + '</span><i class="bal-plate"></i></span>' +
        '</span><span class="bal-post"></span><span class="bal-base"></span></span>',
      optClass: 'opts-shape',
      options: [0, 1].map(function (i) { return { html: Art.box(cs[i][0]), correct: askHeavy ? i === heavyIdx : i !== heavyIdx, label: 'caixa ' + cs[i][1] }; })
    };
  }
  function tOrdenarTorres() {
    var hs = sample([2, 3, 4, 5, 6, 7], 4).sort(function (a, b) { return a - b; });
    return {
      type: 'drag', mode: 'order', arrows: true,
      prompt: 'Arraste da torre ' + kw('MAIS BAIXA', ORANGE) + ' para a ' + kw('MAIS ALTA', ORANGE),
      areaClass: 'order-towers',
      items: shuffle(hs).map(function (n) { return { html: tower(n, 'xs'), key: String(n), label: 'torre com ' + n + ' blocos' }; }),
      zones: hs.map(function (n, i) { return { html: '', key: String(n), cls: 'slot tower-slot', label: 'espaço ' + (i + 1) }; })
    };
  }
  function tLigarComprimento() {
    var ls = sample([60, 110, 160, 210, 260], 4), c1 = pick(['#FFD60A', '#EF476F', '#06D6A0']), c2 = '#4CC9F0';
    return {
      type: 'match',
      prompt: 'Ligue os lápis do ' + kw('MESMO TAMANHO', ORANGE),
      left: shuffle(ls).map(function (l) { return { html: Art.pencil(l, c1), pair: String(l), label: 'lápis', cls: 'wide pen' }; }),
      right: shuffle(ls).map(function (l) { return { html: Art.pencil(l, c2), pair: String(l), label: 'lápis', cls: 'wide pen' }; })
    };
  }
  function tMemoriaTorres() {
    var cards = [];
    sample([2, 3, 4, 5, 6, 7], 6).forEach(function (n) {
      var label = 'torre com ' + n + ' blocos';
      cards.push({ html: tower(n, 'mem'), pair: String(n), label: label }, { html: tower(n, 'mem'), pair: String(n), label: label });
    });
    return { type: 'memory', cols: 6, prompt: 'Ache as torres da ' + kw('MESMA ALTURA', ORANGE), cards: shuffle(cards) };
  }

  /* #########################################################
     ILHA 2 — NÚMEROS (Contagem e Quantidades)
     ######################################################### */
  var COUNT_EMOJIS = ['🍎', '🐞', '⭐', '🐟', '🍓', '🐥', '🌸', '🎈', '🍌', '🐸', '🚗', '🍪', '🦋', '🐝'];
  var FRUITS = ['🍎', '🍓', '🍌', '🍊', '🍐', '🍇', '🥕'];

  /* ---------- Fácil ---------- */
  function nContar10() {
    var n = rand(2, 10), e = pick(COUNT_EMOJIS);
    return { type: 'choice', prompt: 'Quantos ' + E(e, 'inline') + ' tem aqui?', stage: group(e, n), optClass: 'opts-num', options: numChoice(n, 3, 1, 10) };
  }
  function nMaisMenos() {
    var more = Math.random() < .5, e = pick(COUNT_EMOJIS), a = rand(1, 7), b;
    do { b = rand(1, 9); } while (Math.abs(a - b) < 2);
    return {
      type: 'choice',
      prompt: 'Onde tem ' + kw(more ? 'MAIS' : 'MENOS', PURPLE) + '?',
      optClass: 'opts-group',
      options: shuffle([a, b]).map(function (x) {
        return { html: group(e, x, 'small'), correct: more ? x === Math.max(a, b) : x === Math.min(a, b), label: 'grupo com ' + x };
      })
    };
  }
  function cesta(target, total) {
    var e = pick(FRUITS);
    return {
      type: 'drag', mode: 'count', target: target,
      prompt: 'Coloque ' + kw(String(target), PURPLE) + ' ' + E(e, 'inline') + ' na cesta e aperte ' + kw('PRONTO', GREEN),
      areaClass: 'count-drag' + (total > 10 ? ' big' : ''),
      items: rep({ html: E(e), key: 'x', label: 'fruta' }, total),
      zones: [{ html: Art.basket(), key: 'x', cls: 'basket-zone', label: 'cesta' }]
    };
  }
  function nSeparar6() { var t = rand(2, 6); return cesta(t, Math.min(10, t + rand(3, 4))); }
  function ligarQuantidade(k, max) {
    var nums = sample(range(1, max), k), e = pick(COUNT_EMOJIS);
    return {
      type: 'match',
      prompt: 'Ligue o número à ' + kw('QUANTIDADE', PURPLE),
      left: shuffle(nums).map(function (n) { return { html: numeral(n), pair: String(n), label: 'número ' + n }; }),
      right: shuffle(nums).map(function (n) { return { html: miniGroup(e, n), pair: String(n), label: n + ' figuras', cls: 'wide' }; })
    };
  }
  function nLigar8() { return ligarQuantidade(3, 8); }
  function memoriaBolinhas(k) {
    var cards = [];
    sample(range(1, 9), k).forEach(function (n) {
      cards.push({ html: numeral(n), pair: String(n), label: 'número ' + n });
      cards.push({ html: Art.dots(n), pair: String(n), label: n + ' bolinhas' });
    });
    return { type: 'memory', cols: k > 4 ? 6 : 4, prompt: 'Junte o número com as ' + kw('BOLINHAS', PURPLE), cards: shuffle(cards) };
  }
  function nMemoriaBolinhas4() { return memoriaBolinhas(4); }

  /* ---------- Médio ---------- */
  function nFalta10() {
    var s = rand(1, 7), miss = rand(1, 3), seq = [s, s + 1, s + 2, s + 3], ans = seq[miss];
    var pool = range(1, 10).filter(function (x) { return seq.indexOf(x) < 0; });
    pool.sort(function (p, q) { return Math.abs(p - ans) - Math.abs(q - ans); });
    var opts = shuffle([ans].concat(sample(pool.slice(0, 4), 2)));
    return {
      type: 'choice',
      prompt: 'Qual número ' + kw('FALTA', PURPLE) + '?',
      stage: trackHtml(seq, miss, false), stageReveal: trackHtml(seq, miss, true),
      optClass: 'opts-num',
      options: opts.map(function (x) { return { html: numeral(x), correct: x === ans, label: 'número ' + x }; })
    };
  }
  function nContar15() {
    var n = rand(8, 15), e = pick(COUNT_EMOJIS);
    return { type: 'choice', prompt: 'Quantos ' + E(e, 'inline') + ' tem aqui?', stage: groupList(rep(e, n), 6, 3), optClass: 'opts-num', options: numChoice(n, 4, 1, 20) };
  }
  function nSeparar10() { return cesta(rand(6, 10), 12); }
  function nLigar10() { return ligarQuantidade(4, 10); }
  function nMemoriaBolinhas6() { return memoriaBolinhas(6); }

  /* ---------- Difícil ---------- */
  function nJuntar() {
    var a = rand(1, 5), b = rand(1, 5), sum = a + b, e = pick(COUNT_EMOJIS);
    function eq(res) {
      return '<span class="mix add">' + miniGroup(e, a) + '<b>+</b>' + miniGroup(e, b) + '<b>=</b>' +
        (res ? '<span class="add-res">' + sum + '</span>' : '<span class="mix-q">?</span>') + '</span>';
    }
    return {
      type: 'choice',
      prompt: 'Juntando tudo, ' + kw('QUANTOS SÃO', PURPLE) + '?',
      stage: eq(false), stageReveal: eq(true),
      optClass: 'opts-num', options: numChoice(sum, 3, 1, 10)
    };
  }
  function nSeletiva() {
    var two = sample(COUNT_EMOJIS, 2), m = rand(3, 9), d = rand(3, Math.min(6, 15 - m));
    return {
      type: 'choice',
      prompt: 'Conte ' + kw('SÓ', PURPLE) + ' os ' + E(two[0], 'inline') + '. Quantos são?',
      stage: groupList(rep(two[0], m).concat(rep(two[1], d)), 6, 3),
      optClass: 'opts-num', options: numChoice(m, 4, 1, 15)
    };
  }
  function nOrdenarNumeros() {
    var s = rand(1, 11), nums = range(s, s + 4);
    return {
      type: 'drag', mode: 'order',
      prompt: 'Coloque os números em ' + kw('ORDEM', PURPLE) + ' (do menor para o maior)',
      areaClass: 'build-word num-order',
      items: shuffle(nums).map(function (n) { return { html: numeral(n), key: String(n), label: 'número ' + n, cls: 'tile' }; }),
      zones: nums.map(function (n, i) { return { html: '', key: String(n), cls: 'slot letter-slot', label: 'espaço ' + (i + 1) }; })
    };
  }
  function nLigarMesmaQuantidade() {
    var nums = sample(range(1, 9), 4), es = sample(COUNT_EMOJIS, 2);
    return {
      type: 'match',
      prompt: 'Ligue os grupos com a ' + kw('MESMA QUANTIDADE', PURPLE),
      left: shuffle(nums).map(function (n) { return { html: miniGroup(es[0], n), pair: String(n), label: n + ' figuras', cls: 'wide' }; }),
      right: shuffle(nums).map(function (n) { return { html: miniGroup(es[1], n), pair: String(n), label: n + ' figuras', cls: 'wide' }; })
    };
  }
  function nMemoriaFiguras() {
    var e = pick(COUNT_EMOJIS), cards = [];
    sample(range(1, 10), 6).forEach(function (n) {
      cards.push({ html: numeral(n), pair: String(n), label: 'número ' + n });
      cards.push({ html: miniGroup(e, n), pair: String(n), label: n + ' figuras' });
    });
    return { type: 'memory', cols: 6, prompt: 'Junte o número com a ' + kw('QUANTIDADE', PURPLE), cards: shuffle(cards) };
  }

  /* #########################################################
     ILHA 3 — CORES
     ######################################################### */
  var COLORS = [
    { id: 'vermelho', m: 'VERMELHO', f: 'VERMELHA', hex: '#E63946', fg: '#fff', objs: ['🍓', '🍎', '🍒', '🍅', '🚒'] },
    { id: 'amarelo', m: 'AMARELO', f: 'AMARELA', hex: '#FFD60A', fg: '#3b2f00', objs: ['🍌', '🌻', '🐥', '🧀', '🍋'] },
    { id: 'azul', m: 'AZUL', f: 'AZUL', hex: '#1E88E5', fg: '#fff', objs: ['🐳', '💧', '💙', '🌊'] },
    { id: 'verde', m: 'VERDE', f: 'VERDE', hex: '#2DC653', fg: '#fff', objs: ['🐸', '🥦', '🍀', '🥒', '🍏'] },
    { id: 'laranja', m: 'LARANJA', f: 'LARANJA', hex: '#FF8C1A', fg: '#fff', objs: ['🍊', '🥕', '🎃', '🏀', '🦊'] },
    { id: 'roxo', m: 'ROXO', f: 'ROXA', hex: '#8E44AD', fg: '#fff', objs: ['🍇', '🍆', '💜'] }
  ];
  var COLORS_PLUS = COLORS.concat([
    { id: 'rosa', m: 'ROSA', f: 'ROSA', hex: '#FF6FB5', fg: '#5a0036', objs: ['🐷', '🌸', '🦩'] },
    { id: 'marrom', m: 'MARROM', f: 'MARROM', hex: '#8D5524', fg: '#fff', objs: ['🐻', '🍫', '🌰', '🥔'] }
  ]);
  var BRANCO = { id: 'branco', m: 'BRANCO', hex: '#FFFFFF', fg: '#1D3557' };
  function color(id) { return id === 'branco' ? BRANCO : COLORS_PLUS.filter(function (c) { return c.id === id; })[0]; }
  var SHAPE_NAMES = {
    balloon: { art: 'no balão', fem: false }, star: { art: 'na estrela', fem: true },
    heart: { art: 'no coração', fem: false }, flower: { art: 'na flor', fem: true }, fish: { art: 'no peixe', fem: false }
  };
  var SHAPE_KEYS = Object.keys(SHAPE_NAMES);
  var MIXES = [['vermelho', 'amarelo', 'laranja'], ['azul', 'amarelo', 'verde'], ['vermelho', 'azul', 'roxo']];
  var MIXES_PLUS = MIXES.concat([['vermelho', 'branco', 'rosa']]);

  function acharCor(palette, n) {
    var shape = pick(SHAPE_KEYS), cs = sample(palette, n), t = pick(cs), info = SHAPE_NAMES[shape];
    return {
      type: 'choice',
      prompt: 'Toque ' + info.art + ' ' + kw(info.fem ? t.f : t.m, t.hex, t.fg),
      hint: swatch(t.hex),
      optClass: 'opts-shape' + (n > 4 ? ' six' : ''),
      options: cs.map(function (c) { return { html: Art.shape(shape, c.hex), correct: c === t, label: c.m.toLowerCase() }; })
    };
  }
  function separarCores(k) {
    var cs = sample(k > 3 ? COLORS_PLUS : COLORS, k), items = [];
    cs.forEach(function (c) {
      sample(SHAPE_KEYS, 2).forEach(function (s) { items.push({ html: Art.shape(s, c.hex), key: c.id, label: c.m.toLowerCase() }); });
    });
    return {
      type: 'drag', mode: 'sort',
      prompt: 'Coloque cada um no cesto da ' + kw('MESMA COR', PINK),
      areaClass: 'sort-colors' + (k > 3 ? ' sort4' : ''),
      items: shuffle(items),
      zones: cs.map(function (c) { return { html: Art.basket(c.hex), key: c.id, cls: 'basket-zone', label: 'cesto ' + c.m.toLowerCase() }; })
    };
  }
  function ligarCores(k) {
    var cs = sample(k > 3 ? COLORS_PLUS : COLORS, k);
    return {
      type: 'match',
      prompt: 'Ligue cada figura à sua ' + kw('COR', PINK),
      left: shuffle(cs).map(function (c) { return { html: E(pick(c.objs)), pair: c.id, label: 'figura ' + c.m.toLowerCase() }; }),
      right: shuffle(cs).map(function (c) { return { html: Art.shape('splat', c.hex), pair: c.id, label: 'tinta ' + c.m.toLowerCase() }; })
    };
  }
  function memoriaGiz(k) {
    var cs = sample(k > 4 ? COLORS_PLUS : COLORS, k), cards = [];
    cs.forEach(function (c) {
      cards.push({ html: Art.shape('crayon', c.hex), pair: c.id, label: 'giz ' + c.m.toLowerCase() });
      cards.push({ html: E(pick(c.objs)), pair: c.id, label: 'figura ' + c.m.toLowerCase() });
    });
    return { type: 'memory', cols: k > 4 ? 6 : 4, prompt: 'Junte o giz com a figura da ' + kw('MESMA COR', PINK), cards: shuffle(cards) };
  }

  /* ---------- Fácil ---------- */
  function cAcharCor() { return acharCor(COLORS, 4); }
  function cCorDoObjeto() {
    var cs = sample(COLORS, 3), t = cs[0];
    return {
      type: 'choice',
      prompt: 'Qual destes é ' + kw(t.m, t.hex, t.fg) + '?',
      hint: swatch(t.hex), optClass: 'opts-emoji',
      options: shuffle(cs.map(function (c) { return { html: E(pick(c.objs)), correct: c === t, label: c.m.toLowerCase() }; }))
    };
  }
  function cSeparar3() { return separarCores(3); }
  function cLigar3() { return ligarCores(3); }
  function cMemoria4() { return memoriaGiz(4); }

  /* ---------- Médio ---------- */
  function cMistura() {
    var m = pick(MIXES), a = color(m[0]), b = color(m[1]), r = color(m[2]);
    function eq(res) {
      return '<span class="mix">' + Art.shape('splat', a.hex) + '<b>+</b>' + Art.shape('splat', b.hex) + '<b>=</b>' +
        (res ? Art.shape('splat', r.hex) : '<span class="mix-q">?</span>') + '</span>';
    }
    return {
      type: 'choice',
      prompt: 'Misturando as tintas, qual cor ' + kw('APARECE', PINK) + '?',
      stage: eq(false), stageReveal: eq(true), optClass: 'opts-shape',
      options: shuffle(['laranja', 'verde', 'roxo']).map(function (id) {
        var c = color(id);
        return { html: Art.shape('splat', c.hex), correct: id === r.id, label: c.m.toLowerCase(), reveal: c.m };
      })
    };
  }
  function cAcharMaisCores() { return acharCor(COLORS_PLUS, 6); }
  function cSeparar4() { return separarCores(4); }
  function cLigar4() { return ligarCores(4); }
  function cMemoria6() { return memoriaGiz(6); }

  /* ---------- Difícil ---------- */
  function cFormaECor() {
    var S = pick(SHAPE_KEYS), C = pick(COLORS_PLUS), info = SHAPE_NAMES[S];
    var oc = sample(COLORS_PLUS.filter(function (c) { return c !== C; }), 3);
    var os = sample(SHAPE_KEYS.filter(function (s) { return s !== S; }), 3);
    var opts = [{ s: S, c: C, ok: true }, { s: S, c: oc[0] }, { s: S, c: oc[1] }, { s: os[0], c: C }, { s: os[1], c: C }, { s: os[2], c: oc[2] }];
    return {
      type: 'choice',
      prompt: 'Toque ' + info.art + ' ' + kw(info.fem ? C.f : C.m, C.hex, C.fg),
      hint: '<span class="hint-shape">' + Art.shape(S, '#B8C2CF') + '</span>' + swatch(C.hex),
      optClass: 'opts-shape six',
      options: shuffle(opts).map(function (o) { return { html: Art.shape(o.s, o.c.hex), correct: !!o.ok, label: o.c.m.toLowerCase() }; })
    };
  }
  function cNaoEDaCor() {
    var two = sample(COLORS_PLUS, 2), T = two[0], O = two[1];
    var opts = sample(T.objs, 3).map(function (e) { return { html: E(e), correct: false, label: T.m.toLowerCase() }; });
    opts.push({ html: E(pick(O.objs)), correct: true, label: O.m.toLowerCase() });
    return {
      type: 'choice',
      prompt: 'Qual destes ' + kw('NÃO', '#1D3557') + ' é ' + kw(T.m, T.hex, T.fg) + '?',
      hint: '<span class="swatch no" style="background:' + T.hex + '"></span>',
      optClass: 'opts-emoji', options: shuffle(opts)
    };
  }
  function cSequenciaCores() {
    var shape = pick(['balloon', 'star', 'heart', 'flower']), cs = sample(COLORS, 4);
    var A = cs[0], B = cs[1], C = cs[2], D = cs[3];
    var p = pick([
      { pre: [A, B, A, B], next: [A, B], extra: [C, D] },
      { pre: [A, A, B, A], next: [A, B], extra: [C, D] },
      { pre: [A, B, B, A], next: [B, B], extra: [A, C] },
      { pre: [A, B, C, A], next: [B, C], extra: [A, D] }
    ]);
    return {
      type: 'drag', mode: 'order',
      prompt: 'Continue a ' + kw('SEQUÊNCIA', PINK) + ' de cores',
      areaClass: 'pattern-drag',
      zonesBefore: p.pre.map(function (c) { return '<span class="pcell">' + Art.shape(shape, c.hex) + '</span>'; }).join(''),
      items: shuffle(p.next.concat(p.extra)).map(function (c) { return { html: Art.shape(shape, c.hex), key: c.id, label: c.m.toLowerCase() }; }),
      zones: p.next.map(function (c, i) { return { html: '', key: c.id, cls: 'slot pat-slot', label: 'espaço ' + (i + 1) }; })
    };
  }
  function cLigarMistura() {
    function eq(x) { return '<span class="mixrev">' + Art.shape('splat', color(x[0]).hex) + '<b>+</b>' + Art.shape('splat', color(x[1]).hex) + '</span>'; }
    return {
      type: 'match',
      prompt: 'Ligue cada mistura à ' + kw('COR QUE FORMA', PINK),
      left: shuffle(MIXES_PLUS).map(function (x) { return { html: eq(x), pair: x[2], label: color(x[0]).m.toLowerCase() + ' com ' + color(x[1]).m.toLowerCase(), cls: 'wide' }; }),
      right: shuffle(MIXES_PLUS).map(function (x) { return { html: Art.shape('splat', color(x[2]).hex), pair: x[2], label: color(x[2]).m.toLowerCase() }; })
    };
  }
  var SHADES = [
    ['azul claro', '#90CAF9'], ['azul escuro', '#1565C0'], ['verde claro', '#A5D6A7'], ['verde escuro', '#2E7D32'],
    ['roxo claro', '#CE93D8'], ['roxo escuro', '#6A1B9A'], ['laranja claro', '#FFCC80'], ['laranja escuro', '#E65100']
  ];
  function cMemoriaTons() {
    var cards = [];
    sample([[0, 1], [2, 3], [4, 5], [6, 7]], 3).forEach(function (hp) {
      hp.forEach(function (i) {
        var sh = SHADES[i], c = { html: Art.shape('splat', sh[1]), pair: sh[0], label: sh[0] };
        cards.push(c, c);
      });
    });
    return { type: 'memory', cols: 6, prompt: 'Ache os pares da ' + kw('MESMA COR', PINK) + ': clara ou escura!', cards: shuffle(cards) };
  }

  /* #########################################################
     ILHA 4 — LETRAS E PALAVRAS
     ######################################################### */
  var WORDS = [
    ['ABELHA', '🐝'], ['AVIÃO', '✈️'], ['ABACAXI', '🍍'],
    ['BOLA', '⚽'], ['BALÃO', '🎈'], ['BOLO', '🎂'], ['BANANA', '🍌'],
    ['CASA', '🏠'], ['CACHORRO', '🐶'], ['CAVALO', '🐴'],
    ['DADO', '🎲'], ['DINOSSAURO', '🦕'], ['DENTE', '🦷'],
    ['ELEFANTE', '🐘'], ['ESTRELA', '⭐'],
    ['FOGO', '🔥'], ['FOGUETE', '🚀'], ['FLOR', '🌸'],
    ['GATO', '🐱'], ['GIRAFA', '🦒'], ['GALINHA', '🐔'],
    ['ILHA', '🏝️'], ['IGREJA', '⛪'],
    ['JACARÉ', '🐊'], ['JOANINHA', '🐞'],
    ['LEÃO', '🦁'], ['LUA', '🌙'], ['LIVRO', '📖'],
    ['MACACO', '🐵'], ['MAÇÃ', '🍎'], ['MELANCIA', '🍉'],
    ['NUVEM', '☁️'],
    ['OVO', '🥚'], ['OVELHA', '🐑'],
    ['PATO', '🦆'], ['PEIXE', '🐟'], ['PIZZA', '🍕'], ['PINGUIM', '🐧'],
    ['QUEIJO', '🧀'],
    ['RATO', '🐭'], ['RAPOSA', '🦊'],
    ['SAPO', '🐸'], ['SOL', '☀️'], ['SORVETE', '🍦'],
    ['TARTARUGA', '🐢'], ['TOMATE', '🍅'], ['TIGRE', '🐯'], ['TREM', '🚂'],
    ['UVA', '🍇'], ['URSO', '🐻'], ['UNICÓRNIO', '🦄'],
    ['VACA', '🐮'], ['VELA', '🕯️'],
    ['ZEBRA', '🦓']
  ].map(function (p) { return { w: p[0], e: p[1], l: p[0].charAt(0) }; });
  var LETTERS = [];
  WORDS.forEach(function (x) { if (LETTERS.indexOf(x.l) < 0) LETTERS.push(x.l); });
  var LETTERS2 = LETTERS.filter(function (l) { return WORDS.filter(function (w) { return w.l === l; }).length >= 2; });
  var PLAIN = WORDS.filter(function (w) { return /^[A-Z]{3,7}$/.test(w.w); });
  var SHORT = WORDS.filter(function (w) { return w.w.length <= 6; });
  var ALPHA = 'ABCDEFGIJLMNOPRSTUVZ'.split('');
  var UPLOW = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'N', 'Q', 'R', 'T'];

  function wordsDistinctInitials(n, pool) {
    pool = pool || WORDS;
    var ls = sample(LETTERS.filter(function (l) { return pool.some(function (w) { return w.l === l; }); }), n);
    return ls.map(function (l) { return pick(pool.filter(function (x) { return x.l === l; })); });
  }
  function wordHtml(w) { return '<span class="word"><b>' + w.charAt(0) + '</b>' + w.slice(1) + '</span>'; }
  function construir(list, extras, cls) {
    var b = pick(list), w = b[0];
    var ex = sample('ABCDEFGILMNOPRSTUV'.split('').filter(function (x) { return w.indexOf(x) < 0; }), extras);
    return {
      type: 'drag', mode: 'order',
      prompt: 'Monte a palavra ' + kw(w, GREEN),
      stage: '<span class="word-model">' + E(b[1]) + '<span class="model">' + w + '</span></span>',
      areaClass: 'build-word' + (cls ? ' ' + cls : ''),
      items: shuffle(w.split('').concat(ex)).map(function (l) { return { html: letter(l), key: l, label: 'letra ' + l, cls: 'tile' }; }),
      zones: w.split('').map(function (l, i) { return { html: '', key: l, cls: 'slot letter-slot', label: 'espaço ' + (i + 1) }; })
    };
  }
  function memoriaMaiMin(letters, cols) {
    var cards = [];
    letters.forEach(function (l) {
      cards.push({ html: letter(l), pair: l, label: 'letra ' + l + ' maiúscula' });
      cards.push({ html: letter(l.toLowerCase(), 'lower'), pair: l, label: 'letra ' + l.toLowerCase() + ' minúscula' });
    });
    return { type: 'memory', cols: cols, prompt: 'Junte a ' + kw('MAIÚSCULA', GREEN) + ' com a ' + kw('minúscula', GREEN), cards: shuffle(cards) };
  }

  /* ---------- Fácil ---------- */
  var SIMILAR = [
    ['E', 'F', 'B', 'P'], ['O', 'Q', 'C', 'G'], ['M', 'N', 'W', 'V'], ['P', 'R', 'B', 'D'],
    ['I', 'L', 'T', 'J'], ['U', 'V', 'Y', 'O'], ['A', 'V', 'H', 'N'], ['S', 'Z', 'N', 'C']
  ];
  function lLetraIgual() {
    var g = pick(SIMILAR), t = pick(g);
    return {
      type: 'choice', prompt: 'Toque na letra ' + kw('IGUAL', GREEN) + ' a esta',
      stage: '<span class="model-card">' + letter(t) + '</span>', optClass: 'opts-letter',
      options: shuffle(g).map(function (x) { return { html: letter(x), correct: x === t, label: 'letra ' + x }; })
    };
  }
  function lLetraInicial() {
    var w = pick(WORDS);
    var opts = shuffle([w.l].concat(sample(LETTERS.filter(function (x) { return x !== w.l; }), 2)));
    return {
      type: 'choice', prompt: 'Com qual letra ' + kw('COMEÇA', GREEN) + '?',
      stage: '<span class="pic-card">' + E(w.e) + '</span>',
      stageReveal: '<span class="pic-card">' + E(w.e) + wordHtml(w.w) + '</span>',
      optClass: 'opts-letter',
      options: opts.map(function (x) { return { html: letter(x), correct: x === w.l, label: 'letra ' + x }; })
    };
  }
  var BUILD = [
    ['SOL', '☀️'], ['LUA', '🌙'], ['UVA', '🍇'], ['OVO', '🥚'], ['MEL', '🍯'],
    ['GATO', '🐱'], ['PATO', '🦆'], ['BOLA', '⚽'], ['CASA', '🏠'], ['DADO', '🎲'],
    ['RATO', '🐭'], ['SAPO', '🐸'], ['VACA', '🐮'], ['BOLO', '🎂'], ['URSO', '🐻'], ['FLOR', '🌸'], ['TREM', '🚂']
  ];
  function lMontarCurta() { return construir(BUILD, 1); }
  function lLigarInicial3() {
    var ws = wordsDistinctInitials(3);
    return {
      type: 'match', prompt: 'Ligue cada figura à sua ' + kw('PRIMEIRA LETRA', GREEN),
      left: shuffle(ws).map(function (w) { return { html: E(w.e), pair: w.l, label: w.w.toLowerCase() }; }),
      right: shuffle(ws).map(function (w) { return { html: letter(w.l), pair: w.l, label: 'letra ' + w.l }; })
    };
  }
  function lMemoriaVogais() { return memoriaMaiMin(sample(['A', 'E', 'I', 'O', 'U'], 4), 4); }

  /* ---------- Médio ---------- */
  function lFiguraDaLetra() {
    var ws = wordsDistinctInitials(4), t = ws[0];
    return {
      type: 'choice', prompt: 'Qual figura começa com a letra ' + kw(t.l, GREEN) + '?',
      stage: '<span class="model-card">' + letter(t.l) + '</span>', optClass: 'opts-emoji',
      options: shuffle(ws).map(function (w) { return { html: E(w.e), correct: w === t, label: w.w.toLowerCase(), reveal: wordHtml(w.w) }; })
    };
  }
  var LOWER_SIMILAR = [['b', 'd', 'p', 'q'], ['m', 'n', 'u', 'h'], ['a', 'e', 'o', 'c'], ['n', 'h', 'r', 'm'], ['g', 'q', 'p', 'j']];
  function lMinusculaIgual() {
    var g = pick(LOWER_SIMILAR), t = pick(g);
    return {
      type: 'choice', prompt: 'Toque na letra ' + kw('IGUAL', GREEN) + ' a esta',
      stage: '<span class="model-card">' + letter(t, 'lower') + '</span>', optClass: 'opts-letter',
      options: shuffle(g).map(function (x) { return { html: letter(x, 'lower'), correct: x === t, label: 'letra ' + x }; })
    };
  }
  function lSepararPorLetra() {
    var ls = sample(LETTERS2, 3), items = [];
    ls.forEach(function (l) {
      sample(WORDS.filter(function (w) { return w.l === l; }), 2).forEach(function (w) { items.push({ html: E(w.e), key: l, label: w.w.toLowerCase() }); });
    });
    return {
      type: 'drag', mode: 'sort',
      prompt: 'Coloque cada figura no cesto da sua ' + kw('PRIMEIRA LETRA', GREEN),
      areaClass: 'sort-colors sort-letters',
      items: shuffle(items),
      zones: ls.map(function (l) { return { html: Art.basket(null) + '<span class="basket-tag">' + l + '</span>', key: l, cls: 'basket-zone', label: 'cesto da letra ' + l }; })
    };
  }
  function lLigarMaiMin() {
    var ls = sample(UPLOW, 4);
    return {
      type: 'match', prompt: 'Ligue a ' + kw('MAIÚSCULA', GREEN) + ' com a ' + kw('minúscula', GREEN),
      left: shuffle(ls).map(function (l) { return { html: letter(l), pair: l, label: 'letra ' + l + ' maiúscula' }; }),
      right: shuffle(ls).map(function (l) { return { html: letter(l.toLowerCase(), 'lower'), pair: l, label: 'letra ' + l.toLowerCase() + ' minúscula' }; })
    };
  }
  function lMemoriaInicial() {
    var cards = [];
    wordsDistinctInitials(6).forEach(function (w) {
      cards.push({ html: E(w.e), pair: w.l, label: w.w.toLowerCase() });
      cards.push({ html: letter(w.l), pair: w.l, label: 'letra ' + w.l });
    });
    return { type: 'memory', cols: 6, prompt: 'Junte a figura com a sua ' + kw('PRIMEIRA LETRA', GREEN), cards: shuffle(cards) };
  }

  /* ---------- Difícil ---------- */
  function lLetraQueFalta() {
    var w = pick(PLAIN), i = rand(0, w.w.length - 1), L = w.w.charAt(i);
    function word(fill) {
      return '<span class="word gapword">' + w.w.split('').map(function (c, j) {
        if (j !== i) return c;
        return fill ? '<b>' + c + '</b>' : '<i class="blank">?</i>';
      }).join('') + '</span>';
    }
    return {
      type: 'choice', prompt: 'Qual letra ' + kw('FALTA', GREEN) + '?',
      stage: '<span class="pic-card">' + E(w.e) + word(false) + '</span>',
      stageReveal: '<span class="pic-card">' + E(w.e) + word(true) + '</span>',
      optClass: 'opts-letter',
      options: shuffle([L].concat(sample(ALPHA.filter(function (x) { return x !== L; }), 3)))
        .map(function (x) { return { html: letter(x), correct: x === L, label: 'letra ' + x }; })
    };
  }
  var SIMILAR_WORDS = [
    ['GATO', 'PATO', 'RATO', 'GALO'], ['BOLA', 'BOLO', 'COLA', 'MOLA'], ['CASA', 'CAMA', 'CAPA', 'ASA'],
    ['VACA', 'FACA', 'VELA', 'VARA'], ['DADO', 'DEDO', 'LADO', 'NADO'], ['LUA', 'RUA', 'LUVA', 'LATA'],
    ['MALA', 'BALA', 'SALA', 'MAPA'], ['SAPO', 'SACO', 'PAPO', 'SOPA']
  ];
  function lPalavraIgual() {
    var g = pick(SIMILAR_WORDS), t = pick(g);
    return {
      type: 'choice', prompt: 'Toque na palavra ' + kw('IGUAL', GREEN) + ' a esta',
      stage: '<span class="model-card word-card">' + t + '</span>', optClass: 'opts-word',
      options: shuffle(g).map(function (w) { return { html: '<span class="wtxt">' + w + '</span>', correct: w === t, label: w.toLowerCase() }; })
    };
  }
  var BUILD_LONG = [
    ['PEIXE', '🐟'], ['GIRAFA', '🦒'], ['BANANA', '🍌'], ['CAVALO', '🐴'], ['MACACO', '🐵'], ['PIPOCA', '🍿'],
    ['TOMATE', '🍅'], ['SAPATO', '👞'], ['CAMELO', '🐫'], ['ESCOLA', '🏫'], ['LIVRO', '📖'], ['TIGRE', '🐯'],
    ['ZEBRA', '🦓'], ['PANDA', '🐼'], ['COBRA', '🐍'], ['PIZZA', '🍕']
  ];
  function lMontarLonga() { return construir(BUILD_LONG, 2, 'long'); }
  function lLigarPalavra() {
    var ws = wordsDistinctInitials(4, SHORT);
    return {
      type: 'match', prompt: 'Ligue cada figura à sua ' + kw('PALAVRA', GREEN),
      left: shuffle(ws).map(function (w) { return { html: E(w.e), pair: w.l, label: w.w.toLowerCase() }; }),
      right: shuffle(ws).map(function (w) { return { html: '<span class="wtxt">' + w.w + '</span>', pair: w.l, label: w.w.toLowerCase(), cls: 'wide word' }; })
    };
  }
  function lMemoriaMaiMin6() { return memoriaMaiMin(sample(UPLOW.concat(['U', 'I']), 6), 6); }

  /* #########################################################
     AS 60 PERGUNTAS: código, habilidade, BNCC, área e gerador
     ######################################################### */
  function Q(code, habilidade, bncc, area, gen) { return { code: code, habilidade: habilidade, bncc: bncc, area: AREA[area], gen: gen }; }

  var PHASES = [
    {
      id: 'tamanhos', name: 'Ilha dos Tamanhos', short: 'Tamanhos', assunto: 'Grandezas e Comparações',
      icon: E('🦒'), color: '#FF8C1A', grass: '#FFB347', theme: 'theme-orange',
      levels: {
        facil: [
          Q('TAM-F1', 'Comparar tamanhos: maior e menor', 'EI03ET01', 'ET', tMaiorMenor),
          Q('TAM-F2', 'Comparar alturas: mais alto e mais baixo', 'EI03ET01', 'ET', tAltoBaixo),
          Q('TAM-F3', 'Ordenar 3 objetos do menor para o maior', 'EI03ET01', 'ET', tOrdenar3),
          Q('TAM-F4', 'Relacionar objetos de mesmo tamanho', 'EI03ET05', 'ET', tLigarTamanho3),
          Q('TAM-F5', 'Diferenciar tamanhos iguais e diferentes (memória)', 'EI03ET05', 'ET', tMemoriaTamanho2)
        ],
        medio: [
          Q('TAM-M1', 'Comparar comprimentos: comprido e curto', 'EI03ET01', 'ET', tCompridoCurto),
          Q('TAM-M2', 'Comparar pesos: pesado e leve', 'EI03ET01', 'ET', tPesadoLeve),
          Q('TAM-M3', 'Ordenar 4 objetos por tamanho (crescente e decrescente)', 'EI03ET01', 'ET', tOrdenar4),
          Q('TAM-M4', 'Relacionar 4 tamanhos diferentes', 'EI03ET05', 'ET', tLigarTamanho4),
          Q('TAM-M5', 'Diferenciar pequeno, médio e grande (memória)', 'EI03ET05', 'ET', tMemoriaTamanho3)
        ],
        dificil: [
          Q('TAM-D1', 'Comparar recipientes: mais cheio e mais vazio', 'EI03ET01', 'ET', tCheioVazio),
          Q('TAM-D2', 'Comparar pesos usando a balança', 'EI03ET01', 'ET', tBalanca),
          Q('TAM-D3', 'Ordenar torres pela altura', 'EI03ET01', 'ET', tOrdenarTorres),
          Q('TAM-D4', 'Relacionar objetos de mesmo comprimento', 'EI03ET05', 'ET', tLigarComprimento),
          Q('TAM-D5', 'Identificar torres de mesma altura (memória)', 'EI03ET05', 'ET', tMemoriaTorres)
        ]
      }
    },
    {
      id: 'numeros', name: 'Ilha dos Números', short: 'Números', assunto: 'Contagem e Quantidades',
      icon: '<span class="island-glyph">123</span>', color: '#7B2FF7', grass: '#B794F6', theme: 'theme-purple',
      levels: {
        facil: [
          Q('NUM-F1', 'Contar objetos até 10', 'EI03ET07', 'ET', nContar10),
          Q('NUM-F2', 'Comparar quantidades: mais e menos', 'EI03ET01', 'ET', nMaisMenos),
          Q('NUM-F3', 'Separar uma quantidade pedida (até 6)', 'EI03ET07', 'ET', nSeparar6),
          Q('NUM-F4', 'Relacionar número e quantidade (até 8)', 'EI03ET07', 'ET', nLigar8),
          Q('NUM-F5', 'Reconhecer quantidades representadas por bolinhas (memória)', 'EI03ET07', 'ET', nMemoriaBolinhas4)
        ],
        medio: [
          Q('NUM-M1', 'Identificar o número que falta: antes, depois e entre', 'EI03ET07', 'ET', nFalta10),
          Q('NUM-M2', 'Contar objetos até 15', 'EI03ET07', 'ET', nContar15),
          Q('NUM-M3', 'Separar uma quantidade pedida (até 10)', 'EI03ET07', 'ET', nSeparar10),
          Q('NUM-M4', 'Relacionar número e quantidade (até 10)', 'EI03ET07', 'ET', nLigar10),
          Q('NUM-M5', 'Reconhecer quantidades de 1 a 9 por bolinhas (memória)', 'EI03ET07', 'ET', nMemoriaBolinhas6)
        ],
        dificil: [
          Q('NUM-D1', 'Juntar duas quantidades (adição com figuras)', 'EI03ET07', 'ET', nJuntar),
          Q('NUM-D2', 'Contar só um tipo de figura (contagem seletiva)', 'EI03ET07', 'ET', nSeletiva),
          Q('NUM-D3', 'Ordenar números do menor para o maior', 'EI03ET07', 'ET', nOrdenarNumeros),
          Q('NUM-D4', 'Relacionar grupos com a mesma quantidade', 'EI03ET01', 'ET', nLigarMesmaQuantidade),
          Q('NUM-D5', 'Relacionar número e quantidade de figuras (memória)', 'EI03ET07', 'ET', nMemoriaFiguras)
        ]
      }
    },
    {
      id: 'cores', name: 'Ilha das Cores', short: 'Cores', assunto: 'Cores',
      icon: E('🎨'), color: '#EF476F', grass: '#FF8FAB', theme: 'theme-pink',
      levels: {
        facil: [
          Q('COR-F1', 'Identificar cores básicas', 'EI03TS02', 'TS', cAcharCor),
          Q('COR-F2', 'Associar cores a objetos do dia a dia', 'EI03TS02', 'TS', cCorDoObjeto),
          Q('COR-F3', 'Classificar objetos por cor (3 cores)', 'EI03ET05', 'ET', cSeparar3),
          Q('COR-F4', 'Relacionar objetos à sua cor', 'EI03ET05', 'ET', cLigar3),
          Q('COR-F5', 'Associar giz de cera e figura da mesma cor (memória)', 'EI03ET05', 'ET', cMemoria4)
        ],
        medio: [
          Q('COR-M1', 'Prever a cor formada pela mistura de duas tintas', 'EI03ET02', 'ET', cMistura),
          Q('COR-M2', 'Identificar cores, incluindo rosa e marrom', 'EI03TS02', 'TS', cAcharMaisCores),
          Q('COR-M3', 'Classificar objetos por cor (4 cores)', 'EI03ET05', 'ET', cSeparar4),
          Q('COR-M4', 'Relacionar objetos à sua cor (4 cores)', 'EI03ET05', 'ET', cLigar4),
          Q('COR-M5', 'Associar giz de cera e figura da mesma cor (6 pares)', 'EI03ET05', 'ET', cMemoria6)
        ],
        dificil: [
          Q('COR-D1', 'Identificar forma e cor ao mesmo tempo', 'EI03ET05', 'ET', cFormaECor),
          Q('COR-D2', 'Identificar o que não pertence ao grupo de cor', 'EI03ET05', 'ET', cNaoEDaCor),
          Q('COR-D3', 'Continuar uma sequência (padrão) de cores', 'EI03ET05', 'ET', cSequenciaCores),
          Q('COR-D4', 'Relacionar misturas de tintas às cores formadas', 'EI03ET02', 'ET', cLigarMistura),
          Q('COR-D5', 'Diferenciar tons claros e escuros (memória)', 'EI03TS02', 'TS', cMemoriaTons)
        ]
      }
    },
    {
      id: 'letras', name: 'Ilha das Letras', short: 'Letras', assunto: 'Letras e Palavras',
      icon: '<span class="island-glyph">ABC</span>', color: '#06A77D', grass: '#7BD389', theme: 'theme-green',
      levels: {
        facil: [
          Q('LET-F1', 'Reconhecer letras iguais (discriminação visual)', 'EI03EF09', 'EF', lLetraIgual),
          Q('LET-F2', 'Identificar a letra inicial de palavras', 'EI03EF09', 'EF', lLetraInicial),
          Q('LET-F3', 'Montar palavras simples a partir de um modelo', 'EI03EF09', 'EF', lMontarCurta),
          Q('LET-F4', 'Relacionar figura e letra inicial', 'EI03EF09', 'EF', lLigarInicial3),
          Q('LET-F5', 'Relacionar vogais maiúsculas e minúsculas (memória)', 'EI03EF09', 'EF', lMemoriaVogais)
        ],
        medio: [
          Q('LET-M1', 'Reconhecer palavras que começam com uma letra', 'EI03EF09', 'EF', lFiguraDaLetra),
          Q('LET-M2', 'Diferenciar letras minúsculas parecidas (b, d, p, q...)', 'EI03EF09', 'EF', lMinusculaIgual),
          Q('LET-M3', 'Agrupar figuras pela letra inicial', 'EI03EF09', 'EF', lSepararPorLetra),
          Q('LET-M4', 'Relacionar letras maiúsculas e minúsculas', 'EI03EF09', 'EF', lLigarMaiMin),
          Q('LET-M5', 'Associar figura e letra inicial (memória)', 'EI03EF09', 'EF', lMemoriaInicial)
        ],
        dificil: [
          Q('LET-D1', 'Completar a letra que falta em uma palavra', 'EI03EF09', 'EF', lLetraQueFalta),
          Q('LET-D2', 'Diferenciar palavras escritas parecidas', 'EI03EF03', 'EF', lPalavraIgual),
          Q('LET-D3', 'Montar palavras maiores a partir de um modelo', 'EI03EF09', 'EF', lMontarLonga),
          Q('LET-D4', 'Relacionar figura e palavra escrita', 'EI03EF03', 'EF', lLigarPalavra),
          Q('LET-D5', 'Relacionar maiúsculas e minúsculas (memória, 6 pares)', 'EI03EF09', 'EF', lMemoriaMaiMin6)
        ]
      }
    }
  ];

  // Gera as 5 perguntas de uma ilha num nível, já com os dados pedagógicos
  PHASES.forEach(function (p) {
    p.rounds = function (level) {
      return p.levels[level].map(function (q) {
        var spec = q.gen();
        spec.meta = { code: q.code, habilidade: q.habilidade, bncc: q.bncc, area: q.area, assunto: p.assunto, ilha: p.name };
        return spec;
      });
    };
  });

  window.Content = {
    phases: PHASES,
    levels: [
      { id: 'facil', name: 'Fácil', icon: '🌱', color: '#2BB673' },
      { id: 'medio', name: 'Médio', icon: '🌿', color: '#F28C00' },
      { id: 'dificil', name: 'Difícil', icon: '🌳', color: '#E5384D' }
    ],
    area: AREA
  };
})();
