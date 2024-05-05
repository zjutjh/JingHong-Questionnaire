import { defineStore } from "pinia";
 import useLoginStore from "./service/loginStore";

export const useMainStore = defineStore("main", () => {
  return {
     useLoginStore,
  };
},{ persist: true });