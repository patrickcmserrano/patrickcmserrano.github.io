/**
 * Shader and helpers for the relativistic black hole ray-marcher.
 *
 * Units: Schwarzschild radius r_s = 1. The spin axis is +Y and the accretion
 * disk lies on the XZ plane. Photons are traced backwards from the camera
 * using the Schwarzschild null-geodesic acceleration
 *   a = -1.5 * h^2 / r^5 * position   (h = |r x v|, constant of motion)
 */

export const MAX_STEPS = 260;

export const vertexShader = /* glsl */ `
  varying vec2 vNdc;
  void main() {
    vNdc = position.xy;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  #define MAX_STEPS ${MAX_STEPS}
  #define TAU 6.28318530718

  uniform vec2 uRes;
  uniform vec3 uCamPos;
  uniform mat4 uCamWorld;
  uniform float uTanHalfFov;
  uniform float uTime;
  uniform float uSpin;
  uniform float uRin;
  uniform float uROut;
  uniform int uMaxSteps;
  uniform float uLensing;
  uniform float uDoppler;
  uniform float uMode; // 0 = visible, 1 = EHT 230 GHz
  uniform sampler2D uNoise;
  uniform sampler2D uSky;
  uniform float uSkyGain;
  uniform float uSkyReady;
  uniform vec2 uCenterOffset;

  varying vec2 vNdc;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Cheap black-body-like palette. k ~ normalized temperature (0..2+).
  vec3 blackbody(float k) {
    vec3 c = mix(vec3(0.85, 0.08, 0.02), vec3(1.0, 0.55, 0.18), smoothstep(0.08, 0.6, k));
    c = mix(c, vec3(1.0, 0.92, 0.78), smoothstep(0.55, 1.1, k));
    c = mix(c, vec3(0.72, 0.85, 1.0), smoothstep(1.1, 2.0, k));
    return c;
  }

  // Real sky: NASA SVS Deep Star Maps 2020 (Gaia/Tycho-2) in galactic coordinates,
  // Sgr A* at the image centre. Scene frame -> galactic: (X,Y,Z) = (x, -z, y),
  // i.e. the disk plane is the galactic plane and the spin axis is galactic north.
  vec3 background(vec3 d) {
    vec3 gal = vec3(d.x, -d.z, d.y);
    float l = atan(gal.y, gal.x);
    float b = asin(clamp(gal.z, -1.0, 1.0));
    vec2 uv = vec2(0.5 - l / TAU, 0.5 + b / 3.14159265);
    vec3 v = texture2D(uSky, uv).rgb;
    return pow(v, vec3(2.5)) * 6.45 * uSkyGain * uSkyReady;
  }

  vec3 shadeDisk(vec3 hit, vec3 vel, out float alpha) {
    float rr = length(hit.xz);
    float phi = atan(hit.z, hit.x);
    float omega = 0.7071 / (pow(rr, 1.5) + 0.25 * uSpin);
    float ang = phi - omega * uTime * 1.6;

    float n = texture2D(uNoise, vec2(ang / TAU * 4.0, log(rr) * 2.0)).r;
    float n2 = texture2D(uNoise, vec2(ang / TAU * 8.0 + 0.37, log(rr) * 4.0 + uTime * 0.02)).r;
    float dens = 0.25 + 1.1 * (0.65 * n + 0.35 * n2);

    // Three magnetic hotspots orbiting at Keplerian speed
    float hs = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float rh = uRin * (1.5 + 0.9 * fi);
      float oh = 0.7071 / (pow(rh, 1.5) + 0.25 * uSpin);
      float pa = fi * 2.1 + 0.6 - oh * uTime * 1.6;
      float dphi = mod(phi - pa + 3.14159265, TAU) - 3.14159265;
      float dr = rr - rh;
      hs += exp(-(dphi * dphi) / 0.06 - (dr * dr) / 0.25);
    }
    dens += 1.4 * hs;

    float temp = pow(uRin / rr, 0.75) * 1.25 * (0.85 + 0.3 * n);
    temp *= 1.0 + 0.5 * hs;
    float inner = smoothstep(uRin, uRin * 1.12, rr);
    float outer = 1.0 - smoothstep(uROut * 0.55, uROut, rr);
    float emis = pow(uRin / rr, 1.8) * dens * inner * outer;

    // Relativistic Doppler beaming + gravitational redshift
    float beta = clamp(sqrt(0.5 / rr), 0.0, 0.75);
    vec3 tang = vec3(-hit.z, 0.0, hit.x) / rr;
    float gamma = 1.0 / sqrt(1.0 - beta * beta);
    float delta = 1.0 / (gamma * (1.0 + beta * dot(tang, vel)));
    float g = mix(1.0, delta * sqrt(max(1.0 - 1.0 / rr, 0.001)), uDoppler);

    float I = emis * pow(g, 3.5) * 7.0;
    alpha = clamp(dens * 0.7, 0.0, 0.92) * inner * outer;

    vec3 c;
    if (uMode > 0.5) {
      // EHT-like 230 GHz synchrotron: monochrome amber
      c = vec3(1.0, 0.42, 0.08) * I * 1.2;
    } else {
      c = blackbody(temp * g) * I;
    }
    return c;
  }

  void main() {
    vec2 p = vNdc - uCenterOffset;
    p.x *= uRes.x / uRes.y;
    vec3 vel = normalize(mat3(uCamWorld) * vec3(p * uTanHalfFov, -1.0));
    vec3 pos = uCamPos;

    vec3 cr = cross(pos, vel);
    float h2 = dot(cr, cr);

    vec3 col = vec3(0.0);
    float trans = 1.0;
    bool escaped = false;

    for (int i = 0; i < MAX_STEPS; i++) {
      if (i >= uMaxSteps) { escaped = true; break; }
      float r = length(pos);
      if (r < 1.0) break; // swallowed by the event horizon
      if (r > 1.5 && dot(pos, vel) > 0.0) { escaped = true; break; }

      float dt = clamp(0.08 * (r - 0.7), 0.03, 1.2);
      vec3 acc = -1.5 * h2 / (r * r * r * r * r) * pos * uLensing;
      vel = normalize(vel + acc * dt);
      vec3 np = pos + vel * dt;

      if (pos.y * np.y < 0.0) {
        float t = pos.y / (pos.y - np.y);
        vec3 hit = mix(pos, np, t);
        float rr = length(hit.xz);
        if (rr > uRin && rr < uROut) {
          float a;
          vec3 c = shadeDisk(hit, vel, a);
          col += trans * c * a;
          trans *= (1.0 - a);
          if (trans < 0.02) break;
        }
      }
      pos = np;
    }

    if (escaped && uMode < 0.5) {
      col += trans * background(vel);
    }

    col = 1.0 - exp(-col * 1.1);
    col = pow(col, vec3(0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * Generates a tileable multi-octave value-noise RGBA texture (R channel used).
 * Runs once on the CPU; the shader then does a single texture fetch instead of
 * evaluating 3D simplex noise per step.
 */
export function generateNoiseData(size = 256): Uint8Array {
  const data = new Uint8Array(size * size * 4);
  const octaves = [
    { cells: 4, weight: 0.5 },
    { cells: 8, weight: 0.28 },
    { cells: 16, weight: 0.14 },
    { cells: 32, weight: 0.08 }
  ];

  const hash = (x: number, y: number, seed: number) => {
    let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };

  const lattices = octaves.map((o, idx) => {
    const l = new Float32Array(o.cells * o.cells);
    for (let y = 0; y < o.cells; y++)
      for (let x = 0; x < o.cells; x++) l[y * o.cells + x] = hash(x, y, idx + 1);
    return l;
  });

  const smooth = (t: number) => t * t * (3 - 2 * t);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0;
      for (let k = 0; k < octaves.length; k++) {
        const c = octaves[k].cells;
        const fx = (x / size) * c;
        const fy = (y / size) * c;
        const x0 = Math.floor(fx);
        const y0 = Math.floor(fy);
        const tx = smooth(fx - x0);
        const ty = smooth(fy - y0);
        const x1 = (x0 + 1) % c;
        const y1 = (y0 + 1) % c;
        const l = lattices[k];
        const a = l[y0 * c + x0];
        const b = l[y0 * c + x1];
        const cc = l[y1 * c + x0];
        const d = l[y1 * c + x1];
        v += octaves[k].weight * (a + (b - a) * tx + (cc - a) * ty + (a - b - cc + d) * tx * ty);
      }
      const byte = Math.max(0, Math.min(255, Math.round(v * 255)));
      const i = (y * size + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = byte;
      data[i + 3] = 255;
    }
  }
  return data;
}
