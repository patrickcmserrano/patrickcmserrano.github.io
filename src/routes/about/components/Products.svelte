<script lang="ts">
  import { _ } from '../../../lib/simple-i18n';

  const products = [
    {
      id: 'rohana',
      titleKey: 'about.products.rohana.title',
      taglineKey: 'about.products.rohana.tagline',
      descKey: 'about.products.rohana.description',
      badge: 'IA & Agentes',
      stack: ['Clojure', 'Pathom 3', 'Aeron IPC', 'TurboVec', 'Qdrant', 'LGPD by Design'],
      url: 'https://patrickcmserrano.github.io/rohana/',
      external: true,
      btnLabelKey: 'about.products.viewProject',
      gradient: 'from-purple-500/10 via-indigo-500/10 to-blue-500/10 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30',
      borderAccent: 'hover:border-purple-500/50 dark:hover:border-purple-400/50'
    },
    {
      id: 'nexus',
      titleKey: 'about.products.nexus.title',
      taglineKey: 'about.products.nexus.tagline',
      descKey: 'about.products.nexus.description',
      badge: 'Trading Quant & Sistemas',
      stack: ['Go', 'Clojure', 'XTDB', 'NATS JetStream', 'Svelte 5', 'Wails v2'],
      url: 'https://nexus-quantitative.github.io/',
      external: true,
      btnLabelKey: 'about.products.viewProject',
      gradient: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30',
      borderAccent: 'hover:border-emerald-500/50 dark:hover:border-emerald-400/50'
    },
    {
      id: 'aifactory',
      titleKey: 'about.products.aifactory.title',
      taglineKey: 'about.products.aifactory.tagline',
      descKey: 'about.products.aifactory.description',
      badge: 'Infraestrutura & Plataforma Privada',
      stack: ['Go', 'vLLM', 'Slurm', 'Keycloak SSO', 'OpenLDAP', 'FreeBSD Jails'],
      url: '/trabalho/ai-factory/',
      external: false,
      btnLabelKey: 'about.products.viewCase',
      gradient: 'from-indigo-500/10 via-sky-500/10 to-violet-500/10 dark:from-indigo-950/30 dark:via-sky-950/30 dark:to-violet-950/30',
      borderAccent: 'hover:border-indigo-500/50 dark:hover:border-indigo-400/50'
    }
  ];
</script>

<section class="py-12 md:py-16">
  <div class="text-center mb-12">
    <h2 class="text-3xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
      {$_('about.products.title')}
    </h2>
    <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-base md:text-lg">
      {$_('about.products.subtitle')}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
    {#each products as product (product.id)}
      <div class="group flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden {product.borderAccent}">
        <!-- Top decorative ambient glow -->
        <div class="absolute inset-0 bg-gradient-to-br {product.gradient} opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

        <div class="relative z-10 flex-1">
          <div class="flex items-center justify-between gap-2 mb-4">
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {product.badge}
            </span>
          </div>

          <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {$_(product.titleKey)}
          </h3>

          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
            {$_(product.taglineKey)}
          </p>

          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {$_(product.descKey)}
          </p>
        </div>

        <div class="relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <!-- Stack tags -->
          <div class="flex flex-wrap gap-1.5 mb-6">
            {#each product.stack as tech}
              <span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                {tech}
              </span>
            {/each}
          </div>

          <!-- Action Button -->
          {#if product.external}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm transition duration-200"
            >
              <span>{$_(product.btnLabelKey)}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"></path>
              </svg>
            </a>
          {:else}
            <a
              href={product.url}
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-sm transition duration-200"
            >
              <span>{$_(product.btnLabelKey)}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
              </svg>
            </a>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</section>
