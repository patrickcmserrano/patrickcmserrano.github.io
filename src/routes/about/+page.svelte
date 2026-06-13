<script lang="ts">
  import ThemeToggle from '../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../components/LanguageSelector.svelte';
  import { _ } from '../../lib/simple-i18n';
  import AboutHero from './components/AboutHero.svelte';
  import Skills from './components/Skills.svelte';
  import Experience from './components/Experience.svelte';
  import Education from './components/Education.svelte';
  import Contact from './components/Contact.svelte';
</script>

<svelte:head>
  <title>{$_('about.hero.title')} — Patrick Campelo Serrano</title>
  <meta name="description" content="Conheça a trajetória profissional de Patrick Campelo Serrano, engenheiro de software sênior com especialidade em Clojure, sistemas distribuídos e de pagamento." />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <!-- Header -->
  <header class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
    <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Patrick Campelo Serrano
      </a>
      <div class="flex items-center gap-6">
        <a href="/" class="text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          {$_('nav.backToHome')}
        </a>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-5xl mx-auto px-4 py-8 space-y-16">
    <AboutHero />
    <Skills />
    <Experience />
    <Education />
    <Contact />
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
    <div class="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="text-sm text-slate-500 dark:text-slate-400 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Patrick Campelo Serrano. {$_('footer.copyright')}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">Desenvolvido com SvelteKit SSG & Tailwind CSS.</p>
      </div>
      <div class="flex items-center gap-6">
        <a href="https://github.com/patrickcmserrano" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/patrickcmserrano/" target="_blank" rel="noopener noreferrer" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          LinkedIn
        </a>
        <a href="mailto:patrickcmserrano@protonmail.com" class="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          Contato
        </a>
      </div>
    </div>
  </footer>
</div>
