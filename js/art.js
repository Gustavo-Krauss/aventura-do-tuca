/* ==========================================================
   Aventura do Tuca — Artes em SVG (todas originais, geradas
   por código, sem imagens externas)
   ========================================================== */
(function () {
  'use strict';

  var uid = 0;
  function nextId(prefix) { uid += 1; return (prefix || 'a') + uid; }

  /* ---------- Mascote: Tuca, o tucano ---------- */
  function tuca() {
    var g = nextId('bk');
    return '' +
      '<svg class="tuca-svg" viewBox="0 0 220 220" aria-hidden="true">' +
        '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#FFC93C"/><stop offset="1" stop-color="#FB8500"/>' +
        '</linearGradient></defs>' +
        // cauda
        '<path d="M66 168 Q40 196 52 212 Q76 210 90 182 Z" fill="#1B1B38"/>' +
        // corpo
        '<ellipse cx="100" cy="130" rx="58" ry="70" fill="#26264A"/>' +
        // peito
        '<ellipse cx="120" cy="120" rx="31" ry="44" fill="#FFF4D6"/>' +
        '<ellipse cx="122" cy="96" rx="24" ry="16" fill="#FFE29A" opacity=".8"/>' +
        // mancha vermelha
        '<ellipse cx="104" cy="194" rx="20" ry="8" fill="#EF476F"/>' +
        // asa
        '<g class="tuca-wing"><ellipse cx="72" cy="136" rx="25" ry="42" fill="#1B1B38" transform="rotate(-14 72 136)"/>' +
        '<path d="M58 150 Q66 168 80 172" stroke="#3A3A66" stroke-width="4" fill="none" stroke-linecap="round"/></g>' +
        // topete
        '<path d="M92 66 Q94 44 108 54 Q104 40 118 50 Q112 58 108 66 Z" fill="#26264A"/>' +
        // pés
        '<ellipse cx="88" cy="200" rx="11" ry="5" fill="#FB8500"/>' +
        '<ellipse cx="114" cy="200" rx="11" ry="5" fill="#FB8500"/>' +
        // bico
        '<path d="M130 70 C160 50 202 60 213 96 C198 110 160 110 134 101 Q126 86 130 70 Z" fill="url(#' + g + ')"/>' +
        '<path d="M199 78 C206 84 211 90 213 96 C207 101 201 103 195 104 C198 95 199 86 199 78 Z" fill="#26264A"/>' +
        '<path d="M136 89 C160 93 186 95 211 97" stroke="#C2410C" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M142 70 C162 61 182 63 196 74" stroke="#FFE7A0" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>' +
        // olho
        '<circle cx="117" cy="82" r="20" fill="#7FD8FF"/>' +
        '<g class="tuca-eye-open"><circle cx="117" cy="82" r="13" fill="#fff"/>' +
        '<circle cx="120" cy="83" r="8" fill="#1d1d1d"/><circle cx="123" cy="79" r="3" fill="#fff"/></g>' +
        '<path class="tuca-eye-happy" d="M105 86 Q117 71 129 86" stroke="#1d1d1d" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        // bochecha
        '<ellipse cx="108" cy="106" rx="8" ry="5" fill="#FF8FAB" opacity=".85"/>' +
      '</svg>';
  }

  /* ---------- Ilha do mapa ---------- */
  function island(grass) {
    return '' +
      '<svg class="island-svg" viewBox="0 0 240 150" aria-hidden="true">' +
        '<ellipse cx="120" cy="116" rx="114" ry="28" fill="#fff" opacity=".35"/>' +
        '<ellipse cx="120" cy="106" rx="102" ry="32" fill="#F2B95E"/>' +
        '<ellipse cx="120" cy="98" rx="100" ry="32" fill="#FFD98E"/>' +
        '<ellipse cx="116" cy="90" rx="74" ry="22" fill="' + grass + '"/>' +
        '<ellipse cx="100" cy="84" rx="40" ry="9" fill="#fff" opacity=".22"/>' +
        '<path d="M196 96 Q198 60 206 30" stroke="#A0632B" stroke-width="9" fill="none" stroke-linecap="round"/>' +
        '<path d="M206 30 Q186 18 168 32 Q188 28 206 30 Z" fill="#2DC653"/>' +
        '<path d="M206 30 Q224 14 240 26 Q222 26 206 30 Z" fill="#2DC653"/>' +
        '<path d="M206 30 Q196 4 176 6 Q196 14 206 30 Z" fill="#22A846"/>' +
        '<path d="M206 30 Q222 2 236 8 Q218 12 206 30 Z" fill="#22A846"/>' +
        '<circle cx="204" cy="34" r="5" fill="#8B5A2B"/><circle cx="211" cy="36" r="5" fill="#8B5A2B"/>' +
        '<circle cx="40" cy="100" r="5" fill="#fff" opacity=".7"/><circle cx="52" cy="108" r="3" fill="#fff" opacity=".7"/>' +
      '</svg>';
  }

  /* ---------- Baú do tesouro ---------- */
  // variant: undefined (madeira), 'silver' (prata) ou 'gold' (ouro)
  function chest(open, variant) {
    var svg = chestBase(open);
    if (variant === 'gold') {
      return svg.replace(/#A0522D/g, '#B07800').replace(/#C46A2F/g, '#E0A100').replace(/#8B4513/g, '#8A5A00')
        .replace(/#FFC300/g, '#FFF3B0');
    }
    if (variant === 'silver') {
      return svg.replace(/#A0522D/g, '#7D8A99').replace(/#C46A2F/g, '#A7B4C2').replace(/#8B4513/g, '#5E6B7A')
        .replace(/#FFC300/g, '#E8EEF5');
    }
    return svg;
  }
  function chestBase(open) {
    if (open) {
      return '' +
        '<svg class="chest-svg" viewBox="0 0 140 120" aria-hidden="true">' +
          '<circle cx="70" cy="60" r="56" fill="#FFF3B0" opacity=".7"/>' +
          '<path d="M18 46 L30 8 Q70 -4 110 8 L122 46 Z" fill="#C46A2F"/>' +
          '<path d="M24 44 L33 14 Q70 4 107 14 L116 44 Z" fill="#8B4513"/>' +
          '<circle cx="50" cy="52" r="10" fill="#FFC300"/><circle cx="70" cy="46" r="11" fill="#FFD60A"/><circle cx="90" cy="52" r="10" fill="#FFC300"/>' +
          '<circle cx="60" cy="58" r="9" fill="#FFE066"/><circle cx="80" cy="58" r="9" fill="#FFE066"/>' +
          '<rect x="16" y="56" width="108" height="54" rx="9" fill="#A0522D"/>' +
          '<rect x="16" y="56" width="108" height="9" fill="#FFC300"/>' +
          '<rect x="36" y="56" width="9" height="54" fill="#FFC300"/><rect x="95" y="56" width="9" height="54" fill="#FFC300"/>' +
          '<path d="M70 70 l5 10 11 1-8 7 3 11-11-6-11 6 3-11-8-7 11-1z" fill="#FFF3B0"/>' +
        '</svg>';
    }
    return '' +
      '<svg class="chest-svg" viewBox="0 0 140 120" aria-hidden="true">' +
        '<rect x="16" y="54" width="108" height="56" rx="9" fill="#A0522D"/>' +
        '<path d="M16 60 V42 Q16 14 70 14 Q124 14 124 42 V60 Z" fill="#C46A2F"/>' +
        '<rect x="16" y="54" width="108" height="9" fill="#FFC300"/>' +
        '<rect x="36" y="16" width="9" height="94" fill="#FFC300"/><rect x="95" y="16" width="9" height="94" fill="#FFC300"/>' +
        '<path d="M60 52 V44 Q60 34 70 34 Q80 34 80 44 V52" stroke="#9CA3AF" stroke-width="5" fill="none"/>' +
        '<rect x="56" y="50" width="28" height="24" rx="5" fill="#6B7280"/>' +
        '<circle cx="70" cy="60" r="4" fill="#1f2937"/><rect x="68" y="61" width="4" height="8" rx="2" fill="#1f2937"/>' +
      '</svg>';
  }

  /* ---------- Formas coloridas (usadas na Ilha das Cores) ---------- */
  function balloon(c) {
    return '<svg class="shape" viewBox="0 0 60 100" aria-hidden="true">' +
      '<path d="M30 70 Q34 82 28 90 Q24 96 30 100" stroke="#5b6170" stroke-width="2" fill="none"/>' +
      '<ellipse cx="30" cy="34" rx="25" ry="31" fill="' + c + '"/>' +
      '<path d="M25 64 L35 64 L30 71 Z" fill="' + c + '"/>' +
      '<ellipse cx="21" cy="23" rx="6" ry="10" fill="#fff" opacity=".45" transform="rotate(20 21 23)"/>' +
      '</svg>';
  }
  function star(c) {
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="' + c + '" stroke="rgba(0,0,0,.18)" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M44 26 L48 18" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>' +
      '</svg>';
  }
  function heart(c) {
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M50 90 C20 68 6 52 6 33 C6 18 17 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C83 8 94 18 94 33 C94 52 80 68 50 90 Z" fill="' + c + '" stroke="rgba(0,0,0,.15)" stroke-width="4"/>' +
      '<ellipse cx="28" cy="28" rx="7" ry="10" fill="#fff" opacity=".45" transform="rotate(-30 28 28)"/>' +
      '</svg>';
  }
  function flower(c) {
    var p = '';
    for (var i = 0; i < 5; i++) {
      var a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      p += '<circle cx="' + (50 + Math.cos(a) * 24).toFixed(1) + '" cy="' + (50 + Math.sin(a) * 24).toFixed(1) + '" r="19" fill="' + c + '" stroke="rgba(0,0,0,.12)" stroke-width="3"/>';
    }
    var center = (c.toUpperCase() === '#FFD60A') ? '#FF8C1A' : '#FFD60A';
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' + p +
      '<circle cx="50" cy="50" r="14" fill="' + center + '"/></svg>';
  }
  function fish(c) {
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M70 50 L96 30 L92 50 L96 70 Z" fill="' + c + '" stroke="rgba(0,0,0,.15)" stroke-width="3" stroke-linejoin="round"/>' +
      '<ellipse cx="44" cy="50" rx="34" ry="24" fill="' + c + '" stroke="rgba(0,0,0,.15)" stroke-width="3"/>' +
      '<path d="M50 30 Q56 50 50 70" stroke="rgba(0,0,0,.15)" stroke-width="3" fill="none"/>' +
      '<circle cx="28" cy="45" r="7" fill="#fff"/><circle cx="27" cy="45" r="3.5" fill="#1d1d1d"/>' +
      '</svg>';
  }
  function splat(c) {
    var white = c.toUpperCase() === '#FFFFFF';
    var st = white ? '#AEB8C6' : 'rgba(0,0,0,.12)', sw = white ? 4 : 3;
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' +
      '<path d="M50 8 C60 8 62 20 70 18 C80 15 90 24 86 34 C83 42 94 46 92 56 C90 66 78 64 76 74 C74 86 62 92 52 86 C44 82 38 94 28 88 C18 82 24 72 16 66 C6 60 8 48 16 44 C24 40 14 30 22 22 C30 14 40 22 44 16 C46 12 46 8 50 8 Z" fill="' + c + '" stroke="' + st + '" stroke-width="' + sw + '"/>' +
      '<circle cx="90" cy="18" r="5" fill="' + c + '" stroke="' + (white ? st : 'none') + '" stroke-width="2"/><circle cx="10" cy="86" r="4" fill="' + c + '" stroke="' + (white ? st : 'none') + '" stroke-width="2"/>' +
      '<ellipse cx="38" cy="36" rx="8" ry="5" fill="#fff" opacity=".4" transform="rotate(-30 38 36)"/>' +
      '</svg>';
  }
  function crayon(c) {
    return '<svg class="shape" viewBox="0 0 100 100" aria-hidden="true">' +
      '<g transform="rotate(-35 50 50)">' +
      '<rect x="18" y="38" width="62" height="24" rx="4" fill="' + c + '"/>' +
      '<path d="M80 38 L96 50 L80 62 Z" fill="' + c + '"/>' +
      '<rect x="30" y="38" width="6" height="24" fill="rgba(0,0,0,.18)"/><rect x="62" y="38" width="6" height="24" fill="rgba(0,0,0,.18)"/>' +
      '<rect x="18" y="38" width="62" height="6" fill="#fff" opacity=".3"/>' +
      '</g></svg>';
  }
  function box(c) {
    return '<svg class="shape box" viewBox="0 0 100 100" aria-hidden="true">' +
      '<rect x="14" y="40" width="72" height="52" rx="6" fill="' + c + '"/>' +
      '<rect x="14" y="40" width="72" height="52" rx="6" fill="rgba(0,0,0,.08)" style="mix-blend-mode:multiply"/>' +
      '<rect x="8" y="28" width="84" height="18" rx="5" fill="' + c + '"/>' +
      '<rect x="44" y="28" width="12" height="64" fill="#fff" opacity=".85"/>' +
      '<path d="M50 28 C40 10 24 14 30 24 C34 30 46 28 50 28 C54 28 66 30 70 24 C76 14 60 10 50 28 Z" fill="#fff" opacity=".9"/>' +
      '<rect x="8" y="28" width="84" height="6" rx="3" fill="#fff" opacity=".3"/>' +
      '</svg>';
  }
  var SHAPES = { balloon: balloon, star: star, heart: heart, flower: flower, fish: fish, splat: splat, crayon: crayon };

  /* ---------- Lápis de comprimento variável ---------- */
  function pencil(len, color) {
    // len: comprimento em unidades (60 a 300)
    var w = len, h = 34;
    var bodyEnd = w - 34;
    return '<svg class="pencil" viewBox="0 0 ' + w + ' ' + h + '" style="width:calc(var(--pencil-unit) * ' + w + ')" aria-hidden="true">' +
      '<rect x="0" y="4" width="16" height="26" rx="6" fill="#FF8FAB"/>' +
      '<rect x="14" y="4" width="10" height="26" fill="#B8C0CC"/>' +
      '<rect x="24" y="4" width="' + (bodyEnd - 24) + '" height="26" fill="' + color + '"/>' +
      '<rect x="24" y="4" width="' + (bodyEnd - 24) + '" height="8" fill="#fff" opacity=".3"/>' +
      '<path d="M' + bodyEnd + ' 4 L' + (w - 2) + ' 17 L' + bodyEnd + ' 30 Z" fill="#F4C38B"/>' +
      '<path d="M' + (w - 12) + ' 11.5 L' + (w - 2) + ' 17 L' + (w - 12) + ' 22.5 Z" fill="#333"/>' +
      '</svg>';
  }

  /* ---------- Copo com água (nível 0..1) ---------- */
  function glass(level) {
    var id = nextId('cp');
    var top = 94 - level * 84;
    return '<svg class="glass" viewBox="0 0 70 100" aria-hidden="true">' +
      '<defs><clipPath id="' + id + '"><path d="M8 6 L62 6 L54 94 L16 94 Z"/></clipPath></defs>' +
      '<path d="M8 6 L62 6 L54 94 L16 94 Z" fill="#fff" opacity=".85"/>' +
      '<g clip-path="url(#' + id + ')"><rect x="0" y="' + top.toFixed(1) + '" width="70" height="100" fill="#4CC9F0"/>' +
      '<rect x="0" y="' + top.toFixed(1) + '" width="70" height="5" fill="#90E0FF"/></g>' +
      '<path d="M8 6 L62 6 L54 94 L16 94 Z" fill="none" stroke="#5B8DB8" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M18 16 L22 80" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
      '</svg>';
  }

  /* ---------- Cesto (zona de soltar) ---------- */
  function basket(c) {
    return '<svg class="basket-svg" viewBox="0 0 160 70" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M8 8 H152 L140 64 Q139 68 134 68 H26 Q21 68 20 64 Z" fill="#C98A4B"/>' +
      '<path d="M30 8 L38 68 M56 8 L60 68 M80 8 L80 68 M104 8 L100 68 M130 8 L122 68" stroke="#A86B32" stroke-width="3"/>' +
      (c ? '<rect x="14" y="26" width="132" height="18" fill="' + c + '"/>' : '') +
      '<rect x="2" y="0" width="156" height="14" rx="7" fill="#A86B32"/>' +
      '</svg>';
  }

  /* ---------- Pontinhos (quantidade 1..9) ---------- */
  var DOTS = {
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8], 7: [0, 2, 3, 4, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8]
  };
  function dots(n, color) {
    var s = '<svg class="dots" viewBox="0 0 90 90" aria-hidden="true">';
    (DOTS[n] || []).forEach(function (i) {
      var x = 15 + (i % 3) * 30, y = 15 + Math.floor(i / 3) * 30;
      s += '<circle cx="' + x + '" cy="' + y + '" r="11" fill="' + (color || '#7B2FF7') + '"/>';
    });
    return s + '</svg>';
  }

  /* ---------- Ícones simples ---------- */
  var ICON = {
    home: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24 L24 8 L42 24" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22 V40 H36 V22" stroke="currentColor" stroke-width="6" fill="none" stroke-linejoin="round"/><rect x="20" y="28" width="8" height="12" fill="currentColor"/></svg>',
    full: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 18 V6 H18 M30 6 H42 V18 M42 30 V42 H30 M18 42 H6 V30" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 25 L20 35 L39 13" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 12 L36 36 M36 12 L12 36" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round"/></svg>',
    play: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8 L40 24 L14 40 Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>',
    replay: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M38 24 A14 14 0 1 1 33 13" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M26 6 L36 12 L28 21" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    map: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 12 L17 7 L31 13 L42 8 V36 L31 41 L17 35 L6 40 Z" stroke="currentColor" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M17 7 V35 M31 13 V41" stroke="currentColor" stroke-width="5"/></svg>',
    print: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="13" y="6" width="22" height="12" stroke="currentColor" stroke-width="5" fill="none"/><rect x="5" y="18" width="38" height="16" rx="4" fill="currentColor"/><rect x="13" y="28" width="22" height="14" fill="#fff" stroke="currentColor" stroke-width="5"/></svg>',
    info: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19" stroke="currentColor" stroke-width="5" fill="none"/><rect x="21" y="21" width="6" height="15" rx="3" fill="currentColor"/><circle cx="24" cy="14" r="3.5" fill="currentColor"/></svg>',
    star: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="currentColor" stroke="rgba(0,0,0,.18)" stroke-width="6" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 60 30" aria-hidden="true"><path d="M4 15 H48 M38 5 L52 15 L38 25" stroke="currentColor" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  window.Art = {
    tuca: tuca, island: island, chest: chest,
    shape: function (name, color) { return SHAPES[name](color); },
    box: box,
    shapeNames: Object.keys(SHAPES),
    pencil: pencil, glass: glass, basket: basket, dots: dots, icon: ICON
  };
})();
