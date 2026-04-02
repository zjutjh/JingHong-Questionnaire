import { computed } from "vue";
import { storeToRefs } from "pinia";
import useDarkModeStore from "@/stores/service/darkStore";

const syncDOM = (enabled: boolean) => {
  document.documentElement.classList.toggle("dark", enabled);
};

export const initDarkMode = () => {
  const { status } = storeToRefs(useDarkModeStore());
  syncDOM(status.value);
};

export function useDarkModeSwitch() {
  const { status } = storeToRefs(useDarkModeStore());

  const setStatus = (val: boolean) => {
    status.value = val;
    syncDOM(val);
  };

  const darkModeStatus = computed({
    get: () => status.value,
    set: (val: boolean) => setStatus(val)
  });

  const switchDarkMode = () => setStatus(!status.value);

  return { darkModeStatus, switchDarkMode };
}