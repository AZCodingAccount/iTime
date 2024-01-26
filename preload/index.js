const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // 渲染进程向主进程发消息
  // 展示右键菜单
  showContextMenu: (type, id, title, content) =>
    ipcRenderer.send("show-context-menu", type, id, title, content),
  // 移除窗口
  // @params type 'todo'|'timer'|'pomodoro' // 不需要
  removeWindow: () => {
    ipcRenderer.send("remove-window");
  },
  // 打开一个全屏的倒计时窗口
  openTimerWindow: () => {
    ipcRenderer.send("open-timer-window");
  },
  // 切换到主窗口
  switchToMainWindow: () => {
    ipcRenderer.send("switch-to-main-window");
  },
  // 关闭这个倒计时窗口
  closeTimerWindow: () => {
    ipcRenderer.send("close-timer-window");
  },
  // 打开一个全屏的番茄钟窗口
  openPomodoroWindow: () => {
    ipcRenderer.send("open-pomodoro-window");
  },
  // 打开一个全屏的关于窗口

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
});
