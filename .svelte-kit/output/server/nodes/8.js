import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.DPGKDwra.js","_app/immutable/chunks/CDKvGexI.js","_app/immutable/chunks/B3lgn3wS.js","_app/immutable/chunks/CwwSj5oA.js","_app/immutable/chunks/BTIiIcrB.js","_app/immutable/chunks/X0CgvOtC.js","_app/immutable/chunks/C3k9A-CT.js","_app/immutable/chunks/DkmguOu6.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
