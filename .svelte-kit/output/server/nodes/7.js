import * as server from '../entries/pages/trabalho/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.CRQZL4Vl.js","_app/immutable/chunks/B3y-Ydai.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/DovrcI9r.js","_app/immutable/chunks/BNHmZo67.js","_app/immutable/chunks/DZLzMABz.js","_app/immutable/chunks/Bc4OX4c8.js","_app/immutable/chunks/x3pvDTcy.js","_app/immutable/chunks/DM7Wsq40.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
