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
            class="rounded-none focus:outline-none dark:bg-customGray_more_shallow input input-bordered shadow-md w-350"
          >
          <div v-else class="w-350">
            {{ localTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider" />
    <div ref="scrollContainer" class="flex-col p-5 overflow-y-auto h-180 mt-10" style="scroll-behavior: smooth;">
      <div v-for="item in localOptions" :key="item.serial_num" class="my-5">
        <div class="flex items-center gap-10">
          <input type="checkbox" :name="item.serial_num" class="checkbox-sm my-5">
          <input
            v-model="item.content"
            type="text"
            class="rounded-none focus:outline-none dark:bg-customGray_more_shallow input input-bordered h-40 shadow-md"
            placeholder="option"
          >
          <div class="ml-10 flex items-center gap-20">
            <div v-if="item.img" class="mt-4">
              <img :src="item.img" alt="Preview" style="max-width: 50px; max-height: 50px;">
            </div>
            <input
              v-if="isActive"
              type="file"
              class="dark:bg-customGray_more_shallow file-input file-input-bordered file-input-sm w-7/12"
              @change="handleFileChange($event, item.serial_num)"
            >
          </div>
          <button v-if="isActive" class="btn dark:bg-customGray_more_shallow dark:text-white btn-sm shadow-md" @click="deleteOption(item.serial_num)">
            删除
          </button>
        </div>
      </div>
    </div>
    <!-- <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center">
      <button class="btn btn-accent dark:opacity-75 shadow-md dark:text-white" @click="addOption">
        新增选项
      </button>
      <button class="btn btn-error dark:opacity-75 shadow-md dark:text-white" @click="$emit('on-click')">
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
  maximum_option: number,
  minimum_option: number,
  options?: {
    content: string;
    img: string;
    serial_num: number;
  }[]
}>();

const scrollContainer = ref<HTMLDivElement>();
const emits = defineEmits(["update:unique", "on-click", "update:otherOption", "update:optionChoose", "update:title", "update:options", "update:describe"]);

// Local copies of props to maintain reactivity
const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localOtherOption = ref<boolean>(props.otherOption);
const localDescribe = ref<string>(props.describe || "");
const localOptions = ref(props.options);
const localMax = ref(props.maximum_option);
const localMin = ref(props.minimum_option);

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
// Watchers to sync local state with props

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
};

const deleteOption = (serial_num: number) => {
  localOptions.value = localOptions.value.filter(item => item.serial_num !== serial_num);
  localOptions.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
    }
  });
  emits("update:options", localOptions.value);
};

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
watch(localMin, (newMin) => {
  emits("update:minimum_option", Number(newMin));
});

watch(localMax, (newMax) => {
  emits("update:maximum_option", Number(newMax));
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
