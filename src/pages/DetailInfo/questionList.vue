<template>
  <div class=" flex-1">
    <div v-if="mode === 'ques'" class="bg-base-200 dark:bg-customGray flex-1  overflow-y-auto h-[80vh]">
      <div v-if="schema && schema.quesConfig" class="flex-col justify-center p-20 pb-0">
        <div class="flex justify-center items-center flex-col gap-10">
          <input v-model="schema.quesConfig.title" class="input bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-2xl w-[100%] text-center dark:bg-customGray" placeholder="问卷标题">
          <textarea v-model="schema.quesConfig.desc" class=" textarea bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-md w-[100%] resize-none dark:bg-customGray" placeholder="问卷描述" />
        </div>
      </div>
      <div class="divider" />
      <div v-if="schema && schema.quesConfig" class="flex flex-col gap-5 bg-base-100">
        <div
          v-for="q in schema.quesConfig.questionList"
          :key="q.serialNum"
          @click="activeSerial = q.serialNum"
        >
          <div class="relative flex items-center gap-4 w-full">
            <div v-if="q.quesSetting.questionType === QuesItemType.RADIO" class="flex-grow w-full">
              <el-skeleton animated :loading="loading">
                <radio
                  v-model:title="q.subject"
                  v-model:options="q.options"
                  v-model:serial-num="q.serialNum"
                  v-model:unique="q.quesSetting.unique"
                  v-model:option-choose="q.quesSetting.required"
                  v-model:other-option="q.quesSetting.otherOption"
                  v-model:describe="q.description"
                  :is-active="q.serialNum === activeSerial"
                  @on-click="deleteQuestion(q.serialNum)"
                />
              </el-skeleton>
            </div>
            <div v-if="q.quesSetting.questionType === QuesItemType.CHECKBOX" class="flex-grow w-full">
              <el-skeleton animated :loading="loading">
                <template #template>
                  <skeleton-card />
                </template>
                <template #default>
                  <checkbox
                    v-model:title="q.subject"
                    v-model:options="q.options"
                    v-model:serial-num="q.serialNum"
                    v-model:unique="q.quesSetting.unique"
                    v-model:option-choose="q.quesSetting.required"
                    v-model:other-option="q.quesSetting.otherOption"
                    v-model:describe="q.description"
                    v-model:maximum_option="q.quesSetting.maximumOption"
                    v-model:minimum_option="q.quesSetting.minimumOption"
                    :is-active="q.serialNum === activeSerial"
                    @on-click="deleteQuestion(q.serialNum)"
                  />
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.quesSetting.questionType === QuesItemType.INPUT" class="flex-grow w-full">
              <el-skeleton animated :loading="loading">
                <template #template>
                  <skeleton-card />
                </template>
                <template #default>
                  <fill
                    v-model:title="q.subject"
                    v-model:serial-num="q.serialNum"
                    v-model:reg="q.quesSetting.reg"
                    v-model:unique="q.quesSetting.unique"
                    v-model:option-choose="q.quesSetting.required"
                    v-model:describe="q.description"
                    :is-active="q.serialNum === activeSerial"
                    @on-click="deleteQuestion(q.serialNum)"
                  />
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.quesSetting.questionType === QuesItemType.TEXTAREA" class="flex-grow w-full">
              <el-skeleton :loading="loading">
                <template #template>
                  <skeleton-card />
                </template>
                <template #default>
                  <text-area
                    v-model:title="q.subject"
                    v-model:serial-num="q.serialNum"
                    v-model:unique="q.quesSetting.unique"
                    v-model:option-choose="q.quesSetting.required"
                    v-model:describe="q.description"
                    :is-active="q.serialNum === activeSerial"
                    @on-click="deleteQuestion(q.serialNum)"
                  />
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.quesSetting.questionType === QuesItemType.PHOTO" class="flex-grow w-full">
              <el-skeleton animated :loading="loading">
                <template #template>
                  <skeleton-card />
                </template>
                <template #default>
                  <file
                    v-model:title="q.subject"
                    v-model:serial-num="q.serialNum"
                    v-model:unique="q.quesSetting.unique"
                    v-model:option-choose="q.quesSetting.required"
                    v-model:describe="q.description"
                    :is-active="q.serialNum === activeSerial"
                    @on-click="deleteQuestion(q.serialNum)"
                  />
                </template>
              </el-skeleton>
            </div>

            <div v-if="q.serialNum === activeSerial" class="flex flex-col gap-10">
              <button
                v-if="q.serialNum !== 1"
                class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
                @click.stop="activeMove(activeSerial-1, 'up')"
              >
                ↑
              </button>

              <button
                v-if="q.serialNum !== schema.quesConfig.questionList.length"
                class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
                @click.stop="activeMove(activeSerial-1, 'down')"
              >
                ↓
              </button>

              <button
                class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
                @click.stop="activeDelete(activeSerial-1)"
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-center items-center gap-10 mt-10">
      <button
        v-show="isNew === 'true'"
        class="btn dark:opacity-75 dark:text-white btn-sm flex-1 bg-red-100 hover:bg-red-200 hover:border-red-300"
        style="border-radius: 0"
        @click="showModal('SaveQuestionnaireSubmit')"
      >
        保存
      </button>
      <button
        v-show="isNew === 'true'"
        class="btn btn-sm dark:opacity-75 dark:text-white flex-1 hover:bg-red-200 bg-red-100 hover:border-red-300"
        style="border-radius: 0"
        @click="showModal(surveyId === -1?'NewQuestionnaireSubmit':'SaveQuestionnaireSubmit')"
      >
        发布
      </button>
    </div>
  </div>
  <modal modal-id="NewQuestionnaireSubmit">
    <template #title>
      确认发布
    </template>
    <template #default>
      该操作会直接发布问卷!请确认问卷无误
    </template>
    <template #action>
      <button class="btn btn-success w-80" @click="submit(2)">
        确认
      </button>
    </template>
  </modal>
  <modal modal-id="SaveQuestionnaireSubmit">
    <template #title>
      保存更改
    </template>
    <template #default>
      确认要保存更改吗?
    </template>
    <template #action>
      <button class="btn btn-success dark:opacity-75 w-80" @click="saveEdit">
        确认
      </button>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Checkbox from "@/pages/DetailInfo/question/checkbox.vue";
