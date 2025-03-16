<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ props.serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center">{{ props.title }}
            <el-tag type="primary" class="ml-5">多选</el-tag>
            <el-tag v-if="!required" type="warning">选答</el-tag>
            <el-tag v-if="localUnique" type="danger">唯一</el-tag>
          </span>
        </div>
        <div class="flex items-center mt-15 ml-10">
          <pre class="text-sm text-gray-500 break-all">{{ props.describe }}</pre>
        </div>
      </div>
      <div class="flex-col justify-center items-center" />
    </div>
    <div class="divider my-5" />
    <div class="flex-col p-5 h-auto">
      <span v-if="props.minimum_option !== 0" class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5">最少选 {{ props.minimum_option }} 个&ensp;</span>
      <span v-if="props.maximum_option !== 0" class="dark:opacity-80 text-gray-700 dark:text-gray-400 text-sm my-5">最多选 {{ props.maximum_option }} 个</span>
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <el-checkbox
          v-model="answerArr"
          :name="props.serial_num"
          class="my-5"
          style="zoom: 110%; width: 100%"
          :value="item.content"
          :label="item.content"
          :disabled="isOptionDisabled && !answerArr.includes(item.content)"
        />
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img
              v-if="item.img"
              :src="item.img"
              alt="Preview"
              style="max-width: 150px; max-height: 150px;"
            >
          </div>
        </div>
      </div>
      <div v-if="localOtherOption" class="flex gap-10 items-center">
        <el-checkbox
          ref="otherCheckbox"
          v-model="otherAnswerChecked"
          :name="props.serial_num"
          class="my-5"
          style="zoom: 110%"
          :value="otherAnswer"
        />
        <input
          v-model="otherAnswer"
          type="text"
          class="input-sm w-150 border border-gray-300"
          placeholder="其他"
          @input="updateOtherAnswer"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores";
import { ref, watch, defineProps, defineEmits, computed, onMounted } from "vue";

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

// console.log(otherAnswerChecked.value)
const deleteOldAnswer = () => {
  const otherIndex = answerArr.value.indexOf(otherAnswer.value);
  if (otherIndex !== -1) {
    answerArr.value.splice(otherIndex, 1);
  }
};

const updateOtherAnswer = (event: Event) => {
  if (otherCheckbox.value && otherCheckbox.value.checked) {
    const value = (event.target as HTMLInputElement).value;
    deleteOldAnswer();
    otherAnswer.value = value;
    answerArr.value.push(otherAnswer.value);
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
const totalSelectedCount = computed(() => {
  return answerArr.value.length;
});

const isOptionDisabled = computed(() => {
  return props.maximum_option !== 0 && totalSelectedCount.value >= props.maximum_option;
});
</script>

<style scoped>

</style>
