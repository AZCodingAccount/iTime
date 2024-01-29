import { defineStore } from "pinia";
import { ref, watchEffect } from "vue";
// 定义待办列表
export const useCustomSettingsStore = defineStore(
  "customSettings",
  () => {
    const customSettings = ref({}); // 自定义设置，必须暴露出去，不然持久化不生效
    // 有自定义快捷键、自定义番茄钟设置，自定义字体设置
    // 默认番茄钟设置
    // customSettings.value["pomodoroSettings"] = {
    //   duration: 25,
    //   shortBreakDuration: 5,
    //   longBreakDuration: 15,
    //   longBreakInterval: 4,
    // };
    // 测试设置
    customSettings.value["pomodoroSettings"] = {
      duration: 0.1,
      shortBreakDuration: 0.1,
      longBreakDuration: 0.1,
      longBreakInterval: 2,
    };
    // 默认番茄钟背景图设置
    customSettings.value["f-pomodoro-bgi"] = "/timeBGI.jpg";
    customSettings.value["w-pomodoro-bgi"] = "none";

    // 待办图标样式
    customSettings.value["todo-icons"] = {
      olIcon: "1.",
      ulIcon: "●",
    };

    // 默认快捷键设置
    customSettings.value["shortcutKeys"] = {
      fPomodoro: "Control+Alt+0",
      wPomodoro: "Control+Alt+1",
      fTimer: "Control+Alt+2",
      wTimer: "Control+Alt+3",
    };

    // 默认位置设置，是否在顶层
    customSettings.value["position"] = {
      pomodoroP: false,
      timerP: false,
      todoP: false,
    };

    // 提示语音设置
    customSettings.value["voice"] = {
      pomodoroV: "default",
      timerV: "default",
      todoV: "default",
      isClosedV: false,
    };
    // 防止用户快捷键输入空值
    watchEffect(() => {
      if (customSettings.value["shortcutKeys"]["fPomodoro"] === "") {
        customSettings.value["shortcutKeys"]["fPomodoro"] = "Control+Alt+0";
      }
      if (customSettings.value["shortcutKeys"]["wPomodoro"] === "") {
        customSettings.value["shortcutKeys"]["wPomodoro"] = "Control+Alt+1";
      }
      if (customSettings.value["shortcutKeys"]["fTimer"] === "") {
        customSettings.value["shortcutKeys"]["fTimer"] = "Control+Alt+2";
      }
      if (customSettings.value["shortcutKeys"]["wTimer"] === "") {
        customSettings.value["shortcutKeys"]["wTimer"] = "Control+Alt+3";
      }
    });
    // 重置番茄钟背景图
    const resetPomodoroBGI = () => {
      customSettings.value["f-pomodoro-bgi"] = "/timeBGI.jpg";
      customSettings.value["w-pomodoro-bgi"] = "none";
    };
    // 重置待办图标
    const resetForm = () => {
      customSettings.value["todo-icons"] = {
        olIcon: "1.",
        ulIcon: "●",
      };
    };
    // 重置快捷键设置
    const resetShortcutKeys = () => {
      customSettings.value["shortcutKeys"] = {
        fPomodoro: "Control+Alt+0",
        wPomodoro: "Control+Alt+1",
        fTimer: "Control+Alt+2",
        wTimer: "Control+Alt+3",
      };
    };
    // 重置位置设置
    const resetPositionSettings = () => {
      customSettings.value["position"] = {
        pomodoroP: false,
        timerP: false,
        todoP: false,
      };
    };
    // 重置语音提示设置
    const resetVoiceSettings = () => {
      customSettings.value["voice"] = {
        pomodoroV: "default",
        timerV: "default",
        todoV: "default",
        isClosedV: false,
      };
    };
    return {
      customSettings,
      resetPomodoroBGI,
      resetForm,
      resetShortcutKeys,
      resetPositionSettings,
      resetVoiceSettings,
    };
  },
  { persist: true } // 持久化
);
