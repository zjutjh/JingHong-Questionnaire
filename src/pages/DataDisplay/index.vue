<template>
<div>
  <div @click="back" class="px-16 float-start">
    <el-icon :size="50"><Back /></el-icon>
  </div>
  <div class="px-120">
    <div class="flex flex-raw gap-10 text-lg">
      <div>
        {{ "问卷id: " + tempStore.checkId }}
      </div>
      <div>
        {{ "问卷标题: " + tempStore.checkTitle }}
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
      <el-pagination
        :current-page="pageNum"
        layout="prev, pager, next"
        :page-count="totalPageNum"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { getAnswersAPI } from '@/apis';
import { ref } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import router from '@/router';
import { ElPagination } from 'element-plus';
import { useMainStore } from '@/stores';

const tempStore = useMainStore().useTempStore();

const pageNum = ref(1);
const totalPageNum = ref(2);
const pageSize = ref(10);
const answers = ref();
const time = ref();

const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize.value,
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

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
}

const back = () => {
  router.push('/');
}

</script>