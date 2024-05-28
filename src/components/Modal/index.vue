<!--
# Modal组件
用于表现弹窗

## 用法
```template
<modal modal-id="idName">
  // slot
  <template #action>
    // slot action
  </template>
</modal>
```
```ts
import { modal, showModal } from '@/components';
showModal("idName") // 显示modal
showModal("idName", ture) // 关闭modal
```

## 属性
<modal
  modal-id="idName"
  noCloseBtn // 禁用关闭按钮
  centerBtn // 将按钮布局在中心
  ></modal>

!注意: 请留意id重叠的问题!
 -->
<template>
  <dialog :id="modalId" class="modal" >
    <div class="modal-box p-30" :class="gray ? 'bg-gray-300' : 'bg-indigo-100'">
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
import { showModal } from './showModal';

defineProps<{
  centerBtn?: boolean,
  modalId: string,
  gray?: boolean
}>();

</script>