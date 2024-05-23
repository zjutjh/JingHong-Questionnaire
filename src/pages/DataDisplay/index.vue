<template>
<div @click="router.push('/')" class="p-16 float-start">
      <el-icon :size="50"><Back /></el-icon>
</div>
<div class="py-50 px-120">
  <div class="flex flex-raw gap-10 text-lg">
    <div>
      {{ "问卷id: " + id }}
    </div>
    <div>
      {{ "问卷标题: " + title }}
    </div>
  </div>
  <div class="overflow-x-auto">
    <!-- <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>序号</th>
          <th>时间</th>
          <th>etc</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(ans, index) in answers.question_answers">
          <th>{{ index }}</th>
          <td>{{ answers.time[index] }}</td>
          <td></td>
        </tr>
      </tbody>
    </table> -->
  </div>
</div>
</template>

<script setup lang="ts">
import { getAnswersAPI } from '@/apis';
import { ref } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import router from '@/router';

const id = ref();
const title = ref();
const answers = ref();

const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: 13,
    page_num: 5,
    page_size: 1,
  }), {
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        answers.value = res.data;
      }
    }
  })
}
getAnswers();

</script>