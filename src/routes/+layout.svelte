<script lang="ts">
  import '../styles/global.css';
  import { initSimpleI18n } from '../lib/simple-i18n';
  import { onMount } from 'svelte';

  // Inicializar o i18n simplificado
  initSimpleI18n();

  // Props no Svelte 5 para layouts
  let { children } = $props();
</script>

{@render children()}
