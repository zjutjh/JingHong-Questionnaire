import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),

    ],
    server: {
      proxy: {
        "/api": env.VITE_HOST
      }
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }

})
