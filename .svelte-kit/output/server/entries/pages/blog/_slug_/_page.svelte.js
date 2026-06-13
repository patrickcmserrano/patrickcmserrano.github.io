import { G as ensure_array_like, I as head, e as escape_html, p as pop, a as push, K as attr } from "../../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../../chunks/LanguageSelector.js";
import { h as html } from "../../../../chunks/html.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let metadata = data.metadata;
  let html$1 = data.html;
  const each_array = ensure_array_like(metadata.tags);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(metadata.title)} — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description"${attr("content", metadata.excerpt)}>`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></header> <main class="max-w-4xl mx-auto px-4 py-12"><div class="mb-8"><a href="/blog/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"><span class="group-hover:-translate-x-1 transition-transform">←</span> Voltar para todos os artigos</a></div> <header class="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800"><div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono"><span>${escape_html(new Date(metadata.date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }))}</span> <span>•</span> <span>${escape_html(metadata.readTime || "10 min")}</span></div> <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">${escape_html(metadata.title)}</h1> <div class="flex flex-wrap gap-2"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let tag = each_array[$$index];
    $$payload.out += `<span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">${escape_html(tag)}</span>`;
  }
  $$payload.out += `<!--]--></div></header> <article class="prose prose-slate dark:prose-invert max-w-none md:prose-lg prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900/60 prose-pre:border prose-pre:border-slate-800 prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl">${html(html$1)}</article></main></div>`;
  pop();
}
export {
  _page as default
};
