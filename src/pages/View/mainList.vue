<template>
  <div v-if="props.formData" class="flex flex-col h-650 ">
    <ques-list v-if="props.formData.survey_type === 0" :decrypted-id="props.decryptedId" :question="props.question" />
    <vote-list
      v-else
      :decrypted-id="props.decryptedId"
      :question="props.question"
      :result-data="props.resultData"
    />
    <div class="flex justify-center items-center py-50">
      <button v-if="props.decryptedId !== '' && !isOutDate" class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="showModal('QuestionnaireSubmit')">
        提交
      </button>
    </div>
    <modal modal-id="QuestionnaireSubmit">
      <template #title>
        <span class="text-red-950 dark:text-red-500 ">提交问卷</span>
      </template>

      <template v-if="formData && !formData.verify || tokenOutDate" #default>
        你确认要提交问卷吗?
      </template>
      <template v-else #default>
        <div class="flex-col">
          <div class="text-sm">
            该问卷仅限校内师生作答,提交前需要先进行<span class="font-bold">统一身份认证</span>
          </div>
          <div class="flex-col my-10">
            <span>职工号/学号 <input v-model="verifyData.stu_id" class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10" style="width: 100%"></span><br>
            <span>密码 <br><input
              v-model="verifyData.password"
              class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10 "
              style="width: 100%"
              type="password"
            ></span>
          </div>
          <div class="flex justify-end">
            <a href="https://oauth.zjut.edu.cn/im/V3/securitycenter/findPwd/index.zf" style=" text-decoration: underline;;" class="text-sm my-5 text-blue-500 dark:text-white">
              忘记密码?
            </a>
          </div>
        </div>
      </template>
      <template #action>
        <button
          v-if="formData && !formData.verify || tokenOutDate"
          class="btn bg-red-800 text-red-50 w-full hover:bg-red-600"
          style="margin-top: -10px"
          @click="submit"
        >
          确认
        </button>
        <button
          v-else
          class="btn bg-red-800 text-red-50 w-full hover:bg-red-600"
          style="margin-top: -10px"
          @click="verify"
        >
          确认
        </button>
      </template>
    </modal>
  </div>
</template>
<script setup lang="ts">
import QuesList from "@/pages/View/quesList.vue";
import VoteList from "@/pages/View/voteList.vue";
import { showModal, modal } from "@/components";
import { ref } from "vue";
const allowSend = ref(true);
const isOutDate = ref(false);
const verifyData = ref({
  stu_id: "",
  password: "",
  survey_id: -1
});
const props = defineProps<{
  formData: any,
  question: any
  decryptedId: any
  resultData?: any
}>();

</script>
<style scoped>

</style>