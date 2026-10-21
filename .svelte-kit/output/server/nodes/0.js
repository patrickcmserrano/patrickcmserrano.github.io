import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.B8d7NpAM.js","_app/immutable/chunks/Ds2C_C4C.js","_app/immutable/chunks/Cth8IWtu.js","_app/immutable/chunks/Bk8ePrq6.js","_app/immutable/chunks/DXDvQaei.js","_app/immutable/chunks/Bn2ucrvF.js","_app/immutable/chunks/CsydFEv-.js","_app/immutable/chunks/DmHHOa_J.js","_app/immutable/chunks/BzMWteig.js"];
export const stylesheets = ["_app/immutable/assets/0.Cz9o7Itp.css"];
export const fonts = [];
