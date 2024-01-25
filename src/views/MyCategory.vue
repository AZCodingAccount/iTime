<script setup>
// 这里是需要渲染所有的自定义代办
import { useCustomToDoStore } from "@/stores/CustomToDoStore";
import { onMounted, ref } from "vue";
// 获取store
const customToDoStore = useCustomToDoStore();
const ToDoList = ref([]); // 存储空值，注意空值的逻辑
// 取出所有自定义待办的值并赋值给数组
onMounted(() => {
  ToDoList.value = customToDoStore.getToDoList();
  console.log(ToDoList.value);
});

// 格式化时间
const formattedDate = (dateString) => {
  // console.log(date,typeof(date));
  const date = new Date(dateString);
  // 将UTC时间调整为本地时间（上海时区，UTC+8）
  const offset = date.getTimezoneOffset() * 60000; // 获取本地时区偏移量（以毫秒为单位）
  const localDate = new Date(date.getTime() - offset); // 调整为本地时间

  return localDate
    .toISOString()
    .replace(/T/, " ") // 替换 T 为一个空格
    .replace(/\..+/, ""); // 删除小数点及其后面的部分
};

// 右键菜单
const onRightClick = (e, content) => {
  e.preventDefault();
  console.log(content);
  window.electron.showContextMenu("customToDo", content); // 调用主进程的方法
};
</script>
<template>
  <!-- 折叠面板 -->
  <a-list max-height="80vh" style="border: none">
    <a-collapse>
      <a-collapse-item
        @contextmenu="onRightClick($event, todo.content)"
        v-for="(todo, index) in ToDoList"
        :key="index"
        key="1"
      >
        <template #header>
          <div class="header">
            <div class="title">{{ todo.title }}</div>
            <div class="createTime">
              创建时间：{{ formattedDate(todo.createTime) }}
            </div>
          </div>
        </template>
        <div v-html="todo.content"></div>
      </a-collapse-item>
    </a-collapse>
  </a-list>
</template>
<style scoped>
/* 美化标题栏 */
.header {
  /* width: 100%; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}
.title {
  font-size: 18px;
}
.createTime {
  font-size: 14x;
  color: gray;
}
/* 修改组件库样式，实际开发慎用  */
>>> .arco-collapse-item-header-title {
  width: 100%;
}
/* 修改高度 */
>>> .arco-collapse-item-header-left {
  height: 60px;
}
/* 修改左边字体大小 */
>>> .arco-collapse-item .arco-collapse-item-expand-icon {
  font-size: 24px;
}
/* 去除列表边框 */
>>> .arco-list-bordered {
  border: none;
}
</style>
