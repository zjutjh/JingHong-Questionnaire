<!-- 此组件用于展示问卷信息 -->
<template>
  <div class="border border-neutral-700 rounded-lg p-20">
    <div class="relative h-30">
      <div class="absolute left-0">{{ "标题:" + title }}</div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost">查看数据</div>
        <div class="pt-4">{{ "id:" + idName }}</div>
      </div>
    </div>
    <div class="relative h-30">
      <div class="absolute left-0 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost">编辑/设计问卷</div>
        <div class="btn btn-sm btn-ghost" @click="() => showModal('statusConfirmModal'+idName)">{{ status===1 ? "发布问卷" : "下架问卷" }}</div>
        <div class="btn btn-sm btn-ghost">删除问卷</div>
      </div>
      <div class="absolute right-5 flex flex-row gap-5">
        <div class="btn btn-sm btn-ghost">复制分享链接</div>
        <div class="pt-4">{{ "状态:" + (status===1 ? "草稿" : "已发布") }}</div>
      </div>
    </div>
  </div>
  <modal :modal-id="'statusConfirmModal'+idName" :values="{title, idName, status}">
    <div class="text-xl font-bold">{{ status===1 ? "发布问卷" : "下架问卷" }}</div>
    <div class="px-40 pt-10">{{ status===1 ? "确认发布问卷: " : "确认下架问卷: " + title + "?"}}</div>
    <template #action>
      <div class="btn btn-sm btn-success" @click="() => updateQuestionnaireStatus(idName, status===1?2:1)">确认</div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { modal, showModal } from '@/components';
import { updateQuestionnaireStatusAPI } from '@/apis';
import { useRequest } from 'vue-hooks-plus';
import { ElNotification } from 'element-plus';

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
        ElNotification("修改成功");
        updateList();
        showModal('statusConfirmModal'+props.idName, true);
      }
    }
  })
}

</script>