import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  // In dev we want '/', in production we want the repo subpath for GH Pages.
  base: mode === 'production' ? '/charlatte-surge-selector/' : '/',
  plugins: [react()],
  server: { port: 5173 }
}));
