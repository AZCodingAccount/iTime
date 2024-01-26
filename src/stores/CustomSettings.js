import { defineStore } from "pinia";
import { ref } from "vue";
// 定义待办列表
export const useCustomSettingsStore = defineStore(
  "customSettings",
  () => {
    const customSettings = ref({}); // 自定义设置，必须暴露出去，不然持久化不生效
    // 有自定义快捷键、自定义番茄钟设置，自定义字体设置
    // 默认番茄钟设置
    customSettings.value["pomodoroSettings"] = {
      duration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
    };
    // 默认番茄钟背景图设置
    customSettings.value["f-pomodoro-bgi"] = "/timeBGI.jpg";
    customSettings.value["w-pomodoro-bgi"] = "none";
    // 重置番茄钟背景图
    const resetPomodoroBGI = () => {
      customSettings.value["f-pomodoro-bgi"] = "/timeBGI.jpg";
      customSettings.value["w-pomodoro-bgi"] = "none";
    };

    return { customSettings, resetPomodoroBGI };
  },
  { persist: true } // 持久化
);
