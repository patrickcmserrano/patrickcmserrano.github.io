import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Cq_Gu-YC.js","_app/immutable/chunks/iCzJ2NVs.js","_app/immutable/chunks/V3BLG7Or.js","_app/immutable/chunks/iAw-Whe_.js","_app/immutable/chunks/DvY_lK1o.js","_app/immutable/chunks/DWTvyFkl.js","_app/immutable/chunks/CSO3W6DB.js","_app/immutable/chunks/D79LS_Lg.js","_app/immutable/chunks/B9D6v-1W.js","_app/immutable/chunks/C_OzqRZX.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
