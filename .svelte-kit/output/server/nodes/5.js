import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CAaoGp3a.js","_app/immutable/chunks/iCzJ2NVs.js","_app/immutable/chunks/V3BLG7Or.js","_app/immutable/chunks/DaX4IVPF.js","_app/immutable/chunks/CiU5MM20.js","_app/immutable/chunks/BcPExo_7.js","_app/immutable/chunks/iAw-Whe_.js","_app/immutable/chunks/D79LS_Lg.js","_app/immutable/chunks/DBffNa1m.js","_app/immutable/chunks/DGAQqA1E.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
