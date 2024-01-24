import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useCustomSettingsStore = defineStore(
  "customSettings",
  () => {
    const customSettings = ref({}); // 自定义设置，必须暴露出去，不然持久化不生效
    // 有自定义快捷键、自定义番茄钟设置，自定义字体设置
    // 默认番茄钟设置
    customSettings.value['pomodoroSettings'] = {
      duration: 10,
      shortBreakDuration: 0.1,
      longBreakDuration: 0.1,
      longBreakInterval: 2,
    };
   
    return { customSettings };
  },
  { persist: true } // 持久化
);
