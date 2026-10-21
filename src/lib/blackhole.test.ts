import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { isBlackHoleOpen, openBlackHole, closeBlackHole, toggleBlackHole } from './blackhole';

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
