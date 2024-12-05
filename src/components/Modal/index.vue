<template>
  <dialog :id="modalId" class="modal" >
    <div class="bg-gray-300 dark:bg-customGray_shallow modal-box p-30" >
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none">✕</button>
      </form>
      <span class="text-3xl font-bold">
        <slot name="title" ></slot>
      </span>
      <div class="  my-20 text-lg flex-warp ">
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
</script>