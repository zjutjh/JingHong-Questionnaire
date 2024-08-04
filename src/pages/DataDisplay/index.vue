<template>
<div class="mt-60">
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
      <div class="btn btn-sm btn-accent" @click="downloadDatatable">下载数据表格</div>
      <div class="btn btn-sm btn-accent" @click="switchCount">统计切换</div>
    </div>
    <div class="overflow-x-auto">
      <!-- 填空数据展示 -->
      <table class="table" v-show="!isCount">
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
         v-show="!isCount"
      />
      <!-- 选择数据统计 -->
      <div class="gap-8 m-5 grid grid-cols-2 mt-30" v-show="isCount">
        <n-card v-for="obj in staticsData" v-bind:key='obj'>
          <div class="font-bold">{{ obj.serial_num }}. {{ obj.question }}</div>
          <div v-for="opt in obj.options" class="m-6">
            <div class="relative border rounded">
              <span class="ml-4">{{ opt.content }}</span>
              <span class="absolute right-4">{{ opt.count/totalNum*100 }}%</span>
              <div class="inline absolute left-0 rounded bg-cyan-400 h-full opacity-15" :style="{width: 100*opt.count/totalNum+'%'}"></div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { getAnswersAPI, getDatatableAPI, getStaticsDataAPI } from '@/apis';
import {onMounted, ref} from 'vue';
import { useRequest } from 'vue-hooks-plus';
import router from '@/router';
import {ElNotification, ElPagination} from 'element-plus';
import { useMainStore } from '@/stores';
import { NCard } from 'naive-ui';

const tempStore = useMainStore().useTempStore();

const pageNum = ref(1);
const totalPageNum = ref(2);
const pageSize = ref(10);
const answers = ref();
const time = ref();
const staticsData = ref();
const totalNum = ref();
const isCount = ref(false);

onMounted(() => {
  getAnswers();
})
const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize.value,
  }), {
    onSuccess(res: any) {
      if(res.code === 200) {
        totalPageNum.value = res.data.total_page_num;
        answers.value = res.data.answers_data.question_answers;
        time.value = res.data.answers_data.time;
      }
    },
    onError(e: any) {
      ElNotification.error('获取失败，请重试' + e);
    }
  })
  useRequest(() => getStaticsDataAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize.value,
  }), {
    onSuccess(res: any) {
      if(res.code === 200) {
        console.log(res.data)
        staticsData.value = res.data.statistics;
        totalNum.value = res.data.total;
      }
    },
    onError(e: any) {
      ElNotification.error('获取失败，请重试' + e);
    }
  })
}


const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
}

const back = () => {
  router.push('/admin');
}

const downloadDatatable = () => {
  useRequest(() => getDatatableAPI({
    id: tempStore.checkId
  }), {
    onSuccess(res: any) {
      if(res.code === 200) {
        window.location.href = res.data;
      }
    }
  })
}

const switchCount = () => {
  isCount.value = !isCount.value;
}

</script>