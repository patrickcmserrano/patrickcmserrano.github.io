<script lang="ts">
  import { _ } from '../../../lib/simple-i18n';
</script>

<section class="py-12 md:py-16">
  <h2 class="text-3xl font-extrabold tracking-tight mb-12 text-center text-slate-900 dark:text-white">
    {$_('skills.title')}
  </h2>
  
  <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 px-4">
    <!-- Languages & Core -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <h3 class="text-xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 pb-3">
        {$_('skills.languages')}
      </h3>
      <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium">
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Clojure / ClojureScript
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Java
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          JavaScript / TypeScript
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Golang
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          Python
        </li>
      </ul>
    </div>

    <!-- Frameworks & Libraries -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <h3 class="text-xl font-bold mb-6 text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-800 pb-3">
        {$_('skills.frameworks')}
      </h3>
      <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium">
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Polylith / Reitit / Pathom
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Fulcro / Fulcro-RAD
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          React / React Native
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Reagent / Re-frame
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Svelte / SvelteKit
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Malli / Datomic
        </li>
      </ul>
    </div>

    <!-- Infrastructure & Tools -->
    <div class="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <h3 class="text-xl font-bold mb-6 text-pink-600 dark:text-pink-400 border-b border-slate-100 dark:border-slate-800 pb-3">
        {$_('skills.cloud')}
      </h3>
      <ul class="space-y-3 text-slate-600 dark:text-slate-400 font-medium">
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
          AWS / Cognito
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
          Docker / Kubernetes
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
          RabbitMQ / Kafka
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
          Elastic Stack (ELK)
        </li>
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
          Prometheus / Grafana
        </li>
      </ul>
    </div>
  </div>
</section>
