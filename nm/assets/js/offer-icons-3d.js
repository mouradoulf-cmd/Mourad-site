/* NM Studio — offer icons, in 3D: a small polished gold medallion per
   offer (Google pin / real QR tile / browser plaque / network nodes),
   replacing the flat line-art once Three.js is ready. Progressive
   enhancement only — the existing SVG (offer-icons.js) renders first and
   stays as the fallback under reduced motion, before Three.js loads, or
   if WebGL isn't available. Each scene is cheap (a few hundred
   triangles) and its render loop sleeps whenever off-screen. */
(function () {
  "use strict";
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GOLD = "#c9a961", INK = "#15131e";

  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    var s = document.createElement("script");
    s.src = "assets/js/vendor/three.min.js";
    s.onload = cb;
    document.head.appendChild(s);
  }

  /* A map pin holding a storefront glyph — Google Business read purely
     through the house gold, no borrowed brand colors breaking the
     medallion set (the full-color "G" used to be the one icon that
     didn't match the other three). Drawn straight on canvas, gold
     gradient fill, the storefront cut as a dark silhouette with its
     door punched through to transparency so the coin's own cap shows
     through, like a lit window. */
  function googleCanvas() {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 256, 256);
    ctx.save();
    ctx.translate(128, 34);
    var r = 70;
    ctx.beginPath();
    ctx.arc(0, r, r, Math.PI, 0, false);
    ctx.bezierCurveTo(r, r + 70, r * 0.55, r + 130, 0, r + 178);
    ctx.bezierCurveTo(-r * 0.55, r + 130, -r, r + 70, -r, r);
    ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, r * 2 + 178);
    grad.addColorStop(0, "#f3d998");
    grad.addColorStop(0.55, "#c9a961");
    grad.addColorStop(1, "#95702f");
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.translate(0, r);
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 8;
    ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.strokeRect(-30, -4, 60, 30);
    ctx.beginPath();
    ctx.moveTo(-36, -4); ctx.lineTo(-22, -25); ctx.lineTo(22, -25); ctx.lineTo(36, -4); ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(-8, 8, 16, 18); // door punched through to transparency
    ctx.restore();
    return c;
  }

  /* Real QR canvas texture — same rule as everywhere else on the site:
     an actual scannable code, never a decorative fake pattern. */
  function qrCanvas() {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var ctx = c.getContext("2d");
    ctx.fillStyle = INK; ctx.fillRect(0, 0, 256, 256);
    var Q = window.NMQR, mx = Q && Q.matrix(Q.MENU_URL, "L");
    if (mx) {
      var n = mx.n, pad = 24, u = (256 - pad * 2) / n;
      ctx.fillStyle = GOLD;
      for (var r = 0; r < n; r++) for (var cl = 0; cl < n; cl++) {
        if (mx.dark[r][cl]) ctx.fillRect(pad + cl * u + u * 0.06, pad + r * u + u * 0.06, u * 0.88, u * 0.88);
      }
    }
    return c;
  }

  function buildCoin(THREE) {
    var geo = new THREE.CylinderGeometry(1.15, 1.15, 0.22, 56);
    var side = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.22 });
    var cap = new THREE.MeshStandardMaterial({ color: "#241f1a", metalness: 0.35, roughness: 0.5 });
    var mesh = new THREE.Mesh(geo, [side, cap, cap]);
    mesh.rotation.x = Math.PI / 2;
    return mesh;
  }

  function goldMat(THREE) { return new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.2 }); }
  function inkMat(THREE) { return new THREE.MeshStandardMaterial({ color: INK, metalness: 0.5, roughness: 0.4 }); }

  /* Kinds held still after their entrance pop, instead of spinning —
     the Google plaque is a flat logo, so a full rotation flashes a
     blank gold edge for part of every turn. Face-on, well lit, static. */
  var STILL = { google: true };

  var BUILD = {
    google: function (THREE, group) {
      var tex = new THREE.CanvasTexture(googleCanvas());
      tex.anisotropy = 4;
      var mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, metalness: 0.35, roughness: 0.4 });
      var plaque = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 2.05), mat);
      plaque.position.z = 0.115;
      group.add(plaque);
    },
    /* A phone holding the real QR code on its screen, with a scan line
       sweeping over it — returns an update(ts) the render loop calls
       every frame, since this is the one icon with motion beyond the
       shared coin spin. */
    qr: function (THREE, group) {
      var bodyW = 0.92, bodyH = 1.62, screenW = 0.8, screenH = 1.5;
      var body = new THREE.Mesh(new THREE.BoxGeometry(bodyW, bodyH, 0.09), goldMat(THREE));
      body.position.z = 0.09;
      group.add(body);

      var tex = new THREE.CanvasTexture(qrCanvas());
      tex.anisotropy = 4;
      var screen = new THREE.Mesh(new THREE.PlaneGeometry(screenW, screenH),
        new THREE.MeshStandardMaterial({ map: tex, metalness: 0.1, roughness: 0.55 }));
      screen.position.z = 0.141;
      group.add(screen);

      var notch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.01), inkMat(THREE));
      notch.position.set(0, screenH / 2 - 0.08, 0.142);
      group.add(notch);

      var scanMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.85 });
      var scan = new THREE.Mesh(new THREE.PlaneGeometry(screenW, 0.045), scanMat);
      scan.position.z = 0.145;
      group.add(scan);
      var glowMat = new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.25 });
      var glow = new THREE.Mesh(new THREE.PlaneGeometry(screenW, 0.22), glowMat);
      glow.position.z = 0.144;
      group.add(glow);

      return function (ts) {
        var period = 2000;
        var t = (ts % period) / period;               // 0 -> 1 linear, loops
        var tri = t < 0.5 ? t * 2 : 2 - t * 2;          // 0 -> 1 -> 0 triangle
        var e = tri * tri * (3 - 2 * tri);              // smootherstep: eases at each turnaround
        var yPos = (e - 0.5) * (screenH - 0.08);
        scan.position.y = yPos;
        glow.position.y = yPos;
      };
    },
    /* A wireframe globe with a few lit pins on its surface — the same
       "found on the map" motif as the hero video's pin-sphere, echoed
       here in miniature for the Complete Pack (full website) offer. */
    pack: function (THREE, group) {
      var sphere = new THREE.SphereGeometry(0.82, 18, 12);
      var wire = new THREE.LineSegments(
        new THREE.WireframeGeometry(sphere),
        new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.55 })
      );
      group.add(wire);

      var core = new THREE.Mesh(sphere, new THREE.MeshStandardMaterial({ color: INK, metalness: 0.3, roughness: 0.7, transparent: true, opacity: 0.55 }));
      group.add(core);

      var pinGeo = new THREE.SphereGeometry(0.065, 14, 14);
      var pinMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.6, roughness: 0.25, emissive: 0x6b5424, emissiveIntensity: 0.5 });
      [[0.35, 0.55], [-2.1, 0.15], [1.2, -0.35], [2.6, 0.5]].forEach(function (ll) {
        var lat = ll[1], lon = ll[0];
        var r = 0.82;
        var p = new THREE.Vector3(
          r * Math.cos(lat) * Math.cos(lon),
          r * Math.sin(lat),
          r * Math.cos(lat) * Math.sin(lon)
        );
        var pin = new THREE.Mesh(pinGeo, pinMat);
        pin.position.copy(p);
        group.add(pin);
      });
    },
    /* A faceted gold gem — Ultimate is the top tier, and a cut stone
       reads "most precious" at a glance without needing a figurative
       symbol. A real brilliant cut is tall and pointed, not a flat
       disc: the pavilion (height nearly double its girdle radius)
       tapers to a sharp point, the crown is a shallow bevel up to the
       table. Low-segment primitives give the geometry itself hard
       facet edges; flat shading keeps each one a distinct plane that
       catches the light differently as the medallion sways — a
       sparkle a smooth sphere could never give. Set in a slim
       four-prong ring at the girdle, like a solitaire mount, so it
       reads as a jewel rather than a prop. */
    ultimate: function (THREE, group) {
      var gemMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.55, roughness: 0.3, flatShading: true, emissive: 0x3d2f10, emissiveIntensity: 0.25 });
      var girdleR = 0.48, crownH = 0.32, tableR = 0.17, pavH = 0.92;
      var Y = 0.3; // lifts the (apex-heavy) gem so it sits centered in the medallion

      var pavilion = new THREE.Mesh(new THREE.ConeGeometry(girdleR, pavH, 10), gemMat);
      pavilion.rotation.x = Math.PI; // apex down, base (girdle) up
      pavilion.position.y = Y - pavH / 2;
      group.add(pavilion);

      var crown = new THREE.Mesh(new THREE.CylinderGeometry(tableR, girdleR, crownH, 10), gemMat);
      crown.position.y = Y + crownH / 2;
      group.add(crown);

      var table = new THREE.Mesh(new THREE.CylinderGeometry(tableR, tableR, 0.02, 10), gemMat);
      table.position.y = Y + crownH + 0.01;
      group.add(table);

      var ring = new THREE.Mesh(new THREE.TorusGeometry(girdleR + 0.06, 0.04, 10, 32), goldMat(THREE));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = Y - 0.04;
      group.add(ring);

      var prongGeo = new THREE.ConeGeometry(0.042, 0.2, 6);
      [0, 1, 2, 3].forEach(function (i) {
        var a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        var prong = new THREE.Mesh(prongGeo, goldMat(THREE));
        prong.position.set(Math.cos(a) * (girdleR + 0.03), Y + 0.06, Math.sin(a) * (girdleR + 0.03));
        prong.rotation.x = Math.PI;
        group.add(prong);
      });
    }
  };

  function mountOne(container, kind) {
    loadThree(function () {
      var THREE = window.THREE;
      if (!THREE || !BUILD[kind]) return;
      var renderer;
      try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
      catch (e) { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.innerHTML = "";
      container.appendChild(renderer.domElement);
      container.classList.add("ic3d");

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
      camera.position.set(0, 0.15, 4);
      camera.lookAt(0, 0, 0);

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      var key = new THREE.DirectionalLight(0xfff2d9, 1.1); key.position.set(2.5, 3, 3); scene.add(key);
      var fill = new THREE.DirectionalLight(0x8a6324, 0.5); fill.position.set(-3, -1.5, 2); scene.add(fill);
      var rim = new THREE.PointLight(0xc9a961, 0.6, 8); rim.position.set(-1.5, 1, -2); scene.add(rim);

      var root = new THREE.Group();
      root.add(buildCoin(THREE));
      var glyph = new THREE.Group();
      var tick = BUILD[kind](THREE, glyph); // some icons (the QR scan line) animate beyond the shared coin spin
      root.add(glyph);
      scene.add(root);
      /* Reduced motion still gets the medallion — just no spin, no
         pop-in: a still frame, lit and tilted like the others. */
      root.scale.setScalar(REDUCE ? 1 : 0.001);
      if (REDUCE) { root.rotation.x = 0.08; if (tick) tick(0); }

      function resize() {
        var w = container.clientWidth, h = container.clientHeight || w;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        if (REDUCE) renderer.render(scene, camera);
      }
      resize();
      window.addEventListener("resize", resize, { passive: true });
      /* The dialog's art container is zero-size while <dialog> is still
         closed (if Three.js was already loaded from the cards, mount()
         runs synchronously before showModal()) — a plain resize listener
         misses that. ResizeObserver catches the box becoming real. */
      if ("ResizeObserver" in window) new ResizeObserver(resize).observe(container);
      if (REDUCE) { renderer.render(scene, camera); return; }

      var raf = 0, active = false, entered = false, enterStart = 0;
      var still = STILL[kind]; // a full 360° spin flashes a flat/thin icon edge-on — google reads better held still
      function easeOutBack(t) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
      function frame(ts) {
        raf = 0;
        if (!entered) { entered = true; enterStart = ts; }
        var t = Math.min(1, (ts - enterStart) / 700);
        root.scale.setScalar(Math.max(0.001, easeOutBack(t)));
        if (still) {
          root.rotation.x = 0.08;
        } else {
          root.rotation.y = Math.sin(ts * 0.00045) * 0.5; // gentle sway, bounded well short of edge-on
          root.rotation.x = Math.sin(ts * 0.00018) * 0.06;
        }
        if (tick) tick(ts);
        renderer.render(scene, camera);
        if (active && (!still || t < 1)) raf = requestAnimationFrame(frame);
      }
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) {
          active = es[0].isIntersecting;
          if (active && !raf) raf = requestAnimationFrame(frame);
        }, { rootMargin: "20% 0px" }).observe(container);
      } else { active = true; raf = requestAnimationFrame(frame); }
    });
  }

  function mountAll(root) {
    if (!window.WebGLRenderingContext) return;
    (root || document).querySelectorAll(".offer__icon[data-icon]").forEach(function (el) {
      mountOne(el, el.getAttribute("data-icon"));
    });
  }

  window.NMIcon3D = { mount: mountOne, supported: !!window.WebGLRenderingContext };
  if (document.readyState === "complete") mountAll();
  else window.addEventListener("load", function () { mountAll(); });
})();
