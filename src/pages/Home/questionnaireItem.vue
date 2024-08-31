<!-- 此组件用于展示问卷信息 -->
<template>
  <div class="border border-neutral-700 rounded-lg p-20" :class="{ 'bg-neutral-100': status===2}">
    <div class="relative h-30">
      <div class="absolute left-0">{{ "标题:" + title }}</div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost" @click="checkData">查看数据</div>
        <div class="pt-4">{{ "id:" + idName }}</div>
      </div>
    </div>
    <div class="relative h-30">
      <div class="absolute left-0 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost" @click="DetailInfo">编辑/设计问卷</div>
        <div class="btn btn-sm btn-ghost" @click="() => showModal('statusConfirmModal'+idName)">{{ status===1 ? "发布问卷" : "下架问卷" }}</div>
        <div class="btn btn-sm btn-ghost" @click="() => showModal('delConfirmModal'+idName)">删除问卷</div>
      </div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div v-if="status===2" class="btn btn-sm btn-ghost" @click="() => copyShareCode()">复制分享链接</div>
        <div class="pt-4" :class="{ 'text-blue-500': status===2, 'text-red-500': status===1}">{{ "状态:" + (status===1 ? "草稿" : "已发布") }}</div>
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
      <div class="btn btn-success w-80" @click="() => updateQuestionnaireStatus(idName, status===1?2:1)">确认</div>
    </template>
  </modal>
  <modal :modal-id="'delConfirmModal'+idName">
    <template #title>删除问卷</template>
    <template #default>将删除标题为<span class="text-red-500">{{ title }}</span>的问卷</template>
    <template #action>
      <div class="btn btn-success w-80" @click="() => delQuestionnaire(idName)">确认</div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { modal, showModal } from '@/components';
import { updateQuestionnaireStatusAPI, delQuestionnaireAPI } from '@/apis';
import { useRequest } from 'vue-hooks-plus';
import { ElNotification } from 'element-plus';
import router from '@/router';
import {closeLoading, startLoading} from "@/utilities";
import { useMainStore } from '@/stores';
import CryptoJS from 'crypto-js';

const tempStore = useMainStore().useTempStore();

const props = defineProps<{
  title: string,
  idName: number,
  status: 1 | 2,
}>();

const emit = defineEmits(["updateList"]);

const updateList = () => {
  emit("updateList");
}

const updateQuestionnaireStatus = (id: number, status: 1 | 2) => {
  useRequest(() => updateQuestionnaireStatusAPI({
    id: id,
    status: status
  }), {
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        ElNotification.success("修改成功");
        updateList();
      } else {
        ElNotification.error(res.msg)
      }
      showModal('statusConfirmModal'+props.idName, true);
    }
  })
}

const delQuestionnaire = (id: number) => {
  useRequest(() => delQuestionnaireAPI({id: id}), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if(res.code === 200) {
        ElNotification("删除成功");
        updateList();
        showModal('delConfirmModal'+props.idName, true);
      }
    },
    onFinally: () => closeLoading()
  })
}

const copyShareCode = () => {
  const Key = 'JingHong';
  const encryptedId = CryptoJS.AES.encrypt(props.idName+'',Key).toString();
  navigator.clipboard.writeText( "https://qa.lonesome.cn/View?id=" + encryptedId);
}

const DetailInfo = () => {
  localStorage.setItem('isNew','false')
  localStorage.setItem('id',String(props.idName))
  router.push('/admin/DetailInfo')
}

const checkData = () => {
  tempStore.setCheckId(props.idName);
  tempStore.setCheckTitle(props.title);
  router.push('/admin/Data');
}

</script>
