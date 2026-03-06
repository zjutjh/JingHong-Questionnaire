import { defineStore } from "pinia";
import { ref, computed } from "vue";

const useLoginStore = defineStore("login", () => {
  const loginSession = ref(false);
  const showHeader = ref(true);

  const setLogin = (loginNewSession: boolean) => {
    loginSession.value = loginNewSession;
  };

  const setShowHeader = (showHeaderNew: boolean) => {
    showHeader.value = showHeaderNew;
  };

  const isTokenValid = computed(() => {
    const lastDate = localStorage.getItem("timestamp");
    return !(!lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000);
  });

  return {
    setLogin,
    loginSession,
    setShowHeader,
    showHeader,
    isTokenValid
  };
}, { persist: true });

export default useLoginStore;