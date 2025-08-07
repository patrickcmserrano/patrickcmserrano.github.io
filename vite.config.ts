import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    svelte(),
  ],
  base: '/', // Caminho base atualizado para o domínio raiz patrickcmserrano.github.io
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        conference: resolve(__dirname, 'conference.html'),
      },
    },
  },
});