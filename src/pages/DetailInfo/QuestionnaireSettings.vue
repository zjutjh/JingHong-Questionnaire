<template>
  <div class="flex flex-col items-center">
    <div class="mb-20 questionSettings">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">
          时间配置
        </h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400" />
        <div class=" mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0" />
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-20 mb-2.5 space-x-20 pb-10">
          <span class="ml-30 w-100">答题有效期</span>
          <span class="flex items-center flex-1 space-x-4">
            <el-date-picker
              v-model="schema.baseConfig.startTime"
              type="datetime"
              placeholder="开始日期-时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
            />
            <span>至</span>
            <el-date-picker
              v-model="schema.baseConfig.endTime"
              type="datetime"
              placeholder="结束日期-时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
            />
          </span>
        </div>
      </div>
    </div>

    <div class="mb-5 questionSettings">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">
          作答限制
        </h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400" />
        <div class="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0" />
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-6 mb-2.5 space-x-8">
          <span class="ml-30 mt-20 mb-20 mr-15 w-100">正方教务认证</span>
          <div class="flex items-center space-x-4">
            <el-checkbox v-model="schema.baseConfig.verify" @click="console.log(schema)">
              需要认证
            </el-checkbox>
            <el-tooltip content="开启后，答题者需要通过正方教务认证才能填写问卷" placement="top">
              <i class="el-icon-question text-gray-400 cursor-help" />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div v-if="schema.baseConfig.verify" class="mt-20 questionSettings">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">
          提交限制
        </h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400" />
        <div class="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0" />
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-6 mb-2.5 space-x-8">
          <span class="ml-30 mt-20 mb-20 mr-15 w-100">每日提交次数</span>
          <div class="flex items-center space-x-4">
            <el-input-number
              v-model="schema.baseConfig.dayLimit"
              :min="0"
              controls-position="right"
              class="w-32"
            />
            <el-tooltip content="设置为0表示不限制提交次数" placement="top">
              <i class="el-icon-question text-gray-400 cursor-help" />
            </el-tooltip>
          </div>
        </div>
        <div class="w-full px-2">
          <div class="flex items-center mt-6 mb-2.5 space-x-8">
            <span class="ml-30 mt-20 mb-20 mr-15 w-100">是否仅本科生</span>
            <div class="flex items-center space-x-4">
              <el-checkbox v-model="schema.baseConfig.undergradOnly" @click="console.log(schema)">
                是
              </el-checkbox>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditStore } from "@/stores/edit";
const { schema } = useEditStore();
</script>

<style scoped>
.questionSettings {
  @apply w-1/2 bg-gray-100 dark:bg-gray-700 border rounded-sm p-6 shadow-md
}
</style>