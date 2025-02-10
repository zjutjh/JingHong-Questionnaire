<template>
  <div class="bg-base-100 flex-1" >
      {{ activeSerial }}
  </div>
</template>

<script setup lang="ts">
import { inject  } from "vue";

const activeSerial = inject("activeSerial")
</script>

<style scoped>

</style>