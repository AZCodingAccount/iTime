const { contextBridge, ipcRenderer } = require("electron");
const { shell } = require("electron");


contextBridge.exposeInMainWorld("electron", {
  // 渲染进程向主进程发消息
  // 展示右键菜单
  showContextMenu: (type, id, title, content) =>
    ipcRenderer.send("show-context-menu", type, id, title, content),
  // 移除窗口，好像都可以使用这个方法
  removeWindow: () => {
    ipcRenderer.send("remove-window");
  },
  // 打开一个全屏的倒计时窗口
  // @params type 'f' 全屏|'a' 打开挂件
  openTimerWindow: (type) => {
    ipcRenderer.send("open-timer-window", type);
  },
  // 切换到主窗口
  switchToMainWindow: () => {
    ipcRenderer.send("switch-to-main-window");
  },
  // 关闭这个倒计时窗口
  closeTimerWindow: () => {
    ipcRenderer.send("close-timer-window");
  },
  // 打开一个番茄钟窗口
  // @params type 'f' 全屏|'a' 打开挂件
  openPomodoroWindow: (type) => {
    ipcRenderer.send("open-pomodoro-window", type);
  },
  // 关闭全屏番茄钟窗口
  closePomodoroWindow: () => {
    ipcRenderer.send("close-pomodoro-window");
  },
  // 退出窗口

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
});
