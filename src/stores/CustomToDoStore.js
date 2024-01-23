import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useCustomToDoStore = defineStore(
  "customTodoList",
  () => {
    // 定义代办标题和内容（这个是自定义）
    let title = ref(""); // 标题
    let content = ref(""); // 内容
    let createTime = ref(null); // 创建时间
    // 这里为了简便就不写get、set方法了，直接暴露出去变量

    return { title, content, createTime };
  },
  { persist: true } // 持久化
);
