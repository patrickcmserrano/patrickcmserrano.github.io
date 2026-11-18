import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.PBwMyzlR.js","_app/immutable/chunks/D-IPvz7j.js","_app/immutable/chunks/75qbQp4w.js","_app/immutable/chunks/7FT1lxRY.js","_app/immutable/chunks/rjmOl_Q6.js","_app/immutable/chunks/DWMWQyxm.js","_app/immutable/chunks/y5gLvsqo.js","_app/immutable/chunks/72NZHo3J.js","_app/immutable/chunks/A-4PkpUJ.js","_app/immutable/chunks/D96X0rv8.js","_app/immutable/chunks/BYWPLK3p.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
