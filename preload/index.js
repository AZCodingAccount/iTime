const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // 展示右键菜单
  showContextMenu: (type, content) =>
    ipcRenderer.send("show-context-menu", type, content),
});
