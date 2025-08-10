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
    <div class="flex-col px-5 h-auto">
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center h-40 ">
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
      <div v-if="localOtherOption" class="flex gap-10 mt-10">
        <input
          v-model="localAnswer"
          type="radio"
          :name="props.serial_num"
          class="my-5"
          style="zoom: 140%"
          :value="otherAnswer"
        >
        <input
          v-model="otherAnswer"
          type="text"
          class="input-sm w-150"
          placeholder="其他"
          @keyup="localAnswer = otherAnswer "
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMainStore } from "@/stores";
import { ref, watch, defineProps, defineEmits } from "vue";

const optionStore = useMainStore().useOptionStore();

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
const otherAnswer = ref<string>(optionStore.search(props.questionnaireID, props.serial_num));
const emits = defineEmits(["update:answer"]);
const localAnswer = ref(props.answer);

watch([localAnswer, otherAnswer], ([newLocalAnswer, newOtherAnswer]) => {
  if (newOtherAnswer) {
    optionStore.update(props.questionnaireID, props.serial_num, newOtherAnswer);
  }
  if (localOtherOption.value && newLocalAnswer === newOtherAnswer) {
    emits("update:answer", newOtherAnswer);
  } else {
    emits("update:answer", newLocalAnswer);
  }
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
