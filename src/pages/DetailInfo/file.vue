<template>
  <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serial_num }}</span>
          <input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" v-model="localTitle"/>
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-50">问题描述</span>
          <textarea type="text" placeholder="Describe" class="textarea textarea-bordered shadow-md w-full h-70" v-model="localDescribe"/>
        </div>
      </div>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>选答</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="localOptionChoose"/>
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="localUnique"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 overflow-y-auto h-60">
      <input type="file" class="file-input file-input-bordered w-full max-w-xs shadow-md" />
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error shadow-md" @click="$emit('on-click')">删除题目</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {defineEmits, ref, watch} from "vue";
import {modal, showModal} from "@/components";
import {b} from "vite/dist/node/types.d-aGj9QkWt";

const props = defineProps<{
  serial_num: number,
  title?: string,
  optionChoose:boolean
  describe: string,
  unique:boolean
}>()
const emits = defineEmits(['update:unique', 'on-click', 'update:optionChoose','update:title','update:describe']);

const localTitle = ref<string>(props.title || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localDescribe = ref<string>(props.describe || '');
const localUnique = ref<boolean>(props.unique);

watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || '';
});

watch(() => props.optionChoose, (newOptionChoose) => {
  localOptionChoose.value = newOptionChoose;
});

watch(() => props.unique, (newUnique) => {
  localUnique.value = newUnique;
});

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe
});

watch(localTitle, (newTitle) => {
  emits('update:title', newTitle);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits('update:optionChoose', newOptionChoose);
});

watch(localDescribe, (newLocalDescribe) => {
  emits('update:describe', newLocalDescribe);
});

watch(localUnique, (newUnique) => {
  emits('update:unique', newUnique);
});
</script>


<style scoped>

</style>