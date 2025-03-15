<template>
  <div class="rounded mx-5">
    <span v-if="props.minimum_option !== 0" class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5">最少选 {{ props.minimum_option }} 个&ensp;</span>
    <span v-if="props.maximum_option !== 0" class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5">最多选 {{ props.maximum_option }} 个</span>
    <div class="grid grid-cols-2 py-10 h-auto ">
      <div v-for="(item, index) in localOptions" :key="item.serial_num" class="flex items-end justify-center my-10 mx-10">
        <div class="rounded ">
          <div class="flex flex-col border-red-300 border-2 dark:border-0  justify-center bg-red-100 dark:bg-black lg:h-230 lg:w-230 md:h-150 md:w-150 sm:h-120 sm:w-120 h-160 w-160">
            <div class="flex items-center flex-1 ">
              <el-image
                v-if="item.img"
                :src="item.img"
                :preview-src-list="[item.img]"
                alt="Preview"
                style="width: 100%"
              />
            </div>
          </div>
          <label
            class="flex gap-8 items-center justify-center  border-red-300 dark:border-0 dark:bg-customGray_shallow border border-t-0 lg:w-230 md:w-150 sm:w-120 w-160 cursor-pointer"
            :class="{ 'opacity-50 pointer-events-none': answerArr.length >= props.maximum_option && !answerArr.includes(item.content) }"
            style="flex: 0.5"
            @click="handleCheckboxClick(item.content)"
          >
            <input
              v-model="answerArr"
              type="checkbox"
              :name="props.serial_num"
              class="my-5 cursor-pointer"
              style="zoom: 140%"
              :value="item.content"
            >
            <span v-if="item.content" class="text-sm">{{ item.content }}</span>
          </label>

          <span v-if="count !== undefined" class="text-sm text-gray-400 flex items-center gap-10 justify-center mt-5">
            <span>排名: {{ props.count[index].rank }}</span>
            <span>票数: {{ props.count[index].count }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores";
import { ref, watch, defineProps, defineEmits, computed, onMounted } from "vue";
import { ElImage } from "element-plus";

const optionStore = useMainStore().useOptionStore();

const props = defineProps<{
  questionnaireID: string
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

const handleCheckboxClick = (content: string) => {
  const isChecked = answerArr.value.includes(content);
  if (!isChecked && answerArr.value.length >= props.maximum_option) {
    return;
  }
};

const localOptions = ref(props.options ? [...props.options] : []);
const otherAnswer = ref<string>(optionStore.search(props.questionnaireID, props.serial_num));
const answerArr = ref<string[]>(props.answer ? props.answer.split("┋") : []);
// console.log(answerArr)
const emits = defineEmits(["update:answer"]);
const otherAnswerChecked = ref(false);
const otherCheckbox = ref<HTMLInputElement | null>(null);

// console.log(answerArr.value + ' '+ otherAnswer.value)

onMounted(() => {
  if (answerArr.value.includes(otherAnswer.value)) {
    // console.log("111")
    otherAnswerChecked.value = true;
  }
}
);

const deleteOldAnswer = () => {
  const otherIndex = answerArr.value.indexOf(otherAnswer.value);
  if (otherIndex !== -1) {
    answerArr.value.splice(otherIndex, 1);
  }
};

const filteredAnswerArr = computed(() => {
  return answerArr.value.filter(answer => answer !== "");
});

watch(filteredAnswerArr, () => {
  if (otherCheckbox.value && otherCheckbox.value.checked && !answerArr.value.includes(otherAnswer.value)) {
    answerArr.value.push(otherAnswer.value);
  }
  // console.log(filteredAnswerArr.value)
  // console.log(otherAnswerChecked.value)
  const combinedAnswers = filteredAnswerArr.value.join("┋");
  emits("update:answer", combinedAnswers);
});

watch(otherAnswer, (newOtherAnswer, oldOtherAnswer) => {
  if (newOtherAnswer) {
    optionStore.update(props.questionnaireID, props.serial_num, newOtherAnswer);
  }
  if (newOtherAnswer !== oldOtherAnswer && otherCheckbox.value && otherCheckbox.value.checked) {
    const otherIndex = answerArr.value.indexOf(oldOtherAnswer);
    if (otherIndex !== -1) {
      answerArr.value.splice(otherIndex, 1);
    }
    answerArr.value.push(newOtherAnswer);
  }
});

watch(otherAnswerChecked, () => {
  if (otherAnswerChecked.value) {
    if (!answerArr.value.includes(otherAnswer.value)) {
      answerArr.value.push(otherAnswer.value);
    }
  }
  if (!otherAnswerChecked.value) {
    if (answerArr.value.includes(otherAnswer.value)) {
      deleteOldAnswer();
    }
  }
});
</script>

<style scoped>
</style>
