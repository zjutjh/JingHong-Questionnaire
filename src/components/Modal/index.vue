<template>
  <dialog :id="modalId" class="modal" >
    <div class="modal-box p-30" 
    :class=" gray ? (darkmode_store.status ? 'bg-customGray_shallow' : 'bg-gray-300') : (darkmode_store.status ? 'bg-customGray_shallow' : 'bg-red-50')" >
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ">✕</button>
      </form>
      <span class="text-3xl font-bold">
        <slot name="title" ></slot>
      </span>
      <div class="flex items-center my-20 text-lg">
        <slot></slot>
      </div>
      <div class="modal-action flex justify-end gap-10" :class="[centerBtn ? 'flex justify-center' : undefined]">
        <slot name="action"></slot>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">

defineProps<{
  centerBtn?: boolean,
  modalId: string,
  gray?: boolean,
}>();


//深色模式
import { useMainStore } from "@/stores";
const darkmode_store = useMainStore().use_darkmode_store()

</script>