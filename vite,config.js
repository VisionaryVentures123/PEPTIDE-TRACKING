import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Peptide Research Tracker.
// See https://vitejs.dev/config/ for more details.

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3000
  }
});
