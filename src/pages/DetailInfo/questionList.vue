<template>
  <div v-if="mode === 'ques'" class="bg-base-200 dark:bg-customGray flex-1 max-h-[80vh] overflow-y-auto">
    <div v-if="submitData" class="flex-col justify-center p-20 pb-0">
      <div class="flex justify-center items-center flex-col gap-10">
        <input v-model="schema.quesConfig.title" class="input bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-2xl w-[100%] text-center dark:bg-customGray" placeholder="投票标题">
        <textarea v-model="schema.quesConfig.desc" class=" textarea bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-md w-[100%] resize-none dark:bg-customGray" placeholder="投票描述" />
      </div>
    </div>
    <div class="divider" />
    <div class="flex flex-col gap-5 bg-base-100">
      <div
        v-for="q in question"
        :key="q.serialNum"
        @click="activeSerial = q.serialNum"
      >
        <div class="relative flex items-center gap-4 w-full" >
          <div class="flex-grow w-full" v-if="q.quesSetting.questionType === QuesItemType.RADIO">
            <el-skeleton animated :loading="loading">
              <radio
                v-model:title="q.subject"
                v-model:options="q.options"
                v-model:serialNum="q.serialNum"
                v-model:unique="q.quesSetting.unique"
                v-model:option-choose="q.quesSetting.required"
                v-model:other-option="q.quesSetting.otherOption"
                v-model:describe="q.description"
                :is-active="q.serialNum === activeSerial"
                @on-click="deleteQuestion(q.serialNum)"
              />
            </el-skeleton>
          </div>
        <div class="flex-grow w-full" v-if="q.quesSetting.questionType === QuesItemType.CHECKBOX">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <checkbox
                v-model:title="q.subject"
                v-model:options="q.options"
                v-model:serialNum="q.serialNum"
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
        <div class="flex-grow w-full" v-if="q.quesSetting.questionType === QuesItemType.INPUT">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <fill
                v-model:title="q.subject"
                v-model:serialNum="q.serialNum"
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
        <div class="flex-grow w-full" v-if="q.quesSetting.questionType === QuesItemType.TEXTAREA">
          <el-skeleton :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <text-area
                v-model:title="q.subject"
                v-model:serialNum="q.serialNum"
                v-model:unique="q.quesSetting.unique"
                v-model:option-choose="q.quesSetting.required"
                v-model:describe="q.description"
                :is-active="q.serialNum === activeSerial"
                @on-click="deleteQuestion(q.serialNum)"
              />
            </template>
          </el-skeleton>
        </div>
        <div class="flex-grow w-full" v-if="q.quesSetting.questionType === QuesItemType.PHOTO">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <file
                v-model:title="q.subject"
                v-model:serialNum="q.serialNum"
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
              @click="moveQuestion(activeSerial-1, 'up')" 
              class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
            >
              ↑
            </button>

            <button 
              @click="moveQuestion(activeSerial-1, 'down')" 
              class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
            >
              ↓
            </button>

            <button 
              @click="deleteQuestion(activeSerial-1)" 
              class="rounded-full w-24 h-24 flex justify-center items-center bg-gray-300 hover:bg-gray-400 text-white transition-colors duration-200"
            >
              x
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, defineProps, defineEmits, toRefs } from "vue";
import Checkbox from "@/pages/DetailInfo/question/checkbox.vue";
import Fill from "@/pages/DetailInfo/question/fill.vue";
import TextArea from "@/pages/DetailInfo/question/textArea.vue";
import File from "@/pages/DetailInfo/question/file.vue";
import radio from "@/pages/DetailInfo/question/radio.vue";
// import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";

import { useEditStore } from "@/stores/edit";

import {QuesItemType} from "../../utilities/constMap"

import { useActiveStore } from "@/stores/edit";

import { storeToRefs } from "pinia";



const props = defineProps<{
  loading: boolean
}>();

const {schema, deleteQuestion, moveQuestion} = useEditStore()

const question = schema.quesConfig.questionList;

const emits = defineEmits(["update:question"]);

const { activeSerial } = storeToRefs(useActiveStore());



watch(question, (newVal) => {
  emits("update:question", newVal);
});

const mode = ref("ques");

const submitData = inject("submitData");
</script>