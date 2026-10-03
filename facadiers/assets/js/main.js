/* Atelier des Façadiers — interactions (vanilla JS, aucune dépendance).
   Principe directeur : rien ne dépend du JavaScript pour être lisible. Les
   animations ne masquent du contenu qu'après confirmation de l'observateur,
   et tout est révélé par un filet de sécurité. */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function t(key) {
    var i18n = window.FacadiersI18n;
    var v = i18n ? i18n.t(key) : null;
    return typeof v === "string" ? v : key;
  }

  /* ---------- En-tête : barre pleine une fois la page défilée ---------- */
  var header = $("#siteHeader");
  if (header) {
    var syncHeader = function () {
      header.classList.toggle("is-stuck", (window.scrollY || window.pageYOffset || 0) > 24);
    };
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  var burger = $("#burgerBtn");
  var mobileNav = $("#mobileNav");
  if (burger && mobileNav) {
    var closeNav = function (giveFocusBack) {
      mobileNav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", t("a11y.menuOpen"));
      document.body.style.overflow = "";
      if (giveFocusBack) burger.focus();
    };
    var openNav = function () {
      mobileNav.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      burger.setAttribute("aria-label", t("a11y.menuClose"));
      document.body.style.overflow = "hidden";
      // Le panneau passe de visibility:hidden à visible : on attend la fin de
      // la transition, sinon le focus ne peut pas être déplacé.
      var first = mobileNav.querySelector("a, button");
      if (first) window.setTimeout(function () { first.focus(); }, reduceMotion ? 0 : 320);
    };

    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") closeNav(false);
      else openNav();
    });

    $$("a", mobileNav).forEach(function (link) {
      link.addEventListener("click", function () { closeNav(false); });
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target === mobileNav) closeNav(true);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        e.preventDefault();
        closeNav(true);
      }
    });

    // Retour au menu desktop : on ferme proprement l'état mobile.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024 && mobileNav.classList.contains("is-open")) closeNav(false);
    });
  }

  /* ---------- Apparitions au scroll ---------- */
  var revealEls = $$(".reveal");
  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    // On ne masque le contenu qu'une fois l'observateur disponible : si le JS
    // s'arrête avant, tout reste visible.
    var reveal = function () {
      html.classList.add("anim");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
      // Filet de sécurité : plus rien d'invisible au bout de 3 s.
      window.setTimeout(function () {
        revealEls.forEach(function (el) { el.classList.add("is-in"); });
      }, 3000);
    };
    try { reveal(); } catch (e) { html.classList.remove("anim"); }
  }

  /* ---------- Compteurs (les valeurs sont déjà dans le HTML) ---------- */
  var counters = $$("[data-count]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute("data-count")) || 0;
        var start = null;
        var duration = 1100;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        countIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { countIo.observe(el); });
  }

  /* ---------- Formulaire de devis ---------- */
  var form = $("#quoteForm");
  if (form) {
    var result = $("#quoteResult");
    var recap = $("#quoteRecap");
    var copyBtn = $("#quoteCopy");
    var submitBtn = form.querySelector('button[type="submit"]');
    var inputs = {
      name: $("#qName"),
      company: $("#qCompany"),
      phone: $("#qPhone"),
      email: $("#qEmail"),
      subject: $("#qSubject"),
      message: $("#qMessage")
    };
    var errorFor = {
      name: $("#qNameErr"),
      phone: $("#qPhoneErr"),
      email: $("#qEmailErr"),
      message: $("#qMessageErr")
    };

    var setError = function (key, on) {
      var input = inputs[key];
      var err = errorFor[key];
      if (!input) return;
      if (on) {
        input.setAttribute("aria-invalid", "true");
        if (err) err.hidden = false;
      } else {
        input.removeAttribute("aria-invalid");
        if (err) err.hidden = true;
      }
    };

    var value = function (key) {
      return inputs[key] ? inputs[key].value.trim() : "";
    };

    var validate = function () {
      var firstInvalid = null;
      var fail = function (key) {
        setError(key, true);
        if (!firstInvalid) firstInvalid = inputs[key];
      };

      if (!value("name")) fail("name"); else setError("name", false);

      var phone = value("phone").replace(/[^0-9+]/g, "");
      if (phone.replace(/\+/g, "").length < 9) fail("phone"); else setError("phone", false);

      var mail = value("email");
      if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) fail("email"); else setError("email", false);

      if (value("message").length < 10) fail("message"); else setError("message", false);

      if (firstInvalid) firstInvalid.focus();
      return !firstInvalid;
    };

    var renderRecap = function () {
      var lines = [];
      var line = function (labelKey, key) {
        var v = value(key);
        if (v) lines.push(t(labelKey) + " : " + v);
      };
      line("form.recapName", "name");
      line("form.recapCompany", "company");
      line("form.recapPhone", "phone");
      line("form.recapEmail", "email");
      line("form.recapSubject", "subject");
      line("form.recapMessage", "message");
      lines.push("");
      lines.push("Atelier des Façadiers — 7 rue des Garennes, 01600 Reyrieux — 04 74 17 33 33");
      recap.textContent = lines.join("\n");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        if (result) result.hidden = true;
        return;
      }

      renderRecap();
      if (result) {
        result.hidden = false;
        result.focus({ preventScroll: true });
        if (result.scrollIntoView) result.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
      }

      // Repli honnête : tant qu'aucun point d'envoi n'existe, rien n'est
      // transmis. Si une adresse est renseignée dans data-quote-email, le
      // client de messagerie prend le relais.
      var mail = form.getAttribute("data-quote-email");
      if (mail) {
        var subject = t("form.recapSubject") + " — " + (value("subject") || "Atelier des Façadiers");
        window.location.href = "mailto:" + mail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(recap.textContent);
      }
    });

    // On efface l'erreur dès que le champ est corrigé.
    Object.keys(inputs).forEach(function (key) {
      var input = inputs[key];
      if (!input) return;
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") setError(key, false);
      });
    });

    if (copyBtn && recap) {
      copyBtn.addEventListener("click", function () {
        var text = recap.textContent;
        var done = function (ok) {
          copyBtn.textContent = ok ? t("form.copied") : t("form.copyFail");
          window.setTimeout(function () {
            copyBtn.textContent = t("form.okCopy");
          }, 2600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
        } else {
          try {
            var range = document.createRange();
            range.selectNodeContents(recap);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            done(document.execCommand("copy"));
          } catch (err) {
            done(false);
          }
        }
      });
    }

    // Le récapitulatif suit la langue choisie.
    document.addEventListener("facadiers:lang", function () {
      if (result && !result.hidden) renderRecap();
    });

    if (submitBtn) submitBtn.setAttribute("aria-controls", "quoteResult");
  }
})();
