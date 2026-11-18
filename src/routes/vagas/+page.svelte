<script lang="ts">
  import ThemeToggle from '../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../components/LanguageSelector.svelte';
  import { _ } from '../../lib/simple-i18n';

  let { data } = $props();
  let vagas = $derived(data.vagas || []);
  let gerado = $derived(data.gerado || '');

  // Filtros
  let busca = $state('');
  let modo = $state<'todas' | 'Remoto' | 'Híbrido' | 'Presencial'>('todas');
  let semLacuna = $state(false);
  let aberta = $state<number | null>(null);
  // Usada por `filtradas` — precisa ser declarada antes dele.
  let lacunaFoco = $state<string | null>(null);

  const MODES = ['todas', 'Remoto', 'Híbrido', 'Presencial'] as const;

  let filtradas = $derived(
    vagas.filter((v: any) => {
      if (modo !== 'todas' && v.mode !== modo) return false;
      if (semLacuna && v.asks && v.asks.length > 0) return false;
      if (lacunaFoco && !(v.asks || []).includes(lacunaFoco)) return false;
      if (busca.trim()) {
        const q = busca.toLowerCase();
        const alvo = `${v.title} ${v.company} ${v.covers.join(' ')} ${(v.asks || []).join(' ')}`.toLowerCase();
        if (!alvo.includes(q)) return false;
      }
      return true;
    })
  );

  // Só as 25 melhores por padrão, para a página não virar uma parede.
  const LIMITE = 25;
  let mostrarTodas = $state(false);
  let visiveis = $derived(mostrarTodas ? filtradas : filtradas.slice(0, LIMITE));

  function toggle(i: number) {
    aberta = aberta === i ? null : i;
  }

  const cor = (sen: string) =>
    sen === 'sênior+' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
    : sen === 'pleno' ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40'
    : sen === 'estágio/júnior' ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60';

  // Painel de lacunas: agregado derivado dos dados, nunca escrito à mão.
  let lacunas = $derived.by(() => {
    const cont: Record<string, number> = {};
    for (const v of vagas) for (const a of v.asks || []) cont[a] = (cont[a] || 0) + 1;
    return Object.entries(cont)
      .map(([req, n]) => ({ req, n }))
      .sort((a, b) => b.n - a.n);
  });

  let maxLacuna = $derived(lacunas.length ? lacunas[0].n : 1);

  // Só nuvem gerenciada: a leitura que junta AWS/Azure/GCP numa lacuna só.
  // Conta VAGAS (não a soma das barras): as três se sobrepõem no mesmo anúncio.
  let nuvem = $derived.by(() => {
    const n = vagas.filter((v: any) =>
      (v.asks || []).some((a: string) => ['AWS', 'Azure', 'GCP'].includes(a))
    ).length;
    const varias = vagas.filter((v: any) =>
      (v.asks || []).filter((a: string) => ['AWS', 'Azure', 'GCP'].includes(a)).length >= 2
    ).length;
    return { n, varias, pct: vagas.length ? Math.round((n * 100) / vagas.length) : 0 };
  });

  let semLacunaCount = $derived(vagas.filter((v: any) => !v.asks || v.asks.length === 0).length);

  function focarLacuna(req: string) {
    lacunaFoco = lacunaFoco === req ? null : req;
    mostrarTodas = true;
    aberta = null;
  }
</script>

