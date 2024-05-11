<template>
  <div class="bg-gray-300 p-30 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transform duration-700 my-30">
    <div class="flex justify-between">
      <span class="flex items-center gap-20">
        <span>{{ serial_num }}</span><input type="text" placeholder="Question" class="input input-bordered shadow-md w-350" v-model="title"/>
      </span>
      <div class="flex-col justify-center items-center">
        <div class="flex gap-10 ">
          <span>选答</span><input type="checkbox" :name=-1  class="checkbox-sm"/>
        </div>
        <div class="flex gap-10 ">
          <span>唯一</span><input type="checkbox" :name=-1  class="checkbox-sm"/>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <span class="flex items-center justify-end gap-10"><span>有"其他"选项</span><input type="checkbox" :name=-1  class="checkbox-sm"/></span>
    <div class="flex-col p-5 overflow-y-auto h-180 mt-10">
      <div v-for="item in options" class="flex items-center gap-10 my-5"><input  type="radio" :name=item class="radio-sm my-5 " /> <input  type="text" :name=item class="input input-bordered h-40 shadow-md" placeholder="option" v-model="item.content"/><button class="btn btn-error btn-sm shadow-md" @click="deleteOption(item.serial_num)">删除</button></div>
    </div>
    <div class="divider"></div>
    <div class="mt-20 flex justify-evenly items-center ">
      <button class="btn btn-accent shadow-md" @click="addOption">新增选项</button>
      <button class="btn btn-error shadow-md" @click="emit('on-click')">删除题目</button>
    </div>
  </div>

</template>

<script setup lang="ts">
import {ref} from "vue";
import {modal, showModal} from "@/components";

const props = defineProps<{
      serial_num: number,
      title?: string,
      options?: {
        content: string;
        option_type: number;
        serial_num: number;
}[]}>()
const emit = defineEmits<{
  (e:'on-click'):void
}>()
const title = ref<string>(props.title? props.title : '')
const options = ref<{
  /**
   * 选项内容
   */
  content: string;
  /**
   * 选项类型，1文字2图片
   */
  option_type: number;
  /**
   * 选项序号
   */
  serial_num: number;
}[]>(props.options ? props.options : [{
  content: 'aaa',
  option_type: 1,
  serial_num: 1
}])

const addOption = () => {
  options.value.push({
    content: '',
    option_type: 1,
    serial_num: options.value.length + 1
  });
};

const deleteOption = (serial_num:number) => {
  options.value = options.value.filter(item => item.serial_num !== serial_num)
  options.value.forEach((item) => {
    if (item.serial_num > serial_num) {
      item.serial_num -= 1;
    }
  });
}
</script>


<style scoped>

</style>