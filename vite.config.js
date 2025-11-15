import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // Recommended for virtual hosted sites
        secure: false,      // Can be false for http target
      },
    },
  },
});
