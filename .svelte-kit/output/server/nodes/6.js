import * as server from '../entries/pages/trabalho/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/+page.server.ts";
export const imports = ["_app/immutable/nodes/6.A40w2puq.js","_app/immutable/chunks/7CCYFUuh.js","_app/immutable/chunks/CaxSk3-1.js","_app/immutable/chunks/CpGxSSwm.js","_app/immutable/chunks/CTs4dAIr.js","_app/immutable/chunks/Bhyub8j3.js","_app/immutable/chunks/Bz7mjz8e.js","_app/immutable/chunks/CELXRBCH.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
