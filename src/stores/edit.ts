import { reactive, Ref, ref, computed } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { QuesItemType, QuesStatus, QuesType } from "@/utilities/coantantMap.ts";
import { BaseConfig } from "@/utilities/type.ts";
/**
 * 返回默认的问卷 schema
 */
function defaultSchema() {
  return {
    status: QuesStatus.DRAFT,
    surveyType: QuesType.SURVEY,
    baseConfig: {
      startTime: new Date().toISOString(), // 新建时默认 startTime 为当前时间
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
  };
}
function useInitializeSchema(surveyId: Ref<number>) {
  const schema = reactive(defaultSchema());
  async function getSchemaFromRemote() {
    if (surveyId.value === -1) return; // 新建问卷时不拉取远程数据
    useRequest(() => getQuestionnaireDetailAPI({ id: surveyId.value }), {
      onBefore: () => startLoading(),
      onSuccess(res: any) {
        if (res.code === 200) {
          Object.assign(schema, res.data);
        } else {
          ElNotification.error(res.msg);
        }
      },
      onError(e) {
        ElNotification.error("获取失败，请重试" + e);
      },
      onFinally: () => closeLoading()
    }).run();
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

function useBaseConfigReducer(baseConfig: BaseConfig) {

  const getBaseConfig = computed(() => baseConfig);

  const updateBaseConfig = (key: keyof BaseConfig, value: any) => {
    Object.assign(baseConfig, { [key]: value });
  };

  const setBaseConfig = (newConfig: BaseConfig) => {
    Object.assign(baseConfig, newConfig);
  };

  return {
    getBaseConfig,
    updateBaseConfig,
    setBaseConfig

  };
}

export const useEditStore = defineStore("edit", () => {
  const surveyId = ref(-1);
  const { schema, getSchemaFromRemote } = useInitializeSchema(surveyId);
  const questionDataList = schema.quesConfig.questionList;
  const baseConfig = schema.baseConfig;
  function setQuestionDataList(data: any) {
    schema.quesConfig.questionList = data;
  }
  /**
   * 重置 schema 以便用于新建问卷
   */
  function resetSchema() {
    Object.assign(schema, defaultSchema()); // 只重置 schema 的内容
    surveyId.value = -1; // 重新回到新建模式
  }
  const getQuestionDataList = computed(() => schema.quesConfig.questionList);

  function setSurveyId(id: number) {
    surveyId.value = id;
  }
  async function init() {
    if (surveyId.value === -1) {
      resetSchema(); // 新建问卷时，重置 schema
    } else {
      await getSchemaFromRemote(); // 编辑问卷时，拉取远程数据
    }
  }
  const { addQuestion, deleteQuestion } = useQuestionListReducer(
    questionDataList
  );

  const { getBaseConfig, updateBaseConfig, setBaseConfig } = useBaseConfigReducer(baseConfig);

  return {
    addQuestion,
    deleteQuestion,
    setSurveyId,
    setQuestionDataList,
    getQuestionDataList,
    init,
    schema,
    surveyId,
    getBaseConfig,
    updateBaseConfig,
    setBaseConfig
  };
}, {
  persist: true
});