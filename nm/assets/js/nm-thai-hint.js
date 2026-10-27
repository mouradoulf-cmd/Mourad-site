/* NM Studio: offer the Thai version once to visitors who are in Thailand (Bangkok time zone)
   but whose phone is set to English. Never forces a language, shows once, hides itself. */
(function () {
  "use strict";
  var KEY = "nmThHint";
  try {
    if ((Intl.DateTimeFormat().resolvedOptions().timeZone || "") !== "Asia/Bangkok") return;
    if ((navigator.language || "").toLowerCase().indexOf("en") !== 0) return;
    if (localStorage.getItem(KEY)) return;
  } catch (e) { return; }

  var el, timer, ready = false;
  function done() { try { localStorage.setItem(KEY, "1"); } catch (e) {} if (timer) clearTimeout(timer); if (el) { el.classList.remove("on"); var n = el; setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 400); el = null; } }
  function show() {
    if ((window.NM_LANG || "en") === "th") return;
    var st = document.createElement("style");
    st.textContent = ".th-hint{position:fixed;z-index:180;left:50%;top:calc(var(--header-h,64px) + 10px);transform:translate(-50%,-8px);display:flex;align-items:center;gap:4px;padding:5px 6px 5px 6px;border-radius:99px;background:rgba(18,16,25,.92);border:1px solid rgba(230,194,122,.55);box-shadow:0 10px 30px rgba(0,0,0,.45);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;font:600 14px/1 'Noto Sans Thai','Inter',system-ui,sans-serif;color:#f4f2fa}.th-hint.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}.th-hint button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;touch-action:manipulation}.th-hint .th-hint__go{white-space:nowrap;display:flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;border-radius:99px;background:linear-gradient(135deg,#f0d58f,#d9b25f);color:#1a1203!important;font-weight:800!important}.th-hint .th-hint__go small{font-weight:600;opacity:.75;font-size:12px}.th-hint .th-hint__x{width:36px;height:36px;border-radius:50%;font-size:16px;opacity:.7}";
    document.head.appendChild(st);
    el = document.createElement("div"); el.className = "th-hint"; el.setAttribute("role", "region"); el.setAttribute("aria-label", "ภาษาไทย / Thai");
    el.innerHTML = '<button type="button" class="th-hint__go">อ่านเป็นภาษาไทย <small>Thai</small></button><button type="button" class="th-hint__x" aria-label="Close">✕</button>';
    document.body.appendChild(el);
    el.querySelector(".th-hint__go").addEventListener("click", function () { if (window.NMI18n) window.NMI18n.apply("th"); done(); });
    el.querySelector(".th-hint__x").addEventListener("click", done);
    requestAnimationFrame(function () { requestAnimationFrame(function () { if (el) el.classList.add("on"); }); });
    try { localStorage.setItem(KEY, "1"); } catch (e) {}
    timer = setTimeout(done, 15000);
    ready = true;
  }
  document.addEventListener("nm:lang", function () { if (ready) done(); });
  setTimeout(show, 2600);
})();
