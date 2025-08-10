<template>
  <div>
    <div class=" gap-8 m-5 grid grid-cols-2 mt-30">
      <n-card v-for="obj in staticsData" :key="obj" class="dark:bg-customGray_shallow">
        <div class="font-bold dark:text-white">
          {{ obj.serial_num }}. {{ obj.question }}
        </div>
        <div v-for="opt in obj.options" :key="opt.content" class="m-6">
          <div class="relative border rounded">
            <div class="inline absolute left-0 rounded bg-cyan-400 h-full opacity-15" :style="{width: 100*opt.count/totalNum+'%'}" />
            <span class="ml-4  dark:text-white">{{ opt.content }}</span>
            <span class="absolute right-4 dark:text-white">{{ (opt.count/totalNum*100).toFixed(2) }}%</span>
          </div>
        </div>
      </n-card>
    </div>
    <el-pagination
      :current-page="pageNum"
      layout="prev, pager, next"
      :page-count="totalPageNum"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useRequest } from "vue-hooks-plus";
import { getStaticsDataAPI } from "@/apis";
import { useMainStore } from "@/stores";
import { ElNotification, ElPagination } from "element-plus";
import { ref } from "vue";
import { NCard } from "naive-ui";

const tempStore = useMainStore().useTempStore();
const pageNum = ref(1);
const pageSize = 8;
const totalPageNum = ref();
const totalNum = ref();
const staticsData = ref();

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
};

const getAnswers = () => {
  useRequest(() => getStaticsDataAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        staticsData.value = res.data.statistics;
        totalNum.value = res.data.total;
        totalPageNum.value = res.data.total_sum_page;
      }
    },
    onError(e: any) {
      ElNotification.error("获取失败，请重试" + e);
    }
  });
};
getAnswers();

</script>