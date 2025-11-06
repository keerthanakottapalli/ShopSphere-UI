import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const BACKEND_PORT = 5000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // --- THIS IS WHERE THE FULL URL GOES ---
    proxy: {
      '/api': {
        target: `http://localhost:${BACKEND_PORT}`, // The target server
        changeOrigin: true,
      },
    },
  }
});
