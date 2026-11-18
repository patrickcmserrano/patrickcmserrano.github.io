import * as server from '../entries/pages/vagas/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/vagas/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/vagas/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.21oAHBBJ.js","_app/immutable/chunks/D-IPvz7j.js","_app/immutable/chunks/75qbQp4w.js","_app/immutable/chunks/7FT1lxRY.js","_app/immutable/chunks/rjmOl_Q6.js","_app/immutable/chunks/y5gLvsqo.js","_app/immutable/chunks/72NZHo3J.js","_app/immutable/chunks/A-4PkpUJ.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
