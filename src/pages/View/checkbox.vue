<template>
  <div class="bg-gray-50 p-30  my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serial_num }}</span>
          <span>{{ localTitle }}</span>
        </div>
        <div class="flex items-center gap-20 my-10">
          <span class="w-80">问题描述  | </span>
          <span v-if="localDescribe" class="w-150">{{ localDescribe }}</span>
          <span v-if="!localDescribe" class="w-150">此问题没有描述</span>
        </div>
      </div>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10">
          <span v-if="localOptionChoose">必答</span>
        </div>
        <div class="flex gap-10">
          <span v-if="localUnique">唯一</span>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="flex-col p-5 h-auto mt-10" >
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-20 my-15">
        <input type="checkbox" :name="item.serial_num" class="checkbox-sm my-5" />
        <span v-if="item.content">{{item.content}}</span>
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img v-if="item.img" :src="item.img" alt="Preview" style="max-width: 150px; max-height: 150px;" />
          </div>
        </div>
      </div>
      <div class="flex gap-10">
        <input type="checkbox" class="checkbox-sm my-5" />
        <input v-if="!localOtherOption" type="text" class="input input-bordered h-40 shadow-md"  placeholder="其他" v-model="otherContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits, toRaw} from 'vue';

const props = defineProps<{
  serial_num: number,
  title?: string,
  optionChoose: boolean,
  unique: boolean,
  otherOption: boolean,
  describe: string,
  options?: {
    content: string;
    img: string;
    serial_num: number;
  }[]
}>();

const emits = defineEmits(['update:unique', 'on-click', 'update:otherOption', 'update:optionChoose','update:title','update:options','update:describe']);

// Local copies of props to maintain reactivity
const localTitle = ref<string>(props.title || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localDescribe = ref<string>(props.describe || '');
const localOptions = ref(props.options );

const otherContent = ref<string>();

watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || '';
});

watch(() => props.optionChoose, (newOptionChoose) => {
  localOptionChoose.value = newOptionChoose;
});

watch(() => props.unique, (newUnique) => {
  localUnique.value = newUnique;
});

watch(() => props.otherOption, (newOtherOption) => {
  localOtherOption.value = newOtherOption;
});

watch(() => props.options, (newOptions) => {
  localOptions.value = newOptions ? newOptions : [];
});

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe
});

// Emit updates to parent component
watch(localOptions, (newOptions) => {
  const multiSelectedOptions = newOptions.filter(item => item.selected);

  // 在这里处理多选的选项，可以将选项存储到一个新的数组中或者执行其他逻辑
  console.log('多选的选项：', multiSelectedOptions);
});

</script>

<style scoped>
</style>
