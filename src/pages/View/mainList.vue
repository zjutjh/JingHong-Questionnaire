<template>
  <div v-if="props.formData" class="flex flex-col h-650 ">
    <ques-list v-if="props.formData.survey_type === 0" :decrypted-id="props.decryptedId" :question="props.question" />
    <vote-list
      v-else
      :decrypted-id="props.decryptedId"
      :question="props.question"
      :result-data="resultData"
    />
    <div class="flex justify-center items-center py-50">
      <button v-if="props.decryptedId !== '' && !isOutDate" class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="handleSubmit">
        提交
      </button>
    </div>
    <modal modal-id="QuestionnaireSubmit">
      <template #title>
        <span class="text-red-950 dark:text-red-500 ">提交问卷</span>
      </template>
      <template #default>
        你确认要提交问卷吗?
      </template>
      <template #action>
        <button
          class="btn bg-red-800 text-red-50 w-full hover:bg-red-600"
          @click="submit"
        >
          确认
        </button>
      </template>
    </modal>
    <modal modal-id="QuestionnaireSubmitWithVerify">
      <template #title>
        统一身份认证
      </template>
      <template #default>
        <div class="flex-col">
          <div class="flex-col ">
            <span>职工号/学号 <input v-model="verifyData.stu_id" class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10" style="width: 100%"></span><br>
            <span>密码 <br><input
              v-model="verifyData.password"
              class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10 "
              style="width: 100%"
              type="password"
            ></span>
          </div>
          <div class="flex justify-between">
            <div class="text-[12px]">
              问卷限校内作答,请进行<span class="font-bold">统一身份认证</span>
            </div>
            <a href="https://oauth.zjut.edu.cn/im/V3/securitycenter/findPwd/index.zf" style=" text-decoration: underline;" class="text-sm my-5 text-blue-500 dark:text-white">
              忘记密码?
            </a>
          </div>
        </div>
      </template>
      <template #action>
        <button
          class="btn bg-red-800 text-red-50 w-full hover:bg-red-600 mt-[-20px]"
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
import { computed, onMounted, ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import { ElNotification } from "element-plus";
import verifyAPI from "@/apis/service/User/verifyApi.ts";
import { setUserSubmitAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";
import router from "@/router";
import getStatistic from "@/apis/service/User/getStatistic.ts";
const allowSend = ref(true);
const isOutDate = ref(false);
const optionStore = useMainStore().useOptionStore();
const questionnaireStore = useMainStore().useQuetionnaireStore();
const loginStore = useMainStore().useLoginStore();
const zfToken = loginStore.zfToken;

const props = defineProps<{
  formData: any,
  question: any
  decryptedId: any
  submitData: any
}>();
const verifyData = ref({
  stu_id: "",
  password: "",
  survey_id: props.decryptedId
});
const submitData = ref({
  id: Number(props.decryptedId),
  questions_list: [],
  token: ""
});
const resultData = ref();
const handleSubmit = () => {
  const nowDate = Date.now();
  const startTimestamp = new Date(props.formData.start_time).getTime();
  const showTime = props.formData.start_time.replace("T", " ").split("+")[0].split(".")[0];
  if (nowDate - startTimestamp < 0) {
    ElNotification.error(`问卷开始时间为 ${showTime}`);
  } else if (props.formData.verify && needVerify.value || !zfToken) {
    showModal("QuestionnaireSubmitWithVerify");
  } else {
    showModal("QuestionnaireSubmit");
  }
};

onMounted(async () => {
  if (props.formData.survey_type === 1) {
    try {
      const res = await getStatistic({ id: Number(props.decryptedId) });
      resultData.value = res.data.statistics[0].options;
    } catch (e) {
      ElNotification.error(e);
    }
  }
});

const lastDate = localStorage.getItem("timestamp");
const needVerify = computed(() => {
  return !lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000;
});
const verify = () => {
  useRequest(() => verifyAPI(verifyData.value), {
    onSuccess(res) {
      if (res.code === 200) {
        // 更新 token 和 timestamp
        loginStore.zfToken = res.data.token;
        localStorage.setItem("timestamp", String(Date.now()));
        submit();
      } else {
        ElNotification.error(res.msg);
      }
    }
  });
};

const submit = () => {
  checkAnswer();
  if (!allowSend.value) {
    return;
  }
  submitData.value.questions_list = props.question.map((q) => ({
    question_id: q.id,
    serial_num: q.serial_num,
    answer: q.answer
  }));
  submitData.value.token = zfToken;
  useRequest(() => setUserSubmitAPI(submitData.value), {
    onBefore: () => startLoading(),
    async onSuccess(res) {
      if (res.code === 200 && res.msg === "OK") {
        const imageStore = useMainStore().useImageStore();
        ElNotification.success("提交成功");
        questionnaireStore.deleteAnswer(props.decryptedId);
        imageStore.clearFiles();
        optionStore.deleteOption(props.decryptedId);
        if (props.formData.survey_type === 0) {
          router.push("/Thank");
        } else {
          try {
            const res = await getStatistic({ id: Number(props.decryptedId) });
            resultData.value = res.data.statistics[0].options;
          } catch (e) {
            ElNotification.error(e);
          }
        }
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error(e.message);
    },
    onFinally: () => {
      showModal("QuestionnaireSubmit", true);
      showModal("QuestionnaireSubmitWithVerify", true);
      closeLoading();
    }
  });
};

const checkAnswer = () => {
  const hasUnansweredRequiredQuestion = props.question.some((q) => {
    if (q.required && q.answer === "") {
      ElNotification.error("您有题目未完成作答.");
      return true;
    }
    if (q.question_type === 1 && q.answer === " ") {
      ElNotification.error("您有单选题未完成作答.");
      return true;
    }
    if (q.question_type === 2 && (q.answer.endsWith("┋") || q.answer.startsWith("┋"))) {
      ElNotification.error("您有多选题未完成作答.");
      return true;
    }
    if (q.question_type === 2 && q.answer.split("┋").length > q.maximum_option || q.answer.split("┋").length < q.minimum_option) {
      if (q.answer.split("┋").length > q.maximum_option) {
        ElNotification.error(`该投票最多只能选择${q.maximum_option}个选项`);
      } else if (q.answer.split("┋").length < q.minimum_option) {
        ElNotification.error(`该投票最少需要选择${q.maximum_option}个选项`);
      }
      return true;
    }

    if (q.question_type === 3 && q.answer !== "" && q.reg && !new RegExp(q.reg).test(q.answer)) {
      ElNotification.error(`第${q.serial_num}题的回答不符合要求.`);
      return true;
    }
  });
  if (hasUnansweredRequiredQuestion) {
    showModal("QuestionnaireSubmit", true);
    showModal("QuestionnaireSubmitWithVerify", true);
    allowSend.value = false;
    return;
  }
  allowSend.value = true;
};

</script>
<style scoped>

</style>