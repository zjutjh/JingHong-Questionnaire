<template>
  <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <span class="flex items-center gap-20">
        <span>{{ serial_num }}</span><input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" v-model="title"/>
      </span>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>选答</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="props.optionChoose"/>
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm" v-model="props.unique"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 overflow-y-auto h-60">
     <input class=" input input-bordered shadow-md w-full" :placeholder=pal />
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error shadow-md" @click="emit('on-click')">删除题目</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {modal, showModal} from "@/components";

const props = defineProps<{
  serial_num: number,
  title?: string,
  reg?: string
  optionChoose:boolean
  unique:boolean
  }>()
const emit = defineEmits<{
  (e:'on-click'):void
}>()
const title = ref<string>(props.title? props.title : '')
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