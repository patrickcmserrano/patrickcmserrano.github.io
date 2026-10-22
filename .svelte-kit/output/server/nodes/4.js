import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CDmbh0ih.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/Cl6kk3Vo.js","_app/immutable/chunks/CC7AAxsb.js","_app/immutable/chunks/CZ2p5h8o.js","_app/immutable/chunks/4gFcpzg9.js","_app/immutable/chunks/1Zz2lLlO.js","_app/immutable/chunks/jbH6omLi.js","_app/immutable/chunks/Dq2kq0oT.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
