const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronCustomTodo", {
  // 参数是一个回调函数，用的话直接访问回调函数即可。主进程向渲染进程发消息。！！！不要用...args
  loadHtmlContent: (callback) => {
    ipcRenderer.on("load-html-content", (event, content) => {
      callback(content);
    });
  },
});
