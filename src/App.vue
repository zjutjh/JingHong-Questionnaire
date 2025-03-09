<template>
  <div class=" h-[100vh] bg-base-100 flex flex-col ">
    <div v-if="loginStore.showHeader" class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">JH Questionnaire Survey System</a>
      </div>
      <div>
        <el-switch
          v-model="darkModeStatus"
          size="large"
          active-text="Dark"
          inactive-text="Light"
          style="--el-switch-on-color: #000000"
        />
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li v-show="!loginStore.loginSession" @click="router.push('/login')">
            <a>登录</a>
          </li>
          <li v-show="loginStore.loginSession" @click="router.push('/')">
            <a>问卷列表</a>
          </li>
          <li
            v-show="loginStore.loginSession"
            @click="router.push('/login'); loginStore.setLogin(false); ElNotification.success('登出成功')"
          >
            <a>登出</a>
          </li>
        </ul>
      </div>
    </div>
    <router-view v-slot="{ Component }" class="flex-1 dark:text-white">
      <component :is="Component" />
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import router from "@/router";
import { useMainStore } from "@/stores";
import { ElNotification } from "element-plus";

const loginStore = useMainStore().useLoginStore();

// 暗黑模式功能
import { useDarkModeSwitch } from "./utilities/darkModeSwitch";
const { darkModeStatus } = useDarkModeSwitch(); // 暗黑模式 状态

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