import * as server from '../entries/pages/blog/_slug_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/blog/_slug_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/blog/[slug]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.N47YPH2z.js","_app/immutable/chunks/Svl938TA.js","_app/immutable/chunks/CDZqk33D.js","_app/immutable/chunks/CS17OKd6.js","_app/immutable/chunks/qPdCPZm6.js","_app/immutable/chunks/Bfm6dQW8.js","_app/immutable/chunks/CFIzEYN2.js","_app/immutable/chunks/C8QQLyTo.js","_app/immutable/chunks/yWgjEqil.js","_app/immutable/chunks/24l9W1Zo.js"];
export const stylesheets = ["_app/immutable/assets/LanguageSelector.BUSG7h5-.css","_app/immutable/assets/5.h9nu_hqt.css"];
export const fonts = [];
