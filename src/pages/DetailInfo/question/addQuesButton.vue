<template>
  <div class="border-gray-200 flex border-[1px]   flex-col items-center justify-center gap-6 h-80 w-80 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all dark:border-customGray_shallow dark:bg-customGray_more_shallow dark:hover:bg-customGray_shallow dark:hover:border-red-300" @click="addQues">
    <div class="dark:invert">
      <slot />
    </div>
    <div class="text-[12px]">
      {{ props.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditStore } from "@/stores/edit";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { addQuestion } = useEditStore();

const { schema } = storeToRefs(useEditStore());

const questionLens = computed(() => schema.value.quesConfig.questionList.length);

const props = defineProps<{
  text: string
  type: string
}>();

const addQues = () => {
  addQuestion(questionLens.value, Number(props.type));
  console.log(schema);
};
</script>

<style scoped>

</style>