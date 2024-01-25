// 导入模块，不能使用ES6的语法
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const WinState = require("electron-win-state").default;

// 创建一个窗口
let win = null;
const createWindow = () => {
  const winState = new WinState({
    defaultWidth: 2400,
    defaultHeight: 800,
  });
  win = new BrowserWindow({
    ...WinState.winOptions,
    // 设置偏好
    // frame: false, // 无边框窗口
    // titleBarStyle: "hidden",
    // titleBarOverlay: true,
    webPreferences: {
      // 不安全，不建议使用
      // nodeIntegration: true, // 启用Node.js集成
      // contextIsolation: false, // 取消上下文隔离
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
  win.webContents.openDevTools(); // 打开开发者工具
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
const addToDoToDesktop = (title, content) => {
  let todoWindow = new BrowserWindow({
    // width: 1200,
    // height: 800,
    width: 400,
    height: 300,
    transparent: true, // 透明
    frame: false, // 无边框窗口
    // show: false, // 窗口不可见
    // autoHideMenuBar: true, // 自动隐藏菜单栏
    // titleBarStyle: "hidden",
    // titleBarOverlay: true,

    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"), // 在预加载脚本中执行 Electron API
    },
  });

  // 加载本地文件（测试过程中通过url访问）
  todoWindow.loadURL("http://localhost:5173/customtodo");
  // todoWindow.loadURL("C:\\Users\\Albert han\\Desktop\\easyToDo\\src\\views\\test\\test.html");

  // 等待加载完成以后并且延迟1ms发送消息
  todoWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      todoWindow.webContents.send("load-html-content", title, content);
      console.log("Message sent after delay!");
    }, 100); // 延迟时间，以毫秒为单位
  });
  todoWindow.setAlwaysOnTop(true, "normal");

  // todoWindow.webContents.openDevTools(); // 打开开发者工具

  todoWindow.on("closed", () => {
    console.log("close~~~~");
    todoWindow = null;
  });
  todoWindow.once("ready-to-show", () => {
    todoWindow.show();
  });

  // winState.manage(todoWindow); // 配置持久化
};

// 删除待办
const removeToDo = (id) => {
  console.log("remove todo:", id);
  win.webContents.send("remove-todo", id);
};
// 编辑待办
const editToDo = (id) => {
  console.log("edit-todo", id);
  win.webContents.send("edit-todo", id);
};

// 移除窗口
ipcMain.on("remove-window", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});
let contextMenu = null;
// 创建右键菜单
ipcMain.on("show-context-menu", (event, type, id, title, content) => {
  const menuTemplate = [];
  // 根据类型添加不同的菜单项
  if (type === "customToDo") {
    menuTemplate.push({
      label: "将待办添加到桌面",
      click: () => {
        addToDoToDesktop(title, content);
        // dialog.showMessageBox({
        //   message: content,
        //   buttons: ["OK"],
        // });
      },
    });
    menuTemplate.push({
      label: "编辑待办",
      click: () => {
        // 直接把数据传给添加新待办那个组件过去就行了，顺便编辑成功把待办删除了
        editToDo(id);
      },
    });
    menuTemplate.push({
      label: "删除待办",
      click: () => {
        // console.log("click event", id);
        // 发送消息告诉本地存储里面的东西可以删除了
        removeToDo(id);
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

  // 如果菜单不存在，则创建它
  contextMenu = Menu.buildFromTemplate(menuTemplate);

  contextMenu.popup(BrowserWindow.fromWebContents(event.sender));
});
