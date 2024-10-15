//存储单选和多选的
import { defineStore } from "pinia";
import { ref } from "vue";

const useOptionStore = defineStore('OptionStore', () => {
    const options = ref([])
    const search = (id: any, serial_num: number) => {
        const optionSearched = options.value.find(q => q.id === id && q.serial_num === serial_num)
        console.log(optionSearched)
        return optionSearched ? optionSearched.option : ''
    }
    const update = (id: any, serial_num: number, option: string) => {
        const tempOption = options.value.find(q => q.id === id && q.serial_num === serial_num)
        if (tempOption) {
            tempOption.option = option
        } else {
            options.value.push({
                id: id,
                serial_num: serial_num,
                option: option
            })
        }
    }

    const deleteOption = (id: any) => {
        options.value = options.value.filter(o => o.id !== id)
    }

    return {
        options,
        search,
        update,
        deleteOption
    }
}, { persist: true })

export default useOptionStore