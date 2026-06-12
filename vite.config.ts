import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: 'modern',
        // Make the design tokens available in every component style block
        additionalData: '@use "@/assets/styles/variables" as *;',
      },
    },
  },
  server: {
    open: true,
    proxy: {
      '/api': 'http://localhost:4001',
    },
  },
})
