<template>
  <div class="flex justify-between flex-1 gap-40">
    <menu-panel v-show="mode === 'ques'">
      <left-menu />
    </menu-panel>
    <div class="mt-20 flex flex-col gap-20 flex-1 ">
      <div class="flex justify-center items-center">
        <el-radio-group
          v-model="mode"
          size="middle"
          text-color="#f87171"
          fill="#fee2e2"
        >
          <el-radio-button label="问卷内容" value="ques" />
          <el-radio-button label="问卷设置" value="setting" />
          <el-radio-button label="题目逻辑" value="logic" disabled />
        </el-radio-group>
      </div>
      <question-list v-if="mode === 'ques'" v-model:question="question" :loading="loading" />
      <questionnaire-settings v-if="mode === 'setting'" />
    </div>
    <menu-panel v-show="mode === 'ques'">
      <right-menu />
    </menu-panel>
  </div>
<!--  <modal modal-id="setting">-->
<!--    <template #title>-->
<!--      设置-->
<!--    </template>-->
<!--    <template #default>-->
<!--      <div class="flex gap-20 p-10">-->
<!--        <span class="flex items-center gap-10"><span>默认唯一</span><input v-model="setting.isUnique" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>-->
<!--        <span class="flex items-center gap-10"><span>默认必答</span><input v-model="setting.isRequired" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>-->
<!--        <span class="flex items-center gap-10"><span>默认有"其他"选项</span><input v-model="setting.isOtherOptions" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>-->
<!--      </div>-->
<!--    </template>-->
<!--  </modal>-->
</template>

<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import LeftMenu from "@/pages/DetailInfo/leftMenu.vue";
import MenuPanel from "@/pages/DetailInfo/menuPanel.vue";
import RightMenu from "@/pages/DetailInfo/rightMenu.vue";
import QuestionList from "./questionList.vue";
import QuestionnaireSettings from "./QuestionnaireSettings.vue";

import { useEditStore } from "@/stores/edit";

// 初始化问卷

const { resetSchema } = useEditStore();
onUnmounted(() => {
  resetSchema();
});
//
const mode = ref("ques");

const question = ref([]);

const loading = ref(true);

</script>

<style scoped>
.ghost {
  opacity: 0.4;
}
::v-deep(.el-radio-button__inner:hover ){
  color: #f87171
}

</style>

