// Vite configuration for the React client.
// During development, any request to /api is forwarded to the Express
// server on port 5000, so the browser only ever talks to one address.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
