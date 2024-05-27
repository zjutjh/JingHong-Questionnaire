<template>
  <div class="flex justify-center items-start gap-130 h-screen ">
    <div class="bg-blue-200 p-30 rounded-2xl shadow-lg w-230 hover:-translate-y-2 hover:shadow-2xl  transition transform duration-700 mt-40">
      <span class="flex justify-center items-center  gap-10"><el-icon @click="showModal('setting')"><Setting /></el-icon><span class="text-2xl">添加问卷题目</span></span>
      <div class="p-20">
        <div class="flex-col justify-center items-center">
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-1" class="radio-sm" :value="1" v-model="selectedOption" checked/>
            <span>单选</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-1" class="radio-sm" :value="2" v-model="selectedOption"/>
            <span>多选</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-1" class="radio-sm" :value="4" v-model="selectedOption"/>
            <span>论述</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-1" class="radio-sm" :value="5" v-model="selectedOption"/>
            <span>文件</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-1" class="radio-sm" :value="3" v-model="selectedOption"/>
            <span>填空</span>
          </div>
        </div>
        <div v-show="selectedOption === 3">
          <div class="divider"></div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-2" class="radio-sm" value="" v-model="reg"/>
            <span>无限制</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-2" class="radio-sm" value="^1[3456789]\d{9}$" v-model="reg"/>
            <span>手机号</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-2" class="radio-sm" value="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" v-model="reg"/>
            <span>邮箱</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-2" class="radio-sm" value="^\d{12}$" v-model="reg"/>
            <span>学号</span>
          </div>
          <div class="flex gap-10 my-5">
            <input type="radio" name="radio-2" class="radio-sm" :value="regNum" v-model="reg" />
            <span>
              <el-select
                  v-model="selectedNumber"
                  placeholder="Select"
                  size="small"
                  style="width: 50px"
                  @change="updateInputPattern"
              >
                <el-option
                    v-for="item in 9"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
              位数
            </span>
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center">
        <button class="btn btn-accent" @click="addQuestion">添加题目</button>
      </div>
    </div>
    <div class="p-40">
      <div class="bg-blue-200 w-750 p-40 shadow-lg rounded-2xl flex-col justify-center items-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
        <div class="flex-col justify-center">
          <el-skeleton :loading="loading" :rows="2" animated style="height: 60px">
            <template #default>
          <div class="text-4xl">{{ title }}</div>
          <div class="flex items-top gap-20  my-15" >
            <span>问卷内容描述</span>
            <textarea class="textarea textarea-bordered w-300" placeholder="描述问卷" v-model="submitData.desc" ></textarea>
          </div>
          <div class="flex gap-20 items-center my-15">
          <span >问卷截止时间</span>
          <el-date-picker
              v-model="time"
              type="datetime"
              placeholder="截止时间"
          />
            </div>
            </template>
          </el-skeleton>
        </div>
        <div class="divider"></div>
        <div class="overflow-y-auto h-800 p-20" ref="questionnaireContainer" style="scroll-behavior: smooth;">
         <!-- <VueDraggable
              v-model="question"
              animation="300"
              ghostClass="ghost"
              group="people"
              @update="onUpdate"
          >-->
          <div v-for="(q, index) in question" :key="q.serial_num" >
            <!-- 根据问题类型渲染组件 -->
            <div v-if="q.question_type === 1">
              <el-skeleton animated :loading="loading">
              <radio v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:other-option="q.other_option" v-model:describe="q.description"></radio>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 2">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <checkbox v-model:title="q.subject" v-model:options="q.options" v-model:serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:other-option="q.other_option" v-model:describe="q.description"></checkbox>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 3">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <fill v-model:title="q.subject" v-model:serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)" v-model:reg="q.reg" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></fill>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 4">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <text-area v-model:title="q.subject" v-model:serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></text-area>
                </template>
              </el-skeleton>
            </div>
            <div v-if="q.question_type === 5">
              <el-skeleton animated  :loading="loading">
                <template #template>
                  <skeleton-card></skeleton-card>
                </template>
                <template #default>
              <file v-model:title="q.subject" v-model:serial_num="q.serial_num" @on-click="deleteQuestion(q.serial_num)" v-model:unique="q.unique" v-model:option-choose="q.required" v-model:describe="q.description"></file>
                </template>
              </el-skeleton>
            </div>
          </div>
          <!--</VueDraggable>-->
        </div>
        <div class="flex justify-center items-center gap-160 mt-20">
          <button class="btn btn-success" @click="submit">保存更改</button>
          <button class="btn btn-error" @click="dataReverse">放弃更改</button>
        </div>
      </div>
    </div>
    <modal modal-id="setting" gray >
      <header class="text-3xl">Setting</header>
      <body>
      <title>默认设置</title>
      <div class="flex justify-evenly my-20">
        <span class="flex items-center gap-10"><span>默认唯一</span><input type="checkbox" class="checkbox" v-model="setting.isUnique"/></span>
        <span class="flex items-center gap-10"><span>默认必答</span><input type="checkbox" class="checkbox" v-model="setting.isRequired"/></span>
        <span class="flex items-center gap-10"><span>默认有"其他"选项</span><input type="checkbox" class="checkbox" v-model="setting.isOtherOptions"/></span>
      </div>
      </body>
    </modal>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch, nextTick, reactive} from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI, setQuestionnaireDetailAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { modal, showModal, skeleton } from '@/components';
