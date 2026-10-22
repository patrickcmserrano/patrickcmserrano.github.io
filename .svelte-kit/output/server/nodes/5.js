import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DjBu7RTV.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/Cl6kk3Vo.js","_app/immutable/chunks/ChLTfwa8.js","_app/immutable/chunks/CHdI2x-h.js","_app/immutable/chunks/CZ2p5h8o.js","_app/immutable/chunks/BZLXR9yI.js","_app/immutable/chunks/1Zz2lLlO.js","_app/immutable/chunks/B2amz38e.js","_app/immutable/chunks/BPo8aLwJ.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
