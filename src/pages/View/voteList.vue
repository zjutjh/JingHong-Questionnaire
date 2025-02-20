<template>
  <div v-for="(q, index) in props.question" :key="index">
    <vote
      v-model:answer="q.answer"
      :title="q.subject"
      :options="q.options"
      :serial_num="q.serial_num"
      :unique="q.unique"
      :required="q.required"
      :other-option="q.other_option"
      :describe="q.describe"
      :questionnaire-i-d="props.decryptedId"
      :minimum_option="q.minimum_option"
      :maximum_option="q.maximum_option"
      :count="resultData"
    />
  </div>
</template>

<script setup lang="ts">
import Vote from "@/pages/View/question/vote.vue";

const props = defineProps<{
  question: any,
  decryptedId: any,
  resultData: any
}>();
</script>

<style scoped>

</style>