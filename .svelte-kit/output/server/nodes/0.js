import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.D3IDy6Px.js","_app/immutable/chunks/B3y-Ydai.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/BGqDDMW_.js"];
export const stylesheets = ["_app/immutable/assets/0.beUO2c_C.css"];
export const fonts = [];
