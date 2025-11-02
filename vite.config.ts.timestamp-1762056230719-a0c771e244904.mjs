// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import AutoImport from "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/node_modules/.pnpm/unplugin-auto-import@0.18.6_d9e6e579418a34077a4226630661739d/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/node_modules/.pnpm/unplugin-vue-components@0.2_d7c22f76d51bb64492f595473f0b7eaf/node_modules/unplugin-vue-components/dist/vite.js";
import { defineConfig, loadEnv } from "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.23/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_3f1c3a82a708c3c7ccd7e2e6cebc2c93/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { ElementPlusResolver } from "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/node_modules/.pnpm/unplugin-vue-components@0.2_d7c22f76d51bb64492f595473f0b7eaf/node_modules/unplugin-vue-components/dist/resolvers.js";
const __vite_injected_original_import_meta_url = "file:///D:/a/vuetest/jhwork/JingHong-Questionnaire/vite.config.ts";
const vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    server: {
      proxy: {
        "/api": env.VITE_HOST
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      }
    }
  };
});
export {
  vite_config_default as default
};
// # sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhXFxcXHZ1ZXRlc3RcXFxcamh3b3JrXFxcXEppbmdIb25nLVF1ZXN0aW9ubmFpcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFcXFxcdnVldGVzdFxcXFxqaHdvcmtcXFxcSmluZ0hvbmctUXVlc3Rpb25uYWlyZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYS92dWV0ZXN0L2pod29yay9KaW5nSG9uZy1RdWVzdGlvbm5haXJlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSBcIm5vZGU6dXJsXCI7XG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgbG9hZEVudiB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCBcIlwiKTtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgICB9KVxuXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIFwiL2FwaVwiOiBlbnYuVklURV9IT1NUXG4gICAgICB9XG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSlcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwVCxTQUFTLGVBQWUsV0FBVztBQUM3VixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLGNBQWMsZUFBZTtBQUN0QyxPQUFPLFNBQVM7QUFDaEIsU0FBUywyQkFBMkI7QUFMaUssSUFBTSwyQ0FBMkM7QUFPdFAsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ25DLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQztBQUFBLE1BQ25DLENBQUM7QUFBQSxJQUVIO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixPQUFPO0FBQUEsUUFDTCxRQUFRLElBQUk7QUFBQSxNQUNkO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBRUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
