//存储单选和多选的
import { defineStore } from "pinia";
import { ref } from "vue";

const useOptionStore = defineStore('OptionStore', () => {
    const options = ref([])
    const search = (serial_num: number) => {
        const optionSearched = options.value.find(q => q.serial_num === serial_num)
        console.log(optionSearched)
        return optionSearched ? optionSearched.option : ''
    }
    const update = (serial_num: number, option: string) => {
        const tempOption = options.value.find(q => q.serial_num === serial_num)
        if (tempOption) {
            tempOption.option = option
        } else {
            options.value.push({
                serial_num: serial_num,
                option: option
            })
        }
    }
    return {
        options,
        search,
        update
    }
}, { persist: true })

export default useOptionStore