import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Все запросы с префиксом /v1 проксируем на бэкенд
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
