import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UploadFile } from 'element-plus';

export const useImageStore = defineStore('image', () => {
    const fileList = ref<UploadFile[]>([]); // 用于存储上传的文件列表

    const addFile = (file: UploadFile) => {
        fileList.value.push(file); // 添加文件到列表
    };

    const clearFiles = () => {
        fileList.value = []; // 清空文件列表
    };


    return { fileList, addFile, clearFiles };
}, { persist: true });

