import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.vQjyOLbp.js","_app/immutable/chunks/CG8Da4oR.js","_app/immutable/chunks/B1hrAqv_.js","_app/immutable/chunks/B-_EZqkr.js","_app/immutable/chunks/DgBziG9B.js","_app/immutable/chunks/DVahk35-.js","_app/immutable/chunks/CDtUdDs1.js","_app/immutable/chunks/Bi7oO-Tk.js","_app/immutable/chunks/CXXbJXIQ.js","_app/immutable/chunks/BdeMsXEE.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
