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
