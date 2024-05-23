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
    <table class="table">
      <thead>
        <tr>
          <th>序号</th>
          <th>时间</th>
          <th v-for="ans in answers">{{ ans.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, index) in time">
          <th>{{ index+1 }}</th>
          <th>{{ t }}</th>
          <th v-for="ans in answers">{{ ans.answers[index] }}</th>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup lang="ts">
import { getAnswersAPI } from '@/apis';
import { ref } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import router from '@/router';

const id = ref(15);
const title = ref("Tiele");
const pageNum = ref(1);
const totalPageNum = ref(1);
const answers = ref();
const time = ref();

const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: id.value,
    page_num: pageNum.value,
    page_size: 10,
  }), {
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        totalPageNum.value = res.data.total_page_num;
        answers.value = res.data.answers_data.question_answers;
        time.value = res.data.answers_data.time;
      }
    }
  })
}
getAnswers();

</script>