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
            <div class="flex gap-20 items-center my-10  ml-20 mt-20">
              <span class="text-red-950 dark:text-red-400 dark:opacity-80">截止时间:</span>
              <span>{{ time }}</span>
            </div>
            <div class="divider my-10"></div>
          </template>
        </el-skeleton>
      </div>
      <div class="flex flex-col h-650 ">
          <div v-for="q in question" :key="q.serial_num">
              <!-- 根据问题类型渲染组件 -->
              <div v-if="q.question_type === 1">
                <el-skeleton animated :loading="loading">
                  <radio v-model:answer="q.answer" v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num" v-model:unique="q.unique" v-model:required="q.required" v-model:other-option="q.other_option" v-model:describe="q.describe"></radio>
                </el-skeleton>
              </div>
              <div v-if="q.question_type === 2">
                <el-skeleton animated  :loading="loading">
                  <template #template>
                    <skeleton-card></skeleton-card>
                  </template>
                  <template #default>
                <checkbox v-model:answer="q.answer" v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:required="q.required" v-model:other-option="q.other_option" v-model:describe="q.describe"></checkbox>
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
            <button class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75" @click="showModal('QuestionnaireSubmit')" v-if="decryptedId !== '' && !isOutDate"  >提交问卷</button>
          </div>
    </div>
      <modal modal-id="QuestionnaireSubmit">
        <template #title><span class="text-red-950 dark:text-red-500">提交问卷</span></template>
        <template #default>
          你确认要提交问卷吗?
        </template>
        <template #action>
          <button class="btn bg-red-800 text-red-50 w-full" @click="submit">确认</button>
        </template>
      </modal>
    </div>
  </div>
  </template>

  <script lang="ts" setup>
  import {onMounted, ref, watch } from "vue";
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

  const Key = 'JingHong';
  const formData = ref();
  const question = ref<any[]>([]);
  const time = ref();
  const loading = ref(true)
  const submitData = ref({
    id: null,
    questions_list: [],
  });
  const route = useRoute();
  const loginStore = useMainStore().useLoginStore();
  const decryptedId = ref<string | null>()
  const allowSend = ref(true)
  const isOutDate = ref(false)

  const questionnaireStore = useMainStore().useQuetionnaireStore(); 

  onMounted(() => {
    loginStore.setShowHeader(false);
    let idParam = route.query.id as string | undefined;
    if (idParam) {
      // 解密 ID
      idParam = idParam.replace(/ /g, "+");
      decryptedId.value = decryptId(idParam) as string | null;
      // console.log(decryptedId.value)
      if (decryptedId.value === ""){
        ElNotification.error("无效的问卷id")
      }
    }
    getQuestionnaireView();
  });

  watch(question, (newQuestions) => {
      newQuestions.forEach(q => {
          if (q.answer) {
              questionnaireStore.updateAnswer(q.id, q.serial_num, q.answer);
              // console.log(questionnaireStore.userAnswer)
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
            //获取已存储的答案
            question.value.forEach(q => {
              const storedAnswer = questionnaireStore.searchAnswer(q.id,q.serial_num)
              console.log("222")
              if (storedAnswer) {
                  console.log("111")
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
    useRequest(() => setUserSubmitAPI(submitData.value), {
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200 && res.msg === 'OK') {
          const imageStore = useMainStore().useImageStore()
          ElNotification.success('提交成功');
          questionnaireStore.deleteAnswer()
          imageStore.clearFiles()
          router.push('/Thank');
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error( e.message);
      },
      onFinally: () => {
        showModal('QuestionnaireSubmit', true);
        closeLoading();
      },
    });
  };

  //暗黑模式hook
  import { useDarkModeSwitch } from "@/utilities/darkModeSwitch";
  const {darkModeStatus,switchDarkMode} = useDarkModeSwitch()

  

  </script>


  <style scoped>
  pre {
    white-space: pre-wrap; /* css-3 */
    word-wrap: break-word; /* InternetExplorer5.5+ */
    white-space: -moz-pre-wrap; /* Mozilla,since1999 */
    white-space: -o-pre-wrap; /* Opera7 */
  }

  </style>