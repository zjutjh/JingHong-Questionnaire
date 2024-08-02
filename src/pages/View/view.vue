<template>
<div class="fixed inset-0 flex items-center justify-center ">
  <div class="flex-col overflow-auto bg-white w-full sm:w-1/2 lg:w-1/3 p-6 h-full ">
    <div class="flex-col justify-center">
      <div class="flex justify-center">
        <el-image class="w-2/3" src="/jxh_logo.png" />
      </div>
      <el-skeleton :loading="loading" :rows="1" animated style="height: 60px">
        <template #default>
          <div  class="flex flex-col ">
            <div class="divider"></div>
              <div class="flex gap-20 justify-center"><span class="text-3xl break-all px-50">{{ formData.title }}</span></div>
            <div class="items-top my-10 items-start mx-20" v-if="formData.desc !== ''">
              <div class="items-top my-10 items-start ">
                <div class="text-gray-400 flex break-all " >{{ formData.desc }}</div>
              </div>
            </div>
          </div>
          <div class="flex gap-20 items-center my-10  ml-20 mt-20">
            <span class="text-red-400">截止时间:</span>
            <span>{{ time }}</span>
          </div>
          <div class="divider"></div>
        </template>
      </el-skeleton>
    </div>
    <div class="flex flex-col h-650 mt-20">
        <div v-for="(q, index) in question" :key="q.serial_num">
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
        <div class="flex justify-center items-center p-20">
          <button class="btn btn-success w-full" @click="showModal('QuestionnaireSubmit')">提交问卷</button>
        </div>
  </div>
    <modal modal-id="QuestionnaireSubmit">
      <template #title>提交问卷</template>
      <template #default>
        你确认要提交问卷吗?
      </template>
      <template #action>
        <button class="btn btn-success w-full" @click="submit">确认</button>
      </template>
    </modal>
  </div>
</div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, nextTick, reactive, onUnmounted,} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getUserAPI, setUserSubmitAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal, skeleton } from '@/components';
import Radio from "@/pages/View/radio.vue";
import Checkbox from "@/pages/View/checkbox.vue";
import Fill from "@/pages/View/fill.vue";
import TextArea from "@/pages/View/textArea.vue";
import File from "@/pages/View/file.vue";
import radio from "@/pages/View/radio.vue";
import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import {closeLoading, startLoading} from "@/utilities";
import dayjs from "element-plus";
import CryptoJS from 'crypto-js';
import {useMainStore} from "@/stores";

const Key = 'JingHong';
const formData = ref();
const question = ref<any[]>([]);
const title = ref();
const reg = ref<string>('');
const regNum = ref("^[0-9]{1}$");
const time = ref();
const loading = ref(true)
const submitData = ref({
  id: null,
  questions_list: [],
});
const route = useRoute();
const id = ref<Number | null>();
const loginStore = useMainStore().useLoginStore();
// Deep copy function
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

onMounted(() => {
  loginStore.setShowHeader(false)
  const idParam = route.query.id;
  id.value = idParam ? String(idParam) : null;
  console.log(id.value);
  if (id.value) {
    const encryptedId = CryptoJS.AES.encrypt(id.value, Key).toString();
    id.value = encryptedId;
    console.log(id.value); //未启用链接加密时使用
  }
  if (id.value) {
    const decryptedId = CryptoJS.AES.decrypt(id.value, Key).toString(CryptoJS.enc.Utf8);
    id.value = Number(decryptedId);
  }
  getQuestionnaireView()
});

