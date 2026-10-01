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
      var pts = [[0, 0], [0.09, 0.06], [0.26, 0.21], [0.36, 0.44], [0.36, 0.64], [0.26, 0.8], [0.1, 0.88], [0, 0.9]]
        .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var geo = new THREE.LatheGeometry(pts, 48);
      var pinMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.55, roughness: 0.4 });
      var pin = new THREE.Mesh(geo, pinMat);
      pin.scale.setScalar(0.72);
      pin.position.z = 0.14;
      pin.position.y = -0.3;
      group.add(pin);
    },
    qr: function (THREE, group) {
      var tex = new THREE.CanvasTexture(qrCanvas());
      tex.anisotropy = 4;
      var box = new THREE.BoxGeometry(0.82, 0.82, 0.07);
      var mats = [inkMat(THREE), inkMat(THREE), inkMat(THREE), inkMat(THREE),
        new THREE.MeshStandardMaterial({ map: tex, metalness: 0.15, roughness: 0.5 }), inkMat(THREE)];
      var tile = new THREE.Mesh(box, mats);
      tile.position.z = 0.1;
      group.add(tile);
    },
    pack: function (THREE, group) {
      var frame = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.04, 0.06), goldMat(THREE));
      frame.position.z = 0.08;
      group.add(frame);
      var screen = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.84, 0.03), inkMat(THREE));
      screen.position.set(0, -0.06, 0.14);
      group.add(screen);
      var bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.11, 0.025), goldMat(THREE));
      bar1.position.set(-0.17, 0.16, 0.17);
      group.add(bar1);
      var barMat = goldMat(THREE); barMat.transparent = true; barMat.opacity = 0.6;
      var bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.02), barMat);
      bar2.position.set(-0.29, -0.06, 0.17);
      group.add(bar2);
      var dotGeo = new THREE.SphereGeometry(0.055, 16, 16);
      [-0.57, -0.38, -0.19].forEach(function (x) {
        var d = new THREE.Mesh(dotGeo, goldMat(THREE));
        d.position.set(x, 0.37, 0.17);
        group.add(d);
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
      BUILD[kind](THREE, glyph);
      root.add(glyph);
      scene.add(root);
      /* Reduced motion still gets the medallion — just no spin, no
         pop-in: a still frame, lit and tilted like the others. */
      root.scale.setScalar(REDUCE ? 1 : 0.001);
      if (REDUCE) root.rotation.x = 0.08;

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
