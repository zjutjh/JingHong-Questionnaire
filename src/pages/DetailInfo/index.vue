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
                    @on-click="deleteQuestion(q.serial_num)"
                  />
                </template>
              </el-skeleton>
            </div>
          </div>
        </div>

        <!--        <div class="flex justify-center items-center gap-160 mt-20">-->
        <!--          <button-->
        <!--            v-show="isNew === 'false'"-->
        <!--            class="btn btn-success dark:opacity-75 dark:text-white"-->
        <!--            @click="showModal('SaveQuestionnaireSubmit')"-->
        <!--          >-->
        <!--            保存更改-->
        <!--          </button>-->
        <!--          <button-->
        <!--            v-show="isNew === 'false'"-->
        <!--            class="btn btn-error dark:opacity-75 dark:text-white"-->
        <!--            @click="showModal('reverseQuestionnaireSubmit')"-->
        <!--          >-->
        <!--            放弃更改-->
        <!--          </button>-->
        <!--          <button v-show="isNew === 'true'" class="btn btn-success dark:opacity-75 dark:text-white" @click="submit(1)">-->
        <!--            保存-->
        <!--          </button>-->
        <!--          <button-->
        <!--            v-show="isNew === 'true'"-->
        <!--            class="btn btn-primary dark:opacity-75 dark:text-white"-->
        <!--            @click="showModal('NewQuestionnaireSubmit')"-->
        <!--          >-->
        <!--            发布-->
        <!--          </button>-->
        <!--        </div>-->
      </div>
    </div>
    <menu-panel v-show="mode === 'ques'">
      <right-menu />
    </menu-panel>
  </div>
  <modal modal-id="setting">
    <template #title>
      设置
    </template>
    <template #default>
      <div class="flex gap-20 p-10">
        <span class="flex items-center gap-10"><span>默认唯一</span><input v-model="setting.isUnique" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>
        <span class="flex items-center gap-10"><span>默认必答</span><input v-model="setting.isRequired" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>
        <span class="flex items-center gap-10"><span>默认有"其他"选项</span><input v-model="setting.isOtherOptions" type="checkbox" class="checkbox  dark:bg-customGray_more_shallow"></span>
      </div>
    </template>
  </modal>
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
      <button class="btn btn-success dark:opacity-75 w-80" @click="submit">
        确认
      </button>
    </template>
  </modal>
  <modal modal-id="reverseQuestionnaireSubmit">
    <template #title>
      放弃更改
    </template>
    <template #default>
      确认要放弃更改?
    </template>
    <template #action>
      <button class="btn btn-error dark:opacity-75 w-80" @click="dataReverse">
        确认
      </button>
    </template>
  </modal>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, reactive, provide } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI, setNewQuestionnaireDetailAPI, setQuestionnaireDetailAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal } from "@/components";
import Checkbox from "@/pages/DetailInfo/question/checkbox.vue";
import Fill from "@/pages/DetailInfo/question/fill.vue";
import TextArea from "@/pages/DetailInfo/question/textArea.vue";
import File from "@/pages/DetailInfo/question/file.vue";
import radio from "@/pages/DetailInfo/question/radio.vue";
// import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";
import router from "@/router";
import { closeLoading, startLoading } from "@/utilities";
// import { VueDraggableNext } from "vue-draggable-next";
import { useMainStore } from "@/stores";
import LeftMenu from "@/pages/DetailInfo/leftMenu.vue";
import MenuPanel from "@/pages/DetailInfo/menuPanel.vue";
import RightMenu from "@/pages/DetailInfo/rightMenu.vue";

const mode = ref("ques");
const tempStore = useMainStore().useTempStore();
const selectedOption = ref(1);
// const selectedNumber = ref(1);
const formData = ref();
const question = ref([]);
const title = ref();
const submitData = ref();
const id = ref<number>();
const reg = ref<string>("");
// const regNum = ref("^[0-9]{1}$");
const time = ref();
const loading = ref(true);
const setting = reactive({
  isUnique: false,
  isOtherOptions: false,
  isRequired: false
});
const activeSerial = ref(-1);
const setActive = (serialNum: number) => {
  console.log(serialNum);
  activeSerial.value = serialNum;
};
const addQuestion = (type: number) => {
  question.value.push({
    description: "",
    img: "",
    options: [{
      content: "",
      img: "",
      serial_num: 1
    },
    {
      content: "",
      img: "",
      serial_num: 2
    }
    ],
    other_option: setting.isOtherOptions,
    question_type: type,
    reg: reg.value,
    required: setting.isRequired,
    serial_num: question.value.length + 1,
    subject: "标题",
    unique: setting.isUnique
  });

  question.value.forEach((q, index) => {
    q.serial_num = index + 1;
  });
  nextTick(() => {
    if (questionnaireContainer.value) {
      questionnaireContainer.value!.scrollTop = questionnaireContainer.value!.scrollHeight;
    }
  });
};

provide("addQuestion", addQuestion);
const isNew = localStorage.getItem("isNew");
const calculateFutureDate = (): Date => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 7);
  return futureDate;
};

const startTime = ref(Date.now());
// 用于获取问卷部分的容器元素
const questionnaireContainer = ref<HTMLDivElement>();

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
        // console.log(res.data);
        const formDataCopy = deepCopy(res.data); // Use deep copy here
        if (formDataCopy.questions) {
          formDataCopy.questions.forEach((item) => {
            delete item.id;
          });
        }
        formData.value = formDataCopy;
        submitData.value = deepCopy(formData.value); // Deep copy to avoid reference issues
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

const dataReverse = () => {
  submitData.value = deepCopy(formData.value);
  question.value = deepCopy(formData.value.questions);
  time.value = submitData.value.time;
  // console.log(question.value);
  ElNotification.success("成功放弃修改");
  showModal("reverseQuestionnaireSubmit", true);
  router.push("/admin");
};

const submit = (state: number) => {
  submitData.value.time = time.value;
  submitData.value.start_time = new Date(startTime.value).toISOString();
  submitData.value.questions = question.value;
  if (isNew === "false") {
    useRequest(() => setQuestionnaireDetailAPI(submitData.value), {
      onBefore: () => startLoading(),
      onSuccess(res) {
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
  } else {
    submitData.value.status = state;
    useRequest(() => setNewQuestionnaireDetailAPI(submitData.value), {
      onBefore: () => startLoading(),
      onSuccess(res) {
        if (res.code === 200 && res.msg === "OK") {
          if (state === 1) {
            ElNotification.success("创建并保存为草稿成功");
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
  }
};

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
