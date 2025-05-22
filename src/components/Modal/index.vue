<template>
  <dialog :id="modalId" class="modal z-10">
    <div class="bg-gray-300 dark:bg-customGray_shallow modal-box" :class="{ 'bg-white': white, 'rounded-none': unRounded, 'pb-0 bt-[1rem]': noPb }">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 outline-none">
          ✕
        </button>
      </form>
      <span class="text-3xl font-bold">
        <slot name="title" />
      </span>
      <div class=" my-20 text-lg flex-warp ">
        <slot />
      </div>
      <div class="modal-action flex justify-end gap-10" :class="[centerBtn ? 'flex justify-center' : undefined]">
        <slot name="action" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">

defineProps<{
  centerBtn?: boolean,
  modalId: string,
  white?: boolean,
  unRounded?: boolean,
  noPb?: boolean,
}>();
</script>