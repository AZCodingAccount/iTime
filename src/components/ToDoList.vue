<script setup>
import { IconEdit, IconDelete, IconCheck } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";
import { useToDoStore } from "@/stores/ToDo";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { Message } from "@arco-design/web-vue";

const toDoStore = useToDoStore();
const todoList = ref([]); // 代表所有待办
onMounted(() => {
  todoList.value = toDoStore.getToDoList();
});

// const isFinish = ref(true);
const colors = [
  "orangered",
  "orange",
  //   "gold",
  //   "lime",
  //   "green",
  //   "cyan",
  //   "blue",
  //   "arcoblue",
  //   "purple",
  //   "pinkpurple",
  //   "magenta",
  //   "gray",
];
// 待办完成
const handleFinish = (id) => {
  const index = todoList.value.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    // 创建一个新对象来替换旧对象
    const updatedTodo = {
      ...todoList.value[index],
      isFinish: !todoList.value[index].isFinish,
    };
    // 更新数组中的对象
    todoList.value.splice(index, 1, updatedTodo);
  }
};

// 监听双击鼠标事件
const handleDBLClick = (id) => {
  handleFinish(id);
};
// 删除待办
const handleDelete = (id) => {
  const index = todoList.value.findIndex((todo) => todo.id === id);
  if (index !== -1) {
    // 删除数组中的对象
    todoList.value.splice(index, 1);
  }
  Message.success("删除成功");
};
</script>

<template>
  <a-list size="small" class="list" max-height="80vh">
    <!-- 待办列表 -->
    <a-list-item
      @dblclick="handleDBLClick(todo.id)"
      v-for="todo in todoList"
      :key="todo.id"
      class="item"
    >
      <a-list-item-meta>
        <!-- 标题 -->
        <template #title>
          <div
            class="content"
            :style="
              todo.isFinish
                ? { 'text-decoration': 'line-through', color: 'gray' }
                : {}
            "
          >
            {{ todo.content }}
          </div>
        </template>
        <!-- 描述 -->
        <template #description>
          <a-space>
            <a-tag
              v-for="(tag, index) in todo.tags"
              :key="index"
              :color="colors[index % colors.length]"
              >{{ tag }}</a-tag
            ></a-space
          >
          <span class="time">{{
            dayjs(todo.remindTime).format("YYYY-MM-DD HH:mm")
          }}</span>
        </template>
        <!-- 表示待办是否完成的按钮 -->
        <template #avatar>
          <a-button
            style="
              width: 25px;
              height: 25px;
              background-color: white;
              border: 1px solid gray;
            "
            :style="
              todo.isFinish
                ? { backgroundColor: 'rgb(26, 125, 132)' }
                : { backgroundColor: 'white' }
            "
            @click="handleFinish(todo.id)"
            shape="circle"
          >
            <template #icon v-if="todo.isFinish" style="color: white">
              <icon-check />
            </template>
          </a-button>
        </template>
      </a-list-item-meta>

      <template #actions>
        <icon-delete
          class="action-icon"
          size="2em"
          @click="handleDelete(todo.id)"
        />
      </template>
    </a-list-item>
  </a-list>
</template>

<style scoped>
/* 美化列表 */
.list {
  margin: 0 10px;
}
.item {
  margin-bottom: 10px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 5px;
}

/* 去除上下的边框，必须穿透，不然因为scoped不会作用 */
>>> .arco-list-bordered {
  border: none;
}

.item:hover {
  /* 一些hover颜色，真的不会配色......  */
  background-color: #e0f7fa;
  cursor: pointer;
}

/* 初始状态下隐藏操作图标 */
.action-icon {
  display: none;
}

/* 鼠标悬停时显示操作图标 */
.item:hover .action-icon {
  display: inline;
}

.time {
  margin-left: 40px;
  margin-top: 20px;
  font-weight: 700;
  color: gray;
}

.arco-list-small .arco-list-content-wrapper .arco-list-footer,
.arco-list-small
  .arco-list-content-wrapper
  .arco-list-content
  > .arco-list-item,
.arco-list-small
  .arco-list-content-wrapper
  .arco-list-content
  .arco-list-col
  > .arco-list-item,
.arco-list-small
  .arco-list-content-wrapper
  .arco-list-content.arco-list-virtual
  .arco-list-item {
  padding: 4px 10px;
}
/* 自定义列表图标距离右边的间距 */
.arco-list-item-meta-avatar:not(:last-child) {
  margin-right: 10px;
}
/* 自定义描述跟上面待办的间距 */
.arco-list-item-meta-description {
  margin-top: 10px;
}
/* 自定义左边图标颜色 */
.arco-btn-size-medium svg {
  color: white;
}
</style>
