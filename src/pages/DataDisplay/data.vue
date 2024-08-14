<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>序号</th>
          <th>时间</th>
          <th v-for="ans in answers">
            {{ ans.title }}
            <el-tag type="primary" size="small" class="ml-3">{{ answersType.get(ans.question_type) }}</el-tag>
          </th>
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
</template>

<script setup lang="ts">
import {ElNotification, ElPagination} from 'element-plus';
import { getAnswersAPI } from '@/apis';
import { ref, watch } from 'vue';
import { useMainStore } from '@/stores';
import { useRequest } from 'vue-hooks-plus';

const tempStore = useMainStore().useTempStore();

const props = defineProps<{
  keyText: string,
  isUnique: boolean,
}>();

const answersType = new Map([
  [1, '单选'],
  [2, '多选'],
  [3, '填空'],
  [4, '简答'],
  [5, '图片'],
]);

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
}

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
    text: props.keyText === "" ? undefined : props.keyText,
    unique: props.isUnique,
  }), {
    debounceWait: 400,
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        totalPageNum.value = res.data.total_page_num;
        answers.value = res.data.answers_data.question_answers;
        time.value = res.data.answers_data.time;
      }
    },
    onError(e: any) {
      ElNotification.error('获取失败，请重试' + e);
    },
  })
}
getAnswers();

watch(props, getAnswers);

</script>