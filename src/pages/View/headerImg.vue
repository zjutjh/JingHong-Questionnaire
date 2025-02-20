<template>
  <div class="flex justify-center">
    <div class="absolute top-0 right-4 z-10">
      <button
        class="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300"
        @click="switchDarkMode"
      >
        <span v-if="!darkModeStatus">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-50 w-50 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h1m-16 0H3m15.364-7.364l-.707.707M6.636 17.364l-.707.707m12.728-12.728l-.707.707M6.636 6.636l-.707-.707M12 15.5A3.5 3.5 0 1 0 12 8.5A3.5 3.5 0 0 0 12 15.5z"
            />
          </svg>
        </span>
        <span v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-60 w-60 text-customGray_more_shallow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 3c0 6.627 0 12 0 12a6 6 0 1 1 0-12z" />
          </svg>
        </span>
      </button>
    </div>

    <el-image class="w-2/3" src="https://img.lonesome.cn/jhwl/project/questionnaire/jxh_logo.webp" />
  </div>
</template>

<script setup lang="ts">
import { useDarkModeSwitch } from "@/utilities/darkModeSwitch.ts";

const { darkModeStatus, switchDarkMode } = useDarkModeSwitch();
</script>

<style scoped>

</style>