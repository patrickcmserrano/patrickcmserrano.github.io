import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DbMbbWhZ.js","_app/immutable/chunks/CDKvGexI.js","_app/immutable/chunks/B3lgn3wS.js","_app/immutable/chunks/BTIiIcrB.js","_app/immutable/chunks/CwwSj5oA.js","_app/immutable/chunks/X0CgvOtC.js","_app/immutable/chunks/CUal8fXa.js","_app/immutable/chunks/CIQOdlE1.js","_app/immutable/chunks/OoR468cC.js"];
export const stylesheets = ["_app/immutable/assets/0.BfaeRTw-.css"];
export const fonts = [];
