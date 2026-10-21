import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.C1bkleHq.js","_app/immutable/chunks/iCzJ2NVs.js","_app/immutable/chunks/V3BLG7Or.js","_app/immutable/chunks/DaX4IVPF.js","_app/immutable/chunks/iAw-Whe_.js","_app/immutable/chunks/CiU5MM20.js","_app/immutable/chunks/DWTvyFkl.js","_app/immutable/chunks/D5E_HFBM.js","_app/immutable/chunks/DGAQqA1E.js"];
export const stylesheets = ["_app/immutable/assets/0.ChUKiKwW.css"];
export const fonts = [];
