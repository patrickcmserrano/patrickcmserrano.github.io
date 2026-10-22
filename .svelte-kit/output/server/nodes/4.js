import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.Dsp0pMvU.js","_app/immutable/chunks/DQ6t7_oL.js","_app/immutable/chunks/BUoQSc5_.js","_app/immutable/chunks/B_J8hLpb.js","_app/immutable/chunks/DrkpwwC4.js","_app/immutable/chunks/6abF-riu.js","_app/immutable/chunks/DiSvSzm9.js","_app/immutable/chunks/OtQZ2obG.js","_app/immutable/chunks/DB0_Ff9u.js","_app/immutable/chunks/CmsOhWSa.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
