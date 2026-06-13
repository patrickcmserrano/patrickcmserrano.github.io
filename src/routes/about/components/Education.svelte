<script lang="ts">
  import { _ } from '../../../lib/simple-i18n';
</script>

<section class="py-12 md:py-16">
  <h2 class="text-3xl font-extrabold tracking-tight mb-12 text-center text-slate-900 dark:text-white">
    {$_('about.education.title')}
  </h2>

  <div class="mx-auto max-w-3xl px-4 space-y-6">
    <div class="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md">
      <h3 class="text-xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"></path>
        </svg>
        {$_('about.education.academicFormation')}
      </h3>
      
      <div class="space-y-8">
        <!-- Software Engineering -->
        <div class="relative pl-4 border-l-2 border-indigo-500">
          <h4 class="text-lg font-bold text-slate-900 dark:text-white">
            {$_('about.education.softwareEngineering')}
          </h4>
          <p class="text-slate-600 dark:text-slate-400 font-medium">
            Faculdade Descomplica • 2024 - {$_('general.present')}
          </p>
        </div>

        <!-- Computer Science -->
        <div class="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">
              {$_('about.education.computerScience')}
            </h4>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
              {$_('about.education.incomplete')}
            </span>
          </div>
          <p class="text-slate-600 dark:text-slate-400 font-medium">
            Universidade Federal Fluminense • 2022 - 2023
          </p>
        </div>

        <!-- Physics -->
        <div class="relative pl-4 border-l-2 border-slate-300 dark:border-slate-700">
          <div class="flex items-center gap-2 flex-wrap">
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">
              {$_('about.education.physics')}
            </h4>
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
              {$_('about.education.incomplete')}
            </span>
          </div>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-1">
            Universidade Federal Fluminense • 2015 - 2018
          </p>
          <p class="text-sm text-slate-500 dark:text-slate-500 italic">
            {$_('about.education.physicsNote')}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
