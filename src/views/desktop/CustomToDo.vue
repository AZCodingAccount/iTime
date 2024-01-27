<script setup>
import { Message } from "@arco-design/web-vue";
import { ref, onMounted } from "vue";
const todoTitle = ref(""); // 待办标题
const todoContent = ref(""); // 页面渲染的内容
// 使用preload暴露出来的函数
window.electron.loadHtmlContent((title, content) => {
  todoTitle.value = title;
  todoContent.value = content;
});
const draggable = ref(true);
const isShowContent = ref(true);
// 移除窗口，向主进程发一个请求
const removeWindow = () => {
  window.electron.removeWindow();
};
// 双击鼠标事件
const handleDBLClick = () => {
  // 隐藏下方内容
  isShowContent.value = !isShowContent.value;
};
</script>
<template>
  <div
    class="card"
    :class="draggable ? 'draggable' : ''"
    :style="isShowContent ? 'height: 100%' : 'height: 3em'"
  >
    <!-- 顶部 -->
    <div class="header">
      <div class="title" @dblclick="handleDBLClick">{{ todoTitle }}</div>
      <!-- 操作的按钮（固定，退出） -->
      <div class="buttons">
        <a-button
          v-if="draggable"
          @click="draggable = false"
          shape="circle"
          style="
            width: 1.5em;
            height: 1.5em;
            color: white;
            background-color: transparent;
            -webkit-app-region: no-drag;
          "
          ><icon-unlock size="1.5em"
        /></a-button>
        <a-button
          v-else
          @click="draggable = true"
          shape="circle"
          style="
            width: 1.5em;
            height: 1.5em;
            color: white;
            background-color: transparent;
            -webkit-app-region: no-drag;
            margin-left: 2vw;
          "
          ><icon-lock size="1.5em"
        /></a-button>
        <a-button
          @click="removeWindow"
          shape="circle"
          style="
            width: 1.5em;
            height: 1.5em;
            color: white;
            background-color: transparent;
            -webkit-app-region: no-drag;
            margin-left: 2vw;
          "
          ><icon-close size="1.5em"
        /></a-button>
      </div>
    </div>

    <!-- <a-divider  style="color: black"></a-divider> -->
    <hr v-if="isShowContent" />
    <!-- 内容部分 -->
    <div v-html="todoContent" class="content" v-if="isShowContent"></div>
  </div>
  <!-- <div class="card draggable">{{ todoContent }}</div> -->
</template>
<style scoped>
.slide-fade-enter-active,
/* 自定义卡片样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3em;
}
.buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1em;
}
.title {
  text-align: center;
  font-weight: 700;
  padding: 0 1em;
  -webkit-app-region: no-drag;
  cursor: pointer;
}
.card {
  width: 100%;
  height: 100%;
  background-color: rgba(23, 31, 29, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* 兼容旧版本的 Safari */
  color: white;
  font-size: 16px;
  border-radius: 10px;
  user-select: none;
}
.content {
  padding: 8px 1vw;
}
/* 可拖拽 */
.draggable {
  -webkit-app-region: drag;
}
/* 提取button公共的样式，会有hover效果具体不知道为啥 */
.buttonStyle {
  width: 1.5em;
  height: 1.5em;
  color: white;
  background-color: transparent;
  -webkit-app-region: no-drag;
}
</style>
