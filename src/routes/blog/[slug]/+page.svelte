<script lang="ts">
  import ThemeToggle from '../../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../../components/LanguageSelector.svelte';
  
  // Props no Svelte 5 para data injetada do load
  let { data } = $props();
  let metadata = $derived(data.metadata);
  let html = $derived(data.html);
</script>

<svelte:head>
  <title>{metadata.title} — Patrick Campelo Serrano</title>
  <meta name="description" content={metadata.excerpt} />
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
      <a href="/blog/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
        <span class="group-hover:-translate-x-1 transition-transform">&larr;</span> 
        Voltar para todos os artigos
      </a>
    </div>

    <!-- Article Header -->
    <header class="mb-10 pb-8 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
        <span>{new Date(metadata.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>•</span>
        <span>{metadata.readTime || '10 min'}</span>
      </div>

      <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
        {metadata.title}
      </h1>

      <div class="flex flex-wrap gap-2">
        {#each metadata.tags as tag}
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            {tag}
          </span>
        {/each}
      </div>
    </header>

    <!-- Article Content -->
    <article class="prose prose-slate dark:prose-invert max-w-none md:prose-lg prose-pre:bg-slate-900 dark:prose-pre:bg-slate-900/60 prose-pre:border prose-pre:border-slate-800 prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl">
      {@html html}
    </article>
  </main>
</div>

<style>
  /* Custom overrides for smooth typography */
  :global(.prose) {
    --tw-prose-body: var(--app-text);
  }
  
  /* Garantir que blocos de código ocupem toda a largura e tenham scroll horizontal */
  :global(pre) {
    overflow-x: auto;
    padding: 1.25rem;
    border-radius: 0.75rem;
    font-size: 0.9em;
  }
  
  :global(code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }
</style>