import Radio from "@/pages/DetailInfo/radio.vue";
import Checkbox from "@/pages/DetailInfo/checkbox.vue";
import Fill from "@/pages/DetailInfo/fill.vue";
import TextArea from "@/pages/DetailInfo/textArea.vue";
import File from "@/pages/DetailInfo/file.vue";
import radio from "@/pages/DetailInfo/radio.vue";
import {SortableEvent, VueDraggable} from 'vue-draggable-plus'
import SkeletonCard from "@/pages/DetailInfo/skeletonCard.vue";

const selectedOption = ref(1);
const selectedNumber = ref(1);
const formData = ref();
const question = ref([]);
const title = ref();
const submitData = ref();
const id = ref<number>(14);
const reg = ref<string>('');
const regNum = ref("^[0-9]{1}$");
const time = ref();
const loading = ref(true)
const setting = reactive({
  isUnique: false,
  isOtherOptions: false,
  isRequired: false
})

// 用于获取问卷部分的容器元素
const questionnaireContainer = ref<HTMLDivElement>();

onMounted(() => {
  getInfo();
});

// Deep copy function
const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// 计算属性：动态生成正则表达式
const inputPattern = computed(() => {
  return `^[0-9]{${selectedNumber.value}}$`;
});

// 监听选项变化，更新输入框的验证规则
const updateInputPattern = () => {
  regNum.value = inputPattern.value;
  reg.value = inputPattern.value;
};

const getInfo = () => {
  useRequest(() => getQuestionnaireDetailAPI({ id: id.value }), {
    onSuccess(res) {
      if (res.code === 200) {
        console.log(res.data);
        const formDataCopy = deepCopy(res.data); // Use deep copy here
        if (formDataCopy.questions) {
          formDataCopy.questions.forEach((item) => {
            delete item.id;
          });
        }
        formData.value = formDataCopy;
        submitData.value = deepCopy(formData.value); // Deep copy to avoid reference issues
        title.value = res.data.title;
        question.value = submitData.value.questions;
        time.value = submitData.value.time
        loading.value = false
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error('获取失败，请重试' + e);
    },
  });
};

const addQuestion = () => {
  question.value.push({
    description: '',
    img: '',
    options: [{
      content: '',
      img: '',
      serial_num: 1
    },
      {
        content: '',
        img: '',
        serial_num: 2
      },
      {
        content: '',
        img: '',
        serial_num: 3
      },
    ],
    other_option: setting.isOtherOptions,
    question_type: selectedOption.value,
    reg: reg.value,
    required: setting.isRequired,
    serial_num: question.value.length + 1,
    subject: '',
    unique: setting.isUnique,
  });

  // 等待 DOM 更新完成后再执行滚动
  nextTick(() => {
    if (questionnaireContainer.value) {
      questionnaireContainer.value!.scrollTop = questionnaireContainer.value!.scrollHeight;
    }
  });
};

const cleanReg = () => {
  reg.value = '';
};
watch(selectedOption, cleanReg);

const deleteQuestion = (serial_num: number) => {
  console.log(serial_num);
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
  time.value = submitData.value.time
  console.log(question.value);
  ElNotification.success('成功放弃修改');
};

const submit = () => {
  submitData.value.time = time.value
  submitData.value.questions = question.value;
  console.log(question.value);

  useRequest(() => setQuestionnaireDetailAPI(submitData.value), {
    onSuccess(res) {
      if (res.code === 200 && res.msg === 'OK') {
        ElNotification.success('保存成功');
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error(e);
    }
  });
};

const onUpdate = () => {
  question.value.forEach((q, idx) => {
    q.serial_num = idx + 1;
  });
};

</script>

<style scoped>
</style>
