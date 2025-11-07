import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'build'
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://greencart-backend1-one.vercel.app:4000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
