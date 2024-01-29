<script setup>
// 这里是需要渲染所有的自定义代办
import { useCustomToDoStore } from "@/stores/CustomToDoStore";
import { Message } from "@arco-design/web-vue";
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const customToDoStore = useCustomToDoStore(); // 获取store
const ToDoList = computed(() => customToDoStore.getToDoList()); // 使用计算属性保持响应性
// 格式化时间（自己实现的—后面用了dayjs）
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
const onRightClick = (e, id, title, content) => {
  e.preventDefault(); // 阻止默认事件
  window.electron.showContextMenu("customToDo", id, title, content); // 调用主进程显示右键菜单
};
// 删除待办
const handleRemoveToDo = (id) => {
  customToDoStore.removeToDo(id);
  Message.success("删除成功🙂");
};
// 编辑待办
const handleEditToDo = (id) => {
  // 跳转并且把id给他带过去
  router.push({
    path: "/add/customtodo", // 使置顶路径
    query: {
      id: id,
    },
  });
};
// 挂载成功的初始化，这里用到了单例的思想，不要重复注册
onMounted(() => {
  if (customToDoStore.isFirst) {
    window.electron.editToDo(handleEditToDo);
    window.electron.removeToDo(handleRemoveToDo);
    customToDoStore.isFirst = false;
  }
});

</script>
<template>
  <!-- 列表，控制高度 -->
  <a-list max-height="90vh" style="border: none">
    <template v-if="ToDoList&&ToDoList.length>0">
      <!-- 折叠面板 -->
      <a-collapse>
        <a-collapse-item
          @contextmenu="onRightClick($event, todo.id, todo.title, todo.content)"
          v-for="todo in ToDoList"
          :key="todo.id"
          key="1"
        >
        <!-- 展示标题和创建时间 -->
          <template #header>
            <div class="header">
              <div class="title">{{ todo.title }}</div>
              <div class="createTime">
                创建时间：{{ formattedDate(todo.createTime) }}
              </div>
            </div>
          </template>
          <!-- 下面折叠的是内容 -->
          <div v-html="todo.content"></div>
        </a-collapse-item>
      </a-collapse>
    </template>
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
