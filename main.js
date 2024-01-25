// 导入模块，不能使用ES6的语法
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const WinState = require("electron-win-state").default;

// 创建一个窗口
const createWindow = () => {
  const winState = new WinState({
    defaultWidth: 2400,
    defaultHeight: 800,
  });
  const win = new BrowserWindow({
    ...WinState.winOptions,
    // 设置偏好
    webPreferences: {
      // 不安全，不建议使用
      // nodeIntegration: true, // 启用Node.js集成
      // contextIsolation: false, // 取消上下文隔离
      frame: false, // 无边框窗口
      titleBarStyle: "hidden",
      titleBarOverlay: true,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"), // 在预加载脚本中执行 Electron API
    },
  });
  //隐藏顶部菜单
  win.setMenu(null);

  //   win.loadFile("index.html");
  win.setSize(1100, 700); // 显式设置窗口大小，因为之前的大小被缓存了
  win.center(); // 使窗口居中
  win.loadURL("http://localhost:5173");
  // win.webContents.openDevTools(); // 打开开发者工具
  winState.manage(win); // 配置持久化
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 创建一个待办窗口
const addToDoToDesktop = (content) => {
  let newWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      // frame: false, // 无边框窗口
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload/customtodo.js"), // 在预加载脚本中执行 Electron API
    },
  });

  // 加载本地文件（测试过程中通过url访问）
  newWindow.loadURL("http://localhost:5173/customtodo");

  // 等待加载完成以后并且延迟1ms发送消息
  newWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      newWindow.webContents.send("load-html-content", content);
      console.log("Message sent after delay!");
    }, 1); // 延迟时间，以毫秒为单位
  });

  // newWindow.webContents.openDevTools(); // 打开开发者工具
  newWindow.setMenu(null); // 关闭菜单栏

  newWindow.on("closed", () => {
    console.log("关闭了~~~~");
    newWindow = null;
  });
};
// 创建右键菜单
ipcMain.on("show-context-menu", (event, type, content) => {
  const menuTemplate = [];
  // 根据类型添加不同的菜单项
  if (type === "customToDo") {
    menuTemplate.push({
      label: "删除待办",
      click: () => {
        console.log("操作1");
      },
    });
    menuTemplate.push({
      label: "将待办添加到桌面",
      click: () => {
        addToDoToDesktop(content);
        // dialog.showMessageBox({
        //   message: content,
        //   buttons: ["OK"],
        // });
      },
    });
  } else if (type === "type2") {
    menuTemplate.push({
      label: "操作A",
      click: () => {
        console.log("操作A");
      },
    });
    menuTemplate.push({
      label: "操作B",
      click: () => {
        console.log("操作B");
      },
    });
  }

  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  contextMenu.popup(BrowserWindow.fromWebContents(event.sender));
});
