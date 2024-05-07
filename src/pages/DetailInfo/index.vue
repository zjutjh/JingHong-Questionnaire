<template>
<div class="flex justify-center items-start gap-130 h-screen mt-90">
  <div class="bg-gray-200 p-30 rounded-2xl shadow-lg w-220 hover:-translate-y-2 hover:shadow-2xl  transition transform duration-700">
<div class="text-2xl">添加问卷题目</div>
    <div class="p-20">
    <div class="flex-col justify-center items-center ">
    <div class="flex gap-10 my-5">
    <input type="radio" name="radio-1"  class="radio-sm" value="oneSelect" v-model="selectedOption" checked/>
      <span>单选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1"  class="radio-sm" value="select" v-model="selectedOption"/>
      <span>多选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1" class="radio-sm" value="fill" v-model="selectedOption"/>
      <span>填空</span>
    </div>
    </div>
      <div v-show="selectedOption === 'fill'">
      <div class="divider"></div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'" />
        <span>手机号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>邮箱</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>学号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === 'select'"/>
        <span>
          <el-select
              v-model="selectedNumber"
              placeholder="Select"
              size="small"
              style="width: 50px"
          >
      <el-option
          v-for="item in 15"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
          位数</span>
      </div>
    </div>
    </div>
    <div class="flex justify-center items-center ">
    <button class="btn btn-accent ">添加题目</button>
    </div>
  </div>
  <div class="bg-gray-200 w-700 h-400 p-40 shadow-lg rounded-2xl flex-col justify-center items-center hover:shadow-2xl hover:-translate-y-2 transform duration-700">
      <div class="flex items-end justify-center gap-90"><span class="text-4xl">标题:xxxxxx </span><span class="text-xl ">id:</span></div>
    <div class="divider"></div>
  </div>

</div>

</template>

<script setup lang="ts">
import {ref, watch} from "vue";

const selectedOption = ref('select')
const selectedNumber = ref(1)

</script>

<style scoped>

</style>