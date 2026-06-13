import { G as ensure_array_like, I as head, e as escape_html, J as store_get, K as attr, N as unsubscribe_stores, p as pop, a as push } from "../../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../../chunks/LanguageSelector.js";
import { _ } from "../../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let project = data.project;
  const each_array = ensure_array_like(project.stack);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(project.title)} — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description"${attr("content", project.excerpt)}>`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></header> <main class="max-w-4xl mx-auto px-4 py-12"><div class="mb-8"><a href="/trabalho/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"><span class="group-hover:-translate-x-1 transition-transform">←</span> ${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.backToProjects"))}</a></div> <header class="mb-12 pb-8 border-b border-slate-200 dark:border-slate-800"><div class="flex items-center justify-between mb-4"><span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">${escape_html(project.role)}</span> <span class="text-sm font-mono text-slate-500 dark:text-slate-400">${escape_html(project.status)}</span></div> <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">${escape_html(project.title)}</h1> <p class="text-xl text-slate-600 dark:text-slate-400 font-semibold mb-6">${escape_html(project.subtitle)}</p> <div class="flex flex-wrap gap-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tech = each_array[$$index];
    $$payload.out += `<span class="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">${escape_html(tech)}</span>`;
  }
  $$payload.out += `<!--]--></div></header> <div class="space-y-12"><section><h2 class="text-2xl font-bold mb-4 tracking-tight border-l-4 border-indigo-500 pl-4">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.overview"))}</h2> <p class="text-lg leading-relaxed text-slate-700 dark:text-slate-300">${escape_html(project.details)}</p></section> <section class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm"><h2 class="text-2xl font-bold mb-4 tracking-tight text-indigo-600 dark:text-indigo-400">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.architecture"))}</h2> <p class="text-base leading-relaxed text-slate-600 dark:text-slate-400">${escape_html(project.architecture)}</p></section> `;
  if (project.url) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<section class="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800"><div><h3 class="font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.demo"))}</h3> <p class="text-sm text-slate-500">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.demoDesc"))}</p></div> <a${attr("href", project.url)} target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.demoBtn"))}</a></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (project.github) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<section class="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800"><div><h3 class="font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.source"))}</h3> <p class="text-sm text-slate-500">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.githubDesc"))}</p></div> <a${attr("href", project.github)} target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold transition text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", _)("project.githubBtn"))}</a></section>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
