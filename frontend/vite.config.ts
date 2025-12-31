import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // Escucha en todas las direcciones (0.0.0.0)
    port: 3000,    // El puerto que mapeamos en Docker
    watch: {
      usePolling: true, // Necesario para que el hot-reload funcione en Docker sobre Windows/Linux
    },
  },
})