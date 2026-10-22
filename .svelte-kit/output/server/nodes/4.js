import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.C8FPJaql.js","_app/immutable/chunks/CG8Da4oR.js","_app/immutable/chunks/B1hrAqv_.js","_app/immutable/chunks/CDtUdDs1.js","_app/immutable/chunks/B-_EZqkr.js","_app/immutable/chunks/ZimKA25Q.js","_app/immutable/chunks/DVahk35-.js","_app/immutable/chunks/Bi7oO-Tk.js","_app/immutable/chunks/CXXbJXIQ.js","_app/immutable/chunks/BdeMsXEE.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
