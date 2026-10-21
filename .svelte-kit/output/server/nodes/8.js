import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BoUFVIFt.js","_app/immutable/chunks/Ds2C_C4C.js","_app/immutable/chunks/Cth8IWtu.js","_app/immutable/chunks/DXDvQaei.js","_app/immutable/chunks/Bk8ePrq6.js","_app/immutable/chunks/Bn2ucrvF.js","_app/immutable/chunks/Bvli4IsL.js","_app/immutable/chunks/B43ez_67.js","_app/immutable/chunks/D6n5nyIO.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
