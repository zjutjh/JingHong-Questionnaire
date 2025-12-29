<template>
  <div class="bg-base-100 mx-60 flex-1 flex justify-center">
    <div class="grid grid-cols-2 gap-80 my-60">
      <div
        v-for="(item, index) in currentSchema.quesConfig.questionList[0].options"
        :key="`${item.img} ${item.content} ${index}`"
        class="flex flex-col gap-12"
      >
        <el-upload
          v-show="false"
          :ref="(el: any) => setUploadRef(el, item.serialNum)"
          :show-file-list="false"
          :on-change="(file: any) => handleFileChange(file, item.serialNum)"
          :auto-upload="false"
        />

        <div
          class="avatar-uploader"
          @click="openFileDialog(item.serialNum)"
        >
          <img
            v-if="item.img"
            :key="item.img"
            :src="item.img"
            class="avatar"
          >
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </div>

        <div v-if="item.uploadStatus === 'uploading' || item.uploadStatus === 'error'" class="text-xs">
          <span v-if="item.uploadStatus === 'uploading'" class="text-blue-500">
            正在上传: {{ item.uploadingFileName }}
          </span>
          <span v-if="item.uploadStatus === 'error'" class="text-red-500">
            上传失败
          </span>
        </div>

        <div class="text-sm text-gray-600">
          文件: {{ item.displayFileName || '未选择文件' }}
        </div>

        <el-input v-model="item.content" />
        <el-button
          v-if="currentSchema.quesConfig.questionList[0].options.length > 1"
          type="danger"
          size="small"
          @click="removeOption(index)"
        >
          删除
        </el-button>
      </div>

      <div class="flex justify-center items-center h-332 border border-gray-300 cursor-pointer" @click="addOption">
        <el-icon size="30">
          <Plus />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRequest } from "vue-hooks-plus";
import { saveImgAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { useEditVoteStore } from "@/stores/voteEdit.ts";
import { ref } from "vue";

interface QuestionOption {
  serialNum: number;
  content: string;
  img: string;
  description: string;
  uploadStatus?: string;
  uploadingFileName?: string;
  displayFileName?: string;
}

const { schema } = useEditVoteStore();

interface SchemaType {
  quesConfig: {
    questionList: Array<{
      options: QuestionOption[]
    }>
  }
}

const currentSchema = schema as unknown as SchemaType;

const uploadRefs = ref<Record<number, any>>({});

const setUploadRef = (el: any, serialNum: number) => {
  if (el) {
    uploadRefs.value[serialNum] = el;
  }
};

const openFileDialog = (serialNum: number) => {
  const uploadInstance = uploadRefs.value[serialNum];
  if (uploadInstance?.$el) {
    const fileInput = uploadInstance.$el.querySelector("input[type=\"file\"]");
    fileInput?.click();
  }
};

const handleFileChange = (file: any, serialNum: number) => {
  if (!file) return;

  const currentOption = currentSchema.quesConfig.questionList[0].options.find(
    (item) => item.serialNum === serialNum
  ) as QuestionOption;

  if (!currentOption) return;

  const originalImg = currentOption.img || "";
  const originalFileName = currentOption.displayFileName || "未选择文件";

  currentOption.displayFileName = file.name;
  currentOption.uploadStatus = "uploading";
  currentOption.uploadingFileName = file.name;

  const formData = new FormData();
  formData.append("img", file.raw);

  useRequest(() => saveImgAPI(formData), {
    onSuccess(res: any) {
      if (res.code === 200) {

        currentOption.img = res.data;
        currentOption.uploadStatus = "success";
        currentOption.displayFileName = file.name;
        ElNotification.success("上传图片成功");
      } else {

        throw new Error(res.msg || "上传失败");
      }
    },
    onError(error: any) {

      currentOption.img = originalImg;
      currentOption.uploadStatus = "error";
      currentOption.displayFileName = originalFileName;
      ElNotification.error("上传图片失败：" + (error.message || error));
    }
  });
};

const addOption = () => {
  currentSchema.quesConfig.questionList[0].options.push({
    description: "",
    serialNum: currentSchema.quesConfig.questionList[0].options.length + 1,
    img: "",
    content: "",
    uploadStatus: "",
    uploadingFileName: "",
    displayFileName: "未选择文件"
  });
};

const removeOption = (index: number) => {
  currentSchema.quesConfig.questionList[0].options.splice(index, 1);
  currentSchema.quesConfig.questionList[0].options.forEach((item) => {
    if (item.serialNum > index + 1) {
      item.serialNum -= 1;
    }
  });
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 250px;
  height: 250px;
  display: block;
  object-fit: cover;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}
</style>

<style>
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 250px;
  text-align: center;
}
</style>