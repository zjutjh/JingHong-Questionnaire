<template>
  <div class="bg-gray-50 p-30  my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">

          <span>{{ serial_num }}</span>
          <span>{{ localTitle }}</span>
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-80">问题描述  | </span>
          <span v-if="localDescribe" class="w-150">{{ localDescribe }}</span>
          <span v-if="!localDescribe" class="w-150">此问卷没有描述</span>
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
    <textarea placeholder="Type here" class="textarea textarea-bordered shadow-md w-full h-100" />
    <div class="divider"></div>
  </div>
</template>

<script setup lang="ts">
import {defineEmits, ref, watch} from "vue";

const props = defineProps<{
  serial_num: number,
  title?: string,
  describe: string,
  optionChoose:boolean
  unique:boolean
}>()
const emits = defineEmits(['update:unique', 'on-click', 'update:optionChoose','update:title','update:describe']);

const localTitle = ref<string>(props.title || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localDescribe = ref<string>(props.describe || '');
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
watch(localUnique, (newUnique) => {
  emits('update:unique', newUnique);
});


</script>


<style scoped>

</style>