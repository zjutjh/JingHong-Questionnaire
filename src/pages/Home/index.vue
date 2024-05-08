<template>
  <div class="p-40 flex">
    <div class="basis-1/4 p-20 pl-0 flex justify-center gap-10">
      <div class="btn btn-success" style="width: 80%;">
        + 新建问卷
      </div>
    </div>
    <div class="basis-3/4 flex flex-col gap-8">
      <questionnaireItem
      v-for="item in questionnaireList"
      :title="item.title"
      :id-name="item.id"
      :status="item.status"
      @updateList="updateList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import questionnaireItem from './questionnaireItem.vue';
import { useRequest } from 'vue-hooks-plus';
import { getQuestionnaireListAPI } from '@/apis';
import { ref } from 'vue';

const pageSize = 4;
const totalPageNum = ref(0);
const questionnaireList = ref();

const getQuestionnaireList = (pageNum: number, pageSize: number, title?: string) => {
  useRequest(() => getQuestionnaireListAPI({
    page_num: pageNum,
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
getQuestionnaireList(1, pageSize);

const updateList = () => {
  getQuestionnaireList(1, pageSize);
}

</script>