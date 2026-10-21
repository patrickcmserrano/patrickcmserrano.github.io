

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.YbKGHgA8.js","_app/immutable/chunks/CbS5qVfJ.js","_app/immutable/chunks/BSUlZcGn.js","_app/immutable/chunks/DRp3-z49.js"];
export const stylesheets = [];
export const fonts = [];
