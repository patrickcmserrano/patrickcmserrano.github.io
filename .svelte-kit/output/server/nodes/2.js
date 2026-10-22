import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.DFm1Vbe8.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/Cl6kk3Vo.js","_app/immutable/chunks/CC7AAxsb.js","_app/immutable/chunks/B9uAXGFw.js","_app/immutable/chunks/4gFcpzg9.js","_app/immutable/chunks/1Zz2lLlO.js","_app/immutable/chunks/jbH6omLi.js","_app/immutable/chunks/Dq2kq0oT.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/2.BJuxr7AM.css"];
export const fonts = [];
