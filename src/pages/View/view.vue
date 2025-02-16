<template>
  <div class="fixed inset-0 flex items-center justify-center bg-red-300 text-red-950 dark:text-white dark:bg-black">
    <div class="bg-red-50 dark:bg-customGray flex-col overflow-auto w-full sm:w-1/2 lg:w-6/12 p-30 h-full  shadow-lg">
      <div class="flex-col justify-center relative">
        <header-img />
        <ques-header
          v-if="formData"
          :title="formData.title"
          :desc="formData.desc"
          :time="time"
          :daily-limit="formData.daily_limit"
        />
      </div>
      <main-list
        v-if="formData"
        :form-data="formData"
        :question="question"
        :decrypted-id="decryptedId"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getUserAPI, setUserSubmitAPI } from "@/apis";
import { ElNotification } from "element-plus";

import router from "@/router";
import { useRoute } from "vue-router";
import { closeLoading, startLoading } from "@/utilities";
import CryptoJS from "crypto-js";
import { useMainStore } from "@/stores";
import HeaderImg from "@/pages/View/headerImg.vue";
import QuesHeader from "@/pages/View/QuesHeader.vue";
import MainList from "@/pages/View/mainList.vue";
import getStatistic from "@/apis/service/User/getStatistic.ts";
const Key = "JingHong";
const formData = ref();
const question = ref<any[]>([]);
const time = ref();
const loading = ref(true);
const submitData = ref({
  id: null,
  questions_list: []
});
const startTime = ref();
const resultData = ref(undefined);
const route = useRoute();
const loginStore = useMainStore().useLoginStore();
const decryptedId = ref<string | null>();
const allowSend = ref(true);
const isOutDate = ref(false);
const verifyData = ref({
  stu_id: "",
  password: "",
  survey_id: -1
});
const optionStore = useMainStore().useOptionStore();
const questionnaireStore = useMainStore().useQuetionnaireStore();
onMounted(async () => {

  loginStore.setShowHeader(false);
  let idParam = route.query.id as string | undefined;
  if (idParam) {
    // 解密 ID
    idParam = idParam.replace(/ /g, "+");
    decryptedId.value = decryptId(idParam) as string | null;
    // console.log(decryptedId.value)
    verifyData.value.survey_id = Number(decryptedId.value);
    if (decryptedId.value === "") {
      ElNotification.error("无效的问卷id");
    }
  }
  getQuestionnaireView();
  try {
    const res = await getStatistic({ id: Number(decryptedId.value) });
    resultData.value = res.data.statistics[0].options;
  } catch (e) {
    ElNotification.error(e);
  }
});

const tokenOutDate = computed(() => {
  const lastDate = localStorage.getItem("timestamp");
  // 如果没有存储时间戳（首次请求或过期），调用 verifyAPI
  return !(!lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000);
});

const verify = () => {
  const lastDate = localStorage.getItem("timestamp");
  // 如果没有存储时间戳（首次请求或过期），调用 verifyAPI
  if (!lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000) {
    // 调用 verifyAPI 获取新的 token
    useRequest(() => verifyAPI(verifyData.value), {
      onSuccess(res) {
        if (res.code === 200) {
          // 更新 token 和 timestamp
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("timestamp", String(Date.now()));
          submit();
        } else {
          ElNotification.error(res.msg);
        }
      }
    });
  } else {
    // 如果 timestamp 存在且未过期，直接调用 submit
    submit();
  }
};

watch(question, (newQuestions) => {
  newQuestions.forEach(q => {
    if (q.answer) {
      questionnaireStore.updateAnswer(decryptedId.value, q.serial_num, q.answer);
    }
  });
}, { deep: true });

const decryptId = (encryptedId) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedId, Key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    ElNotification.error("无效的问卷id" + error);
  }
};

const handleSubmit = () => {
  const nowDate = Date.now();
  const startTimestamp = new Date(startTime.value).getTime();
  const showTime = startTime.value.replace("T", " ").split("+")[0].split(".")[0];
  if (nowDate - startTimestamp < 0) {
    ElNotification.error(`问卷开始时间为 ${showTime}`);
  } else {
    showModal("QuestionnaireSubmit");
  }
};
const getQuestionnaireView = () => {
  if (decryptedId.value) {
    useRequest(() => getUserAPI({ id: decryptedId.value as number }), {
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200) {
          formData.value = res.data;
          question.value = formData.value.questions;
          time.value = formData.value.time.replace("T", " ").split("+")[0].split(".")[0];
          submitData.value.id = res.data.id;
          startTime.value = res.data.start_time;
          // console.log("问卷id:"+submitData.value.id)
          question.value.forEach(q => {
            // 获取已存储的答案
            const storedAnswer = questionnaireStore.searchAnswer(decryptedId.value, q.serial_num);
            if (storedAnswer) {
              q.answer = storedAnswer.answer;
            } else if (q.question_type === 1) {
              q.answer = " ";
            } else {
              q.answer = "";
            }
          });
          loading.value = false;
        } else if (res.code === 200509) {
          isOutDate.value = true;
          ElNotification.error(res.msg);
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error("获取失败，请重试" + e);
      },
      onFinally: () => closeLoading()
    });
  }
};

const checkAnswer = () => {
  const hasUnansweredRequiredQuestion = question.value.some((q) => {
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
    allowSend.value = false;
    return;
  }
  allowSend.value = true;
};

const submit = () => {
  checkAnswer();
  if (allowSend.value === false) {
    return;
  }
  submitData.value.questions_list = question.value.map((q) => ({
    question_id: q.id,
    serial_num: q.serial_num,
    answer: q.answer
  }));
  submitData.value.token = localStorage.getItem("token");
  useRequest(() => setUserSubmitAPI(submitData.value), {
    onBefore: () => startLoading(),
    async onSuccess(res) {
      if (res.code === 200 && res.msg === "OK") {
        const imageStore = useMainStore().useImageStore();
        ElNotification.success("提交成功");
        questionnaireStore.deleteAnswer(decryptedId.value);
        imageStore.clearFiles();
        optionStore.deleteOption(decryptedId.value);
        if (formData.value.survey_type === 0) {
          router.push("/Thank");
        } else {
          try {
            const res = await getStatistic({ id: Number(decryptedId.value) });
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
      closeLoading();
    }
  });
};

</script>

  <style scoped>
  pre {
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* InternetExplorer5.5+ */
    white-space: -moz-pre-wrap; /* Mozilla,since1999 */
    white-space: -o-pre-wrap; /* Opera7 */
  }

  </style>