<script lang="ts">
  import ThemeToggle from '../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../components/LanguageSelector.svelte';
  import { _ } from '../../lib/simple-i18n';
  
  // Props no Svelte 5 para data injetada do load
  let { data } = $props();
  let posts = $derived(data.posts || []);

  let searchTerm = $state('');
  let selectedTag = $state('');

  // Computa todas as tags disponíveis
  let allTags = $derived([
    ...new Set(posts.flatMap((p: any) => p.tags || []))
  ].sort());

  // Filtra os posts com base na busca e tag selecionada
  let filteredPosts = $derived(
    posts.filter((post: any) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    })
  );

  function selectTag(tag: string) {
    selectedTag = selectedTag === tag ? '' : tag;
  }
</script>

<svelte:head>
  <title>Blog — Patrick Campelo Serrano</title>
  <meta name="description" content="Artigos sobre Engenharia de Software, Clojure, Sistemas Event-Driven e Mercado Financeiro." />
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
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
        {$_('blog.title')}
      </h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {$_('blog.subtitle')}
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-10 space-y-4">
      <div class="relative">
        <input 
          type="text" 
          placeholder={$_('blog.searchPlaceholder')} 
          bind:value={searchTerm}
          class="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
        />
      </div>

      <!-- Tag Filters -->
      <div class="flex flex-wrap gap-2 pt-2">
        {#each allTags as tag}
          <button 
            onclick={() => selectTag(tag)}
            class="px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer
              {selectedTag === tag 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }"
          >
            {tag}
          </button>
        {/each}
      </div>
    </div>

    <!-- Articles Grid -->
    {#if filteredPosts.length > 0}
      <div class="grid gap-8 md:grid-cols-2">
        {#each filteredPosts as post}
          <article class="flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:shadow-lg dark:hover:shadow-slate-950/40 hover:-translate-y-1 transition duration-300">
            <div class="p-6 md:p-8 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
                  <span>{new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{post.readTime || '10 min'}</span>
                </div>
                <h2 class="text-xl font-bold mb-3 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <a href="/blog/{post.id}/">{post.title}</a>
                </h2>
                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6">
                  {post.excerpt}
                </p>
              </div>

              <div>
                <div class="flex flex-wrap gap-1.5 mb-4">
                  {#each post.tags as tag}
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {tag}
                    </span>
                  {/each}
                </div>
                <a href="/blog/{post.id}/" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 group">
                  {$_('home.readArticle')} 
                  <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </a>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {:else}
      <div class="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
        <p class="text-slate-500 dark:text-slate-400 text-lg">
          {$_('blog.noArticles')}
        </p>
      </div>
    {/if}
  </main>
</div>
