import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind v4 — no tailwind.config.js needed
  ],
  server: {
    proxy: {
      // Proxy /api requests to stats.nba.com directly for local dev
      '/api': {
        target: 'https://stats.nba.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.nba.com/',
          'Origin': 'https://www.nba.com'
        }
      }
    }
  }
})
