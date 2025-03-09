<template>
  <div class="text-lg font-bold">
    {{ props.quesSort }}
  </div>
  <div class="flex justify-start mt-10 gap-0">
    <slot />
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  quesSort: string
}>();
</script>

<style scoped>

</style>