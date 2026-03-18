import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Pidu-landingpage-n8n/', // QUAN TRỌNG cho GitHub Pages

  server: {
    port: 3000,
    host: '0.0.0.0',
  },

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },

  build: {
    outDir: 'docs' // build thẳng vào docs để GitHub Pages đọc được
  }
})