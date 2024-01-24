<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import ToDoList from "@/components/ToDoList.vue";
import { ref } from "vue";
import { useToDoStore } from "@/stores/ToDo";
import { Message } from "@arco-design/web-vue";
import { v4 as uuidv4 } from "uuid";

const addVisible = ref(false);
const todoContent = ref(""); // 待办内容
const todoTags = ref([]); // 待办标签
const todoDate = ref(""); // 待办日期
const todoTime = ref(""); // 待办时间
const toDoStore = useToDoStore();
// 处理添加待办的逻辑
const handleAdd = () => {
  // console.log("添加待办弹窗显示");
  addVisible.value = true;
};
const handleOk = () => {
  // console.log(
  //   todoContent.value,
  //   todoTags.value,
  //   todoDate.value,
  //   todoTime.value
  // );
  // console.log(todoDate.value + " " + todoTime.value);
  let remindTime = new Date(todoDate.value + " " + todoTime.value);
  const id = uuidv4();  // 生成一个uuid
  // 把待办信息存储到本地存储
  toDoStore.addToDo(id, todoContent.value, todoTags.value, remindTime);
  Message.success("添加成功！");
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
  <a-modal v-model:visible="addVisible" @ok="handleOk" width="auto" draggable>
    <template #title> 添加待办 </template>
    <!-- 输入待办 -->
    <a-textarea
      :style="{ width: '450px' }"
      placeholder="请输入待办事项"
      v-model="todoContent"
      allow-clear
    />
    <br />
    <br />
    <!-- 选择标签 -->
    <a-input-tag
      :style="{ width: '320px' }"
      placeholder="请输入标签（可选）"
      v-model="todoTags"
      allow-clear
    />
    <br />
    <br />
    <!-- 选择日期 -->
    <a-date-picker
      v-model="todoDate"
      style="width: 200px; margin-right: 20px"
      position="top"
    />
    <a-time-picker
      v-model="todoTime"
      format="HH:mm"
      position="top"
      style="width: 130px"
    />
  </a-modal>
</template>
<style scoped>
.addToDo {
  position: absolute;
  bottom: 1vh;
  right: 2vw;
}
</style>
