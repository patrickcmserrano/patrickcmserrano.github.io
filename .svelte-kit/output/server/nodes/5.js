import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.DBz-r87j.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/DOe593a1.js","_app/immutable/chunks/Chw1QtdK.js","_app/immutable/chunks/CfaDW81l.js","_app/immutable/chunks/62NR9Uw-.js","_app/immutable/chunks/DkmG-4Gm.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
