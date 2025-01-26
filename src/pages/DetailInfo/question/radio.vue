<template>
  <div class="bg-base-200 dark:bg-customGray_shallow p-30 hover:shadow-md " :class="isActive? 'bg-base-300' : ''">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span>{{ serial_num }}</span>
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
        <div class="flex items-center gap-20 my-10">
          <span class="w-50">问题<br>描述</span>
          <textarea
            v-if="isActive"
            v-model="localDescribe"
            type="text"
            placeholder="Describe"
            class="dark:bg-customGray_more_shallow textarea rounded-none focus:outline-none textarea-bordered shadow-md w-full h-70"
            style="overflow-wrap: break-word;"
          />
          <div v-else>
            {{ localDescribe }}
          </div>
        </div>
      </div>
      <div class="flex-col justify-center items-center ">
        <div class="flex gap-10">
          <span>必答</span>
          <input v-model="localOptionChoose" type="checkbox" class="checkbox-sm">
        </div>
        <div class="flex gap-10">
          <span>唯一</span>
          <input v-model="localUnique" type="checkbox" class="checkbox-sm">
        </div>
      </div>
    </div>
    <div class="divider" />
    <span class="flex items-center justify-end gap-10">
      <span>有"其他"选项</span>
      <input v-model="localOtherOption" type="checkbox" class="checkbox-sm">
    </span>
    <div ref="scrollContainer" class="flex-col p-5 overflow-y-auto h-180 mt-10" style="scroll-behavior: smooth;">
      <div v-for="item in localOptions" :key="item.serial_num" class="flex items-center gap-10 my-5">
        <input type="radio" :name="props.serial_num" class="radio-sm my-5">
        <input
          v-model="item.content"
          type="text"
          class="dark:bg-customGray_more_shallow input input-bordered h-40 shadow-md rounded-none focus:outline-none"
          placeholder="option"
        >
        <div class="ml-10 flex items-center gap-20">
          <div v-if="item.img" class="mt-4">
            <img :src="item.img" alt="Preview" style="max-width: 50px; max-height: 50px;">
          </div>
          <input v-if="isActive" type="file" class="dark:bg-customGray_more_shallow file-input file-input-bordered file-input-sm w-7/12" @change="handleFileChange($event, item.serial_num)">
        </div>
        <button v-if="isActive" class="btn btn-sm dark:bg-customGray_more_shallow dark:text-white shadow-md" @click="deleteOption(item.serial_num);">
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
import { ref, watch, defineProps, defineEmits, nextTick } from "vue";
import { useRequest } from "vue-hooks-plus";
import { saveImgAPI } from "@/apis";
import { ElNotification } from "element-plus";

const props = defineProps<{
  isActive: boolean,
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

const emits = defineEmits(["update:unique", "on-click", "update:otherOption", "update:optionChoose", "update:title", "update:options", "update:describe"]);

const scrollContainer = ref<HTMLDivElement>();
const localTitle = ref<string>(props.title || "");
const localDescribe = ref<string>(props.describe || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localOptions = ref(props.options ? [...props.options] : []);

const handleFileChange = async (event, serial_num: number) => {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("img", file);
  useRequest(() => saveImgAPI(formData), {
    onSuccess(res) {
      const option = localOptions.value.find(item => item.serial_num === serial_num);
      if (option) {
        option.img = res.data;
      }
      ElNotification.success("上传图片成功");
    },
    onError(error) {
      ElNotification.error("上传图片失败" + error);
    }
  });
};

const addOption = () => {
  localOptions.value.push({
    content: "",
    img: "",
    serial_num: localOptions.value.length + 1
  });
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value!.scrollTop = scrollContainer.value!.scrollHeight;
    }
  });
  emits("update:options", localOptions);
};

const deleteOption = (serial_num: number) => {
  localOptions.value = localOptions.value.filter(item => item.serial_num !== serial_num);
  localOptions.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
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
