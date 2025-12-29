<template>
  <div class="flex justify-evenly gap-70 mt-60 " style="height: 85vh">
    <div class="flex justify-center items-center w-1/2">
      <el-image class="h-250" src="/JH_logo.svg" />
    </div>
    <div class="flex justify-center items-center">
      <el-divider direction="vertical" />
    </div>
    <div class="flex justify-start items-center w-1/2">
      <div
        class="bg-base-200 dark:bg-customGray
      shadow-lg h-auto p-20 rounded-3xl w-10/12 items-center justify-center
      hover:shadow-2xl hover:-translate-y-2 transform duration-700"
      >
        <div class="flex justify-center items-center mt-15">
          <span class="text-4xl font-medium my-10">精弘网络问卷系统</span>
        </div>
        <div class="flex justify-center gap-30 flex-col h-300 p-40">
          <div class="w-full">
            <div class="text-xl mb-5">
              账号
            </div>
            <el-input v-model="username" class="h-45 my-10 dark:rounded-xl dark:bg-customGray_shallow" placeholder="问卷管理账号" />
          </div>
          <div class="w-full">
            <div class="text-xl mb-5">
              密码
            </div>
            <el-input
              v-model="password"
              class="h-45 mt-10 dark:rounded-xl dark:bg-customGray_shallow "
              placeholder="密码"
              type="password"
              @keyup.enter="send"
            />
          </div>
        </div>
        <div class="flex justify-evenly items-center mb-20 ">
          <el-button
            class="dark:opacity-80 shadow-lg  hover:-translate-y-1 transform duration-800"
            size="large"
            type="success"
            @click="send"
          >
            登录
          </el-button>
          <el-button
            class="dark:opacity-80 shadow-lg hover:-translate-y-1 transform duration-800"
            size="large"
            type="danger"
            @click="clear"
          >
            清空
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import { loginAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { useMainStore } from "@/stores";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";

const password = ref<string>("");
const username = ref<string>("");
const loginStore = useMainStore().useLoginStore();

onMounted(() => {
  loginStore.setShowHeader(true);
});
const send = () => {
  useRequest(() => loginAPI({
    username: username.value,
    password: password.value
  }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success("登录成功");
        loginStore.setLogin(true);
        router.push("/admin");
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error("登录失败，请重试" + e);
    },
    onFinally: () => closeLoading()
  });
};

const clear = () => {
  password.value = "";
  username.value = "";
};

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