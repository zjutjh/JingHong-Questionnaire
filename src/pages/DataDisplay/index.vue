<template>
  <div class="mt-60">
    <div class="px-16 float-start" @click="back">
      <el-icon :size="50">
        <Back />
      </el-icon>
    </div>
    <div class="px-120">
      <div class="flex flex-raw gap-10 text-lg">
        <div>
          {{ "问卷id: " + tempStore.checkId }}
        </div>
        <div>
          {{ "问卷标题: " + tempStore.checkTitle }}
        </div>
        <div class="btn btn-sm btn-accent dark:opacity-75" @click="downloadDatatable">
          下载数据表格
        </div>
        <div class="btn btn-sm btn-accent dark:opacity-75" @click="switchCount">
          统计切换
        </div>
        <div
          v-show="!isCount"
          class="btn btn-sm dark:opacity-75"
          :class="isUnique ? 'btn-neutral' : 'btn-accent'"
          @click="changeUnique"
        >
          展示近期
        </div>
        <div
          class="btn btn-sm btn-accent dark:opacity-75"
          :class="isDeleting ? 'btn-neutral' : 'btn-accent'"
          @click="switchDeleting"
        >
          删除答卷
        </div>
        <span v-show="!isCount">搜索</span><input
          v-show="!isCount"
          v-model="keyText"
          class="input input-sm input-bordered dark:bg-customGray_more_shallow"
          type="text"
        >
      </div>
      <div style="margin-bottom: 30vh;">
        <data-table
          v-show="!isCount"
          :key-text="keyText"
          :is-unique="isUnique"
          :is-deleting="isDeleting"
        />
        <statics v-show="isCount" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getDatatableAPI } from "@/apis";
import { ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import router from "@/router";
import { useMainStore } from "@/stores";
import statics from "./statics.vue";
import dataTable from "./data.vue";

const tempStore = useMainStore().useTempStore();

const isCount = ref(false);
const isUnique = ref(false);
const isDeleting = ref(false);
const keyText = ref("");

const back = () => {
  router.push("/admin");
};

const downloadDatatable = () => {
  useRequest(() => getDatatableAPI({
    id: tempStore.checkId
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        window.location.href = res.data;
      }
    }
  });
};

const switchCount = () => {
  isCount.value = !isCount.value;
};

const switchDeleting = () => {
  isDeleting.value = !isDeleting.value;
};

const changeUnique = () => {
  isUnique.value = !isUnique.value;
};

</script>