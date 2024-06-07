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

    return{
        checkId,
        setCheckId,
        homePageNum,
        setHomePageNum,
        checkTitle,
        setCheckTitle,
    };
});

export default useTempStore;