

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BEoYjpLp.js","_app/immutable/chunks/CsBtT9We.js","_app/immutable/chunks/BDcDgluY.js","_app/immutable/chunks/SrirpWlt.js"];
export const stylesheets = [];
export const fonts = [];
