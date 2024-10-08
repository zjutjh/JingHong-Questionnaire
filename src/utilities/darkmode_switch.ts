import { ref, watch, onBeforeMount } from 'vue'
import { useMainStore } from '@/stores'
import darkmode_switch from './is_dark' //导入暗黑模式切换dom操作

export function use_darkmode_switch() {
    const darkmode_store = useMainStore().use_darkmode_store()
    const darkmode_status = ref(false) //暗黑模式 状态
    onBeforeMount( //从store中获取当前状态
        () => {
            darkmode_status.value = darkmode_store.status
        }
    )
    watch(darkmode_status, (new_value, old_value) => { //修改status时 上传到store 保存状态
        darkmode_store.set_status(new_value)
        darkmode_switch(new_value)
    })

    return darkmode_status
}