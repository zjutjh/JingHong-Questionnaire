<template>
  <div v-if="mode === 'ques'" class="bg-base-200 dark:bg-customGray flex-1 max-h-[80vh] overflow-y-auto">
    <div v-if="submitData" class="flex-col justify-center p-20 pb-0">
      <div class="flex justify-center items-center flex-col gap-10">
        <input v-model="submitData.title" class="input bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-2xl w-[100%] text-center dark:bg-customGray" placeholder="投票标题">
        <textarea v-model="submitData.desc" class=" textarea bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-md w-[100%] resize-none dark:bg-customGray" placeholder="投票描述" />
      </div>
    </div>
    <div class="divider" />
    <div class="flex flex-col gap-5 bg-base-100">
      <div
        v-for="q in question"
        :key="q.serial_num"
        @click="setActive(q.serial_num)"
      >
        <div v-if="q.question_type === 1">
          <el-skeleton animated :loading="loading">
            <radio
              v-model:title="q.subject"
              v-model:options="q.options"
              v-model:serial_num="q.serial_num"
              v-model:unique="q.unique"
              v-model:option-choose="q.required"
              v-model:other-option="q.other_option"
              v-model:describe="q.description"
              :is-active="q.serial_num === activeSerial"
              @on-click="deleteQuestion(q.serial_num)"
            />
          </el-skeleton>
        </div>
        <div v-if="q.question_type === 2">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <checkbox
                v-model:title="q.subject"
                v-model:options="q.options"
                v-model:serial_num="q.serial_num"
                v-model:unique="q.unique"
                v-model:option-choose="q.required"
                v-model:other-option="q.other_option"
                v-model:describe="q.description"
                v-model:maximum_option="q.maximum_option"
                v-model:minimum_option="q.minimum_option"
                :is-active="q.serial_num === activeSerial"
                @on-click="deleteQuestion(q.serial_num)"
              />
            </template>
          </el-skeleton>
        </div>
        <div v-if="q.question_type === 3">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <fill
                v-model:title="q.subject"
                v-model:serial_num="q.serial_num"
                v-model:reg="q.reg"
                v-model:unique="q.unique"
                v-model:option-choose="q.required"
                v-model:describe="q.description"
                :is-active="q.serial_num === activeSerial"
                @on-click="deleteQuestion(q.serial_num)"
              />
            </template>
          </el-skeleton>
        </div>
        <div v-if="q.question_type === 4">
          <el-skeleton :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <text-area
                v-model:title="q.subject"
                v-model:serial_num="q.serial_num"
                v-model:unique="q.unique"
                v-model:option-choose="q.required"
                v-model:describe="q.description"
                :is-active="q.serial_num === activeSerial"
                @on-click="deleteQuestion(q.serial_num)"
              />
            </template>
          </el-skeleton>
        </div>
        <div v-if="q.question_type === 5">
          <el-skeleton animated :loading="loading">
            <template #template>
              <skeleton-card />
            </template>
            <template #default>
              <file
                v-model:title="q.subject"
                v-model:serial_num="q.serial_num"
                v-model:unique="q.unique"
                v-model:option-choose="q.required"
                v-model:describe="q.description"
                :is-active="q.serial_num === activeSerial"
                @on-click="deleteQuestion(q.serial_num)"
              />
            </template>
          </el-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, watch, defineProps, defineEmits } from "vue";
import Checkbox from "@/pages/DetailInfo/question/checkbox.vue";
import Fill from "@/pages/DetailInfo/question/fill.vue";
import TextArea from "@/pages/DetailInfo/question/textArea.vue";
import File from "@/pages/DetailInfo/question/file.vue";
import radio from "@/pages/DetailInfo/question/radio.vue";
// import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";

const props = defineProps<{
  loading: boolean
  question: any;
}>();

const question = props.question;

const emits = defineEmits(["update:question"]);

const activeSerial = inject("activeSerial")

const setActive = inject("setActive")

watch(question, (newVal) => {
  emits("update:question", newVal);
});

const mode = ref("ques");

const deleteQuestion = inject("deleteQuestion");
const submitData = inject("submitData");
</script>