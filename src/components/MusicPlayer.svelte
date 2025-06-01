<!-- MusicPlayer.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { t, currentLanguage } from '../lib/simple-i18n';
  
  export let playlistId: string = 'PL71Q6dgIfRPE1ouM6x8mwsmMX4siQhfrf';
  
  let isPlayerVisible = false;
  let youtubePlayer: any = null;
  let isPlayerReady = false;
  let isPlaying = false;
  let isLoading = false;
  let currentVideoTitle = '';
  let playerId = `youtube-player-${Math.random().toString(36).substr(2, 9)}`;
  
  // Reativo para atualizar traduções quando idioma muda
  $: playlistText = t('music.playlist');
  $: closeText = t('music.close');
  $: playingText = t('music.playing');
  $: pausedText = t('music.paused');
  $: loadingText = t('music.loading');
  $: playText = t('music.play');
  $: pauseText = t('music.pause');
  $: nextText = t('music.next');
  $: previousText = t('music.previous');
  
  // Configurações do player
  const playerHeight = 60;
  const playerWidth = '300px';
  
  // Carrega a API do YouTube
  function loadYouTubeAPI() {
    return new Promise((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) {
        resolve((window as any).YT);
        return;
      }
      
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.onload = () => {
        (window as any).onYouTubeIframeAPIReady = () => resolve((window as any).YT);
      };
      document.head.appendChild(tag);
    });
  }
  
  // Inicializa o player do YouTube
  async function initYouTubePlayer() {
    if (!isPlayerVisible || youtubePlayer) return;
    
    try {
      const YT = await loadYouTubeAPI();
      
      youtubePlayer = new (YT as any).Player(playerId, {
        height: playerHeight,
        width: playerWidth,
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          autoplay: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin: window.location.origin,
          fs: 0,
          disablekb: 1,
          playsinline: 1
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    } catch (error) {
      console.error('Erro ao carregar YouTube Player:', error);
    }
  }
  
  function onPlayerReady(event: any) {
    console.log('YouTube Player ready');
    isPlayerReady = true;
    updateCurrentVideoInfo();
  }
  
  function onPlayerStateChange(event: any) {
    const YT = (window as any).YT;
    if (!YT) return;
    
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        isPlaying = true;
        isLoading = false;
        updateCurrentVideoInfo();
        break;
      case YT.PlayerState.PAUSED:
        isPlaying = false;
        isLoading = false;
        break;
      case YT.PlayerState.BUFFERING:
        isLoading = true;
        break;
      case YT.PlayerState.ENDED:
        isPlaying = false;
        isLoading = false;
        break;
      case YT.PlayerState.CUED:
        isPlaying = false;
        isLoading = false;
        updateCurrentVideoInfo();
        break;
    }
  }
  
  function onPlayerError(event: any) {
    console.error('YouTube Player error:', event.data);
    isLoading = false;
  }
  
  function updateCurrentVideoInfo() {
    if (!youtubePlayer?.getVideoData) return;
    
    try {
      const videoData = youtubePlayer.getVideoData();
      currentVideoTitle = videoData?.title || 'Música atual';
    } catch (error) {
      console.error('Erro ao obter informações do vídeo:', error);
    }
  }
  
  // Controles do player
  function togglePlayPause() {
    if (!youtubePlayer || !isPlayerReady || typeof youtubePlayer.playVideo !== 'function' || typeof youtubePlayer.pauseVideo !== 'function') {
      console.warn('Player não está pronto ainda');
      return;
    }
    
    try {
      if (isPlaying) {
        youtubePlayer.pauseVideo();
      } else {
        youtubePlayer.playVideo();
      }
    } catch (error) {
      console.error('Erro ao controlar reprodução:', error);
    }
  }
  
  function nextTrack() {
    if (!youtubePlayer || !isPlayerReady || typeof youtubePlayer.nextVideo !== 'function') {
      console.warn('Função nextVideo não disponível');
      return;
    }
    
    try {
      youtubePlayer.nextVideo();
      setTimeout(updateCurrentVideoInfo, 1000);
    } catch (error) {
      console.error('Erro ao pular para próxima música:', error);
    }
  }
  
  function previousTrack() {
    if (!youtubePlayer || !isPlayerReady || typeof youtubePlayer.previousVideo !== 'function') {
      console.warn('Função previousVideo não disponível');
      return;
    }
    
    try {
      youtubePlayer.previousVideo();
      setTimeout(updateCurrentVideoInfo, 1000);
    } catch (error) {
      console.error('Erro ao voltar para música anterior:', error);
    }
  }
  
  function togglePlayer() {
    isPlayerVisible = !isPlayerVisible;
    if (isPlayerVisible) {
      setTimeout(initYouTubePlayer, 100);
    } else {
      destroyPlayer();
    }
  }
  
  function closePlayer() {
    isPlayerVisible = false;
    destroyPlayer();
  }
  
  function destroyPlayer() {
    if (youtubePlayer?.destroy) {
      try {
        youtubePlayer.destroy();
        youtubePlayer = null;
        isPlayerReady = false;
        isPlaying = false;
        isLoading = false;
      } catch (error) {
        console.error('Erro ao destruir player:', error);
      }
    }
  }
  
  onDestroy(() => {
    destroyPlayer();
  });
</script>

<div class="music-player-section">
  <!-- Botão para abrir o player -->
  <button 
    class="music-toggle-btn"
    on:click={togglePlayer}
    aria-label={isPlayerVisible ? closeText : t('music.open')}
  >
    <div class="btn-content">
      <svg 
        class="music-icon" 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {#if isPlayerVisible}
          <!-- Ícone de fechar -->
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        {:else}
          <!-- Ícone de música -->
          <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="2"/>
          <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="2"/>
        {/if}
      </svg>
      <span class="btn-text">
        {isPlayerVisible ? closeText : playlistText}
      </span>
    </div>
  </button>
</div>

<!-- Player fixo no topo -->
{#if isPlayerVisible}
  <div class="top-music-player">
    <div class="player-container">
      <div class="player-left">
        <div class="music-visualizer" class:playing={isPlaying}>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
        
        <div class="track-info">
          <span class="track-title">
            {currentVideoTitle || playlistText}
          </span>
          <span class="track-status">
            {#if isLoading}
              {loadingText}
            {:else if isPlaying}
              {playingText}
            {:else}
              {pausedText}
            {/if}
          </span>
        </div>
      </div>
      
      <div class="player-center">
        <div class="player-controls">
          <button 
            class="control-btn"
            on:click={previousTrack}
            disabled={!isPlayerReady}
            aria-label={previousText}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 20L9 12L19 4V20Z" fill="currentColor"/>
              <path d="M5 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <button 
            class="control-btn play-btn"
            on:click={togglePlayPause}
            disabled={!isPlayerReady}
            aria-label={isPlaying ? pauseText : playText}
          >
            {#if isLoading}
              <div class="loading-spinner"></div>
            {:else if isPlaying}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 4H10V20H6V4Z" fill="currentColor"/>
                <path d="M14 4H18V20H14V4Z" fill="currentColor"/>
              </svg>
            {:else}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
              </svg>
            {/if}
          </button>
          
          <button 
            class="control-btn"
            on:click={nextTrack}
            disabled={!isPlayerReady}
            aria-label={nextText}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 4L15 12L5 20V4Z" fill="currentColor"/>
              <path d="M19 5V19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div class="player-right">
        <div class="youtube-player-wrapper">
          <div id={playerId}></div>
        </div>
        
        <button 
          class="control-btn close-btn"
          on:click={closePlayer}
          aria-label={closeText}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .music-player-section {
    position: relative;
    z-index: 1000;
  }
  
  .music-toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    min-width: 120px;
    justify-content: center;
  }
  
  .music-toggle-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  }
  
  .music-toggle-btn:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
  
  .btn-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .music-icon {
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }
  
  .btn-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  
  /* Player fixo no topo */
  .top-music-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
    z-index: 1001;
    animation: slideDown 0.3s ease;
  }
  
  @keyframes slideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .player-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 1rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1rem;
  }
  
  .player-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }
  
  .player-center {
    display: flex;
    justify-content: center;
  }
  
  .player-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .music-visualizer {
    display: flex;
    gap: 2px;
    align-items: end;
    height: 16px;
  }
  
  .music-visualizer .bar {
    width: 2px;
    background: #667eea;
    border-radius: 1px;
    height: 4px;
    transition: all 0.3s ease;
  }
  
  .music-visualizer.playing .bar {
    animation: bounce 1.2s infinite ease-in-out;
  }
  
  .music-visualizer.playing .bar:nth-child(1) { animation-delay: -0.24s; }
  .music-visualizer.playing .bar:nth-child(2) { animation-delay: -0.12s; }
  .music-visualizer.playing .bar:nth-child(3) { animation-delay: 0s; }
  .music-visualizer.playing .bar:nth-child(4) { animation-delay: 0.12s; }
  
  @keyframes bounce {
    0%, 40%, 100% { 
      transform: scaleY(0.4);
      height: 4px;
    }
    20% { 
      transform: scaleY(1.0);
      height: 16px;
    }
  }
  
  .track-info {
    min-width: 0;
    flex: 1;
  }
  
  .track-title {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.125rem;
  }
  
  .track-status {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 400;
  }
  
  .player-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 50%;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .control-btn:hover:not(:disabled) {
    background: #f3f4f6;
    color: #1f2937;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .play-btn {
    background: #667eea;
    color: white;
    border-color: #667eea;
    width: 2.75rem;
    height: 2.75rem;
  }
  
  .play-btn:hover:not(:disabled) {
    background: #5a67d8;
    border-color: #5a67d8;
  }
  
  .close-btn {
    background: transparent;
    border: none;
    box-shadow: none;
    color: #6b7280;
  }
  
  .close-btn:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
  
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .youtube-player-wrapper {
    width: 300px;
    height: 60px;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #000;
    opacity: 0.8;
  }
  
  .youtube-player-wrapper #youtube-player {
    width: 100%;
    height: 100%;
  }
  
  /* Responsividade mobile */
  @media (max-width: 768px) {
    .player-container {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      text-align: center;
    }
    
    .player-left {
      justify-content: center;
    }
    
    .player-right {
      justify-content: center;
    }
    
    .youtube-player-wrapper {
      width: 200px;
      height: 50px;
    }
    
    .track-title {
      font-size: 0.8rem;
    }
    
    .track-status {
      font-size: 0.7rem;
    }
    
    .control-btn {
      width: 2rem;
      height: 2rem;
    }
    
    .play-btn {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .music-toggle-btn {
      min-width: 100px;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
    }
    
    .btn-text {
      max-width: 80px;
    }
    
    .player-container {
      padding: 0.5rem;
    }
    
    .youtube-player-wrapper {
      width: 150px;
      height: 40px;
    }
  }
  
  /* Dark mode support */
  :global([data-mode="dark"]) .top-music-player {
    background: rgba(15, 23, 42, 0.95);
    border-bottom-color: #4b5563;
  }
  
  :global([data-mode="dark"]) .track-title {
    color: #f8fafc;
  }
  
  :global([data-mode="dark"]) .track-status {
    color: #d1d5db;
  }
  
  :global([data-mode="dark"]) .control-btn {
    background: #1f2937;
    border-color: #4b5563;
    color: #d1d5db;
  }
  
  :global([data-mode="dark"]) .control-btn:hover:not(:disabled) {
    background: #374151;
    color: #f9fafb;
  }
  
  :global([data-mode="dark"]) .close-btn {
    color: #d1d5db;
  }
  
  :global([data-mode="dark"]) .close-btn:hover {
    background: #374151;
    color: #f9fafb;
  }
</style>
