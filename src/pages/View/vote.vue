<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ props.serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center" >{{ props.title }}
            <el-tag type="primary" class="ml-5">投票</el-tag>
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
    <span class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5" v-if="props.minimum_option !== 0">最少选 {{ props.minimum_option }} 个&ensp;</span>
    <span class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5" v-if="props.maximum_option !== 0">最多选 {{ props.maximum_option }} 个</span>
    <div class="flex p-5 h-auto flex-wrap">
      <div v-for="(item, index) in localOptions" :key="item.serial_num" class="flex items-center justify-center my-10 w-1/2">

        <div class="  rounded" style="width: 90%" >
          <div class="border-red-300 border-2 dark:border-0 ">
            <img v-if="item.img" :src="item.img" alt="Preview" style="width: 100%" />
          <span class="flex gap-8 items-center justify-center border-t-2 border-red-300 dark:border-0 bg-red-100 dark:bg-customGray_shallow" style="flex: 0.5">
            <input type="checkbox" :name="props.serial_num" class="my-5" style="zoom: 140%" :value="item.content" v-model="answerArr"/>
            <span v-if="item.content" class="text-sm ">{{ item.content }}</span>
          </span>
          </div>
          <span class="text-sm text-gray-400 flex items-center gap-20 justify-center mt-5" v-if="count !== undefined">
            <span>排名: {{ props.count[index].rank }}</span>
            <span>当前票数: {{ props.count[index].count }}</span>
          </span>
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
  count: any
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
