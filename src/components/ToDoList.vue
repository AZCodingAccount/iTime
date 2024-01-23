<script setup>
import { IconEdit, IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import { ref } from "vue";
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
const tags = ["学习", "工作"];
</script>

<template>
  <a-list size="small" class="list" max-height="80vh">
    <a-list-item v-for="idx in 10" :key="idx" class="item">
      <a-list-item-meta title="今天学习Electron！！！今天学习Electron！！！">
        <template #description>
          <a-space>
            <a-tag
              v-for="(color, index) of colors"
              :key="index"
              :color="color"
              >{{ tags[index] }}</a-tag
            ></a-space
          >
          <span class="time">2024-01-23 9:00</span>
        </template>
        <!-- 表示待办是否完成的按钮 -->
        <template #avatar>
          <a-button
            style="
              width: 20px;
              height: 20px;
              background-color: white;
              border: 1px solid gray;
            "
            shape="circle"
          >
            <!-- <div v-if="isFinish">
              <template #icon>
                <icon-plus />
              </template>
            </div> -->
          </a-button>
        </template>
      </a-list-item-meta>

      <template #actions>
        <icon-edit class="action-icon" />
        <icon-delete class="action-icon" />
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
  margin-left: 20px;
  font-weight: 700;
}

.arco-list-small .arco-list-content-wrapper .arco-list-footer, .arco-list-small .arco-list-content-wrapper .arco-list-content > .arco-list-item, .arco-list-small .arco-list-content-wrapper .arco-list-content .arco-list-col > .arco-list-item, .arco-list-small .arco-list-content-wrapper .arco-list-content.arco-list-virtual .arco-list-item{
padding: 4px 10px;
}
</style>
