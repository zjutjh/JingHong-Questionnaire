<template>
<div class="flex justify-evenly gap-70 h-screen bg-gray-100">
  <div class="flex justify-center items-center w-1/2">
  <el-image class="h-250 " src="./jh.png"></el-image>
  </div>
  <div class="flex justify-center items-center">
  <el-divider direction="vertical" ></el-divider>
  </div>
  <div class="flex justify-start items-center w-1/2">
    <div class="shadow-lg h-auto p-20 bg-gray-200 rounded-3xl w-10/12 items-center justify-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
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
        <el-input class="h-45 mt-10 " placeholder="密码"  v-model="password" ></el-input>
      </div>
      </div>
      <div class="flex justify-evenly items-center mb-20 ">
        <el-button class="shadow-lg  hover:-translate-y-1 transform duration-800" size="large" type="success" >登陆</el-button>
        <el-button class="shadow-lg hover:-translate-y-1 transform duration-800" size="large" type="danger" >清空</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">

import {ref} from "vue";

const password = ref<string>('')
const username = ref<string>('')
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