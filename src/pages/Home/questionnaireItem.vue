<!-- 此组件用于展示问卷信息 -->
<template>
  <div class="bg-neutral-100 dark:bg-customGray border border-neutral-700 rounded-lg p-20">
    <div class="relative h-30">
      <div class="absolute left-0">
        {{ "标题:" + title }}
      </div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost" @click="checkData">
          查看数据
        </div>
        <div class="pt-4">
          {{ "id:" + idName }}
        </div>
      </div>
    </div>
    <div class="relative h-30">
      <div class="absolute left-0 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost" @click="DetailInfo">
          编辑/设计问卷
        </div>
        <div class="btn btn-sm btn-ghost" @click="() => showModal('statusConfirmModal'+idName)">
          {{ status===1 ? "发布问卷" : "下架问卷" }}
        </div>
        <div class="btn btn-sm btn-ghost" @click="() => showModal('delConfirmModal'+idName)">
          删除问卷
        </div>
      </div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div v-if="status===2" class="btn btn-sm btn-ghost" @click="() => showModal('QRcode')">
          查看分享二维码
        </div>
        <div v-if="status===2" class="btn btn-sm btn-ghost" @click="() => copyShareCode()">
          复制分享链接
        </div>
        <div class="pt-4" :class="{ 'text-blue-500': status===2, 'text-red-500': status===1, 'text-gray-500': status===3}">
          {{ "状态:" + (status===1 ? "草稿" : status===2 ? "已发布" : "已截止") }}
        </div>
      </div>
    </div>
  </div>
  <modal :modal-id="'statusConfirmModal'+idName">
    <template #title>
      {{ status===1 ? "发布问卷" : "下架问卷" }}
    </template>
    <template #default>
      {{ status===1 ? "确认发布问卷: " : "确认下架问卷: " }} {{ title }}
    </template>
    <template #action>
      <div class="btn btn-error dark:opacity-70 dark:text-white w-80" @click="() => updateQuestionnaireStatus(idName, status===1?2:1)">
        确认
      </div>
    </template>
  </modal>
  <modal :modal-id="'delConfirmModal'+idName">
    <template #title>
      删除问卷
    </template>
    <template #default>
      将删除标题为<span class="text-red-500">{{ title }}</span>的问卷
    </template>
    <template #action>
      <div class="btn btn-error dark:opacity-70 dark:text-white w-80" @click="() => delQuestionnaire(idName)">
        确认
      </div>
    </template>
  </modal>
  <modal :modal-id="'QRcode'">
    <template #title>
      分享二维码
    </template>
    <template #default>
      <img :src="qrCodeURL" class="w-1/2 mx-auto">
    </template>
    <template #action>
      <div class="btn btn-success dark:opacity-70 dark:text-white w-80" @click="copyQrCode">
        复制
      </div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { modal, showModal } from "@/components";
import { updateQuestionnaireStatusAPI, delQuestionnaireAPI } from "@/apis";
import { useRequest } from "vue-hooks-plus";
import { ElNotification } from "element-plus";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";
import CryptoJS from "crypto-js";
import { ElMessage } from "element-plus";
import { computed } from "vue";
import { useQrCode } from "@/utilities/useQrCode";

const baseURL = import.meta.env.VITE_COPY_LINK;
const tempStore = useMainStore().useTempStore();
const props = defineProps<{
  title: string,
  idName: number,
  status: 1 | 2,
}>();

const emit = defineEmits(["updateList"]);

const updateList = () => {
  emit("updateList");
};

const updateQuestionnaireStatus = (id: number, status: 1 | 2) => {
  useRequest(() => updateQuestionnaireStatusAPI({
    id: id,
    status: status
  }), {
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification.success("修改成功");
        updateList();
      } else {
        ElNotification.error(res.msg);
      }
      showModal("statusConfirmModal" + props.idName, true);
    }
  });
};

const delQuestionnaire = (id: number) => {
  useRequest(() => delQuestionnaireAPI({ id: id }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification("删除成功");
        updateList();
        showModal("delConfirmModal" + props.idName, true);
      }
    },
    onFinally: () => closeLoading()
  });
};

// 获取问卷url
const questionnaireURL = computed(
  () => {
    const Key = "JingHong";
    const url = baseURL + "/View?id=" + CryptoJS.AES.encrypt(props.idName + "", Key).toString();
    return url;
  }
);

// 复制问卷url
const copyShareCode = () => {
  navigator.clipboard.writeText(questionnaireURL.value);
  ElMessage({
    message: "链接复制成功",
    type: "success"
  });
};

// 二维码处理
const { qrCodeURL, copyQrCode } = useQrCode(questionnaireURL.value);

const DetailInfo = () => {
  localStorage.setItem("isNew", "false");
  localStorage.setItem("id", String(props.idName));
  router.push("/admin/DetailInfo");
};

const checkData = () => {
  tempStore.setCheckId(props.idName);
  tempStore.setCheckTitle(props.title);
  router.push("/admin/Data");
};

</script>
