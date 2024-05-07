<template>
<div class="flex justify-center items-center gap-70 h-screen">
  <div class="bg-gray-200 p-30 rounded-2xl shadow-lg h-450 w-220">
<div class="text-2xl">添加问卷题目</div>
    <div class="p-20">
    <div class="flex-col justify-center items-center ">
    <div class="flex gap-10 my-5">
    <input type="radio" name="radio-1"  class="radio-sm" value="1" v-model="selectedOption" checked/>
      <span>单选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1"  class="radio-sm" value="1" v-model="selectedOption"/>
      <span>多选</span>
    </div>
    <div class="flex gap-10 my-5">
      <input type="radio" name="radio-1" class="radio-sm" value="0" v-model="selectedOption"/>
      <span>填空</span>
    </div>
    </div>
      <!-- 渲染下部分元素 -->
      <div class="divider"></div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === '1'" />
        <span>手机号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === '1'"/>
        <span>邮箱</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === '1'"/>
        <span>学号</span>
      </div>
      <div class="flex gap-10 my-5">
        <input type="radio" name="radio-2" class="radio-sm" :disabled="selectedOption === '1'"/>
        <span>
          <select class="select-xs w-5 h-5">
            <option disabled selected>选择位数</option>
            <option v-for="item in 15" >{{ item }}</option>
          </select>
          位数</span>
      </div>
    </div>
    <div class="flex justify-center items-center ">
    <button class="btn btn-accent ">添加题目</button>
    </div>
  </div>
  <div class="bg-gray-200">
aaaa
  </div>
</div>
</template>

<script setup lang="ts">
import {ref} from "vue";

const selectedOption = ref('1')
</script>

<style scoped>

</style>