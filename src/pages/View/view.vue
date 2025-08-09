<template>
  <div class="fixed inset-0 flex items-center justify-center bg-red-50 text-red-950 dark:text-white dark:bg-black">
    <div class="bg-white  dark:bg-customGray flex-col overflow-auto lg:w-1/2 w-full sm:w-2/3  py-30 sm:px-15 px-10 h-full  shadow-lg">
      <div class="flex-col justify-center relative">
        <div class="flex justify-center">
          <div class="absolute top-0 right-10 z-10 mr-10">
            <button
              class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
              @click="switchDarkMode"
            >
              <span v-if="!darkModeStatus">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-50 w-50 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h1m-16 0H3m15.364-7.364l-.707.707M6.636 17.364l-.707.707m12.728-12.728l-.707.707M6.636 6.636l-.707-.707M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5z"
                  />
                </svg>
              </span>
              <span v-else>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-60 w-60 text-customGray_more_shallow"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 3c0 6.627 0 12 0 12a6 6 0 1 1 0-12z" />
                </svg>
              </span>
            </button>
          </div>

          <el-image class="w-2/3" src="https://img.lonesome.cn/jhwl/project/questionnaire/jxh_logo.webp" />
        </div>
        <el-skeleton
          :loading="loading"
          :rows="1"
          animated
          style="height: 60px"
        >
          <template #default>
            <div v-if="showData" class="flex flex-col ">
              <div class="divider" />
              <div class="flex gap-20 my-10 justify-center">
                <span class="text-[1.5rem] break-all md:px-50 px-20">{{ showData.quesConfig.title }}</span>
              </div>
              <div v-if="showData.quesConfig.desc !== ''" class="items-top my-10 items-start md:mx-20 mx-10">
                <div class="items-top my-10 items-start ">
                  <pre class="text-gray-500 flex break-all text-[1rem] dark:text-white dark:opacity-50">{{ showData.quesConfig.desc }}</pre>
                </div>
              </div>
            </div>
            <div class="flex gap-20 items-center my-10  md:ml-20 ml-10">
              <span class="text-red-950 dark:text-red-400 dark:opacity-80">开始时间:</span>
              <span>{{ startTime }}</span>
            </div>
            <div class="flex gap-20 items-center my-10  md:ml-20 ml-10">
              <span class="text-red-950 dark:text-red-400 dark:opacity-80">截止时间:</span>
              <span>{{ time }}</span>
            </div>
            <div v-if="showData.baseConfig.dayLimit !== 0 && showData.baseConfig.verify" class="flex gap-20 items-center my-10  md:ml-20 ml-10">
              <span class=" dark:opacity-80 text-gray-700 dark:text-gray-400">本问卷每天最多提交 <span class="text-red-950 dark:text-red-400 dark:opacity-80">{{ showData.baseConfig.dayLimit }} </span> 次</span>
            </div>
            <div v-if="showData.baseConfig.sumLimit !== 0 && showData.baseConfig.verify" class="flex gap-20 items-center my-10  md:ml-20 ml-10">
              <span class=" dark:opacity-80 text-gray-700 dark:text-gray-400">本问卷总共最多提交 <span class="text-red-950 dark:text-red-400 dark:opacity-80">{{ showData.baseConfig.sumLimit }} </span> 次</span>
            </div>
            <div class="divider my-10" />
          </template>
        </el-skeleton>
      </div>
      <div v-if="showData && showData.surveyType === 0" class="flex flex-col h-650 ">
        <div v-for="q in showData.quesConfig.questionList" :key="q.serial_num">
          <!-- 根据问题类型渲染组件 -->
          <div v-if="q.quesSetting.questionType === 1">
            <el-skeleton animated :loading="loading">
              <radio
                v-model:answer="q.answer"
                :title="q.subject"
                :options="q.options"
                :serial_num="q.serialNum"
                :unique="q.quesSetting.unique"
                :required="q.quesSetting.required"
                :other-option="q.quesSetting.otherOption"
                :describe="q.description"
                :questionnaire-i-d="decryptedId"
              />
            </el-skeleton>
          </div>
          <div v-if="q.quesSetting.questionType === 2">
            <el-skeleton animated :loading="loading">
              <template #template>
                <skeleton-card />
              </template>
              <template #default>
                <checkbox
                  v-model:answer="q.answer"
                  :title="q.subject"
                  :options="q.options"
                  :serial_num="q.serialNum"
                  :unique="q.quesSetting.unique"
                  :required="q.quesSetting.required"
                  :other-option="q.quesSetting.otherOption"
                  :describe="q.description"
                  :questionnaire-i-d="decryptedId as string"
                  :minimum_option="q.quesSetting.minimumOption"
                  :maximum_option="q.quesSetting.maximumOption"
                />
              </template>
            </el-skeleton>
          </div>
          <div v-if="q.quesSetting.questionType === 3">
            <el-skeleton animated :loading="loading">
              <template #template>
                <skeleton-card />
              </template>
              <template #default>
                <fill
                  v-model:answer="q.answer"
                  :title="q.subject"
                  :serial_num="q.serialNum"
                  :reg="q.quesSetting.reg"
                  :unique="q.quesSetting.unique"
                  :required="q.quesSetting.required"
                  :describe="q.description"
                />
              </template>
            </el-skeleton>
          </div>
          <div v-if="q.quesSetting.questionType === 4">
            <el-skeleton :loading="loading">
              <template #template>
                <skeleton-card />
              </template>
              <template #default>
                <text-area
                  v-model:answer="q.answer"
                  :title="q.subject"
                  :serial_num="q.serialNum"
                  :unique="q.quesSetting.unique"
                  :required="q.quesSetting.required"
                  :describe="q.description"
                />
              </template>
            </el-skeleton>
          </div>
          <div v-if="q.quesSetting.questionType === 5">
            <el-skeleton animated :loading="loading">
              <template #template>
                <skeleton-card />
              </template>
              <template #default>
                <file
                  v-model:answer="q.answer"
                  :title="q.subject"
                  :serial_num="q.serialNum"
                  :unique="q.quesSetting.unique"
                  :required="q.quesSetting.required"
                  :describe="q.description"
                />
              </template>
            </el-skeleton>
          </div>
        </div>
        <div class="flex justify-center items-center py-50">
          <button v-if="decryptedId !== '' && !isOutDate" class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="handleSubmit">
            提交问卷
          </button>
        </div>
      </div>
      <div v-if="showData && showData.surveyType === 1" class="flex flex-col  ">
        <div v-for="(q, index) in showData.quesConfig.questionList" :key="index">
          <vote
            v-model:answer="q.answer"
            :title="q.subject"
            :options="q.options"
            :serial_num="q.serialNum"
            :unique="q.quesSetting.unique"
            :required="q.quesSetting.required"
            :other-option="q.quesSetting.otherOption"
            :describe="q.describe"
            :questionnaire-i-d="decryptedId"
            :minimum_option="q.quesSetting.minimumOption"
            :maximum_option="q.quesSetting.maximumOption"
            :count="resultData"
          />
        </div>
        <div class="flex justify-center items-center py-30 mx-10">
          <button v-if="decryptedId !== '' && !isOutDate" class="btn w-full bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600 rounded-none" @click=" handleSubmit">
            提交问卷
          </button>
        </div>
      </div>
      <modal
        modal-id="QuestionnaireSubmit"
        white
        un-rounded
        no-pb
      >
        <template #title>
          <span class="text-red-950 dark:text-red-500 text-[1.5rem]">提交问卷</span>
        </template>

        <template v-if="showData && !showData.baseConfig.verify || tokenOutDate" #default>
          你确认要提交问卷吗?
          <el-button
            v-if="showData && !showData.baseConfig.verify || tokenOutDate"
            class="btn bg-red-800 text-red-50 w-full hover:bg-red-600 rounded-none h-40 min-h-0 mt-15"
            :disabled="disabledInput"
            @click="submit"
          >
            确认
          </el-button>
        </template>
        <template v-else #default>
          <div class="flex-col">
            <div v-if="showData?.baseConfig.undergradOnly" class="text-sm">
              该问卷仅限校内{{ showData?.baseConfig.undergradOnly ? '本科生':'学生' }}作答,提交前需要先进行<span class="font-bold">统一身份认证</span>
            </div>
            <div class="flex-col gap-10 mt-10">
              <span class="flex gap-10 text-sm items-center"><span class="w-110 flex justify-end">职工号/学号</span> <el-input v-model="verifyData.stu_id" :disabled="disabledInput" /></span>
              <span class="text-sm flex gap-10 mt-10 items-center"><span class="w-110 flex justify-end">密码 </span><el-input
                v-model="verifyData.password"
                :disabled="disabledInput"
                type="password"
              /></span>
            </div>
            <div class="flex justify-end">
              <a href="https://oauth.zjut.edu.cn/im/V3/securitycenter/findPwd/index.zf" style=" text-decoration: underline;" class="text-sm my-5 text-blue-500 dark:text-white ">
                忘记密码?
              </a>
            </div>
          </div>
          <div>
            <el-button
              v-if="showData && !showData.baseConfig.verify || tokenOutDate"
              class="btn bg-red-800 text-red-50 w-full hover:bg-red-600 rounded-none h-40 min-h-0"
              :disabled="disabledInput"
              @click="submit"
            >
              确认
            </el-button>
            <el-button
              v-else
              class="btn bg-red-800 text-red-50 w-full hover:bg-red-600 rounded-none h-40 min-h-0"
              :disabled="disabledInput"
              @click="verify"
            >
              确认
            </el-button>
          </div>
        </template>
      </modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getUserAPI, setUserSubmitAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal } from "@/components";
