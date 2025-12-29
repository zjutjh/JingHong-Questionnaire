import { Ref, ref, computed } from "vue";
import { useRequest } from "vue-hooks-plus";
import { getQuestionnaireDetailAPI } from "@/apis";
import { closeLoading, startLoading } from "@/utilities";
import { ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { deepSnakeToCamel } from "@/utilities/deepSnakeToCamel.ts";
import { dayjs } from "element-plus";
import { QuesStatus, QuesType } from "@/utilities/constMap";

const VOTE = 1;
/**
 * 返回默认的问卷 schema
 */
function defaultSchema() {
  return {
    status: QuesStatus.DRAFT,
    surveyType: QuesType.VOTE,
    baseConfig: {
      startTime: dayjs().format("YYYY-MM-DDTHH:mm:ssZ"),
      endTime: dayjs().add(1, "week").format("YYYY-MM-DDTHH:mm:ssZ"),
      dayLimit: 1,
      verify: false,
      sumLimit: 1,
      undergradOnly: false // 是否仅本科生
    },
    quesConfig: {
      title: "投票标题",
      desc: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，期待您的参与！",
      questionList: [
        {
          serialNum: 1,
          subject: "投票",
          description: "",
          img: "",
          quesSetting: {
            required: true,
            unique: false,
            otherOption: false,
            questionType: VOTE,
            minimumOption: 1,
            maximumOption: 1
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
            },
            {
              serialNum: 3,
              content: "",
              img: "",
              description: ""
            },
            {
              serialNum: 4,
              content: "",
              img: "",
              description: ""
            },
            {
              serialNum: 5,
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
function useInitializeSchema(voteId: Ref<number>) {
  const schema = ref(defaultSchema());
  const { run } = useRequest(() => getQuestionnaireDetailAPI({ id: voteId.value }), {
    manual: true,
    onBefore: startLoading,
    onSuccess(res: any) {
      res.code === 200
        ? Object.assign(schema.value, deepSnakeToCamel(res.data))
        : ElNotification.error(res.msg);
    },
    onError(e) {
      ElNotification.error("获取失败，请重试" + e);
    },
    onFinally: closeLoading
  });
  function getSchemaFromRemote() {
    if (voteId.value !== -1) run(); // 新建问卷时不拉取远程数据
  }

  return { schema, getSchemaFromRemote };
}

export const useEditVoteStore = defineStore("voteEdit", () => {
  const voteId = ref(-1);
  const { schema, getSchemaFromRemote } = useInitializeSchema(voteId);
  const computedSchema = computed(() => schema.value);
  /**
   * 重置 schema 以便用于新建问卷
   */
  function resetSchema() {
    Object.assign(schema.value, defaultSchema());
    voteId.value = -1;
  }

  function setVoteId(id: number) {
    voteId.value = id;
  }
  function initVote() {
    if (voteId.value === -1) {
      // resetSchema(); // 新建问卷时，重置 schema
    } else {
      getSchemaFromRemote(); // 编辑问卷时，拉取远程数据
    }
  }

  return {
    resetSchema,
    setVoteId,
    initVote,
    schema: computedSchema,
    voteId,
    getSchemaFromRemote
  };
}, { persist: true });

export const useActiveStore = defineStore("active", () => {
  const activeSerial = ref(-1);
  return { activeSerial };
});