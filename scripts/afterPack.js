const path = require("path");
const fs = require("fs-extra");

module.exports = async (context) => {
  const unpackedDir = path.join(context.appOutDir, "locales");

  // 删除除 zh-CN.pak 之外的所有文件
  const files = await fs.readdir(unpackedDir);
  for (const file of files) {
    if (!file.endsWith("zh-CN.pak")) {
      await fs.remove(path.join(unpackedDir, file));
    }
  }

  // 删除特定的文件
  const filesToDelete = ["LICENSE.electron.txt", "LICENSES.chromium.html"];

  for (const fileName of filesToDelete) {
    const filePath = path.join(context.appOutDir, fileName);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    } 
  }
};
