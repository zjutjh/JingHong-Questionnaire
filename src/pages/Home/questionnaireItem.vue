<!-- 此组件用于展示问卷信息 -->
<template>
  <div class="bg-neutral-100 dark:bg-customGray border border-neutral-700 rounded-lg p-20">
    <div class="relative h-30">
      <div class="absolute left-0">
        <el-tag v-if="props.surveyType === SurveyType.QUES">
          问卷
        </el-tag>
        <el-tag v-else type="success">
          投票
        </el-tag>
        {{ title }}
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
        <div v-if="status !== 3" class="btn btn-sm btn-ghost" @click="() => showModal('statusConfirmModal'+idName)">
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
        <div class="pt-4" :class="classMap[status]">
          {{ statusMap[status] }}
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
import { delQuestionnaireAPI, updateQuestionnaireStatusAPI } from "@/apis";
import { useRequest } from "vue-hooks-plus";
import { ElMessage, ElNotification } from "element-plus";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";
import CryptoJS from "crypto-js";
import { computed } from "vue";
import { useQrCode } from "@/utilities/useQrCode";
import { QuesStatus, SurveyType } from "@/utilities/constantMap.ts";

const baseURL = import.meta.env.VITE_COPY_LINK;
const tempStore = useMainStore().useTempStore();
const props = defineProps<{
  title: string,
  idName: number,
  surveyType: SurveyType.VOTE | SurveyType.QUES,
  status: QuesStatus.DRAFT | QuesStatus.PUBLISH | QuesStatus.EXPIRED,
}>();
const statusMap = {
  [QuesStatus.DRAFT]: "草稿",
  [QuesStatus.PUBLISH]: "已发布",
  [QuesStatus.EXPIRED]: "已过期"
};

const classMap = {
  [QuesStatus.DRAFT]: "text-blue-500",
  [QuesStatus.PUBLISH]: "text-red-500",
  [QuesStatus.EXPIRED]: "text-gray-500"
};

const emit = defineEmits(["updateList"]);

const updateList = () => {
  emit("updateList");
};

const updateQuestionnaireStatus = (id: number, status: QuesStatus.DRAFT | QuesStatus.PUBLISH) => {
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
    return baseURL + "/View?id=" + CryptoJS.AES.encrypt(props.idName + "", Key).toString();
  }
);

// 复制问卷url兼容http
const copyShareCode = () => {
  const clipboardCopy = async () => {
    if (navigator.clipboard) {
      // 如果支持 clipboard API
      try {
        await navigator.clipboard.writeText(questionnaireURL.value);
        ElMessage({
          message: "链接复制成功",
          type: "success"
        });
      } catch (error) {
        console.error("Clipboard copy failed: ", error);
      }
    } else {
      // 不支持 clipboard API，使用 fallback 方法
      const textarea = document.createElement("textarea");
      textarea.value = questionnaireURL.value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);

      ElMessage({
        message: "链接复制成功",
        type: "success"
      });
    }
  };

  clipboardCopy();
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
