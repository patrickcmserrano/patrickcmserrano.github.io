<script lang="ts">
  import {
    isBlackHoleOpen,
    closeBlackHole,
    blackHoleConfig,
    blackHoleFps,
    requestCameraPolar,
    lookAtEarth,
    viewFromEarth,
    earthScreenPosition,
    activeCelestialTarget,
    isInterstellarTraveling,
    interstellarTravelTarget,
    travelToEarth,
    travelToBlackHole,
    SAGITTARIUS_A_PRESET as P,
    iscoRadius,
    type QualityPreset
  } from '../lib/blackhole';
  import BlackHole from './BlackHole.svelte';
  import EarthView from './EarthView.svelte';

  let panelOpen = $state(true);
  let showEarth = $state(true);

  // Estados de controle da visualização realista da Terra
  let earthShowClouds = $state(true);
  let earthShowAtmosphere = $state(true);
  let earthShowNightLights = $state(true);
  let earthFastCycle = $state(false);
  let earthShowMarkers = $state(true);
  let earthCameraPreset = $state<{ id: string; nonce: number } | null>(null);

  function triggerEarthCamera(id: string) {
    earthCameraPreset = { id, nonce: Date.now() };
  }

  const qualities: { id: QualityPreset; label: string }[] = [
    { id: 'auto', label: 'Auto' },
    { id: 'performance', label: 'Perf.' },
    { id: 'balanced', label: 'Equil.' },
    { id: 'ultra', label: 'Ultra' }
  ];

  const cameras = [
    { label: 'Visão da Terra (EHT)', action: () => viewFromEarth() },
    { label: 'Rumo à Terra', action: () => lookAtEarth() },
    { label: 'Gargantua (82°)', action: () => requestCameraPolar(82) },
    { label: 'Polar (5°)', action: () => requestCameraPolar(5) }
  ];

  // Screen edge position for off-screen Earth pointer
  let edgePos = $derived.by(() => {
    if (!$earthScreenPosition || typeof window === 'undefined') return null;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 70;
    const cx = w * 0.5;
    const cy = h * 0.5;
    const maxRx = Math.max(80, cx - margin);
    const maxRy = Math.max(80, cy - margin);
    const ang = $earthScreenPosition.angleRad;
    const ex = cx + Math.cos(ang) * maxRx;
    const ey = cy + Math.sin(ang) * maxRy;
    const deg = (ang * 180) / Math.PI + 90;
    return { x: ex, y: ey, deg };
  });

  // Keyboard shortcut (Escape) and scroll lock when open
  $effect(() => {
    if (!$isBlackHoleOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeBlackHole();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  });

  function setConfig<K extends keyof import('../lib/blackhole').BlackHoleSimConfig>(
    key: K,
    value: import('../lib/blackhole').BlackHoleSimConfig[K]
  ) {
    blackHoleConfig.update((c) => ({ ...c, [key]: value }));
  }

  const chip =
    'px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer';
  const on = 'bg-amber-500/20 border-amber-400/60 text-amber-200';
  const onCyan = 'bg-cyan-500/20 border-cyan-400/60 text-cyan-200';
  const off = 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10';
</script>

<div
  class="fixed inset-0 overflow-hidden transition-all duration-700 {$isBlackHoleOpen ? 'z-[100] pointer-events-auto' : 'z-0 pointer-events-none'}"
  role={$isBlackHoleOpen ? 'dialog' : 'presentation'}
  aria-label={$isBlackHoleOpen ? 'Visualização Astronômica 3D' : undefined}
  aria-modal={$isBlackHoleOpen ? 'true' : undefined}
>
  <!-- Renderizador 3D: Sagittarius A* (sempre ativo no modo ambiente ou quando selecionado) -->
  <div class="absolute inset-0 z-0 w-full h-full {$isBlackHoleOpen && $activeCelestialTarget === 'earth' ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500">
    <BlackHole isAmbient={!$isBlackHoleOpen || $activeCelestialTarget === 'earth'} />
  </div>

  <!-- Renderizador 3D Realista da Terra (montado quando expandido e em modo 'earth') -->
  {#if $isBlackHoleOpen && $activeCelestialTarget === 'earth'}
    <div class="absolute inset-0 z-0 w-full h-full pointer-events-auto animate-fade-in">
      <EarthView
        showClouds={earthShowClouds}
        showAtmosphere={earthShowAtmosphere}
        showNightLights={earthShowNightLights}
        fastDayNightCycle={earthFastCycle}
        showMarkers={earthShowMarkers}
        cameraPresetTrigger={earthCameraPreset}
      />
    </div>
  {/if}

  <!-- Efeito Cinematográfico de Dobra / Viagem Interestelar (26.670 anos-luz) -->
  {#if $isInterstellarTraveling}
    <div class="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center warp-overlay">
      <div class="warp-tunnel"></div>
      <div class="relative z-10 px-6 py-4 rounded-2xl bg-black/80 border border-cyan-400/50 backdrop-blur-xl text-center shadow-2xl">
        <div class="text-xs font-mono uppercase tracking-[0.25em] text-cyan-300 animate-pulse">
          {$interstellarTravelTarget === 'earth'
            ? '🚀 Salto Interestelar • Rumo ao Sistema Solar'
            : '🕳️ Salto Interestelar • Rumo ao Centro Galáctico'}
        </div>
        <div class="text-lg md:text-2xl font-extrabold font-mono text-white mt-1">
          {$interstellarTravelTarget === 'earth'
            ? 'Sagittarius A* → Planeta Terra (26.670 al)'
            : 'Planeta Terra → Sagittarius A* (26.670 al)'}
        </div>
      </div>
    </div>
  {/if}

  <!-- Ambient dark scrim: opaco mas translúcido para ver o fundo cósmico -->
  <div
    class="absolute inset-0 pointer-events-none transition-opacity duration-700 {$isBlackHoleOpen ? 'opacity-0' : 'opacity-100 bg-[#030712]/60 dark:bg-[#000000]/55 backdrop-blur-[0.5px]'}"
  ></div>

  {#if $isBlackHoleOpen}
    <!-- Top bar -->
    <div class="relative z-30 w-full p-4 md:p-6 flex items-start justify-between pointer-events-none gap-3 animate-fade-in flex-wrap">
      {#if $activeCelestialTarget === 'sgr-a'}
        <div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <div class="flex flex-col">
            <span class="text-xs md:text-sm font-bold tracking-wide font-mono text-amber-300">
              {P.name.toUpperCase()} • {P.subtitle}
            </span>
            <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline">
              Arraste para orbitar • Scroll para zoom • {$blackHoleFps} FPS
            </span>
          </div>
        </div>
      {:else}
        <div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-cyan-500/30 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3">
          <span class="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
          <div class="flex flex-col">
            <span class="text-xs md:text-sm font-bold tracking-wide font-mono text-cyan-300">
              PLANETA TERRA • BRAÇO DE ÓRION (VIA LÁCTEA)
            </span>
            <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline">
              Arraste para girar o globo • Scroll para zoom orbital • {$blackHoleFps} FPS
            </span>
          </div>
        </div>
      {/if}

      <div class="flex items-center gap-2 pointer-events-auto flex-wrap">
        {#if $activeCelestialTarget === 'sgr-a'}
          <button
            type="button"
            onclick={() => (showEarth = !showEarth)}
            class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer {showEarth ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20' : 'bg-black/60 hover:bg-white/10 border-white/20 text-slate-300'}"
            aria-pressed={showEarth}
            aria-label="Alternar indicador de onde fica a Terra"
          >
            <span class="text-sm">🌍</span>
            <span class="hidden sm:inline">{showEarth ? 'Terra visível' : 'Apontar Terra'}</span>
          </button>

          <button
            type="button"
            onclick={() => travelToEarth()}
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md border border-cyan-400/80 bg-cyan-500/30 hover:bg-cyan-400 hover:text-slate-950 text-cyan-100 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            aria-label="Viajar até a visualização realista da Terra"
          >
            <span>🚀</span>
            <span>Viajar à Terra</span>
          </button>
        {:else}
          <button
            type="button"
            onclick={() => (earthShowMarkers = !earthShowMarkers)}
            class="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer {earthShowMarkers ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200' : 'bg-black/60 hover:bg-white/10 border-white/20 text-slate-300'}"
          >
            <span>📍</span>
            <span class="hidden sm:inline">{earthShowMarkers ? 'Marcadores ativos' : 'Marcadores'}</span>
          </button>

          <button
            type="button"
            onclick={() => travelToBlackHole()}
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold backdrop-blur-md border border-amber-400/80 bg-amber-500/30 hover:bg-amber-400 hover:text-slate-950 text-amber-100 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            aria-label="Viajar de volta para Sagittarius A*"
          >
            <span>🕳️</span>
            <span>Voltar a Sagittarius A*</span>
          </button>
        {/if}

        <button
          type="button"
          onclick={() => (panelOpen = !panelOpen)}
          class="px-3 py-2 bg-black/60 hover:bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl text-xs font-semibold cursor-pointer"
          aria-expanded={panelOpen}
          aria-label="Alternar painel de controles"
        >
          {panelOpen ? 'Ocultar painel' : 'Painel'}
        </button>
        <button
          type="button"
          onclick={closeBlackHole}
          class="group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white/10 active:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/50 text-white rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl cursor-pointer"
          aria-label="Fechar visualização"
        >
          <span class="hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Fechar</span>
          <span class="font-mono text-[10px] text-slate-400 border border-white/20 rounded px-1.5 py-0.5 hidden md:inline">ESC</span>
          <svg class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- MODO 1: HUD DE SAGITTARIUS A* -->
    {#if $activeCelestialTarget === 'sgr-a'}
      {#if showEarth && $earthScreenPosition}
        {#if $earthScreenPosition.visible}
          <div
            class="absolute z-20 pointer-events-none transition-all duration-100 ease-out animate-fade-in"
            style="left: {$earthScreenPosition.x}px; top: {$earthScreenPosition.y}px; transform: translate(-50%, -50%);"
          >
            <div class="relative flex items-center justify-center">
              <!-- Pulsing outer reticle -->
              <div class="absolute w-14 h-14 rounded-full border border-cyan-400/40 animate-ping pointer-events-none"></div>
              <button
                type="button"
                onclick={() => travelToEarth()}
                class="w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-950/70 hover:bg-cyan-500/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/50 pointer-events-auto cursor-pointer transition-transform hover:scale-110"
                title="Viajar para a Terra"
              >
                <span class="text-base select-none">🌍</span>
              </button>

              <!-- Target info card -->
              <div
                class="absolute left-13 top-0 -translate-y-1/2 w-68 sm:w-76 bg-black/85 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-3.5 shadow-2xl text-white pointer-events-auto"
              >
                <div class="flex items-center justify-between pb-1.5 mb-1.5 border-b border-cyan-500/20">
                  <span class="text-xs font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    TERRA / SISTEMA SOLAR
                  </span>
                  <span class="text-[10px] text-cyan-200/80 font-mono">l=180° b=+0.14°</span>
                </div>
                <p class="text-[11px] text-slate-300 leading-snug">
                  Localizada a <strong class="text-cyan-200">26.670 anos-luz</strong> de Sagittarius A*, na direção do Anti-centro Galáctico (constelação de Touro/Auriga).
                </p>
                <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onclick={() => lookAtEarth()}
                    class="px-2.5 py-1.5 rounded-lg text-[10px] bg-white/5 hover:bg-white/15 text-slate-200 border border-white/15 font-mono font-medium transition cursor-pointer"
                  >
                    Centrar mira
                  </button>
                  <button
                    type="button"
                    onclick={() => travelToEarth()}
                    class="flex-1 px-3 py-1.5 rounded-lg text-[11px] bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold shadow-lg shadow-cyan-500/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🚀 Viajar</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        {:else if edgePos}
          <!-- Off-screen indicator pointing towards Earth -->
          <div
            class="absolute z-20 pointer-events-auto animate-fade-in"
            style="left: {edgePos.x}px; top: {edgePos.y}px; transform: translate(-50%, -50%);"
          >
            <div class="flex items-center gap-1.5 p-1 pl-3 rounded-full bg-black/85 border border-cyan-400/60 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md">
              <button
                type="button"
                onclick={() => lookAtEarth()}
                class="flex items-center gap-1.5 pr-1 hover:text-white transition cursor-pointer"
                title="Girar câmera em direção à Terra"
              >
                <span style="transform: rotate({edgePos.deg}deg); display: inline-block;">&uarr;</span>
                <span>🌍 Terra (26.670 al)</span>
              </button>
              <button
                type="button"
                onclick={() => travelToEarth()}
                class="px-2.5 py-1 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold transition cursor-pointer"
              >
                🚀 Viajar
              </button>
            </div>
          </div>
        {/if}
      {/if}

      <!-- Painel Astrofísico de Sagittarius A* -->
      {#if panelOpen}
        <div
          class="absolute z-30 pointer-events-auto bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto animate-fade-in"
        >
          <div>
            <div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Ficha astrofísica</div>
            <dl class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300">
              <dt class="text-slate-500">Massa</dt><dd>{(P.massSolar / 1e6).toFixed(2)}×10⁶ M☉</dd>
              <dt class="text-slate-500">Distância</dt><dd>{P.distanceLy.toLocaleString('pt-BR')} al</dd>
              <dt class="text-slate-500">Spin a*</dt><dd>≈ {P.spin.toFixed(2)}</dd>
              <dt class="text-slate-500">ISCO</dt><dd>{iscoRadius(P.spin).toFixed(2)} GM/c²</dd>
              <dt class="text-slate-500">Sombra</dt><dd>{P.shadowMicroArcsec} µas</dd>
            </dl>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Espectro</div>
            <div class="flex gap-1.5 flex-wrap">
              <button type="button" class="{chip} {$blackHoleConfig.spectralMode === 'visible' ? on : off}" onclick={() => setConfig('spectralMode', 'visible')}>Visível</button>
              <button type="button" class="{chip} {$blackHoleConfig.spectralMode === 'eht' ? on : off}" onclick={() => setConfig('spectralMode', 'eht')}>EHT 230 GHz</button>
            </div>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Física</div>
            <div class="flex gap-1.5 flex-wrap">
              <button type="button" class="{chip} {$blackHoleConfig.enableLensing ? on : off}" aria-pressed={$blackHoleConfig.enableLensing} onclick={() => setConfig('enableLensing', !$blackHoleConfig.enableLensing)}>Lente gravitacional</button>
              <button type="button" class="{chip} {$blackHoleConfig.enableDoppler ? on : off}" aria-pressed={$blackHoleConfig.enableDoppler} onclick={() => setConfig('enableDoppler', !$blackHoleConfig.enableDoppler)}>Doppler</button>
            </div>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Câmera</div>
            <div class="flex gap-1.5 flex-wrap">
              {#each cameras as cam}
                <button type="button" class="{chip} {off}" onclick={cam.action}>{cam.label}</button>
              {/each}
              <button type="button" class="{chip} {$blackHoleConfig.autoRotate ? on : off}" aria-pressed={$blackHoleConfig.autoRotate} onclick={() => setConfig('autoRotate', !$blackHoleConfig.autoRotate)}>Auto-órbita</button>
            </div>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono mb-1">Qualidade</div>
            <div class="flex gap-1.5 flex-wrap">
              {#each qualities as q}
                <button type="button" class="{chip} {$blackHoleConfig.quality === q.id ? on : off}" onclick={() => setConfig('quality', q.id)}>{q.label}</button>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    {:else}
      <!-- MODO 2: PAINEL PLANETÁRIO DA TERRA -->
      {#if panelOpen}
        <div
          class="absolute z-30 pointer-events-auto bottom-4 left-4 right-4 md:right-auto md:w-84 bg-black/70 backdrop-blur-md border border-cyan-500/25 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[65vh] overflow-y-auto animate-fade-in"
        >
          <div>
            <div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1">Ficha Planetária • Terra</div>
            <dl class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] font-mono text-slate-300">
              <dt class="text-slate-500">Massa</dt><dd>5,972 × 10²⁴ kg</dd>
              <dt class="text-slate-500">Raio Equatorial</dt><dd>6.378,1 km</dd>
              <dt class="text-slate-500">Inclinação Axial</dt><dd>23,44°</dd>
              <dt class="text-slate-500">Vel. Orbital</dt><dd>29,78 km/s</dd>
              <dt class="text-slate-500">Dist. a Sgr A*</dt><dd>26.670 al</dd>
            </dl>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1">Camadas Físicas & Shader</div>
            <div class="flex gap-1.5 flex-wrap">
              <button
                type="button"
                class="{chip} {earthShowClouds ? onCyan : off}"
                onclick={() => (earthShowClouds = !earthShowClouds)}
              >
                Nuvens dinâmicas
              </button>
              <button
                type="button"
                class="{chip} {earthShowAtmosphere ? onCyan : off}"
                onclick={() => (earthShowAtmosphere = !earthShowAtmosphere)}
              >
                Atmosfera Rayleigh
              </button>
              <button
                type="button"
                class="{chip} {earthShowNightLights ? onCyan : off}"
                onclick={() => (earthShowNightLights = !earthShowNightLights)}
              >
                Luzes noturnas
              </button>
              <button
                type="button"
                class="{chip} {earthFastCycle ? onCyan : off}"
                onclick={() => (earthFastCycle = !earthFastCycle)}
              >
                Ciclo Dia/Noite rápido
              </button>
            </div>
          </div>

          <div>
            <div class="text-[10px] uppercase tracking-widest text-cyan-300/90 font-mono mb-1">Órbita & Pontos de Interesse</div>
            <div class="flex gap-1.5 flex-wrap">
              <button type="button" class="{chip} {off}" onclick={() => triggerEarthCamera('brazil')}>
                🇧🇷 Brasil (Niterói/RJ)
              </button>
              <button type="button" class="{chip} {off}" onclick={() => triggerEarthCamera('terminator')}>
                🌅 Linha do Terminador
              </button>
              <button type="button" class="{chip} {off}" onclick={() => triggerEarthCamera('iss')}>
                🛰️ Órbita Baixa (ISS)
              </button>
              <button type="button" class="{chip} {off}" onclick={() => triggerEarthCamera('night')}>
                🌃 Lado Noturno
              </button>
              <button type="button" class="{chip} {off}" onclick={() => triggerEarthCamera('moon')}>
                🌕 Vista da Lua
              </button>
            </div>
          </div>

          <div class="pt-1 border-t border-white/10">
            <button
              type="button"
              onclick={() => travelToBlackHole()}
              class="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🕳️ Viajar de volta a Sagittarius A*</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      {/if}
    {/if}
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }

  @keyframes warpPulse {
    0% {
      opacity: 0;
      transform: scale(0.92);
    }
    30% {
      opacity: 1;
      transform: scale(1);
    }
    75% {
      opacity: 1;
      transform: scale(1.03);
    }
    100% {
      opacity: 0;
      transform: scale(1.08);
    }
  }

  .warp-overlay {
    animation: warpPulse 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    background: radial-gradient(circle at center, rgba(6, 182, 212, 0.28) 0%, rgba(3, 7, 18, 0.94) 70%);
  }

  .warp-tunnel {
    position: absolute;
    inset: -20%;
    background: repeating-radial-gradient(
      circle at center,
      rgba(56, 189, 248, 0.18) 0px,
      transparent 16px,
      rgba(251, 191, 36, 0.12) 32px,
      transparent 48px
    );
    animation: warpZoom 1.5s ease-in forwards;
  }

  @keyframes warpZoom {
    0% {
      transform: scale(0.4) rotate(0deg);
      opacity: 0;
    }
    40% {
      opacity: 1;
    }
    100% {
      transform: scale(3.2) rotate(12deg);
      opacity: 0;
    }
  }
</style>
