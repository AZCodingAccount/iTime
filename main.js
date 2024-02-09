// 导入模块，不能使用ES6的语法
const {
  app,
  BrowserWindow,
  Menu,
  ipcMain,
  shell,
  globalShortcut,
  Notification,
  dialog,
  powerSaveBlocker,
} = require("electron");
const path = require("path");
const WinState = require("electron-win-state").default;
const fs = require("fs");
// 检查是否已经有一个实例运行
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  // 如果已经有一个实例在运行，关闭当前实例并退出
  app.quit();
}
let isDev = false;
async function checkIsDev() {
  const module = await import("electron-is-dev");
  isDev = module.default;
  // 全局捕获一下
  try {
    console.log(isDev);
    work();
  } catch (error) {
    dialog.showMessageBox({
      type: "error", // 对话框类型
      title: "未知错误", // 标题栏文本
      message: "未知错误，请联系开发者", // 主消息文本
      // detail: error.message, // 详细错误信息
      buttons: ["确定"], // 对话框按钮
    });
  }
}
checkIsDev();

const work = () => {
  if (process.platform === "win32") {
    app.setAppUserModelId(app.name);
  }
  // 创建一个窗口
  let win = null;
  let globalSettings = []; // 用户全局配置 position:0|voice:1

  // 创建主窗口
  const createWindow = () => {
    // 防止打开两个主窗口程序
    if (win != null) {
      return;
    }
    const winState = new WinState({});
    win = new BrowserWindow({
      ...WinState.winOptions,
      icon: "public/icons/icon.png", // 指定图标路径
      webPreferences: {
        // devTools: false,
        webSecurity: false, // 禁用 Web 安全策略
        nodeIntegration: true, // 启用集成
        backgroundThrottling: false, // 取消节流
        // 不安全，不建议使用
        // nodeIntegration: true, // 启用Node.js集成
        // contextIsolation: false, // 取消上下文隔离
        sandbox: false, // 取消沙箱模式
        preload: path.resolve(__dirname, "./preload"), // 在预加载脚本中执行 Electron API
      },
    });
    win.setSize(1100, 700); // 显式设置窗口大小，因为之前的大小被缓存了
    win.center(); // 使窗口居中
    win.setMenu(null); // 去掉窗口
    if (isDev) {
      win.loadURL("http://localhost:5173");
    } else {
      win.loadFile(path.join("dist", "index.html"));
    }
    win.webContents.openDevTools(); // 打开开发者工具
    winState.manage(win); // 配置持久化
    win.on("ready-to-show", () => {
      win.show();
    });
    // 配置所有外部url都使用浏览器打开
    win.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url); // 使用外部浏览器打开
      return { action: "deny" }; // 阻止 Electron 打开新窗口
    });
  };

  // 创建待办小挂件窗口
  const addToDoToDesktop = (title, content) => {
    let todoWindow = new BrowserWindow({
      width: 400,
      height: 300,
      transparent: true, // 透明
      frame: false, // 无边框窗口
      skipTaskbar: true, // 不在任务栏中显示
      webPreferences: {
        sandbox: false, // 取消沙箱模式
        backgroundThrottling: false, // 取消节流
        preload: path.resolve(__dirname, "./preload"), // 配置预加载脚本
      },
    });

    // 加载本地文件（测试过程中通过url访问）
    if (isDev) {
      todoWindow.loadURL("http://localhost:5173/#/desktop/customtodo");
    } else {
      // // 生产模式：加载打包后的 index.html 文件，并通过哈希路由导航到特定页面
      // todoWindow
      //   .loadFile(path.join(__dirname, "dist", "index.html"))
      //   .then(() => {
      //     // 导航到特定路由
      //     todoWindow.loadURL(
      //       `file://${path.join(
      //         __dirname,
      //         "dist",
      //         "index.html"
      //       )}#/desktop/customtodo`
      //     );
      //   });
      // 导航到特定路由
      todoWindow.loadURL(
        `file://${path.join(
          __dirname,
          "dist",
          "index.html"
        )}#/desktop/customtodo`
      );
    }

    // 等待加载完成以后并且延迟500ms发送消息
    // 自行测试时间，之前我的100ms就可以，但是电脑性能慢一点需要的时间更多，我索性就直接500ms了
    todoWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        todoWindow.webContents.send("load-html-content", title, content);
        console.log("Message sent after delay!");
      }, 500); // 延迟时间，以毫秒为单位
    });
    todoWindow.setAlwaysOnTop(globalSettings[0].todoP); // 动态配置是否置顶

    // todoWindow.webContents.openDevTools(); // 打开开发者工具

    todoWindow.on("closed", () => {
      todoWindow = null;
    });
    // 优雅的打开窗口
    todoWindow.once("ready-to-show", () => {
      todoWindow.show();
    });
    // hook这个右键消息，禁用窗口
    todoWindow.hookWindowMessage(278, function (e) {
      todoWindow.setEnabled(false); //窗口禁用
      setTimeout(() => {
        todoWindow.setEnabled(true); //窗口启用
      }, 1);
      return true;
    });
  };
  // 创建全屏计时器窗口
  const createTimerWindow = () => {
    let timerWindow = new BrowserWindow({
      frame: false,
      fullscreen: true,
      resizable: false, // 不允许重新设置尺寸
      skipTaskbar: true, // 不在任务栏中显示
      webPreferences: {
        sandbox: false, // 取消沙箱模式
        preload: path.resolve(__dirname, "./preload"), // 预加载脚本
        backgroundThrottling: false, // 取消节流
      },
    });
    if (isDev) {
      timerWindow.loadURL("http://localhost:5173/#/fullscreen/timer");
    } else {
      // timerWindow
      //   .loadFile(path.join(__dirname, "dist", "index.html"))
      //   .then(() => {
      //     timerWindow.loadURL(
      //       `file://${path.join(
      //         __dirname,
      //         "dist",
      //         "index.html"
      //       )}#/fullscreen/timer`
      //     );
      //   });
      timerWindow.loadURL(
        `file://${path.join(__dirname, "dist", "index.html")}#/fullscreen/timer`
      );
    }
    timerWindow.on("closed", () => {
      timerWindow = null;
    });
    // 优雅的打开窗口
    timerWindow.on("ready-to-show", () => {
      timerWindow.show();
    });
  };
  // 创建定时器小挂件窗口
  const createTimerWidgetWindow = () => {
    let timerWidgetWindow = new BrowserWindow({
      width: 354,
      height: 84,
      transparent: true, // 透明
      frame: false, // 无边框窗口
      skipTaskbar: true, // 不在任务栏中显示
      resizable: false, // 不允许重新设置尺寸
      webPreferences: {
        sandbox: false, // 取消沙箱模式
        preload: path.resolve(__dirname, "./preload"), // 配置预加载脚本
        backgroundThrottling: false, // 取消节流
      },
    });
    if (isDev) {
      timerWidgetWindow.loadURL("http://localhost:5173/#/desktop/timer");
    } else {
      // timerWidgetWindow
      //   .loadFile(path.join(__dirname, "dist", "index.html"))
      //   .then(() => {
      //     timerWidgetWindow.loadURL(
      //       `file://${path.join(
      //         __dirname,
      //         "dist",
      //         "index.html"
      //       )}#/desktop/timer`
      //     );
      //   });
      timerWidgetWindow.loadURL(
        `file://${path.join(__dirname, "dist", "index.html")}#/desktop/timer`
      );
    }
    timerWidgetWindow.on("closed", () => {
      timerWidgetWindow = null;
    });
    // 优雅的打开窗口
    timerWidgetWindow.once("ready-to-show", () => {
      timerWidgetWindow.show();
    });
    timerWidgetWindow.setAlwaysOnTop(globalSettings[0].timerP); // 动态设置窗口位置
    // hook这个右键消息，取消右键
    timerWidgetWindow.hookWindowMessage(278, function (e) {
      timerWidgetWindow.setEnabled(false); //窗口禁用
      setTimeout(() => {
        timerWidgetWindow.setEnabled(true); //窗口启用
      }, 1);
      return true;
    });
  };
  // 创建全屏番茄钟窗口
  const createPomodoroWindow = () => {
    let pomodoroWindow = new BrowserWindow({
      frame: false,
      fullscreen: true,
      resizable: false,
      skipTaskbar: true, // 不在任务栏中显示
      webPreferences: {
        // webSecurity: false, // 允许加载本地文件
        // allowFileAccess: true, // 允许访问文件
        sandbox: false, // 取消沙箱模式
        backgroundThrottling: false, // 取消节流
        preload: path.resolve(__dirname, "./preload"),
      },
    });
    if (isDev) {
      pomodoroWindow.loadURL("http://localhost:5173/#/fullscreen/pomodoro");
    } else {
      // pomodoroWindow
      //   .loadFile(path.join(__dirname, "dist", "index.html"))
      //   .then(() => {
      //     pomodoroWindow.loadURL(
      //       `file://${path.join(
      //         __dirname,
      //         "dist",
      //         "index.html"
      //       )}#/fullscreen/pomodoro`
      //     );
      //   });
      pomodoroWindow.loadURL(
        `file://${path.join(
          __dirname,
          "dist",
          "index.html"
        )}#/fullscreen/pomodoro`
      );
    } // 清除窗口状态
    pomodoroWindow.on("closed", () => {
      pomodoroWindow = null;
    });
    // 优雅的打开窗口
    pomodoroWindow.on("ready-to-show", () => {
      pomodoroWindow.show();
    });
  };
  // 创建番茄钟小挂件窗口
  const createPomodoroWidgetWindow = () => {
    let pomodoroWidgetWindow = new BrowserWindow({
      width: 374,
      height: 104,
      transparent: true, // 透明
      frame: false, // 无边框窗口
      resizable: false,
      skipTaskbar: true, // 不在任务栏中显示
      webPreferences: {
        backgroundThrottling: false, // 取消节流
        sandbox: false, // 取消沙箱模式
        preload: path.resolve(__dirname, "./preload"), // 配置预加载脚本
      },
    });
    if (isDev) {
      pomodoroWidgetWindow.loadURL("http://localhost:5173/#/desktop/pomodoro");
    } else {
      // pomodoroWidgetWindow
      //   .loadFile(path.join(__dirname, "dist", "index.html"))
      //   .then(() => {
      //     pomodoroWidgetWindow.loadURL(
      //       `file://${path.join(
      //         __dirname,
      //         "dist",
      //         "index.html"
      //       )}#/desktop/pomodoro`
      //     );
      //   });
      pomodoroWidgetWindow.loadURL(
        `file://${path.join(__dirname, "dist", "index.html")}#/desktop/pomodoro`
      );
    } // 清除窗口状态
    pomodoroWidgetWindow.on("closed", () => {
      pomodoroWidgetWindow = null;
    });
    pomodoroWidgetWindow.on("closed", () => {
      pomodoroWidgetWindow = null;
    });
    pomodoroWidgetWindow.setAlwaysOnTop(globalSettings[0].pomodoroP); // 动态设置窗口位置

    // pomodoroWidgetWindow.webContents.openDevTools();
    pomodoroWidgetWindow.once("ready-to-show", () => {
      pomodoroWidgetWindow.show();
    });
    // hook这个右键消息，禁用右键菜单
    pomodoroWidgetWindow.hookWindowMessage(278, function (e) {
      pomodoroWidgetWindow.setEnabled(false); //窗口禁用
      setTimeout(() => {
        pomodoroWidgetWindow.setEnabled(true); //窗口启用
      }, 1);
      return true;
    });
  };
  app.whenReady().then(() => {
    createWindow();

    // 阻止应用进入低功耗模式
    const id = powerSaveBlocker.start("prevent-app-suspension");

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  // 适配mac
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  // 获取当前操作系统
  ipcMain.handle("get-current-os", async (event) => {
    return process.platform;
  });
  // 删除待办
  const removeToDo = (id) => {
    win.webContents.send("remove-todo", id);
  };
  // 编辑待办
  const editToDo = (id) => {
    win.webContents.send("edit-todo", id);
  };
  let contextMenu = null;
  // 创建右键菜单
  ipcMain.on("show-context-menu", (event, type, id, title, content) => {
    const menuTemplate = [];
    // 根据类型添加不同的菜单项
    if (type === "customToDo") {
      menuTemplate.push({
        label: "添加待办挂件",
        click: () => {
          addToDoToDesktop(title, content);
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
          // 发送消息告诉本地存储里面的东西可以删除了
          removeToDo(id);
        },
      });
    }

    // 创建菜单
    contextMenu = Menu.buildFromTemplate(menuTemplate);

    contextMenu.popup(BrowserWindow.fromWebContents(event.sender)); // 弹出菜单
  });

  // 打开倒计时窗口 @params type |f:全屏|a: add widget
  ipcMain.on("open-timer-window", (event, type) => {
    if (type === "f") {
      createTimerWindow();
    } else if (type === "a") {
      // 添加小挂件
      createTimerWidgetWindow();
    }
  });
  // 打开番茄钟窗口 @params type |f:全屏|a: add widget
  ipcMain.on("open-pomodoro-window", (event, type) => {
    if (type === "f") {
      createPomodoroWindow();
    } else if (type === "a") {
      // 添加小挂件
      createPomodoroWidgetWindow();
    }
  });
  // 移除窗口
  ipcMain.on("remove-window", (event) => {
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
      const newFilePath = path.join(process.resourcesPath, pathDir, fileName);
      console.log(newFilePath);
      // 确保backgrounds目录存在
      if (!fs.existsSync(path.join(process.resourcesPath, pathDir))) {
        fs.mkdirSync(path.join(process.resourcesPath, pathDir), {
          recursive: true,
        });
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
  // 同步全局配置
  ipcMain.on("sync-else-setting", (event, settings) => {
    // 更新全局的值即可
    globalSettings = settings;
  });

  // 全局快捷键设置
  ipcMain.handle("shortcut-setting", async (event, keys) => {
    globalShortcutSettings = keys;
    let isOccupied = false; // 标记下方有没有被占用的快捷键
    if (keys) {
      // 挨个检查有没有注册过的快捷键
      if (
        !globalShortcut.register(keys.fPomodoro, () => {
          // 全屏番茄钟
          createPomodoroWindow();
        })
      ) {
        isOccupied = true;
      }
      if (
        !globalShortcut.register(keys.wPomodoro, () => {
          // 番茄钟挂件
          createPomodoroWidgetWindow();
        })
      ) {
        isOccupied = true;
      }
      if (
        !globalShortcut.register(keys.fTimer, () => {
          // 全屏计时器
          createTimerWindow();
        })
      ) {
        isOccupied = true;
      }
      if (
        !globalShortcut.register(keys.wTimer, () => {
          // 计时器挂件
          createTimerWidgetWindow();
        })
      ) {
        isOccupied = true;
      }
    }
    return isOccupied;
  });

  // 禁用所有快捷键
  ipcMain.on("disable-all-shortcut", () => {
    globalShortcut.unregisterAll();
  });

  // 调用原生api给用户通知
  // @params type |pomodoro-shortBreak|pomodoro-longBreak|pomodoro-work|timer-half|timer-full|todo
  ipcMain.on("notification-user", (event, type) => {
    // 也可以传进来title和body，考虑扩展性
    if (Notification.isSupported()) {
      let notification = null;
      switch (type) {
        case "pomodoro-shortBreak":
          notification = new Notification({
            title: "短休息时间到",
            body: "时间到了，短短的休息一会儿吧",
            silent: true, // 静音通知
          });
          break;
        case "pomodoro-longBreak":
          notification = new Notification({
            title: "长休息时间到",
            body: "你太棒了，接下来是长休息时间",
            silent: true, // 静音通知
          });
          break;
        case "pomodoro-work":
          notification = new Notification({
            title: "专注时间到",
            body: "好了，开始专注吧",
            silent: true, // 静音通知
          });
          break;
        case "timer-half":
          notification = new Notification({
            title: "倒计时过半",
            body: "时间已经过去一半了",
            silent: true, // 静音通知
          });
          break;
        case "timer-full":
          notification = new Notification({
            title: "倒计时结束",
            body: "倒计时结束了",
            silent: true, // 静音通知
          });
          break;
        case "todo":
          notification = new Notification({
            title: "待办提醒",
            body: "您现在有计划的安排，提醒您一下哈",
            silent: true, // 静音通知
          });
          break;
      }

      notification.show();
    }
  });
};
