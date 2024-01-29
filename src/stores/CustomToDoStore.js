import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useCustomToDoStore = defineStore(
  "customTodoList",
  () => {
    const isFirst = ref(true);  // 用来辅助实现单例模式
    const customTodoList = ref([]); // 待办列表，必须暴露出去，不然持久化不生效

    // 定义代办标题和内容（这个是自定义）
    // let title = ref(""); // 标题
    // let content = ref(""); // 内容
    // let createTime = ref(null); // 创建时间
    // 添加待办
    const addToDo = (id, title, content, createTime) => {
      customTodoList.value.unshift({ id, title, content, createTime });
    };
    // 获取待办列表
    const getToDoList = () => {
      return customTodoList.value;
    };
    // 删除待办
    const removeToDo = (id) => {
      console.log("删除待办", id, customTodoList.value);
      customTodoList.value = customTodoList.value.filter(
        (item) => item.id !== id
      );
      console.log("删除后的列表", customTodoList.value);
    };

    return { isFirst, customTodoList, addToDo, getToDoList, removeToDo };
  },
  {
    persist: {
      paths: ["customTodoList"],
    },
  } // 持久化
);
