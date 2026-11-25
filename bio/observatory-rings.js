// Ring geometry, materials and legacy motion adapted from Continuation Observatory's
// hero-torus.js. Copyright (c) 2026 Christopher Altman, MIT (see ../LICENSE).
function createRingScene(THREE, canvas) {
  const options = { alpha: true, antialias: true, powerPreference: 'low-power' };
  const context = canvas.getContext('webgl2', options) || canvas.getContext('webgl', options);
  if (!context) return null;

  const renderer = new THREE.WebGLRenderer({ canvas, context, ...options });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 1000);
  camera.position.z = 8.6;
  const quarterTurn = Math.PI / 2;

  const torusRadius = 1;
  const torusTubeRadius = 0.17;
  const torusGeometry = new THREE.TorusGeometry(torusRadius, torusTubeRadius, 28, 196);
  const centerNodeGeometry = new THREE.SphereGeometry(0.055, 24, 24);
  const centerShellGeometry = new THREE.SphereGeometry(0.13, 24, 24);
  const centerAuraGeometry = new THREE.SphereGeometry(0.235, 20, 20);
  const torusGroup = new THREE.Group();
  const torusAssembly = new THREE.Group();
  torusGroup.add(torusAssembly);
  scene.add(torusGroup);

  const ringDefinitions = [
    {
      wireColor: 0x6f9fff,
      wireOpacity: 0.30,
      shellColor: 0x5e92f5,
      shellOpacity: 0.06,
      ghostColor: 0x6aa8ff,
      ghostOpacity: 0.018,
      ghostScale: 1.014,
      baseRotation: [0, 0, 0],
      legacyPhase: 0,
      legacySpeed: 0.12
    },
    {
      wireColor: 0xe9e1fb,
      wireOpacity: 0.215,
      shellColor: 0xd9d3f4,
      shellOpacity: 0.052,
      ghostColor: 0xbdd3ff,
      ghostOpacity: 0.035,
      ghostScale: 1.025,
      baseRotation: [quarterTurn, 0, 0],
      legacyPhase: quarterTurn * 0.35,
      legacySpeed: -0.1
    },
    {
      wireColor: 0x6487e8,
      wireOpacity: 0.10,
      shellColor: 0x5779d4,
      shellOpacity: 0.028,
      ghostColor: 0x6b9fff,
      ghostOpacity: 0.02,
      ghostScale: 1.02,
      baseRotation: [0, quarterTurn, 0],
      legacyPhase: quarterTurn * 0.68,
      legacySpeed: 0.085
    }
  ];

  const rings = ringDefinitions.map(function (definition) {
    const occluderMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      colorWrite: false,
      depthWrite: true,
      depthTest: true
    });
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: definition.shellColor,
      side: THREE.DoubleSide,
      opacity: definition.shellOpacity,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: definition.ghostColor,
      side: THREE.DoubleSide,
      opacity: definition.ghostOpacity,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending
    });
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: definition.wireColor,
      wireframe: true,
      opacity: definition.wireOpacity,
      transparent: true,
      depthWrite: false,
      depthTest: true
    });
    const ringBase = new THREE.Group();
    const ringSpin = new THREE.Group();
    const ringOccluder = new THREE.Mesh(torusGeometry, occluderMaterial);
    const ringShell = new THREE.Mesh(torusGeometry, shellMaterial);
    const ringGhost = new THREE.Mesh(torusGeometry, ghostMaterial);
    const ringWire = new THREE.Mesh(torusGeometry, wireMaterial);

    ringOccluder.renderOrder = 0;
    ringShell.renderOrder = 1;
    ringGhost.renderOrder = 2;
    ringWire.renderOrder = 3;
    ringGhost.scale.setScalar(definition.ghostScale);

    ringBase.rotation.set(
      definition.baseRotation[0],
      definition.baseRotation[1],
      definition.baseRotation[2]
    );
    ringSpin.add(ringOccluder);
    ringSpin.add(ringShell);
    ringSpin.add(ringGhost);
    ringSpin.add(ringWire);
    ringBase.add(ringSpin);
    torusAssembly.add(ringBase);

    return {
      spin: ringSpin,
      legacyPhase: definition.legacyPhase,
      legacySpeed: definition.legacySpeed
    };
  });

  // Keep the source glow's additive RGB. Accumulate ordinary coverage in the
  // alpha channel so its translucent layers also composite on a light page.
  const glowBlending = {
    blending: THREE.CustomBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneFactor,
    blendSrcAlpha: THREE.OneFactor,
    blendDstAlpha: THREE.OneMinusSrcAlphaFactor
  };
  const centerAnchor = new THREE.Group();
  const centerOuterAura = new THREE.Mesh(
    new THREE.SphereGeometry(0.38, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0x9ec8ff,
      opacity: 0.015,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      ...glowBlending
    })
  );
  const centerAura = new THREE.Mesh(centerAuraGeometry, new THREE.MeshBasicMaterial({
    color: 0x7dd4ff,
    opacity: 0.045,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    ...glowBlending
  }));
  const centerShell = new THREE.Mesh(centerShellGeometry, new THREE.MeshBasicMaterial({
    color: 0x84daff,
    opacity: 0.08,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    ...glowBlending
  }));
  const centerNode = new THREE.Mesh(centerNodeGeometry, new THREE.MeshBasicMaterial({
    color: 0xe5f7ff,
    opacity: 0.32,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    ...glowBlending
  }));

  centerOuterAura.renderOrder = 0;
  centerAura.renderOrder = 1;
  centerShell.renderOrder = 2;
  centerNode.renderOrder = 4;
  centerAnchor.add(centerOuterAura);
  centerAnchor.add(centerAura);
  centerAnchor.add(centerShell);
  centerAnchor.add(centerNode);
  torusAssembly.add(centerAnchor);

  function applyLegacyMotion(time) {
    torusAssembly.rotation.x = 0.86 + Math.sin(time * 0.29) * 0.055;
    torusAssembly.rotation.y = -0.54 + time * 0.255;
    torusAssembly.rotation.z = 0.1 + Math.cos(time * 0.23) * 0.042;
    torusGroup.position.x = Math.sin(time * 0.17) * 0.019;
    torusGroup.position.y = Math.sin(time * 0.37) * 0.036;

    rings.forEach(function (ring, index) {
      ring.spin.rotation.x = Math.sin(time * 0.72 + index * 1.4) * 0.22;
      ring.spin.rotation.y = Math.cos(time * 0.54 + index * 1.1) * 0.18;
      ring.spin.rotation.z = ring.legacyPhase + time * ring.legacySpeed;
    });

    centerAura.scale.setScalar(1 + Math.sin(time * 0.66) * 0.082);
    centerShell.scale.setScalar(1 + Math.sin(time * 0.82 + 0.5) * 0.052);
    centerOuterAura.scale.setScalar(1 + Math.sin(time * 0.38) * 0.06);
  }

  // Fit the bounding sphere of the largest translucent shell at any rotation.
  const maxShellScale = Math.max(...ringDefinitions.map(ring => ring.ghostScale));
  const radius = (torusRadius + torusTubeRadius) * maxShellScale;
  function resize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const halfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const halfAngle = Math.atan(halfHeight * Math.min(1, camera.aspect) * 0.86);
    torusGroup.scale.setScalar(camera.position.z * Math.sin(halfAngle) / radius);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
  }

  function render(time) {
    applyLegacyMotion(time);
    renderer.render(scene, camera);
  }

  return { resize, render };
}

