import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path';
import dynamicImport from 'vite-plugin-dynamic-import'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dynamicImport()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      // Polyfill do módulo Node.js "events" para o Parse SDK funcionar no browser.
      // O pacote npm "events" é a implementação browser-safe do EventEmitter.
      'events': path.resolve(__dirname, 'node_modules/events/events.js'),
    },
  },
  optimizeDeps: {
    // Força o Vite a pré-bundlar o Parse SDK incluindo o alias de events
    include: ['parse'],
  },
  server: {
    headers: {
      // Permite que o popup do Google OAuth (Firebase signInWithPopup) se comunique
      // com a janela principal sem ser bloqueado pela política COOP do browser.
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'build'
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/services/parse/**', 'src/store/**', 'src/utils/**'],
    },
  },
})
