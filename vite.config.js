import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/OpPoReview/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://xyp4wkszi7.execute-api.ap-southeast-1.amazonaws.com/prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true
      },
      '/api-employer': {
        target: 'https://dlidp35x33.execute-api.ap-southeast-1.amazonaws.com/prod',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-employer/, ''),
        secure: true
      }
    }
  },
  build: {
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    include: ['@popperjs/core']
  }
})
