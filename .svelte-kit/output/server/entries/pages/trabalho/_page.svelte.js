import { G as ensure_array_like, I as head, e as escape_html, J as store_get, K as attr, M as stringify, N as unsubscribe_stores, p as pop, a as push } from "../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../chunks/LanguageSelector.js";
import { _, c as currentLanguage } from "../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let projects = data.projects || [];
  const getLoc = (field, lang) => {
    if (field && typeof field === "object") {
      return field[lang] || field["pt"] || "";
    }
    return field || "";
  };
  const each_array = ensure_array_like(projects);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Projetos &amp; Cases — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Estudos de caso de engenharia de software sênior: Clojure, event-sourcing, trading de baixa latência e infraestrutura distribuída.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold"><a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.about"))}</a> <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.projects"))}</a> <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.blog"))}</a> <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.links"))}</a></nav> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></div></header> <main class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-16"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.title"))}</h1> <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.subtitle"))}</p></div> <div class="grid gap-8 md:grid-cols-2"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let project = each_array[$$index_1];
    const each_array_1 = ensure_array_like(project.stack);
    $$payload.out += `<article class="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-950/60 hover:-translate-y-1 transition duration-300"><div class="p-8 flex-1 flex flex-col justify-between"><div><div class="flex items-center justify-between mb-4"><span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">${escape_html(getLoc(project.role, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</span> <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${escape_html(getLoc(project.status, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</span></div> <h2 class="text-2xl font-bold mb-2"><a${attr("href", `/trabalho/${stringify(project.id)}/`)} class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(getLoc(project.title, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</a></h2> <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">${escape_html(getLoc(project.subtitle, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <p class="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">${escape_html(getLoc(project.excerpt, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p></div> <div><div class="flex flex-wrap gap-1.5 mb-6"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let tech = each_array_1[$$index];
      $$payload.out += `<span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${escape_html(tech)}</span>`;
    }
    $$payload.out += `<!--]--></div> <div class="flex items-center justify-between"><a${attr("href", `/trabalho/${stringify(project.id)}/`)} class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 group">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.readDetailed"))} <span class="group-hover:translate-x-1 transition-transform">→</span></a> `;
    if (project.github) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<a${attr("href", project.github)} target="_blank" rel="noopener noreferrer" class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors font-mono">GitHub</a>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div></div></div></article>`;
  }
  $$payload.out += `<!--]--></div></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
