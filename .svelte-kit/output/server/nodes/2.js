import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.93dNbHLF.js","_app/immutable/chunks/Ds2C_C4C.js","_app/immutable/chunks/Cth8IWtu.js","_app/immutable/chunks/DXDvQaei.js","_app/immutable/chunks/Bk8ePrq6.js","_app/immutable/chunks/Bvli4IsL.js","_app/immutable/chunks/B43ez_67.js","_app/immutable/chunks/D6n5nyIO.js","_app/immutable/chunks/CfE1SZkg.js","_app/immutable/chunks/BzMWteig.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/2.BJuxr7AM.css"];
export const fonts = [];
