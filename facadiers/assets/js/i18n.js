/* Atelier des Façadiers — bascule de langue instantanée (FR / EN).
   Toutes les chaînes traduisibles vivent dans les dictionnaires ci-dessous ;
   apply() réécrit le DOM. La page est livrée en français dans le HTML pour
   le SEO et le rendu sans JavaScript. */
(function () {
  "use strict";

  var TRANSLATIONS = {
    fr: {
      meta: {
        title: "Atelier des Façadiers — Bardage pro à Reyrieux (01)",
        description: "Façonnier et distributeur de solutions de bardage pour les professionnels : stock permanent, préconisation technique, usinage et livraison chantier.",
        ogTitle: "Atelier des Façadiers — L'expert du bardage",
        ogDescription: "Stock permanent, préconisation technique, usinage et logistique de chantier : un seul interlocuteur pour vos façades."
      },
      a11y: {
        skip: "Aller au contenu principal",
        navMain: "Navigation principale",
        navMobile: "Navigation mobile",
        menu: "Menu",
        menuOpen: "Ouvrir le menu",
        menuClose: "Fermer le menu",
        trades: "Nos métiers"
      },
      nav: {
        about: "Qui sommes-nous",
        services: "Nos métiers",
        projects: "Réalisations",
        quote: "Devis",
        contact: "Contact",
        cta: "Demander un devis"
      },
      hero: {
        kicker: "Façonnier & distributeur de bardage",
        titleHtml: "Avec notre stock, démarrez vos <em>chantiers</em> dans les starting-blocks",
        desc: "Façonnier et distributeur de solutions de bardage pour les professionnels : stock permanent, préconisation technique et logistique pensés pour tenir vos délais de chantier.",
        ctaPrimary: "Demander un devis",
        ctaSecondary: "04 74 17 33 33",
        fact1: "Stock permanent",
        fact2: "Usinage sur-mesure",
        fact3: "Livraison chantier"
      },
      brands: { title: "Marques distribuées" },
      about: {
        eyebrow: "L'expert du bardage",
        headingHtml: "Le trait d'union entre les <em>fabricants</em> et les poseurs",
        body: "Atelier des Façadiers accompagne les professionnels du bardage à chaque étape : sélection des matériaux, usinage sur-mesure, logistique de chantier et suivi technique. Un seul interlocuteur pour sécuriser vos délais et la qualité de vos façades.",
        stat1Label: "métiers intégrés",
        stat2Label: "marques distribuées"
      },
      services: {
        eyebrow: "Notre expertise",
        headingHtml: "Cinq métiers, un seul <em>partenaire</em>",
        items: [
          {
            title: "Stock",
            heading: "Avec notre stock, démarrez vos chantiers dans les starting-blocks !",
            body: "Notre stock comprend une vaste gamme de panneaux et de systèmes de bardage adaptés à la réalisation rapide de chantiers. Grâce à notre stock bien fourni, nous offrons une grande flexibilité pour le démarrage et la clôture de vos projets.",
            alt: "Stock de panneaux et de systèmes de bardage"
          },
          {
            title: "Préconisation",
            heading: "Grâce à notre expertise, jamais de mauvaises surprises !",
            body: "La préconisation du bardage chez les architectes et maîtres d'ouvrage nous permet de valoriser la façade ventilée et les nombreux avantages qu'elle apporte en performance énergétique et en esthétisme.",
            alt: "Préconisation technique du bardage"
          },
          {
            title: "Logistique",
            heading: "Besoin d'une livraison, notre équipe logistique est sur le pont !",
            body: "Nous livrons sur chantier pour minimiser le nombre de kilomètres parcourus par nos clients et nos produits. Nos camions sont auto-déchargeables.",
            alt: "Logistique et livraison sur chantier"
          },
          {
            title: "Usinage",
            heading: "Un usinage de qualité pour des chantiers maîtrisés !",
            body: "Notre atelier permet l'usinage des panneaux fibres-ciment, compact HPL, aluminium composite et laine de roche comprimée : coupe, perçage, fraisage, rainurage, lettrage.",
            alt: "Atelier d'usinage des panneaux"
          },
          {
            title: "Service technique",
            heading: "Un besoin spécifique ? Pas de panique, il y a le service technique !",
            body: "Notre service technique permet un échange sur les optimisations et les différentes possibilités d'usinage pour gagner du temps de pose et baisser les taux de chute.",
            alt: "Service technique et optimisation d'usinage"
          }
        ]
      },
      projects: {
        eyebrow: "Réalisations",
        headingHtml: "Des <em>chantiers</em> menés du gros œuvre à la finition",
        caption1: "Nouveau bâtiment pour l'ossature",
        caption2: "Bardage métallique — finition posée",
        materialCaption: "Nouvelle gamme EQUITONE [inspira]",
        alt1: "Ossature en construction",
        alt2: "Bardage posé sur bâtiment industriel",
        materialAlt: "Nouvelle gamme EQUITONE [inspira]"
      },
      quote: {
        eyebrow: "Devis",
        headingHtml: "Un projet de bardage ? <em>Parlons-en.</em>",
        body: "Notre équipe vous répond pour étudier votre chantier et vous proposer la solution la plus adaptée.",
        point1: "Réponse par téléphone au 04 74 17 33 33",
        point2: "Du lundi au jeudi 7h30–17h00, vendredi 7h30–16h00"
      },
      contact: {
        eyebrow: "Contact",
        headingHtml: "Notre atelier à <em>Reyrieux</em>",
        addressLabel: "Adresse",
        route: "Itinéraire",
        phoneLabel: "Téléphone",
        callShort: "Appeler",
        hoursLabel: "Horaires",
        call: "Appeler l'atelier · 04 74 17 33 33",
        ctaText: "Un chantier à approvisionner ? Notre équipe est joignable pendant les heures d'ouverture."
      },
      form: {
        title: "Décrire votre projet",
        name: "Nom et prénom",
        namePh: "Ex. : Camille Dupont",
        errName: "Merci d'indiquer votre nom.",
        company: "Société",
        companyPh: "Ex. : Façades Rhône SARL",
        phone: "Téléphone",
        errPhone: "Merci d'indiquer un numéro de téléphone valide.",
        email: "E-mail",
        emailPh: "nom@societe.fr",
        errEmail: "Cet e-mail ne semble pas valide.",
        subject: "Votre besoin",
        subjectOther: "Autre demande",
        message: "Votre chantier",
        messagePh: "Type de bâtiment, surface, matériaux envisagés, délais…",
        errMessage: "Merci de décrire brièvement votre projet.",
        note: "Les informations saisies restent sur votre appareil : ce formulaire n'envoie rien à un serveur. Il sert à préparer votre demande, que vous nous transmettez par téléphone.",
        submit: "Préparer ma demande",
        okTitle: "Récapitulatif prêt.",
        okText: "Aucune donnée n'a été envoyée. Appelez-nous au 04 74 17 33 33 pour finaliser votre demande, ou copiez le récapitulatif ci-dessous.",
        okCall: "Appeler le 04 74 17 33 33",
        okCopy: "Copier le récapitulatif",
        copied: "Récapitulatif copié.",
        copyFail: "Copie impossible : sélectionnez le texte ci-dessus.",
        recapName: "Nom",
        recapCompany: "Société",
        recapPhone: "Téléphone",
        recapEmail: "E-mail",
        recapSubject: "Besoin",
        recapMessage: "Chantier"
      },
      footer: {
        tagline: "L'expert du bardage",
        hours: "Lun–Jeu 7h30–17h00 · Ven 7h30–16h00",
        navTitle: "Navigation",
        tradesTitle: "Nos cinq métiers",
        bottom: "© 2026 Atelier des Façadiers — Tous droits réservés"
      }
    },

    en: {
      meta: {
        title: "Atelier des Façadiers — Cladding supplier in Reyrieux (FR)",
        description: "Manufacturer and distributor of cladding solutions for professionals: permanent stock, technical guidance, machining and site delivery. Fast quotes.",
        ogTitle: "Atelier des Façadiers — The cladding expert",
        ogDescription: "Permanent stock, technical guidance, machining and site logistics: one single point of contact for your facades."
      },
      a11y: {
        skip: "Skip to main content",
        navMain: "Main navigation",
        navMobile: "Mobile navigation",
        menu: "Menu",
        menuOpen: "Open the menu",
        menuClose: "Close the menu",
        trades: "Our trades"
      },
      nav: {
        about: "About us",
        services: "Our trades",
        projects: "Our work",
        quote: "Quote",
        contact: "Contact",
        cta: "Request a quote"
      },
      hero: {
        kicker: "Cladding manufacturer & distributor",
        titleHtml: "With our stock, get your <em>job sites</em> off the starting blocks",
        desc: "Manufacturer and distributor of cladding solutions for professionals: permanent stock, technical guidance and logistics built to meet your site deadlines.",
        ctaPrimary: "Request a quote",
        ctaSecondary: "04 74 17 33 33",
        fact1: "Permanent stock",
        fact2: "Custom machining",
        fact3: "Site delivery"
      },
      brands: { title: "Brands we distribute" },
      about: {
        eyebrow: "The cladding expert",
        headingHtml: "The link between <em>manufacturers</em> and installers",
        body: "Atelier des Façadiers supports cladding professionals at every stage: material selection, custom machining, site logistics and technical follow-up. One single point of contact to secure your deadlines and the quality of your facades.",
        stat1Label: "integrated trades",
        stat2Label: "brands distributed"
      },
      services: {
        eyebrow: "Our expertise",
        headingHtml: "Five trades, one single <em>partner</em>",
        items: [
          {
            title: "Stock",
            heading: "With our stock, get your job sites off the starting blocks!",
            body: "Our stock includes a wide range of cladding panels and systems suited to fast-moving job sites. With a well-stocked inventory, we offer great flexibility for starting and closing out your projects.",
            alt: "Stock of cladding panels and systems"
          },
          {
            title: "Guidance",
            heading: "Thanks to our expertise, no bad surprises!",
            body: "Advising architects and project owners on cladding lets us highlight the benefits of ventilated facades — energy performance and aesthetics.",
            alt: "Technical cladding guidance"
          },
          {
            title: "Logistics",
            heading: "Need a delivery? Our logistics team is on it!",
            body: "We deliver directly to the job site to minimise the distance travelled by our clients and our products. Our trucks are self-unloading.",
            alt: "Logistics and delivery to the job site"
          },
          {
            title: "Machining",
            heading: "Quality machining for well-controlled job sites!",
            body: "Our workshop handles machining of fibre-cement, compact HPL, aluminium composite and compressed rock wool panels: cutting, drilling, milling, grooving, engraving.",
            alt: "Panel machining workshop"
          },
          {
            title: "Technical support",
            heading: "A specific need? No panic, our technical team is here!",
            body: "Our technical team can discuss optimisations and machining options to reduce install time and cut waste rates.",
            alt: "Technical support and machining optimisation"
          }
        ]
      },
      projects: {
        eyebrow: "Our work",
        headingHtml: "<em>Job sites</em> carried from shell to finish",
        caption1: "New building for the frame structure",
        caption2: "Metal cladding — finished installation",
        materialCaption: "New EQUITONE [inspira] range",
        alt1: "Frame structure under construction",
        alt2: "Cladding installed on an industrial building",
        materialAlt: "New EQUITONE [inspira] range"
      },
      quote: {
        eyebrow: "Quote",
        headingHtml: "A cladding project? <em>Let's talk.</em>",
        body: "Our team is ready to review your site and offer you the most suitable solution.",
        point1: "Reply by phone on +33 4 74 17 33 33",
        point2: "Monday to Thursday 7:30am–5pm, Friday 7:30am–4pm"
      },
      contact: {
        eyebrow: "Contact",
        headingHtml: "Our workshop in <em>Reyrieux</em>",
        addressLabel: "Address",
        route: "Directions",
        phoneLabel: "Phone",
        callShort: "Call",
        hoursLabel: "Opening hours",
        call: "Call the workshop · +33 4 74 17 33 33",
        ctaText: "A site to supply? Our team is available during opening hours."
      },
      form: {
        title: "Describe your project",
        name: "First and last name",
        namePh: "e.g. Camille Dupont",
        errName: "Please enter your name.",
        company: "Company",
        companyPh: "e.g. Rhône Facades Ltd",
        phone: "Phone",
        errPhone: "Please enter a valid phone number.",
        email: "E-mail",
        emailPh: "name@company.com",
        errEmail: "This e-mail address does not look valid.",
        subject: "Your need",
        subjectOther: "Other request",
        message: "Your site",
        messagePh: "Building type, surface area, materials considered, deadlines…",
        errMessage: "Please describe your project briefly.",
        note: "What you type stays on your device: this form sends nothing to a server. It prepares your request, which you pass on to us by phone.",
        submit: "Prepare my request",
        okTitle: "Summary ready.",
        okText: "No data has been sent. Call us on +33 4 74 17 33 33 to complete your request, or copy the summary below.",
        okCall: "Call +33 4 74 17 33 33",
        okCopy: "Copy the summary",
        copied: "Summary copied.",
        copyFail: "Copy failed: please select the text above.",
        recapName: "Name",
        recapCompany: "Company",
        recapPhone: "Phone",
        recapEmail: "E-mail",
        recapSubject: "Need",
        recapMessage: "Site"
      },
      footer: {
        tagline: "The cladding expert",
        hours: "Mon–Thu 7:30am–5pm · Fri 7:30am–4pm",
        navTitle: "Navigation",
        tradesTitle: "Our five trades",
        bottom: "© 2026 Atelier des Façadiers — All rights reserved"
      }
    }
  };

  var current = "fr";

  function t(key) {
    var parts = String(key).split(".");
    var node = TRANSLATIONS[current] || TRANSLATIONS.fr;
    for (var i = 0; i < parts.length && node != null; i++) node = node[parts[i]];
    if (node == null) {
      node = TRANSLATIONS.fr;
      for (var j = 0; j < parts.length && node != null; j++) node = node[parts[j]];
    }
    return node;
  }

  function setMeta(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function apply(lang) {
    if (!TRANSLATIONS[lang]) lang = "fr";
    current = lang;
    document.documentElement.setAttribute("lang", lang);

    var title = t("meta.title");
    if (title) document.title = title;
    setMeta('meta[name="description"]', t("meta.description"));
    setMeta('meta[property="og:title"]', t("meta.ogTitle"));
    setMeta('meta[property="og:description"]', t("meta.ogDescription"));
    setMeta('meta[name="twitter:title"]', t("meta.ogTitle"));
    setMeta('meta[name="twitter:description"]', t("meta.ogDescription"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n-html"));
      if (typeof val === "string") el.innerHTML = val;
    });
    ["alt", "placeholder", "title", "aria-label"].forEach(function (attr) {
      document.querySelectorAll("[data-i18n-" + attr + "]").forEach(function (el) {
        var val = t(el.getAttribute("data-i18n-" + attr));
        if (typeof val === "string") el.setAttribute(attr, val);
      });
    });

    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem("facadiersLang", lang); } catch (e) {}

    document.dispatchEvent(new CustomEvent("facadiers:lang", { detail: { lang: lang } }));
  }

  function init(defaultLang) {
    var stored = null;
    try { stored = localStorage.getItem("facadiersLang"); } catch (e) {}
    apply(stored || defaultLang || "fr");

    document.querySelectorAll(".lang-btn[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-lang"));
      });
    });
  }

  window.FacadiersI18n = {
    init: init,
    apply: apply,
    t: t,
    getLang: function () { return current; }
  };

  // La page est déjà en français dans le HTML : l'initialisation ne sert qu'à
  // restaurer une préférence enregistrée et à câbler les boutons FR/EN, elle
  // est donc indépendante de main.js (si celui-ci échoue, la page reste en FR).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init("fr"); });
  } else {
    init("fr");
  }
})();
