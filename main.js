// 导入模块，不能使用ES6的语法
const { app, BrowserWindow } = require("electron");
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
  winState.BrowserWindow(win); // 配置持久化
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
