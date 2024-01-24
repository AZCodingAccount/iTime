import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useToDoStore = defineStore(
  "todoList",
  () => {
    const todoList = ref([]); // 待办列表，必须暴露出去，不然持久化不生效

    // 添加待办
    const addToDo = (id, content, tags, remindTime) => {
      let isFinish = false; // 待办
      todoList.value.unshift({ id, content, tags, isFinish, remindTime });
    };
    // 获取待办列表
    const getToDoList = () => {
      return todoList.value;
    };
    // 删除待办
    const deleteToDo = (id) => {
      todoList.value = todoList.value.filter(() => {
        if (todo.id === id) {
          return false;
        }
        return true;
      });
    };

    return { todoList, addToDo, getToDoList, deleteToDo };
  },
  { persist: true } // 持久化
);
