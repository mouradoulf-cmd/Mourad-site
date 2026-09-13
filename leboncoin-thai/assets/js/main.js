(function () {
  "use strict";

  var STORAGE_KEY = "talatthai_listings_v1";

  var CATEGORIES = [
    { id: "vehicules", label: "Véhicules", icon: "icon-car" },
    { id: "immobilier", label: "Immobilier", icon: "icon-home" },
    { id: "electronique", label: "Électronique", icon: "icon-device" },
    { id: "mode", label: "Mode & Beauté", icon: "icon-shirt" },
    { id: "maison", label: "Maison & Jardin", icon: "icon-sofa" },
    { id: "emploi", label: "Emploi", icon: "icon-briefcase" },
    { id: "services", label: "Services", icon: "icon-tool" },
    { id: "loisirs", label: "Loisirs & Sport", icon: "icon-ball" }
  ];

  var CITIES = [
    "Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Krabi",
    "Koh Samui", "Hua Hin", "Udon Thani", "Chiang Rai"
  ];

  var GRADIENTS = [
    "linear-gradient(135deg,#0e2a4a,#12886f)",
    "linear-gradient(135deg,#c98f22,#e0a836)",
    "linear-gradient(135deg,#0d6b57,#12886f)",
    "linear-gradient(135deg,#081c33,#0e2a4a)",
    "linear-gradient(135deg,#d1483f,#c98f22)"
  ];

  var SEED_LISTINGS = [
    { id: "s1", title: "Honda Wave 125i 2020, très bon état", category: "vehicules", price: 32000, city: "Bangkok", description: "Scooter Honda Wave 125i, entretien régulier, carte grise à jour, pneus neufs. Vendu avec 2 casques.", phone: "081 234 5678", line: "@somchai_moto", daysAgo: 1, featured: true },
    { id: "s2", title: "Condo 1 chambre vue mer, Patong", category: "immobilier", price: 2800000, city: "Phuket", description: "Condominium 35m², 8ème étage, vue mer partielle, piscine commune, parking inclus. Proche plage de Patong.", phone: "086 555 1122", line: "@phuketcondo", daysAgo: 2, featured: true },
    { id: "s3", title: "iPhone 13 Pro 256Go, débloqué", category: "electronique", price: 18500, city: "Bangkok", description: "iPhone 13 Pro état impeccable, batterie 91%, boîte et chargeur d'origine inclus.", phone: "089 777 3344", line: "", daysAgo: 0 },
    { id: "s4", title: "Toyota Vios 2019 automatique", category: "vehicules", price: 385000, city: "Chiang Mai", description: "Toyota Vios 1.5G automatique, 62 000 km, un seul propriétaire, entretien chez concessionnaire.", phone: "093 222 4455", line: "@vios_chiangmai", daysAgo: 3 },
    { id: "s5", title: "Maison 3 chambres avec jardin", category: "immobilier", price: 4200000, city: "Udon Thani", description: "Maison familiale 150m² sur terrain de 400m², 3 chambres, 2 salles de bain, jardin arboré, quartier calme.", phone: "085 111 9988", line: "", daysAgo: 5 },
    { id: "s6", title: "PlayStation 5 + 2 manettes + 5 jeux", category: "electronique", price: 14900, city: "Pattaya", description: "PS5 édition standard, très peu utilisée, avec 2 manettes DualSense et 5 jeux physiques.", phone: "062 444 7766", line: "@gamer_pattaya", daysAgo: 1, featured: true },
    { id: "s7", title: "Robe de soirée en soie thaïe, taille M", category: "mode", price: 2500, city: "Bangkok", description: "Robe traditionnelle en soie thaïe cousue main, portée une seule fois, taille M.", phone: "080 999 2233", line: "", daysAgo: 4 },
    { id: "s8", title: "Canapé rotin 3 places + table basse", category: "maison", price: 6800, city: "Koh Samui", description: "Ensemble salon en rotin naturel, coussins inclus, très bon état, à venir chercher sur place.", phone: "077 333 8899", line: "", daysAgo: 6 },
    { id: "s9", title: "Serveur recherché, restaurant bord de mer", category: "emploi", price: 15000, city: "Hua Hin", description: "Restaurant recherche serveur/serveuse à temps plein, anglais courant apprécié, logement possible.", phone: "032 555 6677", line: "@huahin_resto", daysAgo: 2 },
    { id: "s10", title: "Cours particuliers d'anglais et de thaï", category: "services", price: 400, city: "Chiang Mai", description: "Professeur bilingue propose cours particuliers d'anglais et de thaï, tous niveaux, à domicile ou en ligne.", phone: "094 666 1122", line: "@teachcnx", daysAgo: 0 },
    { id: "s11", title: "Planche de surf 6'2 + housse", category: "loisirs", price: 5200, city: "Phuket", description: "Planche de surf shortboard 6'2, quelques marques d'usage, housse de transport incluse.", phone: "061 888 5544", line: "", daysAgo: 3 },
    { id: "s12", title: "Vélo VTT Trek, taille M", category: "loisirs", price: 9800, city: "Chiang Rai", description: "VTT Trek Marlin 7, taille M, freins à disque hydrauliques, très peu servi.", phone: "088 222 9911", line: "@trek_cnx", daysAgo: 5 },
    { id: "s13", title: "Terrain constructible 2 rai", category: "immobilier", price: 5600000, city: "Krabi", description: "Terrain plat de 2 rai avec titre de propriété Chanote, accès route bitumée, proche plage.", phone: "075 444 3322", line: "", daysAgo: 7 },
    { id: "s14", title: "MacBook Air M2 2023, 8/256Go", category: "electronique", price: 32000, city: "Bangkok", description: "MacBook Air M2, très peu utilisé, encore sous garantie Apple, facture d'achat disponible.", phone: "090 123 4567", line: "@macbook_bkk", daysAgo: 1 },
    { id: "s15", title: "Baskets Nike Air Max neuves, taille 42", category: "mode", price: 2900, city: "Pattaya", description: "Baskets Nike Air Max jamais portées, encore en boîte, taille EU 42.", phone: "063 777 8899", line: "", daysAgo: 2 },
    { id: "s16", title: "Réparation climatiseurs à domicile", category: "services", price: 800, city: "Bangkok", description: "Technicien expérimenté propose nettoyage et réparation de climatiseurs, intervention rapide.", phone: "091 555 4433", line: "@ac_repair_bkk", daysAgo: 0 }
  ];

  var state = {
    search: "",
    city: "",
    category: "",
    sort: "recent"
  };

  function loadUserListings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveUserListings(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* storage unavailable */ }
  }

  function allListings() {
    return loadUserListings().concat(SEED_LISTINGS);
  }

  function formatPrice(n) {
    return "฿ " + Number(n).toLocaleString("fr-FR");
  }

  function timeLabel(item) {
    if (item.createdAt) {
      var diffMs = Date.now() - item.createdAt;
      var mins = Math.floor(diffMs / 60000);
      if (mins < 1) return "à l'instant";
      if (mins < 60) return "il y a " + mins + " min";
      var hrs = Math.floor(mins / 60);
      if (hrs < 24) return "il y a " + hrs + " h";
      var days = Math.floor(hrs / 24);
      return "il y a " + days + " j";
    }
    var d = item.daysAgo || 0;
    return d === 0 ? "aujourd'hui" : "il y a " + d + " j";
  }

  function sortWeight(item) {
    if (item.createdAt) return item.createdAt;
    return Date.now() - (item.daysAgo || 0) * 86400000;
  }

  function categoryById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return null;
  }

  function gradientFor(id) {
    var sum = 0;
    for (var i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    return GRADIENTS[sum % GRADIENTS.length];
  }

  /* ---------- Rendering ---------- */

  function renderCategories() {
    var grid = document.getElementById("categoriesGrid");
    var chips = document.getElementById("categoryChips");
    var footerList = document.getElementById("footerCategories");
    var postCategory = document.getElementById("postCategory");

    grid.innerHTML = CATEGORIES.map(function (c) {
      return '<button type="button" class="category-card" data-category="' + c.id + '">' +
        '<span class="category-card__icon"><svg class="icon" width="24" height="24"><use href="#' + c.icon + '"/></svg></span>' +
        '<span>' + c.label + '</span></button>';
    }).join("");

    chips.innerHTML = '<button type="button" class="chip is-active" data-category="">Toutes</button>' +
      CATEGORIES.map(function (c) {
        return '<button type="button" class="chip" data-category="' + c.id + '">' + c.label + '</button>';
      }).join("");

    footerList.innerHTML = CATEGORIES.slice(0, 5).map(function (c) {
      return '<li><a href="#listings" data-category="' + c.id + '">' + c.label + '</a></li>';
    }).join("");

    postCategory.innerHTML = CATEGORIES.map(function (c) {
      return '<option value="' + c.id + '">' + c.label + '</option>';
    }).join("");
  }

  function renderCities() {
    var citySelect = document.getElementById("citySelect");
    var postCity = document.getElementById("postCity");
    CITIES.forEach(function (city) {
      var opt1 = document.createElement("option");
      opt1.value = city; opt1.textContent = city;
      citySelect.appendChild(opt1);
      var opt2 = document.createElement("option");
      opt2.value = city; opt2.textContent = city;
      postCity.appendChild(opt2);
    });
  }

  function mediaMarkup(item) {
    if (item.photo) {
      return '<img src="' + item.photo + '" alt="' + escapeHtml(item.title) + '">';
    }
    var cat = categoryById(item.category);
    return '<div class="card__placeholder" style="background:' + gradientFor(item.category) + '">' +
      '<svg width="40" height="40"><use href="#' + (cat ? cat.icon : "icon-camera") + '"/></svg></div>';
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function getFilteredListings() {
    var items = allListings().filter(function (item) {
      if (state.category && item.category !== state.category) return false;
      if (state.city && item.city !== state.city) return false;
      if (state.search) {
        var q = state.search.toLowerCase();
        var hay = (item.title + " " + item.description).toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });

    items.sort(function (a, b) {
      if (state.sort === "price-asc") return a.price - b.price;
      if (state.sort === "price-desc") return b.price - a.price;
      return sortWeight(b) - sortWeight(a);
    });

    return items;
  }

  function renderListings() {
    var grid = document.getElementById("listingsGrid");
    var empty = document.getElementById("listingsEmpty");
    var items = getFilteredListings();

    if (!items.length) {
      grid.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = items.map(function (item) {
      var cat = categoryById(item.category);
      return '<article class="card" data-id="' + item.id + '">' +
        '<div class="card__media">' + mediaMarkup(item) +
        (item.featured ? '<span class="card__badge">À la une</span>' : "") +
        (item.isMine ? '<button type="button" class="card__mine" data-delete="' + item.id + '" title="Supprimer mon annonce" aria-label="Supprimer"><svg class="icon" width="14" height="14"><use href="#icon-trash"/></svg></button>' : "") +
        '</div>' +
        '<div class="card__body">' +
        '<span class="card__price">' + formatPrice(item.price) + '</span>' +
        '<span class="card__title">' + escapeHtml(item.title) + '</span>' +
        '<div class="card__meta">' +
        '<svg class="icon" width="13" height="13"><use href="#icon-pin"/></svg>' + item.city +
        '<span class="card__dot">·</span>' +
        '<svg class="icon" width="13" height="13"><use href="#icon-clock"/></svg>' + timeLabel(item) +
        '</div></div></article>';
    }).join("");
  }

  function updateCategoryUI() {
    document.querySelectorAll(".category-card").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.category === state.category);
    });
    document.querySelectorAll(".chip").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.category === state.category);
    });
  }

  /* ---------- Detail modal ---------- */

  function openDetail(id) {
    var item = allListings().find(function (i) { return i.id === id; });
    if (!item) return;
    var cat = categoryById(item.category);
    var content = document.getElementById("detailContent");

    var telHref = "tel:" + item.phone.replace(/\s+/g, "");
    var lineBtn = item.line
      ? '<a class="btn btn--line" href="https://line.me/ti/p/~' + encodeURIComponent(item.line.replace("@", "")) + '" target="_blank" rel="noopener"><svg class="icon" width="16" height="16"><use href="#icon-line"/></svg>LINE</a>'
      : "";

    content.innerHTML =
      '<div class="detail__media">' + mediaMarkup(item) + '</div>' +
      '<div class="detail__body">' +
      '<div class="detail__price">' + formatPrice(item.price) + '</div>' +
      '<h3 class="detail__title">' + escapeHtml(item.title) + '</h3>' +
      '<div class="detail__meta">' +
      '<span><svg class="icon" width="14" height="14"><use href="#icon-pin"/></svg>' + item.city + '</span>' +
      '<span><svg class="icon" width="14" height="14"><use href="#icon-clock"/></svg>' + timeLabel(item) + '</span>' +
      (cat ? '<span><svg class="icon" width="14" height="14"><use href="#' + cat.icon + '"/></svg>' + cat.label + '</span>' : "") +
      '</div>' +
      '<p class="detail__desc">' + escapeHtml(item.description) + '</p>' +
      '<div class="detail__actions">' +
      '<a class="btn btn--primary" href="' + telHref + '" target="_blank" rel="noopener"><svg class="icon" width="16" height="16"><use href="#icon-phone"/></svg>Appeler</a>' +
      lineBtn +
      '</div>' +
      '</div>';

    openModal("detailModal");
  }

  /* ---------- Modals ---------- */

  function openModal(id) {
    document.getElementById(id).setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModals() {
    document.querySelectorAll(".modal").forEach(function (m) { m.setAttribute("aria-hidden", "true"); });
    document.body.style.overflow = "";
  }

  /* ---------- Post ad form ---------- */

  var pendingPhoto = null;

  function initPostForm() {
    var form = document.getElementById("postForm");
    var photoInput = document.getElementById("photoInput");
    var photoDrop = document.getElementById("photoDrop");
    var photoLabel = document.getElementById("photoDropLabel");

    photoInput.addEventListener("change", function () {
      var file = photoInput.files && photoInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        pendingPhoto = e.target.result;
        photoDrop.classList.add("has-image");
        photoDrop.style.backgroundImage = "";
        var img = photoDrop.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          photoDrop.insertBefore(img, photoDrop.firstChild);
        }
        img.src = pendingPhoto;
        photoLabel.textContent = "Photo sélectionnée";
      };
      reader.readAsDataURL(file);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var listing = {
        id: "u" + Date.now(),
        title: fd.get("title").toString().trim(),
        category: fd.get("category"),
        price: Number(fd.get("price")) || 0,
        city: fd.get("city"),
        description: fd.get("description").toString().trim(),
        phone: fd.get("phone").toString().trim(),
        line: fd.get("line").toString().trim(),
        photo: pendingPhoto || null,
        createdAt: Date.now(),
        isMine: true
      };

      var userListings = loadUserListings();
      userListings.unshift(listing);
      saveUserListings(userListings);

      form.reset();
      pendingPhoto = null;
      photoDrop.classList.remove("has-image");
      var img = photoDrop.querySelector("img");
      if (img) img.remove();
      photoLabel.textContent = "Cliquez pour ajouter une photo";

      closeModals();
      state.category = "";
      state.city = "";
      state.search = "";
      document.getElementById("searchInput").value = "";
      document.getElementById("citySelect").value = "";
      updateCategoryUI();
      renderListings();
      document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    });
  }

  function deleteListing(id) {
    var userListings = loadUserListings().filter(function (i) { return i.id !== id; });
    saveUserListings(userListings);
    renderListings();
  }

  /* ---------- Stats counter ---------- */

  function animateStats() {
    document.querySelectorAll(".stat strong").forEach(function (el) {
      var target = Number(el.dataset.count) || 0;
      var start = 0;
      var duration = 900;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        el.textContent = Math.floor(start + (target - start) * progress);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Events ---------- */

  function initEvents() {
    document.getElementById("categoriesGrid").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category === state.category ? "" : btn.dataset.category;
      updateCategoryUI();
      renderListings();
      document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("categoryChips").addEventListener("click", function (e) {
      var btn = e.target.closest("[data-category]");
      if (!btn) return;
      state.category = btn.dataset.category;
      updateCategoryUI();
      renderListings();
    });

    document.getElementById("footerCategories").addEventListener("click", function (e) {
      var link = e.target.closest("[data-category]");
      if (!link) return;
      e.preventDefault();
      state.category = link.dataset.category;
      updateCategoryUI();
      renderListings();
      document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("sortSelect").addEventListener("change", function (e) {
      state.sort = e.target.value;
      renderListings();
    });

    document.getElementById("searchForm").addEventListener("submit", function (e) {
      e.preventDefault();
      state.search = document.getElementById("searchInput").value.trim();
      state.city = document.getElementById("citySelect").value;
      renderListings();
      document.getElementById("listings").scrollIntoView({ behavior: "smooth" });
    });

    document.getElementById("listingsGrid").addEventListener("click", function (e) {
      var delBtn = e.target.closest("[data-delete]");
      if (delBtn) {
        e.stopPropagation();
        deleteListing(delBtn.dataset.delete);
        return;
      }
      var card = e.target.closest(".card");
      if (card) openDetail(card.dataset.id);
    });

    document.querySelectorAll(".modal [data-close]").forEach(function (el) {
      el.addEventListener("click", closeModals);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModals();
    });

    document.getElementById("openPostBtn").addEventListener("click", function () { openModal("postModal"); });
    document.getElementById("footerPostLink").addEventListener("click", function (e) {
      e.preventDefault();
      openModal("postModal");
    });

    document.getElementById("cityTrigger").addEventListener("click", function () {
      document.getElementById("citySelect").focus();
      document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
    });
    document.getElementById("citySelect").addEventListener("change", function (e) {
      var label = e.target.value || "Toute la Thaïlande";
      document.getElementById("cityTriggerLabel").textContent = label;
    });

    var burger = document.getElementById("burgerBtn");
    var navLinks = document.getElementById("navLinks");
    burger.addEventListener("click", function () {
      var expanded = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!expanded));
      navLinks.style.display = expanded ? "" : "flex";
      if (!expanded) {
        navLinks.style.cssText = "display:flex;position:absolute;top:74px;left:0;right:0;flex-direction:column;background:#fbf7ef;padding:20px 6%;gap:16px;border-bottom:1px solid #e7e0d2;";
      } else {
        navLinks.style.cssText = "";
      }
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.innerWidth <= 760) {
          burger.setAttribute("aria-expanded", "false");
          navLinks.style.cssText = "";
        }
      });
    });
  }

  /* ---------- Init ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderCategories();
    renderCities();
    renderListings();
    initEvents();
    initPostForm();
    animateStats();
  });
})();
