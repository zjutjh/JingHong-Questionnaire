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
import { onMounted, ref, watch, nextTick, reactive, provide, onUnmounted } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI, setNewQuestionnaireDetailAPI, setQuestionnaireDetailAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal } from "@/components";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
import { useMainStore } from "@/stores";
import LeftMenu from "@/pages/DetailInfo/leftMenu.vue";
import MenuPanel from "@/pages/DetailInfo/menuPanel.vue";
import RightMenu from "@/pages/DetailInfo/rightMenu.vue";
import QuestionList from "./questionList.vue";
import QuestionnaireSettings from "./QuestionnaireSettings.vue";

import { useEditStore } from "@/stores/edit";

import { storeToRefs } from "pinia";

import { useActiveStore } from "@/stores/edit";

// 初始化问卷

const { resetSchema } = useEditStore();
onUnmounted(() => {
  resetSchema();
});
//
const mode = ref("ques");
const tempStore = useMainStore().useTempStore();
const selectedOption = ref(1);
const formData = ref();
const question = ref([]);
const title = ref();
const submitData = ref();
const id = ref<number>();
const reg = ref<string>("");
const time = ref();
const loading = ref(true);

const activeSerial = ref(-1);
const setActive = (serialNum: number) => {
  console.log(serialNum);
  activeSerial.value = serialNum;
};

provide("activeSerial", activeSerial);
provide("setActive", setActive);

provide("submitData", submitData);

const isNew = localStorage.getItem("isNew");
const calculateFutureDate = (): Date => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  return futureDate;
};

onMounted(() => {
  time.value = calculateFutureDate();
  if (isNew === "false") {
    id.value = Number(localStorage.getItem("id"));
    getInfo();
  } else {
    submitData.value = {
      desc: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，期待您的参与！",
      img: "",
      questions: [],
      status: -1,
      time: "",
      title: "投票标题",
      day_limit: 0,
      survey_type: Number(tempStore.surveyType),
      verify: false
    };
    loading.value = false;
  }
});
// Deep copy function
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
// 计算属性：动态生成正则表达式
// const inputPattern = computed(() => {
//   return `^[0-9]{${selectedNumber.value}}$`;
// });

// 监听选项变化，更新输入框的验证规则
// const updateInputPattern = () => {
//   regNum.value = inputPattern.value;
//   reg.value = inputPattern.value;
// };

const getInfo = () => {
  useRequest(() => getQuestionnaireDetailAPI({ id: id.value as number }), {
    onBefore: () => startLoading(),
    onSuccess(res) {
      if (res.code === 200) {
        const formDataCopy = deepCopy(res.data);
        if (formDataCopy.questions) {
          formDataCopy.questions.forEach((item) => {
            delete item.id;
          });
        }
        formData.value = formDataCopy;
        submitData.value = deepCopy(formData.value);// Deep copy to avoid reference issues
        title.value = submitData.value.title;
        question.value = submitData.value.questions;
        time.value = submitData.value.time;
        loading.value = false;
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error("获取失败，请重试" + e);
    },
    onFinally: () => closeLoading()
  });
};

const cleanReg = () => {
  reg.value = "";
};
watch(selectedOption, cleanReg);

const deleteQuestion = (serial_num: number) => {
  // console.log(serial_num);
  question.value = question.value.filter((item) => item.serial_num !== serial_num);
  question.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
    }
  });
};
provide("deleteQuetion", deleteQuestion);

// //调试 监听reg
// watch(question, (newQuestions) => {
//   newQuestions.forEach((q, index) => {
//     // 监听每个问题的 reg 值
//     watch(() => q.reg, (newReg) => {
//       console.log(`问题 ${index + 1} 的正则表达式变化为: ${newReg}`);
//       // 在这里添加处理逻辑，比如更新状态或执行其他操作
//     });
//   });
// }, { deep: true });

// 修改serial_numquestion.value =[...question.value]
// const updateQuestionSerialNumbers = () => {
//   // console.log(question.value)
//   question.value.forEach((q, index) => {
//     q.serial_num = index + 1;
//   });
// };

</script>

<style scoped>
.ghost {
  opacity: 0.4;
}
::v-deep(.el-radio-button__inner:hover ){
  color: #f87171
}

</style>

