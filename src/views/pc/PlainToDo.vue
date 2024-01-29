<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import ToDoList from "@/components/ToDoList.vue";
import { useToDoStore } from "@/stores/ToDo";
import { Message } from "@arco-design/web-vue";
import { v4 as uuidv4 } from "uuid";
import { onMounted, nextTick, computed, ref } from "vue";
// 用于判断是不是第一次进来这个页面
import { useHasVisitedBeforeStore } from "@/stores/HasVisitedBefore";
const hasVisitedBeforeStore = useHasVisitedBeforeStore();
const isFirst = computed({
  get: () => hasVisitedBeforeStore.appToDo,
  set: (newValue) => (hasVisitedBeforeStore.appToDo = newValue),
});

const addVisible = ref(false); // 添加待办弹窗的显隐
const todoContent = ref(""); // 待办内容
const todoTags = ref([]); // 待办标签
const todoDate = ref(""); // 待办日期
const todoTime = ref(""); // 待办时间
const toDoStore = useToDoStore();
// 添加待办
const handleAdd = () => {
  addVisible.value = true;
};
// 提交待办
const handleOk = () => {
  // 判断待办有没有设置时间和内容
  if (
    todoContent.value === "" ||
    todoDate.value === "" ||
    todoTime.value === ""
  ) {
    Message.error("填写的信息不足哦 (｡╯︵╰｡)");
    return;
  }
  let remindTime = new Date(todoDate.value + " " + todoTime.value);
  const id = uuidv4(); // 生成一个uuid
  // 把待办信息存储到本地存储
  toDoStore.addToDo(id, todoContent.value, todoTags.value, remindTime);
  Message.success("添加成功！");
};
// 挂载完成以后的初始化工作
onMounted(() => {
  if (isFirst.value) {
    Message.info("Ctrl+Alt+Enter可以新增待办 😎");
    isFirst.value = false;
  }
  document.addEventListener("keydown", handleKeydown);
});
const todoRef = ref(null); // 待办输入框的对象——用来聚焦
const tagRef = ref(null); // 标签输入框对象——用来聚焦
// 监听快捷键
const handleKeydown = (e) => {
  // 检查是否同时按下了 Ctrl 和 Alt 键
  if (e.ctrlKey && e.altKey && e.key === "Enter") {
    addVisible.value = true;

    // 等待 DOM 更新之后再设置焦点
    nextTick(() => {
      if (todoRef.value) {
        todoRef.value.focus();
      }
    });
  } else if (e.key === "Enter") {
    // 等待 DOM 更新之后再设置焦点
    nextTick(() => {
      if (tagRef.value) {
        tagRef.value.focus();
      }
    });
  }
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
    <icon-plus style="font-size: 1.5em" />
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
      ref="todoRef"
    />
    <br />
    <br />
    <!-- 选择标签 -->
    <a-input-tag
      :style="{ width: '320px' }"
      placeholder="请输入标签（可选）"
      v-model="todoTags"
      allow-clear
      ref="tagRef"
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
/* 添加待办的小图标 */
.addToDo {
  position: absolute;
  bottom: 2vh;
  right: 2vw;
  width: 3em;
  height: 3em;
}
</style>
