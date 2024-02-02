const fs = require("fs");
const path = require("path");
// 主打就是一点体力活都不干
module.exports = async function (params) {
  // 读取版本号
  const packageJson = require("../package.json");
  const version = packageJson.version;
  let artifact = params.file;
  let originFile = artifact;

  const ext = path.extname(artifact);
  // 处理版本号前缀，注意空格
  artifact = artifact.replace(` ${version}`, `-${version}`);
  let newName;

  if (ext === ".exe" && !artifact.includes("Setup")) {
    // 不用安装的程序
    newName = artifact.replace(/\.exe$/, "-windows-no-installer.exe");
  } else if (ext === ".exe") {
    // 常规安装包
    newName = artifact.replace(
      ` Setup-${version}.exe`,
      `-${version}-windows-installer.exe`
    );
  } else {
    newName = artifact;
  }

  // 重命名
  if (newName) {
    fs.renameSync(originFile, newName);
  }
};
