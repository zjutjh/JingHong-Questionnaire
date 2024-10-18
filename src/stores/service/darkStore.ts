import { defineStore } from "pinia";
import { ref } from "vue";

const useDarkModeStore = defineStore("darkmode", () => {
    const status = ref(false)
    const setStatus = (temp_status: boolean) => {
        status.value = temp_status
    }
    return {
        status,
        setStatus
    }
}, { persist: true })

export default useDarkModeStore