/* NM Studio — animated illustrations for the four offers.
   Pure SVG + CSS (a few KB each, no Lottie runtime). Any element with
   data-icon="google|qr|pack|ultimate" receives its illustration; the
   animation runs while the element (or an ancestor) has .is-playing. */
(function () {
  "use strict";
  var defs = '<defs>' +
    '<linearGradient id="icSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b9a8ff"/><stop offset=".55" stop-color="#7b61ff"/><stop offset="1" stop-color="#4f7bff"/></linearGradient>' +
    '<linearGradient id="icGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e1ad"/><stop offset="1" stop-color="#e6c27a"/></linearGradient>' +
    '<radialGradient id="icGlow"><stop offset="0" stop-color="#7b61ff" stop-opacity=".55"/><stop offset="1" stop-color="#7b61ff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="icIg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#FEDA75"/><stop offset=".3" stop-color="#FA7E1E"/><stop offset=".6" stop-color="#D62976"/><stop offset=".85" stop-color="#962FBF"/><stop offset="1" stop-color="#4F5BD5"/></linearGradient>' +
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
      '<g class="ic-bubble"><rect x="78" y="10" width="74" height="22" rx="11" class="ic-card"/><g transform="translate(83.5 15) scale(.25)"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></g>' + stars(100, 17.5) + '</g>' +
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
      '<g class="ic-face ic-face--left"><path d="M46 40l34 18v38L46 78z" fill="#7b61ff"/><g fill="#fff" opacity=".9"><rect x="55" y="57" width="6" height="6" rx="1.2"/><rect x="65" y="62" width="6" height="6" rx="1.2"/><rect x="55" y="67" width="6" height="6" rx="1.2"/><rect x="65" y="72" width="6" height="6" rx="1.2"/></g></g>' +
      '<g class="ic-face ic-face--right"><path d="M114 40L80 58v38l34-18z" fill="#4f7bff"/><path d="M88 64l18-9.5v4L88 68z" fill="#fff" opacity=".9"/><path d="M88 72l18-9.5v12L88 84z" fill="#fff" opacity=".35"/></g>' +
      '</g>' +
      '<path d="M80 58v38M46 40l34 18 34-18" class="ic-edge"/>' +
      '<g transform="translate(128 24) scale(1)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g><g transform="translate(32 90) scale(0.8)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g><g transform="translate(134 90) scale(0.6)"><path class="ic-spark" d="M0-7l1.8 5.2L7 0 1.8 1.8 0 7-1.8 1.8-7 0-1.8-1.8z"/></g>' +
      '</svg>',

    ultimate:
      '<svg viewBox="0 0 160 120" class="ic ic--ultimate" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="80" cy="66" rx="62" ry="44" fill="url(#icGlow)" class="ic-halo"/>' +
      '<g class="ic-screen-g"><rect x="26" y="22" width="108" height="76" rx="12" class="ic-card"/>' +
      '<g class="ic-tile" style="--i:0"><rect x="34" y="30" width="44" height="28" rx="7" fill="url(#icIg)"/><path transform="translate(48 36) scale(.667)" fill="#fff" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></g>' +
      '<g class="ic-tile" style="--i:1"><rect x="82" y="30" width="44" height="28" rx="7" fill="#000"/><path transform="translate(95.3 35.3) scale(.667)" fill="#25F4EE" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/><path transform="translate(96.7 36.7) scale(.667)" fill="#FE2C55" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/><path transform="translate(96 36) scale(.667)" fill="#fff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></g>' +
      '<g class="ic-tile" style="--i:2"><rect x="34" y="62" width="44" height="28" rx="7" fill="#fff"/><path transform="translate(48 68) scale(.667)" fill="#0866FF" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></g>' +
      '<g class="ic-tile" style="--i:3"><rect x="82" y="62" width="44" height="28" rx="7" fill="#fff"/><path transform="translate(96 68) scale(.667)" fill="#4285F4" d="M19.527 4.799c1.212 2.608.937 5.678-.405 8.173-1.101 2.047-2.744 3.74-4.098 5.614-.619.858-1.244 1.75-1.669 2.727-.141.325-.263.658-.383.992-.121.333-.224.673-.34 1.008-.109.314-.236.684-.627.687h-.007c-.466-.001-.579-.53-.695-.887-.284-.874-.581-1.713-1.019-2.525-.51-.944-1.145-1.817-1.79-2.671L19.527 4.799zM8.545 7.705l-3.959 4.707c.724 1.54 1.821 2.863 2.871 4.18.247.31.494.622.737.936l4.984-5.925-.029.01c-1.741.601-3.691-.291-4.392-1.987a3.377 3.377 0 0 1-.209-.716c-.063-.437-.077-.761-.004-1.198l.001-.007zM5.492 3.149l-.003.004c-1.947 2.466-2.281 5.88-1.117 8.77l4.785-5.689-.058-.05-3.607-3.035zM14.661.436l-3.838 4.563a.295.295 0 0 1 .027-.01c1.6-.551 3.403.15 4.22 1.626.176.319.323.683.377 1.045.068.446.085.773.012 1.22l-.003.016 3.836-4.561A8.382 8.382 0 0 0 14.67.439l-.009-.003zM9.466 5.868L14.162.285l-.047-.012A8.31 8.31 0 0 0 11.986 0a8.439 8.439 0 0 0-6.169 2.766l-.016.018 3.665 3.084z"/></g>' +
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
