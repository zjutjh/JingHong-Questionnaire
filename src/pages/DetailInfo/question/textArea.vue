<template>
  <div class="bg-base-200 dark:bg-customGray_shallow p-30 hover:shadow-md " :class="isActive? 'bg-base-300' : ''">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serial_num }}</span>
          <input
            v-if="isActive"
            v-model="localTitle"
            type="text"
            placeholder="Question"
            class="rounded-none focus:outline-none dark:bg-customGray_more_shallow input input-bordered shadow-md w-350"
          >
          <div v-else class="w-350">
            {{ localTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider" />
    <textarea placeholder="Type here" class="rounded-none focus:outline-none dark:bg-customGray_more_shallow textarea textarea-bordered shadow-md w-full h-100" />
    <!-- <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error dark:opacity-75 shadow-md dark:text-white" @click="$emit('on-click')">
        删除题目
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";

const props = defineProps<{
  isActive: boolean
  serial_num: number,
  title?: string,
  describe: string,
  optionChoose: boolean
  unique: boolean
}>();
const emits = defineEmits(["update:unique", "on-click", "update:optionChoose", "update:title", "update:describe"]);

const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localDescribe = ref<string>(props.describe || "");
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

watch(localDescribe, (newLocalDescribe) => {
  emits("update:describe", newLocalDescribe);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits("update:optionChoose", newOptionChoose);
});

watch(localUnique, (newUnique) => {
  emits("update:unique", newUnique);
});

</script>

<style scoped>
</style>