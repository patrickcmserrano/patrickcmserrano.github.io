<script lang="ts">
  import { _, currentLanguage, setLanguage } from '../lib/simple-i18n';
  import LanguageSelector from './LanguageSelector.svelte';
  import Icon from '../lib/Icon.svelte';
  import { FaLinkedin, FaGithub, FaExternalLinkAlt } from 'svelte-icons/fa';
  
  // QR Code component with fallback
  let qrCodeError = false;
  
  const portfolioURL = 'https://patrickcmserrano.github.io/';
  const linkedinURL = 'https://www.linkedin.com/in/patrickcmserrano/';
  
  // Generate QR code URLs using a free QR code service
  const portfolioQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(portfolioURL)}`;
  const linkedinQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(linkedinURL)}`;
  
  const currentYear = new Date().getFullYear();
  
  function handleQRError(event: Event) {
    console.error('QR code failed to load:', event);
    qrCodeError = true;
  }
  
  // Language selection function
  function selectLanguage(lang: 'pt' | 'en' | 'es') {
    setLanguage(lang);
  }
  
  // Current language for badge styling
  let currentLang = 'en';
  currentLanguage.subscribe(value => {
    currentLang = value;
  });
  
  // Force reactivity by creating a derived value
  $: translatedWelcome = $_('conference.welcome');
  $: translatedGreeting = $_('conference.greeting');
  $: translatedRole = $_('conference.role');
  $: translatedDescription = $_('conference.description');
  $: translatedPortfolio = $_('conference.portfolio');
  $: translatedLinkedin = $_('conference.linkedin');
  $: translatedScanQR = $_('conference.scanQR');
  $: translatedVisitPortfolio = $_('conference.visitPortfolio');
  $: translatedConnectLinkedIn = $_('conference.connectLinkedIn');
  $: translatedLanguages = $_('conference.languages');
  $: translatedContactMe = $_('conference.contactMe');
</script>

