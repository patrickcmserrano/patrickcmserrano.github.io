import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CDgkm6gZ.js","_app/immutable/chunks/D0ocI5jb.js","_app/immutable/chunks/BDvX_23_.js","_app/immutable/chunks/YZgUWLD8.js","_app/immutable/chunks/BLrqjx-J.js","_app/immutable/chunks/CwGKHPnC.js","_app/immutable/chunks/DOUAEGZ7.js","_app/immutable/chunks/DDV6N4i4.js","_app/immutable/chunks/D-kR-AC8.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
