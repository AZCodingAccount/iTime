const { contextBridge, ipcRenderer, app } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // 渲染进程向主进程发消息
  // 展示右键菜单
  showContextMenu: (type, id, title, content) =>
    ipcRenderer.send("show-context-menu", type, id, title, content),
  // 移除窗口，都可以使用这个方法
  removeWindow: () => {
    ipcRenderer.send("remove-window");
  },
  // 打开一个全屏的倒计时窗口
  // @params type 'f' 全屏|'a' 打开挂件
  openTimerWindow: (type) => {
    ipcRenderer.send("open-timer-window", type);
  },
  // 打开一个番茄钟窗口
  // @params type 'f' 全屏|'a' 打开挂件
  openPomodoroWindow: (type) => {
    ipcRenderer.send("open-pomodoro-window", type);
  },
  // 退出窗口
  // 同步系统设置
  syncElseSetting: (customSettings) => {
    ipcRenderer.send("sync-else-setting", customSettings);
  },
  // 禁用所有快捷键
  disableAllShortcut: () => {
    ipcRenderer.send("disable-all-shortcut");
  },
  notificationUser: (type) => {
    ipcRenderer.send("notification-user", type);
  },

  // 主进程向渲染进程发消息
  // 参数是一个回调函数，用的话直接访问回调函数即可。
  // 接收参数
  loadHtmlContent: (callback) => {
    ipcRenderer.on("load-html-content", (event, title, content) => {
      callback(title, content);
    });
  },
  // 删除待办
  removeToDo: (callback) => {
    ipcRenderer.on("remove-todo", (event, id) => {
      console.log("删除待办", id);
      callback(id);
    });
  },
  // 编辑待办
  editToDo: (callback) => {
    ipcRenderer.on("edit-todo", (event, id) => {
      callback(id);
    });
  },

  // 双向通信
  // 保存文件
  saveFile: (type, originFilePath) =>
    ipcRenderer.invoke("save-file", type, originFilePath),
  // 快捷键设置
  shortcutSetting: (customSettingsForIpc) =>
    ipcRenderer.invoke("shortcut-setting", customSettingsForIpc),
  // 获取当前系统
  getCurrentOS: () => ipcRenderer.invoke("get-current-os"), // 直接在预加载进程也可以访问到

  // getAppPath: () => global.sharedObject.appPath, // 获取app路径
  getAppPath: () => process.resourcesPath,
});
