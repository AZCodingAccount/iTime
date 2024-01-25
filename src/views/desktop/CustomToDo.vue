<script setup>
import { ref, onMounted } from "vue";
const todoContent = ref(""); // 页面渲染的内容
window.electronCustomTodo.loadHtmlContent((value) => {
  console.log("渲染进程", value);
  todoContent.value = value;
});
</script>
<template>
  <div v-html="todoContent"></div>
  <!-- {{ todoContent }} -->
</template>
<style scoped></style>
