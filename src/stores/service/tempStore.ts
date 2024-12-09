import { defineStore } from "pinia";
import { ref } from "vue";

const useTempStore = defineStore("temporary", () => {
    const checkId = ref();
    const setCheckId = (num: number) => {
      checkId.value = num;
    }
    const homePageNum = ref(1);
    const setHomePageNum = (num: number) => {
      homePageNum.value = num;
    }
    const checkTitle = ref();
    const setCheckTitle = (title: string) => {
      checkTitle.value = title;
    }
    const surveyId = ref(); // 投票问卷id -1为非投票问卷
    const setSurveyId = (id: number) => {
      surveyId.value = id;
    }

    const surveyType = ref(-1);
    const setSurveyType = (type: number) => {
      surveyType.value = type;
    }
    return{
        checkId,
        setCheckId,
        homePageNum,
        setHomePageNum,
        checkTitle,
        setCheckTitle,
        surveyType,
        setSurveyType,
        surveyId,
        setSurveyId,
    };
},{ persist: true });

export default useTempStore;