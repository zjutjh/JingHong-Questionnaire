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
            class="rounded-none focus:outline-none dark:bg-customGray_more_shallow input input-bordered shadow-md w-350"
          >
          <div v-else>
            {{ localTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider" />
    <div class="flex-col p-5 overflow-y-auto h-160">
      <el-upload
        :file-list="[]" 
        list-type="picture-card" 
        :auto-upload="false" 
        :on-change="handleFileChange" 
        :on-preview="handlePreview" 
      >
        <!-- 上传按钮：有图片时显示预览，无则显示“+” -->
        <div v-if="!localImgUrl" class="flex flex-col items-center justify-center">
          <ElIcon class="mb-2"><Plus /></ElIcon>
          <span>上传图片</span>
        </div>
        
        <!-- 已上传的图片预览（带删除按钮） -->
        <div v-else class="relative">
         <img v-if="safeImg" :src="safeImg" alt="已上传图片" class="w-full h-full object-cover" />
          <div v-else>未上传图片</div>
          <button 
            class="absolute right-2 top-2 text-white bg-black/50 rounded-full p-1"
            @click.stop="handleDeleteImg" 
          >
            <ElIcon><CircleCloseFilled /></ElIcon>
          </button>
        </div>
      </el-upload>
    </div>

    <!-- <div class="divider" />
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-error  opacity-75 shadow-md dark:text-white" @click="$emit('on-click')">
        删除题目
      </button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch,computed } from "vue";
// 1. 引入图片上传API（之前项目中定义的saveImgAPI，用于调用后端接口）
import { saveImgAPI } from "@/apis";
// 2. 引入Element Plus的提示和上传相关类型
import { ElNotification, ElUpload } from "element-plus";
import type { UploadFile, UploadProps } from "element-plus";
// 3. 引入上传相关图标（可选，优化UI）
import { Plus, UploadFilled, CircleCloseFilled } from "@element-plus/icons-vue";

const props = defineProps<{
  isActive: boolean,
  serialNum: number,
  title?: string,
  optionChoose: boolean
  describe: string,
  unique: boolean,
  img?: string // 新增：接收父组件传递的已保存的图片URL
}>();

// 新增：给img设置默认值，避免undefined
const safeImg = computed(() => {
  // 检测是否是示例域名的无效URL
  if (props.img?.includes('example.com')) {
    return 'https://via.placeholder.com/300x200?text=后端图片URL配置错误';
  }
  return props.img || '';
});

// 新增：本地存储图片URL（优先用父组件传的初始值，无则为空）
const localImgUrl = ref<string>(props.img || "");

// 新增：更新emits，支持将图片URL同步给父组件
const emits = defineEmits([
  "update:unique", 
  "on-click", 
  "update:optionChoose", 
  "update:title", 
  "update:describe",
  "update:img" // 新增：同步图片URL的事件
]);

const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localDescribe = ref<string>(props.describe || "");
const localUnique = ref<boolean>(props.unique);

// 1. 选择文件后触发：手动调用上传接口
const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw; // 获取原始File对象
  if (!file) return;

  // 构造FormData（后端通常要求这种格式传文件）
  const formData = new FormData();
  formData.append("img", file); // "img"是后端接口要求的参数名（需和后端对齐）

  try {
    // 调用图片上传API
    const res = await saveImgAPI(formData);
    // 假设后端返回格式是 { data: "https://xxx.com/xxx.png" }（根据实际接口调整）
    localImgUrl.value = res.data; 
    // 同步图片URL给父组件（更新问卷schema）
    emits("update:img", localImgUrl.value);
    ElNotification.success("图片上传成功");
  } catch (err) {
    ElNotification.error("图片上传失败，请重试");
    console.error("上传错误：", err);
  }
};

// 2. 预览图片（点击已上传的图片时触发）
const handlePreview = () => {
  if (!localImgUrl.value) return;
  // 这里可以用Element Plus的ImagePreview组件实现大图预览（可选）
  // 示例：import { ElImageViewer } from 'element-plus'; 然后弹出预览框
  window.open(localImgUrl.value, "_blank"); // 简单方案：新窗口打开预览
};

// 3. 删除图片（点击删除按钮时触发）
const handleDeleteImg = () => {
  localImgUrl.value = ""; // 清空本地URL
  emits("update:img", ""); // 同步给父组件（清空schema中的img字段）
  ElNotification.info("图片已删除");
};

// 4. 监听父组件传递的img变化（比如编辑已有问卷时加载初始图片）
watch(() => props.img, (newImg) => {
  localImgUrl.value = newImg || "";
});

watch(() => props.title, (newTitle) => {
  localTitle.value = newTitle || "";
});

watch(() => props.optionChoose, (newOptionChoose) => {
  localOptionChoose.value = newOptionChoose;
});

watch(() => props.unique, (newUnique) => {
  localUnique.value = newUnique;
});

watch(() => props.describe, (newLocalDescribe) => {
  localDescribe.value = newLocalDescribe;
});

watch(localTitle, (newTitle) => {
  emits("update:title", newTitle);
});

watch(localOptionChoose, (newOptionChoose) => {
  emits("update:optionChoose", newOptionChoose);
});

watch(localDescribe, (newLocalDescribe) => {
  emits("update:describe", newLocalDescribe);
});

watch(localUnique, (newUnique) => {
  emits("update:unique", newUnique);
});

</script>

<style scoped>
</style>