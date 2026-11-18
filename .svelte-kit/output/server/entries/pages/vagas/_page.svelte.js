import { g as ensure_array_like, P as head, e as escape_html, d as store_get, c as attr_class, a as attr, s as stringify, f as attr_style, u as unsubscribe_stores, p as pop, b as push } from "../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../chunks/LanguageSelector.js";
import { _ } from "../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let vagas = data.vagas || [];
  let gerado = data.gerado || "";
  let busca = "";
  let modo = "todas";
  let semLacuna = false;
  let aberta = null;
  let lacunaFoco = null;
  const MODES = ["todas", "Remoto", "Híbrido", "Presencial"];
  let filtradas = vagas.filter((v) => {
    if (busca.trim()) {
      const q = busca.toLowerCase();
      const alvo = `${v.title} ${v.company} ${v.covers.join(" ")} ${(v.asks || []).join(" ")}`.toLowerCase();
      if (!alvo.includes(q)) return false;
    }
    return true;
  });
  const LIMITE = 25;
  let visiveis = filtradas.slice(0, LIMITE);
  const cor = (sen) => sen === "sênior+" ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40" : sen === "pleno" ? "text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40" : sen === "estágio/júnior" ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40" : "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60";
  let lacunas = (() => {
    const cont = {};
    for (const v of vagas) for (const a of v.asks || []) cont[a] = (cont[a] || 0) + 1;
    return Object.entries(cont).map(([req, n]) => ({ req, n })).sort((a, b) => b.n - a.n);
  })();
  let maxLacuna = lacunas.length ? lacunas[0].n : 1;
  let nuvem = (() => {
    const n = vagas.filter((v) => (v.asks || []).some((a) => ["AWS", "Azure", "GCP"].includes(a))).length;
    const varias = vagas.filter((v) => (v.asks || []).filter((a) => ["AWS", "Azure", "GCP"].includes(a)).length >= 2).length;
    return {
      n,
      varias,
      pct: vagas.length ? Math.round(n * 100 / vagas.length) : 0
    };
  })();
  let semLacunaCount = vagas.filter((v) => !v.asks || v.asks.length === 0).length;
  const each_array = ensure_array_like(lacunas);
  const each_array_1 = ensure_array_like(MODES);
  const each_array_2 = ensure_array_like(visiveis);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Vagas de IA no Brasil — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Catálogo auditado de vagas de IA no Brasil: o que cada anúncio realmente pede, com o trecho literal do requisito e a comparação com o meu perfil.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold"><a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.about"))}</a> <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.projects"))}</a> <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.blog"))}</a> <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.links"))}</a></nav> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></div></header> <main class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-10"><h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Vagas de IA no Brasil</h1> <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">${escape_html(vagas.length)} anúncios de IA aplicada, lidos por dentro. Cada requisito vem com o <strong>trecho literal do anúncio</strong> que o comprova — para você conferir, não confiar.</p> <p class="text-sm text-slate-500 dark:text-slate-500 mt-2">Coleta de ${escape_html(gerado)} · Gupy, InfoJobs, Vagas.com, Programathor · classificados por título e descrição</p></div> <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 mb-8"><div class="flex flex-wrap gap-x-8 gap-y-3 text-sm"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> <span class="text-slate-700 dark:text-slate-300"><strong>Cobre</strong> — o anúncio pede algo que já entreguei em produção</span></div> <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> <span class="text-slate-700 dark:text-slate-300"><strong>Pede</strong> — requisito citado onde minha evidência é mais fraca</span></div></div> <p class="text-xs text-slate-500 dark:text-slate-500 mt-3">O veredito compara o texto do anúncio com o que construí: agentes e orquestração, RAG com busca
        vetorial, LLM servido em produção, observabilidade, evals, SSO federado, on-prem. Onde eu não tenho
        evidência direta, digo <em>pede</em> em vez de fingir cobertura.</p></div> <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8"><div class="flex flex-wrap items-baseline justify-between gap-2 mb-1"><h2 class="text-lg font-bold tracking-tight">Onde estão as lacunas</h2> <span class="text-xs text-slate-500 dark:text-slate-400">${escape_html(vagas.length)} vagas analisadas · ${escape_html(semLacunaCount)} não pedem nada fora do meu perfil</span></div> <p class="text-sm text-slate-600 dark:text-slate-400 mb-5"><strong>${escape_html(nuvem.n)} das ${escape_html(vagas.length)} vagas pedem nuvem gerenciada</strong> (AWS, Azure ou GCP) —
        ${escape_html(nuvem.pct)}% do total. E <strong>${escape_html(nuvem.varias)} delas listam duas ou três</strong>: o anúncio
        escreve a stack inteira, não a nuvem que usa. Na prática, <strong>são 5 lacunas, e 3 são a
        mesma</strong>: cloud.</p> <div class="space-y-2.5"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let l = each_array[$$index];
    const largura = Math.round(l.n * 100 / maxLacuna);
    const ativa = lacunaFoco === l.req;
    $$payload.out += `<button type="button"${attr_class(`w-full text-left group rounded-lg px-2 py-1 -mx-2 transition-colors ${stringify(ativa ? "bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-300/60 dark:ring-amber-800/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/50")}`)}${attr("title", `Clique para ver as vagas que pedem ${stringify(l.req)}`)}><div class="flex items-center justify-between text-sm mb-1"><span${attr_class(`font-semibold ${stringify(["AWS", "Azure", "GCP"].includes(l.req) ? "text-amber-700 dark:text-amber-500" : "text-slate-700 dark:text-slate-300")}`)}>${escape_html(l.req)} `;
    if (["AWS", "Azure", "GCP"].includes(l.req)) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-amber-600/80 dark:text-amber-600">nuvem</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (ativa) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="ml-2 text-[10px] font-normal text-amber-700 dark:text-amber-500">filtrado ✓</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></span> <span class="tabular-nums text-slate-500 dark:text-slate-400">${escape_html(l.n)} <span class="text-xs">vagas</span></span></div> <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div${attr_class(`h-full rounded-full ${stringify(["AWS", "Azure", "GCP"].includes(l.req) ? "bg-amber-500" : "bg-slate-400 dark:bg-slate-500")}`)}${attr_style(`width: ${stringify(largura)}%`)}></div></div></button>`;
  }
  $$payload.out += `<!--]--></div> <p class="text-xs text-slate-500 dark:text-slate-500 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">Clique numa lacuna para filtrar as vagas que a pedem. <strong>LangChain/LangGraph é a mais barata de
        fechar</strong> (biblioteca Python, e Python eu já uso); <strong>AWS</strong> dá o melhor retorno porque
        destrava as vagas de maior aderência. <strong>Java/Kotlin não conta</strong> — aparece em 1 vaga, como
        alternativa a TypeScript.</p> <a href="/vagas/estudar/" class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">O que estudar para fechar essas lacunas — a trilha derivada destes mesmos dados <span aria-hidden="true">→</span></a></section> <div class="flex flex-wrap items-center gap-3 mb-8"><input type="search"${attr("value", busca)} placeholder="Filtrar por cargo, empresa ou requisito…" class="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"> <div class="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-sm"><!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let m = each_array_1[$$index_1];
    $$payload.out += `<button type="button"${attr_class(`px-3.5 py-2.5 font-medium transition-colors ${stringify(modo === m ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}`)}>${escape_html(m === "todas" ? "Todos" : m)}</button>`;
  }
  $$payload.out += `<!--]--></div> <label class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm cursor-pointer select-none"><input type="checkbox"${attr("checked", semLacuna, true)} class="accent-indigo-600"> <span class="text-slate-600 dark:text-slate-400">Só sem lacuna</span></label> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <p class="text-sm text-slate-500 dark:text-slate-500 mb-4">${escape_html(filtradas.length)} ${escape_html(filtradas.length === 1 ? "vaga" : "vagas")} `;
  if (filtradas.length > LIMITE) {
    $$payload.out += "<!--[-->";
    $$payload.out += `· mostrando as 25 melhores`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></p> <div class="space-y-3"><!--[-->`;
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    let v = each_array_2[i];
    const isOpen = aberta === i;
    const each_array_3 = ensure_array_like(v.covers.slice(0, 5));
    $$payload.out += `<article${attr_class(`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition duration-200 ${stringify(isOpen ? "shadow-lg dark:shadow-slate-950/60" : "hover:shadow-md dark:hover:shadow-slate-950/40")}`)}><button type="button" class="w-full text-left p-5"><div class="flex items-start justify-between gap-4"><div class="min-w-0 flex-1"><h2 class="font-bold text-base md:text-lg leading-snug mb-1">${escape_html(v.title)}</h2> <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">`;
    if (v.company) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="font-medium text-slate-700 dark:text-slate-300">${escape_html(v.company)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (v.city) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span>· ${escape_html(v.city)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (v.mode) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span>· ${escape_html(v.mode)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-wrap gap-1.5 mt-3"><!--[-->`;
    for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
      let c = each_array_3[$$index_2];
      $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">${escape_html(c)}</span>`;
    }
    $$payload.out += `<!--]--> `;
    if (v.covers.length > 5) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-xs px-2 py-0.5 text-slate-500">+${escape_html(v.covers.length - 5)}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> `;
    if (v.asks && v.asks.length) {
      $$payload.out += "<!--[-->";
      const each_array_4 = ensure_array_like(v.asks.slice(0, 4));
      $$payload.out += `<div class="flex flex-wrap items-center gap-1.5 mt-1.5"><span class="text-[11px] uppercase tracking-wide text-amber-700/80 dark:text-amber-600/90 font-semibold">Pede</span> <!--[-->`;
      for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
        let a = each_array_4[$$index_3];
        $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 font-medium">${escape_html(a)}</span>`;
      }
      $$payload.out += `<!--]--> `;
      if (v.asks.length > 4) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<span class="text-xs px-2 py-0.5 text-amber-600/70 dark:text-amber-600">+${escape_html(v.asks.length - 4)}</span>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<div class="mt-1.5"><span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-medium">sem lacuna no anúncio</span></div>`;
    }
    $$payload.out += `<!--]--></div> <div class="flex flex-col items-end gap-2 shrink-0">`;
    if (v.asks && v.asks.length) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md font-bold tabular-nums bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300"${attr("title", `${stringify(v.asks.length)} requisito(s) fora do meu perfil`)}>${escape_html(v.asks.length)} lacuna${escape_html(v.asks.length > 1 ? "s" : "")}</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">0</span>`;
    }
    $$payload.out += `<!--]--> <span${attr_class(`text-xs px-2 py-0.5 rounded-md font-semibold ${stringify(cor(v.seniority))}`)}>${escape_html(v.seniority)}</span> <span${attr_class(`text-slate-400 text-lg leading-none transition-transform ${stringify(isOpen ? "rotate-180" : "")}`)}>⌄</span></div></div></button> `;
    if (isOpen) {
      $$payload.out += "<!--[-->";
      const each_array_6 = ensure_array_like(Object.entries(v.evidence));
      $$payload.out += `<div class="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-5">`;
      if (v.asks && v.asks.length) {
        $$payload.out += "<!--[-->";
        const each_array_5 = ensure_array_like(v.asks);
        $$payload.out += `<div class="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40"><p class="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-500 mb-2">Pede — evidência mais fraca no meu perfil</p> <div class="flex flex-wrap gap-1.5"><!--[-->`;
        for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
          let a = each_array_5[$$index_4];
          $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">${escape_html(a)}</span>`;
        }
        $$payload.out += `<!--]--></div></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">O que o anúncio pede, no texto dele</p> <div class="space-y-3"><!--[-->`;
      for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
        let [req, trecho] = each_array_6[$$index_5];
        $$payload.out += `<div class="border-l-2 border-slate-200 dark:border-slate-700 pl-3"><p${attr_class(`text-sm font-semibold ${stringify(v.covers.includes(req) ? "text-emerald-700 dark:text-emerald-400" : "text-amber-700 dark:text-amber-500")}`)}>${escape_html(req)}</p> <p class="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed mt-0.5">"${escape_html(trecho)}"</p></div>`;
      }
      $$payload.out += `<!--]--></div> `;
      if (v.url) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<a${attr("href", v.url)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors">Ver o anúncio completo <span aria-hidden="true">↗</span></a>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]--> <span class="text-xs text-slate-400 ml-3">fonte: ${escape_html(v.source)}</span></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></article>`;
  }
  $$payload.out += `<!--]--></div> `;
  if (filtradas.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="text-center text-slate-500 py-16">Nenhuma vaga com esses filtros.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (filtradas.length > LIMITE) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="text-center mt-8"><button type="button" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Ver todas as ${escape_html(filtradas.length)} vagas</button></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <p class="text-xs text-slate-400 dark:text-slate-500 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">Classificação feita por título e pela descrição do anúncio. Requisitos detectados por busca textual no
      texto do anúncio — o trecho mostrado é o que casou. O veredito de cobertura compara os requisitos com o
      que eu já construí em produção; não substitui a leitura do anúncio, que está sempre linkado.</p></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
