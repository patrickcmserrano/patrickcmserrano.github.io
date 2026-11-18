import { g as ensure_array_like, P as head, e as escape_html, d as store_get, a as attr, s as stringify, f as attr_style, c as attr_class, u as unsubscribe_stores, p as pop, b as push } from "../../../../chunks/index.js";
import { L as LanguageSelector, T as ThemeToggle } from "../../../../chunks/LanguageSelector.js";
import { _ } from "../../../../chunks/simple-i18n.js";
function _page($$payload, $$props) {
  push();
  var $$store_subs;
  let { data } = $$props;
  let vagas = data.vagas || [];
  let gerado = data.gerado || "";
  const GRUPOS = [
    {
      id: "orquestracao",
      titulo: "Orquestração de agentes (a família LangChain/LangGraph)",
      custo: "semanas 1–2",
      porque: "É o rótulo mais frequente e o mais barato de fechar: é biblioteca Python. O anúncio escreve a stack inteira, então a família cobre por associação.",
      itens: [
        "LangChain",
        "LangGraph",
        "LlamaIndex",
        "AutoGen",
        "CrewAI",
        "Semantic Kernel",
        "Haystack",
        "Agno",
        "LiteLLM"
      ],
      rotulo: ["LangChain / LangGraph"],
      pede: ["LangChain / LangGraph"],
      contarComo: ["LangChain / LangGraph", "GCP"]
    },
    {
      id: "mlops",
      titulo: "MLOps / LLMOps — a lacuna que o painel não mostra",
      custo: "semanas 2–3",
      porque: 'Não existe um rótulo "MLOps" no painel, mas é a lacuna mais larga do texto dos anúncios. A /vagas conta Observabilidade e Evals como cobertura; os anúncios nomeiam as ferramentas — e são elas que faltam.',
      itens: [
        "MLflow",
        "Langfuse",
        "LangSmith",
        "Arize",
        "OpenTelemetry",
        {
          nome: "Guardrails",
          termos: [
            "Guardrails",
            "Guardrails AI",
            "NeMo Guardrails"
          ]
        },
        "RAGAS",
        "DeepEval",
        "Fine-tuning",
        "vLLM",
        "Ollama"
      ],
      rotulo: ["Observabilidade", "Evals / qualidade"],
      pede: [],
      carga: [
        {
          nome: "MLOps / LLMOps",
          termos: ["MLOps", "LLMOps"]
        },
        { nome: "Langfuse", termos: ["Langfuse"] },
        {
          nome: "OpenTelemetry",
          termos: ["OpenTelemetry"]
        },
        { nome: "LangSmith", termos: ["LangSmith"] },
        {
          nome: "RAGAS / DeepEval / Guardrails",
          termos: ["RAGAS", "DeepEval", "Guardrails"]
        },
        { nome: "Arize", termos: ["Arize"] },
        {
          nome: "Fine-tuning",
          termos: ["Fine-tuning"]
        },
        {
          nome: "vLLM / Ollama",
          termos: ["vLLM", "Ollama"]
        }
      ]
    },
    {
      id: "python-plataforma",
      titulo: "Python de plataforma — FastAPI, pydantic, asyncio",
      custo: "semanas 2–3 (em paralelo)",
      porque: "Python já é cobertura, mas os anúncios nomeiam a forma de servir: FastAPI com Pydantic e asyncio aparece em 14 anúncios. Fecha junto com os outros grupos, sem semana própria.",
      itens: ["FastAPI", "Pydantic", "asyncio"],
      rotulo: ["Python"],
      pede: [],
      carga: [
        { nome: "FastAPI", termos: ["FastAPI"] },
        { nome: "Pydantic", termos: ["Pydantic"] },
        { nome: "asyncio", termos: ["asyncio"] }
      ]
    },
    {
      id: "bedrock",
      titulo: "AWS na forma Bedrock — não a AWS inteira",
      custo: "semanas 3–4",
      porque: 'A evidência do AWS é "Amazon Bedrock", variante nomeada em 9 anúncios. Não é EC2 genérico: é Bedrock + Knowledge Bases + S3 Vectors, que é API.',
      itens: [
        "Amazon Bedrock",
        "Bedrock Knowledge Bases",
        "S3 Vectors",
        "Lambda",
        "S3",
        "EC2 / EKS"
      ],
      rotulo: ["AWS"],
      pede: ["AWS"],
      contarComo: ["AWS"]
    },
    {
      id: "containers",
      titulo: "Containers e o vocabulário de Kubernetes",
      custo: "semana 4 (leitura, não laboratório)",
      porque: "Dos 8 anúncios com Kubernetes, 7 escrevem `Docker ou Kubernetes` na mesma linha — é a mesma lacuna de containers sob dois nomes. Docker já é cobertura (15 vagas); Kubernetes entra como vocabulário.",
      itens: [
        "Docker Compose",
        "vocabulário k8s: pod, deploy, service, ingress",
        "Helm (só reconhecer)",
        "GitOps"
      ],
      rotulo: ["Docker / containers", "Kubernetes"],
      pede: ["Kubernetes"],
      contarComo: ["Kubernetes"]
    },
    {
      id: "microsoft",
      titulo: "Azure na forma Microsoft AI — o degrau mais caro",
      custo: "semanas 4–6",
      porque: 'Azure é o rótulo mais pedido (24), mas só 14 anúncios exigem Azure de verdade. E o que eles pedem não é "saber Azure": é Copilot Studio, Azure AI Foundry, Fabric, Databricks e Dataverse.',
      itens: [
        "Azure OpenAI / Azure AI Foundry",
        "Microsoft Copilot Studio",
        "Microsoft Fabric",
        "Databricks",
        "Dataverse / Dynamics 365"
      ],
      rotulo: ["Azure"],
      pede: ["Azure"],
      contarComo: ["Azure"]
    },
    {
      id: "vertex",
      titulo: "Google na forma Vertex — a nuvem das vagas junior-level",
      custo: "semanas 5–6",
      porque: 'Só 3 anúncios pedem GCP e apenas GCP, e os outros usam como alternativa. Mas é a nuvem citada nas vagas de senioridade "não especificado" — inclusive a Franq, pleno, e a B4A, que é JS/Node/TypeScript.',
      itens: [
        "Vertex AI / Gemini",
        "Google AI Studio",
        "Gemini Enterprise"
      ],
      rotulo: ["GCP"],
      pede: ["GCP"],
      contarComo: ["GCP"]
    },
    {
      id: "dados",
      titulo: "Dados e plataforma corporativa",
      custo: "quando as outras fecharem",
      porque: "Aparece junto com as nuvens caras (Databricks, Unity Catalog, Spark) e quase sempre em vaga de plataforma/analytics, não de agente. Custo alto, aderência menor — é o fim da fila.",
      itens: [
        "Spark",
        "Databricks",
        "Unity Catalog",
        "Terraform",
        "arquitetura orientada a eventos"
      ],
      rotulo: [],
      pede: [],
      carga: [
        { nome: "Spark", termos: ["Spark"] },
        {
          nome: "Databricks",
          termos: ["Databricks"]
        },
        {
          nome: "Unity Catalog",
          termos: ["Unity Catalog"]
        },
        { nome: "Terraform", termos: ["Terraform"] },
        {
          nome: "Orientada a eventos",
          termos: [
            "orientada a eventos",
            "arquitetura orientada a eventos"
          ]
        }
      ]
    }
  ];
  const listaDe = (g) => g.itens.map((i) => typeof i === "string" ? i : i.nome);
  const recorte = (t) => (t || "").replace(/^[…\s]+/, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  const marcas = {
    AWS: /amazon|bedrock|aws/i,
    Azure: /azure|microsoft|\.net|fabric|dataverse|copilot/i,
    GCP: /google|gcp|vertex|gemini/i
  };
  const SOFT = [
    "certifica",
    "diferencial",
    "preferencial",
    "desejável",
    "desejavel",
    "será considerada",
    "sera considerada",
    "será considerado",
    "sera considerado",
    "opcional"
  ];
  const classifica = (req, ev) => {
    if (!ev) return { duro: false, porque: "sem trecho" };
    const low = ev.toLowerCase();
    const suave = SOFT.find((s) => low.includes(s));
    if (suave) return {
      duro: false,
      porque: "certificação ou diferencial"
    };
    const i = ev.search(new RegExp(`\\b${req}\\b`, "i"));
    if (i < 0) {
      const marca = marcas[req];
      return marca && marca.test(ev) ? { duro: true, porque: "" } : { duro: false, porque: "sem nome" };
    }
    if (["AWS", "Azure", "GCP"].includes(req)) {
      const antes = ev.slice(Math.max(0, i - 40), i).trim().split(/\s+/);
      const depois = ev.slice(i + req.length, i + req.length + 12).trim().split(/\s+/);
      if (antes[antes.length - 1]?.toLowerCase() === "ou" && antes[antes.length - 1].length < 4) return { duro: false, porque: "alternativa" };
      if (depois[0]?.toLowerCase() === "ou" && (depois[1] || "").length < 8 && !/^(AWS|Azure|GCP)$/i.test(depois[1] || "")) return { duro: false, porque: "alternativa" };
    }
    return { duro: true, porque: "" };
  };
  let stats = (() => {
    const out = {};
    for (const g of GRUPOS) {
      if (!g.pede || !g.pede.length) continue;
      const reqs = g.rotulo.length ? g.rotulo : g.pede;
      const donos = vagas.filter((v) => (v.asks || []).some((a) => reqs.includes(a)));
      let dura = 0;
      let duram = 0;
      const exemplos = [];
      const abertos = [];
      for (const v of donos) {
        const duras = reqs.map((r) => ({ r, ev: recorte(v.evidence?.[r] || "") })).filter(({ r, ev }) => ev && classifica(r, ev).duro);
        if (duras.length) {
          dura += 1;
          duram += duras.length;
          abertos.push(duras.length);
          if (exemplos.length < 2) exemplos.push(duras[0].ev);
        }
      }
      out[g.id] = {
        total: donos.length,
        dura,
        duram,
        exemplos,
        abertura: abertos.length ? Math.round(abertos.reduce((s, n) => s + n, 0) / abertos.length * 10) / 10 : 0
      };
    }
    return out;
  })();
  let cargas = (() => {
    const out = {};
    for (const g of GRUPOS) {
      if (!g.carga) continue;
      const base = vagas.filter((v) => {
        const a = /* @__PURE__ */ new Set([...v.asks || []]);
        if (g.rotulo.length && g.rotulo.some((r) => a.has(r))) return true;
        return g.itens.some((i) => typeof i === "object" && (v.asks || []).includes(i.nome));
      }).length;
      out[g.id] = g.carga.map((t) => {
        const n = vagas.filter((v) => {
          const texto = Object.values(v.evidence || {}).join(" ");
          return t.termos.some((termo) => texto.toLowerCase().includes(termo.toLowerCase()));
        }).length;
        return { nome: t.nome, n, base: base || vagas.length };
      });
    }
    return out;
  })();
  let destravadas = (() => {
    const out = {};
    const satisfeitas = /* @__PURE__ */ new Set();
    for (const g of GRUPOS) {
      const reqs = new Set(g.contarComo || g.pede || g.rotulo);
      const donos = vagas.filter((v) => {
        if (satisfeitas.has(v.url || `${v.company}${v.title}`)) return false;
        const a = new Set(v.asks || []);
        if (![...reqs].some((r) => a.has(r))) return false;
        return [...a].every((x) => satisfeitas.has(x) || reqs.has(x));
      });
      out[g.id] = donos;
      for (const v of donos) satisfeitas.add(v.url || `${v.company}${v.title}`);
    }
    return out;
  })();
  let lacunasInvisiveis = (() => {
    const visiveis = new Set(GRUPOS.flatMap((g) => g.rotulo));
    const cont = {};
    for (const v of vagas) {
      const texto = Object.values(v.evidence || {}).join(" ").toLowerCase();
      for (const termo of ["MCP", "LiteLLM", "LlamaIndex"]) {
        if (texto.includes(termo.toLowerCase())) cont[termo] = (cont[termo] || 0) + 1;
      }
    }
    return { cont, visiveis: [...visiveis] };
  })();
  let excecoes = (() => {
    const out = [];
    for (const v of vagas) {
      for (const req of v.asks || []) {
        if (GRUPOS.some((g) => (g.pede || []).includes(req))) continue;
        const ev = recorte(v.evidence?.[req] || "");
        out.push({
          req,
          empresa: v.company,
          duro: classifica(req, ev).duro,
          exemplo: ev
        });
      }
    }
    return out;
  })();
  const each_array = ensure_array_like(["bedrock", "microsoft", "vertex"]);
  const each_array_1 = ensure_array_like(GRUPOS);
  const each_array_2 = ensure_array_like(GRUPOS);
  const each_array_7 = ensure_array_like(Object.entries(lacunasInvisiveis.cont).sort((a, b) => b[1] - a[1]));
  const each_array_8 = ensure_array_like(excecoes);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>O que estudar para as vagas — Patrick Campelo Serrano</title>`;
    $$payload2.out += `<meta name="description" content="Mapa de estudo derivado das 56 vagas de IA: cada lacuna na forma em que o anúncio a escreve, com o trecho literal e quantas vagas ela destrava.">`;
  });
  $$payload.out += `<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300"><header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50"><div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between"><a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">Patrick Campelo Serrano</a> <div class="flex items-center gap-6"><nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold"><a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.about"))}</a> <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.projects"))}</a> <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.blog"))}</a> <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${escape_html(store_get($$store_subs ??= {}, "$_", _)("nav.links"))}</a></nav> <div class="flex items-center gap-4">`;
  LanguageSelector($$payload);
  $$payload.out += `<!----> `;
  ThemeToggle($$payload);
  $$payload.out += `<!----></div></div></div></header> <main class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-10"><p class="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3">Trilha de estudo</p> <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">O que estudar</h1> <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Derivado das <strong>${escape_html(vagas.length)} vagas</strong> da varredura de ${escape_html(gerado)} — não escrito à mão.
        Cada linha mostra a lacuna <strong>na forma em que o anúncio a escreve</strong> e quantas vagas ela
        realmente destrava.</p> <a href="/vagas/" class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Ver o catálogo completo das ${escape_html(vagas.length)} vagas <span aria-hidden="true">→</span></a></div> <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8"><h2 class="text-lg font-bold tracking-tight mb-2">O rótulo não é o requisito</h2> <p class="text-sm text-slate-600 dark:text-slate-400">O painel da <a href="/vagas/" class="text-indigo-600 dark:text-indigo-400 hover:underline">/vagas</a> conta vagas por rótulo. O que decide o estudo é <strong>o que o anúncio escreve dentro do rótulo</strong> — e aí os números mudam de forma. Azure é o mais pedido (${escape_html(stats["microsoft"]?.total)} vagas), mas só <strong>${escape_html(stats["microsoft"]?.dura)} exigem Azure de verdade</strong>: o resto cita Azure como
        certificação, preferência ou uma alternativa a menos de três palavras
        (${escape_html(stats["microsoft"]?.total - stats["microsoft"]?.dura)} anúncios). Na ordem inversa, o <strong>Bedrock</strong> — variante AWS nomeada dentro do rótulo AWS — não aparece em rótulo nenhum
        do painel.</p> <div class="grid sm:grid-cols-3 gap-3 mt-5"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let id = each_array[$$index];
    const g = GRUPOS.find((x) => x.id === id);
    const s = stats[id];
    if (s) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">${escape_html(listaDe(g)[0].split(" ")[0])}</p> <p class="mt-1 text-2xl font-bold tabular-nums">${escape_html(s.dura)}<span class="text-sm font-medium text-slate-400">duro</span></p> <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">de ${escape_html(s.total)} anúncios com o rótulo · ${escape_html(s.total - s.dura)} são preferência ou certificação</p></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></section> <section class="mb-10"><div class="flex flex-wrap items-end justify-between gap-3 mb-4"><h2 class="text-xl font-bold tracking-tight">A fila, por retorno sobre o esforço</h2> <span class="text-xs text-slate-500 dark:text-slate-400">custo menor primeiro · <strong>1 vaga</strong> = destravada quando as outras lacunas dela já fecharem</span></div> <div class="space-y-3"><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let g = each_array_1[i];
    stats[g.id];
    const donos = destravadas[g.id] || [];
    $$payload.out += `<button type="button" class="w-full text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"><div class="flex flex-wrap items-start justify-between gap-3"><div class="flex items-start gap-3 min-w-0"><span class="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold flex items-center justify-center tabular-nums">${escape_html(i + 1)}</span> <div class="min-w-0"><p class="font-bold tracking-tight">${escape_html(g.titulo)}</p> <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">${escape_html(g.porque)}</p></div></div> <div class="flex flex-col items-end gap-1 shrink-0"><span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold">${escape_html(g.custo)}</span> <span class="text-xs text-slate-500 dark:text-slate-500 tabular-nums">${escape_html(donos.length ? `${donos.length} vaga${donos.length > 1 ? "s" : ""} destravada${donos.length > 1 ? "s" : ""}` : "—")}</span></div></div></button>`;
  }
  $$payload.out += `<!--]--></div></section> <!--[-->`;
  for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
    let g = each_array_2[i];
    const s = stats[g.id];
    const donos = destravadas[g.id] || [];
    const carga = cargas[g.id] || [];
    const each_array_3 = ensure_array_like(listaDe(g));
    $$payload.out += `<section${attr("id", `grupo-${stringify(g.id)}`)} class="scroll-mt-24 mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6"><div class="flex flex-wrap items-baseline justify-between gap-2 mb-3"><h3 class="text-lg font-bold tracking-tight"><span class="text-slate-400 dark:text-slate-600 tabular-nums mr-1">#${escape_html(i + 1)}</span>${escape_html(g.titulo)}</h3> <span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold">${escape_html(g.custo)}</span></div> <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">O que estudar</p> <div class="flex flex-wrap gap-1.5 mb-5"><!--[-->`;
    for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
      let item = each_array_3[$$index_2];
      $$payload.out += `<span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium">${escape_html(item)}</span>`;
    }
    $$payload.out += `<!--]--></div> `;
    if (s) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="grid sm:grid-cols-2 gap-3 mb-5"><div class="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">No painel da /vagas</p> <p class="mt-1 text-2xl font-bold tabular-nums">${escape_html(s.total)}<span class="text-sm font-medium text-slate-400">vagas</span></p> <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">conta o rótulo <em>${escape_html(g.rotulo.join(" / "))}</em></p></div> <div class="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4"><p class="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">No texto do anúncio</p> <p class="mt-1 text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-300">${escape_html(s.dura)}<span class="text-sm font-medium text-amber-600/80">pedem de verdade</span></p> <p class="text-xs text-amber-700/80 dark:text-amber-600/90 mt-1">${escape_html(s.dura === s.total ? "quase todas exigem, não é diferencial" : `${s.total - s.dura} são certificação, preferência ou "ou"`)}</p></div></div> `;
      if (s.exemplos.length) {
        $$payload.out += "<!--[-->";
        const each_array_4 = ensure_array_like(s.exemplos);
        $$payload.out += `<p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Como o anúncio escreve</p> <div class="space-y-2 mb-5"><!--[-->`;
        for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
          let ex = each_array_4[$$index_3];
          $$payload.out += `<blockquote class="border-l-2 border-amber-300 dark:border-amber-800 pl-3"><p class="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"${escape_html(ex)}"</p></blockquote>`;
        }
        $$payload.out += `<!--]--></div>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (carga.length) {
      $$payload.out += "<!--[-->";
      const each_array_5 = ensure_array_like(carga);
      $$payload.out += `<p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Carga por ferramenta — quantas das ${escape_html(vagas.length)} vagas citam</p> <div class="space-y-1.5 mb-5"><!--[-->`;
      for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
        let t = each_array_5[$$index_4];
        $$payload.out += `<div class="flex items-center gap-3"><span class="w-56 shrink-0 text-sm text-slate-700 dark:text-slate-300">${escape_html(t.nome)}</span> <div class="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-full rounded-full bg-amber-500"${attr_style(`width: ${stringify(Math.max(2, Math.round(t.n * 100 / vagas.length)))}%`)}></div></div> <span class="w-20 text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">${escape_html(t.n)} vagas</span></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--> `;
    if (donos.length) {
      $$payload.out += "<!--[-->";
      const each_array_6 = ensure_array_like(donos);
      $$payload.out += `<p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Destrava ${escape_html(donos.length)} vaga${escape_html(donos.length > 1 ? "s" : "")} quando as outras lacunas já estiverem fechadas</p> <div class="space-y-2"><!--[-->`;
      for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
        let v = each_array_6[$$index_5];
        $$payload.out += `<div class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 px-3.5 py-2.5"><div class="min-w-0 flex-1"><p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">${escape_html(v.title)}</p> <p class="text-xs text-slate-500 dark:text-slate-400">${escape_html(v.company)} · ${escape_html(v.mode)}</p></div> <span class="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">${escape_html(v.seniority)}</span> <span class="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold tabular-nums" title="total de lacunas da vaga">${escape_html((v.asks || []).length)} lacunas na vaga</span></div>`;
      }
      $$payload.out += `<!--]--></div>`;
    } else if (!g.pede || !g.pede.length) {
      $$payload.out += "<!--[1-->";
      $$payload.out += `<p class="text-xs text-slate-500 dark:text-slate-500">Já coberto pelo meu perfil — o que falta é <strong>nomear</strong> as ferramentas que os anúncios citam.</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></section>`;
  }
  $$payload.out += `<!--]--> <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8"><h2 class="text-lg font-bold tracking-tight mb-2">O que o painel da /vagas não vê</h2> <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Termos que os anúncios citam e que não viraram rótulo de lacuna — por isso não aparecem em barra
        nenhuma. Contados no texto das ${escape_html(vagas.length)} vagas:</p> <div class="flex flex-wrap gap-2"><!--[-->`;
  for (let $$index_7 = 0, $$length = each_array_7.length; $$index_7 < $$length; $$index_7++) {
    let [termo, n] = each_array_7[$$index_7];
    $$payload.out += `<span class="text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium">${escape_html(termo)} <span class="text-slate-500 dark:text-slate-500 tabular-nums">${escape_html(n)}</span></span>`;
  }
  $$payload.out += `<!--]--></div></section> <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8"><h2 class="text-lg font-bold tracking-tight mb-2">O que <em>não</em> entra na trilha</h2> <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">Lacunas fora dos grupos acima. Onde o anúncio escreve <em>"ou"</em>, a alternativa já é cobertura —
        estudar seria perseguir uma linha em vez de uma vaga.</p> <div class="space-y-2"><!--[-->`;
  for (let $$index_8 = 0, $$length = each_array_8.length; $$index_8 < $$length; $$index_8++) {
    let e = each_array_8[$$index_8];
    $$payload.out += `<div class="rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2.5"><div class="flex flex-wrap items-center gap-x-3 gap-y-1"><span${attr_class(`text-sm font-semibold ${stringify(e.duro ? "text-amber-700 dark:text-amber-500" : "text-slate-400 dark:text-slate-500 line-through")}`)}>${escape_html(e.req)}</span> <span class="text-xs text-slate-500 dark:text-slate-400">${escape_html(e.empresa)}</span> <span${attr_class(`text-xs px-2 py-0.5 rounded-md ${stringify(e.duro ? "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300" : "bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400")}`)}>${escape_html(e.duro ? "requisito duro" : "alternativa — já coberto")}</span></div> `;
    if (e.exemplo) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<p class="text-xs text-slate-500 dark:text-slate-500 italic mt-1.5">"${escape_html(e.exemplo)}"</p>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></div></section> <p class="text-xs text-slate-400 dark:text-slate-500 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">Cada contagem desta página é derivada do mesmo <code class="text-[11px]">src/data/vagas-ia.json</code> que alimenta a /vagas, em tempo de build — nunca escrita à mão. "Pede de verdade" é um critério
      textual: o trecho do anúncio deixa de ser requisito quando é só certificação, diferencial ou uma
      alternativa com "ou". Contagens são por <strong>vaga</strong>, não por aparição de termo.</p></main></div>`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  pop();
}
export {
  _page as default
};
