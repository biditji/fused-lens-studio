import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Lets the app call relative /api and /uploads paths in dev.
      '/api': { target: API_TARGET, changeOrigin: true },
      '/uploads': { target: API_TARGET, changeOrigin: true }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
})