<main class="min-h-screen conference-page">
  <!-- Header with language selector -->
  <div class="header-section">
    <div class="container mx-auto px-6">
      <div class="flex justify-between items-center py-4">
        <div class="conference-logo">
          <h3 class="text-lg font-semibold text-white">BlockchainRio 2025</h3>
        </div>
        <div class="language-controls">
          <LanguageSelector />
        </div>
      </div>
    </div>
  </div>

  <!-- Main content -->
  <div class="main-content">
    <div class="container mx-auto px-6 py-8">
      <!-- Welcome Section -->
      <div class="welcome-section text-center mb-8">
        <h1 class="welcome-title font-bold">
          {translatedWelcome}
        </h1>
        <div class="greeting-section mb-6">
          <h2 class="greeting font-semibold">
            {translatedGreeting}
          </h2>
          <p class="role text-primary-300 font-medium mb-4">
            {translatedRole}
          </p>
          <p class="description leading-relaxed">
            {translatedDescription}
          </p>
        </div>
      </div>

      <!-- QR Codes Section -->
      <div class="qr-section mb-8">
        <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <!-- Portfolio QR -->
          <div class="qr-card">
            <div class="card-content">
              <h3 class="card-title">
                <Icon icon={FaExternalLinkAlt} size={24} />
                {translatedPortfolio}
              </h3>
              <div class="qr-container">
                {#if !qrCodeError}
                  <img 
                    src={portfolioQR} 
                    alt="Portfolio QR Code"
                    class="qr-image"
                    on:error={handleQRError}
                  />
                {:else}
                  <div class="qr-fallback">
                    <Icon icon={FaExternalLinkAlt} size={48} />
                    <p>QR Code</p>
                  </div>
                {/if}
              </div>
              <p class="qr-instruction">{translatedScanQR}</p>
              <a 
                href={portfolioURL} 
                target="_blank" 
                rel="noopener noreferrer"
                class="qr-link"
              >
                {translatedVisitPortfolio}
                <Icon icon={FaExternalLinkAlt} size={16} />
              </a>
            </div>
          </div>

          <!-- LinkedIn QR -->
          <div class="qr-card">
            <div class="card-content">
              <h3 class="card-title">
                <Icon icon={FaLinkedin} size={24} />
                {translatedLinkedin}
              </h3>
              <div class="qr-container">
                {#if !qrCodeError}
                  <img 
                    src={linkedinQR} 
                    alt="LinkedIn QR Code"
                    class="qr-image"
                    on:error={handleQRError}
                  />
                {:else}
                  <div class="qr-fallback">
                    <Icon icon={FaLinkedin} size={48} />
                    <p>QR Code</p>
                  </div>
                {/if}
              </div>
              <p class="qr-instruction">{translatedScanQR}</p>
              <a 
                href={linkedinURL} 
                target="_blank" 
                rel="noopener noreferrer"
                class="qr-link"
              >
                {translatedConnectLinkedIn}
                <Icon icon={FaExternalLinkAlt} size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Languages Section -->
      <div class="languages-section text-center mb-8">
        <p class="text-lg mb-4">{translatedLanguages}</p>
        <div class="language-badges">
          <button 
            class="language-badge {currentLang === 'en' ? 'active' : ''}"
            on:click={() => selectLanguage('en')}
          >
            🇺🇸 English
          </button>
          <button 
            class="language-badge {currentLang === 'es' ? 'active' : ''}"
            on:click={() => selectLanguage('es')}
          >
            🇪🇸 Español
          </button>
          <button 
            class="language-badge {currentLang === 'pt' ? 'active' : ''}"
            on:click={() => selectLanguage('pt')}
          >
            🇧🇷 Português
          </button>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="contact-section text-center">
        <p class="contact-message">
          {translatedContactMe}
        </p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer-section">
    <div class="container mx-auto px-6 py-4 text-center">
      <p class="text-sm opacity-75">
        © {currentYear} Patrick CM Serrano • BlockchainRio Conference
      </p>
    </div>
  </footer>
</main>

<style>
  .conference-page {
    background: linear-gradient(135deg, 
      #1e1b4b 0%, 
      #312e81 25%, 
      #3730a3 50%, 
      #4338ca 75%, 
      #6366f1 100%
    );
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header-section {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 2rem 0;
  }

  .container {
    max-width: 1400px;
    width: 100%;
  }

  .welcome-title {
    background: linear-gradient(45deg, #ffffff, #c7d2fe, #a5b4fc);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
    animation: pulse 3s ease-in-out infinite;
    font-size: 4rem;
    margin-bottom: 3rem;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }

  .greeting {
    color: #e2e8f0;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .role {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .description {
    color: #cbd5e1;
    line-height: 1.7;
    font-size: 1.25rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .qr-section {
    margin: 3rem 0;
  }

  .qr-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 1.5rem;
    padding: 1.5rem;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    height: fit-content;
  }

  .qr-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .card-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #f1f5f9;
  }

  .qr-container {
    background: white;
    border-radius: 1rem;
    padding: 0.75rem;
    margin: 1rem auto;
    width: fit-content;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .qr-image {
    display: block;
    max-width: 180px;
    height: auto;
    border-radius: 0.5rem;
  }

  .qr-fallback {
    width: 180px;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    background: #f3f4f6;
    border-radius: 0.5rem;
  }

  .qr-instruction {
    color: #cbd5e1;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }

  .qr-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #a5b4fc;
    text-decoration: none;
    font-weight: 500;
    font-size: 0.9rem;
    transition: color 0.2s ease;
  }

  .qr-link:hover {
    color: #c7d2fe;
    text-decoration: underline;
  }

  .languages-section {
    margin: 2rem 0;
  }

  .language-badges {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .language-badge {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    color: white;
  }

  .language-badge:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
  }

  .language-badge.active {
    background: rgba(255, 255, 255, 0.35);
    border-color: rgba(255, 255, 255, 0.5);
    font-weight: 600;
    transform: scale(1.1);
  }

  .contact-message {
    color: #e2e8f0;
    line-height: 1.6;
    font-weight: 300;
    font-size: 1.1rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .footer-section {
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .welcome-title {
      font-size: 2.5rem;
    }
    
    .greeting {
      font-size: 1.8rem;
    }
    
    .role {
      font-size: 1.5rem;
    }
    
    .qr-card {
      padding: 1.5rem;
    }
    
    .language-badges {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .container {
      padding: 0 1rem;
    }
    
    .welcome-title {
      font-size: 2rem;
    }
    
    .contact-message {
      font-size: 1.1rem;
    }
  }
</style>
