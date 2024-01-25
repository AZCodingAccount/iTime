const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // 展示右键菜单
  showContextMenu: (type, title, content) =>
    ipcRenderer.send("show-context-menu", type, title, content),
  // 主进程向渲染进程发消息=>接收参数
  // 参数是一个回调函数，用的话直接访问回调函数即可。
  loadHtmlContent: (callback) => {
    ipcRenderer.on("load-html-content", (event, title, content) => {
      callback(title, content);
    });
  },
  // 移除窗口
  // @params type 'todo'|'timer'|'pomodoro' // 不需要
  removeWindow: () => {
    ipcRenderer.send("remove-window");
  },
});
