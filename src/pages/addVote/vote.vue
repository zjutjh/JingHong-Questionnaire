<template>
  <div class="bg-base-100 mx-60 flex-1 flex justify-center">
    <div class="grid grid-cols-2 gap-80 my-60">
      <div
        v-for="(item, index) in schema.quesConfig.questionList[0].options"
        :key="item.id"
        class="flex flex-col gap-12"
      >
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :before-upload="(file) => handleFileChange(file, item.serialNum)"
        >
          <img v-if="item.img" :src="item.img" class="avatar">
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <el-input v-model="item.content"/>
        <el-button
          v-if="schema.quesConfig.questionList[0].options.length > 1"
          type="danger"
          size="small"
          @click="removeOption(index), deleteQuesError"
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
import { useEditVoteStore } from "@/stores/voteEdit.ts";
import { useRequest } from "vue-hooks-plus";
import { saveImgAPI } from "@/apis";
import { ElNotification } from "element-plus";
import { useValidator } from "../DetailInfo/validate";

const { schema } = useEditVoteStore();
const { deleteQuesError } = useValidator();

const handleFileChange = async (file: File, serialNum: number) => {
  if (!file) return;

  const formData = new FormData();
  formData.append("img", file);

  useRequest(() => saveImgAPI(formData), {
    onSuccess(res) {
      const option = schema.quesConfig.questionList[0].options.find(
        (item) => item.serialNum === serialNum
      );
      if (option) {
        option.img = res.data; // 这里是后端返回的图片 URL
      }
      if (res.code === 200) {
        ElNotification.success("上传图片成功");
      } else {
        ElNotification.error(res.msg);
      }

    },
    onError(error) {
      ElNotification.error("上传图片失败：" + error);
    }
  });

  return false; // 阻止 `el-upload` 默认上传行为
};
// 添加选项
const addOption = () => {
  schema.quesConfig.questionList[0].options.push({
    description: "",
    serialNum: schema.quesConfig.questionList[0].options.length + 1,
    img: "",
    content: ""
  });
};

// 删除选项
const removeOption = (index: number) => {
  schema.quesConfig.questionList[0].options.splice(index, 1);
  schema.quesConfig.questionList[0].options.forEach((item) => {
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
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 250px;
  text-align: center;
}
</style>