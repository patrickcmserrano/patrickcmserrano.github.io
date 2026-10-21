import { e as escape_html, K as store_get, N as unsubscribe_stores, p as pop, b as push, I as ensure_array_like, O as attr_class, M as stringify, a as attr, J as head } from "../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../chunks/LanguageSelector.js";
import { _ } from "../../../chunks/simple-i18n.js";
import { h as html } from "../../../chunks/html.js";
function AboutHero($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<section class="py-12 md:py-20 text-center"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-8"><span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.hero.title"))}</span></h1> <div class="mb-10 flex justify-center"><div class="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0"><div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 dark:opacity-30"></div> <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl"><img src="/images/profile.jpg" alt="Patrick Campelo Serrano" class="hidden dark:block h-full w-full object-cover"> <img src="/images/profile_light.jpg" alt="Patrick Campelo Serrano" class="block dark:hidden h-full w-full object-cover"></div></div></div> <div class="mx-auto max-w-3xl space-y-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed px-4"><p>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.hero.description1"))}</p> <p>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.hero.description2"))}</p></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Products($$payload, $$props) {
  push();
  var $$store_subs;
  const products = [
    {
      id: "rohana",
      titleKey: "about.products.rohana.title",
      taglineKey: "about.products.rohana.tagline",
      descKey: "about.products.rohana.description",
      badge: "IA & Agentes",
      stack: [
        "Clojure",
        "Pathom 3",
        "Aeron IPC",
        "TurboVec",
        "Qdrant",
        "LGPD by Design"
      ],
      url: "https://patrickcmserrano.github.io/rohana/",
      external: true,
      btnLabelKey: "about.products.viewProject",
      gradient: "from-purple-500/10 via-indigo-500/10 to-blue-500/10 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30",
      borderAccent: "hover:border-purple-500/50 dark:hover:border-purple-400/50"
    },
    {
      id: "nexus",
      titleKey: "about.products.nexus.title",
      taglineKey: "about.products.nexus.tagline",
      descKey: "about.products.nexus.description",
      badge: "Trading Quant & Sistemas",
      stack: [
        "Go",
        "Clojure",
        "XTDB",
        "NATS JetStream",
        "Svelte 5",
        "Wails v2"
      ],
      url: "https://nexus-quantitative.github.io/",
      external: true,
      btnLabelKey: "about.products.viewProject",
      gradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30",
      borderAccent: "hover:border-emerald-500/50 dark:hover:border-emerald-400/50"
    },
    {
      id: "aifactory",
      titleKey: "about.products.aifactory.title",
      taglineKey: "about.products.aifactory.tagline",
      descKey: "about.products.aifactory.description",
      badge: "Infraestrutura & Plataforma Privada",
      stack: [
        "Go",
        "vLLM",
        "Slurm",
        "Keycloak SSO",
        "OpenLDAP",
        "FreeBSD Jails"
      ],
      url: "/trabalho/ai-factory/",
      external: false,
      btnLabelKey: "about.products.viewCase",
      gradient: "from-indigo-500/10 via-sky-500/10 to-violet-500/10 dark:from-indigo-950/30 dark:via-sky-950/30 dark:to-violet-950/30",
      borderAccent: "hover:border-indigo-500/50 dark:hover:border-indigo-400/50"
    }
  ];
  const each_array = ensure_array_like(products);
  $$payload.out += `<section class="py-12 md:py-16"><div class="text-center mb-12"><h2 class="text-3xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.products.title"))}</h2> <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.products.subtitle"))}</p></div> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let product = each_array[$$index_1];
    const each_array_1 = ensure_array_like(product.stack);
    $$payload.out += `<div${attr_class(`group flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden ${stringify(product.borderAccent)}`)}><div${attr_class(`absolute inset-0 bg-gradient-to-br ${stringify(product.gradient)} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none`)}></div> <div class="relative z-10 flex-1"><div class="flex items-center justify-between gap-2 mb-4"><span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">${escape_html(product.badge)}</span></div> <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)(product.titleKey))}</h3> <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">${escape_html(store_get($$store_subs ??= {}, "$_", _)(product.taglineKey))}</p> <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">${escape_html(store_get($$store_subs ??= {}, "$_", _)(product.descKey))}</p></div> <div class="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/80"><div class="flex flex-wrap gap-1.5 mb-6"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let tech = each_array_1[$$index];
      $$payload.out += `<span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">${escape_html(tech)}</span>`;
    }
    $$payload.out += `<!--]--></div> `;
    if (product.external) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<a${attr("href", product.url)} target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm transition duration-200"><span>${escape_html(store_get($$store_subs ??= {}, "$_", _)(product.btnLabelKey))}</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path></svg></a>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<a${attr("href", product.url)} class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm transition duration-200"><span>${escape_html(store_get($$store_subs ??= {}, "$_", _)(product.btnLabelKey))}</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path></svg></a>`;
    }
    $$payload.out += `<!--]--></div></div>`;
  }
  $$payload.out += `<!--]--></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Experience($$payload, $$props) {
  push();
  var $$store_subs;
  const experiences = [
    {
      id: "rohana",
      achievements: [
        "achievement1",
        "achievement2",
        "achievement3",
        "achievement4",
        "achievement5"
      ],
      nodeColor: "bg-purple-500",
      tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      iconColor: "text-purple-500"
    },
    {
      id: "ctni",
      achievements: [
        "achievement1",
        "achievement2",
        "achievement3",
        "achievement4",
        "achievement5"
      ],
      nodeColor: "bg-blue-500",
      tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      iconColor: "text-blue-500"
    },
    {
      id: "nexus",
      achievements: [
        "achievement1",
        "achievement2",
        "achievement3",
        "achievement4"
      ],
      nodeColor: "bg-emerald-500",
      tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      iconColor: "text-emerald-500"
    },
    {
      id: "moleque",
      achievements: [
        "achievement1",
        "achievement2",
        "achievement3",
        "achievement4",
        "achievement5",
        "achievement6",
        "achievement7",
        "achievement8",
        "achievement9",
        "achievement10",
        "achievement11",
        "achievement12"
      ],
      nodeColor: "bg-indigo-500",
      tagColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      iconColor: "text-indigo-500"
    }
  ];
  const each_array = ensure_array_like(experiences);
  $$payload.out += `<section class="py-12 md:py-16"><h2 class="text-3xl font-extrabold tracking-tight mb-16 text-center text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.experience.title"))}</h2> <div class="max-w-4xl mx-auto px-4 relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-auto space-y-16"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let exp = each_array[$$index_1];
    const each_array_1 = ensure_array_like(exp.achievements);
    $$payload.out += `<div class="relative pl-6 md:pl-8"><span${attr_class(`absolute -left-[11px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full ${stringify(exp.nodeColor)} ring-8 ring-slate-50 dark:ring-slate-950`)}><span class="h-2 w-2 rounded-full bg-white"></span></span> <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4"><div><h3 class="text-2xl font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.title`))}</h3> <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">${escape_html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.company`))}</p></div> <span${attr_class(`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${stringify(exp.tagColor)} border self-start md:self-auto`)}>${escape_html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.period`))}</span></div> <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">${escape_html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.description`))}</p> <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80"><h4 class="font-bold text-slate-900 dark:text-white mb-4">${escape_html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.achievements`))}</h4> <ul class="space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base"><!--[-->`;
    for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
      let key = each_array_1[$$index];
      $$payload.out += `<li class="flex items-start gap-3"><svg${attr_class(`w-5 h-5 ${stringify(exp.iconColor)} flex-shrink-0 mt-0.5`)} fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg> <span>${html(store_get($$store_subs ??= {}, "$_", _)(`about.experience.${exp.id}.${key}`))}</span></li>`;
    }
    $$payload.out += `<!--]--></ul></div></div>`;
  }
  $$payload.out += `<!--]--></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Skills($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<section class="py-12 md:py-16"><h2 class="text-3xl font-extrabold tracking-tight mb-12 text-center text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("skills.title"))}</h2> <div class="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 px-4"><div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"><h3 class="text-xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">${escape_html(store_get($$store_subs ??= {}, "$_", _)("skills.languages"))}</h3> <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium"><li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Clojure / ClojureScript</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Java</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> JavaScript / TypeScript</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Golang</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Python</li></ul></div> <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"><h3 class="text-xl font-bold mb-6 text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-3">${escape_html(store_get($$store_subs ??= {}, "$_", _)("skills.frameworks"))}</h3> <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium"><li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Polylith / Reitit / Pathom</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Fulcro / Fulcro-RAD</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> React / React Native</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Reagent / Re-frame</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Svelte / SvelteKit</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Malli / Datomic</li></ul></div> <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"><h3 class="text-xl font-bold mb-6 text-pink-600 dark:text-pink-400 border-b border-slate-100 dark:border-slate-800 pb-3">${escape_html(store_get($$store_subs ??= {}, "$_", _)("skills.cloud"))}</h3> <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium"><li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> AWS / Cognito</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Docker / Kubernetes</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> RabbitMQ / Kafka</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Elastic Stack (ELK)</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> Prometheus / Grafana</li></ul></div> <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"><h3 class="text-xl font-bold mb-6 text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 pb-3">${escape_html(store_get($$store_subs ??= {}, "$_", _)("skills.ai"))}</h3> <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium"><li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LLM Serving (vLLM / Slurm)</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> OpenAI-compatible Routing</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Agentes em Workspaces Isolados</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Context Envelopes / RAG</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Evals de Agentes</li> <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Modelos Locais (Ollama)</li></ul></div></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Education($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<section class="py-12 md:py-16"><h2 class="text-3xl font-extrabold tracking-tight mb-12 text-center text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.title"))}</h2> <div class="mx-auto max-w-3xl px-4 space-y-6"><div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md"><h3 class="text-xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"></path></svg> ${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.academicFormation"))}</h3> <div class="space-y-8"><div class="relative pl-4 border-l-2 border-indigo-500"><h4 class="text-lg font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.softwareEngineering"))}</h4> <p class="text-slate-600 dark:text-slate-400 font-medium">Faculdade Descomplica • 2024 - ${escape_html(store_get($$store_subs ??= {}, "$_", _)("general.present"))}</p></div> <div class="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700"><div class="flex items-center gap-2 flex-wrap"><h4 class="text-lg font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.computerScience"))}</h4> <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.incomplete"))}</span></div> <p class="text-slate-600 dark:text-slate-400 font-medium">Universidade Federal Fluminense • 2022 - 2023</p></div> <div class="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700"><div class="flex items-center gap-2 flex-wrap"><h4 class="text-lg font-bold text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.physics"))}</h4> <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.incomplete"))}</span></div> <p class="text-slate-600 dark:text-slate-400 font-medium mb-1">Universidade Federal Fluminense • 2015 - 2018</p> <p class="text-sm text-slate-500 dark:text-slate-500 italic">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.education.physicsNote"))}</p></div></div></div></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function Contact($$payload, $$props) {
  push();
  var $$store_subs;
  $$payload.out += `<section class="max-w-3xl mx-auto px-4 py-12 md:py-16"><div class="bg-gradient-to-tr from-indigo-600/10 via-purple-600/5 to-pink-600/10 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-pink-950/40 rounded-3xl p-8 md:p-12 border border-slate-200/50 dark:border-slate-800/50 text-center shadow-lg"><h2 class="text-3xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.contact.title"))}</h2> <p class="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-10 text-base md:text-lg">${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.contact.description"))}</p> <div class="flex flex-col sm:flex-row justify-center items-center gap-6"><a href="https://github.com/patrickcmserrano" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold shadow-sm hover:shadow transition duration-200 flex items-center justify-center gap-3" aria-label="GitHub Profile"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.contact.github"))}</span></a> <a href="https://www.linkedin.com/in/patrickcmserrano/" target="_blank" rel="noopener noreferrer" class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold shadow-sm hover:shadow transition duration-200 flex items-center justify-center gap-3" aria-label="LinkedIn Profile"><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.contact.linkedin"))}</span></a> <a href="mailto:patrickcmserrano@protonmail.com" class="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold shadow-sm hover:shadow transition duration-200 flex items-center justify-center gap-3" aria-label="Email Contact"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> <span>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.contact.email"))}</span></a></div></div></section>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>${escape_html(store_get($$store_subs ??= {}, "$_", _)("about.hero.title"))} — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Conheça a trajetória profissional de Patrick Campelo Serrano, engenheiro de software sênior com especialidade em Clojure, sistemas distribuídos e de pagamento.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><a href="/" class="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.backToHome"))}</a> `;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></header> <main class="max-w-5xl mx-auto px-4 py-8 space-y-16">`;
  AboutHero($$payload);
  $$payload.out += `<!----> `;
  Products($$payload);
  $$payload.out += `<!----> `;
  Experience($$payload);
  $$payload.out += `<!----> `;
  Skills($$payload);
  $$payload.out += `<!----> `;
  Education($$payload);
  $$payload.out += `<!----> `;
  Contact($$payload);
  $$payload.out += `<!----></main> <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12"><div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6"><div class="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left"><p>© ${escape_html((/* @__PURE__ */ new Date()).getFullYear())} Patrick Campelo Serrano. ${escape_html(store_get($$store_subs ??= {}, "$_", _)("footer.copyright"))}</p> <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Desenvolvido com SvelteKit SSG &amp; Tailwind CSS (copilotado pelo Gemini 3.5 Flash AGY).</p></div> <div class="flex items-center gap-6"><a href="https://nexus-quantitative.github.io/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Nexus Quant</a> <a href="https://github.com/patrickcmserrano" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a> <a href="https://www.linkedin.com/in/patrickcmserrano/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a> <a href="mailto:patrickcmserrano@protonmail.com" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Contato</a></div></div></footer></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
