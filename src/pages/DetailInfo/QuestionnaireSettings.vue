<template>
  <div class="QustionnaireSettings flex justify-center items-center">

    <div class="SectionCard bg-gray-100 dark:bg-gray-700">
      <div class="SectionHeader">
        <h3 class="SectionTitle">时间配置</h3>
      </div>
      <div class="RedSectionIndicator"></div>
      <div class="GraySectionIndicator"></div>
      <div class="SettingContent">
        <div class="SettingItem">
          <span class="ItemTitle">答题有效期</span>
          <el-date-picker
            v-model="formData.base_config.start_time"
            type="datetime"
            placeholder="开始日期-时间"
            value-format="YYYY - MM - DDTHH:mm:ssZ"
          />
          <span class="separator">至</span>
          <el-date-picker
            v-model="formData.base_config.end_time"
            type="datetime"
            placeholder="结束日期-时间"
            value-format="YYYY - MM - DDTHH:mm:ssZ"
          />
        </div>
      </div>
    </div>

    <div class="SectionCard bg-gray-100 dark:bg-gray-700">
      <div class="SectionHeader">
        <h3 class="SectionTitle">提交限制</h3>
      </div>
      <div class="RedSectionIndicator"></div>
      <div class="GraySectionIndicator"></div>
      <div class="SettingContent">
        <div class="SettingItem">
          <span class="ItemTitle">每日提交次数</span>
          <el-input-number
            v-model="formData.base_config.day_limit"
            :min="0"
            controls-position="right"
          />
          <el-tooltip content="设置为0表示不限制提交次数" placement="top">
            <i class="el-icon-question ml-2 text-gray-400 cursor-help"></i>
          </el-tooltip>
        </div>
      </div>
    </div>

    <div class="SectionCard bg-gray-100 dark:bg-gray-700">
      <div class="SectionHeader">
        <h3 class="SectionTitle">作答限制</h3>
      </div>
      <div class="RedSectionIndicator"></div>
      <div class="GraySectionIndicator"></div>
      <div class="SettingContent">
        <div class="SettingItem">
          <span class="ItemTitle">正方教务认证</span>
          <el-checkbox
            v-model="formData.base_config.verify"
          >需要认证</el-checkbox>
          <el-tooltip
            content="开启后，答题者需要通过正方教务认证才能填写问卷"
            placement="top"
          >
            <i class="el-icon-question ml-2 text-gray-400 cursor-help"></i>
          </el-tooltip>
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
import { ref, reactive, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

interface BaseConfig {
  start_time: string
  end_time: string
  day_limit: number
  verify: boolean
}

interface FormData {
  status: number
  survey_type: number
  base_config: BaseConfig
  ques_config: {
    desc: string
    title: string
    question_list: any[]
  }
}

const formData = reactive<FormData>({
  status: 1,
  survey_type: 1,
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
const emit = defineEmits(['save-settings']);

const saveSettings = async () => {
  try {
    save.value = true

    if (!formData.base_config.start_time ||!formData.base_config.end_time) {
      ElMessage.error('请设置答题有效期')
      return
    }

    if (new Date(formData.base_config.end_time) <= new Date(formData.base_config.start_time)) {
      ElMessage.error('结束时间必须大于开始时间')
      return
    }

    // Emit the save event with the updated settings
    emit('save-settings', formData);

    ElMessage.success('设置保存成功')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败，请重试')
  } finally {
    save.value = false
  }
}
</script>

<style scoped>
.QustionnaireSettings {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.SectionCard {
  width: 50%;
  border-width: 1px;
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.SectionHeader {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.SectionTitle {
  font-size: 18px;
  font-weight: bold;
  margin: 5px;
}

.RedSectionIndicator {
  width: 11%;
  height: 4px;
  background-color: #f87171;
  margin-top: 5px;
}

.GraySectionIndicator {
  width: 100%;
  height: 2%;
  @apply bg-gray-200 dark:bg-gray-200;
}

.SettingContent {
  width: 100%;
}

.SettingItem {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.ItemTitle {
  width: 120px;
  margin-left: 30px;
  margin-right: 30px;
}

.separator {
  margin: 0 10px;
}
</style>

