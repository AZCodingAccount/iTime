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
  // 移除监听器
  removeToDoListener: (callback1, callback2) => {
    ipcRenderer.removeListener("remove-todo", callback1);
    ipcRenderer.removeListener("edit-todo", callback2);
  },
});
