/* NM Studio · tableau de bord des menus QR : onglets « Chiffres » et « + Nouveau client » (privé, ne contient aucune donnée de client en dur).
   - Chiffres : abonnés, essais, retards, abandons (calculés depuis menus/abonnements.json, même règle que l'onglet Clients) + visites du site (compteur Abacus, comme stats.html).
   - Nouveau client : 4 photos à prendre, fiche à copier-coller dans la discussion, liste des clients en cours avec leur étape (enregistrée sur ce téléphone seulement). */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var DAY = 864e5;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(t) { var el = $("toast"); if (!el) return; el.textContent = t; el.classList.add("on"); clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.remove("on"); }, 2200); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} return null; }

  /* ---------- tabs ---------- */
  var panes = { clients: $("tabClients"), chiffres: $("tabChiffres"), nouveau: $("tabNouveau") }, built = {};
  function show(name, push) {
    if (!panes[name]) name = "clients";
    Object.keys(panes).forEach(function (k) { panes[k].hidden = k !== name; });
    [].forEach.call(document.querySelectorAll("#tabs [data-tab]"), function (b) { b.setAttribute("aria-selected", b.dataset.tab === name ? "true" : "false"); });
    if (name === "chiffres") renderStats();
    if (name === "nouveau" && !built.nouveau) { renderNew(); built.nouveau = true; }
    if (push !== false) { try { history.replaceState(null, "", name === "clients" ? location.pathname + location.search : "#" + name); } catch (e) {} }
    window.scrollTo({ top: 0 });
  }
  $("tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-tab]"); if (b) show(b.dataset.tab); });

  /* ---------- Chiffres ---------- */
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function parse(s) { var p = String(s).split("-"); return new Date(+p[0], p[1] - 1, +p[2]); }
  function kind(r, grace) {
    if (r.pause) return "bad";
    var days = Math.round((parse(r.paidUntil) - today()) / DAY);
    if (days < -grace) return "bad";
    if (days < 0 || days <= 7) return "warn";
    return "ok";
  }
  function kpi(label, val, sub, c, wide) { return '<div class="kpi' + (wide ? " wide" : "") + '"' + (c ? ' style="--c:' + c + '"' : "") + "><small>" + label + "</small><b>" + val + "</b>" + (sub ? "<span>" + sub + "</span>" : "") + "</div>"; }
  function dayStr(offset) { return new Date(Date.now() + 7 * 3600e3 - offset * 864e5).toISOString().slice(0, 10).replace(/-/g, ""); }
  function getCount(key) {
    return fetch("https://abacus.jasoncameron.dev/get/mouradoulf-nmstudio/" + key, { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : { value: 0 }; })
      .then(function (j) { return +(j && j.value) || 0; }).catch(function () { return null; });
  }
  function renderStats() {
    var root = $("tabChiffres");
    root.innerHTML = '<section class="sec"><div class="sh"><h2>Tes <i>chiffres</i></h2><span id="cMaj">Chargement…</span></div><div class="kpis" id="cK"></div></section>' +
      '<section class="sec"><div class="sh"><h2>Visites du site</h2><span>NM Studio</span></div><div class="kpis" id="cV"><div class="note2" style="grid-column:1/-1">Chargement…</div></div><a class="linkbtn" href="stats.html">Voir le détail jour par jour</a></section>' +
      '<div class="note2"><b>Scans des menus</b> (combien de touristes ouvrent chaque menu) : pas encore compté. Si tu veux, écris-moi « active le compteur de scans » : ça donnerait un argument fort pour garder un client (« 120 scans ce mois-ci »).</div>';
    fetch("../menus/abonnements.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
      var grace = d.graceDays || 4, price = d.monthly || 390, real = d.restaurants.filter(function (r) { return !r.demo; });
      var n = { paying: 0, trial: 0, warn: 0, bad: 0 };
      real.forEach(function (r) { var k = kind(r, grace); if (k === "bad") n.bad++; else { if (r.trial) n.trial++; else n.paying++; if (k === "warn") n.warn++; } });
      var rate = real.length ? Math.round(n.bad / real.length * 100) + " %" : "–";
      var h = "";
      if (!real.length) h += '<div class="note2" style="grid-column:1/-1">Aucun vrai client pour l’instant : l’exemple Mae Lek est une démonstration et n’est pas compté. Dès ton premier restaurant, les chiffres apparaissent ici.</div>';
      h += kpi("Qui paient", n.paying, "abonnés actifs", "var(--ok)") + kpi("Essai gratuit", n.trial, "1er mois offert", "var(--gold)");
      h += kpi("À relancer", n.warn, "paiement proche ou en retard", "var(--warn)") + kpi("Abandons", n.bad, "menus en pause · " + rate, "var(--bad)");
      h += kpi("Revenu par mois", (n.paying * price).toLocaleString("fr-FR") + " ฿", n.paying + " × " + price + " ฿", "var(--ok)", true);
      $("cK").innerHTML = h; $("cMaj").textContent = "à jour " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }).catch(function () { $("cK").innerHTML = '<div class="note2" style="grid-column:1/-1">Impossible de lire les abonnements pour l’instant. Réessaie dans un instant.</div>'; $("cMaj").textContent = ""; });
    var jobs = []; for (var i = 6; i >= 0; i--) (function (d) { jobs.push(Promise.all([getCount("v-" + d), getCount("wa-" + d), getCount("lead-" + d)])); })(dayStr(i));
    Promise.all(jobs).then(function (rows) {
      if (rows.every(function (r) { return r[0] === null; })) { $("cV").innerHTML = '<div class="note2" style="grid-column:1/-1">Le compteur ne répond pas pour le moment. Réessaie dans quelques minutes.</div>'; return; }
      var t = rows[rows.length - 1], sum = function (k) { return rows.reduce(function (s, r) { return s + (r[k] || 0); }, 0); };
      $("cV").innerHTML = kpi("Visiteurs aujourd’hui", t[0] || 0, sum(0) + " sur 7 jours") + kpi("Contacts aujourd’hui", (t[1] || 0) + (t[2] || 0), (sum(1) + sum(2)) + " sur 7 jours", "var(--ok)");
    });
  }

  /* ---------- Nouveau client ---------- */
  var STEPS = [
    ["Photos du menu", "Une photo par page, bien à plat, en pleine lumière, sans reflet ni doigt. Toutes les pages, recto et verso."],
    ["Photo du nom (enseigne)", "L’enseigne ou le logo, pour que j’écrive le nom exactement comme eux."],
    ["Photos du restaurant", "Devant, puis l’intérieur (tables, ambiance). Sert pour la page d’accueil du menu."],
    ["Photos de leurs plats (si ils en ont)", "Seulement de vraies photos de leurs plats. Sinon, je n’en invente pas : le menu marche très bien sans."]
  ];
  var LANGS = [["th", "ไทย"], ["en", "English"], ["zh", "中文"], ["ru", "Русский"], ["ko", "한국어"], ["fr", "Français"], ["it", "Italiano"]];
  var STAGES = ["Trouvé", "Photos envoyées", "Menu en cours", "À relire", "QR imprimé", "Payé"];
  var draft = store("nmNewDraft") || { name: "", city: "", contact: "", notes: "", langs: ["th", "en", "zh", "ru", "ko", "fr"], steps: [false, false, false, false] };
  function save() { store("nmNewDraft", draft); }
  function list() { return store("nmNewClients") || []; }
  function brief() {
    var got = STEPS.map(function (s, i) { return draft.steps[i] ? s[0] : null; }).filter(Boolean);
    return ["NOUVEAU CLIENT · MENU QR", "Restaurant : " + (draft.name || "(à préciser)"), "Ville : " + (draft.city || "(à préciser)"), "Contact : " + (draft.contact || "(à préciser)"),
      "Langues : " + (draft.langs.length ? draft.langs.map(function (l) { return LANGS.filter(function (x) { return x[0] === l; })[0][1]; }).join(", ") : "(à préciser)"),
      "Photos jointes : " + (got.length ? got.join(" · ") : "aucune pour l’instant"), "Notes : " + (draft.notes || "–"), "",
      "À faire : transcrire le menu depuis les photos, le traduire, le mettre en ligne (menus/<nom>/), l’ajouter au tableau de bord (1er mois offert, puis 390 ฿/mois), puis me donner le lien et le QR en A5 prêt à imprimer. Prix en baht, rien d’inventé : s’il manque une information, demande-la-moi."].join("\n");
  }
  function renderNew() {
    var root = $("tabNouveau");
    root.innerHTML = '<section class="sec"><div class="sh"><h2>Nouveau <i>client</i></h2><span>4 photos, 1 fiche</span></div>' +
      '<p class="calhint" style="margin:0">Coche chaque étape quand c’est fait.</p><div class="steps" id="nSteps"></div>' +
      '<div class="form"><label>NOM DU RESTAURANT<input type="text" id="fName" autocomplete="off"></label><label>VILLE<input type="text" id="fCity" autocomplete="off"></label>' +
      '<label>CONTACT (WHATSAPP, LINE OU TÉLÉPHONE)<input type="text" id="fContact" autocomplete="off" inputmode="text"></label>' +
      '<label>LANGUES DU MENU<div class="chips" id="fLangs"></div></label><label>À NE PAS OUBLIER<textarea id="fNotes" placeholder="ex. plat du jour, plats sans porc, horaires…"></textarea></label></div>' +
      '<div class="acts"><button type="button" class="bb main" id="nCopy">Copier la fiche</button><button type="button" class="bb" id="nShare">Partager la fiche</button><button type="button" class="bb" id="nSave">Enregistrer dans ma liste</button></div>' +
      '<p class="tip">Ensuite : colle la fiche <b>dans la discussion avec Claude</b>, avec les photos. Les photos ne passent pas par cette page.</p></section>' +
      '<section class="sec"><div class="sh"><h2>Mes clients en cours</h2><span id="nCnt"></span></div><div class="nc" id="nList"></div>' +
      '<div class="note2">Cette liste est enregistrée <b>sur ce téléphone seulement</b>. Le vrai suivi (qui a payé, qui est en pause) reste dans l’onglet Clients.</div><a class="linkbtn" href="print/chevalet-qr.html">Préparer le panneau QR à imprimer</a></section>';
    $("fName").value = draft.name; $("fCity").value = draft.city; $("fContact").value = draft.contact; $("fNotes").value = draft.notes;
    ["fName:name", "fCity:city", "fContact:contact", "fNotes:notes"].forEach(function (p) { var a = p.split(":"); $(a[0]).addEventListener("input", function () { draft[a[1]] = this.value; save(); }); });
    drawSteps(); drawLangs(); drawList();
    $("nSteps").addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (!b) return; var i = +b.dataset.i; draft.steps[i] = !draft.steps[i]; save(); drawSteps(); });
    $("fLangs").addEventListener("click", function (e) { var b = e.target.closest("[data-l]"); if (!b) return; var l = b.dataset.l, i = draft.langs.indexOf(l); if (i > -1) draft.langs.splice(i, 1); else draft.langs.push(l); save(); drawLangs(); });
    $("nCopy").onclick = function () {
      var t = brief();
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast("Fiche copiée. Colle-la dans la discussion."); }, fallbackCopy);
      else fallbackCopy();
      function fallbackCopy() { var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;opacity:0;top:0"; document.body.appendChild(ta); ta.focus(); ta.select(); var ok = false; try { ok = document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); toast(ok ? "Fiche copiée. Colle-la dans la discussion." : "Copie impossible : sélectionne le texte à la main."); }
    };
    $("nShare").onclick = function () { if (navigator.share) navigator.share({ text: brief() }).catch(function () {}); else $("nCopy").click(); };
    $("nSave").onclick = function () {
      if (!draft.name.trim()) { toast("Écris d’abord le nom du restaurant."); $("fName").focus(); return; }
      var l = list(); l.unshift({ id: Date.now(), name: draft.name.trim(), city: draft.city.trim(), stage: draft.steps.some(Boolean) ? 1 : 0 }); store("nmNewClients", l);
      draft = { name: "", city: "", contact: "", notes: "", langs: draft.langs, steps: [false, false, false, false] }; save();
      $("fName").value = $("fCity").value = $("fContact").value = $("fNotes").value = ""; drawSteps(); drawList(); toast("Ajouté à ta liste."); $("nList").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $("nList").addEventListener("click", function (e) {
      var b = e.target.closest("[data-a]"); if (!b) return; var l = list(), c = l.filter(function (x) { return String(x.id) === b.dataset.id; })[0]; if (!c) return;
      if (b.dataset.a === "next") c.stage = Math.min(STAGES.length - 1, c.stage + 1);
      if (b.dataset.a === "prev") c.stage = Math.max(0, c.stage - 1);
      if (b.dataset.a === "del") { if (b.dataset.sure !== "1") { b.dataset.sure = "1"; b.textContent = "Sûr ?"; return; } l = l.filter(function (x) { return x !== c; }); }
      store("nmNewClients", l); drawList();
    });
  }
  function drawSteps() {
    $("nSteps").innerHTML = STEPS.map(function (s, i) { return '<button type="button" class="step" data-i="' + i + '" aria-pressed="' + !!draft.steps[i] + '"><span class="step__n">' + (draft.steps[i] ? "✓" : i + 1) + "</span><div><b>" + s[0] + "</b><span>" + s[1] + "</span></div></button>"; }).join("");
  }
  function drawLangs() { $("fLangs").innerHTML = LANGS.map(function (l) { return '<button type="button" data-l="' + l[0] + '" aria-pressed="' + (draft.langs.indexOf(l[0]) > -1) + '">' + l[1] + "</button>"; }).join(""); }
  function drawList() {
    var l = list(); $("nCnt").textContent = l.length ? l.length + (l.length > 1 ? " clients" : " client") : "";
    $("nList").innerHTML = l.length ? l.map(function (c) {
      return '<div class="ncard"><h3>' + esc(c.name) + "</h3><small>" + esc(c.city || "") + '</small><div class="stg">' + STAGES.map(function (s, i) { return '<i class="' + (i <= c.stage ? "on" : "") + '"></i>'; }).join("") + '</div><div class="now">' + (c.stage + 1) + "/" + STAGES.length + " · " + STAGES[c.stage] + '</div><div class="row2">' +
        '<button type="button" data-a="prev" data-id="' + c.id + '"' + (c.stage ? "" : " disabled") + '>Étape d’avant</button>' + (c.stage < STAGES.length - 1 ? '<button type="button" class="go" data-a="next" data-id="' + c.id + '">Étape suivante : ' + STAGES[c.stage + 1] + "</button>" : '<button type="button" class="go" disabled>Terminé</button>') +
        '<button type="button" data-a="del" data-id="' + c.id + '" aria-label="Supprimer">✕</button></div></div>';
    }).join("") : '<div class="note2">Aucun client en cours. Remplis la fiche au-dessus puis « Enregistrer dans ma liste ».</div>';
  }
  show((location.hash || "").slice(1), false);
})();
