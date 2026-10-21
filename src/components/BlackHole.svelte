<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
  import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
  import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

  let { stage = 0 } = $props<{ stage?: number }>();
  let canvas: HTMLCanvasElement;

  onMount(() => {
    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 12);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: "high-performance",
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;

    // Ensure canvas is interactive
    canvas.style.touchAction = "none";
    canvas.style.pointerEvents = "auto";
    canvas.style.cursor = "grab";

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Feedback for grab
    const onMouseDown = () => {
      canvas.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);

    // --- Post Processing (Bloom) ---
    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // Strength
      0.4, // Radius
      0.7  // Threshold
    );

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    // --- Starfield ---
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 150;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0xffffff
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // --- Black Hole Components ---

    // 1. Event Horizon (The Black Sphere) - OPAQUE CORE
    const blackHoleGeo = new THREE.SphereGeometry(2, 64, 64);
    const blackHoleMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const blackHole = new THREE.Mesh(blackHoleGeo, blackHoleMat);
    scene.add(blackHole);

    // 2. Photon Ring
    const photonGeo = new THREE.SphereGeometry(2.1, 64, 64);
    const photonMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - dot(normal, viewDir), 3.0); 
          fresnel = smoothstep(0.3, 0.8, fresnel);
          float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
          gl_FragColor = vec4(1.0, 0.8, 0.4, fresnel * pulse);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const photonRing = new THREE.Mesh(photonGeo, photonMat);
    scene.add(photonRing);

    // 2.5 Secondary Glow for 3D depth
    const glowGeo = new THREE.SphereGeometry(2.3, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float edge = pow(1.0 - abs(vNormal.z), 1.2);
          gl_FragColor = vec4(1.0, 0.5, 0.2, edge * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const outerGlow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(outerGlow);

    // 3. Accretion Disk (Shader Based)
    const diskGeo = new THREE.PlaneGeometry(14, 14, 1, 1);

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i); 
        vec4 p = permute(permute(permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0)) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ * ns.x + ns.yyyy;
        vec4 y = y_ * ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
      }

      void main() {
        vec2 uv = vUv - 0.5;
        float r = length(uv); 
        
        if (r < 0.28) discard; 
        
        float outerGlow = 1.0 - smoothstep(0.4, 0.5, r);
        float innerGlow = smoothstep(0.28, 0.30, r);
        
        float alpha = outerGlow * innerGlow;
        if (alpha < 0.01) discard;

        float angle = atan(uv.y, uv.x);
        float spiralAngle = angle + r * 8.0 + uTime * 0.4;

        float n = snoise(vec3(cos(spiralAngle) * 3.0, sin(spiralAngle) * 3.0, uTime * 0.5 - r * 3.0));
        n += 0.5 * snoise(vec3(cos(spiralAngle) * 10.0, sin(spiralAngle) * 10.0, uTime * 1.0));
        
        float intensity = 0.5 + 0.5 * n;
        
        vec3 colorHot = vec3(2.5, 1.8, 0.8);
        vec3 colorCool = vec3(1.0, 0.25, 0.05); 
        
        float heat = smoothstep(0.5, 0.29, r); 
        heat = clamp(heat + n * 0.3, 0.0, 1.0);
        
        vec3 finalColor = mix(colorCool, colorHot, heat * intensity);
        finalColor *= 1.2 + intensity * 1.5;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const diskMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const disk = new THREE.Mesh(diskGeo, diskMaterial);
    disk.rotation.x = -Math.PI / 2 + 0.2;
    scene.add(disk);

    // --- Animation ---
    const clock = new THREE.Clock();
    let animationId: number;
    let currentDistance = 25;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      diskMaterial.uniforms.uTime.value = elapsedTime;
      photonMat.uniforms.uTime.value = elapsedTime;

      const targetDistance = 25 - (stage * 3.0);
      currentDistance += (targetDistance - currentDistance) * 0.03;
      controls.minDistance = currentDistance;
      controls.maxDistance = currentDistance;

      controls.update();
      composer.render();
    };
    animate();

    const onWindowResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      composer.setSize(width, height);
    };

    window.addEventListener("resize", onWindowResize);
    window.visualViewport?.addEventListener("resize", onWindowResize);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onWindowResize);
      window.visualViewport?.removeEventListener("resize", onWindowResize);
      cancelAnimationFrame(animationId);
      controls.dispose();
      renderer.dispose();
      composer.dispose();
      blackHoleGeo.dispose();
      blackHoleMat.dispose();
      photonGeo.dispose();
      photonMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      diskGeo.dispose();
      diskMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  });
</script>

<canvas bind:this={canvas} class="block w-full h-full"></canvas>
