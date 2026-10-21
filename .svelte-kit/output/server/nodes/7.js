import * as server from '../entries/pages/trabalho/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.Du77dN9E.js","_app/immutable/chunks/iCzJ2NVs.js","_app/immutable/chunks/V3BLG7Or.js","_app/immutable/chunks/iAw-Whe_.js","_app/immutable/chunks/DvY_lK1o.js","_app/immutable/chunks/CSO3W6DB.js","_app/immutable/chunks/D79LS_Lg.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
