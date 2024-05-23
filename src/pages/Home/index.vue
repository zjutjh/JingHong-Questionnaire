<template>
  <div class="p-40 flex">
    <div class="basis-1/4 p-20 pl-0 flex justify-center gap-10">
      <div class="btn btn-success" style="width: 80%;" @click="() => router.push('/DetailInfo')">
        + 新建问卷
      </div>
    </div>
    <div class="basis-3/4 flex flex-col gap-8">
      <questionnaireItem
      v-for="item in questionnaireList"
      :title="item.title"
      :id-name="item.id"
      :status="item.status"
      @updateList="() => getQuestionnaireList()"
      />
      <el-pagination
        :current-page="pageNum"
        layout="prev, pager, next"
        :page-count="totalPageNum"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import questionnaireItem from './questionnaireItem.vue';
import { useRequest } from 'vue-hooks-plus';
import { getQuestionnaireListAPI } from '@/apis';
import { ref } from 'vue';
import router from '@/router';

const pageSize = 4;
const pageNum = ref(1);
const totalPageNum = ref(1);
const questionnaireList = ref();

const getQuestionnaireList = (title?: string) => {
  useRequest(() => getQuestionnaireListAPI({
    page_num: pageNum.value,
    page_size: pageSize,
    title: title
  }), {
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        questionnaireList.value = res.data.survey_list;
        totalPageNum.value = res.data.total_page_num;
      }
    }
  })
}
getQuestionnaireList();

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getQuestionnaireList();
}

</script>