
<template>
  <div class="bg-sky-100 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span></span>
          <input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" />
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-80">问题描述  | </span>
          <span v-if="localDescribe" class="w-150">{{ localDescribe }}</span>
          <span v-if="!localDescribe" class="w-150">此问卷没有描述</span>
        </div>
      </div>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>选答</span><input type="checkbox" :name=-1  class="checkbox-sm" />
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm" />
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="divider mt-100"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error shadow-md" >删除题目</button>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>