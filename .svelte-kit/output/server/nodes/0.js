import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BcsIBnWN.js","_app/immutable/chunks/D-IPvz7j.js","_app/immutable/chunks/75qbQp4w.js","_app/immutable/chunks/rjmOl_Q6.js","_app/immutable/chunks/7FT1lxRY.js","_app/immutable/chunks/DWMWQyxm.js","_app/immutable/chunks/y5gLvsqo.js","_app/immutable/chunks/ByP8T9Xd.js","_app/immutable/chunks/BYWPLK3p.js"];
export const stylesheets = ["_app/immutable/assets/0.Bo0Uc_tZ.css"];
export const fonts = [];
