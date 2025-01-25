<template>
  <div class="border-gray-200 flex border-[1px]   flex-col items-center justify-center gap-6 h-80 w-80 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all" @click="addQues">
    <slot />
    <div class="text-[12px]">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
const props = defineProps<{
  text: string
  type: number
}>();

const injectedAddQues = inject<((type: number) => void)>("addQuestion");
const addQues = () => {
  if (injectedAddQues) {
    injectedAddQues(Number(props.type));
  }
};
</script>

<style scoped>

</style>