import Fill from "@/pages/DetailInfo/question/fill.vue";
import TextArea from "@/pages/DetailInfo/question/textArea.vue";
import File from "@/pages/DetailInfo/question/file.vue";
import radio from "@/pages/DetailInfo/question/radio.vue";
// import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";

import { useEditStore } from "@/stores/edit";

import { QuesItemType } from "@/utilities/constMap.ts";

import { useActiveStore } from "@/stores/edit";

import { storeToRefs } from "pinia";
import { ElNotification } from "element-plus";
import { showModal, modal } from "@/components";
import router from "@/router";
import { useRequest } from "vue-hooks-plus";
import { setNewQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { deepCamelToSnake } from "@/utilities/deepCamelToSnake.ts";

const loading = ref(true);

const { deleteQuestion, moveQuestion, resetSchema, surveyId } = useEditStore();

// console.log(surveyId);

const { schema } = storeToRefs(useEditStore());

watch(schema, (newVal) => {
  if (newVal) {
    loading.value = false;
  }
}, { immediate: true });

const { activeSerial } = storeToRefs(useActiveStore());

const isNew = "true";
const activeMove = (index: number, action: "up" | "down") => {
  moveQuestion(index, action);
  if (action === "up") {
    activeSerial.value = activeSerial.value - 1;
  } else {
    activeSerial.value = activeSerial.value + 1;
  }
};

const activeDelete = (index: number) => {
  deleteQuestion(index);
  activeSerial.value = -1;
};

const mode = ref("ques");

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
      showModal("SaveQuestionnaireSubmit", true);
      closeLoading();
    }
  });
};

const saveEdit = () => {
  useRequest(() => setNewQuestionnaireDetailAPI(deepCamelToSnake(schema.value)), {
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
    },
    onFinally: () => {
      showModal("SaveQuestionnaireSubmit", true);
      closeLoading();
    }
  });
};
</script>