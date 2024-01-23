<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import ToDoList from "@/components/ToDoList.vue";
import { ref } from "vue";
const addVisible = ref(false);
// 处理添加待办的逻辑
const handleAdd = () => {
  console.log("添加待办弹窗显示");
  addVisible.value = true;
};
</script>
<template>
  <!-- 待办列表 -->
  <ToDoList></ToDoList>
  <!-- 添加代办 -->
  <a-button
    type="primary"
    shape="circle"
    class="addToDo"
    status="success"
    size="large"
    @click="handleAdd"
  >
    <icon-plus />
  </a-button>
  <!-- 添加待办对话框 -->
  <a-modal
    v-model:visible="addVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    width="auto"
    draggable
  >
    <template #title> 添加待办 </template>
    <!-- 输入待办 -->
    <a-textarea
      :style="{ width: '450px' }"
      placeholder="请输入待办事项"
      allow-clear
    />
    <br />
    <br />
    <!-- 选择标签 -->
    <a-input-tag
      :default-value="['test']"
      :style="{ width: '320px' }"
      placeholder="请输入标签（可选）"
      allow-clear
    />
    <br />
    <br />
    <!-- 选择日期 -->
    <a-date-picker style="width: 200px; margin-right: 20px" position="top" />
    <a-time-picker format="HH:mm" style="width: 130px" />
  </a-modal>
</template>
<style scoped>
.addToDo {
  position: absolute;
  bottom: 1vh;
  right: 2vw;
}
</style>
