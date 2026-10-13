import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CqX3OhRB.js","_app/immutable/chunks/D0ocI5jb.js","_app/immutable/chunks/BDvX_23_.js","_app/immutable/chunks/DDV6N4i4.js"];
export const stylesheets = ["_app/immutable/assets/0.DRQiva5O.css"];
export const fonts = [];
