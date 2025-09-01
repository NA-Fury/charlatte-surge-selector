import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT for GitHub Pages at /charlatte-surge-selector/
export default defineConfig({
  plugins: [react()],
  base: '/charlatte-surge-selector/',
})
