<script lang="ts">
  import ThemeToggle from '../components/ThemeToggle.svelte';
  import LanguageSelector from '../components/LanguageSelector.svelte';
  import BlackHoleToggle from '../components/BlackHoleToggle.svelte';
  import DensidadeRepos from '../components/DensidadeRepos.svelte';
  import { openBlackHole, setAmbientCenterTarget } from '../lib/blackhole';
  import { _, currentLanguage } from '../lib/simple-i18n';
  
  // Props no Svelte 5 para receber dados do servidor
  let { data } = $props();
  let featuredProjects = $derived(data.featuredProjects || []);
  let recentPosts = $derived(data.recentPosts || []);

  let heroPortalEl: HTMLElement | null = $state(null);

  $effect(() => {
    if (typeof window === 'undefined') return;

    const updateTarget = () => {
      if (!heroPortalEl) {
        setAmbientCenterTarget(null);
        return;
      }
      const rect = heroPortalEl.getBoundingClientRect();
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w <= 0 || h <= 0) return;

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const ndcX = (cx / w) * 2 - 1;
      const rawNdcY = 1.0 - 2.0 * (cy / h);

      // When scrollY is 0 (hero in view), rawNdcY centers the black hole exactly in the frame.
      // When scrolling down, smoothly blend towards 0 (vertical center of viewport) so it stays visible as background.
      const scrollProgress = Math.min(1, Math.max(0, window.scrollY / (h * 0.75)));
      const ndcY = rawNdcY * (1 - scrollProgress) + 0.0 * scrollProgress;

      setAmbientCenterTarget({ ndcX, ndcY });
    };

    updateTarget();

    const ro = new ResizeObserver(updateTarget);
    if (heroPortalEl) ro.observe(heroPortalEl);

    window.addEventListener('resize', updateTarget, { passive: true });
    window.addEventListener('scroll', updateTarget, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('scroll', updateTarget);
      setAmbientCenterTarget(null);
    };
  });

  const getLoc = (field: any, lang: string) => {
    if (field && typeof field === 'object') {
      return field[lang] || field['pt'] || '';
    }
    return field || '';
  };
</script>

<svelte:head>
  <title>Patrick Campelo Serrano — {$_('app.subtitle') || 'Engenharia de Software'}</title>
  <meta name="description" content="Engenheiro Clojure/ClojureScript Sênior especialista em sistemas distribuídos, event-driven, quant-trading e arquiteturas minimalistas." />
</svelte:head>