function mountRings(stage) {
  const canvas = stage.querySelector('canvas');
  const still = stage.querySelector('img');
  const control = stage.querySelector('button');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scene;
  let loading = false;
  let unavailable = false;
  let visible = false;
  let paused = false;
  let needsResize = true;
  let frame = null;
  let previousTime = null;
  let elapsed = 0;

  function stop() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
  }

  function showStill() {
    canvas.hidden = true;
    control.hidden = true;
    still.hidden = false;
  }

  function tick(now) {
    frame = null;
    if (!visible || document.hidden || motion.matches || unavailable) return;
    if (needsResize) {
      scene.resize(stage.clientWidth, stage.clientHeight);
      needsResize = false;
    }
    if (previousTime !== null) {
      const delta = (now - previousTime) / 1000;
      elapsed += delta > 0.1 ? 0.016 : delta; // Keep the legacy motion gentle after a stalled frame.
    }
    scene.render(elapsed);
    canvas.hidden = false;
    control.hidden = false;
    still.hidden = true;
    if (!paused) {
      previousTime = now;
      frame = requestAnimationFrame(tick);
    }
  }

  async function sync() {
    if (unavailable || motion.matches) {
      stop();
      showStill();
      return;
    }
    if (!visible || document.hidden) {
      stop();
      return;
    }
    if (!scene) {
      if (loading) return;
      loading = true;
      try {
        const THREE = await import('./vendor/three-0.160.0/three.module.min.js');
        if (visible && !document.hidden && !motion.matches) {
          scene = createRingScene(THREE, canvas);
          unavailable = !scene;
        }
      } catch {
        unavailable = true;
      }
      loading = false;
      sync();
      return;
    }
    if (frame === null) frame = requestAnimationFrame(tick);
  }

  control.addEventListener('click', () => {
    paused = !paused;
    control.textContent = paused ? 'Resume' : 'Pause';
    control.setAttribute('aria-label', paused ? 'Resume ring animation' : 'Pause ring animation');
    stop();
    if (!paused) sync();
  });
  canvas.addEventListener('webglcontextlost', () => {
    unavailable = true;
    sync();
  });
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new ResizeObserver(() => {
    needsResize = true;
    sync();
  }).observe(stage);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }).observe(stage);
}

document.querySelectorAll('.bio-rings-stage').forEach(mountRings);
