<template>
  <div class="bg-base-100 dark:bg-[#1A1A1A] flex-1 ">
    <div class="flex items-center">
      <div class="text-md flex-1 h-40 text-red-400 flex justify-center items-center cursor-pointer">
        题型选择
      </div>
      <div class="text-md flex-1 text-gray-600 bg-base-200 flex h-40 justify-center items-center cursor-not-allowed dark:bg-customGray_shallow dark:text-white">
        敬请期待
      </div>
    </div>
    <div class="flex flex-col justify-center p-20">
      <add-ques-button-panel ques-sort="输入类题型">
        <add-ques-button text="单行输入框" type="3">
          <img src="@/assets/input.svg" class="h-25 w-25">
        </add-ques-button>
        <add-ques-button text="多行输入框" type="4">
          <img src="@/assets/textarea.svg" class="h-25 w-25">
        </add-ques-button>
      </add-ques-button-panel>
      <el-divider />
      <add-ques-button-panel ques-sort="选择类题型">
        <add-ques-button text="单项选择" type="1">
          <img src="@/assets/radio.svg" class="h-25 w-25">
        </add-ques-button>
        <add-ques-button text="多项选择" type="2">
          <img src="@/assets/checkbox.svg" class="h-25 w-25">
        </add-ques-button>
        <!--        <add-ques-button text="投票" type="6">-->
        <!--          <img src="@/assets/vote.svg" class="h-25 w-25">-->
        <!--        </add-ques-button>-->
      </add-ques-button-panel>
      <el-divider />
      <add-ques-button-panel ques-sort="上传类题型">
        <add-ques-button text="上传图片" type="5">
          <img src="@/assets/uploadPic.svg" class="h-25 w-25">
        </add-ques-button>
      </add-ques-button-panel>
    </div>
  </div>
</template>

<script setup lang="ts">

import AddQuesButtonPanel from "@/pages/DetailInfo/addQuesButtonPanel.vue";
import AddQuesButton from "@/pages/DetailInfo/question/addQuesButton.vue";
</script>

<style scoped>

</style>
