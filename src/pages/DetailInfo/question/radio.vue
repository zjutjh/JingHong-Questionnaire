<template>
  <div class="bg-base-200 dark:bg-customGray_shallow p-30 hover:shadow-md " :class="isActive? 'bg-base-300' : ''">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serialNum }}</span>
          <input
            v-if="isActive"
            v-model="localTitle"
            type="text"
            placeholder="Question"
            class="dark:bg-customGray_more_shallow input rounded-none h-40  focus:outline-none  w-350"
          >
          <div v-else>
            {{ localTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider" />
    <div class="flex-col p-5 overflow-y-auto h-180 mt-10" style="scroll-behavior: smooth;">
      <div v-for="item in localOptions" :key="item.serialNum" class="flex items-center gap-10 my-5">
        <input type="radio" :name="`${props.serialNum}`" class="radio-sm my-5">
        <input
          v-model="item.content"
          type="text"
          class="dark:bg-customGray_more_shallow input input-bordered h-40 shadow-md rounded-none focus:outline-none"
          placeholder="option"
        >
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img
              :key="item.img"
              :src="item.img"
              alt="Preview"
              style="max-width: 50px; max-height: 50px;"
            >
          </div>
          <input
            v-if="isActive"
            type="file"
            class="dark:bg-customGray_more_shallow file-input file-input-bordered file-input-sm w-7/12"
            @change="handleFileChange($event, item.serialNum)"
          >
        </div>
        <button v-if="isActive" class="btn btn-sm dark:bg-customGray_more_shallow dark:text-white shadow-md" @click="deleteOption(item.serialNum);">
          删除
        </button>
      </div>
    </div>
    <!-- <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center">
      <button class="btn btn-accent rounded-none shadow-md dark:opacity-75 dark:text-white" @click="addOption">
        新增选项
      </button>
      <button class="btn rounded-none dark:opacity-75 shadow-md dark:text-white " @click="$emit('on-click')">
        删除题目
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRequest } from "vue-hooks-plus";
import { saveImgAPI } from "@/apis";
import { ElNotification } from "element-plus";

const props = defineProps<{
  isActive: boolean,
  serialNum: number,
  title?: string,
  optionChoose: boolean,
  unique: boolean,
  otherOption: boolean,
  describe: string,
  options?: {
    content: string;
    img: string;
    serialNum: number;
  }[]
}>();

const emits = defineEmits(["update:unique", "on-click", "update:otherOption", "update:optionChoose", "update:title", "update:options", "update:describe"]);

const localTitle = ref<string>(props.title || "");
const localDescribe = ref<string>(props.describe || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : []);

const handleFileChange = async (event: Event, serialNum: number) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("img", file);

  const currentOption = localOptions.value.find(item => item.serialNum === serialNum);
  if (!currentOption) return;

  const originalImg = currentOption.img || "";

  useRequest(() => saveImgAPI(formData), {
    onSuccess(res: any) {
      if (res.code === 200) {

        currentOption.img = res.data;
        ElNotification.success("上传图片成功");
      } else {

        throw new Error(res.msg || "上传失败");
      }
    },
    onError(error: any) {

      currentOption.img = originalImg;
      input.value = "";
      ElNotification.error("上传图片失败：" + (error.message || error));
    }
  });
};

const deleteOption = (serialNum: number) => {
  localOptions.value = localOptions.value.filter(item => item.serialNum !== serialNum);
  localOptions.value.forEach((item) => {
    if (item.serialNum > serialNum) {
      item.serialNum -= 1;
    }
  });
};

// Watchers to sync local state with props
watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || "";
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
  localDescribe.value = newLocalDescribe;
});

// Emit updates to parent component
watch(localTitle, (newTitle) => {
  emits("update:title", newTitle);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits("update:optionChoose", newOptionChoose);
});

watch(localUnique, (newUnique) => {
  emits("update:unique", newUnique);
});

watch(localDescribe, (newLocalDescribe) => {
  emits("update:describe", newLocalDescribe);
});

watch(localOtherOption, (newOtherOption) => {
  emits("update:otherOption", newOtherOption);
});

watch(localOptions, (newOptions) => {
  emits("update:options", newOptions);
});

</script>

<style scoped>
</style>
