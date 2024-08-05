import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  server:{
    proxy:{
      '/api':{
        target:"https://phlin.top",
        changeOrigin: true,
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})