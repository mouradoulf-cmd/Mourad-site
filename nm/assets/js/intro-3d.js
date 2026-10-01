/* NM Studio — opening curtain, once per browser session (skipped under
   prefers-reduced-motion, same convention as Noir's intro). A gold medallion
   with the "NM" monogram materializes in real 3D (Three.js, already
   vendored for the offer icons — same lighting recipe), the wordmark and a
   drawn rule follow, then it hands off into the real hero beneath. Tap
   anywhere to skip. Three.js disposed in full on exit — nothing keeps
   rendering after the curtain is gone. */
(function () {
  "use strict";
  var intro = document.getElementById("intro");
  if (!intro) return; // reduced motion or already seen this session — the inline bootstrap already removed it

  var GOLD = "#e6c27a", INK = "#121019";
  var stage = document.getElementById("introStage");
  var word = document.getElementById("introWord");
  var rule = document.getElementById("introRule");
  var done = false;

  function finish() {
    if (done) return;
    done = true;
    try { sessionStorage.setItem("nmIntroSeen", "1"); } catch (e) {}
    intro.classList.add("is-out");
    document.documentElement.classList.remove("intro-active");
    teardown();
    setTimeout(function () { if (intro.parentNode) intro.remove(); }, 750);
  }

  intro.addEventListener("click", finish);

  var teardown = function () {}; // replaced once the 3D scene exists

  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    var s = document.createElement("script");
    s.src = "assets/js/vendor/three.min.js";
    s.onload = cb;
    s.onerror = cb; // caller checks window.THREE
    document.head.appendChild(s);
  }

  function monogramTexture() {
    // Transparent outside the coin's own circular rim — only the inset
    // engraved plaque is opaque, so the gold cylinder shows through as
    // the border instead of being hidden behind a square texture.
    var c = document.createElement("canvas"); c.width = c.height = 512;
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.beginPath(); ctx.arc(256, 256, 216, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = INK; ctx.fillRect(0, 0, 512, 512);
    ctx.restore();
    ctx.fillStyle = GOLD;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = '600 210px Satoshi, Inter, system-ui, sans-serif';
    ctx.fillText("NM", 256, 256);
    ctx.strokeStyle = "rgba(230,194,122,.55)";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(256, 256, 216, 0, Math.PI * 2); ctx.stroke();
    return c;
  }

  var started = false;

  function boot() {
    if (started || done) return;
    var THREE = window.THREE;
    if (!THREE || !stage) { fallbackSequence(); return; }
    started = true;
    clearTimeout(killer);

    var renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" }); }
    catch (e) { fallbackSequence(); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    stage.appendChild(renderer.domElement);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
    camera.position.set(0, 0.2, 4.4);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    var key = new THREE.DirectionalLight(0xfff2d9, 1.15); key.position.set(2.4, 3, 3); scene.add(key);
    var fill = new THREE.DirectionalLight(0x8d7bff, 0.55); fill.position.set(-3, -1.2, 2); scene.add(fill);
    var rim = new THREE.PointLight(0xe6c27a, 0.65, 9); rim.position.set(-1.6, 1.1, -2); scene.add(rim);

    /* CylinderGeometry's circular end-caps use a polar UV layout, which
       distorts/splits a flat text texture — so the monogram rides on a
       separate thin flat plaque in front of the coin's face (same trick
       as the QR tile in offer-icons-3d.js), not on the cap itself. */
    var side = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.88, roughness: 0.2 });
    var capMat = new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.85, roughness: 0.22 });
    var coinGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.22, 40);
    var coin = new THREE.Mesh(coinGeo, [side, capMat, capMat]);
    coin.rotation.x = Math.PI / 2;

    var faceTex = new THREE.CanvasTexture(monogramTexture());
    faceTex.anisotropy = 4;
    var faceMat = new THREE.MeshStandardMaterial({ map: faceTex, metalness: 0.3, roughness: 0.42, transparent: true });
    var faceGeo = new THREE.PlaneGeometry(2.1, 2.1);
    var face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.115;

    var root = new THREE.Group();
    root.add(coin);
    root.add(face);
    root.scale.setScalar(0.001);
    scene.add(root);

    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight || w;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    /* The render loop only runs while the coin is visibly moving (entrance
       + a brief settle) — a continuous WebGL rAF loop for the full ~2s the
       curtain is up adds real main-thread cost under throttled mobile CPUs
       (measured: this alone was the difference between ~550ms and ~1800ms
       of Lighthouse Total Blocking Time). Once it settles, one last frame
       is rendered and the loop stops; the medallion holds that pose, still,
       while the wordmark fades in beneath it. */
    var raf = 0, t0 = performance.now(), settleAt = 1100;
    function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
    function frame(ts) {
      var el = ts - t0;
      var t = Math.min(1, el / 900);
      root.scale.setScalar(Math.max(0.001, easeOutBack(t)));
      root.rotation.y += 0.0042;
      root.rotation.x = Math.sin(el * 0.0007) * 0.08;
      renderer.render(scene, camera);
      if (el < settleAt) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    teardown = function () {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      coinGeo.dispose(); faceGeo.dispose(); side.dispose(); capMat.dispose(); faceMat.dispose(); faceTex.dispose();
    };

    runTimeline();
  }

  function fallbackSequence() {
    if (started || done) return;
    started = true;
    clearTimeout(killer);
    // No WebGL / Three.js failed to load: still a clean, premium beat — just without the 3D coin.
    runTimeline();
  }

  function runTimeline() {
    setTimeout(function () { if (!done) { word.classList.add("is-in"); rule.classList.add("is-in"); } }, 950);
    setTimeout(finish, 2200);
  }

  var killer = setTimeout(fallbackSequence, 1200);
  loadThree(boot);
})();
