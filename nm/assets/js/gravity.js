/* NM Studio — gravity: a point cloud scattered like a loose galaxy pulls
   into a tight gold core as the section scrolls through view. Three.js
   loads lazily (only once the section is getting close) so it never
   costs anything on first paint; the render loop sleeps whenever the
   section is off-screen. Skipped entirely under reduced motion. */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sec = document.getElementById("gravity"), stage = document.getElementById("gravStage");
  if (!sec || !stage) return;

  function boot() {
    if (window.THREE) { init(); return; }
    var s = document.createElement("script");
    s.src = "assets/js/vendor/three.min.js";
    s.onload = init;
    document.head.appendChild(s);
  }

  function init() {
    var THREE = window.THREE;
    var count = window.innerWidth < 700 ? 1200 : 2800;
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    stage.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    var scatter = new Float32Array(count * 3);
    var core = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var gold = new THREE.Color("#e6c27a"), violet = new THREE.Color("#8d7bff");

    for (var i = 0; i < count; i++) {
      var theta = Math.random() * Math.PI * 2;
      var r = 1.2 + Math.random() * 1.4;
      var y = (Math.random() - 0.5) * 1.0 * (1 - (r - 1.2) / 1.4 * .4);
      scatter[i * 3] = Math.cos(theta) * r;
      scatter[i * 3 + 1] = y;
      scatter[i * 3 + 2] = Math.sin(theta) * r * 0.5;

      var cr = 0.4 + Math.random() * 0.22;
      var cth = Math.random() * Math.PI * 2, cph = Math.acos(2 * Math.random() - 1);
      core[i * 3] = cr * Math.sin(cph) * Math.cos(cth);
      core[i * 3 + 1] = cr * Math.sin(cph) * Math.sin(cth);
      core[i * 3 + 2] = cr * Math.cos(cph);

      var c = gold.clone().lerp(violet, Math.min(1, (r - 1.2) / 1.4));
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }

    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(scatter), 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    var mat = new THREE.PointsMaterial({ size: 0.034, vertexColors: true, transparent: true, opacity: .92, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    var progress = 0, raf = 0, active = false;
    function render() {
      raf = 0;
      var posAttr = geo.getAttribute("position"), arr = posAttr.array;
      for (var i = 0; i < count; i++) {
        var i3 = i * 3;
        arr[i3] = scatter[i3] + (core[i3] - scatter[i3]) * progress;
        arr[i3 + 1] = scatter[i3 + 1] + (core[i3 + 1] - scatter[i3 + 1]) * progress;
        arr[i3 + 2] = scatter[i3 + 2] + (core[i3 + 2] - scatter[i3 + 2]) * progress;
      }
      posAttr.needsUpdate = true;
      points.rotation.y += 0.0016;
      renderer.render(scene, camera);
      if (active) raf = requestAnimationFrame(render);
    }
    function start() { if (!raf) raf = requestAnimationFrame(render); }

    if (window.gsap && window.ScrollTrigger) {
      window.ScrollTrigger.create({
        /* Pulled tight (not "bottom top") so the core forms while the
           section is still centred in view, not as it scrolls away. */
        trigger: sec, start: "top 85%", end: "center center", scrub: 0.5,
        onUpdate: function (self) { progress = self.progress; }
      });
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        active = es[0].isIntersecting;
        if (active) start();
      }, { rootMargin: "15% 0px" }).observe(sec);
    } else { active = true; start(); }
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es, ob) {
      if (es[0].isIntersecting) { ob.disconnect(); boot(); }
    }, { rootMargin: "60% 0px" }).observe(sec);
  } else boot();
})();
