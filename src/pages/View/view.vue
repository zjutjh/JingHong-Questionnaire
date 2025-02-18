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
        :submit-data="submitData"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getUserAPI } from "@/apis";
import { ElNotification } from "element-plus";
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
const isOutDate = ref(false);
const verifyData = ref({
  stu_id: "",
  password: "",
  survey_id: -1
});
const questionnaireStore = useMainStore().useQuetionnaireStore();
onMounted(async () => {
  loginStore.setShowHeader(false);
  let idParam = route.query.id as string | undefined;
  if (idParam) {
    idParam = idParam.replace(/ /g, "+");
    decryptedId.value = decryptId(idParam) as string | null;
    verifyData.value.survey_id = Number(decryptedId.value);
    if (decryptedId.value === "") {
      ElNotification.error("无效的问卷id");
    }
  }
  getQuestionnaireView();

});

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

</script>

<style scoped>
  pre {
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* InternetExplorer5.5+ */
    white-space: -moz-pre-wrap; /* Mozilla,since1999 */
    white-space: -o-pre-wrap; /* Opera7 */
  }

</style>