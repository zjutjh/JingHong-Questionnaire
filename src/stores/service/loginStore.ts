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

  return {
    setLogin,
    loginSession,
    setShowHeader,
    showHeader
  };
}, { persist: true });

export default useLoginStore;