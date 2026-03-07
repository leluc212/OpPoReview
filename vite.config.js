import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/OpPoReview/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
