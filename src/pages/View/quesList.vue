<template>
  <div v-for="q in props.question" :key="q.serial_num">
    <div v-if="q.question_type === 1">
      <radio
        v-model:answer="q.answer"
        :title="q.subject"
        :options="q.options"
        :serial_num="q.serial_num"
        :unique="q.unique"
        :required="q.required"
        :other-option="q.other_option"
        :describe="q.describe"
        :questionnaire-i-d="decryptedId"
      />
    </div>
    <div v-if="q.question_type === 2">
      <checkbox
        v-model:answer="q.answer"
        :title="q.subject"
        :options="q.options"
        :serial_num="q.serial_num"
        :unique="q.unique"
        :required="q.required"
        :other-option="q.other_option"
        :describe="q.describe"
        :questionnaire-i-d="decryptedId as string"
        :minimum_option="q.minimum_option"
        :maximum_option="q.maximum_option"
      />
    </div>
    <div v-if="q.question_type === 3">
      <fill
        v-model:answer="q.answer"
        :title="q.subject"
        :serial_num="q.serial_num"
        :reg="q.reg"
        :unique="q.unique"
        :required="q.required"
        :describe="q.describe"
      />
    </div>
    <div v-if="q.question_type === 4">
      <text-area
        v-model:answer="q.answer"
        :title="q.subject"
        :serial_num="q.serial_num"
        :unique="q.unique"
        :required="q.required"
        :describe="q.describe"
      />
    </div>
    <div v-if="q.question_type === 5">
      <file
        v-model:answer="q.answer"
        :title="q.subject"
        :serial_num="q.serial_num"
        :unique="q.unique"
        :required="q.required"
        :describe="q.describe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import Radio from "@/pages/View/question/radio.vue";
import Checkbox from "@/pages/View/question/checkbox.vue";
import File from "@/pages/View/question/file.vue";
import Fill from "@/pages/View/question/fill.vue";
import TextArea from "@/pages/View/question/textArea.vue";

const props = defineProps<{
  question: any,
  decryptedId: any,

}>();
</script>

<style scoped>

</style>