import radio from "@/pages/View/radio.vue";
import Checkbox from "@/pages/View/checkbox.vue";
import Fill from "@/pages/View/fill.vue";
import TextArea from "@/pages/View/textArea.vue";
import File from "@/pages/View/file.vue";
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { closeLoading, startLoading } from "@/utilities";
import CryptoJS from "crypto-js";
import { useMainStore } from "@/stores";
// 暗黑模式hook
import { useDarkModeSwitch } from "@/utilities/darkModeSwitch";
import verifyAPI from "@/apis/service/User/verifyApi.ts";
import Vote from "@/pages/View/vote.vue";
import getStatistic from "@/apis/service/User/getStatistic.ts";
import { deepSnakeToCamel } from "@/utilities/deepSnakeToCamel.ts";
import { deepCamelToSnake } from "@/utilities/deepCamelToSnake.ts";
import { QuesType } from "@/utilities/constMap.ts";
const { darkModeStatus, switchDarkMode } = useDarkModeSwitch();
const Key = "JingHong";
const formData = ref();
const question = ref();
const showData = ref();
const ans = ref({
  id: -1,
  questionsList: [],
  token: ""
});
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
  id: -1
});
const optionStore = useMainStore().useOptionStore();
const questionnaireStore = useMainStore().useQuetionnaireStore();
const disabledInput = ref(false);
onMounted(async () => {

  loginStore.setShowHeader(false);
  let idParam = route.query.id as string | undefined;
  if (idParam) {
    // 解密 ID
    idParam = idParam.replace(/ /g, "+");
    decryptedId.value = decryptId(idParam) as string | null;
    // console.log(decryptedId.value)
    verifyData.value.id = Number(decryptedId.value);
    if (decryptedId.value === "") {
      ElNotification.error("无效的问卷id");
    }
  }
  getQuestionnaireView();

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
      onBefore() {
        disabledInput.value = true;
        startLoading();
      },
      onSuccess(res) {
        if (res.code === 200) {
          // 更新 token 和 timestamp
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("timestamp", String(Date.now()));
          submit();
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError() {
        ElNotification.error("请求超时, 请稍后重试");
      },
      onFinally() {
        disabledInput.value = false;
        closeLoading();
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
  checkAnswer();
  if (allowSend.value) {
    showModal("QuestionnaireSubmit");
  }
};
const getQuestionnaireView = async () => {
  if (decryptedId.value) {
    startLoading();
    try {
      const res = await getUserAPI({ id: decryptedId.value as number }); // 直接 `await` API 请求
      if (res.code === 200) {
        formData.value = res.data;
        question.value = formData.value.questions;
        submitData.value.id = res.data.id;
        showData.value = deepSnakeToCamel(res.data);

        showData.value.quesConfig.questionList = showData.value.quesConfig.questionList.map(item => ({
          ...item,
          answer: ""
        }));

        // console.log(showData.value);

        if (showData.value.surveyType === QuesType.VOTE) {
          try {
            const statRes = await getStatistic({ id: Number(decryptedId.value) });
            resultData.value = statRes.data.statistics[0].options;
          } catch (e) {
            ElNotification.error(e);
          }
        }

        time.value = showData.value.baseConfig.endTime.replace("T", " ").split("+")[0].split(".")[0];
        startTime.value = showData.value.baseConfig.startTime.replace("T", " ").split("+")[0].split(".")[0];
        ans.value.id = res.data.id;
        loading.value = false;
      } else if (res.code === 200509) {
        isOutDate.value = true;
        ElNotification.error(res.msg);
      } else {
        ElNotification.error(res.msg);
      }
    } catch (e) {
      ElNotification.error("获取失败，请重试" + e);
    } finally {
      closeLoading();
    }
  }
};

const checkAnswer = () => {
  const hasUnansweredRequiredQuestion = showData.value.quesConfig.questionList.some((q) => {
    if (q.quesSetting.required && q.answer === "") {
      ElNotification.error("您有题目未完成作答.");
      return true;
    }
    if (q.quesSetting.questionType === 1 && q.answer === " ") {
      ElNotification.error("您有单选题未完成作答.");
      return true;
    }
    if (q.quesSetting.questionType === 2 && (q.answer.endsWith("┋") || q.answer.startsWith("┋"))) {
      ElNotification.error("您有多选题未完成作答.");
      return true;
    }
    if (q.quesSetting.questionType === 2 && q.answer.split("┋").length > q.quesSetting.maximumOption || q.answer.split("┋").length < q.quesSetting.minimumOption) {
      if (q.answer.split("┋").length > q.quesSetting.maximumOption) {
        ElNotification.error(`该投票最多只能选择${q.quesSetting.maximumOption}个选项`);
      } else if (q.answer.split("┋").length < q.quesSetting.minimumOption) {
        ElNotification.error(`该投票最少需要选择${q.quesSetting.maximumOption}个选项`);
      }
      return true;
    }

    if (q.quesSetting.questionType === 3 && q.answer !== "" && q.quesSetting.reg && !new RegExp(q.quesSetting.reg).test(q.answer)) {
      ElNotification.error(`第${q.serialNum}题的回答不符合要求.`);
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
  ans.value.token = localStorage.getItem("token") ?? "";
  ans.value.questionsList = showData.value.quesConfig.questionList.map((item) => {
    return {
      questionId: item.id,
      answer: item.answer
    };
  });
  console.log(ans.value);
  useRequest(() => setUserSubmitAPI(deepCamelToSnake(ans.value)), {
    onBefore: () => startLoading(),
    async onSuccess(res) {
      if (res.code === 200 && res.msg === "OK") {
        const imageStore = useMainStore().useImageStore();
        ElNotification.success("提交成功");
        questionnaireStore.deleteAnswer(decryptedId.value);
        imageStore.clearFiles();
        optionStore.deleteOption(decryptedId.value);
        if (formData.value.survey_type === 0) {
          await router.push("/Thank");
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