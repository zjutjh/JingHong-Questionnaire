<template>
  <div class="rounded mx-5 mt-30">
    <div class="flex justify-between">
      <div class="flex-col">
        <div class="flex items-center gap-20">
          <span class="lg:text-xl md:text-md">{{ serial_num }}</span>
          <span class="lg:text-xl md:text-md flex gap-5 items-center">
            {{ title }}
            <el-tag type="primary" class="ml-5">图片</el-tag>
            <el-tag type="warning" v-if="!required">选答</el-tag>
            <el-tag type="danger" v-if="unique">唯一</el-tag>
          </span>
        </div>
        <div class="flex items-center mt-15 ml-10">
          <pre class="text-sm text-gray-500 break-all">{{ describe }}</pre>
        </div>
      </div>
      <div class="flex-col justify-center items-center"></div>
    </div>
    <div class="divider my-5"></div>
    <div class="flex-col p-5 h-auto">
      <!-- 开发环境下 action 前面加/api-->
      <el-upload
          action='/api/user/upload/img'
          list-type="picture-card"
          :auto-upload="true"
          :on-success="handleUploadSuccess"
          :on-remove="handleRemove"
          :file-list="fileList"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          name="img"
      >
        <el-icon ><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="props.answer"  />
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file as UploadFile)"
          >
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file as UploadFile)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="props.answer" alt="Preview Image" />
      </el-dialog>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import type { UploadFile } from 'element-plus'
import {ElMessage} from "element-plus";
import { Delete,  Plus, ZoomIn } from '@element-plus/icons-vue'
import { useMainStore } from '@/stores';

const imageStore = useMainStore().useImageStore();

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const fileList = ref<UploadFile[]>([])
fileList.value = imageStore.fileList;

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleRemove = (uploadFile: UploadFile) => {
  imageStore.clearFiles(); // 清空 Pinia 文件列表
  fileList.value = []; // 清空本地列表
};


// 上传成功回调
const handleUploadSuccess = (response: any, file: UploadFile) => {
  if(response.code == 200) {
    ElMessage.success('上传成功！')
    fileList.value = [{ ...file, url: response.data }]
    const uploadedFile: UploadFile = { ...file, url: response.data };
    imageStore.addFile(uploadedFile); // 将文件推入 Pinia 存储
    localAnswer.value = response.data
  } else {
    ElMessage.error(response.msg)
  }

}


const props = defineProps({
  serial_num: Number,
  title: String,
  required: Boolean,
  unique: Boolean,
  describe: String,
  answer: String,
});

onMounted(()=>{
  console.log(props.answer)
})

const handleExceed = () => {
  ElMessage.warning('最多只能上传一张图片！');
}

  const beforeUpload = (file: UploadFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      ElMessage.error('上传的文件必须是图片!');
    }
    return isImage; // 如果返回 false，则会取消上传
  };

const emits = defineEmits(['update:answer']);

const localAnswer = ref(props.answer);

watch(localAnswer, (newAnswer) => {
  console.log(newAnswer)
  emits('update:answer', newAnswer);
});

</script>

<style scoped>
</style>



<style scoped>

</style>