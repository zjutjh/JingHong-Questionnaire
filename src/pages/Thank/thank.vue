<template>
  <div class="fixed inset-0 flex items-center justify-center bg-red-300 dark:bg-black">
    <div class="flex flex-col bg-white w-full sm:w-1/2 lg:w-1/3 p-6 h-full justify-between shadow-lg dark:bg-customGray">
      <div>
        <div class="flex justify-center mt-50">
          <el-image class="h-250" src='https://img.lonesome.cn/jhwl/project/questionnaire/thank.webp' ></el-image>
        </div>
        <div class="flex flex-col items-center justify-center">
          <div class=" text-3xl text-red-950  dark:text-red-400 mb-20">
            提交成功
          </div>
          <div v-if="tempStore.surveyId != -1">
            <div class="text-xl">投票统计</div>
            <div v-for="topic in staticData">
              <hr>
              <div class=" text-lg">
                {{ topic.serial_num }}.{{ topic.question }}
                <el-tag type="primary" class="ml-5" v-if="topic.question_type == 1">单选</el-tag>
                <el-tag type="primary" class="ml-5" v-if="topic.question_type == 2">多选</el-tag>
              </div>
              <div v-for="option in topic.options" class="flex gap-20">
                <div>{{ option.serial_num }}.{{ option.content }}</div>
                <div>票数: {{ option.count }}</div>
              </div>
            </div>
            <hr>
          </div>
        </div>
      </div>
      <el-image class="h-80 " src='https://img.lonesome.cn/jhwl/project/questionnaire/JH_logo.svg'></el-image>
    </div>
  </div>
</template>


<script setup lang="ts">
import router from '@/router';
import { useMainStore } from '@/stores';
import { onMounted, ref } from 'vue';
import { getVoteDataAPI } from '@/apis';
import { useRequest } from 'vue-hooks-plus';

const tempStore = useMainStore().useTempStore();

const staticData = ref();

onMounted(() => {
  if(tempStore.surveyId != -1) {
    setTimeout(() => {}, 1000);
    useRequest(() => getVoteDataAPI({id: tempStore.surveyId}), {
      onSuccess(res) {
        staticData.value = res.data.statistics;
        console.log(res.data);
      }
    })
  }
})
</script>

<style scoped>

</style>