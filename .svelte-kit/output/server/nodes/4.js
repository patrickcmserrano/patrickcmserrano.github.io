import * as server from '../entries/pages/blog/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.DENTRlFQ.js","_app/immutable/chunks/CDKvGexI.js","_app/immutable/chunks/B3lgn3wS.js","_app/immutable/chunks/CwwSj5oA.js","_app/immutable/chunks/BTIiIcrB.js","_app/immutable/chunks/CUal8fXa.js","_app/immutable/chunks/C3k9A-CT.js","_app/immutable/chunks/DkmguOu6.js","_app/immutable/chunks/BYs9o-yl.js","_app/immutable/chunks/OoR468cC.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css"];
export const fonts = [];
