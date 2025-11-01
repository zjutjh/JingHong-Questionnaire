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
            class="h-40 w-350 questionContent"
          >
          <div v-else>
            {{ localTitle }}
          </div>
        </div>
      </div>
    </div>
    <div class="divider" />
    <div class="flex-col p-5 overflow-y-auto h-60">
      <input class="input-bordered w-full questionContent" :placeholder="pal">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, ref, watch } from "vue";

const props = defineProps<{
  isActive: boolean,
  serialNum: number,
  title?: string,
  reg?: string
  describe: string,
  optionChoose: boolean
  unique: boolean
}>();
const emits = defineEmits(["update:unique", "on-click", "update:optionChoose", "update:title", "update:describe", "update:reg"]);
const localTitle = ref<string>(props.title || "");
const localOptionChoose = ref<boolean>(props.optionChoose);
const localUnique = ref<boolean>(props.unique);
const localDescribe = ref<string>(props.describe || "");
// 储存当前的自定义正则
const customiseReg = ref(props.reg || "");

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

watch(() => props.reg, (newReg) => {
  customiseReg.value = newReg;
});

watch(customiseReg, (newReg) => {
  emits("update:reg", newReg);
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

const pal = computed(() => {
  if (props.reg === "^1[3456789]\\d{9}$") return "电话";
  else if (props.reg === "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") return "邮箱";
  else if (props.reg === "^\\d{12}$") return "学号";
  else if (props.reg === "^.*$") return "无限制";
  else if (props.reg === "^[0-9]{1}$") {
    const num = props.reg[7];
    return num + "位数";
  } else {
    return "自定义";
  }
});

</script>

<style scoped>
.questionContent {
  @apply dark:bg-customGray_more_shallow input rounded-none focus:outline-none
}
</style>