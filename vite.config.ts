import { defineConfig } from 'vite'
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
  }
})
