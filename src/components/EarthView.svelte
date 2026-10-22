<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { blackHoleFps, travelToBlackHole } from '../lib/blackhole';

  let {
    showClouds = true,
    showAtmosphere = true,
    showNightLights = true,
    fastDayNightCycle = false,
    showMarkers = true,
    cameraPresetTrigger = null
  } = $props<{
    showClouds?: boolean;
    showAtmosphere?: boolean;
    showNightLights?: boolean;
    fastDayNightCycle?: boolean;
    showMarkers?: boolean;
    cameraPresetTrigger?: { id: string; nonce: number } | null;
  }>();

  let canvas: HTMLCanvasElement;

  interface ScreenPin {
    visible: boolean;
    x: number;
    y: number;
  }

  let brazilPin = $state<ScreenPin>({ visible: false, x: 0, y: 0 });
  let sgrAPin = $state<ScreenPin>({ visible: false, x: 0, y: 0 });

  // Telemetria solar e de fuso horário em tempo real (ou simulado quando fastDayNightCycle=true)
  let utcTimeStr = $state('');
  let brtTimeStr = $state('');
  let brazilSolarPhase = $state('');
  let subsolarCoordsStr = $state('');

  let applyCameraPresetFn: (id: string) => void = () => {};

  $effect(() => {
    if (cameraPresetTrigger) {
      applyCameraPresetFn(cameraPresetTrigger.id);
    }
  });

  /**
   * Converte coordenadas geográficas (latitude, longitude em graus) para coordenadas cartesianas 3D
   * exatamente alinhadas com o mapeamento UV equiretangular do THREE.SphereGeometry:
   * - u = 0.5 (lon = 0°, Greenwich) -> +X
   * - u = 0.25 (lon = -90°, Américas) -> +Z
   * - u = 0.75 (lon = +90°, Ásia) -> -Z
   * - v = 1.0 (lat = +90°, Polo Norte) -> +Y
   */
  function latLonToCartesian(latDeg: number, lonDeg: number, radius: number, target = new THREE.Vector3()): THREE.Vector3 {
    const lat = THREE.MathUtils.degToRad(latDeg);
    const lon = THREE.MathUtils.degToRad(lonDeg);
    const cosLat = Math.cos(lat);
    target.set(
      radius * cosLat * Math.cos(lon),
      radius * Math.sin(lat),
      -radius * cosLat * Math.sin(lon)
    );
    return target;
  }

  /**
   * Calcula a posição astronômica real do Sol (Ponto Subsolar: declinação solar δ e longitude subsolar λ)
   * usando a série de Fourier de Spencer para declinação solar e Equação do Tempo (EoT).
   */
  function computeSubsolarPoint(date: Date): { latDeg: number; lonDeg: number } {
    const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0);
    const diffMs = date.getTime() - startOfYear;
    const dayOfYear = Math.floor(diffMs / 86400000) + 1;
    const utcHours =
      date.getUTCHours() +
      date.getUTCMinutes() / 60 +
      date.getUTCSeconds() / 3600 +
      date.getUTCMilliseconds() / 3600000;

    // Ângulo fracionário do ano (em radianos)
    const gamma = ((2 * Math.PI) / 365.25) * (dayOfYear - 1 + (utcHours - 12) / 24);

    // Equação do Tempo (em minutos)
    const eqTimeMin =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    // Declinação solar (em radianos -> graus)
    const declRad =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const latDeg = THREE.MathUtils.radToDeg(declRad);

    // Longitude subsolar: 12:00 Solar Verdadeiro em Greenwich = 0°; avança 15°/h para oeste
    let lonDeg = -((utcHours + eqTimeMin / 60 - 12) * 15);
    lonDeg = ((((lonDeg + 180) % 360) + 360) % 360) - 180;

    return { latDeg, lonDeg };
  }

  function formatCoord(val: number, posChar: string, negChar: string): string {
    const abs = Math.abs(val).toFixed(1);
    return `${abs}°${val >= 0 ? posChar : negChar}`;
  }

  function getSolarPhaseLabel(sinElevation: number, localHour: number): string {
    const deg = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(sinElevation, -1, 1)));
    if (deg > 6) {
      if (localHour < 12) return '☀️ Manhã (Dia)';
      if (localHour < 16) return '☀️ Tarde (Dia)';
      return '🌤️ Fim de tarde';
    }
    if (deg >= -0.8) return localHour < 12 ? '🌅 Nascer do Sol' : '🌇 Pôr do Sol (Hora Dourada)';
    if (deg >= -6) return '🌆 Crepúsculo Civil';
    if (deg >= -12) return '🌃 Crepúsculo Náutico';
    return '🌙 Noite';
  }

  onMount(() => {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    const EARTH_RADIUS = 5.0;

    // Posiciona a câmera inicialmente focando o Brasil (-22.9°S, -43.1°W) e o Atlântico (onde passa o terminador)
    latLonToCartesian(-18.0, -35.0, 17.5, camera.position);

    canvas.style.touchAction = 'none';
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor = 'grab';

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 7.2;
    controls.maxDistance = 85;
    controls.enablePan = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.2;

    const onMouseDown = () => (canvas.style.cursor = 'grabbing');
    const onMouseUp = () => (canvas.style.cursor = 'grab');
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    let disposed = false;
    const loader = new THREE.TextureLoader();

    function loadPlanetTexture(url: string, repeatX = true): THREE.Texture {
      const tex = loader.load(url, (t) => {
        if (disposed) {
          t.dispose();
          return;
        }
        t.wrapS = repeatX ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
        t.wrapT = THREE.ClampToEdgeWrapping;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        t.needsUpdate = true;
      });
      tex.wrapS = repeatX ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      return tex;
    }

    // --- 1. Fundo Estelar Real (NASA SVS Deep Star Maps 2020) ---
    const skyTex = loadPlanetTexture('/images/galactic-sky-4k.webp', true);
    const skyGeo = new THREE.SphereGeometry(800, 64, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        uSky: { value: skyTex }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uSky;
        varying vec2 vUv;
        void main() {
          vec3 c = texture2D(uSky, vUv).rgb;
          vec3 lin = pow(c, vec3(2.4)) * 5.2;
          lin = 1.0 - exp(-lin * 1.15);
          gl_FragColor = vec4(lin, 1.0);
        }
      `
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // --- 2. Grupo Planetário da Terra (Eixo Polar alinhado em +Y, Declinação Solar real via vetor uSunDir) ---
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Posição solar inicial baseada no horário UTC real
    const initialSubsolar = computeSubsolarPoint(new Date());
    const sunDir = latLonToCartesian(initialSubsolar.latDeg, initialSubsolar.lonDeg, 1.0).normalize();

    // Carregar texturas de alta resolução da Terra
    const dayTex = loadPlanetTexture('/images/earth/earth_day_2k.webp', true);
    const nightTex = loadPlanetTexture('/images/earth/earth_lights_2k.webp', true);
    const cloudsTex = loadPlanetTexture('/images/earth/earth_clouds_1k.webp', true);
    const normalTex = loadPlanetTexture('/images/earth/earth_normal_2k.webp', true);
    const specTex = loadPlanetTexture('/images/earth/earth_specular_2k.webp', true);
    const moonTex = loadPlanetTexture('/images/earth/moon_1k.webp', true);

    // --- 3. Superfície Realista da Terra (Terminador Solar Físico via Extinção de Rayleigh + Luzes Noturnas) ---
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 96);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        uDayMap: { value: dayTex },
        uNightMap: { value: nightTex },
        uCloudsMap: { value: cloudsTex },
        uNormalMap: { value: normalTex },
        uSpecMap: { value: specTex },
        uSunDir: { value: sunDir.clone() },
        uCloudDrift: { value: 0.0 },
        uShowClouds: { value: 1.0 },
        uShowNightLights: { value: 1.0 },
        uShowAtmosphere: { value: 1.0 }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vViewTangentX;
        varying vec3 vViewTangentY;

        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);

          vec3 up = abs(vWorldNormal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
          vViewTangentX = normalize(cross(up, vWorldNormal));
          vViewTangentY = cross(vWorldNormal, vViewTangentX);

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;

        uniform sampler2D uDayMap;
        uniform sampler2D uNightMap;
        uniform sampler2D uCloudsMap;
        uniform sampler2D uNormalMap;
        uniform sampler2D uSpecMap;
        uniform vec3 uSunDir;
        uniform float uCloudDrift;
        uniform float uShowClouds;
        uniform float uShowNightLights;
        uniform float uShowAtmosphere;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vViewTangentX;
        varying vec3 vViewTangentY;

        void main() {
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          // Perturbação topográfica da normal (Andes, Serra do Mar, Himalaia)
          vec3 nSample = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
          vec3 N = normalize(
            vWorldNormal +
            (vViewTangentX * nSample.x + vViewTangentY * nSample.y) * 0.30
          );

          // rawNdotL = sin(elevação solar astronômica local)
          // 0.0 = horizonte geométrico (0°), -0.1045 = crepúsculo civil (-6°), -0.2079 = crepúsculo náutico (-12°)
          float rawNdotL = dot(vWorldNormal, L);
          float NdotL = dot(N, L);

          // Massa óptica atmosférica (Air Mass de Kasten-Young simplificada) para luz solar rasante no terminador
          float sinEl = max(rawNdotL, 0.0);
          float airMass = 1.0 / (sinEl + 0.042);

          // Extinção espectral de Rayleigh + Ozônio (Chappuis): filtra azul/verde no pôr do sol naturalmente,
          // sem criar nenhuma faixa laranja artificial pintada no lado escuro.
          vec3 betaExt = vec3(0.014, 0.039, 0.092);
          vec3 sunTransmittance = exp(-betaExt * max(airMass - 1.0, 0.0));

          // Iluminação difusa suave na penumbra do terminador (de -1.5° a +12° de elevação solar)
          float horizonSoft = smoothstep(-0.026, 0.09, rawNdotL);
          float topoDiffuse = max(NdotL, 0.0) * horizonSoft;

          // Albedo diurno (continentes e oceanos)
          vec3 dayTexColor = pow(texture2D(uDayMap, vUv).rgb, vec3(2.05));
          float specMask = texture2D(uSpecMap, vUv).r;

          // Sombra projetada pelas nuvens sobre o solo (mais longa próximo ao terminador)
          float shadowOffset = mix(0.0028, 0.0012, clamp(sinEl * 3.0, 0.0, 1.0));
          vec2 cloudShadowUv = vec2(vUv.x + uCloudDrift - shadowOffset, vUv.y);
          float cloudDensity = texture2D(uCloudsMap, cloudShadowUv).r * uShowClouds;

          // Luz solar direta (filtrada pela atmosfera no pôr do sol) + luz difusa celeste (azul suave)
          vec3 skyAmbientDay = vec3(0.035, 0.055, 0.095) * smoothstep(-0.08, 0.25, rawNdotL);
          vec3 directSunlight = sunTransmittance * 1.55 * topoDiffuse * (1.0 - 0.38 * cloudDensity);
          vec3 dayColor = dayTexColor * (skyAmbientDay + directSunlight);

          // Penumbra azul-cobalto sutil do Crepúsculo Civil/Náutico (-8° a +3°) por espalhamento estratosférico
          float civilTwilight = smoothstep(-0.14, -0.01, rawNdotL) * (1.0 - smoothstep(-0.01, 0.12, rawNdotL));
          vec3 blueHourScatter = dayTexColor * vec3(0.022, 0.052, 0.125) * civilTwilight * uShowAtmosphere;

          // Reflexo especular solar nos oceanos (avermelhado/dourado próximo ao horizonte pelo sunTransmittance)
          vec3 H = normalize(L + V);
          float specExponent = mix(28.0, 72.0, clamp(sinEl, 0.0, 1.0));
          float specTerm = pow(max(dot(N, H), 0.0), specExponent) * specMask * (1.0 - 0.78 * cloudDensity);
          vec3 oceanGlint = sunTransmittance * vec3(1.0, 0.95, 0.86) * specTerm * 0.72 * smoothstep(-0.01, 0.14, rawNdotL);
          dayColor += oceanGlint;

          // Espalhamento atmosférico Rayleigh na borda do globo (Fresnel)
          float fresnel = pow(1.0 - max(dot(vWorldNormal, V), 0.0), 3.4);
          vec3 limbColor = mix(vec3(0.20, 0.54, 1.0), vec3(0.95, 0.48, 0.18), civilTwilight * 0.65);
          vec3 atmosphereScatter = limbColor * fresnel * smoothstep(-0.16, 0.32, rawNdotL) * 0.68 * uShowAtmosphere;

          // Luzes urbanas noturnas: acendem progressivamente durante o crepúsculo civil/náutico (0° a -9°)
          float nightFactor = 1.0 - smoothstep(-0.15, 0.015, rawNdotL);
          vec3 nightRaw = texture2D(uNightMap, vUv).rgb;
          float cityMask = max(0.0, (nightRaw.r + nightRaw.g) * 0.5 - nightRaw.b * 0.58);
          cityMask = pow(smoothstep(0.015, 0.55, cityMask), 1.25);
          vec3 nightLights = vec3(1.0, 0.76, 0.40) * cityMask * 2.45;

          // Nuvens sobre cidades difundem/atenuam levemente o brilho urbano
          vec2 cloudUv = vec2(vUv.x + uCloudDrift, vUv.y);
          float cloudCover = texture2D(uCloudsMap, cloudUv).r * uShowClouds;
          nightLights *= (1.0 - 0.52 * cloudCover) * uShowNightLights;

          // Luz ambiente noturna sutil (airglow e luar sobre continentes e oceanos)
          vec3 nightAmbient = dayTexColor * vec3(0.014, 0.022, 0.042) * nightFactor;

          vec3 finalSurface = dayColor + blueHourScatter + nightAmbient + nightLights * nightFactor + atmosphereScatter;

          // Correção gamma de saída
          finalSurface = pow(max(finalSurface, vec3(0.0)), vec3(1.0 / 2.05));
          gl_FragColor = vec4(finalSurface, 1.0);
        }
      `
    });

    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // --- 4. Camada Dinâmica de Nuvens (Esfera 1.008x, iluminada pela hora dourada no terminador) ---
    const cloudGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.008, 96, 64);
    const cloudMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uCloudsMap: { value: cloudsTex },
        uSunDir: { value: sunDir.clone() },
        uCloudDrift: { value: 0.0 },
        uVisible: { value: 1.0 }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D uCloudsMap;
        uniform vec3 uSunDir;
        uniform float uCloudDrift;
        uniform float uVisible;

        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {
          if (uVisible < 0.5) discard;
          vec2 uv = vec2(vUv.x + uCloudDrift, vUv.y);
          float density = texture2D(uCloudsMap, uv).r;
          if (density < 0.02) discard;

          // Topo das nuvens (altitude ~8-12km) recebe luz solar até ~2.5° além do terminador de superfície
          float NdotL = dot(vWorldNormal, normalize(uSunDir));
          float sinEl = max(NdotL + 0.03, 0.0);
          float airMass = 1.0 / (sinEl + 0.05);
          vec3 cloudSunTint = exp(-vec3(0.012, 0.036, 0.088) * max(airMass - 1.0, 0.0));

          float dayLit = smoothstep(-0.06, 0.14, NdotL);
          vec3 nightCloudCol = vec3(0.03, 0.045, 0.08);
          vec3 litCloudCol = cloudSunTint * (0.25 + 0.82 * max(NdotL + 0.04, 0.0));
          vec3 cloudCol = mix(nightCloudCol, litCloudCol, dayLit);

          float alpha = smoothstep(0.04, 0.88, density) * (0.16 + 0.72 * dayLit);
          gl_FragColor = vec4(cloudCol, alpha);
        }
      `
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(cloudMesh);

    // --- 5. Halo Atmosférico Rayleigh / Mie (Esfera Externa 1.042x) ---
    const atmosGeo = new THREE.SphereGeometry(EARTH_RADIUS * 1.042, 96, 64);
    const atmosMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uSunDir: { value: sunDir.clone() },
        uVisible: { value: 1.0 }
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3 uSunDir;
        uniform float uVisible;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;

        void main() {
          if (uVisible < 0.5) discard;
          vec3 V = normalize(cameraPosition - vWorldPos);
          vec3 L = normalize(uSunDir);

          float rim = pow(clamp(1.0 + dot(vWorldNormal, V), 0.0, 1.0), 2.5);
          float sunDot = dot(vWorldNormal, L);
          float sunFacing = smoothstep(-0.22, 0.38, sunDot);
          float twilightRim = smoothstep(-0.22, -0.02, sunDot) * (1.0 - smoothstep(-0.02, 0.22, sunDot));

          vec3 rayleighBlue = vec3(0.20, 0.56, 1.0);
          vec3 mieTwilight = vec3(0.95, 0.46, 0.16);
          vec3 col = mix(rayleighBlue, mieTwilight, twilightRim * 0.55);

          float intensity = rim * (0.08 + 0.92 * sunFacing) * 1.08;
          gl_FragColor = vec4(col * intensity, intensity);
        }
      `
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    earthGroup.add(atmosMesh);

    // --- 6. A Lua em Órbita (com textura real de crateras) ---
    const moonGroup = new THREE.Group();
    scene.add(moonGroup);

    const moonGeo = new THREE.SphereGeometry(EARTH_RADIUS * 0.273, 48, 36);
    const moonMat = new THREE.ShaderMaterial({
      uniforms: {
        uMoonMap: { value: moonTex },
        uSunDir: { value: sunDir.clone() }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D uMoonMap;
        uniform vec3 uSunDir;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vec3 tex = texture2D(uMoonMap, vUv).rgb;
          float diff = max(dot(vWorldNormal, normalize(uSunDir)), 0.0);
          vec3 col = tex * (0.025 + 1.15 * pow(diff, 0.85));
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-34, 4.5, -24);
    moonGroup.add(moonMesh);

    // --- 7. Marcador Geográfico: Niterói / Rio de Janeiro (22.90° S, 43.10° W) ---
    const BRAZIL_LAT = -22.9;
    const BRAZIL_LON = -43.1;
    const brazilLocalAnchor = new THREE.Object3D();
    // Raio exato da superfície (EARTH_RADIUS) para zero paralaxe ao dar zoom ou girar em ângulo rasante
    latLonToCartesian(BRAZIL_LAT, BRAZIL_LON, EARTH_RADIUS, brazilLocalAnchor.position);
    earthGroup.add(brazilLocalAnchor);
    const brazilUnitNormal = brazilLocalAnchor.position.clone().normalize();

    // Direção de Sagittarius A* no céu da Terra (no infinito óptico)
    const sgrADir = latLonToCartesian(-29.0, -93.7, 1.0).normalize();
    const sgrASkyPoint = new THREE.Vector3();

    // Presets de câmera
    let targetCamPos: THREE.Vector3 | null = null;
    applyCameraPresetFn = (presetId: string) => {
      if (presetId === 'brazil') {
        const worldPos = new THREE.Vector3();
        brazilLocalAnchor.getWorldPosition(worldPos);
        const dir = worldPos.clone().normalize();
        targetCamPos = dir.multiplyScalar(13.5);
      } else if (presetId === 'terminator') {
        // Posiciona a câmera perpendicular ao vetor solar para enquadrar a linha do terminador (pôr do sol)
        const up = new THREE.Vector3(0, 1, 0);
        const sunsetTerminatorDir = new THREE.Vector3().crossVectors(up, sunDir).normalize();
        targetCamPos = sunsetTerminatorDir.multiplyScalar(16.0).add(new THREE.Vector3(0, -1.5, 0));
      } else if (presetId === 'iss') {
        const dir = camera.position.clone().normalize();
        targetCamPos = dir.multiplyScalar(8.4);
      } else if (presetId === 'night') {
        targetCamPos = sunDir.clone().multiplyScalar(-16.0).add(new THREE.Vector3(0, 2.5, 0));
      } else if (presetId === 'moon') {
        targetCamPos = new THREE.Vector3(-44, 9.5, -12);
      }
    };

    const clock = new THREE.Clock();
    let animationId = 0;
    let fpsFrames = 0;
    let simulatedTimestamp = Date.now();
    let wasFastCycle = false;

    const fpsInterval = setInterval(() => {
      blackHoleFps.set(fpsFrames * 2);
      fpsFrames = 0;
    }, 500);

    const worldPinVec = new THREE.Vector3();

    function updateTelemetryStrings(simDate: Date, subsolar: { latDeg: number; lonDeg: number }) {
      const uh = String(simDate.getUTCHours()).padStart(2, '0');
      const um = String(simDate.getUTCMinutes()).padStart(2, '0');
      utcTimeStr = `${uh}:${um} UTC`;

      // Horário de Brasília / Niterói (UTC-3)
      const brtDate = new Date(simDate.getTime() - 3 * 3600000);
      const bh = String(brtDate.getUTCHours()).padStart(2, '0');
      const bm = String(brtDate.getUTCMinutes()).padStart(2, '0');
      brtTimeStr = `${bh}:${bm} BRT (UTC-3)`;

      const brtHourFloat = brtDate.getUTCHours() + brtDate.getUTCMinutes() / 60;
      const sinElevationBrazil = brazilUnitNormal.dot(sunDir);
      brazilSolarPhase = getSolarPhaseLabel(sinElevationBrazil, brtHourFloat);

      subsolarCoordsStr = `${formatCoord(subsolar.latDeg, 'N', 'S')} ${formatCoord(subsolar.lonDeg, 'E', 'W')}`;
    }

    // Inicializa telemetria imediatamente
    updateTelemetryStrings(new Date(), initialSubsolar);
    let telemetryTimer = 0;

    const animate = () => {
      if (disposed) return;
      animationId = requestAnimationFrame(animate);
      fpsFrames++;

      const dt = Math.min(clock.getDelta(), 0.1);

      // Atualiza toggles reativos
      earthMat.uniforms.uShowClouds.value = showClouds ? 1.0 : 0.0;
      cloudMat.uniforms.uVisible.value = showClouds ? 1.0 : 0.0;
      earthMat.uniforms.uShowAtmosphere.value = showAtmosphere ? 1.0 : 0.0;
      atmosMat.uniforms.uVisible.value = showAtmosphere ? 1.0 : 0.0;
      earthMat.uniforms.uShowNightLights.value = showNightLights ? 1.0 : 0.0;

      // Calcula o tempo astronômico (Tempo Real UTC vs Ciclo Acelerado de 24h)
      if (fastDayNightCycle) {
        if (!wasFastCycle) {
          simulatedTimestamp = Date.now();
          wasFastCycle = true;
        }
        // Avança 1 hora solar por segundo (24h em 24s) para visualizar o terminador varrendo os fusos horários
        simulatedTimestamp += dt * 3600000;
      } else {
        wasFastCycle = false;
        simulatedTimestamp = Date.now();
      }

      const currentSimDate = new Date(simulatedTimestamp);
      const subsolar = computeSubsolarPoint(currentSimDate);
      latLonToCartesian(subsolar.latDeg, subsolar.lonDeg, 1.0, sunDir).normalize();

      earthMat.uniforms.uSunDir.value.copy(sunDir);
      cloudMat.uniforms.uSunDir.value.copy(sunDir);
      atmosMat.uniforms.uSunDir.value.copy(sunDir);
      moonMat.uniforms.uSunDir.value.copy(sunDir);

      telemetryTimer += dt;
      if (telemetryTimer > (fastDayNightCycle ? 0.08 : 1.0)) {
        telemetryTimer = 0;
        updateTelemetryStrings(currentSimDate, subsolar);
      }

      // Deriva atmosférica sutil das nuvens (ventos alísios / jato)
      const driftSpeed = fastDayNightCycle ? 0.012 : 0.00045;
      const drift = (earthMat.uniforms.uCloudDrift.value + dt * driftSpeed) % 1.0;
      earthMat.uniforms.uCloudDrift.value = drift;
      cloudMat.uniforms.uCloudDrift.value = drift;

      // Órbita lenta da Lua
      moonGroup.rotation.y += dt * (fastDayNightCycle ? 0.04 : 0.002);

      if (targetCamPos) {
        camera.position.lerp(targetCamPos, 0.08);
        if (camera.position.distanceTo(targetCamPos) < 0.15) {
          targetCamPos = null;
        }
      }

      controls.update();
      camera.updateMatrixWorld();
      earthGroup.updateMatrixWorld();

      // Mantém a esfera celeste centrada na câmera (infinito óptico real, sem paralaxe no zoom)
      skyMesh.position.copy(camera.position);

      renderer.render(scene, camera);

      // Projeção 2D dos marcadores na tela usando as dimensões reais do canvas
      if (showMarkers) {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;

        // 1. Marcador Niterói / RJ cravado na superfície da Terra
        brazilLocalAnchor.getWorldPosition(worldPinVec);
        const normalToPin = worldPinVec.clone().normalize();
        const pinToCam = camera.position.clone().sub(worldPinVec).normalize();
        // Visível apenas quando o ponto na superfície está voltado para a câmera (sem oclusão pelo horizonte do globo)
        const facingCamera = normalToPin.dot(pinToCam) > 0.08;

        if (facingCamera) {
          const proj = worldPinVec.clone().project(camera);
          const sx = (proj.x * 0.5 + 0.5) * w;
          const sy = (-proj.y * 0.5 + 0.5) * h;
          brazilPin = {
            visible: proj.z < 1.0 && sx > 20 && sx < w - 20 && sy > 20 && sy < h - 20,
            x: sx,
            y: sy
          };
        } else {
          brazilPin = { visible: false, x: 0, y: 0 };
        }

        // 2. Marcador de Sagittarius A* no infinito óptico (relativo à posição da câmera)
        sgrASkyPoint.copy(camera.position).addScaledVector(sgrADir, 500);
        const sgrProj = sgrASkyPoint.project(camera);
        const sgrBehind = sgrProj.z >= 1.0;
        const sgrX = (sgrProj.x * 0.5 + 0.5) * w;
        const sgrY = (-sgrProj.y * 0.5 + 0.5) * h;
        const distFromCenterPx = Math.hypot(sgrX - w * 0.5, sgrY - h * 0.5);
        sgrAPin = {
          visible:
            !sgrBehind &&
            distFromCenterPx > 140 &&
            sgrX > 40 &&
            sgrX < w - 40 &&
            sgrY > 40 &&
            sgrY < h - 40,
          x: sgrX,
          y: sgrY
        };
      }
    };

    animate();

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationId);
      clearInterval(fpsInterval);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      [skyTex, dayTex, nightTex, cloudsTex, normalTex, specTex, moonTex].forEach((t) => t.dispose());
      skyGeo.dispose();
      skyMat.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  });