const getQuestionnaireView = () => {
  if(id.value){
    console.log(id.value);
    useRequest(() => getUserAPI({id:id.value as number}),{
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200) {
          console.log(res.data)
          formData.value = res.data;
          question.value = formData.value.questions;
          time.value = formData.value.time.replace("T", " ").split("+")[0].split(".")[0]
          submitData.value.id = res.data.id;
          question.value.forEach((q) => {
            q.answer = '';
          });
          loading.value = false
        } else {
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

const submit = () => {
  const hasUnansweredRequiredQuestion = question.value.some((q) => {
    if (q.required && q.answer === "") {
      ElNotification.error('您有题目未完成作答.')
      return true;
    }
    return false;
  });
  if (hasUnansweredRequiredQuestion) {
    showModal('QuestionnaireSubmit', true);
    return;
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
        ElNotification.success('提交成功');
        router.push('/Thank');
      } else {
        ElNotification.error(res.msg );
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



</script>


<style scoped>


</style><template>
<div class="fixed inset-0 flex items-center justify-center ">
  <div class="flex-col overflow-auto bg-white w-full sm:w-1/2 lg:w-1/3 p-6 max-h-975">
    <div class="flex-col justify-center">
      <div class="flex justify-center">
        <el-image class="w-2/3" src="/jxh_logo.jpg" />
      </div>
      <el-skeleton :loading="loading" :rows="1" animated style="height: 60px">
        <template #default>
          <div  class="flex flex-col items-center">
            <div class="divider"></div>
              <span class="flex gap-20"><span class="text-5xl">问卷标题</span></span>
             <div class="divider"></div>
            <div class="flex items-top gap-20  my-15" >
              <span>问卷内容描述</span>
              <span>{{submitData.desc}}</span>
            </div>
            <div class="flex gap-20 items-center my-15">
              <span >问卷截止时间</span>
              <span>{{ time }}</span>
            </div>
          </div>
        </template>
      </el-skeleton>
    </div>
    <div class="flex flex-col  h-650"> 
        <div v-for="(q, index) in question" :key="q.serial_num">
            <!-- 根据问题类型渲染组件 -->
            <div v-if="q.question_type === 1">
              <el-skeleton animated :loading="loading">
              <radio v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:option-choose="q.required" v-model:other-option="q.other_option" v-model:describe="q.description"></radio>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 2">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <checkbox v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:option-choose="q.required" v-model:other-option="q.other_option" v-model:describe="q.description"></checkbox>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 3">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <fill v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:reg="q.reg" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></fill>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 4">
              <el-skeleton  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <text-area v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></text-area>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 5">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <file v-model:title="q.subject" v-model:serial_num="q.serial_num"  v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></file>
                </template>
              </el-skeleton>
            </div>
        </div>
        <div class="flex justify-center items-center gap-160 mt-20">
          <button class="btn btn-success" @click="showModal('QuestionnaireSubmit')">提交</button>
        </div>
  </div>
    <modal modal-id="QuestionnaireSubmit">
      <template #title>提交</template>
      <template #default>
        该操作会直接发布问卷!请确认问卷无误
      </template>
      <template #action>
        <button class="btn btn-success w-80" @click="submit(submitData.id)">确认</button>
      </template>
    </modal>
  </div>
</div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref,nextTick, reactive,} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getUserAPI, setUserSubmitAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal, skeleton } from '@/components';
import Radio from "@/pages/View/radio.vue";
import Checkbox from "@/pages/View/checkbox.vue";
import Fill from "@/pages/View/fill.vue";
import TextArea from "@/pages/View/textArea.vue";
import File from "@/pages/View/file.vue";
import radio from "@/pages/View/radio.vue";
import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";
import router from "@/router";
import { useRoute } from "vue-router";
import {closeLoading, startLoading} from "@/utilities";
import dayjs from "element-plus";
import CryptoJS from 'crypto-js';

const Key = 'JH';
const formData = ref();
const question = ref<any[]>([]);
const title = ref();
const submitData = ref();
const reg = ref<string>('');
const regNum = ref("^[0-9]{1}$");
const time = ref();
const loading = ref(true)

const route = useRoute();
const id = ref<Number | null>();


// Deep copy function
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

onMounted(() => {
  const idParam = route.query.id;
  id.value = idParam ? String(idParam) : null;
  id.value = decodeURIComponent(route.query.id.replace(/ /g, '+'));
  console.log(id.value);
  if (id.value) {
    const decryptedId = CryptoJS.AES.decrypt(id.value, Key).toString(CryptoJS.enc.Utf8);
    
    id.value = Number(decryptedId);
  }
  getQuestionnaireView()
});

const getQuestionnaireView = () => {
  if(id.value){
    console.log(id.value);
    useRequest(() => getUserAPI({id:id.value as number}),{
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200) {
          console.log(res.data);
          const formDataCopy = deepCopy(res.data); // Use deep copy here
          if (formDataCopy.questions) {
            formDataCopy.questions.forEach((item) => {
              delete item.id;
            });
          }
          formData.value = formDataCopy;
          submitData.value = deepCopy(formData.value); // Deep copy to avoid reference issues
          question.value = submitData.value.questions;
          time.value = submitData.value.time
          loading.value = false
          console.log(time.value);
        } else {
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

const submit = (state:number) => {
  submitData.value.time = time.value
  submitData.value.questions = question.value;
  console.log(question.value);
    submitData.value.status = state;
    useRequest(() => setUserSubmitAPI(submitData.value),{
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200 && res.msg === 'OK') {
          if(state === 1){
            ElNotification.success('成功');
          }else{
            ElNotification.success('成功');
          }
          router.push('/')
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error(e);
      },
      onFinally: () => {
        showModal('QuestionnaireSubmit',true)
        closeLoading()
      }
    });
};


</script>


<style scoped>
</style>