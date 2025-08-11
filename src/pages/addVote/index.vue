
<template>
  <div class="flex items-center flex-col ">
    <el-radio-group v-model="state" class="p-20">
      <el-radio-button label="投票编辑" value="edit" />
      <el-radio-button label="投票设置" value="setting" />
    </el-radio-group>
    <div v-if="state === 'edit'" class="bg-base-200 min-w-900  overflow-y-auto flex flex-col justify-center ">
      <div class="p-20">
        <div class="flex justify-center items-center flex-col gap-10">
          <input v-model="schema.quesConfig.title" :class="['input bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-2xl w-[80%] text-center', titleError ? 'border-red-500 border-2 transition-all duration-300' : '']" placeholder="投票标题">
          <textarea v-model="schema.quesConfig.desc" class=" textarea bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-md w-[80%] resize-none" placeholder="投票描述" />
        </div>
      </div>
      <vote />
      <div class="mx-60 flex justify-center gap-40 my-20">
        <el-button class="flex-1" @click="submit(1)">
          保存
        </el-button>
        <el-button class="flex-1 " @click="voteValidator(schema) && (voteId === -1 ? submit(2) : saveEdit())">
          发布
        </el-button>
      </div>
    </div>
    <vote-setting v-if="state === 'setting'" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import Vote from "./vote.vue";
import { useEditVoteStore } from "@/stores/voteEdit.ts";
import { useRequest } from "vue-hooks-plus";
import { setNewQuestionnaireDetailAPI, setQuestionnaireDetailAPI } from "@/apis";
import { deepCamelToSnake } from "@/utilities/deepCamelToSnake.ts";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import router from "@/router";
import VoteSetting from "@/pages/addVote/voteSetting.vue";
import { useValidator } from "../DetailInfo/validate";
import { storeToRefs } from "pinia";

const { resetSchema, voteId } = useEditVoteStore();
const { schema } = storeToRefs(useEditVoteStore());
const { titleError, voteValidator } = useValidator();

const state = ref("edit");
const saveEdit = () => {
  useRequest(() => setQuestionnaireDetailAPI(deepCamelToSnake(schema.value)), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200 && res.msg === "OK") {
        ElNotification.success("保存成功");
        router.push("/admin");
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error(e);
    }
  });
};
const submit = (state: number) => {
  schema.value.status = state;
  useRequest(() => setNewQuestionnaireDetailAPI(deepCamelToSnake(schema.value)), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200 && res.msg === "OK") {
        if (state === 1) {
          ElNotification.success("创建并保存为草稿成功");
          resetSchema();
        } else {
          ElNotification.success("创建并发布成功");
        }
        router.push("/admin");
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error(e);
    },
    onFinally: () => {
      closeLoading();
    }
  });
};
onBeforeMount(() => {
  resetSchema();
});
</script>

<style scoped>

</style>