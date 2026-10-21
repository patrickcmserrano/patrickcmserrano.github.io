import { f as ensure_array_like, a as attr, e as escape_html, p as pop, b as push, O as head, d as store_get, s as stringify, u as unsubscribe_stores } from "../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../chunks/LanguageSelector.js";
import { B as BlackHoleToggle } from "../../chunks/BlackHoleToggle.js";
import { _, c as currentLanguage } from "../../chunks/simple-i18n.js";
const generatedAt = "2026-10-14";
const author = "Patrick Serrano";
const repos = [{ "name": "motor-de-pagamentos", "commits": 1426, "forge": "codecommit", "first": "2020-01-07", "last": "2024-11-06", "status": "dormant" }, { "name": "dev-machine", "commits": 394, "forge": "neotek", "first": "2026-07-08", "last": "2026-10-13", "status": "active" }, { "name": "ark-streams", "commits": 351, "forge": "github", "first": "2026-02-18", "last": "2026-07-26", "status": "active" }, { "name": "pinha", "commits": 312, "forge": "neotek", "first": "2026-08-14", "last": "2026-10-13", "status": "active" }, { "name": "TechSentry", "commits": 273, "forge": "github", "first": "2026-04-22", "last": "2026-10-14", "status": "active" }, { "name": "Rohana", "commits": 103, "forge": "github", "first": "2026-06-16", "last": "2026-10-14", "status": "active" }, { "name": "ark-terminal", "commits": 101, "forge": "github", "first": "2026-04-17", "last": "2026-07-11", "status": "active" }, { "name": "small-router", "commits": 101, "forge": "neotek", "first": "2026-08-09", "last": "2026-09-22", "status": "recent" }, { "name": "BitcoinTracker", "commits": 86, "forge": "github", "first": "2025-05-07", "last": "2025-12-19", "status": "dormant" }, { "name": "nexus-quantitative.github.io", "commits": 63, "forge": "github", "first": "2026-01-03", "last": "2026-09-26", "status": "recent" }, { "name": "patrickcmserrano.github.io", "commits": 58, "forge": "github", "first": "2025-05-05", "last": "2026-10-14", "status": "active" }, { "name": "portfolio-blog", "commits": 44, "forge": "github", "first": "2025-03-08", "last": "2026-06-14", "status": "dormant" }, { "name": "weboasis", "commits": 40, "forge": "github", "first": "2025-05-02", "last": "2025-05-03", "status": "dormant" }, { "name": "ark-engine", "commits": 32, "forge": "github", "first": "2025-11-22", "last": "2026-10-13", "status": "active" }, { "name": "resume", "commits": 32, "forge": "github", "first": "2026-03-14", "last": "2026-10-08", "status": "active" }, { "name": "MoneyFlow", "commits": 27, "forge": "github", "first": "2025-05-16", "last": "2025-05-20", "status": "dormant" }, { "name": "zenoh", "commits": 26, "forge": "github", "first": "2026-04-09", "last": "2026-04-09", "status": "dormant" }, { "name": "context-graph-engine", "commits": 24, "forge": "neotek", "first": "2026-08-12", "last": "2026-09-11", "status": "recent" }, { "name": "notify-system", "commits": 23, "forge": "github", "first": "2025-08-01", "last": "2025-08-01", "status": "dormant" }, { "name": "AnilistExplorer", "commits": 22, "forge": "github", "first": "2025-11-16", "last": "2025-12-15", "status": "dormant" }, { "name": "blackhole", "commits": 22, "forge": "github", "first": "2026-01-25", "last": "2026-08-31", "status": "recent" }, { "name": "ark-protocol", "commits": 19, "forge": "github", "first": "2026-02-18", "last": "2026-07-09", "status": "active" }, { "name": "svelte-ts-skeleton-starter", "commits": 19, "forge": "github", "first": "2025-05-02", "last": "2025-05-24", "status": "dormant" }, { "name": "eda", "commits": 17, "forge": "github", "first": "2025-12-17", "last": "2025-12-18", "status": "dormant" }, { "name": "LinkFlowTemplate", "commits": 16, "forge": "github", "first": "2025-05-06", "last": "2025-05-09", "status": "dormant" }, { "name": "ai-senpai", "commits": 15, "forge": "github", "first": "2025-02-16", "last": "2025-02-17", "status": "dormant" }, { "name": "breathing-app", "commits": 12, "forge": "github", "first": "2025-04-30", "last": "2025-05-01", "status": "dormant" }, { "name": "go-gateway", "commits": 12, "forge": "github", "first": "2023-10-17", "last": "2025-02-18", "status": "dormant" }, { "name": "qwen-settings", "commits": 8, "forge": "neotek", "first": "2026-09-04", "last": "2026-09-29", "status": "recent" }, { "name": "bitget-go", "commits": 7, "forge": "github", "first": "2026-03-20", "last": "2026-07-09", "status": "active" }, { "name": "hbo-max-skipper", "commits": 6, "forge": "github", "first": "2026-06-07", "last": "2026-06-07", "status": "dormant" }, { "name": "YogaControl", "commits": 5, "forge": "github", "first": "2026-04-16", "last": "2026-04-16", "status": "dormant" }, { "name": "ark-indicators", "commits": 5, "forge": "github", "first": "2026-04-17", "last": "2026-07-09", "status": "active" }, { "name": "arkite", "commits": 4, "forge": "github", "first": "2025-12-04", "last": "2025-12-15", "status": "dormant" }, { "name": "clj-dialects", "commits": 3, "forge": "github", "first": "2026-06-09", "last": "2026-06-09", "status": "dormant" }, { "name": "FocusTrack", "commits": 2, "forge": "github", "first": "2025-05-24", "last": "2025-05-24", "status": "dormant" }, { "name": "SystemMonitor", "commits": 2, "forge": "github", "first": "2025-05-20", "last": "2025-05-20", "status": "dormant" }, { "name": "pinheirinho", "commits": 2, "forge": "github", "first": "2025-12-15", "last": "2026-02-10", "status": "dormant" }, { "name": "descomplica", "commits": 1, "forge": "github", "first": "2024-08-18", "last": "2024-08-18", "status": "dormant" }, { "name": "issue-harvester", "commits": 1, "forge": "github", "first": "2026-03-11", "last": "2026-03-11", "status": "dormant" }, { "name": "n8n", "commits": 1, "forge": "github", "first": "2025-07-01", "last": "2025-07-01", "status": "dormant" }, { "name": "political-evidence", "commits": 1, "forge": "neotek", "first": "2026-09-27", "last": "2026-09-27", "status": "recent" }, { "name": "reconciler", "commits": 1, "forge": "github", "first": "2026-03-26", "last": "2026-03-26", "status": "dormant" }, { "name": "trading-diary", "commits": 1, "forge": "github", "first": "2025-03-29", "last": "2025-03-29", "status": "dormant" }];
const densidade = {
  generatedAt,
  author,
  repos
};
function DensidadeRepos($$payload, $$props) {
  push();
  let { barHeight = 18, showLast = true } = $$props;
  let showDormant = false;
  const gap = 6;
  const padding = { top: 8, right: 12, bottom: 8, left: 8 };
  const labelFont = 12;
  const monospaceRatio = 0.62;
  const width = 900;
  const labelWidth = Math.max(...densidade.repos.map((r) => r.name.length)) * labelFont * monospaceRatio + 16;
  const valueWidth = 46;
  const trackX = padding.left + labelWidth;
  const trackWidth = width - trackX - valueWidth - padding.right;
  const sorted = [...densidade.repos].sort((a, b) => Number(a.status === "dormant") - Number(b.status === "dormant") || b.commits - a.commits);
  const visible = sorted.filter((r) => r.status !== "dormant");
  const top = visible[0];
  const max = top ? top.commits : 0;
  const height = padding.top + visible.length * (barHeight + gap) - gap + padding.bottom;
  const dormantCount = densidade.repos.filter((r) => r.status === "dormant").length;
  const rows = visible.map((repo, i) => ({
    ...repo,
    y: padding.top + i * (barHeight + gap),
    ratio: max > 0 ? Math.min(repo.commits / max, 1) : 0
  }));
  const statusColor = {
    active: "var(--color-primary-500)",
    recent: "var(--color-primary-300)",
    dormant: "#94a3b8"
  };
  const statusLabel = {
    active: "ativo",
    recent: "recente",
    dormant: "dormente"
  };
  const formatDate = (iso) => iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4);
  const each_array = ensure_array_like(rows);
  $$payload.out += `<figure class="densidade svelte-1v4n9e0"><div class="toolbar svelte-1v4n9e0"><button type="button" class="toggle svelte-1v4n9e0"${attr("aria-pressed", showDormant)}>${escape_html(`Mostrar inativos (${dormantCount})`)}</button></div> <svg${attr("viewBox", `0 0 ${width} ${height}`)} role="img"${attr("aria-label", `Commits por repositório, de ${max} a 1`)} preserveAspectRatio="xMidYMid meet" class="svelte-1v4n9e0"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let row = each_array[$$index];
    $$payload.out += `<g><text${attr("x", trackX - 10)}${attr("y", row.y + barHeight / 2)} text-anchor="end" dominant-baseline="central" class="label svelte-1v4n9e0">${escape_html(row.name)}</text><rect${attr("x", trackX)}${attr("y", row.y)}${attr("width", trackWidth)}${attr("height", barHeight)} rx="3" class="track svelte-1v4n9e0"></rect><rect${attr("x", trackX)}${attr("y", row.y)}${attr("width", Math.max(row.ratio * trackWidth, row.commits > 0 ? 2 : 0))}${attr("height", barHeight)} rx="3"${attr("fill", statusColor[row.status])}><title>${escape_html(row.name)}: ${escape_html(row.commits)} commits (${escape_html(statusLabel[row.status])})</title></rect><text${attr("x", width - padding.right)}${attr("y", row.y + barHeight / 2)} text-anchor="end" dominant-baseline="central" class="value svelte-1v4n9e0">${escape_html(row.commits)}</text>`;
    if (showLast) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<text${attr("x", trackX + trackWidth)}${attr("y", row.y + barHeight / 2)} text-anchor="end" class="meta svelte-1v4n9e0">${escape_html(formatDate(row.last))}</text>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></g>`;
  }
  $$payload.out += `<!--]--></svg> <figcaption class="caption svelte-1v4n9e0">Commits de <strong>${escape_html(densidade.author)}</strong> por repositório, entre
    as três forjas. Contagem absoluta; a barra é proporcional ao maior valor
    (${escape_html(top?.name)}, ${escape_html(max)}). Dados de ${escape_html(formatDate(densidade.generatedAt))}.</figcaption></figure>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let featuredProjects = data.featuredProjects || [];
  let recentPosts = data.recentPosts || [];
  const getLoc = (field, lang) => {
    if (field && typeof field === "object") {
      return field[lang] || field["pt"] || "";
    }
    return field || "";
  };
  const each_array = ensure_array_like(featuredProjects);
  const each_array_2 = ensure_array_like(recentPosts);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Patrick Campelo Serrano — ${escape_html(store_get($$store_subs ??= {}, "$_", _)("app.subtitle") || "Engenharia de Software")}</title>`;
    $$payload2.out += `<meta name="description" content="Engenheiro Clojure/ClojureScript Sênior especialista em sistemas distribuídos, event-driven, quant-trading e arquiteturas minimalistas.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold"><a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.about"))}</a> <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.projects"))}</a> <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.blog"))}</a> <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.links"))}</a></nav> <div class="flex items-center gap-3 md:gap-4">`;
  BlackHoleToggle($$payload);
  $$payload.out += `<!----> `;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></div></header> <section class="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12"><div class="flex-1 space-y-6"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.status"))}</div> <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.hero1"))} <br> <span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.hero2"))}</span></h1> <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.bio"))}</p> <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4"><a href="/trabalho/" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.projectsBtn"))}</a> <a href="/blog/" class="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold transition cursor-pointer text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.blogBtn"))}</a> <a href="/links/" class="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition cursor-pointer text-sm">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.linksBtn"))}</a></div></div> <div class="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0"><div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 dark:opacity-30"></div> <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl"><img src="/images/profile.jpg" alt="Patrick Campelo Serrano" class="hidden dark:block w-full h-full object-cover"> <img src="/images/profile_light.jpg" alt="Patrick Campelo Serrano" class="block dark:hidden w-full h-full object-cover"></div></div></section> <section class="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/10 py-20"><div class="max-w-5xl mx-auto px-4"><div class="flex flex-col md:flex-row md:items-end justify-between mb-12"><div><h2 class="text-3xl font-extrabold tracking-tight mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.featuredProjects"))}</h2> <p class="text-slate-600 dark:text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.projectsSubtitle"))}</p></div> <a href="/trabalho/" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 md:mt-0 inline-flex items-center gap-1 group">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.allProjects"))} <span class="group-hover:translate-x-1 transition-transform">→</span></a></div> <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let project = each_array[$$index_1];
    const each_array_1 = ensure_array_like(project.stack.slice(0, 3));
    $$payload.out += `<div class="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition duration-300"><h3 class="text-xl font-bold mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><a${attr("href", `/trabalho/${stringify(project.id)}/`)}>${escape_html(getLoc(project.title, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</a></h3> <p class="text-xs font-semibold text-slate-500 mb-3">${escape_html(getLoc(project.subtitle, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">${escape_html(getLoc(project.excerpt, store_get($$store_subs ??= {}, "$currentLanguage", currentLanguage)))}</p> <div class="flex flex-wrap gap-1 mb-4"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let tech = each_array_1[$$index];
      $$payload.out += `<span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${escape_html(tech)}</span>`;
    }
    $$payload.out += `<!--]--> `;
    if (project.stack.length > 3) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">+${escape_html(project.stack.length - 3)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <a${attr("href", `/trabalho/${stringify(project.id)}/`)} class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.exploreCase"))} →</a></div>`;
  }
  $$payload.out += `<!--]--></div></div></section> <section class="border-t border-slate-200 dark:border-slate-800 py-20"><div class="max-w-5xl mx-auto px-4"><div class="flex flex-col md:flex-row md:items-end justify-between mb-12"><div><h2 class="text-3xl font-extrabold tracking-tight mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.recentArticles"))}</h2> <p class="text-slate-600 dark:text-slate-400">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.articlesSubtitle"))}</p></div> <a href="/blog/" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 md:mt-0 inline-flex items-center gap-1 group">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.allArticles"))} <span class="group-hover:translate-x-1 transition-transform">→</span></a></div> <div class="space-y-6"><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let post = each_array_2[$$index_2];
    $$payload.out += `<article class="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 gap-4"><div><div class="flex items-center gap-3 text-xs text-slate-500 mb-2 font-mono"><span>${escape_html(new Date(post.date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    }))}</span> <span>•</span> <span>${escape_html(post.readTime)}</span></div> <h3 class="text-lg font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><a${attr("href", `/blog/${stringify(post.id)}/`)}>${escape_html(post.title)}</a></h3> <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">${escape_html(post.excerpt)}</p></div> <a${attr("href", `/blog/${stringify(post.id)}/`)} class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.readArticle"))} →</a></article>`;
  }
  $$payload.out += `<!--]--></div></div></section> <section class="border-t border-slate-200 dark:border-slate-800 py-20"><div class="max-w-5xl mx-auto px-4"><h2 class="text-3xl font-extrabold tracking-tight mb-2">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.density.title"))}</h2> <p class="text-slate-600 dark:text-slate-400 mb-10">${escape_html(store_get($$store_subs ??= {}, "$_", _)("home.density.subtitle"))}</p> `;
  DensidadeRepos($$payload, {});
  $$payload.out += `<!----></div></section> <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12"><div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6"><div class="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left"><p>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Patrick Campelo Serrano. ${escape_html(store_get($$store_subs ??= {}, "$_", _)("footer.copyright"))}</p> <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Desenvolvido com SvelteKit SSG &amp; Tailwind CSS (copilotado pelo Gemini 3.5 Flash AGY).</p></div> <div class="flex items-center gap-6"><a href="https://nexus-quantitative.github.io/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Nexus Quant</a> <a href="https://github.com/patrickcmserrano" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a> <a href="https://www.linkedin.com/in/patrickcmserrano/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a> <a href="mailto:patrickcmserrano@gmail.com" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Contato</a></div></div></footer></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
