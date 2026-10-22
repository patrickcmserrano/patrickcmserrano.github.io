import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BN7P7NJa.js","_app/immutable/chunks/DQ6t7_oL.js","_app/immutable/chunks/BUoQSc5_.js","_app/immutable/chunks/B_J8hLpb.js","_app/immutable/chunks/DrkpwwC4.js","_app/immutable/chunks/DYw1cS00.js","_app/immutable/chunks/DiSvSzm9.js","_app/immutable/chunks/OtQZ2obG.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
