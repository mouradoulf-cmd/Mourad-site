/* NM Studio — real, scannable QR codes drawn as SVG.
   Uses the vendored qrcode.min.js (qrcodejs) only to compute the module
   matrix, then draws each module as its own <rect> so it can animate in.
   Every code keeps dark modules on a light ground and a 4-module quiet
   zone, so it still scans while the decoration moves around it. */
(function () {
  "use strict";
  var MENU_URL = "https://mouradoulf-cmd.github.io/Mourad-site/giulivo-qr-menu.html";
  var WA_URL = "https://wa.me/qr/PYPOVXTCVM74I1";
  var cache = {};

  function matrix(text, level) {
    var key = (level || "M") + "|" + text;
    if (cache[key]) return cache[key];
    if (!window.QRCode) return null;
    var holder = document.createElement("div");
    var q = new window.QRCode(holder, { text: text, width: 64, height: 64, correctLevel: window.QRCode.CorrectLevel[level || "M"] });
    var m = q && q._oQRCode;
    if (!m) return null;
    var n = m.getModuleCount(), rows = [];
    for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(m.isDark(r, c)); rows.push(row); }
    return (cache[key] = { n: n, dark: rows });
  }

  function inFinder(r, c, n) {
    return (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  }

  /* Modules as rects in a box of `size` units at (x, y). Finder patterns are
     drawn as rounded squares (same geometry, softer corners). Each module
     carries --d (0…1), its distance from the top-left corner, for staggers. */
  function modules(mx, x, y, size, opts) {
    opts = opts || {};
    var n = mx.n, u = size / n, gap = opts.gap == null ? 0.08 : opts.gap, s = u * (1 - gap), off = (u - s) / 2;
    var out = "", cls = opts.cls || "qr-m", fcls = opts.finderCls || "qr-f";
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      if (!mx.dark[r][c] || inFinder(r, c, n)) continue;
      var d = ((r + c) / (2 * n - 2)).toFixed(3);
      out += '<rect class="' + cls + '" style="--d:' + d + '" x="' + (x + c * u + off).toFixed(2) + '" y="' + (y + r * u + off).toFixed(2) + '" width="' + s.toFixed(2) + '" height="' + s.toFixed(2) + '" rx="' + (s * 0.22).toFixed(2) + '"/>';
    }
    [[0, 0], [0, n - 7], [n - 7, 0]].forEach(function (p, i) {
      var fx = x + p[1] * u, fy = y + p[0] * u;
      out += '<g class="' + fcls + '" style="--i:' + i + '">' +
        '<path fill-rule="evenodd" d="' + roundRect(fx, fy, 7 * u, 7 * u, u * 1.6) + roundRect(fx + u, fy + u, 5 * u, 5 * u, u * 1.1) + '"/>' +
        '<rect x="' + (fx + 2 * u).toFixed(2) + '" y="' + (fy + 2 * u).toFixed(2) + '" width="' + (3 * u).toFixed(2) + '" height="' + (3 * u).toFixed(2) + '" rx="' + (u * 0.7).toFixed(2) + '"/></g>';
    });
    return out;
  }
  function roundRect(x, y, w, h, r) {
    function f(v) { return v.toFixed(2); }
    return "M" + f(x + r) + " " + f(y) + "H" + f(x + w - r) + "A" + f(r) + " " + f(r) + " 0 0 1 " + f(x + w) + " " + f(y + r) +
      "V" + f(y + h - r) + "A" + f(r) + " " + f(r) + " 0 0 1 " + f(x + w - r) + " " + f(y + h) +
      "H" + f(x + r) + "A" + f(r) + " " + f(r) + " 0 0 1 " + f(x) + " " + f(y + h - r) +
      "V" + f(y + r) + "A" + f(r) + " " + f(r) + " 0 0 1 " + f(x + r) + " " + f(y) + "Z";
  }

  /* A standalone code: light rounded ground + quiet zone + modules. */
  function svg(text, opts) {
    opts = opts || {};
    var mx = matrix(text, opts.level || "M");
    if (!mx) return "";
    var q = 4, total = mx.n + q * 2;
    var a11y = opts.hidden ? 'aria-hidden="true" focusable="false"' : 'role="img" aria-label="' + (opts.label || "QR code") + '"';
    return '<svg class="qr ' + (opts.cls || "") + '" viewBox="0 0 ' + total + ' ' + total + '" ' + a11y + ' shape-rendering="geometricPrecision">' +
      '<rect class="qr-bg" width="' + total + '" height="' + total + '" rx="' + (total * 0.06).toFixed(2) + '"/>' +
      '<g class="qr-mods">' + modules(mx, q, q, mx.n, { gap: opts.gap }) + '</g></svg>';
  }

  /* Upgrade every [data-qr] element: data-qr="menu" | "whatsapp" | a URL. */
  function mount(root) {
    (root || document).querySelectorAll("[data-qr]").forEach(function (el) {
      if (el.getAttribute("data-qr-done")) return;
      var v = el.getAttribute("data-qr"), url = v === "menu" ? MENU_URL : v === "whatsapp" ? WA_URL : v;
      var out = svg(url, { level: el.getAttribute("data-qr-level") || "Q", label: el.getAttribute("data-qr-label") || "QR code", cls: el.getAttribute("data-qr-cls") || "", hidden: el.hasAttribute("aria-label") });
      if (!out) return;
      el.innerHTML = out;
      el.setAttribute("data-qr-done", "1");
      if (el.classList.contains("qr-anim")) reveal(el);
    });
  }

  // Animated codes assemble module by module the first time they scroll in.
  function reveal(el) {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-in"); return; }
    var io = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      el.classList.add("is-in"); io.disconnect();
    }, { threshold: 0.35 });
    io.observe(el);
  }

  window.NMQR = { MENU_URL: MENU_URL, WA_URL: WA_URL, matrix: matrix, modules: modules, svg: svg, mount: mount };
  mount();
})();
