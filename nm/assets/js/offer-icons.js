/* NM Studio — animated illustrations for the four offers.
   Pure SVG + CSS (a few KB each, no Lottie runtime). Any element with
   data-icon="google|qr|pack|ultimate" receives its illustration; the
   animation runs while the element (or an ancestor) has .is-playing. */
(function () {
  "use strict";
  var defs = '<defs>' +
    '<linearGradient id="icSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fe9cf"/><stop offset=".55" stop-color="#2cc295"/><stop offset="1" stop-color="#17916b"/></linearGradient>' +
    '<linearGradient id="icGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0dca8"/><stop offset="1" stop-color="#d8ae5e"/></linearGradient>' +
    '<radialGradient id="icGlow"><stop offset="0" stop-color="#2cc295" stop-opacity=".55"/><stop offset="1" stop-color="#2cc295" stop-opacity="0"/></radialGradient>' +
    '</defs>';

  function stars(x, y) {
    var s = "";
    for (var i = 0; i < 5; i++) {
      s += '<g transform="translate(' + (x + i * 9.5) + ' ' + y + ')"><path class="ic-star" style="--i:' + i + '" d="M4 0l1.2 2.6 2.8.3-2.1 1.9.6 2.8L4 6.2 1.5 7.6l.6-2.8L0 2.9l2.8-.3z"/></g>';
    }
    return s;
  }

  // The QR illustration is a real code (it opens the live demo menu),
  // computed by nm-qr.js; a plain card is drawn if that script is missing.
  function qrArt() {
    var Q = window.NMQR, mx = Q && Q.matrix(Q.MENU_URL, "L");
    return mx ? Q.modules(mx, 24, 30, 60, { cls: "ic-mod", finderCls: "ic-finder", gap: 0.04 }) : "";
  }

  var SVG = {
    google:
      '<svg viewBox="0 0 160 120" class="ic ic--google" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="80" cy="74" rx="62" ry="40" fill="url(#icGlow)" class="ic-halo"/>' +
      '<g class="ic-map"><rect x="18" y="40" width="124" height="66" rx="12" class="ic-surface"/>' +
      '<path d="M18 78c30-6 44 10 70 2s40-14 54-8" class="ic-road"/><path d="M60 40c4 22-8 40 2 66" class="ic-road"/><path d="M108 40c-6 18 10 36 0 66" class="ic-road ic-road--thin"/>' +
      '<circle cx="40" cy="58" r="2.4" class="ic-dot"/><circle cx="124" cy="92" r="2.4" class="ic-dot"/><circle cx="36" cy="96" r="2.4" class="ic-dot"/></g>' +
      '<ellipse cx="80" cy="84" rx="11" ry="3" class="ic-shadow"/>' +
      '<g class="ic-pin"><path d="M80 84s-17-15.5-17-28a17 17 0 0134 0c0 12.5-17 28-17 28z" fill="url(#icSun)"/><circle cx="80" cy="56" r="6.5" fill="#fff"/></g>' +
      '<g class="ic-bubble"><rect x="92" y="10" width="58" height="22" rx="11" class="ic-card"/>' + stars(98, 17.5) + '</g>' +
      '</svg>',

    qr: function () { return '<svg viewBox="0 0 160 120" class="ic ic--qr" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="70" cy="66" rx="60" ry="42" fill="url(#icGlow)" class="ic-halo"/>' +
      '<g class="ic-code"><rect x="18" y="24" width="72" height="72" rx="12" class="ic-card"/>' +
      '<g class="ic-qr">' + qrArt() + '</g></g>' +
      '<rect x="18" y="24" width="72" height="3" rx="1.5" class="ic-scan"/>' +
      '<g class="ic-phone"><rect x="104" y="18" width="42" height="84" rx="9" class="ic-device"/><rect x="108" y="26" width="34" height="68" rx="5" class="ic-screen"/>' +
      '<rect x="112" y="31" width="18" height="3" rx="1.5" class="ic-line ic-line--hot" style="--i:0"/>' +
      '<rect x="112" y="40" width="26" height="8" rx="2" class="ic-line" style="--i:1"/><rect x="112" y="52" width="26" height="8" rx="2" class="ic-line" style="--i:2"/><rect x="112" y="64" width="26" height="8" rx="2" class="ic-line" style="--i:3"/><rect x="112" y="78" width="26" height="9" rx="4.5" class="ic-line ic-line--btn" style="--i:4"/></g>' +
      '</svg>'; },

    pack:
      '<svg viewBox="0 0 160 120" class="ic ic--pack" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="80" cy="64" rx="58" ry="44" fill="url(#icGlow)" class="ic-halo"/>' +
      '<g class="ic-cube">' +
      '<g class="ic-face ic-face--top"><path d="M80 22l34 18-34 18-34-18z" fill="url(#icGold)"/><path d="M80 31.5s-6 5.5-6 10a6 6 0 0012 0c0-4.5-6-10-6-10z" fill="#1a1512" opacity=".75"/></g>' +
      '<g class="ic-face ic-face--left"><path d="M46 40l34 18v38L46 78z" fill="#2cc295"/><g fill="#fff" opacity=".9"><rect x="55" y="57" width="6" height="6" rx="1.2"/><rect x="65" y="62" width="6" height="6" rx="1.2"/><rect x="55" y="67" width="6" height="6" rx="1.2"/><rect x="65" y="72" width="6" height="6" rx="1.2"/></g></g>' +
      '<g class="ic-face ic-face--right"><path d="M114 40L80 58v38l34-18z" fill="#17916b"/><path d="M88 64l18-9.5v4L88 68z" fill="#fff" opacity=".9"/><path d="M88 72l18-9.5v12L88 84z" fill="#fff" opacity=".35"/></g>' +
      '</g>' +
      '<path d="M80 58v38M46 40l34 18 34-18" class="ic-edge"/>' +
      '<g transform="translate(128 24) scale(1)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g><g transform="translate(32 90) scale(0.8)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g><g transform="translate(134 90) scale(0.6)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g>' +
      '</svg>',

    ultimate:
      '<svg viewBox="0 0 160 120" class="ic ic--ultimate" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="80" cy="66" rx="62" ry="44" fill="url(#icGlow)" class="ic-halo"/>' +
      '<g class="ic-screen-g"><rect x="26" y="22" width="108" height="76" rx="12" class="ic-card"/>' +
      '<g class="ic-tile" style="--i:0"><rect x="34" y="30" width="44" height="28" rx="7" class="ic-tile-bg"/><rect x="40" y="36" width="20" height="3" rx="1.5" fill="currentColor" opacity=".7"/><rect x="40" y="43" width="32" height="9" rx="2" fill="url(#icSun)"/></g>' +
      '<g class="ic-tile" style="--i:1"><rect x="82" y="30" width="44" height="28" rx="7" fill="url(#icSun)"/><rect x="96" y="36" width="16" height="16" rx="5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="104" cy="44" r="3.6" fill="none" stroke="#fff" stroke-width="2"/><circle cx="109" cy="39" r="1.1" fill="#fff"/></g>' +
      '<g class="ic-tile" style="--i:2"><rect x="34" y="62" width="44" height="28" rx="7" fill="#1a1512"/><path d="M58 68v12a4 4 0 11-4-4" fill="none" stroke="#25f4ee" stroke-width="2.2" stroke-linecap="round" transform="translate(-1 1)"/><path d="M58 68v12a4 4 0 11-4-4M58 68c0 3 2.4 5 5.5 5" fill="none" stroke="#fe2c55" stroke-width="2.2" stroke-linecap="round" transform="translate(1 -1)"/><path d="M58 68v12a4 4 0 11-4-4M58 68c0 3 2.4 5 5.5 5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></g>' +
      '<g class="ic-tile" style="--i:3"><rect x="82" y="62" width="44" height="28" rx="7" class="ic-tile-bg"/><path d="M104 84s-8-7-8-12.5a8 8 0 0116 0C112 77 104 84 104 84z" fill="url(#icSun)"/><circle cx="104" cy="71.5" r="3" fill="#fff"/></g>' +
      '</g>' +
      '<g class="ic-hearts"><path class="ic-heart" style="--i:0" d="M120 30c-2-3-7-2-7 2 0 3 7 7 7 7s7-4 7-7c0-4-5-5-7-2z"/><path class="ic-heart" style="--i:1" d="M40 40c-1.6-2.4-5.6-1.6-5.6 1.6 0 2.4 5.6 5.6 5.6 5.6s5.6-3.2 5.6-5.6c0-3.2-4-4-5.6-1.6z"/><path class="ic-heart" style="--i:2" d="M132 72c-1.4-2-4.8-1.4-4.8 1.4 0 2 4.8 4.8 4.8 4.8s4.8-2.8 4.8-4.8c0-2.8-3.4-3.4-4.8-1.4z"/></g>' +
      '<g class="ic-dust"><circle style="--i:0" cx="50" cy="104" r="1.6"/><circle style="--i:1" cx="72" cy="108" r="1.2"/><circle style="--i:2" cx="94" cy="104" r="1.8"/><circle style="--i:3" cx="116" cy="108" r="1.3"/><circle style="--i:4" cx="140" cy="102" r="1.1"/><circle style="--i:5" cx="30" cy="100" r="1.2"/></g>' +
      '</svg>'
  };

  function build(k) { return typeof SVG[k] === "function" ? SVG[k]() : SVG[k]; }

  function mount(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.firstElementChild) return;
      var svg = build(el.getAttribute("data-icon"));
      if (svg) el.innerHTML = svg;
    });
  }
  window.NMIcons = { mount: mount, svg: function (k) { return build(k) || ""; } };
  mount();
})();
