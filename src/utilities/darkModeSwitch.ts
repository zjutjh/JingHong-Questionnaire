import { ref, watch, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores'
import darkModeSwitch from './isDark' //导入暗黑模式切换dom操作

export function useDarkModeSwitch() {
    const darkModeStore = useMainStore().useDarkModeStore()
    const darkModeStatus = ref(false) //暗黑模式 状态
    onBeforeMount( //从store中获取当前状态
        () => {
            darkModeStatus.value = darkModeStore.status
        }
    )
    watch(darkModeStatus, (new_value, old_value) => { //修改status时 上传到store 保存状态
        darkModeStore.setStatus(new_value)
        darkModeSwitch(new_value)
    })

    return darkModeStatus
}