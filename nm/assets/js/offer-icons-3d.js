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

  /* The real Google "G" mark (same path/colors as the flat SVG fallback
     in offer-icons.js) rasterized onto a transparent plaque, plus a
     small storefront glyph for "Business Profile" — replaces the
     abstract pin. Drawn via an Image so the G's curves stay pixel-
     accurate instead of being hand-approximated in canvas calls. */
  var GOOGLE_G_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">' +
    '<path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>' +
    '<path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>' +
    '<path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>' +
    '<path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>' +
    '</svg>';

  function googleCanvas(onReady) {
    var c = document.createElement("canvas"); c.width = c.height = 256;
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, 256, 256);
      var s = 118; // the G, large and centered-high
      ctx.drawImage(img, (256 - s) / 2, 30, s, s);
      // a simple storefront glyph underneath — Google blue, generic (not a reproduced brand asset)
      ctx.save();
      ctx.translate(128, 190);
      ctx.fillStyle = "#4285F4";
      ctx.strokeStyle = "#4285F4";
      ctx.lineWidth = 7;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.strokeRect(-38, -4, 76, 34);
      ctx.beginPath();
      ctx.moveTo(-46, -4); ctx.lineTo(-30, -26); ctx.lineTo(30, -26); ctx.lineTo(46, -4); ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#15131e";
      ctx.fillRect(-10, 8, 20, 22);
      ctx.restore();
      onReady();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(GOOGLE_G_SVG);
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

  var BUILD = {
    google: function (THREE, group) {
      var tex = new THREE.CanvasTexture(googleCanvas(function () { tex.needsUpdate = true; }));
      tex.anisotropy = 4;
      var mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, metalness: 0.1, roughness: 0.55 });
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
    ultimate: function (THREE, group) {
      var nodes = [[0, 0.32], [-0.3, -0.2], [0.3, -0.2]];
      var sphGeo = new THREE.SphereGeometry(0.13, 24, 24);
      var pos = nodes.map(function (n) { return new THREE.Vector3(n[0], n[1], 0.14); });
      pos.forEach(function (p) {
        var s = new THREE.Mesh(sphGeo, goldMat(THREE));
        s.position.copy(p);
        group.add(s);
      });
      function rod(a, b) {
        var dir = new THREE.Vector3().subVectors(b, a), len = dir.length();
        var geo = new THREE.CylinderGeometry(0.03, 0.03, len, 12);
        var m = new THREE.Mesh(geo, goldMat(THREE));
        m.position.copy(a).add(b).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        group.add(m);
      }
      rod(pos[0], pos[1]); rod(pos[1], pos[2]); rod(pos[2], pos[0]);
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
      function easeOutBack(t) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
      function frame(ts) {
        raf = 0;
        if (!entered) { entered = true; enterStart = ts; }
        var t = Math.min(1, (ts - enterStart) / 700);
        root.scale.setScalar(Math.max(0.001, easeOutBack(t)));
        root.rotation.y += 0.0032;
        root.rotation.x = Math.sin(ts * 0.00018) * 0.06;
        if (tick) tick(ts);
        renderer.render(scene, camera);
        if (active) raf = requestAnimationFrame(frame);
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
