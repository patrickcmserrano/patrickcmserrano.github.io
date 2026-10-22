import { g as ensure_array_like, P as head, e as escape_html, d as store_get, c as attr_class, a as attr, s as stringify, u as unsubscribe_stores, p as pop, b as push } from "../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../chunks/LanguageSelector.js";
import { _, c as currentLanguage } from "../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let companies = data.companies || [];
  let expanded = null;
  const getLoc = (field, lang) => {
    if (field && typeof field === "object") {
      return field[lang] || field["pt"] || "";
    }
    return field || "";
  };
  const each_array = ensure_array_like(companies);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Projetos &amp; Cases — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Estudos de caso de engenharia de software sênior: Clojure, event-sourcing, trading de baixa latência e infraestrutura distribuída.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold"><a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.about"))}</a> <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.projects"))}</a> <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.blog"))}</a> <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.links"))}</a></nav> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></div></header> <main class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-16"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.title"))}</h1> <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.subtitle"))}</p></div> <div class="space-y-6"><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
    let company = each_array[$$index_2];
    const isOpen = expanded === company.id;
    const projects = company.projects || [];
    $$payload.out += `<section${attr_class(`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition duration-300 ${stringify(isOpen ? "shadow-xl dark:shadow-slate-950/60" : "hover:shadow-xl dark:hover:shadow-slate-950/60")}`)}><button type="button" class="w-full text-left p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"${attr("aria-expanded", isOpen)}${attr("aria-controls", `company-panel-${stringify(company.id)}`)}><div class="flex items-start justify-between gap-4"><div class="flex-1"><div class="flex items-center gap-3 flex-wrap mb-4"><span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">${escape_html(getLoc(company.role, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</span> <span class="text-xs font-mono text-slate-500 dark:text-slate-400">${escape_html(getLoc(company.status, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</span></div> <h2 class="text-2xl font-bold mb-2">${escape_html(getLoc(company.name, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</h2> <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">${escape_html(getLoc(company.subtitle, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">${escape_html(getLoc(company.excerpt, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p></div> <span${attr_class(`shrink-0 mt-1 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${stringify(isOpen ? "rotate-180" : "")}`)} aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg></span></div> `;
    if (company.stack && company.stack.length) {
      $$payload.out += "<!--[-->";
      const each_array_1 = ensure_array_like(company.stack);
      $$payload.out += `<div class="flex flex-wrap gap-1.5 mt-5"><!--[-->`;
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let tech = each_array_1[$$index];
        $$payload.out += `<span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${escape_html(tech)}</span>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> <div class="flex items-center gap-2 mt-5 text-sm font-bold text-indigo-600 dark:text-indigo-400">`;
    if (projects.length) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span>${escape_html(isOpen ? store_get($$store_subs ??= {}, "$_", _)("trabalho.hideProjects") : store_get($$store_subs ??= {}, "$_", _)("trabalho.showProjects"))}
                  (${escape_html(projects.length)})</span> <span${attr_class(`transition-transform duration-300 ${stringify(isOpen ? "translate-y-0.5" : "-translate-y-0.5")}`)}>↓</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-slate-400 dark:text-slate-500 font-medium">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.comingSoon"))}</span>`;
    }
    $$payload.out += `<!--]--></div></button> `;
    if (isOpen && projects.length) {
      $$payload.out += "<!--[-->";
      const each_array_2 = ensure_array_like(projects);
      $$payload.out += `<div${attr("id", `company-panel-${stringify(company.id)}`)} class="border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-6 md:p-8"><div class="grid gap-5 md:grid-cols-2"><!--[-->`;
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let project = each_array_2[$$index_1];
        $$payload.out += `<article class="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition duration-300"><h3 class="text-lg font-bold mb-1"><a${attr("href", `/trabalho/${stringify(project.id)}/`)} class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(getLoc(project.title, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</a></h3> <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">${escape_html(getLoc(project.subtitle, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">${escape_html(getLoc(project.excerptShort || project.excerpt, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <a${attr("href", `/trabalho/${stringify(project.id)}/`)} class="mt-5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 group self-start">${escape_html(store_get($$store_subs ??= {}, "$_", _)("trabalho.readDetailed"))} <span class="group-hover:translate-x-1 transition-transform">→</span></a></article>`;
      }
      $$payload.out += `<!--]--></div></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></section>`;
  }
  $$payload.out += `<!--]--></div></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
