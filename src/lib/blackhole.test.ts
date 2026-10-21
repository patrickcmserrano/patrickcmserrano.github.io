import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  isBlackHoleOpen,
  openBlackHole,
  closeBlackHole,
  toggleBlackHole,
  SAGITTARIUS_A_PRESET,
  DEFAULT_SIM_CONFIG,
  iscoRadius,
  schwarzschildRadiusKm,
  SHADOW_RADIUS_RS
} from './blackhole';

describe('Sagittarius A* preset', () => {
  it('has physically valid parameters', () => {
    expect(SAGITTARIUS_A_PRESET.spin).toBeGreaterThanOrEqual(0);
    expect(SAGITTARIUS_A_PRESET.spin).toBeLessThan(1);
    expect(SAGITTARIUS_A_PRESET.massSolar).toBeCloseTo(4.154e6, -3);
  });

  it('computes ISCO: 6 GM/c^2 for a=0 and ~2.32 for a=0.9', () => {
    expect(iscoRadius(0)).toBeCloseTo(6, 5);
    expect(iscoRadius(0.9)).toBeCloseTo(2.32, 2);
  });

  it('computes Schwarzschild radius and shadow ratio', () => {
    expect(schwarzschildRadiusKm(1)).toBeCloseTo(2.953, 2);
    expect(SHADOW_RADIUS_RS).toBeCloseTo(2.598, 3);
  });

  it('has sensible default config', () => {
    expect(DEFAULT_SIM_CONFIG.quality).toBe('auto');
    expect(DEFAULT_SIM_CONFIG.enableLensing).toBe(true);
  });
});

describe('blackhole store', () => {
  beforeEach(() => {
    isBlackHoleOpen.set(false);
  });

  it('initializes as closed', () => {
    expect(get(isBlackHoleOpen)).toBe(false);
  });

  it('opens black hole view', () => {
    openBlackHole();
    expect(get(isBlackHoleOpen)).toBe(true);
  });

  it('closes black hole view', () => {
    openBlackHole();
    expect(get(isBlackHoleOpen)).toBe(true);
    closeBlackHole();
    expect(get(isBlackHoleOpen)).toBe(false);
  });

  it('toggles black hole view', () => {
    toggleBlackHole();
    expect(get(isBlackHoleOpen)).toBe(true);
    toggleBlackHole();
    expect(get(isBlackHoleOpen)).toBe(false);
  });
});
