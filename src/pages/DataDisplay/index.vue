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
      <div v-show="!isCount" class="btn btn-sm" :class="isUnique ? 'btn-neutral' : 'btn-accent'" @click="changeUnique">展示近期</div>
      <span v-show="!isCount">搜索</span><input v-show="!isCount" class="input input-sm input-bordered" type="text" v-model="keyText">
    </div>
    <div class="overflow-x-auto">
      <data-table :key-text="keyText" :is-unique="isUnique" v-show="!isCount"></data-table>
      <statics v-show="isCount"></statics>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { getDatatableAPI } from '@/apis';
import { ref } from 'vue';
import { useRequest } from 'vue-hooks-plus';
import router from '@/router';
import { useMainStore } from '@/stores';
import statics from './statics.vue';
import dataTable from './data.vue';

const tempStore = useMainStore().useTempStore();

const isCount = ref(false);
const isUnique = ref(false);
const keyText = ref("");

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

const changeUnique = () => { isUnique.value = !isUnique.value; }

</script>