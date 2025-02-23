<template>
  <div class="flex flex-col items-center">
    <div class="w-1/2 bg-gray-100 dark:bg-gray-700 border rounded-sm p-6 mb-20 shadow-md">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">时间配置</h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400"></div>
        <div class=" mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0"></div>
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-20 mb-2.5 space-x-20">
          <span class="ml-30 mt-10 mb-20 w-100">答题有效期</span>
          <div class="flex items-center flex-1 space-x-4">
            <el-date-picker
              v-model="formData.base_config.start_time"
              type="datetime"
              placeholder="开始日期-时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
            />
            <span>至</span>
            <el-date-picker
              v-model="formData.base_config.end_time"
              type="datetime"
              placeholder="结束日期-时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="w-1/2 bg-gray-100 dark:bg-gray-700 border rounded-sm p-6 mb-20 shadow-md">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">提交限制</h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400"></div>
        <div class="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0"></div>
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-6 mb-2.5 space-x-8">
          <span class="ml-30 mt-20 mb-20 mr-15 w-100">每日提交次数</span>
          <div class="flex items-center space-x-4">
            <el-input-number
              v-model="formData.base_config.day_limit"
              :min="0"
              controls-position="right"
              class="w-32"
            />
            <el-tooltip content="设置为0表示不限制提交次数" placement="top">
              <i class="el-icon-question text-gray-400 cursor-help"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="w-1/2 bg-gray-100 dark:bg-gray-700 border rounded-sm p-6 mb-5 shadow-md">
      <div class="flex items-center mt-15 ml-5 mb-15 px-10">
        <h3 class="text-lg font-bold">作答限制</h3>
      </div>
      <div class="relative">
        <div class="ml-15 w-[15%] h-6 bg-red-400"></div>
        <div class="mt-2 w-full h-2 bg-gray-200 dark:bg-gray-400 absolute bottom-0"></div>
      </div>
      <div class="w-full px-4">
        <div class="flex items-center mt-6 mb-2.5 space-x-8">
          <span class="ml-30 mt-20 mb-20 mr-15 w-100">正方教务认证</span>
          <div class="flex items-center space-x-4">
            <el-checkbox v-model="formData.base_config.verify">
              需要认证
            </el-checkbox>
            <el-tooltip content="开启后，答题者需要通过正方教务认证才能填写问卷" placement="top">
              <i class="el-icon-question text-gray-400 cursor-help"></i>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-6">
      <el-button type="danger" @click="saveSettings" :loading="save">
        保存设置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { QuesStatus, QuesType } from "../../utilities/constMap"

interface BaseConfig {
  start_time: string
  end_time: string
  day_limit: number
  verify: boolean
}

interface FormData {
  status: QuesStatus
  survey_type: QuesType
  base_config: BaseConfig
  ques_config: {
    desc: string
    title: string
    question_list: any[]
  }
}

const formData = reactive<FormData>({
  status: QuesStatus.DRAFT,
  survey_type: QuesType.SURVEY,
  base_config: {
    start_time: '',
    end_time: '',
    day_limit: 0,
    verify: false
  },
  ques_config: {
    desc: '',
    title: '',
    question_list: []
  }
})

const save = ref(false)

const saveSettings = async () => {
  try {
    save.value = true

    if (!formData.base_config.start_time || !formData.base_config.end_time) {
      ElMessage.error('请设置答题有效期')
      return
    }

    if (new Date(formData.base_config.end_time) <= new Date(formData.base_config.start_time)) {
      ElMessage.error('结束时间必须大于开始时间')
      return
    }

    ElMessage.success('设置保存成功')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败，请重试')
  } finally {
    save.value = false
  }
}
</script>