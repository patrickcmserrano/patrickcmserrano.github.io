import { writable } from 'svelte/store';

export const isBlackHoleOpen = writable(false);

export function openBlackHole() {
  isBlackHoleOpen.set(true);
}

export function closeBlackHole() {
  isBlackHoleOpen.set(false);
}

export function toggleBlackHole() {
  isBlackHoleOpen.update((v) => !v);
}

// --- Astrophysical presets and simulation configuration ---

export interface BlackHolePreset {
  id: string;
  name: string;
  subtitle: string;
  /** Mass in solar masses */
  massSolar: number;
  /** Distance in light-years */
  distanceLy: number;
  /** Dimensionless spin a* in [0, 1) */
  spin: number;
  /** Observed shadow angular diameter in microarcseconds */
  shadowMicroArcsec: number;
  /** Reference observer inclination in degrees */
  inclinationDeg: number;
}

export const SAGITTARIUS_A_PRESET: BlackHolePreset = {
  id: 'sgr-a-star',
  name: 'Sagittarius A*',
  subtitle: 'Centro da Via Láctea',
  massSolar: 4.154e6,
  distanceLy: 26670,
  spin: 0.9,
  shadowMicroArcsec: 51.8,
  inclinationDeg: 30
};

export type SpectralMode = 'visible' | 'eht';
export type QualityPreset = 'auto' | 'performance' | 'balanced' | 'ultra';

export interface BlackHoleSimConfig {
  spectralMode: SpectralMode;
  enableLensing: boolean;
  enableDoppler: boolean;
  autoRotate: boolean;
  quality: QualityPreset;
}

export const DEFAULT_SIM_CONFIG: BlackHoleSimConfig = {
  spectralMode: 'visible',
  enableLensing: true,
  enableDoppler: true,
  autoRotate: true,
  quality: 'auto'
};

export const blackHoleConfig = writable<BlackHoleSimConfig>({ ...DEFAULT_SIM_CONFIG });

/** Live FPS reported by the renderer (0 when closed). */
export const blackHoleFps = writable(0);

export interface EarthScreenIndicator {
  visible: boolean;
  x: number;
  y: number;
  angleRad: number;
  distanceLy: number;
}

/** Screen projection of Earth / Solar System in galactic background */
export const earthScreenPosition = writable<EarthScreenIndicator | null>(null);

export interface AmbientCenterTarget {
  /** NDC coordinates in [-1, 1], where (0,0) is center, (-1,-1) bottom-left, (+1,+1) top-right */
  ndcX: number;
  ndcY: number;
}

/** Dynamic ambient center offset for aligning Sagittarius A* with DOM hero elements */
export const ambientCenterTarget = writable<AmbientCenterTarget | null>(null);

export function setAmbientCenterTarget(target: AmbientCenterTarget | null) {
  ambientCenterTarget.set(target);
}

/** Request a camera polar and/or azimuthal angle; `nonce` retriggers the same value. */
export const blackHoleCameraRequest = writable<{ polarDeg: number; azimuthDeg?: number; nonce: number } | null>(null);

export function requestCameraView(polarDeg: number, azimuthDeg?: number) {
  blackHoleCameraRequest.set({ polarDeg, azimuthDeg, nonce: Date.now() });
}

export function requestCameraPolar(polarDeg: number) {
  requestCameraView(polarDeg);
}

/** Align camera looking towards Earth / Solar System (Galactic Anti-Center) */
export function lookAtEarth() {
  requestCameraView(90, 0);
}

/** Align camera to the Event Horizon Telescope (EHT) viewing perspective from Earth (~30° inclination) */
export function viewFromEarth() {
  requestCameraView(60, 180);
}

/**
 * ISCO radius in units of GM/c^2 for a prograde orbit (Bardeen, Press & Teukolsky 1972).
 */
export function iscoRadius(spin: number): number {
  const a = Math.min(Math.max(spin, 0), 0.998);
  const z1 = 1 + Math.cbrt(1 - a * a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a));
  const z2 = Math.sqrt(3 * a * a + z1 * z1);
  return 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
}

/** Schwarzschild radius in km for a given mass in solar masses. */
export function schwarzschildRadiusKm(massSolar: number): number {
  return 2.953250077 * massSolar;
}

/** Approximate critical shadow radius for a non-rotating hole, in units of r_s (~2.598). */
export const SHADOW_RADIUS_RS = (3 * Math.sqrt(3)) / 2;
