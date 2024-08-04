<template>
  <div class="p-40 flex mt-60">
    <div class="basis-1/4 p-20 pl-0 flex justify-center gap-10">
      <div class="btn btn-success" style="width: 80%;" @click="addNewQuestionnaire">
        + 新建问卷
      </div>
    </div>
    <div class="basis-3/4 flex flex-col gap-8">
      <el-skeleton :loading="loading" :rows="10" animated>
      <questionnaireItem
      :key='item'
      v-for="item in questionnaireList"
      :title="item.title"
      :id-name="item.id"
      :status="item.status"
      @updateList="() => getQuestionnaireList()"
      />
      <el-pagination
        :current-page="tempStore.homePageNum"
        layout="prev, pager, next"
        :page-count="totalPageNum"
        @current-change="handleCurrentChange"
      />
      </el-skeleton>
    </div>
  </div>
</template>

<script setup lang="ts">
import questionnaireItem from './questionnaireItem.vue';
import { useRequest } from 'vue-hooks-plus';
import { getQuestionnaireListAPI } from '@/apis';
import {onMounted, ref} from 'vue';
import router from '@/router';
import {closeLoading, startLoading} from "@/utilities";
import { useMainStore } from '@/stores';

const tempStore = useMainStore().useTempStore();
const loginStore = useMainStore().useLoginStore();
const pageSize = 4;
// const pageNum = ref(1);
const totalPageNum = ref(1);
const questionnaireList = ref();
const loading = ref(true);
onMounted(() => {
  loginStore.setShowHeader(true);
})
const getQuestionnaireList = (title?: string) => {
  useRequest(() => getQuestionnaireListAPI({
    page_num: tempStore.homePageNum,
    page_size: pageSize,
    title: title
  }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if(res.code === 200) {
        questionnaireList.value = res.data.survey_list;
        totalPageNum.value = res.data.total_page_num;
          loading.value = false
      }
    },
    onFinally: () => closeLoading()
  })
}
getQuestionnaireList();

const handleCurrentChange = (val: number) => {
  tempStore.setHomePageNum(val);
  getQuestionnaireList();
}

const addNewQuestionnaire = () => {
  localStorage.setItem('isNew','true')
  router.push('/admin/DetailInfo')
}

</script>