<svelte:head>
  <title>Vagas de IA no Brasil — Patrick Campelo Serrano</title>
  <meta name="description" content="Catálogo auditado de vagas de IA no Brasil: o que cada anúncio realmente pede, com o trecho literal do requisito e a comparação com o meu perfil." />
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
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        Vagas de IA no Brasil
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {vagas.length} anúncios de IA aplicada, lidos por dentro. Cada requisito vem com o
        <strong>trecho literal do anúncio</strong> que o comprova — para você conferir, não confiar.
      </p>
      <p class="text-sm text-slate-500 dark:text-slate-500 mt-2">
        Coleta de {gerado} · Gupy, InfoJobs, Vagas.com, Programathor · classificados por título e descrição
      </p>
    </div>

    <!-- Legenda -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 mb-8">
      <div class="flex flex-wrap gap-x-8 gap-y-3 text-sm">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-slate-700 dark:text-slate-300"><strong>Cobre</strong> — o anúncio pede algo que já entreguei em produção</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="text-slate-700 dark:text-slate-300"><strong>Pede</strong> — requisito citado onde minha evidência é mais fraca</span>
        </div>
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-500 mt-3">
        O veredito compara o texto do anúncio com o que construí: agentes e orquestração, RAG com busca
        vetorial, LLM servido em produção, observabilidade, evals, SSO federado, on-prem. Onde eu não tenho
        evidência direta, digo <em>pede</em> em vez de fingir cobertura.
      </p>
    </div>

    <!-- Painel de lacunas -->
    <section class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 mb-8">
      <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h2 class="text-lg font-bold tracking-tight">Onde estão as lacunas</h2>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {vagas.length} vagas analisadas · {semLacunaCount} não pedem nada fora do meu perfil
        </span>
      </div>

      <p class="text-sm text-slate-600 dark:text-slate-400 mb-5">
        <strong>{nuvem.n} das {vagas.length} vagas pedem nuvem gerenciada</strong> (AWS, Azure ou GCP) —
        {nuvem.pct}% do total. E <strong>{nuvem.varias} delas listam duas ou três</strong>: o anúncio
        escreve a stack inteira, não a nuvem que usa. Na prática, <strong>são 5 lacunas, e 3 são a
        mesma</strong>: cloud.
      </p>

      <div class="space-y-2.5">
        {#each lacunas as l}
          {@const largura = Math.round((l.n * 100) / maxLacuna)}
          {@const ativa = lacunaFoco === l.req}
          <button
            type="button"
            onclick={() => focarLacuna(l.req)}
            class="w-full text-left group rounded-lg px-2 py-1 -mx-2 transition-colors {ativa ? 'bg-amber-50 dark:bg-amber-950/30 ring-1 ring-amber-300/60 dark:ring-amber-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}"
            title="Clique para ver as vagas que pedem {l.req}"
          >
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-semibold {['AWS','Azure','GCP'].includes(l.req) ? 'text-amber-700 dark:text-amber-500' : 'text-slate-700 dark:text-slate-300'}">
                {l.req}
                {#if ['AWS','Azure','GCP'].includes(l.req)}
                  <span class="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-amber-600/80 dark:text-amber-600">nuvem</span>
                {/if}
                {#if ativa}<span class="ml-2 text-[10px] font-normal text-amber-700 dark:text-amber-500">filtrado ✓</span>{/if}
              </span>
              <span class="tabular-nums text-slate-500 dark:text-slate-400">{l.n} <span class="text-xs">vagas</span></span>
            </div>
            <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full {['AWS','Azure','GCP'].includes(l.req) ? 'bg-amber-500' : 'bg-slate-400 dark:bg-slate-500'}"
                style="width: {largura}%"
              ></div>
            </div>
          </button>
        {/each}
      </div>

      <p class="text-xs text-slate-500 dark:text-slate-500 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        Clique numa lacuna para filtrar as vagas que a pedem. <strong>LangChain/LangGraph é a mais barata de
        fechar</strong> (biblioteca Python, e Python eu já uso); <strong>AWS</strong> dá o melhor retorno porque
        destrava as vagas de maior aderência. <strong>Java/Kotlin não conta</strong> — aparece em 1 vaga, como
        alternativa a TypeScript.
      </p>
      <a
        href="/vagas/estudar/"
        class="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        O que estudar para fechar essas lacunas — a trilha derivada destes mesmos dados
        <span aria-hidden="true">→</span>
      </a>
    </section>

    <!-- Filtros -->
    <div class="flex flex-wrap items-center gap-3 mb-8">
      <input
        type="search"
        bind:value={busca}
        placeholder="Filtrar por cargo, empresa ou requisito…"
        class="flex-1 min-w-[240px] px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
      <div class="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden text-sm">
        {#each MODES as m}
          <button
            type="button"
            onclick={() => (modo = m)}
            class="px-3.5 py-2.5 font-medium transition-colors {modo === m
              ? 'bg-indigo-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}"
          >
            {m === 'todas' ? 'Todos' : m}
          </button>
        {/each}
      </div>
      <label class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm cursor-pointer select-none">
        <input type="checkbox" bind:checked={semLacuna} onchange={() => { if (semLacuna) lacunaFoco = null; }} class="accent-indigo-600" />
        <span class="text-slate-600 dark:text-slate-400">Só sem lacuna</span>
      </label>
      {#if lacunaFoco}
        <button
          type="button"
          onclick={() => (lacunaFoco = null)}
          class="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 text-sm font-semibold text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
        >
          Lacuna: {lacunaFoco}
          <span aria-hidden="true">✕</span>
        </button>
      {/if}
    </div>

    <p class="text-sm text-slate-500 dark:text-slate-500 mb-4">
      {filtradas.length} {filtradas.length === 1 ? 'vaga' : 'vagas'}
      {#if !mostrarTodas && filtradas.length > LIMITE}· mostrando as {LIMITE} melhores{/if}
    </p>

    <!-- Lista -->
    <div class="space-y-3">
      {#each visiveis as v, i (v.url + i)}
        {@const isOpen = aberta === i}
        <article class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition duration-200 {isOpen ? 'shadow-lg dark:shadow-slate-950/60' : 'hover:shadow-md dark:hover:shadow-slate-950/40'}">
          <button type="button" onclick={() => toggle(i)} class="w-full text-left p-5">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0 flex-1">
                <h2 class="font-bold text-base md:text-lg leading-snug mb-1">{v.title}</h2>
                <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                  {#if v.company}<span class="font-medium text-slate-700 dark:text-slate-300">{v.company}</span>{/if}
                  {#if v.city}<span>· {v.city}</span>{/if}
                  {#if v.mode}<span>· {v.mode}</span>{/if}
                </div>
                <div class="flex flex-wrap gap-1.5 mt-3">
                  {#each v.covers.slice(0, 5) as c}
                    <span class="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">{c}</span>
                  {/each}
                  {#if v.covers.length > 5}
                    <span class="text-xs px-2 py-0.5 text-slate-500">+{v.covers.length - 5}</span>
                  {/if}
                </div>
                {#if v.asks && v.asks.length}
                  <div class="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span class="text-[11px] uppercase tracking-wide text-amber-700/80 dark:text-amber-600/90 font-semibold">Pede</span>
                    {#each v.asks.slice(0, 4) as a}
                      <span class="text-xs px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 font-medium">{a}</span>
                    {/each}
                    {#if v.asks.length > 4}
                      <span class="text-xs px-2 py-0.5 text-amber-600/70 dark:text-amber-600">+{v.asks.length - 4}</span>
                    {/if}
                  </div>
                {:else}
                  <div class="mt-1.5">
                    <span class="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-medium">
                      sem lacuna no anúncio
                    </span>
                  </div>
                {/if}
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                {#if v.asks && v.asks.length}
                  <span class="text-xs px-2 py-0.5 rounded-md font-bold tabular-nums bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300" title="{v.asks.length} requisito(s) fora do meu perfil">
                    {v.asks.length} lacuna{v.asks.length > 1 ? 's' : ''}
                  </span>
                {:else}
                  <span class="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">0</span>
                {/if}
                <span class="text-xs px-2 py-0.5 rounded-md font-semibold {cor(v.seniority)}">{v.seniority}</span>
                <span class="text-slate-400 text-lg leading-none transition-transform {isOpen ? 'rotate-180' : ''}">⌄</span>
              </div>
            </div>
          </button>

          {#if isOpen}
            <div class="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-5">
              {#if v.asks && v.asks.length}
                <div class="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <p class="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-500 mb-2">Pede — evidência mais fraca no meu perfil</p>
                  <div class="flex flex-wrap gap-1.5">
                    {#each v.asks as a}
                      <span class="text-xs px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">{a}</span>
                    {/each}
                  </div>
                </div>
              {/if}

              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">O que o anúncio pede, no texto dele</p>
              <div class="space-y-3">
                {#each Object.entries(v.evidence) as [req, trecho]}
                  <div class="border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    <p class="text-sm font-semibold {v.covers.includes(req) ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-500'}">{req}</p>
                    <p class="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed mt-0.5">"{trecho}"</p>
                  </div>
                {/each}
              </div>

              {#if v.url}
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
                >
                  Ver o anúncio completo
                  <span aria-hidden="true">↗</span>
                </a>
              {/if}
              <span class="text-xs text-slate-400 ml-3">fonte: {v.source}</span>
            </div>
          {/if}
        </article>
      {/each}
    </div>

    {#if filtradas.length === 0}
      <p class="text-center text-slate-500 py-16">Nenhuma vaga com esses filtros.</p>
    {/if}

    {#if !mostrarTodas && filtradas.length > LIMITE}
      <div class="text-center mt-8">
        <button
          type="button"
          onclick={() => (mostrarTodas = true)}
          class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Ver todas as {filtradas.length} vagas
        </button>
      </div>
    {/if}

    <p class="text-xs text-slate-400 dark:text-slate-500 mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      Classificação feita por título e pela descrição do anúncio. Requisitos detectados por busca textual no
      texto do anúncio — o trecho mostrado é o que casou. O veredito de cobertura compara os requisitos com o
      que eu já construí em produção; não substitui a leitura do anúncio, que está sempre linkado.
    </p>
  </main>
</div>
