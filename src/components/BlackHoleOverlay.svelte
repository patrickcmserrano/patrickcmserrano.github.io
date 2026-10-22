<script lang="ts">
  import {
    isBlackHoleOpen,
    closeBlackHole,
    blackHoleConfig,
    blackHoleFps,
    requestCameraView,
    requestCameraPolar,
    lookAtEarth,
    viewFromEarth,
    earthScreenPosition,
    SAGITTARIUS_A_PRESET as P,
    iscoRadius,
    type QualityPreset
  } from '../lib/blackhole';
  import BlackHole from './BlackHole.svelte';

  let panelOpen = $state(true);
  let showEarth = $state(true);

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
  const off = 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/10';
</script>

<div
  class="fixed inset-0 overflow-hidden transition-all duration-700 pointer-events-none {$isBlackHoleOpen ? 'z-[100] pointer-events-auto' : 'z-0'}"
  role={$isBlackHoleOpen ? 'dialog' : 'presentation'}
  aria-label={$isBlackHoleOpen ? 'Visualização do Black Hole' : undefined}
  aria-modal={$isBlackHoleOpen ? 'true' : undefined}
>
  <div class="absolute inset-0 z-0 w-full h-full">
    <BlackHole isAmbient={!$isBlackHoleOpen} />
  </div>

  <!-- Ambient dark scrim: opaco mas translúcido para ver o fundo cósmico -->
  <div
    class="absolute inset-0 pointer-events-none transition-opacity duration-700 {$isBlackHoleOpen ? 'opacity-0' : 'opacity-100 bg-[#030712]/60 dark:bg-[#000000]/55 backdrop-blur-[0.5px]'}"
  ></div>

  {#if $isBlackHoleOpen}
    <!-- Top bar -->
    <div class="relative z-10 w-full p-4 md:p-6 flex items-start justify-between pointer-events-none gap-3 animate-fade-in">
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

      <div class="flex items-center gap-2 pointer-events-auto">
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
          aria-label="Fechar visualização do Black Hole"
        >
          <span class="hidden sm:inline text-slate-300 group-hover:text-white transition-colors">Fechar</span>
          <span class="font-mono text-[10px] text-slate-400 border border-white/20 rounded px-1.5 py-0.5 hidden md:inline">ESC</span>
          <svg class="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Earth in background sky indicator & HUD -->
    {#if showEarth && $earthScreenPosition}
      {#if $earthScreenPosition.visible}
        <div
          class="absolute z-20 pointer-events-none transition-all duration-100 ease-out animate-fade-in"
          style="left: {$earthScreenPosition.x}px; top: {$earthScreenPosition.y}px; transform: translate(-50%, -50%);"
        >
          <div class="relative flex items-center justify-center">
            <!-- Pulsing outer reticle -->
            <div class="absolute w-14 h-14 rounded-full border border-cyan-400/40 animate-ping pointer-events-none"></div>
            <div class="w-9 h-9 rounded-full border-2 border-cyan-400 bg-cyan-950/50 backdrop-blur-md flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <span class="text-sm select-none">🌍</span>
            </div>

            <!-- Target info card -->
            <div
              class="absolute left-12 top-0 -translate-y-1/2 w-64 sm:w-72 bg-black/85 backdrop-blur-md border border-cyan-400/50 rounded-2xl p-3.5 shadow-2xl text-white pointer-events-auto"
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
              <div class="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                <span class="text-[10px] text-slate-400 font-mono">Tempo-luz: ~26.700 anos</span>
                <button
                  type="button"
                  onclick={() => lookAtEarth()}
                  class="px-2.5 py-1 rounded-lg text-[10px] bg-cyan-500/25 hover:bg-cyan-500/45 text-cyan-200 border border-cyan-400/40 font-mono font-medium transition cursor-pointer"
                >
                  Centrar mira &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      {:else if edgePos}
        <!-- Off-screen indicator pointing towards Earth -->
        <div
          class="absolute z-20 pointer-events-auto cursor-pointer animate-fade-in"
          style="left: {edgePos.x}px; top: {edgePos.y}px; transform: translate(-50%, -50%);"
          onclick={() => lookAtEarth()}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && lookAtEarth()}
          aria-label="Girar câmera em direção à Terra"
        >
          <div class="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 hover:bg-cyan-950/80 border border-cyan-400/60 text-cyan-300 text-xs font-mono shadow-xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95">
            <span style="transform: rotate({edgePos.deg}deg); display: inline-block;">&uarr;</span>
            <span>🌍 Terra (26.670 al)</span>
          </div>
        </div>
      {/if}
    {/if}

    <!-- Info + controls panel -->
    {#if panelOpen}
      <div
        class="absolute z-10 bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto animate-fade-in"
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
</style>
