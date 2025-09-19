import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true
    },
    allowedHosts: 'all'
  },
  build: {
    outDir: 'dist'
  },
  base: './'
})
