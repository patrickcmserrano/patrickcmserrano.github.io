import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Dv-X_Tqc.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/CyYgzumy.js","_app/immutable/chunks/62NR9Uw-.js","_app/immutable/chunks/Chw1QtdK.js","_app/immutable/chunks/BnfXsGnl.js","_app/immutable/chunks/B-MNvMjg.js"];
export const stylesheets = ["_app/immutable/assets/0.CrYJfejB.css"];
export const fonts = [];
