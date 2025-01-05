import zjutjh from "@zjutjh/eslint-config";

export default [
  ...await zjutjh({
    overrides: {
      vue: {
        "vue/multi-word-component-names": "off",
        "vue/require-v-for-key": "off"
      }
    }
  }),
  {
    name: "local/ignores",
    ignores: [
      "dist",
      "tailwind.config.cjs",
      "components.d.ts",
      "auto-imports.d.ts",
      "uploadToQiniu.js"
    ]
  }
];