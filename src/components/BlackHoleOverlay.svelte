<script lang="ts">
  import {
    isBlackHoleOpen,
    closeBlackHole,
    blackHoleConfig,
    blackHoleFps,
    requestCameraPolar,
    SAGITTARIUS_A_PRESET as P,
    iscoRadius,
    type QualityPreset
  } from '../lib/blackhole';

  let panelOpen = $state(true);

  const qualities: { id: QualityPreset; label: string }[] = [
    { id: 'auto', label: 'Auto' },
    { id: 'performance', label: 'Perf.' },
    { id: 'balanced', label: 'Equil.' },
    { id: 'ultra', label: 'Ultra' }
  ];

  const cameras = [
    { label: 'EHT 30°', polar: 30 },
    { label: 'Gargantua', polar: 82 },
    { label: 'Polar', polar: 5 }
  ];

  // Lazy-load the WebGL component only on first open: zero cost while closed.
  let BlackHolePromise: Promise<typeof import('./BlackHole.svelte')> | null = null;
  function loadBlackHole() {
    BlackHolePromise ??= import('./BlackHole.svelte');
    return BlackHolePromise;
  }

  // Listeners and scroll lock only exist while the overlay is open.
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

{#if $isBlackHoleOpen}
  <div
    class="fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden flex flex-col animate-fade-in"
    role="dialog"
    aria-label="Visualização do Black Hole"
    aria-modal="true"
  >
    <div class="absolute inset-0 z-0 w-full h-full">
      {#await loadBlackHole()}
        <div class="w-full h-full flex items-center justify-center text-amber-300/80 font-mono text-xs">
          Carregando simulação relativística…
        </div>
      {:then mod}
        {@const BlackHole = mod.default}
        <BlackHole />
      {:catch}
        <div class="w-full h-full flex items-center justify-center text-red-300 font-mono text-xs">
          Não foi possível carregar a visualização.
        </div>
      {/await}
    </div>

    <!-- Top bar -->
    <div class="relative z-10 w-full p-4 md:p-6 flex items-start justify-between pointer-events-none gap-3">
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

    <!-- Info + controls panel -->
    {#if panelOpen}
      <div
        class="absolute z-10 bottom-4 left-4 right-4 md:right-auto md:w-80 bg-black/65 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white shadow-xl flex flex-col gap-3 max-h-[60vh] overflow-y-auto"
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
              <button type="button" class="{chip} {off}" onclick={() => requestCameraPolar(cam.polar)}>{cam.label}</button>
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
  </div>
{/if}

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
