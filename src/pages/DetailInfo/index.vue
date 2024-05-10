<template>
<div class="flex justify-center items-start gap-130 h-screen ">
  <div class="bg-gray-200 p-30 rounded-2xl shadow-lg w-220 hover:-translate-y-2 hover:shadow-2xl  transition transform duration-700">
<div class="text-2xl">添加问卷题目</div>
    <div class="p-20">
    <div class="flex-col justify-center items-center ">
    <div class="flex gap-10 my-5">
    <input type="radio" name="radio-1"  class="radio-sm" value="oneSelect" v-model="selectedOption" checked/>
      <span>单选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1"  class="radio-sm" value="select" v-model="selectedOption"/>
      <span>多选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1" class="radio-sm" value="fill" v-model="selectedOption"/>
      <span>填空</span>
    </div>
    </div>
      <div v-show="selectedOption === 'fill'">
      <div class="divider"></div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'" />
        <span>手机号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>邮箱</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>学号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>
          <el-select
              v-model="selectedNumber"
              placeholder="Select"
              size="small"
              style="width: 50px"
          >
      <el-option
          v-for="item in 15"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
          位数</span>
      </div>
    </div>
    </div>
    <div class="flex justify-center items-center ">
    <button class="btn btn-accent " @click="addQuestion">添加题目</button>
    </div>
  </div>
  <div class="bg-gray-200 w-700  p-40 shadow-lg rounded-2xl flex-col justify-center items-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
      <div class="flex items-end justify-center gap-90"><span class="text-4xl">标题: {{ title }}</span><span class="text-xl ">id: {{ id }}</span></div>
    <div class="divider"></div>
    <div class="overflow-y-auto h-600" >
      <div  v-for="q in question" v-if="question && question.length > 0"  >
    <div v-if="q.question_type === 1">
        <radio :title="q.subject" :options="q.options" :serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)">
        </radio>
    </div>
        <div v-if="q.question_type === 2">
          <checkbox :title="q.subject" :options="q.options" :serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)">
          </checkbox>
        </div>
        <div v-if="q.question_type === 3">
          <fill :title="q.subject"  :serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)">
          </fill>
        </div>
        <div v-if="q.question_type === 4">
          <text-area :title="q.subject"  :serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)">
          </text-area>
        </div>
        <div v-if="q.question_type === 5">
          <file :title="q.subject"  :serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)">
          </file>
        </div>
      </div>
    </div>
  </div>
</div>

</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRequest} from "vue-hooks-plus";
import {getQuestionnaireDetailAPI} from "@/apis";
import {ElNotification} from "element-plus";
import { modal, showModal } from '@/components';
import Radio from "@/pages/DetailInfo/radio.vue";
import Checkbox from "@/pages/DetailInfo/checkbox.vue";
import Fill from "@/pages/DetailInfo/fill.vue";
import TextArea from "@/pages/DetailInfo/textArea.vue";
import File from "@/pages/DetailInfo/file.vue";

const selectedOption = ref('select')
const selectedNumber = ref(1)
const formData = ref()
const question = ref([])
const title = ref()
const submitData = ref()
const id = ref<number>(3)
onMounted(() => {
  getInfo()
})
const getInfo = () => {
  useRequest(() => getQuestionnaireDetailAPI({
    id:id.value
  }),{
    onSuccess(res){
      if(res.code === 200) {
        console.log(res.data)
        const formDataCopy = { ...res.data };
        if (formDataCopy.questions) {
          formDataCopy.questions.forEach(item => {
            delete item.id;
          });
        }
        formData.value = formDataCopy;
        submitData.value = formData.value
        title.value = res.data.title
        question.value = submitData.value.questions
        console.log(submitData.value.questions)
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('获取失败，请重试' + e);
    }
  })
}

const addQuestion = () => {
  console.log(1)
  question.value.push({
    description: '',
    img: '',
    options: [],
    other_option: '',
    question_type: 1,
    reg: '',
    required: false,
    serial_num: question.value.length + 1,
    subject: '',
    time: '',
    unique: false
  })
}

const deleteQuestion = (serial_num:number) => {
  console.log(serial_num)
  question.value = question.value.filter(item => item.serial_num !== serial_num)
  question.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
    }
  });
}

</script>

<style scoped>

</style>