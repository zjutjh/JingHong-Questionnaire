<template>
<div class="flex justify-evenly gap-70 h-screen ">
  <div class="flex justify-center items-center w-1/2">
    <el-image class="h-250" src='/JH_logo.svg' ></el-image>
  </div>
  <div class="flex justify-center items-center">
  <el-divider direction="vertical" ></el-divider>
  </div>
  <div class="flex justify-start items-center w-1/2">
    <div class="shadow-lg h-auto p-20 bg-indigo-100 rounded-3xl w-10/12 items-center justify-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
      <div class="flex justify-center items-center mt-15">
    <span class="text-4xl font-medium my-10">精弘⽹络问卷系统</span>
      </div>
      <div class="flex justify-center gap-30 flex-col h-300 p-40">
      <div class="w-full">
        <div class="text-xl mb-5">账号</div>
        <el-input class="h-45 my-10  " placeholder="问卷管理账号" v-model="username"></el-input>
      </div>
      <div class="w-full">
        <div class="text-xl mb-5">密码</div>
        <el-input class="h-45 mt-10 " placeholder="密码"  v-model="password" @keyup.enter="send"></el-input>
      </div>
      </div>
      <div class="flex justify-evenly items-center mb-20 ">
        <el-button class="shadow-lg  hover:-translate-y-1 transform duration-800" size="large" type="success" @click="send" >登陆</el-button>
        <el-button class="shadow-lg hover:-translate-y-1 transform duration-800" size="large" type="danger" @click="clear" >清空</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useRequest} from "vue-hooks-plus";
import {loginAPI} from "@/apis";
import {ElNotification} from "element-plus";
import {useMainStore} from "@/stores";
import router from "@/router";
import {closeLoading, startLoading} from "@/utilities";

const password = ref<string>('')
const username = ref<string>('')
const loginStore = useMainStore().useLoginStore();

const send = () => {
  useRequest(() => loginAPI({
    username:username.value,
    password:password.value
  }),{
    onBefore: () => startLoading(),
    onSuccess(res: any){
      console.log(res)
      if(res.code === 200) {
        ElNotification.success('登陆成功');
        loginStore.setLogin(true)
        router.push('/')
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('登录失败，请重试' + e);
    },
    onFinally: () => closeLoading()
  })
}

const clear = () => {
  password.value = ''
  username.value = ''
}
</script>

<style scoped>
.el-divider--vertical{
  display:inline-block;
  width:1px;
  height:70%;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
}

/deep/.el-button{
  border-radius: 10px;
}

/deep/.el-input__wrapper{
  border-radius: 15px;
  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}


</style>