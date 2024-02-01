# iTime

## 介绍 📘

​ iTime🕰️ 是一款基于**vue3**、**arco design**、**electron**开发的桌面端效率应用，slogan 是`让每一秒都刚刚好`，意为提高您的效率，帮助您充分利用自己的每一秒。项目功能模块有**待办模块**、**倒计时模块**、**番茄钟模块**、**自定义设置模块**。

## 代码仓库 🌟

- Gitee：https://gitee.com/AZCodingAccount/iTime
- GitHub：https://github.com/AZCodingAccount/iTime

## 快速开始 🚀

- **拉取项目** (您需要先安装 Git)

```bash
# Gitee
git pull https://gitee.com/AZCodingAccount/iTime.git
# GitHub
git pull https://github.com/AZCodingAccount/iTime.git
```

- 运行项目

```bash
cd 拉取项目目录
pnpm i	    # 安装依赖
pnpm dev    # 运行vue程序
pnpm start	# 运行electron桌面程序
```

ℹ️ 在开发环境下，您需要设置相应的图片和语音路径，默认路径为生产环境下的

## 项目技术应用 🛠️

1. `Vue3`+`Electron`为主要开发技术
2. 采用`aro design`组件库并进行一定程度定制
3. 数据持久化采用`pinia`
4. 引入`quill`富文本编辑器
5. 第三方包
   1. `uuid`生成 TODO 随机 id
   2. `dayjs`格式化时间
   3. `electron-is-dev`判断开发或生产环境
   4. `electron-win-state`持久化窗口状态
   5. `pinia-plugin-persistedstate`持久化 pinia
   6. [`unplugin-vue-components`](https://github.com/antfu/unplugin-vue-components)+ [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) 按需引入组件
6. 打包使用`electron-builder`

## 未来 🔮

- 🪄 自定义外观
- 📸 集成截图和 OCR 功能
- 🤖 集成 ChatGPT

## 贡献 🤝

项目欢迎任何形式的贡献

- 提出[issue](https://github.com/AZCodingAccount/iTime/issues)报告 bug 或要求新功能
- 提交[PR](https://github.com/AZCodingAccount/iTime/pulls)帮助完善应用
