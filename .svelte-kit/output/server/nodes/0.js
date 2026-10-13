import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.CxArEky8.js","_app/immutable/chunks/Svl938TA.js","_app/immutable/chunks/CDZqk33D.js","_app/immutable/chunks/24l9W1Zo.js"];
export const stylesheets = ["_app/immutable/assets/0.DRQiva5O.css"];
export const fonts = [];
