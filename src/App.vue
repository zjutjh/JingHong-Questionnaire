<template>
  <div class="overflow-y-scroll h-screen bg-base-100">
    <div class="navbar bg-base-100 shadow-lg" v-if="loginStore.showHeader">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">JH Questionnaire Survey System</a>
      </div>
      <div class="absolute right-180">
        <el-switch
          v-model="darkmode_status"
          size="large"
          active-text="Dark"
          inactive-text="Light"
          style="--el-switch-on-color: #000000"
        />
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li @click="router.push('/login')" v-show="!loginStore.loginSession"><a>登陆</a></li>
          <li @click="router.push('/')" v-show="loginStore.loginSession"><a>问卷列表</a></li>
          <li @click="router.push('/login'); loginStore.setLogin(false); ElNotification.success('登出成功')"
            v-show="loginStore.loginSession"><a>登出</a></li>
        </ul>
      </div>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import router from "@/router";
import { useMainStore } from "@/stores";
import { ElNotification } from "element-plus";
import { ref,watch,onBeforeMount,onMounted } from 'vue';



const loginStore = useMainStore().useLoginStore();


//暗黑模式功能

  const darkmode_store = useMainStore().use_darkmode_store()

  const darkmode_status = ref(false) //暗黑模式 状态

  onBeforeMount( //从store中获取当前状态
    () => {
      darkmode_status.value = darkmode_store.status
    }
  )

  //导入暗黑模式切换dom操作
  import darkmode_switch from './utilities/is_dark';

  onMounted(() => {
    darkmode_switch(darkmode_status.value)
  });

  watch(darkmode_status,(new_value,old_value)=>{ //修改status时 上传到store 保存状态
      darkmode_store.set_status(new_value)
      darkmode_switch(new_value)
  })



</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
  /* 添加 transform 过渡 */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
  /* 初始状态下下移 */
}

.fade-leave-from,
.fade-enter-to {
  opacity: 1;
  /* 进入结束时透明度变为 1 */
  transform: translateY(0);
  /* 进入结束时上移至原位置 */
}

.dark .bg-base-100 {
    background-color: #1a1a1a !important; /* 深色背景色 */
    color: #ffffff !important;
}
</style>