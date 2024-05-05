<template>
  <div class=" overflow-y-scroll h-screen">
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <a class="btn btn-ghost text-xl">JH Questionnaire Survey System</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li @click="router.push('/login')" v-show="!loginStore.loginSession"><a>登陆</a></li>
        <li @click="router.push('/login')" v-show="loginStore.loginSession"><a>问卷详情</a></li>
        <li @click="router.push('/login')" v-show="loginStore.loginSession"><a>问卷列表</a></li>
        <li @click="router.push('/login')" v-show="loginStore.loginSession"><a>数据信息</a></li>
        <li @click="router.push('/login');loginStore.setLogin(false);ElNotification.success('登出成功')" v-show="loginStore.loginSession"><a>登出</a></li>
      </ul>
    </div>
  </div>
  <RouterView>
  </RouterView>
    </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import router from "@/router";
import {useMainStore} from "@/stores";
import {ElNotification} from "element-plus";

const loginStore = useMainStore().useLoginStore();
</script>