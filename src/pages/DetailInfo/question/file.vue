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
      </div>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
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
    <div class="flex-col p-5 overflow-y-auto h-160">
      <el-upload action="#" list-type="picture-card" :auto-upload="false">
        <el-icon><Plus /></el-icon>
      </el-upload>
    </div>
    <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error  opacity-75 shadow-md dark:text-white" @click="$emit('on-click')">
        删除题目
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";

const props = defineProps<{
  serial_num: number,
  title?: string,
  optionChoose: boolean
  describe: string,
  unique: boolean
}>();
const emits = defineEmits(["update:unique", "on-click", "update:optionChoose", "update:title", "update:describe"]);

const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localDescribe = ref<string>(props.describe || "");
const localUnique = ref<boolean>(props.unique);

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

</script>

<style scoped>
</style>