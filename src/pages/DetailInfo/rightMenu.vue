<template>
  <div class="bg-base-100 flex-1" >
      {{ activeSerial }}
  </div>
</template>

<script setup lang="ts">
import { toRefs  } from "vue";
import { useActiveStore } from "@/stores/edit";
import { useEditStore } from "@/stores/edit";

const {activeSerial} = toRefs(useActiveStore())
</script>

<style scoped>

</style>