</script>

<div class="relative w-full h-full pointer-events-auto">
  <canvas bind:this={canvas} class="block w-full h-full pointer-events-auto"></canvas>

  <!-- Indicador de Relógio Solar / Fuso Horário Real no topo inferior ou canto -->
  <div class="absolute top-20 left-4 md:left-6 z-20 pointer-events-none">
    <div class="bg-black/65 backdrop-blur-md border border-cyan-500/25 rounded-xl px-3.5 py-2 text-white shadow-lg flex flex-col gap-0.5">
      <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-cyan-300">
        <span class="w-1.5 h-1.5 rounded-full {fastDayNightCycle ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}"></span>
        <span>{fastDayNightCycle ? 'Terminador Solar • Simulação 24h' : 'Terminador Solar • Tempo Real'}</span>
      </div>
      <div class="text-xs font-mono font-bold text-slate-100 flex items-center gap-2">
        <span>{brtTimeStr}</span>
        <span class="text-slate-500">•</span>
        <span class="text-slate-300">{utcTimeStr}</span>
      </div>
      <div class="text-[10px] font-mono text-slate-400">
        Zênite Solar: <span class="text-cyan-200">{subsolarCoordsStr}</span>
      </div>
    </div>
  </div>

  {#if showMarkers}
    <!-- Marcador de Niterói / Rio de Janeiro cravado na coordenada exata (x, y) da superfície -->
    {#if brazilPin.visible}
      <div
        class="absolute z-20 pointer-events-none"
        style="left: {brazilPin.x}px; top: {brazilPin.y}px;"
      >
        <!-- Ponto verde centralizado exatamente sobre (brazilPin.x, brazilPin.y) sem influência da largura do card -->
        <span class="block w-4 h-4 rounded-full bg-emerald-400/40 animate-ping absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"></span>
        <span class="block w-3 h-3 rounded-full bg-emerald-400 border-2 border-white shadow-lg shadow-emerald-500/60 absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"></span>

        <!-- Card informativo ancorado à direita do ponto central -->
        <div class="absolute left-3.5 top-0 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-400/50 text-white shadow-xl whitespace-nowrap">
          <div class="text-[10px] font-mono font-bold text-emerald-300 flex items-center gap-1.5">
            <span>📍 NITERÓI / RIO DE JANEIRO</span>
            <span class="text-emerald-200/70">22.9°S 43.1°W</span>
          </div>
          <div class="text-[10px] font-mono text-slate-200 flex items-center gap-1.5 mt-0.5">
            <span>{brtTimeStr}</span>
            <span class="text-slate-500">•</span>
            <span class="text-amber-200">{brazilSolarPhase}</span>
          </div>
        </div>
      </div>
    {/if}

    <!-- Marcador de Sagittarius A* no fundo estelar visto da órbita da Terra -->
    {#if sgrAPin.visible}
      <div
        class="absolute z-20 pointer-events-auto"
        style="left: {sgrAPin.x}px; top: {sgrAPin.y}px; transform: translate(-50%, -50%);"
      >
        <div class="flex items-center gap-2.5 bg-black/85 backdrop-blur-md border border-amber-400/50 rounded-2xl px-3.5 py-2 text-white shadow-2xl">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <div class="text-left">
            <div class="text-[10px] font-mono font-bold text-amber-300">
              🕳️ SAGITTARIUS A* (26.670 al)
            </div>
            <div class="text-[10px] text-slate-400">
              Centro da Via Láctea • Constelação de Sagitário
            </div>
          </div>
          <button
            type="button"
            onclick={() => travelToBlackHole()}
            class="ml-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition cursor-pointer shadow-sm"
          >
            🚀 Viajar &rarr;
          </button>
        </div>
      </div>
    {/if}
  {/if}
</div>
