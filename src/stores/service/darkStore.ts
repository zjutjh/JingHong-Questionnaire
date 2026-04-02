import { defineStore } from "pinia";
import { ref } from "vue";

const useDarkModeStore = defineStore("darkmode", () => {
  const status = ref(false);

  return { status };
}, { persist: true });

export default useDarkModeStore;