<template>
  <div class="bg-sky-100 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20 my-10">
          <span class="w-80">问题描述  | </span>
          <span v-if="localDescribe" class="w-150">{{ localDescribe }}</span>
          <span v-if="!localDescribe" class="w-150">此问卷没有描述</span>
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
    <div class="flex-col p-5 overflow-y-auto h-180 mt-10" ref="scrollContainer" style="scroll-behavior: smooth;" >
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <input type="checkbox" :name="item.serial_num" class="checkbox-sm my-5" />
        <input type="text" class="input input-bordered h-40 shadow-md" placeholder="option" v-model="item.content" />
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img :src="item.img" alt="Preview" style="max-width: 50px; max-height: 50px;" />
          </div>
          <input type="file" class="file-input file-input-bordered file-input-sm w-7/12" @change="handleFileChange($event, item.serial_num)" />
        </div>
      </div>
      <div class="flex gap-10">
      <span>其他</span>
      <input v-if="!localOtherOption" type="text" class="input input-bordered h-40 shadow-md"  placeholder="option" v-model="localOtherOption" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits, toRaw} from 'vue';
import {useRequest} from "vue-hooks-plus";
import {saveImgAPI} from "@/apis";
import {ElNotification} from "element-plus";

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

const scrollContainer = ref<HTMLDivElement>()
const emits = defineEmits(['update:unique', 'on-click', 'update:otherOption', 'update:optionChoose','update:title','update:options','update:describe']);

// Local copies of props to maintain reactivity
const localTitle = ref<string>(props.title || '');
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localDescribe = ref<string>(props.describe || '');
const localOptions = ref(props.options );

const handleFileChange = async (event, serial_num: number) => {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('img', file);
  useRequest(() => saveImgAPI(formData), {
    onSuccess(res) {
      const option = localOptions.value.find(item => item.serial_num === serial_num);
      if (option) {
        option.img = res.data;
      }
      ElNotification.success('上传图片成功')
    },
    onError(error) {
      ElNotification.error("上传图片失败"+ error);
    }
  });
};
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

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe
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

watch(localDescribe, (newLocalDescribe) => {
  emits('update:describe', newLocalDescribe);
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

</script>

<style scoped>
</style>
