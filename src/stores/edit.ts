import { Ref, ref, toRef } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { QuesItemType, QuesStatus, QuesType } from "@/utilities/constMap.ts";
import { Question, Option } from "@/utilities/type.ts";
import { quesSettingMap } from "@/utilities/quesSettingMap.ts";

/**
 * 返回默认的问卷 schema
 */
function defaultSchema() {
  return {
    status: QuesStatus.DRAFT,
    surveyType: QuesType.SURVEY,
    baseConfig: {
      startTime: Date.now(),
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
            questionType: QuesItemType.RADIO
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
  const schema = ref(defaultSchema());
  const { run } = useRequest(() => getQuestionnaireDetailAPI({ id: surveyId.value }), {
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        schema.value = res.data;
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error("获取失败，请重试" + e);
    },
    onFinally: () => closeLoading()
  });
  async function getSchemaFromRemote() {
    if (surveyId.value === -1) return; // 新建问卷时不拉取远程数据
    run();
  }

  return {
    schema,
    getSchemaFromRemote
  };
}

function useQuestionListReducer(questionDataList: Ref<Question[]>) {
  function createQuestion(type: QuesItemType, serialNum: number): Question {
    const commonSettings = {
      serialNum,
      subject: "新问题",
      description: "",
      img: ""
    };

    const defaultOptions: Option[] = [
      { serialNum: 1, content: "选项1", img: "", description: "" },
      { serialNum: 2, content: "选项2", img: "", description: "" }
    ];

    if (!(type in quesSettingMap)) {
      throw new Error("未知的题目类型");
    }

    return {
      ...commonSettings,
      quesSetting: quesSettingMap[type],
      ...(type === QuesItemType.RADIO || type === QuesItemType.CHECKBOX ? { options: [...defaultOptions] } : {})
    } as Question;
  }

  function addQuestion(index: number, type: QuesItemType) {
    const newQuestion = createQuestion(type, index + 1);
    questionDataList.value.splice(index, 0, newQuestion);
  }

  function deleteQuestion(index: number) {
    questionDataList.value.splice(index, 1);
    questionDataList.value.forEach((q, idx) => {
      q.serialNum = idx + 1;
    });
  }

  return {
    addQuestion,
    deleteQuestion
  };
}

export const useEditStore = defineStore("edit", () => {
  const surveyId = ref(-1);
  const { schema, getSchemaFromRemote } = useInitializeSchema(surveyId);
  const questionDataList = toRef(schema.value.quesConfig, "questionList");
  /**
   * 重置 schema 以便用于新建问卷
   */
  function resetSchema() {
    schema.value = defaultSchema(); // 只重置 schema 的内容
    surveyId.value = -1; // 重新回到新建模式
  }

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

  return {
    addQuestion,
    deleteQuestion,
    setSurveyId,
    init,
    schema,
    surveyId
  };
}, {
  persist: true
});

export const useActiveStore = defineStore("active",() => {
  const activeSerial = ref(-1);
  return {
    activeSerial,
  }
})