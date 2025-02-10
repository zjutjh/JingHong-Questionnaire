<template>
  <div class="flex flex-col ">
    <div class="divider" />
    <div class="flex gap-20 my-10 justify-center">
      <span class="text-4xl break-all px-50">{{ props.title }}</span>
    </div>
    <div v-if="props.desc !== ''" class="items-top my-10 items-start mx-20">
      <div class="items-top my-10 items-start ">
        <pre class="text-gray-500 flex break-all text-xl dark:text-white dark:opacity-50">{{ props.desc }}</pre>
      </div>
    </div>
  </div>
  <div class="flex gap-20 items-center my-10  ml-20 ">
    <span class="text-red-950 dark:text-red-400 dark:opacity-80">截止时间:</span>
    <span>{{ time }}</span>
  </div>
  <div v-if="props.dailyLimit !== 0" class="flex gap-20 items-center my-10  ml-20 ">
    <span class=" dark:opacity-80 text-gray-700 dark:text-gray-400">本问卷每天最多提交 <span class="text-red-950 dark:text-red-400 dark:opacity-80">{{ props.dailyLimit }} </span> 次</span>
  </div>
  <div class="divider my-10" />
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string,
  desc: string,
  time: string,
  dailyLimit: string,

}>();
</script>

<style scoped>

</style>