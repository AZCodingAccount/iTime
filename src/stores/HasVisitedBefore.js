import { defineStore } from "pinia";
import { ref } from "vue";
// 记录用户访问过哪些页面
export const useHasVisitedBeforeStore = defineStore(
  "hasVisitedBefore",
  () => {
    const appToDo = ref(true);
    const appPomodoro = ref(true);
    const appTimer = ref(true);
    const fullScreenPomodoro = ref(true);
    const fullScreenTimer = ref(true);
    const widgetPomodoro = ref(true);
    const widgetTimer = ref(true);
    return {
      appToDo,
      appPomodoro,
      appTimer,
      fullScreenPomodoro,
      fullScreenTimer,
      widgetPomodoro,
      widgetTimer,
    };
  },
  { persist: true } // 持久化
);
