(function () {
  "use strict";

  function svgDataUrl(svgStr) {
    var m = svgStr.match(/viewBox="0 0 (\d+) (\d+)"/);
    var w = m ? m[1] : 800;
    var h = m ? m[2] : 400;
    var sized = svgStr.replace("<svg ", '<svg width="' + w + '" height="' + h + '" ');
    return { url: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(sized), w: +w, h: +h };
  }

  function initScene(canvas, art) {
    if (typeof THREE === "undefined") return null;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) {
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);
    camera.position.set(0, 0.3, 9);

    var loader = new THREE.TextureLoader();
    var planeDefs = [
      { key: "nightsky", x: -6.4, y: 0.5, z: 0.5, rotY: 0.38 },
      { key: "murals", x: -3.3, y: -0.4, z: -2.2, rotY: 0.2 },
      { key: "stage", x: 0, y: 0.3, z: -4.4, rotY: 0 },
      { key: "neon", x: 3.3, y: -0.4, z: -2.2, rotY: -0.2 },
      { key: "crowd", x: 6.4, y: 0.5, z: 0.5, rotY: -0.38 }
    ];

    var meshes = planeDefs.map(function (def) {
      var src = svgDataUrl(art[def.key]);
      var h = 3.1;
      var w = h * (src.w / src.h);
      if (w > 5.4) { w = 5.4; h = w / (src.w / src.h); }
      var geo = new THREE.PlaneGeometry(w, h);
      var tex = loader.load(src.url);
      tex.colorSpace = THREE.SRGBColorSpace || tex.colorSpace;
      var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(def.x, def.y, def.z);
      mesh.rotation.y = def.rotY;
      scene.add(mesh);
      return mesh;
    });

    var ringGeo = new THREE.TorusGeometry(1.05, 0.045, 16, 100);
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xf0b13a });
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 0.35, -3.3);
    scene.add(ring);

    var mouseX = 0, mouseY = 0, curX = 0, curY = 0;
    function onMouseMove(e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("mousemove", onMouseMove);

    var progress = 0;
    function update(p) { progress = p; }

    function resize() {
      var w = canvas.clientWidth || 1;
      var h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    var rafId;
    var clock = new THREE.Clock();
    function animate() {
      rafId = requestAnimationFrame(animate);
      var t = clock.getElapsedTime();
      ring.rotation.z = t * 0.3;
      ring.rotation.x = 0.45;

      curX += (mouseX - curX) * 0.05;
      curY += (mouseY - curY) * 0.05;

      var camZ = 9 - progress * 11;
      camera.position.z = camZ;
      camera.position.x = curX * 0.6;
      camera.position.y = 0.3 + curY * 0.3;
      camera.lookAt(0, 0, camZ - 5);

      renderer.render(scene, camera);
    }
    animate();

    return {
      update: update,
      resize: resize,
      dispose: function () {
        cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", onMouseMove);
        meshes.forEach(function (m) {
          m.geometry.dispose();
          if (m.material.map) m.material.map.dispose();
          m.material.dispose();
        });
        ringGeo.dispose();
        ringMat.dispose();
        renderer.dispose();
      }
    };
  }

  function init() {
    var art = window.TILE_ART;
    var canvas = document.getElementById("gallery3d");
    var wrap = document.getElementById("gallery3dWrap");
    var mosaicGrid = document.getElementById("mosaicGrid");
    if (!art || !canvas || !wrap) return;

    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // keep the flat, static gallery grid for reduced-motion users
    if (!window.WebGLRenderingContext) return;

    var scene3d = initScene(canvas, art);
    if (!scene3d) return; // three.js failed to load or WebGL init failed — flat grid stays visible

    if (mosaicGrid) mosaicGrid.parentElement.style.display = "none";
    wrap.classList.add("is-active");
    scene3d.resize();
    window.addEventListener("resize", scene3d.resize);

    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "+=140%",
        pin: true,
        scrub: 1,
        onUpdate: function (self) { scene3d.update(self.progress); }
      });
    }

    window.addEventListener("pagehide", function () { scene3d.dispose(); }, { once: true });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
