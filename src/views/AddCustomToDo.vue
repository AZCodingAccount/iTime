<script setup>
import { ref, nextTick, watch } from "vue";
import { useCustomToDoStore } from "@/stores/CustomToDoStore";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import { useRoute } from "vue-router";

// import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import { Message } from "@arco-design/web-vue";

import { onMounted } from "vue";
import { onUnmounted } from "vue";
// toolbar标题，hover提示文字
const titleConfig = [
  { Choice: ".ql-insertMetric", title: "跳转配置" },
  { Choice: ".ql-bold", title: "加粗" },
  { Choice: ".ql-italic", title: "斜体" },
  { Choice: ".ql-underline", title: "下划线" },
  { Choice: ".ql-header", title: "段落格式" },
  { Choice: ".ql-strike", title: "删除线" },
  { Choice: ".ql-blockquote", title: "块引用" },
  { Choice: ".ql-code", title: "插入代码" },
  { Choice: ".ql-code-block", title: "插入代码段" },
  { Choice: ".ql-font", title: "字体" },
  { Choice: ".ql-size", title: "字体大小" },
  { Choice: '.ql-list[value="ordered"]', title: "编号列表" },
  { Choice: '.ql-list[value="bullet"]', title: "项目列表" },
  { Choice: ".ql-direction", title: "文本方向" },
  { Choice: '.ql-header[value="1"]', title: "h1" },
  { Choice: '.ql-header[value="2"]', title: "h2" },
  { Choice: ".ql-align", title: "对齐方式" },
  { Choice: ".ql-color", title: "字体颜色" },
  { Choice: ".ql-background", title: "背景颜色" },
  { Choice: ".ql-image", title: "图像" },
  { Choice: ".ql-video", title: "视频" },
  { Choice: ".ql-link", title: "添加链接" },
  { Choice: ".ql-formula", title: "插入公式" },
  { Choice: ".ql-clean", title: "清除字体格式" },
  { Choice: '.ql-script[value="sub"]', title: "下标" },
  { Choice: '.ql-script[value="super"]', title: "上标" },
  { Choice: '.ql-indent[value="-1"]', title: "向左缩进" },
  { Choice: '.ql-indent[value="+1"]', title: "向右缩进" },
  { Choice: ".ql-header .ql-picker-label", title: "标题大小" },
  { Choice: '.ql-header .ql-picker-item[data-value="1"]', title: "标题一" },
  { Choice: '.ql-header .ql-picker-item[data-value="2"]', title: "标题二" },
  { Choice: '.ql-header .ql-picker-item[data-value="3"]', title: "标题三" },
  { Choice: '.ql-header .ql-picker-item[data-value="4"]', title: "标题四" },
  { Choice: '.ql-header .ql-picker-item[data-value="5"]', title: "标题五" },
  { Choice: '.ql-header .ql-picker-item[data-value="6"]', title: "标题六" },
  { Choice: ".ql-header .ql-picker-item:last-child", title: "标准" },
  { Choice: '.ql-size .ql-picker-item[data-value="small"]', title: "小号" },
  { Choice: '.ql-size .ql-picker-item[data-value="large"]', title: "大号" },
  { Choice: '.ql-size .ql-picker-item[data-value="huge"]', title: "超大号" },
  { Choice: ".ql-size .ql-picker-item:nth-child(2)", title: "标准" },
  { Choice: ".ql-align .ql-picker-item:first-child", title: "居左对齐" },
  {
    Choice: '.ql-align .ql-picker-item[data-value="center"]',
    title: "居中对齐",
  },
  {
    Choice: '.ql-align .ql-picker-item[data-value="right"]',
    title: "居右对齐",
  },
  {
    Choice: '.ql-align .ql-picker-item[data-value="justify"]',
    title: "两端对齐",
  },
];

// 定义一个函数批量添加属性
const initTitle = () => {
  for (let item of titleConfig) {
    let tip = document.querySelector(".ql-toolbar " + item.Choice);
    if (!tip) continue;
    tip.setAttribute("title", item.title);
  }
};

