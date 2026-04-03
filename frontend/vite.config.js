import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const devApiTarget = process.env.VITE_DEV_API_TARGET || 'http://localhost:5001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': devApiTarget,
      '/profile': devApiTarget,
      '/recommendation': devApiTarget,
      '/health': devApiTarget,
    },
  },
})
