import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BHRBrrce.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/62NR9Uw-.js","_app/immutable/chunks/v-d3LRLB.js","_app/immutable/chunks/Chw1QtdK.js","_app/immutable/chunks/DkmG-4Gm.js","_app/immutable/chunks/DgbgsYpz.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
