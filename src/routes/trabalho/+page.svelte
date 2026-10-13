<script lang="ts">
  import ThemeToggle from '../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../components/LanguageSelector.svelte';
  import { _, currentLanguage } from '../../lib/simple-i18n';

  let { data } = $props();
  let companies = $derived(data.companies || []);

  // Card da empresa aberto no momento (acordeão: um por vez).
  let expanded = $state<string | null>(null);

  const getLoc = (field: any, lang: string) => {
    if (field && typeof field === 'object') {
      return field[lang] || field['pt'] || '';
    }
    return field || '';
  };

  const toggle = (id: string) => {
    expanded = expanded === id ? null : id;
  };
</script>

<svelte:head>
  <title>Projetos & Cases — Patrick Campelo Serrano</title>
  <meta name="description" content="Estudos de caso de engenharia de software sênior: Clojure, event-sourcing, trading de baixa latência e infraestrutura distribuída." />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <!-- Header -->
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
    <!-- Page Title -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        {$_('trabalho.title')}
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {$_('trabalho.subtitle')}
      </p>
    </div>

    <!-- Company Cards -->
    <div class="space-y-6">
      {#each companies as company (company.id)}
        {@const isOpen = expanded === company.id}
        {@const projects = company.projects || []}
        <section class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition duration-300 {isOpen ? 'shadow-xl dark:shadow-slate-950/60' : 'hover:shadow-xl dark:hover:shadow-slate-950/60'}">
          <!-- Company header: clickable -->
          <button
            type="button"
            class="w-full text-left p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
            aria-expanded={isOpen}
            aria-controls="company-panel-{company.id}"
            onclick={() => toggle(company.id)}
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 flex-wrap mb-4">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                    {getLoc(company.role, $currentLanguage)}
                  </span>
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {getLoc(company.status, $currentLanguage)}
                  </span>
                </div>
                <h2 class="text-2xl font-bold mb-2">
                  {getLoc(company.name, $currentLanguage)}
                </h2>
                <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                  {getLoc(company.subtitle, $currentLanguage)}
                </p>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                  {getLoc(company.excerpt, $currentLanguage)}
                </p>
              </div>

              <span
                class="shrink-0 mt-1 text-slate-400 dark:text-slate-500 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
                aria-hidden="true"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>

            <!-- Stack -->
            {#if company.stack && company.stack.length}
              <div class="flex flex-wrap gap-1.5 mt-5">
                {#each company.stack as tech}
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tech}
                  </span>
                {/each}
              </div>
            {/if}

            <div class="flex items-center gap-2 mt-5 text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {#if projects.length}
                <span>
                  {isOpen ? $_('trabalho.hideProjects') : $_('trabalho.showProjects')}
                  ({projects.length})
                </span>
                <span class="transition-transform duration-300 {isOpen ? 'translate-y-0.5' : '-translate-y-0.5'}">&darr;</span>
              {:else}
                <span class="text-slate-400 dark:text-slate-500 font-medium">{$_('trabalho.comingSoon')}</span>
              {/if}
            </div>
          </button>

          <!-- Expanded projects -->
          {#if isOpen && projects.length}
            <div
              id="company-panel-{company.id}"
              class="border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-6 md:p-8"
            >
              <div class="grid gap-5 md:grid-cols-2">
                {#each projects as project (project.id)}
                  <article class="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 hover:border-indigo-300 dark:hover:border-indigo-800 hover:shadow-md transition duration-300">
                    <h3 class="text-lg font-bold mb-1">
                      <a href="/trabalho/{project.id}/" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {getLoc(project.title, $currentLanguage)}
                      </a>
                    </h3>
                    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                      {getLoc(project.subtitle, $currentLanguage)}
                    </p>
                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed flex-1">
                      {getLoc(project.excerptShort || project.excerpt, $currentLanguage)}
                    </p>
                    <a
                      href="/trabalho/{project.id}/"
                      class="mt-5 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 group self-start"
                    >
                      {$_('trabalho.readDetailed')}
                      <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </a>
                  </article>
                {/each}
              </div>
            </div>
          {/if}
        </section>
      {/each}
    </div>
  </main>
</div>
