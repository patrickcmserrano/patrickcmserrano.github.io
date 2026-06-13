import { G as ensure_array_like, I as head, e as escape_html, K as attr, J as store_get, O as attr_class, M as stringify, N as unsubscribe_stores, p as pop, a as push } from "../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../chunks/LanguageSelector.js";
import { _ } from "../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let posts = data.posts || [];
  let searchTerm = "";
  let selectedTag = "";
  let allTags = [
    ...new Set(posts.flatMap((p) => p.tags || []))
  ].sort();
  let filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = true;
    return matchesSearch && matchesTag;
  });
  const each_array = ensure_array_like(allTags);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Blog — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Artigos sobre Engenharia de Software, Clojure, Sistemas Event-Driven e Mercado Financeiro.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></header> <main class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-12"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$_", _)("blog.title"))}</h1> <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">${escape_html(store_get($$store_subs ??= {}, "$_", _)("blog.subtitle"))}</p></div> <div class="mb-10 space-y-4"><div class="relative"><input type="text"${attr("placeholder", store_get($$store_subs ??= {}, "$_", _)("blog.searchPlaceholder"))}${attr("value", searchTerm)} class="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"></div> <div class="flex flex-wrap gap-2 pt-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tag = each_array[$$index];
    $$payload.out += `<button${attr_class(`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${stringify(selectedTag === tag ? "bg-indigo-600 text-white shadow-sm" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700")}`)}>${escape_html(tag)}</button>`;
  }
  $$payload.out += `<!--]--></div></div> `;
  if (filteredPosts.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array_1 = ensure_array_like(filteredPosts);
    $$payload.out += `<div class="grid gap-8 md:grid-cols-2"><!--[-->`;
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let post = each_array_1[$$index_2];
      const each_array_2 = ensure_array_like(post.tags);
      $$payload.out += `<article class="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-950/40 hover:-translate-y-1 transition duration-300"><div class="p-6 md:p-8 flex-1 flex flex-col justify-between"><div><div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono"><span>${escape_html(new Date(post.date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }))}</span> <span>•</span> <span>${escape_html(post.readTime || "10 min")}</span></div> <h2 class="text-xl font-bold mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><a${attr("href", `/blog/${stringify(post.id)}/`)}>${escape_html(post.title)}</a></h2> <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">${escape_html(post.excerpt)}</p></div> <div><div class="flex flex-wrap gap-1.5 mb-4"><!--[-->`;
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let tag = each_array_2[$$index_1];
        $$payload.out += `<span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${escape_html(tag)}</span>`;
      }
      $$payload.out += `<!--]--></div> <a${attr("href", `/blog/${stringify(post.id)}/`)} class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 group">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.readArticle"))} <span class="group-hover:translate-x-1 transition-transform">→</span></a></div></div></article>`;
    }
    $$payload.out += `<!--]--></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60"><p class="text-slate-500 dark:text-slate-400 text-lg">${escape_html(store_get($$store_subs ??= {}, "$_", _)("blog.noArticles"))}</p></div>`;
  }
  $$payload.out += `<!--]--></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
