import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.0mJsV9BF.js","_app/immutable/chunks/DQ6t7_oL.js","_app/immutable/chunks/BUoQSc5_.js","_app/immutable/chunks/DrkpwwC4.js","_app/immutable/chunks/B_J8hLpb.js","_app/immutable/chunks/DYw1cS00.js","_app/immutable/chunks/6abF-riu.js","_app/immutable/chunks/Bb1kZ67D.js","_app/immutable/chunks/CmsOhWSa.js","_app/immutable/chunks/D-utFv8B.js"];
export const stylesheets = ["_app/immutable/assets/0.CJ-R_XyA.css"];
export const fonts = [];
