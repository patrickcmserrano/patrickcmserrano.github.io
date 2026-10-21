import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.DNvMqIta.js","_app/immutable/chunks/iCzJ2NVs.js","_app/immutable/chunks/V3BLG7Or.js","_app/immutable/chunks/iAw-Whe_.js","_app/immutable/chunks/DvY_lK1o.js","_app/immutable/chunks/CSO3W6DB.js","_app/immutable/chunks/D79LS_Lg.js","_app/immutable/chunks/B9D6v-1W.js","_app/immutable/chunks/C_OzqRZX.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/2.BJuxr7AM.css"];
export const fonts = [];
