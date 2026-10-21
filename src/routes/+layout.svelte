<script lang="ts">
  import '../styles/global.css';
  import { initSimpleI18n } from '../lib/simple-i18n';
  import ChatWidget from '../components/ChatWidget.svelte';
  import BlackHoleOverlay from '../components/BlackHoleOverlay.svelte';

  // Inicializar o i18n simplificado
  initSimpleI18n();

  // Props no Svelte 5 para layouts
  let { children } = $props();
</script>

<div class="relative z-10">
  {@render children()}
</div>
<ChatWidget />
<BlackHoleOverlay />
