import { Ref, ref, computed } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { QuesItemType, QuesStatus, QuesType } from "@/utilities/constMap.ts";
import { Question, Option } from "@/utilities/type.ts";
import { quesSettingMap } from "@/utilities/quesSettingMap.ts";
import { deepSnakeToCamel } from "@/utilities/deepSnakeToCamel.ts";
import { dayjs } from "element-plus";
import { cloneDeep } from "lodash-es";

/**
 * 返回默认的问卷 schema
 */
function defaultSchema() {
  return {
    status: QuesStatus.DRAFT,
    surveyType: QuesType.SURVEY,
    baseConfig: {
      startTime: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      endTime: dayjs().add(1, "week").format("YYYY-MM-DDTHH:mm:ssZ"),
      dayLimit: 0,
      verify: false,
      /** 是否仅本科生 */
      undergradOnly: false
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
            minimumOption: 1,
            maximumOption: 1,
            reg: "^.*$"
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
    manual: true,
    onBefore: () => startLoading(),
    onSuccess(res: any) {
      if (res.code === 200) {
        console.log("valueChanged");
        schema.value = deepSnakeToCamel(res.data);
      } else {
        ElNotification.error(res.msg);
      }
    },
    onError(e) {
      ElNotification.error("获取失败，请重试" + e);
    },
    onFinally: () => closeLoading()
  });
  function getSchemaFromRemote() {
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
    if (!(type in quesSettingMap)) {
      throw new Error("未知的题目类型");
    }

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

    return {
      ...commonSettings,
      quesSetting: cloneDeep(quesSettingMap[type]),
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

  function moveQuestion(index: number, action: "up" | "down") {
    const list = questionDataList.value;

    if (action === "up" && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      list[index].serialNum = index + 1;
      list[index - 1].serialNum = index;
    } else if (action === "down" && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      list[index].serialNum = index + 1;
      list[index + 1].serialNum = index + 2;
    }
  }

  return {
    addQuestion,
    deleteQuestion,
    moveQuestion
  };
}

export const useEditStore = defineStore("edit", () => {
  const surveyId = ref(-1);
  const { schema, getSchemaFromRemote } = useInitializeSchema(surveyId);
  const questionDataList = computed({
    get: () => schema.value.quesConfig.questionList,
    set: (val) => schema.value.quesConfig.questionList = val
  });
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
  function init() {
    console.log("Initializing...");
    if (surveyId.value === -1) {
      // resetSchema(); // 新建问卷时，重置 schema
    } else {
      getSchemaFromRemote(); // 编辑问卷时，拉取远程数据
    }
  }
  const { addQuestion, deleteQuestion, moveQuestion } = useQuestionListReducer(
    questionDataList
  );

  return {
    addQuestion,
    deleteQuestion,
    moveQuestion,
    resetSchema,
    setSurveyId,
    init,
    schema,
    surveyId,
    getSchemaFromRemote
  };
}, {
  persist: true
});

export const useActiveStore = defineStore("active", () => {
  const activeSerial = ref(-1);
  return {
    activeSerial
  };
});