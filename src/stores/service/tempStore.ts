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

    return{
        checkId,
        setCheckId,
        homePageNum,
        setHomePageNum,
    };
});

export default useTempStore;