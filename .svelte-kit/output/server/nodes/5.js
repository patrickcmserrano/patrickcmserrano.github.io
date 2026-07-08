import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.VyyQxrPi.js","_app/immutable/chunks/B3y-Ydai.js","_app/immutable/chunks/8NYM_yIc.js","_app/immutable/chunks/DovrcI9r.js","_app/immutable/chunks/DZLzMABz.js","_app/immutable/chunks/Bp0tb_7k.js","_app/immutable/chunks/CqJe_y2F.js","_app/immutable/chunks/BNHmZo67.js","_app/immutable/chunks/x3pvDTcy.js","_app/immutable/chunks/BGqDDMW_.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
