<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center">
            {{ title }}
            <el-tag type="primary" class="ml-5">论述</el-tag>
            <el-tag type="warning" v-if="!required">选答</el-tag>
            <el-tag type="danger" v-if="unique">唯一</el-tag>
          </span>
        </div>
        <div class="flex items-center mt-15 ml-10">
          <span class="text-sm text-gray-500">{{ describe }}</span>
        </div>
      </div>
      <div class="flex-col justify-center items-center"></div>
    </div>
    <div class="divider my-5"></div>
    <div class="flex-col p-5 h-auto">
      <textarea placeholder="请输入答案" class="textarea textarea-bordered shadow-md w-full h-100" v-model="localAnswer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  serial_num: Number,
  title: String,
  required: Boolean,
  unique: Boolean,
  describe: String,
  answer: String,
});

const emits = defineEmits(['update:answer']);

const localAnswer = ref(props.answer);

watch(localAnswer, (newAnswer) => {
  emits('update:answer', newAnswer);
});

</script>

<style scoped>
</style>



<style scoped>

</style>