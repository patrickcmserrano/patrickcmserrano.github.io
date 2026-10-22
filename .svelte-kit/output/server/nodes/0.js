import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B7J5ylPR.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/CC7AAxsb.js","_app/immutable/chunks/Cl6kk3Vo.js","_app/immutable/chunks/CHdI2x-h.js","_app/immutable/chunks/CZ2p5h8o.js","_app/immutable/chunks/B9uAXGFw.js","_app/immutable/chunks/Dq2kq0oT.js"];
export const stylesheets = ["_app/immutable/assets/0.C-x9GFGb.css"];
export const fonts = [];
