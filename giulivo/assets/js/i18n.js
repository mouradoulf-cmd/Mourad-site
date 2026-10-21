/* Giulivo — language switch (IT baked in the HTML, EN / DE / NL from i18n-data.js).
   API: window.GiuI18n = { lang, t(key), set(lang) }; fires "giu:lang" on document after each switch. */
(function () {
  "use strict";
  var D = window.GIU_I18N; if (!D) return;
  var LANGS = ["it", "en", "de", "nl"];
  var api = window.GiuI18n = { lang: "it", t: function (k) { var u = D.ui[api.lang] || D.ui.it; return u[k] != null ? u[k] : (D.ui.it[k] || ""); }, set: set };

  function each(sel, fn) { var l = document.querySelectorAll(sel); for (var i = 0; i < l.length; i++) fn(l[i]); }
  function set(lang, silent) {
    if (LANGS.indexOf(lang) < 0) lang = "it";
    api.lang = lang;
    document.documentElement.lang = lang;
    each("[data-i18n]", function (el) { el.textContent = api.t(el.getAttribute("data-i18n")); });
    each("[data-i18n-html]", function (el) { el.innerHTML = api.t(el.getAttribute("data-i18n-html")); });
    each("[data-i18n-placeholder]", function (el) { el.setAttribute("placeholder", api.t(el.getAttribute("data-i18n-placeholder"))); });
    each("[data-i18n-aria-label]", function (el) { el.setAttribute("aria-label", api.t(el.getAttribute("data-i18n-aria-label"))); });
    each("[data-tr]", function (el) {
      var d = D.dish[el.getAttribute("data-tr")] || {}, v = d[lang] || "";
      el.textContent = v; el.hidden = !v;
    });
    each("[data-sub]", function (el) { var s = D.sub[el.getAttribute("data-sub")]; if (s) el.textContent = s[lang] || s.it; });
    each("[data-al]", function (el) { el.textContent = (D.allergens[lang] || D.allergens.it)[+el.getAttribute("data-al")]; });
    each("[data-dishname]", function (el) {
      var p = D.plates[el.getAttribute("data-dishname")]; if (!p) return;
      var full = p[lang] || p.it;   // the mosaic shows the dish's short name, the viewer its full menu line
      el.textContent = full.length > 34 ? full.split(/ (?:con|with|mit|met) |, /)[0] : full; el.setAttribute("data-full", full);
      var img = el.closest("button") && el.closest("button").querySelector("img"); if (img) img.alt = full;
    });
    each("[data-terrname]", function (el) { var p = D.terr[+el.getAttribute("data-terrname")]; if (p) el.textContent = p[lang] || p.it; });
    each("[data-lang]", function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    if (matchMedia("(hover: none)").matches) { var cl = document.querySelector(".carta__lead"); if (cl) cl.textContent = api.t("carta.lead.touch"); }
    try { localStorage.setItem("giu-lang", lang); } catch (e) {}
    if (!silent) try { history.replaceState(null, "", location.pathname + (lang === "it" ? "" : "?lang=" + lang) + location.hash); } catch (e) {}
    document.dispatchEvent(new CustomEvent("giu:lang", { detail: { lang: lang } }));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lang]"); if (!b) return;
    e.preventDefault(); set(b.getAttribute("data-lang"));
  });

  var q = (location.search.match(/[?&]lang=(\w\w)/) || [])[1], saved = null;
  try { saved = localStorage.getItem("giu-lang"); } catch (e) {}
  var first = q || saved || "it";
  if (first !== "it" || matchMedia("(hover: none)").matches) set(first, true);
})();