// 自定义编辑器的选项
const editorOptions = {
  placeholder:
    "请输入您的待办（支持常见快捷键如Ctrl+B加粗、-加空格无序列表、1.加空格有序列表。输入完毕使用Ctrl+Alt+Enter即可保存）",
  theme: "snow", //主题 snow/bubble，bubble好像不行
  modules: {
    // 工具栏
    toolbar: [
      ["bold", "italic", "underline", "strike"], // 加粗、斜体、下划线、删除线
      //   ['blockquote', 'code-block'],                     // 引用、代码块
      [{ header: 1 }, { header: 2 }], // 标题
      [{ list: "ordered" }, { list: "bullet" }], // 有序列表、无序列表
      [{ script: "sub" }, { script: "super" }], // 上标、下标
      //   [{ indent: "-1" }],                                 // 减少缩进、增加缩进
      //   [{ 'direction': 'rtl' }],                         // 文本方向
      // [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
      //   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // 标题大小
      //   [{ 'color': [] }, { 'background': [] }],          // 字体颜色、背景颜色
      //   [{ 'font': [] }],                                 // 字体
      //   [{ 'align': [] }],                                // 对齐方式
      //   ['clean'],                                        // 清除格式
    ],
  },
};

const content = ref(""); // 定义一个变量接收编辑器的属性
const todoTitle = ref(""); // TODO标题
const aRef = ref(null); // 输入框对象
const isModalVisible = ref(false); // 弹框的显隐
// 检查快捷键
const handleKeydown = (e) => {
  // 检查是否同时按下了 Ctrl、Alt 和 Enter 键
  if (e.ctrlKey && e.altKey && e.key === "Enter") {
    isModalVisible.value = true;
    // 等待DOM更新之后再渲染
    nextTick(() => {
      if (aRef.value) {
        aRef.value.focus();
      }
    });
  } else if (e.key === "Enter" && isModalVisible.value) {
    handleOk(); // 按了确认键并且模态框已经显示出来了
  }
};

const route = useRoute();
const customToDoStore = useCustomToDoStore();
const fakeId = ref(""); // 记录是不是跳转的
const quill = ref(null); // 编辑器对象
// 执行存储的逻辑
const handleOk = () => {
  // 这里判断是不是从编辑待办那里过来的，是的话要删除之前的待办
  if (fakeId.value !== "") {
    customToDoStore.removeToDo(fakeId.value);
  }
  const id = uuidv4(); // 生成一个随机id
  customToDoStore.addToDo(id, todoTitle.value, content.value, new Date());
  quill.value.setText("");
  todoTitle.value = "";
  // 告诉用户添加成功，清空文本框的内容
  Message.success("添加成功！");
  isModalVisible.value = false;
};
// 路由跳转需要的函数
const handleEdit = () => {
  if (route.query.id) {
    const id = route.query.id; // 取出id并赋值
    const todo = customToDoStore
      .getToDoList()
      .filter((item) => item.id === id)[0]; // 返回的是一个对象
    fakeId.value = id;
    content.value = todo.content;
    todoTitle.value = todo.title;
  }
};
// 挂载完成以后执行添加属性的函数
onMounted(() => {
  initTitle();
  handleEdit();
  window.addEventListener("keydown", handleKeydown);
  quill.value.focus()
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
<template>
  <!-- 编辑器 -->
  <QuillEditor
    style="height: 80vh"
    :options="editorOptions"
    v-model:content="content"
    content-type="html"
    ref="quill"
  />
  <!-- 确认弹框 -->
  <a-modal v-model:visible="isModalVisible" @ok="handleOk">
    <template #title> 补充自定义代办信息 </template>
    <a-input
      :style="{ width: '450px' }"
      placeholder="请输入当前代办标题"
      allow-clear
      v-model="todoTitle"
      ref="aRef"
    />
  </a-modal>
</template>
<style>
/* 自定义文本大小 */
.ql-container {
  font-size: 16px;
}
/* 自定义缩进样式 */
.ql-editor ol li:not(.ql-direction-rtl),
.ql-editor ul li:not(.ql-direction-rtl) {
  padding-left: 0px;
}
</style>
