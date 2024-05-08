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
  <dialog :id="modalId" class="modal">
    <div class="modal-box p-30">
      <div>
        <slot></slot>
      </div>
      <div class="modal-action" :class="[centerBtn ? 'flex justify-center' : undefined]">
        <slot name="action"></slot>
        <button v-if="!noCloseBtn" class="btn btn-sm" @click="showModal(modalId, true)">关闭</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { showModal } from './showModal';

defineProps<{
  noCloseBtn?: boolean,
  centerBtn?: boolean,
  modalId: string,
}>();

</script>