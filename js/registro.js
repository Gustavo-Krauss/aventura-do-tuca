/* ==========================================================
   Aventura do Tuca — Registro pedagógico

   Guarda 1 linha por pergunta respondida, com ID em
   auto incremento, no navegador (localStorage). O educador
   baixa tudo num único arquivo .txt pelo painel do educador.

   Colunas do arquivo (separadas por ponto e vírgula, abre
   direto no Excel/Planilhas):
   ID; DATA; HORA; CRIANCA; NIVEL; ILHA; AREA; ASSUNTO;
   HABILIDADE; BNCC; CODIGO_PERGUNTA; TENTATIVAS; ACERTOS;
   ERROS; RESULTADO; TEMPO_SEGUNDOS
   ========================================================== */
(function () {
  'use strict';
  var KEY = 'aventura-do-tuca-registros';
  var SEQ = 'aventura-do-tuca-registros-seq';
  var COLS = ['ID', 'DATA', 'HORA', 'CRIANCA', 'NIVEL', 'ILHA', 'AREA', 'ASSUNTO', 'HABILIDADE', 'BNCC',
    'CODIGO_PERGUNTA', 'TENTATIVAS', 'ACERTOS', 'ERROS', 'RESULTADO', 'TEMPO_SEGUNDOS'];

  var memory = []; // reserva caso o navegador bloqueie o armazenamento
  var memorySeq = 0;

  function readAll() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v : memory;
    } catch (e) { return memory; }
  }
  function writeAll(list) {
    memory = list;
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* segue só na memória */ }
  }
  function nextId() {
    var n = 0;
    try { n = parseInt(localStorage.getItem(SEQ), 10) || 0; } catch (e) { n = memorySeq; }
    // nunca repete um ID, mesmo se a lista foi editada
    var list = readAll();
    if (list.length) n = Math.max(n, list[list.length - 1].id || 0);
    n += 1;
    memorySeq = n;
    try { localStorage.setItem(SEQ, String(n)); } catch (e) { /* ignora */ }
    return n;
  }
  function two(n) { return ('0' + n).slice(-2); }
  function clean(v) { return String(v == null ? '' : v).replace(/[;\r\n\t]+/g, ' ').trim(); }

  function resultado(acertos, erros, concluida) {
    if (!concluida) return 'Não concluída';
    if (erros === 0) return 'Acertou de primeira';
    return 'Acertou após ' + erros + (erros === 1 ? ' erro' : ' erros');
  }

  var Registro = {
    /* r = { crianca, nivel, meta:{code, habilidade, bncc, area, assunto, ilha}, acertos, erros, concluida, inicio } */
    add: function (r) {
      var d = new Date();
      var rec = {
        id: nextId(),
        data: two(d.getDate()) + '/' + two(d.getMonth() + 1) + '/' + d.getFullYear(),
        hora: two(d.getHours()) + ':' + two(d.getMinutes()) + ':' + two(d.getSeconds()),
        crianca: clean(r.crianca) || 'Sem nome',
        nivel: r.nivel,
        ilha: r.meta.ilha,
        area: r.meta.area,
        assunto: r.meta.assunto,
        habilidade: r.meta.habilidade,
        bncc: r.meta.bncc,
        codigo: r.meta.code,
        tentativas: r.acertos + r.erros,
        acertos: r.acertos,
        erros: r.erros,
        resultado: resultado(r.acertos, r.erros, r.concluida),
        tempo: Math.max(0, Math.round((Date.now() - r.inicio) / 1000))
      };
      var list = readAll();
      list.push(rec);
      writeAll(list);
      return rec;
    },
    all: function () { return readAll(); },
    count: function () { return readAll().length; },
    clear: function () { writeAll([]); /* o ID continua crescendo, não reinicia */ },
    toTxt: function () {
      var lines = [COLS.join(';')];
      readAll().forEach(function (r) {
        lines.push([r.id, r.data, r.hora, r.crianca, r.nivel, r.ilha, r.area, r.assunto, r.habilidade, r.bncc,
          r.codigo, r.tentativas, r.acertos, r.erros, r.resultado, r.tempo].map(clean).join(';'));
      });
      return '﻿' + lines.join('\r\n') + '\r\n';
    },
    download: function () {
      var blob = new Blob([Registro.toTxt()], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'aventura-do-tuca-registros.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
    }
  };

  window.Registro = Registro;
})();
