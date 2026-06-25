<script lang="ts">
  import ThemeToggle from '../../components/ThemeToggle.svelte';
  import LanguageSelector from '../../components/LanguageSelector.svelte';
  import MusicPlayer from '../../components/MusicPlayer.svelte';
  import Section from '../../components/Section.svelte';
  import { _ } from '../../lib/simple-i18n';
  import { onMount } from 'svelte';
  import Icon from '../../lib/Icon.svelte';
  import { FaLink } from 'svelte-icons/fa';

  // Carrega os dados do arquivo links.json
  import * as linksDataModule from '../../data/links.json';
  
  const linksData = linksDataModule;
  let profile = linksData.profile;
  let sections = linksData.sections;
  
  // Função para ajustar caminhos de imagens com o caminho base
  const getImagePath = (path: string): string => {
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const baseUrl = import.meta.env?.BASE_URL || '/';
    return baseUrl + cleanPath;
  };

  // Calcular o layout baseado na largura da tela
  let windowWidth = $state(0);
  let currentLayout = $state<'grid' | 'list'>('list');
  let layoutTransitioning = $state(false);
  
  // Efeito reativo para ajustar layout baseado na largura
  $effect(() => {
    const newLayout = windowWidth >= 1024 ? ('grid' as const) : ('list' as const);
    if (currentLayout !== newLayout) {
      layoutTransitioning = true;
      const timer = setTimeout(() => {
        currentLayout = newLayout;
        layoutTransitioning = false;
      }, 300);
      return () => clearTimeout(timer);
    }
  });
  
  onMount(() => {
    windowWidth = window.innerWidth;
    currentLayout = windowWidth >= 1024 ? ('grid' as const) : ('list' as const);
    
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        windowWidth = window.innerWidth;
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  });
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
  <title>LinkFlow — Patrick Campelo Serrano</title>
  <meta name="description" content="Agregador de links profissionais, redes sociais e projetos em destaque." />
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
  <main class="mx-auto px-4 py-6 space-y-6 app-container">
    <div class="header-controls">
      <div class="left-controls">
        <LanguageSelector />
      </div>
      <div class="center-controls">
        <MusicPlayer 
          playlistId="PL71Q6dgIfRPE1ouM6x8mwsmMX4siQhfrf"
        />
      </div>
      <div class="right-controls">
        <ThemeToggle />
      </div>
    </div>
    
    <!-- Profile Container -->
    <div class="profile mb-8 transition-all duration-300 ease-in-out">
      <div class="profile-container bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div class="avatar-section">
          <div class="avatar-container rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
            <img src={getImagePath(profile.avatar)} alt={profile.name} class="hidden dark:block w-full h-full object-cover" />
            <img src={getImagePath('/images/profile_light.jpg')} alt={profile.name} class="block dark:hidden w-full h-full object-cover" />
          </div>
        </div>
        <div class="info-section text-center md:text-left mt-4 md:mt-0">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              {profile.name}
            </h1>
          </div>
          <p class="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-md">
            {$_('app.subtitle') || 'Engenharia de Software'}
          </p>
          <div class="mt-4">
            <a href="/" class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
              &larr; Voltar para a Home Principal
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Sections Grid -->
    <div class="sections-container" class:transitioning={layoutTransitioning}>
      {#each sections as section}
        <Section 
          name={section.name} 
          color={section.color} 
          links={section.links.map(link => ({
            ...link,
            icon: getImagePath(link.icon)
          }))}
          layout={currentLayout}
        />
      {/each}
    </div>
    
    <footer class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
      <p class="text-xs text-slate-500 dark:text-slate-500">{$_('footer.copyright')}</p>
    </footer>
  </main>
</div>

<style>
  .app-container {
    width: 100%;
    max-width: 420px; /* Mobile first */
  }
  
  @media (min-width: 768px) {
    .app-container {
      max-width: 720px;
    }
  }
  
  @media (min-width: 1024px) {
    .app-container {
      max-width: 960px;
    }
  }
  
  @media (min-width: 1280px) {
    .app-container {
      max-width: 1140px;
    }
  }
  
  .sections-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    transition: all 0.3s ease-in-out;
  }
  
  .sections-container.transitioning {
    opacity: 0.8;
    transform: scale(0.98);
  }
  
  @media (min-width: 1024px) {
    .sections-container {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }
  
  /* Estilos para o cabeçalho com controles */
  .header-controls {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 0.5rem 0;
  }
  
  .left-controls {
    justify-self: start;
  }
  
  .center-controls {
    justify-self: center;
  }
  
  .right-controls {
    justify-self: end;
  }
  
  @media (max-width: 640px) {
    .header-controls {
      grid-template-columns: 1fr;
      gap: 0.75rem;
      text-align: center;
    }
    
    .left-controls,
    .center-controls,
    .right-controls {
      justify-self: center;
    }
  }
  
  /* Perfil responsivo */
  .profile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-section {
    margin-bottom: 1rem;
  }
  
  .avatar-container {
    width: 6rem;
    height: 6rem;
    margin: 0 auto;
  }
  
  @media (min-width: 768px) {
    .profile-container {
      flex-direction: row;
      text-align: left;
      gap: 2rem;
      align-items: center;
    }
    
    .avatar-section {
      margin-bottom: 0;
    }
    
    .avatar-container {
      width: 7rem;
      height: 7rem;
    }
    
    .info-section {
      flex: 1;
    }
  }
</style>
