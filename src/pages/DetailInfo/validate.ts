import { ref } from "vue";
import { ElNotification } from "element-plus";

export function useValidator() {
  const titleError = ref<boolean>(false);
  const quesError = ref<boolean[]>([]);

  function titleValidator(title: string) {
    if (!title) {
      titleError.value = true;
      return false;
    } else {
      titleError.value = false;
      return true;
    };
  }

  function quesValidator(list: any) {
    let isError = false;
    quesError.value = new Array(list.length).fill(false);
    const subjects = new Set<string>();
    for (let i = 0; i < list.length; i++) {
      if (!list[i].subject || subjects.has(list[i].subject)) {
        quesError.value[i] = true;
        isError = true;
      } else subjects.add(list[i].subject);
    } return !isError;
  }

  function optsValidator(list: any) {
    let isError = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].options) {
        const contents = new Set();
        for (let j = 0; j < list[i].options.length; j++) {
          if (!list[i].options[j].content || contents.has(list[i].options[j].content)) {
            quesError.value[i] = true;
            isError = true;
          } else contents.add(list[i].options[j].content);
        }
      }
    }
    return !isError;
  }

  function timeValidator(startTime: string, endTime: string) {
    const getTime = (time: string) => {
      const data = new Date(time);
      return data.getTime();
    };
    if ((!startTime || !endTime) || (getTime(startTime) > getTime(endTime))) {
      return false;
    } else return true;
  }

  function allValidator(schema: any) {
    titleValidator(schema.quesConfig.title);
    const questionError = !quesValidator(schema.quesConfig.questionList);
    const optsError = !optsValidator(schema.quesConfig.questionList);
    const timeError = !timeValidator(schema.baseConfig.startTime, schema.baseConfig.endTime);
    let message = "";
    if (titleError.value) message += "标题未填写 ";
    if (questionError) message += "题目未填写或重复 ";
    if (optsError) message += "选项未填写或重复 ";
    if (timeError) message += "时间未设置或有误 ";
    if (titleError.value || questionError || optsError || timeError) {
      ElNotification.error(message);
      return false;
    } else {
      return true;
    }
  }

  function voteValidator(schema: any) {
    titleValidator(schema.quesConfig.title);
    const questionError = !quesValidator(schema.quesConfig.questionList[0].options);
    const timeError = !timeValidator(schema.baseConfig.startTime, schema.baseConfig.endTime);
    let message = "";
    if (titleError.value) message += "标题未填写 ";
    if (questionError) message += "内容未填写或重复 ";
    if (timeError) message += "时间未设置或有误 ";
    if (titleError.value || questionError || timeError) {
      ElNotification.error(message);
      return false;
    } else {
      return true;
    }
  }

  function deleteQuesError(index: number) {
    quesError.value.splice(index, 1);
  }

  return {
    titleError,
    quesError,
    allValidator,
    voteValidator,
    deleteQuesError
  };
}
