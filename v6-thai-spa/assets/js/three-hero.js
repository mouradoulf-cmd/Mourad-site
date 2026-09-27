import * as THREE from './vendor/three.module.js';

function initWebGL3DObject(canvas, options) {
  if (!canvas || !window.WebGLRenderingContext) return function () {};

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) {
    return function () {};
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = options.exposure || 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.15, 5.2);

  var geometry = new THREE.IcosahedronGeometry(options.radius || 1.35, options.detail || 2);
  var material = new THREE.MeshStandardMaterial({
    color: options.color || 0x9c7a4f,
    metalness: options.metalness ?? 0.2,
    roughness: options.roughness ?? 0.42,
    emissive: options.emissive || 0x3a2a14,
    emissiveIntensity: options.emissiveIntensity ?? 0.28,
    flatShading: !!options.flatShading
  });

  var object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  object.receiveShadow = true;
  scene.add(object);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  var key = new THREE.DirectionalLight(0xffe8c8, 2.1);
  key.position.set(3.4, 4.2, 4.8);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  var rim = new THREE.DirectionalLight(options.rimColor || 0xffd9a0, 0.85);
  rim.position.set(-4.2, 1.2, -2.8);
  scene.add(rim);

  var shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 5.2),
    new THREE.ShadowMaterial({ opacity: 0.16 })
  );
  shadowPlane.position.set(0, -1.65, 0);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var rafId = 0;
  var pointerX = 0, pointerY = 0;

  function resize() {
    var width = Math.max(1, canvas.clientWidth);
    var height = Math.max(1, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxDpr || 1.75));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render(time) {
    time = time || 0;
    var t = time * 0.001;
    object.rotation.x = -0.16 + Math.sin(t * 0.4) * 0.06 + pointerY * 0.12;
    object.rotation.y = t * 0.22 + pointerX * 0.16;
    object.rotation.z = Math.sin(t * 0.28) * 0.06;
    object.position.y = reduceMotion ? 0 : Math.sin(t * 0.7) * 0.08;

    renderer.render(scene, camera);
    if (!reduceMotion) rafId = requestAnimationFrame(render);
  }

  function handlePointer(e) {
    var rect = canvas.getBoundingClientRect();
    pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  function handleResize() {
    cancelAnimationFrame(rafId);
    resize();
    render();
  }

  resize();
  render();
  window.addEventListener('resize', handleResize);
  window.addEventListener('pointermove', handlePointer);

  return function cleanup() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('pointermove', handlePointer);
    geometry.dispose();
    material.dispose();
    shadowPlane.geometry.dispose();
    shadowPlane.material.dispose();
    renderer.dispose();
  };
}

var canvas = document.querySelector('[data-webgl-3d-object]');
var isPhoneWidth = window.matchMedia('(max-width: 760px)').matches;
if (canvas && !isPhoneWidth) {
  initWebGL3DObject(canvas, {
    color: 0x9c7a4f,
    rimColor: 0xffd9a0,
    metalness: 0.2,
    roughness: 0.42,
    emissive: 0x3a2a14
  });
}
