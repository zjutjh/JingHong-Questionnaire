import { defineStore } from "pinia";
import { ref } from "vue";

const use_darkmode_store = defineStore("darkmode", () => {
    const status = ref(false)
    const set_status = (temp_status: boolean) => {
        status.value = temp_status
    }
    return {
        status,
        set_status
    }
}, { persist: true })

export default use_darkmode_store