<div class="min-h-screen bg-slate-50/90 dark:bg-transparent text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <!-- Header -->
  <header class="border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
        <div class="flex items-center gap-3 md:gap-4">
          <BlackHoleToggle />
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>

  <!-- Hero Section (Texto de um lado, Objeto Celeste do outro) -->
  <section class="max-w-6xl mx-auto px-4 sm:px-6 min-h-[calc(100vh-5rem)] flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-14 py-12 md:py-16">
    <!-- Left Column: Typography & Actions -->
    <div class="flex-1 max-w-xl space-y-6 text-left">
      <!-- Eyebrow: Dourado elegante e status -->
      <div class="flex flex-wrap items-center gap-3">
        <p class="text-xs sm:text-sm font-semibold tracking-wider uppercase text-amber-500 dark:text-[#e5c158]">
          {$_('home.eyebrow') || 'Engenharia de Software • Sistemas Distribuídos'}
        </p>
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {$_('home.status')}
        </div>
      </div>
      
      <!-- H1 Titular -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
        Patrick Campelo Serrano
      </h1>
      
      <!-- Subtitle / Tagline -->
      <p class="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight text-slate-700 dark:text-[#d2d2d7] leading-snug">
        {$_('home.hero1')} {$_('home.hero2')}
      </p>

      <!-- Bio Descritiva -->
      <p class="text-base md:text-lg text-slate-600 dark:text-[#a1a1a6] leading-relaxed">
        {$_('home.bio')}
      </p>

      <!-- Botões Pílula Estilo Apple -->
      <div class="flex flex-wrap items-center gap-2.5 pt-2">
        <a 
          href="/trabalho/" 
          class="bg-[#0071e3] hover:bg-[#0077ed] text-white inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm sm:text-base font-normal tracking-tight shadow-lg shadow-blue-500/25 transition duration-200 active:scale-[0.97]"
        >
          {$_('home.projectsBtn')}
          <span class="text-sm">&rarr;</span>
        </a>
        <a 
          href="/about/" 
          class="bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm sm:text-base font-normal tracking-tight transition duration-200 active:scale-[0.97] shadow-sm"
        >
          {$_('nav.about')}
        </a>
        <a 
          href="/blog/" 
          class="bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 inline-flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-2.5 text-sm sm:text-base font-normal tracking-tight transition duration-200 active:scale-[0.97]"
        >
          {$_('home.blogBtn')}
        </a>
        <a 
          href="/links/" 
          class="bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300/80 dark:border-white/15 inline-flex items-center gap-1.5 rounded-full px-4 sm:px-5 py-2.5 text-sm sm:text-base font-normal tracking-tight transition duration-200 active:scale-[0.97]"
        >
          {$_('home.linksBtn')}
        </a>
      </div>

      <!-- Redes Sociais Minimalistas -->
      <ul class="flex items-center gap-1 pt-2">
        <li>
          <a
            href="https://www.linkedin.com/in/patrickcmserrano/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            class="flex size-10 items-center justify-center rounded-full text-slate-500 dark:text-[#a1a1a6] hover:bg-slate-200/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/patrickcmserrano"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="flex size-10 items-center justify-center rounded-full text-slate-500 dark:text-[#a1a1a6] hover:bg-slate-200/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/@pat_rocks"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Pat Rocks"
            class="flex size-10 items-center justify-center rounded-full text-slate-500 dark:text-[#a1a1a6] hover:bg-slate-200/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/@codecraft_ofc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube CodeCraft"
            class="flex size-10 items-center justify-center rounded-full text-slate-500 dark:text-[#a1a1a6] hover:bg-slate-200/70 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </a>
        </li>
      </ul>
    </div>

    <!-- Right Column: Objeto Celeste (Sagittarius A* 3D Simulation) -->
    <div class="w-full md:w-1/2 h-[340px] sm:h-[400px] md:h-[460px] lg:h-[500px] relative flex items-center justify-center group pointer-events-auto">
      <!-- Glow cósmico de ambiência -->
      <div class="absolute inset-0 bg-radial from-amber-500/15 via-indigo-950/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <!-- Portal translúcido cósmico -->
      <div
        bind:this={heroPortalEl}
        onclick={openBlackHole}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && openBlackHole()}
        role="button"
        tabindex="0"
        aria-label="Expandir simulação de Sagittarius A*"
        class="relative w-full h-full rounded-3xl overflow-hidden border border-slate-200/40 dark:border-white/10 shadow-2xl backdrop-blur-[0.5px] bg-white/5 dark:bg-white/[0.02] cursor-pointer transition-colors duration-300 group-hover:border-amber-400/40"
      >
        <!-- Botão sutil de acionamento em tela cheia -->
        <div class="absolute bottom-4 right-4 pointer-events-auto">
          <button
            type="button"
            onclick={(e) => { e.stopPropagation(); openBlackHole(); }}
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/70 hover:bg-black/90 text-amber-300 border border-amber-400/30 backdrop-blur-md transition-all shadow-lg hover:border-amber-400/70 cursor-pointer active:scale-95"
            aria-label="Expandir simulação do buraco negro"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span class="font-mono text-[11px]">Sagittarius A* • 3D</span>
            <svg class="w-3.5 h-3.5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Projects Section -->
  <section class="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/10 py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
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

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {#each featuredProjects as project}
          <div class="flex flex-col bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-lg transition duration-300">
            <h3 class="text-xl font-bold mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <a href="/trabalho/{project.id}/">{getLoc(project.title, $currentLanguage)}</a>
            </h3>
            <p class="text-xs font-semibold text-slate-500 mb-3">{getLoc(project.subtitle, $currentLanguage)}</p>
            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
              {getLoc(project.excerpt, $currentLanguage)}
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
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
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

  <!-- Densidade por Repositório -->
  <section class="border-t border-slate-200 dark:border-slate-800 py-20">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <h2 class="text-3xl font-extrabold tracking-tight mb-2">{$_('home.density.title')}</h2>
      <p class="text-slate-600 dark:text-slate-400 mb-10">{$_('home.density.subtitle')}</p>
      <DensidadeRepos />
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Patrick Campelo Serrano. {$_('footer.copyright')}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Desenvolvido com SvelteKit SSG & Tailwind CSS (copilotado pelo Gemini 3.5 Flash AGY).</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="https://nexus-quantitative.github.io/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          Nexus Quant
        </a>
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
