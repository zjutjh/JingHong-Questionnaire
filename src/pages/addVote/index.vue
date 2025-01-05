
<template>
  <div class="flex items-center flex-col ">
    <el-radio-group v-model="state" class="p-20">
      <el-radio-button label="投票编辑" value="投票编辑" />
      <el-radio-button label="投票设置" value="投票设置" />
    </el-radio-group>
    <div class="bg-base-200 w-[50%] flex-1 overflow-y-auto flex flex-col justify-center">
      <div class="p-20">
        <div class="flex justify-center items-center flex-col gap-10">
          <input v-model="submitForm.voteTitle" class="input bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-2xl w-[80%] text-center" placeholder="投票标题">
          <textarea v-model="submitForm.description" class=" textarea bg-base-200 flex focus:bg-base-100 hover:border-gray-300 text-md w-[80%] resize-none" placeholder="投票描述" />
        </div>
      </div>
      <vote />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Vote from "./vote.vue";
const state = ref("投票编辑");
const submitForm = ref({
  voteTitle: "投票标题",
  description: "为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，期待您的参与！"
});

</script>

<style scoped>

</style>