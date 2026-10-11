(function () {
  var NUM_WORDS = { un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8 };
  var STOP_PHRASES = [
    "c'est tout", 'ce sera tout', 'non merci', 'non c\'est bon', "rien d'autre",
    'terminé', 'termine', "c'est bon", 'voila c\'est tout', 'ça sera tout'
  ];

  function isStop(text) {
    var t = text.toLowerCase();
    return STOP_PHRASES.some(function (p) { return t.includes(p); });
  }

  function parseOrder(text) {
    var t = ' ' + text.toLowerCase() + ' ';
    var found = [];
    window.MENU.forEach(function (item) {
      item.keywords.forEach(function (kw) {
        var idx = t.indexOf(kw);
        if (idx === -1) return;
        var before = t.slice(Math.max(0, idx - 14), idx).trim().split(/\s+/);
        var qty = 1;
        for (var i = before.length - 1; i >= 0; i--) {
          var w = before[i];
          if (NUM_WORDS[w]) { qty = NUM_WORDS[w]; break; }
          if (/^\d+$/.test(w)) { qty = parseInt(w, 10); break; }
        }
        if (!found.some(function (f) { return f.id === item.id; })) {
          found.push({ id: item.id, name: item.name, price: item.price, qty: qty });
        }
      });
    });
    return found;
  }

  window.NMOrderNLU = { parseOrder: parseOrder, isStop: isStop };
})();
