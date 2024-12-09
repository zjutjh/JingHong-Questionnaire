<template>
  <div class="fixed inset-0 flex items-center justify-center bg-red-300 text-red-950 dark:text-white dark:bg-black">
    <div class="bg-red-50 dark:bg-customGray flex-col overflow-auto w-full sm:w-1/2 lg:w-6/12 p-30 h-full  shadow-lg">
      <div class="flex-col justify-center relative">
        <div class="flex justify-center">
          <div class="absolute top-0 right-4 z-10">
            <button
              @click="switchDarkMode"
              class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
            >
              <span v-if="!darkModeStatus">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-50 w-50 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h1m-16 0H3m15.364-7.364l-.707.707M6.636 17.364l-.707.707m12.728-12.728l-.707.707M6.636 6.636l-.707-.707M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5z" />
                </svg>
              </span>
              <span v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-60 w-60 text-customGray_more_shallow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 3c0 6.627 0 12 0 12a6 6 0 1 1 0-12z" />
                </svg>
              </span>
            </button>

          </div>


          <el-image class="w-2/3" src="https://img.lonesome.cn/jhwl/project/questionnaire/jxh_logo.webp" />
        </div>
        <el-skeleton :loading="loading" :rows="1" animated style="height: 60px">
          <template #default>
            <div  class="flex flex-col ">
              <div class="divider"></div>
                <div class="flex gap-20 my-10 justify-center"><span class="text-4xl break-all px-50">{{ formData.title }}</span></div>
              <div class="items-top my-10 items-start mx-20" v-if="formData.desc !== ''">
                <div class="items-top my-10 items-start ">
                  <pre class="text-gray-500 flex break-all text-xl dark:text-white dark:opacity-50" >{{ formData.desc }}</pre>
                </div>
              </div>
            </div>
            <div class="flex gap-20 items-center my-10  ml-20 ">
              <span class="text-red-950 dark:text-red-400 dark:opacity-80">截止时间:</span>
              <span>{{ time }}</span>
            </div>
            <div class="flex gap-20 items-center my-10  ml-20 " v-if="formData.daily_limit !== 0">
              <span class=" dark:opacity-80 text-gray-700 dark:text-gray-400" >本问卷每天最多提交 <span class="text-red-950 dark:text-red-400 dark:opacity-80">{{ formData.daily_limit }} </span> 次</span>
            </div>
            <div class="divider my-10"></div>
          </template>
        </el-skeleton>
      </div>
      <div class="flex flex-col h-650 " v-if="formData && formData.survey_type === 0">
          <div v-for="q in question" :key="q.serial_num">
              <!-- 根据问题类型渲染组件 -->
              <div v-if="q.question_type === 1">
                <el-skeleton animated :loading="loading">
                  <radio v-model:answer="q.answer" v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num" v-model:unique="q.unique" v-model:required="q.required" v-model:other-option="q.other_option" v-model:describe="q.describe" v-model:questionnaireID = "decryptedId"></radio>
                </el-skeleton>
              </div>
              <div v-if="q.question_type === 2">
                <el-skeleton animated  :loading="loading">
                  <template #template>
                    <skeleton-card></skeleton-card>
                  </template>
                  <template #default>
                <checkbox v-model:answer="q.answer" v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:required="q.required" v-model:other-option="q.other_option" v-model:describe="q.describe" v-model:questionnaireID = "decryptedId as string" v-model:minimum_option="q.minimum_option" v-model:maximum_option="q.maximum_option"></checkbox>
                  </template>
                </el-skeleton>
              </div>
              <div v-if="q.question_type === 3">
                <el-skeleton animated  :loading="loading">
                  <template #template>
                    <skeleton-card></skeleton-card>
                  </template>
                  <template #default>
                <fill v-model:answer="q.answer" v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:reg="q.reg" v-model:unique="q.unique" v-model:required="q.required" v-model:describe="q.describe"></fill>
                  </template>
                </el-skeleton>
              </div>
              <div v-if="q.question_type === 4">
                <el-skeleton  :loading="loading">
                  <template #template>
                    <skeleton-card></skeleton-card>
                  </template>
                  <template #default>
                <text-area v-model:answer="q.answer"  v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:required="q.required" v-model:describe="q.describe"></text-area>
                  </template>
                </el-skeleton>
              </div>
              <div v-if="q.question_type === 5">
                <el-skeleton animated  :loading="loading">
                  <template #template>
                    <skeleton-card></skeleton-card>
                  </template>
                  <template #default>
                <file v-model:answer="q.answer" v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:required="q.required" v-model:describe="q.describe"></file>
                  </template>
                </el-skeleton>
              </div>
          </div>
          <div class="flex justify-center items-center py-50">
            <button class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="showModal('QuestionnaireSubmit')" v-if="decryptedId !== '' && !isOutDate"  >提交问卷</button>
          </div>
    </div>
      <div class="flex flex-col h-650 " v-if="formData && formData.survey_type === 1">
        <div v-for="(q, index) in question" :key="index">
          <vote
                v-model:answer="q.answer" v-model:title="q.subject"
                v-model:options="q.options"
                v-model:serial_num="q.serial_num"
                v-model:unique="q.unique" v-model:required="q.required"
                v-model:other-option="q.other_option" v-model:describe="q.describe"
                v-model:questionnaireID = "decryptedId"
                v-model:minimum_option="q.minimum_option"
                v-model:maximum_option="q.maximum_option"
                :count="resultData">
            <div>
          </div></vote>
        </div>
        <div class="flex justify-center items-center py-50">
          <button class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="showModal('QuestionnaireSubmit')" v-if="decryptedId !== '' && !isOutDate"  >提交问卷</button>
        </div>
      </div>

      <modal modal-id="QuestionnaireSubmit">
        <template #title><span class="text-red-950 dark:text-red-500 ">提交问卷</span></template>

        <template #default v-if="formData && !formData.verify || tokenOutDate">
          你确认要提交问卷吗?
        </template>
        <template #default v-else>
          <div class="flex-col">
          <div>
          该问卷提交需要统一登录认证
          </div>
          <div class="flex-col my-10">
            <span>学号 &ensp; &ensp;<input class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10 w-2/3" v-model="verifyData.stu_id" /></span><br/>
            <span>密码 &ensp; &ensp;<input class="dark:bg-customGray_more_shallow input input-bordered shadow-md h-35 my-10 w-2/3" v-model="verifyData.password" /></span>
          </div>
          </div>
        </template>
        <template #action>
          <button class="btn bg-red-800 text-red-50 w-full hover:bg-red-600" @click="submit"  v-if="formData && !formData.verify || tokenOutDate">确认</button>
          <button class="btn bg-red-800 text-red-50 w-full hover:bg-red-600" @click="verify" v-else>确认</button>
        </template>
      </modal>

    </div>
  </div>
  </template>

  <script lang="ts" setup>
  import {computed, nextTick, onMounted, ref, watch} from "vue";
  import {useRequest} from "vue-hooks-plus";
  import {getUserAPI, setUserSubmitAPI} from "@/apis";
  import {ElNotification} from "element-plus";
  import {modal, showModal} from '@/components';
  import radio from "@/pages/View/radio.vue";
  import Checkbox from "@/pages/View/checkbox.vue";
  import Fill from "@/pages/View/fill.vue";
  import TextArea from "@/pages/View/textArea.vue";
  import File from "@/pages/View/file.vue";
  import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";
  import router from "@/router";
  import {useRoute} from "vue-router";
  import {closeLoading, startLoading} from "@/utilities";
  import CryptoJS from 'crypto-js';
  import {useMainStore} from "@/stores";
  //暗黑模式hook
  import { useDarkModeSwitch } from "@/utilities/darkModeSwitch";
  import verifyAPI from "@/apis/service/User/verifyApi.ts";
  import Vote from "@/pages/View/vote.vue";
  import getStatistic from "@/apis/service/User/getStatistic.ts";
  const {darkModeStatus,switchDarkMode} = useDarkModeSwitch()
  const Key = 'JingHong';
  const formData = ref();
  const question = ref<any[]>([]);
  const time = ref();
  const loading = ref(true)
  const submitData = ref({
    id: null,
    questions_list: [],
  });
  const resultData = ref(undefined)
  const route = useRoute();
  const loginStore = useMainStore().useLoginStore();
  const decryptedId = ref<string | null>()
  const allowSend = ref(true)
  const isOutDate = ref(false)
  const verifyData = ref( {
    stu_id: "",
    password: "",
    survey_id: -1
  })
  const optionStore = useMainStore().useOptionStore()
  const questionnaireStore = useMainStore().useQuetionnaireStore()
  onMounted(async () => {

    loginStore.setShowHeader(false);
    let idParam = route.query.id as string | undefined;
    if (idParam) {
      // 解密 ID
      idParam = idParam.replace(/ /g, "+");
      decryptedId.value = decryptId(idParam) as string | null;
      // console.log(decryptedId.value)
      verifyData.value.survey_id = Number(decryptedId.value)
      if (decryptedId.value === ""){
        ElNotification.error("无效的问卷id")
      }
    }
    getQuestionnaireView();
    try{
      const res = await getStatistic({id: Number(decryptedId.value)})
      resultData.value = res.data.statistics[0].options
    } catch (e) {
      ElNotification.error(e)
    }
  });

  const tokenOutDate = computed(() => {
    const lastDate = localStorage.getItem('timestamp');
    // 如果没有存储时间戳（首次请求或过期），调用 verifyAPI
    return !(!lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000);
  });

  const verify = () => {
    const lastDate = localStorage.getItem('timestamp');
    // 如果没有存储时间戳（首次请求或过期），调用 verifyAPI
    if (!lastDate || Date.now() - parseInt(lastDate) > 7 * 24 * 60 * 60 * 1000) {
      // 调用 verifyAPI 获取新的 token
      useRequest(() => verifyAPI(verifyData.value), {
        onSuccess(res) {
          if (res.code === 200) {
            // 更新 token 和 timestamp
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('timestamp', String(Date.now()));
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
      ElNotification.error("无效的问卷id")
    }
  };

  const getQuestionnaireView = () => {
    if(decryptedId.value){
      useRequest(() => getUserAPI({id: decryptedId.value as number}),{
        onBefore: () => startLoading(),
        onSuccess(res) {
          if (res.code === 200) {
            formData.value = res.data;
            question.value = formData.value.questions;
            time.value = formData.value.time.replace("T", " ").split("+")[0].split(".")[0]
            submitData.value.id = res.data.id;
            // console.log("问卷id:"+submitData.value.id)
            question.value.forEach(q => {
              //获取已存储的答案
              const storedAnswer = questionnaireStore.searchAnswer(decryptedId.value,q.serial_num)
              if (storedAnswer) {
                  q.answer = storedAnswer.answer;
              }else if (q.question_type===1){
                q.answer = " ";
              }else {
                  q.answer = "";
              }
            })
            loading.value = false
          } else if (res.code === 200509){
            isOutDate.value = true
            ElNotification.error(res.msg);
          }else {
            ElNotification.error(res.msg);
          }
      },
      onError(e) {
        ElNotification.error('获取失败，请重试' + e);
      },
      onFinally:()=>closeLoading()
      });
    }
  }

  const checkAnswer = () =>{
    const hasUnansweredRequiredQuestion = question.value.some((q) => {
      if (q.required && q.answer === "") {
        ElNotification.error('您有题目未完成作答.')
        return true;
      }
      if(q.question_type === 1 && q.answer === " "){
        ElNotification.error('您有单选题未完成作答.')
        return true;
      }
      if (q.question_type === 2 && (q.answer.endsWith('┋') || q.answer.startsWith('┋'))){
        ElNotification.error('您有多选题未完成作答.')
        return true;
      }
      if(q.question_type === 2 && q.answer.split('┋').length > q.maximum_option || q.answer.split('┋').length < q.minimum_option) {
        if(q.answer.split('┋').length > q.maximum_option) {
          ElNotification.error(`该投票最多只能选择${q.maximum_option}个选项`)
        } else if(q.answer.split('┋').length < q.minimum_option) {
          ElNotification.error(`该投票最少需要选择${q.maximum_option}个选项`)
        }
        return true;
      }

      if (q.question_type === 3 && q.answer!== ''  && q.reg && !new RegExp(q.reg).test(q.answer)) {
        ElNotification.error(`第${q.serial_num}题的回答不符合要求.`);
        return true;
      }
    });
    if (hasUnansweredRequiredQuestion) {
      showModal('QuestionnaireSubmit', true);
      allowSend.value = false
      return
    }
    allowSend.value = true
  }

  const submit = () => {
    checkAnswer();
    if(allowSend.value === false) {
      return
    }
    submitData.value.questions_list = question.value.map((q) => ({
      question_id: q.id,
      serial_num: q.serial_num,
      answer: q.answer,
    }));
    submitData.value.token = localStorage.getItem("token")
    useRequest(() => setUserSubmitAPI(submitData.value), {
      onBefore: () => startLoading(),
      async onSuccess(res) {
        if (res.code === 200 && res.msg === 'OK') {
          const imageStore = useMainStore().useImageStore()
          ElNotification.success('提交成功');
          questionnaireStore.deleteAnswer(decryptedId.value)
          imageStore.clearFiles()
          optionStore.deleteOption(decryptedId.value)
          if (formData.value.survey_type === 0) {
            router.push('/Thank');
          } else {
            try{
              const res = await getStatistic({id: Number(decryptedId.value)})
              resultData.value = res.data.statistics[0].options
            } catch (e) {
              ElNotification.error(e)
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
        showModal('QuestionnaireSubmit', true);
        closeLoading();
      },
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