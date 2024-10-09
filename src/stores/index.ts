import { defineStore } from 'pinia'
import useLoginStore from './service/loginStore'
import useTempStore from './service/tempStore'
import useDarkModeStore from './service/darkStore'

export const useMainStore = defineStore(
  'main',
  () => {
    return {
      useLoginStore,
      useTempStore,
      useDarkModeStore
    }
  },
  { persist: true }
)
