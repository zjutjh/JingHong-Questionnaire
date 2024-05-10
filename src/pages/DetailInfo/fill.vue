<template>
  <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <span class="flex items-center gap-20">
        <span>{{ serial_num }}</span><input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" v-model="title"/>
      </span>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>选答</span><input type="checkbox" :name=-1  class="checkbox-sm"/>
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 overflow-y-auto h-60">
     <input class=" input input-bordered shadow-md w-full"/>
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error shadow-md" @click="emit('on-click')">删除题目</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {modal, showModal} from "@/components";

const props = defineProps<{
  serial_num: number,
  title?: string,
  }>()
const emit = defineEmits<{
  (e:'on-click'):void
}>()
const title = ref<string>(props.title? props.title : '')


</script>


<style scoped>

</style>