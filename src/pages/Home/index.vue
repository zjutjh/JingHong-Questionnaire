<template>
  <div class="p-40 flex mt-60">
    <div class="basis-1/4 p-20 pl-0 flex justify-center gap-10">
      <div class="flex flex-col gap-20" style="width: 80%">
        <div class="btn btn-success dark:opacity-75 dark:text-white " @click="newQues">
          + 新建问卷
        </div>
        <div class="btn btn-info dark:opacity-65 dark:text-white " @click="addVote">
          + 新建投票
        </div>
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
          :survey-type="item.survey_type"
          @update-status="statusConfirmModal"
          @del-ques="delConfirmModal"
          @show-qr-code="showQRcodeModal"
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
  <modal modal-id="statusConfirmModal">
    <template #title>
      {{ modalRef.targetStatus === 2 ? "发布问卷" : "下架问卷" }}
    </template>
    <template #default>
      {{ modalRef.targetStatus === 2 ? "确认发布问卷: " : "确认下架问卷: " }} {{ modalRef.title }}
    </template>
    <template #action>
      <div
        class="btn btn-error dark:opacity-70 dark:text-white w-80"
        @click="updateQuestionnaireStatus(modalRef.id, modalRef.targetStatus)"
      >
        确认
      </div>
    </template>
  </modal>
  <modal modal-id="delConfirmModal">
    <template #title>
      删除问卷
    </template>
    <template #default>
      将删除标题为<span class="text-red-500">{{ modalRef.title }}</span>的问卷
    </template>
    <template #action>
      <div
        class="btn btn-error dark:opacity-70 dark:text-white w-80"
        @click="delQuestionnaire(modalRef.id)"
      >
        确认
      </div>
    </template>
  </modal>
  <modal modal-id="showQRcodeModal">
    <template #title>
      分享二维码
    </template>
    <template #default>
      <img :src="modalRef.qrCodeURL" class="w-1/2 mx-auto">
    </template>
    <template #action>
      <div
        class="btn btn-success dark:opacity-70 dark:text-white w-80"
        @click="modalCopyCodeURL && modalCopyCodeURL()"
      >
        复制
      </div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import questionnaireItem from "./questionnaireItem.vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireListAPI, delQuestionnaireAPI, updateQuestionnaireStatusAPI } from "@/apis";
import { onMounted, Ref, ref, watch } from "vue";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";
import { useEditStore } from "@/stores/edit.ts";
import { modal, showModal } from "@/components";
import { ElNotification } from "element-plus";
import { QuesStatus } from "@/utilities/constantMap.ts";

const tempStore = useMainStore().useTempStore();
const loginStore = useMainStore().useLoginStore();
const pageSize = 4;
// const pageNum = ref(1);
const totalPageNum = ref(1);
const questionnaireList = ref();
const loading = ref(true);
const surveyType = ref(tempStore.surveyType);
const { setSurveyId, init } = useEditStore();
const modalRef = ref({
  title: "",
  id: 0,
  targetStatus: 0,
  qrCodeURL: ""
});

const showQRcodeModal = (qrCodeURL: Ref<string, string>, copyQrCode: () => Promise<void>) => {
  modalRef.value.qrCodeURL = qrCodeURL.value;
  modalCopyCodeURL = copyQrCode;
  showModal("showQRcodeModal");
};
let modalCopyCodeURL: () => void;

watch(surveyType, () => {
  tempStore.surveyType = surveyType.value;
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

const newQues = () => {
  localStorage.setItem("isNew", "true");
  setSurveyId(-1);
  init();
  router.push("/admin/DetailInfo");
};

const addVote = () => {
  localStorage.setItem("isNew", "true");
  router.push("/admin/addVote");
};

const statusConfirmModal = (targetStatus: number, title: string, id: number) => {
  modalRef.value.title = title;
  modalRef.value.id = id;
  modalRef.value.targetStatus = targetStatus;
  showModal("statusConfirmModal");
};
const updateQuestionnaireStatus = (id: number, status: QuesStatus.DRAFT | QuesStatus.PUBLISH) => {
  useRequest(() => updateQuestionnaireStatusAPI({
    id: id,
    status: status
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success("修改成功");
        getQuestionnaireList();
      } else {
        ElNotification.error(res.msg);
      };
      showModal("statusConfirmModal", true);
    }
  });
};

const delConfirmModal = (title: string, id: number) => {
  modalRef.value.title = title;
  modalRef.value.id = id;
  showModal("delConfirmModal");
};
const delQuestionnaire = (id: number) => {
  useRequest(() => delQuestionnaireAPI({ id: id }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success("删除成功");
        getQuestionnaireList();
      } else {
        ElNotification.error(res.msg);
      };
      showModal("delConfirmModal", true);
    },
    onFinally: () => closeLoading()
  });
};
</script>