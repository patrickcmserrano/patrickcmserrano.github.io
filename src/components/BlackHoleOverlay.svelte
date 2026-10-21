<script lang="ts">
  import { onMount } from 'svelte';
  import { isBlackHoleOpen, closeBlackHole } from '../lib/blackhole';
  import BlackHole from './BlackHole.svelte';

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && $isBlackHoleOpen) {
      closeBlackHole();
    }
  }

  $effect(() => {
    if (typeof document !== 'undefined') {
      if ($isBlackHoleOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  });

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  });
</script>

{#if $isBlackHoleOpen}
  <div 
    class="fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden flex flex-col animate-fade-in"
    role="dialog"
    aria-label="Visualização do Black Hole"
    aria-modal="true"
  >
    <!-- Three.js Canvas container -->
    <div class="absolute inset-0 z-0 w-full h-full">
      <BlackHole />
    </div>

    <!-- Top floating HUD bar -->
    <div class="relative z-10 w-full p-4 md:p-6 flex items-center justify-between pointer-events-none">
      <!-- Title & hint -->
      <div class="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-white shadow-xl flex items-center gap-3">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        <div class="flex flex-col">
          <span class="text-xs md:text-sm font-bold tracking-wide font-mono text-amber-300">
            BLACK HOLE
          </span>
          <span class="text-[10px] md:text-xs text-slate-400 hidden sm:inline">
            Arraste para orbitar • Scroll para zoom
          </span>
        </div>
      </div>

      <!-- Close button -->
      <button
        type="button"
        onclick={closeBlackHole}
        class="pointer-events-auto group flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-white/10 active:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/50 text-white rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl cursor-pointer"
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
