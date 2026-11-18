<script lang="ts">
  import ThemeToggle from '../../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../../components/LanguageSelector.svelte';
  import { _ } from '../../../lib/simple-i18n';

  let { data } = $props();
  let vagas = $derived<any[]>(data.vagas || []);
  let gerado = $derived(data.gerado || '');

  // ---------------------------------------------------------------------------
  // Os grupos de estudo NÃO são contagens de rótulo: são a resposta a "o que o
  // anúncio escreve dentro do rótulo". O `rotulo` é o que o painel da /vagas
  // mostra (Azure=24); o `pede` é o que o anúncio realmente pede (Azure=14).
  // `contarComo` corrige a sobreposição: nuvem já é coberta pelo grupo de nuvem,
  // então uma vaga "AWS + Kubernetes" não conta duas vezes.
  // ---------------------------------------------------------------------------
  type Item = string | { nome: string; termos: string[] };
  type Grupo = {
    id: string;
    titulo: string;
    custo: string;
    porque: string;
    itens: Item[];
    rotulo: string[];
    pede: string[];
    contarComo?: string[];
    carga?: Array<{ nome: string; termos: string[] }>;
  };

  const GRUPOS: Grupo[] = [
    {
      id: 'orquestracao',
      titulo: 'Orquestração de agentes (a família LangChain/LangGraph)',
      custo: 'semanas 1–2',
      porque: 'É o rótulo mais frequente e o mais barato de fechar: é biblioteca Python. O anúncio escreve a stack inteira, então a família cobre por associação.',
      itens: ['LangChain', 'LangGraph', 'LlamaIndex', 'AutoGen', 'CrewAI', 'Semantic Kernel', 'Haystack', 'Agno', 'LiteLLM'],
      rotulo: ['LangChain / LangGraph'],
      pede: ['LangChain / LangGraph'],
      contarComo: ['LangChain / LangGraph', 'GCP']
    },
    {
      id: 'mlops',
      titulo: 'MLOps / LLMOps — a lacuna que o painel não mostra',
      custo: 'semanas 2–3',
      porque: 'Não existe um rótulo "MLOps" no painel, mas é a lacuna mais larga do texto dos anúncios. A /vagas conta Observabilidade e Evals como cobertura; os anúncios nomeiam as ferramentas — e são elas que faltam.',
      itens: ['MLflow', 'Langfuse', 'LangSmith', 'Arize', 'OpenTelemetry',
        { nome: 'Guardrails', termos: ['Guardrails', 'Guardrails AI', 'NeMo Guardrails'] },
        'RAGAS', 'DeepEval', 'Fine-tuning', 'vLLM', 'Ollama'],
      rotulo: ['Observabilidade', 'Evals / qualidade'],
      pede: [],
      carga: [
        { nome: 'MLOps / LLMOps', termos: ['MLOps', 'LLMOps'] },
        { nome: 'Langfuse', termos: ['Langfuse'] },
        { nome: 'OpenTelemetry', termos: ['OpenTelemetry'] },
        { nome: 'LangSmith', termos: ['LangSmith'] },
        { nome: 'RAGAS / DeepEval / Guardrails', termos: ['RAGAS', 'DeepEval', 'Guardrails'] },
        { nome: 'Arize', termos: ['Arize'] },
        { nome: 'Fine-tuning', termos: ['Fine-tuning'] },
        { nome: 'vLLM / Ollama', termos: ['vLLM', 'Ollama'] }
      ]
    },
    {
      id: 'python-plataforma',
      titulo: 'Python de plataforma — FastAPI, pydantic, asyncio',
      custo: 'semanas 2–3 (em paralelo)',
      porque: 'Python já é cobertura, mas os anúncios nomeiam a forma de servir: FastAPI com Pydantic e asyncio aparece em 14 anúncios. Fecha junto com os outros grupos, sem semana própria.',
      itens: ['FastAPI', 'Pydantic', 'asyncio'],
      rotulo: ['Python'],
      pede: [],
      carga: [
        { nome: 'FastAPI', termos: ['FastAPI'] },
        { nome: 'Pydantic', termos: ['Pydantic'] },
        { nome: 'asyncio', termos: ['asyncio'] }
      ]
    },
    {
      id: 'bedrock',
      titulo: 'AWS na forma Bedrock — não a AWS inteira',
      custo: 'semanas 3–4',
      porque: 'A evidência do AWS é "Amazon Bedrock", variante nomeada em 9 anúncios. Não é EC2 genérico: é Bedrock + Knowledge Bases + S3 Vectors, que é API.',
      itens: ['Amazon Bedrock', 'Bedrock Knowledge Bases', 'S3 Vectors', 'Lambda', 'S3', 'EC2 / EKS'],
      rotulo: ['AWS'],
      pede: ['AWS'],
      contarComo: ['AWS']
    },
    {
      id: 'containers',
      titulo: 'Containers e o vocabulário de Kubernetes',
      custo: 'semana 4 (leitura, não laboratório)',
      porque: 'Dos 8 anúncios com Kubernetes, 7 escrevem `Docker ou Kubernetes` na mesma linha — é a mesma lacuna de containers sob dois nomes. Docker já é cobertura (15 vagas); Kubernetes entra como vocabulário.',
      itens: ['Docker Compose', 'vocabulário k8s: pod, deploy, service, ingress', 'Helm (só reconhecer)', 'GitOps'],
      rotulo: ['Docker / containers', 'Kubernetes'],
      pede: ['Kubernetes'],
      contarComo: ['Kubernetes']
    },
    {
      id: 'microsoft',
      titulo: 'Azure na forma Microsoft AI — o degrau mais caro',
      custo: 'semanas 4–6',
      porque: 'Azure é o rótulo mais pedido (24), mas só 14 anúncios exigem Azure de verdade. E o que eles pedem não é "saber Azure": é Copilot Studio, Azure AI Foundry, Fabric, Databricks e Dataverse.',
      itens: ['Azure OpenAI / Azure AI Foundry', 'Microsoft Copilot Studio', 'Microsoft Fabric', 'Databricks', 'Dataverse / Dynamics 365'],
      rotulo: ['Azure'],
      pede: ['Azure'],
      contarComo: ['Azure']
    },
    {
      id: 'vertex',
      titulo: 'Google na forma Vertex — a nuvem das vagas junior-level',
      custo: 'semanas 5–6',
      porque: 'Só 3 anúncios pedem GCP e apenas GCP, e os outros usam como alternativa. Mas é a nuvem citada nas vagas de senioridade "não especificado" — inclusive a Franq, pleno, e a B4A, que é JS/Node/TypeScript.',
      itens: ['Vertex AI / Gemini', 'Google AI Studio', 'Gemini Enterprise'],
      rotulo: ['GCP'],
      pede: ['GCP'],
      contarComo: ['GCP']
    },
    {
      id: 'dados',
      titulo: 'Dados e plataforma corporativa',
      custo: 'quando as outras fecharem',
      porque: 'Aparece junto com as nuvens caras (Databricks, Unity Catalog, Spark) e quase sempre em vaga de plataforma/analytics, não de agente. Custo alto, aderência menor — é o fim da fila.',
      itens: ['Spark', 'Databricks', 'Unity Catalog', 'Terraform', 'arquitetura orientada a eventos'],
      rotulo: [],
      pede: [],
      carga: [
        { nome: 'Spark', termos: ['Spark'] },
        { nome: 'Databricks', termos: ['Databricks'] },
        { nome: 'Unity Catalog', termos: ['Unity Catalog'] },
        { nome: 'Terraform', termos: ['Terraform'] },
        { nome: 'Orientada a eventos', termos: ['orientada a eventos', 'arquitetura orientada a eventos'] }
      ]
    }
  ];

  const FAMILIA_NUVEM: Record<string, string> = { AWS: 'bedrock', Azure: 'microsoft', GCP: 'vertex' };
  const CLOUDS = ['AWS', 'Azure', 'GCP'];

  const listaDe = (g: Grupo): string[] => g.itens.map((i) => (typeof i === 'string' ? i : i.nome));

  // Normaliza um trecho de anúncio para o recorte que vai na página.
  const recorte = (t: string): string =>
    (t || '')
      .replace(/^[…\s]+/, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const ehNuvem = (r: string) => CLOUDS.includes(r);

  const marcas: Record<string, RegExp> = {
    AWS: /amazon|bedrock|aws/i,
    Azure: /azure|microsoft|\.net|fabric|dataverse|copilot/i,
    GCP: /google|gcp|vertex|gemini/i
  };

  // Marcadores de que o requisito não é duro: certificação, diferencial,
  // preferência — ou uma alternativa curta com "ou" (`AWS ou OCI`).
  const SOFT = [
    'certifica', 'diferencial', 'preferencial', 'desejável', 'desejavel',
    'será considerada', 'sera considerada', 'será considerado', 'sera considerado',
    'opcional'
  ];

  // Classifica UM requisito pelo trecho literal do anúncio.
  // - `suave`   → o anúncio pede como certificação, preferência ou diferencial
  // - `opcao`   → o anúncio oferece a alternativa a menos de 3 tokens (`AWS ou OCI`)
  // - `semNome` → o trecho não nomeia a tecnologia (a GCP é inferida do Gemini/Vertex)
  // - senão     → requisito duro
  const classifica = (req: string, ev: string): { duro: boolean; porque: string } => {
    if (!ev) return { duro: false, porque: 'sem trecho' };
    const low = ev.toLowerCase();
    const suave = SOFT.find((s) => low.includes(s));
    if (suave) return { duro: false, porque: 'certificação ou diferencial' };

    const i = ev.search(new RegExp(`\\b${req}\\b`, 'i'));
    if (i < 0) {
      // O rótulo existe na vaga, mas o trecho guardado não cita a sigla (GCP):
      // só conta como duro se o trecho nomear a tecnologia pela marca.
      const marca = marcas[req];
      return marca && marca.test(ev) ? { duro: true, porque: '' } : { duro: false, porque: 'sem nome' };
    }
    if (['AWS', 'Azure', 'GCP'].includes(req)) {
      const antes = ev.slice(Math.max(0, i - 40), i).trim().split(/\s+/);
      const depois = ev.slice(i + req.length, i + req.length + 12).trim().split(/\s+/);
      if (antes[antes.length - 1]?.toLowerCase() === 'ou' && antes[antes.length - 1].length < 4)
        return { duro: false, porque: 'alternativa' };
      if (depois[0]?.toLowerCase() === 'ou' && (depois[1] || '').length < 8 && !/^(AWS|Azure|GCP)$/i.test(depois[1] || ''))
        return { duro: false, porque: 'alternativa' };
    }
    return { duro: true, porque: '' };
  };

  // ---------------------------------------------------------------------------
  // Contagens: por VAGA (nunca somando barras), e sempre sobre o texto real.
  // ---------------------------------------------------------------------------
  let stats = $derived.by(() => {
    const out: Record<string, { total: number; dura: number; duram: number; exemplos: string[]; abertura: number }> = {};
    for (const g of GRUPOS) {
      if (!g.pede || !g.pede.length) continue;
      const reqs = g.rotulo.length ? g.rotulo : g.pede;
      const donos = vagas.filter((v: any) => (v.asks || []).some((a: string) => reqs.includes(a)));
      let dura = 0;
      let duram = 0;
      const exemplos: string[] = [];
      const abertos: number[] = [];
      for (const v of donos) {
        const duras = reqs
          .map((r: string) => ({ r, ev: recorte(v.evidence?.[r] || '') }))
          .filter(({ r, ev }) => ev && classifica(r, ev).duro);
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
        abertura: abertos.length ? Math.round((abertos.reduce((s, n) => s + n, 0) / abertos.length) * 10) / 10 : 0
      };
    }
    return out;
  });

  // Carga de cada termo: quantas VAGAS citam o termo (numerador) e quantas têm o
  // rótulo de base (denominador) — as duas barras nascem do mesmo lugar.
  let cargas = $derived.by(() => {
    const out: Record<string, Array<{ nome: string; n: number; base: number }>> = {};
    for (const g of GRUPOS) {
      if (!g.carga) continue;
      const base = vagas.filter((v: any) => {
        const a = new Set<string>([...(v.asks || [])]);
        if (g.rotulo.length && g.rotulo.some((r) => a.has(r))) return true;
        return (g.itens as Item[]).some((i) => typeof i === 'object' && (v.asks || []).includes(i.nome));
      }).length;
      out[g.id] = g.carga.map((t) => {
        const n = vagas.filter((v: any) => {
          const texto = Object.values(v.evidence || {}).join(' ');
          return t.termos.some((termo) => texto.toLowerCase().includes(termo.toLowerCase()));
        }).length;
        return { nome: t.nome, n, base: base || vagas.length };
      });
    }
    return out;
  });

  // As vagas que cada grupo destrava — sem duplicar uma vaga em dois grupos.
  let destravadas = $derived.by(() => {
    const out: Record<string, any[]> = {};
    const satisfeitas = new Set<string>();
    for (const g of GRUPOS) {
      const reqs = new Set<string>(g.contarComo || g.pede || g.rotulo);
      const donos = vagas.filter((v: any) => {
        if (satisfeitas.has(v.url || `${v.company}${v.title}`)) return false;
        const a = new Set<string>(v.asks || []);
        if (![...reqs].some((r) => a.has(r))) return false;
        // Só entra a vaga cujas OUTRAS lacunas já estão satisfeitas.
        return [...a].every((x) => satisfeitas.has(x) || reqs.has(x));
      });
      out[g.id] = donos;
      for (const v of donos) satisfeitas.add(v.url || `${v.company}${v.title}`);
    }
    return out;
  });

  // Nenhuma lacuna no rótulo, mas presente no texto: o painel da /vagas não as vê.
  let lacunasInvisiveis = $derived.by(() => {
    const visiveis = new Set(GRUPOS.flatMap((g) => g.rotulo));
    const cont: Record<string, number> = {};
    for (const v of vagas) {
      const texto = Object.values(v.evidence || {}).join(' ').toLowerCase();
      for (const termo of ['MCP', 'LiteLLM', 'LlamaIndex']) {
        if (texto.includes(termo.toLowerCase())) cont[termo] = (cont[termo] || 0) + 1;
      }
    }
    return { cont, visiveis: [...visiveis] };
  });

  // Exceção medida: Java/Kotlin é "Java ou TypeScript" na Omie — e a vaga cobre TypeScript.
  let excecoes = $derived.by(() => {
    const out: Array<{ req: string; empresa: string; duro: boolean; exemplo: string }> = [];
    for (const v of vagas) {
      for (const req of v.asks || []) {
        if (GRUPOS.some((g) => (g.pede || []).includes(req))) continue;
        const ev = recorte(v.evidence?.[req] || '');
        out.push({ req, empresa: v.company, duro: classifica(req, ev).duro, exemplo: ev });
      }
    }
    return out;
  });

  const subirPara = (id: string) => {
    const el = document.getElementById(`grupo-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
</script>

<svelte:head>
  <title>O que estudar para as vagas — Patrick Campelo Serrano</title>
  <meta
    name="description"
    content="Mapa de estudo derivado das 56 vagas de IA: cada lacuna na forma em que o anúncio a escreve, com o trecho literal e quantas vagas ela destrava."
  />
</svelte:head>

<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
        Patrick Campelo Serrano
      </a>
      <div class="flex items-center gap-6">
        <nav class="hidden sm:flex items-center gap-4 md:gap-6 text-sm font-semibold">
          <a href="/about/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{$_('nav.about')}</a>
          <a href="/trabalho/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{$_('nav.projects')}</a>
          <a href="/blog/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{$_('nav.blog')}</a>
          <a href="/links/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{$_('nav.links')}</a>
        </nav>
        <div class="flex items-center gap-4">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <p class="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3">Trilha de estudo</p>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        O que estudar
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Derivado das <strong>{vagas.length} vagas</strong> da varredura de {gerado} — não escrito à mão.
        Cada linha mostra a lacuna <strong>na forma em que o anúncio a escreve</strong> e quantas vagas ela
        realmente destrava.
      </p>
      <a href="/vagas/" class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
        Ver o catálogo completo das {vagas.length} vagas <span aria-hidden="true">→</span>
      </a>
    </div>

    <!-- A correção que ordena a página -->
    <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8">
      <h2 class="text-lg font-bold tracking-tight mb-2">O rótulo não é o requisito</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400">
        O painel da <a href="/vagas/" class="text-indigo-600 dark:text-indigo-400 hover:underline">/vagas</a>
        conta vagas por rótulo. O que decide o estudo é <strong>o que o anúncio escreve dentro do rótulo</strong>
        — e aí os números mudam de forma. Azure é o mais pedido ({stats['microsoft']?.total} vagas), mas só
        <strong>{stats['microsoft']?.dura} exigem Azure de verdade</strong>: o resto cita Azure como
        certificação, preferência ou uma alternativa a menos de três palavras
        ({stats['microsoft']?.total - stats['microsoft']?.dura} anúncios). Na ordem inversa, o
        <strong>Bedrock</strong> — variante AWS nomeada dentro do rótulo AWS — não aparece em rótulo nenhum
        do painel.
      </p>
      <div class="grid sm:grid-cols-3 gap-3 mt-5">
        {#each ['bedrock', 'microsoft', 'vertex'] as id}
          {@const g = GRUPOS.find((x) => x.id === id)!}
          {@const s = stats[id]}
          {#if s}
            <div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{listaDe(g)[0].split(' ')[0]}</p>
              <p class="mt-1 text-2xl font-bold tabular-nums">{s.dura}<span class="text-sm font-medium text-slate-400"> duro</span></p>
              <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">
                de {s.total} anúncios com o rótulo · {s.total - s.dura} são preferência ou certificação
              </p>
            </div>
          {/if}
        {/each}
      </div>
    </section>

    <!-- A fila -->
    <section class="mb-10">
      <div class="flex flex-wrap items-end justify-between gap-3 mb-4">
        <h2 class="text-xl font-bold tracking-tight">A fila, por retorno sobre o esforço</h2>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          custo menor primeiro · <strong>1 vaga</strong> = destravada quando as outras lacunas dela já fecharem
        </span>
      </div>

      <div class="space-y-3">
        {#each GRUPOS as g, i}
          {@const s = stats[g.id]}
          {@const donos = destravadas[g.id] || []}
          <button
            type="button"
            onclick={() => subirPara(g.id)}
            class="w-full text-left bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="flex items-start gap-3 min-w-0">
                <span class="shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-bold flex items-center justify-center tabular-nums">{i + 1}</span>
                <div class="min-w-0">
                  <p class="font-bold tracking-tight">{g.titulo}</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{g.porque}</p>
                </div>
              </div>
              <div class="flex flex-col items-end gap-1 shrink-0">
                <span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold">{g.custo}</span>
                <span class="text-xs text-slate-500 dark:text-slate-500 tabular-nums">
                  {donos.length ? `${donos.length} vaga${donos.length > 1 ? 's' : ''} destravada${donos.length > 1 ? 's' : ''}` : '—'}
                </span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </section>

    <!-- Detalhe por grupo -->
    {#each GRUPOS as g, i}
      {@const s = stats[g.id]}
      {@const donos = destravadas[g.id] || []}
      {@const carga = cargas[g.id] || []}
      <section id="grupo-{g.id}" class="scroll-mt-24 mb-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6">
        <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <h3 class="text-lg font-bold tracking-tight">
            <span class="text-slate-400 dark:text-slate-600 tabular-nums mr-1">#{i + 1}</span>{g.titulo}
          </h3>
          <span class="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-semibold">{g.custo}</span>
        </div>

        <!-- O que estudar -->
        <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">O que estudar</p>
        <div class="flex flex-wrap gap-1.5 mb-5">
          {#each listaDe(g) as item}
            <span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium">{item}</span>
          {/each}
        </div>

        <!-- A forma em que o anúncio escreve -->
        {#if s}
          <div class="grid sm:grid-cols-2 gap-3 mb-5">
            <div class="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">No painel da /vagas</p>
              <p class="mt-1 text-2xl font-bold tabular-nums">{s.total}<span class="text-sm font-medium text-slate-400"> vagas</span></p>
              <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">conta o rótulo <em>{g.rotulo.join(' / ')}</em></p>
            </div>
            <div class="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4">
              <p class="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">No texto do anúncio</p>
              <p class="mt-1 text-2xl font-bold tabular-nums text-amber-800 dark:text-amber-300">{s.dura}<span class="text-sm font-medium text-amber-600/80"> pedem de verdade</span></p>
              <p class="text-xs text-amber-700/80 dark:text-amber-600/90 mt-1">
                {s.dura === s.total ? 'quase todas exigem, não é diferencial' : `${s.total - s.dura} são certificação, preferência ou "ou"`}
              </p>
            </div>
          </div>

          {#if s.exemplos.length}
            <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Como o anúncio escreve</p>
            <div class="space-y-2 mb-5">
              {#each s.exemplos as ex}
                <blockquote class="border-l-2 border-amber-300 dark:border-amber-800 pl-3">
                  <p class="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">"{ex}"</p>
                </blockquote>
              {/each}
            </div>
          {/if}
        {/if}

        <!-- Carga por termo -->
        {#if carga.length}
          <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Carga por ferramenta — quantas das {vagas.length} vagas citam</p>
          <div class="space-y-1.5 mb-5">
            {#each carga as t}
              <div class="flex items-center gap-3">
                <span class="w-56 shrink-0 text-sm text-slate-700 dark:text-slate-300">{t.nome}</span>
                <div class="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div class="h-full rounded-full bg-amber-500" style="width: {Math.max(2, Math.round((t.n * 100) / vagas.length))}%"></div>
                </div>
                <span class="w-20 text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums shrink-0">{t.n} vagas</span>
              </div>
            {/each}
          </div>
        {/if}

        <!-- As vagas que este grupo destrava -->
        {#if donos.length}
          <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
            Destrava {donos.length} vaga{donos.length > 1 ? 's' : ''} quando as outras lacunas já estiverem fechadas
          </p>
          <div class="space-y-2">
            {#each donos as v}
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-emerald-200/70 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 px-3.5 py-2.5">
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{v.title}</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">{v.company} · {v.mode}</p>
                </div>
                <span class="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">{v.seniority}</span>
                <span class="text-xs px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold tabular-nums" title="total de lacunas da vaga">{(v.asks || []).length} lacunas na vaga</span>
              </div>
            {/each}
          </div>
        {:else if !g.pede || !g.pede.length}
          <p class="text-xs text-slate-500 dark:text-slate-500">
            Já coberto pelo meu perfil — o que falta é <strong>nomear</strong> as ferramentas que os anúncios citam.
          </p>
        {/if}
      </section>
    {/each}

    <!-- O que o painel não vê -->
    <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8">
      <h2 class="text-lg font-bold tracking-tight mb-2">O que o painel da /vagas não vê</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Termos que os anúncios citam e que não viraram rótulo de lacuna — por isso não aparecem em barra
        nenhuma. Contados no texto das {vagas.length} vagas:
      </p>
      <div class="flex flex-wrap gap-2">
        {#each Object.entries(lacunasInvisiveis.cont).sort((a: any, b: any) => b[1] - a[1]) as [termo, n]}
          <span class="text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium">
            {termo} <span class="text-slate-500 dark:text-slate-500 tabular-nums">{n}</span>
          </span>
        {/each}
      </div>
    </section>

    <!-- Exceções medidas -->
    <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8">
      <h2 class="text-lg font-bold tracking-tight mb-2">O que <em>não</em> entra na trilha</h2>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Lacunas fora dos grupos acima. Onde o anúncio escreve <em>"ou"</em>, a alternativa já é cobertura —
        estudar seria perseguir uma linha em vez de uma vaga.
      </p>
      <div class="space-y-2">
        {#each excecoes as e}
          <div class="rounded-xl border border-slate-200 dark:border-slate-800 px-3.5 py-2.5">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span class="text-sm font-semibold {e.duro ? 'text-amber-700 dark:text-amber-500' : 'text-slate-400 dark:text-slate-500 line-through'}">{e.req}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{e.empresa}</span>
              <span class="text-xs px-2 py-0.5 rounded-md {e.duro ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400'}">
                {e.duro ? 'requisito duro' : 'alternativa — já coberto'}
              </span>
            </div>
            {#if e.exemplo}<p class="text-xs text-slate-500 dark:text-slate-500 italic mt-1.5">"{e.exemplo}"</p>{/if}
          </div>
        {/each}
      </div>
    </section>

    <p class="text-xs text-slate-400 dark:text-slate-500 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      Cada contagem desta página é derivada do mesmo <code class="text-[11px]">src/data/vagas-ia.json</code>
      que alimenta a /vagas, em tempo de build — nunca escrita à mão. "Pede de verdade" é um critério
      textual: o trecho do anúncio deixa de ser requisito quando é só certificação, diferencial ou uma
      alternativa com "ou". Contagens são por <strong>vaga</strong>, não por aparição de termo.
    </p>
  </main>
</div>
