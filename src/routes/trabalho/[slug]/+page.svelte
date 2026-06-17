<script lang="ts">
  import ThemeToggle from '../../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../../components/LanguageSelector.svelte';
  import { _ } from '../../../lib/simple-i18n';
  
  // Props no Svelte 5 para data injetada do load
  let { data } = $props();
  let project = $derived(data.project);
</script>

<svelte:head>
  <title>{project.title} — Patrick Campelo Serrano</title>
  <meta name="description" content={project.excerpt} />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <!-- Header -->
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
        Patrick Campelo Serrano
      </a>
      <div class="flex items-center gap-4">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- Back Button -->
    <div class="mb-8">
      <a href="/trabalho/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
        <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
        {$_('nav.backToProjects')}
      </a>
    </div>

    <!-- Case Header -->
    <header class="mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between mb-4">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          {project.role}
        </span>
        <span class="text-sm font-mono text-slate-500 dark:text-slate-400">
          {project.status}
        </span>
      </div>

      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
        {project.title}
      </h1>
      <p class="text-xl text-slate-600 dark:text-slate-400 font-semibold mb-6">
        {project.subtitle}
      </p>

      <div class="flex flex-wrap gap-2">
        {#each project.stack as tech}
          <span class="px-3 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {tech}
          </span>
        {/each}
      </div>
    </header>

    <!-- Case Body -->
    <div class="space-y-12">
      <!-- Overview -->
      <section>
        <h2 class="text-2xl font-bold mb-4 tracking-tight border-l-4 border-indigo-500 pl-4">
          {$_('project.overview')}
        </h2>
        <p class="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          {project.details}
        </p>
      </section>

      <!-- Architecture -->
      <section class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <h2 class="text-2xl font-bold mb-4 tracking-tight text-indigo-600 dark:text-indigo-400">
          {$_('project.architecture')}
        </h2>
        <p class="text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {project.architecture}
        </p>
      </section>

      <!-- Diagrams -->
      {#if project.diagrams && project.diagrams.length > 0}
        <section>
          <h2 class="text-2xl font-bold mb-6 tracking-tight border-l-4 border-indigo-500 pl-4">
            Diagramas
          </h2>
          <div class="space-y-6">
            {#each project.diagrams as diagram}
              <div>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest mb-3">{diagram.title}</p>
                <div class="overflow-x-auto rounded-xl">
                  {@html diagram.svg}
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/if}

      <!-- Website Link -->
      {#if project.url}
        <section class="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">{$_('project.demo')}</h3>
            <p class="text-sm text-slate-500">{$_('project.demoDesc')}</p>
          </div>
          <a href={project.url} target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition text-sm">
            {$_('project.demoBtn')}
          </a>
        </section>
      {/if}

      <!-- Code Link -->
      {#if project.github}
        <section class="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">{$_('project.source')}</h3>
            <p class="text-sm text-slate-500">{$_('project.githubDesc')}</p>
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-950 font-bold transition text-sm">
            {$_('project.githubBtn')}
          </a>
        </section>
      {/if}
    </div>
  </main>
</div>
