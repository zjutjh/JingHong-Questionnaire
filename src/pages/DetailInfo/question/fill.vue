<template>
  <div class="bg-base-300 dark:bg-customGray_shallow p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serial_num }}</span>
          <input
            v-model="localTitle"
            type="text"
            placeholder="Question"
            class="dark:bg-customGray_more_shallow input input-bordered shadow-md w-350"
          >
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-50">问题描述</span>
          <textarea
            v-model="localDescribe"
            type="text"
            placeholder="Describe"
            class="dark:bg-customGray_more_shallow textarea textarea-bordered shadow-md w-full h-70"
          />
        </div>
        <div v-if=" pal === '自定义' " class="flex items-center gap-20 my-10">
          <span class="w-50">正则</span>
          <textarea
            v-model="customiseReg"
            type="text"
            placeholder="示例: ^(?:\+?\d{1,3}[- ]?)?\d{10}$ 国际电话格式"
            class="dark:bg-customGray_more_shallow textarea textarea-bordered shadow-md w-full h-70"
          />
          <!-- <span></span><a href="https://regexr.com" target="_blank">测试</a> -->
        </div>
      </div>
      <div class="flex-col justify-center items-center">
        <div class=" flex gap-10 ">
          <span>必答</span><input
            v-model="localOptionChoose"
            type="checkbox"
            :name="-1"
            class="checkbox-sm"
          >
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input
            v-model="localUnique"
            type="checkbox"
            :name="-1"
            class="checkbox-sm"
          >
        </div>
      </div>
    </div>
    <div class="divider" />
    <div class="flex-col p-5 overflow-y-auto h-60">
      <input class="dark:bg-customGray_more_shallow input input-bordered shadow-md w-full" :placeholder="pal">
    </div>
    <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error dark:opacity-75 shadow-md dark:text-white" @click="$emit('on-click')">
        删除题目
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from "vue";

const props = defineProps<{
  serial_num: number,
  title?: string,
  reg?: string
  describe: string,
  optionChoose: boolean
  unique: boolean
}>();
const emits = defineEmits(["update:unique", "on-click", "update:optionChoose", "update:title", "update:describe", "update:reg"]);
const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localDescribe = ref<string>(props.describe || "");

// 储存当前的自定义正则
const customiseReg = ref(props.reg || "");

watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || "";
});

watch(() => props.optionChoose, (newOptionChoose) => {
  localOptionChoose.value = newOptionChoose;
});

watch(() => props.unique, (newUnique) => {
  localUnique.value = newUnique;
});

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe;
});

watch(() => props.reg, (newReg) => {
  customiseReg.value = newReg;
});

watch(customiseReg, (newReg) => {
  emits("update:reg", newReg);
});

watch(localTitle, (newTitle) => {
  emits("update:title", newTitle);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits("update:optionChoose", newOptionChoose);
});

watch(localDescribe, (newLocalDescribe) => {
  emits("update:describe", newLocalDescribe);
});

watch(localUnique, (newUnique) => {
  emits("update:unique", newUnique);
});

const pal = computed(() => {
  if (props.reg === "^1[3456789]\\d{9}$") return "电话";
  else if (props.reg === "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") return "邮箱";
  else if (props.reg === "^\\d{12}$") return "学号";
  else if (props.reg === "^.*$") return "无限制";
  else if (props.reg === "^[0-9]{1}$") {
    const num = props.reg[7];
    return num + "位数";
  } else {
    return "自定义";
  }
});

</script>

<style scoped>
</style>