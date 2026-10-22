import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.-JKk89fF.js","_app/immutable/chunks/DQ6t7_oL.js","_app/immutable/chunks/BUoQSc5_.js","_app/immutable/chunks/B_J8hLpb.js","_app/immutable/chunks/DrkpwwC4.js","_app/immutable/chunks/DiSvSzm9.js","_app/immutable/chunks/OtQZ2obG.js","_app/immutable/chunks/DB0_Ff9u.js","_app/immutable/chunks/CmsOhWSa.js","_app/immutable/chunks/D-utFv8B.js","_app/immutable/chunks/Bb1kZ67D.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/2.BJuxr7AM.css"];
export const fonts = [];
