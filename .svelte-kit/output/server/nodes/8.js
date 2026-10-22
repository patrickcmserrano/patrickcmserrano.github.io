import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.BQwbgip6.js","_app/immutable/chunks/CG8Da4oR.js","_app/immutable/chunks/B1hrAqv_.js","_app/immutable/chunks/CDtUdDs1.js","_app/immutable/chunks/B-_EZqkr.js","_app/immutable/chunks/DgBziG9B.js","_app/immutable/chunks/DVahk35-.js","_app/immutable/chunks/Bi7oO-Tk.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
