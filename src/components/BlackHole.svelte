<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import {
    blackHoleConfig,
    blackHoleFps,
    blackHoleCameraRequest,
    earthScreenPosition,
    ambientCenterTarget,
    SAGITTARIUS_A_PRESET,
    iscoRadius,
    type BlackHoleSimConfig,
    type AmbientCenterTarget
  } from "../lib/blackhole";
  import {
    vertexShader,
    fragmentShader,
    generateNoiseData,
    MAX_STEPS
  } from "../lib/blackholeShader";

  let { isAmbient = false } = $props<{ isAmbient?: boolean }>();

  let canvas: HTMLCanvasElement;
  let updateAmbientMode: (ambient: boolean) => void = () => {};

  $effect(() => {
    updateAmbientMode(isAmbient);
  });

  onMount(() => {
    const preset = SAGITTARIUS_A_PRESET;
    // ISCO in GM/c^2 -> r_s units (r_s = 2 GM/c^2)
    const rIsco = iscoRadius(preset.spin) / 2;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
      depth: false,
      stencil: false
    });

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const startPolar = THREE.MathUtils.degToRad(preset.inclinationDeg + 30);
    camera.position.setFromSpherical(new THREE.Spherical(32, startPolar, 0.6));

    canvas.style.touchAction = "none";

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 70;
    controls.minPolarAngle = 0.05;
    controls.maxPolarAngle = Math.PI - 0.05;
    controls.enablePan = false;
    controls.autoRotateSpeed = 0.5;

    const onMouseDown = () => {
      if (!isAmbient) canvas.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      if (!isAmbient) canvas.style.cursor = "grab";
    };
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Precomputed tileable noise LUT (replaces per-step 3D simplex noise)
    const noiseTexture = new THREE.DataTexture(
      generateNoiseData(256),
      256,
      256,
      THREE.RGBAFormat
    );
    noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.magFilter = noiseTexture.minFilter = THREE.LinearFilter;
    noiseTexture.generateMipmaps = false;
    noiseTexture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uCamPos: { value: new THREE.Vector3() },
        uCamWorld: { value: new THREE.Matrix4() },
        uTanHalfFov: { value: Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) },
        uTime: { value: 0 },
        uSpin: { value: preset.spin },
        uRin: { value: rIsco },
        uROut: { value: 12 },
        uMaxSteps: { value: 160 },
        uLensing: { value: 1 },
        uDoppler: { value: 1 },
        uMode: { value: 0 },
        uNoise: { value: noiseTexture },
        uSky: { value: null },
        uSkyGain: { value: 5.0 },
        uSkyReady: { value: 0 },
        uCenterOffset: { value: new THREE.Vector2(0, 0) }
      }
    });

    // Real galactic sky panorama (lazy: fetched only when the view opens)
    let skyTexture: THREE.Texture | null = null;
    let disposed = false;
    new THREE.TextureLoader().load("/images/galactic-sky-4k.webp", (tex) => {
      if (disposed) {
        tex.dispose();
        return;
      }
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.magFilter = tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      skyTexture = tex;
      material.uniforms.uSky.value = tex;
      material.uniforms.uSkyReady.value = 1;
    });

    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(quadGeo, material);
    quad.frustumCulled = false;
    const scene = new THREE.Scene();
    scene.add(quad);

    // --- Quality / adaptive resolution ---
    const dprCap = () => Math.min(window.devicePixelRatio || 1, 1.5);
    let config: BlackHoleSimConfig;
    let resScale = 0.55;

    const applyResolution = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width > 0 ? rect.width : window.innerWidth);
      const h = Math.floor(rect.height > 0 ? rect.height : window.innerHeight);
      renderer.setPixelRatio(resScale);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const size = renderer.getDrawingBufferSize(new THREE.Vector2());
      material.uniforms.uRes.value.set(size.x, size.y);
    };

    const applyConfig = (c: BlackHoleSimConfig) => {
      config = c;
      material.uniforms.uLensing.value = c.enableLensing ? 1 : 0;
      material.uniforms.uDoppler.value = c.enableDoppler ? 1 : 0;
      material.uniforms.uMode.value = c.spectralMode === "eht" ? 1 : 0;
      if (isAmbient) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.18;
        resScale = 0.55;
        material.uniforms.uMaxSteps.value = 75;
      } else {
        controls.autoRotate = c.autoRotate;
        controls.autoRotateSpeed = 0.5;
        if (c.quality === "performance") {
          resScale = 0.5;
          material.uniforms.uMaxSteps.value = 100;
        } else if (c.quality === "balanced") {
          resScale = Math.min(dprCap(), 0.8);
          material.uniforms.uMaxSteps.value = 160;
        } else if (c.quality === "ultra") {
          resScale = dprCap();
          material.uniforms.uMaxSteps.value = MAX_STEPS;
        } else {
          resScale = Math.min(dprCap(), 0.85);
          material.uniforms.uMaxSteps.value = 170;
        }
      }
      applyResolution();
    };

    const unsubConfig = blackHoleConfig.subscribe(applyConfig);

    let dynamicAmbientTarget: AmbientCenterTarget | null = null;
    const currentCenterOffset = new THREE.Vector2(0, 0);
    const unsubTarget = ambientCenterTarget.subscribe((t) => {
      dynamicAmbientTarget = t;
    });

    updateAmbientMode = (ambient: boolean) => {
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      if (ambient) {
        if (dynamicAmbientTarget) {
          currentCenterOffset.set(dynamicAmbientTarget.ndcX, dynamicAmbientTarget.ndcY);
        } else {
          currentCenterOffset.set(isDesktop ? 0.35 : 0.0, isDesktop ? -0.05 : 0.15);
        }
        material.uniforms.uCenterOffset.value.copy(currentCenterOffset);
        controls.enabled = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.22;
        resScale = 0.75;
        material.uniforms.uMaxSteps.value = 110;
        canvas.style.pointerEvents = "none";
        canvas.style.cursor = "default";
      } else {
        currentCenterOffset.set(0.0, 0.0);
        material.uniforms.uCenterOffset.value.set(0.0, 0.0);
        controls.enabled = true;
        controls.enableZoom = true;
        controls.enablePan = true;
        canvas.style.pointerEvents = "auto";
        canvas.style.cursor = "grab";
        if (config) {
          applyConfig(config);
        } else {
          resScale = Math.min(dprCap(), 0.85);
          material.uniforms.uMaxSteps.value = 170;
        }
      }
      applyResolution();
    };

    updateAmbientMode(isAmbient);

    const ro = new ResizeObserver(() => applyResolution());
    if (canvas.parentElement) {
      ro.observe(canvas.parentElement);
    }

    // --- Camera preset requests (smooth polar & azimuthal transitions) ---
    let targetPolar: number | null = null;
    let targetAzimuth: number | null = null;
    const unsubCam = blackHoleCameraRequest.subscribe((req) => {
      if (req) {
        targetPolar = THREE.MathUtils.degToRad(req.polarDeg);
        if (req.azimuthDeg !== undefined) {
          targetAzimuth = THREE.MathUtils.degToRad(req.azimuthDeg);
        }
      }
    });
    const sph = new THREE.Spherical();

    // Direction vector towards Earth / Solar System in galactic coordinates (l=180°, b=+0.14°)
    const earthDirection = new THREE.Vector3(-1.0, 0.00244, 0.0).normalize();
    const earthSkyPoint = earthDirection.clone().multiplyScalar(500);

    // --- Animation loop with FPS tracking ---
    const clock = new THREE.Clock();
    let animationId = 0;
    let running = true;
    let frameCount = 0;
    let acc = 0;
    let adaptCooldown = 0;

    const animate = () => {
      if (!running) return;
      animationId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      material.uniforms.uTime.value += dt;

      if (targetPolar !== null || targetAzimuth !== null) {
        sph.setFromVector3(camera.position);
        if (targetPolar !== null) {
          sph.phi += (targetPolar - sph.phi) * 0.08;
          if (Math.abs(targetPolar - sph.phi) < 0.003) targetPolar = null;
        }
        if (targetAzimuth !== null) {
          let diff = (targetAzimuth - sph.theta + Math.PI) % (2 * Math.PI) - Math.PI;
          sph.theta += diff * 0.08;
          if (Math.abs(diff) < 0.003) targetAzimuth = null;
        }
        camera.position.setFromSpherical(sph);
      }

      controls.update();
      camera.updateMatrixWorld();

      // Smooth center offset tracking (ambient aligns to hero element; modal centers to 0,0)
      const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
      if (isAmbient) {
        let tx = isDesktop ? 0.35 : 0.0;
        let ty = isDesktop ? -0.05 : 0.15;
        if (dynamicAmbientTarget) {
          tx = dynamicAmbientTarget.ndcX;
          ty = dynamicAmbientTarget.ndcY;
        }
        currentCenterOffset.x += (tx - currentCenterOffset.x) * 0.1;
        currentCenterOffset.y += (ty - currentCenterOffset.y) * 0.1;
        material.uniforms.uCenterOffset.value.copy(currentCenterOffset);
      } else {
        currentCenterOffset.x += (0.0 - currentCenterOffset.x) * 0.15;
        currentCenterOffset.y += (0.0 - currentCenterOffset.y) * 0.15;
        material.uniforms.uCenterOffset.value.copy(currentCenterOffset);
      }

      material.uniforms.uCamPos.value.copy(camera.position);
      material.uniforms.uCamWorld.value.copy(camera.matrixWorld);
      renderer.render(scene, camera);

      // Earth screen projection (only computed when expanded)
      if (!isAmbient) {
        const pt = earthSkyPoint.clone().project(camera);
        const w = window.innerWidth;
        const h = window.innerHeight;
        const isBehind = pt.z >= 1.0;
        const sx = (pt.x * 0.5 + 0.5) * w;
        const sy = (-pt.y * 0.5 + 0.5) * h;
        const inView = !isBehind && sx >= 30 && sx <= w - 30 && sy >= 30 && sy <= h - 30;
        const dx = isBehind ? -pt.x : pt.x;
        const dy = isBehind ? pt.y : -pt.y;
        const angleRad = Math.atan2(dy, dx);
        earthScreenPosition.set({
          visible: inView,
          x: Math.round(sx),
          y: Math.round(sy),
          angleRad,
          distanceLy: preset.distanceLy
        });
      }

      // Frame-time monitor (only adapts when open in full mode)
      frameCount++;
      acc += dt;
      if (frameCount >= 30) {
        const avg = acc / frameCount;
        frameCount = 0;
        acc = 0;
        if (adaptCooldown > 0) adaptCooldown--;
        if (!isAmbient && config?.quality === "auto" && adaptCooldown === 0) {
          const maxScale = dprCap();
          if (avg > 0.0215 && resScale > 0.4) {
            resScale = Math.max(0.4, resScale * 0.85);
            applyResolution();
            adaptCooldown = 2;
          } else if (avg < 0.0135 && resScale < maxScale) {
            resScale = Math.min(maxScale, resScale * 1.08);
            applyResolution();
            adaptCooldown = 4;
          }
        }
      }
    };

    // FPS display uses a dedicated counter for accuracy
    let fpsFrames = 0;
    const fpsInterval = setInterval(() => {
      blackHoleFps.set(fpsFrames * 2);
      fpsFrames = 0;
    }, 500);
    const origRender = renderer.render.bind(renderer);
    renderer.render = ((s: THREE.Scene, c: THREE.Camera) => {
      fpsFrames++;
      origRender(s, c);
    }) as typeof renderer.render;

    animate();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(animationId);
      } else if (!running) {
        running = true;
        clock.getDelta();
        animate();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onWindowResize = () => {
      if (isAmbient) {
        const isDesktop = window.innerWidth >= 768;
        material.uniforms.uCenterOffset.value.set(isDesktop ? 0.38 : 0.0, isDesktop ? 0.0 : 0.2);
      }
      applyResolution();
    };
    window.addEventListener("resize", onWindowResize);
    window.visualViewport?.addEventListener("resize", onWindowResize);

    return () => {
      disposed = true;
      skyTexture?.dispose();
      running = false;
      cancelAnimationFrame(animationId);
      clearInterval(fpsInterval);
      unsubConfig();
      unsubCam();
      unsubTarget();
      earthScreenPosition.set(null);
      blackHoleFps.set(0);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onWindowResize);
      ro.disconnect();
      controls.dispose();
      quadGeo.dispose();
      material.dispose();
      noiseTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  });
</script>

<canvas bind:this={canvas} class="block w-full h-full"></canvas>
