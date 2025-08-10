<template>
  <div class="relative cursor-default">
    <div class="overflowText text-slate-700 dark:text-white" @click="showModal">
      {{ text }}
    </div>
    <div class="overflowModal dark:text-white" @mouseout="hideModal">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>();

const showModal = (e: MouseEvent) => {
  console.log("debug:1");
  const et = (e.target as HTMLElement).nextElementSibling as HTMLElement;
  et.classList.add("dark:bg-black");
  et.style.display = "block";
};

const hideModal = (e: MouseEvent) => {
  const et = e.target as HTMLElement;
  et.style.display = "none";
};

</script>

<style>
.overflowText{
  max-width: 230px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.overflowModal {
  max-width: 500px;
  position: absolute;
  left: 0; top: 0;
  padding: 8px 16px;
  border: 2px solid rgb(176, 176, 176);
  border-radius: 3px;
  background-color: white;

  word-wrap: break-word;
  z-index: 5;
  display: none;
}
</style>