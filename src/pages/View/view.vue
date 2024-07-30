<template>
<div class="fixed inset-0 flex items-center justify-center ">
  <div class="flex-col overflow-auto bg-white w-full sm:w-1/2 lg:w-1/3 p-6">
    <div class="flex-col justify-center">
      <div class="flex justify-center">
        <el-image class="w-2/3" src="/JH_logo.svg" />
      </div>
      <el-skeleton :loading="loading" :rows="1" animated style="height: 60px">
        <template #default>
          <div  class="flex flex-col items-center">
            <div class="divider"></div>
              <span class="flex gap-20"><span class="text-4xl">问卷标题</span></span>
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
          <button class="btn btn-success" @click="showModal('QuestionnaireSubmit')">保存更改</button>
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

const selectedOption = ref(1);
const selectedNumber = ref(1);
const formData = ref();
const question = ref<any[]>([]);
const title = ref();
const submitData = ref();
const reg = ref<string>('');
const regNum = ref("^[0-9]{1}$");
const time = ref();
const loading = ref(true)
const setting = reactive({
  isUnique: false,
  isOtherOptions: false,
  isRequired: false
})

const route = useRoute();
const id = ref<number | null>();


// Deep copy function
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

onMounted(() => {
  const idParam = route.query.id;
  id.value = idParam ? Number(idParam) : null;
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
  if(isNew === 'false') {
    useRequest(() => setUserSubmitAPI(submitData.value), {
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200 && res.msg === 'OK') {
          ElNotification.success('保存成功');
          router.push('/')
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error(e);
      },
      onFinally: () => {
        showModal('SaveQuestionnaireSubmit',true)
        closeLoading()
      }
    });
  }else{
    submitData.value.status = state;
    useRequest(() => (submitData.value),{
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200 && res.msg === 'OK') {
          if(state === 1){
            ElNotification.success('创建并保存为草稿成功');
          }else{
            ElNotification.success('创建并发布成功');
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
        showModal('SaveQuestionnaireSubmit',true)
        closeLoading()
      }
    });
  }
};


</script>


<style scoped>
</style>