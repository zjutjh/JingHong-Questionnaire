<template>
  <div>
    <el-dialog v-model="imgVisible" @close = "closeImg()" width="25%">
      <div class="flex justify-center items-center">
        <img :src="imgSrc" class="large max-w-full h-auto center">
      </div>
      <!-- <div class="flex justify-end mt-30">
        <button class="btn bg-blue-500 dark-opacity-40 mr-20" @click="copyImgUrl()">复制链接</button>
        <button class="btn bg-blue-500 dark-opacity-40" @click="copyWholeImg()">复制图片</button>
      </div> -->
    </el-dialog>
    <table class="table">
      <thead>
        <tr>
          <th class="dark:text-white">序号</th>
          <th class="dark:text-white">时间</th>
          <th v-for="ans in answers" class="dark:text-white">
            {{ ans.title }}
            <el-tag type="primary" size="small" class="ml-3" >{{ answersType.get(ans.question_type) }}</el-tag>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(t, index) in time">
          <th>{{ index+1 }}</th>
          <th>{{ t }}</th>
          <th   v-for="ans in answers">
            <div v-if="ans.question_type!==5">
              <overflow-panel :text="ans.answers[index]"/>
            </div>
            <div v-else>
                <img :src="ans.answers[index]" class="w-16 h-auto md:w-24 lg:w-32"
                tabindex="0" @click="showImg(ans.answers[index])">
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
  </div>
</template>

<script setup lang="ts">
import {ElNotification, ElPagination} from 'element-plus';
import { getAnswersAPI } from '@/apis';
import { ref, watch } from 'vue';
import { useMainStore } from '@/stores';
import { useRequest } from 'vue-hooks-plus';
import overflowPanel from './overflowPanel.vue';

const tempStore = useMainStore().useTempStore();

const props = defineProps<{
  keyText: string,
  isUnique: boolean,
}>();

const answersType = new Map([
  [1, '单选'],
  [2, '多选'],
  [3, '填空'],
  [4, '简答'],
  [5, '图片'],
]);

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  getAnswers();
}

const pageNum = ref(1);
const totalPageNum = ref(2);
const pageSize = ref(10);
const answers = ref();
const time = ref();

const getAnswers = () => {
  useRequest(() => getAnswersAPI({
    id: tempStore.checkId,
    page_num: pageNum.value,
    page_size: pageSize.value,
    text: props.keyText === "" ? undefined : props.keyText,
    unique: props.isUnique,
  }), {
    debounceWait: 400,
    onSuccess(res: any) {
      console.log(res);
      if(res.code === 200) {
        totalPageNum.value = res.data.total_page_num;
        answers.value = res.data.answers_data.question_answers;
        time.value = res.data.answers_data.time;
      }
    },
    onError(e: any) {
      ElNotification.error('获取失败，请重试' + e);
    },
  })
}
getAnswers();

watch(props, getAnswers);

//控制完整图显示
const imgVisible = ref(false)
const imgSrc = ref('')
const showImg = (src:string) => {
  // console.log("showImg")
  imgVisible.value = true 
  imgSrc.value = src
}
const closeImg = () => {
  // console.log("closeImg")
  imgVisible.value = false
  imgSrc.value = ''
}

const copyImgUrl = async() => {
  try{
    await navigator.clipboard.writeText(imgSrc.value)
    ElNotification.success('复制成功')
  }catch{
    ElNotification.error('复制失败')
  }
}

const copyWholeImg = async() => {
  try{
    const response = await fetch(imgSrc.value) //连接图片url
    const blob = await response.blob() //下载图片
    const tempItem = new ClipboardItem({[blob.type]:blob})
    await navigator.clipboard.write([tempItem])
    ElNotification.success('复制成功')
  }catch{
    ElNotification.error('复制失败')
  }
}
</script>