import { w as writable } from "./index2.js";
const isBlackHoleOpen = writable(false);
const activeCelestialTarget = writable("sgr-a");
const isInterstellarTraveling = writable(false);
const interstellarTravelTarget = writable(null);
const SAGITTARIUS_A_PRESET = {
  name: "Sagittarius A*",
  subtitle: "Centro da Via Láctea",
  massSolar: 4154e3,
  distanceLy: 26670,
  spin: 0.9,
  shadowMicroArcsec: 51.8
};
const DEFAULT_SIM_CONFIG = {
  spectralMode: "visible",
  enableLensing: true,
  enableDoppler: true,
  autoRotate: true,
  quality: "auto"
};
const blackHoleConfig = writable({ ...DEFAULT_SIM_CONFIG });
const blackHoleFps = writable(0);
const earthScreenPosition = writable(null);
const blackHoleCameraRequest = writable(null);
function requestCameraView(polarDeg, azimuthDeg) {
  blackHoleCameraRequest.set({ polarDeg, azimuthDeg, nonce: Date.now() });
}
function requestCameraPolar(polarDeg) {
  requestCameraView(polarDeg);
}
function lookAtEarth() {
  requestCameraView(90, 0);
}
function viewFromEarth() {
  requestCameraView(60, 180);
}
function iscoRadius(spin) {
  const a = Math.min(Math.max(spin, 0), 0.998);
  const z1 = 1 + Math.cbrt(1 - a * a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a));
  const z2 = Math.sqrt(3 * a * a + z1 * z1);
  return 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
}
export {
  SAGITTARIUS_A_PRESET as S,
  isBlackHoleOpen as a,
  activeCelestialTarget as b,
  isInterstellarTraveling as c,
  interstellarTravelTarget as d,
  earthScreenPosition as e,
  blackHoleFps as f,
  blackHoleConfig as g,
  iscoRadius as i,
  lookAtEarth as l,
  requestCameraPolar as r,
  viewFromEarth as v
};
