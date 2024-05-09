<template>
<div class="flex justify-center items-start gap-130 h-screen mt-90">
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
    <button class="btn btn-accent " @click="showModal('creatQuestion')">添加题目</button>
    </div>
  </div>
  <div class="bg-gray-200 w-700  p-40 shadow-lg rounded-2xl flex-col justify-center items-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
      <div class="flex items-end justify-center gap-90"><span class="text-4xl">标题: {{ title }}</span><span class="text-xl ">id: {{ id }}</span></div>
    <div class="divider"></div>
    <div class="overflow-y-auto h-600">
      <div v-for="q in question" v-if="question && question.length > 0" >
    <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30" v-if="q.question_type === 1">
        <span class="flex justify-between"><span class="text-xl">{{ q.id }}.{{ q.subject }}</span><span class="flex gap-10 justify-top"><span>选答</span><input type="checkbox" :name=q.id  class="checkbox-sm"/></span></span>
        <div class="flex-col p-20">
          <div v-for="item in q.options" class="flex items-center gap-10"><input  type="radio" :name=item class="radio-sm my-5" /> {{ item.content }}</div>
        </div>
    </div>
        <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30" v-if="q.question_type === 2">
          <span class="flex justify-between"><span class="text-xl">{{ q.id }}.{{ q.subject }}</span><span class="flex gap-10 justify-top"><span>选答</span><input type="checkbox" :name=q.id  class="checkbox-sm"/></span></span>
          <div class="flex-col p-20">
            <div v-for="item in q.options" class="flex items-center gap-10"><input  type="checkbox" :name=item class="checkbox-sm my-5" /> {{ item.content }}</div>
          </div>
        </div>
        <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30" v-if="q.question_type === 3">
          <span class="flex justify-between"><span>{{ q.id }}.{{ q.subject }}</span><span class="flex gap-10 justify-top"><span>选答</span><input type="checkbox" :name=q.id  class="checkbox-sm"/></span></span>
          <div class="flex-col p-20">
            <input type="text" placeholder="Type here" class="input input-bordered w-full shadow-2xl" />
          </div>
        </div>
        <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30" v-if="q.question_type === 4">
          <span class="flex justify-between"><span>{{ q.id }}.{{ q.subject }}</span><span class="flex gap-10 justify-top"><span>选答</span><input type="checkbox" :name=q.id  class="checkbox-sm"/></span></span>
          <div class="flex-col p-20">
            <textarea placeholder="Type here" class="textarea textarea-bordered shadow-2xl w-full h-100" />
          </div>
        </div>
        <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30" v-if="q.question_type === 5">
          <span class="flex justify-between"><span>{{ q.id }}.{{ q.subject }}</span><span class="flex gap-10 justify-top"><span>选答</span><input type="checkbox" :name=q.id  class="checkbox-sm"/></span></span>
          <div class="flex-col p-20">
            <input type="file" class="file-input file-input-bordered w-full max-w-xs shadow-2xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal :modal-id="'creatQuestion'">

  </modal>
</div>

</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {useRequest} from "vue-hooks-plus";
import {getQuestionnaireDetailAPI} from "@/apis";
import {ElNotification} from "element-plus";
import { modal, showModal } from '@/components';

const selectedOption = ref('select')
const selectedNumber = ref(1)
const formData = ref()
const question = ref([])
const title = ref()
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
        formData.value = res.data
        title.value = res.data.title
        question.value = res.data.questions
        console.log(question.value)
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('获取失败，请重试' + e);
    }
  })
}

</script>

<style scoped>

</style>