import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  base: process.env.NODE_ENV ==='https://img.lonesome.cn/jhwl/project/questionnaire/',
  server:{
    proxy:{
      '/api':{
        target:"https://qa.qianqianzyk.top",
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
