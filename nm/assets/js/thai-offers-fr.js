/* NM Studio: the Thailand price list (French reading copy).
   Thai shop owners get their own, simpler offer: a translated menu from 299 baht, a Google listing at 790 baht and
   the complete pack (website + Google + QR menu) at 2,990 baht setup, then the care plan at 390 baht a month (or 3,900
   baht a year, 2 months free), plus two optional monthly plans (growth, social media). Every other language keeps the regular offers (offers-config.js), untouched.
   - shown whenever the page is read in Thai (the language switch works in place, so this listens to "nm:lang")
   - the regular cards, the billing toggle, the care box, the comparison table and the guide are hidden while it shows
   - the menu calculator adds 150 baht per extra page (beyond 2) and 150 baht per printed, laminated copy
   - to change a price: edit P below, the cards and the calculator follow */
(function () {
  "use strict";
  var P = { menu: 299, menuPages: 2, page: 150, copy: 150, google: 790, pack: 2990, care: 390, careYear: 3900, grow: 990, social: 2500 };
  var C = window.NM_CONTACT || {};
  var WA = C.whatsappNumber ? "https://wa.me/" + C.whatsappNumber + "?text=" : "";
  var WA_LINK = C.whatsappLink || "https://wa.me/qr/PYPOVXTCVM74I1";
  function wa(msg) { return WA ? WA + encodeURIComponent(msg) : WA_LINK; }
  var RATE = 38; /* ≈ 38 THB per euro, rounded, for reading only */
  function b(n) { return Math.round(n / RATE).toLocaleString("fr-FR"); }

  var CHECK = '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ARROW = '<svg aria-hidden="true" class="btn__arrow" fill="none" viewBox="0 0 20 20"><path d="M4 10h11m0 0l-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"></path></svg>';
  var ICON = {
    menu: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="6" width="28" height="36" rx="4"/><path d="M17 15h14M17 22h14M17 29h9"/><path d="M33 33l4 4"/><circle cx="31" cy="31" r="3"/></svg>',
    google: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 43s13-11.6 13-22A13 13 0 0 0 11 21c0 10.4 13 22 13 22z"/><circle cx="24" cy="20.5" r="4.5"/></svg>',
    pack: '<svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 5l15 6v11c0 10-6.5 17.5-15 21-8.5-3.5-15-11-15-21V11z"/><path d="M16.5 24l5.5 5.5 10-11"/></svg>'
  };
  function list(items) { return '<ul class="tho-card__list">' + items.map(function (t) { return "<li>" + CHECK + "<span>" + t + "</span></li>"; }).join("") + "</ul>"; }

  function html(freeHref) {
    return '' +
      '<div class="tho__grid">' +
        '<article class="tho-card">' +
          '<div class="tho-card__top"><span class="tho-card__tier">01</span><span class="tho-card__ic">' + ICON.menu + '</span></div>' +
          '<p class="tho-card__kicker">Le plus simple pour démarrer</p>' +
          '<h3 class="tho-card__name">Menu traduit</h3>' +
          '<p class="tho-card__benefit">Votre menu traduit et remis en page avec soin, d’aspect professionnel : les touristes le lisent et commandent tout de suite.</p>' +
          '<p class="tho-card__price"><strong>' + b(P.menu) + '</strong><span class="tho-card__cur">€</span></p>' +
          '<p class="tho-card__unit">Menu complet, jusqu’à ' + P.menuPages + ' pages</p>' +
          list(["Traduction en anglais, ou dans la langue de vos clients", "Des noms de plats que les touristes comprennent tout de suite", "Nouvelle mise en page, belles couleurs, lecture facile", "Fichier prêt à imprimer, envoyé par LINE ou WhatsApp"]) +
          '<details class="tho-opt"><summary class="tho-opt__sum"><span>Touchez ici pour voir les options en plus</span><svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="tho-opt__body">' +
      '<div class="tho-extra">' +
        '<div class="tho-extra__copy">' +
          '<p class="tho-extra__k">Envie d’un menu premium comme les grands restaurants ?</p>' +
          '<h3 class="tho-extra__t">Options à la carte</h3>' +
          '<ul class="tho-extra__list">' +
            '<li><b>+' + b(P.page) + ' €</b><span>par page, pour un menu de plus de ' + P.menuPages + ' pages</span></li>' +
            '<li><b>+' + b(P.copy) + ' €</b><span>par exemplaire : impression couleur sur papier épais, plastifié de qualité, résistant à l’eau et aux taches, coins arrondis</span></li>' +
          '</ul>' +
        '</div>' +
        '<div class="tho-calc" aria-labelledby="thoCalcT">' +
          '<p class="tho-calc__t" id="thoCalcT">Calculez le prix de votre menu</p>' +
          '<div class="tho-calc__row"><span>Nombre de pages</span><div class="tho-step"><button type="button" data-step="pages" data-d="-1" aria-label="Moins de pages">−</button><output data-out="pages">2</output><button type="button" data-step="pages" data-d="1" aria-label="Plus de pages">+</button></div></div>' +
          '<div class="tho-calc__row"><span>Exemplaires plastifiés premium</span><div class="tho-step"><button type="button" data-step="copies" data-d="-1" aria-label="Moins d’exemplaires">−</button><output data-out="copies">0</output><button type="button" data-step="copies" data-d="1" aria-label="Plus d’exemplaires">+</button></div></div>' +
          '<p class="tho-calc__total" aria-live="polite"><span>Total</span><strong data-out="total">' + b(P.menu) + ' €</strong></p>' +
          '<p class="tho-calc__note">Exemple : menu de 4 pages + 6 exemplaires plastifiés = ' + b(P.menu + 2 * P.page + 6 * P.copy) + ' €</p>' +
        '</div>' +
      '</div>' +
          '</div></details>' +
          '<a class="btn btn--outline btn--block tho-card__cta" href="' + wa("Bonjour NM Studio, le menu traduit m’intéresse") + '" target="_blank" rel="noopener"><span>Commander le menu traduit</span>' + ARROW + '</a>' +
        '</article>' +
        '<article class="tho-card">' +
          '<div class="tho-card__top"><span class="tho-card__tier">02</span><span class="tho-card__ic">' + ICON.google + '</span></div>' +
          '<p class="tho-card__kicker">Pour que les clients vous trouvent</p>' +
          '<h3 class="tho-card__name">Google Business Profile</h3>' +
          '<p class="tho-card__benefit">Votre commerce sur Google Maps, avec des photos qui donnent envie de passer.</p>' +
          '<p class="tho-card__price"><strong>' + b(P.google) + '</strong><span class="tho-card__cur">€</span></p>' +
          '<p class="tho-card__unit">Paiement unique</p>' +
          list(["Création ou mise à niveau complète de la fiche", "Photos du lieu et de plats appétissants", "Horaires, téléphone et position sur la carte", "Aide à la validation auprès de Google jusqu’au bout"]) +
          '<a class="btn btn--outline btn--block tho-card__cta" href="' + wa("Bonjour NM Studio, le Google Business Profile m’intéresse") + '" target="_blank" rel="noopener"><span>Commander la fiche Google</span>' + ARROW + '</a>' +
        '</article>' +
        '<article class="tho-card tho-card--feat">' +
          '<span class="tho-card__badge">Recommandé</span>' +
          '<div class="tho-card__top"><span class="tho-card__tier">03</span><span class="tho-card__ic">' + ICON.pack + '</span></div>' +
          '<p class="tho-card__kicker">Le meilleur rapport qualité-prix, tout en un</p>' +
          '<h3 class="tho-card__name">Pack complet</h3>' +
          '<p class="tho-card__benefit">Site web + Google + menu QR : tout ce que cherchent les touristes, dans un seul pack.</p>' +
          '<p class="tho-card__price"><strong>' + b(P.pack) + '</strong><span class="tho-card__cur">€</span></p>' +
          '<p class="tho-card__unit">Installation · puis entretien ' + b(P.care) + ' €/mois</p>' +
          list(["Site web à partir de vos photos, en plusieurs langues", "Google Business Profile (normalement " + b(P.google) + " €)", "Menu en ligne + QR code pour chaque table", "Réservation de table par WhatsApp ou LINE", "Entretien chaque mois : hébergement, modifications illimitées du menu, des prix et des photos", "Installation payable en 2 fois"]) +
          '<a class="btn btn--sun btn--block tho-card__cta" href="' + freeHref + '"><span>Voir d’abord la maquette gratuite</span>' + ARROW + '</a>' +
          '<a class="tho-card__alt" href="' + wa("Bonjour NM Studio, le pack complet m’intéresse") + '" target="_blank" rel="noopener">ou parlez-nous sur WhatsApp</a>' +
        '</article>' +
      '</div>' +

      '<div class="tho-care">' +
        '<div class="tho-care__head">' +
          '<p class="tho-extra__k">Après la mise en ligne</p>' +
          '<h3 class="tho-extra__t">Forfait d’entretien mensuel : nous nous occupons de votre commerce chaque mois</h3>' +
          '<p class="tho-care__lead">Compte à partir de la mise en ligne. Sans contrat, résiliable à tout moment.</p>' +
        '</div>' +
        '<div class="tho-care__grid">' +
          '<div class="tho-plan tho-plan--base"><p class="tho-plan__tag">Inclus dans le pack complet</p><p class="tho-plan__name">Entretien de base</p>' +
            '<p class="tho-plan__price"><strong>' + b(P.care) + '</strong> €/mois</p><p class="tho-plan__alt">ou ' + b(P.careYear) + ' €/an (2 mois offerts)</p>' +
            list(["Hébergement, site toujours en ligne", "Modifications illimitées : menu, prix, photos, horaires", "Un message sur WhatsApp ou LINE et c’est fait"]) + '</div>' +
          '</div>' +
        '<details class="tho-more"><summary class="tho-more__sum"><span>Options en plus (facultatives)</span><svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M5 8l5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></summary><div class="tho-more__body"><div class="tho-care__grid">' +
          '<div class="tho-plan"><p class="tho-plan__tag">En option</p><p class="tho-plan__name">Croissance</p>' +
            '<p class="tho-plan__price"><strong>' + b(P.grow) + '</strong> €/mois</p><p class="tho-plan__alt">Tout l’entretien de base, et</p>' +
            list(["Publication Google chaque semaine", "Réponse aux avis clients", "Promotion du mois sur le site et sur Google"]) + '</div>' +
          '<div class="tho-plan"><p class="tho-plan__tag">En option</p><p class="tho-plan__name">Réseaux sociaux</p>' +
            '<p class="tho-plan__price"><span class="tho-plan__from">dès</span> <strong>' + b(P.social) + '</strong> €/mois</p><p class="tho-plan__alt">Pour être vu tous les jours</p>' +
            list(["Publications Facebook et Instagram", "Courtes vidéos TikTok et Reels", "Plan de contenu chaque mois"]) + '</div>' +
        '</div>' +

      '</div></details>' +
      '</div>' +

      '<ul class="tho-promise">' +
        '<li>' + CHECK + '<span>Maquette gratuite avant de décider</span></li>' +
        '<li>' + CHECK + '<span>Sans contrat, résiliable à tout moment</span></li>' +
        '<li>' + CHECK + '<span>Installation payable en 2 fois</span></li>' +
        '<li>' + CHECK + '<span>Paiement facile par PromptPay</span></li>' +
      '</ul>';
  }

  function calc(box) {
    var st = { pages: P.menuPages, copies: 0 }, lim = { pages: [1, 30], copies: [0, 60] };
    function render() {
      box.querySelector('[data-out="pages"]').textContent = st.pages;
      box.querySelector('[data-out="copies"]').textContent = st.copies;
      var total = P.menu + Math.max(0, st.pages - P.menuPages) * P.page + st.copies * P.copy;
      box.querySelector('[data-out="total"]').textContent = b(total) + " €";
      [].forEach.call(box.querySelectorAll("[data-step]"), function (btn) {
        var k = btn.getAttribute("data-step"), d = +btn.getAttribute("data-d");
        btn.disabled = d < 0 ? st[k] <= lim[k][0] : st[k] >= lim[k][1];
      });
    }
    box.addEventListener("click", function (e) {
      var btn = e.target.closest && e.target.closest("[data-step]");
      if (!btn) return;
      var k = btn.getAttribute("data-step");
      st[k] = Math.max(lim[k][0], Math.min(lim[k][1], st[k] + +btn.getAttribute("data-d")));
      render();
    });
    render();
  }

  var HIDE = [".offer-grid", ".offers__links", ".pcards", ".bill", ".carebox", "#compare", "#guide"];
  var box = null, hidden = [];
  function anchor() { return document.querySelector("#offers .offer-grid") || document.querySelector("#plans .pcards"); }

  function apply(lang) {
    var th = lang === "fr", a = anchor();
    if (!a) return;
    if (th && !box) {
      box = document.createElement("div");
      box.className = "tho"; box.id = "thOffers";
      box.innerHTML = html(document.getElementById("free") ? "#free" : "index.html#free");
      a.parentNode.insertBefore(box, a);
      calc(box.querySelector(".tho-calc"));
    }
    if (box) box.classList.toggle("tho--off", !th);
    if (th) {
      hidden = [];
      HIDE.forEach(function (sel) { [].forEach.call(document.querySelectorAll(sel), function (el) { el.classList.add("tho-hide"); hidden.push(el); }); });
    } else {
      hidden.forEach(function (el) { el.classList.remove("tho-hide"); }); hidden = [];
    }
  }

  document.addEventListener("nm:lang", function (e) { apply(e.detail && e.detail.lang); });
  apply(window.NM_LANG || document.documentElement.lang);
})();
