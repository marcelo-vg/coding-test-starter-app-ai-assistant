import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    // The shared/ directory lives outside this Vite root.
    fs: { allow: ['..'] },
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
