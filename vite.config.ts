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
        // Make the design tokens available in every component style block.
        // The variables file itself must be skipped, otherwise it would
        // `@use` itself (it now re-exports the Kong tokens) and Sass throws a
        // module-loop error.
        additionalData: (source: string, filename: string) => {
          if (filename.replace(/\\/g, '/').endsWith('/assets/styles/_variables.scss')) {
            return source
          }

          return `@use "@/assets/styles/variables" as *;\n${source}`
        },
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
