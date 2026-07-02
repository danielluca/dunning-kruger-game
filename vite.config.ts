import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this app under /<repo-name>/ by default.
  // Override with VITE_BASE_PATH if needed (e.g. custom domain root '/').
  base: process.env.VITE_BASE_PATH ?? '/dunning-kruger-game/',
  plugins: [react()],
})
