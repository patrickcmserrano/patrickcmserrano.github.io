<script lang="ts">
  import { _ } from '../../../lib/simple-i18n';
</script>

<section class="py-12 md:py-16">
  <h2 class="text-3xl font-extrabold tracking-tight mb-16 text-center text-slate-900 dark:text-white">
    {$_('about.experience.title')}
  </h2>

  <div class="max-w-4xl mx-auto px-4 relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-auto">
    <!-- Senior Position -->
    <div class="mb-16 relative pl-6 md:pl-8">
      <!-- Timeline node -->
      <span class="absolute -left-[11px] top-1.5 flex h-5 h-5 w-5 items-center justify-center rounded-full bg-indigo-500 ring-8 ring-slate-50 dark:ring-slate-950">
        <span class="h-2 w-2 rounded-full bg-white"></span>
      </span>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
            {$_('about.experience.senior.title')}
          </h3>
          <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {$_('about.experience.senior.company')}
          </p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 self-start md:self-auto">
          {$_('about.experience.senior.period')}
        </span>
      </div>

      <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {$_('about.experience.senior.description')}
      </p>

      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">
          {$_('about.experience.senior.achievements')}
        </h4>
        <ul class="space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement1')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement2')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement3')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement4')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement5')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.senior.achievement6')}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Junior Position -->
    <div class="mb-16 relative pl-6 md:pl-8">
      <!-- Timeline node -->
      <span class="absolute -left-[11px] top-1.5 flex h-5 h-5 w-5 items-center justify-center rounded-full bg-indigo-500 ring-8 ring-slate-50 dark:ring-slate-950">
        <span class="h-2 w-2 rounded-full bg-white"></span>
      </span>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
            {$_('about.experience.junior.title')}
          </h3>
          <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {$_('about.experience.junior.company')}
          </p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 self-start md:self-auto">
          {$_('about.experience.junior.period')}
        </span>
      </div>

      <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {$_('about.experience.junior.description')}
      </p>

      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">
          {$_('about.experience.junior.achievements')}
        </h4>
        <ul class="space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.junior.achievement1')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.junior.achievement2')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.junior.achievement3')}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Intern Position -->
    <div class="relative pl-6 md:pl-8">
      <!-- Timeline node -->
      <span class="absolute -left-[11px] top-1.5 flex h-5 h-5 w-5 items-center justify-center rounded-full bg-indigo-500 ring-8 ring-slate-50 dark:ring-slate-950">
        <span class="h-2 w-2 rounded-full bg-white"></span>
      </span>
      
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-white">
            {$_('about.experience.intern.title')}
          </h3>
          <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
            {$_('about.experience.intern.company')}
          </p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 self-start md:self-auto">
          {$_('about.experience.intern.period')}
        </span>
      </div>

      <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
        {$_('about.experience.intern.description')}
      </p>

      <div class="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80">
        <h4 class="font-bold text-slate-900 dark:text-white mb-4">
          {$_('about.experience.intern.achievements')}
        </h4>
        <ul class="space-y-4 text-slate-600 dark:text-slate-400 text-sm md:text-base">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.intern.achievement1')}</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
            </svg>
            <span>{@html $_('about.experience.intern.achievement2')}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
