import * as server from '../entries/pages/trabalho/_page.server.ts.js';

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/+page.server.ts";
export const imports = ["_app/immutable/nodes/7.DQNU5vx2.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/62NR9Uw-.js","_app/immutable/chunks/rGqlcXUZ.js","_app/immutable/chunks/DkmG-4Gm.js","_app/immutable/chunks/D5fkQR46.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
