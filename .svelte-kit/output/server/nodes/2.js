import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.44n1993P.js","_app/immutable/chunks/D-IPvz7j.js","_app/immutable/chunks/75qbQp4w.js","_app/immutable/chunks/7FT1lxRY.js","_app/immutable/chunks/rjmOl_Q6.js","_app/immutable/chunks/ByP8T9Xd.js","_app/immutable/chunks/72NZHo3J.js","_app/immutable/chunks/A-4PkpUJ.js","_app/immutable/chunks/D96X0rv8.js","_app/immutable/chunks/BYWPLK3p.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/2.BJuxr7AM.css"];
export const fonts = [];
