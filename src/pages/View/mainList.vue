<template>
  <div v-if="props.formData" class="flex flex-col h-650 ">
    <ques-list v-if="props.formData.survey_type === 0" :decrypted-id="props.decryptedId" :question="props.question" />
    <vote-list v-else />
    <div class="flex justify-center items-center py-50">
      <button v-if="decryptedId !== '' && !isOutDate" class="btn  w-1/3 bg-red-800 text-red-50 dark:opacity-75 hover:bg-red-600" @click="showModal('QuestionnaireSubmit')">
        提交问卷
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import QuesList from "@/pages/View/quesList.vue";
import VoteList from "@/pages/View/voteList.vue";

const props = defineProps<{
  formData: any,
  question: any
  decryptedId: any
}>();

</script>
<style scoped>

</style>