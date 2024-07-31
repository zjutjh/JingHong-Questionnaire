<template>
  <div class="bg-gray-50 p-30  my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="text-2xl">{{ serial_num }}</span>
          <span class="text-xl" >{{ localTitle }}</span>
        </div>
        <div class="flex items-center gap-20 my-15">
          <span class="text-lg">问题描述</span>
          <span v-if="localDescribe" class="text-lg">{{ localDescribe }}</span>
          <span v-if="!localDescribe" class="text-lg">此问卷没有描述</span>
        </div>
      </div>
      <div class="flex-col justify-center items-center ">
        <div class="flex gap-10">
          <span>必答</span>
          <input type="checkbox" class="checkbox-sm" :disabled="true" v-model="localOptionChoose"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 h-auto mt-10">
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <input type="radio" :name="props.serial_num" class="radio-sm my-5" />
        <span v-if="item.content">{{ item.content }}</span>
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img v-if="item.img" :src="item.img" alt="Preview" style="max-width: 150px; max-height: 150px;" />
          </div>
        </div>
      </div>
      <div class="flex gap-10">
      <span>其他</span>
      <input v-if="!localOtherOption" type="text" class="input input-bordered h-40 shadow-md"  placeholder="option" v-model="localOtherOption" />
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, toRaw, nextTick } from 'vue';
import { useRequest } from "vue-hooks-plus";
import { saveImgAPI } from "@/apis";
import {ElNotification} from "element-plus";

const props = defineProps<{
  serial_num: number,
  title?: string,
  optionChoose: boolean,
  unique: boolean,
  otherOption: boolean,
  describe: string,
  options?: {
    content: string;
    img: string;
    serial_num: number;
  }[]
}>();

const emits = defineEmits(['update:unique', 'on-click', 'update:otherOption', 'update:optionChoose','update:title','update:options','update:describe']);

const scrollContainer = ref<HTMLDivElement>();
const localTitle = ref<string>(props.title || '');
const localDescribe = ref<string>(props.describe || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : []);


// Watchers to sync local state with props
watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || '';
});

watch(() => props.optionChoose, (newOptionChoose) => {
  localOptionChoose.value = newOptionChoose;
});

watch(() => props.unique, (newUnique) => {
  localUnique.value = newUnique;
});

watch(() => props.otherOption, (newOtherOption) => {
  localOtherOption.value = newOtherOption;
});

watch(() => props.options, (newOptions) => {
  localOptions.value = newOptions ? newOptions : [];
});

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe;
});

// Emit updates to parent component

watch(localOptions.value, (newOptions) => {
  const rawOptions = newOptions.map(item => toRaw(item));
  emits('update:options', rawOptions);
});
</script>

<style scoped>
</style>
