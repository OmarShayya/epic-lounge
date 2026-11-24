import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const CYAN = 0x00ced1;
const PURPLE = 0x9b51e0;

/** Soft round sprite used for the glow halo and particles. */
function makeRadialTexture(inner: string, outer: string, size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Mounts the hero WebGL scene into `container` and returns a cleanup function.
 * Neon wireframe core + orbit rings + drifting particles over an endless grid floor.
 * Reacts to the mouse (parallax/tilt) and to page scroll; sleeps when off-screen.
 */
export function mountHeroScene(container: HTMLElement): () => void {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.innerWidth < 768;
  // Real bloom on larger screens; phones get a cheaper sprite glow instead
  const useBloom = !isSmall;

  const renderer = new THREE.WebGLRenderer({
    antialias: !isSmall,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmall ? 1.5 : 1.75));
  renderer.setClearColor(0x000000, useBloom ? 1 : 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 9, 28);

  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 1.2, 8);

  // ---- Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const cyanLight = new THREE.PointLight(CYAN, 40, 20);
  const purpleLight = new THREE.PointLight(PURPLE, 40, 20);
  scene.add(cyanLight, purpleLight);

  // ---- Floor grid (scrolls towards the camera forever)
  const CELL = 1;
  const grid = new THREE.GridHelper(80, 80, CYAN, 0x23232d);
  grid.position.y = -2.4;
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  gridMat.opacity = 0;
  scene.add(grid);

  // ---- Core
  const core = new THREE.Group();
  scene.add(core);

  const shellGeo = new THREE.IcosahedronGeometry(1.6, 1);
  const shellMat = new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.75 });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  core.add(shell);

  const gemGeo = new THREE.IcosahedronGeometry(1.05, 0);
  const gemMat = new THREE.MeshStandardMaterial({
    color: 0x0b0b12,
    metalness: 0.6,
    roughness: 0.3,
    flatShading: true,
    emissive: PURPLE,
    emissiveIntensity: 0.22,
  });
  const gem = new THREE.Mesh(gemGeo, gemMat);
  core.add(gem);

  const edgesGeo = new THREE.EdgesGeometry(gemGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0xd2b0ff });
  gem.add(new THREE.LineSegments(edgesGeo, edgesMat));

  const ringGeoA = new THREE.TorusGeometry(2.35, 0.016, 8, 180);
  const ringGeoB = new THREE.TorusGeometry(2.8, 0.011, 8, 180);
  const ringMatA = new THREE.MeshBasicMaterial({ color: 0xb57cff });
  const ringMatB = new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.8 });
  const ringA = new THREE.Mesh(ringGeoA, ringMatA);
  const ringB = new THREE.Mesh(ringGeoB, ringMatB);
  ringA.rotation.set(1.25, 0.2, 0);
  ringB.rotation.set(1.6, -0.5, 0.4);
  core.add(ringA, ringB);

  // Little "satellites" riding the rings
  const satGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const satMatA = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const satA = new THREE.Mesh(satGeo, satMatA);
  const satB = new THREE.Mesh(satGeo, satMatA);
  ringA.add(satA);
  ringB.add(satB);

  // Fake bloom: additive halo sprite behind the core
  const haloTex = makeRadialTexture("rgba(0,206,209,0.55)", "rgba(155,81,224,0)");
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: useBloom ? 0.3 : 0.7,
  });
  const halo = new THREE.Sprite(haloMat);
  halo.scale.set(6.5, 6.5, 1);
  halo.position.z = -1;
  core.add(halo);

  // ---- Particles
  const COUNT = isSmall ? 260 : 650;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = -2 + Math.random() * 11;
    positions[i * 3 + 2] = -22 + Math.random() * 28;
    speeds[i] = 0.15 + Math.random() * 0.45;
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const dotTex = makeRadialTexture("rgba(255,255,255,1)", "rgba(255,255,255,0)", 32);
  const particlesMat = new THREE.PointsMaterial({
    size: 0.07,
    map: dotTex,
    color: 0x9fe9ff,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ---- Post-processing
  let composer: EffectComposer | null = null;
  let bloom: UnrealBloomPass | null = null;
  if (useBloom) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.85, 0.55, 0.05);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
  }

  // ---- Layout (core sits to the right on wide screens, above the text on phones)
  let corePos = new THREE.Vector3(2.7, 0.5, 0);
  let coreScale = 1;
  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    const aspect = w / h;
    renderer.setSize(w, h, false);
    composer?.setSize(w, h);
    camera.aspect = aspect;
    if (aspect >= 1.05) {
      corePos = new THREE.Vector3(Math.min(3.1, 1.1 + aspect * 1.05), 0.5, 0);
      coreScale = 1.12;
      camera.position.z = 8;
    } else {
      // Portrait: tuck the core into the top-right, above the headline
      corePos = new THREE.Vector3(1.05, 3.2, -0.5);
      coreScale = 0.6;
      camera.position.z = 10;
    }
    core.position.copy(corePos);
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // ---- Input
  const mouse = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  // ---- Loop
  let last = performance.now();
  const getDelta = () => {
    const now = performance.now();
    const d = (now - last) / 1000;
    last = now;
    return d;
  };
  let raf = 0;
  let inView = true;
  let elapsed = 0;

  const frame = () => {
    // Real time drives the choreography; dt is capped only for incremental spins
    const raw = getDelta();
    const dt = Math.min(raw, 0.05);
    elapsed += raw;
    const t = elapsed;
    const scroll = Math.min(window.scrollY / Math.max(container.clientHeight, 1), 1.5);

    // Intro: grow the core in, fade the grid up
    const intro = Math.min(t / 1.4, 1);
    const easeOutBack = 1 + 2.2 * Math.pow(intro - 1, 3) + 1.2 * Math.pow(intro - 1, 2);
    core.scale.setScalar(coreScale * Math.max(easeOutBack, 0.0001) * (1 - scroll * 0.25));
    gridMat.opacity = 0.32 * intro;

    smooth.x += (mouse.x - smooth.x) * 0.05;
    smooth.y += (mouse.y - smooth.y) * 0.05;

    const spin = 1 + scroll * 3;
    shell.rotation.y += dt * 0.18 * spin;
    shell.rotation.x += dt * 0.07 * spin;
    gem.rotation.y -= dt * 0.35 * spin;
    gem.rotation.z += dt * 0.12 * spin;
    ringA.rotation.z += dt * 0.4;
    ringB.rotation.z -= dt * 0.28;
    satA.position.set(Math.cos(t * 1.3) * 2.35, Math.sin(t * 1.3) * 2.35, 0);
    satB.position.set(Math.cos(-t * 0.9) * 2.8, Math.sin(-t * 0.9) * 2.8, 0);

    // Float + tilt towards the cursor
    core.position.y = corePos.y + Math.sin(t * 0.9) * 0.15 + scroll * 1.2;
    core.rotation.x = smooth.y * 0.35;
    core.rotation.y = smooth.x * 0.5;

    // Orbiting lights
    cyanLight.position.set(corePos.x + Math.cos(t * 0.7) * 4, 2 + Math.sin(t * 0.5), Math.sin(t * 0.7) * 4);
    purpleLight.position.set(corePos.x + Math.cos(t * 0.7 + Math.PI) * 4, -1, Math.sin(t * 0.7 + Math.PI) * 4);

    // Endless floor
    grid.position.z = (t * 1.6) % CELL;

    // Particles drift up and wrap
    const pos = particlesGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let y = pos.getY(i) + speeds[i] * dt * 0.35;
      if (y > 9) y = -2;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    particles.rotation.y = t * 0.015;

    // Camera parallax
    camera.position.x += (smooth.x * 0.7 - camera.position.x) * 0.05;
    camera.position.y += (1.2 - smooth.y * 0.35 - scroll * 0.6 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.5, 0);

    if (composer) composer.render(dt);
    else renderer.render(scene, camera);
  };

  const loop = () => {
    frame();
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (raf || reducedMotion) return;
    getDelta();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  if (reducedMotion) {
    // One still frame with everything settled
    elapsed = 2;
    frame();
  } else {
    start();
  }

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView && !document.hidden) start();
    else stop();
  });
  io.observe(container);
  const onVisibility = () => {
    if (document.hidden) stop();
    else if (inView) start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pointermove", onPointer);
    [shellGeo, gemGeo, edgesGeo, ringGeoA, ringGeoB, satGeo, particlesGeo, grid.geometry].forEach((g) => g.dispose());
    [shellMat, gemMat, edgesMat, ringMatA, ringMatB, satMatA, haloMat, particlesMat, gridMat].forEach((m) => m.dispose());
    haloTex.dispose();
    bloom?.dispose();
    composer?.dispose();
    dotTex.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
