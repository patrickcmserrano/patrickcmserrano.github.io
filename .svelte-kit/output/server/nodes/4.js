import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.B9PPcap0.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/62NR9Uw-.js","_app/immutable/chunks/rGqlcXUZ.js","_app/immutable/chunks/BnfXsGnl.js","_app/immutable/chunks/DkmG-4Gm.js","_app/immutable/chunks/D5fkQR46.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
