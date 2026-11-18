import * as server from '../entries/pages/vagas/estudar/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/vagas/estudar/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/vagas/estudar/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BfBC81jr.js","_app/immutable/chunks/D-IPvz7j.js","_app/immutable/chunks/75qbQp4w.js","_app/immutable/chunks/7FT1lxRY.js","_app/immutable/chunks/rjmOl_Q6.js","_app/immutable/chunks/72NZHo3J.js","_app/immutable/chunks/A-4PkpUJ.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
