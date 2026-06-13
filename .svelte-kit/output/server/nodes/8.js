import * as server from '../entries/pages/trabalho/_slug_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/trabalho/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/trabalho/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.kMQxfJR9.js","_app/immutable/chunks/B3y-Ydai.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/DovrcI9r.js","_app/immutable/chunks/BNHmZo67.js","_app/immutable/chunks/DZLzMABz.js","_app/immutable/chunks/Ce0M5d37.js","_app/immutable/chunks/x3pvDTcy.js","_app/immutable/chunks/BGqDDMW_.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
