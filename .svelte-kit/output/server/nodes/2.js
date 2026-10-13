import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.kHbsqiP2.js","_app/immutable/chunks/D0ocI5jb.js","_app/immutable/chunks/BDvX_23_.js","_app/immutable/chunks/YZgUWLD8.js","_app/immutable/chunks/CwGKHPnC.js","_app/immutable/chunks/BLrqjx-J.js","_app/immutable/chunks/DOUAEGZ7.js","_app/immutable/chunks/DDV6N4i4.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
