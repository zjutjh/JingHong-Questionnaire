import { reactive, Ref, ref } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { QuesItemType, QuesStatus, QuesType } from "@/utilities/coantantMap.ts";
function useInitializeSchema(surveyId: Ref<number>) {
  let schema = reactive({
    status: QuesStatus.DRAFT,
    surveyType: QuesType.SURVEY,
    baseConfig: {
      startTime: "",
      endTime: "",
      dayLimit: 0,
      verify: false
    },
    quesConfig: {
      title: "",
      desc: "",
      questionList: [
        {
          serialNum: 1,
          subject: "",
          description: "",
          img: "",
          quesSetting: {
            required: true,
            unique: false,
            otherOption: false,
            questionType: QuesItemType.RADIO,
            reg: "",
            maximumOption: 0,
            minimumOption: 0
          },
          options: [
            {
              serialNum: 1,
              content: "",
              img: "",
              description: ""
            },
            {
              serialNum: 2,
              content: "",
              img: "",
              description: ""
            }
          ]
        }
      ]
    }
  });
  async function getSchemaFromRemote() {
    useRequest(() => getQuestionnaireDetailAPI({ id: surveyId.value }), {
      onBefore: () => startLoading(),
      onSuccess(res: any) {
        if (res.code === 200) {
          schema = res.data;
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error("获取失败，请重试" + e);
      },
      onFinally: () => closeLoading()
    });
  }

  return {
    schema,
    getSchemaFromRemote
  };
}

function useQuestionListReducer(questionDataList: any) {
  function addQuestion({ question, index }: { question: any; index: number }) {
    questionDataList.value.splice(index, 0, question);
  }

  function deleteQuestion({ index }: { index: number }) {
    questionDataList.value.splice(index, 1);
  }

  return {
    addQuestion,
    deleteQuestion
  };
}

export const useEditStore = defineStore("edit", () => {
  const surveyId = ref(-1);
  const { schema, getSchemaFromRemote } = useInitializeSchema(surveyId);
  const questionDataList = schema.quesConfig.questionList;

  function setQuestionDataList(data: any) {
    schema.quesConfig.questionList = data;
  }

  function setSurveyId(id: number) {
    surveyId.value = id;
  }
  async function init() {
    await getSchemaFromRemote();
  }
  const { addQuestion, deleteQuestion } = useQuestionListReducer(
    questionDataList
  );

  return {
    addQuestion,
    deleteQuestion,
    setSurveyId,
    setQuestionDataList,
    init,
    schema,
    surveyId
  };
}, {
  persist: true
});