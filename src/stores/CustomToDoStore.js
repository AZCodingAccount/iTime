import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useCustomToDoStore = defineStore(
  "customTodoList",
  () => {
    const customTodoList = ref([]); // 待办列表，必须暴露出去，不然持久化不生效

    // 定义代办标题和内容（这个是自定义）
    // let title = ref(""); // 标题
    // let content = ref(""); // 内容
    // let createTime = ref(null); // 创建时间
    // 添加待办
    const addToDo = (title, content, createTime) => {
      customTodoList.value.unshift({ title, content, createTime });
    };
    // 获取待办列表
    const getToDoList = () => {
      return customTodoList.value;
    };

    return { customTodoList, addToDo, getToDoList };
  },
  { persist: true } // 持久化
);
