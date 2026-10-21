import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['.app.github.dev'],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        headers: { origin: 'http://localhost:5173' },
      },
      '/socket.io': {
        target: 'http://127.0.0.1:4000',
        ws: true,
        headers: { origin: 'http://localhost:5173' },
      },
    },
  },
})
