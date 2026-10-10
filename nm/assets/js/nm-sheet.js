/* NM Studio: the free mock-up and the meeting booking open in a sheet (a <dialog>) instead of being two long
   sections of the home page. Any link to #free or #book, and any [data-open-sheet], opens the matching sheet;
   arriving on index.html#free or #book opens it too. Esc, the close button or a tap on the backdrop closes it. */
(function () {
  "use strict";
  var sheets = { free: document.getElementById("free"), book: document.getElementById("book") };
  if (!sheets.free || sheets.free.tagName !== "DIALOG") return;
  var last = null;

  function lenis(on) { var l = window.NM_LENIS; if (l) { if (on) l.start(); else l.stop(); } }
  function open(name, trigger) {
    var d = sheets[name];
    if (!d) return;
    last = trigger || null;
    Object.keys(sheets).forEach(function (k) { if (sheets[k] && sheets[k] !== d && sheets[k].open) sheets[k].close(); });
    if (!d.open) { if (d.showModal) d.showModal(); else d.setAttribute("open", ""); }
    d.scrollTop = 0;
    var panel = d.querySelector(".sheet__panel"); if (panel) panel.scrollTop = 0;
    lenis(false);
    document.documentElement.classList.add("has-sheet");
  }
  function close(d) { if (d.close) d.close(); else { d.removeAttribute("open"); onClose(d); } }
  function onClose(d) {
    lenis(true);
    document.documentElement.classList.remove("has-sheet");
    if (location.hash === "#" + d.id && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    if (last && last.focus) last.focus({ preventScroll: true });
  }
  Object.keys(sheets).forEach(function (k) {
    var d = sheets[k];
    if (!d) return;
    d.setAttribute("data-lenis-prevent", "");
    d.addEventListener("close", function () { onClose(d); });
    d.addEventListener("click", function (e) {
      if (e.target === d || (e.target.closest && e.target.closest("[data-sheet-close]"))) close(d);
    });
  });

  // capture phase: runs before the smooth-scroll handler, so the page never jumps behind the sheet
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("a[href], [data-open-sheet]");
    if (!t) return;
    var name = t.getAttribute("data-open-sheet");
    if (!name && t.tagName === "A") {
      var url;
      try { url = new URL(t.getAttribute("href"), location.href); } catch (err) { return; }
      if (url.pathname !== location.pathname) return;
      name = url.hash.slice(1);
    }
    if (!sheets[name]) return;
    e.preventDefault(); e.stopPropagation();
    open(name, t);
  }, true);

  // the floating WhatsApp button steps aside while the final call (big WhatsApp button) or the footer is visible
  var wa = document.querySelector(".wa-float"), ends = [document.getElementById("contact"), document.querySelector(".footer")].filter(Boolean);
  if (wa && ends.length && "IntersectionObserver" in window) {
    var seen = new Set();
    var eio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      wa.classList.toggle("is-tucked", seen.size > 0);
    }, { threshold: 0.15 });
    ends.forEach(function (el) { eio.observe(el); });
  }

  var h = location.hash.slice(1);
  if (sheets[h]) setTimeout(function () { open(h); }, 250);
})();
