import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.CdIQ8d1v.js","_app/immutable/chunks/DQ6t7_oL.js","_app/immutable/chunks/BUoQSc5_.js","_app/immutable/chunks/DrkpwwC4.js","_app/immutable/chunks/DYw1cS00.js","_app/immutable/chunks/DiSvSzm9.js","_app/immutable/chunks/B_J8hLpb.js","_app/immutable/chunks/OtQZ2obG.js","_app/immutable/chunks/DB0_Ff9u.js","_app/immutable/chunks/CmsOhWSa.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
