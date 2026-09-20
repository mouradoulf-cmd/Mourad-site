/* Atelier des Façadiers — instant client-side language switch (FR / EN).
   Every translatable string lives in the dictionaries below; applyLanguage()
   swaps the live DOM. The page ships baked in French for no-JS / SEO. */
(function () {
  "use strict";

  var translations = {
    fr: {
      meta: {
        description: "Atelier des Façadiers : distributeur et façonnier de solutions de bardage pour les professionnels. Stock, préconisation, logistique, usinage et service technique."
      },
      nav: {
        qui: "Qui sommes-nous",
        bardage: "Bardage",
        projets: "Projets",
        actualites: "Actualités",
        contact: "Contact",
        cta: "Demander un devis",
        mobileContact: "Contact / Devis"
      },
      hero: {
        titleHtml: "Avec notre stock, démarrez vos <em>chantiers</em> dans les starting-blocks",
        desc: "Façonnier et distributeur de solutions de bardage pour les professionnels : stock permanent, préconisation technique et logistique pensés pour tenir vos délais de chantier.",
        cta: "Demander un devis"
      },
      pillars: {
        eyebrow: "Notre expertise",
        headingHtml: "Cinq métiers, un seul <em>partenaire</em>",
        items: [
          {
            title: "Stock",
            heading: "Avec notre stock, démarrez vos chantiers dans les starting-blocks !",
            body: "Notre stock comprend une vaste gamme de panneaux et de systèmes de bardage adaptés à la réalisation rapide de chantiers. Grâce à notre stock bien fourni, nous offrons une grande flexibilité pour le démarrage et la clôture de vos projets."
          },
          {
            title: "Préconisation",
            heading: "Grâce à notre expertise, jamais de mauvaises surprises !",
            body: "La préconisation du bardage chez les architectes et maîtres d'ouvrage nous permet de valoriser la façade ventilée et les nombreux avantages qu'elle apporte en performance énergétique et en esthétisme."
          },
          {
            title: "Logistique",
            heading: "Besoin d'une livraison, notre équipe logistique est sur le pont !",
            body: "Nous livrons sur chantier pour minimiser le nombre de kilomètres parcourus par nos clients et nos produits. Nos camions sont auto-déchargeables."
          },
          {
            title: "Usinage",
            heading: "Un usinage de qualité pour des chantiers maîtrisés !",
            body: "Notre atelier permet l'usinage des panneaux fibres-ciment, compact HPL, aluminium composite et laine de roche comprimée : coupe, perçage, fraisage, rainurage, lettrage."
          },
          {
            title: "Service technique",
            heading: "Un besoin spécifique ? Pas de panique, il y a le service technique !",
            body: "Notre service technique permet un échange sur les optimisations et les différentes possibilités d'usinage pour gagner du temps de pose et baisser les taux de chute."
          }
        ]
      },
      about: {
        eyebrow: "L'expert du bardage",
        headingHtml: "Le trait d'union entre les <em>fabricants</em> et les poseurs",
        body: "Atelier des Façadiers accompagne les professionnels du bardage à chaque étape : sélection des matériaux, usinage sur-mesure, logistique de chantier et suivi technique. Un seul interlocuteur pour sécuriser vos délais et la qualité de vos façades.",
        stat1Label: "métiers intégrés",
        stat2Label: "marques distribuées"
      },
      projects: {
        eyebrow: "Réalisations",
        headingHtml: "Des <em>chantiers</em> menés du gros œuvre à la finition",
        caption1: "Nouveau bâtiment pour l'ossature",
        caption2: "Bardage métallique — finition posée",
        materialAlt: "Nouvelle gamme EQUITONE [inspira]"
      },
      cta: {
        headingHtml: "Un projet de bardage ? <em>Parlons-en.</em>",
        body: "Notre équipe vous répond pour étudier votre chantier et vous proposer la solution la plus adaptée."
      },
      footer: {
        nav1: "Qui sommes-nous ?",
        nav2: "Bardage",
        nav3: "Ossature",
        nav4: "Projets",
        nav5: "Documentation",
        nav6: "Contact / Devis",
        hours: "Lun–Jeu 7h30–17h00 · Ven 7h30–16h00",
        bottom: "© 2026 Atelier des Façadiers — Tous droits réservés"
      }
    },
    en: {
      meta: {
        description: "Atelier des Façadiers: distributor and manufacturer of cladding solutions for professionals. Stock, technical guidance, logistics, machining and technical support."
      },
      nav: {
        qui: "About us",
        bardage: "Cladding",
        projets: "Projects",
        actualites: "News",
        contact: "Contact",
        cta: "Request a quote",
        mobileContact: "Contact / Quote"
      },
      hero: {
        titleHtml: "With our stock, get your <em>job sites</em> off the starting blocks",
        desc: "Manufacturer and distributor of cladding solutions for professionals: permanent stock, technical guidance and logistics built to meet your site deadlines.",
        cta: "Request a quote"
      },
      pillars: {
        eyebrow: "Our expertise",
        headingHtml: "Five trades, one single <em>partner</em>",
        items: [
          {
            title: "Stock",
            heading: "With our stock, get your job sites off the starting blocks!",
            body: "Our stock includes a wide range of cladding panels and systems suited to fast-moving job sites. With a well-stocked inventory, we offer great flexibility for starting and closing out your projects."
          },
          {
            title: "Guidance",
            heading: "Thanks to our expertise, no bad surprises!",
            body: "Advising architects and project owners on cladding lets us highlight the benefits of ventilated facades — energy performance and aesthetics."
          },
          {
            title: "Logistics",
            heading: "Need a delivery? Our logistics team is on it!",
            body: "We deliver directly to the job site to minimise the distance travelled by our clients and our products. Our trucks are self-unloading."
          },
          {
            title: "Machining",
            heading: "Quality machining for well-controlled job sites!",
            body: "Our workshop handles machining of fibre-cement, compact HPL, aluminium composite and compressed rock wool panels: cutting, drilling, milling, grooving, engraving."
          },
          {
            title: "Technical support",
            heading: "A specific need? No panic, our technical team is here!",
            body: "Our technical team can discuss optimisations and machining options to reduce install time and cut waste rates."
          }
        ]
      },
      about: {
        eyebrow: "The cladding expert",
        headingHtml: "The link between <em>manufacturers</em> and installers",
        body: "Atelier des Façadiers supports cladding professionals at every stage: material selection, custom machining, site logistics and technical follow-up. One single point of contact to secure your deadlines and the quality of your facades.",
        stat1Label: "integrated trades",
        stat2Label: "brands distributed"
      },
      projects: {
        eyebrow: "Our work",
        headingHtml: "<em>Job sites</em> carried from shell to finish",
        caption1: "New building for the frame structure",
        caption2: "Metal cladding — finished installation",
        materialAlt: "New EQUITONE [inspira] range"
      },
      cta: {
        headingHtml: "A cladding project? <em>Let's talk.</em>",
        body: "Our team is ready to review your site and offer you the most suitable solution."
      },
      footer: {
        nav1: "About us",
        nav2: "Cladding",
        nav3: "Frame structure",
        nav4: "Projects",
        nav5: "Documentation",
        nav6: "Contact / Quote",
        hours: "Mon–Thu 7:30am–5pm · Fri 7:30am–4pm",
        bottom: "© 2026 Atelier des Façadiers — All rights reserved"
      }
    }
  };

  var currentLang = "fr";

  function t(lang, key) {
    var dict = translations[lang] || translations.fr;
    var parts = key.split(".");
    var node = dict;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return null;
      node = node[parts[i]];
    }
    return node;
  }

  function applyLanguage(lang) {
    if (!translations[lang]) lang = "fr";
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang);

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t(lang, "meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n"));
      if (val != null) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = t(lang, el.getAttribute("data-i18n-html"));
      if (val != null) el.innerHTML = val;
    });
    ["alt", "aria-label", "title"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        var val = t(lang, el.getAttribute("data-i18n-" + attr));
        if (val != null) el.setAttribute(attr, val);
      });
    });

    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    try { localStorage.setItem("facadiersLang", lang); } catch (e) {}

    if (window.FacadiersRefreshPillars) window.FacadiersRefreshPillars();
  }

  function init(defaultLang) {
    var stored = null;
    try { stored = localStorage.getItem("facadiersLang"); } catch (e) {}
    applyLanguage(stored || defaultLang);

    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  function getLang() { return currentLang; }

  window.FacadiersI18n = { init: init, applyLanguage: applyLanguage, t: t, getLang: getLang };
})();
