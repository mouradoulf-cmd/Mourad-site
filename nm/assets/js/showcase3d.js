/* ==========================================================================
   NM Studio — showcase3d.js
   --------------------------------------------------------------------------
   Turns the client-site carousel into a real cylinder made of seven browser
   frames, and gives it the interactions that make it worth using: drag,
   arrow keys, horizontal wheel, click-to-open, previous/next buttons.

   Design rules this file sticks to
   ---------------------------------
   * One requestAnimationFrame loop for the whole component. It is started
     only when the section is on screen and the tab is in the foreground, and
     it is idle-suspended: with nothing left to move it schedules no frame.
   * Only `transform` and `opacity` are written per frame. No layout read
     inside the loop; measurements are cached and refreshed by observers.
   * The rail (plain scroll-snap, no 3D) is the default state in the HTML.
     This script only *adds* the 3D state, and only when the browser can
     really draw it (preserve-3d support, >= 900px, motion allowed). If this
     file never runs, the section still works: scrollable, clickable, legible.
   * Tab order stays linear. The panel in front is the only panel link in the
     tab order; Tab then Left/Right walks the seven in a circle. Focusing an
     off-centre panel brings it to the front, so the focused element is always
     the readable one. There is no focus trap anywhere.
   ========================================================================== */

(function () {
  "use strict";

  var N = 7;
  var STEP_RAD = (2 * Math.PI) / N;          /* 51.43deg between two panels */

  /* feel ------------------------------------------------------------------ */
  var IDLE_RAD_PER_S = (18 * Math.PI) / 180; /* ~20s per full turn */
  var DRAG_RAD_PER_PX = 0.0075;              /* ~0.43deg per pixel */
  var WHEEL_RAD_PER_PX = 0.0034;
  var FRICTION_PER_S = 3.0;                  /* inertia half-life ~0.23s */
  var SNAP_EASE = 9;                         /* rad/s per rad of error */
  var SNAP_WINDOW_MS = 1400;
  var STEP_MS = 420;                         /* one click = one panel, always */
  var MAX_SPEED = 6.5;                       /* rad/s, caps a wild throw */
  var CLICK_SLOP = 8;                        /* px of drag that cancels a click */

  var reduceQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var narrowQuery = window.matchMedia
    ? window.matchMedia("(max-width: 899px)")
    : null;

  var supports3d = (function () {
    if (!window.CSS || !CSS.supports) return false;
    try {
      return CSS.supports("transform-style", "preserve-3d") &&
        CSS.supports("perspective", "1000px");
    } catch (e) {
      return false;
    }
  })();

  var instances = [];

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    var roots = document.querySelectorAll(".cs3");
    for (var i = 0; i < roots.length; i++) wire(roots[i]);
  }

  function reduce() {
    return !!(reduceQuery && reduceQuery.matches);
  }

  function wrap(x) {
    return Math.atan2(Math.sin(x), Math.cos(x));
  }

  /* ===================================================================== */

  function wire(root) {
    var viewport = root.querySelector("[data-cs3-viewport]");
    var track = root.querySelector("[data-cs3-track]");
    var panelEls = [].slice.call(root.querySelectorAll(".cs3__panel"));
    var rail = root.querySelector(".cs3__rail");
    var prevBtn = root.querySelector("[data-cs3-prev]");
    var nextBtn = root.querySelector("[data-cs3-next]");
    var countNow = root.querySelector("[data-cs3-count]");
    var liveEl = root.querySelector("[data-cs3-live]");

    if (!viewport || !track || panelEls.length !== N) return;

    var n = panelEls.length;
    var panels = panelEls.map(function (p) {
      return {
        el: p,
        link: p.querySelector("a") || p,
        browser: p.querySelector(".cs3__browser"),
        veil: p.querySelector(".cs3__veil"),
        name: (p.getAttribute("data-cs3-name") || "").trim()
      };
    });

    var st = {
      angle: 0,
      vel: 0,
      glide: false,
      glideFrom: 0,
      glideUntil: 0,
      glideBase: 0,
      glideTo: 0,
      /* the panel a deliberate step is delivering, or -1 during free rotation */
      intent: -1,
      snapUntil: 0,
      active: -1,
      dragging: false,
      dragId: null,
      lastX: 0,
      lastT: 0,
      moved: 0,
      minW: 0,
      focusGuard: false,
      raf: 0,
      onScreen: false,
      dead: false,
      lastFrame: 0,
      announced: "",
      reduced: reduce(),
      reasons: { hover: false, focus: false, drag: false, hidden: !!document.hidden, off: true }
    };

    /* the automatic turn only runs when none of these is true */
    function autoAllowed() {
      return !st.reasons.hover && !st.reasons.focus && !st.reasons.drag &&
        !st.reasons.hidden && !st.reasons.off && !st.reduced;
    }

    function in3d() {
      return root.classList.contains("is-3d");
    }

    /* ------------------------------------------------------------ geometry */

    /* The distance from the axis to the front panel (the "apothem") is what
       has to match the CSS panel width; the radius then follows from the
       polygon geometry, and --cs3-w can be redeclared per breakpoint without
       breaking the alignment. */
    function layout() {
      var vw = viewport.clientWidth;
      var vh = viewport.clientHeight;
      if (!vw) vw = root.clientWidth || 900;
      if (!vh) vh = 620;

      /* measured first; the fallback mirrors the CSS at 1440px, and only
         matters for the very first frame before the observer reports. */
      var w = st.minW || Math.min(384, vw * 0.62);
      w = Math.max(200, Math.min(w, vw * 0.72));

      var r = Math.round(w / (2 * Math.cos(Math.PI / n)));
      r = Math.max(180, Math.min(r, Math.round(vh * 3.2), 1400));
      track.style.setProperty("--cs3-radius", r + "px");
    }

    function frontIndex() {
      /* A deliberate step records which panel it is delivering. Deriving the
         face from the angle alone would be wrong mid-glide: an angle 90% of
         the way to the next panel rounds to the panel after it, so a slow
         machine would flash the wrong name and briefly hand the tab order and
         the click-through to the wrong link. Free rotation clears the record
         and goes back to reading the angle. */
      if (st.intent >= 0 && st.intent < n) return st.intent;
      var k = Math.round(wrap(st.angle) / STEP_RAD);
      return ((k % n) + n) % n;
    }

    /* ------------------------------------------------------------- painting */

    function render() {
      track.style.setProperty("--cs3-rot", st.angle.toFixed(4) + "rad");
      /* the caption of whichever panel is in front counter-rotates by this
         angle so it stays upright and in one fixed spot on screen */
      root.style.setProperty("--cs3-front", (st.angle * 180 / Math.PI).toFixed(3) + "deg");

      for (var i = 0; i < n; i++) {
        var d = wrap(i * STEP_RAD + st.angle);   /* 0 = facing the visitor */
        var depth = Math.cos(d);                 /* 1 in front, -1 behind */
        var c = Math.abs(d) / Math.PI;           /* 0 .. 1 */
        var e = Math.pow(c, 1.15);
        var it = panels[i];

        /* The rear half has to stay legible: these are real screenshots, and a
           panel nobody can read is decoration. Opacity carries most of the
           depth cue, the veil only finishes it off. */
        it.el.style.opacity = (1 - e * 0.28).toFixed(3);
        /* `opacity` costs us the browser's depth sorting, so the paint order
           is stated explicitly: cos(angle) decides who covers whom. */
        it.el.style.zIndex = String(60 + Math.round(depth * 20));
        if (it.veil) it.veil.style.opacity = (e * 0.52).toFixed(3);
      }
    }

    /* Announcements are opt-in per frame. The automatic turn never speaks:
       a status region firing on every panel would make a screen reader
       unusable while the visitor is just reading the page. */
    function applyFront(silent, speak) {
      var idx = frontIndex();
      if (idx === st.active) return;
      st.active = idx;

      for (var i = 0; i < n; i++) {
        var isFront = i === idx;
        var it = panels[i];
        it.el.classList.toggle("is-front", isFront);
        /* Only the front panel's link is in the tab order, so Tab then the
           arrow keys walk the seven like a single control. The rear panels are
           NOT aria-hidden: an element inside an aria-hidden subtree cannot
           take focus at all, and a visitor who reaches one of those links by
           any other route must still be able to land on it — the focus
           handler below then turns it to the front. */
        if (isFront) {
          it.link.removeAttribute("tabindex");
        } else {
          it.link.setAttribute("tabindex", "-1");
        }
      }

      if (countNow) {
        countNow.textContent = (idx + 1 < 10 ? "0" : "") + (idx + 1);
      }
      if (liveEl && speak && !silent && panels[idx].name && panels[idx].name !== st.announced) {
        st.announced = panels[idx].name;
        liveEl.textContent = panels[idx].name;
      }
    }

    /* ----------------------------------------------------------- loop state */

    function owesFrame() {
      if (st.vel !== 0) return true;
      /* An explicit step must always finish, even with the pointer resting on
         the stage: the hover pause is about the automatic turn, and letting it
         swallow a button press or an arrow key would make them dead controls. */
      if (st.glide) return true;
      if (st.snapUntil > performance.now()) return true;
      if (autoAllowed() && !st.dragging) return true;
      return false;
    }

    function kick() {
      if (st.raf || st.dead || !st.onScreen || !in3d()) return;
      st.lastFrame = 0;
      st.raf = requestAnimationFrame(frame);
    }

    function stopLoop() {
      if (st.raf) cancelAnimationFrame(st.raf);
      st.raf = 0;
      st.lastFrame = 0;
    }

    function frame() {
      st.raf = 0;
      if (st.dead || !in3d()) return;

      /* Wall clock, not the frame timestamp: rAF timestamps only advance when
         a frame is actually painted, so on a loaded machine (or a throttled
         headless browser) they under-count real elapsed time and the slow
         steady rotation would come out too slow. `performance.now()` keeps
         18 degrees per second true at any frame rate. */
      var now = performance.now();
      var real = st.lastFrame ? (now - st.lastFrame) / 1000 : 0.016;
      st.lastFrame = now;
      if (real < 0.001) real = 0.001;
      /* capped for the inertia integration, so a stalled tab cannot fling it */
      var dt = real > 0.05 ? 0.05 : real;

      var speak = false;

      if (st.vel === 0 && now < st.snapUntil) {
        /* settle onto the nearest panel after a slow drag or a wheel nudge */
        st.angle += (Math.round(st.angle / STEP_RAD) * STEP_RAD - st.angle) *
          (1 - Math.exp(-SNAP_EASE * dt));
      } else if (st.glide) {
        /* A deliberate step. The position is a function of elapsed time, not
           of the frame count, so one click covers one panel in STEP_MS even
           on a machine rendering at 3fps. */
        var g = (now - st.glideFrom) / STEP_MS;
        if (g >= 1) g = 1;
        st.angle = st.glideBase + (st.glideTo - st.glideBase) * (1 - Math.pow(1 - g, 3));
        speak = true;
        if (g >= 1) {
          st.angle = st.glideTo;
          st.glide = false;
          st.glideUntil = 0;
        }
      } else if (st.vel !== 0) {
        st.snapUntil = 0;
        st.intent = -1;               /* free rotation: the angle rules again */
        st.angle += st.vel * dt;
        st.vel *= Math.exp(-FRICTION_PER_S * dt);
        if (Math.abs(st.vel) < 0.004) st.vel = 0;
      } else if (autoAllowed() && !st.dragging) {
        st.angle += IDLE_RAD_PER_S * real;
      }

      /* Wrapping keeps the numbers small, but not while a glide is in flight:
         a step can legitimately sit outside [-pi, pi] until it lands. */
      if (!st.glide) {
        if (st.angle > Math.PI) st.angle -= Math.PI * 2;
        if (st.angle < -Math.PI) st.angle += Math.PI * 2;
      }

      render();
      applyFront(false, speak);
      if (owesFrame()) st.raf = requestAnimationFrame(frame);
    }

    /* ------------------------------------------------------------- commands */

    function nearestTo(target) {
      var t = target;
      while (t - st.angle > Math.PI) t -= Math.PI * 2;
      while (t - st.angle < -Math.PI) t += Math.PI * 2;
      return t;
    }

    /* One press, exactly one panel.
       The glide is driven by elapsed time, so a slow or a fast machine both
       see a 420 ms step that lands dead centre. Pressing again mid-flight
       re-bases the curve on the current angle and adds one more step, so
       rapid clicks stay crisp instead of queueing a long animation. */
    function startGlide(to, index) {
      st.vel = 0;
      st.snapUntil = 0;
      st.glideFrom = performance.now();
      st.glideUntil = st.glideFrom + STEP_MS;
      st.glideBase = st.angle;
      st.glideTo = to;
      st.glide = true;
      st.intent = (index === undefined || index === null || index < 0) ? -1 : index;
      kick();
    }

    function turn(dir) {
      if (st.dragging) return;
      var from = (st.intent >= 0) ? st.intent : frontIndex();
      startGlide(st.angle + dir * STEP_RAD, ((from + dir) % n + n) % n);
    }

    function goToPanel(i) {
      if (i < 0 || i >= n) return;
      startGlide(nearestTo(-(i * STEP_RAD)), i);
    }

    /* --------------------------------------------------------------- events */

    function setReason(key, value) {
      if (st.reasons[key] === value) return;
      st.reasons[key] = value;
      if (!value) kick();
    }

    viewport.addEventListener("pointerenter", function (e) {
      if (e.pointerType !== "touch") setReason("hover", true);
    });
    viewport.addEventListener("pointerleave", function () {
      setReason("hover", st.dragging);
    });

    root.addEventListener("focusin", function () { setReason("focus", true); });
    root.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!root.contains(document.activeElement)) setReason("focus", false);
      }, 0);
    });

    /* Whatever holds the focus gets turned to the front, so the thing with
       the focus is always the legible one. The event target is the source of
       truth here, not document.activeElement: for a focusin the browser has
       not necessarily finished updating it while the event is still
       bubbling. */
    function bringToFront(el) {
      if (st.focusGuard || !in3d() || !el) return;
      if (!root.contains(el)) return;
      var panel = el.closest ? el.closest(".cs3__panel") : null;
      if (!panel) return;
      var i = panelEls.indexOf(panel);
      if (i < 0 || i === frontIndex()) return;
      goToPanel(i);
    }

    root.addEventListener("focusin", function (e) { bringToFront(e.target); });
    /* A focus restored on load, or set without a focusin, still has to land on
       the panel that is showing. */
    window.addEventListener("focus", function () { bringToFront(document.activeElement); });

    /* ---- drag ---- */

    viewport.addEventListener("pointerdown", function (e) {
      if (!in3d()) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;
      st.dragging = true;
      st.dragId = e.pointerId;
      st.lastX = e.clientX;
      st.lastT = performance.now();
      st.vel = 0;
      st.moved = 0;
      st.glide = false;
      st.glideUntil = 0;
      st.snapUntil = 0;
      setReason("drag", true);
      viewport.classList.add("is-dragging");
      try { viewport.setPointerCapture(e.pointerId); } catch (err) {}
      kick();
    });

    viewport.addEventListener("pointermove", function (e) {
      if (!st.dragging || e.pointerId !== st.dragId) return;
      var now = performance.now();
      var dx = e.clientX - st.lastX;
      var dt = Math.max(10, now - st.lastT) / 1000;
      st.lastX = e.clientX;
      st.lastT = now;
      st.moved += Math.abs(dx);

      var d = dx * DRAG_RAD_PER_PX;
      st.angle += d;
      if (st.angle > Math.PI) st.angle -= Math.PI * 2;
      if (st.angle < -Math.PI) st.angle += Math.PI * 2;

      var v = d / dt;
      if (v > MAX_SPEED) v = MAX_SPEED;
      if (v < -MAX_SPEED) v = -MAX_SPEED;
      st.vel = st.vel * 0.5 + v * 0.5;

      render();
      applyFront(false);
      kick();
    });

    function endDrag(e) {
      if (!st.dragging) return;
      if (e && e.pointerId !== undefined && e.pointerId !== st.dragId) return;
      st.dragging = false;
      st.dragId = null;
      viewport.classList.remove("is-dragging");
      setReason("drag", false);

      if (Math.abs(st.vel) < 0.02) {
        st.vel = 0;
        st.snapUntil = performance.now() + SNAP_WINDOW_MS;
      }

      try {
        if (e && e.pointerId !== undefined &&
            viewport.hasPointerCapture && viewport.hasPointerCapture(e.pointerId)) {
          viewport.releasePointerCapture(e.pointerId);
        }
      } catch (err) {}

      kick();
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    /* A click that follows a real drag must not open a site, and only the
       panel facing the visitor is allowed to open anything. */
    viewport.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a") : null;
      if (!link || !viewport.contains(link)) return;
      if (st.moved > CLICK_SLOP) { e.preventDefault(); st.moved = 0; return; }
      var panel = link.closest(".cs3__panel");
      if (panel && !panel.classList.contains("is-front")) e.preventDefault();
    });

    /* ---- horizontal wheel (trackpads); vertical is left to the page ---- */
    viewport.addEventListener("wheel", function (e) {
      if (!in3d()) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      st.glide = false;
      st.glideUntil = 0;
      st.vel = 0;
      st.angle += e.deltaX * WHEEL_RAD_PER_PX;
      if (st.angle > Math.PI) st.angle -= Math.PI * 2;
      if (st.angle < -Math.PI) st.angle += Math.PI * 2;
      st.snapUntil = performance.now() + 2200;
      render();
      applyFront(false);
      kick();
    }, { passive: false });

    /* ---- keyboard on the stage ---- */
    viewport.addEventListener("keydown", function (e) {
      if (!in3d() || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") { turn(1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { turn(-1); e.preventDefault(); }
      else if (e.key === "Home") { goToPanel(0); e.preventDefault(); }
      else if (e.key === "End") { goToPanel(n - 1); e.preventDefault(); }
    });

    /* ---- buttons ---- */
    function bindButton(el, dir) {
      if (!el) return;
      el.addEventListener("click", function () { turn(dir); });
    }
    bindButton(prevBtn, -1);
    bindButton(nextBtn, 1);

    /* ---- environment ---- */

    document.addEventListener("visibilitychange", function () {
      setReason("hidden", !!document.hidden);
      if (!document.hidden) { st.lastFrame = 0; kick(); }
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        var e = entries[0];
        var visible = !!e.isIntersecting && e.intersectionRatio > 0.05;
        st.onScreen = visible;
        st.reasons.off = !visible;
        if (visible) { st.lastFrame = 0; kick(); }
        else stopLoop();
      }, { threshold: [0, 0.05, 0.25] });
      io.observe(root);
    } else {
      st.onScreen = true;
      st.reasons.off = false;
    }

    /* ---- mode: 3D cylinder, or the plain rail ---- */

    /* The rail is the answer whenever the cylinder would be the wrong tool:
       no preserve-3d, a screen under 900px, or motion that must be reduced. */
    function usable() {
      return supports3d && !reduce() && !(narrowQuery && narrowQuery.matches);
    }

    /* In 3D mode the rail is not painted, so its seven lazy images would be
       seven downloads nothing can see. `sizes: 1px` makes the browser pick a
       sliver from the srcset, and the width/height attributes keep the layout
       stable. Rail mode clears the attribute again. */
    function syncImageSizes() {
      var railImgs = rail ? rail.querySelectorAll("img") : [];
      for (var i = 0; i < railImgs.length; i++) {
        if (in3d()) railImgs[i].setAttribute("sizes", "1px");
        else railImgs[i].removeAttribute("sizes");
      }
    }

    function resetInline() {
      track.style.removeProperty("--cs3-rot");
      root.style.removeProperty("--cs3-front");
      for (var i = 0; i < n; i++) {
        panels[i].el.style.removeProperty("opacity");
        panels[i].el.style.removeProperty("z-index");
        if (panels[i].veil) panels[i].veil.style.removeProperty("opacity");
      }
      if (countNow) countNow.textContent = "01";
      st.active = -1;
      st.angle = 0;
      st.glide = false;
      st.glideUntil = 0;
      st.announced = "";
    }

    function syncMode(force) {
      var on = force ? force === "3d" : usable();
      var was = in3d();
      if (on === was) return;
      root.classList.toggle("is-3d", on);
      root.classList.toggle("is-mode-rail", !on);
      syncImageSizes();

      if (on) {
        if (!st.onScreen && !("IntersectionObserver" in window)) st.onScreen = true;
        measure();
        layout();
        render();
        applyFront(true);
        kick();
      } else {
        st.vel = 0;
        st.glide = false;
        st.glideUntil = 0;
        stopLoop();
        resetInline();
      }
    }

    /* ---- measurement: keeps the apothem equal to the CSS panel width ---- */

    var measured = 0;
    function measure() {
      var w = in3d() ? Math.round(panelEls[0].offsetWidth) : 0;
      if (!w) w = 0;
      if (w && w !== measured) { measured = w; st.minW = w; }
    }

    if ("ResizeObserver" in window) {
      var ro = new ResizeObserver(function () {
        var before = measured;
        measure();
        if (measured !== before || in3d()) {
          layout();
          if (in3d()) render();
        }
      });
      ro.observe(panelEls[0]);
      ro.observe(viewport);
    }

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        resizeTimer = 0;
        if (st.dead) return;
        var on = usable();
        if (on !== in3d()) { syncMode(); return; }
        if (!on) return;
        measure();
        layout();
        st.angle = Math.round(st.angle / STEP_RAD) * STEP_RAD;
        st.vel = 0;
        st.glide = false;
        st.glideUntil = 0;
        render();
        applyFront(false);
      }, 150);
    }, { passive: true });

    function onMotionChange() {
      st.reduced = reduce();
      /* reduced motion now means the rail, so a switch in either direction is
         a mode change; syncMode does the resetting and the repaint */
      if (usable() !== in3d()) { syncMode(); return; }
      if (st.reduced) {
        st.vel = 0;
        st.glide = false;
        st.glideUntil = 0;
        st.snapUntil = 0;
        st.angle = Math.round(st.angle / STEP_RAD) * STEP_RAD;
        render();
        applyFront(true);
      }
      kick();
    }
    if (reduceQuery && reduceQuery.addEventListener) {
      reduceQuery.addEventListener("change", onMotionChange);
    }
    if (narrowQuery && narrowQuery.addEventListener) {
      narrowQuery.addEventListener("change", function () {
        if (usable() !== in3d()) syncMode();
      });
    }

    /* First paint: pick a state before any observer fires, so the rail shows
       immediately and the cylinder only appears when it can really turn.
       `data-cs3-only="rail"|"3d"` lets the verification page force a state. */
    var only = root.getAttribute("data-cs3-only");
    var want3d = only === "3d" ? supports3d : only === "rail" ? false : usable();
    root.classList.toggle("is-3d", want3d);
    root.classList.toggle("is-mode-rail", !want3d);
    syncImageSizes();
    if (want3d) {
      st.onScreen = only === "3d";
      st.reasons.off = only !== "3d";
      measure();
      layout();
      applyFront(true);
      render();
    }

    var api = {
      root: root,
      turn: turn,
      goTo: goToPanel,
      state: st,
      mode: function () { return in3d() ? "3d" : "rail"; },
      index: function () { return st.active; },
      angle: function () { return st.angle; },
      running: function () { return !!st.raf; },
      /* re-measure and repaint: useful after a font swap, a late layout change
         or any time the page is shown from a hidden container */
      refresh: function () {
        measure();
        layout();
        render();
        applyFront(false);
      },
      frontTransform: function () {
        var el = panels[frontIndex()].el;
        return getComputedStyle(el).transform;
      }
    };
    root.cs3 = api;
    instances.push(api);
    window.cs3Instances = instances;
  }
})();
