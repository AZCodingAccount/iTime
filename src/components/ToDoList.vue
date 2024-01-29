<script setup>
import { IconDelete, IconCheck } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";
import { useToDoStore } from "@/stores/ToDo";
import { onMounted } from "vue";
import dayjs from "dayjs";
import { Message } from "@arco-design/web-vue";

const toDoStore = useToDoStore();
const todoList = ref([]); // 代表所有待办
// 挂载完成同步所有待办值
onMounted(() => {
  todoList.value = toDoStore.getToDoList();
});
// 标签颜色数组
const colors = [
  "orangered",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "arcoblue",
  "purple",
  "pinkpurple",
  "magenta",
  "gray",
];
// 完成待办
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

// 双击鼠标完成待办
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
  Message.success("删除成功🙂");
};
</script>

<template>
  <a-list size="small" class="list" max-height="90vh">
    <!-- 待办列表 -->
    <a-list-item
      @dblclick="handleDBLClick(todo.id)"
      v-for="todo in todoList"
      :key="todo.id"
      class="item"
    >
      <a-list-item-meta>
        <!-- 标题——待办内容 -->
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
        <!-- 描述——待办标签和时间 -->
        <template #description>
          <div
            class="des"
            style="display: flex; justify-content: space-between"
          >
            <div class="tags">
              <a-tag
                v-for="(tag, index) in todo.tags"
                :key="index"
                :color="colors[Math.floor(Math.random() * colors.length)]"
                style="margin-right: 0.5em"
                >{{ tag }}</a-tag
              >
            </div>
            <span class="time"
              ><svg
                t="1706511214574"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4465"
                width="1em"
                height="1em"
              >
                <path
                  d="M243.853723 123.518752c35.879922 0 68.705809 16.340086 90.922417 42.966082C387.902378 139.171181 448.150706 123.758285 512 123.758285c63.855283 0 124.1086 15.415891 177.243821 42.727547 22.234573-26.622004 55.090402-42.951111 90.986292-42.951111 66.520078 0 119.872873 55.441715 119.872873 123.159454 0 36.069552-15.257201 69.373505-40.453988 92.27777C885.628257 391.068195 900.241715 449.827431 900.241715 512c0 128.284444-62.21848 242.037271-158.127157 312.727205l40.040795 69.891493c8.768873 15.305107 3.469224 34.819992-11.834885 43.588865-15.152405 8.680047-34.430752 3.573021-43.322386-11.379774l-0.26648-0.456109-39.004818-68.082027C634.962838 885.117255 575.246472 900.241715 512 900.241715c-63.980039 0-124.346136-15.475774-177.557209-42.889232l-39.295251 67.873435c-8.837739 15.265185-28.376577 20.476008-43.641762 11.637271-15.112483-8.748912-20.370214-27.985341-11.89876-43.181661l0.261489-0.459103 40.361169-69.720827C185.263158 752.725832 123.758285 639.545887 123.758285 512c0-61.559766 14.327018-119.774066 39.830206-171.488062l0.810417-1.633809c-25.115945-22.905263-40.315259-56.172288-40.315259-92.19094 0-67.712749 53.295906-123.169435 119.770074-123.169435zM512 195.617934c-76.719158 0-147.059774 27.306667-201.833793 72.730947l-54.46662 58.119485C217.903407 378.590565 195.617934 442.692366 195.617934 512c0 174.732725 141.649341 316.382066 316.382066 316.382066s316.382066-141.649341 316.382066-316.382066c0-71.287766-23.577949-137.069287-63.360249-189.970963l-51.388632-53.84683C658.888109 222.857731 588.625341 195.617934 512 195.617934z m0 123.758284c17.63855 0 31.937622 14.299072 31.937622 31.937622v160.68616h131.74269c17.63855 0 31.937622 14.299072 31.937622 31.937622 0 17.63855-14.299072 31.937622-31.937622 31.937622H520.982456c-22.59986 0-40.920078-18.320218-40.920078-40.920078V351.31384c0-17.63855 14.299072-31.937622 31.937622-31.937622z m268.230113-123.981848c-10.798908 0-21.018947 3.866448-29.245879 10.615267a390.457388 390.457388 0 0 1 68.96131 69.524211l-0.009981 0.006986c5.269708-8.271844 8.307774-18.229396 8.307774-28.846659 0-28.634074-21.8114-51.299805-48.013224-51.299805z m-536.37639-0.016966c-26.133957 0-47.910425 22.659743-47.910425 51.309785 0 10.569357 3.002136 20.482994 8.213957 28.731883l-0.008982-0.007984a390.549209 390.549209 0 0 1 68.885458-69.418417c-8.207969-6.746823-18.406051-10.615267-29.180008-10.615267z"
                  fill="#979797"
                  p-id="4466"
                ></path></svg
              ><span class="font" style="margin-left: 0.5em">{{
                dayjs(todo.remindTime).format("MM-DD HH:mm")
              }}</span></span
            >
          </div>
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
                ? {
                    border: ' 1px solid white',
                    'background-color': 'gray',
                  }
                : { backgroundColor: 'white' }
            "
            @click="handleFinish(todo.id)"
            shape="circle"
          >
            <template #icon v-if="todo.isFinish">
              <icon-check style="color: white" />
            </template>
          </a-button>
        </template>
      </a-list-item-meta>

      <!-- 悬浮时的删除按钮 -->
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
/* 美化列表和列表项 */
.list {
  margin: 0 10px;
}
.item {
  margin-bottom: 10px;
  border: 1px solid var(--color-neutral-3);
  border-radius: 5px;
}

/* 去除列表上下的边框，必须穿透，不然因为scoped不会作用 */
>>> .arco-list-bordered {
  border: none;
}

.item:hover {
  /* hover颜色，真的不会配色......  */
  /* 非常淡的浅蓝色:f0f7ff|f7fbff 。更深一点的e6f7ff*/
  background-color: #e6f7ff;
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

/* 待办时间 */
.time {
  display: flex;
  align-items: center;
  color: gray;
  margin-right: 70%;
}
/* 微调组件间距 */
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
/*避免和flex布局冲突*/
>>> .arco-space {
  display: none;
}
/* 兼容自定义的flex布局 */
>>> .arco-list-item-meta-content {
  width: 100%;
}
</style>
