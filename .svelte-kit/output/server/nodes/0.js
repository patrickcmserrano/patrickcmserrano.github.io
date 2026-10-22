import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BVGxx8jo.js","_app/immutable/chunks/CG8Da4oR.js","_app/immutable/chunks/B1hrAqv_.js","_app/immutable/chunks/B-_EZqkr.js","_app/immutable/chunks/CDtUdDs1.js","_app/immutable/chunks/DgBziG9B.js","_app/immutable/chunks/ZimKA25Q.js","_app/immutable/chunks/D_VQP_vd.js","_app/immutable/chunks/BdeMsXEE.js"];
export const stylesheets = ["_app/immutable/assets/0.BheLXS-M.css"];
export const fonts = [];
