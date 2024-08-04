import { defineStore } from 'pinia'
import useLoginStore from './service/loginStore'
import useTempStore from './service/tempStore'

export const useMainStore = defineStore(
  'main',
  () => {
    return {
      useLoginStore,
      useTempStore,
    }
  },
  { persist: true }
)
