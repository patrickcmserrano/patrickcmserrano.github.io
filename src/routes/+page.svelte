<script lang="ts">
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import LanguageSelector from '../components/LanguageSelector.svelte';
  import { _ } from '../lib/simple-i18n';
  
  // Props no Svelte 5 para receber dados do servidor
  let { data } = $props();
  let featuredProjects = $derived(data.featuredProjects || []);
  let recentPosts = $derived(data.recentPosts || []);
</script>

<svelte:head>
  <title>Patrick Campelo Serrano — {$_('app.subtitle') || 'Engenharia de Software'}</title>
  <meta name="description" content="Engenheiro Clojure/ClojureScript Sênior especialista em sistemas distribuídos, event-driven, quant-trading e arquiteturas minimalistas." />
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

  <!-- Hero Section -->
  <section class="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
    <div class="flex-1 space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        {$_('home.status')}
      </div>
      
      <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
        {$_('home.hero1')} <br />
        <span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          {$_('home.hero2')}
        </span>
      </h1>
      
      <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
        {$_('home.bio')}
      </p>

      <!-- CTAs -->
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
        <a href="/trabalho/" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition cursor-pointer text-sm">
          {$_('home.projectsBtn')}
        </a>
        <a href="/blog/" class="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold transition cursor-pointer text-sm">
          {$_('home.blogBtn')}
        </a>
        <a href="/links/" class="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold transition cursor-pointer text-sm">
          {$_('home.linksBtn')}
        </a>
      </div>
    </div>

    <!-- Avatar / Decorative Graphique -->
    <div class="relative w-64 h-64 md:w-80 md:h-80 flex-shrink-0">
      <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 dark:opacity-30"></div>
      <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
        <img src="/images/profile.jpg" alt="Patrick Campelo Serrano" class="w-full h-full object-cover" />
      </div>
    </div>
  </section>

  <!-- Featured Projects Section -->
  <section class="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/10 py-20">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight mb-2">{$_('home.featuredProjects')}</h2>
          <p class="text-slate-600 dark:text-slate-400">{$_('home.projectsSubtitle')}</p>
        </div>
        <a href="/trabalho/" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 md:mt-0 inline-flex items-center gap-1 group">
          {$_('home.allProjects')} 
          <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        {#each featuredProjects as project}
          <div class="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition duration-300">
            <h3 class="text-xl font-bold mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <a href="/trabalho/{project.id}/">{project.title}</a>
            </h3>
            <p class="text-xs font-semibold text-slate-500 mb-3">{project.subtitle}</p>
            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
              {project.excerpt}
            </p>
            <div class="flex flex-wrap gap-1 mb-4">
              {#each project.stack.slice(0, 3) as tech}
                <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {tech}
                </span>
              {/each}
              {#if project.stack.length > 3}
                <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                  +{project.stack.length - 3}
                </span>
              {/if}
            </div>
            <a href="/trabalho/{project.id}/" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              {$_('home.exploreCase')} &rarr;
            </a>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Recent Articles Section -->
  <section class="border-t border-slate-200 dark:border-slate-800 py-20">
    <div class="max-w-5xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight mb-2">{$_('home.recentArticles')}</h2>
          <p class="text-slate-600 dark:text-slate-400">{$_('home.articlesSubtitle')}</p>
        </div>
        <a href="/blog/" class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-4 md:mt-0 inline-flex items-center gap-1 group">
          {$_('home.allArticles')} 
          <span class="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </a>
      </div>

      <div class="space-y-6">
        {#each recentPosts as post}
          <article class="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition duration-200 gap-4">
            <div>
              <div class="flex items-center gap-3 text-xs text-slate-500 mb-2 font-mono">
                <span>{new Date(post.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <h3 class="text-lg font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <a href="/blog/{post.id}/">{post.title}</a>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            <a href="/blog/{post.id}/" class="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">
              {$_('home.readArticle')} &rarr;
            </a>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
    <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Patrick Campelo Serrano. {$_('footer.copyright')}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Desenvolvido com SvelteKit SSG & Tailwind CSS (copilotado pelo Gemini 3.5 Flash AGY).</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="https://github.com/patrickcmserrano" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/patrickcmserrano/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          LinkedIn
        </a>
        <a href="mailto:patrickcmserrano@gmail.com" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          Contato
        </a>
      </div>
    </div>
  </footer>
</div>
