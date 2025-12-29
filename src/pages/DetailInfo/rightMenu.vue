<template>
  <div v-if="currentType !== undefined" class="bg-base-100 dark:bg-[#1A1A1A] flex-1">
    <!-- 题型显示 -->
    <div class="flex bg-base-200 dark:bg-customGray_shallow w-full opacity-0.6 items-center" style="height: 4vh;">
      <div class="text-red-400 dark:text-white pl-16 text-sm">
        {{ typeChinese[currentType] }}
      </div>
    </div>

    <!-- 垂直间距 -->
    <div class="w-full" style="height: 2vh;" />

    <div class="pl-16">
      <!-- 所有题型通用 -->
      <div class="text-sm font-medium">
        基础配置
      </div>
      <div class="pt-8">
        <el-checkbox
          v-if="questionList[activeSerial - 1]?.quesSetting?.required !== undefined"
          v-model="questionList[activeSerial - 1].quesSetting.required"
          label="必选"
          size="large"
        />
        <el-checkbox
          v-if="questionList[activeSerial - 1]?.quesSetting?.unique !== undefined"
          v-model="questionList[activeSerial - 1].quesSetting.unique"
          label="唯一"
          size="large"
        />
      </div>

      <!-- 有其他选项 -->
      <div v-if="currentType === QuesItemType.CHECKBOX || currentType === QuesItemType.RADIO" class="pt-2">
        <el-checkbox
          v-if="questionList[activeSerial-1]?.quesSetting?.otherOption !== undefined"
          v-model="questionList[activeSerial - 1].quesSetting.otherOption"
          label="有其他选项"
          size="large"
        />
      </div>

      <div class="pt-16 text-sm font-medium">
        引导介绍文案
      </div>

      <div class="pt-16">
        <el-input
          v-model="questionList[activeSerial - 1].description"
          type="textarea"
          style="width: 240px"
          placeholder="Please input"
        />
      </div>

      <!-- 填空特殊逻辑 -->
      <div v-if="currentType === QuesItemType.INPUT || currentType === QuesItemType.TEXTAREA" class="pt-24">
        <div class="text-sm font-medium">
          内容格式限制
        </div>
        <div class="pt-16">
          <el-select v-model="questionList[activeSerial - 1].quesSetting.reg" style="width: 240px">
            <el-option
              v-for="item in basicReg"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <!-- 多选特殊逻辑 -->
      <div v-if="currentType === QuesItemType.CHECKBOX" class="pt-24">
        <div class="text-sm font-medium">
          选项配置
        </div>
        <div class="pt-16">
          <div>
            <span class="text-sm font-medium pr-8">最少选择数</span>
            <el-input-number
              v-model="questionList[activeSerial - 1].quesSetting.minimumOption"
              min="0"
              :max="questionList[activeSerial - 1].quesSetting.maximumOption"
            />
          </div>
          <div class="pt-10">
            <span class="text-sm font-medium pr-8">最多选择数</span>
            <el-input-number
              v-model="questionList[activeSerial - 1].quesSetting.maximumOption"
              :min="questionList[activeSerial - 1].quesSetting.minimumOption"
            />
          </div>
        </div>
      </div>

      <!-- 选择操作 -->
      <div v-if="currentType === QuesItemType.RADIO || currentType === QuesItemType.CHECKBOX" class="pt-24">
        <el-button @click="addOption(activeSerial)">
          增加选项
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useActiveStore } from "@/stores/edit";
import { useEditStore } from "@/stores/edit";
import { QuesItemType } from "@/utilities/constMap";
import { basicReg } from "@/utilities/regs";
import { storeToRefs } from "pinia";

const typeChinese = {
  1: "单项选择题",
  2: "多项选择题",
  3: "单行输入框",
  4: "多行输入框",
  5: "图片",
  6: "投票"
} as const satisfies Record<QuesItemType, string>;

const { activeSerial } = storeToRefs(useActiveStore());

const editStore = storeToRefs(useEditStore());

const questionList = computed({
  get: () => editStore.schema.value?.quesConfig?.questionList || [],
  set: (val) => {
    if (editStore.schema.value?.quesConfig) {
      editStore.schema.value.quesConfig.questionList = val;
    }
  }
});

const currentType = computed<QuesItemType | undefined>(() => {
  if (activeSerial.value === -1) {
    return undefined;
  } else {
    return (questionList.value[activeSerial.value - 1]?.quesSetting.questionType);
  }
});

const addOption = (serialNum: number) => {
  const newList = questionList.value.map(q => {
    if (q.serialNum === serialNum) {
      const newOptions = [
        ...q.options,
        {
          serialNum: q.options.length + 1,
          content: "",
          img: "",
          description: ""
        }
      ];
      return { ...q, options: newOptions };
    }
    return q;
  });
  questionList.value = newList;
};

</script>

<style scoped></style>