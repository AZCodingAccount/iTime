// 导入模块，不能使用ES6的语法
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const path = require("path");
const WinState = require("electron-win-state").default;
const fs = require("fs");

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
  // winState.manage(win); // 配置持久化
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
    // fullscreen:true,
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
  todoWindow.loadURL("http://localhost:5173/desktop/customtodo");
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
    todoWindow = null;
  });
  todoWindow.once("ready-to-show", () => {
    todoWindow.show();
  });
};
// 创建一个全屏计时器窗口
const createTimerWindow = () => {
  let timerWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    resizable: false,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"),
    },
  });
  timerWindow.loadURL("http://localhost:5173/fullscreen/countdown");
  timerWindow.on("closed", () => {
    timerWindow = null;
  });
  timerWindow.on("ready-to-show", () => {
    timerWindow.show();
  });
};
// 创建定时器小挂件窗口
const createTimerWidgetWindow = () => {
  let timerWidgetWindow = new BrowserWindow({
    width: 354,
    height: 84,
    // width:1000,
    // height:800,
    transparent: true, // 透明
    frame: false, // 无边框窗口
    skipTaskbar: true, // 不在任务栏中显示
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"),
    },
  });
  timerWidgetWindow.loadURL("http://localhost:5173/desktop/timer");
  timerWidgetWindow.on("closed", () => {
    timerWidgetWindow = null;
  });
  // timerWidgetWindow.webContents.openDevTools();
  timerWidgetWindow.once("ready-to-show", () => {
    timerWidgetWindow.show();
  });
  // hook这个消息，禁用窗口
  timerWidgetWindow.hookWindowMessage(278, function (e) {
    timerWidgetWindow.setEnabled(false); //窗口禁用
    setTimeout(() => {
      timerWidgetWindow.setEnabled(true); //窗口启用
    }, 1);
    return true;
  });
};
// 创建番茄钟窗口
const createPomodoroWindow = () => {
  let pomodoroWindow = new BrowserWindow({
    frame: false,
    fullscreen: true,
    resizable: false,
    webPreferences: {
      webSecurity: false, // 允许加载本地文件
      allowFileAccess: true, // 允许访问文件
      // nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"),
    },
  });
  pomodoroWindow.loadURL("http://localhost:5173/fullscreen/pomodoro");
  pomodoroWindow.on("closed", () => {
    pomodoroWindow = null;
  });
  // pomodoroWindow.webContents.openDevTools();
  pomodoroWindow.on("ready-to-show", () => {
    pomodoroWindow.show();
  });
};
const createPomodoroWidgetWindow = () => {
  let pomodoroWidgetWindow = new BrowserWindow({
    // width: 1000,
    // height: 800,
    width: 374,
    height: 104,
    transparent: true, // 透明
    frame: false, // 无边框窗口
    resizable: false,
    skipTaskbar: true, // 不在任务栏中显示
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      sandbox: false, // 取消沙箱模式
      preload: path.resolve(__dirname, "./preload"),
    },
  });
  pomodoroWidgetWindow.loadURL("http://localhost:5173/desktop/pomodoro");
  pomodoroWidgetWindow.on("closed", () => {
    pomodoroWidgetWindow = null;
  });
  pomodoroWidgetWindow.setAlwaysOnTop(true, "desktop");

  // pomodoroWidgetWindow.webContents.openDevTools();
  pomodoroWidgetWindow.once("ready-to-show", () => {
    pomodoroWidgetWindow.show();
  });
  // hook这个消息，禁用窗口
  pomodoroWidgetWindow.hookWindowMessage(278, function (e) {
    pomodoroWidgetWindow.setEnabled(false); //窗口禁用
    setTimeout(() => {
      pomodoroWidgetWindow.setEnabled(true); //窗口启用
    }, 1);
    return true;
  });
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
// 监听切换窗口事件
ipcMain.on("switch-to-main-window", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  // 弹出信息对话框
  // dialog.showMessageBox({
  //   type: "info",
  //   title: "信息",
  //   message: "正在切换到主窗口...",
  // });
  if (window) {
    window.close();
  }
  // if (win) {
  //   win.show();
  // }
});
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

// 打开倒计时窗口
ipcMain.on("open-timer-window", (event, type) => {
  if (type === "f") {
    createTimerWindow();
  } else if (type === "a") {
    // 添加小挂件
    createTimerWidgetWindow();
  }
});
// 打开番茄钟窗口
ipcMain.on("open-pomodoro-window", (event, type) => {
  if (type === "f") {
    createPomodoroWindow();
  } else if (type === "a") {
    // 添加小挂件
    createPomodoroWidgetWindow();
  }
});
// 关闭番茄钟窗口
ipcMain.on("close-pomodoro-window", (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  if (window) {
    window.close();
  }
});

// 保存文件
ipcMain.handle("save-file", (event, type, originFilePath) => {
  const pathDir = "backgrounds";

  if (type && originFilePath) {
    // 获取原始文件的扩展名
    const fileExtension = path.extname(originFilePath);
    const fileName = type + fileExtension; // 构造新文件名
    const newFilePath = path.join(__dirname, pathDir, fileName);
    console.log(newFilePath);
    // 确保 'backgrounds' 目录存在
    if (!fs.existsSync(path.join(__dirname, pathDir))) {
      fs.mkdirSync(path.join(__dirname, pathDir), { recursive: true });
    }

    return new Promise((resolve, reject) => {
      // 读取原始文件内容
      fs.readFile(originFilePath, (readErr, data) => {
        if (readErr) {
          reject(readErr);
        } else {
          // 将内容写入新文件
          fs.writeFile(newFilePath, data, (writeErr) => {
            if (writeErr) {
              reject(writeErr);
            } else {
              // 返回新文件的路径
              let pathName = "/" + pathDir + "/" + fileName;
              resolve(pathName);
            }
          });
        }
      });
    });
  }
  return null;
});
