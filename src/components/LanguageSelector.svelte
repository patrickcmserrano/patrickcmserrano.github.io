<script lang="ts">
  import { currentLanguage, setLanguage } from '../lib/simple-i18n';
  
  function handleLanguageChange(lang: 'pt' | 'en' | 'es') {
    setLanguage(lang);
  }

  // Gets the current language
  let currentLocale: string = 'pt';
  
  currentLanguage.subscribe(value => {
    currentLocale = value;
  });
</script>

<div class="language-selector" role="group" aria-label="Seletor de idioma">
  <button 
    class={currentLocale === 'en' ? 'active' : ''} 
    on:click={() => handleLanguageChange('en')}
    aria-label="English"
    aria-pressed={currentLocale === 'en'}
    type="button"
  >
    EN
  </button>
  <button 
    class={currentLocale === 'pt' ? 'active' : ''} 
    on:click={() => handleLanguageChange('pt')}
    aria-label="Português"
    aria-pressed={currentLocale === 'pt'}
    type="button"
  >
    PT
  </button>
  <button 
    class={currentLocale === 'es' ? 'active' : ''} 
    on:click={() => handleLanguageChange('es')}
    aria-label="Español"
    aria-pressed={currentLocale === 'es'}
    type="button"
  >
    ES
  </button>
</div>

<style>
  .language-selector {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  button {
    background: transparent;
    border: 1px solid var(--border-color, #ddd);
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.85rem;
    min-width: 2.2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button.active {
    background: var(--active-bg, #f0f0f0);
    font-weight: bold;
    border-color: var(--active-border, #888);
  }

  :global(.dark) button {
    border-color: var(--dark-border, #555);
  }

  :global(.dark) button.active {
    background: var(--dark-active-bg, #444);
  }

  @media (max-width: 480px) {
    button {
      padding: 0.25rem 0.45rem;
      min-width: 2rem;
      height: 1.8rem;
      font-size: 0.8rem;
    }
  }
</style>