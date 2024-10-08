import { defineStore } from 'pinia'
import useLoginStore from './service/loginStore'
import useTempStore from './service/tempStore'
import use_darkmode_store from './service/dark_store'

export const useMainStore = defineStore(
  'main',
  () => {
    return {
      useLoginStore,
      useTempStore,
      use_darkmode_store
    }
  },
  { persist: true }
)
