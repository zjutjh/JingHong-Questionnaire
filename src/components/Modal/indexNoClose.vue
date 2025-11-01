<template>
  <dialog
    :id="modalId"
    class="modal z-10"
    @cancel.prevent
    @click.self="onBackdrop"
  >
    <div
      class="bg-gray-300 dark:bg-customGray_shallow modal-box"
      :class="{ 'bg-white': white, 'rounded-none': unRounded, 'pb-0 bt-[1rem]': noPb }"
    >
      <!-- ❶ 无 form → 无 ✕ 按钮 -->
      <span class="text-3xl font-bold"><slot name="title" /></span>
      <div class="my-20 text-lg flex-wrap">
        <slot />
      </div>
      <div
        class="modal-action flex justify-end gap-10"
        :class="[centerBtn ? 'justify-center' : undefined]"
      >
        <slot name="action" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  centerBtn?: boolean
  modalId: string
  white?: boolean
  unRounded?: boolean
  noPb?: boolean
}>();

/* 拦背景点击关闭 */
const onBackdrop = (e: Event) => {
  if (e.target === e.currentTarget) e.preventDefault();
};

// 拦截 Esc（捕获阶段），只在对应 dialog.open 时阻止默认关闭行为
let _escHandler: (e: KeyboardEvent) => void;
onMounted(() => {
  _escHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Esc") {
      const dialog = document.getElementById(props.modalId) as HTMLDialogElement | null;
      if (dialog && dialog.open) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };
  // 使用捕获阶段以优先拦截浏览器默认行为
  document.addEventListener("keydown", _escHandler, true);
});

onBeforeUnmount(() => {
  if (_escHandler) document.removeEventListener("keydown", _escHandler, true);
});
</script>