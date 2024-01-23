<script setup>
// 这里是需要渲染所有的自定义代办
import { useCustomToDoStore } from "@/stores/CustomToDoStore";
import { onMounted ,ref} from "vue";
// 获取store
const customToDoStore = useCustomToDoStore();
const ToDoList = ref([]); // 存储空值，注意空值的逻辑
// 取出所有自定义待办的值并赋值给数组
onMounted(() => {
  ToDoList.value = customToDoStore.getToDoList();
});
</script>
<template>
  <a-collapse>
    <a-collapse-item
      v-for="todo in ToDoList" :key="item.content"
      header="todo.title"
      key="1"
    >
      {{ todo.content }}
    </a-collapse-item>
  </a-collapse>
</template>
<style scoped></style>
