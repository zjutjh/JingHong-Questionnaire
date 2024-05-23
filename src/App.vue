<template>
  <div class=" overflow-y-scroll h-screen bg-sky-100">
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">JH Questionnaire Survey System</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li @click="router.push('/login')" v-show="!loginStore.loginSession"><a>登陆</a></li>
        <li @click="router.push('/detailInfo')" v-show="loginStore.loginSession"><a>问卷详情</a></li>
        <li @click="router.push('/')" v-show="loginStore.loginSession"><a>问卷列表</a></li>
        <li @click="router.push('/Data')" v-show="loginStore.loginSession"><a>数据信息</a></li>
        <li @click="router.push('/login');loginStore.setLogin(false);ElNotification.success('登出成功')" v-show="loginStore.loginSession"><a>登出</a></li>
      </ul>
    </div>
  </div>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" class="mt-60"/>
      </transition>
    </router-view>
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import router from "@/router";
import {useMainStore} from "@/stores";
import {ElNotification} from "element-plus";

const loginStore = useMainStore().useLoginStore();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease; /* 添加 transform 过渡 */
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px); /* 初始状态下下移 */
}
.fade-leave-from,
.fade-enter-to {
  opacity: 1; /* 进入结束时透明度变为 1 */
  transform: translateY(0); /* 进入结束时上移至原位置 */
}

</style>