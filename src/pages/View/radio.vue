<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ props.serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center">{{ props.title }} <el-tag type="primary" class="ml-5">单选</el-tag> <el-tag v-if="!required" type="warning">选答</el-tag> <el-tag v-if="localUnique" type="danger">唯一</el-tag></span>
        </div>
        <div class="flex items-center mt-15 ml-10">
          <pre class="text-sm text-gray-500 break-all">{{ props.describe }}</pre>
        </div>
      </div>
      <div class="flex-col justify-center items-center" />
    </div>
    <div class="divider my-5" />
    <div class="flex-col p-5 h-auto">
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <el-radio
          v-model="localAnswer"
          :name="props.serial_num"
          :value="item.content"
          :label="item.content"
          style="zoom: 110% ; width: 100%"
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
      <div v-if="localOtherOption" class="flex gap-10 items-center my-5">
        <el-radio
          v-model="localAnswer"
          :name="props.serial_num"
          :value="OTHER_OPTION_VALUE"
          :label="OTHER_OPTION_VALUE"
          class="my-5 shrink-0 !mr-0"
          style="zoom: 110%"
        >
          <span class="sr-only">其他</span>
        </el-radio>
        <input
          v-model="otherAnswer"
          type="text"
          class="input-sm w-150 border border-gray-300"
          placeholder="其他"
          @focus="selectOtherOption"
          @input="selectOtherOption"
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores";
import { computed, ref, watch, defineProps, defineEmits } from "vue";

const optionStore = useMainStore().useOptionStore();
const OTHER_OPTION_VALUE = "__other_option__";

const props = defineProps<{
  questionnaireID: string,
  serial_num: number,
  title?: string,
  required: boolean,
  unique: boolean,
  otherOption: boolean,
  describe: string,
  answer: string,
  options?: {
    content: string;
    img: string;
    serial_num: number;
  }[]
}>();

const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : []);
const emits = defineEmits(["update:answer"]);

const isPresetOption = (answer: string) => {
  return localOptions.value.some(option => option.content === answer);
};

const getInitialOtherAnswer = () => {
  const storedAnswer = optionStore.search(props.questionnaireID, props.serial_num);
  if (storedAnswer) {
    return storedAnswer;
  }
  if (localOtherOption.value && props.answer && !isPresetOption(props.answer)) {
    return props.answer;
  }
  return "";
};

const otherAnswer = ref<string>(getInitialOtherAnswer());
const localAnswer = ref(
  localOtherOption.value && props.answer && !isPresetOption(props.answer)
    ? OTHER_OPTION_VALUE
    : props.answer
);
const isOtherSelected = computed(() => localAnswer.value === OTHER_OPTION_VALUE);

const selectOtherOption = () => {
  localAnswer.value = OTHER_OPTION_VALUE;
};

watch(otherAnswer, (newOtherAnswer) => {
  optionStore.update(props.questionnaireID, props.serial_num, newOtherAnswer);
  if (isOtherSelected.value) {
    emits("update:answer", newOtherAnswer);
  }
});

watch(localAnswer, (newLocalAnswer) => {
  emits("update:answer", newLocalAnswer === OTHER_OPTION_VALUE ? otherAnswer.value : newLocalAnswer);
});

</script>

<style scoped>
pre {
  white-space: pre-wrap; /* css-3 */
  word-wrap: break-word; /* InternetExplorer5.5+ */
  white-space: -moz-pre-wrap; /* Mozilla,since1999 */
  white-space: -o-pre-wrap; /* Opera7 */
}
</style>
