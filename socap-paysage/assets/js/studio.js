/* Studio d'ambiance : choix d'un style + jour/nuit + envies -> message pré-rempli */
(function () {
  "use strict";
  var st = document.getElementById("stStage"); if (!st) return;
  var imgs = [].slice.call(st.querySelectorAll("img")), tag = document.getElementById("stTag"), sum = document.getElementById("stSum"), noN = document.getElementById("stNoNight");
  var AMB = {
    cont: { n: "Contemporain", j: "cont-j", ni: "cont-n", d: "Lignes nettes, bois et pierre : un jardin qui prolonge l’architecture." },
    zen: { n: "Zen & eau", j: "zen", ni: null, d: "Bassin, pierres et végétaux taillés : un jardin qui apaise." },
    class: { n: "Classique", j: "class", ni: null, d: "Massifs structurés, buis et gazon : l’élégance intemporelle." },
    pisc: { n: "Piscine", j: "pisc-j", ni: "pisc-n", d: "Platelage bois autour de l’eau : l’été toute l’année." },
    pav: { n: "Pavillon", j: "pav", ni: null, d: "Un abri en bois niché dans la végétation, pour vivre dehors." }
  };
  var amb = "cont", mode = "j", els = [];
  var ambBtns = [].slice.call(document.querySelectorAll(".stb")), modeBtns = [].slice.call(document.querySelectorAll(".studio__light button")), elBtns = [].slice.call(document.querySelectorAll(".stc"));
  function hasNight() { return !!AMB[amb].ni; }
  function render() {
    var a = AMB[amb]; if (mode === "n" && !hasNight()) mode = "j";
    var key = mode === "n" ? a.ni : a.j;
    imgs.forEach(function (im) { im.classList.toggle("on", im.getAttribute("data-k") === key); });
    ambBtns.forEach(function (b) { var on = b.getAttribute("data-amb") === amb; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    modeBtns.forEach(function (b) { var on = b.getAttribute("data-mode") === mode; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); if (b.getAttribute("data-mode") === "n") b.disabled = !hasNight(); });
    noN.hidden = hasNight();
    tag.textContent = a.n + " · " + (mode === "n" ? "Nuit" : "Jour");
    sum.innerHTML = "<b>" + a.n + "</b> · " + (mode === "n" ? "de nuit" : "de jour") + (els.length ? " · " + els.join(", ") : "") + "<br><span>" + a.d + "</span>";
  }
  ambBtns.forEach(function (b) { b.addEventListener("click", function () { amb = b.getAttribute("data-amb"); if (els.indexOf("Éclairage") > -1 && hasNight()) mode = "n"; render(); }); });
  modeBtns.forEach(function (b) { b.addEventListener("click", function () { if (b.disabled) return; mode = b.getAttribute("data-mode"); render(); }); });
  elBtns.forEach(function (b) { b.addEventListener("click", function () {
    var e = b.getAttribute("data-el"), i = els.indexOf(e); if (i > -1) els.splice(i, 1); else els.push(e);
    b.classList.toggle("on", i < 0); b.setAttribute("aria-pressed", String(i < 0));
    if (e === "Éclairage" && hasNight()) mode = i < 0 ? "n" : "j";
    render();
  }); });
  document.getElementById("stGo").addEventListener("click", function () {
    var ta = document.querySelector('#form textarea[name="msg"]'); if (!ta) return;
    ta.value = "Bonjour, j’imagine un jardin d’ambiance « " + AMB[amb].n + " »" + (mode === "n" ? " (vu de nuit)" : "") + (els.length ? " avec : " + els.join(", ").toLowerCase() : "") + ". Pouvez-vous me proposer une étude ?";
  });
  render();
})();
