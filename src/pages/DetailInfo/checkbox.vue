<template>
  <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <span class="flex items-center gap-20">
        <span>{{ serial_num }}</span>
        <input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" v-model="localTitle"/>
      </span>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10">
          <span>必答</span>
          <input type="checkbox" class="checkbox-sm" v-model="localOptionChoose"/>
        </div>
        <div class="flex gap-10">
          <span>唯一</span>
          <input type="checkbox" class="checkbox-sm" v-model="localUnique"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <span class="flex items-center justify-end gap-10">
      <span>有"其他"选项</span>
      <input type="checkbox" class="checkbox-sm" v-model="localOtherOption"/>
    </span>
    <div class="flex-col p-5 overflow-y-auto h-180 mt-10">
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <input type="checkbox" :name="item.serial_num" class="radio-sm my-5" />
        <input type="text" class="input input-bordered h-40 shadow-md" placeholder="option" v-model="item.content" />
        <button class="btn btn-error btn-sm shadow-md" @click="deleteOption(item.serial_num)">删除</button>
      </div>
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center">
      <button class="btn btn-accent shadow-md" @click="addOption">新增选项</button>
      <button class="btn btn-error shadow-md" @click="$emit('on-click')">删除题目</button>
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
  options?: {
    content: string;
    option_type: number;
    serial_num: number;
  }[]
}>();

const emits = defineEmits(['update:unique', 'on-click', 'update:otherOption', 'update:optionChoose','update:title','update:options']);

// Local copies of props to maintain reactivity
const localTitle = ref<string>(props.title || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : [{
  content: 'aaa',
  option_type: 1,
  serial_num: 1
}]);

// Watchers to sync local state with props
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

// Emit updates to parent component
watch(localTitle, (newTitle) => {
  emits('update:title', newTitle);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits('update:optionChoose', newOptionChoose);
});

watch(localUnique, (newUnique) => {
  emits('update:unique', newUnique);
});

watch(localOtherOption, (newOtherOption) => {
  emits('update:otherOption', newOtherOption);
});

watch(localOptions.value, (newOptions) => {
  console.log(newOptions);

  const rawOptions = newOptions.map(item => toRaw(item));

  console.log(rawOptions);

  emits('update:options', rawOptions);
});

const addOption = () => {
  localOptions.value.push({
    content: '',
    option_type: 1,
    serial_num: localOptions.value.length + 1
  });
};

const deleteOption = (serial_num: number) => {
  localOptions.value = localOptions.value.filter(item => item.serial_num !== serial_num);
  localOptions.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
    }
  });
};
</script>

<style scoped>
</style>
