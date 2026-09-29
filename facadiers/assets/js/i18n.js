/* Atelier des Façadiers — i18n
   French is baked into the HTML and captured from the DOM at load, so only
   the English dictionary lives here. Strings built in JS are in UI. */
(function () {
  "use strict";

  var EN = {
    "a11y.skip": "Skip to content",
    "a11y.home": "Atelier des Façadiers — home",
    "a11y.nav": "Main",
    "a11y.lang": "Language",
    "a11y.menu": "Menu",
    "a11y.footer": "Footer",
    "nav.trades": "Services",
    "nav.materials": "Materials",
    "nav.work": "Projects",
    "nav.method": "Process",
    "nav.quote": "Quote",
    "nav.cta": "Request a quote",

    "hero.eyebrow": "Cladding fabricator &amp; distributor · Reyrieux, France",
    "hero.t1": "Your façades",
    "hero.t2": "start",
    "hero.t3": "here.",
    "hero.lead": "Permanent stock, made-to-measure machining and delivery to site: we supply installers and architects with cladding solutions, from the first panel to the last.",
    "hero.cta": "Request a quote",
    "hero.cta2": "Explore materials",
    "hero.k1": "Permanent stock",
    "hero.k2": "Custom machining",
    "hero.k3": "Site delivery",
    "hero.k4": "Technical support",
    "ex.title": "Explore by material",
    "ex.fibre": "Fibre cement",
    "ex.bois": "Wood &amp; composite",
    "ex.metal": "Aluminium composite",
    "ex.hpl": "Compact HPL",
    "ex.mineral": "Stone wool",

    "proof.aria": "In numbers",
    "proof.1": "integrated trades, one single contact",
    "proof.2": "leading brands we distribute",
    "proof.3": "panel families machined in our workshop",
    "proof.4": "wasted miles: we deliver straight to site",
    "brands.aria": "Brands we distribute",

    "trades.tag": "Our expertise",
    "trades.title": "Five trades, <em>one partner.</em>",
    "trades.aside": "The link between manufacturers and installers: from choosing materials to delivery, a single contact keeps your project on track.",
    "t.0k": "Stock",
    "t.0h": "Start every job off the blocks.",
    "t.0b": "A wide range of panels and cladding systems available immediately, so you can start and finish your projects without waiting on manufacturer lead times.",
    "t.1k": "Specification",
    "t.1h": "No nasty surprises.",
    "t.1b": "We guide architects and clients in choosing materials and champion the ventilated façade: energy performance, durability and looks.",
    "t.2k": "Logistics",
    "t.2h": "Our logistics team is on deck.",
    "t.2b": "Direct delivery to site with self-unloading trucks, cutting the miles travelled by your crews and our products.",
    "t.3k": "Machining",
    "t.3h": "Panels ready to install.",
    "t.3b": "Cutting, drilling, milling, grooving and lettering of fibre cement, compact HPL, aluminium composite and compressed stone wool panels, right in our workshop.",
    "t.4k": "Technical support",
    "t.4h": "A specific need? Let's talk.",
    "t.4b": "We optimise panel layouts and machining options to save installation time and reduce offcut waste.",

    "mat.tag": "Material library",
    "mat.title": "The right material <em>for every façade.</em>",
    "mat.aside": "We distribute and fabricate the main families of cladding for ventilated façades. Samples available on request.",
    "mat.1t": "Fibre cement",
    "mat.1d": "Mineral, durable, non-combustible. Through-coloured or stained finishes.",
    "mat.1a": "Grey fibre cement panels on a façade",
    "mat.2t": "Wood &amp; composite",
    "mat.2d": "The warmth of wood, boards and open slats, with less maintenance.",
    "mat.2a": "Vertical open-joint timber slats",
    "mat.3t": "Aluminium composite",
    "mat.3d": "Large formats, crisp lines, cassettes and curved panels.",
    "mat.3a": "Standing-seam metal façade",
    "mat.4t": "Compact HPL",
    "mat.4d": "Bold colours and decors, highly resistant to UV and impact.",
    "mat.4a": "Façade panels with a hexagonal pattern",
    "mat.5t": "Compressed stone wool",
    "mat.5d": "Light, easy to machine, stone, wood and colour finishes.",
    "mat.5a": "Textured grey mineral cladding",
    "mat.6t": "Accessories &amp; systems",
    "mat.6d": "Sub-frames, fixings, profiles and membranes for a complete ventilated façade.",
    "mat.6a": "Copper panels above timber boards",
    "mat.6b": "Matching systems",

    "work.tag": "Projects",
    "work.title": "From shell <em>to finish.</em>",
    "work.aside": "Housing, offices, public buildings: a few of the façade types we supply. Illustrative images.",
    "work.prev": "Previous project",
    "work.next": "Next project",
    "work.1k": "Private house", "work.1t": "Composite cladding &amp; render", "work.1a": "Contemporary house at dusk",
    "work.2k": "Apartments", "work.2t": "Mineral cladding", "work.2a": "Small stone-clad apartment building at dusk",
    "work.3k": "Offices", "work.3t": "Aluminium slats", "work.3a": "Façade with diagonal metal slats",
    "work.4k": "Public building", "work.4t": "Soffit &amp; cladding", "work.4a": "Roof overhang and brick-slip façade",
    "work.5k": "Headquarters", "work.5t": "Metal cassettes", "work.5a": "Angular metal-clad building behind trees",
    "work.6k": "Residence", "work.6t": "Tinted 3D panels", "work.6a": "Green façade with wavy panels",

    "method.tag": "Process",
    "method.title": "From specification <em>to installation.</em>",
    "method.1t": "Study", "method.1b": "Send us your plans and constraints; we recommend the right materials and system.",
    "method.2t": "Quote", "method.2b": "A detailed quote, including panel layout and offcut optimisation.",
    "method.3t": "Machining", "method.3b": "Cut and fabricated in our workshop: panels arrive ready to install.",
    "method.4t": "Delivery", "method.4b": "To site, right on time, with our self-unloading trucks.",

    "quote.tag": "Quote",
    "quote.title": "A cladding project? <em>Let's talk.</em>",
    "quote.lead": "Describe your project in a minute: our team will get back to you with a recommendation and a quote.",
    "quote.call": "Call us",
    "quote.visit": "Visit us",
    "quote.hoursL": "Opening hours",
    "quote.hours": "Mon–Thu 7:30am–5pm · Fri 7:30am–4pm",
    "quote.type": "Project type",
    "quote.new": "New build",
    "quote.reno": "Renovation",
    "quote.ite": "External insulation",
    "quote.mat": "Material in mind",
    "quote.advice": "Advise me",
    "quote.name": "Name",
    "quote.company": "Company",
    "quote.email": "Email",
    "quote.phone": "Phone",
    "quote.area": "Area (m²)",
    "quote.city": "Site location",
    "quote.msg": "Your project",
    "quote.msgPh": "Deadlines, constraints, available plans…",
    "quote.send": "Send my request",
    "quote.hint": "Your email app opens with the request pre-filled. No data is stored on this site.",

    "footer.rights": "© 2026 Atelier des Façadiers — All rights reserved",
    "footer.credit": "Website by"
  };

  var UI = {
    fr: {
      m: { fibre: "Fibres-ciment", bois: "Bois & composite", metal: "Aluminium composite", hpl: "Compact HPL", mineral: "Laine de roche compressée" },
      trades: ["Stock", "Préconisation", "Logistique", "Usinage", "Service technique"],
      errName: "Indiquez votre nom.",
      errEmail: "Adresse e-mail invalide.",
      sent: "Votre messagerie s'ouvre avec la demande…",
      subject: "Demande de devis bardage",
      lines: { type: "Type de projet", mat: "Matériau", name: "Nom", company: "Société", email: "E-mail", phone: "Téléphone", area: "Surface", city: "Chantier", msg: "Projet" },
      types: { neuf: "Construction neuve", reno: "Rénovation", ite: "Isolation extérieure" },
      advice: "À conseiller",
      hello: "Bonjour,\n\nVoici ma demande de devis :"
    },
    en: {
      m: { fibre: "Fibre cement", bois: "Wood & composite", metal: "Aluminium composite", hpl: "Compact HPL", mineral: "Compressed stone wool" },
      trades: ["Stock", "Specification", "Logistics", "Machining", "Technical support"],
      errName: "Please enter your name.",
      errEmail: "Invalid email address.",
      sent: "Your email app is opening with the request…",
      subject: "Cladding quote request",
      lines: { type: "Project type", mat: "Material", name: "Name", company: "Company", email: "Email", phone: "Phone", area: "Area", city: "Site", msg: "Project" },
      types: { neuf: "New build", reno: "Renovation", ite: "External insulation" },
      advice: "Advise me",
      hello: "Hello,\n\nHere is my quote request:"
    }
  };

  var KEY = "facadiersLang";
  var FR = {}, FR_ATTR = {};
  var current = "fr";

  function capture() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in FR)) FR[k] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"), attr = p[0].trim(), k = (p[1] || "").trim();
        if (k && !(k in FR_ATTR)) FR_ATTR[k] = el.getAttribute(attr) || "";
      });
    });
  }

  function t(k) {
    if (current === "en" && k in EN) return EN[k];
    return k in FR ? FR[k] : (k in FR_ATTR ? FR_ATTR[k] : k);
  }

  function apply(lang) {
    current = lang === "en" ? "en" : "fr";
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"), attr = p[0].trim(), k = (p[1] || "").trim();
        if (!k) return;
        var v = current === "en" && k in EN ? EN[k] : FR_ATTR[k];
        if (v != null) el.setAttribute(attr, v.replace(/&amp;/g, "&"));
      });
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === current));
    });
    document.title = current === "en" ? "Atelier des Façadiers — Cladding specialists" : "Atelier des Façadiers — L'expert du bardage";
    try { localStorage.setItem(KEY, current); } catch (e) {}
    document.dispatchEvent(new CustomEvent("fa:lang", { detail: current }));
  }

  capture();
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var q = /[?&]lang=(fr|en)/.exec(location.search);
  apply(q ? q[1] : saved || "fr");

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-lang]");
    if (b) apply(b.getAttribute("data-lang"));
  });

  window.FAI18n = {
    apply: apply,
    t: t,
    lang: function () { return current; },
    ui: function () { return UI[current]; }
  };
})();
