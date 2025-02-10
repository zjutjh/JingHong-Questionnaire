<template>
  <div class="rounded mx-30 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span />
          <input type="text" placeholder="Question" class="input input-bordered shadow-md w-350">
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-50">问题描述</span>
          <textarea type="text" placeholder="Describe" class="textarea textarea-bordered shadow-md w-full h-70" />
        </div>
      </div>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>必答</span>
          <input type="checkbox" class="checkbox-sm" :disabled="true">
        </div>
      </div>
      <div class="flex gap-10 ">
        <span>唯一</span><input type="checkbox" :name="-1" class="checkbox-sm">
      </div>
    </div>
  </div>
  <div class="divider" />
  <div class="divider mt-100" />
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>