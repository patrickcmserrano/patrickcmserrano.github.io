<script lang="ts">
  import { _ } from '../../../lib/simple-i18n';
</script>

<section class="py-12 md:py-20 text-center">
  <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
    <span class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
      {$_('about.hero.title')}
    </span>
  </h1>
  <div class="mb-10 flex justify-center">
    <div class="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0">
      <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-20 dark:opacity-30"></div>
      <div class="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl">
        <img src="/images/profile.jpg" alt="Patrick Campelo Serrano" class="hidden dark:block h-full w-full object-cover" />
        <img src="/images/profile_light.jpg" alt="Patrick Campelo Serrano" class="block dark:hidden h-full w-full object-cover" />
      </div>
    </div>
  </div>
  <div class="mx-auto max-w-3xl space-y-6 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed px-4">
    <p>
      {$_('about.hero.description1')}
    </p>
    <p>
      {$_('about.hero.description2')}
    </p>
  </div>
</section>
