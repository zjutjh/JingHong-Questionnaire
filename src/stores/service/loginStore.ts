import { defineStore } from "pinia";
import { ref } from "vue";

const useLoginStore = defineStore("login", () => {
  const loginSession = ref(false);
  const showHeader = ref(true);
  const setLogin = (loginNewSession: boolean) => {
    loginSession.value = loginNewSession;
  };

  const setShowHeader = (showHeaderNew: boolean) => {
    showHeader.value = showHeaderNew;
  };

  const zfToken = ref("");
  return {
    setLogin,
    loginSession,
    setShowHeader,
    showHeader,
    zfToken
  };
}, { persist: true });

export default useLoginStore;