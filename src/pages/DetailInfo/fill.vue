<template>
  <div class="bg-base-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
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
          <span>必答</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="localOptionChoose"/>
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="localUnique"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 overflow-y-auto h-60">
     <input class=" input input-bordered shadow-md w-full" :placeholder=pal />
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error shadow-md" @click="$emit('on-click')">删除题目</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {computed, defineEmits, ref, watch} from "vue";
import {modal, showModal} from "@/components";

const props = defineProps<{
  serial_num: number,
  title?: string,
  reg?: string
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

const pal = computed(() => {
  if(props.reg === '^1[3456789]\\d{9}$') return `电话`
  else if(props.reg === '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$') return `邮箱`
  else if(props.reg === '^\\d{12}$') return `学号`
  else if (props.reg === '') return `无限制`
  else {
    const num = props.reg[7]
    return num + `位数`
  }
})

</script>


<style scoped>

</style>