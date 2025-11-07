<template>
  <div>
    <el-dialog v-model="imgVisible" width="25%" @close="closeImg()">
      <div class="flex justify-center items-center">
        <img :src="imgSrc" :key="imgSrc" class="large max-w-full h-auto center">
      </div>
      <!-- <div class="flex justify-end mt-30">
        <button class="btn bg-blue-500 dark-opacity-40 mr-20" @click="copyImgUrl()">复制链接</button>
        <button class="btn bg-blue-500 dark-opacity-40" @click="copyWholeImg()">复制图片</button>
      </div> -->
    </el-dialog>
    <table class="table">
      <thead>
        <tr>
          <th class="dark:text-white">
            序号
          </th>
          <th class="dark:text-white">
            时间
          </th>
          <th v-for="ans in answers" class="dark:text-white">
            {{ ans.title }}
            <el-tag
              v-if="type === QuesType.SURVEY"
              type="primary"
              size="small"
              class="ml-3"
            >
              {{ answersType.get(ans.question_type) }}
            </el-tag>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, index) in time" class="relative">
          <th>{{ index+1 }}</th>
          <th>{{ t }}</th>
          <th v-for="ans in answers">
            <div v-if="ans.question_type!==5">
              <overflow-panel :text="ans.answers[index]" />
            </div>
            <div v-else>
              <img
                :src="ans.answers[index]"
                :key="ans.answers[index]"
                class="w-16 h-auto md:w-24 lg:w-32"
                tabindex="0"
                @click="showImg(ans.answers[index])"
              >
            </div>
          </th>
          <th v-show="isDeleting" class="flex items-center absolute h-full py-0">
            <div
              class="btn hover:bg-red-500 hover:border-red-800 h-32 min-h-32 w-50 text-nowrap bg-red-400 border-red-500"
              @click="() => {
                answerIndexToDel = index;
                showModal('delAnswerConfirmModal');
              }"
            >
              删除
            </div>
          </th>
        </tr>
      </tbody>
    </table>
    <el-pagination
      :current-page="pageNum"
      layout="prev, pager, next"
      :page-count="totalPageNum"
      @current-change="handleCurrentChange"
    />
    <modal modal-id="delAnswerConfirmModal">
      <template #title>
        删除答卷
      </template>
      <template #default>
        将删除序号为<span class="text-red-500 px-3">{{ answerIndexToDel + 1 }}</span>的答卷
      </template>
      <template #action>
        <div class="btn btn-success w-80" @click="() => delAnswer(answerIds[answerIndexToDel])">
          确认
        </div>
      </template>
    </modal>
  </div>
</template>

<script setup lang="ts">
import { modal, showModal } from "@/components";
import { closeLoading, startLoading } from "@/utilities";
import { delAnswerAPI } from "@/apis";
import { ElNotification, ElPagination } from "element-plus";
import { getAnswersAPI } from "@/apis";
import { ref, watch } from "vue";
import { useMainStore } from "@/stores";
import { useRequest } from "vue-hooks-plus";
import overflowPanel from "./overflowPanel.vue";
import { QuesType } from "@/utilities/constMap.ts";

const tempStore = useMainStore().useTempStore();

const props = defineProps<{
  keyText: string,
  isUnique: boolean,
  isDeleting: boolean
}>();

const answersType = new Map([
  [1, "单选"],
  [2, "多选"],
  [3, "填空"],
  [4, "简答"],
  [5, "图片"]
]);

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
};

const pageNum = ref(1);
const totalPageNum = ref(2);
const pageSize = ref(10);
const answers = ref();
const answerIds = ref();
const answerIndexToDel = ref();
const time = ref();
const type = ref(QuesType.SURVEY);

const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize.value,
    text: props.keyText === "" ? undefined : props.keyText,
    unique: props.isUnique
  }), {
    debounceWait: 400,
    onSuccess(res: any) {
      if (res.code === 200) {
        totalPageNum.value = res.data.total_page_num;
        answers.value = res.data.answers_data.question_answers;
        time.value = res.data.answers_data.time;
        type.value = res.data.question_type;
        answerIds.value = res.data.answers_data.answer_ids;
      }
    },
    onError(e: any) {
      ElNotification.error("获取失败，请重试" + e);
    }
  });
};
getAnswers();

watch(props, getAnswers);

const delAnswer = (answer_id: string) => {
  useRequest(() => delAnswerAPI({ answer_id: answer_id }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        ElNotification("删除成功");
        getAnswers();
        showModal("delAnswerConfirmModal", true);
      }
    },
    onFinally: () => closeLoading()
  });
};

// 控制完整图显示
const imgVisible = ref(false);
const imgSrc = ref("");
const showImg = (src: string) => {
  // console.log("showImg")
  imgVisible.value = true;
  imgSrc.value = src;
};
const closeImg = () => {
  // console.log("closeImg")
  imgVisible.value = false;
  imgSrc.value = "";
};

// TODO: add image copy
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const copyImgUrl = async () => {
  try {
    await navigator.clipboard.writeText(imgSrc.value);
    ElNotification.success("复制成功");
  } catch {
    ElNotification.error("复制失败");
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const copyWholeImg = async () => {
  try {
    const response = await fetch(imgSrc.value); // 连接图片url
    const blob = await response.blob(); // 下载图片
    const tempItem = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([tempItem]);
    ElNotification.success("复制成功");
  } catch {
    ElNotification.error("复制失败");
  }
};
</script>