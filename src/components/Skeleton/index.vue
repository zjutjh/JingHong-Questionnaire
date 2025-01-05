<template>
  <div>
    <el-skeleton :rows="rowNumber" animated :loading="isLoading">
      <template #default>
        <slot />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  rowNumber: number,
  isLoading: boolean
}>();
</script>

<style scoped>

</style>
