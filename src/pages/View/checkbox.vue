<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ props.serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center" >{{ props.title }}
            <el-tag type="primary" class="ml-5">多选</el-tag>
            <el-tag type="warning" v-if="!required">选答</el-tag>
            <el-tag type="danger" v-if="localUnique">唯一</el-tag>
          </span>
        </div>
        <div class="flex items-center mt-15 ml-10">
          <pre  class="text-sm text-gray-500 break-all">{{ props.describe }}</pre>
        </div>
      </div>
      <div class="flex-col justify-center items-center">
      </div>
    </div>
    <div class="divider my-5"></div>
    <div :class="localOptions[0].img ? 'grid grid-cols-2' : 'flex-col p-5 h-auto'">
      <span class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5" v-if="props.minimum_option !== 0">最少选 {{ props.minimum_option }} 个&ensp;</span><span class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5" v-if="props.maximum_option !== 0">最多选 {{ props.maximum_option }} 个</span>
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5 justify-center cursor-pointer">
        <!-- 无图片选项 -->
        <div v-if="!item.img">
          <input type="checkbox" :name="props.serial_num" class="my-5" style="zoom: 140%" :value="item.content"/>
          <span v-if="item.content" class="text-sm ">{{ item.content }}</span>
        </div>
        <!-- 图片选项 -->
        <div v-else class="m-10 p-0 rounded-2xl overflow-hidden w-200 relative" style="max-height: 300px;" @click="clickImgDiv(props.serial_num,item.content)">
          <img v-if="item.img" :src="item.img" alt="Preview" width="200px" draggable="false"/>
          <div class="bg-red-100 p-5 text-center w-full absolute bottom-0 opacity-80" :id="props.serial_num+item.content+'bg'">
            <input type="checkbox" :name="props.serial_num" class="my-5 pointer-events-none" style="zoom: 140%"  :value="item.content" v-model="answerArr" :id="props.serial_num+item.content"/>
            <span v-if="item.content" class="inline-block text-sm ml-5 align-bottom mb-6">{{ item.content }}</span>
          </div>
        </div>
      </div>
      <div class="flex gap-10 mt-10" v-if="localOtherOption">
        <input ref="otherCheckbox" type="checkbox" :name="props.serial_num" class="my-5" style="zoom: 140%" :value="otherAnswer" v-model="otherAnswerChecked"/>
        <input type="text" class="input-sm w-150" placeholder="其他" v-model="otherAnswer" @input="updateOtherAnswer"  />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from '@/stores';
import { ref, watch, defineProps, defineEmits, computed, onMounted } from 'vue'

const optionStore = useMainStore().useOptionStore()


const props = defineProps<{
  questionnaireID:string
  serial_num: number,
  title?: string,
  required: boolean,
  unique: boolean,
  otherOption: boolean,
  describe: string,
  answer: string,
  maximum_option: number,
  minimum_option: number,
  options?: {
    content: string;
    img: string;
    serial_num: number;
  }[]
}>();

const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : []);
const otherAnswer = ref<string>(optionStore.search(props.questionnaireID,props.serial_num));
const answerArr = ref<string[]>(props.answer ? props.answer.split('┋') : []);
// console.log(answerArr)
const emits = defineEmits(['update:answer']);
const otherAnswerChecked = ref(false)
const otherCheckbox = ref<HTMLInputElement | null>(null);

// console.log(answerArr.value + ' '+ otherAnswer.value)

onMounted(() => {
    if(answerArr.value.includes(otherAnswer.value)){
      // console.log("111")
      otherAnswerChecked.value = true
    }
  }
)

const clickImgDiv = (serial_num:number, content:string) => {
  const inputElement = document.getElementById(serial_num+content);
  if (inputElement) {
    inputElement.click();
  }
  const bgElement = document.getElementById(serial_num+content+'bg');
  let className = bgElement.className.split(' ');
  let newClassName = "";
  const isChoosen = answerArr.value.includes(content);
  for(let i=0; i<className?.length; i++) {
    if(className[i] == 'bg-red-100' && isChoosen) className[i] = 'bg-red-400';
    if(className[i] == 'bg-red-400' && !isChoosen) className[i] = 'bg-red-100';
    newClassName += className[i] + ' ';
  }
  bgElement.className = newClassName;
}

// console.log(otherAnswerChecked.value)
const deleteOldAnswer = () => {
  const otherIndex = answerArr.value.indexOf(otherAnswer.value);
  if (otherIndex !== -1) {
    answerArr.value.splice(otherIndex, 1);
  }
}

const updateOtherAnswer = (event: Event) => {
  if (otherCheckbox.value && otherCheckbox.value.checked) {
    const value = (event.target as HTMLInputElement).value;
    deleteOldAnswer();
    otherAnswer.value = value;
    answerArr.value.push(otherAnswer.value);
  }
};

const filteredAnswerArr = computed(() => {
  return answerArr.value.filter(answer => answer !== '');
})

watch(filteredAnswerArr, () => {
  if (otherCheckbox.value && otherCheckbox.value.checked && !answerArr.value.includes(otherAnswer.value)) {
    answerArr.value.push(otherAnswer.value)
  }
  // console.log(filteredAnswerArr.value)
  // console.log(otherAnswerChecked.value)
  const combinedAnswers = filteredAnswerArr.value.join('┋');
  emits('update:answer', combinedAnswers);
});


watch(otherAnswer, (newOtherAnswer, oldOtherAnswer) => {
  if(newOtherAnswer){
    optionStore.update(props.questionnaireID,props.serial_num,newOtherAnswer)
  }
  if (newOtherAnswer !== oldOtherAnswer && otherCheckbox.value && otherCheckbox.value.checked) {
    const otherIndex = answerArr.value.indexOf(oldOtherAnswer);
    if (otherIndex !== -1) {
      answerArr.value.splice(otherIndex, 1);
    }
    answerArr.value.push(newOtherAnswer);
  }
})

watch(otherAnswerChecked,() => {
  if(otherAnswerChecked.value) {
    if (!answerArr.value.includes(otherAnswer.value)) {
      answerArr.value.push(otherAnswer.value);
    }
  }
  if (!otherAnswerChecked.value) {
    if (answerArr.value.includes(otherAnswer.value)) {
      deleteOldAnswer()
    }
  }
})
</script>

<style scoped>
</style>
