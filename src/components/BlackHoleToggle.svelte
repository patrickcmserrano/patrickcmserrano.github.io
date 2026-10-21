<script lang="ts">
  import { isBlackHoleOpen, openBlackHole, closeBlackHole } from '../lib/blackhole';

  function handleClick() {
    if ($isBlackHoleOpen) {
      closeBlackHole();
    } else {
      openBlackHole();
    }
  }
</script>

<div class="inline-flex items-center">
  {#if $isBlackHoleOpen}
    <button
      type="button"
      onclick={handleClick}
      class="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-amber-500 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all duration-200 cursor-pointer shadow-sm"
      aria-label="Fechar visualização do Black Hole"
      title="Fechar visualização do Black Hole (ESC)"
    >
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <span class="hidden md:inline font-mono text-[11px]">Fechar</span>
    </button>
  {:else}
    <button
      type="button"
      onclick={handleClick}
      class="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 border border-slate-200 dark:border-slate-700/80 hover:border-amber-500/30 transition-all duration-200 cursor-pointer shadow-sm"
      aria-label="Abrir visualização do Black Hole"
      title="Abrir visualização 3D do Black Hole"
    >
      <!-- Black Hole Icon -->
      <svg class="w-3.5 h-3.5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <!-- Event Horizon & Accretion Ring -->
        <circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" stroke-width="1.8" transform="rotate(-25 12 12)" stroke-dasharray="1 0" />
      </svg>
      <span class="hidden sm:inline font-mono text-[11px] tracking-tight">Black Hole</span>
    </button>
  {/if}
</div>
