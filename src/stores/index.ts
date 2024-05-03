import { defineStore } from "pinia";
// import useExampleStore from "./service/exampleStore";

export const useMainStore = defineStore("main", () => {
  return {
    // useExampleStore,
  };
},{ persist: true });