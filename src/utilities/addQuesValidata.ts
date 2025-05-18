import { ref } from "vue";
import { ElNotification } from "element-plus";

export const titleError = ref(false);
const isValidataTitle = ref(false);

export const quesError = ref<boolean[]>([]);
const quesContentList = ref<string[]>([]);
const isQuesError = ref(false);
const isValidataQues = ref(false);

const optionContentList = ref<string[]>([]);
const isOptionError = ref(false);
const isValidataOption = ref(false);

export const voteError = ref<boolean[]>([]);
const voteContentList = ref<string[]>([]);
const isVoteError = ref(false);
const isValidataVote = ref(false);

export const timeError = ref(false);
const isValidataTime = ref(false);

// 检验标题
export const validataTitle = (title: string) => {
  if (title.length === 0) {
    ElNotification.error("标题不能为空");
    titleError.value = true;
  } else {
    titleError.value = false;
  };
  isValidataTitle.value = true;
};

// 检验问题
const validataList = (Error, isError, contentList, isValidata, text: string, index: number) => {
  if (!text) {
    ElNotification.error("内容不能为空");
    Error.value[index] = true;
    isError.value = true;
  } else if (contentList.value.find((item, i) => i !== index && item === text) !== undefined) {
    ElNotification.error("内容不能重复");
    Error.value[index] = true;
    isError.value = true;
  } else {
    contentList.value[index] = text;
    Error.value[index] = false;
    isError.value = false;
  }
  isValidata.value = true;
};

// 校验题目
export const validataQuestion = (text: string, index: number) => {
  validataList(quesError, isQuesError, quesContentList, isValidataQues, text, index);
};

// 检验选项
export const validataOptionsList = (loaclOptions) => {
  if (loaclOptions.length === 1) {
    return false;
  } else {
    return true;
  }
};
export const validataOptions = (text: string, index: number) => {
  if (!text) {
    ElNotification.error("内容不能为空");
    isOptionError.value = true;
  } else if (optionContentList.value.find((item, i) => i !== index && item === text) !== undefined) {
    ElNotification.error("内容不能重复");
    isOptionError.value = true;
  } else {
    optionContentList.value[index] = text;
  }
  isValidataOption.value = true;
};

// 校验投票
export const validataVote = (text: string, index: number) => {
  validataList(voteError, isVoteError, voteContentList, isValidataVote, text, index);
};

// 检验时间
const getTime = (time: string) => {
  const data = new Date(time);
  return data.getTime();
};
const now = new Date();
const nowData = now.getTime();

export const validataStarttime = (starttime: string, endtime: string) => {
  const startTimeData = getTime(starttime);
  const endTimeData = getTime(endtime);
  if (!startTimeData) {
    ElNotification.error("开始时间不能为空");
    timeError.value = true;
  } else if ((nowData - startTimeData) > 30000) {
    ElNotification.error("开始时间不能小于现在时间");
    timeError.value = true;
  } else if (endTimeData && (endTimeData - startTimeData) < 0) {
    ElNotification.error("开始时间不能大于结束时间");
    timeError.value = true;
  } else if (endTimeData && (endTimeData - startTimeData) < 60000) {
    ElNotification.error("有效期不能小于1分钟");
    timeError.value = true;
  } else {
    timeError.value = false;
  }
  isValidataTime.value = true;
};
export const validataEndtime = (starttime: string, endtime: string) => {
  const startTimeData = getTime(starttime);
  const endTimeData = getTime(endtime);
  if (!endTimeData) {
    ElNotification.error("结束时间不能为空");
    timeError.value = true;
  } else if ((!startTimeData) && (endTimeData - nowData) < -30000) {
    ElNotification.error("结束时间不能小于当前时间");
    timeError.value = true;
  } else if ((endTimeData - startTimeData) < 0) {
    ElNotification.error("结束时间不能小于开始时间");
    timeError.value = true;
  } else if (startTimeData && (endTimeData - startTimeData) < 60000) {
    ElNotification.error("有效期不能小于1分钟");
    timeError.value = true;
  } else {
    timeError.value = false;
  }
  isValidataTime.value = true;
};

// 发布问卷的总校验
export const validataQues = () => {
  if (!isValidataTitle.value || titleError.value) {
    ElNotification.error("问卷标题不能为空");
    return false;
  } else if (!isValidataQues.value || isQuesError.value) {
    ElNotification.error("问题不能为空");
    return false;
  } else if (!isValidataOption.value || isOptionError.value) {
    ElNotification.error("选项设置有误");
    return false;
  } else if (!isValidataTime.value || timeError.value) {
    ElNotification.error("时间设置有误");
    return false;
  } else {
    return true;
  }
};