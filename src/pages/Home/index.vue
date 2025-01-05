<template>
  <div class="p-40 flex mt-60">
    <div class="basis-1/4 p-20 pl-0 flex justify-center gap-10">
      <div class="btn btn-success dark:opacity-75 dark:text-white" style="width: 80%;" @click="addNewQuestionnaire">
        + 新建问卷
      </div>
    </div>
    <div class="basis-3/4 flex flex-col gap-8">
      <el-skeleton :loading="loading" :rows="10" animated>
        <questionnaireItem
          v-for="item in questionnaireList"
          :key="item"
          :title="item.title"
          :id-name="item.id"
          :status="item.status"
          @update-list="() => getQuestionnaireList()"
        />
        <el-pagination
          :current-page="tempStore.homePageNum"
          layout="prev, pager, next"
          :page-count="totalPageNum"
          @current-change="handleCurrentChange"
        />
      </el-skeleton>
    </div>
    <modal :modal-id="'select'">
      <template #title>
        创建问卷
      </template>
      <template #default>
        <span class="flex items-center">请选择创建问卷的类型
          <el-radio-group v-model="surveyType" style="margin-left: 30px">
            <el-radio-button value="0" size="middle" label="调研问卷" />
            <el-radio-button value="1" size="middle" label="投票问卷" />
          </el-radio-group>
        </span>
      </template>
      <template #action>
        <div class="btn btn-success dark:opacity-70 dark:text-white w-80" @click="newQues">
          创建
        </div>
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { modal, showModal } from "@/components";
import questionnaireItem from "./questionnaireItem.vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireListAPI } from "@/apis";
import { onMounted, ref, watch } from "vue";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";

const tempStore = useMainStore().useTempStore();
const loginStore = useMainStore().useLoginStore();
const pageSize = 4;
// const pageNum = ref(1);
const totalPageNum = ref(1);
const questionnaireList = ref();
const loading = ref(true);
const surveyType = ref(tempStore.surveyType);
watch(surveyType, () => {
  tempStore.surveyType = surveyType;
});
onMounted(() => {
  loginStore.setShowHeader(true);
});
const getQuestionnaireList = (title?: string) => {
  useRequest(() => getQuestionnaireListAPI({
    page_num: tempStore.homePageNum,
    page_size: pageSize,
    title: title
  }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        questionnaireList.value = res.data.survey_list;
        totalPageNum.value = res.data.total_page_num;
        loading.value = false;
      }
    },
    onFinally: () => closeLoading()
  });
};
getQuestionnaireList();

const handleCurrentChange = (val: number) => {
  tempStore.setHomePageNum(val);
  getQuestionnaireList();
};

const addNewQuestionnaire = () => {
  showModal("select");
};

const newQues = () => {
  showModal("select", true);
  localStorage.setItem("isNew", "true");
  router.push("/admin/DetailInfo");
};
</script>